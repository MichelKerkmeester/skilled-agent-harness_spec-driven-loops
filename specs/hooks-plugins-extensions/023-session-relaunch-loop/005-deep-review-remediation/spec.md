---
title: "Feature Specification: Phase 5: deep-review-remediation"
description: "Fix the twelve P2 advisories the deep review found in the session relaunch loop, align the new code with sk-code-opencode and refresh the docs the fixes touch."
trigger_phrases:
  - "deep review remediation"
  - "phase 5 deep review remediation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: deep-review-remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-18 |
| **Branch** | `worktrees/142-session-relaunch-loop` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-integration-review-and-docs-closure |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and recursive strict validation of the parent passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Session relaunch loop specification.

**Scope Boundary**: The twelve findings in `../review-archive/20261018T184826Z/review-report.md` section 3, an sk-code-opencode alignment pass over the code the packet added or changed, and the docs those changes touch. The final review wave added the open items listed under In Scope, which also fix Pi and sk-doc behavior. No new runtime or trigger.

**Dependencies**:
- `../review-archive/20261018T184826Z/review-report.md`, the deep review of phases 001 to 004 (verdict PASS with advisories, 0 P0, 0 P1, 12 P2).

**Deliverables**:
- A test and a fix for every code finding, and a corrected line for every doc finding.
- An alignment review of the packet's code against the sk-code-opencode checklists, with each finding fixed.
- Updated code READMEs, playbook scenarios, catalog entries and skill docs wherever a fix changes what they say.
- The open items from the final review wave, each closed here or handed to its owning packet with a pointer (`specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:459`).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep review passed the loop but left twelve advisories. Four sit on the killer and log path: a log line can be lost under concurrent writers, an unreadable transcript aborts the killer, stale-lock takeover is not atomic, and the killer creates its state directory without the 0700 mode. Four more are helpers copied across five adapters that have drifted, plus a Claude arm that can spawn a second killer. The rest are an unbalanced seed suffix and docs that state the wrapper exit contract backwards.

### Purpose
Every advisory is fixed and tested, the code reads as sk-code-opencode code, and the docs describe what the code does.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- WS1 killer and log safety: R1-P2-001, R1-P2-003, R2-P2-001, R2-P2-002.
- WS2 shared adapter helpers: M4-P2-001, M4-P2-002, M4-P2-003, M5-P2-001.
- WS3 seed suffix text: R1-P2-002, with the old suffix still accepted when a relaunched session reads an older note or seed.
- WS4 docs and evidence: F7-P2-001, T3-P2-001, T3-P2-002.
- An sk-code-opencode alignment review of the packet's code and a fix for each finding it confirms.
- Doc updates through the matching sk-doc mode wherever a fix changes documented behavior.
- Final review wave open items (`specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:459`): the 001 plan halts heading and its cross-references, the 004 AC-005 citation split, the Pi Fast Mode duplicate guard, the sk-doc README checklist `no_toc` rule, the session-relaunch tests README, and the refreshed durable directory manifest.
- Deep-loop reducer and verifier fixes from the same wave, owned by `specs/system-deep-loop/038-review-and-cli-lineage/009-findings-summary-integrity/`, which carries their evidence (`specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:464`).

### Out of Scope
- The frozen parent decisions D2 (80% trigger), D3 (seed carry) and D4 (command-only runtimes) - they are not findings.
- New runtimes, triggers or live runs - no finding needs one.
- Code outside the packet's changed paths - scope lock.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | Append-only log, shared adapter helpers, balanced Skip suffix |
| `.skilled/hooks/session-relaunch/lib/killer.cjs` | Modify | Guarded transcript stat, atomic lock takeover, state dir through `ensureStateDir` |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | Accept both Skip suffix spellings |
| `.skilled/hooks/session-relaunch/{claude,codex,hermes,opencode,pi}/*` | Modify | Use the shared helpers; Claude arm skips an armed record |
| `.skilled/hooks/session-relaunch/**/*.test.*` | Modify/Create | One test per code finding |
| `.skilled/bin/skilled-loop` | Modify | Balanced Skip suffix |
| `.skilled/bin/README.md`, `.skilled/hooks/session-relaunch/README.md` | Modify | Wrapper exit contract and suffix text |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md` | Modify | Wrapper exit contract |
| `../003-command-trigger-runtimes/tasks.md`, `../scratch/contracts/interface-contract.md` | Modify | Evidence pointers and superseded relaunch order |
| `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts`, `tests/extension.test.ts`, `README.md`, `src/README.md`, `tests/README.md` | Modify | Duplicate guard yields to an existing global install, with the agent dir read through Pi's `getAgentDir()` |
| `.skilled/skills/sk-doc/shared/scripts/extract_structure.py`, `.skilled/skills/sk-doc/scripts/tests/test_extract_structure_regressions.py` | Modify | README checklist rule `has_toc` renamed to `no_toc` |
| `.skilled/hooks/session-relaunch/tests/README.md` | Create | Tests folder README for the durable session-relaunch folder |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Modify | Refreshed to list the session-relaunch folder and its tests folder |
| `../001-claude-relaunch-loop/plan.md`, `../004-integration-review-and-docs-closure/plan.md`, `../004-integration-review-and-docs-closure/acceptance-criteria.md` | Modify | Halts heading and cross-references in 001 and 004, and the AC-005 citation split in 004 |
| `specs/system-deep-loop/038-review-and-cli-lineage/009-findings-summary-integrity/` | Owned elsewhere | Deep-loop reducer and verifier fixes, with their evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | WS1: the log append keeps every line under concurrent writers, the killer gives up cleanly on an unreadable transcript, stale-lock takeover lets only one killer win, and the killer's state directory is 0700 and owned by the user. Each has a test that fails before the fix. |
| REQ-002 | WS2: `plannedNotePath`, the threshold resolution and the seed parser each have one definition in the core that every adapter uses, and the Claude arm leaves an already-armed record and its killer alone. |
| REQ-003 | WS3: both printers emit a Skip suffix with balanced parentheses, and the parser accepts the new and the old spelling. |
| REQ-004 | WS4: the README and the playbook state the wrapper exit contract that `skilled-loop` implements, the phase 003 evidence pointers resolve to their content, and the contract marks its superseded relaunch order. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The packet's code passes an sk-code-opencode alignment review with every confirmed finding fixed, and the drift guards exit 0. |
| REQ-006 | Every doc whose statement a fix changes is updated through its sk-doc mode and passes that mode's validators. |
| REQ-007 | The full gate from phase 004 reruns at its baseline or better, and recursive strict validation of the parent passes. |
| REQ-008 | Every open item from the final review wave (ledger entries D164 to D177 and the two open-item lines above D164) is closed here or handed to its owning packet with evidence, and the final gate is at or above baseline. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All twelve finding ids are fixed, each code fix with a named test.
- **SC-002**: The final gate is at or above the phase 004 baseline: node 328, pytest 62, Pi vitest 14, registration vitest 7, tsc 0, shellcheck 0, drift guards 4/4.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-devin `swe-2-max` | Builds and reviews stop if Devin is down | Codex quota is out until Oct 22, so SWE builds and a fresh SWE session reviews (parent D5) |
| Risk | Changing the Skip suffix breaks a seed already in flight | Med | The parser keeps the old suffix; a test covers it |
| Risk | Lock takeover change lets two killers signal | High | Tests run two takeovers at once and assert one winner |
| Risk | Shared helper changes adapter path resolution | Med | Adapter tests pin the resolved path per runtime before the change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The Pi adapter resolves its threshold once per session, not per event.

### Security
- **NFR-S01**: The killer never signals a process that is not a descendant of the wrapper, and only one killer acts on a loop at a time.
- **NFR-S02**: The state directory is mode 0700 and owned by the current user wherever it is created.

### Reliability
- **NFR-R01**: No `relaunch.log` line is lost when the wrapper and a killer write at the same moment.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A seed with the old unbalanced Skip suffix still parses as Skip.
- A seed with no spec-folder suffix still asks Gate 3.

### Error Scenarios
- Transcript deleted or unreadable while the killer waits: give up, un-arm, notify.
- Lock file removed between the stale check and the takeover: the takeover loses cleanly.

### State Transitions
- Stop fires twice on the same pending or armed record: one arm, one killer.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 20 files across lib, five adapters, the wrapper, tests and docs |
| Risk | 12/25 | Process signalling and lock handling |
| Research | 4/20 | Every finding is already located and confirmed |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Every finding is confirmed against its file and line.
<!-- /ANCHOR:questions -->
