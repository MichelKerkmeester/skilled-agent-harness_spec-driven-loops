---
title: "Feature Specification: generation and cleanup"
description: "Backlog G1-G4 plus the A-W4/A-G2 folds from the 014 asset-layer research: make command_contract.json the single source for command routers via a section-scoped generator with a --check drift gate, standardize the OWNED ASSETS and EXECUTION TARGETS tables the generator parses, repair three command-local contract mismatches, slim the fat deep/* routers by ownership, and canonize a soft argument-hint budget plus command ergonomics as validator WARN checks. Complete: G1/A-W4/G3/G4 shipped; G2 and A-G2 resolved by evidence; strict gates green."
status: complete
trigger_phrases:
  - "command router generation"
  - "command contract single source"
  - "argument-hint budget"
  - "deep router slimming"
  - "command ergonomics canon"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation/005-generation-and-cleanup"
    last_updated_at: "2026-07-16T18:23:19Z"
    last_updated_by: "claude"
    recent_action: "Shipped G1-G4 + resolved G2/A-G2 by evidence; gates green"
    next_safe_action: "Merge the worktree and FF-push to origin"
    completion_pct: 100
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-command/assets/command_contract.json"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
      - ".opencode/commands/scripts/validate-command-references.cjs"
    open_questions:
      - "G3/G4 heuristics are validator-WARN and may need allowlist tuning once noise is measured."
    answered_questions:
      - "Subaction-router routing_source naming is deferred to phase 004, which authors the field."
---
# Feature Specification: generation and cleanup

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This phase completes the command-canon remediation by making the versioned, machine-readable command contract (`command_contract.json`) the single source for the structural spans of every command router, instead of prose hand-copied across the six command families. A greenfield generator renders the contract-derivable router spans and carries a `--check` drift gate; the OWNED ASSETS and EXECUTION TARGETS tables are standardized into the uniform schemas the generator parses; three command-local contract mismatches are repaired; the fat `deep/*` routers are slimmed by moving asset-owned prose into their asset files; and a soft `argument-hint` budget plus command ergonomics canon land as validator WARN checks. All new checks extend the existing validators — no parallel lint engine.

**Key Decisions**: Section-scoped generation, not whole-file (ADR-001); greenfield generator composing three precedents (ADR-002); extend existing validators (ADR-003); G3/G4 heuristics ship as validator-WARN (ADR-004); defer the subaction-router `routing_source` naming to phase 004 (ADR-005)

**Critical Dependencies**: The phase-001 `command_contract.json` (single source), the locked 6-section grammar of `command_router_template.md` (parse target), the phase-003 semantic checks (co-run gate)

<!-- /ANCHOR:executive-summary -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Estimated LOC** | ~650 |
| **Parent Spec** | ../spec.md |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The command contract is machine-readable and versioned, but the router surfaces that must obey it are still authored by hand-copying prose across six families. Contract-derivable structure — the `argument-hint`, the OWNED ASSETS table, the EXECUTION TARGETS table, the MODE ROUTING skeleton, and the PRESENTATION BOUNDARY — exists as duplicated text in every router, so a contract change does not propagate and drift is caught only by a human reading each file. Three concrete symptoms follow from this: the create family's tables have diverged from their own template shape; three routers carry command-local claims that contradict the contract (`deep/research.md` timeout, `memory/save.md` hint/fallback text, create-family `.txt` presentation-ownership labels); and the `deep/*` routers have grown fat with display-box and autonomous-directive prose that the router's own PRESENTATION BOUNDARY assigns to an asset, not the router.

### Purpose
Close the generation-and-cleanup backlog (G1-G4) and the two folds from the 014 asset-layer research (A-W4, A-G2): stand up a section-scoped generator with a drift gate that makes the contract the single source for the router's structural spans, standardize the tables the generator parses, repair the command-local mismatches, slim the fat routers by ownership, and canonize a soft hint budget and command ergonomics as validator WARN checks. This is the command-local cleanup that the parent's dependency spine (000 then 001 then 003 then 005) places last, after the contract and semantic validation exist to generate against and check.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A greenfield `generate-command-routers.cjs` that renders contract-derivable router spans from `command_contract.json` and carries a `--check` drift gate (G1).
- Section-scoped generation and diffing of five spans only: frontmatter `argument-hint`, the OWNED ASSETS table, the EXECUTION TARGETS table/list, the MODE ROUTING skeleton, and the PRESENTATION BOUNDARY.
- Standardizing the OWNED ASSETS table to a uniform `| Purpose | Asset |` schema and EXECUTION TARGETS to a uniform `| Mode | Target |` table across families (A-W4), so the generator parses them uniformly.
- Repairing three command-local contract mismatches (G2): `deep/research.md` timeout claim, `memory/save.md` hint/fallback text, create-family `.txt` presentation-ownership labels.
- Ownership-first slimming of the fat `deep/*` routers (A-G2): moving display-box and autonomous-directive prose the router's PRESENTATION BOUNDARY assigns to an asset out of the router and into its asset files, behavior-preserving.
- A soft `argument-hint` ≤140-char budget as a validator WARN (G3), wired into `create-command/SKILL.md` Step 6 and `command_template.md`.
- Command ergonomics canon (G4): loader-gating frontmatter, agent-existence check, `User request: $ARGUMENTS` raw-echo deprecation, and the template self-sufficiency invariant, wired into `create-command/SKILL.md` Steps 6/9/11 and the create-quality-control gate.

### Out of Scope
- The versioned command contract itself, owned by phase 001.
- Census, cross-runtime invocation, topology taxonomy, and the route-manifest variant, owned by phase 004.
- Semantic invariant checks and mutation fixtures, owned by phase 003 (this phase co-runs them as a gate, does not add to them).
- The Claude command-parity decision, owned by phase 006.
- Naming the subaction-dispatch router via `routing_source` — DEFERRED to phase 004 (the `routing_source` field is currently undefined for all families; phase 004 authors it). See ADR-005; recorded so it is not treated as owed here.
- Whole-file router rendering — reserved for the compiled-stub variant, which the six authored families are not (ADR-001).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/scripts/codex/generate-command-routers.cjs | Create | Contract-to-router section generator with `--check` drift gate (G1) |
| .opencode/commands/create/*.md | Modify | Standardize divergent OWNED ASSETS / EXECUTION TARGETS tables to template shape (A-W4) |
| .opencode/commands/deep/research.md | Modify | Repair timeout claim to match the contract (G2) |
| .opencode/commands/memory/save.md | Modify | Repair hint / fallback text to match the contract (G2) |
| .opencode/commands/create/*_presentation.txt | Modify | Repair presentation-ownership labels (G2) |
| .opencode/commands/deep/*.md + deep asset files | Modify | Ownership-first slimming: move asset-owned prose into asset files (A-G2) |
| .opencode/skills/sk-doc/shared/scripts/validate_document.py | Modify | Add `argument-hint` budget WARN and ergonomics WARN checks (G3/G4) |
| .opencode/commands/scripts/validate-command-references.cjs | Modify | Extend for ergonomics coverage (G4) |
| .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs | Modify | Surface the new WARN checks through the adapter (G3/G4) |
| .opencode/skills/sk-doc/create-command/SKILL.md | Modify | Wire the hint budget and ergonomics canon into Steps 6/9/11 (G3/G4) |
| .opencode/skills/sk-doc/create-command/assets/command_template.md | Modify | Document the hint-budget principle (G3) |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 (G1) | A greenfield `generate-command-routers.cjs` renders the contract-derivable router spans from `command_contract.json` and carries a `--check` drift gate; generation is section-scoped, not whole-file | `--check` is clean on the already-conformant `.opencode/commands/` tree; regenerated spans byte-match the committed spans; a stale committed span fails `--check` |
| REQ-002 (A-W4) | The OWNED ASSETS table is standardized to one uniform `\| Purpose \| Asset \|` schema and EXECUTION TARGETS to one uniform `\| Mode \| Target \|` table across families; lands before G1 as the generator's parse target | Every family's tables match the `command_router_template.md` shapes; the generator parses them uniformly with no per-family table dialect |
| REQ-003 (G2) | Three command-local contract mismatches are repaired: `deep/research.md` timeout claim, `memory/save.md` hint/fallback text, create-family `.txt` presentation-ownership labels | The phase-003 semantic checks (gate-obligation, mode-completeness, reference coverage) and the generator span-diff pass without exceptions for these files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 (A-G2) | Ownership-first slimming of the fat `deep/*` routers: move display-box and autonomous-directive prose the router's PRESENTATION BOUNDARY assigns to an asset out of the router and into its asset files, behavior-preserving | Snapshot-verified behavior-preserving; routers keep gates, binding, mode-selection, and summary; moved prose lands in the asset the boundary names |
| REQ-005 (G3) | A soft `argument-hint` ≤140-char budget as a validator WARN (not hard-fail); principle "hint summarizes, EXECUTION TARGETS enumerates"; wired into `create-command/SKILL.md` Step 6 and `command_template.md` | Over-budget hints warn (~20 exist; `speckit/plan` at 511 chars flags); conformant hints stay silent; the check is WARN, never a hard-fail |
| REQ-006 (G4) | Command ergonomics canon: loader-gating frontmatter + agent-existence check, deprecation of the `User request: $ARGUMENTS` raw-echo idiom (copied into 14 files), and the template self-sufficiency invariant; wired into `create-command/SKILL.md` Steps 6/9/11 and the create-quality-control gate | The canon is documented in Steps 6/9/11 and the quality-control gate; the ergonomics checks are validator-WARN; the subaction-router `routing_source` sub-item is recorded as deferred to phase 004, not enforced here |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** (REQ-001): `generate-command-routers.cjs --check` is clean on the conformant `.opencode/commands/` tree and fails on a deliberately staled span.
- **SC-002** (REQ-002): Every family's OWNED ASSETS and EXECUTION TARGETS tables match the `command_router_template.md` schemas, and the generator parses them with a single uniform parser.
- **SC-003** (REQ-003): The three command-local mismatches pass the phase-003 semantic checks and the generator span-diff with no exceptions.
- **SC-004** (REQ-004): The slimmed `deep/*` routers are snapshot-verified behavior-preserving and retain gates, binding, mode-selection, and summary.
- **SC-005** (REQ-005): Over-budget `argument-hint` values warn (including `speckit/plan` at 511 chars) while conformant hints stay silent, and the check never hard-fails.
- **SC-006** (REQ-006): The G4 ergonomics canon is present in `create-command/SKILL.md` Steps 6/9/11 and the create-quality-control gate, and the `routing_source` sub-item is recorded as deferred to phase 004.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | phase-001 `command_contract.json` | No single source to generate from | Contract is shipped; the generator reads it directly, re-hard-codes nothing |
| Dependency | `command_router_template.md` locked 6-section grammar | Generator has no stable parse target | A-W4 standardizes the tables to the template shape before G1 builds |
| Dependency | phase-003 semantic checks | G2 acceptance cannot be gated | Phase 003 is materialized; this phase co-runs its checks, does not modify them |
| Risk | Whole-file rendering clobbers hand-authored behavioral prose | Loss of dispatch gates, directives, flag docs | Section-scoped generation diffs only contract-derivable spans (ADR-001) |
| Risk | G3/G4 heuristics are noisy before measurement | False WARN noise erodes trust | Ship WARN-only, tune the allowlist once noise is measured (ADR-004) |
| Risk | Deep-router slimming changes behavior | Regression in autonomous dispatch | Behavior-preserving move only; snapshot-verified; routers keep gates/binding/mode/summary |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The generator regenerates and diffs only contract-derivable spans; hand-authored behavioral prose is never rewritten.
- **NFR-M02**: New checks extend `validate_document.py`, `validate-command-references.cjs`, and the `sk-doc-command.cjs` adapter — no new parallel lint engine.
- **NFR-M03**: The generator sources all family behavior from `command_contract.json`; no family names or per-family table shapes are hard-coded in the render path.

### Correctness
- **NFR-C01**: `--check` is deterministic — the same contract and tree produce the same clean/dirty verdict on repeat runs.
- **NFR-C02**: Regenerated spans byte-match the committed conformant spans; a single stale byte fails `--check`.
- **NFR-C03**: The deep-router slimming is behavior-preserving under snapshot comparison of the dispatched runtime behavior.

### Safety
- **NFR-S01**: G3/G4 checks are WARN-tier and can never hard-fail a validation run.
- **NFR-S02**: The generator writes only the five named spans; it never touches other file regions.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Table Boundaries
- **Divergent create-family tables**: the current create tables diverge from their own template; A-W4 normalizes them before the generator parses.
- **Missing optional section**: OWNED ASSETS and PRESENTATION BOUNDARY are blocking-core; MODE ROUTING and EXECUTION TARGETS are recommended — the generator regenerates a span only when the section exists per the router grammar.
- **List vs table EXECUTION TARGETS**: some routers use a list rather than a table; the generator normalizes to the `| Mode | Target |` table shape.

### Drift Scenarios
- **Stale committed span**: a hand-edited span that no longer matches the contract fails `--check` with the offending span diffed.
- **Clean tree**: the already-conformant tree produces zero `--check` findings.
- **New contract field**: a contract change to a derivable span surfaces as a `--check` diff until the span is regenerated.

### Ownership Boundaries
- **Prose the boundary assigns to an asset**: display-box and autonomous-directive text moves to the named asset (A-G2); router-owned gates, binding, mode-selection, and summary stay.
- **Over-budget hint**: a hint above 140 chars warns; it is never rewritten or hard-failed by the validator.

<!-- /ANCHOR:edge-cases -->
---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: ~11 (1 new generator, routers across 6 families, 3 validators, 2 canon docs), LOC: ~650, Systems: generator + validators + command tree |
| Risk | 16/25 | Auth: N, API: N, Breaking: N (behavior-preserving); the risk is prose-clobber and WARN noise, mitigated by section-scoping and WARN-tier |
| Research | 8/20 | Folds A-W4/A-G2 from the 014 asset-layer research; the backlog and acceptance are already established |
| Multi-Agent | 6/15 | Workstreams: A-W4, G1, G2, A-G2, G3, G4 — sequential with two parallel lanes |
| Coordination | 12/15 | Dependencies: phase-001 contract, phase-003 checks, phase-004 `routing_source` deferral, template grammar |
| **Total** | **60/100** | **Level 3** |

Every dimension maps to a requirement: Scope/Risk to REQ-001 and REQ-004, Research to REQ-002, Coordination to REQ-003 and REQ-006, and the WARN-noise risk to REQ-005.

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Generator rewrites hand-authored behavioral prose | H | L | Section-scoped generation; diff only the five contract-derivable spans (ADR-001) |
| R-002 | A-W4 table standardization misses a family dialect | M | M | Standardize before G1; the generator's uniform parser is the acceptance test |
| R-003 | Deep-router slimming changes dispatch behavior | H | L | Behavior-preserving move; snapshot verification; keep router-owned sections |
| R-004 | G3/G4 WARN checks are noisy | M | M | WARN-only; allowlist tuning after noise is measured (ADR-004) |
| R-005 | `routing_source` sub-item forced before phase 004 defines the field | M | L | Deferred to phase 004; recorded in scope and ADR-005 |
| R-006 | Generator diverges from the phase-003 checks | M | L | Both read the same `command_contract.json`; G2 acceptance co-runs the phase-003 checks |

<!-- /ANCHOR:risk-matrix -->
---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Contract-driven router generation (Priority: P0)

**As a** command author, **I want** the router's structural spans generated from the contract, **so that** a contract change propagates instead of being hand-copied across six families.

**Acceptance Criteria**:
1. Given a conformant tree, When I run `generate-command-routers.cjs --check`, Then it reports clean with zero span diffs.
2. Given a staled committed span, When I run `--check`, Then it fails and diffs the offending span.
3. Given a contract change to a derivable span, When I regenerate, Then the written span byte-matches the contract-derived expectation.

### US-002: Uniform tables the generator can parse (Priority: P0)

**As a** command author, **I want** every family's OWNED ASSETS and EXECUTION TARGETS tables to share one schema, **so that** the generator parses them uniformly without per-family special cases.

**Acceptance Criteria**:
1. Given the create family's divergent tables, When A-W4 standardization runs, Then they match the `command_router_template.md` `| Purpose | Asset |` and `| Mode | Target |` shapes.
2. Given the standardized tree, When the generator parses it, Then a single uniform parser reads all families.

### US-003: Soft hint budget that guides, not blocks (Priority: P1)

**As a** command author, **I want** an over-long `argument-hint` to warn rather than fail, **so that** I am guided toward "hint summarizes, EXECUTION TARGETS enumerates" without a hard block.

**Acceptance Criteria**:
1. Given an over-budget hint (e.g. `speckit/plan` at 511 chars), When I validate, Then the validator emits a WARN, not an error.
2. Given a conformant hint, When I validate, Then the validator stays silent.

<!-- /ANCHOR:user-stories -->
---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Will the G3/G4 validator-WARN heuristics need allowlist tuning once real noise is measured across the corpus? **OPEN: ships WARN-only; allowlist tuned after measurement (ADR-004)**
- Should the `argument-hint` budget threshold stay at 140 chars once the ~20 current over-budget hints are surveyed? **OPEN: 140 is the initial budget; revisit if the survey shows a better cut**
- Is the compiled-stub variant ever in scope for whole-file rendering here? **RESOLVED: No — the six authored families are section-scoped; whole-file is the compiled-stub variant's concern (ADR-001)**

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Spec**: See `../spec.md` (command-canon remediation phase parent)

<!-- /ANCHOR:related-docs -->
