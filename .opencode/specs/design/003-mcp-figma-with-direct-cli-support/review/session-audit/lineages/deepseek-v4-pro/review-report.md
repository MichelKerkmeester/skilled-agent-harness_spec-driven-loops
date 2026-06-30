# Deep Review Report: mcp-figma skill package

**Target**: `design/003-mcp-figma-with-direct-cli-support`
**Session**: `fanout-deepseek-v4-pro-1781459141456-y67ab1`
**Lineage**: generation 1, new session
**Verdict**: **PASS** (hasAdvisories: true)
**Date**: 2026-06-14

---

## 1. Executive Summary

The `mcp-figma` skill package and its supporting phase-parent spec pass review with no blocking (P0) or conditional (P1) findings. The skill teaches a coding agent to drive Figma Desktop from the terminal through the silships `figma-ds-cli`, with an optional Figma MCP via Code Mode. All 6 normative requirements (REQ-001 through REQ-006) in the phase-002 build spec resolve to shipped artifacts with file:line evidence. All 26 checklist items are verified. All 5 cross-reference protocols (2 core, 3 overlay) pass.

| Metric | Value |
|--------|-------|
| Iterations | 6 (4 dimension passes + 2 refinement/stabilization passes) |
| Dimensions | 4/4 (correctness, security, traceability, maintainability) |
| Active P0 | 0 |
| Active P1 | 0 |
| Active P2 | 9 (advisories) |
| Core protocols | spec_code (pass), checklist_evidence (pass) |
| Overlay protocols | feature_catalog_code (pass), playbook_capability (pass), skill_agent (pass) |
| Convergence reason | converged (composite score 1.00, rolling average 0.00) |
| Release readiness | converged |

---

## 2. Planning Trigger

Verdict is **PASS** — routes to `/create:changelog` for a clean-audit record. The 9 P2 advisories (below) are documented for optional follow-up but do not block release.

---

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | File | First Seen | Status |
|----|----------|-----------|-------|------|------------|--------|
| F001 | P2 | correctness | `connect-safe.sh` stdin read without EOF guard may fail in non-interactive contexts | `.opencode/skills/mcp-figma/scripts/connect-safe.sh:20` | 1 | active |
| F002 | P2 | correctness | `daemon.sh` inconsistent help output to stdout vs stderr on unknown verb | `.opencode/skills/mcp-figma/scripts/daemon.sh:13-14` | 1 | active |
| F003 | P2 | security | Daemon token file path exposed as shared constant in `_common.sh` | `.opencode/skills/mcp-figma/scripts/_common.sh:48` | 2 | active |
| F004 | P2 | security | MCP Desktop-dependency claim tagged INFERRED, not CONFIRMED | `.opencode/skills/mcp-figma/references/mcp_wiring.md:146` | 2 | active |
| F005 | P2 | security | Arbitrary-code gating (eval/raw/run) relies on contract discipline without programmatic consent check | `.opencode/skills/mcp-figma/references/tool_surface.md:52` | 2 | active |
| F006 | P2 | traceability | Checklist live-verification claims (CHK-010, CHK-023) lack inline evidence artifacts | `.opencode/specs/.../002-skill-build-and-registration/checklist.md:58,73` | 3 | active |
| F007 | P2 | traceability | Phase-parent spec uses zero-fingerprint session_dedup placeholder | `.opencode/specs/.../146-mcp-figma-with-direct-cli-support/spec.md:20` | 3 | active |
| F008 | P2 | maintainability | `graph-metadata.json` redundant entity listing duplicates key_files array | `.opencode/skills/mcp-figma/graph-metadata.json:101-108` | 4 | active |
| F009 | P2 | maintainability | `tool_surface.md` upstream drift warning lacks version-pin commit hash | `.opencode/skills/mcp-figma/references/tool_surface.md:16` | 4 | active |

All 9 findings confirmed at P2 severity via adversarial self-check in iteration 5. No findings disproved or downgraded.

---

## 4. Remediation Workstreams

Since all findings are P2 (advisory), remediation is optional and can be addressed incrementally:

### Lane 1: Script Quality (F001, F002)
- F001: Add stdin guard (`test -t 0 || exit 0`) to `connect-safe.sh:20`
- F002: Unify help output to stdout in `daemon.sh:13-14`
- Execution order: parallel, low risk

### Lane 2: Documentation & Metadata (F004, F006, F007, F008, F009)
- F004: Promote MCP claim to CONFIRMED after live verification
- F006: Add evidence artifact links to checklist items CHK-010, CHK-023
- F007: Consider replacing zero-fingerprint with computed content hash
- F008: Consider deduplicating entities from key_files in graph-metadata.json
- F009: Add upstream commit hash to tool_surface.md version-pin comment
- Execution order: low-risk parallel

### Lane 3: Defense-in-Depth (F003, F005)
- F003: Document token-path protection expectations in _common.sh comments
- F005: Consider a `--dry-run` preview wrapper for eval/raw/run
- Execution order: design discussion first

---

## 5. Spec Seed

No spec changes required. The phase-parent spec and both child phase specs are consistent with the shipped skill. All normative claims resolve. The skill's feature catalog and playbook cover the full surface.

Minimal documentation improvements (optional):
- Add CONFIRMED tag to `mcp_wiring.md:146` after live verification (F004)
- Add version-pin comment to `tool_surface.md:16` (F009)

---

## 6. Plan Seed

Remediation tasks from P2 findings:

1. **[T1] Script hygiene** — Add stdin guard to `connect-safe.sh`; unify daemon.sh help output. ~5 minutes.
2. **[T2] Evidence traceability** — Link checklist items CHK-010/CHK-023 to implementation-summary.md evidence. ~10 minutes.
3. **[T3] Metadata dedup** — Review graph-metadata.json entities vs key_files redundancy. ~10 minutes.
4. **[T4] Version pinning** — Add upstream commit hash to tool_surface.md. ~5 minutes.

---

## 7. Traceability Status

| Protocol | Level | Gate | Status | Evidence |
|----------|-------|------|--------|----------|
| `spec_code` | core | hard | **pass** (11/11 claims) | REQ-001→install.sh, REQ-002→tool_surface.md, REQ-003→connect-safe.sh+connect-yolo.sh+unpatch.sh, REQ-004→mcp_wiring.md, REQ-005→sibling structure verification, REQ-006→graph-metadata.json, R1-R5→research/research.md |
| `checklist_evidence` | core | hard | **pass** (26/26 items) | phase-002 checklist all [x] with evidence tags |
| `feature_catalog_code` | overlay | advisory | **pass** (8/8 areas) | feature_catalog.md + 7 sub-files match shipped scope |
| `playbook_capability` | overlay | advisory | **pass** (8/8 scenarios) | 8 per-scenario files map to executable figma-ds-cli verbs |
| `skill_agent` | overlay | advisory | **pass** | SKILL.md allowed-tools contract self-consistent; no runtime agent |
| `agent_cross_runtime` | overlay | advisory | notApplicable | mcp-figma is a user-invocable skill, not a runtime agent |

---

## 8. Deferred Items

| Item | Severity | Reason |
|------|----------|--------|
| F001 stdin guard | P2 | Theoretical path; script is interactive by design |
| F002 help output | P2 | Cosmetic; no behavioral impact |
| F003 token path exposure | P2 | Path constant, not token contents; doctor.sh already guards content display |
| F004 INFERRED tag | P2 | Claim is almost certainly correct (REST API wrapper); live verification is straightforward |
| F005 contract-only gating | P2 | AGENTS.md framework gates provide the enforcement layer |
| F006 evidence artifacts | P2 | implementation-summary.md serves as the evidence record |
| F007 zero fingerprint | P2 | Standard phase-parent placeholder, borderline disproved |
| F008 redundant entities | P2 | Schema design choice; validator catches drift |
| F009 version-pin | P2 | --help verification rule is the primary drift defense |

---

## 9. Audit Appendix

### Iteration Summary

| Run | Dimension | New P0/P1/P2 | Ratio | Verdict |
|-----|-----------|---------------|-------|---------|
| 1 | D1 Correctness | 0/0/2 | 1.00 | PASS |
| 2 | D2 Security | 0/0/3 | 1.00 | PASS |
| 3 | D3 Traceability | 0/0/2 | 1.00 | PASS |
| 4 | D4 Maintainability | 0/0/2 | 1.00 | PASS |
| 5 | Refinement (adversarial re-check) | 0/0/0 | 0.00 | PASS |
| 6 | Stabilization | 0/0/0 | 0.00 | PASS |

### Convergence Signal Replay

| Signal | Value | Stop Vote |
|--------|-------|-----------|
| Rolling average (last 2) | mean([0.00, 0.00]) = 0.00 | STOP (below 0.08) |
| MAD noise floor | 0.00 | STOP (latest 0.00 <= 0.00) |
| Dimension coverage | 4/4 (100%) + stabilized | STOP |
| Composite score | 1.00 | >= 0.60 → gate evaluation |

### Legal-Stop Gate Replay

| Gate | Result |
|------|--------|
| convergenceGate | PASS (rollingAvg=0.00, madStop=true, latestRatio=0.00) |
| dimensionCoverageGate | PASS (all 4 covered) |
| p0ResolutionGate | PASS (0 active P0) |
| evidenceDensityGate | PASS (1.8 avg evidence/finding) |
| hotspotSaturationGate | PASS (all files revisited) |
| claimAdjudicationGate | PASS (no P0/P1 needing packets) |
| fixCompletenessReplayGate | PASS (not security-sensitive fix rerun) |
| candidateCoverageGate | PASS (v2 rollout, trivial) |
| graphlessFallbackGate | PASS (graph available) |

### File Coverage Matrix

| File | D1 | D2 | D3 | D4 | R5/R6 | Findings |
|------|----|----|----|----|-------|----------|
| SKILL.md | - | - | x | x | x | - |
| _common.sh | x | x | x | - | x | F003 |
| install.sh | x | x | x | - | x | - |
| daemon.sh | x | - | - | - | x | F002 |
| connect-safe.sh | x | - | - | - | x | F001 |
| connect-yolo.sh | x | x | - | - | x | - |
| unpatch.sh | x | - | - | - | x | - |
| doctor.sh | x | x | - | - | x | - |
| print-utcp-snippets.sh | x | - | - | - | x | - |
| figma_cli_reference.md | - | - | x | - | x | - |
| tool_surface.md | - | x | x | - | x | F005, F009 |
| mcp_wiring.md | - | x | x | - | x | F004 |
| troubleshooting.md | - | - | x | - | x | - |
| feature_catalog.md | - | - | x | x | x | - |
| playbook.md | - | - | x | x | x | - |
| INSTALL_GUIDE.md | - | - | x | x | x | - |
| README.md | - | - | x | x | x | - |
| graph-metadata.json | - | - | x | x | x | F008 |
| changelog/v0.1.0.0.md | - | - | x | x | x | - |
| phase-002/spec.md | - | - | x | - | x | - |
| phase-002/checklist.md | - | - | x | - | x | F006 |
| phase-001/spec.md | - | - | x | - | x | - |
| parent/spec.md | - | - | x | - | x | F007 |
| env_template.md | - | x | - | - | x | - |
| utcp_figma_manual.md | - | x | - | - | x | - |

**Coverage**: 25 files reviewed. All 8 scripts examined for correctness and security. All 4 references, 2 assets, feature catalog root, playbook root, README, INSTALL_GUIDE, changelog, graph-metadata, and all 4 spec documents reviewed for traceability and maintainability.

---

**Review completed at**: 2026-06-14T18:35:00Z
**Next command**: `/create:changelog` (PASS verdict)
