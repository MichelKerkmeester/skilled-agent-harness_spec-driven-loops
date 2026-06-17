# Deep Review Strategy

## Topic
Deep review of spec 150: Open Design terminal control and interface integration. Phase-parent spec with 8 child phases (001-008), all marked complete. Two skills delivered: `mcp-open-design` (v1.2.0) and `sk-interface-design` (v1.3.0). `mcp-magicpath` deprecated.

## Review Dimensions

- [x] **D1 Correctness** — Logic errors, off-by-one, wrong return types, broken invariants (iter 1)
- [ ] **D2 Security** — Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] **D3 Traceability** — Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] **D4 Maintainability** — Patterns, clarity, documentation quality, ease of safe follow-on changes

## Completed Dimensions

- **D1 Correctness** (iteration 1): Reviewed mcp-open-design SKILL.md and references. Found 1 P1 (version stale), 2 P2. spec_code partial.

## Running Findings

| Severity | Active | Delta |
|----------|--------|-------|
| P0 | 0 | — |
| P1 | 1 | +1 (F001) |
| P2 | 2 | +2 (F002, F003) |

## What Worked

- Phase 004 ran a 10-seat deep review with all findings remediated
- Live generation test verified multi-turn flow
- Cross-checking SKILL.md version against changelog caught the stale metadata

## What Failed

- Version bump in phase 008 did not fully propagate to the SKILL.md header

## Exhausted Approaches

(none yet)

## Ruled Out Directions

(none yet)

## Next Focus

**Dimension**: D2 Security
**Rationale**: Second priority dimension. Focus on the gating policy for mutating/destructive verbs, auth guidance, credential handling, and the safety safeguards in both skills.
**Files**: `.opencode/skills/mcp-open-design/SKILL.md` (rules section), `.opencode/skills/mcp-open-design/references/tool_surface.md`, `.opencode/skills/sk-interface-design/SKILL.md`, `.opencode/skills/sk-interface-design/references/`

## Known Context

- Spec 150 is a phase-parent with 8 children, all complete
- Phase 004 ran a prior deep review (10 seats, all P0/P1/P2 remediated)
- Phase 007 corrected generation flow from one-shot to multi-turn
- Phase 008 deprecated mcp-magicpath and re-centered on mcp-open-design
- No `resource-map.md` present at init; skipping resource-map coverage gate
- The skills are markdown-only (no executable code), so security review focuses on guidance correctness, gating policy soundness, and credential/secret handling
- F001 (P1): mcp-open-design SKILL.md version stale at 1.1.0

## Cross-Reference Status

### Core (hard-gated)

| Protocol | Status | Notes |
|----------|--------|-------|
| spec_code | partial | F001: version claim does not match shipped changelog |
| checklist_evidence | pass | Phase 002 checklist all items checked |

### Overlay (advisory)

| Protocol | Status | Gate | Notes |
|----------|--------|------|-------|
| feature_catalog_code | pass | advisory | Feature catalog entries match SKILL.md capabilities |
| playbook_capability | pass | advisory | Playbook scenarios reference correct tools |

## Files Under Review

| File | Status | Notes |
|------|--------|-------|
| `.opencode/skills/mcp-open-design/SKILL.md` | reviewed-iter1 | P1 version stale found |
| `.opencode/skills/sk-interface-design/SKILL.md` | reviewed-iter1 | P2 source URL noted |
| `.opencode/skills/mcp-open-design/references/*.md` | reviewed-iter1 | P2 open uncertainty items |
| `.opencode/skills/sk-interface-design/references/*.md` | not-reviewed | Next: security focus |
| Phase children spec/plan/tasks/checklist | not-reviewed | 8 phases of control docs |

## Review Boundaries

- Max iterations: 10
- Convergence threshold: 0.10
- Stuck threshold: 2
- Severity threshold: P2
- Execution mode: fanout-lineage (cli-opencode, xiaomi/mimo-v2.5-pro)
