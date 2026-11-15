---
title: "Decision Record: goal rebind live proof"
description: "Why two acceptance criteria were replaced by per-runtime rows after the live runs, and why the Devin hop is waived."
trigger_phrases:
  - "goal rebind live proof decision"
  - "devin hop waived"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs"
    last_updated_at: "2026-10-25T01:10:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Recorded the criterion split and the Devin waiver after the live runs"
    next_safe_action: "Operator decides on the OpenCode 2 hop defect, then the hop is rerun"
    blockers:
      - "OpenCode 2 hop: the killer does not end the TUI, so AC-009 is Unmet"
    key_files:
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-28-goal-rebind-live-proof-and-docs"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Decision Record: goal rebind live proof

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Replace the all-runtimes hop criteria with one row per outcome

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-25 |
| **Deciders** | Build session, on what the live runs showed |

---

<!-- ANCHOR:adr-001-context -->
### Context

AC-001 and AC-002 asked for a live hop with a goal, and the two controls, on each runtime with credentials. The runs showed that the phrase hides three different situations. A hop reached the receiver on Claude and Pi. A hop did not reach OpenCode 2: the killer signalled the plugin's own process and the TUI stayed up. A hop cannot reach Devin or Cursor at all, because they ship on the command trigger and nothing arms a record. One row cannot be Met for the first and Unmet for the others without saying which, and rewriting its words in place would hide that a criterion was changed.

### Constraints

- A criterion's meaning is never changed in place.
- A runtime that cannot run is recorded as a SKIP or an Unmet row with its reason, never as a pass.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: mark AC-001 and AC-002 Superseded by this record, leave their text untouched, and add AC-006 to AC-010, one row per outcome: the Claude and Pi hop, their controls, the receiver half on OpenCode 2 and Devin, the OpenCode 2 hop and the Devin hop.

**How it works**: AC-006 and AC-007 carry the hop proof and its controls for the runtimes a hop reaches. AC-008 carries the receiver-half proof for OpenCode 2 and Devin, labelled as not a hop. AC-009 stays Unmet until the OpenCode 2 hop is repaired in its owning phase and rerun. AC-010 is waived under ADR-002.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Supersede and split into per-outcome rows** | Each row is Met or Unmet on its own evidence, and the history shows the change | Nine more cells to read | 8/10 |
| Leave AC-001 and AC-002 Unmet | No change to the criteria | The Claude and Pi proof has no row that reads Met, and the closure statement cannot tell a defect from a design limit | 4/10 |
| Mark AC-001 Met and note the exceptions in its cell | Short | The row would claim a proof for runtimes it did not get | 1/10 |

**Why this one**: it keeps what was proven separate from what was not, and it leaves the original wording where a reader can compare.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The closure statement names the one blocker, the OpenCode 2 hop.

**What it costs**:
- The packet is not closeable while AC-009 is Unmet.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Someone reads AC-008 as a hop proof | M | The row says receiver half only and the playbook scenario says it is not a hop |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | One row could not state two outcomes |
| 2 | **Beyond Local Maxima?** | PASS | Leaving the rows Unmet and marking one Met were compared |
| 3 | **Sufficient?** | PASS | Five rows cover the five outcomes |
| 4 | **Fits Goal?** | PASS | The phase exists to say what each runtime showed |
| 5 | **Open Horizons?** | PASS | A rerun of the OpenCode 2 hop only flips AC-009 |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md` marks AC-001 and AC-002 Superseded and adds AC-006 to AC-010.

**How to roll back**: restore the two rows to Unmet and delete the five new ones.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The Devin hop is waived, not run

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-25 |
| **Deciders** | Build session, on the session-relaunch README and the wrapper source |

---

<!-- ANCHOR:adr-002-context -->
### Context

Devin ships on the command trigger. A record prepared on it stays pending because no event arms it, so `skilled-loop` never relaunches it, and the manual command that `prepare` prints is a first launch, which drops `SESSION_RELAUNCH_GOAL_PACKET`. Cursor is the same, and it was also not logged in. A hop with a goal therefore cannot be made to reach a Devin receiver without building an arm path, which is new behaviour and outside a phase that builds none.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: waive the Devin hop (AC-010) and prove the receiver half instead (AC-008), with the limit written into the README and the handoff command.

**How it works**: a headless Devin session started in a throwaway checkout with the variable set by hand bound the packet, and the switch-off and no-packet controls bound nothing. That shows the hook works and says nothing about a hop.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Waive the hop, prove the receiver half, document the limit** | Honest about what ran; no new behaviour | The Devin goal path stays unreachable in practice | 7/10 |
| Arm the Devin record from the harness | A relaunch would happen | It would fake the event the runtime does not send | 1/10 |
| Build an arm path for Devin and Cursor | Closes the gap | New behaviour in a phase that builds none | 4/10 |

**Why this one**: it reports the gap as it is and leaves the build decision to the operator.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The docs say that no hop hands a Devin or Cursor receiver a packet.

**What it costs**:
- The two runtimes carry code that no real hop reaches.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Devin gains an arm event later and nobody reruns the hop | L | The playbook scenario GR-C2 names the missing hop |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | No hop path exists, so the row cannot be Met |
| 2 | **Beyond Local Maxima?** | PASS | Faking the arm and building one were compared |
| 3 | **Sufficient?** | PASS | The receiver-half run covers the hook |
| 4 | **Fits Goal?** | PASS | The phase proves and documents, it does not build |
| 5 | **Open Horizons?** | PASS | The gap is recorded as a follow-up |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md` marks AC-010 Waived under this record.

**How to roll back**: set AC-010 back to Unmet once an arm path exists.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---
