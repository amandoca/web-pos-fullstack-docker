import type { CreateProductSubmission } from "../../../domain/product/product.types";
import { useCatalogAddons } from "../../../features/catalog/hooks/useCatalogAddons";
import { useCatalogCategories } from "../../../features/catalog/hooks/useCatalogCategories";
import { getCategoryLabel } from "../../../shared/formatters/category-label";
import { getAddonLabel } from "../../../shared/formatters/product-option-label";

import { useProductCreateForm } from "./product-create-form.hooks";

interface ProductCreateFormProps {
  isSubmitting: boolean;
  onSubmit: (input: CreateProductSubmission) => Promise<void>;
}

// Exibe o formulario de cadastro de produto no painel do admin.
export function ProductCreateForm({
  isSubmitting,
  onSubmit,
}: ProductCreateFormProps) {
  const { addons } = useCatalogAddons();
  const { categories, isLoading } = useCatalogCategories();
  const {
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
  } = useProductCreateForm({ onSubmit });

  return (
    <section className="admin-create-product-card">
      <form className="admin-create-product-form" onSubmit={handleSubmit}>
        <label className="admin-form-field admin-form-field-wide">
          <span>Nome do produto</span>
          <input
            type="text"
            name="title"
            value={formValues.title}
            onChange={handleChangeTextField}
            placeholder="Ex: Hambúrguer Artesanal"
          />
        </label>

        <label className="admin-form-field admin-form-field-wide">
          <span>Descrição</span>
          <textarea
            name="description"
            value={formValues.description}
            onChange={handleChangeDescription}
            placeholder="Descreva os ingredientes ou detalhes do item"
            rows={4}
          />
        </label>

        <div className="admin-create-product-compact-fields">
          <label className="admin-form-field">
            <span>Categoria</span>
            <select
              name="categoryId"
              value={formValues.categoryId}
              disabled={isLoading}
              onChange={handleSelectCategory}
            >
              <option value="">Selecione</option>
              {categories.map(function renderCategoryOption(category) {
                return (
                  <option key={category.id} value={String(category.id)}>
                    {getCategoryLabel(category.name)}
                  </option>
                );
              })}
            </select>
          </label>

          <label className="admin-form-field">
            <span>Preço base</span>
            <input
              type="number"
              min="0"
              step="0.01"
              name="basePrice"
              value={formValues.basePrice}
              onChange={handleChangeTextField}
              placeholder="0,00"
            />
          </label>

          <label className="admin-form-field">
            <span>Estoque</span>
            <input
              type="number"
              min="0"
              step="1"
              name="stock"
              value={formValues.stock}
              onChange={handleChangeTextField}
              placeholder="0"
            />
          </label>

          <label className="admin-form-field">
            <span>Código de barras</span>
            <input
              type="text"
              name="barcode"
              value={formValues.barcode}
              onChange={handleChangeTextField}
              placeholder="Ex: 2000000000015"
            />
          </label>
        </div>

        <div className="admin-create-product-support-grid">
          <label className="admin-form-field admin-form-field-panel">
            <span>Imagem do produto</span>
            <input
              key={imageInputKey}
              type="file"
              accept="image/*"
              onChange={handleChangeImageFile}
            />
            <small className="admin-form-help">
              {imageFile && `Arquivo selecionado: ${imageFile.name}`}
            </small>
          </label>

          <div className="admin-create-product-toggle-list">
            <label className="admin-form-checkbox">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formValues.isAvailable}
                onChange={handleToggleBooleanField}
              />
              <span>Produto disponível para venda</span>
            </label>

            <label className="admin-form-checkbox">
              <input
                type="checkbox"
                name="hasSizes"
                checked={formValues.hasSizes}
                onChange={handleToggleBooleanField}
              />
              <span>Produto possui variação de tamanho</span>
            </label>
          </div>
        </div>

        <div className="admin-form-addon-group admin-form-addon-group-wide">
          <div className="admin-form-addon-heading">
            <span>Adicionais permitidos</span>
          </div>

          <div className="admin-form-addon-list">
            {addons.map(function renderAddonOption(addon) {
              const isSelected = formValues.addonIds.includes(addon.id);

              return (
                <label
                  key={addon.id}
                  className={`admin-addon-option${isSelected ? " is-selected" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={function toggleAddonSelection() {
                      handleToggleAddon(addon.id);
                    }}
                  />
                  <span>{getAddonLabel(addon.name)}</span>
                </label>
              );
            })}
          </div>
        </div>

        {errorMessage ? (
          <p className="admin-form-error" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div className="admin-create-product-actions">
          <button
            className="admin-action-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Cadastrar produto"}
          </button>
        </div>
      </form>
    </section>
  );
}
