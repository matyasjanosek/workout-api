import { Router, Response } from 'express';
import { Workout } from './models';
import verifyToken, { AuthRequest } from './middleware';

const router = Router();

/**
 * @swagger
 * /api/workouts:
 *   get:
 *     summary: Get all workouts
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workouts
 */
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const workouts = await Workout.find({ userId: req.user._id });
        res.status(200).json(workouts);
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

/**
 * @swagger
 * /api/workouts/{id}:
 *   get:
 *     summary: Get a single workout
 *     tags: [Workouts]
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
 *         description: Workout found
 *       404:
 *         description: Not found
 */
router.get('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const workout = await Workout.findOne({ _id: req.params.id, userId: req.user._id });
        if (!workout) {
            res.status(404).json({ message: 'Workout not found' });
            return;
        }
        res.status(200).json(workout);
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

/**
 * @swagger
 * /api/workouts:
 *   post:
 *     summary: Create a new workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *     responses:
 *       201:
 *         description: Workout created
 */
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, duration, difficulty } = req.body;

        const workout = new Workout({
            title,
            description,
            duration,
            difficulty,
            userId: req.user._id
        });

        await workout.save();
        res.status(201).json(workout);
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

/**
 * @swagger
 * /api/workouts/{id}:
 *   put:
 *     summary: Update a workout
 *     tags: [Workouts]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *     responses:
 *       200:
 *         description: Workout updated
 *       404:
 *         description: Not found
 */
router.put('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const workout = await Workout.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );
        if (!workout) {
            res.status(404).json({ message: 'Workout not found' });
            return;
        }
        res.status(200).json(workout);
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

/**
 * @swagger
 * /api/workouts/{id}:
 *   delete:
 *     summary: Delete a workout
 *     tags: [Workouts]
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
 *         description: Workout deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const workout = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!workout) {
            res.status(404).json({ message: 'Workout not found' });
            return;
        }
        res.status(200).json({ message: 'Workout deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

export default router;