---
title: "Implementation Plan: Phase 3: trigger-and-job-hygiene"
description: "Add a concurrency group to the 30 PR-triggered workflows, filter command-tree-parity and agent-mirror-sync to the inputs their checkers actually read, delete dispatch-enforcement-guard's duplicate dispatch-audit step, remove one suppression layer from the two report-only workflows, and check out at default depth where no history is read, with a pre-commit duplication inventory and a README table to match."
trigger_phrases:
  - "trigger and job hygiene plan"
  - "phase 3 trigger and job hygiene plan"
  - "workflow concurrency and path filter plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: trigger-and-job-hygiene

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML; bash (`check-gate-inputs.sh`, the pre-commit hook); Node.js 20/22 for the checkers |
| **Framework** | GitHub Actions triggers, `concurrency:` groups, path filters; the repository's twin-filter gate; vitest for the hooks tree |
| **Storage** | None. `scratch/` holds the baseline rows, the pre-commit inventory and the measured result |
| **Testing** | `bash .github/scripts/check-gate-inputs.sh`; a YAML parse of all 33 workflows; CI trigger probes read with `gh run list`; job timings read with `gh api .../actions/jobs/<id>` |

### Overview
Each recommendation in this phase is one of four shapes: a trigger change (R3, R4, R5, R9, R10), a job-shape change (R6), a reporting change (R7), or a checkout-depth change (R8), plus one inventory (R11). The trigger changes are gated by `check-gate-inputs.sh`, which parses every `paths:` list and requires an `.opencode/` twin for every `.skilled/` entry. The job-shape and reporting changes are proved on a test branch by reading the run's steps. The checkout change is proved by the job's own duration. Every claim of a saving is measured against `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md`, not against the research figures.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: the 002 baseline exists, D2, D3, D4, D7 and D10 are answered, and `gh` holds `repo` and `actions`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing: `check-gate-inputs.sh` prints `RESULT: PASSED`, all 33 workflows parse, and every CI probe is recorded under `scratch/`
- [ ] Docs updated: `.github/workflows/README.md` push/PR table, `scratch/pre-commit-inventory.md`, spec/plan/tasks
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Four independent edit classes over one trigger-and-job surface, each with its own gate. Trigger edits are validated statically by the twin-filter gate and dynamically by a paired positive and negative probe. Job-shape edits are validated by reading the run's step list. Depth edits are validated by the job's duration against its own prior samples.

### Key Components
- **Concurrency group** (`trigger-index-rebuild.yml:21-23` is the only existing one): `group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}` gives one slot per workflow per pull request, and per workflow per ref on push. `cancel-in-progress: ${{ github.event_name == 'pull_request' }}` cancels only a superseded PR run.
- **Path filter** (`command-tree-parity.yml:5-8`, `agent-mirror-sync.yml:3-4`, `skill-doc-frontmatter.yml:5-23`): GitHub evaluates `paths:` against the files a push or PR changes. The gate reads the same lists at `check-gate-inputs.sh:360-372` and enforces the twin rule at `:107-121` and `:336`.
- **Parity checkers** (`command-tree-parity.yml:33,65-66`): `validate-command-tree-parity.sh` runs `runtime-mirrors/sync-runtime-mirrors.cjs --check`, which reads `.claude/agents`, `.skilled/commands`, `.claude/commands`, `.cursor/commands`, `.cursor/agents`, `.devin/agents`, the four hook configs and their four hook mirrors (`sync-runtime-mirrors.cjs:39,46-54,125-143`). `sync-skills-hermes.cjs` reads `.skilled/skills/**/SKILL.md` and `.skilled/agents` (`:20,27,61,212-221`). `sync-prompts-hermes.cjs` reads `.skilled/commands` (`:21`).
- **Hooks vitest config** (`.skilled/hooks/vitest.config.ts:38-45`): collects every `*.{test,spec}.*` under `.skilled/hooks` and excludes the JS tests that do not import vitest. Seven suites survive: five under `dispatch/` and two outside it.
- **Report-only jobs** (`advisory-checks.yml:26-68`, `strict-pass-freshness-report.yml:164-178`): `continue-on-error: true` on the step keeps the job green; the inner `|| true` and `|| echo` are what hide the step's own status.
- **Installed pre-commit hook** (`.skilled/scripts/git-hooks/pre-commit`): 12 gate keys — `agent-mirror-sync`, `comment-hygiene`, `doc-version-bump`, `hook-flags`, `hook-trust`, `mcp-mutation-class`, `mirror-parity`, `prompt-card-sync`, `route-remint`, `skill-authoring`, `spec-remint`, `template-phrase-lint`. `.skilled/hooks/git/pre-commit` is a 115-line compatibility helper for legacy direct invocation, not the installed hook.

### Data Flow
A push or PR changes files → GitHub matches the workflow's `paths:` list → a match starts one run in the workflow's concurrency group → a newer run of the same workflow on the same PR cancels the older one → the job runs → a step's non-zero exit is reported on the step while `continue-on-error` keeps the job green → `check-gate-inputs.sh` reads the same `paths:` list from the committed file and asserts the twin pair, so a filter that omits a twin fails before merge rather than at run time.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.github/workflows/*.yml` (30 PR-triggered files) | Producer of the run's concurrency slot | update: one block above `jobs:` in each | `grep -L '^concurrency:' .github/workflows/*.yml` returns exactly 2 files, and `grep -lF "cancel-in-progress: \${{ github.event_name == 'pull_request' }}" .github/workflows/*.yml \| wc -l` returns 30 |
| `trigger-index-rebuild.yml:21-23` | The one existing group, push-only, `cancel-in-progress: false` | unchanged | `sed -n '21,23p'` still shows its own group |
| `dependabot-auto-merge.yml:6-8` | PR-only, excluded from the group | unchanged | no `concurrency:` in the file |
| `command-tree-parity.yml:5-8` | Unfiltered triggers | update: `paths:` on both events | `bash .github/scripts/check-gate-inputs.sh` passes; a nested-SKILL.md PR runs both jobs, a specs-only PR runs neither |
| `command-tree-parity.yml:47-50` | Comment claiming no filter is narrow enough | update: describe the filter and the missed-input failure it guards | `sed -n '44,58p' .github/workflows/command-tree-parity.yml` |
| `changed-packet-validation.yml:4-7` | Unfiltered triggers | unchanged (D10=skip, 2026-10-23); filtered only if a later phase flips the choice | `git diff --stat <phase-range> -- .github/workflows/changed-packet-validation.yml` is empty under the recorded skip |
| `dispatch-enforcement-guard.yml:41-50` | Runs `dispatch-audit.test.mjs` explicitly, with its own install | update: delete the step (D4=drop-step, 2026-10-23) | `grep -c 'dispatch-audit.test.mjs' .github/workflows/dispatch-enforcement-guard.yml` returns 0 |
| `dispatch-enforcement-guard.yml:31-35,52-67` | Fail-closed rule-suite guard; whole-tree vitest run | unchanged | `git diff` shows no line touched inside either block; seven suite paths appear in a run log |
| `.skilled/hooks/vitest.config.ts:38-45` | Decides which seven suites the whole-tree run collects | unchanged | `.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts --reporter=verbose` lists the seven |
| `advisory-checks.yml:27,41,55` | `continue-on-error: true` on the three report steps | unchanged | `grep -c 'continue-on-error: true' .github/workflows/advisory-checks.yml` returns 3 |
| `advisory-checks.yml:38,52,68` | Inner suppression that hides the step's status | update: explicit failing branch, message kept | a broken input shows the step `failure` and the job `success` |
| `strict-pass-freshness-report.yml:165,172` | `continue-on-error` plus `\|\| true` on the repair report | update: capture the status, print the report, exit with it | the step `failure` / job `success` probe, and the report still in the log |
| `rule-canary-sync.yml:13-15`, `repo-rules-corpus.yml:31-33` | Full-history checkout | update: delete the `with: fetch-depth: 0` block | `grep -c 'fetch-depth' .github/workflows/rule-canary-sync.yml` returns 0 |
| `deep-loop-runtime.yml:38-42` (fetch-depth was `:42` before the concurrency block, `:46` after it) | Full-history checkout for the parent commit | update: `fetch-depth: 2` (D7=depth-2, 2026-10-23) | `grep -n 'fetch-depth' .github/workflows/deep-loop-runtime.yml` returns `46: fetch-depth: 2` |
| `agent-mirror-sync.yml:3-4` | Unfiltered PR trigger | update: `paths:` for the four agent roots, the checker and its lib at both roots, the spec-kit package at both roots and the workflow | a specs-only PR runs nothing; an agent-file PR and a lib-only PR run |
| `skill-doc-frontmatter.yml:5-23` | Two filter lists that omit their own guard and workflow | update: add the guard at both roots and the workflow file to both lists | a guard-only PR runs the workflow; `grep -c 'check-skill-doc-frontmatter.sh'` returns 2 |
| `.github/workflows/README.md:64-75` | Push/PR table | update: move `command-tree-parity.yml` to the path-filtered row; state `agent-mirror-sync.yml`'s filter | `sed -n '64,75p'` matches the YAML |
| `.skilled/scripts/git-hooks/pre-commit` | The installed hook's 12 gates | unchanged; read only | `scratch/pre-commit-inventory.md` has one row per gate key |

Required inventories:
- Same-class producers: `rg -n '^concurrency:' .github/workflows` finds one producer today (`trigger-index-rebuild.yml:21`); `rg -n 'cancel-in-progress' .github/workflows` finds one (`:23`); `rg -n 'fetch-depth: 0' .github/workflows` finds 10 sites in 10 files.
- Consumers of changed symbols: `rg -n 'dispatch-audit\.test\.mjs' .github/workflows .skilled --glob '!**/node_modules/**'` finds the explicit step at `dispatch-enforcement-guard.yml:50`, and the include glob at `.skilled/hooks/vitest.config.ts:38` is what collects the same suite once that step is gone; `rg -n 'check-skill-doc-frontmatter|skill-doc-frontmatter' .github .skilled --glob '!**/node_modules/**'` finds the guard at `skill-doc-frontmatter.yml:34` and the workflow's own filters.
- Matrix axes: event (`push`, `pull_request`, `workflow_dispatch`) × workflow class (path-filtered, unfiltered, required-context). Required rows: PR + matching path (runs), PR + non-matching path (no run), push + matching path (runs), push + non-matching path (no run), PR + second push (older run cancelled), push + second push (no cancellation), `workflow_dispatch` (runs, grouped by ref).
- Algorithm invariant: two runs of one workflow for one pull request share exactly one group string, and a filter names every file its checker reads. Adversarial cases: a filter entry under the wrong event, a `.skilled/` entry with no `.opencode/` twin, a group key that interpolates a per-run value (`github.run_id`), and a checker path that changes without its filter entry.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Implementation Notes

- **Five decisions recorded 2026-10-23 in `scratch/decisions.md`, with the alternatives frozen here.** D2 (main cancellation) is pr-only: `cancel-in-progress: ${{ github.event_name == 'pull_request' }}`. The alternative is `cancel-in-progress: true`, which reclaims 817 wall-minutes per window standalone and about 89 after R1 (`final-review.md:615`).
- **D3=approve** R4, worth ~265 runner-min/day standalone and ~123 after R1. The alternative is to leave `command-tree-parity.yml` unfiltered, which keeps the comment at `:47-50` true and saves nothing.
- **D4=drop-step** keeps the two jobs and deletes the duplicate `dispatch-audit` step at `:41-50`, because the guard is protected and merging renames its checks. The alternative is one merged job with one checkout and one install, inferred at ~1-2 billed minutes per run (`final-review.md:260-273`).
- **D7=depth-2** sets `fetch-depth: 2` on `deep-loop-runtime.yml` at `:46` after the concurrency block (the earlier position was `:42` before it), because the mode-event suites bind a run to a commit and its parent (`:38-39`) and need nothing older. The alternative is to keep depth 0.
- **D10=skip** leaves `changed-packet-validation.yml` unfiltered, worth about 10 runner-min/day after R1 and rejected as a meaningful saving because 33 of 38 human pushes touch `specs/` (`final-review.md:251-258`). The alternative is the filter, whose entries are listed in the task.
- **R4's filter is derived from a full read, not from the review's summary.** R4 names the command trees, the agent trees, `SKILL.md`, `.hermes`, the checkers, the spec-kit package and the workflow file. The plan adds the roots the parity checker actually reads: `.claude/agents`, `.cursor/agents`, `.devin/agents`, `.cursor/commands`, the four hook configs and their four hook mirrors (`sync-runtime-mirrors.cjs:39,46-54,125-143`). Every added root is one a checker reads, so the filter stays a filter and not a re-run of the whole tree.
- **The twin rule is not optional.** `check-gate-inputs.sh:110-122` matches twins within one filter group and raises `filter-twins` at `:336`. Every `.skilled/` entry in a `paths:` list needs its `.opencode/` twin in the same list. `.claude/`, `.codex/`, `.cursor/`, `.devin/`, `.hermes/`, `specs/` and `.github/` entries self-twin and need no partner.
- **R7 keeps the message and drops the suppression.** The `\|\| echo` at `advisory-checks.yml:52,68` carries the fix hint. It becomes an `if ! node ...; then echo "::error::<hint>"; exit 1; fi` branch, so the hint still prints and the step still fails. `strict-pass-freshness-report.yml:172` needs the same care in the other direction: with `set -euo pipefail`, dropping `\|\| true` would abort before the captured report prints, so the step captures the status and exits with it after `cat`.
- **R6 changes no check name under the default.** Deleting `:41-50` removes the step and its `npm --prefix .skilled ci` with it; `dispatch-rule-checks.test.mjs` is dependency-free (`:5-19`), so the remaining step needs no install. The `hooks-vitest` job is untouched.
- **No ephemeral ids in code.** No R-id, D-id or phase number goes into a workflow comment, a step name, a filter entry, the README row or the inventory document. Those ids belong to these spec documents; a code comment carries the durable WHY.
- **One commit per concern.** The 30 concurrency blocks, the two filters, the deleted step, the suppression removal, the three depth changes, the README row and the inventory are separate commits, so a probe that fails names the commit that caused it.
- **The concurrency block lands last.** Three inserted lines above `jobs:` shift every line below it. Four tasks anchor on lines below `jobs:` in the same file, so the block goes in after the content edits and every quoted line number stays valid. `jobs:` itself never moves, which is why it is the only anchor that block needs.
- **`scratch/decisions.md` is the record, not the plan.** Each answer is one `Dn=<answer>` line in `scratch/decisions.md`, and its decision task verifies it. The alternatives stay in these notes, so a reader sees what was planned and what was answered without reading two documents against each other.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Every `paths:` list parses and every `.skilled/` entry has its twin | `bash .github/scripts/check-gate-inputs.sh` (expected `RESULT: PASSED`, `failures=0`, `twin_pairs` >= 311) |
| Static | All 33 workflow files are valid YAML | `python3 -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]"` |
| Unit | The seven hooks vitest suites still collect and pass | `.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts --reporter=verbose` after `npm --prefix .skilled ci` |
| Integration | A trigger fires on its input and not on another | Two pull requests per filtered workflow: one touching the input, one touching only `specs/**`; read with `gh run list --workflow <file> --commit <sha>` |
| Integration | A superseded PR run is cancelled | Two pushes to one test PR; `gh run list --workflow message-contract.yml --branch <branch> --json databaseId,headSha,conclusion` |
| Integration | A failing step shows while its job stays green | One throwaway branch per report-only workflow; `gh api repos/{owner}/{repo}/actions/jobs/<job-id> --jq '.conclusion, (.steps[] \| {name,conclusion})'` |
| Manual | Checkout depth and job duration | `gh api repos/{owner}/{repo}/actions/jobs/<job-id> --jq '.started_at, .completed_at, (.steps[] \| select(.name \| startswith("Run actions/checkout")) \| .started_at, .completed_at)'` |
| Manual | The phase delta | `scratch/phase-result.md` against `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-rebuild-fanout-removal` baseline | Internal | Pending | Every "after R1" number is unanchored and R3's main figure stays at 817 wall-min per window |
| Operator decision D2 | Internal | Green | D2=pr-only (2026-10-23); T001 only verifies `scratch/decisions.md` |
| Operator decision D3 | Internal | Green | D3=approve (2026-10-23); T002 only verifies `scratch/decisions.md` |
| Operator decision D4 | Internal | Green | D4=drop-step (2026-10-23); T003 only verifies `scratch/decisions.md` |
| Operator decision D7 | Internal | Green | D7=depth-2 (2026-10-23); T004 only verifies `scratch/decisions.md` |
| Operator decision D10 | Internal | Green | D10=skip (2026-10-23); T005 only verifies `scratch/decisions.md` |
| `gh` with `repo` and `actions` scopes | External | Green | No trigger probes, no job timings, no phase delta |
| `004-setup-caching-provisioning` | Internal | Pending, no dependency | It can run alongside; it adopts the composite action only in hooks-node-tests, opencode-plugin-tests and opencode-dual-version, so it shares no line with this phase |
| `005-slow-and-failing-tests` | Internal | Pending, no dependency | It can run alongside; it owns `fileParallelism` in `.skilled/skills/system-spec-kit/vitest.config.ts:50,67` and this phase does not touch that file |
| `007-workflow-hygiene-on-off-control` | Internal | Blocked on this phase | Its switch `if:` and per-job timeouts need this phase's final job shapes (R6) |
| `008-consolidation-decision` | Internal | Blocked through 007 | It re-measures the always-run workflows after this phase's filters land |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A filter misses an input and a real drift lands green, a cancelled PR run leaves a required context unset, a report step's new failure breaks a consumer of the run status, or a checkout depth breaks a checker.
- **Procedure**: Revert the single commit for that concern. The concurrency blocks revert per file with no shared state; a filter revert restores the previous trigger and the README row moves back with it; the deleted step is restored by reverting `dispatch-enforcement-guard.yml`; the suppression removal is restored by reverting the two workflow files. `scratch/pre-commit-inventory.md` and `scratch/phase-result.md` stay: they record what was measured, and a revert is visible as a divergence from them.
<!-- /ANCHOR:rollback -->

---



---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
002 baseline ──► Setup (D2, D3, D4, D7, D10 + baseline rows)
                      │
                      ├──► Triggers (R3, R4, R5, R9, R10) ──┐
                      ├──► Job shape (R6) ──────────────────┤
                      ├──► Reporting (R7) ──────────────────┼──► Verify (probes, gates) ──► Delta ──► 007
                      ├──► Checkout depth (R8) ─────────────┤
                      └──► Inventory (R11) ─────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `002-rebuild-fanout-removal`, D2, D3, D4, D7, D10 | Triggers, Job shape, Reporting, Checkout depth, Inventory |
| Triggers | Setup | Verify |
| Job shape | Setup | Verify, `007-workflow-hygiene-on-off-control` |
| Reporting | Setup | Verify |
| Checkout depth | Setup, D7 | Verify |
| Inventory | Setup | Nothing in this phase; it is the input to a later cleanup |
| Verify | Triggers, Job shape, Reporting, Checkout depth | Delta |
| Delta | Verify, at least 24 h of post-merge traffic | `007-workflow-hygiene-on-off-control`, `008-consolidation-decision` |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~45 minutes: five decisions and the baseline rows |
| Triggers | Med | ~2 hours: 30 concurrency blocks, two filters, one filter-extension, the README table |
| Job shape | Low | ~20 minutes: one deleted step and its probes |
| Reporting | Med | ~45 minutes: three suppressions replaced with explicit branches and one status capture |
| Checkout depth | Low | ~15 minutes: three files, two deletions and one value |
| Inventory | Med | ~45 minutes: 12 gate keys against every workflow step |
| Verify | Med | ~1.5 hours of CI probes across two pull requests per filtered workflow |
| Delta | Low | ~30 minutes after a 24 h wait |
| **Total** | | **~6-7 hours across one or two calendar days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) - not applicable, no data changes
- [ ] Feature flag configured - not applicable; D2=pr-only (2026-10-23) is the only switch, and it is a YAML value
- [ ] Monitoring alerts set - the trigger probes and `scratch/phase-result.md` are the monitoring

### Rollback Procedure
1. Revert the commit for the failing concern, not the whole phase; the six concerns are independent.
2. Confirm the reverted workflow's trigger or job shape matches its pre-phase state with `git diff <revert-sha>^ <revert-sha> -- .github/workflows/<file>.yml`.
3. Re-run the probe that failed, and confirm it now shows the pre-phase behaviour.
4. Update `scratch/phase-result.md` with the reverted figure, so a later phase measures against what is actually deployed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. `scratch/phase-baseline.md`, `scratch/phase-result.md` and `scratch/pre-commit-inventory.md` are records, not state; a revert shows as a divergence from them.
<!-- /ANCHOR:enhanced-rollback -->

---


<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
        T001-T005  five operator answers
             │
             ▼
        T006  baseline rows copied from 002
             │
             ▼
┌───────────────────────────────────────────────────────────────┐
│ Content edits. Independent files, any order after T006.        │
│ T007-T011  command-tree-parity comment, then its two filters   │
│ T012-T013  dispatch guard, then the seven-suite proof          │
│ T014-T015  report suppression in both report-only workflows    │
│ T016-T017  checkout depth in three workflows                   │
│ T018-T019  agent-mirror-sync filter, frontmatter entries       │
│ T020-T021  pre-commit inventory, README table                  │
└───────────────────────────────┬───────────────────────────────┘
                                ▼
┌───────────────────────────────────────────────────────────────┐
│ T022-T023  concurrency block on the 30 PR-triggered files      │
│ T024       concurrency, rebuild-group and YAML proof           │
│ T025       whole-tree gates                                    │
│ T026       one commit per concern                              │
└───────────────────────────────┬───────────────────────────────┘
                                ▼
┌───────────────────────────────────────────────────────────────┐
│ T027-T036  CI probes, the inventory review and the 24 h delta  │
│ T037       acceptance rows closed with evidence                │
│ T038       closure evidence committed                         │
└───────────────────────────────────────────────────────────────┘
```

The content edits precede the concurrency block for a mechanical reason: inserting three lines above `jobs:` shifts every line below it, and four tasks anchor on lines below `jobs:`. Landing the block last keeps every quoted line number valid, and `jobs:` itself never moves.

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Five operator answers (T001 to T005) | `scratch/decisions.md` | Five verified lines | T007 to T023 where a decision gates them |
| Baseline rows (T006) | `002-rebuild-fanout-removal` and its `scratch/baseline-24h/summary.md` | `scratch/phase-baseline.md` with the 002 total and ten workflow rows | T035 |
| Command-tree-parity filter (T007 to T011) | T002, T006 | 23 entries on both events, a rewritten comment, a passing gate | T026, T027 |
| Dispatch guard (T012, T013) | T003, T006 | One dispatch-audit execution and a green local suite run | T026, T029 |
| Report suppression (T014, T015) | T006 | Four unsuppressed sites, three `continue-on-error` steps intact | T026, T030 |
| Checkout depth (T016, T017) | T004, T006 | Two `with:` blocks deleted, one value at 2 | T026, T031 |
| Review-time filters (T018, T019) | T006 | 11 entries on `agent-mirror-sync.yml`, 3 per list on `skill-doc-frontmatter.yml` | T026, T032, T033 |
| Inventory and README (T020, T021) | T006 | `scratch/pre-commit-inventory.md`, a table matching the YAML | T026, T034 |
| Concurrency block (T022, T023) | T001, T006, T007 to T021 | 30 files with the block above `jobs:` | T024, T026, T027 |
| Whole-tree gates (T024, T025) | T007 to T023 | `RESULT: PASSED`, a clean YAML parse, 30 matching files | T026 |
| One commit per concern (T026) | T024, T025 | Six concern commits with no ephemeral id in the diff | T027 to T036, T038 |
| Probes, inventory review and delta (T027 to T036) | T026, real CI traffic | Eight probe records, the inventory review and `scratch/phase-result.md` | T037 |
| Closure (T037, T038) | T027 to T036 | Acceptance rows marked `Met` and one commit carrying that evidence | Phase close |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T001 to T005, verify the five recorded operator answers** - ~10 minutes - CRITICAL
2. **T006, the baseline rows** - ~10 minutes, and it cannot start until 002 has recorded its 24 h snapshot - CRITICAL
3. **T007 to T021, the content edits** - ~2.5 hours across ten files, three scratch documents and the README - CRITICAL
4. **T022 to T025, the concurrency block and the gates** - ~1 hour for 30 files and three checks - CRITICAL
5. **T026, the commit set** - ~20 minutes including the six message validations - CRITICAL
6. **T027 to T036, the probes, the inventory review and the delta** - one to three days of wall clock, because each probe needs a pushed branch and the delta needs 24 h of post-merge traffic - CRITICAL
7. **T037, closure** - ~15 minutes - CRITICAL
8. **T038, the closure commit** - ~5 minutes including the seventh message validation - CRITICAL

**Total Critical Path**: ~4.5 hours of hands-on work inside a wall-clock window of one to four days, set by the 002 baseline, the probe runs and the 24 h delta.

**Parallel Opportunities**:
- T007 to T021 touch disjoint files, so they can run in any order or at the same time; only T007, T008 and T009 share one file, and their order is fixed bottom-up.
- T012 and T013 are independent of every filter task, so the guard work can proceed while the parity filter is being written.
- T020 and T021 touch a new scratch document and the README, so neither waits on a workflow edit.
- T027 to T034 each open their own pull request or dispatch run and can be observed in parallel once T026 lands.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Decisions answered and before-state recorded | Five lines in `scratch/decisions.md`; `scratch/phase-baseline.md` carries the 002 total and the ten workflow rows | After T001 to T006 |
| M2 | Content edits landed | The parity filter, the deleted step, the four unsuppressed sites, the three depth changes, the two review-time filters and the README table are on disk; `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED` | After T007 to T021 |
| M3 | Concurrency block landed and proven | `grep -L '^concurrency:' .github/workflows/*.yml` names exactly two files; 30 files carry the pull-request expression; all 33 parse; six commits carry no ephemeral id | After T022 to T026 |
| M4 | Probes recorded and phase closed | Each newly filtered workflow has one positive and one negative probe; the seven suites appear in a run log; `scratch/phase-result.md` carries the ten rows, the after numbers and the unmeasured PR-side note; every acceptance row is `Met`; the closure evidence is committed | After T027 to T038 |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Cancel the superseded pull-request run, and leave main's runs alone

**Status**: Proposed

**Context**: 32 of the 33 workflows declare no `concurrency:` group, so two pushes to one pull request leave two full runs racing. On `main`, the measured supersession is almost entirely self-inflicted by the rebuild commit: 177 pairs and 792 reclaimable wall-minutes per window before R1, and 23 pairs and 89 minutes after it. Cancelling on main would trade per-commit verdicts for a number that R1 has already shrunk.

**Decision**: Every PR-triggered workflow except `dependabot-auto-merge.yml` carries `group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}` and `cancel-in-progress: ${{ github.event_name == 'pull_request' }}`. Main and `workflow_dispatch` runs are grouped but never cancelled. `trigger-index-rebuild.yml` keeps its own group.

**Consequences**:
- A superseded pull-request run stops consuming a runner instead of finishing into a discarded verdict.
- `main` keeps one verdict per commit, at the cost of the 89 reclaimable wall-minutes D2 declines.
- The group key is stable per workflow and per pull request, so two workflows never share a slot and a third push replaces only the pending run.

**Alternatives Rejected**:
- `cancel-in-progress: true` everywhere: reclaims 817 wall-minutes per window standalone, about 89 after R1, and costs a verdict on every commit but the newest.
- `github.run_id` in the group key: no two runs ever share a slot, so nothing is ever cancelled and the block does nothing.

The formal records, including each operator decision's default and alternative and every design choice this plan freezes, are `decision-record.md` ADR-001 to ADR-011.

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation

T001 to T006. The five operator answers and the baseline rows gate everything after them. A task in this tier that stops leaves the rest of the phase unstarted, which is the intended behaviour: no edit may precede the answer that shapes it.

### Tier 2: Parallel Execution

T007 to T021. These tasks touch disjoint files, so all but three can run in any order. The exception is `command-tree-parity.yml`, where T007, T008 and T009 run bottom-up: the comment first, then the `push:` filter, then the `pull_request:` filter, so each anchor keeps the line number quoted in the task.

### Tier 3: Integration

T022 to T038. The concurrency block, the whole-tree gates, the commit set, the probes, the delta and the closure commit. Every task here reads the result of Tier 2 and none may start before Tier 2 is complete.

### Pre-Task Checklist

Before every task, confirm all five:
- [ ] The file named in the task exists at that path, and the quoted anchor text is on it.
- [ ] The line number in the task matches the anchor's current line. A mismatch means an earlier task moved it: re-read the file and locate the anchor before editing.
- [ ] The task's `Check` command has not already been run against a partially edited file.
- [ ] No earlier task's `Rollback` is pending.
- [ ] The task's acceptance-criterion id is recorded so its evidence lands in `acceptance-criteria.md`.

### Execution Rules

| Rule | Statement |
|------|-----------|
| TASK-SEQ | Run the tasks in numeric order. T007 to T021 may be reordered among themselves; every other task keeps its position. |
| TASK-SCOPE | Change only the file named in the task, and only the lines the anchor names. A nearby improvement is a separate task and is not in this phase. |
| TASK-ANCHOR | Quote the anchor before editing. If the exact text is absent, stop rather than guessing at a similar line. |
| TASK-COUNT | Run the task's `Check` and compare against `Expected`. A count that differs is a failed task, not a rounding difference. |
| TASK-IDS | Write no R-id, D-id or phase number into a workflow comment, a step name, a filter entry, a README row or an inventory row. |
| TASK-COMMIT | Commit once per concern, with the six subjects T026 names, after T025 passes. |
| TASK-EVIDENCE | Paste each `Check` output into the matching acceptance row. An unrecorded check is an unmet criterion. |

### Status Reporting Format

Report each task in four lines:

```text
T### <status: done | blocked | rolled-back>
Check: <the command's last line, or the count it printed>
Evidence: <file:line, run id, or scratch path>
Next: <the next task number, or the escalation reason>
```

### Blocked Task Protocol

A task is blocked when its anchor is absent after a re-read, its check fails twice, or its operator answer is missing. On a block:
1. Do not edit the file. Record the task number, the command and its output in `scratch/phase-result.md`.
2. Run the task's `Rollback` line if the task had already changed the file.
3. Stop the phase. A blocked task is reported, never worked around: the phase's gates assume every earlier edit landed exactly as written.
4. Resume only when the missing answer or the missing file exists, then re-run the blocked task from its `Pre-Task Checklist` entry.
<!-- /ANCHOR:ai-execution -->

---

