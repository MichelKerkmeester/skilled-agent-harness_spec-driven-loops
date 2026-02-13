/**
 * Continuation Enforcer Hook
 * Prevents agents from ending conversations with incomplete todos
 * 
 * Based on oh-my-opencode's todo-continuation-enforcer pattern:
 * - Uses event hook for session.idle detection
 * - Uses input.client (plugin client with in-process fetch) for API calls
 * - The plugin client works because it uses Server.App().fetch() internally
 * 
 * @module hooks/continuation-enforcer
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type { PluginInput } from "@opencode-ai/plugin";
import type { PluginContext } from "../core/types.js";
import { log, logEvent } from "../shared/logger.js";
import {
  createAuthenticatedClient,
  injectPromptWithFallback,
  showToast,
  type OpenCodeClient,
} from "../shared/opencode-client.js";

// OpenCode stores todos in this directory
const TODO_STORAGE = join(homedir(), ".local", "share", "opencode", "storage", "todo");

export interface ContinuationConfig {
  enabled: boolean;
  maxPrompts: number;
  countdownSeconds: number;
  skipAgents: string[];
}

const DEFAULT_CONFIG: ContinuationConfig = {
  enabled: true,
  maxPrompts: 3,
  countdownSeconds: 2,
  skipAgents: ["compaction"],
};

interface SessionState {
  countdownTimer?: ReturnType<typeof setTimeout>;
  countdownInterval?: ReturnType<typeof setInterval>;
  countdownStartedAt?: number;
  isRecovering?: boolean;
  promptCount: number;
}

const COUNTDOWN_GRACE_PERIOD_MS = 500;

interface Todo {
  content: string;
  status: string;
  priority: string;
  id: string;
}

function getTodoFilePath(sessionID: string): string {
  return join(TODO_STORAGE, `${sessionID}.json`);
}

/**
 * Get incomplete todo count
 */
function getIncompleteCount(todos: Todo[]): number {
  return todos.filter(t => t.status !== "completed" && t.status !== "cancelled").length;
}

/**
 * Read todos directly from OpenCode's storage (fallback if API fails)
 */
function readTodosFromDisk(sessionID: string): Todo[] {
  const todoFile = getTodoFilePath(sessionID);
  
  if (!existsSync(todoFile)) {
    return [];
  }
  
  try {
    const content = readFileSync(todoFile, "utf-8");
    return JSON.parse(content) as Todo[];
  } catch {
    return [];
  }
}

function describeTodoResponse(response: unknown): Record<string, unknown> {
  if (Array.isArray(response)) {
    return { type: "array", length: response.length };
  }
  if (!response || typeof response !== "object") {
    return { type: typeof response };
  }
  const record = response as Record<string, unknown>;
  const summary: Record<string, unknown> = { type: "object", keys: Object.keys(record) };
  const data = record.data;
  if (Array.isArray(data)) {
    summary.dataLength = data.length;
  } else if (data && typeof data === "object") {
    summary.dataKeys = Object.keys(data as Record<string, unknown>);
  }
  if (Array.isArray(record.todos)) {
    summary.todosLength = record.todos.length;
  }
  if (Array.isArray(record.items)) {
    summary.itemsLength = record.items.length;
  }
  return summary;
}

function extractTodosFromResponse(response: unknown): Todo[] {
  if (Array.isArray(response)) return response as Todo[];
  if (!response || typeof response !== "object") return [];
  const record = response as Record<string, unknown>;

  if (Array.isArray(record.data)) return record.data as Todo[];

  const data = record.data;
  if (data && typeof data === "object") {
    const dataRecord = data as Record<string, unknown>;
    if (Array.isArray(dataRecord.todos)) return dataRecord.todos as Todo[];
    if (Array.isArray(dataRecord.items)) return dataRecord.items as Todo[];
    if (Array.isArray(dataRecord.data)) return dataRecord.data as Todo[];
  }

  if (Array.isArray(record.todos)) return record.todos as Todo[];
  if (Array.isArray(record.items)) return record.items as Todo[];

  return [];
}

function getSessionIDFromProps(props?: Record<string, unknown>): string | undefined {
  if (!props) return undefined;
  const direct = props.sessionID ?? props.sessionId ?? props.session_id;
  if (typeof direct === "string") return direct;
  const info = props.info as Record<string, unknown> | undefined;
  const infoId = info?.sessionID ?? info?.sessionId ?? info?.id;
  if (typeof infoId === "string") return infoId;
  return undefined;
}

const TOAST_DURATION_MS = 900;

/**
 * Create the continuation enforcer
 * 
 * Returns an event handler that listens for session.idle and injects
 * continuation prompts when incomplete todos exist.
 */
export function createContinuationEnforcer(
  _ctx: PluginContext,
  input: PluginInput,
  config: Partial<ContinuationConfig> = {}
) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const sessions = new Map<string, SessionState>();
  
  // Use authenticated client if OPENCODE_SERVER_PASSWORD is set
  // The plugin's in-process fetch still goes through basicAuth middleware
  const client: OpenCodeClient = createAuthenticatedClient(input);
  const directory = input.directory;

  function getState(sessionID: string): SessionState {
    let state = sessions.get(sessionID);
    if (!state) {
      state = { promptCount: 0 };
      sessions.set(sessionID, state);
    }
    return state;
  }

  function cancelCountdown(sessionID: string): void {
    const state = sessions.get(sessionID);
    if (!state) return;
    
    if (state.countdownTimer) {
      clearTimeout(state.countdownTimer);
      state.countdownTimer = undefined;
    }
    if (state.countdownInterval) {
      clearInterval(state.countdownInterval);
      state.countdownInterval = undefined;
    }
    state.countdownStartedAt = undefined;
  }

  function cleanup(sessionID: string): void {
    cancelCountdown(sessionID);
    sessions.delete(sessionID);
  }

  async function showCountdownToast(seconds: number, incompleteCount: number): Promise<void> {
    log("[continuation-enforcer] Showing toast", { seconds, incompleteCount });
    const taskWord = incompleteCount === 1 ? "task" : "tasks";
    await showToast(
      client,
      "GoopSpec",
      `${incompleteCount} ${taskWord} pending - auto-continuing in ${seconds}s`,
      "warning",
      TOAST_DURATION_MS
    );
  }

  async function fetchTodos(sessionID: string): Promise<Todo[]> {
    try {
      const response = await client.session.todo({ path: { id: sessionID }, query: { directory } });
      // Check for error response (openapi-fetch returns {error, request, response} on failure)
      const responseObj = response as Record<string, unknown>;
      if (responseObj.error) {
        log("[continuation-enforcer] Todo API error response, falling back to disk", {
          sessionID,
          error: JSON.stringify(responseObj.error).slice(0, 500),
          status: (responseObj.response as { status?: number } | undefined)?.status,
        });
        // Fall back to disk on API error
        const todos = readTodosFromDisk(sessionID);
        log("[continuation-enforcer] Read todos from disk (API error fallback)", { sessionID, count: todos.length });
        return todos;
      }
      
      const todos = extractTodosFromResponse(response);
      if (todos.length === 0) {
        log("[continuation-enforcer] Todo API returned empty, trying disk", {
          sessionID,
          summary: describeTodoResponse(response),
        });
        // Also try disk if API returned empty (might be a parsing issue)
        const diskTodos = readTodosFromDisk(sessionID);
        if (diskTodos.length > 0) {
          log("[continuation-enforcer] Found todos on disk", { sessionID, count: diskTodos.length });
          return diskTodos;
        }
      } else {
        log("[continuation-enforcer] Fetched todos via API", { sessionID, count: todos.length });
      }
      return todos;
    } catch (err) {
      log("[continuation-enforcer] API todo fetch failed, using disk", { sessionID, error: String(err) });
      const todoFile = getTodoFilePath(sessionID);
      log("[continuation-enforcer] Todo disk fallback", {
        sessionID,
        path: todoFile,
        exists: existsSync(todoFile),
      });
      const todos = readTodosFromDisk(sessionID);
      log("[continuation-enforcer] Read todos from disk", { sessionID, count: todos.length });
      return todos;
    }
  }

  async function injectContinuation(sessionID: string, _incompleteCount: number, total: number): Promise<void> {
    const state = getState(sessionID);

    if (state.isRecovering) {
      log("[continuation-enforcer] Skipped: session recovering", { sessionID });
      return;
    }

    if (state.promptCount >= cfg.maxPrompts) {
      log("[continuation-enforcer] Max prompts reached", { sessionID, promptCount: state.promptCount });
      await showToast(
        client,
        "GoopSpec",
        `Pausing after ${cfg.maxPrompts} auto-continues. Type to resume workflow.`,
        "info",
        3000
      );
      state.promptCount = 0;
      return;
    }

    const todos = await fetchTodos(sessionID);

    const freshIncompleteCount = getIncompleteCount(todos);
    if (freshIncompleteCount === 0) {
      log("[continuation-enforcer] All todos complete", { sessionID });
      state.promptCount = 0;
      return;
    }

    state.promptCount++;

    log("[continuation-enforcer] Injecting continuation", { sessionID, attempt: state.promptCount });

    const prompt = `[GoopSpec] You have ${freshIncompleteCount} of ${total} tasks incomplete. Continue executing the current wave - check todoread for pending items and proceed without asking.`;

    // Use session.prompt() with TUI fallback
    // Session API may return 401 in certain contexts, TUI endpoints are more reliable
    const result = await injectPromptWithFallback(client, sessionID, prompt, directory);
    
    if (result.success) {
      log("[continuation-enforcer] Injection successful", { sessionID, method: result.method });
    } else {
      log("[continuation-enforcer] Injection failed (both methods)", { sessionID });
    }
  }

  function startCountdown(sessionID: string, incompleteCount: number, total: number): void {
    const state = getState(sessionID);
    cancelCountdown(sessionID);

    let secondsRemaining = cfg.countdownSeconds;
    state.countdownStartedAt = Date.now();
    
    // Show initial toast
    showCountdownToast(secondsRemaining, incompleteCount);

    // Update countdown every second
    state.countdownInterval = setInterval(() => {
      secondsRemaining--;
      if (secondsRemaining > 0) {
        showCountdownToast(secondsRemaining, incompleteCount);
      }
    }, 1000);

    // Inject continuation after countdown
    state.countdownTimer = setTimeout(() => {
      cancelCountdown(sessionID);
      injectContinuation(sessionID, incompleteCount, total);
    }, cfg.countdownSeconds * 1000);

    log("[continuation-enforcer] Countdown started", { sessionID, seconds: cfg.countdownSeconds });
  }

  // Event handler
  const handler = async (eventInput: { event: { type: string; properties?: unknown } }): Promise<void> => {
    const { event } = eventInput;
    
    if (!cfg.enabled) return;

    const props = event.properties as Record<string, unknown> | undefined;

    // Handle session.idle - this is when the agent stops
    if (event.type === "session.idle") {
      const sessionID = getSessionIDFromProps(props);
      logEvent("continuation-enforcer:session.idle", { sessionID });
      if (!sessionID) return;

      log("[continuation-enforcer] session.idle", { sessionID });

      const state = getState(sessionID);
      if (state.isRecovering) {
        log("[continuation-enforcer] Skipped: recovering", { sessionID });
        return;
      }

      const todos = await fetchTodos(sessionID);

      if (!todos || todos.length === 0) {
        log("[continuation-enforcer] No todos", { sessionID });
        return;
      }

      const incompleteCount = getIncompleteCount(todos);
      log("[continuation-enforcer] Incomplete todos", {
        sessionID,
        incomplete: incompleteCount,
        total: todos.length,
      });
      logEvent("continuation-enforcer:incomplete-count", { sessionID, incomplete: incompleteCount, total: todos.length });
      
      if (incompleteCount === 0) {
        log("[continuation-enforcer] All todos complete", { sessionID });
        state.promptCount = 0;
        return;
      }

      logEvent("continuation-enforcer:starting-countdown", { sessionID, incomplete: incompleteCount });
      startCountdown(sessionID, incompleteCount, todos.length);
      return;
    }

    // Cancel countdown on user messages
    if (event.type === "message.updated" || event.type === "message.created") {
      const info = props?.info as Record<string, unknown> | undefined;
      const role = info?.role as string | undefined;
      const sessionID = info?.sessionID as string | undefined;
      
      if (sessionID && role === "user") {
        const state = sessions.get(sessionID);
        // Grace period: ignore user messages right after countdown starts
        // This prevents the countdown from being cancelled by events triggered
        // by the toast or other internal activity
        if (state?.countdownStartedAt) {
          const elapsed = Date.now() - state.countdownStartedAt;
          if (elapsed < COUNTDOWN_GRACE_PERIOD_MS) {
            log("[continuation-enforcer] Ignoring user message in grace period", { sessionID, elapsed });
            return;
          }
        }
        log("[continuation-enforcer] User message, cancelling countdown", { sessionID });
        cancelCountdown(sessionID);
      }
      // Also cancel on assistant messages - means injection worked or user got response
      if (sessionID && role === "assistant") {
        cancelCountdown(sessionID);
      }
      return;
    }

    // Cancel countdown on tool execution
    if (event.type === "tool.execute.before" || event.type === "tool.execute.after") {
      const sessionID = props?.sessionID as string | undefined;
      if (sessionID) {
        log("[continuation-enforcer] Tool execution, cancelling countdown", { sessionID });
        cancelCountdown(sessionID);
      }
      return;
    }

    // Cleanup on session deletion
    if (event.type === "session.deleted") {
      const sessionInfo = props?.info as { id?: string } | undefined;
      if (sessionInfo?.id) {
        cleanup(sessionInfo.id);
        log("[continuation-enforcer] Cleaned up", { sessionID: sessionInfo.id });
      }
      return;
    }
  };

  return {
    handler,
    markRecovering: (sessionID: string) => {
      const state = getState(sessionID);
      state.isRecovering = true;
      cancelCountdown(sessionID);
    },
    markRecoveryComplete: (sessionID: string) => {
      const state = sessions.get(sessionID);
      if (state) state.isRecovering = false;
    },
    cancelAllCountdowns: () => {
      for (const sessionID of sessions.keys()) {
        cancelCountdown(sessionID);
      }
    },
  };
}

// Legacy exports for backward compatibility
export function updateTodoCount(_sessionId: string, _incompleteCount: number): void {
  // No longer needed - we fetch todos directly via API
}

export function isContinuationActive(_sessionId: string): boolean {
  return false;
}

export function getPromptCount(_sessionId: string): number {
  return 0;
}

export function resetContinuation(_sessionId: string): void {
  // No-op
}
