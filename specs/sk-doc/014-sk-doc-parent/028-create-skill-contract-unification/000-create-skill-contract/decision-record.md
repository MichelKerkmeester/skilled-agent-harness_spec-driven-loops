---
title: "Decision Record: create-skill contract unification"
description: "Four ADRs: one machine-readable contract as the single source; strict validation opt-in then required; reconcile the three-way description budget (operator fork); and a kind-aware completion gate dispatcher."
trigger_phrases:
  - "028 create-skill contract decisions"
  - "014 sk-doc phase 028 adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification/000-create-skill-contract"
    last_updated_at: "2026-07-13T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored four ADRs incl. one operator fork"
    next_safe_action: "Complete — ADR-003 resolved (≤130); all work units shipped"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Decision Record: create-skill contract unification

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: One machine-readable contract as the single source of truth

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-13 |
| **Deciders** | Planning architect (this packet) |

<!-- ANCHOR:adr-001-context -->
### Context
The audit confirmed the create-skill contract is declared in three drifting places: an embedded `SKILL_TEMPLATE` in `init_skill.py:29-160`, the `assets/skill/` + `assets/parent_skill/` templates, and three validators (`package_skill.py`, `quick_validate.py`, `parent-skill-check.cjs`) that disagree on section order, description budget, and tool rules. Findings 2, 4, and 7 are all instances of this one divergence.

### Constraints
- The contract loader must be dependency-light — both Python (`package_skill.py`) and Node (`parent-skill-check.cjs`) must read it with stdlib only.
- It must lose no existing rule; the schema is the union of what the three validators assert today.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
**Summary**: Author one machine-readable contract (`create-skill/contract.json`) declaring section order, RULES subsections, description budget, `allowed-tools` rule, and supported packet kinds with per-kind required files. Make the templates, `init_skill.py`, `package_skill.py`, and `parent-skill-check.cjs` consume it. No file re-declares a rule; a test asserts the templates match the contract.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One machine-readable contract** | Dissolves the root cause; a future edit cannot drift a copy | Up-front schema-design + consumer wiring | 9/10 |
| Patch each validator/template to match | Smaller diffs | Leaves three sources that re-diverge on the next edit | 3/10 |
| Make the canonical template the source, hand-sync validators | One human-facing source | Validators still parse it heuristically; drift returns | 5/10 |

**Why Chosen**: only a single machine-readable source makes drift structurally impossible and lets a test be the enforcer.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences
**Positive**: section order, budget, and tool rules change in one place; templates and validators stay in lockstep; findings 2/4/7 cannot recur.

**Negative**: an initial schema-design cost and consumer-wiring edits — one-time, and paid down immediately by the fixture that guards it.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| Check | Assessment |
|-------|------------|
| Simplicity | One data file replaces three hand-synced opinions |
| Systems impact | Touches templates + initializer + validators, each mechanically |
| Right problem | Targets the duplication class, not the individual symptoms |
| Sustainability | A test becomes the single enforcer; copies cannot re-appear |
| Scope match | Contained to create-skill + the one checker it dispatches |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation
**Affected Systems**: `create-skill/contract.json` (new), `init_skill.py`, `package_skill.py`, `parent-skill-check.cjs`, `assets/` templates.

**Rollback**: the contract is additive until consumers read it; revert consumer WUs to fall back to their prior in-line rules.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Strict validation mode — opt-in, then required at completion

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-13 |
| **Deciders** | Planning architect (this packet) |

<!-- ANCHOR:adr-002-context -->
### Context
`package_skill.py --check` demotes documented requirements to warnings and exits success (`:185-192` description length + TODO; missing RULES subsections, resource frontmatter, smart-router markers, placeholder examples). So "validation passed" is weaker than "the contract is satisfied" (finding 3). Flipping every warning to an error immediately would red an unknown number of existing skills.

### Constraints
- Existing green trees must not break on day one.
- The completion documentation must eventually mean the contract is proven, not merely warned-about.
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision
**Summary**: Add `--check --strict` that promotes contract-required items to failures, keep warning mode as the default, audit the whole fleet under strict, then make strict the documented completion requirement (with an explicit grandfather allowlist for any deliberately-deferred legacy skill).
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Opt-in strict, then required** | No day-one breakage; a clear path to real enforcement | Two modes to maintain briefly | 9/10 |
| Flip all warnings to errors now | Immediate enforcement | Reds an unknown slice of the fleet; blocks unrelated work | 3/10 |
| Leave warnings as-is | Zero churn | "Passed" stays meaningless; finding 3 unresolved | 2/10 |

**Why Chosen**: opt-in-then-required captures the enforcement value while giving the fleet a bounded migration window.
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences
**Positive**: authors get a mode that proves the contract; the fleet migrates on a known schedule; no surprise breakage.

**Negative**: a transient two-mode period and a grandfather allowlist to keep honest — both retired once the fleet is clean.
<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| Check | Assessment |
|-------|------------|
| Simplicity | One flag over the existing check; no new validator |
| Systems impact | Additive until strict is required; reversible |
| Right problem | Closes the "passes with warnings" gap directly |
| Sustainability | Strict becomes the durable completion bar |
| Scope match | A flag + a fleet audit, not a rewrite |
<!-- /ANCHOR:adr-002-five-checks -->

<!-- ANCHOR:adr-002-impl -->
### Implementation
**Affected Systems**: `package_skill.py` (strict path reads the WU1 contract), completion documentation, an optional grandfather allowlist.

**Rollback**: strict is opt-in; if it over-fires, keep it non-required and widen the allowlist until the fleet is clean.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Reconcile the description budget to one authority (operator fork)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (operator resolved to ≤130 soft; shipped WU1b `0f2c601f9f`) |
| **Date** | 2026-07-13 |
| **Deciders** | Operator (pending) |

<!-- ANCHOR:adr-003-context -->
### Context
Three authorities give three different description budgets: `creation_workflow.md:256` and `common_pitfalls.md:57-67` say ≤130 (soft) with a 1,536 hard cap; `package_skill.py:188-192` recommends 150-300 and warns only outside 50-500; `quick_validate.py` hard-fails at 1,536. A ≤130 description that follows the workflow sits below package_skill's stated recommendation yet triggers no warning (finding 4). The tools do not agree on what "good" is.

### Constraints
- The contract (WU1) must carry ONE budget value.
- Whatever wins, existing descriptions must not be mass-failed overnight.
<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision
**Summary**: Recommended default — adopt the workflow's **≤130-char soft target** plus the retained 1,536 hard cap as the single contract budget, and retire `package_skill.py`'s 150-300 recommendation. Rationale: ≤130 is the memory-enforced, keyword-density-optimized guidance already taught in the workflow and pitfalls docs; 150-300 is an isolated validator opinion with no doc backing. Warn-not-fail on legacy descriptions until re-trimmed. Escalated because it changes an authoring rule authors have followed.
<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **≤130 soft + hard cap (retire 150-300)** | Matches the taught guidance + memory rule; keyword-dense | Some validator-passing descriptions now flagged as over-target | 8/10 |
| Adopt 150-300 (retire ≤130) | Matches the current validator warning band | Contradicts the workflow, pitfalls, and the memory-enforced trim rule | 4/10 |
| Keep a wide 50-500 band only | Least churn | Abandons the density discipline the workflow exists to enforce | 5/10 |

**Why Chosen**: aligning on the doc-and-memory-backed ≤130 target unifies three sources on the one with authority, not the outlier.
<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences
**Positive**: one budget across templates, initializer, and validators; author guidance and validator agree; density discipline preserved.

**Negative**: descriptions in the 130-300 range become over-target warnings — mitigated by warn-not-fail until re-trimmed.
<!-- /ANCHOR:adr-003-consequences -->

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| Check | Assessment |
|-------|------------|
| Simplicity | One budget value replaces three |
| Systems impact | Every description-length check reads the same number |
| Right problem | Resolves the contradiction at its source, not per-tool |
| Sustainability | The taught rule and the validator can no longer disagree |
| Scope match | A single contract value + a legacy grace period |
<!-- /ANCHOR:adr-003-five-checks -->

<!-- ANCHOR:adr-003-impl -->
### Implementation
**Affected Systems**: `create-skill/contract.json` (budget value), `package_skill.py` (drop 150-300), `quick_validate.py` (hard cap aligns), the workflow/pitfalls docs (already ≤130).

**Rollback**: change the single contract value; no code path hardcodes the number once WU1 lands.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Kind-aware completion gate dispatcher

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-13 |
| **Deciders** | Planning architect (this packet) |

<!-- ANCHOR:adr-004-context -->
### Context
The documented completion gate (`create-skill/SKILL.md:25`, SUCCESS CRITERIA) names `package_skill.py <path> --check` for both standalone and parent outputs, but that validates a standalone folder. Parent invariants — one graph identity, registry/router parity, packet boundaries, tool unions, bundle semantics — live in `parent-skill-check.cjs`, which the create-skill flow never invokes (finding 5). A parent hub can pass its documented gate having proved none of its parent contract.

### Constraints
- The standalone flow must not get slower or more complex.
- The kind must be detected, not guessed — from the WU1 contract's packet-kind marker.
<!-- /ANCHOR:adr-004-context -->

<!-- ANCHOR:adr-004-decision -->
### Decision
**Summary**: Add a completion dispatcher that detects packet kind and runs package validation for standalone; package validation + `parent-skill-check.cjs` for parent. Repoint the documented completion command to the dispatcher so the gate always matches the output kind.
<!-- /ANCHOR:adr-004-decision -->

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One kind-aware dispatcher** | The documented gate always proves the right contract | A small dispatch layer to add | 9/10 |
| Document two separate commands | No new code | Relies on the author picking the right one — the current failure mode | 4/10 |
| Fold parent rules into `package_skill.py` | One tool | Duplicates `parent-skill-check.cjs`; two parent-rule sources drift | 3/10 |

**Why Chosen**: a dispatcher keeps one documented command while proving the correct contract per kind, reusing the existing parent checker.
<!-- /ANCHOR:adr-004-alternatives -->

<!-- ANCHOR:adr-004-consequences -->
### Consequences
**Positive**: a parent hub can no longer pass without its invariants; authors run one command; `parent-skill-check.cjs` stays the single parent-rule source.

**Negative**: a thin dispatch layer to maintain — trivial versus the current silent gap.
<!-- /ANCHOR:adr-004-consequences -->

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| Check | Assessment |
|-------|------------|
| Simplicity | Detect kind, call the right checker(s) |
| Systems impact | Reuses both existing validators; adds no rules |
| Right problem | Closes the parent-passes-standalone-gate hole directly |
| Sustainability | The documented gate can never under-check a parent again |
| Scope match | A dispatcher, not a validator rewrite |
<!-- /ANCHOR:adr-004-five-checks -->

<!-- ANCHOR:adr-004-impl -->
### Implementation
**Affected Systems**: a completion dispatcher (new/renamed), `package_skill.py`, `parent-skill-check.cjs`, completion documentation.

**Rollback**: repoint the documented command back to `package_skill.py --check`; the dispatcher is additive.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->
