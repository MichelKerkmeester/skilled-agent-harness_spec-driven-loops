---
title: "Decision Record: System Skill Advisor Reference Template Alignment"
description: "Decision record for canonical subfolder references plus old-path compatibility stubs."
trigger_phrases:
  - "system skill advisor reference alignment decision"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-skill-advisor-documentation/007-reference-template-alignment"
    last_updated_at: "2026-05-24T07:27:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed reference template alignment and validation"
    next_safe_action: "Packet complete; preserve compatibility stubs during future reference edits"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/SKILL.md"
      - ".opencode/skills/system-skill-advisor/README.md"
      - ".opencode/skills/system-skill-advisor/references/"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "system-skill-advisor-reference-template-alignment-2026-05-24"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use compatibility stubs."
      - "Create a new spec packet."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: System Skill Advisor Reference Template Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Canonical Reference Subfolders With Compatibility Stubs

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-24 |
| **Deciders** | User, Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

The advisor references were flat and kebab-case, while the sk-doc reference template expects snake_case reference filenames and a predictable H1/overview structure. Existing links may still point at the root files, so moving files without stubs would create avoidable link breakage.

### Constraints

- Documentation/navigation only. Runtime MCP behavior, tool ids, schemas and scripts must not change.
- Canonical references must use snake_case names.
- Old root paths must continue to resolve as valid reference documents.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Move canonical references into focused snake_case subfolders and leave short compatibility stubs at the old root paths.

**How it works**: Canonical docs live under `references/scoring/`, `references/graph/`, `references/runtime/`, `references/config/`, `references/hooks/`, and `references/decisions/`. Each old root kebab-case file becomes a valid reference-template stub that points to the canonical destination.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Canonical subfolders plus stubs** | Template-compliant, domain-organized, preserves old links | More files to validate | 9/10 |
| In-place template cleanup | Lowest path churn | Keeps flat kebab-case canonical names | 5/10 |
| Move without stubs | Cleanest tree | Breaks old links and historical references | 4/10 |

**Why this one**: It satisfies sk-doc naming and structure expectations while avoiding unnecessary compatibility breakage.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Router resource maps can point to stable canonical folders.
- Human readers can find scoring, graph, runtime, config, hook and decision material by domain.
- Existing root links still resolve.

**What it costs**:

- Compatibility stubs increase the number of reference files. Mitigation: keep stubs short and validate them separately.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Stubs become preferred router targets | Medium | RESOURCE_MAP uses canonical paths only. |
| Relative links break after file moves | Medium | Run link smoke checks and rg stale-path checks. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User identified template drift and requested the same canonicalization pattern. |
| 2 | **Beyond Local Maxima?** | PASS | Compared in-place cleanup, canonical-only move, and stubs. |
| 3 | **Sufficient?** | PASS | No runtime behavior changes are needed. |
| 4 | **Fits Goal?** | PASS | Directly aligns references and router navigation. |
| 5 | **Open Horizons?** | PASS | Subfolder domains make future reference growth easier. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- Move canonical references into domain folders.
- Create valid old-path stubs.
- Update active links and smart-router resource maps.

**How to roll back**: Restore old root files from git, delete the new canonical subfolders and stubs from this packet, restore active links to root paths, then rerun sk-doc and spec validation.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
