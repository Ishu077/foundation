import express from 'express';
import { createSummary, getSummaries, getSummaryById, updateSummary, deleteSummary, regenerateSummary } from '../controllers/summary.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();


// Create a new summary
router.post('/',verifyToken ,createSummary);

// Get all summaries
router.get('/',verifyToken, getSummaries);

//summary by ID
router.get('/:id',verifyToken , getSummaryById);
// Update
// router.put('/:id',verifyToken , updateSummary);
// Regenerate summary
router.post('/:id/regenerate',verifyToken , regenerateSummary);
// Delete
router.delete('/:id',verifyToken , deleteSummary);

export default router;

