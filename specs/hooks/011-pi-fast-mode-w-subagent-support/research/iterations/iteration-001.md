# Iteration 1: pi Extension API Surface (fork enabling)

## Focus
Official pi Extension API surface for the fork pi-fast-mode-w-subagent-support (fork of pi-openai-fast-mode):
before_provider_request payload mutation semantics; session_start / model_select / session_shutdown ordering;
registerCommand / registerFlag; hasUI gating; ui.setWidget vs ui.setStatus rendering rules.
This is the approved focus-map lane 1 of 10. Primary authorities: the installed pi-coding-agent docs
(extensions.md) and the upstream pi-openai-fast-mode source snapshot in context/.

## Actions Taken
- Read config, state JSONL, strategy (iteration 1 of 10; no prior iteration records; focus override = lane 1).
- Verified packet-local write boundary: only the three artifacts named in the prompt pack are written; reducer-owned
  files (strategy, registry, dashboard) read-only; researched sources read-only.
- Read docs/extensions.md sections: UI examples (150-200), session lifecycle (281-347, 392-462), before_provider_request
  and model_select (655-765), hasUI (940-968), registerCommand (1498-1545), registerFlag (1624-1662).
- Read upstream source snapshot: pi-openai-fast-mode/src/index.ts, payload.ts, status.ts.
- No scope violations: no out-of-scope mutation attempted; no files outside the packet modified.

## Findings
1. before_provider_request payload mutation is REPLACE-style, not in-place. Handlers run in extension load order;
   returning undefined keeps the payload unchanged; returning any other value replaces the payload for later handlers
   and for the actual request. Payload-level rewrites are not reflected by ctx.getSystemPrompt().
   [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:678-705]
   Fork implication: the fast-mode hook must return a new object ({ ...payload, service_tier }) when it wants to change
   the payload, and return undefined (not a partial) when it does not. Matches upstream applyFastModePayload which
   spreads the payload and overrides service_tier.
   [SOURCE: specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/src/payload.ts:45-56]

2. Session lifecycle ordering is strict: startup order is factory await -> session_start(reason:"startup") ->
   resources_discover -> provider registration flush; before_provider_request fires per provider request during a turn;
   on /new or /resume pi emits session_shutdown for the OLD extension instance, reloads/rebinds extensions, then emits
   session_start with reason "new"|"resume" and previousSessionFile; /fork or /clone emits session_shutdown then
   session_start with reason "fork". model_select fires on model change via /model, Ctrl+P cycling, or session restore.
   [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:281-347, 392-432, 507-512, 713-736]
   Fork implication: in-memory fast-mode state (config, current model) must be reestablished in session_start and torn
   down in session_shutdown; per-session caches cannot live at module scope across switches.

3. model_select event surface: event.model (newly selected), event.previousModel (undefined on first selection),
   event.source in {"set","cycle","restore"}. Docs recommend it for updating status bars/footers.
   [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:713-736]
   Fork implication: the fast indicator (Q8 lane) and payload routing both key off the active model; model_select is the
   canonical UI refresh point, while before_provider_request is the canonical payload decision point.

4. registerCommand collision handling: if multiple extensions register the same command name, pi keeps ALL of them and
   assigns numeric invocation suffixes in load order (e.g. /fast:1, /fast:2) - no crash, no last-write-wins.
   [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:1498-1503]
   Fork implication: installing pi-fast-mode-w-subagent-support alongside pi-openai-fast-mode will NOT break startup,
   but the /fast command becomes ambiguous (/fast vs /fast:1) - verification of the effective command must use
   pi.getCommands() and check command.source and sourceInfo. (Feeds lane 5.)

5. registerFlag semantics: pi.registerFlag(name, {description, type: "boolean", default}) registers a CLI flag read via
   pi.getFlag(name). No duplicate-collision doc note found for flags; flags are global CLI surface, so the fork must
   keep its flag namespace distinct (feeds lane 3 env/flag hygiene).
   [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:1624-1640]

6. hasUI gating: ctx.hasUI is true in TUI and RPC modes, false in print mode (-p) and JSON mode. Docs direct guarding
   dialog methods (select/confirm/input/editor) AND fire-and-forget methods (notify, setStatus, setWidget, setTitle,
   setEditorText) which otherwise work in both TUI and RPC modes; in RPC mode some TUI-specific methods are no-ops or
   return defaults (rpc.md extension-ui-protocol). Upstream notifyError already applies the hasUI guard.
   [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:945-957]
   [SOURCE: specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/src/index.ts:27-33]

7. setStatus vs setWidget rendering rules: ctx.ui.setStatus(key, text) renders in the footer (single status line per
   key); ctx.ui.setWidget(key, content, options?) renders a widget ABOVE the editor by default, with an explicit
   placement option "aboveEditor" | "belowEditor". Widget content can be string[] lines or a component factory
   (render(width) -> string[], invalidate()) for custom components. Upstream status.ts types confirm the
   setWidget overloads and StatusContext.ui shape.
   [SOURCE: ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:150-170]
   [SOURCE: specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/src/status.ts:24-45]
   Fork implication: setStatus is the low-friction footer indicator path; setWidget with a component factory is the
   path for richer indicators but composes with the editor area, not with pi-statusline footers (feeds lane 8).

8. Upstream extension wiring pattern: createPiFastModeExtension(options) returns a factory that registers hooks at
   load; config is cloned in-memory and reloaded per session context (loadForContext with cwd); payload decision is
   getFastModePayload(config, model, payload) returning undefined (no change) or the replaced payload; status is
   updated via STATUS_KEY setStatus/clearFastStatus. This is the direct blueprint the fork extends.
   [SOURCE: specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/src/index.ts:40-58]
   [SOURCE: specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/src/payload.ts:57-70]
   [SOURCE: specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/src/status.ts:47-55]

## Questions Answered
- Q1 (pi Extension API surface): answered for the listed sub-questions - payload mutation semantics (replace-style,
  undefined passthrough), session ordering (shutdown then rebind then start; per-switch instance lifecycle),
  model_select surface, registerCommand collision behavior (suffix disambiguation), registerFlag surface,
  hasUI gating (TUI/RPC true, print/json false), setStatus (footer) vs setWidget (above/below editor).

## Questions Remaining
- Q2 Subagent handoff mechanics (pi-subagents child pi spawn, env propagation, PI_GPT_FAST_MODE)
- Q3 Env-var namespace hygiene (PI_* collision scan, naming conventions)
- Q4 Config compatibility and migration (pi-openai-fast-mode schema, models list)
- Q5 /fast command collision verification method (has foundation from finding 4)
- Q6 Packaging and install mechanics (pi.extensions, raw TS via jiti, publish)
- Q7 Testing patterns (ExtensionAPI mocks, vitest for raw TS)
- Q8 Indicator UX under custom footers (setFooter vs widget placement; needs rpc.md extension-ui-protocol detail)
- Q9 TheBinaryGuy pi-fast-mode edge cases (footer-composition wrapper, atomic writes, guards)
- Q10 Licensing, notices, docs, maintenance

## Next Focus
Lane 2 per approved queue: Subagent handoff mechanics - how pi-subagents spawns child pi processes, process.env
propagation, official env surface, PI_GPT_FAST_MODE behavior, toggle/session_start semantics.
Deferred sub-topic for lane 8: rpc.md extension-ui-protocol no-op behavior for setStatus/setWidget in RPC mode.

## Assessment
- New information ratio: 1.0 (8 of 8 findings fully new; first iteration, no prior packet evidence)
- Questions addressed: 1 (Q1); answered: 1 (Q1)
- Two independent sources (official docs + upstream source) corroborate findings 6, 7, 8; docs are authoritative for 1-5.

## Reflection
- What worked: reading the official extensions.md sections directly (not search) and triangulating with the upstream
  source snapshot gave precise, citable semantics with line anchors.
- What did not work: memory daemon lookup was unavailable at init (exit 75, recorded in strategy Known Context);
  not retried - direct packet context was sufficient.
- What I would do differently: next UI-focused iteration should read rpc.md extension-ui-protocol before finalizing
  the setWidget/setStatus recommendation, and should inspect pi-statusline internals for footer composition (lane 8).

## SCOPE VIOLATIONS
None. All researched paths were read-only; only the three allowed artifacts were written.

## Sources Consulted
- ~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md:150-200, 281-347, 392-462, 655-765, 940-968, 1498-1545, 1624-1662
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/src/index.ts:27-58
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/src/payload.ts:45-70
- specs/hooks/011-pi-fast-mode-w-subagent-support/context/pi-openai-fast-mode/src/status.ts:24-55
- specs/hooks/011-pi-fast-mode-w-subagent-support/research/deep-research-config.json
- specs/hooks/011-pi-fast-mode-w-subagent-support/research/deep-research-state.jsonl
- specs/hooks/011-pi-fast-mode-w-subagent-support/research/deep-research-strategy.md
