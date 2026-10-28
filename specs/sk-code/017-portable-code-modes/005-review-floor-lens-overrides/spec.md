---
title: "Feature Specification: Review floor, default lens and rule overrides"
description: "The review mode mixes house rules into its universal checklists, carries three P0 hints that contradict its own severity rule and detects surfaces itself. This child splits a fixed floor from an overridable default lens, reads each file's rules from the quality runner and reports the overrides it applied."
trigger_phrases:
  - "review floor lens overrides"
  - "review floor default lens and rule overrides"
  - "review rule sources line"
  - "review reads quality explain"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Review floor, default lens and rule overrides

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/248-review-floor-lens-overrides` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review checklists apply this repository's house rules, such as 20-line functions, the Law of Demeter, the Rule of Three, AAA test layout and a ticket on every TODO, to every codebase, and no repository can switch one off. Three P0 severity hints contradict the reach rule in `review-core.md`, and the TODO rule asks for a ticket id that the comment-hygiene checker blocks. Review also detects surfaces with its own pseudocode, so it never reads the checklists or the `## Rule overrides` rows a repository declares.

### Purpose
Every review rule is either a fixed floor rule or a default-lens rule with an id that a repository or surface may drop or replace, review learns each file's rules from the quality runner's `--explain` resolver, and every report states the overrides it applied.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured at `HEAD` `5b1e143ced` of the worktree:

```text
$ git show HEAD:.../sk-code-review/assets/code-quality-checklist.md | grep -n "^- P0\|TODO, FIXME\|Functions exceeding 20"
102:- P0 for breaking changes to public APIs or shared interfaces with no migration path.
116:- Functions exceeding 20 lines or 4+ nesting levels without structural justification.
120:- TODO, FIXME, or HACK comments in production code paths without an associated tracking reference (issue link or ticket number).
$ git show HEAD:.../sk-code-review/assets/test-quality-checklist.md | grep -n "^- P0"
52:- P0 for assertion-free test functions (silently passing tests that verify nothing).
113:- P0 for catch blocks that swallow assertion failures (tests that cannot fail).
$ git show HEAD:.../sk-code-review/SKILL.md | grep -n "^def detect_surface_evidence"
227:def detect_surface_evidence(task, workspace_files=None, changed_files=None, read_text=None) -> list[str]:
$ git show HEAD:.../sk-code-review/references/review-core.md | grep -c "review.function-length"
0
$ node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js
OK: all rule invariants present (7 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).
$ bash .skilled/skills/sk-code/sk-code-review/scripts/tests/check-rule-copies.test.sh
80 PASS, 0 FAIL, All rule-canary test cases passed
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Mark each rule in the review checklists and `review-core.md` as floor, citing a `floor.*` id or one of the four fixed `review.*` ids, or as default lens with a `review.<name>` id worded as a default.
- Fix the three P0 hints so they follow the reach rule, and reword the TODO rule so it follows the repository's tracking convention and maps onto the `hygiene.*` ids.
- Label or neutralize the Skilled-only examples in the universal checklists, and scope the web security items to code that serves or calls HTTP.
- Replace `detect_surface_evidence` with one resolver step that runs `quality-gate.cjs --explain`, make router-added surfaces candidates and keep `sk-code-skilled` in a fileless review only inside the hub's checkout.
- Honor the `## Rule overrides` rows of the resolved checklists with the contract's precedence, define the `Rule sources:` report line, and convert the SKILLED review handoff sections into an override row.

### Out of Scope
- The `@review` agent and its mirrors, the speckit dispatch steps, `@orchestrate`, `check-rule-copies.js --mode-only` and the `Recommendation:` checker - child 006 owns them, including the repeated P0 hint in the agent.
- Broad README, playbook and feature-catalog alignment - child 010 owns it. Only the review mode's own SKILL.md and the references this change makes false are updated here.
- The router and its vocabulary - the brief forbids changing it. A router-added surface becomes a candidate instead.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-review/references/review-core.md` | Modify | Section 8: floor ids, lens id table, resolver, precedence, outcomes, hygiene mapping, `Rule sources:` line |
| `.skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md` | Modify | Floor and lens marks, item ids, the P0 hint, the TODO rule, a labelled example |
| `.skilled/skills/sk-code/sk-code-review/assets/test-quality-checklist.md` | Modify | Floor and lens marks, item ids, the two P0 hints |
| `.skilled/skills/sk-code/sk-code-review/assets/security-checklist.md` | Modify | Floor and lens marks, web-only scoping, labelled examples |
| `.skilled/skills/sk-code/sk-code-review/assets/solid-checklist.md` | Modify | Lens marks |
| `.skilled/skills/sk-code/sk-code-review/assets/fix-completeness-checklist.md` | Modify | Neutral, labelled example commands |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Modify | Resolver pseudocode and steps, candidates, fileless rule, overrides, `Rule sources:` in the output contract, version |
| `.skilled/skills/sk-code/sk-code-review/references/quick-reference.md` | Modify | Scope row for `review-core.md` |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | Modify | Pins the resolver step, the four floor ids and the `Rule sources:` format |
| `.skilled/skills/sk-code/sk-code-review/scripts/tests/check-rule-copies.test.sh` | Modify | Seven new cases |
| `.skilled/skills/sk-code/sk-code-review/scripts/review-output-fixture/rule-sources-valid.md` | Create | A report carrying a `Rule sources:` line |
| `.skilled/skills/sk-code/sk-code-review/scripts/README.md` | Modify | The new pins, cases and fixture |
| `.skilled/skills/sk-code/shared/scripts/tests/review-lens-overrides.test.cjs` | Create | Six cases: lens, floor, checklist marks, TODO mapping, disabled hygiene id, SKILLED rows |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modify | The review reader row now names the resolver step |
| `.skilled/skills/sk-code/shared/README.md` | Modify | The new suite |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` | Modify | `## 7. RULE OVERRIDES` with the SKILLED TODO row |
| `.skilled/skills/sk-code/sk-code-skilled/references/python/quality-standards.md` | Modify | Review handoff points at the override row, TODO examples carry no ticket id |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/python-checklist.md`, `shell-checklist.md`, `references/shell/quality-standards/overview-and-priority-blockers.md` | Modify | TODO rule and examples ask for an owner and what is left, with no ticket id |
| `.skilled/skills/sk-code/sk-code-skilled/references/shell/quality-standards/validation-security-and-shellcheck.md` | Modify | Review handoff points at the override row |
| Three changelog entries, the version carriers and three Hermes copies | Create/Modify | sk-code-review v1.9.5.0, sk-code-skilled v2.1.8.0, sk-code v3.9.11.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every rule section of the four review rule checklists carries a `Rule:` line marking it floor, with a fixed `review.*` or a `floor.*` id, or default lens, with `review.<name>` ids that `review-core.md` section 8 lists and the contract does not fix |
| REQ-002 | The three P0 hints follow the reach rule: a breaking API change, an assertion-free test and a test that swallows its own assertion are no longer P0 by default |
| REQ-003 | The TODO rule asks for no tracker id the repository's hygiene rules forbid, names the six tracker hygiene ids, and a hygiene id disabled in quality raises no review finding |
| REQ-004 | The review mode reads each file's surfaces, skill folders, checklists and parsed overrides from `quality-gate.cjs --explain`, and `detect_surface_evidence` is gone |
| REQ-005 | Review applies `## Rule overrides` rows by the contract's precedence and outcomes, refuses what the linter refuses, and states the result in one `Rule sources:` line that leaves both report checkers passing |
| REQ-006 | The rule canary stays OK and the rule-canary suite keeps all 80 cases passing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | A router-added surface is a candidate, and a fileless review keeps `sk-code-skilled` only inside the hub's checkout |
| REQ-008 | Universal checklist examples use no Skilled-only names or paths or are labelled as examples, and web items apply only to code that serves or calls HTTP |
| REQ-009 | The SKILLED review handoff sections become one `## Rule overrides` row on a declared SKILLED checklist and keep their language guidance |
| REQ-010 | A fixture pair, a no-comments repository and an opposite-rule repository, shows the `--explain` output review reads for each |
| REQ-011 | Changelog entries validate with 0 issues, the carriers are stepped and the Hermes copies are in sync |
| REQ-012 | Only existing regular files reach `--explain`, so a deleted path never drops the surfaces and overrides of the files that remain, and deleted paths are listed on the `Not checked:` line where they matter |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test review-lens-overrides.test.cjs` fails 6 of 6 against the `HEAD` docs and passes 6 of 6 against the changed ones.
- **SC-002**: The rule-canary suite passes 89 cases, and its new tamper cases fail against a canary without their pins.
- **SC-003**: `scratch/show-explain.cjs` prints a `Rule sources:` line for each fixture, with the floor attempt listed under `Refused`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `quality-gate.cjs --explain` and its `runner-contract.md` section 3 shape | Review could not resolve rules without it | Landed already. The review reads only documented fields, and a test runs the real runner |
| Dependency | `check-rule-overrides.cjs` and `rule-overrides.json` | The floor and the grammar live there | Reused as they are. The new suite reads the JSON, never a copy |
| Risk | The SKILLED TODO rule changes for this repository's code | Med | A SKILLED override row keeps an owner on every TODO for every `.skilled/**` file, with no ticket id, which `floor.ephemeral-pointers` keeps out of comments here |
| Risk | A new report line breaks a checker | Low | The line never starts with a checked prefix, and a fixture runs it through both checkers |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: One `--explain` call per review covers every reviewed file.

### Security
- **NFR-S01**: No floor rule can be dropped: the linter refuses the row and review applies none of that checklist's rows.
- **NFR-S02**: The `Rule sources:` line redacts a `local-*` path segment, so a pasted report names no private skill.

### Reliability
- **NFR-R01**: With no override and no new key, a review of this repository applies the same rules, the TODO format included, and only gains the report line.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a review with no file paths resolves nothing, writes `Rule sources: none` and keeps `sk-code-skilled` only inside the hub's checkout.
- Maximum input: one `--explain` call takes every reviewed file, and a checklist that several files reach is listed once.
- Failure path: `--explain` exit 3 is reported on the `Not checked:` line and those files are reviewed against the baseline only. A checklist with a refused row contributes no row and is listed under `Refused`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Eighteen docs across three packets, two test files and one fixture |
| Risk | 8/25 | Review doctrine only. Floor, severity ids and checkers unchanged |
| Research | 8/20 | The contract, the resolver output, the hygiene checker and the canary |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The judgment calls are recorded in `implementation-summary.md`.
<!-- /ANCHOR:questions -->

---
