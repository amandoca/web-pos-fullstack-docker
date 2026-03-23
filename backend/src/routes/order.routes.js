import { Router } from 'express';
import { cancelOrderController } from '../screen/order/cancel-order.controller.js';
import { createOrderController } from '../screen/order/create-order.controller.js';

const router = Router();

router.post('/orders', createOrderController);
router.patch('/orders/:id/cancel', cancelOrderController);

export { router as orderRoutes };