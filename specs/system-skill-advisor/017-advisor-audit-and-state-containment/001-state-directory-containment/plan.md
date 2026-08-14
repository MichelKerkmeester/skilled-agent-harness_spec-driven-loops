---
title: "Implementation Plan: 001 State Directory Containment"
description: "Land one anchored resolver, convert every writer to it, then clean the leaked directories. The order matters: converting call sites before the shared helper exists lets the raw-CWD idiom survive by be"
trigger_phrases:
  - "advisor-018-001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/017-advisor-audit-and-state-containment/001-state-directory-containment"
    last_updated_at: "2026-07-27T17:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored from research"
    next_safe_action: "Choose the anchoring strategy"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "advisor-018-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 001 State Directory Containment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript (ESM + CJS), Node |
| **Framework** | OpenCode plugin host, MCP servers, launcher daemons |
| **Storage** | JSON and SQLite state under the repo-root `.opencode/` |
| **Testing** | Vitest, plus a boundary regression test to be rewritten |

### Overview

Land one anchored resolver, convert every writer to it, then clean the leaked directories. The order matters: converting call sites before the shared helper exists lets the raw-CWD idiom survive by being copied.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Every claim re-verified against current HEAD
- [ ] Open question in `spec.md` resolved

### Definition of Done
- [ ] All checklist items carry evidence
- [ ] `validate.sh --strict` exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Verify first, then change one thing at a time, proving each step before the next.

### Key Components

- **Evidence**: the research report and its per-claim commands.
- **Verification**: independent re-runs, not the report's own assertions.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm
- [ ] Re-verify every writer at its cited line; drop any that no longer reproduces

### Phase 2: Anchor
- [ ] Land one shared resolver with the chosen anchor and its boundary test

### Phase 3: Convert
- [ ] Point every writer at the shared resolver

### Phase 4: Clean
- [ ] Untrack then delete the 40 leaked directories, add the ignore backstop

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Spec conformance | `validate.sh --strict` |
| Behavioural | The change actually holds | Re-run each evidence command |
| Regression | The defect cannot return | A boundary test, not an enumeration |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Research report | Internal | Green | No evidence base |
| Current HEAD stability | External | Shared tree | Findings may go stale mid-phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a change breaks a consumer that the evidence did not surface.
- **Procedure**: revert the single commit for that change; each step lands separately so blast radius stays one item.
<!-- /ANCHOR:rollback -->
