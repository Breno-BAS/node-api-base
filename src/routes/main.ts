import { Router } from "express";
import { Auth } from "../middlewares/auth";
import * as ApiController  from "../controllers/ApiController";

const router = Router();

// Routes for users
router.get("/user", ApiController.listUsersWithPets);

router.post("/user", ApiController.createUser);

router.put("/user/:id", ApiController.updateUser);

router.delete("/user/:id", ApiController.deleteUser);

// Routes for posts
router.post("/post", ApiController.createPost);

// Route for fund transfer
router.post("/deposit", ApiController.transferFunds);

// Simple health check
router.get('/ping', ApiController.ping);

router.post('/register', ApiController.register);

router.post('/login', ApiController.login);

router.get('/list', Auth.private, ApiController.list);

export default router;
