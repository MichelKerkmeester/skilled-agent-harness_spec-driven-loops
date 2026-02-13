# Implementation Plan: Phase 19 — workflows-code--opencode Alignment (Part 2)

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Languages** | Bash (11 scripts), Python (6 scripts + 1 test) |
| **Framework** | OpenCode framework (install scripts, MCP tools, documentation tools) |
| **Storage** | None |
| **Testing** | `bash -n` syntax check, `py_compile`, manual execution |

### Overview

This plan covers the systematic alignment of 18 scripts across 3 directories to the `workflows-code--opencode` Shell/Bash and Python P0/P1 standards. The approach is non-destructive: each script receives style and convention updates while preserving all existing functionality. Work is organized into 5 sequential phases, with Phases 1-2 covering Bash-heavy install scripts, Phase 3 covering the small mcp-code-mode directory, Phase 4 covering the Python-heavy documentation scripts, and Phase 5 handling changelog updates and final verification.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001 through SC-004)
- [x] Dependencies identified (Phase 17 complete, skill stable)

### Definition of Done
- [ ] All 18 scripts pass P0 standards with zero violations
- [ ] All 18 scripts pass P1 standards (or deferred with approval)
- [ ] All scripts pass syntax verification (`bash -n` / `py_compile`)
- [ ] No functional regressions
- [ ] Changelogs updated for each directory

---

## 3. ARCHITECTURE

### Pattern
Mechanical code alignment — no architectural changes. Each script receives the same set of transformations applied in the same order.

### Key Components
- **Shell Standards Engine**: Shebang, COMPONENT header, strict mode, variable quoting, comment cleanup
- **Python Standards Engine**: Shebang, COMPONENT header, module docstring, type hints, naming conventions, import ordering

### Transformation Order (per script)
1. Shebang line (add or correct)
2. COMPONENT header block (add dash-line format)
3. Strict mode / module docstring
4. Naming convention fixes (snake_case functions, UPPER_SNAKE_CASE constants)
5. Variable quoting (Bash) / type hints (Python)
6. Comment cleanup (remove commented-out code, add WHY comments)
7. Error handling improvements (stderr, specific exceptions)
8. Import ordering (Python only)

---

## 4. IMPLEMENTATION PHASES

### Phase 1: install_scripts Core (5 scripts, ~2,722 LOC)

The highest-LOC scripts that form the foundation of the install system.

- [ ] `_utils.sh` (858 LOC) — shared utility library, sourced by all other scripts
- [ ] `install-all.sh` (511 LOC) — orchestrator script
- [ ] `install-code-mode.sh` (426 LOC) — MCP Code Mode installer
- [ ] `install-figma.sh` (525 LOC) — Figma MCP installer
- [ ] `install-narsil.sh` (701 LOC) — Narsil CLI installer

**Rationale**: `_utils.sh` must be done first since all other install scripts source it. Changes to its function signatures or variable names could affect downstream scripts.

### Phase 2: install_scripts Remaining (4 scripts, ~1,349 LOC)

- [ ] `install-chrome-devtools.sh` (396 LOC) — Chrome DevTools MCP installer
- [ ] `install-sequential-thinking.sh` (206 LOC) — Sequential Thinking installer
- [ ] `install-spec-kit-memory.sh` (302 LOC) — Spec Kit Memory installer
- [ ] `test/run-tests.sh` (145 LOC) — test runner

### Phase 3: mcp-code-mode Scripts (2 scripts, ~452 LOC)

- [ ] `update-code-mode.sh` (145 LOC) — Shell P0/P1 alignment
- [ ] `validate_config.py` (307 LOC) — Python P0/P1 alignment

**Note**: Small directory, can be completed in a single pass.

### Phase 4: workflows-documentation Scripts (7 scripts, ~3,373 LOC)

- [ ] `extract_structure.py` (1,124 LOC) — largest Python script
- [ ] `validate_document.py` (736 LOC) — document validator
- [ ] `package_skill.py` (545 LOC) — skill packager
- [ ] `init_skill.py` (410 LOC) — skill initializer
- [ ] `quick_validate.py` (147 LOC) — quick validation
- [ ] `validate_flowchart.sh` (134 LOC) — Shell P0/P1 alignment
- [ ] `tests/test_validator.py` (277 LOC) — test file (exemptions apply)

### Phase 5: Changelog Updates + Verification

- [ ] Update `install_guides/install_scripts/` changelog (or create if absent)
- [ ] Update `skill/mcp-code-mode/` changelog (or create if absent)
- [ ] Update `skill/workflows-documentation/` changelog (or create if absent)
- [ ] Run `bash -n` on all 11 Bash scripts
- [ ] Run `py_compile` on all 7 Python files
- [ ] Verify no functional regressions

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | All Bash scripts | `bash -n <script>` |
| Syntax | All Python scripts | `python3 -c "import py_compile; py_compile.compile('<script>', doraise=True)"` |
| Functional | Install scripts | Manual dry-run (inspect output, do not execute installs) |
| Functional | Python scripts | Run each script with `--help` or test inputs |
| Standards | All scripts | `grep` for P0/P1 compliance markers |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 17 completion | Internal | Green (complete) | No precedent patterns |
| workflows-code--opencode skill | Internal | Green (stable) | No standards reference |
| Bash 3.2+ compatibility | External | Green | macOS default shell |
| Python 3.9+ | External | Green | Type hint syntax |

---

## 7. ROLLBACK PLAN

- **Trigger**: Script fails syntax check or functional regression detected
- **Procedure**: `git checkout -- <affected-file>` to revert individual scripts
- **Scope**: Each file is independently revertable; no cross-file dependencies in style changes

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (_utils.sh first) ──► Phase 2 (remaining install scripts)
                                        │
Phase 3 (mcp-code-mode) ───────────────►├──► Phase 5 (changelog + verify)
                                        │
Phase 4 (workflows-documentation) ─────►┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2 (due to _utils.sh) |
| Phase 2 | Phase 1 | Phase 5 |
| Phase 3 | None | Phase 5 |
| Phase 4 | None | Phase 5 |
| Phase 5 | Phases 1-4 | None |

**Parallel Opportunities**: Phases 3 and 4 can run in parallel with Phase 1-2.

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Scripts | Est. LOC Changed | Estimated Effort |
|-------|------------|---------|-------------------|------------------|
| Phase 1: install_scripts core | Medium | 5 | ~500-800 | 1-2 hours |
| Phase 2: install_scripts remaining | Low-Medium | 4 | ~200-400 | 30-60 min |
| Phase 3: mcp-code-mode | Low | 2 | ~100-150 | 15-30 min |
| Phase 4: workflows-documentation | Medium-High | 7 | ~600-1,000 | 1-2 hours |
| Phase 5: Changelog + verify | Low | N/A | ~50-100 | 15-30 min |
| **Total** | | **18** | **~1,450-2,450** | **~3-5 hours** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Git working tree clean before starting each phase
- [ ] Each phase committed separately for granular revert

### Rollback Procedure
1. Identify failing script(s) from syntax/functional tests
2. `git checkout -- <file>` for individual file revert
3. `git revert <commit>` for entire phase revert if needed
4. Re-run verification to confirm clean state

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (style-only changes)

---

## L3: DEPENDENCY GRAPH

```
┌─────────────────────┐
│     Phase 1         │
│ install core (5)    │──────────────────┐
│ _utils.sh FIRST     │                  │
└─────────────────────┘                  │
         │                               │
         ▼                               │
┌─────────────────────┐                  │
│     Phase 2         │                  │
│ install remaining(4)│──────┐           │
└─────────────────────┘      │           │
                             │           │
┌─────────────────────┐      │     ┌─────▼─────────────┐
│     Phase 3         │──────┼────►│     Phase 5       │
│ mcp-code-mode (2)   │      │     │ Changelog + Verify│
└─────────────────────┘      │     └───────────────────┘
                             │           ▲
┌─────────────────────┐      │           │
│     Phase 4         │──────┘───────────┘
│ workflows-doc (7)   │
└─────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 | None | Aligned install core | Phase 2 |
| Phase 2 | Phase 1 | Aligned install remaining | Phase 5 |
| Phase 3 | None | Aligned mcp-code-mode | Phase 5 |
| Phase 4 | None | Aligned workflows-doc | Phase 5 |
| Phase 5 | All above | Changelogs, verification | None |

---

## L3: CRITICAL PATH

1. **Phase 1** (install_scripts core) — 1-2 hours — CRITICAL (blocks Phase 2)
2. **Phase 2** (install_scripts remaining) — 30-60 min — CRITICAL (blocks Phase 5)
3. **Phase 5** (changelog + verification) — 15-30 min — CRITICAL (final gate)

**Total Critical Path**: ~2-3.5 hours

**Parallel Opportunities**:
- Phase 3 (mcp-code-mode) and Phase 4 (workflows-documentation) can run in parallel with Phases 1-2
- Within Phase 4, Python scripts are independent and can be aligned in parallel

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Install scripts aligned | 9/9 Bash scripts pass P0/P1 | End of Phase 2 |
| M2 | mcp-code-mode aligned | 2/2 scripts pass P0/P1 | End of Phase 3 |
| M3 | workflows-doc aligned | 7/7 scripts pass P0/P1 | End of Phase 4 |
| M4 | Full verification | 18/18 scripts verified, changelogs updated | End of Phase 5 |

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for full ADRs. Key decisions:

- **ADR-001**: Scope limited to 3 directories (system-spec-kit excluded)
- **ADR-002**: Non-destructive alignment (preserve functionality)
- **ADR-003**: Changelog update strategy (per-directory entries)

---

## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Scope**: Phase 1 — `_utils.sh` must be aligned first (sourced by all install scripts)
**Duration**: ~30 min
**Agent**: Primary (Sonnet)

### Tier 2: Parallel Execution
| Agent | Focus | Files |
|-------|-------|-------|
| Agent A (Sonnet) | Phase 2: remaining install scripts | 4 Bash scripts |
| Agent B (Sonnet) | Phase 3: mcp-code-mode | 1 Bash + 1 Python |
| Agent C (Sonnet) | Phase 4: workflows-documentation | 5 Python + 1 Bash + 1 test |

**Duration**: ~60-90 min (parallel)

### Tier 3: Integration
**Agent**: Primary (Sonnet)
**Task**: Phase 5 — changelog updates, full verification sweep, implementation-summary.md
**Duration**: ~30 min

---

## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Install Scripts | Agent A | 9 Bash scripts | Pending |
| W-B | MCP Code Mode | Agent B | 1 Bash + 1 Python | Pending |
| W-C | Workflows Documentation | Agent C | 5 Python + 1 Bash + 1 test | Pending |
| W-D | Verification | Primary | All 18 scripts | Blocked on W-A,B,C |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-A Phase 1 complete | W-A | Phase 2 can begin |
| SYNC-002 | W-A, W-B, W-C complete | All agents | Phase 5 verification |

### File Ownership Rules
- Each directory owned by ONE workstream
- No cross-directory dependencies for style changes
- Changelogs updated by Primary agent in Phase 5

---

## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per Phase**: Update tasks.md with completion status
- **Blockers**: Immediate escalation if `set -euo pipefail` breaks a script

### Escalation Path
1. Strict mode breakage --> Investigate, apply `|| true` pattern or document exception
2. Scope questions --> Refer to spec.md Section 3
3. Standard ambiguity --> Refer to Phase 17 precedent
