---
title: "Implementation Plan: One dated benchmark convention and a home for playbook results"
description: "How the dated grammar was declared, the validators unblocked, the writer built, and 78 run folders converged without inventing a finding."
trigger_phrases:
  - "benchmark naming plan"
  - "playbook results plan"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc"
_memory:
  continuity:
    packet_pointer: "sk-doc/021-benchmark-naming-and-playbook-results"
    last_updated_at: "2026-07-27T12:18:18Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Fixed the two findings from the isolated re-run"
    next_safe_action: "Decide whether the deep-review leaf timestamp fabrication warrants its own packet"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Plan: One Dated Benchmark Convention And A Home For Playbook Results

<!-- ANCHOR:summary -->
## 1. SUMMARY

Convention first, then the code that writes it, then the migration that adopts it. That order matters:
the emitters had to exist before the backfill, because the backfill is the emitters run over stored
records rather than a separate authoring exercise. Doing it the other way would have meant writing 248
files by hand, which is exactly how invented findings get into a repository.

The migration is gated by a link checker whose starting number was captured before anything moved, so
"no regressions" is a comparison rather than an assertion.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command | Threshold |
|---|---|---|
| Link integrity | `node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs` | No worse than the captured baseline of 85 broken |
| Lane C suite | `npx vitest run skill-benchmark/tests` | No new failures against the pre-change baseline |
| Label validator | Direct exercise of `RUN_LABEL_RE` | Accepts the grammar, rejects dots, underscores, uppercase, and `baseline` |
| End-to-end | A run with no `--outputs-dir` | Lands in the dated reports path with all seven files and appends its index row |
| Packet | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | Exit 0 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Three layers, each owned by exactly one place.

The **convention** lives in `create-benchmark`, the declared owner of benchmark storage shape and date
naming. Prose there is the authority; nothing else restates the grammar.

The **writer** lives in the Lane C harness. `build-report.cjs` renders every companion from a report
object, and `run-skill-benchmark.cjs` decides where a run lands and records it in the index. A run
folder is therefore produced by one code path, not assembled by convention plus habit.

The **index** is written by that same path. Indexes drifted before precisely because appending a row
was a separate act that could be skipped.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Change |
|---|---|
| `create-benchmark/SKILL.md` | Declares the grammar and the seven-file report shape |
| `create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md` | Run-label table replaced by the grammar |
| `create-benchmark/scripts/archive-compiled-routing.cjs` | Label validator accepts the field separator |
| `create-benchmark/scripts/render-serving-snapshot.cjs` | Derives paths rather than hardcoding labels |
| `create-manual-testing-playbook/SKILL.md` | New results-storage contract |
| `create-skill/scripts/init_skill.py` | Scaffolds `benchmark/reports/` with an index |
| `skill-benchmark/build-report.cjs` | Emits the four curated companions |
| `skill-benchmark/run-skill-benchmark.cjs` | Derives the outputs directory, writes companions, appends the index row |
| `skill-benchmark/append-run-index.cjs` | New index writer |
| 78 run folders across 16 benchmark roots | Renamed and backfilled |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work | Exit condition |
|---|---|---|
### Phase 1: Convention And Validators

| Phase | Work | Exit condition |
|---|---|---|
| 1 | Declare the grammar in `create-benchmark` | Both naming sections state one rule |
| 2 | Unblock the validators | A field-separated label passes; the frozen anchor is still refused |
| 3 | Build the writer and the storage contract | A run emits seven files; the playbook skill documents where they go |
| 4 | Scaffold the tree for new skills | A freshly scaffolded skill has an index and a reports directory |
| 5 | Automate the index row | Re-running into the same folder refreshes its row rather than duplicating it |

### Phase 2: Migration

| Phase | Work | Exit condition |
|---|---|---|
| 6 | Rename 78 folders, repair references repo-wide | Link checker at baseline; no live reference to an old name |
| 7 | Backfill the missing companions | Every folder carries what its record supports, and says so where it does not |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A new suite, `run-storage-convention.vitest.ts`, covers the parts a reader cannot verify by looking:
that both scenario-row shapes are read correctly, that an inapplicable row is neither a pass nor a
failure, that absence is stated rather than filled in, that the index refreshes rather than duplicates,
and that the Python scaffolder and the JavaScript writer emit the same empty index byte for byte.

The migration itself is verified by comparison against a captured baseline rather than by inspection.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The Lane C harness and its renderer, the compiled-routing archiver and snapshot renderer, and the
markdown link checker that gates continuous integration.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each naming style lands as its own commit, so reverting one undoes one mapping without unwinding the
rest. The frozen map is committed separately and is the record of what every old name was, which is why
the sweep is forbidden from rewriting it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 6 ──► Phase 7
declare     unblock     writer      rename      backfill
grammar     validators  + contract  + repair    reports
                            │
                            ├──► Phase 4  scaffold
                            └──► Phase 5  index row
```

Phase 7 depends on Phase 3, and that edge is the whole design. The backfill is the writer applied to
stored records, so it cannot start until the writer exists. Phases 4 and 5 branch off Phase 3 and do
not gate the migration.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Declare the grammar** - CRITICAL, everything else cites it.
2. **Unblock the validators** - CRITICAL, a rename to a rejected label would fail archiving silently.
3. **Build the writer** - CRITICAL, the backfill has no honest form without it.
4. **Rename and repair** - CRITICAL, gated by the link checker against a captured baseline.
5. **Backfill** - CRITICAL, must run after the rename so files land in final folders.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|---|---|---|---|
| M1 | Convention declared and validators accept it | A field-separated label passes; `baseline` still refused | Phase 2 |
| M2 | A run writes a complete folder unaided | Six files plus an index row, no `--outputs-dir` given | Phase 5 |
| M3 | Tree converged | 78 of 78 at mapped names, link checker at baseline | Phase 6 |
| M4 | Every folder readable | Companions present or absence stated | Phase 7 |
<!-- /ANCHOR:milestones -->

---

## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Read `spec.md` scope and the frozen map before touching a run folder.
- Capture the link-checker number before any rename; it is the only baseline that makes "no regressions" meaningful.
- Confirm the target folder is a run, not `fixtures/`, which is an input.

### Execution Rules

| Rule | Requirement |
|---|---|
| Never fabricate | A companion file derives from the stored record only. Absence is stated, never filled in. |
| Never hand-edit a rendered report | `skill-benchmark-report.md` is renderer-owned and regenerated. |
| Match path-shaped references only | Bare labels like `live` and `after` are prose tens of thousands of times over. |
| Read the map per root | Three labels exist in two hubs and do not share a date. |
| One naming style per commit | A bad mapping must revert without unwinding the rest. |

### Status Reporting Format

Report a number and the command that produced it. "Link checker at 85 broken, identical to baseline"
is a status; "links verified" is not.

### Blocked Task Protocol

Stop on a collision in the map, on a folder whose record cannot be parsed, or on any link-checker
result worse than the captured baseline. Report the specific folder and the number, and do not proceed
to the next naming style.
