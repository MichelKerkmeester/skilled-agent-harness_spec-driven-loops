---
title: "Implementation Summary: OpenRouter models on cli-pi/cli-opencode"
description: "Closeout for adding OpenRouter-routed DeepSeek Flash latest + GPT-5.6 Luna to the cli-pi and cli-opencode rosters."
trigger_phrases:
  - "cli-pi opencode openrouter roster summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/cli-external-orchestration/047-cli-pi-opencode-openrouter-roster"
    last_updated_at: "2026-08-17T18:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Added both OpenRouter ids to cli-pi runtime and both skills' rosters."
    next_safe_action: "Generate metadata and validate; then Packet B (forced-depth wiring fix)."
    blockers: []
    key_files:
      - "specs/cli-external-orchestration/047-cli-pi-opencode-openrouter-roster/implementation-summary.md"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-ext-047-openrouter-roster"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 047-cli-pi-opencode-openrouter-roster |
| **Status** | In Progress |
| **Level** | 1 |

The runtime edits, docs, and tests are done and verified; the commit on v4 is the remaining step.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both CLIs can now dispatch **DeepSeek V4 Flash latest** and **GPT-5.6 Luna through OpenRouter**, as distinct roster entries alongside the existing non-OpenRouter ones.

### Fix evidence

| Edit | Artifact | Result |
|------|----------|--------|
| cli-pi allowlist | `executor-config.ts` `PI_SUPPORTED_MODELS` | 11 ids (added the two OpenRouter literals) |
| cli-pi mirror + routing | `fanout-run.cjs` `PI_ALLOWED_MODELS` + `PI_MODEL_PROVIDERS` | both ids → `openrouter` |
| Flash max-pin | `isFlashMaxPinnedModel` (both files) | `-latest` variant now matches → `--thinking max` |
| cli-pi docs | `cli-pi/references/providers-and-models.md` | `### openrouter` sub-section; 5→6 providers |
| cli-opencode docs | `cli-opencode/{references/providers-and-models.md, SKILL.md, references/cli-reference.md}` | OpenRouter rows + auth enumeration |
| Tests | `executor-config.vitest.ts`, `fanout-run.vitest.ts` | roster-exact updated (11); dispatch + pin coverage added |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

cli-pi enforces its roster in three synchronized spots; both OpenRouter ids were added to each, keeping the TS source and its CJS mirror aligned (a dedicated test asserts that alignment). The model literal keeps its upstream provider path, so `PI_MODEL_PROVIDERS` supplying `openrouter` lets `buildPiLineageCommand` compose the 3-segment `openrouter/deepseek/deepseek-v4-flash-latest` selector; a builder test verifies both the selector and the `--thinking max` pin. cli-opencode has no runtime gate, so only its docs changed. The stale "five providers" claim (both CLIs actually authenticate six, including OpenRouter) was corrected. The two roster-exact test assertions were updated to the new 11-id list and given positive coverage for the new ids.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Distinct slash-in-id allowlist keys | The OpenRouter route must not collide with the existing opencode-go/openai-codex entries for the same model names |
| Extend the Flash max-pin to `-latest` | The `-latest` variant is the same reasoning family and must dispatch at max thinking |
| Docs-only for cli-opencode | It has no model allowlist; `--model` passes through verbatim |
| Leave the cli-devin test failure alone | Pre-existing `--respect-workspace-trust` drift in a different subsystem — fixing it would breach scope lock |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check fanout-run.cjs` | exit 0 |
| `tsc --noEmit` (runtime) | no errors in touched files |
| `executor-config.vitest.ts` | green (roster-exact 11 ids; pin coverage) |
| `fanout-run.vitest.ts` | green (allowlist alignment; dispatch + pin) |
| OpenRouter rows | present in both `providers-and-models.md` |
| cli-devin representative-args test | pre-existing failure, unrelated (HEAD already emits the flag) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- The two ids are validated at the command-builder layer, not by a live OpenRouter dispatch in this packet (a live dispatch happens in the follow-on deep-research run).
- One unrelated runtime test (`combo-matrix.vitest.ts` cli-devin representative args) fails pre-existing; out of scope for this roster change.
- `description.json` / `graph-metadata.json` are conductor-generated, not hand-authored.
- The changes are uncommitted pending an explicit commit instruction.
<!-- /ANCHOR:limitations -->
