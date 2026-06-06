# Iteration 5: Gold↔map + prompt-source reconciliation

## Focus

I chose **gold↔map reconciliation**, expanded to include prompt-source drift, because iteration #4 already showed the assets seam changes D2 honesty but not current deterministic D3. The remaining high-value question is whether SD-001 and CS-001 are low because `RESOURCE_MAP` is genuinely missing behavior-critical coverage, or because the benchmark gold/prompt/scorer is measuring the wrong thing.

## Actions Taken

- Read round-1 synthesis baseline: `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/011-sk-code-routing-efficiency-remediation/research/research.md:21-33`, `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/011-sk-code-routing-efficiency-remediation/research/research.md:83-85`.
- Read SD-001 scenario gold: `.opencode/skills/sk-code/manual_testing_playbook/01--surface-detection/webflow-detection.md:18-23`, `.opencode/skills/sk-code/manual_testing_playbook/01--surface-detection/webflow-detection.md:29-51`.
- Read CS-001 per-feature gold: `.opencode/skills/sk-code/manual_testing_playbook/07--cross-stack-routing/webflow-plus-motion-dev.md:16-18`, `.opencode/skills/sk-code/manual_testing_playbook/07--cross-stack-routing/webflow-plus-motion-dev.md:34-58`.
- Read root playbook rows for prompt drift: `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:181`, `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:260`.
- Read router contract and machine map: `.opencode/skills/sk-code/references/smart_routing.md:109-126`, `.opencode/skills/sk-code/references/smart_routing.md:141-163`, `.opencode/skills/sk-code/references/smart_routing.md:309-324`, `.opencode/skills/sk-code/references/smart_routing.md:326-407`, `.opencode/skills/sk-code/references/smart_routing.md:450-459`.
- Read parser/scorer/router code: `.opencode/skills/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:81-88`, `.opencode/skills/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:121-154`, `.opencode/skills/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:24-29`, `.opencode/skills/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:52-60`, `.opencode/skills/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:94-118`, `.opencode/skills/deep-improvement/scripts/skill-benchmark/router-replay.cjs:146-162`, `.opencode/skills/deep-improvement/scripts/skill-benchmark/router-replay.cjs:209-255`.
- Read current reports: `.opencode/skills/sk-code/benchmark/router-final/skill-benchmark-report.json:18-39`, `.opencode/skills/sk-code/benchmark/router-final/skill-benchmark-report.json:195-226`, `.opencode/skills/sk-code/benchmark/router-final/skill-benchmark-report.json:687-718`, `.opencode/skills/sk-code/benchmark/live-remediated/skill-benchmark-report.json:18-39`, `.opencode/skills/sk-code/benchmark/live-remediated/skill-benchmark-report.json:73-138`, `.opencode/skills/sk-code/benchmark/live-remediated/skill-benchmark-report.json:306-370`.
- Read live and D4 measurement harnesses: `.opencode/skills/deep-improvement/scripts/skill-benchmark/live-executor.cjs:15-19`, `.opencode/skills/deep-improvement/scripts/skill-benchmark/live-executor.cjs:149-168`, `.opencode/skills/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:4-16`, `.opencode/skills/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:35-52`, `.opencode/skills/sk-code/benchmark/live-final/d4-ablation.json:1-28`.

## Findings

1. Current deterministic SD-001/CS-001 low recall is still real in the checked-in router report, but it is not one uniform failure. SD-001 scores D2 `0.4545454545`, D3 `0.8333333333`, routed `6`, wasted `1` (`router-final/skill-benchmark-report.json:195-215`); CS-001 scores D2 `0.2`, D3 `0.2857142857`, routed `7`, wasted `5` (`router-final/skill-benchmark-report.json:687-704`). The aggregate deterministic report remains D2 `44`, D3 `33` (`router-final/skill-benchmark-report.json:28-34`).

2. CS-001 has a benchmark prompt-source artifact. The loader prefers the per-feature fenced prompt over the root table prompt (`load-playbook-scenarios.cjs:81-88`, `load-playbook-scenarios.cjs:121`), but the per-feature CS-001 prompt says “pinned Motion CDN pattern and in-view animation snippet” (`webflow-plus-motion-dev.md:16-18`) while the root table prompt says “motion.dev animations” (`manual_testing_playbook.md:260`). That matters because `MOTION_DEV` intent only matches `motion.dev`, `motion-dev`, `animate()`, `inview`, `scroll()`, or `cross-stack animation` (`smart_routing.md:318`), not `Motion CDN`, hyphenated `in-view`, or `snippet`.

3. CS-001’s current deterministic D2/D3 can be reproduced from the prompt artifact. With the per-feature prompt, the only obvious machine intent match is `DEPLOYMENT` via `cdn` (`smart_routing.md:315`), which routes the default preamble plus Webflow deployment refs (`smart_routing.md:302-307`, `smart_routing.md:378-382`). The CS-001 expected reference set is Webflow implementation/verification plus Motion.dev refs (`webflow-plus-motion-dev.md:34-45`), so only `references/stack_detection.md` and `references/smart_routing.md` hit; the scorer’s set recall and D3 formulas then yield `2/10 = 0.20` D2 and `1 - 5/7 = 0.2857` D3 (`score-skill-benchmark.cjs:24-29`, `score-skill-benchmark.cjs:94-118`). This is a measurement artifact unless the per-feature prompt is considered the authoritative real task.

4. Using the root CS-001 prompt would improve the deterministic metric without proving a router improvement. The root prompt’s `motion.dev` token would fire `MOTION_DEV` (`manual_testing_playbook.md:260`, `smart_routing.md:318`), adding `quick_start`, `animate_and_timelines`, `scroll_and_gestures`, `integration_patterns`, and `decision_matrix` (`smart_routing.md:399-404`). Against the current CS-001 gold, that would add three expected hits (`quick_start`, `integration_patterns`, `scroll_and_gestures`) and change the computed deterministic row from D2 `0.20` to about `0.50`, and D3 from `0.2857` to about `0.4167`. That gain is mostly benchmark reconciliation unless the same synonyms are added for the real per-feature wording.

5. SD-001 is a genuine intent-signal coverage gap. The prompt contains `Add`, `Lenis`, `smooth-scroll`, `gated`, and `IntersectionObserver` (`webflow-detection.md:18-23`), but `IMPLEMENTATION` does not include `add`, `gate`, `gated`, `IntersectionObserver`, or `smooth-scroll` (`smart_routing.md:310`), while `ANIMATION` does include `lenis` (`smart_routing.md:317`). That explains why the router can load the animation guide but miss `observer_patterns.md` and `webflow_patterns.md`, both expected by gold (`webflow-detection.md:35-37`) and behavior-relevant to the desired outcome (`webflow-detection.md:51`).

6. SD-001 gold also exposes a map/prose contradiction that must be reconciled before treating D3 headroom as “real.” The prose says any WEBFLOW surface detection MUST load an implementation trio and explicitly cites SD-001-style partial coverage (`smart_routing.md:118-126`), but the route-time rule says the first slice loads only matched intents plus universal and Motion overlay (`smart_routing.md:452-457`). The machine map puts implementation-heavy refs under `IMPLEMENTATION` (`smart_routing.md:327-335`) while `ANIMATION` contains only `animation_workflows.md` and `swiper_patterns.md` (`smart_routing.md:395-397`). Build-ready interpretation: either implement the always-on Webflow implementation baseline and accept a D3 cost, or remove/relax that prose/gold expectation.

7. SD-001’s language/style gold is probably overbroad or underspecified. The scenario targets `src/2_javascript/scroll.js` (`webflow-detection.md:22`) and expects JavaScript style/quality plus CSS style and cross-language rules (`webflow-detection.md:38-41`). The prose has a Webflow per-language overlay for JavaScript targets (`smart_routing.md:128-135`), but the current route-time rule says Webflow has no language sub-slice and legitimately spans CSS, HTML, and JavaScript (`smart_routing.md:459`). That makes the D2 target ambiguous: CSS style-guide recall could be a gold-authoring artifact, not a useful first-slice requirement.

8. Live-remediated scores are not a clean proof that the router solved CS-001. The live report scores CS-001 D2 `1`, D3 `0.6667`, routed `15`, wasted `5` (`live-remediated/skill-benchmark-report.json:306-323`), but the live executor states that “model’s STATED routing is the primary discovery signal” because there is no startup resource manifest (`live-executor.cjs:15-19`, `live-executor.cjs:160-162`). The same report’s observed reads include broad `references/**/*.md`, `assets/**/*.md`, and `assets/motion_dev/snippets/*` globs (`live-remediated/skill-benchmark-report.json:362-367`). Therefore live D3 may undercount actual exploration cost; exact token/tool cost to first expected resource is UNKNOWN from the stored report.

9. D4 cannot resolve the reconciliation yet. The D4 harness is explicitly approximate because skill-off is simulated via hook suppression and contamination checks (`d4-ablation.cjs:4-16`), and the checked-in D4 artifact has only two rows: LS-001 skill-on hurts (`0.82` vs `0.95`) while CS-001 skill-on helps (`0.88` vs `0.78`) (`live-final/d4-ablation.json:1-28`). Until CS/SD gold and prompt drift are fixed, D4 may be grading broad manual discovery rather than the intended first-slice routing behavior.

## Implications for D3/D4

For D3, the next concrete lever is **not another global slice reduction**. The highest-value build is a reconciliation pass with two outputs: fix benchmark artifacts, then make targeted signal/map changes.

Measurement-artifact gains:
- Align CS-001 prompt source. Either make the per-feature prompt include the root-table `motion.dev` wording, or make the root and per-feature prompts identical. This can raise deterministic CS-001 D2 from `0.20` toward `0.50` without changing production behavior, so it must be reported as benchmark cleanup.
- Decide whether SD-001’s CSS/style gold belongs in first-slice gold, deferred gold, or D4-only usefulness gold. Removing overbroad gold would improve D2/D3 reports but is not a user-facing router improvement.

Real behavior gains:
- Add targeted intent synonyms: `gate`, `gated`, `IntersectionObserver`, `smooth-scroll`, and `initializer` should trigger Webflow implementation/observer coverage for SD-001; `Motion CDN`, `in-view`, `in-view animation`, and `snippet` should trigger `MOTION_DEV` for CS-001.
- Concern-gate `cdn`: in a Webflow + Motion context, bare `cdn` currently points at Webflow deployment refs, but CS-001 needs Motion install/API refs. A `Motion CDN` signal should prefer `MOTION_DEV` rather than broad Webflow deployment.
- Resolve the Webflow implementation-trio contradiction. If the trio is always loaded, SD recall becomes more honest but D3 will worsen because more first-slice refs are loaded. If it is not always loaded, update prose/gold and score only matched-intent resources.

Expected magnitude:
- CS-001 prompt reconciliation alone gives a deterministic measurement lift of about D2 `+30` points for that row and D3 `+13` points for that row, but this is mostly artifact unless paired with synonym support for the actual per-feature wording.
- SD-001 synonym support likely lifts D2 but may reduce D3, because adding implementation/observer coverage increases routed count. That is a real D4-oriented tradeoff, not pure D3 improvement.
- Live D3 `50` is directionally useful but not a hard cost metric until actual tool/read/glob budget is scored instead of only stated resources.

For D4, the concrete lever is to grade **task outcome plus discovery cost** after reconciliation:
- Outcome rubric: does the answer use the correct gate/snippet/install pattern, not just list the right file path?
- Cost rubric: count actual read/glob breadth and time-to-first expected source from live events, because broad `references/**/*.md` discovery can look useful while still being D3 waste.
- A strong third routine scenario is SD-001-shaped: a routine Webflow JS edit requiring Lenis plus an IntersectionObserver gate. It tests whether the skill helps apply a small behavior pattern without dragging in broad CSS/OpenCode/Motion material.

## What's still unexplored

- Concern-level / phase-gated slicing remains unresolved after this pass. SD-001 shows wrong-concern waste (`swiper_patterns.md`) and possible missing observer/implementation concern, but I did not inspect a full cross-scenario concern taxonomy.
- D4 instrumentation still needs a real design pass: grader rubric, actual event-cost extraction, contamination policy, and the synthetic third routine scenario.
- The exact live D3 artifact magnitude is UNKNOWN because stored reports do not preserve full stated JSON plus actual token/read cost in a directly scored form.
- The asset lane remains unresolved after gold reconciliation: assets are behavior-relevant, but this iteration did not re-open the expectedAssets scoring seam beyond confirming it interacts with D4.
