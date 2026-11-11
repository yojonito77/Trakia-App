import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Utensils, 
  Activity, 
  Droplet, 
  Ruler, 
  Settings, 
  Trash2, 
  Search,
  Globe,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Base de referencia universal integrada (Valores cada 100g)
const UNIVERSAL_FOOD_DB = [
  { name: 'Pechuga de pollo (cocida)', protein: 31, carbs: 0, fat: 3.6, source: 'Base Universal USDA' },
  { name: 'Muslo de pollo (con piel)', protein: 24, carbs: 0, fat: 13, source: 'Base Universal USDA' },
  { name: 'Carne vacuna magra (bife/lomo)', protein: 26, carbs: 0, fat: 10, source: 'Base Universal USDA' },
  { name: 'Bife de chorizo / Entrecot', protein: 24, carbs: 0, fat: 18, source: 'Base Universal USDA' },
  { name: 'Asado / Tira de asado', protein: 22, carbs: 0, fat: 25, source: 'Base Universal USDA' },
  { name: 'Carne picada común', protein: 20, carbs: 0, fat: 18, source: 'Base Universal USDA' },
  { name: 'Bondiola de cerdo', protein: 21, carbs: 0, fat: 22, source: 'Base Universal USDA' },
  { name: 'Carré de cerdo', protein: 27, carbs: 0, fat: 7, source: 'Base Universal USDA' },
  { name: 'Huevo entero de gallina', protein: 13, carbs: 1.1, fat: 11, source: 'Base Universal USDA' },
  { name: 'Clara de huevo', protein: 11, carbs: 0.7, fat: 0.2, source: 'Base Universal USDA' },
  { name: 'Queso cremoso / Cuartirolo', protein: 21, carbs: 1.5, fat: 22, source: 'Base Lácteos Estándar' },
  { name: 'Queso Pategrás / Dambo / Gouda', protein: 25, carbs: 1.5, fat: 28, source: 'Base Lácteos Estándar' },
  { name: 'Queso Mozzarella', protein: 22, carbs: 2.2, fat: 22, source: 'Base Universal USDA' },
  { name: 'Queso Reggianito / Parmesano', protein: 35, carbs: 3.2, fat: 25, source: 'Base Universal USDA' },
  { name: 'Queso crema / Blanco untable', protein: 8, carbs: 4, fat: 24, source: 'Base Lácteos Estándar' },
  { name: 'Jamón cocido natural', protein: 19, carbs: 1.5, fat: 5, source: 'Base Universal USDA' },
  { name: 'Panceta / Tocino', protein: 14, carbs: 1.4, fat: 40, source: 'Base Universal USDA' },
  { name: 'Palta / Aguacate', protein: 2, carbs: 1.8, fat: 15, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Aceite de oliva / Girasol', protein: 0, carbs: 0, fat: 100, source: 'Base Universal USDA' },
  { name: 'Manteca / Mantequilla', protein: 0.9, carbs: 0.1, fat: 81, source: 'Base Universal USDA' },
  { name: 'Crema de leche', protein: 2, carbs: 3, fat: 36, source: 'Base Universal USDA' },
  { name: 'Almendras', protein: 21, carbs: 9, fat: 50, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Nueces', protein: 15, carbs: 7, fat: 65, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Maní tostado', protein: 26, carbs: 8, fat: 49, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Lechuga / Rúcula / Espinaca', protein: 1.5, carbs: 1.5, fat: 0.2, source: 'Base Universal USDA' },
  { name: 'Tomate redondo / Perita', protein: 0.9, carbs: 2.7, fat: 0.2, source: 'Base Universal USDA' },
  { name: 'Brócoli cocido', protein: 2.4, carbs: 4, fat: 0.4, source: 'Base Universal USDA' }
];

// Diccionario rápido Español -> Inglés para mejorar resultados directos en la API de USDA (EE.UU.)
const USDA_TRANSLATION_MAP = {
  'pollo': 'chicken breast',
  'pechuga': 'chicken breast',
  'carne': 'beef steak',
  'bife': 'beef loin steak',
  'asado': 'beef short ribs',
  'cerdo': 'pork loin',
  'huevo': 'whole egg',
  'queso': 'cheese cheddar',
  'jamon': 'ham cured',
  'jamón': 'ham cured',
  'palta': 'avocado raw',
  'manteca': 'butter salted',
  'crema': 'heavy cream',
  'almendras': 'almonds',
  'nueces': 'walnuts',
  'tomate': 'tomato raw',
  'lechuga': 'lettuce raw',
  'espinaca': 'spinach raw',
  'panceta': 'pork bacon'
};

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Metas diarias personalizables por cada usuario (con valores iniciales Low-Carb)
  const [macroGoals, setMacroGoals] = useState(() => {
    const saved = localStorage.getItem('trakia_goals');
    return saved ? JSON.parse(saved) : { protein: 140, carbs: 50, fat: 140 };
  });

  // Registros guardados en cada teléfono de forma independiente
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

  // Detector de conexión a internet en tiempo real
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => { localStorage.setItem('trakia_goals', JSON.stringify(macroGoals)); }, [macroGoals]);
  useEffect(() => { localStorage.setItem('trakia_meals', JSON.stringify(meals)); }, [meals]);
  useEffect(() => { localStorage.setItem('trakia_glucose', JSON.stringify(glucoseLogs)); }, [glucoseLogs]);
  useEffect(() => { localStorage.setItem('trakia_workouts', JSON.stringify(workouts)); }, [workouts]);
  useEffect(() => { localStorage.setItem('trakia_measurements', JSON.stringify(measurements)); }, [measurements]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(m => m.date === todayStr);
  
  const consumedProtein = Math.round(todayMeals.reduce((acc, m) => acc + Number(m.protein || 0), 0));
  const consumedCarbs = Math.round(todayMeals.reduce((acc, m) => acc + Number(m.carbs || 0), 0));
  const consumedFat = Math.round(todayMeals.reduce((acc, m) => acc + Number(m.fat || 0), 0));

  // Estados de formularios
  const [newMeal, setNewMeal] = useState({ name: '', protein: '', carbs: '', fat: '' });
  const [newGlucose, setNewGlucose] = useState({ value: '', type: 'Ayunas' });
  const [newWorkout, setNewWorkout] = useState({ activity: '', duration: '', calories: '' });
  const [newMeasurement, setNewMeasurement] = useState({ weight: '', waist: '', chest: '' });
  
  // Estados del buscador online (USDA + Marcas)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchGrams, setSearchGrams] = useState('100');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');

  // Motor de búsqueda público (1° Referencia Universal -> 2° USDA Oficial -> 3° Marcas OpenFoodFacts)
  const handleOnlineFoodSearch = async (e) => {
    e.preventDefault();
    const rawQuery = searchQuery.trim().toLowerCase();
    if (!rawQuery) return;

    setIsSearching(true);
    setSearchMessage('');
    setSearchResults([]);

    let combinedResults = [];

    // 1. Buscar coincidencias inmediatas en el diccionario nutricional base en español
    const localMatches = UNIVERSAL_FOOD_DB.filter(item => 
      item.name.toLowerCase().includes(rawQuery)
    );
    combinedResults = [...localMatches];

    // 2. Conexión en vivo a internet (USDA FoodData Central + Base Mundial de Marcas)
    if (navigator.onLine) {
      // Traducir término si está en nuestro mapa para consultar la USDA de EE.UU. con precisión
      const usdaQuery = USDA_TRANSLATION_MAP[rawQuery] || rawQuery;

      const usdaPromise = fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(usdaQuery)}&pageSize=4&api_key=DEMO_KEY`
      ).then(r => r.ok ? r.json() : null).catch(() => null);

      const brandsPromise = fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(rawQuery)}&search_simple=1&action=process&json=1&page_size=6`
      ).then(r => r.ok ? r.json() : null).catch(() => null);

      const [usdaData, brandsData] = await Promise.all([usdaPromise, brandsPromise]);

      // Procesar resultados oficiales de la USDA
      if (usdaData && usdaData.foods) {
        const usdaItems = usdaData.foods.map(f => {
          const getNutrient = (id) => {
            const n = (f.foodNutrients || []).find(nut => nut.nutrientId === id);
            return n ? Math.round(n.value * 10) / 10 : 0;
          };
          return {
            name: f.description,
            protein: getNutrient(1003),
            carbs: getNutrient(1005),
            fat: getNutrient(1004),
            source: f.brandOwner ? `USDA Marca (${f.brandOwner})` : 'USDA Oficial (EE.UU.)'
          };
        }).filter(item => item.protein > 0 || item.carbs > 0 || item.fat > 0);

        combinedResults = [...combinedResults, ...usdaItems];
      }

      // Procesar resultados de Marcas y Supermercados (OpenFoodFacts)
      if (brandsData && brandsData.products) {
        const brandItems = brandsData.products
          .filter(p => p.product_name && p.nutriments)
          .map(p => ({
            name: `${p.product_name} ${p.brands ? `(${p.brands})` : ''}`,
            protein: Math.round((p.nutriments.proteins_100g || 0) * 10) / 10,
            carbs: Math.round((p.nutriments.carbohydrates_100g || 0) * 10) / 10,
            fat: Math.round((p.nutriments.fat_100g || 0) * 10) / 10,
            source: p.brands ? `Marca Comercial (${p.brands})` : 'Base Nutricional Online'
          }))
          .filter(item => item.protein > 0 || item.carbs > 0 || item.fat > 0);

        combinedResults = [...combinedResults, ...brandItems];
      }
    }

    if (combinedResults.length === 0) {
      setSearchMessage('No se encontraron resultados exactos. Puedes cargarlo manualmente abajo.');
    } else {
      setSearchResults(combinedResults);
    }

    setIsSearching(false);
  };

  // Al tocar un alimento de la lista, calcula los gramos exactos y lo suma al día
  const selectFoodFromSearch = (food) => {
    const gramsNum = parseFloat(searchGrams) || 100;
    const ratio = gramsNum / 100;

    const calcProt = Math.round(food.protein * ratio * 10) / 10;
    const calcCarbs = Math.round(food.carbs * ratio * 10) / 10;
    const calcFat = Math.round(food.fat * ratio * 10) / 10;

    setMeals([{
      id: Date.now(),
      date: todayStr,
      name: `${food.name} (${gramsNum}g)`,
      protein: calcProt,
      carbs: calcCarbs,
      fat: calcFat,
      source: food.source
    }, ...meals]);

    setSearchResults([]);
    setSearchQuery('');
  };

  const addMeal = (e) => {
    e.preventDefault();
    if (!newMeal.name) return;
    setMeals([{ id: Date.now(), date: todayStr, ...newMeal }, ...meals]);
    setNewMeal({ name: '', protein: '', carbs: '', fat: '' });
  };

  const addGlucose = (e) => {
    e.preventDefault();
    if (!newGlucose.value) return;
    setGlucoseLogs([{ id: Date.now(), date: new Date().toLocaleString(), ...newGlucose }, ...glucoseLogs]);
    setNewGlucose({ value: '', type: 'Ayunas' });
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-24">
      
      {/* Cabecera Principal */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 text-slate-950 p-2 rounded-xl font-black text-xl tracking-wider">T</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Trakia</h1>
              <p className="text-xs text-slate-400">Control Metabólico & Macros</p>
            </div>
          </div>
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            isOnline 
              ? 'bg-emerald-950 text-emerald-400 border-emerald-700' 
              : 'bg-amber-950 text-amber-400 border-amber-700'
          }`}>
            <Globe className="w-3.5 h-3.5" />
            <span>{isOnline ? 'Online (USDA & Web)' : 'Modo Local'}</span>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 space-y-4">
        
        {/* PESTAÑA: INICIO */}
        {activeTab === 'inicio' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Resumen de Macros Hoy</h2>
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
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Acceso Rápido</h2>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setActiveTab('comidas')} className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition">
                  <Utensils className="w-5 h-5 text-emerald-400 mb-1" />
                  <div className="font-semibold text-sm text-white">Buscar Alimento</div>
                  <div className="text-xs text-slate-400">USDA y Marcas Online</div>
                </button>
                <button onClick={() => setActiveTab('glucosa')} className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition">
                  <Droplet className="w-5 h-5 text-rose-400 mb-1" />
                  <div className="font-semibold text-sm text-white">Glucemia</div>
                  <div className="text-xs text-slate-400">Valores en sangre</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA: COMIDAS Y BUSCADOR ONLINE */}
        {activeTab === 'comidas' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow space-y-3">
              <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Buscador Nutricional Online (USDA + Marcas)
              </h2>
              <form onSubmit={handleOnlineFoodSearch} className="space-y-2">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ej: pollo, asado, queso, huevo..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input 
                    type="number" 
                    placeholder="Gramos" 
                    value={searchGrams}
                    onChange={(e) => setSearchGrams(e.target.value)}
                    className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-sm text-center text-amber-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">Escribe el alimento y la cantidad en gramos (ej: 150) para calcular sus macros.</p>
              </form>

              {isSearching && (
                <p className="text-xs text-emerald-400 animate-pulse">Consultando base de datos USDA y marcas comerciales...</p>
              )}

              {searchMessage && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{searchMessage}</span>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-2 pt-1 max-h-72 overflow-y-auto pr-1">
                  <div className="text-xs text-slate-400 font-medium">Toca una opción para agregarla ({searchGrams}g):</div>
                  {searchResults.map((item, idx) => {
                    const ratio = (parseFloat(searchGrams) || 100) / 100;
                    return (
                      <div 
                        key={idx} 
                        onClick={() => selectFoodFromSearch(item)}
                        className="p-3 bg-slate-950 hover:bg-slate-800 border border-emerald-900/60 rounded-xl cursor-pointer transition flex justify-between items-center"
                      >
                        <div>
                          <div className="font-bold text-sm text-emerald-400">{item.name}</div>
                          <div className="text-xs text-slate-200">
                            P: {Math.round(item.protein * ratio * 10)/10}g | C: {Math.round(item.carbs * ratio * 10)/10}g | G: {Math.round(item.fat * ratio * 10)/10}g
                          </div>
                          <div className="text-[10px] text-slate-500">{item.source}</div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 ml-2" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Carga Manual Rápida</h2>
              <form onSubmit={addMeal} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Nombre del plato / alimento" 
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input 
                    type="number" 
                    placeholder="Prot (g)" 
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal({...newMeal, protein: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input 
                    type="number" 
                    placeholder="Carb (g)" 
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal({...newMeal, carbs: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input 
                    type="number" 
                    placeholder="Grasa (g)" 
                    value={newMeal.fat}
                    onChange={(e) => setNewMeal({...newMeal, fat: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition">
                  Agregar Comida
                </button>
              </form>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Comidas Registradas Hoy</h3>
              {todayMeals.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No hay comidas registradas hoy.</p>
              ) : (
                todayMeals.map(m => (
                  <div key={m.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-sm text-white">{m.name}</div>
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
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Registro de Glucosa</h2>
              <form onSubmit={addGlucose} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    placeholder="Valor (mg/dL)" 
                    value={newGlucose.value}
                    onChange={(e) => setNewGlucose({...newGlucose, value: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
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
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Registrar Actividad Física</h2>
              <form onSubmit={addWorkout} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Actividad (Caminata, gimnasio, funcional...)" 
                  value={newWorkout.activity}
                  onChange={(e) => setNewWorkout({...newWorkout, activity: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    placeholder="Duración (min)" 
                    value={newWorkout.duration}
                    onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <input 
                    type="number" 
                    placeholder="Calorías (kcal)" 
                    value={newWorkout.calories}
                    onChange={(e) => setNewWorkout({...newWorkout, calories: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition">
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
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Medidas Corporales</h2>
              <form onSubmit={addMeasurement} className="space-y-3">
                <input 
                  type="number" 
                  step="0.1"
                  placeholder="Peso (kg)" 
                  value={newMeasurement.weight}
                  onChange={(e) => setNewMeasurement({...newMeasurement, weight: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="Cintura (cm)" 
                    value={newMeasurement.waist}
                    onChange={(e) => setNewMeasurement({...newMeasurement, waist: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="Pecho (cm)" 
                    value={newMeasurement.chest}
                    onChange={(e) => setNewMeasurement({...newMeasurement, chest: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
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
              <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Metas Diarias de Macros (Gramos)</h2>
              <p className="text-xs text-slate-400">
                Cada usuario puede personalizar sus objetivos diarios aquí:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Proteínas (g)</label>
                  <input 
                    type="number" 
                    value={macroGoals.protein}
                    onChange={(e) => setMacroGoals({...macroGoals, protein: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Carbos (g)</label>
                  <input 
                    type="number" 
                    value={macroGoals.carbs}
                    onChange={(e) => setMacroGoals({...macroGoals, carbs: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-amber-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Grasas (g)</label>
                  <input 
                    type="number" 
                    value={macroGoals.fat}
                    onChange={(e) => setMacroGoals({...macroGoals, fat: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-blue-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 shadow">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fuentes de Datos Conectadas</h2>
              <div className="text-xs text-slate-300 space-y-2">
                <p>• <strong>USDA FoodData Central:</strong> Conectado online para carnes, vegetales y alimentos naturales.</p>
                <p>• <strong>OpenFoodFacts Mundial:</strong> Conectado online para productos comerciales y marcas de supermercado.</p>
                <p>• <strong>Privacidad:</strong> Los datos registrados se guardan únicamente en este teléfono.</p>
              </div>
              <button 
                onClick={() => {
                  if(window.confirm('¿Deseas borrar todos los registros guardados en este dispositivo?')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="w-full mt-2 bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900 font-semibold py-2 rounded-xl text-xs transition"
              >
                Restablecer Datos de Fábrica
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Navegación Inferior Fija */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 py-2 px-1 z-40">
        <div className="max-w-md mx-auto grid grid-cols-6 gap-1 text-center">
          <button onClick={() => setActiveTab('inicio')} className={`flex flex-col items-center py-1 ${activeTab === 'inicio' ? 'text-emerald-400' : 'text-slate-400'}`}>
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Inicio</span>
          </button>
          <button onClick={() => setActiveTab('comidas')} className={`flex flex-col items-center py-1 ${activeTab === 'comidas' ? 'text-emerald-400' : 'text-slate-400'}`}>
            <Utensils className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Comidas</span>
          </button>
          <button onClick={() => setActiveTab('glucosa')} className={`flex flex-col items-center py-1 ${activeTab === 'glucosa' ? 'text-emerald-400' : 'text-slate-400'}`}>
            <Droplet className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Glucemia</span>
          </button>
          <button onClick={() => setActiveTab('ejercicio')} className={`flex flex-col items-center py-1 ${activeTab === 'ejercicio' ? 'text-emerald-400' : 'text-slate-400'}`}>
            <Activity className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Ejercicio</span>
          </button>
          <button onClick={() => setActiveTab('medidas')} className={`flex flex-col items-center py-1 ${activeTab === 'medidas' ? 'text-emerald-400' : 'text-slate-400'}`}>
            <Ruler className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Medidas</span>
          </button>
          <button onClick={() => setActiveTab('ajustes')} className={`flex flex-col items-center py-1 ${activeTab === 'ajustes' ? 'text-emerald-400' : 'text-slate-400'}`}>
            <Settings className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Ajustes</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
