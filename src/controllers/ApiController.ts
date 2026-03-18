import { Request, Response } from 'express';
import { db } from "../libs/drizzle";
import { pestsTable, postsTable, usersTable, usuarioTable } from "../db/schema";
import  jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { desc, eq, sql } from "drizzle-orm";

dotenv.config();

export const listUsersWithPets = async (req: Request, res: Response) => {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        petName: pestsTable.name,
        petId: pestsTable.id,
      })
      .from(usersTable)
      .innerJoin(pestsTable, eq(pestsTable.ownerId, usersTable.id));

    res.json({ users });
  } catch (error) {
    console.error("Error listing users with pets:", error);
    res.status(500).json({ error: "Failed to list users with pets" });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.select().from(usersTable);

    res.json(users); 
  } catch (error) {
    console.error("Error listing users:", error);
    res.status(500).json({ error: "Failed to list users" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    type UserInsert = typeof usersTable.$inferInsert;
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
      return res.status(400).json({ error: "Missing required fields: name, email, age" });
    }
    const newUser: UserInsert = {
      name,
      email,
      age,
      balance: req.body.balance || 0, 
    };
    await db.insert(usersTable).values(newUser);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, age, email, balance } = req.body;

    if (!id) {
      return res.status(400).json({ error: "User ID is required for update" });
    }

    const updateData: Partial<typeof usersTable.$inferInsert> = {};
    if (name !== undefined) updateData.name = name;
    if (age !== undefined) updateData.age = age;
    if (email !== undefined) updateData.email = email;
    if (balance !== undefined) updateData.balance = balance;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

    await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, parseInt(id, 10)));

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "User ID is required for deletion" });
    }

    await db.delete(usersTable).where(eq(usersTable.id, parseInt(id, 10)));

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, body, ownerId } = req.body;

    if (!title || !body || !ownerId) {
      return res.status(400).json({ error: "Missing required fields: title, body, ownerId" });
    }

    await db.insert(postsTable).values({
      title,
      body,
      ownerId,
    });

    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const transferFunds = async (req: Request, res: Response) => {
  try {
    const { amount, fromUserId, toUserId } = req.body;

    if (!amount || !fromUserId || !toUserId) {
      return res.status(400).json({ error: "Missing required fields: amount, fromUserId, toUserId" });
    }

    await db.transaction(async (tx) => {
      const [account] = await tx
        .select({ balance: usersTable.balance })
        .from(usersTable)
        .where(eq(usersTable.id, fromUserId));

      if (!account || account.balance === null || account.balance < amount) {
        throw new Error("Insufficient balance");
      }

      await tx
        .update(usersTable)
        .set({ balance: sql`${usersTable.balance} - ${amount}` })
        .where(eq(usersTable.id, fromUserId));

      await tx
        .update(usersTable)
        .set({ balance: sql`${usersTable.balance} + ${amount}` })
        .where(eq(usersTable.id, toUserId));
    });

    res.json({ message: "Funds transferred successfully" });
  } catch (error: any) {
    console.error("Error transferring funds:", error);
    res.status(500).json({ error: error.message || "Failed to transfer funds" });
  }
};

export const ping = (req: Request, res: Response) => {
  res.json({ pong: true });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields: email, password" });
    }

    const [user] = await db
      .select()
      .from(usuarioTable)
      .where(eq(usuarioTable.email, email));

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY as string, 
      { expiresIn: '2h' } // Boa prática: define que o token perde a validade em 2 horas
    );

    res.json({ status: true, token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    if (req.body.email && req.body.password) {
      let { email, password } = req.body;

      const existingUsers = await db
        .select()
        .from(usuarioTable)
        .where(eq(usuarioTable.email, email));

      let hasUser = existingUsers.length > 0;

      if (!hasUser) {
        const [newUser] = await db
          .insert(usuarioTable)
          .values({
            email,
            password
          })
          .returning({ id: usuarioTable.id });

        res.status(201).json({ id: newUser.id });
        
      } else {
        res.json({ error: 'E-mail já existe.' });
      }
      
    } else {
      res.json({ error: 'E-mail e/ou senha não enviados.' });
    }
    
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const users = await db
    .select({
      email: usuarioTable.email
    })
    .from(usuarioTable);

    res.json({ users });
  } catch (error) {
    console.error("Error listing users:", error);
    res.status(500).json({ error: "Failed to list users" });
  }};
