---
title: "Feature Specification: create-skill contract unification"
description: "Collapse the triplicated create-skill creation/validation contract into one machine-readable source, add a strict validation mode and a kind-aware completion gate, and render init_skill.py from the canonical assets — closing the nine findings in create-skill-findings.md."
trigger_phrases:
  - "create-skill contract unification"
  - "014 sk-doc phase 028"
  - "create-skill findings remediation"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification"
    last_updated_at: "2026-07-13T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the contract-unification remediation plan"
    next_safe_action: "Operator resolves the description-budget fork, then execute Phase 1 contract extraction"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-skill/scripts/init_skill.py"
      - ".opencode/skills/sk-doc/create-skill/scripts/package_skill.py"
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Feature Specification: create-skill contract unification

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

A read-only audit (`../create-skill-findings.md`) confirmed against current code that the `sk-doc` routing-hub architecture is sound but its creation and validation layer does not enforce its own written contract. The audit raised nine findings — five High, four Medium — verified independently at file:line.

Those findings share one root cause: **the create-skill contract is declared in three drifting places at once** — an embedded `SKILL_TEMPLATE` string inside `init_skill.py`, the canonical `assets/skill/` templates, and three validators (`package_skill.py`, `quick_validate.py`, `parent-skill-check.cjs`) that disagree on the rules. Section order, description budget, required rules, and tool rules each have two or three non-identical authorities. Fix the duplication and findings 2, 4, and 7 dissolve; the rest are enforcement gaps around it.

**Key decisions**: make one machine-readable contract the single source of truth consumed by templates, initializer, and every validator (ADR-001); add a strict validation mode kept back-compatible with today's warning mode (ADR-002); reconcile the three-way description-length contradiction to one budget (ADR-003, operator fork); make the documented completion gate kind-aware so a parent hub proves the parent contract (ADR-004).

**Critical dependencies**: `init_skill.py`, `package_skill.py`, the `assets/skill/` + `assets/parent_skill/` templates, and `parent-skill-check.cjs`. No advisor-scorer surface is touched.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete (executed 2026-07-13; 12 commits shipped to skilled/v4.0.0.0) |
| **Created** | 2026-07-13 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-doc/014-sk-doc-parent` |
| **Source Audit** | `../create-skill-findings.md` |
| **Predecessor** | `005-create-skill/` (the packet under review) |
| **Successor** | none (spawns per-work-unit execution) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The create-skill creation/validation path does not enforce its documented contract. Verified against HEAD: (1) `init_skill.py` scaffolds only standalone skills — parent hubs are assembled by hand (`init_skill.py` argparse has no `--kind`; the destination arg is a filesystem dir, not a hub kind); (2) `init_skill.py` embeds a `SKILL_TEMPLATE` that has drifted from `assets/skill/skill_md_template.md` — it orders `REFERENCES` at position 3 (before HOW IT WORKS and RULES) and omits OVERVIEW, while the canonical asset puts REFERENCES last; (3) `package_skill.py --check` returns success with documented requirements demoted to warnings (description length and TODO are `warnings.append`); (4) three authorities give three different description budgets — `creation_workflow.md` says ≤130, `package_skill.py` recommends 150-300 and warns only outside 50-500, `quick_validate.py` hard-fails at 1,536; (5) the documented completion gate `package_skill.py <path> --check` validates a standalone folder and does not enforce parent invariants, which live in the separate `parent-skill-check.cjs`; (6) frontmatter/section checks are permissive (substring `'name:' in frontmatter`, regex not YAML parse). Four Medium findings (template cleanup, checker exactness, ZIP edge cases) sit around the same layer.

### Purpose
Convert the create-skill contract from triplicated-and-drifting to single-source-of-truth. Author one machine-readable contract that declares section order, description budget, required rules, tool rules, and supported packet kinds; make the templates, the initializer, and all validators consume it; add a strict mode that promotes documented requirements to failures; and make the documented completion gate kind-aware so a parent hub cannot pass having proved none of its parent invariants.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A sequenced, phased plan for seven work units (WU1–WU7) mapping the nine audit findings to fixes with real file:line anchors.
- One machine-readable contract as the single source consumed by templates, `init_skill.py`, `package_skill.py`, and `parent-skill-check.cjs`.
- A strict validation mode and a kind-aware completion gate.
- Rendering `init_skill.py` from `assets/` (retiring the embedded template) plus a `--kind parent` path.
- Exact-structure parsing (YAML frontmatter, real `allowed-tools` array, exact H2 match, `packetSkillName` vs nested name, `tieBreak` permutation).
- A focused fixture suite, including the two inferred ZIP edge cases.

### Out of Scope
- Executing any code — this phase authors the plan only; each WU executes once its gate opens.
- Any change to the `sk-doc` hub routing architecture (the audit confirms it is sound).
- Any advisor scorer / skill-graph surface.
- Retro-authoring the `/doc:quality` command or other bindings outside create-skill (tracked in `024-canon-self-enforcement`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `028-create-skill-contract-unification/{spec,plan,tasks,checklist,decision-record}.md` | Add | Level-3 plan docs |
| `028-create-skill-contract-unification/{description,graph-metadata}.json` | Add | Generated metadata |
| `014-sk-doc-parent/graph-metadata.json` | Modify | Enroll 028 as a child |
| `014-sk-doc-parent/spec.md` | Modify | Add the 028 row to the Phase Documentation Map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every audit finding (1–9) maps to a work unit with a fix approach and real file:line anchors | plan.md §3 lists WU1–WU7; no orphan finding |
| REQ-002 | The single-source contract is the keystone and leads the sequence | Phase 1 authors the contract; WU2–WU6 consume it, none re-declares a rule |
| REQ-003 | The description-budget contradiction is resolved to one authority | decision-record ADR-003 names the winning budget; all three sites converge on it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each work unit carries a verification gate | plan.md §5 gives each WU a fixture/test + `parent-skill-check.cjs` 0/0 + `validate.sh --strict` gate |
| REQ-005 | Strict mode stays back-compatible | plan.md keeps warning mode as default; `--strict` is opt-in then required at completion |
| REQ-006 | This plan folder passes strict validation | `validate.sh --strict` exits with Errors:0 for `028-create-skill-contract-unification/` |
| REQ-007 | No create-skill fix regresses the current green trees | `package_skill.py --check` on create-skill + `parent-skill-check.cjs` on sk-doc stay green after each WU |
| REQ-008 | The hub routing architecture is left untouched | No edit to `sk-doc/SKILL.md` routing, `mode-registry.json`, or `hub-router.json` scoring; the audit confirms the hub model is sound |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: plan.md decomposes all nine findings into WU1–WU7 with fix approach, real anchors, and a gate each.
- **SC-002**: The machine-readable contract (WU1) is the single declared source; the embedded template and the divergent validator thresholds are retired or made to read from it.
- **SC-003**: The completion gate is kind-aware (standalone → package check; parent → package check + parent-skill-check); strict mode fails on the demoted requirements.
- **SC-004**: `validate.sh --strict` passes (Errors:0) for this folder; the parent enrolls 028.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Strict mode flips warnings to errors and reds existing skills | Blocked completion across the fleet | Ship strict as opt-in; audit the fleet under `--strict` before requiring it; grandfather with an explicit allowlist |
| Risk | Retiring the embedded template breaks `init_skill.py` output | Broken scaffolder | Render from `assets/` behind a fixture that diffs generated output against the canonical template |
| Risk | Reconciling the description budget invalidates existing descriptions | Mass re-trim | Pick the least-disruptive budget (ADR-003); warn-not-fail on legacy until re-trimmed |
| Dependency | `assets/skill/` + `assets/parent_skill/` templates | Contract source | Templates read the contract; keep them the human-facing rendering of it |
| Dependency | `parent-skill-check.cjs` (outside the packet) | Kind-aware gate | WU3 dispatches it; no change to its rules beyond consuming the shared contract |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The contract loader must be dependency-light (stdlib JSON/YAML) so `package_skill.py` and `parent-skill-check.cjs` can both read it without new runtime deps.
- **NFR-P02**: Strict validation must not add a materially slower pass than the current `--check`.

### Security
- **NFR-S01**: No work unit widens a skill's tool surface or changes any capability; the fixes are validation and generation only.
- **NFR-S02**: The ZIP-packaging fixes (WU7) must exclude files under hidden ancestor directories and must not archive their own output.

### Reliability
- **NFR-R01**: `init_skill.py` rendered from `assets/` must be byte-reproducible for a given input (a fixture asserts it).
- **NFR-R02**: Every create-skill fix keeps `package_skill.py --check` (create-skill) and `parent-skill-check.cjs` (sk-doc) green.

## 8. EDGE CASES

### Data Boundaries
- **Empty / malformed frontmatter**: exact YAML parse (WU5) must fail cleanly, not pass on a substring match.
- **`allowed-tools: Read` (scalar)**: must fail — it is not a real array — under both normal and strict modes.

### Error Scenarios
- **Parent hub run through the standalone gate**: WU3 must detect kind and require `parent-skill-check.cjs`; a parent must not pass on the standalone gate alone.
- **Warning-only document under strict mode**: must fail (TODO, missing rule subsections, placeholder examples, missing resource frontmatter).

## 9. COMPLEXITY ASSESSMENT

Medium. High breadth (templates + initializer + three validators) but low per-edit algorithmic depth; the keystone is a data-modelling task (one contract schema) plus mechanical consumption edits. The only judgment-heavy decision is the description-budget reconciliation, which is surfaced as an operator fork. No advisor/scoring surface is touched, keeping blast radius contained to the create-skill packet plus the one external checker it dispatches.

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Strict mode reds the existing fleet | M | H | Opt-in first; fleet audit; grandfather allowlist |
| R-002 | Contract schema misses a rule a validator needs | M | M | Derive the schema from the union of the three validators' current rules |
| R-003 | init render diverges from the canonical template | M | L | Golden-diff fixture on generated output |
| R-004 | Concurrent branch churn collides with edits | M | H | 0-leak scoped commits per WU |

## 11. USER STORIES

### US-001: Skill author (Priority: P0)
**As a** skill author, **I want** one command whose passing result proves my skill meets the documented contract, **so that** "validation passed" and "contract satisfied" are the same statement.

**Acceptance Criteria**:
1. Given a standalone skill with a TODO in its description, when I run the completion gate in strict mode, then it fails naming the TODO.
2. Given a parent hub, when I run the documented completion gate, then it runs `parent-skill-check.cjs` and proves the parent invariants.

### US-002: Framework maintainer (Priority: P1)
**As a** maintainer, **I want** section order, description budget, and tool rules declared once, **so that** a template edit and a validator edit cannot drift apart.

**Acceptance Criteria**:
1. Given the contract changes the required section order, when the templates and validators run, then all read the new order from the single source.
2. Given `init_skill.py` renders a skill, when I diff it against the canonical template, then they agree (no embedded copy).

## 12. OPEN QUESTIONS

- One operator fork: which description budget wins (see decision-record ADR-003) — the workflow's ≤130 soft target, or `package_skill.py`'s 150-300 recommendation. RESOLVED by the operator to the recommended default (≤130 soft, 1,536 hard cap retained); shipped in WU1b (`0f2c601f9f`).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Source audit**: See `../create-skill-findings.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Packet under review**: See `../005-create-skill/`
