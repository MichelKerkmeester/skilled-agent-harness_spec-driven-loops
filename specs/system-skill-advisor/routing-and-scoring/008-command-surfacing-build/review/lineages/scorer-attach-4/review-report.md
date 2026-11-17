# Review Report: Command Surfacing Build, Pass Four (scorer-attach lineage)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the fourth review pass. It runs on the change range `0cdc9fa3ef..400c90e158` — the code the packet changed since pass three, at the pass-four HEAD.
- Lineage: `scorer-attach-4`, area `scorer-attach`, run `fanout-scorer-attach-4-1794669272137-9v23rz`, executor `cli-opencode` `opencode-go/deepseek-v4.1-flash` at reasoning effort max.
- Reviewed scope: the eleven paths in `review/review-scope-4.txt` whose area is `scorer-attach` — `lib/command-attach.ts`, `lib/scorer/fusion.ts`, `lib/scorer/doctor-helper-handoff.ts`, `lib/scorer/projection.ts`, `handlers/advisor-recommend.ts`, and six changed test files — plus the shared feature docs that describe them.
- Inputs to this synthesis: the four iteration narratives, the four delta files, the lineage registry (8 active findings), the strategy and the dashboard.
- Cross-area boundary: renderer/hooks/plugin/session-reader files belong to `render-hooks-plugin-4`; the transcript scorer and capture harness belong to `accuracy-runner-4`; doctor command docs belong to `doctor-docs-4`. This lineage names those surfaces but raises no code finding outside its area.
- Iteration cap: 4 of 4. Convergence was not declared because one active P1 remains; the loop stopped at the cap.

---

## 1. Executive Summary

- **Verdict: CONDITIONAL.** No P0, one P1 and seven P2 findings are active.
- **hasAdvisories: false.** The advisory flag is reserved for a PASS that carries P2s; this verdict is conditional on the P1.
- **Active counts:** P0 0, P1 1, P2 7.
- **The active P1:** a coordinated refusal such as `do not run /deep:review or /deep:research` still delivers `/deep:research` through the typed-command path. The command is `ask`, so it asks before it writes; the refusal is still overridden, which is the defect.
- **Accepted limits kept as P2:** the retired-alias refusal (`do not run /create:skill`) and the generic creation word in a correction (`fix the typo in the readme and make sure ...`). Phase 020 T017 records the first as an accepted limit; AC-004 scopes the small-edit gate to the two exact README prompts and the three document commands.
- **Documentation and requirement drift:** `advisor-recommend.md:39` says a hub suppresses a command its own row already offers, but the changed head-row rule keeps both; `command-meaning-matching.md:65` reports 17 cases where the file now has 28; `REQ-007` says a weak cue needs ranker score 10 while the accepted T025 decision, `AC-007` and the code use 9.
- **One test-fence gap:** the changed tables do not pin the coordinated refusal, the retired-alias refusal, the generic creation word or the `Is the X command` question. The suite stays green while all four are live.
- **Mutating-command safety:** no finding lets a command write without its asking step. The worst outcome is an unfit offer of an `ask` or `start` command, which then asks before it writes. That is why the refusal finding is P1, not P0.
- **Cross-runtime:** the changed attach, scorer and handler modules carry no runtime branch. The six runtimes reach the same handler; the renderer's third-row behavior is a sibling lineage's surface. No live per-runtime session was available in this lineage.
- **Holdout:** no changed source file reads `command-prompts.jsonl` or `holdout-prompts.jsonl`. The two changed tests that read the corpus select a tune id and assert `split === 'tune'` before using the prompt; no prompt text is printed.
- **Release readiness:** `in-progress`. The cap was reached with one active P1 and no convergence event.

---

## 2. Planning Trigger

The verdict requires remediation. One P1 is a must-fix refusal gap; seven P2s cover accepted limits, documentation and test coverage. The Planning Packet groups them into four file-disjoint workstreams.

```json Planning Packet
{
  "triggered": true,
  "triggerReason": "One active P1 is a refusal that still attaches a command; seven P2s cover accepted limits, doc/spec drift and test coverage.",
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "counts": { "p0": 0, "p1": 1, "p2": 7, "active": 8, "iterations": 4 },
  "activeFindings": [
    { "id": "SA4-P1-002", "severity": "P1", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:414", "origin": "introduced", "workGroup": "WG1" },
    { "id": "SA4-P1-001", "severity": "P2", "verdict": "CONFIRMED-ADJUSTED", "location": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:240", "origin": "pre-existing", "workGroup": "WG1" },
    { "id": "SA4-P1-003", "severity": "P2", "verdict": "CONFIRMED-ADJUSTED", "location": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:487", "origin": "introduced", "workGroup": "WG1" },
    { "id": "SA4-P2-001", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1209", "origin": "introduced", "workGroup": "WG2" },
    { "id": "SA4-P2-002", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:39", "origin": "introduced", "workGroup": "WG3" },
    { "id": "SA4-P2-003", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:65", "origin": "introduced", "workGroup": "WG3" },
    { "id": "SA4-P2-004", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts:54", "origin": "introduced", "workGroup": "WG3" },
    { "id": "SA4-P2-005", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:39", "origin": "introduced", "workGroup": "WG4" }
  ],
  "findingClasses": ["guard_gap", "mention_reader_gap", "doc_code_drift", "spec_code_drift", "test_coverage_gap"],
  "affectedSurfacesSeed": [
    "typed-command attach",
    "mention reader",
    "doctor command row",
    "feature-catalog docs",
    "phase 020 requirement text",
    "command-attach test tables"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

| ID | Sev | Dimension | Location | Evidence | Impact | Disposition |
|----|-----|-----------|----------|----------|--------|-------------|
| SA4-P1-002 | P1 | correctness | `runtime/lib/command-attach.ts:414` | `commandOnlyMentioned` requires a separate lead before every occurrence; `do not run A or B` leaves B unled. `typedCommandForTop` returns `/deep:research`; the top row is `system-deep-loop`. | A refusal still attaches an ask-policy command. | Fix in WG1. |
| SA4-P1-001 | P2 | correctness | `runtime/lib/command-attach.ts:240` | `typedCommandIn` rewrites `/create:skill` before the mention guard reads the live name. Probe returns `/create:sk-skill` with `start`. | Documented accepted limit (T017); the code still has the gap. | Keep advisory; revisit only if the alias semantics change. |
| SA4-P1-003 | P2 | correctness | `runtime/lib/command-attach.ts:487` | `CREATION_REQUEST` includes `make`, `new`, `add an`, `need an`; the gate stands down and returns `/create:readme` for correction prompts. | Accepted breadth tradeoff per AC-004/T024/T026. | Keep advisory; the test gap is WG4. |
| SA4-P2-001 | P2 | security | `runtime/lib/scorer/fusion.ts:1209` | `Is the /doctor:update command safe?` and the statement form pass `command-doctor-update`; the bare-ask lead does not allow the noun `command`. | An ask-policy doctor command is offered on a question. | Fix in WG2. |
| SA4-P2-002 | P2 | traceability | `feature-catalog/cli-surface/advisor-recommend.md:39` | The doc says a hub suppresses a command its own row offers; the changed head-row rule keeps both and the changed test asserts it. | Docs disagree with code. | Fix in WG3. |
| SA4-P2-003 | P2 | traceability | `feature-catalog/scorer-fusion/command-meaning-matching.md:65` | The doc says 17 cases; the file has 28 `it(` declarations. | Stale test inventory. | Fix in WG3. |
| SA4-P2-004 | P2 | traceability | `runtime/lib/scorer/doctor-helper-handoff.ts:54` | `REQ-007` says 10; `AC-007` and T025 accept 9; the code uses 9. | A scoring case between 9 and 10 contradicts the requirement text. | Fix the requirement text in WG3. |
| SA4-P2-005 | P2 | maintainability | `tests/command-attach-guards.vitest.ts:39` | None of the four residual prompts has a table row; each would fail at the assertion line today. | The suite stays green while the residuals are live. | Fix in WG4. |

### Finding class / scope proof / affected surfaces

- `SA4-P1-002` -- `guard_gap`; both files in scope, the compiled route for the exact prompt returns `defer`, and the typed path is the live caller. Affected: typed-command attach, multi-command refusals, deep-loop ask policies.
- `SA4-P1-001` -- `guard_gap`; mapping and guard are in `command-attach.ts`, the handler copies the returned command. Affected: retired-command map, `/create:sk-skill` start policy.
- `SA4-P1-003` -- `guard_gap`; the gate and its regex are in `command-attach.ts`, and the compiled route selects `sk-create-readme` for each case. Affected: small-edit gate, `/create:readme` start policy.
- `SA4-P2-001` -- `mention_reader_gap`; the reader and the withholding gate are in scope, and `publicRecommendation` copies the command. Affected: doctor command rows, question/statement phrasings.
- `SA4-P2-002`..`SA4-P2-004` -- `doc_code_drift`/`spec_code_drift`; the docs and the phase requirement describe the changed files. Affected: operator docs, acceptance evidence, handoff threshold text.
- `SA4-P2-005` -- `test_coverage_gap`; the changed test file and the functions it fences are in scope. Affected: `REFUSE8`, the small-edit table, `QUESTION2`, `CHK-FIX-004`.

---

## 4. Remediation Workstreams

1. **WG1 -- Attach refusal guard (safety lane).** Files: `runtime/lib/command-attach.ts`, `runtime/tests/command-attach-guards.vitest.ts`. Fix `SA4-P1-002` by letting a refusal lead cover a coordinated command list (`do not run A or B`), without turning `use A, not B` into a refusal of the requested A. Keep `SA4-P1-001` and `SA4-P1-003` as documented advisories unless the packet reopens the alias or the creation guard.
2. **WG2 -- Doctor question mention.** Files: `runtime/lib/command-attach.ts`, `runtime/tests/command-attach-guards.vitest.ts`, `runtime/tests/command-meaning-anchor.vitest.ts`. Extend the bare-ask lead or the ask list to allow `the` and `command` between the ask word and the name; add the two probes to `QUESTION2` and the `withholdMentionedCommands` table.
3. **WG3 -- Doc and requirement sync.** Files: `feature-catalog/cli-surface/advisor-recommend.md`, `feature-catalog/scorer-fusion/command-meaning-matching.md`, `020-command-offer-fit-guards/spec.md`/`acceptance-criteria.md`. Correct the head-row sentence, update the test inventory, and make `REQ-007` say 9 (or record the discrepancy as the accepted T025 decision).
4. **WG4 -- Test fence.** Files: `runtime/tests/command-attach-guards.vitest.ts`, `runtime/tests/command-meaning-anchor.vitest.ts`. Add the four rows; rename `REFUSE8` if the count changes. The rows make the accepted limits and the remaining gaps visible instead of green-by-omission.

---

## 5. Spec Seed

- State the refusal contract for a coordinated command list: one lead may cover `A or B`, while a later clause that asks for a command still wins.
- State the alias-refusal behavior: `/create:skill` refusal maps to the live command and is an accepted limit until the alias is retired.
- Narrow the creation-request guard to a document-object phrase, or record `make sure`/`add a`/`new` as accepted breadth tradeoffs.
- State the weak-cue bar as one number in `REQ-007`, `AC-007` and the mechanism table.
- Add a doc-sync task to every change that alters a head-row rule or a test inventory.

---

## 6. Plan Seed

- T1: Add the coordinated-refusal regression test first; watch it fail; then adjust `commandOnlyMentioned` and re-run the full `command-attach-guards` suite.
- T2: Add the `Is the X command` row to `QUESTION2`; watch it fail; adjust the bare-ask lead; re-run `command-attach-guards` and `command-meaning-anchor`.
- T3: Update the two feature docs and the phase 020 requirement; run `derive-command-bridges.cjs --check` to confirm no generated drift.
- T4: Add the four test rows from `SA4-P2-005`; keep the accepted limits marked with a comment that names the packet decision, not a spec path.
- T5: Re-run the advisor suite, the five floors and the slice tests; confirm the change does not move a tune or holdout row.

---

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | REQ-003/004 exact prompts pass; REQ-007 says 10 against AC-007's 9; coordinated refusal is an uncovered class. |
| `checklist_evidence` | core | partial | AC-002/003/004/006/007 are Met with evidence; CHK-FIX-004's "two commands" case is a request, not a coordinated refusal. |
| `skill_agent` | overlay | notApplicable | No agent definition changed in this area. |
| `agent_cross_runtime` | overlay | partial | No runtime branch in the changed modules; live proof belongs to the phase 007 arm. |
| `feature_catalog_code` | overlay | partial | Two shared docs disagree with the changed code; doctor routing text remains true. |
| `playbook_capability` | overlay | notApplicable | No playbook surface changed. |

`AC_COVERAGE`: exempt. The target root has no `checklist.md`, no `acceptance-criteria.md` and no `implementation-summary.md`; the phase 020 child docs carry their own acceptance evidence.

---

## 8. Deferred Items

- **Transcript scorer arithmetic** (Codex exec bodies, rg/grep, heredocs, cd, partner-side commands, paired arms, Wilson ranges): owned by `accuracy-runner-4`; this lineage records the boundary and does not raise a finding.
- **Live per-runtime proof** (claude, codex, opencode, pi, devin, dsh): the changed modules are runtime-neutral; the phase 007 arm owns live sessions.
- **Renderer third-row behavior**: whether the hook brief displays the doctor command row is `render-hooks-plugin-4`'s surface; the scorer row exists regardless.
- **Stale local dist**: the system reminder reports a stale compiled dist. The review reads source through vitest; a live runtime may load dist until `npm run build` runs in the advisor package.
- **Accepted limits**: the retired-alias refusal and the generic creation word remain advisories. Reopen only if the packet chooses a narrower alias or creation contract.

---

## Dimension Expansion Map

- Completed pivots: 0.
- Failed pivots: 0.
- Audited overrides: 0.
- Swept: none; the four dimensions each ran once.
- Pivot lineage: none.
- Remaining frontier: the transcript scorer and the live runtimes are sibling areas, not a frontier of this lineage.

---

## Search Ledger

- `requiredBugClasses`: guard_gap, boundary_parsing, state_transition, doc_code_drift, mention_reader_gap, no_edit_policy, holdout_leak, runtime_branch, spec_code_drift, checklist_evidence, test_coverage_gap, vacuous_assertion.
- `covered`: guard_gap, mention_reader_gap, no_edit_policy, doc_code_drift, spec_code_drift, test_coverage_gap.
- `ruledOut`: boundary_parsing, holdout_leak, runtime_branch, vacuous_assertion, checklist_evidence_gap.
- `deferred`: state_transition (no-edit/read-only path split; no compiled-hub read-only route proved), the transcript-scorer arithmetic (sibling area).
- `searchDebt`: 3 (the deferred no-edit path split, the two sibling-area items). `hasSearchDebt: true`.
- `graphCoverageMode`: `graphless_fallback`; the coverage graph seed was skipped because `upsert.cjs` writes outside the lineage boundary.
- `ruledOutCandidates`: the compiled route attaching the refused command; the retired-name rewrite itself; a longer command reading as its prefix; the generated projection being hand-edited; the weak-cue code being wrong; the changed assertions being vacuous.

---

## 9. Audit Appendix

### Convergence summary

| Iteration | Dimension | Ratio | P0/P1/P2 | Verdict |
|---|---|---|---|---|
| 1 | correctness | 1.00 | 0/3/0 | CONDITIONAL |
| 2 | security | 1.00 | 0/0/1 | CONDITIONAL |
| 3 | traceability | 1.00 | 0/0/3 | CONDITIONAL |
| 4 | maintainability | 1.00 | 0/0/1 | CONDITIONAL |

No convergence event was recorded. The cap of 4 was reached with one active P1. `convergenceScore` is 0.0 in the reducer; `hasSearchDebt` is true.

### Coverage summary

- Dimensions covered: correctness, security, traceability, maintainability (4 of 4).
- Changed test files executed: 6; 191 tests passed, exit 0.
- Probe files: `lineage/probes/probe-scorer.vitest.ts` and `lineage/probes/vitest.config.ts` (read-only source probes; no writes outside the lineage).
- Compiled-route front door: run for the refusal, correction and deep-loop prompts; the refusal prompts returned `defer`, the correction prompts returned a single `sk-create-readme` route.
- Deriver: `derive-command-bridges.cjs --check` returned `status: fresh`, `changed: []`.

### Ruled-out claims

- The compiled route attaches the refused command (defer for both refusal prompts).
- The retired-name rewrite is wrong (the mapping is the pinned behavior; the guard ordering is the gap).
- A longer command reads as its shorter prefix (boundary test passes).
- The small-edit gate withholds a genuine creation request (the two controls pass).
- The generated projection was hand-edited (deriver fresh).
- The weak-cue code should be 10 (T025/AC-007 accept 9; the spec text is stale).
- A changed assertion is vacuous (each changed case passes its table row into the function).
- A changed path reads or prints a holdout row (tune-id selection plus split assertion).

### Sources reviewed

- `runtime/lib/command-attach.ts`, `runtime/lib/scorer/fusion.ts`, `runtime/lib/scorer/doctor-helper-handoff.ts`, `runtime/lib/scorer/projection.ts`, `runtime/handlers/advisor-recommend.ts`.
- Six changed test files: `command-attach-guards`, `command-meaning-anchor`, `doctor-helper-handoff`, `advisor-recommend-compiled-route-option`, `doctor-handoff-command`, `typed-command-owner`.
- Shared docs: `feature-catalog/cli-surface/advisor-recommend.md`, `feature-catalog/scorer-fusion/command-meaning-matching.md`, `feature-catalog/scorer-fusion/doctor-command-routing.md`, `scripts/command-bridges/README.md`.
- Packet docs: `020-command-offer-fit-guards/spec.md`, `acceptance-criteria.md`, `tasks.md`; `024-fable-review-remediation/spec.md`; `review/review-scope-4.txt`; `review/review-brief-4.txt`.
- Review doctrine: `sk-code-review/references/review-core.md` §2.

### Write discipline

- Every file written by this lineage is under `review/lineages/scorer-attach-4/`: four iteration narratives, four deltas, the strategy, the config, the registry, the dashboard, the report, the probe files and the temporary record builders.
- No review target, config, generated table, command, skill, agent, renderer or sibling lineage file was modified.
- The state log was written only by `append-mode-event.cjs`; the reducer refreshed the registry, dashboard and strategy after each iteration.
- No nested CLI, sub-agent or Task dispatch was used. No `generate-context.js`, `validate.sh`, git write or out-of-lineage command was run.
