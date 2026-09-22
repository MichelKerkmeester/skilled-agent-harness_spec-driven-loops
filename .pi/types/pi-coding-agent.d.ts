// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Coding Agent Ambient Types
// ───────────────────────────────────────────────────────────────────

// The two Pi spec-gate extensions are type-checked outside a Pi installation, where
// `@earendil-works/pi-coding-agent` is not resolvable from the repository. This declares
// only the surface those extensions use, so the type gate catches a mistake in our own
// code while a running Pi still supplies the real types at load time. Extend it when the
// pair starts using more of the API, rather than widening it to `any` up front.

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
   * Per-invocation context. `hasUI` is the gate that decides whether the pair may ask a
   * question at all: a headless session has no dialog to answer it.
   */
  export type ExtensionContext = {
    cwd: string;
    hasUI: boolean;
    ui: ExtensionUi;
    sessionManager: ExtensionSessionManager;
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
  };
}
