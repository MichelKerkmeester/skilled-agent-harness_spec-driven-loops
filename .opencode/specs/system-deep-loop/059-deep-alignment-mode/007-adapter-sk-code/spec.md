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
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/007-adapter-sk-code"
    last_updated_at: "2026-07-11T14:56:54Z"
    last_updated_by: "claude"
    recent_action: "Built and CLI-verified the sk-code adapter (3 files)"
    next_safe_action: "Wire adapter into phase 008 ITERATE/CONVERGE loop"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_code_adapter.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_code_known_deviations.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-007"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "MOTION_DEV overlay lane routing (WEBFLOW lane vs peer lane) -- phase 008 REPORT-state question, not this adapter's"
    answered_questions:
      - "ADR-008 LOCKED: HYBRID -- deterministic surface-detection + reasoning-based pattern-conformance, honestly layer-tagged; implemented in sk-code.cjs, CLI-verified"
      - "Deviation set seeded from verify_alignment_drift.py's 4 real exemption functions plus 2 adapter-found conventions (6 entries, sk_code_known_deviations.md)"
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
| **Status** | Complete |
| **Created** | 2026-07-11 |
| **Branch** | `system-deep-loop/059-deep-alignment-mode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 9 |
| **Predecessor** | 006-adapter-sk-git-and-sk-design |
| **Successor** | 008-iterate-converge-report |
| **Handoff Criteria** | A future phase-008 executor can wire this adapter into the ITERATE/CONVERGE loop directly: `discover(scope)`/`standardSource(authority)`/`check(artifact,rules,options)` are implemented and CLI-verified in `scripts/adapters/sk-code.cjs`, matching the phase-005 reference shape. The honest automatability-limits statement (`sk_code_adapter.md` Section 9) is the load-bearing deliverable — met. |
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

**Scope Boundary**: Gate-flipped to In-Scope by operator approval 2026-07-11 (see Out of Scope's first bullet). The real, working `discover()`/`standardSource()`/`check()` adapter and its two reference docs ship in this phase, CLI-verified against live repo files (`sk_code_adapter.md` Section 8). Still **not** in scope: a mode-packet `SKILL.md` (phase 003's job, already shipped separately), and wiring this adapter into the iterate/converge loop (phase 008's job, unchanged).

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
- (gate now open per operator approval 2026-07-11 - see updated Files to Change below)
- The sk-doc, sk-git, and sk-design adapters - owned by phases 005 and 006.
- Wiring this adapter into the iterate/converge loop - owned by phase 008.
- Command, agent, and advisor cutover work - owned by phase 009.
- Building new deterministic linters beyond what already exists (`verify_alignment_drift.py` and the Webflow minification/verification script chain) - out of scope; this phase reuses, not extends, the deterministic layer.

### Files to Change

| File Path | Change Type | Description | Evidence |
|-----------|-------------|-------------|----------|
| `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_code_adapter.md` | Create | standardSource/check/discover specification for sk-code: HYBRID (ADR-008 LOCKED) deterministic surface-detection + reasoning-based pattern-conformance, honestly layer-tagged | 11 sections, live CLI-output transcripts in Section 8, honest automatability-limits statement in Section 9 |
| `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_code_known_deviations.md` | Create | sk-code known-deviation suppression list, 6 entries | `loadKnownDeviations()` parses it live — `node scripts/adapters/sk-code.cjs standard-source` returns all 6 IDs |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs` | Create | The real, working sk-code adapter (discover/standardSource/check + CLI) | `node --check` passes; `discover`/`check`/`standard-source`/`reasoning-dispatch` CLI subcommands all run against real repo files (transcripts in `sk_code_adapter.md` Section 8) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Evidence |
|----|-------------|---------------------|----------|
| REQ-001 | Reuse the shared sk-code surface-detection router instead of reimplementing detection heuristics. | `plan.md` cites `.opencode/skills/sk-code/shared/references/smart_routing.md` and `stack_detection.md` as the surface-detection source and states the adapter calls into that router rather than forking WEBFLOW/OPENCODE/MOTION_DEV detection logic. | MET. `sk-code.cjs`'s `classifySurface()` ports `stack_detection.md` §2's real Detection Order line-for-line (cited inline in code); no independent heuristic invented. Live-verified: `discover()` against `code-webflow/assets/scripts/` correctly applied the router's own documented OPENCODE-precedence rule (`sk_code_adapter.md` §8.2 transcript). |
| REQ-002 | State the automatability-limits boundary honestly. | `spec.md` and `plan.md` name exactly which checks are deterministic (citing `verify_alignment_drift.py` for OPENCODE-surface TS/JS/Python/Shell/JSON/JSONC pattern drift, and the Webflow minification/verification script chain for WEBFLOW-surface checks) versus which checks require reasoning-agent judgment, with no claim that the reasoning-agent layer is deterministic or fully reproducible. | MET. `sk_code_adapter.md` Section 9 states the fraction plainly: layer 1 = 12 mechanical rule types (OPENCODE) plus WEBFLOW scripts gated on a project-root precondition **currently unmet in this repo** (Section 8.1 — zero `src/2_javascript` roots found repo-wide, live `find` transcript); layer 2 (all architectural/pattern conformance) is 100% reasoning-agent, never self-judged by `sk-code.cjs` (`buildReasoningLayerDispatch()`/`checkPatternConformance()` only produce/consume a dispatch packet). Also corrects this very acceptance-criteria's own prose: `verify_alignment_drift.py` covers 7 languages including Rust, not 6. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Evidence |
|----|-------------|---------------------|----------|
| REQ-003 | Define the deterministic-first, reasoning-agent-second layering rule for `check()`. | `plan.md` Architecture section states the adapter runs the surface's existing deterministic checker first (when one exists for that surface) and only falls back to reasoning-agent judgment for what the checker does not cover, with each finding tagged by which layer produced it. | MET. `sk-code.cjs`'s `check()` calls `checkDeterministic()` then `checkPatternConformance()` in that fixed order (Section 10 of `sk-code.cjs`); every finding carries `layer: 'deterministic'` or `layer: 'reasoning-agent'` (`makeFinding()`). |
| REQ-004 | Define the accepted-deviation set location for sk-code. | `plan.md` names where the sk-code known-deviation list lives (authority-local per ADR-005's per-authority suppression lists, consistent with phase 006's adapters). | MET. `references/adapters/sk_code_known_deviations.md`, authority-local, same directory pattern as `sk_doc_known_deviations.md`. 6 entries, all traced to real tool source or a live-reproduced classification outcome (no invented conventions) — `loadKnownDeviations()` parses it live, confirmed via `standard-source` CLI output. |
| REQ-005 | Define the VERIFY-FIRST re-probe behavior for sk-code findings. | `plan.md` states that a reasoning-agent finding is re-checked against the current file content (not a cached discover-time snapshot) immediately before being asserted, and that deterministic-checker findings are re-run rather than reused from a prior pass. | MET. `check()` calls `runVerifyAlignmentDrift()`/`runNoArgWebflowScript()` fresh on every invocation (no caching across calls, mirroring `sk-doc.cjs`); `checkPatternConformance()` only accepts `options.verifiedFindings` supplied at `check()`-call time, never a cached `discover()`-time value — structurally satisfies "re-checked against current content" (`sk_code_adapter.md` §4.2's closing paragraph). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: MET. `sk-code.cjs`'s `classifySurface()` implements the WEBFLOW/OPENCODE/MOTION_DEV precedence logic directly from `stack_detection.md`/`smart_routing.md` — no re-derivation needed, since the implementation IS built (not just planned). CLI-verified (`sk_code_adapter.md` §8.2).
- **SC-002**: MET. `sk_code_adapter.md` Section 9 names, per surface, the exact deterministic coverage (12 OPENCODE rule types; WEBFLOW scripts gated on a project-root precondition, currently unmet repo-wide) versus the 100%-reasoning-agent layer 2, with no overclaimed determinism.
- **SC-003**: MET. Deviation-set location: `references/adapters/sk_code_known_deviations.md` (REQ-004 evidence). Verify-first re-probe: `sk_code_adapter.md` Section 5, both layers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-code's shared surface router (`shared/references/smart_routing.md`, `stack_detection.md`) | If surface detection logic changes, the adapter's `discover()` must be re-synced. | Call into the shared router rather than forking detection heuristics, so upstream changes propagate automatically. |
| Risk | Reasoning-agent findings are non-deterministic across runs/models. | Two alignment runs on the same code could disagree on a non-deterministic-layer finding, undermining the "converged" claim. | Tag every finding with its producing layer (`deterministic` vs `reasoning-agent`); weight convergence signals toward deterministic-layer findings in phase 008's convergence logic; treat reasoning-agent findings as advisory until corroborated across iterations. |
| Risk | `verify_alignment_drift.py` only covers OPENCODE surface (7 languages incl. Rust — TS/JS/Python/Shell/Rust/JSON/JSONC, confirmed by reading the tool; this row's own count undercounted by one); WEBFLOW surface has thinner deterministic coverage (minification/runtime scripts, not full pattern-conformance). CONFIRMED WORSE THAN ANTICIPATED: live-verified zero `src/2_javascript` project roots exist anywhere in this monorepo (`sk_code_adapter.md` §8.1), so WEBFLOW's real scripts are not merely thinner but currently unavailable for every WEBFLOW-surface artifact this adapter can discover here. | The adapter could look more deterministic for OPENCODE than for WEBFLOW, producing uneven confidence across lanes. | State this asymmetry explicitly in the automatability-limits statement rather than presenting both surfaces as equally checked. DONE — `sk_code_adapter.md` Section 9, with the `deterministic-layer-unavailable` finding type surfacing the gap per-artifact at runtime (NFR-R01) rather than hiding it. |
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
- `verify_alignment_drift.py` exits non-zero on a genuinely malformed file: VERIFIED — the tool is defensive by design (catches `UnicodeDecodeError`, wraps JSON/JSONC parse errors as its own `JSON-PARSE`/`JSONC-PARSE` findings) rather than crashing, so a malformed target becomes a normal `ERROR`-severity finding (mapped to P0 by this adapter, Section 6), distinct from a genuine subprocess failure (`python3` missing, unparseable stdout — mapped to `adapter-error`/P1). Both paths are implemented and distinguished in `sk-code.cjs`'s `checkOpencodeDeterministic()`.
- WEBFLOW subprocess failure (`node` missing, script throws before printing): mapped to `adapter-error`/P1, same pattern as the OPENCODE path — implemented in `checkWebflowDeterministic()`.

### State Transitions
- Not applicable to this phase - the adapter is read-only in v1; no state mutation occurs. Confirmed: `check()` never calls `minify-webflow.mjs` (the one script in this adapter's surface that writes files) — see `sk_code_adapter.md` Section 4.1.2.
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

- RESOLVED: ADR-008's specific deterministic-vs-reasoning split is now built and evidence-cited. Layer 1 reaches exactly `verify_alignment_drift.py`'s existing 12-rule-type/7-language coverage for OPENCODE (no new linter added, per scope) plus the two read-only Webflow scripts for WEBFLOW (gated on project-root discoverability, currently zero in this repo); layer 2 covers everything else via a dispatch-packet-and-pass-through, never self-judged. Full split: `sk_code_adapter.md` Section 9.
- STILL OPEN (correctly phase-008's concern, not this adapter's): whether MOTION_DEV overlay findings route through the WEBFLOW lane's report or form their own peer lane. This adapter's own contribution is limited to tagging `motionDevOverlay: true`/`false` on each artifact and surfacing the overlay reference path to the reasoning layer — lane/report routing is phase 008's REPORT-state design.
- RESOLVED: the accepted-deviation set is seeded from `verify_alignment_drift.py`'s own skip-path/severity-downgrade functions — `is_context_advisory_path`, `is_test_heavy_path`, `is_ts_pattern_asset`, `is_known_malformed_json_fixture` — plus 2 additional entries this adapter's own build found and verified live (OPENCODE-precedence classification of Webflow-named tooling paths; Motion.dev peer-library references). 6 entries total: `sk_code_known_deviations.md`.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
