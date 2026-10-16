---
title: "Tasks: Doctor command routing: the skill advisor surfaces runnable /doctor:x target lines"
description: "Ordered tasks: measure first, add the /doctor:setup umbrella, generate inactive doctor bridges, add the ordering rule and the runnable line, then activate phrases in waves, each checked against a per-prompt baseline."
trigger_phrases:
  - "doctor command routing tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Doctor command routing: the skill advisor surfaces runnable /doctor:x target lines

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Every task is one cli-pi brief, or one orchestrator step where the task says so. Gate IDs such as G3 refer to the gate table in `plan.md` section 5. After each task the orchestrator runs the diff check, the mutation check where a test proves the task, and the named gate.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Measure before any runtime change

- [x] T001 Orchestrator: rebuild with G0, then re-take the per-prompt snapshot of the labeled, holdout and ambiguity corpora at the implement HEAD, and run G4 once to record the full suite count. Store the snapshot with its HEAD in the packet's `scratch/baseline-per-prompt.json` (`specs/system-skill-advisor/035-doctor-command-routing/scratch/`)
  - Evidence: G0 build exit 0 and typecheck exit 0. The capture at `8b1e3a409a` gave labeled 155 of 195, holdout 49 of 66 and ambiguity 19 of 24, metrics identical to the committed baseline. `scratch/baseline-per-prompt.json` was taken at HEAD `828cb749da`, which changed only two trigger-index fixtures, and its totals match the capture. G4 exit 0: 138 test files passed, 1054 tests passed and 6 skipped (1060).
- [x] T002 Orchestrator: run the three inventories in `plan.md` (Fix Addendum) and record what they return in `scratch/inventories.md`
  - Evidence: `scratch/inventories.md` holds 22 producer hits, 97 consumer hits across 27 files and the 36-cell matrix.
- [x] T003 Author the doctor slice: onboarding prompts for `/doctor:setup`, the `/doctor:env` prompts, the three Wave A diagnostics, the contested diagnostics per route, ten skill-shaped controls, three typed slash commands and gold-`none` controls. Each row carries `id`, `prompt`, `expected_top`, `expected_second` and `wave`. No row may repeat a holdout prompt (`.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl`)
  - Evidence: 40 rows in waves A, B-git, B-sk-code, B-skill-advisor, B-speckit-update and control, none repeating a pinned-corpus prompt. Two rows were changed after Wave A and Wave B showed the skill passing, per the operator rule that a passing skill stays first: "skill budget audit" and "router reach check" now expect `sk-code` first and the doctor bridge second.
- [x] T004 Create the slice gate. It scores the slice under the pinned force-local regime, asserts only rows whose wave is active in `scoring-compatibility.json` and reads none of the pinned corpora (`.skilled/skills/system-skill-advisor/runtime/tests/doctor-routing-slice.vitest.ts`). Proof: G8 passes with zero active waves, then fails when one row's wave is flipped to active
  - Evidence: G8 `2 passed`. With one wave flipped active before its bridges existed, 1 test failed. Restored, it passed.
- [x] T005 Orchestrator: write the per-prompt comparison script for G11 in the packet's `scratch/` and prove it with a negative control. Flip one passing row's gold label in a temporary copy and confirm the script reports it
  - Evidence: `scratch/compare-per-prompt.mjs` exits 0 on a self-compare. With row 0 of a temporary labeled copy flipped from `sk-code` to `none`, it exited 1 and named that one lost row.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### The /doctor:setup umbrella

- [x] T006 Create the read-only, single-route router with a `skill_agent` tag, no positional target and a pointer to its two assets (`.skilled/commands/doctor/setup.md`)
  - Evidence: router with `skill_agent: system-spec-kit` and one target row pointing at `doctor-setup.yaml`. G2 `OK: route-validate — 14 routes validated, 2 warnings` (13 at baseline).
- [x] T007 Create the workflow and presentation contract. The workflow lists every doctor target with what it checks, runs the existing read-only legs (`sk-code-setup-check.cjs`, `git-setup-check.cjs`, `generate-trigger-index.mjs --check --json`, `sync-runtime-mirrors.cjs --check`, `advisor_status --warm-only`) and prints a runnable repair command per failing leg (`.skilled/commands/doctor/assets/doctor-setup.yaml`, `.skilled/commands/doctor/assets/doctor-setup-presentation.txt`)
  - Evidence: the workflow runs the five legs read-only, `advisor_status --warm-only` exit 75 maps to SKIP, and the presentation contract lists 17 targets with one repair command per leg.
- [x] T008 Add the `/doctor:setup` route with `mutating: read-only`, its script invocations and onboarding trigger phrases (`.skilled/commands/doctor/_routes.yaml`). Proof: G2
  - Evidence: route with `mutating: read-only`, five script invocations and five onboarding phrases. G2 output as in T006.
- [x] T009 Orchestrator: generate the runtime mirrors with the sync scripts in write mode, then add the catalog row and change the command count from 9 to 10 (`.skilled/commands/README.txt`). Proof: G10
  - Evidence: the four sync scripts wrote the Claude, Cursor, Codex, Pi and Hermes mirrors. `.skilled/commands/README.txt` now says Ten and lists the Setup row. The catalog mirror check printed `STATUS=OK`.

### Bridge generation, inactive first

- [x] T010 List every CI job that runs the bridge generator, directly or through the Python bridge check or a test that calls either. For each job, check whether it installs the `.skilled` packages that carry `yaml`. Add an `npm --prefix .skilled ci` step, or an equivalent install, to each job that lacks it, starting with the golden-prompt job, which installs only system-spec-kit and the advisor runtime (`.github/workflows/routing-registry-drift.yml`, plus any other workflow the listing names). Proof: the job list with each job's install line in `scratch/ci-yaml-check.md`, and `node -e "require.resolve('yaml')"` run from the deriver's folder
  - Evidence: `scratch/ci-yaml-check.md` lists every job. No CI job runs the generator without the `yaml` parser installed, so no workflow was edited. `require.resolve('yaml')` from the deriver folder resolved.
- [x] T011 Add `_routes.yaml` as a third inventory source. Emit one entry per route plus `/doctor:update`, `/doctor:env` and `/doctor:setup`, with ids `command-doctor-<command>[-<target>]`, `skillId` from the router's `skill_agent` tag and `ownerMode` equal to `skillId`. Add no activation yet (`.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs`). Proof: G1 reports the new count, and G3 plus G11 show no scoring change
  - Evidence: G1 `"status": "fresh"` with the doctor routes counted. G11 after this step: lost 0, gained 0. The drift guard was updated to project doctor entries from `_routes.yaml` and to keep its hand-authored counts over non-doctor entries.
- [x] T012 Add `BEGIN GENERATED DOCTOR COMMANDS` and `END GENERATED DOCTOR COMMANDS` markers to the renderer, with an empty lookup between them (`.skilled/skills/system-skill-advisor/runtime/lib/render.ts`)
  - Evidence: markers present in `render.ts`, filled by the deriver at T013.
- [x] T013 Teach the deriver to fill the TypeScript `name`, `keywords`, `intentSignals` and `domains` of doctor entries from the manifest, the Python `slashMarkers` from the runnable string only, and the renderer lookup block from the runnable string rule (`derive-command-bridges.cjs`). Proof: a deriver test that fails when a manifest phrase is missing from the generated keywords, plus G1
  - Evidence: `doctor-command-bridges.vitest.ts` 3 passed. Removing one generated keyword made 1 test fail. A router stripped of its `skill_agent` tag made the deriver exit 1 with a named error.

### Ordering rule and runnable line

- [x] T014 Add the ordering rule: a doctor bridge never sorts above a skill that passes the threshold, unless the prompt contains that bridge's slash marker (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`). Proof: a new test that fails when the rule is deleted, plus G3 and G11
  - Evidence: `doctor-ordering.vitest.ts`. With the ordering rule a no-op, 2 of 6 tests failed. With the slash exemption removed, 1 failed. Restored, all passed. G11 lost 0. A second rule, `requireDoctorPhraseAnchor`, was added at Wave A (see the implementation summary). With it a no-op, 1 of 10 failed.
- [x] T015 Render the doctor string. It is the top line when a doctor bridge is first. It is a second line when a skill is first and a doctor bridge also passes. It stays inside the token cap and passes the label sanitizer (`render.ts`). Proof: renderer tests for both shapes, one test for an unmapped doctor id rendering nothing, plus the hook tests in G4
  - Evidence: `doctor-brief-render.vitest.ts` 7 passed. Removing the companion line made 2 fail, removing the top doctor label made 2 fail, and changing a lookup value made 1 of 3 lookup tests fail.
- [x] T016 Add the bounded no-match hint naming `/doctor:setup`, gated on a setup-wording flag in the render options. The Claude hook sets the flag when the prompt uses setup, install, check or configure wording, so the renderer never reads prompt text (`render.ts`, `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`). Proof: one test where a setup-worded unmatched prompt shows the hint, one where a plain unrelated unmatched prompt such as "what is the capital of France" shows none, and the hint test failing when the flag check is deleted. Record the byte delta in the implementation summary
  - Evidence: `hooks/doctor-setup-hint.vitest.ts` 8 passed. With the renderer flag check deleted, 2 failed. With the hook flag forced false, 5 failed. Byte delta of the hinted fallback: +47.

### Manifest phrases and waves

- [x] T017 Give `/doctor:env` a manifest entry with diagnostic trigger phrases, add plain-word phrases to `/doctor:update` and rewrite the header to drop "inert today" and the stale `skill_advisor.py:810-871` citation (`.skilled/commands/doctor/_routes.yaml`). Proof: G2 and G1
  - Evidence: `/doctor:env` standalone entry with runnable `/doctor:env list` and four phrases, three plain-word `/doctor:update` phrases, and a header naming the deriver. G2 and G1 as above.
- [x] T018 Wave A: activate `/doctor:setup`, `/doctor:env list`, `/doctor:git hooks`, `/doctor:runtime-mirrors` and `/doctor:skill-advisor skill-budget` in both scorer lists (`.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json`). Proof: G0, G1, G3, G5, G7, G8 and G11, with zero lost rows
  - Evidence: five doctor ids active in both lists. G11 lost 0, gained 0, totals 155/195, 49/66, 19/24. G8 passed after the phrase-anchor rule was added.
- [x] T019 Create the doctor reach probe. It reads every admitted phrase, scores it in process under the pinned regime and fails when a phrase reaches neither the top line nor the second line of its bridge. Wire it into the router-reach route's script invocations and workflow (`.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs`, `_routes.yaml`, `.skilled/commands/doctor/assets/doctor-router-reach.yaml`). Proof: G9 passes, then fails when one admitted phrase is renamed, plus G2
  - Evidence: G9 `STATUS=OK phrases=82 bridges=15`. With one admitted phrase renamed and the bridges not regenerated, it printed `STATUS=FAIL` and exited 1.
- [x] T020 Wave B: activate `/doctor:git setup` and `/doctor:git standards` (`scoring-compatibility.json`). Proof: G3, G8, G9 and G11, with sk-git still first on its own prompts
  - Evidence: G11 lost 0. G8 and G9 passed, and sk-git stays first on "check my git hooks setup" with `Also: /doctor:git setup` as the second line.
- [x] T021 Wave B: activate `/doctor:sk-code` (`scoring-compatibility.json`). Proof: G3, G8, G9 and G11
  - Evidence: G11 lost 0. G8 and G9 passed.
- [x] T022 Wave B: activate the remaining `/doctor:skill-advisor` targets (`scoring-compatibility.json`). Proof: G3, G8, G9 and G11
  - Evidence: G11 lost 0. G8 and G9 passed after the router-reach row expectation change noted in T003.
- [x] T023 Wave B: activate `/doctor:speckit` and `/doctor:update` (`scoring-compatibility.json`). Proof: G3, G8, G9 and G11
  - Evidence: G11 lost 0. G8 and G9 passed. Final counts: typescriptActive 20, pythonActive 30, doctorRoutes 16, generated 43.
- [x] T024 Name the `_routes.yaml` source in the bridge README, and note that `/doctor:deep-loop` and the `/doctor:mcp` sub-actions stay inactive until a later wave (`.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md`)
  - Evidence: the README names `_routes.yaml` as the third source and the render block, and its new section 4 states that `/doctor:deep-loop` and the `/doctor:mcp` sub-actions stay inactive.

### Playbook and catalog (scope added by the operator on 2026-10-15)

- [x] T030 Write seven agent-runnable playbook scenarios, DOC-385 to DOC-391: the `/doctor:setup` onboarding prompt, the `/doctor:env list` prompt, a contested prompt with the skill first and the doctor line second, a typed `/doctor:git setup` in the Python fallback, the setup-worded no-match hint, an unrelated prompt with no hint and the `/doctor:setup` run (`.skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/`)
  - Evidence: seven files, DOC-385 to DOC-391, each with exact commands, exact expected text and a PASS/FAIL rule. The orchestrator ran every command in DOC-385 to DOC-390 and got the stated output. A fix-up brief aligned the step numbers in DOC-387 and DOC-388, and T028 corrected the advisor command in DOC-391.
- [x] T031 Register the scenarios in the playbook index and its inventory test, then regenerate the leaf manifest and aliases with the repository's generator (`manual-testing-playbook.md`, `runtime/tests/manual-testing-playbook.vitest.ts`, `leaf-manifest.json`, `leaf-aliases.json`)
- [x] T032 Follow-up added by the operator on 2026-10-15: show the `/doctor:setup` hint on the outage line for a setup-worded prompt, in the Claude hook and on the Pi deadline path [EVIDENCE: `render.ts` outage branch places `for setup or health checks, run /doctor:setup;` before `route by hand` so the command stays last (a Luna review caught the first version appending it after the command). `SETUP_WORDING` exported from the Claude hook and passed by the Pi hook on its deadline path. Three mutations each failed their test: renderer reverted, hint unconditional, Pi flag not passed. Build and typecheck exit 0, full advisor suite 143 files and 1086 passed with 6 skipped (1084 before), Python 66 passed, per-prompt comparison lost 0, sk-code drift guards 4 of 4 passed. Luna's P2 on the neighbouring test stubs was rejected: the hook destructures the export, and a Vitest mock throws on an undefined export]
- [x] T033 Follow-up added by the operator on 2026-10-16: the OpenCode plugin renders the same `/doctor:setup` hint on its no-match and outage lines [EVIDENCE: `.opencode/plugins/lib/skill-advisor-render.js` extends `renderPluginFallbackDirective` in place with a `setupWording` option and keeps its own `SETUP_WORDING`, since the plugin cannot import the TypeScript hook. A parity test holds the regex and every status and freshness pair equal to the shared renderer. The plugin's no-brief fallback passes the flag. Three mutations each failed their test: renderer hint removed, plugin flag not passed, regex drift. Plugin suite 94 passed, full advisor suite 1108 passed with 6 skipped (1086 before), Python 66 passed, per-prompt comparison lost 0, sk-code drift guards 4 of 4, runtime mirrors 185 in sync. Luna review: no findings in any area]
- [x] T034 Record the advisor and `/doctor:setup` work in the changelogs, at the operator's request on 2026-10-16 [EVIDENCE: `.skilled/skills/system-skill-advisor/changelog/v0.16.0.0.md` (minor, doctor routing), `.skilled/skills/system-spec-kit/changelog/v2.8.0.0.md` (minor, `/doctor:setup`, which declares `skill_agent: system-spec-kit`) and `.skilled/changelog/skilled/v4.0.0.12.md`. v4.0.0.11 was left unchanged because the changelog rules forbid rewriting an existing entry. `hvr_scan.py` hard blockers 0 and `validate_document.py` Total issues 0 on each. Both `SKILL.md` versions bumped and their Hermes mirrors synced]
  - Evidence: index rows and counts updated to 61. Inventory test 1 passed, and with the DOC-391 row removed it failed. `ci-skill-root-metadata.cjs --fix --skill system-skill-advisor` added 8 leaves, then the check printed `OK`.
- [x] T032 Add the feature catalog leaf and its root row (`.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md`, `feature-catalog.md`). Proof: `validate_catalog_package.py --package system-skill-advisor` passes
  - Evidence: leaf title and H1 are both "Doctor Command Routing". `validate_catalog_package.py --package system-skill-advisor`: `PASS tier=fail violations=0`, exit 0.
- [x] T033 Add `/doctor:setup` to the spec-kit doctor catalog overview and the root README command list, after a `git diff` on each (`.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md`, `README.md`)
  - Evidence: `git diff` showed `README.md` with one line from the parallel sk-git work and the overview clean. `README.md` now says Ten and eight routed and lists `/doctor:setup`. `validate_catalog_package.py --package system-spec-kit`: `PASS tier=fail violations=0`.
- [x] T034 Orchestrator: run the playbook package validator, the catalog validator and `hvr_scan.py` on every new or touched doc, with 0 hard blockers
  - Evidence: `validate-playbook-package.cjs` reports `scenarios=61 ... violations=0`. `hvr_scan.py` shows 0 hard blockers on every new doc. Three semicolons in `setup.md` and the presentation file were fixed. Touched shared docs keep only blockers that HEAD already had (README.txt 2, playbook 8, catalog 1).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T025 Orchestrator: run G0 through G12 from the final state and read every output and exit status
  - Evidence: G0 to G11 all exit 0, listed with their result lines in `implementation-summary.md`. G4: 143 files, 1084 passed, 6 skipped.
- [x] T026 Orchestrator: run G11 against the T001 snapshot and write the delta, including the rows that did not move, into `implementation-summary.md`. If a count moved, re-capture with `capture-scorer-eval-baseline.mjs --write` only after G11 shows zero lost rows, and record both counts
  - Evidence: G11 lost 0, gained 0, missing 0. G6 counts equal baseline, so no re-capture.
- [x] T027 Orchestrator: confirm SC-001 under the pinned regime. "Help me set up skilled" must return `/doctor:setup` and "check my environment variables" must return `/doctor:env list`. Repeat through a live daemon if one is running
  - Evidence: through the live daemon, "Help me set up skilled" gives `use /doctor:setup 0.90/0.12 pass` and "check my environment variables" gives `use /doctor:env list 0.90/0.16 pass`.
- [x] T028 Orchestrator: run `/doctor:setup` once in a live session and confirm it writes nothing (`git status --short` before and after)
  - Evidence: the run found the advisor leg exiting 64 for a missing `workspaceRoot`, fixed by brief. After the fix the legs exit 0, 0, 1 (stale index, repair `/doctor:speckit`), 0 and 0, and the working-tree hash was identical before and after.
- [x] T029 Orchestrator: fill `implementation-summary.md`, mark every row of `acceptance-criteria.md` with evidence, remove scratch residue and run G12 for `RESULT: PASSED`
- [x] T030 Follow-up added by the operator on 2026-10-15: name `--workspace-root "$PWD"` on the remaining `advisor_status` calls in `.skilled/commands/doctor/_routes.yaml` and `.skilled/commands/doctor/assets/doctor-skill-advisor-rebuild.yaml` [EVIDENCE: without the flag `advisor_status --format json --warm-only` exits 64 with "advisor_status.workspaceRoot is required", with it exits 0. Four lines changed by DeepSeek, both files parse as YAML, `route-validate.sh` 14 routes OK, doctor `run-all.sh` 7 suites passed, `doctor-phrase-reach.cjs` STATUS=OK]
- [x] T031 Follow-up added by the operator on 2026-10-15: keep the first SQLite open out of the timed lease race in `stress-test/skill-advisor/single-writer-lease-stress.vitest.ts` [EVIDENCE: CI failed from runner image ubuntu24/20261012 on with 431 ms and 414 ms against 250 ms, while the next two tests in the file took 6 ms and 5 ms, so the cost is a cold first open. An untimed warm-up in `beforeAll` fixes it. Simulated a one-time 400 ms first open: without the warm-up the test fails `expected 406 to be less than 250`, with it 3 of 3 pass. Full stress suite 21 files and 64 tests passed locally. CI confirmation follows the push]
  - Evidence: summary written, every acceptance row marked, scratch keeps only the cited evidence files, G12 result recorded in the final report.

### Review remediation (follow-up added by the operator on 2026-10-16)

The deep review in `review/review-report.md` closed PASS with nine P2 advisories. The operator raised the umbrella sk-git finding to P1 and asked for every finding to be fixed or rejected with evidence. Each finding was reproduced against the code before its brief went out, and none was rejected. DeepSeek V4.1 Flash on cli-pi made every edit outside this folder, one brief at a time.

- [x] T035 [P1] Pass `--tool=<name>` to the umbrella sk-git leg and read the battery's exit 3 as DEGRADED, not FAIL (`.skilled/commands/doctor/assets/doctor-setup.yaml`, `doctor-setup-presentation.txt`, `_routes.yaml`, `setup.md`, DOC-391 `doctor-setup-run.md`) [EVIDENCE: reproduced first. With `CLAUDECODE` unset the battery printed `STATUS=DEGRADED degraded=0 skipped=0 unknown=1` and exited 3, `--tool=codex` printed `STATUS=OK checks=11` and exited 0, and `--tool=hermes` exited 2 because the battery's `TOOLS` list holds only claude, codex, devin, cursor, opencode and pi. The leg now passes `--tool=<name>` for those six and no flag elsewhere, maps exit 3 to DEGRADED as `/doctor:git setup` does, and keeps STATUS=OK when no leg fails. The presentation contract gained the DEGRADED result, a degraded count and a troubleshooting row. DOC-391 dropped "any other exit is FAIL, including a sk-git exit 3". `route-validate.sh` printed `OK: route-validate — 14 routes validated, 2 warnings`, exit 0, and the doctor test runner printed `7 suite(s) passed, 0 failed`]
- [x] T036 [P2] Count a doctor command as typed only when the prompt starts with it, in the TypeScript ordering rule and the Python native-wrapper sort key (`runtime/lib/scorer/fusion.ts`, `runtime/scripts/skill_advisor.py`, `runtime/tests/scorer/doctor-ordering.vitest.ts`, `runtime/tests/python/test_skill_advisor.py`) [EVIDENCE: reproduced first through the live CLI. "fix the git hook that /doctor:git hooks lists" ranked `command-doctor-git-hooks 0.8317` above a passing `sk-git 0.82`. The Python sort key carried the same substring rule, so it changed with the TypeScript one to keep the two scorers agreeing. New test 11 of 11 passed, and with the old `includes('/doctor:')` restored it failed. The extended Python check gave `pass=66, fail=0`, and with the old substring rule restored `pass=65, fail=1`]
- [x] T037 [P2] Require tooling context after a bare "check" before the no-match fallback adds the `/doctor:setup` hint, in the Claude hook and the OpenCode plugin copy (`hooks/claude/user-prompt-submit.ts`, `.opencode/plugins/lib/skill-advisor-render.js`, `runtime/tests/hooks/doctor-setup-hint.vitest.ts`, plus the wording in `runtime/lib/render.ts`, `hooks/skill-advisor-hook.md`, `feature-catalog/hooks-and-plugin/claude-hook.md`, `feature-catalog/scorer-fusion/doctor-command-routing.md` and DOC-389) [EVIDENCE: "check what time the tide turns" now gets no hint, while "check my environment variables", "install the hooks", "configure the advisor" and "Help me set up skilled" still do. The hint and plugin suites passed 103 of 103 at this step. With the old regex in the hook only, 2 failed (the parity test and the new test). With the old regex in both copies, 1 failed. T046 later narrowed the context words and added a "check with my doctor" row Known limit: the context word must follow "check", so "is the toolchain ok, check it" gets no hint]
- [x] T038 [P2] Make the doctor phrase-reach probe refuse a build that is stale against its source (`.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs`, `assets/doctor-router-reach.yaml`) [EVIDENCE: the probe now calls the existing `checkPackageFreshness` helper that the advisor CLI shim already uses and exits 2 on a stale or unreadable build. While DeepSeek worked, the build was stale and the old probe printed `STATUS=OK` with exit 0, which is the bug. Mutation check: with one appended comment line in `fusion.ts` the probe exited 2 and named the stale dist, and with the guard disabled the same stale build exited 0. Restored, `STATUS=OK phrases=82 bridges=15`, exit 0. A follow-up brief removed a duplicated rebuild instruction from the error line]
- [x] T039 [P2] State the `/tmp/system-skill-advisor` socket-directory creation in DOC-391 and in the `/doctor:setup` workflow summary (`doctor-setup-run.md`, `.skilled/commands/doctor/setup.md`) [EVIDENCE: `.skilled/bin/skill-advisor.cjs:85-102` calls `ensureSocketDir()` at startup, which runs `fs.mkdirSync('/tmp/system-skill-advisor', { recursive: true })` when `SPECKIT_IPC_SOCKET_DIR` is unset. Both docs now say the run writes nothing in the repository and name that one outside write. The CLI shim is shared by every advisor command, so it was left unchanged]
- [x] T040 [P2] Add the feature-catalog backlink to DOC-385 through DOC-391 (`manual-testing-playbook/doctor-commands/doctor-routing-*.md`, `doctor-setup-run.md`) [EVIDENCE: each of the seven files now lists `Feature catalog: [scorer-fusion/doctor-command-routing.md](../../feature-catalog/scorer-fusion/doctor-command-routing.md)` under its source files, as `sk-create-manual-testing-playbook/SKILL.md:506` requires, and the link target exists. Playbook validator `violations=0` over 61 scenarios]
- [x] T041 [P2] Remove the advisor catalog row for OpenCode native SessionStart and UserPromptSubmit hooks and correct the counts (`feature-catalog/feature-catalog.md`) [EVIDENCE: `hooks/skill-advisor-hook.md:60` says "OpenCode has no source-hook adapter in `system-spec-kit`", and the plugin row already covers OpenCode. The catalog counted 44 features for 43 leaf files, so it now says 43, and the hooks group says 4. `validate_catalog_package.py --package system-skill-advisor`: `PASS: 0 violations`]
- [x] T042 [P2] Correct the root README command totals (`README.md` lines 80 and 1074) [EVIDENCE: `.skilled/commands/**/*.md` holds 39 entry points, 36 across the six groups (create 13, deep 3, design 3, doctor 10, prompt 1, speckit 6) plus 3 root utilities, matching the `.skilled/commands/README.txt` group rows. Both lines now say 39, and line 1074 says 36 across 6 groups. Only those two lines changed]
- [x] T043 [P2] Add DOC-385 to DOC-391 and `/doctor:setup` to the shared DOC-number registry (`.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md`) [EVIDENCE: line 26 now names the advisor's doctor routing and `/doctor:setup` scenarios, DOC-385 to DOC-391. Spec-kit playbook validator `violations=0` over 99 scenarios]
- [x] T044 Orchestrator: clear the hard voice blockers that touched docs already carried, because the gate asks for 0 on every touched doc (`feature-catalog/feature-catalog.md`, `feature-catalog/hooks-and-plugin/claude-hook.md`, `hooks/skill-advisor-hook.md`) [EVIDENCE: `hvr_scan.py` reported the same blockers at HEAD: 1, 2 and 27. Briefs replaced "harness", two em dashes and 27 prose semicolons. A comparison with punctuation and case stripped showed no word changed in `skill-advisor-hook.md`. All 15 touched docs now report 0 hard blockers]
- [x] T045 Orchestrator: run every gate from the final state and get a read-only Luna review of the diff [EVIDENCE: recorded in `implementation-summary.md` under Review remediation]
- [x] T046 Act on the Luna review of this remediation (`hooks/claude/user-prompt-submit.ts`, `.opencode/plugins/lib/skill-advisor-render.js`, `runtime/tests/hooks/doctor-setup-hint.vitest.ts`, `doctor-phrase-reach.cjs`, `_routes.yaml`, four wording docs) [EVIDENCE: Luna (gpt-6-luna, max, read-only) returned six findings, each checked against the code. Accepted: the context words `doctor`, `advisor` and `health` let "check with my doctor" and "check my health" get the hint, so they were dropped. The 227-character regex line broke the sk-code-opencode 100-character limit, so both copies now build it from `String.raw` fragments, with the parity test still comparing `.source` and `.flags`. The probe accepted an `unprovisioned` freshness result, so it now requires `status === 'fresh'`. The route comment said the probe writes nothing, so it now names the cached build record in the ignored dist folder. Tests: 116 of 116 in the hint, plugin and Pi suites, and with the previous regex restored in both copies the new "check with my doctor" row failed. Plugin suite 303 of 303. Not mine: `doctor-git-setup.yaml:48` tells `/doctor:git setup` to pass `--tool` on every runtime, which fails on Hermes. That file belongs to the sk-git remediation running in parallel, so it is handed over, not edited. Rejected: "the worktree holds changes absent from the diff" describes the parallel sk-git work, which was left out of the review diff on purpose]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every row of `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [x] G11 shows zero rows lost against the T001 snapshot
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
- **Research**: See `specs/system-skill-advisor/034-doctor-command-guidance/research/research.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-015, each with file and line evidence)
- [x] CHK-002 [P0] Technical approach defined in plan.md (sections 3 and 4)
- [x] CHK-003 [P1] Dependencies identified and available (T010 adds the `yaml` install step to every CI job that runs the generator and lacks it). T010 found no job lacking it
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] G0 build and typecheck pass
- [x] CHK-011 [P0] No new warnings in G3 or G4 output
- [x] CHK-012 [P1] The deriver fails with a named error on a route whose router lacks a `skill_agent` tag
- [x] CHK-013 [P1] Code follows the sk-code conventions for the runtime, with no ephemeral ids in comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] G11 shows zero lost rows against the T001 snapshot
- [x] CHK-022 [P1] Edge cases tested: typed bare command, typed command with target, single-route command, unmapped doctor id and a plain unrelated unmatched prompt showing no hint
- [x] CHK-023 [P1] Every proving test failed under its mutation check before it was counted
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each change carries its class. The ordering rule is `class-of-bug` scope, since it governs every doctor bridge. The renderer line is `cross-consumer`, since the hook brief and the Python path both reach it
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed at T002 (`scratch/inventories.md` section 1, 22 hits)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the renderer, the generated blocks and the compatibility file
- [x] CHK-FIX-004 [P0] Label sanitizing covers doctor strings, with an instruction-shaped label rejected in a test
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed before completion (plan Fix Addendum)
- [x] CHK-FIX-006 [P1] Gates run under the pinned force-local regime with semantic search off
- [x] CHK-FIX-007 [P1] Evidence pinned to the final commit SHA, not a branch-relative range. No commit exists yet, by operator direction, so evidence is pinned to HEAD `828cb749da` plus the working tree. Re-pin after the operator commits
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any brief or file
- [x] CHK-031 [P0] `/doctor:setup` declares `mutating: read-only`, G2 passes and T028 shows no write
- [x] CHK-032 [P1] Rendered doctor strings come only from the generated lookup, never from prompt text
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized
- [x] CHK-041 [P1] The `_routes.yaml` header names its consumer correctly
- [x] CHK-042 [P2] The command catalog and the bridge README updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion, keeping only the evidence files the summary cites
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-15
<!-- /ANCHOR:summary -->

---
