---
title: "Feature Specification: Cross-CLI Manual Testing of the Advisor Refinements"
description: "Phases 2 to 7 changed the advisor hook path, its fallback, the CLI and the plugin, and their playbook scenarios had only been run from Claude Code. This phase runs every related scenario inside five other CLIs, each with a different model, and records what each runtime's own hook delivers. Cursor needed Grok 4.7 on its enforced allowlist first."
trigger_phrases:
  - "cross cli manual testing"
  - "advisor scenarios in every cli"
  - "grok 4.7 cursor allowlist"
  - "native host advisor evidence"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Cross-CLI Manual Testing of the Advisor Refinements

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-docs-and-standards-alignment |
| **Successor** | None |
| **Handoff Criteria** | Every related scenario has a verdict from each of the five CLIs, every FAIL has been rerun or traced by the orchestrator, and each runtime's native hook evidence is recorded separately from the scenario verdicts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Pi skill orchestrator research for skill advisor refinement specification. It tests what phases 2 to 7 built from inside every CLI runtime the advisor serves.

**Scope Boundary**: The nine playbook scenarios that exercise changed logic, run once in each of five CLIs, plus a casual-prompt probe per CLI. The Grok 4.7 allowlist addition is a prerequisite the operator chose so Cursor could run the model they named.

**Dependencies**:
- 007-docs-and-standards-alignment, hard. The scenarios under test are the versions phase 7 corrected.

**Deliverables**:
- `evidence/` with one report per CLI and scenario, the dispatch ledger and the native diagnostics records
- Grok 4.7 on the cli-cursor allowlist, in code and docs
- A results matrix in `implementation-summary.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor hook reaches seven runtimes, and each wires it differently: Claude, Codex, Cursor and Devin through spec-kit hook adapters, OpenCode through a plugin that calls the CLI, and Pi through an in-process extension. The playbook scenarios for the refined hook path were written and run from Claude Code only, so nothing shows the fallback, the prompt gate or the runtime label working where the other runtimes deliver them.

### Purpose
Every related scenario has a verdict from inside each CLI, and each runtime's own delivery of the advisor is observed rather than assumed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Scenarios CL-001, CL-005, CL-006, CP-003, CP-004, NC-001 and NC-004 from the advisor playbook, and 433 and 457 from the spec-kit playbook.
- Five executors, as the operator named them: MiMo v2.6 Pro high through cli-pi and cli-opencode, SWE-2 high through cli-devin, Grok 4.7 high through cli-cursor and GPT-6 Luna high through cli-codex.
- A casual-prompt probe (`thanks`) through each hook-bearing CLI, read from the advisor's diagnostics log.
- Adding the eight Grok 4.7 ids to the cli-cursor allowlist, after each one passes a live dispatch.

### Out of Scope
- The deep-review fan-out scenarios. Each starts a nested multi-model `/deep:review`, which Codex cannot nest and OpenCode must not. Phase 6 ran that path live and closed it.
- Fixing anything the tests find. Findings go to the operator.
- Mapping "Use Grok" to Grok 4.7. It still resolves to Grok 4.6 high.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `evidence/` | Create | Per-CLI scenario reports, the dispatch ledger and diagnostics excerpts |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Grok 4.7 ids in `CURSOR_SUPPORTED_MODELS` |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | The same ids in its mirror `CURSOR_ALLOWED_MODELS` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | The 29-id allowlist assertion |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | The accepted-model list |
| `.skilled/skills/cli-external-orchestration/cli-cursor/` | Modify | Roster, counts and a changelog entry for Grok 4.7 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every in-scope scenario runs in all five CLIs | The ledger holds 45 scenario dispatches with a report for each |
| REQ-002 | No run touches shared state | No run stops the daemon, moves the live database or writes outside its evidence directory, checked in the diff after the runs |
| REQ-003 | Grok 4.7 is allowlisted only after a live dispatch | Each of the eight ids returned a model response with exit 0 before the code changed, and the allowlist tests pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Every FAIL is checked by the orchestrator | Each is rerun or traced to a cause, and marked as a code defect, a scenario defect or an environment limit |
| REQ-005 | Native delivery is recorded per runtime | Each CLI has a diagnostics record or a model-visible Advisor line, or a named reason it has neither |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator can see, for each CLI, which advisor behaviors work there, with the evidence behind each verdict.
- **SC-002**: A FAIL names whether the code, the scenario or the environment is at fault.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Two runs contend for the shared daemon or test temp directories | Med | Two at a time, sandbox sockets where a scenario allows, and every FAIL rerun alone |
| Risk | Codex runs with danger-full-access, approved by the operator for this run | Med | The brief bans repo writes outside its evidence directory, and the orchestrator checks the diff |
| Dependency | LLM Gateway, ChatGPT, Devin and Cursor accounts | A CLI cannot run | Auth pre-flight passed for all five before the first dispatch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose to add Grok 4.7 to the allowlist, approved danger-full-access for Codex and set two dispatches at a time.
<!-- /ANCHOR:questions -->

---
