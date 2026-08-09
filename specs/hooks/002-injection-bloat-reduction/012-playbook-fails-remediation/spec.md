---
title: "Design Specification: Manual Testing Playbook FAIL Remediation"
description: "Plan the three-track remediation of the 30 verified manual-testing-playbook FAILs, including repository fixes, machine-local operator actions, and justified SKIPs."
status: "remediation complete; re-run zero FAIL"
completion_pct: 100
trigger_phrases:
  - "manual playbook FAIL remediation"
  - "zero unresolved playbook fails"
  - "manual-testing-playbook remediation"
  - "playbook scenario reclassification"
  - "runtime playbook fail cleanup"
importance_tier: "critical"
contextType: "spec"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/012-playbook-fails-remediation"
    last_updated_at: "2026-08-09T05:04:50Z"
    last_updated_by: "claude"
    recent_action: "Reconciled packet to remediation-complete; re-run zero FAIL across all runtimes"
    next_safe_action: "None; packet complete — zero FAIL, all devin dispatches re-confirmed"
    blockers: []
    key_files:
      - ".opencode/specs/hooks/002-injection-bloat-reduction/011-playbook-results-automation/spec.md"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
      - ".opencode/skills/system-spec-kit/scripts/pi/sync-agents-pi.cjs"
      - ".opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs"
      - ".opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs"
      - ".opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts"
      - ".opencode/skills/cli-external-orchestration/cli-codex/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md"
      - ".opencode/skills/cli-external-orchestration/cli-pi/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/git-preflight-advisory/git-preflight-advisory.md"
      - ".opencode/skills/cli-external-orchestration/cli-devin/SKILL.md"
    session_dedup:
      fingerprint: "sha256:5a2f28e62f31d9d6dab6071f96eafff9c8b5b40b01d7de036fc1c84c71e5aa8a"
      session_id: "2026-08-08-hooks-002-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Design Specification: Manual Testing Playbook FAIL Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Remediation complete; re-run zero FAIL |
| **Created** | 2026-08-08 |
| **Parent Packet** | `hooks/002-injection-bloat-reduction` |
| **Predecessor** | `011-playbook-results-automation` |
| **Successor** | None |
| **Change Class** | Remediation design; no scenario, tool, or operator-state fix landed |
| **Authoritative Evidence** | Verified adversarial reconciliation of all 30 persisted FAIL records |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 011 wrapper run produced 30 manual-testing-playbook FAIL records across Codex, OpenCode, Pi, Cursor, and Devin. The verified reconciliation supersedes the first-pass investigation: 25 are stale playbook contracts, 3 are shipped-tool defects, and 2 are environmental outcomes. Its in-repo-fixability split is 20 repository fixes, 6 operator actions, and 4 outcomes that must become documented SKIPs.

Without a bounded remediation plan, the same failures remain mixed with valid runtime behavior, machine-local state, and stale assertions. That makes a later rerun unable to distinguish a repository regression from an unavailable TTY, unapproved MCP server, optional package, or upstream event limitation.

### Purpose

Define the smallest complete follow-on that updates every affected oracle, repairs the three shipped-tool defects, records the six machine-local prerequisites, reclassifies the four non-fixable cases to documented SKIP, and proves zero FAIL rows on the affected rerun.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A 30-row reconciled matrix mapping each FAIL to its verified final class, track, exact scenario file, and follow-on change.
- IN-REPO FIX work grouped by runtime and shared root cause, including Codex command/profile/child-state drift, OpenCode variadic `-f` ordering, Pi mirror and event/report identity bugs, Cursor Shell-hook delivery and roster drift, and Devin native-surface/lifecycle drift.
- OPERATOR-ACTION instructions for four layered Codex profile files, the Codex hook installation, and Cursor MCP approval. These actions are prerequisites, not committed repository changes.
- RECLASSIFY-TO-SKIP edits for the no-TTY review scenario, the cite-only or unavailable Pi MCP scenarios, and the unavailable headless Devin permission-event comparison. The Cursor trust scenario also records a conditional SKIP when approval is unavailable.
- A follow-on rerun of the affected runtime suites through the [011 manual scenario wrapper](../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs), using the [011 results contract](../011-playbook-results-automation/spec.md).
- A final assertion that affected `results.csv` rows contain only PASS or documented SKIP outcomes.

### Out of Scope

- Implementing any remediation or running the affected suites in this design-authoring packet.
- Writing or changing `~/.codex/config.toml`, `~/.codex/*.config.toml`, `~/.codex/hooks.json`, Cursor approval state, or any other operator machine-local configuration.
- Changing the normative D1-D5 scoring formulas or duplicating the [scoring contract](../../../../skills/system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md); the follow-on links to that authority.
- Rewriting unrelated manual scenarios, historical benchmark records, or the 011 wrapper/results schema.
- Treating a missing TTY, missing optional host, trust prompt, or unavailable upstream event as a repository defect.

### Files to Change in the Follow-On

| File Group | Change |
|-----------|--------|
| Runtime scenario files | Update the 30 exact scenario documents listed in `plan.md`; no scenario is left mapped only to a first-pass diagnosis. |
| Runtime skill/reference docs | Update Codex, OpenCode, Pi, Cursor, and Devin guidance where the scenario and shared contract must agree. |
| Shipped tools and mirrors | Repair Pi mirror/report identity behavior and the shared sk-git hook's Cursor payload handling; regenerate checked-in mirrors. |
| Validator/compiler tests | Enforce scenario-ID uniqueness and add Cursor payload coverage at the existing playbook and sk-git test seams. |
| Operator machine state | Not a repository change; apply the checklist in `plan.md` before rerun. |

### Contract Links

The follow-on must use 011's wrapper and persisted-results contract for outcome recording. It must link the scoring authority above and consume its output without copying scoring formulas into scenario docs or this packet.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every one of the 30 verified FAIL IDs is represented exactly once in the remediation matrix. | The matrix contains all manifest IDs, the verified final class, the verified in-repo-fixability bucket, one track, and one exact scenario path; no first-pass-only classification remains. |
| REQ-002 | Every IN-REPO FIX scenario and shared-tool defect has a concrete follow-on edit. | The Codex, OpenCode, Pi, Cursor, and Devin groups name the scenario file and each shipped skill, hook, mirror, validator, compiler, or test file required for the fix. |
| REQ-003 | The three verified TOOL-BUG cases are repaired at their owning production seams. | Pi mirror drift, Pi duplicate-ID/paired-handler behavior, and Cursor Shell/workspace-root hook delivery each have an owning source edit, test or sync check, and scenario update. |
| REQ-004 | Machine-local prerequisites are documented as operator actions and excluded from repository scope. | The four Codex profile migrations, Codex hook-installation reconciliation, and Cursor MCP approval have commands, expected state, rollback notes, and explicit non-repo status. |
| REQ-005 | Every non-fixable case becomes a justified documented SKIP. | CX-023, PI-011, PI-012, and DV-008 have scenario-level SKIP criteria with a named runtime/environment reason; CU-011 has the same fallback when approval is unavailable. |
| REQ-006 | The follow-on rerun reaches zero unresolved FAILs. | After repository fixes and required operator actions, affected suites run through 011 and every affected `results.csv` contains zero FAIL rows; allowed outcomes are PASS or documented SKIP. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Shared root causes are corrected once at the shared contract or production seam. | Codex child-dispatch guidance, profile guidance, the OpenCode argument-order rule, Pi identity checks, and Cursor hook payload handling are not fixed only in one scenario. |
| REQ-008 | Current runtime behavior is captured without overfitting to one transcript. | Weak parser/output claims retain raw stdout/stderr or stream events in the rerun evidence, and benign no-findings controls accept valid no-findings outcomes. |
| REQ-009 | The result remains aligned with the 011 persistence boundary and scoring authority. | Scenario outcome recording uses the wrapper/results contract link and scoring remains delegated to the linked authority. |
| REQ-010 | The remediation leaves no stale oracle that recreates an already-fixed FAIL. | Follow-on searches and validator/synchronizer checks find no removed Codex flags, obsolete profile sections, literal roster counts, unsupported Devin command mirrors, duplicate scenario IDs, or the old Cursor proxy claim in the affected surfaces. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The affected runtime suites are rerun through 011's wrapper after repository fixes and operator actions, and the union of affected `results.csv` rows contains **0 FAIL** outcomes.
- **SC-002**: The 30 verified IDs resolve to PASS or documented SKIP, with no missing, duplicate, or first-pass-only classification.
- **SC-003**: The four no-becomes-SKIP cases record specific reasons: unavailable TTY, unavailable or unapproved optional MCP evidence, unverified streamable HTTP, and unavailable headless Devin permission events.
- **SC-004**: Pi mirror sync, Pi scenario-ID/paired-handler validation, and Cursor Shell hook payload tests pass before the full rerun.
- **SC-005**: Operator-only state is absent from the repository diff and the documented machine checklist is complete before execution begins.
- **SC-006**: The rerun evidence retains raw output where the verified reconciliation marked parser, output-channel, or upstream behavior as unproven.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Codex profile-v2 files and installed hook state | Profile and hook scenarios cannot pass until local state matches current Codex behavior | Apply the operator checklist; keep machine-local edits out of the repo diff |
| Dependency | 011 wrapper/results contract | A rerun outside the wrapper would not produce authoritative persisted outcomes | Use the wrapper and assert the affected `results.csv` rows |
| Risk | First-pass diagnosis is reused after verification corrected it | A valid current behavior could be changed or scored as a defect | Treat the verified reconciliation table as authoritative and cite the first pass only as subordinate context |
| Risk | Shared-hook repair changes Claude/Codex behavior while fixing Cursor | A Cursor fix could regress existing `bash`/`exec` delivery | Preserve existing payload branches, add `shell` and `workspace_roots[0]`, then run cross-runtime hook checks |
| Risk | Cite-only or trust-gated scenarios are forced into live execution | Operator actions could mutate trust or install an optional package without authorization | Pin existing evidence or record documented SKIP; never install or approve from the scenario |
| Risk | Runtime output channels drift again | A text-only oracle can fail while the runtime remains correct | Retain raw stdout/stderr or stream events and assert only documented channels |
| Constraint | Historical report records lack raw transcripts and CLI provenance | Some first-run observations cannot be independently reconstructed | Preserve fresh rerun evidence before interpreting any parser/output result |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reproducibility

- **NFR-R01**: Each affected scenario has one deterministic command sequence, one explicit environment prerequisite, and one binary PASS/FAIL/SKIP oracle.
- **NFR-R02**: The rerun uses the same 011 wrapper and persists evidence before the result is accepted.

### Safety

- **NFR-S01**: No scenario performs machine-local trust approval, optional package installation, or profile migration implicitly.
- **NFR-S02**: TTY-only, cite-only, and unavailable-event cases fail closed to documented SKIP rather than fabricated PASS.

### Maintainability

- **NFR-M01**: Shared runtime behavior is corrected at the owning skill, hook, mirror, validator, or compiler seam before scenario-local wording is updated.
- **NFR-M02**: Scenario docs link the scoring/results authorities instead of duplicating their contracts.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Machine State

- Missing layered Codex profile: operator creates the named file or the profile scenario remains blocked and is not reported as a repository PASS.
- Stale Codex hook installation: operator reconciles the installation check before hook scenarios run.
- Unapproved Cursor MCP: operator approves the selected identifier, or the scenario records a trust-state SKIP.

### Runtime Capability

- No TTY: CX-023 records SKIP; its noninteractive `exec review` behavior is not scored as the TUI contract.
- Missing Pi optional host: PI-011 and PI-012 use pinned evidence or documented SKIP; no package install is inferred.
- Missing Devin permission event: DV-008 records the current-version limitation as SKIP and keeps PreToolUse evidence separate.

### Data Integrity

- Duplicate scenario ID: the playbook validator/compiler blocks the package before report association.
- Stale mirror: Pi and runtime-mirror checks report drift before the full suite.
- Benign review fixture: CX-003 accepts a valid no-findings result or uses a deterministic defective diff; it does not require invented findings.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 21/25 | 30 scenario outcomes across five runtimes plus shared tools and docs |
| Risk | 18/25 | Hook delivery, machine-local trust/config, report identity, and full-suite regression exposure |
| Research | 15/20 | Verified adversarial reconciliation overrides first-pass root causes; fresh rerun evidence remains required |
| **Total** | **54/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No design question blocks the follow-on. The implementation pass must confirm the selected Cursor MCP identifier, the operator-approved Codex profile values, and the available TTY/evidence paths at execution time. Those are execution inputs, not reasons to alter the verified classification.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

| Document | Relationship |
|---|---|
| [`plan.md`](./plan.md) | Exact 30-row runtime matrix, grouped implementation sequence, and operator checklist |
| [`tasks.md`](./tasks.md) | Follow-on work groups by runtime, shared tool, operator action, SKIP, and rerun |
| [`checklist.md`](./checklist.md) | Evidence-bearing acceptance checks for design, fixes, operator state, and zero-FAIL rerun |
| [`implementation-summary.md`](./implementation-summary.md) | Design-authored state; remediation remains pending |
| [`011-playbook-results-automation`](../011-playbook-results-automation/spec.md) | Predecessor wrapper/results contract |
| [`scoring-contract.md`](../../../../skills/system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md) | Normative scoring authority used by the rerun |
<!-- /RELATED DOCUMENTS -->
