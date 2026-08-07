---
title: "Implementation Summary: Code README Truth And Missing Orientation"
description: "In Progress build receipt for source-derived README repairs, truth gates, orientation READMEs, and verification evidence."
trigger_phrases:
  - "code readme truth implementation"
  - "readme gate receipts"
  - "missing orientation implementation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation"
    last_updated_at: "2026-08-02T11:40:04Z"
    last_updated_by: "build-leaf"
    recent_action: "Completed the source-derived README repairs and recorded verification receipts"
    next_safe_action: "Review the In Progress handoff and structural follow-up"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

Status: In Progress. This build leaf made no git commit, as requested.

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-code-readme-truth-and-missing-orientation |
| **Verified** | 2026-08-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The README set now derives inventory claims from source, and two runnable gates prevent the two recurring failure modes: broken path references and retyped numeric counts. The four new orientation READMEs explain the authored/generated boundaries that were previously undiscoverable.

### Truth gates

`check_readme_references.py` resolves links and path-like commands from each README's own directory and supports explicitly marked example fences. `check_derived_readme_counts.py` fails stale or unparseable numeric inventory claims unless the source inventory independently supports the value.

### README repairs and orientation

The four wave-1 READMEs and twelve wave-2 READMEs were re-derived from directory listings, loader/config files, symlink targets, and implementation files. The doctor scripts finding was refuted at source and its README was not changed. Target orientation READMEs were added for `authored-brand`, `runtime-mirrors`, and `command-bridges`, plus the required minimal parent orientation at `sk-design/shared/README.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py` | Created | Gate README links, inline paths, commands, and symlink targets |
| `.opencode/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py` | Created | Gate derived file and suite inventory claims |
| Wave-1 and wave-2 README files in the scoped packet | Modified | Replace broken links, stale inventories, and unavailable surfaces |
| Four orientation `README.md` files | Created | Orient missing folders and their authored/generated boundaries |
| Two existing parent README files | Modified | Add the two required discoverability rows |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The pre-fix output was captured for the 20-file verification set before repairs: the reference gate reported `pass=1 fail=19`, and the count gate reported `pass=0 fail=20`. After the repairs, both gates were run from the repository root and from `/private/tmp`; each run reported `SUMMARY files=20 pass=20 fail=0`. The code-folder validator was run on the three target new READMEs and the required shared parent orientation, with four runs reporting `Total issues: 0`.

Claims were written from source reads rather than the previous README wording. The five-file source audit covered the installer directory and symlink targets, the agent-improvement tests, the benchmark tests, plugin tests, and command-bridges source/config. The refuted doctor README was included in the 20-file gate set as a no-change cross-check.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Leave `install-chrome-devtools.sh` unavailable and document the broken target | The symlink target is absent; presenting it as an available installer would preserve the original operator hazard. |
| Treat the doctor README as refuted | Source inspection found all eleven current top-level entrypoints documented, so editing it would add churn rather than remove a defect. |
| Use a shape-conditional code-folder README | A layered folder gets a tree; a flat folder gets a complete file inventory, matching the upstream 001 ruling. |
| Mark unavailable Vitest commands as examples | This checkout has no local Vitest executable, so the READMEs must not imply an executed green result. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Referenced-path gate over 20 files | PASS; `SUMMARY files=20 pass=20 fail=0`, rc 0 |
| Derived-count gate over 20 files | PASS; `SUMMARY files=20 pass=20 fail=0`, rc 0 |
| Same gates from non-repository-root CWD | PASS; both summaries remain `files=20 pass=20 fail=0` |
| Gate self-tests | PASS; positive, negative, example-fence, stale, and unparseable cases covered |
| Code-folder validator | PASS; four README runs, `Total issues: 0`, rc 0 |
| Git-hook worktree harness | PASS; linked-worktree and `core.hooksPath` checks |
| Memory drift marker lock harness | PASS; all seven producer scenarios |
| Pre-push harness | PASS; `PASS=21 FAIL=0` |
| Create-skill test command | PASS; all nine Node test files returned rc 0 |
| Strict packet validator | PASS; `Errors: 0`, `Warnings: 0`, rc 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Vitest dependency unavailable locally.** The two Vitest commands were attempted; no local executable was available, and the README commands are explicitly marked as examples. The benchmark `npx --no-install` attempt timed out without output.
2. **Structural sweep remains with phase 003.** This leaf did not claim a repo-wide tree, separator, or heading-conformance sweep.
3. **Codex hook configuration drift is external.** `install-codex-hooks.mjs --check --allow-worktree` reports drift in `/Users/michelkerkmeester/.codex/hooks.json`; that global file was not modified.
4. **No commit or push was created.** The current worktree diff is the handoff receipt.
<!-- /ANCHOR:limitations -->
