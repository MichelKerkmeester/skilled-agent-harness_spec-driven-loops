# Deep Review — Iteration 005 (final)

**Mode:** review · **Dimension:** correctness · **Iteration:** 5 of 5 · **Target:** git commit range `0039903bde..HEAD` (branch `worktrees/113-rem-onboarding-fixes`; commits `dd001838f0`, `54a2e9abbc`, `424f28b8fc`)

BINDING: target=git commit range 0039903bde..HEAD (worktrees/113-rem-onboarding-fixes)
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/002-onboarding-fixes

---

## Dimension

Correctness — final adversarial pass. Every focus probe was executed against current files, not remembered summaries:

1. The Pi adapter when the built file exists but crashes (the silent path the notice does not cover).
2. The built parser when the file exists but fails to load.
3. Exit code 3 against every other exit meaning reachable in the checker and its two consumers.
4. README claims after the new steps: build commands, outputs, trust key, First Use spellings, and the `Verify Installation` section.
5. Shell correctness of both hook edits under `set -euo pipefail`.
6. Test quality: fail-before/pass-after shape, remediation assertions, and runner wiring.
7. Security of the new path handling; overengineering against the reversal-cost ladder.
8. Re-check of the five carried P2s and resolution of deferred row SL-406.

Scope read (all three commits): `.hermes`/`.skilled` skill versions, the Pi hook plus its new test, the registry and regenerated `.codex/hooks.json`, the mirror checker plus its lib, both pre-commit hooks, the harness, README/CONTRIBUTING and the two changelogs.

## Files Reviewed

- README.md:160, :173, :181, :182, :185–:193, :218, :224
- CONTRIBUTING.md:25
- .skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts:8–:12, :44–:51
- .skilled/skills/system-spec-kit/runtime/hooks/pi/lib/claude-hook-adapter.ts:41–:56
- .skilled/skills/system-spec-kit/runtime/tests/session-start-context-pi-extension.vitest.ts (full; :49, :64)
- .skilled/bin/lib/mirror-sync-verify.cjs:11–:32, :374
- .skilled/bin/check-agent-mirror-sync.cjs:75, :105–:115, :147
- .skilled/bin/check-agent-mirror-sync.vitest.ts:155–:166
- .skilled/scripts/git-hooks/pre-commit:186–:204
- .skilled/hooks/git/pre-commit:92–:104
- .skilled/scripts/git-hooks/tests/pre-commit.test.sh:25, :81, :529–:578, :686–:687, :892–:912
- .skilled/vitest.config.bin.ts:8; .skilled/skills/system-spec-kit/runtime/vitest.config.ts (alias block); .skilled/bin/README.md:221
- .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:23
- .skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts:60–:69
- .codex/hooks.json:5–:160
- .skilled/skills/sk-vision/SKILL.md:14; .skilled/skills/sk-vision/vision-runtime/package.json:11, :46; .skilled/skills/sk-vision/vision-runtime/scripts/build.ts:68
- .skilled/skills/sk-vision/changelog/v0.3.6.0.md; .skilled/skills/system-spec-kit/changelog/v2.7.11.0.md
- .hermes/skills/system-spec-kit/SKILL.md:5; .hermes/skills/sk-vision/SKILL.md:5; .skilled/skills/sk-vision/README.md:10
- .skilled/hooks/git/README.md:96–:104

## Findings by Severity

### P0 — none

No blocker: no exploitable issue, no auth bypass, no destructive data loss.

### P1 — none

No required fix: every probe either confirmed intended behavior or landed as an advisory below.

### P2 — 2 new, 5 carried

#### R5-P2-001 [P2] The legacy pre-commit helper's new exit-3 skip branch has no harness case

- **Case:** the mirror checker exits 3 (built parser unbuilt) while the compatibility helper `.skilled/hooks/git/pre-commit` runs as the installed pre-commit hook.
- **File:** `.skilled/hooks/git/pre-commit:99`
- **Evidence:** commit `54a2e9abbc` added the same `node "$MIRROR_CHECKER" … || MIRROR_RC=$?` capture and `-eq 3` warn/skip branch to the helper [SOURCE: .skilled/hooks/git/pre-commit:99]. The harness runs the helper through `run_legacy` [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:529] in six cases (`:544`, `:555`, `:562`, `:568`, `:578`, `:686`): case 36's checker exits 0, cases 37–38 cover missing checkers, and case 41 deliberately proves the *comment-hygiene* gate blocks a checker that exits 3 [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:686]. None plants a mirror checker exiting 3. The new cases 64–65 cover the skip and the drift block only for the primary hook through `run_hook` (`:25`, `:81`) [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:892]. Deferred row SL-406 asked exactly whether the helper's branch is exercised; the harness target is now read and the answer is no.
- **User impact:** a regression or drift in the helper's skip branch ships silently while the harness reports green; the two hook copies can diverge in behavior without a failing case.
- **Finding class:** matrix/evidence (coverage matrix gap).
- **Scope proof:** `rg -n "run_legacy"` lists every helper call site; only the comment-checker case (`:686`) uses exit 3, and it asserts the opposite semantics (block).
- **Recommendation:** add a helper case that stages an agent file and plants a mirror checker exiting 3, asserting rc 0 and the "not checkable" warning (mirror of case 64).

#### R5-P2-002 [P2] A parser that exists but fails to load is still reported as DRIFT with a resync remedy

- **Case:** `.skilled/skills/system-spec-kit/shared/dist/frontmatter/parse-frontmatter.js` exists but cannot be loaded (truncated or corrupted build output, unreadable file, renamed export). The checker then classifies it as drift instead of not-checkable.
- **File:** `.skilled/bin/lib/mirror-sync-verify.cjs:30`
- **Evidence:** only the `existsSync` miss is tagged; the tag is set at the missing-file branch [SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:22], while `loadedParseFrontmatter = require(PARSER_PATH).parseFrontmatter` [SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:30] throws an untagged error. The checker's catch special-cases only the tagged error [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:109] — `exit 3` — and every other error falls through to `drifted.push(name)` plus `DRIFT <name>: cannot verify` [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:114], exiting 1. The hook block then tells the user to resync mirrors [SOURCE: .skilled/scripts/git-hooks/pre-commit:193], though the real fix is a rebuild. The new regression test removes the `shared` link, covering only the missing-file state [SOURCE: .skilled/bin/check-agent-mirror-sync.vitest.ts:155]. Before the range the same load failure was a module-load crash (exit 1 with a stack trace), so the change narrows but does not close the false-drift diagnosis.
- **User impact:** a commit touching agent mirrors is blocked with the wrong remediation; fail-closed, so no desync slips through.
- **Finding class:** class-of-bug (the NOT-CHECKABLE classification is incomplete).
- **Scope proof:** `rg -n "process.exit"` over the checker and lib returns sites 0/3/1/0 only; the built parser is self-contained (no `require` calls in the emitted file), so the residual trigger is out-of-band corruption or an export rename.
- **Confidence:** medium — the state is reachable but not observed on this machine; downgrade trigger: if the emitted parser is provably write-protected in the build pipeline, only external corruption triggers it.
- **Recommendation:** wrap the whole lazy load (`existsSync` + `require` + export check) in the same tagged-error path, and add a vitest case that writes a corrupt parser file expecting exit 3.

#### Carried P2 findings, re-checked — all five still active, none resolved

- **R1-P2-001** — sk-vision README version carrier stale: `.skilled/skills/sk-vision/README.md:10` still `version: 0.3.5.0` while SKILL.md and the Hermes copy are `0.3.6.0` [SOURCE: .skilled/skills/sk-vision/README.md:10].
- **R1-P2-002** — Pi unbuilt notice can misdiagnose a non-root cwd: the notice tests `join(ctx.cwd, SESSION_PRIME_ADAPTER)` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts:49] and the adapter itself spawns from the same `ctx.cwd` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/lib/claude-hook-adapter.ts:43], so a session started in a subdirectory loses context and is told the runtime is not built even when it is built at the repository root.
- **R1-P2-003** — README trust-skip comment overstates skipped gates: README.md:181 says a second clone "skips every gate", while the commit-msg message contract runs outside the trust block [SOURCE: .skilled/scripts/git-hooks/README.md:32].
- **R1-P2-004** — the warn tests assert only the warning phrase, not the "Build its parser: npm --prefix …" remediation the hook prints [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:901].
- **R2-P2-001** — the hook README still describes the mirror gate as "Block (exit 1) or allow (exit 0). No advisory state" [SOURCE: .skilled/hooks/git/README.md:100]; the new skip is exactly an advisory state and no exit-3 mention exists in either hook README.

## Focus Probes Ruled Out (correctness depth)

- **Pi adapter present but crashing still returns silently** — examined and *not filed*: the notice is deliberately scoped to the missing-build cause; a present adapter that fails for any other reason yields no notice by design (fail-open, one-cause diagnostic), and a broad rebuild hint would be a false remediation. Recorded here as an examined probe.
- **Exit 3 collides with another meaning (including a usage exit 2)** — ruled out (third confirmation): the checker emits only 0, 3 and 1 [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:147]; no usage exit 2 exists in this tree; both hooks special-case exactly 3 and block every other non-zero [SOURCE: .skilled/scripts/git-hooks/pre-commit:193]. A node bootstrap failure exits 1 or 9, never 3.
- **README Verify Installation does not cover the new step-3 build** — examined and *not filed*: `rg` finds no build verification in the section, but the change's own Pi and Codex notices self-report a missing build at session start, so the system verifies the prerequisite where it matters.
- **First Use runtime spellings** — verified for all seven runtimes: `.opencode/commands/speckit/complete.md`, `.claude/commands/speckit/complete.md`, `.codex/prompts/speckit-complete.md`, `.cursor/commands/speckit-complete.md`, `.pi/prompts/speckit-complete.md`, `.hermes/prompts/speckit-complete.md` and `.devin/skills/system-spec-kit/SKILL.md` all exist, matching README.md:224.
- **Shell correctness under `set -euo pipefail`** — the `cmd || MIRROR_RC=$?` idiom is the correct capture (the `||` operand is errexit-exempt; `$?` is the command's status), `MIRROR_RC` is initialised, and both hooks keep every other non-zero exit blocking. No `if ! cmd; then rc=$?` trap present.
- **Test quality** — each new test fails on the pre-change code and passes after: checker test (old top-level `require` crashed before reaching exit 3), hook cases 64–65 (old branch blocked rc 1), Pi notice test (old bare `return` produced no notice), registry test (old message said "installer"). Wiring confirmed: `.skilled/vitest.config.bin.ts:8` includes `bin/**/*.vitest.ts`; the runtime config includes `runtime/tests/**`; the Pi test's relative import resolves through the vitest alias block in `.skilled/skills/system-spec-kit/runtime/vitest.config.ts`.
- **Security of new path handling** — no new attack surface: the parser path and the Pi notice suffix are static literals, the notice only calls `existsSync`, and the adapter spawn keeps `cwd` and quoted argv. Re-confirms iterations 1–2.
- **Prevent-overengineering** — the sentinel code, one lazy loader, one notice constant plus one `existsSync` are the smallest shapes that meet the requirement; no new options, layers or dependencies.

## Traceability Checks

- **spec_code: pass.** README's new claims map to carriers: step 3 `npm --prefix .skilled/skills/system-spec-kit run build` against the workspace `"build": "tsc --build"` script and the two outputs the new code names (session-prime.js and parse-frontmatter.js exist after the build); step 4 ordering "run it after step 2" against the advisor build running `npm --prefix ../../system-spec-kit/shared run build` first [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:11]; step 5 trust key against the hook's `git config --local --bool skilled.trustRepoHooks` read; First Use spellings against all seven runtime files.
- **checklist_evidence: pass.** Fail-before shapes read from pre-change code paths; runner coverage confirmed for the bin config and the runtime test glob; the CLI suite ran 7/7 in iteration 1.
- **agent_cross_runtime: pass.** `hook-registry.json:23` renders into `.codex/hooks.json:8`; the new guard asserts every runtime `defaultMessage` names the spec-kit runtime and none says "installer" [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts:60].
- **skill_agent: pass.** Hermes copies at 2.7.11.0 and 0.3.6.0 match their sources [SOURCE: .hermes/skills/system-spec-kit/SKILL.md:5].
- **feature_catalog_code: pass-with-advisory.** Both changelogs match the shipped changes; R1-P2-001 stays open.
- **playbook_capability: notApplicable.**

## Verdict

**PASS** — no P0 and no P1 this iteration; two new P2 advisories (R5-P2-001, R5-P2-002) and five carried P2 findings remain open for synthesis. SL-406 is resolved into R5-P2-001. Terminal stop reason: `maxIterationsReached`.

## Next Dimension

None — final iteration (5 of 5). All four dimensions covered; hand off to the synthesis phase.

Review verdict: PASS
