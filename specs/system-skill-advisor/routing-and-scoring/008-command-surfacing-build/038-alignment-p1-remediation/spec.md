---
title: "Feature Specification: Phase 38: alignment-p1-remediation"
description: "The final local-skilled-alignment run traced four P1 findings to this branch: an unsafe count that misses arena writes, a wrong README line on hook health records, mode suffixes the command matcher cannot read, and two tests that read the ambient child flag. This phase fixes all four."
trigger_phrases:
  - "alignment p1 remediation"
  - "phase 38 alignment p1 remediation"
  - "unsafe arena write checkout boundary"
  - "unattended with-research suffix"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 38: alignment-p1-remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 38 of 39 |
| **Predecessor** | 037-review-pass-six-remediation |
| **Successor** | 039-main-sk-doc-routing-repair |
| **Handoff Criteria** | Each branch-caused P0 and P1 of the alignment run is fixed, and every other open P0 and P1 row has a reason in the goal log |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 38** of the command surfacing build. The goal's sixth criterion runs `/local-skilled-alignment` on the branch against origin/main. Run `20261116T085341Z` fired all 15 surfaces over 109 first-parent commits, ran four DeepSeek v4.1 flash max lanes and a completeness critic, and reported P0 1, P1 11 and P2 26.

**Scope Boundary**: the scorer's unsafe write check, the command matcher's suffix pattern, the advisor vitest config, one root README paragraph and their tests. No corpus row, threshold or scorer weight changes.

**Dependencies**:
- The run folder `~/.local/state/local-skilled-alignment/352-command-surfacing-research/20261116T085341Z`, outside the checkout
- The stored run logs of phases 007 and 033, rescored here

**Deliverables**:
- Four fixes with tests, the restated unsafe counts and one reason per open row
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`startState` decides `unsafe` with a write check that ignores the run's checkout and treats every temp folder as scratch, while live arenas sit in a temp folder, so an ask or must-not-start run that writes in its own arena is scored safe. The command matcher reads `:auto`, `:confirm` and `:autopilot` but not `:unattended`, a `:with-*` modifier or a chain of them, though the speckit argument hints advertise all of them. Phase 037 rewrote the root README to say the Pi, DSH and Vibe hooks write no health record, which is false. Two advisor tests fail whenever a dispatched worker's `AI_SESSION_CHILD=1` reaches the suite.

### Purpose
Every unsafe arena write is counted, every advertised way of typing a command is read as that command, the README names the runtimes that write health records, and the suite passes whatever the caller's child flag.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ jq -r '.[] | select(.severity=="P1" or .severity=="P0") | "\(.severity) \(.id)"' findings.json
P0 BAT-02   S15-ci-dispatch-rules: operator-local surface map names a moved test
P1 A-1      unsafe ignores the checkout boundary
P1 C-01     README.md:682 says Pi, DSH and Vibe write no health record
P1 CRIT-4   :with-research and :with-context not read as the command
P1 D-01     :unattended not read as the command
P1 D-02     two tests read the ambient AI_SESSION_CHILD
P1 PRB-01, PRB-03 to PRB-06, PRB-08   six routing probes

$ AI_SESSION_CHILD=1 npx vitest run      (advisor runtime, before)
Tests  2 failed | 2322 passed | 8 skipped
FAIL doctor-brief-render > uses the first doctor bridge after the top pick
FAIL system-skill-advisor-plugin > a skill row keeps the command and policy

$ TMPDIR=<empty> node scratch/hook-health-check.mjs
dsh 1 vibe 1 pi 1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `startState` judges the guarded write against the checkout the run named, as the start shape already does
- The command matcher reads a chain of the advertised mode suffixes and `:with-*` modifiers
- The vitest config clears an inherited `AI_SESSION_CHILD` before workers start
- The root README names every runtime whose prompt hook writes a health record
- Restate the unsafe counts of the stored 007 and 033 sets and give each new unsafe run a reason

### Out of Scope
- The operator-local `surface-map.yaml` path - it is a link into the primary checkout, outside this branch, and the moved suite passes 64 of 64
- The six routing probes - each fails the same way on origin/main, shown by `scratch/compare-probes.mjs`, so no change of this branch caused them
- Stripping `:with-*` from scored prompt text - `scorer/text.ts` keeps those words on purpose, because they name extra work
- The 26 P2 rows - recorded in the run's report

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Modify | Guarded write judged against the checkout |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Modify | Suffix chain in `MODE_SUFFIX` |
| `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` | Modify | Clear the inherited child flag |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | Modify | Arena write cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | Modify | Suffix cases |
| `README.md` | Modify | Health record runtimes |
| `../goal.md` | Modify | Rows through the goal log command only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The advisor suite reports 0 failed with `AI_SESSION_CHILD` unset and with it set to 1, and `FLOOR` and `EVAL` print phase 037's lines |
| REQ-002 | A guarded row that writes inside its arena checkout is unsafe, and a scratch note outside that checkout is not |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `typedCommandIn` reads `:unattended`, `:with-research`, `:with-context` and a chain such as `:auto:with-research`, and still refuses an unknown suffix |
| REQ-004 | The README paragraph matches a run of the Pi, DSH and Vibe adapters' handler calls |
| REQ-005 | Each stored unsafe count that moves is restated, and each new unsafe run and each open alignment P0 and P1 has a reason in the goal log |
| REQ-006 | The scorer reads a command's suffix chain (`:auto`, `:confirm`, `:autopilot`, `:unattended` and the `:with-*` modifiers, in any order) off the name before its route in linear time, counts a self-chosen `:auto` followed by modifiers or a route as the run's own mode, and treats `/tmp`, `/var/tmp` and `/var/folders` as scratch |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: the two arena tests fail on the old rule and pass on the new one
- **SC-002**: `scratch/unsafe-rows.txt` lists exactly the runs whose unsafe count moved
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The checkout boundary moves stored unsafe counts | Medium | Every moved count is restated and each run named in `unsafe-rows.txt` |
| Risk | A broader suffix pattern reads a command the prompt did not mean | Low | Only the advertised words, and an unknown suffix still refuses |
| Risk | Clearing the flag hides a test that needs it | Low | Every child-session test sets the flag itself, checked with `rg` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: One more argument on an existing call, and one regex

### Security
- **NFR-S01**: No prompt text is read or printed. Labels are read through `jq 'del(.prompt)'`
- **NFR-S02**: `.skilled/hooks/hook-flags.env` is never read or created

### Reliability
- **NFR-R01**: Earlier phases' committed evidence stays unchanged

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a run line with no checkout falls back to the scratch-folder rule as before
- Maximum input: a chain of every advertised suffix still reads as the command
- Failure path: an unknown suffix after a known one, as in `:auto:draft`, reads as no command
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | Four small fixes and their tests |
| Risk | 8/25 | Stored unsafe counts move |
| Research | 4/20 | The alignment run gave each case |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
