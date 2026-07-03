---
title: "Feature Specification: Orchestrator Validation Parity"
description: "Fix the two native-vs-shell parity gaps in the Node validation orchestrator (strict-only rules never run; unstarted folders must not require completion docs) and add direct vitest coverage for the registry bridge."
trigger_phrases:
  - "orchestrator validation parity"
  - "strict only rules skipped"
  - "file exists started work exemption"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/015-deep-review-followup-hardening/001-orchestrator-validation-parity"
    last_updated_at: "2026-07-03T10:40:24Z"
    last_updated_by: "gpt-5.5-opencode"
    recent_action: "Both parity fixes plus the node-rule bridge shipped, rebuilt, and live-proven"
    next_safe_action: "None; child complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-001-orchestrator-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Orchestrator Validation Parity

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

## EXECUTIVE SUMMARY

The compiled Node orchestrator that `validate.sh` runs by default disagrees with the shell rules it replaced, in both directions: it never executes `strict_only` registry rules (so `--strict` is weaker than the shell path), and it demands `implementation-summary.md` from folders whose tasks show no started work (so honest Not Started scaffolds fail validation). Both were confirmed by the 2026-07-02 deep-review and its remediation (GPT-F003; the child-007 FILE_EXISTS false error). This child fixes both in `orchestrator.ts`, adds the missing direct vitest coverage for the registry bridge (GPT-F006), and ships them behind exactly one dist rebuild executed only when no concurrent session holds uncommitted work in the package.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-02 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 |
| **Predecessor** | None |
| **Successor** | 002-lineage-timestamp-guard |
| **Handoff Criteria** | Strict runs execute strict-only registry rules; Not Started Level 1-3 folders no longer require implementation-summary.md; registry bridge has direct vitest coverage; one dist rebuild ships all three; `test-validation-extended.sh` fully green; packet 030 child 007's known FILE_EXISTS error clears |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`runRegistryShellRules` filters the validator registry with `rule.strict_only !== true` unconditionally (`orchestrator.ts:269` at time of writing), so strict-only shell rules such as `CONTINUITY_FRESHNESS` and `EVIDENCE_MARKER_LINT` never execute through the default Node path even under `--strict` — while the legacy shell path runs them. Separately, `validateFileExists` (`orchestrator.ts:370`) requires every `docsForLevel()` file unconditionally, including `implementation-summary.md`, while the shell rules (`check-files.sh`, `check-level-match.sh`) exempt folders whose checklist/tasks show no completed work — an exemption this program hardened on 2026-07-02 to stop the task-notation legend from counting as started work. The native gap makes genuinely Not Started scaffolds (live example: `deep-loops/030-agent-loops-improved/011-followup-remediation/007-sliding-window-convergence-mode`) fail FILE_EXISTS with a false error. Finally, the registry bridge (`runRegistryShellRules`, `readValidatorRegistry`, `resolveRegistryRuleScript`, `mapShellRuleStatus`) has no direct TypeScript unit coverage; behavior is pinned only by bash fixtures.

### Purpose
Make the Node path's strictness equal to the shell path's in both directions and pin the bridge behavior with unit tests, so validate.sh's default path is trustworthy for both "strict means strict" and "not started means no completion docs required".
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Strict-aware registry filter: when the orchestrator runs with `strict`, `strict_only` rules are included; without `strict`, current behavior is unchanged.
- Started-work exemption in `validateFileExists` (and the native level-match required-file logic if it shares the gap): `implementation-summary.md` is required only when checklist/tasks show real completed task lines (`- [x]` list items, mirroring the hardened shell heuristic).
- New vitest file covering: strict vs non-strict registry filtering, `mapShellRuleStatus` mappings, `resolveRegistryRuleScript` path-traversal guard, and the started-work exemption in both directions.
- One dist rebuild for `@spec-kit/mcp-server`, executed only after confirming no concurrent uncommitted WIP in the package; followed by the full bash validation suite.

### Out of Scope
- New validation rules or changes to any shell rule semantics.
- Registry schema changes.
- Any other native check's behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Modify | Strict-aware filter; started-work exemption |
| `.opencode/skills/system-spec-kit/mcp_server/tests/validation-orchestrator-bridge.vitest.ts` | Create | Direct unit coverage for bridge + exemption |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Strict runs include strict-only rules | With `--strict`, a registry rule flagged `strict_only: true` executes through the Node path and its result appears in output; without `--strict`, it does not run (current behavior preserved) |
| REQ-002 | Started-work exemption in native FILE_EXISTS | A Level 1-3 folder whose tasks.md/checklist.md contain no `- [x]` list items passes FILE_EXISTS without implementation-summary.md; one with a real completed task line still requires it |
| REQ-003 | No dist rebuild while the tree is hot | The rebuild step runs only after `git status` shows no uncommitted mcp_server source files from other sessions, or the operator explicitly approves |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Bridge unit coverage | New vitest file exercises strict/non-strict filtering, status mapping, and the path-traversal guard directly |
| REQ-005 | Full-suite green | `test-validation-extended.sh` passes fully after the rebuild |
| REQ-006 | Known false error clears | Packet 030 child 007 validates with 0 errors pre-implementation-summary |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict-only rules demonstrably execute under strict Node-path runs (observed in real validate.sh output, not just unit tests).
- **SC-002**: `deep-loops/030-agent-loops-improved/011-followup-remediation` validates recursively with 0 errors.
- **SC-003**: New vitest file passes; full mcp_server vitest suite shows 0 new failures.
- **SC-004**: `test-validation-extended.sh` fully green post-rebuild.

### Acceptance Scenarios

- **Scenario 1**: **Given** a registry rule flagged strict_only, **when** validate.sh runs with --strict, **then** the rule executes through the Node path and its result line appears in output.
- **Scenario 2**: **Given** the same strict_only rule, **when** validate.sh runs without --strict, **then** the rule does not execute and no result line appears.
- **Scenario 3**: **Given** a strict_only rule whose script_path is a TypeScript validation script, **when** the bridge resolves it, **then** the compiled dist sibling executes and its tab-protocol output parses into a well-formed entry.
- **Scenario 4**: **Given** a Not Started Level 1 folder whose tasks.md contains only the notation-legend backticked [x] row, **when** FILE_EXISTS runs, **then** the folder passes without implementation-summary.md.
- **Scenario 5**: **Given** the same folder after one real completed task line is added, **when** FILE_EXISTS runs, **then** implementation-summary.md is required again.
- **Scenario 6**: **Given** a script_path containing a traversal attempt, **when** either resolver runs, **then** resolution returns null and no script executes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Newly-executing strict-only rules surface real repo findings previously hidden | M | That is the point; triage findings, do not weaken rules to stay green |
| Risk | Dist rebuild sweeps concurrent WIP into shared dist | H | REQ-003 gate: quiet-tree check or explicit operator approval before rebuild |
| Dependency | Registry rules must remain executable standalone | L | No registry changes in scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR-001 | Compatibility | Non-strict validation output unchanged | Byte-comparable entries for non-strict runs on unchanged folders |
| NFR-002 | Performance | Strict runs may add only the cost of the strict-only rules themselves | No new per-rule overhead beyond executing them |
| NFR-003 | Safety | Fail-closed rebuild discipline | Rebuild never runs unattended while the package tree is dirty from another session |

## 8. EDGE CASES

| # | Edge Case | Expected Behavior |
|---|-----------|-------------------|
| 1 | Registry rule flagged both `strict_only` and `severity: skip` | Never runs in any mode (skip wins) |
| 2 | Folder with tasks.md containing only the notation-legend `[x]` | Treated as not started (mirrors hardened shell heuristic) |
| 3 | Folder with checklist.md `- [x]` but tasks.md untouched | Treated as started; implementation-summary.md required |
| 4 | Phase-parent folders | Untouched: lean-trio logic short-circuits before the exemption |
| 5 | Strict-only rule fails during a strict run | Reported like any shell-bridged failure; exit code reflects severity |

## 9. COMPLEXITY ASSESSMENT

| Factor | Assessment | Notes |
|--------|------------|-------|
| Code delta | Small | One filter expression + one predicate function + wiring |
| Coordination | High | Shared-dist rebuild across concurrent sessions is the hard part |
| Test surface | Moderate | Both directions of both gaps need pinning |

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Concurrent-session WIP swept into dist | Medium | High | REQ-003 quiet-tree gate; operator approval path |
| Strict runs newly fail on latent repo debt | Medium | Medium | Expected; findings triaged, not suppressed |
| Exemption too lax (real completion missed) | Low | Medium | Anchored `- [x]` heuristic identical to hardened shell rules; both directions unit-tested |

## 11. USER STORIES

- **US-001**: As an operator running `validate.sh --strict`, every rule the strict contract promises actually executes, so a green strict run means what it says. Acceptance: strict-only rule visibly runs and can fail a strict run.
- **US-002**: As an author of an honestly Not Started scaffold, validation does not demand a completion document for work that has not begun. Acceptance: 030/011/007 validates clean.
- **US-003**: As a maintainer changing the registry bridge, unit tests catch filtering/mapping regressions before any bash fixture runs. Acceptance: new vitest file fails on injected filter regression.

## 12. OPEN QUESTIONS

- None. Both gaps verified against live code with exact line references during the 2026-07-02 session.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Origin findings**: GPT-F003 and GPT-F006 in `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/gpt/review-report.md`; FILE_EXISTS gap recorded in `changelog-011-006-validate-sh-registry-bridge.md` Follow-Ups
- **Local decisions**: `decision-record.md` — **Plan**: `plan.md` — **Tasks**: `tasks.md` — **Checklist**: `checklist.md`
- **Parent**: `../spec.md`
