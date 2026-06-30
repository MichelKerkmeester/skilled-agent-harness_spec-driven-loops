# Animation Mining Integration

## Files Created

| Path | Purpose |
|---|---|
| `_animation-mining/ANALYSIS.md` | Additive-delta analysis of `Schmandarine/web-motion-skill` versus current sk-code Motion.dev/Webflow coverage. |
| `_animation-mining/INTEGRATION.md` | Human-review integration guide for this change. |
| `.opencode/skills/sk-code/references/motion_dev/animation_principles.md` | New Motion.dev design-principles reference for timing, easing, stagger direction, anticipation, overshoot, arc, depth, and visual review. |
| `.opencode/skills/sk-code/assets/motion_dev/snippets/principled_reveal.js` | New principle-driven Motion.dev snippet composing anticipation, timing vocabulary, stagger direction, and reduced-motion fallback. |

## Files Modified

| Path | Change |
|---|---|
| `.opencode/skills/sk-code/assets/motion_dev/snippets/README.md` | Updated code-file count from 9 to 10 and added `principled_reveal.js` to the structure table. |
| `.opencode/skills/sk-code/references/motion_dev/performance_and_pitfalls.md` | Added a frame-level visual verification escalation recipe for timing/easing/trajectory defects. |
| `.opencode/skills/sk-code/references/smart_routing.md` | Added principle/easing/stagger route keywords and mapped the new reference/snippet in both §5 and §11. |
| `.opencode/skills/sk-code/references/webflow/implementation/animation_workflows.md` | Added a cross-link to the new Motion.dev principles reference in the Motion.dev integration list. |

## Router Additions

### §5 MOTION_DEV MAP

Added to `ANIMATION / MOTION_DEV`:

```text
references/motion_dev/animation_principles.md
assets/motion_dev/snippets/principled_reveal.js
```

Updated `PERFORMANCE` row text to state that `references/motion_dev/performance_and_pitfalls.md` includes frame-level visual verification for subtle timing/easing defects.

Added `references/motion_dev/animation_principles.md` to the explicit non-Webflow Motion.dev peer-resource list.

### §11 MACHINE-READABLE ROUTER

Added route keywords:

```text
ANIMATION: animation, easing, stagger, motion principles, motion language
MOTION_DEV: stagger(), animation principles
```

Added to `RESOURCE_MAP["MOTION_DEV"]`:

```text
references/motion_dev/animation_principles.md
assets/motion_dev/snippets/principled_reveal.js
```

`RESOURCE_MAP["PERFORMANCE"]` already contained `references/motion_dev/performance_and_pitfalls.md`, so the frame-level verification fold-in remains reachable through the existing performance mapping.

## MIT Attribution Placement

| Artifact | Attribution placement |
|---|---|
| `.opencode/skills/sk-code/references/motion_dev/animation_principles.md` | Line near top after the intro: `Attribution: Adapted from Schmandarine/web-motion-skill (MIT)...` |
| `.opencode/skills/sk-code/assets/motion_dev/snippets/principled_reveal.js` | Header JSDoc `@source Adapted from Schmandarine/web-motion-skill (MIT)...` |
| `.opencode/skills/sk-code/references/motion_dev/performance_and_pitfalls.md` | Line near top after the intro: `Attribution: Frame-level visual verification guidance...` |

## Router Drift Expectation

The new routable reference and snippet are reachable under `RESOURCE_MAP["MOTION_DEV"]`, and the performance fold-in stays reachable under `RESOURCE_MAP["PERFORMANCE"]`. Expected result: `sk-code-router-sync.vitest.ts` should stay green because every new Motion.dev `references/` or `assets/` artifact added here is mapped under at least one router cell.

Verification run in this worktree:

| Command | Result |
|---|---|
| `npx --no-install vitest run skill-benchmark/tests/sk-code-router-sync.vitest.ts` from `.opencode/skills/deep-improvement/scripts` | Passed: 1 file, 4 tests. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/sk-code` | Passed with 0 errors and 4 non-blocking warnings in existing shell hook/checker scripts. |
| `node --check .opencode/skills/sk-code/assets/motion_dev/snippets/principled_reveal.js` | Passed. |
| `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh .opencode/skills/sk-code/assets/motion_dev/snippets/principled_reveal.js` | Passed. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/104-sk-code-animation-mining --strict` | Could not run: `ERROR: Folder not found: .opencode/specs/skilled-agent-orchestration/z_archive/104-sk-code-animation-mining`. No `.opencode/specs/**/129-*` folder exists in this isolated worktree. |

Resolved verification note: invoking `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` through `bash` fails because the file has Python content and a Python shebang despite the `.sh` name. Rerunning it with `python3` passed.

## Banned Operations Skipped

No banned operation was executed. Source scripts were read but not run or vendored. In particular, `scripts/contact-sheet.sh` contains an `rm -rf` trap and `scripts/setup.sh` can run `npm install`; both are incompatible with this task's banned-operation list, so the workflow was documented as a recipe instead of executed.
