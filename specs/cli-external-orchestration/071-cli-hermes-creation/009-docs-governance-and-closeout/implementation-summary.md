---
title: "Implementation Summary"
description: "Every prose surface that enumerated six external CLI modes now names cli-hermes, the hub and packet READMEs describe the shipped state, the deep-command contracts are recompiled, and the parent passes the recursive strict gate."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/009-docs-governance-and-closeout"
    last_updated_at: "2026-09-14T22:30:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Roster surfaces, READMEs, contracts and closeout gate done"
    next_safe_action: "None; packet closed"
    blockers: []
    key_files:
      - "README.md"
      - ".opencode/skills/cli-external-orchestration/README.md"
      - ".opencode/skills/cli-external-orchestration/cli-hermes/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-009-docs-governance-and-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No new repo rule is needed; the packet's hard rules carry the Hermes-specific constraints"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-docs-governance-and-closeout |
| **Completed** | 2026-09-14 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reader on any roster surface now finds seven external CLI modes, and the packet README says what shipped instead of what was planned.

### Phase 9: docs governance and closeout

You get `cli-hermes` beside its siblings in the four real orchestrate agent copies (Cursor and Devin are symlinks), the root and hub READMEs, the `AGENTS.md` agent-directory table (one row: Hermes has no agents folder, personas are inlined), the rewrite command, the five sibling packet READMEs, the council and benchmark docs, and the deep-research and deep-review presentations with an `H) cli-hermes` block; the three compiled deep-command contracts were regenerated and are drift-free. The packet README was rewritten in the readme template order with the four operator steps, the two-id roster, the `.hermes/` surface and the corrected `--yolo` semantics. No repo rule was added.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/agents/orchestrate.md`, `.claude/agents/orchestrate.md`, `.pi/agents/orchestrate.md`, `.codex/agents/orchestrate.toml` | Modified | seven modes |
| `README.md`, `.opencode/skills/cli-external-orchestration/README.md` | Modified | bullets, rows, counts |
| `AGENTS.md` | Modified | one Hermes row |
| `.opencode/commands/rewrite/response-by-external-agent.md` | Modified | seven skills, `hermes` engine id |
| `.opencode/commands/deep/assets/deep-{research,review}-presentation.txt`, `deep-{research,review}-auto.yaml` | Modified | `H) cli-hermes` block and notes |
| `.opencode/commands/deep/assets/compiled/*.contract.md` | Regenerated | digest-fresh |
| `cli-{opencode,claude-code,codex,cursor,devin}/README.md` | Modified | cross-runtime row |
| `.opencode/skills/cli-external-orchestration/cli-hermes/README.md` | Rewritten | shipped state |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A repo-wide grep for the six mode names produced the surface list; a roster lane edited the agent copies and READMEs through `sk-create-readme`, and the rest were edited in place after the lane reported them. The contracts were recompiled with the runtime's compiler and checked with its drift script.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No new repo rule | Phase 001 found nothing Hermes-specific beyond the packet's hard rules, and nothing later contradicted that |
| One `AGENTS.md` row instead of an agents directory | Hermes has no per-run persona surface; the row says so where every other runtime's directory is listed |
| Pre-existing validator findings left in place | The `AGENTS.md` overview gap and the orchestrate numbering predate this packet and are not its scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py` on the three READMEs | `Total issues: 0` each |
| `grep -n cli-pi <surface> \| grep -v cli-hermes` | only Pi's own lines remain on every surface |
| `check-contract-drift.cjs` | `[CONTRACT DRIFT] OK commands=3` |
| `validate.sh --recursive --strict` on the parent | every folder `RESULT: PASSED` (parent goal log) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`AGENTS.md` fails the document validator on a pre-existing missing overview section**, unrelated to the one added row.
2. **The orchestrate copies carry a pre-existing section-numbering warning.**
<!-- /ANCHOR:limitations -->

---
