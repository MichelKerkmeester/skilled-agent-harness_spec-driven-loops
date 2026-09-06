---
title: "Implementation Summary: evilcharts reference research"
description: "Two model families read a vendored MIT chart library across nine iterations and produced one adjudicated recommendation set, plus a runtime repair that made the second dispatch legal."
trigger_phrases:
  - "evilcharts research summary"
  - "chart reference research results"
  - "two model fan out results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "phase-8-cross-lineage-synthesis"
    recent_action: "Merged both lineages into one adjudicated set"
    next_safe_action: "None open. The build packet is authored and running"
    blockers: []
    key_files:
      - "research/research.md"
      - "context/evilcharts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-8-evilcharts-reference-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The copy rule needs no amendment, because the one row that wanted code is rejected on other grounds"
      - "The two lineages contradict each other on five points, and each is resolved or handed over rather than averaged"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research |
| **Status** | Complete |
| **Delivery** | Research only. Nothing under the chart skill was modified |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A vendored, pinned copy of an MIT chart library under `context/evilcharts`, and an adjudicated
recommendation set at `research/research.md` built from two independent readings of it.

The operator's instruction was that the charts the skill produces are not liked. The research
exists to say what a well-regarded library does differently, in terms concrete enough to build
from: a file, a line, a verdict, and the route into a single self-contained file.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two fan-out lineages in one dispatch, at concurrency two, with convergence disabled so neither
could stop early.

| Lineage | Executor | Model | Effort | Iterations |
| --- | --- | --- | --- | --- |
| `deepseek-flash-max` | cli-devin | `deepseek-v4-flash-max` | permission-mode lever | 5 of 5 |
| `glm-flash-xhigh` | cli-pi | `z-ai/glm-5.3-flash` | `xhigh` | 5 of 5 |

The two read different halves of the subject, which is why the merge is worth more than either
list. One read the React components and the install path. The other found that the library ships
a second rendering engine for every form, and mined it for the physical constants that make the
recommendations concrete.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**A runtime repair preceded the dispatch.** The fan-out script pinned every model in the Flash
family to the effort tier named `max`. The GLM model has no such tier on any route and rejects
it. The TypeScript module the script mirrors already carried the carve-out, so the script was a
stale copy of a contract that had moved. The two functions were mirrored across, and the
recorded effective config confirms the model then ran at its own top tier.

**Contradictions are recorded, not averaged.** The two lineages disagree on five points. Three are
settled in the synthesis by argument, one against the reading that ignored a deliberate corpus
choice, one against the reading that would put decoration behind data, and one against removing
the focus ring and the ability to copy a number from a delivered document. Two are handed to the
operator, because they are questions of taste that no amount of source reading can settle. The
fifth was found while planning the build rather than while merging, which is the argument for
re-reading a merged set instead of trusting it.

**The copy rule stays as written.** Both lineages independently found that the skill forbids
copying from an outside chart library with no carve-out for licence, and that the library is
permissively licensed. The only recommendation that wanted real code is rejected on editorial
grounds, so the question never becomes live.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every cited path resolves inside the vendored tree. Four were opened at the exact cited line and
read: the default series stroke of 0.8, the grid dash pattern, the class that sets values in a
mono face with tabular figures, and the bar corner radius of 2.

The authored documents scan clean against the voice standard. The phase validates strict with
no errors.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The GLM lineage reached five on a later day, through the runtime's own resume path rather than a
hand-written substitute. Its fifth iteration answered the registry question and swept its own
list. The sweep overturned no verdict and corrected four counts, the largest being the block
total, which had been overstated by a factor of two. The merged set was re-read against both
lineages when the cross-lineage document was written, and again when the build plan was authored,
which is where two errors in it were caught.

The runtime repair lives in this branch. Any other place that dispatches this model family
through the script carries the same defect until this lands.
<!-- /ANCHOR:limitations -->
