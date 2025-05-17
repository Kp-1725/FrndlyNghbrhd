import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertRequestSchema, insertOfferSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all requests
  app.get("/api/requests", async (req: Request, res: Response) => {
    try {
      const requests = await storage.getAllRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  // Get requests by user (my requests)
  app.get("/api/my-requests", async (req: Request, res: Response) => {
    try {
      // In a real app, you would get the user ID from the session
      // For demo purposes, we'll use user 1
      const userId = 1;
      const requests = await storage.getRequestsByUser(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  // Get requests where the user has offered help (my offers)
  app.get("/api/my-offers", async (req: Request, res: Response) => {
    try {
      // In a real app, you would get the user ID from the session
      // For demo purposes, we'll use user 1
      const userId = 1;
      const requests = await storage.getRequestsByUserOffers(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch offers" });
    }
  });

  // Get a specific request
  app.get("/api/requests/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.getRequestById(id);
      
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch request" });
    }
  });

  // Create a new request
  app.post("/api/requests", async (req: Request, res: Response) => {
    try {
      const validatedData = insertRequestSchema.parse(req.body);
      
      // In a real app, you would get the user ID from the session
      // For demo purposes, we'll use user 1
      const userId = 1;
      
      const newRequest = await storage.createRequest({
        ...validatedData,
        userId
      });
      
      res.status(201).json(newRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create request" });
    }
  });

  // Create an offer for a request
  app.post("/api/requests/:id/offers", async (req: Request, res: Response) => {
    try {
      const requestId = parseInt(req.params.id);
      const { message } = req.body;
      
      // In a real app, you would get the user ID from the session
      // For demo purposes, we'll use user 2 (different from the request creator)
      const userId = 2;
      
      // Check if the request exists
      const request = await storage.getRequestById(requestId);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      // Make sure the user isn't offering help on their own request
      if (request.user.id === userId) {
        return res.status(400).json({ message: "You cannot offer help on your own request" });
      }
      
      const newOffer = await storage.createOffer({
        requestId,
        userId,
        message
      });
      
      res.status(201).json(newOffer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid offer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create offer" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
