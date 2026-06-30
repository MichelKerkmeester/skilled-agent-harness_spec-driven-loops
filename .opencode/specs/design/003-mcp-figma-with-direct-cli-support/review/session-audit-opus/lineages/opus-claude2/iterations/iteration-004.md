# Iteration 004 — Maintainability

**Dimension**: D4 Maintainability
**Focus files**: `graph-metadata.json`, references, house-voice consistency
**Session**: fanout-opus-claude2-1781464600582-ntawto

## Scope

Structure parity with siblings, metadata hygiene, documentation discipline, and ease of safe follow-on changes.

## What I checked

- **Source-drift discipline (positive).** `tool_surface.md:16` and `feature_catalog.md:17` repeatedly hedge the command surface as source-scanned, not live-verified, and instruct `<bin> <command> --help` before relying on any verb. This is the correct posture for a fast-drifting upstream and prevents stale-command rot. [SOURCE: .opencode/skills/mcp-figma/references/tool_surface.md:16]
- **graph-metadata.json (positive).** Schema-2, well-formed, `causal_summary` carries the naming trap and daemon model; edges are clean and reciprocated. [SOURCE: .opencode/skills/mcp-figma/graph-metadata.json:2]
- **Structure parity.** SKILL.md / four references / feature_catalog / playbook / README / INSTALL_GUIDE / changelog matches the sibling terminal-control shape (REQ-005).

## Findings

### F-OPUS-006 (P2, maintainability) — house-voice divergence (em dashes) raises follow-on-edit cost
Independent of the false claim in F-OPUS-003, the substantive style divergence itself is a maintainability cost: 31 em dashes in SKILL.md and em dashes across 15 markdown files, versus 0 in both named siblings. A future contributor matching the figma skill's style will propagate non-house punctuation; one matching the siblings will diverge from the figma skill. The two should be reconciled. This is the cosmetic substrate of F-OPUS-003 (which scores the false *verification claim* at P1); the style itself is P2.
[SOURCE: .opencode/skills/mcp-figma/SKILL.md:14]

### Claim adjudication
No new P0/P1 this iteration.

## Coverage

- Dimensions covered: D1, D2, D3, D4 (all 4 complete)
- New findings this iteration: 1 (P2)
- newFindingsRatio: 0.08

Review verdict: PASS
