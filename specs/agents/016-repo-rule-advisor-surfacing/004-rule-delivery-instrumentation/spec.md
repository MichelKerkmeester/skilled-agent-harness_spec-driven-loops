---
title: "Feature Specification: Rule delivery instrumentation"
description: "Nothing records whether a session needed a repo rule and had it. Build an offline, aggregates-only analyzer over local Claude Code and Codex transcripts that reports Gate 5 misses, §8 reply-rule misses, rule delivery per compaction window and violation rates per rule version, with no runtime hook and no context cost."
trigger_phrases:
  - "rule delivery instrumentation"
  - "gate 5 miss rate"
  - "reply rule miss rate"
  - "rule compliance analyzer"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Rule delivery instrumentation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-10-04 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 8 |
| **Predecessor** | 003-agents-md-delivery-prefix |
| **Successor** | 005-trigger-coverage-check |
| **Handoff Criteria** | Baseline report committed under `baselines/` before phase 006 changes any rule |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the repo rule surfacing, concision and loading specification.

**Scope Boundary**: An offline analyzer and its tests. No hook, no change to any rule or instruction file.

**Dependencies**:
- `002-rule-concision-and-loading/prep/measure-rule-compliance.py`, the starting point

**Deliverables**:
- `measure-rule-compliance.py` promoted into `sk-create-repo-rule/scripts/` with the new measures
- pytest suite with synthetic transcripts
- A committed baseline report

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The evidence pack counts a rule as read only when the `Read` tool named its path, so shell reads and hook injections are missed and the counts undercount (`002-rule-concision-and-loading/prep/evidence-pack.md` §2). It has no denominator of sessions that needed a rule, covers Claude Code only, and lives untested in a spec folder. Phases 007 and 008 and any future hook decision need delivery receipts, eligible actions, compaction windows and the rule version that was live.

### Purpose
One command reports, per runtime and with denominators and intervals, how often a session needed a repo rule and did not have it, and how each prohibition fared under each rule version.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Promote the script to `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/measure-rule-compliance.py`
- Delivery receipts from three channels: `Read` calls, shell commands that name a rule path, and hook-injected context
- Compaction windows from transcript boundary records
- Gate 5 eligibility and misses, and §8 reply-rule eligibility and misses
- Rule version per reply from `git log` of the governing rule file
- A requested-table split and Wilson 95% intervals
- A Codex session adapter
- A baseline report committed in this phase's `baselines/`

### Out of Scope
- A runtime observer hook - build one only if a runtime the experiments need keeps no transcript; Devin, Cursor, OpenCode and Pi are UNKNOWN and a probe in T002 records which
- Any output that carries transcript text - aggregates only
- Task categories beyond write versus read-only sessions - no reliable signal exists

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/measure-rule-compliance.py` | Create | Promoted and extended analyzer |
| `.skilled/skills/sk-doc/scripts/tests/test_measure_rule_compliance.py` | Create | pytest with synthetic JSONL fixtures |
| `.skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md` | Modify | List the script in the mode's resources |
| `baselines/` | Create | Aggregates-only baseline report |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Output carries aggregates only. A test asserts that no fixture transcript string reaches the output |
| REQ-002 | Reports the Gate 5 miss rate (first non-exempt write with no `REPO RULES.md` delivery before it) and the §8 miss rate (first substantive reply in a compaction window with `communication.md` or `communication-prose.md` not delivered in that window), each per runtime with its denominator |
| REQ-003 | Counts delivery receipts by channel and reports distinct rules per compaction window |
| REQ-004 | Splits each prohibition check by the governing rule's git blob version live at the reply's timestamp |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Reads Codex session JSONL as well as Claude Code transcripts |
| REQ-006 | Reports a Wilson 95% interval for every rate |
| REQ-007 | Reports tables in replies where the user asked for a table, or the reply is a document being written, separately from other tables |
| REQ-008 | Commits a baseline report under `baselines/` before phase 006 starts |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `Read`-channel counts reproduce the evidence pack's numbers on the same window and arguments.
- **SC-002**: The baseline report gives Gate 5 and §8 miss rates for Claude Code and Codex with denominators and intervals.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Transcript formats change between runtime versions | Med | Adapters fail loudly on an unknown record shape and the test fixtures pin the known shapes |
| Risk | Exempt-path rules drift from `spec-gate-core.mjs` `isExemptTargetPath` | Med | Mirror the list with a comment naming the source function, and test it |
| Risk | Requested-table detection is a heuristic | Med | Report the split, never silently drop replies, and audit a sample by hand |
| Dependency | Local transcripts in `~/.claude/projects` and `~/.codex/sessions` | Low | A missing directory is reported as zero sessions for that runtime |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-P01**: 200 sessions analyze in under 60 seconds on this machine.
- **NFR-S01**: No transcript text, prompt text or file content leaves the process, only counts and rates.
- **NFR-R01**: A malformed JSONL line is skipped and counted, never fatal.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A session with no compaction: one window.
- A rule read in a sub-agent: counted only if the sub-agent's transcript is the same session file.
- A write before any user prompt: still the first write.
- A rule file that did not exist at the reply's timestamp: version `absent`, excluded from that rule's split.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One script, one test file, one doc |
| Risk | 8/25 | Read-only over local files |
| Research | 8/20 | Codex and other transcript formats |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which runtimes keep a readable transcript besides Claude Code and Codex? T002 probes Devin, Cursor, OpenCode and Pi.
- Is a hook-injected rule a delivery? Yes when the injected text contains the rule's binding sentence. No rule is injected today, so this is forward-looking.
<!-- /ANCHOR:questions -->

---
