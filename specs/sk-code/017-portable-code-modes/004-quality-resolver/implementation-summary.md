---
title: "Implementation Summary"
description: "The quality runner's --explain now answers several files in one read-only call and, per file, names each surface's folder, each checklist's seat and its parsed rule overrides, so review can ask the runner instead of detecting surfaces itself."
trigger_phrases:
  - "quality resolver implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/004-quality-resolver"
    last_updated_at: "2026-10-27T23:00:00Z"
    last_updated_by: "implementer"
    recent_action: "Built the multi-file explain resolver and proved it against the HEAD runner"
    next_safe_action: "Conductor merges the child into the parent phase table and commits"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/references/runner-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "quality-resolver-implementer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-quality-resolver |
| **Status** | Complete |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now hand the quality runner a whole change in one `--explain` call and get back, for each file, the surfaces it resolves to, the folder each surface lives in and every checklist with its seat and its override section. A second path used to be a `USAGE` error.

### Quality resolver: multi-file explain with surface skill folders, checklist seats and rule overrides

The explanation reads the same facts, labels and checklist resolution a run reads, so it can never disagree with what a run does. One resolution covers every named file, and a declaration fault is an error exactly when some named file reaches it. A surface's folder comes from the declared-surfaces reader, so a `local-*` link counts only when the trusted-root rule accepts it, and a private surface that declares no `quality` block can still be loaded by its folder. Each checklist's `## Rule overrides` section is read through the shared linter, so a section with any error, such as one that drops a floor rule, is marked `refused` and a caller applies none of its rows.

A single-path call keeps every field it printed, in the same order, and gains `surface_skills`, `files` and three fields per checklist row. The run verdict is unchanged: the seats sit in a map beside the checklist list, which only the explanation reads.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Modified | `--explain` collects several paths; rows carry a seat; `surfaceSkills`, `overridesReader`, `explainFile` and a multi-file `explain` |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` | Modified | Six explain cases |
| `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` | Modified | The multi-file explain shape and its fields |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.13.3.0.md` | Created | Changelog entry |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modified | Version carrier stepped to 1.13.3.0 |
| `.hermes/skills/sk-code-quality/SKILL.md` | Modified | Hermes copy resynced |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The suite was baselined at 123 of 123 and the `HEAD` runner's single- and two-path behavior recorded first. The six cases were written against the changed runner, then run against the `HEAD` runner swapped in and restored, where all six failed. The full suite, a field-by-field comparison of single-path output against the `HEAD` runner on four real files and the quality gate on the two code files closed it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Several paths after the flag, and a repeated flag too | `--files` already reads a list after its flag, and a repeated flag costs nothing to accept |
| Keep the per-file fields at the top level only for one path | Every single-path caller keeps reading where it always read, while a multi-path call has no one file to put there |
| Seats in a map beside the checklist list | The run's checklist rows keep their exact shape; the only shared edits are a seat field on the internal rows in `checklistRows` and a seats map returned by `resolveChecklists`, which `runGate` ignores |
| `source` plus `sources` | Two seats can list one checklist for one file, and precedence between seats needs every one of them |
| The linter from the runner's own hub | A test hub moves the declarations only, so the grammar and the floor never move with them |
| No text form of `--explain` | The CLI documents `--explain` as JSON only, and adding a form was outside the brief's fields |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Six explain cases against the `HEAD` runner | `tests 6 pass 0 fail 6`, exit 1 |
| Six explain cases against the changed runner | `tests 6 pass 6 fail 0` |
| Full quality runner suite | Before `pass 123 fail 0`; after `tests 129 pass 129 fail 0`, exit 0 |
| Single-path output against `HEAD`, added fields removed | `SAME` on four files, both runners exit 2 |
| `--explain README.md AGENTS.md` | Before: `USAGE: unknown argument AGENTS.md`, exit 3. After: exit 2, two `files` entries |
| `quality-gate.cjs --files` on the two code files | `gate=NO_BLOCKER_FOUND exit=0`, `findings: 0` |
| `validate_document.py` on the contract and the changelog | `"total_issues": 0` for both |
| `sync-skills-hermes.cjs --check` | `PASS: 67 Hermes skill copies in sync` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The JSON names private folders.** `surface_skills[].folder`, a checklist's `path` and an outside row's `file` print a private skill's folder, as the run's JSON already does. The explanation is runtime output, and the contract tells callers to copy labels, never those paths, into tracked files.
2. **No caller reads it yet.** Review switches to this resolver in its own child, so until then review keeps its own detection.
<!-- /ANCHOR:limitations -->

---
