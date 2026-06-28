---
title: "Decision Record: deep-loop-runtime skill release cleanup"
description: "Five plan-time ADRs anchoring locked decisions (Level 3 doc set, all-cli-devin phase-5 toolchain, accepted assets/ absence, surgical no-code-edit boundary, resource-map.md canonical). ADR-006 reserved for the phase-4 human-approval gate. ADR-007 reserved for forced Smart Router edits."
trigger_phrases:
  - "deep-loop-runtime release cleanup decisions"
  - "ADR-001 level 3"
  - "ADR-002 all cli-devin"
  - "ADR-003 assets absent"
  - "ADR-004 no code edits"
  - "ADR-005 resource map canonical"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-adrs-authored"
    next_safe_action: "author-resource-map-and-remaining-docs"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000001006"
      session_id: "131-000-001-spec-author"
      parent_session_id: "131-000-001-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Decision Record: deep-loop-runtime skill release cleanup

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Documentation Level 3 (full Level 3 doc set + schemas/ + resource-map.md)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (explicit answer to plan-mode clarification) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The user spec at plan time listed seven deliverables (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, schemas/*.json, resource-map). Sibling phases under `001-ai-council/` each ship a bare `spec.md` (300-500 LOC) with no Level 3 ceremony, but this packet has 5-phase scope with architectural decisions (sk-doc 1:1 enforcement, no-code-edit boundary, 10-iter deep-research loop), spans ~65 documentation artifacts, and gates phase 5 on human approval. Level 1 minimalism would under-document the scope; Level 2 lacks the ADR ceremony needed to lock these decisions.

### Constraints

- The sibling `002-deep-research` packet at the same depth runs Level 3 — keeping `001-deep-loop-runtime` at the same level preserves cross-packet readability for the human reviewer of the 000-release-cleanup arc.
- Strict validator (`validate.sh --strict`) accepts Level 1/2/3 — choice is a clarity decision, not a validator constraint.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Full Level 3 set (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md + description.json + graph-metadata.json) plus packet-specific extras (4 JSON schemas, resource-map.md).

**How it works**: Each Level 3 doc carries its own continuity frontmatter and SPECKIT_TEMPLATE_SOURCE marker. Schemas live in `schemas/` and validate every JSONL state file emitted in phases 2/4/5. resource-map.md mirrors the 002 packet's structure so the human reviewer can scan both packets with one mental model.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Level 3 (Chosen)** | Full ADR ceremony; matches sibling 002; complete Phase 4 gate evidence | Heavier authoring effort at phase 1 | 9/10 |
| Level 2 (no decision-record) | Lighter authoring | Loses ADR anchoring for the 5 locked decisions | 6/10 |
| Level 1 (minimal) | Matches sibling 001-ai-council/* style | Severely under-documents 5-phase scope with human-gate | 3/10 |

**Why this one**: Level 3 is the right ceiling for a 5-phase audit packet with one blocking human gate. The doc-authoring cost amortizes across the four remaining `000-release-cleanup/00N` siblings that follow this pattern.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- ADR-001 through ADR-005 anchor the locked decisions in one place; reviewers do not need to read spec.md prose to find them.
- The checklist.md provides explicit phase-exit evidence rows that map 1:1 to SC-001 through SC-007.
- The implementation-summary.md skeleton becomes the single artifact filled at phase-5 close, leaving no template placeholders.

**What it costs**:
- ~2-3 hours of phase-1 authoring effort vs ~1 hour for Level 1.
- Risk of doc drift if phase-2/3 changes are not reflected back into spec.md / plan.md.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Doc drift across spec.md / plan.md / tasks.md if phase-2/3 changes scope | L | Phase-exit handoff includes cross-doc sync check |
| Reviewer fatigue from redundant Level 3 ceremony | L | One-mental-model alignment with sibling 002 outweighs marginal duplication |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 5-phase scope with human gate + 88-artifact audit needs ADR + checklist evidence |
| 2 | **Beyond Local Maxima?** | PASS | Considered Level 1 / Level 2 / Level 3; Level 3 wins on cost-benefit for this packet class |
| 3 | **Sufficient?** | PASS | Level 3 doc set covers spec + plan + tasks + checklist + ADRs + summary + resource-map |
| 4 | **Fits Goal?** | PASS | Goal is release-ready peer-runtime skill with audit-trail; Level 3 produces that trail |
| 5 | **Open Horizons?** | PASS | Same Level 3 template reusable for sibling 003/004/005 release-cleanup packets |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Phase 1 task ledger (`tasks.md` T001-T015) authors the full Level 3 doc set.
- Strict validator (`validate.sh --strict`) gates phase-1 exit.
- Sibling 002 structural template is the authoritative shape source.

**How to roll back**: Drop to Level 2 by deleting `decision-record.md` (and merging key decisions into `spec.md` §EXECUTIVE SUMMARY). Re-run strict validator. Loss: ADR anchoring + sub-anchor evidence trail.
<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Phase-5 all-cli-devin SWE-1.6 toolchain (10 iterations on a single executor)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (explicit answer to plan-mode clarification: chose `/deep:start-research-loop` with cli-devin SWE-1.6 per spec override) |

---

### Context

The operator's user spec for this packet phase-5 step 5a explicitly names "CLI-DEVIN with SWE 1.6 per skill workflows" as the toolchain. The trailing DELEGATION RULES line on the same prompt says "delegate Deepseek agents through cli-opencode with the deepseek api provider". The sibling `002-deep-research` packet at the same depth resolved the conflict by splitting 5+5 (cli-devin + cli-opencode deepseek-v4-pro). This packet has a different operator instruction set and must honor the explicit phase-5 toolchain.

### Constraints

- CLAUDE.md CLI dispatch rule mandates reading `.opencode/skills/cli-devin/SKILL.md` before composing any SWE-1.6 prompt.
- CLAUDE.md small-model dispatch rule mandates consulting `sk-prompt-models` before dispatching SWE-1.6 / DeepSeek-v4 / Kimi-k2.6 / Qwen3.6 / GLM-5.1.
- Mac dispatch discipline forbids batched iterations; one iter at a time with SIGKILL between (per memory `feedback_deep_loop_iter_one_at_a_time`).
- `/deep:start-research-loop :auto` is the canonical command per Skill Advisor + AGENTS.md §7 routing; cli-devin SWE-1.6 is supported as the executor under that command.

---

### Decision

**We chose**: All 10 phase-5 iterations run on cli-devin SWE-1.6 via `/deep:start-research-loop :auto`. The trailing delegation rule about cli-opencode + deepseek-v4-pro applies to auxiliary phase-2 audit dispatches and any phase-3 or phase-4 delegation needed for bulk artifact-vs-template diff work, but does NOT apply to phase-5 (the user spec is explicit and overrides the delegation rule for this sub-step).

**How it works**: Phase 5a uses the `/deep:start-research-loop` command surface with `@deep-research` LEAF agent and cli-devin SWE-1.6 as the executor. Each iteration emits a JSON conforming to `schemas/iteration-output.schema.json`. Convergence judged by 2 consecutive iters with zero novel P0/P1 gaps OR iter 10 hard cap. Phase-2 audit dispatches may delegate to cli-opencode + deepseek-v4-pro per the trailing delegation rule (and per CLAUDE.md small-model dispatch matrix).

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **All cli-devin SWE-1.6 (Chosen)** | Honors operator phase-5 spec verbatim; cheap; well-tested RCAF path; deep-research skill supports it as executor | Single-model blind spots vs 002's split | 8/10 |
| Split 5+5 (matching 002) | Cross-model validation | Ignores explicit phase-5 toolchain; reuses 002's pattern when operator chose a different one | 5/10 |
| cli-opencode deepseek-v4-pro only | Honors trailing delegation rule | Drops explicit phase-5 toolchain | 4/10 |

**Why this one**: Operator explicit > inferred trailing rule. Resolving the conflict by deferring to the explicit phase-5 toolchain keeps the operator in control of the model selection. The sibling `002-deep-research` packet's split is a sibling-level choice, not a precedent for this packet.

---

### Consequences

**What improves**:
- Phase-5 dispatch is single-tool; no switch-over discipline between iter 5 and iter 6.
- Cost stays low (SWE-1.6 is the cheapest in the small-model matrix).
- The `deep-research` skill's bayesian-scorer convergence detection already supports cli-devin SWE-1.6 as a first-class executor.

**What it costs**:
- Single-model convergence — if SWE-1.6 has a blind spot on a logic gap, no second executor catches it.
- Bundle-hallucination risk is concentrated (per memory `feedback_cli_devin_bundle_verification`); mitigated by REQ-014 bundle gate.

**Risks**:
- R-004 in spec.md risk matrix tracks this; mitigation is bundle-gate grep-verify + smoke-run validation_commands per `feedback_bundle_gate_smoke_run`.

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Accept absence of `assets/` directory as a documented deviation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (explicit answer to plan-mode clarification: "Accept absence; log as deviation") |

---

### Context

The `deep-loop-runtime` skill folder has no `assets/` directory. The sk-doc skill anatomy lists `assets/` as a standard slot for LLM-facing payloads (templates, JSON configs, prose snippets the SKILL.md body would otherwise inline). The user spec phase-2 audit lists "Skill Asset" as an in-scope artifact, but the skill has zero of them. Three options: accept the absence and log it as a documented deviation; create an `assets/` skeleton with a placeholder README; or defer entirely to a follow-on packet.

### Constraints

- The skill is library-/script-/test-heavy (15,645 LOC across `lib/`, `scripts/`, `tests/`, `storage/`); all reusable content lives in `references/`, `feature_catalog/`, `manual_testing_playbook/`, and `lib/**/README.md`. There is no LLM-facing asset payload that would belong in `assets/`.
- Phase-4 validation is a per-artifact pass/fail report; "absent artifact class" must be representable as a row with a deviation justification rather than as a phase-2 finding.

---

### Decision

**We chose**: Accept the absence of `assets/`. Log it as a single deviation row in `validation/validation-report.jsonl` with `artifact_type: skill_asset`, `path: .opencode/skills/deep-loop-runtime/assets/`, `status: ABSENT_BY_DESIGN`, and `justification: "Skill has no LLM-facing asset payloads. All reusable content lives in references/, feature_catalog/, manual_testing_playbook/, lib/**/README.md."` No phase-2 audit finding is required (this is a phase-1 plan-time decision, not a phase-2 discovery).

**How it works**: Phase-2 audit dispatch skips the `assets/` row in `resource-map.md` (marked `audit_status: ABSENT_BY_DESIGN` from phase 1). Phase-4 validation report carries the deviation row. Phase-5 deep-research is free to surface a finding that `assets/` SHOULD exist for some new logic gap, in which case the finding is escalated to a follow-on packet.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Accept absence (Chosen)** | Honest representation of skill structure; no scope-creep work | One deviation row in the validation report | 9/10 |
| Create assets/ skeleton | Conforms to sk-doc skeleton literally | Skeleton content adds no value; would be removed in next audit | 5/10 |
| Defer to follow-on packet | Lightest phase-1 work | Leaves the audit incomplete; phase-4 report would have an ambiguous row | 4/10 |

**Why this one**: Honest representation > literal conformance. sk-doc templates describe the maximal skill shape, not the minimal; absence with justification is a valid conformance state.

---

### Consequences

**What improves**:
- Zero scope creep; phase 1 stays focused on documentation work that adds value.
- The validation-report.md sets a precedent for representing absent-by-design artifacts in future packets (`003-deep-review`, `004-deep-ai-council`, `005-deep-agent-improvement` may have similar structural gaps).

**What it costs**:
- One extra deviation row in the validation report (low signal cost).

**Risks**:
- If a future audit decides `assets/` SHOULD exist, the decision can be reopened in a follow-on packet without retroactively invalidating this packet's pass.

<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Surgical-edit policy with hard no-code-edit boundary

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (implicit via user spec's `actions: identify bugs with file + line references` framing — bugs are LOGGED, not FIXED in this packet) |

---

### Context

The phase-2 audit will read 79 files including 13 library modules + 4 scripts + 22 vitest files (~10,000 LOC of code). It is statistically certain to surface real bugs (broken imports, stale path refs, missing error handling, drift from coverage_graph_schema.md, etc.). Two policies are possible: fix as found (mixed code + doc packet), or log only (doc-only packet with code findings deferred to follow-on packets).

### Constraints

- Phase-4 validation gate is per-artifact template conformance, not code correctness — fixing code would not affect the gate.
- Phase-5 cli-devin SWE-1.6 deep-research is documentation-focused (surfaces logic gaps in coverage of the documentation, not bugs in the code itself).
- Sibling `002-deep-research` packet ADR-002 took the same posture (surgical edits to doc surface only).
- Memory feedback `feedback_worktree_cleanliness_not_a_blocker` and standard scope-lock discipline favor minimal-blast-radius packets.

---

### Decision

**We chose**: Hard no-code-edit boundary. Phase 2 audits documentation artifacts only; bugs surfaced in `lib/**`, `scripts/**`, `tests/**`, `storage/**` are logged to `findings/audit-findings.jsonl` with `status: defer:follow-on-packet` and never fixed inside this packet. Phase-3 README rewrite touches only `.opencode/skills/deep-loop-runtime/README.md` + a new changelog entry + a SKILL.md version-bump line. The skill's diff at packet close is doc-only (verified by `git diff --stat` per SC-007).

**How it works**: Every phase-2 finding row carries an `artifact_class` field. Values are: `skill_md`, `skill_readme`, `skill_reference`, `feature_catalog_entry`, `playbook_entry`, `sub_readme`, `changelog_entry`, `code_lib`, `code_scripts`, `code_tests`, `code_storage`, `config_metadata`. The first eight are eligible for surgical fixes inside this packet; the last four are LOG ONLY and emit a follow-on-packet recommendation.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **No-code-edit boundary (Chosen)** | Minimal blast radius; clean diff for review; matches 002 sibling | Real bugs ship with logged-but-unfixed status until follow-on | 9/10 |
| Mixed code + doc edits | One PR closes more bugs | Larger review surface; harder to revert; muddies phase-4 validation scope | 5/10 |
| Doc-only AND no code findings logged | Smallest possible scope | Loses high-value audit signal | 3/10 |

**Why this one**: This packet's deliverable is documentation alignment, not code repair. Code findings have value; they just don't belong in this packet's diff.

---

### Consequences

**What improves**:
- SC-007 is binary and easy to verify (`git diff --stat | grep -E '\.(ts|cjs|sh|py)$'` returns empty).
- Follow-on packets receive a ready-made backlog with file:line evidence.
- Review of this packet is fast (doc-only diff).

**What it costs**:
- Real bugs ship in v1.1.0.0 with logged status. Mitigation: follow-on packet priority set by severity in `findings/audit-findings.jsonl`.

**Risks**:
- Scope-creep temptation during phase 2 ("while we're here..."). Mitigation: REQ-006 makes the boundary a P0 acceptance criterion.

<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: `resource-map.md` as the single canonical map (no YAML mirror)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator user-spec listed `resource-map.yaml`; house convention (sibling 002 + system-spec-kit template) is `resource-map.md` |

---

### Context

The user spec phase-1 deliverable list named `resource-map.yaml`. The house convention at `.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl` and the in-progress sibling `002-deep-research/resource-map.md` both use `.md` with embedded tables. Two options: honor the spec literally (.yaml), or honor the house convention (.md).

### Constraints

- The strict validator looks for `resource-map.md` (per system-spec-kit template manifest); `.yaml` would not be recognized.
- The map is consumed by phase 2 audit dispatch and phase 4 validation as a row-by-row inventory — markdown tables render directly in reviewer view, YAML requires a render step.
- The `Note` column in the .md format already carries YAML-like key:value content (`audit_status:PENDING; 412 LOC; template=skill_reference_template.md`), so the YAML semantics are not lost.

---

### Decision

**We chose**: `resource-map.md` as the only canonical map. No YAML mirror.

**How it works**: The file uses GFM tables with one row per artifact, organized into categories (READMEs, Documents, Skills, Specs, Scripts, Config, Meta). Each row's `Note` column carries inline `key:value;` semantics that downstream scripts can grep for. Phase-5 augmentation appends rows to a reserved section at the bottom.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **resource-map.md only (Chosen)** | Validator-recognized; renders directly; matches sibling 002 and template manifest | Light divergence from user-spec literal | 9/10 |
| resource-map.yaml only | Honors spec literal | Validator does not recognize the path | 3/10 |
| Both (.md canonical + .yaml mirror) | Honors both | Two files to keep in sync; drift risk | 4/10 |

**Why this one**: Validator + house convention beat literal spec interpretation when the literal form is incompatible with the validation pipeline. The operator's intent — a structured artifact inventory — is fully served by `.md` with table rows.

---

### Consequences

**What improves**:
- Validator passes without custom shims.
- Reviewer can scan the map in any markdown renderer.
- Cross-packet consistency with sibling 002.

**What it costs**:
- Operator may expect `.yaml` if reading the user spec literally; this ADR records the conversion explicitly so the divergence is auditable.

**Risks**:
- None. The decision is recoverable — a YAML mirror can be generated post-facto if a downstream consumer needs it.

<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Phase-4 human approval for Phase-5 dispatch

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator (explicit answer to phase-4 gate question: "Approve Phase 5 dispatch (10-iter cli-devin SWE-1.6 deep-research loop)? — Approve, full 10 iteration budget") |

### Context

Phase 4 emitted `validation/validation-report.md` with the following result:
- 53 artifacts validated
- 0 FAIL · 7 PASS_WITH_DEVIATIONS · 46 PASS
- 0 P0 · 0 P1 · 16 P2 (all P2 deviations justified per project posture)
- 97.8% average template match
- SC-007 invariant preserved (zero code edits to lib/scripts/tests/storage)
- Smart Router SKILL.md §2 UNTOUCHED (ADR-007 not triggered)
- assets/ deviation recorded per ADR-003 (1 row, PASS_WITH_DEVIATIONS)

Operator reviewed the report. Approval is recorded here for audit traceability.

### Decision

**Approved**. Phase-5 dispatch authorized with full 10-iteration budget on cli-devin SWE-1.6 executor.

| Field | Value |
|-------|-------|
| Iteration budget | 10 (hard cap) |
| Executor | cli-devin SWE-1.6 (per ADR-002) |
| Command surface | `/deep:start-research-loop :auto` |
| Convergence criteria | 2 consecutive iters with zero novel P0/P1 AND Bayesian-scorer confidence ≥0.9 → early stop; else iter 10 hard cap |
| Dispatch discipline | One iteration at a time, SIGKILL between, `/tmp/devin-*` and `/tmp/deep-research-*` sweep per memory `feedback_deep_loop_iter_one_at_a_time` + `feedback_proactive_orphan_cleanup` |
| Bundle gate | Per-iter grep on internal_imports + smoke-run validation_commands per memory `feedback_bundle_gate_smoke_run` |
| Validation report SHA | (recorded at phase-1-4 commit; this entry written pre-commit) |

### Consequences

**What this unblocks**:
- Phase 5a 10-iter cli-devin SWE-1.6 deep-research loop dispatch.
- Phase 5b merge of converged novel logic gaps into `resource-map.md` Phase-5 Augmentation section.
- Final `implementation-summary.md` fill + packet close.

**What is still required after Phase 5**:
- `git diff --stat` final SC-007 confirmation (zero code edits to lib/scripts/tests/storage).
- Strict validate exit 0 post-Phase-5.
- `/memory:save` continuity update.
- Skill-graph compiler re-run if `graph-metadata.json` was touched anywhere across phases 1-5.

<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: [RESERVED] Smart Router edit rationale

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Reserved (only authored if Smart Router section in SKILL.md §2 is touched during phase 2) |
| **Date** | (added if needed) |
| **Deciders** | (filled if needed) |

### Context

The Smart Router section in `.opencode/skills/deep-loop-runtime/SKILL.md §2` is the resource-discovery entry point for the skill. Phase 2 audit defaults to preserving it untouched. If a finding requires editing this section, ADR-007 is added with the exact diff rationale and a post-edit advisor probe result.

### Decision

(filled if needed)

### Consequences

(filled if needed)

<!-- /ANCHOR:adr-007 -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md`
- **Implementation Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **Resource Map**: `resource-map.md`
- **Sibling ADRs**: `../002-deep-research/decision-record.md` (different toolchain choice — ADR-001 there vs ADR-002 here)
- **HVR rules**: `.opencode/skills/sk-doc/references/global/hvr_rules.md`
- **CLI dispatch contract**: `.opencode/skills/cli-devin/SKILL.md` (mandatory pre-read per ADR-002)
- **Small-model dispatch matrix**: `.opencode/skills/sk-prompt-models/SKILL.md` (mandatory pre-read per ADR-002)
