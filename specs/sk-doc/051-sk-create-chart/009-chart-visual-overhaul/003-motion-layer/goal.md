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
    packet_pointer: "sk-doc/051-sk-create-chart/009-chart-visual-overhaul/003-motion-layer"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Shipped both motions, closed the motion-rule gap, proved the settled state"
    next_safe_action: "Start phase 004 on a corpus whose render path compares pictures as well as documents"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-003-motion-layer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Motion is authored in CSS so the existing motion rule can see it"
      - "No animation repeats, which is why the animated dash was rejected"
      - "The transform route survives a stacked segment and the clip route does not, because a clip resolves against each segment's own box"
      - "One second, made true by capping the stagger rather than letting it accumulate"
      - "The reveal covers the whole figure, because a wipe that leaves the axis standing reads as a chart drawn on top of a chart"
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

- [x] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` with `Summary: errors: 0`
- [x] `grep -rl 'prefers-reduced-motion' .opencode/skills/sk-doc/sk-create-chart/assets/templates/` lists exactly nine files, and each fallback sets the animation to none
- [x] Two renders of each of those nine files produce identical settled documents, recorded in `scratch/determinism.txt`
- [x] The motion check printed `RESULT: FAILED` three times on scratch copies, once for a script animation with no fallback, once for a fallback that shortens rather than removes, and once for an animation that repeats
- [x] `grep -rn 'Math.random\|Date.now\|new Date(' .opencode/skills/sk-doc/sk-create-chart/assets/` returns no match in rendering code
- [x] `references/template-contract.md` names a settle time beside rule 13
- [x] `validate.sh specs/sk-doc/051-sk-create-chart/009-chart-visual-overhaul/003-motion-layer --strict` prints `RESULT: PASSED`
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
| A6 reveal wipe on three time-series forms | Done | A one second `clip-path: inset()` wipe on the eased curve, not the mask element the plan described. A mask needs a group the drawing code does not build |
| Bar growth on six bar forms | Done | Half a second, cubic-out, staggered by a mark index and capped at half a second of stagger so the file settles inside one second whatever the reader types into it |
| Reduce-motion fallback on nine files | Done | Nine files, nine `animation: none` fallbacks, and none of the other eleven forms carries one it does not need |
| Motion rule extended to script regions | Done, wider than planned | It reads the stylesheet, the drawing code and the markup, and it also rejects a fallback that shortens and an animation that repeats |
| Two-render determinism comparison | Done, stronger than planned | `settled-render` compares the picture as well as the document, because a stylesheet animation never touches the DOM and a document comparison cannot see it |
| Settle time named in the contract | Done | One second beside rule 13, with the reason rule 12 needs a number to be checkable |
| Every settled render matched its pre-motion control | Done | Nine files, byte-identical before and after, which is the proof that removing the motion removes nothing |

### Deviations and findings

| Item | Note |
|------|------|
| The motion rule has never fired on a real file | Closed. It now has five red runs behind it, three on the rule itself and two on the rendered check this phase added |
| The motion rule cannot see a script-driven animation | Closed, and wider than the entry described. Script was one of three routes a file can move by, and reading only one of the other two would have left the same hole behind a different door |
| Two bar forms have no baseline | Handled. A waterfall rise climbs from the total below it, a fall hangs from the total above it, and a progress bar grows from the left edge of its track |
| The document comparison the plan proposed proves almost nothing on its own | A stylesheet animation never touches the DOM, so two dumps of a file still visibly moving are identical. The comparison now reads the painted picture too, and the picture is the half that catches a motion which has not settled |
| A bare `setTimeout` is not treated as motion | It is a one-shot delay far more often than an animation loop, and demanding a reduce-motion guard around a deferred measurement fires on correct code. The rendered comparison covers the residual, and the code comment says so |
| `grouped-bars` first took its stagger index from the data block | `i * d.values.length + s` reads a name defined between the `CHART_DATA` sentinels. It became a running draw counter when AC-003 was checked, which is what that row exists to catch |
| A stale-artifact hole in the new render code | `openOnce` wrote to a fixed screenshot path, so a browser dying without writing would have left the previous file's picture to be compared. The target is deleted before each open now |
| One run failed and would not reproduce | It followed two heavy `--render` passes in one shell, and the filter around it hid which check failed. Five clean runs since, including a replay of the exact sequence. A browser launch timing out under load is the likely cause, and that is inferred rather than observed |
<!-- /ANCHOR:log -->
