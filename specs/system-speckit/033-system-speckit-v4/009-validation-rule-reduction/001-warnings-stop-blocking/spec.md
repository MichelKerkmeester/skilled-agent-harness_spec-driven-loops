---
title: "Feature Specification: A Warning Stops Being A Failure"
description: "Strict mode decides which rules run; it stops deciding what a warning means."
trigger_phrases:
  - "warnings stop blocking"
  - "strict warn promotion"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-validation-reduction/001-warnings-stop-blocking"
    last_updated_at: "2026-08-29T18:45:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Removed the strict warn promotion and restored the two enforcement paths that depended on it"
    next_safe_action: "Begin the next phase: take archives and track roots out of the graded set"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-041-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: A Warning Stops Being A Failure

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

One clause made every warning a hard failure whenever strict mode was on, and
the completion rule mandates strict mode. Every severity below error was
therefore decorative: a rule registered as advice blocked a completion claim
exactly as hard as a rule registered as an error.

The measurable cost was most of the corpus. On a fixed sample of 250 live
packets, 39.6% passed. The gate was red for three packets in five, which is the
state in which people stop reading a gate at all.

This phase separates two meanings that the flag had collapsed: strict decides
which rules RUN, and no longer decides what a warning MEANS.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- The verdict computation in the orchestrator.
- The two rules whose enforcement depended on the removed promotion.
- Tests that encoded the old contract.

**Out of scope**

- Deleting any rule. Nothing is removed here; rules only stop blocking when
  they said they were advice all along.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | A warning does not fail a run, in strict mode or out of it | P0 |
| REQ-002 | Strict mode still selects the rules that only run under strict | P0 |
| REQ-003 | No rule that blocked before this change silently stops blocking | P0 |
| REQ-004 | No packet that passed before this change fails after it | P0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The pass rate on a fixed sample rises, and every packet that changes verdict
  changes it in one direction only.
- A rule that claims to be enforcing reports an error rather than relying on a
  global promotion to make its warning fatal.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| A rule was silently relying on the promotion to enforce | Enforcement disappears without anyone noticing | Every rule whose tests asserted a hard failure was checked; the two that relied on it now emit an error themselves |
| A caller reads the exit code and expects warnings to fail | A pipeline stops catching something | The exit code was already only ever 0 or 2; the documented middle tier never existed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The one judgement this phase required — whether a rule that only ever
warned was meant to block — was answered per rule by reading its own tests.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## 8. RELATED DOCUMENTS

- `../spec.md` — the parent packet and its phase map
- `plan.md`, `tasks.md` — this phase's approach and execution
<!-- /ANCHOR:related-docs -->
