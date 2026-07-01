---
title: "mk-deep-loop-guard"
description: "Detection-layer OpenCode plugin that flags/blocks a Task dispatch whose declared Deep Route mode disagrees with mode-registry.json's entry for the actual subagent_type being dispatched."
trigger_phrases:
  - "mk-deep-loop-guard"
  - "deep route guard plugin"
  - "tool.execute.before dispatch guard"
  - "Deep Route mode mismatch detection"
version: 1.0.0.0
---

# mk-deep-loop-guard (tool.execute.before plugin)

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Detection-layer enforcement for Task-tool dispatches targeting deep-loop sub-agents. On every `task` dispatch, the plugin resolves the target `subagent_type` against `mode-registry.json` and compares it to any `mode=X` value declared in the dispatch prompt's Deep Route header; a mismatch is flagged.

This feature belongs to the validation group and is catalogued as F050 in the `deep-loop-runtime` inventory. It complements `post-dispatch-validate.ts` (F005) from the opposite direction: that validator inspects the JSONL record a dispatch already produced; this plugin inspects the dispatch args *before* the call executes.

---

## 2. HOW IT WORKS

### Detection

For each `task` dispatch, the plugin reads `mode-registry.json` fresh (no caching), maps `agent -> workflowMode`, and extracts a `mode=X` token from the outgoing prompt text via regex. If the target `subagent_type` isn't a registry entry, or no `mode=X` token is present, or the mode matches, the plugin is a no-op.

### Warn vs. reject

Default behavior is mutate-and-warn: on a mismatch, it logs `[mk-deep-loop-guard] WARN: ...` and lets the dispatch proceed. Setting `MK_DEEP_LOOP_GUARD_REJECT=1` switches to fail-closed: the hook throws, which blocks the dispatch (confirmed via live testing against the installed OpenCode host — throwing from `tool.execute.before` genuinely prevents the underlying tool call from executing, not merely logging a warning).

### Fail-open guard

Any internal error (missing/unreadable registry, unexpected arg shape) is swallowed and treated as a no-op — a bug in this plugin must never block an unrelated, correctly-routed dispatch.

### Hard limits (by design)

Cannot create hard runtime identity (that remains host/FIX-5 territory). Does not catch a schema-valid, route-matched artifact that internally does semantically wrong-mode work — it only compares declared identity fields, not actual task content.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/plugins/mk-deep-loop-guard.js` | Script | OpenCode plugin entrypoint; registers the `tool.execute.before` hook. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/plugins/__tests__/mk-deep-loop-guard.test.cjs` | Automated test | Hermetic regression coverage for export shape, warn/reject toggle, fail-open, and non-deep passthrough, run against a fixture registry (no live OpenCode session required). |

Live-verified against a real `opencode` session during development (hook registration, warn-mode logging, reject-mode blocking, fail-open on a missing registry, and pass-through for non-deep `subagent_type` values) — see `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/011-deep-route-guard-plugin/implementation-summary.md` for the full evidence trail.

---

## 4. SOURCE METADATA

- Group: Validation
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F050
- Feature file path: `03--validation/mk-deep-loop-guard.md`
- Primary sources: `.opencode/plugins/mk-deep-loop-guard.js`, `.opencode/plugins/__tests__/mk-deep-loop-guard.test.cjs`

Related references:
- [post-dispatch-validate.md](post-dispatch-validate.md) — the post-dispatch counterpart this plugin complements from the pre-dispatch side.
