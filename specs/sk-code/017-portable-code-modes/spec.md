---
title: "Feature Specification: Make sk-code quality, review and CI portable to any repository"
description: "Phase parent for making the sk-code quality, review and CI modes work in any repository and with any stack, so a repository can drop or replace house rules outside a fixed hard floor while this repository keeps its own checks."
trigger_phrases:
  - "portable code modes phase parent spec"
  - "sk-code portable quality review ci"
  - "rule overrides any repository"
  - "sk-code house style overrides"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes"
    last_updated_at: "2026-10-27T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Created the phase parent and built phase 001, the shared rule contract"
    next_safe_action: "Land phase 001, then start phases 002, 003 and 004 in parallel"
    blockers: []
    key_files:
      - "spec.md"
      - "001-shared-rule-contract/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-27-skcode-017"
      parent_session_id: null
    completion_pct: 8
    open_questions: []
    answered_questions:
      - "Documentation home: a new top-level packet, answered with the approved plan on 2026-10-27."
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge, migration or consolidation narratives (consolidate*, merged from, renamed from, collapsed, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md. These belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Make sk-code quality, review and CI portable to any repository

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-27 |
| **Branch** | `main` |
| **Parent Spec** | None. This is a top-level packet in the sk-code track |
| **Parent Packet** | sk-code track |
| **Predecessor** | `015-quality-agnostic-gate` |
| **Successor** | None |
| **Handoff Criteria** | Each phase folder in the map passes `validate.sh --strict` on its own folder, and the whole packet passes recursive strict validation with `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The three sk-code workflow modes carry this repository's house style into every repository they run in, and a repository has no way to say no.

- **Quality.** The 21 comment-hygiene rules block at P0 everywhere and cannot be switched off. The universal floor only lets a surface add rules, and it carries house rules such as required docstrings and strict typing. The always-loaded style guide and the JavaScript and CSS checklists are this repository's own style.
- **Review.** Its checklists mix house rules into the universal ones, three of its P0 hints contradict `review-core.md`, and generic words such as "typescript" bundle the SKILLED surface into any review. `@review` keeps its own checklist and a score-70 blocker that the mode rules out. Review never reads a repository's or an outside surface's rules.
- **CI.** The report, the toggle and the scaffold hard-code this repository's switch names, branch names and README rows. The toggle never reads the protected set, so one switch can turn off three protected guards after a single yes.

A repository that wants almost no inline comments, or the opposite of what this repository prefers, cannot get it today.

### Purpose

When the twelve phases in the map ship, the quality, review and CI modes ship workflows and universal rules and read each repository's own conventions. A repository or a surface can drop or replace any rule outside a fixed hard floor, and both modes honor the same override in the same file. This repository keeps every check that protects its alignment and quality, because it commits its own profile and config.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists and per-phase decisions live in the child phase folders listed in the Phase Documentation Map below. The program-wide decisions sit in section 5, because every phase depends on them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- One shared rule override contract and its linter, used by quality and review.
- A hygiene policy key that switches off chosen comment-hygiene rules, never the secrets or conflict-marker checks.
- A trimmed universal floor with rule ids, and the house style moved into `sk-code-skilled`.
- A resolver that names each file's surfaces and checklists, which review reads.
- Review with a floor separate from its default lens, overrides honored and `@review`'s verdict following severity.
- A CI profile at `.sk-code/ci.json` that the report, the toggle and the scaffold read, with this repository's profile committed.
- The five CI drift fixes, two Node 20 test fixes and the doc and doctor alignment for every changed behavior.

### Out of Scope

- Any change to `.github/scripts/**`, or to a protected workflow beyond the drift fixes. The protected set stays as it is.
- A "review profile". Review reads the checklists a repository already declares.
- The private web surface's checklist rows. They live outside this repository and are written only after the operator says yes at landing.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-code/shared/` | Create/Modify | 001 | The override contract, its floor list and its linter |
| `.github/workflows/sk-code-script-tests.yml` | Modify | 001 | Runs the linter suite in CI |
| `.skilled/skills/sk-code/sk-code-quality/` | Modify | 002, 003, 004 | Hygiene key, floor ids, style split, resolver |
| `.skilled/skills/sk-code/sk-code-review/` and `.skilled/agents/` | Modify | 005, 006 | Floor and lens, overrides, agent verdict, dispatch marker |
| `.skilled/skills/sk-code/sk-code-ci/` and `.skilled/commands/doctor/` | Modify | 007, 008, 010 | CI profile, drift fixes, doctor alignment |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children. A phase gets its folder when its lane starts.

| Phase | Folder | Focus | Depends on | Status |
|-------|--------|-------|------------|--------|
| 1 | 001-shared-rule-contract/ | The override section format, rule id grammar, hard floor, precedence and recording, as a shared reference, plus the `check-rule-overrides.cjs` linter both modes use | None | Complete |
| 2 | 002-quality-hygiene-policy/ | `commentHygiene.disableRules` and `--disable-rule`, the verdict field and the doctor `init` suggestion | 001 | Complete |
| 3 | 003-quality-floor-and-style-split/ | Floor rule ids with fixed or overridable marks, SKILLED style moved into `sk-code-skilled`, `ceiling:` opt-in, the three JavaScript and CSS default rows retired | 001 | Complete |
| 4 | 004-quality-resolver/ | `quality-gate.cjs --explain` over several files, plus each surface's owning skill folder | 001 | Complete |
| 5 | 005-review-floor-lens-overrides/ | Floor split from the default lens with ids, the wrong P0 hints fixed, review reads `--explain` and honors `## Rule overrides` | 001, 004 | Complete |
| 6 | 006-review-agent-and-dispatch/ | `@review` verdict follows severity, one verdict vocabulary, the `CODE-REVIEW` marker added by `@orchestrate`, which also reads `@code`'s Quality Gate field | 005 | Complete |
| 7 | 007-ci-repo-profile | The CI profile loader, report, scaffold and toggle reading `.sk-code/ci.json`, with this repository's profile committed | None (starts after the in-flight sk-code-ci lint lane lands) | Planned |
| 8 | 008-ci-drift-flags/ | The five YAML drift fixes | None (starts after the in-flight sk-code-ci lint lane lands) | Complete |
| 9 | 009-integration-fixes | Rule overrides applied in the quality run, the doctor quality status shows the applied rules, dashboard fix, outside-repo surface discovery documented | 002 to 006 | Planned |
| 10 | 010-docs-and-doctor-alignment | Every doctor command, README, guide, skill document, agent and mirror aligned with the new behavior | 002 to 009 | Planned |
| 11 | 011-node20-test-fixes | The two tests that fail on Node 20 | None | Complete |
| 12 | 012-verification-and-release | End-to-end proof, this repository's `.sk-code/quality.json`, the framework changelog and release | All | Planned |
| 13 | 013-router-reach-local-ties/ | The router reach check judges only the shipped fleet, and an operator-local surface ranked ahead of a shipped hub is a non-failing note that never prints its name | None | Complete |
| 14 | 014-advisor-phrase-calibration/ | The advisor stops counting one generic word twice, so a hub's exact declared phrase outranks a skill that lists the word in both keyword fields; a cross-scorer test and four harder-corpus prompts gate the rule | None | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002, 003, 004 | The contract reference, its floor JSON and the linter exist, and the linter suite passes | `node --test .skilled/skills/sk-code/shared/scripts/tests/check-rule-overrides.test.cjs` reports `fail 0` |
| 004 | 005 | `--explain` returns surfaces and checklists for several files | The phase 004 test suite |
| 005 | 006 | Review reads overrides and records a `Rule sources` line | The phase 005 fixtures |
| 002 to 009 | 010 | Every behavior change has landed | Each child validates with `RESULT: PASSED` |
| 010 | 012 | Docs match the shipped behavior | A fresh read-only review of every doc phase 010 touched |
| 001 | 013 | A shipped hub's declared phrase can be outranked only by another shipped hub before the check fails | The reach check prints `RESULT: PASSED` from a checkout with operator-local links and from one without |
| 013 | 014 | The reach check names the two phrases an operator-local surface takes on this machine | Both scorers route the fixture's exact-phrase prompts to the declaring hub; the routing-accuracy baseline is unchanged |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None blocks phase 001. The documentation home was answered with the approved plan on 2026-10-27: a new top-level packet in the sk-code track. It is not a child of `015-quality-agnostic-gate`, because that packet is complete and this program changes three modes, not the quality gate alone.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:decisions -->
## 5. PROGRAM DECISIONS

The operator approved the plan that takes these decisions on 2026-10-27. Each was taken by best judgment under the standing directive, and each is reversible until the phase that implements it lands. Every record below is an ADR with the status line `Accepted, approved with the plan 2026-10-27`.

### ADR-001: Overrides are allowed outside a fixed hard floor

- **Status:** Accepted, approved with the plan 2026-10-27
- **Supersedes:** `specs/sk-code/015-quality-agnostic-gate/spec.md` section 5, ADR-003, in its clause "The core comment patterns cannot be removed". The rest of that ADR, the config file name, its discovery order and the per-field merge, still holds. The same clause sits in that packet's `001-honest-checker/decision-record.md` ADR-003.
- **Decision:** A repository or a surface may drop (`none`) or replace any rule outside the hard floor. The floor is fixed: parse faults, conflict markers, credentials and secrets, input validation, silent failures, initialization safety, resource cleanup, accessibility for UI code, and `review-core.md`'s severity ids, reach rule and baseline security and correctness minimums. A row may drop a rule the runner checks itself but never replace it, because the runner's check changes only through the hygiene key in ADR-007. The floor ids live once in `.skilled/skills/sk-code/shared/references/universal/rule-overrides.json`.
- **Alternative:** Keep rules add-only. A repository with a different house style then stays blocked or keeps getting findings it cannot act on.
- **Reversal:** Make the linter refuse every row and drop the override seats from the quality and review contracts. Phase 001 ships the contract with no reader, so reversing before phase 002 lands touches the shared folder only.

### ADR-002: One shared override contract, and the Iron Law 3 sources it changes

- **Status:** Accepted, approved with the plan 2026-10-27
- **Supersedes:** `specs/sk-code/015-quality-agnostic-gate/spec.md` section 5, ADR-001, which lists the rule sources an UNKNOWN surface gets. One of them, the quality mode's JavaScript and CSS style checklists, is house style and retires in phase 003, and every source now honors the override sections of section 6 of the contract. The same decision sits in that packet's `004-doctrine/decision-record.md` ADR-001.
- **Decision:** Quality and review read one contract, `.skilled/skills/sk-code/shared/references/universal/rule-overrides.md`. An optional `## Rule overrides` section lives only in a checklist file an existing declaration names: a hub surface's `quality.checklists`, an outside skill's `quality` block or `.sk-code/quality.json` `checklists[]`. Rule ids use the `<class>.<name>` grammar, with review lens ids written `review.<name>`. The actions are `none` and `replace: <text>`. Precedence runs floor, repository checklist, specific surface, SKILLED fallback, default lens. A mode reads a section only through the linter's `lintOverrides`, and a file with any lint error contributes no override. Quality records each override in `p0_p1_p2_decisions`, and review records it in a `Rule sources` line. When two sources at the same level disagree, both modes apply the default and record the conflict, and quality reports that rule as unverified. Iron Law 3 then reads: an UNKNOWN surface gets the universal floor, the runner's built-in checks and the checks and checklists the repository's config names, each with its overrides applied.
- **Alternative:** A separate override format per mode. A rule switched off in quality could then return as a review finding.
- **Reversal:** Restore the earlier Iron Law 3 text in `phase-detection.md` and the UNKNOWN rows in `stack-detection.md` and `code-quality-standards.md`. Phase 003 makes those edits.

### ADR-003: No review profile

- **Status:** Accepted, approved with the plan 2026-10-27
- **Decision:** Review reads the checklists a repository already declares. That is not the review profile the operator ruled out on 2026-10-25, because it adds no new file and no new key.
- **Alternative:** A review-only profile file. The operator ruled it out.
- **Reversal:** Stop reading declared checklists in review. Phase 005 makes the change.

### ADR-004: The agent's verdict follows severity

- **Status:** Accepted, approved with the plan 2026-10-27
- **Decision:** `@review`'s pass or fail comes from severity: any P0, or an open P1, means FAIL. Its 100-point score stays as advisory information. This removes the contradiction with `sk-code-review/SKILL.md`, which rules out a numeric blocker and says P2 never blocks.
- **Alternative:** Keep the score-70 blocker. A change with no P0 or P1 can then still fail inside the speckit commands.
- **Reversal:** Restore the score gate in every runtime copy of `@review`. Phase 006 makes the change.

### ADR-005: The dispatchers add the CODE-REVIEW marker

- **Status:** Accepted, approved with the plan 2026-10-27
- **Decision:** The speckit review dispatch steps and `@orchestrate` add the `CODE-REVIEW` marker, and the floor text reads "a dispatcher adds". The marker text and its `^(DEEP-REVIEW|CODE-REVIEW)$` guards stay unchanged.
- **Alternative:** Drop the promise from the docs. The floor would then lose the marker the guards check for.
- **Reversal:** Remove the marker from the dispatch steps and restore the earlier floor text. Phase 006 makes the change.

### ADR-006: A review with no files bundles SKILLED only inside this hub

- **Status:** Accepted, approved with the plan 2026-10-27
- **Decision:** When a review names no file paths, `sk-code-skilled` stays bundled only if the working directory is inside this hub. Elsewhere generic words such as "typescript" no longer bring it in.
- **Alternative:** Keep bundling it from request words alone. A foreign repository then gets this repository's JSDoc and header rules.
- **Reversal:** Restore the vocabulary bundle. Phase 005 makes the change.

### ADR-007: One config key for machine-enforced hygiene

- **Status:** Accepted, approved with the plan 2026-10-27
- **Decision:** `commentHygiene.disableRules: [ids]` maps to a new `--disable-rule` checker flag. An unknown id gives `CONFIG_INVALID`. Secrets and conflict markers cannot be disabled. The verdict gains `config.hygiene.disabled`. Review's ticket-id lens rule maps to the same ids, so a rule disabled in quality cannot come back as a review P1.
- **Alternative:** Only the per-line `hygiene-ok` marker and whole-file `exclude`. A repository with no spec folders then marks every comment or turns every rule off.
- **Reversal:** Drop the key and the flag. `schemaVersion` stays 1, so a config without the key reads the same either way. Phase 002 makes the change.

### ADR-008: A CI profile at `.sk-code/ci.json`

- **Status:** Accepted, approved with the plan 2026-10-27
- **Decision:** The CI report, toggle and scaffold read a profile found by `--profile`, then `git config skcode.ciProfile`, then `.sk-code/ci.json`, then a generic default that forces nothing. This repository commits the Skilled profile, so its behavior is unchanged, and a contract test fails CI when that profile goes missing.
- **Alternative:** Keep the Skilled names in the scripts. Every other repository then gets false drift flags and toggle refusals.
- **Reversal:** Delete the loader and restore the constants. Phase 007 makes the change.
<!-- /ANCHOR:decisions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Predecessor**: `../015-quality-agnostic-gate/spec.md`, whose ADR-001 and ADR-003 this packet supersedes in part
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
