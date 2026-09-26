# JavaScript field-hardening traceability — 2026-08-27

This checkpoint turns the real-agent findings recorded in
`../../supercov-company/notes/2026-08-27-agent-discoverability.md` and
`../../supercov-company/notes/SUPERCOV-BUGS.md` into release-blocking Supercov
requirements. The separately labelled Shopify-test harness and Essential SEO
application findings are intentionally outside this repository.

## Correctness and measurement

| Finding | Required invariant | Implementation | Executable proof |
| --- | --- | --- | --- |
| B1: capability proxies changed class identity | Imported classes, nested classes, callbacks, `instanceof`, prototypes and constructor identity retain ordinary JavaScript semantics; only the imported root actually called with a host/guest mapping is supervised | Rust AST capability-root selection plus raw class handling in `launchSupervisor.js` | Rust capability-selection cases, runtime identity cases, opaque ESM/CommonJS launchers, full 436-test Essential SEO unit suite |
| B2: constants created impossible MC/DC | Syntactically invariant control decisions are outside the MC/DC denominator without evaluating user code; logical expressions used as values keep their branch obligations | Rust Boolean-variability analysis | `while (true)`, `do…while(false)`, `if(false)`, constant-dominating `&&`/`||`, syntax matrix and Test262 |
| B3: ambient TypeScript became executable | Type-only ambient declarations create no executable point, branch or MC/DC obligation | Rust ambient-context depth and `.d.ts` exclusion | `declare global/module/namespace/const/var/function` instrumenter cases and full Essential SEO run |
| B4: reviewed exceptions covered only MC/DC | Reviewed exceptions can target line, statement, function, branch or MC/DC by stable, unambiguous identity; raw measured coverage never changes | Generalized `supercov.waivers.json` evaluator and query annotations | validation, application, contradiction, unmatched, filter projection and public-run cases |
| B5: expected failures looked red | Expected failure is a green terminal test outcome, unexpected pass is red, and neither expected failure nor its companion evidence is misclassified as passed-only or failed-only verified coverage | Vitest reporter expected-status normalization and Rust attempt projection | unit report cases, direct Vitest fixture, Playwright expected-failure fixture and Essential SEO `.fails` run |
| B6: failed filter was cosmetic | Every outcome/kind/runner filter recomputes lines, points, branches, MC/DC witness pairs and file gaps from only the selected evidence | indexed projection selection and exact filtered queries | index tests, public query tests and failed-projection follow-up command gate |
| server self-request evidence vanished | Missing inbound carrier routes server evidence durably to a first-class background record; persistence failure is fatal; remote launches without returned scoped/background evidence block completeness | runtime durable background writer and transport health checks | real nested loopback HTTP request, SIGKILL durability and unwritable-transport tests |
| invalid/no-evidence runs looked valid | A nonzero or unknown wrapped-command exit is visibly invalid; missing/corrupt transport blocks completeness and produces a causal error | run status, typed diagnostics and fail-closed summary | failed public run, no-evidence error, corrupt transport and remote-evidence health tests |
| B9: merge rejection hid the incompatible domain | Strict merge compatibility remains unchanged, but rejection names the exact differing domains: source, tests, dependencies, configuration, instrumenter or schema | domain-by-domain integrity comparison in the Rust merge engine | merge unit test with simultaneous source, test and configuration changes |

## Agent and human contact surfaces

| Finding | Required behavior | Proof |
| --- | --- | --- |
| D1/D3/D4: agents measured one suite | Top-level help says **FULL** command and explains workspace isolation; summaries show per-kind rows and a factual slice hint based on package scripts | CLI unit tests, shipped help and Essential SEO unit-only summary |
| D2: npm package hid the guides | `supercov docs [topic]` prints bundled Markdown and every guide ships in the npm package | public-run `docs agent-loop` gate and `npm pack --dry-run` inventory |
| D5: reviewed exceptions were invisible | Help, summary, file/line data and JSON expose applied, contradicted and unmatched reviewed exceptions with rationale | waiver unit/public-run gates |
| D6: workspace outputs appeared lost | Every run names the exact isolated workspace retaining command-created outputs | public-run and isolation gates |
| D7: Supercov frames buried user code | Rethrown matcher/native assertion errors remove exact Supercov runtime frames while retaining the first user frame | runtime and Playwright failure-stack cases |
| B7: source unavailable contradicted details | Prefer exact archived source; otherwise read the path-safe current working-tree line and label current/stale origin | coverage-query source tests and Essential SEO line query |
| B8: files and gaps were indistinguishable | `files` says and returns all included files; `gaps` says and returns unresolved files only; every collection is paginated and offers a concrete drill-down | public query and agent evaluation gates |
| filters disappeared during drill-down | Every generated file/gap/kind/runner/scope and pagination command retains outcome, kind, runner and metric projection | human-query unit and public failed-run cases |
| line branch parent looked uncovered | Parent branch coverage, tests, source and missing alternatives are reconstructed from alternative-level evidence under the selected projection | public default-parameter branch query and Essential SEO line query |
| E2E-first workflow was hidden | Combined summaries show lines covered by other kinds but not E2E and lines uncovered everywhere; `gaps --kind e2e` remains the single drill-down | generic indexed aggregation, CLI/doc surface and combined Essential SEO run |

## Workspace compatibility correction

The earlier hidden `.supercov/cache/workspace` location changed URL/path
semantics in frameworks that treat dot-prefixed ancestors specially. The
owned JavaScript workspace now uses the non-dotted `supercov/workspace`
container. Adoption requires an exact regular-file marker; a project-owned
`supercov/` directory is copied normally and forces a deterministic non-dotted
fallback name. Cleanup, discovery, integrity and crash recovery all use the
same ownership function.

## Release evidence

- warnings-denied formatting/Clippy and all Rust workspace tests;
- runtime kill, loopback, transport and stack tests;
- node:test, Vitest, Playwright, Vite, esbuild, tsc, webpack, SWC and Next.js;
- combined runner, retries, expected failure, filtered queries, merge and
  bounded agent workflow;
- opaque ESM/CommonJS remote launchers with computed guest mappings;
- Node, Chromium, Firefox and WebKit syntax equivalence;
- macOS SIGTERM/SIGKILL/ENOSPC-style workspace and lifecycle recovery;
- full Test262 semantic equivalence;
- real combined Essential SEO command plus direct query inspection;
- release transform and run-overhead benchmark.

All correctness and agent-workflow findings in the two source reports are now
closed, including the later B9 merge diagnostic. The local proof set is 19 CLI,
19 contract and 277 engine tests; Test262 preserves 65,051 baseline-passing
scenarios across 41,593 files with zero semantic-equivalence failures; and the
real combined Essential SEO run passes 436 unit plus 80 E2E tests with complete
measurement. The release transform median is 25.66ms for 500 files. A fair
warm end-to-end comparison is currently 110.45s plain versus 124.06s measured
(1.123x), so the separate R3 1.10x promotion gate remains explicit and open.

This checkpoint does not weaken the Rust-language critical path. It restores
the public JavaScript frontend to a trustworthy baseline before more language
frontends reuse the same storage, attribution and query engine.
