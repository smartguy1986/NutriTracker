import { Context } from "@netlify/functions";
import { db } from "../../src/db/index";
import { meals, profiles } from "../../src/db/schema";
import { eq } from "drizzle-orm";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const path = url.pathname;
  
  // Basic routing based on pathname
  try {
    if (path === "/api/meals") {
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

    if (path === "/api/profiles") {
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
        
        const updatedProfile = await db.update(profiles)
          .set(body)
          .where(eq(profiles.id, body.id))
          .returning();
          
        return new Response(JSON.stringify(updatedProfile[0]), {
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
