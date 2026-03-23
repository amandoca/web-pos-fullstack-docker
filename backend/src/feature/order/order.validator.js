const ALLOWED_SIZES = ['small', 'medium', 'large'];

export function validateCreateOrderPayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return ['O corpo da requisição deve ser um objeto válido.'];
  }

  if (!Number.isInteger(payload.paymentMethodId) || payload.paymentMethodId <= 0) {
    errors.push('paymentMethodId é obrigatório e deve ser um número inteiro positivo.');
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    errors.push('items é obrigatório e deve conter ao menos 1 item.');
    return errors;
  }

  payload.items.forEach(function validateItem(item, index) {
    const itemPath = `items[${index}]`;

    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      errors.push(`${itemPath} deve ser um objeto válido.`);
      return;
    }

    if (!Number.isInteger(item.productId) || item.productId <= 0) {
      errors.push(`${itemPath}.productId é obrigatório e deve ser um número inteiro positivo.`);
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      errors.push(`${itemPath}.quantity é obrigatório e deve ser um número inteiro positivo.`);
    }

    if (!('selectedSize' in item)) {
      errors.push(`${itemPath}.selectedSize deve ser enviado, mesmo quando for null.`);
    } else if (item.selectedSize !== null && typeof item.selectedSize !== 'string') {
      errors.push(`${itemPath}.selectedSize deve ser string ou null.`);
    } else if (
      typeof item.selectedSize === 'string' &&
      !ALLOWED_SIZES.includes(item.selectedSize)
    ) {
      errors.push(
        `${itemPath}.selectedSize deve ser um dos valores: ${ALLOWED_SIZES.join(', ')}.`
      );
    }

    if (!Array.isArray(item.selectedAddonIds)) {
      errors.push(`${itemPath}.selectedAddonIds deve ser um array.`);
      return;
    }

    const uniqueAddonIds = new Set();

    item.selectedAddonIds.forEach(function validateAddonId(addonId, addonIndex) {
      if (!Number.isInteger(addonId) || addonId <= 0) {
        errors.push(
          `${itemPath}.selectedAddonIds[${addonIndex}] deve ser um número inteiro positivo.`
        );
        return;
      }

      if (uniqueAddonIds.has(addonId)) {
        errors.push(`${itemPath}.selectedAddonIds possui ids repetidos.`);
        return;
      }

      uniqueAddonIds.add(addonId);
    });
  });

  return errors;
}