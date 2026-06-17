# Review Report: mcp-figma with direct CLI support

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | CONDITIONAL |
| **hasAdvisories** | true |
| **Active P0** | 0 |
| **Active P1** | 2 |
| **Active P2** | 7 |
| **Scope** | Spec folder `skilled-agent-orchestration/146-mcp-figma-with-direct-cli-support` and the shipped skill at `.opencode/skills/mcp-figma/` |
| **Iterations** | 4 |
| **Dimensions Covered** | 4/4 (correctness, security, traceability, maintainability) |
| **Convergence** | Blocked by active P1 findings; all dimensions covered |
| **Release Readiness** | in-progress |

The mcp-figma skill is well-structured, follows the sibling terminal-control shape, and has strong traceability between spec, checklist, feature catalog, and playbook. Two P1 correctness findings relate to safety-gating enforcement gaps (yolo patch running-state check and install.sh error handling). Seven P2 advisory findings cover minor quality issues across all dimensions. No P0 blockers were found.

---

## 2. Planning Trigger

The verdict is **CONDITIONAL** because 2 active P1 findings remain. These require remediation before a PASS verdict:

- **F001** (P1): `connect-yolo.sh` does not verify Figma Desktop is running before applying the app.asar patch. The SKILL.md ALWAYS rule #2 requires "Figma Desktop open with a file" but the enforcement script only checks existence on disk, not running state.
- **F002** (P1): `install.sh` auto mode does not handle repo install failure gracefully. When the npm version is stale and the repo build fails, the user is left with no clear guidance.

**Recommended next step**: `/speckit:plan` to create a remediation plan for the 2 P1 findings.

---

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | File:Line | First Seen | Status |
|----|----------|-----------|-------|-----------|------------|--------|
| F001 | P1 | correctness | connect-yolo.sh does not verify Figma Desktop is running before patching | `scripts/connect-yolo.sh:30` | 1 | active |
| F002 | P1 | correctness | install.sh auto mode does not handle repo install failure gracefully | `scripts/install.sh:146` | 1 | active |
| F003 | P2 | correctness | Inconsistent daemon file path naming between token and PID | `scripts/_common.sh:48` | 1 | active |
| F004 | P2 | correctness | tool_surface.md references nonexistent research output file | `references/tool_surface.md:164` | 1 | active |
| F005 | P2 | traceability | Graph metadata siblings missing mcp-magicpath edge | `graph-metadata.json:26` | 1 | active |
| F006 | P2 | security | print-utcp-snippets.sh example uses wrong tool name | `scripts/print-utcp-snippets.sh:42` | 2 | active |
| F007 | P2 | security | doctor.sh does not check Figma Desktop running state | `scripts/doctor.sh:28` | 2 | active |
| F008 | P2 | maintainability | install.sh verbose flag has no effect on git operations | `scripts/install.sh:95` | 4 | active |
| F009 | P2 | maintainability | _common.sh defines unused daemon file constants | `scripts/_common.sh:48` | 4 | active |

---

## 4. Remediation Workstreams

### Workstream A: Safety Gating (P1, priority)

1. **F001**: Add a Figma Desktop running-state check to `connect-yolo.sh` before the patch. Use `pgrep -x Figma` or equivalent, matching the SKILL.md ALWAYS rule #2.
2. **F002**: Wrap the `install_repo` call in `install.sh` auto mode with error handling. On failure, report the stale npm version and suggest `--source repo --force`.

### Workstream B: Documentation Quality (P2, advisory)

3. **F004**: Remove or update the phantom `research/raw/iter-001.out` reference in `tool_surface.md`.
4. **F006**: Fix the tool name in `print-utcp-snippets.sh` from `figma.figma_get_file` to `figma.figma_get_figma_data`.

### Workstream C: Graph Registration (P2, advisory)

5. **F005**: Add the missing `mcp-magicpath` sibling edge to `graph-metadata.json`.

### Workstream D: Code Quality (P2, advisory)

6. **F003**: Align daemon PID file naming with the canonical `figma-ds-cli` name, or document the legacy naming.
7. **F007**: Add a Figma Desktop running-state check to `doctor.sh`.
8. **F008**: Fix the verbose flag expansion in `install.sh` git operations.
9. **F009**: Either use the `_common.sh` daemon constants in all scripts or remove them.

---

## 5. Spec Seed

No spec changes required. The spec accurately describes the feature. The findings are implementation-level quality issues, not spec-level gaps.

---

## 6. Plan Seed

| Task | Finding | Priority | Effort |
|------|---------|----------|--------|
| Add Figma running-state check to connect-yolo.sh | F001 | P1 | Small |
| Add error handling to install.sh auto mode | F002 | P1 | Small |
| Fix phantom research file reference | F004 | P2 | Trivial |
| Fix tool name in print-utcp-snippets.sh | F006 | P2 | Trivial |
| Add mcp-magicpath sibling edge | F005 | P2 | Trivial |
| Add running-state check to doctor.sh | F007 | P2 | Small |
| Fix verbose flag in install.sh | F008 | P2 | Trivial |
| Align or remove unused daemon constants | F009 | P2 | Trivial |
| Align daemon PID file naming | F003 | P2 | Trivial |

---

## 7. Traceability Status

| Protocol | Level | Status | Gate | Iteration | Notes |
|----------|-------|--------|------|-----------|-------|
| `spec_code` | core | pass | hard | 1, 3 | All 6 REQs map to shipped behavior |
| `checklist_evidence` | core | pass | hard | 1, 3 | All 26 checklist items verified |
| `feature_catalog_code` | overlay | pass | advisory | 3 | 8 capability areas, 8 per-feature files |
| `playbook_capability` | overlay | pass | advisory | 3 | 8 scenarios, 8 per-scenario files |

All core and overlay protocols pass. The only traceability gap is F005 (missing graph-metadata sibling edge), which is advisory.

---

## 8. Deferred Items

| ID | Severity | Title | Reason |
|----|----------|-------|--------|
| F003 | P2 | Inconsistent daemon file path naming | Cosmetic; constants are unused by most scripts |
| F004 | P2 | Phantom research file reference | Documentation quality; no behavioral impact |
| F005 | P2 | Missing mcp-magicpath graph edge | Advisory; graph still functional with 2/3 siblings |
| F006 | P2 | Wrong tool name in snippet | Mitigated by "args per tool_info" comment |
| F007 | P2 | doctor.sh missing running-state check | Diagnostic improvement, not a blocker |
| F008 | P2 | Verbose flag dead code | Minor quality issue |
| F009 | P2 | Unused daemon constants | Minor dead code |

---

## 9. Audit Appendix

### Iteration Summary

| Iteration | Dimension | Findings | New Ratio | Status |
|-----------|-----------|----------|-----------|--------|
| 1 | Correctness | 0P0, 2P1, 3P2 | 1.0 | complete |
| 2 | Security | 0P0, 0P1, 2P2 | 0.29 | complete |
| 3 | Traceability | 0P0, 0P1, 0P2 | 0.0 | complete |
| 4 | Maintainability | 0P0, 0P1, 2P2 | 0.29 | complete |

### Convergence Signals

| Signal | Value | Stop? |
|--------|-------|-------|
| Rolling Average | 0.145 | No (> 0.08) |
| Dimension Coverage | 1.0 | Yes |
| Composite Score | 0.45 | Below 0.60 threshold |

### Blocked Stop Event (iteration 4)

The convergence check at iteration 4 voted STOP on dimension coverage but was blocked by `p0ResolutionGate` (2 active P1 findings). The loop proceeded to synthesis with a CONDITIONAL verdict per the synthesis protocol.

### Files Reviewed

14 unique files reviewed across 4 iterations: SKILL.md, 8 scripts, 4 references, graph-metadata.json, spec.md, checklist.md, implementation-summary.md, feature_catalog.md, manual_testing_playbook.md, README.md, INSTALL_GUIDE.md.

### Release Readiness

State: `in-progress`. The skill is functional and well-documented. Two P1 findings require remediation before the verdict can be upgraded to PASS. All P2 findings are advisory and do not block release.
