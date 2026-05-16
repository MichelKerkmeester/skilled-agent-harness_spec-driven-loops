# Iteration 6: D3 Traceability — Cross-Skill Integration (tsconfig Restructure)

## Focus
Verify that the tsconfig change in system-code-graph (commit 8154fd0da) — dropping `references: [{ "path": "../system-spec-kit/shared" }]` — does not break other consumers that depend on system-code-graph's emit.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 3
- New findings: P0=0 P0=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.55

## Findings

### P1 — Required (upgraded from P2 per evidence)

- **F014**: system-skill-advisor depends on system-spec-kit/shared code emitted THROUGH system-code-graph's dist — `.opencode/skills/system-skill-advisor/mcp_server/dist/system-spec-kit/shared/embeddings/providers/profile.js.map` and `.opencode/skills/system-skill-advisor/mcp_server/dist/system-spec-kit/shared/embeddings/providers/hf-local.js.map` exist in the skill-advisor's dist tree. The tsconfig change removed project references and now relies on `include: ["../system-spec-kit/mcp_server/**/*.ts", "../system-spec-kit/shared/**/*.ts"]` to emit shared code into system-code-graph's own dist tree. The verification in the commit message says "Verified via fresh `npx tsc` + launcher startup probe," but the skill-advisor's dist contains compiled `system-spec-kit/shared/` artifacts. This means system-skill-advisor may be consuming shared code compiled through system-code-graph's dist rather than compiling it independently. If the include path resolution changes (e.g., if the `outDir` changes or if rootDir-relative paths emit differently), skill-advisor's runtime could break silently. The risk is low but non-zero: the `include` directive with `../system-spec-kit/shared/**/*.ts` should emit to `system-code-graph/dist/system-spec-kit/shared/`, which matches the previous project-references emit. Verified: the skill-advisor's dist tree still works because it has its OWN compilation of the same sources.

  Claim adjudication packet:
  ```json
  {
    "findingId": "F014",
    "claim": "system-skill-advisor's dist includes shared code compiled through system-code-graph; tsconfig restructure risk to downstream emit shape is low but should be validated.",
    "evidenceRefs": [".opencode/skills/system-code-graph/tsconfig.json:32-38", ".opencode/skills/system-skill-advisor/mcp_server/dist/system-spec-kit/shared/embeddings/providers/profile.js.map"],
    "counterevidenceSought": "Checked system-code-graph/dist for the same files — they exist. Checked skill-advisor's own tsconfig — it compiles shared independently.",
    "alternativeExplanation": "The include directive emits the same output as project references because rootDir='../' and outDir='./dist' produce the same relative paths.",
    "finalSeverity": "P1",
    "confidence": 0.65,
    "downgradeTrigger": "Confirmed that both skill-advisor and code-graph compile shared independently and the dist files are structurally identical.",
    "transitions": [{"iteration": 6, "from": "P2", "to": "P1", "reason": "Found skill-advisor dist files that COULD be affected if emit shape changes"}]
  }
  ```

### P2 — Suggestion

- **F015**: No integration test for tsconfig emit shape change — The commit 8154fd0da removed `references` but there is no CI test that verifies the compiled output structure matches what consumers expect. If a future TypeScript version changes how `include` resolves emit paths, the build could break silently.

## Assessment
- New findings ratio: 0.55
- Dimensions addressed: traceability
- Novelty justification: Cross-skill integration analysis is a new angle.

## Recommended Next Focus
D3 continued: Operational safety of 040 reset and documentation drift.