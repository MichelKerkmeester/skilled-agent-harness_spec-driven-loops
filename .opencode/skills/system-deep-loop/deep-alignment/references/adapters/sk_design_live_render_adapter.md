---
title: sk-design Live-Render Adapter — standardSource, discover, check
description: The concrete standardSource("sk-design")/discover(scope)/check(artifact,rules,options) specification for the live-render dimension of the sk-design authority (ADR-009's phase 010), dispatched exclusively through design-mcp-open-design — and the honest integration gap that boundary has today for an arbitrary live-render target.
trigger_phrases:
  - "sk-design live-render adapter"
  - "deep-alignment live-render check"
  - "design-mcp-open-design dispatch boundary adapter"
  - "chrome-devtools forbidden path sk-design"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# sk-design Live-Render Adapter

The concrete `standardSource("sk-design")` / `discover(scope)` / `check(artifact, rules, options)` specification for the **live-render** dimension of the `sk-design` authority — ADR-009's phase 010, a peer of phase 006's static `DESIGN.md`/`tokens.json` adapter and phase 007's `sk-code` adapter. This document follows phase 005's `sk_doc_adapter.md` shape (same three-method contract, same "specify then wrap" discipline), but the wrapping is structurally different: `sk-doc.cjs` shells out to two local, already-working Python validators; this adapter has **no locally-executable renderer to shell out to at all** — that is the load-bearing finding this document exists to state plainly (Section 8), not paper over.

---

## 1. OVERVIEW

### Contract This Adapter Implements

ADR-003 (`002-architecture-decision/decision-record.md`, ANCHOR `adr-003`) freezes the three-method, authority-agnostic contract: `discover(scope) -> artifacts`, `standardSource(authority) -> {templates, rules}`, `check(artifact, rules) -> findings`. ADR-009 (ANCHOR `adr-009`) adds this adapter as a new peer phase for `sk-design`'s live-render dimension, LOCKED to one constraint: `check()` dispatches exclusively through `design-mcp-open-design` — "never a parallel chrome-devtools path." `scripts/adapters/sk-design-live-render.cjs` is the real, executable code behind this specification.

### Peer Relationship to Phase 006's Static Adapter — and a Real Lane-Collision Gap

Phase 006 (not yet built at the time of this writing) owns `sk-design`'s **static** adapter (`DESIGN.md`/`tokens.json` conformance). This adapter owns the **live-render** dimension. Both are, per `scoping.cjs`'s live registry, the *same* authority/artifact-class pair: `AUTHORITY_ARTIFACT_CLASSES['sk-design'] = ['designs']` (`.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs:51`), and the lane-config schema's per-lane object carries exactly three fields — `authority`, `artifactClass`, `scope`, `additionalProperties: false` (`lane_config_schema.md:85-132`) — with **no fourth field** to say "route this `sk-design` lane to the live-render module instead of the static one." `plan.md`'s own Data Flow section already flagged half of this ("however phase 004's scoping tree names this variant — a REQ-005-level open question"); this document sharpens it into two distinct, concrete gaps for phase 004/008 to close, not one:

1. **Module-selection gap (upstream, ITERATE-state).** Given a resolved lane `{authority:'sk-design', artifactClass:'designs', scope}`, nothing in the current schema tells phase 008's engine whether to `require()` phase 006's module or this one. Today, both would implement `standardSource('sk-design')`, and the two return *semantically different* rubrics (static token/structure rules vs. this adapter's live accessibility/performance/anti-slop rubric) — a caller invoking the wrong one would not error, it would silently check the wrong thing.
2. **Reducer lane-key gap (downstream, REPORT-state).** REQ-005's own acceptance criteria, already correctly named in `spec.md`: whether this adapter's findings merge into phase 006's `sk-design` lane key or form a peer key (`sk-design-live-render`) in phase 008's reducer.

This adapter does not resolve either gap — both are phase 008's to close (`spec.md` Out of Scope: "Wiring this adapter into the iterate/converge loop - owned by phase 008"). What this adapter does instead: it self-identifies unambiguously in its own output so whichever mechanism phase 008 eventually builds has something concrete to key on. Every finding this adapter emits carries `authority: 'sk-design'` (the true ADR-003 authority, matching the registered lane) **and** `mode: 'live-render'` (this adapter's own distinguishing tag, reusing `plan.md`'s own Data Flow vocabulary "authority=sk-design, mode=live-render" verbatim rather than inventing new terms) — see Section 7.

### Dependency Note: What `scope.values` Shapes Actually Survive `scoping.cjs` Today

Phase 004's `discover_contract.md` (`.opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md`, confirmed live at that path — **not** under the spec-folder's own `references/`, which does not exist on disk) locks `discover(scope) -> artifacts` as authority-agnostic: `scope` is always one of `{type:'paths', values}`, `{type:'globs', values}`, or `{type:'branchRange', from, to}` (`discover_contract.md:33-39`), already validated by `scripts/scoping.cjs`'s `validateScope()` before `DISCOVER` calls this method (NFR-S01). Phase 006's `spec.md`/`plan.md` describe this adapter's renderable targets as "a URL, a local dev-server route, or a component entry point" (`plan.md:86`) — three kinds, but `scope.values` is still just an array of strings; there is no fourth `scope.type` for "renderable target." This adapter therefore reuses the same `paths`/`globs` shape sk-doc's adapter uses, with a **different string semantic per value** (a URL or a repo-relative component path, not a markdown file to walk).

Reading `scoping.cjs`'s real `validateScope()` (`scoping.cjs:96-123`) against the shared `validateNamespaceValue()` it calls (`runtime/scripts/lib/cli-guards.cjs:84-95`) settles, by direct trace rather than assumption, which of the three target shapes actually reach this adapter's `discover()`:

| `scope.values[i]` shape | `validateNamespaceValue()` outcome | Reaches `discover()`? |
|---|---|---|
| A full URL, e.g. `"https://example.com/dashboard"` | No null byte, no `..` segment (`hasTraversalSegment` splits on `/`/`\`, `"https:"`/`"example.com"`/`"dashboard"` — none is `".."`), and `path.isAbsolute()` is **false** (does not start with `/`) — so the repo-root check is skipped entirely. **Passes unchanged.** | Yes |
| A bare component-relative path, e.g. `"src/components/Button.tsx"` | Same as above — relative, no traversal, not absolute. **Passes unchanged.** | Yes |
| A leading-slash dev-server route, e.g. `"/dashboard"` | `path.isAbsolute("/dashboard")` is **true** on POSIX; `path.resolve("/dashboard")` resolves to `/dashboard`, and `isInsideRepo()` computes `path.relative(REPO_ROOT, "/dashboard")`, which starts with `..` for any real repo root — **throws** `"absolute path must stay inside the repository root"` (`cli-guards.cjs:91-93`). | **No — rejected upstream, before `discover()` ever runs.** |

This is a genuine, currently-live constraint, not a hypothetical: `validateNamespaceValue()` was written as a generic string-safety guard (reused for `specFolder`/`sessionId` elsewhere in `runtime/`), not as a URL/route-aware validator, and it happens to accept full URLs while rejecting leading-slash routes as if they were escaping-absolute filesystem paths. **Consequence for this adapter**: `discover()` below only classifies two target kinds it can actually receive — `url` (full `http(s)://` string) and `componentEntry` (a bare repo-relative string) — not a distinct `route` kind. A lane author wanting a local dev-server route must supply it as a full URL (`http://localhost:3000/dashboard`), not a bare path (`/dashboard`); the latter fails lane resolution before this adapter is ever invoked. This is recorded here as a real scoping-layer gap for phase 004/008 to reconcile (their schema predates ADR-009's live-render use case), not silently routed around inside this adapter.

### What This Adapter Wraps — And What It Cannot Wrap At All

Unlike `sk-doc.cjs`, which wraps two real, already-shipping, locally-executable Python scripts (`validate_document.py`, `extract_structure.py`), this adapter wraps **zero locally-executable renderers**. There is no CLI, no Python script, no npm binary in this repo that takes a URL or a component path and returns a screenshot, an accessibility tree, or Core Web Vitals — that capability exists only inside an MCP tool surface (`design-mcp-open-design`'s stdio server), callable only from an agent's own tool-use loop, never from a `child_process.spawnSync()` call inside a bare Node script. Section 4 and Section 8 make this constraint concrete rather than asserting it abstractly.

What this adapter *does* wrap, all three genuinely local and file-based:
1. `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md` — the accessibility/performance rubric (`standardSource()`).
2. `.opencode/skills/sk-design/design-audit/references/anti_patterns_production.md` — the anti-slop/production-hardening rubric (`standardSource()`).
3. `.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md` — the model-tell catalog, named alongside the first two in `spec.md`'s In Scope bullet (confirmed present on disk, 10325 bytes) though not required by REQ-002's stricter acceptance bar.

---

## 2. STANDARDSOURCE("sk-design")

`standardSource('sk-design')` returns the live-audit rubric paths plus the (not-yet-seeded) known-deviation list:

```js
{
  authority: 'sk-design',
  mode: 'live-render',
  rubric: {
    accessibilityPerformance: { path: '<repo>/.opencode/skills/sk-design/design-audit/references/accessibility_performance.md' },
    antiPatternsProduction:   { path: '<repo>/.opencode/skills/sk-design/design-audit/references/anti_patterns_production.md' },
    aiFingerprintTells:       { path: '<repo>/.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md' },
  },
  thresholds: {
    // Sourced verbatim from accessibility_performance.md's "Concrete Thresholds" table
    // (accessibility_performance.md:67-76) -- not re-derived, not invented.
    contrastBodyTextAA: 4.5, contrastBodyTextAAA: 7,
    contrastLargeTextAA: 3, contrastLargeTextAAA: 4.5,
    contrastUiComponentAA: 3,
    touchTargetMinPx: 44, touchTargetWcag22FloorPx: 24,
    lcpMaxMs: 2500, inpMaxMs: 200, clsMax: 0.1,
  },
  knownDeviations: [ /* parsed from sk_design_live_render_known_deviations.md Section 8 -- see Section 6 below; empty today */ ],
}
```

Calling `standardSource()` with any authority other than `'sk-design'` throws — same discipline as `sk-doc.cjs`. This module does **not** re-implement phase 006's static `standardSource('sk-design')`; the two live in different files (`sk-doc.cjs` shape precedent: one file per authority-*dimension*, not strictly one file per authority string — see Section 1's lane-collision note for why that distinction matters here specifically).

---

## 3. DISCOVER(SCOPE) FOR LIVE-RENDER TARGETS

### Target Classification

Given a `scope` object in the real, live shape (Section 1's Dependency Note), `discover()`:

1. For `type:'paths'` or `type:'globs'`: classifies each `values[i]` string by a single regex test — `/^https?:\/\//i` — into `targetType: 'url'` (matches) or `targetType: 'componentEntry'` (does not match; treated as a repo-relative path, validated with the same repo-root containment check `sk-doc.cjs`'s `isInsideRepoRoot()` uses, since a `componentEntry` value genuinely is a filesystem-relative identifier in this repo, the same way `sk-doc.cjs`'s `path` values are). No third `route` classification exists — Section 1 explains why a leading-slash route string cannot reach this method at all under the current scoping schema.
2. For `type:'branchRange'`: returns an empty result, same honest-unsupported pattern `sk-doc.cjs` uses for the same scope type (`sk_doc_adapter.md` Section 3) — a rendered UI state has no meaningful per-commit identity the way a tracked file does, and no wrapped tool here operates on anything but a live target string.
3. **No directory expansion, no glob expansion.** This is a deliberate, scoped-down v1 choice, stated plainly rather than silently: unlike `sk-doc.cjs` (which walks a directory into every `*.md` file it contains), each `scope.values[i]` entry here becomes **exactly one** renderable target. A `componentEntry` value that resolves to a directory is not walked; a value containing glob metacharacters (`*`, `?`) is treated as unresolvable and skipped (contributes to zero-coverage, not an error — same "empty/unreachable resolves to zero-coverage" rule `discover_contract.md` Section 5 states for the whole adapter class). Enumerating "every component under this directory" would require an unfounded policy decision (which files under a components tree count as independently renderable) that no cited source in this program makes; a lane author who wants N targets lists N values. This is a real, named capability gap for a future revision, not a silently faked one.
4. Every accepted target becomes one entry in `artifacts` (`{ target: <string>, targetType: 'url'|'componentEntry' }`) and one seed node in `nodes`.

### Coverage-Graph Seed Nodes

`discover_contract.md` Section 4.2 confirms `FILE` is the only `NodeKind` this program has to seed with, for either candidate `runtimeLoopType` (`'review'`: `coverage-graph-db.ts:22`; `'context'`: `coverage-graph-db.ts:34` — both confirmed live by direct read). There is no `URL`/`PAGE`/`ROUTE` kind. This adapter reuses `kind: 'FILE'` for a URL-shaped target too — an honest adaptation, not a perfect fit (a URL is not a file), but the only value the real schema accepts today:

```json
{
  "id": "target:https://example.com/dashboard",
  "kind": "FILE",
  "name": "https://example.com/dashboard",
  "metadata": { "authority": "sk-design", "artifactClass": "designs", "mode": "live-render", "targetType": "url" }
}
```

---

## 4. CHECK(ARTIFACT, RULES, OPTIONS) — THE DISPATCH-WRAPPER SHAPE

### Why `check()` Cannot Call `design-mcp-open-design` Itself

This is the central structural difference from phase 005's reference adapter, stated as a fact to design around, not a problem to hide:

- `design-mcp-open-design` is an MCP stdio server plus an `od` CLI (`.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:18`). Its ~18-tool surface is enumerated and classified in full in `tool_surface.md:42-90` (11 read-only, 5 mutating, 2 destructive) — `list_projects`, `get_active_context`, `get_artifact`, `get_project`, `get_file`, `search_files`, `list_files`, `list_skills`, `list_plugins`, `list_agents`, `get_run`, `create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, `delete_file`, `delete_project`. **None of these takes an arbitrary external URL or dev-server route as input and returns rendered evidence for it.** The only render-producing path (`start_run` -> discovery form -> `od ui respond` -> build -> `previewUrl`, `tool_surface.md:154-168`) is Open Design **generating a brand-new design from a brief**, and its resulting `previewUrl`/`get_artifact` output is scoped to *that generation's own project* (`design_parity_transport.md:36`, "the run's render"; `od_cli_reference.md:185-187`, "the project then gains an `entryFile` and a `previewUrl` and renders" — describing Open Design's own build, not an arbitrary caller-supplied URL). There is no tool here that screenshots or measures a page this program's `discover()` would enumerate, such as a running dev server or a deployed page.
- MCP tools are invoked from an agent's own tool-use loop (the runtime that has the MCP client connection), never from a `child_process.spawnSync()` inside a plain `.cjs` file the way `sk-doc.cjs` shells out to `python3`. There is no MCP client library wired into this script, and adding one would not help: even with one, the tool surface itself has no matching capability (previous bullet).
- A caveat worth naming plainly: `plan.md`'s Architecture section and ADR-009's own Decision text both assert that `design-mcp-open-design` "drives chrome-devtools underneath" (`plan.md:53`, ADR-009 Decision). This adapter's research found **no supporting evidence** for that specific technical claim anywhere in `design-mcp-open-design`'s own documentation (`SKILL.md`, `tool_surface.md`, `od_cli_reference.md`, `design_parity_transport.md`) — Open Design is described throughout as an independent Electron desktop app with its own local daemon and its own rendering, with zero mention of Chrome DevTools Protocol or this repo's `mcp-chrome-devtools` skill. This does not change this adapter's design (ADR-009 forbids a direct `mcp-chrome-devtools` call regardless of what Open Design does internally), but it is recorded here rather than silently repeated as if independently confirmed.

The real precedent for structurally handling "this check requires judgment/capability the script itself cannot perform" already exists one phase back: `sk-doc.cjs`'s `checkRealityAlignment()` (`sk_doc_adapter.md` Section 4.2) never invents the reasoning step of extracting-and-re-probing a claim; it accepts an already-verified `options.verifiedClaims` array from its caller. This adapter applies the identical discipline to the **entire render step**, not just one sub-check, because unlike sk-doc (which has two fully-local deterministic validators plus one reasoning-only sub-check), this adapter has **zero** fully-local sub-checks that do not first require a render.

### The `renderResult` Contract (This Adapter's Own Definition)

No existing document in this repo defines a render-evidence shape for this use case — this adapter is the first to need one, so it defines it here plainly as its own contract (per ADR-012's governance expectation that a new adapter states its own determinism profile), not as something borrowed from an existing spec:

```ts
{
  dispatchedThrough: 'design-mcp-open-design',   // required; check() rejects any other value (ADR-009 enforcement point)
  renderedAt: string,                             // required ISO-8601 timestamp; see Section 5 for the honesty limit on what this proves
  target: { value: string, targetType: 'url'|'componentEntry' },
  authBlocked?: boolean,                          // true -> short-circuits to a render-blocked-auth-required finding
  dispatchRejected?: string,                      // present -> short-circuits, surfaced verbatim (spec.md Error Scenarios)
  measurements?: {                                // optional structured evidence for the deterministic sub-checks
    contrastRatios?: Array<{ element: string, ratio: number, isLargeText?: boolean, isUiComponent?: boolean }>,
    touchTargets?: Array<{ element: string, widthPx: number, heightPx: number }>,
    coreWebVitals?: { lcpMs?: number, inpMs?: number, cls?: number },
  },
  judgmentFindings?: Array<{ message: string, severity?: string, rubricSection: string, evidence: string }>,
  designBoundaryProof?: object | null,             // carried through for audit trail only if a child-agent dispatch occurred producing this render -- this adapter does not itself validate its envelope shape (see Section 8)
}
```

The caller supplying this object is the ITERATE-state driving agent (ADR-006) — the entity that actually holds an MCP connection and dispatched through `design-mcp-open-design` per ADR-009, then distilled that dispatch's result into this shape before calling `check()`.

### Deterministic Sub-Checks

Run only against whatever `measurements` fields are present — never fabricated when absent:

- `contrastRatios[i].ratio` below the applicable AA floor (`3` for large-text/UI-component, `4.5` for body text — `accessibility_performance.md:73-75`) emits a `contrast-below-threshold` finding, severity P0 (body text) or P1 (large text/UI component) per user-impact framing consistent with `accessibility_performance.md`'s own priority ordering (contrast is priority 7 of 8, but a hard numeric failure is still a release-blocking WCAG AA violation per `design-audit/SKILL.md`'s own severity table, "P1 High... WCAG AA violation").
- `touchTargets[i]` below `44x44` (or below the WCAG 2.2 floor `24x24`) emits `touch-target-below-threshold`, P1 (below 24) or P2 (24-43, below the 44 recommendation but not the hard floor) — thresholds cited verbatim from `accessibility_performance.md:76`.
- `coreWebVitals` fields exceeding `lcpMaxMs`/`inpMaxMs`/`clsMax` (`accessibility_performance.md:100`) each emit a `core-web-vital-below-threshold` finding, P1.

All tagged `producedBy: 'deterministic'` (Section 7).

### Reasoning-Agent Sub-Checks (`judgmentFindings` Passthrough)

Everything `accessibility_performance.md` and `anti_patterns_production.md` cover that is not a single measured number — accessible names, keyboard/focus behavior, semantics, anti-slop signals, theming drift, copy clarity (`anti_patterns_production.md` Sections 2-4) — is judgment, the same way sk-code's ADR-008 hybrid names architectural conformance as judgment. `check()` never invents these; it translates caller-supplied `options.renderResult.judgmentFindings` entries (each requiring `rubricSection` and `evidence`, mirroring `sk-doc.cjs`'s `verifiedClaims` requiring `reprobeEvidence`) into findings tagged `producedBy: 'reasoning-agent'`. No `judgmentFindings` supplied means no reasoning-agent findings — never an invented one.

### Render-Unavailable / Auth-Blocked / Dispatch-Rejected Short-Circuits

Per `spec.md`'s L2 Edge Cases and NFR-R01, three conditions each short-circuit `check()` to a single, honestly-labeled finding instead of either crashing or silently returning a clean pass:

| Condition | Finding `type` | Severity |
|---|---|---|
| `options.renderResult` missing entirely | `render-unavailable` | P1 |
| `options.renderResult.authBlocked === true` | `render-blocked-auth-required` | P1 |
| `options.renderResult.dispatchRejected` present (a string) | `dispatch-rejected`, message is the string **verbatim** — never retried with a bypassed envelope (`spec.md` Error Scenarios) | P1 |
| `options.renderResult.dispatchedThrough !== 'design-mcp-open-design'` | `dispatch-boundary-violation` — this adapter refuses to process a render result that did not (self-report as) coming through the required boundary | P0 |

---

## 5. VERIFY-FIRST BEHAVIOR (ADR-005) AND EVIDENCE LABELING

REQ-004 requires a fresh-render-before-assertion discipline, never a cached one. This adapter cannot mechanically *prove* freshness from inside a stateless function — it has no wall-clock coupling to the caller's own dispatch, exactly the same honest limit `sk-doc.cjs`'s `checkRealityAlignment()` already accepts for its own re-probe step (`sk_doc_adapter.md` Section 5: the re-probing act itself is the calling agent's job, not the script's). What `check()` *can* and does do:

- Require `renderResult.renderedAt` to be present and parse as a valid ISO-8601 timestamp; a `renderResult` missing it is not rejected outright (the evidence may still be usable), but every finding derived from it is tagged `evidenceLabel: 'inferred'` rather than `'confirmed'` — reusing `design-audit/references/evidence_capture.md`'s own existing confirmed/inferred vocabulary verbatim (`evidence_capture.md:56-66`, Section 7 fallback-label table) rather than inventing new labels.
- Findings derived from a `renderResult` that does carry `renderedAt` get `evidenceLabel: 'confirmed'`.
- The actual guarantee that `renderedAt` reflects a render performed *immediately before this `check()` call*, not reused from an earlier `discover()`-time pass, is a **caller contract** (ADR-005 invariant 1), stated here as a documented requirement on the ITERATE-state driving agent, not something this adapter can independently verify. This is named plainly rather than claimed as an enforced invariant this code does not actually enforce.

---

## 6. KNOWN-DEVIATION SUPPRESSION (ADR-005) — LOCATION NAMED, LIST NOT YET SEEDED

REQ-003 requires naming this adapter's known-deviation list location, authority-local and distinct from phase 006's static-adapter list. Its location: `references/adapters/sk_design_live_render_known_deviations.md`, sibling to this file, parsed the same way `sk-doc.cjs`'s `loadKnownDeviations()` parses `sk_doc_known_deviations.md`'s fenced JSON block.

**That file does not exist yet, and this build does not create it.** `sk-doc`'s list (Section 8 of `sk_doc_known_deviations.md`) was seeded from *real* findings the 130-packet's manual review already discovered — it was not invented for the occasion. This adapter has never been dispatched against a real live-render target (Section 8 explains why it structurally cannot be, standalone, today), so there are no real discovered conventions yet to seed a suppression list with. Inventing plausible-sounding entries here would be exactly the fabrication ADR-005's own list discipline exists to prevent (`sk_doc_known_deviations.md` Section 7: "Not a dumping ground... every entry here traces to a real prior finding"). `scripts/adapters/sk-design-live-render.cjs`'s `loadKnownDeviations()` therefore points at this not-yet-existing sibling path and degrades gracefully — returns `[]` — exactly like `sk-doc.cjs`'s own `try { readFileSync } catch { return [] }` handling of a missing file. Seeding this list with real entries is future work, gated on this adapter's first real live-render run producing findings worth suppressing.

---

## 7. LAYER / MODE / PRODUCEDBY TAGGING — RECONCILING TWO SOURCES THAT DISAGREE

A genuine, load-bearing tension exists between two already-approved sources, surfaced here rather than silently resolved in one direction (mirroring how `sk_doc_adapter.md` Section 3 handled its own "Classifier Provenance" disagreement):

- `plan.md`'s Architecture section says findings are "tagged `layer: live-render`... to distinguish live-render findings from phase 006's static findings" (`plan.md:88`) — i.e. `layer` answers **which adapter/dimension** produced a finding.
- `sk-doc.cjs` (the phase-005 reference shape this phase must match, per `spec.md`'s own Dependencies) uses `layer` with values `'deterministic'`/`'reasoning-agent'` — i.e. `layer` answers **how** a finding was produced, per ADR-008's honesty discipline.

These are two different axes wearing the same field name. This adapter keeps both, under two distinct fields, rather than picking one meaning and silently dropping the other:

- `layer: 'live-render'` on every finding — matches `plan.md`'s literal design, distinguishes this adapter's output from phase 006's static findings once both exist.
- `producedBy: 'deterministic' | 'reasoning-agent' | 'unavailable'` on every finding — preserves ADR-008's honesty-about-determinism discipline (`'unavailable'` covers the four short-circuit finding types in Section 4, which are neither a deterministic measurement nor a reasoning judgment about the *target* — they are the adapter reporting its own inability to check anything).
- `mode: 'live-render'` and `authority: 'sk-design'` (Section 1) round out self-identification for phase 008's still-open module/lane-key resolution.

---

## 8. THE REAL INTEGRATION GAP (LIVE-REALITY FINDING): `design_dispatch_boundary.md` IS NOT A RENDER INTERFACE

Building this adapter against the real, live files (not the shape assumed by `spec.md`/`plan.md`'s citations) surfaced a genuine, currently-true architectural finding, exactly the class of thing `deep-alignment` exists to catch, found here by construction rather than invented for illustration:

**The finding**: `spec.md` REQ-001 and `plan.md`'s Architecture section both cite `.opencode/skills/sk-design/shared/design_dispatch_boundary.md` as part of "the required dispatch boundary" this adapter's `check()` must dispatch through. Read on its own terms, `design_dispatch_boundary.md` is **not a callable render interface and exposes no function or entry-point at all**. Its own Purpose line states exactly what it is: "Defines the required `DESIGN_BOUNDARY_PROOF v1` envelope for **child-agent and small-model design dispatch boundaries**" (`design_dispatch_boundary.md:22`), and its Core Principle: "Boundary evidence proves the required context and proof demands survived delegation; final design quality still belongs to the active design mode" (`design_dispatch_boundary.md:16`, `:30`-adjacent prose). It is a **JSON envelope schema** (`version`, `routedMode`, `payloadDigests`, `designProofTokenRef`, `assetDigest` — `design_dispatch_boundary.md:44-65`) that a child-agent or small-model dispatch must *construct and present*, checked by an unspecified "checker" (Section 2's own language: "the checker guards this canonical file's contract markers") that this build could not locate as a runtime script anywhere under `sk-design/shared/scripts/` (searched; that directory holds `proof_check.py`, `procedure-card-schema-check.mjs`, `ai-fingerprint-registry-check.mjs`, `ai-fingerprint-fixture-check.mjs`, `variant_parameter_check.py`, `numeric_law_check.py`, `design-command-surface-check.mjs` — none of these validates a `DESIGN_BOUNDARY_PROOF v1` envelope by name). The **only** other real citation of this file in the whole `sk-design` tree is `design-interface/SKILL.md:296`, in a Success Criteria bullet about child-agent/small-model *dispatch into the interface mode* — a completely different concern from "render a URL and check its accessibility."

**What the actually-callable transport is, and what it cannot do**: `design-mcp-open-design`'s real MCP tool surface (Section 4's first bullet) is a generation tool for Open Design's *own* projects, with no tool that takes an arbitrary external URL or dev-server route and returns rendered evidence for it. `evidence_capture.md` (the document that already governs how `sk-design`'s own `audit` mode gathers "browser evidence" today, Section 4, `evidence_capture.md:70-79`) and `real_ui_loop.md` (`real_ui_loop.md:84`, "For a dev-server UI the agent controls (`sk-code`), `mcp-chrome-devtools` screenshotting works and is the right tool") both point at `mcp-chrome-devtools` as the tool this whole skill family already treats as correct for exactly this use case — which is precisely the tool ADR-009 forbids this adapter from calling directly. This is not a contradiction to fix inside this adapter (ADR-009 is a deliberate, LOCKED operator decision, presumably because an automated conformance lane needs the accountable, protocol-checked boundary a human-in-the-loop audit session does not); it is a real, disclosed reason this adapter's `check()` structurally cannot render anything standalone.

**What this means for `check()` right now**: `check(artifact, rules, options)` **never renders anything itself**. It is a pure function over caller-supplied evidence (Section 4's `renderResult` contract) — findings-shaping and threshold-checking only. When no `options.renderResult` is supplied, it returns the single honest `render-unavailable` finding (Section 4), never a fabricated pass. This is the adapter's error-handling working *correctly*, mirroring exactly how `sk-doc.cjs`'s own Section 8 live-reality finding (`validate_document.py`'s broken `template_rules.json` path) is the adapter surfacing a real upstream defect rather than silently routing around it.

**What this adapter does NOT do about it**: invent a working call into `design-mcp-open-design` or `mcp-chrome-devtools` where none of the real, cited tool surfaces supports one. That would violate the same "wraps, does not fabricate" principle Section 1 states, and would directly contradict this task's own instruction to document a real integration constraint honestly rather than fabricate a working call. Closing this gap for real — either by `design-mcp-open-design` growing an arbitrary-URL render tool, or by ADR-009 being revisited — is future work outside this phase's scope-lock (`sk-design/design-mcp-open-design/` is not in this phase's Files to Change).

---

## 9. DISPATCH-BOUNDARY COMPLIANCE (ADR-009: ZERO CHROME-DEVTOOLS CALLS)

Per `plan.md`'s own verification task and this phase's scope lock, `scripts/adapters/sk-design-live-render.cjs` contains zero direct calls into `mcp-chrome-devtools` or any `mcp__*chrome*` tool — checkable directly:

```bash
rg -n "mcp-chrome-devtools|mcp__.*chrome" .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_design_live_render_adapter.md
```

Both files reference `mcp-chrome-devtools` only in prose (Section 4, Section 8, this section) explaining why it is *not* called — never as a call site. See `implementation-summary.md` for the actual command output.

---

## 10. REFERENCE IMPLEMENTATION

`scripts/adapters/sk-design-live-render.cjs` implements `discover(scope)`, `standardSource(authority)`, and `check(artifact, rules, options)` exactly as specified above, plus the target classifier, the threshold sub-checks, the suppression matcher, and a small CLI (`discover`, `check` with `--render-result <file.json|->`, `standard-source`) for a manual dry run — see that file's header comment for exact invocation examples.

---

## 11. REFERENCES AND RELATED RESOURCES

- [sk-design-live-render.cjs](../../scripts/adapters/sk-design-live-render.cjs) — the executable implementation.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md` (ANCHORS `adr-003`, `adr-005`, `adr-008`, `adr-009`, `adr-012`) — the contract, alignment invariants, honesty-labeling precedent, this adapter's own ADR, and the new-adapter governance rule this document satisfies.
- [../discover_contract.md](../discover_contract.md), [../lane_config_schema.md](../lane_config_schema.md) — the real, live `discover(scope)->artifacts` contract and lane-config schema this adapter's `discover()` conforms to (Section 1).
- [./sk_doc_adapter.md](./sk_doc_adapter.md) — the phase-005 reference this adapter's shape follows, and the source of the `verifiedClaims`-style caller-supplied-evidence pattern this adapter's entire `check()` is built on (Section 4).
- `.opencode/skills/sk-design/shared/design_dispatch_boundary.md` — the child-agent/small-model dispatch-proof envelope schema (Section 8's central finding: not a render interface).
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md`, `references/tool_surface.md`, `references/design_parity_transport.md` — the real transport this adapter's `check()` is a pure-function consumer of, and its actual tool surface (Section 4, Section 8).
- `.opencode/skills/sk-design/design-interface/references/design-process/real_ui_loop.md` — the transport-agnostic render/check loop this program's live-render intent descends from, and the source of the `mcp-chrome-devtools`-is-the-right-tool-normally caveat (Section 8).
- `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md`, `anti_patterns_production.md`, `ai_fingerprint_tells.md`, `evidence_capture.md` — the live rubric and evidence-labeling vocabulary this adapter's `standardSource()`/`check()` reuse.
- `.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts` (lines 22, 34) — the `NodeKind` type confirming `FILE` is the only seedable kind available (Section 3).
- `.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs`, `.opencode/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs` — the real, live lane/scope validators this adapter's Section 1 dependency note traces by direct code read, not assumption.
