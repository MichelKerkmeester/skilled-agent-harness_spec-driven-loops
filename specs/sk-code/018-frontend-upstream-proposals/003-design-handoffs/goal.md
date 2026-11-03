---
title: "Goal: Phase 3: design-handoffs"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "design handoffs goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/018-frontend-upstream-proposals/003-design-handoffs"
    last_updated_at: "2026-11-03T08:33:55Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: design-handoffs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Give an open visual value a route to `sk-design-fundamentals` from sk-code and mcp-figma, teach the motion reference to honour reduced motion on web and native, and give fundamentals an optional project-profile slot with a stated precedence.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No routing phrase is added to any router or metadata file in this phase. |
| D2 | The reduced-motion section names no animation library. |
| D3 | A profile ranks last: repository mode, installed tokens, design scales, then profile. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `rg -n "sk-design-fundamentals"` prints one hand-off line in each of `sk-code/SKILL.md`, `sk-code/README.md` and `mcp-figma/SKILL.md`
- [ ] `motion-principles.md` names `prefers-reduced-motion` and the native platform setting, and `rg -n -i "reanimated|framer|gsap"` on it prints nothing
- [ ] Fundamentals `SKILL.md` documents the optional `references/<project>-profile.md` slot with the four-step precedence
- [ ] `git diff --stat` for the phase lists no `ROUTER.md`, `hub-router.json` or `graph-metadata.json`
- [ ] Router reach on sk-design and sk-code at concurrency 2 matches the numbers recorded before the edits
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
| Phase planned | Done | Planning docs authored 2026-11-03 |
| T001 to T003 setup | Done | `scratch/reach-baseline.txt`, `scratch/extractor-lines.txt`, `scratch/placement.md` |
| Build | Done | DeepSeek V4.1 Flash max, 5 files |
| Verification | Done | reach matches baseline; no routing file changed; `scratch/verify-003.md` 7 of 7 met |

### Deviations and findings

| Item | Note |
|------|------|
| Executor | Builds run on DeepSeek V4.1 Flash max via opencode-go, per the operator's switch in phase 001. |
<!-- /ANCHOR:log -->
