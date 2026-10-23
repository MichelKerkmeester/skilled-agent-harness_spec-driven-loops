---
title: "Acceptance Criteria: Phase 9: doctor-ci-review-wiring"
description: "The criteria this packet must satisfy before it may be closed: the R28 probe and its D9 answer, a read-only report that lists every workflow with its switch state and resolves the newest non-rebuild SHA, a confirmed scaffold and toggle, the three registered advisor bridges, the CI surface value with its regression test, the gates and the no-ephemeral-id rule."
trigger_phrases:
  - "doctor ci review wiring acceptance criteria"
  - "phase 9 doctor ci review wiring acceptance criteria"
  - "ci workflow report acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring"
    last_updated_at: "2026-10-23T15:45:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Refreshed the criteria with an R-id trace and a concrete check per row"
    next_safe_action: "Answer D9 with the R28 probe, then build the command and the CI surface value"
    blockers:
      - "D9 unanswered"
      - "006-sk-code-ci-surface pending"
      - "007-workflow-hygiene-on-off-control pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-009-doctor-ci-review-wiring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 9: doctor-ci-review-wiring

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
**Level:** 3
**Status:** Planned
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. `P` is the phase path `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring`; run every command from the repository root.

| AC-ID | R-id | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|------|-----|---------------------|--------------|--------|--------|
| AC-001 | R28 | REQ-001 | Given an operator yes and the owner's token, When the R28 probe runs, Then the four commands' exit codes and both read-backs are recorded and the variable is gone afterwards | `grep -cE '^(set\|get\|delete\|get-after-delete) exit=[0-9]+$' $P/scratch/r28-probe.md` returns `4`; `grep -c 'SKILLED_CI_PROBE' $P/scratch/r28-probe.md` returns at least `4`; `gh variable list --json name,value \| grep -c SKILLED_CI_PROBE` returns `0` | Unmet | - |
| AC-002 | R28 | REQ-001, REQ-004 | Given the probe's answer, When D9 is read and the toggle route is parsed, Then the route's mutation class matches the answer: `mutates` for `write`, `read-only` for `print` | `grep -cE '^D9: (write\|print)$' $P/plan.md` returns `1`; `python3 -c "import re,yaml; d=yaml.safe_load(open('.skilled/commands/doctor/_routes.yaml')); r=[x for x in d['routes'] if x['command']=='/doctor:ci' and x['target']=='toggle'][0]; m=re.search(r'^D9: (write\|print)$', open('$P/plan.md').read(), re.M); print(r['mutating'], m.group(1))"` prints `mutates write` or `read-only print` | Unmet | - |
| AC-003 | R29 | REQ-002 | Given the workflow tree, When `ci-report.cjs --json --no-gh` runs, Then it lists exactly the files `glob('.github/workflows/*.yml')` returns, every row has a switch state drawn only from `on`, `off`, `partial`, `missing` and `unknown`, and `dependabot-auto-merge.yml` reports `on` | `node .skilled/commands/doctor/scripts/ci-report.cjs --json --no-gh > $P/scratch/report.json`; `python3 -c "import json,glob; d=json.load(open('$P/scratch/report.json')); print(len(d['workflows']), len(glob.glob('.github/workflows/*.yml')))"` prints the same number twice (`32 32` when `hooks-node-tests.yml` is absent and phase 008 has not merged, `33 33` when it is present and 008 has not merged, `25 25` after a D8 merge on the D5-approved tree, `26 26` after a D8 merge on the D5-rejected tree); `python3 -c "import json; d=json.load(open('$P/scratch/report.json')); print([w['switch'] for w in d['workflows'] if w['file']=='dependabot-auto-merge.yml'])"` prints `['on']` | Unmet | - |
| AC-004 | R29 | REQ-002 | Given the live repository, When the report resolves the newest non-rebuild SHA, Then the SHA is 40 hex characters and its commit message does not end with `Trigger-Index-Rebuild: ci` | `node .skilled/commands/doctor/scripts/ci-report.cjs --json \| python3 -c "import json,sys; print(json.load(sys.stdin)['newestNonRebuildSha'])"` prints a 40-hex SHA; `gh api repos/{owner}/{repo}/commits/<sha> --jq .commit.message \| awk 'NF{last=$0} END{print last}'` prints anything except `Trigger-Index-Rebuild: ci`; both lines are recorded in `$P/scratch/live-report.md` | Unmet | - |
| AC-005 | R29 | REQ-002 | Given the fixture tree, When the report test runs, Then switch on/off/missing, the four missing flags, the rebuild-SHA exclusion, `--no-gh` and the malformed-YAML path all pass | `node --test .skilled/commands/doctor/scripts/tests/ci-report.test.cjs` exits `0` with at least `5` passing subtests and `fail 0` | Unmet | - |
| AC-006 | R29 | REQ-003 | Given the scaffold route, When its workflow YAML is read, Then it names both `sk-code-ci` templates and the protected set, refuses an existing target and a protected name, and writes only after an explicit yes | `grep -c 'workflow-template.yml' .skilled/commands/doctor/assets/doctor-ci-scaffold.yaml` is at least `1`; `grep -c 'job-block-template.yml' .skilled/commands/doctor/assets/doctor-ci-scaffold.yaml` is at least `1`; `grep -c 'protected-set.md' .skilled/commands/doctor/assets/doctor-ci-scaffold.yaml` is at least `1`; `grep -c 'REFUSE' .skilled/commands/doctor/assets/doctor-ci-scaffold.yaml` is at least `2`; `python3 -c "import yaml; d=yaml.safe_load(open('.skilled/commands/doctor/assets/doctor-ci-scaffold.yaml')); print(d['operating_mode']['approvals'])"` prints `explicit_yes_for_each_file_write` | Unmet | - |
| AC-007 | R29 | REQ-004 | Given the toggle route, When its workflow YAML is read, Then it names all six variables, prints the exact `gh variable set` and `gh variable delete` commands, and refuses `SKILLED_CI_MESSAGES=off` while the README carries the prohibition | `for v in SKILLED_CI SKILLED_CI_TESTS SKILLED_CI_REPORTS SKILLED_CI_REVIEW SKILLED_CI_FRESHNESS SKILLED_CI_MESSAGES; do grep -q "$v" .skilled/commands/doctor/assets/doctor-ci-toggle.yaml \|\| echo "missing: $v"; done` prints nothing; `grep -cE 'gh variable set\|gh variable delete' .skilled/commands/doctor/assets/doctor-ci-toggle.yaml` is at least `2`; `grep -c 'SKILLED_CI_MESSAGES must stay unset' .skilled/commands/doctor/assets/doctor-ci-toggle.yaml` is at least `1` | Unmet | - |
| AC-008 | R29 | REQ-005 | Given the three registered routes, When the manifest validator runs, Then it exits 0 with `17 routes validated` and no assertion failure | `bash .skilled/commands/doctor/scripts/route-validate.sh` exits `0` and its last line matches `OK: route-validate — 17 routes validated`; `python3 -c "import yaml; d=yaml.safe_load(open('.skilled/commands/doctor/_routes.yaml')); print(sorted(r['target'] for r in d['routes'] if r['command']=='/doctor:ci'))"` prints `['report', 'scaffold', 'toggle']` | Unmet | - |
| AC-009 | R29 | REQ-005 | Given the three bridge activations, When the deriver checks and the phrase probe runs, Then the projection is fresh and every admitted phrase reaches its bridge | `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` exits `0` and prints `"status": "fresh"` with `"changed": []`; `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` exits `0` and prints `STATUS=OK` with `bridges=21` | Unmet | - |
| AC-010 | R29 | REQ-005 | Given the `/doctor:setup` presentation, When its target list is read, Then it carries one `/doctor:ci report` row and no existing row changed | `grep -cF '\| `/doctor:ci report` \|' .skilled/commands/doctor/assets/doctor-setup-presentation.txt` returns `1`; `git diff --numstat .skilled/commands/doctor/assets/doctor-setup-presentation.txt` prints `1` added and `0` deleted lines | Unmet | - |
| AC-011 | R29 | REQ-005, REQ-008 | Given the three routes and their assets, When the contract test runs, Then the targets, mutation classes, phrases, template paths, prohibition and no-ephemeral-id scan all pass | `node --test .skilled/commands/doctor/scripts/tests/doctor-ci-contract.test.cjs` exits `0` with `fail 0` | Unmet | - |
| AC-012 | R30 | REQ-006 | Given the shared detection contract, When it is read, Then it has a `CI` surface row, the precedence `SKILLED > CI > OBSIDIAN > WEBFLOW > UNKNOWN`, a `.github/workflows/` and `.github/actions/` detection step, and CI test cases | `grep -c '^\| CI \|' .skilled/skills/sk-code/shared/references/stack-detection.md` returns `1`; `grep -c 'SKILLED > CI > OBSIDIAN > WEBFLOW > UNKNOWN' .skilled/skills/sk-code/shared/references/stack-detection.md` returns `1`; `grep -c '.github/workflows/' .skilled/skills/sk-code/shared/references/stack-detection.md` is at least `3`; `grep -c '.github/actions/' .skilled/skills/sk-code/shared/references/stack-detection.md` is at least `2` | Unmet | - |
| AC-013 | R30 | REQ-006 | Given the review router and the hub restatements, When they are read, Then `detect_surface_evidence` returns `CI` for a workflow path, its docstring names five values, and every hub restatement names CI | `grep -c 'CI_PATH_MARKERS' .skilled/skills/sk-code/sk-code-review/SKILL.md` returns `2`; `grep -c 'Return SKILLED, CI, OBSIDIAN, WEBFLOW or UNKNOWN' .skilled/skills/sk-code/sk-code-review/SKILL.md` returns `1`; `grep -c 'SKILLED > CI > OBSIDIAN > WEBFLOW > UNKNOWN' .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md .skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md` returns `1` for each; `grep -c 'SKILLED, CI, OBSIDIAN or WEBFLOW' .skilled/skills/sk-code/ROUTER.md` returns `1` | Unmet | - |
| AC-014 | R30 | REQ-007 | Given the inline Python block and five fixtures, When the regression test runs, Then SKILLED, OBSIDIAN and WEBFLOW return their current values, CI returns `CI`, UNKNOWN stays the fallback, and the mixed and near-miss paths are correct | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/surface-detection.test.cjs` exits `0` with at least `9` passing assertions and `fail 0`; `grep -cE "'(SKILLED\|OBSIDIAN\|WEBFLOW\|CI\|UNKNOWN)'" .skilled/skills/sk-code/sk-code-skilled/scripts/tests/surface-detection.test.cjs` is at least `5` | Unmet | - |
| AC-015 | R30 | REQ-007 | Given the sk-code test folder, When the CI glob and the drift-guard runner execute, Then every suite passes and all four guards pass | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs` exits `0`; `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits `0` and prints `all 4 guards PASSED` | Unmet | - |
| AC-016 | Cross-cutting | REQ-008 | Given the phase diff, When it is searched for ephemeral ids, Then no R-id, D-id or phase number appears in a command asset, a script comment, a YAML asset, a test name, a commit message or a changed skill doc | `git diff --cached -- .skilled .github \| grep -nE '\bR[0-9]+\b\|\bD[0-9]+\b\|[Pp]hase 0[0-9]'` prints nothing; `grep -rnE '\bR(28\|29\|30)\b\|\bD9\b\|[Pp]hase 9' .skilled/commands/doctor/ci.md .skilled/commands/doctor/assets/doctor-ci-report.yaml .skilled/commands/doctor/assets/doctor-ci-scaffold.yaml .skilled/commands/doctor/assets/doctor-ci-toggle.yaml .skilled/commands/doctor/scripts/ci-report.cjs .skilled/skills/sk-code/sk-code-skilled/scripts/tests/surface-detection.test.cjs` prints nothing | Unmet | - |
| AC-017 | Cross-cutting | REQ-009 | Given a report run, When it finishes, Then the tree is byte-identical before and after and no `.github/workflows` file is edited by the phase | `git status --porcelain -- .github .skilled > $P/scratch/status-before.txt`; `node .skilled/commands/doctor/scripts/ci-report.cjs --json --no-gh > /dev/null`; `git status --porcelain -- .github .skilled > $P/scratch/status-after.txt`; `diff -u $P/scratch/status-before.txt $P/scratch/status-after.txt` exits `0`; `git diff --exit-code -- .github/workflows` exits `0` | Unmet | - |
| AC-018 | R30 | REQ-006 | Given the six changed sk-code docs, When the version gate runs, Then every changed doc's frontmatter version is higher than its base version and each bumped packet has a changelog entry at that version | `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --check --base origin/main` exits `0`; `git diff --cached -- .skilled/skills/sk-code \| grep -cE '^\+version:'` is at least `6`; `python3 -c "import re,os; v=re.search(r'^version: (.+)$', open('.skilled/skills/sk-code/sk-code-review/SKILL.md').read(), re.M).group(1); print(v, os.path.exists(f'.skilled/skills/sk-code/sk-code-review/changelog/v{v}.md'))"` prints a version and `True`; the same check over `.skilled/skills/sk-code/SKILL.md` and `.skilled/skills/sk-code/changelog/` prints a version and `True` | Unmet | - |
| AC-019 | R30 | REQ-006 | Given the R30 doc edit, When the compiled-route gates run, Then the sk-code manifest is fresh against its inputs and every served copy matches its authored file | `node .skilled/bin/compiled-route-guard.cjs` exits `0` and prints `sk-code` followed by `fresh`; `node .skilled/bin/compiled-route-sync.cjs --check` exits `0` and its last line ends `served copies match their authored files`; `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check` exits `0`; `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` exits `0` | Unmet | - |
| AC-020 | R29 | REQ-002 | Given the report's fixture tree, When the report test runs, Then the switch states, the four missing flags, the rebuild exclusion, `--no-gh` and the malformed YAML each have their own passing subtest | `node --test .skilled/commands/doctor/scripts/tests/ci-report.test.cjs` exits `0`; the output contains at least `5` lines matching `pass` and one line matching `fail 0` | Unmet | - |
| AC-021 | R29 | REQ-005, REQ-008 | Given the command folder, When the contract test scans it, Then the three routes, the three assets, the presentation displays and the no-ephemeral-id rule all match | `node --test .skilled/commands/doctor/scripts/tests/doctor-ci-contract.test.cjs` exits `0` with `fail 0`; `grep -c 'command-doctor-ci-' .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` returns `6` | Unmet | - |
| AC-022 | R30 | REQ-006 | Given a workflow prompt and phase 006's registration, When the compiled route runs, Then the route bundles `sk-code-ci` and the observation is recorded | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review the GitHub Actions workflow diff in .github/workflows/spec-kit-check.yml" --surface-hint CI \| grep -c '"sk-code-ci"'` returns `1`; `$P/scratch/compiled-route.md` holds one verdict line; a `0` count is recorded as `bundles: no` and leaves this row `Unmet` | Unmet | - |

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

One waiver is pre-declared: if the operator declines the R28 probe, AC-001 is
`Waived` with `ADR-002` in the Waiver cell and the toggle takes the print shape.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

This phase is planned and not built. AC-001 to AC-022 are all `Unmet`: no probe has run, no `/doctor:ci` route exists, no bridge is activated, the report has not listed a workflow, `detect_surface_evidence` still returns four values, and the regression test does not exist. The phase closes when the probe and D9 are recorded, the three routes and their bridges pass their validators, the live report names every workflow and a non-rebuild SHA, the five-value detection test is green with the three existing surfaces unchanged, and the validator prints `RESULT: PASSED`.
<!-- /ANCHOR:closure -->
