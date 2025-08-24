import { cn } from "@/lib/utils";

function CategoryButton({ category, selectedCategoryId, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn("border rounded-full px-3 sm:px-4 py-2 text-sm sm:text-base transition-colors whitespace-nowrap hover:bg-gray-50", {
        "bg-black text-white hover:bg-gray-800": selectedCategoryId === category._id,
        "bg-white border-black text-black": selectedCategoryId !== category._id,
      })}
    >
      {category.name}
    </button>
  );
}

export default CategoryButton;
