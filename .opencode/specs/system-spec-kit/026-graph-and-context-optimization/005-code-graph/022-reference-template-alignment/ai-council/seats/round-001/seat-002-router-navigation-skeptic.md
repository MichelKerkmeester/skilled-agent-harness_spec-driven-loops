---
round: 1
seat: "seat-002"
executor: "cli-opencode"
lens: "Critical"
vantage: "opencode-go/deepseek-v4-pro max"
status: "ok"
timestamp: "2026-05-24T10:04:00Z"
simulated: false
confidence: 85
---

# Seat 002: Router and Navigation Skeptic

## Proposed Plan

**ACCEPT AS-IS with optional advisory**. The router maps are correct — RESOURCE_MAP exclusively targets canonical paths, no stub paths appear as primary resources. Active docs (README.md §9, ARCHITECTURE.md §8, SKILL.md §8) all link to canonical references. Stale path checks confirm no root kebab-case paths in active navigation. The one concern is a future-maintenance enforcement gap: nothing prevents accidentally mapping a stub path in RESOURCE_MAP.

## Reasoning

1. **RESOURCE_MAP audit (line-by-line)**: Every entry in `SKILL.md` RESOURCE_MAP (lines 131-181) was verified:
   - TOOL_SURFACE → `references/runtime/tool_surface.md` ✓ (canonical, not stub)
   - READINESS → `references/readiness/code_graph_readiness_check.md`, `references/readiness/readiness_and_scope_fingerprint.md` ✓
   - QUERY, SCAN_VERIFY, CHANGE_DETECTION, CONFIG, CCC, NAMING, OWNERSHIP, LAUNCHER: all canonical ✓
   - DEFAULT_RESOURCES: both canonical ✓
   - **Zero stub paths in any resource map.**

2. **Active doc link audit**:
   - README.md §9 (lines 340-347): All reference links canonical ✓
   - ARCHITECTURE.md §8 (lines 215-217): All reference links canonical ✓
   - SKILL.md §8 (lines 389-396): All reference links canonical ✓
   - SKILL.md §2 resource domains (lines 81-86): Describes `runtime/`, `readiness/`, `config/`, `integrations/` ✓

3. **Stale path verification**: The calling agent's `rg` check confirmed zero stale root paths in active docs. This directly mitigates risk R-001 from spec.md.

4. **Router pseudocode contract**: The pseudocode at lines 97-264 is a documentation contract. The `_guard_in_skill()` sandboxing, `load_if_available()` inventory check, and `discover_markdown_resources()` breadth are correct patterns. However, stub paths under `references/*.md` WILL appear in discovery — they're only excluded because RESOURCE_MAP doesn't reference them. This is a documentation-level contract with no runtime enforcement.

5. **Enforcement gap**: The anti-pattern note at line 297 ("Loading root compatibility stubs when canonical subfolder references exist") warns against stub loading. But if a future maintainer adds a stub path to RESOURCE_MAP, no automated check would catch it. This is a low-severity maintenance risk.

## Risks & Trade-offs

- **Risk**: Future RESOURCE_MAP edit accidentally maps stub path. Severity: LOW. Mitigation: documented anti-pattern; would be caught in PR review if reviewer knows the pattern.
- **Trade-off**: Router pseudocode is Python-like but not executable. This keeps documentation lightweight but means agents must interpret the contract correctly.

## Assumptions and Evidence Gaps

- **Assumption**: The local markdown link resolver check covers cross-file link validity for all RESOURCE_MAP paths. Supported by: the check passed on all changed active docs and references.
- **Gap**: No automated lint verifying that RESOURCE_MAP values are canonical paths (i.e., matching `references/[a-z_]+/[a-z_]+\.md` rather than `references/[a-z-]+\.md`).

## Alternative Challenged

**Alternative**: "Add stubs to RESOURCE_MAP for backward compatibility" — would make stubs primary knowledge sources, wasting agent loads on thin pointers. Properly rejected by ADR-002.

## Confidence

**85/100**: The navigation is provably correct NOW. Deducted for the future-maintenance enforcement gap on RESOURCE_MAP discipline. The validation evidence is strong but all checks are "what exists now," not "what prevents future drift."

## Scoring (Self)

| Dimension | Score | Notes |
|-----------|-------|-------|
| Correctness | 27/30 | All paths verified correct |
| Completeness | 17/20 | Nav surface covered; enforcement gap noted |
| Elegance | 13/15 | Router pseudocode is clean but not executable |
| Robustness | 17/20 | Stale path checks cover current state |
| Integration | 13/15 | Fits skill pattern; future-proofing is manual |
| **Total** | **87/100** | |
