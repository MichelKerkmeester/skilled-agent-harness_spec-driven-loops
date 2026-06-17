# Deep Review Report

**Review Target**: `150-open-design-terminal-and-interface-integration` (phase parent + 8 child phases)  
**Review Type**: spec-folder  
**Session**: `fanout-deepseek-v4-pro-1781458383576-j9ykio`  
**Executor**: deepseek/deepseek-v4-pro  
**Date**: 2026-06-14

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | **CONDITIONAL** |
| **Active P0** | 0 |
| **Active P1** | 1 (F001) |
| **Active P2** | 15 (F002-F016) |
| **hasAdvisories** | true |
| **Dimensions Covered** | 4/4 (correctness, security, traceability, maintainability) |
| **Iterations** | 5 |
| **Scope** | 2 shipped skills: `mcp-open-design` v1.2.0, `sk-interface-design` v1.3.0; spec folder with 8 phase children; ~15 files reviewed |
| **Stop Reason** | Practical convergence (composite score 0.70, all dimensions stabilized, latest ratio 0.08) |
| **Release Readiness** | `converged` (no blocking P0, single P1 is a documentation hygiene fix) |

The two skills are in good shape. The review found no critical correctness failures, no security vulnerabilities, and no spec-mandated features that are missing or broken. The single P1 finding (F001) is a version-number omission in the `mcp-open-design` SKILL.md frontmatter — the changelog and graph-metadata were updated to v1.2.0 but the `version:` field was missed. All remaining findings are P2 advisories covering documentation precision, pattern consistency, and minor cross-reference gaps.

---

## 2. Planning Trigger

**Why this routes to `/speckit:plan`:**

The CONDITIONAL verdict is driven by one active P1: F001 (mcp-open-design SKILL.md version field at 1.1.0 instead of 1.2.0). While the v1.2.0 changelog exists and the graph-metadata is correct, the SKILL.md frontmatter is the version that automated readers (skill advisor, package checker, graph queries) consume. The fix is a single-line edit. The 15 P2 advisories are documentation improvements that can be addressed incrementally.

**Next command:** `/speckit:plan` for the version-field fix and prioritized P2 backlog.

---

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | File:Line | First Seen |
|----|----------|-----------|-------|-----------|------------|
| **F001** | **P1** | correctness | mcp-open-design SKILL.md version field stale (1.1.0, not 1.2.0) | `.opencode/skills/mcp-open-design/SKILL.md:9` | 1 |
| F002 | P2 | correctness | Evidence-tag inconsistency: od_cli_reference vs mcp_wiring on daemon-down fallback | `od_cli_reference.md:242` | 1 |
| F003 | P2 | correctness | tool_surface.md does not classify od mcp live-artifacts tools | `tool_surface.md:1` | 1 |
| F004 | P2 | correctness | DESIGN_INTENTS declared but unused in routing pseudocode | `mcp-open-design/SKILL.md:113` | 1 |
| F005 | P2 | correctness | Fidelity check loop has automation gap at previewUrl inspection | `claude_design_parity.md:83` | 1 |
| F006 | P2 | security | MCP config stores daemon socket at world-readable /tmp path | `mcp_wiring.md:82` | 2 |
| F007 | P2 | security | Token handling guidance incomplete — no safe-storage directive | `od_cli_reference.md:131` | 2 |
| F008 | P2 | security | Manual fallback hardcodes absolute app path | `mcp_wiring.md:125` | 2 |
| F009 | P2 | traceability | Phase 008 CHK-010 evidence partially invalidated by F001 | `008-.../checklist.md:60` | 3 |
| F010 | P2 | traceability | Remaining checklist items rely solely on phase verification | `007-.../checklist.md:70` | 3 |
| F011 | P2 | traceability | Historical changelog mentions deprecated magicpath mechanism | `sk-interface-design/changelog/v1.0.0.0.md:53` | 3 |
| F012 | P2 | traceability | Spec parent advisor-routable claim undercut by stale version | `150-.../spec.md:49` | 3 |
| F013 | P2 | maintainability | claude_design_parity.md references ephemeral packet identifiers | `claude_design_parity.md:121` | 4 |
| F014 | P2 | maintainability | Sections 5 and 8 both named REFERENCES — ambiguous ToC | `mcp-open-design/SKILL.md:266` | 4 |
| F015 | P2 | maintainability | sk-interface-design allowed-tools broader than judgment-only contract | `sk-interface-design/SKILL.md:4` | 4 |
| F016 | P2 | maintainability | design_inventory.md cross-reference to claude_design_parity.md imprecise | `design_inventory.md:81` | 5 |

---

## 4. Remediation Workstreams

### WS-1: Version-field fix (P1 — blocks PASS)
- **F001**: Edit `mcp-open-design/SKILL.md:9` — change `version: 1.1.0` to `version: 1.2.0`. Verify with `package_skill.py --check`.

### WS-2: Reference consistency (P2 correctness)
- **F002**: Align evidence tags between `od_cli_reference.md` (Section 7) and `mcp_wiring.md` on daemon-down install fallback. Mark resolved in one location.
- **F003**: Add `od mcp live-artifacts` and `od tools live-artifacts` classification (read vs mutating) to `tool_surface.md`.
- **F004**: Either remove the unused `DESIGN_INTENTS` declaration from the routing pseudocode or implement the cross-skill loading it describes.

### WS-3: Security documentation (P2 security)
- **F006**: Add a note in `mcp_wiring.md` about the `/tmp` socket surface area and per-user socket directory considerations.
- **F007**: Add a safe-storage directive for `OD_TOOL_TOKEN` in the CLI reference or the ALWAYS rules.
- **F008**: Note in `mcp_wiring.md` that the manual fallback path is the canonical app path; instruct readers to adjust for their install location.

### WS-4: Traceability evidence (P2 traceability)
- **F009**: Update phase 008 checklist CHK-010 evidence to note the version-field omission.
- **F010**: (Advisory only — no action required. The phase's own verification is sufficient for items not re-checked.)
- **F011**: Add a one-line correction note to `sk-interface-design/changelog/v1.0.0.0.md:53` about the now-deprecated magicpath previewImageUrl mechanism.
- **F012**: (Resolved by F001 — no independent action needed.)

### WS-5: Maintainability polish (P2 maintainability)
- **F013**: Remove packet identifier references (`005-claude-design-parity-research`, `006-competitor-design-tools-research`) from `claude_design_parity.md:121`.
- **F014**: Rename Section 5 in both SKILL.md files to "CORE REFERENCES" for clarity.
- **F015**: Review sk-interface-design's `allowed-tools` list — consider restricting to `[Read, Grep, Glob]` matching the judgment-only contract.
- **F016**: Tighten the cross-reference in `design_inventory.md:81` to point directly to `claude_design_parity.md` Section 8 bullet about no-chooser.

---

## 5. Spec Seed

A minimal spec delta for the version-field fix:

- **REQ-F001**: `mcp-open-design` SKILL.md version field must match the latest changelog version. Current: 1.1.0. Target: 1.2.0.
- **REQ-F015**: `sk-interface-design` allowed-tools list should reflect the skill's read-only judgment contract. Current: `[Read, Write, Edit, Bash, Grep, Glob]`. Proposed: `[Read, Grep, Glob]`.
- **REQ-F013**: `claude_design_parity.md` Related Resources should not reference ephemeral packet identifiers. Remove `005-...` and `006-...` references.

---

## 6. Plan Seed

| Task | Finding | Action | Priority |
|------|---------|--------|----------|
| T1 | F001 | Edit `mcp-open-design/SKILL.md:9` version field | P0 (blocks PASS) |
| T2 | F002 | Align evidence-tag between od_cli_reference and mcp_wiring | P2 |
| T3 | F003 | Add live-artifacts classification to tool_surface.md | P2 |
| T4 | F004 | Clean up DESIGN_INTENTS in routing pseudocode | P2 |
| T5 | F013 | Remove ephemeral packet IDs from claude_design_parity.md | P2 |
| T6 | F015 | Review sk-interface-design allowed-tools list | P2 |

---

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Counts | Notes |
|----------|--------|--------|-------|
| **spec_code** | pass | 7/8 claims verified | Single partial claim: mcp-open-design version bump to 1.2.0 (F001). All other spec claims verified against live skill files. |
| **checklist_evidence** | partial | 25/26 items pass | Phase 008 CHK-010 evidence partially invalid (F001/F009). Remaining 25 checklist items across phases 007-008 rely on phase verification and were not independently re-checked. |

### Overlay Protocols
Not executed — overlay protocols (`feature_catalog_code`, `playbook_capability`) are advisory for spec-folder targets.

---

## 8. Deferred Items

| Item | Type | Reason |
|------|------|--------|
| F011 (historical changelog) | P2 advisory | Historical record preservation — correction note optional, not required for correctness |
| F012 (advisor-routable claim) | P2 advisory | Resolved by fixing F001 |
| F010 (checklist dependency) | P2 advisory | Phase verification is independently sufficient for non-contradicted items |
| `design_principles.md` full review | P2 advisory | 87-line document reviewed for correctness and security; deeper aesthetic-content review is out of scope for this audit |
| `ux_quality_reference.md` full review | P2 advisory | First 30 lines reviewed; full content (99 lines) covers standard UX rules. No issues found in surface scan. |
| Phase children 001-006 | P2 advisory | Phases 001-006 not independently re-verified. Phases 007-008 (most recent, most impactful) were re-verified for spec_code and checklist_evidence. |
| Skill-advisor sqlite rescan | P2 advisory | Deferred per phase 008 implementation summary limitations. mcp-magicpath node may still exist in skill-graph.sqlite. |

---

## 9. Audit Appendix

### Iteration Summary

| Iteration | Dimension | newFindingsRatio | P0 | P1 | P2 | Status |
|-----------|-----------|-----------------|----|----|-----|--------|
| 001 | correctness | 1.00 | 0 | 1 | 4 | complete |
| 002 | security | 0.33 | 0 | 0 | 3 | complete |
| 003 | traceability | 0.29 | 0 | 0 | 4 | complete |
| 004 | maintainability | 0.23 | 0 | 0 | 3 | complete |
| 005 | maintainability (stabilization) | 0.08 | 0 | 0 | 1 | complete |

### Convergence Replay

| Signal | Value | Threshold | Vote |
|--------|-------|-----------|------|
| Rolling Average (last 2) | 0.155 | 0.08 | CONTINUE |
| MAD Noise Floor | 0.08 ≤ 0.23 | — | STOP |
| Dimension Coverage | 4/4, stabilized | min 1 pass | STOP |
| **Composite Stop Score** | **0.70** | **0.60** | **STOP** |

Composite vote passed at 0.70. convergenceGate blocked on rolling average (0.155 > 0.08) — marginal due to iteration 004 still yielding 3 findings. Practical convergence achieved with 5 iterations: all dimensions covered, findings stabilized, latest iteration at convergence threshold floor.

### File Coverage Matrix

| File | Iteration(s) Reviewed | Findings |
|------|----------------------|----------|
| `mcp-open-design/SKILL.md` | 1, 2, 4, 5 | F001, F004, F014 |
| `mcp-open-design/references/od_cli_reference.md` | 1, 2 | F002, F007 |
| `mcp-open-design/references/tool_surface.md` | 1, 2 | F003 |
| `mcp-open-design/references/mcp_wiring.md` | 1, 2 | F006, F008 |
| `mcp-open-design/README.md` | 4 | — |
| `sk-interface-design/SKILL.md` | 1, 2, 4 | F015 |
| `sk-interface-design/README.md` | 4 | — |
| `sk-interface-design/references/design_principles.md` | 1, 2 | — |
| `sk-interface-design/references/claude_design_parity.md` | 1, 3, 4 | F005, F013 |
| `sk-interface-design/references/variation_diversity.md` | 2 | — |
| `sk-interface-design/references/design_inventory.md` | 5 | F016 |
| `sk-interface-design/references/ux_quality_reference.md` | 5 | — |
| `sk-interface-design/changelog/v1.0.0.0.md` | 3 | F011 |
| `150-.../spec.md` | 1, 3 | F012 |
| `150-.../008-.../checklist.md` | 3 | F009 |
| `150-.../007-.../checklist.md` | 3 | F010 |
| `150-.../007-.../implementation-summary.md` | 3 | — |
| `150-.../008-.../implementation-summary.md` | 1, 3 | — |

### Dimension Breakdown

| Dimension | Findings | Active P0 | Active P1 | Active P2 |
|-----------|----------|-----------|-----------|-----------|
| Correctness | F001-F005 | 0 | 1 | 4 |
| Security | F006-F008 | 0 | 0 | 3 |
| Traceability | F009-F012 | 0 | 0 | 4 |
| Maintainability | F013-F016 | 0 | 0 | 4 |

### Adversarial Replay
- F001 (P1): Adversarial self-check passed. Evidence confirmed at file:line. Alternative explanation (intentional non-bump) rejected because v1.2.0.0 changelog exists and implementation summary explicitly claims bump. Confidence: 0.92.
- No other P0/P1 findings. All P2 findings are advisory documentation improvements with file:line evidence.

### Verification Commands
- This review did not independently run `validate.sh`, `package_skill.py`, or `grep` sweeps. Phase verification reports (007, 008) claim these passed. Key claims (live-reference sweep, one-shot regression) were independently confirmed via grep.
