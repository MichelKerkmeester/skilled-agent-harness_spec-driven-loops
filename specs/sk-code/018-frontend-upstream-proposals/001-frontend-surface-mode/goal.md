---
title: "Goal: Phase 1: frontend-surface-mode"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "frontend surface mode goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode"
    last_updated_at: "2026-11-03T08:33:53Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: frontend-surface-mode

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Give the sk-code hub a dedicated, read-only, stack-agnostic `sk-code-frontend` surface that carries frontend practice, the five-pass Figma check and the Frontend overrides contract, with vocabulary proven not to outrank any existing hub.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The surface is a peer of `sk-code-ci`, reached from request vocabulary alone, never part of `sk-code-quality`. |
| D2 | Vocabulary is multi-word frontend phrases only. An outrank is fixed by renaming the phrase, never by an allowlist entry or a scorer change. |
| D3 | No Barter value enters the packet: no Barter tokens, profile, Angular mappings, ngx-translate notes or declared browser floors. |
| D4 | Native content ships only if ADR-001 records the operator allowing React Native in canonical sk-code. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `.skilled/skills/sk-code/mode-registry.json` lists `sk-code-frontend` in `modes[]` and in its `surfaces` array
- [ ] Router reach at concurrency 2, run after the last edit, prints `outranked=  0` and `wrong-hub=  0` for sk-code, sk-design and mcp-tooling
- [ ] `rg -n -i "barter|@barter-bv|ngx-translate|safari 18|firefox esr" .skilled/skills/sk-code/sk-code-frontend/` prints no line
- [ ] `sk-code-frontend/references/figma-to-code.md` defines five passes and an `INCOMPLETE` verdict for any pass not run
- [ ] A frontend prompt replays through both routing stages to `sk-code-frontend`, saved in this phase's `scratch/replay.txt`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase planned | Pending | Planning docs authored 2026-11-03; nothing built |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
