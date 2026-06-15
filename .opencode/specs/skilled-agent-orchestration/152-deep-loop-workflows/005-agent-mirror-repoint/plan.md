---
title: "Implementation Plan: Agent mirror repoint"
description: "Implementation Plan for phase 005 of the deep-loop-workflows merge: Agent mirror repoint."
trigger_phrases:
  - "deep-loop-workflows phase 005"
  - "agent-mirror-repoint"
  - "deep loop merge implementation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-deep-loop-workflows/005-agent-mirror-repoint"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled implementation plan from parallel planning fleet"
    next_safe_action: "Execute phase 005 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-005-agent-mirror-repoint-implementationplan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Agent mirror repoint

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
Repoint only the five native deep-loop agent bodies across the three runtime mirrors, keeping agent names and runtime permissions unchanged. Work parallelizes by mode triplet after serial prerequisite checks; one worker owns all three mirrors for a mode so parity stays local. Verification is read-only and cross-cutting: normalized mirror-body parity, stale old-skill-path grep, TOML parse, unchanged dispatch names, and phase-001 parity replay.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Predecessor (phase 004) green.
- [ ] Phase-001 parity baseline available.
- [ ] Scope limited to this phase per `spec.md`.

### Definition of Done
- [ ] Phase 001 baseline manifest located and used; no new baseline invented.
- [ ] Phase 003 mode-registry.json exists and carries workflowMode/runtimeLoopType/backendKind.
- [ ] Phase 004 command repoint is complete before agent-body edits begin.
- [ ] .codex/agents/*.toml hand-maintained status confirmed before edits.
- [ ] All 15 target agent mirror files repointed where they reference old deep-loop skill paths or skill ownership.
- [ ] Agent names unchanged across all mirrors.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gated phase in the deep-loop-workflows merge pipeline. Additive/reversible (old skill dirs survive until phase 009).

### Parallel Groups (worker fleet)
- **G0** (mixed seats): Serial dependency and repoint-map gate before any edits.
- **G1** (mixed seats): Independent per-mode triplet edits across the 15 target mirror files.
- **G2** (gpt seats): Parallel structural validation across mirrors and Codex TOML.
- **G3** (opus seats): Final parity replay, phase validation, and rollback-readiness adjudication.

### Read/Write Split
Read-only analysis + parity capture run on `gpt-5.5-fast --variant high` (cli-opencode); file writes/edits run on `opus-4.8` via `claude2`; the orchestrator reduces and validates.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read predecessor continuity (phase 004) and `../research/research.md`.
- [ ] Load the phase-001 parity baseline for the affected modes/surfaces.

### Phase 2: Core Implementation
- [ ] T1 Confirm phase 001 baseline, phase 003 registry, and phase 004 command repoint are complete before this phase starts. (`.opencode/specs/skilled-agent-orchestration/152-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/`, `.opencode/specs/skilled-agent-orchestration/152-deep-loop-workflows/003-merged-hub-and-mode-packets/`, `.opencode/specs/skilled-agent-orchestration/152-deep-loop-workflows/004-command-surface-repoint/`) — _verify:_ Registry has workflowMode/runtimeLoopType/backendKind; phase-001 baseline manifest path is known; phase 004 is complete.
- [ ] T2 Confirm Codex TOML mirrors are hand-maintained for this phase. (`.codex/agents/README.txt`, `.codex/agents/*.toml`) — _verify:_ If an active generator is found, halt and amend scope; otherwise record hand-maintained confirmation.
- [ ] T3 Build exact old-to-new path repoint map for the 15 target files only. (`.opencode/agents/deep-context.md`, `.opencode/agents/deep-research.md`, `.opencode/agents/deep-review.md`) — _verify:_ All planned target-set stale references accounted for before editing.
- [ ] T4 Repoint deep-context loop-skill ownership to merged skill mode context. (`.opencode/agents/deep-context.md`, `.claude/agents/deep-context.md`, `.codex/agents/deep-context.toml`) — _verify:_ Normalized three-way body parity passes and stale deep-context skill-path grep is empty in triplet.
- [ ] T5 Repoint deep-research protocol path. (`.opencode/agents/deep-research.md`, `.claude/agents/deep-research.md`, `.codex/agents/deep-research.toml`) — _verify:_ Triplet grep for .opencode/skills/deep-research/ is empty and normalized parity passes.
- [ ] T6 Repoint deep-review protocol and reducer paths. (`.opencode/agents/deep-review.md`, `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`) — _verify:_ Triplet grep for .opencode/skills/deep-review/ is empty; sk-code-review/references/review_core.md remains.
- [ ] T7 Repoint deep-improvement skill ownership row to merged improvement mode family. (`.opencode/agents/deep-improvement.md`, `.claude/agents/deep-improvement.md`, `.codex/agents/deep-improvement.toml`) — _verify:_ No wording adds an improvement runtime loopType; normalized triplet parity passes.
- [ ] T8 Repoint ai-council skill paths in lockstep. (`.opencode/agents/ai-council.md`, `.claude/agents/ai-council.md`, `.codex/agents/ai-council.toml`) — _verify:_ Triplet grep for .opencode/skills/deep-ai-council/ is empty and council lockstep refs all point under deep-loop-workflows/ai-council/.
- [ ] T9 Normalize and compare three-way mirror bodies for all five modes. (`.opencode/agents/deep-context.md`, `.opencode/agents/deep-research.md`, `.opencode/agents/deep-review.md`) — _verify:_ Each mode has identical normalized body across .opencode, .claude, and .codex.
- [ ] T10 Validate Codex TOML syntax and instruction extraction. (`.codex/agents/deep-context.toml`, `.codex/agents/deep-research.toml`, `.codex/agents/deep-review.toml`) — _verify:_ All five TOML files parse successfully.
- [ ] T11 Confirm agent dispatch identities remain unchanged. (`.opencode/agents/deep-context.md`, `.opencode/agents/deep-research.md`, `.opencode/agents/deep-review.md`) — _verify:_ Agent names remain deep-context, deep-research, deep-review, deep-improvement, and ai-council.
- [ ] T12 Replay phase-001 artifact parity for all affected modes. (`phase-001 baseline manifest path recorded by completed phase 001`) — _verify:_ Byte-identical hashes vs phase-001 baseline, or explicitly documented behavior-preservation fallback if native-agent prompt nondeterminism prevents byte equality.
- [ ] T13 Validate phase 005 spec folder and record checklist evidence during implementation. (`.opencode/specs/skilled-agent-orchestration/152-deep-loop-workflows/005-agent-mirror-repoint/`) — _verify:_ validate.sh --strict exits 0 for the phase folder and checklist cites parity, grep, TOML, identity, and baseline results.

### Phase 3: Verification
- [ ] Run the Parity Check (below).
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-phase-folder> --strict`.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Parity | This phase's affected modes/surfaces | Use the completed phase-001 baseline manifest and replay command. First prove normalized three-way mirror-body parity for each mode after stripping runtime wrapper/frontmatter and whitelisting only the Path Convention line. Then grep the 15 target files for stale .opencode/skills/deep-{context,research,review,improvement,ai-council}/ paths, parse all five Codex TOML files, confirm agent names/config registrations are unchanged, and rerun the phase-001 parity harness for all five modes with the same normalizer. Pass requires byte-identical artifact hashes; if model nondeterminism blocks byte equality, document behavior preservation with normalized body parity plus unchanged permissions, state contracts, and output schemas. |
| Structural | Spec docs | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| phase 004 | Internal phase | Gating | This phase cannot start until its predecessor is green |
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
| Setup | phase 004 | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Next pipeline phase |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | read baseline + predecessor |
| Core Implementation | High | 13 tasks across 4 parallel group(s) |
| Verification | Medium | parity + strict validation |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase-001 baseline captured for affected surfaces.
- [ ] Old skill directories intact (deletion only in phase 009).

### Rollback Procedure
1. **One runtime mirror is missed, causing silent native-seat drift.** -> Revert the affected mode triplet only, then reapply from the canonical .opencode agent body and re-align .claude and .codex mirrors.
1. **Codex TOML becomes syntactically invalid due multiline quote edits.** -> Revert only the affected .codex/agents/<mode>.toml file, reapply substitutions inside developer_instructions, and rerun TOML parse.
1. **ai-council lockstep is broken by updating persist-artifacts.cjs without output_schema.md or structure refs.** -> Revert the ai-council triplet and reapply all council path rewrites as one atomic mode batch.
1. **Orchestrator mirrors still contain old council helper paths and a validator treats that as phase-005 scope.** -> Stop for logic-sync and either amend phase 005 to include the orchestrator triplet or defer it to its owning phase; do not silently widen scope.
1. **Artifact replay differs from phase-001 baseline due native-agent prompt text changes.** -> Revert the mode triplet; if only path text changed, document behavior-preservation fallback and require owner acceptance before advancing.
1. **Per-mode graph-metadata.json is accidentally introduced while touching mode packets.** -> Delete only the accidental per-mode metadata files; the keystone allows only the hub deep-loop-workflows/graph-metadata.json.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: git restore the affected files; no data migration.

<!-- /ANCHOR:enhanced-rollback -->
