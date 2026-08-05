import { describe, expect, it } from "vitest";

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { inspectDispatch } from "../lib/dispatch-audit.mjs";
import promptAdvisor from "../../../skills/system-skill-advisor/hooks/pi/prompt-advisor";
import dispatchPreflightLint, {
  captureRawPiUserInput,
  resetRawPiUserInputCapture,
  shouldDenyPiDispatch,
} from "./dispatch-preflight-lint";

type Handler = (event: any, ctx: any) => unknown;

type FactoryInvocation = {
  result: any;
  transformedTexts: string[];
};

type FakeContext = {
  cwd: string;
  sessionManager: {
    getSessionId: () => string;
  };
};

function denied(command: string, userText: string, options: Record<string, unknown> = {}): boolean {
  const inspection = inspectDispatch(command);
  return shouldDenyPiDispatch({
    runtime: options.runtime ?? "pi",
    toolName: options.toolName ?? "bash",
    command,
    dispatchSkill: inspection.kind === "direct" ? inspection.executor : null,
    inspectedExecutor: inspection.kind === "direct" ? inspection.executor : null,
    inspectionKind: inspection.kind,
    userText,
  });
}

function makeExtensionApi(): {
  api: ExtensionAPI;
  handlers: Map<string, Handler[]>;
} {
  const handlers = new Map<string, Handler[]>();
  const api = {
    on(event: string, handler: Handler) {
      const registered = handlers.get(event) ?? [];
      registered.push(handler);
      handlers.set(event, registered);
    },
  } as unknown as ExtensionAPI;
  return { api, handlers };
}

function context(sessionId = "session-a"): FakeContext {
  return {
    cwd: process.cwd(),
    sessionManager: { getSessionId: () => sessionId },
  };
}

function registerInjectedInput(api: ExtensionAPI, suffix = "Advisor: injected cli-devin example") {
  api.on("input", ((event: any, ctx: FakeContext) => {
    captureRawPiUserInput(event.text, ctx.sessionManager.getSessionId());
    return {
      action: "transform",
      text: `${event.text}\n\n${suffix}\n\n- Pi subagent dispatch [DEFAULT]: use cli-devin.`,
    };
  }) as any);
}

async function invokeFactory(
  rawText: string,
  command: string,
  options: { transformFirst?: boolean; inputSession?: string; toolSession?: string } = {},
): Promise<FactoryInvocation> {
  resetRawPiUserInputCapture();
  const { api, handlers } = makeExtensionApi();
  if (options.transformFirst) {
    registerInjectedInput(api);
    dispatchPreflightLint(api);
  } else {
    dispatchPreflightLint(api);
    registerInjectedInput(api);
  }

  const transformedTexts: string[] = [];
  const inputHandlers = handlers.get("input") ?? [];
  const inputContext = context(options.inputSession ?? "session-a");
  let inputEvent: any = { type: "input", source: "interactive", text: rawText };
  for (const handler of inputHandlers) {
    const output = await handler(inputEvent, inputContext);
    const transformed = output as { action?: unknown; text?: unknown };
    if (transformed?.action === "transform" && typeof transformed.text === "string") {
      transformedTexts.push(transformed.text);
      inputEvent = { ...inputEvent, text: transformed.text };
    }
  }

  const toolHandler = handlers.get("tool_call")?.[0];
  if (!toolHandler) throw new Error("tool_call handler was not registered");
  const result = await toolHandler({
    type: "tool_call",
    toolCallId: "call-1",
    toolName: "bash",
    input: { command },
  }, context(options.toolSession ?? options.inputSession ?? "session-a"));
  return { result, transformedTexts };
}

describe("Pi dispatch deny matrix", () => {
  it.each([
    ["devin -p shape", 'devin -p "task"', "run the task", true],
    ["cursor-agent -p shape", 'cursor-agent -p "task"', "run the task", true],
    ["matching cli mode override", 'devin -p "task"', "dispatch via cli-devin", false],
    ["deep-loop executor", 'opencode run "task"', "/deep:review --executor cli-opencode", false],
    ["deep-loop executor mismatch", 'devin -p "task"', "/deep:review --executor cli-opencode", true],
    ["deep-loop executor equals", 'devin -p "task"', "/deep:review --executor cli-devin", false],
    ["cli-pi self-recursion", 'pi -p "task"', "use cli-pi", true],
    ["negated mode mention", 'devin -p "task"', "do not use cli-devin", true],
    ["quoted mode mention", 'devin -p "task"', 'use "cli-devin"', true],
    ["history mode mention is not current authorization", 'devin -p "task"', '[user] dispatch via cli-devin [assistant] done [user] run the task', true],
    ["history deep-loop mention is not current authorization", 'devin -p "task"', '[user] /deep:review --executor cli-devin [assistant] done [user] run the task', true],
    ["spec-gate question is not authorization", 'devin -p "task"', 'run the task\n\nSPEC FOLDER QUESTION: this turn looks like it will mutate a file. Before any Write/Edit, pick one:\nA) Use an existing spec folder', true],
    ["injected capsule is not an override", 'devin -p "task"', 'run the task\n\nAdvisor: live; use cli-devin 0.95/0.20 pass.\n\n- Pi subagent dispatch [DEFAULT]: use the native pi-subagents plugin unless the user names one (e.g. use cli-devin).', true],
    ["printf payload is not a dispatch", 'printf "devin -p task"', "run the task", false],
    ["ambiguous variable command", "$CLI -p task", "use cli-devin", true],
    ["subagent tool", 'devin -p "task"', "run the task", false],
    ["non-dispatch bash", "npm test", "run the tests", false],
    ["non-Pi runtime", 'devin -p "task"', "run the task", false],
  ])("%s", (name, command, userText, expected) => {
    const options = name === "subagent tool"
      ? { toolName: "subagent" }
      : name === "non-Pi runtime"
        ? { runtime: "claude" }
        : {};
    expect(denied(command, userText, options)).toBe(expected);
  });
});

describe("registered Pi extension boundary", () => {
  it("registers input and tool_call callbacks on the default factory", () => {
    const { api, handlers } = makeExtensionApi();
    dispatchPreflightLint(api);
    expect(handlers.get("input")).toHaveLength(1);
    expect(handlers.get("tool_call")).toHaveLength(1);
  });

  it.each([false, true])("keeps raw authorization stable across transform order: %s", async (transformFirst) => {
    const { result, transformedTexts } = await invokeFactory("run the task", 'devin -p "task"', { transformFirst });
    expect(transformedTexts[0]).toContain("Advisor: injected cli-devin example");
    expect(transformedTexts[0]).toContain("- Pi subagent dispatch [DEFAULT]: use cli-devin.");
    expect(result?.block).toBe(true);
  });

  it("allows a positive raw user override for the inspected executor", async () => {
    const { result } = await invokeFactory("dispatch via cli-devin", 'devin -p "task"');
    expect(result).toBeUndefined();
  });

  it.each([
    ["negated mention", 'devin -p "task"', "do not use cli-devin"],
    ["quoted mention", 'devin -p "task"', 'use "cli-devin"'],
    ["variable executor", "$CLI -p task", "dispatch via cli-devin"],
    ["alias executor", "alias d=devin; d -p task", "dispatch via cli-devin"],
  ])("denies %s through the registered tool_call boundary", async (_name, command, rawText) => {
    const { result } = await invokeFactory(rawText, command);
    expect(result?.block).toBe(true);
  });

  it("denies self-dispatch before an override can apply", async () => {
    const { result } = await invokeFactory("use cli-pi", 'pi --offline -p "task"');
    expect(result?.block).toBe(true);
    expect(result?.reason).toMatch(/self|never|cli-pi/i);
    expect(result?.reason).not.toMatch(/explicitly name/);
  });

  it("denies an executor mismatch and a mismatched deep-loop executor", async () => {
    const { result: directMismatch } = await invokeFactory("dispatch via cli-cursor", 'devin -p "task"');
    const { result: deepMismatch } = await invokeFactory("/deep:review --executor cli-opencode", 'devin -p "task"');
    expect(directMismatch?.block).toBe(true);
    expect(deepMismatch?.block).toBe(true);
  });

  it("denies a missing or mismatched session capture", async () => {
    const { result } = await invokeFactory("dispatch via cli-devin", 'devin -p "task"', {
      inputSession: "session-a",
      toolSession: "session-b",
    });
    expect(result?.block).toBe(true);
  });

  it("replaces the raw capture for each new turn", async () => {
    resetRawPiUserInputCapture();
    const { api, handlers } = makeExtensionApi();
    dispatchPreflightLint(api);
    const inputHandler = handlers.get("input")?.[0];
    const toolHandler = handlers.get("tool_call")?.[0];
    if (!inputHandler || !toolHandler) throw new Error("factory handlers missing");
    const ctx = context("session-a");
    await inputHandler({ type: "input", source: "interactive", text: "dispatch via cli-devin" }, ctx);
    await inputHandler({ type: "input", source: "interactive", text: "run the task" }, ctx);
    const result = await toolHandler({
      type: "tool_call",
      toolCallId: "call-2",
      toolName: "bash",
      input: { command: 'devin -p "task"' },
    }, ctx);
    expect(result?.block).toBe(true);
  });

  it("captures before the real advisor transform when the advisor is registered first", async () => {
    resetRawPiUserInputCapture();
    const { api, handlers } = makeExtensionApi();
    promptAdvisor(api);
    dispatchPreflightLint(api);
    const ctx = context();
    const transformedTexts: string[] = [];
    let inputEvent: any = { type: "input", source: "interactive", text: "run the task" };
    for (const handler of handlers.get("input") ?? []) {
      const output = await handler(inputEvent, ctx);
      const transformed = output as { action?: unknown; text?: unknown };
      if (transformed?.action === "transform" && typeof transformed.text === "string") {
        transformedTexts.push(transformed.text);
        inputEvent = { ...inputEvent, text: transformed.text };
      }
    }
    expect(transformedTexts.at(-1)).toContain("- Pi subagent dispatch [DEFAULT]:");
    const toolHandler = handlers.get("tool_call")?.[0];
    if (!toolHandler) throw new Error("factory handler missing");
    const result = await toolHandler({
      type: "tool_call",
      toolCallId: "call-advisor",
      toolName: "bash",
      input: { command: 'devin -p "task"' },
    }, ctx);
    expect(result?.block).toBe(true);
  });

  it("does not evaluate native subagent tools", async () => {
    resetRawPiUserInputCapture();
    const { api, handlers } = makeExtensionApi();
    dispatchPreflightLint(api);
    const toolHandler = handlers.get("tool_call")?.[0];
    if (!toolHandler) throw new Error("factory handler missing");
    const result = await toolHandler({
      type: "tool_call",
      toolCallId: "call-3",
      toolName: "subagent",
      input: { command: 'devin -p "task"' },
    }, context());
    expect(result).toBeUndefined();
  });
});
