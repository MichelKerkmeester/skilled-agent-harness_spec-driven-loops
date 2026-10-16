---
title: "Implementation Summary"
description: "Doctor routes in _routes.yaml now become advisor bridges. A setup or health prompt surfaces a runnable /doctor:x line, a passing skill stays first and no pinned routing prompt moved."
trigger_phrases:
  - "doctor command routing implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/035-doctor-command-routing"
    last_updated_at: "2026-10-16T21:02:01Z"
    last_updated_by: "generate-context"
    recent_action: "Recorded the environment variables decision and stopped the lexical amendment"
    next_safe_action: "Decide whether to change partial-credit token overlap, then commit"
    blockers: []
    key_files:
      - "specs/system-skill-advisor/035-doctor-command-routing/tasks.md"
      - "specs/system-skill-advisor/035-doctor-command-routing/implementation-summary.md"
      - ".skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-bridge-isolation.vitest.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts"
    session_dedup:
      fingerprint: "sha256:d1de3fe560170d1d1f24ac9bb7defe1d6f792dc327e0011bc3787c9e92826281"
      session_id: "plan-035-2026-10-15"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1"
      - "Q2"
      - "Q3"
      - "Q4"
      - "Q5"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 035-doctor-command-routing |
| **Status** | Complete. The first build and the first review remediation are committed from `1996cf02a6` onward. The second review remediation is in the working tree, not committed |
| **Completed** | 2026-10-15. Second review remediation 2026-10-16 on `main` at HEAD `2d17450c44` plus the working tree |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The skill advisor now knows the doctor commands. Every route in `.skilled/commands/doctor/_routes.yaml` becomes a command bridge, and 15 of them are active in both scorers. A prompt such as "Help me set up skilled" now returns `/doctor:setup`, which returned nothing before. When a skill also passes, the skill stays first and the brief adds `Also: /doctor:<command> <target>` as a second line. A new `/doctor:setup` command lists every doctor target and runs five read-only checks.

### The /doctor:setup command

`.skilled/commands/doctor/setup.md` routes to `assets/doctor-setup.yaml` and `assets/doctor-setup-presentation.txt`. The workflow prints a 17-row target list, runs the sk-code setup check, the sk-git setup check, the trigger index check, the runtime mirror check and the advisor status probe, and names one repair command per failing check. Mirrors were generated for Claude, Cursor, Codex, Pi and Hermes.

### Bridge generation and ranking

`derive-command-bridges.cjs` reads `_routes.yaml` as a third source and writes the TypeScript keywords from the manifest phrases, the Python slash marker from the runnable string, and a lookup block in `render.ts`. `fusion.ts` gained two doctor-only rules. `requireDoctorPhraseAnchor` keeps a doctor bridge from passing on loose lexical overlap. `keepPassingSkillsAboveDoctorBridges` keeps a passing skill above any doctor bridge unless the prompt types `/doctor:`. The Python native wrapper sorts the same way.

### Brief text

`render.ts` shows a doctor bridge as its runnable string, never as its raw id. The Claude hook sets a setup-wording flag, and a no-match brief for a setup, install, check or configure prompt adds `For setup or health checks, run /doctor:setup.` (47 bytes).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/setup.md`, `assets/doctor-setup.yaml`, `assets/doctor-setup-presentation.txt` | Created | The `/doctor:setup` command |
| `.claude/commands/doctor/setup.md`, `.cursor/commands/doctor-setup.md`, `.codex/prompts/doctor-setup.md`, `.pi/prompts/doctor-setup.md`, `.hermes/prompts/doctor-setup.md` | Generated | Runtime mirrors |
| `.skilled/commands/doctor/_routes.yaml` | Modified | `/doctor:setup` route, `/doctor:env` entry, `/doctor:update` phrases, header, reach probe invocation |
| `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs`, `assets/doctor-router-reach.yaml` | Created, modified | Doctor reach probe and its wiring |
| `.skilled/commands/README.txt` | Modified | Ten doctor commands and the Setup row |
| `runtime/scripts/command-bridges/derive-command-bridges.cjs`, `scoring-compatibility.json`, `command-bridges.generated.json`, `README.md` | Modified | Third source, activation, generated output, documentation |
| `runtime/lib/scorer/projection.ts`, `runtime/scripts/skill_advisor.py`, `runtime/lib/render.ts` | Modified | Generated blocks, Python sort key, doctor rendering and the hint |
| `runtime/lib/scorer/fusion.ts`, `hooks/claude/user-prompt-submit.ts` | Modified | Doctor ordering rules and the setup-wording flag |
| `runtime/scripts/routing-accuracy/doctor-prompts.jsonl` | Created | 40-row doctor slice |
| `runtime/tests/doctor-routing-slice.vitest.ts`, `doctor-command-bridges.vitest.ts`, `scorer/doctor-ordering.vitest.ts`, `doctor-brief-render.vitest.ts`, `hooks/doctor-setup-hint.vitest.ts` | Created | New proofs |
| `runtime/tests/command-bridges-drift-guard.vitest.ts`, `command-bridge-resolution-guard.vitest.ts`, `manual-testing-playbook.vitest.ts`, `python/test_skill_advisor.py` | Modified | Tests updated for the doctor source, plus one Python ordering test |
| `manual-testing-playbook/doctor-commands/` (7 files, DOC-385 to DOC-391), `manual-testing-playbook.md` | Created, modified | Agent-runnable scenarios and their index |
| `feature-catalog/scorer-fusion/doctor-command-routing.md`, `feature-catalog.md`, `leaf-manifest.json`, `leaf-aliases.json` | Created, modified | Catalog entry and regenerated leaf metadata |
| `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md`, `README.md` | Modified | `/doctor:setup` in the spec-kit doctor catalog and the root command list |

Paths starting with `runtime/`, `hooks/`, `manual-testing-playbook/` or `feature-catalog/` are under `.skilled/skills/system-skill-advisor/`.

### Review remediation (2026-10-16)

The deep review closed PASS with nine P2 advisories, and the operator raised the umbrella sk-git finding to P1. All nine were reproduced against the code and fixed, and none was rejected (T035 to T045).

- **sk-git leg on every runtime.** `/doctor:setup` now runs `git-setup-check.cjs --tool=<name>` for claude, codex, devin, cursor, opencode or pi, and reads the battery's exit 3 as DEGRADED, a result that names `/doctor:git setup` without failing the run. Before, a healthy install failed the leg everywhere except Claude Code.
- **Typed versus quoted doctor commands.** Both scorers keep a doctor bridge above a passing skill only when the prompt starts with `/doctor:`.
- **Setup hint.** A bare "check" no longer triggers the `/doctor:setup` hint. Check wording needs an environment, hook or tooling word after it.
- **Reach probe.** `doctor-phrase-reach.cjs` refuses a stale build with exit 2.
- **Docs.** DOC-391 and `setup.md` name the `/tmp` socket directory, DOC-385 to DOC-391 link their catalog page, a catalog row for a capability that does not exist is gone, the README says 39 commands, and the shared DOC-number registry lists DOC-385 to DOC-391.

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/assets/doctor-setup.yaml`, `doctor-setup-presentation.txt`, `setup.md`, `_routes.yaml` | Modified | sk-git leg `--tool` and DEGRADED, `/tmp` socket directory |
| `runtime/lib/scorer/fusion.ts`, `runtime/scripts/skill_advisor.py` | Modified | Typed doctor command means the prompt starts with it |
| `hooks/claude/user-prompt-submit.ts`, `.opencode/plugins/lib/skill-advisor-render.js`, `runtime/lib/render.ts` | Modified | Setup-wording expression and its comment |
| `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs`, `assets/doctor-router-reach.yaml` | Modified | Stale-build refusal |
| `runtime/tests/scorer/doctor-ordering.vitest.ts`, `runtime/tests/hooks/doctor-setup-hint.vitest.ts`, `runtime/tests/python/test_skill_advisor.py` | Modified | One new test each (the Python one extends the existing check) |
| `manual-testing-playbook/doctor-commands/` DOC-385 to DOC-391 | Modified | Catalog backlinks, DOC-391 mapping and side effect, DOC-389 wording |
| `feature-catalog/feature-catalog.md`, `feature-catalog/hooks-and-plugin/claude-hook.md`, `feature-catalog/scorer-fusion/doctor-command-routing.md`, `hooks/skill-advisor-hook.md` | Modified | Catalog row and counts, setup wording, voice blockers |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md`, `README.md` | Modified | DOC-number registry, command totals |
### Second review remediation (2026-10-16)

Two more reviews of v4.0.0.12 and v4.0.0.13 found 6 P1 and 29 P2 issues, and the shipped tests passed all of them because they scored prompts in a way the hooks never do. Every finding was checked against the code. None was rejected. Two docs findings were handed to the parallel sk-git remediation, which owns their files (T047 to T067).

- **Short skill prompts route again.** "git hooks", "git setup", "git standards", "git rules" and "speckit doctor" returned nothing, because a doctor bridge with no phrase match still joined the skill's ambiguity cluster. The scorer now computes every skill's uncertainty and abstention without the doctor bridges, so a bridge never changes how a skill scores. All 59 short prompts in `scratch/short-prompts.json` now route as they do with the bridges removed, in process and through the live CLI.
- **The doctor line survives the three-result limit.** A passing doctor bridge now sits after the second passing skill, so "update skilled to the latest release" keeps `/doctor:update` as its second line.
- **"run /doctor:setup" counts as typing it.** A command right after run, execute, start, launch, use or "kick off", outside quotes, puts its own bridge first, and so does a prompt that starts with it. The Python native wrapper and the Python local scorer follow the same rule.
- **The setup check tells its advisor cases apart.** A stale build is FAIL with the build command, a stopped daemon SKIP and a non-live skill graph DEGRADED. A crashed sk-git leg is ERROR.
- **Smaller fixes.** Two-word `/doctor:update` phrases replaced and a three-word guard in the reach probe. The setup hint check is linear, has fewer false hits and runs only without a brief. The deriver rejects a malformed standalone phrase. The `Also:` line is never cut mid-command. The slice and the probe read three results.
- **Docs.** The add-a-target steps, six spec-kit `advisor_status` commands, the root README, the command indexes, the advisor and spec-kit docs and three released changelog statements now match the code.

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/scorer/fusion.ts`, `runtime/scripts/skill_advisor.py` | Modified | Doctor-free skill scoring, ordering and typed rule in both scorers |
| `runtime/lib/render.ts`, `hooks/claude/user-prompt-submit.ts`, `.opencode/plugins/lib/skill-advisor-render.js`, `.opencode/plugins/system-skill-advisor.js` | Modified | Whole `Also:` line, bounded and lazy setup check |
| `runtime/scripts/command-bridges/derive-command-bridges.cjs`, `command-bridges.generated.json`, `runtime/lib/scorer/projection.ts` | Modified, generated | Standalone phrase validation, regenerated phrases |
| `.skilled/commands/doctor/_routes.yaml`, `assets/doctor-setup.yaml`, `assets/doctor-setup-presentation.txt`, `setup.md`, `scripts/doctor-phrase-reach.cjs`, `scripts/README.md`, `.skilled/commands/README.txt` | Modified | Phrases, header steps, advisor and sk-git leg readings, probe rules, indexes |
| `runtime/tests/scorer/doctor-bridge-isolation.vitest.ts` | Created | 39 short-prompt isolation cases |
| `runtime/tests/scorer/doctor-ordering.vitest.ts`, `doctor-routing-slice.vitest.ts`, `doctor-brief-render.vitest.ts`, `hooks/doctor-setup-hint.vitest.ts`, `python/test_skill_advisor.py`, `scripts/routing-accuracy/doctor-prompts.jsonl`, `.skilled/commands/doctor/scripts/tests/doctor-phrase-reach.test.cjs` | Modified | Tests that fail without each fix |
| Advisor docs (`README.md`, `SKILL.md`, `hooks/skill-advisor-hook.md`, three catalog pages, DOC-387, DOC-389, DOC-391, the bridges README) and `.hermes/skills/system-skill-advisor/SKILL.md` | Modified, generated | Doctor routing described as built |
| `README.md`, spec-kit `README.md`, two spec-kit catalog pages and their overview leaf, three spec-kit references and playbook | Modified | Counts, `/doctor:setup`, `--workspace-root` |
| `changelog/v0.16.0.0.md` (advisor), `changelog/v2.8.1.0.md` (spec-kit), `.skilled/skills/sk-doc/ROUTER.md` | Modified | Three false statements corrected in place |
### Short-prompt vocabulary (2026-10-16)

Twelve short prompts returned nothing even with every doctor bridge removed. Eleven now route to their owner through an authored `intent_signals` phrase: "pre-push hook", "push allowlist", "hook trust", "hook gates", "cherry pick" and "squash commits" to sk-git; "env vars", "runtime mirrors", "resume spec" and "validate spec" to system-spec-kit; "mcp tools" to mcp-tooling. The same top skill comes back in process and through the live CLI, with no doctor bridge in the list. The sk-git phrase for the allowlist prompt is "push", because "allowlist" matched the token "list" in the lexical lane's substring test and pulled a labeled review prompt to sk-git. The per-prompt comparison shows lost 0, gained 0 and missing 0. `doctor-bridge-isolation.vitest.ts` pins all eleven plus that review prompt: 52 of 52, and 11 failed with the old metadata. Advisor suite 1184 passed, 6 skipped; Python `pass=68, fail=0`; reach probe, drift guards and runtime mirrors pass. Luna made both metadata edits and the test edit, one brief at a time.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash on cli-pi (`llmgateway/deepseek-v4.1-flash`, thinking max) made every edit outside this folder, one short brief at a time. The orchestrator backed up each target, diffed the result against the brief, ran the tests and ran a mutation check for each proof. No DeepSeek edit needed a self-edit by the orchestrator. The orchestrator ran the generators, the mirror sync scripts and `ci-skill-root-metadata.cjs --fix` itself, and wrote the docs in this folder.

The second review remediation used GPT Luna (`gpt-6-luna`, reasoning max, fast tier) on cli-codex for every edit outside this folder, 17 briefs, one at a time, because the DeepSeek gateway refused the first brief with a daily-allowance billing error. No Luna edit needed a self-edit by the orchestrator. The orchestrator ran the bridge deriver, the Hermes skill sync and `npm ci` (twice, see Known Limitations 4).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A passing skill keeps first place and the doctor line comes second | The operator decided it, and the Python scorer already orders skills above commands |
| The doctor slice gets its own file and gate | The three existing corpora are hash-pinned by the baseline and by CI |
| Python carries slash markers only | A Python marker found in a prompt counts as explicit command intent, which would rank the command first |
| The no-match hint shows only on setup, install, check or configure wording | The operator decided it on 2026-10-15, so unrelated prompts carry no extra text |
| `/doctor:deep-loop` and the `/doctor:mcp` sub-actions wait for a later wave | The operator decided it on 2026-10-15, and the research never measured them |
| Level 2, one packet | `recommend-level.sh` scored 58, and the phase score of 10 meets neither phase threshold |

### Deviations from the plan

1. **A second ordering rule.** The plan named one rule. Wave A showed `/doctor:env list` passing on "Help me set up skilled" and `/doctor:git hooks` coming second on a worktree prompt, both from loose lexical overlap. `requireDoctorPhraseAnchor` makes a doctor bridge pass only on an explicit-author match. It touches doctor ids only and changes no weight, threshold or confidence constant.
2. **Two slice rows changed.** "skill budget audit" and "router reach check" now expect `sk-code` first and the doctor bridge second. The doctor phrase anchor lifts low-information abstention, so `sk-code` passes, and the operator rule keeps a passing skill first.
3. **One `/doctor:env` phrase renamed.** "list skilled environment switches" hit the read-only explainer floor on "list", so the reach probe failed it. It became "skilled environment switch values".
4. **The Python native wrapper needed a sort key.** It re-sorted results by score and put doctor bridges above skills. A key now keeps them below unless the prompt types `/doctor:`, with a new Python test.
5. **Two existing tests changed.** The bridge drift guard now projects doctor entries from `_routes.yaml` and counts hand-authored entries over non-doctor ids. The resolution guard takes the first token of a runnable string such as `/doctor:env list`.
6. **No CI workflow edit at T010.** `scratch/ci-yaml-check.md` shows every job that runs the generator already has the `yaml` parser.
7. **Model.** The plan named an opencode-go model. The operator directed `llmgateway/deepseek-v4.1-flash` on cli-pi.
8. **Advisor leg invocation fixed during T028.** The live run showed `advisor_status --format json --warm-only` exiting 64 because `workspaceRoot` is required. The `/doctor:setup` workflow, its route and DOC-391 now pass `--workspace-root "$PWD" --timeout-ms 500`, which exits 0.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| G0 build and typecheck | Both exit 0 |
| G1 bridge drift | Exit 0, `"status": "fresh"`, doctorRoutes 16, generated 43, typescriptActive 20, pythonActive 30 |
| G2 route manifest | Exit 0, `OK: route-validate — 14 routes validated, 2 warnings` (13 at baseline, both warnings are existing `--dry-run` notices) |
| G3 targeted suites | Exit 0, `Test Files 9 passed (9)`, `Tests 66 passed (66)` |
| G4 full advisor suite | Exit 0, `Test Files 143 passed (143)`, `Tests 1084 passed, 6 skipped (1090)`. Baseline 138 files, 1054 passed, 6 skipped |
| G5 Python suite | Exit 0, `Summary: pass=66, fail=0` (65 at baseline plus the new ordering test) |
| G6 routing benchmark | Capture exit 0: labeled 155 of 195, holdout 49 of 66, ambiguity 19 of 24, unknown 13, gold-none false fires 5, all equal to baseline. Corpus gate exit 0, `"overall_pass": true`, correct 113 |
| G7 scorer parity | Exit 0, 2 files, 11 tests passed |
| G8 doctor slice | Exit 0, 2 tests passed |
| G9 reach probe | Exit 0, `STATUS=OK phrases=82 bridges=15` |
| G10 mirrors and catalog | All five checks exit 0. Runtime mirrors 185 in sync, Codex, Pi and Hermes prompts 37 in sync each, `STATUS=OK command-catalog-mirror` |
| G11 per-prompt comparison | Exit 0, lost 0, gained 0, missing 0 against `scratch/baseline-per-prompt.json`. Every row stayed where it was, so no re-capture was needed |
| Playbook validators | Inventory test 1 passed (61 scenarios). `validate-playbook-package.cjs` printed `SKIP package=system-skill-advisor ... routing_gold_excluded=61 violations=0`: the corpus manifest lists the advisor playbook as a routing-gold root, so the operator-scenario contract checked none of DOC-385 to DOC-391. Only `validate_document.py` checked their structure. Topology validator: SKIP, standalone root |
| Catalog validators | `PACKAGE system-skill-advisor: PASS tier=fail violations=0` and `PACKAGE system-spec-kit: PASS tier=fail violations=0` |
| Leaf metadata | `ci-skill-root-metadata.cjs --skill system-skill-advisor`: `OK`, after `--fix` added 8 leaves |
| Probe prompts (live daemon) | "Help me set up skilled" gives `use /doctor:setup 0.90/0.12 pass`. "check my environment variables" gives `use /doctor:env list 0.90/0.16 pass`. "check my git hooks setup" gives `use sk-git 0.82/0.20 pass` then `Also: /doctor:git setup`. "install the frobnicator widget" gives the hint. The photosynthesis prompt gives `Advisor: no skill matched.` alone |
| T028 `/doctor:setup` run | sk-code exit 0, sk-git exit 0, trigger index exit 1 (stale, repair `/doctor:speckit`), runtime mirrors exit 0, advisor exit 0. A hash of `git diff HEAD --stat` plus the untracked list was identical before and after |

### Mutation checks

Every proof failed under its mutation and passed once restored. Slice wave flipped early: 1 failed. Router without a `skill_agent` tag: deriver exit 1 with a named error. Lookup value changed: 1 of 3 failed. Ordering rule a no-op: 2 of 6 failed. Slash exemption removed: 1 failed. Companion line removed: 2 of 7 failed. Top doctor label removed: 2 of 7 failed. Renderer hint flag removed: 2 of 8 failed. Hook flag forced false: 5 of 8 failed. Phrase-anchor rule a no-op: 1 of 10 failed. Generated keyword removed: 1 of 3 failed. Reach phrase renamed: `STATUS=FAIL` exit 1. Python sort key removed: `pass=65 fail=1`. Playbook row removed: inventory test failed.

### Review remediation gates (2026-10-16, final state)

| Check | Result |
|-------|--------|
| Build and typecheck | `build exit=0`, `typecheck exit=0` |
| Full advisor suite | `Test Files 143 passed (143)`, `Tests 1111 passed, 6 skipped (1117)`, exit 0. Clean baseline before any edit: 143 files, 1108 passed, 6 skipped. The three added tests are the quoted-command row and two no-hint check rows |
| Python suite | `Summary: pass=66, fail=0` before and after (the quoted case extends an existing check) |
| Per-prompt comparison | Snapshot exit 0 at labeled 155 of 195, holdout 49 of 66, ambiguity 19 of 24. Comparison against `scratch/baseline-per-prompt.json`: lost 0, gained 0, missing 0, exit 0 |
| Doctor phrase reach | `STATUS=OK phrases=82 bridges=15`, exit 0 |
| Route manifest | `OK: route-validate — 14 routes validated, 2 warnings`, exit 0. Doctor test runner `7 suite(s) passed, 0 failed` |
| Command catalog and mirrors | `STATUS=OK command-catalog-mirror`, exit 0. `[runtime-mirror-sync] PASS: 185 mirrors across 8 trees are in sync.`, exit 0. The prompt mirrors of `setup.md` only point at the canonical file, so none needed regenerating |
| OpenCode plugin suite | 303 passed, 0 failed |
| sk-code drift guards | Exit 1. Stack folders, router sync and doc claims pass. Alignment drift reports 16 `ROUTER-DEAD-PATH` errors, all in the committed review snapshot `review/lineages/deepseek-max/evidence/pre/SKILL.md`, which this work did not change. 0 errors elsewhere. See Known Limitations |
| Voice scan | `hvr_scan.py` 0 hard blockers on all 15 touched docs |
| Playbook and catalog validators | Advisor playbook `violations=0` over 61 scenarios, a SKIP that checked no scenario (see the first Playbook validators row), spec-kit playbook `violations=0` over 99, both catalogs `PASS: 0 violations`, leaf metadata `passed=1 failed=0` |
| Luna review | gpt-6-luna at max, read-only. Six findings: four accepted and fixed under T046, one handed to the parallel sk-git remediation (`doctor-git-setup.yaml:48`), one rejected because it described that parallel work |

### Review remediation mutation checks

Quoted-command row with the substring rule restored: 1 of 11 failed. Python check with the substring rule restored: `pass=65, fail=1`. Original setup regex in the hook only: 2 failed (parity and the tide row). In both copies: 1 failed. T046 regex with `doctor` restored in both copies: the "check with my doctor" row failed. Probe on a build made stale by one appended comment line: exit 2. Same stale build with the guard disabled: exit 0, `STATUS=OK`. Each restored state passed again.

### Review remediation deviations

1. **Python changed with TypeScript.** The finding named `fusion.ts:679`, but the Python native wrapper carried the same substring rule, and the two scorers are meant to sort alike, so both changed.
2. **DeepSeek ran the advisor build once.** During the probe brief it rebuilt the gitignored `dist` to reach `STATUS=OK`. Nothing tracked changed. No other brief went outside its files, and no edit needed an orchestrator self-edit.
3. **Pre-existing voice blockers cleared.** The gate asks for 0 hard blockers on every touched doc, so T044 fixed 30 blockers that HEAD already had in three advisor docs, as punctuation and one word only.
4. **Exit 3 is DEGRADED, not a new failure class.** The umbrella keeps its OK, FAIL and ERROR statuses. A degraded leg names `/doctor:git setup` and does not fail the run, matching how `/doctor:git setup` itself reports exit 3.


### Second review remediation gates (2026-10-16, final state)

| Check | Result |
|-------|--------|
| Build and typecheck | `build exit=0`, `typecheck exit=0` |
| Full advisor suite | `Test Files 144 passed (144)`, `Tests 1171 passed, 6 skipped (1177)`, exit 0. Baseline 143 files, 1111 passed, 6 skipped |
| Python suite | `Summary: pass=68, fail=0`. Baseline 66 |
| OpenCode plugin suite | 303 passed, 0 failed |
| Doctor test runner | `7 suite(s) passed, 0 failed` |
| Per-prompt comparison | Labeled 155 of 195, holdout 49 of 66, ambiguity 19 of 24. Lost 0, gained 0, missing 0, exit 0 |
| Short prompts | In process `TOTAL=59 LOST=0 CHANGED=0` (7 lost and 2 changed before). Live CLI `LIVE_DIFF=0` |
| Live CLI | "git hooks", "git standards" and "git setup" return sk-git. "update skilled to the latest release" returns sk-code, system-deep-loop, `command-doctor-update`. "please run /doctor:setup for me" returns `command-doctor-setup` first |
| Doctor phrase reach | `STATUS=OK phrases=82 bridges=15`, exit 0 |
| Bridge deriver | `--check` `"status": "fresh"`, exit 0 |
| Route manifest | `OK: route-validate — 14 routes validated, 2 warnings`, exit 0 |
| Runtime mirrors | `PASS: 185 mirrors across 8 trees are in sync.`, exit 0. Hermes skills 68 and prompts 37 in sync |
| sk-code drift guards | `all 4 guards PASSED, 278 non-blocking warning(s)`, exit 0 |
| sk-doc hub | `parent-skill-check.cjs .skilled/skills/sk-doc`: all hard invariants passed, 0 warnings, exit 0 |
| Voice scan | 0 new hard blockers on all 23 touched docs. Older blockers stay as they were (advisor `SKILL.md` 29, sk-doc `ROUTER.md` 23, several spec-kit references) |
| Catalog and playbook validators | Both catalogs `PASS: 0 violations`. Spec-kit playbook PASS, `violations=0` over 99. Advisor playbook SKIP as a routing-gold root. Changelog `validate_document.py`: 0 issues on both entries. Leaf metadata passed for both skills |

### Second review remediation mutation checks

Old skill pass order: 24 of 39 isolation cases failed. Old ordering function: 8 of 24 failed. Old Python file: `pass=66, fail=2`. Slice on the scorer from before the fix: 13 rows failed, 6 with only the isolation fix. New probe on the scorer from before the fix: 9 phrases missed. Three-word guard disabled: the new probe test failed. Old setup check in both copies: 7 of 18 failed. Old render.ts: 1 of 8 failed. Old deriver with a bare-number phrase: no error, against exit 1 with a named error now. Each restored state passed again.

### Second review remediation deviations

1. **Luna instead of DeepSeek.** The DeepSeek gateway answered the first brief with a billing error, so Luna made every edit.
2. **The three-word guard sits in the reach probe.** The review suggested `route-validate.sh`, but that validator does not know which bridges are active and its own fixtures use one-word phrases.
3. **Two slice rows changed back.** "skill budget audit" and "router reach check" had expected sk-code first only because the doctor anchor lifted sk-code's abstention. With that fixed, sk-code abstains as it did before the bridges existed, and the doctor bridge is their top pick.
4. **One orchestrator repair and one extra brief.** `npm ci` restored the advisor runtime's `node_modules` twice after the launcher wiped them in a child's sandbox. A Luna brief outside the review's list aligned a spec-kit catalog leaf description with its corrected root row, because the catalog validator warned on the mismatch.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

Three earlier items are closed. The trigger index was regenerated and the README.txt voice blockers were cleared by later commits, and `run-all-drift-guards.sh` now passes all four guards. The work is committed from `1996cf02a6` onward.

1. **Setup wording reads forward only.** The context word must follow "check" within three words, so "is the toolchain ok, check it" gets no `/doctor:setup` hint.
2. **Hermes and the sk-git leg.** `git-setup-check.cjs` gains `--tool=hermes` in the parallel sk-git remediation (`specs/sk-git/033-git-setup-customization/009-second-review-remediation`). Until that lands, the sk-git leg shows DEGRADED on a healthy Hermes install.
3. **The stale-build advisor reading is derived, not reproduced.** Making the build stale on purpose would write to the tree, so the exit 75 plus `staleDistWarning` case rests on `.skilled/bin/skill-advisor.cjs:70-79`.
4. **The advisor launcher reinstalls dependencies on its own.** When any advisor source is newer than its build, `.skilled/bin/system-skill-advisor-launcher.cjs:1287` runs `npm ci`. Offline, as in a sandboxed child, that leaves `runtime/node_modules` nearly empty. It happened twice during this remediation and was repaired from the lockfile. The launcher is outside this packet's scope, so the fix is only proposed: refuse the bootstrap when the network is unreachable, or rebuild without reinstalling when `node_modules` is already present.
5. **"environment variables" routes to nothing, by operator decision.** On 2026-10-16 the operator chose to leave it unrouted: adding it to system-spec-kit would put the skill above `/doctor:env` on "check my environment variables", and that prompt keeps `/doctor:env` first. The isolation test lists it with no expected owner and a comment giving that reason.
6. **"push allowlist" rides on the broad sk-git signal "push".** The approved fix, whole-word evidence tokens in `lanes/lexical.ts`, was prototyped against a scratch copy of the build and does not bring back the phrase: with "push allowlist" restored, the review prompt "Review this PR for blocking routing regressions and list findings first." still went to sk-git (0.850 against sk-code 0.847), because `scoreTokenOverlap` in `text.ts` gives 0.45 partial credit when one token contains the other, so "list" still scores inside "allowlist". The evidence change moved nothing. A prefix-only partial-credit variant kept the review prompt on sk-code but moved five other rows, so neither change was applied and "push" stays.
<!-- /ANCHOR:limitations -->

---
