export const fileToDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    throw new Error('Invalid data URL');
  }
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const imageUrlToBase64 = async (url: string): Promise<string> => {
  try {
    // Note: Using a proxy might be necessary if the client faces CORS issues fetching images directly.
    // For this implementation, we'll assume direct fetch is possible.
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Return only the base64 content, without the data URL prefix
        resolve((reader.result as string).split(',')[1]);
      };
      reader.onerror = (error) => {
        reject(new Error("Failed to read image blob: " + error));
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image URL to base64:", error);
    throw new Error(`Could not process the furniture image from the URL. It might be a network or CORS issue. URL: ${url}`);
  }
};
