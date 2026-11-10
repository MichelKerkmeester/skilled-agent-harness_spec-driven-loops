# Iteration 10: Closing the carried candidates — the tracked settings defaults, the Pi silence, and the frozen fix set

## Focus

Final iteration (10 of 10, stopPolicy max-iterations; convergence is telemetry only). All five key questions stay resolved (`openQuestions: []`), so this iteration executes the dispatch's "broaden coverage and verify prior findings" by closing the two candidates iteration 9 deferred: (a) iteration 5, finding 4 — do the tracked per-runtime settings defaults actually bind an external user (`.claude/settings.json` `bypassPermissions` / `skipDangerousModePermissionPrompt` / `SYSTEM_SPEC_GATE_ENFORCE=0` and `.pi/settings.json` `defaultProjectTrust: "always"`)? (b) iteration 6, finding 4 — does the Pi silent fail-open get a notice in the fix set? Scope: repository reads, installed-runtime reads, one fetch of the schema the settings file itself declares, and read-only clone equality probes. No installs, builds, deletions or session probes.

## Actions Taken

1. Read externalized state: config (session `dr-002-fresh-clone-2026-10-11T16-22-38-567Z`, iteration 10 of 10), state JSONL (9 iteration records + this run's `iteration_start`), strategy, findings registry, iterations 5, 6 and 9.
2. Re-read both tracked settings files at HEAD and verified they reach a fresh clone: `git ls-files` returns both; `diff` against `o2-fresh-clone` reports SAME for both (probe, this iteration).
3. Read the pi runtime's own trust contract: `docs/security.md` (trust-decision order, protected resources) and `docs/settings.md` (per-setting scope rules), plus the dist implementation of `getDefaultProjectTrust`.
4. Fetched the schema the tracked file itself declares (`$schema: https://json.schemastore.org/claude-code-settings.json`) and read the `bypassPermissions` / `skipDangerousModePermissionPrompt` descriptions.
5. Scoped probes: `rg` for `SYSTEM_SPEC_GATE_ENFORCE` consumers; `git ls-files` count under `runtime/dist` (0 tracked) and dist presence on this machine only; `.gitignore` and `.claude/SYNC.md` for the local-settings convention.
6. Re-read the pi extension/adapter pair for the silent branch and its null returns.

Total tool calls ≈ 10 against the configured budget of 24.

## Findings

1. **Iteration 5's Pi half is falsified: the tracked `defaultProjectTrust` cannot bypass project trust in a fresh clone.** Pi's settings reference states `defaultProjectTrust` "**Can only be set in agent-directory settings**" [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/settings.md:34], while ordinary project settings otherwise override agent-directory settings [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/settings.md:3]. The trust decision order reads the global fallback only after saved decisions [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/security.md:59-65], and the dist resolves `getDefaultProjectTrust()` from `globalSettings` [INFERENCE: dist probe this iteration — `dist/core/settings-manager.js` reads `this.globalSettings.defaultProjectTrust`; no project-scope read path exists]. Project settings themselves load only *after* trust is granted, and `.pi/settings.json` is itself a protected resource that triggers the trust decision [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/security.md:39-45]. Net: the tracked line [SOURCE: .pi/settings.json:12] is inert for external users — a fresh-clone Pi user still gets their own global default (`"ask"` unless they changed it) and the trust prompt pi documents [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/security.md:79-80]. Residual cost: the line is dead weight that misstates shipped behavior (it misled iteration 5) and no checked doc names it. Fix: delete the line (F10, rank 3 below).

2. **The Claude half stands, and is sharper: the tracked file ships "skips all prompts" mode.** `.claude/settings.json` sets `permissions.defaultMode: "bypassPermissions"` [SOURCE: .claude/settings.json:5], `skipDangerousModePermissionPrompt: true` [SOURCE: .claude/settings.json:7], and `env.SYSTEM_SPEC_GATE_ENFORCE: "0"` [SOURCE: .claude/settings.json:39]; the file is tracked and byte-identical in the fresh clone (probe, this iteration). The schema URL the file itself declares documents the value as `"bypassPermissions": skips all prompts (use only in isolated environments)` [SOURCE: https://json.schemastore.org/claude-code-settings.json]. So a Claude Code user who opens a clone and accepts the folder-trust step (the standard project-settings path) runs every session with the permission system skipped and the warning prompt for that mode also suppressed — silently, because no checked doc names either key. Residual uncertainty, stated honestly: no live Claude session was executed, so the startup sequencing was not re-probed; the shipped `skipDangerousModePermissionPrompt` is itself evidence the dangerous-mode path is engaged. The relocation surface already exists: `.claude/settings.local.json` is gitignored [SOURCE: .gitignore:316] and called "operator-local … gitignored, never synced" [SOURCE: .claude/SYNC.md:37].

3. **The tracked env is a project-wide spec-gate neutralization, not just a child-handoff wrapper.** `SYSTEM_SPEC_GATE_ENFORCE` is documented as "a separate opt-in control for spec-gate denial, not a kill-switch" [SOURCE: .skilled/hooks/README.md:65], and the `=0` export pattern exists in the repo only for child handoffs ("Every `exec_in_place` path … also exports `SYSTEM_SPEC_GATE_ENFORCE=0` before handing off to the runtime") [SOURCE: .skilled/bin/README.md:192]. Setting it in the tracked Claude project env forces that neutralization onto every root session in this repository — including a newcomer's first one — where it disables the framework's own Gate-3 denial while no checked doc names it [INFERENCE: same three sources; observed file value at .claude/settings.json:39].

4. **Pi silent fail-open re-verified at HEAD, and the notice belongs in the fix set.** The chain is unchanged: the extension calls the adapter on `session_start` [SOURCE: .pi/extensions/session-start-context.ts:36-41], returns silently on a falsy context [SOURCE: .pi/extensions/session-start-context.ts:42], and the catch returns `undefined` ("Fail open because a context-priming bug must never block session start") [SOURCE: .pi/extensions/session-start-context.ts:45-47]; the adapter resolves its target under `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude` [SOURCE: .pi/extensions/lib/claude-hook-adapter.ts:41-45] and returns `null` on spawn error, nonzero exit or exception [SOURCE: .pi/extensions/lib/claude-hook-adapter.ts:55-58]; the repository tracks 0 files under `runtime/dist` [INFERENCE: `git ls-files` probe this iteration] and the dist present on this machine exists only because local builds produced it. Decision (closing iteration 6, finding 4): fold a one-branch notice into F7's move — the branch at line 42 is the only place the sixth runtime can learn the cause, and the five sibling consumers already carry drift notices. Restraint check: one branch in one tracked file, the same remedy text devin's notice names, no new mechanism; if the implementation phase wants strictly minimal, F7's prose clause alone remains the floor.

5. **The frozen ranked fix set (this iteration's deliverable).** Iteration 9's order is preserved; F10 (new) enters at rank 3 and F7 gains its second surface. Anchors last re-verified by iteration 9 at HEAD `82a71c87d035b0a1c7bc3a9405c116125e1ea6be`, which is still HEAD this iteration (probe).

| Rank | ID | Surface | The move | Why build-nothing fails (climbing sentence) | Severity |
|------|----|---------|----------|--------------------------------------------|----------|
| 1 | F1 | `README.md:162` | delete the false advisor auto-install/auto-build clause | the bare-clone probe observed exit 1 (`Cannot find module '@spec-kit/shared/workspace/repo-root.mjs'`) for a user who trusts the sentence and skips steps 2-3 (iteration 2, finding 2) | P1 |
| 2 | F2 | `README.md:160` | state Code Mode's exact Node range beside the existing floors | a single-Node 20/22/26 machine is refused outright — `no Node interpreter satisfies >=24.0.0 <25.0.0` — before the first routed request, and line 160 names no Node 24 (iteration 2, finding 6) | P1 |
| 3 | F10 | `.claude/settings.json:3-7, 35-40` + `.pi/settings.json:12` | move the dev-only security keys (`bypassPermissions`, `skipDangerousModePermissionPrompt`, the `SYSTEM_SPEC_GATE_ENFORCE` env) into the already-gitignored `.claude/settings.local.json`, and delete the inert `defaultProjectTrust` line | leaving it ships "skips all prompts (use only in isolated environments)" plus a spec-gate kill env to every external user who opens Claude Code in a clone, with the dangerous-mode warning suppressed and no doc naming either (this iteration, findings 2-3) | P1 |
| 4 | F7 | `README.md:169-176` + `.pi/extensions/session-start-context.ts:42` | one clause naming the spec-kit workspace build, plus a one-branch notice in Pi's silent failure path | nothing on the documented path produces `runtime/dist`; five dist consumers print drift notices while Pi fails open with zero signal — the only consumer where a user cannot learn the cause (iterations 5-7; re-verified iteration 10, finding 4) | P2 |
| 5 | F7b | `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:23` | change one registry string + run the existing generator | codex's fallback sends users to a user-global config cleaner that reports OK while the dist-dependent failure persists (iteration 8, findings 2-3) | P2 |
| 6 | F3 | README/sk-vision doc line | document Bun + `bun install && bun run build` | the tracked `.opencode/plugins/sk-vision.js` symlink dangles in every fresh clone and `/vision` fails ENOENT until two unstated commands (iteration 3, finding 1; iteration 4, finding 5) | P2 |
| 7 | F4 | README numbered steps (164-177) | move/duplicate the hook-trust sentence (`git config --local skilled.trustRepoHooks true`, README:197) into the numbered region | a user honoring only the numbered steps never sees the trust key; a second clone silently skips every gate, audible only in a stderr NOTICE (iteration 3, finding 4) | P2 |
| 8 | F8 | `.skilled/hooks/git/pre-commit:95-99` + checker | distinguish "not checkable" from "desynced" and warn-skip the former | the gate hard-blocks with "staged agent files desync the mirrors" for a desync that does not exist — an uncaught throw exits 1, the same code as drift (iteration 7, finding 1; iteration 9, finding 3) | P3 |
| 9 | F5 | README step 3 | one clause stating step 3 requires step 2 completed | running the advisor build before step 2 exits 1 with TS2591/TS2503 (iteration 2, finding 4) | P3 |
| 10 | F9 | README First Use (README.md:212) | name the other six runtimes or point to the per-runtime sections | six of seven shipped runtimes have no documented first step while all seven appear in Verify and all seven configs ship (iteration 5, finding 3) | P3 |
| — | F6 | repo root | (note-only) remove the empty `.skilled_skills_*` files + broken tracked symlinks | no observed failure names any of it — the "while we're here" restraint signal; bundle only with unrelated root cleanup (iteration 4, finding 6) | P3-optional |

F10 passes the `.skilled/repo-rules/prevent-overengineering.md` filter: the entry point is editing two tracked settings files; the relocation target already exists as a sanctioned, gitignored surface ([SOURCE: .gitignore:316], [SOURCE: .claude/SYNC.md:37]); no new mechanism. Alternatives declined: deleting the keys outright (breaks the maintainers' own sessions — higher reversal cost than relocation) and a docs-warning-only fix (leaves the shipped default, which is the harm). F7's second surface also passes: one branch at an existing silent return, remedy text matching devin's notice, and the file already models early-exit conventions (`isHookEnabled` guard at line 27).

## Questions Answered

- None new. Q1-Q5 were resolved in iterations 1-4 and remain ticked in the registry. This iteration closes the two carried candidates and re-verifies prior findings, per the dispatch.

## Questions Remaining

- None in the strategy registry. The run reaches its iteration ceiling with no open question.

## Ruled Out

- **A fresh-HOME pi launch to observe the trust prompt end-to-end.** The trust decision is interactive, and a one-shot probe cannot bind it; pi's normative scope rule, the trust-resolution order and the dist read path settle the file-level question with primary sources (Finding 1).
- **A live Claude Code session to observe project-settings startup precedence.** No safe non-interactive probe exists; the fetched schema documents the shipped values' semantics, and the residual uncertainty is recorded in Finding 2 instead of being smoothed over.
- **Reproducing the Pi silence by removing `runtime/dist`.** Deletion is banned, and the probe clone's dist was produced by earlier iterations; the file-level chain plus the 0-tracked `git ls-files` count stand as the evidence.
- No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, the `bun test` roasts, the generated `.codex/hooks.json` edit path and the F6-bundling direction all stayed untouched.

## Dead Ends

- None new.

## Edge Cases

- **Contradictory evidence:** iteration 5's Pi implication (tracked `defaultProjectTrust` applies to external users) conflicts with pi's own scope rule and dist read path. Resolved in favor of the primary sources; the correction is carried as a supersede/contradicts graph event rather than silently dropped.
- Ambiguous input: none.
- Missing dependencies: none — the schema fetch succeeded, so no fallback was needed.
- Partial success: none.

## SCOPE VIOLATIONS

None. All writes were the two packet artifacts and the transient gateway event file outside the repository; every probe was read-only; no installs, builds, session launches or deletions ran this iteration.

## Sources Consulted

- `.claude/settings.json:1-245` (full read, this iteration)
- `.pi/settings.json:1-52` (full read, this iteration)
- `.pi/extensions/session-start-context.ts:1-51` (full read, this iteration)
- `.pi/extensions/lib/claude-hook-adapter.ts:1-76` (full read, this iteration)
- `.gitignore:316`, `.claude/SYNC.md:37` (rg hits, this iteration)
- `.skilled/hooks/README.md:65`, `.skilled/bin/README.md:192` (rg hits, this iteration)
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/settings.md:3,34` (read, this iteration)
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/security.md:37-80` (read, this iteration)
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/configuration.md:3` (rg hit, this iteration)
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/settings-manager.js` (rg hit, this iteration)
- `https://json.schemastore.org/claude-code-settings.json` (fetched, this iteration)
- `o2-fresh-clone` probes: `git ls-files` settings files, `diff` equality, HEAD hash (this iteration)
- Iterations 5, 6 and 9 narratives; findings registry (reads, this iteration)

## Assessment

- New information ratio: 0.6 (1 fully new + 4 partially new of 5 findings = 3/5; no simplicity bonus — the iteration carries new external evidence)
- Questions addressed: none open; closed the two carried candidates from iterations 5 and 6
- Questions answered: none new
- Questions remaining: none

## Reflection

- What worked and why: reading the runtime's *own scope rule* instead of trusting the key's name. One doc line plus one dist read falsified a security implication that had survived nine iterations as an unprobed "shipped default" — the per-key scope table was the decisive artifact, not the settings file. Fetching the schema the tracked file itself declares turned the Claude semantics from assumption into the file's own contract, and that contract literally says "use only in isolated environments".
- What did not work and why: nothing failed. The live-session and dist-removal probes were deliberately declined (interactive or deletion-bound) and are recorded under Ruled Out rather than overclaimed.
- What I would do differently: check per-key settings *scope* rules the first time a settings file was read (iteration 5's pass). The scope table sits one file away and would have ranked F10 correctly five iterations earlier.

## Recommended Next Focus

Final iteration — no further research is queued, and the per-iteration handoff follows the packet's exit path. Implementation-phase notes:

- Re-run the fix-anchor verification at the then-current HEAD before applying the set; F10 is the only security-default change and should land first among the settings edits.
- F10b (deleting the inert `.pi/settings.json:12` line) must not be "fixed" by moving it somewhere else — it cannot work from project scope by design.
- F6 stays note-only; do not bundle it with F1-F10 unless a separate root-cleanup change is happening anyway.
- For F7's Pi notice, reuse devin's exact remedy wording (`npm run build` in the spec-kit runtime package) so the sixth runtime's text matches the only accurate sibling notice.
