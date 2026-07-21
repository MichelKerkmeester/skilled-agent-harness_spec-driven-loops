# sk-code Manual-Testing-Playbook Routing Verification -- playbook-verify-sonnet-20260721-131257

> Rendered from `report.json` (do not hand-edit).

## 1. RUN META

- **Hub**: `sk-code`
- **Executor**: Claude Sonnet (Claude Code agent), headless read-only sweep
- **Captured**: 2026-07-21T13:12:57Z
- **Repo mutations**: none (git status in cwd shows only the 2 pre-existing, explicitly out-of-scope strays: mcp-tooling/008-mcp-aside/001-research/research/research.md, system-deep-loop/032-deep-alignment-mode/013-review-remediation/decision-record.md)
- **`DEFAULT_ON_HUBS`**: 7 hubs -- sk-code, system-deep-loop, mcp-tooling, cli-external-orchestration, sk-prompt, sk-design, sk-doc (unchanged)

### Method

For every scenario in the root §18 FEATURE CATALOG CROSS-REFERENCE INDEX (30 rows) plus the standalone compiled-routing/ meta-scenario CB-CR-001, ran the exact-prompt text (as parsed by the frozen load-playbook-scenarios.cjs loader, i.e. per-feature-file fenced prompt block preferred over the root-table cell) through two commands and diffed the routing decision: (1) COMPILED: `env -u SPECKIT_COMPILED_ROUTING node .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs --hub sk-code --prompt "<prompt>"` (default-on cohort, no flag override); (2) LEGACY: `node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs --skill .opencode/skills/sk-code --task "<prompt>"`. Compiled targets[].workflowMode vs legacy intents were compared as sets; legacy surface + resources were cross-checked against each per-feature-file's own documented Expected surface / Expected references loaded / Expected NOT loaded.

### Frozen scorer SHA-256 (start == end)

| File | SHA-256 | Unchanged |
| --- | --- | --- |
| `load-playbook-scenarios.cjs` | `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029` | YES |
| `router-replay.cjs` | `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47` | YES |
| `score-skill-benchmark.cjs` | `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c` | YES |

---

## 2. SUMMARY

- **Total scenarios examined**: 32 (playbook's own declared total is 31; plus CB-CR-001 (not yet in root SS18 index))
- **PASS**: 14
- **FAIL**: 2
- **SKIP**: 16
- **Compiled-vs-legacy drift observed**: 0 / 31 measured prompts (SA-001 excluded -- no single routable prompt)

### Lane C corroboration

- **Lane C corpus size** (cited in `013-compiled-coverage-buildout/implementation-summary.md`: "sk-code reached compiled-serving (23/0)"): **23**
- **Corpus definition** (independently re-derived this session via `load-playbook-scenarios.cjs --skill .opencode/skills/sk-code`, which returns 30 root-index scenarios, kind-classified `routing:21 / advisor:2 / browser:7`): 30 root-index scenarios minus the 7 browser-class scenarios (MR-001..004, CB-001..003) that load-playbook-scenarios.cjs classifies as classKind=browser (category vocabulary match on motion/animation/browser/performance/cross-browser) and therefore excludes from the deterministic router-replay corpus.
- **Corroboration**: 0/31 compiled-vs-legacy drift observed across every scenario prompt run in this sweep (the 23-scenario Lane C corpus plus the 7 browser-class prompts plus CB-CR-001, run informationally) -- directly corroborates the archived Lane C parity result of sk-code 23/0 (compiled-serving, 0 drift) cited in the 013-compiled-coverage-buildout implementation-summary.md and reproduced in this session's own resolve.cjs/router-replay.cjs invocations.
- **On the 2 FAILs**: CS-002 and CS-005 FAIL against the playbook's own documented expected-surface contract, but compiled==legacy on both (0 drift) -- both engines share the same pre-existing legacy marker-regex quirk (bare word-boundary match on "webflow" inside the negated phrase "non-Webflow"). This does not count against the Lane C 23/0 drift figure, which measures compiled-vs-legacy agreement, not agreement-with-playbook-authoring-intent.

---

## 3. FULL SCENARIO TABLE

Every scenario id, its expected routing (from the playbook), the compiled result, the legacy result, and the verdict. `--` = not applicable (no single prompt, or field not populated for a SKIPped/non-routing scenario).

| ID | Category | Critical | Expected surface/mode | Compiled action / targets | Legacy surface / intents | Compiled==Legacy | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `SD-001` | Surface Detection | Yes | WEBFLOW | route / [code-webflow] | WEBFLOW / [code-webflow] | MATCH | PASS |
| `SD-002` | Surface Detection | Yes | OPENCODE (TYPESCRIPT) | route / [code-opencode] | OPENCODE / [code-opencode] | MATCH | PASS |
| `SD-003` | Surface Detection | Yes | UNKNOWN | defer / [] | UNKNOWN / [] | MATCH | PASS |
| `LS-001` | Language Sub-Detection | No | OPENCODE (TYPESCRIPT) | route / [code-opencode] | OPENCODE / [code-opencode] | MATCH | PASS |
| `LS-002` | Language Sub-Detection | No | OPENCODE (PYTHON) | route / [code-opencode] | OPENCODE / [code-opencode] | MATCH | PASS |
| `LS-003` | Language Sub-Detection | No | OPENCODE (SHELL) | route / [code-opencode, quality] | OPENCODE / [code-opencode, quality] | MATCH | PASS |
| `LS-004` | Language Sub-Detection | No | OPENCODE (CONFIG) | route / [code-opencode] | OPENCODE / [code-opencode] | MATCH | PASS |
| `RD-001` | Routing Disambiguation | No | OPENCODE | route / [code-opencode, code-webflow] | OPENCODE / [code-opencode, code-webflow] | MATCH | PASS |
| `RD-002` | Routing Disambiguation | Yes | -- | route / [code-opencode, code-review, code-webflow, quality] | OPENCODE / [code-opencode, code-review, code-webflow, quality] | MATCH | SKIP |
| `SA-001` | Skill Advisor Integration | Yes | -- | -- | -- | -- | SKIP |
| `MR-001` | Motion.dev And Animation Regression | Yes | -- | route / [code-webflow] | WEBFLOW / [code-webflow] | MATCH | SKIP |
| `MR-002` | Motion.dev And Animation Regression | Yes | -- | route / [code-webflow] | UNKNOWN / [code-webflow] | MATCH | SKIP |
| `MR-003` | Motion.dev And Animation Regression | Yes | -- | defer / [] | UNKNOWN / [] | MATCH | SKIP |
| `MR-004` | Motion.dev And Animation Regression | Yes | -- | defer / [] | UNKNOWN / [] | MATCH | SKIP |
| `CB-001` | Cross-Browser And Performance Gates | Yes | -- | route / [code-webflow] | UNKNOWN / [code-webflow] | MATCH | SKIP |
| `CB-002` | Cross-Browser And Performance Gates | Yes | -- | defer / [] | UNKNOWN / [] | MATCH | SKIP |
| `CB-003` | Cross-Browser And Performance Gates | Yes | -- | defer / [] | UNKNOWN / [] | MATCH | SKIP |
| `CS-001` | Cross-Stack Routing | Yes | WEBFLOW | route / [code-webflow] | WEBFLOW / [code-webflow] | MATCH | PASS |
| `CS-002` | Cross-Stack Routing | Yes | UNKNOWN | route / [code-webflow] | WEBFLOW / [code-webflow] | MATCH | **FAIL** |
| `CS-003` | Cross-Stack Routing | Yes | OPENCODE | route / [code-opencode] | OPENCODE / [code-opencode] | MATCH | PASS |
| `CS-004` | Cross-Stack Routing | No | UNKNOWN | route / [code-webflow] | UNKNOWN / [code-webflow] | MATCH | PASS |
| `CS-005` | Cross-Stack Routing | No | UNKNOWN | route / [code-webflow] | WEBFLOW / [code-webflow] | MATCH | **FAIL** |
| `CS-006` | Cross-Stack Routing | No | WEBFLOW | route / [code-webflow] | WEBFLOW / [code-webflow] | MATCH | PASS |
| `CS-007` | Cross-Stack Routing | No | WEBFLOW | route / [code-webflow] | WEBFLOW / [code-webflow] | MATCH | PASS |
| `DR-001` | Design Restraint | No | OPENCODE (TYPESCRIPT) | route / [code-opencode] | OPENCODE / [code-opencode] | MATCH | SKIP |
| `DR-002` | Design Restraint | No | OPENCODE | route / [code-opencode] | OPENCODE / [code-opencode] | MATCH | SKIP |
| `DR-003` | Design Restraint | No | OPENCODE (TYPESCRIPT) | route / [code-opencode] | OPENCODE / [code-opencode] | MATCH | SKIP |
| `DR-004` | Design Restraint | No | -- | defer / [] | UNKNOWN / [] | MATCH | SKIP |
| `TH-001` | Tooling And Hooks | No | -- | route / [code-opencode] | OPENCODE / [code-opencode] | MATCH | SKIP |
| `TH-002` | Tooling And Hooks | No | -- | route / [quality] | OPENCODE / [quality] | MATCH | SKIP |
| `post-edit-quality-router` | Plugins And Hooks | No | -- | -- | -- | -- | SKIP |
| `CB-CR-001` | Compiled Routing (not yet in root index) | -- | WEBFLOW | route / [code-webflow] | WEBFLOW / [code-webflow] | MATCH | PASS |

---

## 4. PER-SCENARIO NOTES (prompt + full reasoning)

### `SD-001` -- Surface Detection -- verdict: **PASS**

- **Feature file**: `surface-detection/webflow-detection.md`
- **Prompt**: `Add Lenis smooth-scroll to src/2_javascript/scroll.js, gated by IntersectionObserver when the hero becomes visible.`
- **Notes**: WEBFLOW confirmed; 0 code-opencode/* leak (31 resources, 26 code-webflow/*, 0 code-opencode/*); compiled==legacy.

### `SD-002` -- Surface Detection -- verdict: **PASS**

- **Feature file**: `surface-detection/opencode-detection.md`
- **Prompt**: `Handle empty prompts in .opencode/skills/system-spec-kit/mcp-server/lib/scorer/lanes/explicit.ts with a TypeScript console.error fallback.`
- **Notes**: OPENCODE+TYPESCRIPT confirmed; 0 code-webflow/* leak (11 resources, 7 code-opencode/*, 0 code-webflow/*); compiled==legacy. Note: per-feature-file prompt text differs from the root-table §7 prompt cell (same target file/intent, reworded) -- loader uses the per-feature version; both route identically.

### `SD-003` -- Surface Detection -- verdict: **PASS**

- **Feature file**: `surface-detection/unknown-fallback.md`
- **Prompt**: `Add a request-ID middleware to my Go HTTP server in cmd/api/main.go and return it in the X-Request-ID response header.`
- **Notes**: UNKNOWN confirmed; action=defer both engines; exactly the 4 universal-tier resources (stack-detection, phase-detection, smart-routing, code-quality-standards), 0 surface-specific refs; compiled==legacy.

### `LS-001` -- Language Sub-Detection -- verdict: **PASS**

- **Feature file**: `language-sub-detection/opencode-typescript.md`
- **Prompt**: `Refactor the parseExecutorConfig function in .opencode/skills/system-spec-kit/mcp-server/lib/deep-loop/executor-config.ts to throw on missing model when type is cli-opencode.`
- **Notes**: OPENCODE/TYPESCRIPT; exactly typescript/* refs loaded, 0 python/shell/config leakage; compiled==legacy.

### `LS-002` -- Language Sub-Detection -- verdict: **PASS**

- **Feature file**: `language-sub-detection/opencode-python.md`
- **Prompt**: `Update the skill_advisor.py argparse block at .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py to add a --json-output flag that emits results as JSON.`
- **Notes**: OPENCODE/PYTHON; exactly python/* refs loaded, 0 cross-language leakage; compiled==legacy.

### `LS-003` -- Language Sub-Detection -- verdict: **PASS**

- **Feature file**: `language-sub-detection/opencode-shell.md`
- **Prompt**: `Add set -euo pipefail and a trap to .opencode/skills/system-spec-kit/scripts/spec/validate.sh to clean up the temp dir on exit.`
- **Notes**: OPENCODE/SHELL; exactly shell/* refs loaded, 0 cross-language leakage; compiled==legacy.

### `LS-004` -- Language Sub-Detection -- verdict: **PASS**

- **Feature file**: `language-sub-detection/opencode-config.md`
- **Prompt**: `Add a derived.last_active_child_id field to the graph-metadata.json file with value "001-spec".`
- **Notes**: OPENCODE/CONFIG; exactly config/* refs loaded, 0 cross-language leakage; compiled==legacy.

### `RD-001` -- Routing Disambiguation -- verdict: **PASS**

- **Feature file**: `routing-disambiguation/mixed-marker-ambiguity.md`
- **Prompt**: `Add Lenis smooth-scroll to .opencode/skills/sk-doc/scripts/preview-server.js for the local preview index page.`
- **Notes**: Outcome A (remediated 2026-05-04) confirmed: hub-router intent layer correctly flags BOTH code-webflow and code-opencode as tied targets (selectionKind=orderedBundle, deferReason=ambiguous-multi-axis) -- exactly the mixed-marker ambiguity this scenario tests -- while the downstream surface-resolution layer still applies the documented OPENCODE-wins precedence: surface=OPENCODE, 0 code-webflow/* in the final assembled resource set (14 resources, all code-opencode/javascript/*). compiled==legacy on both the 2-target intent layer and the resource layer. Root playbook table (section 9) still describes the pre-remediation Outcome-B-only contract; the per-feature file is authoritative and current.

### `RD-002` -- Routing Disambiguation -- verdict: **SKIP**

- **Feature file**: `routing-disambiguation/skcode-vs-skdoc.md`
- **Prompt**: `Update the sk-code SKILL.md headline section to clarify the two-axis routing model and add a one-line summary at the top.`
- **Notes**: Tests cross-skill advisor arbitration (does sk-doc outrank sk-code overall), not sk-code's intra-hub compiled router -- resolve.cjs/router-replay.cjs only adjudicate routing WITHIN sk-code once sk-code is already selected, so they cannot verify this scenario's actual pass criterion. Informational check: compiled==legacy, both return a 4-way near-tie (quality, code-review, code-webflow, code-opencode) for this weakly-keyed doc-edit prompt -- consistent with sk-code having no dominant internal-routing signal here, corroborating (not proving) that a different, stronger-signal skill should win the cross-skill vote. This exact prompt is SA-001's N1 negative control, whose battery run history (see SA-001) already documents 'N01 false-positive RESOLVED' as of 2026-05-04.

### `SA-001` -- Skill Advisor Integration -- verdict: **SKIP**

- **Feature file**: `skill-advisor-integration/advisor-probe-battery.md`
- **Prompt**: _(none -- see notes)_
- **Notes**: A 20-prompt (15 positive + 5 negative) cross-skill advisor-accuracy battery, not a single routing decision, and not exercised by resolve.cjs/router-replay.cjs (those tools only replay sk-code-internal routing, not skill_advisor.py cross-skill arbitration). The per-feature file already documents a completed run history (V1-V4, dated 2026-05-04) with a final combined accuracy of 80% (11/15 positive, 5/5 negative), Verdict: PASS -- cited here, not re-run.

### `MR-001` -- Motion.dev And Animation Regression -- verdict: **SKIP**

- **Feature file**: `motion-dev-and-animation-regression/motion-api-smoke.md`
- **Prompt**: `Create a sandboxed Webflow-style Motion smoke page that imports animate, inView, and spring from a pinned motion CDN URL. Run it in Chrome, verify exports are functions, run one animate() call, trigger one inView() callback, and return PASS/FAIL with console evidence.`
- **Notes**: Requires a live Chrome session (console/video capture of a Motion smoke page); no browser automation tool is available in this headless sweep -- genuine sandbox blocker per playbook SS2.5/SS16. Informational routing check: action=route, targets=[code-webflow], compiled==legacy.

### `MR-002` -- Motion.dev And Animation Regression -- verdict: **SKIP**

- **Feature file**: `motion-dev-and-animation-regression/cdn-bundle-version-pin.md`
- **Prompt**: `Audit the repo for Motion CDN URLs. Confirm no production Motion URL uses @latest, record the pinned version(s), and verify the pinned ESM bundle exposes animate, inView, scroll, and motionValue for the testimonial slider pattern.`
- **Notes**: Requires live grep + browser export-probe evidence capture; same sandbox blocker. Informational routing check: action=route, targets=[code-webflow] (motion_dev peer-resource intent bucket), compiled==legacy.

### `MR-003` -- Motion.dev And Animation Regression -- verdict: **SKIP**

- **Feature file**: `motion-dev-and-animation-regression/prefers-reduced-motion.md`
- **Prompt**: `Enable prefers-reduced-motion: reduce in Chrome DevTools, exercise the Motion testimonial slider and nav dropdown, and verify transform-heavy movement is disabled, shortened to instant state changes, or replaced with opacity-only changes. Return PASS/FAIL with before/after evidence.`
- **Notes**: Requires live Chrome DevTools reduced-motion emulation + before/after video capture; same sandbox blocker. Informational routing check: action=defer (no strong marker in this purely-behavioral prompt), compiled==legacy.

### `MR-004` -- Motion.dev And Animation Regression -- verdict: **SKIP**

- **Feature file**: `motion-dev-and-animation-regression/animation-regression-baseline.md`
- **Prompt**: `Record baseline videos for the Motion nav dropdown open/close flow and testimonial slider next/previous/drag flow. Compare the run against the current baseline, note any visual drift, console errors, or timing regressions, and return PASS/FAIL with artifact paths.`
- **Notes**: Requires live browser session recording baseline videos; same sandbox blocker. Informational routing check: action=defer, compiled==legacy.

### `CB-001` -- Cross-Browser And Performance Gates -- verdict: **SKIP**

- **Feature file**: `cross-browser-and-performance-gates/cross-browser-animate.md`
- **Prompt**: `Run the Motion nav dropdown and testimonial slider scenarios in Chrome, Safari, and Firefox latest stable. Capture browser/version, console output, screenshots or videos, and any rendering quirks. Return PASS/FAIL per browser plus an aggregate verdict.`
- **Notes**: Requires three live browsers (Chrome/Safari/Firefox); same sandbox blocker. Informational routing check: action=route, targets=[code-webflow], compiled==legacy.

### `CB-002` -- Cross-Browser And Performance Gates -- verdict: **SKIP**

- **Feature file**: `cross-browser-and-performance-gates/cwv-gates.md`
- **Prompt**: `Measure LCP, CLS, and INP on a page with the Motion testimonial slider and nav dropdown. Use Chrome DevTools Performance panel or PageSpeed Insights, capture the report, and return PASS/FAIL against LCP < 2.5s, CLS < 0.1, INP < 200ms.`
- **Notes**: Requires live Chrome DevTools Performance/PageSpeed capture; same sandbox blocker. Informational routing check: action=defer, compiled==legacy.

### `CB-003` -- Cross-Browser And Performance Gates -- verdict: **SKIP**

- **Feature file**: `cross-browser-and-performance-gates/gpu-compositing.md`
- **Prompt**: `Use Chrome DevTools Rendering and Performance panels to inspect the Motion nav dropdown and testimonial slider. Verify transform/opacity animations are compositor-friendly, flag any height/layout animation, and return PASS/FAIL with screenshots and trace notes.`
- **Notes**: Requires live Chrome DevTools Rendering/Performance trace capture; same sandbox blocker. Informational routing check: action=defer, compiled==legacy.

### `CS-001` -- Cross-Stack Routing -- verdict: **PASS**

- **Feature file**: `cross-stack-routing/webflow-plus-motion-dev.md`
- **Prompt**: `For a Webflow hero in src/2_javascript/hero.js, show the pinned Motion CDN pattern and in-view animation snippet.`
- **Notes**: WEBFLOW confirmed; motion_dev peer refs (animation/quick-start, animation/integration-patterns, animation/scroll-and-gestures) load alongside core webflow implementation refs; compiled==legacy.

### `CS-002` -- Cross-Stack Routing -- verdict: **FAIL**

- **Feature file**: `cross-stack-routing/non-webflow-plus-motion-dev.md`
- **Prompt**: `For a non-Webflow vanilla JS page, which Motion.dev references and snippets should sk-code load for hover cards and in-view reveal?`
- **Notes**: Expected surface UNKNOWN/N/A (generic-node guard: prompt is deliberately 'non-Webflow'); actual legacy surface=WEBFLOW, compiled targets=[code-webflow] -- both engines agree with EACH OTHER (0 compiled-vs-legacy drift) but both diverge from the scenario's documented expectation. Root cause (verified): router-replay.cjs's detectSurface() marker regex is `/src\/2_javascript|\bwebflow\b|\.webflow\b|--vw-/` -- a bare word-boundary match on the literal substring 'webflow', which fires on the negated phrase 'non-Webflow' with no negation-awareness. This is a pre-existing LEGACY behavior (not introduced by compiled routing) that the compiled engine faithfully replicates. Practical impact is bounded: MOTION-tier resources pass the surface filter unconditionally (`rs === 'MOTION' -> true`), so the actually-assembled resource set still contains 0 Webflow-only implementation/checklist assets and does include the scenario's required quick-start/integration-patterns/scroll-and-gestures/decision-matrix refs -- the observable resource-loading contract holds even though the internal surface label does not. Flagging as a legacy-inherited finding for the smart-routing.md marker regex, not a blocker for the sk-code default-on cutover.

### `CS-003` -- Cross-Stack Routing -- verdict: **PASS**

- **Feature file**: `cross-stack-routing/opencode-plus-motion-dev.md`
- **Prompt**: `Before editing .opencode/skills/sk-doc/scripts/preview-server.ts for a Motion demo, how should sk-code route the request?`
- **Notes**: OPENCODE confirmed; motion_dev supplementary refs (animation/quick-start, animation/integration-patterns) load alongside TypeScript standards; compiled==legacy.

### `CS-004` -- Cross-Stack Routing -- verdict: **PASS**

- **Feature file**: `cross-stack-routing/decision-matrix-routing.md`
- **Prompt**: `For a hover state on cards, should I use motion.dev or plain CSS? I need the routing decision and the references you would load, not an implementation.`
- **Notes**: UNKNOWN/N/A confirmed (no literal "webflow" substring in this prompt, so the CS-002/CS-005 regex quirk does not trigger); code-webflow/references/animation/decision-matrix.md loads as required; compiled==legacy.

### `CS-005` -- Cross-Stack Routing -- verdict: **FAIL**

- **Feature file**: `cross-stack-routing/snippet-reuse-cross-stack.md`
- **Prompt**: `Can I reuse the sk-code Motion in-view reveal snippet in a non-Webflow vanilla JS page? Tell me which snippet and references you would load, and call out any naming-convention caveat.`
- **Notes**: Same root cause as CS-002: prompt contains the negated phrase 'non-Webflow vanilla JS page', tripping the same word-boundary regex. Expected surface UNKNOWN/N/A; actual legacy surface=WEBFLOW, compiled targets=[code-webflow]; compiled==legacy (0 drift between the two engines). Assembled resources still include the required in-view-reveal snippet path family and 0 Webflow-only implementation assets, so the resource-loading contract holds despite the mislabeled surface.

### `CS-006` -- Cross-Stack Routing -- verdict: **PASS**

- **Feature file**: `cross-stack-routing/cwv-gates-animation-heavy.md`
- **Prompt**: `Our Webflow landing page in src/2_javascript/hero.js uses motion.dev for scroll reveals and hover cards. LCP and INP regressed. Which sk-code references would you load before advising fixes?`
- **Notes**: WEBFLOW confirmed; both required dual-performance refs present (code-webflow/references/performance/cwv-remediation.md AND code-webflow/references/animation/performance-and-pitfalls.md); compiled==legacy.

### `CS-007` -- Cross-Stack Routing -- verdict: **PASS**

- **Feature file**: `cross-stack-routing/prefers-reduced-motion.md`
- **Prompt**: `For a Webflow page with motion.dev-powered cards in src/2_javascript/cards.js, how should sk-code route a prefers-reduced-motion fix before editing?`
- **Notes**: WEBFLOW confirmed; Motion reduced-motion guidance (animation/performance-and-pitfalls.md) and Webflow a11y/verification guidance both present; compiled==legacy.

### `DR-001` -- Design Restraint -- verdict: **SKIP**

- **Feature file**: `design-restraint/design-restraint-ladder.md`
- **Prompt**: `Add a helper to .opencode/skills/system-spec-kit/mcp-server/lib/util/unique.ts that removes duplicate strings from an array. Before writing, walk the Design Restraint Ladder and pick the laziest viable rung.`
- **Notes**: Scenario's actual pass criterion is a GENERATED behavior (which Design Restraint Ladder rung the AI selects for a real implementation task), which requires a live sk-code agent invocation this headless routing sweep does not perform. The named routing PRECONDITION the scenario itself calls out ('surface OPENCODE emitted BEFORE any ladder reasoning') is independently confirmed: surface=OPENCODE, compiled==legacy, correct code-opencode/typescript/* refs load.

### `DR-002` -- Design Restraint -- verdict: **SKIP**

- **Feature file**: `design-restraint/implementer-anti-stall.md`
- **Prompt**: `Add a retry wrapper with exponential backoff, jitter, a circuit breaker, and a pluggable metrics sink to the fetchConfig() startup call in .opencode/skills/system-spec-kit/mcp-server/lib/config/load.ts. It only runs once at startup.`
- **Notes**: Same class as DR-001: the pass criterion is a generated response shape (implements the requirement AND raises a scope-amendment note in one response, no stall), not a routing decision. Routing precondition confirmed: surface=OPENCODE, compiled==legacy.

### `DR-003` -- Design Restraint -- verdict: **SKIP**

- **Feature file**: `design-restraint/ceiling-comment-convention.md`
- **Prompt**: `Add a small in-memory rate limiter to the sk-doc local preview server at .opencode/skills/sk-doc/scripts/preview-server.ts. A fixed in-memory window is fine for local use, so mark the deliberate ceiling.`
- **Notes**: Same class as DR-001/002: the pass criterion is a generated `ceiling:` comment that must then pass check-comment-hygiene.sh -- both steps require live generation this sweep does not perform (and the hygiene checker itself is out of this routing-only method's scope). Routing precondition confirmed: surface=OPENCODE, sub-language TYPESCRIPT, compiled==legacy.

### `DR-004` -- Design Restraint -- verdict: **SKIP**

- **Feature file**: `design-restraint/stack-folders-validator.md`
- **Prompt**: `Run the STACK_FOLDERS validator, confirm a clean pass, then add an orphan assets/<fake-surface> folder and confirm it fails.`
- **Notes**: Scenario's own header states 'Expected detection: not applicable -- this is a deterministic script run, not a routing decision' (verify_stack_folders.py exit-code contract). Out of this routing-comparison method by the scenario's own design; not re-run here to stay strictly read-only (the scenario's own recipe mutates the live references/ tree, even if reversibly). Informational routing check: action=defer both engines (no code-edit signal in a validator-invocation prompt), compiled==legacy.

### `TH-001` -- Tooling And Hooks -- verdict: **SKIP**

- **Feature file**: `tooling-and-hooks/check-dist-staleness-hook.md`
- **Prompt**: `Edit .opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts while its compiled dist output is stale, and confirm claude-posttooluse.sh prints a STALE DIST WARNING banner and still exits 0.`
- **Notes**: Scenario's own header states 'Expected detection: not applicable... not a routing decision' (claude-posttooluse.sh dist-staleness banner/exit-code contract). Its own per-feature file already documents a completed, dated result: 'Last validated: 2026-07-02 -- PASS' with full hook-path evidence -- cited here, not re-run (re-running would mutate a real tracked source file's mtime/content, out of this sweep's read-only scope even though the recipe is designed to restore it byte-exact). Informational routing check: action=route, targets=[code-opencode], compiled==legacy.

### `TH-002` -- Tooling And Hooks -- verdict: **SKIP**

- **Feature file**: `tooling-and-hooks/comment-hygiene-hook.md`
- **Prompt**: `In a /tmp sandbox, add a source file whose comment carries an ephemeral-artifact pointer (an ADR id), and confirm claude-posttooluse.sh prints a COMMENT HYGIENE WARNING banner and still exits 0, that check-comment-hygiene.sh returns rc=1 on that file, then fix the comment in place and confirm rc=0.`
- **Notes**: Same class as TH-001: 'not applicable... not a routing decision' (comment-hygiene banner/rc contract). Its own per-feature file documents a completed, dated result: 'Last validated: 2026-07-07 -- PASS' with full hook-path evidence and a verbatim captured banner -- cited here, not re-run. Informational routing check: action=route, targets=[quality], compiled==legacy.

### `post-edit-quality-router` -- Plugins And Hooks -- verdict: **SKIP**

- **Feature file**: `plugins-and-hooks/post-edit-quality-router.md`
- **Prompt**: _(none -- see notes)_
- **Notes**: Not in the root §18 index table (descriptive kebab-slug id, not `AA-000` shape) and explicitly has no orchestrator prompt at all ('direct live invocation battery; see per-feature file') -- there is no prompt text to feed resolve.cjs/router-replay.cjs. Its own per-feature file already documents a completed PASS (SS7) with live evidence: unit suite 38/38 green, live Claude-adapter banner + exit 0, kill-switch full no-op, live OpenCode plugin import surfacing the buffered finding, outside-root path returning zero dispatch entries -- cited here, not re-run.

### `CB-CR-001` -- Compiled Routing (not yet in root index) -- verdict: **PASS**

- **Feature file**: `compiled-routing/surface-bundle-compiled-routing.md`
- **Prompt**: `Add a scroll-triggered reveal animation to my Webflow site using GSAP and IntersectionObserver.`
- **Notes**: Compiled-routing meta-scenario (not yet wired into the root SS18 index; lives standalone under compiled-routing/). servingAuthority=compiled confirmed (resolveRoute returned a real route object, not the {servingAuthority:'legacy',...} fallback sentinel); compiled targets=[code-webflow] == legacy intents=[code-webflow] == legacy surface=WEBFLOW; both frontmatter expected_resources entries (animation-workflows/overview-decision-tree-and-css.md, animation-workflows/motion-dev-and-performance.md) are present in the assembled resource set. Minor observation: the scenario's evidence_manifest_digest (1a42e542...) does not match the manifest.json FILE's current SHA-256 (11c883d5..., unchanged from the most recent luna-high-verify archived run) -- the file has been re-serialized at least twice today without any change to the semantically load-bearing selectedPolicy.effectivePolicyHash/generation/servingAuthority fields (fb8cd204.../2/compiled, stable across all 3 prior archived runs and this run). Not a routing-correctness issue; flagged for provenance hygiene only.

---

## 5. FAIL DETAIL (both instances)

Both FAILs share one root cause and do NOT indicate a compiled-routing regression (compiled==legacy holds on both):

- `CS-002` (`cross-stack-routing/non-webflow-plus-motion-dev.md`) and `CS-005` (`cross-stack-routing/snippet-reuse-cross-stack.md`) both author their prompt with the negated phrase **"non-Webflow"**.
- `router-replay.cjs`'s `detectSurface()` marker regex is `/src\/2_javascript|\bwebflow\b|\.webflow\b|--vw-/` -- a bare word-boundary substring match with no negation-awareness, so the literal word "Webflow" inside "non-Webflow" trips the WEBFLOW marker.
- Control check: `CS-004` (`for a hover state on cards, should I use motion.dev or plain CSS?`) contains no "webflow" substring at all and correctly resolves `surface: UNKNOWN` -- confirming the regex, not the intent-scoring layer, is the trigger.
- The compiled engine reproduces this identically (same `code-webflow` target), because compiled routing is built to match legacy byte-for-byte -- this is a **pre-existing legacy authoring/detection gap**, not something the compiled cutover introduced.
- Practical blast radius is small: `MOTION`-tier resources (the `code-webflow/references/animation/*` peer-resource tree) pass the surface filter unconditionally regardless of the `surface` value, so the actually-assembled resource set for both scenarios still contains **zero** Webflow-only implementation/checklist assets and does include every resource the scenario's own "Expected references loaded" list names.
- **Recommendation**: file a follow-up against `references/smart-routing.md` / `detectSurface()`'s WEBFLOW marker (e.g. a negative-lookbehind for `non-`/`not `/`without ` immediately before `webflow`) -- tracked as a finding from this sweep, not actioned here (out of this task's read-only, no-manifest/router-edit scope).

---

## 6. METHOD NOTES FOR THE FAN-OUT TO THE OTHER 6 HUBS

1. **Scenario-file structure varies by hub, and the loader already normalizes it** -- do not hand-parse. Run `node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs --skill .opencode/skills/<hub>` first; it auto-detects one of two shapes:
   - **sk-code shape** (index-table): a root `manual-testing-playbook.md` with a `FEATURE CATALOG CROSS-REFERENCE INDEX` table (`id | category | feature-file | critical`); the exact prompt lives in a per-feature-file fenced block after `**Exact prompt**`/`**Realistic user prompt**`, with the root table's own prompt cell as a fallback only.
   - **sk-doc shape** (frontmatter): per-scenario `.md` files with YAML frontmatter (`id`, `expected_intent`, `expected_resources`, `expected_workflow_mode`, `stage`, etc.) and no root index table -- e.g. `CB-CR-001` in this hub's own `compiled-routing/` folder uses this shape even though sk-code overall uses the index-table shape.
2. **The loader's `prompt` field is authoritative, not the root table's prompt cell.** They can genuinely differ (`SD-002` in this hub: root table says "Add a console.error fallback...", the per-feature file's own fenced prompt says "Handle empty prompts..." -- same target/intent, reworded, both route identically here, but do not assume they always will).
3. **`classKind` (routing / advisor / browser) tells you which scenarios a headless routing sweep can fully grade.** `browser`-class scenarios (category text matching motion/animation/browser/performance/visual/compositing/cross-browser) need a live browser tool this sweep does not have -- SKIP with that reason, do not fabricate console/video evidence. `advisor`-class scenarios (an explicit `SA-*` battery, or a pass criterion matching `top-1 !=`/`routes ... to <other skill>`) test cross-skill arbitration via `skill_advisor.py`, a different system than the intra-hub `resolve.cjs`/`router-replay.cjs` pair -- SKIP the full-scenario verdict, but still worth an informational compiled==legacy check on the same prompt.
4. **A `routing`-classified scenario can still be a non-routing deterministic check** -- watch for a scenario's own header stating "Expected detection: not applicable" (this hub: `TH-001`, `TH-002`, `DR-004`). These get picked up by the loader (they have a real prompt and no browser/advisor markers) and will still show a clean compiled==legacy routing result, but that result is informational only -- the scenario's real pass criterion is a separate script/hook exit-code or banner contract, usually with its own already-dated PASS evidence in the per-feature file worth citing instead of re-deriving.
5. **A `routing`-classified scenario can also assert *generated behavior* on top of a routing precondition** (this hub's `DR-001`/`DR-002`/`DR-003`: which restraint-ladder rung gets picked, whether the AI stalls, the exact wording of a ceiling comment). The routing precondition (surface/mode) is independently checkable and worth confirming, but the full scenario needs a live agent turn -- SKIP the full verdict, PASS the precondition explicitly as its own line item so the distinction is legible.
6. **Compare `compiled.targets[].workflowMode` (a set) against `legacy.intents` (a set) for drift, and separately compare `legacy.surface` / `legacy.resources` against the scenario's own documented "Expected surface" / "Expected references loaded" / "Expected NOT loaded" for scenario-authoring-intent correctness.** These are two different checks that can diverge independently: this sweep found 0 compiled-vs-legacy drift (31/31) but 2 scenarios where both engines agree with each other and disagree with the scenario's documented intent (a legacy quirk, not a compiled regression). Report both axes; do not collapse them into one PASS/FAIL.
7. **`env -u SPECKIT_COMPILED_ROUTING` is required, not optional**, to exercise the true default-on behavior -- an unset var resolves via the hub's membership in `DEFAULT_ON_HUBS` (a hard-coded 7-hub set in `resolve.cjs`), and a leftover `SPECKIT_COMPILED_ROUTING=0` in the shell environment would silently force every hub back to legacy without any error.
8. **A hub can carry a standalone "meta" compiled-routing scenario outside the root index** (this hub's `CB-CR-001` under `compiled-routing/`, not yet wired into sk-code's own `FEATURE CATALOG CROSS-REFERENCE INDEX`). Check every hub's playbook root directory listing, not just its own root-doc's declared category list, for an extra `compiled-routing/` (or similarly named) folder the root doc's "Canonical package artifacts" list omits.

