---
title: "Goal: Phase 1: layout-tooling-and-pilot"
description: "The rewrite driver, briefs and fact lock turn an old changelog into the v4.1.0.0 layout without losing a fact, proven on a pilot."
trigger_phrases:
  - "layout tooling and pilot goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/010-changelog-layout-retrofit/001-layout-tooling-and-pilot"
    last_updated_at: "2026-11-17T18:13:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cbc62a39-7ca8-4b5a-989f-a86fdea260ea"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: layout-tooling-and-pilot

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** The rewrite driver, briefs and fact lock turn an old changelog into the v4.1.0.0 layout without losing a fact, proven on a pilot.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Hy4 Flash Free at high thinking through cli-opencode writes whenever it is available. When it is limited or fails, GLM 5.3 Flash at high on the opencode-go provider writes instead. A free model from another family checks the facts |
| D2 | A draft lands only after the fact lock, the shape check and the voice scan pass. Anything else is restored from the saved original |
| D3 | The pilot covers every list, so each family's entry shapes are tried before its phase runs |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `../scratch/lists/` holds 11 lists, one per rewrite phase, whose line counts add up to 1,576
- [x] `rewrite-driver.cjs --dry-run` exits 0 and prints the writer as `opencode-go/hy4-flash-free#high`
- [x] The 20 pilot files in `../scratch/lists/pilot.txt` record `pass` in the driver state
- [x] `check_changelog_shape.py` fails no rule on a pilot rewrite that it did not fail on the original
- [x] `validate.sh --strict` on `001-layout-tooling-and-pilot` prints `RESULT: PASSED`
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
| Goal authored | Done | `check-goal.cjs` on this packet |
| Lists | Done | 11 lists, 1,576 lines, no path twice |
| Dry run | Done | `rewrite-driver.cjs --dry-run` prints `opencode-go/hy4-flash-free#high through opencode run` |
| Pilot | Done | 19 `pass` and 1 `unchanged`. `wave-verify.cjs` printed `"failures":0` and `"factMisses":0` |
| Shape check | Done | 6 pilot files fail `[checked-section]`, the same rule each original fails, and no other rule |

### Deviations and findings

| Item | Note |
|------|------|
| List count | The plan said 12 lists. Phases 002 to 012 are 11 phases, so there are 11 lists. The criterion now says 11 |
| Level labels | 860 spec-folder lines lost their (Level N) label by script before any rewrite, in commit `3c9cc2a3b59`, because the layout carries paths only. A script, not the model, made that change, so the fact lock never reads the dropped digit as a lost number |
| Layout lint | The shape checker does not check the layout itself, so `scratch/layout_lint.py` gates it outright: no bold outside a summary, an anchor on every H4, links that reach their anchor, an &nbsp; line before every H2, one source line per paragraph and bullet, plain bullets of at most two sentences, no H3 or rule line, and a glance table in an expanded entry |
| Fact checker | Devin's free `glm-5-2` checks each draft, a different model from the Hy4 writer |
| Verdict fallback | GLM hit its output cap on the 536-line `v4.0.0.0` and gave no verdict. The same draft is then checked once by Hy4, which used it 3 times in the pilot |
| Requeued pilot files | Two compact files written under the first compact rules turned paragraphs into lists. They were put back and run again under the new rules |
| Fact checker moved | Devin's daily quota ran out around 19:45 UTC on 2026-11-17, and its message did not match the limit pattern, so 61 drafts were checked by the Hy4 fallback, the writer's own model. The fact check now runs on `opencode/glm-5.3-flash-free#high`, with Devin's `glm-5-2` as its fallback and Hy4 never judging its own draft. `reverify.cjs` checks those 61 drafts again, and a failed one is restored and rewritten |
<!-- /ANCHOR:log -->
