import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNutrition } from '../context/NutritionContext';
import { useFoodDatabase, FoodItem } from '../context/FoodDatabaseContext';

export function AddMeal() {
  const navigate = useNavigate();
  const { addMeal } = useNutrition();
  const { searchFood, loading } = useFoodDatabase();

  const [step, setStep] = useState<"food" | "quantity">("food");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  
  // Weight in grams
  const [weight, setWeight] = useState(100);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (search.length < 2) {
      setSearchResults([]);
      return;
    }
    
    // The search is synchronous and fast since it's local
    const results = searchFood(search);
    setSearchResults(results);
  }, [search, searchFood]);

  const handleConfirm = () => {
    if (!selectedFood) return;
    
    const factor = weight / 100;
    
    addMeal({
      id: crypto.randomUUID(),
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      quantity: weight,
      unit: 'grams',
      calories: Math.round(selectedFood.calories * factor),
      protein: Math.round(selectedFood.protein * factor),
      carbs: Math.round(selectedFood.carbs * factor),
      fat: Math.round(selectedFood.fat * factor),
      timestamp: new Date().toISOString(),
    });
    
    setShowConfirm(false);
    navigate('/');
  };

  return (
    <div className="font-sans pb-32 min-h-screen bg-brand-bg text-brand-text">
      <div style={{ padding: "52px 20px 20px", background: "#0f1320" }} className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-4">
            {step === "food" ? (
                <button onClick={() => navigate('/')} className="text-brand-gray">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
            ) : null}
            <h2 style={{ color: "#f0f2f5", fontSize: 22, fontWeight: 800 }}>Log Food</h2>
        </div>
        <p style={{ color: "#6b7585", fontSize: 13 }}>
          {step === "food" ? `Search for a food item` : `Set weight for ${selectedFood?.name}`}
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {["food", "quantity"].map((s, i) => (
            <div key={s} style={{
              height: 3, borderRadius: 4, flex: 1,
              background: ["food", "quantity"].indexOf(step) >= i ? "#4ade80" : "#1e2230",
              transition: "background 0.3s",
            }} />
          ))}
        </div>
      </div>

      <div style={{ padding: "20px" }} className="max-w-md mx-auto">
        {step === "food" && (
          <div>
            <div style={{ position: "relative" }}>
              <MagnifyingGlassIcon className="w-5 h-5 text-brand-gray absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search database..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", padding: "16px 16px 16px 44px", borderRadius: 14,
                  background: "#161921", border: "1px solid #1e2230", color: "white", outline: "none",
                  fontSize: 15
                }}
              />
            </div>

            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              {loading ? (
                <p style={{ color: "#6b7585", textAlign: "center", marginTop: 20 }}>Loading database...</p>
              ) : search.length > 0 && search.length < 2 ? (
                <p style={{ color: "#6b7585", textAlign: "center", marginTop: 20 }}>Type at least 2 characters...</p>
              ) : searchResults.length === 0 && search.length >= 2 ? (
                <p style={{ color: "#6b7585", textAlign: "center", marginTop: 20 }}>No foods found.</p>
              ) : (
                searchResults.map(food => (
                <button
                  key={food.id}
                  onClick={() => { setSelectedFood(food); setStep("quantity"); }}
                  style={{
                    background: "#161921", borderRadius: 14, padding: "14px 16px",
                    display: "flex", alignItems: "center", gap: 12, border: "none", cursor: "pointer", textAlign: "left", width: "100%",
                  }}
                >
                  <div style={{ minWidth: 40, width: 40, height: 40, borderRadius: 12, background: "rgba(74,222,128,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                    🥗
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#f0f2f5", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{food.name}</p>
                    <p style={{ color: "#6b7585", fontSize: 11 }} className="font-mono">P: {Math.round(food.protein)}g · C: {Math.round(food.carbs)}g · F: {Math.round(food.fat)}g</p>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 60 }}>
                    <p style={{ color: "#4ade80", fontWeight: 800, fontSize: 15 }} className="font-mono">{Math.round(food.calories)}</p>
                    <p style={{ color: "#6b7585", fontSize: 10 }}>per 100g</p>
                  </div>
                </button>
              )))}
            </div>
          </div>
        )}

        {step === "quantity" && selectedFood && (
          <div>
            <button onClick={() => setStep("food")} style={{ display: "flex", alignItems: "center", gap: 6, color: "#6b7585", background: "none", border: "none", cursor: "pointer", marginBottom: 20 }}>
              <ChevronLeftIcon className="w-4 h-4" /> Back
            </button>

            <div style={{ background: "#161921", borderRadius: 20, padding: 24, marginBottom: 24 }}>
              <p style={{ color: "#4ade80", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Log Item</p>
              <h3 style={{ color: "#f0f2f5", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{selectedFood.name}</h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 20 }}>
                {[
                  { label: "Calories", value: Math.round(selectedFood.calories * (weight / 100)), color: "#4ade80", unit: "kcal" },
                  { label: "Protein", value: Math.round(selectedFood.protein * (weight / 100)), color: "#60a5fa", unit: "g" },
                  { label: "Carbs", value: Math.round(selectedFood.carbs * (weight / 100)), color: "#fb923c", unit: "g" },
                  { label: "Fat", value: Math.round(selectedFood.fat * (weight / 100)), color: "#f472b6", unit: "g" },
                ].map((n) => (
                  <div key={n.label} style={{ textAlign: "center" }}>
                    <p style={{ color: n.color, fontSize: 18, fontWeight: 800 }} className="font-mono">{n.value}<span style={{ fontSize: 10, fontFamily: "Plus Jakarta Sans" }}>{n.unit}</span></p>
                    <p style={{ color: "#6b7585", fontSize: 10 }}>{n.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#161921", borderRadius: 20, padding: 24, marginBottom: 24 }}>
              <p style={{ color: "#f0f2f5", fontWeight: 700, marginBottom: 16 }}>Weight (grams)</p>
              
              <div style={{ display: "flex", alignItems: "center", background: "#1e2230", borderRadius: 14, padding: "0 16px" }}>
                <input
                  type="number"
                  value={weight || ''}
                  onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none",
                    color: "#f0f2f5", fontSize: 24, padding: "16px 0", textAlign: "center",
                    fontWeight: 800
                  }}
                  className="font-mono"
                />
                <span style={{ color: "#6b7585", fontSize: 16, fontWeight: 700 }}>g</span>
              </div>
              
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                {[50, 100, 150, 200, 250].map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeight(w)}
                    style={{
                      flex: 1, padding: "8px 0", borderRadius: 8,
                      background: weight === w ? "rgba(74,222,128,0.15)" : "#1e2230",
                      color: weight === w ? "#4ade80" : "#6b7585",
                      border: weight === w ? "1px solid #4ade80" : "1px solid transparent",
                      cursor: "pointer", fontSize: 13, fontWeight: 600
                    }}
                  >
                    {w}g
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              style={{
                width: "100%", padding: 16, borderRadius: 14, background: "#4ade80",
                color: "#0d1a0f", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer",
              }}
            >
              Log food →
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && selectedFood && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}>
          <div style={{
            width: "100%", maxWidth: 480, background: "#1e2230",
            borderRadius: "24px 24px 0 0", padding: "32px 24px 48px",
          }}>
            <div style={{ width: 40, height: 4, background: "#2e3548", borderRadius: 4, margin: "0 auto 24px" }} />
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(74,222,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <CheckIcon className="w-8 h-8 text-brand-green stroke-[3px]" />
              </div>
              <h3 style={{ color: "#f0f2f5", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Confirm Food Log</h3>
              <p style={{ color: "#6b7585", fontSize: 14 }}>Adding to your daily timeline</p>
            </div>

            <div style={{ background: "#161921", borderRadius: 16, padding: 20, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <p style={{ color: "#f0f2f5", fontWeight: 700, fontSize: 16 }}>{selectedFood.name}</p>
                  <p style={{ color: "#6b7585", fontSize: 13 }}>{weight}g</p>
                </div>
                <p style={{ color: "#4ade80", fontWeight: 800, fontSize: 22 }} className="font-mono">
                  {Math.round(selectedFood.calories * (weight / 100))} <span style={{ fontSize: 12, color: "#6b7585", fontFamily: "Plus Jakarta Sans", fontWeight: 400 }}>kcal</span>
                </p>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                {[
                  { l: "Protein", v: Math.round(selectedFood.protein * (weight / 100)), c: "#60a5fa" },
                  { l: "Carbs", v: Math.round(selectedFood.carbs * (weight / 100)), c: "#fb923c" },
                  { l: "Fat", v: Math.round(selectedFood.fat * (weight / 100)), c: "#f472b6" },
                ].map((n) => (
                  <div key={n.l} style={{ flex: 1, textAlign: "center", background: "#1e2230", borderRadius: 10, padding: "8px 4px" }}>
                    <p style={{ color: n.c, fontWeight: 700, fontSize: 14 }} className="font-mono">{n.v}g</p>
                    <p style={{ color: "#6b7585", fontSize: 10 }}>{n.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1, padding: 16, borderRadius: 14, background: "#1a1e28", border: "none",
                  color: "#6b7585", fontWeight: 700, fontSize: 15, cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  flex: 2, padding: 16, borderRadius: 14, background: "#4ade80", border: "none",
                  color: "#0d1a0f", fontWeight: 700, fontSize: 15, cursor: "pointer",
                }}
              >
                ✓ Confirm & Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
