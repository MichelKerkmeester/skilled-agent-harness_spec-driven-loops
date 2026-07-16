---
title: "Implementation Summary: Detection-Layer Sub-Agent-Routing Enforcement Plugin"
description: "Built .opencode/plugins/mk-deep-loop-guard.js (renamed 2026-07-01 from deep-route-guard.js), a tool.execute.before hook that flags Deep Route mode mismatches on Task dispatch. Live-tested against the real installed opencode CLI (not assumed): confirmed hook registration, confirmed throw-based rejection genuinely blocks dispatch, confirmed the default warn path doesn't, confirmed the fail-open guard, confirmed non-deep dispatches pass through untouched."
trigger_phrases:
  - "implementation"
  - "summary"
  - "deep route guard plugin"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/003-guard-and-enforcement/001-deep-route-guard-plugin"
    last_updated_at: "2026-07-01T20:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Renamed plugin to mk-deep-loop-guard.js; added tests; integrated F050/DLR-052"
    next_safe_action: "None -- packet complete"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-011-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Detection-Layer Sub-Agent-Routing Enforcement Plugin

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-deep-route-guard-plugin |
| **Completed** | 2026-07-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A new OpenCode plugin, `.opencode/plugins/mk-deep-loop-guard.js` (renamed 2026-07-01 from `deep-route-guard.js`; see Follow-Up below), that watches every `task`-tool dispatch and flags the case phases 008-010 fixed the *identity* for but nothing previously *enforced*: a model constructing a Task dispatch whose declared `mode=X` (from a Deep Route header embedded in the prompt) disagrees with what `mode-registry.json` says the target `subagent_type` should actually be. The central question research left open — can this actually block a bad dispatch, or only warn about it — is answered here with real evidence, not analogy: **both work**, and the plugin ships both as a configurable choice rather than picking one and discarding the other.

### The Hook

Registers on `tool.execute.before`. For any `task` dispatch: if `subagent_type` matches one of `mode-registry.json`'s 4 deep-mode entries, and the prompt text contains a `mode=X` token that disagrees with that entry's `workflowMode`, it flags the mismatch. Default behavior is mutate-and-warn (`console.error`, dispatch proceeds); setting `MK_DEEP_LOOP_GUARD_REJECT=1` (renamed 2026-07-01 from `DEEP_ROUTE_GUARD_REJECT`) switches to throw-based rejection.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/mk-deep-loop-guard.js` | Created | The plugin itself (renamed 2026-07-01 from `deep-route-guard.js`) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Before writing a line of plugin code, read the actual `@opencode-ai/plugin` SDK's type definitions (`node_modules/@opencode-ai/plugin/dist/index.d.ts`) to get the real hook signature — `"tool.execute.before"?: (input: {tool, sessionID, callID}, output: {args: any}) => Promise<void>` — rather than guessing from research's paraphrase of it. Then found this repo already has a live `.opencode/plugins/` directory with 5 working plugins and its own `README.md` stating the exact registration convention plainly: every `.js` file there auto-loads at session start, and a stray named export drops the *entire file* silently (each named export gets loaded as its own plugin, throws, and takes the real default export down with it). This resolved the plugin-home open question immediately — the repo already has an established convention, so the plugin (originally named `deep-route-guard.js`, renamed 2026-07-01 to `mk-deep-loop-guard.js`) joins it rather than inventing a new home.

Built the enforcement logic against `mode-registry.json`'s actual 4 entries (`agent -> workflowMode` map, loaded fresh on every hook call rather than cached, so a registry edit takes effect on the next dispatch without a plugin reload). Implemented both a warn path and a throw path from the start rather than picking one to test first, since the actual cost of building both was small and the answer to "which one works" was genuinely unknown going in.

Verification was entirely live, against the real installed `opencode` v1.17.11, not simulated:
1. **Hook fires + default warn path**: dispatched `subagent_type=ai-council` with a prompt containing `mode=research` (a deliberate mismatch) via `opencode run --agent general "...use the task tool..."`. The plugin's `[deep-route-guard] WARN: ...` line appeared in the log, and the `task` tool call completed normally.
2. **Throw path actually blocks**: re-ran the identical mismatched dispatch with `DEEP_ROUTE_GUARD_REJECT=1` set. The `task` tool call's status became `"error"`, and the calling agent's own final response explicitly said the dispatch "was blocked by deep-route-guard". This is the single most important, previously-unconfirmed fact in the whole plugin phase, and it's now settled by direct observation.
3. **Fail-open guard**: temporarily moved `mode-registry.json` out of the way, re-ran the same mismatched dispatch with reject mode still on. The task completed normally — confirming a missing/unreadable registry does not accidentally start blocking unrelated dispatches. Restored the registry file immediately after.
4. **Non-deep dispatch passes through**: with reject mode still on, dispatched `subagent_type=review` (not a registry entry). Completed normally — confirms the guard only acts on the 4 deep-mode agents, not every Task dispatch.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Kept both the warn path and the throw path, rather than removing one as the plan originally framed it | Both are genuinely, separately confirmed working — deleting a working, useful capability (observability-only warn mode for cautious rollout, hard reject for stricter enforcement) just because the plan assumed only one would survive testing would throw away real value for no reason. Documented as an intentional deviation from the plan's literal "remove the unused path" instruction. |
| Read `mode-registry.json` fresh on every hook invocation rather than caching it at plugin load time | A registry entry could change between sessions (e.g., mid-development of a future 5th deep mode); a stale cache would silently miss the update. The file is small (single-digit KB) and read once per Task dispatch, not per token — negligible cost. |
| Used `.opencode/plugins/mk-deep-loop-guard.js` (originally `deep-route-guard.js`) rather than nesting under `system-skill-advisor` | The repo already has an established, documented convention (5 existing plugins, explicit README) for exactly this kind of standalone hook — following it is lower-risk and more discoverable than introducing a second plugin-mounting convention. |
| Verified live against the real `opencode` binary rather than reasoning from SDK types alone | The SDK's TypeScript signature says the hook returns `Promise<void>` with no documented throw/reject contract — whether a thrown error actually propagates to block execution is a host runtime behavior, not something the type system settles. This was exactly the question research flagged as unconfirmed; only a real dispatch attempt could answer it. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Hook registers and fires on real Task dispatch | PASS — `[deep-route-guard] WARN: ...` appeared in live output |
| Default (warn) path does not block dispatch | PASS — `task` tool status `"completed"` |
| `DEEP_ROUTE_GUARD_REJECT=1` throw path blocks dispatch | PASS — `task` tool status `"error"`, agent confirmed the block in its own reply |
| Fail-open guard (registry temporarily missing, reject mode on) | PASS — dispatch completed normally, not blocked |
| Non-deep-mode dispatch (`subagent_type=review`) passes through, reject mode on | PASS — dispatch completed normally, "OK" reply |
| `bash validate.sh --strict` on this phase folder | PASS, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Detection depends on the Deep Route header's `mode=X` text actually appearing in the prompt.** If a dispatching agent omits the header entirely (rather than getting it wrong), the plugin has nothing to compare against and stays silent — it catches disagreement, not absence.
2. **Cannot create hard runtime identity** (research's confirmed limit) — this remains FIX-5/host territory, addressed only by phase 013's conditional gate, not this plugin.
3. **Does not catch a schema-valid, route-matched artifact that internally does semantically wrong-mode work** (research's confirmed limit) — the guard only compares declared identity fields, not actual task content.
4. **The mode-mismatch regex (`/mode=([a-z0-9-]+)/i`) is a simple text match, not a structured parse** of the Deep Route header format. A prompt containing an unrelated `mode=` substring (unlikely but possible in adversarial or unusual prose) could produce a false positive warn/reject. Low risk given the header format is machine-generated by orchestrate/deep.md, not user-authored, but worth noting.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:followup -->
## Follow-Up: sk-code Alignment Pass (2026-07-01)

Invoked `sk-code` (OpenCode surface, JavaScript language) to verify the plugin against this repo's actual conventions rather than assuming the first draft was idiomatic. Compared against `references/opencode/javascript/{style_guide,quality_standards}.md` and the 5 sibling files already in `.opencode/plugins/`. Found and fixed 3 real deviations:

1. **Directory resolution was fragile.** The original computed `REPO_ROOT` by climbing 2 directories up from the plugin file's own location (`dirname(fileURLToPath(import.meta.url))` + `resolve(..,'..','..')`) — this breaks if the plugin is ever loaded from a different path. 4 of the 5 sibling plugins (`mk-code-graph.js`, `mk-goal.js`, `mk-skill-advisor.js`, `mk-spec-memory.js`) instead accept the OpenCode-provided `ctx` parameter and use `ctx?.directory || process.cwd()` — the runtime's own guaranteed-correct project directory. Switched to this pattern; also let this simplify away the `fileURLToPath`/`dirname`/`resolve` imports entirely (only `join` was still needed).
2. **Missing JSDoc `@param`/`@returns` tags.** `quality_standards.md` §5 requires them on exported functions; the original had only a prose description. Added both, matching `mk-code-graph.js`'s own documented export as the closest real precedent.
3. **One line at 207 characters** (the mismatch-detail message), well over the style guide's 100-char maximum. Extracted into a small `mismatchDetail()` helper building the string from an array of shorter fragments.

Verified the fixes didn't regress behavior: re-ran the same live warn-mode and reject-mode dispatches from the original verification — both still fire identically (`[deep-route-guard] WARN: ...` in warn mode; `task` tool status `"error"` in reject mode). Ran `check-comment-hygiene.sh` (PASS, 0 violations) and `verify_alignment_drift.py --root .opencode/plugins` (PASS, 0 findings across 12 scanned files) per `sk-code`'s mandated OPENCODE verification steps.

## Follow-Up: Plugin Rename (2026-07-01)

Renamed the plugin file, per explicit operator instruction, from `deep-route-guard.js` to `mk-deep-loop-guard.js` for `mk-*` naming-convention parity with 4 of the repo's other 5 `.opencode/plugins/` entries (`mk-code-graph.js`, `mk-goal.js`, `mk-skill-advisor.js`, `mk-spec-memory.js`).

Changes: `git mv .opencode/plugins/deep-route-guard.js .opencode/plugins/mk-deep-loop-guard.js`; renamed the default-export function, the `console.error` log prefix (`[deep-route-guard]` → `[mk-deep-loop-guard]`), and the reject-mode env var (`DEEP_ROUTE_GUARD_REJECT` → `MK_DEEP_LOOP_GUARD_REJECT`) to match. Every mention of the old name/env-var/log-prefix earlier in this document (What Was Built, How It Was Delivered, Key Decisions, Verification) is a verbatim historical record of the original 2026-07-01 build/verification pass and is preserved as-is; only forward-pointing "current file location" references were updated to the new name.

Fresh live re-verification under the new name (`opencode run --agent general "...use the task tool..."`, same 4 scenarios as the original Verification table): hook fires and logs `[mk-deep-loop-guard] WARN: ...` on mismatch in default warn mode; `MK_DEEP_LOOP_GUARD_REJECT=1` reproduces the throw-based block (`task` tool status `"error"`); fail-open on a missing/unreadable `mode-registry.json` confirmed unchanged; non-deep `subagent_type` passthrough confirmed unchanged.

Added genuine hermetic automated test coverage (previously live-verification only): `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs`, following the existing `__tests__/*.test.cjs` convention used by `mk-goal.js`. Covers export shape, non-task/unknown-`subagent_type`/matching-mode/no-mode-declared no-ops, mismatch+warn (captures `console.error`, asserts message pattern), mismatch+reject (`assert.rejects`), and fail-open (registry deleted, reject mode on, must not throw). Confirmed passing: `node .opencode/plugins/tests/mk-deep-loop-guard.test.cjs` exits 0, "all assertions passed".

Also integrated into `deep-loop-runtime`'s testing surfaces per the same instruction: new feature-catalog entry `feature_catalog/validation/mk-deep-loop-guard.md` (Feature ID F050) and manual-testing-playbook entry `manual_testing_playbook/validation/mk-deep-loop-guard.md` (Playbook ID DLR-052), both cross-referencing the complementary `post-dispatch-validate.md` (F005/DLR-005) entry. Root index files (`feature_catalog.md`, `manual_testing_playbook.md`) updated: new H3 sections, category/global scenario counts (49→50 features, 51→52 scenarios), and a new DLR-052 row in the Feature Catalog Cross-Reference Index table.
<!-- /ANCHOR:followup -->
