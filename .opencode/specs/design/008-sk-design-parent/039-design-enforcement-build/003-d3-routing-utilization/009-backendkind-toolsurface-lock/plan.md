---
title: "Plan: backendKind→toolSurface lock"
description: "Declare a per-mode toolSurface (allowed/forbidden/mutatesWorkspace/bashAllowlist) in mode-registry.json derived from backendKind, and add an additive fail-closed toolSurface lane to score-skill-benchmark.cjs that gates backend-kind / tool-policy / bash-allowlist violations against captured raw.toolCalls."
trigger_phrases:
  - "d3-r9 toolsurface plan"
  - "backendkind tool surface lock plan"
  - "mode tool surface scorer gate"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/009-backendkind-toolsurface-lock"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark the toolSurface plan gates and phases complete with the wiring-fix evidence"
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
# Plan: backendKind→toolSurface lock

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON declaration + Node.js CommonJS (`.cjs`), pure functions, no external deps |
| **Home file (declaration)** | `.opencode/skills/sk-design/mode-registry.json` — adds a per-mode `toolSurface` block |
| **Scorer file (gate)** | `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` |
| **Consumes (read-only)** | the routed mode's declared `toolSurface`; the observed `raw.toolCalls` stream captured by `live-executor.cjs` (`{ tool, input }`, tool names lowercase) |
| **Testing** | Pure-helper assertions over synthetic `toolSurface`/`toolCalls` pairs + a no-op control on a router-mode (no `toolCalls`) and a no-`toolSurface` fixture |

### Overview

A mode's `backendKind` currently constrains nothing about which tools its runtime may call. The four doc-guidance modes (`interface`, `foundations`, `motion`, `audit`) are `reference-base` (read-and-guide), and only `md-generator` is `playwright-extract` (it gets `Write`/`Edit`/`Bash` for its extraction pipeline) — but nothing detects a `reference-base` mode that mutates the workspace. This plan (1) declares a per-mode `toolSurface` (`allowed`, `forbidden`, `mutatesWorkspace`, `bashAllowlist`) in `mode-registry.json`, derived deterministically from `backendKind`, and (2) adds an **additive, fail-closed** `toolSurface` lane to the skill-benchmark scorer that gates three violation classes — `backend-kind-mismatch`, `backend-tool-policy`, and `bash-allowlist` — against the captured `raw.toolCalls` stream from a live run.

The scorer change is strictly additive: the lane is inert (`{ applicable: false, pass: true }`) whenever the run carried no `raw.toolCalls` (every router-mode scenario) OR the routed mode has no `toolSurface` (every non-design skill and every non-`toolSurface` fixture), so existing benchmark outcomes are unchanged. The new declaration is the lowest-drift home because `toolSurface` is *derived from* `backendKind`, which already lives in `mode-registry.json`; co-locating them keeps the binding atomic. It deliberately does **not** duplicate `command-metadata.json`'s command `toolPolicy` (a different layer — see §3).

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `toolCalls` capture confirmed: `live-executor.cjs:224` pushes `{ tool: p.tool, input }`; `score-skill-benchmark.cjs:388` surfaces only `.tool` today (the `input`, incl. a Bash command, is captured but unused)
- [x] Tool-name casing confirmed: live tool names are lowercase (`live-executor.cjs:226` matches `/^(read|glob|grep|bash)$/i`); the comparator must normalize case
- [x] Routed-mode source confirmed: the routed mode is `expected.workflowMode` (route gold), surfaced via `expectedFromScenario` (`score-skill-benchmark.cjs:84-107`)
- [x] Call-shape confirmed: router-mode call carries no `observed` (`run-skill-benchmark.cjs:121`) → no `toolCalls` → no-op; live-mode call carries `observed.raw.toolCalls` (`run-skill-benchmark.cjs:162`)
- [x] Skill-agnostic constraint confirmed: `score-skill-benchmark.cjs` is the generic Lane C scorer; it must NOT hardcode a path to `sk-design`'s registry (threading decision in §3 / §6)
- [x] `backendKind` source-of-truth confirmed: `mode-registry.json` carries `backendKind` per mode (4 × `reference-base`, 1 × `playwright-extract`)

### Definition of Done
- [x] Each mode in `mode-registry.json` has a `toolSurface` consistent with its `backendKind` (4 read-only, `md-generator` mutating) — verified; `md-generator` `bashAllowlist` ships empty (see §7-deferred / implementation-summary §3)
- [x] A `reference-base` mode that invokes `Write` → the scorer flags `backend-tool-policy` — `interface` + `Write` (surface auto-resolved) → `applicable:true`, `pass:false`, `backend-tool-policy`
- [x] An off-allowlist Bash command on a mutating mode → the scorer flags `bash-allowlist` — `scoreToolSurface` bash-allowlist branch verified; live `md-generator` allowlist enumeration deferred
- [x] A `mutatesWorkspace:false` mode that emits any mutating tool → the scorer flags `backend-kind-mismatch` — `kindViolations` branch present and gates `Write`/`Edit`/`Bash` on a non-mutating surface
- [x] No-regression: the `hubRoute` gate stays 13 pass / 5 known-gap / 0 regression; `toolSurface` is out of `WEIGHTS`
- [x] `node --check score-skill-benchmark.cjs` passes; `mode-registry.json` parses — both confirmed
- [x] Evergreen [HARD]: no spec/packet/phase IDs or spec paths in the registry edit or the scorer code/comments — scan clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two-part change mirroring the sibling `hubRoute` gate: a declarative home field plus a pure-function scorer lane that rides its own suite gate (like D5 `connectivity.gateFailed` and `gate.hubRoute`) and is **NOT** folded into the weighted `modeAScore`. The v1 dimension weights and per-scenario soft score are unchanged.

### Part A — the `toolSurface` declaration (home: `mode-registry.json`)

Add a `toolSurface` object to each mode, derived deterministically from `backendKind`:

```jsonc
// reference-base modes (interface, foundations, motion, audit)
"toolSurface": {
  "allowed": ["Read", "Glob", "Grep"],
  "forbidden": ["Write", "Edit", "Bash"],
  "mutatesWorkspace": false,
  "bashAllowlist": []
}

// playwright-extract mode (md-generator)
"toolSurface": {
  "allowed": ["Read", "Glob", "Grep", "Write", "Edit", "Bash"],
  "forbidden": [],
  "mutatesWorkspace": true,
  "bashAllowlist": ["<binaries the extraction pipeline actually invokes>"]
}
```

- Tool names are declared in canonical capitalized form (matching `sk-design/SKILL.md`'s `allowed-tools`); the comparator normalizes case before comparing.
- The `bashAllowlist` for `md-generator` is the concrete set of command prefixes/binaries the embedded Playwright extraction backend invokes (e.g. the node/playwright entrypoints). The implementer enumerates them from the backend at build time; the plan fixes only the SHAPE and the derivation rule (allowlist = exactly what the pipeline runs, nothing more).
- Derivation rule (so the field can never silently drift from `backendKind`): `reference-base ⇒ read-only surface, mutatesWorkspace=false, empty bashAllowlist`; `playwright-extract ⇒ adds Write/Edit/Bash, mutatesWorkspace=true, explicit bashAllowlist`.

### Why this home (lowest-drift) and NOT command `toolPolicy`

| Candidate home | Verdict | Reason |
|----------------|---------|--------|
| **`mode-registry.json`** (recommended) | **Chosen** | Already the single source of truth for the discriminator (`workflowMode` + `backendKind`). `toolSurface` is *derived from* `backendKind`; co-locating keeps the binding atomic so the two cannot drift apart. |
| `hub-router.json` | Rejected | Owns *routing* policy (`routerPolicy`/`routerSignals`/vocabulary classes). Tool permissions are an identity/backend concern, not a routing concern. |
| sibling file | Rejected | A third file to keep in sync with `backendKind`; pure drift surface for no benefit. |
| `command-metadata.json` `toolPolicy` | Rejected (different layer) | That is the WRAPPER COMMAND layer (D2-R3): static `/design:*` frontmatter parity (`toolPolicy.mutatesWorkspace`) checked by the metadata-drift gate. The mode `toolSurface` is the MODE'S RUNTIME surface gated against observed `raw.toolCalls`. Related (both split on reference-base vs playwright-extract) but distinct — `toolSurface` must not duplicate or replace `toolPolicy`. |

### Part B — the scorer lane (`score-skill-benchmark.cjs`)

- **`scoreToolSurface({ toolSurface, toolCalls })`** (new pure helper): the fail-closed comparator. `toolCalls` is the lowercased observed tool list (with retained `input` for Bash). Returns `{ applicable, pass, firstFailingStage, violations }`. Returns `{ applicable: false, pass: true }` when `toolSurface` is absent OR `toolCalls` is null/empty — the no-op guarantee.
- **`expectedFromScenario`** (`score-skill-benchmark.cjs:84-107`): surface a generic `toolSurface` passthrough onto `expected` (skill-agnostic — the scorer reads `expected.toolSurface`, it never knows about `sk-design`).
- **`scoreScenario`** (`score-skill-benchmark.cjs:404`): compute `dims.toolSurface = scoreToolSurface({ toolSurface: expected.toolSurface, toolCalls: obs && obs.raw && obs.raw.toolCalls })` and expose it on the returned row.
- **`aggregate`** (`score-skill-benchmark.cjs:522`): count applicable `toolSurface` failures into `gate.toolSurface = { failed, violations, reason }`; set verdict `BLOCKED-BY-TOOL-SURFACE` when a real violation exists, slotting after `BLOCKED-BY-STRUCTURE` (D5) and `BLOCKED-BY-ROUTING` (hubRoute) in the precedence ladder (`score-skill-benchmark.cjs:579-585`).

### The three violation classes (`scoreToolSurface` precedence)

First matching rule wins; all are skipped when not applicable:

1. **Not applicable** — `toolSurface` missing OR `toolCalls` null/empty → `{ applicable: false, pass: true }`. (No-op for every router-mode scenario and every non-`toolSurface` skill.)
2. **`backend-tool-policy`** — any observed tool is in `toolSurface.forbidden` (or, equivalently, not in `toolSurface.allowed`) → violation. (The synthetic acceptance: a `reference-base` mode invoking `Write`.)
3. **`backend-kind-mismatch`** — `toolSurface.mutatesWorkspace === false` yet an observed tool is a mutating tool (`Write`/`Edit`/`Bash`) → violation. (The backend kind says read-only but the run mutated.)
4. **`bash-allowlist`** — for each observed `Bash` call, its command (from the retained `input`) is outside `toolSurface.bashAllowlist` → violation. Degrades gracefully: if the command text is not captured on a given call, that sub-check is skipped for that call and noted, never throws.

`pass` is true iff no violation fired. Case is normalized (declared `Write` matches observed `write`). The lane is advisory-free at the per-scenario soft score — it only sets `firstFailingStage` and the suite gate, exactly like `hubRoute`.

### Data Flow

1. Live run records `obs.raw.toolCalls = [{ tool, input }, …]` (`live-executor.cjs:224`).
2. The routed mode's `toolSurface` reaches `expected.toolSurface` (threading: §6 / Risk).
3. `scoreScenario` calls `scoreToolSurface({ toolSurface: expected.toolSurface, toolCalls })` → `dims.toolSurface`.
4. `firstFailingStage` returns the `toolSurface` label only when `dims.toolSurface.applicable && !dims.toolSurface.pass`.
5. `aggregate` reads `dims.toolSurface` per row, builds `gate.toolSurface`, sets the verdict.
6. Report carries `gate.toolSurface = { failed, violations, reason }` plus the per-row `firstFailingStage`.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Declare toolSurface (home file, no scorer behavior change)
- [x] Add a `toolSurface` block to each of the five modes in `mode-registry.json`, derived from `backendKind` per the §3 derivation rule — all five blocks present
- [x] Enumerate `md-generator`'s `bashAllowlist` from the embedded extraction backend — DEFERRED: shipped as `[]`; the enumeration is an explicit follow-on (RISKS, OPEN QUESTIONS, implementation-summary §3)
- [x] Confirm `mode-registry.json` still parses and the four `reference-base` modes carry the read-only surface, `md-generator` the mutating surface — confirmed

### Phase 2: Pure comparator + dims lane
- [x] Add `scoreToolSurface({ toolSurface, toolCalls })` implementing the §3 precedence; return `{ applicable, pass, firstFailingStage, violations }` — present
- [x] Normalize tool-name case in the comparator (declared `Write` matches observed `write`); retain Bash `input` for the allowlist sub-check — `normalizeToolName` + `commandTextFromInput`
- [x] Ensure the not-applicable branch (no `toolSurface` OR no `toolCalls`) returns `{ applicable:false, pass:true }` — the no-op guarantee verified
- [x] Surface a generic `toolSurface` passthrough onto `expected` in `expectedFromScenario` (scorer stays skill-agnostic) — `copyIfPresent(out, scenarioExpected, 'toolSurface')`; WIRING FIX added `resolveToolSurface`/`toolSurfaceFromRegistry` on top so the gate auto-activates from the registry when no fixture carries `toolSurface`
- [x] Compute `dims.toolSurface` in `scoreScenario` and expose it on the returned row — `dims.toolSurface = scoreToolSurface({ toolSurface: resolveToolSurface({ expected, skillRoot }), toolCalls })`
- [x] Insert a `toolSurface` branch in `firstFailingStage`, guarded by `dims.toolSurface && dims.toolSurface.applicable && !dims.toolSurface.pass` — present

### Phase 3: Aggregate gate + verdict
- [x] In `aggregate`, count applicable `toolSurface` failures into `gate.toolSurface = { failed, violations, reason }` — present
- [x] Set verdict `BLOCKED-BY-TOOL-SURFACE` on a real violation, after `BLOCKED-BY-STRUCTURE` and `BLOCKED-BY-ROUTING` in the precedence ladder — ladder order verified
- [x] Surface a measured count (not a crash) for degraded bash-allowlist sub-checks where command text was absent — `skippedBashAllowlistChecks`

### Phase 4: Verification
- [x] Exercise `scoreToolSurface` across the precedence rules incl. the degraded no-command Bash case — verified via the orchestrator's fixture-shaped scenarios
- [x] Acceptance: `interface` + `Write` (auto-resolved) → `backend-tool-policy`; clean run + `md-generator` + `Write` → pass; non-mutating + mutating tool → `backend-kind-mismatch` branch present
- [x] No-op / live-only: router-replay carries no `toolCalls` → `applicable:false`; missing registry tolerated (no throw)
- [x] `node --check` on the scorer passes; `mode-registry.json` parses; evergreen scan over both edits is clean

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (helper) | `scoreToolSurface` precedence: not-applicable, backend-tool-policy (forbidden tool), backend-kind-mismatch (mutatesWorkspace=false + mutating tool), bash-allowlist (off-allowlist command + the degraded no-command case) | Node assertions / inline harness |
| Acceptance (synthetic) | A `reference-base` `toolSurface` + `toolCalls:[{tool:'write'}]` → `pass:false`, violation `backend-tool-policy`; a mutating mode + off-allowlist Bash → `bash-allowlist` | `scoreToolSurface` direct call |
| Regression (no-op) | (a) a router-mode scenario (no `observed`) and (b) a fixture with no `toolSurface`: report identical pre/post (`aggregateScore`, `verdict`, `funnel`, per-row `firstFailingStage`, `dimensionScores`) | Diff of serialized report |
| Parse / lint | `node --check` on the scorer; `JSON.parse` on `mode-registry.json`; case-normalization round-trip (`Write` vs `write`) | `node --check`, parse harness |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mode-registry.json` carries `backendKind` per mode | Internal (landed) | Green | `toolSurface` cannot be derived |
| `live-executor.cjs` captures `raw.toolCalls` (`{ tool, input }`) | Internal (landed) | Green | No observed tools → lane stays inert (still safe, but never gates) |
| Bash command text present in `toolCalls[].input` | Internal | Amber | The `bash-allowlist` sub-check degrades (allowlist not finely checkable); tool-name checks still work |
| Routed mode's `toolSurface` reaching `expected.toolSurface` | Internal | Amber | See Risk — the scorer is skill-agnostic and cannot read the registry by a hardcoded path |
| D2-R3 command `toolPolicy` (`command-metadata.json`) | Internal (landed) | Green | Distinct layer; this work must not duplicate or alter it |

### Risk: how the routed mode's `toolSurface` reaches the skill-agnostic scorer

`score-skill-benchmark.cjs` is the generic Lane C scorer; it must NOT hardcode a cross-skill path to `sk-design/mode-registry.json` (that would couple the generic scorer to one skill). The comparator therefore reads a generic `expected.toolSurface`, and the routed mode's surface must be *threaded* there from the registry. Two resolution paths:

- **Recommended:** the corpus/run join resolves `registry[expected.workflowMode].toolSurface` and attaches it to the scenario `expected` once, so the scorer stays a pure function of its inputs (mirroring how route gold flows). This is a thin, single join.
- **If that join is not already present**, it lives in the runner (`run-skill-benchmark.cjs`), which is OUTSIDE the stated two-file scope (`mode-registry.json` + `score-skill-benchmark.cjs`). In that case the implementer MUST STOP and escalate (logic-sync) before widening scope, exactly as the sibling phase escalated `notes` → `expected.knownRouteGap`. The sanctioned narrow alternative is a single registry→`expected.toolSurface` join, an approved deviation; the rejected alternative is hardcoding a `sk-design` registry path into the generic scorer.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the no-op control diff is non-empty (existing benchmark outcomes changed), or a correctly-behaving mode is flagged.
- **Procedure**: revert the `score-skill-benchmark.cjs` change and remove the `toolSurface` blocks from `mode-registry.json`. No data migration, no state to unwind; the scorer returns to its pre-lane behavior.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Declare toolSurface) ──> Phase 2 (Comparator + dims) ──> Phase 3 (Aggregate gate) ──> Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Declare toolSurface | None | Comparator + dims |
| Comparator + dims | Declare toolSurface | Aggregate gate |
| Aggregate gate | Comparator + dims | Verify |
| Verify | Aggregate gate | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Declare toolSurface (incl. bashAllowlist enumeration) | Low | 30-45 minutes |
| Comparator + dims lane | Medium | 1-1.5 hours |
| Aggregate gate + verdict | Medium | 45-60 minutes |
| Verification (synthetic + no-op control) | Medium | 1-1.5 hours |
| **Total** | | **3.25-4.25 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No-regression confirmed via the `hubRoute` channel (13 pass / 5 known-gap / 0 regression) and the no-op guarantee (no `toolSurface`/no `toolCalls` → `applicable:false`)
- [x] Feature flag — N/A: additive lane, inert without `toolSurface` or `toolCalls`
- [x] Monitoring — N/A: CI-time deterministic scorer, no runtime surface

### Rollback Procedure
1. **Immediate**: `git checkout -- score-skill-benchmark.cjs mode-registry.json` (two-file revert)
2. **Verify**: re-run the no-op control; confirm the report matches the pre-change baseline
3. **Notify**: record in the implementation summary why the lane was reverted

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: none required; the change touches one declaration file and one script and writes no state

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
- PLANNING ONLY: live target files not edited in this packet
-->
