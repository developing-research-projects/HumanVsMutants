const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const { submitTaskValidationRules, validate } = require('../middlewares/validator');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticateToken, authorizeRoles(['admin']), (req, res) => {
  res.json({
    'users': [
      { name: 'Tom', mutants: 9 },
      { name: 'James', mutants: 7 },
      { name: 'Jane', mutants: 5 }
    ]
  });
});

router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

router.post('/request', authenticateToken, authorizeRoles(['student']), async (req, res) => {
  const userId = req.user.id;
  const maxLabelCount = parseInt(process.env.MAX_LABEL_COUNT || "3");

  try {
    // Step 1: Check if there is a row in the User_Mutant table with status "ASSIGNED"
    const existingAssignment = await prisma.user_Mutant.findFirst({
      where: {
        user_id: userId,
        status: "ASSIGNED"
      }
    });

    if (existingAssignment) {
      return res.status(400).json({ error: "You already have an assigned task." });
    }

    // Step 2: Fetch potential mutant
    const potentialMutants = await prisma.$queryRaw`
      SELECT m.*
      FROM Mutant m
      LEFT JOIN User_Mutant um ON m.mutant_id = um.mutant_id AND um.user_id = ${userId} AND um.status = 'COMPLETED'
      WHERE m.label_count < ${maxLabelCount}
      AND um.user_id IS NULL
      ORDER BY RANDOM()
      LIMIT 1;
    `;

    if (potentialMutants.length === 0) {
      return res.status(404).json({ message: "No task available at the moment." });
    }

    const selectedMutant = potentialMutants[0];

    await prisma.$transaction(async (prisma) => {
      // Step 3: Assign the task to the user
      await prisma.user_Mutant.create({
        data: {
          user_id: userId,
          mutant_id: selectedMutant.mutant_id,
          status: "ASSIGNED",
        }
      });

      // Step 4: Increase the label_count of the mutant by 1
      await prisma.mutant.update({
        where: { mutant_id: selectedMutant.mutant_id },
        data: { label_count: { increment: 1 } }
      });
    });

    res.status(201).json({ message: "Task assigned successfully", mutant: selectedMutant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while assigning the task." });
  }
});

router.post('/submit', authenticateToken, authorizeRoles(['student']), submitTaskValidationRules(), validate, async (req, res) => {
  const { mutant_id, time_taken, decision, explanation } = req.body;
  const user_id = req.user.id; // Infer user_id from the logged-in user

  try {
    // Step 1: Check if the user has any ASSIGNED task
    const existingAssignment = await prisma.user_Mutant.findFirst({
      where: {
        user_id: user_id,
        mutant_id: mutant_id,
        status: "ASSIGNED"
      }
    });

    if (!existingAssignment) {
      return res.status(404).json({ error: "No assigned task found for the given user and mutant." });
    }

    // Step 2: Update the record
    await prisma.user_Mutant.update({
      where: {
        user_id_mutant_id: {
          user_id: user_id,
          mutant_id: mutant_id
        }
      },
      data: {
        time_taken: time_taken,
        decision: decision,
        explanation: explanation,
        status: "SUBMITTED"
      }
    });

    res.status(200).json({ message: "Task submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while submitting the task." });
  }
});

router.get('/tasks', authenticateToken, authorizeRoles(['student']), async (req, res) => {
  const userId = req.user.id;

  try {
    const tasks = await prisma.$queryRaw`
      SELECT 
        um.mutant_id, 
        m.name as mutant_name, 
        m.address, 
        um.status
      FROM 
        User_Mutant um
      JOIN 
        Mutant m 
      ON 
        um.mutant_id = m.mutant_id
      WHERE 
        um.user_id = ${userId}
      ORDER BY 
        um.created_at DESC
    `;

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching the tasks." });
  }
});

module.exports = router;
