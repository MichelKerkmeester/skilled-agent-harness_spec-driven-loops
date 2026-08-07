---
title: "Plan: Governor Capsule Parity Fix"
description: "Single-fix phase: parity renderer for the bridge fallback + label sync, verified by tests and grep."
trigger_phrases:
  - "governor parity plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/002-governor-parity"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Plan authored"
    next_safe_action: "Implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-cli-038-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Governor Capsule Parity Fix

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Change the bridge fallback to compose through the same parity-preserving renderer the canonical paths use, so hygiene + governor + proof all render. Then sync the stale label. Verification: advisor vitest suite + grep assertions.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- [ ] Definition of Ready: gap locations confirmed (research evidence)
- [ ] Definition of Done: SC-001 + SC-002; validate.sh on this folder exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Architecture | Single renderer path | Route bridge fallback through the shared parity renderer; no new components |
<!-- /ANCHOR:architecture -->

---



---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Fix bridge fallback

1. Read `mk-skill-advisor-bridge.mjs:300-390` and the canonical composition (`render.ts:40-129`, `mk-skill-advisor.js:40-60`)
2. Replace the inline fallback with the shared renderer call; ensure proof directive included
3. Add/adjust a parity test asserting the fallback output contains the proof line

### Phase 2: Label sync

1. Update `injection-contract.md:50-58` to the model-agnostic "Governor:" wording used by render.ts

### Phase 3: Verify

1. `npx vitest run` (system-skill-advisor)
2. Grep: no "Fable-5" in injection-contract.md; fallback contains proof
3. `validate.sh --strict` on this folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Target | Test | When |
|--------|------|------|
| vitest | system-skill-advisor suite incl. new parity test |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| none | |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Small diff: `git checkout --` on the two modified files. No schema or config changes.
<!-- /ANCHOR:rollback -->
