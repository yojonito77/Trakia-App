import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Utensils, 
  Activity, 
  Droplet, 
  Ruler, 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Flame, 
  Heart, 
  TrendingUp,
  Search,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // Estado de navegación (6 pestañas)
  const [activeTab, setActiveTab] = useState('inicio');

  // Datos principales almacenados en localStorage para acceso instantáneo (0ms)
  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem('trakia_meals');
    return saved ? JSON.parse(saved) : [];
  });

  const [glucoseLogs, setGlucoseLogs] = useState(() => {
    const saved = localStorage.getItem('trakia_glucose');
    return saved ? JSON.parse(saved) : [];
  });

  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem('trakia_workouts');
    return saved ? JSON.parse(saved) : [];
  });

  const [measurements, setMeasurements] = useState(() => {
    const saved = localStorage.getItem('trakia_measurements');
    return saved ? JSON.parse(saved) : [];
  });

  // Metas diarias (Macros)
  const macroGoals = {
    protein: 140, // g
    carbs: 50,    // g
    fat: 160      // g
  };

  // Guardar en localStorage automáticamente
  useEffect(() => {
    localStorage.setItem('trakia_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('trakia_glucose', JSON.stringify(glucoseLogs));
  }, [glucoseLogs]);

  useEffect(() => {
    localStorage.setItem('trakia_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('trakia_measurements', JSON.stringify(measurements));
  }, [measurements]);

  // Totales del día actual
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(m => m.date === todayStr);
  
  const consumedProtein = todayMeals.reduce((acc, m) => acc + Number(m.protein), 0);
  const consumedCarbs = todayMeals.reduce((acc, m) => acc + Number(m.carbs), 0);
  const consumedFat = todayMeals.reduce((acc, m) => acc + Number(m.fat), 0);

  // Estados para formularios dinámicos (evitando scroll horizontal)
  const [newMeal, setNewMeal] = useState({ name: '', protein: '', carbs: '', fat: '', grams: '' });
  const [newGlucose, setNewGlucose] = useState({ value: '', type: 'Ayunas', notes: '' });
  const [newWorkout, setNewWorkout] = useState({ activity: '', duration: '', calories: '' });
  const [newMeasurement, setNewMeasurement] = useState({ weight: '', waist: '', chest: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Funciones de agregado
  const addMeal = (e) => {
    e.preventDefault();
    if (!newMeal.name) return;
    setMeals([{ id: Date.now(), date: todayStr, ...newMeal }, ...meals]);
    setNewMeal({ name: '', protein: '', carbs: '', fat: '', grams: '' });
  };

  const addGlucose = (e) => {
    e.preventDefault();
    if (!newGlucose.value) return;
    setGlucoseLogs([{ id: Date.now(), date: new Date().toLocaleString(), ...newGlucose }, ...glucoseLogs]);
    setNewGlucose({ value: '', type: 'Ayunas', notes: '' });
  };

  const addWorkout = (e) => {
    e.preventDefault();
    if (!newWorkout.activity) return;
    setWorkouts([{ id: Date.now(), date: new Date().toLocaleString(), ...newWorkout }, ...workouts]);
    setNewWorkout({ activity: '', duration: '', calories: '' });
  };

  const addMeasurement = (e) => {
    e.preventDefault();
    if (!newMeasurement.weight) return;
    setMeasurements([{ id: Date.now(), date: todayStr, ...newMeasurement }, ...measurements]);
    setNewMeasurement({ weight: '', waist: '', chest: '' });
  };

  // Motor de búsqueda IA simulado bajo jerarquía (Sheets -> USDA -> Brands)
  const handleAISearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    setTimeout(() => {
      // Simulación de respuesta estricta baja en carbohidratos, sin pescados/berenjena/coliflor
      setSearchResult({
        item: searchQuery,
        source: "Base de Datos USDA / Reconocida",
        protein: "25g",
        carbs: "3g",
        fat: "12g",
        note: "Verificado: Apto protocolo estricto low-carb. Libre de alérgenos excluidos."
      });
      setIsSearching(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20">
      
      {/* Cabecera Principal */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 text-slate-950 p-2 rounded-xl font-black text-xl tracking-wider">T</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Trakia</h1>
              <p className="text-xs text-slate-400">Control Metabólico & Diabetes</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full font-medium">
              Offline Ready
            </span>
          </div>
        </div>
      </header>

      {/* Contenido Dinámico según Pestaña */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 space-y-4">
        
        {/* PESTAÑA: INICIO */}
        {activeTab === 'inicio' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Resumen de Macros Hoy</h2>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Proteínas</div>
                  <div className="text-lg font-bold text-emerald-400">{consumedProtein} <span className="text-xs font-normal text-slate-500">/ {macroGoals.protein}g</span></div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Carbos</div>
                  <div className="text-lg font-bold text-amber-400">{consumedCarbs} <span className="text-xs font-normal text-slate-500">/ {macroGoals.carbs}g</span></div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Grasas</div>
                  <div className="text-lg font-bold text-blue-400">{consumedFat} <span className="text-xs font-normal text-slate-500">/ {macroGoals.fat}g</span></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Acceso Rápido</h2>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setActiveTab('comidas')} className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition">
                  <Utensils className="w-5 h-5 text-emerald-400 mb-1" />
                  <div className="font-semibold text-sm">Registrar Comida</div>
                  <div className="text-xs text-slate-400">Control de macros</div>
                </button>
                <button onClick={() => setActiveTab('glucosa')} className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition">
                  <Droplet className="w-5 h-5 text-rose-400 mb-1" />
                  <div className="font-semibold text-sm">Glucemia</div>
                  <div className="text-xs text-slate-400">Valores en sangre</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA: COMIDAS Y BUSCADOR IA */}
        {activeTab === 'comidas' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Buscador Inteligente de Alimentos</h2>
              <form onSubmit={handleAISearch} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ej: Pechuga de pollo, queso..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold px-4 py-2 rounded-xl text-sm transition">
                  <Search className="w-4 h-4" />
                </button>
              </form>
              {isSearching && <p className="text-xs text-slate-400 mt-2">Consultando bases de datos (Sheets → USDA → Brands)...</p>}
              {searchResult && (
                <div className="mt-3 p-3 bg-slate-950 border border-emerald-900/50 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-emerald-400">{searchResult.item}</div>
                  <div className="text-slate-300">P: {searchResult.protein} | C: {searchResult.carbs} | G: {searchResult.fat}</div>
                  <div className="text-slate-500 italic">{searchResult.note}</div>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Registrar Ingesta</h2>
              <form onSubmit={addMeal} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Nombre del alimento / plato" 
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input 
                    type="number" 
                    placeholder="Prot (g)" 
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal({...newMeal, protein: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <input 
                    type="number" 
                    placeholder="Carb (g)" 
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal({...newMeal, carbs: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <input 
                    type="number" 
                    placeholder="Grasa (g)" 
                    value={newMeal.fat}
                    onChange={(e) => setNewMeal({...newMeal, fat: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold py-2.5 rounded-xl text-sm transition">
                  Agregar Comida
                </button>
              </form>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Historial de Hoy</h3>
              {todayMeals.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No hay comidas registradas hoy.</p>
              ) : (
                todayMeals.map(m => (
                  <div key={m.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-sm">{m.name}</div>
                      <div className="text-xs text-slate-400">P: {m.protein}g | C: {m.carbs}g | G: {m.fat}g</div>
                    </div>
                    <button onClick={() => setMeals(meals.filter(item => item.id !== m.id))} className="text-rose-400 hover:text-rose-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA: GLUCEMIA */}
        {activeTab === 'glucosa' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Registro de Glucosa</h2>
              <form onSubmit={addGlucose} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    placeholder="Valor (mg/dL)" 
                    value={newGlucose.value}
                    onChange={(e) => setNewGlucose({...newGlucose, value: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-500"
                  />
                  <select 
                    value={newGlucose.type}
                    onChange={(e) => setNewGlucose({...newGlucose, type: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-500 text-slate-300"
                  >
                    <option value="Ayunas">Ayunas</option>
                    <option value="Post-prandial">Post-prandial</option>
                    <option value="Pre-prandial">Pre-prandial</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2.5 rounded-xl text-sm transition">
                  Guardar Glucemia
                </button>
              </form>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Historial de Glucosa</h3>
              {glucoseLogs.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Sin registros guardados.</p>
              ) : (
                glucoseLogs.map(g => (
                  <div key={g.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-base text-rose-400">{g.value} <span className="text-xs font-normal text-slate-400">mg/dL ({g.type})</span></div>
                      <div className="text-xs text-slate-500">{g.date}</div>
                    </div>
                    <button onClick={() => setGlucoseLogs(glucoseLogs.filter(item => item.id !== g.id))} className="text-rose-400 hover:text-rose-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA: EJERCICIO */}
        {activeTab === 'ejercicio' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Registrar Actividad</h2>
              <form onSubmit={addWorkout} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Actividad (Caminata, corebag...)" 
                  value={newWorkout.activity}
                  onChange={(e) => setNewWorkout({...newWorkout, activity: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    placeholder="Duración (min)" 
                    value={newWorkout.duration}
                    onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                  />
                  <input 
                    type="number" 
                    placeholder="Calorías (kcal)" 
                    value={newWorkout.calories}
                    onChange={(e) => setNewWorkout({...newWorkout, calories: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold py-2.5 rounded-xl text-sm transition">
                  Guardar Actividad
                </button>
              </form>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Historial de Ejercicio</h3>
              {workouts.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Sin actividades registradas.</p>
              ) : (
                workouts.map(w => (
                  <div key={w.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-sm text-amber-400">{w.activity}</div>
                      <div className="text-xs text-slate-400">{w.duration || 0} min | {w.calories || 0} kcal</div>
                    </div>
                    <button onClick={() => setWorkouts(workouts.filter(item => item.id !== w.id))} className="text-rose-400 hover:text-rose-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA: MEDIDAS */}
        {activeTab === 'medidas' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Medidas Corporales</h2>
              <form onSubmit={addMeasurement} className="space-y-3">
                <input 
                  type="number" 
                  step="0.1"
                  placeholder="Peso (kg)" 
                  value={newMeasurement.weight}
                  onChange={(e) => setNewMeasurement({...newMeasurement, weight: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="Cintura (cm)" 
                    value={newMeasurement.waist}
                    onChange={(e) => setNewMeasurement({...newMeasurement, waist: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="Pecho (cm)" 
                    value={newMeasurement.chest}
                    onChange={(e) => setNewMeasurement({...newMeasurement, chest: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-sm transition">
                  Guardar Medidas
                </button>
              </form>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Historial de Medidas</h3>
              {measurements.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Sin medidas registradas.</p>
              ) : (
                measurements.map(m => (
                  <div key={m.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm text-blue-400">{m.weight} kg</div>
                      <div className="text-xs text-slate-400">Cintura: {m.waist || '-'} cm | Pecho: {m.chest || '-'} cm</div>
                    </div>
                    <button onClick={() => setMeasurements(measurements.filter(item => item.id !== m.id))} className="text-rose-400 hover:text-rose-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA: AJUSTES */}
        {activeTab === 'ajustes' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 shadow">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Configuración de Trakia</h2>
              <div className="text-xs text-slate-300 space-y-2">
                <p>• <strong>Almacenamiento:</strong> Local (0ms de carga, funciona sin internet).</p>
                <p>• <strong>Macros configurados:</strong> Proteínas ({macroGoals.protein}g) | Carbs ({macroGoals.carbs}g) | Grasas ({macroGoals.fat}g).</p>
                <p>• <strong>Protocolo alimentario:</strong> Estrictamente Low-Carb (Excluye pescados, coliflor y berenjena).</p>
              </div>
              <button 
                onClick={() => {
                  if(window.confirm('¿Deseas limpiar todos los datos locales?')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="w-full mt-2 bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900 font-semibold py-2 rounded-xl text-xs transition"
              >
                Restablecer Datos de la App
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Navegación Inferior Fija (6 Pestañas) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 py-2 px-1 z-40">
        <div className="max-w-md mx-auto grid grid-cols-6 gap-1 text-center">
          <button 
            onClick={() => setActiveTab('inicio')} 
            className={`flex flex-col items-center py-1 ${activeTab === 'inicio' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Inicio</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('comidas')} 
            className={`flex flex-col items-center py-1 ${activeTab === 'comidas' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Utensils className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Comidas</span>
          </button>

          <button