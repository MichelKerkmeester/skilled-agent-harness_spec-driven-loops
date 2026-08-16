// GPT Fast Mode for pi
// --------------------
// Controls OpenAI's `service_tier` request field for supported GPT-5.4 / 5.5
// models. Toggle the fast (priority) tier with `/fast`, pick another tier with
// `/fast flex|priority|default|auto`, start with `--fast`, and the preference
// is handed off to subagents automatically.

import type {
  ExtensionAPI,
  ExtensionCommandContext,
  ExtensionContext,
} from "@earendil-works/pi-coding-agent";
import {
  COMMAND_USAGE,
  FastCommandError,
  getCommandCompletions,
  parseFastCommand,
} from "./src/command.ts";
import {
  cloneConfig,
  loadConfig,
  saveConfig,
  type LoadedConfig,
} from "./src/config.ts";
import { readHandoff, writeHandoff } from "./src/handoff.ts";
import { injectServiceTier, toModelRef } from "./src/payload.ts";
import { FastState } from "./src/state.ts";
import { clearIndicator, updateIndicator } from "./src/status.ts";
import {
  COMMAND_NAME,
  FLAG_NAME,
  type FastConfig,
  type ModelRef,
  type ServiceTier,
} from "./src/types.ts";

/** Short label shown in the TUI indicator for each tier. */
function tierLabel(tier: ServiceTier): string {
  switch (tier) {
    case "priority":
      return "fast";
    case "flex":
      return "flex";
    case "default":
      return "std";
    case "auto":
      return "auto";
  }
}

export default function gptFastModeExtension(pi: ExtensionAPI): void {
  let loaded: LoadedConfig | undefined;
  let config: FastConfig = cloneConfig();
  const state = new FastState(config);

  function notifyError(ctx: ExtensionContext, error: unknown): void {
    if (!ctx.hasUI) return;
    ctx.ui.notify(
      error instanceof Error ? error.message : String(error),
      "error",
    );
  }

  function currentModel(ctx: { model?: unknown }): ModelRef | undefined {
    return toModelRef(ctx.model);
  }

  function refreshIndicator(ctx: ExtensionContext): void {
    const mode = config.models.length ? config.indicator : "off";
    const desired = state.isDesired();
    const active = state.isActive();
    let label = tierLabel(state.serviceTier());
    // "armed": desired but the current model can't use it; it is handed off to
    // subagents instead. The \u21e2 marker signals "passed downstream".
    if (desired && !active) label = `${label}\u21e2`;
    updateIndicator(ctx, mode, desired, label);
  }

  async function persistIfEnabled(): Promise<void> {
    if (!loaded || !config.persist) return;
    await saveConfig(loaded.path, {
      ...config,
      desired: state.isDesired(),
      tier: state.serviceTier(),
    });
  }

  pi.registerFlag(FLAG_NAME, {
    description: "Start with GPT Fast Mode (priority service tier) enabled",
    type: "boolean",
    default: false,
  });

  pi.registerCommand(COMMAND_NAME, {
    description: "Control the GPT service tier. " + COMMAND_USAGE,
    getArgumentCompletions: getCommandCompletions,
    handler: async (args: string, ctx: ExtensionCommandContext) => {
      try {
        const action = parseFastCommand(args);
        state.setModel(currentModel(ctx));

        if (action.kind === "status") {
          reportStatus(ctx);
          return;
        }

        if (action.kind === "toggle") {
          state.toggle();
        } else if (action.kind === "set") {
          state.setDesired(action.desired);
        } else {
          // tier: select the tier AND enable in one step
          state.setTier(action.tier);
          state.setDesired(true);
        }

        writeHandoff(state.isDesired());
        await persistIfEnabled();
        refreshIndicator(ctx);
        announce(ctx);
      } catch (error) {
        if (error instanceof FastCommandError) {
          ctx.ui.notify(error.message, "warning");
        } else {
          notifyError(ctx, error);
        }
      }
    },
  });

  function reportStatus(ctx: ExtensionContext): void {
    const desired = state.isDesired();
    const model = currentModel(ctx);
    const where = model ? `${model.provider}/${model.id}` : "unknown model";
    const tier = state.serviceTier();
    let msg: string;
    if (!desired) {
      msg = `Fast Mode is OFF (tier would be "${tier}")`;
    } else if (state.isActive()) {
      msg = `Fast Mode is ON \u2014 requesting "${tier}" on ${where}`;
    } else {
      msg = `Fast Mode is ON and handed off to subagents ("${tier}"). ${where} is not a supported GPT model, so this session won't request it \u2014 subagents on GPT-5.4/5.5 will.`;
    }
    ctx.ui.notify(msg, "info");
  }

  function announce(ctx: ExtensionContext): void {
    if (!ctx.hasUI) return;
    const tier = state.serviceTier();
    if (!state.isDesired()) {
      ctx.ui.notify("Fast Mode disabled", "info");
      return;
    }
    if (state.isActive()) {
      ctx.ui.notify(`Fast Mode enabled \u2014 service tier "${tier}"`, "info");
    } else {
      const model = currentModel(ctx);
      const where = model ? `${model.provider}/${model.id}` : "the current model";
      ctx.ui.notify(
        `Fast Mode enabled ("${tier}") and handed off to subagents. ${where} is not a supported GPT model, so this session won't request it \u2014 but subagents on GPT-5.4/5.5 will inherit it.`,
        "info",
      );
    }
  }

  pi.on("session_start", async (_event, ctx) => {
    try {
      loaded = await loadConfig(ctx.cwd);
      config = loaded.config;
      state.setConfig(config);
      state.setModel(currentModel(ctx));

      // Resolve the desired preference at startup, in priority order:
      //   1. --fast flag
      //   2. inherited subagent hand-off (PI_GPT_FAST_MODE)
      //   3. persisted preference (only when persist is enabled)
      const flag = pi.getFlag(FLAG_NAME) === true;
      const handoff = readHandoff();
      let desired = false;
      if (flag) desired = true;
      else if (handoff !== undefined) desired = handoff;
      else if (config.persist) desired = config.desired;

      state.setDesired(desired);
      writeHandoff(desired);
      await persistIfEnabled();
      refreshIndicator(ctx);
    } catch (error) {
      notifyError(ctx, error);
    }
  });

  pi.on("model_select", async (event, ctx) => {
    state.setModel(toModelRef(event.model) ?? currentModel(ctx));
    refreshIndicator(ctx);
  });

  pi.on("before_provider_request", (event, ctx) => {
    state.setModel(currentModel(ctx) ?? undefined);
    if (!state.isActive()) return undefined;
    const next = injectServiceTier(event.payload, state.serviceTier());
    return next === event.payload ? undefined : next;
  });

  pi.on("session_shutdown", async (_event, ctx) => {
    try {
      await persistIfEnabled();
    } catch (error) {
      notifyError(ctx, error);
    } finally {
      clearIndicator(ctx);
    }
  });
}
