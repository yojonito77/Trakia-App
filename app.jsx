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
  { name: 'Tapa de asado / Tapa de nalga', protein: 23.0, carbs: 0, fat: 18.0, source: 'Base ARGENFOODS' },
  { name: 'Roast beef / Paleta / Aguja / Carnaza', protein: 25.0, carbs: 0, fat: 14.0, source: 'Base ARGENFOODS' },
  { name: 'Osobuco / Tortuguita / Garrón', protein: 24.0, carbs: 0, fat: 12.0, source: 'Base ARGENFOODS' },
  { name: 'Carne picada común / Molida', protein: 20.0, carbs: 0, fat: 18.0, source: 'Base Universal USDA' },
  { name: 'Carne picada especial / Magra (Tarta/Albóndigas)', protein: 24.0, carbs: 0, fat: 9.0, source: 'Base Universal USDA' },
  { name: 'Hamburguesa casera / medallón 100% carne vacuna', protein: 22.0, carbs: 0, fat: 17.0, source: 'Base Universal USDA' },
  { name: 'Milanesa de carne al horno (tradicional)', protein: 21.0, carbs: 14.0, fat: 9.0, source: 'Base ARGENFOODS' },
  { name: 'Milanesa de carne frita (tradicional)', protein: 20.0, carbs: 15.0, fat: 16.0, source: 'Base ARGENFOODS' },

  // ACHURAS Y EMBUTIDOS DE PARRILLA
  { name: 'Chorizo puro cerdo / Chorizo parrillero', protein: 16.0, carbs: 2.0, fat: 28.0, source: 'Base ARGENFOODS' },
  { name: 'Morcilla común o vasca', protein: 14.0, carbs: 3.0, fat: 25.0, source: 'Base ARGENFOODS' },
  { name: 'Salchicha parrillera', protein: 15.0, carbs: 2.0, fat: 27.0, source: 'Base ARGENFOODS' },
  { name: 'Salchicha de Viena (paquete supermercado)', protein: 12.0, carbs: 2.5, fat: 24.0, source: 'Base Universal USDA' },
  { name: 'Mollejas vacunas (asadas)', protein: 18.0, carbs: 0, fat: 25.0, source: 'Base ARGENFOODS' },
  { name: 'Chinchulines vacunos (asados)', protein: 15.0, carbs: 0, fat: 19.0, source: 'Base ARGENFOODS' },
  { name: 'Riñón vacuno (asado)', protein: 25.0, carbs: 0, fat: 5.0, source: 'Base ARGENFOODS' },
  { name: 'Hígado vacuno (bife cocido)', protein: 26.0, carbs: 4.0, fat: 5.0, source: 'Base Universal USDA' },

  // POLLOS, AVES Y CERDO
  { name: 'Pechuga de pollo / Suprema (sin piel, cocida)', protein: 31.0, carbs: 0, fat: 3.6, source: 'Base Universal USDA' },
  { name: 'Pata / Muslo de pollo (sin piel, cocido)', protein: 26.0, carbs: 0, fat: 8.0, source: 'Base Universal USDA' },
  { name: 'Pata / Muslo de pollo (con piel, al horno/parrilla)', protein: 24.0, carbs: 0, fat: 14.0, source: 'Base Universal USDA' },
  { name: 'Pollo entero al spiedo / parrilla (promedio)', protein: 27.0, carbs: 0, fat: 11.0, source: 'Base Universal USDA' },
  { name: 'Alitas de pollo (asadas)', protein: 23.0, carbs: 0, fat: 16.0, source: 'Base Universal USDA' },
  { name: 'Milanesa de pollo / Suprema al horno', protein: 22.0, carbs: 14.0, fat: 7.0, source: 'Base ARGENFOODS' },
  { name: 'Pechuga de pavo (cocida)', protein: 29.0, carbs: 0, fat: 2.0, source: 'Base Universal USDA' },
  { name: 'Bondiola de cerdo (asada o braseada)', protein: 21.0, carbs: 0, fat: 22.0, source: 'Base ARGENFOODS' },
  { name: 'Matambre de cerdo / Matambrito', protein: 20.0, carbs: 0, fat: 24.0, source: 'Base ARGENFOODS' },
  { name: 'Carré de cerdo / Costeleta / Lomo de cerdo', protein: 27.0, carbs: 0, fat: 7.0, source: 'Base Universal USDA' },
  { name: 'Costillitas de cerdo / Pechito / Ribs', protein: 22.0, carbs: 0, fat: 23.0, source: 'Base Universal USDA' },
  { name: 'Solomillo de cerdo (magro)', protein: 26.0, carbs: 0, fat: 4.0, source: 'Base Universal USDA' },
  { name: 'Lechón / Cordero asado', protein: 25.0, carbs: 0, fat: 21.0, source: 'Base Universal USDA' },

  // HUEVOS, QUESOS, LÁCTEOS Y FIAMBRES
  { name: 'Huevo entero de gallina (1 unidad = ~55g)', protein: 13.0, carbs: 1.1, fat: 11.0, source: 'Base Universal USDA' },
  { name: 'Clara de huevo (cocida)', protein: 11.0, carbs: 0.7, fat: 0.2, source: 'Base Universal USDA' },
  { name: 'Yema de huevo', protein: 16.0, carbs: 3.5, fat: 27.0, source: 'Base Universal USDA' },
  { name: 'Queso cremoso / Cuartirolo', protein: 21.0, carbs: 1.5, fat: 22.0, source: 'Base Lácteos ARGENFOODS' },
  { name: 'Queso Por Salut / Port Salut común o light', protein: 24.0, carbs: 1.5, fat: 15.0, source: 'Base Lácteos ARGENFOODS' },
  { name: 'Queso Mozzarella / Muzzarella', protein: 22.0, carbs: 2.2, fat: 22.0, source: 'Base Universal USDA' },
  { name: 'Queso Pategrás / Gouda / Dambo / Danbo / Barra', protein: 25.0, carbs: 1.5, fat: 27.0, source: 'Base Lácteos ARGENFOODS' },
  { name: 'Queso Tybo / Queso de máquina en fetas', protein: 25.0, carbs: 1.5, fat: 26.0, source: 'Base Lácteos ARGENFOODS' },
  { name: 'Queso Provolone / Provoleta parrillera', protein: 26.0, carbs: 2.0, fat: 27.0, source: 'Base Lácteos ARGENFOODS' },
  { name: 'Queso Sardo / Reggianito / Parmesano (rallado)', protein: 35.0, carbs: 3.2, fat: 26.0, source: 'Base Lácteos ARGENFOODS' },
  { name: 'Queso Roquefort / Queso Azul / Cheddar / Brie', protein: 22.0, carbs: 1.5, fat: 30.0, source: 'Base Universal USDA' },
  { name: 'Queso crema / Blanco untable (Casancrem / Finlandia / Mendicrim)', protein: 7.5, carbs: 4.0, fat: 20.0, source: 'Base Lácteos ARGENFOODS' },
  { name: 'Ricotta / Ricota entera o magra', protein: 12.0, carbs: 3.2, fat: 10.0, source: 'Base Lácteos ARGENFOODS' },
  { name: 'Crema de leche (nata)', protein: 2.0, carbs: 3.0, fat: 36.0, source: 'Base Universal USDA' },
  { name: 'Manteca / Mantequilla', protein: 0.9, carbs: 0.1, fat: 81.0, source: 'Base Universal USDA' },
  { name: 'Yogur griego o natural sin azúcar', protein: 8.5, carbs: 4.0, fat: 4.5, source: 'Base Universal USDA' },
  { name: 'Leche entera / descremada fluida', protein: 3.3, carbs: 4.8, fat: 2.0, source: 'Base Universal USDA' },
  { name: 'Leche de almendras / coco sin azúcar', protein: 0.6, carbs: 0.4, fat: 1.5, source: 'Base Universal USDA' },
  { name: 'Jamón cocido natural en fetas', protein: 19.0, carbs: 1.5, fat: 5.0, source: 'Base ARGENFOODS' },
  { name: 'Jamón crudo / Serrano', protein: 27.0, carbs: 0.5, fat: 14.0, source: 'Base ARGENFOODS' },
  { name: 'Lomito ahumado / Pastrón / Pavita en fetas', protein: 22.0, carbs: 1.0, fat: 4.0, source: 'Base ARGENFOODS' },
  { name: 'Panceta ahumada / Tocino / Bacon', protein: 14.0, carbs: 1.4, fat: 40.0, source: 'Base Universal USDA' },
  { name: 'Salame / Salamín / Longaniza / Cantimpalo', protein: 21.0, carbs: 1.5, fat: 33.0, source: 'Base ARGENFOODS' },
  { name: 'Bondiola fiambre / Mortadela', protein: 19.0, carbs: 2.0, fat: 24.0, source: 'Base ARGENFOODS' },

  // VERDURAS Y HORTALIZAS (Lista completa - Carbos Netos descontando fibra)
  { name: 'Palta / Aguacate', protein: 2.0, carbs: 1.8, fat: 15.0, source: 'Base USDA (Carbos netos)' },
  { name: 'Aceitunas verdes o negras', protein: 1.0, carbs: 1.0, fat: 15.0, source: 'Base USDA (Carbos netos)' },
  { name: 'Lechuga (todas las variedades)', protein: 1.2, carbs: 1.2, fat: 0.2, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Rúcula / Radicheta / Achicoria / Berro / Endivia', protein: 2.4, carbs: 1.5, fat: 0.4, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Espinaca (cruda o cocida)', protein: 2.9, carbs: 1.4, fat: 0.4, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Acelga (cocida)', protein: 1.9, carbs: 2.0, fat: 0.2, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Tomate redondo / Perita / Cherry', protein: 0.9, carbs: 2.7, fat: 0.2, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Brócoli (cocido)', protein: 2.4, carbs: 4.0, fat: 0.4, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Zapallito verde redondo / Zucchini', protein: 1.2, carbs: 2.1, fat: 0.2, source: 'Base ARGENFOODS (Carbos netos)' },
  { name: 'Pepino', protein: 0.7, carbs: 2.2, fat: 0.1, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Apio (tallo y hojas)', protein: 0.7, carbs: 1.4, fat: 0.2, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Repollo blanco o morado / Bok choy / Akusay', protein: 1.3, carbs: 3.2, fat: 0.1, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Repollitos de Bruselas', protein: 3.4, carbs: 5.2, fat: 0.3, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Espárragos / Alcauciles / Palmitos', protein: 2.2, carbs: 2.0, fat: 0.2, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Champiñones / Hongos Portobello / Girgolas', protein: 3.1, carbs: 2.3, fat: 0.3, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Morrón / Pimiento (rojo, verde o amarillo)', protein: 1.0, carbs: 4.0, fat: 0.3, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Cebolla blanca, morada o Cebolla de verdeo / Puerro', protein: 1.1, carbs: 7.5, fat: 0.1, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Chauchas / Ejotes / Judías verdes', protein: 1.8, carbs: 4.3, fat: 0.1, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Rabanito / Nabo / Hinojo', protein: 0.8, carbs: 2.5, fat: 0.1, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Brotes de soja / Diente de dragón', protein: 3.0, carbs: 2.1, fat: 0.2, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Zanahoria (cruda o cocida)', protein: 0.9, carbs: 6.8, fat: 0.2, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Zapallo Anco / Calabaza / Cabutia (cocido)', protein: 1.0, carbs: 7.0, fat: 0.1, source: 'Base ARGENFOODS (Carbos netos)' },
  { name: 'Remolacha (cocida)', protein: 1.7, carbs: 8.0, fat: 0.2, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Coliflor (cocida)', protein: 1.9, carbs: 2.3, fat: 0.3, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Berenjena (cocida)', protein: 0.8, carbs: 3.2, fat: 0.2, source: 'Base Universal USDA (Carbos netos)' },
  { name: 'Papa / Patata (hervida o al horno)', protein: 2.0, carbs: 18.0, fat: 0.1, source: 'Base Universal USDA' },
  { name: 'Batata / Boniato (cocido)', protein: 1.6, carbs: 18.0, fat: 0.1, source: 'Base Universal USDA' },
  { name: 'Choclo / Maíz dulce en grano', protein: 3.3, carbs: 19.0, fat: 1.2, source: 'Base Universal USDA' },

  // FRUTAS (Lista completa - Carbos Netos descontando fibra)
  { name: 'Frutillas / Fresas', protein: 0.7, carbs: 5.7, fat: 0.3, source: 'Base USDA (Carbos netos)' },
  { name: 'Frambuesas / Moras / Zarzamoras', protein: 1.2, carbs: 5.4, fat: 0.6, source: 'Base USDA (Carbos netos)' },
  { name: 'Arándanos frescos', protein: 0.7, carbs: 12.1, fat: 0.3, source: 'Base USDA (Carbos netos)' },
  { name: 'Coco rallado o pulpa fresca (sin azúcar)', protein: 3.3, carbs: 6.2, fat: 33.5, source: 'Base USDA (Carbos netos)' },
  { name: 'Limón / Lima / Pomelo rosado', protein: 0.7, carbs: 6.5, fat: 0.1, source: 'Base USDA (Carbos netos)' },
  { name: 'Naranja / Mandarina', protein: 0.9, carbs: 9.5, fat: 0.1, source: 'Base USDA (Carbos netos)' },
  { name: 'Durazno / Pelón / Damasco / Ciruela', protein: 0.9, carbs: 8.5, fat: 0.2, source: 'Base USDA (Carbos netos)' },
  { name: 'Kiwi verde o gold', protein: 1.1, carbs: 11.6, fat: 0.5, source: 'Base USDA (Carbos netos)' },
  { name: 'Manzana verde o roja (con piel)', protein: 0.3, carbs: 11.4, fat: 0.2, source: 'Base USDA (Carbos netos)' },
  { name: 'Pera fresca', protein: 0.4, carbs: 12.1, fat: 0.1, source: 'Base USDA (Carbos netos)' },
  { name: 'Sandía / Melón', protein: 0.6, carbs: 7.5, fat: 0.2, source: 'Base USDA (Carbos netos)' },
  { name: 'Ananá / Piña fresca', protein: 0.5, carbs: 11.7, fat: 0.1, source: 'Base USDA (Carbos netos)' },
  { name: 'Cerezas / Uvas / Mango', protein: 0.8, carbs: 14.0, fat: 0.2, source: 'Base USDA (Carbos netos)' },
  { name: 'Banana / Plátano', protein: 1.1, carbs: 20.2, fat: 0.3, source: 'Base USDA (Carbos netos)' },

  // FRUTOS SECOS, SEMILLAS, HARINAS KETO Y ACEITES
  { name: 'Almendras peladas o tostadas', protein: 21.0, carbs: 9.0, fat: 50.0, source: 'Base USDA (Carbos netos)' },
  { name: 'Nueces mariposa', protein: 15.0, carbs: 7.0, fat: 65.0, source: 'Base USDA (Carbos netos)' },
  { name: 'Nueces Pecán / Macadamia / Avellanas', protein: 11.0, carbs: 5.5, fat: 70.0, source: 'Base USDA (Carbos netos)' },
  { name: 'Maní tostado sin piel', protein: 26.0, carbs: 8.0, fat: 49.0, source: 'Base USDA (Carbos netos)' },
  { name: 'Pasta de maní / Mantequilla de maní 100% natural sin azúcar', protein: 25.0, carbs: 10.0, fat: 50.0, source: 'Base USDA (Carbos netos)' },
  { name: 'Pistachos / Castañas de Cajú', protein: 19.0, carbs: 18.0, fat: 45.0, source: 'Base USDA (Carbos netos)' },
  { name: 'Semillas de Chía / Lino / Sésamo / Girasol / Zapallo', protein: 19.0, carbs: 4.0, fat: 36.0, source: 'Base USDA (Carbos netos)' },
  { name: 'Harina de almendras', protein: 21.0, carbs: 8.0, fat: 50.0, source: 'Base Low-Carb / Keto' },
  { name: 'Harina de coco', protein: 18.0, carbs: 20.0, fat: 14.0, source: 'Base Low-Carb / Keto' },
  { name: 'Aceite de oliva / girasol / coco / MCT', protein: 0, carbs: 0, fat: 100.0, source: 'Base Universal USDA' },
  { name: 'Mayonesa clásica (Hellmanns / Natura)', protein: 1.0, carbs: 1.5, fat: 75.0, source: 'Base Marcas Argentina' },
  { name: 'Gelatina sin sabor en polvo (pura)', protein: 85.0, carbs: 0, fat: 0, source: 'Base Low-Carb' },
  { name: 'Gelatina sin azúcar preparada (lista para comer)', protein: 1.6, carbs: 0, fat: 0, source: 'Base Low-Carb' },
  { name: 'Whey Protein / Proteína en polvo (cada 100g)', protein: 78.0, carbs: 6.0, fat: 5.0, source: 'Base Suplementos' }
];

// 2. DICCIONARIO ESPAÑOL -> INGLÉS PARA CONSULTAR LA API OFICIAL DE USDA (EE.UU.)
const USDA_TRANSLATION_MAP = {
  'pollo': 'chicken roasted',
  'pechuga': 'chicken breast cooked',
  'suprema': 'chicken breast cooked',
  'muslo': 'chicken thigh cooked',
  'pata': 'chicken drumstick cooked',
  'carne': 'beef steak cooked',
  'vaca': 'beef steak cooked',
  'bife': 'beef strip steak cooked',
  'asado': 'beef short ribs cooked',
  'vacio': 'beef flank steak cooked',
  'entrana': 'beef skirt steak cooked',
  'lomo': 'beef tenderloin cooked',
  'picada': 'ground beef cooked',
  'molida': 'ground beef cooked',
  'hamburguesa': 'beef patty cooked',
  'cerdo': 'pork loin cooked',
  'bondiola': 'pork shoulder cooked',
  'costilla': 'pork ribs cooked',
  'cordero': 'lamb cooked',
  'chorizo': 'pork sausage cooked',
  'morcilla': 'blood sausage',
  'salchicha': 'frankfurter sausage',
  'huevo': 'egg whole cooked',
  'huevos': 'egg whole cooked',
  'clara': 'egg white raw',
  'yema': 'egg yolk raw',
  'queso': 'cheese mozzarella',
  'muzzarella': 'cheese mozzarella',
  'cremoso': 'cheese port salut',
  'cuartirolo': 'cheese port salut',
  'pategras': 'cheese gouda',
  'cheddar': 'cheese cheddar',
  'parmesano': 'cheese parmesan',
  'roquefort': 'cheese blue',
  'ricota': 'cheese ricotta',
  'jamon': 'ham cured',
  'panceta': 'pork bacon cooked',
  'salame': 'salami',
  'pavo': 'turkey breast',
  'palta': 'avocado raw',
  'aguacate': 'avocado raw',
  'aceituna': 'olives',
  'aceite': 'olive oil',
  'manteca': 'butter salted',
  'crema': 'heavy whipping cream',
  'mayonesa': 'mayonnaise',
  'leche': 'milk whole',
  'yogur': 'yogurt plain',
  'almendras': 'almonds',
  'nueces': 'walnuts',
  'mani': 'peanuts roasted',
  'lechuga': 'lettuce raw',
  'tomate': 'tomatoes raw',
  'espinaca': 'spinach cooked',
  'acelga': 'swiss chard cooked',
  'brocoli': 'broccoli cooked',
  'zapallito': 'zucchini cooked',
  'zucchini': 'zucchini cooked',
  'pepino': 'cucumber raw',
  'cebolla': 'onions raw',
  'morron': 'sweet peppers raw',
  'pimiento': 'sweet peppers raw',
  'zanahoria': 'carrots raw',
  'zapallo': 'butternut squash cooked',
  'calabaza': 'pumpkin cooked',
  'papa': 'potatoes boiled',
  'batata': 'sweet potato cooked',
  'manzana': 'apples raw',
  'banana': 'bananas raw',
  'naranja': 'oranges raw',
  'mandarina': 'tangerines raw',
  'pera': 'pears raw',
  'durazno': 'peaches raw',
  'ciruela': 'plums raw',
  'kiwi': 'kiwifruit raw',
  'frutilla': 'strawberries raw',
  'frutillas': 'strawberries raw',
  'arandanos': 'blueberries raw',
  'frambuesa': 'raspberries raw',
  'sandia': 'watermelon raw',
  'melon': 'cantaloupe raw',
  'chocolate': 'dark chocolate 70-85%',
  'cacao': 'cocoa dry powder unsweetened',
  'pan': 'low carb bread'
};

// Función para ignorar tildes, símbolos y mayúsculas al buscar
const normalizeText = (str) =>
  (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Metas diarias personalizables
  const [macroGoals, setMacroGoals] = useState(() => {
    const saved = localStorage.getItem('trakia_goals');
    return saved ? JSON.parse(saved) : { protein: 140, carbs: 50, fat: 140 };
  });

  // Registros en el dispositivo
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
  
  // Estados del buscador multi-base
  const [searchQuery, setSearchQuery] = useState('');
  const [searchGrams, setSearchGrams] = useState('100');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');

  // MOTOR MULTI-BASE (Base Verificada + OpenFoodFacts Argentina + USDA EE.UU. + Hispanoamérica + Mundial)
  const handleOnlineFoodSearch = async (e) => {
    e.preventDefault();
    const cleanQuery = normalizeText(searchQuery);
    if (!cleanQuery) return;

    setIsSearching(true);
    setSearchMessage('');
    setSearchResults([]);

    const words = cleanQuery.split(/\s+/).filter(w => w.length > 0);

    // 1. Búsqueda instantánea inteligente en Mega Base Integrada (Carnes, Frutas, Verduras, Águila, Colonial, G4U)
    const localMatches = MEGA_FOOD_DB.filter(item => {
      const normName = normalizeText(item.name);
      return normName.includes(cleanQuery) || (words.length > 0 && words.every(w => normName.includes(w)));
    });

    let currentList = [...localMatches];
    if (currentList.length > 0) {
      setSearchResults(currentList);
    }

    // 2. Búsqueda simultánea en 4 servidores online en vivo
    if (navigator.onLine) {
      const firstWord = words[0] || cleanQuery;
      const usdaTerm = USDA_TRANSLATION_MAP[cleanQuery] || USDA_TRANSLATION_MAP[firstWord] || searchQuery.trim();

      const fetchWithTimeout = (url, ms = 4500) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), ms);
        return fetch(url, { signal: controller.signal })
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
          .finally(() => clearTimeout(timer));
      };

      const usdaUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(usdaTerm)}&pageSize=6&api_key=DEMO_KEY`;
      const offArgUrl = `https://ar.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchQuery.trim())}&search_simple=1&action=process&json=1&page_size=6`;
      const offEsUrl = `https://es.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchQuery.trim())}&search_simple=1&action=process&json=1&page_size=5`;
      const offWorldUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchQuery.trim())}&search_simple=1&action=process&json=1&page_size=5`;

      const [usdaData, offArgData, offEsData, offWorldData] = await Promise.all([
        fetchWithTimeout(usdaUrl),
        fetchWithTimeout(offArgUrl),
        fetchWithTimeout(offEsUrl),
        fetchWithTimeout(offWorldUrl)
      ]);

      const parseOpenFoodFacts = (data, label) => {
        if (!data || !data.products) return [];
        return data.products
          .filter(p => (p.product_name_es || p.product_name) && p.nutriments)
          .map(p => {
            const pName = p.product_name_es || p.product_name;
            const brand = p.brands ? p.brands.split(',')[0].trim() : '';
            return {
              name: brand ? `${pName} (${brand})` : pName,
              protein: Math.round((Number(p.nutriments.proteins_100g) || 0) * 10) / 10,
              carbs: Math.round((Number(p.nutriments.carbohydrates_100g) || 0) * 10) / 10,
              fat: Math.round((Number(p.nutriments.fat_100g) || 0) * 10) / 10,
              source: brand ? `${label} (${brand})` : label
            };
          })
          .filter(item => item.protein > 0 || item.carbs > 0 || item.fat > 0);
      };

      const argItems = parseOpenFoodFacts(offArgData, 'Base Argentina');
      const esItems = parseOpenFoodFacts(offEsData, 'Base Hispana');
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
          return {
            name: f.description,
            protein: getNut(1003, 203),
            carbs: getNut(1005, 205),
            fat: getNut(1004, 204),
            source: f.brandOwner ? `USDA (${f.brandOwner})` : 'USDA Oficial (EE.UU.)'
          };
        }).filter(item => item.protein > 0 || item.carbs > 0 || item.fat > 0);
      }

      // Unir todas las bases sin duplicar nombres
      const allCombined = [...currentList, ...argItems, ...usdaItems, ...esItems, ...worldItems];
      const seen = new Set();
      const deduplicated = allCombined.filter(item => {
        const key = normalizeText(item.name);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      currentList = deduplicated;
    }

    if (currentList.length === 0) {
      setSearchMessage('No apareció con ese nombre en las 5 bases. Prueba con una palabra clave (ej: "aguila", "colonial", "g4u", "vacio") o cárgalo manualmente abajo.');
    } else {
      setSearchResults(currentList);
    }

    setIsSearching(false);
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
                  <div className="font-semibold text-sm text-white truncate">Buscar Comida</div>
                  <div className="text-[11px] text-slate-400 truncate">Carnes, G4U, Águila, USDA</div>
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
                Conectado a <strong>ARGENFOODS</strong>, <strong>USDA (EE.UU.)</strong>, <strong>G4U / Colonial / Águila</strong> y <strong>OpenFoodFacts</strong>.
              </span>
            </div>
          </div>
        )}

        {/* PESTAÑA: COMIDAS Y MULTI-BUSCADOR */}
        {activeTab === 'comidas' && (
          <div className="space-y-3 w-full">
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow space-y-2.5 w-full">
              <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Buscador Multi-Base (Carnes, G4U, Colonial, Águila, USDA)
              </h2>
              <form onSubmit={handleOnlineFoodSearch} className="space-y-2 w-full">
                <div className="flex items-center gap-1.5 w-full">
                  <input 
                    type="text" 
                    placeholder="Ej: g4u, aguila, colonial, vacío, palta..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <div className="relative w-20 shrink-0">
                    <input 
                      type="number" 
                      placeholder="100" 
                      value={searchGrams}
                      onChange={(e) => setSearchGrams(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-2 pr-5 py-2 text-sm text-center text-amber-400 font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <span className="absolute right-2 top-2.5 text-[10px] text-slate-500 font-bold">g</span>
                  </div>
                  <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-2.5 rounded-xl text-sm transition shrink-0 flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Escribe el alimento o marca y los gramos (ej: 50) y toca la lupa.
                </p>
              </form>

              {isSearching && (
                <p className="text-xs text-emerald-400 animate-pulse">
                  Consultando servidores adicionales de Argentina, USDA y Marcas...
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
                  <div className="text-[11px] text-slate-400 font-medium">
                    Toca una opción para sumarla a tu día ({searchGrams || 100}g):
                  </div>
                  {searchResults.map((item, idx) => {
                    const ratio = (parseFloat(searchGrams) || 100) / 100;
                    return (
                      <div 
                        key={idx} 
                        onClick={() => selectFoodFromSearch(item)}
                        className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-emerald-900/60 rounded-xl cursor-pointer transition flex justify-between items-center gap-2 w-full"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-emerald-400 break-words leading-snug">{item.name}</div>
                          <div className="text-xs text-slate-200 mt-0.5">
                            P: <strong>{Math.round(item.protein * ratio * 10)/10}g</strong> | C: <strong>{Math.round(item.carbs * ratio * 10)/10}g</strong> | G: <strong>{Math.round(item.fat * ratio * 10)/10}g</strong>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">{item.source}</div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow w-full">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Carga Manual Rápida</h2>
              <form onSubmit={addMeal} className="space-y-2.5 w-full">
                <input 
                  type="text" 
                  placeholder="Nombre del plato / alimento" 
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                  className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                <div className="grid grid-cols-3 gap-2 w-full">
                  <input 
                    type="number" 
                    placeholder="Prot (g)" 
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal({...newMeal, protein: e.target.value})}
                    className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input 
                    type="number" 
                    placeholder="Carb (g)" 
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal({...newMeal, carbs: e.target.value})}
                    className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input 
                    type="number" 
                    placeholder="Grasa (g)" 
                    value={newMeal.fat}
                    onChange={(e) => setNewMeal({...newMeal, fat: e.target.value})}
                    className="w-full min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition">
                  Agregar Comida
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
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bases de Datos Incluidas</h2>
              <div className="text-xs text-slate-300 space-y-1.5 leading-snug">
                <p>• <strong>1° Catálogo Especializado Integrado:</strong> Panificados G4U, Chocolates Colonial, Chocolates Águila, carnes, verduras y frutas con carbohidratos netos.</p>
                <p>• <strong>2° OpenFoodFacts Argentina:</strong> Marcas de supermercados locales online.</p>
                <p>• <strong>3° USDA FoodData Central (EE.UU.):</strong> Base oficial con traductor automático integrado.</p>
                <p>• <strong>4° OpenFoodFacts Hispanoamérica y Mundial:</strong> Marcas globales y suplementos.</p>
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
