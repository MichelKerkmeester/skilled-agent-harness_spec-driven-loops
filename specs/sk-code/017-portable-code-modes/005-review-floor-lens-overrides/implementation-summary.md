---
title: "Implementation Summary"
description: "Review now splits a fixed floor from a default lens a repository may drop or replace, reads each file's rules from the quality runner's --explain, and states the overrides it applied on one Rule sources line."
trigger_phrases:
  - "review floor lens overrides implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/005-review-floor-lens-overrides"
    last_updated_at: "2026-10-28T01:00:00Z"
    last_updated_by: "implementer"
    recent_action: "Shipped review floor, lens and overrides"
    next_safe_action: "Conductor wires the child into the parent phase table and commits"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-review/references/review-core.md"
      - ".skilled/skills/sk-code/sk-code-review/SKILL.md"
      - ".skilled/skills/sk-code/shared/scripts/tests/review-lens-overrides.test.cjs"
      - ".skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "review-floor-lens-implementer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-review-floor-lens-overrides |
| **Status** | Complete |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A repository can now tell the review mode "not here" or "this instead" for any review rule outside the floor, with the same `## Rule overrides` rows the quality mode reads, and every report says which rules it applied. Before, the review checklists applied this repository's house rules everywhere and nothing could switch one off.

### Review floor, default lens and rule overrides

Every rule section of the security, code quality, test quality and SOLID checklists opens with a `Rule:` line. A floor section cites one of the four fixed `review.*` ids or a `floor.*` id of the universal standards. A lens section cites `review.<name>` ids, and `review-core.md` section 8 lists all 25 of them with their default wording and severity. The house rules, the 20-line function, 4-level nesting, the Law of Demeter, the Rule of Three, AAA layout, magic-value comments, one concern per test, the test pyramid and the `ceiling:` marker, each have their own id and read as defaults.

The three P0 hints now follow the reach rule. The TODO rule asks only that a TODO says what is left and follows the repository's convention, names the six tracker hygiene ids it defers to, and a hygiene rule a repository switches off raises no review finding.

The review mode's SKILL.md drops `detect_surface_evidence` for one step that runs `quality-gate.cjs --explain` on the reviewed files and reads their surfaces, skill folders, checklists with seats and parsed overrides, and the switched-off hygiene rules. A surface the router bundles from words is a candidate that applies only to files the resolver places in it. A review with no files keeps `sk-code-skilled` only inside the hub's own checkout. Overrides apply by the contract's precedence, and one `Rule sources:` line in the report summary lists the checklists read and the overrides applied, refused, ignored or in conflict.

This framework's own code keeps its TODO format through one row in the SKILLED universal checklist.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-review/references/review-core.md` | Modified | Section 8: floor and lens tables, resolver, precedence, outcomes, hygiene mapping, `Rule sources:` line |
| `.skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md` | Modified | Marks, item ids, the P0 hint, the TODO rule, a labelled example |
| `.skilled/skills/sk-code/sk-code-review/assets/test-quality-checklist.md` | Modified | Marks, item ids, two P0 hints |
| `.skilled/skills/sk-code/sk-code-review/assets/security-checklist.md` | Modified | Marks, web-only items, labelled examples |
| `.skilled/skills/sk-code/sk-code-review/assets/solid-checklist.md` | Modified | Lens marks |
| `.skilled/skills/sk-code/sk-code-review/assets/fix-completeness-checklist.md` | Modified | Neutral, labelled example commands |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Modified | Resolver step and pseudocode, candidates, fileless rule, overrides, `Rule sources:` line, version 1.9.5.0 |
| `.skilled/skills/sk-code/sk-code-review/references/quick-reference.md` | Modified | Scope row |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | Modified | Pins the resolver step, the four floor ids and the line format |
| `.skilled/skills/sk-code/sk-code-review/scripts/tests/check-rule-copies.test.sh` | Modified | Seven cases |
| `.skilled/skills/sk-code/sk-code-review/scripts/review-output-fixture/rule-sources-valid.md` | Created | A report carrying the line |
| `.skilled/skills/sk-code/sk-code-review/scripts/README.md` | Modified | New pins, cases and fixture |
| `.skilled/skills/sk-code/sk-code-review/changelog/v1.9.5.0.md` | Created | Changelog entry |
| `.skilled/skills/sk-code/shared/scripts/tests/review-lens-overrides.test.cjs` | Created | Six cases |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modified | The review reader row |
| `.skilled/skills/sk-code/shared/README.md` | Modified | The new suite |
| `.skilled/skills/sk-code/changelog/v3.9.11.0.md` | Created | Hub changelog entry |
| `.skilled/skills/sk-code/SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json` | Modified | Hub carriers 3.9.11.0 |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` | Modified | `## 7. RULE OVERRIDES` with the TODO row |
| `.skilled/skills/sk-code/sk-code-skilled/references/python/quality-standards.md` | Modified | Review handoff |
| `.skilled/skills/sk-code/sk-code-skilled/references/shell/quality-standards/validation-security-and-shellcheck.md` | Modified | Review handoff |
| `.skilled/skills/sk-code/sk-code-skilled/changelog/v2.1.8.0.md`, `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` | Created/Modified | Changelog and carrier 2.1.8.0 |
| `.hermes/skills/sk-code/SKILL.md`, `.hermes/skills/sk-code-review/SKILL.md`, `.hermes/skills/sk-code-skilled/SKILL.md` | Modified | Hermes copies resynced |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The canary, its 80-case suite and the linter suite were baselined first, and the resolver's real CLI was read from the runner. The doctrine was edited, then the new suite and the seven canary cases were written against it. Both were then run on a `git archive HEAD` copy of the hub with only the new tests copied in: the node suite failed 6 of 6 and the canary suite failed its 4 new tamper cases. The changed tree passed all of them, and every other sk-code suite, the quality gate over the worktree and the doc validators were rerun from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The resolver call is `--explain <file>...` with no `--json` | The brief wrote `--json`, but `runner-contract.md` section 1 makes JSON the default and the runner refuses the flag: `USAGE: unknown argument --json`, exit 3 |
| No `local-` heuristic to remove | At `HEAD` the review SKILL.md held only `detect_surface_evidence`, which already read declared surfaces. That function is what the resolver replaces |
| Lens ids live in `review-core.md` section 8, not in the contract | `rule-overrides.md` section 3 names the review mode as the source of `review.*` ids and asks for no registration, and `fixed` stays the four floor ids |
| Security sections 7 to 11 and test-quality section 5 are lens | The report's D3 lists neither as floor. A finding there that is also a security minimum, and the swallowed-assertion item, stay floor |
| The fix completeness checklist and the removal plan carry no ids | They are process guides for turning a finding into a fix and hold no review rule |
| A test defect is at most P1 | A test that cannot fail exploits nothing and destroys no data, the two things `review-core.md` section 2 reserves P0 for |
| Every disabled hygiene id reaches review, not only the six tracker ids | `floor.ephemeral-pointers` is the judgment half of every hygiene rule, so a label kind a repository allows must not come back through it. The TODO rule maps to the six tracker ids |
| The SKILLED override row sits in `universal-checklist.md`, and the handoffs point at it | Contract section 6 gives a section effect only in a declared checklist, and the two references are not seats. The one lens rule SKILLED changes is the TODO format, which every SKILLED checklist shares, so one row at the SKILLED level keeps today's behavior for every `.skilled/**` file and avoids two rows that could disagree |
| `stack-detection.md` row edited in `shared/` | It named `detect_surface_evidence`, which this change removes, so it became false. The hub changelog covers it |
| The new suite lives in `shared/scripts/tests` | CI runs that folder's `*.test.cjs`, and it tests the review ids against the shared contract |
| Doc versions raised by hand | `frontmatter-version.mjs bump` raises staged docs only, and this lane may not stage. Each changed doc got the section 4 bump: third segment up, fourth reset |
| Em dashes in edited files replaced | The brief forbids them in any file written. Seven pre-existing ones in `SKILL.md` and the code-quality checklist were reworded without changing meaning |
| Deleted paths never reach `--explain` | One missing path makes the runner stop the whole call with exit 3, which would drop every surface and override for the files that remain. The step uses `git diff --name-only --diff-filter=d` or a regular-file check, and lists a deleted path on the `Not checked:` line when its removal matters |
| The SKILLED TODO row asks for an owner and no ticket id | `floor.ephemeral-pointers` is on in this repository and keeps ticket ids out of comments, so a row that endorsed `TODO(TICKET-123)` contradicted it. The `TODO(TICKET-123)` examples and the "owner or ticket" wording in the SKILLED checklists and references were reworded to the same owner-and-what-is-left form, so no SKILLED doc shows a ticket id in a comment |
| Over-mocking the system under test is floor | A test whose mocks replace what it tests cannot fail, the same class as a swallowed assertion, so it sits under `review.correctness-minimums` and `review.test-smells` keeps only the P2 smells |
| Patch versions for all three entries | `common.md` asks for the next patch version. The conductor renumbers at landing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `review-lens-overrides.test.cjs` on the `HEAD` tree | `pass 0`, `fail 6`, exit 1 |
| `review-lens-overrides.test.cjs` on the changed tree | `pass 6`, `fail 0` |
| Canary suite with the new cases on the `HEAD` canary | 83 `PASS`, 4 `FAIL` (the two tamper cases and their output checks), exit 1 |
| Canary suite on the changed tree | Before 80 `PASS`; after 89 `PASS`, 0 `FAIL`, exit 0 |
| Deleted-path pin on a canary without it | 87 `PASS`, 2 `FAIL` (`resolver_deleted_path_filter_dropped` and its output check), exit 1 |
| `--explain README.md no-such-deleted.ts` | `FILE_NOT_FOUND`, exit 3, the failure the deleted-path filter prevents |
| `check-rule-copies.js` | Before `7 exact-string file(s)`, exit 0; after `8 exact-string file(s)`, exit 0 |
| Shared suites, `node --test shared/scripts/tests/*.test.cjs` | `tests 18 pass 18 fail 0`, the linter's 12 unchanged |
| Quality runner suite | `tests 137 pass 137 fail 0` |
| sk-code-skilled suite | `tests 36 pass 36 fail 0` |
| `quality-gate.cjs --worktree` | `gate=NO_BLOCKER_FOUND exit=0`, `findings: 0` over 50 files |
| `scratch/show-explain.cjs` | Each fixture exit 2. `no-comments`: four overrides applied. `opposite-rule`: `floor.documentation replace`. `floor-attempt`: `Refused: .sk-code/checklists/house.md` |
| `validate_document.py --json` | `"total_issues": 0` on the fourteen changed docs and the three changelogs |
| `parent-skill-check.cjs` on the hub | `OK: all hard invariants passed, 0 warnings` |
| `sync-skills-hermes.cjs --check` | `PASS: 67 Hermes skill copies in sync` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `Rule sources:` line is doctrine, not a checked field.** Both checkers accept a report with or without it. Requiring it would change the checkers, which this child must not regress, and child 006 owns the checker work.
2. **The candidate rule is applied by the reviewer.** The router still bundles `sk-code-skilled` from words such as "typescript". Review's steps tell the reviewer to apply that surface only to files the resolver places in it, and no code enforces it, because the brief keeps the router unchanged.
3. **The `@review` agent still repeats one old P0 hint.** It sits in the agent's own checklist, which child 006 replaces.
4. **The review README and playbooks still show a summary without the new line.** Child 010 aligns them.
<!-- /ANCHOR:limitations -->

---
