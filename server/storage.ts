import { users, type User, type InsertUser, studentCards, type StudentCard, type InsertStudentCard } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Student card operations
  createStudentCard(studentCard: InsertStudentCard): Promise<StudentCard>;
  getStudentCardByEnrollmentNumber(enrollmentNumber: string): Promise<StudentCard | undefined>;
  getAllStudentCards(): Promise<StudentCard[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private studentCards: Map<string, StudentCard>; // Keyed by enrollmentNumber
  private userCurrentId: number;
  private studentCardCurrentId: number;

  constructor() {
    this.users = new Map();
    this.studentCards = new Map();
    this.userCurrentId = 1;
    this.studentCardCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createStudentCard(insertStudentCard: InsertStudentCard): Promise<StudentCard> {
    const id = this.studentCardCurrentId++;
    const createdAt = new Date();
    const studentCard: StudentCard = { 
      ...insertStudentCard, 
      id, 
      createdAt 
    };
    
    this.studentCards.set(studentCard.enrollmentNumber, studentCard);
    return studentCard;
  }

  async getStudentCardByEnrollmentNumber(enrollmentNumber: string): Promise<StudentCard | undefined> {
    return this.studentCards.get(enrollmentNumber);
  }

  async getAllStudentCards(): Promise<StudentCard[]> {
    return Array.from(this.studentCards.values());
  }
}

export const storage = new MemStorage();
