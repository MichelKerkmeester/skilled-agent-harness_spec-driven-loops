---
title: "Implementation Plan: sk-vision 009 manual testing playbook"
description: "Author the playbook corpus, scaffold the benchmark run index, validate the operator contract, and optionally persist live-run evidence."
trigger_phrases:
  - "sk-vision testing playbook"
  - "sk-vision manual scenarios"
  - "sk-vision benchmark scaffold"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/009-manual-testing-playbook"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 009 plan skeleton."
    next_safe_action: "Implement per spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/manual-testing-playbook/manual-testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-009-manual-testing-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision 009 manual testing playbook

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown playbook corpus |
| **Framework** | sk-create-manual-testing-playbook templates + validators |
| **Storage** | benchmark/reports/ (run evidence, renderer-owned files) |
| **Testing** | validate-playbook-package.cjs; validate_document.py; optional live runs |

### Overview
Stabilize feature IDs first (fixed in spec.md), author root policy before scenario exceptions, write execution truth per file, then scaffold the benchmark index. Live execution is operator-gated.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met — evidence: REQ-001..REQ-006 + REQ-P1..REQ-P3 satisfied; see `implementation-summary.md`
- [ ] Docs updated (spec/plan/tasks) — evidence: closeout refresh
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Corpus-first: the playbook is an input, benchmark/ is the output home, and the corpus is never rewritten by a run.

### Key Components
- **Root playbook**: package policy, preconditions, evidence rules, review protocol.
- **16 scenario files**: deterministic execution truth per feature.
- **benchmark/**: README + reports/README index scaffold.

### Data Flow
Operator reads root → opens scenario → runs commands → captures evidence → persists PASS/FAIL/SKIP into benchmark/reports/ via the wrapper.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| manual-testing-playbook/ | absent | create 17 docs | validator exit 0 |
| benchmark/ | absent | scaffold index | test -f READMEs |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Read
- [ ] Read both template assets + prompt-voice reference
- [ ] Read 008 catalog entries for cross-links; read runtime.py + pi factory for command surfaces

### Phase 2: Author
- [ ] Root playbook from template
- [ ] 16 scenario files (categories first, then per-file contracts)

### Phase 3: Scaffold + validate
- [ ] benchmark/README.md + reports/README.md
- [ ] validate_document.py root; validate-playbook-package.cjs
- [ ] Optional live runs (operator-gated) with evidence persistence
- [ ] validate.sh --strict on this child
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | root playbook | validate_document.py |
| Contract | 16 scenario files | validate-playbook-package.cjs |
| Manual | live evidence | run-manual-playbook-scenario.cjs (optional) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 008 catalog | Internal | Shipped | Cross-links unresolvable |
| GPU/model cache | External | Optional | Live runs → SKIP with blocker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validator failures or prompt drift.
- **Procedure**: Delete `manual-testing-playbook/` + `benchmark/` scaffolds (additive); re-author from templates. Never rewrite a published run folder; a corrected run gets a new folder.
<!-- /ANCHOR:rollback -->
