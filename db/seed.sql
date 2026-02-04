-- Cabo Kenedy - Seed Data (migrated from src/data/menu.ts)

-- Site configuration
INSERT INTO site_config (key, value) VALUES ('active_theme', 'default');
INSERT INTO site_config (key, value) VALUES ('tasa_bcv_fallback', '375.08');
INSERT INTO site_config (key, value) VALUES ('whatsapp_number', '584142920785');
INSERT INTO site_config (key, value) VALUES ('business_hours', '11:00 AM — 00:00');

-- Flash promo (Estrella Fugaz)
INSERT INTO flash_promo (id, name, original_name, description, price_usd, availability, channels, icon, image, active)
VALUES (1, 'Estrella Fugaz', 'Promo Flash', 'Pollo Asado + 7 Hallaquitas + Refresco 1.5 LTS', 12.99, 'Lunes a Jueves', 'Pick up y Delivery', '☄️', '/promos/flash.webp', 1);

-- Regular promos
INSERT INTO promos (id, name, description, price_usd, icon, badge, image, sort_order) VALUES
('resuelve', 'Resuelve de Pollo', 'Pollo Asado + 5 Hallaquitas + Ensalada + Refresco 1.5 LTS', 15, '🍗', 'Promo', '/promos/resuelve.webp', 1),
('asado', 'Combo Pollo Asado', 'Pollo Asado + Ens. Rallada o Mixta + Yuca Sancochada + Refresco 1.5 LTS', 16, '🔥', 'Asado', '/promos/asado.webp', 2),
('broaster', 'Combo Pollo Broaster', '8 piezas de pollo frito + Ensalada Rallada + 8 Arepitas + Refresco 1.5 LTS', 18, '🍗', 'Broaster', '/promos/broaster.webp', 3),
('familiar', 'Combo Familiar', '2 Pollos Asados + Contorno (ensalada/hallaquitas) + Contorno (papas/yuca/tostones) + Refresco 1.5 LTS', 25, '👨‍👩‍👧‍👦', 'Familiar', '/promos/familiar.webp', 4),
('hamburguesa-familiar', 'Promo Familiar Hamburguesa', '4 Hamburguesas de Carne + Ración de Papas Fritas + Refresco 1 LTS', 23, '🍔', 'Familiar', '/promos/hamburguesa-familiar.webp', 5),
('2hamburguesas', '2 Hamburguesas de Carne', '2 Hamburguesas de Carne + Refresco 1 LTS', 10, '🍔', 'Oferta', '/promos/2hamburguesas.webp', 6);

-- Featured combos
INSERT INTO combos (id, name, pieces, description, price_usd, badge, icon, sort_order) VALUES
('combo2', 'Combo 2', '2 piezas', '2 piezas de pollo + 3 arepitas + ensalada rallada pequeña + refresco de botella', 10, 'Popular', '🍗', 1),
('combo4', 'Combo 4', '4 piezas', '4 piezas de pollo + 6 arepitas + ensalada rallada + refresco 1.5 LTS', 14, 'Familiar', '🍗🍗', 2),
('combo6', 'Combo 6', '8 piezas', '8 piezas de pollo + 8 arepitas + ensalada rallada + refresco 1.5 LTS', 18, 'Para compartir', '🍗🍗🍗', 3);

-- Categories
INSERT INTO categories (id, title, icon, sort_order) VALUES
('combos', 'Combos de Pollo Broaster', '🍗', 1),
('pollo', 'Pollo Solo', '🍗', 2),
('hamburguesas', 'Hamburguesas', '🍔', 3),
('pasapalos', 'Milanesas y Pasapalos', '🍟', 4),
('raciones', 'Raciones y Contornos', '🍟', 5),
('ensaladas', 'Ensaladas', '🥗', 6),
('carnes', 'Carnes y Parrillas', '🥩', 7),
('mariscos', 'Pescados y Mariscos', '🐟', 8);

-- ==================== MENU ITEMS ====================

-- Combos de Pollo Broaster
INSERT INTO menu_items (category_id, name, description, price_usd, popular, sort_order) VALUES
('combos', 'Combo 1', '1 pieza de pollo + 2 arepitas + ensalada rallada pequeña + refresco de botella', 8, 0, 1),
('combos', 'Combo 2', '2 piezas de pollo + 3 arepitas + ensalada rallada pequeña + refresco de botella', 10, 1, 2),
('combos', 'Combo 3', '3 piezas de pollo + 4 arepitas + ensalada rallada pequeña + refresco de botella', 12, 0, 3),
('combos', 'Combo 4', '4 piezas de pollo + 6 arepitas + ensalada rallada + refresco 1.5 LTS', 14, 1, 4),
('combos', 'Combo 5', '5 piezas de pollo + 6 arepitas + ensalada rallada pequeña + refresco 1.5 LTS', 15, 0, 5),
('combos', 'Combo 6', '8 piezas de pollo + 8 arepitas + ensalada rallada + refresco 1.5 LTS', 18, 1, 6);

-- Pollo Solo
INSERT INTO menu_items (category_id, name, price_usd, sort_order) VALUES
('pollo', '1 pieza de pollo', 3, 1),
('pollo', '5 piezas de pollo', 10, 2),
('pollo', '6 piezas de pollo', 12, 3),
('pollo', '8 piezas de pollo', 14, 4),
('pollo', '10 piezas de pollo', 17, 5);

-- Hamburguesas (items with variants)
INSERT INTO menu_items (id, category_id, name, description, price_usd, sort_order) VALUES
(100, 'hamburguesas', 'Hamburguesa Triple Acción', 'Carne, pollo y chorizo', 10, 1),
(101, 'hamburguesas', 'Hamburguesa de Pollo', 'Crispy o Grill', 7, 2),
(102, 'hamburguesas', 'Hamburguesa de Carne', '', 6, 3);

INSERT INTO item_variants (menu_item_id, label, price_usd, sort_order) VALUES
(100, 'Sola', 10, 1),
(100, 'Combo (papas + ensalada)', 12, 2),
(101, 'Sola', 7, 1),
(101, 'Combo (papas + ensalada)', 10, 2),
(102, 'Sola', 6, 1),
(102, 'Combo (papas + ensalada)', 9, 2);

-- Milanesas y Pasapalos
INSERT INTO menu_items (category_id, name, description, price_usd, sort_order) VALUES
('pasapalos', 'Milanesa de pollo', 'Con papas fritas y ensalada', 11, 1),
('pasapalos', '1/2 Milanesa de pollo', 'Con papas fritas y ensalada', 8, 2),
('pasapalos', 'Pizza Margarita Individual', '', 6, 3),
('pasapalos', 'Tequeños (5 unidades)', '', 5, 4),
('pasapalos', 'Chicken Fingers / Nuggets', '', 8, 5),
('pasapalos', 'Alitas de Pollo', '', 8, 6),
('pasapalos', 'Sopa Cruzado de Res con Pollo', '', 9, 7);

-- Raciones y Contornos (some with variants)
INSERT INTO menu_items (category_id, name, description, price_usd, popular, sort_order) VALUES
('raciones', 'Papas Fritas', '333 grs.', 5, 1, 1),
('raciones', 'Yuca Sancochada', '1/2 kg', 5, 0, 2),
('raciones', 'Yuca Frita', '15 unidades', 5, 0, 3),
('raciones', 'Hallaquitas (por unidad)', '', 0.50, 0, 4),
('raciones', 'Ración de Chorizo', '5 unidades', 12, 0, 5),
('raciones', 'Ración de Morcilla', '5 unidades', 12, 0, 6),
('raciones', 'Chorizo o Morcilla', 'Por unidad', 3, 0, 7),
('raciones', 'Pan con Ajo', '', 4, 0, 8),
('raciones', 'Arepitas', '5 unidades', 3, 0, 9),
('raciones', 'Tostones', '', 5, 0, 10);

INSERT INTO menu_items (id, category_id, name, price_usd, sort_order) VALUES
(200, 'raciones', 'Tostones Playeros', 7, 11);

INSERT INTO item_variants (menu_item_id, label, price_usd, sort_order) VALUES
(200, 'Pequeño', 7, 1),
(200, 'Grande', 9, 2);

-- Ensaladas (some with variants)
INSERT INTO menu_items (id, category_id, name, price_usd, sort_order) VALUES
(300, 'ensaladas', 'Ensalada de repollo con zanahoria', 3, 1);

INSERT INTO item_variants (menu_item_id, label, price_usd, sort_order) VALUES
(300, 'Pequeña', 3, 1),
(300, 'Grande', 5, 2);

INSERT INTO menu_items (category_id, name, description, price_usd, sort_order) VALUES
('ensaladas', 'Ensalada tipo César', 'Tipo César (tocineta sustituida por chorizo)', 7, 2),
('ensaladas', 'Ensalada tipo César con pollo', 'Tipo César (tocineta sustituida por chorizo)', 13, 3),
('ensaladas', 'Ensalada tipo César con camarones', 'Tipo César (tocineta sustituida por chorizo)', 16, 4),
('ensaladas', 'Ensalada Mixta', '', 6, 5),
('ensaladas', 'Ensalada Mixta con palmito', '', 13, 6),
('ensaladas', 'Ensalada Mixta de aguacate', '', 9, 7),
('ensaladas', 'Ensalada Mixta aguacate y palmito', '', 16, 8),
('ensaladas', 'Ración de Aguacate', '', 7, 9),
('ensaladas', 'Ración de Palmito', '', 8, 10),
('ensaladas', 'Ración de Aguacate y palmito', '', 13, 11);

-- Carnes y Parrillas (some with variants)
INSERT INTO menu_items (category_id, name, description, price_usd, sort_order) VALUES
('carnes', 'Churrasco de Solomo', '850 grs. al grill o a la brasa con 2 contornos', 25, 1);

INSERT INTO menu_items (id, category_id, name, description, price_usd, sort_order) VALUES
(400, 'carnes', 'Bistec de Solomo', '400 grs. al grill o a la brasa con 2 contornos', 15, 2);

INSERT INTO item_variants (menu_item_id, label, price_usd, sort_order) VALUES
(400, 'Tradicional', 15, 1),
(400, 'A Caballo', 20, 2);

INSERT INTO menu_items (id, category_id, name, price_usd, sort_order) VALUES
(401, 'carnes', 'Parrilla Mar y Tierra', 35, 3);

INSERT INTO item_variants (menu_item_id, label, price_usd, sort_order) VALUES
(401, 'Pequeña (2 pers.)', 35, 1),
(401, 'Mediana (4 pers.)', 55, 2),
(401, 'Grande (5 pers.)', 75, 3);

INSERT INTO menu_items (id, category_id, name, price_usd, sort_order) VALUES
(402, 'carnes', 'Parrilla Especial', 20, 4);

INSERT INTO item_variants (menu_item_id, label, price_usd, sort_order) VALUES
(402, 'Pequeña (1 pers.)', 20, 1),
(402, 'Mediana (2 pers.)', 30, 2),
(402, 'Grande (3 pers.)', 40, 3);

INSERT INTO menu_items (category_id, name, description, price_usd, sort_order) VALUES
('carnes', 'Parrilla Especial con Pollo', 'Grande (4 personas)', 45, 5);

-- Pescados y Mariscos
INSERT INTO menu_items (category_id, name, description, price_usd, sort_order) VALUES
('mariscos', 'Rueda de Carite', 'Con 2 contornos a elegir', 15, 1),
('mariscos', 'Calamares Rebozados', 'Con vegetales mixtos y papas fritas', 22, 2),
('mariscos', 'Camarones Rebozados', 'Con vegetales mixtos y papas fritas', 20, 3),
('mariscos', 'Camarones al Ajillo', 'Bañado con mantequilla de ajo', 24, 4),
('mariscos', 'Grillada de Mariscos', 'Mezcla de calamares con camarones y carite, papas fritas y vegetales', 45, 5);
