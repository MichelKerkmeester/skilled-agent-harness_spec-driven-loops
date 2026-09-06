---
title: "Feature Specification: Reinstate sk-design as a parent hub, and absorb chart, diagram and the md generator as its modes"
description: "sk-design was a parent hub until 19 August 2026, when it was dismantled on purpose because it routed only two unevenly coupled modes. This packet reinstates it with four modes rather than two, moving chart and diagram across from the documentation hub, and treats the whole restructure as the routing change it is."
trigger_phrases:
  - "001-reinstate-design-parent"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-design/018-sk-design-parent-v2"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Reinstate sk-design as a parent hub and absorb chart, diagram and the md generator as its modes

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Supersedes** | `016-deprecate-sk-design-interface`, in part |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/001-reinstate-design-parent |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### This packet reverses a deliberate decision, and says so first

`sk-design` **was** a parent hub. It was dismantled on purpose on 19 August 2026 by
`016-deprecate-sk-design-interface`, commit `4edf582436`, which retired the hub and the
`sk-design-interface` mode and graduated `sk-design-md-generator` to standalone, carrying the
`styles/` corpus with it.

That decision was sound on its own terms, and the reasoning deserves quoting rather than
paraphrasing. The hub routed **exactly two** workflow modes, and the two were *"unevenly coupled to
the shared `styles/` corpus"*: interface was the heavy consumer, the generator the light one. The
packet was explicit that `sk-design` is *"not just a skill folder, it is an advisor-routed identity,
a compiled-routing hub"*, so deleting it was a routing decision rather than housekeeping. It also
closed a documented contraction arc, since `014` had already merged motion into interface and
retired the audit and foundations modes.

### What changed, so the same reasoning no longer applies

The reason for deletion was **two modes, unevenly coupled**. This packet does not rebuild that
shape. It creates a hub of **four** modes with one subject: `sk-design-fundamentals`, which is what
`sk-design` is today; `sk-design-md-generator`, returning; and `sk-create-chart` and
`sk-create-diagram`, moved across from `sk-doc`.

Chart and diagram are the argument for reopening this. They sit in a documentation hub whose other
thirteen modes produce prose, while they produce visual artefacts judged by design criteria. Moving
them gives the design hub the mode count and the coherence it did not have in August.

### What stays dead

`016` retired the interface mode and the design-taste surface deliberately. The hub returning does
not bring them back, and nothing here re-derives the interface mode, the `commands/interface/`
surface, or the judgment layer. A hub is not a reason to restore what was removed for its own
reasons.

### The problem underneath the restructure

A baseline measured before anything moved shows both what must not break and the weakness this
packet inherits. `sk-doc` answers short chart phrasings well: `create a chart` scores 0.918,
`sk-create-chart` 0.874. It answers task-shaped phrasings with nothing at all: `make a chart of
orders by month`, `flowchart`, `redraw this drawio diagram` and `ascii flowchart of the approval
loop` each return no recommendation, although `sk-doc` carries 27 chart and diagram vocabulary
strings, `ascii flowchart` among them verbatim.

That single observation is the risk of this packet: **a registry row, a vocabulary entry and a green
gate prove nothing about whether a request arrives.** The restructure is a routing change wearing a
file move.

### Purpose

`sk-design` is a hub of four coherent modes, every request that reached a mode before still reaches
one, and the proof is a replayed request rather than a configuration row.

### Non-Goals

- Restoring anything `016` retired on purpose.
- Renaming modes or commands. A prefix rename would double the path rewrite across four runtime
  mirrors and buy nothing here.
- Closing the inherited long-phrase routing weakness. It is measured and recorded; fixing it is its
  own packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `sk-design` restructured into a parent hub carrying four modes.
- `sk-create-chart` and `sk-create-diagram` moved out of `sk-doc`, with both hubs' routing surfaces edited in one commit each time.
- The chart spec packet relocated under this parent as `001-sk-create-chart`.
- Routing proven by replayed request against the recorded baseline.

### Out of Scope
- The interface mode and design-taste surface, retired by `016`.
- The long-phrase routing weakness, measured here and fixed elsewhere.
- Lifting the `styles/` corpus out of the md generator: 7,812 of its 7,946 files are that corpus,
  which is data rather than a routable leaf, and extracting it is its own packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/` | Restructure | Root becomes a routing hub; today's content becomes a mode |
| `.opencode/skills/sk-design-md-generator/` | Move | Becomes a mode under the hub |
| `.opencode/skills/sk-doc/sk-create-chart/`, `sk-create-diagram/` | Move | Become modes under the hub |
| Both hubs' routing surfaces | Modify | Registry, router, ROUTER.md, graph metadata, description, SKILL.md, command metadata, leaf manifests |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/` | Move | Becomes `001-sk-create-chart` under this parent |

### The constraint the operator chose

Work happens on the shared branch rather than in a worktree, and other sessions write here. So each
move and its path rewrites land in **one** commit rather than the usual move-then-edit pair: no
commit may leave a skill root without its SKILL.md, or a router signal pointing at a packet that is
not on disk. Git still records renames, because a pure move carries no content edit on the same
path and matches by exact blob hash.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each phase is an independently executable child spec folder.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-sk-create-chart/` | The chart corpus packet, relocated from `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart`. Not authored here: moved | Pending |
| 2 | `002-hub-and-fundamentals/` | `sk-design` becomes a hub with one mode, built from content the root already owns | Pending |
| 3 | `003-md-generator-as-mode/` | The md generator returns as a mode, 7,946 files moved as renames | Pending |
| 4 | `004-chart-and-diagram-cutover/` | Chart and diagram leave `sk-doc` for `sk-design`, both hubs edited together | Pending |
| 5 | `005-closure-and-routing-proof/` | The baseline replayed from the final state, the daemon rebuilt, the packet closed | Pending |

### Execution order is not the numbering

The numbering reads in a sensible order; the work runs in another, because each step must land on a
tree the previous one left green.

**002, then 003, then 004, then 001, then 005.**

`002` first because it is the smallest possible hub, assembled from content the root already holds,
which makes every later step "add a mode to a shipped hub" rather than "author a hub while moving
eight thousand files". `001` late because a spec packet should not describe a skill that has not
moved yet.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `002` | `003` | `sk-design` classifies as a hub and the two fundamentals phrases match baseline | Parent-skill check on `sk-design`, fleet metadata gate, phrase replay |
| `003` | `004` | The md generator resolves as a mode and its two phrases match baseline | Stage-two replay, `skill_graph_validate` clean, its own test suite from the new path |
| `004` | `001` | Chart and diagram phrases name `sk-design`, and `sk-doc` no longer claims them | Phrase replay against baseline on both hubs, both parent-skill checks, chart corpus checker from the new location |
| `001` | `005` | The relocated packet validates from its new path and nothing points at the old one | `validate.sh --strict`, pointer sweep, trigger index regenerated |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Resolved by the operator before work began:

- **Does the re-hub stand, given `016`?** Yes, and `016` is superseded in part, with the reasoning recorded above.
- **Does the md generator move in?** Yes, as a mode. "Stay and reference" is not a shape the canon supports: a packet must be nested, and a symlinked root would classify as a second identity.
- **Does the chart spec packet move?** Yes, as `001-sk-create-chart`.
- **Worktree or shared branch?** Shared branch, which is why each step is a single commit.

Still open:

- Whether the inherited long-phrase routing weakness is worth its own packet, or is a symptom of a
  scorer threshold that should be looked at across the fleet rather than per hub.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
