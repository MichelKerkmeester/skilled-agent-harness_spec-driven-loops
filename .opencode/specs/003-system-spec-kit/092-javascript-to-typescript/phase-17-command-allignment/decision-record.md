# Decision Record: Command Alignment (Post JS-to-TS Migration)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.0 -->

---

## ADR-001: Replace Path References vs Add Shim File

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-07 |
| **Deciders** | AI agent (research phase), User (approval pending) |

---

### Context

After the JS-to-TS migration (spec 092), TypeScript compiles to `dist/` subdirectories (`tsconfig outDir: "./dist"`). The original decision-record D2 in spec 092 planned for in-place compilation, but the actual implementation used `dist/`. This means `scripts/memory/generate-context.js` no longer exists — the compiled output is at `scripts/dist/memory/generate-context.js`. All 18+ command file references now point to a non-existent path.

### Constraints
- `.opencode/` is a symlink to Public repo — changes propagate to all projects
- The path is referenced in 15+ files across commands and assets
- Agents interpret these paths literally for `node` invocations

---

### Decision

**Summary**: Update all path references from `scripts/memory/generate-context.js` to `scripts/dist/memory/generate-context.js`.

**Details**: Mechanical search-and-replace across all command `.md` and `.yaml` files. No shim, no wrapper script, no alias. Paths should accurately reflect the filesystem.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A) Update all references** | Accurate, no hidden indirection, one-time effort | Must touch 15+ files | 9/10 |
| B) Add shim .js at old path | Zero command file changes needed | Hidden delegation, maintenance burden, masks migration impact | 4/10 |
| C) Change tsconfig to in-place | No path changes needed | Mixes source .ts and compiled .js in same directory, harder to gitignore dist output | 3/10 |

**Why Chosen**: Option A is the simplest solution that maintains path accuracy. Shims (B) add hidden complexity. Changing tsconfig (C) would be a regression from the clean dist/ separation already established.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | All `node` invocations using old path fail with MODULE_NOT_FOUND |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives considered with trade-off analysis |
| 3 | **Sufficient?** | PASS | Single search-and-replace pattern covers all cases |
| 4 | **Fits Goal?** | PASS | Directly resolves the broken invocation paths |
| 5 | **Open Horizons?** | PASS | If dist/ convention changes in future, the same replacement approach applies |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- All command paths accurately reflect real filesystem layout
- No hidden shim/wrapper maintenance
- One-time fix with clear verification (grep)

**Negative**:
- Must update 15+ files — Mitigation: Mechanical operation, fully parallelizable

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missed reference | Low | Comprehensive grep validation in checklist |
| Future path change | Low | Pattern is documented, same approach reusable |

---

### Implementation

**Affected Systems**:
- `.opencode/command/spec_kit/` (7 .md files, 13 .yaml files)
- `.opencode/command/create/` (6 .md files, 6 .yaml files)
- `.opencode/command/memory/save.md`

**Rollback**: `git checkout -- .opencode/command/`

---

## ADR-002: Scope Boundary — Exclude CLAUDE.md and AGENTS.md

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-07 |
| **Deciders** | AI agent |

---

### Context

CLAUDE.md (lines 52, 62) and AGENTS.md (lines 52, 62, 211) also contain the broken `generate-context.js` path. These are project-level configuration files, not command files. Mixing them into a command-alignment spec creates scope confusion.

### Decision

**Summary**: Fix CLAUDE.md and AGENTS.md in a separate spec/commit, not in this phase.

**Details**: This phase focuses exclusively on `.opencode/command/` files. CLAUDE.md and AGENTS.md are flagged in the checklist's "Out-of-Scope Items" section for follow-up.

### Consequences

**Positive**: Clear scope boundary, smaller diff, focused review
**Negative**: CLAUDE.md remains broken until separate fix — Mitigation: The same replacement pattern applies
