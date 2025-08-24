const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

export const putImage = async ({ file }) => {
  // Step 1: Get signed URL from backend
  const res = await fetch(`${BASE_URL}/api/products/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileType: file.type }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get upload URL: ${res.status}`);
  }

  const data = await res.json();
  const { url, publicURL } = data;
  

  // Step 2: Upload file directly to S3 using signed URL
  const upload = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!upload.ok) {
    throw new Error(`Failed to upload file: ${upload.status}`);
  }

  
  return publicURL;
};

// Function to get image URL from Cloudflare R2 storage
export const getImageUrl = (imageId) => {
  if (!imageId) {
    // Return a default placeholder image
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2Qjc0ODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
  }
  
  // If it's already a full URL (Cloudflare R2 URL), return it directly
  if (imageId.startsWith('http')) {
    return imageId;
  }
  
  // Extract the image ID from the full URL if it's already a full URL
  const id = imageId.includes('/') ? imageId.split('/').pop() : imageId;
  
  // Use the backend API to serve images from Cloudflare R2
  return `${BASE_URL}/api/products/images/${id}`;
};
