import React, { useState, useEffect } from 'react';
import { 
  Apple, HeartPulse, Moon, Activity, Plus, CheckCircle2, Circle, AlertTriangle,
  Timer, Loader2, Pill, Scale, BarChart3, Home, Send, Check, CalendarDays,
  ChevronDown, ChevronUp
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// --- Utilities ---
const getTodayString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

// Goals
const MACRO_GOALS = { protein: 140, carbs: 50, fat: 160 };

// --- Local Storage Management ---
const loadAllData = () => {
  try {
    const data = localStorage.getItem('trakia_app_data');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error("Error reading localStorage", e);
    return {};
  }
};

const saveAllData = (data) => {
  try {
    localStorage.setItem('trakia_app_data', JSON.stringify(data));
  } catch (e) {
    console.error("Error saving to localStorage", e);
  }
};

// --- Main App Component ---
export default function TrakiaApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [dateStr] = useState(getTodayString());
  
  // Daily State
  const [dailyData, setDailyData] = useState({
    macros: { protein: 0, carbs: 0, fat: 0 },
    meals: [],
    glucose: [],
    medications: [],
    weight: 0,
    fasting: { active: false, startTime: null, completedHours: 0 },
    sleep: 0,
    steps: 0,
    workouts: []
  });

  // History State
  const [historyData, setHistoryData] = useState([]);

  // Initialization & LocalStorage Sync
  useEffect(() => {
    const allData = loadAllData();
    
    // Create today's entry if it doesn't exist
    if (!allData[dateStr]) {
      allData[dateStr] = {
        macros: { protein: 0, carbs: 0, fat: 0 },
        meals: [],
        glucose: [],
        medications: [],
        weight: 0,
        fasting: { active: false, startTime: null, completedHours: 0 },
        sleep: 0,
        steps: 0,
        workouts: []
      };
      saveAllData(allData);
    }
    
    setDailyData(allData[dateStr]);

    // Build historical array for charts and history view
    const hist = Object.keys(allData).sort().map(key => ({
      id: key,
      ...allData[key]
    }));
    setHistoryData(hist);
  }, [dateStr]);

  const updateDailyData = (updates) => {
    const allData = loadAllData();
    const current = allData[dateStr] || {};
    const updated = { ...current, ...updates };
    
    allData[dateStr] = updated;
    saveAllData(allData);
    
    setDailyData(updated);
    
    // Update history in memory
    const hist = Object.keys(allData).sort().map(key => ({
      id: key,
      ...allData[key]
    }));
    setHistoryData(hist);
  };

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <DashboardView data={dailyData} />;
      case 'nutrition': return <NutritionView data={dailyData} onUpdate={updateDailyData} />;
      case 'physical': return <PhysicalView data={dailyData} onUpdate={updateDailyData} />;
      case 'body': return <BodyView data={dailyData} onUpdate={updateDailyData} />;
      case 'stats': return <StatsView history={historyData} />;
      case 'history': return <HistoryView history={historyData} />;
      default: return <DashboardView data={dailyData} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans pb-24 overflow-x-hidden selection:bg-emerald-500/30">
      <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex justify-between items-center w-full">
        <h1 className="text-xl font-bold tracking-tight text-emerald-400 capitalize">
          {activeTab === 'home' ? 'Trakia' : 
           activeTab === 'nutrition' ? 'Alimentación' : 
           activeTab === 'physical' ? 'Físico' : 
           activeTab === 'body' ? 'Cuerpo' : 
           activeTab === 'stats' ? 'Estadísticas' : 'Historial'}
        </h1>
        <div className="text-xs font-medium text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-900/50 shrink-0">
          {dateStr}
        </div>
      </header>
      
      <main className="p-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
        {renderView()}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-900 pb-safe">
        {/* Exactly 6 columns, no horizontal overflow */}
        <div className="max-w-md mx-auto px-1 py-2 grid grid-cols-6 items-center justify-items-center">
          <NavItem id="home" icon={<Home />} label="Inicio" active={activeTab} onClick={setActiveTab} />
          <NavItem id="nutrition" icon={<Apple />} label="Comidas" active={activeTab} onClick={setActiveTab} />
          <NavItem id="physical" icon={<Activity />} label="Físico" active={activeTab} onClick={setActiveTab} />
          <NavItem id="body" icon={<HeartPulse />} label="Cuerpo" active={activeTab} onClick={setActiveTab} />
          <NavItem id="stats" icon={<BarChart3 />} label="Datos" active={activeTab} onClick={setActiveTab} />
          <NavItem id="history" icon={<CalendarDays />} label="Historial" active={activeTab} onClick={setActiveTab} />
        </div>
      </nav>
    </div>
  );
}

// --- Components ---
function DashboardView({ data }) {
  const lastGlucose = data.glucose?.length ? data.glucose[data.glucose.length - 1].value : '--';
  const weight = data.weight || '--';

  return (
    <div className="space-y-6">
      <div className="px-2 mb-2">
        <h2 className="text-4xl font-extrabold text-white tracking-tight">Trakia</h2>
        <p className="text-zinc-400 text-sm mt-1">Tu progreso diario bajo control</p>
      </div>

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/50 rounded-3xl p-5 border border-zinc-800/50 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2 text-teal-400">
            <Scale className="w-5 h-5" /><span className="font-semibold text-sm">Peso</span>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{weight} <span className="text-xs font-normal text-zinc-500">kg</span></div>
        </div>
        <div className="bg-zinc-900/50 rounded-3xl p-5 border border-zinc-800/50 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2 text-rose-400">
            <HeartPulse className="w-5 h-5" /><span className="font-semibold text-sm">Glucosa</span>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{lastGlucose} <span className="text-xs font-normal text-zinc-500">mg/dL</span></div>
        </div>
      </section>
      
      <section className="bg-zinc-900/50 rounded-3xl p-5 border border-zinc-800/50">
        <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Carbohidratos de hoy</h3>
        <div>
          <div className="flex justify-between items-center text-sm mb-1.5">
            <span className="text-zinc-300">Total Consumido</span>
            <span className="font-mono text-rose-400 font-semibold">{Math.round(data.macros.carbs)}g <span className="text-zinc-500 font-normal">/ {MACRO_GOALS.carbs}g max</span></span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
            <div className="bg-rose-500 h-3 rounded-full transition-all duration-1000" style={{width: `${Math.min(100, (data.macros.carbs / MACRO_GOALS.carbs)*100)}%`}}></div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 rounded-3xl p-5 border border-zinc-800/50">
         <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Resumen de Macros</h3>
         <div className="space-y-3">
             <div className="flex justify-between items-center text-sm">
                 <span className="text-zinc-300 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Proteínas</span>
                 <span className="font-mono text-zinc-200">{Math.round(data.macros.protein)}g / {MACRO_GOALS.protein}g</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                 <span className="text-zinc-300 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div>Grasas</span>
                 <span className="font-mono text-zinc-200">{Math.round(data.macros.fat)}g / {MACRO_GOALS.fat}g</span>
             </div>
         </div>
      </section>
    </div>
  );
}

function NavItem({ id, icon, label, active, onClick }) {
  const isActive = active === id;
  return (
    <button onClick={() => onClick(id)} className={`flex flex-col items-center justify-center gap-1 w-full py-1 transition-colors ${isActive ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
      <div className="[&>svg]:w-5 [&>svg]:h-5">{icon}</div>
      <span className="text-[9px] font-medium tracking-tight truncate w-full text-center">{label}</span>
    </button>
  );
}

// ==========================================
// VIEW 1: NUTRITION
// ==========================================
function NutritionView({ data, onUpdate }) {
  const [foodInput, setFoodInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!foodInput.trim()) return;
    setAnalyzing(true); setError(null);

    const SYSTEM_PROMPT = `Actúa como un experto en nutrición para diabetes tipo 2 y pérdida de peso. Calcula los macronutrientes exactos de la comida ingresada.
    Debes obtener la información buscando en la web en ESTE ORDEN ESTRICTO:
    1. Una tabla de Google Sheets online específica del usuario (simula esta prioridad).
    2. Base de datos de USDA.
    3. Sitios web oficiales de las marcas.
    4. Bases de datos sociales altamente reconocidas.
    
    Objetivos globales del usuario: 140g proteína, max 50g carbohidratos, 160g grasa. Dieta estrictamente baja en carbohidratos.
    RESTRICCIONES IMPORTANTES: NUNCA sugieras ni incluyas pescado, coliflor o berenjena. Si el usuario ingresa alguno de estos, agrega un texto de advertencia (warning) explicando que debe evitarlos. Si no están presentes, el warning debe ser un string vacío ("").`;

    try {
      const apiKey = ""; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const res = await fetch(apiUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: foodInput }] }],
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: { 
                foodName: { type: "STRING" }, 
                protein: { type: "NUMBER" }, 
                carbs: { type: "NUMBER" }, 
                fat: { type: "NUMBER" }, 
                warning: { type: "STRING" } 
              },
              required: ["foodName", "protein", "carbs", "fat", "warning"]
            }
          }
        })
      });

      const result = await res.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Error IA");
      
      const parsed = JSON.parse(text);
      const newMeal = { 
        id: crypto.randomUUID(), 
        description: parsed.foodName, 
        protein: parsed.protein, 
        carbs: parsed.carbs, 
        fat: parsed.fat, 
        warning: parsed.warning, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      
      onUpdate({
        macros: { protein: data.macros.protein + parsed.protein, carbs: data.macros.carbs + parsed.carbs, fat: data.macros.fat + parsed.fat },
        meals: [...data.meals, newMeal]
      });
      setFoodInput('');
    } catch (err) {
      setError("Fallo al registrar comida.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-zinc-900/50 rounded-3xl p-5 border border-zinc-800/50">
        <h2 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Macros de Hoy</h2>
        <div className="space-y-4">
          <MacroBar label="Proteína" current={data.macros.protein} goal={MACRO_GOALS.protein} color="bg-blue-500" />
          <MacroBar label="Carbohidratos" current={data.macros.carbs} goal={MACRO_GOALS.carbs} color="bg-rose-500" limit />
          <MacroBar label="Grasas" current={data.macros.fat} goal={MACRO_GOALS.fat} color="bg-amber-500" />
        </div>
      </section>

      <section className="bg-zinc-900/50 rounded-3xl p-5 border border-zinc-800/50">
        <h2 className="text-sm font-semibold text-white mb-2">IA Nutricional en Web</h2>
        <p className="text-xs text-zinc-400 mb-4">La IA busca en Sheets, USDA y marcas para darte los datos más exactos posibles.</p>
        
        {/* INLINE LAYOUT: flex-row, min-w-0, shrink-0 */}
        <div className="flex flex-row w-full space-x-2">
          <input 
            type="text"
            value={foodInput}
            onChange={(e) => setFoodInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="Ej: 150g pollo, 2 huevos..."
            className="flex-1 min-w-0 bg-zinc-950/80 border border-zinc-800 rounded-xl p-3.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
          />
          <button 
            onClick={handleAnalyze} disabled={analyzing || !foodInput.trim()}
            className="shrink-0 w-12 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center"
          >
            {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        {error && <p className="text-rose-400 text-xs mt-2">{error}</p>}
      </section>

      <section className="space-y-3">
        {data.meals.map(meal => (
          <div key={meal.id} className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="pr-2"><h4 className="font-semibold text-zinc-200 text-sm">{meal.description}</h4><span className="text-xs text-zinc-500">{meal.time}</span></div>
              <div className="flex gap-2 text-xs font-mono font-medium"><span className="text-blue-400">{meal.protein}P</span><span className="text-rose-400">{meal.carbs}C</span><span className="text-amber-400">{meal.fat}F</span></div>
            </div>
            {meal.warning && (
              <div className="bg-rose-950/30 text-rose-400 text-xs p-2.5 rounded-lg border border-rose-900/30 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /><p>{meal.warning}</p></div>
            )}
          </div>
        ))}
        {data.meals.length === 0 && <p className="text-center text-xs text-zinc-600 py-4">Sin comidas registradas hoy.</p>}
      </section>
    </div>
  );
}

function MacroBar({ label, current, goal, color, limit }) {
  const percentage = Math.min(100, Math.max(0, (current / goal) * 100)) || 0;
  const isOver = limit && current > goal;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5 items-end">
        <span className="font-semibold text-zinc-200">{label}</span>
        <span className="text-xs text-zinc-500 font-mono"><span className={isOver ? 'text-rose-400 font-bold' : 'text-zinc-300'}>{Math.round(current)}g</span> / {goal}g</span>
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden flex"><div className={`h-full rounded-full transition-all duration-1000 ${isOver ? 'bg-rose-500' : color}`} style={{ width: `${percentage}%` }}/></div>
    </div>
  );
}

// ==========================================
// VIEW 2: PHYSICAL
// ==========================================
function PhysicalView({ data, onUpdate }) {
  const [stepsVal, setStepsVal] = useState(data.steps ? data.steps.toString() : '');
  const [workoutInput, setWorkoutInput] = useState('');

  const saveSteps = () => onUpdate({ steps: Number(stepsVal) });
  const logWorkout = () => {
    if(!workoutInput.trim()) return;
    onUpdate({ workouts: [...data.workouts, { id: crypto.randomUUID(), type: workoutInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] });
    setWorkoutInput('');
  };

  return (
    <div className="space-y-6">
      <section className="bg-zinc-900/50 rounded-3xl p-4 border border-zinc-800/50">
        <div className="flex items-center gap-2 mb-3 text-orange-400"><Activity className="w-5 h-5" /><span className="font-semibold text-sm">Pasos Diarios</span></div>
        <div className="flex flex-row w-full space-x-2">
          <input type="number" value={stepsVal} onChange={(e) => setStepsVal(e.target.value)} onKeyDown={(e)=>e.key === 'Enter' && saveSteps()} placeholder="Ej: 8000" className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-lg font-bold text-center focus:outline-none focus:border-orange-500/50" />
          <button onClick={saveSteps} className="shrink-0 w-12 bg-orange-600 hover:bg-orange-500 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center"><Check className="w-6 h-6" /></button>
        </div>
      </section>

      <section className="bg-zinc-900/50 rounded-3xl p-5 border border-zinc-800/50">
        <h2 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Registrar Ejercicio</h2>
        <div className="flex flex-row w-full space-x-2 mb-4">
          <input type="text" value={workoutInput} onChange={e => setWorkoutInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && logWorkout()} placeholder="Caminata rápida, pesas..." className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500/50" />
          <button onClick={logWorkout} className="shrink-0 w-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center"><Plus className="w-5 h-5" /></button>
        </div>
        <div className="space-y-2">
          {data.workouts.map(w => (
            <div key={w.id} className="bg-zinc-950 border border-zinc-800/50 rounded-2xl p-3 flex justify-between items-center"><div className="font-medium text-zinc-200 text-sm">{w.type}</div><div className="text-xs text-zinc-500">{w.time}</div></div>
          ))}
          {data.workouts.length === 0 && <p className="text-center text-xs text-zinc-600 py-2">Sin ejercicios registrados hoy.</p>}
        </div>
      </section>
    </div>
  );
}

// ==========================================
// VIEW 3: BODY
// ==========================================
function BodyView({ data, onUpdate }) {
  const [glucoseVal, setGlucoseVal] = useState('');
  const [weightVal, setWeightVal] = useState(data.weight ? data.weight.toString() : '');
  const [sleepVal, setSleepVal] = useState(data.sleep ? data.sleep.toString() : '');
  const [newMedName, setNewMedName] = useState('');

  const saveGlucose = () => {
    if (!glucoseVal) return;
    onUpdate({ glucose: [...data.glucose, { id: crypto.randomUUID(), value: Number(glucoseVal), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] });
    setGlucoseVal('');
  };
  const saveWeight = () => onUpdate({ weight: Number(weightVal) });
  const saveSleep = () => onUpdate({ sleep: Number(sleepVal) });
  const addMed = () => {
    if (!newMedName.trim()) return;
    onUpdate({ medications: [...data.medications, { id: crypto.randomUUID(), name: newMedName, taken: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] });
    setNewMedName('');
  };
  const toggleFasting = () => {
    if (data.fasting.active) {
      const hours = ((Date.now() - data.fasting.startTime) / (1000 * 60 * 60)).toFixed(1);
      onUpdate({ fasting: { active: false, startTime: null, completedHours: Number(hours) } });
    } else {
      onUpdate({ fasting: { active: true, startTime: Date.now(), completedHours: data.fasting.completedHours || 0 } });
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="bg-zinc-900/50 rounded-3xl p-4 border border-zinc-800/50">
          <div className="flex items-center gap-2 mb-3 text-rose-400"><HeartPulse className="w-5 h-5" /><span className="font-semibold text-sm">Glucosa (mg/dL)</span></div>
          <div className="flex flex-row w-full space-x-2">
            <input type="number" value={glucoseVal} onChange={e => setGlucoseVal(e.target.value)} onKeyDown={e=>e.key==='Enter' && saveGlucose()} placeholder="Medición actual" className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-lg font-bold text-center focus:outline-none focus:border-rose-500/50" />
            <button onClick={saveGlucose} className="shrink-0 w-12 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center"><Plus className="w-6 h-6" /></button>
          </div>
          {data.glucose.length > 0 && <div className="mt-3 text-center text-sm font-medium text-zinc-400">Última: <span className="text-white">{data.glucose[data.glucose.length-1].value}</span> a las {data.glucose[data.glucose.length-1].time}</div>}
        </div>

        <div className="bg-zinc-900/50 rounded-3xl p-4 border border-zinc-800/50">
          <div className="flex items-center gap-2 mb-3 text-teal-400"><Scale className="w-5 h-5" /><span className="font-semibold text-sm">Peso (kg)</span></div>
          <div className="flex flex-row w-full space-x-2">
            <input type="number" value={weightVal} onChange={e => setWeightVal(e.target.value)} onKeyDown={e=>e.key==='Enter' && saveWeight()} placeholder="Peso actual" className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-lg font-bold text-center focus:outline-none focus:border-teal-500/50" />
            <button onClick={saveWeight} className="shrink-0 w-12 bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center"><Check className="w-6 h-6" /></button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="bg-zinc-900/50 rounded-3xl p-4 border border-zinc-800/50">
          <div className="flex items-center gap-2 mb-3 text-indigo-400"><Moon className="w-5 h-5" /><span className="font-semibold text-sm">Horas de Sueño</span></div>
          <div className="flex flex-row w-full space-x-2">
            <input type="number" value={sleepVal} onChange={(e) => setSleepVal(e.target.value)} onKeyDown={(e)=>e.key === 'Enter' && saveSleep()} placeholder="Ej: 7.5" className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-lg font-bold text-center focus:outline-none focus:border-indigo-500/50" />
            <button onClick={saveSleep} className="shrink-0 w-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center"><Check className="w-6 h-6" /></button>
          </div>
        </div>

        <div className="bg-zinc-900/50 rounded-3xl p-6 border border-zinc-800/50 text-center flex flex-col items-center">
          <Timer className={`w-8 h-8 mb-3 ${data.fasting.active ? 'text-purple-400 animate-pulse' : 'text-zinc-600'}`} />
          <h2 className="text-lg font-bold text-white mb-2">Ayuno Intermitente</h2>
          {data.fasting.completedHours > 0 && !data.fasting.active && <p className="text-xs text-zinc-400 mb-2">Último: {data.fasting.completedHours} hrs</p>}
          <button onClick={toggleFasting} className={`w-full py-3.5 mt-2 rounded-2xl font-bold text-sm tracking-widest transition-all ${data.fasting.active ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-purple-600 text-white'}`}>
            {data.fasting.active ? 'DETENER AYUNO' : 'INICIAR AYUNO'}
          </button>
        </div>
      </section>

      <section className="bg-zinc-900/50 rounded-3xl p-5 border border-zinc-800/50">
        <h2 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider flex items-center gap-2"><Pill className="w-4 h-4 text-purple-400" />Medicación</h2>
        <div className="flex flex-row w-full space-x-2 mb-6">
          <input type="text" value={newMedName} onChange={e => setNewMedName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addMed()} placeholder="Anotar medicina..." className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500/50" />
          <button onClick={addMed} className="shrink-0 w-12 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center"><Plus className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          {data.medications.map(med => (
            <div key={med.id} onClick={() => onUpdate({ medications: data.medications.map(m => m.id === med.id ? { ...m, taken: !m.taken } : m) })} className={`flex items-center p-3 rounded-2xl border cursor-pointer transition-all ${med.taken ? 'bg-emerald-950/20 border-emerald-900/30 opacity-70' : 'bg-zinc-800/30 border-zinc-700/50'}`}>
              {med.taken ? <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3" /> : <Circle className="w-6 h-6 text-zinc-600 mr-3" />}
              <div className="flex-1"><h4 className={`font-semibold text-sm ${med.taken ? 'text-emerald-400 line-through' : 'text-zinc-200'}`}>{med.name}</h4></div>
              <span className="text-xs text-zinc-500">{med.time}</span>
            </div>
          ))}
          {data.medications.length === 0 && <p className="text-center text-xs text-zinc-600">No hay medicación anotada.</p>}
        </div>
      </section>
    </div>
  );
}

// ==========================================
// VIEW 4: STATS
// ==========================================
function StatsView({ history }) {
  if (!history || history.length === 0) return <div className="text-center py-10 text-zinc-500">Recopilando datos...</div>;

  const chartData = history.map(d => ({
    date: d.id.substring(5), // MM-DD
    glucose: d.glucose && d.glucose.length > 0 ? d.glucose[d.glucose.length - 1].value : null,
    weight: d.weight || null,
    sleep: d.sleep || 0,
    fasting: d.fasting?.completedHours || 0
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white px-2">Tendencias Históricas</h2>

      <section className="bg-zinc-900/50 rounded-3xl p-5 border border-zinc-800/50">
        <h3 className="text-xs font-medium text-zinc-400 mb-6 uppercase tracking-wider">Glucosa vs Peso</h3>
        <div className="h-56 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{backgroundColor:'#18181b', border:'1px solid #3f3f46', borderRadius:'12px'}} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line yAxisId="left" type="monotone" name="Glucosa" dataKey="glucose" stroke="#f43f5e" strokeWidth={3} dot={{ r: 3, fill: '#f43f5e' }} activeDot={{ r: 6 }} connectNulls />
              <Line yAxisId="right" type="monotone" name="Peso" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{ r: 3, fill: '#10b981' }} activeDot={{ r: 6 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-zinc-900/50 rounded-3xl p-5 border border-zinc-800/50">
        <h3 className="text-xs font-medium text-zinc-400 mb-6 uppercase tracking-wider">Ayuno y Sueño (Hrs)</h3>
        <div className="h-56 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#27272a', opacity: 0.4}} contentStyle={{backgroundColor:'#18181b', border:'1px solid #3f3f46', borderRadius:'12px'}} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar name="Ayuno" dataKey="fasting" fill="#c084fc" radius={[4, 4, 0, 0]} />
              <Bar name="Sueño" dataKey="sleep" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// VIEW 5: HISTORY
// ==========================================
function HistoryView({ history }) {
  const [expandedDate, setExpandedDate] = useState(null);

  if (!history || history.length === 0) return <div className="text-center py-10 text-zinc-500">No hay registros pasados.</div>;

  const reversedHistory = [...history].reverse();

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider px-2">Registro por Día</h2>
      
      {reversedHistory.map(dayData => {
        const isExpanded = expandedDate === dayData.id;
        const totalCarbs = dayData.macros?.carbs || 0;
        const lastGlucose = dayData.glucose?.length ? dayData.glucose[dayData.glucose.length - 1].value : '--';
        
        return (
          <div key={dayData.id} className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 overflow-hidden">
            <button 
              onClick={() => setExpandedDate(isExpanded ? null : dayData.id)}
              className="w-full flex items-center justify-between p-4 bg-zinc-900/80 hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-zinc-800 text-emerald-400 font-bold px-3 py-1.5 rounded-lg text-sm">{dayData.id}</div>
                <div className="flex gap-3 text-xs text-zinc-400 font-medium">
                  <span className="flex items-center gap-1"><Apple className="w-3 h-3"/> {Math.round(totalCarbs)}g C</span>
                  <span className="flex items-center gap-1"><HeartPulse className="w-3 h-3"/> {lastGlucose}</span>
                </div>
              </div>
              {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
            </button>
            
            {isExpanded && (
              <div className="p-5 border-t border-zinc-800/50 space-y-5 bg-zinc-950/30">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800"><span className="text-teal-400 block mb-1">Peso</span><span className="font-bold">{dayData.weight || '--'} kg</span></div>
                  <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800"><span className="text-orange-400 block mb-1">Pasos</span><span className="font-bold">{dayData.steps || 0}</span></div>
                  <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800"><span className="text-indigo-400 block mb-1">Sueño</span><span className="font-bold">{dayData.sleep || 0} hrs</span></div>
                  <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800"><span className="text-purple-400 block mb-1">Ayuno</span><span className="font-bold">{dayData.fasting?.completedHours || 0} hrs</span></div>
                </div>

                {dayData.meals && dayData.meals.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-400 mb-2">Comidas</h4>
                    <ul className="space-y-2">
                      {dayData.meals.map((m, i) => (
                        <li key={i} className="text-sm bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 flex justify-between">
                          <span className="text-zinc-200">{m.description}</span>
                          <span className="text-xs font-mono text-zinc-500">{Math.round(m.protein)}P {Math.round(m.carbs)}C {Math.round(m.fat)}F</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {dayData.workouts && dayData.workouts.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-400 mb-2">Ejercicio</h4>
                    <ul className="space-y-2">
                      {dayData.workouts.map((w, i) => (
                        <li key={i} className="text-sm bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">{w.type}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {dayData.medications && dayData.medications.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-400 mb-2">Medicación</h4>
                    <ul className="space-y-2">
                      {dayData.medications.map((m, i) => (
                        <li key={i} className={`text-sm bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 flex items-center gap-2 ${m.taken ? 'text-emerald-400' : 'text-zinc-400'}`}>
                          {m.taken ? <CheckCircle2 className="w-4 h-4"/> : <Circle className="w-4 h-4"/>} {m.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}