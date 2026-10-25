# Brief: 005-persisted-hops-validation (R5)

Child path: `specs/hooks/023-session-relaunch-loop/033-research-remediation/005-persisted-hops-validation/`. Wave 1, independent.

spec.md metadata: Parent Spec `../spec.md`, Predecessor `../004-manual-claim-goal-binding/spec.md`, Successor `../006-relaunch-coverage-gaps/spec.md`. The order to build in is the wave order in `../spec.md`, not the folder order.

## Problem, with evidence

`shouldRelaunch` reads `const hops = Number(record.hops)` and declines only when it is not finite or at the limit (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1044-1047`). `Number(null)` is 0, `Number("3")` is 3, and -1 and 1.5 are finite, so a tampered or malformed record passes the cap. Tests cover only 9 and 10 (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:841-860`). The wrapper validates its own env count (`.skilled/bin/skilled-loop:642-645`) but not the record.

## Design

Accept hops only when `typeof record.hops === 'number' && Number.isInteger(record.hops) && record.hops >= 0`; otherwise return `{ relaunch: false, reason: 'hop-cap' }`. Before choosing the number-type rule, the builder confirms every producer writes a number (`createRelaunchRecord` hops param at `relaunch-core.cjs:727-756` and the CLI prepare path); if any writes a string, stop and report.

## Scope for the builder

In: `relaunch-core.cjs` `shouldRelaunch`, `relaunch-core.test.cjs`.
Out: the wrapper, new decline reasons.

## Requirements

- REQ-001 A persisted hop count that is not a number type declines.
- REQ-002 A negative or fractional count declines.
- REQ-003 null, NaN and Infinity decline.
- REQ-004 Valid counts under the limit still relaunch and the limit still declines.
- REQ-005 The decline reason stays `hop-cap`, so the wrapper needs no change.

## Acceptance criteria

- AC-001 **Given** an armed record with hops -1, 1.5, null, "3", NaN or Infinity, **When** `shouldRelaunch` runs with limit 10, **Then** each returns `relaunch: false`, reason `hop-cap`. Verify: table test, red before for -1, 1.5, null and "3".
- AC-002 **Given** hops 0 and 9 with limit 10, **When** it runs, **Then** it relaunches. Verify: test.
- AC-003 **Given** hops 10, **When** it runs, **Then** it declines. Verify: existing test unedited.
- AC-004 **Given** the producers, **When** read, **Then** each writes hops as a number. Verify: file:line in the implementation summary.

## Failing-first tests

- `relaunch-core.test.cjs`: "shouldRelaunch declines malformed persisted hops".

## Live proof

None.

## Risks

- A producer that writes a string would make every relaunch decline; the producer check guards it.

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
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/005-persisted-hops-validation --strict
```

Read the output, not only the exit status. Fix every warning; strict treats warnings as failures.
