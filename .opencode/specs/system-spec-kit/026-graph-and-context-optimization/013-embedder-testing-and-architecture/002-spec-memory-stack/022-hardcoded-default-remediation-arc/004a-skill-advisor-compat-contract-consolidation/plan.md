---
title: "Plan: 022/004a Skill-Advisor Compat-Contract Consolidation (Wave 1)"
description: "10 Edits across 5 files; main-agent direct."
trigger_phrases: ["022/004a plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/004a-skill-advisor-compat-contract-consolidation"
    last_updated_at: "2026-05-23T17:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan authored post-execution"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022f2"
      session_id: "016-002-022-004a-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Main-agent direct chosen"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: 022/004a Skill-Advisor Compat-Contract Consolidation (Wave 1)

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

SKILL_ADVISOR_COMPAT_CONTRACT.defaults declares 0.8/0.35; 5 production files duplicate the literals. Wave 1 wires consumers to import from contract.

### Overview

10 mechanical Edit operations. Compile-checked. ~15 min wall-clock.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Contract source confirmed (compat/contract.ts:5-12) — DONE
- 5 consumer file paths verified — DONE
- Baseline typecheck exit 0 — DONE

### Definition of Done
- R1–R5 from spec.md §4 satisfied
- Strict-validate exit 0
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Replace inline literal `?? 0.8` / `?? 0.35` with `?? SKILL_ADVISOR_COMPAT_CONTRACT.defaults.confidenceThreshold` / `?? SKILL_ADVISOR_COMPAT_CONTRACT.defaults.uncertaintyThreshold`. For module-level `const DEFAULT_* = 0.8/0.35`, change initializer to derive from contract.

### Key Components

- `compat/contract.ts` (canonical source — unchanged)
- 5 consumer files (mechanical edits)
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pre-Edit

- Verify contract.ts shape
- Verify 5 consumer file paths + lines
- Baseline typecheck exit 0

### Phase 2: Edits

1. fusion.ts: add import (after isLiveScorerLane import) + replace lines 41-42 initializers
2. skill-advisor-brief.ts: add import (after cache-invalidation import) + replace lines 110-111 initializers
3. prompt-cache.ts: add import (after metrics import) + replace lines 48-49
4. subprocess.ts: add import (after prompt-cache type import) + replace lines 81-82
5. render.ts: add import (after unicode-normalization import) + replace lines 127,130

### Phase 3: Verification

- skill-advisor mcp_server typecheck → exit 0
- system-spec-kit typecheck:root → exit 0
- Ban-list grep → 0 hits
- Import count → 6 files (5 consumers + 1 declaration)
- Strict-validate exit 0
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Existing vitest suite in `mcp_server/tests/` covers fusion, prompt-cache, render, subprocess threshold behavior. Tests assert behavior on default thresholds — since contract values equal previous inline literals, no test changes needed. (004b will add explicit invariant tests.)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 003 shipped (latest)
- Council `executor-instructions.md` §Phase 004 (provided wave-split fallback guidance)
- `compat/contract.ts` declaration (unchanged since 2026-05 introduction)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git restore` on the 5 changed files. Reverts to inline-literal pattern. No behavior change.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

Wave 1 (this phase) closes 14 P0; can ship independently of waves 2-4. Waves 2-4 in 004b depend on this consolidation as a baseline.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Phase | Estimate | Actual |
|---|---|---|
| Pre-edit | 10 min | ~10 min (file/path verification) |
| Edits | 10 min | ~5 min |
| Verify + doc | 20 min | ~10 min |
| Total | 40 min | ~25 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

If `compat/contract.ts` is later refactored to a different shape, consumers will fail typecheck. Rollback to inline literals if contract refactor needs to happen without consumer updates. Low probability — contract was added precisely to BE this kind of source of truth.
<!-- /ANCHOR:enhanced-rollback -->
