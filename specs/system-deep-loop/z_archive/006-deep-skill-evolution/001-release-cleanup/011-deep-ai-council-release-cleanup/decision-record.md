---
title: "Decision Record: deep-ai-council skill release cleanup"
description: "Four plan-time ADRs anchoring locked decisions (all-cli-devin phase 5, surgical edits, machine-readable resource-map.yaml, Smart Router preservation). ADR-005 reserved for forced Smart Router edits. ADR-006 reserved for the phase-4 human-approval gate."
trigger_phrases:
  - "deep-ai-council release cleanup decisions"
  - "ADR-001"
  - "all cli-devin phase 5"
  - "surgical edit policy"
  - "resource-map yaml"
  - "smart router preservation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/001-release-cleanup/011-deep-ai-council-release-cleanup"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-adrs-authored"
    next_safe_action: "author-resource-map-and-schemas"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004006"
      session_id: "131-000-004-spec-author"
      parent_session_id: "131-000-004-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Decision Record: deep-ai-council skill release cleanup

---

<!-- ANCHOR:adr-001 -->
## ADR-001: All-cli-devin SWE-1.6 phase 5 (10 iterations, native-orchestrated loop)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (explicit prompt directive) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The operator's prompt names the phase-5 toolchain twice: globally ("UTILIZE CLI-DEVIN WITH SWE 1.6 AS NEEDED ALONGSIDE NATIVE CLI") and in phase-5 step 5a ("toolchain: CLI-DEVIN with SWE 1.6 per skill workflows"). Sibling packet 002-deep-research chose a 5+5 split (5 cli-devin SWE-1.6 + 5 cli-opencode deepseek-v4-pro) for cross-model signal. This packet diverges deliberately: the operator named a single executor.

### Constraints

- Mac dispatch discipline forbids batching iterations; each iter runs one at a time.
- Between-iter sweeps must PRESERVE `devin` (per `feedback_proactive_orphan_cleanup`: "kill for all except for devin"). Only `devin --print` and `/tmp/devin-*` are protected; codex/opencode/deep-research-runner orphans are swept.
- SWE-1.6 requires RCAF + CLEAR + medium-density pre-planning per `cli-devin/SKILL.md` and `sk-prompt-models` (mandatory reads before composing the dispatch prompt).
- The deep-research loop is owned by `/deep:start-research-loop` + `@deep-research` (native runtime); cli-devin is the per-iteration executor INSIDE that loop, not a replacement for the skill route (CLAUDE.md Gate-4 tiebreaker: executor CLI ≠ skill route).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: All 10 iterations run on `cli-devin --model swe-1.6`, orchestrated by the native deep-research loop. Native CLI handles loop orchestration, convergence detection, and step-5b synthesis/merge; cli-devin SWE-1.6 is the per-iteration research executor.

**How it works**: Each iteration emits a JSON conforming to `schemas/iteration-output.schema.json` (`executor: "cli-devin"`, `model: "swe-1.6"`, `prompt_framework: "RCAF"`). Convergence is judged across all 10 iterations. cli-codex is documented as a fallback executor only if a devin dispatch hangs and cannot be recovered.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **All cli-devin SWE-1.6 (Chosen)** | Honors explicit operator directive; cheap; well-tested RCAF path; single sweep discipline | Single-model blind spots vs. a split | 9/10 |
| Split 5+5 (sibling 002 pattern) | Cross-model validation | Operator named one executor; adds opencode version-pin + DEEPSEEK_API_KEY dependencies and a second sweep discipline | 5/10 |
| All-native (no cli-devin) | No external dispatch | Ignores explicit "CLI-DEVIN with SWE 1.6" directive; loses fresh-vantage value | 3/10 |

**Why this one**: The operator was explicit and singular about the executor. Honoring it keeps the dispatch discipline simple (one sweep rule, one prompt contract) and avoids importing 002's opencode-specific dependency surface.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Single, well-understood dispatch path (cli-devin SWE-1.6 under RCAF).
- Sweep discipline is uniform: preserve devin, sweep everything else.

**What it costs**:
- No built-in cross-model convergence check. Mitigation: 10 iterations on one model still surface drift; a follow-on packet may add a cross-model confirmation pass if a P0/P1 gap looks model-specific.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| devin unreachable at phase 5 | H | T080 smoke-test stops phase 5 with explicit user prompt |
| Single-model blind spot | M | Step-5b dedupe + spec/audit cross-check; escalate model-specific gaps |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 5 needs a defined executor; operator named cli-devin SWE-1.6 |
| 2 | **Beyond Local Maxima?** | PASS | Considered split + all-native and rejected for directive fidelity + simplicity |
| 3 | **Sufficient?** | PASS | 10 iterations + step-5b cross-check surface logic gaps adequately |
| 4 | **Fits Goal?** | PASS | Directly serves phase-5 step-5a output schema and convergence criteria |
| 5 | **Open Horizons?** | PASS | Cross-model confirmation remains available as a follow-on if needed |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Phase 5 task ledger (`tasks.md` T084-T102) sequences 10 cli-devin iterations with devin-preserving sweeps between.
- Per-iteration JSON output records `executor: "cli-devin"` + `model: "swe-1.6"` per `iteration-output.schema.json`.

**How to roll back**: Add a cross-model confirmation pass (cli-codex or cli-opencode) as a phase-5b sub-task if a gap looks model-specific. Iteration archive entries are preserved.
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
| **Deciders** | Operator (explicit prompt directive: "fix only deviations") |

---

### Context

The deep-ai-council skill is mature (v2.0.0.0, 477 LOC SKILL.md, 270 LOC README, 11 references, 32 feature-catalog entries, 33 playbook files, 5 changelog versions). A full top-down rewrite would churn artifacts already conformant and introduce regression risk. A surgical audit-first approach edits only where deviations or bugs are found.

### Constraints

- Preserve conformant structure; do not "improve" what already works (per CLAUDE.md §1 quality principles).
- Phase 3 still rewrites README fully per scope — this ADR governs phase-2 surgical scope and phase-3 non-README artifacts.
- Every phase-1 candidate-drift item is verified against the actual template + file before an edit is made (false-positive-P0 discipline).

---

### Decision

**We chose**: Surgical edits only — audit every artifact first, edit only where deviation or bug is found.

**How it works**: Phase 2 reads each artifact, diffs against the mapped sk-doc template, runs HVR + bug scan, emits findings to `audit-findings.jsonl`. Only P0/P1 findings drive immediate edits; P2 findings are deferred with rationale.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Surgical (Chosen)** | Preserves working content; lower regression risk; faster | Requires disciplined audit step | 9/10 |
| Full rewrite all artifacts | Forces 100% template currency | High churn; high regression risk; slow | 4/10 |
| Tiered (SKILL surgical, README full, refs surgical) | Mixed-mode flexibility | Decision overhead per artifact class | 6/10 |

**Why this one**: Matches the maturity of the existing skill and the operator's explicit preference; reduces blast radius without sacrificing alignment.

---

### Consequences

**What improves**:
- Minimal churn means lower risk of breaking working downstream consumers.
- Audit-first produces a traceable evidence ledger (`audit-findings.jsonl`).

**What it costs**:
- Slightly more upfront investment in audit infrastructure (schema + per-row entries). Mitigation: schema + ajv validation built once in phase 1.

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
| 5 | **Open Horizons?** | PASS | Pattern reusable for sibling packets 001/003/005/006/007 |

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
## ADR-003: Machine-readable `resource-map.yaml` (operator-directed; diverges from sibling 002)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (explicit prompt directive, named twice) |

---

### Context

The operator's prompt names `resource-map.yaml` as the phase-1 deliverable ("every artifact touched in phases 2-4 mapped to its sk-doc template") and again as the phase-5 merge target ("merge missing logic into resource-map.yaml"). The sk-doc canonical artifact is `resource-map.md` with markdown tables, and sibling packet 002-deep-research chose `resource-map.md` only (its ADR-003 explicitly rejected YAML). This packet diverges deliberately because the operator was explicit about YAML for this skill.

### Constraints

- The system-spec-kit validator treats `resource-map.md` as OPTIONAL at any level; a `resource-map.yaml` is therefore an extra data artifact that does not break strict validation (it is not a required file and is not parsed as a markdown spec doc).
- The map must remain the enumerable driver for phase-2 dispatch and the merge target for phase-5 — both consume it programmatically, which favors a structured data format.

---

### Decision

**We chose**: A machine-readable `resource-map.yaml` as the canonical artifact map for this packet. No `resource-map.md` mirror.

**How it works**: Phase 1 authors `resource-map.yaml` with one entry per artifact (`path`, `category`, `loc`, `template`, `phase`, `action`, `audit_status`, `notes`) plus a top-level `templates` key mapping template-keys to sk-doc paths and a reserved `phase_5_augmentation` list. Phase 2 sets `audit_status` per row; phase 5 appends novel gaps to `phase_5_augmentation`.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`resource-map.yaml` only (Chosen)** | Honors operator directive; machine-parseable for phase-2 dispatch + phase-5 merge; single source of truth | Diverges from sk-doc canonical `.md` and sibling 002 | 9/10 |
| `resource-map.md` only (sibling 002 pattern) | sk-doc canonical; PR-diffable tables | Operator explicitly directed YAML; less machine-parseable | 4/10 |
| Both (yaml authoritative, md generated) | Best of both | Sync drift risk; double maintenance; operator did not ask for md | 3/10 |

**Why this one**: The operator was explicit and repeated the `.yaml` choice. Because the validator treats resource-map as optional, the divergence carries no validation cost, and the structured format directly serves the programmatic phase-2/phase-5 consumers.

---

### Consequences

**What improves**:
- Phase-2 dispatch and phase-5 merge read structured data, not parsed markdown tables.
- Single edit surface; no sync drift.

**What it costs**:
- Divergence from sk-doc canonical + sibling 002. Mitigation: documented here; the divergence is operator-directed and validation-neutral.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future reviewer expects `resource-map.md` | L | This ADR records the deliberate, operator-directed choice |
| sk-doc validator later requires `.md` | L | Can render an `.md` view from the YAML without changing source-of-truth |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Resource map is mandatory for phase 2 + phase 5; operator named the format |
| 2 | **Beyond Local Maxima?** | PASS | Considered `.md` and dual-format; YAML wins on operator directive + machine-parseability |
| 3 | **Sufficient?** | PASS | YAML carries every field phase 2/5 need |
| 4 | **Fits Goal?** | PASS | Direct fit to "mapped to its sk-doc template" deliverable |
| 5 | **Open Horizons?** | PASS | An `.md` view can be generated later if needed |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `resource-map.yaml` is the only artifact-map file in this spec folder.
- Phase 1 task T008 authors it; phase 2 T030 updates `audit_status`; phase 5 T113 appends `phase_5_augmentation`.

**How to roll back**: Generate a `resource-map.md` view from the YAML if downstream tooling demands it; YAML stays authoritative.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Smart Router preservation default (SKILL.md §3 untouched unless cascade forces it)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Plan author (explicit in plan file) |

---

### Context

The deep-ai-council SKILL.md §3 SMART ROUTING section dynamically discovers resources and routes per-intent (it carries `INTENT_MODEL`, `RESOURCE_MAP`, guarded loading, and a full router pseudocode block). It is load-bearing — every dispatch to the skill flows through it. Editing it risks runtime regression. The plan explicitly forbids editing it unless other phase-2 changes cascade into the router.

### Constraints

- If Smart Router is edited, ADR-005 must be authored documenting the cascade reason.
- Phase 4 alignment validation must explicitly verify Smart Router still conforms to the `skill_smart_router.md` canonical pattern (resilient + guarded loading + graceful fallback).

---

### Decision

**We chose**: Smart Router untouched by default; phase-2 audit may flag deviations but resolution defers to ADR-005 if and only if cascade is unavoidable.

**How it works**: Phase 2 reads SKILL.md §3, diffs against `skill_smart_router.md`. If deviation is purely cosmetic (HVR-only), defer. If deviation is structural and a phase-2 fix elsewhere requires Smart Router change, author ADR-005 + apply minimal edit + verify via advisor probe.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Preserve by default (Chosen)** | Lowest runtime regression risk; forces explicit decision if edits needed | May leave minor HVR debt in §3 prose | 9/10 |
| Always rewrite to current template | 100% template currency | High runtime regression risk for load-bearing section | 3/10 |
| Conditional rewrite per audit | Surgical | Same as Chosen but without ADR gate; less traceability | 6/10 |

**Why this one**: Load-bearing code needs an explicit gate; preservation default + ADR-005 escape hatch balances safety and currency.

---

### Consequences

**What improves**:
- Runtime regression risk minimized.
- Every Smart Router edit becomes a documented decision.

**What it costs**:
- Minor HVR debt in §3 prose may persist. Mitigation: catalogued in `audit-findings.jsonl` as P2 with explicit deferral rationale.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Smart Router deviation goes unnoticed | L | Phase 4 alignment validation explicitly checks §3 |
| Edits forced cascade without ADR-005 | M | Phase 4 CHK-103 verifies ADR-005 presence iff §3 changed |

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
- Phase 2 task T021 explicit Smart Router (§3) preservation note.
- Phase 4 CHK-103 verifies ADR-005 iff §3 changed.

**How to roll back**: Remove ADR-005 and revert any §3 edits via git revert.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005-placeholder -->
## ADR-005: [RESERVED — Smart Router (§3) edit, only if phase-2 cascade forces it]

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (Reserved) |
| **Date** | [filled at phase 2 only if §3 is edited] |
| **Deciders** | TBD |

This ADR is authored at phase 2 if and only if a phase-2 change cascades into SKILL.md §3 SMART ROUTING. It records: the cascade trigger (which finding forced the edit), the exact §3 change applied, confirmation that the router pseudocode and guarded-loading semantics are preserved, and the post-edit advisor-probe result. If §3 is left untouched (the expected default per ADR-004), this ADR stays reserved.
<!-- /ANCHOR:adr-005-placeholder -->

---

<!-- ANCHOR:adr-006-placeholder -->
## ADR-006: Phase-4 human approval gate record

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-24 |
| **Deciders** | Operator (explicit approval) |

### Decision

The operator reviewed `validation-report.md` (verdict: PASS with one explicit documented deviation) and approved proceeding to Phase 5 ("Continue"). Approval covers the full Phase-5 deep-research session (10 cli-devin SWE-1.6 iterations, run one at a time).

### Validation report reviewed

- 8 in-scope artifacts validated: 7 PASS + 1 PASS_WITH_DEVIATIONS (`SKILL.md`, AF-0009).
- Findings ledger fully dispositioned: 7 resolved, 1 false-positive dropped, 1 accepted documented deviation (AF-0009).
- Evidence: strict validate 0/0, sk-doc package valid, 26/26 README links resolve, HVR ≥90, Smart Router §3 untouched, scope-locked to `deep-ai-council/`.

### AF-0009 disposition

The operator accepted the one P2 deviation (`SKILL.md` §1 OPERATIONAL MODES precedes WHEN TO USE; load-bearing + package-valid) as documented rather than requesting the renumber fix. Satisfies the gate criterion "100% conformance OR explicit deviation log."

### Phase-5 authorization

Per the cli-devin single-dispatch discipline (deep-flow session), this approval authorizes the whole 10-iteration session: iterations chain back-to-back with SIGKILL + `/tmp` sweep between (devin preserved per "kill for all except devin"), not per-iteration confirmation. Phase 5 task T066 (ADR-006 present + non-placeholder) is satisfied by this record.
<!-- /ANCHOR:adr-006-placeholder -->
