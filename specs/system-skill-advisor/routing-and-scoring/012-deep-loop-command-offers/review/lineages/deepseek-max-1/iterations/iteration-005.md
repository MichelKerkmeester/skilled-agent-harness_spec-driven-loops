# Review Iteration 005 — Traceability (`checklist_evidence`)

## Dispatcher

- Lineage `review/lineages/deepseek-max-1`, iteration 5 of 7, session `fanout-deepseek-max-1-1795550334883-gjbarh`
- Dimension: D3 traceability, second core protocol. Operator focus: every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` against evidence that exists in the tree.
- Method: extract every path a ticked task cites and resolve it, then read the acceptance table as a table (status distribution, evidence presence) rather than row by row.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:1` to `:349` (all 138 ticked boxes and the 3 open ones)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:64` (AC-001 to AC-059, read as a table)
- `.skilled/skills/system-deep-loop/command-metadata.json:1` (the metadata file T046 names)
- `.skilled/commands/deep/research.md:1`, `review.md:1` (the argument hints T046 names)
- `.skilled/skills/sk-doc/scripts/validate_document.py:1` (the validator T046 names)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Level | Status this iteration | Evidence |
| --- | --- | --- | --- |
| `spec_code` | core | partial | No new requirement was opened this iteration; REQ-001 to REQ-034 keep the coverage iterations 3 and 4 recorded. REQ-035 to REQ-051 remain, and iteration 7 is reserved for them. |
| `checklist_evidence` | core | partial | Two checks, both mechanical. First, every path a ticked task cites was resolved: 138 boxes cite paths, 19 of them by bare filename, and all 19 resolve once the packet-relative and runtime-relative roots are tried (`results-after.json` and the other `results-*.json` probes under `scratch/probes/`, `doctor-handoff-command.vitest.ts` under `tests/scorer/`, `F5.md` and `F6-sample-*.md` under `scratch/behaviour/`, and `validate_document.py` under `.skilled/skills/sk-doc/scripts/`), so no ticked task points at a file the tree does not hold. Second, the acceptance table was read as a table: of its 59 rows, 54 read `Met`, 3 read `Waived` with an ADR (AC-008 with ADR-003, AC-017 with ADR-002, AC-020 with ADR-009), 1 reads `Superseded` with an ADR (AC-019 with ADR-001) and 1 reads `Unmet` (AC-040). Every row carries an evidence or verification cell, so no row is met on assertion alone. CHK-020 requires `Met`, `Waived` or `Superseded` on every row, and the single `Unmet` is the row the packet documents as waiting on this review run. The protocol stays `partial` because AC-040 can only close after synthesis, and because AC-038's count is still the one stale cell. |
| `skill_agent` | overlay | notApplicable | The target is a spec packet, not a skill contract; no SKILL.md-to-agent pairing is in scope. |
| `agent_cross_runtime` | overlay | notApplicable | No agent definition is in the review scope. |
| `feature_catalog_code` | overlay | notApplicable | No feature catalog entry is in the review scope. |
| `playbook_capability` | overlay | notApplicable | No playbook is in the review scope. |

## Integration Evidence

- T046 (`.skilled/commands/deep/research.md`, `review.md`, `.skilled/skills/system-deep-loop/command-metadata.json`) was checked rather than assumed: all three files exist, both command docs carry `--stop-policy`, `--lineage-mode` and `--extend-minutes`, `review.md` additionally carries `--review-focus`, `research.md` correctly does not, and both docs carry the executor flags (`--model`, `--reasoning-effort`, `--count`). The metadata file names the same three flags. So the task's claim that the two hints and the copy agree is true in the tree.
- The validator T046 names (`validate_document.py`) lives at `.skilled/skills/sk-doc/scripts/validate_document.py` and at `.skilled/skills/sk-doc/shared/scripts/validate_document.py`; the task names it by filename only, which is the convention the rest of the file follows, so it is ambiguous to a reader but not missing.

## Edge Cases

- 19 of the 138 ticked tasks name their artifact by bare filename. Each resolves, but only after the reader guesses which of several roots the file sits under (packet `scratch/`, `runtime/tests/`, `.skilled/skills/sk-doc/scripts/`). Recorded because a bare filename is a weaker citation than a path: it survives a file moving between directories. Not raised as a finding, since the convention is uniform across the packet and every name resolves today.
- AC-038's stale count (DR1-P2-001) is a `Met` row whose evidence is a real file at a real line, so the usual "does the cell resolve" check passes it. It was caught by re-deriving the count, not by resolving the citation. That is the lesson this iteration carries to iteration 7: a resolving citation is not a current observation.

## Confirmed-Clean Surfaces

- No ticked task cites a path the tree does not hold, after trying the packet root, the advisor runtime root, the deep-loop skill root, the command tree and the sibling packet root.
- The acceptance table has no row without a verification or evidence cell and no status outside `Met`, `Waived`, `Superseded` and the one documented `Unmet`.
- The flag hints T046 names are present in both command docs and in the metadata copy, with the one intentional asymmetry (`--review-focus` only on `review.md`) exactly as the task describes it.

## Ruled Out

- A ticked task pointing at a file that was renamed or removed: eliminated, all 19 bare filenames resolve.
- A `Met` row with no evidence behind it: eliminated, every row carries a verification or evidence cell, and the 60 quoted cells were already checked line by line in iteration 1.
- A flag hint that drifted between the command docs and the metadata copy (T046): eliminated, both docs and the copy carry the same three flags.
- Overlay protocols applying to this packet: eliminated, no skill contract, agent definition, feature catalog entry or playbook is inside the review scope, so each is recorded `notApplicable` with `applicable: false` rather than left pending.

## Review Focus

`checklist_evidence` now covers the task checklist and the acceptance table end to end. It stays `partial` for two named reasons rather than a general one: AC-040 waits on synthesis, and AC-038 carries the stale count.

## Next Focus

- Dimension: D4 maintainability
- Focus area: comment hygiene in the scope files (no decision or requirement ids or spec paths borrowed into code comments), the compiled contract parity story, and whether the drift-guard tables are legible enough to change safely
- Reason: D4 is the only dimension without a full pass, and the review cannot report coverage until it is covered
- Rotation status: D1, D2, D3 covered; D4 next
- Blocked/productive carry-forward: the "re-derive, do not resolve" lesson from iteration 5 is productive for the closure docs
- Required evidence: `file:line` for every comment or doc finding

Review verdict: PASS
