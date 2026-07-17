---
title: "Feature Specification: Fleet-Wide Routing Consistency (3-tier standard)"
description: "Make every skill's in-document router and routing JSON artifacts work well, be tested, and be CONSISTENT across the whole fleet — one universal base for all 49 units (7 parents, 37 child modes, 5 normals) with a minimal, principled per-tier delta. Converge everything to the standard and de-skill-specific the shared benchmark harness, then verify the whole fleet (mutation + blind-holdout + live-mode) once consistent."
trigger_phrases:
  - "fleet routing consistency"
  - "3-tier routing standard"
  - "consistent routers across all skills"
  - "de-skill-specific benchmark harness"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/020-fleet-routing-consistency"
    last_updated_at: "2026-07-17T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Route-gold gate full-fix: 7/7 hubs PASS (91 scenarios), each SOL-agent output independently verified honest; committed + pushed to v4"
    next_safe_action: "REQ-001 (de-skill-specific the shared harness) + REQ-002 full shape convergence, then REQ-006 fleet verification (mutation + blind holdout + live-mode)"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "020-fleet-routing-consistency-authoring"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions:
      - "Ratified 2026-07-17: adopt the 3-tier standard (universal base + minimal per-tier delta); converge all 49 units + de-skill-specific the harness FIRST, verify the whole fleet at end"
      - "Verification (mutation + blind-holdout + live-mode) deferred to the end, run once across the consistent fleet — carrying the 3-model finding that deterministic typedPairRecall may be circular"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Fleet-Wide Routing Consistency (3-tier standard)

---

## EXECUTIVE SUMMARY

The routing config across the skill fleet is a patchwork. Every unit has an in-document router, but the typed-pair surface (leaf-manifest + resolvable router pairs) exists on only 6 of 12 top-level skills, two playbook shapes coexist (index-table vs frontmatter → two non-comparable gold-provenance methods), and the shared benchmark harness is skill-specific (a hardcoded `MR-`→browser classifier, an sk-code-only path extractor) so it does not score the tiers uniformly. Three independent model reviews (GPT-5.6-SOL, GPT-5.6-LUNA, Fable-5) additionally flagged that the current green `typedPairRecall=1.0` scores may be circular (gold matching the router), so config-coherence is proven but real routing quality is not.

This packet makes the in-document routers and the routing JSON artifacts **consistent, tested, and working across all 49 units** — 7 parent hubs, 37 child modes, 5 normal standalone skills — under one universal base with a minimal, principled per-tier delta, then verifies the whole fleet once it is consistent.

**Key Decisions**: One canonical base for every unit. Frontmatter typed-gold is the single gold shape (index-table converges to it). The shared harness is de-skill-specific so all tiers score identically. Convergence lands first; fleet verification (mutation + blind-holdout + live-mode, with precision not just recall) runs once at the end.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress (route-gold gate: 7/7 hubs PASS; REQ-001/002-full/006/007 remain) |
| **Created** | 2026-07-17 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/031-sk-doc-router-alignment` |
| **Parent Spec** | ../spec.md |
| **Evidence Source** | This session's fleet inventory scan; 3-model critical review (SOL/LUNA/Fable-5) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Routing config is inconsistent across the fleet, in ways that make it hard to trust and test uniformly:

1. **Typed surface uneven.** `leaf-manifest.json` + a resolvable surface router exist on 6 units (sk-code, sk-doc, sk-design, sk-prompt, system-deep-loop, system-code-graph). Missing on 2 parent hubs (cli-external-orchestration, mcp-tooling) and 4 normal skills (mcp-code-mode, sk-git, system-skill-advisor, system-spec-kit).
2. **Two playbook shapes.** Index-table (body-gold) vs frontmatter (typed-gold) coexist, so cross-skill scores are not comparable and gold provenance differs per skill.
3. **Skill-specific shared harness.** `classifyKind` hardcodes the `MR-` prefix to browser tests (an sk-code convention); `extractPaths` only preserves sk-code-style folder prefixes. The test harness therefore treats tiers unequally, and per-skill workarounds (renames) mask latent collisions.
4. **Uneven artifacts.** `leaf-aliases.json` on only 2 units; advisor `skill-graph.json` coverage unverified.
5. **Possible oracle circularity.** Deterministic `typedPairRecall=1.0` may reflect gold matching the router, not correctness (3-model finding).

### Purpose

Bring every unit to one consistent, tested routing standard, de-skill-specific the harness so all tiers score identically, then verify the fleet actually routes well (not just coheres).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### The 3-tier standard (ratified)

- **Universal base (every unit — parent, child, normal):** one canonical in-document router (`INTENT_SIGNALS` + `RESOURCE_MAP`, single shape, no glob `RESOURCE_DOMAINS`); `references/`/`assets/`; a `manual_testing_playbook` in the frontmatter typed-gold shape.
- **Child mode = base + parent link:** registered in the parent's `mode-registry.json`; its leaves roll up into the parent's `leaf-manifest.json`; may inherit the parent's `shared/` preamble. No hub JSONs of its own.
- **Parent hub = base + aggregation:** `hub-router.json` (mode-selection policy) + `mode-registry.json` (mode list) + one hub-level `leaf-manifest.json` rolling up all children + one hub-level surface router.
- **Normal standalone = base + own manifest:** registry-less `leaf-manifest.config.json` + inline router (the system-code-graph pattern). No hub JSONs.

### In Scope

- Converge all 49 units (7 parents, 37 children, 5 normals) to the standard: fill the 6 missing typed surfaces; converge every index-table playbook to frontmatter typed gold; standardize the in-document router shape.
- De-skill-specific the shared harness: replace the `MR-` prefix hardcode with explicit per-scenario metadata; generalize or retire the sk-code-only `extractPaths` body-gold path (frontmatter is the standard); add a CI gate that regenerates every `leaf-manifest.json` and diffs (fail on drift) and refreshes committed baselines.
- Advisor consistency: confirm `skill-graph.json` represents every unit uniformly and the scorer treats tiers identically.
- Fleet verification (end): mutation test (does the green have teeth), autopsy of sk-design's only non-1.0 signal, blind independently-authored holdout + live-mode run scored with precision + confusion matrices, and a Layer-0 (right-skill) end-to-end pass.

### Out of Scope

- Changing what a hub dispatches to at runtime beyond routing-config shape.
- Re-authoring skill content unrelated to routing.

### Files to Change

Fleet-wide: per-unit `SKILL.md` routers, `leaf-manifest.json`/`leaf-manifest.config.json`, `shared/references/smart_routing.md`, `mode-registry.json`, playbook fixtures; shared `load-playbook-scenarios.cjs` (classifier + gold-derivation), the manifest generator/contract, a new CI freshness gate; the advisor `skill-graph.json`/scorer config as needed.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | De-skill-specific the shared harness | `classifyKind` no longer keys behaviour off a hardcoded skill prefix; the gold path works for any unit; the 6 already-typed skills re-verify with zero regression (byte-stable manifests, unchanged benchmarks) |
| REQ-002 | Every unit meets the universal base | Each of the 49 units has the canonical in-document router + frontmatter typed-gold playbook; a fleet scan shows one shape, no glob RESOURCE_DOMAINS |
| REQ-003 | Fill the 6 missing typed surfaces | cli-external-orchestration, mcp-tooling, mcp-code-mode, sk-git, system-skill-advisor, system-spec-kit each carry a resolvable typed surface per their tier; topology blocked=0 |
| REQ-004 | Per-tier delta is exactly as ratified | Parents differ only by the two hub JSONs + rollup; children only by a registry entry; normals only by a registry-less manifest config; a validator enforces the tier shape |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | CI freshness gate | A gate regenerates every leaf-manifest and diffs; committed baselines are refreshed and stop misrepresenting current state |
| REQ-006 | Fleet verification proves teeth | Mutation tests drop recall materially; a blind independently-authored holdout + live-mode run reports precision + confusion matrices; sk-design's non-1.0 misses are explained; a Layer-0 right-skill pass runs |
| REQ-007 | Advisor represents the fleet uniformly | skill-graph.json covers every unit; the scorer treats tiers identically |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fleet scan shows every unit conforms to its tier's shape with one canonical router + one gold shape.
- **SC-002**: The shared harness scores parent/child/normal identically; no skill-specific branches remain.
- **SC-003**: The 6 previously-missing units carry a resolvable typed surface; topology blocked=0 fleet-wide.
- **SC-004**: Mutation tests prove the benchmark has teeth (recall drops on corruption); a blind holdout + live-mode run reports real routing quality with precision, not just recall.
- **SC-005**: Committed baselines are current; a CI gate prevents silent drift.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Harness de-skill-specifying regresses the 6 already-typed skills | Medium | High | Fleet re-verify after every shared change (byte-stable manifests + unchanged benchmarks), as proven on contract v2 |
| Converging 49 units propagates a circular/hollow gold pattern | Medium | High | The 3-model finding is carried; fleet verification (mutation + blind holdout + live) is a hard gate before "done" |
| Scale (49 units) exhausts one context | High | Medium | Execute per-tier / per-parent-family via fresh agents with strong per-unit verification; pace across phases |
| system-spec-kit (large) and system-skill-advisor (meta) resist a normal typed surface | Medium | Medium | Treat them per their real nature; a unit may legitimately carry an empty/minimal surface if it is not a router — document rather than force |

### Dependencies

| Dependency | Status |
|------------|--------|
| The typed-pair recipe proven on 5 skills this session | Shipped on v4 |
| Shared contract v2 (roots widened, backward-compatible) | Shipped on v4 |
| 3-model critical review (SOL/LUNA/Fable-5) | Captured; drives REQ-006 |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-M01 (Measurability):** every reported routing number distinguishes deterministic coherence from live routing quality and reports precision alongside recall.
- **NFR-C01 (Uniformity):** no shared harness path may branch on a specific skill's identity or naming convention.

## 8. EDGE CASES

- A "skill" that is not really a router (e.g. the advisor itself, or a docs-only skill) may carry a minimal/empty typed surface — documented, not forced into a false one.
- A child mode whose leaves overlap a sibling's: the parent rollup dedupes on the typed pair, never on leaf id alone.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 24/25 | 49 units across 3 tiers + shared harness + advisor + a verification package |
| Risk | 18/25 | Shared-harness changes can regress the fleet; possible circular gold underneath green scores |
| Research | 8/20 | Standard + sequencing ratified; verification methods specified by the 3-model review |
| Coordination | 14/15 | Many units, per-tier phases, fleet re-verify gates, concurrently-active shared harness |
| **Total** | **64/100** | **Level 3** |

## 10. OPEN QUESTIONS

- Whether sk-code (currently index-table body-gold) converts to frontmatter like the rest, or the body-gold path is retained as a second sanctioned shape — resolved in Phase 1 when the harness is de-skill-specified.
- The exact live-mode sample size + who authors the blind holdout (independence is the point) — resolved before REQ-006.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Parent**: `../spec.md` (031 router-alignment program)
- **Preceding phases**: `../015`…`../019` (per-skill research + the 5 shipped implementations)
- **Reference**: `../routing-config-and-advisor-reference.md` (what every routing artifact does)
