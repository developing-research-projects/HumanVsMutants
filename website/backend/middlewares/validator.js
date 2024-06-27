const { body, validationResult } = require('express-validator');

const submitTaskValidationRules = () => {
    return [
        body('mutant_id').isInt().withMessage('mutant_id must be an integer'),
        body('time_taken')
            .isInt({ min: 1 }).withMessage('time_taken must be an integer greater than or equal to 1'),
        body('decision').isIn(['YES', 'NO', 'MAYBE']).withMessage('decision must be one of YES, NO, or MAYBE'),
        body('explanation').isString().withMessage('explanation must be a string'),
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    submitTaskValidationRules,
    validate,
};
