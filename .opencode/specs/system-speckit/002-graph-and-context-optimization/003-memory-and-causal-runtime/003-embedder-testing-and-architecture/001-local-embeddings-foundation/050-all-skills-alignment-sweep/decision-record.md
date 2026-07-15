---
title: "Decision Record: All Skills Alignment Sweep"
description: "Architecture decisions for the five-batch doc-only all-skills alignment sweep."
trigger_phrases:
  - "all skills alignment decisions"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/050-all-skills-alignment-sweep"
    last_updated_at: "2026-05-14T18:55:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded batch and scope decisions"
    next_safe_action: "Execute batch A-E"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:7615d21b4d5cfb9445614bdda63100c9a7ba54b4d32129fc6137779e4a5c7502"
      session_id: "015-all-skills-alignment-sweep"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: All Skills Alignment Sweep

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Batch by Skill Family

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex, operator dispatch |

---

<!-- ANCHOR:adr-001-context -->
### Context

The scope spans 19 skills with different documentation surfaces. A single commit would be hard to review and hard to revert, while per-file commits would bury the current-reality story under noise.

### Constraints

- Operator requested 5-7 logical commits.
- Skill family boundaries are already defined in the dispatch.
- Work must stay on `main`.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Commit by the five requested skill families, with a close-out commit only if verification docs need to be separated.

**How it works**: Batch A covers CLI executors; B covers deep-loop skills; C covers MCP integration skills; D covers sk-* skills; E covers system-* skills and root READMEs. Each batch gets audit, patch, validation evidence, and a commit.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Five family batches** | Reviewable, matches operator architecture, simple rollback | Some cross-cutting packet docs span batches | 9/10 |
| One large commit | Fastest | Poor rollback and reviewability | 4/10 |
| One commit per skill | Granular | 19+ commits, noisy history | 5/10 |

**Why this one**: It matches the dispatch and keeps each commit meaningful.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Reviewers can inspect one skill family at a time.
- A faulty batch can be reverted without losing the whole sweep.

**What it costs**:
- Packet docs change throughout the sequence. Mitigation: close-out evidence records final state.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cross-family stale reference found late | M | Patch in the owning batch or record explicit follow-on |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator requested batch architecture |
| 2 | **Beyond Local Maxima?** | PASS | Compared one large, per-skill, and family batches |
| 3 | **Sufficient?** | PASS | Covers all skill families and root docs |
| 4 | **Fits Goal?** | PASS | Supports nothing-silent and rollback goals |
| 5 | **Open Horizons?** | PASS | Leaves clean evidence for future sweeps |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Batch commits follow the operator-specified A-E grouping.
- `implementation-summary.md` records each batch SHA.

**How to roll back**: Revert the affected batch SHA and rerun packet validation.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Keep the Sweep Doc-Only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex, operator dispatch |

---

<!-- ANCHOR:adr-002-context -->
### Context

The audit may reveal runtime config or source-code drift, especially around the code-graph MCP rename. The dispatch explicitly forbids source/config modifications and asks for doc alignment.

### Constraints

- No `.ts`, `.js`, `.py`, or runtime config JSON/TOML edits.
- Metadata JSON is editable only if skill metadata itself is wrong.
- No tool-id, server-id, or skill-id renames.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Fix docs that are in scope and document any source/config mismatch as a concrete follow-on packet.

**How it works**: If a doc can be corrected without changing runtime contracts, patch it. If a mismatch requires forbidden files, record the skill, files, recommended scope, and packet name under "Deferred follow-on packets."
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Doc-only with explicit follow-ons** | Honors hard scope and avoids hidden work | Some runtime drift may remain outside this packet | 9/10 |
| Edit configs too | Could close rename drift fully | Violates forbidden scope | 1/10 |
| Ignore config/source drift | Fast | Violates nothing-silent mandate | 2/10 |

**Why this one**: It is the only option that satisfies both the doc-only boundary and the no-silent-deferral rule.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The packet stays inside the operator whitelist.
- Future work receives concrete follow-on scope instead of vague TODOs.

**What it costs**:
- Some underlying runtime drift may require a later implementation packet. Mitigation: name the packet and files precisely.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Follow-on interpreted as silent deferral | M | Include skill, files, scope and suggested packet name |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Dispatch has explicit forbidden source/config list |
| 2 | **Beyond Local Maxima?** | PASS | Compared doc-only, config edit, and ignore paths |
| 3 | **Sufficient?** | PASS | Provides an accountable route for out-of-scope gaps |
| 4 | **Fits Goal?** | PASS | Protects scope and current-reality reporting |
| 5 | **Open Horizons?** | PASS | Follow-on packet list supports continuation |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `implementation-summary.md` owns the follow-on list.
- Batch diffs are checked for forbidden file extensions before commit.

**How to roll back**: Revert any batch that touches forbidden paths; do not attempt partial source/config rollback.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
