---
title: "Decision Record: agent create-agent canon conformance + Codex TOML parity gate"
description: "ADRs for the agent canon conformance child: the validator sequential-numbering gap versus the canon-required ## 0. hard block, and the two agents that lack ## 0.. Both accepted-with-follow-up, deferred to the operator."
trigger_phrases:
  - "agent canon conformance decision"
  - "validate_document numbering gap adr"
  - "agent ## 0 backfill adr"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/002-agent-canon-conformance"
    last_updated_at: "2026-07-14T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded validator numbering-gap (ADR-001) and ## 0. backfill nuance (ADR-002)"
    next_safe_action: "Operator decides on the two deferred follow-ups"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/agents/deep-improvement.md"
      - ".opencode/agents/prompt-improver.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: agent create-agent canon conformance + Codex TOML parity gate

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Validator sequential-numbering gap vs the canon-required `## 0.` hard block

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (with deferred follow-up) |
| **Date** | 2026-07-14 |
| **Deciders** | Claude (author), operator (follow-up owner) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The sk-doc create-agent canon REQUIRES a leading `## 0. ILLEGAL NESTING / HARD BLOCK` section (11 of 13 agents carry it). The canon's own gate, `validate_document.py --type agent`, checks H2 numbering in `validate_h2_headers` starting at `expected_num = 1` with no exemption for the canon-sanctioned `## 0.`/`## 0b.` prefix. As a result, each `## 0.` agent emits one non-blocking `non_sequential_numbering` warning ("expected 1, found 0") — 22 of the 26 agent `.md` files. The document still validates (exit 0), but a canon-conformant agent cannot reach a clean 0/0. The canon and its validator are in direct conflict: you cannot have both the canon-required `## 0.` AND zero numbering warnings under the current validator.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: treat the `non_sequential_numbering` warning on `## 0.` agents as a documented, sanctioned-dialect artifact — NOT drift — and leave every agent `.md` unchanged. Do NOT renumber `## 0.` → `## 1.` to silence it.

**Follow-up (deferred, OUT of 002 scope)**: exempt a leading `## 0.`/`## 0b.` from the `--type agent` sequential-numbering check so canon-conformant agents validate 0/0. This modifies a shared, repo-wide validator (`validate_document.py`) and belongs to the operator or a dedicated create-agent-validator packet, not this conformance child.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Document as sanctioned; defer validator fix** | Preserves canon-required `## 0.`; honest characterization; no shared-validator blast radius in this child. | Leaves 22 non-blocking warnings until the operator patches the validator. | 9/10 |
| Renumber `## 0.` → `## 1.` to reach 0/0 | Silences the warning. | Strips or corrupts the canon-required hard-block section — a canon regression. | 2/10 |
| Patch `validate_document.py` inside this child | Reaches 0/0 immediately. | Mutates a shared repo-wide validator from a scoped conformance child; broad blast radius, out of scope. | 4/10 |
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The `## 0.` hard block stays intact on all 11 agents that carry it; canon structure is preserved.
- The warning is legible and expected rather than mistaken for drift.

**What it costs**:
- 22 of 26 agent files carry one non-blocking warning until the deferred validator exemption lands.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future reviewer "fixes" the warning by renumbering | M | This ADR records that renumbering is a canon regression, not a fix. |
| The validator exemption is never scheduled | L | Warning is non-blocking (exit 0); it degrades signal cleanliness only, not the gate. |
<!-- /ANCHOR:adr-001-consequences -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: `deep-improvement` and `prompt-improver` lack the canon `## 0.` hard block

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (open operator question) |
| **Date** | 2026-07-14 |
| **Deciders** | Claude (author), operator (decision owner) |

---

<!-- ANCHOR:adr-002-context -->
### Context

Two of the 13 agents — `deep-improvement` and `prompt-improver` — do NOT carry the canon-required `## 0. ILLEGAL NESTING / HARD BLOCK` section. Consequently they validate at 0/0 (0 issues) under `validate_document.py --type agent`, which is a cleaner result than the 11 canon-conformant agents that carry `## 0.` and emit the sanctioned warning. Their 0/0 is therefore a symptom of an omission, not of superior conformance. There is no evidence in-session that the omission was a deliberate design choice versus an oversight.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: leave both agents as-is for this child. They already clear the plan's exit-0 bar (REQ-001), and backfilling `## 0.` would add behavior-adjacent content — outside a parity-only, behavior-preserving conformance pass.

**Open question for the operator**: backfill `## 0.` into both agents for canon uniformity (accepting +2 sanctioned `non_sequential_numbering` warnings, consistent with the other 11 agents) versus leave them at their current 0/0.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Leave as-is; raise as operator question** | Behavior-preserving; stays inside the parity-only scope; no unreviewed hard-block content added. | Canon coverage of `## 0.` remains 11/13, not uniform. | 8/10 |
| Backfill `## 0.` into both now | Uniform canon structure across all 13 agents. | Adds behavior-adjacent content beyond a parity-only child; +2 sanctioned warnings; needs authoring review per agent. | 6/10 |
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- No unreviewed hard-block content is injected into two agents under a parity-only mandate.

**What it costs**:
- `## 0.` coverage stays at 11/13 until the operator decides.

**Note — root `AGENTS.md` boundary**: root `AGENTS.md` is NOT an agent definition under the create-agent canon and is intentionally excluded from this conformance pass. It was flagged, not force-fit; applying `--type agent` structure to it would be a category error.
<!-- /ANCHOR:adr-002-consequences -->
<!-- /ANCHOR:adr-002 -->
