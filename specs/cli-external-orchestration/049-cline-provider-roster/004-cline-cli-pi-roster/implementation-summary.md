---
title: "Implementation Summary: Cline added to the cli-pi skill roster (xhigh-only)"
description: "The cli-pi mode roster now documents cline-pass DeepSeek V4 Flash in references/providers-and-models.md §2, dispatched only at --thinking xhigh — completing catalog parity with the cli-opencode entry."
trigger_phrases:
  - "cline cli-pi roster done"
  - "cli-pi cline-pass documented"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/004-cline-cli-pi-roster"
    last_updated_at: "2026-08-18T14:15:43Z"
    last_updated_by: "claude"
    recent_action: "cline-pass documented in the cli-pi roster, xhigh-only"
    next_safe_action: "None; packet complete pending operator key for a live dispatch"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-cline-cli-pi-roster |
| **Completed** | 2026-08-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cli-pi mode now documents the Cline provider in its own catalog. Phase 3 made `cline-pass/deepseek-v4-flash` a live pi provider; this phase records it where a dispatcher actually looks — the cli-pi provider roster — so the config-wired provider is discoverable from the mode's docs, matching what Phase 1 did for cli-opencode.

### The cline-pass roster section

`cli-pi/references/providers-and-models.md` §2 gained a `### cline-pass` section built on the same shape as the existing `### deepseek` entry: a one-line provider description, a note that it is a config-only provider (not a Pi builtin) cross-linked to `.pi/custom-providers.md`, the dispatch form `--provider cline-pass --model cline-pass/deepseek-v4-flash`, and a model row. The tier policy is the operator's constraint: DeepSeek V4 Flash here is dispatched **only at `--thinking xhigh`** — its top tier, with no `max` on this provider — and lower thinking levels are not supported for the entry. Since Pi's global `defaultThinkingLevel` is already `xhigh`, an unqualified dispatch lands on the right tier anyway.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modified | Added the `### cline-pass` roster section, xhigh-only |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Edited the roster doc directly, mirroring the neighboring `### deepseek` policy-line + table shape. The model id and tier were taken from the Phase 3 `.pi` config and the live `pi --list-models` row rather than assumed. cli-pi's SKILL.md and cli-reference.md already point to this roster as source of truth, so no parallel edits were needed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Document xhigh-only, not the full tier range | Operator policy: lower thinking levels are not supported for this entry; cline's Flash also has no `max` tier, so xhigh is its top |
| Roster section only, no SKILL.md / cli-reference.md edit | Unlike cli-opencode, cli-pi keeps its provider catalog solely in the roster; the other two docs defer to it, so a duplicate entry would drift |
| Mirror the `### deepseek` shape | Keeps the roster uniform and the new section immediately legible next to its siblings |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg '### cline-pass'` in the cli-pi roster | PASS (section present) |
| xhigh-only wording present | PASS (`only at --thinking xhigh`; no lower tiers) |
| Dispatch form present | PASS (`--provider cline-pass --model cline-pass/deepseek-v4-flash`) |
| Cross-link to `.pi/custom-providers.md` resolves | PASS (relative path checked with `ls`) |
| `validate.sh 049-cline-provider-roster --recursive --strict` | PASS (exit 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **List-verified, not dispatch-tested.** The model id and tier are confirmed against `pi --list-models`, but no live `pi --provider cline-pass ... --thinking xhigh` chat has run — that needs a real `CLINE_API_KEY` (the same operator step Phase 3 left open).
<!-- /ANCHOR:limitations -->
