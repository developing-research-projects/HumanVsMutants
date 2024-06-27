const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const multer = require('multer');
const fs = require('fs');
const readline = require('readline');

const upload = multer({ dest: 'uploads/' });

router.get('/remaining', async (req, res) => {
  const remaining = await prisma.$queryRaw`
    SELECT SUM(3 - label_count) AS tasks FROM Mutant WHERE label_count < 3;
  `;
  res.json({remaining: Number(remaining[0].tasks) });
});

router.get('/:id', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
  const { id } = req.params;

  const mutant = await prisma.mutant.findUnique({
    where: { mutant_id: Number(id) },
  });
  res.json(mutant);
});

router.get('/', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
  const { searchString, skip, take, orderBy } = req.query;

  const or = searchString
    ? {
      OR: [
        { name: { contains: searchString } },
        { address: { contains: searchString } },
        { source: { contains: searchString } },
      ],
    }
    : {};

  const mutants = await prisma.mutant.findMany({
    where: {
      ...or,
    },
    take: Number(take) || undefined,
    skip: Number(skip) || undefined,
    orderBy: {
      name: orderBy || undefined,
    },
  });

  res.json(mutants);
});

router.post('/upload', authenticateToken, authorizeRoles(['admin']), upload.single('mutantfile'), async (req, res) => {
  const filePath = req.file.path;

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const mutants = [];

  for await (const line of rl) {
    if (line.trim()) {
      const name = line.trim();
      const address = `https://github.com/Intelligent-CAT-Lab/UIUCPlus/compare/461dfea3626452643d4138fef934535979fe87e9..${name}?diff=split&w=1`;
      const tool = name.split('-')[0];
      const project = name.split('.')[1];

      mutants.push({ name, address, tool, project });
    }
  }

  // Batch insert mutants
  try {
    const createdMutants = await prisma.mutant.createMany({
      data: mutants,
    });
    res.status(201).json({ count: createdMutants.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while uploading mutants' });
  } finally {
    // Clean up the uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete uploaded file:', err);
    });
  }
});

module.exports = router;
