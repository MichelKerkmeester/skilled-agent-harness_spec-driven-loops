---
title: "Decision Record: run-time overage on two packets accepted"
description: "Two of the 20 comparison packets run more than the protocol's 20% slower after the ignored-folder check; the operator accepted the overage rather than trade it for a change that would invalidate the drawn samples."
trigger_phrases:
  - "decision record"
  - "run time overage accepted"
  - "source tag run time guard"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/010-source-tag-hardening"
    last_updated_at: "2026-10-04T19:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the accepted run-time overage"
    next_safe_action: "Operator reviews the diff and decides the commit"
    blockers: []
    key_files:
      - "scratch/runtime-guard-final.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: run-time overage on two packets accepted

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Accept the run-time overage on two packets

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-04 |
| **Deciders** | Operator, 2026-10-04, chose "Accept with an ADR" for the two packets over the cap. Drafted by claude-opus-5-5 |

---

<!-- ANCHOR:adr-001-context -->
### Context

Protocol section 7 lets the rule's run time per packet grow by at most 20%. After the ignored-folder check and its deduplication, the 20 packets together run 7.8% slower and the median packet 6.3%, but two exceed the cap: `037-graph-engineering/003-graph-arch` by 30.9% (1.32 s to 1.73 s) and `027-xce-research-based-refinement` by 22.7% (1.31 s to 1.61 s). The cost is one `git check-ignore` call, about 0.8 ms per distinct candidate path on this repository's `.gitignore`.

### Constraints

- The accuracy samples and every 20-packet figure were drawn from the current warning set.
- The check runs only on packets created after the cutoff, so existing packets do not pay it by default.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: accept the overage on the two packets and keep the ignored-folder check as built.

**How it works**: nothing changes in code. `scratch/runtime-guard-final.json` keeps the per-packet medians, and the implementation summary reports the guard as failed on 2 of 20 packets with this record as the reason it stands.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Accept the overage** | The samples, planted recall and checkout comparison stay valid | Two packets take 0.3 to 0.4 s longer | 8/10 |
| Send only the whole-lead spaced form to `check-ignore` | Likely brings both packets under 20% | Changes which tags count as ignored, so every 010 sample and figure would be redrawn | 5/10 |
| Drop the ignored-folder check | No overage | Brings back the checkout-dependent warnings this phase removed | 1/10 |

**Why this one**: the overage is under half a second on the largest packets, and the cheaper path would reopen measurements that are already settled.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The phase closes on measured behavior without a late change to what the rule counts.

**What it costs**:
- Packets with long prose before their citations pay up to about 0.4 s more per run.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A packet with far more tags runs much slower | L | The cost scales with distinct candidate paths; the whole-lead-only cut remains available and is described above |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The protocol guard fails on two packets and needs a recorded answer |
| 2 | **Beyond Local Maxima?** | PASS | Three options were weighed |
| 3 | **Sufficient?** | PASS | One record, no code change |
| 4 | **Fits Goal?** | PASS | The operator chose it |
| 5 | **Open Horizons?** | PASS | The candidate cut stays available |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- This record, and the run-time row of the implementation summary pointing here.

**How to roll back**: delete this record; the guard then reads as an open failure on two packets.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
