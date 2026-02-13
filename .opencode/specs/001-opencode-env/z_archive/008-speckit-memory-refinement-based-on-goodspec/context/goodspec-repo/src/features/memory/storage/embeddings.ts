/**
 * Embedding Generation
 * Supports local (Transformers.js), OpenAI, and Ollama providers
 * @module features/memory/storage/embeddings
 */

import type { EmbeddingsConfig, EmbeddingProvider } from "../types.js";

// Transformers.js types
type FeatureExtractionPipeline = {
  (texts: string[], options?: { pooling?: string; normalize?: boolean }): Promise<{
    data: Float32Array;
    dims: number[];
  }>;
};

/**
 * Abstract interface for embedding providers
 */
interface EmbeddingProviderInterface {
  initialize(): Promise<void>;
  generate(text: string): Promise<Float32Array>;
  generateBatch(texts: string[]): Promise<Float32Array[]>;
  getDimensions(): number;
}

/**
 * Local embedding provider using Transformers.js
 */
class LocalEmbeddingProvider implements EmbeddingProviderInterface {
  private extractor: FeatureExtractionPipeline | null = null;
  private modelName: string;
  private dimensions: number;

  constructor(modelName: string = "Xenova/all-MiniLM-L6-v2", dimensions: number = 384) {
    this.modelName = modelName;
    this.dimensions = dimensions;
  }

  async initialize(): Promise<void> {
    if (this.extractor) return;

    try {
      // Dynamic import to avoid loading the model until needed
      const { pipeline } = await import("@huggingface/transformers");
      this.extractor = (await pipeline(
        "feature-extraction",
        this.modelName
      )) as unknown as FeatureExtractionPipeline;
      console.log(`[Memory] Loaded local embedding model: ${this.modelName}`);
    } catch (error) {
      console.error("[Memory] Failed to load local embedding model:", error);
      throw error;
    }
  }

  async generate(text: string): Promise<Float32Array> {
    if (!this.extractor) await this.initialize();

    const output = await this.extractor!([text], {
      pooling: "mean",
      normalize: true,
    });

    return new Float32Array(output.data.slice(0, this.dimensions));
  }

  async generateBatch(texts: string[]): Promise<Float32Array[]> {
    if (!this.extractor) await this.initialize();

    const output = await this.extractor!(texts, {
      pooling: "mean",
      normalize: true,
    });

    // Split the flat array into individual embeddings
    const embeddings: Float32Array[] = [];
    for (let i = 0; i < texts.length; i++) {
      const start = i * this.dimensions;
      const end = start + this.dimensions;
      embeddings.push(new Float32Array(output.data.slice(start, end)));
    }

    return embeddings;
  }

  getDimensions(): number {
    return this.dimensions;
  }
}

/**
 * OpenAI embedding provider
 */
class OpenAIEmbeddingProvider implements EmbeddingProviderInterface {
  private apiKey: string;
  private model: string;
  private dimensions: number;

  constructor(apiKey: string, model: string = "text-embedding-3-small", dimensions: number = 384) {
    this.apiKey = apiKey;
    this.model = model;
    this.dimensions = dimensions;
  }

  async initialize(): Promise<void> {
    // No initialization needed for OpenAI
  }

  async generate(text: string): Promise<Float32Array> {
    const embeddings = await this.generateBatch([text]);
    return embeddings[0];
  }

  async generateBatch(texts: string[]): Promise<Float32Array[]> {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        input: texts,
        dimensions: this.dimensions,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = (await response.json()) as {
      data: Array<{ embedding: number[] }>;
    };

    return data.data.map((d) => new Float32Array(d.embedding));
  }

  getDimensions(): number {
    return this.dimensions;
  }
}

/**
 * Ollama embedding provider
 */
class OllamaEmbeddingProvider implements EmbeddingProviderInterface {
  private baseUrl: string;
  private model: string;
  private dimensions: number;

  constructor(
    baseUrl: string = "http://localhost:11434",
    model: string = "nomic-embed-text",
    dimensions: number = 768
  ) {
    this.baseUrl = baseUrl;
    this.model = model;
    this.dimensions = dimensions;
  }

  async initialize(): Promise<void> {
    // Check if Ollama is running
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error("Ollama not responding");
      }
    } catch (error) {
      console.warn("[Memory] Ollama not available, will retry on first use");
    }
  }

  async generate(text: string): Promise<Float32Array> {
    const embeddings = await this.generateBatch([text]);
    return embeddings[0];
  }

  async generateBatch(texts: string[]): Promise<Float32Array[]> {
    const embeddings: Float32Array[] = [];

    // Ollama doesn't support batch embeddings, process one at a time
    for (const text of texts) {
      const response = await fetch(`${this.baseUrl}/api/embed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          input: text,
          truncate: true,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ollama API error: ${error}`);
      }

      const data = (await response.json()) as { embeddings: number[][] };
      embeddings.push(new Float32Array(data.embeddings[0]));
    }

    return embeddings;
  }

  getDimensions(): number {
    return this.dimensions;
  }
}

/**
 * Main embedding generator that supports multiple providers
 */
export class EmbeddingGenerator {
  private provider: EmbeddingProviderInterface;
  private config: EmbeddingsConfig;
  private initialized: boolean = false;

  constructor(config?: Partial<EmbeddingsConfig>) {
    this.config = {
      provider: config?.provider ?? "local",
      model: config?.model,
      dimensions: config?.dimensions ?? 384,
      apiKey: config?.apiKey,
      baseUrl: config?.baseUrl,
    };

    this.provider = this.createProvider();
  }

  private createProvider(): EmbeddingProviderInterface {
    switch (this.config.provider) {
      case "openai":
        if (!this.config.apiKey) {
          throw new Error("OpenAI API key required for OpenAI provider");
        }
        return new OpenAIEmbeddingProvider(
          this.config.apiKey,
          this.config.model ?? "text-embedding-3-small",
          this.config.dimensions
        );

      case "ollama":
        return new OllamaEmbeddingProvider(
          this.config.baseUrl ?? "http://localhost:11434",
          this.config.model ?? "nomic-embed-text",
          this.config.dimensions
        );

      case "local":
      default:
        return new LocalEmbeddingProvider(
          this.config.model ?? "Xenova/all-MiniLM-L6-v2",
          this.config.dimensions
        );
    }
  }

  /**
   * Initialize the embedding provider
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    await this.provider.initialize();
    this.initialized = true;
  }

  /**
   * Generate embedding for a single text
   */
  async generate(text: string): Promise<Float32Array> {
    if (!this.initialized) await this.initialize();

    // Truncate very long texts to avoid issues
    const truncated = text.slice(0, 8000);
    return this.provider.generate(truncated);
  }

  /**
   * Generate embeddings for multiple texts
   */
  async generateBatch(texts: string[]): Promise<Float32Array[]> {
    if (!this.initialized) await this.initialize();

    // Truncate and filter empty texts
    const processed = texts
      .map((t) => t.slice(0, 8000))
      .filter((t) => t.length > 0);

    if (processed.length === 0) {
      return [];
    }

    return this.provider.generateBatch(processed);
  }

  /**
   * Get the dimension of embeddings produced by this generator
   */
  getDimensions(): number {
    return this.provider.getDimensions();
  }

  /**
   * Get the current provider type
   */
  getProvider(): EmbeddingProvider {
    return this.config.provider;
  }

  /**
   * Combine text fields for embedding (title + content + facts + concepts)
   */
  static combineForEmbedding(
    title: string,
    content: string,
    facts?: string[],
    concepts?: string[]
  ): string {
    const parts = [title, content];

    if (facts?.length) {
      parts.push("Facts: " + facts.join("; "));
    }

    if (concepts?.length) {
      parts.push("Tags: " + concepts.join(", "));
    }

    return parts.join("\n\n");
  }
}
