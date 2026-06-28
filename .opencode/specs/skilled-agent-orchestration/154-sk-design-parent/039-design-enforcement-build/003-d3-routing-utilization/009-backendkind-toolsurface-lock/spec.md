---
title: "D3-R9 — backendKind→toolSurface lock"
description: "Add a per-mode toolSurface (allowed/forbidden/mutatesWorkspace/bashAllowlist) derived from backendKind to sk-design mode-registry.json, and add an additive fail-closed scoreToolSurface lane to score-skill-benchmark.cjs that gates backend-tool-policy / backend-kind-mismatch / bash-allowlist violations against captured raw.toolCalls, auto-resolving the routed mode's surface from the registry."
trigger_phrases:
  - "d3-r9 toolsurface lock"
  - "backendkind tool surface design build"
  - "scoretoolsurface gate"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/009-backendkind-toolsurface-lock"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade the spec to the Level 2 contract and mark the toolSurface lock complete"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D3-R9 — backendKind→toolSurface lock

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Enforcement class** | enforceable |
| **Dimension** | D3 — Routing & Utilization |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A mode's `backendKind` constrains nothing about which tools its runtime may call. The four doc-guidance modes (`interface`, `foundations`, `motion`, `audit`) are `reference-base` (read-and-guide); only `md-generator` is `playwright-extract` (it needs `Write`/`Edit`/`Bash` for its extraction pipeline). Nothing detects a `reference-base` mode that mutates the workspace — a read-only mode could write files undetected, and the skill-benchmark would score the run identically whether or not it stayed within its backend.

### Purpose
Bind `toolSurface` to `backendKind` so the mismatch becomes a blocking violation. Declare a per-mode `toolSurface` (`allowed`, `forbidden`, `mutatesWorkspace`, `bashAllowlist`) derived deterministically from `backendKind` in `mode-registry.json`, and add an additive, fail-closed `scoreToolSurface` lane to `score-skill-benchmark.cjs` that gates three violation classes — `backend-tool-policy`, `backend-kind-mismatch`, and `bash-allowlist` — against the captured `raw.toolCalls` stream from a live run. The lane rides its own suite gate (`gate.toolSurface`), stays out of the weighted `modeAScore`, and is a no-op for any run without a `toolSurface` or without `toolCalls`, so existing benchmark outcomes are unchanged.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A per-mode `toolSurface` block on all five `sk-design` modes in `mode-registry.json`, derived from `backendKind`
- An additive pure helper `scoreToolSurface({ toolSurface, toolCalls })` implementing the three-class precedence (`backend-tool-policy` → `backend-kind-mismatch` → `bash-allowlist`)
- The registry auto-resolve (`resolveToolSurface` / `toolSurfaceFromRegistry`) that threads the routed mode's surface from `<skillRoot>/mode-registry.json` when `expected.toolSurface` is absent — the wiring that makes the gate live
- A `firstFailingStage` branch, a `gate.toolSurface = { failed, violations, reason }` aggregation, and the `BLOCKED-BY-TOOL-SURFACE` verdict, placed after `BLOCKED-BY-STRUCTURE` (D5) and `BLOCKED-BY-ROUTING` (hubRoute)

### Out of Scope
- Any edit to a third file beyond `mode-registry.json` + `score-skill-benchmark.cjs` (the build stayed inside the two-file scope)
- Folding `toolSurface` into the weighted `modeAScore` (it rides its own gate, like `hubRoute`/D5)
- The D2-R3 command `toolPolicy` in `command-metadata.json` (a different layer — see §6)
- Enumerating `md-generator`'s `bashAllowlist` to the pipeline binaries (shipped empty; see RISKS and OPEN QUESTIONS)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/mode-registry.json` | Modify | Add a `toolSurface` block (allowed/forbidden/mutatesWorkspace/bashAllowlist) to each of the five modes, derived from `backendKind` |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modify | Add `scoreToolSurface` + the three violation classes, the registry auto-resolve wiring, the `firstFailingStage` branch, `gate.toolSurface`, and the `BLOCKED-BY-TOOL-SURFACE` verdict |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each mode carries a `toolSurface` consistent with its `backendKind` | Four `reference-base` modes are read-only/non-mutating/empty-allowlist; `md-generator` is mutating; `mode-registry.json` parses |
| REQ-002 | `scoreToolSurface` flags a forbidden tool | A `reference-base` surface + an observed `Write` → `applicable:true`, `pass:false`, class `backend-tool-policy` |
| REQ-003 | The lane is inert when not applicable | No `toolSurface` OR null/empty `toolCalls` → `{ applicable:false, pass:true }`, no verdict change |
| REQ-004 | The gate auto-activates from the registry | With no `expected.toolSurface`, the routed mode's surface is resolved from `<skillRoot>/mode-registry.json` (keyed on `workflowMode`), so a live run gates without a fixture change |
| REQ-005 | Additive, no regression | The `hubRoute` gate stays 13 pass / 5 known-gap / 0 regression; `toolSurface` is absent from `WEIGHTS` (not folded into `modeAScore`) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Missing/unparseable registry tolerated | `toolSurfaceFromRegistry` returns `null` on an absent/malformed registry → lane no-op, no throw |
| REQ-007 | `BLOCKED-BY-TOOL-SURFACE` precedence | The verdict sits after `BLOCKED-BY-STRUCTURE` (D5) and `BLOCKED-BY-ROUTING` (hubRoute) in the ladder |
| REQ-008 | Evergreen body | The registry edit and the scorer code/comments carry no spec/packet/phase IDs or `specs/` paths |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five `sk-design` modes carry a `toolSurface` derived from `backendKind` — four read-only `reference-base` surfaces and the one mutating `md-generator` surface; `mode-registry.json` parses.
- **SC-002**: An `interface`-mode run using `Write`, with NO `expected.toolSurface` (the surface auto-resolved from the registry), returns `applicable:true`, `pass:false`, class `backend-tool-policy`.
- **SC-003**: A clean `interface` run (Read/Grep) returns `applicable:true`, `pass:true`; an `md-generator` (mutating) run using `Write` returns `pass:true`.
- **SC-004**: A missing/unparseable `mode-registry.json` is tolerated (no throw); deterministic router-replay (no `toolCalls`) is correctly `applicable:false`.
- **SC-005**: `node --check score-skill-benchmark.cjs` exits 0; the `hubRoute` gate stays 13 pass / 5 known-gap / 0 regression; the evergreen scan over both edits is clean.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The gate is inert without the wiring fix | `scoreToolSurface` reads `expected.toolSurface`, which fixtures do not populate, so the lane never activates | The registry auto-resolve (`resolveToolSurface`/`toolSurfaceFromRegistry`) threads the routed mode's surface from the registry keyed on `workflowMode`, so the gate auto-activates in live runs |
| Risk | The gate is meaningful only in live runs | Router-replay records no `toolCalls`, so the lane is `applicable:false` there | Accepted and documented — this is the same live-only pattern as `surfaceMatch`; the lane activates only when a run records `observed.raw.toolCalls` |
| Risk | `md-generator`'s empty `bashAllowlist` false-positives | RESOLVED — the comparator now reads an empty/absent `bashAllowlist` as "no per-command restriction", not "match nothing" | Verified `md-generator` + Bash → no violation; the forbidden-tool check and a non-empty allowlist's restriction are both unchanged; enumerating the pipeline binaries later is an optional tightening, not a correctness fix |
| Risk | A skill-agnostic scorer reading a `sk-design` path | Coupling the generic Lane C scorer to one skill | The resolve is generic: it reads `<skillRoot>/mode-registry.json` from the passed `skillRoot`, never a hardcoded `sk-design` path, and returns `null` for any skill without a registry |
| Dependency | `mode-registry.json` carries `backendKind` per mode | `toolSurface` derivation source | Internal, green |
| Dependency | `live-executor.cjs` captures `raw.toolCalls` (`{ tool, input }`) | The observed stream the lane gates on | Internal, green; absent → lane stays inert (safe) |
| Dependency | D2-R3 command `toolPolicy` (`command-metadata.json`) | Distinct wrapper-command layer | Internal, green; this work neither duplicates nor alters it |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: For a run with no `toolSurface` or no `toolCalls` the lane returns a fixed `{ applicable:false, pass:true }`; no existing scan output or weight changes.

### Backward Compatibility
- **NFR-B01**: `toolSurface` is absent from `WEIGHTS`, so `modeAScore` and the v1 dimension weights are byte-stable; the lane only adds `dims.toolSurface`, `gate.toolSurface`, and the new verdict tier, leaving every prior consumer unaffected.

### Layer Separation
- **NFR-L01**: The mode `toolSurface` (a mode's runtime tool surface, gated on observed `raw.toolCalls`) is a different layer from the D2-R3 command `toolPolicy` (a wrapper command's static allowed-tools parity in `command-metadata.json`). Both split on reference-base vs playwright-extract, but neither replaces the other.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Applicability Boundaries
- **No surface / no calls**: `toolSurface` absent OR `toolCalls` null/empty → `{ applicable:false, pass:true }` (the no-op for every router-replay scenario and every non-design skill).
- **Missing/unparseable registry**: `toolSurfaceFromRegistry` returns `null` → the lane degrades to its no-op branch, never throws.

### Violation Boundaries
- **`backend-tool-policy`**: an observed tool is forbidden, or outside a non-empty `allowed` set → `pass:false` (the `interface` + `Write` acceptance).
- **`backend-kind-mismatch`**: `mutatesWorkspace:false` yet an observed tool is `Write`/`Edit`/`Bash` → `pass:false`.
- **`bash-allowlist`**: an observed `Bash` command (from its retained `input`) is outside `bashAllowlist` → `pass:false`; a Bash call with no captured command text is skipped and noted, never a failure.
- **Mutating mode, allowed tool**: `md-generator` + `Write` → `pass:true` (Write is in its allowed surface).

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One declaration file (`mode-registry.json`, five blocks) plus one scorer (`score-skill-benchmark.cjs`, the comparator + registry resolve + aggregation); nothing else is edited.
- **Risk concentration**: The wiring fix is the load-bearing piece — without the registry auto-resolve the gate is silently inert. Regression risk is contained by the no-op guarantee (no `toolSurface`/no `toolCalls`) and by keeping the lane out of `WEIGHTS`.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the gate also fire under deterministic router-replay? **RESOLVED: No. Router-replay records no `toolCalls`, so the lane is correctly `applicable:false` there — the same live-only pattern as `surfaceMatch`. The gate is meaningful only in LIVE benchmark runs that capture `observed.raw.toolCalls`; with the wiring fix it auto-activates from the registry without fixtures carrying `toolSurface`.**
- Was the gate live as first written? **RESOLVED: No — it was inert. `scoreToolSurface` read `expected.toolSurface`, which nothing populated (fixtures do not carry it), so the lane stayed `applicable:false`. The Pass-2 wiring fix added the registry auto-resolve (`resolveToolSurface`/`toolSurfaceFromRegistry`, keyed on `expected.workflowMode`), which is what makes the gate activate in live runs.**
- Should `md-generator`'s `bashAllowlist` be enumerated now? **RESOLVED: No. It ships empty (`[]`), and the comparator now reads an empty/absent `bashAllowlist` as "no per-command restriction" (the mode permits Bash via its `allowed` set; the allowlist is an optional narrowing) — so `md-generator`'s legitimate extraction Bash is no longer false-flagged. Verified: `md-generator` + Bash → no violation; the forbidden-tool check and a populated allowlist's restriction are both unchanged. Enumerating the pipeline binaries later would tighten "any Bash" to "these binaries" — optional, not required for correctness.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Evidence: per-mode toolSurface in mode-registry.json + the scoreToolSurface gate in score-skill-benchmark.cjs; interface+Write auto-resolved → backend-tool-policy (pass:false), clean run + md-generator+Write pass, hubRoute 13/5/0
- Findings: gate inert without the registry auto-resolve wiring (fixed); live-only applicability; empty bashAllowlist now means unrestricted so md-generator Bash is not false-flagged (fixed), while a populated allowlist still restricts
-->
