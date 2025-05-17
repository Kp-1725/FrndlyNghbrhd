import { 
  users, 
  requests, 
  offers, 
  type User, 
  type InsertUser, 
  type InsertRequest, 
  type Request,
  type Offer,
  type InsertOffer
} from "@shared/schema";
import { calculateDistance } from "../client/src/lib/utils";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllRequests(): Promise<Request[]>;
  getRequestById(id: number): Promise<Request | undefined>;
  getRequestsByUser(userId: number): Promise<Request[]>;
  getRequestsByUserOffers(userId: number): Promise<Request[]>;
  createRequest(request: InsertRequest & { userId: number }): Promise<Request>;
  createOffer(offer: { requestId: number, userId: number, message: string }): Promise<Offer>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private requests: Map<number, Request>;
  private offers: Map<number, Offer>;
  currentUserId: number;
  currentRequestId: number;
  currentOfferId: number;

  constructor() {
    this.users = new Map();
    this.requests = new Map();
    this.offers = new Map();
    this.currentUserId = 1;
    this.currentRequestId = 1;
    this.currentOfferId = 1;

    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample users
    const user1 = {
      id: 1,
      username: "Sarah M.",
      password: "password123"
    };
    this.users.set(1, user1);
    
    const user2 = {
      id: 2,
      username: "Mike T.",
      password: "password123"
    };
    this.users.set(2, user2);
    
    const user3 = {
      id: 3,
      username: "David L.",
      password: "password123"
    };
    this.users.set(3, user3);

    this.currentUserId = 4; // Set the next user ID

    // Create sample requests with hardcoded IDs to match the users
    const request1 = {
      id: 1,
      title: "Help with grocery shopping needed",
      description: "I'm recovering from surgery and need help getting groceries from Trader Joe's. It's about 10 items. Can compensate for your time.",
      category: "groceries",
      location: {
        lat: 37.77,
        lng: -122.41,
        neighborhood: "Mission District",
        city: "San Francisco"
      },
      userId: 1,
      status: "open",
      createdAt: new Date().toISOString(),
      user: user1,
      distance: 0.7
    };
    this.requests.set(1, request1);

    const request2 = {
      id: 2,
      title: "Dog walking help this weekend",
      description: "Need someone to walk my friendly lab mix on Saturday morning. I have an appointment and will be gone for about 3 hours. Regular walker unavailable.",
      category: "petcare",
      location: {
        lat: 37.75,
        lng: -122.43,
        neighborhood: "Noe Valley",
        city: "San Francisco"
      },
      userId: 2,
      status: "open",
      createdAt: new Date().toISOString(),
      user: user2,
      distance: 1.2
    };
    this.requests.set(2, request2);

    const request3 = {
      id: 3,
      title: "Need help mounting a TV",
      description: "Looking for someone who can help mount my new 55\" TV on drywall. I have the mounting bracket. Should take less than an hour. Can pay or exchange for a skill!",
      category: "handyman",
      location: {
        lat: 37.76,
        lng: -122.42,
        neighborhood: "Castro",
        city: "San Francisco"
      },
      userId: 3,
      status: "open",
      createdAt: new Date().toISOString(),
      user: user3,
      distance: 0.9
    };
    this.requests.set(3, request3);
    
    this.currentRequestId = 4; // Set the next request ID
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
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllRequests(): Promise<Request[]> {
    const requests = Array.from(this.requests.values());
    
    // Sort by most recent
    return requests.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getRequestById(id: number): Promise<Request | undefined> {
    return this.requests.get(id);
  }

  async getRequestsByUser(userId: number): Promise<Request[]> {
    return Array.from(this.requests.values()).filter(
      (request) => request.user.id === userId
    );
  }

  async getRequestsByUserOffers(userId: number): Promise<Request[]> {
    const userOffers = Array.from(this.offers.values()).filter(
      (offer) => offer.userId === userId
    );
    
    return userOffers.map(offer => this.requests.get(offer.requestId)!)
      .filter(Boolean);
  }

  async createRequest(data: InsertRequest & { userId: number }): Promise<Request> {
    const id = this.currentRequestId++;
    const user = await this.getUser(data.userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    // Calculate the distance from a fixed point (for demo purposes)
    // In a real app, this would be calculated based on the user's location
    const userLat = 37.7749;
    const userLng = -122.4194;
    const distance = calculateDistance(
      userLat, 
      userLng, 
      data.location.lat, 
      data.location.lng
    );
    
    const request: Request = {
      id,
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location,
      userId: data.userId,
      status: "open",
      createdAt: new Date().toISOString(),
      user,
      distance
    };
    
    this.requests.set(id, request);
    return request;
  }

  async createOffer(data: { requestId: number, userId: number, message: string }): Promise<Offer> {
    const id = this.currentOfferId++;
    
    const offer: Offer = {
      id,
      requestId: data.requestId,
      userId: data.userId,
      message: data.message,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    this.offers.set(id, offer);
    return offer;
  }
}

export const storage = new MemStorage();
