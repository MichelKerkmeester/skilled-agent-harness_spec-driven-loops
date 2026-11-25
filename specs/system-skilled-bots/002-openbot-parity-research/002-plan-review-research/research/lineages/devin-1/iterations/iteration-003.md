# Iteration 3: Plan versus runtime — terminal screen (003) and computer exposure (004)

## Focus
Frontier node F-1-001 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/*/plan.md, specs/system-skilled-bots/003-openbot-parity-build/*/tasks.md, specs/system-skilled-bots/003-openbot-parity-build/*/acceptance-criteria.md, .skilled/skills/system-skilled-bots/runtime/lib, .skilled/bin/bots.cjs, .skilled/skills/system-skilled-bots/runtime/tests): Plan versus runtime: do the files, functions, records, fields and CLI verbs each of the eleven phase plans names exist in the built runtime with the shapes the plan assumes, and are the test and verify commands in every tasks.md and acceptance-criteria.md runnable here (vitest paths, cargo for the Rust screen)? List every mismatch.

## Actions Taken
1. Read 003 `plan.md`, `tasks.md`, the requirement and design-reference blocks of `spec.md`, and its cargo acceptance rows.
2. Probed the toolchain and repo surfaces 003 names: `cargo --version`, `cargo clippy --version`, `cargo fmt --version`, `crates/`, `.opencode/bin`, `.opencode/skills`, `.github/workflows/bots-runtime.yml`, `.gitignore`, the openhuman reference file, and the live `bots ui` refusal.
3. Read 004 `plan.md`, `tasks.md` and its acceptance rows; checked every cited line in `dispatch.ts`, `isolation.ts`, `runner.ts`, `status-index.ts`, `status.ts`, `run-record.ts`, `posture.ts` and `needs-you.ts`.
4. Compared the activity contract phase 001 defines with the row contract phase 003 must parse.

## Findings
1. **P1 — cross-phase, phase 001 `spec.md:144` (REQ-002) and phase 003 `plan.md:72`: the `bots activity --json` row shape is never defined.** 001 says each group carries "its id, its title and its rows" and stops there; no phase names the keys of a row. 003's `cli.rs` must parse typed rows and its activity pane must draw a bot id and a state, so the Rust struct has no contract to match and any key name it invents will fail against 001's implementation. **Exact edit:** add the row schema to 001 REQ-002 (proposed: `{ botId, identity, state, summary, runId }`, with `state` one of the seven group ids) and make 003 cite that requirement in REQ-005 and its `cli.rs` task. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:144] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:72]

2. **P2 — cross-phase, phase 003 `spec.md:193` (REQ-005) versus phase 001 `spec.md:143` (REQ-001): six statuses against seven groups.** 001 emits seven group ids (`needs_you`, `working`, `scheduled`, `done`, `stopped`, `failed`, `recurring`); 003's `activity.rs` names six statuses and REQ-014 draws `?` for an unmapped value, so every `recurring` row renders as unknown. **Exact edit:** name the seventh mapping in REQ-005 or state that `recurring` rows belong to the routines pane and are filtered out of the activity pane. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:193] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:143]

3. **P2 — phase 003, `plan.md:31` and `plan.md:83`, `tasks.md:67` (T019) and `tasks.md:70` (T022): the `.opencode` mirror is a symlink, not a copy.** `readlink .opencode/bin` prints `../.skilled/bin` and `readlink .opencode/skills` prints `../.skilled/skills`, so editing `.skilled/bin/bots.cjs` already changes `.opencode/bin/bots.cjs`; the two "mirror the edited file" tasks are no-ops, and the crate-location rationale ("`.opencode/` mirrors `.skilled/` wholesale and a crate inside the skill would be duplicated") is factually wrong. A copy onto the symlinked path is harmless, but replacing the link with a real file breaks the mirror. **Exact edit:** replace T019/T022 with a `readlink` guard (`readlink .opencode/bin` prints `../.skilled/bin`), and correct the crate-location sentence to say the symlink makes a skill-local crate reachable but not duplicated. [SOURCE: .opencode/bin] [SOURCE: .opencode/skills] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/tasks.md:67]

4. **P2 — phase 003, `plan.md:42` versus `plan.md:31`: the Definition of Ready contradicts the fixture seam.** The DoR requires "Phases 001 and 002 are closed, so `bots activity --json`, `bots inbox --json` and `bots routines --json` exist", while the plan's own overview says the fixture seam makes the three panes provable "before phases 001 and 002 ship their JSON". An implementer cannot satisfy both. **Exact edit:** keep the fixture seam and change the DoR to "phases 001 and 002 are closed or their JSON shapes are frozen; the fixture seam covers the gap", or drop the fixture claim. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:42] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:31]

5. **P2 — phase 004, `acceptance-criteria.md:41` (AC-003): the real-run check is not runnable.** `node -e 'console.log(require("<record>").evidence.branch)'` keeps a literal `<record>` placeholder and never names how the record path is obtained; the record is written to `{stateRoot}/{identityKey}/records/{runId}.json`, not to a path the operator has in hand. **Exact edit:** replace it with the runner-returned `recordPath` (or `jq -r '.evidence.branch' "$STATE"/*/records/<runId>.json`) and name the run id. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/acceptance-criteria.md:41] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:176-178]

## Ruled Out
- Suspected toolchain gap: ruled out. `cargo 1.92.0`, `clippy 0.1.92` and `rustfmt 1.8.0-stable` are installed, matching 003's stated "cargo 1.92.0" and making its DoD runnable.
- Suspected citation drift in 003: ruled out. `bots ui` exits 2; `.opencode/bin/bots.cjs` and `.opencode/skills/system-skilled-bots/SKILL.md` exist; `.github/workflows/bots-runtime.yml` exists; `.gitignore` has no `crates` entry; the openhuman `app.rs` patterns match at lines 301 and 359.
- Suspected citation drift in 004: ruled out. `checkoutLine` at `dispatch.ts:306`, `buildBotPrompt` at 315, `runner.ts:1038` exact, `summarizeRecord` at `status-index.ts:266`, `status.ts:479` exact, `branch: string | null` at `run-record.ts:156`, and both `.opencode` entries are relative symlinks as 004 states.
- Suspected missing crate workspace: ruled out. No root `Cargo.toml` exists, so the standalone manifest path 003 uses is valid.

## Dead Ends
- No dead ends; every citation and probe resolved.

## Edge Cases
- Ambiguous input: none; the frontier focus named the angle and this pass narrowed to 003 and 004.
- Contradictory evidence: phase 003 claims a copy mirror, phase 004 correctly describes the same paths as relative symlinks; the filesystem confirms 004 and the conflict is recorded as finding 3.
- Missing dependencies: none; the crate directory is a create task and the toolchain is present.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/tasks.md
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/acceptance-criteria.md
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/tasks.md
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/acceptance-criteria.md
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts
- .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts
- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts
- .skilled/skills/system-skilled-bots/runtime/lib/status.ts
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts
- .opencode/bin, .opencode/skills (readlink)
- .github/workflows/bots-runtime.yml
- .gitignore
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs
- Host toolchain output: `cargo --version`, `cargo clippy --version`, `cargo fmt --version`

## Assessment
- New information ratio: 1.0
- Questions addressed: F-1-001 for phases 003 and 004
- Questions answered: none fully

## Reflection
- What worked and why: running `readlink` on the `.opencode` entries settled the copy-versus-symlink question in one call and turned a suspicion into a cross-phase contradiction; the same probe also validated phase 004's claim.
- What did not work and why: piping `bots ui` through `head` hid its exit code on the first probe, so the refusal was re-run unpiped; the mistake cost one call and is worth avoiding in later CLI probes.
- What I would do differently: diff the contract a consumer phase parses against the producer phase's requirement table before reading the consumer's tasks, because both 001-003 gaps surfaced only from that comparison.

## Recommended Next Focus
Continue F-1-001 on memory (005) and approval grants (006): verify every runtime symbol they cite, then 007-011 in later passes.
