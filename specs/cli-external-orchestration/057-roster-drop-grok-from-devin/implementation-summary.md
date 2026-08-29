---
title: "Implementation Summary: Drop the Grok 4.5 and 4.6 model families from the cli-devin skill and its executor roster"
description: "Removed the 7 bare devin-scoped Grok 4.5 and 4.6 model ids from the cli-devin executor allowlists and all skill docs, eliminating the misroute that sent a grok-4-6-xhigh dispatch to cli-devin."
trigger_phrases:
  - "grok devin removal summary"
  - "drop grok from devin result"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/057-roster-drop-grok-from-devin"
    last_updated_at: "2026-08-29T20:10:00Z"
    last_updated_by: "ai-agent"
    recent_action: "Filled all packet docs and completed the Grok removal from cli-devin allowlists and docs"
    next_safe_action: "Commit when operator approves"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-057-roster-drop-grok-from-devin"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 057-roster-drop-grok-from-devin |
| **Status** | Complete |
| **Completed** | 2026-08-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cli-devin allowlist advertised 7 Grok model ids that Devin cannot dispatch — Grok is Cursor-hosted. One of those ids (`grok-4-6-xhigh`) caused a real misroute: a dispatch intended for Cursor was sent to cli-devin. This change removes every bare devin-scoped Grok id from the executor allowlists and all skill docs so the roster tells the truth, while leaving every `cursor-grok-*` entry untouched.

### Grok Removal

Seven model ids — `grok-4-5-high`, `grok-4-5-low`, `grok-4-5-medium`, `grok-4-6-high`, `grok-4-6-low`, `grok-4-6-medium`, `grok-4-6-xhigh` — were removed from every allowlist, table, example, and prose reference in cli-devin's skill docs and runtime configuration. Recommendations that previously cited `grok-4-6-high` as the reasoning-heavy model now cite `deepseek-v4-pro-max` or `gpt-5-6-luna-max`, which are confirmed-present in Devin's live roster. The Cursor Grok allowlist (8 `cursor-grok-4.5-*` and `cursor-grok-4.6-*` entries) was not touched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modified | Removed 7 bare Grok ids from `DEVIN_SUPPORTED_MODELS` (lines 364-370 pre-edit) |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | Removed 7 bare Grok ids from `DEVIN_ALLOWED_MODELS` (lines 2003-2009 pre-edit) |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modified | Removed Grok ids from allowlist fixture (lines 1361-1362 pre-edit) |
| `.opencode/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md` | Modified | Removed 7 Grok table rows; updated family count (six→five); updated notes |
| `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` | Modified | Removed Grok from model-resolution table, curated family list, selection strategy, and rule 7 |
| `.opencode/skills/cli-external-orchestration/cli-devin/README.md` | Modified | Updated FAQ model recommendation from grok-4-6-high to deepseek-v4-pro-max |
| `.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md` | Modified | Removed/replaced Grok in usage examples, selection table, env var reference, and reasoning-effort prose |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pre-edit baseline grep counts were captured first (cursor-grok-4.6: 8 in each runtime file). Each file was read before editing. All 7 edits were made in a single session with the Edit tool. Post-edit: (1) grep confirmed zero bare devin Grok ids in all in-scope files; (2) cursor-grok counts confirmed unchanged at 8; (3) `npx vitest run` produced 112 passed / exit 0; (4) `validate.sh --strict` produced RESULT: PASSED. No commit or push was made (per operator instruction).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Replace grok recommendations with `deepseek-v4-pro-max` / `gpt-5-6-luna-max` | Both are confirmed-present in Devin's live roster and serve the same reasoning-heavy use cases; no information is lost to the operator |
| Leave `cli-devin/changelog/` untouched | Changelog files are a historical record; rewriting them would misrepresent what shipped at each version |
| Preserve all `cursor-grok-*` entries verbatim | A live deep-research run was dispatching `cursor-grok-4.6-xhigh` at the time of this change; removing any of those entries would have broken it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run` (fanout-run.vitest.ts) | PASS — 112 tests passed, exit 0 |
| `rg -c 'cursor-grok-4\.6' fanout-run.cjs` | PASS — count 8 (unchanged from baseline) |
| `rg -c 'cursor-grok-4\.6' executor-config.ts` | PASS — count 8 (unchanged from baseline) |
| `rg -n '(^|[^-])grok-4-[56]-' <in-scope files>` | PASS — only changelog/ hits remain; zero hits in runtime or skill docs |
| `validate.sh --strict` on packet folder | PASS — Errors: 0 Warnings: 3 RESULT: PASSED (exit 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Changelog accuracy** The `cli-devin/changelog/v1.3.0.0.md` still documents that Grok 4.6 was added — this is accurate as a historical record but can confuse a reader who sees Grok missing from the current roster. Workaround: note in changelog v1.4.0.0 (or equivalent) that Grok was subsequently removed.
2. **`deepseek-v4-pro-max` is list-verified only** The replacement model in recommendations was confirmed present in `devin models list` but not dispatch-tested. Operators should dispatch-test before relying on it for production reasoning-heavy tasks.
<!-- /ANCHOR:limitations -->

---


