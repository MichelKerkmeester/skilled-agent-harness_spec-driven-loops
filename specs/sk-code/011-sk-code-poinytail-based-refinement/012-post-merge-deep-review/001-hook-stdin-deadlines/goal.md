---
title: "Goal: Phase 1: hook-stdin-deadlines"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hook stdin deadlines goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/001-hook-stdin-deadlines"
    last_updated_at: "2026-10-10T21:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reran every completion criterion from the final state"
    next_safe_action: "Commit the child"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-012-001-hook-stdin-deadlines"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: hook-stdin-deadlines

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every registered stdin reader a real host can hang a deadline through the existing shared reader, and record why each other reader needs none.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The three hooks import `readStdin` from `.skilled/hooks/shared/hook-adapter-shared.cjs` and keep its 3000 ms default. No new reader is written. |
| D2 | Each hook family gets one spawn test that holds stdin open and fails before the fix. |
| D3 | `sk-git` moves to 1.8.1.0 and `sk-vision` to 0.3.1.0, each in SKILL.md, README.md and a new changelog. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs` prints `pass 2` and `fail 0`.
- [ ] `node --test .skilled/skills/sk-vision/hooks/devin/sk-vision-devin.test.mjs` prints `pass 8` and `fail 1`, and the failing case is `resolves a built entry that exports what the adapter calls`.
- [ ] `node --test .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.test.mjs` prints `pass 7` and `fail 0`.
- [ ] `rg -n 'for await \(const chunk of process.stdin\)' .skilled/skills/sk-git/scripts/hooks .skilled/skills/sk-vision/hooks` prints nothing.
- [ ] `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS: 70 Hermes skill copies in sync`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/001-hook-stdin-deadlines --strict` prints `RESULT: PASSED`.
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
| sk-git deadline test | Passed | `pass 2`, `fail 0`, before the fix `fail 2` |
| sk-vision suite | Passed | `pass 8`, `fail 1`, the build-dependent case |
| Preflight advisory suite | Passed | `pass 7`, `fail 0` |
| No for-await reader left | Passed | `rg` printed nothing |
| Hermes copies | Passed | `PASS: 70 Hermes skill copies in sync` |
| Strict validation | Passed | `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Inline briefs replaced | The first hook briefs asked for an inline reader. They were stopped before any finished and replaced with import briefs. One stopped build had already rewritten `sk-vision.mjs`, which was restored from HEAD before its replacement ran |
| Test moved 2026-10-11 | The remediation review found `stdin-deadline.test.mjs` passed on the unfixed preflight hook when a kill-switch was set. Phase 007 moved both sk-git cases and the Devin case into `.skilled/hooks/shared/hook-stdin-deadline.test.mjs`, which strips every kill-switch, and deleted the file, so criterion 1 is now checked by that suite |
| Trigger index | Rebuilt once after all five phases, as the repository's own rebuild commits do, because the index reads every doc on disk |
<!-- /ANCHOR:log -->
