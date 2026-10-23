---
title: "Tasks: Phase 6: sk-code-ci-surface"
description: "Task Format: T### Description (file path). Sixty-eight ordered tasks for the sk-code-ci phase: the gate baseline, the pattern inputs and the ordering snapshot, then the packet files and rule data, the message-contract exception, the packet playbook, the hub registration and generated artifacts, the canary and compiled-route evidence, the hub gates, the closure commit, the phase result and the closure evidence commit."
trigger_phrases:
  - "sk code ci surface tasks"
  - "phase 6 sk code ci surface tasks"
  - "sk-code-ci registration tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: sk-code-ci-surface

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Description (file path)`

Every task below names one file, quotes the anchor text it edits, gives that anchor's line number, puts every command in a fenced block, states the expected result, names the acceptance criterion it satisfies, gives a rollback, and gives one concrete stop condition.

Line numbers are the values on disk when this plan was written. Read the file and locate the quoted anchor before editing; a moved line is not a changed edit. When the quoted anchor is absent, stop rather than editing a nearby line.

**No operator decision gates this phase.** R22 and R23 change no workflow and no repository setting. D1 (the rebuild-skip form) is read from `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/plan.md`; D2 (main-branch cancellation) is an operator decision in the parent spec, recorded as `pr-only` on 2026-10-23; T002 writes that recorded value.

**Comment hygiene.** No task adds an R-id, a D-id or a phase number to a code comment, a JSON description, a template comment or a test name. Spec documents may cite them; the packet's code and JSON may not.

**Additive registration.** Every registration task inserts `sk-code-ci` and preserves the entries it finds. It never rewrites an array or object from a remembered shape, because `specs/sk-code/013-private-surface-skills/002-hub-surface-removal` may have changed that shape. The packet and its registration name the CI surface only; they never name a removed example surface.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### T001 Record the pre-phase gate baseline (AC-007)

File: `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/phase-baseline.md` (new file). Anchor: none; the file does not exist yet.

Change: create the `scratch/` directory, run the five baseline commands into `scratch/`, then write `phase-baseline.md` with one `## ` section per command holding that command's last line and exit status.

Check:

```bash
mkdir -p specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code > specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/parent-skill-before.txt 2>&1; echo "exit=$?" >> specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/parent-skill-before.txt
bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh > specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/drift-guards-before.txt 2>&1; echo "exit=$?" >> specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/drift-guards-before.txt
node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs > specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/compiled-route-before.txt 2>&1; echo "exit=$?" >> specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/compiled-route-before.txt
node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code > specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/leaf-manifest-before.txt 2>&1; echo "exit=$?" >> specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/leaf-manifest-before.txt
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs > specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/derived-before.txt 2>&1; echo "exit=$?" >> specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/derived-before.txt
grep -c '^exit=' specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/parent-skill-before.txt specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/drift-guards-before.txt specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/compiled-route-before.txt specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/leaf-manifest-before.txt specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/derived-before.txt
```

Expected: `1` for each of the five files. The baseline values on this commit are: parent-skill `exit=1` with the single `FAIL: 12-lib` line naming `@spec-kit/shared/frontmatter/parse-frontmatter.js`; drift guards `exit=0` with `run-all-drift-guards: all 4 guards PASSED, 10 non-blocking warning(s)`; compiled-route `exit=0` with `pass 6` and `fail 0`; leaf manifest `exit=0` with `leaf-manifest.json OK`; derived freshness `exit=0` with `checked=14 fresh=14 stale=0 errored=0`. Copy those five lines into `phase-baseline.md` under `## Parent-skill check`, `## Drift guards`, `## Compiled-route suite`, `## Leaf manifest` and `## Derived freshness`.

Rollback: `rm -r specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch`.

Stop and escalate if: a baseline exit differs from the values above, or the parent-skill failure is on a leg other than `12-lib`.

---

### T002 Record the pattern inputs and the two recorded defaults (AC-002, AC-011)

File: `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/pattern-inputs.md` (new file). Anchor: none.

Change: write five lines under the heading `## Pattern inputs`: the observed values of the three commands below, then `d1: A` and `d2: pr-only`.

Check:

```bash
test -f .github/actions/setup/action.yml && echo 'composite_action: present' || echo 'composite_action: absent'
grep -c 'github/actions' .github/scripts/check-gate-inputs.sh
grep -n 'Option A' specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/plan.md
grep -c '^composite_action: absent$' specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/pattern-inputs.md
```

Expected: `composite_action: absent`; `0`; one `Option A` line from 002's notes; `1`. Write `d1: A` because 002's note freezes Option A (the `[skip ci]` token) as its default. Write `d2: pr-only` because D2's recorded answer on 2026-10-23 is `pr-only`, so the template records `cancel-in-progress: ${{ github.event_name == 'pull_request' }}`. When `.github/actions/setup/action.yml` is present and the `github/actions` count is above 0, write `composite_action: present` instead and T014 writes the landed status.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/pattern-inputs.md`.

Stop and escalate if: 002's plan has no `### Implementation Notes` section, or its note freezes neither Option A nor Option B.

---

### T003 Record the pre-phase registration (AC-009)

File: `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/registration-before.json` (new file). Anchor: none.

Change: write the five arrays and the canary count to one JSON object with the command below.

Check:

```bash
node -e "const fs=require('fs'); const r=require('./.skilled/skills/sk-code/mode-registry.json'); const h=require('./.skilled/skills/sk-code/hub-router.json'); const d=require('./.skilled/skills/sk-code/description.json'); const c=require('./.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json'); fs.writeFileSync('specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/registration-before.json', JSON.stringify({version:r.version,modes:r.modes.map(m=>m.workflowMode),surfaces:r.extensions['surface-axis'].surfaces,tieBreak:h.routerPolicy.tieBreak,routerSignals:Object.keys(h.routerSignals),vocabularyClasses:Object.keys(h.vocabularyClasses),keywords:d.keywords,canaryCases:c.cases.length},null,2)+'\n')"
node -e "const b=require('./specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/registration-before.json'); console.log(b.modes.length,b.surfaces.length,b.routerSignals.length,b.canaryCases)"
```

Expected: `5 3 5 18`. When `specs/sk-code/013-private-surface-skills/002-hub-surface-removal` has already landed, expect `3 1 3 18` instead; record whichever the command prints.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/registration-before.json`.

Stop and escalate if: the printed count is neither `5 3 5 18` nor `3 1 3 18`.

---

### T004 Record the ordering state against the sibling removal (AC-009)

File: `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/ordering-state.md` (new file). Anchor: none.

Change: write one `ordering-state:` line plus the git log of the registry file.

Check:

```bash
test -d .skilled/skills/sk-code/sk-code-webflow && echo 'webflow: present' || echo 'webflow: absent'
test -d .skilled/skills/sk-code/sk-code-obsidian && echo 'obsidian: present' || echo 'obsidian: absent'
git log --oneline -5 -- .skilled/skills/sk-code/mode-registry.json
grep -c '^ordering-state: ' specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/ordering-state.md
```

Expected: `webflow: present`, `obsidian: present`, one `ordering-state: pre-013/002` line, and `1`. Write `ordering-state: post-013/002` when both folders are absent and `ordering-state: mixed` when only one is.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/ordering-state.md`.

Stop and escalate if: the state is `mixed`, because neither registration order is safe against a half-removed hub.

---

### T005 Record the ten rule anchors (AC-002)

File: `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/source-anchors.md` (new file). Anchor: none.

Change: write ten `ANCHOR <n> <what>` headings, each followed by the quoted line and its `file:line`, from the commands below.

Check:

```bash
grep -n 'function twin' .github/scripts/check-gate-inputs.sh
grep -n 'twin-one' .github/scripts/check-gate-inputs.sh
grep -n 'No .opencode/repo-rules tree exists' .github/workflows/repo-rules-corpus.yml
sed -n '6,9p' .github/workflows/trigger-index-rebuild.yml
sed -n '78,84p' .github/workflows/trigger-index-rebuild.yml
sed -n '2,9p' .github/workflows/message-contract.yml
sed -n '73p' .github/workflows/README.md
grep -c 'timeout-minutes' .github/workflows/*.yml | grep -v ':0' | wc -l
grep -L '^permissions:' .github/workflows/*.yml | wc -l
grep -l '^concurrency:' .github/workflows/*.yml | wc -l
grep -c '^ANCHOR ' specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/source-anchors.md
```

Expected: `function twin` at `.github/scripts/check-gate-inputs.sh:113`; `twin-one` at `:336`; the repo-rules comment at `.github/workflows/repo-rules-corpus.yml:9`; the push trigger at `.github/workflows/trigger-index-rebuild.yml:6-9`; the four generated paths at `:78-84`; the message-contract comment at `:2-7` and `branches: ['**']` at `:9`; the README row at `.github/workflows/README.md:73`; `6` workflows with a timeout; `12` without `permissions:`; `1` with `concurrency:`; and `10` `ANCHOR ` lines.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/source-anchors.md`.

Stop and escalate if: the timeout count is not `6`, the missing-permissions count is not `12`, or the concurrency count is not `1`.

---

### T006 Record the consumer inventory (AC-003, AC-008)

File: `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/consumer-inventory.md` (new file). Anchor: none.

Change: write one row per file that names a surface or counts surfaces, with the line number and the quoted line, from the command below.

Check:

```bash
rg -n "sk-code-(webflow|skilled|obsidian)|three surfaces|three read-only|two optional examples|surfaceBundle|tieBreak" .skilled/skills/sk-code --glob '!**/changelog/**' --glob '!**/benchmark/**' --glob '!**/manual-testing-playbook/**' --glob '!**/references/**' --glob '!**/assets/**' | cut -d: -f1 | sort -u
grep -c '^| `' specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/consumer-inventory.md
```

Expected: eleven files, and `11` rows. The files are `.skilled/skills/sk-code/SKILL.md`, `README.md`, `shared/README.md`, `shared/references/phase-detection.md`, `feature-catalog/feature-catalog.md`, `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`, `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json` and `sk-code-skilled/assets/scripts/verify-router-sync.cjs`. Record each file's lines and note beside `graph-metadata.json` that only `derived.causal_summary` is hand-owned.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/consumer-inventory.md`.

Stop and escalate if: the file count is not eleven, or a listed file is outside `.skilled/skills/sk-code`.

---

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### T007 Create the packet contract (AC-001, AC-003)

File: `.skilled/skills/sk-code/sk-code-ci/SKILL.md` (new file). Anchor: none.

Change: write the frontmatter with `name: sk-code-ci`, `description: "Read-only GitHub Actions workflow evidence: trigger, filter, permission, timeout, concurrency and caching rules, the protected set and the scaffold templates."`, `allowed-tools: [Read, Bash, Grep, Glob]`, `version: 0.1.0.0`, and `metadata:` with `author: OpenCode`, `family: sk-code`, `packetKind: surface`. Then write §1 `WHEN THE HUB BUNDLES THIS`, §2 `REFERENCE MAP` naming the four references and the three symlinked workflow docs, §2b `SMART ROUTING (machine-readable)` with a `python` block holding `DEFAULT_RESOURCE`, `INTENT_SIGNALS` and `RESOURCE_MAP`, §3 `RULES` with the ALWAYS, NEVER and ESCALATE lists, and §4 `INTEGRATION POINTS`. The machine block carries `DEFAULT_RESOURCE = ["references/ci-workflow-standards.md"]`, one `INTENT_SIGNALS` key `CI_WORKFLOW` at weight 4, and `RESOURCE_MAP = {"CI_WORKFLOW": [...]}` with the four reference paths. Every keyword is multi-word, so a bare `workflow` does not score.

Check:

```bash
grep -c '^name: sk-code-ci$' .skilled/skills/sk-code/sk-code-ci/SKILL.md
grep -c 'allowed-tools: \[Read, Bash, Grep, Glob\]' .skilled/skills/sk-code/sk-code-ci/SKILL.md
grep -c 'packetKind: surface' .skilled/skills/sk-code/sk-code-ci/SKILL.md
grep -c '^INTENT_SIGNALS = {' .skilled/skills/sk-code/sk-code-ci/SKILL.md
grep -c 'sk-code-ci/references/' .skilled/skills/sk-code/sk-code-ci/SKILL.md
```

Expected: `1`, `1`, `1`, `1`, `0`. The last count is `0` because the packet's map holds packet-relative paths, never a `sk-code-ci/` prefix.

Rollback: `rm -r .skilled/skills/sk-code/sk-code-ci`.

Stop and escalate if: the four-part `version:` line is missing, or `allowed-tools` names `Write`, `Edit` or `Task`.

---

### T008 Create the packet README (AC-001)

File: `.skilled/skills/sk-code/sk-code-ci/README.md` (new file). Anchor: none.

Change: write four headings in this order: `## 1. AT A GLANCE` with a table row for packet kind `surface`, backend `evidence-base`, tools `Read, Bash, Grep, Glob`, advisor `invisible (routingClass: metadata)` and bundled-with `sk-code-quality` or `sk-code-review`; `## 2. OVERVIEW`; `## 3. REFERENCE MAP` naming the four references and two templates; `## 4. VERIFICATION` naming the four gate commands T060 to T063 run.

Check:

```bash
grep -Ec '^## 1\. AT A GLANCE|^## 2\. OVERVIEW|^## 3\. REFERENCE MAP|^## 4\. VERIFICATION' .skilled/skills/sk-code/sk-code-ci/README.md
grep -c 'references/ci-workflow-standards.md' .skilled/skills/sk-code/sk-code-ci/README.md
```

Expected: `4` and at least `1`.

Rollback: `rm .skilled/skills/sk-code/sk-code-ci/README.md`.

Stop and escalate if: a heading is missing, or the README claims the packet can write.

---

### T009 Create the packet changelog (AC-001)

File: `.skilled/skills/sk-code/sk-code-ci/changelog/v0.1.0.0.md` (new file). Anchor: none.

Change: write the frontmatter with `version: 0.1.0.0` and a body naming the first packet release, the ten rule families and the message-contract exception.

Check:

```bash
grep -c '^version: 0.1.0.0$' .skilled/skills/sk-code/sk-code-ci/changelog/v0.1.0.0.md
grep -c 'intentional exception' .skilled/skills/sk-code/sk-code-ci/changelog/v0.1.0.0.md
```

Expected: `1` and at least `1`.

Rollback: `rm .skilled/skills/sk-code/sk-code-ci/changelog/v0.1.0.0.md`.

Stop and escalate if: the version line differs from the file name.

---

### T010 Create the rule index (AC-002)

File: `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md` (new file). Anchor: none.

Change: write a normative table with one row per rule and a `file:line` citation for each: `.skilled/` and `.opencode/` path parity (`check-gate-inputs.sh:109-121`), SHA-pinned `uses:` (33 of 33 today), one README row per workflow (`.github/workflows/README.md:18-45`), `set -euo pipefail` in a multi-line `run:` (29 of 33), fork and secret safety (no `pull_request_target`, no `github.event` in `run:`), matrix and `fail-fast` guidance. State beside each row whether a machine gate enforces it, and state that a rule with no enforcement is honour-system.

Check:

```bash
for t in 'path parity' 'SHA-pinned' 'README row' 'set -euo pipefail' 'pull_request_target' 'fail-fast' '33 of 33'; do grep -q "$t" .skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md || echo "missing: $t"; done
```

Expected: no output.

Rollback: `rm .skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md`.

Stop and escalate if: any token prints as missing.

---

### T011 Create the trigger and filter rules (AC-002)

File: `.skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md` (new file). Anchor: none.

Change: write three sections. (a) `## The twin rule`: four generated paths times two source roots make 8 entries, the `.opencode/` twin is inert where the tree is absent, and the citations are `check-gate-inputs.sh:109-121`, `:336`, `:369-372` and `repo-rules-corpus.yml:9-11`. (b) `## Rebuild commits`: the rebuild-skip rule in T002's form. For `d1: A` write that a rebuild commit carries `[skip ci]` in its body, with the `trigger-index-rebuild.yml:78-84` generated-path list as the reason, and name the push-only `paths-ignore` alternative in one line, including its `104` twin-matched entries across 13 files. For `d1: B` write the push-only form instead. State that ignoring the four generated paths on the 13 downstream workflows saves about `2,073` runner-min/day. (c) `## Push-only scope`: generated-path rules are push-only, because the rebuild workflow triggers on `push` alone (`trigger-index-rebuild.yml:6-9`) and a `pull_request:` ignore would leave a required check Pending.

Check:

```bash
for t in '8 entries' 'inert' 'push-only' 'trigger-index-rebuild.yml:6-9' 'check-gate-inputs.sh:109-121'; do grep -q "$t" .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md || echo "missing: $t"; done
grep -Ec 'skip ci|paths-ignore' .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md
```

Expected: no output, then at least `1`.

Rollback: `rm .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md`.

Stop and escalate if: T002 recorded no `d1:` value, or the section names a `specs/` path.

---

### T012 Create the job-shape rules (AC-002, AC-011)

File: `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` (new file). Anchor: none.

Change: write five sections. `## Timeouts`: the formula `max(<floor>, ceil(3 x job p50 minutes), ceil(2 x job p100 minutes))` with a 10-minute floor, the observed p100 stated beside each value, the `6 of 33` workflows that carry a timeout today, and the `27 workflows` that carry none. `## Permissions`: `permissions: contents: read`, `permissions: {}` plus per-job scopes, and a write scope only in a job that runs no repository code, citing `trigger-index-rebuild.yml:12` and `:28`. `## Concurrency`: `group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}` with T002's `d2` value, `1 of 33` today. `## The composite setup action`: every provisioning workflow calls `./.github/actions/setup`, keys on every lockfile plus the Node major, and carries no `restore-keys`; write `status: proposed` when T002 recorded `composite_action: absent`, and `status: landed` when it recorded `present`. `## The switch if shape`: `if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_<GROUP> != 'off'`, ANDed onto an existing condition, with `off` the only disable token and the five group names `SKILLED_CI_TESTS`, `SKILLED_CI_REPORTS`, `SKILLED_CI_REVIEW`, `SKILLED_CI_FRESHNESS` and `SKILLED_CI_MESSAGES`.

Check:

```bash
for t in 'max(<floor>' 'permissions: contents: read' 'cancel-in-progress' 'uses: ./.github/actions/setup' 'vars.SKILLED_CI' 'SKILLED_CI_MESSAGES'; do grep -q "$t" .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md || echo "missing: $t"; done
grep -c '^status: ' .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md
```

Expected: no output, then `1`.

Rollback: `rm .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md`.

Stop and escalate if: a token prints as missing, or the status line disagrees with T002's `composite_action:` value.

---

### T013 Create the protected set (AC-002)

File: `.skilled/skills/sk-code/sk-code-ci/references/protected-set.md` (new file). Anchor: none.

Change: write the protected-by-function list with three classes: (a) the sole enforcer of an invariant with no local gate (`gate-inputs.yml`), (b) the token-eligibility split (`trigger-index-rebuild.yml`), (c) the guards whose failure invalidates other workflows' inputs (`dispatch-enforcement-guard.yml`, `naming-standard-guard.yml`). Add the rule that `message-contract.yml` is never switched off while its ruleset context is required, and the rule that a protected workflow is never edited without a second named confirmation that restates its role.

Check:

```bash
for t in 'gate-inputs' 'trigger-index-rebuild' 'dispatch-enforcement-guard' 'naming-standard-guard' 'message-contract'; do grep -q "$t" .skilled/skills/sk-code/sk-code-ci/references/protected-set.md || echo "missing: $t"; done
grep -c 'second named confirmation' .skilled/skills/sk-code/sk-code-ci/references/protected-set.md
```

Expected: no output, then `1`.

Rollback: `rm .skilled/skills/sk-code/sk-code-ci/references/protected-set.md`.

Stop and escalate if: a workflow name prints as missing.

---

### T014 Create the workflow scaffold template (AC-002, AC-008)

File: `.skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml` (new file). Anchor: none.

Change: write a commented template with `name:`, `on:` carrying `push` and `pull_request`, workflow-level `permissions:`, a `concurrency:` block using T012's shape, a `jobs:` example whose job carries the switch `if:`, `timeout-minutes:` and `runs-on:`, one SHA-pinned `uses:` line naming `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1`, the pin and tag already used at `.github/workflows/advisory-checks.yml:21`, and a final comment that a README row is required. Every remaining placeholder is prose inside a YAML comment; no `uses:` value, input or key carries a bracket token, because the action line is concrete.

Check:

```bash
python3 -c "import yaml; yaml.safe_load(open('.skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml'))"
grep -Ec 'timeout-minutes:|concurrency:|permissions:' .skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml
grep -c 'uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1' .skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml
grep -c '@[0-9a-f]\{40\} #' .skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml
```

Expected: exit `0`, at least `3`, `1`, and `1`.

Rollback: `rm .skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml`.

Stop and escalate if: the YAML does not parse, or the template contains a real token, key or secret value.

---

### T015 Create the job scaffold template (AC-002, AC-008)

File: `.skilled/skills/sk-code/sk-code-ci/assets/job-block-template.yml` (new file). Anchor: none.

Change: write a commented job block with `name:`, the switch `if:` shape, `runs-on:`, `timeout-minutes:`, per-job `permissions:` for the `permissions: {}` case, and a `uses: ./.github/actions/setup` provisioning step carrying `node-major`.

Check:

```bash
python3 -c "import yaml; yaml.safe_load(open('.skilled/skills/sk-code/sk-code-ci/assets/job-block-template.yml'))"
grep -Ec 'vars.SKILLED_CI|uses: ./.github/actions/setup|timeout-minutes:' .skilled/skills/sk-code/sk-code-ci/assets/job-block-template.yml
```

Expected: exit `0` and `3`.

Rollback: `rm .skilled/skills/sk-code/sk-code-ci/assets/job-block-template.yml`.

Stop and escalate if: the YAML does not parse, or the count is not `3`.

---

### T016 Link the workflow doctrine into the packet (AC-001)

File: `.skilled/skills/sk-code/sk-code-ci/references/workflow-implement.md`, `workflow-debug.md` and `workflow-verify.md` (new symlinks). Anchor: none.

Change: from the packet's `references/` directory create the three symlinks the way `sk-code-skilled/references/` carries them.

Check:

```bash
cd .skilled/skills/sk-code/sk-code-ci/references && ln -s ../../shared/references/workflow-implement.md workflow-implement.md && ln -s ../../shared/references/workflow-debug.md workflow-debug.md && ln -s ../../shared/references/workflow-verify.md workflow-verify.md
cd "$(git rev-parse --show-toplevel)" && test -L .skilled/skills/sk-code/sk-code-ci/references/workflow-implement.md && echo LINK_OK
readlink .skilled/skills/sk-code/sk-code-ci/references/workflow-implement.md
```

Expected: `LINK_OK`, then `../../shared/references/workflow-implement.md`.

Rollback: `rm .skilled/skills/sk-code/sk-code-ci/references/workflow-implement.md .skilled/skills/sk-code/sk-code-ci/references/workflow-debug.md .skilled/skills/sk-code/sk-code-ci/references/workflow-verify.md`.

Stop and escalate if: a target does not exist, or `readlink` prints an absolute path.

---

### T017 Record the message-contract exception (AC-006)

File: `.skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md`, anchor: the `## Push-only scope` heading T011 wrote at the end of the file.

Change: append an `## Intentional exceptions` section with one table row labelled `intentional-exception`: `message-contract.yml` pushes on `branches: ['**']` (`message-contract.yml:9`) because every pushed branch's name and commits are checked, and because it holds the only required status context (`.github/workflows/README.md:73`); the exception is to the push-to-`main`-and-`skilled/**` norm. State that no YAML change is made and that the report route reads this row rather than flagging the trigger.

Check:

```bash
grep -c 'intentional-exception' .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md
grep -c 'message-contract.yml:9' .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md
grep -c 'workflows/README.md:73' .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md
git diff --exit-code -- .github/workflows/message-contract.yml
```

Expected: at least `1`, `1`, `1`, and exit `0` with no output.

Rollback: delete the `## Intentional exceptions` section.

Stop and escalate if: the anchor heading is absent, or the workflow diff is not empty.

---

### T018 Create the packet playbook index (AC-005)

File: `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/manual-testing-playbook.md` (new file). Anchor: none.

Change: write the frontmatter with `title`, `description` and `version: 1.0.0.0`, then the category list naming `ci-surface/` and a note that the scenario is replayed by the hub's router-sync leg 4.

Check:

```bash
grep -c '^version: 1.0.0.0$' .skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/manual-testing-playbook.md
grep -c 'ci-surface/' .skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/manual-testing-playbook.md
```

Expected: `1` and at least `1`.

Rollback: `rm -r .skilled/skills/sk-code/sk-code-ci/manual-testing-playbook`.

Stop and escalate if: the file is named `README.md`, because the replay skips that name.

---

### T019 Create the packet playbook scenario (AC-005)

File: `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/ci-surface/ci-surface.md` (new file). Anchor: none.

Change: write the frontmatter with `id: ci-surface-ci-standards`, `category: ci_surface`, `stage: routing`, `expected_intent: CI_WORKFLOW`, `expected_resources:` listing the four packet-relative paths `references/ci-workflow-standards.md`, `references/trigger-and-filter-rules.md`, `references/job-shape-rules.md` and `references/protected-set.md`, and `version: 1.0.0.0`. Then write a `text` fence holding the prompt `review the github actions workflow yaml`, followed by the overview, the scenario contract and the test-execution sections.

Check:

```bash
grep -c '^expected_intent: CI_WORKFLOW$' .skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/ci-surface/ci-surface.md
grep -cE '^  - references/(ci-workflow-standards|trigger-and-filter-rules|job-shape-rules|protected-set)\.md$' .skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/ci-surface/ci-surface.md
grep -c '^```text$' .skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/ci-surface/ci-surface.md
```

Expected: `1`, `4`, `1`.

Rollback: `rm -r .skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/ci-surface`.

Stop and escalate if: a path in `expected_resources` carries a `sk-code-ci/` prefix, because the replay resolves them against the packet root.

---

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Implementation (continued)

### T020 Register the mode entry (AC-003)

File: `.skilled/skills/sk-code/mode-registry.json:110-116`, anchor:

```json
      "aliases": ["obsidian plugin implementation", "obsidian plugin code", "note database plugin", "obsidian plugin surface", "db-* class grammar"],
      "advisorRouting": {
        "routingClass": "metadata"
      }
    }
  ]
}
```

Change: insert one object before the closing `]` at `:115`, separated from the previous entry by a comma: `workflowMode: "sk-code-ci"`, `packetKind: "surface"`, `backendKind: "evidence-base"`, `toolSurface` with `allowed: ["Read", "Bash", "Grep", "Glob"]`, `forbidden: ["Write", "Edit", "Task"]`, `mutatesWorkspace: false`, `bashAllowlist: []`; `packet: "sk-code-ci"`, `packetSkillName: "sk-code-ci"`, `grandfatheredFolderMismatch: false`, the aliases `["github actions workflow", "ci workflow", "workflow yaml", "actions workflow", "ci workflow standards", "github actions yaml", "workflow path filters", "workflow timeout", "workflow concurrency", "workflow permissions", "required status check", "protected workflow"]`, and `advisorRouting: {routingClass: "metadata"}`.

Check:

```bash
node -e "const r=require('./.skilled/skills/sk-code/mode-registry.json'); const m=r.modes.find(x=>x.workflowMode==='sk-code-ci'); console.log([m.packetKind,m.backendKind,m.toolSurface.mutatesWorkspace,m.advisorRouting.routingClass].join(','))"
node -e "console.log(require('./.skilled/skills/sk-code/mode-registry.json').modes.length)"
```

Expected: `surface,evidence-base,false,metadata` and `6`, or `4` when T003 recorded the post-removal state.

Rollback: delete the inserted object and the comma before it.

Stop and escalate if: the JSON does not parse, or the alias array is shorter than twelve entries.

---

### T021 Append the surface-axis membership (AC-003)

File: `.skilled/skills/sk-code/mode-registry.json:19`, anchor:

```json
      "surfaces": ["sk-code-webflow", "sk-code-skilled", "sk-code-obsidian"]
```

Change: insert `"sk-code-ci"` immediately before `"sk-code-skilled"` and remove no entry, so the line reads `["sk-code-webflow", "sk-code-ci", "sk-code-skilled", "sk-code-obsidian"]`.

Check:

```bash
node -e "const s=require('./.skilled/skills/sk-code/mode-registry.json').extensions['surface-axis'].surfaces; console.log(s.includes('sk-code-ci'), s.indexOf('sk-code-ci')<s.indexOf('sk-code-skilled'), s.length)"
```

Expected: `true true 4`.

Rollback: remove `"sk-code-ci",` from the array.

Stop and escalate if: the array is not exactly the four-entry line above, because the sibling phase changed it.

---

### T022 Name the CI surface in the registry description (AC-008)

File: `.skilled/skills/sk-code/mode-registry.json:5`, anchor: the `"description"` line containing `the SURFACE axis (sk-code-webflow/sk-code-skilled/sk-code-obsidian) is read-only domain evidence`.

Change: replace that parenthetical with `(sk-code-webflow/sk-code-ci/sk-code-skilled/sk-code-obsidian)` and change no other word.

Check:

```bash
grep -c 'sk-code-webflow/sk-code-ci/sk-code-skilled/sk-code-obsidian' .skilled/skills/sk-code/mode-registry.json
node -e "console.log(require('./.skilled/skills/sk-code/mode-registry.json').skill)"
```

Expected: `1` and `sk-code`.

Rollback: restore the original parenthetical.

Stop and escalate if: the anchor parenthetical is absent.

---

### T023 Insert the tie-break slot (AC-003)

File: `.skilled/skills/sk-code/hub-router.json:7`, anchor:

```json
    "tieBreak": ["sk-code-quality", "sk-code-review", "sk-code-skilled", "sk-code-obsidian", "sk-code-webflow"],
```

Change: insert `"sk-code-ci"` immediately before `"sk-code-skilled"` and keep every other entry in its current order.

Check:

```bash
node -e "const t=require('./.skilled/skills/sk-code/hub-router.json').routerPolicy.tieBreak; console.log(t.includes('sk-code-ci'), t.indexOf('sk-code-ci')<t.indexOf('sk-code-skilled'), t.indexOf('sk-code-review')<t.indexOf('sk-code-ci'), t.length)"
```

Expected: `true true true 6`.

Rollback: remove `"sk-code-ci",` from the array.

Stop and escalate if: the array is not the six-entry line above.

---

### T024 Add the router signal (AC-003)

File: `.skilled/skills/sk-code/hub-router.json:42-47`, anchor:

```json
    "sk-code-obsidian": {
      "weight": 4,
      "classes": ["code-obsidian-aliases", "code-obsidian-runtime"],
      "resources": ["sk-code-obsidian/SKILL.md"]
    }
  },
```

Change: insert one entry before the closing `},` of `routerSignals`: `"sk-code-ci": {"weight": 4, "classes": ["code-ci-aliases", "code-ci-runtime"], "resources": ["sk-code-ci/SKILL.md"]}`.

Check:

```bash
node -e "const h=require('./.skilled/skills/sk-code/hub-router.json'); console.log(Boolean(h.routerSignals['sk-code-ci']), Object.keys(h.routerSignals).length)"
```

Expected: `true 6`.

Rollback: delete the inserted entry and its trailing comma.

Stop and escalate if: the JSON does not parse, or the signal names a class that T025 and T026 do not define.

---

### T025 Define the `code-ci-aliases` class (AC-003)

File: `.skilled/skills/sk-code/hub-router.json:92-95`, anchor:

```json
    "code-obsidian-runtime": {
      "keywords": ["obsidian api", "itemview", "workspaceleaf", "manifest.json", "esbuild.config.mjs", "styles.css", ".db-", "vault", "metadatacache", "tfile", "screenshots:verify", "note database"]
    }
  }
}
```

Change: insert a `code-ci-aliases` class before the closing `}` of `vocabularyClasses` whose keywords include every T020 alias verbatim plus `github actions workflow`, `ci workflow`, `workflow yaml`, `actions workflow`, `ci workflow standards`, `github actions yaml`, `workflow path filters`, `workflow timeout`, `workflow concurrency`, `workflow permissions`, `required status check` and `protected workflow`.

Check:

```bash
node -e "const h=require('./.skilled/skills/sk-code/hub-router.json'); const a=h.vocabularyClasses['code-ci-aliases'].keywords; const aliases=require('./.skilled/skills/sk-code/mode-registry.json').modes.find(m=>m.workflowMode==='sk-code-ci').aliases; console.log(aliases.every(x=>a.includes(x)), a.length)"
```

Expected: `true` and at least `12`.

Rollback: delete the inserted class.

Stop and escalate if: an alias from T020 is absent, because check `5k-alias` fails on it.

---

### T026 Define the `code-ci-runtime` class (AC-003)

File: `.skilled/skills/sk-code/hub-router.json`, anchor: the `code-ci-aliases` class T025 wrote.

Change: insert a `code-ci-runtime` class after it with the keywords `runner-minutes`, `timeout-minutes`, `paths-ignore`, `pull_request_target`, `permissions: contents: read`, `actions/cache`, `setup-bun`, `fail-fast`, `matrix`, `ruleset`, `trigger-index rebuild`, `workflow_dispatch`, `concurrency group` and `cache key`.

Check:

```bash
node -e "const h=require('./.skilled/skills/sk-code/hub-router.json'); console.log(Boolean(h.vocabularyClasses['code-ci-runtime']), h.vocabularyClasses['code-ci-runtime'].keywords.length)"
```

Expected: `true` and `14`.

Rollback: delete the inserted class.

Stop and escalate if: the class key differs from `code-ci-runtime`, because T024 names it.

---

### T027 Add the description keyword (AC-003)

File: `.skilled/skills/sk-code/description.json:49`, anchor:

```json
    "sk-code-obsidian",
```

Change: insert `"sk-code-ci",` on the line before it.

Check:

```bash
node -e "console.log(require('./.skilled/skills/sk-code/description.json').keywords.includes('sk-code-ci'))"
```

Expected: `true`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor line is absent.

---

### T028 Add the ROUTER.md CI map (AC-004)

File: `.skilled/skills/sk-code/ROUTER.md:242-246`, anchor:

```markdown
| Spec folder write | Now in system-spec-kit: `system-spec-kit/references/workflows/spec-folder-authoring-checklist.md` + `system-spec-kit/references/workflows/spec-folder-write-recipe.md` |

---

## 7. VERIFICATION COMMANDS
```

Change: insert a `### CI Workflow Map` subsection between the table and the `---`, with a four-row table naming `sk-code-ci/references/ci-workflow-standards.md`, `sk-code-ci/references/trigger-and-filter-rules.md`, `sk-code-ci/references/job-shape-rules.md` and `sk-code-ci/references/protected-set.md`, and one sentence saying the map is the packet's own map re-prefixed.

Check:

```bash
grep -c '^### CI Workflow Map$' .skilled/skills/sk-code/ROUTER.md
grep -c 'sk-code-ci/references/' .skilled/skills/sk-code/ROUTER.md
grep -c '^## 7\. VERIFICATION COMMANDS$' .skilled/skills/sk-code/ROUTER.md
```

Expected: `1`, at least `4`, `1`. Do not renumber §7: `verify-router-sync.cjs` anchors its prose scan on that literal heading.

Rollback: delete the inserted subsection.

Stop and escalate if: the §7 heading count is not `1`, or the anchor table row is absent.

---

### T029 Add `CI_WORKFLOW` to `INTENT_SIGNALS` (AC-004)

File: `.skilled/skills/sk-code/ROUTER.md:345`, anchor:

```python
    "OBSIDIAN_PLUGIN": {"weight": 4, "keywords": ["obsidian plugin", "note database plugin", "plugin data layer", "db class naming", "obsidian plugin conventions"]},
```

Change: insert one line after it: `"CI_WORKFLOW": {"weight": 4, "keywords": ["github actions workflow", "ci workflow", "workflow yaml", "actions workflow", "ci workflow standards", "github actions yaml", "workflow path filters", "workflow timeout", "workflow concurrency", "workflow permissions", "required status check", "protected workflow"]},`.

Check:

```bash
grep -c '"CI_WORKFLOW"' .skilled/skills/sk-code/ROUTER.md
```

Expected: `1`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor line is absent, or the keyword list differs from T020's alias array.

---

### T030 Add `CI_WORKFLOW` to `RESOURCE_MAP` (AC-004)

File: `.skilled/skills/sk-code/ROUTER.md:578-580`, anchor:

```python
        "sk-code-skilled/references/rust/quick-reference/determinism-parity-and-related.md",
    ],
}
```

Change: insert a `"CI_WORKFLOW"` array before the closing `}` of `RESOURCE_MAP` holding exactly four paths: `"sk-code-ci/references/ci-workflow-standards.md"`, `"sk-code-ci/references/trigger-and-filter-rules.md"`, `"sk-code-ci/references/job-shape-rules.md"` and `"sk-code-ci/references/protected-set.md"`.

Check:

```bash
grep -c '"CI_WORKFLOW"' .skilled/skills/sk-code/ROUTER.md
grep -c 'sk-code-ci/references/' .skilled/skills/sk-code/ROUTER.md
node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 1a,2
```

Expected: `2`, at least `8`, and `router-sync: 2/2 checks passed`.

Rollback: delete the inserted array.

Stop and escalate if: leg 2 reports a missing or extra child path, because the parent array and T007's packet array must carry the same four paths.

---

### T031 Add `sk-code-ci` to the guard's `SURFACES` (AC-004)

File: `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:33`, anchor:

```javascript
const SURFACES = ['sk-code-webflow', 'sk-code-skilled'].filter(onDisk);
```

Change: insert `'sk-code-ci'` immediately before `'sk-code-skilled'`, so the array reads `['sk-code-webflow', 'sk-code-ci', 'sk-code-skilled'].filter(onDisk)`.

Check:

```bash
grep -c "'sk-code-ci'" .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs
```

Expected: `1`.

Rollback: remove `'sk-code-ci',` from the array.

Stop and escalate if: the anchor line is absent, because the sibling removal phase rewrote it.

---

### T032 Add `sk-code-ci` to the guard's `SURFACE_PACKETS` (AC-004)

File: `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:34`, anchor:

```javascript
const SURFACE_PACKETS = new Set([...SURFACES, ...['sk-code-obsidian'].filter(onDisk)]);
```

Change: append `'sk-code-ci'` to the second array, so it reads `...['sk-code-obsidian', 'sk-code-ci'].filter(onDisk)`.

Check:

```bash
grep -c "'sk-code-ci'" .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs
node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 1a,1b,2,3,4
```

Expected: `2` and `router-sync: 5/5 checks passed`.

Rollback: remove `, 'sk-code-ci'` from the second array.

Stop and escalate if: leg 2 or leg 4 fails, because the packet map and the parent projection disagree.

---

### T033 Regenerate the leaf manifest (AC-003)

File: `.skilled/skills/sk-code/leaf-manifest.json` (generated). Anchor: none; the generator writes it.

Change: run the generator. When it stops with `MODE_LEAF_SET_COLLISION`, create `.skilled/skills/sk-code/leaf-scopes.json` as a JSON array holding one entry, `{"workflowMode": "sk-code-ci", "leafScopes": ["references", "assets"]}`, then rerun. Never hand-edit the manifest.

Check:

```bash
node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .skilled/skills/sk-code
node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code
node -e "console.log(require('./.skilled/skills/sk-code/leaf-manifest.json').modes.some(m=>m.workflowMode==='sk-code-ci'))"
```

Expected: `leaf-manifest.json OK` with an exit `0`, then `true`.

Rollback: `git checkout -- .skilled/skills/sk-code/leaf-manifest.json` and delete any `leaf-scopes.json` entry added here.

Stop and escalate if: the generator exits non-zero twice with the same code.

---

### T034 Regenerate the skill-derived graph (AC-003)

File: `.skilled/skills/sk-code/graph-metadata.json` (generated). Anchor: none; the generator writes every derived field except `causal_summary`.

Change: run the generator with `--write` against the hub root.

Check:

```bash
node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs
```

Expected: the generator reports the hub updated, and `checked=14 fresh=14 stale=0 errored=0`.

Rollback: `git checkout -- .skilled/skills/sk-code/graph-metadata.json`.

Stop and escalate if: the freshness check reports a stale hub after the write.

---

### T035 Name the CI surface in `causal_summary` (AC-008)

File: `.skilled/skills/sk-code/graph-metadata.json`, anchor: the `"causal_summary"` string containing `bundles one of three read-only surface evidence packets (sk-code-webflow, sk-code-skilled, sk-code-obsidian)`.

Change: replace that clause with `bundles one of four read-only surface evidence packets (sk-code-webflow, sk-code-ci, sk-code-skilled, sk-code-obsidian)` and leave the rest of the sentence intact.

Check:

```bash
grep -c 'four read-only surface evidence packets' .skilled/skills/sk-code/graph-metadata.json
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs
```

Expected: `1` and `stale=0`.

Rollback: restore the original clause.

Stop and escalate if: the anchor clause is absent, because the generator preserved a different wording.

---

### T036 Add the hub surface table row (AC-008)

File: `.skilled/skills/sk-code/SKILL.md:38`, anchor:

```markdown
| **sk-code-obsidian** | Obsidian-plugin design-system and source-convention evidence for the Note Database plugin. Read-only. | `sk-code/sk-code-obsidian/` |
```

Change: insert one row before it: `| **sk-code-ci** | GitHub Actions evidence: trigger, filter, permission, timeout, concurrency and caching rules, the protected set, the intentional message-contract exception and the scaffold templates. Read-only. | `sk-code/sk-code-ci/` |`.

Check:

```bash
grep -c 'sk-code-ci' .skilled/skills/sk-code/SKILL.md
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code 2>&1 | grep -c '^PASS: 6b:'
```

Expected: at least `1` and `1`.

Rollback: delete the inserted row.

Stop and escalate if: check `6b` reports the mode as absent after the insert.

---

### T037 Rewrite the surface-list sentence (AC-008)

File: `.skilled/skills/sk-code/SKILL.md:40`, anchor:

```markdown
**Surface list.** The hub has exactly three surfaces: SKILLED (`sk-code-skilled`), the native surface for this framework's own code, and two optional example surfaces, WEBFLOW (`sk-code-webflow`) and OBSIDIAN (`sk-code-obsidian`), which a user may remove.
```

Change: replace `exactly three surfaces` with `exactly four surfaces` and add CI (`sk-code-ci`) to the list between SKILLED and the two optional examples, so the sentence names all four and the spelled count matches the registry.

Check:

```bash
grep -c 'exactly four surfaces' .skilled/skills/sk-code/SKILL.md
node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs --checks surfaces
```

Expected: `1` and `PASS check surfaces`.

Rollback: restore the original sentence.

Stop and escalate if: the guard reports a count that differs from `mode-registry.json`.

---

### T038 Rewrite the hub intro paragraph (AC-008)

File: `.skilled/skills/sk-code/SKILL.md:15`, anchor: the sentence `The **surface axis** is three read-only evidence packets the hub bundles alongside a workflow mode (sk-code-webflow, sk-code-skilled, sk-code-obsidian).`

Change: replace it with `The **surface axis** is four read-only evidence packets the hub bundles alongside a workflow mode (sk-code-webflow, sk-code-ci, sk-code-skilled, sk-code-obsidian).`

Check:

```bash
grep -c 'four read-only evidence packets' .skilled/skills/sk-code/SKILL.md
```

Expected: `1`.

Rollback: restore the original sentence.

Stop and escalate if: the anchor sentence is absent.

---

### T039 Name the CI surface in the discriminator list (AC-008)

File: `.skilled/skills/sk-code/SKILL.md:70`, anchor:

```markdown
- **`workflowMode`** - the public mode/packet key: `sk-code-quality`, `sk-code-review` (workflow) or `sk-code-webflow`, `sk-code-skilled`, `sk-code-obsidian` (surface).
```

Change: insert `` `sk-code-ci`, `` before `` `sk-code-skilled`, `` and keep the `(surface)` label at the end.

Check:

```bash
grep -c '`sk-code-ci`, `sk-code-skilled`, `sk-code-obsidian` (surface)' .skilled/skills/sk-code/SKILL.md
```

Expected: `1`.

Rollback: remove the inserted name.

Stop and escalate if: the anchor line is absent.

---

### T040 Add the packet to the hub layout block (AC-008)

File: `.skilled/skills/sk-code/SKILL.md:164-166`, anchor:

```text
  sk-code-webflow/       # webflow surface packet  (read-only evidence; carries the workflow doctrine + Motion.dev animation overlay)
  sk-code-skilled/      # skilled surface packet (read-only evidence; carries the workflow doctrine)
  sk-code-obsidian/      # obsidian surface packet (read-only evidence)
```

Change: insert one line after the webflow line: `  sk-code-ci/           # GitHub Actions workflow standards packet (read-only evidence; rules, protected set and scaffold templates)`.

Check:

```bash
grep -c '^  sk-code-ci/' .skilled/skills/sk-code/SKILL.md
```

Expected: `1`.

Rollback: delete the inserted line.

Stop and escalate if: the three-line anchor is absent.

---

### T041 Add the packet to the backend paragraph (AC-008)

File: `.skilled/skills/sk-code/SKILL.md:173`, anchor: the clause `read-only domain evidence (`sk-code-webflow/`, `sk-code-skilled/`, `sk-code-obsidian/`)`.

Change: insert `` `sk-code-ci/`, `` before `` `sk-code-skilled/` `` in that parenthetical.

Check:

```bash
grep -c '`sk-code-ci/`, `sk-code-skilled/`, `sk-code-obsidian/`' .skilled/skills/sk-code/SKILL.md
```

Expected: `1`.

Rollback: remove the inserted name.

Stop and escalate if: the anchor clause is absent.

---

### T042 Cut the hub release version (AC-008)

File: `.skilled/skills/sk-code/SKILL.md:5`, `mode-registry.json:3`, `hub-router.json:3` and `description.json:3`, anchors:

```yaml
version: 2.3.0.0
```

```json
  "version": "2.3.0.0",
```

Change: set all four fields to `2.4.0.0`. When `changelog/v2.4.0.0.md` already exists in `.skilled/skills/sk-code/changelog/`, set all four to `2.5.0.0` instead and record the reason in `scratch/phase-result.md`.

Check:

```bash
node -e "const v=[require('./.skilled/skills/sk-code/mode-registry.json').version,require('./.skilled/skills/sk-code/hub-router.json').version,require('./.skilled/skills/sk-code/description.json').version]; const m=require('fs').readFileSync('.skilled/skills/sk-code/SKILL.md','utf8').match(/^version: (.+)$/m); console.log(v.join(','), m[1], new Set([...v,m[1]]).size)"
```

Expected: one version repeated four times, ending in `1`.

Rollback: restore `2.3.0.0` in all four fields.

Stop and escalate if: the four fields disagree, or `changelog/v2.4.0.0.md` and `changelog/v2.5.0.0.md` both already exist.

---

### T043 Write the hub changelog (AC-008)

File: `.skilled/skills/sk-code/changelog/v2.4.0.0.md` (new file). Anchor: none. When T042 chose `2.5.0.0`, the path is `changelog/v2.5.0.0.md`.

Change: write the frontmatter with `version: 2.4.0.0` and a body naming the new `sk-code-ci` surface, its four references, its two templates and the message-contract exception.

Check:

```bash
grep -c '^version: 2.4.0.0$' .skilled/skills/sk-code/changelog/v2.4.0.0.md
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code 2>&1 | grep -c '^PASS: 13b-version:'
```

Expected: `1` and `1`.

Rollback: `rm .skilled/skills/sk-code/changelog/v2.4.0.0.md`.

Stop and escalate if: the file name and the frontmatter version differ, or `13b-version` fails.

---

### T044 Rewrite the README works-on row (AC-008)

File: `.skilled/skills/sk-code/README.md:23`, anchor:

```markdown
| **Works on** | The shared surface-detection router for the three surfaces the hub `SKILL.md` lists: the native SKILLED surface and the optional example WEBFLOW and OBSIDIAN surfaces, plus the Motion.dev animation overlay |
```

Change: replace `the three surfaces` with `the four surfaces` and name the new packet, so the row reads:

```markdown
| **Works on** | The shared surface-detection router for the four surfaces the hub `SKILL.md` lists: the native SKILLED surface, the `sk-code-ci` CI standards surface and the optional example WEBFLOW and OBSIDIAN surfaces, plus the Motion.dev animation overlay |
```

Check:

```bash
grep -c 'the four surfaces' .skilled/skills/sk-code/README.md
```

Expected: `1`.

Rollback: restore the original row.

Stop and escalate if: the anchor row is absent.

---

### T045 Add the README surface table row (AC-008)

File: `.skilled/skills/sk-code/README.md:57`, anchor:

```markdown
| `sk-code-obsidian` | Optional example. Obsidian-plugin design-system and source-convention evidence for the Note Database plugin |
```

Change: insert one row before it: `` | `sk-code-ci` | GitHub Actions workflow standards: trigger and filter rules, job shape, the protected set and the scaffold templates | ``.

Check:

```bash
grep -c '^| `sk-code-ci` |' .skilled/skills/sk-code/README.md
```

Expected: `1`.

Rollback: delete the inserted row.

Stop and escalate if: the anchor row is absent.

---

### T046 Correct the README adapting section (AC-008)

File: `.skilled/skills/sk-code/README.md:106`, anchor: the sentence `sk-code ships one native surface and two optional examples.`

Change: replace it with `sk-code ships one native surface, one CI standards surface and two optional examples.` and leave the rest of the paragraph intact.

Check:

```bash
grep -c 'one native surface, one CI standards surface and two optional examples' .skilled/skills/sk-code/README.md
```

Expected: `1`.

Rollback: restore the original sentence.

Stop and escalate if: the anchor sentence is absent.

---

### T047 Add the packet to `shared/README.md` (AC-008)

File: `.skilled/skills/sk-code/shared/README.md:17`, anchor: the sentence `common to every sk-code surface packet (`sk-code-webflow`, `sk-code-skilled`, `sk-code-obsidian`) and workflow mode (`sk-code-quality`, `sk-code-review`).`

Change: insert `` `sk-code-ci`, `` before `` `sk-code-skilled` `` in that parenthetical.

Check:

```bash
grep -c '`sk-code-ci`' .skilled/skills/sk-code/shared/README.md
```

Expected: at least `1`.

Rollback: remove the inserted name.

Stop and escalate if: the anchor parenthetical is absent.

---

### T048 Correct `phase-detection.md` line 16 (AC-008)

File: `.skilled/skills/sk-code/shared/references/phase-detection.md:16`, anchor:

```markdown
All three surfaces in the hub `SKILL.md` surface list (WEBFLOW, SKILLED and OBSIDIAN) follow the same lifecycle.
```

Change: replace it with the line below.

```markdown
All four surfaces in the hub `SKILL.md` surface list (WEBFLOW, `sk-code-ci`, SKILLED and OBSIDIAN) follow the same lifecycle.
```

Check:

```bash
grep -c 'All four surfaces' .skilled/skills/sk-code/shared/references/phase-detection.md
node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs --checks surfaces
```

Expected: `1` and `PASS check surfaces`.

Rollback: restore the original sentence.

Stop and escalate if: the guard reports a count that differs from the registry.

---

### T049 Add the CI surface to the phase-detection use list (AC-008)

File: `.skilled/skills/sk-code/shared/references/phase-detection.md:28`, anchor:

```markdown
- When planning work on the WEBFLOW, SKILLED or OBSIDIAN surface.
```

Change: replace it with the line below.

```markdown
- When planning work on the WEBFLOW, `sk-code-ci`, SKILLED or OBSIDIAN surface.
```

Check:

```bash
grep -c 'WEBFLOW, `sk-code-ci`, SKILLED or OBSIDIAN surface' .skilled/skills/sk-code/shared/references/phase-detection.md
```

Expected: `1`.

Rollback: restore the original bullet.

Stop and escalate if: the anchor bullet is absent.

---

### T050 Add the packet to the feature-catalog inventory (AC-008)

File: `.skilled/skills/sk-code/feature-catalog/feature-catalog.md:15`, anchor: the clause below.

```markdown
read-only SURFACE evidence packets (`sk-code-webflow`, `sk-code-skilled`, `sk-code-obsidian`)
```

Change: insert `` `sk-code-ci`, `` before `` `sk-code-skilled` `` in that parenthetical.

Check:

```bash
grep -c '`sk-code-ci`' .skilled/skills/sk-code/feature-catalog/feature-catalog.md
```

Expected: `1`.

Rollback: remove the inserted name.

Stop and escalate if: the anchor parenthetical is absent.

---

### T051 Add the packet to the feature-catalog current reality (AC-008)

File: `.skilled/skills/sk-code/feature-catalog/feature-catalog.md:35`, anchor: the clause `` `sk-code-webflow`, `sk-code-skilled` and `sk-code-obsidian` are advisor-invisible SURFACE packets ``.

Change: insert `` `sk-code-ci`, `` before `` `sk-code-skilled` `` in that clause.

Check:

```bash
grep -c '`sk-code-ci`' .skilled/skills/sk-code/feature-catalog/feature-catalog.md
```

Expected: `2`.

Rollback: remove the inserted name.

Stop and escalate if: the anchor clause is absent.

---

### T052 Add the packet to the two-axis description (AC-008)

File: `.skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md:26`, anchor: the clause `` `sk-code-webflow`, `sk-code-skilled` and `sk-code-obsidian` (each `backendKind: evidence-base`) ``.

Change: insert `` `sk-code-ci`, `` before `` `sk-code-skilled` `` in that clause.

Check:

```bash
grep -c '`sk-code-ci`' .skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md
```

Expected: `1`.

Rollback: remove the inserted name.

Stop and escalate if: the anchor clause is absent.

---

### T053 Add the canary case (AC-005)

File: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:323`, anchor:

```json
  "certificateCases": [
```

Change: insert one case before that key, separated by a comma: `{"id": "surface-bundle-ci", "prompt": "review the github actions workflow yaml", "riskSlice": "actor:mutating:composite", "certificateFixture": "valid-composite", "expectedAction": "route", "expectedSelectionKind": "surfaceBundle", "expectedModes": ["sk-code-review", "sk-code-ci"], "gold": {"expectedIntents": ["sk-code-review", "sk-code-ci"], "expectedResources": []}}`.

Check:

```bash
node -e "const f=require('./.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json'); console.log(f.cases.some(c=>c.id==='surface-bundle-ci'&&c.expectedModes.includes('sk-code-ci')), f.cases.length)"
```

Expected: `true 19`.

Rollback: delete the inserted case and its trailing comma.

Stop and escalate if: the JSON does not parse, or `cases.length` is not `19`.

---

### T054 Copy the canary fixture to its authored twin (AC-005)

File: `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`, anchor: none; the copy replaces it.

Change: copy the live fixture over the authored twin, never the reverse.

Check:

```bash
cmp .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code 2>&1 | grep -c '^PASS: 5k-canary:'
```

Expected: `cmp` exits `0` with no output, and `1`.

Rollback: `git checkout -- specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`.

Stop and escalate if: `cmp` reports a difference after the copy, or `5k-canary` fails.

---

### T055 Add the compiled-route test case (AC-005)

File: `.skilled/bin/tests/compiled-route-surface-hint.test.cjs`, anchor: the block that ends the resolver section:

```javascript
test('a hub without surface packets ignores the hint', () => {
  for (const hubId of ['sk-doc', 'mcp-tooling']) {
    for (const prompt of ['create a new skill and validate the docs', 'use the figma mcp transport']) {
      assert.deepEqual(compiledRoute(hubId, prompt, { surfaceHint: 'WEBFLOW' }), compiledRoute(hubId, prompt));
    }
  }
});
```

Change: insert one test after that block: `test('a CI workflow prompt bundles the CI surface', () => { const route = resolveRoute('sk-code', 'review the github actions workflow yaml'); assert.equal(route.action, 'route'); assert.equal(route.selectionKind, 'surfaceBundle'); assert.deepEqual(modes(route), ['sk-code-review', 'sk-code-ci']); });`.

Check:

```bash
node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs
```

Expected: exit `0` with `pass 7` and `fail 0`.

Rollback: delete the inserted test.

Stop and escalate if: the resolver returns a `selectionKind` other than `surfaceBundle`, or the test fails twice after T057.

---

### T056 Refresh the Hermes mirror (AC-001)

File: `.hermes/skills/sk-code-ci/SKILL.md` (generated). Anchor: none; the sync script writes it.

Change: run the Hermes skill sync with no argument.

Check:

```bash
node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs
node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
test -f .hermes/skills/sk-code-ci/SKILL.md && echo MIRROR_OK
```

Expected: exit `0` from the check, and `MIRROR_OK`.

Rollback: `rm -r .hermes/skills/sk-code-ci` and rerun the sync.

Stop and escalate if: the check reports a difference after the sync.

---

### T057 Refresh the compiled-routing policy (AC-005)

File: `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` (generated). Anchor: none; the refresh writes it.

Change: refresh the hub's canonical manifest, then confirm the served copies match their authored files.

Check:

```bash
node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code
node .skilled/bin/compiled-route-manifest.cjs freshness --hub sk-code --skill-root .skilled/skills/sk-code
node .skilled/bin/compiled-route-sync.cjs --check
```

Expected: `"fresh":true` in the freshness output, and `all 55 served copies match their authored files` from the sync check. The served-copy count stays `55`, because the refresh rewrites the existing hub manifest instead of adding a served file.

Rollback: `git checkout -- .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json`.

Stop and escalate if: the freshness output reads `"fresh":false` after the refresh.

---

### T058 Copy the activation manifest to its authored twin (AC-005)

File: `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`, anchor: none; the copy replaces it.

Change: copy the live manifest over the archived twin.

Check:

```bash
cmp .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json
```

Expected: exit `0` with no output.

Rollback: `git checkout -- specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`.

Stop and escalate if: `cmp` reports a difference after the copy.

---

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

### T059 Stage the tree and regenerate the durable-directory manifest (AC-001)

File: `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` (generated). Anchor: none; the test script writes it.

Change: stage every new file first, because the manifest counts tracked files only, then regenerate the manifest and stage it too.

Check:

```bash
git add -A
python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py --write
python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py
git add .skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json
```

Expected: `WROTE ... directories=787`, then `SUMMARY: discovery=pass exclusions=21/21 manifest=reproducible` with exit `0`.

Rollback: `git checkout -- .skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` and `git reset`.

Stop and escalate if: the derived count is not `787`, because a second new directory belongs to another in-flight phase.

---

### T060 Run the hub's parent-skill check (AC-007)

File: `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/phase-result.md` (new file). Anchor: none.

Change: run the check into `scratch/parent-skill-after.txt`, then write the `## Parent-skill check` section holding the command, the exit status and the seven PASS lines.

Check:

```bash
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code > specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/parent-skill-after.txt 2>&1; echo "exit=$?" >> specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/parent-skill-after.txt
grep -cE '^PASS: (3g|5b|5k-alias|5k-packet|5k-canary|5l|13b-version):' specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/parent-skill-after.txt
grep -c '^FAIL: ' specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/parent-skill-after.txt
```

Expected: `7` and `1`. The single FAIL is `12-lib`, the pre-existing unprovisioned-runtime failure T001 recorded. When the worktree has been provisioned, expect `0` FAIL lines and `exit=0`.

Rollback: delete the `## Parent-skill check` section and `scratch/parent-skill-after.txt`.

Stop and escalate if: a FAIL line other than `12-lib` appears, or a named leg prints `FAIL`.

---

### T061 Run the router drift guards (AC-007)

File: `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/phase-result.md`, anchor: the `## Parent-skill check` section T060 wrote.

Change: append a `## Drift guards` section with the command, the exit status and the four `PASS:` lines.

Check:

```bash
bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh > specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/drift-guards-after.txt 2>&1; echo "exit=$?" >> specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/drift-guards-after.txt
grep -c '^PASS: ' specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/drift-guards-after.txt
grep -c '^exit=0$' specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/drift-guards-after.txt
```

Expected: `4` and `1`.

Rollback: delete the `## Drift guards` section and `scratch/drift-guards-after.txt`.

Stop and escalate if: a guard prints `FAIL`, or the exit status is not `0`.

---

### T062 Run the compiled-route suites and the router union (AC-005, AC-007)

File: `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/phase-result.md`, anchor: the `## Drift guards` section T061 wrote.

Change: append a `## Suites` section with the three commands, their exit statuses and the router-sync summary line.

Check:

```bash
node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs .skilled/bin/tests/compiled-route-manifest.test.cjs .skilled/bin/tests/compiled-route-front-door.test.cjs > specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/suites-after.txt 2>&1; echo "exit=$?" >> specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/suites-after.txt
node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 4
grep -c '^exit=0$' specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/suites-after.txt
```

Expected: `router-sync: 1/1 checks passed` for leg 4, and `1` for the suite exit.

Rollback: delete the `## Suites` section and `scratch/suites-after.txt`.

Stop and escalate if: leg 4 reports `no routing scenarios found`, because the packet playbook is then invisible to the replay.

---

### T063 Prove the diff is scoped (AC-006, AC-010)

File: `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/phase-result.md`, anchor: the `## Suites` section T062 wrote.

Change: append a `## Scope` section with the three outputs, and record the ephemeral-id search result.

Check:

```bash
git diff --cached --name-only -- .github/workflows .github/scripts .github/actions
git diff --cached -U0 | grep -E '^\+' | grep -E -e '\bR2[2-3]\b' -e '\bD[0-9]+\b' -e '[Pp]hase 0[0-9]' -e '053-ci-workflow-efficiency'
git status --porcelain | grep -v '^.. specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/' | grep -c '^.. \.github/' || true
```

Expected: no output from the first two commands, and `0` from the third.

Rollback: delete the `## Scope` section.

Stop and escalate if: the first command names a `.github/` path, or the second prints a line.

---

### T064 Prove the registration survived (AC-009)

File: `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/registration-after.json` (new file). Anchor: none.

Change: run T003's snapshot command against the same fields, writing `registration-after.json`, then append a `## Registration after` block to `phase-result.md` with the comparison output.

Check:

```bash
node -e "const fs=require('fs'); const r=require('./.skilled/skills/sk-code/mode-registry.json'); const h=require('./.skilled/skills/sk-code/hub-router.json'); const d=require('./.skilled/skills/sk-code/description.json'); const c=require('./.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json'); fs.writeFileSync('specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/registration-after.json', JSON.stringify({version:r.version,modes:r.modes.map(m=>m.workflowMode),surfaces:r.extensions['surface-axis'].surfaces,tieBreak:h.routerPolicy.tieBreak,routerSignals:Object.keys(h.routerSignals),vocabularyClasses:Object.keys(h.vocabularyClasses),keywords:d.keywords,canaryCases:c.cases.length},null,2)+'\n')"
node -e "const b=require('./specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/registration-before.json'); const a=require('./specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/registration-after.json'); console.log(b.modes.every(x=>a.modes.includes(x)), b.surfaces.every(x=>a.surfaces.includes(x)), a.modes.includes('sk-code-ci'), a.surfaces.includes('sk-code-ci'), a.tieBreak.includes('sk-code-ci'), a.routerSignals.includes('sk-code-ci'), a.keywords.includes('sk-code-ci'))"
```

Expected: `true true true true true true true`.

Rollback: delete `scratch/registration-after.json` and the appended block.

Stop and escalate if: a before entry is missing from the after snapshot, because a registration task replaced an array instead of inserting into it.

---

### T065 Close the acceptance rows and validate the packet (AC-007)

File: `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/acceptance-criteria.md:96`, anchor: the `## 3. CLOSURE STATEMENT` heading.

Change: copy the observed output of T001 and T060 to T064 into each row's Verification cell, set each Status to `Met`, and rewrite the closure statement to name the observed state. Then repair the generated metadata and validate.

Check:

```bash
node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface --apply
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PWD/specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface" --strict --no-recursive | tail -1
grep -c '| Unmet |' specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/acceptance-criteria.md
```

Expected: `RESULT: PASSED` and `0`.

Rollback: restore the previous Status cells, the closure statement and the two generated metadata files with `git checkout`.

Stop and escalate if: a row cannot name observed evidence, or the validator prints `RESULT: FAILED`.

---

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification (continued)

### T066 Commit the phase (AC-007)

File: the git index and `/tmp/commit-msg-ci-surface.txt`. Anchor: none.

Change: write the full commit message to a file, validate it, count the staged paths, then commit with `-F`, so the message names the new surface, the registration and the exception, and carries no R-id, D-id or phase number.

Check:

```bash
cat > /tmp/commit-msg-ci-surface.txt <<'EOF'
feat(sk-code): register the CI surface

The hub names three read-only surfaces and no CI entry, so a workflow request
gets no packet and no rule data.

The packet carries the rule data, the routing keywords, the hub registration and
the message-contract exception, and the generated artifacts are rebuilt from
those sources.

Spec: system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-msg-ci-surface.txt
git diff --cached --name-only | wc -l
git commit -F /tmp/commit-msg-ci-surface.txt
git log -1 --format=%B | grep -cE '\bR2[2-3]\b|\bD[0-9]+\b|[Pp]hase 0[0-9]'
git log -1 --format=%B | grep -c '^Spec: system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface$'
```

Expected: `validate-message.mjs` exits `0`; at least `30` staged paths; `0`; and `1`.

Rollback: `git reset --soft HEAD~1` and delete `/tmp/commit-msg-ci-surface.txt`.

Stop and escalate if: the validator exits non-zero twice, the ephemeral-id count is not `0`, or the staged path count is below `30`.

---

### T067 Record the phase result and the follow-up (AC-009)

File: `specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/phase-result.md`, anchor: the `## Registration after` section T064 wrote.

Change: append a `## Phase result` section naming the commit SHA, the seven gate outcomes and the follow-up sentence.

Check:

```bash
grep -c '^## ' specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/phase-result.md
grep -c '^follow-up: ' specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/scratch/phase-result.md
```

Expected: at least `6` and `1`. The follow-up line reads `follow-up: rerun T064 after specs/sk-code/013-private-surface-skills/002-hub-surface-removal lands, and keep sk-code-ci in mode-registry.json, hub-router.json, ROUTER.md and SKILL.md`.

Rollback: delete the `## Phase result` section.

Stop and escalate if: `ordering-state: pre-013/002` no longer holds and no follow-up line was written.

---

### T068 Commit the closure evidence (AC-007)

File: the git index and `/tmp/commit-msg-ci-surface-closure.txt`. Anchor: none.

Change: stage every closure file T064 to T067 wrote, write the closure commit message to a file, validate it, then commit with `-F`, so `acceptance-criteria.md`, the registration snapshot and the phase result are committed and the tree ends clean.

Check:

```bash
git add -A
cat > /tmp/commit-msg-ci-surface-closure.txt <<'EOF'
docs(sk-code): record the CI surface closure

The phase commit carries the packet and its registration. The closure commit
records the acceptance rows, the post-phase registration snapshot and each
gate's observed output, so the tree ends clean.

Spec: system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-msg-ci-surface-closure.txt
git diff --cached --name-only | wc -l
git commit -F /tmp/commit-msg-ci-surface-closure.txt
git status --porcelain | wc -l
```

Expected: `validate-message.mjs` exits `0`; at least `2` staged paths; `0` from `git status --porcelain`.

Rollback: `git reset --soft HEAD~1` and delete `/tmp/commit-msg-ci-surface-closure.txt`.

Stop and escalate if: the validator exits non-zero twice, fewer than `2` paths are staged, or `git status --porcelain` prints a path after the commit.

---

<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Recommendations**: See `../001-research/research/synthesis-reviews/final-review.md` (`:430-456` for R22 and R23, `:579-583` for the phase plan)
- **Registry contract**: See `../001-research/research/research.md` (`:205-241`)
- **Baseline**: See `scratch/phase-baseline.md`, written by T001
- **Decisions**: See `decision-record.md` (ADR-001 to ADR-010)

| R-id | Requirements | Tasks | Acceptance criteria |
|------|--------------|-------|---------------------|
| R22 | REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-007, REQ-008, REQ-009, REQ-010 | T001-T016, T018-T068 | AC-001, AC-002, AC-003, AC-004, AC-005, AC-007, AC-008, AC-009, AC-010, AC-011, AC-012 |
| R23 | REQ-006, REQ-010 | T017, T063, T065 | AC-006, AC-010 |
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md - REQ-001 to REQ-010, each naming R22 or R23
- [ ] CHK-002 [P0] Technical approach defined in plan.md - the packet shape, the additive registration, the generated artifacts and the four gate families
- [ ] CHK-003 [P1] Dependencies identified and available - the 002 D1 default, the 004 R12 and R14 state, the D2 PR-only default and the `013/002` ordering state (T002, T004)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks - every JSON file parses, every YAML template parses, and `verify-doc-claims.cjs` exits 0 (T014, T015, T048, T061)
- [ ] CHK-011 [P0] No console errors or warnings - the hub gates print PASS lines and no `[WARN]` names this packet (T060, T061)
- [ ] CHK-012 [P1] Error handling implemented - a missing packet folder fails check 3c before the registry entry is added, and a leaf-set collision is handled by `leaf-scopes.json` (T020, T033)
- [ ] CHK-013 [P1] Code follows project patterns - the packet copies the `sk-code-obsidian` surface frontmatter, the registry copies the existing surface entry shape, and no comment carries a packet id (T007, T020, T024)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met - `acceptance-criteria.md` rows AC-001 to AC-012
- [ ] CHK-021 [P0] Manual testing complete - the operator reads the packet as a reviewer and confirms each rule has its evidence (T010 to T017)
- [ ] CHK-022 [P1] Edge cases tested - the pre- and post-`013/002` registration states, the D1 A/B forms and the D2 PR/main forms are the six-row matrix in plan.md (T004, T064)
- [ ] CHK-023 [P1] Error scenarios validated - a missing packet folder, a leaf-set collision, a diverged canary twin and a missing `CI_WORKFLOW` child path each have a named repair in spec.md §8
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class - `class-of-bug` for the absent CI surface and the unrecorded exception; `matrix/evidence` for the ten rule families and the registration list
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed - the `mode-registry.json` mode list and the three existing surface entries are the producers the new entry must match (T003, T020)
- [ ] CHK-FIX-003 [P0] Consumer inventory completed - the eleven files in `scratch/consumer-inventory.md` are the consumers, and T020 to T052 update each (T006)
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests - the parser-facing risks are the `ROUTER.md` §11 map and the guard's hard-coded `SURFACES`; legs 1a, 1b, 2, 3 and 4 are the adversarial checks (T028 to T032, T061)
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed - ordering state x D1 form x D2 form with six required rows, in plan.md
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state - the pre-`013/002` and post-`013/002` states are the two hostile variants (T004, T064)
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range - `scratch/phase-result.md` records the commit SHA and each gate's output (T066, T067, T068)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets - the packet and templates carry no token, key or variable value; `permissions: contents: read` is the only permission the templates show (T014, T015)
- [ ] CHK-031 [P0] Input validation implemented - the packet's tool surface is read-only and the registry entry forbids `Write`, `Edit` and `Task` (T007, T020)
- [ ] CHK-032 [P1] Auth/authz working correctly - no workflow permission, secret or repository variable is changed; the only state-changing call is a generator writing its own artifact (T056, T057)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized - spec.md REQ-001 to REQ-010, tasks.md T001 to T068, acceptance-criteria.md AC-001 to AC-012
- [ ] CHK-041 [P1] Code comments adequate - the templates explain why each block exists and the packet explains its refusal boundary (T007, T014, T015)
- [ ] CHK-042 [P2] README updated - the packet README and the hub README surface table (T008, T045)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only - the baseline, the pattern inputs, the registration snapshots, the ordering state, the anchors, the inventory and the result all live in the phase's `scratch/`
- [ ] CHK-051 [P1] scratch/ cleaned before completion - the eight documents are kept on purpose: they are the pre-phase snapshot and the gate evidence a later rebase reads
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 23 | 0/23 |
| P2 Items | 9 | 0/9 |

**Verification Date**: 2026-10-23
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented - ADR-001 to ADR-010 in `decision-record.md`
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted) - all ten are `Proposed`
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale - each ADR names its rejected alternatives and why
- [ ] CHK-103 [P2] Migration path documented - the `013/002` ordering and the `2.4.0.0` release are the migration path (plan.md Implementation Notes)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Response time targets met (NFR-P01) - the phase adds no CI job and no runner minute
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02) - one more `modes[]` entry and two vocabulary classes are the only routing cost
- [ ] CHK-112 [P2] Load testing completed - not applicable; the packet is reference data
- [ ] CHK-113 [P2] Performance benchmarks documented - R22 and R23 save 0 standalone and 0 after R1, recorded in spec.md §4
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested - plan.md §7 and spec.md §6 revert one commit and regenerate the two manifests
- [ ] CHK-121 [P0] Feature flag configured - not applicable; the packet is additive and the advisor identity is unchanged
- [ ] CHK-122 [P1] Monitoring/alerting configured - the hub gates are the monitoring; T060 to T062 run them
- [ ] CHK-123 [P1] Runbook created - plan.md's AI Execution Protocol and tasks.md are the runbook
- [ ] CHK-124 [P2] Deployment runbook reviewed - the phase handoff names the four gate commands
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed - the read-only surface and the protected set are reviewed in T013 and T020
- [ ] CHK-131 [P1] Dependency licenses compatible - no dependency is added; the packet is Markdown, JSON and YAML
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed - not applicable; no request handling, input parsing or authentication is added
- [ ] CHK-133 [P2] Data handling compliant with requirements - no data is stored or transmitted
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized - spec.md, plan.md, tasks.md, acceptance-criteria.md and goal.md name the same R22 and R23 scope
- [ ] CHK-141 [P1] API documentation complete - the packet's reference map and machine-readable block are its API (T007)
- [ ] CHK-142 [P2] User-facing documentation updated - the hub README surface table and the packet README (T008, T045)
- [ ] CHK-143 [P2] Knowledge transfer documented - plan.md Implementation Notes and `scratch/phase-result.md`
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | Pending | |
| Operator | Product Owner | Pending | |
| Operator | QA Lead | Pending | |
<!-- /ANCHOR:sign-off -->
