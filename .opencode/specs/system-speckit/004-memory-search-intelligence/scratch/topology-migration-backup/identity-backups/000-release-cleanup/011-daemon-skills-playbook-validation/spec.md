---
title: "Spec: 028 Daemon Skills Playbook Validation [template:level_2/spec.md]"
description: "Salvaged results and findings spec for the daemon-skills playbook validation benchmark. Every stress suite was run plus 222 of 471 manual-testing-playbook scenarios across three cli models, each scored, with 14 real product findings documented. The benchmark workspace was wiped on a process exit and this packet is reconstructed from the surviving session transcript and recovered eval logs."
trigger_phrases:
  - "daemon skills playbook validation"
  - "028 playbook benchmark findings"
  - "spec-kit advisor code-graph model validation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/000-release-cleanup/011-daemon-skills-playbook-validation"
    last_updated_at: "2026-07-04T17:31:28.734Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Salvaged the benchmark results into a packet after the workspace was wiped"
    next_safe_action: "Operator decides whether to re-run the remaining 249 spec-kit scenarios"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-25-spec-011-daemon-skills-playbook-validation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: 028 Daemon Skills Playbook Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | COMPLETE (salvaged, partial coverage) |
| **Created** | 2026-06-25 |
| **Phase** | 011 of 012 |
| **Branch** | `system-speckit/004-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 028 shipped a large body of work into three daemon-backed system skills (system-spec-kit, system-skill-advisor and system-code-graph). Each skill carries a vitest stress suite and a manual-testing-playbook package of model-executed scenarios. Before release no one had run those playbooks end to end through real cli models and scored the output, so the runtime behavior of the shipped features was unverified and any wiring or schema gaps were invisible.

### Purpose
Run every stress suite and as many manual-testing-playbook scenarios as feasible, drive the playbook scenarios through two cli models per phase, critically score each model run for execution and verdict justification rather than trusting a PASS string, and document every real product finding with a remediation plan. The deliverable is a results and findings report.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Vitest stress suites for all three skills, run directly because they are deterministic code, not model dispatched.
- Manual-testing-playbook scenarios for all three skills, run through cli models in an isolated sandbox.
- Critical per-run scoring, finding capture, and remediation planning during the loop.

### Out of Scope
- Implementing the remediations. This packet plans fixes, it does not apply them.
- Re-running the scenarios that were lost when the workspace was wiped. The operator chose to salvage the report rather than re-run from scratch.
- Any production default change.

| Surface | File Path | Change Type |
|---------|-----------|-------------|
| This packet | `011-daemon-skills-playbook-validation/*` | Add |
| Skill source | none | None, read-only validation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional
- FR1 Run all three stress suites and record pass counts per skill.
- FR2 Run playbook scenarios once each, split across the two active models by index parity, no double-runs.
- FR3 Score each run for real execution, verdict justification against expected signals, quality, and insight.
- FR4 Record every real product finding with root cause, fix approach, and the test-coverage hole.

### Non-Functional
- NFR1 The real repository stays byte-clean during the run. The benchmark must not pollute it.
- NFR2 Isolation artifacts must be separated from real product failures in the report.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC1 Stress results recorded for all three skills.
- SC2 Playbook coverage recorded per skill and per model with PASS, FAIL, UNCLEAR and timeout buckets.
- SC3 Each real finding carries evidence and a remediation plan.
- SC4 Isolation caveats stated so the verdicts can be read correctly.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| Daemon or direct writes leak to the real repo | Repo pollution | Per-clone daemon isolation plus a work-aware leak check each poll |
| Isolation artifacts misread as product bugs | False findings | Discount db, health, status, zero-state, and daemon-config failures in the isolated run |
| Workspace loss | Lost progress | Realized. Report reconstructed from the surviving transcript and recovered eval logs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The one decision (salvage now versus re-run) was answered by the operator: salvage now, no re-run.

<!-- ANCHOR:nfr -->
### Non-Functional Requirements Detail

| Aspect | Target | Result |
|--------|--------|--------|
| Real repo cleanliness | 0 benchmark changes | Met. The 3 clones plus the killed global daemon held the real repo at 0 changes |
| Verdict fidelity | Each verdict scored, not trusted | Met for the 222 scenarios run |
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
### Edge Cases

- A dispatch that hits the timeout cap has no verdict line and must be bucketed TIMEOUT, not FAIL.
- A fresh clone daemon DB makes db, health, status, and zero-state scenarios report empty or degraded. These are environment, not product.
- A scenario that validates the clone opencode.json reads the isolation edits, not the real config. Discount those.
- Concurrent operator opencode sessions cause session-DB contention that fast-fails dispatches at 5 seconds with 0 tools. These are not real verdicts.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
### Complexity Notes

The validation is operationally complex because the daemons resolve their workspace from cwd and pin a global socket, so naive sandboxing leaks back to the real repo. The isolation recipe (per-clone socket and DB dirs committed in each clone, plus killing the orphaned global daemon) is what made the run safe. Scoring is the other cost: each run is read critically against expected signals rather than by its verdict string.
<!-- /ANCHOR:complexity -->

<!-- /ANCHOR:questions -->
