# 027 pt-02 Proposed Sub-Packet Amendments

These are proposals only. They are not applied to the five phase specs in this dispatch.

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-02/sub-packet-amendments.md.
## Phase 004 amendments

**Status**: NEEDS_AMENDMENT

**REQ-level edits**

- Change REQ-001 text to: `Render "MUST invoke FIRST" wording only for recommendations that satisfy confidence >= threshold and uncertainty <= threshold, whether that is derived locally or proven by passes_threshold invariant.`
- Add to P0: `REQ-007 | High-uncertainty guard | A recommendation with high numeric uncertainty MUST NOT render mandate wording unless the producer contract proves passes_threshold already encoded the uncertainty threshold.`
- Change REQ-003 text to: `FIRST_ACTION_HINT map may provide skill-specific hints, but missing hints MUST fall back to a safe generic instruction such as "open the skill instructions first".`
- Add to P0: `REQ-008 | Legacy string fixture migration | Renderer and producer tests that pin old "use X" brief strings MUST be intentionally updated to mandate wording and directive-shape assertions.`
- Add to P1: `REQ-009 | Boundary fixtures | Tests MUST cover 0.79, 0.80, and 0.81 confidence with uncertainty at and over threshold.`

**Plan-level edits**

- Add step before wording change: `Choose guard strategy: renderer-side uncertainty re-check, or producer invariant fixture proving passes_threshold encodes both confidence and uncertainty.`
- Add step: `Implement fallback hint for missing skill labels and test an unknown safe label.`
- Add step: `Update exact renderer/producer fixtures and preserve poisoning, null, freshness, cache, cap, and ambiguous-output tests.`
- Add step: `Run token-cap fixtures for the longest known label plus longest hint under normal and ambiguous paths.`
- Keep scorer internals out of scope unless the producer invariant cannot be established without touching scorer-owned code.

**Tasks-level edits**

- Add task: `T-004A: Add high-uncertainty passes_threshold fixture.`
- Add task: `T-004B: Add 0.79/0.80/0.81 inclusive threshold tests.`
- Add task: `T-004C: Add unknown safe skill label fallback-hint fixture.`
- Add task: `T-004D: Rewrite renderer and producer exact-string tests for mandate wording.`
- Add task: `T-004E: Add longest-label/longest-hint token cap tests.`

**Risks-level edits**

- Add risk: `Mandate wording can overstate confidence if passes_threshold bypasses uncertainty; mitigate with renderer-side guard or producer invariant.`
- Add risk: `Static hint map can drift as inventory changes; mitigate with fallback hint.`
- Add risk: `Exact string fixtures will fail after wording change; mitigate with intentional fixture migration.`

**LOC delta estimate**

- Original estimate: ~30 LOC.
- Proposed delta: +50 to +90 LOC.
- Revised estimate: ~80 to ~120 LOC, mostly tests and fallback/guard logic.

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-02/sub-packet-amendments.md.
