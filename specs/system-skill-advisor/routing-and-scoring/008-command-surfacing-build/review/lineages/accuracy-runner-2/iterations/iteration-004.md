# Review Iteration 004

## Dispatcher

- Mode: review (fan-out lineage `accuracy-runner-2`, pass two)
- Session: `fanout-accuracy-runner-2-1794570021136-noekp0`, generation 1, lineage mode `new`
- Dimension: D3 Traceability
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Budget profile: verify (12 review actions)
- Operator review focus bound as `review_focus`: pass-two review of command surfacing in the `accuracy-runner` area; check "docs that disagree with code" and holdout hygiene, and re-derive the committed numbers rather than comparing prose to prose.
- How this iteration addressed the focus: it re-derived the five pinned routing numbers from the committed baseline, then read every document that describes the harness (`routing-accuracy/README.md`, `runtime/tests/README.md`, the manual-testing-playbook root and NC-011 chapter, `system-skill-advisor/README.md`, `ARCHITECTURE.md`) against the code or tree fact it names. Four doc-versus-code or doc-versus-tree contradictions are reported; the pinned numbers all hold.
- `steer.md`: absent before this iteration; no lead rulings to apply.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` (metrics and ids only)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` (capturedAt only)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:1-130`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:73-123,1433-1471`
- `.skilled/skills/system-skill-advisor/runtime/tests/README.md:100-165`
- `.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts:1-80`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:1-135,300-320`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/hub-command-attachment.md:1-124`
- `.skilled/skills/system-skill-advisor/README.md:170-180,250-280`
- `.skilled/skills/system-skill-advisor/ARCHITECTURE.md:145-180`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl`, `doctor-prompts.jsonl` (counts and ids only)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The playbook's coverage note names a file convention and a count the tree does not have** -- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:40` -- The note says "the source category tree contains 41 `NNN-*.md` scenario files plus no `CL-002`. This root playbook reflects the live file inventory." The live tree holds 50 `.md` files under nine category folders and **none** of them is named `NNN-*.md`; every file is named after its scenario (`native-recommend-happy-path.md`, `derived-extraction.md`, and so on). The same document's §1 (line 36) says "50 scenario files across 9 categories", and the inventory test asserts 50 rows and 50 files, so the note contradicts both its own document and the gate that guards it. The test checks only the literal "50 scenario files" strings and the table rows, so the stale sentence passes CI.
Finding class: traceability / documentation drift
Scope proof: the root playbook is in the declared area (it documents the harness and its holdout-safe scenarios); the inventory test is the gate that should have caught it.
Affected surface hints: `manual-testing-playbook.md` §1 coverage note; `runtime/tests/manual-testing-playbook.vitest.ts` assertions; any operator reconciling the note with the tree.
Case: an operator reads §1, sees "41 `NNN-*.md`" and a live tree of 50 differently named files, and cannot tell whether 9 files are missing or the note is stale; the inventory test still passes, so the ambiguity survives a green run.

2. **The playbook's result-persistence contract names a folder the skill does not have** -- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:30` -- The contract says "A scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and reason are recorded into `system-skill-advisor/benchmark/reports/<dated-run-label>/`". There is no `benchmark/` directory under `.skilled/skills/system-skill-advisor/` (the skill root holds `runtime`, `hooks`, `feature-catalog`, `manual-testing-playbook`, `references`, `scripts`, `changelog` and the root docs), and no area script creates one. Sibling skills that use the canonical template either have `benchmark/reports/` (`sk-prompt`, `cli-orca`) or phrase the rule as the skill's own `benchmark/reports/` (the template at `.skilled/manual-testing-playbook/manual-testing-playbook.md:23`). The advisor copy rewrote the path into a root that does not exist, so the release rule's evidence step cannot be performed as written.
Finding class: traceability / documentation drift
Scope proof: the root playbook is the area's operator entry point; the tree fact is the skill root itself.
Affected surface hints: `manual-testing-playbook.md` result-persistence contract and §5 release rule; the missing `benchmark/reports/` tree; the canonical template sentence.
Case: an operator finishes NC-011 and follows §Result persistence to `.skilled/skills/system-skill-advisor/benchmark/reports/2026-11-13--pass/`; the path does not exist and nothing creates it, so the scenario cannot be marked complete as the contract requires.

3. **`runtime/tests/README.md` describes the playbook inventory test as a routing-fixture test** -- `.skilled/skills/system-skill-advisor/runtime/tests/README.md:154` -- The key-files table says `manual-testing-playbook.vitest.ts` "Verifies manual testing playbook routing fixtures." The test does not touch routing fixtures: it parses the root playbook's scenario rows, compares them with the live per-feature file list, and asserts the 50-row/50-file inventory and the two "50 scenario files" sentences (`manual-testing-playbook.vitest.ts:43-79`). A reader who trusts the table will look for routing coverage in a test that has none, and will miss the test that would catch a playbook inventory drift.
Finding class: maintainability / documentation drift
Scope proof: the tests README and the inventory test are both in the declared area.
Affected surface hints: `runtime/tests/README.md:154`; `manual-testing-playbook.vitest.ts`; the file's own `describe` text at line 43.
Case: a maintainer adding a scenario looks at the tests README, sees the inventory test filed as a routing-fixture test, and adds a routing fixture instead of the scenario row and file the gate actually checks; the inventory test then fails for a reason the table did not predict.

4. **The scorer README says `--row-id` narrows either mode, but single-session mode ignores it** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:112` -- The row for `score-command-transcripts.mjs` says "`--row-id <id>` narrows either mode to one row". In `--runtime --locator` mode the flag is parsed (`score-command-transcripts.mjs:92-95`) and then never read: `main` calls `scoreSession(options)` (line 1455), and `scoreSession` reads only `options.locator`, `options.runtime` and `options.json` (lines 885-901). The mode's output is a record count for one session, so a row filter has nothing to narrow, and the flag is silently accepted. The usage line repeats the claim (`:40`).
Finding class: documentation drift / silent-flag
Scope proof: the README and the scorer are both in the declared area; the behavior is the scorer's own CLI contract.
Affected surface hints: `README.md:40,112`; `score-command-transcripts.mjs` `parseArgs` and `scoreSession`; any operator who passes `--row-id` expecting a per-row session score.
Case: `node score-command-transcripts.mjs --runtime claude --locator '{"transcriptPath":"/tmp/t.jsonl"}' --row-id cmd-create-skill-typed-01` prints the same whole-session record count with or without the flag; nothing narrows, and no message says the flag was ignored.

## Pinned-Number Reconciliation

| Claim | Source | Baseline value | Verdict |
|---|---|---|---|
| Typed recall 24 of 44 | `spec.md` phase 014 row, pass-one report | `metrics.typed_recall_at_1` = 24/44 | Holds |
| Typed command reach 44 of 44 | `spec.md` phase 011 handoff row | `attachedMetrics.typed.combined` = 44/44 | Holds |
| Plain tune reach 23 of 45 | phase 012 handoff row | `attachedMetrics.plain.tune.combined` = 23/45 | Holds |
| False offers 0 of 35 | phase 014 handoff row | `metrics.false_offer` = 0/35 | Holds |
| Holdout plain recall 1 of 44 | pass-one report | `metrics.plain_recall_at_1.holdout` = 1/44 | Holds |

The baseline's `capturedAt` (`2026-10-11`) equals the `capturedAt` of `scorer-eval-baseline.json`, which is the pinned scoring clock the capture deliberately inherits; the two baselines agree on the date. The `capturedAtSha` (`2549786f28`) is an ancestor of HEAD and the slice test deliberately does not compare it, so no drift is claimed there.

## Traceability Checks

- `spec_code`: pass. All five pinned routing numbers re-derive from the committed baseline and the pinned clock matches its source.
- `checklist_evidence`: partial. No parent checklist; phase 007's open rows remain the only closure gap, and the parent phase map note is iteration 1's finding.
- `skill_agent`: notApplicable.
- `agent_cross_runtime`: partial. The per-runtime proof is still phase 007's; no new per-runtime claim is made from the docs.
- `feature_catalog_code`: pass for the entries read. `feature-catalog/cli-surface/advisor-recommend.md` links NC-001/004/005 and its command semantics match the area; no contradiction found.
- `playbook_capability`: partial. NC-011's four prompts still match the fixed attach rules and its triage symbols resolve; the root playbook's inventory and persistence statements do not.

## Integration Evidence

- `manual-testing-playbook.vitest.ts` ↔ `manual-testing-playbook.md`: the test asserts the two literal "50 scenario files" sentences and the 50 linked rows, which is exactly why the stale §1 note can survive; the gate's coverage boundary is the sentence it checks, not the note beside it.
- `score-command-transcripts.mjs` ↔ `README.md`: the usage text and the flag parser agree on accepting `--row-id` in both modes, and the session-mode body is where the promise stops.
- `command-routing-baseline.json` ↔ `scorer-eval-baseline.json`: the capture reads the pinned date from the evaluator baseline, so the two artifacts are intentionally coupled and currently agree.

## Edge Cases

- **The tree count is a fact, not an inference.** 50 `.md` files under nine category folders, 0 named `NNN-*.md`; the count came from `find`-style listing, and no prompt text was read.
- **CL-004 is listed without a file by design.** The row for CL-004 is an explicit "not yet authored" cell, not a broken link, so it is not counted as a missing file; the 50 linked rows match the 50 files.
- **`benchmark/reports/` may be created by an operator by hand.** Nothing in the tree or scripts creates it, and the canonical template expects the skill to own one; the finding is that the advisor copy points at a path outside its own skill root, which no operator-created folder fixes.
- **No shared-doc contradiction was invented.** `system-skill-advisor/README.md` and `ARCHITECTURE.md` describe the bench, the playbook and the test surfaces accurately for this area; only the four findings above disagree with their code or tree.

## Confirmed-Clean Surfaces

- The five pinned routing numbers.
- The pinned scoring date shared by the two baselines.
- NC-011's expected signals and failure-triage symbols after the pass-one attach fix.
- The corpus files' structural integrity: 195 labeled rows, 66 holdout rows, 24 ambiguity rows and 78 doctor rows, each with unique ids.
- The area README's inventory count (14 code files) and its runner exit-code and holdout-publication sentences.

## Ruled Out

- **A routing floor has drifted from the committed baseline.** Ruled out by re-deriving all five numbers.
- **The two baselines pin different scoring dates.** Ruled out: both are `2026-10-11`.
- **The labeled corpus changed size under the parity test's 195-row assertion.** Ruled out by the row count.
- **NC-011's deep-loop gate description is stale after the pass-one fix.** Ruled out by reading the chapter's expected signals against `command-attach.ts`'s effort gate.
- **`capturedAtSha` points at a commit outside the history.** Ruled out by `git merge-base --is-ancestor`.

## Next Focus

- Dimension: maintainability
- Focus area: the legacy test descriptions, the remaining area docs, and the comments that promise behaviour the code no longer has
- Reason: traceability closed with four P2s; maintainability is the last dimension before a stabilization pass
- Rotation status: D1, D2, D3 complete; D4 next
- Blocked/productive carry-forward: productive (numeric re-derivation and doc/tree comparison); blocked (no live arm)
- Required evidence: a claim, the code or tree fact, and the cost of the next change if the claim stays

Review verdict: PASS
