import { describe, expect, it } from "bun:test";
import { AttachmentInjector } from "./attachments.js";
import type { PhotonProvider } from "../providers/photon.js";
import type { ChatMessageInput, ChatMessageOutput } from "./attachments.js";

// A provider whose analysis resolves only after `delayMs`, so a test can distinguish an
// awaited run (guaranteed) from one dropped by the grace race.
function slowProvider(delayMs: number, ocrText: string): PhotonProvider {
  const later = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), delayMs));
  return {
    caption: () => later({ caption: "a caption" }),
    scene: () => later({ scene: "a scene" }),
    ocr: () => later({ text: ocrText }),
  } as unknown as PhotonProvider;
}

function makeIO(model: unknown): { input: ChatMessageInput; output: ChatMessageOutput } {
  const part = {
    id: "prt_img",
    sessionID: "ses_test",
    messageID: "msg_test",
    type: "file",
    mime: "image/png",
    url: "data:image/png;base64,AAAA",
  };
  return {
    input: { sessionID: "ses_test", model } as unknown as ChatMessageInput,
    output: {
      message: { id: "msg_test", sessionID: "ses_test" },
      parts: [part],
    } as unknown as ChatMessageOutput,
  };
}

function injectedText(output: ChatMessageOutput): string {
  return (output.parts as Array<{ type: string; text?: string }>)
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("\n");
}

describe("AttachmentInjector guaranteed vision", () => {
  const GRACE = 20;
  const SLOW = 120; // longer than GRACE, so only an awaited run captures it
  const SENTINEL = "SENTINEL_OCR_TEXT";

  it("awaits the full analysis for a text-only model even when it is slower than the grace", async () => {
    const injector = new AttachmentInjector(() => slowProvider(SLOW, SENTINEL), GRACE);
    const { input, output } = makeIO({ providerID: "openrouter", modelID: "deepseek/deepseek-v4-flash-latest" });
    await injector.handle(input, output);
    expect(injectedText(output)).toContain(SENTINEL);
  });

  it("does not block a non-text-only model past the grace (evidence absent when analysis is slower)", async () => {
    const injector = new AttachmentInjector(() => slowProvider(SLOW, SENTINEL), GRACE);
    const { input, output } = makeIO({ providerID: "anthropic", modelID: "claude-opus-4-8" });
    await injector.handle(input, output);
    expect(injectedText(output)).not.toContain(SENTINEL);
  });
});
