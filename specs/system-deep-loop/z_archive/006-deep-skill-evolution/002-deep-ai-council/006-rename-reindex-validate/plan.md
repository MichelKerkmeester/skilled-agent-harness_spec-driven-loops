---
title: "Implementation Plan: 115/006"
description: "Compiler rerun + advisor smoke + vitest + strict validate + parent reconcile"
trigger_phrases: ["115 006 plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/002-deep-ai-council/006-rename-reindex-validate"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 006 plan.md"
    next_safe_action: "Author 006 tasks.md"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115006"
      session_id: "115-006-plan-init"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: 115/006

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
| Aspect | Value |
|--------|-------|
| Language/Stack | python (compiler) + node (generate-context) + vitest |
| Framework | system-skill-advisor + spec-kit |
| Testing | aggregate matrix |

### Overview
Final reindex + validation phase. Sequential after 002-005.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### DoR: 002+003+004+005 all landed
### DoD: aggregate strict validate all PASS; advisor smoke ≥ 0.7
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Compile→smoke→validate→reconcile chain.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Setup — confirm 002-005 landed
### Phase 2: Implementation — compiler + advisor smoke + vitest + parent save
### Phase 3: Verification — aggregate strict validate exit-code matrix
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
| Test | Tool |
|------|------|
| Compiler | python3 skill_graph_compiler.py |
| Advisor smoke | advisor_recommend MCP |
| Parity vitest | npx vitest run |
| Strict validate | validate.sh --strict (×7) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- 002+003+004+005 (gating)
- skill_graph_compiler.py
- advisor MCP
- vitest
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
git reset --hard if aggregate validate fails
<!-- /ANCHOR:rollback -->
