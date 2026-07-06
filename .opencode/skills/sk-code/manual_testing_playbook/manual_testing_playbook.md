---
title: "sk-code: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the sk-code skill."
version: 3.5.0.16
---

# sk-code: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live sk-code skill — no mocks, no stubs, no "unautomatable" verdicts. Scenarios verify the AI's actual routing behavior: which surface it detects, which references/assets it loads, which agent it dispatches. Acceptable verdicts are PASS, PARTIAL, FAIL, or SKIP (with a documented sandbox blocker).

This document combines the full manual-validation contract for the `sk-code` skill into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide. Per-feature files provide the deeper execution contract for each scenario, including the user request, expected detection markers, expected resource loading paths, and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern. The root document acts as the directory, review surface, and orchestration guide; per-feature execution detail lives in the numbered category folders at the playbook root.

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--surface-detection/`
- `02--language-sub-detection/`
- `03--routing-disambiguation/`
- `04--skill-advisor-integration/`
- `05--motion-dev-and-animation-regression/`
- `06--cross-browser-and-performance-gates/`
- `07--cross-stack-routing/`
- `08--design-restraint/`
- `09--tooling-and-hooks/`

---

## 1. OVERVIEW

This playbook provides 29 deterministic scenarios across 9 categories validating the `sk-code` skill surface. Each feature keeps its stable `{PREFIX}-NNN` ID and links to a dedicated feature file with the full execution contract.

Coverage note (2026-05-04): the playbook covers sk-code's two-axis routing (Code Surface → Intent → Resource Loading) at SKILL.md head-of-main. It exercises:
- WEBFLOW surface detection (vanilla HTML/CSS/JS frontend with motion.dev / GSAP / Lenis / HLS / Swiper / FilePond markers, `wrangler.toml`, `src/2_javascript/`).
- OPENCODE surface detection (CWD or target path under `.opencode/`).
- UNKNOWN fallback (Go / Swift / React Native markers — disambiguation expected).
- OPENCODE language sub-detection (TypeScript, Python, Shell, JSON/JSONC) with correct sub-language reference loading.
- Routing disambiguation under mixed-marker conditions and the sk-code vs sk-doc anti-pattern.
- Skill advisor integration: confidence ≥ 0.80 win for positive controls, no false positives on doc-edit prompts.
- Motion.dev integration checks: pinned CDN/API smoke, reduced-motion behavior, animation regression baselines.
- Cross-browser and performance gates: Chrome/Safari/Firefox behavior, LCP/CLS/INP thresholds, and compositor-friendly animation checks.
- Cross-stack routing checks: Webflow plus Motion.dev, non-Webflow Motion.dev, OpenCode plus Motion.dev, decision-matrix use, snippet reuse, CWV dual loading, and reduced-motion guidance.
- Design restraint scenarios (added 2026-06-13, v3.4.0.0): the pre-write Design Restraint Ladder rung selection, the implementer anti-stall rule, the `ceiling:` intentional-simplification convention, and the STACK_FOLDERS-to-disk validator.
- Tooling and hooks (added 2026-07-02, v3.5.0.16): the shared `claude-posttooluse.sh` PostToolUse hook's dist-staleness banner wiring (`check-dist-staleness.sh`), a deterministic warn-only check independent of skill routing.

### Realistic Test Model

1. A realistic user request is given to an orchestrator that has the sk-code skill registered.
2. The orchestrator (Claude Code, OpenCode, OpenCode, or Copilot) consults the skill advisor and decides whether to invoke sk-code, route to another skill, or ask for disambiguation.
3. The operator captures: which skill won the advisor vote, which surface sk-code detected, which references/assets the AI loaded, which agent (if any) was dispatched, and what the AI's response actually was.
4. The scenario passes only when the routing is correct, the resource-loading is exact (matches expected paths), and the user-visible outcome is sound.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior.
- The expected detection markers (verbatim from `references/stack_detection.md`).
- The expected references and assets the AI MUST load (exact relative paths under `references/` and `assets/`).
- The expected agent dispatch (if any — typically `@code` for write work, or none for read-only).
- The pass/fail criteria with binary grading.
- Failure triage steps.

---

## 2. GLOBAL PRECONDITIONS

Motion peer-resource folders must be present before MR/CB scenarios run: `code-webflow/references/animation/` and `code-webflow/assets/animation/`.

1. Working directory is project root and has `.git/`.
2. The sk-code skill is present at `.opencode/skills/sk-code/` with surface and peer-resource subfolders intact: `references/{router,opencode,webflow,universal,motion_dev}/` and `assets/{opencode,webflow,universal,motion_dev}/`.
3. The skill advisor at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` is callable and `skill-graph.json` includes the `sk-code` entry with `signals` array intact.
4. The orchestrator runtime has a Skill Advisor Hook OR can invoke `skill_advisor.py` via Bash.
5. The operator uses sandboxed scratch paths under `/tmp/skc-NNN-sandbox/` for any file fixtures the scenarios need (e.g. fake `wrangler.toml` to trigger WEBFLOW detection).
6. **Concurrency cap**: When running multi-scenario waves, cap at 5 parallel scenarios. Scenarios that invoke `skill_advisor.py` are CPU-light and can run concurrently; scenarios that dispatch `@code` (write work) MUST run serially to avoid scope-collision on the working tree.
7. Destructive scenarios (currently none in this playbook — all scenarios are READ-ONLY against the skill surface) MUST verify recovery is possible if added in future.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The exact user prompt that was tested.
- The skill advisor output (top-1 skill, confidence score, gap to second, advisorStatus).
- The detected code surface (WEBFLOW / OPENCODE / UNKNOWN) reported by sk-code.
- The exact list of references/assets the AI loaded (verbatim relative paths under `.opencode/skills/sk-code/`).
- The agent dispatched (if any) with name and runtime (e.g. `@code` via `.opencode/agents/code.md`).
- The AI's user-visible response (the answer it produced or the action it took).
- The scenario verdict (PASS / PARTIAL / FAIL / SKIP) with one-line rationale.
- Output transcripts saved under `/tmp/skc-NNN*.txt` per scenario.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Skill advisor probe: `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "<prompt>" --threshold 0.8`.
- Bash commands: `bash: <command>`.
- AI agent prompts: `As @<agent>: <instruction>`.
- Resource path notation: paths shown relative to `.opencode/skills/sk-code/` (e.g. `references/stack_detection.md`).
- `→` separates sequential steps inside a scenario's Exact Command Sequence.
- All evidence files live under `/tmp/skc-NNN*`. The playbook never writes to project paths outside `/tmp/` sandboxes.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md` (this file).
2. Per-feature files under `manual_testing_playbook/{NN--category-name}/`.
3. Scenario execution evidence (advisor outputs, surface-detection logs, resource-loading transcripts).
4. Feature-to-scenario coverage map (§15 FEATURE CATALOG CROSS-REFERENCE INDEX).
5. Triage notes for all PARTIAL / FAIL outcomes.

### Scenario Acceptance Rules

For each executed scenario, check:
1. Preconditions (§2) were satisfied.
2. Exact prompt was used verbatim.
3. Skill advisor returned the expected top-1 skill at the expected confidence band.
4. sk-code detected the expected surface (or correctly returned UNKNOWN).
5. The AI loaded EXACTLY the expected references/assets (no extra loads, no missed loads).
6. The agent dispatch (if any) matched the expected dispatch.
7. The user-visible outcome would satisfy a real user with the originating request.

### Verdict Rules

- `PASS`: all 7 acceptance checks true.
- `PARTIAL`: routing correct (advisor + surface + agent) but resource-loading set has minor drift (e.g. extra universal/ load).
- `FAIL`: any of (advisor lost, wrong surface, wrong agent, missing required reference) is true.
- `SKIP`: a documented external blocker (e.g. advisor binary unavailable in sandbox).

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the feature are PASS.
- `PARTIAL`: at least one mapped scenario is PARTIAL, none are FAIL.
- `FAIL`: any mapped scenario is FAIL.

Hard rule: any critical-path scenario FAIL forces feature verdict to FAIL. Critical-path scenarios are SD-001, SD-002, SD-003 (the three primary surface-detection paths) plus CS-001, CS-002, and CS-003 for the cross-stack Motion.dev routing path.

### Release Readiness Rule

Release is READY only when:
1. No feature verdict is FAIL.
2. All critical scenarios (SD-001, SD-002, SD-003, RD-002, SA-001) are PASS.
3. Coverage is 100% of playbook scenarios (28 / 28).
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic and routing-architecture explanations in this root playbook. Put scenario-specific acceptance caveats and resource-path expectations in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package.

### Operational Rules

1. Probe runtime capacity at start (`pgrep -f "python3 .*skill_advisor" | wc -l`).
2. Reserve one operator (you) as coordinator.
3. Saturate remaining worker slots up to 5 for advisor probes; 1 for `@code` dispatches.
4. Pre-assign explicit scenario IDs to each wave before execution.
5. Run the SA-001 advisor-probe wave LAST so it can reference outputs from SD-* and LS-* scenarios.
6. After each wave, save evidence under `/tmp/skc-wave-NN/`, then begin the next wave.
7. Record utilization, per-feature file references, and evidence paths in the final report.

### What Belongs in Per-Feature Files

- Real user request (the human-language ask the operator simulates).
- Exact prompt to feed into the orchestrator's prompt entry.
- Expected detection markers (cite `references/stack_detection.md` line numbers).
- Expected reference/asset load list (exact relative paths).
- Expected agent dispatch (or no-dispatch with rationale).
- Pass/fail criteria.
- Failure triage steps (e.g. "if WEBFLOW not detected, verify markers in code_surface_detection.md:30-37").

---

## 7. SURFACE DETECTION (`SD-001..SD-003`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `SD-001` | WEBFLOW Detection | Verify sk-code routes a vanilla-JS animation request to WEBFLOW surface | `Add a Lenis smooth-scroll initializer to src/2_javascript/scroll.js and gate it behind an IntersectionObserver so it only runs once the hero section is visible.` | advisor probe → invoke sk-code → inspect surface + loaded refs | advisor: sk-code top-1, score ≥ 0.80; surface: WEBFLOW; refs: webflow/* + router/* + universal/code_quality_standards.md | `/tmp/skc-SD001-advisor.txt`, `/tmp/skc-SD001-loaded-refs.txt` | PASS iff advisor wins sk-code AND surface == WEBFLOW AND `code-webflow/references/implementation/*` is in load set | If WEBFLOW not detected, verify `Lenis`, `src/2_javascript/`, `IntersectionObserver` markers in `references/stack_detection.md:30-37` |
| `SD-002` | OPENCODE Detection | Verify sk-code routes a system-code task to OPENCODE surface | `Add a console.error fallback to .opencode/skills/system-spec-kit/mcp_server/lib/scorer/lanes/explicit.ts when the input prompt is empty.` | advisor probe → invoke sk-code → inspect surface + loaded refs | advisor: sk-code top-1, score ≥ 0.80; surface: OPENCODE; sub-language: TYPESCRIPT; refs: opencode/typescript/* + opencode/shared/* + router/* | `/tmp/skc-SD002-advisor.txt`, `/tmp/skc-SD002-loaded-refs.txt` | PASS iff surface == OPENCODE AND sub-language detected as TYPESCRIPT AND `code-opencode/references/typescript/*` in load set | If OPENCODE not detected, verify CWD/target check at `references/stack_detection.md:39-40` |
| `SD-003` | UNKNOWN Fallback | Verify sk-code asks for disambiguation on unsupported stacks (Go) | `Add a request-ID middleware to my Go HTTP server in cmd/api/main.go and return it in the X-Request-ID response header.` | advisor probe → invoke sk-code → inspect surface | advisor: sk-code top-1 with caveat OR no win; surface: UNKNOWN; AI asks "which runtime / verification commands?" | `/tmp/skc-SD003-advisor.txt`, `/tmp/skc-SD003-response.txt` | PASS iff surface == UNKNOWN AND AI explicitly asks for runtime/verification disambiguation AND no surface-specific refs are loaded | If sk-code silently proceeds, verify the disambiguation rule in SKILL.md "Unsupported / Unknown" row |

Per-feature files: see `01--surface-detection/`.

---

## 8. LANGUAGE SUB-DETECTION (`LS-001..LS-004`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `LS-001` | OPENCODE/TypeScript | Verify TypeScript sub-language detection within OPENCODE | `Refactor the parseExecutorConfig function in .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts to throw on missing model when type is cli-opencode.` | advisor probe → invoke sk-code → inspect surface + sub-language + refs | surface: OPENCODE; sub-language: TYPESCRIPT; refs: opencode/typescript/{style_guide,quality_standards,quick_reference}.md + opencode/shared/* | `/tmp/skc-LS001-loaded-refs.txt` | PASS iff sub-language == TYPESCRIPT AND all 3 typescript/* refs loaded AND no python/shell refs loaded | Verify extension list in SKILL.md sub-detection table; check `.ts` is in TS extensions |
| `LS-002` | OPENCODE/Python | Verify Python sub-language detection within OPENCODE | `Update the skill_advisor.py argparse block at .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py to add a --json-output flag that emits results as JSON.` | advisor probe → invoke sk-code → inspect surface + sub-language + refs | surface: OPENCODE; sub-language: PYTHON; refs: opencode/python/{style_guide,quality_standards,quick_reference}.md + opencode/shared/* | `/tmp/skc-LS002-loaded-refs.txt` | PASS iff sub-language == PYTHON AND all 3 python/* refs loaded AND no typescript/shell refs loaded | Verify `.py` extension mapping; check `argparse` keyword is a Python signal |
| `LS-003` | OPENCODE/Shell | Verify Shell sub-language detection within OPENCODE | `Add set -euo pipefail and a trap to .opencode/skills/system-spec-kit/scripts/spec/validate.sh to clean up the temp dir on exit.` | advisor probe → invoke sk-code → inspect surface + sub-language + refs | surface: OPENCODE; sub-language: SHELL; refs: opencode/shell/{style_guide,quality_standards,quick_reference}.md + opencode/shared/* | `/tmp/skc-LS003-loaded-refs.txt` | PASS iff sub-language == SHELL AND all 3 shell/* refs loaded AND no python/typescript refs loaded | Verify `.sh` and shebang signals in SKILL.md sub-detection table |
| `LS-004` | OPENCODE/Config | Verify JSON/JSONC sub-language detection within OPENCODE | `Add a derived.last_active_child_id field to the <spec-folder> file with value "001-spec".` | advisor probe → invoke sk-code → inspect surface + sub-language + refs | surface: OPENCODE; sub-language: CONFIG; refs: opencode/config/{style_guide,quality_standards,quick_reference}.md + opencode/shared/* | `/tmp/skc-LS004-loaded-refs.txt` | PASS iff sub-language == CONFIG AND all 3 config/* refs loaded | Verify `.json`/`.jsonc` extensions and `schema`/`descriptor` keywords are config signals |

Per-feature files: see `02--language-sub-detection/`.

---

## 9. ROUTING DISAMBIGUATION (`RD-001..RD-002`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `RD-001` | Mixed-Marker Ambiguity | Verify sk-code asks for clarification when WEBFLOW + OPENCODE markers co-occur | `I want to add a Lenis smooth-scroll initializer to my .opencode/skills/sk-doc/scripts/preview-server.js so the local preview server has smooth-scroll on its index page.` | advisor probe → invoke sk-code → inspect surface | advisor: sk-code top-1; surface: ambiguous (BOTH OPENCODE path AND WEBFLOW library marker); AI asks "is this an OpenCode internal tool or a Webflow shipping artifact?" | `/tmp/skc-RD001-response.txt` | PASS iff AI explicitly asks for surface clarification AND does not silently pick one | If AI silently picks OPENCODE (because of `.opencode/` path), document as a known-limitation finding |
| `RD-002` | sk-code vs sk-doc Anti-Pattern | Verify skill advisor routes doc-edit prompts to sk-doc, NOT sk-code | `Update the sk-code SKILL.md headline section to clarify the two-axis routing model and add a one-line summary at the top.` | advisor probe → inspect top-1 + score | advisor: sk-doc top-1, score ≥ 0.70; sk-code score lower | `/tmp/skc-RD002-advisor.txt` | PASS iff advisor top-1 != sk-code AND sk-doc is in the top-3 | If sk-code wins despite this being a doc-edit, propose anti-signal in skill-graph.json (Phase E5) |

Per-feature files: see `03--routing-disambiguation/`.

---

## 10. SKILL ADVISOR INTEGRATION (`SA-001`)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `SA-001` | Advisor Probe Battery | Verify sk-code wins ≥80% of positive controls and loses 100% of negative controls | (multi-prompt battery — see per-feature file) | run `skill_advisor.py` for each prompt at threshold 0.8; tabulate top-1 and score | sk-code wins ≥12 of 15 positives at score ≥ 0.80; sk-code loses all 5 negatives | `/tmp/skc-SA001-advisor-results.jsonl` | PASS iff positive accuracy ≥ 0.80 AND negative-control false-positive rate == 0 | If positive accuracy < 0.80, propose `signals` array additions to skill-graph.json (Phase E5) |

Per-feature file: see `04--skill-advisor-integration/advisor-probe-battery.md`.

---

## 11. MOTION.DEV AND ANIMATION REGRESSION (`MR-001..MR-004`)

> Motion.dev API surface and full reference docs are documented in [../code-webflow/references/animation/](../code-webflow/references/animation) (populated in Packet 2 of this rework). The scenarios below test motion.dev integration points; consult the canonical motion.dev docs for full API details.

Motion.dev install and API behavior referenced in these scenarios is anchored to the official Motion docs, especially `https://motion.dev/docs/quick-start`, plus API subpages such as `https://motion.dev/docs/animate`, `https://motion.dev/docs/inview`, `https://motion.dev/docs/spring`, and `https://motion.dev/docs/performance`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `MR-001` | Motion.dev API Smoke | Verify pinned CDN Motion exports and basic runtime calls work in a Webflow-style sandbox | `Create a sandboxed Webflow-style Motion smoke page that imports animate, inView, and spring from a pinned motion CDN URL. Run it in Chrome, verify exports are functions, run one animate() call, trigger one inView() callback, and return PASS/FAIL with console evidence.` | create sandbox -> open in Chrome -> inspect console -> run smoke calls -> save transcript | pinned CDN URL; `animate`, `inView`, `spring` are functions; no uncaught console errors | `/tmp/skc-MR001-console.txt`, screenshot/video | PASS iff exports exist and smoke calls complete without throwing | Verify CDN URL, pinned version, export names, and selector visibility |
| `MR-002` | CDN Bundle Version Pin | Verify Motion CDN usage is version-pinned and not `@latest` | `Audit the repo for Motion CDN URLs. Confirm no production Motion URL uses @latest, record the pinned version(s), and verify the pinned ESM bundle exposes animate, inView, scroll, and motionValue for the testimonial slider pattern.` | `rg` CDN URLs -> classify production/docs hits -> probe pinned exports -> save results | no production `@latest`; pinned version(s) recorded; required exports present | `/tmp/skc-MR002-version-pin.txt`, `/tmp/skc-MR002-export-probe.txt` | PASS iff production Motion URLs are pinned and required exports exist | Classify docs/example hits separately; fail production `@latest` |
| `MR-003` | Prefers Reduced Motion | Verify Motion interactions respect `prefers-reduced-motion: reduce` | `Enable prefers-reduced-motion: reduce in Chrome DevTools, exercise the Motion testimonial slider and nav dropdown, and verify transform-heavy movement is disabled, shortened to instant state changes, or replaced with opacity-only changes. Return PASS/FAIL with before/after evidence.` | capture normal video -> enable reduced-motion emulation -> reload -> exercise flows -> capture reduced video | media query true; large transform motion removed or neutralized; UI still usable | `/tmp/skc-MR003-normal.mp4`, `/tmp/skc-MR003-reduced.mp4`, console transcript | PASS iff reduced-motion mode removes large motion while preserving state changes | Verify emulation, source guards, and Motion accessibility guidance |
| `MR-004` | Animation Regression Baseline | Capture baseline videos for key Motion-driven UI elements | `Record baseline videos for the Motion nav dropdown open/close flow and testimonial slider next/previous/drag flow. Compare the run against the current baseline, note any visual drift, console errors, or timing regressions, and return PASS/FAIL with artifact paths.` | open target -> record dropdown -> record slider -> save console -> compare baseline | correct open/close and slider final states; no console errors; drift noted | `/tmp/skc-MR004-nav-dropdown.mp4`, `/tmp/skc-MR004-testimonial.mp4`, `/tmp/skc-MR004-verdict.md` | PASS iff current behavior matches baseline or establishes approved first baseline | Isolate markup, Motion API, timing constants, or reduced-motion settings |

Per-feature files: see `05--motion-dev-and-animation-regression/`.

---

## 12. CROSS-BROWSER AND PERFORMANCE GATES (`CB-001..CB-003`)

These scenarios validate browser compatibility and performance evidence for Motion-driven UI. They use browser tooling and fixed thresholds so release review can distinguish visual quirks from blocking regressions.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `CB-001` | Cross-Browser Motion Animate | Verify Motion UI behavior in Chrome, Safari, and Firefox latest stable | `Run the Motion nav dropdown and testimonial slider scenarios in Chrome, Safari, and Firefox latest stable. Capture browser/version, console output, screenshots or videos, and any rendering quirks. Return PASS/FAIL per browser plus an aggregate verdict.` | run interactions in Chrome -> Safari -> Firefox -> save per-browser evidence -> write matrix | same final states; no uncaught Motion errors; quirks documented | `/tmp/skc-CB001-{browser}.txt`, `/tmp/skc-CB001-{browser}.mp4`, matrix | PASS iff all browsers reach correct final states and have clean runtime evidence | Isolate browser import support, WAAPI behavior, CSS differences, or reduced-motion settings |
| `CB-002` | Core Web Vitals Gates | Verify Motion-heavy page stays under CWV thresholds | `Measure LCP, CLS, and INP on a page with the Motion testimonial slider and nav dropdown. Use Chrome DevTools Performance panel or PageSpeed Insights, capture the report, and return PASS/FAIL against LCP < 2.5s, CLS < 0.1, INP < 200ms.` | open target -> run DevTools/PageSpeed -> interact -> export report -> write verdict | LCP < 2.5s; CLS < 0.1; INP < 200ms | `/tmp/skc-CB002-report.json` or `.html`, `/tmp/skc-CB002-verdict.md` | PASS iff all metrics meet thresholds and no animation-specific regression appears | Inspect hero delay, layout shifts, long tasks, and interaction handlers |
| `CB-003` | GPU Compositing | Verify Motion animations use compositor-friendly properties where expected | `Use Chrome DevTools Rendering and Performance panels to inspect the Motion nav dropdown and testimonial slider. Verify transform/opacity animations are compositor-friendly, flag any height/layout animation, and return PASS/FAIL with screenshots and trace notes.` | enable paint/layer tooling -> record trace -> exercise flows -> inspect layout/paint/composite events -> write verdict | transform/opacity composited where expected; layout-affecting animations documented; no forced-layout loop | `/tmp/skc-CB003-trace.json`, `/tmp/skc-CB003-rendering.png`, verdict | PASS iff compositor-friendly behavior is confirmed and layout animation is bounded/documented | Inspect `scrollHeight`, `offsetHeight`, `translate3d`, `willChange`, and CWV correlation |

Per-feature files: see `06--cross-browser-and-performance-gates/`.

---

## 13. CROSS-STACK ROUTING (`CS-001..CS-007`)

These scenarios validate Motion.dev as a cross-stack peer resource rather than a third surface. They are designed for the Phase 005 cross-CLI harness, where each runtime must analyze routing decisions without editing files or dispatching agents.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `CS-001` | WEBFLOW Plus Motion.dev | Verify Webflow animation work also loads `motion_dev/*` peer refs | `I'm building a vanilla HTML/CSS/JS Webflow site with motion.dev animations on a hero section. Show me the proper CDN install pattern and the in-view animation snippet for src/2_javascript/hero.js.` | universal prompt -> runtime YAML -> inspect surface/refs/assets | surface: WEBFLOW; refs include webflow implementation and motion_dev quick/start/integration; agent none | `/tmp/skc-CS-001-<cli>.txt`, `results/CS-001-<cli>.yaml` | PASS iff WEBFLOW + motion_dev peer refs + no dispatch | If motion_dev missing, inspect `references/smart_routing.md` Section 3 |
| `CS-002` | Non-Webflow Plus Motion.dev | Verify generic vanilla Motion.dev does not become WEBFLOW | `In a plain static HTML/CSS/JS microsite that is not Webflow, I want to use motion.dev for a hover card and in-view reveal. Which sk-code references would you load and how would you route this?` | universal prompt -> runtime YAML -> inspect surface/refs/assets | surface: UNKNOWN/N/A; refs include motion_dev only; no Webflow-owned route | `/tmp/skc-CS-002-<cli>.txt`, `results/CS-002-<cli>.yaml` | PASS iff not WEBFLOW and motion_dev refs load | If WEBFLOW wins, inspect generic-node guard |
| `CS-003` | OPENCODE Plus Motion.dev | Verify `.opencode/` TypeScript target wins precedence with Motion supplementary refs | `Update .opencode/skills/sk-doc/scripts/preview-server.ts so its docs preview page can show a small motion.dev animate() demo. Analyze how sk-code should route this before any edit.` | universal prompt -> runtime YAML -> inspect OPENCODE TS refs plus motion_dev | surface: OPENCODE; TS refs load; motion_dev supplementary; no Webflow-owned route | `/tmp/skc-CS-003-<cli>.txt`, `results/CS-003-<cli>.yaml` | PASS iff OPENCODE + TS refs + motion_dev supplementary + no dispatch | If WEBFLOW wins, inspect OPENCODE precedence |
| `CS-004` | Decision Matrix Routing | Verify Motion.dev vs CSS hover questions load `decision_matrix.md` | `For a hover state on cards, should I use motion.dev or plain CSS? I need the routing decision and the references you would load, not an implementation.` | universal prompt -> runtime YAML -> inspect refs and response trade-off | refs include `code-webflow/references/animation/decision_matrix.md`; response compares CSS and Motion.dev | `/tmp/skc-CS-004-<cli>.txt`, `results/CS-004-<cli>.yaml` | PASS iff decision matrix loads and answer names conditions | If omitted, inspect resource-loading CODE_QUALITY/DECISION map |
| `CS-005` | Snippet Reuse Cross-Stack | Verify cross-stack snippet reuse surfaces snippet plus snake_case caveat | `Can I reuse the sk-code Motion in-view reveal snippet in a non-Webflow vanilla JS page? Tell me which snippet and references you would load, and call out any naming-convention caveat.` | universal prompt -> runtime YAML -> inspect assets and response caveat | assets include `in_view_reveal.js`; response flags snake_case Webflow convention caveat | `/tmp/skc-CS-005-<cli>.txt`, `results/CS-005-<cli>.yaml` | PASS iff snippet and caveat both appear | If caveat missing, inspect Webflow style guide |
| `CS-006` | CWV Gates Animation Heavy | Verify animation-heavy Webflow performance prompts load both Motion and Webflow CWV refs | `Our Webflow landing page in src/2_javascript/hero.js uses motion.dev for scroll reveals and hover cards. LCP and INP regressed. Which sk-code references would you load before advising fixes?` | universal prompt -> runtime YAML -> inspect performance refs | refs include `code-webflow/references/animation/performance_and_pitfalls.md` and `code-webflow/references/performance/cwv_remediation.md` | `/tmp/skc-CS-006-<cli>.txt`, `results/CS-006-<cli>.yaml` | PASS iff both required performance refs load | If one side missing, inspect resource-loading PERFORMANCE maps |
| `CS-007` | Prefers Reduced Motion | Verify Webflow plus Motion.dev reduced-motion prompts cite Motion accessibility guidance | `For a Webflow page with motion.dev-powered cards in src/2_javascript/cards.js, how should sk-code route a prefers-reduced-motion fix before editing?` | universal prompt -> runtime YAML -> inspect reduced-motion refs and response | surface: WEBFLOW; refs include Motion reduced-motion and Webflow verification guidance | `/tmp/skc-CS-007-<cli>.txt`, `results/CS-007-<cli>.yaml` | PASS iff both Webflow and Motion reduced-motion guidance load | If missing, inspect `performance_and_pitfalls.md` and `verification_workflows.md` |

Per-feature files: see `07--cross-stack-routing/`.

---

## 14. DESIGN RESTRAINT (`DR-001..DR-004`)

These scenarios validate the v3.4.0.0 ponytail-based refinement: the pre-write Design Restraint Ladder, the implementer anti-stall rule, the `ceiling:` intentional-simplification convention, and the STACK_FOLDERS-to-disk validator. The first three run after surface and intent routing and change neither surface precedence nor the Iron Law; the fourth is a deterministic exit-code check.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `DR-001` | Design Restraint Ladder | Verify sk-code walks the ladder and selects the laziest viable rung before writing new code | `Add a helper to .opencode/skills/system-spec-kit/mcp_server/lib/util/unique.ts that removes duplicate strings from an array. Before writing, walk the Design Restraint Ladder and pick the laziest viable rung.` | advisor probe → invoke sk-code → capture surface then ladder trace | surface OPENCODE emitted before any ladder reasoning; ladder selects a one-line `new Set` rung over a custom loop; Phase 0 to 1 gate honored | `/tmp/skc-DR001-advisor.txt`, `/tmp/skc-DR001-ladder.txt` | PASS iff the ladder runs after routing AND the laziest viable rung is selected per `references/universal/code_quality_standards.md` AND the Phase 0 to 1 gate in `references/phase_detection.md` is honored | If the AI writes a custom loop, verify ladder rungs in `references/universal/code_quality_standards.md` |
| `DR-002` | Implementer Anti-Stall | Verify sk-code implements the requirement and raises a scope-amendment note without stalling to ask | `Add a retry wrapper with exponential backoff, jitter, a circuit breaker, and a pluggable metrics sink to the fetchConfig() startup call in .opencode/skills/system-spec-kit/mcp_server/lib/config/load.ts. It only runs once at startup.` | advisor probe → invoke sk-code → capture the response shape | requirement implemented; scope-amendment recommendation raised in the same response; no stall-to-ask; SCOPE-LOCK held | `/tmp/skc-DR002-advisor.txt`, `/tmp/skc-DR002-response.txt` | PASS iff sk-code implements the requirement AND raises a scope-amendment note in one response without blocking to ask, per SKILL.md §4 ALWAYS anti-stall bullet | If the AI stalls to ask, verify the anti-stall ALWAYS bullet in SKILL.md §4 |
| `DR-003` | Ceiling Comment Convention | Verify sk-code marks a deliberate shortcut with a neutral `ceiling:` comment that passes comment-hygiene without allow-listing | `Add a small in-memory rate limiter to the sk-doc local preview server at .opencode/skills/sk-doc/scripts/preview-server.ts. A fixed in-memory window is fine for local use, so mark the deliberate ceiling.` | invoke sk-code in `/tmp/skc-DR003-sandbox/` → run check-comment-hygiene.sh on the result | `ceiling:` comment names shortcut, ceiling, and upgrade trigger as a plain WHY; hygiene exits 0; `ceiling:` not added to the allowed-pattern list | `/tmp/skc-DR003-hygiene.txt` | PASS iff the ceiling comment follows `references/universal/code_style_guide.md` §4 (neutral WHY, not allow-listed) AND comment-hygiene exits 0 | If hygiene fails, the comment likely embeds a forbidden id — rewrite as a durable WHY |
| `DR-004` | STACK_FOLDERS Validator | Verify the validator passes clean and fails non-zero on an orphan surface folder | `Run the STACK_FOLDERS validator, confirm a clean pass, then add an orphan assets/<fake-surface> folder and confirm it fails.` | `python3 .../verify_stack_folders.py` (exit 0) → mkdir orphan `assets/zzz-fake-surface` → re-run (exit 1) → rmdir → re-run (exit 0) | clean run exits 0 listing declared surfaces; orphan run exits 1 naming the orphan; cleanup restores exit 0 | `/tmp/skc-DR004-clean.txt`, `/tmp/skc-DR004-orphan.txt` | PASS iff the clean run exits 0 AND an orphan folder in `references/` or `assets/` produces exit 1 naming the orphan, per `assets/scripts/verify_stack_folders.py` | If the orphan is not caught, verify both `references/` and `assets/` trees are scanned |

Per-feature files: see `08--design-restraint/`.

---

## 15. TOOLING AND HOOKS (`TH-001`)

This category validates shared tooling hooks that sk-code ships or wires into, independent of skill-advisor routing or surface detection. Scenarios here are deterministic checks against a script's real stdout/exit-code contract, not routing decisions.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `TH-001` | Dist-Staleness Hook Wiring | Verify `claude-posttooluse.sh` prints a STALE DIST WARNING banner for a stale watched package and always exits 0 | `Edit .opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts while its compiled dist output is stale, and confirm claude-posttooluse.sh prints a STALE DIST WARNING banner and still exits 0.` | make dist stale → invoke checker directly → invoke full hook via stdin JSON → restore | banner: `STALE DIST WARNING: @spec-kit/mcp-server -- run: ...`; hook exit 0 in all cases | `/tmp/th001-hook-stdout.txt`, `/tmp/th001-hook-stderr.txt` | PASS iff banner reaches hook stdout AND hook exits 0 | If banner is missing but hook still exits 0, check the checker's executable bit (`ls -la check-dist-staleness.sh`) — see per-feature file for the incident this scenario originally caught and how it was fixed |

Per-feature file: see `09--tooling-and-hooks/check-dist-staleness-hook.md`.

---

## 16. AUTOMATED TEST CROSS-REFERENCE

The sk-code skill currently has these automated tests:

- `.opencode/skills/sk-code/code-opencode/assets/scripts/test_verify_alignment_drift.py` — Pytest suite for `verify_alignment_drift.py` (OPENCODE alignment verifier).
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_stack_folders.py` — STACK_FOLDERS-to-disk surface validator (deterministic exit-code check; exercised manually by DR-004).

Tests NOT covered by automation (manual playbook is the only validation):
- Surface detection routing decisions (SD-001, SD-002, SD-003).
- Language sub-detection within OPENCODE (LS-001, LS-002, LS-003, LS-004).
- Mixed-marker disambiguation (RD-001).
- Advisor anti-pattern routing (RD-002).
- End-to-end advisor probe accuracy (SA-001).
- Motion.dev API smoke and CDN version pinning (MR-001, MR-002).
- Reduced-motion and animation regression baseline checks (MR-003, MR-004).
- Cross-browser, Core Web Vitals, and GPU/compositing checks (CB-001, CB-002, CB-003).
- Cross-stack Motion.dev smart-routing checks (CS-001, CS-002, CS-003, CS-004, CS-005, CS-006, CS-007).
- Design restraint behaviors: ladder rung selection, anti-stall, and the `ceiling:` convention (DR-001, DR-002, DR-003). DR-004 wraps the deterministic `verify_stack_folders.py` check.
- Dist-staleness hook wiring (TH-001): no automated test covers `claude-posttooluse.sh`'s dist-checker branch; this manual scenario is the only coverage.

**Known pre-existing gap (not covered by this or any playbook scenario)**: `claude-posttooluse.sh`'s comment-hygiene branch (`check-comment-hygiene.sh`, see `references/universal/code_style_guide.md` §4) has no dedicated automated test and no manual playbook scenario in this package. It predates the TH-001 addition and is out of scope for it — flagged here for visibility, not fixed.

---

## 17. FEATURE CATALOG CROSS-REFERENCE INDEX

| Category | Feature ID | Per-Feature File | Critical Path |
|---|---|---|---|
| Surface Detection | SD-001 | `01--surface-detection/webflow-detection.md` | Yes |
| Surface Detection | SD-002 | `01--surface-detection/opencode-detection.md` | Yes |
| Surface Detection | SD-003 | `01--surface-detection/unknown-fallback.md` | Yes |
| Language Sub-Detection | LS-001 | `02--language-sub-detection/opencode-typescript.md` | No |
| Language Sub-Detection | LS-002 | `02--language-sub-detection/opencode-python.md` | No |
| Language Sub-Detection | LS-003 | `02--language-sub-detection/opencode-shell.md` | No |
| Language Sub-Detection | LS-004 | `02--language-sub-detection/opencode-config.md` | No |
| Routing Disambiguation | RD-001 | `03--routing-disambiguation/mixed-marker-ambiguity.md` | No |
| Routing Disambiguation | RD-002 | `03--routing-disambiguation/skcode-vs-skdoc.md` | Yes |
| Skill Advisor Integration | SA-001 | `04--skill-advisor-integration/advisor-probe-battery.md` | Yes |
| Motion.dev And Animation Regression | MR-001 | `05--motion-dev-and-animation-regression/motion-api-smoke.md` | Yes |
| Motion.dev And Animation Regression | MR-002 | `05--motion-dev-and-animation-regression/cdn-bundle-version-pin.md` | Yes |
| Motion.dev And Animation Regression | MR-003 | `05--motion-dev-and-animation-regression/prefers-reduced-motion.md` | Yes |
| Motion.dev And Animation Regression | MR-004 | `05--motion-dev-and-animation-regression/animation-regression-baseline.md` | Yes |
| Cross-Browser And Performance Gates | CB-001 | `06--cross-browser-and-performance-gates/cross-browser-animate.md` | Yes |
| Cross-Browser And Performance Gates | CB-002 | `06--cross-browser-and-performance-gates/cwv-gates.md` | Yes |
| Cross-Browser And Performance Gates | CB-003 | `06--cross-browser-and-performance-gates/gpu-compositing.md` | Yes |
| Cross-Stack Routing | CS-001 | `07--cross-stack-routing/webflow-plus-motion-dev.md` | Yes |
| Cross-Stack Routing | CS-002 | `07--cross-stack-routing/non-webflow-plus-motion-dev.md` | Yes |
| Cross-Stack Routing | CS-003 | `07--cross-stack-routing/opencode-plus-motion-dev.md` | Yes |
| Cross-Stack Routing | CS-004 | `07--cross-stack-routing/decision-matrix-routing.md` | No |
| Cross-Stack Routing | CS-005 | `07--cross-stack-routing/snippet-reuse-cross-stack.md` | No |
| Cross-Stack Routing | CS-006 | `07--cross-stack-routing/cwv-gates-animation-heavy.md` | No |
| Cross-Stack Routing | CS-007 | `07--cross-stack-routing/prefers-reduced-motion.md` | No |
| Design Restraint | DR-001 | `08--design-restraint/design-restraint-ladder.md` | No |
| Design Restraint | DR-002 | `08--design-restraint/implementer-anti-stall.md` | No |
| Design Restraint | DR-003 | `08--design-restraint/ceiling-comment-convention.md` | No |
| Design Restraint | DR-004 | `08--design-restraint/stack-folders-validator.md` | No |
| Tooling And Hooks | TH-001 | `09--tooling-and-hooks/check-dist-staleness-hook.md` | No |

**Total scenarios**: 29
**Critical-path scenarios**: approximately 15 (SD-001, SD-002, SD-003, RD-002, SA-001, MR-001, MR-002, MR-003, MR-004, CB-001, CB-002, CB-003, CS-001, CS-002, CS-003)
**Categories**: 9
