---
title: "Feature Specification: Phase 4: debt-report-and-hermes-gate"
description: "A report that lists shortcut comments whose trigger can never fire, and a pre-commit gate that blocks a stale Hermes skill or prompt copy."
trigger_phrases:
  - "debt report and hermes gate"
  - "phase 4 debt report and hermes gate"
  - "ceiling report"
  - "hermes mirror gate"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: debt-report-and-hermes-gate

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/092-sk-code-ponytail-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-agent-disclosure |
| **Successor** | 005-rule-amendments |
| **Handoff Criteria** | The six completion criteria in goal.md pass, and validate.sh --strict prints RESULT: PASSED |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Round two research recommendations specification.

**Scope Boundary**: The sk-code quality scripts (one new report, its test, the scripts README and one sentence in the code style guide that points to the report), the pre-commit mirror parity gate and its harness, the sk-code leaf manifest, and one overclaim in the doctor's runtime-mirrors command doc. No SKILL.md, no sk-code-review file, no agent, no repo rule, no hub registry and no generated Hermes copy changes.

**Dependencies**:
- Phases 001 to 003 and 005 of this parent are planned at the same time and some are built in parallel in the same worktree. They may regenerate other mirrors. This phase plans only its own files.
- Packet 007, phase 003-codex-mirror-gate, is the worked example for this format and for the gate edit pattern. Its tasks.md holds the exact commands reused here.
- The Hermes sync scripts require `@spec-kit/shared` from `.skilled/skills/system-spec-kit/node_modules`. The existing mirror checks already require the same package.

**Deliverables**:
- `ceiling-report.sh` lists every `ceiling:` and `intentional-limit:` comment in the tracked code files, tags the ones whose trigger can never fire, and ends with a summary line.
- `ceiling-report.test.sh` covers a measurable trigger, a missing trigger, an unmeasurable trigger and the `intentional-limit:` prefix.
- The pre-commit mirror gate runs both Hermes `--check` commands and guards `.hermes/skills` and `.hermes/prompts`. Its comment states the real check count and timing.
- The pre-commit harness has one new section that proves the Hermes checks block a drifted copy.
- The doctor's runtime-mirrors doc names only the mirrors its workflow checks.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code style guide asks authors to mark a deliberate shortcut with a `ceiling:` comment that names the ceiling and the upgrade trigger, and the review checklist downgrades a finding on the strength of such a comment. Nothing lists those markers, so a marker whose trigger can never fire stays unseen. Separately, the pre-commit mirror gate checks the other generated mirrors but not the two Hermes copies, so a commit can ship a stale Hermes copy and only the Hermes CI job catches it after a push.

Measured at planning: an anchored search of the tracked code files finds no `ceiling:` marker, so the first report shows zero markers and acts as a guard for later ones. Both Hermes checks pass today (70 skill copies, 37 prompts). The six existing mirror checks take 0.21 seconds together and the Hermes pair takes 0.27 seconds, so the gate's comment that says "under a quarter of a second" stops being true once the pair is added.

### Purpose
A shortcut whose trigger can never fire is listed by one command, and a stale Hermes copy blocks the commit that would ship it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new report script and its test in `sk-code-quality/scripts/`, in the same language and style as the neighbouring comment-hygiene checker.
- The scripts README row set, and one sentence in the code style guide's "Mark intentional simplifications" section that points to the report.
- The two Hermes `--check` entries, the two Hermes output trees and the gate comment in the pre-commit mirror gate.
- One new section in the pre-commit harness for the Hermes checks.
- The sk-code leaf manifest, regenerated and checked. The new script is not a declared leaf, so the expected result is no byte change.
- The overclaim in the doctor's runtime-mirrors command doc, which names Hermes mirrors the doctor does not check.

### Out of Scope
- `sk-code-review/assets/code-quality-checklist.md`, which reads the `ceiling:` marker. The sk-code-review folder is frozen for this phase because another child owns it.
- Every SKILL.md. `sk-code-quality/SKILL.md` has a scripts list at lines 315 to 317 and a packet version at line 5. Adding the report there, or bumping the version, needs a SKILL.md edit. The proposed edit is named in plan.md and not made.
- `.skilled/hooks/git/pre-commit`. It has no mirror gate (a search for `MIRROR_CHECKS` finds nothing in it), so nothing is added there.
- Adding Hermes to the doctor's runtime-mirrors workflow. The doc is corrected to what the workflow checks, and extending the workflow is a separate decision.
- The `.hermes/` output trees. Their own generators write them, and this fix regenerates none.
- The live hook in the main checkout. `core.hooksPath` runs that copy, so this worktree commits against the old gate until the change reaches it.
- Ponytail's debt skill under `specs/sk-code/011-sk-code-poinytail-based-refinement/context/`. That folder is data and is only read.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh` | Create | Python 3 report behind a `.sh` entrypoint, executable, with the same shape as `check-comment-hygiene.sh` |
| `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh` | Create | Bash fixture harness in the style of `check-comment-hygiene.test.sh` |
| `.skilled/skills/sk-code/sk-code-quality/scripts/README.md` | Modify | Names the third checker, adds two contents rows, adds the test command to the validation section |
| `.skilled/skills/sk-code/shared/references/universal/code-style-guide.md` | Modify | One sentence in "Mark intentional simplifications" pointing to the report |
| `.skilled/skills/sk-code/leaf-manifest.json` | Regenerate, expected unchanged | `generate-leaf-manifest.cjs --write`; any byte change is a finding to report, not a hand edit |
| `.skilled/scripts/git-hooks/pre-commit` | Modify | Two Hermes entries in `MIRROR_CHECKS`, two entries in `MIRROR_OUTPUTS`, and the mirror gate comment |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modify | One new section before the summary line, for the Hermes checks |
| `.skilled/commands/doctor/runtime-mirrors.md` | Modify | Line 59 loses the Hermes claim |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/004-debt-report-and-hermes-gate/implementation-summary.md` | Modify | Filled at completion |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/004-debt-report-and-hermes-gate/goal.md` | Modify | Log rows only, at completion |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/004-debt-report-and-hermes-gate/scratch/` | Create | Before and after copies, output captures and a probe file |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/004-debt-report-and-hermes-gate/description.json` and `graph-metadata.json` | Regenerate | `repair-derived.cjs --apply` at planning; the packet's own derived files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The report prints every shortcut-marker comment in the default tracked code files, one line each, and exits 0 when it runs. An unknown option or a path that is missing or is a directory exits 2 | `ceiling-report.test.sh` passes. The repo run exits 0 and ends with the summary line. A missing path exits 2 |
| REQ-002 | A marker naming no trigger is tagged `no-trigger`. A marker whose trigger has no number and no measurable term is tagged `no-signal`. Any other marker has no tag | The test fixtures print `[no-trigger]`, `[no-signal]` and `[]` for the three cases |
| REQ-003 | The report test covers a measurable trigger, no trigger, an unmeasurable trigger, the `intentional-limit:` prefix and a prose mention that is not a marker | `ceiling-report.test.sh` prints `All ceiling report test cases passed` and exits 0 |
| REQ-004 | The pre-commit mirror gate runs `sync-skills-hermes.cjs --check` and `sync-prompts-hermes.cjs --check` and guards `.hermes/skills` and `.hermes/prompts` | The new harness section shows a drifted Hermes skill copy blocking the commit, with `sync-skills-hermes.cjs failed` in the log, and shows the prompts check receiving `--check` |
| REQ-005 | The pre-commit file parses, and both Hermes `--check` commands exit 0 on the tree | `bash -n` exits 0. Each Hermes check prints a PASS line and exits 0 |
| REQ-006 | The pre-commit harness stays green with the new section | `pre-commit gates: 71 passed, 0 failed`, exit 0 |
| REQ-007 | The sk-code leaf manifest still passes the fleet freshness gate after the new script | `ci-leaf-manifest-freshness.cjs` prints `failed=0` and exits 0 |
| REQ-008 | The rule-copy check still passes after the style guide sentence | `check-rule-copies.js` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | The report is documented in the scripts README, with its test command, and the style guide points to it | `grep -n 'ceiling-report'` finds the README rows and the validation line, and the style guide sentence |
| REQ-010 | The mirror gate comment states the real check count and the measured time | The comment says eight checks, `grep -n 'Six\|six\|quarter'` on the pre-commit file prints nothing and exits 1, and the timing sentence matches the measurement saved in scratch/after |
| REQ-011 | `runtime-mirrors.md` describes only the mirrors its workflow checks | `grep -n 'Hermes'` on the doc prints nothing and exits 1 |
| REQ-012 | No file outside the Files to Change table changes | A `git status --porcelain` over the touched paths, compared with the copy saved in scratch/before, shows only planned paths |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A marker with no trigger appears in the report tagged `[no-trigger]` and in the summary count, and the repo run ends with the summary line.
- **SC-002**: A drifted Hermes skill copy stops the commit at the pre-commit gate. Before this change only the Hermes CI job caught it, after a push.
- **SC-003**: The gate comment, the doctor doc and the scripts README each state what is now true, and the leaf manifest is shown unchanged or the difference is reported.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The live hook is the main checkout's copy. `core.hooksPath` resolves to `~/.config/git/hooks`, and its `pre-commit` links to `Public/.skilled/scripts/git-hooks/pre-commit` in the main checkout, which has no Hermes entries | High | The harness proves the worktree file. Say in the close-out that the live gate changes only when the main checkout takes the change |
| Risk | The gate runs on every commit, so a stale Hermes copy from any child blocks every commit in the repository, not only Hermes commits | High | Whoever edits `.skilled/agents` regenerates the `agent-<name>` Hermes copies in the same commit, because those copies come from that folder. Whoever edits any SKILL.md regenerates its copy. Both `--check` commands run before any commit |
| Risk | The gate's timing sentence goes false once the pair is added | Low | Measured at planning: six checks 0.21 s, Hermes pair 0.27 s, eight together 0.48 s. The builder re-measures and writes the new figure |
| Risk | The brief says the Hermes skills check takes 0.41 seconds. Planning measured 0.24 seconds | Low | The builder re-measures in Phase 1 and records the figure it sees |
| Risk | A bare-word match on `ceiling:` would count identifiers and prose, not only markers | Medium | The report matches the marker only at the start of a quote-aware comment (decision D1). This departs from the brief's word "containing", and the operator is asked to accept it |
| Risk | Fixture strings in the new test file could count as debt in the repo run | Low | Detection skips text inside quotes, as the hygiene checker does, so the fixtures never count as markers |
| Dependency | `@spec-kit/shared` under `.skilled/skills/system-spec-kit/node_modules` | Medium | The Hermes scripts need it, as the existing mirror checks do. A checkout without the install blocks commits, as it already does for those checks |
| Risk | The packet version and a changelog entry are not written | Low | The version lives in `sk-code-quality/SKILL.md`, which this phase may not edit. The operator decides the release (open question 1) |
| Risk | The phase's changelog folder is missing | Low | `../changelog/` does not exist under this packet at planning. Open question 4 asks where the entry goes |

## 7. OPEN QUESTIONS

1. Answered by the orchestrator, 2026-10-10: no version bump and no changelog entry. Phases 002 to 007 changed sk-code packets without either, and the bump needs a SKILL.md edit this phase may not make.
2. Answered: not in this phase. A SKILL.md edit would regenerate a Hermes copy and re-mint the compiled manifest while a sibling child owns that re-mint. The one-line addition in plan.md stays a recorded follow-up.
3. Answered: no. The pre-commit gate is the local Hermes check; this phase corrects the doc only.
4. Answered: none, for the reason in answer 1.
5. Answered: the anchored match (the marker only at the start of a comment) is accepted. The convention is a comment prefix, and a bare-word match counts unrelated code such as `project_ceiling: int`.
<!-- /ANCHOR:risks -->

---
