# Label card: 027-stop-second-rater

One card for the operator who fills the label gate. Phase folder:
`specs/cli-jev/003-cli-jev-workflow-integration/027-stop-second-rater/`, called `P` below, so
`P/spec.md:136` means that file at line 136 and `P/scratch/...` is a path under the phase folder.
Scorer: `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs`, cited as `S:NN`.
Inventory: `label-inventory-3.md` in this evidence folder. Phase 42 spec:
`specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/`, cited as
`P42/`. Facts were read on 2026-10-01 at HEAD `ebcc68e8edb42bc736cf52ecb89c1997f5c84e82`.

## 1. Question

One row decides whether the operator's own read confirms the code-derived stop gold of one
sampled deep-research lineage, and the first five sampled lineages must all be confirmed before
the Jev or Deem arm may run (`P/spec.md:132`, `P/spec.md:136`).

## 2. Rubric

The derived gold is defined by the phase, not by a model. `P/spec.md:132` (REQ-002): "A source is
each entry of a `type: finding` delta record's `source` field. It is first-appearance when no
earlier iteration of the same lineage named it. The gold g is the last iteration with at least one
first-appearance source."

The read exists because the derived rule can be wrong. `P/spec.md:193` (risk): "The derived gold is
wrong, because a delta can cite a source the prose rejected." `P/spec.md:207` (open question 8):
the five-lineage read answers whether the derived stop gold matches the iteration prose.

The label value, per row:

- `gold_iteration` is the operator's own read of the last iteration that added a first-appearance
  cited source.
- Write the derived `g` printed beside the lineage on the census `reads:` line to confirm it.
- Any other positive integer records a disagreement, and the run prints
  `stop: derived gold disagrees on <k> of 5 lineages` and opens no arm
  (`P/spec.md:136`, `S:548-549`).

Edge cases the spec names:

- A lineage with no first-appearance source is dropped as `no gold` and never sampled, so it needs
  no row (`P/spec.md:132`, `S:219-221`, `S:1665-1668`).
- The gate checks exactly the first five sampled lineages, not five the operator chose (`S:532`).
- The sample is at most 25 lineages, inert windows first, then ascending SHA-256 of the lineage
  path. The draw is deterministic and seedless (`P/spec.md:86`, `S:1702-1712`).
- Only a singular `source` string moves the derived gold. A finding that carries a `sources` array
  instead is invisible to the derivation (`S:204-215`). If the operator's prose read counts such a
  finding, that read disagrees with the code. The spec's definition controls the derived side.
- A duplicate `lineage` row is refused (`S:512-514`). A malformed row exits 2 and names its row
  before any line prints (`S:497`, `S:502`, `S:506`, `S:510`,
  `P/scratch/w4-session/docs/facts.txt:8`).

UNDEFINED: the spec fixes no reading procedure. It does not say which text within a lineage settles
the prose question, how many iterations to read, or how to treat a `sources`-only finding. The
operator must decide what evidence counts. The operator must also decide, on a disagreement,
whether to write their own value and close every arm for the phase or to confirm the derived `g`.
Both outcomes are valid closes (`P/spec.md:136`, `P/implementation-summary.md:175`).

## 3. Label values

There is no enumerated label vocabulary. The scorer accepts three fields on each JSON line
(`S:485-518`):

- `lineage`: non-empty string. It must be the repo-relative lineage directory exactly as the
  census `reads:` line prints it, because the gate looks it up by exact string (`S:500-503`,
  `S:536`, and the census builds the value at `S:1685`).
- `gold_iteration`: positive integer (`Number.isInteger` and greater than 0, `S:504-507`). This is
  the label.
- `labeler`: non-empty string (`S:508-511`).

The only comparison is `read !== entry.gold` (`S:541`). The value to match is the `g=<n>` the
census prints (`S:1738-1739`).

A confirmed row: `{"lineage":"<exact path from reads:>","gold_iteration":<that g>,"labeler":"<name>"}`.

## 4. Rows

There is no rows file. The rows are the sampled lineages. The census names the first five with
their derived gold on the `reads:` line, and the operator turns those five into rows of the label
file.

- Draw or list command: `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs`
  from the repository root. The default run makes zero model calls, writes no file and prints
  `reads: <path> g=<n> | ...` (`S:71`, `S:1738-1739`, `P/implementation-summary.md:74`). No seed
  exists because the sample is deterministic (`P/spec.md:86`).
- id field: `lineage`.
- The census rerun on 2026-10-01 at HEAD `ebcc68e8ed` printed the same five the inventory recorded.
  Run the census again before labeling, because the sample reads the live tree.

| Row (`lineage`) | Derived g | Open and read |
|---|---|---|
| `specs/sk-doc/z_archive/019-skill-routing-refactor/001-research/004-system-code-graph-routing-research/research` | 4 | `deltas/iter-001.jsonl` to `deltas/iter-008.jsonl`, plus `deep-research-state.jsonl` |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/021-skill-metadata-json-unification/research/lineages/sol-high-fast` | 2 | `deltas/iter-001.jsonl` to `deltas/iter-005.jsonl`, plus `deep-research-state.jsonl` |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/001-research/006-sk-prompt-routing-research/research` | 5 | `deltas/iter-001.jsonl` to `deltas/iter-005.jsonl`, plus `deep-research-state.jsonl` |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/001-research/005-system-deep-loop-routing-research/research` | 7 | `deltas/iter-001.jsonl` to `deltas/iter-010.jsonl`, plus `deep-research-state.jsonl` |
| `specs/system-speckit/032-relocate-specs-folder/001-relocation-implications-research/research/lineages/sol` | 5 | `deltas/iter-001.jsonl` to `deltas/iter-005.jsonl`, plus `deep-research-state.jsonl` |

Per row, and how to resolve it to text:

- `<lineage>/deltas/iter-NNN.jsonl` in ascending N holds the finding records. Each `type: finding`
  line carries `id`, `summary` and a `source` string (`S:160-168`, `S:204-215`). The derived gold
  is the highest N that introduces a `source` seen in no earlier iteration (`S:184-224`).
- `<lineage>/deep-research-state.jsonl` holds the `type: iteration` records to check against the
  prose. The scorer reads `iteration`, `ratio`, `keyQuestions` and `answeredQuestions` from them
  (`S:1653-1663`, `S:1669-1670`).
- One way to resolve the files to text: `rg -n '"type":"finding"' <lineage>/deltas/*.jsonl`
  lists every finding line in file order, and `rg -n '"type":"iteration"' <lineage>/deep-research-state.jsonl`
  lists every iteration record. Read the finding lines in iteration order to see which `source`
  values appear for the first time, then read the iteration record at the derived gold for the
  prose. No commit is pinned. The census reads the working tree (`S:1633-1664`).

Content kind: archived deep-research session material under `specs/**`. Only lineages whose delta
files exist at `origin/main` may reach Jev (`P/spec.md:137`), and Deem stays on the machine
(`P/spec.md:144`).

## 5. Label file

- Path: operator-named, `--gold-reads <file>` (`S:71`, option at `S:1590`, read at `S:1609-1611`).
  No default path exists and the scorer imposes no in-repo or out-of-repo rule. No file exists yet,
  so the operator writes the first one (`P/implementation-summary.md:175`). Phase 42 fixes its
  exact path before the first draft (`P42/spec.md:145`) and proposes a location outside the
  repository (`P42/spec.md:292`). The literal path is the operator's to name (`P42/spec.md:292`).
  UNDEFINED until the operator names it.
- Shape: JSON Lines, one object per line, blank lines skipped (`S:490-492`). Fields: `lineage`,
  `gold_iteration`, `labeler` (`P/spec.md:136`).
- Label field: `gold_iteration`. Labeler field: `labeler`.
- A confirmed row: the operator confirmed its gold read, all three fields are valid, and
  `gold_iteration` equals the derived `g` of that lineage. Five such rows open the gate (`S:535-551`).
- Who writes it and what makes a row confirmed: the operator confirms every row, and a model never
  writes the file. Under phase 42 two models draft each row blind to each other and only the
  operator-confirmed value may enter a label file (`P42/spec.md:42`, `P42/spec.md:160-161`, D1 and
  D2 at `P42/goal.md:49-50`). The phase's own rule stands: no model writes a row of this file
  (`P/spec.md:136`, D5 at `P/goal.md:56`).
- Run outputs: `report.json`, and `calls.jsonl` only from a run that logs calls, go to the
  operator-named `--out` directory (`P/spec.md:119`). The final run stopped at the gate and wrote
  `report.json` only (`P/spec.md:33`).

## 6. Gate

- Count: `LABEL_GATE = 5` confirmed lineages, checked only among the first five sampled (`S:42`,
  `S:532`).
- Per-class minimum: none. The five checked lineages are the first five sampled, and every one of
  them must match its derived gold.
- Below the gate: `stop: fewer than 5 confirmed lineages`, exit 0, census already printed, no arm
  and no call (`S:545-546`).
- On disagreement: `stop: derived gold disagrees on <k> of 5 lineages`, exit 0 (`S:548-549`).
- Zero-call limit: a default run never consults this gate. It is checked only when `--jev` or
  `--deem` is set (`S:1753-1758`), so phase 42 records the census and this reason as 027's
  zero-call result, and the gate line waits for the first operator-approved switched run
  (`P42/spec.md:217`, `P42/spec.md:290`).
- Past the gate: each switch still passes its own backend gate, and a census `no headroom` closes
  both arms with `<backend> arm skipped: no headroom` (`S:1763-1765`, `S:1774-1777`,
  `S:1816-1818`, `P/implementation-summary.md:79`). The census on 2026-10-01 printed
  `planned calls: deem 239 jev 718`, not `no headroom` (`P/implementation-summary.md:74`).

## 7. Drafting content (035 and 031 only)

Not applicable. Those phases draft planted sentences and fixture rows. This phase drafts no
content.
