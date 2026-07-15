---
title: "Feature Specification: CLI Front-Door Safety Remediation"
description: "Remediation sub-phase of the 027 fresh+regression deep-review: 6 CLI front-door findings. Resolved — 5 fixed, 1 refuted-then-hardened; CLI vitest green."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/004-cli-frontdoor-safety"
    last_updated_at: "2026-06-16T15:20:00Z"
    last_updated_by: "cli-frontdoor-remediation"
    recent_action: "Resolved 6 CLI front-door findings; CLI vitest green"
    next_safe_action: "Operator review; run validate.sh --strict on this folder"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: CLI Front-Door Safety Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Resolved (5 fixed, 1 refuted-then-hardened; CLI vitest green) |
| **Created** | 2026-06-16 |
| **Branch** | `system-speckit/003-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Findings** | 6 (5 P1 / 1 P2) |
| **Handoff Criteria** | Every listed finding fixed-or-refuted-with-reason, each code fix test-gated; vitest + shell exit-code assertions across the three CLIs. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Sub-phase of `005-fresh-regression-remediation` (phase parent). It owns the subsystem cluster from the fresh+regression deep-review's findings registry. Per operator directive every finding is carried (refuted ones as hardening, asserted ones fix-as-stated). Source: `../../review/fresh-regression-75/deep-review-findings-registry.json`.

**Scope Boundary**: only findings assigned to this sub-phase by `fix-coverage.json`. No cross-phase edits.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The deep-review surfaced 6 findings in this subsystem. Left unaddressed they risk real defects (data integrity / lifecycle / safety) plus robustness and traceability debt. This sub-phase remediates each.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**: the 6 findings enumerated in tasks.md (and `fix-coverage.json`).
**Out of scope**: findings owned by sibling sub-phases; any change outside the cited files + their tests.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1** (004-T001, downgraded→P2) — `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:753`: Before probing or connecting, centralize a client-side IPC perimeter check: lstat the final socket directory and reject symlinks, require current uid ownership when process.getuid exists, reject group
- **R2** (004-T002, refuted-Round2 → harden-anyway) — `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts:353`: Carry a separate promptTime boolean out of parseCliArgs/default env detection and reject mutation tools before callTool when promptTime is true, regardless of --trusted or trusted env. Add regression 
- **R3** (004-T003, downgraded→P2) — `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:18`: Normalize the bridge tool name before policy checks using the same snake/kebab/camel alias map as code-index-cli, or block by canonical CLI tool definition after alias resolution. Add tests for codeGr
- **R4** (004-T004, downgraded→P2) — `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:924`: Before probing or connecting, validate the socket directory and socket path with lstat/stat: current uid ownership, not group/world-writable, no symlinked socket path, and allowed root containment. Re
- **R5** (004-T005, downgraded→P2) — `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:982`: Make spec-memory mirror the other two CLIs: either add `|| isErrorPayload(payload)` to `extractToolPayload` (skill-advisor style) or change line 982 to `return isError || isErrorPayload(payload) ? EXI
- **R6** (004-T006, P2) — `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts:428`: Reject inline values for --trusted/--maintainer, or parse --trusted=true|false with the same boolean parser used for --warm-only. Add tests proving --trusted=false and --trusted=0 do not satisfy the m

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Every finding resolved (fixed, or refuted-with-reason recorded in the registry).
- vitest + shell exit-code assertions across the three CLIs.
- No regression to prior epic-sweep remediations; whole-gate delta reported.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Asserted findings may be false positives (Round-2 refuted 3/16 code candidates) — confirm against cited code before editing.
- Doc/metadata edits must keep validate.sh --strict green.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at scaffold time; raise per-task if a cited finding proves refuted on inspection.
<!-- /ANCHOR:questions -->
