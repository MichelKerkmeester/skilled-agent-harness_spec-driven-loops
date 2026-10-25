# Brief: 007-compaction-pointer-staleness (B2)

Child path: `specs/hooks/023-session-relaunch-loop/033-research-remediation/007-compaction-pointer-staleness/`. Wave 1, independent.

spec.md metadata: Parent Spec `../spec.md`, Predecessor `../006-relaunch-coverage-gaps/spec.md`, Successor `../008-claim-error-per-state/spec.md`. The order to build in is the wave order in `../spec.md`, not the folder order.

## Problem, with evidence

After a compaction, the pointer tells the session to claim its note and continue "Remaining work" (`.skilled/hooks/session-relaunch/lib/nudge.cjs:210-240`, `seedText` with `afterCompaction`). It gives no age for the note, so Remaining work written before later commits can be redone or trusted when stale. Research §11a lesson 2 (blackhole clears an error only on later evidence). The text reaches Claude (`.skilled/hooks/session-relaunch/claude/compact-pointer.mjs:214`), Pi (`.skilled/hooks/session-relaunch/pi/session-relaunch.ts:638`) and OpenCode (`.opencode/plugins/session-relaunch.js:285`).

## Design

`seedText` takes the note's `created_at` (each caller reads it from the note frontmatter). With `afterCompaction` true, the text names it and tells the session to run `git log --since=<created_at>` and `git status` and compare them with Remaining work before trusting it. Without `afterCompaction` the text is unchanged. A note with no `created_at` gets the git step without a date.

## Scope for the builder

In: `lib/nudge.cjs`, the three callers above, tests in `tests/nudge.test.cjs`, `tests/claude-adapters.test.cjs`, `pi/session-relaunch.test.ts`, `.opencode/plugins/tests/session-relaunch.test.cjs`.
Out: the relaunch seed text, the withdrawn compaction text.

## Requirements

- REQ-001 The after-compaction text names the note's `created_at`.
- REQ-002 It asks for `git log --since=<created_at>` and `git status` before Remaining work is trusted.
- REQ-003 Claude, Pi and OpenCode pass `created_at` to `seedText`.
- REQ-004 The relaunch seed text (no `afterCompaction`) is byte-identical to today.
- REQ-005 A missing `created_at` still yields a valid text with the git step.

## Acceptance criteria

- AC-001 **Given** a note with `created_at: 2026-10-25T10:00:00Z`, **When** `seedText` runs with `afterCompaction: true`, **Then** the text holds that timestamp, `git log --since=2026-10-25T10:00:00Z` and `git status`. Verify: `nudge.test.cjs`, red before.
- AC-002 **Given** each runtime's compaction path with that note, **When** it sends the pointer, **Then** the sent text holds the timestamp. Verify: one test per adapter.
- AC-003 **Given** `afterCompaction` false, **When** `seedText` runs, **Then** existing seed tests pass unedited. Verify: test run.
- AC-004 **Given** a note with no `created_at`, **When** the pointer builds, **Then** it holds the git step and no `undefined`. Verify: test.

## Failing-first tests

- `nudge.test.cjs`: "after-compaction pointer names the note created_at and the git checks".
- Adapter tests: "compaction pointer carries the note date" in each of the three suites.

## Live proof

None required.

## Risks

- Conformance tables in `tests/adapter-conformance.test.cjs` may snapshot pointer text; update them only for the after-compaction case.

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
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/007-compaction-pointer-staleness --strict
```

Read the output, not only the exit status. Fix every warning; strict treats warnings as failures.
