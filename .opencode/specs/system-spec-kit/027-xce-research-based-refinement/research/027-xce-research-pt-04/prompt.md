You are auditing alignment between a planned multi-phase packet and the CURRENT state of the codebase. **READ-ONLY ANALYSIS. NO CODE CHANGES. NO FILE WRITES.** Your stdout becomes the report.

## Packet under audit
`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/` — phase parent with 11 children (001-011), scaffolded 2026-05-08, last spec update 2026-05-10. Status: `planned`, completion_pct: 0. Total ~4,580-6,440 LOC. Today is 2026-05-11.

## Why this audit
26+ commits shipped between 2026-05-08 and today. The user wants to know: **are all 11 planned phases still aligned with the current database/graph systems, and is this still the best course of action?** Or has the codebase moved past what these phases assume?

## Inputs to READ (read-only sandbox)
1. **Parent + 11 children**: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md` and `{001..011}-*/spec.md` + `plan.md` + `decision-record.md` (where present) + `amendments-applied.md` (002-006).
2. **Research syntheses**:
   - `research/027-xce-research-pt-01/research.md` + `findings.md` + `sub-packet-proposals.md`
   - `research/027-xce-research-pt-02/research.md` + `sub-packet-amendments.md`
   - `research/027-xce-research-pt-03/research.md`
3. **External XCE materials**: `external/xce-mcp/README.md` (skip image assets).
4. **Current code_graph module**: `.opencode/skills/system-spec-kit/mcp_server/code_graph/` — every file in `lib/`, `handlers/`, `tools/`. Especially: `code-graph-context.ts`, `code-graph-db.ts`, `indexer-types.ts`, `query-intent-classifier.ts`, `cross-file-edge-resolver.ts`, `budget-allocator.ts`, `startup-brief.ts`, `readiness-contract.ts`.
5. **Current skill_advisor module**: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/` — especially `render.ts`, `scorer/`, `generation.ts`, `prompt-cache.ts`, `prompt-policy.ts`, `metrics.ts`, `skill-advisor-brief.ts`, `freshness.ts`.
6. **Current mcp-coco-index skill**: `.opencode/skills/mcp-coco-index/` — `mcp_server/`, `scripts/`, `SKILL.md`, `CHANGELOG.md`.
7. **Database/graph directory**: `.opencode/skills/system-spec-kit/mcp_server/database/README.md` + sibling sqlite files (note presence/size).
8. **Memory backend**: `.opencode/skills/system-spec-kit/mcp_server/lib/memory/` and `mcp_server/lib/eval/` and `mcp_server/lib/causal/` if present.
9. **Recent git log**: `git log --since="2026-05-08" --pretty=format:"%h %ad %s" --date=short` and `git log --since="2026-05-08" --stat` for commits touching `mcp_server/`, `skills/mcp-coco-index/`, `skills/system-spec-kit/mcp_server/skill_advisor/`, `skills/system-spec-kit/mcp_server/code_graph/`.

## Heuristic for "stale"
A phase is potentially stale if any of these is true:
- A file the phase plans to modify has been renamed/deleted/refactored since 2026-05-08.
- A sibling packet (012 causal-graph, 010 template-levels, 028→103 :auto contract, 013 doctor, 100 multi-ai-council, sk-code v3.x, deep-ai-council v1.1) **already solves** part of the phase's stated problem.
- The phase's risk register cites a constraint that has since been mitigated.
- The phase's research evidence cites a file:line that no longer matches (line drift OK; file-missing or symbol-renamed = stale).
- The phase's dependency target (e.g., "Phase 001 must ship before this") is itself questionable — e.g., upstream cocoindex-code has moved past v0.2.33, making the planned baseline already stale.

## Required output sections (use this exact structure)

### 1. Executive verdict (≤150 words)
Per-phase one-liner: `KEEP_AS_IS | REVISE_SCOPE | MERGE | DEFER | CANCEL`, then a single recommended next action.

### 2. Per-phase audit (001..011)
For each phase emit:
- **Phase NNN — <title>** | Verdict
- Target-file existence check (file path → exists/renamed/missing)
- Scope-drift flag (overlap with shipped packets, with commit hash)
- Risk-register validity (still relevant? mitigated by shipped work?)
- Dependency-graph validity (e.g., 007/010/011 depend on 001 — still right?)
- Specific edit recommendation (1-3 sentences)

### 3. Cross-packet overlap matrix
Table: 027 phase vs shipped sibling (012, 010, 028→103, 013, 100, sk-code v3.x, deep-ai-council v1.1, 060 @agent improver, 059 @code). Mark `OVERLAP_HIGH | OVERLAP_LOW | NO_OVERLAP | SUPERSEDED`. One sentence per OVERLAP_HIGH or SUPERSEDED cell.

### 4. CocoIndex v0.2.33 baseline reality check (Phase 001-specific)
- Where is the partial soft-fork now? Compare `.opencode/skills/mcp-coco-index/mcp_server/` to the planned-fork baseline.
- Has upstream cocoindex-code moved past v0.2.33? (Best inference from `external/cocoindex-code-main/`.)
- Is the "complete fork" still the right prerequisite, or is incremental sync now feasible?

### 5. Re-prioritization proposal
Ranked list with rationale: which phases to ship first, which to defer, which to cancel, which to merge.

### 6. Open questions for the user
A short list (≤6) of items requiring human judgement before resuming work.

## Constraints
- ≤2500 words.
- File:line citations for every concrete claim. Format: `path/to/file.ts:LNN`.
- No code suggestions — audit only.
- If something is uncertain, mark "UNCERTAIN" and explain what would resolve it.
- Do not invent symbols/files that you have not read. If a tool call returns empty, say so.

Begin.
