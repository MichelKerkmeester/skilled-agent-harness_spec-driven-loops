# Deep-Review Iteration 002 — security

Session `r2-onboarding-review-2026-10-11T19-30Z`, generation 1, lineage new. Route: mode=review, target_agent=deep-review (pre-resolved). Agent definition `.skilled/agents/deep-review.md` loaded; severity calls follow `.skilled/skills/sk-code/sk-code-review/references/review-core.md`.

Review target: commit range `0039903bde..HEAD` (`dd001838f0`, `54a2e9abbc`, `424f28b8fc`) on `worktrees/113-rem-onboarding-fixes`.

## Dimension

Primary: **security** — path handling and shell safety. Four focus questions ran: (1) can the Pi notice path join on `ctx.cwd` be steered or injected; (2) is the regenerated `.codex/hooks.json` fallback safely quoted around the new message inside `bash -c`; (3) does the `MIRROR_RC` capture and branch in both pre-commit hooks behave correctly under `set -euo pipefail` and fail closed for every non-3 exit; (4) can the not-checkable skip be abused to bypass the mirror gate, and does exit 3 collide with another meaning. Correctness, traceability and maintainability surfaces over the same evidence were checked alongside; the one P2 below is a traceability finding surfaced by question (4).

## Files Reviewed

| File | What was checked |
| --- | --- |
| `.skilled/bin/lib/mirror-sync-verify.cjs:14-30` | static parser path, lazy load, `MIRROR_SYNC_NOT_CHECKABLE` error code |
| `.skilled/bin/check-agent-mirror-sync.cjs:104-116` | NOT CHECKABLE branch, exit 3, drift path unchanged |
| `.skilled/scripts/git-hooks/pre-commit:186-206` | `MIRROR_RC` capture, exact-3 skip vs every other non-zero block |
| `.skilled/hooks/git/pre-commit:92-110` | same behavior on the legacy invocation path |
| `.codex/hooks.json:8,13,18,28` | regenerated fallback strings, quoting and JSON envelope |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:23` | codex `defaultMessage`, the source of the new text |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts:60-68` | message-content test and its before/after behavior |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts:12,47-51` | notice trigger and `existsSync(join(ctx.cwd, ...))` |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/lib/claude-hook-adapter.ts:41-56` | spawn path the existence check mirrors |
| `.skilled/skills/system-spec-kit/runtime/tests/session-start-context-pi-extension.vitest.ts:49-78` | new notice tests (behavior case and quiet guard) |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh:892-912` | new cases 64/65 |
| `.skilled/bin/check-agent-mirror-sync.vitest.ts:155-165` | new exit-3 case and its fixture |
| `.skilled/hooks/git/README.md:29,78,100,101` | behavior documentation of the gate |
| `.skilled/scripts/git-hooks/README.md:24` | primary pre-commit gate description |
| `.skilled/bin/README.md:167` | checker description and its CI claim |
| `.github/workflows/agent-mirror-sync.yml:1-45` | CI builds the parser, fails closed on missing checker or non-zero exit |

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **R2-P2-001 — hook READMEs still describe the mirror gate as block-or-allow; the new exit-3 skip is undocumented** -- `.skilled/hooks/git/README.md:100` -- The gates documentation enumerates two outcomes for the agent mirror gate, block at exit 1 or allow at exit 0; commit `54a2e9abbc` adds a third, warn-and-skip when the built parser is missing, and no non-spec doc mentions it.
Case: a contributor commits from a fresh clone whose spec-kit build is missing; the hook prints a warning and the commit proceeds, while the README they consult states the gate "Blocks on violations; exits 0 otherwise".
Finding class: instance-only
Scope proof: `rg -n -i "checkable|exit 3|exit-3"` over `.skilled/hooks/git/README.md`, `.skilled/scripts/git-hooks/README.md`, `.skilled/bin/README.md`, `.skilled/bin/agent-mirror-crosswalk.md` and `.skilled/CROSS-CLI.md` returns no match, and `rg -n -i "not checkable" .skilled --glob '*.md' --glob '!specs/**'` returns nothing; the decisions row cited here is the only exit-code enumeration.
Affected surface hints: [".skilled/hooks/git/README.md", ".skilled/scripts/git-hooks/README.md", ".skilled/bin/README.md"]
- **Evidence:** [SOURCE: .skilled/hooks/git/README.md:100] "Block (exit 1) or allow (exit 0). No advisory state: both gates are blocking when they fire."; [SOURCE: .skilled/hooks/git/README.md:78] the responsibility row names fail-open only for "a missing `node` or the checker"; [SOURCE: .skilled/hooks/git/README.md:101] the Failure row names that same missing-prerequisite case only; [SOURCE: .skilled/scripts/git-hooks/pre-commit:194] implements the warn-and-skip branch (`if [[ "$MIRROR_RC" -eq 3 ]]`); [SOURCE: .skilled/scripts/git-hooks/README.md:24] counts the blocking sub-gates without the skip outcome.
- **Counterevidence sought:** the "when they fire" qualifier can be read as covering a gate that never fires, and the Failure row's "warns and skips" pattern is the right outcome family. Both readings still leave exit 3, its condition and its remediation absent from every doc, which is the claim.
- **Alternative explanation:** the docs intentionally describe only the outcomes of a gate that runs, leaving prerequisite skips to the Failure row's pattern.
- **User impact:** an operator reading the docs cannot tell that a skipped commit was never checked, and the skip fires exactly on the fresh-clone path.
- **Final severity:** P2 (documentation drift, no runtime behavior change). **Confidence:** high. **Downgrade trigger:** none; upgrade if the README becomes the operator's only evidence that the gate ran.
- **Recommendation:** extend the decisions and failure rows of both hook READMEs with the not-checkable outcome and the `npm --prefix .skilled/skills/system-spec-kit run build` remediation.

Carried from iteration 1, active and not re-raised here: R1-P2-001 (sk-vision README version carrier), R1-P2-002 (Pi notice cwd misfire), R1-P2-003 (README trust-skip wording), R1-P2-004 (warn tests do not assert the build remediation).

## Traceability Checks

- **spec_code — PASS.** Every changed claim maps to research recommendations R1, R2 and R4-R11 in `002-fresh-clone-onboarding/research/research.md` §11; no spec contradiction found.
- **checklist_evidence — PASS.** Iteration 1's executed evidence (97/0 hook harness; 7/7 checker suite; base-state 96/1 and exit 1) is reused; iteration 2 re-verified the generated-string claims by decoding `.codex/hooks.json`, running `bash -n` on every payload and re-executing each envelope `printf` through bash before `JSON.parse` (19 commands, 0 parse failures, 18/18 envelopes valid, 0 payloads containing a single quote).
- **skill_agent — PASS** (iteration 1): `sync-skills-hermes.cjs --check` reported 68 skill copies in sync.
- **agent_cross_runtime — PASS.** Registration files are byte-rendered from `hook-registry.json`; the codex `defaultMessage` at [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:23] is what produced the `.codex/hooks.json` diff, and the new test asserts every runtime message names the spec-kit build and none names the installer ([SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts:60]).
- **feature_catalog_code — PASS with advisory.** Changelogs exist with content matching the changes; R1-P2-001 (stale sk-vision README carrier) remains open.
- **playbook_capability — N/A.** No manual-testing-playbook behavior changed.

## Edge Cases

- `.codex/hooks.json` carries 19 command bindings; 18 register a drift envelope and the 19th is a non-envelope binding by design. All 19 payloads parse under `bash -n`; all 18 envelopes re-emit valid JSON when their `printf` argument is executed through bash.
- `MIRROR_RC` is initialized before capture, so `set -u` cannot fire; a checker killed by a signal yields 128+n and still blocks.
- The renderer escapes `"` only (`driftEnvelope` in `sync-hook-registrations.cjs`); the new message needs no more, but a future message containing `'`, `$` or a backtick would stress that escape. The renderer is outside this commit range and unmodified, so this is a residual hardening note, not a finding.
- New-test before/after: the sync test fails before the change because the codex message contained "installer" and `.codex/hooks.json` contained "codex hooks installer"; the Pi notice behavior case fails before (no notice existed) and passes after; the checker exit-3 case failed before (MODULE_NOT_FOUND, exit 1); pre-commit case 64 failed before (the old hook blocked). The companion cases (Pi quiet case, pre-commit case 65) pass both before and after and act as non-regression guards.
- The agent-mirror-sync workflow builds the shared parser and fails closed on a missing checker or on checker non-zero, so a local exit-3 skip cannot pass CI.

## Confirmed-Clean Surfaces

- Quoting: all 19 decoded command payloads pass `bash -n`; none contains a single quote; all 18 envelope bindings re-emit parseable JSON whose `additionalContext` names the build. [SOURCE: .codex/hooks.json:8]
- Exit contract: `process.exit(3)` is emitted only from the NOT_CHECKABLE branch; a parser that exists but fails to load takes the drift path and exits 1. [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:109]
- Hook branching: both hooks capture with `node "$MIRROR_CHECKER" ... || MIRROR_RC=$?`, warn and fall through on exactly 3, and `exit 1` on every other non-zero. [SOURCE: .skilled/scripts/git-hooks/pre-commit:194]
- Path handling: the Pi existence check joins a static literal to `ctx.cwd` and reads no file content; the adapter spawn path is pre-existing code. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts:49]
- Messages: all new diagnostic strings are static literals with no environment or secret interpolation.

## Ruled Out

- Shell injection through the regenerated fallback message: the message contains no single quote, dollar, backtick or backslash; the generated envelope argument was executed through bash and every envelope parsed. [SOURCE: .codex/hooks.json:8]
- Mirror-gate bypass by inducing exit 3: the skip is loud, names the build remedy, is specific to a missing built parser, and the documented whole-chain kill switch is an easier bypass; the agent-mirror-sync workflow is the fail-closed backstop. [SOURCE: .github/workflows/agent-mirror-sync.yml:1]
- Pi notice path injection through `ctx.cwd`: the joined suffix is a static literal and the check only tests existence. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts:49]
- Exit-code 3 collision with another checker meaning: 3 is emitted only from the NOT_CHECKABLE branch, both hooks special-case exactly 3, and no other caller executes the checker. [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:109]

## Scope Violations

None. The review target stayed read-only; writes were confined to the allowed review-packet artifacts.

## Verdict

PASS — no P0 and no P1 this iteration; one new P2 (R2-P2-001) plus the four carried P2 advisories. `hasAdvisories=true`.

## Next Dimension

traceability — map each commit claim to its research recommendation and cross-runtime registration evidence, and re-check R2-P2-001 plus the carried P2s for resolution.

Review verdict: PASS
