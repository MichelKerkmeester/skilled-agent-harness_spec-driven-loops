---
title: "Implementation Summary: Fetched-Text Injection Screen (Planned)"
description: "Nothing is built yet. This phase is Planned: its spec, plan, tasks and goal describe one offline scorer that tests whether a Jev or Deem noul spots text trying to instruct the agent, over a fixed public corpus, with no hook added and the seam left open. It was released on 2026-09-29."
trigger_phrases:
  - "fetched text injection screen summary"
  - "injection screen status"
  - "score-injection-screen planned"
  - "injection screen verdict"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen"
    last_updated_at: "2026-09-29T16:30:00Z"
    last_updated_by: "spec-author-leaf"
    recent_action: "Authored the Planned phase for R16"
    next_safe_action: "Operator: confirm the placement, then build to the label gate (released 2026-09-29)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-035-fetched-text-injection-screen"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Where a served screen would run, since no hook handles fetched content"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Fetched-Text Injection Screen (Planned)

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 035-fetched-text-injection-screen |
| **Status** | Planned |
| **Completed** | Not completed. The phase is Planned |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned, and no scorer, test, labels file, planted-sentence file or hub doc exists for it.

### Phase 35: fetched-text-injection-screen

The plan builds `score-injection-screen.mjs` (proposed) in the cli-classifier hub's `benchmark/injection-screen/` folder. Its default run counts agent fetches from tool names in tracked state logs and sizes a fixed corpus of 185 public vendored markdown files, with zero calls. A draw writes 90 rows: 60 natural sections the operator labels and 30 the operator plants one instruction sentence in. Once labeled, a Jev arm and a Deem arm, each behind its own switch and gate, ask one `noul` per row, and each column ends in `keep`, `kill (precision)` or `stop (<reason>)` under the keep rule in `spec.md`. No hook is added. See `plan.md` for the order of work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` | Authored | Planning documents for this phase. No code, hook or skill file has changed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The planning documents were written on 2026-09-29 from R16's record in `../001-deep-research/research/research.md:915-932` and its carries in rounds 2 and 3. The missing seam was reopened at the worktree HEAD in `.claude/settings.json` and the tracked hook files, and the vendored `screen.ts` was read for its question and its missing-answer default. `cli-deem.test.mjs` printed 34 of 34 passed. The operator's "Bind and release" amended parent goal D3 on 2026-09-29 and released the phase, which builds in number order. The build waits on the operator's placement call, and its verdict waits on the operator's labels and sentences.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Measure offline over a fixed corpus | No hook handles fetched content, so the test set is the missing piece this phase can supply without inventing a seam |
| Public vendored text plus operator-planted sentences | Natural positives are rare, and a model-written plant would test the model against its own style |
| The vendored injection question as the `-q` | It is the one the upstream tool already asks, so the phase does not tune its own wording |
| A missing answer is `unmeasured` | The vendored screen turns it into 0, which the research rules out as a silent wrong answer |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build, tests and runs | Not run. Nothing is built |
| Planning documents | `validate.sh --strict`, `check-goal.cjs` and `goal.cjs packet` run on this folder after authoring. Their output is reported by the authoring session, not recorded here as a build result |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing is built yet.** The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Builds run in number order, and disjoint builds may run in parallel.
2. **A keep wires nothing.** The seam is an open question, and whether a hook can warn before the agent reads fetched output is UNKNOWN.
3. **Vendored markdown is not a fetched page.** A served form would have to remeasure on real fetch output.
<!-- /ANCHOR:limitations -->

---
