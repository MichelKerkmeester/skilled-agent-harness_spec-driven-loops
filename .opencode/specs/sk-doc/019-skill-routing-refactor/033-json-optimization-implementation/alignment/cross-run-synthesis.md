# Cross-Run Synthesis — Deep Review + Deep Alignment

Run date: 2026-07-30. Target: the 12-phase JSON-optimization program (14 commits, 71 changed files).

---

## 1. WHAT RAN

| Leg | Executor | Transport | Iterations | Verdict |
|---|---|---|---|---|
| Review | GPT-5.6 LUNA xhigh | cli-codex | 4 | CONDITIONAL — P0 0 / P1 3 / P2 4 |
| Review | GLM 5.2 high | cli-devin | 3 | CONDITIONAL — P0 0 / P1 4 / P2 3 |
| Review | Grok 4.5 high | cli-cursor | 3 | CONDITIONAL — P0 0 / P1 7 / P2 3 |
| Alignment | GPT-5.6 LUNA xhigh | cli-pi | 10 | CONDITIONAL — coverage 71/71 |

No leg found a P0. Alignment ran two lanes — `sk-code::code` (23 files, 3 iterations) and
`sk-doc::docs` (48 files, 7 iterations) — with convergence disabled so the full budget ran;
it stopped at `STOP_MAX_ITERATIONS` with coverage complete.

An earlier LUNA review lineage returned hollow single-line iterations and was correctly
classified failed by the driver's timestamp-anomaly validation. It was re-run as
`luna-xhigh-r2`; both are retained so the failure stays visible.

---

## 2. THE HEADLINE: THE PROGRAM'S NO-REGRESSION EVIDENCE HAS A HOLE

Two lineages independently flagged it, and the third's theme points at the same seam.
Verified directly against the baseline artifacts.

The program's final corpus capture reports this row:

> `| TS scorer top-3 holdout | 53/72 = 0.7361 | 53/72 | zero |`

**53/72 is not the top-3 figure.** The pinned baseline artifacts record two different metrics:

| Artifact | Metric | Value |
|---|---|---|
| `002.../baseline/capture-top3.json` | `holdout_top3` | **55/72 = 0.7639** |
| `002.../baseline/routing-baseline.json` | `holdout_top1` | **53/72 = 0.7361** |

The capture cites the top-1 number under a top-3 label. It then explains the 55-vs-53 gap
away as a pinned-versus-live measurement discrepancy predating the program — but there is
no discrepancy to explain: they are simply different metrics.

The consequence is narrow and should not be overstated. This is **not** evidence of a
routing regression. It means the top-3 holdout metric was never actually re-measured after
the changes, so the program's "zero delta" claim for that row is unevidenced rather than
wrong. Closing it requires re-running the top-3 holdout capture and comparing against
55/72. Grok independently supplied the correct diagnosis (53/72 is top-1); GLM identified
the inconsistency but left the resolution open.

---

## 3. CROSS-CONFIRMED FINDINGS

Ranked by independent agreement, which is the strongest signal available here — three
different models, three different transports, no shared context.

| Agreement | Finding | Severity |
|---|---|---|
| **3/3 lineages** | Program marked Complete while its own close-gate evidence records `validate --strict` unmet | P1 |
| **3/3 lineages** | Parent Phase Documentation Map lists all 12 children Planned; all 12 are Complete | P1 |
| **3/3 lineages** | `_memory.continuity` frontmatter stale across ~10 of 12 children | P1/P2 (disputed) |
| 2/3 lineages | Holdout metric mislabeled — see §2 | P1 |
| 2/3 lineages | REQ-001 acceptance criteria contradicts the Phase Map's own ordering | P1 |
| 2/3 lineages | Command-metadata phase Complete while live-generation acceptance unmet | P1 |
| 2/3 lineages | Committed scratch file holding a patched derived block (confusion hazard) | P2 |

The continuity-frontmatter severity is genuinely contested: Grok rated it P1, and GLM
*downgraded* it P1→P2 during an adversarial replay pass on the grounds that the primary
resume surface is already current. Recording the disagreement is more useful than
averaging it away.

Single-lineage findings, held at lower confidence: a rubber-stamped checklist with
identical evidence across seventeen rows (Grok), implicit workflow token permissions while
npm-fetched tools execute (LUNA), a feature catalog conflating twelve modes with twelve
packets (LUNA), and a deprecated derived-sync writer still advertising a full-object schema
path (LUNA).

---

## 4. THE TWO LEGS FOUND DISJOINT DEFECT CLASSES

This is the structural result, and it is the argument for running both.

**Review** examined whether the program's documentation tells the truth about itself. Every
one of its findings is a claim-versus-evidence defect: status markers ahead of their gates,
maps stale against reality, metrics mislabeled. Not one is a code defect.

**Alignment** examined whether the artifacts conform to their governing authority. Its
findings are the mirror image — code and doc conformance defects, none of them about
completion honesty.

Neither leg found what the other found. There is no overlap between the two sets. A
reviewer's "is this honest?" and an aligner's "does this conform?" are genuinely different
questions, and answering one does not answer the other.

### Alignment findings, verified against the live tree

| Severity | Finding | Evidence |
|---|---|---|
| P1 | An ephemeral packet label sits in a code comment, which this repo treats as a hard block | `ci-skill-derived-freshness.cjs:9` |
| P1 | `'use strict';` sits ~15 lines below the boxed header; the standard requires it immediately after | `ci-skill-derived-freshness.cjs:21` vs `javascript/style-guide.md:56` |
| P1 | Specs and `derived.key_files` cite a `create-skill` path that does not exist; live is `sk-create-skill` | packet `spec.md:159`, `001/graph-metadata.json:48,80`, `009/graph-metadata.json:43,70` |

The third has routing consequences beyond tidiness: those paths sit in `derived.key_files`,
which feeds advisor scoring, so they are dead weight in the corpus.

### Alignment findings not yet verified — treat as hypotheses

Two path joins build paths from authored input without a containment guard
(`ci-skill-root-metadata.cjs:324`, `generate-leaf-manifest.cjs:169`); both inputs are
authored in-repo, so exploitability is likely low, but the cited standard does require the
guard. The contract doc still requires `command-metadata.json` for every hub root while the
implementation makes it optional — expected doc lag, since that rule was deliberately
reversed mid-program. The docs validator is reported unable to load its rules file before
reading an artifact. Nine artifacts sit below the documentation-quality floor.

---

## 5. WHAT TO DO WITH THIS

In descending order of integrity value, not effort:

1. **Re-measure the top-3 holdout** against the 55/72 pin, then either record a real delta
   or correct the label. Until then the program's central no-regression claim has a gap.
2. **Reconcile the completion claims** — either satisfy the strict-validation gate or
   demote the Status fields. Three independent reviewers agreeing that a program calls
   itself Complete while its own evidence says otherwise is the clearest signal in this run.
3. **Fix the three confirmed conformance P1s**, one of which violates a hard block.
4. Work the remaining hypotheses, each verified before action.

---

## 6. RUN INTEGRITY

Three defects hit this run. All are recorded as events in `deep-alignment-state.jsonl`
rather than silently smoothed over.

**Artifacts deleted mid-run by a concurrent session.** A deep-review fanout on an unrelated
packet enforces write-containment across the whole repository: it snapshots dirty paths
before each dispatch and removes anything untracked that appears afterward. Iterations 2-4
of this run were deleted as they were written. Every leaf report had been captured outside
the repository, so all ten iterations were replayed into a packet under the OS temp root,
out of that sweep's reach, and the run finished in a git worktree. Any session writing
untracked files while such a fanout runs is exposed to the same deletion.

**Lane ids truncated by the executor.** The docs lane id is 6,186 characters because the
lane was scoped as an explicit path list. The executor returned a 971-character prefix, and
the reducer joins lanes by exact string — so audited docs slices looked unchecked, and the
partitioner handed out the same 8-file slice three times. Iterations 4, 5 and 6 audited
identical files. Lane ids are now normalized after every persist. Raw finding counts are
inflated by those duplicate audits; the numbers here are deduplicated. A future run should
scope lanes by directory rather than by enumerated path list.

**Malformed executor JSON, twice.** Iteration 1 duplicated two finding bodies, leaving the
first copies unterminated. Iteration 9 omitted a closing brace inside `deltaFindings`. Both
were salvaged mechanically without touching `findingDetails`, and deltas are always
rederived from `findingDetails` so a corrupt delta block cannot cost an audit.

---

## 7. WHAT THIS RUN DOES NOT ESTABLISH

Coverage is complete over the 71 files the program's commits touched — not over the
subsystems those files participate in. The §2 metric hole means the program's top-3 holdout
position is currently unknown, not verified-good. Nothing here was remediated: the
alignment loop is read-only by contract, and no finding above has been fixed.
