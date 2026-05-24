---
title: "Decision Record: deep-agent-improvement skill release cleanup"
description: "Four plan-time ADRs anchoring locked decisions (cli-devin SWE-1.6 toolchain, surgical edits, machine-readable resource-map.yaml, Smart Router preservation). ADR-005 reserved for forced Smart Router edits. ADR-006 reserved for the phase-4 human-approval gate."
trigger_phrases:
  - "deep-agent-improvement release cleanup decisions"
  - "ADR-001"
  - "cli-devin toolchain"
  - "resource-map yaml decision"
  - "smart router preservation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-adrs-authored"
    next_safe_action: "author-resource-map-and-schemas"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000005006"
      session_id: "131-000-005-spec-author"
      parent_session_id: "131-000-005-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Decision Record: deep-agent-improvement skill release cleanup

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Phase-5 toolchain — cli-devin SWE-1.6 mixed-executor (breadth + adjudication + synthesis)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (explicit "CLI-DEVIN with SWE 1.6 per skill workflows" directive) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The phase-5 deep-research loop needs to surface logic gaps a single-pass dispatch could miss. The operator's prompt names the toolchain explicitly: "CLI-DEVIN with SWE 1.6 per skill workflows." The target skill's own `SKILL.md` documents a recommended mixed-executor methodology (8+2 split with an adjudication false-positive filter at iter-7), proven in arc 119, with synthesis iters optionally on cli-codex gpt-5.5.

### Constraints

- Mac dispatch discipline forbids batching iterations; each iter runs one at a time with SIGKILL between (devin + `/tmp/devin-*` preserved per operator rule `feedback_proactive_orphan_cleanup`).
- SWE-1.6 requires RCAF + CLEAR + medium-density pre-planning per `cli-devin/SKILL.md` and `sk-prompt-small-model`.
- "Use a specific CLI executor only when explicitly requested" (`feedback_cli_executor_only_when_requested`) — do not substitute a different CLI on advisor hints.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: 10 iterations on `cli-devin --model swe-1.6` as the single executor, structured per the skill's mixed-executor methodology — breadth (iters 1-6), adjudication / false-positive filter (iter 7), synthesis on confirmed findings (iters 8-10).

**How it works**: Iters 1-6 run RCAF-structured breadth prompts via sk-prompt. Iter 7 runs the adjudication pass that drops outdated/false-positive findings (per `references/mixed_executor_methodology.md`). Iters 8-10 synthesize confirmed findings. Each iteration emits JSON conforming to `schemas/iteration-output.schema.json`. The optional cli-codex gpt-5.5 synthesis pass (the skill's literal recommendation for iters 9-10) is offered as a phase-4-gate decision rather than locked here, because the operator emphasized cli-devin SWE-1.6 + "native CLI alongside."
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **cli-devin SWE-1.6 mixed-executor (Chosen)** | Honors explicit operator toolchain; applies skill's proven adjudication pattern; cheapest reliable path | Single-executor blind spots vs a true cross-model split | 9/10 |
| Split 5 cli-devin + 5 cli-opencode deepseek (sibling 002's ADR-001) | Cross-model validation | Operator named cli-devin SWE-1.6 here, not a split; opencode-go credit-gated | 5/10 |
| cli-codex gpt-5.5 only | Denser synthesis | Ignores explicit cli-devin directive | 3/10 |

**Why this one**: The operator was explicit about cli-devin SWE-1.6; the skill's own methodology supplies the breadth/adjudication/synthesis structure that makes a single-executor loop trustworthy.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Honors the operator's named toolchain exactly.
- Adjudication iter-7 filters false positives before synthesis (90%+ false-positive reduction per arc-119 precedent).

**What it costs**:
- No cross-model confirmation unless the optional cli-codex synthesis pass is approved at the gate. Mitigation: adjudication iter compensates for single-executor noise.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| SWE-1.6 hang/timeout mid-iter | M | Per-iter timeout budget + one retry + log to convergence-summary |
| Single-executor blind spot | M | Adjudication iter + optional cli-codex synthesis at gate |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Convergence on a mature skill needs a structured multi-iter loop |
| 2 | **Beyond Local Maxima?** | PASS | Considered split + codex-only and rejected against the explicit directive |
| 3 | **Sufficient?** | PASS | Breadth + adjudication + synthesis covers exploration and noise control |
| 4 | **Fits Goal?** | PASS | Directly serves phase-5 step-5a output schema and convergence criteria |
| 5 | **Open Horizons?** | PASS | The optional cli-codex synthesis pass remains available at the gate |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Phase 5 task ledger (`tasks.md` T085-T103) sequences breadth/adjudication/synthesis on cli-devin SWE-1.6.
- Per-iteration JSON output records `executor` and `model` fields per `iteration-output.schema.json`.

**How to roll back**: Switch synthesis iters 8-10 to a cli-codex pass (or vice-versa) by editing T099-T103 and re-running; prior iteration archive entries are preserved.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Surgical-edit policy across phases 2-3

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (release-cleanup intent) |

---

### Context

The deep-agent-improvement skill is mature (v1.6.0.0, ~545 LOC SKILL.md, ~410 LOC README, 10 changelog versions, 15 references, 14 scripts). A full top-down rewrite would churn artifacts already conformant and introduce regression risk. A surgical audit-first approach edits only where deviations or bugs are found.

### Constraints

- Preserve conformant structure; do not "improve" what already works (per CLAUDE.md §1 quality principles).
- Phase 3 still rewrites README fully per scope — this ADR governs phase 2 surgical scope and phase 3 non-README artifacts.

---

### Decision

**We chose**: Surgical edits only — audit every artifact first, edit only where deviation or bug is found.

**How it works**: Phase 2 reads each artifact, diffs against the mapped sk-doc template, runs HVR + bug scan, emits findings to `audit-findings.jsonl`. Only P0/P1 findings drive immediate edits; P2 findings are deferred with rationale. The SKILL.md over-cap length (~545 vs 500) is treated as P2 unless a clean surgical cut exists, to avoid churning the load-bearing §2 router.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Surgical (Chosen)** | Preserves working content; lower regression risk; faster | Requires disciplined audit step | 9/10 |
| Full rewrite all artifacts | Forces 100% template currency | High churn; high regression risk; slow | 4/10 |
| Tiered (SKILL surgical, README full, refs surgical) | Mixed-mode flexibility | Decision overhead per artifact class | 6/10 |

**Why this one**: Matches the maturity of the existing skill and reduces blast radius without sacrificing alignment.

---

### Consequences

**What improves**:
- Minimal churn means lower risk of breaking working downstream consumers.
- Audit-first produces a traceable evidence ledger (`audit-findings.jsonl`).

**What it costs**:
- Slightly more upfront investment in audit infrastructure (schema + per-row entries). Mitigation: schema + validation built once in phase 1.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Surgical edits miss systemic drift | M | Phase 4 alignment validation gate catches systemic issues |
| Audit underestimates a deviation as P2 | L | Phase 5 deep-research loop is a second pass that can surface missed gaps |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Skill is mature; full rewrite would be wasted churn |
| 2 | **Beyond Local Maxima?** | PASS | Considered full rewrite and tiered; surgical wins on cost-benefit |
| 3 | **Sufficient?** | PASS | Phase 4 + phase 5 provide safety nets for missed deviations |
| 4 | **Fits Goal?** | PASS | Goal is release-ready, not maximal-rewrite |
| 5 | **Open Horizons?** | PASS | Pattern reusable for sibling packets |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Phase 2 task ledger (T021-T027) per-artifact audit only.
- README full rewrite stays in phase 3 (per spec) as an explicit exception.

**How to roll back**: Switch to full rewrite by replacing per-artifact T021-T027 tasks with template-render-and-replace. `audit-findings.jsonl` remains useful evidence either way.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Machine-readable `resource-map.yaml` as single source of truth (DIVERGES from sibling 002)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (explicit "resource-map.yaml" deliverable named twice in the prompt) |

---

### Context

The operator's plan input for THIS packet names `resource-map.yaml` as the phase-1 deliverable ("resource-map.yaml: every artifact touched in phases 2-4 mapped to its sk-doc template") and as the phase-5b merge target. The sibling packet `002-deep-research` chose `resource-map.md` (its ADR-003) after a separate operator clarification. The sk-doc canonical artifact is `resource-map.md`, but it is an **optional** Level-3 doc — the strict validator does not require it.

### Constraints

- The strict validator requires only the Level-3 core docs (spec/plan/tasks/checklist/decision-record/implementation-summary); `resource-map.md` is optional, and `resource-map.yaml` is a permitted extra file (like `schemas/`).
- The operator wrote `resource-map.yaml` explicitly and twice; the artifact's stated purpose (machine-readable artifact→template mapping consumed by phase-2 dispatch and phase-5 merge) is well-suited to YAML.

---

### Decision

**We chose**: A single machine-readable `resource-map.yaml` as the only artifact-map file in this spec folder. No `resource-map.md` companion (avoids dual-source drift — the exact failure mode sibling 002's ADR-003 warned against).

**How it works**: Phase 1 authors `resource-map.yaml` with one entry per artifact: `path`, `category`, `template_ref` (the sk-doc template it is audited against), `phase`, and an `audit_status` field (`PENDING` at baseline, set by phase 2). A top-level `phase5_augmentation` list reserves the slot for novel logic gaps merged in phase 5b. Phase-2 dispatch iterates the entries; phase-5b appends to `phase5_augmentation`.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`resource-map.yaml` only (Chosen)** | Honors explicit operator instruction; machine-parseable for dispatch + merge; single source of truth | Diverges from sibling 002's `.md`; not the sk-doc canonical file (but that file is optional) | 9/10 |
| `resource-map.md` only (sibling 002 choice) | sk-doc canonical; reviewer-friendly prose | Contradicts the operator's explicit `.yaml` instruction for THIS packet | 4/10 |
| Both (yaml authoritative, md generated) | Best of both | Sync drift risk + double maintenance | 5/10 |

**Why this one**: The operator's explicit, repeated instruction governs; YAML fits the machine-readable mapping purpose; a single file removes drift risk. Validator conformance is unaffected because `resource-map.md` is optional.

---

### Consequences

**What improves**:
- Direct honoring of the operator's named deliverable.
- Machine-readable map is trivially iterable by phase-2 dispatch and phase-5 merge.
- Single edit surface; no sync drift.

**What it costs**:
- Reviewers lose the prose-table ergonomics of `resource-map.md`. Mitigation: YAML keeps a `category` + `note` field per entry for human scanning, and `implementation-summary.md` carries the narrative.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future tool expects the canonical `resource-map.md` | L | Generate `.md` from the YAML on demand without changing source-of-truth |
| Validator flags `resource-map.yaml` as unexpected | L | Confirmed optional; extra files do not fail strict validate (verified in phase 1) |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Resource map is mandatory for phase 2 + phase 5 |
| 2 | **Beyond Local Maxima?** | PASS | Considered `.md`-only and dual-format; YAML wins on the operator's stated purpose |
| 3 | **Sufficient?** | PASS | YAML entries carry path, category, template_ref, phase, audit_status |
| 4 | **Fits Goal?** | PASS | Machine-readable mapping + merge target, as the operator specified |
| 5 | **Open Horizons?** | PASS | `.md` can be generated later if tooling demands it |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `resource-map.yaml` is the only artifact-map file in this spec folder.
- Phase 1 task T008 authors it; phase 2 T030 sets `audit_status`; phase 5 T113 appends `phase5_augmentation`.

**How to roll back**: Add a `resource-map.md` mirror if downstream tooling demands it; YAML stays authoritative.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Smart Router preservation default (SKILL.md §2 untouched unless cascade forces it)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Plan author (explicit in plan file) |

---

### Context

The deep-agent-improvement SKILL.md §2 SMART ROUTING section discovers resources recursively and routes per-intent (with `_guard_in_skill`, `discover_markdown_resources`, `load_if_available`, `UNKNOWN_FALLBACK`). It is load-bearing — every dispatch to the skill flows through it. Editing it risks runtime regression. The plan forbids editing it unless other phase-2 changes cascade into the router.

### Constraints

- If Smart Router is edited, ADR-005 must be authored documenting the cascade reason.
- Phase 4 alignment validation must explicitly verify Smart Router still conforms to `skill_smart_router.md` canonical pattern (resilient + guarded loading + graceful fallback).

---

### Decision

**We chose**: Smart Router untouched by default; phase-2 audit may flag deviations but resolution defers to ADR-005 if and only if cascade is unavoidable.

**How it works**: Phase 2 reads SKILL.md §2, diffs against `skill_smart_router.md`. If deviation is purely cosmetic (HVR-only), defer. If deviation is structural and a phase-2 fix elsewhere requires Smart Router change, author ADR-005 + apply minimal edit + verify via advisor probe.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Preserve by default (Chosen)** | Lowest runtime regression risk; forces explicit decision if edits needed | May leave minor HVR debt in §2 prose | 9/10 |
| Always rewrite to current template | 100% template currency | High runtime regression risk for load-bearing section | 3/10 |
| Conditional rewrite per audit | Surgical | Same as Chosen but without ADR gate; less traceability | 6/10 |

**Why this one**: Load-bearing code needs an explicit gate; preservation default + ADR-005 escape hatch balances safety and currency.

---

### Consequences

**What improves**:
- Runtime regression risk minimized.
- Every Smart Router edit becomes a documented decision.

**What it costs**:
- Minor HVR debt in §2 prose may persist. Mitigation: catalogued in `audit-findings.jsonl` as P2 with explicit deferral rationale.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Smart Router deviation goes unnoticed | L | Phase 4 alignment validation explicitly checks §2 |
| Edits forced cascade without ADR-005 | M | Phase 4 CHK-103 verifies ADR-005 presence iff §2 changed |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Smart Router is load-bearing; needs explicit handling |
| 2 | **Beyond Local Maxima?** | PASS | Considered always-rewrite and rejected for risk |
| 3 | **Sufficient?** | PASS | Default + ADR-005 escape hatch + phase-4 verification |
| 4 | **Fits Goal?** | PASS | Preserves runtime correctness during cleanup |
| 5 | **Open Horizons?** | PASS | Pattern reusable for other load-bearing skill sections |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Phase 2 task T021 explicit Smart Router preservation note.
- Phase 4 CHK-103 verifies ADR-005 iff §2 changed.

**How to roll back**: Remove ADR-005 and revert any §2 edits via git revert.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005-placeholder -->
## ADR-005: [RESERVED — Smart Router edit cascade record]

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (Reserved) |
| **Date** | [filled at phase 2 only if §2 is edited] |
| **Deciders** | TBD |

This ADR is authored at phase 2 **only if** a phase-2 change cascades into SKILL.md §2 SMART ROUTING and forces an edit (ADR-004 default is preserve-untouched). It records the cascade trigger, the minimum-scope edit applied, and the post-edit advisor-probe verification. If §2 is left untouched (expected default), this ADR remains a reserved placeholder.
<!-- /ANCHOR:adr-005-placeholder -->

---

<!-- ANCHOR:adr-006-placeholder -->
## ADR-006: Phase-4 human approval gate record

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-24 |
| **Deciders** | Operator (human reviewer at the phase-4 gate) |

### Decision

The operator reviewed `validation-report.md` at the phase-4 BLOCKING gate. The gate ran in two rounds:

- **Round 1**: with 6 findings resolved and 3 P2s deferred (AF-0003, AF-0004, AF-0008), the operator chose **"fix deferred P2s first."** This moved all three from deferred to in-scope. SKILL.md was restructured (544 → 492 LOC, contiguous §1-§10, Smart Router §2 untouched) to close AF-0003/AF-0004, and evergreen citations were reworded across 5 files to close AF-0008.
- **Round 2**: with all 9 findings resolved and every artifact class at 100% template match (0 FAIL), the operator chose **"Run Phase 5 now."**

**Scope of approval**: proceed to Phase 5 — 10 deep-research iterations on cli-devin SWE-1.6 (breadth iters 1-6, adjudication iter 7, synthesis iters 8-10), one at a time with SIGKILL between dispatches, merging converged logic gaps into `resource-map.yaml` `phase5_augmentation`.

Phase 5 task T066 is satisfied: this ADR-006 is present and non-placeholder before any dispatch.
<!-- /ANCHOR:adr-006-placeholder -->
