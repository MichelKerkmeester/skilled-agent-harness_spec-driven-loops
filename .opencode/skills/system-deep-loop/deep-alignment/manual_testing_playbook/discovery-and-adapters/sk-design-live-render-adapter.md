---
title: "DAL-014 -- sk-design-live-render adapter: render-evidence contract"
description: "Verify the live-render adapter never renders anything itself: check() requires caller-supplied renderResult (via design-mcp-open-design), returns an honest render-unavailable finding when absent, rejects a wrong dispatch boundary with a P0, and runs threshold checks only over supplied measurements."
version: 1.0.0.0
---

# DAL-014 -- sk-design-live-render adapter: render-evidence contract

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-014`.

---

## 1. OVERVIEW

This scenario validates the sk-design live-render adapter for `DAL-014`. The objective is to verify that this adapter NEVER renders anything itself: `discover()` classifies `url` vs `componentEntry` targets (a `branchRange` scope returns empty); `check()` requires `options.renderResult` — evidence the caller obtained by dispatching through `design-mcp-open-design` — and returns a single honest `render-unavailable` finding when absent; a `renderResult` not reporting the required dispatch boundary is rejected with a P0; and threshold checks (contrast, touch-target, Core Web Vitals) run only over supplied `measurements`, with `judgmentFindings` requiring cited `evidence` + `rubricSection`.

### WHY THIS MATTERS

The only capability that can render a live target (design-mcp-open-design) is callable from an agent's tool-use loop, not a spawned subprocess, and has no arbitrary-URL renderer anyway (ADR-009). A live-render adapter that faked a render, or fabricated a pass when it could not render, would produce dangerously misleading accessibility findings. Honest unavailability is the correct behavior.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify the adapter never renders standalone, requires renderResult, enforces the dispatch boundary, and never fabricates a pass.
- Real user request: Audit the live accessibility of this rendered page against sk-design's thresholds.
- Prompt: `Validate the sk-design-live-render alignment adapter: it never renders standalone, requires renderResult, enforces the design-mcp-open-design dispatch boundary, and never fabricates a pass.`
- Expected execution process: Run `discover` on a URL + a component path, run `check` with no render-result (expect a single render-unavailable finding), run `check` with a valid supplied render-result JSON (expect threshold findings), and read the four short-circuit conditions plus `REQUIRED_DISPATCH_BOUNDARY`.
- Desired user-facing outcome: The user is told this adapter cannot render on its own — the driving agent must supply render evidence via design-mcp-open-design — and that when evidence is absent or from the wrong boundary, the adapter says so honestly instead of passing.
- Expected signals: `discover()` classifies `url` vs `componentEntry` targets (branchRange->empty); `check()` with no `renderResult` returns exactly one `render-unavailable` P1 finding (`producedBy:'unavailable'`); a `renderResult.dispatchedThrough` other than `design-mcp-open-design` returns a `dispatch-boundary-violation` P0; supplied `measurements` drive contrast/touch-target/CWV threshold findings; `judgmentFindings` require `evidence` + `rubricSection`.
- Pass/fail posture: PASS if the adapter never renders, honestly reports unavailability, enforces the dispatch boundary, and only produces threshold/judgment findings from supplied evidence. FAIL if it fabricates a pass, renders itself, or accepts a wrong-boundary render-result.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so discover and the no-evidence path are exercised before the with-evidence path.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the sk-design-live-render alignment adapter: it never renders standalone, requires renderResult, enforces the design-mcp-open-design dispatch boundary, and never fabricates a pass.
### Commands
1. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs discover http://localhost:3000/dashboard src/components/Button.tsx`
2. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs check http://localhost:3000/dashboard`
3. `bash: printf '{"dispatchedThrough":"design-mcp-open-design","renderedAt":"2026-07-11T12:00:00Z","measurements":{"contrastRatios":[{"element":"body","ratio":3.1}]}}' | node .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs check http://localhost:3000/dashboard --render-result -`
4. `bash: rg -n 'REQUIRED_DISPATCH_BOUNDARY|render-unavailable|dispatch-boundary-violation|NEVER renders|producedBy|judgmentFindings|rubricSection' .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs`
### Expected
`discover` returns a `url` target and a `componentEntry` target. `check` with no render-result returns exactly one `render-unavailable` P1 finding (`producedBy:'unavailable'`). `check` with the supplied render-result (contrast 3.1 < 4.5 body floor) returns a `contrast-below-threshold` P0 with `producedBy:'deterministic'` and `evidenceLabel:'confirmed'` (fresh timestamp). The source shows `REQUIRED_DISPATCH_BOUNDARY = 'design-mcp-open-design'`, the four short-circuit conditions, and the judgment-finding citation gate.
### Evidence
Capture the discover output, the render-unavailable finding, the with-evidence threshold finding, and the source lines proving the never-render contract and the dispatch-boundary enforcement.
### Pass/Fail
PASS if the adapter never renders, honestly reports unavailability, enforces the dispatch boundary, and only produces findings from supplied evidence. FAIL if it fabricates a pass, renders itself, or accepts a wrong-boundary render-result.
### Failure Triage
If `check` with no render-result returns zero findings (a silent pass) instead of a `render-unavailable` finding, the honest-unavailability contract is broken. Feed a `dispatchedThrough` of `"chrome-devtools"` to confirm it returns a `dispatch-boundary-violation` P0 rather than proceeding.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `discovery-and-adapters/` | Adapter category; the live-render adapter CLI is exercised directly here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs` | discover/check, `REQUIRED_DISPATCH_BOUNDARY`, four short-circuit conditions, threshold checks |
| `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_design_live_render_adapter.md` | Full adapter specification incl. Section 8 (no standalone renderer) |
| `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md` | The threshold source (contrast/touch-target/CWV values) the adapter cites |

---

## 5. SOURCE METADATA

- Group: DISCOVERY AND ADAPTERS
- Playbook ID: DAL-014
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `discovery-and-adapters/sk-design-live-render-adapter.md`
- Note: This adapter's known-deviation list file does not exist yet (`sk_design_live_render_known_deviations.md`); `loadKnownDeviations()` degrades gracefully to `[]`, which is a documented, intended state, not a defect.
