import { Router } from "express";
import { usersTable } from "../db/schema";
import { db } from "../libs/drizzle";
import { eq, sql } from "drizzle-orm";
import { error } from "console";

const router = Router();

// router.get("/user", async (req, res) => {
//    const users = await db.select().from(usersTable);

//    res.json({ users });
// });

router.get("/user", async (req, res) => {
   const users = await db
      .select({
         id: usersTable.id,
         name: usersTable.name,
         email: sql<string>`lower(${usersTable.email})`,
         age: usersTable.age,
      })
      .from(usersTable);

   res.json({ users });
});

router.post("/user", async (req, res) => {
   type UserInsert = typeof usersTable.$inferInsert;

   const newUser: UserInsert = {
      name: "Thiago",
      email: "thiago.andrade@gmail.com",
      age: 29,
   };
   await db.insert(usersTable).values(newUser);
   // INSERT INTO nome da tabela VALUES(...)
   res.status(201).json({ error: "Create user" });
});

router.put("/user", async (req, res) => {
   await db.update(usersTable).set({ name: "Fernanda" }).where(eq(usersTable.name, "Maria Silva"));

   res.json({ error: "update completion" });
});

router.delete("/user", async (req, res) => {
   await db.delete(usersTable).where(eq(usersTable.name, "Thiago"));

   res.json({ error: "delete completion" });
});

export default router;

// TESTANDO PELO INSOMINA
// import { Router } from 'express';
// import { usersTable } from '../db/schema';
// import { db } from '../libs/drizzle';

// const router = Router();

// router.get('/ping', (req, res) => {
//     res.json({ pong: true });
// });

// router.post('/user', async (req, res) => {
//     try {
//         // 1. Extrai as variáveis que vieram do Body (JSON) do Insomnia
//         const { name, age, email, obs } = req.body;

//         // 2. Passa essas variáveis para o Drizzle
//         const newUser = await db.insert(usersTable).values({
//             name: name,
//             age: age,
//             email: email,
//             obs: obs
//         }).returning();

//         // 3. Devolve o usuário criado como resposta para o Insomnia!
//         res.status(201).json(newUser);

//     } catch (error) {
//         // Se algo der errado (ex: email duplicado), cai aqui sem derrubar o servidor
//         console.error("Erro ao inserir no banco:", error);
//         res.status(400).json({ error: "Não foi possível criar o usuário. Verifique os dados e tente novamente." });
//     }
// });

// export default router;
