---
title: "Iteration 6: The best validator residue as a slice — citation drift"
trigger_phrases: []
---
# Iteration 6: The best validator residue as a slice — citation drift

**Angle:** swe-06 · **Lens:** code-level slice design · **Maps to:** D

## Sibling check (W2 contract)

- `swe/iterations/iteration-002.md` (own): the residue table — five candidates (HVR §2/§4/§5, description-fit, agent-tools, citation drift, marginal-DQI).
- `deepseek/iterations/iteration-003.md` (named; read): mapped the 40-rule `validator-registry.json` as M/P/A kinds; **F4 found the same gap this iteration picks** — `AC_COVERAGE` counts `file:line` presence but never verifies the cited line exists or supports its row (`validation-rules.md:110-135`), their N-deepseek-03-3 named it "the cleanest deterministic gap". This slice targets a different population (all `.skilled` doc cites vs spec-AC-row cites) on the same gap class — corroboration, not duplication. Their F7/F8 (advisory sibling, own switch, exit-0, skip line with neither backend, Deem-preferred for doc text) match this design point-for-point.
- `mimo/iterations/`: still only iteration-001 — mimo-02 does not exist; the angle's cross-read target is absent, recorded as missing (glm-03/04's rule applied: critique newest sibling on the question + BASE2).
- BASE2 `research.md`: R20 spec'd at `:262-345` (lexical goal-criteria lint, rubric-gated, ~1,381 criterion lines by anchor parse, ~100 labels, `/create:goal` coverage only); R22 at `:434` and `:64` (HVR reader-needed lens, `noul` per category per flagged section, ~50 labels, later on Q1).

## The count (angle Q1 — "the residue with the best count")

| Residue | Enumerable units counted this iteration | Judgment | Checkability |
|---|---|---|---|
| **R-d citation drift** | **456** `file:line` references in `.skilled/skills/**/*.md` (grep `\w+\.(ts|cjs|mjs|js|py|md|json|sh):\d+`) | does line N of file F still support the sentence that cites it | binary-ish, self-labeling (edit code → cite rots) |
| R-b description-fit | 3,551 `description:` frontmatter fields | does the description match the body | subjective; agreement labels expensive |
| R22 HVR §2/§4/§5 | flagged sections × 9 categories — flag count unmeasurable without running the scanner (angle rule 6 forbids) | meaning-level voice rules | subjective; ~50 labels per BASE2 |
| R-e marginal-DQI | docs landing 60–89 — count needs a DQI run | is the band label fair | subjective |
| R-c agent tools | ~10 agent docs | least-authority of a tool list | needs intent inference |

**R-d wins on count certainty and judgment cleanliness**: 456 units enumerable *today*, each bounded (claim sentence + ~15 lines of cited context ≈ 300 tokens), each with a nearly objective verdict. And it is a real, silent rot channel: `reference_checker*.py` verifies a cite's *shape and target existence*; nothing checks the line still says what the doc claims — confirmed in swe-02's convention table (citation drift row: "needs reading the target for meaning").

## The slice — `cite-drift-scan.mjs`

A strictly additive advisory sibling; never wired into `validate_document.py`'s exit path (its codes are contract-pinned, `:1520-1537` — swe-02). Exit 0 always.

```text
.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs   (~180 LOC)
.skilled/skills/sk-doc/shared/scripts/tests/cite-drift-scan.test.<runner>   (~120 LOC, 8 cases)
```

(placement follows `frontmatter-version.mjs` — a `.mjs` already living in `shared/scripts/`)

| Function | Behavior |
|---|---|
| `extractCitations(docPath)` | regex `[\w./-]+\.(ts|cjs|mjs|js|py|md|json|sh):(\d+)` over prose, **skipping fenced code blocks** (reuse the `_fenced_line_numbers` port — swe-02 R-a) so code samples don't self-report; returns `{file, line, claimSentence}` — the sentence = the containing line's sentence, or the bullet line |
| `readCitedWindow(file, line, ±10)` | opens the cited file read-only; `dead` verdict without a model call when the file is missing or `line > len(file)` |
| `askDrift(claim, window)` | `noul`: *"Does this code fragment show what the citing sentence claims?"* — bounded ~300-token question; malformed/missing answer → row `cite:unasked`, never a default verdict |
| `report()` | per doc: `cites=<n> checked=<n> drifted=<n> skipped=<n>` + one line per non-support verdict (`cite drift: <doc>:<line> -> <target>:<line> (<verdict>)`); ends `cite-scan: done` / `cite-scan: skipped (no backend)` |

### Label schema + scorer (angle Q2)

`{cite_id, doc, doc_line, target_file, target_line, claim_sha12, verdict: supports|partial|contradicts|dead, labeler}` — mirrors R20's `{id, text_sha12, rubric, …, labeler}` shape (BASE2 C24). Gold: ~40 labeled cites sampled across doc kinds (a cheap gold: deliberately drift a cite by editing its target — constructible, not just collectable). Scorer: precision = flagged-drifted ∩ true-drifted / flagged-drifted; recall = flagged ∩ true / true. `partial` counts as drifted for the flag (a reader must look) but is reported separately.

### Probe + skip lines (angle Q3)

Same `probeBackend` contract as swe-04's arm (Deem first — doc text is repo-internal, not operator-private, but the pattern stays uniform): Deem = `GET /health` 200 + `status=="ok"` + backend allowlist (`{torch}`/`ensemble:*` sans stub) + `model=="deem-0.8-v1"`; Jev = D5 (`command -v jev`, `jev 0.6.2`, `jev auth status --provider <p>` exit 0). Switch: `--cite-backend deem|jev|none`, default `none`.

Output with neither backend: `cite-scan: skipped (no backend)`, exit 0, zero model calls, docs untouched — identical to today (the cites were already unchecked).

### Tests (angle Q4)

8 cases: fenced-code cites ignored; dead-file → `dead` without a call; `line > len` → `dead`; a supports/drifted fixture pair; malformed answer → `unasked` row not a verdict; no-backend → one `skipped` line exit 0; report aggregates per doc; a doc with zero cites prints `cites=0` and exits 0.

## Q5 — vs R20 and R22: absorb or differ

| | R20 (goal lint) | R22 (HVR lens) | this slice |
|---|---|---|---|
| Residue class | rubric fitness of criteria lines | voice/meaning rules | referential fidelity of cites |
| Units | ~1,381 criterion lines | flagged sections × 9 | **456 cites (counted)** |
| Judgment objectivity | needs adopted rubric (its blocker) | subjective voice | near-objective |
| Labels | ~100, blocked on rubric | ~50 | ~40, constructible |
| Phase | 006 | unphased (later) | unphased |

**Neither absorbs it; it absorbs neither.** It shares R22's *mechanism* (`noul` over flagged units) and R20's *label schema* but the residue class is distinct — and it has the property both lack: labels can be **manufactured** (drift a cite deliberately) rather than collected from judgment calls. If anything, the merge runs the other way: the same `extract→window→noul→report` skeleton is the reusable sibling-script chassis R22 would inherit when its labels exist.

## Idea record

### N-swe-06-1 — citation-drift advisory scan

| Field | |
|---|---|
| **Idea** | `noul` per `file:line` citation: does the cited code still show what the sentence claims. Type: `noul`, one call per live cite (dead refs need none) |
| **Question** | D |
| **Builds on** | swe-02's residue table R-d; BASE2's R20 label-schema shape (C24) and R22's mechanism — absorbed by neither |
| **Value** | Catches a rot class no validator sees: 456 evidence anchors whose claims outlive their targets. Every spec in this packet cites `file:line` as its evidence format — the citations *are* the research's ground truth |
| **Seam** | new `shared/scripts/cite-drift-scan.mjs`; reads docs the operator names; never edits the validator |
| **Metric, baseline, harness** | drifted-cite rate + precision/recall vs the ~40-cite label set. Baseline today: no measurement exists (UNKNOWN — the cites are never checked). Harness: this script's report + the label set |
| **Savings** | Reviewer minutes: a manual cite audit = open file, read line, compare claim — ~1–2 min × 456 ≈ est. 8–15 h of human spot-checking replaced by one offline pass; per-week recurring cost is only changed-doc cites (est. tens) |
| **Cost, latency, privacy** | ≤456 `noul` calls for a full audit, one per cite; ~30 s on Deem at 60 ms p50 (LOCAL:34-38); offline, no deadline. Deem-preferred (uniform probe contract; docs stay local though they're repo-internal). Jev egresses claim+context window only (~300 tokens/call), no transcript data |
| **Two-backend gate** | `--cite-backend` own switch; probes per contract above; `dead` refs skip the call entirely (no backend needed); malformed → `unasked` row; neither → `cite-scan: skipped (no backend)` exit 0; slow (>2 s/call) → per-call timeout marks `unasked` and continues |
| **Rough LOC** | ~180 script + ~120 tests; zero edits to existing files |
| **Verdict** | **next** — same census-first discipline as everything else this packet: the label set and the drifted-rate baseline come first; the scanner is cheap to build but meaningless until ~40 labeled cites exist to score it against |
| **Confidence** | Confirmed: 456-unit count, the residue's existence (no fidelity check in `reference_checker*.py` per swe-02), the file/line extraction being mechanical. Inferred: drift prevalence is UNKNOWN — could be near-zero (docs freshly versioned) or significant; that measurement is the point |

## Ruled out

- **Absorbing into R22 (HVR)**: different residue class, different label problem; merging would import R22's "later until labels" gate onto a cheaper one.
- **Absorbing into R20**: R20 is blocked on an *unadopted rubric*, not on labels — its blocker is a decision, not data; citation drift needs no rubric.
- **`choice` over {supports,partial,contradicts,dead} as the primary type**: `noul` ("does it support") plus the free `dead` check covers the space; the 4-way choice costs identical calls but adds a calibration surface the binary label schema doesn't need. The richer verdict is derivable in the report, not the question.
- **Scanning all 456 in every run**: unnecessary — a `--since`/`--docs` scope (changed docs' cites only) is the recurring path; full audit is the census.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| 456 `file:line` citations exist under `.skilled/skills/**/*.md` — a counted, enumerable residue population | **new** | grep census this iteration |
| Citation *fidelity* (does the line still support the claim) is unchecked — `reference_checker*` verifies shape/existence only; **deepseek-03 F4 found the same gap first inside `AC_COVERAGE`** (spec-row cites) — two lineages converged on the gap class from different surfaces | confirms BASE + sibling-corroborated (not new as a gap; new as a counted doc-wide population) | swe-02 row; `deepseek/iterations/iteration-003.md` F4 (`validation-rules.md:110-135`) |
| The cite-drift residue is a third class distinct from R20 (rubric-gated criteria) and R22 (voice), with the only *manufacturable* label set in the packet | **new** | BASE2 `:262-345`, `:434`, `:98` C24 schema |
| `description:` fields number 3,551 — bigger count, mushier judgment (fit is agreement-expensive) | **new** | grep census this iteration |
| The sibling-script chassis (extract→window→noul→advisory report) generalizes: R22's arm is the same skeleton with a different question | **new** | shape comparison vs BASE2 `:434` |

## Hand-off

- swe-07: `cli-classifier` hub — this scan is a fourth caller of the shared two-backend probe (after swe-03 leaf, swe-04 arm, swe-05 fallback): the dedupe case is now real.
- swe-08: `dead` verdict needing no model call is a precedent: exhaustion of mechanical checks before the model call is the pattern every residue slice should copy.
- swe-09/10: the `cite-drift-scan` is a candidate first-PR — additive, exit-0, no validator edits, own switch; its blocker is the 40-cite label set, which is authoring work not code.
