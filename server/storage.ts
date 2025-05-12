import { users, responses, profiles, type User, type InsertUser, type Response, type InsertResponse, type Profile, type InsertProfile } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Response operations
  saveResponse(response: InsertResponse): Promise<Response>;
  getResponsesBySessionId(sessionId: string): Promise<Response[]>;
  
  // Profile operations
  saveProfile(profile: InsertProfile): Promise<Profile>;
  getProfileBySessionId(sessionId: string): Promise<Profile | undefined>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Response operations
  async saveResponse(response: InsertResponse): Promise<Response> {
    const [savedResponse] = await db
      .insert(responses)
      .values(response)
      .returning();
    return savedResponse;
  }
  
  async getResponsesBySessionId(sessionId: string): Promise<Response[]> {
    return await db
      .select()
      .from(responses)
      .where(eq(responses.sessionId, sessionId))
      .orderBy(responses.questionIndex);
  }
  
  // Profile operations
  async saveProfile(profile: InsertProfile): Promise<Profile> {
    // Check for existing profile with same sessionId
    const existingProfile = await this.getProfileBySessionId(profile.sessionId);
    
    if (existingProfile) {
      // Update existing profile
      const [updatedProfile] = await db
        .update(profiles)
        .set(profile)
        .where(eq(profiles.sessionId, profile.sessionId))
        .returning();
      return updatedProfile;
    } else {
      // Create new profile
      const [newProfile] = await db
        .insert(profiles)
        .values(profile)
        .returning();
      return newProfile;
    }
  }
  
  async getProfileBySessionId(sessionId: string): Promise<Profile | undefined> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.sessionId, sessionId));
    return profile;
  }
}

// In-memory storage implementation (for fallback)
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userResponses: Map<string, Response[]>;
  private userProfiles: Map<string, Profile>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.userResponses = new Map();
    this.userProfiles = new Map();
    this.currentId = 1;
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
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async saveResponse(response: InsertResponse): Promise<Response> {
    const id = this.currentId++;
    // Ensure emotionData is defined, even if null
    const newResponse: Response = { 
      ...response, 
      id,
      emotionData: response.emotionData || null
    };
    
    // Get existing responses or create new array
    const responses = this.userResponses.get(response.sessionId) || [];
    responses.push(newResponse);
    
    // Store updated responses
    this.userResponses.set(response.sessionId, responses);
    
    return newResponse;
  }
  
  async getResponsesBySessionId(sessionId: string): Promise<Response[]> {
    return this.userResponses.get(sessionId) || [];
  }
  
  async saveProfile(profile: InsertProfile): Promise<Profile> {
    const id = this.currentId++;
    const newProfile: Profile = { ...profile, id };
    
    this.userProfiles.set(profile.sessionId, newProfile);
    
    return newProfile;
  }
  
  async getProfileBySessionId(sessionId: string): Promise<Profile | undefined> {
    return this.userProfiles.get(sessionId);
  }
}

// Export the database storage implementation
export const storage = new DatabaseStorage();
