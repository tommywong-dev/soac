export type RoboflowDetectResult = {
  /** time in seconds */
  time: number;
  predictions: {
    x: number;
    y: number;
    width: number;
    height: number;
    class: string;
    confidence: number;
  }[];
};

export type DetectResult = RoboflowDetectResult & {
  imageBase64: string;
};

export type UploadResult =
  | {
      ok: true;
      result: DetectResult;
    }
  | {
      ok: false;
      error: string;
    };
