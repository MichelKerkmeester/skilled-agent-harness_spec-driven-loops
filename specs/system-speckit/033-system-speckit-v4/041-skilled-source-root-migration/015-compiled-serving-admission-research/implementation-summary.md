---
title: "Implementation Summary: Phase 15: compiled-serving-admission-research"
description: "Two lineages on two models independently recommend admitting new hubs to compiled-serving through a checker of compiled decisions against routing gold, with the admission bar restated. They also found the cohort is five hubs, not seven, and that the flip tool is broken."
trigger_phrases:
  - "compiled-serving admission summary"
  - "phase 15 results"
  - "routing gold checker recommendation"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/015-compiled-serving-admission-research"
    last_updated_at: "2026-09-18T22:36:18Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Compiled the two-lineage research and wrote the findings back into the spec"
    next_safe_action: "Operator decides whether to accept the restated admission bar before any build phase"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/findings-registry.json"
    session_dedup:
      fingerprint: "sha256:5a9cee58b13fbc5ad6aca0e1ee165b3e95826dbdcd0ba1ce705e62bafb4cb92f"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the operator accept the restated admission bar, or require literal legacy equality?"
      - "How should a clarify decision count, and what coverage floor should each workflow mode need?"
    answered_questions:
      - "Which admission path to recommend: a new checker against routing gold"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-compiled-serving-admission-research |
| **Completed** | 2026-09-19 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A new hub can be admitted to compiled-serving again without restoring the retired lane. The way to do it is a checker that runs each hub's compiled decision against the routing gold its playbook already carries. Two lineages on different models reached that answer independently. The catch is that the admission bar changes. It used to be "compiled equals a replay of the legacy router". It would become "compiled satisfies the authored gold, with coverage floors". That change is the operator's to accept.

### The recommendation

Restoring the retired parity path would bring back about 4,200 lines in four modules, three of them SHA-256-pinned, and it would measure agreement with a model of the router rather than the router itself. Keeping admission closed costs nothing, but it freezes the cohort and leaves the admitted hubs measured against nothing. The checker needs only live code: `compiledRoute()`, the `qualifiedIdToLeaf` bridge, each hub's leaf manifest and 73 typed-gold scenarios. `research/research.md` sets out the scoring rules the retired scorer already defined, the coverage floors, and eight build steps for a later phase.

### What the research corrected

- **The cohort is five hubs, not seven.** sk-design was dissolved and sk-prompt retired. This phase's charter said seven, and so do the phase 13 summary, a `resolve.cjs` comment and the compiled-routing architecture reference.
- **The flip tool cannot run.** `frozen-scorer-contract.cjs` points its scorer check at a directory that no longer exists, so the authored tool that flips a hub to compiled serving fails before it flips anything.
- **sk-code's admission rested on one scenario.** Its hub playbook carries a single typed-gold scenario.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Modified | Charter, the corrected hub count, and the generated findings block |
| `research/research.md` | Created | The compiled synthesis |
| `research/lineages/swe2/**`, `research/lineages/deepseek/**` | Created | Each lineage's iterations, state, registry and own synthesis |
| `research/findings-registry.json`, `fanout-attribution.md`, `resource-map.md` | Created | The merged run record |
| `../spec.md` | Modified | Phase 15 row in the phase map and its handoff row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`/deep:research` in auto mode fanned out to two lineages at once, with five iterations each and stop policy `max-iterations`. SWE 2 Max ran through cli-devin and DeepSeek V4.1 Flash through cli-pi. Both completed with no retry. After the merge, the orchestrator re-checked the three claims the recommendation depends on against the tree: the five-hub cohort in `resolve.cjs` and `compiled-route.cjs`, the flip tool's dead scorer path, and the gold count at each hub's playbook root. Where the lineages disagreed, the tree settled it, and `research/research.md` records each difference and how it was resolved.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Recommend the gold checker and state the bar change openly | Both lineages chose it on cited evidence, and the only real cost is semantic, which the operator should decide rather than inherit |
| Correct the hub count in this charter, and only propose the fix elsewhere | This phase is research only; the stale text in shipped docs and a code comment belongs to a build or docs phase |
| Keep the containment copies out of the commit | They are 816 files of baseline copies, and the packet's earlier research phases left theirs untracked too |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Lineages | Two succeeded, none failed (`research/orchestration-summary.json`) |
| Iterations | Five per lineage; both stopped on `maxIterationsReached` |
| Deciding claims | Five hubs, dead scorer path and 73 gold scenarios, each re-checked by hand |
| Spec write-back | Targeted strict validation passed after the findings block was written |
| Phase validation | `validate.sh --strict` on this folder |
| Home paths | None in the phase's tracked files |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The checker's size and the gold's freshness are unknown until it is built.** SWE 2 estimates 500 to 800 lines and DeepSeek a few hundred. Whether any admitted hub's gold has already drifted from its behaviour only a first baseline run can show.
2. **The containment log blames the SWE 2 lineage for an edit the orchestrator made.** The one out-of-scope write it recorded, in `fanout-run.vitest.ts`, was the orchestrator's own CI fix, made in the same worktree while the lineages ran. No lineage wrote outside its directory.
3. **DeepSeek's state log carries invented timestamps.** Five of its rows are stamped between 10 and 90 minutes after the lineage finished. The iteration content is unaffected, but those timestamps say nothing about when anything ran.
4. **Two steps of the research workflow could not run as written.** Its post-write-back validation names a rule, `TEMPLATE_HEADERS`, that the validator no longer has, so the check ran without it. Its write-back audit event is refused by the append gateway as `legacy-record-has-no-lossless-mode-event`, so no JSONL row records the write-back; this summary is the record.
5. **The stale seven-hub text remains outside this phase.** It is in `013-clear-pre-existing-ci-and-doc-debt/implementation-summary.md`, the comment at `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:29`, and five places in `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md`, which also names the old `011-runtime-engine` path.
<!-- /ANCHOR:limitations -->

---
