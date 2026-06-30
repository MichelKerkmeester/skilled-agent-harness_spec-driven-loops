---
title: "Implementation Summary: D3-R9 backendKind→toolSurface lock"
description: "Post-build record for the per-mode toolSurface registry blocks in mode-registry.json and the additive scoreToolSurface gate in score-skill-benchmark.cjs: the three violation classes, the registry auto-resolve wiring fix that made the inert gate live, the auto-resolve acceptance, the live-only applicability, and the mode-toolSurface-vs-command-toolPolicy distinction."
trigger_phrases:
  - "backendkind toolsurface lock implementation summary"
  - "scoretoolsurface gate build record"
  - "tool-surface gate summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/009-backendkind-toolsurface-lock"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the toolSurface blocks, the scorer gate, and the registry auto-resolve wiring fix"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-backendkind-toolsurface-lock |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverables** | A per-mode `toolSurface` block on all five `sk-design` modes in `mode-registry.json` + the additive fail-closed `scoreToolSurface` lane (and its registry auto-resolve) in `score-skill-benchmark.cjs` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A mode's `backendKind` now binds the tools its runtime is allowed to touch. Before this phase nothing stopped a read-and-guide design mode from mutating the workspace; the skill-benchmark would score a clean run identically whether or not the mode wrote files. This phase declares a per-mode `toolSurface` derived from `backendKind` and adds a fail-closed scorer lane that flags any backend-kind / tool-policy / bash-allowlist mismatch against the captured `raw.toolCalls` stream, so a `reference-base` mode that calls `Write` now fails closed instead of passing silently.

### The `toolSurface` declaration

Each of the five `sk-design` modes in `mode-registry.json` carries a `toolSurface` object beside its `backendKind`. The four `reference-base` modes (`interface`, `foundations`, `motion`, `audit`) declare `allowed:[Read,Glob,Grep]`, `forbidden:[Write,Edit,Bash]`, `mutatesWorkspace:false`, `bashAllowlist:[]`. The one `playwright-extract` mode (`md-generator`) declares `allowed:[Read,Glob,Grep,Write,Edit,Bash]`, `forbidden:[]`, `mutatesWorkspace:true`, `bashAllowlist:[]`. The shape is derived deterministically from `backendKind`, so the surface cannot silently drift from the discriminator it co-lives with.

### The `scoreToolSurface` gate

A new pure helper `scoreToolSurface({ toolSurface, toolCalls })` in `score-skill-benchmark.cjs` is the fail-closed comparator. It returns `{ applicable:false, pass:true }` when the run carried no `toolSurface` or no `toolCalls` (the no-op guarantee), and otherwise evaluates three violation classes in strict precedence: `backend-tool-policy` (an observed tool is forbidden, or outside a non-empty `allowed` set), `backend-kind-mismatch` (`mutatesWorkspace:false` yet an observed tool mutates), and `bash-allowlist` (an observed `Bash` command, read from its retained `input`, falls outside `bashAllowlist`). Tool names are case-normalized so a declared `Write` matches an observed `write`, and a Bash call with no captured command text is recorded in `skippedBashAllowlistChecks` rather than throwing. The lane rides its own suite gate (`gate.toolSurface`) and is deliberately kept out of the weighted `modeAScore` (`WEIGHTS` is unchanged), exactly like the sibling `hubRoute` and D5 gates. In `aggregate`, applicable failures roll into `gate.toolSurface = { failed, violations, reason }` and set the verdict `BLOCKED-BY-TOOL-SURFACE`, slotted after `BLOCKED-BY-STRUCTURE` (D5) and `BLOCKED-BY-ROUTING` (hubRoute) in the precedence ladder.

### The wiring fix (registry auto-resolve)

The gate was inert as first written. `scoreToolSurface` read `expected.toolSurface`, but nothing populated that field — the route-gold fixtures do not carry a `toolSurface`, so every run resolved `toolSurface = undefined` and the lane returned `applicable:false` forever. The fix added `resolveToolSurface({ expected, skillRoot })`: it still prefers an explicit `expected.toolSurface`, but when that is absent it resolves the routed mode's surface from `<skillRoot>/mode-registry.json` (via `toolSurfaceFromRegistry`, keyed on `expected.workflowMode`, cached in `MODE_REGISTRY_CACHE`, and tolerant of a missing or unparseable registry → `null`). `scoreScenario` now calls `scoreToolSurface({ toolSurface: resolveToolSurface({ expected, skillRoot }), toolCalls })`. With this, the gate auto-activates in live runs straight from the registry, with no fixture change required.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/mode-registry.json` | Modified | Added a `toolSurface` block (allowed/forbidden/mutatesWorkspace/bashAllowlist) to all five modes, derived from `backendKind` |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modified | Added `scoreToolSurface` + the three violation classes, the `resolveToolSurface`/`toolSurfaceFromRegistry` registry auto-resolve (the wiring fix), the `firstFailingStage` branch, the `gate.toolSurface` aggregation, and the `BLOCKED-BY-TOOL-SURFACE` verdict |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 high fast) landed the change in two passes. Pass 1 added the per-mode `toolSurface` blocks and the `scoreToolSurface` lane riding `gate.toolSurface` out of the weighted `modeAScore`. Pass 2 was the wiring fix: the orchestrator caught that the gate was inert because `scoreToolSurface` read `expected.toolSurface`, which nothing populated, so the lane never activated. Pass 2 made `scoreScenario` resolve the mode's `toolSurface` from `<skillRoot>/mode-registry.json` (cached, tolerant of a missing registry) when `expected.toolSurface` is absent, keyed on `expected.workflowMode`, so the gate auto-activates in live runs.

The orchestrator then verified acceptance independently rather than trusting the claim, using a real fixture-shaped scenario with `observed.raw.toolCalls` and the live `sk-design` skillRoot. An `interface`-mode run using `Write` (no `expected.toolSurface` — auto-resolved from the registry) returned `applicable:true`, `pass:false`, class `backend-tool-policy`. A clean `interface` run (Read/Grep) returned `applicable:true`, `pass:true`. An `md-generator` (mutating) run using `Write` was allowed (`pass:true`). No-regression held: the `hubRoute` gate still reported 13 pass / 5 known-gap / 0 regression. `node --check score-skill-benchmark.cjs` passed, the evergreen scan over both edits was clean, and a missing registry was tolerated without a throw. Scope stayed at the two named files: `mode-registry.json` + `score-skill-benchmark.cjs`.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Home `toolSurface` in `mode-registry.json` beside `backendKind` | The registry is already the single source of truth for the discriminator; `toolSurface` is derived from `backendKind`, so co-locating keeps the binding atomic and drift-free |
| Auto-resolve the surface from the registry when `expected.toolSurface` is absent | Without it the gate was inert — fixtures carry no `toolSurface`, so nothing ever populated `expected.toolSurface` and the lane stayed `applicable:false`; the registry resolve is what makes the gate live |
| Resolve by `expected.workflowMode` and cache per registry path | Keeps the comparator a pure function of its inputs while letting the runner thread the surface in one thin join; the cache avoids re-reading the registry per scenario |
| Ride a dedicated `gate.toolSurface`, never fold into `modeAScore` | Mirrors `hubRoute`/D5: a tool-surface breach is a hard gate, not a soft score, so the v1 dimension weights and the per-scenario soft score stay unchanged |
| Keep the mode `toolSurface` distinct from the command `toolPolicy` | They are different layers — `toolSurface` is a mode's runtime tool surface gated on observed `raw.toolCalls`; the D2-R3 `toolPolicy` is a wrapper command's static allowed-tools parity. Both split on reference-base vs playwright-extract but neither duplicates the other |
| Tolerate a missing or unparseable registry by returning `null` | The generic Lane C scorer must never throw on a non-design skill or a malformed registry; a `null` surface degrades the lane to its no-op branch |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check score-skill-benchmark.cjs` | PASS, exit 0 |
| `mode-registry.json` parses; all five modes carry a `toolSurface` | PASS, four `reference-base` read-only surfaces + `md-generator` mutating surface, each consistent with its `backendKind` |
| Acceptance — forbidden tool (auto-resolved) | PASS, `interface` + `Write` with NO `expected.toolSurface` (surface auto-resolved from the registry) → `applicable:true`, `pass:false`, class `backend-tool-policy` |
| Acceptance — clean run | PASS, `interface` + Read/Grep → `applicable:true`, `pass:true` |
| Acceptance — mutating mode allowed | PASS, `md-generator` (mutating) + `Write` → `pass:true` (Write is in its allowed surface) |
| Missing-registry tolerance | PASS, an absent/unparseable `mode-registry.json` resolves to `null` → lane no-op, no throw |
| NO-REGRESSION: hubRoute gate | PASS, still 13 pass / 5 known-gap / 0 regression |
| Verdict precedence | PASS, `BLOCKED-BY-TOOL-SURFACE` sits after `BLOCKED-BY-STRUCTURE` (D5) and `BLOCKED-BY-ROUTING` (hubRoute); `toolSurface` is absent from `WEIGHTS` (not in `modeAScore`) |
| Evergreen [HARD] | PASS, no spec/packet/phase IDs or `specs/` paths in the registry edit or the scorer code/comments |
| Live-only applicability | EXPECTED, deterministic router-replay carries no `toolCalls`, so the lane is correctly `applicable:false` there (same pattern as `surfaceMatch`); it activates only in live runs that record `observed.raw.toolCalls` |
| Scope clean (only the 2 named files) | PASS, no other live `.opencode/skills` file was edited by this build; this phase folder authored docs only |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The gate is meaningful only in LIVE benchmark runs.** Deterministic router-replay records no tool calls, so the lane is correctly `applicable:false` there (the same live-only pattern as `surfaceMatch`). It activates only when a run records `observed.raw.toolCalls`. With the wiring fix it auto-activates from the registry without fixtures needing to carry `toolSurface`, but a purely router-replay benchmark will never exercise it.
2. **The gate was inert before the wiring fix.** As first written, `scoreToolSurface` read `expected.toolSurface`, which nothing populated; the registry auto-resolve in `resolveToolSurface`/`toolSurfaceFromRegistry` is what makes it live. Anyone porting the lane to another skill must thread the routed mode's surface the same way (explicit `expected.toolSurface` OR a registry resolve keyed on `expected.workflowMode`), or the lane will be silently inert again.
3. **`md-generator`'s `bashAllowlist` ships empty (`[]`) — RESOLVED to mean "unrestricted".** Initially the comparator treated an empty allowlist as "match nothing", which false-flagged `md-generator`'s legitimate extraction-pipeline Bash. The comparator now treats an empty/absent `bashAllowlist` as "no per-command Bash restriction" (the mode already permits Bash via its `allowed` set; the allowlist is an optional further narrowing). Verified: `md-generator` + a `Bash` call → no violation (`pass:true`); the `backend-tool-policy` forbidden-tool check is unchanged (a `reference-base` mode's Bash still fails); a mode with a non-empty `bashAllowlist` still restricts a command outside it (`bash-allowlist`). Enumerating the pipeline binaries into `bashAllowlist` later would narrow it from "any Bash" to "these binaries" — an optional tightening, no longer required to avoid a false-positive.
4. **The full skill-benchmark vitest suite was not executed.** Acceptance was proven by direct, orchestrator-run fixture-shaped scenarios against the live `sk-design` skillRoot plus `node --check`, not a green suite run; the suite is not runnable in this offline environment (same limit the sibling phases hit). No-regression on the `hubRoute` channel was confirmed directly (13/5/0). Re-run `npx vitest run skill-benchmark/tests` from `scripts/` in a networked environment to close this out.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Build record for the per-mode toolSurface blocks + the scoreToolSurface gate + the registry auto-resolve wiring fix
- Gate is live-only (no toolCalls under router-replay); empty bashAllowlist now means unrestricted (md-generator Bash no longer false-flagged)
-->
