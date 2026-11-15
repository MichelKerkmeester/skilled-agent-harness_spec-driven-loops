# Brief: 004-manual-claim-goal-binding (R4)

Child path: `specs/hooks/023-session-relaunch-loop/033-research-remediation/004-manual-claim-goal-binding/`. Wave 3, after 002 is Complete; 003 follows it.

spec.md metadata: Parent Spec `../spec.md`, Predecessor `../003-manual-claim-live-settings/spec.md`, Successor `../005-persisted-hops-validation/spec.md`. The order to build in is the wave order in `../spec.md`, not the folder order.

## Problem, with evidence

A first launch unsets the goal packet and claim seed so an outer session's values never leak in (`.skilled/bin/skilled-loop:470-474`). A manual claim started by the printed command is a first launch, so it never carries the note's goal packet (README `.skilled/hooks/session-relaunch/README.md:193`; research §9 finding 4). On a hop the wrapper exports `SESSION_RELAUNCH_GOAL_PACKET` and, for Hermes, `HERMES_SPEC_FOLDER` (`skilled-loop:755-784`), and Claude starts on the `/goal` slice. A manual receiver gets none of that on any runtime.

## Design

When a first launch's prompt is a claim seed (`[session-relaunch] claim and continue handoff <path>`, optionally followed by the `SPEC_FOLDER_MARKER` suffix, `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:45-47`, built by `specFolderSuffix` at `:89-93`), the wrapper reads the named note, and only when it is open and inside the repository, takes its goal packet and exports it the way a hop does. This needs a core inverse of the seed suffix (parse a seed into note path and spec folder) and `usableGoalPacket` moved from `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:376-381` into the core, with `resolvedSwitches` and `goalRoots` passed in or moved with it. The seed-reading step runs after the unset at `:473`, so an inherited packet is still dropped.

## Scope for the builder

In: `.skilled/bin/skilled-loop` first-launch path, `relaunch-core.cjs` (new seed parser, `usableGoalPacket`), `bin/session-relaunch.cjs` (use the core helper), tests in `skilled-loop.test.cjs`, `relaunch-core.test.cjs`, `goal-handover.test.cjs`, README line 193 and the goal section ~164-174.
Out: claim itself, consume, Devin and Cursor hop behaviour.

## Requirements

- REQ-001 A core function parses a claim seed into note path and spec folder and is the inverse of the seed builder.
- REQ-002 `usableGoalPacket` lives in `relaunch-core.cjs`; the CLI imports it and keeps no copy.
- REQ-003 A manual first launch with a seed for an open in-repo note with a usable packet exports `SESSION_RELAUNCH_GOAL_PACKET`, sets `HERMES_SPEC_FOLDER` on Hermes and starts Claude on the `/goal` slice.
- REQ-004 A seed for a note that is not open, outside the repository, or with no usable packet exports nothing.
- REQ-005 The test "wrapper drops a goal packet inherited from an outer session on every launch" (`skilled-loop.test.cjs` ~2684) stays green unedited.

## Acceptance criteria

- AC-001 **Given** a seed built by the core for a note path and spec folder, **When** the parser reads it, **Then** it returns the same path and folder, including the `none` Skip form. Verify: `relaunch-core.test.cjs` round-trip test, red before.
- AC-002 **Given** a manual Pi, OpenCode, Codex, Devin or Cursor first launch with a seed for an open note holding a packet, **When** the runtime starts, **Then** its environment holds `SESSION_RELAUNCH_GOAL_PACKET=<packet>`. Verify: table test with a stub runtime.
- AC-003 **Given** the same on Hermes and Claude, **When** they start, **Then** Hermes has `HERMES_SPEC_FOLDER=<packet>` and Claude's start prompt carries the `/goal` slice. Verify: test.
- AC-004 **Given** a seed for a claimed note or a note outside the repo, **When** the launch starts, **Then** no packet is exported. Verify: test.
- AC-005 **Given** an outer `SESSION_RELAUNCH_GOAL_PACKET` and no seed, **When** the wrapper launches, **Then** the inherited test passes unchanged. Verify: test run.

## Failing-first tests

- `relaunch-core.test.cjs`: "claim seed parser inverts the seed suffix", "usableGoalPacket is exported by the core".
- `skilled-loop.test.cjs`: "manual first launch with a claim seed exports the note goal packet", "manual first launch ignores a seed for a claimed or outside note".

## Live proof

Optional: one manual Pi claim with a goal-bearing note showing the bound goal. Not required for closure.

## Risks

- Reading a note at first launch adds a node call to every seeded start; only seeded starts pay it.
- Moving `usableGoalPacket` must keep consume's goal-switch behaviour exactly; phase 006 tests that path.

## Docs to fill and the rules they follow

This child is Level 2. `create.sh` already scaffolded it; fill the scaffolded files in place, never recreate them:

- `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md`. Level 2 has no `checklist.md`; `acceptance-criteria.md` is the closure gate.
- Leave `implementation-summary.md` as scaffolded; the builder fills it. Do not edit `goal.md`, it is already written and checked. If what you write disagrees with it, keep your docs true to this brief and name the conflict in your report.

Template rules, all under `.skilled/skills/system-spec-kit/references/`:

- `validation/template-compliance-contract.md` §4 (Level 2 anchors and H2 headers for each doc, in order), §7 (content minimums: spec.md at least 7 H2 sections, at least 5 `REQ-` lines and at least 4 `**Given**` scenarios; plan.md at least 6 H2 sections) and §8.5 (ask the contract engine with `node template-structure.js compare 2 spec.md <abs-path>` from `runtime/cli/utils` instead of guessing).
- `templates/template-style-guide.md` and `templates/level-specifications.md` for Level 2 content.
- `workflows/spec-folder-authoring-checklist.md` §2 to §4.
- `structure/phase-definitions.md` §3, child back-reference: the spec.md metadata table names `../spec.md` as Parent Spec and the Predecessor and Successor given below.
- Keep every scaffolded `SPECKIT_TEMPLATE_SOURCE` and `SPECKIT_LEVEL` marker and every anchor pair. Replace every bracketed placeholder. Set `**Status**` to `Draft`.
- Prose follows `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`. No em dashes anywhere.
- Copy the requirements and acceptance criteria below into spec.md §4 and §5 and into acceptance-criteria.md, each AC as a row with its verification and an empty evidence cell.
- Tasks in tasks.md put the failing-first test before the code change, then the test run, then any live proof, then doc updates.
- Docs may name spec and phase ids. Any code comment the plan describes must carry none: comments keep the durable why only.

## Write scope for you, the writer

Only the four docs above, inside this child folder. No code, no test files, no commits, no pushes. Other sessions share this checkout.

## Test commands (baseline before, rerun after, in the plan's testing section)

```bash
node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs
npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts
```

## Validate (must print `RESULT: PASSED`)

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/004-manual-claim-goal-binding --strict
```

Read the output, not only the exit status. Fix every warning; strict treats warnings as failures.
