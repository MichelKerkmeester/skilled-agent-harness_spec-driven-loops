---
title: "Decision Record: deep-research skill release cleanup"
description: "Four plan-time ADRs anchoring locked decisions (toolchain split, surgical edits, single resource-map, Smart Router preservation). ADR-005 reserved for forced Smart Router edits. ADR-006 reserved for the phase-4 human-approval gate."
trigger_phrases:
  - "deep-research release cleanup decisions"
  - "ADR-001"
  - "split toolchain"
  - "surgical edit policy"
  - "smart router preservation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/000-release-cleanup/005-deep-research-release-cleanup"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-adrs-authored"
    next_safe_action: "author-resource-map-and-schemas"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002006"
      session_id: "131-000-002-spec-author"
      parent_session_id: "131-000-002-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Decision Record: deep-research skill release cleanup

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Phase-5 split toolchain (5 cli-devin SWE-1.6 + 5 cli-opencode deepseek/deepseek-v4-pro direct API)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (explicit answer to plan-mode clarification) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The phase-5 deep-research loop needs to surface logic gaps a single-model dispatch could miss. We had three options: cli-devin SWE-1.6 only (cheap, fast, well-tested under RCAF), cli-opencode deepseek/deepseek-v4-pro only (denser reasoning, higher per-iter cost), or a split. The trailing delegation rule in the operator's prompt says "delegate Deepseek agents through cli-opencode with the deepseek api provider", which would otherwise conflict with phase-5's explicit "CLI-DEVIN with SWE 1.6" toolchain.

### Constraints

- Mac dispatch discipline forbids batching iterations; each iter runs one at a time with SIGKILL between.
- DeepSeek through cli-opencode requires the direct `deepseek/*` API key path (not opencode-go), per `cli-opencode/SKILL.md:240`.
- SWE-1.6 requires RCAF + CLEAR + medium-density pre-planning per `cli-devin/SKILL.md:192` and `sk-prompt-models`.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Split 10 iterations as 5 cli-devin SWE-1.6 followed by 5 cli-opencode deepseek/deepseek-v4-pro (direct API).

**How it works**: Iters 1-5 run on cli-devin under SWE-1.6 with RCAF-structured prompts composed via sk-prompt. Iters 6-10 switch to cli-opencode with `--provider deepseek/deepseek-v4-pro` (requires `DEEPSEEK_API_KEY` env). Each iteration emits a JSON conforming to `schemas/iteration-output.schema.json`. Convergence judged across both halves, giving a cross-model view of any logic gaps.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Split 5+5 (Chosen)** | Cross-model validation; cheaper than 10× deepseek; honors both phase-5 toolchain and trailing delegation rule | More moving parts; switch-over discipline required | 9/10 |
| cli-devin SWE-1.6 only | Cheapest; well-tested RCAF path | Single-model blind spots; ignores trailing delegation rule | 6/10 |
| cli-opencode deepseek-v4-pro only | Denser reasoning across all 10 iters | Higher cost; longer wall-clock; ignores phase-5 explicit toolchain | 5/10 |

**Why this one**: The split converts a conflict between two operator instructions into complementary signal — SWE-1.6 explores cheaply, deepseek-v4-pro stress-tests the convergence with denser reasoning.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Cross-model convergence signal (SWE-1.6 + deepseek-v4-pro agreement is stronger evidence than either alone).
- Honors both operator instructions without dropping either.

**What it costs**:
- Switch-over discipline between iter 5 and iter 6 must verify opencode-ai version + DEEPSEEK_API_KEY. Mitigation: T080-T081 pre-flight tasks at phase 5 start.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| DEEPSEEK_API_KEY missing at iter 6 | M | T081 pre-flight stops phase 5 with explicit user prompt |
| opencode-ai 1.15.x bug at iter 6 | H | T080 version-pin check |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Convergence on a mature skill needs more than single-model signal |
| 2 | **Beyond Local Maxima?** | PASS | Considered single-model paths and rejected |
| 3 | **Sufficient?** | PASS | Two-model split balances cost + signal without third-model overhead |
| 4 | **Fits Goal?** | PASS | Directly serves phase-5 step-5a output schema and convergence criteria |
| 5 | **Open Horizons?** | PASS | Future packets can adopt the same split pattern |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Phase 5 task ledger (`tasks.md` T085-T103) sequences the split explicitly.
- Per-iteration JSON output records `executor` and `model` fields per `iteration-output.schema.json`.

**How to roll back**: Switch to single-model SWE-1.6 only by replacing T095-T103 with cli-devin invocations and re-running. Iteration archive entries from before the switch are preserved.
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
| **Deciders** | Operator (explicit answer to plan-mode clarification) |

---

### Context

The deep-research skill is mature (v1.12.0.0, 412 LOC SKILL.md, 248 LOC README, 16 changelog versions). A full top-down rewrite would churn artifacts already conformant and introduce regression risk. A surgical audit-first approach edits only where deviations or bugs are found.

### Constraints

- Preserve conformant structure; do not "improve" what already works (per CLAUDE.md §1 quality principles).
- Phase 3 still rewrites README fully per scope — this ADR governs phase 2 surgical scope and phase 3 non-README artifacts.

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
| 5 | **Open Horizons?** | PASS | Pattern reusable for sibling packets 001/003/004/005 |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Phase 2 task ledger (T021-T027) per-artifact audit only.
- README full rewrite stays in phase 3 (per spec) as an explicit exception.

**How to roll back**: Switch to full rewrite by replacing per-artifact T021-T027 tasks with template-render-and-replace. Audit-findings.jsonl remains useful evidence either way.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Single canonical `resource-map.md` (no YAML mirror)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (explicit answer to plan-mode clarification) |

---

### Context

The operator's plan input named `resource-map.yaml` as the phase-1 deliverable. The sk-doc canonical artifact is `resource-map.md` with internal markdown tables. Two paths existed: author only the canonical markdown, or maintain a yaml mirror as machine-readable source-of-truth.

### Constraints

- sk-doc validator recognizes `resource-map.md`, not `resource-map.yaml`.
- Operator confirmed `resource-map.md only` after clarification.

---

### Decision

**We chose**: Single canonical `resource-map.md` with markdown tables; no YAML.

**How it works**: Phase 1 authors `resource-map.md` per the sk-doc template, with rows per artifact and an `audit_status` column added in phase 2. Phase 5 merges novel gaps into a "Phase-5 Augmentation" section at the bottom of the same file.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`resource-map.md` only (Chosen)** | Canonical; validator recognizes it; single source of truth | Less machine-parseable than YAML | 9/10 |
| YAML only | Machine-parseable | Validator does not recognize; sk-doc deviation | 3/10 |
| Both (YAML authoritative, md generated) | Best of both | Sync drift risk; double maintenance | 5/10 |

**Why this one**: Canonical wins; phase 2/5 readers consume markdown tables natively without a generator step.

---

### Consequences

**What improves**:
- Validator conformance out of the box.
- Single edit surface; no sync drift.

**What it costs**:
- Phase 5 merge step parses markdown tables instead of YAML. Mitigation: tables are simple `|` -delimited; well-handled by hand or sed/awk.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future tooling wants YAML | L | Can generate YAML from md tables if/when needed without changing source-of-truth |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Resource map is mandatory for phase 2 + phase 5 |
| 2 | **Beyond Local Maxima?** | PASS | Considered YAML and dual-format; markdown wins |
| 3 | **Sufficient?** | PASS | Tables are readable + diffable in PRs |
| 4 | **Fits Goal?** | PASS | Direct sk-doc conformance |
| 5 | **Open Horizons?** | PASS | Reusable pattern for sibling packets |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `resource-map.md` is the only artifact-map file in this spec folder.
- Phase 1 task T008 authors it; phase 2 T030 updates the `audit_status` column; phase 5 T113 appends a Phase-5 Augmentation section.

**How to roll back**: Add a YAML mirror file if downstream tooling demands it; markdown stays authoritative.
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

The deep-research SKILL.md §2 SMART ROUTING section dynamically discovers resources and routes per-intent. It is load-bearing — every dispatch to the skill flows through it. Editing it risks runtime regression. The plan explicitly forbids editing it unless other phase-2 changes cascade into the router.

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

**Why this one**: Load-bearing code needs explicit gate; preservation default + ADR-005 escape hatch balances safety and currency.

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

<!-- ANCHOR:adr-005 -->
## ADR-005: Smart Router Phase Detection subsection added (operator override of ADR-004 default)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (explicit "fix all findings and deferred" directive) |

---

### Context

ADR-004 set the default to preserve SKILL.md §2 SMART ROUTING unless a cascade forces edits. Phase 2 surfaced two §2 deviations versus the canonical `skill_smart_router.md` pattern (AF-0001 extra "Scoped Guard and Loading" subsection; AF-0002 missing "Phase Detection" subsection between Resource Loading Levels and Smart Router Pseudocode). Both were initially deferred under ADR-004.

Operator subsequently directed: "fix all findings and deferred." This ADR records the cascade trigger and the actual edits applied to §2.

### Constraints

- §2 is load-bearing. Edits must preserve resilient/guarded loading semantics.
- Edits must not change the Smart Router Pseudocode or the Scoped Guard and Loading code blocks (both functionally required).
- Post-edit verification: advisor probe must still surface `deep-research` at threshold 0.8.

---

### Decision

**We chose**: Apply minimum-scope edits to §2 to close AF-0002 (move existing "Phase Detection" subsection from the end of §2 up to its template-prescribed position between "Resource Loading Levels" and "Smart Router Pseudocode"). Preserve "Scoped Guard and Loading" subsection (AF-0001) as a load-bearing extension that adds value.

**How it works**: One Edit operation moved the existing Phase Detection table from after "Scoped Guard and Loading" to between the Resource Loading Levels table and the Smart Router Pseudocode block. No content added or removed — only repositioned. AF-0001 needed no edit: the extra subsection clarifies load-bearing logic and survives the canonical pattern.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Move Phase Detection only (Chosen)** | Minimum-scope; preserves all functional code; closes AF-0002; defers AF-0001 cosmetic | None | 9/10 |
| Move Phase Detection + remove Scoped Guard | Strictest template conformance | Removes load-bearing clarity; high regression risk | 3/10 |
| Continue deferring both per ADR-004 | Zero risk | Operator explicitly overrode the default | 2/10 |

**Why this one**: Honors operator override while minimizing blast radius. AF-0001 stays as documented deviation (Scoped Guard adds value); AF-0002 closes cleanly via move.

---

### Consequences

**What improves**:
- SKILL.md §2 structure now matches the canonical pattern (Phase Detection in template-prescribed position).
- AF-0002 closes with zero functional code changes.

**What it costs**:
- One section moved; no content removed. Mitigation: verified post-edit that all 4 Smart Router pseudocode patterns remain present.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Move accidentally breaks markdown rendering | L | Post-edit grep confirms anchors and code fences intact |
| Advisor probe drift | L | Run skill_graph_compiler + advisor probe after phase-2 close |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator explicitly requested fix |
| 2 | **Beyond Local Maxima?** | PASS | Considered remove-Scoped-Guard alternative and rejected for regression risk |
| 3 | **Sufficient?** | PASS | Single repositioning closes AF-0002 without altering function |
| 4 | **Fits Goal?** | PASS | Aligns SKILL.md with canonical sk-doc template |
| 5 | **Open Horizons?** | PASS | Pattern reusable when other skills receive same cleanup |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `.opencode/skills/deep-research/SKILL.md` §2: "### Phase Detection" subsection moved from end of §2 to between "### Resource Loading Levels" and "### Smart Router Pseudocode".

**How to roll back**: Reverse the Edit — move the subsection back to its prior position. AF-0002 would re-open as deferred under ADR-004.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006-placeholder -->
## ADR-006: [RESERVED — Phase-4 human approval gate record]

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (Reserved) |
| **Date** | [filled at phase 4 → 5 transition] |
| **Deciders** | TBD (human reviewer) |

This ADR is filled at the phase-4 → phase-5 transition. It records: who approved, on what date, scope of approval, and explicit confirmation that the validation report was reviewed before phase 5 began. Phase 5 task T066 verifies ADR-006 is present and non-placeholder before any dispatch.
<!-- /ANCHOR:adr-006-placeholder -->
