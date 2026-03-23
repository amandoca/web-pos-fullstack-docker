import { createOrderAction } from "../../application/actions/create-order.action.js";
import { getAllowedAddonsByIdsAction } from "../../application/actions/get-allowed-addons-by-ids.action.js";
import { getPaymentMethodByIdAction } from "../../application/actions/get-payment-method-by-id.action.js";
import { getProductByIdAction } from "../../application/actions/get-product-by-id.action.js";
import { getProductSizeByNameAction } from "../../application/actions/get-product-size-by-name.action.js";
import { validateCreateOrderPayload } from "./order.validator.js";

const ORDER_FEE_RATE = 0.06;
const DEFAULT_USER_ID = 2;

export async function createOrderService(payload) {
  const validationErrors = validateCreateOrderPayload(payload);

  if (validationErrors.length > 0) {
    const error = new Error("Payload inválido.");
    error.statusCode = 400;
    error.details = validationErrors;
    throw error;
  }

  const paymentMethod = await getPaymentMethodByIdAction(
    payload.paymentMethodId,
  );

  if (!paymentMethod) {
    const error = new Error("Forma de pagamento não encontrada.");
    error.statusCode = 404;
    throw error;
  }

  const normalizedItems = [];

  for (const item of payload.items) {
    const normalizedItem = await buildNormalizedItem(item);
    normalizedItems.push(normalizedItem);
  }

  const subtotal = calculateSubtotal(normalizedItems);
  const fee = roundCurrency(subtotal * ORDER_FEE_RATE);
  const total = roundCurrency(subtotal + fee);

  const createdOrder = await createOrderAction({
    userId: DEFAULT_USER_ID,
    paymentMethodId: payload.paymentMethodId,
    subtotal,
    fee,
    total,
    items: normalizedItems,
  });

  return createdOrder;
}

async function buildNormalizedItem(item) {
  const product = await getProductByIdAction(item.productId);

  if (!product) {
    const error = new Error(`Produto ${item.productId} não encontrado.`);
    error.statusCode = 404;
    throw error;
  }

  if (!product.isAvailable) {
    const error = new Error(`Produto "${product.title}" está indisponível.`);
    error.statusCode = 409;
    throw error;
  }

  if (product.stock < item.quantity) {
    const error = new Error(
      `Estoque insuficiente para o produto "${product.title}".`,
    );
    error.statusCode = 409;
    throw error;
  }

  const resolvedSize = await resolveItemSize(product, item.selectedSize);
  const resolvedAddons = await resolveItemAddons(
    product.id,
    item.selectedAddonIds,
  );

  const unitPrice = calculateUnitPrice(
    product.basePrice,
    resolvedSize,
    resolvedAddons,
  );
  const totalPrice = roundCurrency(unitPrice * item.quantity);

  return {
    productId: product.id,
    productTitle: product.title,
    selectedSize: resolvedSize ? resolvedSize.name : null,
    unitPrice,
    quantity: item.quantity,
    totalPrice,
    addons: resolvedAddons,
  };
}

async function resolveItemSize(product, selectedSize) {
  if (!product.hasSizes) {
    if (selectedSize !== null) {
      const error = new Error(`Produto "${product.title}" não aceita tamanho.`);
      error.statusCode = 409;
      throw error;
    }

    return null;
  }

  if (selectedSize === null) {
    const error = new Error(
      `Produto "${product.title}" exige seleção de tamanho.`,
    );
    error.statusCode = 400;
    throw error;
  }

  const size = await getProductSizeByNameAction(product.id, selectedSize);

  if (!size) {
    const error = new Error(
      `Tamanho "${selectedSize}" não é válido para o produto "${product.title}".`,
    );
    error.statusCode = 409;
    throw error;
  }

  return size;
}

async function resolveItemAddons(productId, selectedAddonIds) {
  if (selectedAddonIds.length === 0) {
    return [];
  }

  const addons = await getAllowedAddonsByIdsAction(productId, selectedAddonIds);

  if (addons.length !== selectedAddonIds.length) {
    const error = new Error(
      "Um ou mais adicionais não são permitidos para este produto.",
    );
    error.statusCode = 409;
    throw error;
  }

  return selectedAddonIds.map(function mapAddonId(selectedAddonId) {
    return addons.find(function findAddon(addon) {
      return addon.id === selectedAddonId;
    });
  });
}

function calculateUnitPrice(basePrice, resolvedSize, resolvedAddons) {
  const sizeExtraPrice = resolvedSize ? resolvedSize.extraPrice : 0;

  const addonsTotal = resolvedAddons.reduce(function sumAddons(total, addon) {
    return total + addon.price;
  }, 0);

  return roundCurrency(basePrice + sizeExtraPrice + addonsTotal);
}

function calculateSubtotal(items) {
  const subtotal = items.reduce(function sumItems(total, item) {
    return total + item.totalPrice;
  }, 0);

  return roundCurrency(subtotal);
}

function roundCurrency(value) {
  return Number(value.toFixed(2));
}
