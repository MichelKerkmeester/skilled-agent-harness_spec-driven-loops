---
title: "Plan: Pi Directive Capsule Layer"
description: "Inject the pi-only dispatch directive line into pi's input transform; verify pi-only scope."
trigger_phrases:
  - "pi directive capsule plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/003-pi-directive-capsule"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Plan authored"
    next_safe_action: "Implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-cli-038-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Pi Directive Capsule Layer

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Append the research-approved directive line (synthesis Layer 1) to pi's per-turn input transform, unconditionally for nonblank turns. Keep it pi-only. Verify via tests + headless pi run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- [ ] Definition of Ready: wording frozen from synthesis; injection point chosen
- [ ] Definition of Done: SC-001 + SC-002; validate.sh on this folder exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Architecture | Input transform | Pi input chain is additive; directive appended after advisor context |
<!-- /ANCHOR:architecture -->

---



---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Implement

1. Choose injection site: inline in `prompt-advisor.ts` after context extraction (24-52) OR sibling `pi-subagents-directive.ts` extension — decide by cohesion with existing pi transforms
2. Add the directive constant + unconditional append for nonblank input
3. Add tests: directive present in pi transform output; shared render unchanged; empty-context path covered

### Phase 2: Verify

1. `npx vitest run` in system-skill-advisor
2. Headless `pi -p` run: exit 0, no extension load errors
3. `validate.sh --strict` on this folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Target | Test | When |
|--------|------|------|
| vitest + headless pi -p | transform tests + smoke run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| pi runtime, system-skill-advisor hooks | |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the appended block / delete the sibling extension. Pi-only surface; no cross-runtime impact.
<!-- /ANCHOR:rollback -->
