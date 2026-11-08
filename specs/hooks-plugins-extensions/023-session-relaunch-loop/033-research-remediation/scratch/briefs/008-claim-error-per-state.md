# Brief: 008-claim-error-per-state (B3)

Child path: `specs/hooks/023-session-relaunch-loop/033-research-remediation/008-claim-error-per-state/`. Wave 1, independent.

spec.md metadata: Parent Spec `../spec.md`, Predecessor `../007-compaction-pointer-staleness/spec.md`, Successor `../009-pi-arm-on-agent-settled/spec.md`. The order to build in is the wave order in `../spec.md`, not the folder order.

## Problem, with evidence

`claimHandoff` refuses any non-open note with one message, `cannot claim handoff with status ${status || 'missing'}` (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1072-1076`). A session reading it does not learn that a done note is finished work, or who holds a claimed note. Research §11a lesson 3. Tests match the prefix at `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` ~302 and ~1940.

## Design

Keep the prefix and add a sentence per state:
- done: the work is finished; do not continue it.
- claimed: names `claimed_by` and `claimed_at`; another session owns it.
- missing status: not a handoff note.
- any other status: the prefix alone.

## Scope for the builder

In: `relaunch-core.cjs` `claimHandoff`, `relaunch-core.test.cjs`, any CLI test asserting the full message (`session-relaunch-cli.test.cjs`).
Out: claim locking, seed text.

## Requirements

- REQ-001 Every refusal keeps the prefix `cannot claim handoff with status X`.
- REQ-002 A done note's error says the work is finished and must not be continued.
- REQ-003 A claimed note's error names `claimed_by` and `claimed_at`.
- REQ-004 A note with no status says it is not a handoff note.
- REQ-005 Existing prefix tests pass unedited.

## Acceptance criteria

- AC-001 **Given** a done note, **When** claimed, **Then** the error starts `cannot claim handoff with status done` and says it is finished, do not continue. Verify: test, red before.
- AC-002 **Given** a note claimed by `s-1` at `2026-10-25T10:00:00Z`, **When** claimed again, **Then** the error names `s-1` and that time. Verify: test.
- AC-003 **Given** a note with no status, **When** claimed, **Then** the error starts `cannot claim handoff with status missing` and says it is not a handoff note. Verify: test.
- AC-004 **Given** the existing tests at ~302 and ~1940, **When** run, **Then** they pass unedited. Verify: test run.

## Failing-first tests

- `relaunch-core.test.cjs`: "claim of a done note says the work is finished", "claim of a claimed note names its owner", "claim of a note with no status says it is not a handoff note".

## Live proof

None.

## Risks

- `claimed_by` comes from the note; strip line breaks so the message stays one line.

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
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/008-claim-error-per-state --strict
```

Read the output, not only the exit status. Fix every warning; strict treats warnings as failures.
