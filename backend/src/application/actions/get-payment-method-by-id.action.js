import { pool } from "../database/db.js";

export async function getPaymentMethodByIdAction(paymentMethodId) {
  const query = `
    SELECT
      id,
      name
    FROM payment_methods
    WHERE id = ?
    LIMIT 1
  `;

  const [rows] = await pool.execute(query, [paymentMethodId]);

  return rows[0] || null;
}
