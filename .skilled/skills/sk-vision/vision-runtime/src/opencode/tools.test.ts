// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Vision Tools Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from "bun:test";
import type { PhotonProvider } from "../providers/photon.js";
import { skVisionTools, toV2Tools } from "./tools.js";

type ZodLike = { safeParse(value: unknown): { success: boolean } };

const healthyProvider = {
  health: async () => ({ status: "ok", device: "cpu", loaded: false }),
} as unknown as PhotonProvider;

describe("toV2Tools", () => {
  it("re-shapes every OpenCode 1 tool under the same name and description", () => {
    const v1 = skVisionTools(() => healthyProvider);
    const v2 = toV2Tools(v1);
    expect(v2.map((definition) => definition.name)).toEqual(Object.keys(v1));
    expect(v2).toHaveLength(13);
    for (const definition of v2) {
      expect(definition.description).toBe(v1[definition.name as keyof typeof v1].description);
    }
  });

  it("parses arguments with the OpenCode 1 schema", () => {
    const ocr = toV2Tools(skVisionTools(() => healthyProvider)).find(
      (definition) => definition.name === "sk_vision_ocr",
    );
    const input = ocr?.input as ZodLike;
    expect(input.safeParse({ path: "shot.png" }).success).toBe(true);
    expect(input.safeParse({ path: 5 }).success).toBe(false);
  });

  it("returns the OpenCode 1 tool's text as the OpenCode 2 content", async () => {
    const v1 = skVisionTools(() => healthyProvider);
    const status = toV2Tools(v1).find((definition) => definition.name === "sk_vision_status");
    const expected = await v1.sk_vision_status.execute({}, undefined as never);
    expect(await status?.execute({})).toEqual({ content: expected as string });
  });

  it("carries an object result's metadata and attachments into the OpenCode 2 result", async () => {
    const v1 = {
      sk_vision_status: {
        description: "status",
        args: {},
        execute: async () => ({
          output: "ok",
          metadata: { device: "cpu" },
          attachments: [{ type: "file" as const, mime: "image/png", url: "file:///tmp/a.png", filename: "a.png" }],
        }),
      },
    } as unknown as Parameters<typeof toV2Tools>[0];
    const [status] = toV2Tools(v1);
    expect(await status?.execute({})).toEqual({
      content: [
        { type: "text", text: "ok" },
        { type: "file", uri: "file:///tmp/a.png", mime: "image/png", name: "a.png" },
      ],
      metadata: { device: "cpu" },
    });
  });
});
