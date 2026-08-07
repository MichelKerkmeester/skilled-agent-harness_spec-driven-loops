# Animation Mining Analysis

## Source Read

Mined source repo: `/tmp/web-motion-skill`, cloned from `https://github.com/Schmandarine/web-motion-skill`.

Source files read:

| File | Relevant evidence |
|---|---|
| `/tmp/web-motion-skill/SKILL.md` | Defines the skill as a vision plus judgment loop, with Playwright/ffmpeg recording, frame extraction, contact sheets, and Disney's 12 principles adapted for web animation. |
| `/tmp/web-motion-skill/README.md` | Repeats the 12 web-adapted principles, timing ranges, contact-sheet workflow, setup model, and script purpose table. |
| `/tmp/web-motion-skill/scripts/analyze.sh` | One-shot scroll recording plus frame extraction wrapper that writes `/tmp/web-motion-<timestamp>/frames`. |
| `/tmp/web-motion-skill/scripts/record-playwright.mjs` | Headless Chromium auto-scroll recording using Playwright at 1440x900. |
| `/tmp/web-motion-skill/scripts/extract-frames.sh` | ffmpeg-based video-to-frame extraction at a default 25fps. |
| `/tmp/web-motion-skill/scripts/contact-sheet.sh` | Builds a labelled 6x4 contact sheet from extracted frames for timeline review. |
| `/tmp/web-motion-skill/scripts/record-ffmpeg-macos.sh` | Manual macOS screen recording for hover/click/manual flows. |
| `/tmp/web-motion-skill/scripts/record-ffmpeg-linux.sh` | Manual Linux screen recording for hover/click/manual flows. |
| `/tmp/web-motion-skill/scripts/doctor.sh` | Dependency check for node, ffmpeg, Playwright, Chromium, and optional GSAP skills. |
| `/tmp/web-motion-skill/scripts/setup.sh` | Consent-based dependency install flow for ffmpeg, Playwright, Chromium, and `.installed` marker. |

## What web-motion-skill Genuinely Offers

| Offering | Concrete source evidence | Portable value for sk-code |
|---|---|---|
| Vision loop | `SKILL.md` says the skill records the page, extracts frames at 25fps, builds a labelled contact sheet, and reasons frame-by-frame. `README.md` explains reading the contact sheet, then drilling into frames such as `f64` to `f80`. | Add a Motion.dev visual-verification recipe for timing/easing/trajectory diagnosis when normal browser screenshots are not enough. Do not vendor scripts because they are Claude/GSAP-oriented and setup-heavy. |
| Web-adapted 12 principles | `SKILL.md` and `README.md` list Slow In/Slow Out, Anticipation, Follow Through/Stagger, Squash & Stretch, Staging, Secondary Action, Timing, Exaggeration, Arc, Depth, Pose-to-Pose, and Appeal. | Add a cross-stack design-principles reference translated to Motion.dev APIs. |
| Timing table | `SKILL.md` and `README.md` define 100-150ms immediate feedback, 200-300ms UI transitions, 400-600ms meaningful transitions, and 600ms+ emphasis/storytelling. | Add as a Motion.dev timing vocabulary because current sk-code has narrower Webflow timing ranges and scattered snippet durations. |
| Easing guidance | `SKILL.md` frames easing as the transfer function from linear scroll input to natural perceived motion and gives `power2.inOut`, `power3`, `power4`, `elastic.out`, `back.out`. | Translate to Motion-compatible cubic-bezier arrays and spring/back-style ranges without copying GSAP API recommendations as primary guidance. |
| Stagger direction | `SKILL.md` recommends offset start times, `stagger: 0.08`, reversed `stagger: -0.12`, incoming reversed and outgoing forward for scroll-scrubbed patterns. | Add Motion.dev `stagger()` guidance with `from: "last"` or `from: "first"`, plus offset ranges. |
| Anticipation/exaggeration ranges | `SKILL.md` gives subtle anticipation ranges of 0.05-0.1 scale and 3-8deg rotation, and playful overshoot of 10-15%. | Add numeric guardrails for when a Motion.dev sequence should include preparatory scale/rotation or spring/back overshoot. |
| Arc/depth language | `SKILL.md` says diagonal motion should curve by varying x/y timing/easing and depth can be simulated with parallax, perspective, rotateX/Y, shadows, z-index, and scale. | Add design-level guidance missing from existing API docs. |
| Safety rules | `SKILL.md` covers overflow-x, box-sizing, GSAP `from`, and percent transform pitfalls. | Mostly duplicate or GSAP-specific relative to sk-code's existing performance/layout references. |

## What sk-code Already Covers

| Existing sk-code coverage | Files read |
|---|---|
| CSS-first vs Motion.dev decision tree and Webflow animation implementation patterns | `.opencode/skills/sk-code/references/webflow/implementation/animation_workflows.md`; `.opencode/skills/sk-code/references/motion_dev/decision_matrix.md` |
| Motion install modes, CDN/global/ESM, and guarded initialization | `.opencode/skills/sk-code/references/motion_dev/quick_start.md`; `.opencode/skills/sk-code/references/motion_dev/integration_patterns.md`; snippet bootstraps in `assets/motion_dev/snippets/` |
| `animate()`, sequences, timeline segment timing, options, mini/hybrid import choice | `.opencode/skills/sk-code/references/motion_dev/animate_and_timelines.md`; `timeline_sequence.js` |
| `scroll()`, `inView()`, hover/press gestures, drag-adjacent local examples | `.opencode/skills/sk-code/references/motion_dev/scroll_and_gestures.md`; `animate_on_scroll.js`; `in_view_reveal.js`; `hover_gesture.js` |
| Performance, reduced motion, transform/opacity, layout-thrashing avoidance, bundle posture, CWV risk | `.opencode/skills/sk-code/references/motion_dev/performance_and_pitfalls.md`; `.opencode/skills/sk-code/references/webflow/implementation/animation_workflows.md` |
| Browser verification, DevTools/MCP/bdg screenshots, performance metrics, multi-viewport checks | `.opencode/skills/sk-code/references/webflow/verification/verification_workflows.md`; `.opencode/skills/sk-code/references/webflow/implementation/animation_workflows.md` |
| Basic timing/easing/stagger examples | `.opencode/skills/sk-code/references/webflow/implementation/animation_workflows.md`; `.opencode/skills/sk-code/references/motion_dev/animate_and_timelines.md`; `stagger_animation.js`; `spring_animation.js` |

## Delta Table

| Candidate concept | Already in sk-code? Which ref | Verdict | Target file |
|---|---|---|---|
| Web-adapted 12 principles as a design diagnostic layer | Not as a Motion.dev reference. Webflow has CSS-first implementation rules, but not a principles vocabulary. | ADDITIVE | `.opencode/skills/sk-code/references/motion_dev/animation_principles.md` |
| Easing as perceived-physics transfer function for linear scroll/input | Partly in Webflow easing snippets and Motion API docs, but not the principle or selection vocabulary. | ADDITIVE | `.opencode/skills/sk-code/references/motion_dev/animation_principles.md` |
| Duration ladder: 100-150ms, 200-300ms, 400-600ms, 600ms+ | Partly covered by Webflow timing table with 150-250ms, 200-400ms, 400-600ms, 200-300ms exit. | FOLD-IN | `.opencode/skills/sk-code/references/motion_dev/animation_principles.md` |
| Motion.dev `stagger()` direction and offsets for incoming/outgoing groups | Existing docs show stagger APIs and 100ms examples, but not direction intent or incoming/outgoing guidance. | ADDITIVE | `.opencode/skills/sk-code/references/motion_dev/animation_principles.md`; `assets/motion_dev/snippets/principled_reveal.js` |
| Anticipation ranges: 0.05-0.1 scale, 3-8deg rotation | Not present. Existing snippets include hover scale and press scale but not anticipation ranges or when to apply them. | ADDITIVE | `.opencode/skills/sk-code/references/motion_dev/animation_principles.md`; `assets/motion_dev/snippets/principled_reveal.js` |
| Exaggeration/overshoot ranges: 10-15%, large scatter rotation | Spring snippet exists, but no design guardrail for overshoot personality. | ADDITIVE | `.opencode/skills/sk-code/references/motion_dev/animation_principles.md` |
| Arc and depth | Not covered beyond generic transform/parallax/performance notes. | ADDITIVE | `.opencode/skills/sk-code/references/motion_dev/animation_principles.md` |
| Pose-to-pose vs straight-ahead | Decision matrix covers CSS/Motion/WAAPI/GSAP tool choice, not this design framing. Useful but small. | FOLD-IN | `.opencode/skills/sk-code/references/motion_dev/animation_principles.md` |
| Motion language consistency / appeal | Not present as a standards vocabulary. | ADDITIVE | `.opencode/skills/sk-code/references/motion_dev/animation_principles.md` |
| Frame/contact-sheet visual verification | Existing Webflow verification covers browser screenshots, performance metrics, and watching animation, but not labelled frame extraction/contact-sheet timing review. | FOLD-IN | `.opencode/skills/sk-code/references/motion_dev/performance_and_pitfalls.md` |
| Source scripts vendoring | Existing sk-code uses bdg/Chrome DevTools workflows; source scripts are Claude-path-specific and setup-heavy. | DUPLICATE / DO NOT ADD | None |
| GSAP-specific official skill pairing | sk-code Motion.dev surface is not GSAP-owned and already has a GSAP comparison in the decision matrix. | DUPLICATE / DO NOT ADD | None |
| Safety rules: overflow-x, box-sizing, GSAP `from`, percent transforms | Mostly covered by Webflow CSS/performance guidance or GSAP-specific. | DUPLICATE / DO NOT ADD | None |

## Recommendation

Add only these artifacts:

| Artifact | Why it is additive |
|---|---|
| `.opencode/skills/sk-code/references/motion_dev/animation_principles.md` | Gives sk-code a missing Motion.dev design-principles layer: easing/timing/stagger/anticipation/overshoot/arc/depth/consistency. Existing docs explain APIs and performance; this explains what motion should feel like and how to diagnose it. |
| `.opencode/skills/sk-code/assets/motion_dev/snippets/principled_reveal.js` | Demonstrates a combined, principle-driven Motion.dev sequence. Existing snippets cover individual APIs, but none combine anticipation, principled timing, stagger direction, and reduced-motion fallback. |
| Small section in `.opencode/skills/sk-code/references/motion_dev/performance_and_pitfalls.md` | Adds the source repo's frame/contact-sheet verification method as an escalation recipe for subtle timing/easing bugs, without copying or running the source scripts. |
| Router wiring in `.opencode/skills/sk-code/references/smart_routing.md` | Required so `animation_principles.md` and the new snippet are reachable in both §5 and §11 router projections. |

Do not add source scripts or GSAP examples. Translate all mined guidance into Motion.dev API vocabulary and preserve MIT attribution in each mined artifact.
