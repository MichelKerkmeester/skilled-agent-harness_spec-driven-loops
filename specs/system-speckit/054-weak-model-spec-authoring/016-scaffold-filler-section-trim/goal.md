---
title: "Goal: Phase 16: scaffold-filler-section-trim"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "scaffold filler section trim goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/016-scaffold-filler-section-trim"
    last_updated_at: "2026-10-26T15:03:32Z"
    last_updated_by: "planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-016-scaffold-filler-section-trim"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 16: scaffold-filler-section-trim

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Print one parseable level line on request. WEAK: Improve the script. -->

**Objective:** Stop the core templates from scaffolding sections and sample rows that a weak model fills with generic text, without changing any existing packet's validation verdict.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Enhanced rollback and effort estimation leave the scaffold; phase dependencies, edge cases and the DoD test line keep their sections with token-only content; the sign-off section stays at Level 3 and 3+ with one token row. |
| D2 | Fix Completeness becomes optional through the header `## FIX ADDENDUM: FIX COMPLETENESS`; no validator code changes unless the census forces the fallback in `spec.md` section 6. |
| D3 | Card section 6 drops its `### Step` requirement and matches the `plan.md.tmpl` phases fill note. |
| D4 | The before-after, roadmap and resource-map add-ons stay removed, and phase 015 closes before this phase edits a template. |
| D5 | DeepSeek V4.1 Flash max through cli-pi makes each change from one short brief; cli-codex gpt-6-luna is the fallback; a fresh Opus medium agent reviews; the conductor runs every gate. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--quiet` prints 1 line and exits 0. WEAK: The work is done. -->

- [ ] Sorted strict-census and six-rule-census diffs, before against after, print nothing
- [ ] `rg` for "Phase 1.5", "Feature flag configured", "External service failure", "Network timeout" and "Tests passing" over the regenerated golden snapshot prints nothing
- [ ] `template-fill-guidance.vitest.ts`, `scaffold-golden-snapshots.vitest.ts`, `required-template-anchors.vitest.ts` and `validation-optional-anchors.vitest.ts` print 0 failed
- [ ] `check-card-sync.sh` prints `CARD SYNC OK`, `check-example-drift.sh` prints `EXAMPLE_DRIFT_OK` and `sync-skills-hermes.cjs --check` prints `PASS`
- [ ] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `rg -n quiet` printed line 510. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase planned | Done | spec, plan, tasks, acceptance criteria and this goal written on 2026-10-26 |
| Phase 015 closed | Pending | |
| Baselines | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| Extra-anchor trial | On 2026-10-26 an `L2:` anchor the template lacks, added to a copy of fixture `053-template-compliant-level2`, raised no anchor error; the one new error was the graph-metadata fingerprint. Removing a template section should not fail packets that keep it; the census confirms |
<!-- /ANCHOR:log -->
