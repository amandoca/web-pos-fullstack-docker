import { pool } from '../database/db.js';

export async function getOrderByIdAction(orderId) {
  const query = `
    SELECT
      id,
      user_id,
      payment_method_id,
      status,
      subtotal,
      fee,
      total,
      created_at,
      updated_at
    FROM orders
    WHERE id = ?
    LIMIT 1
  `;

  const [rows] = await pool.execute(query, [orderId]);

  if (!rows[0]) {
    return null;
  }

  return {
    id: rows[0].id,
    userId: rows[0].user_id,
    paymentMethodId: rows[0].payment_method_id,
    status: rows[0].status,
    subtotal: Number(rows[0].subtotal),
    fee: Number(rows[0].fee),
    total: Number(rows[0].total),
    createdAt: rows[0].created_at,
    updatedAt: rows[0].updated_at,
  };
}