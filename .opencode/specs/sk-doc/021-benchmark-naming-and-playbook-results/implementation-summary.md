---
title: "Implementation Summary: One dated benchmark convention and a home for playbook results"
description: "What shipped: one grammar, a writer, an auto-appended index, 78 renamed folders and a rendered backfill, with the two defects the gate caught."
trigger_phrases:
  - "benchmark naming summary"
  - "playbook results summary"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc"
_memory:
  continuity:
    packet_pointer: "sk-doc/021-benchmark-naming-and-playbook-results"
    last_updated_at: "2026-07-27T11:48:33Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Remediated the three verified deep-review findings"
    next_safe_action: "Re-run the deep review in an isolated worktree against the fixed state"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Summary: One Dated Benchmark Convention And A Home For Playbook Results

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Packet** | sk-doc/021-benchmark-naming-and-playbook-results |
| **Level** | 3 |
| **Status** | Complete |
| **Completed** | 2026-07-27 |
| **Commits** | `c7e89ec88a`, `cf027a535c`, `e16382d845`, `ff34e4c284`, `b07bfdf9c8`, plus the review remediation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**One grammar, in one place.** `create-benchmark` declares `<YYYY-MM-DD>--<subject>--<variant>`, dated
by execution, with `baseline/` as the single carve-out. The validators that rejected the field
separator now accept it while still refusing dots, underscores, uppercase and the frozen anchor.

**A writer for playbook results.** A Lane C run given no `--outputs-dir` derives
`<skill>/benchmark/reports/<dated-run>/` and writes seven files: the machine record, the rendered report,
a result table, a failure list, findings grouped by recorded reason, and a source map. Executor
identity comes from the environment the dispatch lane already sets, and dots flatten, so
`openai/gpt-5.6-luna` at `high` yields `openai-gpt-5-6-luna-high`.

**An index that cannot drift.** The row is appended by the same code path that writes the report. A
rerun on the same day takes the next free ordinal rather than replacing the earlier folder, so each
run keeps its own row and its own evidence.

**A scaffold.** A newly created skill gets `benchmark/reports/` with an index, for hub and standalone
skills alike. The Python scaffolder and the JavaScript writer are pinned to the same document by a test
that compares them byte for byte.

**A converged tree.** All 78 run folders match the grammar. 6,401 path-shaped references were repaired
repo-wide, spec packets included. Every folder now carries the companions its record supports.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Convention first, then the writer, then the migration. The order was load-bearing: once the emitters
existed, the backfill stopped being an authoring task and became the emitters run over stored records,
which is what makes it auditable.

The migration ran as one commit per naming style against a frozen, generated map, gated by a link
checker whose starting number was captured before anything moved.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|---|---|
| Render the backfill rather than author it | The emitters encode the judgment a human author would have to supply, without the fabrication risk |
| Name outranks recorded timestamp when dating | A comparison run copies its baseline's artifacts in, so the earliest timestamp can belong to the baseline |
| Rewrite only path-shaped references | Bare labels like `live` and `after` appear tens of thousands of times in prose |
| Disambiguate colliding labels by hub | Three labels exist in two hubs each and do not share a date |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|---|---|
| Link checker | `85 broken`, identical to the pre-rename baseline |
| Lane C suite | 260 passed, 11 failed, the same 11 as the stashed baseline |
| New storage suite | 11 passed |
| Folders at mapped names | 78 of 78, zero stale copies, zero off-grammar |
| Live references to an old name | 0, with 1093 left in historical records by design |
| End-to-end run | Seven files in the dated path plus an appended index row |
| Label validator | Accepts the grammar, refuses dots, underscores, uppercase and `baseline` |
| Frozen scorer digest | Unchanged |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**Two questions deferred, both recorded in the spec.** The plural roots
`sk-prompt/prompt-models/benchmarks` and `system-spec-kit/mcp-server/benchmarks` are not singularized;
they sit outside the frozen map and carry their own large reference load. The MCP-promotion family's
`SOURCE.md` keeps its uppercase name; it has its own template, command wiring and spec references, so
renaming it is a separate change.

**1093 references still name old folders,** all inside research logs and iteration records. A log
records what a past run saw; rewriting it would falsify the record rather than repair a link.

**Sixteen folders could not be rendered.** Seven retrieval benchmarks record metric arms rather than
per-scenario verdicts, and nine experiment workspaces predate the report convention. Their READMEs say
so rather than presenting a shape they do not have.

**Two defects were introduced and caught by the gate, not by inspection.** A bare-label rewrite
corrupted renderer-owned reports and a captured transcript; the affected content was restored from the
pre-rename commit and the rule narrowed to index files. A base-name mapping sent 366 references to a
sibling hub's folder; they were corrected using the hub segment already present in each reference.

**One file belonging to a concurrent session was edited:** an untracked plan in the sk-design tree
citing a run record by path and line. The citation would otherwise dangle. It was left uncommitted.

**A deep review found three real defects, two of them mine.** A same-day rerun silently overwrote
its own evidence, because the spec named that edge case and the writer never implemented it. The
owning skill declared a six-file report folder naming a report the writer never emits. A third,
pre-existing, had the serving snapshot looking for parity evidence under a fixed label no writer
produces. All three are fixed and covered.

**The review that found them was not itself trustworthy.** One lineage failed terminally on a write-
containment violation; the other wrote nine of twelve state records with timestamps in the future.
Both ran sequentially into a shared packet, so the second could have read the first. Every finding
was therefore verified against the code before being acted on, and one had its framing corrected in
the process. A clean re-run in an isolated worktree is the outstanding follow-up.

**That review also reverted a concurrent session's uncommitted work.** The codex lineage ran in the
shared tree, and its containment guard attributed thirty-two paths belonging to another session to
the leaf: twenty-six untracked files deleted, four restored to their committed state. The work
survived only because that session had committed seconds earlier and regenerated the rest. Dispatched
executors now run in their own worktree.

**A concurrent commit absorbed a staged revert of this work,** which is why the rename appears twice in
history. The recovery was forward-only; no history was rewritten.
<!-- /ANCHOR:limitations -->
