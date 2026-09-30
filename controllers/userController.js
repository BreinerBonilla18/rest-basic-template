import { query as dbQuery } from '../db/db.js';

// 1. Obtener lista de usuarios (con paginación, búsqueda y filtros)
const getUsers = async (req, res) => {
  try {
    const { search, role, is_active, page = 1, limit = 5 } = req.query;
    
    let query = 'SELECT * FROM users WHERE 1=1';
    const queryParams = [];
    let paramIndex = 1;

    // Filtro por username (búsqueda parcial insensible a mayúsculas)
    if (search) {
      query += ` AND username ILIKE $${paramIndex}`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Filtro por rol
    if (role && role !== 'all') {
      query += ` AND role = $${paramIndex}`;
      queryParams.push(role);
      paramIndex++;
    }

    // Filtro por estado activo/inactivo
    if (is_active !== undefined && is_active !== 'all') {
      query += ` AND is_active = $${paramIndex}`;
      queryParams.push(is_active === 'true');
      paramIndex++;
    }

    // Obtener el total de registros para la paginación
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const totalResult = await dbQuery(countQuery, queryParams);
    const totalItems = parseInt(totalResult.rows[0].count, 10);

    // Paginación (LIMIT y OFFSET)
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` ORDER BY id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), offset);

    const result = await dbQuery(query, queryParams);

    res.json({
      data: result.rows,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: parseInt(page),
        perPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 2. Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { username, email, full_name, age, role, is_active } = req.body;
    
    const query = `
      INSERT INTO users (username, email, full_name, age, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [username, email, full_name, age, role || 'user', is_active ?? true];
    
    const result = await dbQuery(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El username o email ya existe.' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 3. Actualizar un usuario existente
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, full_name, age, role, is_active } = req.body;

    const query = `
      UPDATE users 
      SET username = $1, email = $2, full_name = $3, age = $4, role = $5, is_active = $6
      WHERE id = $7
      RETURNING *;
    `;
    const values = [username, email, full_name, age, role, is_active, id];

    const result = await dbQuery(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 4. Eliminar un usuario
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbQuery('DELETE FROM users WHERE id = $1 RETURNING *;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado exitosamente', user: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};