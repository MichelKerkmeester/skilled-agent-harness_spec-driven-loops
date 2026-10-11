# Deep-Review Iteration 001 — correctness

Session `r2-onboarding-review-2026-10-11T19-30Z`, generation 1, lineage new. Route: mode=review, target_agent=deep-review (pre-resolved). Agent definition `.skilled/agents/deep-review.md` loaded; severity calls follow `.skilled/skills/sk-code/sk-code-review/references/review-core.md`.

Review target: commit range `0039903bde..HEAD` (`dd001838f0`, `54a2e9abbc`, `424f28b8fc`) on `worktrees/113-rem-onboarding-fixes`.

## Dimension

Primary: correctness. Security, traceability and maintainability were checked over the same evidence because the range is small; no findings were raised outside correctness.

## Files Reviewed

| File | What was checked |
| --- | --- |
| `.skilled/bin/lib/mirror-sync-verify.cjs:14-33` | lazy parser load, `MIRROR_SYNC_NOT_CHECKABLE`, exit-code contract |
| `.skilled/bin/check-agent-mirror-sync.cjs:104-116` | NOT CHECKABLE branch, drift path unchanged |
| `.skilled/scripts/git-hooks/pre-commit:192-205` | rc capture, skip/block branches under `set -euo pipefail` |
| `.skilled/hooks/git/pre-commit:96-110` | same, legacy invocation path |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh:889-914` | new cases 64/65 |
| `.skilled/bin/check-agent-mirror-sync.vitest.ts:155-165` | new exit-3 case and its fixture |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts:12,47-51` | notice trigger and adapter path |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/lib/claude-hook-adapter.ts:41-46` | spawn path the notice mirrors |
| `.skilled/skills/system-spec-kit/runtime/tests/session-start-context-pi-extension.vitest.ts` | new notice tests |
| `.codex/hooks.json`, `runtime-mirrors/hook-registry.json:20-25`, `hook-registration-sync.vitest.ts:60-67` | drift message regeneration and its test |
| `.skilled/skills/sk-vision/SKILL.md:13`, `.skilled/skills/sk-vision/README.md:10`, changelogs | version carriers |
| `README.md:160,181,203,218-224`, `CONTRIBUTING.md:25` | claimed engines, step order, trust key, runtime spellings |

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### R1-P2-001 — sk-vision README version carrier is left at 0.3.5.0

- **Claim:** The 0.3.6.0 release updates `SKILL.md`, the changelog and the Hermes copy, but the skill README frontmatter still declares `0.3.5.0`, so two version carriers of the same skill disagree. [SOURCE: .skilled/skills/sk-vision/README.md:10] [SOURCE: .skilled/skills/sk-vision/SKILL.md:5]
- **Evidence:** `.hermes/skills/sk-vision/SKILL.md:5` was regenerated to 0.3.6.0; `sk-git`, `sk-code` and `sk-doc` all keep README version == SKILL version.
- **Counterevidence sought:** searched for a parity validator; the skill-doc frontmatter guard covers references/assets only (READMEs exempt) and no parity rule exists in the sk-doc validators. `system-spec-kit` (README 2.7.0.99) and `system-skill-advisor` (README 0.12.0.54) already lag, so lag is tolerated elsewhere.
- **Alternative explanation:** the README version records the last catalog-validated edition rather than the current release.
- **Final severity:** P2 (metadata consistency, non-blocking). **Confidence:** medium. **Downgrade trigger:** none; upgrade if a release process is shown to require parity.

#### R1-P2-002 — the Pi unbuilt notice can misdiagnose a non-root working directory

- **Claim:** The notice keys on `<cwd>/.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js`; when a session's cwd is not the repository root while the runtime is built at the root, the spawn fails for the same cwd reason and the warning tells the user the runtime is not built. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts:49]
- **Evidence:** the spawn joins the identical cwd-relative path at `.skilled/skills/system-spec-kit/runtime/hooks/pi/lib/claude-hook-adapter.ts:41-46`, so the check cannot distinguish `not built` from `wrong cwd`. The relative literal is also duplicated in both files.
- **Counterevidence sought:** when cwd is the project root the check is exact (paths match) and it fires only after a null context, so a healthy build stays quiet. Pi loads this extension from the repository's own `.pi` configuration, so cwd is normally the project root.
- **Alternative explanation:** Pi may always pass the resource/project root as `ctx.cwd`, in which case the misfire cannot occur.
- **Final severity:** P2 (warning-only, never changes behavior). **Confidence:** medium. **Downgrade trigger:** Pi's contract states `ctx.cwd` is the project root.

#### R1-P2-003 — README step 5 says an untrusted clone skips every gate

- **Claim:** The new step-5 comment says `Without it, a second clone on the same machine skips every gate`. [SOURCE: README.md:181] The hook-trust block substitutes the source root so pre-commit tree gates are skipped, with its own notice saying `the pre-commit checks were skipped`; the commit-message contract still runs from the validator beside the hook. [SOURCE: .skilled/scripts/git-hooks/pre-commit:33-55]
- **Evidence:** the sk-git 032 hook-trust packet records `The message contract still runs there, because its validator comes from beside the hook`; the commit-msg hook carries no trust block. README:203 already states the precise version (this toolchain's scripts do not run).
- **Counterevidence sought:** read the trust block and its notice text; the phrase can also be read as `every gate this clone's tree would supply`, which is true.
- **Alternative explanation:** colloquial shorthand for the pre-commit gate set.
- **Final severity:** P2 (doc precision). **Confidence:** medium-high. **Downgrade trigger:** if commit-msg turns out to be tree-sourced too.

#### R1-P2-004 — new tests assert the warning, not the remediation the warning exists to deliver

- **Claim:** Both edits exist to name the build command, yet the new hook case asserts only `agent mirror-sync is not checkable` [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:901] and the new checker case asserts only `NOT CHECKABLE` and the absence of `DRIFT`. [SOURCE: .skilled/bin/check-agent-mirror-sync.vitest.ts:162-164] A regression that drops the `npm --prefix ... run build` line leaves the suites green.
- **Evidence:** the remediation strings live at `.skilled/bin/lib/mirror-sync-verify.cjs:24-25` and `.skilled/scripts/git-hooks/pre-commit:195-196`; by contrast the Codex message test does assert content (`expect ... toMatch(/spec-kit runtime/)`). [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts:60-67]
- **Counterevidence sought:** the cases do pin the behavioral contract (exit 3 skip, exit 1 block), which is the higher risk; the message content is one string away from covered.
- **Alternative explanation:** string assertions on two output lines were judged not worth the brittleness.
- **Final severity:** P2 (test quality, advisory). **Confidence:** high. **Downgrade trigger:** none.

## Verified Checks (focus evidence)

- **Exit-3 path, before/after by direct execution.** Temp fixtures around the real checker: new library with build present exits 0; build absent exits 3 with `NOT CHECKABLE` and the `npm --prefix .skilled/skills/system-spec-kit run build` line; the base library with the parser absent crashes with MODULE_NOT_FOUND and exits 1. `check-agent-mirror-sync.vitest.ts` passes 7/7 at HEAD.
- **Hook edits under `set -euo pipefail`.** Both hooks capture the status with `node ... || MIRROR_RC=$?` before testing it, which is correct under `set -e`; quoted comparison; exit 3 warns and skips, any other non-zero blocks. Full harness at HEAD: `97 passed, 0 failed`. The same harness run with the base hook (via `git show 0039903bde:...` into a temp copy) reports `96 passed, 1 failed`; the failing case is the new not-checkable one, so the new case fails before and passes after.
- **README claims.** Engines match the code: Code Mode's server `>=24.0.0 <25.0.0`, `@spec-kit/cli` `>=22.12.0`, advisor `^20.19.0 || >=22.12.0`; step 3's `tsc --build` produces the frontmatter parser and the hooks' dist files; the launcher (`skill-advisor.cjs`) only spawns its CLI and contains no install or build step, so the removed claim was false as stated; the trust key matches the hook trust block; runtime spellings check out (`.codex/prompts/speckit-complete.md` header, `.pi/prompts/speckit-complete.md`, `.cursor/commands/speckit-complete.md`, `.hermes/prompts/speckit-complete.md` plus `.hermes/SYNC.md` prompt mechanism, Devin with no command mirror and a `system-spec-kit` skill).
- **Exit-3 collision.** The checker used only 0/1 before; 3 is now reserved for NOT CHECKABLE and handled by both hooks; no other consumer of the checker exists; CI failing closed on 3 is the intended CI behavior. Ruled out.
- **Security of new path handling.** All new paths are static repository-relative constants; staged paths stay quoted; no user input reaches `require`/`existsSync`; no new injection surface. Ruled out.
- **Overengineering.** The lazy loader plus a sentinel error code is the smallest change that distinguishes not-checkable from drift; no new dependency, option, abstraction or speculative test was added. Ruled out. The one duplication worth folding is the adapter path literal noted in R1-P2-002.

## Traceability Checks

- **spec_code:** commits name `specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/002-onboarding-fixes` and map to research recommendations; no spec contradiction found. PASS.
- **checklist_evidence:** commit verification commands were re-run and reproduced (97/0, 7/7, 2/2, 7/7) plus before-states (old hook 96/1; old lib exit 1 vs new exit 3). PASS.
- **skill_agent:** `sync-skills-hermes.cjs --check` reports 68 skill copies in sync. PASS.
- **agent_cross_runtime:** `sync-hook-registrations.cjs --check` reports 4 registration files matching the 31-hook registry with 18 Pi extensions resolving. PASS.
- **feature_catalog_code:** changelogs `v2.7.11.0` and `v0.3.6.0` exist with content matching the code changes; the stale README carrier is R1-P2-001. PASS with advisory.
- **playbook_capability:** N/A — no manual-testing-playbook behavior changed.

## Scope Violations

None. The review target stayed read-only; no out-of-scope mutation was required.

## Verdict

Verdict: PASS — no P0 and no P1; four P2 advisories (metadata consistency, diagnostic precision, doc precision, test assertion strength).

## Next Dimension

maintainability. Suggested iteration-2 focus: version-carrier parity policy for skills (R1-P2-001), the duplicated adapter path behind R1-P2-002, and whether the remediation strings deserve direct assertions (R1-P2-004).

Review verdict: PASS
