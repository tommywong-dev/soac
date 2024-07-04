"use client";

import React, {
  ChangeEvent,
  DragEventHandler,
  FormEventHandler,
  MouseEventHandler,
  useState,
} from "react";
import IconImage from "./IconImage";
import Image from "next/image";
import { serverActionDetectImage } from "./actions";
import { UploadResult } from "./types";
import { convertBlobToBase64, isImage, isSmall } from "./utils";

const Form = () => {
  const [isDragging, setDragging] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<{
    uri: string;
    file: File;
  }>();
  const [isCounting, setCounting] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult>();

  const validateAndDisplayImage = (file: File) => {
    if (!isImage(file)) {
      setUploadResult({
        error: "Accepts .png and .jpg only",
        ok: false,
      });
      setUploadingImage(undefined);
      return;
    }
    if (!isSmall(file)) {
      setUploadResult({
        error: "Accepts up to 1MB only",
        ok: false,
      });
      setUploadingImage(undefined);
      return;
    }
    const uri = URL.createObjectURL(file);
    setUploadingImage({ uri, file });
    setDragging(false);
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files || !e.target.files[0]) {
      return;
    }

    console.log("e.target.files[0]", e.target.files[0]);
    validateAndDisplayImage(e.target.files[0]);
  };

  const handleDrop: DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files || !e.dataTransfer.files[0]) {
      return;
    }

    validateAndDisplayImage(e.dataTransfer.files[0]);
  };

  const handleDragEnter: DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    setUploadingImage(undefined);
    setUploadResult(undefined);
  };

  const handleDragLeave: DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!uploadingImage) {
      return;
    }

    const imageBase64 = await convertBlobToBase64(uploadingImage.file);

    setCounting(true);
    const result = await serverActionDetectImage(imageBase64);
    setUploadResult(result);
    setCounting(false);
  };

  const handleReset: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setUploadResult(undefined);
    setUploadingImage(undefined);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center gap-4"
    >
      <label
        htmlFor="dropzone"
        className={`flex justify-center items-center w-full ${
          uploadResult?.ok || uploadingImage ? "h-screen" : "h-80"
        } p-8 rounded-2xl ${isCounting ? "cursor-default" : "cursor-pointer"} ${
          isDragging
            ? "bg-drag-drop-border-dragover"
            : uploadResult
            ? uploadResult.ok
              ? "bg-drag-drop-border-success"
              : "bg-drag-drop-border-error"
            : "bg-drag-drop-border"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragEnter}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <input
          id="dropzone"
          name="image"
          type="file"
          className="hidden"
          accept="image/png,image/jpg"
          onChange={handleUpload}
          disabled={isCounting}
        />
        {uploadResult?.ok ? (
          <div className="relative w-full h-full">
            <Image
              fill
              src={uploadResult.result.imageBase64}
              alt={"Predictions"}
              className="object-contain"
            />
          </div>
        ) : uploadingImage ? (
          <div className="relative w-full h-full">
            <Image
              fill
              src={uploadingImage.uri}
              alt={uploadingImage.file.name}
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-x-2">
            <IconImage />
            <p className="text-xl font-bold text-center">
              Drop Image or Select Image from Device
            </p>
            <p className="text-center">Accepts .png and .jpg up to 1MB</p>
          </div>
        )}
      </label>
      {uploadResult && (
        <h4
          className={`font-bold ${
            uploadResult.ok ? "text-green-500" : "text-red-500"
          }`}
        >
          {uploadResult.ok
            ? `Count: ${
                uploadResult.result.predictions.length
              } (${uploadResult.result.time.toFixed(3)}s)`
            : uploadResult.error}
        </h4>
      )}
      {uploadResult ? (
        <button
          type="reset"
          className={
            "w-32 py-2 px-4 rounded-lg font-bold bg-blue-600 text-white"
          }
          onClick={handleReset}
        >
          Reset
        </button>
      ) : (
        <button
          type="submit"
          className={`w-32 py-2 px-4 rounded-lg font-bold ${
            uploadingImage && !isCounting
              ? "bg-blue-600 text-white"
              : "bg-gray-100"
          }`}
          disabled={!uploadingImage || isCounting}
        >
          {isCounting ? "Counting..." : "Count"}
        </button>
      )}
    </form>
  );
};

export default Form;
