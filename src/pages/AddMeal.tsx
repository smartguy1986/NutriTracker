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
 const [quantity, setQuantity] = useState(1);
 const [showConfirm, setShowConfirm] = useState(false);

 const now = new Date();
 const defaultDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
 const defaultTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
 
 const [logDate, setLogDate] = useState(defaultDate);
 const [logTime, setLogTime] = useState(defaultTime);

 useEffect(() => {
 if (search.trim().length < 2) {
 setSearchResults([]);
 return;
 }
 
 let active = true;
 const fetchResults = async () => {
 const results = await searchFood(search);
 if (active) {
 setSearchResults(results);
 }
 };
 
 const timeoutId = setTimeout(fetchResults, 300);
 return () => {
 active = false;
 clearTimeout(timeoutId);
 };
 }, [search, searchFood]);

 const handleConfirm = () => {
 if (!selectedFood) return;
 
 const actualWeight = selectedFood.piece_weight ? quantity * selectedFood.piece_weight : weight;
 const factor = actualWeight / 100;
 const timestamp = new Date(`${logDate}T${logTime}:00`).toISOString();
 
 addMeal({
 id: crypto.randomUUID(),
 foodId: selectedFood.id,
 foodName: selectedFood.name,
 quantity: selectedFood.piece_weight ? quantity : weight,
 unit: (selectedFood.piece_weight ? (selectedFood.piece_unit || 'pieces') : 'grams') as any,
 calories: Math.round(selectedFood.calories * factor),
 protein: Math.round(selectedFood.protein * factor),
 carbs: Math.round(selectedFood.carbs * factor),
 fat: Math.round(selectedFood.fat * factor),
 timestamp: timestamp,
 });
 
 setShowConfirm(false);
 navigate('/');
 };

 return (
 <div className="font-sans pb-32 min-h-screen text-brand-text transition-colors duration-300">
 <div className="max-w-md mx-auto pt-12 px-5 pb-5 glass-card border-b border-brand-border/10 rounded-b-3xl">
 <div className="flex items-center gap-4 mb-4">
 {step === "food" ? (
 <button onClick={() => navigate('/')} className="text-brand-textMuted hover:text-brand-text transition-colors">
 <ChevronLeftIcon className="w-6 h-6" />
 </button>
 ) : null}
 <h2 className="text-brand-text text-2xl font-extrabold">Log Food</h2>
 </div>
 <p className="text-brand-textMuted text-sm">
 {step === "food" ? `Search for a food item` : `Set amount for ${selectedFood?.name}`}
 </p>
 <div className="flex gap-2 mt-4">
 {["food", "quantity"].map((s, i) => (
 <div key={s} className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${["food", "quantity"].indexOf(step) >= i ? 'bg-brand-accent' : 'bg-brand-surfaceLight'}`} />
 ))}
 </div>
 </div>

 <div className="max-w-md mx-auto p-5">
 {step === "food" && (
 <div>
 <div className="relative">
 <MagnifyingGlassIcon className="w-5 h-5 text-brand-textMuted absolute left-4 top-1/2 -translate-y-1/2" />
 <input
 type="text"
 placeholder="Search database..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full py-4 pl-12 pr-4 rounded-2xl glass-card border border-brand-border/20 text-brand-text text-[15px] outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all "
 />
 </div>

 <div className="mt-6 flex flex-col gap-3">
 {loading ? (
 <p className="text-brand-textMuted text-center mt-5 text-sm">Loading database...</p>
 ) : search.length > 0 && search.length < 2 ? (
 <p className="text-brand-textMuted text-center mt-5 text-sm">Type at least 2 characters...</p>
 ) : searchResults.length === 0 && search.length >= 2 ? (
 <p className="text-brand-textMuted text-center mt-5 text-sm">No foods found.</p>
 ) : (
 searchResults.map(food => (
 <button
 key={food.id}
 onClick={() => { setSelectedFood(food); setStep("quantity"); }}
 className="glass-card rounded-2xl p-4 flex items-center gap-4 border border-brand-border/10 cursor-pointer text-left w-full hover:border-brand-accent/30 transition-colors "
 >
 <div className="min-w-[44px] w-11 h-11 rounded-xl bg-brand-accent/10 flex items-center justify-center text-[22px]">
 🥗
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-brand-text font-bold text-[15px] whitespace-nowrap overflow-hidden text-ellipsis mb-0.5">{food.name}</p>
 <p className="text-brand-textMuted text-xs font-mono">P: {Math.round(food.protein)}g · C: {Math.round(food.carbs)}g · F: {Math.round(food.fat)}g</p>
 </div>
 <div className="text-right min-w-[60px]">
 <p className="text-brand-accent font-extrabold text-[17px] font-mono leading-none">{Math.round(food.calories)}</p>
 <p className="text-brand-textMuted text-[10px] mt-1">per 100g</p>
 </div>
 </button>
 )))}
 </div>
 </div>
 )}

 {step === "quantity" && selectedFood && (
 <div>
 <button onClick={() => setStep("food")} className="flex items-center gap-1.5 text-brand-textMuted bg-transparent border-none cursor-pointer mb-5 hover:text-brand-text transition-colors">
 <ChevronLeftIcon className="w-4 h-4" /> Back
 </button>

 <div className="glass-card rounded-[24px] p-6 mb-6 border border-brand-border/10">
 <p className="text-brand-accent text-xs font-bold uppercase tracking-widest mb-2">Log Item</p>
 <h3 className="text-brand-text text-2xl font-extrabold mb-1">{selectedFood.name}</h3>
 
 <div className="grid grid-cols-4 gap-3 mt-6">
 {[
 { label: "Calories", value: Math.round(selectedFood.calories * ((selectedFood.piece_weight ? quantity * selectedFood.piece_weight : weight) / 100)), colorClass: "text-brand-accent", unit: "kcal" },
 { label: "Protein", value: Math.round(selectedFood.protein * ((selectedFood.piece_weight ? quantity * selectedFood.piece_weight : weight) / 100)), colorClass: "text-blue-500", unit: "g" },
 { label: "Carbs", value: Math.round(selectedFood.carbs * ((selectedFood.piece_weight ? quantity * selectedFood.piece_weight : weight) / 100)), colorClass: "text-orange-500", unit: "g" },
 { label: "Fat", value: Math.round(selectedFood.fat * ((selectedFood.piece_weight ? quantity * selectedFood.piece_weight : weight) / 100)), colorClass: "text-pink-500", unit: "g" },
 ].map((n) => (
 <div key={n.label} className="text-center bg-brand-surfaceLight rounded-xl p-2 border border-brand-border/10">
 <p className={`${n.colorClass} text-lg font-extrabold font-mono leading-tight`}>{n.value}<span className="text-[10px] font-sans font-medium">{n.unit}</span></p>
 <p className="text-brand-textMuted text-[10px] mt-1">{n.label}</p>
 </div>
 ))}
 </div>
 </div>

 {selectedFood.piece_weight ? (
 <div className="glass-card rounded-[24px] p-6 mb-6 border border-brand-border/10">
 <p className="text-brand-text font-bold mb-4">Quantity ({selectedFood.piece_unit || 'pieces'})</p>
 
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
 <p className="text-brand-textMuted text-xs mt-5 text-center font-medium">
 (approx. {Math.round(quantity * selectedFood.piece_weight)}g total)
 </p>
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
 onClick={() => setShowConfirm(true)}
 className="w-full py-4 rounded-2xl bg-brand-accent text-white font-extrabold text-[17px] border-none cursor-pointer shadow-lg shadow-brand-accent/25 hover:bg-brand-accentHover transition-colors"
 >
 Log food →
 </button>
 </div>
 )}
 </div>

 {/* Confirmation Modal */}
 {showConfirm && selectedFood && (
 <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center backdrop-blur-sm">
 <div className="w-full max-w-md glass-card rounded-t-[32px] pt-8 px-6 pb-12 shadow-2xl border-t border-brand-border/10 animate-[slideUp_0.3s_ease-out]">
 <div className="w-12 h-1.5 bg-brand-surfaceLight rounded-full mx-auto mb-8" />
 <div className="text-center mb-8">
 <div className="w-16 h-16 rounded-[20px] bg-brand-accent/10 flex items-center justify-center mx-auto mb-5">
 <CheckIcon className="w-8 h-8 text-brand-accent stroke-[3px]" />
 </div>
 <h3 className="text-brand-text text-[22px] font-extrabold mb-2">Confirm Food Log</h3>
 <p className="text-brand-textMuted text-sm font-medium">Adding to your daily timeline</p>
 </div>

 <div className=" rounded-[24px] p-5 mb-8 border border-brand-border/10">
 <div className="flex justify-between items-center mb-4">
 <div>
 <p className="text-brand-text font-bold text-[17px] mb-0.5">{selectedFood.name}</p>
 <p className="text-brand-textMuted text-sm font-medium">
 {selectedFood.piece_weight ? `${quantity} ${selectedFood.piece_unit || 'qty'}` : `${weight}g`}
 </p>
 </div>
 <p className="text-brand-accent font-extrabold text-2xl font-mono">
 {Math.round(selectedFood.calories * ((selectedFood.piece_weight ? quantity * selectedFood.piece_weight : weight) / 100))} <span className="text-xs text-brand-textMuted font-sans font-medium">kcal</span>
 </p>
 </div>
 <div className="flex gap-3">
 {[
 { l: "Protein", v: Math.round(selectedFood.protein * ((selectedFood.piece_weight ? quantity * selectedFood.piece_weight : weight) / 100)), c: "text-blue-500" },
 { l: "Carbs", v: Math.round(selectedFood.carbs * ((selectedFood.piece_weight ? quantity * selectedFood.piece_weight : weight) / 100)), c: "text-orange-500" },
 { l: "Fat", v: Math.round(selectedFood.fat * ((selectedFood.piece_weight ? quantity * selectedFood.piece_weight : weight) / 100)), c: "text-pink-500" },
 ].map((n) => (
 <div key={n.l} className="flex-1 text-center glass-card rounded-xl py-2.5 border border-brand-border/10">
 <p className={`${n.c} font-extrabold text-[15px] font-mono leading-tight`}>{n.v}g</p>
 <p className="text-brand-textMuted text-[10px] mt-0.5">{n.l}</p>
 </div>
 ))}
 </div>
 </div>

 <div className="flex gap-3">
 <button
 onClick={() => setShowConfirm(false)}
 className="flex-1 py-4 rounded-2xl bg-brand-surfaceLight border border-brand-border/20 text-brand-textMuted font-bold text-[15px] cursor-pointer hover:bg-brand-border/30 transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={handleConfirm}
 className="flex-[2_2_0%] py-4 rounded-2xl bg-brand-accent text-white font-extrabold text-[15px] cursor-pointer shadow-lg shadow-brand-accent/25 hover:bg-brand-accentHover transition-colors"
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
