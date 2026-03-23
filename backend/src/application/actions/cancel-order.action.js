import { pool } from '../database/db.js';

export async function cancelOrderAction(orderId, items) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (const item of items) {
      await restoreProductStock(connection, item.productId, item.quantity);
    }

    await updateOrderStatusTocanceled(connection, orderId);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function restoreProductStock(connection, productId, quantity) {
  const query = `
    UPDATE products
    SET stock = stock + ?
    WHERE id = ?
  `;

  await connection.execute(query, [quantity, productId]);
}

async function updateOrderStatusTocanceled(connection, orderId) {
  const query = `
    UPDATE orders
    SET
      status = 'canceled',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  await connection.execute(query, [orderId]);
}