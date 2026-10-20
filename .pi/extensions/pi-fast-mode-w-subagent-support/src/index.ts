// ───────────────────────────────────────────────────────────────────
// MODULE: Extension
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { realpathSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  ExtensionAPI,
  ExtensionCommandContext,
  ExtensionContext,
  ExtensionFactory,
} from "@earendil-works/pi-coding-agent";
import { getFastCommandCompletions, parseFastCommand } from "./commands";
import {
  cloneConfig,
  loadConfigForScope,
  saveConfigToPath,
  syncSupportedTargets,
} from "./config";
import { readHandoff, writeHandoff } from "./handoff";
import { findMatchingTarget, getFastModePayload, toModelRef } from "./payload";
import { clearFastStatus, updateFastStatus } from "./status";
import { PACKAGE_NAME, type FastModeConfig, type ModelRef } from "./types";

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Options for creating the Fast Mode extension factory. */
export type FastModeExtensionOptions = {
  /** Directory containing the extension entry point; used to detect project-local package installs. */
  extensionDir?: string;
  /** Test/advanced override for Pi's user-level agent directory. */
  agentDir?: string;
};

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const DEFAULT_EXTENSION_DIR = dirname(fileURLToPath(import.meta.url));

/** Event-bus channel the copies of this package use to find one another in one load. */
const COPY_CLAIM_CHANNEL = `${PACKAGE_NAME}:copy-claim`;

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function notifyError(
  ctx: Pick<ExtensionContext, "hasUI" | "ui">,
  error: unknown,
): void {
  if (!ctx.hasUI) return;
  const message = error instanceof Error ? error.message : String(error);
  ctx.ui.notify(message, "error");
}

// Confirm the toggle in chat. Enabling on a model that is not a configured
// target is a no-op for the active request, so warn instead of confirming: the
// flag is set but nothing changes until the model is an OpenAI target.
function notifyFastState(
  ctx: Pick<ExtensionContext, "hasUI" | "ui">,
  config: FastModeConfig,
  model: ModelRef | undefined,
): void {
  if (!ctx.hasUI) return;
  if (!config.enabled) {
    ctx.ui.notify("Fast Mode disabled", "info");
    return;
  }
  if (findMatchingTarget(model, config.targets)) {
    ctx.ui.notify("Fast Mode enabled", "info");
    return;
  }
  ctx.ui.notify(
    "Fast Mode has no effect on the current model. It applies only to the configured OpenAI GPT models.",
    "warning",
  );
}

// Pi keeps every copy it loads and keys them by real path. Two copies at one
// real path collapse into one entry, so both may register. A flag registered by
// copies at two different real paths is a conflict, and a print-mode run fails
// on it, so a worktree's own copy and a user-level link to another checkout
// cannot both register. Pi's pre-trust pass and its trusted pass share one event
// bus and the earlier pass's listeners stay subscribed, so the first copy to
// claim the package keeps it and a copy at another real path stands down.
function realRoot(extensionDir: string): string {
  const root = dirname(extensionDir);
  try {
    return realpathSync(root);
  } catch {
    return resolve(root);
  }
}

function claimPackage(pi: ExtensionAPI, root: string): boolean {
  const probe: { claimedBy?: string } = {};
  pi.events.emit(COPY_CLAIM_CHANNEL, probe);
  if (probe.claimedBy !== undefined && probe.claimedBy !== root) return false;

  pi.events.on(COPY_CLAIM_CHANNEL, (data: unknown) => {
    if (typeof data === "object" && data !== null) {
      const claim = data as { claimedBy?: string };
      claim.claimedBy ??= root;
    }
  });
  return true;
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Create an extension factory that wires Fast Mode into Pi lifecycle events.
 *
 * The session-start wiring resolves the scoped configuration, then applies the
 * command flag and inherited handoff preference before updating the status.
 *
 * @param options - Optional extension and agent-directory overrides.
 * @returns A factory that registers Fast Mode behavior with Pi.
 */
export function createPiFastModeExtension(
  options: FastModeExtensionOptions = {},
): ExtensionFactory {
  const extensionDir = options.extensionDir ?? DEFAULT_EXTENSION_DIR;
  const agentDir = options.agentDir;

  return function piFastModeExtension(pi: ExtensionAPI): void {
    if (!claimPackage(pi, realRoot(extensionDir))) return;

    let config: FastModeConfig = cloneConfig();
    let configPath: string | undefined;
    let loadedCwd: string | undefined;
    let currentModel: ModelRef | undefined;

    async function loadForContext(
      ctx: Pick<ExtensionContext, "cwd">,
    ): Promise<void> {
      const loaded = await loadConfigForScope({
        cwd: ctx.cwd,
        extensionDir,
        agentDir,
      });

      config = syncSupportedTargets(loaded.config);
      configPath = loaded.path;
      loadedCwd = ctx.cwd;

      // Persist the package's current target list on every load so upgrades
      // automatically update existing config files without changing enabled.
      await saveConfigToPath(configPath, config);
    }

    async function ensureLoaded(
      ctx: Pick<ExtensionContext, "cwd">,
    ): Promise<void> {
      if (!configPath || loadedCwd !== ctx.cwd) {
        await loadForContext(ctx);
      }
    }

    async function saveCurrent(
      ctx: Pick<ExtensionContext, "cwd">,
    ): Promise<void> {
      if (!configPath || loadedCwd !== ctx.cwd) {
        await loadForContext(ctx);
      }

      if (!configPath) {
        throw new Error("Fast Mode config path was not resolved");
      }

      await saveConfigToPath(configPath, config);
    }

    function refreshCurrentModel(ctx: Pick<ExtensionContext, "model">): void {
      currentModel = toModelRef(ctx.model) ?? currentModel;
    }

    pi.registerFlag("fast", {
      description: "Start with Fast Mode enabled",
      type: "boolean",
      default: false,
    });

    pi.registerCommand("fast", {
      description: "Toggle Fast Mode. Usage: /fast [on|off|toggle]",
      getArgumentCompletions: getFastCommandCompletions,
      handler: async (
        args: string,
        ctx: ExtensionCommandContext,
      ): Promise<void> => {
        try {
          await ensureLoaded(ctx);
          refreshCurrentModel(ctx);
          config.enabled = parseFastCommand(args, config.enabled);
          await saveCurrent(ctx);
          writeHandoff(process.env, config.enabled);
          updateFastStatus(ctx, config, currentModel);
          notifyFastState(ctx, config, currentModel);
        } catch (error: unknown) {
          notifyError(ctx, error);
        }
      },
    });

    pi.on("session_start", async (_event, ctx) => {
      try {
        currentModel = toModelRef(ctx.model);
        await loadForContext(ctx);

        const inheritedPreference = readHandoff(process.env);
        const effectiveEnabled =
          pi.getFlag("fast") === true
            ? true
            : inheritedPreference ?? config.enabled;
        if (effectiveEnabled !== config.enabled) {
          config.enabled = effectiveEnabled;
          await saveCurrent(ctx);
        }
        writeHandoff(process.env, config.enabled);

        updateFastStatus(ctx, config, currentModel);
      } catch (error: unknown) {
        notifyError(ctx, error);
      }
    });

    pi.on("model_select", async (event, ctx) => {
      currentModel = toModelRef(event.model) ?? toModelRef(ctx.model);
      updateFastStatus(ctx, config, currentModel);
    });

    pi.on("before_provider_request", (event, ctx) => {
      const model = toModelRef(ctx.model) ?? currentModel;
      return getFastModePayload(config, model, event.payload);
    });

    pi.on("session_shutdown", async (_event, ctx) => {
      try {
        if (configPath) {
          await saveConfigToPath(configPath, config);
        }
      } catch (error: unknown) {
        notifyError(ctx, error);
      } finally {
        clearFastStatus(ctx);
      }
    });
  };
}

// ───────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────────

/** Default Fast Mode extension factory. */
const piFastModeExtension = createPiFastModeExtension();

export default piFastModeExtension;
