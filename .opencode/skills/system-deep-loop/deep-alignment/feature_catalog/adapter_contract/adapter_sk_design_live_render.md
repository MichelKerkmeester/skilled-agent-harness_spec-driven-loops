---
title: "sk-design live-render adapter"
description: "The live-render authority adapter that wraps no local renderer and checks only caller-supplied render evidence obtained through design-mcp-open-design."
trigger_phrases:
  - "sk-design live-render adapter"
  - "render evidence renderResult"
  - "design-mcp-open-design dispatch boundary"
  - "render-unavailable finding"
  - "accessibility threshold checks"
version: 1.0.0.0
---

# sk-design live-render adapter

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The live-render authority adapter that wraps no local renderer and checks only caller-supplied render evidence obtained through `design-mcp-open-design`.

`sk-design-live-render.cjs` is the phase-010 peer of the static sk-design adapter, covering sk-design's live-render dimension (ADR-009). Its structural difference from every other adapter is that it shells out to nothing: the only capability that can render a live target is callable from an agent's own tool-use loop, never from a spawned subprocess, so `check()` is a pure function over render evidence the caller already obtained — never a renderer itself.

## 2. HOW IT WORKS

`discover()` classifies each scope value as a full `http(s)://` URL or a repo-relative `componentEntry` string (a bare leading-slash dev-server route cannot reach it — scoping rejects that shape upstream), with no directory or glob expansion in v1. `standardSource('sk-design')` returns the accessibility/anti-patterns/AI-fingerprint rubric doc paths and a `THRESHOLDS` table cited verbatim from `accessibility_performance.md`. `check()` requires `options.renderResult` — evidence the planned ITERATE-state driving agent (phase-009, not yet built) would obtain by dispatching through `design-mcp-open-design`. Four honest short-circuits each return a single finding instead of crashing or fabricating a pass: no `renderResult` → `render-unavailable`; a `dispatchedThrough` that is not `design-mcp-open-design` → `dispatch-boundary-violation` (P0, ADR-009 enforced as a literal value check); a rejected dispatch → `dispatch-rejected`; an auth-blocked target → `render-blocked-auth-required`. With valid evidence it runs deterministic threshold checks over the supplied `measurements` (contrast, touch-target, Core Web Vitals) and passes through caller-verified `judgmentFindings`, then applies suppression. A parseable `renderedAt` raises the evidence label from `inferred` to `confirmed`.

Its known-deviations file does not exist yet — no real live-render run has ever produced a finding to seed it — and `loadKnownDeviations()` degrades gracefully to an empty list rather than erroring.

**Difference from deep-review:** deep-review never renders a live UI and has no notion of a dispatch boundary or render evidence. This adapter is unique even among deep-alignment's own adapters: it produces `unavailable`-labelled findings by design when it cannot get real evidence, encoding "honest gap over fabricated pass" as a first-class outcome rather than a fallback.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/adapters/sk-design-live-render.cjs` | Adapter | `discover`/`standardSource`/`check`, the target classifier, the four short-circuits, and the threshold checks over render evidence. |
| `references/adapters/sk_design_live_render_adapter.md` | Reference | Full specification: the peer relationship (Section 1), the no-local-renderer rationale (Section 8), the evidence-label vocabulary (Section 7). |
| `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md` | Standard source | The concrete-thresholds table the `THRESHOLDS` constant cites verbatim. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/adapters/sk-design-live-render.cjs` CLI (`discover`/`check [--render-result]`/`standard-source`) | Manual dry-run | Exercises the render-unavailable path and the evidence-supplied path for inspection. |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/010-adapter-sk-design-live-render/` | Spec phase | The live-render adapter's spec and acceptance criteria (ADR-009). |

---

## 4. SOURCE METADATA

- Group: Adapter contract
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `adapter-contract/adapter-sk-design-live-render.md`
- Primary sources: `scripts/adapters/sk-design-live-render.cjs`, `references/adapters/sk_design_live_render_adapter.md`
Related references:
- [adapter-sk-design.md](../adapter_contract/adapter_sk_design.md) — sk-design adapter
- [../alignment-contract/verify-first.md](../alignment_contract/verify_first.md) — Verify-first
