---
title: "Decision Record: sk-design per-skill improvement research"
description: "Binding decisions from the five-mode improvement research: prioritize plumbing over more design theory, and treat the shared-register loading contract as the single highest-leverage family fix. Records context, alternatives, consequences, and the do-not list."
trigger_phrases:
  - "sk-design improvement decisions"
  - "shared register loading contract decision"
  - "design plumbing over theory decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/015-per-skill-improvement-research"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the two binding decisions and the unanimous do-not list"
    next_safe_action: "Research synthesis captured pending commit, plumbing fixes route to future build phases"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-015-per-skill-improvement-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: sk-design per-skill improvement research

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Prioritize plumbing over more design theory

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Deciders** | sk-design family maintainer, five-lineage research synthesis |

---

<!-- ANCHOR:adr-001-context -->
### Context

The five-mode improvement research had to decide what to improve next across the sk-design family. Every lineage independently found that the design knowledge already landed in phases 009 and 012: the shared register, the interface preflight and author-once gates, foundations data-viz and tokens, the motion restraint gate and cards, and the audit evidence and hardening depth are all present. The real defects the lineages surfaced were operational, not conceptual: routers that do not load what their own prose mandates, missing registry aliases, a missing backend manifest, and no checked-in benchmark fixtures.

### Constraints
- The family must not bloat with references it does not need, since size hurts routing precision.
- Improvements must trace to evidence in the five converged lineage deliverables.
- This phase changes no live sk-design content, so the decision sets direction for future build phases.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Prioritize plumbing (router precision, resource-loading correctness, handoff cards, benchmark fixtures) over adding more design theory.

**How it works**: Future build phases act on the operational defects the research named, in leverage order, and leave the landed design content alone unless a specific gap is evidence-backed. New references are the exception, not the default.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Plumbing first** | Fixes the defects that actually degrade every task, keeps the family lean, traces to evidence | Less visible than new content, needs build phases to land | 9/10 |
| Add more design references per mode | Feels like progress, easy to author | Bloats the family, hurts routing precision, ignores the real defects the research found | 3/10 |
| Do nothing and ship the current family | Zero effort | Leaves routers loading the wrong resources and scores unbacked by fixtures | 2/10 |

**Why this one**: The evidence is unanimous across five lineages that content is not the gap. The leverage is in the plumbing, so that is where the next phases should spend.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Future effort targets the defects that degrade correctness and economy on every task.
- The family stays lean, which protects routing precision.

**What it costs**:
- The improvements need build phases to land, so the live family still carries the defects until then. Mitigation: route each fix forward explicitly and patch the one real bug first.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The decision is read as a freeze on all new content | M | Allow evidence-backed reference additions as exceptions, not the default |
| Plumbing fixes are deferred indefinitely | M | Name each fix and route it to a specific future build phase |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Five lineages found operational defects, not content gaps |
| 2 | **Beyond Local Maxima?** | PASS | More-content and do-nothing alternatives were weighed and scored lower |
| 3 | **Sufficient?** | PASS | Prioritizing plumbing addresses the named defects without over-building |
| 4 | **Fits Goal?** | PASS | The family goal is reliable, precise design routing, which plumbing serves directly |
| 5 | **Open Horizons?** | PASS | A lean, well-plumbed family is easier to extend later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Future build phases prioritize router precision, resource loading, handoff cards, and benchmark fixtures.
- New design references require an evidence-backed gap before they are added.

**How to roll back**: This is a direction-setting decision with no live change. To revert, future phases simply resume adding content without the plumbing-first priority. No file revert is needed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Treat the shared-register loading contract as the highest-leverage family fix

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Deciders** | sk-design family maintainer, five-lineage research synthesis |

---

<!-- ANCHOR:adr-002-context -->
### Context

The motion and audit lineages, and partly the interface lineage, found the same defect: each mode's prose says a task starts from the parent `../shared/register.md`, but the router path-guard only allows markdown under the packet root, so it cannot load the parent register. The router therefore under-loads relative to the documented workflow, which degrades correctness silently on every task in those modes. Because the same broken contract appears in more than one mode, fixing it once at the shared layer repairs several modes at the same time.

### Constraints
- The fix must respect the existing packet-local path-guard security posture, not open it broadly.
- It must match the documented contract so the router and the prose agree.
- This phase only decides the priority and shape direction, it does not build the loader.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Rank the shared-register loading contract as the single highest-leverage fix, above any per-mode improvement.

**How it works**: A future build phase makes the parent `../shared/register.md` loadable as a parent-shared pre-load with an explicit allowlist, so motion, audit, and partly interface all start from the register the way their prose mandates. One shared fix lands the correction across modes.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared-layer loader with an explicit allowlist** | Repairs multiple modes at once, keeps the guard tight, matches the documented contract | Needs a careful allowlist design in a build phase | 9/10 |
| Patch each mode's router separately | Localized, simple per change | Duplicated work, drift between modes, more surface to maintain | 4/10 |
| Relax the packet-local guard broadly | Trivial to implement | Weakens the path-guard security posture, out of bounds | 2/10 |

**Why this one**: The defect is shared, so the fix should be shared. An allowlisted parent pre-load corrects all affected modes while keeping the guard tight.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Motion, audit, and partly interface start from the register their prose mandates, restoring correctness on every task.
- One fix replaces several per-mode patches, reducing maintenance surface.

**What it costs**:
- The allowlist needs careful design so it does not become a broad guard bypass. Mitigation: scope the allowlist to the shared register path only.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The allowlist widens into a general guard bypass | H | Restrict the allowlist to the explicit shared-register path and review it in the build phase |
| The loader fix lands but the playbook expected-resources stay stale | M | Update each mode's manual playbook expected resources after the loader is corrected |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The router cannot load the register its prose mandates, degrading correctness |
| 2 | **Beyond Local Maxima?** | PASS | Per-mode patching and a broad guard relaxation were weighed and scored lower |
| 3 | **Sufficient?** | PASS | An allowlisted parent pre-load corrects all affected modes |
| 4 | **Fits Goal?** | PASS | Correct resource loading is core to reliable design routing |
| 5 | **Open Horizons?** | PASS | A clean shared-loading contract makes future shared resources easy to add |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- A future build phase adds a parent-shared pre-load with an explicit allowlist for `../shared/register.md`.
- The affected modes (motion, audit, interface) load the register through the corrected contract, and their playbook expected resources are updated to match.

**How to roll back**: The loader change is additive routing config. To revert, remove the allowlist entry so the router falls back to packet-local loading. No design content changes, so rollback is a config revert.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!--
Do-not list (unanimous across the five lineages): do not bulk-import the external corpus,
do not split modes into finer children, do not add redundant basics, and do not weaken
fidelity or boundaries for UX. These constrain every future build phase that acts on this research.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
