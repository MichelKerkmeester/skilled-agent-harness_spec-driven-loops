---
title: "Decision Record: One dated benchmark convention and a home for playbook results"
description: "The four decisions that shaped the grammar, the writer and the migration, including two defects the gate caught."
trigger_phrases:
  - "benchmark naming decisions"
  - "playbook results decisions"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc"
_memory:
  continuity:
    packet_pointer: "sk-doc/021-benchmark-naming-and-playbook-results"
    last_updated_at: "2026-07-27T14:10:21Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Round 3 returned PASS over the fixed state"
    next_safe_action: "Open a deep-loop packet for brittle event-name validation and agent-written timestamps"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Decision Record: One Dated Benchmark Convention And A Home For Playbook Results

<!-- ANCHOR:adr-001 -->
## ADR-001: Render The Backfill Rather Than Author It

**Status:** Accepted

<!-- ANCHOR:adr-001-context -->
### Context

Sixty-two folders lacked their curated companions. The obvious reading is that filling them is
authoring work: read each run, decide what it found, write it up. That reading is what makes the task
dangerous. A model asked to describe a run it cannot fully see will produce a plausible description,
and a plausible description of a failure that never happened is indistinguishable from a real one once
it is committed.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Backfill by running the same emitters a live run uses over each stored record. The emitters read
recorded fields and nothing else, so a file cannot assert what its record does not contain.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

Dispatching the authoring to a model, which was the original intent for bulk work. Rejected once the
emitters existed: the judgment the dispatch was meant to supply is exactly the judgment the emitters
encode, and a model would have added fabrication risk with no compensating benefit.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

A run that captured no per-scenario detail produces a file that says so. That is less satisfying than a
narrative, and it is the correct output. Three populations needed separating: Lane C folders render in
full, retrieval benchmarks record metric arms rather than verdicts and so get no failure list, and
experiment workspaces get a README stating that their shape predates the convention.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

- **Simplicity:** one code path produces run-time and backfilled output.
- **Reversibility:** every backfilled file is regenerable and marked as derived.
- **Blast radius:** 338 files, all additive.
- **Evidence:** all 50 stored reports render without throwing; no FAIL report surfaces zero failing rows.
- **Alternative cost:** hand-authoring 248 files with no way to audit them.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes

The emitters gained two caller-supplied fields during the backfill, because older runs do not all use
the same report filename and two wrote no rendered report at all.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Name Outranks Timestamp When Dating A Run

**Status:** Accepted

### Context

The grammar dates a folder by execution. Three sources were available: a date already in the folder
name, a timestamp recorded inside the run's artifacts, and the date the folder was first committed.

### Decision

Precedence is name, then recorded timestamp, then first-commit date.

### Alternatives Considered

Trusting the recorded timestamp above all else, which is intuitively the most precise source. It is
wrong here: a comparison run copies its baseline's artifacts into its own folder, so the earliest
timestamp present can belong to the baseline. Four folders showed exactly that, reading a day earlier
than the name their author gave them.

### Consequences

Thirty folders date from their name, seven from a recorded timestamp, and thirty-seven from their first
commit. The last group is dated no later than execution, which is the honest direction to err.

---

## ADR-003: Rewrite Only Path-Shaped References

**Status:** Accepted, after a defect

### Context

Run labels include `live`, `after` and `full`. Those words appear tens of thousands of times in prose.
A rename that matched bare labels would corrupt the repository.

### Decision

Rewrite a reference only when its benchmark-root segment precedes it, or when it is a relative link
inside a benchmark tree, or when it is a backticked label in a `benchmark/README.md` index.

### Alternatives Considered

An earlier attempt also rewrote backticked bare labels anywhere inside a benchmark tree, on the theory
that a backtick marks a folder. It does not. It corrupted `trace mode: \`live\`` in renderer-owned
reports into a folder name, and rewrote a path inside a captured transcript. The rule was narrowed to
index files, all affected content was restored from the pre-rename commit, and the sweep was redone.

### Consequences

Two reference forms need separate passes, since hub READMEs link runs with no root segment. Missing the
second form left 21 dangling links, which the checker caught.

---

## ADR-004: Disambiguate Colliding Labels By Hub

**Status:** Accepted, after a defect

### Context

`live-final`, `router-final` and `after-d3-proxy` each exist in two hubs. Their runs happened on
different days, so they do not map to the same new name.

### Decision

Resolve a colliding label using the hub segment already present in the reference, and a relative link
using the file's own benchmark tree.

### Alternatives Considered

Keying the sweep on the bare label, which is what the first attempt did. It sent references to a
sibling hub's folder, producing links that resolved to the wrong evidence. 366 were corrected.

### Consequences

The map must be read per root, never per base name. This is recorded here because the same mistake is
available to anyone who reads the map as a flat dictionary.

---

## ADR-005: Treat A Reviewer Finding As A Hypothesis

**Status:** Accepted

### Context

A two-lineage deep review returned three P1 findings. The run that produced them
was not trustworthy: one lineage failed terminally on a write-containment
violation, and the other wrote nine of twelve state records with timestamps in
the future, up to twenty-six minutes past the moment the run ended. The lineages
also ran sequentially into a shared packet, so the second could have read the
first's report rather than reaching its conclusions independently.

### Decision

Verify each finding against the code before acting on it, and record what
verification showed rather than what the reviewer claimed.

### Alternatives Considered

Accepting the findings on the reviewers' authority, which their agreement
superficially supports. Rejected: agreement between two lineages that shared a
packet is not independent corroboration, and a fabricated timestamp is direct
evidence that at least one lineage wrote things it did not measure.

### Consequences

All three findings survived verification, two of them defects introduced by this
packet and one pre-existing. Verification also corrected the framing of the
second: the two report filenames belong to two different benchmark families, so
the defect was a doc written from a reference layout and never reconciled against
the writer, not a contradiction inside one family.

---

## ADR-006: Run Dispatched Executors In An Isolated Worktree

**Status:** Accepted, after a destructive incident

### Context

The codex lineage of the review ran in the shared working tree. Its write-
containment guard snapshots dirty out-of-scope paths before dispatch and reverts
anything new outside its own lineage directory afterwards. A concurrent session
was actively writing to the same tree during the run, so its files were created
after the snapshot and outside that directory. The guard attributed them to the
leaf and reverted thirty-two paths: twenty-six untracked files deleted, four
tracked files restored to their committed state.

The work survived only because that session had committed seconds earlier and
regenerated the rest within minutes.

### Decision

Every dispatched executor runs in its own git worktree.

### Alternatives Considered

Coordinating timing so no other session writes during a run. Rejected: the
containment behaviour had already been read and understood before this run, and
concurrency was lowered specifically to protect the sibling lineage from it. The
guard was applied to the wrong risk while the more likely writer went
unconsidered, so a control that depends on remembering to think of it is not a
control.

### Consequences

Worktree setup costs time per run. The containment guard keeps its value as a
scope check while its blast radius is confined to a tree nobody else edits.
