// D1 Database access layer for Cabo Kenedy

export interface DbMenuItem {
  id: number;
  category_id: string;
  name: string;
  description: string;
  price_usd: number;
  popular: number;
  badge: string;
  visible: number;
  sort_order: number;
}

export interface DbItemVariant {
  id: number;
  menu_item_id: number;
  label: string;
  price_usd: number;
  sort_order: number;
}

export interface DbCategory {
  id: string;
  title: string;
  icon: string;
  sort_order: number;
  visible: number;
}

export interface DbPromo {
  id: string;
  name: string;
  description: string;
  price_usd: number;
  icon: string;
  badge: string;
  image: string;
  visible: number;
  sort_order: number;
}

export interface DbFlashPromo {
  id: number;
  name: string;
  original_name: string;
  description: string;
  price_usd: number;
  availability: string;
  channels: string;
  icon: string;
  image: string;
  active: number;
}

export interface DbCombo {
  id: string;
  name: string;
  pieces: string;
  description: string;
  price_usd: number;
  badge: string;
  icon: string;
  visible: number;
  sort_order: number;
}

export interface DbSiteConfig {
  key: string;
  value: string;
}

// Convert D1 data to the format expected by the public pages
export interface PublicMenuItem {
  name: string;
  description?: string;
  priceUSD: number;
  variants?: { label: string; priceUSD: number }[];
  popular?: boolean;
  badge?: string;
}

export interface PublicCategory {
  id: string;
  title: string;
  icon: string;
  items: PublicMenuItem[];
}

// ==================== READ FUNCTIONS ====================

export async function getCategories(db: D1Database): Promise<DbCategory[]> {
  const { results } = await db.prepare(
    'SELECT * FROM categories WHERE visible = 1 ORDER BY sort_order ASC'
  ).all<DbCategory>();
  return results;
}

export async function getAllCategories(db: D1Database): Promise<DbCategory[]> {
  const { results } = await db.prepare(
    'SELECT * FROM categories ORDER BY sort_order ASC'
  ).all<DbCategory>();
  return results;
}

export async function getMenuItems(db: D1Database, categoryId: string): Promise<DbMenuItem[]> {
  const { results } = await db.prepare(
    'SELECT * FROM menu_items WHERE category_id = ? AND visible = 1 ORDER BY sort_order ASC'
  ).bind(categoryId).all<DbMenuItem>();
  return results;
}

export async function getAllMenuItems(db: D1Database, categoryId: string): Promise<DbMenuItem[]> {
  const { results } = await db.prepare(
    'SELECT * FROM menu_items WHERE category_id = ? ORDER BY sort_order ASC'
  ).bind(categoryId).all<DbMenuItem>();
  return results;
}

export async function getItemVariants(db: D1Database, itemId: number): Promise<DbItemVariant[]> {
  const { results } = await db.prepare(
    'SELECT * FROM item_variants WHERE menu_item_id = ? ORDER BY sort_order ASC'
  ).bind(itemId).all<DbItemVariant>();
  return results;
}

export async function getPromos(db: D1Database): Promise<DbPromo[]> {
  const { results } = await db.prepare(
    'SELECT * FROM promos WHERE visible = 1 ORDER BY sort_order ASC'
  ).all<DbPromo>();
  return results;
}

export async function getAllPromos(db: D1Database): Promise<DbPromo[]> {
  const { results } = await db.prepare(
    'SELECT * FROM promos ORDER BY sort_order ASC'
  ).all<DbPromo>();
  return results;
}

export async function getFlashPromo(db: D1Database): Promise<DbFlashPromo | null> {
  return db.prepare('SELECT * FROM flash_promo WHERE id = 1').first<DbFlashPromo>();
}

export async function getCombos(db: D1Database): Promise<DbCombo[]> {
  const { results } = await db.prepare(
    'SELECT * FROM combos WHERE visible = 1 ORDER BY sort_order ASC'
  ).all<DbCombo>();
  return results;
}

export async function getAllCombos(db: D1Database): Promise<DbCombo[]> {
  const { results } = await db.prepare(
    'SELECT * FROM combos ORDER BY sort_order ASC'
  ).all<DbCombo>();
  return results;
}

export async function getSiteConfig(db: D1Database): Promise<Record<string, string>> {
  const { results } = await db.prepare('SELECT * FROM site_config').all<DbSiteConfig>();
  const config: Record<string, string> = {};
  for (const row of results) {
    config[row.key] = row.value;
  }
  return config;
}

export async function getConfigValue(db: D1Database, key: string): Promise<string | null> {
  const row = await db.prepare('SELECT value FROM site_config WHERE key = ?').bind(key).first<{ value: string }>();
  return row?.value ?? null;
}

// Build the full public menu (categories with items and variants)
export async function getPublicMenu(db: D1Database): Promise<PublicCategory[]> {
  const categories = await getCategories(db);
  const menu: PublicCategory[] = [];

  for (const cat of categories) {
    const items = await getMenuItems(db, cat.id);
    const publicItems: PublicMenuItem[] = [];

    for (const item of items) {
      const variants = await getItemVariants(db, item.id);
      const publicItem: PublicMenuItem = {
        name: item.name,
        priceUSD: item.price_usd,
      };
      if (item.description) publicItem.description = item.description;
      if (item.popular) publicItem.popular = true;
      if (item.badge) publicItem.badge = item.badge;
      if (variants.length > 0) {
        publicItem.variants = variants.map(v => ({
          label: v.label,
          priceUSD: v.price_usd,
        }));
      }
      publicItems.push(publicItem);
    }

    menu.push({
      id: cat.id,
      title: cat.title,
      icon: cat.icon,
      items: publicItems,
    });
  }

  return menu;
}

// ==================== WRITE FUNCTIONS (Admin) ====================

export async function updateMenuItem(db: D1Database, id: number, data: {
  name?: string;
  description?: string;
  price_usd?: number;
  popular?: number;
  badge?: string;
  visible?: number;
}): Promise<void> {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
  if (data.price_usd !== undefined) { fields.push('price_usd = ?'); values.push(data.price_usd); }
  if (data.popular !== undefined) { fields.push('popular = ?'); values.push(data.popular); }
  if (data.badge !== undefined) { fields.push('badge = ?'); values.push(data.badge); }
  if (data.visible !== undefined) { fields.push('visible = ?'); values.push(data.visible); }

  if (fields.length === 0) return;

  fields.push("updated_at = datetime('now')");
  values.push(id);

  await db.prepare(
    `UPDATE menu_items SET ${fields.join(', ')} WHERE id = ?`
  ).bind(...values).run();
}

export async function createMenuItem(db: D1Database, data: {
  category_id: string;
  name: string;
  description?: string;
  price_usd: number;
  popular?: number;
  badge?: string;
  sort_order?: number;
}): Promise<number> {
  const result = await db.prepare(
    `INSERT INTO menu_items (category_id, name, description, price_usd, popular, badge, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    data.category_id,
    data.name,
    data.description || '',
    data.price_usd,
    data.popular || 0,
    data.badge || '',
    data.sort_order || 0
  ).run();
  return result.meta.last_row_id as number;
}

export async function deleteMenuItem(db: D1Database, id: number): Promise<void> {
  await db.prepare('DELETE FROM menu_items WHERE id = ?').bind(id).run();
}

export async function updateCategory(db: D1Database, id: string, data: {
  title?: string;
  icon?: string;
  visible?: number;
  sort_order?: number;
}): Promise<void> {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
  if (data.icon !== undefined) { fields.push('icon = ?'); values.push(data.icon); }
  if (data.visible !== undefined) { fields.push('visible = ?'); values.push(data.visible); }
  if (data.sort_order !== undefined) { fields.push('sort_order = ?'); values.push(data.sort_order); }

  if (fields.length === 0) return;

  fields.push("updated_at = datetime('now')");
  values.push(id);

  await db.prepare(
    `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`
  ).bind(...values).run();
}

export async function updatePromo(db: D1Database, id: string, data: {
  name?: string;
  description?: string;
  price_usd?: number;
  icon?: string;
  badge?: string;
  image?: string;
  visible?: number;
  sort_order?: number;
}): Promise<void> {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
  if (data.price_usd !== undefined) { fields.push('price_usd = ?'); values.push(data.price_usd); }
  if (data.icon !== undefined) { fields.push('icon = ?'); values.push(data.icon); }
  if (data.badge !== undefined) { fields.push('badge = ?'); values.push(data.badge); }
  if (data.image !== undefined) { fields.push('image = ?'); values.push(data.image); }
  if (data.visible !== undefined) { fields.push('visible = ?'); values.push(data.visible); }
  if (data.sort_order !== undefined) { fields.push('sort_order = ?'); values.push(data.sort_order); }

  if (fields.length === 0) return;

  fields.push("updated_at = datetime('now')");
  values.push(id);

  await db.prepare(
    `UPDATE promos SET ${fields.join(', ')} WHERE id = ?`
  ).bind(...values).run();
}

export async function updateFlashPromo(db: D1Database, data: {
  name?: string;
  description?: string;
  price_usd?: number;
  availability?: string;
  channels?: string;
  icon?: string;
  image?: string;
  active?: number;
}): Promise<void> {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
  if (data.price_usd !== undefined) { fields.push('price_usd = ?'); values.push(data.price_usd); }
  if (data.availability !== undefined) { fields.push('availability = ?'); values.push(data.availability); }
  if (data.channels !== undefined) { fields.push('channels = ?'); values.push(data.channels); }
  if (data.icon !== undefined) { fields.push('icon = ?'); values.push(data.icon); }
  if (data.image !== undefined) { fields.push('image = ?'); values.push(data.image); }
  if (data.active !== undefined) { fields.push('active = ?'); values.push(data.active); }

  if (fields.length === 0) return;

  fields.push("updated_at = datetime('now')");
  values.push(1);

  await db.prepare(
    `UPDATE flash_promo SET ${fields.join(', ')} WHERE id = ?`
  ).bind(...values).run();
}

export async function updateCombo(db: D1Database, id: string, data: {
  name?: string;
  pieces?: string;
  description?: string;
  price_usd?: number;
  badge?: string;
  icon?: string;
  visible?: number;
  sort_order?: number;
}): Promise<void> {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.pieces !== undefined) { fields.push('pieces = ?'); values.push(data.pieces); }
  if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
  if (data.price_usd !== undefined) { fields.push('price_usd = ?'); values.push(data.price_usd); }
  if (data.badge !== undefined) { fields.push('badge = ?'); values.push(data.badge); }
  if (data.icon !== undefined) { fields.push('icon = ?'); values.push(data.icon); }
  if (data.visible !== undefined) { fields.push('visible = ?'); values.push(data.visible); }
  if (data.sort_order !== undefined) { fields.push('sort_order = ?'); values.push(data.sort_order); }

  if (fields.length === 0) return;

  fields.push("updated_at = datetime('now')");
  values.push(id);

  await db.prepare(
    `UPDATE combos SET ${fields.join(', ')} WHERE id = ?`
  ).bind(...values).run();
}

export async function setSiteConfig(db: D1Database, key: string, value: string): Promise<void> {
  await db.prepare(
    'INSERT INTO site_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?'
  ).bind(key, value, value).run();
}

export async function createItemVariant(db: D1Database, data: {
  menu_item_id: number;
  label: string;
  price_usd: number;
  sort_order?: number;
}): Promise<number> {
  const result = await db.prepare(
    'INSERT INTO item_variants (menu_item_id, label, price_usd, sort_order) VALUES (?, ?, ?, ?)'
  ).bind(data.menu_item_id, data.label, data.price_usd, data.sort_order || 0).run();
  return result.meta.last_row_id as number;
}

export async function updateItemVariant(db: D1Database, id: number, data: {
  label?: string;
  price_usd?: number;
  sort_order?: number;
}): Promise<void> {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.label !== undefined) { fields.push('label = ?'); values.push(data.label); }
  if (data.price_usd !== undefined) { fields.push('price_usd = ?'); values.push(data.price_usd); }
  if (data.sort_order !== undefined) { fields.push('sort_order = ?'); values.push(data.sort_order); }

  if (fields.length === 0) return;
  values.push(id);

  await db.prepare(
    `UPDATE item_variants SET ${fields.join(', ')} WHERE id = ?`
  ).bind(...values).run();
}

export async function deleteItemVariant(db: D1Database, id: number): Promise<void> {
  await db.prepare('DELETE FROM item_variants WHERE id = ?').bind(id).run();
}

// Get item count per category (for admin dashboard)
export async function getCategoryItemCounts(db: D1Database): Promise<Record<string, number>> {
  const { results } = await db.prepare(
    'SELECT category_id, COUNT(*) as count FROM menu_items GROUP BY category_id'
  ).all<{ category_id: string; count: number }>();
  const counts: Record<string, number> = {};
  for (const row of results) {
    counts[row.category_id] = row.count;
  }
  return counts;
}
