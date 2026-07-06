---
title: "Decision Record: Phase 002 — Parent Hub Compatibility Shell"
description: "Accepted decisions for the sk-design parent hub compatibility shell."
trigger_phrases:
  - "decision record"
  - "parent hub compatibility shell"
  - "sk-design manager shell"
importance_tier: "high"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-design/009-sk-design-claude-parity/002-parent-hub-compatibility-shell/"
    last_updated_at: "2026-07-05T22:14:30Z"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Recorded accepted shell decisions."
    next_safe_action: "Start Phase 003 procedure cards."
---
# Decision Record: Phase 002 — Parent Hub Compatibility Shell

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Put Manager Choreography in the Parent Hub Shell

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-05 |
| **Deciders** | Repository owner authority delegated to this session |

---

<!-- ANCHOR:adr-001-context -->
### Context

The `sk-design` parent hub already owns the single advisor-routable identity and registry-backed mode delegation. The refactor needed Claude-like manager behavior without turning the hub into a sixth design mode, duplicating mode logic, or changing the registry.

### Constraints

- Keep one public `sk-design` advisor identity.
- Keep `mode-registry.json` and `hub-router.json` unchanged for this phase.
- Keep detailed design logic and evidence contracts in the existing mode packets.
- Keep interface, foundations, motion, and audit read-only: Read/Glob/Grep only.
- Keep `md-generator` as the only mutating mode.

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: implement manager choreography in `.opencode/skills/sk-design/SKILL.md` only.

**How it works**: The hub gathers context, shows the plan, names proof expectations, and applies verifier cadence before route handoff or ready claims. The selected mode still owns detailed design judgment and evidence; the hub stays routing and orchestration prose.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Parent hub shell | Preserves identity and registry; adds manager feel at the correct boundary | Requires concise hub wording to avoid mode logic creep | 9/10 |
| New public design micro-skills | Mirrors Claude skill names more literally | Breaks single-advisor identity and public-mode constraint | 2/10 |
| Put manager behavior in each mode packet | Keeps hub thinner | Duplicates intake/proof cadence and risks inconsistent mode behavior | 4/10 |
| Change `mode-registry.json` | Could encode more routing behavior | Out of scope and unnecessary for this phase | 3/10 |

**Why this one**: The parent hub already owns route choreography, so it is the smallest change that adds manager behavior without changing public routing or mutating read-only mode contracts.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The hub now requires context-first intake and a visible plan before substantial design, build, or transport work.
- Ready claims now require proof review, and transport output cannot substitute for design acceptance.

**What it costs**:
- The hub has more orchestration prose. Mitigation: keep per-mode design procedures in mode packets and prohibit hub-local verifier logic.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hub starts accumulating mode-specific design instructions | Medium | `SKILL.md` ALWAYS/NEVER rules keep mode details in packets |
| Transport output is treated as acceptance | Medium | Section 7 says transport output is evidence to inspect, not acceptance |
| Read-only modes are asked to write evidence | High | Section 2 and section 4 state read-only modes use Read/Glob/Grep only |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Phase 002 required manager-style hub behavior before later private procedure cards |
| 2 | Beyond Local Maxima? | PASS | Compared hub shell, public micro-skills, per-mode duplication, and registry changes |
| 3 | Sufficient? | PASS | One `SKILL.md` hub patch adds required behavior without registry changes |
| 4 | Fits Goal? | PASS | Directly addresses intake, visible plan, proof gates, cadence, and transport boundary |
| 5 | Open Horizons? | PASS | Leaves Phase 003 procedure cards and Phase 004 mode-packet work unblocked |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/skills/sk-design/SKILL.md` defines manager intake, visible plan, proof gates, missing-proof blocking, verifier cadence, and transport evidence boundaries.
- Phase 002 docs record the actual evidence, task completion, and validation path.

**How to roll back**: Inspect `git diff` and `git status` first. If rollback is approved, remove only the Phase 002 `SKILL.md` hub-shell wording and Phase 002 documentation changes while preserving unrelated sibling-phase and parent metadata dirt.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
