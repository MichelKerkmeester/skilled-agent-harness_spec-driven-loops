# Iteration 001 — existing skill reuse (Q1) and the 001 contract (Q2)

- **Run**: 2026-11-01T21:41:55.986Z | Segment 1 | Iteration 1 of 3
- **Focus**: Q1 (what in `sk-create-manual-testing-playbook` to reuse or improve) and Q2 (should `001-scenario-contract` change, split or extend)
- **Mode**: read-only review. No researched file was modified.

## 1. FOCUS

Two questions, one seam: the validator and its test harness that phase 001 extends, and the closed key set 001
proposes. Q3 (runner), Q4 (per-runtime feasibility) and Q5 (043/006 fit) were deliberately left to later
iterations.

## 2. ACTIONS TAKEN

1. Read `001-scenario-contract/spec.md`, `plan.md` and the parent `decision-record.md` ADR-001.
2. Read `scripts/validate-playbook-package.cjs` at the seams 001 touches: `issue`, `verdictChecks`,
   `maskFencedCode`, `pathChecks`, `backtickPathChecks`, `evergreenChecks`, `promptValue`,
   `splitTableRow`, `chainTurnOnePrompt`, `promptSyncChecks`, `validateScenario`, the export block and the
   CLI guard.
3. Read the test harness (`scripts/tests/validate-playbook-package.test.cjs`), the fixture README, the clean
   fixture scenario, the snippet template's heading map, and `SKILL.md` §6 (Prompt Synchronization Gate).
4. Grepped the whole non-`specs/` tree for a `Turn | Exact user input` header, case-insensitively, and for
   `^| Turn` table headers under `.skilled`.

## 3. FINDINGS

### Q1 — what to reuse

**F1 (reuse, low risk): the export seam already exists.** The validator exports a function object at line 869 and
keeps every CLI side effect — argument parsing and `exitIfValidationOff` — behind `require.main === module`.
Exported: [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:869]
Guard: [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:892]
Validation switch inside the guard, not at module scope:
[SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:899]
The test suite already imports across that seam, which is the precedent REQ-005 claims:
[SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:10]
So a runner importing `parseConversationScript` cannot accidentally boot the CLI or exit on
`SKILL_VALIDATION=off`. This is the single most load-bearing reuse decision in 001 and it is sound.

**F2 (reuse, low risk): `promptSyncChecks` is already the right shape for REQ-004.** The copy list is a
three-tuple array with one entry per copy, and the Turn 1 entry is already present:
[SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:619]
Adding "the conversation block's first send" is one more tuple. No restructuring is needed.

**F3 (reuse, low risk): `maskFencedCode` is the right exclusion primitive**, and `backtickPathChecks` already
applies it ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:412]),
as does `pathChecks`. The new block needs the same treatment in two places that do not have it today — see F5.

**F4 (improve, medium): the test harness cannot enforce REQ-003's strongest clause.** `expectViolation` asserts
only that a code appears in the report:
[SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:57]
REQ-003 requires each finding to name the field path, but "one failing case per rule" written against this helper
would pass even if every rule blamed `turns` instead of `turns[2].questions[0].answer`. Recommend a sibling helper
(`expectConversationViolation(label, mutate, pathFragment)`) that asserts the fragment, and at least one case per
nested level. Without it the field-path promise is untested prose.

**F5 (reuse with a warning, medium): do not put the block in `fixtures/clean-package`.** `expectClean` asserts a
package-wide exit 0 ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:64])
and the suite already pins prompt-sync warning counts per label. The clean package is the positive baseline that
REQ-008's "same counts as before" comparison is taken against; mutating it changes both sides of that comparison at
once. A second fixture package, or a second scenario file in a dedicated `conversation-package` fixture, keeps
`clean-package` byte-identical.

**F6 (improve, medium): the `Turn | Exact user input` table has no template home and no shipped instance, so
REQ-004 extends a rule nothing exercises.** The snippet template's §3 subsections are Prompt, Commands, Expected,
Evidence, Pass/Fail, Failure Triage and Optional Supplemental Checks, with no Turn table:
[SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md:105]
[SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md:133]
The rule is nonetheless documented as a first-class copy — "A conversation chain's Turn 1 input, when the scenario
has one, because that is the copy a runner sends":
[SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:334]
A case-insensitive grep over the non-`specs/` tree for the header returns nothing, matching the measured
`0` in the phase spec. Two consequences: (a) the new block ships a second multi-turn format beside a documented
one with no scenarios, and the reference must say which to choose; (b) if a conversation scenario also carries a
§3 chain table, its Turn 1 cell is compared with the contract prompt while the block's first `send` is compared
too — two copies with the same normalisation but different sources of truth. Pick one and state it.

### Q2 — what should change in 001

**F7 (defect, high): the conversation block is scanned by two raw-text checks that do not mask fences.**
`validateScenario` passes the raw file text to `verdictChecks` and `evergreenChecks`:
[SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:742]
[SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:745]
Neither masks fences (`verdictChecks` at line 280 reads `text` directly; `evergreenChecks` at line 426 splits
`text.split('\n')`), unlike `pathChecks` and `backtickPathChecks` which do.
[SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:280]
[SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:426]
Concrete collisions with the block's own payload:
- `FORBIDDEN_VERDICTS` is `PARTIAL, READY, UNAUTOMATABLE, BLOCKED`
  ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:20]),
  so `{"check": "grep -q BLOCKED out.txt"}` or an answer containing "blocked by sandbox" becomes a
  `FORBIDDEN_VERDICT` error on a file that is otherwise valid.
- `SKIP_BLOCKER_MISSING` fires on a bare `SKIP` in any string in the block.
- `BAKED_RUN_TRANSCRIPT` and `DEVELOPER_ABSOLUTE_PATH` scan every JSON line, including `send`, `answer` and
  `check` values.
Recommendation: add to REQ-003 (or a REQ-010) that the conversation block is masked out before `verdictChecks` and
`evergreenChecks` run, plus a negative test whose `check` contains `BLOCKED` and still validates clean. REQ-002's
"a file without the block produces exactly the findings it produced before" is true but not sufficient: the
failure mode is files *with* the block.

**F8 (precision, medium): ADR-001's justification overstates the pipe problem.** `splitTableRow` splits on
`(?<!\\)\|` and `promptValue` turns `\|` back into `|`:
[SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:512]
[SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:500]
An escaped pipe therefore survives a table cell, so `a regular expression with | cannot be carried` is
falsifiable by `colou\?r|color` in one cell. The decision still stands on the parts that are true — one value per
cell cannot hold a label list, `promptValue` strips backticks, and a cell cannot carry a per-turn shell check —
but 001 spec §2 and ADR-001 should be re-worded to rest on those, or a reviewer will read the pipe claim as an
error and question the rest.

**F9 (gap, medium-high): the closed key set has no keystroke verb.** `send` is one line of text and `action` is
`restart` or `compact`; there is no way to press Escape, Ctrl-C, an arrow key or a bare Enter, and the key set is
closed so an author cannot add one. Every fresh scratch project on first launch shows an onboarding or trust
selector, and shift-tab mode switching is not typeable as text. REQ-003 bans a missing `send` and a turn with both
verbs but does not reject an empty `send`, so "press Enter" is expressible only by accident with undefined
behaviour. Two ways out: a `keys` string verb with a closed vocabulary (`enter`, `escape`, `up`, `down`,
`ctrl-c`), or an explicit rule that `send: ""` means Enter and is legal. Either is cheaper now than after 002's
adapters are fixed from live probes.

**F10 (design smell, medium): `answer.select` overloads array length into a mode bit.** The plan states "two or more
labels mean a multi-select" (plan §3 schema table). A runner cannot tell a multi-select turn from a single-select
dialog where the script toggles one of two options, and the validator cannot check which the runtime offers. A
separate `multi: true` field, or a per-runtime expectation, removes the ambiguity; today a single-select dialog
with two labels is a silent authoring trap.

**F11 (gap, medium): no turn-level runtime filter.** `runtimes` is top-level only, so one script served across five
runtimes cannot carry a turn that applies to one runtime. With the Codex question tool gated behind an
under-development flag (parent spec §4), the honest encoding of "this turn only runs on Codex with the flag on" is
today a second whole script. Recommend a per-turn optional `runtimes` (or `unless`) checked against the top-level
list.

**F12 (gap, medium): no negative expectation and no occurrence count.** `optional: true` relaxes a required
question, but nothing can assert that a question must *not* be asked, and nothing counts asks. Consumption of
answer-once behaviour in 043/006 is exactly the case where a second prompt is the bug.

**F13 (gap, medium): `timeout_ms` accepts 0, and check-failure semantics live in the wrong phase.** A
`timeout_ms: 0` is an instant failure and almost certainly a typo; `non-negative` should be `>= 1` with the
300000 default kept. The block contract says a failing `setup` command stops the run but says nothing about a
failing `check`; whether the run stops at the first failed check or collects the rest is an evidence-volume
decision that belongs in 001's contract, not only in 002's runner.

**F14 (coverage, medium): nothing binds a declared runtime id to a shipped adapter.** 001 exports
`CONVERSATION_RUNTIMES` with five ids and 002 may ship partial tool-question support for one of them, so a script
can validate clean and be unrunnable. Recommend a 002 test that iterates `CONVERSATION_RUNTIMES` and asserts an
adapter entry exists per id, so adding a sixth id in 001 cannot land without an adapter.

### Ordering and splitting

No split is warranted: 001 is one parser, one error code, one export, one reference, one template section and one
changelog, and its files list is coherent. The only re-ordering worth taking is inside 001's own task order — the
fixture decision (F5) and the mask decision (F7) must be made before the rule list is frozen, because both change
which cases exist and what "clean" means. Recommend making F7 and F5 explicit tasks ahead of the rule table rather
than discoveries during T-implementation.

## 4. QUESTIONS ANSWERED

- Q1 — answered: reuse the export seam (F1), the prompt-copy array (F2) and `maskFencedCode` (F3); improve the test
  helper's field-path assertion (F4), keep `clean-package` untouched (F5), and resolve the two-format overlap with
  the undocumented Turn table (F6).
- Q2 — answered: keep the block and its location, keep the phase whole, but add the fence mask for verdict and
  evergreen checks (F7), re-word the pipe justification (F8), decide the keystroke verb or empty-`send` rule (F9),
  un-overload `select` (F10), and add turn-level runtime filtering (F11), negative expectations (F12),
  `timeout_ms >= 1` plus check-failure semantics (F13) and a runtime-to-adapter coverage test (F14).

## 5. QUESTIONS REMAINING

- Q3 (runner shape), Q4 (per-runtime feasibility against `cli-*` skills and `--help`), Q5 (043/006 stage marks and
  kill switch). Untouched by design.
- Carried into Q3/Q4: F11 (per-turn runtime filter) only matters once the adapter table exists, so its final answer
  belongs with Q3.
- Probe that would settle Q4's Codex limb: `codex features list` and `codex --help` for
  `default_mode_request_user_input`, read-only.

## 6. NEXT FOCUS

Q3 and Q4: read `002-conversation-runner/spec.md` and `plan.md` for the runner, scratch guard, cleanup, evidence
and matrix, then check each runtime's feasibility claim against the matching `cli-*` skill and that CLI's
`--help`.
