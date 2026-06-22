---
title: "Tasks: Doc-as-view architecture (deterministic render, AI out of the value tables) [template:level_2/tasks.md]"
description: "The structural endgame: generate the value-bearing sections deterministically from tokens (no AI), reduce AI prose to short token-cited annotations, and enforce citation gating. Removes the AI from the value-table surface where it can fabricate."
trigger_phrases:
  - "doc as view architecture"
  - "deterministic formatters"
  - "prompt builder"
  - "citation gating"
  - "three-class section partition"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-sk-design-md-generator/005-doc-as-view-architecture"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 005 from research Phase 4"
    next_safe_action: "Build formatters.ts Phase A (§2 Color + §3 Typography) first"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Doc-as-view architecture (deterministic render, AI out of the value tables)

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

- [ ] T002 (Phase A formatters) Build formatters.ts: formatColorTable + formatTypographyTable from tokens.json
- [ ] T003 (Phase A formatters) Prove byte-parity vs current AI tables on anobel + 4 gold-standard (behind a flag)
- [ ] T004 (Phase A formatters) Tests: deterministic output, matches tokens.json exactly
- [ ] T005 (Prompt-builder + gate) Build build-write-prompt.ts (pre-render tables, PRESENT/ABSENT markers, stability pre-filter)
- [ ] T006 (Prompt-builder + gate) Implement checkCitationGating in validate.ts (resolve [token:<path>] on (b)/(c) lines)
- [ ] T007 (Prompt-builder + gate) Document the three-class section partition in the format spec + SKILL.md
- [ ] T008 (Expand) Implement the remaining class-(a) formatters (spacing/radii/shadow/contrast/breakpoints/icons/token-dictionary)
- [ ] T009 (Expand) Parity-prove each before enabling

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 vitest for formatters determinism + citation gate
- [ ] T011 anobel + gold-standard parity diffs
- [ ] T012 validate.sh --strict; package_skill.py --check

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
- Research: `../research/research.md` §5 (Architecture) + §6 Phase 4
- Parent: `../spec.md` (Phase Documentation Map)
<!-- /ANCHOR:cross-refs -->

---

