---
title: "Tasks: GPT-6 Luna and Sol cutover with LLM Gateway Luna routes and Opus 5.5 in cli-claude-code"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "gpt-6 cutover tasks"
  - "luna sol rename checklist"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: GPT-6 Luna and Sol cutover with LLM Gateway Luna routes and Opus 5.5 in cli-claude-code

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the GPT-6 ids against three live catalogs: `~/.codex/models_cache.json` lists `gpt-6-luna` (low to max) and `gpt-6-sol` (low to ultra), `opencode models openai` lists both plus `-fast`, and LLM Gateway `/v1/models` lists both bare ids, 1.05M context, 128K output, efforts `none` to `max`
- [x] T002 Capture baselines before any edit. Deep-loop runtime six suites: 391 passed, 1 skipped, exit 0, 221 s; `npm run typecheck` exit 0. Council `orchestrate-session-cli`: 20/21 with one pre-existing failure on a stale `deepseek-v4-flash` literal. Model-benchmark `remediation`: 34/35 with one pre-existing failure of the same cause. Pi fast-mode extension: 77/77. Drift-guard wrapper: rc 1, 9 errors and 16,569 warnings, none in a file this packet touches. `sync-skills-hermes.cjs --check`: 6 mirrors already drifted (cli-hermes, cli-opencode, cli-pi, sk-design, sk-create-changelog, deep-ai-council)
- [x] T003 Enumerate the in-scope files and the exclusions (an inventory built in the session scratchpad from a PCRE scan that skips `-max`; nothing written to this packet's `scratch/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Scripted token rename over the enumerated list, skipping the Luna Max personas. Evidence: one `perl` pass over 66 files (51 docs, 15 code); 64 changed, +211/-211
- [x] T005 Deep-loop enforcement, mirrors, defaults and tests (`executor-config.ts`, `fanout-run.cjs`, `codex-dispatch.cjs`, eight test files). Evidence: the code diff is id swaps only, including `CODEX_DEFAULT_MODEL` and `PI_MODEL_PROVIDERS`
- [x] T006 Pi: `.pi/settings.json`, `.pi/models.json`, `.pi/custom-providers.md`, and the cli-pi LLM Gateway section. Evidence: `llmgateway` gains `gpt-6-luna`, `enabledModels` renamed plus `llmgateway/gpt-6-luna`; docs say four gateway models. The `openai-codex` block first written here was removed on operator direction, and `pi update --models` put both GPT-6 ids in Pi's catalog instead
- [x] T007 Hermes roster rows: replace the 5.6 "probed live" standing with what was checked for the GPT-6 ids. Evidence: `cli-hermes/SKILL.md` roster paragraph and `references/providers-and-models.md` rows now read catalog-listed 2026-09-23; after the live smoke, `gpt-6-luna` reads probed live and `gpt-6-sol` still pending
- [x] T008 cli-claude-code: every Opus id to `claude-opus-5-5`, merging the rows that would duplicate. Evidence: 10 files; one Opus 5.5 row in `references/cli-reference.md` and `references/providers-and-models.md`; zero `claude-opus-4` hits in living docs
- [x] T009 Pi fast-mode extension: priority list, repo config, tests, README and playbook. Evidence: `src/config.ts`, both tests, the repo config JSON, README and playbook name `gpt-6-sol` and `gpt-6-luna`; the dated 2026-08-17 coverage note keeps its 5.6 wording
- [x] T010 [P] Version bumps and one changelog entry per affected skill. Evidence: cli-codex 1.9.1.0, cli-opencode 1.4.9.0, cli-pi 1.5.7.0, cli-hermes 1.0.2.0, cli-claude-code 1.5.1.0, each with `changelog/v<version>.md`
- [x] T011 Regenerate the Hermes mirrors and keep only the touched skills' mirrors. Evidence: the sync wrote 8; the 3 untouched mirrors were restored from the index; `git status .hermes` shows the 5 touched mirrors only. The later cli-hermes edit was regenerated into a scratch output directory and only that one mirror copied back
- [x] T017 Pi defaults, operator-directed: `.pi/pi-blackhole-config.json` to `openai-codex/gpt-6-luna` at `medium`, and `.pi/settings.json` to `llmgateway/gpt-6-luna` at `xhigh`. Evidence: both files parse. The settings first held the Codex route at `medium`, and a no-`--model` turn ran there; a running Pi session then saved the gateway route at `xhigh`, the operator kept it, and a no-`--model` turn ran on `llmgateway/gpt-6-luna` and replied `OK`
- [x] T019 Drop the redundant `xiaomi` block from `.pi/models.json`. Evidence: Pi's catalog listed `mimo-v2.6-pro` and `mimo-v2.6-pro-ultraspeed` with the same compat flags both before and after the refresh; `pi --list-models mimo-v2.6` still lists both under `xiaomi`; a `xiaomi/mimo-v2.6-pro` smoke replied `OK` on retry, after one exit-1 attempt whose log was overwritten
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Residue scan and the Luna Max persona guard. Evidence: one residue hit, the PI-017 captured-output cell kept as history; persona counts 26 files and 88 occurrences, identical before and after
- [x] T013 Suites and typecheck from the final state, compared to T002. Evidence: runtime six suites 391 passed, 1 skipped, exit 0, 248 s (baseline 391/1); typecheck exit 0; council 20/21 and model-benchmark 34/35 with the same two pre-existing failures; extension 77/77
- [x] T014 `pi --list-models gpt-6` and JSON parse of both pi files. Evidence: `llmgateway/gpt-6-luna`, `openai-codex/gpt-6-luna` and `openai-codex/gpt-6-sol` listed with built-in models intact, rerun after the catalog refresh; both files parse
- [x] T018 One-turn live smokes ("reply OK"). Evidence: Pi `openai-codex/gpt-6-luna`, `openai-codex/gpt-6-sol` and `llmgateway/gpt-6-luna` ($0.0009) and Hermes `gpt-6-luna` (session `20260923_075309_35eb04`) replied `OK`; Codex `gpt-6-luna` (16 s, 18,217 tokens) and OpenCode `openai/gpt-6-luna` (49 s, 19,612 tokens, repository file count unchanged) replied `OK` in a later run; the Codex, OpenCode and Hermes Sol routes were not run, which the operator declined as too expensive; cli-claude-code refused because this session is itself Claude Code
- [x] T015 Drift-guard wrapper compared to baseline, frontmatter version gate, Hermes mirror check. Evidence: drift rc 1 with the identical 9-error set and 16,569 warnings, the touched-area warning set unchanged; frontmatter gate exit 0 (2,923 ok); mirror drift 6 before, 3 after, 2 on the final recheck, none of them touched skills
- [x] T016 `validate.sh --strict` on this packet. Evidence: `RESULT: PASSED` after the derived-metadata repair
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Review Remediation

Source: a fresh read-only review of `f2a90d7ac5`, `a6307ce69a` and `80dc0a118d`, with every finding re-checked against `80dc0a118d`. Skill paths are under `.skilled/skills/cli-external-orchestration/`.

- [x] T020 Re-baseline the facts Phase 4 depends on, immediately before editing: `opencode models openai` (the slugs it serves), the `gpt-5.6-terra` ceiling in `~/.codex/models_cache.json`, the current version and newest changelog of cli-opencode, cli-codex and cli-pi, `sync-skills-hermes.cjs --check`, and whether sk-doc/057 is committed. Evidence: OpenCode serves astra, luna and sol with `-fast` variants and no `-pro`; the cache gives Terra `low` to `ultra`; versions 1.4.9.0, 1.9.1.0 and 1.5.7.0 match their newest changelogs; sk-doc/057 is uncommitted in the working tree and absent from `origin/main`
- [x] T021 cli-opencode `-pro` slugs, per REQ-009 (`cli-opencode/references/cli-reference.md` lines 141, 187 and 244; `cli-opencode/references/providers-and-models.md` lines 62 to 67): fallback option A becomes `openai/gpt-6-sol --variant high`; the `--model` row lists only served slugs; the GPT-6 grid stops presenting `-pro` as selectable, and the slug count follows. Evidence: the grid reads two personas by two speed tiers, four slugs, no Pro tier; `git grep -nE 'gpt-6-(luna|sol)-pro'` over living docs has no hit
- [x] T022 cli-codex CX-002, per REQ-010 (`cli-codex/manual-testing-playbook/cli-invocation/gpt-5-5-model-lock.md`): the loop becomes `for m in gpt-6-luna gpt-5.6-terra gpt-6-sol`; step 4 reads `/tmp/cli-codex-cx002-gpt-*.txt`; the default sentence names `gpt-5.5` as the skill default and `gpt-6-luna` as the fan-out fallback. Evidence: the loop and step 4 read as specified, and each loop output matches the glob
- [x] T023 cli-codex playbook default and alternates claims, per REQ-010 (`cli-codex/manual-testing-playbook/manual-testing-playbook.md` lines 72, 213 and 221; `cli-invocation/default-invocation.md`, if it claims `gpt-6-luna` as the default): the alternates list `gpt-6-luna`, `gpt-5.6-terra` and `gpt-6-sol` once each, and the default follows `SKILL.md`. Evidence: `git grep -n 'documented default'` shows only `gpt-5.5` or `medium` defaults; CX-001 was rebuilt from its pre-sweep text
- [x] T024 cli-codex Terra ceiling to `ultra`, per REQ-011 (`cli-codex/SKILL.md` line 233, `cli-codex/README.md` line 153, `cli-codex/references/providers-and-models.md` lines 53 and 97). Evidence: those four lines and `assets/prompt-templates.md` line 39 say `ultra`; Sol is no longer called the only model reaching it
- [x] T025 cli-pi PI-017, per REQ-012 (`cli-pi/manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md` line 46): run the scenario's free `sed` and `rg` steps and paste their real output into the captured cell, dated; the expected cell names the ten current `PI_SUPPORTED_MODELS` ids and `PI_DEFAULT_MODEL` `deepseek-v4.1-flash`; the live-smoke part stays marked not re-run. Evidence: the `sed -n '210,251p'` and `rg` steps ran on 2026-09-23; ten ids, `PI_DEFAULT_MODEL: PiSupportedModel = 'deepseek-v4.1-flash'`, and no `auto` model value
- [x] T026 cli-pi xiaomi section, per REQ-012 (`cli-pi/references/providers-and-models.md`): `mimo-v2.6-pro-ultraspeed` is out of the `.pi/settings.json` picker but dispatches with an explicit `--model`. Evidence: Pi's `docs/settings.md` scopes `enabledModels` to startup selection and cycling; `pi --list-models mimo-v2.6` lists ultraspeed under `xiaomi`
- [x] T027 `.pi/custom-providers.md` line 88, per REQ-012: the `gpt-6-luna` row states one verification status, dispatch-verified 2026-09-23. Evidence: "Catalog-listed 2026-09-23 and dispatch-verified the same day"; no "not yet dispatch-verified" remains in `.pi` or cli-pi
- [x] T028 [P] One version bump and one changelog entry each for cli-opencode, cli-codex and cli-pi, per REQ-014. The cli-codex entry corrects the released Terra line: ceiling `ultra`, and `gpt-6-astra` is listed by Codex but stays outside the roster. Evidence: 1.4.10.0, 1.9.2.0 and 1.5.8.0 in `SKILL.md` frontmatter, each with a matching `changelog/v<version>.md`
- [x] T029 Changelog format, per REQ-015. Blocked on sk-doc/057: if it is committed, confirm this packet's eight changelogs match its compact shape; if not at closure, conform them to the template at `HEAD`. Evidence: 057 is still uncommitted, so all eight follow the `HEAD` compact shape: summary, spec-folder line, What Changed, Files Changed, Upgrade
- [x] T030 Regenerate the Hermes mirror of every `SKILL.md` Phase 4 edits (at least cli-codex) into a scratch output directory and copy back only those mirrors, per REQ-014. Evidence: each regenerated mirror differed from its committed copy only by the bump and the Terra line; the check fell from 4 drifted to 1, deep-ai-council, untouched
- [x] T031 This packet, per REQ-013: T018 and the implementation summary record Codex `gpt-6-luna` (`OK`, 16 s, 18,217 tokens) and OpenCode `openai/gpt-6-luna` (`OK`, 49 s, 19,612 tokens); the `-pro` limitation is retired once T021 lands; the picker change is recorded. Evidence: `implementation-summary.md` Verification, Known Limitations and Phase 4 section
- [x] T032 Verify: re-run each finding's check at the Phase 4 commit (`git grep -nE 'gpt-6-(luna|sol)-pro'` over living cli docs; the CX-002 loop and glob; `git grep -n 'documented default'` in the cli-codex playbook; the Terra ceiling lines; `.pi/custom-providers.md` line 88; the PI-017 row), then the frontmatter version gate, `sync-skills-hermes.cjs --check` and `validate.sh --strict`. Evidence: `implementation-summary.md` Phase 4 rows; gate exit 0; validate `RESULT: PASSED`
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Xiaomi Provider Removal

Source: the operator, 2026-09-23: MiMo goes through LLM Gateway only on Pi and OpenCode, with the change reaching docs, config and the fan-out runtime. Skill paths are under `.skilled/skills/cli-external-orchestration/`; runtime paths under `.skilled/skills/system-deep-loop/runtime/`.

- [x] T033 Re-baseline before any edit: the six runtime suites (`executor-config`, `fanout-run`, `combo-matrix`, `fanout-merge`, `executor-audit`, the cli-codex stress adapter) and `npm run typecheck`; the current version and newest changelog of cli-pi, cli-opencode and cli-hermes; `.pi/settings.json` `enabledModels`; the `llmgateway` MiMo row in `pi --list-models mimo-v2.6`. Evidence: suites 391 passed, 1 skipped, exit 0, 217 s; typecheck exit 0; cli-pi 1.5.8.0, cli-opencode 1.4.10.0, cli-hermes 1.0.2.0, each matching its newest changelog; `enabledModels` held `xiaomi/mimo-v2.6-pro`; `llmgateway/mimo-v2.6-pro` listed
- [x] T034 Runtime, per REQ-016 (`lib/deep-loop/executor-config.ts`, `scripts/fanout-run.cjs`): drop `mimo-v2.6-pro-ultraspeed` from `PI_SUPPORTED_MODELS` and `PI_ALLOWED_MODELS`; map `mimo-v2.6-pro` to `llmgateway` in `PI_MODEL_PROVIDERS` and drop the ultraspeed entry; correct the map's stale "GPT-5.6 tunes" comment. Evidence: both copies hold nine ids; the builder refuses ultraspeed and builds `llmgateway/mimo-v2.6-pro`
- [x] T035 Tests, per REQ-016 (`tests/unit/executor-config.vitest.ts`, `tests/unit/fanout-run.vitest.ts`): the Pi roster expects nine ids, the provider map expects `llmgateway` for MiMo, and the Hermes roster test stops calling Hermes Pi's roster minus ultraspeed. Evidence: T045 suite run
- [x] T036 cli-pi, per REQ-017 (`SKILL.md`, `references/providers-and-models.md`, `manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md`, `manual-testing-playbook/hook-extension-layer/extension-auto-discovery.md`): no `xiaomi` section or ultraspeed row; the LLM Gateway MiMo row is the fan-out route; PI-017 expects nine ids. Evidence: PI-017's `sed -n '210,252p'` re-captured nine ids on 2026-09-23
- [x] T037 `.pi`, per REQ-018 (`.pi/settings.json`, `.pi/custom-providers.md`): read the settings first, then drop `xiaomi/mimo-v2.6-pro` from `enabledModels`; the gateway MiMo row describes itself as the fan-out route. Evidence: the file was re-read immediately before the edit; it still parses as JSON
- [x] T038 cli-opencode, per REQ-017 (`SKILL.md`, `README.md`, `references/cli-reference.md`, `references/providers-and-models.md`, `assets/prompt-templates.md`, `assets/prompt-quality-card.md`, `manual-testing-playbook/multi-provider/variant-levels-comparison.md`): no `xiaomi/` or `xiaomi-token-plan-ams/` route, the provider count follows, and MiMo examples use `llmgateway/mimo-v2.6-pro`. Evidence: the T045 residue search; the new pre-flight check matches `opencode providers list` on this machine
- [x] T039 cli-hermes, per REQ-019 (`SKILL.md`, `manual-testing-playbook/manual-testing-playbook.md`): the roster is described as the seven gateway ids, without reference to Pi's ultraspeed. Evidence: both lines now call the seven Pi's bare literals
- [x] T040 Live smoke, per REQ-020: one turn through `pi --model llmgateway/mimo-v2.6-pro` replies `OK`. Evidence: fan-out-built command, exit 0, `OK`, 11 s
- [x] T041 [P] One version bump and one changelog each for cli-pi, cli-opencode and cli-hermes, per REQ-021. Evidence: 1.5.9.0, 1.4.11.0 and 1.0.3.0 with matching changelogs
- [x] T042 Changelog shape, per REQ-015: sk-doc/057 is committed, so every changelog this packet created follows its compact shape (summary, spec-folder line, What's New at a Glance, Upgrade). Evidence: 057's `check-changelog-structure.py` passes all eleven with 0 violations
- [x] T043 Regenerate the Hermes mirrors of cli-pi, cli-opencode and cli-hermes into a scratch directory and copy back only those, per REQ-021. Evidence: each diff held only the bump and the Phase 5 lines; the check drifts only deep-ai-council
- [x] T044 This packet: the implementation summary records Phase 5, its evidence and what it left adjacent. Evidence: its Phase 5 section, verification rows and limitations 8 to 10
- [x] T045 Verify: the Xiaomi residue search over cli-pi, cli-opencode, `.pi/settings.json` and the Pi fan-out code; the six suites and typecheck against T033; the frontmatter version gate; `sync-skills-hermes.cjs --check`; `validate.sh --strict`. Evidence: no route-shaped hit; 391 passed, 1 skipped, exit 0 against the same baseline; typecheck exit 0; gate exit 0; validate `RESULT: PASSED`
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Recorded Follow-ups

Source: the operator, 2026-09-23, asking for all six items Phase 5 left open, implemented by `gpt-6-luna` at `xhigh` (fast tier) through cli-codex with MiMo v2.6 Pro at `high` through cli-pi as fallback, and reviewed by this session. `[D#]` marks a delegated dispatch; the plan's Phase 6 section gives each brief's content. Skill paths are as in `spec.md` §3.

- [x] T046 Re-baseline before any edit: the six runtime suites and `npm run typecheck`; the council `orchestrate-session-cli` suite (20/21 when planned, run from `system-deep-loop/deep-ai-council`) and the model-benchmark `remediation` suite (34/35 when planned, run from `deep-improvement/scripts`); each Phase 6 skill's current version and newest changelog; `sync-skills-hermes.cjs --check`. Evidence: six suites 391 passed, 1 skipped, exit 0, 202 s; typecheck exit 0; council 20/21 and remediation 34/35, each failing only on the `deepseek-v4-flash` fixture; `sweep-isolation` 15/15; versions cli-opencode 1.4.11.0, cli-codex 1.9.2.0, cli-claude-code 1.5.1.0, cli-pi 1.5.9.0, deep-ai-council 2.4.1.0, deep-improvement 1.17.1.0, system-deep-loop 3.0.0.0, each matching its newest changelog; mirrors `PASS: 70 Hermes skill copies in sync`; the three compiled contracts regenerate byte-identical from their current sources
- [x] T047 [D1] cli-opencode pre-flight, per REQ-022 (`cli-opencode/references/cli-reference.md` lines 173 to 181). Accept: the new block prints `default=1 minimax_token=0 minimax_direct=1 llmgateway=1` on this machine. Evidence: Luna, 422 s, exit 0; the diff matches the brief in `cli-reference.md` and `README.md` and touches nothing else; the block extracted from the edited doc and run here printed `default=1 minimax_token=0 minimax_direct=1 llmgateway=1`, exit 0
- [x] T048 Live smokes, per REQ-027: OpenCode `llmgateway/mimo-v2.6-pro` for one turn, and PI-017's live step as written. If PI-017 cannot reach a model as written, a D8 brief corrects its command. Evidence: the fan-out-built `opencode run --model llmgateway/mimo-v2.6-pro --format json ... --variant high` replied `OK`, exit 0, 21 s, 23,318 tokens, $0.0102, working tree unchanged; the fan-out refuses `read-only` for OpenCode, so it ran as `danger-full-access` with a no-tools prompt, as the Luna smoke did. PI-017 as written, with an empty `PI_CODING_AGENT_DIR`, stopped with `No API key found for the selected model`, exit 1, in 3 s. The read-only command the fan-out builds for the default, `pi -p --offline --model llmgateway/deepseek-v4.1-flash --tools read,grep,find,ls --no-extensions --no-skills --no-prompt-templates`, exited 0 in 17 s and listed only `read`, `grep`, `find` and `ls`; D8 moves PI-017 to it
- [x] T062 [D8] cli-pi PI-017, per REQ-027 (`cli-pi/manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md`): the live step runs the read-only default-model command on the operator's agent directory, and the evidence cell records the T048 run. Accept: no `PI_CODING_AGENT_DIR=<tmp>` left in the scenario, and the table row keeps its field count. Evidence: the first Luna run (151 s) changed nothing, because its whole-line patch did not match a substring inside the long table row, and it stopped cleanly. The retry, told to replace substrings in place, took 171 s: 1 file, +4 -4; each of the six replacements occurs once; no `PI_CODING_AGENT_DIR=<tmp>` left; row 46 keeps 13 fields
- [x] T049 [D2] Deep command presentation sources, per REQ-023 (`.skilled/commands/deep/assets/deep-{research,review,ai-council,model-benchmark}-presentation.txt`). Evidence: Luna, 220 s, exit 0; 4 files, 6 lines changed, all as briefed; `grep -i xiaomi` over the four sources finds nothing; one `llmgateway/mimo-v2.6-pro` in each
- [x] T050 Regenerate the three compiled contracts, per REQ-023 (`compile-command-contracts.cjs --command deep/{research,review,ai-council} --write`), after D3 and D7: all three digest the hub `SKILL.md`, and the ai-council contract also digests deep-ai-council's `SKILL.md` and seat-diversity doc. Accept: each contract diff holds only the Phase 6 source lines, their version bumps and the digests. Evidence: `--write` for all three; the word diff across them holds 3 `xiaomi-token-plan-ams/mimo-v2.5-pro` → `llmgateway/mimo-v2.6-pro` swaps and 2 `MiniMax/Xiaomi` → `MiniMax` swaps, every other changed line is a digest (research +5 -5, review +5 -5, ai-council +6 -6); `manifest.jsonl` is unchanged
- [x] T051 [D3] deep-ai-council docs and the three MiMo benchmark profiles, per REQ-023. Evidence: Luna, 171 s, exit 0; 5 files, +7 -7, every line as briefed; no `xiaomi` in the five files; the profiles parse and `sweep-isolation` passes 15/15
- [x] T052 [D4] cli-codex CX-002 and the profile location, per REQ-026: CX-002 and the playbook index read the roster from `providers-and-models.md` §2, and profiles are located as `$CODEX_HOME/<name>.config.toml` files. The `luna-impl` and `sol-verify` rows stay, because both profile files exist. Evidence: Luna, 288 s, exit 0; 3 files, +7 -7; each of the ten briefed replacements occurs once; CX-002's row keeps 12 fields; no "Supported Models" left in cli-codex's living docs; one `[profiles.<name>]` mention remains, the §4 effort note
- [x] T053 [D5] cli-claude-code Fable id and OpenCode provider line, per REQ-026 and REQ-023. Evidence: Luna, 204 s, exit 0; 4 files, +5 -5, each as briefed; no `claude-fable-5` or `Fable 5` left in the living docs; no `xiaomi` in `claude-tools.md`; the comparison row keeps 5 fields; the roster link resolves
- [x] T054 [D6] The council and remediation tests, per REQ-024. Accept: 21/21 and 35/35. Evidence: D6 (Luna, 216 s) changed the three briefed literals; remediation passed 35/35, and council reached 20/21 on a second, masked failure: the test expected no stdin write for any seat but Hermes, while the runner writes whatever input the shared builder returns and the cli-pi builder returns `input: ""` to close stdin. The cli-pi case never reached that line before, because it failed first on the retired model. D6b generalized the assertion to `typeof built.input === "string" ? [built.input] : []`. Its first run was killed by the 30-minute dispatch timeout after the Mac slept, with no edit made; the retry under `caffeinate` (602 s) made the one-line edit. Rerun here: council 21/21, remediation 35/35
- [x] T055 The Sol smokes. Evidence: the operator kept them skipped on 2026-09-23 (`spec.md` §10), so the three Sol routes stay operator-run and nothing was dispatched
- [x] T056 Home config, approved by the operator on 2026-09-23, per REQ-028: copy `~/.codex/config.toml`, `~/.pi/agent/auth.json` and `~/.local/share/opencode/auth.json` to dated backups, then set the Codex model to `gpt-6-luna` and remove each `xiaomi` key. Accept: each file parses and `jq 'keys'` lists no `xiaomi`. Evidence: Pi's store backed up to `auth.json.bak-20260923` (byte-identical), then `xiaomi` removed under Pi's own `proper-lockfile` lock, because Pi re-reads the file under that lock and merges per provider; keys now `cline-pass`, `deepseek`, `minimax`, `openai-codex`, `opencode-go`, `openrouter`, mode 600. OpenCode's store backed up the same way, then `opencode auth logout xiaomi` (exit 0, "Logout successful"); keys now `cline-pass`, `deepseek`, `llmgateway`, `minimax`, `openai`, `opencode-go`, `openrouter`; `opencode models xiaomi` exits 1. `~/.codex/config.toml` backed up the same way while no `codex exec` ran, then `model = "gpt-5.6-luna"` became `model = "gpt-6-luna"`, the only diff line; `max` and `fast` kept; `codex features list` still loads the config, exit 0. Final recheck: all three backups exist; `~/.codex/config.toml` line 2 reads `model = "gpt-6-luna"`; on the final recheck neither store lists `xiaomi`, although a Pi session and `opencode acp` were still running
- [x] T057 [D7] One version bump and one changelog each for the skills Phase 6 edits, per REQ-025, after re-reading each current version. Evidence: D7a (485 s) and D7b (362 s): cli-opencode 1.4.12.0, cli-codex 1.9.3.0, cli-claude-code 1.5.2.0, cli-pi 1.5.10.0, deep-ai-council 2.4.2.0, deep-improvement 1.17.2.0, system-deep-loop 3.0.1.0, one changelog each; each `SKILL.md` edit D7 made is the version line alone; 057's checker `RESULT: PASSED (0 violations)` on all seven
- [x] T058 Regenerate the Hermes mirrors of the touched skills into a scratch directory and copy back only those, per REQ-025. Evidence: `--check` drifted exactly the seven bumped skills and nothing stale; the scratch regeneration's diffs held only the bumps and the Phase 6 lines; only the seven `SKILL.md` mirrors copied back; `PASS: 70 Hermes skill copies in sync`
- [ ] T063 Regenerate the trigger index and its retrieval fixtures from an export of the tree being pushed, as Phase 5 did in `682a192b8d`, because the bumped versions and new changelogs change the corpus
- [x] T064 [D9] Carry the system-deep-loop hub version into its routing metadata. CI's Routing Registry Drift Guard failed on `7d23a6188f`, on both branches, with four `13a-version` failures: `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json` still carried 3.0.0.0 after D7b bumped `SKILL.md` to 3.0.1.0. The local pre-push gate does not run this check. Evidence: Luna, 325 s, exit 0; 4 files, 1 line each, as briefed; `parent-skill-check.cjs` passes on all seven hubs; the three contracts regenerate with one changed line each, the `mode-registry.json` digest; the trigger index regenerates with hash-only changes
- [x] T059 Review record, per SC-007: for every dispatch, the brief, the paths it changed compared with the paths it named, the checks run and the verdict, kept in `implementation-summary.md`. Evidence: `implementation-summary.md` How It Was Delivered carries one row per dispatch, including both retries
- [x] T060 Verify: the Xiaomi route search over the Phase 6 paths; the council and remediation suites; the six runtime suites and typecheck against T046; the frontmatter version gate; 057's `check-changelog-structure.py`; `sync-skills-hermes.cjs --check`; `validate.sh --strict`. Evidence: no `xiaomi` hit in the Phase 6 skill paths outside changelogs, the deep command assets or the seven mirrors, with a positive control that finds the gateway MiMo id; council 21/21, remediation 35/35, `sweep-isolation` 15/15; six suites 391 passed, 1 skipped, exit 0 (228 s), equal to T046; typecheck exit 0; gate exit 0; 057's checker 0 violations on all seven; `PASS: 70 Hermes skill copies in sync`; `validate.sh --strict` `RESULT: PASSED`, 0 errors, 0 warnings
- [ ] T061 Commit Phase 6 as one revertable commit by pathspec and push it to `main` and `skilled/v4.0.0.0`
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Every acceptance criterion `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure gate**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` §4 REQ-001 to REQ-008
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` §3 and §5
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: T001 catalog reads
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Typecheck and the edited suites pass. Evidence: T013
- [x] CHK-011 [P0] No new drift-guard error. Evidence: T015, identical 9-error set
- [x] CHK-012 [P1] Paired roster copies equal. Evidence: the `fanout-run.vitest.ts` pairing tests pass in T013
- [x] CHK-013 [P1] Comments keep the durable WHY and carry no packet ids. Evidence: the only code-comment edits are id swaps inside existing comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Evidence so far: `acceptance-criteria.md` AC-001 to AC-021 Met; AC-022 to AC-028, Phase 6, Unmet
- [x] CHK-021 [P0] `pi --list-models gpt-6` shows the three new routes. Evidence: T014
- [x] CHK-022 [P1] Luna Max persona counts unchanged. Evidence: T012
- [x] CHK-023 [P1] Negative Cursor inputs still rejected. Evidence: `executor-config.vitest.ts` asserts `isCursorModelAllowed('gpt-6-sol-high-fast')` is false and passes in T013
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: `class-of-bug`, a stale id repeated across producers and consumers. Evidence: this row
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed by residue scan. Evidence: T003 and T012
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the allowlists, mirrors, defaults, docs and tests. Evidence: `plan.md` affected-surfaces table; T005
- [x] CHK-FIX-004 [P0] Adversarial inputs covered: the Luna Max personas and the rejected Cursor inputs. Evidence: CHK-022 and CHK-023
- [x] CHK-FIX-005 [P1] Matrix axes listed: runtime (Codex, OpenCode, Pi, Hermes, Claude) by surface (docs, enforcement, tests, config). Evidence: `spec.md` Files to Change covers every cell that exists
- [x] CHK-FIX-006 [P1] Hostile env variant: `SKILL_BENCH_CODEX_MODEL` still overrides the `codex-dispatch.cjs` default. Evidence: `DEFAULT_MODEL` reads `gpt-6-luna` unset and `gpt-5.5` with the variable set
- [x] CHK-FIX-007 [P1] Evidence pinned to the final working-tree diff. Evidence: every check above ran after the last edit to its surface
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; the gateway entries reuse `${LLMGATEWAY_API_KEY}`. Evidence: the new model object carries no key; the `openai-codex` routes use the existing Pi login
- [x] CHK-031 [P0] No allowlist widened beyond the renamed ids. Evidence: every allowlist hunk is a one-for-one swap
- [x] CHK-032 [P1] The Hermes roster stays closed at seven ids. Evidence: `HERMES_SUPPORTED_MODELS` and `HERMES_ALLOWED_MODELS` hold seven ids each
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized. Evidence: `validate.sh --strict` PASSED
- [x] CHK-041 [P1] Verification claims attached to renamed ids restated honestly. Evidence: T007, and Phase 4's T021, which replaced the Pro-slug caveat with a grid of served slugs
- [x] CHK-042 [P2] Changelogs written for every bumped skill. Evidence: T010 and T028
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: working files lived in the session scratchpad outside the repository
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: the packet `scratch/` holds only its `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-23, for Phases 1 to 5. Phase 6 is planned and not yet verified.
<!-- /ANCHOR:summary -->

---
