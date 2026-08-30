---
title: "Implementation Summary: pi-cache-optimizer OpenRouter session-affinity compat"
description: "One provider-level compat override in models.json gives every OpenRouter model in pi session-affinity cache routing and clears the repeating pi-cache-optimizer warning; a sweep removed 44 stale stats temp files."
trigger_phrases:
  - "openrouter session affinity fix"
  - "pi-cache-optimizer warning cleared"
  - "models.json openrouter compat"
  - "stats tmp sweep done"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/013-pi-cache-affinity-compat"
    last_updated_at: "2026-08-29T20:05:00Z"
    last_updated_by: "pi-agent"
    recent_action: "Apply compat override and sweep tmp files"
    next_safe_action: "Optional follow-up: cline-pass provider compat tuning (see Known Limitations)"
    blockers: []
    key_files:
      - "Code_Environment/Public/.pi/models.json"
      - "~/.pi/agent/models-store.json"
      - "Code_Environment/Public/.opencode/specs/hooks/013-pi-cache-affinity-compat/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pi-openrouter-compat-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Provider-level vs single-model override: provider-level chosen so all ~200 catalog models inherit the flag"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-pi-cache-affinity-compat |
| **Completed** | 2026-08-29 |
| **Status** | Complete |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every OpenRouter model in pi now requests session-affinity routing, and the repeating pi-cache-optimizer warning is cleared at its root instead of model by model. A provider-level `compat: {"sendSessionAffinityHeaders": true}` block was added to `providers["openrouter"]` in `models.json`, so pi's merge (`provider-composer.js` → `applyModelsJson` → `mergeCompat`) applies it to all ~200 catalog models — including the reported `openrouter/z-ai/glm-5.3-flash` — without touching the existing deepseek `modelOverrides` entry. The `~/.pi/agent/` state directory was also cleared of 44 stale `pi-cache-optimizer-stats.json.*.tmp` files (~41 KB) left by interrupted atomic writes.

### Session-affinity cache routing

With the flag set, pi-ai's `openai-completions` adapter sends `x-session-id: <sessionId>` (format auto-detects to `"openrouter"` for openrouter.ai base URLs). OpenRouter can then pin one Pi session to the same upstream backend, which is what makes upstream prompt-cache hits repeatable — for `z-ai/glm-5.3-flash`, cacheRead is priced at $0.015/M vs $0.075/M input.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `Code_Environment/Public/.pi/models.json` (symlinked as `~/.pi/agent/models.json`) | Modified | Added `compat.sendSessionAffinityHeaders: true` to the openrouter provider block |
| `~/.pi/agent/pi-cache-optimizer-stats.json.*.tmp` (44 files) | Deleted | Swept stale abandoned stats temp files |
| `specs/hooks/013-pi-cache-affinity-compat/` | Created | This spec packet (Level 1) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Config-only change applied directly to the symlink target in the Public repo (git-tracked; revert with `git checkout`). Verification ran against pi's real merge code: a Node driver imports `composeModelProvider` from `dist/core/provider-composer.js`, merges the edited provider config over the genuine `z-ai/glm-5.3-flash` catalog entry (whose compat provably lacks the flag), and asserts the merged compat resolves to `true`. The tmp sweep ran only after confirming no stats temp file had been written in the preceding 10 minutes and that the canonical stats file and `stats.d/` shards stayed intact.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Provider-level override instead of single-model `modelOverrides` | All ~200 OpenRouter catalog models (present and future) inherit the flag from one block; the deepseek override keeps working untouched |
| Sweep restricted to `*.tmp` files | Canonical `pi-cache-optimizer-stats.json` and the `stats.d/shards/` store are live state; only abandoned atomic-write fragments were removed |
| cline-pass provider left untouched | Its models never produced the reported warning and it carries auth config; a same-shaped fix is recorded as follow-up instead of an in-scope change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `models.json` JSON validity (`JSON.parse` in driver) | PASS — exit 0 |
| Catalog premise: `z-ai/glm-5.3-flash` compat lacks the flag | PASS — `undefined` confirmed from `models-store.json` |
| Merged compat via pi's real `composeModelProvider` | PASS — `sendSessionAffinityHeaders === true` for `z-ai/glm-5.3-flash` |
| Warning condition eliminated (flag `=== undefined` no longer holds) | PASS — SC-001 |
| Regression: `~deepseek/deepseek-v4-flash-latest` override intact (`sendSessionAffinityHeaders: true`, `thinkingFormat: "deepseek"`) | PASS |
| Pre-sweep writer check (`-mmin -10` count) | PASS — 0 active writers |
| Post-sweep tmp count | PASS — 0 files remain; canonical stats file (2268 B) and `stats.d/` intact |
| `validate.sh <spec-folder> --strict` | PASS — exit 0 (see below) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **cline-pass provider still lacks the flag.** Its own `z-ai/glm-5.3-flash` copy (via `api.cline.bot`) would emit the same warning when used, and its deepseek models also lack `requiresReasoningContentOnAssistantMessages`. Left out of scope deliberately; a one-block compat addition to `providers["cline-pass"]` mirrors this fix if the user wants it.
2. **Affinity is advisory.** If an endpoint ignores or rejects `x-session-id`, behavior is unchanged (or the documented `false` opt-out applies); no live end-to-end request was sent to OpenRouter as part of this fix.
3. **Scaffolding tooling quirk (pre-existing, unrelated).** `create.sh`'s template renderer silently produced zero-byte docs because the tsx loader is missing from the Mobile CLI skill install and the CLI entry-point guard fails under Node type stripping. The docs here were rendered through the same renderer's export (`renderInlineGates`) driven directly; the inline renderer's CLI mode needs its `import.meta.url` guard fixed in a separate packet.
<!-- /ANCHOR:limitations -->

---
