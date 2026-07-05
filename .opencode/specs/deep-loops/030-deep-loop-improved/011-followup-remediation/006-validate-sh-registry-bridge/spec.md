---
title: "Feature Specification: Validate.sh Registry Bridge"
description: "Bridge orchestrator.ts's default validateFolder() path to also run registry-backed shell rules (COMMENT_HYGIENE_MARKER, SCAFFOLD_NEVER_TOUCHED) that currently only run under SPECKIT_RULES/SPECKIT_VALIDATE_LEGACY."
trigger_phrases:
  - "validate sh registry bridge"
  - "orchestrator ts registry rules"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/011-followup-remediation/006-validate-sh-registry-bridge"
    last_updated_at: "2026-07-01T21:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed bridge, fixed packet 030, closed child"
    next_safe_action: "No implementation action remaining"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Validate.sh Registry Bridge

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 6 |
| **Predecessor** | 005-scaffold-content-004-through-007 |
| **Successor** | 007-sliding-window-convergence-mode |
| **Handoff Criteria** | Registry rules not natively implemented in `orchestrator.ts` (`COMMENT_HYGIENE_MARKER`, `SCAFFOLD_NEVER_TOUCHED`) run automatically during a plain `validate.sh --strict` call with no env vars set, with no rule running twice and existing native validator behavior completely unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The default `validate.sh` invocation path uses `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` (a hand-written TypeScript file, ~530 lines) whose `validateFolder()` function (lines roughly 420-455) calls a flat, hardcoded sequence of validator functions (`validateFileExists`, `validatePlaceholders`, `validateTemplateSource`, `validateTemplateShape`, `validatePriorityTags`, `validateFrontmatterBasics`, `validateSpecDocRule`, `validateGeneratedMetadataIntegrity`, `validateGeneratedMetadataDrift`) and pushes results into an `entries[]` array. This function never reads `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` (a 347-line JSON array of 40 rule entries with fields `rule_id`, `aliases[]`, `script_path`, `severity`, `category`, optional `strict_only`, optional `flags[]`, `description`) or the shell rule scripts under `.opencode/skills/system-spec-kit/scripts/rules/*.sh` at all. Only when the caller sets `SPECKIT_RULES=<name>` or `SPECKIT_VALIDATE_LEGACY=1` does `run_node_orchestrator()` (in `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`, roughly lines 969-1020) return early (line 970/973) and fall through to the shell-registry framework's `run_all_rules()` (roughly lines 1185-1186) which DOES discover registry rules. This means `COMMENT_HYGIENE_MARKER` and `SCAFFOLD_NEVER_TOUCHED` — both registered in `validator-registry.json` with `category: authored_template`, neither `strict_only`, meaning both are meant to run on every default call — never actually run during a normal `validate.sh --strict` invocation, which is what nearly every real caller in this whole packet's history has used.

### Purpose
Add a bridge function to `orchestrator.ts` that runs after the native entries are pushed: read `validator-registry.json`, derive the set of rule_ids already natively implemented by inspecting the just-built `entries[]` array itself (self-healing — no separately maintained allowlist that could drift out of sync), then for every registry rule NOT in that set, shell out to the rule's shell script the same way `validate.sh`'s own `run_all_rules()` does (parsing `RULE_STATUS`/`RULE_MESSAGE`/`RULE_DETAILS` output), and push a matching `ValidationEntry`. This makes the default Node-orchestrator path also run registry-backed shell rules automatically, closing the gap without a rewrite.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the bridge function to `orchestrator.ts`, reading `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json`.
- Derive the already-implemented rule_id set by inspecting the just-built `entries[]` array itself (self-healing — no separately maintained allowlist that could drift out of sync).
- For every registry rule NOT in that derived set, shell out to the rule's `script_path` the same way `validate.sh`'s own `run_all_rules()` does, parsing `RULE_STATUS`/`RULE_MESSAGE`/`RULE_DETAILS` output, and push a matching `ValidationEntry`.
- Wire the bridge function into `validateFolder()` immediately after the native entries are built, ensuring no double-running.
- Verify with `validate.sh --strict --recursive` on the ENTIRE `030-deep-loop-improved` packet root immediately after implementing, to prove scaffold cleanup (siblings 003, 004, 005) already closed every instance this newly-enabled rule would otherwise catch.

### Out of Scope
- Rewriting `orchestrator.ts`.
- Adding new `validate.sh` rules.
- Touching the shell-registry framework itself (`run_all_rules()`) — only reusing its output-parsing convention.
- Starting implementation before siblings 003, 004, and 005 (scaffold-content authoring) reach Status: Complete — this is a hard sequencing dependency, not a scope item to resolve inside this child (see §6 Risks & Dependencies).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Modify | Add bridge function (reads registry, derives self-healing skip-set from live `entries[]`, shells out to remaining rules); wire into `validateFolder()` after native entries are pushed |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/*.vitest.ts` (or nearest existing suite) | Modify (if practical) | New test exercising the bridge/dual-path branch, if a practical seam exists — prior research found NO existing test imports `validateFolder()` or exercises the dual-path branch logic at all; flag as a real coverage gap in `implementation-summary.md` even if a full test harness is out of scope for this child |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Registry rules not natively implemented run under the default invocation | With no env vars set, a plain `validate.sh --strict` call produces `COMMENT_HYGIENE_MARKER` and `SCAFFOLD_NEVER_TOUCHED` results in the Node-orchestrator output |
| REQ-002 | A fixture folder with a known scaffold marker and `Status: Complete` fails under the default invocation | Manual test against a fixture folder demonstrates the failure with no `SPECKIT_RULES` set — before this fix it would have silently passed |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No rule runs twice | The bridge's skip-set is derived live from `entries[]`, not a hardcoded/separately maintained list, so any rule already natively implemented is automatically excluded from the shell-out pass |
| REQ-004 | Existing native validator behavior is completely unchanged | All currently-passing native validator entries (`validateFileExists`, `validatePlaceholders`, `validateTemplateSource`, `validateTemplateShape`, `validatePriorityTags`, `validateFrontmatterBasics`, `validateSpecDocRule`, `validateGeneratedMetadataIntegrity`, `validateGeneratedMetadataDrift`) produce identical output before and after the bridge is wired in |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh --strict --recursive` on the whole `030-deep-loop-improved` packet root shows 0 errors after this child ships, proving scaffold cleanup (siblings 003, 004, 005) was sufficient.
- **SC-002**: A manual test against a fixture folder with a known scaffold marker and `Status: Complete` now fails as expected under the DEFAULT invocation (no `SPECKIT_RULES` needed), where before this fix it would have silently passed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

**HARD DEPENDENCY: This child MUST NOT be implemented until siblings 003-scaffold-content-002-deep-loop-runtime, 004-scaffold-content-003-deep-loop-workflows, and 005-scaffold-content-004-through-007 (scaffold-content authoring) are ALL Status: Complete.** Enabling `COMMENT_HYGIENE_MARKER` and `SCAFFOLD_NEVER_TOUCHED` by default would otherwise immediately fail `validate.sh --strict` on ~40 packets across phases 002-007 that still carry scaffold markers.

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency (HARD BLOCK) | Siblings 003, 004, and 005 (scaffold-content authoring) must all reach Status: Complete before this child is implemented or merged | Shipping this child early would break ~40 packets across phases 002-007 that still carry scaffold markers, since those markers would newly fail `validate.sh --strict` by default | Do not start implementation until all three siblings show Status: Complete; the verification step re-runs `validate.sh --strict --recursive` across the whole packet root immediately after implementing to prove the cleanup closed every instance first |
| Risk | No existing test exercises the dual-path (native vs. registry-bridge) branch logic in `orchestrator.ts` | Coverage gap — dual-path equivalence could regress silently in the future | Flag explicitly in `implementation-summary.md` as a known limitation; a full test harness is out of scope for this child but worth a follow-up candidate |

**Post-implementation finding (real, not anticipated in original scope):** the registry has ~30 shell-backed rules, not just the 2 named above. The bridge as designed and built (matching the approved design) wires in every eligible rule, not an allowlist of 2 — this activated roughly 20 previously-dormant rules by default, repo-wide, not just for the 2 originally motivating this child. A separate, real problem compounded it: `validate.sh` had no dist-freshness check at all, so the compiled `orchestrator.js` this child depends on had silently been ~2 weeks stale, meaning several already-shipped native validator checks (from packet 028's own prior work) had also never actually run anywhere. Rebuilding dist to pick up this child's own edit surfaced both at once, failing `validate.sh --strict --recursive` on all 43 packet roots repo-wide (257 folders). This is tracked and resolved as its own initiative: `system-speckit/030-validate-sh-dist-freshness-and-repo-remediation` (dist-freshness enforcement + repo-wide remediation sweep, explicitly excluding `system-speckit/028-*` which is owned by a different concurrent session). This child's own scope stayed bounded to packet 030 passing cleanly, per the plan.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope bounded by direct Explore research this session confirming the default `validate.sh` path never invokes registry-backed shell rules; independently re-verified against current code before this phase was scaffolded.
<!-- /ANCHOR:questions -->
