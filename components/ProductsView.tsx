"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
// import "@500ux/components/styles/base.css"; This will be used in the production dont remove keep in all components

export const version = "1.0.0";

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  description?: string;
}

export interface ProductsViewProps {
  /** Products view title */
  title?: string;
  /** Products view subtitle */
  subtitle?: string;
  /** Array of products to display */
  products: Product[];
  /** Layout mode: grid or list */
  layout?: "grid" | "list";
  /** Number of items per row in grid layout */
  itemsPerRow?: number;
  /** Event dispatcher from 500ux runtime */
  dispatch?: (eventName: string, payload?: Record<string, unknown>) => void;
}

// Constants for responsive breakpoints
const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1280,
} as const;

// Utility function to validate products array
const validateProducts = (products: unknown): Product[] => {
  if (!Array.isArray(products)) {
    console.warn("ProductsView: products prop must be an array");
    return [];
  }
  return products;
};

// Utility function to get valid layout
const getValidLayout = (layout: ProductsViewProps["layout"]): "grid" | "list" => {
  return layout === "grid" || layout === "list" ? layout : "grid";
};

// Product card component
const ProductCard = ({
  product,
  layout,
  onProductSelect,
}: {
  product: Product;
  layout: "grid" | "list";
  onProductSelect: (product: Product) => void;
}) => {
  const baseClasses = "ux:group ux:cursor-pointer ux:transition-all ux:duration-300 ux:hover:scale-105 ux:gap-10";
  const cardClasses = layout === "grid" 
    ? `${baseClasses} ux:col-span-1 ux:row-span-1`
    : `${baseClasses} ux:w-full`;
  
  const imageClasses = layout === "grid" 
    ? "ux:h-64 ux:w-full"
    : "ux:h-40 ux:w-full ux:shrink-0";
  
  const contentClasses = layout === "grid"
    ? "ux:p-4 ux:text-center"
    : "ux:flex ux:flex-col ux:justify-between ux:gap-2 ux:p-4";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onProductSelect(product);
    }
  };

  return (
    <div
      className={`${cardClasses} ux:rounded-xl ux:border ux:border-slate-200 ux:bg-white ux:shadow-sm ux:hover:ux:shadow-md ux:p-2`}
      onClick={() => onProductSelect(product)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
    >
      {/* Image */}
      <div className="ux:relative ux:overflow-hidden ux:rounded-xl ux:bg-slate-100 ux:group-hover:ux:shadow-lg">
        <img
          src={product.image}
          alt={product.name}
          className={`${imageClasses} ux:object-cover ux:transition-transform ux:duration-300 ux:group-hover:ux:scale-110`}
        />
        {/* Category Tag */}
        <div className="ux:absolute ux:top-2 ux:left-2 ux:px-2 ux:py-1 ux:rounded-full ux:bg-white ux:bg-opacity-90 ux:text-xs ux:font-medium ux:text-slate-700 ux:shadow-sm">
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className={contentClasses}>
        <div className="ux:space-y-1">
          <h3 className="ux:text-sm ux:font-semibold ux:text-slate-900 ux:group-hover:ux:text-emerald-600">
            {product.name}
          </h3>
          {product.description && (
            <p className="ux:text-xs ux:text-slate-600 ux:line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
        <div className="ux:flex ux:items-center ux:justify-between ux:mt-2">
          <span className="ux:text-sm ux:font-bold ux:text-slate-900">
            {product.price}
          </span>
        </div>
      </div>
    </div>
  );
};

// Empty state component
const EmptyState = () => (
  <div className="ux:rounded-2xl ux:border ux:border-dashed ux:border-slate-300 ux:bg-white ux:p-8 ux:text-center">
    <p className="ux:text-sm ux:text-slate-400">
      No products available.
    </p>
  </div>
);

// Header component
const ProductsHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="ux:space-y-2">
    <h2 className="ux:text-2xl ux:font-bold ux:text-slate-900">{title}</h2>
    <p className="ux:text-sm ux:text-slate-500">{subtitle}</p>
  </div>
);

const ProductsView = ({
  title = "Products",
  subtitle = "Browse our collection",
  products = [],
  layout = "grid",
  itemsPerRow,
  dispatch,
}: ProductsViewProps) => {
  const [selectedLayout, setSelectedLayout] = useState<"grid" | "list">(getValidLayout(layout));
  const [windowWidth, setWindowWidth] = useState(0);

  // Validate and normalize products
  const validatedProducts = useMemo(() => validateProducts(products), [products]);

  // Track window width for responsive behavior
  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Update layout if prop changes
  useEffect(() => {
    const validLayout = getValidLayout(layout);
    if (selectedLayout !== validLayout) {
      setSelectedLayout(validLayout);
    }
  }, [layout, selectedLayout]);

  // Get responsive grid columns
  const getResponsiveGridCols = useCallback(() => {
    if (selectedLayout !== "grid") return "ux:space-y-4";
    
    // Use itemsPerRow prop if provided, otherwise use responsive behavior
    if (itemsPerRow && itemsPerRow > 0) {
      return `ux:grid-cols-${itemsPerRow}`;
    }
    
    // Responsive grid columns based on window width
    if (windowWidth < BREAKPOINTS.mobile) return "ux:grid-cols-1"; // Mobile
    if (windowWidth < BREAKPOINTS.tablet) return "ux:grid-cols-2"; // Tablet
    if (windowWidth < BREAKPOINTS.desktop) return "ux:grid-cols-3"; // Desktop
    return "ux:grid-cols-4"; // Large desktop
  }, [selectedLayout, itemsPerRow, windowWidth]);

  // Handle product selection with analytics
  const handleProductSelect = useCallback((product: Product) => {
    // Optional analytics / event tracking
    if (dispatch) {
      setTimeout(() => {
        dispatch("product_selected", {
          productId: product.id,
          productName: product.name,
          price: product.price,
          category: product.category,
        });
      }, 0);
    }
  }, [dispatch]);

  return (
    <div className="ux:space-y-6">
      {/* Header */}
      <ProductsHeader title={title} subtitle={subtitle} />

      {/* Products Grid/List */}
      <div className={`ux:grid ux:gap-6 ${getResponsiveGridCols()}`}>
        {validatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            layout={selectedLayout}
            onProductSelect={handleProductSelect}
          />
        ))}
      </div>

      {/* Empty State */}
      {validatedProducts.length === 0 && <EmptyState />}
    </div>
  );
};

export default ProductsView;