
// Function to check if file is an image
export const isImageFile = (file: File): boolean => {
  const acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml'];
  return acceptedTypes.includes(file.type);
};

// Function to check if file is SVG or PNG (for logo and signature)
export const isSvgOrPng = (file: File): boolean => {
  const acceptedTypes = ['image/png', 'image/svg+xml'];
  return acceptedTypes.includes(file.type);
};

// Function to read an image file and return a data URL
export const readImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

// Function to load an image from a URL and return an HTMLImageElement
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      resolve(img);
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };
    
    img.src = src;
  });
};

// Function to resize an image while maintaining aspect ratio
export const resizeImage = (
  img: HTMLImageElement, 
  maxWidth: number, 
  maxHeight: number
): { width: number; height: number } => {
  let width = img.width;
  let height = img.height;
  
  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }
  
  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }
  
  return { width, height };
};

// Placeholder URLs
export const PLACEHOLDER_URLS = {
  logo: 'https://raw.githubusercontent.com/dljs2001/Images/025799a1bdee8370f34a4aa13c5c4986b649bb63/admit_card_app_images/university_logo_placceholder.svg',
  photo: 'https://raw.githubusercontent.com/dljs2001/Images/025799a1bdee8370f34a4aa13c5c4986b649bb63/admit_card_app_images/passport_size_photo_placeholder.svg',
  signature: 'https://raw.githubusercontent.com/dljs2001/Images/025799a1bdee8370f34a4aa13c5c4986b649bb63/admit_card_app_images/student_sign_placeholder.svg',
  controllerSignature: 'https://raw.githubusercontent.com/dljs2001/Images/025799a1bdee8370f34a4aa13c5c4986b649bb63/admit_card_app_images/controller_sign.png'
};
