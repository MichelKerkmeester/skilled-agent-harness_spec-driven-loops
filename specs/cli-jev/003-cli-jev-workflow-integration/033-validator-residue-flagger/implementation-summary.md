---
title: "Implementation Summary: Validator-Residue Flagger (Planned)"
description: "Nothing is built yet. This phase is Planned: its spec, plan, tasks and goal describe one offline deep-review script that tests whether a Jev or Deem noul flags correctness and traceability defects in document passages. It was released on 2026-09-29."
trigger_phrases:
  - "validator residue flagger summary"
  - "residue flagger status"
  - "score-residue-flagger planned"
  - "residue flagger verdict"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger"
    last_updated_at: "2026-09-29T15:30:00Z"
    last_updated_by: "spec-author-leaf"
    recent_action: "Authored the Planned phase for R26"
    next_safe_action: "Build to the label gate in number order, released 2026-09-29 (parent goal D3)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-033-validator-residue-flagger"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "What a flag column would change for a reviewer"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Validator-Residue Flagger (Planned)

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 033-validator-residue-flagger |
| **Status** | Planned |
| **Completed** | Not completed. The phase is Planned |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned, and no script, test, labels file or skill doc exists for it.

### Phase 33: validator-residue-flagger

The plan builds `score-residue-flagger.cjs` (proposed) in `.skilled/skills/system-deep-loop/deep-review/scripts/`. Its default run counts committed correctness and traceability finding rows by table header, with zero calls. A draw writes 100 passages for the operator to label, half cited by a finding and half not. Once labeled, a Jev arm and a Deem arm, each behind its own switch and gate, ask one `noul` per passage, and each column ends in `keep`, `kill (precision)` or `stop (<reason>)` under the keep rule in `spec.md`. No review table gains a column. See `plan.md` for the order of work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` | Authored | Planning documents for this phase. No code or skill file has changed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The planning documents were written on 2026-09-29 from R26's record in `../007-classifier-deep-research/research/research.md:886-905`, the validators section at `:460-480`, K9 at `:113` and the glm-04, mimo-02 and mimo-08 lineage iterations. The deep-review seam was reopened at the worktree HEAD: `deep-review/SKILL.md:306-313` and `assets/prompt-pack-iteration.md.tmpl:53`, `:113` and `:157`. The operator's "Bind and release" amended parent goal D3 on 2026-09-29 and released the phase, which builds in number order. Its verdict waits on the operator's 100 labels.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The operator labels negatives and confirms positives | R26 waited because finding rows label positives only, and a finding is a reviewer's claim until confirmed |
| Passages are read at the reviewed commit | A passage read today can already hold the fix the finding asked for |
| Flag-nothing is the baseline | It is what every review table does today, and no validator checks either category |
| No column is added here | A served column needs a `keep`, a reviewer naming what it changes and a later phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build, tests and runs | Not run. Nothing is built |
| Planning documents | `validate.sh --strict`, `check-goal.cjs` and `goal.cjs packet` run on this folder after authoring. Their output is reported by the authoring session, not recorded here as a build result |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing is built yet.** The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Builds run in number order, and disjoint builds may run in parallel.
2. **The verdict waits on 100 labels.** About 3.5 hours at 2 minutes a label (estimate).
3. **A window hides context.** A defect a reviewer found from the code or the spec around a passage is invisible to a `noul` over the passage alone.
<!-- /ANCHOR:limitations -->

---
