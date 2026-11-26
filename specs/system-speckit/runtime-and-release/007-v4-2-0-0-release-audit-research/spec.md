---
title: "Feature Specification: Deep research audit of the v4.2.0.0 changelog against the commits since v4.1.0.0 and the recent spec folders"
description: "The v4.2.0.0 release notes are written but not yet tagged, and 1,084 non-merge commits landed since v4.1.0.0. Nobody has checked the notes against that window for missing entries, drifted claims or bugs shipped in it."
trigger_phrases:
  - "v4 2 0 0 release audit research"
  - "v4.2.0.0 changelog audit"
  - "v4.2.0.0 missing entries drift bugs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.4 -->
# Feature Specification: Deep research audit of the v4.2.0.0 changelog against the commits since v4.1.0.0 and the recent spec folders

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-25 |
| **Branch** | `worktrees/545-v4-2-audit-fixes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The v4.2.0.0 release notes at `.skilled/changelog/skilled/v4.2.0.0.md` describe a release that is not tagged yet, while work kept landing after the notes were drafted. A release published with a missing entry, a claim the code contradicts, or a defect shipped in the window misleads every operator who upgrades from it.

### Purpose
One synthesis that lists, with a commit hash and a `file:line` for each, every user-visible change the notes miss, every note the code contradicts and every bug found in code shipped in the window.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git rev-list --count v4.1.0.0..HEAD; git rev-list --no-merges --count v4.1.0.0..HEAD; wc -l < .skilled/changelog/skilled/v4.2.0.0.md; git tag --list 'v4.2*' | wc -l
1204
1084
     926
       0
```
HEAD was `c75200c504a` when this was measured.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run one `/deep:research` fan-out with two lineages: cli-codex on `gpt-6-luna` at `xhigh` on the `fast` tier, and cli-devin on `deepseek-v4-1-flash-max`, ten iterations each, convergence stop.
- Audit the window `v4.1.0.0..HEAD` (the commit list in `scratch/window-commits.txt`) and the 21 recently touched packets in `scratch/recent-packets.txt` against the release notes.
- Classify each finding as missing, drift or bug, with a commit hash, a `file:line` and the changelog line it concerns.
- Verify every finding the synthesis repeats against the repository, and settle disagreements between the two lineages by reading the code.
- Amended 2026-11-25 on the operator's instruction: fix the confirmed bugs first, then update the release notes.
- Amended 2026-11-25 on the operator's instruction: a second, native deep-research run of ten iterations audits the v4.2.0.0 logic and features for bugs, drift and bad UX. The first run's state is archived under `research_archive/20261125T162358Z/`, and the second run's synthesis is now archived at `research_archive/20261126T112816Z/research.md`.
- Amended 2026-11-25 on the operator's instruction ("fix all", scope "Everything"): fix every defect in `research_archive/20261126T112816Z/research.md` sections 2, 4 and 12 in worktree `545-v4-2-audit-fixes`, with a regression test for each behavior change. Two items stay unchanged on purpose: f-iter005-003 is pinned by design in `deep-loop-offer-cases.json:123`, and f-iter009-003 has no shown consequence. The `run_extended` lineageId is checked and changed only if a reader breaks on it.
- Amended 2026-11-26 on the operator's instruction ("After fixing dependabot", then "Fix all three groups", "Fix it and merge", "Dismiss as not used" and "Fix all three, then re-tag"): before the tag moves again, close every open Dependabot alert on `main`, merge Dependabot PR 108, and fix the three CI checks that already failed on `main`. Work on `main`.
- Amended 2026-11-26 on the operator's instruction ("Run 10 iters of deep research with luna xhigh fast to find bugs / drift / issues in all logic / skills / work done since v4.1.0.0 skilled"): a third run, generation 3, restarts the research with one cli-codex `gpt-6-luna` lineage at `xhigh` on the `fast` tier for ten iterations under a max-iterations stop. The second run's state is archived under `research_archive/20261126T112816Z/`. This run reports findings and fixes nothing.
- Amended 2026-11-26 on the operator's instruction ("FIX ALL"): fix every generation-3 finding in `research/research.md` sections 2 and 4 in a new worktree, with a regression test for each behavior change. The operator chose four things: a new sk-git worktree, a task file argument to `.skilled/bin/compiled-route.cjs` in place of the fixed `TASK` heredoc, answer evidence as the only way a default-depth question resolves, and a README sentence that documents the pre-push fail-open with no behavior change. The packet state is committed on `main` first, and a v4.2.0.0 release-notes entry follows the fixes. Merging and pushing stay the operator's to approve.

### Out of Scope
- Release-note edits beyond the confirmed findings, the reorder and the section openings the operator asked for.
- Defects the research does not list. A new defect found while fixing is recorded in `implementation-summary.md`, not fixed.
- Merging the worktree into main, pushing or tagging - the operator's to do.
- Tagging or publishing v4.2.0.0 - a release action the operator owns.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/` | Create | Fan-out state, lineage iterations and the synthesis `research.md` |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | The reserved `root/skilled` guard compares without case |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Modify | Regression test for a case-variant source |
| `.skilled/skills/sk-git/scripts/worktree-naming.sh`, its `tests/worktree-naming.test.sh`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Mode | Restore the executable bit lost in the window |
| `.skilled/changelog/skilled/v4.2.0.0.md` | Modify | Release-note fixes, after the bug fixes |
| `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/` | Create | Frozen inputs: the window commit list and the packet list |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | The runner's own stop ends every child it spawned on win32, and `--stop` on win32 says why it cannot verify a pid |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`, `runtime/feature-catalog/fanout/fanout-merge.md` | Modify | An untrusted lineage's frontier nodes claim no coverage |
| `.skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs` | Modify | The `--extend` re-stop warning counts only questions still open |
| `.skilled/commands/deep/assets/deep-research.yaml` | Modify | The pre-synthesis gate's "run more iterations" no longer enters an uninitialized loop on a fan-out run |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts`, `runtime/lib/continuity/decision-record-writer.ts` | Modify | Escaped transcript paths resolve to the right packet, the Stop write takes the canonical save lock, a written row is never reported as skipped or overwritten, and the outcome reaches the operator |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs`, `doctor-overlay-presentation.txt` | Modify | Shape-and-case destination changes, the layout-link same-file check, pasteable remedies, a relayout restore line, whole-word flag parsing, JSON errors for `--json` and a rollback staleness check |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`, `runtime/scripts/routing-accuracy/command-routing-baseline.json`, `runtime/tests/fixtures/deep-loop-offer-cases.json`, `feature-catalog/python-compat/cli-shim.md` | Modify | A refused or merely named slash command no longer anchors its hub, with the routing baseline regenerated. The degraded CLI already drops a refused command's typed mark, and a test pins it |
| `.skilled/commands/deep/assets/deep-review.yaml` and its compiled contract | Modify | The deep-review pre-synthesis gate's option B ends a fan-out run instead of returning to a loop it never set up |
| `.skilled/hooks/session-handover/goal-carry-over.md` | Modify | The goal-hop warning's description names both remedies the warning now prints |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | A refused sub-track prints its remedy |
| `.skilled/bin/skilled-loop` | Modify | The non-Claude goal-hop warning is true and names the next step |
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modify | Provisioning checks that the skill-graph database is usable and prints the scan's reason on failure |
| Tests beside each changed file | Modify or Create | One regression test per behavior change |
| `.skilled/skills/system-spec-kit/package-lock.json`, `.skilled/skills/mcp-code-mode/mcp-server/package-lock.json` | Modify | hono moves to 4.13.22, past the five advisories fixed in 4.13.16 |
| `.skilled/package.json`, `.skilled/package-lock.json`, both `.pi/extensions/*/package-lock.json`, `.pi/extensions/pi-fast-mode-w-subagent-support/package.json` | Modify | Dependabot PR 108's dev dependency group, merged |
| `.skilled/scripts/git-hooks/tests/pre-push.test.sh` | Modify | The Commit-Id fixture repository names its branch `main` at init |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Modify | The frozen README manifest is regenerated with its own `--write` command |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-auto-restart-contract.vitest.ts` | Modify | The completed-session check asserts no routing to the extend step, not the absence of the word |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/helpers/upgrade-legacy-harness.ts`, `upgrade-legacy-refresh-markers.vitest.ts`, `upgrade-legacy-host-root.vitest.ts` | Modify | The copied dist is stamped strictly newer than its backdated sources, and the refresh-markers copy skips `.workflow-lock` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/workflow-invariance.vitest.ts` | Modify | The sentinel's temp folder moves out of the checked-in tree |
| `.skilled/bin/compiled-route.cjs` and every `<<'TASK'` front-door example, the hub scaffold and its lockstep parity test | Modify | The front door reads the task from a file argument, so no task line can close a heredoc and reach the shell |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | A held child whose start time cannot be read is signalled and tracked as a survivor |
| `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modify | Pi passes its session id, so the weak-follow-up route receipt applies there |
| `.skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts` | Modify | A lowercase second sentence counts as a second sentence |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Modify | In default depth mode only answer evidence resolves a question |
| `.skilled/scripts/git-hooks/README.md`, `.skilled/scripts/git-hooks/pre-commit` | Modify | The README names the pre-push fail-open, and the header's uninstall command uses the installer |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both lineages run and write iteration state | `ls research/lineages/*/iterations/iteration-*.md` lists files under both lineage labels, and their state rows carry `target_agent: "deep-research"` |
| REQ-002 | A synthesis exists with classified, cited findings | `research/research.md` exists, and each finding it states carries a commit hash or a `file:line` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every finding reported to the operator was re-checked in the repository | Each reported finding names the command or file read that confirmed it, or it is marked unconfirmed |
| REQ-004 | Every defect in scope is fixed at its source | Each finding id in `research_archive/20261126T112816Z/research.md` sections 2, 4 and 12, except the two left on purpose, has a `Met` row in `acceptance-criteria.md` that names its test or reproduction |
| REQ-005 | No regression in the suites the fixes touch | Each touched suite passes in full, with the before and after counts recorded in `implementation-summary.md` |
| REQ-006 | The tag moves only onto a `main` with no open Dependabot alert and green CI | The Dependabot alerts API lists no open alert, PR 108 reads MERGED, and every workflow run on the tagged commit concludes `success` |
| REQ-007 | Every generation-3 finding is fixed at its source | Each of F1 to F4 and P1-pre to P3-pre in `research/research.md` sections 2 and 4 has a `Met` row in `acceptance-criteria.md` that names its test, or for a doc-only change the line that now holds |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists and `research/deep-research-config.json` reads `"status": "complete"`.
- **SC-002**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | ChatGPT OAuth for codex and Devin account OAuth | A lineage fails at dispatch | Both pre-flights passed on 2026-11-25: `codex login status` and `devin auth status` print logged in |
| Risk | A lineage cites a `file:line` that does not exist or overstates a finding | Med | Every finding the synthesis repeats is opened in the repository first, and a disagreement is settled by the code, never by a tally |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The Claude Stop hook still finishes inside its 10 s hook timeout when the canonical save lock is busy, by leaving the answers pending instead of waiting.

### Security
- **NFR-S01**: No overlay fix widens what the engine may write or delete. Every new path either adds a refusal or keeps an existing one.

### Reliability
- **NFR-R01**: A fan-out runner's own stop ends every child it spawned on every platform, and no stop path reports success while a child it could not signal is still running.
- **NFR-R02**: A decision row written by one writer is never lost or rewritten by another, and a human edit to a row survives a later Stop.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Empty input: an inbox with no lines and an inbox whose every question is answered both give the `--extend` re-stop warning.
- Maximum input: a transcript tail that names a packet path ending at any JSON escape (`\n`, `\t`, `\r`, `\"`, `\\`) resolves to that packet, not its parent.
- Failure path: a skill-graph scan that fails or leaves an empty database reports FAILED with the scan's own reason, and a rerun of the printed remedy does not report it ready.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

Research context: deep-research ran to completion on "v4.2.0.0 logic and features: remaining bugs, docs that drifted from the code, and bad UX in what shipped since v4.1.0.0". `research/research.md` stays canonical.

Research context: deep-research generation 3 ran to completion on "find bugs, drift and issues in all logic, skills and work changed since v4.1.0.0 (git range v4.1.0.0..HEAD)": ten iterations on cli-codex `gpt-6-luna` at `xhigh` on the `fast` tier. Generation 2's state is archived under `research_archive/20261126T112816Z/`, and `research/research.md` stays canonical.

- Open: find bugs, drift and issues in all logic, skills and work changed since v4.1.0.0 (git range v4.1.0.0..HEAD).

<!-- BEGIN GENERATED: deep-research/spec-findings -->
The canonical source is `research/research.md`, generation 3: ten cli-codex `gpt-6-luna` iterations at `xhigh` on the `fast` tier over `v4.1.0.0..HEAD`, stopped at the iteration cap. It found no P0 or P1. In the window it confirmed 2 P2 and 2 P3 defects, and it surfaced 3 pre-existing issues and rejected 2 candidates. Nothing was fixed in this run. Generation 2 is archived at `research_archive/20261126T112816Z/`.

- P2: a held fan-out child whose start time cannot be read is never signalled, and its lineage is closed as stopped (`fanout-run.cjs:1048`, `:5288`, `9f332867143`, `978b74e8df7`).
- P2: the fixed `<<'TASK'` heredoc in every hub's compiled-route example lets task text after a bare `TASK` line run as shell, against the v2.10.1.0 claim (`sk-code/ROUTER.md:497` and 44 more lines, including the new-hub scaffold, `991fe6d127a`).
- P3: Pi never passes `session_id` to the shared advisor handler, so its route receipts never apply (`pi/prompt-advisor.ts:290`, `c27addb7117`).
- P3: a lowercase second sentence passes the compact-field narrative check (`thin-continuity-record.ts:350`, `e1788fce8e0`).
- Pre-existing: the reducer resolves a question when an iteration's focus equals its text, a documented rule (`reduce-state.cjs:2751`), pre-push fails open on a track-root sweep error that the README omits, and the pre-commit uninstall header ignores `core.hooksPath`.
- Open: Q4 and Q5 were sampled, not exhausted.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
