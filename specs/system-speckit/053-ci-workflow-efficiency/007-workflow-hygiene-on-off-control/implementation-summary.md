---
title: "Implementation Summary"
description: "Built and closed: the 12 workflows that declared no permissions now declare contents: read, the Dependabot auto-merge workflow is split into a read-only and a write-scoped job, every job carries a timeout sized from its own job samples, and every job except Dependabot's two carries a vars.SKILLED_CI switch. No job hit its timeout in the 690 runs after the timeouts landed."
trigger_phrases:
  - "workflow hygiene on off control implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control"
    last_updated_at: "2026-10-25T21:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "T100 to T102 closed: 0 timeout kills in 690 runs, final gates passed"
    next_safe_action: "None, phase complete"
    blockers: []
    key_files:
      - "tasks.md"
      - "scratch/r24/timeouts.md"
      - "scratch/r26-probe.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-007-workflow-hygiene-on-off-control"
      parent_session_id: null
    completion_pct: 100
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
| **Completed** | 2026-10-25 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The five concern commits are on `main`. Every workflow declares `permissions:` at the top, `dependabot-auto-merge.yml` holds a read-only `metadata` job and a write-scoped `auto-merge` job, all 44 jobs carry `timeout-minutes` sized from their own samples, 42 jobs carry a `vars.SKILLED_CI` switch (every job except Dependabot's two), and the workflows README documents the switches. T100 read the 690 runs created after the timeouts landed and found no timeout kill, T101 ran the final gates, and T102 committed the closure.

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

Delivered by `tasks.md` T001 to T099 in the ADR-002 order R25, R24, R26, one commit per concern (ADR-010): `4b7d3d8941` (permissions), `b1315701ca` (Dependabot split), `8ff7da700d` (timeouts), `9480d99e6d` (switches) and `03abdb20d8` (README). `check-gate-inputs.sh` ran after the permissions pass (`scratch/gate-after-permissions.txt`, `RESULT: PASSED`) and after the timeouts (`scratch/r24/gate-after-timeouts.txt`). T100 read the runs for a timeout kill, T101 reran the gates on the final tree, and T102 committed the closure records with `scratch/phase-result.md`.
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
| `bash .github/scripts/check-gate-inputs.sh` | `RESULT: PASSED` with `failures=0` after the permissions pass (`scratch/gate-after-permissions.txt`) and again in T101's final gates (`scratch/phase-result.md`) |
| Timeout-kill read | `timeout kills: 0` over the 690 runs from 2026-10-25T00:43Z to 21:30Z: no failed or cancelled job's annotations or log holds `maximum execution time` (AC-003, `scratch/phase-result.md`) |
| Switch probe | Runs `40150455358` (`off: skipped`) and `40150476111` (`unset: ran`) on a throwaway probe repository (`scratch/r26-probe.md`, AC-008) |
| Dependabot split | Runs `40148156911` and `40200559794` ran the two-job shape, and the `auto-merge` job skipped on both (`scratch/r25-dependabot.md`, AC-002 `Met` on the operator's ruling of 2026-10-25) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The timeout-kill read covers 20.8 hours, not 24.** The operator asked on 2026-10-25 not to wait for the full window. None of the repository's own schedules falls in the hours left out: the daily schedule ran inside the window, and both weekly schedules fire after it. Separately, the one scheduled run after 21:30Z, the one-shot plugin-test run 40236652343 the setup caching phase fired at 21:41Z, finished `success` in 251 s against its 10-minute timeout, with no kill message in its log.
2. **D6 is answered, 10 minutes.** Every timeout value uses that floor.
3. **A throwaway repository stood in for the fork in AC-008.** GitHub does not let an account fork its own repository, so `MichelKerkmeester/ci-switch-probe-throwaway` carried the same `.github/workflows` tree byte for byte (`scratch/r26-probe.md`).
4. **The split ran on real Dependabot pull requests.** Runs 40148156911 (pull request 86) and 40200559794 (pull request 89) used the two-job shape: the metadata job succeeded and the merge job skipped, because neither is a security patch. The merge job's write path on a security patch is not yet observed. On the operator's ruling of 2026-10-25 these runs satisfy AC-002.
5. **AC-011's path list is read over the phase's own commits.** Other work reached `main` after the phase start, so the whole-range list holds 5,488 paths. The nine phase commits stay inside `.github/workflows/` and this folder, except a consumer test and the parent's derived metadata (`scratch/phase-result.md`).
<!-- /ANCHOR:limitations -->

---
