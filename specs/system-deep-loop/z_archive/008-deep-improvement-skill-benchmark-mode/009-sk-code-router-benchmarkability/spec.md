---
title: "Feature Specification: sk-code Router Benchmarkability (Lane C reference-following)"
description: "sk-code cannot be benchmarked by the Lane C skill-benchmark harness because its smart router is delegated to references/smart_routing.md, while the harness only parses inline INTENT_SIGNALS/RESOURCE_MAP in SKILL.md. This packet teaches the harness to follow the reference and gives sk-code a machine-readable router projection."
trigger_phrases:
  - "sk-code router benchmarkability"
  - "skill-benchmark reference-following"
  - "router_unparseable sk-code"
  - "parseRouter referenced doc"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/009-sk-code-router-benchmarkability"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped reference-following harness + sk-code router block, fixtures, tests, re-benchmark"
    next_safe_action: "Run validate.sh --strict, then reconcile metadata"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/skill-benchmark/router-replay.cjs"
      - ".opencode/skills/sk-code/references/smart_routing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-router-benchmarkability"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Fix path: Option 3a-structured (teach harness + add machine-readable block to smart_routing.md)"
---
# Feature Specification: sk-code Router Benchmarkability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-01 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Lane C skill-benchmark harness parses a skill's router by literal-scanning **`SKILL.md`** for `INTENT_SIGNALS = {` and `RESOURCE_MAP = {`. `sk-code` deliberately delegates its authoritative router to `references/smart_routing.md` (the "template customization surface" design) and uses an `INTENT_MODEL` + prose maps, so the harness finds no inline dictionaries. A run reports `router_unparseable` (P0) → `BLOCKED-BY-STRUCTURE`, plus 94 false `orphan_reference` findings. `sk-code` cannot be benchmarked at all.

### Purpose
Make `sk-code` first-class benchmarkable by Lane C **without breaking the inline-router skills**: teach the harness to follow a referenced router doc when `SKILL.md` has no inline block, and give `sk-code` a single machine-readable router projection inside `smart_routing.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Harness: `parseRouter` follows a referenced router doc when inline dicts are absent.
- Thread `skillRoot` through `routeSkillResources`, `d5-connectivity.cjs`, `contamination-lint.cjs`.
- `sk-code`: add a machine-readable `INTENT_SIGNALS` + `RESOURCE_MAP` + `DEFAULT_RESOURCE` block to `references/smart_routing.md`.
- A small lint-clean `sk-code` fixture set; regression tests; before/after benchmark evidence.

### Out of Scope
- Live Mode B (in-situ file-load trace) — not built; positive D1-intra/D2/D3 gold deferred to it.
- D4 usefulness ablation — follow-on.
- Markdown-table scraping of prose maps (Option 3a-scrape) — rejected for fragility (decision-record).
- Editing `sk-code/SKILL.md` routing or the prose maps' behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Modify | `parseRouter(text, skillRoot)` + `findReferencedRouterDoc()`; `routerSource` |
| `.opencode/skills/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs` | Modify | Pass `skillRoot` to `parseRouter` |
| `.opencode/skills/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs` | Modify | Pass `skillRoot` to `parseRouter` |
| `.opencode/skills/sk-code/references/smart_routing.md` | Modify | Add §11 machine-readable router block |
| `.opencode/skills/sk-code/benchmark/fixtures/sk-code/*.json` | Create | 2 public/private fixture pairs (skill-local, not the harness default) |
| `.opencode/skills/sk-code/benchmark/{baseline,after,full}/` | Create | benchmark report artifacts (evidence) |
| `.opencode/skills/sk-code/benchmark/README.md` | Create | run command (with `--fixtures-dir`) + layout note |
| `.opencode/skills/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Modify | Reference-following regression tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Harness follows a referenced router doc when inline dicts absent | `parseRouter(skillMd, skcodeRoot).parseable === true`, `routerSource` contains `smart_routing.md` |
| REQ-002 | Inline-router skills byte-unchanged | `cli-codex` routes identically; `routerSource === 'inline'`; pre-existing tests pass |
| REQ-003 | Router-less skills still gate | No inline dicts + no referenced doc → `parseable:false` / `gateFailed:true` |
| REQ-004 | No dead resource paths introduced | D5 on sk-code: `deadResourcePaths === []`, `gateFailed === false` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | sk-code scores end-to-end | Re-benchmark verdict not `BLOCKED-BY-STRUCTURE`; ≥1 scored scenario |
| REQ-006 | Fixtures contamination-clean | `lintFixture` passes on every public prompt |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: sk-code verdict `BLOCKED-BY-STRUCTURE` → `CONDITIONAL` (aggregate 69), D5 `0 → 91`, `router_unparseable` `1 → 0`, orphans `94 → 3`.
- **SC-002**: Full `deep-improvement` vitest suite green (214 tests), including 4 new reference-following tests.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Changing shared parser breaks inline-router benchmarks | High | Inline path primary; fallback fires only when inline empty; full suite re-run |
| Risk | Structured block drifts from prose maps | Med | §11 documented as sync source |
| Risk | Flat projection misrepresents routing quality | Med | Surface-flatten / phase-boost / anti-signal limits documented; positive gold deferred to Mode B |
| Dependency | Lane C harness scripts | Green | Internal, present |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Live Mode B will replace the D2/D3 proxies and enable positive routing gold for sk-code.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Reference-following adds at most one file read per benchmark run (only when inline dicts are absent).

### Security
- **NFR-S01**: `findReferencedRouterDoc` is existence-guarded and resolves only within `skillRoot`; no new exec paths.

### Reliability
- **NFR-R01**: Backward-compatible — inline-router skills and router-less skills behave identically to before.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No inline dicts and no referenced doc: stays `parseable:false` (router-less gate preserved).
- Referenced doc exists but contains no dictionaries: stays `parseable:false`.

### Error Scenarios
- Pointer path missing on disk: skipped; convention fallback (`references/smart_routing.md`) tried next.
- Both absent: unparseable, D5 hard-gates as before.

### State Transitions
- Inline present: fallback never runs (`routerSource === 'inline'`).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 4 code/doc files + 4 fixtures + 1 test file, ~335 LOC |
| Risk | 14/25 | Shared benchmark tooling; mitigated by additive design + full suite |
| Research | 8/20 | Parser + scoring + contamination contracts read end-to-end |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
