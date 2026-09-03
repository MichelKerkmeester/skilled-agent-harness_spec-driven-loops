---
title: "Goal: Motion Layer"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/003-motion-layer"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive for both motions and the determinism proof"
    next_safe_action: "Capture a settled document dump for each of the nine files"
    blockers:
      - "Phase 002 has not closed, and motion shares stylesheets with the chrome rollout"
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-003-motion-layer"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which bar growth route survives a render on a stacked segment"
      - "What settle time the contract should name"
      - "Whether the reveal covers the axis labels or only the marks"
    answered_questions:
      - "Motion is authored in CSS so the existing motion rule can see it"
      - "No animation repeats, which is why the animated dash was rejected"
---
# Goal: Motion Layer

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Add the one second first-paint reveal and the half-second bar growth, both gated on the reduce-motion preference, and prove that two renders of one file still agree once the motion has settled.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Motion is authored in CSS. The corpus check reads the motion rule from stylesheet regions, so a script-driven animation would ship with no fallback and the check would report a pass |
| D2 | No animation repeats. An endless animation makes two renders of one file disagree by construction, which is the reason both lineages rejected the animated dash |
| D3 | Every animation settles to the same picture the file would have painted with no animation at all. That is what makes the reduce-motion fallback a removal rather than a different chart |
| D4 | The stagger delay comes from a mark index, never from a value in the data block. An index is geometry and a value is data |
| D5 | The gap in the motion rule is closed in this phase. A rule that has never fired on a real file is a claim, and this phase is the first file it would fire on |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` with `Summary: errors: 0`
- [ ] `grep -rl 'prefers-reduced-motion' .opencode/skills/sk-doc/sk-create-chart/assets/templates/` lists exactly nine files, and each fallback sets the animation to none
- [ ] Two renders of each of those nine files produce identical settled documents, recorded in `scratch/determinism.txt`
- [ ] The motion check printed `RESULT: FAILED` three times on scratch copies, once for a script animation with no fallback, once for a fallback that shortens rather than removes, and once for an animation that repeats
- [ ] `grep -rn 'Math.random\|Date.now\|new Date(' .opencode/skills/sk-doc/sk-create-chart/assets/` returns no match in rendering code
- [ ] `references/template-contract.md` names a settle time beside rule 13
- [ ] `validate.sh specs/sk-doc/053-chart-visual-overhaul/003-motion-layer --strict` prints `RESULT: PASSED`
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
| A6 reveal wipe on three time-series forms | Pending | Row table in `spec.md` |
| Bar growth on six bar forms | Pending | Row table in `spec.md` |
| Reduce-motion fallback on nine files | Pending | Row table in `spec.md` |
| Motion rule extended to script regions | Pending | Affected surfaces table in `plan.md` |
| Two-render determinism comparison | Pending | Affected surfaces table in `plan.md` |
| Settle time named in the contract | Pending | Task T004 in `tasks.md` |

### Deviations and findings

| Item | Note |
|------|------|
| The motion rule has never fired on a real file | `grep -rn '@keyframes\|animation:\|transition:'` over the corpus returns nothing today, so rule 13 has been satisfied by absence rather than by compliance |
| The motion rule cannot see a script-driven animation | The check reads stylesheet regions only. A `requestAnimationFrame` motion matches none of its patterns, so it would ship with no fallback and pass |
| Two bar forms have no baseline | A waterfall step floats and a progress bar runs against a goal. Both grow from their own anchor, and a falling step grows downward |
<!-- /ANCHOR:log -->
