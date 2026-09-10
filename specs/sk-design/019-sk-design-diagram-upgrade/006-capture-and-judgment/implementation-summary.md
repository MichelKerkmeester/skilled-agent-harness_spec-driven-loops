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
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment"
    last_updated_at: "2026-09-10T23:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase documents"
    next_safe_action: "Execute T001"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment/plan.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-006-capture-and-judgment"
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
| **Spec Folder** | 006-capture-and-judgment |
| **Completed** | Not yet — planned |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is authored, not executed. Once T001-T017 run, the diagram skill gains the one gate its
corpus checker cannot provide by itself: a permanent, eye-read verdict on the things no static
check can hold, extending `manual-testing-playbook.md` and persisted through
`run-manual-playbook-scenario.cjs` the same way every other scenario in that playbook already is.

### Phase 6: capture-and-judgment

Once executed, this phase turns "someone should look at it" into a standing, provable process. The
judged column names six specific, answerable reads instead of an unstated feeling; the graduation
door lets a judgment move into 005's checker the day it becomes computable, one way, logged; and the
extended persistence contract means a future auditor can open a dated `benchmark/reports/`
directory and see exactly what was reviewed, when, and why anything was skipped. Unlike phases
002-005, this phase does not close when its tasks finish — it installs a discipline every future
diagram release runs against. `manual-testing-playbook.md`'s new `CAPTURE REVIEW` category and
graduation-log section are the two concrete artifacts everything else in this phase serves.

### Files Changed (planned)

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/sk-design-diagram/manual-testing-playbook/manual-testing-playbook.md` | Modified | Adds the `CAPTURE REVIEW` (`CAP-001`) category, the judged-column definition, the third-capture and double-capture conventions, the extended persistence-contract scope note, and the graduation log |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/` | Created (per release, starting with the first execution) | The first, and every subsequent, dated capture-review report — generated only by `run-manual-playbook-scenario.cjs` |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` | Modified (future, only on a real graduation event) | One line removed from 005's judged-boundary block per item graduated, atomically with a graduation-log row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned path: T001-T003 confirm 005's judged-boundary block and 002's
reconciled fact base are read correctly, and that `manual-testing-playbook.md`'s existing structure
and `run-manual-playbook-scenario.cjs`'s real path are understood before anything is added;
T004-T011 write the judged column, the graduation threshold, the label-mask measurement plan, the
third-capture and double-capture conventions, the extended persistence contract, and the graduation
log; T012-T015 run the measurement and the first full capture-review pass over all 39 captures,
persisting the outcome through the shared runner; T016-T017 read the resulting report and confirm
the judged-boundary block and the graduation log never disagree. Rollout is not a deployment — every
artifact is a git-tracked Markdown file or a dated report directory read later by a human, and the
process itself repeats every release rather than shipping once.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| "Different picture" is a reader comparison, not a computed diff (ADR-001) | No image-diff tool exists anywhere in this skill; the whole point of this phase is that some things are read by an eye rather than computed, and the skin-pinned capture is exactly that kind of read |
| Graduation is a one-way, two-file atomic edit (ADR-002) | Without a stated rule, the judged-boundary block and the graduation log could drift independently, leaving an item listed as both judged and enforced, or neither |
| The font-substitution risk is measured by a headless browser, not reasoned about statically (ADR-003) | F3.3's risk is named but not measured in the reconciled fact base; a static check cannot reproduce real browser font-fallback rendering, and Playwright is already a documented project dependency |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `manual-testing-playbook.md` carries the `CAPTURE REVIEW` category, judged column, and graduation log | Not yet run — planned as T004-T011, read at T016 |
| The headless-browser label-mask measurement produces a recorded pass/fail | Not yet run — planned as T012 |
| The first capture-review scenario produces a dated report with no hand-authored Markdown and every skip reasoned | Not yet run — planned as T013-T015, confirmed at T016 |
| `check-diagram-corpus.cjs`'s judged-boundary block and the graduation log never list the same item | Not yet run — planned as T017 |
| `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment --strict` | Not yet run — to be run by the orchestrator, not this authoring pass |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **T001 cannot confirm 005's judged-boundary block until 005 actually executes.** The parent
   `goal.md`'s own LOG records 005 as "Authored," not "Done"; this phase's judged-column tasks
   (T004-T011) are sequenced after T001's confirmation for exactly this reason.
2. **The exact wording of the six judged reads is left to whichever task writes them (T004),** as
   long as each resolves to a yes/no question answerable while looking at a capture. The
   reconciliation this document performs (six checkable reads plus two named non-blocking taste
   notes) is this authoring pass's own judgment call, recorded in `spec.md`'s Problem Statement
   annotation and `goal.md`'s LOG, not a value independently re-derived from a single unambiguous
   source.
3. **The label-mask overflow measurement (F3.3) is specified, not run, by this authoring pass.**
   Its pass/fail outcome against the 7 named arrow-label mask rects is only known once T012
   executes.
<!-- /ANCHOR:limitations -->
