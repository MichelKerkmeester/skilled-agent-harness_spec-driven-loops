---
title: "Acceptance Criteria: Phase 7: workflow-hygiene-on-off-control"
description: "The criteria this packet must satisfy before it may be closed: permissions on every workflow, the Dependabot split and its live pull request, a timeout on every job sized from job samples, the thin-sample record, the switch on every job except Dependabot's two, the group assignment, the README section, the fork probe, the gates, and the four scope guards."
trigger_phrases:
  - "workflow hygiene on off control acceptance criteria"
  - "phase 7 workflow hygiene on off control acceptance criteria"
  - "timeout and switch acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control"
    last_updated_at: "2026-10-23T13:50:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Refreshed the acceptance criteria with an R-id trace and a concrete check per row"
    next_safe_action: "Answer D6, then run the permissions pass, the timeout sample and the switch pass"
    blockers:
      - "D6 is unanswered; the default is 10 minutes"
      - "No fork or throwaway test repository is recorded for AC-008"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-007-workflow-hygiene-on-off-control"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: workflow-hygiene-on-off-control

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
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
| AC-001 | R25 | REQ-001 | Given the workflow tree after `003`, `004` and `005`, When every file is read, Then each declares a workflow-level `permissions:` block, the 12 files that had none carry `contents: read`, and `trigger-index-rebuild.yml` still carries `permissions: {}` at `:12` | `grep -L 'permissions:' .github/workflows/*.yml \| wc -l` returns `0`; the loop `for f in advisory-checks agent-mirror-sync chart-corpus comment-hygiene diagram-corpus markdown-link-integrity playbook-operator-contract prompt-card-sync repo-rules-corpus rule-canary-sync runtime-no-spec-import skill-doc-frontmatter; do grep -c '^permissions:$' ".github/workflows/$f.yml"; done` returns `1` twelve times; `grep -c 'permissions: {}' .github/workflows/trigger-index-rebuild.yml` returns `1` | Unmet | - |
| AC-002 | R25 | REQ-002 | Given `dependabot-auto-merge.yml`, When it is parsed, Then it has two jobs, `metadata` holds only read scopes and runs `dependabot/fetch-metadata`, `auto-merge` needs it, holds `contents: write` and `pull-requests: write`, runs only `gh pr merge`, and a real Dependabot pull request has run it | `python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/dependabot-auto-merge.yml')); print(sorted(d['jobs']), d['permissions'], d['jobs']['metadata']['permissions'], d['jobs']['auto-merge']['permissions'])"` prints `['auto-merge', 'metadata'] {'contents': 'read'} {'contents': 'read', 'pull-requests': 'read'} {'contents': 'write', 'pull-requests': 'write'}`; `grep -c 'contents: write' .github/workflows/dependabot-auto-merge.yml` returns `1`; `grep -c 'actions/checkout' .github/workflows/dependabot-auto-merge.yml` returns `0`; `grep -cE 'run id: [0-9]+' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r25-dependabot.md` returns `1`, or the same file holds `pending: no Dependabot pull request in window` and the row stays `Unmet` | Unmet | - |
| AC-003 | R24 | REQ-003 | Given the 40-run sample taken after `003`, `004` and `005`, When every job is parsed, Then it declares `timeout-minutes` equal to `max(D6, ceil(3 x p50), ceil(2 x p100))` from its own row, and no successful job in the sample exceeds 50% of that value | `python3 -c "import yaml,glob; d=[(f,j,v) for f in glob.glob('.github/workflows/*.yml') for j,v in yaml.safe_load(open(f))['jobs'].items()]; print('jobs',len(d),'no-timeout',[(f,j) for f,j,v in d if 'timeout-minutes' not in v])"` prints `no-timeout []`; `node specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/size-timeouts.mjs --assert` exits `0` and prints `values match formula: ok` and `50% rule: ok`; `grep -c '^\| ' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md` equals the job count plus `2` | Unmet | - |
| AC-004 | R24 | REQ-004 | Given `scratch/r24/timeouts.md`, When it is read, Then every job has one row with its sample count, p50, p100, formula value and final value, and every job under 5 successful samples is marked `thin`, `no-sample` or `failed-only` with its count on the same row | `grep -cE '\| (thin\|no-sample\|failed-only) \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md` is at least `1`; `grep -cE '\| (thin\|no-sample\|failed-only) \| [0-9]+ \|'` returns the same count, so every marked row carries its sample count; `node specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/size-timeouts.mjs --assert` prints `values match formula: ok`, which is the "no value copied" proof | Unmet | - |
| AC-005 | R26 | REQ-005 | Given every workflow, When its jobs are parsed, Then every job except Dependabot's two carries a `vars.SKILLED_CI` switch, and the three jobs that already had a condition keep that condition as a conjunct with balanced parentheses | `grep -c "vars.SKILLED_CI != 'off'" .github/workflows/*.yml \| awk -F: '{s+=$2} END {print s}'` returns `42` when `.github/workflows/hooks-node-tests.yml` is absent and `43` when it is present, which is every job except Dependabot's two; `python3 -c "import yaml,glob; d=[(f,j) for f in glob.glob('.github/workflows/*.yml') for j,v in yaml.safe_load(open(f))['jobs'].items() if 'vars.SKILLED_CI' not in str(v.get('if',''))]; print(d)"` prints exactly the two `dependabot-auto-merge.yml` jobs; `python3 -c "import yaml; c=yaml.safe_load(open('.github/workflows/trigger-index-rebuild.yml'))['jobs']['rebuild']['if']; print('vars.SKILLED_CI' in c, 'Trigger-Index-Rebuild: ci' in c, c.count('(')==c.count(')'))"` prints `True True True` | Unmet | - |
| AC-006 | R26 | REQ-006 | Given `scratch/switch-groups.md`, When it is compared with the tree, Then it names five groups with a workflow count and a job count each, every workflow file is named in it or in its exemption line, and the counts sum to the tree | `grep -cE '^\| SKILLED_CI' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/switch-groups.md` returns `5`; `python3 -c "import glob,re; t=open('specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/switch-groups.md').read(); listed=set(re.findall(r'([a-z0-9-]+\.yml)', t)); tree={f.rsplit('/',1)[-1] for f in glob.glob('.github/workflows/*.yml')}; print('missing', sorted(tree-listed), 'extra', sorted(listed-tree))"` prints `missing [] extra []`; the file's group counts plus the two Dependabot jobs equal `python3 -c "import glob,yaml; print(sum(len(yaml.safe_load(open(f))['jobs']) for f in glob.glob('.github/workflows/*.yml')))"` | Unmet | - |
| AC-007 | R26 | REQ-007 | Given `.github/workflows/README.md`, When the new section is read, Then it sits after the push-versus-pull-request table and before `## 3. GUARD ENTRYPOINTS`, names all six variables, states that `off` is the only disable token and that an unset variable runs the job, records Dependabot's exemption and the message-contract prohibition | `grep -c '^### On/off switches$' .github/workflows/README.md` returns `1`; `for v in SKILLED_CI SKILLED_CI_TESTS SKILLED_CI_REPORTS SKILLED_CI_REVIEW SKILLED_CI_FRESHNESS SKILLED_CI_MESSAGES; do grep -q "$v" .github/workflows/README.md \|\| echo "missing: $v"; done` prints nothing; `sed -n '/^### On\/off switches$/,/^## 3\./p' .github/workflows/README.md \| grep -c 'only token'` returns `1`; `grep -c 'SKILLED_CI_MESSAGES must stay unset' .github/workflows/README.md` returns `1` | Unmet | - |
| AC-008 | R26 | REQ-008 | Given a fork that carries the workflows, When `SKILLED_CI_REPORTS` is `off` and `strict-pass-freshness-report.yml` is dispatched, Then the run is `success` with its job `skipped`; when the variable is deleted and the workflow dispatched again, Then the job runs | `grep -cE 'run id: [0-9]+' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r26-probe.md` returns `2`; `grep -c 'off: skipped'` returns `1` and `grep -c 'unset: ran'` returns `1` on the same file | Unmet | - |
| AC-009 | R24, R25, R26 | REQ-009 | Given the finished tree, When the gates run, Then the gate-input check passes, every workflow parses, and this folder validates strict | `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED` with `failures=0`; `python3 -c "import yaml, glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]; print('parse ok')"` prints `parse ok`; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PWD/specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control" --strict` prints `RESULT: PASSED` | Unmet | - |
| AC-010 | R24 | REQ-010 | Given `scratch/decisions.md`, When it is read, Then D6 is recorded as one `D6=<n>` line before the first timeout is written, and every timeout value in the tree is at least that number | `grep -cE '^D6=(5\|10)$' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/decisions.md` returns `1`; `python3 -c "import yaml,glob; v=[j['timeout-minutes'] for f in glob.glob('.github/workflows/*.yml') for j in yaml.safe_load(open(f))['jobs'].values() if 'timeout-minutes' in j]; print(min(v))"` prints a number greater than or equal to the recorded floor | Unmet | - |
| AC-011 | R24, R25, R26 | REQ-011 | Given the phase diff, When added lines are searched, Then no workflow comment, step name, job name or README sentence carries an R-id, a D-id or a phase number | `git diff "$(cat specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/phase-start-sha.txt)"..HEAD -- .github \| grep -cE '^\+.*(R2[456]\|D6\|D[0-9]\|phase 007\|Phase 7)'` returns `0`; `git diff --name-only "$(cat specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/phase-start-sha.txt)"..HEAD` lists only `.github/workflows/*`, `.github/workflows/README.md` and this phase folder | Unmet | - |
| AC-012 | R24, R25, R26 | REQ-012 | Given the phase diff, When the trigger, filter and job-graph lines are searched, Then no `on:`, `paths:`, `paths-ignore:`, `branches:`, `cron:`, `concurrency:` or existing check name changed, and the tree holds exactly one more job than the pre-phase inventory recorded | `git diff --unified=0 "$(cat specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/phase-start-sha.txt)"..HEAD -- .github/workflows \| grep -cE '^\+.*(paths\|paths-ignore\|branches\|cron\|concurrency):'` returns `0`; `python3 -c "import glob,yaml; print(sum(len(yaml.safe_load(open(f))['jobs']) for f in glob.glob('.github/workflows/*.yml')))"` returns `44` on the default path, one more than the `43` the tree holds after `004` deletes `hooks-node-tests.yml`, or `45` when D5 was rejected; `grep -c 'name: Auto-merge Dependabot security patch updates' .github/workflows/dependabot-auto-merge.yml` returns `1`, `grep -c 'name: Every gate input resolves under both source roots' .github/workflows/gate-inputs.yml` returns `1`, and `grep -c 'name: Commit messages, branch names and PR description follow the templates' .github/workflows/message-contract.yml` returns `1` | Unmet | - |
| AC-013 | R26 | REQ-013 | Given the six variable names, When the workflows, the README section and `scratch/switch-groups.md` are compared, Then all three carry the same five group names and no sixth, and `006-sk-code-ci-surface`'s rule data carries the same `off` token | `grep -hoE 'SKILLED_CI_[A-Z]+' .github/workflows/*.yml \| sort -u` prints five names; `grep -oE 'SKILLED_CI_[A-Z]+' .github/workflows/README.md \| sort -u` prints the same five; `grep -cE '^\| SKILLED_CI' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/switch-groups.md` returns `5` with the same names; `grep -c "!= 'off'" .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` is at least `1` | Unmet | - |

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

This phase is planned and not built. AC-001 to AC-013 are all `Unmet`: no workflow declares the new permission blocks, `dependabot-auto-merge.yml` still has one job holding both write scopes, no job carries a timeout outside the seven existing lines, no job carries a switch, the README has no `### On/off switches` section, and neither the fork probe nor a Dependabot pull request has been read. The phase closes when every job has a timeout sized from a recorded sample and a switch, the gate and the validator both print `RESULT: PASSED`, and the two behavioural proofs are recorded.
<!-- /ANCHOR:closure -->
