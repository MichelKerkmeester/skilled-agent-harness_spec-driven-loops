---
title: "Acceptance Criteria: Phase 5: slow-and-failing-tests"
description: "The criteria this packet must satisfy before it may be closed: the three-run parallelism probe with its recorded outcome, the config flip or the two-way shard, the CLI step under 400 s with 5 green runs, the three-workflow re-check and its root causes, the five stale failures, the 10-run streak or a filed cause, no retry, the fast-fail drift step and its negative proof, the same-class inventory, the whole-tree gates and the commit hygiene."
trigger_phrases:
  - "slow and failing tests acceptance criteria"
  - "phase 5 slow and failing tests acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
    last_updated_at: "2026-10-23T14:10:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Refreshed the acceptance criteria for the Level 3 plan"
    next_safe_action: "Run the probe, then the config flip or the shard, then the re-check"
    blockers:
      - "002-rebuild-fanout-removal baseline pending; the 001 dataset stands in as provisional"
      - "runtime/cli/dist and the deep-loop and advisor trees are not installed in this worktree"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-005-slow-and-failing-tests"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: slow-and-failing-tests

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests
**Level:** 3
**Status:** Planned
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | R-id | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|------|-----|---------------------|--------------|--------|--------|
| AC-001 | R19 | REQ-001 | Given the `cli` vitest project, When it runs once serially and three times through a probe config that differs at one setting, Then `scratch/r19-probe.md` holds one serial row and three parallel rows, each with an exit code and a duration, it records exactly one outcome token, and the probe config is gone | `grep -c '^\| serial \| 1 \|'` returns `1`; `grep -c '^\| parallel \| [123] \|'` returns `3`; `grep -cE '^\| (serial\|parallel) \| [0-9]+ \| [0-9]+ \| [0-9.]+ \|'` returns `4`; `grep -cE '^outcome: (parallel\|shard)$'` returns `1`; `test ! -e .skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts` exits `0` | Unmet | - |
| AC-002 | R20 | REQ-002 | Given `.skilled/skills/system-spec-kit/vitest.config.ts` and the check job, When the probe recorded `parallel`, Then the `cli` project sets `fileParallelism: true` with a behavioural reason, the root project still sets `false`, and the comment says only the CLI project runs in parallel; When it recorded `shard`, Then `spec-kit-check.yml` runs `--shard=1/2` and `--shard=2/2` and exits non-zero when either half fails | `grep -c 'fileParallelism: true'` returns `1` and `grep -c 'fileParallelism: false'` returns `1` in `vitest.config.ts`; `grep -c 'Only the CLI project runs its files in parallel'` returns `1`; under the shard branch `grep -c -- '--shard=' .github/workflows/spec-kit-check.yml` returns `2`, `grep -c 'wait "\$first" \|\| status=1'` returns `1` and `grep -c 'wait "\$second" \|\| status=1'` returns `1`; `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/spec-kit-check.yml'))"` exits `0` | Unmet | - |
| AC-003 | R20 | REQ-003 | Given the first `Spec-Kit Check` run after the change, When its `CLI vitest project` step is timed, Then it is under 400 s, and the next 5 runs are all green | `scratch/r20-ci-step.md` holds one `\| after \|` row and `awk -F'\|' '/^\| after \|/ {gsub(/ /,"",$4); exit ($4 < 400 ? 0 : 1)}'` exits `0` and prints `UNDER_400`; the reference row reads `791`; `grep -c '^all_green: true$'` returns `1`; the `## Green streak` section holds `5` run rows, all `success` | Unmet | - |
| AC-004 | R21 | REQ-004 | Given the latest 40 runs of deep-loop-runtime, diagram-corpus and skill-advisor-stress, When `scratch/r21-recheck.md` is read, Then it has one run table and one summary row per workflow, and every failure class in the window has a root-cause row naming the failing test, the error class and the first failing SHA | `grep -cE '^## (deep-loop-runtime\|diagram-corpus\|skill-advisor-stress) runs$'` returns `3`; `grep -c '^\| run id \| createdAt \| headSha \| conclusion \|$'` returns `3`; `grep -cE '^\| (deep-loop-runtime\|diagram-corpus\|skill-advisor-stress) \| [0-9]+ \| [0-9]+ \| [0-9]+ \|$'` returns `3`; the `## Root causes` rows number at least the workflows with a non-zero failure count, and each carries a seven-character SHA: `sed -n '/^## Root causes/,/^## /p'` piped to `grep -cE '^\| (deep-loop-runtime\|diagram-corpus\|skill-advisor-stress) \| [^\|]+ \| [^\|]+ \| [0-9a-f]{7} \|'` returns `3` | Unmet | - |
| AC-005 | R21 | REQ-005 | Given the five workflows with a single old failure, When each failure and the newest run are read, Then `scratch/r21-recheck.md` records one row per workflow with the failure date, the failure SHA, the failure run id, a later green run and the verdict `closed` | `grep -cE '^\| (repo-rules-corpus\|chart-corpus\|opencode-dual-version\|routing-registry-drift\|strict-pass-freshness-report) \|'` returns `5`; each row carries its date (`2026-09-18`, `2026-10-12`, `2026-10-20`, `2026-10-17`, `2026-09-07`); `grep -c '\| closed \|'` returns `5`; every newest run reads `success` | Unmet | - |
| AC-006 | R21 | REQ-006 | Given the three workflows after their fixes, When their latest 10 runs are read, Then all 10 are `success` for each, or `scratch/r21-recheck.md` has a `filed` root-cause row for a workflow that stays red | `grep -cE '^(deep-loop-runtime\|diagram-corpus\|skill-advisor-stress): all_green=true count=10$'` returns `3`, or `grep -c '\| filed:'` returns at least `1` for each workflow whose line reads `all_green=false`; the run ids are in `scratch/r21-recheck.md` | Unmet | - |
| AC-007 | R21 | REQ-004 | Given the three workflows, When their files and the diff are searched, Then no retry, rerun or `continue-on-error` was added, and a failed run was never rerun to manufacture a streak | `rg -n 'retry\|rerun\|continue-on-error' .github/workflows/deep-loop-runtime.yml .github/workflows/diagram-corpus.yml .github/workflows/skill-advisor-stress.yml \| wc -l` returns `0`; `git diff -U0 \| grep -cE '^\+.*(retry\|rerun\|continue-on-error)'` returns `0`; `grep -c '^retry-proof: clean$' scratch/r21-recheck.md` returns `1` | Unmet | - |
| AC-008 | Gates | REQ-007 | Given the final tree, When the gates run, Then the fixture suite, the real-tree gate, the YAML parse and the strict packet validation all pass | `scratch/gate-run.log` holds one `check-gate-inputs: <N> passed, 0 failed` line, one `RESULT: PASSED` line and one `YAML_OK` line, so each `grep -c` returns `1`; `scratch/validate.log` holds one `RESULT: PASSED` line, so `grep -c '^RESULT: PASSED$'` returns `1` | Unmet | - |
| AC-009 | R21 | REQ-004 | Given the deep-loop drift class, When the workflow is read and a stale contract is swapped in, Then the fast-fail step sits above the suite, a stale contract exits `2` with `STALE_SOURCE_DIGEST`, a fresh tree exits `0`, and the tree is restored | `grep -c 'check-contract-drift' .github/workflows/deep-loop-runtime.yml` returns `1`; `grep -n 'check-contract-drift\|- name: Run the deep-loop runtime suites'` puts the checker above the suite; `grep -c '^negative-proof: exit 2 then exit 0$' scratch/r21-recheck.md` returns `1`; `git status --short .skilled/commands/deep/assets/compiled/ \| wc -l` returns `0` | Unmet | - |
| AC-010 | Hygiene | REQ-007 | Given the two commits, When their messages and the diff are read, Then neither carries an R-id, a D-id or a phase number, both messages validate, and both end with the packet trailer | `git log -2 --format=%B \| grep -cE '\bR[0-9]+\b\|\bD[0-9]+\b\|[Pp]hase 0[0-9]'` returns `0`; `git log -2 --format=%B \| grep -c '^Spec: system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests$'` returns `2`; each message passes `node .skilled/skills/sk-git/scripts/validate-message.mjs --commit <file>` with exit `0` | Unmet | - |
| AC-011 | R20 | REQ-002 | Given the five `fileParallelism` sites in four files, When the tree is searched, Then only the `cli` site changed and the four other sites still set `false` | `rg -n 'fileParallelism' .skilled/skills --glob 'vitest.config.ts' \| wc -l` returns `5`; `rg -l 'fileParallelism' .skilled/skills --glob 'vitest.config.ts' \| wc -l` returns `4`; `grep -c 'fileParallelism: true' .skilled/skills/system-spec-kit/vitest.config.ts` returns `1`; `rg -c 'fileParallelism: false' .skilled/skills/system-spec-kit/runtime/vitest.config.ts .skilled/skills/system-skill-advisor/runtime/vitest.config.ts .skilled/skills/system-deep-loop/runtime/vitest.config.ts` returns `1` for each | Unmet | - |

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

This phase is planned and not built. AC-001 to AC-011 are all `Unmet`: the probe has not run, the config still sets `fileParallelism: false` at `:67`, the 40-run re-check and the five stale confirmations do not exist, the fast-fail drift step is not in the workflow, and no post-change `Spec-Kit Check` run has been timed. The phase closes when the probe records one outcome, the config flip or the two-way shard is on disk, the `CLI vitest project` step is under 400 s with 5 green runs, each of the three workflows shows 10 green runs or a filed cause, the five old failures are recorded closed, the fast-fail step is proven against a stale contract, and `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:closure -->
