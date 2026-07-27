### F1 — CAT-1: Test file `detector-regression-floor.vitest.ts.test.ts` is never collected by vitest (malformed extension) and has no importer
**Path:** `.opencode/skills/system-spec-kit/scripts/tests/detector-regression-floor.vitest.ts.test.ts`
**Evidence:** The vitest config `include` glob is `scripts/tests/**/*.vitest.ts` (`.opencode/skills/system-spec-kit/vitest.config.ts:7-11`), which matches files whose name ends in `.vitest.ts`. This file's name ends in `.vitest.ts.test.ts`, so vitest never collects it. No `*.vitest.ts` file imports it (grep for `detector-regression-floor` across `**/*.vitest.ts` under `system-spec-kit` returns zero matches). The file's own imports are otherwise valid — `../../mcp-server/lib/search/deterministic-extractor.ts` and `../../mcp-server/lib/search/evidence-gap-detector.ts` both exist on disk — so the only defect is the trailing `.test.ts` suffix that hides it from the runner. The intended name was `detector-regression-floor.vitest.ts` (the spec that created it, `026-graph-and-context-optimization/007-detector-provenance-and-regression-floor`, lists it under that name).
**Verify:**
```bash
ls .opencode/skills/system-spec-kit/scripts/tests/detector-regression-floor.vitest.ts.test.ts
grep -A4 'include' .opencode/skills/system-spec-kit/vitest.config.ts
ls .opencode/skills/system-spec-kit/scripts/tests/*.vitest.ts   # does NOT list the .test.ts file
grep -rl 'detector-regression-floor' .opencode/skills/system-spec-kit --include='*.vitest.ts'   # empty
```
**Blast radius:** Renaming to `detector-regression-floor.vitest.ts` would add two new `it()` cases ("keeps deterministic extractor provenance honest and output-stable", "keeps evidence-gap detector labelled as heuristic and preserves frozen outcomes") to the suite — if either frozen outcome has drifted since the file was hidden, the rename will surface a real regression. Low risk otherwise; the file imports only existing modules.

---

### F2 — CAT-2: `sk-code/benchmark/fixtures/sk-code/` legacy fixtures the owning README marks superseded, with no live caller
**Path:** `.opencode/skills/sk-code/benchmark/fixtures/sk-code/` (4 files: `sk-code-loadspeed-001.{private,public}.json`, `sk-code-motion-002.{private,public}.json`)
**Evidence:** The owning README explicitly marks this folder legacy/superseded three times: `.opencode/skills/sk-code/benchmark/README.md:81` (`+-- fixtures/sk-code/   # Legacy synthetic fixtures, superseded by the playbook corpus`), `:89` (`| fixtures/sk-code/ | Two legacy fixtures, no longer the default corpus |`), and `:107` (run-label index row `Status = legacy`). The live successor is the `manual_testing_playbook` corpus (README §1, line 29). No live code references it: a grep for `benchmark/fixtures/sk-code` across `**/*.{ts,cjs,mjs,js,md,sh}` returns only the README itself and entries under `.opencode/specs/` (excluded) — no runner, test, or current run-label passes `--fixtures-dir` at this path. The only recorded consumer is the archived spec `system-deep-loop/z_archive/008-.../009-sk-code-router-benchmarkability`, whose runs targeted `benchmark/2026-06-01--full--router` (itself marked `superseded` in the README index).
**Verify:**
```bash
ls .opencode/skills/sk-code/benchmark/fixtures/sk-code/
grep -n 'fixtures/sk-code' .opencode/skills/sk-code/benchmark/README.md
grep -rn 'benchmark/fixtures/sk-code' .opencode --include='*.ts' --include='*.cjs' --include='*.mjs' --include='*.js' --include='*.sh'   # only README (specs excluded)
```
**Blast radius:** Removing the folder only affects reproducibility of the archived `009-sk-code-router-benchmarkability` spec runs, which already require a `--fixtures-dir` flag and target a superseded outputs dir. The current `router-final`/`live-final` runs use the playbook corpus and do not touch these fixtures. Safe to retire once the archived spec's reproducibility is no longer required.

---

### F3 — CAT-4: `sk-design/benchmark/after-*` run-labels use `report.json`/`report.md` instead of the storage-standard `skill-benchmark-report.json`/`.md`, and three run-labels are unreferenced by the owning README
**Path:** `.opencode/skills/sk-design/benchmark/{after-009,after-012-routing-rigor,after-016-hub-routing,after-018-transport-integration,after-022-coverage-fill}/`
**Evidence:** The storage standard the owning README references (`sk-design/benchmark/README.md:63` cites `skill-benchmark-storage-guide.md`) mandates the canonical pair `skill-benchmark-report.json` + `skill-benchmark-report.md` per run-label (`.opencode/skills/sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md:70-77` and `:147-148`). The five `after-*` folders instead hold `report.json`/`report.md` (e.g. `after-009/report.md:3` reads "Rendered from report.json"), while the sibling run-labels in the same tree — `baseline/` and `after-d3-proxy/` — use the canonical `skill-benchmark-report.json`/`.md`. So one tree carries two conflicting report-filename conventions. Separately, the sk-design README has no run-label index (unlike `sk-code`, `sk-prompt`, and `system-deep-loop` READMEs, which each carry one per the `sk-doc/create-benchmark` template); consequently `after-009/`, `after-012-routing-rigor/`, and `after-d3-proxy/` are unreferenced anywhere inside the `sk-design/benchmark/` tree (grep for those three names within the benchmark dir returns no matches), leaving their status (current/superseded/frozen) undocumented. Only `after-016-hub-routing`, `after-018-transport-integration`, `after-022-coverage-fill` are named in the README (`:43`), and only `baseline/` is named (`:55`).
**Verify:**
```bash
ls .opencode/skills/sk-design/benchmark/2026-07-06--after-009--router/        # report.json, report.md
ls .opencode/skills/sk-design/benchmark/2026-07-06--after-d3-proxy--router/   # skill-benchmark-report.json, skill-benchmark-report.md
ls .opencode/skills/sk-design/benchmark/2026-07-06--after-012-routing-rigor--router/ .opencode/skills/sk-design/benchmark/2026-07-07--after-016-hub-routing--live/ .opencode/skills/sk-design/benchmark/2026-07-07--after-018-transport-integration--live/ .opencode/skills/sk-design/benchmark/2026-07-07--after-022-coverage-fill--live/
grep -n 'after-009\|after-012-routing-rigor\|after-d3-proxy' .opencode/skills/sk-design/benchmark/README.md   # empty
sed -n '70,77p;147,148p' .opencode/skills/sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md
```
**Blast radius:** Renaming `report.json`/`report.md` → `skill-benchmark-report.json`/`.md` must be done as a pair (the `.md` header reads "Rendered from report.json", so the render source reference inside each `.md` also needs updating). Any consumer that scrapes `sk-design/benchmark/*/report.json` by name would break; a grep shows no such consumer outside the benchmark tree itself. Adding a run-label index is documentation-only and non-breaking.
