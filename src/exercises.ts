import { Router, Response } from 'express';
import { Exercise, ExerciseLog } from './models';
import verifyToken, { AuthRequest } from './middleware';

const router = Router();

// get all exercises
/**
 * @swagger
 * /api/exercises:
 *   get:
 *     summary: Get all exercises
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of exercises
 */
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const exercises = await Exercise.find({ userId: req.user._id });
        res.status(200).json(exercises);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// add new exercise
/**
 * @swagger
 * /api/exercises:
 *   post:
 *     summary: Create a new exercise
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Exercise created
 */
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;
        const exercise = new Exercise({ name, userId: req.user._id });
        await exercise.save();
        res.status(201).json(exercise);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// delete exercise
/**
 * @swagger
 * /api/exercises/{id}:
 *   delete:
 *     summary: Delete an exercise
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exercise deleted
 */
router.delete('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const exercise = await Exercise.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!exercise) {
            res.status(404).json({ message: 'Exercise not found' });
            return;
        }
        // also delete all logs for this exercise
        await ExerciseLog.deleteMany({ exerciseId: req.params.id });
        res.status(200).json({ message: 'Exercise deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// get logs for specific exercise
/**
 * @swagger
 * /api/exercises/{id}/logs:
 *   get:
 *     summary: Get logs for an exercise
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of logs
 */
router.get('/:id/logs', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const logs = await ExerciseLog.find({ 
            exerciseId: req.params.id,
            userId: req.user._id 
        }).sort({ date: 1 }); // sort by date ascending for chart
        res.status(200).json(logs);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// add log for exercise
/**
 * @swagger
 * /api/exercises/{id}/logs:
 *   post:
 *     summary: Add a log entry for an exercise
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weight:
 *                 type: number
 *               reps:
 *                 type: number
 *               date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Log added
 */
router.post('/:id/logs', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { weight, reps, date } = req.body;
        const log = new ExerciseLog({
            exerciseId: req.params.id,
            userId: req.user._id,
            weight,
            reps,
            date: new Date(date)
        });
        await log.save();
        res.status(201).json(log);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

export default router;