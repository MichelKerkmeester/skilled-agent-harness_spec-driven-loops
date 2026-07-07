---
title: "Implementation Plan: 101/008 Council Surface Polish"
description: "Small additive packet: SKILL.md routing update, series changelog, 3-test smoke vitest. Direct main-agent Edit/Write, no cli-codex dispatch."
trigger_phrases:
  - "101/008 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/020-deep-multi-ai-council-skill/008-council-surface-polish"
    last_updated_at: "2026-05-11T11:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored implementation plan"
    next_safe_action: "Update SKILL.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-008-surface-polish"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 101/008 Council Surface Polish

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (SKILL.md + changelog), TypeScript (vitest) |
| **Framework** | vitest + sk-doc validators |
| **Storage** | Filesystem only |
| **Testing** | New 3-test vitest joins the matrix |

### Overview
Direct main-agent edits: surface three artifacts through SKILL.md, publish a series changelog, add three smoke tests. No code generation needed; all artifacts already exist.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All three follow-ups diagnosed precisely
- [x] Reference artifacts (v1.0.0.0.md format, existing vitest patterns) inspected

### Definition of Done
- [ ] SKILL.md updated; references discoverable
- [ ] v1.1.0.0.md changelog authored
- [ ] 3 smoke tests pass
- [ ] `test:council` includes the new vitest
- [ ] Full matrix 10 files green
- [ ] Strict spec validation passes on 008 + parent 101
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive surface polish. No new abstractions; reuses existing conventions (SKILL.md sections, changelog/v*.md format, vitest patterns).

### Key Components
- SKILL.md sections to update: Resource Discovery list (line ~104-106) + Key Resources table + Intent Routing (add catalog/contributing entries if relevant)
- Changelog v1.1.0.0 mirrors v1.0.0.0 structure: header + sections (New Features, Architecture, Verification)
- Smoke vitest: 3 `it()` blocks under one `describe()`; uses `child_process.spawnSync` for the helper, `fs.readFileSync` for script-shape assertions

### Data Flow
None. All static documentation + meta-tests.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Packet 008 docs authored
- [x] Reference patterns inspected

### Phase 2: Core Implementation
- [ ] SKILL.md updates (3 sections)
- [ ] Author changelog/v1.1.0.0.md
- [ ] Author tests/council-helpers-smoke.vitest.ts
- [ ] Update mcp_server/package.json `test:council` script
- [ ] Update parent 101 phase map

### Phase 3: Verification
- [ ] Run new vitest standalone
- [ ] Run full 10-file council matrix
- [ ] sk-doc + strict spec validation
- [ ] Author real implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Smoke vitest | Helper script regression | `npx vitest run tests/council-helpers-smoke.vitest.ts` |
| Full matrix | 10-file council batch (existing 9 + new 1) | `npm run test:council` |
| Doc validation | SKILL.md + changelog | `sk-doc/scripts/validate_document.py` |
| Spec validation | Packet 008 + parent | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 101/007 deliverables (CONTRIBUTING.md, feature_catalog/, replay helper) | Internal | Complete | The artifacts being surfaced exist |
| Existing v1.0.0.0.md changelog | Internal | Available | Format reference for v1.1.0.0 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Smoke tests flaky, OR SKILL.md edits broke skill validation.
- **Procedure**: `git restore` the SKILL.md changes + delete the new vitest + delete v1.1.0.0.md. Purely additive; rollback removes the additions.
<!-- /ANCHOR:rollback -->
