{"timestamp":"2026-09-11T18:47:41.794Z","runtime":"claude","status":"ok","freshness":"stale","durationMs":2276,"cacheHit":false,"errorDetails":"SOURCE_NEWER_THAN_SKILL_GRAPH","skillLabel":"sk-code"}
# Verdict: the lane is retired at its core, but the claim "gone from every surface that could reach it" is **false**

The command front doors, directories, and dedicated libraries are genuinely gone (verified below), but the retirement left five classes of live residue: **still-reachable library surface, still-running code that now fails, two now-broken sk-doc toolchains, a CI-visible dangling-link break, and stale pinned tests/baselines**. Two naming traps also caught earlier sweeps — including mine — as predicted: the space spelling `"skill benchmark"` (invisible to `skill-benchmark`/`skill_benchmark` greps) and camelCase (`skillBenchmark`).

---

## 1. Reachability — what still resolves

**Registry/command layer: genuinely clean.** `system-deep-loop/mode-registry.json` lists exactly the five surviving modes, no `skill-benchmark` (observed earlier this session); `hub-router.json` carries no deep lane signal; all five runtime front doors gone; no lane dirs under `deep-improvement/` (`ls` of `deep-improvement/scripts` shows only `agent-improvement/`, `model-benchmark/`, `shared/`, `lib/`, `check-agent-mirror-sync.cjs`, config — verified this session).

**But three live surfaces still resolve the lane:**

| Surface | Where | What it does |
|---|---|---|
| Runtime library, first-class | `runtime/lib/blinded-adjudication/contracts.ts:18` (`SKILL_BENCHMARK: 'skill-benchmark'`), `:64`, `mode-adapters.ts:108,167`, `index.ts:70,75` (`adaptSkillBenchmarkVerdict`, `createSkillBenchmarkAdjudicationRequest`), `event-registry.ts:125` | Exported public API treats the retired lane as a decision kind, found only via camelCase grep |
| Runtime reducer actively emits it | `deep-improvement-common-reducers/deep-improvement-common-reducer.ts:700` — `emptyModeStatus('skill-benchmark')` | **Every** common reduction emits a status record for the retired lane; schemas mirror it at `projection-schema.ts:95,101`, `ledger-schema.ts:521`, `ledger-types.ts:33`, sealed-artifact types `:296,372` |
| Advisor identity keyword | `system-deep-loop/graph-metadata.json:112-113` — `"model benchmark", "skill benchmark"` | Space-spelling trap: graph-metadata still advertises "skill benchmark" as a trigger phrase/keyword. `regenerate-skill-derived.cjs:37-47,108-111` shows trigger_phrases/keywords are **authored** fields the regenerator deliberately preserves — so `ci-skill-derived-freshness.cjs` will never prune it. The same file's `key_topics` (126-127) *was* updated to `agent-improvement`/`model-benchmark` only — internally inconsistent |
| Legacy projection | `runtime/lib/legacy-projections/legacy-projection-manifest.ts:178-180` — `surfaceId: 'skill-benchmark-output'`, `legacyWriter: 'skill-benchmark lane'` | Marked `retain-legacy-input`; deliberate, but still registered |
| Write-set census | `runtime/lib/write-set-conflict-graph/shipped-census.ts:107,109,516,543,547,554,558`; `graph.ts:63`; `types.ts:14` | `007-skill-benchmark` workstream, `mode:skill-benchmark`, deleted script paths |
| sk-doc registry (deliberate) | `sk-doc/mode-registry.json:306` + `hub-router.json:302` — `"skill-benchmark"` | The preserved **authoring** mode's alias/keyword. Net effect: the bare term still routes — now only to sk-doc's `/create:benchmark` |

**Silent-wrong behavior (worst kind).** `loop-host.cjs` `VALID_MODES = {agent-improvement, model-benchmark}`; unknown mode warns and **defaults to agent-improvement** (verified earlier). Two live docs still instruct `--mode=skill-benchmark`:
- `sk-code/benchmark/README.md:52-55, 61-66` (router + live quick-start)
- `sk-create-benchmark/assets/skill-benchmark/skill-benchmark-readme-template.md:133-146`

Following them does not fail — it silently benchmarks the **wrong lane**.

## 2. Dangling references (surviving files → deleted paths)

**Link-form (CI-visible, see §3):** `sk-doc/benchmark/README.md:62-63`, `sk-prompt/benchmark/README.md:70-71`, `cli-external-orchestration/benchmark/README.md:62-63`, `cli-external-orchestration/cli-claude-code/benchmark/README.md:60`, `sk-code/benchmark/README.md:145` (deleted `/deep:skill-benchmark`), `sk-create-manual-testing-playbook/SKILL.md:309`, `sk-create-benchmark/SKILL.md:668`, `sk-create-benchmark/references/skill-benchmark/serving-snapshot-schema.md:211-213,223`, `.../skill-benchmark-storage-guide.md:52,53,138,172,227-231,248` — all targeting the deleted `deep-improvement/{references,scripts}/skill-benchmark/*` or the deleted command. (Static hand-reproduction of the guard's algorithm, not an execution — caveat in final section.)

**Backticked/prose path refs (invisible to the link guard, but still wrong instructions):**
- `sk-code/ROUTER.md:311` — tells readers to run the deleted `skill-benchmark/tests/sk-code-router-sync.vitest.ts`; the sk-code router block is now **unguarded**
- `sk-code-opencode/references/shared/alignment-verification-automation.md:112` — calls that same deleted test "the equality authority" (new find; not just prose — a contract claim)
- `sk-code-quality/SKILL.md:140`, `sk-code-mobile-cli/SKILL.md:89` — justify design by "the deterministic skill-benchmark router-replay"
- `sk-create-skill/references/skill/upgrading-a-skill-to-v4.md:222`, `references/parent-skill/compiled-routing-architecture.md:66`, `parent-skills-nested-packets.md:255`, `parent-hub-router-schema.md:30` — invoke/name deleted lane scripts and `/deep:skill-benchmark`
- `sk-create-manual-testing-playbook/SKILL.md:285` + `assets/manual-testing-playbook-snippet-template.md:55-64,170-171` — "Lane C" contracts
- `sk-code/benchmark/reports/2026-06-02--d4r-live--live/README.md:32`, `sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md:54`, `sk-doc/manual-testing-playbook/manual-testing-playbook.md:92`, `.../compiled-routing/bundle-rules-compiled-routing.md:73`, `sk-design/sk-design-chart/.../form-choice-and-the-diagram-boundary.md:51-52` — run deleted `run-skill-benchmark.cjs`/`router-replay.cjs`
- `sk-create-command/assets/command-contract.json:276` — the machine-readable `deep` family contract still lists `/deep:skill-benchmark` in `invocation_aliases`. Checked the consumer (`generate-command-routers.cjs`): it does **not** read `invocation_aliases`, so nothing flags this, but the asset advertises a deleted command
- `sk-doc/sk-create-skill/scripts/init_skill.py:130` — the **scaffolder** still emits `run-skill-benchmark.cjs` into every new skill's benchmark README
- 10 `sk-doc/manual-testing-playbook/holdout/*.md` files — describe scenarios as "scored by the routing-gold and skill-benchmark gates"
- `deep-review/README.md:176` — live mode README: "deep-improvement … across three lanes: agent improvement, model benchmark and **skill benchmark**" (space-spelling)

## 3. Broken dependents (what actually fails)

**a) Three sk-doc scripts crash — the packet's open question, now confirmed at exact lines.** `_args.cjs`, `build-report.cjs`, `compiled-routing-parity.cjs` were lane modules consumed as a shared library; all are deleted:
- `sk-doc/sk-create-benchmark/scripts/render-serving-snapshot.cjs:47-50` — top-level `require` of deleted `compiled-routing-parity.cjs` → **load-time MODULE_NOT_FOUND**; `:385` also requires `_args.cjs` in its CLI block
- `sk-doc/sk-create-benchmark/scripts/archive-compiled-routing.cjs:34-41` — top-level requires of deleted `build-report.cjs` + `compiled-routing-parity.cjs`, and it requires the broken snapshot module at `:33`; `:224` `_args.cjs`
- `sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs:388-390` — CLI entry `require`s deleted `_args.cjs` → crashes when run as a command (module exports still importable; its test at `sk-create-skill/scripts/tests/validate-compiled-routing-scenarios.test.cjs:19` requires the module, not the CLI)

All three are documented as working (`archive/render` README `sk-create-benchmark/scripts/README.md:30-34`; `SKILL.md:661`; manual-testing scenario **BMR-006** `evidence-and-boundaries/archive-compiled-routing-safely.md:43-50` runs them directly). Counting `init_skill.py` (the emitter), this resolves the packet's "four sk-doc scripts". The "one sk-code drift-guard script" resolves to the deleted `sk-code-router-sync.vitest.ts`, still referenced from §2.

**b) A live hub drift-checker is now permanently red.** `runtime/scripts/check-documentation-drift.cjs:42-50` computes `lanes = modes.where(packet === 'deep-improvement')` from `mode-registry.json`; `:116` fails on `counts.lanes !== 3`. Post-retirement the count is 2 → `lane count mismatch: 2`, exit 1. Documented in `runtime/scripts/README.md:38`; not wired to CI (grep finds no other consumer) but it is hub tooling that can no longer pass.

**c) CI-visible: markdown link integrity.** `.github/workflows/markdown-link-integrity.yml` runs `check-markdown-links.cjs` whole-repo on PRs touching `.opencode/skills/**`; the guard strips code blocks and only sees real `](path)` links; `benchmark/` dirs are **not** excluded. The §2 link-form list sits in checked roots and is not allowlisted → the gate would exit non-zero.

**d) Two sk-doc baseline tests fail** (not CI-wired — only `naming-standard-guard.yml` runs pytest):
- `scripts/tests/test_readme_manifest.py` vs `code-folder/durable-directory-manifest.json:522,542,543,598-600` (six deleted dirs frozen in the equality set → "not reproducible")
- `scripts/tests/test_readme_verdict_parity.py` vs `baseline-readme-verdicts.json:7117,7127,7347,7357,7927,7937,7947` (seven deleted READMEs → `File not found`)

**e) Runtime vitest suites still pin retired-lane behavior** (they pass *because* the library surface in §1 remains): `deep-improvement-common-ledger-schema.vitest.ts:912` (asserts the retired variant does **not** throw), `agent-improvement-ledger-schema.vitest.ts:1042,1070`, `blinded-adjudication.vitest.ts:40,1120,1126`, `write-set-conflict-graph.vitest.ts:729` (hard-order edge to `007-skill-benchmark`). Plus two plugin guard tests with hermetic fixture registries (`plugins/tests/system-deep-loop-guard.test.cjs:37,111,125`; `claude-task-dispatch-guard.test.cjs:49,168,185`) — stale content that by construction cannot detect registry drift.

## 4. Counts and indexes

- `check-documentation-drift.cjs:115-116` — `families !== 4` passes; `lanes !== 3` now false (§3b).
- `deep-review/README.md:176` — "three lanes" claim contradicts the registry.
- `description.json` — "five modes across four workflow families" (correct); `mode-registry.json` verified five.
- `runtime/scripts/README.md:38` — still describes the drift check as functional.
- `sk-create-benchmark/scripts/README.md` + `SKILL.md:661` — advertise broken scripts as runnable.

## 5. Over-removal check

**No over-removal found.** Preserved as claimed: 554+ `skill-benchmark-report.*` files across other skills' `benchmark/reports` (sampled in many skills), the `036-.../fixtures/skill-benchmark-live/` spec fixture, changelogs, `specs/` packets, and the entire sk-doc `sk-create-benchmark` authoring family (assets/references/scripts intact). One **under**-removal consequence: deleting `sk-code-router-sync.vitest.ts` removed the only guard for sk-code's router block, and two docs still call it the authority.

## 6. Generated artifacts

- skill-advisor tree + command-bridge projection: verified clean of both spellings (earlier sweep).
- `graph-metadata.json` derived block: consistent by the gate's own rules, but that is precisely the bug — the freshness gate only prunes dead structural paths and preserves authored keywords, so "skill benchmark" survives regeneration untouched. The claim "registration in graph metadata was removed/deprecated" holds for structural fields, not for the keyword.
- `mode-registry.json`/`hub-router.json` version bumps consistent with regeneration; `routing-registry-drift.yml` would not catch any of the above (its checkers pass on this tree by construction).

## What I could not check

No execution tool exists in this environment — everything above is static analysis of source. The claimed crashes (MODULE_NOT_FOUND), the loop-host fallback, the CI exit codes, and the two pytest failures are **traced from code, not run**; each conclusion includes the exact line path so a runtime run can confirm in minutes. I also could not verify the full 554-file preservation count or diff against git history; I sampled instead.

**Bottom line:** core retirement is real (registries, commands, directories, dedicated libraries). The residual set is: 3 crashed sk-doc tools + 1 scaffold emitter, 1 silently-wrong run instruction in a preserved template and sk-code's README, 1 red hub drift-checker, 1 CI-visible link break, 2 failing non-wired baselines, 5+ test files pinning the lane, and a still-first-class runtime library surface (adjudication enum/exports, reducer output, legacy manifest, write-set census) plus an authored advisor keyword. Nothing further for you to run; this was read-only, nothing written or committed.
