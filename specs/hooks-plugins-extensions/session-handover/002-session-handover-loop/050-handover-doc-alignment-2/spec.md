---
title: "Feature Specification: Hand-over doc alignment, second pass: fix the 50 findings of the full 86-doc check"
description: "A second doc alignment run, this time completing all 86 hand-over docs, found 50 statements that no longer match the code: four playbook and README commands that fail, Pi arming on the wrong event, OpenCode 2 model carry and Vibe left out of arm and withdraw lists. This packet fixes them."
trigger_phrases:
  - "handover doc alignment second pass"
  - "hand-over doc alignment 050"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Hand-over doc alignment, second pass: fix the 50 findings of the full 86-doc check

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/431-handover-doc-alignment-2` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The first doc alignment run left nine docs unreviewed after a lane timed out, so a second `/local-doc-alignment session-handover` run used six DeepSeek Flash lanes with a 60-minute limit and finished all 86 docs. It recorded 50 findings after the critic: 4 P0, 13 P1 and 33 P2. The P0s are commands a reader runs that fail: an OpenCode 2 quick-start with a `-m` flag the root command lacks, a history-lookup build step that builds the wrong package, and two playbook probes whose notes lack the `Running workers:` line `prepare` now requires.

### Purpose
Every finding is fixed in its doc or shown wrong by the code, and the hand-over docs describe Pi's `agent_settled` arm, OpenCode 2's model carry and Vibe's arm and withdraw paths as the code runs them.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/commands/assets/local-skilled-alignment/aggregate-findings.cjs --run-dir ~/.local/state/local-doc-alignment/Skilled/20261116T100930Z --map .skilled/commands/assets/local-doc-alignment/doc-map.yaml
STATUS=OK aggregate-findings: findings=50 P0=4 P1=13 P2=33 inferred=0 outside_scope=0 overturned=0 problems=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix the 50 findings in their 25 docs through DeepSeek V4.1 Flash at max, one brief per doc area, run one at a time.
- Review every changed line with a fresh Opus medium agent and fix what it confirms through DeepSeek.
- Verify with the hand-over suites, the drift guards and strict validation.

### Out of Scope
- Code changes. Every finding is a doc statement; where the code and a doc disagree, the doc changes.
- Clearing `AI_SESSION_CHILD` in the test sandboxes, which stays a known limitation from packet 049.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Session-handover docs under `.skilled/hooks/` | Modify | Quick start, runtime behavior, hand-over protocol, troubleshooting, state files, coverage |
| System-spec-kit catalog, playbooks and README | Modify | Probe notes, Pi arm event, OpenCode 2 model carry, lookup command |
| Root README, `.skilled/bin/README.md`, `speckit/handoff.md`, runtime READMEs | Modify | Build step, command names, wrapper behavior |
| cli-pi, cli-deepseek-harness and cli-mistral-vibe docs | Modify | Guard claims, prompt names, hop history |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every finding is fixed in its doc or shown wrong by the code | Each of the 50 findings is fixed, or its NOT FIXED reason is confirmed against the code |
| REQ-002 | The four P0 commands work as written | The OpenCode quick start, the history-lookup build step and the CL-6 and CX-4 probe notes match the code's requirements |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A fresh Opus medium review finds no unfixed P0 or P1 | The review result and the fixes for what it confirmed are recorded |
| REQ-004 | No code or unrelated file changes | `git diff --stat` lists only the 25 docs and this packet |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 50 findings are fixed or refuted with code evidence.
- **SC-002**: The hand-over suites and drift guards pass on the final merged tree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Main moved 50 commits after the check | A statement may already be fixed or moved | Briefs find each statement by its text and report one already fixed |
| Risk | A model-written fix states something new that is also wrong | A doc trades one false claim for another | A fresh Opus medium review reads every changed line against the code |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: docs only, no service.

### Security
- **NFR-S01**: N/A: no code, credential or permission surface changes.

### Reliability
- **NFR-R01**: Every command a changed doc tells the reader to run matches the code's current flags, paths and note format.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a finding whose statement is already gone is reported as already fixed, with no edit.
- Maximum input: two findings on one sentence get one edit that fixes both.
- Failure path: a finding the code refutes is left unchanged and reported with its evidence.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | 25 docs, no code |
| Risk | 6/25 | Docs only; playbook commands checked against the code |
| Research | 8/20 | Each finding verified against the code before its fix |
| **Total** | **27/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
