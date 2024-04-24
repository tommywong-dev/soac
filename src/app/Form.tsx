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
import { convertBlobToBase64 } from "./utils";

const Form = () => {
  const [isDragging, setDragging] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<{
    uri: string;
    file: File;
  }>();
  const [isCounting, setCounting] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult>();

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files || !e.target.files[0]) {
      return;
    }

    const file = e.target.files[0];
    const uri = URL.createObjectURL(file);
    setUploadingImage({ uri, file });
    setUploadResult(undefined);
  };

  const handleDrop: DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files || !e.dataTransfer.files[0]) {
      return;
    }

    const file = e.dataTransfer.files[0];
    const uri = URL.createObjectURL(file);
    setUploadingImage({ uri, file });
    setDragging(false);
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
              className="object-cover"
            />
          </div>
        ) : uploadingImage ? (
          <div className="relative w-full h-full">
            <Image
              fill
              src={uploadingImage.uri}
              alt={uploadingImage.file.name}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-x-2">
            <IconImage />
            <p className="text-xl font-bold text-center">
              Drop Image or Select Image from Device
            </p>
            <p className="text-center">Accepts .png and .jpg up to 5MB</p>
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
              } (${uploadResult.duration.toFixed(3)}ms)`
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
