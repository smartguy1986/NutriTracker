import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNutrition } from '../context/NutritionContext';
import { useFoodDatabase, FoodItem } from '../context/FoodDatabaseContext';

export function EditMeal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dailyLog, updateMeal, deleteMeal } = useNutrition();
  const { searchFood } = useFoodDatabase();

  const [meal, setMeal] = useState<any>(null);
  const [food, setFood] = useState<FoodItem | null>(null);

  const [weight, setWeight] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [logDate, setLogDate] = useState('');
  const [logTime, setLogTime] = useState('');

  useEffect(() => {
    // Find the meal from dailyLog
    const foundMeal = dailyLog.meals.find(m => m.id === id);
    if (!foundMeal) {
      // It might be from another date, but for now we mostly edit today's meals.
      // If we can't find it, just go back.
      navigate('/');
      return;
    }
    setMeal(foundMeal);
    
    // Parse timestamp
    const dateObj = new Date(foundMeal.timestamp);
    setLogDate(`${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`);
    setLogTime(String(dateObj.getHours()).padStart(2, '0') + ':' + String(dateObj.getMinutes()).padStart(2, '0'));

    if (foundMeal.unit === 'grams' || foundMeal.unit === 'g') {
      setWeight(foundMeal.quantity);
    } else {
      setQuantity(foundMeal.quantity);
    }

    // Try to load food details from local db to get piece_weight
    searchFood(foundMeal.foodName).then(results => {
      const match = results.find(f => f.name === foundMeal.foodName);
      if (match) setFood(match);
    });
  }, [id, dailyLog.meals, navigate, searchFood]);

  if (!meal) return null;

  const handleUpdate = () => {
    const isPiece = meal.unit !== 'grams' && meal.unit !== 'g';
    const newQuantity = isPiece ? quantity : weight;
    
    let calories = meal.calories;
    let protein = meal.protein;
    let carbs = meal.carbs;
    let fat = meal.fat;
    
    if (food) {
      // Recalculate based on original food data
      const actualWeight = isPiece && food.piece_weight ? newQuantity * food.piece_weight : newQuantity;
      const factor = actualWeight / 100;
      calories = Math.round(food.calories * factor);
      protein = Math.round(food.protein * factor);
      carbs = Math.round(food.carbs * factor);
      fat = Math.round(food.fat * factor);
    } else {
      // Recalculate based on old macros
      const factor = newQuantity / meal.quantity;
      calories = Math.round(meal.calories * factor);
      protein = Math.round(meal.protein * factor);
      carbs = Math.round(meal.carbs * factor);
      fat = Math.round(meal.fat * factor);
    }

    const timestamp = new Date(`${logDate}T${logTime}:00`).toISOString();

    updateMeal(meal.id, {
      quantity: newQuantity,
      calories,
      protein,
      carbs,
      fat,
      timestamp
    });

    navigate('/stats');
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      deleteMeal(meal.id);
      navigate('/stats');
    }
  };

  const isPiece = meal.unit !== 'grams' && meal.unit !== 'g';

  return (
    <div className="font-sans pb-32 min-h-screen text-brand-text transition-colors duration-300">
      <div className="max-w-md mx-auto pt-12 px-5 pb-5 glass-card border-b border-brand-border/10 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-brand-textMuted hover:text-brand-text transition-colors">
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-brand-text text-2xl font-extrabold">Edit Meal</h2>
          </div>
          <button onClick={handleDelete} className="text-red-500 hover:text-red-400 p-2 bg-red-500/10 rounded-xl transition-colors">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-brand-textMuted text-sm">
          Update amount for {meal.foodName}
        </p>
      </div>

      <div className="max-w-md mx-auto p-5">
        <div className="glass-card rounded-[24px] p-6 mb-6 border border-brand-border/10">
          <p className="text-brand-accent text-xs font-bold uppercase tracking-widest mb-2">Log Item</p>
          <h3 className="text-brand-text text-2xl font-extrabold mb-1">{meal.foodName}</h3>
        </div>

        {isPiece ? (
          <div className="glass-card rounded-[24px] p-6 mb-6 border border-brand-border/10">
            <p className="text-brand-text font-bold mb-4">Quantity ({meal.unit})</p>
            <div className="flex items-center bg-brand-surfaceLight rounded-2xl px-5 border border-brand-border/10 focus-within:border-brand-accent/50 focus-within:ring-1 focus-within:ring-brand-accent/50 transition-all">
              <input
                type="number"
                value={quantity || ''}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="flex-1 bg-transparent border-none outline-none text-brand-text text-3xl py-4 text-center font-extrabold font-mono"
              />
              <span className="text-brand-textMuted text-base font-bold">qty</span>
            </div>
            <div className="flex gap-2 mt-4">
              {[1, 2, 3, 4, 5].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuantity(q)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${quantity === q ? 'bg-brand-accent text-white shadow-md shadow-brand-accent/20' : 'bg-brand-surfaceLight text-brand-textMuted hover:bg-brand-border/20'}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-[24px] p-6 mb-6 border border-brand-border/10">
            <p className="text-brand-text font-bold mb-4">Weight (grams)</p>
            <div className="flex items-center bg-brand-surfaceLight rounded-2xl px-5 border border-brand-border/10 focus-within:border-brand-accent/50 focus-within:ring-1 focus-within:ring-brand-accent/50 transition-all">
              <input
                type="number"
                value={weight || ''}
                onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                className="flex-1 bg-transparent border-none outline-none text-brand-text text-3xl py-4 text-center font-extrabold font-mono"
              />
              <span className="text-brand-textMuted text-base font-bold">g</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {[50, 100, 150, 200, 250].map((w) => (
                <button
                  key={w}
                  onClick={() => setWeight(w)}
                  className={`flex-[1_0_30%] py-2.5 rounded-xl text-sm font-bold transition-colors ${weight === w ? 'bg-brand-accent text-white shadow-md shadow-brand-accent/20' : 'bg-brand-surfaceLight text-brand-textMuted hover:bg-brand-border/20'}`}
                >
                  {w}g
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="glass-card rounded-[24px] p-6 mb-6 border border-brand-border/10">
          <p className="text-brand-text font-bold mb-4">Date & Time</p>
          <div className="flex gap-3">
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="flex-1 bg-brand-surfaceLight border border-brand-border/10 rounded-2xl px-4 py-3 text-brand-text text-sm font-medium outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 transition-all"
            />
            <input
              type="time"
              value={logTime}
              onChange={(e) => setLogTime(e.target.value)}
              className="w-[120px] bg-brand-surfaceLight border border-brand-border/10 rounded-2xl px-4 py-3 text-brand-text text-sm font-medium outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleUpdate}
          className="w-full py-4 rounded-2xl bg-brand-accent text-white font-extrabold text-[17px] border-none cursor-pointer shadow-lg shadow-brand-accent/25 hover:bg-brand-accentHover transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
