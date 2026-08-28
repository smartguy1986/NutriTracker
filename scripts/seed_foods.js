require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const foodsData = require('../src/data/foods.json');

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("Missing DATABASE_URL");
    process.exit(1);
  }
  
  const sql = neon(process.env.DATABASE_URL);
  
  console.log(`Starting to seed ${foodsData.length} foods...`);
  
  const batchSize = 50;
  for (let i = 0; i < foodsData.length; i += batchSize) {
    const batch = foodsData.slice(i, i + batchSize);
    
    for (const food of batch) {
      await sql`
        INSERT INTO foods (id, name, category, serving_size, serving_unit, calories, protein, carbs, fat)
        VALUES (
          ${food.id},
          ${food.name},
          ${food.category},
          ${food.serving_size},
          ${food.serving_unit},
          ${food.calories},
          ${food.protein},
          ${food.carbs},
          ${food.fat}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }
    console.log(`Seeded batch ${i / batchSize + 1}`);
  }
  
  console.log("Finished seeding!");
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
