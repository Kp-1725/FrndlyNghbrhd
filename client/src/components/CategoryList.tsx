import { CategoryType, categoryConfig } from "@/lib/utils";

interface CategoryListProps {
  selectedCategory?: CategoryType;
  onCategorySelect?: (category: CategoryType) => void;
}

export function CategoryList({ selectedCategory, onCategorySelect }: CategoryListProps) {
  const categories = Object.entries(categoryConfig).map(([id, config]) => ({
    id: id as CategoryType,
    ...config
  }));

  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect?.(category.id)}
          className={`category-pill flex items-center ${category.bgColor} ${category.hoverColor} ${category.textColor} px-4 py-2 rounded-full text-sm font-medium ${
            selectedCategory === category.id ? 'ring-2 ring-primary' : ''
          }`}
        >
          <i className={`${category.icon} mr-2`}></i> {category.label}
        </button>
      ))}
    </div>
  );
}
