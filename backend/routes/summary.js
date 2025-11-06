import express from 'express';
import { createSummary, getSummaries, getSummaryById, updateSummary, deleteSummary, regenerateSummary } from '../controllers/summary.js';
import { verifyToken } from '../middlewares/auth.js';
import { aiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();


// Create a new summary (with AI rate limiting)
router.post('/', verifyToken, aiLimiter, createSummary);

// Get all summaries
router.get('/', verifyToken, getSummaries);

//summary by ID
router.get('/:id', verifyToken, getSummaryById);
// Update
// router.put('/:id',verifyToken , updateSummary);
// Regenerate summary (with AI rate limiting)
router.post('/:id/regenerate', verifyToken, aiLimiter, regenerateSummary);
// Delete
router.delete('/:id', verifyToken, deleteSummary);

export default router;

