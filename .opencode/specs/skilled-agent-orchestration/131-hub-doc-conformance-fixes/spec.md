---
title: "Feature Specification: Hub Doc Conformance Fixes [131-hub-doc-conformance-fixes]"
description: "Remediation PLAN for the 130-hub-doc-conformance-review deep-review FAIL verdict: 102 P0 / 5 P1 / 4 P2 raw findings (67 P0 / 4 P1 / 2 P2 distinct, deduped finding IDs) against cli-external + mcp-tooling hub docs. Planning + spec only -- no doc edits, no routing-layer changes."
trigger_phrases:
  - "hub doc conformance fixes"
  - "cli-external mcp-tooling remediation plan"
  - "deep review 130 remediation plan"
  - "clickup figma doc reality drift fix plan"
  - "verify-first fix protocol"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-hub-doc-conformance-fixes"
    last_updated_at: "2026-07-10T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored spec/plan/tasks/checklist/decision-record for the plan"
    next_safe_action: "Dispatch WS-A through WS-D fix agents against this plan"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-review/review/deep-review-findings-registry.json"
      - ".opencode/skills/cli-external/SKILL.md"
      - ".opencode/skills/mcp-tooling/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "131-hub-doc-conformance-fixes-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Vendored mcp-servers READMEs: REBUILD to conform, not exempt (operator decision)."
      - "Reality-drift findings: fix ALL, verify-first against live CLI/MCP before editing (operator decision)."
      - "SKILL.md routing blocks/INTENT_SIGNALS/RESOURCE_MAP/mode-registry stay out of scope, coordinated separately (operator decision)."
---
# Feature Specification: Hub Doc Conformance Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

A 10-iteration deep review (`130-hub-doc-conformance-review`, gpt-5.6-sol-fast) audited the `cli-external` and `mcp-tooling` hub docs and returned FAIL on every slice: 102 P0 / 5 P1 / 4 P2 findings raw across the 10 runs, deduplicated by the review's own findings registry to 67 P0 / 4 P1 / 2 P2 distinct, still-open finding IDs (73 total). This packet plans -- but does not perform -- the fix: it partitions all 73 findings into four collision-free, file-disjoint work-streams (WS-A ClickUp, WS-B cli-opencode/cli-claude-code, WS-C Figma/Chrome DevTools, WS-D cross-cutting root playbooks and test-oracle mechanics), defines a mandatory verify-first protocol for every reality-drift claim, and freezes the doc-layer/routing-layer scope boundary.

**Key Decisions**: Verify-first re-validation against live CLI/MCP truth before any edit (no reuse of the review's quoted output without a fresh check); file-path work-stream ownership with a narrow, collision-verified root-playbook carve-out for WS-D; SKILL.md routing blocks (INTENT_SIGNALS/RESOURCE_MAP/mode-registry) stay out of scope for every stream.

**Critical Dependencies**: `130-hub-doc-conformance-review/review/deep-review-findings-registry.json` and its 10 iteration narratives are the frozen evidence source; live CLI/MCP reachability (`cupt`, `figma-ds-cli`, `bdg`, Code Mode `tool_info()`/`list_tools()`) is required at fix time for the verify-first protocol.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `cli-external` and `mcp-tooling` hub docs (feature catalogs, testing playbooks, references, vendored server READMEs, SKILL.md prose) have drifted from the live CLI/MCP surfaces they document. Six dominant failure themes, ranked by finding volume: (1) reality-drift -- feature catalogs and playbooks describe CLI flags, MCP tools, and behaviors that no longer exist or behave differently (retired Code Mode callable prefix, tools absent from the live registry, wrong transport/auth config, `--json` treated as a global flag when it is per-command); (2) agent-routing docs teach forbidden `--agent` routes, cite nonexistent agents (`research`, `speckit`), and point Claude Code at the wrong runtime agent directory; (3) dead links and stale paths (a deleted uppercase root filename cited by 8 tables, dead relative source anchors across ~39 ClickUp playbook files, a stale spec-folder path); (4) playbook meta-claims are wrong (76-vs-46 scenario count, 13-vs-16 template count, a non-OpenCode runtime list that includes OpenCode); (5) four vendored `mcp-servers/**/README.md` files fail the sk-doc README schema outright (DQI 40-42); (6) test-scenario logic bugs (cross-shell PID waits, exit-code capture across separate Bash steps, invalid `&;` shell syntax).

### Purpose
Produce an actionable, collision-free remediation plan -- spec, plan, and tasks -- that a follow-up execution packet can dispatch as four parallel work-streams, each verifying every reality claim against live CLI/MCP truth before editing, so that a re-run of `130-hub-doc-conformance-review`'s scope moves from FAIL to PASS without a single file edited by more than one work-stream.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Authoring this packet's own `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md`.
- Mapping all 67 P0 / 4 P1 / 2 P2 distinct finding IDs (from `deep-review-findings-registry.json`, cross-checked against all 10 iteration narratives) to exactly one of four file-disjoint work-streams.
- Defining the verify-first re-validation protocol every reality-drift fix must follow.
- Defining the doc-layer/routing-layer scope boundary (SKILL.md prose in scope; INTENT_SIGNALS/RESOURCE_MAP/mode-registry.json out of scope, deferred to a coordinated routing-layer pass).
- Defining the vendored-README rebuild requirement (`clickup-cli`, `clickup-mcp`, `figma-cli`, `figma-mcp` READMEs conform to the sk-doc README schema, DQI >= 75) and the final re-run-deep-review gate.

### Out of Scope
- Actually editing any reviewed doc (feature catalog, playbook, reference, README, or SKILL.md) -- that is the follow-up execution packet's job, one dispatch per work-stream.
- Any SKILL.md routing block, `INTENT_SIGNALS`, `RESOURCE_MAP`, or `mode-registry.json`/`hub-router.json` entry -- owned by a separate, already-coordinated routing-layer agent (see `decision-record.md` ADR-003).
- Re-running the deep review itself -- this plan defines the re-run as a gate (Phase 3 of `tasks.md`); execution happens after the fixes land.
- Touching `.opencode/skills/cli-external/cli-opencode`'s or `cli-claude-code`'s runtime behavior, or any live CLI/MCP binary/config -- doc-only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `131-hub-doc-conformance-fixes/{spec,plan,tasks,checklist,decision-record}.md` | Create | The remediation plan itself -- the only files this packet writes. |
| `mcp-tooling/mcp-click-up/**` (WS-A target, ~120-140 files: `SKILL.md` prose, 2 vendored READMEs, `FEATURE_CATALOG.md`, ~90 `feature_catalog/` cards, ~40 `manual_testing_playbook/` files) | Modify (future execution phase) | Reality-drift, dead-link, and template-conformance fixes -- see `tasks.md` WS-A. |
| `cli-external/cli-opencode/**` + `cli-external/cli-claude-code/**` (WS-B target, ~35-40 files: references, assets, playbooks, README, root playbooks) | Modify (future execution phase) | Agent-routing, capability-comparison, dead-link, and test-oracle fixes -- see `tasks.md` WS-B. |
| `mcp-tooling/mcp-figma/**` + `mcp-tooling/mcp-chrome-devtools/**` (WS-C target, ~20 files: feature cards, references, 2 vendored READMEs, playbooks) | Modify (future execution phase) | Reality-drift and vendored-README fixes -- see `tasks.md` WS-C. |
| 4 hub root playbooks (`cli-claude-code`, `cli-opencode`, `mcp-click-up`, `mcp-chrome-devtools`) + 2 solo test-oracle files (WS-D target, 7 files) | Modify (future execution phase) | Verdict-vocabulary, coverage-count, and shell-mechanics fixes, carved out for pattern consistency -- see `tasks.md` WS-D. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every one of the 73 distinct findings (67 P0 / 4 P1 / 2 P2) from the deduped registry is mapped to exactly one work-stream, with zero file appearing in more than one work-stream's task list. | `tasks.md` enumerates all 73 finding IDs by title, file(s), and owning work-stream; the collision check in `plan.md` section 3 lists every file that carries more than one finding and names its single owner. |
| REQ-002 | The plan defines a mandatory verify-first protocol: every reality-drift finding (CLI flag, command shape, MCP tool name, output field, storage path, or behavior claim) is re-checked against the live tool/registry before editing, never patched from the review's quoted evidence alone. | `plan.md` section 2 states the 5-step protocol (probe, confirm-or-diverge, halt-if-unreachable, never-silently-delete) and every WS-A/B/C reality-drift task in `tasks.md` cites it. |
| REQ-003 | The plan explicitly excludes SKILL.md routing blocks, `INTENT_SIGNALS`, `RESOURCE_MAP`, and `mode-registry.json`/`hub-router.json` from every work-stream, deferring them to the already-coordinated routing-layer pass. | `plan.md` section 4 names the exact excluded block types; `decision-record.md` ADR-003 records the boundary and confirms (by finding-by-finding check) none of the 67 P0 findings requires editing an excluded block. |
| REQ-004 | Vendored `mcp-servers/**/README.md` files (`clickup-cli`, `clickup-mcp`, `figma-cli`, `figma-mcp`) are scheduled for full rebuild against the sk-doc README schema (not exemption), targeting DQI >= 75. | `tasks.md` WS-A and WS-C each carry an explicit rebuild task per README, citing `.opencode/skills/sk-doc/create-readme/assets/readme_template.md` as the target shape. |
| REQ-005 | This packet's own `validate.sh --strict` run returns 0 errors and 0 warnings. | Terminal `validate.sh .../131-hub-doc-conformance-fixes --strict` output shows `Errors: 0` and `Warnings: 0`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The plan defines a final gate that re-runs `130-hub-doc-conformance-review`'s scope after all four work-streams land, to prove the FAIL verdict lifts empirically rather than by assertion. | `plan.md` section 4 (Phase 3: Verification) and `tasks.md` Phase 3 both name the re-run gate, its target scope, and the pass bar (0 active P0 findings, or an explicit, operator-approved carry-over list). |
| REQ-007 | The plan records why the raw 102/5/4 finding count differs from the 67/4/2 deduped count, so a future reader does not treat the two figures as contradictory. | `spec.md` Problem Statement and `plan.md` section 1 both state the reconciliation (raw per-iteration self-reported sum vs. the review's own deduplicated findings registry). |
| REQ-008 | This packet's own `checklist.md` and `decision-record.md` satisfy the Level 3 template contract. | `checklist.md`'s Verification Summary shows every P0/P1 item complete or explicitly N/A; `decision-record.md` has 3 ADRs, each with a 5/5 Five Checks Evaluation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 73 distinct findings (67 P0, 4 P1, 2 P2) are enumerated in `tasks.md` with a title, file path(s), and a single owning work-stream, with zero fabricated finding IDs (every ID is traceable to an iteration narrative and/or the findings registry).
- **SC-002**: No file path appears as an editable target under more than one work-stream in `tasks.md`.
- **SC-003**: `plan.md`'s verify-first protocol and doc-layer-only scope boundary are explicit enough that a fix agent can execute a single work-stream (WS-A, WS-B, WS-C, or WS-D) without reading the other three streams' task lists.
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/131-hub-doc-conformance-fixes --strict` returns `Errors: 0` / `Warnings: 0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `130-hub-doc-conformance-review/review/deep-review-findings-registry.json` and its 10 iteration narratives (frozen evidence source) | High -- every task references these files | Cite exact finding IDs and file:line evidence pulled directly from the narratives; re-verify against live disk state, not the registry's cached line numbers, before editing. |
| Dependency | Live CLI/MCP reachability at fix time (`cupt`, `figma-ds-cli`, `bdg` binaries; ClickUp/Figma Code Mode `tool_info()`/`list_tools()`) | High -- the verify-first protocol requires it | If unreachable, the fix agent halts that specific finding and marks it BLOCKED with the reason; never fabricates a plausible-sounding answer. |
| Risk | A concurrent routing-layer agent edits the same `SKILL.md` file a doc-layer fix agent is also touching (prose vs. routing block) | Medium | Doc-layer fix agents edit only prose sections and explicitly skip routing blocks; `decision-record.md` ADR-003 records the coordination rule and the merge-order expectation. |
| Risk | WS-A's ClickUp transport/auth rewrite (R9-P0-001/R10-P0-001) targets whichever MCP deployment is checked into `.utcp_config.json` at fix time, which may have moved since the review's July 2026 snapshot | Medium | Verify against the live `.utcp_config.json` at fix time, not the review's cached snapshot. |
| Risk | Re-running deep review after the fixes reveals new findings instead of full convergence | Medium | `plan.md`'s final gate explicitly allows a second, smaller remediation pass; this plan does not claim one-shot completion. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each work-stream (WS-A/B/C/D) is scoped so one fix agent can complete it in a single bounded dispatch without needing cross-work-stream context.

### Security
- **NFR-S01**: The verify-first fix for R7-P0-002 (credentials described as encrypted but stored as plaintext YAML) documents the storage format honestly without printing an actual token value anywhere in the fixed doc.

### Reliability
- **NFR-R01**: `validate.sh --strict` returns 0/0 on this planning packet at hand-off; the execution packet re-runs it per work-stream, not only at the very end, so regressions surface incrementally.

---

## 8. EDGE CASES

### Data Boundaries
- A finding's cited line number has shifted because of an unrelated concurrent commit: the fix agent re-locates by content match (the quoted issue text), not a blind line-number replace.
- A finding's affected-file list ends mid-enumeration (e.g., `R3-P0-004`'s eighth file, `CO-034`, was not resolved to a confirmed filename during planning): the fix agent re-derives the exact file from the finding's own scope-proof text before editing, and does not guess.

### Error Scenarios
- Live CLI/MCP unreachable at fix time (binary not installed, MCP provider down): the verify-first protocol's halt-and-report path applies; the finding is marked BLOCKED, not silently skipped or guessed.
- A reality-drift finding's live-truth has changed again since the review ran (three-way drift): the fix agent documents the newly observed truth, not the review's now-stale quoted evidence.

### State Transitions
- A work-stream dispatch is interrupted mid-stream: `tasks.md`'s per-finding checkboxes are the resume point; no separate state file is required.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: ~180-200 across two large hub skills; LOC: high (feature catalogs + playbooks are the bulk of both hubs); Systems: 2 (cli-external, mcp-tooling), 5 child skills. |
| Risk | 15/25 | Auth: N (doc-only, no runtime code); API: N; Breaking: N -- but wrong live-reality claims can mislead operators into running rejected commands or trusting stale capability claims. |
| Research | 18/20 | Every reality-drift fix requires a fresh live CLI/MCP probe; verify-first is mandatory, not optional. |
| Multi-Agent | 12/15 | 4 parallel, file-disjoint work-streams plus 1 coordinating routing-layer agent. |
| Coordination | 10/15 | Must stay disjoint from a concurrently active routing-layer pass touching the same `SKILL.md` files. |
| **Total** | **77/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Verify-first CLI/MCP probe unavailable at fix time | M | M | Halt and report per finding; never guess. |
| R-002 | Doc-layer edit collides with a concurrent routing-layer edit to the same `SKILL.md` | H | M | Skip routing blocks explicitly; coordinate merge order per ADR-003. |
| R-003 | Vendored README rebuild invents a capability the real vendored package does not have | M | L | Verify-first against the actual vendored source before rebuilding. |
| R-004 | Re-running deep review after fixes reveals new findings, not full convergence | M | M | Final gate explicitly allows a second, smaller remediation pass. |

---

## 11. USER STORIES

### US-001: Work-stream self-sufficiency (Priority: P0)

**As a** fix agent assigned to one work-stream, **I want** a complete, deduped list of every finding my stream owns with its file(s) and required fix, **so that** I can execute my work-stream without re-reading the 10-iteration review narrative.

**Acceptance Criteria**:
1. Given `tasks.md`'s WS-A/B/C/D section, When I read it top to bottom, Then every finding my stream owns is present with its title, file(s), and a fix summary traceable to the source iteration.

### US-002: Doc-layer/routing-layer non-collision (Priority: P1)

**As the** operator, **I want** the plan to prove the doc-layer/routing-layer boundary is unambiguous, **so that** a concurrently dispatched routing-layer agent cannot collide with the fix agents this plan describes.

**Acceptance Criteria**:
1. Given `plan.md`'s coordination section, When I check any `SKILL.md` a work-stream touches, Then the plan states which sections (prose only) are in scope and which (routing block, `INTENT_SIGNALS`, `RESOURCE_MAP`) are explicitly out of scope.

---

## 12. OPEN QUESTIONS

- None blocking. One documented scope nuance: `R1-P1-001` (the shared 4-file vendored-README DQI-floor finding covering `clickup-cli`, `clickup-mcp`, `figma-cli`, `figma-mcp`) is intentionally split -- its ClickUp half is a WS-A task, its Figma half is a WS-C task -- because the four files live in two different hub subtrees; see `tasks.md` for the exact split.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Source Review**: `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-review/review/`
