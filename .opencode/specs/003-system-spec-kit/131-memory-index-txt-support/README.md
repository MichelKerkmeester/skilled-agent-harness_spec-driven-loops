# Spec 131: Memory Index TXT File Support

> **Level 3** — Add `.txt` file indexing to Spec Kit Memory index scan

---

## Quick Reference

| Attribute | Value |
|-----------|-------|
| **Level** | 3 (Architecture) |
| **Priority** | P1 |
| **Status** | Draft |
| **LOC Estimate** | 50-100 |
| **Effort** | 4-6 hours |
| **Branch** | `131-memory-index-txt-support` |

---

## Problem

Command folder documentation uses `README.txt` files with frontmatter metadata, but these files are not indexed by `memory_index_scan`, making them invisible to memory search tools.

---

## Solution

Extend the memory indexing subsystem to discover and index `.txt` files alongside `.md` files. Add `.txt` extension support to file discovery functions and update path validation to accept `.txt` from allowed paths (specs/, .opencode/skill/, .opencode/command/).

---

## Key Decisions

- **ADR-001**: Unified file discovery (single pass for `.md` and `.txt`)
- **ADR-002**: Read-only safeguards prevent command invocation during indexing
- **ADR-003**: Path validation regex extended to accept `.txt` with explicit OR condition
- **ADR-004**: Reduced importance weight (0.3) for `.txt` files (matches README precedent)

---

## Documentation

- **Specification**: [spec.md](./spec.md) — Requirements, user stories, risk matrix
- **Implementation Plan**: [plan.md](./plan.md) — Technical approach, phases, ADRs
- **Tasks**: [tasks.md](./tasks.md) — Task breakdown with dependencies
- **Checklist**: [checklist.md](./checklist.md) — Verification gates (P0/P1/P2)
- **Decision Record**: [decision-record.md](./decision-record.md) — Architecture decisions
- **Research**: [research.md](./research.md) — Technical investigation findings
- **Implementation Summary**: [implementation-summary.md](./implementation-summary.md) — Post-implementation (TBD)

---

## Files to Change

| File | Change Type | Lines Affected |
|------|-------------|----------------|
| `memory-index.ts` | Modify | ~150-340 (4 discovery functions) |
| `memory-save.ts` | Modify | ~1029 (path validation regex) |
| `handler-memory-index.vitest.ts` | Modify | +50-100 (new tests) |

---

## Success Criteria

- [SC-001] `memory_index_scan()` indexes `.opencode/command/spec_kit/README.txt`
- [SC-002] `memory_search({ query: "spec kit command" })` returns `.txt` files
- [SC-003] All existing `.md` indexing tests pass (no regressions)
- [SC-004] Command invocation does NOT occur during indexing (verified)

---

## Related Specs

- **Spec 126**: Full spec document indexing (README.md weight precedent)
- **Parent**: [003-system-spec-kit](../) — Spec Kit Memory system

---

**Created**: 2026-02-16
**Last Updated**: 2026-02-16
