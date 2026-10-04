# Iteration 2: Script and test quality

## Focus

Audit the shared transport and scorer-report modules, their test suites, the hub benchmark scripts, and their live callers for sk-code-opencode fit and correctness risks.

## Actions Taken

- Read the sk-code-opencode JavaScript style, quality, testing/security, quick-reference, and checklist rules.
- Inspected the transport's request parsing, Pi preflight, child-call timeout/fallback, the scorer-report arithmetic and formatting functions, and their test cases without executing them.
- Inventoried the benchmark scorer modules and tests and searched `sk-doc`, `system-deep-loop`, and `system-spec-kit` for live imports and call sites of the shared modules.
- Compared choice argument parsing with cli-jev's required-flags table and inspected the edge-case tests.

## Findings

### LUNA-F003 — A choice without its required question can reach Pi

- **Severity:** P2
- **Axis:** 6 — bugs in scripts and tests
- **Evidence:** The cli-jev reference lists `-q/--question` as required for `choice` (`.skilled/skills/cli-classifier/cli-jev/references/cli-reference.md:40-48`). `choiceRequestFrom` initializes the question to an empty string and only rejects an invocation when no option keys were parsed (`.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:91-92, 126-127`). `spawnClassifierCall` passes any such parsed request to route selection and Pi preflight (`.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:528-545`).
- **How confirmed:** Static path comparison shows `['choice', '-o', 'a=A']` produces a non-null request with `question: ''`, so a Pi-capable automatic route can send it for classification instead of preserving Jev's required-argument usage failure.
- **Test gap:** The parser test rejects no options but does not test valid options with no question (`.skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs:191-202`).
- **Impact:** A malformed Jev invocation can be treated as a live model request and can incur a call instead of returning the CLI's documented usage error.

### LUNA-F004 — The optional environment argument disables Pi discovery when omitted

- **Severity:** P2
- **Axis:** 6 — bugs in scripts and tests
- **Evidence:** `spawnClassifierCall` documents `options.env` as optional (`.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:507-509`) but normalizes omission to `{}` (`.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:511-512`). Pi discovery reads only `env.PATH`, defaulting to an empty string (`.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:291-304`), and that same empty object is passed to transport selection and preflight (`.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:528-545`).
- **How confirmed:** Following the omitted-argument path statically, the Pi package search has no path entries and returns no executable even when the Node process environment contains `PATH`; the call then takes the Jev route. Existing transport tests supply an explicit environment in their common fixture (`.skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs:124-132`), so they do not cover the documented optional case.
- **Impact:** Direct callers using the documented minimal call shape cannot use automatic or explicit Pi routing without passing an environment object.

## Code and Test Observations

- The inspected `.mjs` files use the required module headers and ESM style; the two `.cjs` callers require the helper, and each helper test has a CommonJS reachability case. This is a static inspection only, not a runtime compatibility claim.
- The scorer-report functions and their tests align on the reviewed probability sum, abstention exclusion, 10% row slack, deterministic cluster resampling, and empty-sample forms. No additional confirmed scorer-report defect was found in these paths.
- Five direct transport import surfaces were located: cite-drift-scan, score-clarify-default, score-verdict-fallback, score-d4-agreement, and score-track-narrowing. Their exact usage and output labels need a separate cross-surface check.
- No tests, benchmarks, Jev calls, or repository validation ran.

## Questions Answered

- The request parser has a confirmed invalid-choice path that can diverge from the CLI contract.
- The helper's documented optional environment is not honored consistently by Pi discovery.
- The reviewed scorer-report arithmetic and tested edge forms show no additional confirmed issue in this pass.

## Questions Remaining

- Do Jev-named benchmark arms force Jev transport, or can automatic Pi routing change what they measure and how records label it?
- Does every advisor prompt route through current hub vocabulary, graph metadata, and leaf manifests?
- Can an external repository user install and use the hub without Jev, and can benchmark operators see the measured with-and-without comparison?
- Do the full docs, metadata, mirrors, scripts, and recorded results agree?

## Assessment

- **New-information ratio:** 0.45 (telemetry only; max-iterations remains controlling).
- **Novelty:** Both findings arise from distinct boundary paths: argument parsing and environment-dependent backend discovery.
- **Negative knowledge:** No P0 issue was confirmed in the inspected module boundaries or scorer-report calculations. The full 5,775-line script/test set was not executed or exhaustively traced statement by statement; no global quality pass is claimed.

## Reflection

The most consequential correctness boundary is where the shared wrapper decides whether a request is eligible for a backend. The benchmark callers reuse that decision, so their named arm and recorded transport need an explicit cross-check in the later drift/UX passes.

## Dead Ends

- A single `rg` over all caller bodies was truncated; the caller inventory was re-read as narrower per-file slices where route and result fields were relevant.

## Next Focus

Audit the system-skill-advisor routing vocabulary, graph metadata, leaf manifests, and the two-stage path from a user prompt into the cli-classifier hub and cli-jev leaf.

## Sources

- `.skilled/skills/sk-code/sk-code-opencode/SKILL.md:1-45` — OpenCode system-code surface and JavaScript routing.
- `.skilled/skills/sk-code/sk-code-opencode/references/javascript/style-guide.md:16-60` — JavaScript header, module strictness, section structure, naming.
- `.skilled/skills/sk-code/sk-code-opencode/references/javascript/quality-standards/security-testing-and-exemptions.md:104-180` — test organization and exemptions.
- `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:79-127` — choice request parser.
- `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:291-304` — Pi executable search.
- `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:507-545` — exported call contract and route/preflight.
- `.skilled/skills/cli-classifier/cli-jev/references/cli-reference.md:40-48` — required flags by subcommand.
- `.skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs:124-132, 191-202` — default test fixture and tested parser failures.
- `.skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs:107-229` — probability choice, decided subset, margin and bootstrap implementation.
- `.skilled/skills/cli-classifier/shared/scripts/tests/scorer-report.test.mjs:72-141` — corresponding arithmetic cases.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:24, 1265-1288` — live transport caller.
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:28, 859-866` — live transport caller.
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:25, 901-908` — live transport caller.
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:25-26, 1713-1720` — live transport and scorer-report caller.
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:25, 1153-1155, 1222-1229` — live transport caller.
