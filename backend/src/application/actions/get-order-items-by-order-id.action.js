import { pool } from '../database/db.js';

export async function getOrderItemsByOrderIdAction(orderId) {
  const query = `
    SELECT
      id,
      order_id,
      product_id,
      product_title,
      size_name,
      unit_price,
      quantity,
      total_price,
      created_at
    FROM order_items
    WHERE order_id = ?
    ORDER BY id ASC
  `;

  const [rows] = await pool.execute(query, [orderId]);

  return rows.map(function mapOrderItem(row) {
    return {
      id: row.id,
      orderId: row.order_id,
      productId: row.product_id,
      productTitle: row.product_title,
      sizeName: row.size_name,
      unitPrice: Number(row.unit_price),
      quantity: row.quantity,
      totalPrice: Number(row.total_price),
      createdAt: row.created_at,
    };
  });
}