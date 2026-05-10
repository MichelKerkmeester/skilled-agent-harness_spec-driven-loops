---
title: "Feature Specification: sk-doc skill README and structure"
description: "Phase parent for sk-doc reference relocation, sk-doc skill README asset creation, and markdown-agent rename planning."
trigger_phrases:
  - "sk-doc skill README"
  - "sk-doc references relocation"
  - "markdown agent rename"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/102-sk-doc-skill-readme-and-structure"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Prepared phase parent"
    next_safe_action: "Implement phase one"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-sk-doc-skill-readme-and-structure-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent.spec.md | v2.2 -->

# Feature Specification: sk-doc skill README and structure

<!-- SPECKIT_LEVEL: phase-parent -->

## 1. Metadata

| Field | Value |
| --- | --- |
| **Status** | Draft |
| **Priority** | P1 |
| **Created** | 2026-05-10 |
| **Phase Count** | 3 |
| **Last Active Child** | `001-sk-doc-reference-relocation/` |

## 2. Purpose

This packet coordinates the documentation and agent-structure work needed to make `sk-doc` easier to maintain and to rename the create documentation agent into the markdown agent identity. The parent stays lean; all implementation details live in the child phase folders.

## 3. Scope

In scope:
- Relocate `sk-doc` creation guides out of `references/specific/` and update references.
- Add a dedicated skill README asset for `sk-doc` skill creation guidance.
- Rename the create documentation agent identity to markdown across runtime surfaces and references.

Out of scope:
- Performing implementation at the parent level.
- Renaming `/create:*` command names unless a later product decision explicitly changes the command family.
- Changing unrelated skill, command, or agent behavior.

## 4. Phase Documentation Map

| Phase | Folder | Status | Description |
| --- | --- | --- | --- |
| 1 | `001-sk-doc-reference-relocation/` | Active | Move `sk-doc/references/specific` documents to `sk-doc/references` root and update all old-path references. |
| 2 | `002-sk-doc-skill-readme-asset/` | Draft | Analyze skill README conventions and create a dedicated sk-doc skill README asset with references from sk-doc docs and tests. |
| 3 | `003-markdown-agent-rename/` | Draft | Rename create-agent identity to markdown-agent identity across runtime agent mirrors and references while preserving `/create:*` commands. |

## 5. Phase Handoffs

| From | To | Handoff Criteria | Verification |
| --- | --- | --- | --- |
| `001-sk-doc-reference-relocation` | `002-sk-doc-skill-readme-asset` | `references/specific` is removed, files are in `references/`, and old path references are gone. | Exact search for `references/specific` returns no implementation-scope hits. |
| `002-sk-doc-skill-readme-asset` | `003-markdown-agent-rename` | Dedicated skill README asset exists and is referenced from sk-doc creation guidance and testing docs. | File exists under `assets/skill/` and references resolve from `SKILL.md`, `references/skill_creation.md`, and manual testing docs. |

## 6. Success Criteria

- Each child phase has Level 2 documentation, a checklist, and a detailed resource map.
- Implementation runs phase-by-phase with explicit verification before handoff.
- Parent validation can locate child phase folders and metadata.

## Related Documents

- `001-sk-doc-reference-relocation/spec.md`
- `002-sk-doc-skill-readme-asset/spec.md`
- `003-markdown-agent-rename/spec.md`
- `graph-metadata.json`
