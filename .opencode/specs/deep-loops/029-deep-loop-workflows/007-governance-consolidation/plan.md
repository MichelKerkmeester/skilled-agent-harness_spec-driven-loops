---
title: "Implementation Plan: Governance consolidation"
description: "Implementation Plan for phase 007 of the deep-loop-workflows merge: Governance consolidation."
trigger_phrases:
  - "deep-loop-workflows phase 007"
  - "governance-consolidation"
  - "deep loop merge implementation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/029-deep-loop-workflows/007-governance-consolidation"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled implementation plan from parallel planning fleet"
    next_safe_action: "Execute phase 007 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-007-governance-consolidation-implementationplan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Governance consolidation

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
Consolidate governance only: move the five mode feature_catalog and manual_testing_playbook trees into hub-level deep-loop-workflows roots partitioned by mode, then author merged root indexes. Mode-local IDs and files are preserved; CP collisions are qualified only in the merged indexes. The worker fleet parallelizes by mode for read/inventory and mode-local markdown rewrites, while shared indexes, helper dedupe, and parity adjudication stay lead-owned. No runtime, command, advisor, agent, MCP, or deep-loop-runtime behavior changes are in scope.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Predecessor (phase 006) green.
- [ ] Phase-001 parity baseline available.
- [ ] Scope limited to this phase per `spec.md`.

### Definition of Done
- [ ] Hub-level feature_catalog exists with five mode partitions and one merged root index.
- [ ] Hub-level manual_testing_playbook exists with five mode partitions and one merged root index.
- [ ] Council catalog casing is normalized to ai-council/feature_catalog.md.
- [ ] No nested mode graph-metadata.json exists under deep-loop-workflows mode packets.
- [ ] Merged root indexes mode-qualify CP collisions without renumbering per-mode files.
- [ ] Declared scenario totals reconcile to 198 total across the five modes.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gated phase in the deep-loop-workflows merge pipeline. Additive/reversible (old skill dirs survive until phase 009).

### Parallel Groups (worker fleet)
- **G0** (opus seats): Preflight phase handoff and graph-metadata invariant; halt on wrong prior-phase state.
- **G1** (gpt seats): Read-only per-mode governance inventory and drift mapping.
- **G2** (gpt seats): Per-mode disjoint governance moves and path rewrites.
- **G3** (opus seats): Shared merged root indexes and CP collision policy.
- **G4** (mixed seats): Shared helper dedupe and known drift reconciliation.
- **G5** (mixed seats): Integrity, spec validation, and byte-parity adjudication.

### Read/Write Split
Read-only analysis + parity capture run on `gpt-5.5-fast --variant high` (cli-opencode); file writes/edits run on `opus-4.8` via `claude2`; the orchestrator reduces and validates.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read predecessor continuity (phase 006) and `../research/research.md`.
- [ ] Load the phase-001 parity baseline for the affected modes/surfaces.

### Phase 2: Core Implementation
- [ ] T1 Confirm deep-loop-workflows hub, mode-registry, hub graph metadata, and absence of nested mode graph-metadata files. (`.opencode/skills/deep-loop-workflows/mode-registry.json`, `.opencode/skills/deep-loop-workflows/graph-metadata.json`, `.opencode/skills/deep-loop-workflows/{context,research,review,improvement,ai-council}/`) — _verify:_ Only .opencode/skills/deep-loop-workflows/graph-metadata.json matches /graph-metadata.json under the hub.
- [ ] T2 Inventory declared totals, file counts, CP IDs, stale paths, helpers, and drift per mode. (`.opencode/skills/deep-loop-workflows/{context,research,review,improvement,ai-council}/feature_catalog/**`, `.opencode/skills/deep-loop-workflows/{context,research,review,improvement,ai-council}/manual_testing_playbook/**`) — _verify:_ Declared totals reconcile to council 32, context 25, improvement 48, research 44, review 49 or drift is explicitly listed.
- [ ] T3 Move five feature_catalog trees into one hub feature_catalog root partitioned by mode and normalize council root casing. (`.opencode/skills/deep-loop-workflows/feature_catalog/{context,research,review,improvement,ai-council}/**`) — _verify:_ Each mode has one feature_catalog.md and no FEATURE_CATALOG.md remains.
- [ ] T4 Move five manual_testing_playbook trees into one hub playbook root partitioned by mode. (`.opencode/skills/deep-loop-workflows/manual_testing_playbook/{context,research,review,improvement,ai-council}/**`) — _verify:_ Each mode has manual_testing_playbook.md and per-mode markdown counts match inventory.
- [ ] T5 Rewrite stale old-skill paths and relative links in moved governance markdown while preserving deep-loop-runtime anchors. (`.opencode/skills/deep-loop-workflows/feature_catalog/{context,research,review,improvement,ai-council}/**/*.md`, `.opencode/skills/deep-loop-workflows/manual_testing_playbook/{context,research,review,improvement,ai-council}/**/*.md`) — _verify:_ No old .opencode/skills/deep-{research,review,context,improvement,ai-council} refs under new governance roots; runtime refs still present where expected.
- [ ] T6 Create merged root governance indexes with mode partitions and mode-qualified CP IDs. (`.opencode/skills/deep-loop-workflows/feature_catalog/feature_catalog.md`, `.opencode/skills/deep-loop-workflows/manual_testing_playbook/manual_testing_playbook.md`) — _verify:_ All five mode partitions resolve; duplicate root CP keys become unique mode:id keys; per-mode files retain local IDs.
- [ ] T7 Dedupe the three CP sandbox setup helpers into one shared helper and update stress-test docs. (`.opencode/skills/deep-loop-workflows/manual_testing_playbook/shared/setup-cp-sandbox.sh`, `.opencode/skills/deep-loop-workflows/manual_testing_playbook/research/07--command-flow-stress-tests/*.md`, `.opencode/skills/deep-loop-workflows/manual_testing_playbook/review/07--command-flow-stress-tests/*.md`) — _verify:_ Shared helper mode runs create equivalent research, review, and improvement sandbox surfaces under /tmp.
- [ ] T8 Reconcile known drift: false council catalog prose, duplicate headings, and stale count self-checks. (`.opencode/skills/deep-loop-workflows/manual_testing_playbook/ai-council/08--council-graph-integration/*.md`, `.opencode/skills/deep-loop-workflows/manual_testing_playbook/{context,research,review,improvement,ai-council}/manual_testing_playbook.md`, `.opencode/skills/deep-loop-workflows/feature_catalog/{context,research,review,improvement,ai-council}/feature_catalog.md`) — _verify:_ No false 'No feature catalog exists yet' prose; count self-checks are merged total or mode subtotal; duplicate headings removed.
- [ ] T9 Run governance integrity verifier for links, ID mapping, and orphaned CP IDs. (`.opencode/skills/deep-loop-workflows/feature_catalog/**`, `.opencode/skills/deep-loop-workflows/manual_testing_playbook/**`) — _verify:_ Zero missing links, zero orphaned CP IDs, zero duplicate mode:id keys, zero file renumbers.
- [ ] T10 Validate the phase spec folder after implementation evidence is recorded. (`.opencode/specs/deep-loops/029-deep-loop-workflows/007-governance-consolidation/`) — _verify:_ validate.sh --strict exits 0 for the phase folder.
- [ ] T11 Re-run phase-001 artifact parity and compare post-phase outputs byte-for-byte. (`.opencode/specs/deep-loops/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/`, `post-phase generated parity outputs`) — _verify:_ All five mode and eight command artifacts are byte-identical to phase-001; governance-only diffs are confined to deep-loop-workflows governance roots.

### Phase 3: Verification
- [ ] Run the Parity Check (below).
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-phase-folder> --strict`.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Parity | This phase's affected modes/surfaces | Re-run the phase-001 five-mode/eight-command artifact generation suite after phase 007 and compare every generated artifact with the phase-001 baseline using shasum -a 256 plus cmp -s. Governance docs intentionally move, so preservation is proven by inventory equivalence: declared totals remain 32/25/48/44/49, every pre-phase scenario maps to one post-phase mode:id, no per-file CP IDs are renumbered, and root indexes are the only collision-qualification layer. |
| Structural | Spec docs | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| phase 006 | Internal phase | Gating | This phase cannot start until its predecessor is green |
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
| Setup | phase 006 | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Next pipeline phase |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | read baseline + predecessor |
| Core Implementation | High | 11 tasks across 6 parallel group(s) |
| Verification | Medium | parity + strict validation |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase-001 baseline captured for affected surfaces.
- [ ] Old skill directories intact (deletion only in phase 009).

### Rollback Procedure
1. **CP files are renumbered instead of mode-qualified at the merged index.** -> Revert the affected mode partition and root indexes; restore per-mode files from phase-006 or old skill dirs.
1. **Path rewrites alter deep-loop-runtime source anchors.** -> Revert affected docs and reapply old-skill rewrite with a deep-loop-runtime exclusion.
1. **Shared setup-cp-sandbox helper changes mode-specific sandbox behavior.** -> Revert shared helper and stress-test doc rewrites; restore old mode helpers from pre-phase tree.
1. **Council lowercase root breaks links that still target FEATURE_CATALOG.md.** -> Revert council root index/link changes, fix references, then reapply lowercase rename after link verifier passes.
1. **Pre-existing drift causes raw count mismatch.** -> Use declared root totals and backed scenario rows as authority; quarantine drift in the affected mode partition without changing IDs.
1. **Nested mode graph-metadata.json is copied under the merged hub.** -> Remove the nested copy and rerun the graph-metadata verifier; if inherited from prior phase, halt and fix phase 003/006.
1. **Byte parity fails after governance-only changes.** -> Revert the phase-007 stratum only; old skill dirs and phase-006 mode packets remain available until phase 009.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: git restore the affected files; no data migration.

<!-- /ANCHOR:enhanced-rollback -->
