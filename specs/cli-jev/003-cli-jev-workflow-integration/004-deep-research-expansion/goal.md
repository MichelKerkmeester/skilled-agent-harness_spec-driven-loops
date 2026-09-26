---
title: "Goal: Phase 4: deep-research-expansion"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "jev research round 2 goal"
  - "jev council re-synthesis goal"
  - "four lineage jev research criteria"
  - "jev phase reconciliation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion"
    last_updated_at: "2026-09-26T20:40:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Authored the durable directive"
    next_safe_action: "Dispatch the Opus 5.5 xhigh re-synthesis of round 1"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/ai-council/council-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: deep-research-expansion

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Re-synthesize round 1 from the AI Council review, deepen the revised recommendations with 20 forced research iterations on four model families, write one final ranked synthesis, and reconcile the Planned build phases with it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A fresh Opus 5.5 xhigh leaf rewrites `../001-deep-research/research/research.md` from `ai-council/council-report.md` and `proposed-resynthesis.md`, reopens every council claim it keeps and adds a section listing what changed |
| D2 | Lineages: `grok` (cli-cursor, `grok-4.7-xhigh-fast`, since Grok 4.7 lists no MAX tier), `mimo` (cli-pi, `mimo-v2.6-pro`, high), `swe` (cli-devin, `swe-2-max`) and `deepseek` (cli-pi, `deepseek-v4.1-flash`, max), 5 iterations each, stop policy max-iterations, convergence off, concurrency 4 |
| D3 | Lenses: `grok` outside patterns and the referenced `../context/` material, `mimo` UX and measurement, `swe` code-level slice design, `deepseek` seams, gating and failure paths. Iteration N takes angle `<label>-0N` from `context/research-angles.md` |
| D4 | Iterations 1 and 2 are independent; from iteration 3 each reads the newest sibling iterations, so only agreement in iterations 1 and 2 counts as corroboration |
| D5 | Lineages write only inside `research/lineages/<label>/`, make no live Jev call and keep the Python `jev-cli` and the npm `jevctl` apart |
| D6 | A fresh Opus 5.5 max leaf writes the final synthesis; one Opus 5.5 high leaf per phase amends or adds Planned build phases, and none is built |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `../001-deep-research/research/research.md` carries a section listing its changes against the first synthesis, written by a fresh Opus 5.5 xhigh leaf from the council review
- [ ] `context/research-angles.md` defines 20 angles from `grok-01` to `deepseek-05`, and `scratch/research-topic.txt` holds the topic on one line
- [ ] `research/lineages/grok/`, `mimo/`, `swe/` and `deepseek/` each hold `iteration-001.md` to `iteration-005.md` and a state log with 5 iteration records whose last record has `stopReason` `maxIterationsReached`
- [ ] `research/research.md`, written by a fresh Opus 5.5 max leaf, answers RQ1 to RQ7 and ranks each recommendation build-now, next, later or drop with a seam `file:line`, a metric with baseline and harness, the `jev auth status` key gate and a smallest slice
- [ ] The synthesis marks every citation resolved, drifted or failed, and the orchestrator reopened five citations and three recommendations
- [ ] Every build phase the final synthesis proposes is a Planned child of the parent with `spec.md`, `plan.md`, `tasks.md` and `goal.md`, and `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Phase opened | In Progress | Scaffolded by `create.sh --phase` on 2026-09-26 |
| Round-1 re-synthesis | Done | Fresh Opus 5.5 xhigh leaf rewrote `../001-deep-research/research/research.md` with a changes section: build-now R1 and R19 census; next R20, R2 zero-call slice, R21; 14 later; 40 drops; 47 citations checked, none failed. Host reopened `opencode-goal.js:1107`, `score-outcome-rerank.mjs:119-123` and `secret-scrubber.ts:128`, all resolved |
| Executor pings | Done | `deepseek-v4.1-flash` max, `mimo-v2.6-pro` high, `grok-4.7-xhigh-fast` and `swe-2-max` each replied `OK`, exit 0 |
| Round-2 preparation | Done | Opus 5.5 high leaf wrote `context/research-angles.md` (20 angles, three waves, coverage table) and `scratch/synthesis-brief.md`; prompt-improver on Sonnet tightened the topic; host restored the label list and saved it as one 900-character line; `buildLoopPrompt` previews resolve each lineage directory and `maxIterations: 5` |

### Deviations and findings

| Item | Note |
|------|------|
| Grok 4.7 max | Cursor lists `grok-4.7-{low,medium,high,xhigh}` with `-fast` variants and no MAX tier on 2026-09-26, so `grok-4.7-xhigh-fast` runs `grok`, as in round 1 |
| Level 1 child has no `acceptance-criteria.md` | Kept at Level 1 like `001-deep-research`; the goal criteria come from `spec.md` requirements |
<!-- /ANCHOR:log -->
