---
title: "Tasks: Deferred enhancements & external-tool borrows (TIER-3 / future) [template:level_2/tasks.md]"
description: "The TIER-3 items the research explicitly deferred plus the lower-priority borrow-list techniques: DTCG typed tokens + tokens.css, multi-viewport breakpoints, gradient decomposition, CIEDE2000 contrast, MCP token endpoint, composite/aliased tokens, semantic component tagging, hybrid clustering, and the semantic-data section gaps."
trigger_phrases:
  - "deferred enhancements"
  - "DTCG typed tokens"
  - "tokens.css output"
  - "gradient decomposition"
  - "MCP token endpoint"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/004-sk-design-md-generator/006-deferred-enhancements"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 006 (deferred bucket) from research TIER-3"
    next_safe_action: "Revisit after phases 002-005 ship; each item is independently optional"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deferred enhancements & external-tool borrows (TIER-3 / future)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

No completion claim without the `validate.ts`/`vitest` regression evidence named in the task.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture baseline (tool tests + anobel/gold-standard extraction snapshots) BEFORE any change

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 (Typed tokens + outputs) Document + (later) build parallel tokens.dtcg.json (DTCG $type/$value); KEEP tokens.json as source of truth
- [ ] T003 (Typed tokens + outputs) tokens.css (:root{}) emission for direct agent consumption
- [ ] T004 (Typed tokens + outputs) Composite/aliased tokens (typography/shadow/border/transition + role aliases)
- [ ] T005 (New extraction capabilities) Multi-viewport DOM re-extraction for §10 breakpoint Key Changes
- [ ] T006 (New extraction capabilities) Gradient structural decomposition (GradientToken stops/angle/type)
- [ ] T007 (New extraction capabilities) CIEDE2000 contrast + nearest-compliant-shade remediation
- [ ] T008 (Borrow-list niceties) MCP token endpoint + CLI fallback
- [ ] T009 (Borrow-list niceties) Semantic component tagging (ARIA/role/class) over geometry
- [ ] T010 (Borrow-list niceties) Hybrid occurrence+perceptual clustering; deltaE per-corpus calibration

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Document §0/§1/§7/§8 semantic-data gap as a future extraction-capability question
- [ ] T012 Keep this phase as a living backlog updated as 002-005 ship

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All P0 tasks `[x]` with regression evidence; anobel + gold-standard re-extraction deltas reviewed; `validate.sh --strict` + `package_skill.py --check` green; the two known hallucinations no longer have fabricated backing data.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` | Plan: `plan.md` | Checklist: `checklist.md`
- Research: `../research/research.md` §3 (TIER-3) + 4 (borrow list) + 7 (open questions)
- Parent: `../spec.md` (Phase Documentation Map)
<!-- /ANCHOR:cross-refs -->

---

