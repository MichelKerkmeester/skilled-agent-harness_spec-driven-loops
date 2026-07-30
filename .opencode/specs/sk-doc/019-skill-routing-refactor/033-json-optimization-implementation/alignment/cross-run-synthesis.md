# Cross-Run Synthesis — Deep Review + Deep Alignment

Run date: 2026-07-30. Target: the 12-phase JSON-optimization program (14 commits, 71 changed files).

---

## 1. WHAT RAN

| Leg | Executor | Transport | Iterations | Verdict |
|---|---|---|---|---|
| Review | GPT-5.6 LUNA xhigh | cli-codex | 4 | CONDITIONAL — P0 0 / P1 3 / P2 4 |
| Review | GLM 5.2 high | cli-devin | 3 | CONDITIONAL — P0 0 / P1 4 / P2 3 |
| Review | Grok 4.5 high | cli-cursor | 3 | CONDITIONAL — 3 findings |
| Alignment | GPT-5.6 LUNA xhigh | cli-pi | 10 | CONDITIONAL — coverage 71/71 |

Alignment ran two lanes: `sk-code::code` (23 files, 3 iterations) and `sk-doc::docs`
(48 files, 7 iterations). Convergence was disabled so the full 10-iteration budget ran;
the stop reason is `STOP_MAX_ITERATIONS` with coverage complete at 100%.

An earlier LUNA review lineage (`luna-xhigh`) returned hollow single-line iterations and
was correctly classified failed by the driver's timestamp-anomaly validation; it was
re-run as `luna-xhigh-r2`, and both lineages are retained so the failure stays visible.

---

## 2. CONFIRMED FINDINGS

Verified against the live tree, not taken on the executor's word.

| Severity | Finding | Evidence |
|---|---|---|
| P1 | An ephemeral packet label sits in a code comment, which the repo treats as a hard block | `ci-skill-derived-freshness.cjs:9` |
| P1 | `'use strict';` is ~15 lines below the boxed header; the standard requires it immediately after | `ci-skill-derived-freshness.cjs:21` vs `javascript/style-guide.md:56` |
| P1 | Specs and `graph-metadata.json` derived blocks cite a `create-skill` path that does not exist; the live packet is `sk-create-skill` | packet `spec.md:159`, `001/graph-metadata.json:48,80`, `009/graph-metadata.json:43,70` |

The third one has routing consequences beyond documentation tidiness: those stale paths sit
in `derived.key_files`, which feeds advisor scoring, so they are dead weight in the corpus.

---

## 3. REPORTED BUT NOT YET VERIFIED

Treat each as a hypothesis pending its own check.

- Two path joins build a path from authored input without a containment guard
  (`ci-skill-root-metadata.cjs:324`, `generate-leaf-manifest.cjs:169`). Both inputs are
  authored in-repo rather than user-supplied, so exploitability is likely low — but the
  cited standard does require the guard.
- The audited contract doc still requires `command-metadata.json` for every hub root while
  the live implementation makes it optional. This is expected: the presence rule was
  deliberately reversed during the program, so this is doc lag, not code drift.
- The docs validator is reported unable to load its rules file before reading an artifact.
- Nine artifacts sit below the documentation-quality floor.

The review leg's three LUNA P1s all attack one seam — completion claims outrunning their
evidence: a parent coordination map stale against every child status, a phase marked
Complete with an unmet live-generation acceptance, and a program close marked Complete
while its own close-gate evidence records strict validation as blocked.

---

## 4. RUN INTEGRITY

Three defects hit this run. All are recorded as events in `deep-alignment-state.jsonl`
rather than silently smoothed over.

**Artifacts deleted mid-run by a concurrent session.** A deep-review fanout on an unrelated
packet enforces write-containment across the whole repository: it snapshots dirty paths
before each dispatch and removes anything untracked that appears afterward. Iterations 2-4
of this run were deleted as they were written. Every leaf report had been captured outside
the repository, so all ten iterations were replayed into a packet under the OS temp root,
out of that sweep's reach. Any session writing untracked files while such a fanout runs is
exposed to the same deletion.

**Lane ids truncated by the executor.** The docs lane id is 6,186 characters because the
lane was scoped as an explicit path list. The executor returned a 971-character prefix, and
the reducer joins lanes by exact string — so audited docs slices looked unchecked, and the
partitioner handed out the same 8-file slice three times. Iterations 4, 5 and 6 audited
identical files. Lane ids are now normalized after every persist. Raw finding counts are
inflated by those duplicate audits; the numbers above are deduplicated.

**Malformed executor JSON, twice.** Iteration 1 duplicated two finding bodies, leaving the
first copies unterminated. Iteration 9 omitted a closing brace inside `deltaFindings`.
Both were salvaged mechanically without touching `findingDetails`, and deltas are always
rederived from `findingDetails` so a corrupt delta block cannot cost an audit.

---

## 5. WHAT THIS RUN DOES NOT ESTABLISH

Coverage is complete over the 71 files the program's commits touched — not over the
subsystems those files participate in. Nothing here was remediated: the alignment loop is
read-only by contract, and no finding above has been fixed.
