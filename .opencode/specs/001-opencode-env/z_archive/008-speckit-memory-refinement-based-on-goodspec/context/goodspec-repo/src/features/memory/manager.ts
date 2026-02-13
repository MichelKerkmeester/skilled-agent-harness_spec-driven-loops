/**
 * Memory Service Manager
 * Handles worker lifecycle and provides MemoryManager interface
 * @module features/memory/manager
 */

import { spawn, type Subprocess } from "bun";
import * as fs from "fs";
import * as path from "path";
import { MemoryClient } from "./client.js";
import type { MemoryManager, MemoryConfig } from "./types.js";
import type { MemorySystemConfig } from "../../core/types.js";

/**
 * Memory service manager that handles worker lifecycle
 */
export class MemoryServiceManager {
  private worker: Subprocess | null = null;
  private client: MemoryClient;
  private projectRoot: string;
  private config: MemoryConfig;
  private memoryDir: string;
  private pidFile: string;
  private workerPath: string;

  constructor(
    projectRoot: string,
    config?: MemorySystemConfig | Partial<MemoryConfig>
  ) {
    this.projectRoot = projectRoot;
    
    // Default capture config
    const defaultCapture = {
      enabled: true,
      captureToolUse: true,
      captureMessages: false,
      capturePhaseChanges: true,
      skipTools: ["Read", "Glob", "Grep", "Bash"],
      minImportanceThreshold: 4,
    };
    
    // Default injection config
    const defaultInjection = {
      enabled: true,
      budgetTokens: 800,
      format: "timeline" as const,
      priorityTypes: ["decision", "observation", "todo"] as const,
    };
    
    // Default privacy config
    const defaultPrivacy = {
      enabled: true,
      stripPatterns: [] as RegExp[],
      privateTagEnabled: true,
      retentionDays: 90,
      maxMemories: 10000,
    };
    
    // Default embeddings config
    const defaultEmbeddings = {
      provider: "local" as const,
      model: "Xenova/all-MiniLM-L6-v2",
      dimensions: 384,
    };
    
    this.config = {
      enabled: config?.enabled ?? true,
      workerPort: config?.workerPort ?? 37777,
      capture: {
        ...defaultCapture,
        ...config?.capture,
        skipTools: config?.capture?.skipTools ?? defaultCapture.skipTools,
      },
      injection: {
        ...defaultInjection,
        ...config?.injection,
        format: (config?.injection?.format ?? defaultInjection.format) as "timeline" | "bullets" | "structured",
        priorityTypes: config?.injection?.priorityTypes ?? [...defaultInjection.priorityTypes],
      },
      privacy: {
        ...defaultPrivacy,
        ...config?.privacy,
        stripPatterns: config?.privacy?.stripPatterns 
          ? config.privacy.stripPatterns.map((p: string | RegExp) => typeof p === "string" ? new RegExp(p, "gi") : p)
          : defaultPrivacy.stripPatterns,
      },
      embeddings: {
        ...defaultEmbeddings,
        ...config?.embeddings,
        provider: (config?.embeddings?.provider ?? defaultEmbeddings.provider) as "local" | "openai" | "ollama",
      },
    };

    this.client = new MemoryClient(this.config.workerPort);
    this.memoryDir = path.join(projectRoot, ".goopspec", "memory");
    this.pidFile = path.join(this.memoryDir, "worker.pid");
    
    // Worker entry point path - relative to this file
    this.workerPath = path.join(
      path.dirname(new URL(import.meta.url).pathname),
      "worker",
      "index.ts"
    );
  }

  /**
   * Check if memory system is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Ensure memory directory exists
   */
  private ensureDirectory(): void {
    if (!fs.existsSync(this.memoryDir)) {
      fs.mkdirSync(this.memoryDir, { recursive: true });
    }
  }

  /**
   * Check if worker is already running by PID file
   */
  private async isWorkerRunningByPid(): Promise<boolean> {
    if (!fs.existsSync(this.pidFile)) {
      return false;
    }

    try {
      const pid = parseInt(fs.readFileSync(this.pidFile, "utf-8").trim());
      
      // Check if process exists by sending signal 0
      process.kill(pid, 0);
      return true;
    } catch {
      // Process doesn't exist, clean up stale PID file
      try {
        fs.unlinkSync(this.pidFile);
      } catch {
        // Ignore cleanup errors
      }
      return false;
    }
  }

  /**
   * Ensure the memory worker is running
   */
  async ensureRunning(): Promise<void> {
    if (!this.config.enabled) {
      console.log("[Memory] Memory system is disabled");
      return;
    }

    // Check if already running via health check
    if (await this.client.healthCheck()) {
      console.log("[Memory] Worker already running");
      return;
    }

    // Check if running by PID file
    if (await this.isWorkerRunningByPid()) {
      // Process exists but not responding yet, wait a bit
      console.log("[Memory] Worker process exists, waiting for ready...");
      await this.waitForReady(5000);
      return;
    }

    // Start new worker
    await this.startWorker();
  }

  /**
   * Start the memory worker process
   */
  private async startWorker(): Promise<void> {
    this.ensureDirectory();

    console.log(`[Memory] Starting worker on port ${this.config.workerPort}...`);
    console.log(`[Memory] Worker path: ${this.workerPath}`);

    this.worker = spawn(["bun", "run", this.workerPath], {
      env: {
        ...process.env,
        PROJECT_ROOT: this.projectRoot,
        MEMORY_PORT: String(this.config.workerPort),
      },
      stdout: "inherit",
      stderr: "inherit",
    });

    // Wait for worker to be ready
    const ready = await this.waitForReady(15000);
    if (!ready) {
      throw new Error("Memory worker failed to start within timeout");
    }

    console.log("[Memory] Worker started successfully");
  }

  /**
   * Wait for worker to become ready
   */
  private async waitForReady(timeoutMs: number): Promise<boolean> {
    const startTime = Date.now();
    const pollInterval = 200;

    while (Date.now() - startTime < timeoutMs) {
      if (await this.client.healthCheck()) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    return false;
  }

  /**
   * Get the memory client (MemoryManager interface)
   */
  getClient(): MemoryManager {
    return this.client;
  }

  /**
   * Get the raw client for additional operations
   */
  getRawClient(): MemoryClient {
    return this.client;
  }

  /**
   * Gracefully shutdown the worker
   */
  async shutdown(): Promise<void> {
    console.log("[Memory] Shutting down worker...");

    try {
      await this.client.shutdown();
    } catch {
      // Ignore errors - worker may already be down
    }

    // Kill the subprocess if we started it
    if (this.worker) {
      this.worker.kill();
      this.worker = null;
    }
  }

  /**
   * Get worker status
   */
  async getStatus(): Promise<{
    running: boolean;
    status?: string;
    memories?: number;
    vectors?: number;
  }> {
    try {
      const health = await this.client.getStatus();
      const stats = await this.client.getStats();

      return {
        running: true,
        status: health.status,
        memories: stats.memories,
        vectors: stats.vectors,
      };
    } catch {
      return { running: false };
    }
  }

  /**
   * Get configuration
   */
  getConfig(): MemoryConfig {
    return this.config;
  }
}
