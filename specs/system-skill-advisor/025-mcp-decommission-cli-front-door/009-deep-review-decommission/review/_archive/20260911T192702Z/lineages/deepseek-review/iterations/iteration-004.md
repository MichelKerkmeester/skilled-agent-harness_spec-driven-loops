# Iteration 4: D4 Maintainability - the entrypoint map, retained identifiers, and a retired stress suite

## Focus

- **Dimension(s)**: maintainability (primary), correctness
- **Scope investigated**: `.opencode/bin/README.md`, `.opencode/bin/skill-advisor.cjs`, `.opencode/bin/system-skill-advisor-launcher.cjs` (identifier level), the advisor database-directory override in three load sites, `.opencode/skills/system-skill-advisor/runtime/vitest.config.ts`, and the stress suite whose name outlived its referent
- **Brief classes covered**: class 2 (docs that describe something other than what ships), class 4 (commands/claims that fail if run), class 6 (names that outlived their referent: files, variables, headers, comments)
- **Reproduction constraint**: unchanged - read-only probes only

## Scorecard

- Dimensions covered: maintainability, correctness
- Files reviewed: 7
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.15

## Findings

### P0, Blocker

None.

### P1, Required

- **F012**: the bin entrypoint map describes the advisor as a dual-stack MCP surface and prints a CLI dist path that does not exist, `.opencode/bin/README.md:21`, `:39`, `:64`, `:99`, `:100`, `:153`.

  ```
  $ rg -n "mcp-server/dist|MCP" .opencode/bin/README.md | head -6
  21:- The CLI shims run the built daemon-backed CLIs (`code-index` 8 tools, `skill-advisor` 9 tools) against the **same unchanged daemons** the MCP registrations use, a dual-stack surface, not a replacement.
  64:+-- system-skill-advisor-launcher.cjs  # Launches system-skill-advisor MCP, optional model-server supervision
  99:| `system-skill-advisor-launcher.cjs` | Boots the system-skill-advisor MCP child. ...
  100:| `skill-advisor.cjs` | CLI shim for system-skill-advisor. ... runs `mcp-server/dist/mcp-server/skill-advisor-cli.js`. ...
  153:| `node .opencode/bin/system-skill-advisor-launcher.cjs` | CLI | Start the system-skill-advisor MCP server. |
  ```

  Three of these are load-bearing for an operator: line 21 states the shims exist alongside MCP registrations ("a dual-stack surface, not a replacement") when the advisor has exactly one surface; line 99 tells a maintainer the launcher "boots the system-skill-advisor MCP child"; line 100 prints the path the shim runs. That path is dead:

  ```
  $ rg -n "mcpServerDir|cliDist" .opencode/bin/skill-advisor.cjs
  22:const mcpServerDir = path.join(opencodeDir, 'skills', 'system-skill-advisor', 'runtime');
  23:const cliDist = path.join(mcpServerDir, 'dist', 'runtime', 'skill-advisor-cli.js');
  $ ls .opencode/skills/system-skill-advisor/runtime/dist/runtime/skill-advisor-cli.js
  .opencode/skills/system-skill-advisor/runtime/dist/runtime/skill-advisor-cli.js
  ```

  Counterevidence that bounds the severity: the shim itself resolves the live path, so the *command* works. The defect is that the map an operator reads describes a different architecture and a different file. The same file also shows the identifier half of the same problem - the shim's own variable is still `mcpServerDir` while it points at `runtime/` - recorded here rather than as a separate finding because nothing depends on the name.

### P2, Suggestion

- **F013**: the advisor's database-directory legacy fallback is a self-fallback, and its README documents the fallback as working, `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:199`, `runtime/lib/skill-graph/skill-graph-db.ts:271`, `runtime/lib/scorer/projection.ts:58`, `runtime/database/README.md:25`.

  ```
  $ rg -n "DB_DIR" .opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts runtime/lib/skill-graph/skill-graph-db.ts runtime/lib/scorer/projection.ts runtime/database/README.md
  skill-advisor-cli.ts:199:      const configuredDbDir = process.env.SYSTEM_SKILL_ADVISOR_DB_DIR ?? process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
  lib/skill-graph/skill-graph-db.ts:271:  const overrideDbDir = process.env.SYSTEM_SKILL_ADVISOR_DB_DIR ?? process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
  lib/scorer/projection.ts:58:const advisorDbDirOverride = process.env.SYSTEM_SKILL_ADVISOR_DB_DIR ?? process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
  database/README.md:25:... Tests may override the directory with `SYSTEM_SKILL_ADVISOR_DB_DIR`; `SYSTEM_SKILL_ADVISOR_DB_DIR` remains a legacy fallback. ...
  ```

  `X ?? X` can never select a different value, so the documented legacy alias is silently unsupported in all three load sites. Worse, the README's own sentence renders the two variable names identically, which is what a mechanical rename leaves behind when it rewrites both operands of a fallback pair.

  **Provenance (this is not a regression)**: the defect predates the decommission.

  ```
  $ git show ed5f102287:.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts | rg -n "DB_DIR"
  185:      const configuredDbDir = process.env.SYSTEM_SKILL_ADVISOR_DB_DIR ?? process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
  $ git show ed5f102287:.opencode/skills/system-skill-advisor/mcp-server/database/README.md | rg -n "DB_DIR"
  25:... `SYSTEM_SKILL_ADVISOR_DB_DIR` remains a legacy fallback. ...
  ```

  `ed5f102287` is the last commit before this packet's work, so the packet neither introduced nor fixed it. It is reported as a raised defect, in the same spirit as the four red tests phase 007 reported rather than hid, and it is excluded from any regression claim.

- **F014**: a stress suite still carries the retired transport in its name and never runs in the default suite, `.opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/mcp-diagnostics-stress.vitest.ts:2`, `.opencode/skills/system-skill-advisor/runtime/vitest.config.ts:21`.

  ```
  $ head -3 .opencode/skills/system-skill-advisor/runtime/stress-test/skill-advisor/mcp-diagnostics-stress.vitest.ts
  // ───────────────────────────────────────────────────────────────
  // MODULE: sa-027 / sa-028 — MCP Diagnostics Stress Test
  // ───────────────────────────────────────────────────────────────
  ```

  The suite exercises `handleAdvisorStatus` and `handleAdvisorValidate` against the renamed database path (`ADVISOR_DB_RELATIVE_PATH = '.opencode/skills/system-skill-advisor/runtime/database/skill-graph.sqlite'`), so its content is current and only its title is stale. It is outside the default suite because the include glob is scoped to the test tree:

  ```
  $ rg -n "include:|tests/\*\*" .opencode/skills/system-skill-advisor/runtime/vitest.config.ts
  20:    include: [
  21:      'tests/**/*.vitest.ts',
  ```

  This is the retired-coverage question the brief asks about (class 5), answered with evidence rather than inference: the commitment-era test that asserted "MCP diagnostics" semantics was neither deleted nor migrated into the default suite. Its assertions cover daemon-state reporting, which the CLI front door still needs - the same behavior the brief's third verification item asks about. Coverage exists on disk but is not part of any gate that runs.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | `.opencode/bin/README.md:100` vs `.opencode/bin/skill-advisor.cjs:23`; `runtime/database/README.md:25` vs `runtime/skill-advisor-cli.ts:199` | Two live documents state behavior the code does not have. The first is a printed path, the second a documented fallback. |
| checklist_evidence | blocked | hard | target packet has no `checklist.md` | Scheduled for the packet-claims pass (iteration 5). |
| feature_catalog_code | pass | advisory | `.opencode/skills/system-skill-advisor/feature-catalog/feature-catalog.md` (group 6 renamed to `COMMAND SURFACE` per phase 007) | Sampled the catalog index and one leaf; both describe CLI commands. Directory names retained by written decision. |
| playbook_capability | pass | advisory | `.opencode/skills/system-skill-advisor/manual-testing-playbook/` (`native-cli-tools/` leaf inspected) | Procedures cite `node .opencode/bin/skill-advisor.cjs` forms that match the CLI's own usage text; three appended run records keep pre-rewrite quotes as documented. |

## Claim Adjudication

```json
{
  "findingId": "F012",
  "claim": ".opencode/bin/README.md tells operators the advisor's CLI shim is a dual-stack sibling of an MCP surface and that the shim runs mcp-server/dist/mcp-server/skill-advisor-cli.js, while the shim resolves runtime/dist/runtime/skill-advisor-cli.js and no MCP registration exists.",
  "evidenceRefs": [
    ".opencode/bin/README.md:21",
    ".opencode/bin/README.md:99",
    ".opencode/bin/README.md:100",
    ".opencode/bin/skill-advisor.cjs:22-23"
  ],
  "counterevidenceSought": "Verified the shim's real dist path by reading its constants and listing the built file, so the defect is confined to the document rather than the executable. Checked whether the file is historical (it is the folder's README, present-tense, and the only map of the entrypoints). Checked phase 007's exemption list (the file is not in it) and its stated scope (it swept advisor-package and bin-adjacent surfaces; this file is neither swept nor exempted).",
  "alternativeExplanation": "The dual-stack sentence could be read as pre-existing context for code-index, whose daemon still serves both. Partially retained: code-index does remain dual-stack, so the sentence is not false for every shim - but the sentence names `skill-advisor` explicitly in the same breath, and lines 99-100 are advisor-specific and false.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "Downgrade to P2 if the advisor is removed from the dual-stack sentence and lines 64/99/100/153 are corrected while the code-index framing stays.",
  "transitions": [
    { "iteration": 4, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Assessment

- New findings ratio: 0.15 (severity-weighted new 7.0 over cumulative 46.0 - one P1 at 5.0 plus two P2 at 1.0 each)
- Dimensions addressed: maintainability, correctness
- Novelty justification: the maintainability pass is now yielding naming and provenance items rather than execution defects, which is the expected shape near the end of a residue audit. The two P2s are worth recording precisely because they are the class the brief names (class 6) and because the second one answers the retired-coverage question with evidence.

## Ruled Out

- **The CLI shim being broken by the rename**: `mcpServerDir` resolves to `runtime/` and `cliDist` resolves to the built CLI (verified above). The name is stale; the path is not. Same conclusion for `checkPackageFreshness`, which is imported from the live spec-kit CLI library.
- **`runtime/tests/legacy/advisor-fixtures/`**: the directory is a fixture tree retained by design (advisor fixtures, not transport fixtures); its README documents the fixtures' purpose and contains no transport claim. Not a finding.
- **The advisor's `feature-catalog/mcp-surface/` and `manual-testing-playbook/native-mcp-tools/` directory names**: retained by a written decision with a stated cascade cost (leaf manifests, aliases, resource map). Re-checked in this pass; the decision still has a reason, so the names stay out of the finding set.
- **`LEGACY_TOOL_BRIDGE` / `MCP_SHAPE` intent vocabulary in the advisor's reference tree**: covered by the same written decision (frontmatter trigger phrases kept as search aliases except those literally containing "MCP server"). The one alias that survives in `runtime/handlers/skill-graph/README.md:6` ("skill graph MCP tools") is therefore an intentional survivor, not a finding.

## Dead Ends

- **Measuring whether the retired bridge suites' coverage has a replacement by counting tests**: not possible without executing vitest, and the count itself would not answer the question. The commit message records the accounting ("Twenty-six tested the plugin bridge ... 863 passing, up from 828, with the deleted coverage accounted for rather than quietly dropped"), and the replay pass checks whether that accounting has a home in the packet.

## Recommended Next Focus

Iteration 5 (D3 Traceability, packet and completion claims): the target packet's own state (scaffold docs at Level 1 with `[Phase 9 scope]` placeholders in the parent map), phase 008's unstarted closeout, phase 007's `Zero live hits` claim against this review's line evidence, and the retired-coverage accounting that lives only in a commit message.

Review verdict: CONDITIONAL
