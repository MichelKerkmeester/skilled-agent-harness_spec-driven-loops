---
title: "Implementation Summary: Guardrail Controls and Activation Gate"
description: "Completed terminal governance phase: real negative controls, a fail-open activation matrix, risk mappings, and per-cell rollback procedure. Candidate flags remain off."
trigger_phrases:
  - "guardrail activation gate implementation summary"
  - "behavioral negative control verification"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
status: "complete"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation"
    last_updated_at: "2026-08-07T04:31:31Z"
    last_updated_by: "codex"
    recent_action: "Verified guardrail controls"
    next_safe_action: "Collect candidate-owned behavioral and delivery evidence without changing flag defaults"
    blockers: []
    key_files:
      - "guardrail-negative-controls.test.mjs"
      - "activation-matrix.json"
      - "activation-matrix.schema.json"
      - "activation-matrix.test.mjs"
      - "risk-register.md"
      - "rollback-procedure.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The governor control is behavioral and scored; it does not compare directive bytes."
      - "Every applicable cell without both passing evidence types remains emit, and all candidate flags remain off."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-guardrail-controls-and-activation |
| **Completed** | 2026-08-06 |
| **Status** | Complete — controls defined and verified; all candidate flags remain off |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase defines the terminal governance gate for candidates 002-006 without activating any candidate. The six new phase-local artifacts are:

| File | Result |
|------|--------|
| `guardrail-negative-controls.test.mjs` | Runs the real comment-hygiene guard, the real strict spec validator, and a behavior-scored governor rubric. Fixtures are pinned to an isolated `/private/tmp` (or `/tmp`) root outside `.opencode/specs`, regardless of ambient `TMPDIR`, and removed in `finally`. |
| `activation-matrix.json` | Enumerates all 30 runtime/candidate cells: six runtimes × candidates 002-006. It records 13 applicable cells as unproven `emit` and 17 inapplicable cells as `N/A`; no cell is `activated`. |
| `activation-matrix.schema.json` | Defines the cell and evidence contract. Activation requires passing behavioral and delivery evidence; unknown, ambiguous, failed, or missing evidence stays fail-open. |
| `activation-matrix.test.mjs` | Proves the matrix axes, applicability, evidence shape, fail-open behavior, and zero current activation. |
| `risk-register.md` | Maps all seven named central risks to controls or monitoring and rollback signals. |
| `rollback-procedure.md` | Defines per-block/per-runtime disable, delivery-state clearing, baseline-emission confirmation, and one worked hypothetical cell. |

The governor rubric extracts four behavioral markers — lead with the result, batch tool work and act rather than narrate, treat reversible decisions as cheap, and qualify only when it changes reader action. A marker-preserving rewrite passes; a marker-dropped rewrite fails.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The controls call the existing executable guards directly. The comment control writes a real forbidden comment to a temporary fixture and asserts exit 1 plus the guard's stdout, then asserts a clean fixture exits 0. The completion control creates a temporary spec packet with generated metadata claiming `complete` while its evidence is incomplete and asserts `validate.sh --strict` exits 2; a complete evidence fixture is non-blocking.

The matrix is deliberately unpopulated: candidate-owned evidence fields are `null`, applicable cells verdict `emit`, inapplicable cells verdict `N/A`, and `activationState` is `all-candidate-flags-off`. The schema is consumable by candidates 002-006 without changing their files because their reports only need to fill the two evidence objects in each applicable cell.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use the live comment-hygiene and strict spec-validator commands | The negative controls prove the actual repository enforcement boundaries, including their real exit codes. |
| Score governor behavior instead of matching directive text | Wording can change while the behavioral contract remains intact; exact-string equality would test the wrong property. |
| Require both behavioral and delivery evidence | Byte savings or configuration alone cannot prove safe runtime behavior. Missing, stale, failing, unknown, and ambiguous evidence must emit the full baseline. |
| Keep rollback per block and per runtime | A regression in one cell must not disable unrelated runtime/candidate cells. |
| Keep every candidate flag off in this phase | This packet defines and proves the gate; it does not perform rollout. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The final focused run produced the following output; the exact temporary path is intentionally generated at runtime and is removed before the test exits:

```text
node --test guardrail-negative-controls.test.mjs activation-matrix.test.mjs
MATRIX_FAIL_OPEN applicable=13 unproven_emit=13 activated=0 ambiguous_statuses=fail,unknown,ambiguous->emit
✔ activation matrix enumerates all six runtimes by all five candidate cells (1.142041ms)
✔ fail-open gate emits for every applicable cell without two passing evidence records (0.382292ms)
✔ activation schema exposes the evidence contract without candidate-phase changes (0.064ms)
REAL_COMMENT_GUARD command=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0131-sk-code-injection-bloat-impl/.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh exit=1 stdout="/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/guardrail-controls-PqLkZR/forbidden-comment.mjs:2: // REQ-001"
REAL_COMMENT_GUARD_CLEAN exit=0 stdout=""
REAL_VALIDATE_STRICT command=bash /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0131-sk-code-injection-bloat-impl/.opencode/skills/system-spec-kit/scripts/spec/validate.sh <temp-fixture> --strict exit=2
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
    - graph-metadata.json: STATUS_COMPLETE_EVIDENCE_MISMATCH: derived.status is 'complete' but completion_pct is 0, below 100; tasks.md has unchecked task items
REAL_VALIDATE_STRICT_WELL_FORMED exit=0
GOVERNOR_CANONICAL score=4/4 pass=true
GOVERNOR_REWORDED score=4/4 pass=true
GOVERNOR_MARKERS_DROPPED score=0/4 pass=false missing=lead-with-result,batch-and-act,reversible-decisions,actionable-qualification
✔ comment hygiene rejects a real forbidden comment and accepts a clean fixture (53.7215ms)
✔ completion validation blocks an unsupported complete status and accepts a well-formed fixture (4255.794625ms)
✔ governor rubric scores the canonical directive and survives marker-preserving wording changes (1.388042ms)
ℹ tests 6
ℹ pass 6
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 4374.169375
process_exit_code=0
```

| Check | Result | Evidence |
|-------|--------|----------|
| Real forbidden-comment guard | PASS: exit 1 with stdout naming the temp fixture and `REQ-001`; clean fixture exit 0 | `guardrail-negative-controls.test.mjs:245-267`; combined `node --test` exit 0 |
| Real unsupported-completion guard | PASS: `validate.sh --strict` exit 2 with `STATUS_COMPLETE_EVIDENCE_MISMATCH`; well-formed fixture exit 0 | `guardrail-negative-controls.test.mjs:271-315`; combined `node --test` exit 0 |
| TMPDIR-independent fixture isolation | PASS: normal and hostile `TMPDIR=<phase-directory>` runs each pass 4/4; fixture root remains outside `.opencode/specs` | `guardrail-negative-controls.test.mjs:55-82`; both `node --test` commands exit 0 |
| Governor scored scenarios | PASS: canonical 4/4, reworded 4/4, marker-dropped 0/4 | `guardrail-negative-controls.test.mjs:319-336`; combined `node --test` exit 0 |
| Matrix fail-open proof | PASS: 30 cells, 13 applicable, 13 unproven `emit`, 17 `N/A`, 0 activated; fail/unknown/ambiguous synthetic evidence emits | `activation-matrix.test.mjs:61-113`; combined `node --test` exit 0 |
| Evidence schema | PASS: required cell/evidence fields and statuses are consumed without candidate-phase changes | `activation-matrix.schema.json:76-140`, `activation-matrix.test.mjs:115-145`; exit 0 |
| Packet validation | PASS: strict non-recursive validation exit 0 with the worktree-status probe isolated; the unisolated run reports only expected dirty-tree freshness | `spec.md:101-127`; `GIT_DIR=/private/tmp/guardrail-no-git-dir SPECKIT_COMPLETION_FRESHNESS=false bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase> --strict --no-recursive` exit 0 |
| Scope | PASS: no runtime, flag default, or 001-006 file changed | phase-scoped `git diff --name-only` and `git status --short` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

`risk-register.md:5-13` maps long-context drift, compaction loss, false-negative relevance classifiers, advisory Gate invisibility, Pi override/preload loss, Cursor version drift, and OpenCode transform aliasing to named controls or monitoring. `rollback-procedure.md:5-24` gives the reusable per-cell template: disable the flag, clear delivery state, confirm full baseline emission, set the verdict to `emit`, and re-run controls. `rollback-procedure.md:26-38` works `OpenCode / 003 / policy.governor.v1` through that sequence and leaves the other 29 cells unchanged.

This phase does not activate candidates and does not provide candidate-owned evidence. The matrix remains ready for 002-006 to populate. The normal strict validator sees the required uncommitted phase diff and reports the completion-freshness dirty-tree warning; the passing packet validation above isolates only that git-status probe, while the separate scope audit confirms every changed path is inside this phase. A Codex hook installer check also reported pre-existing drift in the user's external global hook configuration; it was not modified because it is outside the phase folder and not part of this implementation.

The sk-code `run-all-drift-guards.sh` wrapper exited 1 because its repo-wide alignment guard reports the pre-existing baseline backlog (472 findings: 268 errors and 204 warnings); its stack-folder guard passed and its router-sync suite passed 10/10. A targeted alignment scan found no finding naming this phase's files, so the backlog was not modified.
<!-- /ANCHOR:limitations -->
