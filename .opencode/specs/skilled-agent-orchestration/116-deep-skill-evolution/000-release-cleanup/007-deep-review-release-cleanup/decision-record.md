---
title: "Decision Record: deep-review skill release cleanup"
description: "Five plan-time ADRs anchoring locked decisions (single-executor toolchain, surgical edits, single resource-map, Smart Router preservation, README tone calibration). ADR-006 reserved for the phase-4 human-approval gate. ADR-007 reserved for any forced Smart Router cascade edit."
trigger_phrases:
  - "deep-review release cleanup decisions"
  - "ADR-001"
  - "single-executor toolchain"
  - "surgical edit policy"
  - "smart router preservation"
  - "readme tone calibration"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-adrs-authored"
    next_safe_action: "author-resource-map-and-schemas"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003006"
      session_id: "131-000-003-spec-author"
      parent_session_id: "131-000-003-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Decision Record: deep-review skill release cleanup

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Single-executor phase-5 toolchain (10 iters CLI-DEVIN SWE-1.6)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (explicit answer to plan-mode clarification) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The phase-5 deep-research loop needs to surface logic gaps not visible at planning time. Three options existed: cli-devin SWE-1.6 only (cheap, fast, single-model signal), the 5+5 split sibling 002-deep-research used (cli-devin SWE-1.6 + cli-opencode deepseek/deepseek-v4-pro direct API, cross-model signal), or 7+3 with cli-codex gpt-5.5 high fast on the tail (highest signal but most expensive). The operator's `ds.yaml` named CLI-DEVIN with SWE 1.6 explicitly for all 10 iterations.

### Constraints

- Mac dispatch discipline forbids batching iterations; each iter runs one at a time with SIGKILL between (per `feedback_deep_loop_iter_one_at_a_time`).
- SWE-1.6 requires RCAF + CLEAR + medium-density pre-planning per `cli-devin/SKILL.md` and the small-model dispatch rule (`sk-prompt-small-model`).
- Single-model convergence has weaker cross-validation than the sibling 002 split; phase-2 audit + phase-4 human review provide independent safety nets.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: All 10 phase-5 iterations on cli-devin SWE-1.6 (single executor).

**How it works**: Iters 1-10 run on cli-devin under SWE-1.6 with RCAF-structured prompts composed via sk-prompt. Each iteration emits a JSON conforming to `schemas/iteration-output.schema.json` with `executor:"cli-devin"` and `model:"swe-1.6"` for every row. Convergence is evaluated on a single-model variance signal; the resource-map merge logic dedupes accordingly. All 10 iters run regardless of early convergence — convergence is recorded in `convergence-summary.md`, not used for early-stop.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **CLI-DEVIN SWE-1.6 x10 (Chosen)** | Cheapest; well-tested RCAF path; matches operator's explicit ds.yaml directive | Single-model blind spots; weaker convergence signal than cross-model | 8/10 |
| Split 5+5 (sibling 002 pattern) | Cross-model convergence; cli-opencode deepseek-v4-pro adds reasoning density | Higher cost; ignores ds.yaml literal toolchain | 7/10 |
| 7 cli-devin + 3 cli-codex gpt-5.5 high fast | Strongest signal via adversarial cross-check | Most expensive; furthest from ds.yaml directive | 5/10 |

**Why this one**: Operator's directive is the source of truth for this packet. Single-model risk is mitigated by phase-2 audit completeness and the phase-4 human-approval gate. Sibling 002 chose the split pattern; this packet records the divergence as an explicit operator decision, not a process drift.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Single-model convergence signal is cheaper and faster to evaluate.
- Honors operator's literal toolchain directive.
- Lower dispatch-orchestration risk (no mid-run executor switch).

**What it costs**:
- Convergence is single-model; blind spots possible. Mitigation: phase-2 audit + phase-4 human review.
- Risk that early convergence (e.g. iters 3-4) wastes compute on iters 5-10; accepted per operator directive to run all 10.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| SWE-1.6 misses logic gaps a denser reasoner would catch | M | Phase-2 audit + phase-4 human gate; phase-5 convergence-summary records true convergence iter |
| Iteration hang or timeout | M | SIGKILL + /tmp sweep between every iter (T086-T104) |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase-5 loop is the only mechanism that surfaces post-audit logic gaps |
| 2 | **Beyond Local Maxima?** | PASS | Considered split-toolchain and cli-codex tail; operator chose single-executor explicitly |
| 3 | **Sufficient?** | PASS | 10 iters + phase-2 audit + phase-4 review provide independent signal |
| 4 | **Fits Goal?** | PASS | Goal is release-ready skill folder; single-executor reaches it cheaply |
| 5 | **Open Horizons?** | PASS | Future packets can adopt sibling 002's split pattern; this packet does not foreclose that path |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Phase 5 task ledger (`tasks.md` T085-T103) sequences all 10 iterations on cli-devin SWE-1.6.
- Per-iteration JSON output records `executor:"cli-devin"` and `model:"swe-1.6"` per `iteration-output.schema.json`.

**How to roll back**: Switch to sibling 002's split pattern by replacing T095-T103 with cli-opencode invocations on iters 6-10. Iteration archive entries from any prior run are preserved.
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

The deep-review skill is mature (v1.8.0.0, 540 LOC SKILL.md, 452 LOC README, 12 changelog versions). A full top-down rewrite would churn artifacts already conformant and introduce regression risk. A surgical audit-first approach edits only where deviations or bugs are found. The `scripts/reduce-state.cjs` reducer (1657 LOC) carries enough complexity that any behavioral edit risks load-bearing regression — it stays bug-scan-only.

### Constraints

- Preserve conformant structure; do not "improve" what already works (per CLAUDE.md §1 quality principles).
- Phase 3 still rewrites README fully per scope — this ADR governs phase 2 surgical scope and phase 3 non-README artifacts.
- Scripts stay bug-scan-only regardless of findings.

---

### Decision

**We chose**: Surgical edits only — audit every artifact first, edit only where deviation or bug is found. Scripts are bug-scan-only with no behavioral edits.

**How it works**: Phase 2 reads each artifact, diffs against the mapped sk-doc template, runs HVR + bug scan, emits findings to `audit-findings.jsonl`. Only P0/P1 findings drive immediate edits; P2 findings are deferred with rationale. Scripts get `node -c` syntax checks but no edits.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Surgical (Chosen)** | Preserves working content; lower regression risk; faster | Requires disciplined audit step | 9/10 |
| Full rewrite all artifacts | Forces 100% template currency | High churn; high regression risk; slow; reduce-state.cjs untouchable | 4/10 |
| Tiered (SKILL surgical, README full, refs surgical, scripts edit) | Mixed-mode flexibility | Decision overhead per artifact class; risk to reducer | 5/10 |

**Why this one**: Matches the maturity of the existing skill and the operator's explicit preference; reduces blast radius without sacrificing alignment. The 1657-LOC reducer is too risky to touch in a documentation packet.

---

### Consequences

**What improves**:
- Minimal churn means lower risk of breaking working downstream consumers.
- Audit-first produces a traceable evidence ledger (`audit-findings.jsonl`).
- The reducer stays exactly as shipped; any defects surface as phase-5 logic gaps for follow-on packets.

**What it costs**:
- Slightly more upfront investment in audit infrastructure (schema + per-row entries). Mitigation: schema + ajv validation built once in phase 1.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Surgical edits miss systemic drift | M | Phase 4 alignment validation gate catches systemic issues |
| Audit underestimates a deviation as P2 | L | Phase 5 deep-research loop is a second pass that can surface missed gaps |
| Reducer defect surfaces but cannot be fixed | M | Log as logic-gap in phase-5 iteration output; surface for follow-on packet |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Skill is mature; full rewrite would be wasted churn |
| 2 | **Beyond Local Maxima?** | PASS | Considered full rewrite and tiered; surgical wins on cost-benefit |
| 3 | **Sufficient?** | PASS | Phase 4 + phase 5 provide safety nets for missed deviations |
| 4 | **Fits Goal?** | PASS | Goal is release-ready, not maximal-rewrite |
| 5 | **Open Horizons?** | PASS | Pattern reusable for sibling packets 001/004/005 |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Phase 2 task ledger (T021-T027) per-artifact audit only.
- README full rewrite stays in phase 3 (per spec) as an explicit exception.
- Scripts (T027) bug-scan-only with no behavioral edits.

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

The operator's `ds.yaml` named `resource-map.yaml` as the phase-1 deliverable. The sk-doc canonical artifact is `resource-map.md` with internal markdown tables. Two paths existed: author only the canonical markdown, or maintain a YAML mirror as machine-readable source-of-truth. Sibling 002-deep-research already chose markdown-only.

### Constraints

- sk-doc validator recognizes `resource-map.md`, not `resource-map.yaml`.
- Operator confirmed `resource-map.md only` after clarification in plan mode.

---

### Decision

**We chose**: Single canonical `resource-map.md` with markdown tables; no YAML.

**How it works**: Phase 1 authors `resource-map.md` per the sk-doc template, with rows per artifact and an `audit_status` column added in phase 2. Phase 5 merges novel gaps into a "Phase-5 Augmentation" section at the bottom of the same file.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`resource-map.md` only (Chosen)** | Canonical; validator recognizes it; single source of truth; matches sibling 002 | Less machine-parseable than YAML | 9/10 |
| YAML only | Machine-parseable | Validator does not recognize; sk-doc deviation | 3/10 |
| Both (YAML authoritative, md generated) | Best of both | Sync drift risk; double maintenance | 5/10 |

**Why this one**: Canonical wins; phase 2/5 readers consume markdown tables natively without a generator step.

---

### Consequences

**What improves**:
- Validator conformance out of the box.
- Single edit surface; no sync drift.
- Shape parity with sibling 002.

**What it costs**:
- Phase 5 merge step parses markdown tables instead of YAML. Mitigation: tables are simple `|`-delimited; well-handled by hand or sed/awk.

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

The deep-review SKILL.md §2 SMART ROUTING section dynamically discovers resources and routes per-intent. It is load-bearing — every dispatch to the skill flows through it. Editing it risks runtime regression. The plan explicitly forbids editing it unless other phase-2 changes cascade into the router.

### Constraints

- If Smart Router is edited, ADR-007 must be authored documenting the cascade reason.
- Phase 4 alignment validation must explicitly verify Smart Router still conforms to `skill_smart_router.md` canonical pattern (resilient + guarded loading + graceful fallback).

---

### Decision

**We chose**: Smart Router untouched by default; phase-2 audit may flag deviations but resolution defers to ADR-007 if and only if cascade is unavoidable.

**How it works**: Phase 2 reads SKILL.md §2, diffs against `skill_smart_router.md`. If deviation is purely cosmetic (HVR-only), defer. If deviation is structural and a phase-2 fix elsewhere requires Smart Router change, author ADR-007 + apply minimal edit + verify via advisor probe.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Preserve by default (Chosen)** | Lowest runtime regression risk; forces explicit decision if edits needed | May leave minor HVR debt in §2 prose | 9/10 |
| Always rewrite to current template | 100% template currency | High runtime regression risk for load-bearing section | 3/10 |
| Conditional rewrite per audit | Surgical | Same as Chosen but without ADR gate; less traceability | 6/10 |

**Why this one**: Load-bearing code needs explicit gate; preservation default + ADR-007 escape hatch balances safety and currency.

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
| Edits forced cascade without ADR-007 | M | Phase 4 CHK-103 verifies ADR-007 presence iff §2 changed |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Smart Router is load-bearing; needs explicit handling |
| 2 | **Beyond Local Maxima?** | PASS | Considered always-rewrite and rejected for risk |
| 3 | **Sufficient?** | PASS | Default + ADR-007 escape hatch + phase-4 verification |
| 4 | **Fits Goal?** | PASS | Preserves runtime correctness during cleanup |
| 5 | **Open Horizons?** | PASS | Pattern reusable for other load-bearing skill sections |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Phase 2 task T021 explicit Smart Router preservation note.
- Phase 4 CHK-103 verifies ADR-007 iff §2 changed.

**How to roll back**: Remove ADR-007 and revert any §2 edits via git revert.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: README tone calibration at ~70% intensity of `Public/README.md`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (explicit in `ds.yaml` Phase 3 tone_anchor + scope directive) |

---

### Context

The phase-3 README rewrite needs an explicit tone target. The root `Public/README.md` (1,528 lines, technical+marketing hybrid) is the apex marketing voice for the workspace. The system-spec-kit README (1,053 lines, 10-section pattern) is the structural anchor. The operator's `ds.yaml` directs: "lean marketing over technical, one notch below root README" and "~70% intensity". Without an explicit calibration ADR, the rewrite drifts toward either pure marketing copy (HVR-noncompliant) or a feature-list dump (loses the voice anchor).

### Constraints

- HVR rules (`.opencode/skills/sk-doc/references/global/hvr_rules.md`) ban em dashes, semicolons, marketing fluff, and ~20 banned words; HVR score must reach >=85.
- Skill README template caps at 200-500 lines; the current 452-line README sits inside that envelope.
- Tone must remain technically accurate; metric claims must match `feature_catalog/feature_catalog.md` and the skill's actual behavior.

---

### Decision

**We chose**: Calibrate README tone to ~70% intensity of `Public/README.md`, anchored by an explicit calibration checklist applied during phase 3.

**How it works**: Phase 3 reads `Public/README.md` and internalizes voice/structure (without copying). Each section's first paragraph leads with an outcome-framed hook (matching Public/README.md voice but at 70% intensity — no superlatives, no marketing flourishes). Feature descriptions use the what+why+how-it-connects template. Cross-system links use explicit target paths. The calibration checklist is:

1. **Hook density**: 1 outcome-framed hook per top-level section maximum (Public/README.md averages ~1.5).
2. **Verbs**: Direct action verbs ("supports", "runs", "emits") over marketing verbs ("empowers", "revolutionizes").
3. **Metrics**: Real numbers from the skill (10 iters, 4 dimensions, 3 verdicts) over abstract claims.
4. **HVR compliance**: Score >=85 via `hvr_rules.md` rubric — non-negotiable.
5. **Cross-system links**: Every connection names the target path explicitly.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **~70% Public/README.md intensity (Chosen)** | Matches operator directive; preserves HVR compliance; clear calibration target | Subjective; relies on phase-3 self-assessment | 9/10 |
| 100% Public/README.md tone | Strongest marketing voice | Too marketing-heavy for a technical skill README; HVR risk | 4/10 |
| Pure technical / system-spec-kit voice only | Safest HVR | Loses operator's "marketing-leaning" directive | 5/10 |

**Why this one**: Honors operator's explicit ratio while keeping HVR as the hard gate. Sibling 002 used the same calibration (anchored at ~70%) without an explicit ADR — codifying it here makes the target measurable.

---

### Consequences

**What improves**:
- Phase-3 rewrite has a concrete tone target, not a vibe.
- Calibration checklist gives the reviewer something to score against.
- Cross-system connections become first-class structural elements.

**What it costs**:
- Self-assessment introduces author bias. Mitigation: phase-4 alignment gate independently scores HVR + structural match.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase-3 rewrite leans too far toward Public/README.md voice | M | HVR rubric is the hard floor; rejected below 85 |
| Calibration target drifts as Public/README.md evolves | L | Re-read tone anchor at phase-3 start; snapshot in convergence-summary if needed |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator's "~70% intensity" needs an explicit, measurable target |
| 2 | **Beyond Local Maxima?** | PASS | Considered 100% and 0% calibrations; 70% with HVR floor wins |
| 3 | **Sufficient?** | PASS | Checklist + HVR rubric + phase-4 gate triple-check the target |
| 4 | **Fits Goal?** | PASS | Goal is marketing-leaning HVR-compliant README; this ADR converges both |
| 5 | **Open Horizons?** | PASS | Calibration pattern reusable for sibling packets 001/004/005 |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Phase 3 task T046 explicitly verifies tone calibration against this ADR's checklist.
- Phase 3 task T044 (HVR self-score) and T046 (tone-anchor verification) are both required for phase-3 exit.

**How to roll back**: Drop the calibration target and restore the original 2026-04-13 README via `git checkout HEAD~N -- .opencode/skills/deep-review/README.md`. Audit-findings would re-open as deferred.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Phase-4 alignment validation gate APPROVED, Phase 5 dispatch authorized

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (single-word "Approve" reply to the Phase-4 surfaced report in chat) |

---

### Context

Phase 4 ran the alignment validation gate against every artifact under `.opencode/skills/deep-review/` in resource-map scope. The walker produced `validation-report.jsonl` (96 schema-validated rows) and `validation-report.md` (human-readable summary) and was pushed to main as commit `1d316482c3`. The verdict was PASS: 95 of 96 artifacts at 100% template match, 1 at 100% with the documented NOT-APPLICABLE deviation for `assets/prompt_pack_iteration.md.tmpl` (intentional renderer-template exemption per AF-0016), zero FAIL.

The gate was the explicit blocker before Phase 5 (10-iteration cli-devin SWE-1.6 deep-research loop per ADR-001). Without an approval record here, Phase 5 dispatch was forbidden.

### Decision

**Approved.** Phase 5 may proceed under the contracts already specified by ADR-001 through ADR-005.

### Approval Record

| Field | Value |
|---|---|
| Approver | Operator |
| Approval date | 2026-05-23 |
| Approval mechanism | Single-word "Approve" reply to the Phase-4 surfaced report in this session |
| Approval scope | Phase 5 dispatch under ADR-001 (CLI-DEVIN SWE-1.6 x10), ADR-002 (surgical-edit), ADR-003 (resource-map.md only), ADR-004 (Smart Router preservation), ADR-005 (README tone calibration) |
| Validation report reference | [`validation-report.md`](./validation-report.md) commit `1d316482c3` |
| Audit findings reference | [`audit-findings.jsonl`](./audit-findings.jsonl) (23 findings, all resolved as of Phase 4 close) |

### Out of Scope for This Approval

Per the explicit out-of-scope list in `validation-report.md` §7:

- Behavioral changes to `scripts/reduce-state.cjs` (out of scope per ADR-002, bug-scan only)
- Smart Router edits without an explicit ADR-007 cascade record (per ADR-004)
- Skipping the per-iteration SIGKILL + `/tmp` sweep discipline (per the `feedback_deep_loop_iter_one_at_a_time` memory)
- Switching the Phase 5 toolchain away from cli-devin SWE-1.6 (ADR-001 locks single executor)

### Implementation

Phase 5 task ledger T080 through T119 unblocked. Pre-flight: verify `cli-devin` binary present, verify SWE-1.6 model reachable, read `cli-devin/SKILL.md` + `sk-prompt-small-model/SKILL.md` + `sk-prompt/SKILL.md` per the CLI dispatch rule and small-model dispatch rule (CLAUDE.md §1).
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007-placeholder -->
## ADR-007: [RESERVED — Smart Router cascade override (conditional)]

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (Reserved, conditional) |
| **Date** | [filled at phase 2 if cascade forces edit] |
| **Deciders** | TBD (phase-2 author) |

This ADR is reserved for the case where phase-2 audit findings cascade into SKILL.md §2 SMART ROUTING. ADR-004 sets the default to preserve §2; this ADR is added only if a phase-2 edit elsewhere structurally requires a §2 change. The ADR must document: which audit finding (AF-####) triggered the cascade, why no smaller scope fix was possible, the exact §2 edit applied, and post-edit verification via `skill_advisor.py "run a deep review loop" --threshold 0.8`. If phase 2 closes without editing §2, this ADR stays unauthored (per `feedback_skill_docs_no_phase_references` — no narrative about not editing).
<!-- /ANCHOR:adr-007-placeholder -->
