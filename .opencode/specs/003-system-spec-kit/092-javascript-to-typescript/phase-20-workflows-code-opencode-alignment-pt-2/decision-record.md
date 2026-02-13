# Decision Record: Phase 19 — workflows-code--opencode Alignment (Part 2)

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.0 -->

---

## ADR-001: Scope Boundary — Three Directories Only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-07 |
| **Deciders** | Michel Kerkmeester |

---

### Context

Phase 17 completed the alignment of the `system-spec-kit` codebase (136 files) against `workflows-code--opencode` standards. The remaining script directories in the OpenCode framework have never been audited. A decision is needed on whether to scope Phase 19 to ALL remaining directories or limit it to the three script-heavy directories.

### Constraints
- Phase 17 already covered system-spec-kit comprehensively
- TypeScript/JavaScript files follow different standards sections (handled separately)
- Time efficiency favors focused scope over broad sweep

---

### Decision

**Summary**: Phase 19 covers exactly 3 directories: `install_guides/install_scripts/`, `skill/mcp-code-mode/scripts/`, and `skill/workflows-documentation/scripts/`.

**Details**: These are the three directories containing standalone Shell and Python scripts that have not been aligned to the `workflows-code--opencode` standards. Other directories either contain TypeScript (covered by different standards sections), configuration files, or documentation. This scope targets 18 scripts totaling ~7,895 LOC.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **3 directories only (chosen)** | Focused, manageable, clear completion criteria | Does not cover non-script files | 9/10 |
| All remaining framework directories | Comprehensive coverage | Scope explosion, mixed file types, much larger effort | 5/10 |
| Only install_scripts (largest) | Smallest scope, quickest | Leaves mcp-code-mode and workflows-doc misaligned | 4/10 |

**Why Chosen**: Covers all remaining Shell/Python scripts without scope creep into TypeScript or documentation files. Clean boundary aligned with Phase 17's focus on code standards.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Three directories have never been audited; inconsistency across framework |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives considered (all dirs vs. subset vs. single dir) |
| 3 | **Sufficient?** | PASS | Covers all remaining Shell/Python scripts in the framework |
| 4 | **Fits Goal?** | PASS | Directly advances JS-to-TS migration's code quality track |
| 5 | **Open Horizons?** | PASS | No lock-in; each directory independently revertable |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Framework-wide Shell/Python consistency after completion
- Clear scope boundary prevents Phase 19 from expanding uncontrollably

**Negative**:
- Non-script files in these directories remain unaudited — Mitigation: Can be addressed in a future phase if needed

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope perceived as incomplete | L | Document that non-script files are explicitly out of scope |

---

### Implementation

**Affected Systems**:
- `install_guides/install_scripts/` (9 Bash scripts)
- `skill/mcp-code-mode/scripts/` (1 Bash + 1 Python)
- `skill/workflows-documentation/scripts/` (5 Python + 1 Bash + 1 test)

**Rollback**: Git revert per-directory or per-file

---

## ADR-002: Non-Destructive Alignment — Preserve Functionality

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-07 |
| **Deciders** | Michel Kerkmeester |

---

### Context

The 18 scripts in scope are production utilities: install scripts that configure MCP servers, validation scripts that check configurations, and documentation tools that package skills. Any functional regression could break developer workflows.

### Constraints
- Install scripts are used across multiple projects via the Public repo symlink
- Python scripts are invoked by skills and commands during documentation workflows
- `set -euo pipefail` strict mode can cause scripts to exit unexpectedly if they rely on non-zero exit codes

---

### Decision

**Summary**: All changes are style-only. No functional behavior may change.

**Details**: Each script alignment follows a strict transformation checklist (shebang, header, strict mode, naming, quoting, comments) applied mechanically. If `set -euo pipefail` would break existing behavior (e.g., a command that is expected to fail), the pattern `command || true` or explicit error handling is used. Every script must pass `bash -n` (Bash) or `py_compile` (Python) after alignment, and functional behavior must remain identical.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Non-destructive (style only)** | Zero functional risk, easy verification | Does not fix functional bugs if found | 9/10 |
| Style + functional improvements | Fixes bugs discovered during alignment | Higher risk, harder to verify, scope creep | 5/10 |
| Style + refactoring | Cleaner code overall | Major scope expansion, high regression risk | 3/10 |

**Why Chosen**: Risk/reward strongly favors style-only changes. Functional improvements can be tracked as separate specs.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Non-destructive constraint prevents regressions |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives considered and rejected for risk |
| 3 | **Sufficient?** | PASS | Style alignment is the stated goal |
| 4 | **Fits Goal?** | PASS | Directly serves the alignment objective |
| 5 | **Open Horizons?** | PASS | Functional improvements can follow in separate phases |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Zero risk of breaking developer workflows
- Easy to verify: syntax check + manual spot check

**Negative**:
- Functional bugs discovered during alignment will NOT be fixed — Mitigation: Document as separate spec candidates

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| `set -euo pipefail` causes unexpected exits | H | Test each script; use `|| true` for expected failures |
| Variable quoting changes word splitting | M | Review each change for intentional splitting |

---

### Implementation

**Affected Systems**: All 18 scripts (style only)

**Rollback**: `git checkout -- <file>` for any individual script

---

## ADR-003: Changelog Update Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-07 |
| **Deciders** | Michel Kerkmeester |

---

### Context

Phase 19 modifies files across 3 directories. Each directory may or may not have an existing CHANGELOG. A consistent approach to documenting these changes is needed.

### Constraints
- Some directories may lack CHANGELOG files
- Changes are mechanical (style alignment), not feature additions
- Phase 17 set a precedent for changelog entries

---

### Decision

**Summary**: Add a single changelog entry per directory documenting the alignment, creating the CHANGELOG file if it does not exist.

**Details**: Each directory receives one entry in its CHANGELOG (or a new CHANGELOG.md if none exists) with the format: date, "Shell/Python P0/P1 alignment per workflows-code--opencode standards (Phase 19)", list of files modified, and summary of change types (header, strict mode, naming, quoting, etc.).

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One entry per directory (chosen)** | Concise, matches change scope | Less granular | 8/10 |
| One entry per file | Maximum granularity | Verbose, 18 entries across 3 changelogs | 4/10 |
| Single global changelog | Centralized tracking | Loses per-directory ownership | 5/10 |
| No changelog updates | Simplest | Undocumented changes, bad practice | 2/10 |

**Why Chosen**: Matches the granularity of the change (one alignment pass per directory) without excessive verbosity.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Changes must be documented |
| 2 | **Beyond Local Maxima?** | PASS | Four options evaluated |
| 3 | **Sufficient?** | PASS | One entry per directory captures the scope |
| 4 | **Fits Goal?** | PASS | Documentation is part of the deliverables |
| 5 | **Open Horizons?** | PASS | Future changes can add more entries |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Clear audit trail of when and why scripts were modified
- Consistent with Phase 17 precedent

**Negative**:
- Changelog file created where none existed — Mitigation: This is a positive side effect (all directories should have changelogs)

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Changelog format inconsistency | L | Use same format as Phase 17 |

---

### Implementation

**Affected Systems**: CHANGELOG files in 3 directories

**Rollback**: Remove changelog entry or delete created file

---

## Session Decision Log

> **Purpose**: Track all gate decisions made during this session for audit trail and learning.

| Timestamp | Gate | Decision | Confidence | Uncertainty | Evidence |
|-----------|------|----------|------------|-------------|----------|
| — | — | — | — | — | Populated during implementation |
