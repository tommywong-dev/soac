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
