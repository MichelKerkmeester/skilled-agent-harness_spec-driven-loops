# Deep Review Iteration 3 — Maintainability

## Dimension

D4 Maintainability — what the kill-list deletion and the Jev-arm strip left behind in the surviving tree. Swept: orphaned exports, helpers, constants, CLI flags, report lines and stub branches in the five named survivors (`replay-helpers.mjs`, `score-pi-transport.mjs`, `leaf-route-replay.cjs`, `hvr_reader_lens.py`, `score-verifier-labeled-set.cjs`) and their tests; fixture or data files under `.skilled` whose only reader was a deleted test; section headings, numbering, empty sections or index rows a removed entry could have orphaned; `package.json` scripts, vitest and node test globs, and `.github` workflows naming a deleted file; count claims invalidated by removed entries. Read-only review; nothing outside the `review/` run directory was modified. `specs/`, `changelog/` and labeled data rows were excluded per the brief.

## Files Reviewed

- `.skilled/skills/cli-classifier/benchmark/pi-transport/replay-helpers.mjs:44,215,255`; `score-pi-transport.mjs:34,39,1344`; `tests/score-pi-transport.test.mjs:19,319` — export surface and every consumer of the moved helpers.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:1` and `scripts/tests/leaf-route-replay.test.cjs:1` — Jev-arm strip aftermath.
- `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py:1` and `scripts/tests/test_hvr_reader_lens.py:1` — Jev-arm strip aftermath.
- `.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs:390,392` and `score-verifier-labeled-set.test.cjs:302,309`; `.skilled/hooks/goal/README.md:124` — dropped Jev gate line versus the surviving gate line and its documentation.
- `.skilled/skills/system-skill-advisor/leaf-manifest.json:46`, `leaf-aliases.json:209` (plus all 22 leaf registries fleet-wide) — R1-P1-001 resolution check.
- Fixture directories adjacent to the deleted tests: `sk-create-skill/scripts/tests/fixtures/`, `system-deep-loop/runtime/tests/fixtures/`, `system-skill-advisor/runtime/tests/parity/fixtures/`, `sk-create-goal/scripts/tests/fixtures/`, `sk-create-with-human-voice/scripts/tests/fixtures/`.
- Runner and entry configs: `.skilled/skills/system-spec-kit/runtime/vitest.config.ts:16`, `.skilled/skills/system-spec-kit/vitest.config.ts:41`, `.skilled/skills/system-deep-loop/runtime/vitest.config.ts:17`, `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:27`, `.skilled/vitest.config.bin.ts:7`, every `package.json`, `tsconfig*.json` and `.github/workflows` file.
- Post-deletion count and numbering claims: `system-deep-loop/runtime/feature-catalog/feature-catalog.md:19,27`, `system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:39,106`, `system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:31`, `system-skill-advisor/feature-catalog/feature-catalog.md:22`, `system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:33,130`, `sk-create-skill/manual-testing-playbook/manual-testing-playbook.md:204`, `sk-create-with-human-voice/manual-testing-playbook/manual-testing-playbook.md:207`.

## Findings by Severity

### P0 — none

No live script imports or spawns a deleted file; nothing regressed.

### P1 — none new; carried R1-P1-001 resolved

**R1-P1-001 — RESOLVED.** The generated leaf registries no longer cite the four deleted leaf docs.
- Evidence: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` (check mode, no `--fix`) exits `0` with `checked=14 passed=14 failed=0`, and both `.skilled/skills/system-skill-advisor/leaf-manifest.json` and `leaf-aliases.json` contain zero matches for `tie-break-eval` or `suggested-order-eval`.
- Provenance: commit `424cf11a5e` regenerated the pair after iteration 2; the fix is durable in the committed tree.
- Recorded as a `resolution` record plus `resolvedFindings:["R1-P1-001"]` in the appended iteration record; no new defect.

### P2 — none new

The carried **R2-P2-001** (two sk-doc catalog docs claim a 56-row leaf-route gold while the replay reports 59) remains open and unchanged. Per the iteration brief it is not re-reported; the session stays advisory (`hasAdvisories=true`, P2-only).

Clean sweep evidence (checked, no finding):

- **Moved helpers**: all nine exports of `replay-helpers.mjs` are consumed — `nearestRank` 8, `rotations` 3+4, `optionArgs` 3+6, `readProbabilities` 2, `topKey` 3, `spawnCall` 3, `writeCall` 6, `jevGate` 2, `loadCensus` 5+6 (uses in `score-pi-transport.mjs` + its test). No dead helper surface.
- **Stripped survivors**: no top-level definition occurs fewer than twice in `leaf-route-replay.cjs`, `hvr_reader_lens.py` or `score-verifier-labeled-set.cjs`; all three parse (`node --check` / `ast.parse`); zero `jev`/`deem` tokens and zero `--jev`/`--deem` flags survive in them and their tests. The only `--jev` mention is the test that pins it as an unknown flag (`score-verifier-labeled-set.test.cjs:208`), which is intent, not residue. The surviving gate line is still emitted (`:392`) and still asserted (`test:309`), so the README prose "stop or gate line" stays accurate.
- **Fixtures**: the deleted fixture trees went with their deleted tests; every fixture file in the adjacent directories keeps at least one live reader (`047-020-recorded-picks.jsonl` → `score-clarify-default.test.cjs:993`; `authorized-ledger-test-helper.ts` → four live unit suites; `goal-fixtures.cjs`, `blocked-stop-session`, `policy-plan`, `council-value` all multi-referenced). No `readers=0` file.
- **Runner/config entries**: directory-level vitest globs (`tests/**/*.{vitest,test}.ts`, `runtime/tests/**/*.vitest.ts`, `bin/**/*.vitest.ts`) simply stop matching the removed tests; no `package.json`, `tsconfig`, vitest config or workflow names a deleted scorer or test.
- **Doc structure**: section sequences are contiguous across every touched catalog, playbook, README and SKILL.md (runtime playbook 1..17, deep-review playbook 1..17, advisor playbook 1..18, spec-kit 1..8 + 7.x, runtime catalog 1..13, spec-kit catalog 1..11, advisor catalog 1..8, sk-doc catalogs/READMEs 1..N); no heading immediately followed by another heading (empty section), no orphaned index rows.
- **Count claims**: all recomputed against disk and the deletion commit diffs — runtime catalog `55`=55 and its scoring row moved `5→2`; runtime playbook `55`=55 scenario files; deep-review playbook `55`=55; advisor catalog `45→43` with scorer-fusion `8→6`; advisor playbook `49→47` (fix commit `d4d3d0e0b4`); sk-doc `8` and hvr `10` match their section ranges. Every affected total was updated inside the deletion commits.

## Traceability Checks

| Check | Result | Evidence |
|---| --- | --- |
| `spec_code` | pass | Deletion diffs reconcile with disk; the three stripped survivors parse and hold no Jev token or removed flag |
| `checklist_evidence` | pass | No packet checklist names a deleted artifact; the scope-file list was reviewed end to end |
| `skill_agent` | pass | SKILL.md, README and command searches clean; surviving gate-line prose matches the code |
| `agent_cross_runtime` | pass (carried) | Repo-wide basename sweep found no deleted file in any runtime mirror |
| `feature_catalog_code` | partial | R2-P2-001 open (56 vs 59 leaf-route gold rows); every other post-deletion count reconciles with disk |
| `playbook_capability` | pass | Scenario totals verified on disk (runtime 55, deep-review 55, advisor 47, sk-doc 8, hvr 10); no deleted scorer or scenario named |

## Verdict

PASS — no new P0 and no new P1 this iteration. R1-P1-001 is resolved with check-mode gate evidence (`checked=14 passed=14 failed=0`, zero stale leaf names), and the maintainability sweep found no orphaned code, fixture, config entry, numbering gap or count drift attributable to the deletion. R2-P2-001 remains the single open P2, so the session carries advisories; the iteration verdict is PASS.

## Next Dimension

None — iteration 3 of 3. Correctness (iteration 1), traceability (iteration 2) and maintainability (iteration 3) are all covered; hand the run to synthesis.

Review verdict: PASS
