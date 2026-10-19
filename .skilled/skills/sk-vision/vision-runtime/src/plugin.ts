// ───────────────────────────────────────────────────────────────────
// MODULE: Vision Plugin
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RuntimeClient } from './runtime/client.js';
import { PhotonProvider } from './providers/photon.js';
import { skVisionTools, toV2Tools } from './opencode/tools.js';
import { AttachmentInjector, isImagePart } from './opencode/attachments.js';
import { handleVisionCommand } from './opencode/command.js';
import { isTextOnlyModel } from './model-modality.js';
import type { Plugin } from '@opencode-ai/plugin';
import type { FilePart, Part } from '@opencode-ai/sdk';
import type { SkVisionMessage } from './runtime/client.js';
import type { V2ToolDefinition } from './opencode/tools.js';
import type {
  VisionCommandPluginInput,
  VisionCommandSessionMessage,
} from './opencode/command.js';

type V2Delivery = 'steer' | 'queue';

interface V2PromptMention {
  readonly start: number;
  readonly end: number;
  readonly text: string;
}

interface V2PromptFile {
  readonly uri: string;
  readonly name?: string;
  readonly description?: string;
  readonly mention?: V2PromptMention;
}

interface V2PromptAgent {
  readonly name: string;
  readonly mention?: V2PromptMention;
}

interface V2PromptSkill {
  readonly id: string;
  readonly mention?: V2PromptMention;
}

interface V2Prompt {
  text: string;
  readonly files?: readonly V2PromptFile[];
  readonly agents?: readonly V2PromptAgent[];
  readonly skills?: readonly V2PromptSkill[];
}

interface V2PromptHookInput {
  readonly sessionID: string;
  readonly messageID: string;
  readonly prompt: V2Prompt;
  readonly metadata?: Record<string, unknown>;
  readonly delivery: V2Delivery;
}

interface V2ContextFile {
  readonly data: string;
  readonly mime: string;
  readonly name?: string;
}

/** Convert inline v2 attachment data to the URL format consumed by v1. */
export function toV1FileUrl(file: Pick<V2ContextFile, 'data' | 'mime'>): string {
  return file.data.startsWith('data:')
    ? file.data
    : `data:${file.mime};base64,${file.data}`;
}

interface V2ContextMessage {
  readonly type: string;
  readonly files?: readonly V2ContextFile[];
}

interface V2CommandInvocation {
  readonly sessionID: string;
  readonly prompt: V2Prompt;
  readonly delivery: V2Delivery;
}

interface V2CommandEditor {
  add(definition: {
    readonly name: string;
    readonly description?: string;
    readonly execute: (input: V2CommandInvocation) => Promise<void>;
  }): void;
}

interface V2Registration {
  dispose(): Promise<void>;
}

interface V2ToolEditor {
  add(definition: V2ToolDefinition): void;
}

interface V2AutoInspect {
  evidence(images: readonly FilePart[], guaranteed: boolean): Promise<string | null>;
  readonly tools?: readonly V2ToolDefinition[];
  dispose(): Promise<void>;
}

interface V2PluginContext {
  readonly location: { readonly directory: string };
  readonly command: {
    transform(
      callback: (editor: V2CommandEditor) => V2CommandEditor,
    ): Promise<V2Registration>;
  };
  readonly tool?: {
    transform(callback: (editor: V2ToolEditor) => void): Promise<V2Registration>;
  };
  readonly session: {
    context(input: { readonly sessionID: string }): Promise<readonly V2ContextMessage[]>;
    get?(input: {
      readonly sessionID: string;
    }): Promise<{ readonly model?: { readonly id: string; readonly providerID: string } }>;
    prompt(input: {
      readonly sessionID: string;
      readonly text: string;
      readonly files?: readonly V2PromptFile[];
      readonly agents?: readonly V2PromptAgent[];
      readonly skills?: readonly V2PromptSkill[];
      readonly delivery: V2Delivery;
    }): Promise<unknown>;
    hook(
      name: 'prompt',
      callback: (input: V2PromptHookInput) => Promise<void> | void,
    ): Promise<V2Registration>;
  };
}

const VISION_COMMAND_DESCRIPTION = 'Analyze the latest session image with sk-vision.';

const server: Plugin = async (input, options) => {
  const opts: {
    enabled?: boolean;
    autoInspect?: boolean;
    python?: string;
    timeoutMs?: number;
    fetchTimeoutMs?: number;
    reverseSearch?: "auto" | "always";
  } = (options ?? {}) as never;

  if (opts.enabled === false) {
    return { dispose: async () => {} };
  }

  // SK_VISION_AUTOINSPECT=1 restores legacy automatic GPU analysis; normal sessions stay idle.
  const autoInspect = process.env.SK_VISION_AUTOINSPECT === "1";
  const commandExecuteBefore = async (commandInput: {
    command: string;
    sessionID: string;
    arguments: string;
  }, commandOutput: { parts: import("@opencode-ai/sdk").Part[] }): Promise<void> => {
    await handleVisionCommand(input, commandInput, commandOutput);
  };

  if (!autoInspect) {
    return { "command.execute.before": commandExecuteBefore };
  }

  const client = new RuntimeClient({
    pythonPath: opts.python,
    timeoutMs: opts.timeoutMs,
    notify: (m: SkVisionMessage) => {
      if (!input.client?.tui?.showToast) return;
      void input.client.tui.showToast({
        body: { title: m.title ?? "sk-vision", message: m.message, variant: m.variant },
      });
    },
  });
  const providerObj = new PhotonProvider(client, {
    projectDir: input.directory,
    fetchTimeoutMs: opts.fetchTimeoutMs,
  });
  const getProvider = () => providerObj;
  const injector = new AttachmentInjector(getProvider);

  const tools = skVisionTools(getProvider, {
    reverseSearch: opts.reverseSearch === "always" ? "always" : "auto",
  });

  return {
    "command.execute.before": commandExecuteBefore,
    event: async ({ event }) => {
      // Analyze a clipboard/file image as soon as it's attached to a draft —
      // before the message is submitted — so `chat.message` completes fast and
      // the model never sees a blind image part. Fire-and-forget: this hook
      // must never block the TUI while the (slow) GPU analysis runs.
      if (event.type !== "message.part.updated") return;
      if (opts.autoInspect === false) return;
      const part = (event.properties as { part?: unknown })?.part;
      if (!isImagePart(part as never)) return;
      void injector.preload(part as never).catch((err) => {
        if (process.env.SK_VISION_DEBUG === "1") {
          process.stderr.write(`[sk-vision] preload failed: ${(err as Error).message}\n`);
        }
      });
    },
    "chat.message": async (msgInput, msgOutput) => {
      if (opts.autoInspect === false) return;
      await injector.handle(msgInput, msgOutput);
    },
    tool: tools,
    dispose: async () => {
      await client.close();
    },
  };
};

const FRONTMATTER_BLOCK = /^---\r?\n[\s\S]*?\r?\n---[^\S\r\n]*(?:\r?\n)?/;
const REGEX_METACHARACTERS = /[.*+?^${}()|[\]\\]/g;

/**
 * Recover the user's question from the prompt text a command template expands
 * into. The runtime replaces every `$ARGUMENTS` slot with the same text, so
 * each later slot must repeat the first capture; the match is anchored, never a
 * substring search.
 */
export function matchVisionTemplate(template: string, text: string): string | null {
  const parts = template.split('$ARGUMENTS');
  if (parts.length < 2) return null;
  const escape = (value: string): string => value.replace(REGEX_METACHARACTERS, '\\$&');
  let pattern = escape(parts[0] ?? '');
  for (let index = 1; index < parts.length; index += 1) {
    pattern += index === 1 ? '([\\s\\S]*?)' : '\\1';
    pattern += escape(parts[index] ?? '');
  }
  const match = new RegExp(`^${pattern}$`).exec(text);
  return match ? (match[1] ?? '').trim() : null;
}

/** The `/vision` command template a project ships, without its frontmatter; null when there is none. */
export function readVisionTemplate(directory: string): string | null {
  try {
    const raw = readFileSync(join(directory, '.opencode', 'commands', 'vision.md'), 'utf8');
    return raw.replace(FRONTMATTER_BLOCK, '').trim();
  } catch {
    return null;
  }
}

const PROMPT_FILE_MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  bmp: 'image/bmp',
  pdf: 'application/pdf',
};

function promptFileMime(file: V2PromptFile): string {
  const dataMime = /^data:([^;,]+)[;,]/.exec(file.uri)?.[1];
  if (dataMime) return dataMime;
  const extension = (value: string): string => {
    const path = value.replace(/[?#].*$/, '');
    return /\.([a-z0-9]+)$/i.exec(path)?.[1]?.toLowerCase() ?? '';
  };
  return PROMPT_FILE_MIME[extension(file.name ?? '')] ?? PROMPT_FILE_MIME[extension(file.uri)] ?? '';
}

function promptFileParts(input: V2PromptHookInput): FilePart[] {
  return (input.prompt.files ?? []).flatMap((file, index): FilePart[] => {
    const mime = promptFileMime(file);
    if (!mime.startsWith('image/') && mime !== 'application/pdf') return [];
    return [
      {
        id: `prt_${input.messageID}_${index}`,
        sessionID: input.sessionID,
        messageID: input.messageID,
        type: 'file',
        mime,
        filename: file.name,
        url: file.uri.startsWith('file://') ? fileURLToPath(file.uri) : file.uri,
      },
    ];
  });
}

function createV2CommandInput(
  ctx: V2PluginContext,
  promptFiles: readonly V2PromptFile[] = [],
): VisionCommandPluginInput {
  return {
    directory: ctx.location.directory,
    client: {
      session: {
        messages: async ({ path }) => ({
          data: [
            ...(await ctx.session.context({ sessionID: path.id })).map(
              (message): VisionCommandSessionMessage => ({
                parts:
                  message.type === 'user'
                    ? (message.files ?? []).map(
                        (file) =>
                          ({
                            type: 'file',
                            mime: file.mime,
                            filename: file.name,
                            url: toV1FileUrl(file),
                          }) as Part,
                      )
                    : [],
              }),
            ),
            {
              // An image attached to the command submission itself lives only in the
              // prompt, so surface it as a trailing message for the image scan to find.
              parts: promptFiles.map(
                (file): Part =>
                  ({
                    type: 'file',
                    mime: promptFileMime(file),
                    filename: file.name,
                    url: file.uri,
                  }) as Part,
              ),
            },
          ],
        }),
      },
    },
  };
}

interface VisionSetupDeps {
  handle: typeof handleVisionCommand;
  readTemplate: (directory: string) => string | null;
  createAutoInspect?: (directory: string) => V2AutoInspect | null;
}

/**
 * On OpenCode 2 a repository's `.opencode/commands/vision.md` shadows the
 * plugin-registered command, so that command runs as a Markdown expansion and
 * the plugin's own `execute` never runs. The `prompt` hook sees the expanded
 * text before it reaches the model, attaches the evidence the template promises,
 * and also carries automatic image inspection.
 */
export function createSetup({
  handle,
  readTemplate,
  createAutoInspect,
}: VisionSetupDeps): (ctx: V2PluginContext) => Promise<() => Promise<void>> {
  return async (ctx) => {
    const registration = await ctx.command.transform((editor) => {
      editor.add({
        name: 'vision',
        description: VISION_COMMAND_DESCRIPTION,
        execute: async ({ sessionID, prompt, delivery }) => {
          const output = { parts: [] as Part[] };
          await handle(
            createV2CommandInput(ctx, prompt.files ?? []),
            { command: 'vision', sessionID, arguments: prompt.text },
            output,
          );

          const commandText = output.parts
            .map((part) => (part.type === 'text' ? part.text : ''))
            .filter((text) => text.length > 0)
            .join('\n');
          await ctx.session.prompt({
            sessionID,
            text: [prompt.text, commandText]
              .filter((text) => text.length > 0)
              .join('\n\n'),
            files: prompt.files,
            agents: prompt.agents,
            skills: prompt.skills,
            delivery,
          });
        },
      });
      return editor;
    });

    const template = readTemplate(ctx.location.directory);
    const auto = createAutoInspect?.(ctx.location.directory) ?? null;
    if (template === null && auto === null) return () => registration.dispose();

    // Deferred so a host that throws synchronously still reaches the cleanup below.
    const promptRegistration = await Promise.resolve().then(() => ctx.session.hook('prompt', async (input) => {
      try {
        if (template !== null) {
          const question = matchVisionTemplate(template, input.prompt.text);
          if (question !== null) {
            const output = { parts: [] as Part[] };
            await handle(
              createV2CommandInput(ctx, input.prompt.files ?? []),
              { command: 'vision', sessionID: input.sessionID, arguments: question },
              output,
            );

            const commandText = output.parts
              .map((part) => (part.type === 'text' ? part.text : ''))
              .filter((text) => text.length > 0)
              .join('\n');
            input.prompt.text = [input.prompt.text, commandText]
              .filter((text) => text.length > 0)
              .join('\n\n');
            return;
          }
        }

        if (auto === null) return;
        const images = promptFileParts(input);
        if (images.length === 0) return;

        let model: { readonly id: string; readonly providerID: string } | undefined;
        try {
          model = (await ctx.session.get?.({ sessionID: input.sessionID }))?.model;
        } catch {
          model = undefined;
        }
        const guaranteed = isTextOnlyModel(
          model ? { providerID: model.providerID, modelID: model.id } : undefined,
        );
        const evidence = await auto.evidence(images, guaranteed);
        if (evidence !== null) {
          input.prompt.text = [input.prompt.text, evidence]
            .filter((text) => text.length > 0)
            .join('\n\n');
        }
      } catch (error: unknown) {
        // Fail open: a broken analysis must never block the command turn.
        if (process.env.SK_VISION_DEBUG === '1') {
          const message = error instanceof Error ? error.message : String(error);
          process.stderr.write(`[sk-vision] prompt hook failed: ${message}\n`);
        }
      }
    })).catch(async (error: unknown) => {
      // Setup never returns its cleanup when it throws, so release what it holds first.
      await Promise.allSettled([registration, auto].map(async (held) => held?.dispose()));
      throw error;
    });

    // OpenCode 1 registers the tools from `server`, but OpenCode 2 only calls
    // `setup`, so the same definitions go through its tool editor here, after the
    // prompt hook, so a hook that fails to register leaves no tools behind.
    const tools = auto?.tools ?? [];
    let toolRegistration: V2Registration | null = null;
    if (tools.length > 0 && ctx.tool) {
      try {
        toolRegistration = await ctx.tool.transform((editor) => {
          for (const definition of tools) editor.add(definition);
        });
      } catch (error: unknown) {
        // Fail open: the command and image inspection still work without the tools.
        if (process.env.SK_VISION_DEBUG === '1') {
          const message = error instanceof Error ? error.message : String(error);
          process.stderr.write(`[sk-vision] tool registration failed: ${message}\n`);
        }
      }
    }

    return async () => {
      await promptRegistration.dispose();
      await toolRegistration?.dispose();
      await registration.dispose();
      await auto?.dispose();
    };
  };
}

function createDefaultAutoInspect(directory: string): V2AutoInspect | null {
  if (process.env.SK_VISION_AUTOINSPECT !== '1') return null;
  const client = new RuntimeClient();
  const provider = new PhotonProvider(client, { projectDir: directory });
  const injector = new AttachmentInjector(() => provider);
  return {
    evidence: (images, guaranteed) => injector.evidenceText(images, guaranteed),
    tools: toV2Tools(skVisionTools(() => provider)),
    dispose: () => client.close(),
  };
}

const setup = createSetup({
  handle: handleVisionCommand,
  readTemplate: readVisionTemplate,
  createAutoInspect: createDefaultAutoInspect,
});

export default { id: 'sk-vision', server, setup };
