---
title: "Implementation Plan: Advisor graph mode-routing collapse"
description: "Implementation Plan for phase 006 of the deep-loop-workflows merge: Advisor graph mode-routing collapse."
trigger_phrases:
  - "deep-loop-workflows phase 006"
  - "advisor-graph-mode-routing"
  - "deep loop merge implementation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-deep-loop-workflows/006-advisor-graph-mode-routing"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled implementation plan from parallel planning fleet"
    next_safe_action: "Execute phase 006 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-006-advisor-graph-mode-routing-implementationplan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Advisor graph mode-routing collapse

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
Mutate only the advisor-graph + scorer surface (no loop runtime change), so parity = behavior-preserving routing where every phase-001 prompt routes to the same mode now under skill=deep-loop-workflows. Fail-closed sequencing: serial gates (family fix G1, contract freeze G2, integration verify G6) bracket one parallel authoring wave over four disjoint file sets (TS scorer, Python advisor, graph metadata, vitest fixtures). The graph-collapse lands as one atomic commit + one scan because retargeting external edges and deleting old nodes are mutually dependent.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Predecessor (phase 005) green.
- [ ] Phase-001 parity baseline available.
- [ ] Scope limited to this phase per `spec.md`.

### Definition of Done
- [ ] family=deep-loop for deep-ai-council+deep-improvement (G1) and merged node
- [ ] both routing-parity fixtures assert deep-loop-workflows AND concrete mode; vitest green
- [ ] skill_graph_scan rejectedEdges=0; UNKNOWN-TARGET grep empty
- [ ] 5 old graph-metadata.json deleted; 5 old nodes in deletedNodes; old dirs intact
- [ ] only hub graph-metadata.json under deep-loop-workflows (no per-mode); scanner does not throw
- [ ] 5 external inbound edges repointed + deduped; advisor_validate symmetry clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gated phase in the deep-loop-workflows merge pipeline. Additive/reversible (old skill dirs survive until phase 009).

### Parallel Groups (worker fleet)
- **G1** (opus seats): Family correction sk-util->deep-loop on deep-ai-council + deep-improvement old nodes, then scan gate; BLOCKS all later groups
- **G2** (opus seats): Freeze cross-surface contract: nested aliases schema (B6), RoutingResult.mode + skill=deep-loop-workflows (B2), deep-context stays metadata-routed (B3)
- **G3** (mixed seats): TS scorer repoint: aliases.ts nested schema + ALIAS_TO_MODE, explicit.ts PHRASE_BOOSTS, lexical.ts CATEGORY_HINTS
- **G4** (mixed seats): Python advisor repoint: SKILL_ALIAS_GROUPS, Candidate-3 {skill,mode} payload, intent/phrase maps
- **G5** (opus seats): Graph metadata collapse (one atomic commit+scan): author hub node with deduped union edges, drop per-mode metadata (keystone), repoint 5 external inbound sources, delete 5 old node files
- **G6** (opus seats): Author both routing-parity fixtures (parallel) then serial integration verify (scan, advisor_validate, vitest, python smoke, baseline diff, validate.sh)

### Read/Write Split
Read-only analysis + parity capture run on `gpt-5.5-fast --variant high` (cli-opencode); file writes/edits run on `opus-4.8` via `claude2`; the orchestrator reduces and validates.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read predecessor continuity (phase 005) and `../research/research.md`.
- [ ] Load the phase-001 parity baseline for the affected modes/surfaces.

### Phase 2: Core Implementation
- [ ] T1 Correct deep-ai-council family sk-util->deep-loop (`.opencode/skills/deep-ai-council/graph-metadata.json`) — _verify:_ JSON parses; family==deep-loop
- [ ] T2 Correct deep-improvement family sk-util->deep-loop (`.opencode/skills/deep-improvement/graph-metadata.json`) — _verify:_ JSON parses; family==deep-loop
- [ ] T3 Scan gate after family fix; commit stratum-1 (`(skill-graph db via skill_graph_scan/advisor_validate)`) — _verify:_ rejectedEdges==0; nodesByFamily sk-util -2; no new warnings
- [ ] T4 Freeze aliases schema (B6), {skill,mode} contract (B2), deep-context metadata-routed (B3); record in decision-record (`.opencode/specs/skilled-agent-orchestration/152-deep-loop-workflows/006-advisor-graph-mode-routing/plan.md`, `.opencode/specs/skilled-agent-orchestration/152-deep-loop-workflows/006-advisor-graph-mode-routing/decision-record.md`) — _verify:_ decision-record present; validate.sh --strict green
- [ ] T5 Restructure aliases.ts to nested skill->modes; canonical=deep-loop-workflows; derive ALIAS_TO_CANONICAL+ALIAS_TO_MODE; add modeForAlias; preserve SKILL_ALIAS_GROUPS + canonicalSkillId/skillMatchesAlias (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`) — _verify:_ tsc compiles; native-scorer SKILL_ALIAS_GROUPS assertion passes
- [ ] T6 Repoint PHRASE_BOOSTS + inline INTENT deep-* entries to deep-loop-workflows+mode, preserve weights/penalties (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`) — _verify:_ tsc; lane unit tests green
- [ ] T7 Repoint CATEGORY_HINTS keys + CATEGORY_HINTS[skill.id] consumer to merged node/mode (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts`) — _verify:_ tsc; lane unit tests green
- [ ] T8 Collapse Python SKILL_ALIAS_GROUPS/SKILL_ALIAS_TO_CANONICAL to deep-loop-workflows + mode aliases (mirror TS) (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`) — _verify:_ python import smoke ok
- [ ] T9 Candidate-3 payload returns skill=deep-loop-workflows + mode; update _apply_deep_skill_routing_layer match + projection owning_skill; DEEP_ROUTING_SKILLS stays 3 (no deep-context) (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`) — _verify:_ --deep-skill-routing-json emits {skill:deep-loop-workflows,mode}
- [ ] T10 Repoint intent/phrase maps hardcoding deep-* targets to deep-loop-workflows+mode, preserve relative weights (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`) — _verify:_ routing smoke; weights unchanged relative
- [ ] T11 Author hub graph-metadata.json: family deep-loop, deduped union outbound edges (system-spec-kit dep 0.7, sk-code-review dep 0.8, deep-loop-runtime sib 0.6, sk-prompt sib 0.4), drop internal self-loops, union keywords/trigger_phrases/key_files (`.opencode/skills/deep-loop-workflows/graph-metadata.json`) — _verify:_ covered by T16 scan
- [ ] T12 Keystone: ensure no per-mode graph-metadata.json under hub packets (delete any phase-003 copies) (`.opencode/skills/deep-loop-workflows/{context,research,review,ai-council,improvement}/graph-metadata.json`) — _verify:_ find hub -name graph-metadata.json == 1 (root)
- [ ] T13 Repoint 5 external inbound sources to deep-loop-workflows (dedup, preserve type/weight/context) (`.opencode/skills/system-skill-advisor/graph-metadata.json`, `.opencode/skills/system-spec-kit/graph-metadata.json`, `.opencode/skills/sk-prompt/graph-metadata.json`) — _verify:_ T16 scan rejectedEdges==0; advisor_validate symmetry clean
- [ ] T14 Delete 5 old node files (dirs otherwise intact; phase-009 deletes shells) (`.opencode/skills/deep-ai-council/graph-metadata.json`, `.opencode/skills/deep-context/graph-metadata.json`, `.opencode/skills/deep-improvement/graph-metadata.json`) — _verify:_ T16 deletedNodes superset of 5 old ids
- [ ] T15 Update both routing-parity fixtures: RoutingResult.mode; assert skill=deep-loop-workflows AND concrete mode for every INV/COUNCIL-INV (flat equality insufficient), >=3 phrasings/mode (`.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts`, `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-council.vitest.ts`) — _verify:_ compiles; assertions encode skill+mode
- [ ] T16 Serial integration verify: scan, grep UNKNOWN-TARGET, advisor_validate, vitest both files + native SKILL_ALIAS_GROUPS, python routing smoke, baseline mode diff, validate.sh --strict (`(whole advisor surface + phase folder)`) — _verify:_ rejectedEdges==0; UNKNOWN-TARGET empty; deletedNodes>=5; deep-loop-workflows present; vitest green; baseline mode-equivalent; validate.sh exit 0

### Phase 3: Verification
- [ ] Run the Parity Check (below).
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-phase-folder> --strict`.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Parity | This phase's affected modes/surfaces | Behavior-preserving routing, not loop-artifact bytes. (1) For each phase-001 baseline prompt, post-collapse advisor routes to the SAME mode now as {skill:deep-loop-workflows, mode:X}; old winner string canonicalizes via canonicalSkillId+modeForAlias to (deep-loop-workflows, X). (2) Both routing-parity vitest files assert BOTH merged skill AND concrete mode for >=3 phrasings/mode (flat alias equality explicitly insufficient). (3) Graph invariants post-scan: rejectedEdges=0, UNKNOWN-TARGET grep empty, 5 old nodes in deletedNodes, deep-loop-workflows present, family=deep-loop, advisor_validate clean. (4) deep-loop-runtime loop code unchanged (MCP-free) so per-mode loop artifacts parity-preserved by construction. |
| Structural | Spec docs | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| phase 005 | Internal phase | Gating | This phase cannot start until its predecessor is green |
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
| Setup | phase 005 | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Next pipeline phase |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | read baseline + predecessor |
| Core Implementation | High | 16 tasks across 6 parallel group(s) |
| Verification | Medium | parity + strict validation |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase-001 baseline captured for affected surfaces.
- [ ] Old skill directories intact (deletion only in phase 009).

### Rollback Procedure
1. **R-A: old IDs removed before family fix / before {skill,mode} contract lands -> routing fails closed mid-migration** -> Revert G5 commit only; G1 family fix + old nodes persist; old dirs survive to phase 009
1. **R-B: stray per-mode graph-metadata.json left under hub -> scanner throws skill_id!=folder** -> T12 delete stray files; re-scan
1. **R-C: an external inbound edge missed during retarget -> UNKNOWN-TARGET, rejectedEdges>0** -> Revert G5; baseline grep flags; fix retarget; re-scan
1. **R-D: trigger-phrase union degrades prompt->mode precision** -> Revert G3/G4 scorer commit; keep per-mode winners distinct; re-tune
1. **R-E: aliases.ts restructure breaks canonicalSkillId consumers** -> Revert T5; keep derived flat maps
1. **R-F: deep-context accidentally added to Candidate-3 -> routing behavior change** -> Keep B3 metadata-routed; revert offending Python edit

### Data Reversal
- **Has data migrations?** Yes -- advisor SQLite graph (rebuildable via skill_graph_scan from graph-metadata.json)
- **Reversal procedure**: re-run skill_graph_scan to rebuild the graph from metadata.

<!-- /ANCHOR:enhanced-rollback -->
