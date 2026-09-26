# Iteration 9 — Cross-cutting sweep: plugin evidence, negative knowledge, claim upgrades

Focus: the OpenCode plugin (named in the reading list, unread until now), remaining reading-list
items, and re-checking weak claims from iterations 1-8.

## New evidence

### F9-1 — The advisor already ships one model-callable pull surface: the plugin status tool

- **Orchestrator mechanism** [CONFIRMED]: model-facing discovery/recovery tools are first-class —
  `skill_search` + `skill` stay always-active while other schemas are deferred
  (`context/pi-skill-orchestrator-main/src/index.ts:149-152`).
- **Advisor counterpart** [CONFIRMED, new this iteration]: the OpenCode plugin registers
  `spec_kit_skill_advisor_status` as a model-callable tool returning prompt-safe cache/runtime
  status (`.skilled/plugins/system-skill-advisor.js:1459-1497`), while the brief rides
  `experimental.chat.system.transform` (`plugin:1457`; corroborates `ARCHITECTURE.md:133`).
  The plugin additionally carries in-flight request coalescing (identical-key requests share one
  CLI spawn, `plugin:982`, `:985-986`), optional transform dedup
  (`plugin:390-391`, `:885`), and per-session directive dedup with epoch reset on lifecycle
  boundaries (`plugin:988-995`).
- **Proposed change**: extend the existing status-tool shape into the F3-1/F3-2 recommendation —
  one model-callable `advisor_recommend`-backed tool (or the named CLI in fallback text) on hook
  runtimes. The precedent means this is an extension of an existing pattern, not a new surface
  class.
- **Benefit**: uniform push+pull across runtimes; on OpenCode the pull channel already exists.
- **Cost**: small — the CLI contract is fixed (`ARCHITECTURE.md:29`).
- **Risk**: tool-schema cost on runtimes that bill active schemas (the extension's deferral
  problem in reverse — mitigate by registering the tool only where the brief failed or is absent).
- **Verdict: ADOPT** — strengthen F3-1's verdict: pull-beside-push is the advisor's own existing
  pattern, generalized.

### F9-2 — Deadline enforcement differs: hard-kill subprocess vs in-process await

- **Orchestrator mechanism**: n/a (no prompt-path advisor call in the extension).
- **Advisor counterpart** [CONFIRMED]: the plugin hard-bounds its CLI subprocess — SIGTERM shortly
  before the deadline, SIGKILL at it (`.skilled/plugins/system-skill-advisor.js:1009-1010`,
  `:1061-1078`). The Pi hook instead awaits the lifecycle module in-process for lower latency
  (`.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:41-50`, `:242-250`); an
  in-process await cannot be killed, so the 2500 ms envelope
  (`prompt-advisor.ts:189`) is only as strong as the lifecycle's internal budget
  [INFERRED — would confirm by instrumenting one slow daemon session and checking
  `durationMs > budgetMs` in the `advisor-debug` line].
- **Proposed change**: race the in-process advisor promise against a timer in the Pi hook and
  proceed with `advisorFailed = true` when the budget expires, mirroring the plugin's deadline
  semantics without giving up in-process speed.
- **Benefit**: the prompt path can no longer overshoot its envelope on a wedged daemon.
- **Cost**: one `Promise.race` + timeout handle.
- **Risk**: a timed-out advisor call keeps running in the background (unavoidable in-process);
  its result is discarded, matching fail-open semantics.
- **Verdict: ADOPT** — deadline discipline is a robustness invariant of every other adapter and
  should bind the in-process one too.

### F9-3 — Negative knowledge and claim upgrades

- **Reviewed with no verdict-changing content** [CONFIRMED by reading]: `docs/usage.md`,
  `docs/commands.md`, `docs/configuration.md`, `src/shortcuts.ts` (profile/group slash shortcuts,
  `shortcuts.ts:90-112`), `src/autocomplete.ts`, `src/ui.ts`, `src/notifications.ts` — manager
  UX and editor-side discovery, deliberately separate from model context
  (`context/pi-skill-orchestrator-main/docs/architecture.md:82-88`).
- **Upgraded claims**: F2-2's "OpenCode plugin appends the brief to the system prompt" is now
  CONFIRMED at `.skilled/plugins/system-skill-advisor.js:1457` (was CONFIRMED-via-ARCHITECTURE).
  F3-1's "pull surface already exists" is now strengthened by the in-product status-tool
  precedent (F9-1).
- **Deliberately not pursued** (negative knowledge):
  1. Running `advisor_recommend` for a live name-mention replay (would settle F6-1's inferred
     claim) — a CLI run spawns the daemon and writes runtime state outside this lineage's write
     surface; the phase spec confines lineage activity to read + lineage-local writes.
  2. Provider cache-pricing arithmetic for F2-1 — no provider price sheet exists in the repo.
  3. Token Saver internals beyond the lazy-discovery boundary (tool-schema deferral) — out of
     scope per the phase spec.
  4. Profiles/groups management UX port — configuration surface, not routing.

## Ruled out this iteration

- Re-verdicting F2-1..F8-4 — this sweep adds evidence and one new mechanism; the earlier verdicts
  stand (F3-1/F3-2 are strengthened, not changed).

## Claim ledger

| Claim | Status | What would confirm |
|-------|--------|--------------------|
| Plugin appends brief via system transform and exposes a model-callable status tool | CONFIRMED | — (`plugin:1457`, `:1459-1497`) |
| Plugin deadline is hard-enforced (SIGTERM/SIGKILL) | CONFIRMED | — (`plugin:1009-1010`, `:1061-1078`) |
| Pi hook's in-process await can exceed its budget on a wedged daemon | INFERRED | One instrumented slow session; `advisor-debug` shows `durationMs` vs `budgetMs` |
| Manager UX carries no model-context routing role | CONFIRMED | — (`docs/architecture.md:82-88`) |
