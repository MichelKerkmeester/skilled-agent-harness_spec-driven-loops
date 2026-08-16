import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { RuntimeClient, SkVisionError } from "../../.opencode/skills/sk-vision/vision-runtime/src/runtime/client.ts";
import { PhotonProvider } from "../../.opencode/skills/sk-vision/vision-runtime/src/providers/photon.ts";
import contextBuilder from "../../.opencode/skills/sk-vision/vision-runtime/src/core/context-builder.ts";
import type { BBox, ImageSource, VisionHealth } from "../../.opencode/skills/sk-vision/vision-runtime/src/providers/types.ts";

const PathImageParams = {
  path: Type.Optional(Type.String({ description: "Path to the image file, relative to the current project." })),
  image: Type.Optional(Type.String({ description: "Image as a base64 data URL (data:image/...;base64,...)." })),
};

function makeImageSource(path: string | undefined, image: string | undefined): ImageSource {
  if (image) return { type: "data", data: image };
  if (path) return { type: "path", path };
  throw new SkVisionError("INVALID_INPUT", "must provide either 'path' or 'image'");
}

function sourceLabel(args: { path?: string }): string {
  return args.path ?? "inline-image";
}

function fail(err: unknown): string {
  const isSkVision = err instanceof SkVisionError;
  const message = (err as Error).message;
  return `SK_VISION_ERROR (${isSkVision ? (err as SkVisionError).code : "UNKNOWN"}): ${message}\n\nThe image could not be analyzed. Report this to the user plainly.`;
}

function parseBBox(s: string): BBox {
  const parts = s.split(",").map((p) => Number(p.trim()));
  if (parts.length !== 4 || parts.some((p) => !Number.isFinite(p))) {
    throw new SkVisionError("INVALID_INPUT", `invalid bbox '${s}' — expected 'x1,y1,x2,y2'`);
  }
  const [x1, y1, x2, y2] = parts as [number, number, number, number];
  if (x2 <= x1 || y2 <= y1) {
    throw new SkVisionError("INVALID_INPUT", `invalid bbox '${s}' — x2/x1 and y2/y1 must be ordered`);
  }
  return { x1, y1, x2, y2 };
}

function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

/** Pi extension factory: registers sk-vision tools backed by the shared Python runtime. */
export default function skVision(pi: ExtensionAPI): void {
  const client = new RuntimeClient();

  function provider(ctx: ExtensionContext): PhotonProvider {
    return new PhotonProvider(client, { projectDir: ctx.cwd });
  }

  pi.registerTool({
    name: "sk_vision_inspect",
    label: "sk-vision inspect",
    description:
      "Inspect an image with the sk-vision model. Use for screenshots, attached media, or design mockups. If 'question' is given, answers it; otherwise returns a structured scene read (image type, layout, elements, state) plus a caption and exact OCR of any visible text. Returns structured evidence in <SK-VISION> tags.",
    parameters: Type.Object({
      ...PathImageParams,
      question: Type.Optional(Type.String({ description: "Natural-language question about the image." })),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      try {
        const src = makeImageSource(params.path, params.image);
        const label = sourceLabel(params);
        const p = provider(ctx);
        if (params.question) {
          const res = await p.query({ source: src, question: params.question });
          return textResult(contextBuilder.renderQuery(res, { source: label, question: params.question }));
        }
        const [cap, scene, ocr] = await Promise.all([
          p.caption({ source: src }),
          p.scene({ source: src }),
          p.ocr({ source: src }),
        ]);
        return textResult(
          [
            contextBuilder.renderScene(scene, { source: label }),
            contextBuilder.renderCaption(cap, { source: label }),
            contextBuilder.renderOCR(ocr, { source: label }),
          ].join("\n"),
        );
      } catch (err) {
        return textResult(fail(err));
      }
    },
  });

  pi.registerTool({
    name: "sk_vision_detect",
    label: "sk-vision detect",
    description:
      "Detect objects or UI elements in an image and return their labeled bounding boxes (e.g. 'submit button', 'navbar', 'broken element').",
    parameters: Type.Object({
      ...PathImageParams,
      target: Type.String({ description: "The object or UI element to search for." }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      try {
        const src = makeImageSource(params.path, params.image);
        const res = await provider(ctx).detect({ source: src, target: params.target });
        return textResult(
          contextBuilder.renderDetection(res, {
            source: sourceLabel(params),
            title: `Detect:${params.target}`,
          }),
        );
      } catch (err) {
        return textResult(fail(err));
      }
    },
  });

  pi.registerTool({
    name: "sk_vision_point",
    label: "sk-vision point",
    description:
      "Locate the exact on-screen position of a target in an image. Returns normalized point coordinates (0-1) identifying where the target sits.",
    parameters: Type.Object({
      ...PathImageParams,
      target: Type.String({ description: "The object or element to locate." }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      try {
        const src = makeImageSource(params.path, params.image);
        const res = await provider(ctx).point({ source: src, target: params.target });
        return textResult(contextBuilder.renderPoint(res, { source: sourceLabel(params) }));
      } catch (err) {
        return textResult(fail(err));
      }
    },
  });

  pi.registerTool({
    name: "sk_vision_ocr",
    label: "sk-vision ocr",
    description:
      "Extract exact text from an image. Prefer this over a caption when the precise wording of an error message, code, label, or page text matters.",
    parameters: Type.Object({
      ...PathImageParams,
      kind: Type.Optional(
        Type.Union([Type.Literal("all"), Type.Literal("code"), Type.Literal("error")], {
          description: "'all' transcribes everything; 'code' targets code text; 'error' targets error messages.",
        }),
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      try {
        const src = makeImageSource(params.path, params.image);
        const kindArg = params.kind ?? "all";
        const res = await provider(ctx).ocr({ source: src, kind: kindArg });
        return textResult(contextBuilder.renderOCR(res, { source: sourceLabel(params) }));
      } catch (err) {
        return textResult(fail(err));
      }
    },
  });

  pi.registerTool({
    name: "sk_vision_status",
    label: "sk-vision status",
    description:
      "Report the sk-vision runtime status: model load state, device, VRAM usage, request count, last inference time.",
    parameters: Type.Object({}),
    async execute(_toolCallId, _params, _signal, _onUpdate, ctx) {
      try {
        const health: VisionHealth = await provider(ctx).health();
        return textResult(contextBuilder.renderHealth(health));
      } catch (err) {
        return textResult(fail(err));
      }
    },
  });

  pi.registerTool({
    name: "sk_vision_segment",
    label: "sk-vision segment",
    description:
      "Cut out an object or UI element from an image. Returns the path to a saved mask/PNG plus its bounding box. Use when you need a clean region of an image (logo, button, person, chart element) rather than just coordinates.",
    parameters: Type.Object({
      ...PathImageParams,
      target: Type.String({ description: "The object or element to segment." }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      try {
        const src = makeImageSource(params.path, params.image);
        const res = await provider(ctx).segment({ source: src, target: params.target });
        return textResult(
          contextBuilder.renderSegment(res, {
            source: sourceLabel(params),
            title: `Segment:${params.target}`,
          }),
        );
      } catch (err) {
        return textResult(fail(err));
      }
    },
  });

  pi.registerTool({
    name: "sk_vision_metadata",
    label: "sk-vision metadata",
    description:
      "Read image metadata without any model: dimensions, format, mode, byte size, DPI, EXIF. Use to verify a file (including web-downloaded images) kept its real type and size, or to debug rendering issues.",
    parameters: Type.Object({ ...PathImageParams }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      try {
        const src = makeImageSource(params.path, params.image);
        const res = await provider(ctx).metadata({ source: src });
        return textResult(contextBuilder.renderMetadata(res, { source: sourceLabel(params) }));
      } catch (err) {
        return textResult(fail(err));
      }
    },
  });

  pi.registerTool({
    name: "sk_vision_crop",
    label: "sk-vision crop",
    description:
      "Crop a region of an image and save it to disk. Region is a normalized bbox (0-1) in the same shape as sk_vision_detect output: [x1, y1, x2, y2]. Returns the saved file path — feed it back into any other sk_vision_* tool.",
    parameters: Type.Object({
      ...PathImageParams,
      bbox: Type.String({
        description: "Normalized [x1, y1, x2, y2] comma-separated, e.g. '0.2,0.3,0.6,0.7'.",
      }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      try {
        const src = makeImageSource(params.path, params.image);
        const bbox = parseBBox(params.bbox);
        const res = await provider(ctx).crop({ source: src, bbox });
        return textResult(contextBuilder.renderCrop(res, { source: sourceLabel(params) }));
      } catch (err) {
        return textResult(fail(err));
      }
    },
  });

  pi.registerTool({
    name: "sk_vision_zoom",
    label: "sk-vision zoom",
    description:
      "Upscale a region (or the whole image) with LANCZOS and optionally re-analyze it with the model. Small text or fine details that the vision model misses at full-image scale become readable after zooming. 'region' defaults to the whole image.",
    parameters: Type.Object({
      ...PathImageParams,
      region: Type.Optional(
        Type.String({ description: "Optional normalized [x1, y1, x2, y2] comma-separated." }),
      ),
      scale: Type.Optional(Type.Number({ description: "Upscale factor, 1-8 (default 2)." })),
      analyze: Type.Optional(
        Type.Union([Type.Literal("none"), Type.Literal("ocr"), Type.Literal("caption"), Type.Literal("query")], {
          description:
            "Re-analyze the upscaled crop: 'ocr' reads its text, 'caption' describes it, 'query' answers a question (default 'none').",
        }),
      ),
      question: Type.Optional(Type.String({ description: "Required when analyze='query'." })),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      try {
        const src = makeImageSource(params.path, params.image);
        const res = await provider(ctx).zoom({
          source: src,
          region: params.region ? parseBBox(params.region) : undefined,
          scale: params.scale ?? 2,
          analyze: params.analyze ?? "none",
          question: params.question,
        });
        return textResult(contextBuilder.renderZoom(res, { source: sourceLabel(params) }));
      } catch (err) {
        return textResult(fail(err));
      }
    },
  });

  pi.registerTool({
    name: "sk_vision_colors",
    label: "sk-vision colors",
    description:
      "Deterministic color analysis (no model): dominant palette with shares, dark/mid/bright luminance buckets, and average RGB for an image or region. Use for ground-truth checks the vision model can't do reliably.",
    parameters: Type.Object({
      ...PathImageParams,
      region: Type.Optional(
        Type.String({ description: "Optional normalized [x1, y1, x2, y2] comma-separated." }),
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      try {
        const src = makeImageSource(params.path, params.image);
        const res = await provider(ctx).colors({
          source: src,
          region: params.region ? parseBBox(params.region) : undefined,
        });
        return textResult(contextBuilder.renderColors(res, { source: sourceLabel(params) }));
      } catch (err) {
        return textResult(fail(err));
      }
    },
  });

  pi.registerTool({
    name: "sk_vision_diff",
    label: "sk-vision diff",
    description:
      "Pixel-level comparison of two images: percent changed and the changed-region bounding boxes (anti-aliasing is blurred out). Optionally ask the model to describe what changed via 'describe'. Pass the second image in 'otherPath' (or 'otherImage').",
    parameters: Type.Object({
      ...PathImageParams,
      otherPath: Type.Optional(Type.String({ description: "Second image: path or http(s) URL." })),
      otherImage: Type.Optional(Type.String({ description: "Second image as a base64 data URL." })),
      describe: Type.Optional(
        Type.Boolean({ description: "Run the vision model on the diff and summarize what changed." }),
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      try {
        const src = makeImageSource(params.path, params.image);
        const other = makeImageSource(params.otherPath, params.otherImage);
        const res = await provider(ctx).diff({
          source: src,
          other,
          describe: params.describe ?? false,
        });
        return textResult(
          contextBuilder.renderDiff(res, {
            source: sourceLabel(params),
            other: params.otherPath ?? "inline-image",
          }),
        );
      } catch (err) {
        return textResult(fail(err));
      }
    },
  });

  pi.registerTool({
    name: "sk_vision_annotate",
    label: "sk-vision annotate",
    description:
      "Draw bounding boxes and/or points onto an image and save a copy. Takes the same shapes as sk_vision_detect/sk_vision_point output so you can visually validate what the model found. Returns the annotated file path.",
    parameters: Type.Object({
      ...PathImageParams,
      boxes: Type.Optional(
        Type.String({ description: "JSON array of {x1,y1,x2,y2,label?} normalized boxes." }),
      ),
      points: Type.Optional(
        Type.String({ description: "JSON array of {x,y,label?} normalized points." }),
      ),
      color: Type.Optional(Type.String({ description: "Stroke color for boxes/points, e.g. '#ff3355'." })),
      label: Type.Optional(Type.String({ description: "Default label for all boxes/points." })),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      try {
        const src = makeImageSource(params.path, params.image);
        const res = await provider(ctx).annotate({
          source: src,
          boxes: params.boxes ? (JSON.parse(params.boxes) as Array<BBox & { label?: string }>) : [],
          points: params.points
            ? (JSON.parse(params.points) as Array<{ x: number; y: number; label?: string }>)
            : [],
          color: params.color,
          label: params.label,
        });
        return textResult(contextBuilder.renderAnnotate(res, { source: sourceLabel(params) }));
      } catch (err) {
        return textResult(fail(err));
      }
    },
  });

  pi.registerTool({
    name: "sk_vision_reverse",
    label: "sk-vision reverse",
    description:
      "Reverse image search with no API key. 'local' perceptual-hash search finds near-duplicates in your cache and optional 'dir' (always available); 'yandex' uploads to Yandex image search and returns matching page URLs. Default providers: local,yandex.",
    parameters: Type.Object({
      ...PathImageParams,
      providers: Type.Optional(
        Type.String({ description: "Comma-separated: 'local', 'yandex' (default 'local,yandex')." }),
      ),
      dir: Type.Optional(
        Type.String({ description: "Directory to scan for local matches (default: sk-vision cache)." }),
      ),
      limit: Type.Optional(Type.Number({ description: "Max local matches (1-25, default 8)." })),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      try {
        const src = makeImageSource(params.path, params.image);
        const res = await provider(ctx).reverse({
          source: src,
          providers: params.providers ? params.providers.split(",").map((p) => p.trim()) : undefined,
          dir: params.dir,
          limit: params.limit,
        });
        return textResult(contextBuilder.renderReverse(res));
      } catch (err) {
        return textResult(fail(err));
      }
    },
  });

  // Bounded auto-inspect for attached images. A message that carries images
  // gets a short analysis window so fast submitters still see real evidence,
  // mirroring the OpenCode AttachmentInjector. The handler never blocks
  // message submission and never raises: a timeout or analysis failure falls
  // through to the untouched message, and extension-injected traffic is never
  // analyzed so the hook cannot echo or amplify tool-driven input.
  const inputEvidenceCache = new Map<string, string>();
  const maxInputEvidenceEntries = 32;

  async function inspectAttachedImages(
    images: Array<{ data: string; mimeType: string }>,
    ctx: ExtensionContext,
  ): Promise<string | undefined> {
    const blocks: string[] = [];
    for (const img of images) {
      // The data URL is the identity: identical image bytes reuse the same
      // evidence instead of paying the GPU again.
      const key = `${img.mimeType}:${img.data}`;
      let evidence = inputEvidenceCache.get(key);
      if (evidence === undefined) {
        const pending = (async () => {
          try {
            const source = makeImageSource(undefined, img.data);
            const p = provider(ctx);
            const [cap, scene, ocr] = await Promise.all([
              p.caption({ source }),
              p.scene({ source }),
              p.ocr({ source }),
            ]);
            return [
              contextBuilder.renderScene(scene, { source: "inline-image" }),
              contextBuilder.renderCaption(cap, { source: "inline-image" }),
              contextBuilder.renderOCR(ocr, { source: "inline-image" }),
            ].join("\n");
          } catch {
            return undefined;
          }
        })();
        const ready = await Promise.race([
          pending,
          new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), 2_000)),
        ]);
        if (ready !== undefined) {
          inputEvidenceCache.set(key, ready);
          if (inputEvidenceCache.size > maxInputEvidenceEntries) {
            const oldest = inputEvidenceCache.keys().next().value;
            if (oldest !== undefined) inputEvidenceCache.delete(oldest);
          }
          evidence = ready;
        } else {
          // Let the in-flight analysis warm the cache for a follow-up message
          // with the same image instead of re-running the model.
          void pending.then((warmed) => {
            if (warmed !== undefined) {
              inputEvidenceCache.set(key, warmed);
              if (inputEvidenceCache.size > maxInputEvidenceEntries) {
                const oldest = inputEvidenceCache.keys().next().value;
                if (oldest !== undefined) inputEvidenceCache.delete(oldest);
              }
            }
          });
        }
      }
      if (evidence) blocks.push(evidence);
    }
    return blocks.length > 0 ? blocks.join("\n") : undefined;
  }

  pi.on("input", async (event, ctx) => {
    try {
      if (event.source === "extension") return { action: "continue" as const };
      if (event.streamingBehavior === "steer") return { action: "continue" as const };
      const images = event.images ?? [];
      if (images.length === 0) return { action: "continue" as const };
      const evidence = await inspectAttachedImages(images, ctx);
      if (!evidence) return { action: "continue" as const };
      return {
        action: "transform" as const,
        text: `${event.text}\n\n<SK-VISION>\n${evidence}\n</SK-VISION>`,
      };
    } catch {
      return { action: "continue" as const };
    }
  });

  pi.on("session_shutdown", async () => {
    await client.close();
  });
}
