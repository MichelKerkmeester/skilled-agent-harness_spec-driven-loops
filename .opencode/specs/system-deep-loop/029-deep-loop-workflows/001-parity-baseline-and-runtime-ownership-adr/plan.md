---
title: "Implementation Plan: Parity baseline and runtime-ownership ADR"
description: "Implementation Plan for phase 001 of the deep-loop-workflows merge: Parity baseline and runtime-ownership ADR."
trigger_phrases:
  - "deep-loop-workflows phase 001"
  - "parity-baseline-and-runtime-ownership-adr"
  - "deep loop merge implementation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled implementation plan from parallel planning fleet"
    next_safe_action: "Execute phase 001 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-001-parity-baseline-and-runtime-ownership-adr-implementationplan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Parity baseline and runtime-ownership ADR

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs, `.cjs`/`.ts` runtime, YAML command assets |
| **Framework** | deep-loop-workflows merge (two-skill architecture) |
| **Storage** | `.opencode/skills/`, `.opencode/commands/deep/`, advisor SQLite graph |
| **Testing** | byte-identical per-mode parity vs phase-001 baseline + `validate.sh --strict` |

### Overview
Implement this as a baseline-and-decision phase only. Worker seats read source surfaces and return hashes/captures to stdout; the implementation lead writes only phase-local docs and evidence under the phase-001 spec folder. The resolved scanner keystone is applied by proving nested SKILL.md files are harmless while nested per-mode graph-metadata.json files must be dropped. No skill, command, agent, or runtime source is moved or edited in this phase.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Predecessor (none (first phase)) green.
- [ ] Phase-001 parity baseline available.
- [ ] Scope limited to this phase per `spec.md`.

### Definition of Done
- [ ] Phase plan, tasks, checklist, and implementation summary exist and validate with no placeholders.
- [ ] Source-surface manifest covers all five old skills, deep-loop-runtime, command surfaces, and current OpenCode agent files.
- [ ] Per-mode baselines exist for context, research, review, ai-council, and improvement.
- [ ] All eight /deep:* command baselines exist.
- [ ] Advisor routing baseline records current winners and future concrete mode expectations.
- [ ] Nested discovery gate proves only hub graph-metadata.json survives and per-mode graph-metadata.json files are dropped.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gated phase in the deep-loop-workflows merge pipeline. Additive/reversible (old skill dirs survive until phase 009).

### Parallel Groups (worker fleet)
- **S0** (mixed seats): Lead serial setup: create phase docs, baseline contract, output paths, and source-surface manifest scope.
- **G1** (mixed seats): Five independent mode baseline captures, one worker per existing mode packet.
- **G2** (gpt seats): Eight independent command baseline captures, one worker per /deep:* command.
- **G3** (opus seats): Advisor routing baseline plus nested graph-metadata discovery proof.
- **G4** (opus seats): Runtime-ownership ADR and Lane-D dry-run decision.
- **S1** (mixed seats): Lead serial consolidation, metadata refresh, validation, and final source-surface no-change proof.

### Read/Write Split
Read-only analysis + parity capture run on `gpt-5.5-fast --variant high` (cli-opencode); file writes/edits run on `opus-4.8` via `claude2`; the orchestrator reduces and validates.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read predecessor continuity (none (first phase)) and `../research/research.md`.
- [ ] Load the phase-001 parity baseline for the affected modes/surfaces.

### Phase 2: Core Implementation
- [ ] T1 Author phase plan, tasks, and checklist from templates. (`.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/plan.md`, `.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/tasks.md`, `.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/checklist.md`) — _verify:_ Strict validation later reports no placeholders and checklist covers all phase requirements.
- [ ] T2 Capture pre-phase source-surface manifest. (`.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/source-surface-manifest.json`, `.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/source-surface-manifest.sha256`) — _verify:_ Recompute at final gate and require byte-identical pre/post manifest for non-phase paths.
- [ ] T3 Capture per-mode artifact baselines. (`.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/modes/context.json`, `.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/modes/research.json`, `.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/modes/review.json`) — _verify:_ Two consecutive normalized captures per mode are byte-identical.
- [ ] T4 Capture all eight /deep:* command baselines. (`.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/commands/ask-ai-council.json`, `.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/commands/start-context-loop.json`, `.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/commands/start-research-loop.json`) — _verify:_ All eight command records exist and state dry-run/live classification.
- [ ] T5 Capture advisor routing baseline. (`.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/advisor-routing.jsonl`) — _verify:_ Each fixture records current winner and future expected skill+mode assertion.
- [ ] T6 Prove nested SKILL.md discovery safety and nested graph-metadata prohibition. (`.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/nested-skill-discovery/scanner-proof.md`, `.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/nested-skill-discovery/fixture-summary.json`) — _verify:_ Discovery proof reports exactly one hub graph-metadata.json and zero per-mode graph-metadata.json files.
- [ ] T7 Author runtime-ownership ADR and Lane-D dry-run decision. (`.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/decision-record.md`) — _verify:_ ADR explicitly covers runtime ownership, backend-vs-mode line, nested metadata rule, and Lane-D parity basis.
- [ ] T8 Consolidate checklist evidence and implementation summary. (`.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/checklist.md`, `.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/implementation-summary.md`) — _verify:_ Checklist items are checked only with evidence links; summary states no behavior source was edited.
- [ ] T9 Refresh phase metadata and run strict validation. (`.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/description.json`, `.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/graph-metadata.json`) — _verify:_ bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr --strict exits 0.
- [ ] T10 Prove phase-001 did not modify behavior surfaces. (`.opencode/specs/system-deep-loop/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/evidence/baseline/source-surface-manifest.json`) — _verify:_ Only phase-001 spec-folder paths changed and pre/post source-surface hashes match byte-for-byte.

### Phase 3: Verification
- [ ] Run the Parity Check (below).
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-phase-folder> --strict`.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Parity | This phase's affected modes/surfaces | Phase 001 creates the baseline and proves its own behavior preservation by comparing pre/post SHA-256 manifests for all non-phase behavior surfaces. Mode and command baselines require two consecutive single-executor normalized captures with byte-identical bytes; Lane D is dry-run-only. Later phases compare against these stored normalized bytes and hashes. |
| Structural | Spec docs | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| none (first phase) | Internal phase | Gating | This phase cannot start until its predecessor is green |
| Phase-001 baseline | Internal | Gating | Parity cannot be proven without the baseline |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Parity check fails or `validate.sh --strict` errors.
- **Procedure (per-strata)**: revert only this phase child's edits; the five old skill directories survive until phase 009, so rollback never requires a whole-tree reset.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | none (first phase) | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Next pipeline phase |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | read baseline + predecessor |
| Core Implementation | High | 10 tasks across 6 parallel group(s) |
| Verification | Medium | parity + strict validation |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase-001 baseline captured for affected surfaces.
- [ ] Old skill directories intact (deletion only in phase 009).

### Rollback Procedure
1. **Baseline is not reproducible due to nondeterminism beyond timestamps.** -> Revert evidence/baseline outputs, broaden the normalizer, and rerun captures; no behavior source rollback needed.
1. **Nested discovery proof targets SKILL.md scanning instead of graph-metadata scanning.** -> Revert nested-discovery evidence and ADR paragraph; block phase 002 until proof cites skill-graph-db.ts recursive graph-metadata discovery and folder-name throw.
1. **A worker mutates the live advisor DB during discovery testing.** -> Do not use live skill_graph_scan; if accidental, rebuild advisor state from unchanged .opencode/skills and discard worker output.
1. **Baseline captures secrets or oversized volatile blobs.** -> Revert affected evidence file, store hashes plus redacted normalized bytes, and document the redaction rule.
1. **Lane D dry-run baseline is later treated as live parity.** -> Correct ADR/checklist wording so phase 009 compares dry-run to dry-run and does not bump the Barter contract.
1. **Concurrent work changes source surfaces during phase 001.** -> Stop at final manifest check, report mismatched paths, and rerun baseline only after user confirms the new source state is intended.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: git restore the affected files; no data migration.

<!-- /ANCHOR:enhanced-rollback -->
