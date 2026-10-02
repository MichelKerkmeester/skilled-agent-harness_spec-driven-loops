---
title: "Decision Record: Phase 45: deem-live-runs"
description: "The operator stopped the Deem live runs after 2 of 20 and retired Deem, so the remaining runs and their review are superseded by phase 046's removal."
trigger_phrases:
  - "deem runs stopped"
  - "deem retired"
  - "deem live runs superseded"
  - "deem kill verdicts"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/045-deem-live-runs"
    last_updated_at: "2026-10-02T11:00:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Closed the phase against this record"
    next_safe_action: "Work phase 046's removal"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/045-deem-live-runs/acceptance-criteria.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-045-deem-live-runs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 45: deem-live-runs

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The operator stopped the runs and retired Deem

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-02 |
| **Deciders** | The operator, in chat |

---

<!-- ANCHOR:adr-001-context -->
### Context

This phase planned one live `--deem` run per scorer, 20 in all, then a DeepSeek review. The client fixes landed (cli-deem 44 pass). Two runs finished, both `kill`:

- 002 jev-tiebreak: Deem won 7 tiebreaks and lost 29, with 111 of 111 rows measured and 528 calls.
- 006 goal-lint: rule 4 `kill` (tp 64, fp 18, fn 14, tn 2) and rule 5 `kill` (tp 29, fp 8, fn 46, tn 15).

The third run, 017, stalled on its file searches.

### Constraints

- Parent D1 kept Deem as the local fallback when Jev is dormant.
- Output stays under `~/.skilled/.labels/runs/045-deem-20261002/`, outside the repository.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: stop the runs where they were and retire Deem, so the remaining 18 runs and the review are superseded.

**How it works**: the operator said "Stop and deprecate deem completely", then "lets deperecate deem cli completely and only keep cli jev". Phase 046 removes `cli-deem` and every scorer's Deem arm, and keeps `cli-classifier` as a parent hub for a future classifier. This phase keeps its client fixes and its two results.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Stop and remove Deem** | Matches the operator's words. No time spent measuring a backend that is leaving | 18 scorers have no Deem result | 9/10 |
| Finish all 20 runs first | A full record | Measures a backend that is being removed, and 017 stalled | 3/10 |

**Why this one**: the operator chose it, and both measured arms already answered `kill`.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- No further work goes into a retired backend.

**What it costs**:
- 18 scorers never got a Deem result. Mitigation: none needed, since their Deem arms are removed in 046.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The two `kill` results read as a full comparison | L | This record says only 2 of 20 ran |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator's stop |
| 2 | **Beyond Local Maxima?** | PASS | Two options compared above |
| 3 | **Sufficient?** | PASS | The removal itself is 046's |
| 4 | **Fits Goal?** | PASS | The phase's runs serve a backend that is now retired |
| 5 | **Open Horizons?** | PASS | The hub stays a parent hub, so a new classifier can join |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md`: AC-001, AC-002 and AC-005 are `Superseded` by this record. AC-003 and AC-004 are Met by the client fixes.
- `goal.md`: the log records the stop and the two results.

**How to roll back**: rerun `<scratchpad>/w45/run-deem.sh` for the remaining scorers before 046 removes their arms.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
