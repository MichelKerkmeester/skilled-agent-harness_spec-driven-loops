---
title: "Decision Record: Hook Reference Docs Relocation"
description: "One decision: hook contracts belong beside the behavior they document, so the four docs move to .opencode/hooks and system-skill-advisor/hooks with full consumer repointing."
trigger_phrases:
  - "hook relocation decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/001-hook-docs-relocation"
    last_updated_at: "2026-08-06T07:42:39Z"
    last_updated_by: "pi-terminal-engineer"
    recent_action: "Confirmed the placement matrix and executed all four decisions"
    next_safe_action: "No follow-up required; packet verification is complete"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-05-system-speckit-032"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Relocate hook contracts to the trees that own the behavior

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (placement verified before moving) |
| **Date** | 2026-08-05 |
| **Deciders** | pi-terminal-engineer session, operator direction |

---

<!-- ANCHOR:adr-001-context -->
### Context

The four documents under system-spec-kit/references/hooks describe behavior owned elsewhere. The unified hook tree at .opencode/hooks already exists and its README must reach into system-spec-kit to reference the injection contract. The skill-advisor adapter contracts describe code that lives in system-skill-advisor/hooks. Reference material is two hops away from its owners, and the owning trees cannot ship their own contracts.

### Constraints

- No content rewrite beyond link and path updates.
- No code, plugin, or registration changes.
- All live consumers must be repointed; residue must be provable absent.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Move goal-plugin.md to .opencode/hooks/goal/, injection-contract.md to .opencode/hooks/, and the two advisor hook contracts to system-skill-advisor/hooks/, then repoint every consumer.

**How it works**: git mv preserves rename history; consumers are updated to the new paths; a repo-wide grep proves the old path strings are gone from live content; strict validation closes the packet.

### Verified Placement Matrix

| Document | Behavior documented | Destination ownership evidence | Decision |
|----------|---------------------|--------------------------------|----------|
| `goal-plugin.md` | OpenCode `mk-goal` state, injection, lifecycle, command, and its cross-runtime sibling relationship | `.opencode/hooks/goal/README.md:18-22` defines the goal tree as the cross-runtime sibling of `mk-goal`; `.opencode/hooks/goal/README.md:63-74` inventories its core, adapters, CLI, and OpenCode plugin mirror | Move to `.opencode/hooks/goal/goal-plugin.md` |
| `injection-contract.md` | Cross-runtime hook and plugin injection channels, visibility, lifecycle, and guard behavior | `.opencode/hooks/README.md:22-26` declares `.opencode/hooks/` the unified hook home and already links this contract as the tree-wide injection reference | Move to `.opencode/hooks/injection-contract.md` |
| `skill-advisor-hook.md` | Prompt-time Skill Advisor adapters, bridge behavior, thresholds, lifecycle, and operator states | `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`, `hooks/pi/prompt-advisor.ts`, and `hooks/lib/skill-advisor-cli-fallback.ts` are the maintained adapter and fallback sources; their folder READMEs document that ownership | Move to `.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook.md` |
| `skill-advisor-hook-validation.md` | Validation playbook for the Skill Advisor hook, bridge, shared render contract, diagnostics, and rollback | The playbook validates the same adapter surface hosted by `.opencode/skills/system-skill-advisor/hooks/` and its sibling `mcp-server/`; `hooks/claude/`, `hooks/pi/`, and `hooks/lib/` already hold the tested sources | Move to `.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md` |

The planned destinations are confirmed without amendment. The existing `.opencode/skills/system-skill-advisor/references/hooks/skill-advisor-hook.md` is a separate reference artifact and does not occupy either contracted destination path.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Move to owning trees** | Contracts sit beside behavior; owners ship their own docs | Consumer repoint effort | 9/10 |
| Keep in system-spec-kit | Zero churn | Foreign docs two hops from owners; README cross-tree reach | 3/10 |
| Move all four to .opencode/hooks root | Single doc home | Advisor contracts still separated from adapter code | 5/10 |

**Why this one**: Ownership placement matches the unified hook tree doctrine already documented in .opencode/hooks/README.md.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Hook contracts discoverable from the tree that owns the hook.
- .opencode/hooks/README.md references a sibling doc instead of a foreign skill path.

**What it costs**:
- A one-time consumer repoint across skills, runtimes, and AGENTS.md. Mitigation: grep-enumerated inventory before the move.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missed consumer leaves a stale pointer | M | Exhaustive pre- and post-move grep; SC-002 |
| Leaf manifest drift in system-spec-kit | L | Skill validation after the move |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator directed the relocation; cross-tree reach is real |
| 2 | **Beyond Local Maxima?** | PASS | Single-root option scored and rejected |
| 3 | **Sufficient?** | PASS | Four moves plus consumer repoints is the minimal complete change |
| 4 | **Fits Goal?** | PASS | Directly implements the operator request |
| 5 | **Open Horizons?** | PASS | Future hook docs follow the ownership rule |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Four `R100` git renames into the owner trees
- Relative link rewrites inside all four moved docs
- Repoints across the 34-file live consumer inventory

**How to roll back**: git revert the move and repoint commit; content is unchanged.

**Verification result**: all four renames report `R100`; 34 live consumers were repointed; the live residue count is `0`; moved-document relative links pass; link-aware and standard strict packet validation both pass with zero errors and warnings.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

## ADR-002: Follow-up audit surfaced and fixed pre-existing ghost references

### Context

A fresh flash-model audit after the relocation checked router and routing-config alignment. It found the relocation itself clean but surfaced pre-existing dangling references: an OpenCode hook row in the warm-CLI fallback catalog and a session-priming sentence named adapters that do not exist (`hooks/opencode/session-start.ts`, `hooks/copilot/session-prime.ts`).

### Decision

Delete the ghost catalog row and rephrase the priming sentence to name only adapters verified to exist (`hooks/codex/`, `hooks/cursor/`, `hooks/devin/` session-start adapters). Repoint every live reference to the relocated canonical hook doc and remove the divergent older copy. Scope: live documentation only; historical records exempt.

### Verification

- All live references to the divergent copy repointed; the older copy removed via git rm (reversible).
- Run-verified the corrected disable-flag command against the plugin bridge (route `disabled`, freshness `unavailable`).
- Zero remaining ghost-path references in live trees; grep exit 1 on the feature-catalog sweep.

### Consequences

Live docs now describe only real hook surfaces. The opencode session-start warm path has no adapter today; deletion of the row is the truthful state until a migration packet delivers one.
