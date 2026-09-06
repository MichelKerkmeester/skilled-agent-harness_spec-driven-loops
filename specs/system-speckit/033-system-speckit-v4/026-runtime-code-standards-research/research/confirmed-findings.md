# Confirmed findings: code versus the sk-code standards

Reproduced in the orchestrating session on 2026-09-06 by opening every cited code line and standard clause, with ripgrep for consumers and shellcheck for the shell rows. The remediation child is `028-header-tags-hook-catch-and-script-test-fixes`.

## Mechanical

| ID | Sev | Code | Standard | Actual | Verdict |
|----|-----|------|----------|--------|---------|
| F1.2 | P2 | `runtime/cli/spec/recommend-level.sh:3` and two siblings | shell style guide §2 header tag | `# SPEC-KIT:` on 3 scripts, `# SPECKIT:` on 8 | Confirmed |
| F1.1 | P1 | `runtime/cli/rules/*.sh:3` | shell style guide §2 `# COMPONENT:` | `# RULE:` on 27 of 28 rule scripts; no code reads the tag | Confirmed |
| F9.2 | P2 | 7 `.mjs`/`.cjs` entry points | TypeScript style guide §2 `// MODULE:` | `// SCRIPT:` on 7 files, `// MODULE:` on 26 | Confirmed |
| F2.2 | P2 | `runtime/cli/utils/memory-frontmatter.ts` | imports-and-exports §3 | Barrel with zero importers | Confirmed |
| F5.3 | P2 | `shared/embeddings.ts:3` | comment hygiene | Feature-catalog pointer kept alive by a hygiene marker | Confirmed |

## Judgment

| ID | Sev | Code | Actual | Decision |
|----|-----|------|--------|----------|
| F3.1 | P1 | `runtime/hooks/cursor/completion-evidence-response.mjs:65` | `main().catch(() => {})` swallows every failure | Log to stderr, stay fail-open |
| F2.1 | P1 | `runtime/cli/lib/frontmatter-migration.ts:386,473,606` | Own fence detection beside the shared parser | Keep, and state the reason in the module header: it classifies legacy shapes the strict parser rejects |
| F7.1 | P1 | `runtime/cli/spec/quality-audit.sh` | No test | Add a vitest with a happy path and an edge case |
| F7.2 | P1 | `runtime/cli/spec/calculate-completeness.sh` | No test | Add a vitest with a happy path and an edge case |
| F10.1 | P1 | four `findRepoRoot` implementations | Different stop conditions in each | Consolidated onto the sentinel-file resolver in `runtime/hooks/lib/workspace/repo-root.mjs`; the other three delegate to it |
| F3.2 | P2 | `runtime/cli/doctor.sh:43,51`, `validate-command-tree-parity.sh:34` | Exit codes 20, 26, 64 | No change: the codes are documented in the script header and 64 is the sysexits usage code |
| F6.2 | P2 | 27 `test-*` files in `runtime/cli/tests` | Legacy node-run suites | No change: wired by the package scripts, not a vitest glob |

## Dropped

| ID | Reason |
|----|--------|
| F5.1 | `shared/ipc/socket-server.ts` is consumed through the package export by the skill-advisor daemon; not dead |
| F5.2 | `runtime/cli/lib/embeddings.ts` is imported by `runtime/cli/core/workflow.ts:56` |
| F8.2 | shellcheck reports no SC2164 on the three files because `set -e` is active |
| F4.3, F6.1, F8.1, F10.3 | Conventions the standard does not forbid: a test-enforced boundary, frontmatter key mirrors, an `eval` over `printf %q` output, a per-call root option |

## Second pass: Gemini 3.8 Flash High, two iterations over runtime/lib, runtime/api, runtime/hooks, CLI scripts and shared

| ID | Sev | Code | Actual | Decision |
|----|-----|------|--------|----------|
| F1.1 | P1 | `runtime/api/graph-refresh.ts:12` | Imports a handler while a lib seam exists | Fixed: import the seam |
| F1.2 | P1 | `runtime/lib/validation/orchestrator.ts:76-78`, `spec-doc-structure.ts:104-107` | lib points at cli registry, rules and dist | No change: the rule registry and scripts are the CLI package's and the orchestrator runs them by path; the module map already records that no checker enforces internal layering |
| F1.3 | P1 | `thin-continuity-record.ts:108`, `packet-synopsis.ts:52` | Own frontmatter regexes | Kept with a stated reason: they accept a BOM or a leading HTML comment the strict shared parser rejects |
| F1.4 | P1 | `spec-doc-structure.ts:1250-1256,1337` | Success output on stderr | Fixed: stdout |
| F1.5 | P1 | `generated-metadata-integrity.ts:150-154` | Uncomputable fingerprint passes silently | Fixed: `SOURCE_FINGERPRINT_UNCOMPUTABLE` violation; the allowlist catch stays because returning false is already fail-closed |
| F1.6 | P1 | `runtime/api/graph-refresh.ts` | No test | Fixed: resolver exported and tested, happy path and error |
| F1.7 | P2 | 155 files with 63-dash headers; four modules without banners | Off the 67-character standard | Fixed: 248 files normalized, banners added to four modules |
| F1.8 | P2 | `description-schema.ts:28,66` | `trigger_phrases` beside camelCase | No change: mirrors the frontmatter key |
| F2.1 | P0 | `migrate-deep-loop-*.cjs:12-17` | Repo root resolved one level short | Removed: one-off migrations for a retired path, never runnable |
| F2.2 | P1 | three `completion-evidence-stop.cjs:128-146` | `main().catch(() => approve())` | Fixed: report on stderr, then approve |
| F2.3 | P1 | five `wave-*.cjs`, four tests | No caller outside their own tests | Removed with their tests and README rows |
| F2.4 | P1 | `shared/config.ts:23-32`, `shared/paths.ts:80` | Shared package computes the runtime database path | Root cause fixed: `resolvePackageRoot` returned the shared package itself, so the telemetry store landed under `shared/runtime/database`; it now resolves the skill root |
| F2.5 | P1 | `shared/gate-3-classifier.ts:504-517` | Ignores the telemetry store the hardening flag writes to | Fixed: store consulted first, JSON pointer second |
| F2.6 | P1 | `shared/package.json:18` | `test` is an echo while six script tests exist | Fixed: `node --test` over the script tests; one had rotted against a renamed asset and a renamed step |
| F2.7 | P2 | `shared/utils/retry.ts:74-75` | SQLite retry patterns | Removed |
| F2.8 | P2 | four script headers | `use strict` before the header, a bare filename title, a docstring header | Fixed |

## Third pass: DeepSeek V4 Flash max, five iterations over runtime/cli TypeScript, rule scripts, hook adapters and shared

| ID | Sev | Code | Actual | Decision |
|----|-----|------|--------|----------|
| F1.1 | P1 | `runtime/cli/core/quality-scorer.ts:140` and `extractors/quality-scorer.ts:105` | Two unrelated scorers export the same name | Fixed: the render-quality scorer is `scoreRenderQuality`; its three tests follow |
| F2.1 | P1 | `graph/backfill-graph-metadata.ts:240`, `graph/migrate-generated-json.ts:149`, `continuity/backfill-frontmatter.ts:83` | Private root walk-ups | Fixed: all three delegate to the hooks resolver through a new `@spec-kit/runtime` package export with a declaration file |
| F4.1 | P1 | `hooks/cursor/spec-gate-classify.mjs:26-43`, `hooks/devin/spec-gate-classify.mjs:29,42` | Reimplement stdin read and fail-open parse | Fixed: import the shared helpers |
| F2.2 | P1 | `runtime/cli/utils/fact-coercion.ts` | No test | Fixed: happy path and nullish edge |
| F1.2 | P2 | `runtime/cli/core/memory-indexer.ts` | Type-only stub, no importer | Removed with its README rows |
| F1.3 | P2 | `runtime/cli/extractors/session-activity-signal.ts` | Re-export shim, no importer | Removed with its README row |
| F3.1 | P2 | `runtime/cli/spec/progressive-validate.sh:172` | `log_suggest` never called | Removed |
| F5.1 | P2 | `shared/embeddings/providers/ollama.ts:425`, `shared/parsing/secret-scrubber.ts:246` | Test hooks with no consumer | Removed |
| F5.2 | P2 | `shared/ranking/matrix-math.ts` | No direct test | Fixed: script test with a well-posed and a singular system |
| F3.2 | P2 | 14 rule scripts without a direct-run guard | Loader-only rules documented as if directly runnable | No change: their `run_check` takes the loader's folder and level arguments, so a direct-run guard fails under `set -u`; the rules are the loader's contract, not a CLI |
| F4.2 | P2 | `hooks/cursor/spec-gate-classify.mjs:6-19` | Dormant hook with a cursor-shaped output | No change: documented as dormant until cursor-agent delivers the event |

## Verification pass: Claude Fable 5 high through the second account, read-only, against the closed program

| ID | Sev | Code | Actual | Decision |
|----|-----|------|--------|----------|
| V-C1 | P0 | `shared/frontmatter/parse-frontmatter.ts:12` | Claimed the shared typecheck fails for want of js-yaml types | Dropped: `shared/js-yaml.d.ts` declares the module and the typecheck passes; the verifier's worktree resolved through symlinked dependencies |
| V-C2 | P0 | `runtime/cli/check-api-boundary.sh:16` | Resolved `runtime/runtime`, so `npm run check` aborted | Fixed; the gate then exposed 20 pre-existing import-policy violations, two expired allowlist entries and two orphaned dist files, all resolved; `npm run check` now passes end to end |
| V-C3 | P1 | `runtime/cli/retrieval/lib/corpus.mjs:65` | Build output under `shared/dist` was indexed | Fixed: `dist` excluded; ten artifact entries left the index |
| V-C4 | P1 | `runtime/cli/continuity/generate-context.ts` | Telemetry store had readers but no production writer | Fixed: the phase-parent pointer save records to the store through a new api export |
| V-C5 | P1 | 13 hook entry points and three `shared.ts` adapters | `main().catch(() => approve())` | Fixed: every one reports on stderr before its fail-open or fail-closed fallback |
| V-C6 | P1 | `runtime/cli/continuity/migrate-trigger-phrase-residual.ts:130` | `.opencode/skill/` sentinel typo | Fixed: delegates to the hooks resolver |
| V-C7 | P1 | `runtime/cli/codex/generate-command-routers.cjs:43` | `require()` of an ES module below the declared engine floor | Fixed: the CLI package now declares Node 22.12 or later |
| V-C8 | P1 | `shared/package.json` test globs; four untested modules | Six subdirectories excluded; no tests | Fixed: globs widened; script tests for the secret scrubber, the retrieval trace and the socket-server helpers |
| V-C9 | P2 | `core/quality-scorer.ts:123,139` | Comments named a nonexistent export | Fixed |
| V-C10 | P2 | 92 files | Divider lines off the documented width, two files without `use strict`, one hyphen shell header | Fixed |
| V-C11 | P2 | `utils/README.md:42`, `quality-extractors.ts:22,35`, `calculate-completeness.sh:231`, `retrofit-convention.mjs:129` | README row, stale comments, a finding id, a hard-coded packet path | Fixed; the retrofit default output now lives in the temp directory |
| V-C12 | P1 | eleven remaining private repo-root walk-ups in scripts outside the consolidation | Reported | Kept: they are CommonJS and shell entry points outside the TypeScript packages; recorded as follow-up |
| V-C13 | P2 | `shared/predicates/boolean-expr.ts`, `runtime/lib/search/folder-discovery.ts` catches | Unconsumed module; uncommented catches | Kept: the predicate module is a public shared export with its own test; the discovery catches guard optional reads |
