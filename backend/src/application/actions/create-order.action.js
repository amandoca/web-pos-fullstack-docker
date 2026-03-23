import { pool } from '../database/db.js';

export async function createOrderAction(orderData) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const orderId = await insertOrder(connection, orderData);
    const createdItems = [];

    for (const item of orderData.items) {
      await decreaseProductStock(connection, item.productId, item.quantity);

      const orderItemId = await insertOrderItem(connection, orderId, item);
      const createdAddons = await insertOrderItemAddons(connection, orderItemId, item.addons);

      createdItems.push({
        id: orderItemId,
        productId: item.productId,
        productTitle: item.productTitle,
        selectedSize: item.selectedSize,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        addons: createdAddons,
      });
    }

    await connection.commit();

    return {
      id: orderId,
      status: 'completed',
      paymentMethodId: orderData.paymentMethodId,
      subtotal: orderData.subtotal,
      fee: orderData.fee,
      total: orderData.total,
      items: createdItems,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function insertOrder(connection, orderData) {
  const query = `
    INSERT INTO orders (
      user_id,
      payment_method_id,
      status,
      subtotal,
      fee,
      total
    ) VALUES (?, ?, 'completed', ?, ?, ?)
  `;

  const [result] = await connection.execute(query, [
    orderData.userId,
    orderData.paymentMethodId,
    orderData.subtotal,
    orderData.fee,
    orderData.total,
  ]);

  return result.insertId;
}

async function insertOrderItem(connection, orderId, item) {
  const query = `
    INSERT INTO order_items (
      order_id,
      product_id,
      product_title,
      size_name,
      unit_price,
      quantity,
      total_price
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await connection.execute(query, [
    orderId,
    item.productId,
    item.productTitle,
    item.selectedSize,
    item.unitPrice,
    item.quantity,
    item.totalPrice,
  ]);

  return result.insertId;
}

async function insertOrderItemAddons(connection, orderItemId, addons) {
  if (!addons.length) {
    return [];
  }

  const query = `
    INSERT INTO order_item_addons (
      order_item_id,
      addon_id,
      addon_name,
      addon_price
    ) VALUES (?, ?, ?, ?)
  `;

  const createdAddons = [];

  for (const addon of addons) {
    await connection.execute(query, [
      orderItemId,
      addon.id,
      addon.name,
      addon.price,
    ]);

    createdAddons.push({
      id: addon.id,
      name: addon.name,
      price: addon.price,
    });
  }

  return createdAddons;
}

async function decreaseProductStock(connection, productId, quantity) {
  const query = `
    UPDATE products
    SET stock = stock - ?
    WHERE id = ?
      AND stock >= ?
  `;

  const [result] = await connection.execute(query, [
    quantity,
    productId,
    quantity,
  ]);

  if (result.affectedRows === 0) {
    const error = new Error(`Estoque insuficiente para o produto ${productId}.`);
    error.statusCode = 409;
    throw error;
  }
}