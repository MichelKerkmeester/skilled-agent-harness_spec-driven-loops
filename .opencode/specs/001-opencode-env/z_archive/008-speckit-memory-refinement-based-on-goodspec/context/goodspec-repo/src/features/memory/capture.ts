/**
 * Auto-Capture Configuration and Triggers
 * Controls what events are automatically captured to memory
 * @module features/memory/capture
 */

import type { RawEvent, CaptureConfig, MemoryType } from "./types.js";

/**
 * Default capture configuration
 */
export const DEFAULT_CAPTURE_CONFIG: CaptureConfig = {
  enabled: true,
  captureToolUse: true,
  captureMessages: false, // Too noisy by default
  capturePhaseChanges: true,
  skipTools: [
    // Read-only tools - no state changes worth remembering
    "Read",
    "Glob",
    "Grep",
    "mcp_read",
    "mcp_glob",
    "mcp_grep",
    // Too verbose tools
    "Bash",
    "mcp_bash",
    // Memory tools themselves (avoid recursion)
    "memory_save",
    "memory_search",
    "memory_note",
    "memory_decision",
    "memory_forget",
  ],
  minImportanceThreshold: 4,
};

/**
 * Patterns that indicate sensitive content that should not be stored
 */
export const SENSITIVE_PATTERNS = [
  /api[_-]?key\s*[:=]\s*["']?[\w-]+["']?/gi,
  /password\s*[:=]\s*["']?[^"'\s]+["']?/gi,
  /token\s*[:=]\s*["']?[\w.-]+["']?/gi,
  /secret\s*[:=]\s*["']?[\w.-]+["']?/gi,
  /bearer\s+[\w.-]+/gi,
  /authorization\s*:\s*["']?[\w.-]+["']?/gi,
  /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/gi,
  /ssh-(?:rsa|ed25519|dss)\s+[A-Za-z0-9+/=]+/gi,
];

/**
 * Tool categories for importance assignment
 */
export const TOOL_IMPORTANCE: Record<string, number> = {
  // High importance - state-changing tools
  Write: 8,
  mcp_write: 8,
  Edit: 7,
  mcp_edit: 7,
  
  // Medium importance - decision tools
  memory_decision: 8,
  goop_adl: 7,
  goop_checkpoint: 6,
  goop_spec: 6,
  
  // Lower importance - informational tools
  goop_status: 3,
  goop_skill: 4,
};

/**
 * Determine if an event should be captured
 */
export function shouldCapture(
  event: RawEvent,
  config: CaptureConfig
): boolean {
  if (!config.enabled) return false;

  switch (event.type) {
    case "tool_use":
      if (!config.captureToolUse) return false;
      const toolName = event.data.tool as string;
      if (config.skipTools.includes(toolName)) return false;
      return true;

    case "user_message":
    case "assistant_message":
      return config.captureMessages;

    case "phase_change":
      return config.capturePhaseChanges;

    default:
      return false;
  }
}

/**
 * Estimate importance for an event
 */
export function estimateImportance(event: RawEvent): number {
  switch (event.type) {
    case "tool_use":
      const toolName = event.data.tool as string;
      return TOOL_IMPORTANCE[toolName] ?? 5;

    case "phase_change":
      return 7; // Phase changes are generally important

    case "user_message":
      // User messages that are questions or commands are important
      const message = event.data.content as string;
      if (message.includes("?") || message.startsWith("/")) {
        return 6;
      }
      return 4;

    case "assistant_message":
      return 3; // Assistant messages are usually less important on their own

    default:
      return 5;
  }
}

/**
 * Sanitize content by removing sensitive data
 */
export function sanitizeContent(content: string): string {
  let sanitized = content;

  // Remove sensitive patterns
  for (const pattern of SENSITIVE_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[REDACTED]");
  }

  // Remove <private> blocks
  sanitized = sanitized.replace(/<private>[\s\S]*?<\/private>/gi, "[PRIVATE]");

  return sanitized;
}

/**
 * Extract memory type from event
 */
export function getMemoryTypeForEvent(event: RawEvent): MemoryType {
  switch (event.type) {
    case "tool_use":
      const toolName = event.data.tool as string;
      if (toolName.includes("decision")) return "decision";
      if (toolName.includes("checkpoint") || toolName.includes("spec")) return "observation";
      return "observation";

    case "phase_change":
      return "session_summary";

    case "user_message":
      return "user_prompt";

    case "assistant_message":
      return "observation";

    default:
      return "observation";
  }
}

/**
 * Build a capture event from tool execution
 */
export function buildToolCaptureEvent(
  toolName: string,
  args: Record<string, unknown>,
  result: string,
  sessionId: string
): RawEvent {
  return {
    type: "tool_use",
    timestamp: Date.now(),
    sessionId,
    data: {
      tool: toolName,
      args,
      result: result.slice(0, 2000), // Truncate long results
    },
  };
}

/**
 * Build a capture event from phase change
 */
export function buildPhaseCaptureEvent(
  fromPhase: string | null,
  toPhase: string,
  sessionId: string
): RawEvent {
  return {
    type: "phase_change",
    timestamp: Date.now(),
    sessionId,
    data: {
      from: fromPhase,
      to: toPhase,
    },
  };
}

/**
 * Build a capture event from user message
 */
export function buildMessageCaptureEvent(
  content: string,
  role: "user" | "assistant",
  sessionId: string
): RawEvent {
  return {
    type: role === "user" ? "user_message" : "assistant_message",
    timestamp: Date.now(),
    sessionId,
    data: {
      content: sanitizeContent(content.slice(0, 5000)), // Truncate and sanitize
      role,
    },
  };
}
