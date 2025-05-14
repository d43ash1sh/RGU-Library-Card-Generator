import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { studentCardSchema } from "@shared/schema";
import { getAISuggestions } from "./ai";
import * as z from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Route to save a student card
  app.post("/api/student-cards", async (req, res) => {
    try {
      const data = studentCardSchema.parse(req.body);
      const studentCard = await storage.createStudentCard(data);
      res.status(201).json(studentCard);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "An error occurred while creating the student card" 
        });
      }
    }
  });

  // Route to get a student card by enrollment number
  app.get("/api/student-cards/:enrollmentNumber", async (req, res) => {
    try {
      const enrollmentNumber = req.params.enrollmentNumber;
      const studentCard = await storage.getStudentCardByEnrollmentNumber(enrollmentNumber);
      
      if (!studentCard) {
        return res.status(404).json({ message: "Student card not found" });
      }
      
      res.status(200).json(studentCard);
    } catch (error) {
      res.status(500).json({ 
        message: "An error occurred while fetching the student card" 
      });
    }
  });

  // Route to get AI suggestions for courses based on department
  app.get("/api/suggestions", async (req, res) => {
    try {
      const department = req.query.department as string;
      
      if (!department) {
        return res.status(400).json({ message: "Department is required" });
      }
      
      const suggestions = await getAISuggestions(department);
      res.status(200).json(suggestions);
    } catch (error) {
      res.status(500).json({ 
        message: "An error occurred while fetching AI suggestions" 
      });
    }
  });

  return httpServer;
}
