---
title: "Implementation Plan: 115/004 — cross-skill edges + TypeScript"
description: "Edit 4 graph-metadata + 2 TS files. Mechanical."
trigger_phrases: ["115 004 plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/002-deep-ai-council/004-rename-sibling-edges-typescript"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 115/004 plan.md"
    next_safe_action: "Author 115/004 tasks.md"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115004"
      session_id: "115-004-plan-init"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: 115/004

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
| Aspect | Value |
|--------|-------|
| Language/Stack | TypeScript + JSON |
| Framework | vitest |
| Testing | rg + vitest run |

### Overview
Mechanical edits across 4 sibling skill graph metadata + 2 TS files (1 scorer constants + 1 vitest parity).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### DoR: 001+002+003 landed
### DoD: rg = 0 on 6 files; vitest passes; validate exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Disjoint-file edit pattern.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Setup — read explicit.ts, verify regex shape
### Phase 2: Implementation — sed 4 graph-metadata + Edit 2 TS files
### Phase 3: Verification — rg + vitest run + strict validate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
| Test | Tool |
|------|------|
| rg on 6 files | `rg -c "deep-ai-council"` |
| vitest parity | `npx vitest run multi-ai-council-runtime-parity` |
| strict validate | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- 001+002+003 landed (gating)
- vitest in mcp_server (Green)
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
git reset --hard HEAD on this phase's commits.
<!-- /ANCHOR:rollback -->
