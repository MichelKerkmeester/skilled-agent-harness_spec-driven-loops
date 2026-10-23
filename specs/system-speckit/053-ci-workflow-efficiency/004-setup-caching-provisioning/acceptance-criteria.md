---
title: "Acceptance Criteria: Phase 4: setup-caching-provisioning"
description: "The criteria this packet must satisfy before it may be closed: a gate that scans composite actions with four new fixture cases, a measured cache go/no-go, one cached setup action at five sites with a cold-path run, one merged hook-and-plugin job, the multi-install substitutions kept only where a warm step drops, the pip cache, the checkout trial, the README rows, and the whole-tree gates with the phase delta."
trigger_phrases:
  - "setup caching provisioning acceptance criteria"
  - "phase 4 setup caching provisioning acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning"
    last_updated_at: "2026-10-23T13:30:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Refreshed the acceptance criteria for the Level 3 plan"
    next_safe_action: "D5 is answered; run the phase's tasks from T002"
    blockers:
      - "002-rebuild-fanout-removal baseline pending"
      - "003-trigger-and-job-hygiene R8 pending for R18"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-004-setup-caching-provisioning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: setup-caching-provisioning

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning
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
| AC-001 | R12 | REQ-001 | Given R12's scan loop, When the gate runs over the real tree, Then `.github/actions/**` is one of the file classes it reads, the file count moves from 45 to 46 when the action lands, and the run passes | `grep -c 'github/actions' .github/scripts/check-gate-inputs.sh` returns at least `2`; `bash .github/scripts/check-gate-inputs.sh` prints `files=45` and `RESULT: PASSED` before T014, then `files=46`, `inputs_resolved` at least `236`, `twin_pairs` at least `311`, `failures=0` and `RESULT: PASSED` after it | Unmet | - |
| AC-002 | R12 | REQ-001 | Given R12's four fixture cases, When the fixture suite runs, Then a clean action passes, an unresolved `run:` path fails `workflow-inputs` at line 6, an unreadable root shape fails `parser-miss` at line 6, and a `description:` that names a path is a label | `bash .github/scripts/tests/check-gate-inputs.test.sh` prints `check-gate-inputs: 54 passed, 0 failed`, with the four new `PASS` labels: `a composite action in the tree is scanned and passes`, `an unresolved path in a composite action fails workflow-inputs`, `an unreadable root shape in a composite action fails parser-miss`, `a description that names a path is a label` | Unmet | - |
| AC-003 | R13 | REQ-002 | Given R13's probe, When it is read, Then the compressed size, the restore seconds, the cold and warm provision seconds and a go/no-go against the 10 GB budget are recorded before the action is built | `scratch/cache-probe/summary.md` exists and `grep -cE '^(size_gb|restore_seconds|provision_seconds_cold|provision_seconds_warm|verdict)='` returns `5`; the raw `gh api repos/{owner}/{repo}/actions/caches --jq '.actions_caches[] \| select(.key \| startswith("provision-")) \| {key, size_in_bytes}'` output sits beside it | Unmet | - |
| AC-004 | R14 | REQ-003 | Given R14's action, When its file is parsed and read, Then it restores, sets up bun, provisions and saves, keys on every lockfile plus the Node major, and has no `restore-keys` | `python3 -c "import yaml; yaml.safe_load(open('.github/actions/setup/action.yml'))"` exits `0`; `grep -c 'restore-keys'` returns `0`; `grep -c 'hashFiles'` returns `1`; `grep -c 'provision_worktree'` returns `1`; `grep -c 'cache-hit'` returns `1`; `grep -c 'node-major'` returns `2`; `bash .github/scripts/check-gate-inputs.sh` prints `files=46` and `RESULT: PASSED` | Unmet | - |
| AC-005 | R14 | REQ-004 | Given R14's adoption, When the three workflows are read at T029, before the R15 merge, Then all five provisioning job instances call the action through four YAML call sites, no bun bootstrap remains, and `.github/actions/**` is in both event lists of each | `grep -c 'uses: ./.github/actions/setup'` returns `1` for `hooks-node-tests.yml`, `1` for `opencode-plugin-tests.yml` and `2` for `opencode-dual-version.yml`; `grep -c 'bun@1.3.9'` returns `0` for each; `grep -c "'.github/actions/\*\*'"` returns `2` for each; the three outputs are recorded in `scratch/phase-result.md` | Unmet | - |
| AC-006 | R14 | REQ-004 | Given R14's cold path and a warm run, When each is measured, Then the dispatch with `cold: true` provisions from scratch and passes, and the warm run's provision step is a restore plus the verification walk about 40 s shorter than the baseline | `gh workflow run opencode-plugin-tests.yml --ref <branch> -f cold=true` gives a green run whose log holds at least one `provisioning` line; the warm run's log holds `skipped already present`, and its job step seconds are about 40 s below the 002 baselines `hooks-node-tests` 194 s, `opencode-plugin-tests` 138 s and `opencode-dual-version` 156/148/127 s, recorded under `## R14 warm run` in `scratch/phase-result.md` | Unmet | - |
| AC-007 | R15 | REQ-005 | Given R15's merge, When the two files are read, Then one workflow and one job carry both suites, the union trigger names `.hermes/**`, and the weekly cold schedule exists | `test ! -f .github/workflows/hooks-node-tests.yml`; `grep -c 'uses: ./.github/actions/setup' .github/workflows/opencode-plugin-tests.yml` returns `1`; `grep -c 'node --test "'` returns `1` and `grep -c "node --test '"` returns `1`, which separates the hook collection step from the plugin suite; `grep -c 'install-hooks.test.sh'` returns `1`; `grep -c "'.hermes/\*\*'"` returns `2`; `grep -c '^  schedule:'` returns `1`; `grep -c 'OpenCode plugin and hook node:test suites'` returns `1` | Unmet | - |
| AC-008 | R15 | REQ-005 | Given R15's merged job, When a `.hermes/**`-only pull request runs it, Then the workflow fires, which it did not before, and the log carries every hook and plugin suite plus the installer test | `gh run list --workflow opencode-plugin-tests.yml --commit <hermes-only-sha>` returns one green run; `gh run view <run-id> --log \| grep -oE '\.skilled/hooks/[a-z0-9/-]+\.test\.(ts\|mjs)\|\.opencode/plugins/tests/[a-z0-9-]+\.test\.cjs' \| sort -u` lists every suite, and the installer count is at least `1`; both are recorded under `## R15 merge` | Unmet | - |
| AC-009 | R16 | REQ-006 | Given R16's two named files, When their install blocks are read, Then no `npm --prefix ... ci` remains, the action is called once per job, and the warm install step is shorter than its baseline | `grep -cE 'npm --prefix [^ ]+ ci$'` returns `0` for `routing-registry-drift.yml` and `spec-kit-check.yml`; `grep -c 'uses: ./.github/actions/setup'` returns `2` and `3`; `grep -c 'bun@1.3.9'` returns `0` for `spec-kit-check.yml`; `test -f .skilled/skills/sk-vision/vision-runtime/dist/plugin.js` after the action; `scratch/npm-dedupe.md` shows the routing install step under 88 s and each spec-kit job's install step below its baseline | Unmet | - |
| AC-010 | R16 | REQ-006 | Given R16's remaining files, When each is measured on a warm run, Then every kept substitution has a shorter install step and every reverted one is byte-identical to its pre-phase state | `scratch/npm-dedupe.md` has `10` rows, one per file, with baseline seconds, warm seconds and `keep` or `revert`; for each kept file `grep -cE 'npm --prefix [^ ]+ ci$'` returns `0`; for each reverted file `git diff --stat -- .github/workflows/<file>` is empty | Unmet | - |
| AC-011 | R17 | REQ-007 | Given R17's four workflows, When their `setup-python` steps are read, Then each caches pip against a dependency path that exists, and each run is green | `grep -c 'cache: pip'` returns `1` and `grep -c 'cache-dependency-path'` returns `1` in `naming-standard-guard.yml`, `sk-doc-rename-harness.yml`, `sk-doc-script-tests.yml` and `spec-kit-check.yml`; each workflow is green; the pip step seconds are in `scratch/npm-dedupe.md` | Unmet | - |
| AC-012 | R18 | REQ-008 | Given R18's two variants, When the checkout step is measured for each, Then the faster green variant is kept or both are reverted, and the canary still passes | `scratch/checkout-probe.md` has `3` rows (baseline, `blob:none`, sparse) with checkout seconds and conclusions and one `verdict:` line; `git diff -- .github/workflows/rule-canary-sync.yml` shows only the kept variant; the canary job logs `All rule invariants present` | Unmet | - |
| AC-013 | Gates | REQ-009 | Given the final tree, When the whole-tree gates run, Then the fixture suite, the real-tree gate and the YAML parse all pass | `bash .github/scripts/tests/check-gate-inputs.test.sh` prints `54 passed, 0 failed`; `bash .github/scripts/check-gate-inputs.sh` prints `files=46`, `failures=0`, `RESULT: PASSED`; `python3 -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml') + glob.glob('.github/actions/*/action.yml')]"` exits `0` over the 32 remaining workflows plus the action | Unmet | - |
| AC-014 | Baseline | REQ-010 | Given the phase delta, When it is read against the baseline, Then every touched workflow has a before and an after row, and the merged workflow is counted once | `scratch/phase-baseline.md` has the fifteen pre-merge rows from T002 plus the 002 total; `scratch/phase-result.md` has `14` rows, with the merged row carrying both pre-merge numbers, plus the after numbers and a delta, so `hooks-node-tests` and `opencode-plugin-tests` never appear as separate rows | Unmet | - |
| AC-015 | D5 | REQ-011 | Given D5's answer, When the scratch record, the plan and the merged job are read, Then the decision is recorded and the check's new title matches the record exactly | `grep -c '^D5=' scratch/decisions.md` returns `1`; `grep -c 'OpenCode plugin and hook node:test suites' plan.md` returns at least `1`; `grep -c 'OpenCode plugin and hook node:test suites' .github/workflows/opencode-plugin-tests.yml` returns `1` | Unmet | - |
| AC-016 | README | REQ-012 | Given the README, When its rows are read, Then one row names the merged workflow's suites, the installer test and the weekly cold run, and no row names `hooks-node-tests.yml` | `grep -c 'hooks-node-tests' .github/workflows/README.md` returns `0`; `grep -c 'hook installer test'` returns `1`; `sed -n '68p' .github/workflows/README.md \| grep -c 'markdown-link-integrity'` returns `1`, which proves the path-filtered row moved up rather than losing its neighbours | Unmet | - |
| AC-017 | Hygiene | REQ-013 | Given the staged change set, When it is searched for ephemeral identifiers, Then no R-id, D-id or phase number appears in a workflow comment, a step name, an action input, a cache key or a README row | `git diff --cached \| grep -nE '\bR[0-9]+\b\|\bD[0-9]+\b\|[Pp]hase 0[0-9]'` prints nothing, and every commit message passes `node .skilled/skills/sk-git/scripts/validate-message.mjs --commit <file>` with exit `0` | Unmet | - |

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

This phase is planned and not built. AC-001 to AC-017 are all `Unmet`: the gate does not scan `.github/actions`, no composite action exists, the five provisioning sites still install from scratch, `hooks-node-tests.yml` still runs as its own workflow, the ten multi-install files still repeat their installs, four `setup-python` steps still cache nothing, and no checkout trial has run. The phase closes when the gate reports the action as one of its files with its four new cases green, `scratch/cache-probe/summary.md` states a measured go/no-go, a cold dispatch run and a warm run are both recorded against the 002 baseline, the merged job's log carries every hook and plugin suite, the README lists one row, `scratch/phase-result.md` holds the measured delta, and `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:closure -->
