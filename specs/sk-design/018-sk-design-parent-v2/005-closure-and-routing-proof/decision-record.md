---
title: "Decision Record: Closure and routing proof"
description: "Why the rebuild's own warning stream is treated as a gate, why every gate is run with --strict, and why four fixtures this packet broke are named rather than moved or deleted."
trigger_phrases:
  - "closure decisions"
  - "rejected edges gate"
  - "strict gate invocation"
  - "flowchart fixture supersession"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/005-closure-and-routing-proof"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the three decisions the closing measurement forced"
    next_safe_action: "Hand the blocked FLOWCHART fixtures to the owner of the sk-doc benchmark corpus"
    blockers: []
    key_files:
      - "specs/sk-design/018-sk-design-parent-v2/scratch/routing-after-005.txt"
      - ".opencode/skills/sk-design/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-001: the rebuild's rejectedEdges count is a gate in its own right"
      - "ADR-002: every gate runs with --strict where it offers it"
      - "ADR-003: the blocked FLOWCHART fixtures are named, not moved or deleted"
---
# Decision Record: Closure and routing proof

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The rebuild's rejectedEdges count is a gate in its own right

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-06 |
| **Deciders** | Phase 5 implementer |
| **Satisfies** | REQ-003, REQ-004, SC-002 |

---

### Context

Phase 003 recorded `skill_graph_validate` clean with no dangling edges, and that was true of the
graph. It was not true of the metadata that produces it. The phase folded the md generator's sibling
edges into the hub by concatenation, without retargeting or deduplication, leaving four edges that
name a skill which no longer exists — including `sk-design` pointing at itself.

`skill_graph_validate` reported `isValid: true, errorCount: 0` on every run of this packet, because
the builder drops a dangling edge at build time and the validator reads what the builder produced.
The only surface that reports the defect is the rebuild's own warning stream, which nothing in the
packet had read.

The edges were not inert. Removing them raised the indexed edge count from 50 to 52 and moved two
phrase scores upward — `extract design tokens from stripe.com` from 0.896 to 0.9026, and `redraw this
drawio diagram` from 0.82 to 0.8252 — the phrases the identity merge was meant to help.

### Decision

Treat `rejectedEdges` from the rebuild output as a gate, require it to be zero, and record the
warning stream alongside the validator verdict rather than instead of it.

### Consequences

- Phase 003's criterion is corrected in the record: true of the graph, false of the sources.
- A whole class of defect becomes visible that no validator in this fleet reports.
- Anyone reading only `skill_graph_validate` in future will still miss it, so the correction is
  written into the packet rather than left as a habit.

### Alternatives Rejected

- **Trust `skill_graph_validate`.** It structurally cannot see a defect the build repairs before it
  runs. Its verdict is accurate about the artefact and silent about the source.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Every gate runs with --strict where it offers it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-06 |
| **Deciders** | Phase 5 implementer |
| **Satisfies** | REQ-003 |

---

### Context

`validate-playbook-topology` prints `verdict=FAIL valid=28 blocked=4` and exits 0. Only `--strict`
makes a blocked fixture set the exit code. A caller checking exit status alone reads a failing gate
as a passing one, and this packet had been doing exactly that.

The same applies to the regenerator that fixes stale derived blocks: its default is a dry run. It
prints the changes it would make and writes nothing, so its output looks identical to a successful
write.

### Decision

Invoke every gate in its strictest available form, read its output regardless of exit code, and
confirm any write by re-running the check rather than by reading the writer's report.

### Consequences

- One gate that had read as a pass throughout the packet is now correctly reported as failing.
- The failure it reports is real, is this packet's fault, and is recorded rather than hidden.
- Two derived-block regenerations that reported success without writing were caught.

### Alternatives Rejected

- **Take each gate's default invocation.** It silently converts a failure into a pass, which is the
  worst available outcome for a phase whose entire purpose is verification.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The blocked FLOWCHART fixtures are named, not moved or deleted

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-06 |
| **Deciders** | Phase 5 implementer |
| **Satisfies** | AC-007 |

---

### Context

Four fixtures in `sk-doc`'s hub playbook assert that `sk-doc` owns FLOWCHART. Phase 004 moved
`sk-create-diagram` to `sk-design` and made that false, so the typed-gold gate now blocks all four.

Three of them — `SD-H05`, `SD-H10`, `SD-005` — are pure FLOWCHART scenarios and would validate under
`sk-design`, which has no hub playbook root at all. The fourth, `SD-007`, declares
`sk-create-quality-control` plus `sk-create-diagram`: one mode from each hub. The gate is per-hub by
design, so that fixture validates under neither, and no cross-hub exception exists.

All four are referenced by benchmark reports dated 2026-07-21 that key results to their scenario ids.

### Decision

Change nothing in the corpus. Record the failure, its cause, its exact invocation and every option,
and hand it to whoever owns that benchmark. Close AC-007 as `Superseded`, not `Met` or `Waived`.

### Consequences

- `validate-playbook-topology --strict` stays red on `sk-doc`, and this packet says so plainly rather
  than claiming both hubs green.
- The corpus keeps its correspondence with the published reports.
- The next packet inherits a precisely described defect instead of a silently altered corpus.

### Alternatives Rejected

- **Delete the four fixtures.** Destroys tracked coverage and orphans the report lineage that
  references their ids.
- **Move three to a new `sk-design` hub playbook and delete the fourth.** Still deletes, and splits a
  benchmarked corpus across two hubs partway through its own report history.
- **Rewrite `SD-007` to a pair that validates.** Fabricates a scenario under an id whose meaning is
  already published, which is worse than leaving it broken and labelled.
<!-- /ANCHOR:adr-003 -->
