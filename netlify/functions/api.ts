import { Context } from "@netlify/functions";
import { db } from "../../src/db/index";
import { meals, profiles, foods as foodsSchema, user_goals, user_activity } from "../../src/db/schema";
import { eq, ilike } from "drizzle-orm";
import foodsData from "../../src/data/foods.json";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const path = url.pathname;
  
  // Basic routing based on pathname
  try {
    if (path.includes("/foods")) {
      if (req.method === "GET") {
        const query = url.searchParams.get("query")?.toLowerCase() || "";
        
        // If not in production, use the local file
        if (process.env.CONTEXT !== "production") {
          let results = foodsData;
          if (query) {
             results = foodsData.filter((f: any) => f.name.toLowerCase().includes(query));
          }
          return new Response(JSON.stringify(results.slice(0, 50)), {
            headers: { "Content-Type": "application/json" },
          });
        }
        
        // Production: query database
        let queryBuilder = db.select().from(foodsSchema);
        if (query) {
          queryBuilder = queryBuilder.where(ilike(foodsSchema.name, `%${query}%`));
        }
        const dbFoods = await queryBuilder.limit(50);
        return new Response(JSON.stringify(dbFoods), {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (path.includes("/meals")) {
      if (req.method === "GET") {
        const allMeals = await db.select().from(meals);
        return new Response(JSON.stringify(allMeals), {
          headers: { "Content-Type": "application/json" },
        });
      }
      if (req.method === "POST") {
        const body = await req.json();
        const newMeal = await db.insert(meals).values(body).returning();
        return new Response(JSON.stringify(newMeal[0]), {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (path.includes("/profiles")) {
      if (req.method === "GET") {
        const allProfiles = await db.select().from(profiles);
        return new Response(JSON.stringify(allProfiles), {
          headers: { "Content-Type": "application/json" },
        });
      }
      if (req.method === "POST") {
        const body = await req.json();
        const newProfile = await db.insert(profiles).values(body).returning();
        return new Response(JSON.stringify(newProfile[0]), {
          headers: { "Content-Type": "application/json" },
        });
      }
      if (req.method === "PUT") {
        const body = await req.json();
        if (!body.id) return new Response("Missing id", { status: 400 });
        
        const { id, created_at, ...updateData } = body;
        
        const updatedProfile = await db.update(profiles)
          .set(updateData)
          .where(eq(profiles.id, id))
          .returning();
          
        return new Response(JSON.stringify(updatedProfile[0]), {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (path.includes("/goals")) {
      if (req.method === "GET") {
        const allGoals = await db.select().from(user_goals);
        return new Response(JSON.stringify(allGoals), {
          headers: { "Content-Type": "application/json" },
        });
      }
      if (req.method === "POST") {
        const body = await req.json();
        const newGoal = await db.insert(user_goals).values(body).returning();
        return new Response(JSON.stringify(newGoal[0]), {
          headers: { "Content-Type": "application/json" },
        });
      }
      if (req.method === "PUT") {
        const body = await req.json();
        if (!body.id) return new Response("Missing id", { status: 400 });
        
        const { id, created_at, ...updateData } = body;
        
        const updatedGoal = await db.update(user_goals)
          .set(updateData)
          .where(eq(user_goals.id, id))
          .returning();
        return new Response(JSON.stringify(updatedGoal[0]), {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (path.includes("/activity")) {
      if (req.method === "GET") {
        const allActivity = await db.select().from(user_activity);
        return new Response(JSON.stringify(allActivity), {
          headers: { "Content-Type": "application/json" },
        });
      }
      if (req.method === "POST") {
        const body = await req.json();
        const newActivity = await db.insert(user_activity).values(body).returning();
        return new Response(JSON.stringify(newActivity[0]), {
          headers: { "Content-Type": "application/json" },
        });
      }
      if (req.method === "PUT") {
        const body = await req.json();
        if (!body.id) return new Response("Missing id", { status: 400 });
        
        const { id, created_at, ...updateData } = body;
        
        const updatedActivity = await db.update(user_activity)
          .set(updateData)
          .where(eq(user_activity.id, id))
          .returning();
        return new Response(JSON.stringify(updatedActivity[0]), {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = {
  path: "/api/*"
};
