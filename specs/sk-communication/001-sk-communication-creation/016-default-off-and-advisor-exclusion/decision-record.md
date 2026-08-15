---
title: "Decision Record: Phase 016 Default-Off and Advisor Exclusion"
description: "Architecture decisions for Phase 016: gate enablement at the activation seam, and exclude the skill through an adjustable denylist rather than deprecating it."
trigger_phrases:
  - "default-off-and-advisor-exclusion"
  - "architecture decision"
  - "activation seam gate and adjustable advisor denylist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/016-default-off-and-advisor-exclusion"
    last_updated_at: "2026-08-13T19:03:35.000Z"
    last_updated_by: "claude"
    recent_action: "Recorded the enablement-seam and advisor-denylist decisions."
    next_safe_action: "After landing on main, rebuild the advisor dist, reindex, and re-probe to confirm the exclusion."
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-016-default-off-20260813"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Enablement is gated at the activation seam through a pure resolver, not deep inside the library."
      - "The advisor exclusion is an adjustable denylist, not a deprecation or archive of the skill."
---
# Decision Record: Phase 016 Default-Off and Advisor Exclusion

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Gate enablement at the activation seam with a pure resolver

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-13 |
| **Deciders** | Accepted by the operator for the communication-projection privacy default |

---

<!-- ANCHOR:adr-001-context -->
### Context

Communication projection must be off by default for everyone, and an operator must be able to opt in privately on one machine without committing that choice for other people. The gate has to be reliable, testable, and impossible to leave on by accident after a repository pull.

### Constraints

- The default must be off with no opt-in present.
- An opt-in must stay local and never enter the repository.
- The decision must be deterministic and testable without disk access.
- Every activation path must consult the same gate before it rewrites output.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We decided**: gate enablement at the activation seam through `isProjectionEnabled()`, backed by a pure `resolveProjectionEnablement(env, localOverride)`, with a committed-default-off and a git-ignored local opt-in.

**How it works**: enablement reads two opt-in sources in order. The `COMMUNICATION_PROJECTION_ENABLED` environment variable decides the result when it is set to `1`, `true`, or `on`, which lets CI and tests force either state. When the variable is unset, a git-ignored `enablement.local.json` at the package root opts in when it holds `{ "enabled": true }`. With neither source opting in, the answer is `false`. The pure resolver takes the environment value and the parsed override as arguments, so the rule is exhaustively testable, and the thin `isProjectionEnabled()` wrapper reads the environment and the file. A committed `enablement.local.json.example` documents the shape, and the package `.gitignore` keeps the real file out of the repository.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Activation-seam gate with a pure resolver | Off by default, private opt-in, exhaustively testable, one checkpoint per activation path | Every activation path must remember to call the gate | 9/10 |
| Deep library gate inside the rewrite core | One internal chokepoint | Harder to test in isolation, and the default lives far from the activation decision where operators reason about it | 5/10 |
| Committed config flag instead of a git-ignored file | Visible in the repository | An opt-in would leak to everyone on commit, which breaks the private-per-machine requirement | 3/10 |

**Why this one**: the activation-seam gate keeps the default off, keeps the opt-in private, and makes the rule a pure function that tests can cover completely.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Pulling the repository never changes anyone's CLI output.
- The enablement rule is deterministic and fully covered by unit tests.

**What it costs**:

- Each activation path must call `isProjectionEnabled()`. Mitigation: the gate is a single, named entry point exported from the package surface.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An activation path forgets the gate and projects by default. | High | The gate is one exported function, and the projection contract requires it before any rewrite. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | The privacy default requires an off-by-default gate that no repository pull can flip on. |
| 2 | Beyond local maxima? | PASS | Three materially different placements and storage models were compared. |
| 3 | Sufficient? | PASS | A pure resolver plus a thin wrapper is the smallest design that meets the requirement. |
| 4 | Fits goal? | PASS | It makes adoption an explicit, private choice. |
| 5 | Open horizons? | PASS | New opt-in sources can extend the resolver without changing activation paths. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changed**:

- `src/config/enablement.ts`: `isProjectionEnabled()` and the pure `resolveProjectionEnablement(env, localOverride)`, defaulting to off.
- `src/config/index.ts` and `src/index.ts`: export the enablement surface.
- `enablement.local.json.example` and `.gitignore`: committed template and the git-ignore for the real opt-in file.

**How to roll back**: revert the enablement module and its exports, and remove the template and the git-ignore entry. Behavior returns to the prior always-reachable state.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Exclude the skill through an adjustable denylist

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-13 |
| **Deciders** | Accepted by the operator for advisor routing |

---

<!-- ANCHOR:adr-002-context -->
### Context

The advisor recommended `sk-communication` for projection-shaped prompts, but the skill is meant to be invoked by hand. The advisor had no per-skill exclusion mechanism, so there was no supported way to hold one valid skill out of routing without misrepresenting its state.

### Constraints

- The skill stays valid and manually invokable, so it must not be marked deprecated or archived to suppress routing.
- The exclusion must be operator-adjustable and reversible.
- A single machine must be able to change or clear the exclusion privately.
- A missing or malformed config must never crash routing or hide an active skill by accident.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We decided**: build an adjustable route-exclusion denylist rather than mislabeling the skill.

**How it works**: a committed `config/route-exclusions.json` holds `excludedSkillIds`, the shared knob that lists `sk-communication`. An optional git-ignored `config/route-exclusions.local.json` fully replaces the committed list when present, so one machine can change the set or clear it with an empty list. `SPECKIT_ADVISOR_ROUTE_EXCLUSIONS_DIR` points the loader at a different config directory for tests and deployments. The loader caches the resolved set and exposes a reset seam for tests. It is fail-safe: any read or parse failure resolves to an empty set and never throws. The set is enforced at both routability seams, `isDefaultRoutable` in `lib/scorer/fusion.ts`, which is the sole production recommend gate, and `filterDefaultRoutable` in `lib/lifecycle/archive-handling.ts` as defense in depth.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Adjustable denylist with a committed default and a local override | Honest, reversible, per-machine adjustable, and fail-safe | A new config surface to maintain | 9/10 |
| Mark the skill deprecated or archived | Uses existing lifecycle states | Misrepresents a valid, manually invoked skill and risks losing it from discovery | 2/10 |
| Hardcode the excluded id in advisor source | No config file | Not operator-adjustable and not reversible without a code change | 4/10 |

**Why this one**: the denylist suppresses routing while keeping the skill honest, and the committed-default plus git-ignored-override model makes the change shared, adjustable, and private where needed.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:

- The advisor no longer recommends `sk-communication`, confirmed by a live probe.
- The exclusion is a single, documented, reversible knob.

**What it costs**:

- The advisor dist is git-ignored, so the compiled gate takes effect on main only after a rebuild and reindex. Mitigation: the requirement is recorded in the packet and the config README.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A malformed config hides a skill or crashes routing. | High | The loader resolves to an empty set on any failure and never throws, so a broken file can only stop excluding a skill. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | The advisor had no per-skill exclusion mechanism for a manually invoked skill. |
| 2 | Beyond local maxima? | PASS | Three options were compared, including reusing lifecycle states. |
| 3 | Sufficient? | PASS | A committed default with a fail-safe loader and both seams wired is the smallest complete design. |
| 4 | Fits goal? | PASS | The skill stays valid and invokable while routing suppresses it. |
| 5 | Open horizons? | PASS | The denylist accepts any skill id and any local override without code changes. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changed**:

- `lib/routing/route-exclusions.ts`: fail-safe cached loader, env-dir override, and a test-reset seam.
- `config/route-exclusions.json`: committed denylist listing `sk-communication`, with a committed `.example` local-override template.
- `lib/scorer/fusion.ts` and `lib/lifecycle/archive-handling.ts`: the denylist wired into both routability seams.
- Root `.gitignore`: ignore `route-exclusions.local.json`.
- `tests/route-exclusions.vitest.ts`: ten unit tests.

**How to roll back**: clear `excludedSkillIds` in the committed config, or revert the loader and both seam edits. The negative control proved that an empty exclusions directory makes both edits exact no-ops.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
