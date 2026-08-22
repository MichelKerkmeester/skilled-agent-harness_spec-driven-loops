// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Vision Command
// ───────────────────────────────────────────────────────────────────

import type { PluginInput } from "@opencode-ai/plugin";
import type { FilePart, Part } from "@opencode-ai/sdk";
import type { ImageSource } from "../providers/types.js";
import contextBuilder from "../core/context-builder.js";
import { PhotonProvider } from "../providers/photon.js";
import { RuntimeClient } from "../runtime/client.js";
import { isImagePart, materializeImagePart } from "./attachments.js";

interface VisionCommandInput {
  command: string;
  sessionID: string;
  arguments?: string;
}

interface VisionCommandOutput {
  parts: Part[];
}

interface SessionMessage {
  parts?: Part[];
}

function appendText(output: VisionCommandOutput, text: string): void {
  output.parts.push({ type: "text", text } as Part);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function latestImage(messages: readonly SessionMessage[]): FilePart | undefined {
  for (let messageIndex = messages.length - 1; messageIndex >= 0; messageIndex -= 1) {
    const parts = messages[messageIndex]?.parts ?? [];
    for (let partIndex = parts.length - 1; partIndex >= 0; partIndex -= 1) {
      const part = parts[partIndex];
      if (part && isImagePart(part)) return part;
    }
  }
  return undefined;
}

async function inspectImage(
  provider: PhotonProvider,
  source: ImageSource,
  label: string,
): Promise<string> {
  const [caption, scene, ocr] = await Promise.all([
    provider.caption({ source }),
    provider.scene({ source }),
    provider.ocr({ source }),
  ]);
  return [
    contextBuilder.renderScene(scene, { source: label }),
    contextBuilder.renderCaption(caption, { source: label }),
    contextBuilder.renderOCR(ocr, { source: label }),
  ].join("\n");
}

async function teardown(
  client: RuntimeClient,
  provider: PhotonProvider,
): Promise<void> {
  // Unset or "close" hard-closes; "unload" frees the model; "keep" leaves the process warm.
  const mode = process.env.SK_VISION_TEARDOWN;
  if (mode === "keep") return;
  if (mode === "unload") {
    await provider.unload();
    return;
  }
  await client.close();
}

/** Handle the user-invoked `/vision` command without affecting other commands. */
export async function handleVisionCommand(
  pluginInput: PluginInput,
  input: VisionCommandInput,
  output: VisionCommandOutput,
): Promise<void> {
  if (input.command !== "vision") return;

  let client: RuntimeClient | undefined;
  let provider: PhotonProvider | undefined;
  let errorReported = false;
  try {
    const response = await pluginInput.client.session.messages({
      path: { id: input.sessionID },
    });
    const messages = Array.isArray(response.data) ? response.data : [];
    const image = latestImage(messages);
    if (!image) {
      appendText(output, "sk-vision: no recent image found. Attach an image, then run /vision <question>.");
      return;
    }

    const materialized = materializeImagePart(image);
    const label = materialized.source.type === "path" ? materialized.source.path : "inline-image";
    client = new RuntimeClient();
    provider = new PhotonProvider(client, { projectDir: pluginInput.directory });
    const question = (input.arguments ?? "").trim();
    const rendered = question
      ? contextBuilder.renderQuery(
          await provider.query({ source: materialized.source, question }),
          { source: label, question },
        )
      : await inspectImage(provider, materialized.source, label);
    appendText(output, `<SK-VISION COMMAND>\n${rendered}\n</SK-VISION COMMAND>`);
  } catch (error: unknown) {
    errorReported = true;
    appendText(output, `SK_VISION_ERROR: ${errorMessage(error)}`);
  } finally {
    if (client && provider) {
      try {
        await teardown(client, provider);
      } catch (error: unknown) {
        if (!errorReported) appendText(output, `SK_VISION_ERROR: ${errorMessage(error)}`);
      }
    }
  }
}
