---
title: "Feature Specification: Fix the six P2 findings of the second epic review"
description: "The second five-pass review of this epic returned FAIL with six P2 findings. This packet fixes them, reruns the review, which returns PASS with seven new P2 advisories, and fixes those too: two more offer-gate gaps, a vocabulary drift guard, the Vibe head-receipt folder check, stale completion metadata and an incomplete catalog entry."
trigger_phrases:
  - "second epic review fixes"
  - "phase 28 second epic review fixes"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Fix the six P2 findings of the second epic review

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-23 |
| **Branch** | `worktrees/523-epic-016-second-review-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 28 of 28 |
| **Predecessor** | 027-epic-review-fixes |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, the review rerun reports no failed gate, and the work is merged to main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 28** of the epic. The source is the parent's `review/review-report.md`, the second five-pass deep review of the whole epic, run natively on the deep-review agent at Opus medium with an Opus high synthesis. Its verdict was FAIL from the coverage gate and one open search-ledger row, with six P2 findings and no P0 or P1.

**Scope Boundary**: the six findings in that report, the review rerun that checks them, and the seven P2 advisories the rerun found, which the operator asked to fix before landing. The rerun's report is `../review/review-report.md`, generation 3.

**Dependencies**:
- The review report at `../review/review-report.md`, archived by the rerun under `../review-archive/`.

**Deliverables**:
- Code, test and doc changes listed in section 3, then a fresh five-pass review of the epic.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A Python child that exits before it reads the prompt makes the advisor subprocess throw an uncaught `EPIPE` instead of failing open. A typographic apostrophe hides a request for a research loop from both copies of the offer gate, and the comment above `ITERATION_COUNT` uses an example the code does not treat the way it says. Four finished children still read Planned, the receipt-guard catalog entry names only the Claude hook, and 027's AC-006 records a grep result that HEAD does not reproduce.

### Purpose
Each finding is fixed or corrected at its source with a check that failed before the change, and a fresh review of the epic reports no failed gate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node nc.mjs .../runtime/dist/runtime/lib/subprocess.js   # 8 MiB prompt, child runs process.exit(3)
UNCAUGHT EPIPE write EPIPE

$ asksForLoopRun / asks_for_loop_run, TypeScript and Python agree:
"why does it stop after ten iterations" true
"why does the deep review stop after ten iterations" false
"I’d like a research loop on cache eviction" false
"i'd like a research loop on cache eviction" true

$ git grep score-outcome-rerank -- ':!specs/'
.skilled/skills/system-skill-advisor/changelog/v2.0.1.0.md:32:- `score-outcome-rerank.mjs` is deleted. It imported a module removed in v2.0.0.0.

$ grep -n '| \*\*Status\*\*' 007-*/spec.md 008-*/spec.md 009-*/spec.md 010-*/spec.md
each prints | **Status** | Planned |
```
The subprocess throws instead of returning. The curly apostrophe loses the offer the straight one gets. The grep prints one changelog line where AC-006 recorded none.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a stdin `error` listener to `runSpawnAttempt`, with a test that sends a large prompt to a child that exits at once.
- Fold curly apostrophes in `asksForLoopRun` and `asks_for_loop_run`, and pin the case in the shared fixture.
- Rewrite the `ITERATION_COUNT` comment so its example names the loop, and pin both the named-loop and the bare spelled-count question in the shared fixture. The operator chose to keep the code.
- Set children 007 to 010 to Complete, rewrite the receipt-guard catalog entry, and correct 027's AC-006.
- Rerun the five-pass review of the epic and log the `env_parity` search row.
- Fix the rerun's seven advisories: a negated loop question reads as a run request, the writing-about check misses a curly apostrophe, the Python copy's inline vocabulary has no drift guard, the Vibe head-receipt write trusts its folder, children 012, 025 and 024/005 carry stale completion metadata, the epic's Status cell and row 22 lag the work, and the strip catalog entry names two of seven call sites.

### Out of Scope
- Changing how a bare question that quotes a spelled count is read. The operator chose to fix the comment and keep the code.
- The graph-metadata parser's open-task check, which counts a ticked line that quotes an unticked checkbox as open. That parser belongs to system-spec-kit. This packet rewords the one line in 012 that tripped it.
- The review's tooling notes: the reducer-generated `review/resource-map.md` and the unrecorded `agent_cross_runtime` overlay belong to the deep-loop skill, not this epic.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts` | Modify | Stdin error listener before the prompt write |
| `.skilled/skills/system-skill-advisor/runtime/tests/subprocess-output-cap.vitest.ts` | Modify | Early-exit child case |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-subprocess.vitest.ts` | Modify | The mock child's stdin becomes an event emitter, as a real pipe is, so the new listener can attach |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Modify | Quote fold in `asksForLoopRun`, `ITERATION_COUNT` comment |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modify | `asks_for_loop_run` reads `_fold_quotes(prompt)` |
| `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` | Modify | Three shared cases, 27 to 30 |
| `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md` | Modify | Shared handler and the DSH, Vibe and Pi adapters |
| `../007-*/`, `../008-*/`, `../009-*/`, `../010-*/` `spec.md` and `graph-metadata.json` | Modify | Status Complete |
| `../027-epic-review-fixes/acceptance-criteria.md` | Modify | AC-006 excludes changelogs and records the rerun |
| `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts` | Modify | One case per vocabulary entry must exist in the shared fixture |
| `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` | Modify | Head receipt checks its folder and writes by temp file and rename |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs` | Modify | Planted symlink and open folder cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/vibe-prompt-advisor.vitest.ts` | Modify | State folders owner-only, as the hardened hook requires |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/pasted-reply-stripping.md` | Modify | Every strip call site, the Python copy and the shared fixture |
| `../012-*/tasks.md`, `../012-*/`, `../025-*/` and `../024-*/005-*/` continuity | Modify | Completion metadata matches the Complete status |
| `../spec.md` | Modify | Status cell through phase 028, rows 22 and 28 Complete |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A child that exits before it reads an 8 MiB prompt makes `runAdvisorSubprocess` return `ok: false` with the child's exit code, and no error escapes |
| REQ-002 | A typographic apostrophe in a want lead gets the same offer as a straight one in both runtimes, pinned by a shared fixture case |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The `ITERATION_COUNT` comment's example matches what both runtimes do, and both spelled-count questions are shared fixture cases |
| REQ-004 | Children 007 to 010 read Complete in `spec.md` and `graph-metadata.json`, and the receipt-guard catalog lists every adapter that reaches the guard |
| REQ-005 | 027's AC-006 states a command that reproduces at HEAD |
| REQ-006 | A fresh five-pass review of the epic reports no failed gate and no open search-ledger row |
| REQ-007 | A negated question about the loop, such as "why doesn't my deep review converge", stays a question in both runtimes, and the writing-about check folds a curly apostrophe in both |
| REQ-008 | Every native loop vocabulary entry has a shared fixture case that asks for a run through it, so a word added to one runtime and not the other fails a suite |
| REQ-009 | The Vibe head receipt is never written through a planted symlink, and a folder other users can write to holds no receipt |
| REQ-010 | Every child's completion metadata, the epic's Status cell and the phase map agree with the work, and the strip catalog entry names every call site |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new subprocess case passes, and the same case run against the HEAD copy of `subprocess.ts` reports an unhandled `write EPIPE`.
- **SC-002**: `deep-loop-offer-cases.vitest.ts` and the Python `DEEP-LOOP-GATE` check both pass over 30 cases.
- **SC-003**: The review rerun's verdict script reports no failed gate.
- **SC-004**: The shared offer fixture passes in both runtimes with the new cases, and the vocabulary check fails when a word is added to the native list alone.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The worktree's skill-graph database | Without it 13 advisor tests and one Python test fail before any change | Build it with `skill-advisor.cjs skill_graph_scan --trusted` before the baseline |
| Risk | The quote fold changes what every gate exception reads | Low | The exceptions already fold or are quote-free, and the full advisor suite and ratchets run after the change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty prompt still reaches the gate unchanged, since folding an empty string returns it.
- Maximum input: an 8 MiB prompt to an early-exit child returns the failed exit instead of throwing.
- Failure path: the stdin listener swallows only the pipe error. The close handler still reports the exit code, and a spawn failure still reports `SPAWN_ERROR` or `PYTHON_MISSING`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Four code files, one fixture, one catalog entry, nine spec files |
| Risk | 5/25 | Shared offer gate in two runtimes, covered by the shared fixture |
| Research | 2/20 | The review report gives each cause |
| **Total** | **13/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose to fix the comment and keep the spelled-count rule on 2026-11-23, then chose to fix all seven of the rerun's advisories before landing.
<!-- /ANCHOR:questions -->

---
