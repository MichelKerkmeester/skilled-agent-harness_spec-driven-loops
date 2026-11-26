# Review Iteration 005 — deepseek-max-2

**Dimension:** maintainability (D4)
**Focus:** the two-copy maintenance model, what the drift guard can and cannot see, whether the packet's records point a maintainer at the right files, and whether the code's own comments match the code.

## Dispatcher

- Run: `fanout-deepseek-max-2-1795514074741-gl47kr`, generation 1, lineage mode `new`, final iteration of a five-iteration cap.
- Artifact directory: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2`.
- Prior findings carried: P1 × 1 (plural loop names), P2 × 6. Verdict before this iteration: CONDITIONAL.
- `steer.md` absent.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts:1-203`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:1-1024`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:1-298`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (whole file, comment pass)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4480-4990`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:213-214`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:63-65`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:218-253`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. The P1 from iteration 3 remains active.

### P2 Findings

1. **REQ-006 points a maintainer at a test file that holds none of the cases it names** -- `spec.md:213` -- the requirement says "`command-attach.vitest.ts` holds a passing case for each loop-ask clause and a passing `undefined` case for each depth word". That file holds three describes (single routed mode, typed command, route that waits for a mode) and no occurrence of `asksForLoopRun` or any loop/depth vocabulary; the loop-ask and depth-word cases are in `command-attach-guards.vitest.ts` (five `asksForLoopRun` uses). AC-009's cell records the move but the requirement still names the old file.
   Case: a maintainer adding a loop-ask clause follows REQ-006 to `command-attach.vitest.ts`, finds no clause table, and either duplicates the cases in the wrong file or concludes the coverage is missing. The behaviour is tested; the pointer is stale.
   Finding class: `instance-only` (one requirement line).
   Scope proof: `spec.md` and both test files are in `reviewScopeFiles`; the absence was measured with `rg -c "asksForLoopRun|deep review|deep research|thorough"` over `command-attach.vitest.ts` (0) and `rg -c "asksForLoopRun"` over `command-attach-guards.vitest.ts` (5).
   Affected surface hints: `spec.md:213`, `acceptance-criteria.md:66` (AC-009's acknowledged move), `command-attach.vitest.ts`, `command-attach-guards.vitest.ts:808-1024`.

## Traceability Checks

None run this iteration; both core protocols completed in iterations 1 and 2. Empty results array, not a `pending` placeholder.

## Integration Evidence

- The maintenance measurement ran over both gate copies as libraries (`dist/runtime/lib/command-attach.js` and `skill_advisor.asks_for_loop_run`), across 2,306 generated prompts, so the parity statement below is a measurement rather than a reading.
- The drift guard's own coverage boundary was read in `deep-loop-offer-cases.vitest.ts:65-95,241-296`, the file that owns the twelve-pair comparison and the five per-entry groups.

## Edge Cases

- **What the drift guard cannot see.** It compares the exported word lists and two integers. The grammar around those lists — the alternations, lookbehinds and tails in `LOOP_RUN_SYMPTOM`, `PASS_NOUN`, `RUN_ASK_NEGATED` and their Python twins — is unguarded, so a one-sided grammar edit passes every pair. Today the two grammars agree: 2,306 generated prompt combinations produce 0 disagreements between the copies, which is why this is recorded as a boundary of the guard rather than a finding. The plural-ask P1 is the other side of that boundary: a word list that is complete on both sides and still incomplete for the language.
- **Deliberate duplication.** Both offer sections and the two gate copies are duplicated by design (REQ-005, REQ-020); measured parity is the only defence, and it currently holds.
- **`implementation-summary.md:166` still says the drift guard compares eleven pairs** where it compares twelve — same stale-snapshot class as iteration 1's P2-001, not counted again.
- **Self-reported deviation carried from iteration 3**: one `sed -i ''` on this lineage's own iteration-3 narrative, against the prompt pack's banned-operation list; no file outside the lineage was touched.

## Confirmed-Clean Surfaces

- **Parity across the two gate copies**: 2,306 generated prompts (23 leads × 10 loop phrases × 10 tails, plus six stuck-run variants) compared on `asksForLoopRun` and `isStuckRunComplaint` — 0 disagreements.
- **No dead symbol on the changed path**: every exported predicate and table that the packet added or touched (`EXPLICIT_RUN_ASK`, `LOOP_RUN_REQUESTED`, `namesDeepRun`, `MODE_CUES`, `isNoEditRequest`, `isRunRefused`, `typedCommandsIn`, `LOOP_WANT_LEADS`, `MULTI_PASS`, `ITERATIVE_ASK`, `COMMAND_DECLINE_LEADS`, `COMMAND_ASK_LEADS`, `PASS_NOUN`) has a reader in the library, the scorer, the handler or the CLI.
- **Comments match the code on the changed paths**: the `LOOP_NAMES` / `LOOP_WORDING` / `ITERATIVE_ASK` / `PASS_NOUN` / `COUNT_*` / `RUN_REFUSED` blocks each state the grammar the pattern beside them implements, and no comment carries an ephemeral label (iteration 2's check).
- **The fixture and its readers**: one JSON file, one schema, both suites read it; 248 cases, every exported word list covered.

## Ruled Out

- **A parity drift the guard would have missed**: 0 disagreements over 2,306 prompts.
- **Dead code left behind by the packet**: every touched symbol has a reader.
- **A comment that contradicts its pattern**: none found on the changed blocks.
- **Two offer sections drifting apart**: both carry the same option set and the same composed-flag rule.

## Next Focus

- None: this is iteration 5 of a `max-iterations` run. The loop proceeds to terminal gates and synthesis.
- **Carry-forward:** the P1 (plural loop names) is the one finding that needs an operator decision — guard it or record it as a limitation beside limitation 7.

Review verdict: CONDITIONAL
