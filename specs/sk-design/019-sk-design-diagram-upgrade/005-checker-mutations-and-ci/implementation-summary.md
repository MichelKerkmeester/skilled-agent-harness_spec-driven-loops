---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/005-checker-mutations-and-ci"
    last_updated_at: "2026-09-10T23:15:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase documents"
    next_safe_action: "Execute T001"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/005-checker-mutations-and-ci/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/005-checker-mutations-and-ci/plan.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/005-checker-mutations-and-ci/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-005-checker-mutations-and-ci"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 005-checker-mutations-and-ci |
| **Completed** | Not yet — planned |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is authored, not executed. Once T001-T024 run, the diagram skill's corpus will carry
its first automated gate: `check-diagram-corpus.cjs`, replacing the manual taste checklist that is
the only check this corpus has ever had, and `corpus-mutations.test.cjs`, proving each of the
checker's ten families fails for its own stated reason rather than for a hollow one — the exact
failure mode two reviews already found twenty-one times in the chart's own checker before it had a
mutation suite to guard it.

### Phase 5: checker-mutations-and-ci

Once executed, this phase turns "no automated check exists" into a blocking CI gate. The checker
asserts what 002 already signed (marker vocabulary, node tagging, the font allowlist, the 4px
exemption list, the derivation record) against the corpus 004 already repaints — it does not decide
anything new, it enforces what is already decided. The mutation suite is the phase's real proof
surface: a family that only ever passes is not proven, and the chart's own history shows exactly
how a checker earns a false sense of safety without one. `check-diagram-corpus.cjs` and
`corpus-mutations.test.cjs` are the two concrete artifacts everything else in this phase serves.

### Files Changed (planned)

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` | Created | The corpus's first checker: ten named families, a registry-driven family count, the judged-boundary registration |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/corpus-mutations.test.cjs` | Created | The mutation suite: whole-corpus precondition, four refusals, one case per family, completeness triple |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/fixtures/` | Created | Per-family mutation fixtures |
| `.github/workflows/diagram-corpus.yml` | Created | The corpus's first CI gate, built from nothing |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned path: T001-T003 confirm 004's repaint actually landed and read the
chart's pattern source and 002's signed ledger; T004-T017 build all ten families and run the
checker against the real repainted corpus, where the first `RESULT: PASSED` doubles as both 004's
own dress-run gate and this phase's precondition; T018-T022 build the mutation suite's four
refusals, per-family cases and completeness triple, then the CI workflow; T023-T024 read the local
test run and the CI run by eye before the gate is called met. Rollout is not a deployment — every
artifact is a git-tracked file or a CI workflow read later by a script or a human, not a running
service.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Flatten the source before asserting accessibility (ADR-001) | A line-oriented grep false-negatives `example-loop-terminal.html`'s multi-line `<svg>` open tag; a flattened view fixes the read without adding a full HTML parser |
| Scope title-first to the first `<svg role="img">`, not the first `<svg>` (ADR-002) | `example-high-level.html`'s 13 `<svg>` elements (1 frame + 12 `aria-hidden` icons) would misfire a naive first-element check |
| Re-derive the derivation record rather than compare it against itself (ADR-003) | One of the chart's own confessed hollow assertions was exactly this self-comparison; the derivation-gates family re-derives through 003's ported module instead |
| Port the harness by reading it, never by importing or editing it (ADR-004) | D12 freezes the chart skill as a hard block; a live cross-skill dependency or an edited chart file would both violate the freeze even without changing chart behavior |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scripts/check-diagram-corpus.cjs` prints `RESULT: PASSED` | Not yet run — planned as T017, doubling as 004's own dress-run gate |
| `node --test scripts/tests/` passes, completeness triple clean | Not yet run — planned as T018-T021, read by hand at T023 |
| `.github/workflows/diagram-corpus.yml` CI run is green | Not yet run — planned as T022, confirmed at T024 |
| `git diff` over `sk-design-chart/` is empty | Not yet run — to be confirmed alongside T002 and again before T024 |
| `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/005-checker-mutations-and-ci --strict` | Not yet run — to be run by the orchestrator, not this authoring pass |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **T001 cannot confirm a green corpus until 004 actually executes.** 004's own tasks are authored
   but not yet run (parent `goal.md`'s LOG records 004 as "Authored", not "Done"); this phase's
   family-authoring tasks (T004-T016) are sequenced after T001's confirmation for exactly this
   reason, and block on 004's real execution, not just its authored plan.
2. **The exact shape of the family registry (ten separate functions vs. fewer functions covering
   multiple tallies) is left to whichever task scaffolds it (T004).** Either shape satisfies
   REQ-001/REQ-002's discoverability requirement; the phase's own gate does not depend on which
   shape is chosen.
3. **The judged-boundary registration (REQ-011) ships as a prose block inside the checker, not a
   separate machine-readable file.** 006 may choose to formalize it further once its own judged
   checklist format is defined; this phase's own gate only requires the boundary to be named.
<!-- /ANCHOR:limitations -->
