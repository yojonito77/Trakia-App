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
  AlertCircle,
  Database
} from 'lucide-react';

// Lectura segura de almacenamiento local (evita pantalla en blanco si hay datos corruptos)
const safeLoadStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

// 1. MEGA CATÁLOGO UNIVERSAL (Valores cada 100g + Peso real por unidad/porción para cálculo automático)
const MEGA_FOOD_DB = [
  // HUEVOS Y PREPARACIONES CON HUEVO
  { name: 'Huevo entero de gallina', protein: 13.0, carbs: 1.1, fat: 11.0, unitWeight: 55, unitName: 'huevo(s)', keywords: 'huevo huevos duro revuelto frito poche', source: 'Base Universal USDA' },
  { name: 'Clara de huevo (cocida)', protein: 11.0, carbs: 0.7, fat: 0.2, unitWeight: 35, unitName: 'clara(s)', keywords: 'clara claras huevo', source: 'Base Universal USDA' },
  { name: 'Yema de huevo', protein: 16.0, carbs: 3.5, fat: 27.0, unitWeight: 20, unitName: 'yema(s)', keywords: 'yema yemas huevo', source: 'Base Universal USDA' },
  { name: 'Omelette de jamón y queso', protein: 16.0, carbs: 1.5, fat: 16.0, unitWeight: 160, unitName: 'omelette(s)', keywords: 'omelette omelete tortilla huevo', source: 'Base Comidas Caseras' },
  { name: 'Huevos revueltos con manteca/queso', protein: 12.5, carbs: 1.5, fat: 15.0, unitWeight: 150, unitName: 'porción(es)', keywords: 'huevos revueltos', source: 'Base Comidas Caseras' },

  // PANIFICADOS G4U (Línea Completa Proteica Low-Carb / Keto Argentina)
  { name: 'Pan de Molde Proteico G4U (Low-Carb / Keto)', protein: 23.3, carbs: 3.5, fat: 8.5, unitWeight: 30, unitName: 'rebanada(s)', keywords: 'pan molde lactal g4u keto rebanada tostada', source: 'Marca G4U Oficial (Carbos netos)' },
  { name: 'Pan Árabe Proteico G4U (Low-Carb / Keto)', protein: 24.0, carbs: 3.2, fat: 7.5, unitWeight: 50, unitName: 'pan(es) árabe', keywords: 'pan arabe pita g4u keto', source: 'Marca G4U Oficial (Carbos netos)' },
  { name: 'Pan de Hamburguesa Proteico G4U (Low-Carb / Keto)', protein: 23.5, carbs: 3.5, fat: 9.0, unitWeight: 65, unitName: 'pan(es)', keywords: 'pan hamburguesa g4u keto', source: 'Marca G4U Oficial (Carbos netos)' },
  { name: 'Pan de Pancho / Viena Proteico G4U (Low-Carb)', protein: 23.0, carbs: 3.5, fat: 8.5, unitWeight: 55, unitName: 'pan(es)', keywords: 'pan pancho viena g4u keto', source: 'Marca G4U Oficial (Carbos netos)' },
  { name: 'Pan Ciabatta Proteico G4U (Low-Carb / Keto)', protein: 23.0, carbs: 3.8, fat: 8.0, unitWeight: 70, unitName: 'ciabatta(s)', keywords: 'pan ciabatta g4u keto', source: 'Marca G4U Oficial (Carbos netos)' },
  { name: 'Tortillas / Rapiditas Proteicas G4U (Low-Carb / Keto)', protein: 22.0, carbs: 3.0, fat: 9.0, unitWeight: 40, unitName: 'tortilla(s)', keywords: 'tortilla rapidita fajita taco g4u keto', source: 'Marca G4U Oficial (Carbos netos)' },
  { name: 'Croissant / Medialuna Proteica G4U (Low-Carb)', protein: 20.0, carbs: 4.0, fat: 18.0, unitWeight: 55, unitName: 'unidad(es)', keywords: 'croissant medialuna factura g4u keto', source: 'Marca G4U Oficial (Carbos netos)' },
  { name: 'Budín / Muffin Proteico G4U (Sin Azúcar)', protein: 19.0, carbs: 4.5, fat: 16.0, unitWeight: 60, unitName: 'porción/unidad', keywords: 'budin muffin torta g4u keto', source: 'Marca G4U Oficial (Carbos netos)' },
  { name: 'Prepizza Proteica G4U (Low-Carb / Keto)', protein: 24.0, carbs: 4.0, fat: 9.0, unitWeight: 75, unitName: 'porción(es)', keywords: 'pizza prepizza g4u keto', source: 'Marca G4U Oficial (Carbos netos)' },
  { name: 'Pan Nube Casero (Cloud Bread Low-Carb)', protein: 14.0, carbs: 1.5, fat: 11.0, unitWeight: 30, unitName: 'disco(s)/unid.', keywords: 'pan nube cloud bread keto', source: 'Recetario Low-Carb' },
  { name: 'Pan de Harina de Almendras Casero (Keto)', protein: 15.0, carbs: 4.0, fat: 22.0, unitWeight: 40, unitName: 'rebanada(s)', keywords: 'pan almendra keto casero', source: 'Recetario Low-Carb' },

  // CHOCOLATES COLONIAL (Línea Sin Azúcar con Stevia y Línea Orgánica)
  { name: 'Chocolate Colonial 70% Cacao Sin Azúcar con Stevia', protein: 11.2, carbs: 8.8, fat: 33.2, unitWeight: 25, unitName: 'porción(25g)', keywords: 'chocolate colonial 70 stevia sin azucar amargo', source: 'Colonial Oficial (Carbos netos)' },
  { name: 'Chocolate Colonial 80% Cacao Sin Azúcar con Stevia', protein: 12.0, carbs: 6.5, fat: 38.0, unitWeight: 25, unitName: 'porción(25g)', keywords: 'chocolate colonial 80 stevia sin azucar amargo', source: 'Colonial Oficial (Carbos netos)' },
  { name: 'Chocolate Colonial 55% Cacao Sin Azúcar (Dietético)', protein: 8.5, carbs: 11.0, fat: 32.0, unitWeight: 25, unitName: 'porción(25g)', keywords: 'chocolate colonial 55 sin azucar dietetico', source: 'Colonial Oficial (Carbos netos)' },
  { name: 'Chocolate Colonial Blanco Sin Azúcar (Dietético)', protein: 9.0, carbs: 12.0, fat: 35.0, unitWeight: 25, unitName: 'porción(25g)', keywords: 'chocolate colonial blanco sin azucar', source: 'Colonial Oficial (Carbos netos)' },
  { name: 'Chocolate Colonial Con Leche Sin Azúcar con Stevia', protein: 9.5, carbs: 11.5, fat: 34.0, unitWeight: 25, unitName: 'porción(25g)', keywords: 'chocolate colonial leche sin azucar stevia', source: 'Colonial Oficial (Carbos netos)' },
  { name: 'Chocolate Colonial Con Almendras Sin Azúcar', protein: 12.5, carbs: 9.5, fat: 39.0, unitWeight: 25, unitName: 'porción(25g)', keywords: 'chocolate colonial almendras sin azucar', source: 'Colonial Oficial (Carbos netos)' },
  { name: 'Chocolate Colonial Orgánico 80% Cacao', protein: 10.6, carbs: 18.4, fat: 45.0, unitWeight: 25, unitName: 'porción(25g)', keywords: 'chocolate colonial organico 80', source: 'Colonial Oficial (Carbos netos)' },
  { name: 'Chocolate Colonial Orgánico 70% Cacao', protein: 9.2, carbs: 27.0, fat: 41.0, unitWeight: 25, unitName: 'porción(25g)', keywords: 'chocolate colonial organico 70', source: 'Colonial Oficial (Carbos netos)' },
  { name: 'Chocolate Colonial Orgánico 60% Cacao', protein: 8.0, carbs: 36.0, fat: 36.0, unitWeight: 25, unitName: 'porción(25g)', keywords: 'chocolate colonial organico 60', source: 'Colonial Oficial (Carbos netos)' },
  { name: 'Chocolate Colonial 100% Cacao Puro (Masa de cacao)', protein: 14.0, carbs: 8.0, fat: 52.0, unitWeight: 25, unitName: 'porción(25g)', keywords: 'chocolate colonial 100 puro cacao', source: 'Colonial Oficial (Carbos netos)' },

  // CHOCOLATES ÁGUILA (Arcor - Todas las variedades)
  { name: 'Chocolate Águila 80% Cacao Amargo', protein: 11.0, carbs: 20.0, fat: 44.0, unitWeight: 21, unitName: 'barrita(21g)', keywords: 'chocolate aguila 80 amargo cacao arcor', source: 'Águila Arcor Oficial (Carbos netos)' },
  { name: 'Chocolate Águila 70% Cacao Amargo', protein: 9.5, carbs: 29.0, fat: 41.9, unitWeight: 21, unitName: 'barrita(21g)', keywords: 'chocolate aguila 70 amargo cacao arcor', source: 'Águila Arcor Oficial (Carbos netos)' },
  { name: 'Chocolate Águila 60% Cacao Amargo Extra Fino', protein: 7.8, carbs: 38.0, fat: 37.6, unitWeight: 21, unitName: 'barrita(21g)', keywords: 'chocolate aguila 60 amargo cacao arcor', source: 'Águila Arcor Oficial (Carbos netos)' },
  { name: 'Chocolate Águila Semiamargo Clásico Taza (45% Cacao)', protein: 5.2, carbs: 56.0, fat: 30.0, unitWeight: 21, unitName: 'barrita(21g)', keywords: 'chocolate aguila semiamargo taza clasico', source: 'Águila Arcor Oficial' },
  { name: 'Chocolate Águila Sin Azúcar Agregada Semiamargo', protein: 6.5, carbs: 16.0, fat: 33.0, unitWeight: 21, unitName: 'barrita(21g)', keywords: 'chocolate aguila sin azucar semiamargo', source: 'Águila Arcor (Carbos netos)' },
  { name: 'Chocolate Águila Con Leche', protein: 6.8, carbs: 55.0, fat: 31.0, unitWeight: 21, unitName: 'barrita(21g)', keywords: 'chocolate aguila con leche', source: 'Águila Arcor Oficial' },
  { name: 'Chocolate Águila Blanco', protein: 5.5, carbs: 58.0, fat: 32.0, unitWeight: 21, unitName: 'barrita(21g)', keywords: 'chocolate aguila blanco', source: 'Águila Arcor Oficial' },
  { name: 'Chocolate Águila Nuit 70% Cacao', protein: 9.5, carbs: 28.0, fat: 42.0, unitWeight: 20, unitName: 'porción(20g)', keywords: 'chocolate aguila nuit 70', source: 'Águila Arcor Oficial' },
  { name: 'Cacao Amargo Puro en Polvo Águila (Sin Azúcar)', protein: 20.0, carbs: 11.0, fat: 14.0, unitWeight: 10, unitName: 'cucharada(10g)', keywords: 'cacao amargo polvo aguila', source: 'Águila Arcor Oficial (Carbos netos)' },

  // OTROS CHOCOLATES Y DULCES
  { name: 'Chocolate Amargo 85% a 90% Cacao (Estándar)', protein: 11.5, carbs: 12.0, fat: 49.0, unitWeight: 20, unitName: 'porción(20g)', keywords: 'chocolate amargo 85 90 cacao', source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Chocolate Dr. Cacao / Vidanto / Mapsa Sin Azúcar', protein: 11.5, carbs: 7.5, fat: 42.0, unitWeight: 25, unitName: 'porción(25g)', keywords: 'chocolate dr cacao vidanto mapsa sin azucar', source: 'Base Dietéticas Argentina' },
  { name: 'Dulce de Leche Sin Azúcar (Colonial / Trini / Diet)', protein: 7.0, carbs: 14.0, fat: 6.5, unitWeight: 20, unitName: 'cucharada(20g)', keywords: 'dulce de leche sin azucar trini colonial diet', source: 'Base Dietéticas Argentina' },
  { name: 'Dulce de Leche Clásico (La Serenísima / Sancor / Milkaut)', protein: 6.5, carbs: 56.0, fat: 7.0, unitWeight: 20, unitName: 'cucharada(20g)', keywords: 'dulce de leche clasico serenisima sancor milkaut', source: 'Base ARGENFOODS' },

  // CARNES VACUNAS (Todos los cortes Argentinos con peso por bife/porción)
  { name: 'Asado de tira / Tira de asado (cocido)', protein: 22.0, carbs: 0, fat: 25.0, unitWeight: 250, unitName: 'porción(250g)', keywords: 'asado tira carne vaca parrilla costilla', source: 'Base ARGENFOODS / USDA' },
  { name: 'Vacío vacuno (asado o al horno)', protein: 24.0, carbs: 0, fat: 20.0, unitWeight: 250, unitName: 'porción(250g)', keywords: 'vacio carne vaca asado parrilla', source: 'Base ARGENFOODS' },
  { name: 'Entraña vacuna (asada)', protein: 23.0, carbs: 0, fat: 21.0, unitWeight: 200, unitName: 'porción(200g)', keywords: 'entrana carne vaca asado parrilla', source: 'Base ARGENFOODS' },
  { name: 'Bife de chorizo / Entrecot (cocido)', protein: 25.0, carbs: 0, fat: 18.0, unitWeight: 250, unitName: 'bife(250g)', keywords: 'bife chorizo entrecot carne vaca', source: 'Base ARGENFOODS / USDA' },
  { name: 'Ojo de bife / Ribeye (cocido)', protein: 24.0, carbs: 0, fat: 22.0, unitWeight: 250, unitName: 'bife(250g)', keywords: 'ojo bife ribeye carne vaca', source: 'Base ARGENFOODS / USDA' },
  { name: 'Bife ancho / Bife angosto / Costeleta vacuna', protein: 24.5, carbs: 0, fat: 16.0, unitWeight: 200, unitName: 'bife(200g)', keywords: 'bife ancho angosto costeleta carne vaca', source: 'Base ARGENFOODS' },
  { name: 'Lomo vacuno (magro cocido)', protein: 27.0, carbs: 0, fat: 8.0, unitWeight: 200, unitName: 'medallón/bife(200g)', keywords: 'lomo vacuno carne magra bife', source: 'Base ARGENFOODS / USDA' },
  { name: 'Cuadril / Colita de cuadril / Tapa de cuadril (Picanha)', protein: 26.0, carbs: 0, fat: 12.0, unitWeight: 200, unitName: 'bife/porción(200g)', keywords: 'cuadril colita tapa picanha carne vaca', source: 'Base ARGENFOODS' },
  { name: 'Nalga / Bola de lomo / Cuadrada (cortes magros)', protein: 28.0, carbs: 0, fat: 6.0, unitWeight: 150, unitName: 'bife(150g)', keywords: 'nalga bola lomo cuadrada carne magra', source: 'Base ARGENFOODS' },
  { name: 'Peceto vacuno (cocido)', protein: 29.0, carbs: 0, fat: 5.0, unitWeight: 150, unitName: 'porción(150g)', keywords: 'peceto carne vaca vitel tone', source: 'Base ARGENFOODS' },
  { name: 'Matambre vacuno (asado o a la pizza)', protein: 22.0, carbs: 0, fat: 19.0, unitWeight: 200, unitName: 'porción(200g)', keywords: 'matambre vacuno carne', source: 'Base ARGENFOODS' },
  { name: 'Tapa de asado / Roast beef / Paleta / Aguja', protein: 24.0, carbs: 0, fat: 15.0, unitWeight: 200, unitName: 'porción(200g)', keywords: 'tapa asado roast beef paleta aguja carnaza osobuco', source: 'Base ARGENFOODS' },
  { name: 'Carne picada común / Molida', protein: 20.0, carbs: 0, fat: 18.0, unitWeight: 150, unitName: 'porción(150g)', keywords: 'carne picada molida comun', source: 'Base Universal USDA' },
  { name: 'Carne picada especial / Magra (Albóndigas / Pastel)', protein: 24.0, carbs: 0, fat: 9.0, unitWeight: 150, unitName: 'porción(150g)', keywords: 'carne picada especial magra albondiga', source: 'Base Universal USDA' },
  { name: 'Hamburguesa casera / Medallón de carne vacuna', protein: 22.0, carbs: 0, fat: 17.0, unitWeight: 110, unitName: 'hamburguesa(110g)', keywords: 'hamburguesa medallon paty swift carne', source: 'Base Universal USDA' },
  { name: 'Milanesa de carne al horno', protein: 21.0, carbs: 14.0, fat: 9.0, unitWeight: 150, unitName: 'milanesa(150g)', keywords: 'milanesa carne horno', source: 'Base ARGENFOODS' },
  { name: 'Milanesa de carne frita / Napolitana', protein: 19.0, carbs: 14.0, fat: 16.0, unitWeight: 180, unitName: 'milanesa(180g)', keywords: 'milanesa carne frita napolitana', source: 'Base ARGENFOODS' },

  // ACHURAS Y EMBUTIDOS
  { name: 'Chorizo puro cerdo / Parrillero', protein: 16.0, carbs: 2.0, fat: 28.0, unitWeight: 120, unitName: 'chorizo(120g)', keywords: 'chorizo cerdo parrillero choripan', source: 'Base ARGENFOODS' },
  { name: 'Morcilla común o vasca', protein: 14.0, carbs: 3.0, fat: 25.0, unitWeight: 110, unitName: 'morcilla(110g)', keywords: 'morcilla', source: 'Base ARGENFOODS' },
  { name: 'Salchicha parrillera', protein: 15.0, carbs: 2.0, fat: 27.0, unitWeight: 100, unitName: 'porción(100g)', keywords: 'salchicha parrillera', source: 'Base ARGENFOODS' },
  { name: 'Salchicha de Viena (paquete)', protein: 12.0, carbs: 2.5, fat: 24.0, unitWeight: 35, unitName: 'salchicha(35g)', keywords: 'salchicha viena pancho vienissima paladini', source: 'Base Universal USDA' },
  { name: 'Mollejas / Chinchulines / Riñón / Hígado', protein: 19.0, carbs: 0.5, fat: 18.0, unitWeight: 150, unitName: 'porción(150g)', keywords: 'molleja chinchulin rinon higado achura', source: 'Base ARGENFOODS' },

  // POLLOS, AVES Y CERDO
  { name: 'Pechuga de pollo / Suprema (sin piel, cocida)', protein: 31.0, carbs: 0, fat: 3.6, unitWeight: 200, unitName: 'pechuga(200g)', keywords: 'pollo pechuga suprema ave', source: 'Base Universal USDA' },
  { name: 'Pata / Muslo de pollo (sin piel, cocido)', protein: 26.0, carbs: 0, fat: 8.0, unitWeight: 150, unitName: 'presa(150g)', keywords: 'pollo pata muslo', source: 'Base Universal USDA' },
  { name: 'Pata / Muslo de pollo (con piel, al horno)', protein: 24.0, carbs: 0, fat: 14.0, unitWeight: 160, unitName: 'presa(160g)', keywords: 'pollo pata muslo piel', source: 'Base Universal USDA' },
  { name: 'Alitas de pollo (asadas)', protein: 23.0, carbs: 0, fat: 16.0, unitWeight: 50, unitName: 'alita(50g)', keywords: 'alita alitas pollo', source: 'Base Universal USDA' },
  { name: 'Milanesa de pollo / Suprema al horno', protein: 22.0, carbs: 14.0, fat: 7.0, unitWeight: 150, unitName: 'milanesa(150g)', keywords: 'milanesa suprema pollo', source: 'Base ARGENFOODS' },
  { name: 'Bondiola de cerdo (cocida)', protein: 21.0, carbs: 0, fat: 22.0, unitWeight: 200, unitName: 'porción(200g)', keywords: 'bondiola cerdo', source: 'Base ARGENFOODS' },
  { name: 'Matambre de cerdo / Costillitas / Pechito de cerdo', protein: 21.0, carbs: 0, fat: 23.0, unitWeight: 200, unitName: 'porción(200g)', keywords: 'matambre matambrito costilla pechito ribs cerdo', source: 'Base ARGENFOODS' },
  { name: 'Carré de cerdo / Solomillo / Costeleta de cerdo', protein: 27.0, carbs: 0, fat: 6.0, unitWeight: 180, unitName: 'bife(180g)', keywords: 'carre solomillo lomo costeleta chuleta cerdo', source: 'Base Universal USDA' },
  { name: 'Lechón / Cordero asado', protein: 25.0, carbs: 0, fat: 21.0, unitWeight: 200, unitName: 'porción(200g)', keywords: 'lechon cordero chivito', source: 'Base Universal USDA' },

  // QUESOS, LÁCTEOS Y FIAMBRES
  { name: 'Queso cremoso / Cuartirolo', protein: 21.0, carbs: 1.5, fat: 22.0, unitWeight: 30, unitName: 'feta/porción(30g)', keywords: 'queso cremoso cuartirolo', source: 'Base Lácteos ARGENFOODS' },
  { name: 'Queso Por Salut / Port Salut común o light', protein: 24.0, carbs: 1.5, fat: 15.0, unitWeight: 30, unitName: 'feta/porción(30g)', keywords: 'queso por salut port salut', source: 'Base Lácteos ARGENFOODS' },
  { name: 'Queso Mozzarella / Muzzarella', protein: 22.0, carbs: 2.2, fat: 22.0, unitWeight: 30, unitName: 'feta/porción(30g)', keywords: 'queso mozzarella muzzarella muza', source: 'Base Universal USDA' },
  { name: 'Queso Pategrás / Gouda / Dambo / Tybo (de máquina)', protein: 25.0, carbs: 1.5, fat: 27.0, unitWeight: 20, unitName: 'feta(20g)', keywords: 'queso pategras gouda dambo danbo tybo barra maquina feta', source: 'Base Lácteos ARGENFOODS' },
  { name: 'Queso Provolone / Provoleta parrillera', protein: 26.0, carbs: 2.0, fat: 27.0, unitWeight: 100, unitName: 'rodaja(100g)', keywords: 'queso provolone provoleta', source: 'Base Lácteos ARGENFOODS' },
  { name: 'Queso Sardo / Reggianito / Parmesano (rallado)', protein: 35.0, carbs: 3.2, fat: 26.0, unitWeight: 15, unitName: 'cucharada(15g)', keywords: 'queso sardo reggianito parmesano rallado', source: 'Base Lácteos ARGENFOODS' },
  { name: 'Queso Roquefort / Azul / Cheddar / Brie / Gruyere', protein: 22.0, carbs: 1.5, fat: 30.0, unitWeight: 30, unitName: 'porción(30g)', keywords: 'queso roquefort azul cheddar brie camembert gruyere', source: 'Base Universal USDA' },
  { name: 'Queso crema / Untable (Casancrem / Finlandia / Mendicrim)', protein: 7.5, carbs: 4.0, fat: 20.0, unitWeight: 30, unitName: 'cucharada(30g)', keywords: 'queso crema blanco untable casancrem finlandia mendicrim tholem', source: 'Base Lácteos ARGENFOODS' },
  { name: 'Ricotta / Ricota entera o magra', protein: 12.0, carbs: 3.2, fat: 10.0, unitWeight: 100, unitName: 'porción(100g)', keywords: 'ricotta ricota', source: 'Base Lácteos ARGENFOODS' },
  { name: 'Crema de leche (nata)', protein: 2.0, carbs: 3.0, fat: 36.0, unitWeight: 30, unitName: 'cucharada(30g)', keywords: 'crema leche nata chantilly', source: 'Base Universal USDA' },
  { name: 'Manteca / Mantequilla', protein: 0.9, carbs: 0.1, fat: 81.0, unitWeight: 10, unitName: 'cucharada/rulo(10g)', keywords: 'manteca mantequilla', source: 'Base Universal USDA' },
  { name: 'Yogur griego o natural sin azúcar', protein: 8.5, carbs: 4.0, fat: 4.5, unitWeight: 150, unitName: 'pote(150g)', keywords: 'yogur yogurt griego natural', source: 'Base Universal USDA' },
  { name: 'Leche entera o descremada fluida', protein: 3.3, carbs: 4.8, fat: 2.0, unitWeight: 200, unitName: 'vaso/taza(200ml)', keywords: 'leche entera descremada', source: 'Base Universal USDA' },
  { name: 'Leche de almendras o coco sin azúcar', protein: 0.6, carbs: 0.4, fat: 1.5, unitWeight: 200, unitName: 'vaso/taza(200ml)', keywords: 'leche almendras coco vegetal', source: 'Base Universal USDA' },
  { name: 'Jamón cocido natural en fetas', protein: 19.0, carbs: 1.5, fat: 5.0, unitWeight: 20, unitName: 'feta(20g)', keywords: 'jamon cocido feta fiambre paladini bocatti', source: 'Base ARGENFOODS' },
  { name: 'Jamón crudo / Serrano / Bondiola fiambre', protein: 26.0, carbs: 0.5, fat: 16.0, unitWeight: 20, unitName: 'feta(20g)', keywords: 'jamon crudo serrano bondiola fiambre', source: 'Base ARGENFOODS' },
  { name: 'Lomito ahumado / Pastrón / Pavita en fetas', protein: 22.0, carbs: 1.0, fat: 4.0, unitWeight: 20, unitName: 'feta(20g)', keywords: 'lomito pastron pavita fiambre', source: 'Base ARGENFOODS' },
  { name: 'Panceta ahumada / Tocino / Bacon', protein: 14.0, carbs: 1.4, fat: 40.0, unitWeight: 20, unitName: 'feta(20g)', keywords: 'panceta tocino bacon', source: 'Base Universal USDA' },
  { name: 'Salame / Salamín / Longaniza / Mortadela', protein: 20.0, carbs: 1.8, fat: 32.0, unitWeight: 20, unitName: 'rodaja/feta(20g)', keywords: 'salame salamin longaniza cantimpalo mortadela', source: 'Base ARGENFOODS' },

  // VERDURAS Y HORTALIZAS (Carbos Netos)
  { name: 'Palta / Aguacate', protein: 2.0, carbs: 1.8, fat: 15.0, unitWeight: 140, unitName: 'palta(140g)', keywords: 'palta aguacate guacamole', source: 'Base USDA (Carbos netos)' },
  { name: 'Aceitunas verdes o negras', protein: 1.0, carbs: 1.0, fat: 15.0, unitWeight: 5, unitName: 'aceituna(5g)', keywords: 'aceituna aceitunas oliva', source: 'Base USDA (Carbos netos)' },
  { name: 'Lechuga / Rúcula / Radicheta / Berro / Ensalada verde', protein: 1.5, carbs: 1.3, fat: 0.2, unitWeight: 80, unitName: 'plato(80g)', keywords: 'lechuga rucula radicheta berro ensalada hojas verdes', source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Espinaca / Acelga (cruda o cocida)', protein: 2.5, carbs: 1.7, fat: 0.3, unitWeight: 100, unitName: 'taza/porción(100g)', keywords: 'espinaca acelga verdura', source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Tomate redondo / Perita / Cherry', protein: 0.9, carbs: 2.7, fat: 0.2, unitWeight: 130, unitName: 'tomate(130g)', keywords: 'tomate perita cherry ensalada', source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Brócoli (cocido)', protein: 2.4, carbs: 4.0, fat: 0.4, unitWeight: 100, unitName: 'taza/porción(100g)', keywords: 'brocoli verdura', source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Zapallito verde redondo / Zucchini', protein: 1.2, carbs: 2.1, fat: 0.2, unitWeight: 150, unitName: 'unidad(150g)', keywords: 'zapallito verde zucchini', source: 'Base ARGENFOODS (Carbos netos)' },
  { name: 'Pepino / Apio / Repollo / Hinojo / Rabanito', protein: 1.0, carbs: 2.2, fat: 0.1, unitWeight: 100, unitName: 'porción(100g)', keywords: 'pepino apio repollo coleslaw hinojo rabanito', source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Champiñones / Hongos Portobello / Espárragos / Palmitos', protein: 2.8, carbs: 2.1, fat: 0.3, unitWeight: 100, unitName: 'porción(100g)', keywords: 'champinon champinones hongo portobello esparrago palmito alcaucil', source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Morrón / Pimiento (rojo, verde o amarillo)', protein: 1.0, carbs: 4.0, fat: 0.3, unitWeight: 120, unitName: 'unidad(120g)', keywords: 'morron pimiento aji', source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Cebolla común, morada o Cebolla de verdeo / Puerro', protein: 1.1, carbs: 7.5, fat: 0.1, unitWeight: 110, unitName: 'cebolla(110g)', keywords: 'cebolla verdeo puerro', source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Chauchas / Zanahoria / Zapallo Calabaza / Remolacha', protein: 1.2, carbs: 6.5, fat: 0.2, unitWeight: 100, unitName: 'porción(100g)', keywords: 'chaucha zanahoria zapallo calabaza anco cabutia remolacha', source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Papa / Batata / Choclo (cocidos)', protein: 2.0, carbs: 18.0, fat: 0.2, unitWeight: 150, unitName: 'unidad(150g)', keywords: 'papa patata batata boniato choclo maiz pure', source: 'Base Universal USDA' },

  // FRUTAS (Carbos Netos)
  { name: 'Frutillas / Fresas / Frambuesas / Moras', protein: 0.8, carbs: 5.6, fat: 0.3, unitWeight: 100, unitName: 'taza(100g)', keywords: 'frutilla fresa frambuesa mora frutos rojos', source: 'Base USDA (Carbos netos)' },
  { name: 'Arándanos frescos', protein: 0.7, carbs: 12.1, fat: 0.3, unitWeight: 100, unitName: 'taza(100g)', keywords: 'arandano blueberry', source: 'Base USDA (Carbos netos)' },
  { name: 'Limón / Pomelo / Naranja / Mandarina', protein: 0.8, carbs: 8.5, fat: 0.1, unitWeight: 130, unitName: 'fruta(130g)', keywords: 'limon pomelo naranja mandarina citrico', source: 'Base USDA (Carbos netos)' },
  { name: 'Manzana / Pera / Durazno / Pelón / Ciruela / Kiwi', protein: 0.6, carbs: 10.5, fat: 0.2, unitWeight: 150, unitName: 'fruta(150g)', keywords: 'manzana pera durazno pelon ciruela damasco kiwi', source: 'Base USDA (Carbos netos)' },
  { name: 'Banana / Plátano', protein: 1.1, carbs: 20.2, fat: 0.3, unitWeight: 120, unitName: 'banana(120g)', keywords: 'banana platano', source: 'Base USDA (Carbos netos)' },
  { name: 'Sandía / Melón / Ananá (Piña) / Mango / Uvas', protein: 0.6, carbs: 9.5, fat: 0.2, unitWeight: 150, unitName: 'porción(150g)', keywords: 'sandia melon anana pina mango uva cereza', source: 'Base USDA (Carbos netos)' },

  // FRUTOS SECOS, SEMILLAS, ACEITES, COMIDAS Y SUPLEMENTOS
  { name: 'Almendras peladas o tostadas', protein: 21.0, carbs: 9.0, fat: 50.0, unitWeight: 30, unitName: 'puñado(30g)', keywords: 'almendra fruto seco', source: 'Base USDA (Carbos netos)' },
  { name: 'Nueces mariposa / Pecán / Avellanas / Castañas', protein: 15.0, carbs: 7.0, fat: 65.0, unitWeight: 30, unitName: 'puñado(30g)', keywords: 'nuez nueces pecan avellana castana caju pistacho', source: 'Base USDA (Carbos netos)' },
  { name: 'Maní tostado / Pasta de maní sin azúcar', protein: 25.5, carbs: 9.0, fat: 49.5, unitWeight: 25, unitName: 'cucharada/puñado(25g)', keywords: 'mani pasta mantequilla cacahuate', source: 'Base USDA (Carbos netos)' },
  { name: 'Semillas de Chía / Lino / Sésamo / Girasol / Zapallo', protein: 19.0, carbs: 4.0, fat: 36.0, unitWeight: 15, unitName: 'cucharada(15g)', keywords: 'semilla chia lino sesamo girasol zapallo', source: 'Base USDA (Carbos netos)' },
  { name: 'Harina de almendras / Harina de coco', protein: 20.0, carbs: 10.0, fat: 42.0, unitWeight: 20, unitName: 'cucharada(20g)', keywords: 'harina almendra coco keto', source: 'Base Low-Carb / Keto' },
  { name: 'Coco rallado sin azúcar', protein: 6.0, carbs: 6.5, fat: 64.0, unitWeight: 15, unitName: 'cucharada(15g)', keywords: 'coco rallado', source: 'Base Low-Carb / Keto' },
  { name: 'Aceite de oliva / girasol / coco / MCT', protein: 0, carbs: 0, fat: 100.0, unitWeight: 10, unitName: 'cucharada(10g)', keywords: 'aceite oliva girasol coco mct', source: 'Base Universal USDA' },
  { name: 'Mayonesa (Hellmanns / Natura / Casera)', protein: 1.0, carbs: 1.5, fat: 75.0, unitWeight: 15, unitName: 'cucharada(15g)', keywords: 'mayonesa aderezo', source: 'Base Marcas Argentina' },
  { name: 'Gelatina sin azúcar preparada / Sin sabor', protein: 2.0, carbs: 0, fat: 0, unitWeight: 150, unitName: 'porción/taza(150g)', keywords: 'gelatina sin azucar sabor', source: 'Base Low-Carb' },
  { name: 'Whey Protein / Proteína en polvo', protein: 78.0, carbs: 6.0, fat: 5.0, unitWeight: 30, unitName: 'scoop/medida(30g)', keywords: 'whey protein proteina polvo scoop', source: 'Base Suplementos' },
  { name: 'Empanada de carne o jamón y queso', protein: 11.5, carbs: 23.5, fat: 13.5, unitWeight: 100, unitName: 'empanada(100g)', keywords: 'empanada carne jamon queso pollo', source: 'Base ARGENFOODS' },
  { name: 'Pizza de muzzarella clásica', protein: 12.0, carbs: 28.0, fat: 10.0, unitWeight: 110, unitName: 'porción(110g)', keywords: 'pizza muzzarella porcion', source: 'Base ARGENFOODS' },
  { name: 'Arroz blanco o integral / Fideos (cocidos)', protein: 3.8, carbs: 26.0, fat: 0.8, unitWeight: 150, unitName: 'plato/taza(150g)', keywords: 'arroz fideos pasta tallarines', source: 'Base Universal USDA' },
  { name: 'Lentejas / Garbanzos / Porotos (cocidos)', protein: 8.5, carbs: 15.0, fat: 0.6, unitWeight: 150, unitName: 'taza/plato(150g)', keywords: 'lenteja garbanzo poroto legumbre', source: 'Base Universal USDA' }
];

const USDA_TRANSLATION_MAP = {
  'huevo': 'egg whole cooked',
  'pollo': 'chicken breast cooked',
  'pechuga': 'chicken breast cooked',
  'carne': 'beef steak cooked',
  'asado': 'beef short ribs cooked',
  'vacio': 'beef flank steak cooked',
  'bife': 'beef strip steak cooked',
  'cerdo': 'pork loin cooked',
  'queso': 'cheese mozzarella',
  'jamon': 'ham cured',
  'panceta': 'pork bacon cooked',
  'palta': 'avocado raw',
  'lechuga': 'lettuce raw',
  'tomate': 'tomatoes raw',
  'espinaca': 'spinach cooked',
  'brocoli': 'broccoli cooked',
  'manzana': 'apples raw',
  'banana': 'bananas raw',
  'naranja': 'oranges raw',
  'frutilla': 'strawberries raw',
  'almendra': 'almonds',
  'nuez': 'walnuts',
  'chocolate': 'dark chocolate 70-85%'
};

const MEASURE_WORDS_WEIGHTS = {
  'feta': 20, 'fetas': 20,
  'rebanada': 30, 'rebanadas': 30, 'rodaja': 30, 'rodajas': 30, 'tostada': 30, 'tostadas': 30,
  'cucharada': 15, 'cucharadas': 15, 'cda': 15, 'cdas': 15,
  'cucharadita': 5, 'cucharaditas': 5, 'cdita': 5,
  'taza': 150, 'tazas': 150, 'vaso': 200, 'vasos': 200, 'pote': 150, 'potes': 150,
  'punado': 30, 'punados': 30,
  'barrita': 22, 'barritas': 22, 'tableta': 25,
  'bife': 200, 'bifes': 200, 'medallon': 110, 'medallones': 110, 'presa': 150, 'presas': 150,
  'plato': 200, 'platos': 200, 'porcion': 150, 'porciones': 150,
  'scoop': 30, 'scoops': 30, 'medida': 30,
  'unidad': null, 'unidades': null
};

const normalizeBase = (str) =>
  (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

const singularizeWord = (word) => {
  if (word.length <= 3) return word;
  if (word.endsWith('ces')) return word.slice(0, -3) + 'z';
  if (word.endsWith('ones')) return word.slice(0, -2);
  if (word.endsWith('es') && !word.endsWith('tes') && !word.endsWith('les')) return word.slice(0, -2);
  if (word.endsWith('s')) return word.slice(0, -1);
  return word;
};

const inferSmartUnitWeight = (foodName) => {
  const n = normalizeBase(foodName);
  if (n.includes('huevo')) return { unitWeight: 55, unitName: 'huevo(s)' };
  if (n.includes('clara')) return { unitWeight: 35, unitName: 'clara(s)' };
  if (n.includes('pan') || n.includes('g4u') || n.includes('lactal') || n.includes('tostada')) return { unitWeight: 30, unitName: 'rebanada(s)' };
  if (n.includes('tortilla') || n.includes('rapidita')) return { unitWeight: 40, unitName: 'tortilla(s)' };
  if (n.includes('chocolate') || n.includes('aguila') || n.includes('colonial') || n.includes('cacao')) return { unitWeight: 25, unitName: 'porción(25g)' };
  if (n.includes('queso') || n.includes('jamon') || n.includes('panceta') || n.includes('salame') || n.includes('fiambre')) return { unitWeight: 25, unitName: 'feta/porción' };
  if (n.includes('asado') || n.includes('vacio') || n.includes('bife') || n.includes('carne') || n.includes('pollo') || n.includes('pechuga') || n.includes('cerdo')) return { unitWeight: 200, unitName: 'bife/porción' };
  if (n.includes('hamburguesa') || n.includes('medallon')) return { unitWeight: 110, unitName: 'medallón' };
  if (n.includes('chorizo') || n.includes('morcilla')) return { unitWeight: 120, unitName: 'unidad(120g)' };
  if (n.includes('salchicha')) return { unitWeight: 35, unitName: 'salchicha' };
  if (n.includes('palta') || n.includes('manzana') || n.includes('naranja') || n.includes('banana') || n.includes('pera') || n.includes('tomate') || n.includes('cebolla') || n.includes('morron')) return { unitWeight: 130, unitName: 'unidad(130g)' };
  if (n.includes('almendra') || n.includes('nuez') || n.includes('mani')) return { unitWeight: 30, unitName: 'puñado(30g)' };
  if (n.includes('aceite') || n.includes('manteca') || n.includes('mayonesa') || n.includes('dulce')) return { unitWeight: 15, unitName: 'cucharada(15g)' };
  if (n.includes('yogur') || n.includes('leche')) return { unitWeight: 150, unitName: 'pote/vaso' };
  return { unitWeight: 100, unitName: 'porción(100g)' };
};

const parseUniversalInput = (rawInput) => {
  let clean = normalizeBase(rawInput);
  clean = clean
    .replace(/\bmedia\b|\bmedio\b/g, '0.5')
    .replace(/\buna\b|\bun\b|\buno\b/g, '1')
    .replace(/\bdos\b/g, '2')
    .replace(/\btres\b/g, '3')
    .replace(/\bcuatro\b/g, '4')
    .replace(/\bcinco\b/g, '5');

  let explicitGrams = null;
  let explicitCount = null;
  let explicitMeasureWeight = null;
  let explicitMeasureLabel = '';

  const kgMatch = clean.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|kilo|kilos)\b/);
  const gramMatch = clean.match(/(\d+(?:[.,]\d+)?)\s*(?:g|gr|grs|gramo|gramos|ml|cc)\b/);

  if (kgMatch) {
    explicitGrams = Math.round(parseFloat(kgMatch[1].replace(',', '.')) * 1000);
    clean = clean.replace(kgMatch[0], ' ').trim();
  } else if (gramMatch) {
    explicitGrams = Math.round(parseFloat(gramMatch[1].replace(',', '.')));
    clean = clean.replace(gramMatch[0], ' ').trim();
  } else {
    const startNumMatch = clean.match(/^(\d+(?:[.,]\d+)?)\s+(.+)$/);
    const endNumMatch = clean.match(/^(.+?)\s+(\d+(?:[.,]\d+)?)$/);

    if (startNumMatch) {
      const num = parseFloat(startNumMatch[1].replace(',', '.'));
      const rest = startNumMatch[2].trim();
      if ([55, 60, 70, 80, 85, 90, 100].includes(num) && (rest.includes('chocolate') || rest.includes('cacao') || rest.includes('aguila') || rest.includes('colonial'))) {
        // Es el porcentaje de cacao
      } else if (num >= 35) {
        explicitGrams = Math.round(num);
        clean = rest;
      } else {
        explicitCount = num;
        clean = rest;
      }
    } else if (endNumMatch) {
      const rest = endNumMatch[1].trim();
      const num = parseFloat(endNumMatch[2].replace(',', '.'));
      if ([55, 60, 70, 80, 85, 90, 100].includes(num) && (rest.includes('chocolate') || rest.includes('cacao') || rest.includes('aguila') || rest.includes('colonial'))) {
        // Es el porcentaje de cacao
      } else if (num >= 35) {
        explicitGrams = Math.round(num);
        clean = rest;
      } else {
        explicitCount = num;
        clean = rest;
      }
    }
  }

  const rawTokens = clean.split(/\s+/).filter(Boolean);
  const foodTokens = [];

  for (const tok of rawTokens) {
    if (MEASURE_WORDS_WEIGHTS[tok] !== undefined) {
      explicitMeasureWeight = MEASURE_WORDS_WEIGHTS[tok];
      explicitMeasureLabel = tok;
    } else if (!['de', 'con', 'sin', 'al', 'la', 'el', 'los', 'las', 'del', 'por'].includes(tok)) {
      foodTokens.push(singularizeWord(tok));
    }
  }

  return {
    explicitGrams,
    explicitCount,
    explicitMeasureWeight,
    explicitMeasureLabel,
    searchWords: foodTokens,
    cleanText: foodTokens.join(' ')
  };
};

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const [macroGoals, setMacroGoals] = useState(() => safeLoadStorage('trakia_goals', { protein: 140, carbs: 50, fat: 140 }));
  const [meals, setMeals] = useState(() => safeLoadStorage('trakia_meals', []));
  const [glucoseLogs, setGlucoseLogs] = useState(() => safeLoadStorage('trakia_glucose', []));
  const [workouts, setWorkouts] = useState(() => safeLoadStorage('trakia_workouts', []));
  const [measurements, setMeasurements] = useState(() => safeLoadStorage('trakia_measurements', []));

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
  const todayMeals = (Array.isArray(meals) ? meals : []).filter(m => m && m.date === todayStr);
  
  const consumedProtein = Math.round(todayMeals.reduce((acc, m) => acc + Number(m.protein || 0), 0) * 10) / 10;
  const consumedCarbs = Math.round(todayMeals.reduce((acc, m) => acc + Number(m.carbs || 0), 0) * 10) / 10;
  const consumedFat = Math.round(todayMeals.reduce((acc, m) => acc + Number(m.fat || 0), 0) * 10) / 10;

  // Estados de Carga Manual con autocalculadora
  const [newMeal, setNewMeal] = useState({ name: '', grams: '100', protein100: '', carbs100: '', fat100: '' });
  const [newGlucose, setNewGlucose] = useState({ value: '', type: 'Ayunas' });
  const [newWorkout, setNewWorkout] = useState({ activity: '', duration: '', calories: '' });
  const [newMeasurement, setNewMeasurement] = useState({ weight: '', waist: '', chest: '' });
  
  // Estados del Buscador Universal (Línea corregida con useState)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchGrams, setSearchGrams] = useState('100');
  const [detectedUnitInfo, setDetectedUnitInfo] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');

  const computeGramsForFood = (parsed, topFood) => {
    if (parsed.explicitGrams) {
      setSearchGrams(String(parsed.explicitGrams));
      setDetectedUnitInfo(`Calculando automáticamente para ${parsed.explicitGrams}g`);
      return;
    }
    const count = parsed.explicitCount || (parsed.explicitMeasureWeight ? 1 : null);
    if (count !== null) {
      const weightPerUnit = parsed.explicitMeasureWeight || (topFood && topFood.unitWeight) || 100;
      const totalG = Math.round(count * weightPerUnit);
      const label = parsed.explicitMeasureLabel || (topFood && topFood.unitName) || 'porción(es)';
      setSearchGrams(String(totalG));
      setDetectedUnitInfo(`${count} ${label} = ${totalG}g (Cuentas automáticas listas)`);
    } else if (topFood && topFood.unitWeight && topFood.unitWeight !== 100) {
      setDetectedUnitInfo(`1 ${topFood.unitName} pesa ~${topFood.unitWeight}g (Puedes tocar 1, 2, 3 abajo)`);
    } else {
      setDetectedUnitInfo('');
    }
  };

  const runInstantLocalSearch = (inputVal) => {
    setSearchQuery(inputVal);
    setSearchMessage('');

    if (!inputVal.trim()) {
      setSearchResults([]);
      setDetectedUnitInfo('');
      return;
    }

    const parsed = parseUniversalInput(inputVal);
    if (parsed.searchWords.length === 0) {
      if (parsed.explicitGrams) setSearchGrams(String(parsed.explicitGrams));
      return;
    }

    const matches = MEGA_FOOD_DB.filter(item => {
      const searchableText = normalizeBase(`${item.name} ${item.keywords || ''}`);
      return parsed.searchWords.every(w => searchableText.includes(w));
    });

    if (matches.length > 0) {
      computeGramsForFood(parsed, matches[0]);
      setSearchResults(matches);
    } else {
      if (parsed.explicitGrams) {
        setSearchGrams(String(parsed.explicitGrams));
        setDetectedUnitInfo(`Calculando para ${parsed.explicitGrams}g`);
      }
      setSearchResults([]);
    }
  };

  const handleOnlineFoodSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    const parsed = parseUniversalInput(searchQuery);
    const cleanFoodName = parsed.cleanText || normalizeBase(searchQuery);

    setIsSearching(true);
    setSearchMessage('');

    const localMatches = MEGA_FOOD_DB.filter(item => {
      const searchableText = normalizeBase(`${item.name} ${item.keywords || ''}`);
      return parsed.searchWords.length > 0 && parsed.searchWords.every(w => searchableText.includes(w));
    });

    let currentList = [...localMatches];
    if (currentList.length > 0) {
      computeGramsForFood(parsed, currentList[0]);
      setSearchResults(currentList);
    }

    if (navigator.onLine && cleanFoodName.length >= 2) {
      const firstWord = parsed.searchWords[0] || cleanFoodName;
      const usdaTerm = USDA_TRANSLATION_MAP[firstWord] || cleanFoodName;

      const fetchWithTimeout = (url, ms = 4000) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), ms);
        return fetch(url, { signal: controller.signal })
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
          .finally(() => clearTimeout(timer));
      };

      const usdaUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(usdaTerm)}&pageSize=5&api_key=DEMO_KEY`;
      const offArgUrl = `https://ar.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(cleanFoodName)}&search_simple=1&action=process&json=1&page_size=6`;
      const offWorldUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(cleanFoodName)}&search_simple=1&action=process&json=1&page_size=5`;

      const [usdaData, offArgData, offWorldData] = await Promise.all([
        fetchWithTimeout(usdaUrl),
        fetchWithTimeout(offArgUrl),
        fetchWithTimeout(offWorldUrl)
      ]);

      const parseOpenFoodFacts = (data, label) => {
        if (!data || !data.products) return [];
        return data.products
          .filter(p => (p.product_name_es || p.product_name) && p.nutriments)
          .map(p => {
            const pName = p.product_name_es || p.product_name;
            const brand = p.brands ? p.brands.split(',')[0].trim() : '';
            const fullName = brand ? `${pName} (${brand})` : pName;
            const inferred = inferSmartUnitWeight(fullName);
            return {
              name: fullName,
              protein: Math.round((Number(p.nutriments.proteins_100g) || 0) * 10) / 10,
              carbs: Math.round((Number(p.nutriments.carbohydrates_100g) || 0) * 10) / 10,
              fat: Math.round((Number(p.nutriments.fat_100g) || 0) * 10) / 10,
              unitWeight: inferred.unitWeight,
              unitName: inferred.unitName,
              source: brand ? `${label} (${brand})` : label
            };
          })
          .filter(item => item.protein > 0 || item.carbs > 0 || item.fat > 0);
      };

      const argItems = parseOpenFoodFacts(offArgData, 'Base Argentina');
      const worldItems = parseOpenFoodFacts(offWorldData, 'Base Mundial');

      let usdaItems = [];
      if (usdaData && usdaData.foods) {
        usdaItems = usdaData.foods.map(f => {
          const getNut = (id, num) => {
            const n = (f.foodNutrients || []).find(
              nut => nut.nutrientId === id || nut.nutrientNumber === String(num)
            );
            return n ? Math.round((Number(n.value) || 0) * 10) / 10 : 0;
          };
          const inferred = inferSmartUnitWeight(cleanFoodName);
          return {
            name: f.description,
            protein: getNut(1003, 203),
            carbs: getNut(1005, 205),
            fat: getNut(1004, 204),
            unitWeight: inferred.unitWeight,
            unitName: inferred.unitName,
            source: f.brandOwner ? `USDA (${f.brandOwner})` : 'USDA Oficial (EE.UU.)'
          };
        }).filter(item => item.protein > 0 || item.carbs > 0 || item.fat > 0);
      }

      const allCombined = [...currentList, ...argItems, ...usdaItems, ...worldItems];
      const seen = new Set();
      currentList = allCombined.filter(item => {
        const key = normalizeBase(item.name);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    if (currentList.length === 0) {
      setSearchMessage('No se encontró ese nombre. Prueba con una palabra clave simple o usa la Carga Manual Autocalculable de abajo.');
    } else {
      computeGramsForFood(parsed, currentList[0]);
      setSearchResults(currentList);
    }

    setIsSearching(false);
  };

  const applyUnitMultiplier = (food, unitsCount) => {
    const uWeight = food.unitWeight || 100;
    const totalG = Math.round(unitsCount * uWeight);
    setSearchGrams(String(totalG));
    setDetectedUnitInfo(`${unitsCount} ${food.unitName || 'porción'} = ${totalG}g (Cuentas actualizadas)`);
  };

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
    setDetectedUnitInfo('');
  };

  const addManualMeal = (e) => {
    e.preventDefault();
    if (!newMeal.name) return;
    const g = parseFloat(newMeal.grams) || 100;
    const ratio = g / 100;
    const finalP = Math.round((parseFloat(newMeal.protein100) || 0) * ratio * 10) / 10;
    const finalC = Math.round((parseFloat(newMeal.carbs100) || 0) * ratio * 10) / 10;
    const finalF = Math.round((parseFloat(newMeal.fat100) || 0) * ratio * 10) / 10;

    setMeals([{
      id: Date.now(),
      date: todayStr,
      name: `${newMeal.name} (${g}g)`,
      protein: finalP,
      carbs: finalC,
      fat: finalF
    }, ...meals]);

    setNewMeal({ name: '', grams: '100', protein100: '', carbs100: '', fat100: '' });
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

  const currentGramsNum = parseFloat(searchGrams) || 0;
  const manualRatio = (parseFloat(newMeal.grams) || 100) / 100;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col font-sans pb-24 box-border">
      
      {/* Cabecera Compacta Anti-Desborde */}
      <header className="bg-slate-900 border-b border-slate-800 px-3 py-3 sticky top-0 z-30 shadow-md w-full">
        <div className="max-w-md mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="bg-emerald-500 text-slate-950 w-9 h-9 rounded-xl font-black text-lg flex items-center justify-center shrink-0">
              T
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight truncate">Trakia</h1>
              <p className="text-[11px] text-slate-400 truncate">Control Metabólico & Macros</p>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0 whitespace-nowrap ${
            isOnline 
              ? 'bg-emerald-950 text-emerald-400 border-emerald-700' 
              : 'bg-amber-950 text-amber-400 border-amber-700'
          }`}>
            <Globe className="w-3 h-3 shrink-0" />
            <span>{isOnline ? '5 Bases Online' : 'Base Local'}</span>
          </div>
        </div>
      </header>

      {/* Contenedor Principal Ajustado a Pantalla */}
      <main className="flex-1 w-full max-w-md mx-auto px-3 py-3 space-y-3 box-border overflow-x-hidden">
        
        {/* PESTAÑA: INICIO */}
        {activeTab === 'inicio' && (
          <div className="space-y-3 w-full">
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow w-full">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Resumen de Macros Hoy</h2>
              <div className="grid grid-cols-3 gap-2 text-center w-full">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 min-w-0">
                  <div className="text-[11px] text-slate-400 truncate">Proteínas</div>
                  <div className="text-base font-bold text-emerald-400 truncate">
                    {consumedProtein}<span className="text-[11px] font-normal text-slate-500">/{macroGoals.protein}g</span>
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 min-w-0">
                  <div className="text-[11px] text-slate-400 truncate">Carbos</div>
                  <div className="text-base font-bold text-amber-400 truncate">
                    {consumedCarbs}<span className="text-[11px] font-normal text-slate-500">/{macroGoals.carbs}g</span>
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 min-w-0">
                  <div className="text-[11px] text-slate-400 truncate">Grasas</div>
                  <div className="text-base font-bold text-blue-400 truncate">
                    {consumedFat}<span className="text-[11px] font-normal text-slate-500">/{macroGoals.fat}g</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow w-full">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Acceso Rápido</h2>
              <div className="grid grid-cols-2 gap-2.5 w-full">
                <button onClick={() => setActiveTab('comidas')} className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition min-w-0">
                  <Utensils className="w-5 h-5 text-emerald-400 mb-1" />
                  <div className="font-semibold text-sm text-white truncate">Cargar Comida</div>
                  <div className="text-[11px] text-slate-400 truncate">Cálculo auto en todas</div>
                </button>
                <button onClick={() => setActiveTab('glucosa')} className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition min-w-0">
                  <Droplet className="w-5 h-5 text-rose-400 mb-1" />
                  <div className="font-semibold text-sm text-white truncate">Glucemia</div>
                  <div className="text-[11px] text-slate-400 truncate">Valores en sangre</div>
                </button>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl flex items-center gap-2.5 text-xs text-slate-300">
              <Database className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="leading-snug">
                Conversión automática activa en <strong>todas las comidas</strong>: escribe unidades, fetas, cucharadas o gramos (ej: <em>"3 huevos"</em>, <em>"2 fetas jamon"</em>, <em>"250g asado"</em>).
              </span>
            </div>
          </div>
        )}

        {/* PESTAÑA: COMIDAS Y MULTI-BUSCADOR UNIVERSAL */}
        {activeTab === 'comidas' && (
          <div className="space-y-3 w-full">
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow space-y-2.5 w-full">
              <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Buscador con Cálculo Automático Universal
              </h2>
              <form onSubmit={handleOnlineFoodSearch} className="space-y-2 w-full">
                <div className="flex items-center gap-1.5 w-full">
                  <input 
                    type="text" 
                    placeholder='Ej: "3 huevos", "2 fetas queso", "250g vacio"...' 
                    value={searchQuery}
                    onChange={(e) => runInstantLocalSearch(e.target.value)}
                    className="flex-1 min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <div className="relative w-24 shrink-0">
                    <input 
                      type="number" 
                      placeholder="Gramos" 
                      value={searchGrams}
                      onChange={(e) => {
                        setSearchGrams(e.target.value);
                        setDetectedUnitInfo(`Recalculando en vivo para ${e.target.value || 0}g`);
                      }}
                      className="w-full bg-slate-950 border border-amber-500/60 rounded-xl pl-2 pr-5 py-2 text-sm text-center text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                    />
                    <span className="absolute right-2 top-2.5 text-[10px] text-amber-400 font-bold">g</span>
                  </div>
                  <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-2.5 rounded-xl text-sm transition shrink-0 flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </button>
                </div>

                {/* Botonera rápida de gramos para recalcular cualquier comida con 1 toque */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-slate-400 mr-0.5">Cambiar peso:</span>
                  {[25, 50, 100, 150, 200, 250, 300].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setSearchGrams(String(g));
                        setDetectedUnitInfo(`Cuentas actualizadas para ${g}g`);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold border transition ${
                        Number(searchGrams) === g 
                          ? 'bg-amber-500 text-slate-950 border-amber-400' 
                          : 'bg-slate-950 text-slate-300 border-slate-800'
                      }`}
                    >
                      {g}g
                    </button>
                  ))}
                </div>

                {detectedUnitInfo && (
                  <div className="text-[11px] text-amber-400 font-semibold bg-amber-950/40 border border-amber-800/50 px-2.5 py-1 rounded-lg">
                    ✓ {detectedUnitInfo}
                  </div>
                )}
              </form>

              {isSearching && (
                <p className="text-xs text-emerald-400 animate-pulse">
                  Consultando servidores online (Argentina, USDA y Marcas)...
                </p>
              )}

              {searchMessage && (
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <span className="break-words">{searchMessage}</span>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-2 pt-1 max-h-80 overflow-y-auto w-full">
                  <div className="text-[11px] text-slate-300 font-medium">
                    Valores calculados para <strong className="text-amber-400">{currentGramsNum}g</strong>:
                  </div>
                  {searchResults.map((item, idx) => {
                    const ratio = currentGramsNum / 100;
                    const calcP = Math.round(item.protein * ratio * 10) / 10;
                    const calcC = Math.round(item.carbs * ratio * 10) / 10;
                    const calcF = Math.round(item.fat * ratio * 10) / 10;
                    const uWeight = item.unitWeight || 100;
                    const uName = item.unitName || 'porción';

                    return (
                      <div 
                        key={idx} 
                        className="p-2.5 bg-slate-950 border border-emerald-900/60 rounded-xl transition flex flex-col gap-2 w-full"
                      >
                        <div 
                          onClick={() => selectFoodFromSearch(item)}
                          className="flex justify-between items-center gap-2 w-full cursor-pointer"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs text-emerald-400 break-words leading-snug">{item.name}</div>
                            <div className="text-xs text-white mt-1 bg-slate-900 px-2 py-1 rounded-lg inline-block border border-slate-800">
                              En <strong>{currentGramsNum}g</strong> → P: <strong className="text-emerald-400">{calcP}g</strong> | C: <strong className="text-amber-400">{calcC}g</strong> | G: <strong className="text-blue-400">{calcF}g</strong>
                            </div>
                            <div className="text-[10px] text-slate-500 truncate mt-0.5">{item.source}</div>
                          </div>
                          <div className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2.5 py-2 rounded-xl shrink-0 font-bold text-xs flex items-center gap-1 shadow">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Sumar</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 border-t border-slate-800/80 pt-1.5 flex-wrap">
                          <span className="text-[10px] text-slate-400">Por {uName}:</span>
                          {[1, 2, 3, 4].map(u => (
                            <button
                              key={u}
                              type="button"
                              onClick={() => applyUnitMultiplier(item, u)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                currentGramsNum === Math.round(u * uWeight)
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                  : 'bg-slate-900 text-emerald-400 border-slate-700'
                              }`}
                            >
                              {u} ({Math.round(u * uWeight)}g)
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow w-full">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Carga Manual Autocalculable
              </h2>
              <form onSubmit={addManualMeal} className="space-y-2.5 w-full">
                <div className="flex gap-2 w-full">
                  <input 
                    type="text" 
                    placeholder="Nombre del alimento" 
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                    className="flex-1 min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <div className="relative w-24 shrink-0">
                    <input 
                      type="number" 
                      placeholder="Gramos" 
                      value={newMeal.grams}
                      onChange={(e) => setNewMeal({...newMeal, grams: e.target.value})}
                      className="w-full bg-slate-950 border border-amber-500/60 rounded-xl pl-2 pr-5 py-2 text-sm text-center text-amber-400 font-bold focus:outline-none"
                    />
                    <span className="absolute right-2 top-2.5 text-[10px] text-amber-400 font-bold">g</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 w-full">
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="Prot c/100g" 
                    value={newMeal.protein100}
                    onChange={(e) => setNewMeal({...newMeal, protein100: e.target.value})}
                    className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="Carb c/100g" 
                    value={newMeal.carbs100}
                    onChange={(e) => setNewMeal({...newMeal, carbs100: e.target.value})}
                    className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="Grasa c/100g" 
                    value={newMeal.fat100}
                    onChange={(e) => setNewMeal({...newMeal, fat100: e.target.value})}
                    className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                {(newMeal.protein100 || newMeal.carbs100 || newMeal.fat100) && (
                  <div className="text-[11px] text-slate-300 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    Total para <strong>{newMeal.grams || 100}g</strong> → P: <strong className="text-emerald-400">{Math.round((parseFloat(newMeal.protein100)||0)*manualRatio*10)/10}g</strong> | C: <strong className="text-amber-400">{Math.round((parseFloat(newMeal.carbs100)||0)*manualRatio*10)/10}g</strong> | G: <strong className="text-blue-400">{Math.round((parseFloat(newMeal.fat100)||0)*manualRatio*10)/10}g</strong>
                  </div>
                )}
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition">
                  Calcular y Agregar Comida
                </button>
              </form>
            </div>

            <div className="space-y-2 w-full">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Comidas Registradas Hoy</h3>
              {todayMeals.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No hay comidas registradas hoy.</p>
              ) : (
                todayMeals.map(m => (
                  <div key={m.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex justify-between items-center gap-2 w-full">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm text-white break-words leading-snug">{m.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">P: {m.protein || 0}g | C: {m.carbs || 0}g | G: {m.fat || 0}g</div>
                    </div>
                    <button onClick={() => setMeals(meals.filter(item => item.id !== m.id))} className="text-rose-400 hover:text-rose-300 p-1.5 shrink-0">
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
          <div className="space-y-3 w-full">
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow w-full">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Registro de Glucosa</h2>
              <form onSubmit={addGlucose} className="space-y-2.5 w-full">
                <div className="grid grid-cols-2 gap-2 w-full">
                  <input 
                    type="number" 
                    placeholder="Valor (mg/dL)" 
                    value={newGlucose.value}
                    onChange={(e) => setNewGlucose({...newGlucose, value: e.target.value})}
                    className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                  <select 
                    value={newGlucose.type}
                    onChange={(e) => setNewGlucose({...newGlucose, type: e.target.value})}
                    className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-sm focus:outline-none focus:border-rose-500 text-slate-200"
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

            <div className="space-y-2 w-full">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Historial de Glucosa</h3>
              {glucoseLogs.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Sin registros guardados.</p>
              ) : (
                glucoseLogs.map(g => (
                  <div key={g.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex justify-between items-center gap-2 w-full">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-base text-rose-400">{g.value} <span className="text-xs font-normal text-slate-400">mg/dL ({g.type})</span></div>
                      <div className="text-xs text-slate-500 truncate">{g.date}</div>
                    </div>
                    <button onClick={() => setGlucoseLogs(glucoseLogs.filter(item => item.id !== g.id))} className="text-rose-400 hover:text-rose-300 p-1.5 shrink-0">
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
          <div className="space-y-3 w-full">
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow w-full">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Registrar Actividad Física</h2>
              <form onSubmit={addWorkout} className="space-y-2.5 w-full">
                <input 
                  type="text" 
                  placeholder="Actividad (Caminata, trote, pesas...)" 
                  value={newWorkout.activity}
                  onChange={(e) => setNewWorkout({...newWorkout, activity: e.target.value})}
                  className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
                <div className="grid grid-cols-2 gap-2 w-full">
                  <input 
                    type="number" 
                    placeholder="Duración (min)" 
                    value={newWorkout.duration}
                    onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})}
                    className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <input 
                    type="number" 
                    placeholder="Calorías (kcal)" 
                    value={newWorkout.calories}
                    onChange={(e) => setNewWorkout({...newWorkout, calories: e.target.value})}
                    className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition">
                  Guardar Actividad
                </button>
              </form>
            </div>

            <div className="space-y-2 w-full">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Historial de Ejercicio</h3>
              {workouts.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Sin actividades registradas.</p>
              ) : (
                workouts.map(w => (
                  <div key={w.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex justify-between items-center gap-2 w-full">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm text-amber-400 break-words">{w.activity}</div>
                      <div className="text-xs text-slate-400">{w.duration || 0} min | {w.calories || 0} kcal</div>
                    </div>
                    <button onClick={() => setWorkouts(workouts.filter(item => item.id !== w.id))} className="text-rose-400 hover:text-rose-300 p-1.5 shrink-0">
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
          <div className="space-y-3 w-full">
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow w-full">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Medidas Corporales</h2>
              <form onSubmit={addMeasurement} className="space-y-2.5 w-full">
                <input 
                  type="number" 
                  step="0.1"
                  placeholder="Peso (kg)" 
                  value={newMeasurement.weight}
                  onChange={(e) => setNewMeasurement({...newMeasurement, weight: e.target.value})}
                  className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <div className="grid grid-cols-2 gap-2 w-full">
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="Cintura (cm)" 
                    value={newMeasurement.waist}
                    onChange={(e) => setNewMeasurement({...newMeasurement, waist: e.target.value})}
                    className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="Pecho (cm)" 
                    value={newMeasurement.chest}
                    onChange={(e) => setNewMeasurement({...newMeasurement, chest: e.target.value})}
                    className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-sm transition">
                  Guardar Medidas
                </button>
              </form>
            </div>

            <div className="space-y-2 w-full">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Historial de Medidas</h3>
              {measurements.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Sin medidas registradas.</p>
              ) : (
                measurements.map(m => (
                  <div key={m.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex justify-between items-center gap-2 w-full">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm text-blue-400">{m.weight} kg</div>
                      <div className="text-xs text-slate-400">Cintura: {m.waist || '-'} cm | Pecho: {m.chest || '-'} cm</div>
                    </div>
                    <button onClick={() => setMeasurements(measurements.filter(item => item.id !== m.id))} className="text-rose-400 hover:text-rose-300 p-1.5 shrink-0">
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
          <div className="space-y-3 w-full">
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2.5 shadow w-full">
              <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Metas Diarias de Macros (Gramos)</h2>
              <p className="text-xs text-slate-400 leading-snug">
                Personaliza aquí tus objetivos diarios de proteínas, carbohidratos y grasas:
              </p>
              <div className="grid grid-cols-3 gap-2 w-full">
                <div className="min-w-0">
                  <label className="text-[11px] text-slate-400 block mb-1 truncate">Proteínas (g)</label>
                  <input 
                    type="number" 
                    value={macroGoals.protein}
                    onChange={(e) => setMacroGoals({...macroGoals, protein: Number(e.target.value)})}
                    className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-sm text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="min-w-0">
                  <label className="text-[11px] text-slate-400 block mb-1 truncate">Carbos (g)</label>
                  <input 
                    type="number" 
                    value={macroGoals.carbs}
                    onChange={(e) => setMacroGoals({...macroGoals, carbs: Number(e.target.value)})}
                    className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-sm text-amber-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="min-w-0">
                  <label className="text-[11px] text-slate-400 block mb-1 truncate">Grasas (g)</label>
                  <input 
                    type="number" 
                    value={macroGoals.fat}
                    onChange={(e) => setMacroGoals({...macroGoals, fat: Number(e.target.value)})}
                    className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-sm text-blue-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2.5 shadow w-full">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Motor Universal Activo</h2>
              <div className="text-xs text-slate-300 space-y-1.5 leading-snug">
                <p>• <strong>Conversión automática en todo:</strong> Reconoce unidades, fetas, rebanadas, cucharadas, tazas, porciones, gramos y kilos en cualquier comida.</p>
                <p>• <strong>5 Bases Conectadas:</strong> ARGENFOODS, Marcas Argentinas (G4U, Colonial, Águila), USDA Oficial y OpenFoodFacts Mundial.</p>
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

      {/* Navegación Inferior Fija Anti-Desborde */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 py-2 px-1 z-40 w-full">
        <div className="max-w-md mx-auto grid grid-cols-6 gap-0.5 text-center w-full">
          <button onClick={() => setActiveTab('inicio')} className={`flex flex-col items-center py-1 min-w-0 ${activeTab === 'inicio' ? 'text-emerald-400' : 'text-slate-400'}`}>
            <Home className="w-5 h-5 mb-0.5 shrink-0" />
            <span className="text-[10px] font-medium truncate w-full">Inicio</span>
          </button>
          <button onClick={() => setActiveTab('comidas')} className={`flex flex-col items-center py-1 min-w-0 ${activeTab === 'comidas' ? 'text-emerald-400' : 'text-slate-400'}`}>
            <Utensils className="w-5 h-5 mb-0.5 shrink-0" />
            <span className="text-[10px] font-medium truncate w-full">Comidas</span>
          </button>
          <button onClick={() => setActiveTab('glucosa')} className={`flex flex-col items-center py-1 min-w-0 ${activeTab === 'glucosa' ? 'text-emerald-400' : 'text-slate-400'}`}>
            <Droplet className="w-5 h-5 mb-0.5 shrink-0" />
            <span className="text-[10px] font-medium truncate w-full">Glucemia</span>
          </button>
          <button onClick={() => setActiveTab('ejercicio')} className={`flex flex-col items-center py-1 min-w-0 ${activeTab === 'ejercicio' ? 'text-emerald-400' : 'text-slate-400'}`}>
            <Activity className="w-5 h-5 mb-0.5 shrink-0" />
            <span className="text-[10px] font-medium truncate w-full">Ejercicio</span>
          </button>
          <button onClick={() => setActiveTab('medidas')} className={`flex flex-col items-center py-1 min-w-0 ${activeTab === 'medidas' ? 'text-emerald-400' : 'text-slate-400'}`}>
            <Ruler className="w-5 h-5 mb-0.5 shrink-0" />
            <span className="text-[10px] font-medium truncate w-full">Medidas</span>
          </button>
          <button onClick={() => setActiveTab('ajustes')} className={`flex flex-col items-center py-1 min-w-0 ${activeTab === 'ajustes' ? 'text-emerald-400' : 'text-slate-400'}`}>
            <Settings className="w-5 h-5 mb-0.5 shrink-0" />
            <span className="text-[10px] font-medium truncate w-full">Ajustes</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
