export const convertBlobToBase64 = async (blob: Blob): Promise<string> => {
  return await new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(blob);
    fileReader.onload = () => {
      typeof fileReader.result === "string"
        ? resolve(fileReader.result)
        : reject();
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const isImage = (file: File) => {
  const acceptedExtensions = ["png", "jpg", "jpeg"];
  const extension = file.name.split(".")[1];
  return acceptedExtensions.includes(extension);
};

export const isSmall = (file: File) => {
  return file.size <= 1e6;
};
