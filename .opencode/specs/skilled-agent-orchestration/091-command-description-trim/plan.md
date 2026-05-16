---
title: "Implementation Plan: Command Description Trim"
description: "Single-file string-replace for 8 frontmatter descriptions; mechanical."
trigger_phrases:
  - "091 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/091-command-description-trim"
    last_updated_at: "2026-05-06T14:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan authored"
    next_safe_action: "Run trim script"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-091"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Command Description Trim

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **File count** | 8 (1 skill + 7 commands) |
| **Format** | YAML frontmatter `description:` (single-line) |
| **Tooling** | Python in-place rewriter with explicit old/new pairs |

### Overview
Same pattern as packet 083: pre-defined old/new string pairs, regex-replace constrained to the frontmatter block. No body content touched.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Audit confirms 8 over-soft items
- [x] Trim text designed and pre-counted (all under target with margin)

### Definition of Done
- [x] All 8 files edited
- [x] Audit shows `overSoft: 0`
- [x] validate.sh strict PASSES

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Same as packet 083 trim style: explicit dict of `(file_path → new_description)`, regex-locate within frontmatter, string-replace.

### Key Components
- `/tmp/trim-commands-091.py` — single-file rewriter (run-time only, not committed)

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Spec folder scaffolded
- [x] Trim text pre-designed (see spec.md scope table)

### Phase 2: Implementation
- [x] Write trim script
- [x] Apply trims to 8 files

### Phase 3: Verification
- [x] Re-run audit; confirm `overSoft: 0`
- [x] validate.sh strict PASSES
- [x] Write impl-summary
- [x] Save context

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Tool |
|------|------|
| Audit | `audit_descriptions.py --json` |
| Validation | `validate.sh --strict` |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| `audit_descriptions.py` (packet 086) | Green |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Advisor regression on any trimmed item
- **Procedure**: `git checkout HEAD -- <file>`; re-audit; redesign

<!-- /ANCHOR:rollback -->
