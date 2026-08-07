---
title: "Implementation Plan: Phase 7: adapter-sk-code"
description: "Plan the sk-code deep-alignment adapter: reuse the shared surface-detection router, layer the existing deterministic pattern-drift checkers where they exist, and fall back to evidence-cited reasoning-agent judgment elsewhere. The plan is honesty-first about automatability limits rather than presenting the adapter as a deterministic linter."
trigger_phrases:
  - "phase 007 implementation plan"
  - "sk-code adapter plan"
  - "surface detection reuse"
  - "deterministic reasoning agent layering"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/007-adapter-sk-code"
    last_updated_at: "2026-07-11T14:56:54Z"
    last_updated_by: "claude"
    recent_action: "Executed Core+Verify phases; adapter built and CLI-verified"
    next_safe_action: "Wire adapter into phase 008 ITERATE/CONVERGE loop"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_code_adapter.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "verify_alignment_drift.py's --root/exit-code/Finding-shape contract confirmed current via live dry-run (Section 2 Definition of Ready)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: adapter-sk-code

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript/CJS adapter shell (matching `system-deep-loop/runtime/scripts/*.cjs`), invoking a Python checker (`verify_alignment_drift.py`) and Node scripts for the deterministic layer |
| **Framework** | `deep-alignment` mode-packet (planned, not yet scaffolded) over the `system-deep-loop` runtime |
| **Storage** | None in this phase - the adapter reads code and reference files and writes no state of its own (loop state lives in the bound spec folder's `alignment/` subdir, owned by phase 008) |
| **Testing** | None runnable in this phase - adapter unit tests are planned build-out work for whichever phase actually implements the code |

### Overview
This phase plans, not builds, the sk-code authority adapter against the ADR-003 adapter contract (phase-005 reference shape). The plan's central decision is layering: reuse the sk-code hub's own shared surface router for detection, run the surface's existing deterministic pattern-drift checker first, and only add reasoning-agent judgment for what that checker does not cover - with every finding tagged by producing layer so the automatability limits stay honest rather than implied-away.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 005's adapter contract shape is available. Evidence: read `sk_doc_adapter.md` + `sk-doc.cjs` in full before building; `sk-code.cjs` matches its exact file-section shape (imports → constants → classifier → discover → suppression → standardSource → subprocess wrappers → check → CLI → exports).
- [x] The sk-code shared surface router's detection precedence (`OPENCODE` over `WEBFLOW`, `MOTION_DEV` as overlay) is confirmed current. Evidence: read `stack_detection.md` + `smart_routing.md` in full 2026-07-11; `classifySurface()` ports §2's Detection Order line-for-line.
- [x] `verify_alignment_drift.py`'s supported-extensions list and skip-path allowlist are confirmed current. Evidence: read the full script 2026-07-11; `SUPPORTED_EXTENSIONS` (11 extensions/7 languages, including Rust — one more than this phase's own REQ-002 prose named) and all 4 skip-path/downgrade functions ported into `sk_code_known_deviations.md`.

### Definition of Done
- [x] The adapter plan names `discover()`, `standardSource()`, and `check()` behavior concretely enough to code from — and the code now exists. Evidence: `scripts/adapters/sk-code.cjs`, `node --check` passes, all 3 methods CLI-exercised against real repo files.
- [x] The deterministic-first, reasoning-agent-second layering rule is unambiguous, with finding-tagging specified. Evidence: `check()` calls `checkDeterministic()` then `checkPatternConformance()` in fixed order; every finding carries a `layer` field.
- [x] `checklist.md` items are reviewed and either checked with evidence or explicitly deferred. Evidence: `checklist.md` updated in this same pass with real evidence per item.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pluggable adapter over the ADR-003 contract (phase-005 reference shape), with an internal two-layer `check()`: a deterministic pass (existing tooling) followed by a bounded reasoning-agent pass (evidence-cited, layer-tagged).

### Key Components
- **`discover()`**: resolves a lane's scope into code artifact paths, then calls the sk-code hub's shared surface router (`.opencode/skills/sk-code/shared/references/stack_detection.md`) to classify each artifact `WEBFLOW`, `OPENCODE`, `UNKNOWN`, with `MOTION_DEV` recorded as a supplemental overlay signal per `.opencode/skills/sk-code/shared/references/smart_routing.md` line 60's marker table. This reuses detection rather than reimplementing it, per `.opencode/skills/sk-code/SKILL.md` lines 52-122 (the router discriminator and routing rule).
- **`standardSource()`**: for `OPENCODE`-surface artifacts, loads `code-opencode/references/` per the hub's `RESOURCE_MAP`-equivalent; for `WEBFLOW`-surface artifacts, loads `code-webflow/references/`; for artifacts carrying the `MOTION_DEV` overlay, additionally loads `code-webflow/references/animation/`.
- **`check()` layer 1 (deterministic)**: for `OPENCODE`-surface artifacts, invoke `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py --root <scope>` and translate its `Finding` objects (TS/JS/Python/Shell/JSON/JSONC pattern-drift checks) directly into alignment findings, tagged `layer: deterministic`. For `WEBFLOW`-surface artifacts, invoke the existing minification/verification script chain (`code-webflow/assets/scripts/minify-webflow.mjs`, `verify-minification.mjs`) where applicable, tagged `layer: deterministic`.
- **`check()` layer 2 (reasoning-agent)**: for conformance dimensions the deterministic layer does not cover (naming conventions beyond regex, architectural/pattern conformance, cross-file consistency, comment hygiene beyond simple patterns), apply reasoning-agent judgment against the loaded `standardSource()` references, citing file:line evidence and tagging each finding `layer: reasoning-agent`.
- **Accepted-deviation set**: an authority-local list (location TBD, default seeded from `verify_alignment_drift.py`'s own skip-path allowlist functions - `is_context_advisory_path`, `is_test_heavy_path`, `is_ts_pattern_asset`, `is_known_malformed_json_fixture` - so the adapter does not re-flag paths the deterministic checker already treats as exempt).

### Data Flow
A lane resolved to `authority=sk-code` calls `discover(scope)` to enumerate code artifacts and their detected surface, then `standardSource(authority)` once per distinct surface encountered, then `check(artifact, rules)` per artifact running layer 1 then layer 2. Findings flow into the phase-008 alignment-report reducer with their `layer` tag preserved so convergence logic can weight deterministic findings more heavily than reasoning-agent findings.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable in the fix-bug sense - this phase plans a net-new adapter and modifies no existing runtime behavior. Recorded for template completeness:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `.opencode/skills/sk-code/shared/references/smart_routing.md`, `stack_detection.md` | Own the live surface-detection precedence | Read-only source for the adapter's `discover()`; not modified | Cited by path above |
| `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py` | Owns the live OPENCODE-surface deterministic pattern-drift check | Invoked read-only by the adapter's `check()` layer 1; not modified | Cited by path above |
| `.opencode/skills/sk-code/code-webflow/assets/scripts/{minify-webflow.mjs,verify-minification.mjs}` | Own the live WEBFLOW-surface deterministic checks | Invoked read-only where applicable by the adapter's `check()` layer 1; not modified | Cited via `.opencode/skills/sk-code/shared/references/smart_routing.md` line 240 |

Required inventories:
- Same-class producers: not applicable - no existing adapter code exists yet to inventory against.
- Consumers of changed symbols: not applicable - no symbols change in this phase.
- Matrix axes: surface (WEBFLOW, OPENCODE, MOTION_DEV overlay) x layer (deterministic, reasoning-agent) = 6 planned behaviors, named above.
- Algorithm invariant: not applicable - no parser/resolver/security code ships in this phase.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phase 005's adapter contract signature is available. `sk_doc_adapter.md`/`sk-doc.cjs` read in full; contract confirmed (`discover(scope)->artifacts`, `standardSource(authority)->rules`, `check(artifact,rules)->findings`).
- [x] Re-read `smart_routing.md` and `stack_detection.md` and confirm surface-detection precedence has not changed. Both read in full 2026-07-11; Detection Order (stack_detection.md §2) ported into `classifySurface()`.
- [x] Re-read `verify_alignment_drift.py` and confirm its `--root` CLI contract and `Finding` shape are current. Read in full; confirmed `--root` is directory-only (`os.walk` yields nothing for a file path — load-bearing for `checkOpencodeDeterministic()`'s design), no `--json` flag, fixed text print format at lines 534-537.

### Phase 2: Core Implementation
- [x] Implement `discover()` calling the shared surface router per the Architecture section above. `scripts/adapters/sk-code.cjs` Section 4; CLI-verified against `code-opencode/assets/scripts` and `code-webflow/assets/scripts`.
- [x] Implement `standardSource()` loading the surface-appropriate reference set. `sk-code.cjs` Section 6; CLI-verified (`standard-source` subcommand output in `sk_code_adapter.md` §2).
- [x] Implement `check()` layer 1 (deterministic) invoking `verify_alignment_drift.py` for OPENCODE and the Webflow script chain for WEBFLOW, translating outputs into layer-tagged findings. `sk-code.cjs` Sections 7-8. Real subprocess pattern confirmed live for OPENCODE (6 dry-runs, `sk_code_adapter.md` §8.4); WEBFLOW path confirmed via a synthetic scope value since no live Webflow project root exists in this repo (§8.1) — the invocation code path is real and correct, only its live-fire precondition is absent here.
- [x] Implement `check()` layer 2 (reasoning-agent) covering conformance dimensions layer 1 does not, with evidence citation and layer tagging on every finding. `sk-code.cjs` Section 9 — `buildReasoningLayerDispatch()` (CLI-verified, `reasoning-dispatch` subcommand) plus `checkPatternConformance()` (verify-first pass-through, mirrors `sk-doc.cjs`'s `checkRealityAlignment()`).
- [x] Author the accepted-deviation set, seeded from `verify_alignment_drift.py`'s existing skip-path allowlist functions. `sk_code_known_deviations.md`, 6 entries (4 from the tool's real functions, 2 from this build's own live findings) — DEVIATION from the plan's literal 4-function scope, recorded honestly (Section §6-7 of that doc name real, reproduced findings this build surfaced, not invented).

### Phase 3: Verification
- [x] Dry-run layer 1 against a known OPENCODE-surface file and confirm findings translate correctly with `layer: deterministic`. `node scripts/adapters/sk-code.cjs check .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs` → `[]` (clean, consistent with a standalone `verify_alignment_drift.py` dry-run of the same directory — `sk_code_adapter.md` §8.4).
- [x] Dry-run layer 2 against a file with an intentional pattern deviation and confirm the finding cites file:line evidence with `layer: reasoning-agent`. Deviated from "intentional pattern deviation" (layer 2 cannot self-judge one — that is the whole point of ADR-008): instead confirmed the pass-through contract with 3 live `node -e` calls against `check()` — (1) a `verifiedFindings` entry with `matchesStandard:false` + `evidence:"sk-code.cjs:1"` produced exactly one `layer:"reasoning-agent"` finding; (2) the identical entry with `evidence` omitted produced zero findings (VERIFY-FIRST enforced, Section 5); (3) `matchesStandard:true` (not a contradiction) also produced zero findings. All three ran clean.
- [x] Confirm the adapter reports `surface-undetected` rather than guessing when detection returns `UNKNOWN`. `node scripts/adapters/sk-code.cjs check somewhere/generic/file.ts` → one `P1 surface-undetected` finding, `artifactSurface:"UNKNOWN"` (full transcript in `sk_code_adapter.md`, cross-referenced from spec.md's Edge Cases evidence).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `discover()`/`check()` layer 1 translation logic | vitest (matching `system-deep-loop/deep-review/scripts/tests/` convention) |
| Integration | Layer 1 + layer 2 findings feeding the phase-008 alignment-report reducer | Manual dry-run against real OPENCODE and WEBFLOW artifacts |
| Manual | Accepted-deviation suppression behaves as documented | Review adapter output against a file matched by `verify_alignment_drift.py`'s own skip-path allowlist |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 adapter contract | Internal | Planned in parallel | If the signature shifts, this adapter plan needs reconciliation before build; low risk since the contract is design-brief-locked. |
| `.opencode/skills/sk-code/shared/` surface router | Internal | Stable, live | If detection precedence changes, `discover()` must be re-synced. |
| `verify_alignment_drift.py` CLI contract | Internal | Stable, live | If its `--root`/output shape changes, layer 1 translation logic must be updated. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A future build finds the phase-005 adapter contract incompatible, the surface router's detection precedence has materially changed, or `verify_alignment_drift.py`'s CLI contract has changed shape.
- **Procedure**: Re-open this phase's plan, re-cite the current rule sources, and update `spec.md`/`plan.md` before resuming implementation; do not silently code around a stale plan or quietly widen the reasoning-agent layer to cover a broken deterministic layer.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (n/a) ──────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 005 contract available | Core |
| Core | Setup | Verify |
| Verify | Core | Phase 008 (iterate/converge/report wiring) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Re-read 3 reference/script sources |
| Core Implementation | High | Two-layer check() across three surface classes |
| Verification | Medium | Dry-run per surface plus accepted-deviation review |
| **Total** | | **High (hardest of the four v1 authorities per the design brief)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migrations - adapter is read-only in v1.
- [ ] Accepted-deviation set format agreed before first `check()` run ships.

### Rollback Procedure
1. Disable the sk-code lane's resolution (a lane scoped to that authority simply cannot run) rather than shipping a broken `check()`.
2. Revert the adapter code via normal version control.
3. Re-verify against the dry-run cases in Testing Strategy before re-enabling.
4. No user-facing notification needed - this is an internal deep-loop mode, not a shipped user surface, in v1.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
