# Session Relaunch Loop: Post-Phase-008 Deep Research Synthesis

**Run:** fanout-deepseek-1792429886029-no7lpl
**Topic:** Session relaunch loop after phase 008: code, docs, spec records, latent bugs, architecture and standards alignment
**Iterations:** 5 of 5
**Stop reason:** maxIterationsReached
**Date:** 2026-10-19

---

## 1. EXECUTIVE SUMMARY

The relaunch loop is functionally sound on its proven paths: five automatic adapters, two command-trigger runtimes, a validated note, a wrapper, and a timeout killer. The remaining risk is not one broken feature. It is contract drift at the seams: the same fact is implemented five times, the same state is classified two ways in one plugin, and three documents describe behavior that phase 008 already changed.

This run found 24 raw findings and consolidated them into 13 actionable items across seven themes. Two are latent-bug clusters worth fixing first: the Claude stop hook's fallback target resolution and the note-state inconsistency in the OpenCode plugin. Four are documentation or spec-record corrections that can ship independently. The rest are structural: centralize killer-target resolution, note-state classification, the spec-folder boundary, and the constants every adapter copies.

No finding requires changing `autoCompactEnabled` or `autoCompactWindow`, and none proposes a new runtime.

---

## 2. RESEARCH QUESTION

Which remaining drift exists between the relaunch-loop code, documentation and phase 001-008 spec records; which latent bugs and edge cases remain; what refinements and ideal core/adapter architecture follow; and which sk-code-skilled and sk-doc standards are still unmet?

Each finding below carries a file:line citation and a concrete fix.

---

## 3. METHOD

Five iterations, each with a distinct angle:

| Iteration | Focus | Findings |
|---|---|---|
| 1 | Core state machine and process-targeting seams | 5 |
| 2 | Runtime adapter parity and spec-folder input | 5 |
| 3 | Command, README, catalog and env-reference alignment | 5 |
| 4 | Phase 001-008 record drift | 4 |
| 5 | Ideal architecture and standards conformance | 5 |

The audit was read-only against the target surface. Every claim cites a repository path and line. The phase 001 record later corrected one initial severity: `CLAUDE_PID` is present in the recorded Claude hook environment, so the stop-arm defect is a latent fallback bug, not the live path.

---

## 4. SCOPE AND BOUNDARIES

In scope: `.skilled/hooks/session-relaunch/` (core, CLI, five adapters, tests), `.skilled/bin/skilled-loop`, `.opencode/plugins/session-relaunch.js`, `.skilled/commands/speckit/handoff.md`, the session-relaunch README, the feature catalog entry, the environment reference, the plugins-and-hooks playbook, and phases 001-008 of `specs/hooks/023-session-relaunch-loop`.

Out of scope: implementation changes, live runtime runs, `autoCompact*` settings, unrelated packets, and the Hermes Python bridge internals.

---

## 5. CONSOLIDATED FINDINGS

### Theme A: Killer target resolution (highest priority)

**A1. The Claude stop hook's fallback resolves the transient `bash -c` wrapper, not Claude.**
`stop-arm.mjs` uses `process.env.CLAUDE_PID || String(process.ppid)` [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:131]. The generated hook command wraps Node in `bash -c` [SOURCE: .claude/settings.json:192], so the parent is the hook shell. `CLAUDE_PID` is present in the recorded live environment [SOURCE: specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/implementation-summary.md:85], so the live path works, but the fallback silently supervises the wrong process. Phase 003's D77 removed this exact defect from Codex [SOURCE: specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/implementation-summary.md:86], and the phase 001 decision still blesses it [SOURCE: specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/implementation-summary.md:95].
**Fix:** replace the fallback with `findLoopChildPid(loopId)`, matching Codex [SOURCE: .skilled/hooks/session-relaunch/codex/stop-arm.mjs:118]; add a test with `CLAUDE_PID` removed and a shell-wrapped invocation.

**A2. The recorded safety net cannot catch that fallback.**
The phase 001 record says "the loop-id ancestry check remains" [SOURCE: specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/implementation-summary.md:95]. The check only asks whether the loop is an ancestor of the target [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:586]. Every process between the runtime and the loop, including the hook shell, satisfies it, so the check proves loop membership, not identity.
**Fix:** validate the target as the loop's direct child (the `findLoopChildPid` contract) and reject any other descendant.

**A3. Five adapters resolve the target five ways.**
Claude uses env or parent [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:131], Codex the ancestor walk [SOURCE: .skilled/hooks/session-relaunch/codex/stop-arm.mjs:118], Hermes the ancestor walk with a test seam [SOURCE: .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:79], and Pi and OpenCode `process.pid` [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:244] [SOURCE: .opencode/plugins/session-relaunch.js:190].
**Fix:** one core `resolveKillerTarget(loopId, { env, pid })` with a documented preference order: runtime-exported pid, then direct-child ancestor walk, then `process.pid`. Every adapter calls it.

### Theme B: Adapter contract drift

**B1. The OpenCode plugin uses two contradictory note-state rules.**
Outside a loop it stops nudging as soon as the note file exists [SOURCE: .opencode/plugins/session-relaunch.js:64]; inside the seed path it treats an unreadable or unparsable note as still open [SOURCE: .opencode/plugins/session-relaunch.js:72]. A zero-byte or partial note therefore silences the nudge while the session still cannot prepare.
**Fix:** one `noteState(notePath)` core helper: missing, unreadable or invalid means open; only `claimed` or `done` stops the nudge.

**B2. Malformed claim seeds are refused by Hermes but converted into placeholder instructions by the other four adapters.**
Hermes returns no context when `notePathFromSeed` is null [SOURCE: .skilled/hooks/session-relaunch/hermes/context-nudge.mjs:65]; Claude, Codex and OpenCode substitute `<handoff-path>` [SOURCE: .skilled/hooks/session-relaunch/claude/context-nudge.mjs:73] [SOURCE: .skilled/hooks/session-relaunch/codex/shared.mjs:67] [SOURCE: .opencode/plugins/session-relaunch.js:284].
**Fix:** make a null path end seed handling in every adapter, matching Hermes, and add one parity test per adapter.

**B3. No shared conformance suite exists.**
Each runtime has its own suite [SOURCE: .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:1] [SOURCE: .skilled/hooks/session-relaunch/tests/codex-adapters.test.cjs:1] [SOURCE: .skilled/hooks/session-relaunch/tests/hermes-adapters.test.cjs:1] [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts:1] [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:1], which is why B1, B2 and Theme C could diverge unnoticed.
**Fix:** a table-driven `adapter-conformance.test.cjs` over one fixture set: seed detection, seed refusal, spec-folder normalization, pending/armed suppression, hop-cap silence, corrupt-note recovery.

**B4. The background-task guard runs only for a pending record.**
The Claude adapter checks `background_tasks` only when `record.status === 'pending'` [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:109]. An armed record whose killer died can be re-armed while tasks run, and the new killer can kill them. Phase 001 records the guard as the defense against exactly that [SOURCE: specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/implementation-summary.md:96].
**Fix:** apply the guard to every path that calls `arm()`, not only pending.

### Theme C: The spec-folder boundary

**C1. `handoffText` interpolates the spec-folder value into note frontmatter without validation.**
The value is copied into `spec_folder: ${specValue}` [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:93] from `SYSTEM_SPEC_FOLDER` [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:338] [SOURCE: .opencode/plugins/session-relaunch.js:159] or the hook payload [SOURCE: .skilled/hooks/session-relaunch/claude/context-nudge.mjs:108] [SOURCE: .skilled/hooks/session-relaunch/codex/shared.mjs:106]. A newline injects extra frontmatter keys.
**Fix:** normalize at the boundary: accept `none` or `validSpecFolder`, otherwise `undefined`, and log the drop.

**C2. The "exact shape" example invites copying an invalid placeholder.**
The block introduced as the exact note shape prints a long placeholder in the value slot [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:87] [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:94], and `prepare` rejects that literal [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:372].
**Fix:** print an empty `spec_folder:` in the example and keep the three allowed forms in the guidance line.

**C3. The environment reference claims a payload producer that does not exist.**
It says Claude and Codex take `spec_folder` from the hook payload [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:113], and the adapters read `payload.spec_folder` [SOURCE: .skilled/hooks/session-relaunch/codex/shared.mjs:106] [SOURCE: .skilled/hooks/session-relaunch/claude/context-nudge.mjs:108], but only tests set it [SOURCE: .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:156]. The value that actually reaches the seed is the one the model writes into the note, which `consume` reads [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:509].
**Fix:** document the note as the carrier and describe the payload field as an optional override, or remove the claim and the dead reads.

### Theme D: Core record validation

**D1. `shouldRelaunch` approves an armed record without a handoff or cwd, and the wrapper exits 1.**
The predicate checks only status, age and hops [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:404]; the CLI copies the missing fields [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:461]; the wrapper then consumes the record and exits 1 [SOURCE: .skilled/bin/skilled-loop:430], discarding the runtime exit code.
**Fix:** return `{relaunch:false, reason:'incomplete-record'}` when either field is missing.

**D2. `updateFrontmatter` and `parseHandoff` disagree about whitespace before the colon.**
The parser accepts `status : open` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:198]; the updater only matches `status:` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:119], appends a duplicate, and the next parse throws.
**Fix:** match `/^\s*key\s*:/` or reuse the parser's spans.

**D3. `consume`'s fallback drops a valid `spec_folder: none` on an unrelated parse error.**
The fallback marks any non-empty value invalid [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:530], including the valid `none` accepted above it [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:520].
**Fix:** treat `none` as valid in the fallback.

### Theme E: Context-window resolution

**E1. A session started in a repo subdirectory misses the project window.**
`resolveWindow` checks settings only under the session `cwd` [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:173], and the Claude nudge passes the payload cwd [SOURCE: .skilled/hooks/session-relaunch/claude/context-nudge.mjs:88]. This repo sets a 500000-token window [SOURCE: .claude/settings.json:25]; a nested session falls to 200000 [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:183], doubling the measured fill.
**Fix:** walk ancestors from `cwd` to the repository boundary before the home setting; add a nested-cwd test.

### Theme F: Duplication and architecture

**F1. Constants and seed strings are copied across layers.**
The CLI path appears in five adapters [SOURCE: .skilled/hooks/session-relaunch/claude/context-nudge.mjs:20] [SOURCE: .skilled/hooks/session-relaunch/codex/shared.mjs:28] [SOURCE: .skilled/hooks/session-relaunch/hermes/context-nudge.mjs:15] [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:99] [SOURCE: .opencode/plugins/session-relaunch.js:26]. The four section names are declared twice [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:22] [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:29]. The seed phrase is built in the core [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:567], the nudge [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:12] and the wrapper [SOURCE: .skilled/bin/skilled-loop:461]. The default hop cap of ten appears in four places [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:27] [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:401] [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:404].
**Fix:** one exported constants object in the core; the wrapper asks the CLI to render the manual command instead of keeping a parallel case table.

### Theme G: Documentation and spec records

**G1. The handoff command says `prepare` leaves open notes unchanged; phase 008 changed that.**
The command states it [SOURCE: .skilled/commands/speckit/handoff.md:133]; `supersedeClaimed` also completes this session's open notes [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:515]. The README states only the claimed-note half [SOURCE: .skilled/hooks/session-relaunch/README.md:141].
**Fix:** name both classes in the command and README.

**G2. Three documents say `CLAUDE_PID` is used "only" for the shell-child check; the stop hook also uses it as the target.**
README [SOURCE: .skilled/hooks/session-relaunch/README.md:25], feature catalog [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md:43], command [SOURCE: .skilled/commands/speckit/handoff.md:21], against [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:131].
**Fix:** align the wording with the chosen target-resolution design.

**G3. The environment reference has no `CLAUDE_PID` row.**
The variable is used [SOURCE: .skilled/hooks/session-relaunch/README.md:81] but not listed [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:109].
**Fix:** add the row with its source, or remove the dependency.

**G4. The record-status table calls every arm event a Stop event.**
README [SOURCE: .skilled/hooks/session-relaunch/README.md:127] against Pi `agent_end` [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:375], OpenCode `session.idle` [SOURCE: .opencode/plugins/session-relaunch.js:294] and Hermes `on_session_end` [SOURCE: .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:111].
**Fix:** "the runtime's arm event" plus the five-event list.

**G5. The command and the nudge disagree about save versus note order.**
Command saves first [SOURCE: .skilled/commands/speckit/handoff.md:61]; the nudge writes the note first [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:87].
**Fix:** choose one order and state why.

**G6. Phase 002's OpenCode limitation is stale.**
It says `session.idle` and the wrapper ppid path were not captured [SOURCE: specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters/implementation-summary.md:65]; later OpenCode runs D-F recorded prepare, `killer-signal` and relaunch, and phase 004 closed the live checks.
**Fix:** retire or narrow the limitation.

**G7. The tests README omits the OpenCode suite.**
Coverage lists four runtimes [SOURCE: .skilled/hooks/session-relaunch/tests/README.md:15]; the OpenCode suite lives elsewhere [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:1].
**Fix:** name the suite and its path.

---

## 6. IDEAL ARCHITECTURE

```text
Host events (Claude Stop, Pi agent_end, OpenCode session.idle, Codex Stop, Hermes on_session_end)
        |
        v
Thin adapter (one per runtime)
  - reads the host payload and transcript/usage
  - maps to core input, sanitizes untrusted fields
  - delivers the host-specific envelope
        |
        v
Core (single source of truth)
  - handoff format: parse, validate, update, supersede
  - note planning and note state
  - nudge text and seed text
  - suppression: pending/armed/stale, hop cap
  - resolveKillerTarget and process ancestry
  - runtime seed table and manual command rendering
        |
        v
Wrapper (skilled-loop)
  - loop lifecycle, argv carry, exit semantics
  - asks the core to render the manual command
        |
        v
Killer (generic supervisor)
  - lock, takeover, idle wait, SIGTERM, disarm
```

The boundary rule: if two adapters need the same decision, the decision belongs in the core. Applied here, that moves target resolution, note state, the spec-folder normalization, the section list, the seed phrase, the CLI path and the default hop cap into the core, leaving each adapter with payload ingestion and envelope delivery only.

A conformance suite then tests the core contract once through every adapter entry, and each runtime keeps only its host-payload tests.

---

## 7. REFINEMENTS WORTH SHIPPING

| # | Refinement | Scope | Risk |
|---|---|---|---|
| 1 | `resolveKillerTarget` in the core; Claude fallback removed | code + tests | low |
| 2 | `noteState` in the core; OpenCode uses it | code + tests | low |
| 3 | Spec-folder normalization in `handoffText` | code + tests | low |
| 4 | Background-task guard on every arm path | code + test | low |
| 5 | `shouldRelaunch` incomplete-record decline | code + test | low |
| 6 | `updateFrontmatter` whitespace-tolerant match | code + test | low |
| 7 | `consume` accepts `none` in the fallback | code + test | low |
| 8 | Ancestor-aware window resolution | code + test | low |
| 9 | Shared constants object and CLI-rendered manual command | code + wrapper + tests | medium |
| 10 | Adapter conformance suite | tests | low |
| 11 | Documentation and spec-record corrections (G1-G7) | docs | none |

---

## 8. STANDARDS CONFORMANCE

### sk-code-skilled

- Universal, JavaScript and shell checklists: no P0 or P1 violation found in the reviewed files. Headers, `'use strict'`, naming, quoted expansions, `set -euo pipefail`, named constants, error context and exit-code documentation are present.
- The one P1-class gap is DRY: the CLI path, section list, seed phrase and hop default are copied (F1).
- Filesystem mutation safety is handled: realpath containment [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:128] and owned-directory checks [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:43].
- The incomplete-record, whitespace-key and corrupt-note paths are the missing edge-case coverage.

### sk-doc

- The code-folder README meets the shape: numbered ALL CAPS H2 sections, a directory tree, a switches table, troubleshooting and related links.
- The command document meets the command template: one-line description, `argument-hint`, least-privilege tools, purpose/contract/steps/report sections.
- The gaps are accuracy, not shape: G1-G7, plus the ENV-REFERENCE completeness item.

---

## 9. RISKS AND EDGE CASES

1. **`CLAUDE_PID` availability.** The recorded environment includes it; the fallback is wrong if a host version omits it. Treat A1 as a latent risk until the fallback is fixed.
2. **Model-filled note fields.** The model writes `session_id`, `loop_id`, `cwd` and `spec_folder`. The CLI validates them, but the adapter cannot guarantee them; the spec-folder normalization in C1 is the one field that must be safe before the model sees it.
3. **OpenCode host process.** The plugin passes `process.pid`; the phase 002 spike did not directly capture that this is the wrapper's direct child. Later live runs worked, but a host that forks the plugin server differently would break the assumption. A2's direct-child rule covers it once implemented.
4. **Two contracts, one workflow.** The save-versus-note order and the manual-command table are duplicated; a future edit to one can silently diverge.
5. **Corrupt notes.** The directory is private, but a partial write is still possible; only a note-state helper makes the behavior consistent.

---

## 10. RECOMMENDATIONS

1. Fix the two latent-bug clusters first: Claude target fallback (A1/A2) and OpenCode note state (B1). Both are small, testable changes.
2. Add the spec-folder boundary normalization (C1) and the background-task guard (B4) in the same patch set, with failing-first tests.
3. Move target resolution, note state, constants and manual-command rendering into the core (A3/F1); delete the adapter variants.
4. Add the conformance suite (B3) before the core moves, so the suite records current behavior and then proves the unification.
5. Correct the documentation and spec records (G1-G7) in one docs pass; they need no code dependency except G2/G3, which should follow the target-resolution decision.
6. Re-run the full relaunch suites and one live Claude plus one live OpenCode hop after the changes.

---

## 11. ELIMINATED ALTERNATIVES

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Re-deriving hop-cap logic | One shared resolution path; phase 008 tests cover zero, non-integer and over-cap values | `.skilled/hooks/session-relaunch/lib/nudge.cjs:312`, `bin/session-relaunch.cjs:399` | 1 |
| Treating `EPERM` in `targetIsRunning` as a bug | For a target pid, `EPERM` means the pid was reused by another user; "gone" is correct | `.skilled/hooks/session-relaunch/lib/killer.cjs:114` | 1 |
| Rewriting the lock takeover algorithm | Expiry, inode-checked release and sweep bounds match the README | `.skilled/hooks/session-relaunch/lib/killer.cjs:351` | 1 |
| Treating OpenCode `process.pid` as a defect | Plugin is hosted in the OpenCode process; tests assert the pid | `.opencode/plugins/tests/session-relaunch.test.cjs:916` | 2 |
| Re-checking per-adapter threshold math | All adapters call the shared threshold and level helpers | `.skilled/hooks/session-relaunch/lib/nudge.cjs:356` | 2 |
| A command-standard defect in `/speckit:handoff` | Frontmatter, tools and section shape meet the template | `.skilled/skills/sk-doc/sk-create-command/assets/command-template.md:1` | 3 |
| A Gate 3 exemption gap | AGENTS.md exempts runtime state and the spec-gate test covers it | `AGENTS.md:75` | 3 |
| A parent-goal D3 violation | The seed reads `spec_folder` from the note at consume time | `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:509` | 4 |
| A phase 008 limitation drift | "No live rerun" remains accurate | `specs/hooks/023-session-relaunch-loop/008-review-3-remediation/implementation-summary.md:115` | 4 |
| A JavaScript or shell checklist violation | Headers, strict mode, naming, quoting and constants all present | checklists reviewed in iteration 5 | 5 |
| Treating the Pi `as string` imports as a defect | The dual-base resolution comment and dynamic fallback explain them | `.skilled/hooks/session-relaunch/pi/session-relaunch.ts:111` | 5 |

---

## 12. OPEN QUESTIONS

1. **Will the Claude host always export `CLAUDE_PID`?** The phase 001 live environment did; no contract guarantees it. The fix does not depend on the answer if the fallback uses the direct-child walk.
2. **Does the OpenCode plugin always run in the wrapper's direct child?** Later live runs suggest yes; A3's direct-child validation makes the answer enforceable.
3. **Should the note or the continuity save come first?** Both work today; one order should be chosen deliberately.

---

## 13. REFERENCES

- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`
- `.skilled/hooks/session-relaunch/lib/context-usage.cjs`
- `.skilled/hooks/session-relaunch/lib/nudge.cjs`
- `.skilled/hooks/session-relaunch/lib/killer.cjs`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`
- `.skilled/hooks/session-relaunch/{claude,codex,hermes,pi}/`
- `.skilled/hooks/session-relaunch/tests/`
- `.skilled/bin/skilled-loop`
- `.opencode/plugins/session-relaunch.js`
- `.skilled/commands/speckit/handoff.md`
- `.skilled/hooks/session-relaunch/README.md`
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`
- `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md`
- `specs/hooks/023-session-relaunch-loop/` phases 001-008

No `resource-map.md` was present at init; the coverage gate was skipped as designed.

---

## 14. CONVERGENCE REPORT

- **Stop reason:** maxIterationsReached (5 of 5)
- **Iterations completed:** 5
- **Questions answered:** 4 of 5 key questions fully answered with cited evidence; the remaining open question is the external `CLAUDE_PID` guarantee.
- **Average newInfoRatio:** (1.0 + 0.9 + 0.9 + 0.8 + 0.7) / 5 = 0.86
- **Trend:** descending, as expected when later iterations build on earlier evidence rather than opening new surfaces.
- **Convergence note:** the threshold (0.1) was not reached before the cap, per the max-iterations stop policy.

---

## 15. PROVENANCE

- Session: `fanout-deepseek-1792429886029-no7lpl`
- Executor: cli-opencode, `llmgateway/deepseek-v4.1-flash`
- Iteration artifacts: `iterations/iteration-001.md` through `iteration-005.md`
- Deltas: `deltas/iter-001.jsonl` through `iter-005.jsonl`
- State: `deep-research-state.jsonl` (gateway projection)

---

## 16. HANDOFF

The highest-value next action is the A1/A2 target-resolution fix plus its test, followed by B1 and C1. The documentation corrections in G1-G7 can run in parallel because they touch no behavior. The structural move in F1 should follow the conformance suite so the suite can prove the move preserved behavior.
