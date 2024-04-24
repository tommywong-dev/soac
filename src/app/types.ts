export type RoboflowDetectResult = {
  predictions: {
    x: number;
    y: number;
    width: number;
    height: number;
    class: string;
    confidence: number;
  }[];
  imageBase64: string;
};

export type UploadResult =
  | {
      ok: true;
      result: RoboflowDetectResult;
      duration: number;
    }
  | {
      ok: false;
      error: string;
    };
