import { EngineError, type EngineErrorCode } from "../../errors.js";
import type { Content, TextContent } from "../../types.js";
import {
  BaseEmbeddingModel,
  type CreateEmbeddingModelOptions,
  type EmbeddingModelInfo,
  type EmbeddingModelProgress,
  type EmbeddingResult,
  type NormalizedEmbeddingOptions,
} from "../embeddings.js";
import type { OllamaEmbeddingCatalogEntry } from "../catalog.js";
import { traceHeaders } from "../../../observability/trace-context.js";

const DEFAULT_OLLAMA_ENDPOINT = "http://127.0.0.1:11434";

// The first embed call makes the server load model weights, which takes much
// longer than a warm request.
const OLLAMA_EMBEDDING_TIMEOUT_MS = 120_000;

const BATCH_EMBEDDING_PATH = "/api/embed";
const LEGACY_EMBEDDING_PATH = "/api/embeddings";

type OllamaDependencies = {
  fetch: typeof globalThis.fetch;
};

const defaultDependencies: OllamaDependencies = {
  fetch: (...args) => globalThis.fetch(...args),
};

type OllamaResponseBody = {
  json: unknown;
  text: string;
};

export class OllamaEmbeddingModel extends BaseEmbeddingModel {
  readonly info: EmbeddingModelInfo;

  private readonly entry: OllamaEmbeddingCatalogEntry;
  private readonly endpoint: string;
  private readonly dependencies: OllamaDependencies;
  private useLegacyEmbeddingApi = false;
  private announcedReady = false;

  constructor(
    entry: OllamaEmbeddingCatalogEntry,
    options: CreateEmbeddingModelOptions,
    dependencies: Partial<OllamaDependencies> = {},
  ) {
    super();

    this.entry = entry;
    this.endpoint = resolveOllamaEndpoint(entry.reference, options.endpoint);
    this.info = {
      reference: entry.reference,
      provider: entry.provider,
      name: entry.model,
      dimension: entry.dimension,
      metric: entry.metric,
      endpoint: this.endpoint,
      inputKinds: ["text"],
      limits: {
        maxBatchSize: entry.maxBatchSize,
        maxInputTokens: entry.maxInputTokens,
      },
    };
    this.dependencies = { ...defaultDependencies, ...dependencies };
  }

  protected async doEmbed(
    contents: readonly Content[],
    options: NormalizedEmbeddingOptions,
  ): Promise<EmbeddingResult> {
    const texts = (contents as readonly TextContent[]).map((content) =>
      applyPurposePrefix(content.text, options.purpose, this.entry),
    );

    this.announcePreparing(options.onProgress);
    const vectors = this.useLegacyEmbeddingApi
      ? await this.embedOneByOne(texts, options)
      : await this.embedAsBatch(texts, options);
    this.assertVectorShape(vectors, texts.length);
    this.announceReady(options.onProgress);

    // Ollama truncates input past the served context window and does not say
    // which inputs it truncated, so no input index can be reported here.
    return { vectors: vectors as number[][], truncated: [] };
  }

  private async embedAsBatch(
    texts: string[],
    options: NormalizedEmbeddingOptions,
  ): Promise<unknown[]> {
    const response = await this.post(
      BATCH_EMBEDDING_PATH,
      { model: this.entry.tag, input: texts },
      options,
    );
    const body = await this.readBody(response, BATCH_EMBEDDING_PATH);

    if (!response.ok) {
      this.throwIfModelMissing(response, body);
      if (isMissingRoute(response, body)) {
        // Servers released before the batch route still serve one input per
        // request on the older path.
        this.useLegacyEmbeddingApi = true;
        return await this.embedOneByOne(texts, options);
      }
      throw this.apiError(response, body, BATCH_EMBEDDING_PATH);
    }

    if (body.json === undefined) {
      throw this.invalidJson(response, BATCH_EMBEDDING_PATH);
    }

    const embeddings = isRecord(body.json) ? body.json.embeddings : undefined;
    if (!Array.isArray(embeddings)) {
      throw new EngineError("Ollama response did not include embeddings", {
        code: this.errorCode("MISSING_EMBEDDINGS"),
        context: `model=${this.info.reference} endpoint=${this.requestUrl(BATCH_EMBEDDING_PATH)}`,
      });
    }

    return embeddings as unknown[];
  }

  private async embedOneByOne(
    texts: string[],
    options: NormalizedEmbeddingOptions,
  ): Promise<unknown[]> {
    const vectors: unknown[] = [];

    for (const text of texts) {
      const response = await this.post(
        LEGACY_EMBEDDING_PATH,
        { model: this.entry.tag, prompt: text },
        options,
      );
      const body = await this.readBody(response, LEGACY_EMBEDDING_PATH);

      if (!response.ok) {
        this.throwIfModelMissing(response, body);
        throw this.apiError(response, body, LEGACY_EMBEDDING_PATH);
      }

      if (body.json === undefined) {
        throw this.invalidJson(response, LEGACY_EMBEDDING_PATH);
      }

      const embedding = isRecord(body.json) ? body.json.embedding : undefined;
      if (!Array.isArray(embedding)) {
        throw new EngineError("Ollama response did not include an embedding", {
          code: this.errorCode("MISSING_EMBEDDINGS"),
          context: `model=${this.info.reference} endpoint=${this.requestUrl(LEGACY_EMBEDDING_PATH)}`,
        });
      }

      // The older path returns unnormalized vectors. Cosine similarity ignores
      // magnitude, so they rank identically to the batch path's vectors.
      vectors.push(embedding);
    }

    return vectors;
  }

  private async post(
    path: string,
    payload: Record<string, unknown>,
    options: NormalizedEmbeddingOptions,
  ): Promise<Response> {
    const url = this.requestUrl(path);
    const signal = ollamaEmbeddingSignal(options.signal);

    try {
      return await this.dependencies.fetch(url, {
        method: "POST",
        headers: {
          ...traceHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal,
      });
    } catch (cause) {
      throwIfEmbeddingCancelled(options.signal);
      throw new EngineError("Ollama embedding server is unreachable", {
        code: this.errorCode("CONNECTION_FAILED"),
        context: `model=${this.info.reference} endpoint=${url} timeoutMs=${OLLAMA_EMBEDDING_TIMEOUT_MS}\nhint=Start the server with \`ollama serve\`, or point ZVEC_GREP_OLLAMA_URL at its address.`,
        cause,
      });
    }
  }

  private async readBody(
    response: Response,
    path: string,
  ): Promise<OllamaResponseBody> {
    let text: string;

    try {
      text = await response.text();
    } catch (cause) {
      throw new EngineError("Ollama response could not be read", {
        code: this.errorCode("INVALID_JSON"),
        context: `model=${this.info.reference} endpoint=${this.requestUrl(path)} status=${response.status}`,
        cause,
      });
    }

    try {
      return { json: JSON.parse(text) as unknown, text };
    } catch {
      return { json: undefined, text };
    }
  }

  private assertVectorShape(vectors: unknown[], expectedCount: number): void {
    if (vectors.length !== expectedCount) {
      throw new EngineError("Ollama returned the wrong number of vectors", {
        code: this.errorCode("VECTOR_COUNT_MISMATCH"),
        context: `model=${this.info.reference} inputCount=${expectedCount} vectorCount=${vectors.length}`,
      });
    }

    const first = vectors[0];
    if (!Array.isArray(first)) {
      throw new EngineError("Ollama returned an invalid vector", {
        code: this.errorCode("INVALID_VECTOR"),
        context: `model=${this.info.reference} vectorIndex=0`,
      });
    }

    if (first.length !== this.info.dimension) {
      throw new EngineError("Ollama returned an unexpected vector dimension", {
        code: this.errorCode("DIMENSION_MISMATCH"),
        context: `model=${this.info.reference} tag=${this.entry.tag} expectedDimension=${this.info.dimension} actualDimension=${first.length}\nhint=The server serves a different model under this tag than the catalog describes.`,
      });
    }
  }

  private throwIfModelMissing(
    response: Response,
    body: OllamaResponseBody,
  ): void {
    const message = errorMessage(body.json);
    if (
      message === undefined ||
      !isMissingModelMessage(message, this.entry.tag)
    ) {
      return;
    }

    throw new EngineError("Ollama has not pulled this embedding model", {
      code: this.errorCode("MODEL_NOT_FOUND"),
      context: `model=${this.info.reference} tag=${this.entry.tag} status=${response.status} serverMessage=${message}\nhint=Run \`ollama pull ${this.entry.tag}\`.`,
    });
  }

  private apiError(
    response: Response,
    body: OllamaResponseBody,
    path: string,
  ): EngineError {
    return new EngineError("Ollama embedding request returned an error", {
      code: this.errorCode("API_ERROR"),
      context: `model=${this.info.reference} tag=${this.entry.tag} endpoint=${this.requestUrl(path)} status=${response.status} serverMessage=${errorMessage(body.json) ?? truncateMessage(body.text)}`,
    });
  }

  private invalidJson(response: Response, path: string): EngineError {
    return new EngineError("Ollama response was not valid JSON", {
      code: this.errorCode("INVALID_JSON"),
      context: `model=${this.info.reference} endpoint=${this.requestUrl(path)} status=${response.status}`,
    });
  }

  private announcePreparing(
    onProgress?: (progress: EmbeddingModelProgress) => void,
  ): void {
    if (this.announcedReady) {
      return;
    }
    onProgress?.({ stage: "preparing", model: this.info.reference });
  }

  private announceReady(
    onProgress?: (progress: EmbeddingModelProgress) => void,
  ): void {
    if (this.announcedReady) {
      return;
    }
    this.announcedReady = true;
    onProgress?.({ stage: "ready", model: this.info.reference });
  }

  private requestUrl(path: string): string {
    return `${this.endpoint}${path}`;
  }

  private errorCode(suffix: string): EngineErrorCode {
    return `ZVEC_GREP.ENGINE.MODELS.OLLAMA_EMBEDDING_${suffix}`;
  }
}

function resolveOllamaEndpoint(
  reference: string,
  explicit: string | undefined,
): string {
  const endpoint =
    [explicit, process.env.ZVEC_GREP_OLLAMA_URL, process.env.OLLAMA_BASE_URL]
      .map((value) => value?.trim())
      .find((value) => value !== undefined && value.length > 0) ??
    DEFAULT_OLLAMA_ENDPOINT;

  let parsed: URL;
  try {
    parsed = new URL(endpoint);
  } catch {
    throw invalidEndpoint(reference, endpoint);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw invalidEndpoint(reference, endpoint);
  }

  return endpoint.replace(/\/+$/, "");
}

function invalidEndpoint(reference: string, endpoint: string): EngineError {
  return new EngineError("Ollama endpoint must be a valid HTTP(S) URL", {
    code: "ZVEC_GREP.ENGINE.MODELS.OLLAMA_EMBEDDING_INVALID_ENDPOINT",
    context: `model=${reference} endpoint=${endpoint}`,
  });
}

function applyPurposePrefix(
  text: string,
  purpose: NormalizedEmbeddingOptions["purpose"],
  entry: OllamaEmbeddingCatalogEntry,
): string {
  const prefix =
    purpose === "query"
      ? "queryPrefix" in entry
        ? entry.queryPrefix
        : undefined
      : "documentPrefix" in entry
        ? entry.documentPrefix
        : undefined;
  return prefix ? `${prefix}${text}` : text;
}

function isMissingRoute(response: Response, body: OllamaResponseBody): boolean {
  // A server without the route answers with the router's plain-text page,
  // while a server with it reports model and request problems as JSON.
  return (
    (response.status === 404 || response.status === 405) &&
    errorMessage(body.json) === undefined
  );
}

function isMissingModelMessage(message: string, tag: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("try pulling it first") ||
    (normalized.includes("not found") && normalized.includes(tag.toLowerCase()))
  );
}

function errorMessage(body: unknown): string | undefined {
  if (!isRecord(body) || typeof body.error !== "string") {
    return undefined;
  }
  const message = body.error.trim();
  return message.length > 0 ? message : undefined;
}

function truncateMessage(text: string): string {
  const message = text.trim().replace(/\s+/g, " ");
  return message.length > 200 ? `${message.slice(0, 200)}...` : message;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function ollamaEmbeddingSignal(signal: AbortSignal | undefined): AbortSignal {
  const timeout = AbortSignal.timeout(OLLAMA_EMBEDDING_TIMEOUT_MS);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}

function throwIfEmbeddingCancelled(signal: AbortSignal | undefined): void {
  if (!signal?.aborted) {
    return;
  }
  throw signal.reason instanceof Error
    ? signal.reason
    : new Error("Embedding request was cancelled.");
}
