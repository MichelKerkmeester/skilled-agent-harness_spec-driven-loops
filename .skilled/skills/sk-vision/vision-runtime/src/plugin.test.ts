// ───────────────────────────────────────────────────────────────────
// MODULE: Vision Plugin Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Part } from "@opencode-ai/sdk";
import type { VisionCommandPluginInput } from "./opencode/command.js";
import { createSetup, matchVisionTemplate, readVisionTemplate, toV1FileUrl } from "./plugin.js";

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

function makeContext(context: ContextMessages = []): {
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
