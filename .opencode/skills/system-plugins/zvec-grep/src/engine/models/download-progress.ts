import type { EmbeddingModelProgress } from "./embeddings.js";

export type ModelArtifactDownloadProgress = {
  artifact: string;
  downloadedBytes: number;
  totalBytes?: number;
};

export type ModelDownloadProgressReporter = {
  start(): void;
  register(artifact: string): void;
  skip(artifact: string): void;
  report(progress: ModelArtifactDownloadProgress): void;
  warning(message: string): boolean;
  finish(): void;
};

export function createModelDownloadProgressReporter(
  model: string,
  onProgress?: (progress: EmbeddingModelProgress) => void,
  expectedArtifacts: readonly string[] = [],
): ModelDownloadProgressReporter {
  const artifacts = new Map<
    string,
    { downloadedBytes: number; totalBytes?: number }
  >(expectedArtifacts.map((artifact) => [artifact, { downloadedBytes: 0 }]));

  return {
    start() {
      onProgress?.({ stage: "preparing", model });
    },
    register(artifact) {
      if (!artifacts.has(artifact)) {
        artifacts.set(artifact, { downloadedBytes: 0 });
      }
    },
    skip(artifact) {
      artifacts.delete(artifact);
    },
    report(progress) {
      artifacts.set(progress.artifact, {
        downloadedBytes: progress.downloadedBytes,
        totalBytes: progress.totalBytes,
      });
      const values = [...artifacts.values()];
      const downloadedBytes = values.reduce(
        (sum, artifact) => sum + artifact.downloadedBytes,
        0,
      );
      const hasCompleteTotals =
        values.length > 0 &&
        values.every(
          (artifact) =>
            typeof artifact.totalBytes === "number" &&
            Number.isFinite(artifact.totalBytes) &&
            artifact.totalBytes >= 0,
        );
      const totalBytes = hasCompleteTotals
        ? values.reduce((sum, artifact) => sum + (artifact.totalBytes ?? 0), 0)
        : undefined;
      onProgress?.({
        stage: "downloading",
        model,
        downloadedBytes,
        ...(totalBytes === undefined ? {} : { totalBytes }),
      });
    },
    warning(message) {
      if (!onProgress) {
        return false;
      }
      onProgress({ stage: "warning", model, message });
      return true;
    },
    finish() {
      onProgress?.({ stage: "ready", model });
    },
  };
}
