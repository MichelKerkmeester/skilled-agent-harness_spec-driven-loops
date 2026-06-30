---
title: "D3-R7 — Registry static-audit gate"
description: "Add scanHubRegistry({ skillRoot }) beside scanConnectivity in d5-connectivity.cjs that audits a hub registry (missingModes, deadPackets, aliasCollisions, packetNameMismatches, uncoveredIntentRate) and emits BLOCKED-BY-REGISTRY on a missing mode, dead packet, alias collision, or unparseable registry, guarding the clean baseline from silent rot."
trigger_phrases:
  - "d3-r7 registry static audit"
  - "hub registry scan design build"
  - "blocked-by-registry hub gate"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/007-registry-static-audit"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade the spec to the Level 2 contract and mark the registry gate complete"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D3-R7 — Registry static-audit gate

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
The hub registry is structurally clean today — five modes, a typed router, matched packet folders, and zero alias collisions — but nothing guards that state. A future edit can introduce a registry mode with no packet or router projection, a packet folder nothing references, or an alias owned by two modes, and the skill-benchmark would not notice. The clean baseline can silently rot.

### Purpose
Add a static auditor, `scanHubRegistry({ skillRoot })`, beside the existing `scanConnectivity` in `d5-connectivity.cjs` that turns the clean baseline into a guarded one. It reports five registry facets — `missingModes`, `deadPackets`, `aliasCollisions`, `packetNameMismatches`, and `uncoveredIntentRate` — and fails closed with the literal `verdict:'BLOCKED-BY-REGISTRY'` on any hard structural defect (missing mode, dead packet, alias collision, or an unparseable registry). The scan mirrors `scanConnectivity`'s return shape and severity model, and is a benign no-op for any skill without a registry so the rest of the suite is unaffected.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An additive `scanHubRegistry({ skillRoot })` next to `scanConnectivity`, added to `module.exports`
- Five checks: `missingModes` (P0), `deadPackets` (P0), `aliasCollisions` (P0), `packetNameMismatches` (P1, reported), `uncoveredIntentRate` + `uncoveredKeywords` (metric, reported)
- A registry-presence guard that returns a benign pass when no `mode-registry.json` exists at `skillRoot`
- Fail-soft on an unparseable registry: a `registry_unparseable` P0 finding and `BLOCKED-BY-REGISTRY`, not a throw
- A registry-presence-guarded additive CLI hook that folds the registry gate into the exit code
- Lifting `scanConnectivity`'s inline penalty literal to a shared `SEVERITY_PENALTY` const (same values)
- Additive vitest coverage (real-state, synthetic broken registry, alias collision) in the existing suite

### Out of Scope
- Any change to `scanConnectivity`'s signature, body, or behavior (it stays logic-unchanged)
- Wiring a `BLOCKED-BY-REGISTRY` verdict tier into `score-skill-benchmark.cjs aggregate()` (explicit follow-on)
- Turning the `uncoveredIntentRate` threshold gate ON (it ships documented but OFF by default)
- Making `packetNameMismatch` a gate trigger (it is reported-only by the fixed hard-violation set)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs` | Modify | Add `scanHubRegistry` + the `BLOCKED-BY-REGISTRY` gate; lift the inline penalty literal to a shared `SEVERITY_PENALTY` const; export `scanHubRegistry` |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Modify | Add the additive registry test blocks; existing blocks untouched |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `scanHubRegistry({ skillRoot })` added beside `scanConnectivity` and exported | The function exists in `d5-connectivity.cjs`, is listed in `module.exports`, and returns the mirrored shape |
| REQ-002 | Healthy registry passes | On the live sk-design registry: `missingModes`, `deadPackets`, `aliasCollisions`, `packetNameMismatches` all empty; `gateFailed:false`; `uncoveredIntentRate` measured |
| REQ-003 | A hard structural defect emits `BLOCKED-BY-REGISTRY` | A seeded missing mode / dead packet / alias collision sets `gateFailed:true` and `verdict:'BLOCKED-BY-REGISTRY'` |
| REQ-004 | An unparseable registry fails closed, not throws | A missing/unparseable parsed input emits a `registry_unparseable` P0 finding and `BLOCKED-BY-REGISTRY` |
| REQ-005 | `scanConnectivity` is unchanged | No-regression: only the `SEVERITY_PENALTY` refactor (same values) + the `module.exports` line touch its neighborhood; it runs with intact keys |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Registry-presence guard | A skill with no `mode-registry.json` returns `registryPresent:false`, `gateFailed:false`, `score:100`, empty arrays |
| REQ-007 | `packetNameMismatch` reported, non-gating | A name drift emits a P1 finding and lowers the score but does not trip the gate |
| REQ-008 | Evergreen body | `d5-connectivity.cjs` carries no spec/packet/phase IDs or `specs/` paths |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scanHubRegistry` on the live sk-design root returns `registryPresent:true`, `score:100`, `gateFailed:false`, `verdict:null`, all defect arrays empty, and a numeric `uncoveredIntentRate` (`0.39`).
- **SC-002**: A seeded registry missing its `hub-router.json` parsed input → `registry_unparseable` finding → `verdict:'BLOCKED-BY-REGISTRY'`.
- **SC-003**: A seeded alias owned by two modes (with a valid `hub-router.json`) → `aliasCollisions` populated + `alias_collision` finding → `verdict:'BLOCKED-BY-REGISTRY'`.
- **SC-004**: `scanConnectivity` output is byte-equivalent for registry-less skills; the only diff deletions are the penalty refactor + the export line.
- **SC-005**: `node --check d5-connectivity.cjs` exits 0; the vitest diff is additive (no existing block modified).

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The full skill-benchmark vitest suite is not runnable offline | No-regression cannot be proven by a green suite run | Verify no-regression at the function level (`scanConnectivity` unchanged + runs) and the additive-diff level; re-run the suite in a networked environment to close out |
| Risk | The new scan changes `scanConnectivity`'s numbers | Existing skills mis-score | Guard behind `registryPresent`; touch `scanConnectivity` only via the same-value `SEVERITY_PENALTY` const and the export line |
| Risk | An unparseable registry crashes the run | The auditor takes down the benchmark | Fail soft: emit a `registry_unparseable` P0 finding and `BLOCKED-BY-REGISTRY` instead of throwing |
| Risk | `uncoveredIntentRate` drift blocks a clean registry | False positive on an informational metric | Keep the threshold gate OFF by default; the measured `0.39` (vs the ~0.46 research baseline) is reported, not gated |
| Dependency | `mode-registry.json` + `hub-router.json` + `design-*/` packet folders (sk-design) | Audit inputs | Internal, green; absent → benign no-op |
| Dependency | `scanConnectivity` (same file) | Shape/severity/score model mirrored | Internal, green; must remain untouched |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: For a registry-less skill the scan returns a fixed benign pass (`registryPresent:false`, `score:100`, empty arrays); `scanConnectivity` output is unchanged.

### Backward Compatibility
- **NFR-B01**: `scanConnectivity` keeps its signature, body, and return keys; `scanHubRegistry` is purely additive to `module.exports`, and the CLI registry section runs only when `registryPresent`.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Registry Boundaries
- **No registry**: `mode-registry.json` absent at `skillRoot` → benign pass, no gate.
- **Unparseable registry**: a parsed input that will not JSON-parse → `registry_unparseable` P0 finding + `BLOCKED-BY-REGISTRY` (no throw).

### Defect Boundaries
- **Dead packet**: an on-disk `design-*/` packet folder not referenced by any registry mode `.packet` is flagged P0.
- **Alias collision**: a lowercased alias mapped to two or more distinct modes is flagged P0.
- **Name drift only**: a `packetSkillName` vs `SKILL.md` `name:` mismatch with no hard defect lowers the score but does NOT trip the gate.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One additive function plus a shared-const refactor in a single `.cjs` module, plus additive vitest blocks.
- **Risk concentration**: Regression risk is contained by the `registryPresent` guard and the unchanged `scanConnectivity`; the controlling guards are the function-level no-regression and the additive diff.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the full skill-benchmark vitest suite gate completion? **RESOLVED: Not this phase; the suite is not runnable in this offline environment (network + own config), so no-regression is verified at the function + diff level and the suite is left to re-run in a networked environment.**
- Should `uncoveredIntentRate` gate the build? **RESOLVED: No; the threshold gate ships OFF by default. The measured `0.39` (vs the ~0.46 research baseline) is reported drift signal, not a defect.**
- Should `packetNameMismatch` trip `BLOCKED-BY-REGISTRY`? **RESOLVED: No; the hard-violation set is fixed to missing mode / dead packet / alias collision / unparseable registry. A name drift is a reported P1.**

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
- Evidence: scanHubRegistry beside scanConnectivity + BLOCKED-BY-REGISTRY gate; healthy registry (empty arrays, uncoveredIntentRate 0.39) + synthetic unparseable/alias-collision both BLOCKED-BY-REGISTRY
- Limitation: full vitest suite not runnable offline; no-regression verified at function + diff level
-->
