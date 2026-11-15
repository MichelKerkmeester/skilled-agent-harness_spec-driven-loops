# Review Iteration 4 — Maintainability

**Dispatcher:** `/deep:review` (mode=review, target_agent=deep-review, iteration 4/10)
**Dimension:** maintainability — sk-code-opencode alignment, duplicated logic across the seven runtime adapters, comment quality and hygiene, test clarity, README accuracy.
**Budget profile:** scan/verify hybrid (9 analysis calls; hard ceiling 13).

## Files Reviewed

- `.skilled/hooks/session-relaunch/README.md` (whole file, accuracy spot-check)
- `.skilled/bin/README.md` (whole file, wrappers section)
- `.skilled/bin/skilled-loop` (whole file, 507 lines)
- `.skilled/hooks/session-relaunch/codex/shared.mjs` (whole file, line-numbered)
- `.skilled/hooks/session-relaunch/hermes/context-nudge.mjs` (whole file, line-numbered)
- `.skilled/hooks/session-relaunch/claude/context-nudge.mjs` (helper + main section, line-numbered)
- `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` (whole file)
- `.skilled/hooks/session-relaunch/opencode/session-relaunch.js` (function inventory only — body not read this iteration)
- Function-inventory grep across the five nudge producers and duplication scan across all seven adapters.
- Comment-hygiene grep for ephemeral artifact labels (spec paths, ADR/REQ ids, task ids, phase numbers) over `lib/`, all adapters, the Pi extension and the wrapper.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`plannedNotePath` is copied into five adapters and has already drifted on path resolution** -- `.skilled/hooks/session-relaunch/codex/shared.mjs:66` (also `claude/context-nudge.mjs:60`, `hermes/context-nudge.mjs:67`, `pi/session-relaunch.ts:177`, `opencode/session-relaunch.js:56`).
   Description: the same handoff-path builder is defined once per adapter. Claude and Codex use `process.env.REPO_ROOT || payload?.cwd || process.cwd()` and join without resolving, while Hermes and Pi wrap the root in `path.resolve`. A change to the handoff directory layout or naming stamp must be edited in five places, and the copies already disagree about whether the returned path is guaranteed absolute.
   Finding class: cross-consumer
   Scope proof: function inventory shows exactly five definitions (`codex/shared.mjs:65`, `claude/context-nudge.mjs:59`, `hermes/context-nudge.mjs:66`, `pi/session-relaunch.ts:180`, `opencode/session-relaunch.js:56`); `relaunch-core.cjs` owns the sibling state logic but exports no path builder for adapters.
   Affected surface hints: ["claude/context-nudge", "codex/shared", "hermes/context-nudge", "pi/session-relaunch", "opencode/session-relaunch"]
   Case: A runtime hook and the relaunch CLI are launched with different working directories (or `REPO_ROOT` is relative); Claude/Codex produce a note path relative to the hook process while Hermes/Pi produce an absolute path, so the path `prepare` later validates is not the path the sender intended. The same divergence makes any layout change a five-file edit with no shared test.
   Recommendation: move the builder into `lib/relaunch-core.cjs` (or a sibling `lib/paths.cjs`) with one resolution rule, and have each adapter call it with its runtime-specific root input.
   `[SOURCE: .skilled/hooks/session-relaunch/codex/shared.mjs:65]`, `[SOURCE: .skilled/hooks/session-relaunch/hermes/context-nudge.mjs:67]`, `[SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:180]`

2. **The Pi adapter re-reads the hook config per event and keeps a fourth copy of the threshold rule** -- `.skilled/hooks/session-relaunch/pi/session-relaunch.ts:140` and `.skilled/hooks/session-relaunch/pi/session-relaunch.ts:167`.
   Description: `isEnabled()` calls `loadConfigFile(configPath())`, and `relaunchThreshold()` loads the same file again on every `message_end`. The Claude adapter documents the opposite design at `claude/context-nudge.mjs:73-76` ("read once per run and shared by the enable check and the threshold, so a hook that fires on every tool call does not re-read it"). The threshold parser itself exists four times (`claude/context-nudge.mjs:53`, `codex/shared.mjs:57`, `hermes/context-nudge.mjs:57`, `pi/session-relaunch.ts:167`) with two resolution styles: spread-config-then-env versus `env ?? config`.
   Finding class: algorithmic
   Scope proof: four definitions of `relaunchThreshold` and one `positiveNumber`/window-resolution cluster per adapter; `lib/nudge.cjs` exports the state and text helpers but not the threshold policy.
   Affected surface hints: ["pi/session-relaunch", "claude/context-nudge", "codex/shared", "hermes/context-nudge"]
   Case: An operator edits `.skilled/hooks/hook-flags.env` while a Pi session is running. The enable check and the threshold can come from different file snapshots in the same event, and every assistant message performs two synchronous config reads that the Claude path explicitly avoids.
   Recommendation: load the config once per event (or once per extension activation) and pass it to a single shared threshold resolver.
   `[SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:140]`, `[SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:167]`, `[SOURCE: .skilled/hooks/session-relaunch/claude/context-nudge.mjs:73]`

3. **`notePathFromSeed` has three divergent parsers, so one seed-format change silently lands in only one runtime** -- `.skilled/hooks/session-relaunch/hermes/context-nudge.mjs:80`, `.skilled/hooks/session-relaunch/pi/session-relaunch.ts:194`, `.skilled/hooks/session-relaunch/opencode/session-relaunch.js:152`.
   Description: Hermes requires the prompt to start with the full `[session-relaunch] claim and continue handoff ` prefix, rejects non-absolute and non-trimmed paths, and returns `null`; Pi searches for `claim and continue handoff ` anywhere, unescapes shell escapes, and falls back to the literal `'<handoff-path>'`. The seed prefix literal is also duplicated in the adapter (`SEED_COMMAND` at `hermes/context-nudge.mjs:19`) rather than derived from `lib/nudge.cjs`.
   Finding class: cross-consumer
   Scope proof: three definitions found by function inventory; the wrapper emits the seed at `skilled-loop` and `lib/nudge.cjs` owns seed detection/text, but not parsing.
   Affected surface hints: ["hermes/context-nudge", "pi/session-relaunch", "opencode/session-relaunch", "lib/nudge"]
   Case: The wrapper's seed wording gains a leading marker or changes the separator. A parser updated in one adapter still passes its own test, while the other two render a claim prompt containing a placeholder or a truncated path.
   Recommendation: put one `notePathFromSeed` in `lib/nudge.cjs`, return a discriminated result (`{path}` or `{reason}`), and let adapters decide only the fallback text.
   `[SOURCE: .skilled/hooks/session-relaunch/hermes/context-nudge.mjs:80]`, `[SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:194]`, `[SOURCE: .skilled/hooks/session-relaunch/opencode/session-relaunch.js:152]`

## Edge Cases

- The OpenCode adapter body was not read this iteration; only its function inventory and duplication surface were checked. Its security/correctness behavior was covered in earlier iterations, but its internal maintainability is unverified (deferred, SL-406).
- README link-mode claims (`.pi/extensions/session-relaunch.ts` and `.skilled/hooks/session-relaunch/opencode/session-relaunch.js` described as symlinks) remain unproven: a content read cannot distinguish a symlink from a copy. Carried as SL-205.
- README quantitative claims (100 ms poll, hop/age zero semantics) remain deferred as SL-208; `killer.cjs` was not re-read this iteration.
- A dead-end from D3 (contract section 7 opening order versus its amendment) stays a documentation contradiction, not a code defect; no new evidence changed it.

## Confirmed-Clean Surfaces

- Comment hygiene: a grep over `lib/`, all adapter files, the Pi extension and `skilled-loop` for spec paths, ADR/REQ ids, task ids and phase numbers in comments returned no hits. Comments in `claude/context-nudge.mjs:33,39,73-76`, `pi/session-relaunch.ts:100-104,226-231` and `codex/shared.mjs` explain WHY, not what.
- README structure: the nine-file test command in `.skilled/hooks/session-relaunch/README.md` §7 matches the nine test files present under `tests/`; the §8 tree matches the directory contents.
- `skilled-loop` header and inline comments state the exit-code contract and the Bash 3.2 nounset rationale; both match the code paths read.
- The per-runtime seed syntax in the wrapper's `build_relaunch_arguments` matches the README matrix for all seven runtimes.

## Ruled Out

- Ephemeral artifact labels in code comments: none present (grep evidence above). This direction is closed for the touched files.
- README matrix drift on trigger/seed form: the seven rows agree with the wrapper arms and the adapter surfaces read in D3.
- `skilled-loop` shell-function ordering and `start_directory` timing: previously ruled out (iteration 1); no new evidence.
- Adapter payload injection: previously ruled out (iteration 2); maintainability read surfaced no new shell/eval surface.

## Traceability Checks

- Dimension is maintainability; traceability was closed in D3 and is not re-run here. Carried status: core `spec_code` partial (sections 11.10-11.11 unread), `checklist_evidence` partial (two evidence pointers fail, T3-P2-001), overlays as recorded in strategy §14.
- Deferrals carried: SL-205 (mirror link shape), SL-208 (catalog quantitative claims), SL-209 (`tasks.md` T009 README pointers).
- Integration surfaces named this iteration: `.skilled/bin/skilled-loop`, the four nudge adapters, `lib/nudge.cjs`, the Pi extension, the OpenCode plugin, and the two READMEs in scope.

## SCOPE VIOLATIONS

None. No review target file was modified; all writes stayed in the review packet.

## Next Dimension

No review dimension remains. Iteration 5 should run the cross-reference/synthesis fallback: resolve or re-confirm the carried deferrals (SL-205, SL-208, SL-209), check whether the three duplication advisories share one remediation packet, and evaluate convergence (newFindingsRatio 0.30 vs threshold 0.10).

## Verdict

No P0 and no P1 findings. Three maintainability P2 advisories, all with file:line evidence and a shared-helper remediation. The dimension is covered; active P2 count rises from 7 to 10.

Review verdict: PASS
