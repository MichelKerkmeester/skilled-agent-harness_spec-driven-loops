/**
 * Memory Distillation Pipeline
 * Converts raw events into structured memories
 * @module features/memory/distiller
 */

import type {
  RawEvent,
  MemoryInput,
  CaptureConfig,
} from "./types.js";
import {
  shouldCapture,
  estimateImportance,
  sanitizeContent,
  getMemoryTypeForEvent,
  DEFAULT_CAPTURE_CONFIG,
} from "./capture.js";

/**
 * Result of distillation
 */
export interface DistillationResult {
  captured: boolean;
  memory?: MemoryInput;
  reason?: string;
}

/**
 * Memory Distiller - Converts raw events into structured memories
 * 
 * In a full implementation, this would use a sub-agent (LLM) to
 * intelligently extract facts and concepts. For now, we use
 * heuristic-based extraction.
 */
export class MemoryDistiller {
  private config: CaptureConfig;

  constructor(config?: Partial<CaptureConfig>) {
    this.config = { ...DEFAULT_CAPTURE_CONFIG, ...config };
  }

  /**
   * Distill a raw event into a memory
   */
  async distill(event: RawEvent): Promise<DistillationResult> {
    // Check if event should be captured
    if (!shouldCapture(event, this.config)) {
      return { captured: false, reason: "Event filtered by capture config" };
    }

    // Estimate importance
    const importance = estimateImportance(event);
    if (importance < this.config.minImportanceThreshold) {
      return { captured: false, reason: "Below importance threshold" };
    }

    // Distill based on event type
    switch (event.type) {
      case "tool_use":
        return this.distillToolUse(event, importance);

      case "phase_change":
        return this.distillPhaseChange(event, importance);

      case "user_message":
        return this.distillUserMessage(event, importance);

      case "assistant_message":
        return this.distillAssistantMessage(event, importance);

      default:
        return { captured: false, reason: "Unknown event type" };
    }
  }

  /**
   * Distill a tool use event
   */
  private distillToolUse(event: RawEvent, importance: number): DistillationResult {
    const toolName = event.data.tool as string;
    const args = event.data.args as Record<string, unknown>;
    const result = event.data.result as string;

    // Extract title from tool and args
    const title = this.extractToolTitle(toolName, args);
    
    // Build content
    const content = this.buildToolContent(toolName, args, result);
    
    // Extract facts from the result
    const facts = this.extractFactsFromResult(toolName, result);
    
    // Extract concepts from tool name and args
    const concepts = this.extractConceptsFromTool(toolName, args);
    
    // Extract source files if present
    const sourceFiles = this.extractSourceFiles(args, result);

    const memory: MemoryInput = {
      type: getMemoryTypeForEvent(event),
      title: title.slice(0, 100),
      content: sanitizeContent(content),
      facts,
      concepts,
      sourceFiles,
      importance,
      sessionId: event.sessionId,
    };

    return { captured: true, memory };
  }

  /**
   * Distill a phase change event
   */
  private distillPhaseChange(event: RawEvent, importance: number): DistillationResult {
    const from = event.data.from as string | null;
    const to = event.data.to as string;

    const title = `Workflow phase: ${from ?? "start"} -> ${to}`;
    const content = `Transitioned from ${from ?? "initial"} phase to ${to} phase.`;

    const memory: MemoryInput = {
      type: "session_summary",
      title,
      content,
      facts: [`Entered ${to} phase`],
      concepts: ["workflow", "phase", to],
      importance,
      sessionId: event.sessionId,
    };

    return { captured: true, memory };
  }

  /**
   * Distill a user message event
   */
  private distillUserMessage(event: RawEvent, importance: number): DistillationResult {
    const content = event.data.content as string;
    
    // Extract intent from the message
    const title = this.extractIntentTitle(content);
    
    // Extract key concepts
    const concepts = this.extractConceptsFromText(content);

    const memory: MemoryInput = {
      type: "user_prompt",
      title,
      content: sanitizeContent(content),
      concepts,
      importance,
      sessionId: event.sessionId,
    };

    return { captured: true, memory };
  }

  /**
   * Distill an assistant message event
   */
  private distillAssistantMessage(event: RawEvent, importance: number): DistillationResult {
    const content = event.data.content as string;
    
    // Only capture significant assistant messages
    if (content.length < 100) {
      return { captured: false, reason: "Assistant message too short" };
    }

    const title = this.extractIntentTitle(content);
    const concepts = this.extractConceptsFromText(content);
    const facts = this.extractFactsFromText(content);

    const memory: MemoryInput = {
      type: "observation",
      title,
      content: sanitizeContent(content.slice(0, 2000)),
      facts,
      concepts,
      importance,
      sessionId: event.sessionId,
    };

    return { captured: true, memory };
  }

  // ============================================================================
  // Extraction Helpers
  // ============================================================================

  /**
   * Extract a title from tool name and args
   */
  private extractToolTitle(toolName: string, args: Record<string, unknown>): string {
    // Special handling for known tools
    switch (toolName) {
      case "Edit":
      case "mcp_edit":
        return `Edited ${args.filePath ?? args.file ?? "file"}`;
      case "Write":
      case "mcp_write":
        return `Wrote ${args.filePath ?? args.file ?? "file"}`;
      case "Bash":
      case "mcp_bash":
        const cmd = String(args.command ?? args.cmd ?? "").slice(0, 50);
        return `Ran: ${cmd}`;
      case "goop_checkpoint":
        return `Created checkpoint: ${args.id ?? "unnamed"}`;
      case "goop_adl":
        return `ADL: ${args.type ?? "entry"}`;
      default:
        return `Tool: ${toolName}`;
    }
  }

  /**
   * Build content from tool execution
   */
  private buildToolContent(
    toolName: string,
    args: Record<string, unknown>,
    result: string
  ): string {
    const lines = [`Tool: ${toolName}`];
    
    // Add relevant args
    const relevantArgs = Object.entries(args)
      .filter(([key]) => !["content", "newString", "oldString"].includes(key))
      .slice(0, 5);
    
    if (relevantArgs.length > 0) {
      lines.push("Arguments:");
      for (const [key, value] of relevantArgs) {
        lines.push(`  ${key}: ${String(value).slice(0, 100)}`);
      }
    }

    // Add truncated result
    if (result) {
      lines.push(`Result: ${result.slice(0, 500)}${result.length > 500 ? "..." : ""}`);
    }

    return lines.join("\n");
  }

  /**
   * Extract facts from tool result
   */
  private extractFactsFromResult(toolName: string, result: string): string[] {
    const facts: string[] = [];

    // Tool-specific fact extraction
    if (toolName.includes("Edit") || toolName.includes("Write")) {
      if (result.includes("success")) {
        facts.push("File modification successful");
      }
    }

    if (toolName.includes("Bash")) {
      if (result.includes("error") || result.includes("Error")) {
        facts.push("Command encountered an error");
      } else if (result.includes("success") || result.includes("Success")) {
        facts.push("Command completed successfully");
      }
    }

    return facts;
  }

  /**
   * Extract concepts from tool name and args
   */
  private extractConceptsFromTool(toolName: string, args: Record<string, unknown>): string[] {
    const concepts: string[] = [toolName.toLowerCase().replace(/^mcp_/, "")];

    // Add file type concepts
    const filePath = String(args.filePath ?? args.file ?? "");
    if (filePath) {
      const ext = filePath.split(".").pop()?.toLowerCase();
      if (ext) {
        concepts.push(ext);
      }
    }

    return concepts;
  }

  /**
   * Extract source files from args and result
   */
  private extractSourceFiles(args: Record<string, unknown>, result: string): string[] {
    const files: string[] = [];

    // Check args for file paths
    const filePath = args.filePath ?? args.file;
    if (typeof filePath === "string") {
      files.push(filePath);
    }

    // Check result for file paths (basic pattern matching)
    const filePattern = /(?:\/[\w.-]+)+\.\w+/g;
    const matches = result.match(filePattern);
    if (matches) {
      files.push(...matches.slice(0, 5)); // Limit to 5 files
    }

    return [...new Set(files)]; // Deduplicate
  }

  /**
   * Extract intent title from text
   */
  private extractIntentTitle(text: string): string {
    // Get first sentence or first 100 chars
    const firstSentence = text.split(/[.!?\n]/)[0].trim();
    return firstSentence.slice(0, 100) || text.slice(0, 100);
  }

  /**
   * Extract concepts from text content
   */
  private extractConceptsFromText(text: string): string[] {
    const concepts: string[] = [];
    const lowerText = text.toLowerCase();

    // Check for common programming concepts
    const keywords = [
      "function", "class", "component", "api", "database", "test",
      "bug", "fix", "feature", "refactor", "performance", "security",
      "typescript", "javascript", "react", "node", "python",
    ];

    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        concepts.push(keyword);
      }
    }

    return concepts.slice(0, 5); // Limit concepts
  }

  /**
   * Extract facts from text content
   */
  private extractFactsFromText(text: string): string[] {
    const facts: string[] = [];

    // Look for bullet points
    const bulletPattern = /^[\s]*[-*•]\s*(.+)$/gm;
    const bullets = text.match(bulletPattern);
    if (bullets) {
      facts.push(...bullets.slice(0, 5).map(b => b.replace(/^[\s]*[-*•]\s*/, "")));
    }

    return facts;
  }
}
