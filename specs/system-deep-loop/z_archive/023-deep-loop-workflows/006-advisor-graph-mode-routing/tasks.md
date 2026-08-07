---
title: "Tasks: Advisor graph mode-routing collapse"
description: "Tasks for phase 006 of the deep-loop-workflows merge: Advisor graph mode-routing collapse."
trigger_phrases:
  - "deep-loop-workflows phase 006"
  - "advisor-graph-mode-routing"
  - "deep loop merge tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/023-deep-loop-workflows/006-advisor-graph-mode-routing"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled tasks from parallel planning fleet"
    next_safe_action: "Execute phase 006 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-006-advisor-graph-mode-routing-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Advisor graph mode-routing collapse

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read predecessor continuity and `../research/research.md` for this phase's scope
- [ ] T002 Load the phase-001 parity baseline for the affected modes/surfaces

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T001 Correct deep-ai-council family sk-util->deep-loop (`.opencode/skills/deep-ai-council/graph-metadata.json`)
- [ ] T002 Correct deep-improvement family sk-util->deep-loop (`.opencode/skills/deep-improvement/graph-metadata.json`)
- [ ] T003 Scan gate after family fix; commit stratum-1 (`(skill-graph db via skill_graph_scan/advisor_validate)`)
- [ ] T004 Freeze aliases schema (B6), {skill,mode} contract (B2), deep-context metadata-routed (B3); record in decision-record (`.opencode/specs/system-deep-loop/023-deep-loop-workflows/006-advisor-graph-mode-routing/plan.md`, `.opencode/specs/system-deep-loop/023-deep-loop-workflows/006-advisor-graph-mode-routing/decision-record.md`)
- [ ] T005 Restructure aliases.ts to nested skill->modes; canonical=deep-loop-workflows; derive ALIAS_TO_CANONICAL+ALIAS_TO_MODE; add modeForAlias; preserve SKILL_ALIAS_GROUPS + canonicalSkillId/skillMatchesAlias (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`)
- [ ] T006 Repoint PHRASE_BOOSTS + inline INTENT deep-* entries to deep-loop-workflows+mode, preserve weights/penalties (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`)
- [ ] T007 Repoint CATEGORY_HINTS keys + CATEGORY_HINTS[skill.id] consumer to merged node/mode (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts`)
- [ ] T008 Collapse Python SKILL_ALIAS_GROUPS/SKILL_ALIAS_TO_CANONICAL to deep-loop-workflows + mode aliases (mirror TS) (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`)
- [ ] T009 Candidate-3 payload returns skill=deep-loop-workflows + mode; update _apply_deep_skill_routing_layer match + projection owning_skill; DEEP_ROUTING_SKILLS stays 3 (no deep-context) (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`)
- [ ] T010 Repoint intent/phrase maps hardcoding deep-* targets to deep-loop-workflows+mode, preserve relative weights (`.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`)
- [ ] T011 Author hub graph-metadata.json: family deep-loop, deduped union outbound edges (system-spec-kit dep 0.7, sk-code-review dep 0.8, deep-loop-runtime sib 0.6, sk-prompt sib 0.4), drop internal self-loops, union keywords/trigger_phrases/key_files (`.opencode/skills/deep-loop-workflows/graph-metadata.json`)
- [ ] T012 Keystone: ensure no per-mode graph-metadata.json under hub packets (delete any phase-003 copies) (`.opencode/skills/deep-loop-workflows/{context,research,review,ai-council,improvement}/graph-metadata.json`)
- [ ] T013 Repoint 5 external inbound sources to deep-loop-workflows (dedup, preserve type/weight/context) (`.opencode/skills/system-skill-advisor/graph-metadata.json`, `.opencode/skills/system-spec-kit/graph-metadata.json`)
- [ ] T014 Delete 5 old node files (dirs otherwise intact; phase-009 deletes shells) (`.opencode/skills/deep-ai-council/graph-metadata.json`, `.opencode/skills/deep-context/graph-metadata.json`)
- [ ] T015 Update both routing-parity fixtures: RoutingResult.mode; assert skill=deep-loop-workflows AND concrete mode for every INV/COUNCIL-INV (flat equality insufficient), >=3 phrasings/mode (`.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts`, `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-council.vitest.ts`)
- [ ] T016 Serial integration verify: scan, grep UNKNOWN-TARGET, advisor_validate, vitest both files + native SKILL_ALIAS_GROUPS, python routing smoke, baseline mode diff, validate.sh --strict (`(whole advisor surface + phase folder)`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Run the parity check: Behavior-preserving routing, not loop-artifact bytes. (1) For each phase-001 baseline prompt, post-collapse advisor routes to the SAME mode now as {skill:deep-loop-workflows, mode:X}; old winner string canonicalizes via canonicalSkillId+modeForAlias to (deep-loop-workflows, X). (2) Both routing-parity vitest files assert BOTH merged skill AND concrete mode for >=3 phrasings/mode (flat alias equality explicitly insufficient). (3) Graph invariants post-scan: rejectedEdges=0, UNKNOWN-TARGET grep empty, 5 old nodes in deletedNodes, deep-loop-workflows present, family=deep-loop, advisor_validate clean. (4) deep-loop-runtime loop code unchanged (MCP-free) so per-mode loop artifacts parity-preserved by construction.
- [ ] T020 `validate.sh --strict` on this phase folder
- [ ] T021 Confirm the phase success criteria in `spec.md` are met

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Parity check passed against the phase-001 baseline.
- [ ] `validate.sh --strict` green.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Evidence**: `../research/research.md`, `../context/context-report.md`

<!-- /ANCHOR:cross-refs -->
