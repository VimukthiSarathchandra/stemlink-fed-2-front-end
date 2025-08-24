import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCreateProductMutation, useGetAllCategoriesQuery, useGetAllColorsQuery } from "../lib/api";
import { useRef, useState } from "react";

import ImageInput from "./ImageInput";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

// Remove image validation from Zod schema - we'll handle it manually
const createProductFormSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  colorIds: z.array(z.string()).optional(),
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  stock: z.number().min(0, "Stock must be 0 or greater"),
  price: z.number().nonnegative("Price must be 0 or greater"),
});

function CreateProductForm() {
  const imageInputRef = useRef();
  const [hasSelectedFile, setHasSelectedFile] = useState(false);
  const [imageError, setImageError] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  
  const form = useForm({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      categoryId: "",
      colorIds: [],
      name: "",
      description: "",
      image: "",
      stock: "",
      price: "",
    },
  });

  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { data: categories } = useGetAllCategoriesQuery();
  const { data: colors } = useGetAllColorsQuery();

  const handleColorToggle = (colorId) => {
    setSelectedColors(prev => {
      const newColors = prev.includes(colorId) 
        ? prev.filter(id => id !== colorId)
        : [...prev, colorId];
      
      // Update form value
      form.setValue("colorIds", newColors);
      return newColors;
    });
  };

      const onSubmit = async (values) => {
      try {
        // Check if image is selected or uploaded
      if (!values.image && !hasSelectedFile) {
        setImageError("Image is required");
        return;
      }
      
      // Convert empty strings to numbers for validation
      const processedValues = {
        ...values,
        stock: values.stock === "" ? 0 : parseInt(values.stock) || 0,
        price: values.price === "" ? 0 : parseFloat(values.price) || 0,
      };
      
      // Upload image first if there's a selected file
      if (imageInputRef.current && hasSelectedFile) {
                  try {
            const imageUrl = await imageInputRef.current.uploadImage();
            // Update the form with the new image URL
            form.setValue("image", imageUrl);
            processedValues.image = imageUrl; // Update the processed values object
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          setImageError("Failed to upload image");
          return; // Don't proceed with product creation if image upload fails
        }
      }

      // Get updated form values after image upload
      const updatedValues = form.getValues();
      const finalValues = {
        ...updatedValues,
        stock: updatedValues.stock === "" ? 0 : parseInt(updatedValues.stock) || 0,
        price: updatedValues.price === "" ? 0 : parseFloat(updatedValues.price) || 0,
      };
      
              await createProduct(finalValues).unwrap();
      
      // Reset form after successful submission
      form.reset();
      setHasSelectedFile(false);
      setImageError("");
      setSelectedColors([]);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  // Watch form values for debugging
  const watchedValues = form.watch();


  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Create New Product</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Add a new product to your inventory</p>
          </div>

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Category *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full h-10 sm:h-12 text-sm">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="colorIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Colors (Optional)</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 mt-2">
                  {colors?.map((color) => (
                    <div
                      key={color._id}
                      className={`relative cursor-pointer rounded-lg p-2 sm:p-3 border-2 transition-all ${
                        selectedColors.includes(color._id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleColorToggle(color._id)}
                    >
                      <div 
                        className="w-full h-6 sm:h-8 rounded-md mb-1 sm:mb-2 border"
                        style={{ backgroundColor: color.hexCode }}
                      />
                      <p className="text-xs text-center font-medium text-gray-700 truncate">
                        {color.name}
                      </p>
                      {selectedColors.includes(color._id) && (
                        <div className="absolute top-1 right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Click to select/deselect colors. Selected colors will be highlighted.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Product Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" className="text-sm h-10 sm:h-12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Description *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your product..." 
                    className="min-h-[100px] sm:min-h-[120px] text-sm resize-none"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Product Image *</FormLabel>
                <FormControl>
                  <ImageInput 
                    ref={imageInputRef}
                    onChange={(url) => {
                      field.onChange(url);
                      setHasSelectedFile(false);
                      setImageError("");
                    }}
                    onFileSelect={(file) => {
                      setHasSelectedFile(!!file);
                      setImageError("");
                    }}
                    value={field.value} 
                  />
                </FormControl>
                {imageError && (
                  <p className="text-sm text-red-600">{imageError}</p>
                )}
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Stock Quantity *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter stock quantity"
                      className="text-sm h-10 sm:h-12"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : parseInt(value) || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Price *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter price"
                      className="text-sm h-10 sm:h-12"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : parseFloat(value) || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 h-10 sm:h-12 text-sm sm:text-base font-medium"
            >
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                // Reset all state variables first
                setHasSelectedFile(false);
                setImageError("");
                setSelectedColors([]);
                
                // Clear the file input
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) {
                  fileInput.value = "";
                }
                
                // Reset form to original default values with empty strings for number fields
                form.reset({
                  categoryId: "",
                  colorIds: [],
                  name: "",
                  description: "",
                  stock: "",
                  price: "",
                  image: "",
                });
                
                // Clear any validation errors
                form.clearErrors();
                
                // Force form fields to update by setting values explicitly
                form.setValue("stock", "");
                form.setValue("price", "");
                form.setValue("categoryId", "");
                form.setValue("name", "");
                form.setValue("description", "");
                form.setValue("image", "");
                form.setValue("colorIds", []);
              }}
              className="flex-1 h-10 sm:h-12 text-sm sm:text-base font-medium"
            >
              Reset Form
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CreateProductForm;
