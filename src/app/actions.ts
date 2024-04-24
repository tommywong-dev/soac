"use server";

import { RoboflowDetectResult, UploadResult } from "./types";
import { convertBlobToBase64 } from "./utils";

const config = {
  apiKey: process.env.ROBOFLOW_BLACK_SEED_API_KEY,
  model: process.env.ROBOFLOW_BLACK_SEED_MODEL,
  version: process.env.ROBOFLOW_BLACK_SEED_VERSION,
};

export const serverActionDetectImage = async (
  imageBase64: string
): Promise<UploadResult> => {
  try {
    const startTime = new Date().getTime() / 1000;
    const [jsonRes, imageRes] = await Promise.allSettled([
      getPredictionsJson(imageBase64),
      getPredictionsImage(imageBase64),
    ]);
    if (jsonRes.status === "rejected") {
      return { ok: false, error: jsonRes.reason };
    }
    if (imageRes.status === "rejected") {
      return { ok: false, error: imageRes.reason };
    }
    const endTime = new Date().getTime() / 1000;

    return {
      ok: true,
      result: {
        predictions: jsonRes.value.predictions,
        imageBase64: imageRes.value,
      },
      duration: endTime - startTime,
    };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
};

const getPredictionsJson = async (imageBase64: string) => {
  const res = await fetch(
    `https://detect.roboflow.com/${config.model}/${config.version}?api_key=${config.apiKey}&classes=seed&confidence=25`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: imageBase64,
    }
  );

  const detectResult: RoboflowDetectResult = await res.json();
  return detectResult;
};

const getPredictionsImage = async (imageBase64: string) => {
  const res = await fetch(
    `https://detect.roboflow.com/${config.model}/${config.version}?api_key=${config.apiKey}&classes=seed&confidence=25&format=image&stroke=2`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: imageBase64,
    }
  );
  console.log("res", res);

  const detectBlob = await res.blob();
  let buffer = Buffer.from(await detectBlob.arrayBuffer());
  const detectImage =
    "data:" + detectBlob.type + ";base64," + buffer.toString("base64");

  return detectImage;
};
