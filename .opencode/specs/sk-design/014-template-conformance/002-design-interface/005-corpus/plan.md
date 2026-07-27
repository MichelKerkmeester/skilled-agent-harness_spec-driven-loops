---
title: "Implementation Plan: design-interface corpus conformance"
description: "Audit corpus/ against overview.md directory rules and package_skill.py; resolve the README frontmatter inconsistency."
trigger_phrases:
  - "corpus plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/005-corpus"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Planned plan.md"
    next_safe_action: "Run package_skill.py --check and inspect corpus-specific output"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: design-interface corpus conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JavaScript (`.mjs`) |
| **Framework** | No authored template; `overview.md` directory rules + `package_skill.py` |
| **Storage** | None |
| **Testing** | `node --test corpus/tests/*.test.mjs`, `package_skill.py --check` |

### Overview
No governing content template applies to `corpus/`. Audit naming/file-type conformance via `package_skill.py`, and resolve whether the missing README frontmatter is a defect.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable

### Definition of Done
- [ ] `package_skill.py --check` clean for `corpus/`
- [ ] README frontmatter question resolved
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Directory-rule audit; no authored content template.

### Key Components
- **`corpus/README.md`**: maintainer-facing directory narrative, currently no frontmatter.
- **`corpus/*.mjs`, `corpus/tests/*.mjs`**: adapters and their test/fixture pair.

### Data Flow
N/A — static files and Node test scripts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-read `overview.md` §2 directory-organization principle

### Phase 2: Core Implementation
- [ ] Run `package_skill.py --check`, isolate `corpus/`-scoped findings
- [ ] Decide README frontmatter question; apply if warranted
- [ ] Confirm `.mjs` file naming is kebab-case throughout

### Phase 3: Verification
- [ ] Run `node --test corpus/tests/*.test.mjs`
- [ ] Re-run `package_skill.py --check`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Corpus adapter contracts | `node --test corpus/tests/*.test.mjs` |
| Checker | Naming/file-type conformance | `package_skill.py --check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | — | Green | — |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A frontmatter addition changes how `corpus/README.md` renders for maintainers in an unwanted way.
- **Procedure**: Revert via git.
<!-- /ANCHOR:rollback -->
