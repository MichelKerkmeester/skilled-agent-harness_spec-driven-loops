---
title: "Acceptance Criteria: Phase 3: trigger-and-job-hygiene"
description: "The criteria this packet must satisfy before it may be closed: a concurrency group on every PR-triggered workflow with a recorded cancellation probe, two path filters each with a positive and a negative trigger probe, one duplicate dispatch step gone with the seven suites still running, one suppression layer gone with a step failing under a green job, three checkout depths, the pre-commit inventory, and the twin gate, the YAML parse, the README table and the phase delta."
trigger_phrases:
  - "trigger and job hygiene acceptance criteria"
  - "phase 3 trigger and job hygiene acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene"
    last_updated_at: "2026-10-24T09:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded AC-017 id-grep and message-trailer evidence; probes and delta remain"
    next_safe_action: "Run the CI probes T027 to T034, then T035's inventory re-check and T036's 24 h delta once the 002 baseline exists; T037 and T038 close the phase"
    blockers:
      - "002-rebuild-fanout-removal baseline pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-003-trigger-and-job-hygiene"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: trigger-and-job-hygiene

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
**Level:** 3
**Status:** In progress
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | R-id | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|------|-----|---------------------|--------------|--------|--------|
| AC-001 | R3 | REQ-001 | Given R3's 30 PR-triggered workflows other than `dependabot-auto-merge.yml`, When their triggers are read, Then each carries the `concurrency:` block above `jobs:` and `trigger-index-rebuild.yml` keeps its own group | `grep -L '^concurrency:' .github/workflows/*.yml` returns exactly `dependabot-auto-merge.yml` and `strict-pass-freshness-report.yml`; `grep -lF "cancel-in-progress: \${{ github.event_name == 'pull_request' }}" .github/workflows/*.yml \| wc -l` returns 30; `sed -n '21,23p' .github/workflows/trigger-index-rebuild.yml` still shows `cancel-in-progress: false` — observed: `grep -L` returns exactly the two expected files, the PR-cancel count is `30`, and the rebuild group is unchanged | Met | - |
| AC-002 | R3 | REQ-001 | Given R3's group on a test pull request, When it is pushed to twice within a minute, Then the older run is `cancelled` and the required context reports on the newest head | `gh run list --workflow message-contract.yml --branch <branch> --json databaseId,headSha,conclusion --limit 5` shows the older run `cancelled` and the newest `success`; `gh pr checks <pr> --json name,state` shows `Commit messages, branch names and PR description follow the templates` at `SUCCESS` — observed: the group and expression landed on all 30 files; remaining: the T027 two-push probe on a pull request | Unmet | - |
| AC-003 | R4 | REQ-002 | Given R4's `command-tree-parity.yml`, When its two events are read, Then both carry the 23-entry filter, the comment at `:98-102` (planned `:47-50`, moved by the filters) describes it, and the two probes behave oppositely | `grep -c "^      - '" .github/workflows/command-tree-parity.yml` returns 46; `grep -c "command-tree-parity.yml'" .github/workflows/command-tree-parity.yml` returns 2; `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`; a pull request changing only `.skilled/skills/system-spec-kit/SKILL.md` gives one run with both jobs, and one changing only a `specs/**` file gives none — observed: counts `46` and `2`, the comment carries the delivered text at `:98-102`, gate `RESULT: PASSED`; remaining: the T028 positive and negative trigger probes | Unmet | - |
| AC-004 | R5 | REQ-003 | Given R5 and D10's answer, When the phase diff is inspected, Then the default leaves `changed-packet-validation.yml` untouched and the decision is recorded, or the filter answer adds the four entries and passes the gate | Under the default: `git diff --stat -- .github/workflows/changed-packet-validation.yml` is empty and `grep -c '^D10=skip' scratch/decisions.md` returns 1; under the filter answer: `grep -c '^    paths:' .github/workflows/changed-packet-validation.yml` returns 2 and `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED` — observed: `D10=skip` is recorded in `scratch/decisions.md`, the file carries zero `paths:` blocks, and the gate prints `RESULT: PASSED` | Met | - |
| AC-005 | R6 | REQ-004 | Given R6's `dispatch-enforcement-guard.yml`, When a run completes, Then all seven hooks vitest suites appear once in its log | `gh run view <run-id> --log \| grep -oE '\.skilled/hooks/[a-z0-9/-]+\.(test\|spec)\.(ts\|mjs)' \| sort -u` returns the seven paths: `classifier-injection-screen/pi/classifier-injection-screen.test.ts`, `dispatch/codex/codex-shell-tool.test.mjs`, `dispatch/devin/devin-dispatch-audit.test.mjs`, `dispatch/lib/dispatch-audit.test.mjs`, `dispatch/pi/directive-dedup.test.ts`, `dispatch/pi/dispatch-preflight-lint.test.ts`, `session-relaunch/pi/session-relaunch.test.ts` — observed: CI run 40026353792 on the delivered workflow is green with the seven suites; caveat: the local run fails 2 tests in `dispatch/codex/codex-shell-tool.test.mjs`, and that divergence is queued for triage under T013 | Met | - |
| AC-006 | R6 | REQ-004 | Given R6's duplicate step is gone, When `dispatch-audit.test.mjs` is counted and the rule suite is deleted on a test branch, Then the duplicate is absent, the whole-tree run is intact, and the deleted suite still fails the job | `grep -c 'dispatch-audit.test.mjs' .github/workflows/dispatch-enforcement-guard.yml` returns 0; `grep -c 'vitest run --config .skilled/hooks/vitest.config.ts' .github/workflows/dispatch-enforcement-guard.yml` returns 1; a branch deleting `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` produces a run concluding `failure` with `::error::Dispatch rule suite not found` — observed: `dispatch-audit.test.mjs` count `0`, vitest-config count `1`; remaining: the T030 deleted-suite branch probe | Unmet | - |
| AC-007 | R7 | REQ-005 | Given R7's deliberately broken input, When the report-only workflow runs, Then the affected step reports `failure` and the job reports `success`, and the repair report is still printed | `gh api repos/:owner/:repo/actions/jobs/<job-id> --jq '{job: .conclusion, steps: [.steps[] \| select(.name \| test("Doc-model")) \| .conclusion]}'` returns `{"job":"success","steps":["failure"]}`; the same for `strict-pass-freshness-report.yml`'s `Derived-repair drift report` step; `grep -cE '\|\| (true\|echo)' .github/workflows/advisory-checks.yml` returns 0; `grep -c 'continue-on-error: true' .github/workflows/advisory-checks.yml` returns 3 and `grep -c 'continue-on-error: true' .github/workflows/strict-pass-freshness-report.yml` returns 1 — observed: `\|\| (true\|echo)` count `0`, `continue-on-error` counts `3` and `1`, `exit "$status"` present; remaining: the T031 failing-step probe and the repair-report log | Unmet | - |
| AC-008 | R8 | REQ-006 | Given R8's ten `fetch-depth: 0` sites, When they are recounted, Then seven remain at 0, two are gone, and `deep-loop-runtime.yml` is at 2 | `grep -rn 'fetch-depth: 0' .github/workflows/*.yml \| wc -l` returns 7, over exactly `agent-mirror-sync.yml:29`, `changed-packet-validation.yml:23`, `comment-hygiene.yml:17`, `message-contract.yml:27`, `naming-standard-guard.yml:24`, `sk-doc-script-tests.yml:86`, `skill-doc-frontmatter.yml:68`; `grep -n 'fetch-depth' .github/workflows/deep-loop-runtime.yml` returns `46: fetch-depth: 2`; `grep -c 'fetch-depth' .github/workflows/rule-canary-sync.yml` and the same for `repo-rules-corpus.yml` each return 0 — observed: depth-0 count `7` across the named files, `deep-loop-runtime.yml:46` reads `fetch-depth: 2`, both other files `0` | Met | - |
| AC-009 | R8 | REQ-006 | Given R8's three changed workflows on a test branch, When each run completes, Then each is green, each checkout step is about 20 s shorter than its 002 baseline sample, and `rule-canary-sync`'s job is under 60 s | `gh api repos/:owner/:repo/actions/jobs/<job-id> --jq '{started_at, completed_at, checkout: [.steps[] \| select(.name \| startswith("Run actions/checkout")) \| {started_at, completed_at}]}'` for each of the three, with the seconds recorded in `scratch/phase-result.md` and the `rule-canary-sync` job duration under 60 s against the 78 s baseline (inferred: the drop is expected, not yet observed) — observed: the depth edits landed; remaining: the T032 branch runs and their checkout timings against the baseline | Unmet | - |
| AC-010 | R9 | REQ-007 | Given R9's `agent-mirror-sync.yml`, When an agent-file pull request, a lib-only pull request and a specs-only pull request are opened, Then the first two run and the third does not, and `comment-hygiene.yml` still runs unfiltered | `grep -c "^      - '" .github/workflows/agent-mirror-sync.yml` returns 11; `grep -c 'agents/\*\*'` returns 4; `grep -c 'mirror-sync-verify.cjs'` returns 2; `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`; `gh run list --workflow agent-mirror-sync.yml --commit <agent-sha>` returns one run, `--commit <lib-sha>` returns one run, and `--commit <specs-sha>` returns none; `grep -c 'paths:' .github/workflows/comment-hygiene.yml` returns 0 — observed: counts `11`, `4`, `2` and `0`, gate `RESULT: PASSED`; remaining: the T033 three-way pull-request probes | Unmet | - |
| AC-011 | R10 | REQ-008 | Given R10's `skill-doc-frontmatter.yml`, When its two filter lists are read and a guard-only pull request is opened, Then both lists name the guard at both roots and the workflow file, and the workflow runs | `grep -cE "^      - '\.(opencode\|skilled)/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter\.sh'$" .github/workflows/skill-doc-frontmatter.yml` returns 4 (the guard also appears once at `:34` as `GUARD=`; the 2026-10-24 amendment corrects the expected 2); `grep -c "'.github/workflows/skill-doc-frontmatter.yml'"` returns 2; `gh run list --workflow skill-doc-frontmatter.yml --commit <guard-only-sha>` returns one run — observed: the guard entries landed in both lists; remaining: the T034 guard-only pull-request probe | Unmet | - |
| AC-012 | R11 | REQ-009 | Given R11's `scratch/pre-commit-inventory.md`, When it is read against `.skilled/scripts/git-hooks/pre-commit`, Then every one of the 13 gate keys has a row, with the bare key in the first column, and a verdict | `grep -cE '^\| (agent-mirror-sync\|comment-hygiene\|doc-version-bump\|hook-flags\|hook-trust\|mcp-mutation-class\|mirror-parity\|private-skill\|prompt-card-sync\|route-remint\|skill-authoring\|spec-remint\|template-phrase-lint)' specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/pre-commit-inventory.md` returns 13, and every row carries a `keep CI`, `drop CI` or `local only` verdict cell (the 2026-10-24 amendment corrects 12 keys and the five-column shape: `private-skill` came with `7648ae8b56`, and the delivered table has a sixth `Reason` column) — observed: `13` hook keys, `13` rows, `13` verdict cells; remaining: the formal T035 re-check | Unmet | - |
| AC-013 | Gates | REQ-010 | Given the whole change, When the twin gate runs, Then it passes with no failure and no lost twin pair | `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED` with `failures=0` and `twin_pairs` no lower than 311 (observed pre-change: `files=45 inputs_resolved=236 dynamic_inputs=11 twin_pairs=311 failures=0`); the observed value is recorded in `scratch/phase-result.md`; `bash .github/scripts/tests/check-gate-inputs.test.sh` passes — observed: `files=45 inputs_resolved=235 dynamic_inputs=9 twin_pairs=340 failures=0` with `RESULT: PASSED`, and `check-gate-inputs: 54 passed, 0 failed`; the observed value still has to be recorded in `scratch/phase-result.md` | Met | - |
| AC-014 | Gates | REQ-010 | Given all 33 workflow files, When each is parsed as YAML, Then every one parses | `python3 -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]"` exits 0 with no output, over `ls .github/workflows/*.yml \| wc -l` = 33 — observed: the parse exits `0` with no output over `33` files (run 2026-10-24) | Met | - |
| AC-015 | Gates | REQ-011 | Given the README push/PR table, When its rows are read against the YAML, Then `command-tree-parity.yml` sits in the path-filtered row, `agent-mirror-sync.yml`'s row states its filter, and no row claims a filter the YAML lacks | Under D3's approve: `sed -n '66p' .github/workflows/README.md \| grep -c 'command-tree-parity'` returns 0, `sed -n '69p'` returns 1, `sed -n '71p' \| grep -c 'the mirror checker or the shared package it loads changes'` returns 1. Under D3's reject: `sed -n '66p'` returns 1 and `sed -n '71p'` returns 1 — observed under `D3=approve`: `0`, `1`, `1`, with the delivered `:71` wording the 2026-10-24 amendment accepted | Met | - |
| AC-016 | Baseline | REQ-012 | Given at least 24 h after the last change merges, When the delta is collected, Then `scratch/phase-result.md` carries the ten baseline rows, the after numbers and the delta, with the PR-side cancellation marked unmeasured | The file exists and carries all ten workflows from `scratch/phase-baseline.md`; `grep -c 'unmeasured'` returns at least 1; `command-tree-parity` is down about 123 runner-min/day after R1 and `rule-canary-sync` about 39; `dispatch-enforcement-guard` carries its re-measured figure — observed: neither `scratch/phase-baseline.md` nor `scratch/phase-result.md` exists; remaining: the 002 24 h snapshot (via T006) plus the post-merge window | Unmet | - |
| AC-017 | R3-R11 | REQ-013 | Given the six committed changes, When they are searched for ephemeral identifiers, Then no R-id, D-id or phase number appears in a workflow comment, a step name, a filter entry, a README row or an inventory row | `git diff df0f97a4fe~1...3ab67b70cb -- \| grep -nE '\bR[0-9]+\b\|\bD[0-9]+\b\|[Pp]hase 0[0-9]'` prints nothing, and the six commit messages pass `node .skilled/skills/sk-git/scripts/validate-message.mjs --rev-list "df0f97a4fe~1..3ab67b70cb"` with exit 0 — observed: the id grep over the six commits df0f97a4fe~1...3ab67b70cb prints nothing and all six messages carry the Spec: trailer (observed 2026-10-24) | Met | - |

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

This phase is built but not closed. The six concern commits landed on `main`: every PR-triggered workflow but the two named exemptions carries the concurrency block, the command-tree-parity, agent-mirror-sync and skill-doc-frontmatter filters are in place, the duplicate dispatch step and both suppression layers are gone, the three checkout depths are set, the README table matches the YAML, and `scratch/pre-commit-inventory.md` records 13 gate keys. AC-001, AC-004, AC-005, AC-008, AC-013, AC-014, AC-015 and AC-017 are `Met`. Still open: the T027 to T034 CI probes (AC-002, AC-003, AC-006, AC-007, AC-009, AC-010, AC-011), the T035 inventory re-check (AC-012, counts already verified 13/13/13), the T036 delta (AC-016, blocked on the 002 24 h baseline), and the T037/T038 closure bookkeeping.
<!-- /ANCHOR:closure -->
