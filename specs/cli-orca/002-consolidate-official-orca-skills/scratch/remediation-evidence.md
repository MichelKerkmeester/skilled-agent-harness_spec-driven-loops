# Remediation Evidence

Per-item evidence for the findings in [`../review/synthesis-remediation-plan.md`](../review/synthesis-remediation-plan.md).
Every check below was run from the repository root; the observed output is quoted, not summarised.

## Summary

| # | Finding | Changed surfaces | Proving check | Observed |
|---|---------|------------------|---------------|----------|
| 1 | P1-001 | `SKILL.md` routing contract: keyword sets, qualifier rule, docstring | Router probe harness | baseline `FAIL: generic terminal routed; …` -> final `PASS`, exit 0 |
| 2 | P2-003 | `references/orca-cli-reference.md`: two annotations | `rg` assertion plus a direct read of both sites | both destructive lines annotated, diff is `2 insertions(+)`, 0 deletions |
| 3 | P2-001 | `SKILL.md`: six omitted triggers, official-name placement rule | Router probe harness (`listed trigger does not route` probes) | four trigger probes route; unplaced name defers; placed name loads |
| 4 | P2-004 | `tasks.md` verification record | `doc_sweep` from the gate suite | `cli-orca docs checked=32 blocking=0` matches the recorded value |
| 5 | P2-005 | `resource-map.md`: two glob rows plus Summary | Scope-coverage harness | `rows: 53 -> 54`, `scope entries without a row: 14 -> 0` |
| 6 | P2-002 | `resource-map.md`: benchmark evidence row plus Summary | Same single harness run as item 5 | the two benchmark entries are covered by the new row |
| 7 | P2-006 | five restatement sites plus one pointer each | Canonical-pointer check | `0,0,0,0,0 -> 1,1,1,1,1`; 166 links, 0 broken |

The router contract is also pinned as gate 17 of [`final-gates.sh`](./final-gates.sh), so the pair of routing
findings cannot regress silently.

## Item 1 — generic vocabulary admitted by the routing contract (P1)

Change: the `INTENT_SIGNALS` keyword sets and the qualifier rule in the skill's routing contract, plus the
sentence that describes them. Anchored records and the harness were the only evidence used; no behaviour was
assumed from prose.

- Baseline, before the change: `router probes: FAIL: generic terminal routed; generic browser routed; unplaced official name routed; listed trigger does not route: use the orca cli; listed trigger does not route: orca handoff to another agent; listed trigger does not route: help me with the linear-tickets skill in Orca` (exit 1).
- After the change: `router probes: PASS` (exit 0).
- Placement rule verified both ways: a placed official name still loads, the same name unplaced defers, and the holdout probe still defers.
- Negative control on the gate: the same probe run against the pre-change contract bytes fails, so gate 17 cannot pass vacuously.

## Item 2 — destructive examples without their gate or authorization note (P2)

Change: one annotation line beneath each destructive example in the representative-calls block. The command
lines themselves are untouched, because the block's provenance claims they are copied from the upstream guide.

- `git diff --stat -- .skilled/skills/cli-orca/references/orca-cli-reference.md` -> `1 file changed, 2 insertions(+)`.
- Both sites read correctly with their annotation; the recovery and receipt rules are cross-referenced rather than restated, because the flag's meaning is not settled by any source available here.
- `validate_document.py` on the file: `VALID`, `Total issues: 0`.

## Items 3 and 5 — trigger inventory and map coverage (P2)

Change: the omitted triggers were added and the official-name placement rule was implemented in the same edit
pass, because both touch one keyword block. The map's two index rows became glob rows, and one benchmark
evidence row was added; the Summary was re-derived once for both map findings.

- Trigger probes after the change: listed triggers load; the unplaced official name defers.
- Scope-coverage harness: `rows: 54  scope entries without a row: 0`.
- Summary re-derivation checked against the tables: section counts 2/32/10/9/1 sum to the declared total of 54.

## Item 4 — document count in the verification record (P2)

Change: the recorded count corrected to the observed value, and the row now names the command that reproduces it.

- `cli-orca docs checked=32 blocking=0`; the recorded value matches.
- The two sibling records that already carried 32 were left unchanged, so one record was wrong instead of three.

## Item 7 — restatement sites without a canonical pointer (P2)

Change: one provenance line at each of the five non-canonical sites naming the routing contract as the canonical
statement. No matrix was restructured and no shared validator was touched.

- Canonical-pointer check: five files, each printing `1` (baseline: five zeroes).
- Link resolution across the corpus: `166 links checked, 0 broken` (five more than before the change).
- `validate_document.py` on all six edited documents: `VALID`, `Total issues: 0` each.

## Deferred to later steps

- The full gate suite was not run here: `final-gates.sh` runs baseline-versus-post-change as its own step, and the pre-change capture it compares against already exists under `scratch/gate-results.md`.
- Derived metadata was not re-derived after these edits. Generation-gated files and the packet's own derived metadata are repaired by the steps that re-run the gates and close the packet, so nothing here claims they are current.
- Acceptance rows that the review proves (review-artifact criteria) and the task/checklist closures were left to the closure step rather than being re-graded here.
- No fixture, check or test was weakened, deleted or skipped to make anything pass.
