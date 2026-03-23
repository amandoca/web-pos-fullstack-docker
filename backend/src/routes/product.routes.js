import { Router } from 'express';
import { getProductOptionsController } from '../screen/product/get-product-options.controller.js';
import { getProductsController } from '../screen/product/get-products.controller.js';

const router = Router();

router.get('/products', getProductsController);
router.get('/products/:id/options', getProductOptionsController);

export { router as productRoutes };