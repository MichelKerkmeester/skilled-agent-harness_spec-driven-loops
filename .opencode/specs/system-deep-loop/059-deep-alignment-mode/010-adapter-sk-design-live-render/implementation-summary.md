---
title: "Implementation Summary: Phase 10: adapter-sk-design-live-render"
description: "The sk-design live-render deep-alignment adapter, built as a pure-function dispatch wrapper: discover()/standardSource()/check() implemented and live-verified via 7 CLI dry-runs, zero direct chrome-devtools call sites confirmed by grep. A real, disclosed integration gap remains: design-mcp-open-design's live MCP tool surface has no tool that renders an arbitrary external URL or route, so check() consumes caller-supplied render evidence rather than rendering anything itself."
trigger_phrases:
  - "implementation"
  - "summary"
  - "phase 010"
  - "sk-design live-render adapter built"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/010-adapter-sk-design-live-render"
    last_updated_at: "2026-07-11T14:57:13Z"
    last_updated_by: "claude"
    recent_action: "Built+dry-ran adapter; documented real design-mcp-open-design tool-surface gap"
    next_safe_action: "Phase 008 resolves module-selection + lane-key gaps (Known Limitations #2/#3)"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_design_live_render_adapter.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-010"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Phase 008: module-selection (which adapter file a sk-design lane require()s) and lane-key (merge into 006's vs peer key) resolution"
    answered_questions:
      - "design_dispatch_boundary.md is a child-agent/small-model routing-proof envelope, not a callable render interface -- check() cannot invoke a function it does not expose"
      - "design-mcp-open-design's real ~18-tool MCP surface has no tool that renders an arbitrary external URL/route -- confirmed by full enumeration against tool_surface.md"
      - "check() is a pure function over caller-supplied options.renderResult; it never renders anything itself, by necessity not by choice"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-adapter-sk-design-live-render |
| **Status** | Complete |
| **Completed** | 2026-07-11 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two files implementing the ADR-003 three-method adapter contract (`discover(scope)`, `standardSource(authority)`, `check(artifact, rules, options)`) for `sk-design`'s live-render dimension, per ADR-009's LOCKED phase-010 decision. `spec.md` and `plan.md` name a chrome-devtools-driven audit dimension dispatched exclusively through `design-mcp-open-design`; this build implements that contract as a **pure-function dispatch wrapper** — `check()` never calls any transport itself. That is not a scope reduction; it is what the real, live `design-mcp-open-design` tool surface (fully enumerated and cross-checked against `tool_surface.md`) and the real MCP invocation model (agent tool-use loop only, never a spawned Node subprocess) actually make possible. See Known Limitations for the full, disclosed reasoning.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_design_live_render_adapter.md` | Create | 11-section specification: the contract, the peer-adapter lane-collision gap this build sharpened, the validated scope-value trace (which target shapes actually survive `scoping.cjs`), the `renderResult` contract this adapter defines as its own, the layer/mode/producedBy tagging reconciliation, and Section 8's central live-reality finding about `design_dispatch_boundary.md`. |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs` | Create | The executable adapter: target classifier, `discover()`, known-deviation suppression, `standardSource()`, deterministic threshold sub-checks, judgment-finding passthrough, the four short-circuit finding types, and a CLI (`discover`, `check --render-result`, `standard-source`). |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read phase 005's reference adapter in full (`sk_doc_adapter.md`, `sk-doc.cjs`) before writing anything, to match its shape rather than force-fit it — then adapted deliberately where this phase is structurally different (a dispatch wrapper, not a subprocess-shelling validator), per this task's own instruction. Read ADR-003/ADR-009/ADR-011/ADR-012 in the decision record, `discover_contract.md`, `lane_config_schema.md`, `design_dispatch_boundary.md`, `sk-design/SKILL.md`, both cited rubric files plus `ai_fingerprint_tells.md`, and `design-mcp-open-design`'s full reference set (`SKILL.md`, `tool_surface.md`, `design_parity_transport.md`, `od_cli_reference.md` excerpts) — not just the two files `spec.md` named, because the first pass through `design_dispatch_boundary.md` revealed it was not what `spec.md`/`plan.md` assumed it was (a callable dispatch interface), which made the wider read necessary to find what actually is callable.

Traced `scoping.cjs`'s `validateScope()` against `cli-guards.cjs`'s `validateNamespaceValue()` line by line rather than assuming which target shapes (URL, dev-server route, component entry) would actually reach this adapter — found, by direct trace, that a leading-slash route string is rejected upstream today, a full URL is not. Searched `sk-design/shared/scripts/` for a runtime validator of `DESIGN_BOUNDARY_PROOF v1` envelopes (the "checker" `design_dispatch_boundary.md` itself references) and found none, confirming that document is prose-and-schema only, consumed by agent reasoning, not by any script this adapter could call.

Wrote both files, then verified live rather than trusting the design on paper: `node --check` for syntax, then 7 CLI dry-runs covering `discover()` (mixed url/componentEntry/filtered-route/filtered-glob input), `check()`'s four short-circuits (no-renderResult, wrong-boundary, dispatch-rejected, auth-blocked), `check()`'s full deterministic-threshold-plus-judgment-passthrough path (a synthetic `renderResult` fixture with 2 contrast violations, 2 touch-target violations of different severities, 3 Core Web Vitals values with one correctly NOT flagged, and 2 judgment findings — one correctly dropped for missing evidence), and `standard-source`. Re-ran the dispatch-boundary compliance grep from `plan.md`'s own verification task against the real built files.

### Command Evidence

```
$ node --check .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs
SYNTAX_OK

$ node .../sk-design-live-render.cjs discover "http://localhost:3000/dashboard" "src/components/Button.tsx" "/leading-slash-route" "src/**/*.tsx"
-> 2 artifacts returned (url, componentEntry); the leading-slash route and the glob-metachar
   value were both correctly excluded, not silently mis-classified.

$ node .../sk-design-live-render.cjs check "http://localhost:3000/dashboard"
-> [{ "severity": "P1", "type": "render-unavailable", ... }]   (no renderResult supplied)

$ echo '{"dispatchedThrough":"mcp-chrome-devtools", ...}' | node .../sk-design-live-render.cjs check <target> --render-result -
-> [{ "severity": "P0", "type": "dispatch-boundary-violation", ... }]

$ node .../sk-design-live-render.cjs check <target> --render-result <full-fixture.json>
-> 7 findings: 2x contrast-below-threshold (P0 body-text, P1 UI-component), 2x
   touch-target-below-threshold (P1 below-24px-floor, P2 below-44px-only), 2x
   core-web-vital-below-threshold (LCP P1, CLS P1 -- INP correctly NOT flagged, it was
   under its 200ms floor), 1x live-render-judgment (P2, reasoning-agent) -- the second
   judgmentFindings entry (no evidence field) was correctly dropped, never fabricated.

$ node .../sk-design-live-render.cjs standard-source
-> real fs.readFileSync-reachable paths to accessibility_performance.md,
   anti_patterns_production.md, ai_fingerprint_tells.md, plus the 10 cited thresholds.

$ rg -n "mcp-chrome-devtools|mcp__.*chrome" \
    .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs \
    .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_design_live_render_adapter.md
-> 6 matches, all prose (the .cjs header comment and 5 lines of the .md's Section 4/8/9)
   explaining why the tool is NOT called. Zero call sites (no require(), no spawnSync(),
   no MCP tool invocation of any chrome-devtools tool anywhere in either file).
```
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `check()` is a pure function over caller-supplied `options.renderResult`, never a renderer | The real, live `design-mcp-open-design` MCP tool surface (fully enumerated, `tool_surface.md:42-90`) has no tool that renders an arbitrary external URL/route — its render capability is scoped to Open Design's own generated projects. MCP tools are also only invocable from an agent's own tool-use loop, never from a spawned Node subprocess the way `sk-doc.cjs` shells to `python3`. Inventing a working call here would fabricate a capability that does not exist; this is the same "wraps, does not reimplement" discipline `sk-doc_adapter.md` states, applied to a case where there is nothing local to wrap at all. |
| `renderResult.dispatchedThrough` is validated as a literal string equality check, not trusted implicitly | ADR-009's LOCKED constraint ("never a parallel chrome-devtools path") needed a concrete enforcement point given `check()` cannot itself dispatch. Checking the caller's self-report is the closest mechanical enforcement available to a pure function — a `renderResult` claiming any other origin is refused with a P0 finding rather than silently processed. |
| Two distinct tag fields (`layer: 'live-render'` and `producedBy: 'deterministic'\|'reasoning-agent'\|'unavailable'`), not one overloaded `layer` field | `plan.md`'s own design used `layer` to mean "which adapter produced this" while `sk-doc.cjs`'s established `layer` vocabulary means "how was this produced" (ADR-008's honesty axis). Both meanings are real and needed; picking one silently would have either broken ADR-008's honesty discipline or contradicted `plan.md`'s own stated design. Keeping both, named plainly as a reconciled tension (adapter spec Section 7), was the only option that dropped neither. |
| `discover()` supports exactly two target kinds (`url`, `componentEntry`), not the three `plan.md` named | Traced `scoping.cjs`'s real `validateScope()` against `cli-guards.cjs`'s `validateNamespaceValue()` and found a bare leading-slash route string is rejected upstream, before `discover()` is ever called, as an "absolute path escaping the repository root." This is real, current, verified behavior of code neither this phase nor phase 004 owns changing — recorded as a scoping-layer gap, not silently worked around inside this adapter. |
| Known-deviation list location named but the file itself not created | `sk-doc`'s list was seeded from real 130-packet findings, never invented for the occasion. This adapter has never produced a real finding from a real live-render run (it cannot, standalone) — inventing plausible entries would be exactly the fabrication ADR-005's suppression-list discipline forbids. `loadKnownDeviations()` degrades to `[]` gracefully, matching `sk-doc.cjs`'s own missing-file handling. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check .../sk-design-live-render.cjs` | PASS — `SYNTAX_OK` |
| `discover()` live dry-run (4 mixed target values) | PASS — 2 kept (url, componentEntry), 2 correctly filtered (leading-slash route, glob metachar) |
| `check()` live dry-run — no `renderResult` | PASS — single `render-unavailable` P1 finding, no crash, no fabricated pass |
| `check()` live dry-run — wrong `dispatchedThrough` | PASS — single `dispatch-boundary-violation` P0 finding |
| `check()` live dry-run — `authBlocked: true` | PASS — single `render-blocked-auth-required` P1 finding |
| `check()` live dry-run — `dispatchRejected` string | PASS — surfaced verbatim as the finding message |
| `check()` live dry-run — full measurements + judgmentFindings | PASS — 7 findings, every threshold correctly triggered or not-triggered per the cited numeric floor, 1 judgment finding correctly dropped for missing `evidence` |
| `standard-source` live dry-run | PASS — real, existing file paths plus the 10 cited thresholds |
| `rg -n "mcp-chrome-devtools\|mcp__.*chrome"` against both new files | PASS — zero call sites, 6 prose-only matches |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` | See the standalone report in this task's final summary — run after this document, findings (if any) fixed in place. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`design-mcp-open-design`'s live MCP tool surface cannot render an arbitrary external URL or dev-server route — confirmed by full enumeration, not assumed.** All ~18 tools are named and classified in `tool_surface.md:42-90` (`list_projects`, `get_active_context`, `get_artifact`, `get_project`, `get_file`, `search_files`, `list_files`, `list_skills`, `list_plugins`, `list_agents`, `get_run`, `create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, `delete_file`, `delete_project`). The only render-producing path (`start_run` -> discovery form -> build -> `previewUrl`) generates a brand-new Open Design project from a brief; its output is scoped to that generation's own project, never an arbitrary caller-supplied target. `check()` is consequently a pure function over caller-supplied `options.renderResult`, never a renderer — this is the adapter working correctly given the real, verified constraint, not an unfinished implementation. Closing this for real requires either `design-mcp-open-design` growing a new tool, or ADR-009 being revisited; both are outside this phase's scope-lock.
2. **`design_dispatch_boundary.md` is not a callable render interface.** Read on its own terms it is a `DESIGN_BOUNDARY_PROOF v1` **envelope schema** for child-agent/small-model dispatch-proof, consumed by an unspecified "checker" this build could not locate as a runtime script anywhere under `sk-design/shared/scripts/` (7 scripts present, none validates this envelope by name). Its only other real citation in the `sk-design` tree (`design-interface/SKILL.md:296`) is about dispatch *into the interface mode*, a different concern from rendering a URL. `spec.md` REQ-001 and `plan.md`'s Architecture section both cited it as part of "the dispatch boundary" this adapter calls through; this build corrects that framing rather than silently inheriting it — `check()` validates a caller's self-reported `dispatchedThrough` field, it does not invoke anything `design_dispatch_boundary.md` exposes, because that document exposes no function or entry-point at all. Full finding: adapter spec Section 8.
3. **Phase 008's module-selection and lane-key gaps, sharpened from the single gap `plan.md` originally named.** `scoping.cjs`'s live `AUTHORITY_ARTIFACT_CLASSES['sk-design'] = ['designs']` and the lane-config schema's `additionalProperties: false` three-field shape (`authority`, `artifactClass`, `scope`) mean a resolved `sk-design` lane cannot today distinguish "route to phase 006's static adapter" from "route to this live-render adapter" — a module-selection gap upstream of the lane-key question `plan.md`'s REQ-005 already named. Both are correctly phase 008's to close (this phase's Out of Scope explicitly excludes "wiring this adapter into the iterate/converge loop"), and both are now named precisely rather than left as the one vaguer note this plan originally carried. Adapter spec Section 1.
4. **The known-deviation list is not yet seeded.** Its location is named (`references/adapters/sk_design_live_render_known_deviations.md`), but the file does not exist — no real live-render run has ever produced a finding worth suppressing, and inventing plausible entries would violate ADR-005's own "not a dumping ground" discipline (`sk_doc_known_deviations.md` Section 7). `loadKnownDeviations()` degrades to `[]` gracefully; seeding this list is future work gated on a real run.
5. **No unit-test suite (`vitest`) exists for this adapter.** Verification in this pass was live CLI dry-runs plus `node --check`, not an automated suite matching `system-deep-loop/deep-review/scripts/tests/`'s convention. Named honestly in `plan.md`'s Testing Strategy rather than silently omitted.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
