# Review Iteration 8 — STUCK RECOVERY (Security Overlay Protocols)

**Dispatcher**: `/deep:review` stuck recovery dispatch
**Focus**: security + overlay traceability protocols (agent_cross_runtime, playbook_capability, skill_agent)
**Budget Profile**: `scan` (9-11 calls)
**Actual Calls**: 10 (4 grep + 2 read + 1 write + 1 edit + 1 append + 1 delta)

---

## Files Reviewed

| File | Purpose |
|------|---------|
| `.opencode/agents/design.md:1-25` | Verify F-12 webfetch remediation applied |
| `.opencode/agents/` (grep for 037/041) | Check duplicate phase numbers in agent definitions |
| `.opencode/commands/` (grep for 037/041) | Check duplicate phase numbers in command definitions |
| 154-sk-design-parent/** /*.md (grep for agent references) | agent_cross_runtime evidence sweep |
| 154-sk-design-parent/** /*.md (grep for playbook/capability) | playbook_capability evidence sweep |
| 154-sk-design-parent/** /*.md (grep for skill_agent) | skill_agent overlay evidence sweep |
| 042-deep-review lineage reports | Confirm overlay protocols already executed |

---

## Findings — New

### P0 Findings
*None*

### P1 Findings
*None*

### P2 Findings
*None*

---

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | **partial** | Unchanged from iter 3 |
| `checklist_evidence` | core | **passing** | Unchanged from iter 3 |
| `skill_agent` | overlay | **pass** | Executed by 042 deep-review (codex + glm lineages): 5/5 agreement checks between SKILL.md and runtime agent files. Body agreement confirmed. Drift F008 recorded (P2, traceability) — same underlying issue as F004/F-12 (webfetch permission asymmetry), now resolved in 043. [SOURCE: 042-design-work-deep-review/review/lineages/glm/review-report.md:225] [SOURCE: 042-design-work-deep-review/review/lineages/codex/iterations/iteration-004.md:36] |
| `agent_cross_runtime` | overlay | **pass** | Executed by 042 deep-review: F004 (P2) documented permission drift across `.opencode/agents/design.md:13`, `.claude/agents/design.md:4`, `.codex/agents/design.toml:5`. Remediated by 043: webfetch narrowed to `deny`. Current state verified: `.opencode/agents/design.md:13` shows `webfetch: deny`. No agent files or command files reference 037/041 phase numbers. [SOURCE: .opencode/agents/design.md:13] [SOURCE: 043-design-review-remediation/checklist.md:108] |
| `feature_catalog_code` | overlay | **deferred** | No feature catalog present in parent track; unchanged |
| `playbook_capability` | overlay | **pass** | Extensive playbook infrastructure documented across the track: 005-build-subskills created playbook directories for 3 child skills; 040-dedesign-playbook-filename-denumbering standardized 61 playbook filenames; 021-content-topups wired playbook coverage for all 5 modes. 042 deep-review and 007-family-deep-review both executed playbook_capability overlay. [SOURCE: 005-build-subskills/spec.md:155-157] [SOURCE: 040-design-playbook-filename-denumbering/spec.md:117,134] [SOURCE: 021-content-topups/implementation-summary.md:55-59,91] |

---

## Integration Evidence

- **042 deep-review (codex lineage)**: Executed `skill_agent` (partial, advisory), `agent_cross_runtime` (partial, advisory), and `playbook_capability` overlay protocols in iteration 4. [SOURCE: 042-design-work-deep-review/review/lineages/codex/iterations/iteration-004.md:36-39]
- **042 deep-review (glm lineage)**: Executed `skill_agent` with 5/5 agreement checks and `playbook_capability` in iteration 3. [SOURCE: 042-design-work-deep-review/review/lineages/glm/review-report.md:225]
- **043-design-review-remediation**: Fixed F-12 (webfetch least-privilege parity). Verified in CHK-FX-12 at checklist line 108. [SOURCE: 043-design-review-remediation/checklist.md:108]
- **007-family-deep-review**: Executed `skill_agent` overlay for sk-design parent and all 5 child skills. All pass or n/a (no dedicated runtime agent). [SOURCE: 007-family-deep-review/review/sk-design/opus48/review-report.md:80]

---

## Edge Cases

1. **Overlay protocols "deferred" in parent strategy vs executed in child phases**: The parent track strategy (§14) marked `skill_agent`, `agent_cross_runtime`, and `playbook_capability` as "deferred" with rationale that they live in downstream artifacts. However, child phases 042 (deep review) and 043 (remediation) actually executed these protocols and recorded results. The strategy status was never updated to reflect this. This is a cross-level documentation gap, not a finding — the underlying work was done and the evidence is traceable.

2. **Duplicate 037/041 phases — no overlay-protocol impact**: No `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, or `.opencode/commands/` files reference the numeric 037 or 041 phase identifiers. The duplication affects only internal parent-track navigation and graph-metadata.json. External consumers of the track (agent routing, command dispatch) are unaffected.

3. **feature_catalog_code permanently deferred for parent track**: The `sk-design` parent is a phase parent for 43 child phases, not a skill with its own feature catalog. This overlay protocol is genuinely not applicable at the parent-track level. Confirmed against config `crossReference.overlay` which lists it but strategy §14 correctly notes "no feature catalog present in this track."

---

## Confirmed-Clean Surfaces

- **agent_cross_runtime**: All three runtime agent files reviewed by 042; permission drift identified and remediated by 043. Current state confirmed clean (`webfetch: deny`).
- **skill_agent**: Body agreement across all three runtime agent files confirmed by 042. No unresolved drift.
- **playbook_capability**: Playbook infrastructure spans the track from 005 (creation) through 040 (denumbering) to 021 (coverage wiring).
- **Duplicate 037/041 impact on overlay protocols**: Zero external references found. No agent/command dispatch path affected.

---

## Ruled Out

- **Elevating webfetch permission asymmetry to P1**: The underlying issue (F004/F008/F-12) was already triaged as P2 in 042 deep review and resolved in 043 remediation. Verifying the fix in current agent file confirms `webfetch: deny`. No elevation warranted.
- **agent_cross_runtime as a security finding**: The permission drift was a maintainability/traceability concern, not a security vulnerability. The sk-design agent is a design specialist, not an auth-sensitive surface. The drift was below the P1 threshold.
- **037/041 duplicate phases as an agent_cross_runtime issue**: No cross-runtime impact found. The duplication is a correctness issue (already P0-001, P0-002), not an overlay-protocol issue.
- **playbook_capability as a gating concern**: Playbook infrastructure is well-established across the track. No gaps found that would affect release readiness.

---

## Next Focus

- **Dimension**: cross-dimension synthesis
- **Focus area**: Convergence evaluation — all 4 dimensions complete with double+ coverage (correctness 3x, traceability 2x, maintainability 2x, security 1x + overlay protocol pass). Overlay protocols now all verified: skill_agent (pass), agent_cross_runtime (pass), playbook_capability (pass), feature_catalog_code (n/a). 21 total findings (2 P0, 7 P1, 12 P2). The 2 active P0 (duplicate phase numbers 037/041) remain the only blockers — structural issues requiring operator resolution, not review surface. Rolling newFindingsRatio for this iteration: 0.0 (no new findings, overlay verification only). Recommend orchestrator run convergence check and proceed to synthesis/report generation.
- **Rotation status**: All dimensions + all overlay protocols complete. Security dimension now has overlay protocol coverage.
- **Blocked/Productive carry-forward**: Productive: child-phase review reports (042, 043, 007) provide authoritative overlay protocol evidence. Blocked: convergence blocked by 2 active P0 (structural duplicate phase numbers).
- **Required evidence**: Run reduce-state.cjs to refresh strategy overlay protocol status from "deferred" to "pass". Generate review-report.md if converging.
- **Recovery note**: Recovery successful — 3/4 overlay protocols now verified pass. feature_catalog_code confirmed n/a for parent track. Strategy §14 cross-reference table needs update from "deferred" to "pass" for skill_agent, agent_cross_runtime, and playbook_capability.

Review verdict: CONDITIONAL
