# AI Council Strategy: System Code Graph Reference Template Alignment Audit

## Charter

**Purpose**: Audit the completed system-code-graph documentation/reference-template alignment work (packet 022-reference-template-alignment) to verify correctness, completeness, scope safety, and navigation integrity.

**Task Framing**: The Codex agent completed a documentation-only reference reorganization: moved 8 canonical references into focused snake_case subfolders (`runtime/`, `readiness/`, `config/`, `integrations/`), left compatibility stubs at old root kebab-case paths, and updated `SKILL.md`, `README.md`, and `ARCHITECTURE.md` to point at canonical paths.

## Selected Lenses

| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate |
|------|--------------|-------------------|------------------|
| 001 | Analytical | cli-opencode DeepSeek v4 pro max | Template Compliance: Verify sk-doc reference-template and spec-template alignment risk |
| 002 | Critical | cli-opencode DeepSeek v4 pro max | Router/Navigation Skeptic: Challenge smart-router resource maps, stubs, stale paths, and active docs |
| 003 | Pragmatic | cli-opencode DeepSeek v4 pro max | Preservation/Regression: Look for link breakage, overreach, runtime-behavior risk, and validation gaps |

## Evidence Inputs

- `.opencode/skills/system-code-graph/SKILL.md` — smart router and reference links
- `.opencode/skills/system-code-graph/README.md` — related documents table
- `.opencode/skills/system-code-graph/ARCHITECTURE.md` — active reference links
- `.opencode/skills/system-code-graph/references/runtime/` — 4 canonical runtime references
- `.opencode/skills/system-code-graph/references/readiness/` — 2 canonical readiness references
- `.opencode/skills/system-code-graph/references/config/` — 1 canonical config reference
- `.opencode/skills/system-code-graph/references/integrations/` — 1 canonical integration reference
- `.opencode/skills/system-code-graph/references/*.md` — 8 root compatibility stubs
- Packet spec docs: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md
- Validation evidence: extract_structure.py (19 files PASS), validate_document.py (16 references PASS, skill PASS, readme PASS), quick_validate.py (PASS), rg stale paths (PASS), H2 numbering (PASS), markdown link resolver (PASS), strict spec validation (PASS)

## Convergence Rule

Default: two-of-three-agree. If 2 of 3 seats endorse essentially the same plan after cross-critique, declare convergence.

## Known Constraints

- Scoped-write: `ai-council/**` artifacts only. No implementation changes.
- Single CLI round: all seats dispatched through cli-opencode DeepSeek v4 pro max.
- Planning-only: audit and recommendation, no code/spec modifications outside ai-council.
