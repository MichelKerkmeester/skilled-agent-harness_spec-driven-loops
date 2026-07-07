---
title: "Tasks: 022/004a Skill-Advisor Compat-Contract Consolidation (Wave 1)"
description: "13 tasks; all complete."
trigger_phrases: ["022/004a tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/007-skill-advisor-embedder-stack/007-skill-advisor-compat-contract-consolidation"
    last_updated_at: "2026-05-23T17:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "All tasks complete"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022f3"
      session_id: "016-002-022-004a-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Tasks shipped"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 022/004a Skill-Advisor Compat-Contract Consolidation (Wave 1)

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

`[x]` complete | `[ ]` pending | `[T###]` task id | `[P#]` priority
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] [T001] [P0] Read `compat/contract.ts:5-12` to confirm SKILL_ADVISOR_COMPAT_CONTRACT.defaults shape.
- [x] [T002] [P0] Verify 5 consumer file paths + line numbers (fusion.ts:41-42, skill-advisor-brief.ts:110-111, prompt-cache.ts:48-49, subprocess.ts:81-82, render.ts:127,130).
- [x] [T003] [P0] Baseline typecheck:root exit 0.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] [T004] [P0] fusion.ts: add `import { SKILL_ADVISOR_COMPAT_CONTRACT } from '../compat/contract.js';` after isLiveScorerLane import.
- [x] [T005] [P0] fusion.ts:41-42: change initializers to `SKILL_ADVISOR_COMPAT_CONTRACT.defaults.confidenceThreshold` / `.uncertaintyThreshold`.
- [x] [T006] [P0] skill-advisor-brief.ts: add `import { SKILL_ADVISOR_COMPAT_CONTRACT } from './compat/contract.js';` after cache-invalidation import.
- [x] [T007] [P0] skill-advisor-brief.ts:110-111: change exported constants to derive from contract.
- [x] [T008] [P0] prompt-cache.ts: add import after metrics import.
- [x] [T009] [P0] prompt-cache.ts:48-49: replace inline `?? 0.8` / `?? 0.35` with contract references.
- [x] [T010] [P0] subprocess.ts: add import after AdvisorThresholds type import.
- [x] [T011] [P0] subprocess.ts:81-82: replace inline literals with contract references.
- [x] [T012] [P0] render.ts: add import after canonicalFold import.
- [x] [T013] [P0] render.ts:127,130: replace inline literals with contract references.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] [T014] [P0] skill-advisor mcp_server `npx tsc --noEmit -p tsconfig.json` exit 0 — VERIFIED.
- [x] [T015] [P0] system-spec-kit `npm run typecheck:root` exit 0 — VERIFIED.
- [x] [T016] [P0] Ban-list `rg "?? 0\.8|?? 0\.35"` in 5 consumer paths → 0 hits — VERIFIED.
- [x] [T017] [P0] Contract import count → 6 files (5 consumers + contract.ts) — VERIFIED.
- [x] [T018] [P0] Strict-validate phase 004a exit 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

All P0 tasks complete. 14 P0 audit findings closed.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- spec.md §4 R1–R5 map to T014–T018
- plan.md §4 phases match
- implementation-summary.md captures shipped state
- Council `executor-instructions.md` §Phase 004 Wave 1 + Wave-Split-Fallback contract honored
<!-- /ANCHOR:cross-refs -->
