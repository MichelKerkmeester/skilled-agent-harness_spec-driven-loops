---
title: "Implementation Plan: Command surface repoint"
description: "Implementation Plan for phase 004 of the deep-loop-workflows merge: Command surface repoint."
trigger_phrases:
  - "deep-loop-workflows phase 004"
  - "command-surface-repoint"
  - "deep loop merge implementation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-deep-loop-workflows/004-command-surface-repoint"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled implementation plan from parallel planning fleet"
    next_safe_action: "Execute phase 004 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-004-command-surface-repoint-implementationplan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Command surface repoint

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
Repoint only the /deep command surface after phase 003 has produced the deep-loop-workflows hub, mode packets, and mandatory mode-registry.json. Use a single registry-sourced rewrite manifest: old skill IDs become deep-loop-workflows, mode-specific paths move under deep-loop-workflows/{mode}/, command and agent names remain stable, and deep-loop-runtime paths are frozen. Parallelize by disjoint command strata, then run one serial grep/scope gate and the phase-001 command parity harness.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Predecessor (phase 003) green.
- [ ] Phase-001 parity baseline available.
- [ ] Scope limited to this phase per `spec.md`.

### Definition of Done
- [ ] Phase-003 deep-loop-workflows hub, mode packets, and mode-registry.json exist before edits.
- [ ] Per-mode graph-metadata.json files are absent; only hub graph-metadata survives.
- [ ] The finalized {skill,mode} command contract is applied consistently.
- [ ] All 8 command markdown routers are repointed where they reference old skill IDs or old skill paths.
- [ ] All 12 YAML workflow assets use deep-loop-workflows plus registry-backed mode discrimination.
- [ ] All 6 presentation contracts remove stale old skill package paths without changing rendered behavior.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gated phase in the deep-loop-workflows merge pipeline. Additive/reversible (old skill dirs survive until phase 009).

### Parallel Groups (worker fleet)
- **G0** (opus seats): Serial preflight: verify phase-003 artifacts, mode registry, graph-metadata keystone, finalized {skill,mode} contract, and phase-001 baseline availability.
- **G1** (gpt seats): Context command stratum rewrite.
- **G2** (gpt seats): Research command stratum rewrite.
- **G3** (gpt seats): Review command stratum rewrite.
- **G4** (gpt seats): AI Council command stratum rewrite.
- **G5** (gpt seats): Improvement Lane A/B YAML-backed command rewrite.
- **G6** (gpt seats): Improvement Lane C/D markdown-only command rewrite.
- **G7** (opus seats): Serial integration grep, scope guard, and runtime-path invariant review.
- **G8** (mixed seats): Command parity harness can fan out by command scenario; lead/opus owns final byte comparison.
- **G9** (opus seats): Final phase validation.

### Read/Write Split
Read-only analysis + parity capture run on `gpt-5.5-fast --variant high` (cli-opencode); file writes/edits run on `opus-4.8` via `claude2`; the orchestrator reduces and validates.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read predecessor continuity (phase 003) and `../research/research.md`.
- [ ] Load the phase-001 parity baseline for the affected modes/surfaces.

### Phase 2: Core Implementation
- [ ] T1 Gate phase inputs and freeze the rewrite manifest from mode-registry.json. (`.opencode/skills/deep-loop-workflows/SKILL.md`, `.opencode/skills/deep-loop-workflows/mode-registry.json`, `.opencode/skills/deep-loop-workflows/context/`) — _verify:_ Registry completeness for all workflow modes; only hub graph-metadata survives; phase-001 command baseline is available.
- [ ] T2 Repoint context command files. (`.opencode/commands/deep/start-context-loop.md`, `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml`, `.opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml`) — _verify:_ rg for skill:\s*deep-context and .opencode/skills/deep-context returns empty on these files; deep-loop-runtime inventory unchanged.
- [ ] T3 Repoint research command files. (`.opencode/commands/deep/start-research-loop.md`, `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml`, `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml`) — _verify:_ rg for skill:\s*deep-research and .opencode/skills/deep-research returns empty on these files; required-input schema unchanged.
- [ ] T4 Repoint review command files. (`.opencode/commands/deep/start-review-loop.md`, `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`, `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`) — _verify:_ rg for skill:\s*deep-review and .opencode/skills/deep-review returns empty on these files; legacy migration strings reviewed manually.
- [ ] T5 Repoint AI Council command files. (`.opencode/commands/deep/ask-ai-council.md`, `.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml`, `.opencode/commands/deep/assets/deep_ask-ai-council_confirm.yaml`) — _verify:_ rg for skill:\s*deep-ai-council and .opencode/skills/deep-ai-council returns empty on these files; --loop-type council runtime refs preserved.
- [ ] T6 Repoint improvement Lane A/B YAML-backed command files. (`.opencode/commands/deep/start-agent-improvement-loop.md`, `.opencode/commands/deep/start-model-benchmark-loop.md`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml`) — _verify:_ rg for skill:\s*deep-improvement and .opencode/skills/deep-improvement returns empty on these eight files; --mode and sk-prompt-small-model benchmark paths preserved.
- [ ] T7 Repoint improvement Lane C/D markdown-only commands. (`.opencode/commands/deep/start-skill-benchmark-loop.md`, `.opencode/commands/deep/start-non-dev-ai-system-loop.md`) — _verify:_ rg for skill:\s*deep-improvement and .opencode/skills/deep-improvement returns empty on these two files; no new Lane C/D YAML files exist.
- [ ] T8 Run integration grep and scope guard over the command surface. (`.opencode/commands/deep/**`) — _verify:_ rg stale old skill paths/keys under .opencode/commands/deep returns empty; git diff names only the 26 command-surface files; deep-loop-runtime inventory unchanged.
- [ ] T9 Run phase-001 parity harness for all eight commands. (`phase-001 command baseline artifacts`, `temporary parity output outside repo or phase-owned scratch`) — _verify:_ cmp or SHA-256 manifest comparison passes for every command artifact with no normalization unless phase 001 recorded it.
- [ ] T10 Run final phase validation. (`.opencode/specs/skilled-agent-orchestration/152-deep-loop-workflows/004-command-surface-repoint`) — _verify:_ bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/152-deep-loop-workflows/004-command-surface-repoint --strict exits 0.

### Phase 3: Verification
- [ ] Run the Parity Check (below).
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-phase-folder> --strict`.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Parity | This phase's affected modes/surfaces | Use the phase-001 baseline harness and artifacts for the same eight command scenarios, including Lane D dry-run-only. After repointing, run the identical harness with the same inputs and environment, then byte-compare stdout, stderr, generated config/state/report artifacts, and manifests via cmp or SHA-256; separately require rg to prove stale old skill package paths and old skill keys are gone while deep-loop-runtime references are unchanged. |
| Structural | Spec docs | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| phase 003 | Internal phase | Gating | This phase cannot start until its predecessor is green |
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
| Setup | phase 003 | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Next pipeline phase |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | read baseline + predecessor |
| Core Implementation | High | 10 tasks across 10 parallel group(s) |
| Verification | Medium | parity + strict validation |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase-001 baseline captured for affected surfaces.
- [ ] Old skill directories intact (deletion only in phase 009).

### Rollback Procedure
1. **The {skill,mode} contract is not finalized at phase start.** -> Do not edit; keep phase 004 blocked at T1 and return to the Stage 1/2 owner.
1. **A worker rewrites agent names, command names, artifact names, or legacy migration text instead of skill package refs.** -> Revert only that stratum's assigned command files and reapply from the manifest.
1. **A broad rewrite changes deep-loop-runtime paths.** -> Revert offending hunks immediately and rerun runtime reference inventory diff.
1. **Setup schemas or sibling-default guardrails are dropped in large YAML/presentation files.** -> Revert the affected mode stratum and reapply with schema diff review.
1. **Byte-identical command parity fails because a source path leaks into generated output.** -> Revert the owning stratum, inspect whether the path is executable output or docs-only metadata, then reapply only if byte parity can be preserved.
1. **Lane C/D YAML assets are added for symmetry.** -> Delete the mistakenly added YAML files and restore the two markdown routers to markdown-only execution.
1. **Out-of-scope doctor, advisor, agent, or framework-doc files are touched.** -> Revert those files immediately and defer them to phases 005, 006, or 008.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: git restore the affected files; no data migration.

<!-- /ANCHOR:enhanced-rollback -->
