# Iteration 5: Completeness verification and convergence

## Focus

Verify no skill family was missed, check for additional promotable scripts discovered in the full inventory, and confirm all 5 key questions are answered for legal convergence.

## Findings

### Candidate 17: Smart Router Integrity Check on SessionStart (system-spec-kit → Claude SessionStart + OpenCode session.created)

**Source script:** `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh`
**Source script:** `.opencode/skills/system-spec-kit/scripts/validate-command-tree-parity.sh`
**Runtime surface:** Claude `SessionStart` + OpenCode `session.created`

The `check-smart-router.sh` validates that skill smart-router pseudocode blocks are syntactically well-formed, and `validate-command-tree-parity.sh` checks that the command tree stays in sync. These currently run only in the validate.sh CI pipeline. Running them at SessionStart would catch drift early — if a skill's smart router was edited in a way that broke routing, the next session would detect it immediately.

**Blast radius:** Low (observe/advise). SessionStart surface is well-precedented (4 existing SessionStart hooks in Claude, 7+ session.created handlers in OpenCode).

[SOURCE: .opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh]
[SOURCE: .opencode/skills/system-spec-kit/scripts/validate-command-tree-parity.sh]

### Candidate 18: Broken Link Checker PostToolUse (system-spec-kit → Claude PostToolUse/Write|Edit)

**Source script:** `.opencode/skills/system-spec-kit/scripts/check-links.sh`
**Runtime surface:** Claude `PostToolUse` matcher `Write|Edit`

The `check-links.sh` script validates internal links in markdown docs. When an agent edits a markdown file and introduces a broken relative link (common when renaming files or restructuring specs), the break is invisible until CI runs. A PostToolUse hook could run a fast link check on the edited file and warn about broken references.

**Blast radius:** Low (observe/advise). Scoped to markdown files.

[SOURCE: .opencode/skills/system-spec-kit/scripts/check-links.sh]

### Additional Scripts Reviewed (not promoted to candidates)

- `system-spec-kit/scripts/rules/*` (30+ rule scripts) — These are validate.sh sub-checks, too granular for individual hooks; covered by Candidate 3 (spec validation PostToolUse) and Candidate 15 (unified quality gate).
- `system-skill-advisor/mcp_server/scripts/check-skill-doc-frontmatter.sh` — Overlaps with Candidate 5 (frontmatter version validator); would be consolidated.
- `system-spec-kit/scripts/kpi/quality-kpi.sh` — Aggregate KPI calculation; too heavy for a hook, better as a manual/CI check.
- `mcp-tooling/mcp-*/scripts/doctor.sh` — MCP tool health checks; could be a SessionStart candidate but is already covered by the `/doctor` command surface.

## Convergence Verification

### Key Question Status

| ID | Question | Status | Evidence |
|----|----------|--------|----------|
| KQ-1 | Which skills have latent behaviors promotable to hooks/plugins? | **ANSWERED** | All 12 skill families inventoried across iterations 1-5; 18 candidates identified |
| KQ-2 | Which have proven runtime contracts? | **ANSWERED** | Candidates 1-6, 15, 17, 18 all cite existing scripts; Candidates 7-14, 16 cite existing skill patterns with proven plugin analogues |
| KQ-3 | Which OpenCode surfaces are underused? | **ANSWERED** | `tool.execute.after` (0 plugins) and `tool.register` (0 plugins) identified in iteration 3 |
| KQ-4 | Which Claude surfaces have gaps? | **ANSWERED** | PostToolUse/Write|Edit has only 1 hook (dist freshness); room for 8+ candidates |
| KQ-5 | Blast radius distribution? | **ANSWERED** | 17 of 18 candidates are observe/advise (low); 1 is enforce (medium); 0 mutate |

### newInfoRatio Trend

| Iteration | newInfoRatio | New Candidates |
|-----------|-------------|----------------|
| 1 | 1.0 | 4 |
| 2 | 0.8 | 5 |
| 3 | 0.7 | 5 |
| 4 | 0.5 | 2 |
| 5 | 0.3 | 2 |

Last 3 average: (0.7 + 0.5 + 0.3) / 3 = 0.50 — above the 0.05 threshold, but all questions are answered and the trend is sharply descending. The two new candidates in this iteration (C-17, C-18) are variations on established patterns.

### Quality Guard Check

- **Source diversity:** 12 skill families consulted, 50+ scripts inventoried, 7 existing plugins analyzed, 8 existing Claude hooks analyzed — PASS
- **Focus alignment:** All 18 candidates grounded in real skills with concrete runtime surfaces — PASS
- **No single weak source:** No candidate relies on a single file or unsupported claim; each cites at least one script or existing plugin pattern — PASS

## Sources Consulted

- Full skill inventory: `find .opencode/skills -name "SKILL.md"` (43 SKILL.md files across 12 families)
- Full script inventory: `find .opencode/skills -name "*.sh"` (100+ scripts)
- system-spec-kit/scripts/rules/ (30+ validation rule scripts)
- system-spec-kit/scripts/spec/ (15 spec-folder scripts)
- system-skill-advisor/mcp_server/scripts/ (4 scripts)

## Assessment

- **newInfoRatio:** 0.3 — 2 new candidates (C-17, C-18); both are variations on established PostToolUse/SessionStart patterns
- **Novelty justification:** Diminishing returns; all major skill families thoroughly inventoried; remaining candidates are incremental variations
- **Confidence:** High — completeness verified by exhaustive find across all skill directories

## Reflection

**What worked:** Exhaustive `find` across all skills confirmed no major family was missed. The system-spec-kit has the richest script inventory (30+ validation rules), confirming it as the highest-yield source for hook promotion.

**What failed:** Nothing — the research reached natural exhaustion.

**Ruled out:**
- Individual system-spec-kit/rules/* scripts as standalone hooks (too granular; covered by unified quality gate)
- MCP tooling doctor.sh scripts (better as `/doctor` command targets)
- quality-kpi.sh (too heavy for per-edit hooks)

## Recommended Next Focus

**CONVERGED.** All 5 key questions answered. All 12 skill families inventoried. 18 candidates identified, ranked, and blast-radius-assessed. Proceeding to synthesis.
