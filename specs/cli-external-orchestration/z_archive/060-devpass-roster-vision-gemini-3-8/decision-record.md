---
title: "Decision Record: DevPass roster, vision and Gemini 3.8"
description: "Why the OpenRouter and DevPass rosters were narrowed to the two flash families two days after this packet widened them, and why the earlier acceptance criterion is superseded rather than deleted."
trigger_phrases:
  - "roster narrowing decision"
  - "openrouter devpass two models"
  - "superseded roster criterion"
  - "adr devpass roster"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/060-devpass-roster-vision-gemini-3-8"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "implementation"
    recent_action: "Recorded the roster narrowing"
    next_safe_action: "Commit the packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-060-roster-narrowing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: DevPass roster, vision and Gemini 3.8

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Narrow OpenRouter and DevPass to the two flash families

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-06 |
| **Deciders** | Operator instruction on 2026-09-06, implemented in this session |

---

<!-- ANCHOR:adr-001-context -->
### Context

This packet onboarded DevPass with four models and carried a third model through OpenRouter on
both CLIs. Two days later the operator read the DevPass usage log and found two of those models
in use, and directed that only DeepSeek V4 Flash, with or without the vision variant, and
GLM-5.3-Flash may route through OpenRouter and DevPass on either CLI. The picker entries had
already been removed by hand, but the rosters the skills dispatch from, the pi provider block, the
executor allowlist and the fan-out provider map still carried them.

### Constraints

- The closed-roster rule in both skills already forbids off-roster ids. What it lacked was a
  provider-scoped statement, so a model allowed on one route read as allowed on the gateway too.
- Luna through the codex provider is a different route and is not part of the instruction.
- AC-017 of this packet asserted the OpenRouter Gemini entry in the pi picker. That was true when
  observed and is no longer the roster.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: to remove the two models from every DevPass surface and the third model from every
OpenRouter surface, on both CLIs, in the pi provider block, in the executor allowlist and its CJS
mirror, and in the tests, and to add one provider-scoped sentence to both closed-roster rules.

**How it works**: each roster now says that a provider's live catalog is not a roster and that a
model allowed on one route is not thereby allowed on another. AC-017 is superseded by AC-019
rather than edited, because it recorded a true observation on its date.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Narrow every surface, supersede the old criterion** | The roster and the enforcement agree, history stays true | Touches nine files | 9/10 |
| Remove only the picker entries | Already done by the operator | The skills and the executor keep dispatching the models | 1/10 |
| Delete AC-017 | Cleaner table | Erases an observation that was true when made | 3/10 |

**Why this one**: the only option where what the skills say, what the code enforces and what the
packet records all agree.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- No dispatch through OpenRouter or DevPass can name a model outside the two flash families.
- Both rosters state the per-provider rule that was previously implied.

**What it costs**:
- Two DevPass models the packet had dispatch-tested are no longer reachable. Mitigation: the
  operator chose this, and the models remain reachable on their own providers where listed.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later packet re-adds a model to one surface only | M | The executor test pins the exact list, and the roster parity is one grep |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Off-roster models observed in the DevPass usage log |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | List removals and one sentence per roster, no new machinery |
| 4 | **Fits Goal?** | PASS | The packet's own principle, every model fact matches what is allowed |
| 5 | **Open Horizons?** | PASS | Re-adding a model follows the same amend-the-roster-first rule |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: both `providers-and-models.md` rosters, the cli-pi allowlist playbook scenario,
`.pi/models.json`, `.pi/custom-providers.md`, `executor-config.ts`, `fanout-run.cjs` and the two
unit test files that pin the pi roster.

**How to roll back**: `git checkout` those files, then re-run the two unit test files.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
