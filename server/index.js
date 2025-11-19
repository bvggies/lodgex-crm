
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Neon Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon/AWS RDS
  }
});

// --- Helper to convert DB snake_case to camelCase for frontend ---
const toCamel = (o) => {
  if (!o) return o;
  const newO = {};
  for (const key in o) {
    const newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    newO[newKey] = o[key];
  }
  return newO;
};

// --- Helper to convert frontend camelCase to DB snake_case ---
const toSnake = (o) => {
  const newO = {};
  for (const key in o) {
    const newKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    newO[newKey] = o[key];
  }
  return newO;
};

// --- Routes ---

// Properties
app.get('/api/properties', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM properties ORDER BY created_at DESC');
    res.json(result.rows.map(toCamel));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/properties', async (req, res) => {
  const { id, name, code, address, status, unitType, ownerId, pricePerNight, amenities, description, imageUrl } = req.body;
  try {
    await pool.query(
      `INSERT INTO properties (id, name, code, address, status, unit_type, owner_id, price_per_night, amenities, description, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [id, name, code, address, status, unitType, ownerId, pricePerNight, JSON.stringify(amenities), description, imageUrl]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings ORDER BY check_in DESC');
    res.json(result.rows.map(toCamel));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/bookings', async (req, res) => {
  const b = req.body;
  try {
    await pool.query(
      `INSERT INTO bookings (id, reference, guest_id, guest_name, property_id, property_name, check_in, check_out, status, payment_status, total_amount, channel)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [b.id, b.reference, b.guestId, b.guestName, b.propertyId, b.propertyName, b.checkIn, b.checkOut, b.status, b.paymentStatus, b.totalAmount, b.channel]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;
  try {
    await pool.query(
      'UPDATE bookings SET status = $1, payment_status = $2 WHERE id = $3',
      [status, paymentStatus, id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Guests
app.get('/api/guests', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM guests ORDER BY name ASC');
    res.json(result.rows.map(toCamel));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/guests', async (req, res) => {
  const g = req.body;
  try {
    await pool.query(
      `INSERT INTO guests (id, name, email, phone, total_stays, total_spent, last_stay, rating)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [g.id, g.name, g.email, g.phone, g.totalStays, g.totalSpent, g.lastStay, g.rating]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY due_date ASC');
    res.json(result.rows.map(toCamel));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/tasks', async (req, res) => {
  const t = req.body;
  try {
    // Check if table has approval_status column, if not default to 'Approved' via logic or schema default
    const approvalStatus = t.approvalStatus || 'Approved';
    await pool.query(
      `INSERT INTO tasks (id, title, description, type, priority, status, property_id, due_date, assignee_id, approval_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [t.id, t.title, t.description, t.type, t.priority, t.status, t.propertyId, t.dueDate, t.assignee, approvalStatus]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const t = req.body;
  try {
    await pool.query(
      'UPDATE tasks SET status = $1, assignee_id = $2, approval_status = $3 WHERE id = $4',
      [t.status, t.assignee, t.approvalStatus, id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Finance
app.get('/api/finance', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM finance ORDER BY date DESC');
    res.json(result.rows.map(toCamel));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/finance', async (req, res) => {
  const f = req.body;
  try {
    await pool.query(
      `INSERT INTO finance (id, date, description, amount, type, category, reference_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [f.id, f.date, f.description, f.amount, f.type, f.category, f.referenceId]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Staff/Users
app.get('/api/staff', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE role != 'Owner' ORDER BY name ASC");
    res.json(result.rows.map(toCamel));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Owners
app.get('/api/owners', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE role = 'Owner' ORDER BY name ASC");
    res.json(result.rows.map(toCamel));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Logs
app.post('/api/audit', async (req, res) => {
  const l = req.body;
  try {
    await pool.query(
      `INSERT INTO audit_logs (id, user_name, action, entity, details) VALUES ($1, $2, $3, $4, $5)`,
      [l.id, l.user, l.action, l.entity, l.details]
    );
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).send(); }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
