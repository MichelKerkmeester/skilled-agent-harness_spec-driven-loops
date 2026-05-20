# Iteration 006 — system-spec-kit skill canonical surface

**Scope:** .opencode/skills/system-spec-kit/README.md, .opencode/skills/system-spec-kit/SKILL.md

**Date:** 2026-05-20

---

## Findings

### P0 — None

### P1 — None

### P2 — None

### INFO

**INFO-001: system-spec-kit/README.md jina-embeddings-v3 reference is for mk-spec-memory**
- **File:** .opencode/skills/system-spec-kit/README.md:297
- **Issue:** Line 297 references "jina-embeddings-v3 1024d default per ADR-012" for the vector channel.
- **Evidence:** Line 297: "Compares meaning via embeddings (jina-embeddings-v3 1024d default per ADR-012)"
- **Note:** This is for mk-spec-memory (Spec Kit Memory), not CocoIndex. The prompt states that mk-spec-memory uses jina-embeddings-v3, so this reference is accurate for that system. CocoIndex uses nomic-ai/CodeRankEmbed. These are two different systems with different embedder defaults.

**INFO-002: system-spec-kit/SKILL.md accurate CocoIndex routing**
- **File:** .opencode/skills/system-spec-kit/SKILL.md:383
- **Issue:** None found. CocoIndex routing is accurately stated.
- **Evidence:** Line 383 correctly states "Use CocoIndex for semantic discovery, Code Graph for structural relationships, and Spec Kit Memory for prior decisions and continuity"
- **Note:** This is accurate framework-level routing guidance.

**INFO-003: No broken module paths found**
- **Issue:** No stale module paths found in these 2 files.
- **Evidence:** All file references use correct paths.
- **Note:** These are framework-level docs that don't contain Python module imports.

**INFO-004: No stale 023 slugs found**
- **Issue:** No old-form 023[A-F] slugs found.
- **Evidence:** No spec packet references.
- **Note:** These are framework-level docs that don't reference spec packets.

**INFO-005: No stale CocoIndex model references**
- **Issue:** No CocoIndex-specific model references found in these framework-level docs.
- **Evidence:** The docs focus on spec folder workflows, memory system architecture, and routing guidance.
- **Note:** System-spec-kit is framework-level and doesn't document CocoIndex's internal model defaults.

---

## Summary

**Status:** CLEAN

The system-spec-kit skill docs are clean with respect to CocoIndex documentation alignment:
- The jina-embeddings-v3 reference in README.md is for mk-spec-memory (Spec Kit Memory), which is a separate system from CocoIndex and correctly uses jina-embeddings-v3 per the prompt
- SKILL.md has accurate CocoIndex routing guidance
- No broken module paths
- No stale 023 slugs
- No stale CocoIndex model references (framework-level docs don't document CocoIndex internals)

**Recommendation:** No changes needed. The system-spec-kit docs are framework-level and correctly distinguish between mk-spec-memory (which uses jina-embeddings-v3) and CocoIndex (which uses nomic-ai/CodeRankEmbed).
