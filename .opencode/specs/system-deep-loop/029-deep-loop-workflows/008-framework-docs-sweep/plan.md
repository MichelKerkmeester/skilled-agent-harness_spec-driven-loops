---
title: "Implementation Plan: Framework documentation sweep"
description: "Implementation Plan for phase 008 of the deep-loop-workflows merge: Framework documentation sweep."
trigger_phrases:
  - "deep-loop-workflows phase 008"
  - "framework-docs-sweep"
  - "deep loop merge implementation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-workflows/008-framework-docs-sweep"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled implementation plan from parallel planning fleet"
    next_safe_action: "Execute phase 008 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-008-framework-docs-sweep-implementationplan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Framework documentation sweep

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
Implement this as a documentation-only sweep after phases 003-007 have already created deep-loop-workflows and collapsed routing/governance. Rewrite framework docs from five public workflow skills to one deep-loop-workflows hub with modes plus the frozen MCP-free deep-loop-runtime backend, using mode-registry.json terminology and never recreating nested per-mode graph-metadata.json. Parallelize by disjoint doc strata, but keep CLAUDE.md and AGENTS.md as one mirrored edit and reserve final integration/parity for one lead.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Predecessor (phase 007) green.
- [ ] Phase-001 parity baseline available.
- [ ] Scope limited to this phase per `spec.md`.

### Definition of Done
- [ ] Phase 007 dependency preflight is green
- [ ] deep-loop-workflows mode-registry.json is the terminology source
- [ ] Only hub deep-loop-workflows/graph-metadata.json exists
- [ ] README.md documents the two-skill architecture
- [ ] Skills catalog counts and deep-loop rows match the new architecture
- [ ] CLAUDE.md and AGENTS.md remain mirrored for deep-loop policy

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gated phase in the deep-loop-workflows merge pipeline. Additive/reversible (old skill dirs survive until phase 009).

### Parallel Groups (worker fleet)
- **G0** (opus seats): Dependency and current-state preflight; read-only checks before any edits.
- **G1** (gpt seats): Root-facing public catalog docs that can be drafted independently.
- **G2** (opus seats): Mirrored policy docs edited as a single unit to avoid drift.
- **G3** (gpt seats): Frozen runtime documentation rewrite.
- **G4** (mixed seats): Constitutional, sibling related-skill, and protocol-link doc surfaces.
- **G5** (opus seats): Hub version/changelog stamp plus final validation and parity integration.

### Read/Write Split
Read-only analysis + parity capture run on `gpt-5.5-fast --variant high` (cli-opencode); file writes/edits run on `opus-4.8` via `claude2`; the orchestrator reduces and validates.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read predecessor continuity (phase 007) and `../research/research.md`.
- [ ] Load the phase-001 parity baseline for the affected modes/surfaces.

### Phase 2: Core Implementation
- [ ] T1 Preflight phase 007 completion and verify deep-loop-workflows hub metadata exists with no nested mode graph metadata. (`.opencode/specs/system-deep-loop/029-deep-loop-workflows/007-governance-consolidation/checklist.md`, `.opencode/specs/system-deep-loop/029-deep-loop-workflows/007-governance-consolidation/implementation-summary.md`, `.opencode/skills/deep-loop-workflows/mode-registry.json`) — _verify:_ Phase 007 validate is green and rg --files for graph-metadata.json under deep-loop-workflows returns only the hub file.
- [ ] T2 Rewrite root Deep Loop sections and customization table to the two-skill architecture. (`README.md`) — _verify:_ No stale old workflow skill README links or five-public-skill catalog wording remain in README.md.
- [ ] T3 Update the skills catalog counts and deep-loop family rows. (`.opencode/skills/README.md`) — _verify:_ Catalog links resolve and counts match actual post-phase-007 skill dirs.
- [ ] T4 Mirror-update framework policy docs for the new deep-loop workflow architecture. (`CLAUDE.md`, `AGENTS.md`) — _verify:_ Diff between CLAUDE.md and AGENTS.md shows no new unintentional deep-loop policy drift.
- [ ] T5 Rewrite runtime README from five consumer skills to one workflow skill with modes. (`.opencode/skills/deep-loop-runtime/README.md`) — _verify:_ Runtime README no longer presents five public workflow skills as consumers and still states no MCP tools.
- [ ] T6 Update constitutional deep workflow rule to name the merged workflow skill and preserved commands. (`.opencode/skills/system-spec-kit/constitutional/deep-skill-workflow-required.md`) — _verify:_ Trigger/rule text includes deep-loop-workflows and preserved commands; old folder names are not presented as loadable skills.
- [ ] T7 Update sibling related-skill and protocol-link docs for system-spec-kit and cli-opencode. (`.opencode/skills/system-spec-kit/SKILL.md`, `.opencode/skills/system-spec-kit/README.md`, `.opencode/skills/system-spec-kit/references/workflows/quick_reference.md`) — _verify:_ rg for .opencode/skills/deep-{research,review,context,ai-council,improvement}/ over these files returns empty while artifact filename references remain intact.
- [ ] T8 Stamp the merged hub v1.0.0 and preserve mode changelog history. (`.opencode/skills/deep-loop-workflows/SKILL.md`, `.opencode/skills/deep-loop-workflows/graph-metadata.json`, `.opencode/skills/deep-loop-workflows/changelog/v1.0.0.md`) — _verify:_ Hub version is 1.0.0, only hub graph metadata exists, and per-mode changelog file hashes are unchanged from baseline snapshots.
- [ ] T9 Handle external packaging documentation surfaces only if present. (`SYNC.md`, `loop.py`) — _verify:_ rg --files -g SYNC.md -g loop.py evidence captured and git diff shows no contract-version bump.
- [ ] T10 Run final stale-reference, validation, and parity gates. (`README.md`, `.opencode/skills/README.md`, `CLAUDE.md`) — _verify:_ Phase-001 parity harness is byte-identical, stale path grep is clean with approved excludes, no Barter contract bump, and phase 008 validate.sh --strict exits 0.

### Phase 3: Verification
- [ ] Run the Parity Check (below).
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-phase-folder> --strict`.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Parity | This phase's affected modes/surfaces | Use the phase-001 baseline manifest and harness to rerun all five mode artifact checks and seven /deep:* command-output checks before and after phase-008 edits; hashes must match byte-for-byte. Also prove the diff is documentation-only by restricting changed files to the phase-008 doc list and excluding command YAML, agents, runtime scripts/lib, advisor code, Barter contracts, description.json, and nested mode graph-metadata.json. Finally run stale skill-path grep for .opencode/skills/deep-{research,review,context,ai-council,improvement}/ across the phase-008 target docs, excluding approved changelog history. |
| Structural | Spec docs | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| phase 007 | Internal phase | Gating | This phase cannot start until its predecessor is green |
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
| Setup | phase 007 | Core Implementation |
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
1. **CLAUDE.md and AGENTS.md drift during independent edits** -> Revert the paired policy-doc hunk and reapply the same source text to both files in one patch.
1. **Mechanical replacements alter artifact names such as deep-research-state.jsonl** -> Revert affected doc hunks and separate skill-path rewrites from artifact-name references.
1. **Runtime README implies MCP tools, slash commands, or improvement runtimeLoopType** -> Revert runtime README hunk and rewrite from the three-tier discriminator and frozen backend boundary.
1. **Per-mode changelog history is overwritten** -> Restore per-mode changelog files from the phase-001 or phase-003 snapshot and keep only a hub changelog pointer.
1. **SYNC.md or loop.py are fabricated despite being absent** -> Delete fabricated files and record verified absence from rg --files evidence instead.
1. **Stale-reference grep finds extra old skill paths outside the planned file set** -> Triage as phase-008 docs or historical/deferred content; patch docs only and do not broaden into command, agent, or code rewrites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: git restore the affected files; no data migration.

<!-- /ANCHOR:enhanced-rollback -->
