---
title: "Goal: sk-create-chart"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart"
    last_updated_at: "2026-09-02T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Reconciled the binding table and progress log for phases 009 to 011"
    next_safe_action: "Review the two open questions recorded above before scheduling new work"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/SKILL.md"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
    session_dedup:
      fingerprint: "sha256:65e0a180c813a87bf44ba1364baec6db4aabafafe1c2796d06352a971bc3b6f0"
      session_id: "2026-09-02-051-sk-create-chart"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "A bare two-word chart form name still scores below the mandatory-invoke bar, confirmed unchanged by phase 011's own scope"
      - "Whether the packet changelog still matches the corpus after phases 010 and 011 is not settled by either phase's own documents"
    answered_questions:
      - "Placement is a workflow mode under sk-doc"
      - "Nothing is copied from the reference implementation"
      - "Phase 007's twelve fidelity recommendations are closed: seven applied, three partial by decision, two refused in writing"
      - "Phase 008's adjudicated recommendation set is built, across all seven of phase 009's own child phases"
      - "Phase 010 closed all five checker holes it recorded on arrival"
---
# Goal: sk-create-chart

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give `sk-doc` a chart-authoring mode of this repository's own making, and hold its output to what mature open-source charting delivers.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The capability lands as a workflow mode under the `sk-doc` hub, not as a standalone skill |
| D2 | Nothing is copied from `lieflat-charts`, which is PolyForm Noncommercial. Every file here is written independently |
| D3 | A delivered chart is one HTML file with no build step and no remote dependency |
| D4 | A contract-level change is the operator's call, not the implementer's |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 007-fidelity-and-library-research | `007-fidelity-and-library-research/goal.md` |
| 008-evilcharts-reference-research | `008-evilcharts-reference-research/goal.md` |
| 009-chart-visual-overhaul | `009-chart-visual-overhaul/goal.md` |
| 010-chart-review-remediation | `010-chart-review-remediation/implementation-summary.md` |
| 011-chart-command-surface | `011-chart-command-surface/implementation-summary.md` |

Phases 001 through 006 closed before this document existed and carry no goal of
their own. Phases 010 and 011 closed after this document existed and carry no
goal of their own either. Their record is the `implementation-summary.md` in
each folder.

**Precedence.** Decisions above outrank child detail; child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED`
- [ ] Every phase folder under `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/` carries a Status of Complete in its own spec.md or implementation-summary.md metadata table
- [ ] Every phase-map row in `spec.md` names real scope and a real status, with no placeholder text left in any row
- [ ] `validate.sh specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart --strict --recursive` prints `RESULT: PASSED` for every folder
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| 001 source inventory and placement | Done | Phase map row at `spec.md:144` |
| 002 translation and voice | Done | Phase map row at `spec.md:145` |
| 003 packet scaffold | Done | Phase map row at `spec.md:146` |
| 004 native chart build | Done | Twenty-one templates under `.opencode/skills/sk-doc/sk-create-chart/assets/templates/`, after phase 009 added the composed form |
| 005 routing integration | Done | Phase map row at `spec.md:148` |
| 006 playbook and closeout | Done | `.opencode/skills/sk-doc/sk-create-chart/manual-testing-playbook/` |
| 007 fidelity and library research | Done | Twelve recommendations closed, seven applied, three partial by decision, two refused in writing, per its own completion criteria, all checked |
| 008 evilcharts reference research | Done | `008-evilcharts-reference-research/goal.md`, Status Complete |
| 009 chart visual overhaul | Done | `009-chart-visual-overhaul/goal.md`, all seven of its own child phases Complete |
| 010 chart review remediation | Done | `010-chart-review-remediation/implementation-summary.md`, Status Complete |
| 011 chart command surface | Done | `011-chart-command-surface/implementation-summary.md`, Status Complete |

### Deviations and findings

| Item | Note |
|------|------|
| The phase map row for phase 7 was never filled in | `spec.md:145` still reads `[Phase 7 scope]` and `Pending`, and `spec.md:162` still reads `[Criteria TBD]`, although the phase shipped |
| Phases 001 through 006 carry no goal document | This addon arrived after they closed. Adding one now would be a record rather than a directive |
| This reconciliation pass found two more stale rows | `spec.md`'s phase-map row for phase 8 read `In Progress` after phase 8 itself had already closed `Complete`, and this document's own row for phase 7 still read `In Progress` with the twelve recommendations called open after phase 7 itself had closed all twelve. Both are corrected here, sourced from each phase's own document |
<!-- /ANCHOR:log -->
