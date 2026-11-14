---
title: "Feature Specification: Recover the last findings object from alignment lane output"
description: "The private alignment lane runner loses lane and critic results when model prose carries a brace or quote, when a later nested object has a findings array, or when a pretty-printed object follows a broken scan. The packet plans a last-top-level-object parser and three failing-first tests."
trigger_phrases:
  - "alignment lane result parser"
  - "run-lanes findings object"
  - "critic json parser"
  - "last findings object"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Recover the last findings object from alignment lane output

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/385-epic-review-fixes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`findFindingsObject` in `.skilled/commands/assets/local-skilled-alignment/run-lanes.cjs:326-365` reads from the first `{` it sees and keeps one string state for the whole stream. A brace and quote in model prose before the real JSON leaves that state wrong, so a valid lane object is never parsed. The function also keeps the last object anywhere with a `findings` array (`.skilled/commands/assets/local-skilled-alignment/run-lanes.cjs:358`), so a later nested non-lane object replaces the lane result. In the confirmed run these two shapes lost lanes A and B and the critic.

The expected results are `{"lane": ..., "findings": [...]}` for a lane and `{"findings": [...]}` for the critic. Each is the last JSON object the model prints.

### Purpose
Recover the last top-level findings object from each transcript, preferring an object that names its lane when the caller is a lane, without changing the timeout, watchdog or status behavior.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The private tool is a symbolic link to a git-ignored source folder. Current source lines and ignore rule:

```text
$ rg -n "function findFindingsObject|if \(starts.length === 0\) \{" .skilled/commands/assets/local-skilled-alignment/run-lanes.cjs
326:function findFindingsObject(rawText) {
334:    if (starts.length === 0) {
$ git -C /Users/michelkerkmeester/MEGA/Development/Skilled check-ignore -v .skilled/commands/assets/local-skilled-alignment/run-lanes.cjs
.gitignore:247:/.skilled/commands/assets/local-*	.skilled/commands/assets/local-skilled-alignment/run-lanes.cjs
$ ls -ld .skilled/commands/assets/local-skilled-alignment
lrwxr-xr-x@ 1 michelkerkmeester  staff  98 Nov 14 17:07 .skilled/commands/assets/local-skilled-alignment -> /Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/commands/assets/local-skilled-alignment
```

Line 358 overwrites `findings` with any candidate that has a `findings` array, and line 411 is the only parser call. The packet docs are tracked in this repository. The runner and its test are not tracked. Their rollback is to restore the backup copy the orchestrator made before the build.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace `findFindingsObject` with a parser that tries each `{`, matches braces with string state that starts fresh at that start, parses the slice, and keeps the last top-level object with a `findings` array.
- Prefer the last parsed object that also carries a `lane` value when the caller is a lane. Keep the last object with `findings` for the critic.
- Pass the lane or critic expectation from `finalizeLane`.
- Extend the test stub so a case can emit an exact synthetic transcript, then add one failing-first case per observed symptom.
- Record in the packet that the private code is ignored and the packet docs are tracked.

### Out of Scope
- Changing lane prompts, executor argv, timeout, watchdog or status files.
- Changing the critic contract or the `findings` array schema.
- Adding a retry or a second parse pass over a different file.
- Changing any tracked command, skill or README outside this packet.
- Editing the private tool beyond `run-lanes.cjs` and its test.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/assets/local-skilled-alignment/run-lanes.cjs` | Modify | Replace the findings-object scan, add the lane preference and pass the caller expectation |
| `.skilled/commands/assets/local-skilled-alignment/tests/run-lanes.test.cjs` | Modify | Add a raw-transcript stub mode and three failing-first cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Given a lane transcript with an unmatched `{` and quote in prose before a valid `{"lane":"A","findings":[...]}` object, When the lane finishes with exit 0, Then `lanes/A.json` is that object and `A.error.txt` is absent. |
| REQ-002 | Given a lane transcript whose first object is the lane result and whose later output holds a nested object with a `findings` array, When the lane finishes, Then `lanes/A.json` is the object that carries `lane`. |
| REQ-003 | Given a critic transcript that ends with a pretty-printed multi-line `{"findings":[...]}` object after prose with an unmatched brace, When the critic finishes, Then `critic.json` is that object and `critic.error.txt` is absent. |
| REQ-004 | Given a transcript with no top-level object that has a `findings` array, When the lane finishes, Then `lanes/A.json` is absent and `A.error.txt` is `no JSON object with findings`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Given the existing valid lane output, the existing runner test still passes and the parser adds no new dependency. |
| REQ-006 | Given a lane id other than `critic`, the parser prefers an object with `lane`, and given `critic`, it returns the last top-level findings object without a lane requirement. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/commands/assets/local-skilled-alignment/tests/run-lanes.test.cjs` exits 0 with the three new cases passing.
- **SC-002**: On the unfixed parser, the prose-brace case and the nested-object case fail with `no JSON object with findings` or a wrong `A.json`, and the critic pretty-print case fails the same way.
- **SC-003**: The no-match case keeps the current error reason and removes the stale JSON file.
- **SC-004**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/006-alignment-lane-result-parser --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The private tool folder resolves through a symbolic link to a git-ignored source folder | A change is invisible to this repository's diff | Record the target path and restore the orchestrator backup on rollback |
| Risk | A per-brace scan is slower on a pathological transcript with many braces | Low | Each lane reads one transcript once, and the scan is bounded by the raw file size |
| Risk | A nested object with `findings` inside an outer parsed object is preferred | Medium | Keep only top-level candidates by range containment, then apply the lane preference |
| Risk | A transcript with two lane objects | Low | The last top-level lane object wins, matching the model's final answer |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The parser reads the raw transcript once from disk and performs no additional file read.
- **NFR-P02**: The case with one lane object and ordinary prose completes within the existing 4 second test timeout.

### Security
- **NFR-S01**: The parser uses `JSON.parse` on candidate slices only and never evaluates text.
- **NFR-S02**: No new network call, credential or environment variable is introduced.

### Reliability
- **NFR-R01**: A transcript with no findings object keeps the exact reason `no JSON object with findings`.
- **NFR-R02**: Timeout, watchdog and exit-code handling are untouched.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty raw file returns no object and the lane records `no JSON object with findings`.
- Maximum input: a transcript with several objects and nested objects returns the last top-level object that has a `findings` array, with the lane object preferred for a lane.
- Failure path: an unclosed brace is skipped and scanning continues at the next `{`.
- String state: an escaped quote inside a JSON string does not close the string, and a brace inside a string does not change depth.
- Critic path: no `lane` key is required and the last top-level findings object wins.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One private runner, one private test file and three cases |
| Risk | 8/25 | Result parsing changes for every lane and the critic |
| Research | 6/20 | The current scanner, its one caller and the stub were read |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
