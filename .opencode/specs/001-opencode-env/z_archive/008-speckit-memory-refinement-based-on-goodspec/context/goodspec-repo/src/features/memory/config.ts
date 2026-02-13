/**
 * Memory Configuration Schema
 * Zod-validated configuration for the memory system
 * @module features/memory/config
 */

import { z } from "zod";
import type { MemoryConfig } from "./types.js";

/**
 * Capture configuration schema
 */
export const CaptureConfigSchema = z.object({
  enabled: z.boolean().default(true),
  captureToolUse: z.boolean().default(true),
  captureMessages: z.boolean().default(false),
  capturePhaseChanges: z.boolean().default(true),
  skipTools: z.array(z.string()).default([
    "Read", "Glob", "Grep", "Bash",
    "mcp_read", "mcp_glob", "mcp_grep", "mcp_bash",
    "memory_save", "memory_search", "memory_note", "memory_decision", "memory_forget",
  ]),
  minImportanceThreshold: z.number().min(1).max(10).default(4),
});

/**
 * Injection configuration schema
 */
export const InjectionConfigSchema = z.object({
  enabled: z.boolean().default(true),
  budgetTokens: z.number().min(100).max(4000).default(800),
  format: z.enum(["timeline", "bullets", "structured"]).default("timeline"),
  priorityTypes: z.array(z.enum([
    "observation", "decision", "session_summary", "user_prompt", "note", "todo"
  ])).default(["decision", "observation", "todo"]),
});

/**
 * Privacy configuration schema
 */
export const PrivacyConfigSchema = z.object({
  enabled: z.boolean().default(true),
  privateTagEnabled: z.boolean().default(true),
  retentionDays: z.number().min(1).max(365).default(90),
  maxMemories: z.number().min(100).max(100000).default(10000),
});

/**
 * Embeddings configuration schema
 */
export const EmbeddingsConfigSchema = z.object({
  provider: z.enum(["local", "openai", "ollama"]).default("local"),
  model: z.string().optional(),
  dimensions: z.number().min(64).max(4096).default(384),
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
});

/**
 * Complete memory configuration schema
 */
export const MemoryConfigSchema = z.object({
  enabled: z.boolean().default(true),
  workerPort: z.number().min(1024).max(65535).default(37777),
  capture: CaptureConfigSchema.optional().default({
    enabled: true,
    captureToolUse: true,
    captureMessages: false,
    capturePhaseChanges: true,
    skipTools: ["Read", "Glob", "Grep", "Bash"],
    minImportanceThreshold: 4,
  }),
  injection: InjectionConfigSchema.optional().default({
    enabled: true,
    budgetTokens: 800,
    format: "timeline",
    priorityTypes: ["decision", "observation", "todo"],
  }),
  privacy: PrivacyConfigSchema.optional().default({
    enabled: true,
    privateTagEnabled: true,
    retentionDays: 90,
    maxMemories: 10000,
  }),
  embeddings: EmbeddingsConfigSchema.optional().default({
    provider: "local",
    dimensions: 384,
  }),
});

/**
 * Type inference from schema
 */
export type MemoryConfigInput = z.input<typeof MemoryConfigSchema>;
export type MemoryConfigOutput = z.output<typeof MemoryConfigSchema>;

/**
 * Validate and parse memory configuration
 */
export function parseMemoryConfig(config: unknown): MemoryConfig {
  const result = MemoryConfigSchema.safeParse(config);

  if (!result.success) {
    console.warn("[Memory Config] Invalid configuration, using defaults:", result.error.issues);
    // Return defaults with stripPatterns
    return {
      enabled: true,
      workerPort: 37777,
      capture: {
        enabled: true,
        captureToolUse: true,
        captureMessages: false,
        capturePhaseChanges: true,
        skipTools: ["Read", "Glob", "Grep", "Bash"],
        minImportanceThreshold: 4,
      },
      injection: {
        enabled: true,
        budgetTokens: 800,
        format: "timeline",
        priorityTypes: ["decision", "observation", "todo"],
      },
      privacy: {
        enabled: true,
        stripPatterns: [],
        privateTagEnabled: true,
        retentionDays: 90,
        maxMemories: 10000,
      },
      embeddings: {
        provider: "local",
        dimensions: 384,
      },
    };
  }

  // Convert to MemoryConfig type (add stripPatterns to privacy)
  return {
    ...result.data,
    privacy: {
      ...result.data.privacy,
      stripPatterns: [], // Patterns are added programmatically
    },
  } as MemoryConfig;
}

/**
 * Get default memory configuration
 */
export function getDefaultMemoryConfig(): MemoryConfig {
  return parseMemoryConfig({});
}

/**
 * Merge user config with defaults
 */
export function mergeMemoryConfig(
  userConfig: Partial<MemoryConfigInput>
): MemoryConfig {
  return parseMemoryConfig(userConfig);
}

/**
 * Validate configuration without parsing
 */
export function validateMemoryConfig(config: unknown): {
  valid: boolean;
  errors?: string[];
} {
  const result = MemoryConfigSchema.safeParse(config);

  if (result.success) {
    return { valid: true };
  }

  return {
    valid: false,
    errors: result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    ),
  };
}

/**
 * Example configuration for documentation
 */
export const EXAMPLE_MEMORY_CONFIG: MemoryConfigInput = {
  enabled: true,
  workerPort: 37777,
  capture: {
    enabled: true,
    captureToolUse: true,
    captureMessages: false,
    capturePhaseChanges: true,
    skipTools: ["Read", "Glob", "Grep", "Bash"],
    minImportanceThreshold: 4,
  },
  injection: {
    enabled: true,
    budgetTokens: 800,
    format: "timeline",
    priorityTypes: ["decision", "observation", "todo"],
  },
  privacy: {
    enabled: true,
    privateTagEnabled: true,
    retentionDays: 90,
    maxMemories: 10000,
  },
  embeddings: {
    provider: "local",
    model: "Xenova/all-MiniLM-L6-v2",
    dimensions: 384,
  },
};

/**
 * Minimal configuration for quick setup
 */
export const MINIMAL_MEMORY_CONFIG: MemoryConfigInput = {
  enabled: true,
};
