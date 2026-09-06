---
title: "Implementation Summary: Phase 6 playbook and closeout"
description: "An eight-scenario manual testing playbook that passes the operator contract with a nonzero count, a reproduced-and-reversed routing-gold trap, and a packet closed on gate output with three items left open."
trigger_phrases:
  - "chart playbook shipped"
  - "operator scenario count"
  - "routing gold negative control"
  - "chart packet closeout"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/006-playbook-and-closeout"
    last_updated_at: "2026-09-02T00:00:00Z"
    last_updated_by: "phase-6-closeout"
    recent_action: "Authored the playbook package and closed the packet on gate output"
    next_safe_action: "Act on the three recorded open items, starting with the packet changelog"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/manual-testing-playbook/manual-testing-playbook.md"
      - "specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/spec.md"
      - "specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/006-playbook-and-closeout/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-6-playbook-and-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "The packet changelog still describes the scaffold release"
      - "004-native-chart-build keeps a Draft status because its acceptance criteria are an unfilled template"
      - "A bare two-word chart form name scores below the mandatory-invoke bar at stage one"
    answered_questions:
      - "Families do not each need a scenario, and the coverage table carries them"
      - "Five of the eight scenarios run headless"
      - "The fleet metadata criterion closes as a waiver under ADR-003"
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
| **Spec Folder** | 006-playbook-and-closeout |
| **Completed** | 2026-09-02 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The chart packet can now be told apart from a broken chart packet by somebody who did not write
it. `.opencode/skills/sk-doc/sk-create-chart/manual-testing-playbook/` holds a root index and
eight scenarios across three category folders, and the operator-scenario validator reports
`operator=8` with zero violations. The trap that makes this contract dangerous was reproduced on
the finished package and reversed, so the count is evidence rather than an assumption.

### The playbook

Eight scenarios, each admitted on one test: it fails for a reason no other scenario catches.

Three cover what only a reader can see. `reading-the-chart/headline-agrees-with-the-data.md`
checks each card's top line against the data block in the same file, which is the gap that let
two shipped headlines contradict their own numbers while rendering perfectly.
`reading-the-chart/axis-ladder-fits-the-tallest-mark.md` compares the top gridline against the
peak, because a ladder that steps five to ten draws the data at half height and looks flat rather
than broken. `reading-the-chart/nothing-runs-past-the-drawing-edge.md` covers clipped labels,
end ticks centred on the plot boundary and overlapping axis names, none of which an
element-counting check can see.

Three cover the corpus. `corpus-integrity/a-chart-that-draws-nothing.md` is the render pass, the
only check that opens a file, plus the discriminator for the known browser flake.
`corpus-integrity/colour-comes-from-one-source.md` breaks the palette block and then the
colour-literal rule, one at a time, and restores between them.
`corpus-integrity/catalog-resolves-both-ways.md` breaks the index in each direction separately.

Two cover what reaches a user. `delivery-and-routing/opens-with-no-build-step.md` sends a
delivery outside the repository and opens it with the network off.
`delivery-and-routing/form-choice-and-the-diagram-boundary.md` replays both routing stages and
confirms the neighbouring diagram packet still takes its own traffic.

The root index carries the policy, the wave plan, the family coverage table and the render flake
written down rather than left to be rediscovered.

### The trap, reproduced

Adding a routing-gold frontmatter signature reclassifies a scenario as a declared benchmark
corpus and excludes it from the operator contract. Injecting `expected_workflow_mode` and
`expected_leaf_resources` into all eight files turned
`PASS ... operator=8 routing_gold_excluded=0 violations=0` into
`SKIP ... operator=0 routing_gold_excluded=8 violations=0`, **at exit 0 in both states**. A check
looking for a failure marker reads the second line as clean. The package was restored from a
backup taken beforehand and a `shasum -a 256` comparison of all nine files reported no
difference.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/sk-create-chart/manual-testing-playbook/manual-testing-playbook.md` | Created | Root index, review protocol, wave plan, family coverage table and the render flake discriminator |
| `.../manual-testing-playbook/reading-the-chart/headline-agrees-with-the-data.md` | Created | CHT-001, the headline against its own data |
| `.../manual-testing-playbook/reading-the-chart/axis-ladder-fits-the-tallest-mark.md` | Created | CHT-002, the top gridline against the peak |
| `.../manual-testing-playbook/reading-the-chart/nothing-runs-past-the-drawing-edge.md` | Created | CHT-003, clipped, overflowing and colliding text |
| `.../manual-testing-playbook/corpus-integrity/a-chart-that-draws-nothing.md` | Created | CHT-004, the render pass and the flake discriminator |
| `.../manual-testing-playbook/corpus-integrity/colour-comes-from-one-source.md` | Created | CHT-005, palette drift and colour literals |
| `.../manual-testing-playbook/corpus-integrity/catalog-resolves-both-ways.md` | Created | CHT-006, the index in both directions |
| `.../manual-testing-playbook/delivery-and-routing/opens-with-no-build-step.md` | Created | CHT-007, the no-install property |
| `.../manual-testing-playbook/delivery-and-routing/form-choice-and-the-diagram-boundary.md` | Created | CHT-008, both routing stages and the neighbour |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/spec.md` | Modified | Phase map reconciled, status, branch and continuity |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/00{1,2,3,5}-*/spec.md` | Modified | Status flipped to Complete, scaffold title markers removed |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/006-playbook-and-closeout/spec.md` | Modified | Status, and the open questions answered or recorded |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/006-playbook-and-closeout/plan.md` | Rewritten | The actual approach, replacing the template |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/006-playbook-and-closeout/tasks.md` | Rewritten | The executed tasks and the verification checklist |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/006-playbook-and-closeout/acceptance-criteria.md` | Rewritten | Twelve criteria, eleven met on observed output and one waived |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/006-playbook-and-closeout/decision-record.md` | Created | The three decisions this phase took |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every gate was baselined before the first edit, so a break could be told apart from one that was
already there. The contract was read from `validate-playbook-package.cjs` rather than from a
description of it, because the failure this phase exists to avoid is a misread of that file. A
sibling package was read for the document shape before anything was written.

The scenarios were grounded in the eight defects a person found by opening files in a browser,
which is why each one names a real break rather than a hypothetical one. The negative control ran
against the finished package rather than against a fixture, so the thing proven is the thing that
ships.

Every command that carries evidence was written to a file and its exit status read separately.
A status read through a pipe is the pipe's status, and every gate here reports through a summary
line that a pipe would swallow.

Nothing is committed and nothing is pushed. The playbook tree and the spec-document edits are
staged.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Eight scenarios grouped by failure mode, not one per chart family | The eight real defects do not distribute by family, so a per-family set would produce six documents failing for the same reason. ADR-001 |
| The result-persistence sentence restated without its semicolon | The validator reads the marker comment, not the sentence, so the package can satisfy the contract and the voice standard without carrying an exemption. ADR-002 |
| The fleet metadata criterion waived rather than met | The one failing root belongs to another hub and predates this packet. Turning it green would be an unreviewed edit outside this packet's authority. ADR-003 |
| `004-native-chart-build` keeps its Draft status | Its acceptance criteria are still an unfilled template with an Unmet placeholder row. Flipping the status would either fail the closure gate or require attesting another phase's evidence from its own summary |
| The tracked `.gitkeep` under the playbook directory stays | It is a tracked file created by an earlier phase, and deleting a tracked file is not this phase's to do quietly. It is inert: the package validator walks Markdown only, and the hub leaf manifest indexes `assets/` and `references/` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate-playbook-package.cjs --package sk-doc/sk-create-chart` | PASS. `operator=8 routing_gold_excluded=0 violations=0 warnings=0`, exit 0 |
| Routing-gold negative control, then restore | Reproduced. `SKIP ... operator=0 routing_gold_excluded=8` at exit 0, restored byte-identical by `shasum -a 256` comparison across all nine files |
| `parent-skill-check.cjs .opencode/skills/sk-doc` | PASS. All hard invariants passed, 0 warnings, exit 0 |
| `check-corpus.cjs --render` | PASS. `RESULT: PASSED`, exit 0, fifteen checks with assertion counts including `render: 29 assertions` |
| `compiled-route-manifest.cjs freshness --hub sk-doc` | `fresh=true`, generation 5, policy hash unchanged from the pre-work baseline |
| `validate.sh specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart --strict --recursive` | PASS. Seven folders, each printing `RESULT: PASSED` with its rule block present |
| `ci-skill-root-metadata.cjs` across the fleet | `checked=14 passed=13 failed=1`, exit 1. `sk-doc` is `OK [H]`. The failure is a stale `mcp-tooling` leaf manifest, identical to the pre-work baseline. Waived under ADR-003 |
| `hvr_scan.py` over all nine playbook documents | 0 hard blockers each, exit 0 |
| Stage-one routing replay | `make a waterfall chart of the budget movement` returns `sk-doc` at 0.91. `create diagram` returns `sk-doc` at 0.95 |
| Stage-two routing replay | The chart request resolves `sk-create-chart` with three resolvable resources. The diagram request resolves `sk-create-diagram` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The packet changelog describes a release that no longer matches the tree.** `changelog/v1.0.0.0.md` states that the corpus directories are empty and that the packet is not registered, and both are false. The corpus holds twenty forms and the mode routes at both stages. The fix is a new changelog entry plus a matching `SKILL.md` version bump, which belongs to the phases that shipped the corpus and the routing rather than to this one. Nothing automated catches it, because no check compares a changelog against the tree.

2. **`004-native-chart-build` still says Draft while the parent map says Complete.** Its `acceptance-criteria.md` is the untouched template, carrying one placeholder row at `Unmet`. Flipping its status would make the closure gate fail on that row, and filling the row would mean marking another phase's criteria met on the strength of that phase's own summary. The check that would settle it is filling those criteria from evidence re-run rather than re-read.

3. **A bare two-word chart form name sits below the mandatory-invoke bar at stage one.** Measured from the final state, `waterfall chart` alone returns `sk-doc` at 0.76, under the 0.8 threshold, while `make a waterfall chart of the budget movement` returns 0.91 and `create a chart` returns 0.95. Stage two resolves the mode on the alias in every case. The routing phase recorded higher numbers for its own phrasings and did not record them verbatim, so the two cannot be compared directly. The check that would settle it is replaying the exact phrasings that phase measured.

4. **Two scenarios cannot run on a headless machine.** `CHT-004` needs a Chrome or Chromium binary and `CHT-003` needs a display a person can read. Each names its blocker in its own preconditions and records a `SKIP` rather than a pass, which is the honest outcome and still a gap in coverage on a build machine.

5. **The playbook cannot verify itself.** It states what a correct chart looks like, and a reader who disagrees with a scenario has no arbiter but the corpus. That is the same limit the corpus record named for the visual pass, and it is why the scenarios cite the shipped files rather than describing them.
<!-- /ANCHOR:limitations -->
