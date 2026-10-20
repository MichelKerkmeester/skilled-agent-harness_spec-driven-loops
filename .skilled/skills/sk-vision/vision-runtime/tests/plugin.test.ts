// ───────────────────────────────────────────────────────────────────
// MODULE: Vision Plugin Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Part } from "@opencode-ai/sdk";
import type { VisionCommandPluginInput } from "../src/opencode/command.js";
import plugin, { createSetup, matchVisionTemplate, readVisionTemplate, toV1FileUrl } from "../src/plugin.js";

type SetupContext = Parameters<ReturnType<typeof createSetup>>[0];
type PromptHookCallback = Parameters<SetupContext["session"]["hook"]>[1];
type PromptHookInput = Parameters<PromptHookCallback>[0];
type ContextMessages = Awaited<ReturnType<SetupContext["session"]["context"]>>;
type SessionMessages = Awaited<ReturnType<VisionCommandPluginInput["client"]["session"]["messages"]>>;
type CommandEditor = Parameters<Parameters<SetupContext["command"]["transform"]>[0]>[0];
type CommandDefinition = Parameters<CommandEditor["add"]>[0];

const TEMPLATE = "TEMPLATE $ARGUMENTS BETWEEN $ARGUMENTS END";

function temporaryDirectory(): string {
  return mkdtempSync(join(tmpdir(), "sk-vision-"));
}

function makeContext(
  context: ContextMessages = [],
  get?: NonNullable<SetupContext["session"]["get"]>,
): {
  ctx: SetupContext;
  registeredCommands: string[];
  command: () => CommandDefinition | undefined;
  disposed: string[];
  hook: () => PromptHookCallback | undefined;
} {
  const registeredCommands: string[] = [];
  const disposed: string[] = [];
  let promptHook: PromptHookCallback | undefined;
  let commandDefinition: CommandDefinition | undefined;

  const ctx: SetupContext = {
    location: { directory: "test-project" },
    command: {
      transform: async (callback) => {
        callback({
          add: (definition) => {
            registeredCommands.push(definition.name);
            commandDefinition = definition;
          },
        });
        return {
          dispose: async () => {
            disposed.push("command");
          },
        };
      },
    },
    session: {
      context: async () => context,
      ...(get ? { get } : {}),
      prompt: async () => ({}),
      hook: async (name, callback) => {
        promptHook = callback;
        return {
          dispose: async () => {
            disposed.push(name);
          },
        };
      },
    },
  };

  return { ctx, registeredCommands, command: () => commandDefinition, disposed, hook: () => promptHook };
}

describe("v2 attachment URL mapping", () => {
  it("wraps bare base64 data in a MIME data URL", () => {
    expect(toV1FileUrl({ mime: "image/png", data: "aGVsbG8=" })).toBe(
      "data:image/png;base64,aGVsbG8=",
    );
  });

  it("preserves an attachment value that is already a data URL", () => {
    const dataUrl = "data:image/jpeg;base64,already-encoded";

    expect(toV1FileUrl({ mime: "image/png", data: dataUrl })).toBe(dataUrl);
  });
});

describe("matchVisionTemplate", () => {
  it("returns the question when both slots hold the same text", () => {
    expect(matchVisionTemplate(TEMPLATE, "TEMPLATE what is this BETWEEN what is this END")).toBe(
      "what is this",
    );
  });

  it("returns an empty string when both slots are empty", () => {
    expect(matchVisionTemplate(TEMPLATE, "TEMPLATE  BETWEEN  END")).toBe("");
  });

  it("returns a question containing $1, a newline and backticks exactly", () => {
    const question = "what does $1 mean?\nand `code`?";
    expect(matchVisionTemplate(TEMPLATE, `TEMPLATE ${question} BETWEEN ${question} END`)).toBe(
      question,
    );
  });

  it("returns null when the prompt has text outside the template", () => {
    expect(matchVisionTemplate(TEMPLATE, "prefix TEMPLATE q BETWEEN q END")).toBeNull();
    expect(matchVisionTemplate(TEMPLATE, "TEMPLATE q BETWEEN q END suffix")).toBeNull();
  });

  it("returns null when the slots hold different text", () => {
    expect(matchVisionTemplate(TEMPLATE, "TEMPLATE one BETWEEN two END")).toBeNull();
  });

  it("returns null when the template has no argument slots", () => {
    expect(matchVisionTemplate("plain template", "plain template")).toBeNull();
  });
});

describe("readVisionTemplate", () => {
  it("returns the shipped command body without its frontmatter", () => {
    const directory = temporaryDirectory();
    mkdirSync(join(directory, ".opencode", "commands"), { recursive: true });
    writeFileSync(
      join(directory, ".opencode", "commands", "vision.md"),
      readFileSync(new URL("../../../../commands/vision.md", import.meta.url), "utf8"),
    );

    const template = readVisionTemplate(directory) ?? "";

    expect(template.startsWith("# /vision")).toBe(true);
    expect(template).not.toContain("argument-hint");
    expect(template).toContain("$ARGUMENTS");
  });

  it("returns null when the project has no vision command", () => {
    expect(readVisionTemplate(temporaryDirectory())).toBeNull();
  });
});

describe("v2 setup prompt hook", () => {
  it("appends the handler's text to a prompt that matches the template", async () => {
    const calls: Array<{ command: string; sessionID: string; arguments?: string }> = [];
    const fake = makeContext();
    const setup = createSetup({
      handle: async (_pluginInput, input, output) => {
        calls.push(input);
        output.parts.push({
          type: "text",
          text: "<SK-VISION COMMAND>\nfake analysis\n</SK-VISION COMMAND>",
        } as Part);
      },
      readTemplate: () => TEMPLATE,
    });

    const dispose = await setup(fake.ctx);
    const input: PromptHookInput = {
      sessionID: "ses_1",
      messageID: "msg_1",
      prompt: { text: "TEMPLATE what is this BETWEEN what is this END" },
      delivery: "queue",
    };

    expect(fake.hook()).toBeDefined();
    await fake.hook()?.(input);

    expect(calls).toEqual([{ command: "vision", sessionID: "ses_1", arguments: "what is this" }]);
    expect(input.prompt.text).toBe(
      "TEMPLATE what is this BETWEEN what is this END\n\n<SK-VISION COMMAND>\nfake analysis\n</SK-VISION COMMAND>",
    );
    expect(fake.registeredCommands).toEqual(["vision"]);

    await dispose();
    expect(fake.disposed).toEqual(["prompt", "command"]);
  });

  it("leaves a prompt that does not match the template unchanged", async () => {
    const calls: unknown[] = [];
    const fake = makeContext();
    const setup = createSetup({
      handle: async (_pluginInput, input) => {
        calls.push(input);
      },
      readTemplate: () => TEMPLATE,
    });
    await setup(fake.ctx);

    const input: PromptHookInput = {
      sessionID: "ses_1",
      messageID: "msg_1",
      prompt: { text: "a plain chat message" },
      delivery: "queue",
    };

    expect(fake.hook()).toBeDefined();
    await fake.hook()?.(input);

    expect(input.prompt.text).toBe("a plain chat message");
    expect(calls).toHaveLength(0);
  });

  it("passes a data: image from the prompt as the last message with mime image/png", async () => {
    const responses: SessionMessages[] = [];
    const fake = makeContext([
      { type: "user", files: [{ data: "AAAA", mime: "image/png", name: "earlier.png" }] },
    ]);
    const setup = createSetup({
      handle: async (pluginInput, input, output) => {
        responses.push(
          await pluginInput.client.session.messages({ path: { id: input.sessionID } }),
        );
        output.parts.push({ type: "text", text: "ok" } as Part);
      },
      readTemplate: () => TEMPLATE,
    });
    await setup(fake.ctx);

    const input: PromptHookInput = {
      sessionID: "ses_1",
      messageID: "msg_1",
      prompt: {
        text: "TEMPLATE read this BETWEEN read this END",
        files: [{ uri: "data:image/png;base64,AAAA", name: "shot.png" }],
      },
      delivery: "queue",
    };
    await fake.hook()?.(input);

    const data = responses[0]?.data ?? [];
    expect(data).toHaveLength(2);
    expect(data[data.length - 1]?.parts).toEqual([
      {
        type: "file",
        mime: "image/png",
        filename: "shot.png",
        url: "data:image/png;base64,AAAA",
      } as Part,
    ]);
  });

  it("maps a non-data file uri to a mime by extension and to an empty mime otherwise", async () => {
    const responses: SessionMessages[] = [];
    const fake = makeContext();
    const setup = createSetup({
      handle: async (pluginInput, input, output) => {
        responses.push(
          await pluginInput.client.session.messages({ path: { id: input.sessionID } }),
        );
        output.parts.push({ type: "text", text: "ok" } as Part);
      },
      readTemplate: () => TEMPLATE,
    });
    await setup(fake.ctx);

    const input: PromptHookInput = {
      sessionID: "ses_1",
      messageID: "msg_1",
      prompt: {
        text: "TEMPLATE check BETWEEN check END",
        files: [
          { uri: "/tmp/scan.jpeg", name: "scan.jpeg" },
          { uri: "/tmp/notes.txt", name: "notes.txt" },
        ],
      },
      delivery: "queue",
    };
    await fake.hook()?.(input);

    const data = responses[0]?.data ?? [];
    expect(data[data.length - 1]?.parts).toEqual([
      { type: "file", mime: "image/jpeg", filename: "scan.jpeg", url: "/tmp/scan.jpeg" } as Part,
      { type: "file", mime: "", filename: "notes.txt", url: "/tmp/notes.txt" } as Part,
    ]);
  });

  it("falls back to the file uri for the mime when the name has no known extension", async () => {
    const responses: SessionMessages[] = [];
    const fake = makeContext();
    const setup = createSetup({
      handle: async (pluginInput, input, output) => {
        responses.push(
          await pluginInput.client.session.messages({ path: { id: input.sessionID } }),
        );
        output.parts.push({ type: "text", text: "ok" } as Part);
      },
      readTemplate: () => TEMPLATE,
    });
    await setup(fake.ctx);

    const input: PromptHookInput = {
      sessionID: "ses_1",
      messageID: "msg_1",
      prompt: {
        text: "TEMPLATE check BETWEEN check END",
        files: [{ uri: "/tmp/shot.png" }, { uri: "file:///tmp/a.jpg?x=1" }],
      },
      delivery: "queue",
    };
    await fake.hook()?.(input);

    const data = responses[0]?.data ?? [];
    expect(data[data.length - 1]?.parts).toMatchObject([
      { type: "file", mime: "image/png", url: "/tmp/shot.png" },
      { type: "file", mime: "image/jpeg", url: "file:///tmp/a.jpg?x=1" },
    ]);
  });

  it("leaves the prompt unchanged when the handler throws", async () => {
    const fake = makeContext();
    const setup = createSetup({
      handle: async () => {
        throw new Error("runtime unavailable");
      },
      readTemplate: () => TEMPLATE,
    });
    await setup(fake.ctx);

    const input: PromptHookInput = {
      sessionID: "ses_1",
      messageID: "msg_1",
      prompt: { text: "TEMPLATE boom BETWEEN boom END" },
      delivery: "queue",
    };

    expect(fake.hook()).toBeDefined();
    await fake.hook()?.(input);

    expect(input.prompt.text).toBe("TEMPLATE boom BETWEEN boom END");
  });

  it("resolves and leaves the prompt unchanged when the handler rejects with null and debug is on", async () => {
    const previousDebug = process.env.SK_VISION_DEBUG;
    process.env.SK_VISION_DEBUG = "1";
    try {
      const fake = makeContext();
      const setup = createSetup({
        handle: async () => {
          throw null;
        },
        readTemplate: () => TEMPLATE,
      });
      await setup(fake.ctx);

      const input: PromptHookInput = {
        sessionID: "ses_1",
        messageID: "msg_1",
        prompt: { text: "TEMPLATE boom BETWEEN boom END" },
        delivery: "queue",
      };

      expect(fake.hook()).toBeDefined();
      await expect(fake.hook()?.(input)).resolves.toBeUndefined();

      expect(input.prompt.text).toBe("TEMPLATE boom BETWEEN boom END");
    } finally {
      if (previousDebug === undefined) delete process.env.SK_VISION_DEBUG;
      else process.env.SK_VISION_DEBUG = previousDebug;
    }
  });

  it("registers no prompt hook when the project has no template", async () => {
    const fake = makeContext();
    const dispose = await createSetup({
      handle: async () => {},
      readTemplate: () => null,
    })(fake.ctx);

    expect(fake.hook()).toBeUndefined();
    expect(fake.registeredCommands).toEqual(["vision"]);

    await dispose();
    expect(fake.disposed).toEqual(["command"]);
  });
});

describe("v2 automatic image inspection", () => {
  type AutoInspectFactory = NonNullable<
    Parameters<typeof createSetup>[0]["createAutoInspect"]
  >;
  type AutoInspectInstance = NonNullable<ReturnType<AutoInspectFactory>>;
  type EvidenceImages = Parameters<AutoInspectInstance["evidence"]>[0];

  function makeFakeAutoInspect(evidence: () => Promise<string | null>): {
    create: AutoInspectFactory;
    calls: Array<{ images: EvidenceImages; guaranteed: boolean }>;
    disposeCount: () => number;
  } {
    const calls: Array<{ images: EvidenceImages; guaranteed: boolean }> = [];
    let disposed = 0;
    const create: AutoInspectFactory = () => ({
      evidence: async (images, guaranteed) => {
        calls.push({ images, guaranteed });
        return evidence();
      },
      dispose: async () => {
        disposed += 1;
      },
    });
    return { create, calls, disposeCount: () => disposed };
  }

  it("guarantees evidence for a text-only model and appends it after a blank line", async () => {
    const fake = makeContext([], async () => ({
      model: { id: "deepseek-v4.1-flash", providerID: "llmgateway" },
    }));
    const auto = makeFakeAutoInspect(async () => "VISION EVIDENCE");
    const dispose = await createSetup({
      handle: async () => {},
      readTemplate: () => null,
      createAutoInspect: auto.create,
    })(fake.ctx);

    const input: PromptHookInput = {
      sessionID: "ses_1",
      messageID: "msg_1",
      prompt: {
        text: "what is in this screenshot?",
        files: [{ uri: "data:image/png;base64,AAAA", name: "shot.png" }],
      },
      delivery: "queue",
    };

    expect(fake.hook()).toBeDefined();
    await fake.hook()?.(input);

    expect(auto.calls).toHaveLength(1);
    expect(auto.calls[0]?.guaranteed).toBe(true);
    expect(auto.calls[0]?.images).toHaveLength(1);
    expect(auto.calls[0]?.images[0]?.mime).toBe("image/png");
    expect(input.prompt.text).toBe("what is in this screenshot?\n\nVISION EVIDENCE");

    await dispose();
    expect(auto.disposeCount()).toBe(1);
  });

  it("skips inspection when the prompt has no image file", async () => {
    const fake = makeContext();
    const auto = makeFakeAutoInspect(async () => "VISION EVIDENCE");
    await createSetup({
      handle: async () => {},
      readTemplate: () => null,
      createAutoInspect: auto.create,
    })(fake.ctx);

    const input: PromptHookInput = {
      sessionID: "ses_1",
      messageID: "msg_1",
      prompt: {
        text: "read these notes",
        files: [{ uri: "file:///tmp/notes.txt", name: "notes.txt" }],
      },
      delivery: "queue",
    };

    expect(fake.hook()).toBeDefined();
    await fake.hook()?.(input);

    expect(auto.calls).toHaveLength(0);
    expect(input.prompt.text).toBe("read these notes");
  });

  it("leaves a template prompt to the command path without inspecting", async () => {
    const handled: string[] = [];
    const fake = makeContext();
    const auto = makeFakeAutoInspect(async () => "VISION EVIDENCE");
    await createSetup({
      handle: async (_pluginInput, input) => {
        handled.push(input.command);
      },
      readTemplate: () => TEMPLATE,
      createAutoInspect: auto.create,
    })(fake.ctx);

    const input: PromptHookInput = {
      sessionID: "ses_1",
      messageID: "msg_1",
      prompt: {
        text: "TEMPLATE what is this BETWEEN what is this END",
        files: [{ uri: "data:image/png;base64,AAAA", name: "shot.png" }],
      },
      delivery: "queue",
    };

    await fake.hook()?.(input);

    expect(handled).toEqual(["vision"]);
    expect(auto.calls).toHaveLength(0);
  });

  it("fails open when evidence rejects", async () => {
    const fake = makeContext([], async () => ({
      model: { id: "deepseek-v4.1-flash", providerID: "llmgateway" },
    }));
    const auto = makeFakeAutoInspect(async () => {
      throw new Error("runtime unavailable");
    });
    await createSetup({
      handle: async () => {},
      readTemplate: () => null,
      createAutoInspect: auto.create,
    })(fake.ctx);

    const input: PromptHookInput = {
      sessionID: "ses_1",
      messageID: "msg_1",
      prompt: {
        text: "what is in this screenshot?",
        files: [{ uri: "data:image/png;base64,AAAA", name: "shot.png" }],
      },
      delivery: "queue",
    };

    await expect(fake.hook()?.(input)).resolves.toBeUndefined();

    expect(auto.calls).toHaveLength(1);
    expect(input.prompt.text).toBe("what is in this screenshot?");
  });
});

describe("v2 command execute", () => {
  it("hands the prompt's data: image to the handler as the last message when no template exists", async () => {
    const responses: SessionMessages[] = [];
    const fake = makeContext();
    await createSetup({
      handle: async (pluginInput, input, output) => {
        responses.push(
          await pluginInput.client.session.messages({ path: { id: input.sessionID } }),
        );
        output.parts.push({ type: "text", text: "ok" } as Part);
      },
      readTemplate: () => null,
    })(fake.ctx);

    expect(fake.command()).toBeDefined();
    await fake.command()?.execute({
      sessionID: "ses_1",
      prompt: {
        text: "read this",
        files: [{ uri: "data:image/png;base64,AAAA", name: "shot.png" }],
      },
      delivery: "queue",
    });

    const data = responses[0]?.data ?? [];
    expect(data).toHaveLength(1);
    expect(data[data.length - 1]?.parts).toEqual([
      {
        type: "file",
        mime: "image/png",
        filename: "shot.png",
        url: "data:image/png;base64,AAAA",
      } as Part,
    ]);
  });
});

describe("v2 tool registration", () => {
  type AutoInspectFactory = NonNullable<Parameters<typeof createSetup>[0]["createAutoInspect"]>;
  type ToolTransform = NonNullable<SetupContext["tool"]>["transform"];
  type ToolEditor = Parameters<Parameters<ToolTransform>[0]>[0];
  type ToolDefinition = Parameters<ToolEditor["add"]>[0];

  function withToolEditor(ctx: SetupContext): { ctx: SetupContext; added: string[]; disposed: string[] } {
    const added: string[] = [];
    const disposed: string[] = [];
    return {
      ctx: {
        ...ctx,
        tool: {
          transform: async (callback) => {
            callback({
              add: (definition: ToolDefinition) => {
                added.push(definition.name);
              },
            });
            return {
              dispose: async () => {
                disposed.push("tool");
              },
            };
          },
        },
      },
      added,
      disposed,
    };
  }

  const fakeTool = (name: string): ToolDefinition => ({
    name,
    description: `${name} tool`,
    input: {},
    execute: async () => ({ content: name }),
  });

  it("adds every inspection tool through the v2 tool editor and removes them on dispose", async () => {
    const fake = withToolEditor(makeContext().ctx);
    const create: AutoInspectFactory = () => ({
      evidence: async () => null,
      tools: [fakeTool("sk_vision_status"), fakeTool("sk_vision_ocr")],
      dispose: async () => {},
    });
    const dispose = await createSetup({
      handle: async () => {},
      readTemplate: () => null,
      createAutoInspect: create,
    })(fake.ctx);

    expect(fake.added).toEqual(["sk_vision_status", "sk_vision_ocr"]);
    await dispose();
    expect(fake.disposed).toEqual(["tool"]);
  });

  it("keeps the command and skips inspection on a host without session.hook", async () => {
    const made = makeContext();
    const ctx = {
      ...made.ctx,
      session: {
        context: made.ctx.session.context,
        prompt: made.ctx.session.prompt,
      },
    } as unknown as SetupContext;
    let factoryCalls = 0;
    const dispose = await createSetup({
      handle: async () => {},
      readTemplate: () => TEMPLATE,
      createAutoInspect: () => {
        factoryCalls += 1;
        return {
          evidence: async () => null,
          tools: [fakeTool("sk_vision_status")],
          dispose: async () => {},
        };
      },
    })(ctx);

    expect(made.registeredCommands).toEqual(["vision"]);
    expect(factoryCalls).toBe(0);
    await expect(dispose()).resolves.toBeUndefined();
    expect(made.disposed).toEqual(["command"]);
  });

  it("adds no tools when automatic inspection is off", async () => {
    const saved = process.env.SK_VISION_AUTOINSPECT;
    delete process.env.SK_VISION_AUTOINSPECT;
    const fake = withToolEditor(makeContext().ctx);
    try {
      const dispose = await plugin.setup(fake.ctx);
      expect(fake.added).toEqual([]);
      await dispose();
      expect(fake.disposed).toEqual([]);
    } finally {
      if (saved === undefined) delete process.env.SK_VISION_AUTOINSPECT;
      else process.env.SK_VISION_AUTOINSPECT = saved;
    }
  });

  it("keeps the prompt hook and disposes cleanly when tool registration fails", async () => {
    const base = makeContext();
    const ctx: SetupContext = {
      ...base.ctx,
      tool: {
        transform: async () => {
          throw new Error("tool editor unavailable");
        },
      },
    };
    let autoDisposed = 0;
    const dispose = await createSetup({
      handle: async () => {},
      readTemplate: () => null,
      createAutoInspect: () => ({
        evidence: async () => null,
        tools: [fakeTool("sk_vision_status")],
        dispose: async () => {
          autoDisposed += 1;
        },
      }),
    })(ctx);

    expect(base.hook()).toBeDefined();
    await dispose();
    expect(base.disposed).toEqual(["prompt", "command"]);
    expect(autoDisposed).toBe(1);
  });

  it("releases everything setup holds when the prompt hook fails to register", async () => {
    const made = makeContext();
    const base = withToolEditor(made.ctx);
    const ctx: SetupContext = {
      ...base.ctx,
      session: {
        ...base.ctx.session,
        hook: async () => {
          throw new Error("prompt hook unavailable");
        },
      },
    };
    let autoDisposed = 0;

    await expect(
      createSetup({
        handle: async () => {},
        readTemplate: () => null,
        createAutoInspect: () => ({
          evidence: async () => null,
          tools: [fakeTool("sk_vision_status")],
          dispose: async () => {
            autoDisposed += 1;
          },
        }),
      })(ctx),
    ).rejects.toThrow("prompt hook unavailable");
    expect(base.added.length).toBe(base.disposed.length);
    expect(made.disposed).toEqual(["command"]);
    expect(autoDisposed).toBe(1);
  });

  it("still releases the inspection client and keeps the hook error when command disposal fails", async () => {
    const base = makeContext();
    const ctx: SetupContext = {
      ...base.ctx,
      command: {
        transform: async (callback) => {
          callback({ add: () => {} });
          return {
            dispose: () => {
              throw new Error("command dispose failed");
            },
          };
        },
      },
      session: {
        ...base.ctx.session,
        hook: () => {
          throw new Error("prompt hook unavailable");
        },
      },
    };
    let autoDisposed = 0;

    await expect(
      createSetup({
        handle: async () => {},
        readTemplate: () => null,
        createAutoInspect: () => ({
          evidence: async () => null,
          dispose: async () => {
            autoDisposed += 1;
          },
        }),
      })(ctx),
    ).rejects.toThrow("prompt hook unavailable");
    expect(autoDisposed).toBe(1);
  });

  it("releases every handle and rethrows the first error when one disposal fails", async () => {
    const made = makeContext();
    const fake = withToolEditor({
      ...made.ctx,
      session: {
        ...made.ctx.session,
        hook: async () => ({
          dispose: async () => {
            throw new Error("prompt dispose failed");
          },
        }),
      },
    });
    let autoDisposed = 0;
    const dispose = await createSetup({
      handle: async () => {},
      readTemplate: () => null,
      createAutoInspect: () => ({
        evidence: async () => null,
        tools: [fakeTool("sk_vision_status")],
        dispose: async () => {
          autoDisposed += 1;
        },
      }),
    })(fake.ctx);

    await expect(dispose()).rejects.toThrow("prompt dispose failed");
    expect(fake.disposed).toEqual(["tool"]);
    expect(made.disposed).toEqual(["command"]);
    expect(autoDisposed).toBe(1);
  });

  it("keeps image inspection and the tools when command registration fails", async () => {
    const made = makeContext();
    const fake = withToolEditor(made.ctx);
    const ctx: SetupContext = {
      ...fake.ctx,
      command: {
        transform: async () => {
          throw new Error("command editor unavailable");
        },
      },
    };
    let autoDisposed = 0;
    const dispose = await createSetup({
      handle: async () => {},
      readTemplate: () => null,
      createAutoInspect: () => ({
        evidence: async () => null,
        tools: [fakeTool("sk_vision_status")],
        dispose: async () => {
          autoDisposed += 1;
        },
      }),
    })(ctx);

    expect(fake.added).toEqual(["sk_vision_status"]);
    await expect(dispose()).resolves.toBeUndefined();
    expect(fake.disposed).toEqual(["tool"]);
    expect(autoDisposed).toBe(1);
    expect(made.hook()).toBeDefined();
  });
});

describe("v2 grace for models off the text-only list", () => {
  type AutoInspectFactory = NonNullable<Parameters<typeof createSetup>[0]["createAutoInspect"]>;

  async function guaranteedFor(
    get: NonNullable<SetupContext["session"]["get"]>,
  ): Promise<boolean | undefined> {
    const fake = makeContext([], get);
    const calls: boolean[] = [];
    const create: AutoInspectFactory = () => ({
      evidence: async (_images, guaranteed) => {
        calls.push(guaranteed);
        return null;
      },
      dispose: async () => {},
    });
    const dispose = await createSetup({
      handle: async () => {},
      readTemplate: () => null,
      createAutoInspect: create,
    })(fake.ctx);
    await fake.hook()?.({
      sessionID: "ses_1",
      messageID: "msg_1",
      prompt: {
        text: "what is in this screenshot?",
        files: [{ uri: "data:image/png;base64,AAAA", name: "shot.png" }],
      },
      delivery: "queue",
    });
    await dispose();
    return calls[0];
  }

  it("asks for the grace, not the full wait, for a model off the text-only list", async () => {
    const guaranteed = await guaranteedFor(async () => ({
      model: { id: "claude-opus-4-8", providerID: "anthropic" },
    }));
    expect(guaranteed).toBe(false);
  });

  it("waits for the evidence when reading the session model fails", async () => {
    const guaranteed = await guaranteedFor(async () => {
      throw new Error("no session");
    });
    expect(guaranteed).toBe(true);
  });
});

describe("kill switches", () => {
  let savedEnv: Record<string, string | undefined> = {};

  const isSwitchEnv = (key: string): boolean =>
    key.endsWith("_DISABLED") || key === "HOOK_FLAGS_CONFIG" || key === "SK_VISION_AUTOINSPECT";

  beforeEach(() => {
    // The resolver honors many aliases per concern, so any inherited `_DISABLED`
    // name could flip a case that expects the plugin on.
    savedEnv = Object.fromEntries(
      Object.entries(process.env).filter(([key]) => isSwitchEnv(key)),
    );
    for (const name of Object.keys(savedEnv)) delete process.env[name];
    process.env.HOOK_FLAGS_CONFIG = join(tmpdir(), "sk-vision-no-hook-flags.env");
  });

  afterEach(() => {
    for (const name of Object.keys(process.env)) {
      if (isSwitchEnv(name)) delete process.env[name];
    }
    Object.assign(process.env, savedEnv);
  });

  it("registers the command on OpenCode 2 when no switch is set", async () => {
    const { ctx, registeredCommands } = makeContext();
    const cleanup = await plugin.setup(ctx);

    expect(registeredCommands).toEqual(["vision"]);

    await cleanup();
  });

  it("registers nothing on OpenCode 2 with SYSTEM_HOOKS_DISABLED=1", async () => {
    process.env.SYSTEM_HOOKS_DISABLED = "1";
    const { ctx, registeredCommands, hook } = makeContext();
    const cleanup = await plugin.setup(ctx);

    expect(registeredCommands).toEqual([]);
    expect(hook()).toBeUndefined();
    expect(typeof cleanup).toBe("function");

    await cleanup();
  });

  it("registers nothing on OpenCode 2 with SYSTEM_SK_VISION_DISABLED=1", async () => {
    process.env.SYSTEM_SK_VISION_DISABLED = "1";
    const { ctx, registeredCommands, hook } = makeContext();
    const cleanup = await plugin.setup(ctx);

    expect(registeredCommands).toEqual([]);
    expect(hook()).toBeUndefined();
    expect(typeof cleanup).toBe("function");

    await cleanup();
  });

  it("returns only dispose on OpenCode 1 with SYSTEM_HOOKS_DISABLED=1", async () => {
    process.env.SYSTEM_HOOKS_DISABLED = "1";
    const hooks = await plugin.server({ directory: "test-project" } as never, {});

    expect(Object.keys(hooks)).toEqual(["dispose"]);
  });

  it("returns only dispose on OpenCode 1 with SYSTEM_SK_VISION_DISABLED=true", async () => {
    process.env.SYSTEM_SK_VISION_DISABLED = "true";
    const hooks = await plugin.server({ directory: "test-project" } as never, {});

    expect(Object.keys(hooks)).toEqual(["dispose"]);
  });

  it("keeps the v1 command hook when no switch is set", async () => {
    const hooks = await plugin.server({ directory: "test-project" } as never, {});

    expect(Object.keys(hooks)).toContain("command.execute.before");
  });

  it("createSetup skips every registration when isEnabled returns false", async () => {
    const setup = createSetup({
      handle: async () => {},
      readTemplate: () => TEMPLATE,
      isEnabled: () => false,
    });
    const { ctx, registeredCommands, hook } = makeContext();
    const cleanup = await setup(ctx);

    expect(registeredCommands).toEqual([]);
    expect(hook()).toBeUndefined();

    await cleanup();
  });
});
