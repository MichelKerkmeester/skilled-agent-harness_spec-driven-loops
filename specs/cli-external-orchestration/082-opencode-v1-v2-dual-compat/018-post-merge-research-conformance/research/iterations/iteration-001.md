# Iteration 001 — A28: sk-code-skilled conformance of the code changed by the 2026-10-19 merges

## Focus

Which code files changed by the four branches merged to main on 2026-10-19 miss the sk-code-skilled contract? Checks: file headers, section dividers, naming, comment hygiene (no spec paths or ids in comments), error handling, test coverage. Drift guards run read-only; no files edited outside this research packet.

## Actions Taken

1. **Reconstructed the merge graph.** The named merges are nested, so per-effort scope was isolated with merge-base three-dot diffs: OpenCode dual compatibility (`fe1f8a9a53`, branch side through `4a15d7e66a`), pi fast-mode / sk-vision OpenCode 2 (`8e8e95e8e6`, branch side through `c4f15f8f1a`), and the dispatch-adapter branch (`6358d81eba`, branch side through `0743e52560` — which adds **only** the trigger-index rebuild, no code files). The worktree-provisioning effort is `bcd2f4d0d1` ("provision bun packages with bun in a worktree"), first contained in the `75a501779a` → `6358d81eba` lineage. The v2-bridge port (`32e1f92687`, `f7b54c52db`) rides the pi-fast-mode branch side and lands via `8e8e95e8e6`.
2. **Enumerated the changed code set**: 77 code files (`.js/.mjs/.cjs/.ts/.sh`) after excluding scratch/evidence/fixtures/z_archive.
3. **Loaded the contract**: `.skilled/skills/sk-code/SKILL.md` (hub), `sk-code-skilled/SKILL.md` (surface), the JS/TS/shell header + section rules, `directory-and-test-conventions.md` test-placement rules, and the hygiene checker's own violation patterns.
4. **Ran the shipped drift guards end-to-end, read-only**: `run-all-drift-guards.sh` → alignment-drift PASS (10 non-blocking warnings), stack-folders PASS, router-sync 5/5 PASS, doc-claims 4/4 PASS.
5. **Ran `check-comment-hygiene.sh` over all 77 changed files** → exit 0, zero violations, zero `hygiene-ok` escape uses.
6. **Audited headers, divider widths (Python char-count, not byte-count), test pairing, mirror parity, and error-handling posture** across the sampled files.

## Findings

### The contract holds — positive results

- **Comment hygiene (HARD BLOCK): clean.** 0 violations across all 77 changed code files, and not a single `hygiene-ok` suppression was used — no file needed it. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:1]
- **Drift guards: 4/4 PASS at HEAD.** The 10 alignment-drift warnings all land on files **outside** the merged window (`.opencode/plugins/lib/opencode-goal-core.js`, `lib/tool-identity.js`, and seven `specs/**/research/lineages/**` scripts) — none on a file these branches changed. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:1]
- **Headers and dividers: exact.** Every sampled file opens with the `MODULE:` header; header dividers measure 70 chars (`// ` + 67 box characters, exactly the guide template) and section dividers 80 chars. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/javascript/style-guide.md:55] The two remaining `╔═╗`-box users (`.opencode/plugins/system-skill-advisor.js`, `.skilled/skills/sk-vision/hooks/opencode/sk-vision.ts`) both pre-date the window, so the "accepted where it already exists; do not introduce in new files" rule is satisfied. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/javascript/style-guide.md:60]
- **The sk-code-skilled rename is fully propagated.** No `sk-code-opencode` directory remains; doc-claims check "names" (no retired packet names) passes.
- **Mirror parity is enforced and held.** All five runtime mirrors (`.claude/hooks/*`, `.codex/hooks/*`, `.opencode/plugins/session-relaunch.js`) are byte-identical to their `.skilled/hooks/session-relaunch/` sources, and a parity test shipped in the same window. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts:1]
- **Error-handling posture is strong.** `v2-bridge.js` throws typed errors naming the unsupported v2 surface (`:97`, `:142`, `:167`, `:195`) and aggregates plugin-cleanup failures in an `AggregateError` (`:275`). [SOURCE: .opencode/plugins/lib/v2-bridge.js:275] `worktree-naming.sh` scopes `set -euo pipefail` with a durable WHY (it must not leak `set -e` into sourcing callers) and validates namespace/slug arguments to stderr with `_wn_usage`. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:39] `verify-iteration.cjs` catches are annotated with durable intent, e.g. "handled as inconclusive below". [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:295] `pi-fast-mode` documents the second-copy stand-down with a durable comment. [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:86]
- **Test pairing is otherwise comprehensive**: v2-bridge → `v2-bridge.test.cjs`; all 12 plugins → `v2-registration.test.cjs` (v2-hook assertions at `:69`–`:89`); session-relaunch has per-module tests (killer/nudge/relaunch-core/context-usage/cli/skilled-loop) plus claude/codex/hermes adapter tests; doctor scripts have both paired test files; `spec-gate-core.mjs`, `reduce-state.cjs`, `verify-iteration.cjs`, `sync-hook-registrations.cjs`, `post-edit-router.cjs`, `router-replay-lib.cjs`, and `worktree-naming.sh` all have direct or suite tests. [SOURCE: .opencode/plugins/tests/v2-registration.test.cjs:69]

### Misses (per-file conformance table)

| # | Severity | File(s) | Miss | Evidence |
|---|----------|---------|------|----------|
| F-001 | P2 | `sk-vision/vision-runtime/src/plugin.test.ts`, `src/runtime/client.test.ts`, `src/opencode/tools.test.ts`, `src/opencode/attachments.test.ts` | Four test files sit **beside their sources** inside `src/`, against "Tests live in the package's top-level `tests/` tree … A test never sits beside its source" (both rules universal). Vitest discovery still picks them up, so coverage exists, but the placement convention is missed. | [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/directory-and-test-conventions.md:260] |
| F-002 | P2 | `sk-doc/scripts/tests/test-frontmatter-version.mjs`, `test-frontmatter-version-bump.mjs` | Legacy `test-`-prefix test names, mounted **nowhere**: `run-node-tests.mjs` discovers only `*.test.mjs`/`*.test.cjs` under five ROOTS that exclude these names, and sk-doc's own `run-script-tests.sh` loops only `test_*.py`. Commit `e87ea715ed` (+29 test lines) extended a test file no runner executes; the file self-documents "Run: node test-frontmatter-version.mjs". Live Node convention is `*.test.mjs`. | [SOURCE: .skilled/scripts/run-node-tests.mjs:29], [SOURCE: .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh:12], [SOURCE: .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs:7] |
| F-003 | P2 | `.skilled/skills/sk-vision/hooks/opencode/sk-vision.ts` | The OpenCode host adapter (modified in-window by `a8846ad07c`, wiring `RuntimeClient` + `skVisionTools`) has **no paired test**; the vision-runtime tests cover tools/client/plugin/attachments but nothing exercises this adapter's registration wiring. | [SOURCE: .skilled/skills/sk-vision/hooks/opencode/sk-vision.ts:16] |
| F-004 | P3 | `.pi/extensions/**` | `.pi` is absent from `run-node-tests.mjs` ROOTS, so the pi-fast-mode and pi session-relaunch suites run only via their own `package.json` scripts — the central Node runner is blind to them. Caveat: a dedicated adapter-suite runner may invoke them separately; unconfirmed this iteration. | [SOURCE: .skilled/scripts/run-node-tests.mjs:27] |
| F-005 | P3 | `sk-code-skilled/scripts/run-all-drift-guards.sh` | The orchestrator itself ships without a test; its PASS/FAIL aggregation was verified here only by execution. | [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:1] |
| F-006 | P3 | `opencode.json` | Changed by `095ddd7246` (DeepSeek V4.1 Flash default). Config-surface conformance under sk-code-skilled's config standards **not assessed** this iteration (code-file scope). UNKNOWN. | [SOURCE: opencode.json:1] |

### Per-file verdict summary (sampled non-test sources)

| File | Verdict |
|------|---------|
| `.opencode/plugins/lib/v2-bridge.js` | PASS — header/divider exact, typed errors, AggregateError cleanup, tested |
| `.opencode/plugins/session-relaunch.js` | PASS — mirror-identical to `.skilled` copy; v2-registration covers |
| `.opencode/plugins/system-skill-advisor.js` | PASS — legacy `╔═╗` box pre-dates window (accepted) |
| `.skilled/hooks/session-relaunch/**` (lib, adapters, bin) | PASS — headers + per-module and per-adapter tests |
| `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts` | PASS — header, 7 try/catch, durable WHY comments; runner note F-004 |
| `.pi/types/node-globals.d.ts` | PASS — header present; `pi-coding-agent.d.ts` header UNKNOWN (not sampled) |
| `.skilled/skills/sk-vision/vision-runtime/src/*` | PASS headers; test placement miss F-001 |
| `.skilled/skills/sk-vision/hooks/opencode/sk-vision.ts` | PASS header; coverage miss F-003 |
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` (+ new `tests/worktree-naming.test.sh`) | PASS — guarded strict mode with durable WHY, stderr validation, correct `*.test.sh` harness |
| `.skilled/commands/doctor/scripts/*` | PASS — headers; both paired test files present |
| `.skilled/skills/system-deep-loop/runtime/scripts/{reduce-state,verify-iteration}.cjs` | PASS — both tested; durable catch comments |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | PASS — `spec-gate-core.test.mjs` |
| `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` | PASS content — byte-identical to the `scripts/` copy, both fixed in the same commit `e87ea715ed`; duplication maintained manually, primary test defaults to the `scripts/` copy [SOURCE: .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs:16] |
| `sk-code-skilled/assets/scripts/*.cjs`, `scripts/run-all-drift-guards.sh` | PASS — replay-lib exercised via `verify-router-sync.test.cjs`; runner note F-005 |
| `opencode.json` | UNKNOWN — F-006 |

## Questions Answered

- **Which changed code files miss sk-code-skilled, and how?** — Answered: three P2 misses (colocated tests in sk-vision `src/`; unmounted legacy-named sk-doc test files; untested sk-vision OpenCode host adapter) and three P3 notes (`.pi` outside the central runner roots; untested drift-guard orchestrator; `opencode.json` config conformance UNKNOWN). No P0/P1: comment hygiene is clean everywhere, all four shipped drift guards pass, headers/dividers/naming/mirror parity conform.

## Questions Remaining

- Which changed **docs** miss their sk-doc mode, and how? (carried to the next focus)

## Next Focus

Docs-side conformance for the same merge window: the packet docs, implementation summaries, and skill README/changelog files touched by `fe1f8a9a53`, `8e8e95e8e6`, `6358d81eba`, and the worktree-provisioning commit, checked against the sk-doc mode contracts (frontmatter versioning, README manifests, changelog/version authority).

## SCOPE VIOLATIONS

None. All writes stayed inside this research packet; the drift guards and hygiene checker were run read-only.
