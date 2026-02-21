import { Router } from 'express';
import { usersTable } from '../db/schema';
import { db } from '../libs/drizzle';

const router = Router();

router.get('/ping', (req, res) => {
    res.json({ pong: true });
});

router.post('/user', async (req, res) => {
    type UserInsert = typeof usersTable.$inferInsert;

    const newUser: UserInsert = {
        name: 'Breno',
        email: 'breno.andrade@gmail.com',
        age: 30
    }
    await db.insert(usersTable).values(newUser);
    // INSERT INTO nome da tabela VALUES(...)

    res.status(201).json({error: null});

});

export default router;