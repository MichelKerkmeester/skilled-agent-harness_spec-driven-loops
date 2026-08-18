// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: sk-vision OpenCode Plugin (host adapter)                       ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Register the 13 sk_vision_* tools with OpenCode and auto-inspect ║
// ║          attached images. Kept beside the Pi adapter under hooks/ so both ║
// ║          hosts load from the skill; owns host glue only — the vision core ║
// ║          lives in vision-runtime. OpenCode loads a bundled .js, so the    ║
// ║          build emits the sibling sk-vision.js the plugin path links to.   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import type { Plugin } from "@opencode-ai/plugin";
import type { SkVisionMessage } from "../../vision-runtime/src/runtime/client.js";
import { RuntimeClient } from "../../vision-runtime/src/runtime/client.js";
import { PhotonProvider } from "../../vision-runtime/src/providers/photon.js";
import { skVisionTools } from "../../vision-runtime/src/opencode/tools.js";
import { AttachmentInjector, isImagePart } from "../../vision-runtime/src/opencode/attachments.js";

// ─────────────────────────────────────────────────────────────────────────────
// 2. PLUGIN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * OpenCode plugin entry point. Opens one runtime client, exposes the 13
 * `sk_vision_*` tools, and auto-inspects attached images on a 2-second grace so
 * the model never sees a blind image part. Every hook is fire-and-forget: image
 * analysis must never block the TUI or raise while the GPU runs.
 *
 * @param input - The OpenCode plugin input (client, project directory).
 * @param options - Optional config: `enabled`, `autoInspect`, `python`,
 *   `timeoutMs`, `fetchTimeoutMs`, `reverseSearch`.
 * @returns The plugin hook table (`event`, `chat.message`, `tool`, `dispose`).
 */
export const SkVisionPlugin: Plugin = async (input, options) => {
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

export default SkVisionPlugin;
