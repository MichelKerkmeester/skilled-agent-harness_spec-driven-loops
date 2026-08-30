---
title: "Feature Specification: Codex Dispatch Scope"
description: "Scope the deep-loop runtime requirement to the loop types that runtime actually supports, so a one-off dispatch has a compliant path."
trigger_phrases:
  - "codex dispatch scope"
  - "fanout runtime requirement"
  - "cli-codex rule 2"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/058-codex-dispatch-scope-loosening"
    last_updated_at: "2026-08-30T11:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Scoped the runtime-delegation rule to deep-loop fan-outs"
    next_safe_action: "None outstanding"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-codex/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-cli-codex-058"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Codex Dispatch Scope

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-30 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The skill required all orchestrated execution to go through
`fanout-run.cjs`. That runtime accepts two loop types, `deep-research` and
`deep-review`, and asserts on anything else. So a dispatch that is neither — a
document repair, a file generation, a single question — had no compliant path:
the rule pointed at a runtime that would reject it.

The rule was written to prevent a second Codex adapter, which is a real risk
worth blocking. It over-reached by naming every dispatch rather than the ones
the runtime can carry.

### Purpose

Say what the runtime is for, and leave a legal path for what it is not for,
without weakening the no-second-adapter prohibition.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- The delegation rule and its supporting prose in `cli-codex/SKILL.md`, in the
  five places that stated it.

**Out of scope**

- The no-second-adapter prohibition, which is unchanged and now stated more
  precisely.
- Every other dispatch rule. A direct dispatch honors all of them.
- Sibling `cli-*` skills, which carry their own wording and were not read here.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | Deep-loop fan-outs still route through the shared runtime | P0 |
| REQ-002 | A dispatch outside those loop types has a stated legal path | P0 |
| REQ-003 | Building a packet-local adapter remains forbidden | P0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- No statement in the skill requires the runtime for a dispatch it cannot run.
- The distinction between "calling the CLI" and "building an adapter" is
  explicit, since the loosened rule depends on it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| Read as permission to bypass the runtime for real fan-outs | Lineage state and convergence stop being produced | The rule names the two loop types explicitly and binds them to the runtime |
| Read as permission to build a wrapper | The second adapter the rule exists to prevent | Stated directly: a dispatch-site call is not an adapter, a reusable spawn path is |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Whether the sibling `cli-*` skills carry the same over-reach. Likely, since the
wording looks shared, but they were not in scope here.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## 8. RELATED DOCUMENTS

- `plan.md`, `tasks.md` — approach and execution
<!-- /ANCHOR:related-docs -->
