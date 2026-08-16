---
title: "Implementation Plan: sk-vision 006-002 package hygiene"
description: "Neutralize package.json, delete .venv, prove hermetic build/tests, rebuild dist, sweep identifiers."
trigger_phrases:
  - "sk-vision package hygiene"
  - "sk-vision publishConfig"
  - "sk-vision venv cleanup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/006-skill-contract-realignment/002-package-hygiene"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 006-002 plan skeleton."
    next_safe_action: "Implement per spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/vision-runtime/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-006-002-package-hygiene"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision 006-002 package hygiene

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | package.json (JSON), bun, Python test harness |
| **Framework** | vision-runtime package |
| **Storage** | None |
| **Testing** | bun run build; bun test; rg sweeps |

### Overview
Remove the accidental-publish surface and the interpreter residue, then prove the package builds and tests hermetically. If tests cannot run without the venv, fix the test path (auto-provision) or record a named-blocker SKIP — never restore the residue.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met — evidence: REQ-001..REQ-006 + REQ-P1 satisfied; see `implementation-summary.md`
- [ ] Docs updated (spec/plan/tasks) — evidence: closeout refresh
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Neutralize → delete → prove → rebuild → sweep.

### Key Components
- **package.json**: publishConfig + publish:npm removed; repository/author neutralized; description dual-host.
- **.venv**: deleted; hermiticity proven by running build+tests after deletion.
- **dist/**: rebuilt from src.

### Data Flow
npm scripts run locally only; no publish path exists after this change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| package.json | publishable fork w/ upstream URL | neutralize | rg exit 1 |
| vision-runtime/.venv | 22MB residue | delete | test ! -d |
| dist/ | built artifacts | rebuild | bun run build |
| .gitignore | absent | create if absent | test -f |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: package.json
- [ ] Read current package.json
- [ ] Remove publishConfig + publish:npm; neutralize repository/author; fix description
- [ ] rg proofs

### Phase 2: residue + hermiticity
- [ ] rm -rf .venv
- [ ] bun run build && bun test (record output)
- [ ] If test fails: inspect test interpreter discovery; fix via auto-provision or named-blocker SKIP

### Phase 3: rebuild + sweep + license
- [ ] bun run build; identifier sweeps; LICENSE check
- [ ] .gitignore
- [ ] validate.sh --strict on this child
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | runtime handlers | bun test |
| Build | dist emission | bun run build |
| Static | identifier/publish sweep | rg |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| bun | Tool | Available | No build/test proof |
| 001-skill-md-and-readme | Internal | Planned | Only manifest ordering |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validator failures, broken tests, or accidental publish surface reintroduced.
- **Procedure**: Restore package.json from git (untracked — recover from session history); restore .venv only if a test genuinely cannot provision (then fix the test instead); rebuild dist. Do not touch `context/`.
<!-- /ANCHOR:rollback -->
