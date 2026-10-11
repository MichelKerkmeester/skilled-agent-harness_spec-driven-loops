---
title: "Research: fresh-clone onboarding stumbles, ranked"
description: "Ten-iteration deep research that walks a fresh clone from install to the first routed request and the first spec packet, ranks every stumble by user impact, and recommends the smallest fix set."
trigger_phrases:
  - "fresh clone onboarding research"
  - "fresh clone stumbles ranked"
importance_tier: "normal"
contextType: "research"
---
# Research: fresh-clone onboarding stumbles, ranked

## 1. Executive Summary

A newcomer who clones this framework and follows the README hits two hard stops before the first routed request, and several quieter losses after it. The two hard stops are both documentation faults with one-line fixes:

- The README promises that the advisor launcher installs and builds its own runtime on first run. It does not. On a pristine clone the advisor CLI exits 1 with `Cannot find module '@spec-kit/shared/workspace/repo-root.mjs'` [SOURCE: README.md:162] [SOURCE: .skilled/bin/skill-advisor.cjs:24].
- The README names Node 20.19 and 22.12, but the Code Mode MCP server only runs on Node 24.x. On a machine whose only Node is 26 the launcher refuses with `no Node interpreter satisfies >=24.0.0 <25.0.0` [SOURCE: README.md:160] [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/package.json:43].

Of the five known stumbles the spec named, two are real as stated (the Node floor confusion, though the real constraint is Node 24 rather than 20.19 against 22.12; and hook trust, which is a discoverability gap), one is real by a different mechanism (sk-vision: the unbuilt `dist` breaks the shipped plugin symlink, not the tests), and two are not stumbles on the first-packet path today (the `z_archive` routing source ships complete in every clone; worktree provisioning is never reached before the first packet).

The walk also found what nobody had listed: nothing on the documented path builds `system-spec-kit/runtime/dist`, so five runtimes print drift notices every session and Pi loses its session-start context silently; Codex's drift notice points at a tool that cannot fix the drift; and the tracked `.claude/settings.json` ships `bypassPermissions` plus a spec-gate switch-off to every external user.

The smallest fix set is eleven edits across five surfaces, nine of them prose or one value, and none adds a file, an abstraction or a dependency.

## 2. Scope and Evidence Standard

- Question: walking a fresh clone from install to the first routed request and the first spec packet, what are all the stumbles, ranked; is each known stumble real today; and what is the smallest fix set, ranked by user impact [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/spec.md:69-71].
- Fixture: disposable clones of the tree at HEAD `82a71c87d0`, made under the session scratchpad and removed at the end. Iterations probed one clone; the orchestrator re-verified the load-bearing claims on a second, pristine clone.
- Every `[SOURCE: path:line]` below was read by the orchestrator after the loop. Claims built from command output carry `[INFERENCE: ...]` with the probe named.
- Out of scope: changing any install doc, script or runtime file, and anything past the first spec packet.

## 3. The Documented Path

README section 4 is the only end-to-end install path: clone, `npm --prefix .skilled/skills/system-spec-kit install`, then the advisor runtime install and build, then `node .skilled/bin/skill-advisor.cjs list-tools --format json`, then "Open OpenCode in your project directory" [SOURCE: README.md:170] [SOURCE: README.md:174] [SOURCE: README.md:175] [SOURCE: README.md:212]. CONTRIBUTING.md states a different floor, `Node.js 18+` [SOURCE: CONTRIBUTING.md:25], and PUBLIC-RELEASE.md describes the maintainer release workflow, not an install path (iteration 1).

## 4. Node Floors (Q2)

| Surface | Declared floor | Source |
|---|---|---|
| spec-kit CLI | `>=22.12.0` | [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/package.json:8] |
| advisor runtime | `^20.19.0 \|\| >=22.12.0` | [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:7] |
| Code Mode MCP server | `>=24.0.0 <25.0.0` | [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/package.json:43] |
| README prerequisites | 20.19+, 22.12+ for the CLI | [SOURCE: README.md:160] |
| CONTRIBUTING | 18+ | [SOURCE: CONTRIBUTING.md:25] |

- The 20.19 against 22.12 mismatch is warn-only: on Node 20.19.5 npm prints `EBADENGINE` for `@spec-kit/cli` and exits 0, and the documented path then passes (iteration 2, finding 4) [INFERENCE: iteration 2 clone probes; not re-run by the orchestrator].
- The binding constraint is Code Mode's Node 24.x window. The orchestrator reproduced the refusal on the pristine clone with only Node 26 on PATH and an empty HOME: exit 1, `Cannot start the MCP server: no Node interpreter satisfies >=24.0.0 <25.0.0` [INFERENCE: orchestrator probe of `.skilled/bin/mcp-code-mode-launcher.cjs`, this synthesis]. A machine with nvm, fnm or volta holding a Node 24 self-heals, because the resolver scans those layouts (iteration 2, finding 6).
- Node 24.x is the only line that satisfies every declared floor at once.

## 5. The Advisor First Run

- Pristine clone, no installs: `list-tools` and `advisor_recommend` both exit 1 with `Cannot find module '@spec-kit/shared/workspace/repo-root.mjs'` [INFERENCE: orchestrator probes on the pristine clone, this synthesis].
- After README step 2 only: `advisor_recommend` still exits 1, now on the missing `system-skill-advisor/runtime/dist/runtime/skill-advisor-cli.js` [INFERENCE: orchestrator probe, this synthesis].
- Running step 3's build before step 2 exits 1 with TS2591 and TS2503, because the advisor build compiles spec-kit's `shared` package with types that only step 2 installs [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:11] (iteration 2, finding 3).
- The trigger-index lookup needs no install and exits 0 on the pristine clone [INFERENCE: orchestrator probe, this synthesis].

## 6. The Known Stumbles, Confirmed or Refuted (Q2, Q3, Q4)

| Known stumble | Real today? | What it costs the user |
|---|---|---|
| Node 20.19 against 22.12 | Real as confusion, warn-only in effect; the hard floor is Code Mode's Node 24.x | A single-Node machine is refused before the first routed request |
| sk-vision tests fail until `vision-runtime/dist` is built | Refuted as stated; tests import source [SOURCE: .skilled/skills/sk-vision/vision-runtime/python/runtime.test.ts:75]. Real by another mechanism: the tracked plugin symlinks `.opencode/plugins/sk-vision.js` and `.skilled/plugins/sk-vision.js` both point at the unbuilt `dist/plugin.js` | `/vision` fails with ENOENT until `bun install && bun run build`; README never mentions Bun [SOURCE: .skilled/skills/sk-vision/vision-runtime/package.json:46] |
| Compiled routing depends on `specs/sk-doc/z_archive/...` | Real dependency, not a stumble: the authored tree is tracked and present in every clone [SOURCE: .skilled/bin/lib/compiled-route-layout.cjs:54] [SOURCE: .skilled/bin/compiled-route-sync.cjs:40] | None today; a future specs cleanup that moves it would block commits [SOURCE: .skilled/scripts/git-hooks/pre-commit:539] |
| Worktree provisioning | Not on the first-packet path; it is a mandatory A/B choice at the first git-workspace action (iteration 3, finding 5) | None before the first packet |
| Hook trust (`skilled.trustRepoHooks`) | Real, as a discoverability gap: the trust line is mid-prose, outside the numbered steps [SOURCE: README.md:197] | A second clone skips every gate, with only a stderr NOTICE [SOURCE: .skilled/scripts/git-hooks/pre-commit:48] |

The first-session hook install itself works in the main checkout: `check-git-hooks.sh` self-heals the install from every runtime's SessionStart chain, independent of trust (iteration 5, finding 1) [SOURCE: README.md:191].

## 7. Stumbles Found on the Walk (Q5)

1. **Nothing on the documented path builds `system-spec-kit/runtime/dist`.** The repository tracks zero files there [INFERENCE: `git ls-files` count 0, orchestrator probe], and the workspace's only install-time script records the Node version [SOURCE: .skilled/skills/system-spec-kit/package.json:25]. The build exists but is never invoked [SOURCE: .skilled/skills/system-spec-kit/runtime/package.json:17]. Claude, Codex, Cursor and Devin SessionStart chains fall back to `mk-hook-drift` notices every session (iterations 5 and 6).
2. **Pi loses session-start context with no signal.** The extension returns silently when the dist adapter yields nothing [SOURCE: .pi/extensions/session-start-context.ts:42], and the adapter returns null on any failure [SOURCE: .pi/extensions/lib/claude-hook-adapter.ts:57] (iterations 6 and 10).
3. **Codex's drift notice names a tool that cannot fix the drift.** Its default message says "re-run the codex hooks installer with --check" [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:23]; that installer reconciles the user-global Codex hook file and builds nothing. Devin's notice names the working command [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:52]. The string is generated into `.codex/hooks.json` [SOURCE: .codex/hooks.json:8] (iteration 8).
4. **The tracked Claude settings switch off permission prompts and the spec gate for every user.** `defaultMode: bypassPermissions` [SOURCE: .claude/settings.json:5], `skipDangerousModePermissionPrompt: true` [SOURCE: .claude/settings.json:7] and `SYSTEM_SPEC_GATE_ENFORCE: "0"` [SOURCE: .claude/settings.json:39], while a gitignored operator-local home already exists [SOURCE: .gitignore:316] [SOURCE: .claude/SYNC.md:37]. How Claude Code applies project settings at startup was not observed in a live session (iteration 10, finding 2). The `.pi/settings.json` `defaultProjectTrust` line [SOURCE: .pi/settings.json:12] is inert at project scope per Pi's own docs (iteration 10, finding 1).
5. **The pre-commit mirror gate misreports a crash as drift.** The checker loads the built parser from `shared/dist` [SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:13], which no documented step builds; any nonzero exit lands in the drift branch [SOURCE: .skilled/hooks/git/pre-commit:95] and prints "staged agent files desync the .opencode / .claude mirrors" [SOURCE: .skilled/hooks/git/pre-commit:97]. CI builds the parser first [SOURCE: .github/workflows/agent-mirror-sync.yml:24]. Only triggered by staging an agent file (iteration 7). The crash itself was inferred from Node's module resolution, not executed.
6. **First Use names only OpenCode** [SOURCE: README.md:212] while seven runtimes ship wired configs (iterations 1 and 5).
7. **Tracked clutter.** 36 empty `.skilled_skills_*` files at the repository root [INFERENCE: `git ls-files` count 36, orchestrator probe on the pristine clone] and several dangling tracked symlinks (iteration 4, finding 3). No observed failure names them.

## 8. Corrections Made During Verification

- Iteration 4 finding 1 said the first routed request in a bare clone "is not blocked" and answers from a degraded local scorer. That probe ran on a clone earlier iterations had already installed into. On a pristine clone `advisor_recommend` exits 1 with the same module error as `list-tools` [INFERENCE: orchestrator probe, this synthesis]. The degraded local scorer is not what a newcomer meets.
- Iteration 3 finding 6(c) said `.skilled/plugins/sk-vision.js`, named at [SOURCE: .skilled/skills/sk-vision/SKILL.md:208], does not exist. It exists, as a second tracked symlink to the same unbuilt `dist/plugin.js` [INFERENCE: `ls -la .skilled/plugins`, orchestrator probe]. The doc is not wrong about the path; both shims dangle until the build.
- Iteration 5 finding 4's Pi half is withdrawn per iteration 10 finding 1.

## 9. Ranking Method

Rank is user impact along the walk: a hard stop before the first routed request outranks a silent degradation, which outranks a misleading message, which outranks a gap off the first-packet path. Where two rank alike, the cheaper move goes first. Every move was passed through the reversal-cost order in `.skilled/repo-rules/prevent-overengineering.md` [SOURCE: .skilled/repo-rules/prevent-overengineering.md:60-66], and every move above Build nothing states what fails at the cheaper move.

## 10. Prevent-Overengineering Notes

- Nine of the eleven fix rows are a one-line value change or an in-place extension of an existing doc block. The two code-touching rows (R5 and R9) each extend an existing branch in an existing file and reuse a convention the same file already uses.
- Declined as not earned: any fix for the `z_archive` routing dependence, tracking built `dist` output, a second inline frontmatter parser in the mirror checker, per-binding Codex messages, rewording the Claude and Cursor notices, and a `postinstall` build hook.

## 11. Recommendations

| ID | Recommendation | Evidence | Move | Why the cheaper move fails |
|---|---|---|---|---|
| R1 | Delete the README claim that the advisor launcher installs and builds its own runtime on first run | README.md:162; .skilled/bin/skill-advisor.cjs:24; pristine-clone probe: `list-tools` exits 1 with `Cannot find module '@spec-kit/shared/workspace/repo-root.mjs'` | Change a value | Build nothing leaves a false promise that sends a reader past steps 2 and 3 into a raw module-resolution stack trace |
| R2 | Name Code Mode's exact Node range (24.x) in the README prerequisites, and align CONTRIBUTING's `18+` to the same line | README.md:160; CONTRIBUTING.md:25; .skilled/skills/mcp-code-mode/mcp-server/package.json:43; pristine-clone probe: launcher exits 1 with `no Node interpreter satisfies >=24.0.0 <25.0.0` | Change a value | Build nothing leaves a single-Node 20, 22 or 26 machine refused before the first routed request with no prerequisite that warned it |
| R3 | Move `bypassPermissions`, `skipDangerousModePermissionPrompt` and the `SYSTEM_SPEC_GATE_ENFORCE` env out of the tracked `.claude/settings.json` into the gitignored `.claude/settings.local.json`, and drop the inert `defaultProjectTrust` line; confirm the startup effect in one live Claude Code session first, since that was not observed | .claude/settings.json:5; .claude/settings.json:7; .claude/settings.json:39; .gitignore:316; .claude/SYNC.md:37; .pi/settings.json:12 | Change a value | Build nothing ships "skip all prompts" and a spec-gate switch-off to every external Claude Code user with no doc naming either; a docs warning alone leaves the shipped default in place |
| R4 | Add one README step that builds the spec-kit workspace (`npm --prefix .skilled/skills/system-spec-kit run build`) after the install in step 2 | README.md:170; .skilled/skills/system-spec-kit/package.json:25; .skilled/skills/system-spec-kit/runtime/package.json:17 | Extend in place | Changing a value cannot help because no existing line names this build; without the step, nothing produces `runtime/dist`, and five runtimes degrade every session |
| R5 | Print a one-line notice naming the spec-kit build when Pi's session-start adapter returns nothing | .pi/extensions/session-start-context.ts:42; .pi/extensions/lib/claude-hook-adapter.ts:57 | Extend in place | Changing a value cannot add a message where the code returns silently; Pi is the only dist consumer whose user cannot learn the cause |
| R6 | Change Codex's default drift message to name the spec-kit runtime build, then regenerate `.codex/hooks.json` with the existing generator | .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:23; .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:52; .codex/hooks.json:8 | Change a value | Build nothing keeps sending Codex users to a user-global config cleaner that reports OK while the drift persists |
| R7 | State sk-vision's Bun prerequisite and its `bun install && bun run build` setup where sk-vision is introduced | .skilled/skills/sk-vision/vision-runtime/package.json:11; .skilled/skills/sk-vision/vision-runtime/package.json:46; .skilled/skills/sk-vision/SKILL.md:290 | Extend in place | Changing a value cannot help because no prerequisite line mentions Bun; without the setup both tracked plugin symlinks dangle and `/vision` fails with ENOENT |
| R8 | Put `git config --local skilled.trustRepoHooks true` into the numbered install region, not only mid-prose | README.md:197; README.md:191; .skilled/scripts/git-hooks/pre-commit:48 | Extend in place | Build nothing leaves the trust key outside the numbered steps, so a user who follows only those steps commits from a second clone with every gate skipped |
| R9 | Make the mirror checker report "not checkable" separately from drift, and let the pre-commit hook warn-skip that case as it already does for a missing `node` | .skilled/hooks/git/pre-commit:93; .skilled/hooks/git/pre-commit:95; .skilled/hooks/git/pre-commit:97; .skilled/bin/lib/mirror-sync-verify.cjs:13 | Extend in place | Changing a value cannot split one exit code into two meanings; today a missing built parser blocks the commit with a desync diagnosis that is false |
| R10 | Say in step 3 that it needs step 2 finished | README.md:172; .skilled/skills/system-skill-advisor/runtime/package.json:11 | Change a value | Build nothing leaves the order implicit, and running the advisor build first fails with TS2591 and TS2503 |
| R11 | Point First Use at all seven runtimes, not only OpenCode | README.md:212 | Extend in place | Changing a value would only swap one runtime name for another; six shipped runtimes keep no documented first step |
| R12 | Leave the 36 empty `.skilled_skills_*` root files and dangling tracked symlinks alone unless an unrelated root cleanup is already happening | specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/research/iterations/iteration-004.md:38; pristine-clone probe: `git ls-files` lists 36 empty root files | Build nothing | (Build nothing) No observed failure names them; fixing them now is the "while we're here" signal |
| R13 | Leave the compiled-routing `z_archive` source where it is | .skilled/bin/lib/compiled-route-layout.cjs:54; .skilled/bin/compiled-route-sync.cjs:40 | Build nothing | (Build nothing) The authored tree ships in every clone, so no requirement exists today that a move would serve |
| R14 | Leave worktree provisioning as is for onboarding | .skilled/skills/sk-git/SKILL.md:207 | Build nothing | (Build nothing) No worktree is created or needed before the first spec packet |

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| sk-vision tests fail until `dist` is built | Tests import source and spawn `python/runtime.py` | .skilled/skills/sk-vision/vision-runtime/python/runtime.test.ts:75 | 3, 4 |
| `z_archive` routing source missing in a clone | The tree is tracked and present in the clone | .skilled/bin/lib/compiled-route-layout.cjs:54 | 3 |
| Root-level single `npm install` | No root `package.json`; installs are per workspace | iteration 1 probe | 1 |
| PUBLIC-RELEASE.md as the install path | It is the maintainer release workflow | iteration 1 read | 1 |
| Advisor answers from a degraded scorer on a pristine clone | Probe ran on an already-installed clone; pristine clone exits 1 | orchestrator probe, section 8 | 4 |
| Tracked `defaultProjectTrust` bypasses Pi trust | Pi reads it only from agent-directory settings | iteration 10 | 5, 10 |
| Editing generated `.codex/hooks.json` directly | Both `--check` gates flag hand edits | .skilled/scripts/git-hooks/pre-commit:272 | 8 |
| Tracking built parser output, or inline-parsing frontmatter | Generated-output drift, or a second parser to keep in step | iteration 7 | 7 |

## Divergence Map

- Saturated directions: none recorded by the registry; the run used the default convergence mode with stop policy max-iterations.
- Pivots taken: none. Iterations 5 to 8 broadened from the README path to session-start adapters, the mirror gate and the Codex notice, each found by following an earlier finding's consumer chain.
- Remaining frontier: live Claude Code startup precedence for project settings (R3), and npm 11's skipped dependency install scripts (open question 2).

## 12. Open Questions

1. Does Claude Code apply `bypassPermissions` and `skipDangerousModePermissionPrompt` from a tracked project `settings.json` on a stranger's first session? One live session in a fresh clone settles it before R3 is implemented.
2. npm 11.19 skips the dependency install scripts of `esbuild`, `fsevents`, `onnxruntime-node` and `protobufjs` until approved [INFERENCE: orchestrator probe of step 2 output]. `tsx` still worked in the probe. Whether any feature on the first-packet path needs `onnxruntime-node`'s postinstall is UNKNOWN; running the first `/speckit:complete` on a pristine clone with npm 11 settles it.
3. The Node 20.19 warn-only result came from iteration 2's clone and was not re-run on the pristine clone.

## 13. Cost to the User, by Stage

| Stage | Stumble | Kind |
|---|---|---|
| Reading prerequisites | R1, R2 | Hard stop later, caused here |
| Install | R10 | One failed build if steps run out of order |
| First routed request | R1, R2 | Hard stop |
| Every session after | R4, R5, R6 | Silent or misleading degradation |
| First Claude Code session | R3 | Silent policy change (inferred) |
| First `/vision` | R7 | Hard stop for that feature |
| First commit from a second clone | R8 | Silent gate skip |
| First staged agent edit | R9 | Commit blocked with a false diagnosis |

## 14. Iteration Log

| Iteration | Focus | newInfoRatio |
|---|---|---|
| 1 | Documented install path (Q1) | 0.85 |
| 2 | Node-floor matrix and reproduction (Q2) | 0.79 |
| 3 | sk-vision, z_archive, worktree, hook trust (Q3, Q4) | 0.89 |
| 4 | Remaining walk stumbles, first fix set (Q5) | 0.77 |
| 5 | Non-OpenCode first-session surfaces | 0.80 |
| 6 | Session-start remedy chain | 0.88 |
| 7 | Mirror-gate hermeticity | 0.88 |
| 8 | Codex drift-notice fix | 0.75 |
| 9 | Consolidated ranked fix set | 0.50 |
| 10 | Tracked settings, Pi silence, frozen set | 0.60 |

## 15. Verification Performed by the Orchestrator

- Read every cited `path:line` in sections 3 to 11 and the Recommendations table against the tree at HEAD `82a71c87d0`.
- Re-ran on a pristine clone: the advisor `list-tools` and `advisor_recommend` failures (R1), the Code Mode launcher refusal with only Node 26 (R2), the step-2-only advisor state, the trigger-index lookup, and the 36 tracked root files (R12).
- Corrected two iteration claims (section 8).

## 16. Executor Provenance

All ten iterations ran through the cli-pi executor on the DevPass route, `pi -p --offline --model llmgateway/deepseek-v4.1-flash --thinking max`, as recorded in `research/dispatch-receipts/`. No usage limit was hit, so the cline-pass fallback was not used.

## 17. References and Convergence Report

- Iterations: `research/iterations/iteration-001.md` to `iteration-010.md`.
- State: `research/deep-research-state.jsonl`, `research/findings-registry.json`, `research/deep-research-dashboard.md`, `research/resource-map.md`.

## Convergence Report
- Stop reason: maxIterationsReached
- Total iterations: 10
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 8: Codex drift-notice fix (0.75); run 9: consolidated ranked fix set (0.5); run 10: tracked settings, Pi silence, frozen set (0.6)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
