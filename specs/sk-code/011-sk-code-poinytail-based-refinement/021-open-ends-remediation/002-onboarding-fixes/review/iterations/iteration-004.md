# Iteration 004 — Maintainability

- Dispatcher: `/deep:review` loop, iteration 4 of 5 (stop_policy=max-iterations); mode=review; target_agent=deep-review; state read from `review/deep-review-state.jsonl`, registry, strategy and config.
- Target: git commit range `0039903bde..HEAD` (commits `dd001838f0`, `54a2e9abbc`, `424f28b8fc`).
- Focus: duplicated hook logic across the two pre-commit files; message wording consistency across Claude, Codex, Cursor, Devin and Pi; test quality and hermeticity; prevent-overengineering per `.skilled/repo-rules/prevent-overengineering.md`.

## Dimension

Maintainability — pattern compliance, documentation quality, clarity, and safe follow-on change cost. This iteration did not re-enter directions the strategy records as BLOCKED (exit-3 collision semantics, shell error handling, path/shell injection, fail-before/pass-after test shapes, stale remediation strings, version-carrier hygiene). It added the two directions the prior iterations had not examined directly: parity of the two parallel pre-commit hook patches, and the fixture/workspace dependency of the newly added tests.

## Files Reviewed

All reads were read-only. Prior executed evidence is marked as reused; everything else was read in this iteration.

- `.skilled/scripts/git-hooks/pre-commit` — exit-3 block, current lines 185-205 [SOURCE: .skilled/scripts/git-hooks/pre-commit:189]
- `.skilled/hooks/git/pre-commit` — parallel exit-3 block, current lines 90-110 [SOURCE: .skilled/hooks/git/pre-commit:95]
- `.skilled/bin/lib/mirror-sync-verify.cjs` — lazy parser load and sentinel error [SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:14]
- `.skilled/bin/check-agent-mirror-sync.cjs` — NOT CHECKABLE branch [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:109]
- `.skilled/bin/check-agent-mirror-sync.vitest.ts` — fixture lifecycle lines 42-57 and the new not-checkable test [SOURCE: .skilled/bin/check-agent-mirror-sync.vitest.ts:42]
- `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts` — adapter constant and notice gate [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts:12]
- `.skilled/skills/system-spec-kit/runtime/tests/session-start-context-pi-extension.vitest.ts` — both new cases [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/session-start-context-pi-extension.vitest.ts:49]
- `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` — new cases 64-65 [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:892]
- `.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts` — new wording test [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts:60]
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` — defaultMessage lines 8, 23, 36, 52 [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:23]
- `README.md` — install steps 1-5 and trust step [SOURCE: README.md:173]
- `.skilled/hooks/git/README.md` — boundary table (carried P2 recheck) [SOURCE: .skilled/hooks/git/README.md:100]
- `.skilled/skills/sk-vision/README.md` — version carrier (carried P2 recheck) [SOURCE: .skilled/skills/sk-vision/README.md:10]
- `.skilled/repo-rules/prevent-overengineering.md` — doctrine for the overengineering pass

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new this iteration. The five active P2 findings persist and none was resolved (re-check below).

### Carried P2 Re-Check (not new findings)

- R1-P2-001 — `.skilled/skills/sk-vision/README.md:10` still declares `version: 0.3.5.0` while the skill frontmatter and `changelog/v0.3.6.0.md` are at 0.3.6.0. Still active [SOURCE: .skilled/skills/sk-vision/README.md:10].
- R1-P2-002 — the Pi notice gate still tests `existsSync(join(ctx.cwd, SESSION_PRIME_ADAPTER))`, so a session started below the repo root can misdiagnose an unbuilt runtime. Still active [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts:49]. Note the new tests drive the notice with a temp-dir cwd, so they exercise the gate but not the non-root path.
- R1-P2-003 — `README.md:181` still says the trust setting stops a second clone from "skipping every gate", a stronger claim than what the hook actually reads. Still active [SOURCE: README.md:181].
- R1-P2-004 — new hook case 64 asserts the warning phrase only, not the `Build its parser: npm --prefix .skilled/skills/system-spec-kit run build` remediation it prints. Still active [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:901].
- R2-P2-001 — `.skilled/hooks/git/README.md:100` still says "Block (exit 1) or allow (exit 0). No advisory state"; the exit-3 warn-and-skip is absent from the boundary table. Still active [SOURCE: .skilled/hooks/git/README.md:100].

## Traceability Checks

- `spec_code` (core): pass — reused from iterations 1-3; this iteration's doc-surface reads found no claim contradicted by a carrier (the build command literal in `.codex/hooks.json` wording, the Pi notice, the mirror checker message and README step 3 all point at the same `npm --prefix .skilled/skills/system-spec-kit run build` operation).
- `checklist_evidence` (core): pass — prior executed evidence reused (checker suite 7/7, hook harness green with the new cases, Pi tests 2/2, registration sync 7/7, exit-3 before/after states). No new commands were executed this iteration, per the dispatch tooling bound; all new conclusions rest on direct reads.
- `skill_agent` (overlay): pass — reused from iteration 1 (68 Hermes skill copies in sync).
- `agent_cross_runtime` (overlay): pass — the registry change at line 23 renders into `.codex/hooks.json`; the new sync test at line 60 guards the cross-runtime wording invariant and the generated Codex file against the retired installer wording.
- `feature_catalog_code` (overlay): pass-with-advisory — changelog content matches the change; R1-P2-001 remains open.
- `playbook_capability` (overlay): notApplicable — no manual-testing-playbook behavior changed.

## Integration Evidence

- `.codex/hooks.json` is downstream-rendered from `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:23`; regenerated in commit `dd001838f0` and asserted by `.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts:60`.
- The pre-commit hooks consume the checker's exit contract: `.skilled/bin/check-agent-mirror-sync.cjs:111` is the only exit-3 emission site, and both hooks special-case exactly 3 [SOURCE: .skilled/scripts/git-hooks/pre-commit:194], [SOURCE: .skilled/hooks/git/pre-commit:100].
- The Pi extension's notice path is the built adapter `runtime/dist/hooks/claude/session-prime.js` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts:12].

## Edge Cases

- Coverage of the lean hook `.skilled/hooks/git/pre-commit`'s new exit-3 branch: the new harness cases live in `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`; whether `run_hook` targets that hook or its sibling was not read within this iteration's call budget. Recorded as deferred search-ledger row SL-406, not as a finding.
- `check-agent-mirror-sync.vitest.ts` (pre-existing fixture) symlinks the real `shared` package into each temp fixture, so the file's parser-dependent tests require a built workspace. The new test neither adds nor worsens that dependency (it passes in both built and unbuilt states); pre-existing design outside this commit range, noted not filed.
- The build-remediation command now appears as a literal in several languages (registry JSON, Pi TypeScript constant, mirror-verify message, both shell hooks, README). Consolidating it across shell/TS/JSON/Markdown would cost more than it saves; noted as intentional duplication, not a finding.
- The two hook patches differ cosmetically — `.skilled/hooks/git/pre-commit` omits the `[gate:agent-mirror-sync]` prefix and the bypass line that `.skilled/scripts/git-hooks/pre-commit` carries. That difference matches the two files' existing audiences (portable hook vs toolchain hook) and predates the range.

## Confirmed-Clean Surfaces

- Hook parity: both new blocks skip only on exactly 3, block every other non-zero with exit 1, and print the same build remedy. The RC-capture idiom `node ... || MIRROR_RC=$?` is correct under `set -euo pipefail` (verified in iterations 1-2 and re-read here).
- Test isolation: the new not-checkable test removes the `shared` symlink inside its own per-test `tmpDir`; `beforeEach` recreates the fixture and `afterEach` removes it, so no cross-test leakage or order dependency [SOURCE: .skilled/bin/check-agent-mirror-sync.vitest.ts:42].
- The Pi test file creates and cleans its own temp project roots and asserts both branches (notice on missing adapter, silence when the file exists) [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/session-start-context-pi-extension.vitest.ts:64].
- New hook cases stub the checker with inline scripts, so they exercise the hook's exit-3 handling without depending on the workspace build state [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:892].
- Message wording: every registry `defaultMessage` names the spec-kit runtime and none names an installer; the new test asserts exactly that invariant, and the generated `.codex/hooks.json` no longer carries the retired wording.
- Overengineering: the new code shapes are the smallest that meet the requirement — one sentinel code, one RC capture, two notice constants, one new test file. Iteration 1's SL-010 ruling re-confirmed.
- Comment hygiene: new comments carry durable WHY text only; no spec paths, packet numbers or ids.

## Ruled Out

- Parallel pre-commit hook duplication as a reportable defect: parity verified by direct read of both blocks; differences are intentional; the duplication predates the range and two instances do not earn a shared abstraction.
- Test-isolation defect in the new not-checkable test: `rmSync` is scoped to the test's own fixture; isolation is per-test.
- Runtime command-spelling variation as a defect: all messages name the spec-kit runtime; per-runtime phrasing differences were already adjudicated in iterations 2-3.
- Overengineering in the new checker/lib/Pi-hook code: smallest-shape pass against the reversal-cost ladder.

## SCOPE VIOLATIONS

None. No write outside the review packet was attempted or executed.

## Next Focus

Iteration 5 (final): synthesis. Reconcile the four dimensions, re-check the five carried P2s one last time, resolve or explicitly hand off deferred row SL-406, and record the terminal stop reason (`maxIterationsReached`) on the final record.

## Verdict

No new P0, P1 or P2 findings. All binary quality gates pass: evidence (every claim above cites file:line), scope (reads stayed inside the declared range plus the carried-P2 recheck surfaces), coverage (maintainability now reviewed; all four dimensions covered). Five P2 advisories remain active; verdict is PASS with advisories.

Review verdict: PASS
