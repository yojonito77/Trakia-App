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

// 1. MEGA BASE DE DATOS INTEGRADA (Valores cada 100g - Carbohidratos Netos verificados)
const MEGA_FOOD_DB = [
  // PANIFICADOS G4U (Línea Completa Proteica Low-Carb / Keto Argentina)
  { name: 'Pan de Molde Proteico G4U (Low-Carb / Keto)', protein: 23.3, carbs: 3.5, fat: 8.5, source: 'Marca G4U Oficial (Carbos netos)' },
  { name: 'Pan Árabe Proteico G4U (Low-Carb / Keto)', protein: 24.0, carbs: 3.2, fat: 7.5, source: 'Marca G4U Oficial (Carbos netos)' },
  { name: 'Pan de Hamburguesa Proteico G4U (Low-Carb / Keto)', protein: 23.5, carbs: 3.5, fat: 9.0, source: 'Marca G4U Oficial (Carbos netos)' },
  { name: 'Pan Ciabatta Proteico G4U (Low-Carb / Keto)', protein: 23.0, carbs: 3.8, fat: 8.0, source: 'Marca G4U Oficial (Carbos netos)' },
  { name: 'Tortillas / Rapiditas Proteicas G4U (Low-Carb / Keto)', protein: 22.0, carbs: 3.0, fat: 9.0, source: 'Marca G4U Oficial (Carbos netos)' },
  { name: 'Croissant Proteico G4U (Low-Carb / Sin Azúcar)', protein: 20.0, carbs: 4.0, fat: 18.0, source: 'Marca G4U Oficial (Carbos netos)' },
  { name: 'Pan Nube Casero (Cloud Bread Low-Carb)', protein: 14.0, carbs: 1.5, fat: 11.0, source: 'Recetario Low-Carb' },
  { name: 'Pan de Harina de Almendras Casero (Keto)', protein: 15.0, carbs: 4.0, fat: 22.0, source: 'Recetario Low-Carb' },

  // CHOCOLATES COLONIAL (Línea Sin Azúcar con Stevia y Línea Orgánica)
  { name: 'Chocolate Colonial 70% Cacao Sin Azúcar con Stevia', protein: 11.2, carbs: 8.8, fat: 33.2, source: 'Colonial Oficial (Carbos netos s/polialcoholes)' },
  { name: 'Chocolate Colonial 80% Cacao Sin Azúcar con Stevia', protein: 12.0, carbs: 6.5, fat: 38.0, source: 'Colonial Oficial (Carbos netos s/polialcoholes)' },
  { name: 'Chocolate Colonial 55% Cacao Sin Azúcar (Dietético)', protein: 8.5, carbs: 11.0, fat: 32.0, source: 'Colonial Oficial (Carbos netos s/polialcoholes)' },
  { name: 'Chocolate Colonial Blanco Sin Azúcar (Dietético)', protein: 9.0, carbs: 12.0, fat: 35.0, source: 'Colonial Oficial (Carbos netos s/polialcoholes)' },
  { name: 'Chocolate Colonial Con Leche Sin Azúcar con Stevia', protein: 9.5, carbs: 11.5, fat: 34.0, source: 'Colonial Oficial (Carbos netos)' },
  { name: 'Chocolate Colonial Orgánico 80% Cacao', protein: 10.6, carbs: 18.4, fat: 45.0, source: 'Colonial Oficial (Carbos netos)' },
  { name: 'Chocolate Colonial Orgánico 70% Cacao', protein: 9.2, carbs: 27.0, fat: 41.0, source: 'Colonial Oficial (Carbos netos)' },
  { name: 'Chocolate Colonial Orgánico 60% Cacao', protein: 8.0, carbs: 36.0, fat: 36.0, source: 'Colonial Oficial (Carbos netos)' },
  { name: 'Chocolate Colonial 100% Cacao Puro (Masa de cacao)', protein: 14.0, carbs: 8.0, fat: 52.0, source: 'Colonial Oficial (Carbos netos)' },

  // CHOCOLATES ÁGUILA (Arcor - Todas las variedades)
  { name: 'Chocolate Águila 80% Cacao Amargo', protein: 11.0, carbs: 20.0, fat: 44.0, source: 'Águila Arcor Oficial (Carbos netos)' },
  { name: 'Chocolate Águila 70% Cacao Amargo', protein: 9.5, carbs: 29.0, fat: 41.9, source: 'Águila Arcor Oficial (Carbos netos)' },
  { name: 'Chocolate Águila 60% Cacao Amargo Extra Fino', protein: 7.8, carbs: 38.0, fat: 37.6, source: 'Águila Arcor Oficial (Carbos netos)' },
  { name: 'Chocolate Águila Semiamargo Clásico Taza (45% Cacao)', protein: 5.2, carbs: 56.0, fat: 30.0, source: 'Águila Arcor Oficial' },
  { name: 'Chocolate Águila Sin Azúcar Agregada Semiamargo', protein: 6.5, carbs: 16.0, fat: 33.0, source: 'Águila Arcor (Carbos netos s/maltitol)' },
  { name: 'Chocolate Águila Con Leche', protein: 6.8, carbs: 55.0, fat: 31.0, source: 'Águila Arcor Oficial' },
  { name: 'Chocolate Águila Blanco', protein: 5.5, carbs: 58.0, fat: 32.0, source: 'Águila Arcor Oficial' },
  { name: 'Cacao Amargo Puro en Polvo Águila (Sin Azúcar)', protein: 20.0, carbs: 11.0, fat: 14.0, source: 'Águila Arcor Oficial (Carbos netos)' },

  // OTROS CHOCOLATES Y DULCES LOW-CARB
  { name: 'Chocolate Amargo 85% Cacao (Estándar Internacional)', protein: 11.0, carbs: 14.0, fat: 48.0, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Chocolate Amargo 90% Cacao (Estándar Internacional)', protein: 12.0, carbs: 10.0, fat: 51.0, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Chocolate Dr. Cacao / Vidanto 80% Sin Azúcar', protein: 11.5, carbs: 7.5, fat: 42.0, source: 'Base Dietéticas Argentina' },
  { name: 'Dulce de Leche Sin Azúcar (Trini / Colonial / Diet)', protein: 7.0, carbs: 14.0, fat: 6.5, source: 'Base Dietéticas Argentina (Carbos netos)' },
  { name: 'Dulce de Leche Tradicional (La Serenísima / Sancor)', protein: 6.5, carbs: 56.0, fat: 7.0, source: 'Base ARGENFOODS' },

  // CARNES VACUNAS (Todos los cortes Argentinos y de Parrilla)
  { name: 'Asado de tira / Tira de asado (cocido)', protein: 22.0, carbs: 0, fat: 25.0, source: 'Base ARGENFOODS / USDA' },
  { name: 'Vacío vacuno (asado o al horno)', protein: 24.0, carbs: 0, fat: 20.0, source: 'Base ARGENFOODS' },
  { name: 'Entraña vacuna (asada)', protein: 23.0, carbs: 0, fat: 21.0, source: 'Base ARGENFOODS' },
  { name: 'Bife de chorizo / Entrecot (cocido)', protein: 25.0, carbs: 0, fat: 18.0, source: 'Base ARGENFOODS / USDA' },
  { name: 'Ojo de bife / Ribeye (cocido)', protein: 24.0, carbs: 0, fat: 22.0, source: 'Base ARGENFOODS / USDA' },
  { name: 'Bife ancho / Bife angosto', protein: 24.5, carbs: 0, fat: 16.0, source: 'Base ARGENFOODS' },
  { name: 'Lomo vacuno (magro cocido)', protein: 27.0, carbs: 0, fat: 8.0, source: 'Base ARGENFOODS / USDA' },
  { name: 'Cuadril / Colita de cuadril / Tapa de cuadril (Picanha)', protein: 26.0, carbs: 0, fat: 12.0, source: 'Base ARGENFOODS' },
  { name: 'Nalga / Bola de lomo / Cuadrada (cortes magros)', protein: 28.0, carbs: 0, fat: 6.0, source: 'Base ARGENFOODS' },
  { name: 'Peceto vacuno (cocido)', protein: 29.0, carbs: 0, fat: 5.0, source: 'Base ARGENFOODS' },
  { name: 'Matambre vacuno (asado o hervido)', protein: 22.0, carbs: 0, fat: 19.0, source: 'Base ARGENFOODS' },
  { name: 'Tapa de asado / Tapa de nalga', protein: 23.0, carbs: 0, fat: 18.0, source: '
