---
title: "Feature Specification: Phase 7: adapter-sk-code"
description: "Phase 007 plans the sk-code deep-alignment adapter, the hardest of the four v1 authorities. ADR-008 is LOCKED to HYBRID: it detects the active sk-code surface via the shared smart-router markers, loads that surface's reference patterns, and runs a two-layer check() — the existing deterministic pattern-drift checkers where they exist, plus reasoning-agent judgment for the rest, each finding honestly layer-tagged with an accepted-deviation set, not a deterministic linter."
trigger_phrases:
  - "deep-alignment sk-code adapter"
  - "sk-code surface detection alignment"
  - "reasoning agent conformance check"
  - "sk-code automatability limits"
  - "accepted deviation set sk-code"
importance_tier: "normal"
contextType: "general"
status: "planned"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/007-adapter-sk-code"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Draft phase 007 sk-code adapter spec"
    next_safe_action: "Await 006 adapter shapes before execution"
    blockers:
      - "006-adapter-sk-git-and-sk-design not yet executed"
    key_files:
      - ".opencode/skills/sk-code/SKILL.md"
      - ".opencode/skills/sk-code/shared/references/smart_routing.md"
      - ".opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-007"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether MOTION_DEV overlay findings route through the WEBFLOW lane or their own peer lane"
    answered_questions:
      - "ADR-008 LOCKED: HYBRID — deterministic surface-detection + reasoning-based pattern-conformance, honestly layer-tagged; this phase designs the specific split, not whether to use one"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: adapter-sk-code

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-11 |
| **Branch** | `system-deep-loop/059-deep-alignment-mode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 9 |
| **Predecessor** | 006-adapter-sk-git-and-sk-design |
| **Successor** | 008-iterate-converge-report |
| **Handoff Criteria** | A future executor can begin coding the sk-code adapter directly from this plan: the surface-detection reuse boundary, the deterministic-checker-first layering rule, the reasoning-agent fallback scope, and the honest automatability-limits statement are all named with real paths. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deep-alignment` sequences its v1 authorities by determinism (sk-doc, sk-git, sk-design, then sk-code last) because sk-code conformance is the hardest to automate: "does this code follow the surface's stack patterns" is a judgment call, not a fixed grammar. Without a named adapter, a lane scoped to `authority=sk-code` has no discover/check implementation, and worse, an under-specified adapter risks pretending to be a deterministic linter when it is not.

### Purpose
Produce an evidence-grounded, honesty-first plan for the sk-code adapter: reuse the existing surface-detection router instead of reinventing it, layer the existing deterministic pattern-drift checkers where they already exist, and state plainly what remains reasoning-agent judgment with an accepted-deviation set - so a future implementer builds an adapter that is candid about its limits rather than one that overclaims determinism.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Phase Context

This is **Phase 7** of the `system-deep-loop/059-deep-alignment-mode` mode-packet specification.

**Scope Boundary**: Plan only. No adapter code, no mode-packet `SKILL.md`, no scripts ship in this phase.

**Dependencies**: The adapter contract `{ discover(scope)->artifacts, standardSource(authority)->templates+rules, check(artifact,rules)->findings }` (frozen in phase 002 as ADR-003; phase 005 is its reference implementation) is treated as locked. Phase 006 established the pattern of layering an existing deterministic rule source (sk-git's commit grammar) before adding adapter-local judgment; this phase extends that pattern to sk-code, where the deterministic layer is thinner and the honest-limits statement matters more.

**Deliverables**: A named plan for the sk-code adapter's `discover()`/`standardSource()`/`check()` behavior, an explicit deterministic-vs-reasoning-agent layering rule, an accepted-deviation set location, and a written automatability-limits statement.

**Changelog**: When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.

### In Scope
- Plan `discover()`: resolve a lane's scope into code artifacts and, for each, detect its sk-code surface (`WEBFLOW`, `OPENCODE`, `MOTION_DEV` overlay) by reusing the shared surface router rather than reimplementing detection heuristics.
- Plan `standardSource()`: load the detected surface's reference patterns (`code-webflow/references/` or `code-opencode/references/`) as the rule set, per the same resource-map pattern the sk-code hub itself uses.
- Plan `check()` as a two-layer pass: (1) run the existing deterministic pattern-drift checker for the surface where one exists, (2) apply reasoning-agent judgment for everything that checker does not cover, with every reasoning-agent finding tagged as such and cited to file:line evidence.
- Document the accepted-deviation set (alignment contract invariant 2) and where it is authored/maintained.
- Write an honest automatability-limits statement: name exactly what is deterministic today, what is reasoning-agent judgment, and why the boundary sits where it does.

### Out of Scope
- Implementing the adapter in code - future phase, not this scaffold.
- The sk-doc, sk-git, and sk-design adapters - owned by phases 005 and 006.
- Wiring this adapter into the iterate/converge loop - owned by phase 008.
- Command, agent, and advisor cutover work - owned by phase 009.
- Building new deterministic linters beyond what already exists (`verify_alignment_drift.py` and the Webflow minification/verification script chain) - out of scope; this phase reuses, not extends, the deterministic layer.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-alignment/adapters/sk-code-adapter.*` (future, not yet created) | Plan only | This phase documents the discover/standardSource/check plan; no file is created. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reuse the shared sk-code surface-detection router instead of reimplementing detection heuristics. | `plan.md` cites `.opencode/skills/sk-code/shared/references/smart_routing.md` and `stack_detection.md` as the surface-detection source and states the adapter calls into that router rather than forking WEBFLOW/OPENCODE/MOTION_DEV detection logic. |
| REQ-002 | State the automatability-limits boundary honestly. | `spec.md` and `plan.md` name exactly which checks are deterministic (citing `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py` for OPENCODE-surface TS/JS/Python/Shell/JSON/JSONC pattern drift, and the Webflow minification/verification script chain for WEBFLOW-surface checks) versus which checks require reasoning-agent judgment, with no claim that the reasoning-agent layer is deterministic or fully reproducible. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Define the deterministic-first, reasoning-agent-second layering rule for `check()`. | `plan.md` Architecture section states the adapter runs the surface's existing deterministic checker first (when one exists for that surface) and only falls back to reasoning-agent judgment for what the checker does not cover, with each finding tagged by which layer produced it. |
| REQ-004 | Define the accepted-deviation set location for sk-code. | `plan.md` names where the sk-code known-deviation list lives (authority-local per ADR-005's per-authority suppression lists, consistent with phase 006's adapters). |
| REQ-005 | Define the VERIFY-FIRST re-probe behavior for sk-code findings. | `plan.md` states that a reasoning-agent finding is re-checked against the current file content (not a cached discover-time snapshot) immediately before being asserted, and that deterministic-checker findings are re-run rather than reused from a prior pass. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future implementer can build the sk-code adapter's surface-detection call directly from this plan without re-deriving WEBFLOW/OPENCODE/MOTION_DEV precedence logic.
- **SC-002**: The plan names, per surface, exactly which conformance checks are deterministic today and which require reasoning-agent judgment, with no overclaimed determinism.
- **SC-003**: The plan states the accepted-deviation set location and the verify-first re-probe step for both layers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-code's shared surface router (`shared/references/smart_routing.md`, `stack_detection.md`) | If surface detection logic changes, the adapter's `discover()` must be re-synced. | Call into the shared router rather than forking detection heuristics, so upstream changes propagate automatically. |
| Risk | Reasoning-agent findings are non-deterministic across runs/models. | Two alignment runs on the same code could disagree on a non-deterministic-layer finding, undermining the "converged" claim. | Tag every finding with its producing layer (`deterministic` vs `reasoning-agent`); weight convergence signals toward deterministic-layer findings in phase 008's convergence logic; treat reasoning-agent findings as advisory until corroborated across iterations. |
| Risk | `verify_alignment_drift.py` only covers OPENCODE surface (TS/JS/Python/Shell/JSON/JSONC); WEBFLOW surface has thinner deterministic coverage (minification/runtime scripts, not full pattern-conformance). | The adapter could look more deterministic for OPENCODE than for WEBFLOW, producing uneven confidence across lanes. | State this asymmetry explicitly in the automatability-limits statement rather than presenting both surfaces as equally checked. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The deterministic-checker layer runs before the reasoning-agent layer per artifact, so cheap ground-truth checks are not gated behind expensive judgment passes.

### Security
- **NFR-S01**: The adapter's `check()` never writes to reviewed code (read-only alignment contract default); `verify_alignment_drift.py` invocation is read-only per its own design ("behavior-neutral: it only inspects files").

### Reliability
- **NFR-R01**: If the deterministic checker for a surface is unavailable or errors, the adapter falls back to reasoning-agent-only judgment for that artifact and marks the deterministic layer as `unavailable` rather than silently treating it as clean.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Artifact surface resolves to `UNKNOWN` (neither WEBFLOW nor OPENCODE detected): adapter reports a `surface-undetected` finding category rather than silently skipping the artifact or defaulting to a guessed surface.
- MOTION_DEV overlay detected alongside WEBFLOW or OPENCODE: adapter loads the Motion.dev overlay reference material as supplemental evidence per `.opencode/skills/sk-code/shared/references/smart_routing.md` §5, not as a replacement surface.

### Error Scenarios
- `verify_alignment_drift.py` exits non-zero on a genuinely malformed file the checker cannot parse: adapter reports the parse failure as its own finding, distinct from a conformance violation.

### State Transitions
- Not applicable to this phase - the adapter is read-only in v1; no state mutation occurs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One adapter, but two surfaces (WEBFLOW, OPENCODE) plus the MOTION_DEV overlay to plan for. |
| Risk | 15/25 | Highest risk of the v1 authorities: reasoning-agent non-determinism and uneven deterministic coverage across surfaces. |
| Research | 12/20 | Cross-read of `sk-code/SKILL.md`, the shared router, `verify_alignment_drift.py`, and the Webflow script chain. |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- ADR-008 is now LOCKED: HYBRID (deterministic surface-detection + reasoning-based pattern-conformance, honestly layer-tagged per ADR-005). This phase no longer chooses between fully-reasoning/hybrid/deterministic-only shapes; its remaining design task is the *specific* deterministic-vs-reasoning split within that locked frame — how much beyond the existing `verify_alignment_drift.py` coverage layer 1 reaches (without building a new linter, explicitly out of scope) versus what layer 2 covers by reasoning-agent judgment — and this phase's execution pass produces that evidence-cited split.
- Whether MOTION_DEV overlay findings route through the WEBFLOW lane's report or form their own peer lane - TBD.
- Whether the accepted-deviation set for sk-code should be seeded from `verify_alignment_drift.py`'s own skip-path allowlist (e.g. `is_context_advisory_path`, `is_test_heavy_path`) or authored fresh - TBD.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
