# Review Iteration 005

## Dispatcher

- Mode: review; target agent `deep-review`; lineage `deepseek-max-1`; generation 7; session `fanout-deepseek-max-1-1795546920757-7pyjry`.
- Iteration 5 of 7 (stopPolicy `max-iterations`).
- Dimension: `security`. Focus: the trust boundaries the packet's own NFR-S01 and NFR-S02 rows claim, plus the four paths that carry a command to a reader - the gate, the typed-command branch, the degraded CLI brief and the Python fallback.
- Operator review focus, carried: the traceability protocols stay closed; no requirement row claims a security property beyond NFR-S01/NFR-S02, so this iteration tests the claims the packet does make rather than adding new ones.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:71` to `:79` (`COMMAND_ROWS` deep entries and the doctor row), `:109` to `:110` (`command-spec-kit-deep-*`), `:136` to `:147` (`TRACKED_COMMANDS` deep rows), `:1537` (`attachCommand`), `:897` (`RUN_REFUSED`), `:1455` (`namesLoopSubject`).
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489` (`trackedCommandForOwner`), `:1503` (`degradedRecommendations`), `:1639` to `:1656` (the unreachable-daemon fallback and its `degraded: true` payload).
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:233` (the hook's prompt truncation to `ADVISOR_PROMPT_MAX_CHARS`).
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257` (`ADVISOR_PROMPT_MAX_CHARS = 10_000`), `:262` (the `prompt` bound).
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:655` (`AdvisorRecommendInputSchema.parse`), `:363` (`enrichCompiledRoutes`).
- The built `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js`, called 1,780 times across every fixture prompt, five route shapes and nine crafted injection strings.

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R1-P1-001` and `R4-P1-001` remain active.

### P2 Findings

None new.

## Traceability Checks

- `spec_code` and `checklist_evidence` stay `pass` from iteration 3: NFR-S01's row is checked below against the table the gate reads, and NFR-S02's row is checked by reading the changed surfaces for a credential or file read. Neither is a new protocol run.

## Security Surfaces Checked

| Surface | Claim | Result |
|---|---|---|
| Policy of the two deep commands | NFR-S01: the `run` policy never starts a deep command; both keep `ask` | Holds. `command-deep-research`, `command-deep-review`, `command-spec-kit-deep-research` and `command-spec-kit-deep-review` all read `policy: 'ask'` (`command-attach.ts:71`, `:72`, `:109`, `:110`); the only `run` rows are doctor and other read-only tools, and `/doctor:deep-loop` is `run` by design (`:79`). |
| Command string construction | No reader text becomes part of the command | Holds. 1,780 calls over 347 fixture prompts, five route shapes (review, research, empty targets, `{}`, `null`) and nine crafted strings returned only the three table commands or `undefined`; zero off-table results. |
| Injection strings | A shell metacharacter in the prompt cannot reach the command | Holds. `run a deep review; rm -rf /`, `&& curl`, `$(whoami)`, backticks, `--spec-folder=../../etc`, a NUL byte, a right-to-left override and a 9,000-character suffix all produced a table command or nothing. |
| Degraded CLI brief | A supplied command must be one the tracked table names for the row's own skill | Holds by construction. `trackedCommandForOwner` (`skill-advisor-cli.ts:1489`) gates the supplied string at `:1571`, and the fallback only runs when the daemon is unreachable (`:1639`). |
| Prompt-size boundary | REQ-030: the fallback reads the same 10,000-unit head the native schema accepts | Holds, and the boundary is the contract's own: the hook truncates at `hooks/lib/skill-advisor-cli-fallback.ts:233`, the native schema rejects above `ADVISOR_PROMPT_MAX_CHARS` (`advisor-tool-schemas.ts:257`), and the fallback's `_advisor_prompt_head` cuts at the same count in JavaScript units. A longer prompt is outside the advisor's input contract rather than a defect in the gate. |
| Credential and file reads | NFR-S02: no credential or user data is read | Holds over the changed surfaces. The gate reads only the prompt string; the only file reads on these paths are the tracked-command table and the compiled-route lookup, both repository files. |

## Integration Evidence

- Native path: `lib/command-attach.ts` `attachCommand`, probed through `dist/runtime/lib/command-attach.js`.
- Degraded path: `skill-advisor-cli.ts` `degradedRecommendations` with `trackedCommandForOwner`, and the `EXIT_RETRYABLE`-only fallback at `:1639`.
- Hook path: `hooks/lib/skill-advisor-cli-fallback.ts:233` truncation.
- Schema boundary: `schemas/advisor-tool-schemas.ts:257` and the handler's parse at `advisor-recommend.ts:655`.

## Edge Cases

- Ambiguity: a prompt that merely mentions a typed command in a declarative sentence ("the advisor attaches /deep:review only when asked") receives the command. Read as intended rather than as a finding: ADR-005 already establishes that a typed command is the reader's own choice on the served head, and this packet's REQ-020 only removes the command for a refusal, a question or a documentation path. Recorded here so the decision is visible rather than silent.
- Contradiction, none: the two deep commands keep `ask` in all four rows, and no path in the changed files upgrades them.
- Missing dependency: the Python fallback was not executed from this lineage; its size boundary and its mode-free rule were read from source.
- Partial success: five of the six surfaces are cleared by probe; the credential-read claim is cleared by reading the changed surfaces, which is the strongest evidence four of them admit.

## Confirmed-Clean Surfaces

- No user text reaches a command string: 1,780 calls, zero off-table results.
- Both `/deep:*` commands keep policy `ask` on every table row the gate reads.
- The degraded brief cannot serve a command it cannot vouch for.
- The hook truncates before the schema boundary it would otherwise exceed.

## Ruled Out

- "A shell metacharacter in the prompt can inject into the served command": ruled out. The command comes from a fixed table, and nine crafted strings returned table values only.
- "The gate reads files or credentials under attacker control": ruled out. The only reads are the tracked table and the compiled-route lookup.
- "A prompt over the cap makes the hook fail": ruled out. The hook truncates at the same boundary the schema enforces.
- "The doctor row's `run` policy is a violation of NFR-S01": ruled out. NFR-S01 is written about the two deep commands, and `/doctor:deep-loop` is the hand-off this packet's REQ-009/REQ-024 deliberately offer.

## Next Focus

- Dimension: `maintainability`.
- Focus area: the reducer's own strategy writer as it behaves in this lineage, the duplication between the two gate copies, and whether a reader of the packet can follow the change without the review history.
- Reason: four dimensions need coverage before STOP; `maintainability` is the last uncovered one, and this lineage has already produced evidence about the reducer's projection quality.
- Rotation status: `security` closes; `maintainability` opens.
- Blocked/productive carry-forward: productive - reading the table the gate reads and then fuzzing its callers cleared five surfaces quickly; the same shape applies to the reducer's strategy writing.
- Required evidence: a maintainability finding with file:line and an artefact in this lineage that shows the defect, or a named quality claim checked and cleared.
- Recovery note: none.

Review verdict: CONDITIONAL
