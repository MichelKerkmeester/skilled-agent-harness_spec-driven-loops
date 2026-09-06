---
title: "Goal: every form can be judged without opening a browser"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/012-template-screenshots"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Rendered 75 screenshots across both canvas modes from a committed script"
    next_safe_action: "None open; coverage is checkable with --check on demand"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Goal: every form can be judged without opening a browser

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->

**Inherits the parent `goal.md`. Where this file and that one disagree, that one wins.**

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

Every template and example in the two canvas modes has a rendered picture beside it.

### Decisions

**A script, not hand-made images.** 75 pictures that cannot be regenerated are 75 pictures that rot
silently the first time a template changes.

**Beside `assets/`, not inside it.** Putting them under `assets/` swept all 75 into the leaf manifest
and grew the routable leaf set by two fifths. A leaf is something a mode loads into context; a picture
for a human to read is not one.

**The theme follows the host machine.** Chrome ignores the colour-scheme flags in headless capture.
Both themes are valid corpus output and each is validated on its own, so this is a documented property:
regenerate on the machine whose theme you want committed.

### Operator copy

36 chart and 39 diagram screenshots, regenerable in one command, with a coverage check.
<!-- /ANCHOR:directive -->

<!-- ANCHOR:binding -->
## 2. BINDING

1. Let the entry animation settle before capturing. A half-drawn chart reads as a broken template.
2. Retry a spawn once. A real failure repeats; a lost race does not.
3. Keep the images out of the leaf surface, and verify the leaf hash is unchanged.
4. Modify no template to make it render better.
<!-- /ANCHOR:binding -->

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

| # | Criterion | How it is proven |
|---|-----------|------------------|
| 1 | Full coverage | `--check` reports 0 missing for both modes |
| 2 | Regenerable | One committed script, one command per mode |
| 3 | Not routable | Leaf manifest hash unchanged by the addition |
| 4 | Settled frames | A sampled chart shows bars at full height and a rendered table |
<!-- /ANCHOR:completion -->

<!-- ANCHOR:log -->
## 4. LOG

### Progress

Done. 36 chart and 39 diagram screenshots; leaf hash unchanged at ec5c48a2ca9a.

### Deviations and findings

- **Putting the output under `assets/` was wrong and was caught by a gate.** The leaf manifest grew
  from 181 to 256 with 75 PNG leaves. Moving them beside `assets/` returned the hash to exactly what it
  was before.
- **Chrome ignores every colour-scheme flag in headless capture.** `--force-prefers-color-scheme`,
  `--blink-settings=preferredColorScheme` and `--headless=new` all produced byte-identical output on a
  dark-mode host. Documented rather than worked around.
- **One file failed on the first pass and rendered fine on retry.** The corpus checker already
  documents this spawn race and guards against it; the renderer now carries the same bounded retry.
- **Charts needed a settle budget.** Verified by reading a rendered frame rather than trusting the
  flag: bars at full height, labels placed, data table present.
<!-- /ANCHOR:log -->
