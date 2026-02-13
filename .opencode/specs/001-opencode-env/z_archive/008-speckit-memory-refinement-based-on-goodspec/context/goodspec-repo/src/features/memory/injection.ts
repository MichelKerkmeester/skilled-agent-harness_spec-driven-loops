/**
 * Memory Injection
 * Builds memory context for prompt injection with token budgeting
 * @module features/memory/injection
 */

import type {
  Memory,
  SearchResult,
  InjectionConfig,
  InjectionFormat,
} from "./types.js";
import { MemoryRetrieval } from "./retrieval.js";

/**
 * Default injection configuration
 */
export const DEFAULT_INJECTION_CONFIG: InjectionConfig = {
  enabled: true,
  budgetTokens: 800,
  format: "timeline",
  priorityTypes: ["decision", "observation", "todo"],
};

/**
 * Memory Injector
 * Retrieves relevant memories and formats them for prompt injection
 */
export class MemoryInjector {
  private retrieval: MemoryRetrieval;
  private config: InjectionConfig;

  constructor(retrieval: MemoryRetrieval, config?: Partial<InjectionConfig>) {
    this.retrieval = retrieval;
    this.config = { ...DEFAULT_INJECTION_CONFIG, ...config };
  }

  /**
   * Build memory context for a given query
   */
  async buildContext(query: string): Promise<string> {
    if (!this.config.enabled) {
      return "";
    }

    // Search for relevant memories
    const results = await this.retrieval.search({
      query,
      limit: 20, // Fetch more than we need, then trim by token budget
    });

    if (results.length === 0) {
      return "";
    }

    // Prioritize by type and importance
    const prioritized = this.prioritize(results);

    // Format with token budget
    return this.formatWithBudget(prioritized);
  }

  /**
   * Build context from recent memories (no query-based search)
   */
  buildRecentContext(limit: number = 10): string {
    if (!this.config.enabled) {
      return "";
    }

    const memories = this.retrieval.getRecent(limit, this.config.priorityTypes);

    if (memories.length === 0) {
      return "";
    }

    // Convert to SearchResult format for consistent formatting
    const results: SearchResult[] = memories.map((memory, index) => ({
      memory,
      score: 1 - index * 0.05, // Decreasing score for recency
      matchType: "fts" as const,
    }));

    return this.formatWithBudget(results);
  }

  /**
   * Build context from phase-specific memories
   */
  buildPhaseContext(phase: string, limit: number = 10): string {
    if (!this.config.enabled) {
      return "";
    }

    const memories = this.retrieval.getByPhase(phase, limit);

    if (memories.length === 0) {
      return "";
    }

    const results: SearchResult[] = memories.map((memory, index) => ({
      memory,
      score: 1 - index * 0.05,
      matchType: "fts" as const,
    }));

    return this.formatWithBudget(results);
  }

  /**
   * Prioritize results by type and importance
   */
  private prioritize(results: SearchResult[]): SearchResult[] {
    return results.sort((a, b) => {
      // Priority type bonus
      const aTypeIndex = this.config.priorityTypes.indexOf(a.memory.type);
      const bTypeIndex = this.config.priorityTypes.indexOf(b.memory.type);

      // Lower index = higher priority. -1 means not in priority list
      const aTypePriority = aTypeIndex === -1 ? 100 : aTypeIndex;
      const bTypePriority = bTypeIndex === -1 ? 100 : bTypeIndex;

      // Type priority first
      if (aTypePriority !== bTypePriority) {
        return aTypePriority - bTypePriority;
      }

      // Then by combined score * importance
      const aWeighted = a.score * (a.memory.importance / 10);
      const bWeighted = b.score * (b.memory.importance / 10);

      return bWeighted - aWeighted;
    });
  }

  /**
   * Format memories within token budget
   */
  private formatWithBudget(results: SearchResult[]): string {
    const format = this.config.format;
    const budget = this.config.budgetTokens;

    let lines: string[] = [];
    let tokenCount = 0;

    // Add header
    const header = this.getHeader(format);
    lines.push(header);
    tokenCount += this.estimateTokens(header);

    // Add memories until budget exhausted
    for (const result of results) {
      const formatted = this.formatMemory(result, format);
      const lineTokens = this.estimateTokens(formatted);

      if (tokenCount + lineTokens > budget) {
        break;
      }

      lines.push(formatted);
      tokenCount += lineTokens;
    }

    // If we only have the header, return empty
    if (lines.length <= 1) {
      return "";
    }

    // Add footer
    const footer = this.getFooter(format, results.length, lines.length - 1);
    if (footer) {
      lines.push(footer);
    }

    return lines.join("\n");
  }

  /**
   * Get format-specific header
   */
  private getHeader(format: InjectionFormat): string {
    switch (format) {
      case "timeline":
        return "## Relevant Memories\n";
      case "bullets":
        return "**Relevant Context:**\n";
      case "structured":
        return "<memories>\n";
      default:
        return "## Relevant Memories\n";
    }
  }

  /**
   * Get format-specific footer
   */
  private getFooter(
    format: InjectionFormat,
    total: number,
    shown: number
  ): string | null {
    if (total > shown) {
      switch (format) {
        case "timeline":
        case "bullets":
          return `\n*${total - shown} more memories available. Use memory_search for more.*`;
        case "structured":
          return `</memories>\n<!-- ${total - shown} more memories available -->`;
        default:
          return null;
      }
    }

    if (format === "structured") {
      return "</memories>";
    }

    return null;
  }

  /**
   * Format a single memory entry
   */
  private formatMemory(result: SearchResult, format: InjectionFormat): string {
    const { memory, score } = result;
    const date = new Date(memory.createdAt * 1000).toLocaleDateString();

    switch (format) {
      case "timeline":
        return this.formatTimeline(memory, date, score);
      case "bullets":
        return this.formatBullets(memory, date);
      case "structured":
        return this.formatStructured(memory, date, score);
      default:
        return this.formatTimeline(memory, date, score);
    }
  }

  /**
   * Timeline format (detailed)
   */
  private formatTimeline(memory: Memory, date: string, score: number): string {
    const lines = [
      `### [${memory.type}] ${memory.title}`,
      `*${date} | Importance: ${memory.importance}/10 | Score: ${score.toFixed(2)}*`,
      "",
      memory.content.slice(0, 300) + (memory.content.length > 300 ? "..." : ""),
    ];

    if (memory.facts.length > 0) {
      lines.push("", "**Key facts:**");
      memory.facts.slice(0, 3).forEach((fact) => {
        lines.push(`- ${fact}`);
      });
    }

    if (memory.concepts.length > 0) {
      lines.push("", `**Tags:** ${memory.concepts.slice(0, 5).join(", ")}`);
    }

    lines.push(""); // Blank line between entries

    return lines.join("\n");
  }

  /**
   * Bullet format (compact)
   */
  private formatBullets(memory: Memory, date: string): string {
    const summary = memory.content.slice(0, 150) + (memory.content.length > 150 ? "..." : "");
    return `- **[${memory.type}]** ${memory.title} (${date})\n  ${summary}`;
  }

  /**
   * Structured XML format
   */
  private formatStructured(memory: Memory, date: string, score: number): string {
    const facts = memory.facts.length > 0
      ? `\n  <facts>${memory.facts.slice(0, 5).map(f => `\n    <fact>${f}</fact>`).join("")}\n  </facts>`
      : "";
    
    const concepts = memory.concepts.length > 0
      ? `\n  <concepts>${memory.concepts.slice(0, 5).join(", ")}</concepts>`
      : "";

    return `<memory type="${memory.type}" date="${date}" importance="${memory.importance}" score="${score.toFixed(2)}">
  <title>${memory.title}</title>
  <content>${memory.content.slice(0, 300)}${memory.content.length > 300 ? "..." : ""}</content>${facts}${concepts}
</memory>`;
  }

  /**
   * Estimate token count (rough approximation)
   * Uses ~4 characters per token as a rule of thumb
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<InjectionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): InjectionConfig {
    return { ...this.config };
  }
}
