---
title: "MCP Server Benchmarks Format Convention"
description: "Reference for the mcp_server/benchmarks/ folder convention used to promote curated benchmark runs into a skill that hosts an MCP server. Covers layout, the 10-section benchmark_report.md structure, authority hierarchy, symlinked FORMAT.md, cross-skill examples (mk-spec-memory, mcp-coco-index), validation expectations, and failure modes."
trigger_phrases:
  - "benchmarks format"
  - "mcp_server benchmarks"
  - "benchmark report structure"
  - "skill-local benchmark folder"
  - "benchmark folder layout"
  - "FORMAT.md symlink"
  - "skill benchmark convention"
---

# MCP Server Benchmarks Format Convention

Reference for the `mcp_server/benchmarks/` convention used to promote curated benchmark runs into a skill that hosts an MCP server. The convention exists so a future operator inside the MCP code can answer "which candidate won, on what fixture, on what date" without leaving the skill and without reading the underlying spec packet.

The canonical source of truth for the format is `.opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md`. This reference restates the convention in a sk-doc-discoverable location so skill authors can find it through the sk-doc router.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The benchmarks format applies to any MCP server in this repo that produces measurable retrieval-quality or runtime output worth promoting out of a spec packet. It standardizes the folder layout, file purposes, date convention, and report structure so cross-skill comparisons stay consistent.

**Core principle**: skill-local benchmark folders are curated views, not replacement evidence. The spec packet keeps the full audit trail; the skill-local view is the "look here first" entry point.

**Format scope**:
- Folder layout for one or more dated benchmark runs.
- Required files inside each dated subfolder.
- 10-section structure for `benchmark_report.md`.
- Symlinked `FORMAT.md` pattern so all skills point at one canonical convention.
- Authority hierarchy when skill-local docs and spec packet disagree.

**Shipped examples**:
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/` (text-embedder bake-off for `mk-spec-memory`).
- `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/` (code-embedder bake-off for `mcp-coco-index`).

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:when-to-adopt -->
## 2. WHEN TO ADOPT THE FORMAT

Adopt the format when **all** of the following hold:

- The skill houses an MCP server under `mcp_server/`.
- The MCP server produces measurable retrieval, quality, or runtime output (top-k recall, hit rate, latency, RAM, dim, throughput).
- A benchmark run has already completed inside a spec packet and the curated headline is worth promoting where operators read code.
- There is enough rigor in the run that other authors would replay it (fixture is stable, replay commands exist, expected outcome is documented).

**Do not adopt when**:

- The MCP server has no measurable retrieval or quality surface yet.
- The run is in-progress; drafts live in the spec packet's `evidence/` until they ship.
- The output is a single data point with no reproducibility plan.
- The run is a rerun that does not change the headline (update the existing `benchmark_report.md` with a "Re-run YYYY-MM-DD" section instead of adding a new dated folder).

Decision rule:

```text
Did a benchmark run produce a curated headline you would defend to a reviewer?
  YES -> promote into mcp_server/benchmarks/ using this format
  NO  -> keep in the spec packet's evidence/ until rigor is sufficient
```

<!-- /ANCHOR:when-to-adopt -->

---

<!-- ANCHOR:folder-layout -->
## 3. FOLDER LAYOUT

Canonical layout for an MCP server's benchmarks folder:

```text
mcp_server/benchmarks/
├── README.md                                  # Index of all benchmarks here (sk-doc compliant)
├── FORMAT.md                                  # This convention (symlink to system-spec-kit canonical)
└── benchmark-<YYYY-MM-DD>/                    # One folder per benchmark RUN, ISO date for sort
    ├── benchmark_report.md                    # THE detailed report (sk-doc compliant, 10 sections)
    ├── results.csv                            # Primary aggregate (one row per candidate)
    ├── per-probe.jsonl                        # Per-query / per-probe data (when applicable)
    ├── runtime-measurements.md                # Optional: RAM/GPU/latency profile
    └── SOURCE.md                              # Pointer to the authoritative spec packet
```

**Invariants**:

- One dated subfolder per benchmark run; runs are append-only.
- `benchmark_report.md` and `README.md` are both sk-doc compliant.
- `results.csv` is the headline aggregate; one row per candidate.
- `per-probe.jsonl` is optional but expected when per-query analysis is in scope.
- `runtime-measurements.md` is optional; include when RAM/GPU/latency profiles are worth promoting from the spec packet.
- `SOURCE.md` is a tiny pointer file, never a duplicate of the spec packet's decision record.

**Naming a dated subfolder**:

- Use `benchmark-<YYYY-MM-DD>/` for clear chronological sort.
- If two benchmarks ran on the same date, suffix with a topic slug: `benchmark-2026-05-18-bge-confirmation/`.
- Cite the date the benchmark was **executed**, not the date the report was written.

<!-- /ANCHOR:folder-layout -->

---

<!-- ANCHOR:date-convention -->
## 4. DATE CONVENTION

Two date forms coexist in the format and each has a fixed role.

| Surface | Form | Example | Why |
|---|---|---|---|
| Folder name | ISO `YYYY-MM-DD` | `benchmark-2026-05-17/` | Sorts cleanly chronologically across runs. |
| In-doc prose | Long form | "May 17, 2026" | Easier to read inside narrative paragraphs. |
| Frontmatter `title` | Long form | "mk-spec-memory text-embedder bake-off May 17, 2026" | Matches in-doc tone. |
| Frontmatter `description` | Long form | "Curated benchmark report for the May 17, 2026 run." | Matches in-doc tone. |

Always cite the date the benchmark was **executed**, never the date the doc was authored.

<!-- /ANCHOR:date-convention -->

---

<!-- ANCHOR:report-structure -->
## 5. THE 10-SECTION BENCHMARK_REPORT.MD STRUCTURE

`benchmark_report.md` is the structured, comprehensive report. Required sections in order:

1. **HEADLINE / OVERVIEW** -- one-line winner and key metric, prominently at top, then orientation paragraphs.
2. **AGGREGATE RESULTS** -- one row per candidate, headline metrics plus verdict; cites `results.csv`.
3. **METHODOLOGY** -- fixture, sample size, pipeline (rescue, rerank, hybrid?), environment, sample size, stack details.
4. **PER-CANDIDATE PROFILES** -- RAM, disk, dim, release date, strengths and weaknesses per candidate.
5. **PROCESS NOTES** -- what was tried, what failed, why; carries the elimination narrative.
6. **FINDINGS** -- unique wins, universal floor and ceiling, mismatch analysis, load-bearing insight.
7. **CAVEATS** -- single-run signal, fixture limits, stack-level confounds, schema migration cost.
8. **RECOMMENDATIONS** -- Tier 1 (apply now), Tier 2 (validate first), Tier 3 (future work).
9. **REPRODUCIBILITY** -- exact replay commands plus expected wall-clock.
10. **CROSS-LINKS / RELATED RESOURCES** -- sibling MCP benchmarks, authoritative spec packet, follow-on packets.

**Tone**: same care as a sk-doc skill reference. Curate; do not paste raw evidence. Cross-link the spec packet for the full ADR trail; do not duplicate it.

**ANCHORs**: wrap each numbered section in `<!-- ANCHOR:slug -->` and `<!-- /ANCHOR:slug -->` so memory and extraction tools can find stable section spans. The slug should match the section purpose (`headline`, `aggregate-results`, `methodology`, etc.).

A fillable scaffold lives at `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md`. Future authors should copy that file into the dated subfolder and fill in the placeholders.

<!-- /ANCHOR:report-structure -->

---

<!-- ANCHOR:authority-hierarchy -->
## 6. AUTHORITY HIERARCHY

When skill-local docs and the spec packet disagree, this is the resolution order:

1. **Spec packet's `decision-record.md` and `implementation-summary.md`** -- source of truth. The full ADR trail, fixture rationale, rollback decisions, and final state live here.
2. **Skill-local `benchmark_report.md`** -- curated summary; tracks the spec packet's headline. Never replaces the ADR trail.
3. **CSV and JSONL files** -- direct copies of spec-packet evidence; same authority as the originals.
4. **`runtime-measurements.md`** -- direct copy or curated reduction; defer to spec-packet evidence when measurements diverge.
5. **`SOURCE.md`** -- pointer file; never carries decision content.

Intentional design: the spec packet has the full audit trail (often 10+ ADRs, fixture surgery, rollback rationale). The skill-local view is the "look here first" entry point for an operator inside the MCP code. If a reader needs the audit weight, they follow `SOURCE.md` back to the spec packet.

**Drift rule**: if the skill-local `benchmark_report.md` headline ever contradicts the spec packet's `decision-record.md`, treat that as a logic-sync error and reconcile before either is treated as final. The spec packet wins.

<!-- /ANCHOR:authority-hierarchy -->

---

<!-- ANCHOR:new-folder-vs-new-topic -->
## 7. WHEN TO ADD A NEW DATED SUBFOLDER VS A NEW TOPIC

Append-only is the default. The question is whether a new run gets a new subfolder or amends an existing one.

| Situation | What to add |
|---|---|
| New benchmark run with a different fixture, candidate set, or pipeline | New `benchmark-<YYYY-MM-DD>/` subfolder |
| Re-run of an existing benchmark that confirms the headline | Append "Re-run YYYY-MM-DD" section to the existing `benchmark_report.md`; do not add a new subfolder |
| Re-run of an existing benchmark that **changes** the headline | New `benchmark-<YYYY-MM-DD>-<topic-slug>/` subfolder; cross-link from the prior report |
| Same date, two distinct benchmark topics | Two subfolders, both date-prefixed, each suffixed with a topic slug |
| New candidate added to an existing comparison without a rerun of the others | Update the existing report; do not add a new subfolder for a partial run |

**Re-run section template** for amending an existing report:

```markdown
## Re-run YYYY-MM-DD

Single-line headline of what changed. Cite the spec-packet sub-phase that drove the rerun.

| Candidate | Metric | Delta vs prior |
|---|---|---|
| ... | ... | ... |
```

Keep the original report intact above the re-run section; do not rewrite history.

<!-- /ANCHOR:new-folder-vs-new-topic -->

---

<!-- ANCHOR:symlink-pattern -->
## 8. THE SYMLINK-THE-FORMAT.MD PATTERN

Each MCP server's `mcp_server/benchmarks/FORMAT.md` should be a **symlink** to the canonical convention at `.opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md`. This keeps the convention single-sourced and prevents drift across skills.

**Creating the symlink** (from inside a new skill's benchmarks folder):

```bash
cd .opencode/skills/<your-skill>/mcp_server/benchmarks
ln -s ../../../../system-spec-kit/mcp_server/benchmarks/FORMAT.md FORMAT.md
```

Use a relative path so the symlink survives repo moves. Verify with `ls -la` that the target resolves.

**Why a symlink, not a copy**:

- One canonical convention. Edits to `FORMAT.md` propagate immediately.
- No risk of stale per-skill copies drifting from the source.
- Easy to detect (the file shows up as a symlink in `ls -la`).

**Failure mode**: a hand-copied `FORMAT.md` will drift the moment the canonical convention is amended. If you find a hand-copy, replace it with a symlink rather than reconciling line by line.

**Verification**: a benchmark folder is in compliance when `readlink mcp_server/benchmarks/FORMAT.md` returns a path that resolves to the canonical file.

<!-- /ANCHOR:symlink-pattern -->

---

<!-- ANCHOR:examples -->
## 9. EXAMPLES IN PRODUCTION

Two skills currently apply the format. Their reports demonstrate both shapes (text and code retrieval) and confirm the 10-section structure is workable across topics.

### 9.1 mk-spec-memory text-embedder bake-off

Path: `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/benchmark_report.md`

- 6 candidates evaluated, jina-embeddings-v3 promoted as the production embedder.
- Headline: 9/10 cat-24/409 top-3 hits, median 893 ms, p95 1465 ms.
- Demonstrates: detailed per-candidate profiles, multi-stage process notes spanning 12 ADRs, rescue-layer findings, schema-migration caveat, replay block with kill switch.
- Authority pointer: `SOURCE.md` -> spec packet decision record and implementation summary.

### 9.2 mcp-coco-index code-embedder bake-off

Path: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/benchmark_report.md`

- 5 candidates evaluated (1 skipped on Apple Silicon), BAAI/bge-code-v1 won single-run.
- Headline: 11/18 = 61.1% top-5 hit rate, median 504 ms, p95 4974 ms.
- Demonstrates: hybrid + rerank pipeline disclosure, fixture difficulty mix in the aggregate, single-run-signal caveat, pending 3-run confirmation reference.
- Authority pointer: `SOURCE.md` -> spec packet 016/004 (baseline fixture) and 016/007 (confirmation sub-phase).

Both reports use ANCHOR comments around every numbered section and cite `results.csv` from inside the aggregate table.

<!-- /ANCHOR:examples -->

---

<!-- ANCHOR:validation -->
## 10. VALIDATION EXPECTATIONS

Both the index `README.md` and each `benchmark_report.md` must pass sk-doc validation. The validator classifies them by path:

- `mcp_server/benchmarks/README.md` -> doctype `readme` (TOC required, ALL CAPS H2 required, emoji required only on the explicit emoji set).
- `mcp_server/benchmarks/benchmark-*/benchmark_report.md` -> doctype `readme` by default because it ends in `.md` not `SKILL.md` / not under `references/` or `assets/`. Validate explicitly with `--type readme` to be deterministic.

**Run validation** before promoting a benchmark folder:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py \
  .opencode/skills/<your-skill>/mcp_server/benchmarks/README.md \
  --type readme

python3 .opencode/skills/sk-doc/scripts/validate_document.py \
  .opencode/skills/<your-skill>/mcp_server/benchmarks/benchmark-<date>/benchmark_report.md \
  --type readme
```

**Expected exit code**: `0` (valid, no blocking errors). Exit code `1` means blocking errors; exit code `2` means file not found or parse error.

**What the validator covers**:

- TOC presence and ALL CAPS entries.
- Numbered H2 headers in sequence.
- ALL CAPS H2 section names.
- Required section presence (`overview` at minimum for readme doctype).

**What the validator does not cover** (manual review still required):

- Link resolution to `results.csv`, `per-probe.jsonl`, sibling skills, or spec packets.
- ANCHOR comment correctness or matching open/close pairs.
- Frontmatter `trigger_phrases` quality.
- Spec-packet authority hierarchy alignment.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:failure-modes -->
## 11. FAILURE MODES AND MITIGATIONS

| Failure mode | Symptom | Mitigation |
|---|---|---|
| **Hand-copied FORMAT.md drift** | One skill's `FORMAT.md` no longer matches the canonical version. | Replace the copy with a symlink to `.opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md`. Verify with `readlink`. |
| **Broken FORMAT.md symlink** | `cat FORMAT.md` returns "No such file or directory". | Recompute the relative path and re-create the symlink. Confirm `ls -la FORMAT.md` shows a working link. |
| **Stale dates in folder names** | `benchmark-2026-05-17/` contains a report whose execution date is actually May 18. | Rename the folder to match the execution date. Audit `SOURCE.md` and the report headline to match. |
| **Headline contradicts spec packet** | Skill-local `benchmark_report.md` reports a different winner than `decision-record.md`. | Treat as a logic-sync error. Reconcile by aligning the skill-local report to the spec packet (spec packet wins). |
| **Missing SOURCE.md** | Reader cannot find the authoritative spec packet. | Add a tiny `SOURCE.md` with the spec packet path, why look there, and a last-updated date. |
| **In-progress draft promoted too early** | Report headline keeps changing; replay block is incomplete. | Roll the folder back to the spec packet's `evidence/` until the run has shipped. Only promote curated, defensible headlines. |
| **No ANCHOR comments** | Memory extraction or sk-doc search cannot find stable section spans. | Wrap each numbered H2 in matching `<!-- ANCHOR:slug -->` and `<!-- /ANCHOR:slug -->`. Use a slug per section purpose. |
| **Re-run added as a new subfolder when headline did not change** | `mcp_server/benchmarks/` grows linearly with reruns that do not move the needle. | Amend the existing `benchmark_report.md` with a "Re-run YYYY-MM-DD" section; reserve new subfolders for runs that change the headline. |
| **Folder added for a single-data-point measurement** | Folder exists with no replay block and no fixture stability. | Move back to spec-packet `evidence/`. Promote only when there is enough rigor to defend the headline. |
| **Cross-stack number cross-reference** | Reader compares latency across `mk-spec-memory` (Ollama) and `mcp-coco-index` (sentence-transformers). | Add an explicit "Do not cross-reference numbers" line to the Caveats section; both shipped examples already include this. |

<!-- /ANCHOR:failure-modes -->

---

<!-- ANCHOR:promotion-workflow -->
## 12. PROMOTION WORKFLOW

End-to-end flow from in-progress run to promoted skill-local benchmark:

1. Benchmark completes inside a spec packet (`specs/.../evidence/`).
2. Spec packet's `benchmark-results.md` is written, reviewed, and ratified through ADRs.
3. Curated copy is promoted into `mcp_server/benchmarks/benchmark-<date>/` with the layout in Section 3.
4. `results.csv` and `per-probe.jsonl` are copied directly from spec-packet evidence (same authority).
5. `benchmark_report.md` is authored from `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md`; it is curated, not a duplicate of the spec packet.
6. `SOURCE.md` is added with a pointer to the spec packet.
7. `runtime-measurements.md` is added when there is a runtime profile worth promoting; otherwise omitted.
8. `README.md` in `mcp_server/benchmarks/` is updated with a row pointing to the new dated subfolder.
9. sk-doc validate is run against `README.md` and `benchmark_report.md`.
10. Cross-link added in the spec packet's `implementation-summary.md` so the spec packet knows it has a skill-local promotion.

<!-- /ANCHOR:promotion-workflow -->

---

<!-- ANCHOR:related-resources -->
## 13. RELATED RESOURCES

### Canonical convention

- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md` -- the canonical source-of-truth document; every skill's `mcp_server/benchmarks/FORMAT.md` should be a symlink to it.

### Template

- `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` -- fillable 10-section scaffold for new `benchmark_report.md` files.

### Shipped examples

- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/` -- mk-spec-memory text-embedder bake-off.
- `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/` -- mcp-coco-index code-embedder bake-off.

### sk-doc validation

- `.opencode/skills/sk-doc/scripts/validate_document.py` -- markdown structure validator.
- `.opencode/skills/sk-doc/assets/template_rules.json` -- doctype rules.
- [readme_creation.md](./readme_creation.md) -- README authoring conventions used by `mcp_server/benchmarks/README.md`.
- [global/core_standards.md](./global/core_standards.md) -- cross-document standards including ANCHOR conventions.
- [global/evergreen_packet_id_rule.md](./global/evergreen_packet_id_rule.md) -- evergreen rule for runtime docs; benchmark reports follow it via `SOURCE.md` cross-link rather than inline packet IDs.

<!-- /ANCHOR:related-resources -->
