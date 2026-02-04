-- Cabo Kenedy - D1 Database Schema

-- Menu categories
CREATE TABLE IF NOT EXISTS categories (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  icon       TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible    INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT DEFAULT '',
  price_usd   REAL NOT NULL,
  popular     INTEGER NOT NULL DEFAULT 0,
  badge       TEXT DEFAULT '',
  visible     INTEGER NOT NULL DEFAULT 1,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Item variants (hamburgers, parrillas, etc.)
CREATE TABLE IF NOT EXISTS item_variants (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  menu_item_id INTEGER NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  label        TEXT NOT NULL,
  price_usd    REAL NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0
);

-- Regular promos (6 current promos)
CREATE TABLE IF NOT EXISTS promos (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  price_usd   REAL NOT NULL,
  icon        TEXT DEFAULT '',
  badge       TEXT DEFAULT '',
  image       TEXT DEFAULT '',
  visible     INTEGER NOT NULL DEFAULT 1,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Flash promo (singleton - Estrella Fugaz)
CREATE TABLE IF NOT EXISTS flash_promo (
  id           INTEGER PRIMARY KEY CHECK (id = 1),
  name         TEXT NOT NULL,
  original_name TEXT DEFAULT '',
  description  TEXT NOT NULL,
  price_usd    REAL NOT NULL,
  availability TEXT NOT NULL DEFAULT 'Lunes a Jueves',
  channels     TEXT NOT NULL DEFAULT 'Pick up y Delivery',
  icon         TEXT DEFAULT '',
  image        TEXT DEFAULT '/promos/flash.webp',
  active       INTEGER NOT NULL DEFAULT 1,
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Featured combos (3 top picks)
CREATE TABLE IF NOT EXISTS combos (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  pieces      TEXT DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  price_usd   REAL NOT NULL,
  badge       TEXT DEFAULT '',
  icon        TEXT DEFAULT '',
  visible     INTEGER NOT NULL DEFAULT 1,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Site configuration (key-value)
CREATE TABLE IF NOT EXISTS site_config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Admin sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id         TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

-- Login attempts (brute force protection)
CREATE TABLE IF NOT EXISTS login_attempts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  ip           TEXT NOT NULL,
  attempted_at TEXT NOT NULL DEFAULT (datetime('now')),
  success      INTEGER NOT NULL DEFAULT 0
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_item_variants_item ON item_variants(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip, attempted_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
