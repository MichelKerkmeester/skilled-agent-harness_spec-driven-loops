# Review Iteration 005

## Dispatcher

- Mode: review, target agent `deep-review`, single review iteration, lineage `deepseek-max-2`.
- Dimension: security.
- Operator focus: the trust and policy claims behind the offers — a refusal, a no-edit clause, a doctor hand-off and a typed command read here against the code and the fixture.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:345` (NFR-S01, NFR-S02)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:226` (`typedAt` boundary rules)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688` (`RUN_ASK_REFUSAL_LEADS`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:878` (`isNoEditRequest`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:897` (`RUN_REFUSED`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1475` (`commandOnlyMentioned`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:748` (`LEAD_WINDOW`)
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257` (`ADVISOR_PROMPT_MAX_CHARS`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5181` (`_LEAD_WINDOW`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:6564` (head passed to the gate)
- `.skilled/skills/system-deep-loop/command-metadata.json:9` and `:57` (`ask_first: ["spend"]`)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:129` (refusal rows)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:138` (doctor-withheld rows)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:310` (no-edit rows)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json:1` (policy column on every `/deep:*` row)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- `NFR-S01` holds. `/deep:research` and `/deep:review` both carry `policy: 'ask'` in the advisor command table, and both command-metadata entries derive it from `ask_first: ["spend"]` [SOURCE: .skilled/skills/system-deep-loop/command-metadata.json:9]. Every `/deep:*` row in the recorded probe run carries `pol=ask`; no deep row reads `run`.
- `NFR-S02` holds: the gate reads the prompt string only. No credential, file or environment value is read on the offer path.
- The refusal and no-edit guards are read before the command is attached: `RUN_ASK_REFUSAL_LEADS` with a two-word gap, `RUN_REFUSED`, `NO_EDIT_REQUEST` scoped to writing modes, and `commandOnlyMentioned` for a command the prompt only names [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:878].
- The typed-command boundary is a start boundary plus a continuation rule, so a path or a file name cannot masquerade as a typed command; `see (/deep:review.md) for the flags` stays untyped because the dot continues the name [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:226].
- No prompt text reaches a regular expression: every dynamic pattern is built from the exported vocabulary through `escapePhrase`, and the only per-prompt regex input is trimmed to the bounded lead window [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:748].
- `checklist_evidence` and `spec_code` results from iterations 2 to 4 stand; the security pass adds the policy and input-handling evidence.

## Integration Evidence

The policy table is the advisor's own `TRACKED_COMMANDS`; the spend gate is the command metadata the command documents read; the recorded probe run shows the served policy on every deep row. The security claims were checked at those three surfaces, not inferred from the offer prose.

## Edge Cases

- The doctor command carries `run`, which NFR-S01 allows because the diagnosis is not a deep run and starts no spend; the refusal rules still withhold it where the prompt refuses any run or fix.
- A retired command name (`/create:skill`) resolves to its replacement before any gate reads it, so a habit does not bypass a guard.
- A typed command after a clause break is honoured, which is the ADR-005 reading; the boundary rule still rejects a command embedded in a path.

## Confirmed-Clean Surfaces

- Deep policy: `ask` on both commands in the table and in every recorded row.
- Refusal: six refusal leads plus the conjunction forms; the fixture's twelve refusal-verb rows agree.
- No-edit: a read-only loop survives, a writing command does not.
- Input handling: bounded windows, escaped vocabulary, no prompt-derived regex.

## Ruled Out

- "A refusal still yields a deep command": ruled out by the fixture rows and the guard that reads them.
- "A `run` policy could start a deep command": ruled out; both deep commands are `ask`, and the `run` policy belongs to the read-only doctor.
- "Prompt text is compiled into a pattern": ruled out by reading every `new RegExp` in the gate; each is built from static lists.

## Next Focus

- Dimension: maintainability.
- Focus area: the gate's structure, the closure documents' clarity, and the one remaining traceability thread (REQ-047/REQ-048 and the counts AC-055/AC-056 record).
- Reason: three dimensions are covered; maintainability is the last uncovered dimension and the right place to close the remaining records.
- Required evidence: the code layout and the documents it mirrors.

Review verdict: PASS
