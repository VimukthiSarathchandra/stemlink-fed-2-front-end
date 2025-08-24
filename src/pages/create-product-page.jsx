import CreateProductForm from "../components/CreateProductForm";

function CreateProductPage() {
  return (
    <main className="px-4 sm:px-6 lg:px-16 min-h-screen py-4 sm:py-8">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Create Product</h2>
      <CreateProductForm />
    </div>
    </main>
  );
}

export default CreateProductPage;
