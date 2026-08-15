# Deep Research: Phase 031 Communication Projection Improvement — Ranked Recommendations

> Canonical deep-research deliverable. Grounded in the current shipped Phase 030 tree (this worktree ships the `localProvider` loader). Source evidence: `research/iterations/iteration-001.md` … `iteration-005.md` and the findings registry.

## 1. METADATA

| Field | Value |
|-------|-------|
| Packet | `specs/cli-external-orchestration/035-improved-communication/031-improvement-research` |
| Session | `bb1ca027-0786-4a43-afce-4317917d4227` (generation 1) |
| Method | 5-iteration deep-research loop, single `cli-opencode` executor, model `opencode-go/deepseek-v4-flash`, convergence threshold 0.05 |
| Stop reason | maxIterationsReached (5 of 5) |
| Iterations | 5 (newInfoRatio: 0.7, 0.7, 0.6, 0.7, 0.7) |
| Findings | F001–F033 (33) |
| Created | 2026-08-15 |

## 2. PROBLEM & PURPOSE

Determine which concrete, ranked improvements should be made to the shipped communication projection and the `sk-communication` skill across four axes: operator UX, documentation, package architecture, and the skill itself. This is a research-only phase; no recommendation is implemented here.

## 3. SCOPE

- In scope: operator enablement/local-provider UX, package docs, the `localProvider` loader + provider/transport/judge design + plugin/wrapper wiring, and the `sk-communication` skill surface.
- Out of scope: implementing any recommendation; modifying shipped runtime, docs, or skill content.
- Critical re-grounding: the prior run's architecture conclusions were STALE (its checkout predated Phase 030). This run re-verified them against the Phase 030 tree.

## 4. METHOD

Five autonomous iterations via `/deep:research:auto`, one `cli-opencode` executor (`opencode-go/deepseek-v4-flash`), fresh context per iteration, externalized state in `research/`, reducer-synced strategy/registry/dashboard, and a coverage graph. Every finding cites the current shipped file(s). The `dist/` build was deliberately not executed (a mutation outside allowed write paths); build consequences were analyzed statically.

## 5. FINDINGS SUMMARY

- **Architecture (Axis 3)**: the Phase 030 loader, the plugin, and `bin/cli-output-wrapper.mjs` are real and wired — the prior run's "absent / structural no-op / never invoked" claims are **stale**. The real frictions are the fresh-checkout `dist/` breakage (both entry points), monorepo-only shipping (config path + wrapper not in the packed artifact), coarse provider-family mapping, and uncached per-message config loading.
- **Operator UX (Axis 1)**: a dead `lmStudioExample` block in the shipped example, no plugin-side activation signal, a verification step that requires hand-creating an unshipped doctor script, and split env-var prefixes for one concern.
- **Documentation (Axis 2)**: the `localProvider` section is duplicated across docs, `docs/install.md` documents a consumer flow that cannot exercise the loader, and there is no linear quickstart.
- **Skill (Axis 4)**: the `src/config/` surface is invisible to the skill router and `package-map.md`; the Smart Router scans only `references/` (one file) and never surfaces the 21 catalog/playbook assets; the advisor-routing smoke capture is stale and documents behavior inverse to the shipped route-exclusion invariant.
- **Negative knowledge**: no persisted manual-scenario evidence exists under `benchmark/reports/` (RUN INDEX empty); `npm run check` is install+build-gated and not verifiable read-only from a fresh checkout.

## 6. DETAILED FINDINGS

### 6.1 Package architecture (re-verified against Phase 030)

- **F001 (P1)** — `dist/` is gitignored and absent in a fresh checkout; both entry points hard-import `../dist/…`. The wrapper's top-of-flow dynamic imports reject when `dist/` is missing (exits 69 even in disabled/passthrough mode); the plugin's static import fails at load. No `prepare`/`preinstall` hook builds it. `[SOURCE: cli-communication-projection/.gitignore; bin/cli-output-wrapper.mjs:12-13,31-32,51-52; .opencode/plugins/mk-communication-projection.js:17-22]`
- **F002 (P1)** — the loader's config file is package-root-relative and `package.json` `files: ["dist","docs"]` excludes the example and any operator file, so a tarball consumer cannot configure a local provider; the plugin import path is monorepo-specific. `[SOURCE: src/config/enablement.ts:12; package.json]`
- **F029 (P1)** — `npm run check` is not green from a fresh checkout and cannot be run green read-only: no package `node_modules`, no `typescript` in workspace `node_modules`, and `build` writes `dist/`. `[SOURCE: cli-communication-projection/package.json; tsconfig.build.json]`
- **F030 (P1)** — a built `dist/` is the single load prerequisite for both entry points; absent it, the plugin never loads and the wrapper exits 69 on all paths. `[SOURCE: mk-communication-projection.js:17-22; cli-output-wrapper.mjs:12-13,51-52,77,121]`
- **F031 (P1)** — the wrapper cannot be consumed from the shipped artifact: no `bin` field, `files` excludes `bin/`, so only the library surface ships; the two-entry-point story is monorepo-local. `[SOURCE: package.json]`
- **F004 (P3)** — per-message sync file I/O: `loadLocalProjectionConfig()` re-reads + parses on every `chat.message`; enablement gate re-reads per call when the env var is unset. `[SOURCE: mk-communication-projection.js:248; src/config/enablement.ts:56-61]`
- **F005 (P3)** — LM_STUDIO / LLAMA_CPP / OPENAI_COMPATIBLE collapse into `createLlamaCppModelRecord`; the wrapper lacks the plugin's kill-switch. `[SOURCE: src/config/local-provider.ts]`
- **F032 (P3)** — `dist/index.js` re-exports the wrapper barrel, so root and wrapper entry surfaces overlap. `[SOURCE: src/index.ts:14]`
- **F033 (P3)** — no `prepare`/`preinstall`/`postinstall` builds `dist/`; activation docs never mention the install+build prerequisite. `[SOURCE: package.json]`

### 6.2 Operator UX

- **F006 (P1)** — `enablement.local.json.example` ships a decorative `lmStudioExample` block the loader does not parse; reads like a second config. `[SOURCE: enablement.local.json.example]`
- **F007 (P2)** — the plugin writes no stdout/stderr by design, so a misconfigured-but-enabled operator gets byte-identical output with no signal; `docs/enablement.md` §7 verify guidance only works for the wrapper. `[SOURCE: docs/enablement.md; plugin]`
- **F008 (P2)** — `docs/configuration.md` §2 tells operators to hand-create `operator/run-communication-projection-doctor.mjs`, which is not shipped. `[SOURCE: docs/configuration.md]`
- **F009 (P3)** — two env prefixes for one concern (`COMMUNICATION_PROJECTION_ENABLED` vs `MK_COMMUNICATION_PROJECTION_DISABLED`). `[SOURCE: src/config/enablement.ts:9; plugin]`

### 6.3 Documentation

- **F010 (P2)** — `localProvider` block duplicated near-verbatim across `docs/enablement.md` §2 and `docs/configuration.md` §3. `[SOURCE: docs/enablement.md; docs/configuration.md]`
- **F011 (P2)** — `docs/install.md` documents a consumer verification flow that cannot exercise the loader and references a doctor script the operator must create. `[SOURCE: docs/install.md]`
- **F012 (P2)** — no linear quickstart chaining install → enable → configure provider → verify. `[SOURCE: docs/]`
- **F013 (P3)** — package README §5 omits the config/enablement exports. `[SOURCE: README.md]`

### 6.4 The sk-communication skill

- **F014 (P1)** — SKILL.md routing table and `references/package-map.md` have no `src/config/` row; the Phase 030 surface is invisible to the skill router. `[SOURCE: SKILL.md; references/package-map.md]`
- **F015 (P2)** — SKILL.md §5 links only `references/package-map.md`; `feature-catalog/` (12 files), `manual-testing-playbook/` (9 files), `benchmark/`, README, and changelog are never referenced; the router scans only `references/`. `[SOURCE: SKILL.md:77]`
- **F016 (P2)** — activation-trigger keywords lack "local provider"/"enablement"/"ollama"/"local LLM". `[SOURCE: SKILL.md]`
- **F018 (P3)** — asset split is 12 catalog + 9 playbook (21 total), not "13+8". `[SOURCE: feature-catalog/, manual-testing-playbook/]`
- **F019–F023 (P2/P3)** — the two root indexes transitively cover all 21 assets; the §2 routing table maps 1:1 to catalog folders; COMM scenarios map to invariants; `RESOURCE_BASES` should widen; skill-root README/benchmark/changelog are unreferenced. `[SOURCE: SKILL.md; feature-catalog/feature-catalog.md; manual-testing-playbook/manual-testing-playbook.md]`
- **F024 (P2)** — `benchmark/reports/` holds no persisted manual-scenario evidence (RUN INDEX empty); only the advisor-routing smoke capture exists. `[SOURCE: benchmark/reports/README.md]`
- **F025 (P3)** — `leaf-manifest.config.json` `includeBases` covers references/catalog/playbook but not `benchmark/` or `changelog/`. `[SOURCE: leaf-manifest.config.json]`
- **F026 (P1)** — the advisor-routing smoke capture (2026-08-12, PASS) is stale and now documents behavior inverse to the shipped route-exclusion invariant (commit `db7a26fdd4`, 2026-08-13). `[SOURCE: benchmark/reports/advisor-routing-smoke-2026-08-12.json; git log; SKILL.md:14]`
- **F027 (P2)** — the capture's `reproduce` command targets the Python scorer, which does not read `route-exclusions.json`; the exclusion is enforced only in the native TS fusion scorer. `[SOURCE: lib/scorer/fusion.ts:373; lib/lifecycle/archive-handling.ts:49]`
- **F028 (P3)** — the capture also predates the §2 routing-table row set. `[SOURCE: benchmark/reports/advisor-routing-smoke-2026-08-12.json]`
- **F017 (note)** — the advisor denylist exclusion is deliberate and documented; not a defect.

## 7. EVIDENCE & SOURCES

All findings cite shipped files with line anchors in the iteration narratives. Primary surfaces: `src/config/local-provider.ts`, `src/config/enablement.ts`, `.opencode/plugins/mk-communication-projection.js`, `bin/cli-output-wrapper.mjs`, `cli-communication-projection/package.json` + tsconfigs, package `docs/`, `sk-communication/SKILL.md` + `references/` + `feature-catalog/` + `manual-testing-playbook/` + `benchmark/`, and the advisor routing config/scorer.

## 8. KEY QUESTIONS

1. Operator UX friction in enablement/local-provider config/activation — mapped (F001, F006–F009, F033); runtime activation of the plugin remains operator-verifiable.
2. Documentation completeness/structure/onboarding — assessed (F010–F013, F012 quickstart).
3. Architecture friction in the loader/provider/transport/judge and entry-point wiring — assessed (F001–F005, F029–F033); loader is real and wired.
4. Skill SKILL.md structure/routing/assets — assessed (F014–F028).

## 9. RANKED RECOMMENDATIONS (rationale + rough effort)

Cross-axis consolidated list, ranked by impact.

| Rank | Rec | Proposal | Axis | Rationale | Effort |
|------|-----|----------|------|-----------|--------|
| 1 | R-A | Fix the fresh-checkout `dist/` breakage: add a `prepare`/`preinstall` build hook (or wire root install) so both entry points load after `npm install`; document the build step in activation docs | Architecture + UX | F001/F029/F030/F033: both entry points are dead on a fresh checkout until a manual, undocumented build | Medium |
| 2 | R-B | Make the loader consumable outside the monorepo: ship `enablement.local.json.example` in `files`, resolve the override from an env-var path (e.g. `COMMUNICATION_PROJECTION_ENABLE_FILE`) or cwd fallback, and align `docs/install.md` | Architecture + Docs | F002/F011: tarball consumers can never configure a local provider | Medium |
| 3 | R-C | Ship the wrapper: add a `bin` field and include `bin/` (or move the launcher) so the two-entry-point story survives packaging | Architecture | F031: the wrapper is absent from the packed artifact | Medium |
| 4 | R-D | Re-run the advisor-routing smoke on the native advisor surface with the expectation inverted (skill ABSENT), then rewrite the artifact's `purpose`/`verdict`/`reproduce`; bind re-run into the post-change checklist | Skill | F026–F028: current capture is stale and documents the inverse of the shipped exclusion invariant | Small |
| 5 | R-E | Route the config surface in the skill: add a `src/config/` row to the SKILL.md routing table and `references/package-map.md`; add enablement/local-provider keywords | Skill | F014/F016: the Phase 030 surface is invisible to the skill router and keyword triggers | Low–Medium |
| 6 | R-F | Widen the skill Smart Router: scan `references` + `feature-catalog` + `manual-testing-playbook` + `benchmark`; link the two root indexes in §5; add a catalog-folder column to the §2 routing table; map COMM scenarios to invariants | Skill + Docs | F015/F019–F023: 21 assets are invisible; root indexes transitively cover them | Low |
| 7 | R-G | Point SKILL.md §5 at `benchmark/` as the evidence destination (RUN INDEX + Lane C harness), and optionally add `benchmark` to `leaf-manifest includeBases` | Skill | F024/F025: no evidence persisted today; reference the destination, not a populated library | Trivial |
| 8 | R-H | Remove the dead `lmStudioExample` block from `enablement.local.json.example` | UX | F006: decorative block reads as a second config the loader never parses | Trivial |
| 9 | R-I | Consolidate the duplicated `localProvider` docs into one canonical section and add a linear quickstart (install → enable → configure → verify) | Docs | F010/F012: drift risk and no onboarding path | Low |
| 10 | R-J | Ship a doctor/check helper or a `--doctor`/`--status` flag on the wrapper so verification does not require hand-assembling an unshipped script | UX | F008: documented verification requires creating a script that does not ship | Medium |
| 11 | R-K | Add an opt-in plugin-side activation signal (stderr/telemetry line or check command) so silent misconfiguration is diagnosable | UX | F007: byte-identical output on misconfiguration, no signal | Low |
| 12 | R-L | Docs/entry-point parity + naming consistency: add a `./config` subpath export + README row; align kill-switch naming | Docs + Architecture | F003/F009/F013/F032: surface/export omissions and split prefixes | Low |
| 13 | R-M | Cache the loader + enablement reads (per-activation, not per-token) and consider per-kind provider fidelity | Architecture | F004/F005: per-message re-parse and coarse family mapping | Medium |

## 10. ELIMINATED ALTERNATIVES

| Approach | Reason eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Trusting the prior run's architecture conclusions (loader "absent", plugin/wrapper "structural no-ops", projection "never invoked") | Re-verified STALE against the Phase 030 tree; loader/plugin/wrapper are real and wired | F001–F003 (re-verification), source reads | 1 |
| Individually linking all 21 catalog/playbook files in SKILL.md §5 | Over-linking; the two root indexes transitively cover every asset | F019 | 2 |
| Writing §5 "see benchmark reports" as populated evidence | No COMM-* evidence is persisted; RUN INDEX is empty — only the advisor-routing smoke capture exists | F024 | 3 |
| Treating the advisor-routing smoke capture as current PASS evidence | It predates the route-exclusion commit and documents the inverse of the shipped invariant | F026–F028 | 4 |
| Verifying `npm run check` green-ness as a read-only research operation | Install+build-gated; cannot run without mutation (no node_modules, no typescript, build writes dist/) | F029 | 5 |

## 11. DIVERGENCE MAP

- Completed pivots: 0; failed pivots: 0; audited overrides: 0.
- Saturated: none. The single lineage pursued the four axes sequentially; no direction was abandoned.
- Remaining frontier: runtime plugin auto-load behavior (`opencode.json` has no `plugin` key) and the post-install build-and-activate flow are operator-verifiable unknowns, not research-recoverable within the read-only scope.

## 12. OPEN QUESTIONS

- Whether OpenCode auto-loads `.opencode/plugins/*.js` without explicit registration — plugin activation could not be verified at runtime in this research-only phase (UNKNOWN, operator-verifiable).
- Whether `npm run check` is green after `npm install && npm run build` in a clean environment (requires mutation; not executed here).
- Whether the re-run advisor-routing smoke confirms the exclusion invariant (recommendation R-D, operator action).

## 13. RISKS & DEPENDENCIES

- Any loader simplification must preserve the fail-closed privacy boundaries (NFR-S01).
- Entry-point changes must keep plugin and wrapper behavior aligned (NFR-R01).
- Recommendation R-B must not weaken provider extensibility or the loopback-derived privacy classes.
- The `dist/` build story is the highest-risk dependency: until fixed, both entry points remain broken on fresh checkouts.

## 14. RESEARCH BOUNDARIES

- Max iterations: 5; convergence threshold: 0.05; stop: maxIterationsReached.
- Progressive synthesis: true. Reducer-owned strategy/registry/dashboard; workflow-owned `research.md`.
- Writes confined to the research packet; the build was analyzed, not executed.

## 15. NEXT STEPS

1. Review the ranked list (R-A…R-M) and select work for a build phase (`/speckit:plan`).
2. Prioritize the P1 blockers: R-A (dist build), R-B (tarball consumability), R-C (wrapper packaging), R-D (smoke re-run), R-E (config surface routing).
3. Operator-verify the two unknowns (plugin auto-load; build-and-activate flow) before build-phase planning.

## 16. REFERENCES

- `specs/cli-external-orchestration/035-improved-communication/031-improvement-research/research/resource-map.md` (prior-inventoried files).
- `research/iterations/iteration-001.md` … `iteration-005.md`.
- `research/findings-registry.json`, `research/deep-research-dashboard.md`.
- Shipped surfaces cited inline in §6 (`file:line` anchors in iteration narratives).

## 17. CONVERGENCE REPORT

- Stop reason: maxIterationsReached (5 of 5)
- Total iterations: 5
- Questions answered: 0 / 4 (mapped, not formally closed — all four axes assessed)
- Remaining questions: 4 (incl. 2 operator-verifiable unknowns)
- Last 3 iteration summaries: run 3: benchmark/reports evidence (0.6); run 4: advisor smoke currency (0.7); run 5: npm run check / dist build (0.7)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded; single lineage across four axes
- Note: the invocation bound `--max-iterations=5` (spec.md REQ-002 documents a prior 10-iteration method; current flags governed this run)
