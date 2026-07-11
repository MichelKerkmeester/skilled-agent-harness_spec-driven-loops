---
title: "Feature Specification: Phase 002 - Transport and Negative-Control Dispatches"
description: "Real cli-opencode dispatch of 5 sk-design manual_testing_playbook scenarios (MR-007, AI-002, AI-003, AI-004, SR-001) covering the Open Design transport mode and four advisor-integration negative/positive controls, graded strictly against each scenario file's own Pass/Fail Criteria."
trigger_phrases:
  - "wave 002 transport and negative controls"
  - "phase 023 wave 002 sk-design"
  - "MR-007 AI-002 AI-003 AI-004 SR-001"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/002-transport-and-negative-controls"
    last_updated_at: "2026-07-07T15:15:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec.md"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, implementation-summary.md, dispatch-log.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "playbook-wave-002-transport-negative"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 002 - Transport and Negative-Control Dispatches

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 023's parent scoped this child wave to 5 dispatches spanning two different playbook categories: the Open Design transport mode's routing contract (`MR-007`) and four advisor-integration boundary checks (`AI-002`, `AI-003`, `AI-004`, `SR-001`) that prove `sk-design` neither false-fires on pure-code/documentation/backend-review prompts nor skips its own mandatory shared-resource loading contract when it does legitimately win. None of these 5 scenarios had ever been exercised with a real `cli-opencode` dispatch before this wave — only the automated Lane C benchmark's routing-analysis-only wrapper, which cannot observe real tool-call sequences, real mutations, or real resource-loading discipline.

### Purpose

Run the validated advisor-probe-then-real-dispatch recipe for all 5 assigned scenarios, capture the full JSON-lines transcript of each real dispatch, and grade each strictly against that scenario file's own Pass/Fail Criteria section — never a generic bar.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Advisor probe (`skill_advisor.py --threshold 0.8`) for each of the 5 clean exact prompts.
- Real `opencode run --model openai/gpt-5.5-fast --variant medium` dispatch for each of the 5 prompts, with the standalone-evaluation addendum appended verbatim per the validated recipe.
- Capture of the full JSON-lines transcript per dispatch under `/tmp/skd-<id>-response.jsonl`.
- Strict grading of each dispatch against its own scenario file's Pass/Fail Criteria, citing the specific criterion line.
- Detection, documentation, and (where safely reversible and unambiguously out of scope) reversal of any unintended repo/machine mutation a dispatch produced as a side effect of a routing test.

### Out of Scope

- Fixing anything a dispatch reveals as broken in `sk-design`'s own routing, resource-loading, or the shared `skill_advisor.py` scorer — this wave records findings only; remediation is a follow-up phase's decision (per the phase-023 parent's own Out of Scope).
- Re-litigating phase 018/019's transport architecture or phase 021/022's validator/coverage-fill work.
- The other 9 sibling waves' dispatches (`001`, `003`-`010`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/002-transport-and-negative-controls/*.md` | Create | This wave's Level 2 spec-folder docs |
| `/tmp/skd-{MR007,AI002,AI003,AI004,SR001}-advisor.txt` | Create | Advisor probe outputs (ephemeral, outside repo) |
| `/tmp/skd-{MR007,AI002,AI003,AI004,SR001}-response.jsonl` | Create | Real dispatch transcripts (ephemeral, outside repo) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 assigned scenario IDs get a real dispatch | 5/5 transcripts captured under `/tmp/skd-*-response.jsonl` |
| REQ-002 | Every verdict traces to that scenario's own Pass/Fail Criteria | `dispatch-log.md` cites the specific criterion line per verdict |
| REQ-003 | Any unintended out-of-scope repo mutation caused by a dispatch is detected and, when safely and unambiguously reversible, reverted | `git status --short` scoped-check run after every dispatch; reverted files confirmed clean |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Dispatches run strictly one at a time (no self-parallelization) | Sequential Bash invocations confirmed in this document's own execution trace |
| REQ-005 | Out-of-repo machine-config side effects are flagged, not silently reverted, when reverting carries its own ambiguity/risk | `MR-007`'s `~/.config/opencode/opencode.json` mutation documented with exact diff and rollback path, left for operator review |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** all 5 dispatches complete, **Then** each has a PASS/PARTIAL/FAIL verdict citing the scenario file's own criterion line in `dispatch-log.md`.
- **SC-002**: **Given** any dispatch caused an in-repo file mutation outside this wave's documentation scope, **Then** it is reverted and confirmed clean via `git status --short`.
- **SC-003**: **Given** validation runs on this folder, **Then** `validate.sh --strict` returns Errors:0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A dispatch treats a prompt as a real actionable task and produces real file mutations, not just routing analysis | Realized | `AI-002`'s dispatch actually implemented the requested TypeScript refactor in `deep-loop-runtime/lib/deep-loop/executor-config.ts` and its test; detected via `git status --short` and reverted via `git restore` |
| Risk | A dispatch mutates state outside the git repo (real machine config), where `git restore` offers no safety net | Realized | `MR-007`'s dispatch used `apply_patch` to wire an `open-design` MCP server entry into `~/.config/opencode/opencode.json` (previously an empty `mcp: {}`); documented with exact diff, left in place pending operator decision (see Known Limitations) |
| Dependency | Validated Gate-3-bypass dispatch recipe from the phase-023 parent (smoke-tested 5x before this phase started) | High | Recipe followed verbatim, no deviation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `~/.config/opencode/opencode.json`'s `open-design` MCP entry (added by `MR-007`'s dispatch) be reverted to the prior empty `mcp: {}` state, or kept? It is a real, functional wiring of the user's actually-installed Open Design app, but it was an unrequested side effect of a routing test, and it changes the baseline every other sibling wave's `cli-opencode` dispatch runs against (since it is a global, not per-repo, config file). Left un-reverted pending operator review — see Known Limitations in `implementation-summary.md`.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The advisor-probe-then-real-dispatch-then-strict-grading pattern used here is the same reusable precedent phase 023's parent hands to every sibling wave; no wave-local deviation was introduced.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- A prompt phrased as an imperative, actionable code/config task (`AI-002`, `MR-007`) is executed for real by the dispatched orchestrator even when the addendum frames the exchange as "standalone evaluation... not a tracked change" — that framing only suppresses spec-folder documentation (Gate 3), it does not suppress the underlying action. Both realized cases are documented as findings, not silently absorbed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 5 real dispatches + strict grading + spec-folder docs |
| Risk | 10/25 | Two dispatches produced real, unrequested side effects (one in-repo, one out-of-repo) requiring detection and remediation judgment |
| Research | 6/20 | Per-dispatch transcript parsing against each scenario's own named resource-loading requirements (e.g. `design-interface/SKILL.md`'s Resource Loading Levels table) |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None beyond section 7.

---

## RELATED DOCUMENTS

- **Phase Parent**: `../spec.md` (`023-full-manual-playbook-execution`)
- **Sibling Waves**: `../001-mode-routing-core/`, `../003-advisor-positive-controls/`, etc.
- **Scenario Sources**: `.opencode/skills/sk-design/manual_testing_playbook/mode-routing/mcp-open-design-mode.md`, `.opencode/skills/sk-design/manual_testing_playbook/advisor-integration/{pure-code-routes-skcode,doc-write-routes-elsewhere,code-review-routes-skcode}.md`, `.opencode/skills/sk-design/manual_testing_playbook/shared-reference-base/interface-shared-references.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Dispatch Log**: See `dispatch-log.md`
