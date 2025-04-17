import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertTransactionSchema, insertUserSchema, insertVoiceCommandSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes are prefixed with /api
  
  // User routes
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      // Omit password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Omit password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Transaction routes
  app.post("/api/transactions", async (req: Request, res: Response) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create transaction" });
      }
    }
  });

  app.get("/api/users/:userId/transactions", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const transactions = await storage.getTransactionsByUserId(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Voice command processing route
  app.post("/api/voice-commands", async (req: Request, res: Response) => {
    try {
      const commandData = insertVoiceCommandSchema.parse(req.body);
      const command = await storage.recordVoiceCommand(commandData);
      
      // Process the command and generate a response
      const response = await storage.processVoiceCommand(command.command, command.userId);
      
      res.status(201).json({ 
        commandId: command.id,
        response 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid command data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to process voice command" });
      }
    }
  });

  // Financial summary route
  app.get("/api/users/:userId/financial-summary", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const summary = await storage.getFinancialSummary(userId);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Budget routes
  app.get("/api/users/:userId/budgets", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const budgets = await storage.getBudgetsByUserId(userId);
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Financial insights route
  app.get("/api/users/:userId/insights", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const insights = await storage.getFinancialInsights(userId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
