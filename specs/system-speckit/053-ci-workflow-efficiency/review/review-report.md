# Deep Review Report: 053 CI Workflow Efficiency (track synthesis)

<!-- MACHINE-OWNED: START -->

**Target**: `specs/system-speckit/053-ci-workflow-efficiency` (spec-folder, Level 2 phase parent with nine Level 3 children)
**Inputs**: lineage `deepseek` (cli-pi, deepseek-v4.1-flash-1017, 5 iterations, CONDITIONAL, 4 P1 / 12 P2) and lineage `luna` (cli-codex, gpt-6-luna, 5 iterations, CONDITIONAL with 0 P1 / 3 P2), merged registry `review/deep-review-findings-registry.json` (0 P0, 4 P1, 15 P2)
**Synthesis method**: every lineage finding re-opened at its cited file and line and marked CONFIRMED, REFUTED or DUPLICATE; then four operator-focus passes the lineages did not run (spec-versus-tree drift, sk-code-skilled alignment, sk-doc mode alignment, command contract and runtime mirrors)
**Report date**: 2026-10-25

---

## 1. EXECUTIVE SUMMARY

- **Overall verdict: CONDITIONAL**
- **hasAdvisories:** false (the verdict is CONDITIONAL, so the PASS-only flag stays false)
- **Active confirmed findings:** P0: 0, P1: 5, P2: 16
- **Lineage findings adjudicated:** 19 merged ids. 14 confirmed (3 of them with a severity change), 1 refuted, 4 duplicate or merged.
- **New findings from the operator-focus passes:** 3 P1, 4 P2.

**Scope summary.** The workflow implementation itself is sound and every machine gate the packet names passes from the current tree: 32 workflows and 44 jobs parse, 44 of 44 jobs carry `timeout-minutes`, 32 of 32 workflows declare `permissions:`, 42 jobs carry the `vars.SKILLED_CI` switch (all but Dependabot's two), 89 of 89 remote `uses:` are SHA-pinned, `check-gate-inputs.sh` prints `RESULT: PASSED`, `actionlint` and `shellcheck` exit 0, the `/doctor:ci` report suite passes 14 of 14, and `validate.sh --recursive --strict` prints `RESULT: PASSED` for all ten folders.

What fails is the packet's account of itself, plus one routing regression:

1. **A live test regression.** Commit `0781e81da2` (carried under the phase 006 Spec trailer) added the bare keyword `concurrency group` to the CI surface router, and the guard test written to keep that phrase off the CI surface now fails (`pass 7`, `fail 1`). Phase 006 AC-005 still records `pass 8`, `fail 0` as `Met`.
2. **Two phases report a pre-build tree.** Phase 007 (all five concern commits on main) and phase 004 (16 of 17 rows `Met`) both carry closure statements and implementation summaries that describe work as not built.
3. **The parent is stale for six of nine phases**, and its goal file carries a completion-criterion command that cannot pass on a correct tree.

The strict validator passes all of this, because no rule compares a closure statement or a phase map against the rows and the tree.

---

## 2. PLANNING TRIGGER

`/speckit:plan` **is required**: five P1 findings need a remediation pass. Four are documentation-state repairs inside this packet; one (SYN-P1-001) is a routing fix in the sk-code hub with regeneration of derived artifacts.

### Planning Packet

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": {
    "P0": [],
    "P1": ["SYN-P1-001", "R1-P1-001", "SYN-P1-002", "R1-P1-002", "SYN-P1-003"],
    "P2": ["R2-P1-001", "R5-P2-002", "R4-P1-001", "R5-P2-001", "R1-P2-001", "R1-P2-002", "R2-P2-002", "R3-P2-001", "R3-P2-002", "R4-P2-001", "R4-P2-002", "LUNA-P2-003", "SYN-P2-001", "SYN-P2-002", "SYN-P2-003", "SYN-P2-004"]
  },
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "priority": "P1",
      "title": "Remove the over-broad CI routing keyword and restore the guard test",
      "findings": ["SYN-P1-001", "SYN-P2-002"],
      "scope": [
        ".skilled/skills/sk-code/sk-code-ci/SKILL.md",
        ".skilled/skills/sk-code/ROUTER.md",
        ".skilled/skills/sk-code/hub-router.json",
        ".skilled/skills/sk-code/graph-metadata.json",
        ".skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json",
        "specs/system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface/acceptance-criteria.md"
      ],
      "exitCriteria": "node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs prints pass 8 fail 0; verify-router-sync.cjs --checks 1a,1b,2,3,4 passes; 006 AC-001, AC-002 and AC-005 re-run and record current output."
    },
    {
      "id": "WS-2",
      "priority": "P1",
      "title": "Reconcile phase 007 and phase 004 documents with the delivered tree",
      "findings": ["R1-P1-001", "SYN-P1-002", "R4-P1-001"],
      "scope": [
        "specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/{spec,acceptance-criteria,implementation-summary,goal,tasks}.md",
        "specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/{acceptance-criteria,implementation-summary,goal,tasks}.md",
        "specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/tasks.md"
      ],
      "exitCriteria": "Each closure statement counts the rows the table actually holds; each implementation summary lists delivered files with their commits; continuity next_safe_action names only open tasks; every ### T heading carries a status marker."
    },
    {
      "id": "WS-3",
      "priority": "P1",
      "title": "Refresh the parent spec and parent goal",
      "findings": ["R1-P1-002", "SYN-P1-003", "R5-P2-001", "R2-P1-001"],
      "scope": [
        "specs/system-speckit/053-ci-workflow-efficiency/spec.md",
        "specs/system-speckit/053-ci-workflow-efficiency/goal.md"
      ],
      "exitCriteria": "The phase map equals each child's spec.md Status; open questions closed with pointers; D9 recorded as write; R30 marked superseded; the goal criterion 4 command prints 6 on the current tree."
    },
    {
      "id": "WS-4",
      "priority": "P2",
      "title": "Correct stale closure sentences, citations and counts",
      "findings": ["R1-P2-001", "R1-P2-002", "R2-P2-002", "R5-P2-002", "R4-P2-002", "LUNA-P2-003", "SYN-P2-001", "SYN-P2-003"],
      "scope": [
        "specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/acceptance-criteria.md",
        "specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/{acceptance-criteria,decision-record,implementation-summary,tasks}.md",
        ".skilled/commands/doctor/scripts/ci-report.cjs",
        ".skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md"
      ],
      "exitCriteria": "No closure sentence defers a commit its task list records as landed; every cited line holds the quoted text."
    },
    {
      "id": "WS-5",
      "priority": "P2",
      "title": "Close the CI standard gaps and the command contract gaps",
      "findings": ["R3-P2-001", "R3-P2-002", "SYN-P2-004", "R4-P2-001"],
      "scope": [
        ".skilled/skills/sk-code/sk-code-ci/references/{job-shape-rules,protected-set}.md",
        ".skilled/skills/sk-code/sk-code-ci/assets/{workflow-template,job-block-template}.yml",
        ".skilled/skills/sk-doc/sk-create-command/assets/command-contract.json",
        ".skilled/commands/doctor/ci.md"
      ],
      "exitCriteria": "The standard states persist-credentials and both skip semantics without contradiction; the doctor contract names both /doctor:ci mutations; generate-command-routers.cjs --check stays clean."
    }
  ],
  "specSeed": [
    "A closure statement is a count of the rows above it; a sentence that disagrees with the table is a defect even when the validator passes.",
    "A routing keyword that a guard test exists to exclude must not be added without running that test.",
    "A gate command in a goal must be run once on a correct tree before it is frozen."
  ],
  "planSeed": [
    "Add a validator rule that recounts Met/Unmet rows and fails a closure statement whose count differs.",
    "Add a parent phase-map rule comparing each row to the child spec.md Status.",
    "Add a tasks.md rule failing any ### T heading with no [ ], [x], [P] or [B] marker.",
    "Run compiled-route-surface-hint.test.cjs inside run-all-drift-guards.sh so a hub keyword edit cannot skip it."
  ],
  "findingClasses": [
    "test_regression",
    "completion_state_contradiction",
    "unsatisfiable_gate_command",
    "stale_gate_criterion",
    "stale_evidence_clause",
    "task_status_gate_gap",
    "standard_self_contradiction",
    "unstated_standard_rule",
    "contract_coverage_gap",
    "broken_cross_reference"
  ],
  "affectedSurfacesSeed": [
    ".skilled/skills/sk-code/{ROUTER.md,hub-router.json,graph-metadata.json}",
    ".skilled/skills/sk-code/sk-code-ci/{SKILL.md,references/protected-set.md,references/job-shape-rules.md,references/trigger-and-filter-rules.md}",
    ".skilled/commands/doctor/{ci.md,scripts/ci-report.cjs}",
    ".skilled/skills/sk-doc/sk-create-command/assets/command-contract.json",
    "specs/system-speckit/053-ci-workflow-efficiency/{spec.md,goal.md}",
    "specs/system-speckit/053-ci-workflow-efficiency/{002,004,006,007,008,009}-*/"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. ACTIVE FINDING REGISTRY

Severity is the field that decides the verdict. Ids from the lineages are kept; synthesis ids start with `SYN-`. "Operator decision" marks a fix that needs a ruling first.

### P0: Blockers (0)

None.

### P1: Required (5)

#### SYN-P1-001: The bare `concurrency group` keyword sends non-CI prompts to the CI surface and fails the guard test (NEW)

- **Severity:** P1. **Dimension:** correctness (routing). **Disposition:** active, confirmed by a failing test.
- **File:line:** `.skilled/skills/sk-code/sk-code-ci/SKILL.md:61`, `.skilled/skills/sk-code/ROUTER.md:61` and `:252`, `.skilled/skills/sk-code/hub-router.json:80`, `.skilled/skills/sk-code/graph-metadata.json:129`; guard at `.skilled/bin/tests/compiled-route-surface-hint.test.cjs:98-111`.
- **Evidence:** `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` exits 1 with `pass 7`, `fail 1`: `non-CI prompts that share CI words do not select the CI surface` fails on the prompt `assign each tenant its own concurrency group inside the worker pool` (assertion at `:109`). `git show 0781e81da2` adds `"concurrency group"` to all five files listed (and `"ci job"`, `"action to a sha"`, `"sha-pinned action"`); `hub-router.json:80` already carried the precise form `"actions concurrency group"`. Phase 006 `acceptance-criteria.md:63` (AC-005, `Met`) records `pass 8 and fail 0` from 2026-10-24, before that commit. The sk-code-ci README (`README.md:69`) and playbook (`manual-testing-playbook.md:67`) both cite this test as a passing check.
- **Impact:** a Node or worker-pool prompt that says "concurrency group" bundles the GitHub Actions evidence into an unrelated task, and a closed phase claims a test result the tree no longer produces.
- **Fix:** delete the bare `"concurrency group"` keyword from `sk-code-ci/SKILL.md:61` (INTENT_SIGNALS `CI_WORKFLOW`), `ROUTER.md:61` (table cell) and `ROUTER.md:252` (INTENT_SIGNALS), `hub-router.json:80` (keep `"actions concurrency group"`), and `graph-metadata.json:129`. Regenerate `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` and the two `activation/sk-code/manifest.json` copies with the same generators `0781e81da2` used. Re-run the test (expect `pass 8`, `fail 0`), `verify-router-sync.cjs --checks 1a,1b,2,3,4` and `parent-skill-check.cjs .skilled/skills/sk-code`, then append the re-run to 006 AC-005 as a dated amendment. Recommended and optional: add `run the surface-hint test` to `run-all-drift-guards.sh` so a keyword edit cannot pass the wrapper while this suite fails.
- **findingClass:** test_regression. **scopeProof:** the keyword shipped under the 006 Spec trailer, and 006 AC-005 claims the test.

#### R1-P1-001: Phase 007's documents say "not built" while the tree and the task list say built (CONFIRMED; absorbs LUNA-P2-002)

- **Severity:** P1. **Dimension:** traceability. **Disposition:** active.
- **File:line:** `007-.../spec.md:36` (`Status | Planned`); `007-.../acceptance-criteria.md:48` (`Status: Planned`), `:61-73` (13 of 13 `Unmet`), `:98-100` (closure: "planned and not built ... `dependabot-auto-merge.yml` still has one job holding both write scopes"); `007-.../implementation-summary.md:3`, `:43` ("Not built"), `:52` ("Nothing yet"), `:62-68` (every file "planned"), `:105-110`, `:118`; `007-.../goal.md:31` (`completion_pct: 0`). The same summary's own frontmatter at `:13-14` and `:25` says "T001 to T099 on main" and `completion_pct: 90`.
- **Evidence:** a PyYAML parse of the tree prints 32 files, 44 jobs, `no-timeout []`, and the only jobs without `vars.SKILLED_CI` are `dependabot-auto-merge.yml` `metadata` and `auto-merge`; `grep -L '^permissions:'` lists 0 files; the Dependabot workflow parses to `['auto-merge', 'metadata'] {'contents': 'read'} {'contents': 'read', 'pull-requests': 'read'} {'contents': 'write', 'pull-requests': 'write'}`; `.github/workflows/README.md:76` holds `### On/off switches`. The five concern commits are on main: `4b7d3d8941` (permissions), `b1315701ca` (Dependabot split), `8ff7da700d` (timeouts), `9480d99e6d` (switches), `03abdb20d8` (README). `scratch/r25-dependabot.md` holds `run id: 40200559794`; `scratch/r26-probe.md` holds 2 run ids, `off: skipped` and `unset: ran`.
- **Impact:** the closure gate cannot open on built work, and a reader following the documents would redo 94 tasks.
- **Fix:** in `007-.../acceptance-criteria.md`, re-run each row's own Verification command and record the observed output; set `Met` on every row whose command now passes (expected: AC-001, AC-002 subject to the decision below, AC-004 to AC-008, AC-010, AC-013), keep AC-003 (needs T100, the 24 h timeout-kill read) and AC-009, AC-011, AC-012 (need T101) `Unmet`; set `Status` at `:48` to `In progress`; rewrite the closure at `:100` to count the rows. In `spec.md:36` set `In progress`. Rewrite `implementation-summary.md` sections What Was Built, How It Was Delivered, Verification and Known Limitations from the commits and `scratch/` records above, and align its `description` at `:3`. Update `goal.md` and `acceptance-criteria.md` continuity (`next_safe_action: "Run T100 after 2026-10-26T00:45Z, then T101 and T102"`).
- **Operator decision:** AC-002 says "a real Dependabot pull request has run it". The two recorded runs ran the two-job shape but skipped the write-scoped merge job, because neither update was a security patch. Decide whether those runs satisfy AC-002, or whether AC-002 stays `Unmet` until a security-patch pull request exercises the `auto-merge` job (the luna lineage's reading).

#### SYN-P1-002: Phase 004's closure statement, summary and continuity describe a pre-build tree (NEW; absorbs R1-P1-003 and R5-P2-003)

- **Severity:** P1. **Dimension:** traceability. **Disposition:** active.
- **File:line:** `004-.../acceptance-criteria.md:101-105` (closure: "6 of 17 rows are `Met` and 11 are `Unmet`", and lists AC-007 to AC-017 as unmet because "the hook-and-plugin merge has not run and `hooks-node-tests.yml` still exists", "no install substitutions", "no pip caches", "no checkout trial", "the README is untouched"); `:73` (AC-014: "neither `scratch/phase-baseline.md` nor `scratch/phase-result.md` exists"); continuity `:15` (`next_safe_action: "Build the hook-and-plugin merge (T030)"`) and `:27` (`completion_pct: 10`); `004-.../implementation-summary.md:52` ("Only the gate-scan slice is delivered, and it is uncommitted") and `:60-72` (action, merge, substitutions, pip caches, sparse checkout, README all "Planned"); `004-.../goal.md:17,24` (same continuity).
- **Evidence:** the table at `:57-73` holds 16 `Met` rows and 1 `Unmet` (AC-014). `ls .github/workflows/hooks-node-tests.yml` fails (merged in `2759de1119`); `cache: pip` sits in four workflows; `rule-canary-sync.yml:29` holds the sparse checkout; `README.md:41` holds the merged row; `tasks.md:1375` marks T030 `[x]`. Both `scratch/phase-baseline.md` and `scratch/phase-result.md` exist. The real gap is the 14-row delta table (T072).
- **Fix:** in `004-.../acceptance-criteria.md`, rewrite the closure at `:103-105` to "16 of 17 rows are `Met`; AC-014 is `Unmet` until T072 writes the 14-row delta into `scratch/phase-result.md`"; rewrite AC-014's "remaining" clause at `:73` to name the missing delta table instead of missing files; set continuity `next_safe_action` to "T072 phase delta, then T073 and T074" in `acceptance-criteria.md`, `implementation-summary.md` and `goal.md`, and derive `completion_pct` from the rows. Rewrite `implementation-summary.md` What Was Built and Files Changed from the commits `68e735d630`, `2759de1119`, `1c0c3534cf`, `b5451258b2`, `ea39cd7b2c` and the gate commit.

#### R1-P1-002: The parent phase map, continuity, decisions and goal log are stale (CONFIRMED; absorbs LUNA-P2-001)

- **Severity:** P1. **Dimension:** traceability. **Disposition:** active.
- **File:line:** `spec.md:105-112` (002 and 003 `In progress`, 005, 006, 007 and 009 `Planned`; children read 002, 003, 005, 006, 009 `Complete` and 007 built and open); `spec.md:3` ("002-009 are the planned implementation phases"); `spec.md:17` (`next_safe_action` names closed 002/003 tasks); `spec.md:25` (`completion_pct: 13`); `spec.md:112` and `:163` (describe R30 as planned, though `009-.../spec.md:164` marks it superseded by ADR-013); `spec.md:128` (handoff requires "the CLI vitest step is under 400 s", while `005-.../acceptance-criteria.md:61` records a 451 s median waived by ADR-011); `spec.md:177` (D9 "Probe pre-approved", while 009 AC-001 and AC-002 record D9 = write); `goal.md:16-17`, `:24` and `:111-114` (log says phases 005-009 "no phase has run").
- **Evidence:** child `spec.md` Status lines read in this pass (001, 002, 003, 005, 006, 009 `Complete`; 004 `In progress`; 007, 008 `Planned`).
- **Fix:** in `spec.md`, set the Status column to 001 Complete, 002 Complete, 003 Complete, 004 In progress, 005 Complete, 006 Complete, 007 In progress, 008 Planned (blocked on D8), 009 Complete; rewrite `:3` to drop "planned"; set `next_safe_action` to "007 T100-T102; 004 T072-T074; 008 after D8" and derive `completion_pct` from the children; add "(superseded by 009 ADR-013)" to the R30 text at `:112` and `:163`; add "(waived at a 451 s median by 005 ADR-011)" to the `:128` handoff; set the D9 row at `:177` to "write (R28 probe, `009-.../scratch/r28-probe.md`)". In `goal.md`, update the continuity at `:16-17`, `:24` and the Progress rows at `:111-114` to the same states.

#### SYN-P1-003: The parent goal's switch-count criterion cannot pass on a correct tree (NEW)

- **Severity:** P1. **Dimension:** correctness. **Disposition:** active.
- **File:line:** `goal.md:91`: ``rg -o 'vars\.SKILLED_CI[A-Z_]*' .github/workflows/*.yml | sort -u | wc -l` returns `6` ``.
- **Evidence:** run as written it prints `62`, because `rg` prefixes each match with its file name when given several files, so `sort -u` counts file and name pairs. With `--no-filename` the same pipeline prints `6`, the correct answer. `goal.md:79` says only these criteria decide done.
- **Fix:** change `goal.md:91` to ``rg -o --no-filename 'vars\.SKILLED_CI[A-Z_]*' .github/workflows/*.yml | sort -u | wc -l` returns `6` ``. This is a durable-directive edit, so per the goal's own G-rules record it as an amendment in the LOG section.

### P2: Advisories (16)

| ID | Lineage verdict | File:line | Evidence | Remediation |
|---|---|---|---|---|
| R2-P1-001 | CONFIRMED, downgraded P1 to P2 | `spec.md:130` | Says `/doctor:ci report` "lists all 33 workflows"; the tree holds 32 and the sk-code-ci standard says `32 of 32` (`ci-workflow-standards.md:37`). Downgraded because the 006, 007 to 009 handoff has already happened and 009 AC-003 measures against `glob('.github/workflows/*.yml')`, so nothing is blocked. | Replace "lists all 33 workflows" with "lists every file `glob('.github/workflows/*.yml')` returns (32 today)". |
| R5-P2-002 | CONFIRMED | `009-.../decision-record.md:861` | "The report parses 33 YAML files". | Change to "parses every workflow file in the tree (32 today)". |
| R4-P1-001 | CONFIRMED, downgraded P1 to P2 and widened | `007-.../tasks.md:621,678,1580,2455,2488,2595,2618,2644`; `004-.../tasks.md:3042,3063,3084`; `008-.../tasks.md` 24 of 25 headings (from `:53`) | Headings carry no `[ ]`/`[x]`/`[P]`/`[B]` marker, against `system-spec-kit/templates/core/tasks.md.tmpl:47-50`. Downgraded because the state contradiction it enables is already P1 under R1-P1-001; on its own it is notation. | 007: mark T021 `[x]` (`4b7d3d8941`), T023 `[x]` (`b1315701ca`), T061 `[x]` (`8ff7da700d`), T097 `[x]` (`9480d99e6d`), T098 `[x]` (`03abdb20d8`), T100-T102 `[ ]`. 004: T072-T074 `[ ]`. 008: every unmarked heading `[ ]`, T002 stays `[B]`. |
| R5-P2-001 | CONFIRMED | `spec.md:186-187` | Both open questions are answered: 005 took the shard branch (`005-.../acceptance-criteria.md:60`), and D9 is `write` (`009-.../acceptance-criteria.md`, AC-001 and AC-002). | Move both to answered with those pointers and leave the section empty or "None". |
| R1-P2-001 | CONFIRMED | `002-.../acceptance-criteria.md:92` | Last sentence: "The closure commit (T021) ... does not exist yet"; `tasks.md:685` marks T021 `[x]` with `03baa89ac6` on `origin/main`. | Replace the sentence with "The closure landed as `03baa89ac6`." |
| R1-P2-002 | CONFIRMED | `002-.../acceptance-criteria.md:59` | Cites the new case at `trigger-index-rebuild-workflow.vitest.ts:895`; the `it('marks the rebuild commit ...')` case opens at `:897`. | Change `:895` to `:897`. |
| R2-P2-002 | CONFIRMED, widened | `009-.../acceptance-criteria.md:122`; `009-.../implementation-summary.md:123` | Closure calls T033 "the one open task" while `tasks.md:1189` marks T033 `[x]` (`8811c7e36d`). Limitation 3 says `ci.md` and the sk-code-ci docs hold uncommitted edits; they are committed (`d16cab7620`, `0781e81da2`) and `git status` over both trees is clean. | Replace the closure sentence with "The closure landed as `8811c7e36d`."; mark limitation 3 resolved by those two commits or remove it. |
| R3-P2-001 | CONFIRMED | `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` (Permissions section), `assets/workflow-template.yml:43`, `assets/job-block-template.yml` | `rg -c persist-credentials` over sk-code-ci returns nothing; `trigger-index-rebuild.yml:50` and `:203` set `persist-credentials: false` by convention only. | Add a Permissions rule: "a job that holds a write scope, or pushes, checks out with `persist-credentials: false`", citing `trigger-index-rebuild.yml:203`, marked honour-system; add the key with a one-line comment to both templates' checkout step. |
| R3-P2-002 | CONFIRMED, sharpened to a contradiction | `sk-code-ci/references/protected-set.md:46` | Says "A switched-off required workflow leaves the context pending on every pull request". The switch is a job-level `if:`, and `.github/workflows/README.md:95` and `doctor-ci-toggle.yaml:71` both say a skipped job reports Success, so the required check stops blocking (fails open). Pending is the workflow-level path-filter case, documented at `trigger-and-filter-rules.md:68`. | Rewrite the sentence to "A switched-off job is skipped, and a skipped job reports Success, so the required context stops blocking merges. A workflow-level path filter is the opposite case and leaves the context Pending (`references/trigger-and-filter-rules.md`)." |
| R4-P2-001 | CONFIRMED (operator decision) | `002-.../spec.md:67-68` and the same lines in 001, 003-009 | Each says "refresh the matching file in ../changelog/"; `specs/system-speckit/053-ci-workflow-efficiency/changelog/` does not exist. The line is `create.sh:1963` boilerplate present in 1,128 specs; some packets do keep a `changelog/`. | **Operator decision:** create `changelog/` with one file per closed phase (001, 002, 003, 005, 006, 009), or delete the two-line Changelog block from all nine child specs. |
| R4-P2-002 | CONFIRMED | 002 AC-005, AC-007; 003 AC-013, AC-016, AC-017; 004 AC-013, AC-015, AC-017; 005 AC-006 | Each row holds two or more "observed" clauses and no `Amendment` marker (counted by grep in this pass). | Prefix every later observation with `**Amendment (YYYY-MM-DD, subject)**`, the form 002 AC-006 uses. |
| LUNA-P2-003 | CONFIRMED | `009-.../spec.md:173-174`; `009-.../acceptance-criteria.md:72-73`; `009-.../tasks.md:1253` | REQ-010 (strict validation) and REQ-011 (phase-result record) have no acceptance row; the crosswalk maps them to AC-014 and AC-015, which name REQ-007. | Add AC-023 (REQ-010) and AC-024 (REQ-011) with evidence from T029-T032, and correct the crosswalk at `tasks.md:1253` and CHK-040 at `:1331`. |
| SYN-P2-001 | NEW | `.skilled/commands/doctor/scripts/ci-report.cjs:16-19` | The WHY comment says "A rebuild commit also starts downstream runs"; since `8e62a3d096` a rebuild commit carries `[skip ci]` and starts no run (002 recorded `[]` on three rebuild SHAs). The exclusion loop is now the fallback the README calls it (`README.md:57`). | Rewrite to: "A rebuild commit carries `[skip ci]` and normally starts no run. If one ever starts a run anyway, its SHA would lead the run list with no statuses worth reading, so the search skips any commit whose message ends with the rebuild trailer." |
| SYN-P2-002 | NEW | `006-.../acceptance-criteria.md:59-60`; `006-.../spec.md:74,123,165`; `006-.../implementation-summary.md:163` | AC-001 (`Met`) tests `changelog/v0.1.0.0.md`, renamed to `v1.0.0.0.md` by `0781e81da2`, so its `test -f` now fails. AC-002 (`Met`) counts `workflows/README\.md:73`, `27 workflows` and `33 of 33`, which now return 0 after `bce45aa297` and `0781e81da2` moved the rule data to `32 of 32` and README `:72`. Limitation 13 says `job-shape-rules.md` still names `hooks-node-tests.yml`; it no longer does. | Append a dated amendment to AC-001 and AC-002 naming the rename and the updated literals, with re-run output; change `v0.1.0.0` to `v1.0.0.0` in `spec.md:74,123,165`; mark limitation 13 resolved by `bce45aa297`. |
| SYN-P2-003 | NEW | `.skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md:53` | Says `trigger-index-rebuild.yml:151` holds the body line ending in `[skip ci]`; line 151 is `git commit -m "chore(...)" \` and the token is on `:152`. The packet's own rule (`SKILL.md:82`) requires re-reading cited lines. | Change `:151` to `:152`. |
| SYN-P2-004 | NEW | `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:259`; `.skilled/commands/doctor/ci.md:3` | The doctor family's `destructive_policy.operations` lists every other doctor mutation but neither `/doctor:ci scaffold` (writes a new workflow file) nor `/doctor:ci toggle` (sets or deletes a repository Actions variable), though `_routes.yaml` marks both `mutates`. The contract's argument hint (`:211`) lists `| list | ?` for ci; the router's frontmatter hint omits it, though `ci.md:34` accepts both. | Add `"ci scaffold writes one new .github/workflows/ file after an approved plan and refuses an existing or protected name"` and `"ci toggle sets one documented SKILLED_CI variable to off or deletes it after an approved plan, and refuses SKILLED_CI and SKILLED_CI_MESSAGES off while the README forbids it"` to `operations`; append ` | list | ?` to the `argument-hint` at `ci.md:3`; re-run `generate-command-routers.cjs --check`. |

### Refuted (1)

- **R2-P2-001** (005 proves a concurrent step by running its halves one after the other): REFUTED. `005-.../acceptance-criteria.md:60` reports the local sequential run only as a file-count check and says "The CI step time is AC-003's". AC-003 (`:61`) records five CI runs of the two-process step at 299 to 467 s. Run one after the other the halves take 313.90 s plus 356.56 s, about 670 s, so the CI times are only possible if the halves ran at the same time. The concurrency proof is recorded.

### Duplicates and merges (4)

- **LUNA-P2-001** duplicates R1-P1-002 (same parent phase map, same `spec.md:105`).
- **LUNA-P2-002** duplicates R1-P1-001 (the same 007 closure sentence at `acceptance-criteria.md:100`); its AC-002 point is carried as R1-P1-001's operator decision.
- **R1-P1-003** (004 AC-014's premise is false) is CONFIRMED and merged into SYN-P1-002, which covers the same document's larger drift; counted once.
- **R5-P2-003** is the deepseek lineage's adjudication note for the R1-P1-003 downgrade, not a separate defect.

---

## 4. REMEDIATION WORKSTREAMS

P1 first. WS-1 is independent of the packet documents and can land first; WS-2 and WS-3 are the same reconciliation at child and parent level and should land together.

1. **WS-1 (P1): CI routing keyword** (SYN-P1-001, SYN-P2-002). Remove the bare keyword from the five files, regenerate the derived graph and manifests, re-run the guard test, the router-sync guard and the hub check, then record the re-runs in 006 AC-001, AC-002 and AC-005.
2. **WS-2 (P1): phase 007 and 004 state** (R1-P1-001, SYN-P1-002, R4-P1-001). Start from the task markers, then re-run every row's Verification command, then rewrite the closure statements, summaries and continuity from what the commands print. Phase 007 still cannot close before T100's 24 h window and T101's gates; phase 004 still waits on T072.
3. **WS-3 (P1): parent** (R1-P1-002, SYN-P1-003, R5-P2-001, R2-P1-001). Rebuild the phase map from the child Status lines, fix the goal criterion command, close the two open questions, record D9 and the R30 supersession.

P2 advisories, separate from the verdict:

4. **WS-4 (P2): stale sentences and citations** (R1-P2-001, R1-P2-002, R2-P2-002, R5-P2-002, R4-P2-002, LUNA-P2-003, SYN-P2-001, SYN-P2-003). Eight small edits, each named in the registry above.
5. **WS-5 (P2): standard and contract gaps** (R3-P2-001, R3-P2-002, SYN-P2-004, R4-P2-001). `persist-credentials`, the skip-semantics contradiction, the doctor contract coverage and argument hint, and the changelog decision.

---

## 5. SPEC SEED

- A closure statement is a count of the rows above it. When the two disagree, the table is the record and the sentence is the defect, even when strict validation passes.
- An implementation summary's frontmatter and body are one claim. A `completion_pct: 90` over a body that says "Nothing yet" is the signature of a partial rewrite.
- A routing keyword that a test exists to keep out of a surface is a contract, not vocabulary; adding one is a change that runs that test.
- A gate command frozen into a goal must be executed once against a known-good tree, so that its expected output is observed rather than predicted.

---

## 6. PLAN SEED

- Re-run each 007 and 004 acceptance row's own Verification command and paste the output before changing any status.
- Add a `validate.sh` rule that recounts `Met`/`Unmet`/`Waived`/`Superseded` rows and fails a closure statement whose count differs.
- Add a phase-parent rule that compares each Phase Documentation Map row with the child `spec.md` Status.
- Add a `tasks.md` rule that fails a `### T` heading with no status marker.
- Add `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` to `sk-code-skilled/scripts/run-all-drift-guards.sh`.

---

## 7. TRACEABILITY STATUS

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `spec_code` | partial | Every workflow claim in 002, 003, 005, 006 and 009 holds against the tree (parse, gate, pins, switches, timeouts, permissions, the composite action and its sites, the merge, pip caches, sparse checkout, the shard step, the doctor router and its routes). | 007 and 004 documents describe a pre-build tree (R1-P1-001, SYN-P1-002); the parent map is stale (R1-P1-002); a routing keyword contradicts 006 AC-005 (SYN-P1-001). |
| `checklist_evidence` | partial | `validate.sh --recursive --strict`: 10 of 10 folders `RESULT: PASSED`, parent `Errors: 0 Warnings: 1` (`FRONTMATTER_MEMORY_BLOCK`, narrative `recent_action` in `spec.md` and `goal.md`). | 006 AC-001, AC-002 and AC-005 are `Met` on output the tree no longer reproduces (SYN-P1-001, SYN-P2-002); 009 REQ-010 and REQ-011 have no row (LUNA-P2-003). |

### Overlay Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `skill_agent` (sk-code-skilled alignment) | partial | `run-all-drift-guards.sh`: 4 of 4 guards PASSED, 10 non-blocking warnings, none in a file this packet changed. `ci-report.cjs` and its test carry the module header, `'use strict'` and numbered sections; `check-gate-inputs.sh` and its test use `set -uo pipefail` and pass `shellcheck -S warning` (rc 0); `actionlint` rc 0 on all workflows and on `assets/workflow-template.yml`; no R/D/ADR/REQ/T id appears in any changed code comment. Gap: the stale WHY comment (SYN-P2-001) and the routing regression (SYN-P1-001). |
| `agent_cross_runtime` (command mirrors) | pass | `.claude/commands/doctor/ci.md` and `.cursor/commands/doctor-ci.md` are symlinks to the source; `.opencode/commands` is a symlink to `.skilled/commands`; `.codex/prompts`, `.pi/prompts` and `.hermes/prompts` hold generated pointer stubs, and `sync-prompts.cjs --check` prints `PASS: 39 prompts are in sync`. |
| `feature_catalog_code` | pass | `sk-code/feature-catalog/feature-catalog.md:15,35` and `two-axis-registry-driven-routing.md:26` name both surfaces and match `mode-registry.json`; `validate_document.py` reports 0 issues on the hub README. |
| `playbook_capability` | partial | `sk-code-ci/manual-testing-playbook/` validates (`playbook` and `playbook_feature`, 0 issues); its scenario passes (`verify-router-sync.cjs --checks 4` PASS; the compiled route prints `surfaceBundle sk-code-review, sk-code-ci`). Its cross-reference row for `compiled-route-surface-hint.test.cjs` (`manual-testing-playbook.md:67`) points at a suite that now fails (SYN-P1-001). |
| Command contract (sk-create-command) | partial | `ci.md` follows the router skeleton (ROUTER CONTRACT, OWNED ASSETS, MODE ROUTING, EXECUTION TARGETS, PRESENTATION BOUNDARY, WORKFLOW SUMMARY); `validate_document.py --type command` 0 issues; kebab check PASS; `route-validate.sh` OK (17 routes, 2 warnings, neither on `/doctor:ci`); `generate-command-routers.cjs --check` `routers=35 clean=35`. Gaps: SYN-P2-004. |
| sk-doc modes for the CI docs | pass | `validate_document.py` 0 issues on sk-code-ci `README.md` (readme), `SKILL.md` (skill), both playbook files, `changelog/v1.0.0.0.md`, `protected-set.md` and `job-shape-rules.md` (reference) and `.github/workflows/README.md`; `check-frontmatter-versions.sh --skill sk-code` `ok=176 skip-no-frontmatter=4`. Content gaps: R3-P2-001, R3-P2-002, SYN-P2-003. |

### `AC_COVERAGE` signal

**exempt.** The parent has no `checklist.md`; each child keeps its checklist inside `tasks.md`, so the lifecycle predicate is not met. The validator printed `AC_COVERAGE: Acceptance coverage gate not active for this level or lifecycle state`.

### Resource Map Coverage Gate

Skipped: `specs/system-speckit/053-ci-workflow-efficiency/resource-map.md` does not exist.

---

## 8. DEFERRED ITEMS

- **Phase 007 T100-T102:** T100 reads 24 h of runs for a timeout kill after 2026-10-26T00:45Z; T101 runs the final gates. They gate 007's closure regardless of WS-2.
- **Phase 004 T072-T074:** the 14-row phase delta and the closure commit.
- **Phase 008 (D8):** blocked by design (`T002 [B]`); needs the post-007 re-measurement and the operator's D8 answer.
- **Live privileged path:** no recorded run exercised `dependabot-auto-merge.yml`'s write-scoped `auto-merge` job on a security patch; tied to R1-P1-001's operator decision.
- **Review surface label:** `009-.../implementation-summary.md:121` records that `sk-code-review`'s inline surface detection returns `UNKNOWN` for a workflow diff, so a review prompt with no CI vocabulary does not bundle sk-code-ci. This is the ADR-013 design choice, not a defect in this pass.
- **Breadth of the other added keywords:** `ci job`, `action to a sha` and `sha-pinned action` came in with SYN-P1-001's commit. No test fails on them; whether `ci job` is too broad is judgment and is left to the WS-1 author.
- **Out of track:** `command-catalog-mirror-check.cjs` reports `DRIFT` for `/agent-router`, caused by untracked `agent-router.md` files present in the worktree before this review; not this packet's change.

---

## Dimension Expansion Map

| Item | State |
|---|---|
| Lineage directions (inputs) | deepseek: traceability, correctness, security, maintainability, frontier/adversarial. luna: correctness, security, traceability, maintainability, cross-phase integration. |
| Synthesis directions added | spec-versus-tree drift across all nine children and the parent; sk-code-skilled alignment of changed code; sk-doc mode alignment of the CI docs; command contract and runtime mirrors |
| Completed pivots | 2: from 007's drift to the same class in 004 (SYN-P1-002); from the playbook's cross-reference table to running the cited suite (SYN-P1-001) |
| Failed pivots | 0 |
| Audited overrides | 3 severity changes: R2-P1-001 P1 to P2, R4-P1-001 P1 to P2, R1-P1-003 merged into a new P1 |
| Council artifacts | none |
| Remaining frontier | live GitHub run history (not re-queried); phase 001's research dataset (taken as recorded) |

---

## 9. SEARCH LEDGER

- **hasSearchDebt:** false for the verdict. The one open evidence item (live security-patch run) is recorded as an operator decision, not search debt.
- **Covered this pass:** lineage-claim re-verification (19 ids), closure-statement recount (all nine children), continuity versus task markers (all nine), parent map versus children, goal criterion execution, routing guard suites, drift-guard wrapper, script and workflow lint, sk-doc document validation, command validators, route manifest, runtime mirrors, comment hygiene, advisor bridge suites (`doctor-command-bridges.vitest.ts` and `route-gates.vitest.ts`: 9 of 9 passed).
- **Ruled-out candidates (clean-search proof):**

| Candidate | Why ruled out |
|---|---|
| A workflow lacks a timeout, permissions or switch | PyYAML parse: `no-timeout []`; `grep -L '^permissions:'` 0 files; only Dependabot's two jobs lack the switch, by design |
| An unpinned remote action | 89 remote `uses:`, 0 without a 40-hex SHA |
| An ephemeral id in a changed code comment | 0 hits for R/D/ADR/REQ/AC/T ids or packet numbers over `.github/`, the doctor ci assets and script, and sk-code-ci |
| The toggle can switch the required check off | `doctor-ci-toggle.yaml:71-72` refuses both `SKILLED_CI_MESSAGES=off` and `SKILLED_CI=off` |
| The command mirrors drift | `sync-prompts.cjs --check` PASS; two symlinks and one directory symlink resolve to the source |
| The sk-code-ci counts are stale | `ci-workflow-standards.md:37` (32 of 32, 89 lines) and `job-shape-rules.md:127` (42 of 44, the group split) match the tree |
| The scaffold template breaks the standard | `actionlint` rc 0; carries permissions, concurrency, the switch, a timeout and a pinned checkout |
| 005's concurrency is unproven | see R2-P2-001 under Refuted |

---

## 10. AUDIT APPENDIX

### Convergence summary

Synthesis over two completed lineages of 5 iterations each (stop reason `maxIterationsReached` in both). Lineage convergence: deepseek 0.81, luna 1.00. Merged registry 19 ids; after adjudication 5 P1 and 16 P2 active, 1 refuted, 4 duplicate or merged.

### Commands run in this pass, with observed results

| Command | Result |
|---|---|
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --recursive --strict` | exit 0; 10 of 10 `RESULT: PASSED`; parent `Errors: 0 Warnings: 1` |
| `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` | rc 0; `all 4 guards PASSED, 10 non-blocking warning(s)` |
| `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` | rc 1; `pass 7`, `fail 1` |
| `node --test .skilled/commands/doctor/scripts/tests/ci-report.test.cjs` | `tests 14`, `pass 14`, `fail 0` |
| `bash .github/scripts/check-gate-inputs.sh` | `files=45 inputs_resolved=250 dynamic_inputs=39 twin_pairs=336 failures=0`, `RESULT: PASSED` |
| `bash .github/scripts/tests/check-gate-inputs.test.sh` | `57 passed, 0 failed` |
| `shellcheck -S warning` (gate script and test); `actionlint` | rc 0; rc 0 |
| `verify-router-sync.cjs --checks 4`; `parent-skill-check.cjs .skilled/skills/sk-code` | `1/1 checks passed`; `all hard invariants passed, 0 warnings` |
| `validate_document.py` on nine docs; `--type command` on `ci.md` | 0 issues each |
| `route-validate.sh`; `generate-command-routers.cjs --check`; `sync-prompts.cjs --check` | OK 17 routes 2 warnings (not ci); `routers=35 clean=35`; `39 prompts are in sync` |
| `rg -o 'vars\.SKILLED_CI[A-Z_]*' .github/workflows/*.yml \| sort -u \| wc -l` | `62` (with `--no-filename`: `6`) |
| `npx vitest run tests/doctor-command-bridges.vitest.ts tests/scorer/route-gates.vitest.ts` (advisor runtime) | 2 files, 9 tests passed |

The validator run left `description.json` and `graph-metadata.json` at the parent byte-identical to their pre-run state (both were already modified before this review). No file outside `review/` was edited.

### Sources reviewed

Merged registry and fan-out attribution; both lineage `review-report.md` files and registries; `deep-review-auto.yaml` phase_synthesis (`:2228-2450`). Parent `spec.md`, `goal.md`; all nine children's `spec.md`, `acceptance-criteria.md`, `implementation-summary.md`, `goal.md` continuity and `tasks.md` headings, full reads of 004, 007 and 009 closure material. `.github/workflows/*.yml` (32), `.github/workflows/README.md`, `.github/actions/setup/action.yml`, `.github/scripts/check-gate-inputs.sh` and its test. `.skilled/skills/sk-code/` (`SKILL.md`, `README.md`, `ROUTER.md`, `hub-router.json`, feature catalog), `sk-code-ci/` (all files), `sk-code-skilled/SKILL.md`. `.skilled/commands/doctor/ci.md`, `_routes.yaml`, the three ci workflow YAMLs, `ci-report.cjs` and its test. `sk-create-command` (`command-router-template.md`, `command-contract.json`, `argument-hints-and-modes.md`), the sk-doc shared validators, the frontmatter versioning reference. Runtime mirrors under `.claude`, `.codex`, `.opencode`, `.cursor`, `.pi`, `.hermes`.

### Cross-reference appendix

#### Core Protocols

- `spec_code`: partial; R1-P1-001, SYN-P1-002, R1-P1-002, SYN-P1-001.
- `checklist_evidence`: partial; SYN-P2-002, LUNA-P2-003; `AC_COVERAGE` exempt.

#### Overlay Protocols

- `skill_agent`: partial (SYN-P1-001, SYN-P2-001).
- `agent_cross_runtime`: pass.
- `feature_catalog_code`: pass.
- `playbook_capability`: partial (SYN-P1-001).

<!-- MACHINE-OWNED: END -->

Review verdict: CONDITIONAL
