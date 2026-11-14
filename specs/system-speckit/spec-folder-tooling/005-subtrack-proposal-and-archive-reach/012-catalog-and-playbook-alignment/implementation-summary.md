---
title: "Implementation Summary"
description: "The relocation, lifecycle, proposal and archive search catalog pages and three playbook scenarios now describe what the tools do after phase 011, and the new playbook steps were run as written."
trigger_phrases:
  - "catalog and playbook alignment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/012-catalog-and-playbook-alignment"
    last_updated_at: "2026-11-14T16:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Aligned four catalog pages and three playbook scenarios"
    next_safe_action: "Build phase 013-skill-docs-and-housekeeping"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md"
      - ".skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-packet-relocation.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-catalog-and-playbook-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-catalog-and-playbook-alignment |
| **Completed** | 2026-11-14, branch `worktrees/378-relocate-restore-fixes` |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The catalog and playbook rows of the DeepSeek review are fixed, plus the NNN-slug no-map case from the Fable review.

### Phase 12: catalog-and-playbook-alignment

- **Relocation catalog page.** All four exit statuses, with 3 as a landed run whose only failure is a moved packet's `RESULT: FAILED`. The rewrite step names the bare-name, re-parent phase-row and pre-archive id passes. The resume paragraph covers the late-step flags, a stopped re-parent and a validator that never reported. The sources list `relocate-real-pipeline.vitest.ts`.
- **Lifecycle catalog page.** A restore whose relocation exits 3 is reported as restored with a warning and exits 0, and a restore into a track with sub-tracks is refused without running `relocate.mjs`.
- **Archive search catalog page.** The path recipe's JSON record adds `archivedPaths`, and `paths` stays plain strings.
- **Proposal catalog page.** The NNN-slug refusal is the fourth case with no map.
- **Scenario 492.** Steps 9 to 12 move a packet that fails its own validation, ending on exit 3 then `relocate: nothing to do`. They also rerun a move whose trigger index step failed once, ending on exit 2, then 0, then `relocate: nothing to do`.
- **Scenario 493.** Step 7 hands the printed map to `relocate.mjs --map` in a throwaway copy of the tooling, which exits 1 with a plan and no refusal.
- **Scenario 494.** Step 7 checks `archivedPaths` in the path recipe's `--json` record.
- **Root catalog.** Four summaries match their pages again.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `feature-catalog/tooling-and-scripts/spec-packet-relocation.md` | Modified | Exit 3, rewrite passes, resume, sources |
| `feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md` | Modified | Restore outcomes and the mixed-track refusal |
| `feature-catalog/retrieval/rg-archive-search.md` | Modified | `archivedPaths` |
| `feature-catalog/tooling-and-scripts/sub-track-proposal.md` | Modified | The fourth no-map case |
| `feature-catalog/feature-catalog.md` | Modified | Four summaries |
| `manual-testing-playbook/tooling-and-scripts/spec-packet-relocation.md` | Modified | Status 3 and late-step resume steps, real-pipeline source |
| `manual-testing-playbook/tooling-and-scripts/sub-track-proposal.md` | Modified | Map preflight step |
| `manual-testing-playbook/retrieval/rg-archive-search.md` | Modified | Path JSON step |

Paths are under `.skilled/skills/system-spec-kit/`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

This session wrote the pages, on operator decision Q024. Each claim was checked against the code after phase 011 before it was written. The new playbook steps were prototyped in throwaway copies first, so each Expected section quotes real output. Then the three scenarios' command blocks were extracted verbatim and run once. Evidence: `scratch/setup-notes.md`, `scratch/playbook-run.txt`, `scratch/validators.txt`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The late-step flags are described as marking a move unfinished, not as skipping landed steps | The code runs every late step again on a rerun. The first draft said otherwise and was corrected after reading `applyPlan` |
| Scenario 492's late-step move uses the healthy `003-beta` | Moving the broken packet again would end the rerun on 3 and hide the resume |
| No commit between the failed late step and its rerun | A run without that commit exited 0 on the rerun, so the step is not needed |
| The playbook root index is unchanged | Its rows carry only ids and titles, and no title changed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Each task's Verify command | All pass, recorded per task in `tasks.md` |
| Scenarios 492 to 494 run verbatim | Every `_EXIT` line matches: 492 ends `LATE_FINAL_EXIT=0`, 493 `PREFLIGHT_EXIT=1`, 494 `PATH_JSON_EXIT=0` |
| `validate_document.py` on eight pages | VALID, 0 issues, exit 0 each |
| `validate-playbook-package.cjs` on the package | PASS, 0 violations, exit 0. Its two warnings are in scenarios this phase did not touch |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scenario 492 runtime.** The added steps copy and move packets twice more, so the scenario takes a few minutes longer.
2. **Untouched warnings.** The package check still warns on `retrieval/stale-index-fallback.md` and `ux-hooks/comment-hygiene-checker-baseline.md`, outside this phase.
<!-- /ANCHOR:limitations -->

---
