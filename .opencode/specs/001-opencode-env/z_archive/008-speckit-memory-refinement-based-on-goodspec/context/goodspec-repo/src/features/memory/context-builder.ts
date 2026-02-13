/**
 * Memory Context Builder
 * Builds memory context for agent prompt injection
 * @module features/memory/context-builder
 */

import type { MemoryManager, Memory, MemoryType, SearchResult } from "../../core/types.js";

export interface ContextBuilderConfig {
  budgetTokens: number;
  format: "timeline" | "bullets" | "structured";
  priorityTypes: MemoryType[];
  includeDecisions: boolean;
  includeRecentActivity: boolean;
}

const DEFAULT_CONFIG: ContextBuilderConfig = {
  budgetTokens: 800,
  format: "structured",
  priorityTypes: ["decision", "observation", "todo"],
  includeDecisions: true,
  includeRecentActivity: true,
};

/**
 * Memory Context Builder
 * Retrieves relevant memories and formats them for prompt injection
 */
export class MemoryContextBuilder {
  private memoryManager: MemoryManager;
  private config: ContextBuilderConfig;

  constructor(memoryManager: MemoryManager, config?: Partial<ContextBuilderConfig>) {
    this.memoryManager = memoryManager;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Build memory context for a given query/task
   */
  async buildContext(query: string): Promise<string> {
    const sections: string[] = [];
    let tokenCount = 0;

    // Add header
    const header = this.getHeader();
    sections.push(header);
    tokenCount += this.estimateTokens(header);

    // Get relevant memories via semantic search
    try {
      const results = await this.memoryManager.search({
        query,
        limit: 15,
        types: this.config.priorityTypes,
      });

      if (results.length > 0) {
        const memoriesSection = this.formatResults(results, this.config.budgetTokens - tokenCount - 100);
        if (memoriesSection) {
          sections.push(memoriesSection);
          tokenCount += this.estimateTokens(memoriesSection);
        }
      }
    } catch {
      // Memory search failed - continue without it
    }

    // Add recent decisions if budget allows
    if (this.config.includeDecisions && tokenCount < this.config.budgetTokens - 200) {
      try {
        const decisions = await this.memoryManager.getRecent(5, ["decision"]);
        if (decisions.length > 0) {
          const decisionsSection = this.formatDecisions(decisions, this.config.budgetTokens - tokenCount - 50);
          if (decisionsSection) {
            sections.push(decisionsSection);
            tokenCount += this.estimateTokens(decisionsSection);
          }
        }
      } catch {
        // Failed to get decisions - continue
      }
    }

    // Add footer
    sections.push(this.getFooter());

    // Return empty if only header/footer
    if (sections.length <= 2) {
      return "";
    }

    return sections.join("\n");
  }

  /**
   * Build context from recent memories (no query)
   */
  async buildRecentContext(limit: number = 10): Promise<string> {
    try {
      const memories = await this.memoryManager.getRecent(limit, this.config.priorityTypes);
      
      if (memories.length === 0) {
        return "";
      }

      const sections: string[] = [this.getHeader()];
      
      // Convert to SearchResult format
      const results: SearchResult[] = memories.map((memory, index) => ({
        memory,
        score: 1 - index * 0.05,
        matchType: "fts" as const,
      }));

      const memoriesSection = this.formatResults(results, this.config.budgetTokens - 100);
      if (memoriesSection) {
        sections.push(memoriesSection);
      }

      sections.push(this.getFooter());

      return sections.length > 2 ? sections.join("\n") : "";
    } catch {
      return "";
    }
  }

  /**
   * Build phase-specific context
   */
  async buildPhaseContext(phase: string): Promise<string> {
    try {
      // Search for memories related to this phase
      const results = await this.memoryManager.search({
        query: `${phase} phase workflow`,
        limit: 10,
      });

      if (results.length === 0) {
        return "";
      }

      const sections: string[] = [
        `<memory-context phase="${phase}">`,
      ];

      const memoriesSection = this.formatResults(results, this.config.budgetTokens - 100);
      if (memoriesSection) {
        sections.push(memoriesSection);
      }

      sections.push("</memory-context>");

      return sections.length > 2 ? sections.join("\n") : "";
    } catch {
      return "";
    }
  }

  /**
   * Format search results within token budget
   */
  private formatResults(results: SearchResult[], budget: number): string | null {
    const lines: string[] = [];
    let tokenCount = 0;

    for (const result of results) {
      const formatted = this.formatMemory(result.memory, result.score);
      const lineTokens = this.estimateTokens(formatted);

      if (tokenCount + lineTokens > budget) {
        break;
      }

      lines.push(formatted);
      tokenCount += lineTokens;
    }

    return lines.length > 0 ? lines.join("\n") : null;
  }

  /**
   * Format decisions section
   */
  private formatDecisions(decisions: Memory[], budget: number): string | null {
    if (decisions.length === 0) return null;

    const lines: string[] = ["<recent-decisions>"];
    let tokenCount = this.estimateTokens(lines[0]);

    for (const decision of decisions) {
      const date = new Date(decision.createdAt * 1000).toLocaleDateString();
      const line = `  <decision date="${date}">${decision.title}</decision>`;
      const lineTokens = this.estimateTokens(line);

      if (tokenCount + lineTokens > budget) {
        break;
      }

      lines.push(line);
      tokenCount += lineTokens;
    }

    lines.push("</recent-decisions>");
    return lines.length > 2 ? lines.join("\n") : null;
  }

  /**
   * Format a single memory
   */
  private formatMemory(memory: Memory, score: number): string {
    const date = new Date(memory.createdAt * 1000).toLocaleDateString();

    switch (this.config.format) {
      case "structured":
        return this.formatStructured(memory, date, score);
      case "timeline":
        return this.formatTimeline(memory, date, score);
      case "bullets":
        return this.formatBullets(memory, date);
      default:
        return this.formatStructured(memory, date, score);
    }
  }

  private formatStructured(memory: Memory, date: string, score: number): string {
    const facts = memory.facts.length > 0
      ? ` facts="${memory.facts.slice(0, 3).join("; ")}"`
      : "";
    const content = memory.content.slice(0, 200) + (memory.content.length > 200 ? "..." : "");
    
    return `<memory type="${memory.type}" date="${date}" importance="${memory.importance}" score="${score.toFixed(2)}"${facts}>
  <title>${memory.title}</title>
  <content>${content}</content>
</memory>`;
  }

  private formatTimeline(memory: Memory, date: string, score: number): string {
    const content = memory.content.slice(0, 150) + (memory.content.length > 150 ? "..." : "");
    return `### [${memory.type}] ${memory.title}\n*${date} | Score: ${score.toFixed(2)}*\n${content}\n`;
  }

  private formatBullets(memory: Memory, date: string): string {
    const content = memory.content.slice(0, 100) + (memory.content.length > 100 ? "..." : "");
    return `- **[${memory.type}]** ${memory.title} (${date}): ${content}`;
  }

  private getHeader(): string {
    switch (this.config.format) {
      case "structured":
        return "<memory-context>";
      case "timeline":
        return "## Relevant Memories\n";
      case "bullets":
        return "**Context from Memory:**\n";
      default:
        return "<memory-context>";
    }
  }

  private getFooter(): string {
    switch (this.config.format) {
      case "structured":
        return "</memory-context>";
      case "timeline":
      case "bullets":
        return "\n*Use memory_search for more context.*";
      default:
        return "</memory-context>";
    }
  }

  /**
   * Estimate token count (rough approximation: ~4 chars per token)
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<ContextBuilderConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

/**
 * Create a memory context builder
 */
export function createMemoryContextBuilder(
  memoryManager: MemoryManager,
  config?: Partial<ContextBuilderConfig>
): MemoryContextBuilder {
  return new MemoryContextBuilder(memoryManager, config);
}
