---
title: "Tasks: skill_graph_propagate_enhances MVP [template:level_2/tasks.md]"
description: "Granular T### tasks for SWE-1.6 implementation. 24 tasks across 5 phases. Phases 2-3 can run in any order after phase 1; phase 5 is the terminal gate."
trigger_phrases:
  - "026 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation"
    last_updated_at: "2026-05-15T15:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author tasks"
    next_safe_action: "Author checklist"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-cross-skill-init"
      parent_session_id: null
    completion_pct: 35
    open_questions: []
    answered_questions: []
---
# Tasks: skill_graph_propagate_enhances MVP

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Create directory `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/`
- [ ] T002 Author `lib/cross-skill-edges/types.ts` — all TypeScript interfaces (PropagationMode, InboundEnhanceCandidate, CandidateRuleEvidence, DetectInboundEnhancesOptions, PropagateEnhancesOptions, PropagateEnhancesResult) per plan §3
- [ ] T003 Author `lib/cross-skill-edges/metadata-loader.ts` — loadAllSkillMetadata, groupByFamily, per-file JSON error capture
- [ ] T004 Verify TypeScript compiles: `cd .opencode/skills/system-skill-advisor/mcp_server && npm run typecheck`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Author `lib/cross-skill-edges/detect-inbound-enhances.ts` — detectInboundEnhances function shell + family-inference scorer per plan §3 (max contribution 0.45, threshold ≥ 3 existing enhances + ≥ 50% same-family share)
- [ ] T006 [P] Add asset-shape scorer reading source.enhance_when (max contribution 0.30); support both skill_has_asset (single string) and skill_has_files (array) rule shapes
- [ ] T007 [P] Add sibling-transitivity scorer (max contribution 0.15, binary contribution on first positive signal)
- [ ] T008 Wire composite scorer + confidence cutoffs (high ≥ 0.80, medium ≥ 0.60, default minConfidence 0.75)
- [ ] T009 Add hasEnhanceEdge / hashCandidate / stableSort helpers in same file
- [ ] T010 Author `lib/cross-skill-edges/context-template.ts` — inferEdgePayload + clipWeight ([0.3, 0.7]) + substituteTemplate (${target.id}, ${target.family}, ${target.category}) + substituteProviderName (replaces peer-skill-id in exemplar context)
- [ ] T011 Author `lib/cross-skill-edges/apply-graph-metadata-patch.ts` — applyEnhanceEdge idempotent JSON patcher with auto_added_at + auto_added_reason fields
- [ ] T012 Author `lib/cross-skill-edges/index.ts` — propagateInboundEnhances orchestration (load → detect → optional apply with mode + dryRun + applyCandidateIds + applyAllHighConfidence)
- [ ] T013 Author `handlers/skill-graph/propagate-enhances.ts` — MCP handler boilerplate mirroring `handlers/skill-graph/scan.ts` shape (parse input via zod-like schema, call propagateInboundEnhances, format MCP response)
- [ ] T014 Modify `tools/skill-graph-tools.ts` — register skillGraphPropagateEnhancesTool spec with full inputSchema (skillsRoot, mode, minConfidence, targetSkillIds, sourceSkillIds, applyCandidateIds, applyAllHighConfidence, dryRun)
- [ ] T015 Modify `advisor-server.ts` — wire propagate-enhances handler into the tool router by tool name
- [ ] T016 Verify TypeScript compiles end-to-end: `npm run typecheck`
- [ ] T017 [P] Modify `.opencode/skills/sk-prompt/graph-metadata.json` — add top-level `enhance_when` field: `{ skill_has_asset: "assets/prompt_quality_card.md", weight: 0.4, context_template: "prompt quality card" }`
- [ ] T018 [P] Modify `.opencode/skills/system-skill-advisor/graph-metadata.json` — add top-level `enhance_when` field: `{ skill_has_files: ["SKILL.md", "graph-metadata.json"], weight: 0.7, context_template: "routes ${target.id} delegation requests" }`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Author `tests/cross-skill-edges.vitest.ts` — 3 fixture tests: Fixture A (cli-family arrival → 2 high-confidence candidates), Fixture B (non-family arrival → 0 candidates), Fixture C (idempotent re-run → 0 candidates after apply)
- [ ] T020 Run `npm test -- cross-skill-edges` — verify all 3 fixtures PASS
- [ ] T021 Run `npm test` (full suite) — verify no regression in existing tests
- [ ] T022 Manual smoke 1: invoke `skill_graph_propagate_enhances` against current HEAD repo state, expect `candidates: []` (no drift today — REQ-001)
- [ ] T023 Manual smoke 2 (synthetic-removal): temporarily remove cli-devin entry from sk-prompt's enhances[], run detector, expect 1 candidate at confidence ≥ 0.80, apply it, verify idempotent re-run returns 0 candidates, then `git restore .opencode/skills/sk-prompt/graph-metadata.json` to clean up
- [ ] T024 Fill `implementation-summary.md` with concrete file paths, LOC counts, verification table, deviations from plan
- [ ] T025 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation --strict` — expect 0 errors / 0 warnings
- [ ] T026 Run `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js <path> 007-cross-skill-enhancement-edge-propagation` to refresh continuity + graph-metadata
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 3 vitest fixtures PASS
- [ ] Full test suite has no regressions
- [ ] Manual smoke 1 (HEAD = 0 candidates) verified
- [ ] Manual smoke 2 (synthetic-removal round-trip) verified
- [ ] Strict spec validation passes
- [ ] generate-context.js run
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Summary**: See `implementation-summary.md`
- **Codex research**: `.opencode/specs/skilled-agent-orchestration/104-cli-devin-creation/evidence/cross-skill-auto-propagation-research-codex-2026-05-15.md`
<!-- /ANCHOR:cross-refs -->
