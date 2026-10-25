---
title: "Implementation Summary"
description: "Built and open: the 12 workflows that declared no permissions now declare contents: read, the Dependabot auto-merge workflow is split into a read-only and a write-scoped job, every job carries a timeout sized from its own job samples, and every job except Dependabot's two carries a vars.SKILLED_CI switch. T100 to T102 remain."
trigger_phrases:
  - "workflow hygiene on off control implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control"
    last_updated_at: "2026-10-25T13:24:41Z"
    last_updated_by: "generate-context"
    recent_action: "T001 to T099 on main, T022 proven on Dependabot runs 40148156911 and 40200559794"
    next_safe_action: "Run T100 after 2026-10-26T00:45Z"
    blockers:
      - "T100 waits for 24h of runs"
    key_files:
      - "tasks.md"
      - "scratch/r24/timeouts.md"
      - "scratch/r26-probe.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-007-workflow-hygiene-on-off-control"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-workflow-hygiene-on-off-control |
| **Completed** | Built, closure open (T100 to T102) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The five concern commits are on `main`. Every workflow declares `permissions:` at the top, `dependabot-auto-merge.yml` holds a read-only `metadata` job and a write-scoped `auto-merge` job, all 44 jobs carry `timeout-minutes` sized from their own samples, 42 jobs carry a `vars.SKILLED_CI` switch (every job except Dependabot's two), and the workflows README documents the switches. What remains is T100 (the 24 h read of runs for a timeout kill), T101 (the final gates) and T102 (the closure record).

### Phase 7: workflow-hygiene-on-off-control

The phase closes three gaps that a maintainer meets in production: a hung job holding a runner for GitHub's 360-minute default, a third-party Dependabot action running beside a write token, and no way for a clone to turn a group of checks off without editing YAML. It did that in three passes over the same 32 files, each proved by a parse and by `check-gate-inputs.sh`, with the switch additionally proved on a throwaway probe repository.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/advisory-checks.yml` and eleven sibling files | Modified (`4b7d3d8941`) | A workflow-level `permissions: contents: read` above `jobs:` |
| `.github/workflows/dependabot-auto-merge.yml` | Modified (`b1315701ca`) | One job became a read-only `metadata` job and a write-scoped `auto-merge` job |
| `.github/workflows/*.yml` (all 32) | Modified (`8ff7da700d`) | A `timeout-minutes` value on every job, sized by `scratch/r24/size-timeouts.mjs` |
| `.github/workflows/*.yml` (all but Dependabot's) | Modified (`9480d99e6d`) | The `vars.SKILLED_CI` switch on 42 jobs, ANDed with any existing condition |
| `.github/workflows/README.md` | Modified (`03abdb20d8`) | The `### On/off switches` section at `:76` |
| `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/` | Created | `decisions.md`, `phase-baseline.md`, `inventory.md`, `switch-groups.md`, `constraints.md`, `r24/`, `r25-dependabot.md`, `pass-permissions.md`, `pass-switch.md`, `r26-probe.md` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered by `tasks.md` T001 to T099 in the ADR-002 order R25, R24, R26, one commit per concern (ADR-010): `4b7d3d8941` (permissions), `b1315701ca` (Dependabot split), `8ff7da700d` (timeouts), `9480d99e6d` (switches) and `03abdb20d8` (README). `check-gate-inputs.sh` ran after the permissions pass (`scratch/gate-after-permissions.txt`, `RESULT: PASSED`) and after the timeouts (`scratch/r24/gate-after-timeouts.txt`). T100 to T102 are still open.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| D6's floor, 10 minutes by default (ADR-001) | A floor is a policy the operator owns; the measured term cannot cover a job with no sample |
| Build order R25, R24, R26 (ADR-002) | The Dependabot split creates a job, and a timeout pass cannot size a job that does not exist |
| Job-time samples, not run wall time (ADR-003) | `timeout-minutes` counts execution; run wall time includes queueing and would overstate every value |
| The formula plus thin and absent markers (ADR-004) | One percentile is fooled by one slow run, and a two-run sample must read as thin |
| The split keeps the existing check name (ADR-005) | Only `message-contract.yml`'s context is required, so a rename buys nothing and breaks a bookmark |
| The switch is ANDed, never substituted (ADR-006) | A replacement would delete the rebuild loop guard |
| `SKILLED_CI_MESSAGES` exists and is documented as never-off (ADR-007) | The group list stays complete, and the prohibition is read where the variable is described |
| The README table is the group taxonomy (ADR-008) | One taxonomy, already maintained, instead of a second list |
| The rule packet keeps `max(<floor>, ...)` (ADR-009) | A standard that hard-codes one repository's floor cannot describe the next repository |
| One commit per concern (ADR-010) | A killed timeout must be revertible without reverting the permissions and the switch |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `grep -L 'permissions:' .github/workflows/*.yml \| wc -l` | `0` on 2026-10-25 (AC-001) |
| `python3` job parse for `timeout-minutes` | `no-timeout []` over 44 jobs, and `size-timeouts.mjs --assert` prints `values match formula: ok` and `50% rule: ok` (AC-004) |
| `grep -c "vars.SKILLED_CI != 'off'"` summed over the tree | `42`, and only Dependabot's two jobs lack the switch (AC-005) |
| `bash .github/scripts/check-gate-inputs.sh` | `RESULT: PASSED` with `failures=0` after the permissions pass (`scratch/gate-after-permissions.txt`); the final run is T101 |
| Switch probe | Runs `40150455358` (`off: skipped`) and `40150476111` (`unset: ran`) on a throwaway probe repository (`scratch/r26-probe.md`, AC-008) |
| Dependabot split | Runs `40148156911` and `40200559794` ran the two-job shape, and the `auto-merge` job skipped on both (`scratch/r25-dependabot.md`, AC-002 `Met` on the operator's ruling of 2026-10-25) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The closure is open.** 9 of 13 acceptance rows are `Met`. AC-003 waits on T100, and AC-009, AC-011 and AC-012 wait on T101.
2. **D6 is answered, 10 minutes.** Every timeout value uses that floor.
3. **A throwaway repository stood in for the fork in AC-008.** GitHub does not let an account fork its own repository, so `MichelKerkmeester/ci-switch-probe-throwaway` carried the same `.github/workflows` tree byte for byte (`scratch/r26-probe.md`).
4. **The split ran on real Dependabot pull requests.** Runs 40148156911 (pull request 86) and 40200559794 (pull request 89) used the two-job shape: the metadata job succeeded and the merge job skipped, because neither is a security patch. The merge job's write path on a security patch is not yet observed. On the operator's ruling of 2026-10-25 these runs satisfy AC-002.
<!-- /ANCHOR:limitations -->

---
