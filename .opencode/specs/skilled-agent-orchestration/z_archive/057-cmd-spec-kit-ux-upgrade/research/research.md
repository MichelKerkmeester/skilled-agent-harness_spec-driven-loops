---
title: "Deep Research Synthesis: SPAR-Kit UX patterns for system-spec-kit"
description: "Final synthesis for packet 057 comparing external SPAR-Kit against internal system-spec-kit across installer, instruction, command, template, tool-discovery, and persona UX axes."
sessionId: "a383574c-2a8d-47ef-a6a9-81ab0eb6d99b"
generation: 1
completedAt: "2026-05-01T11:03:48+02:00"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade"
    last_updated_at: "2026-05-01T11:03:48+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Synthesized research outputs"
    next_safe_action: "Start follow-on packet 058-gate-copy-and-question-budget or validate 061 prerequisites"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/resource-map.md"
      - "research/deep-research-state.jsonl"
    completion_pct: 100
    open_questions:
      - "Locate real fs-enterprises instruction root before 061 implementation"
      - "Run strict-validation baseline before 063 or 069 implementation"
      - "Decide diagnostic tool-ledger ownership before 062 implementation"
    answered_questions:
      - "Q1-Q8 resolved for research purposes"
---
# Deep Research Synthesis: SPAR-Kit UX patterns for system-spec-kit

## 1. Title + Frontmatter

This synthesis completes the 10-iteration deep-research loop for packet `057-cmd-spec-kit-ux-upgrade`.

- **External surface**: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/`
- **Internal surface**: `system-spec-kit`, `.opencode/commands/speckit/`, `.opencode/commands/memory/`, `.opencode/commands/create/`, `.opencode/agents/`, root instruction files
- **Run**: 10 cli-codex / gpt-5.5 / high / fast iterations
- **Outcome**: converged ranked backlog, packets `058-*` through `069-*`

## 2. Executive Summary

- SPAR-Kit is most useful as a UX and ownership-language reference, not as a replacement architecture. Its lifecycle copy, asset-policy vocabulary, and operator-visible ledgers translate well; its tiny artifact model does not.
- Adoption verdict counts: `adopt-as-is`: 1, `adapt`: 6, `inspired-by`: 1, `reject-with-rationale`: 4.
- The highest-confidence immediate packet is `058-gate-copy-and-question-budget`: adapt SPAR's blocker-vs-refinement follow-up split into `Required To Proceed` and `Optional Refinements`.
- The highest-impact architectural packet is `061-declarative-ownership-manifest`: reuse SPAR policy vocabulary (`managed_block`, `seed_if_missing`, `replace`, `replace_managed_children`) as inventory and lint before any installer behavior.
- All six requested axes have evidence-backed findings. Remaining gaps are implementation prerequisites: locate the real `fs-enterprises` instruction root, baseline strict validation before template migration, and decide ownership for the future diagnostic tool ledger.

## 3. Research Charter

**Topic**: Compare external SPAR-Kit by jed-tech, npm `@spar-kit/install` Beta1, against internal `system-spec-kit` and produce ranked, evidence-backed UX and orchestration patterns.

**Axes covered**:

1. Installer and multi-target distribution: SPAR `@spar-kit/install` target configs vs internal manual/runtime installation.
2. Instruction-file management: SPAR managed blocks and 60-line warning vs internal hand-edited `AGENTS.md` / `CLAUDE.md` surfaces.
3. Command/skill granularity: SPAR Specify / Plan / Act / Retain vs internal `/speckit:*`, `/memory:*`, `/create:*`, suffixes, and command YAMLs.
4. Template architecture: SPAR two-template and asset-policy model vs internal CORE + ADDENDUM + level template tree.
5. Tool-discovery UX: SPAR `.spar-kit/.local/tools.yaml` vs internal skill-advisor, MCP routing, Code Mode, and native tool schemas.
6. Personas and UX tone: SPAR persona research and follow-up budgeting vs internal senior-engineer voice, consolidated-question protocol, and role-based agents.

**Success criteria copied from `spec.md` Section 3 In Scope and Section 5**:

- Produce 10-20 ranked recommendations.
- Cover all six axes with at least one finding.
- Cite at least one external path and one internal path per finding.
- Tag every finding as `adopt-as-is`, `adapt`, `inspired-by`, or `reject-with-rationale`.
- Assign each finding a follow-on packet.

## 4. Methodology

The loop ran 10 cli-codex / gpt-5.5 / high / fast iterations with fresh context per iteration and externalized state under `research/`.

- Iterations 1-5 performed axis-specific comparison: installer/commands, instruction files, templates, tool discovery, and personas/tone.
- Iterations 6-8 synthesized ranked adoption candidates and risk constraints.
- Iteration 9 revalidated source paths, answered Q1-Q8, and refined the command taxonomy boundary.
- Iteration 10 finalized axis coverage, ranked findings, thin-evidence notes, and follow-on packet ordering.

State was externalized in `research/deep-research-state.jsonl`, per-iteration markdown files, and `research/deep-research-strategy.md`. The reducer-owned `findings-registry.json` remained empty, so the iteration narratives are the source of truth for this synthesis.

## 5. Coverage Map

| Axis | Findings | Evidence depth | Gaps |
| --- | ---: | --- | --- |
| 1. Installer and multi-target distribution | 2 | High for SPAR target configs and internal runtime complexity | Runtime-target implementation should wait for ownership manifest |
| 2. Instruction-file management | 2 | Medium-high for Public and Codex files; Barter seen in iterations | Real `fs-enterprises` root not visible in this workspace |
| 3. Command/skill granularity | 2 | High for SPAR phase skills and internal command docs/YAML concepts | Full compatibility matrix deferred to `060-*` |
| 4. Template architecture | 2 | High for SPAR templates and internal composer/validator constraints | Strict-validation corpus baseline deferred to `063-*` / `069-*` |
| 5. Tool-discovery UX | 2 | High for SPAR ledger and internal advisor/MCP discovery | Ledger ownership decision deferred to `062-*` |
| 6. Personas and UX tone | 3 | High for SPAR persona file and internal voice/agent surfaces | Personas need evaluation fixtures, not runtime injection |

## 6. Findings Index

| ID | Axis | Verdict tag | Title | Risk | Follow-on packet |
| --- | --- | --- | --- | --- | --- |
| F-057-001 | 6 | `adapt` | Convert SPAR follow-up budgeting into Required vs Optional questions | Low | `058-gate-copy-and-question-budget` |
| F-057-002 | 3 | `adopt-as-is` | Add phase-boundary copy to command docs | Low | `059-phase-boundary-copy-pass` |
| F-057-003 | 3 | `adapt` | Use a four-axis command taxonomy, not a two-axis collapse | Medium | `060-command-taxonomy-and-compatibility-matrix` |
| F-057-004 | 1, 2, 4 | `adapt` | Build a declarative ownership manifest from SPAR policy vocabulary | Medium-high | `061-declarative-ownership-manifest` |
| F-057-005 | 5 | `adapt` | Add an operator-visible diagnostic tool ledger | Medium | `062-tool-discovery-ledger` |
| F-057-006 | 4 | `adapt` | Inventory templates by role before manifesting them | Medium | `063-template-inventory-and-manifest` |
| F-057-007 | 1 | `adapt` | Prototype runtime target manifests after ownership semantics | Medium-high | `064-runtime-target-manifest` |
| F-057-008 | 6 | `inspired-by` | Use SPAR personas as evaluation fixtures and audience maps | Low | `065-persona-evaluation-fixtures` |
| F-057-009 | 5 | `reject-with-rationale` | Reject static tools.yaml as routing authority | Low | `066-tool-discovery-authority-boundary` |
| F-057-010 | 2 | `reject-with-rationale` | Reject hard global instruction-file line caps | Low | `067-generated-block-budget` |
| F-057-011 | 6 | `reject-with-rationale` | Reject named personas inside runtime prompts | Low | `068-runtime-persona-boundary` |
| F-057-012 | 4 | `reject-with-rationale` | Reject SPAR's two-template consumer architecture | Medium | `069-template-compression-boundary` |

## 7. Detailed Findings
