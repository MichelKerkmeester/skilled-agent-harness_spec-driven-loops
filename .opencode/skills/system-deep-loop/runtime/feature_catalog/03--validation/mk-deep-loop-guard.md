---
title: "mk-deep-loop-guard"
description: "Detection-layer OpenCode plugin with two checks: flags/blocks a Task dispatch whose declared Deep Route mode disagrees with mode-registry.json's entry for the resolved target agent, and flags/blocks a session-scoped loop-like repeated orchestrate-to-command-owned-loop-executor dispatch. Also sweeps/archives/prunes its own per-session state so its directory does not grow unbounded."
trigger_phrases:
  - "mk-deep-loop-guard"
  - "deep route guard plugin"
  - "tool.execute.before dispatch guard"
  - "Deep Route mode mismatch detection"
  - "loop-like repeated dispatch detection"
  - "loop-guard state cleanup"
  - "loop-guard state retention"
version: 1.2.0.0
---

# mk-deep-loop-guard (tool.execute.before plugin)

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Detection-layer enforcement for Task-tool dispatches targeting deep-loop sub-agents, with two independent checks. **Check 1 (mode-mismatch)**: on every `task` dispatch, the plugin resolves the real target agent (see Identity resolution below) against `mode-registry.json` and compares it to any `mode=X` value declared in the dispatch prompt's Deep Route header; a mismatch is flagged. **Check 2 (loop-repeat)**: the plugin also tracks, per session, how many times `orchestrate` has hand-dispatched the same command-owned loop executor (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`) without a command-driven iteration marker in the prompt; repeated hand-offs are flagged as loop-like.

This feature belongs to the validation group and is catalogued as F050 in the `runtime/` inventory. It complements `post-dispatch-validate.ts` (F005) from the opposite direction: that validator inspects the JSONL record a dispatch already produced; this plugin inspects the dispatch args *before* the call executes.

---

## 2. HOW IT WORKS

### Identity resolution

`orchestrate.md`'s own dispatch convention sets `subagent_type: "general"` on every Task call regardless of target (the specialized agent's identity travels via `Agent: @X` / `Deep Route: ... target_agent=@X` text in the prompt body instead). `resolveTargetIdentity()` parses these prompt-text fields first, falling back to the raw `subagent_type` only when it isn't the generic `"general"` placeholder (covering callers that set it directly, e.g. this repo's own fan-out lineage prompts). Both checks below share this resolution step.

### Check 1: mode-mismatch detection

For each `task` dispatch, the plugin reads `mode-registry.json` fresh (no caching), maps `agent -> workflowMode`, and extracts a `mode=X` token from the outgoing prompt text via regex. If the resolved target isn't a registry entry, or no `mode=X` token is present, or the mode matches, this check is a no-op.

### Check 2: loop-repeat detection

For dispatches targeting a command-owned loop executor, the plugin persists a session-scoped dispatch count at `.opencode/skills/.loop-guard-state/{hex(sessionID)}.json` (atomic temp-file-then-rename write, following the `mk-goal.js` precedent). A dispatch carrying an `Iteration: N of M` or `STATE SUMMARY` marker is recognized as command-driven (owned by the parent `/deep:*` command's own loop) and never increments the count. Non-command-driven dispatches: 1st is silent, 2nd+ warns, 3rd+ additionally blocks when `MK_DEEP_LOOP_GUARD_REJECT_LOOP=1` is set. Counts are isolated per `sessionID` and reset per target-agent.

### Warn vs. reject

Default behavior for both checks is mutate-and-warn: on a mismatch or loop-repeat, the plugin appends a `[mk-deep-loop-guard] WARN: ...` line to `.opencode/skills/.loop-guard-state/guard-warnings.log` (never to stdout/stderr, which OpenCode's TUI paints onto the prompt input line during `tool.execute.before`) and lets the dispatch proceed. `MK_DEEP_LOOP_GUARD_REJECT=1` switches Check 1 to fail-closed; `MK_DEEP_LOOP_GUARD_REJECT_LOOP=1` independently switches Check 2 to fail-closed. Both throw-blocks-dispatch mechanisms are confirmed via live testing against the installed OpenCode host — throwing from `tool.execute.before` genuinely prevents the underlying tool call from executing, not merely logging a warning.

### Fail-open guard

Any internal error in either check (missing/unreadable registry, unexpected arg shape, unwritable loop-guard state directory) is swallowed and treated as a no-op — a bug in this plugin must never block an unrelated, correctly-routed dispatch.

### Hard limits (by design)

Cannot create hard runtime identity (that remains host/FIX-5 territory). Does not catch a schema-valid, route-matched artifact that internally does semantically wrong-mode work — it only compares declared identity fields, not actual task content. Loop-repeat detection is session-scoped and per-target-agent; it cannot detect a cross-executor meta-loop (e.g. `deep-research`, then `deep-review`, then `deep-research` again) — only repeated hand-offs to the SAME executor.

### State-directory cleanup (sweep, archive, prune)

Mirrors the `mk-goal.js` retention pattern. On every `session.created` event (a new `event` hook), the plugin sweeps `.opencode/skills/.loop-guard-state/` for per-session state files untouched past `MK_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS` (default 2 days) and archives them into `.loop-guard-state/.archive/`, then prunes (deletes) archived files untouched past `MK_DEEP_LOOP_GUARD_ARCHIVE_RETENTION_DAYS` (default 90 days). The sweep itself is throttled to once per `MK_DEEP_LOOP_GUARD_SWEEP_INTERVAL_MS` (default 1 hour) via an in-memory per-plugin-instance timestamp. `guard-warnings.log` gets the same whole-file rotation as `mk-goal.js`'s JSONL logs: if it has gone untouched past the archive-retention window, it is deleted before the next append rather than growing forever.

Unlike `mk-goal.js`, this plugin needs no per-session mutation queue to make the sweep safe: every state-touching operation here is synchronous (`readdirSync`/`statSync`/`renameSync`/`writeFileSync`), and neither this hook nor `tool.execute.before` ever `await`s before touching a state file, so Node's single-threaded execution model already guarantees a sweep in progress cannot interleave with a concurrent dispatch's write.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/plugins/mk-deep-loop-guard.js` | Script | OpenCode plugin entrypoint; registers the `tool.execute.before` hook; implements identity resolution and both checks. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs` | Automated test | Hermetic regression coverage for export shape, identity resolution, both warn/reject toggles, command-driven/non-loop-executor exemptions, cross-session isolation, and both fail-open paths, run against a fixture registry (no live OpenCode session required). |

Live-verified against a real `opencode` session during development (hook registration, warn-mode logging, reject-mode blocking for both checks, fail-open on a missing registry, and pass-through for non-deep `subagent_type` values) — see `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability/003-guard-and-enforcement/001-deep-route-guard-plugin/implementation-summary.md` (original mode-mismatch build) and `031-deep-loop-gpt-reliability/003-guard-and-enforcement/003-loop-guard-implementation/implementation-summary.md` (identity-resolution fix + loop-repeat detection) for the full evidence trail.

---

## 4. SOURCE METADATA

- Group: Validation
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F050
- Feature file path: `03--validation/mk-deep-loop-guard.md`
- Primary sources: `.opencode/plugins/mk-deep-loop-guard.js`, `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs`

Related references:
- [post-dispatch-validate.md](post-dispatch-validate.md) — the post-dispatch counterpart this plugin complements from the pre-dispatch side.
