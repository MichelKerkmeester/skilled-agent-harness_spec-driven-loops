---
title: "Decision Record: Automatic operator decision capture"
description: "Design decision and operator answers for automatic capture, save-time rewriting and an auditable packet record."
trigger_phrases:
  - "decision capture design decision"
  - "operator decisions appendix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/042-decision-capture"
    last_updated_at: "2026-11-01T07:16:09Z"
    last_updated_by: "template-author"
    recent_action: "Initialized decision record template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-042-decision-capture"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Automatic operator decision capture

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Capture answers locally and rewrite them at save time

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-01 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The decision-record template holds ADRs, and it has no operator question or answer section. Operators still need an audit trail of why they selected a behavior. A hook can capture the exchange, but it does not have the session model's full reasoning.

### Constraints

- Capture must not make tracked writes during a conversation.
- The verbatim question, options and answer must stay in the same tracked file as the rewritten decision.
- The writer must preserve the packet's detected level when it creates decision-record.md.
- Claude PostToolUse answer visibility is UNKNOWN until T001. The transcript remains a backstop.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Option A, capture locally and let the session model rewrite confirmed decisions during full-auto save.

**How it works**: A runtime-neutral hook appends eligible question events to a locked gitignored queue. A transcript sweep always recovers Claude answers that the hook missed and offers plain-chat pairs for the session model to confirm. At save time the model sends short decisions to a deterministic writer, which upserts two decision-record anchors by a stable question id.

The operator-decisions anchor stores decided, why, supersedes and carried by. The operator-answers-verbatim appendix stores the original question, options and answer under the same id. The writer uses the bound packet, sends cross-phase decisions to the phase parent and sends local decisions to the selected child. It adds an explicit level marker before creating a decision record when spec.md lacks one.

**Why this one**: The save model has the reasoning needed to state why and what a choice supersedes. The queue and transcript retain exact wording without writing tracked files mid-turn.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A. Capture to queue, rewrite at save** | Keeps exact input and uses session context for the rewrite. | A decision is not tracked until a full-auto save. | 9/10, chosen |
| **B. Rewrite inside the hook** | Writes a decision at once. | Lacks session reasoning, adds latency and credentials, and writes tracked files mid-turn. | 4/10, rejected |
| **C. Use save memory only** | Adds no hook adapter. | Compaction or relaunch can lose exact answers before save. | 3/10, rejected |

Scores are qualitative fit against the stated constraints, not measured results.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Operator answers gain a short decision summary and a verbatim audit trail.
- Repeated saves do not duplicate entries or alter the packet level.

**What it costs**:
- A packet has no tracked entry until a full-auto save runs. Mitigation: the Stop hook reports eligible unconsumed decisions.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A runtime hides answers from its hook. | High | Probe it and use transcript recovery where available. |
| A target cannot be resolved to one packet. | Medium | Keep the queue item pending and report it. |
| A packet has no level marker. | High | Record the pre-write level as an explicit marker before creating the record. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The decision-record template has no operator Q/A section. |
| 2 | **Beyond Local Maxima?** | PASS | Options B and C were compared and rejected for stated reasons. |
| 3 | **Sufficient?** | PASS | Capture is local, while rewriting stays with the session model at save time. |
| 4 | **Fits Goal?** | PASS | The record and verbatim appendix stay in the bound packet's decision record. |
| 5 | **Open Horizons?** | PASS | Runtime adapters remain gated on confirmed answer delivery. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Capture core, Claude hook adapter and transcript sweep.
- Save payload, deterministic writer, template anchors, validation and tests.
- Runtime adapters for Codex, OpenCode, Pi and Devin only when their probes confirm answer delivery.

**How to roll back**: Disable the hook registration and save writer call. Revert the capture implementation. Preserve any existing decision entries and verbatim answers.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Store the exact operator question, options and answer in a tracked appendix beside its decision entry. | The record stays portable and auditable with its decision. | None | REQ-007, operator-answers-verbatim |
| Q002 | Filter process questions about Gate 3, folder and branch selection and commit or push permission. | Administrative choices do not belong in the product decision record. | None | REQ-003, capture filter |
| Q003 | Include plain chat questions when the session model confirms a matching operator reply at save time. | Chat questions have no tool event, and the transcript can retain the exchange. | None | REQ-002, transcript sweep |

<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001

Question: Where should the verbatim answers live?
Options: Tracked appendix (rec.); Gitignored queue only
Answer: Tracked appendix (Recommended)

### Q002

Question: Record process questions (Gate 3, worktree vs branch, commit/push permission)?
Options: One-line class (rec.); Record in full; Filter out
Answer: Filter out

### Q003

Question: Capture plain chat questions too?
Options: Yes, confirmed at save (rec.); Tool questions only
Answer: Yes, confirmed at save (Recommended)

No Gate 3 packet-folder choice is included. It is a process question and the selected filter excludes it.

<!-- /ANCHOR:operator-answers-verbatim -->



