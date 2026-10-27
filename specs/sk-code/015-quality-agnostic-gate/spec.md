---
title: "Feature Specification: Make sk-code-quality a codebase-agnostic, executable author gate"
description: "Phase parent for the sk-code-quality author gate. It makes the gate work in any repository, runs the checks a repository names, blocks on evidence it can prove and hands one machine verdict to the agents that read it."
trigger_phrases:
  - "quality agnostic gate phase parent spec"
  - "sk-code quality codebase agnostic"
  - "executable author gate"
  - "sk-code quality runner"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate"
    last_updated_at: "2026-10-26T20:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed phase 010, all ten phases Complete"
    next_safe_action: "None; phase 010 closed T039, T040 and T041 on 2026-10-27"
    blockers: []
    key_files:
      - "spec.md"
      - "goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-26-skcode-015"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Placement of this packet: top level here, or a child of 014 as the design recommends. The operator confirms at program end."
    answered_questions:
      - "Operator confirmation of the six decisions in section 5: confirmed 2026-10-26, none reversed."
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

# Feature Specification: Make sk-code-quality a codebase-agnostic, executable author gate

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
| **Parent Spec** | None. This is a top-level packet in the sk-code track |
| **Parent Packet** | sk-code track |
| **Predecessor** | `014-code-modes-research` |
| **Successor** | None |
| **Handoff Criteria** | Each phase folder in the map passes `validate.sh --strict` on its own folder, and the whole packet passes recursive strict validation with `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `sk-code-quality` mode is the author-side gate that runs before a completion claim. It is written for this framework's own layout, so it does not work as a codebase-agnostic gate. The code as it stands shows five gaps.

- **UNKNOWN deadlocks.** Iron Law 2 bars a Phase 1 completion claim without the Phase 1.5 quality gate. Iron Law 3 bars any standard on an UNKNOWN surface until the user names it (`.skilled/skills/sk-code/shared/references/phase-detection.md:108-109`). A repository with no surface packet can never finish a pass. The mode's ESCALATE IF list opens with "Surface detection is ambiguous" (`.skilled/skills/sk-code/sk-code-quality/SKILL.md:254`).
- **Hygiene skips most languages.** The comment checker maps nine extensions and skips every other file (`.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:42-52`). Go, Rust, YAML, CSS and Ruby comments get no check.
- **The checks are prose.** The surface-to-checklist map is a hand-kept table (`SKILL.md:113-122`). The mode says its target-path routing is verified by a unit test (`SKILL.md:140`). The quality folder holds four test suites, and none of them tests that routing.
- **There is no executable gate.** The mode runs no command. Its verdict is prose the agent writes. The only machine check is the comment checker, which the agent must run by hand (`SKILL.md:136`).
- **No reader consumes the envelope.** The mode writes an advisory envelope with a `checker_outputs` field (`SKILL.md:206-224`). Among tracked files, only the mode's own file names that field. The verify workflow does not read it, and the @code RETURN has no quality-gate field (`.skilled/agents/code.md`).

The operator's goal, given on 2026-10-25, reads: "Sk code quality needs to be codebase agnostic and extremely usefull and integrated properly".

This packet builds on `specs/sk-code/014-code-modes-research`. Its quality-mode run (`001-quality-mode-research`) recorded the repository-bound assumptions. The design that this packet implements settles the open questions from that run. The design is a synthesized document that is not tracked in git. Its decisions, phase content and risks are restated in this spec and in each phase child.

### Purpose

When the ten phases in the map ship, the gate runs in any repository. It blocks on what it can prove, runs the checks that the repository names and reports the checks it cannot run. It hands one machine verdict to the agents that act on it. The verdict never claims a pass. It states what was checked, what blocked and what stayed unverified.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level apart from `goal.md`. All detailed planning, task breakdowns, checklists and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The comment checker reads its comment families from one table. It covers the languages it skips today, narrows three false-positive patterns and adds a rule for issue and ticket numbers.
- A runner, `quality-gate.cjs`, resolves the changed files, surfaces, checklists and checks. It prints one verdict with five exit codes and writes no file.
- A committed per-repository config, `.sk-code/quality.json`, names the commands a repository runs. A doctor route reads it, and a second route writes it once on approval.
- Doctrine: Iron Law 3 is amended, the universal checklist becomes the SKILLED house checklist, and a mechanical floor applies to every surface.
- Consumers: the verify workflow and the @code RETURN read the envelope. Surfaces declare their own checklists. Routing keywords and the advisor vocabulary change.
- Measurement on real changes, and a live benchmark report in the existing report format.
- Checker debt closeout: the ceiling report reads comment text through the checker, bare Python string statements are checked, the whole tree reaches zero findings and the live CI failure run is recorded.

### Out of Scope

These are the non-goals from the design.

- Autofix or a formatter run. Fixes stay the agent's in-place edits.
- Tool installation.
- Test running. Verification owns tests.
- A 0-100 score. The review mode owns one.
- An in-house linter or AST engine beyond the standard-library parse floor. No hub-authored Go or Java checklist.
- A generic rule for any uppercase prefix followed by digits. That rule would flag `UTF-8` and `SHA-256`.
- A `pass` value in any verdict.
- An LLM call in the runner.
- Commands taken from surface blocks or from discovery.
- A local override file and a `shared/scripts/` folder.
- Any change to the mode's tools. The mode keeps no Write tool and no subagent.
- Packet-local graph metadata.
- Any change to the whole-file scope of CI and pre-commit, and to the session-start dist self-heal.

### Frozen Program Decisions

Each phase child cites these rows. Changing one is an amendment to this spec first.

| ID | Decision |
|----|----------|
| G1 | A phase's spec documents land in a commit before any file that phase changes. |
| G2 | Every number in a document comes from a scratch measurement or the design. A number with neither source is not written. |
| G3 | Code comments state the durable reason only. A comment that a task produces never names a packet path, a phase number, or a REQ, ADR, task or finding id. |
| G4 | Each phase passes `validate.sh --strict` on its own folder before the next phase starts. The whole packet passes recursive strict validation at the end. |
| G5 | Each phase ships its own changelog entry and version bump, at the packet level and at each skill or hub level it changes. Version numbers are chosen at landing. |

### Files to Change

This table is for the audit trail. Per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` | Modify | 001-honest-checker | Comment families from one table, span stripping, docstrings, block state, `--json`, reasons, narrowed patterns |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modify | 001-honest-checker | Spec root, the unit-test claim, the default resource, the handback wording and the test list |
| `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | Modify | 001-honest-checker | Checker path resolution and one de-duplicated notice for a missing checker |
| `.github/workflows/comment-hygiene.yml` | Modify | 001-honest-checker | Checker path fallback, exit 3 handling and line annotations |
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Create | 002-builtin-runner | Runner CLI, scope, sensors, checklist resolution and rendering |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs` | Create | 002-builtin-runner | Tool probe, argv spawn, timeout and the mutation guard |
| `.skilled/skills/sk-code/sk-code-quality/assets/quality-defaults.json` | Create | 002-builtin-runner | Sensor defaults and quality-owned checklist rows, with no commands |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` | Modify | 002-builtin-runner | Per-kind marker lists beside the merged list, read by the runner |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modify | 002-builtin-runner | The runner becomes the fourth reader row |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs` | Create | 003-config-and-doctor | Config discovery, validation and merge |
| `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs` | Create | 003-config-and-doctor | Status, init as a dry run, and init with `--apply` |
| `.skilled/skills/sk-code/shared/references/phase-detection.md` | Modify | 004-doctrine | Iron Law 3 text |
| `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` | Modify | 004-doctrine | Mechanical floor and the severity crosswalk |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` | Modify | 004-doctrine | Retitled as the SKILLED house checklist |
| `.skilled/agents/code.md` | Modify | 005-consumers-and-routing | Quality step and RETURN field, with the mirrors |
| `.skilled/skills/sk-code/shared/references/workflow-verify.md` | Modify | 005-consumers-and-routing | Names the envelope fields it reads |
| `.skilled/skills/sk-code/ROUTER.md` | Modify | 005-consumers-and-routing | CODE_QUALITY keywords and resource rows |
| `.skilled/skills/sk-code/sk-code-quality/benchmark/reports/` | Create | 006-measurement | Live benchmark report folder and its index row |
| `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh` | Modify | 007-checker-debt-closeout | Reads language, family and comment text through the checker instead of its own scanner |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh`, `.skilled/skills/sk-code/sk-code-quality/assets/comment-syntax.json` | Modify | 007-checker-debt-closeout | Template literals and heredocs as strings, and every bare string statement as comment text |
| The 41 flagged files under `specs/` | Modify | 007-checker-debt-closeout | Live comments rewritten, frozen evidence marked with a per-line `hygiene-ok` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-honest-checker/ | An honest, wider checker: comment families from one table, span stripping, docstrings, block state, `--json`, reasons and narrowed patterns. No doctrine change | Complete |
| 2 | 002-builtin-runner/ | The runner with built-in checks only: scope, sensors, checklist resolution, layers, render formats, the envelope grammar, and the hub surface declarations with their reader row | Complete |
| 3 | 003-config-and-doctor/ | The `.sk-code/quality.json` seam, configured checks with argv and cwd, the mutation guard, the read-only doctor leg and the `/doctor:sk-code quality` route | Complete |
| 4 | 004-doctrine/ | Iron Law 3, the UNKNOWN rows, the SKILLED house checklist, the mechanical floor and the severity crosswalk | Complete |
| 5 | 005-consumers-and-routing/ | The envelope readers in verify, @code and review, the surface `quality` declarations and their metadata gate, routing keywords, aliases and mirrors | Complete |
| 6 | 006-measurement/ | Playbook scenarios on real changes, three compiled-routing canaries and the live benchmark report | Complete |
| 7 | 007-checker-debt-closeout/ | Closes the checker limitations phase 001 left: the ceiling report reads comment text through the checker, template literals, heredocs and bare string statements, a zero-finding tree and the live CI failure record. Depends on 001 only, and lands before 006 | Complete |
| 8 | 008-runner-limit-closeout/ | The runner's own open items: proving the checker a hook names, a read-only dist path with declared generated files, one bounded workspace listing, the guard boundary and the corrected limitation list | Complete |
| 9 | 009-review-closeout/ | The operator-accepted review items: outside-skill faults error only where they apply, a `skilled.trustRepoChecks` grant for configured checks, a bounded `node --check` pool with a five-run timing record, a `declaredSurfaces` parity test, the @code runner path and the record fixes | Complete |
| 10 | 010-alignment-audit/ | The operator's ten alignment questions: four audit lanes over the 705 files this packet and packet 053 changed, 47 findings fixed or recorded across code, skill documents, playbooks, READMEs, routing, the advisor bridge, commands and agents, fifteen version bumps with changelog entries, the CI routing fix, and an audit of `AGENTS.md` and the repo rules | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` on its own folder before the next phase begins: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/<NNN-phase> --strict`. The last line must read `RESULT: PASSED`.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume specs/sk-code/015-quality-agnostic-gate/<NNN-phase>/` to resume a specific phase.
- Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate --recursive --strict` after the last phase, to validate all phases as one unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-honest-checker | 002-builtin-runner | The checker suite passes with its new cases, and the pattern baseline has run with every delta line classed | `bash .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh` exits 0, and its last line reads `All comment hygiene test cases passed` |
| 002-builtin-runner | 003-config-and-doctor | The runner suite passes, including the foreign repository fixture | `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` exits 0 |
| 003-config-and-doctor | 004-doctrine | The setup battery lists a passing `quality` leg | `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` lists a `quality` leg that reads PASS |
| 004-doctrine | 005-consumers-and-routing | The drift guards pass on the amended doctrine | `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0 |
| 005-consumers-and-routing | 006-measurement | The mirrors and the metadata gate pass | `node .skilled/bin/check-agent-mirror-sync.cjs --all` exits 0, and `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` exits 0 |
| 001-honest-checker | 007-checker-debt-closeout | Phase 001 is on main with its checker, family table, ceiling report and suites | `bash .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh` exits 0, and its last line reads `All ceiling report test cases passed` |
| 007-checker-debt-closeout | 006-measurement | The final checker reports no finding over the whole tree, so phase 6 measures the checker this phase leaves | `git ls-files -z \| xargs -0 python3 -B .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh -- 2>&1 \| wc -l` prints `0` |
| 008-runner-limit-closeout | 006-measurement | The six requirements pass and the budget command prints five runs under two seconds | `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` prints `# fail 0`, and the five timed runs each read under `2.00` |
| 008-runner-limit-closeout | 009-review-closeout | Phases 001 to 008 are Complete and the operator accepted the review recommendations on 2026-10-26 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/009-review-closeout --strict \| tail -1` prints `RESULT: PASSED` |
| 009-review-closeout | 010-alignment-audit | Phase 9 is Complete and the operator asked the ten alignment questions on 2026-10-26 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/010-alignment-audit --strict \| tail -1` prints `RESULT: PASSED`, and `rg -c '\| Met \|' specs/sk-code/015-quality-agnostic-gate/010-alignment-audit/acceptance-criteria.md` prints `18` |

Phase 7 depends on phase 1 only. It builds in parallel with phases 3 and 4, and it must land before phase 6, which measures the final checker. Phase 6 therefore depends on phases 3, 4, 5, 7 and 8.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Placement.** The design recommends a phased child of `014-code-modes-research`, at `004`. This packet is a top-level phase parent at `015`, the folder the scaffold created. `AGENTS.md` section 6 asks for the check that it is not a child of an existing packet before a top-level packet is created. The operator confirms the placement at program end.
- **Operator confirmation.** Answered 2026-10-26. The operator confirmed the six decisions in section 5 with their defaults, and phase 009 implements the review recommendations accepted in the same reply.
- **Intent recall.** Intent recall for the compiled router is UNKNOWN in both saved runs. Phase 6 measures it again.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:decisions -->
## 5. DECISIONS TAKEN WITH DEFAULTS

The operator asked for an autonomous build. Each open decision took the design's recommended default, and the operator confirmed all six on 2026-10-26 ("Go, all is accepted as recommended"). None was reversed. Each record below is an ADR with the status line `Accepted, confirmed by the operator 2026-10-26`.

### ADR-001: Amend Iron Law 3 for UNKNOWN surfaces

- **Status:** Accepted, confirmed by the operator 2026-10-26
- **Decision:** An UNKNOWN surface gets four rule sources and no others, as Iron Law 3 in `phase-detection.md` lists them: the universal floor in `code-quality-standards.md`, the runner's built-in checks, the quality mode's own surface-neutral checklists that the runner lists (the JavaScript and CSS style checklists), and the quality checks the repository's quality config names. It stays UNKNOWN until the operator names its surface and commands, in a declared surface or in `.sk-code/quality.json`. No other standard or verification command applies to it.
- **Alternative:** Keep Iron Law 3 as written. Every repository with no surface packet then stays blocked.
- **Reversal:** Restore the earlier Iron Law 3 text in `phase-detection.md`, and the UNKNOWN rows at `stack-detection.md:32` and `code-quality-standards.md:122`. Phase 4 makes these edits, so reversing them touches that phase only. If the operator declines, phases 1 to 3 still ship, and the mode keeps asking on UNKNOWN.

### ADR-002: Scope the universal checklist to SKILLED

- **Status:** Accepted, confirmed by the operator 2026-10-26
- **Decision:** `universal-checklist.md` becomes the SKILLED house checklist. It loads only when SKILLED is a resolved surface of the target. The floor for every surface is `code-quality-standards.md`. This narrows the baseline. The 014 review remediation split the quality P0 floor into a baseline and a web overlay (`specs/sk-code/014-code-modes-research/003-review-remediation/implementation-summary.md:26`), and its ADR-001 records that split (`:103`).
- **Alternative:** Keep the checklist as the baseline for every surface. Its P0 rows then force this framework's header form and spec roots on any repository.
- **Reversal:** Restore the universal title and description at `universal-checklist.md:2-3` and `:14-16`, and the always-load row in `SKILL.md`. Phase 4 makes the edit.

### ADR-003: Config file and merge rule

- **Status:** Accepted, confirmed by the operator 2026-10-26
- **Decision:** The per-repository config is `.sk-code/quality.json`, committed at the repository root. Discovery takes `--config` first, then the git config `skcode.qualityConfig` at file scope, then `.sk-code/quality.json`, then the shipped defaults. Checks come only from the repository layer. Checklists and generated rows append across layers. The core comment patterns cannot be removed. Sensors merge per sensor. An unknown key is a config error.
- **Alternative:** A different committed name in the same place. The merge rule does not depend on the name.
- **Reversal:** Change the path in the runner contract, the config reference, the doctor route and the template. The runner reads the file from phase 3, so a change before then touches documents only.

### ADR-004: Whole-file scope for CI and pre-commit

- **Status:** Accepted, confirmed by the operator 2026-10-26
- **Decision:** The CI job in `.github/workflows/comment-hygiene.yml` and the pre-commit gate keep their whole-file scope. The author gate scopes findings to changed lines. A finding on an untouched line blocks only when one of those two layers is present (`pre-commit:145-158`, `comment-hygiene.yml:36-48`).
- **Alternative:** Move both layers to changed-line scope. That changes two blocking layers, so it needs its own decision.
- **Reversal:** Nothing in this program changes those two layers, so no reversal is needed. A later change to them is a separate packet.

### ADR-005: Benchmark report format

- **Status:** Accepted, confirmed by the operator 2026-10-26
- **Decision:** The live benchmark in phase 6 writes its report in the format of the existing reports under `.skilled/skills/sk-code/sk-code-quality/benchmark/reports/`, and it adds one row to that folder's README index. The 014 synthesis left the format to the harness owner, as rank 13.
- **Alternative:** A new format owned by the harness owner.
- **Reversal:** Rewrite the phase 6 report in the other format. Phase 6 writes the only new report, so the cost is one file.

### ADR-006: The advisor plugin keeps its own declaredSurfaces copy

- **Status:** Accepted, confirmed by the operator 2026-10-26
- **Decision:** `.skilled/plugins/system-skill-advisor.js:747-772` keeps its own copy of `declaredSurfaces`. This program leaves that copy unchanged. The runner reads the hub's reader in `router-replay-lib.cjs`.
- **Alternative:** Fold the plugin's copy into that one reader.
- **Reversal:** Not needed here. A later packet can fold the copy. Risk 7 names the drift that the copy leaves open.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:risks -->
## 6. RISKS

| # | Risk | Mitigation |
|---|------|------------|
| 1 | Newly covered languages make existing comments in this repository fail CI and pre-commit | The phase 1 baseline runs before merge. Its halt rule applies when the count is large |
| 2 | False positives in a foreign repository erode trust | Narrowed patterns, the exact or heuristic split, changed-line scope, fixture F02 and the `hygiene-ok` opt-out |
| 3 | A configured command is repository code | Only the repository layer names commands. Argv only, per-command timeouts, the content-hash guard, `--no-run`, and a doctor route that never runs them |
| 4 | Iron Law 3 is read as a license for surface standards on UNKNOWN | The amended text names the floor and the config, and nothing else |
| 5 | python3 is absent | Hygiene reports UNVERIFIED with a repair line and is never reported clean (fixture F17) |
| 6 | Hygiene additions apply in the author gate only, because pre-commit runs from a temporary copy of staged blobs (`pre-commit:142-158`) | Additions only tighten, so CI and pre-commit never block on them. Teaching those layers to read the staged config stays open |
| 7 | The advisor plugin's second `declaredSurfaces` copy drifts | Recorded as ADR-006 in section 5. Phase 009 adds a parity test that fails when the two readers disagree |
| 8 | An envelope pasted into a tracked document names a private skill | Label-only rendering, and the fixture assertion that the envelope never names a private skill |
| 9 | Secret fixtures trip a scanner | Keys are joined from fragments at run time |
| 10 | Routing changes shift the hub benchmark | Replay and benchmark gate phase 5, with a recorded fallback for the resource list |
| 11 | Other workflows land hub edits on this branch during the program | Rebase each phase on the branch head, re-check its anchors and pick version numbers at landing |
| 12 | The content hash costs time on a large diff | Phase 6 measures it against the budget of under 2 seconds of built-in checks for 50 changed files |
<!-- /ANCHOR:risks -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Research basis**: `specs/sk-code/014-code-modes-research`, and its quality-mode run in `001-quality-mode-research`
- **Parent Spec**: None. This is a top-level packet in the sk-code track
- **Parent Goal**: See `goal.md` for the durable directive, the binding table and the completion criteria
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
