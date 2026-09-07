---
title: "Implementation Summary"
description: "Every runtime now reaches the Gate 1 lookup: Codex and the shared Cursor rule carry a generated pointer block with a drift check, Pi is confirmed to inherit the root file, and the doctor reports reach per runtime."
trigger_phrases:
  - "gate 1 instruction parity"
  - "runtime instruction file drift"
  - "codex nodeterm block boundary"
  - "trigger index lookup pointer"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/013-gate1-instruction-parity"
    last_updated_at: "2026-09-07T15:05:55Z"
    last_updated_by: "template-author"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "Implement child 014"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:d1f51b63ce0af8d231a6665c16801eb026d0dc49ebbcf3a993c54d5592143999"
      session_id: "scaffold-013-gate1-instruction-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-gate1-instruction-parity |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Gate 1 trigger-index lookup was written once, in the root `AGENTS.md`, and the retrieval README said no other runtime carried a copy, which meant Codex, Cursor and Devin had no path to it. A generator now writes a marker-delimited pointer block, rendered from the root line, into `.codex/AGENTS.md` after the nodeterm-owned blocks and into `.cursor/rules/skill-routing.md`, the rule Cursor and Devin share; `--check` reports drift the way the mirror synchronizer does. Pi needed nothing: its resource loader reads `AGENTS.md` from the working directory, and `.pi/SYNC.md` now records that with its source. The doctor's retrieval workflow gained a `gate1_instruction_parity` signal, a phase 0 activity that checks each runtime's real surface, and a per-runtime `gate1_reach` output.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs` | Created | Generator with `--check`, `--root` for tests |
| `runtime/cli/tests/gate1-pointer-sync.vitest.ts` | Created | Drift, write, hand-edit, root-line follow and missing-source cases |
| `.codex/AGENTS.md`, `.cursor/rules/skill-routing.md` | Modified | Generated pointer blocks |
| `.pi/SYNC.md`, `.cursor/SYNC.md`, `.codex/SYNC.md` | Modified | Pi inheritance recorded; generated block described |
| `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml` | Modified | Signal, phase 0 activity, output |
| `runtime/cli/retrieval/README.md`, `runtime/cli/runtime-mirrors/README.md` | Modified | Single-surface claim corrected; generator listed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The Pi question was settled from the installed package rather than assumption: the README and the resource loader both list `AGENTS.md` as a context file loaded from the working directory. The nodeterm region of the Codex file was captured before the generator ran and compared after, byte for byte. The generator ran `--check` first, which reported both files as missing a block, then wrote, then reported PASS; the test repeats that sequence on a fixture repository and adds a hand-edit and a root-line change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Generate the block from the root line, never hand-copy it | Two copies of an instruction drift; one source and a checker do not |
| Append after the nodeterm markers, inside our own markers | The nodeterm region belongs to another tool; our block is the only text the generator ever rewrites |
| Leave Pi's hooks alone | Inheritance is a path, and it is the one Pi already has |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `sync-gate1-pointers.cjs --check` before and after the write | drift on both files, then PASS on 2 |
| `.codex/AGENTS.md` lines 1 to 122 before versus after | identical |
| `gate1-pointer-sync.vitest.ts` | 4 pass |
| `sync-runtime-mirrors.cjs --check` | PASS, 169 mirrors |
| `doctor-speckit-retrieval.yaml` | parses; signal, activity and output present |
| sk-doc validator on the three SYNC docs and two READMEs | VALID |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Devin's reach is through the Cursor rule.** It reads that file today; a Devin-native instruction surface would need its own target in the generator.
2. **The generator's `--check` is not yet a CI step.** The doctor and the test run it; the mirrors job can add it alongside child 014's registration check.
<!-- /ANCHOR:limitations -->

---
