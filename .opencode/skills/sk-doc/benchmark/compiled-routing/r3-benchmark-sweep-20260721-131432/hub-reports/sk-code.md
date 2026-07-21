# Skill Benchmark Report — sk-code

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: BLOCKED-BY-ROUTE-GOLD** · aggregate 83/100

## Coverage

- Scored (text executors): **23** · routed out to browser harness: **7**
- By class — routing: 21 · advisor: 2 · browser: 7
- By stage — holdout: 0 · negative (suppression): 6

## Generalization (fitted vs holdout)

- Fitted aggregate: **83/100** · holdout: _none declared_ · negatives: 6
- _no holdout-staged scenarios; fitted aggregate equals the overall score (score-preserving)_

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 90/100 |
| D2 discovery | 20pts | 84/100 |
| D3 efficiency | 15pts | 65/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Route gold (hard lane)

- Gate: **ENFORCED** (flag `on`) · rows scored: **15** · matches: **5** · violations: **10** (gold parse failures: 0)
- ⚠ **Route-gold violation(s) fail this run** — a route mismatch cannot remain a PASS while the gate is on.

| Scenario | Intent | Resources | Expected | Observed |
| -------- | ------ | --------- | -------- | -------- |
| SD-001 | ok | MISMATCH | intent: —<br>resources: references/stack-detection.md<br>references/smart-routing.md<br>references/phase-detection.md<br>references/universal/code-quality-standards.md<br>code-webflow/references/implementation/webflow-patterns/overview-limits-and-collection-lists.md<br>code-webflow/references/implementation/animation-workflows/overview-decision-tree-and-css.md<br>code-webflow/references/implementation/observer-patterns/mutation-and-intersection.md<br>code-webflow/references/javascript/quality-standards/init-dom-error-and-async.md<br>code-webflow/references/javascript/style-guide/overview-naming-and-structure.md<br>code-webflow/references/css/style-guide.md<br>code-webflow/references/shared/cross-language-rules.md | intent: code-webflow<br>resources: references/stack-detection.md<br>references/phase-detection.md<br>references/smart-routing.md<br>references/universal/code-quality-standards.md<br>references/universal/multi-agent-research.md<br>code-webflow/references/implementation/implementation-workflows/condition-based-waiting.md<br>code-webflow/references/implementation/implementation-workflows/validation-minification-and-cdn.md<br>code-webflow/references/implementation/async-patterns/raf-ric-microtask-and-posttask.md<br>code-webflow/references/implementation/async-patterns/timing-compat-and-webflow.md<br>code-webflow/references/implementation/observer-patterns/mutation-and-intersection.md<br>code-webflow/references/implementation/observer-patterns/resize-best-practices-and-shared.md<br>code-webflow/references/implementation/security-patterns/overview-and-checklist.md<br>code-webflow/references/implementation/security-patterns/owasp-prototype-and-safe-access.md<br>code-webflow/references/implementation/third-party-integrations/overview-hls-and-lenis.md<br>code-webflow/references/implementation/third-party-integrations/botpoison-and-finsweet.md<br>code-webflow/references/implementation/third-party-integrations/filepond.md<br>code-webflow/references/implementation/third-party-integrations/best-practices-and-summary.md<br>code-webflow/references/implementation/webflow-patterns/overview-limits-and-collection-lists.md<br>code-webflow/references/implementation/webflow-patterns/development-and-production.md<br>code-webflow/references/implementation/webflow-patterns/finsweet-custom-select-bridge.md<br>code-webflow/references/shared/dev-workflow/overview-nav-and-logging.md<br>code-webflow/references/shared/dev-workflow/automation-errors-and-compat.md<br>code-webflow/references/shared/dev-workflow/common-commands.md<br>code-webflow/references/shared/dev-workflow/checklists-and-decision-matrix.md<br>code-webflow/references/implementation/animation-workflows/overview-decision-tree-and-css.md<br>code-webflow/references/implementation/animation-workflows/motion-dev-and-performance.md<br>code-webflow/references/implementation/animation-workflows/testing-and-common-issues.md<br>code-webflow/references/implementation/animation-workflows/motion-dev-advanced.md<br>code-webflow/references/implementation/swiper-patterns/overview-timeline-and-marquee.md<br>code-webflow/references/implementation/swiper-patterns/autoplay-accessibility-and-naming.md<br>code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md |
| SD-002 | ok | MISMATCH | intent: —<br>resources: references/stack-detection.md<br>references/smart-routing.md<br>references/universal/code-quality-standards.md<br>code-opencode/references/shared/code-organization/overview-and-module-organization.md<br>code-opencode/references/shared/universal-patterns/naming-and-commenting.md<br>code-opencode/references/typescript/style-guide/overview-strict-and-naming.md<br>code-opencode/references/typescript/quality-standards/overview-and-type-system.md<br>code-opencode/references/typescript/quick-reference/template-naming-and-types.md | intent: code-opencode<br>resources: references/stack-detection.md<br>references/phase-detection.md<br>references/smart-routing.md<br>references/universal/code-quality-standards.md<br>code-opencode/references/typescript/style-guide/overview-strict-and-naming.md<br>code-opencode/references/typescript/style-guide/formatting-imports-and-coexistence.md<br>code-opencode/references/typescript/quality-standards/overview-and-type-system.md<br>code-opencode/references/typescript/quality-standards/tsdoc-errors-and-async.md<br>code-opencode/references/typescript/quality-standards/tsconfig-and-modules.md<br>code-opencode/references/typescript/quick-reference/template-naming-and-types.md<br>code-opencode/references/typescript/quick-reference/imports-errors-and-tsconfig.md |
| LS-001 | ok | MISMATCH | intent: —<br>resources: code-opencode/references/typescript/style-guide/overview-strict-and-naming.md<br>code-opencode/references/typescript/quality-standards/overview-and-type-system.md<br>code-opencode/references/typescript/quick-reference/template-naming-and-types.md<br>code-opencode/references/shared/code-organization/overview-and-module-organization.md<br>code-opencode/references/shared/universal-patterns/naming-and-commenting.md | intent: code-opencode<br>resources: references/stack-detection.md<br>references/phase-detection.md<br>references/smart-routing.md<br>references/universal/code-quality-standards.md<br>code-opencode/references/typescript/style-guide/overview-strict-and-naming.md<br>code-opencode/references/typescript/style-guide/formatting-imports-and-coexistence.md<br>code-opencode/references/typescript/quality-standards/overview-and-type-system.md<br>code-opencode/references/typescript/quality-standards/tsdoc-errors-and-async.md<br>code-opencode/references/typescript/quality-standards/tsconfig-and-modules.md<br>code-opencode/references/typescript/quick-reference/template-naming-and-types.md<br>code-opencode/references/typescript/quick-reference/imports-errors-and-tsconfig.md |
| LS-002 | ok | MISMATCH | intent: —<br>resources: code-opencode/references/python/style-guide.md<br>code-opencode/references/python/quality-standards.md<br>code-opencode/references/python/quick-reference.md<br>code-opencode/references/shared/code-organization/overview-and-module-organization.md<br>code-opencode/references/shared/universal-patterns/naming-and-commenting.md | intent: code-opencode<br>resources: references/stack-detection.md<br>references/phase-detection.md<br>references/smart-routing.md<br>references/universal/code-quality-standards.md<br>code-opencode/references/python/style-guide.md<br>code-opencode/references/python/quality-standards.md<br>code-opencode/references/python/quick-reference.md |
| LS-003 | ok | MISMATCH | intent: —<br>resources: code-opencode/references/shell/style-guide/overview-structure-and-naming.md<br>code-opencode/references/shell/quality-standards/overview-and-priority-blockers.md<br>code-opencode/references/shell/quick-reference/template-variables-and-loops.md<br>code-opencode/references/shared/code-organization/overview-and-module-organization.md<br>code-opencode/references/shared/universal-patterns/naming-and-commenting.md | intent: quality<br>code-opencode<br>resources: references/stack-detection.md<br>references/phase-detection.md<br>references/smart-routing.md<br>references/universal/code-quality-standards.md<br>code-opencode/references/shell/style-guide/overview-structure-and-naming.md<br>code-opencode/references/shell/style-guide/variables-functions-and-output.md<br>code-opencode/references/shell/quality-standards/overview-and-priority-blockers.md<br>code-opencode/references/shell/quality-standards/validation-security-and-shellcheck.md<br>code-opencode/references/shell/quick-reference/template-variables-and-loops.md<br>code-opencode/references/shell/quick-reference/functions-strings-and-checklist.md |
| LS-004 | ok | MISMATCH | intent: —<br>resources: code-opencode/references/config/style-guide.md<br>code-opencode/references/config/quality-standards.md<br>code-opencode/references/config/quick-reference.md<br>code-opencode/references/shared/code-organization/overview-and-module-organization.md<br>code-opencode/references/shared/universal-patterns/naming-and-commenting.md | intent: code-opencode<br>resources: references/stack-detection.md<br>references/phase-detection.md<br>references/smart-routing.md<br>references/universal/code-quality-standards.md<br>code-opencode/references/config/style-guide.md<br>code-opencode/references/config/quality-standards.md<br>code-opencode/references/config/quick-reference.md |
| CS-001 | ok | MISMATCH | intent: —<br>resources: references/stack-detection.md<br>references/smart-routing.md<br>code-webflow/references/implementation/animation-workflows/overview-decision-tree-and-css.md<br>code-webflow/references/implementation/observer-patterns/mutation-and-intersection.md<br>code-webflow/references/implementation/third-party-integrations/overview-hls-and-lenis.md<br>code-webflow/references/verification/verification-workflows/gate-and-automated-options.md<br>code-webflow/references/animation/quick-start.md<br>code-webflow/references/animation/integration-patterns.md<br>code-webflow/references/animation/scroll-and-gestures.md<br>code-webflow/references/animation/performance-and-pitfalls.md | intent: code-webflow<br>resources: references/stack-detection.md<br>references/phase-detection.md<br>references/smart-routing.md<br>references/universal/code-quality-standards.md<br>code-webflow/references/animation/quick-start.md<br>code-webflow/references/animation/animation-principles.md<br>code-webflow/references/animation/animate-and-timelines.md<br>code-webflow/references/animation/scroll-and-gestures.md<br>code-webflow/references/animation/integration-patterns.md<br>code-webflow/references/animation/decision-matrix.md<br>code-webflow/references/animation/performance-and-pitfalls.md<br>code-webflow/references/deployment/cdn-deployment.md<br>code-webflow/references/deployment/minification-guide/overview-terser-and-patterns.md<br>code-webflow/references/deployment/minification-guide/workflow-verification-and-debugging.md<br>code-webflow/references/deployment/minification-guide/batch-rules-and-related.md<br>code-webflow/references/deployment/webflow-staging-production.md<br>code-webflow/references/implementation/animation-workflows/overview-decision-tree-and-css.md<br>code-webflow/references/implementation/animation-workflows/motion-dev-and-performance.md<br>code-webflow/references/implementation/animation-workflows/testing-and-common-issues.md<br>code-webflow/references/implementation/animation-workflows/motion-dev-advanced.md<br>code-webflow/references/implementation/swiper-patterns/overview-timeline-and-marquee.md<br>code-webflow/references/implementation/swiper-patterns/autoplay-accessibility-and-naming.md<br>code-webflow/references/implementation/swiper-patterns/initialization-and-troubleshooting.md |
| CS-003 | ok | MISMATCH | intent: —<br>resources: references/stack-detection.md<br>references/smart-routing.md<br>code-opencode/references/shared/universal-patterns/naming-and-commenting.md<br>code-opencode/references/shared/code-organization/overview-and-module-organization.md<br>code-opencode/references/typescript/quick-reference/template-naming-and-types.md<br>code-opencode/references/typescript/style-guide/overview-strict-and-naming.md<br>code-opencode/references/typescript/quality-standards/overview-and-type-system.md<br>code-webflow/references/animation/quick-start.md<br>code-webflow/references/animation/integration-patterns.md<br>code-webflow/references/animation/animate-and-timelines.md | intent: code-opencode<br>resources: references/stack-detection.md<br>references/phase-detection.md<br>references/smart-routing.md<br>references/universal/code-quality-standards.md<br>code-webflow/references/animation/quick-start.md<br>code-webflow/references/animation/animation-principles.md<br>code-webflow/references/animation/animate-and-timelines.md<br>code-webflow/references/animation/scroll-and-gestures.md<br>code-webflow/references/animation/integration-patterns.md<br>code-webflow/references/animation/decision-matrix.md<br>code-webflow/references/animation/performance-and-pitfalls.md<br>code-opencode/references/typescript/style-guide/overview-strict-and-naming.md<br>code-opencode/references/typescript/style-guide/formatting-imports-and-coexistence.md<br>code-opencode/references/typescript/quality-standards/overview-and-type-system.md<br>code-opencode/references/typescript/quality-standards/tsdoc-errors-and-async.md<br>code-opencode/references/typescript/quality-standards/tsconfig-and-modules.md<br>code-opencode/references/typescript/quick-reference/template-naming-and-types.md<br>code-opencode/references/typescript/quick-reference/imports-errors-and-tsconfig.md |
| CS-005 | ok | MISMATCH | intent: —<br>resources: references/stack-detection.md<br>references/smart-routing.md<br>code-webflow/references/animation/quick-start.md<br>code-webflow/references/animation/integration-patterns.md<br>code-webflow/references/animation/scroll-and-gestures.md<br>code-webflow/references/javascript/style-guide/overview-naming-and-structure.md | intent: code-webflow<br>resources: references/stack-detection.md<br>references/phase-detection.md<br>references/smart-routing.md<br>references/universal/code-quality-standards.md<br>references/universal/code-style-guide.md<br>code-webflow/references/shared/cross-language-rules.md<br>code-webflow/references/shared/enforcement.md<br>code-webflow/references/animation/quick-start.md<br>code-webflow/references/animation/animation-principles.md<br>code-webflow/references/animation/animate-and-timelines.md<br>code-webflow/references/animation/scroll-and-gestures.md<br>code-webflow/references/animation/integration-patterns.md<br>code-webflow/references/animation/decision-matrix.md<br>code-webflow/references/animation/performance-and-pitfalls.md |
| CS-007 | ok | MISMATCH | intent: —<br>resources: references/stack-detection.md<br>references/smart-routing.md<br>code-webflow/references/implementation/animation-workflows/overview-decision-tree-and-css.md<br>code-webflow/references/javascript/quality-standards/init-dom-error-and-async.md<br>code-webflow/references/verification/verification-workflows/gate-and-automated-options.md<br>code-webflow/references/animation/performance-and-pitfalls.md<br>code-webflow/references/animation/integration-patterns.md | intent: code-webflow<br>resources: references/stack-detection.md<br>references/phase-detection.md<br>references/smart-routing.md<br>references/universal/code-quality-standards.md<br>code-webflow/references/animation/performance-and-pitfalls.md<br>code-webflow/references/implementation/animation-workflows/overview-decision-tree-and-css.md<br>code-webflow/references/implementation/animation-workflows/motion-dev-and-performance.md<br>code-webflow/references/implementation/animation-workflows/testing-and-common-issues.md<br>code-webflow/references/implementation/animation-workflows/motion-dev-advanced.md<br>code-webflow/references/verification/verification-workflows/gate-and-automated-options.md<br>code-webflow/references/verification/verification-workflows/requirements-rules-and-checklist.md<br>code-webflow/references/animation/quick-start.md<br>code-webflow/references/animation/animation-principles.md<br>code-webflow/references/animation/animate-and-timelines.md<br>code-webflow/references/animation/scroll-and-gestures.md<br>code-webflow/references/animation/integration-patterns.md<br>code-webflow/references/animation/decision-matrix.md |

## Compiled routing parity

- Sub-verdict: **compiled-serving** · child flag forced on: **yes** · parent flag: `force-on` · parity mode: `on`
- Scored: **23** · match: **23** · drift: **0** · vacuous: **0** · resolver-missing: **0** · n/a: **0**
- Eligible rows: **23** · drift rows: **0** · breakages: **0**
- Frozen scorer hashes unchanged: **yes**
- Drift gate: single blocking owner `lane-c-compiled-parity` · report-only consumers: routing-registry-drift-ci

| Scenario | Hub | Status | Front door | Reason | First difference |
| -------- | --- | ------ | ---------- | ------ | ---------------- |
| SD-001 | sk-code | match | route | routing-parity-match |  |
| SD-002 | sk-code | match | route | routing-parity-match |  |
| SD-003 | sk-code | match | defer | routing-parity-match |  |
| LS-001 | sk-code | match | route | routing-parity-match |  |
| LS-002 | sk-code | match | route | routing-parity-match |  |
| LS-003 | sk-code | match | route | routing-parity-match |  |
| LS-004 | sk-code | match | route | routing-parity-match |  |
| RD-001 | sk-code | match | route | routing-parity-match |  |
| RD-002 | sk-code | match | route | routing-parity-match |  |
| SA-001 | sk-code | match | defer | routing-parity-match |  |
| CS-001 | sk-code | match | route | routing-parity-match |  |
| CS-002 | sk-code | match | route | routing-parity-match |  |
| CS-003 | sk-code | match | route | routing-parity-match |  |
| CS-004 | sk-code | match | route | routing-parity-match |  |
| CS-005 | sk-code | match | route | routing-parity-match |  |
| CS-006 | sk-code | match | route | routing-parity-match |  |
| CS-007 | sk-code | match | route | routing-parity-match |  |
| DR-001 | sk-code | match | route | routing-parity-match |  |
| DR-002 | sk-code | match | route | routing-parity-match |  |
| DR-003 | sk-code | match | route | routing-parity-match |  |
| DR-004 | sk-code | match | defer | routing-parity-match |  |
| TH-001 | sk-code | match | route | routing-parity-match |  |
| TH-002 | sk-code | match | route | routing-parity-match |  |

## Funnel

- discovered: 1
- passed: 22

**Headline bottleneck: discovered**

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | funnel_attrition | discovered | 1 scenario(s) first fail at stage 'discovered' |

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| SD-001 | routing | routing | 39/100 | discovered |
| SD-002 | routing | routing | 59/100 | passed |
| SD-003 | routing | negative | 100/100 | passed |
| LS-001 | routing | routing | 59/100 | passed |
| LS-002 | routing | routing | 77/100 | passed |
| LS-003 | routing | routing | 61/100 | passed |
| LS-004 | routing | routing | 77/100 | passed |
| RD-001 | routing | negative | 100/100 | passed |
| RD-002 | advisor | routing | 100/100 | passed |
| SA-001 | advisor | routing | 100/100 | passed |
| MR-001 | browser | routing | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| MR-002 | browser | routing | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| MR-003 | browser | routing | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| MR-004 | browser | routing | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| CB-001 | browser | routing | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| CB-002 | browser | routing | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| CB-003 | browser | routing | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| CS-001 | routing | routing | 55/100 | passed |
| CS-002 | routing | negative | 100/100 | passed |
| CS-003 | routing | routing | 52/100 | passed |
| CS-004 | routing | negative | 100/100 | passed |
| CS-005 | routing | negative | 75/100 | passed |
| CS-006 | routing | routing | 81/100 | passed |
| CS-007 | routing | routing | 67/100 | passed |
| DR-001 | routing | negative | 100/100 | passed |
| DR-002 | routing | routing | 100/100 | passed |
| DR-003 | routing | routing | 100/100 | passed |
| DR-004 | routing | routing | 100/100 | passed |
| TH-001 | routing | routing | 100/100 | passed |
| TH-002 | routing | routing | 100/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- SD-001: src/2_javascript, javascript, lenis, intersectionobserver
- SD-002: opencode, mcp, typescript, skill
- LS-001: opencode, mcp, config, skill
- LS-002: opencode, mcp, json, skill
- LS-003: add set -euo pipefail, opencode, skill
- LS-004: json
- RD-001: review, lenis, opencode, skill
- RD-002: sk-code, skill.md, skill
- CS-001: webflow, src/2_javascript, javascript, cdn, animation
- CS-002: sk-code, webflow, references
- CS-003: sk-code, review, opencode, skill
- CS-004: css, references
- CS-005: sk-code, webflow, references
- CS-006: sk-code, webflow, src/2_javascript, javascript, references
- CS-007: sk-code, webflow, src/2_javascript, javascript
- DR-001: opencode, mcp, skill
- DR-002: opencode, mcp, config, skill
- DR-003: review, opencode, skill
- TH-001: validation, opencode, mcp, skill
- TH-002: comment hygiene

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 30.
