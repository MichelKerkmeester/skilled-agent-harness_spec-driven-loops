---
title: "Decision Record: deep-loop-runtime doc-remediation"
description: "4 ADRs anchoring locked decisions (batch sequencing, SC-007 partial relaxation for tests/, cli-devin SWE-1.6 RCAF executor, sk-doc templates verbatim for new council files)."
trigger_phrases:
  - "deep-loop-runtime doc-remediation decisions"
  - "ADR-001 batch sequencing"
  - "ADR-002 SC-007 relaxation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/000-release-cleanup/002-deep-loop-runtime-doc-remediation"
    last_updated_at: "2026-05-23T22:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-adrs-authored"
    next_safe_action: "author-implementation-summary-skeleton-and-metadata"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000131000605"
      session_id: "131-000-001-001-doc-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Decision Record: deep-loop-runtime doc-remediation

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Sequential A→B→C→D batch ordering with per-batch verification gates

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (explicit plan-mode approval of 4-batch sequential design) |

---

<!-- ANCHOR:adr-001-context -->
### Context

36 findings cluster naturally into 4 distinct surfaces: cross-doc + cross-arc + schema-doc (Batch A), description drift (Batch B), council expansion (Batch C), test coverage (Batch D). Options: (a) one mega-batch covering all 36, (b) 4 sequential batches with per-batch gates, (c) 4 parallel batches. Parallel was eliminated by `feedback_cli_dispatch_unreliability` memory + `feedback_deep_loop_iter_one_at_a_time` memory; one mega-batch was eliminated by SWE-1.6 prompt-density anti-pattern (dense prompts push toward defensive output per `cli-devin/SKILL.md` §3).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: 4 sequential cli-devin SWE-1.6 RCAF dispatches in fixed order A → B → C → D, with per-batch bundle gate + SC-007 check + strict validate + SIGKILL cleanup. Each batch's RCAF prompt is scoped to ONE finding cluster.

Ordering rationale: A first because replacement strings are ready and 22 findings drop fastest; B second because the drift surface is independent and discoverable; C third because the 12-new-file authoring depends on Batch A's graph-metadata fixes for `key_topics`/`key_files`; D last because SC-007 relaxation only applies to D and concentrating it at the end minimizes invariant-violation risk for prior batches.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **4 sequential batches (Chosen)** | Per-batch gates, dispatcher discipline, recoverable | 4 dispatches vs 1 | 9/10 |
| One mega-batch (36 findings) | Single dispatch | Dense prompt pushes SWE-1.6 toward defensive output; harder to recover from failure | 4/10 |
| 4 parallel batches | Faster wall-clock | Violates one-at-a-time dispatch discipline; risk of swap thrash | 3/10 |
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**: per-batch invariant verification; partial-failure recovery (revert one batch, retry); cleaner audit trail.

**What it costs**: 4 dispatch round-trips instead of 1; ~30 seconds of inter-batch SIGKILL + strict-validate overhead.

**Risks**: cli-devin executor instability across multiple dispatches. Mitigation: SIGKILL cleanup between dispatches + per-batch bundle gate.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 36 findings need ordering + per-batch gates |
| 2 | **Beyond Local Maxima?** | PASS | Considered 1-batch + parallel; both rejected |
| 3 | **Sufficient?** | PASS | A→B→C→D covers all 36 with explicit dependency order |
| 4 | **Fits Goal?** | PASS | Closes Phase 5 backlog with audit traceability |
| 5 | **Open Horizons?** | PASS | Pattern reusable for sibling 002/003/004/005 remediation packets |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: tasks.md T020-T057 sequences A→B→C→D explicitly; per-batch exit gates in checklist.md CHK-013/CHK-015/CHK-020/CHK-FIX-007.

**How to roll back**: stop after any batch's exit gate fails. `git checkout HEAD -- <files>` reverts the failed batch's changes; resume from the prior batch's clean state.
<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: SC-007 partial relaxation for `tests/` writes in Batch D only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (chose "Doc + test coverage" option at plan-mode AskUserQuestion) |

### Context

Parent packet's ADR-004 established a hard no-code-edit boundary: zero edits to `lib/`, `scripts/`, `tests/`, `storage/` of deep-loop-runtime. Test-coverage findings (DR-012/013/014/015) need actual vitest writes to close; those writes touch `tests/`. Options: keep boundary strict (defer test coverage to a separate code-edit packet), OR partially relax for `tests/` only.

### Decision

**We chose**: Partial relaxation. `tests/` writes are permitted in Batch D only. `lib/`, `scripts/`, `storage/` (deep-loop-runtime) + `deep-review/scripts/reduce-state.cjs` remain hard-prohibited. Per-batch SC-007 check confirms the boundary holds: Batches A/B/C show ZERO non-doc paths; Batch D shows ONLY tests/ paths beyond doc edits.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Partial relaxation, tests/ only (Chosen)** | Closes 4 findings in this packet; no scope split | First packet to break the original SC-007; precedent risk |
| Full strict, defer test coverage | Preserves original SC-007 verbatim | 4 findings stay open across an extra packet |
| Full relaxation, all code | Maximizes coverage | Pulls lib/ scripts/ into doc-remediation scope; too broad |

### Consequences

Test coverage gaps close in this packet. Future packets can re-tighten SC-007 to strict or maintain the partial relaxation pattern. Risk: precedent might leak into future packets; mitigation: ADR records the scope boundary explicitly so future packets cite this ADR if they relax similarly.

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: cli-devin SWE-1.6 with RCAF + medium-density pre-planning as canonical executor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (user prompt: "Utilize SWE 1.6 with RCAF prompts through cli devin where usefull") |

### Context

Phase 5a demonstrated cli-devin SWE-1.6 averages ~57s wall-clock per RCAF-prompted dispatch on documentation work. `cli-devin/SKILL.md` §3 line 192 documents the medium-density pre-planning rule. Operator explicitly requested SWE-1.6 + RCAF + cli-devin.

### Decision

All 4 batches use the same executor + prompt structure:
- Binary: `devin --print --prompt-file <path> --model swe-1.6 --permission-mode auto -p </dev/null`
- Prompt: RCAF (Role / Context / Pre-plan / Action / Format)
- Pre-plan: medium-density 3-4 ordered steps; NO dense per-step I/O contracts; NO verbose bundle-gate wording
- Per-batch: bundle gate (grep imports + smoke-run validation commands) after dispatch

### Consequences

Consistent dispatch shape across batches simplifies orchestrator code. Risk: cli-devin dispatch instability under repeated invocation. Mitigation: one-at-a-time with SIGKILL cleanup between batches.

<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: sk-doc templates pasted verbatim into Batch C prompt-pack

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (implicit via plan-mode approval) |

### Context

Batch C creates 12 NEW files using sk-doc `feature_catalog_creation.md` (4-section feature catalog template) + `manual_testing_playbook_creation.md` (5-section playbook template). Risk: SWE-1.6 freelances template shape if given prose guidance instead of the template itself.

### Decision

Batch C prompt-pack pastes both template documents verbatim. Devin instructed to "follow this template shape exactly per the embedded reference doc". Per-file `validate_document.py` run after dispatch confirms each new file conforms.

### Consequences

Larger prompt-pack (~150 extra lines for the templates), but eliminates template-freelance risk. Per-file validate gate catches any deviation immediately.

<!-- /ANCHOR:adr-004 -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **Parent ADRs (still in force)**: `../decision-record.md` ADR-002 (all-cli-devin SWE-1.6 phase-5 toolchain), ADR-003 (assets/ absent-by-design), ADR-004 (no-code-edit boundary — partially relaxed by THIS packet's ADR-002 for tests/), ADR-007 (Smart Router preservation default, still reserved)
- **CLI dispatch contract**: `.opencode/skills/cli-devin/SKILL.md` (mandatory pre-read per ADR-003 above)
