---
title: "Goal: Phase 14: removed-template-reality-sweep"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "removed template reality sweep goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/014-removed-template-reality-sweep"
    last_updated_at: "2026-10-26T11:50:29Z"
    last_updated_by: "conductor"
    recent_action: "Recorded the fixes, review and guard evidence"
    next_safe_action: "Run strict validate on this folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-014-removed-template-reality-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 14: removed-template-reality-sweep

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Print one parseable level line on request. WEAK: Improve the script. -->

**Objective:** Leave no doc, command, agent or comment that mentions a deleted add-on template or describes behavior the shipped code no longer has.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The sweeps skip `specs/**`, `changelog/` folders, `runtime/data/trigger-index.json` and `runtime/cli/retrieval/fixtures/**`; they are records or CI rebuilds them. |
| D2 | The deep loops' own `resource-map.md` output and its docs stay; that file still ships. |
| D3 | DeepSeek V4.1 Flash max through cli-pi makes the fixes, one brief per batch; cli-codex Luna is the fallback; a fresh Opus medium agent reviews the diff. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--quiet` prints 1 line and exits 0. WEAK: The work is done. -->

- [x] Both sweeps in `scratch/`, rerun from the final tree, list zero stale hits
- [x] `sync-skills-hermes.cjs --check` prints `PASS`
- [x] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`
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
| Phase opened | Done | create.sh scaffolded this folder on 2026-10-26 |
| Audits | Done | `audit-mentions.md`: 19 stale lines plus 3 nearby gaps. `audit-reality.md`: 12 contradictions |
| Fixes H1 to H5 | Done | cli-pi DeepSeek V4.1 Flash max; reports in `scratch/runs/`, all exit 0 |
| Review | Done | `scratch/review.md`: OK with notes, 9 findings, all fixed by H5 and the conductor |
| Final sweep | Done | 10 hits, all judged fine |
| Guards | Done | links 0 broken; Hermes `PASS: 67`; `CARD SYNC OK`; `EXAMPLE_DRIFT_OK`; agent mirrors OK; `bash -n upgrade-level.sh` exit 0; 7 add-on files |

### Deviations and findings

| Item | Note |
|------|------|
| /speckit strict gate kept | The workflows keep their per-step strict gate. It is their own checkpoint, separate from the card's loop, and each gate carries a deliberate cadence comment. `SKILL.md` line 61 now says so |
| `.claude` agent edited by hand | H3 edited `.claude/agents/orchestrate.md`; no sync script writes it, and the agent mirror check failed until it matched |
| Generated files lag | The trigger index and retrieval fixtures still hold old phrases until CI rebuilds them on push |
<!-- /ANCHOR:log -->
