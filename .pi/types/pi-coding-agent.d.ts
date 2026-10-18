// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Coding Agent Ambient Types
// ───────────────────────────────────────────────────────────────────

// The Pi extensions are type-checked outside a Pi installation, where
// `@earendil-works/pi-coding-agent` is not resolvable from the repository. This declares
// only the surface those extensions use, so the type gate catches a mistake in our own
// code while a running Pi still supplies the real types at load time. Extend it when an
// extension starts using more of the API, rather than widening it to `any` up front.

declare module "@earendil-works/pi-coding-agent" {
  /** The dialog surface; a session without a UI leaves it absent at call time. */
  export type ExtensionUi = {
    select(
      title: string,
      options: readonly string[],
      opts?: { timeout?: number },
    ): Promise<string | undefined>;
    input(
      title: string,
      placeholder?: string,
      opts?: { timeout?: number },
    ): Promise<string | undefined>;
    notify(message: string, level?: "info" | "warning" | "error"): void;
  };

  export type ExtensionSessionManager = {
    getSessionFile(): string | undefined;
    getSessionId(): string;
  };

  /**
   * Per-invocation context. `hasUI` is the gate that decides whether an extension may ask
   * a question at all: a headless session has no dialog to answer it.
   */
  export type ExtensionContext = {
    cwd: string;
    hasUI: boolean;
    ui: ExtensionUi;
    sessionManager: ExtensionSessionManager;
    /** Get current context usage for the active model. */
    getContextUsage(): ContextUsage | undefined;
  };

  /** The user's own turn, after sibling input transforms have run. */
  export type InputEvent = {
    text: string;
  };

  /** A tool call the harness is about to run, with its raw arguments. */
  export type ToolCallEvent = {
    toolName: string;
    input: Record<string, unknown>;
  };

  /** Context-window accounting for the active model. */
  export type ContextUsage = {
    /** Estimated context tokens, or null when unknown (e.g. right after compaction). */
    tokens: number | null;
    contextWindow: number;
    /** Context usage as a percentage of the window, or null when tokens is unknown. */
    percent: number | null;
  };

  /** Content blocks inside user and custom message content. */
  export type TextContent = {
    type: "text";
    text: string;
    textSignature?: string;
  };
  export type ImageContent = {
    type: "image";
    data: string;
    mimeType: string;
  };

  /** Provider-reported token usage carried on an assistant message. */
  export type Usage = {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    /** Subset of `cacheWrite` written with 1h retention. Only Anthropic reports this split. */
    cacheWrite1h?: number;
    /** Reasoning tokens when the provider reports them; a subset of `output`. */
    reasoning?: number;
    totalTokens: number;
    cost: {
      input: number;
      output: number;
      cacheRead: number;
      cacheWrite: number;
      total: number;
    };
  };

  /** An extension-injected message; sendMessage() takes a Pick of it. */
  export type CustomMessage<T = unknown> = {
    role: "custom";
    customType: string;
    content: string | (TextContent | ImageContent)[];
    display: boolean;
    details?: T;
    timestamp: number;
  };

  /** The assistant message; the only union member carrying `usage`. */
  export type AssistantMessage = {
    role: "assistant";
    usage: Usage;
  };

  /** A transcript message; `role` discriminates the union. */
  export type AgentMessage =
    | { role: "system" }
    | { role: "user" }
    | AssistantMessage
    | { role: "toolResult" }
    | { role: "bashExecution" }
    | CustomMessage
    | { role: "branchSummary" }
    | { role: "compactionSummary" };

  /** Fired when a message ends. */
  export type MessageEndEvent = {
    type: "message_end";
    message: AgentMessage;
  };
  export type MessageEndEventResult = {
    /** Replace the finalized message. The replacement must keep the original message role. */
    message?: AgentMessage;
  };

  /** Fired when an agent loop ends. */
  export type AgentEndEvent = {
    type: "agent_end";
    messages: AgentMessage[];
  };

  /** A run started by a submitted prompt, RPC prompt, or `pi.sendUserMessage()`. */
  export type BeforeAgentStartUserEvent = {
    type: "before_agent_start";
    messageType: "user";
    /** The current system prompt, rendered from systemPromptOptions and earlier handler changes. */
    readonly systemPrompt: string;
    /** The raw user prompt text (after expansion). */
    prompt: string;
  };
  /** A run started by `pi.sendMessage(..., { triggerTurn: true })` while idle. */
  export type BeforeAgentStartCustomEvent = {
    type: "before_agent_start";
    messageType: "custom";
    readonly systemPrompt: string;
    /** The custom message that starts the run. */
    message: CustomMessage;
  };
  export type BeforeAgentStartEvent =
    | BeforeAgentStartUserEvent
    | BeforeAgentStartCustomEvent;
  export type BeforeAgentStartEventResult = {
    message?: Pick<
      CustomMessage,
      "customType" | "content" | "display" | "details"
    >;
    /** Replace the complete system prompt for this turn. Later handlers observe this exact override. */
    systemPrompt?: string;
  };

  /** Handler function type for events; the result type is per-event. */
  export type ExtensionHandler<E, R = undefined> = (
    event: E,
    ctx: ExtensionContext,
  ) => Promise<R | void> | R | void;

  /** The registration surface: one handler per event the extension cares about. */
  export type ExtensionAPI = {
    on(
      event: "input",
      handler: (event: InputEvent, ctx: ExtensionContext) => unknown,
    ): void;
    on(
      event: "tool_call",
      handler: (event: ToolCallEvent, ctx: ExtensionContext) => unknown,
    ): void;
    on(
      event: "before_agent_start",
      handler: ExtensionHandler<
        BeforeAgentStartEvent,
        BeforeAgentStartEventResult
      >,
    ): () => void;
    on(
      event: "agent_end",
      handler: ExtensionHandler<AgentEndEvent>,
    ): () => void;
    on(
      event: "message_end",
      handler: ExtensionHandler<MessageEndEvent, MessageEndEventResult>,
    ): () => void;
    /** Send a custom message to the session. */
    sendMessage<T = unknown>(
      message: Pick<
        CustomMessage<T>,
        "customType" | "content" | "display" | "details"
      >,
      options?: {
        triggerTurn?: boolean;
        deliverAs?: "steer" | "followUp" | "nextTurn";
      },
    ): void;
  };
}
