---
title: "Implementation Plan: Phase 11: mandatory-interface-design-coupling [template:level_1/plan.md]"
description: "Plan to convert mcp-open-design's conditional sk-interface-design coupling into an absolute hard precondition for all design work, across SKILL.md, README, version, and changelog."
trigger_phrases:
  - "open design mandatory coupling plan"
  - "sk-interface-design hard block plan"
  - "phase 011 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/011-mandatory-interface-design-coupling"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase; mapped 8 SKILL.md touch-points + README + changelog"
    next_safe_action: "Edit SKILL.md banner/router/rules, README, changelog; bump version; validate"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/SKILL.md"
      - ".opencode/skills/mcp-open-design/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-011-mandatory-interface-design-coupling"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: mandatory-interface-design-coupling

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs (SKILL.md, README.md), illustrative Python router pseudocode |
| **Framework** | OpenCode skill contract; sk-doc structure validators |
| **Storage** | `.opencode/skills/mcp-open-design/` |
| **Testing** | `validate.sh --strict` on the phase; manual read-through that the hard-block is unmissable |

### Overview
The coupling already exists but is conditional. The change is to harden it into an absolute precondition for design work at every layer of SKILL.md (the banner a reader sees first, the routing the agent follows, the rules it must obey, the success criteria it is held to), keep pure transport exempt, then mirror the mandate in README and record it in a version bump + changelog.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (strict validate)
- [x] Docs updated (SKILL.md, README, changelog, version)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Defense in depth across one document: the same hard rule restated at the banner, the router, the rules, and the success criteria, so no reading path misses it.

### Key Components
- **Top banner** (before §1): the mandate stated first, with the transport-vs-taste framing and the exemption
- **§2 routing**: a phase-detection hard gate (STEP) + a router-pseudocode precondition that blocks a design step without sk-interface-design
- **§3 Run direction**: a mandatory pre-step that shapes the brief and discovery-form answers with sk-interface-design
- **§4 RULES**: ALWAYS #5 rewritten as a hard precondition + a new NEVER forbidding UI output without it
- **§6 success criteria + §7/§8 integration**: a design step is incomplete without sk-interface-design evidence; the partner is mandatory
- **Frontmatter**: version 1.2.0.0 -> 1.3.0.0 + description note

### Data Flow
A request enters the router; if it is a RUN or a design-feeding READ, the hard gate requires sk-interface-design before any design output; pure WIRE/inventory bypasses the gate. The rules and success criteria hold the same line so the constraint is enforced whether the agent reads top-down or jumps to RULES.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: SKILL.md hard-block
- [ ] Add the top MANDATORY banner before §1 (with the WIRE/inventory exemption)
- [ ] §2: add the phase-detection hard gate + mandatory resource rows + router precondition
- [ ] §3 Run direction: add the mandatory sk-interface-design pre-step
- [ ] §4: rewrite ALWAYS #5 as a hard precondition; add the NEVER rule
- [ ] §6 success criteria + §7/§8 integration: mandatory-partner wording
- [ ] Frontmatter: version 1.3.0.0 + description note

### Phase 2: README + changelog
- [ ] README: add the mandate banner; strengthen grounding / related-skills / FAQ wording
- [ ] Create `changelog/v1.3.0.0.md`

### Phase 3: Verify
- [ ] Strict-validate the phase; reconcile parent 150 phase map + `children_ids`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Phase folder validates | `validate.sh --strict` |
| Readability | The hard-block is unmissable and internally consistent | Manual read of SKILL.md banner/router/rules/success-criteria |
| Consistency | SKILL.md and README agree the coupling is mandatory | grep for the mandate phrasing in both |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-interface-design` | Internal | Green | The mandated partner; referenced, not edited |
| sk-doc validators | Tooling | Green | README/feature structure checks |
| `validate.sh` | Tooling | Green | Cannot confirm phase structure |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The hard block proves too broad in practice (e.g. it blocks a legitimate non-design read).
- **Procedure**: Revert the SKILL.md/README edits from git; the change is documentation-only and fully reversible. The exemption clause is the first tuning point if scope needs narrowing.
<!-- /ANCHOR:rollback -->
