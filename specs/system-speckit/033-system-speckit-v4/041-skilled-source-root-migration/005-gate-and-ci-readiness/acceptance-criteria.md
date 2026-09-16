---
title: "Acceptance Criteria: Gate and CI Readiness"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/005-gate-and-ci-readiness"
    last_updated_at: "2026-09-17T00:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Marked ten criteria Met with observed evidence"
    next_safe_action: "Meet AC-006 and AC-009 once the contract reviews run and the tip is pushed"
    blockers:
      - "GPT-5.6 reviews blocked by the Codex usage limit"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-005-acceptance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Gate and CI Readiness

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/005-gate-and-ci-readiness
**Level:** 2
**Status:** In Progress
**Date:** 2026-09-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Every command runs from the worktree root unless it names another directory.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase tip and an L1 clone of it, When every gate script path is resolved, Then each literal `.opencode/` gate input exists in both | `bash .github/scripts/check-gate-inputs.sh` reports no `gate-files` or `hook-inputs` failure on the tip, and the drill's L1 section prints its PASS line Observed on 2026-09-17: the check reports no failure of any kind on the tip, and the drill's moved-and-whole section passes. | Met | - |
| AC-002 | REQ-002 | Given staged or pushed changes only under `.skilled/`, When pre-commit and pre-push run, Then the agent, mirror, card-sync, mutation-class, route re-mint, skill-detector and routing-byte filters all match them | `bash .github/scripts/check-gate-inputs.sh` reports no `filter-twins` failure for a hook file, and the `.skilled/` trigger cases in `pre-commit.test.sh` and `pre-push.test.sh` pass Observed: no `filter-twins` failure, and the `.skilled/` trigger cases pass in both harnesses. | Met | - |
| AC-003 | REQ-003 | Given a gate script missing under both roots, When its hook runs in a repository with the spec-kit sentinel, Then a blocking gate exits 1 with `BLOCKED [gate:<name>]` and the path, and a gate that cannot block prints `WARNING [gate:<name>]` with its exit status unchanged. When the same hook runs in a repository without the sentinel, Then it exits 0 with no output | The missing-script and foreign-repository cases pass in `pre-commit.test.sh`, `pre-push.test.sh`, `prepare-commit-msg.test.sh`, `autostash-orphan-guard.test.sh` and `.opencode/bin/tests/check-git-hooks.test.sh` Observed: every missing-script and other-repository case passes in all five harnesses, under `/bin/bash` 3.2.57. | Met | - |
| AC-004 | REQ-004 | Given the workflows and the dependabot config, When their `.opencode/` filter entries are compared with their `.skilled/` twins, Then there are 56 twins in workflows and 1 in dependabot, and the agent name filter admits `skilled` | `grep -hcE "^[[:space:]]+- '\.skilled/" .github/workflows/*.yml` sums to 56 and `grep -c '/\.skilled/\*\*' .github/dependabot.yml` prints 1. `grep -n 'skilled' .github/workflows/agent-mirror-sync.yml` shows the filter line, and the check reports no `filter-twins` failure Observed: the grep sums to 56, dependabot prints 1, line 29 admits `skilled`, and the check reports no `filter-twins` failure. | Met | - |
| AC-005 | REQ-005 | Given the six missing-guard conditionals, When their guard file is absent, Then each step fails with `::error::` and exit 1 | `grep -c 'exit 0'` shows none left in those six guard blocks, and each block prints `::error::` then `exit 1` (checked by reading the six diffs) Observed: each of the six guard steps, run in a directory without its guard, exited 0 before the change and exits 1 with `::error::` after it. | Met | - |
| AC-006 | REQ-006 | Given the phase tip, When the independent check runs locally and in CI, Then it prints `RESULT: PASSED` with nonzero counts, its fixture test passes and it lives outside `.opencode/` and `.skilled/` | `bash .github/scripts/check-gate-inputs.sh; echo "exit=$?"` prints `RESULT: PASSED` and `exit=0`, and `bash .github/scripts/tests/check-gate-inputs.test.sh` passes. `grep -n 'paths:' .github/workflows/gate-inputs.yml` prints nothing, and `gh run list --workflow gate-inputs.yml` shows `success` on the pushed tip Local half observed: `RESULT: PASSED`, `exit=0`, the fixture test 8 of 8 and no `paths:` key. The CI run waits for a pushed tip, which waits for the contract reviews. | Unmet | - |
| AC-007 | REQ-007 | Given the drill's moved clone, When each gate input is deleted in turn, Then the check exits 1 naming it and its hook blocks or warns, while the same break under the pre-change hooks exits 0 with no gate output | `bash .github/scripts/tests/broken-move-drill.sh; echo "exit=$?"` prints a PASS line per break, the pre-change and foreign control lines, `RESULT: PASSED` and `exit=0` Observed: 48 expectations, `RESULT: PASSED`, `exit=0` in 49 s. | Met | - |
| AC-008 | REQ-008 | Given the 126-case baseline at `728c4f3efc`, When every hook test script runs from the final state, Then each passes at or above its baseline count and every new case was seen failing first | Summaries read at or above `pre-commit` 25, `pre-push` 19, `prepare-commit-msg` 51, `commit-msg` 17, `autostash-orphan-guard` 2 and `mass-deletion-guard` 12, each with 0 failed. `check-git-hooks.test.sh` and `check-gate-inputs.test.sh` pass, and `goal.md` names the negative-control run Observed from the tip: 9, 17, 12, 49, 32 and 56 passing, 175 in all with none removed, plus `check-git-hooks.test.sh` 4 of 4. `goal.md` names each unit's negative control. | Met | - |
| AC-009 | REQ-009 | Given each contract change named in plan §DELEGATION, When `gpt-5.6-sol` reviews it on cli-codex, Then every finding is fixed or answered before its commit | The review table in `implementation-summary.md` lists unit, finding count and disposition for each contract unit, backed by the returns kept in `scratch/delegation/` The T025 review stopped at Codex's usage limit before a verdict, and the other four have not started. `implementation-summary.md` carries the review table. | Unmet | - |
| AC-010 | REQ-010 | Given every file this phase changes, When the comment hygiene checker and the naming guard run, Then no comment carries an ephemeral id and no new file name is snake-case | `.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <file>`, run directly rather than through `bash`, exits 0 or 2 for each changed file, and a grep of the comment lines added to extensionless hooks finds no ephemeral id, and `python3 .opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py --changed-since <phase-base>` exits 0 Observed: 0 violations across the 36 changed files, and the naming guard prints `PASS:` since `7085ec3290`. | Met | - |
| AC-012 | REQ-012 | Given a scratch repository with a committed `legacy_name.yaml`, When it is moved unchanged into a new kebab-case directory, renamed to `other_name.yaml`, and moved into `new_dir_x/`, Then the guard passes the first and reports the second and third | The guard's pytest suite with the three new cases, each seen failing before the change, and a guard run on a rehearsal clone of the move that prints the `PASS:` line Observed: suite 7 of 7 with the first and third new cases failing against the earlier guard, and a rehearsal clone with the move staged printing `PASS:`. | Met | - |
| AC-011 | REQ-011 | Given the scripts the gates call, When this phase closes, Then `implementation-summary.md` names each one whose own root literal remains, with its line | The handoff list names `check-agent-mirror-sync.cjs:28` and `:32`, `lib/mirror-sync-verify.cjs:19`, `hooks/shared/hook-flags.sh:15`, `sk-git/scripts/worktree-naming.sh:145`, the `--skill-root` handling in `compiled-route-manifest.cjs`, `install-git-hooks.sh:30` and `hooks/git/install-hooks.sh:15` Observed: the handoff list in `implementation-summary.md` names all seven with their lines, plus the naming guard's `.opencode/specs` literals at `:199` and `:304`, which a supplementary review found. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

Ten of the twelve criteria are met on local evidence. AC-006 needs CI runs on a pushed tip and AC-009 needs the GPT-5.6 contract reviews, and nothing is pushed until those reviews complete. Codex's usage limit lifts on 2026-09-19 at 10:29.
<!-- /ANCHOR:closure -->
