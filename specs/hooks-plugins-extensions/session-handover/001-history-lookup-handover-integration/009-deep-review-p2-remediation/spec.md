---
title: "Feature Specification: Phase 9: deep-review-p2-remediation"
description: "The 10-iteration deep review of the history lookup engine move left seven P2 advisories and one search-debt item. This phase fixes the six that reproduce, records the one whose premise failed a negative control, measures the search index memory, and removes the predecessor hard block from /speckit:complete."
trigger_phrases:
  - "deep review p2 remediation"
  - "phase 9 deep review p2 remediation"
  - "history lookup p2 fixes"
  - "search index memory measurement"
  - "remove predecessor hard block"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: deep-review-p2-remediation

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/419-history-review-p2-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-wider-hop-recall-measurement |
| **Successor** | None |
| **Handoff Criteria** | Every active P2 from `../review/review-report.md` section 3 is fixed or recorded with its receipt, SL-510 has measured numbers, and the engine, hooks, readers and handover suites pass at or above their baselines. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the history lookup handover integration. Phase 8 plans a wider hop-recall measurement and has not run. This phase does not depend on it: it remediates the deep review that ran over the engine move, so it was built while phase 8 is still Draft.

**Scope Boundary**: The seven P2 findings, the SL-510 measurement and, by the operator's decision during this phase, the predecessor hard block in `/speckit:complete`. Defects the work exposes elsewhere are recorded, not fixed.

**Dependencies**:
- The deep review report, `../review/review-report.md`, which is staged on main and is not in this worktree's tree.
- The engine build at `.skilled/hooks/session-handover/history/dist/`, which the measurement scripts load.

**Deliverables**:
- Fixes for findings I1-P2-002, I1-P2-003, I2-P2-001, I3-P2-001, I3-P2-002 and I3-P2-003.
- A recorded receipt for I1-P2-004 and measured numbers for SL-510.
- `/speckit:complete` without its predecessor hard block.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep review left seven P2 advisories. A commit that changes only engine code runs no engine suite in CI, the projection schema test turns a missing schema into a silent skip, the lookup offer prints its runtime label unquoted into a shell command, and two playbooks name retired paths, drop Vibe and contradict themselves. Separately, `/speckit:complete` hard-blocks any phase child whose numbered predecessor is unfinished, even when the two are independent, which stopped this very phase.

### Purpose
Every reproduced advisory is fixed, the one that did not reproduce is closed with its receipt, the search index cost is a measured number instead of open debt, and `/speckit:complete` no longer blocks an independent sibling.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Each finding was reproduced before any edit, from worktree 419 at `84c7c0e568d`.

```text
# I2-P2-001: an unsafe runtime label lands raw in the printed command
$ node -e '...buildHistoryLookupBody({runtime:"codex;touch /tmp/x", ...})'
Latest turns (read-only): (cd "$(git rev-parse --show-toplevel)" && SPECKIT_RUNTIME=codex;touch /tmp/x node .skilled/hooks/session-handover/bin/history-lookup.mjs --session 's1' --handle 'hl1_00000000000000000000000000000000' browse '{"direction":"backward"}')

# I1-P2-003: with history-entry.schema.json moved aside, the projection suite stays green
$ node --test .skilled/hooks/shared/tests/session-readers/project.test.mjs
﹣ schema: not published (0.058583ms) # history-entry.schema.json has not been published yet
ℹ tests 10
ℹ pass 9
ℹ fail 0
ℹ skipped 1
exit 0

# I1-P2-004: drifting either copy of the 66-character bound fails two existing tests
hook-state.ts LOOKUP_OFFER_MAX_QUOTED_SESSION_ID = 67  ->  2 failed: "bounds the session id by its quoted length", "admits exactly the session ids the lookup offer can print"
hook-state.ts LOOKUP_OFFER_MAX_QUOTED_SESSION_ID = 65  ->  the same 2 failed
lookup-offer.ts HISTORY_LOOKUP_MAX_QUOTED_SESSION_ID = 67  ->  Tests 2 failed | 137 passed (139)
lookup-offer.ts HISTORY_LOOKUP_MAX_QUOTED_SESSION_ID = 65  ->  Tests 2 failed | 137 passed (139)

# Predecessor block: speckit-complete.yaml step_1 on this child
phase_predecessor_validation.on_fail: "HARD BLOCK — predecessor phase not complete. Report status and halt."
008-wider-hop-recall-measurement: no implementation-summary.md, 14 open task lines

# SL-510: search index heap on synthetic stores (scratch/measure-search-index.mjs)
{"textMegabytes":"10.0","items":4168,"searchIndexHeapMegabytes":"43.7","indexToTextRatio":"4.37","firstSearchMilliseconds":3345,"peakResidentMegabytes":"193.7"}
{"textMegabytes":"50.0","items":20832,"searchIndexHeapMegabytes":"210.9","indexToTextRatio":"4.22","firstSearchMilliseconds":15982,"peakResidentMegabytes":"442.2"}

# SL-510: real Claude transcripts through the CLI's reader and lookup (scratch/measure-real-transcript.mjs)
{"fileMegabytes":"219.1","items":12960,"readerHeapMegabytes":"28.0","lookupHeapMegabytes":"17.0","searchIndexHeapMegabytes":"95.4","readMilliseconds":557,"firstSearchMilliseconds":1493,"secondSearchMilliseconds":21,"peakResidentMegabytes":"1094.0"}
{"fileMegabytes":"120.0","items":11888,"searchIndexHeapMegabytes":"86.9","firstSearchMilliseconds":1141,"peakResidentMegabytes":"669.2"}
{"fileMegabytes":"55.3","items":4214,"searchIndexHeapMegabytes":"29.0","firstSearchMilliseconds":385,"peakResidentMegabytes":"359.9"}
{"fileMegabytes":"12.8","items":1295,"searchIndexHeapMegabytes":"8.6","firstSearchMilliseconds":101,"peakResidentMegabytes":"168.4"}
```

The synthetic stores are worst-case text, with every byte indexable. Real transcripts index far less text per file byte, because the projection drops thinking, images and record metadata.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `.skilled/hooks/**` to both path filters of `.github/workflows/spec-kit-check.yml`, so an engine-only commit runs the engine suites.
- Replace the schema skip in `project.test.mjs` with an assertion that the published schema exists.
- Withhold the lookup offer when its runtime label is not one plain lowercase word, so no label that a shell could read as syntax reaches the command.
- Correct the two playbooks: the moved test paths, Vibe in the two capability lines, and the hop-recall overview sentence.
- Remove `phase_predecessor_validation` and its two mentions from `speckit-complete.yaml`.

### Out of Scope
- Exporting the hook-state bound for a new equality test - the negative control in Measured Behavior shows the existing sweep already fails on drift from either side, and the operator chose to record it.
- Changing the search index - the measurement found no problem the index causes (section 5).
- The reader's whole-file read and the INCOMPLETE_TOOL_RESULTS refusals of large transcripts - both belong to the session readers, not this review's findings.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/spec-kit-check.yml` | Modify | Add `.skilled/hooks/**` to the push and pull_request path filters. |
| `.skilled/hooks/shared/tests/session-readers/project.test.mjs` | Modify | Assert the schema exists instead of skipping. |
| `.skilled/hooks/session-handover/history/lib/lookup-offer.ts` | Modify | Withhold the offer for a runtime label that is not one plain lowercase word. |
| `.skilled/hooks/session-handover/history/tests/history-locator.vitest.ts` | Modify | Add the unsafe-label edge case and check every schema runtime passes the shape. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md` | Modify | Moved test paths and Vibe in the two capability lines. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md` | Modify | Line 18 says the claim prints the offer. |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modify | Remove the predecessor hard block and its two mentions. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The lookup offer never prints a runtime label that a shell could read as syntax. | `buildHistoryLookupSection` returns null for `codex;touch /tmp/x`, still returns a section for every runtime in `HISTORY_LOCATOR_KINDS`, and the engine suite passes with that case. |
| REQ-002 | A missing projection schema fails the reader contract suite. | With the schema moved aside, `node --test project.test.mjs` exits non-zero. With it in place, the suite passes with 0 skipped. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | An engine-only change triggers the workflow that runs the engine suites. | `rg -c "'.skilled/hooks/\*\*'" .github/workflows/spec-kit-check.yml` prints 2. |
| REQ-004 | The playbooks name existing test paths, all supported senders and the printed offer. | Every path in the compaction playbook's Source Files exists, lines 147 and 166 name Vibe, and hop-recall line 18 says the claim prints the section. |
| REQ-005 | `/speckit:complete` carries no predecessor hard block. | `rg -n -i predecessor .skilled/commands/speckit/assets/speckit-complete.yaml` prints nothing. |
| REQ-006 | SL-510 and I1-P2-004 are closed with recorded receipts. | The Measured Behavior block holds both, and `implementation-summary.md` states the verdicts. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The engine suite passes at 140 or more tests (baseline 139), the hooks vitest tree at 501, the session readers at 103 with 0 skipped (baseline 102, the schema test now split in two), the handover node:test files at 390 and hook-state at 18, and both typechecks exit 0.
- **SC-002**: SL-510 is closed without a code change. On the largest real transcript that loads (219 MB), the index holds 95.4 MB of heap and the first search takes 1.5 s, inside a one-shot CLI process whose 1.09 GB peak is set by the reader's whole-file read, not the index.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A future runtime whose name is not one lowercase word, such as one with a hyphen | Its senders would lose the offer | The new engine test checks every key of `HISTORY_LOCATOR_KINDS` against the shape, so such a runtime fails the suite instead of failing silently. `lookup-offer.ts` imports nothing new, because Pi's compaction hook loads it from source without the runtime build. |
| Risk | Removing the predecessor block lets a dependent phase start before its predecessor is done | Medium | The operator chose removal. A dependency stays visible in each child's Phase Context and the parent's transition table. |
| Risk | The new path filter lines shift the `timeout-minutes` line numbers that `sk-code-ci/references/job-shape-rules.md` cites | Low | That table is honour-system and no test pins it. Recorded as an adjacent defect. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator answered the predecessor block (remove it, and check the other spec commands: only `/speckit:complete` had it) and I1-P2-004 (record as already held).
<!-- /ANCHOR:questions -->

---
