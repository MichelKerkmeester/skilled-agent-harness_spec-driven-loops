---
title: "Plan: Pi Directive Enforcement — tool_call Deny"
description: "Reuse DISPATCH_SHAPES as pi-default deny with user-text override token; matrix tests; deep-loop exemption."
trigger_phrases:
  - "pi directive enforcement plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/004-pi-directive-enforcement"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Plan authored"
    next_safe_action: "Implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-cli-038-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Pi Directive Enforcement — tool_call Deny

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Add a pi-runtime tool_call deny that matches the existing DISPATCH_SHAPES detector against bash commands, with a per-turn override token (explicit cli-* name or `/deep:* --executor` in user text). The detector already exists — this phase adds the deny and its tests.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- [ ] Definition of Ready: placement decided; DISPATCH_SHAPES matcher importable
- [ ] Definition of Done: SC-001 + SC-002; validate.sh on this folder exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Architecture | tool_call guard | Pi-default deny reusing DISPATCH_SHAPES matcher; override token from current-turn user text |
<!-- /ANCHOR:architecture -->

---



---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Implement

1. Read `dispatch-audit.mjs` + `dispatch-preflight-lint.ts` to confirm matcher reuse path
2. Add pi tool_call guard: shape match → deny unless override token in current-turn user text; deep-loop executors exempt
3. Add matrix tests (deny: devin/cursor-agent/opencode run shapes; allow: override token, deep-loop executor, subagent tool)

### Phase 2: Verify

1. Run matrix tests + existing dispatch audit tests (no regression)
2. `validate.sh --strict` on this folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Target | Test | When |
|--------|------|------|
| matrix tests | deny/allow cases + existing audit suite |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| dispatch-audit.mjs matcher | |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the guard hook/extension. Deny is additive; existing behavior returns on removal.
<!-- /ANCHOR:rollback -->
