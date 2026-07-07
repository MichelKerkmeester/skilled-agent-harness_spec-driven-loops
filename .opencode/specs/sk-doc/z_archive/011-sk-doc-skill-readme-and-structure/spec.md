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
    packet_pointer: "skilled-agent-orchestration/z_archive/082-sk-doc-skill-readme-and-structure"
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
| **Status** | Complete |
| **Priority** | P1 |
| **Created** | 2026-05-10 |
| **Phase Count** | 5 |
| **Last Active Child** | `005-deep-review-p1-p2-remediation/` |

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
| 1 | `001-sk-doc-reference-relocation/` | Complete | Move `sk-doc/references/specific` documents to `sk-doc/references` root and update all old-path references. |
| 2 | `002-sk-doc-skill-readme-asset/` | Complete | Analyze skill README conventions and create a dedicated sk-doc skill README asset with references from sk-doc docs and tests. |
| 3 | `003-markdown-agent-rename/` | Complete | Rename create-agent identity to markdown-agent identity across runtime agent mirrors and references while preserving `/create:*` commands. |
| 4 | `004-sk-doc-playbook-markdown-agent-coverage/` | Complete | Add `06--agent-dispatch/` section to the sk-doc manual testing playbook with three scenarios that dispatch `@markdown` across cli-claude-code, cli-codex, and cli-opencode; execute and capture evidence. |
| 5 | `005-deep-review-p1-p2-remediation/` | Complete | Remediate all 7 P1 and 9 P2 findings from the 102 phase-parent deep-review: status sync, handoff documentation, checklist marking, parent-level known-issues register, and SD-019 limitation documentation. |

## 5. Phase Handoffs

| From | To | Handoff Criteria | Verification |
| --- | --- | --- | --- |
| `001-sk-doc-reference-relocation` | `002-sk-doc-skill-readme-asset` | `references/specific` is removed, files are in `references/`, and old path references are gone. | Exact search for `references/specific` returns no implementation-scope hits. |
| `002-sk-doc-skill-readme-asset` | `003-markdown-agent-rename` | Dedicated skill README asset exists and is referenced from sk-doc creation guidance and testing docs. | File exists under `assets/skill/` and references resolve from `SKILL.md`, `references/skill_creation.md`, and manual testing docs. |
| `003-markdown-agent-rename` | `004-sk-doc-playbook-markdown-agent-coverage` | `@markdown` agent is wired across 4 runtime mirrors and routed by orchestrate.md. NOTE: SD-019 surfaced a cli-codex non-interactive @markdown dispatch gap (F-001) — documented as accepted limitation in 005-deep-review-p1-p2-remediation; codex `@markdown` dispatch under `codex exec` falls back to a sub-agent path that hits Gate 3. | `ls .opencode/agents/markdown.md .claude/agents/markdown.md .gemini/agents/markdown.md .codex/agents/markdown.toml` resolves all four. |
| `004-sk-doc-playbook-markdown-agent-coverage` | `005-deep-review-p1-p2-remediation` | Deep-review converged with verdict CONDITIONAL: 0 P0, 7 P1, 9 P2 findings; SD-019 cli-codex `@markdown` dispatch gap surfaced as F-001. | `.opencode/specs/.../102/review/deep-review-dashboard.md` exists; `004/implementation-summary.md` Review Outcome section cites 7 P1 + 9 P2. |

## 6. Success Criteria

- Each child phase has Level 2 documentation, a checklist, and a detailed resource map.
- Implementation runs phase-by-phase with explicit verification before handoff.
- Parent validation can locate child phase folders and metadata.

## Related Documents

- `001-sk-doc-reference-relocation/spec.md`
- `002-sk-doc-skill-readme-asset/spec.md`
- `003-markdown-agent-rename/spec.md`
- `004-sk-doc-playbook-markdown-agent-coverage/spec.md`
- `005-deep-review-p1-p2-remediation/spec.md`
- `graph-metadata.json`

## Known Issues

This packet's deep-review (5 iterations, converged at iter 4, dashboard at `review/deep-review-dashboard.md`) surfaced the following findings. All are tracked here for downstream discoverability.

### Confirmed pre-existing (from `004/implementation-summary.md`)

| ID | Severity | Title | Status |
|----|----------|-------|--------|
| F-001 | P1 | cli-codex non-interactive `@markdown` dispatch via SpawnAgent rejects user-defined agents (SD-019 v1 FAIL) | **Resolved via inline-contract workaround** — codex meta-analysis (2026-05-11) confirmed SpawnAgent runtime allowlist does not propagate `.codex/config.toml` user-defined agents. SD-019 rewritten with inline-contract prompt (forbid SpawnAgent, pre-answer Gate 3 with D-Skip, follow `.codex/agents/markdown.toml` developer_instructions inline). v2 dispatch PASS: 952-byte output, 0 router errors, all 5 BINDING trace lines + `SPAWN_AGENT_USED=no` acknowledged. Real typed-agent dispatch remains upstream-blocked in codex v0.130.0. |
| F-002 | P2 | opencode `--agent general` subagent-fallback message | Accepted — harmless ergonomics noise |
| F-003 | P2 | sk-doc compact-changelog format vs Keep-a-Changelog raw shape mismatch | Documented — sk-doc compact format is canonical |

### Surfaced by 102 phase-parent deep-review (resolved in 005)

| ID | Severity | Resolution |
|----|----------|------------|
| F-000-001 / F-001-001 | P1 | Phase 2 status synced Draft → Complete (this file) |
| F-000-002 / F-003-001 | P1 | Phase 1→2 handoff acceptance evidence added to `002/checklist.md` CHK-003 |
| F-001-005 | P1 | 003→004 handoff row annotated with SD-019 dispatch-gap note (this file) |
| F-003-002 | P1 | 004 REQ-004 partial-objective ambiguity resolved by SD-019 limitation documentation |
| F-004-001 | P1 | 004 completion_pct 90 → 100; open_questions cleared; status Complete |
| F-001-002 | P2 | 004/spec.md status Draft → Complete |
| F-001-003 | P2 | 004/checklist.md items marked with evidence |
| F-001-004 / F-004-002 | P2 | 002/checklist.md frontmatter completion_pct 0 → 100 |
| F-002-001 | P2 | SD-020 session IDs in evidence — accepted runtime metadata, no edit needed |
| F-003-003 / F-004-004 | P2 | Child specs renumbered "N of 3" → "N of 5" |
| F-003-004 | P2 | 003 prior-review cross-reference added (this file) |
| F-004-003 | P2 | This Known Issues section added |

### Phase 3 prior deep-review

The Phase 3 (`003-markdown-agent-rename/`) shipped with its own 4-iteration deep-review. Findings registry at `003/review/deep-review-findings-registry.json`; iteration files at `003/review/iterations/`; final dashboard at `003/review/deep-review-dashboard.md`. All Phase 3 findings were closed during that earlier review; cross-referenced here for completeness.
