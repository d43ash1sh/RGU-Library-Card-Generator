import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const studentCards = pgTable("student_cards", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  enrollmentNumber: text("enrollment_number").notNull().unique(),
  department: text("department").notNull(),
  course: text("course").notNull(),
  semester: text("semester").notNull(),
  validityYears: integer("validity_years").notNull(),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const studentCardSchema = createInsertSchema(studentCards).omit({
  id: true,
  createdAt: true,
});

export const studentCardFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  enrollmentNumber: z.string().min(1, "Enrollment number is required"),
  department: z.string().min(1, "Department is required"),
  course: z.string().min(1, "Course is required"),
  semester: z.string().min(1, "Semester is required"),
  validityYears: z.coerce.number().int().min(1).max(5),
  photo: z.any().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type StudentCard = typeof studentCards.$inferSelect;
export type InsertStudentCard = z.infer<typeof studentCardSchema>;
export type StudentCardFormData = z.infer<typeof studentCardFormSchema>;
