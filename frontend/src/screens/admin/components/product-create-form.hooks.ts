import { useState, type ChangeEvent, type FormEvent } from "react";

import type {
  CreateProductInput,
  CreateProductSubmission,
} from "../../../domain/product/product.types";

export interface ProductCreateFormValues {
  addonIds: number[];
  barcode: string;
  basePrice: string;
  categoryId: string;
  description: string;
  hasSizes: boolean;
  isAvailable: boolean;
  stock: string;
  title: string;
}

interface UseProductCreateFormParams {
  onSubmit: (input: CreateProductSubmission) => Promise<void>;
}

const initialFormValues: ProductCreateFormValues = {
  addonIds: [],
  barcode: "",
  basePrice: "",
  categoryId: "",
  description: "",
  hasSizes: false,
  isAvailable: true,
  stock: "",
  title: "",
};

function buildCreateProductInput(
  formValues: ProductCreateFormValues,
): CreateProductInput {
  const title = formValues.title.trim();
  const description = formValues.description.trim();
  const categoryId = Number(formValues.categoryId);
  const basePrice = Number(formValues.basePrice);
  const stock = Number(formValues.stock);

  if (!title) {
    throw new Error("Informe o nome do produto.");
  }

  if (!description) {
    throw new Error("Informe a descrição do produto.");
  }

  if (!Number.isInteger(categoryId) || categoryId < 1) {
    throw new Error("Selecione uma categoria válida.");
  }

  if (!Number.isFinite(basePrice) || basePrice <= 0) {
    throw new Error("Informe um preço válido.");
  }

  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error("Informe um estoque válido.");
  }

  return {
    addonIds: formValues.addonIds,
    barcode: formValues.barcode.trim(),
    basePrice,
    categoryId,
    description,
    hasSizes: formValues.hasSizes,
    imageUrl: "",
    isAvailable: formValues.isAvailable,
    stock,
    title,
  };
}

// Controla o formulario de cadastro de produto do admin.
export function useProductCreateForm({ onSubmit }: UseProductCreateFormParams) {
  const [formValues, setFormValues] =
    useState<ProductCreateFormValues>(initialFormValues);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageInputKey, setImageInputKey] = useState(0);

  function handleChangeTextField(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormValues(function updateFormValues(currentValues) {
      return {
        ...currentValues,
        [name]: value,
      };
    });
  }

  function handleChangeDescription(event: ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = event.target;

    setFormValues(function updateFormValues(currentValues) {
      return {
        ...currentValues,
        [name]: value,
      };
    });
  }

  function handleToggleBooleanField(event: ChangeEvent<HTMLInputElement>) {
    const { checked, name } = event.target;

    setFormValues(function updateFormValues(currentValues) {
      return {
        ...currentValues,
        [name]: checked,
      };
    });
  }

  function handleSelectCategory(event: ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target;

    setFormValues(function updateFormValues(currentValues) {
      return {
        ...currentValues,
        categoryId: value,
      };
    });
  }

  function handleChangeImageFile(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;

    setImageFile(nextFile);
  }

  function handleToggleAddon(addonId: number) {
    setFormValues(function updateSelectedAddons(currentValues) {
      const hasAddonSelected = currentValues.addonIds.includes(addonId);

      return {
        ...currentValues,
        addonIds: hasAddonSelected
          ? currentValues.addonIds.filter(function removeSelectedAddon(
              selectedAddonId,
            ) {
              return selectedAddonId !== addonId;
            })
          : [...currentValues.addonIds, addonId].sort(function sortAddonIds(
              leftAddonId,
              rightAddonId,
            ) {
              return leftAddonId - rightAddonId;
            }),
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const input = buildCreateProductInput(formValues);

      setErrorMessage(null);
      await onSubmit({
        imageFile,
        product: input,
      });
      setFormValues(initialFormValues);
      setImageFile(null);
      setImageInputKey(function incrementKey(currentKey) {
        return currentKey + 1;
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar o produto.";

      setErrorMessage(message);
    }
  }

  return {
    errorMessage,
    formValues,
    handleChangeDescription,
    handleChangeImageFile,
    handleChangeTextField,
    handleSelectCategory,
    handleSubmit,
    handleToggleAddon,
    handleToggleBooleanField,
    imageFile,
    imageInputKey,
  };
}
