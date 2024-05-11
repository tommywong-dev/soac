"use server";

import { RoboflowDetectResult, UploadResult } from "./types";

const config = {
  apiKey: process.env.ROBOFLOW_BLACK_SEED_API_KEY,
  model: process.env.ROBOFLOW_BLACK_SEED_MODEL,
  version: process.env.ROBOFLOW_BLACK_SEED_VERSION,
};

export const serverActionDetectImage = async (
  imageBase64: string
): Promise<UploadResult> => {
  try {
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

    return {
      ok: true,
      result: {
        time: jsonRes.value.time,
        predictions: jsonRes.value.predictions,
        imageBase64: imageRes.value,
      },
    };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
};

const getPredictionsJson = async (imageBase64: string) => {
  validateConfig();

  const params = new URLSearchParams();
  params.append("api_key", config.apiKey!);
  params.append("classes", "seed");
  params.append("confidence", "50");

  const res = await fetch(
    `https://detect.roboflow.com/${config.model}/${
      config.version
    }?${params.toString()}`,
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
  validateConfig();

  const params = new URLSearchParams();
  params.append("api_key", config.apiKey!);
  params.append("classes", "seed");
  params.append("confidence", "50");
  params.append("format", "image");
  params.append("stroke", "2");

  const res = await fetch(
    `https://detect.roboflow.com/${config.model}/${
      config.version
    }?${params.toString()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: imageBase64,
    }
  );

  const detectBlob = await res.blob();
  let buffer = Buffer.from(await detectBlob.arrayBuffer());
  const detectImage =
    "data:" + detectBlob.type + ";base64," + buffer.toString("base64");

  return detectImage;
};

const validateConfig = () => {
  if (!config.apiKey) {
    throw new Error("Missing API Key");
  }
  if (!config.model) {
    throw new Error("Missing model name");
  }
  if (!config.version) {
    throw new Error("Missing model version");
  }
};
