# Iteration 006 - Adversarial Re-verification and Least-covered Re-pass

## Dimension(s)

Cross-cutting re-verification across correctness, security, traceability, and maintainability. Dimension coverage remains unchanged at 4/4; this pass ages coverage from 0 to 1.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:14`
- `opencode.json:19`
- `.codex/config.toml:9`
- `.gemini/settings.json:26`
- `.claude/settings.local.json:30`
- `.claude/mcp.json:10`
- `.mcp.json:11`
- `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:50`
- `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/handlers/scan.js:18`
- `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/handlers/verify.js:12`
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:55`
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:200`
- `.opencode/skills/deep-review/scripts/reduce-state.cjs:1172`
- `.opencode/skills/deep-review/scripts/reduce-state.cjs:1244`
- `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:56`
- `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:56`
- `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml:67`
- `.opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml:53`
- `.opencode/agents/deep-review.md:318`
- `.opencode/agents/deep-research.md:91`
- `.opencode/agents/orchestrate.md:96`
- `.opencode/install_guides/SET-UP - AGENTS.md:514`
- `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/intent-classifier.js:168`
- `.opencode/skills/system-spec-kit/mcp_server/dist/scripts/tests/resource-map-extractor.vitest.js:29`
- `.opencode/skills/system-spec-kit/mcp_server/dist/skill_advisor/tests/fixtures/lifecycle/index.d.ts:14`

## Findings by Severity

### P0-001 [P0] Live runtime still uses stale generated code-graph scope globs

- Status: Re-verified, unchanged.
- File: `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13`
- Evidence: Source is plural at `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:14-18`, but generated runtime output still excludes `**/.opencode/agent/**` and `**/.opencode/command/**` at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-17`.
- Runtime trace: OpenCode, Codex, Gemini, Claude, and generic MCP configs all launch `node .../dist/context-server.js` (`opencode.json:19-23`, `.codex/config.toml:9-11`, `.gemini/settings.json:26-30`, `.claude/mcp.json:10-14`, `.mcp.json:11-15`). The dist server imports code-graph modules from dist paths (`dist/context-server.js:50`, `dist/code_graph/handlers/scan.js:18`, `dist/code_graph/handlers/verify.js:12`). I found no decisive proof that runtime loads `index-scope-policy.ts` directly.
- Confidence: 0.97.
- Finding class: cross-consumer.
- Recommendation: Rebuild `mcp_server/dist` from TypeScript and add a release guard that fails on singular `.opencode/(skill|agent|command)/` literals in live generated runtime outputs, with explicit fixture/history allowlists.

### P1-012 [P1] Confirm-mode deep-loop command workflows also invoke retired `sk-deep-*` paths

- Status: New.
- File: `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:56`
- Evidence: The existing P1-002 covers auto-mode command YAML, but the live confirm-mode assets still point at non-existent skill IDs and reducer paths: `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:56-64`, `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:829`, `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:1050`, `.opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml:53-62`, `.opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml:672`, and `.opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml:834`.
- Impact: `/speckit:deep-review:confirm` and `/speckit:deep-research:confirm` can fail the same way as the auto workflows if invoked after the skill rename. This is a live workflow surface, not a doc-only citation.
- Finding class: cross-consumer.
- Scope proof: `rg -n 'sk-deep-(review|research)' .opencode/commands/speckit/assets/*deep*_{auto,confirm}.yaml` shows both auto and confirm assets still carry stale paths.
- Recommendation: Patch auto and confirm command assets together, then dry-run both modes for deep-review and deep-research.

### P1-005 [P2] Deep-loop artifact resolver accepts malformed `spec_folder` values

- Status: Downgraded from P1 to P2.
- File: `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:200`
- Evidence: `resolveArtifactRoot()` lexically resolves the raw argument with `path.resolve(specFolder)` and joins `{mode}` under it (`review-research-paths.cjs:200-203`). `reduce-state.cjs` then writes the emitted resource map to `path.join(reviewDir, 'resource-map.md')` (`reduce-state.cjs:1172-1179`, `reduce-state.cjs:1244`).
- Attack matrix:
  - Empty string: resolves to workspace root, projected write `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/review`.
  - Whitespace: resolves to a literal whitespace-named folder under workspace, projected write `<workspace>/   /review`.
  - `..`: resolves to `/Users/michelkerkmeester/MEGA/Development/Code_Environment`, projected write `/Users/michelkerkmeester/MEGA/Development/Code_Environment/review`.
  - Absolute path: resolves to that absolute path, projected write `/tmp/hostile-spec/review`.
  - Symlink: lexical artifact path stays under the symlink path; real filesystem writes follow the symlink target's `review/` directory.
  - Glob: resolves literally to `<workspace>/.opencode/specs/*/review`.
  - Template literal: resolves literally to `<workspace>/{spec_folder}/review` or `<workspace>/${spec_folder}/review`.
- Adjudication: These malformed cases can redirect the whole artifact root, so the guard is still worth adding. Under this iteration's escalation rule, I did not find a non-empty case that causes the reducer to write outside the resolver's own computed artifact root. That makes this defense-in-depth rather than P0/P1.
- Finding class: cross-consumer.
- Recommendation: Reject empty, whitespace-only, traversal, absolute-outside-specs, glob, template-placeholder, and symlinked `spec_folder` values before artifact resolution; enforce realpath containment under `.opencode/specs/`.

### Existing P1 Findings Re-verified

- P1-002 remains open for auto-mode command YAML drift: `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:56`, `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml:67`.
- P1-008 remains open for OpenCode leaf-agent mirrors: `.opencode/agents/deep-review.md:318`, `.opencode/agents/deep-research.md:91`.
- P1-011 remains open for orchestrator routing: `.opencode/agents/orchestrate.md:96`.
- P1-010 remains open, but the requested exact tautology sweep found only prior review logs, not additional active canonical surfaces.

### Existing P2 Findings Re-verified

- Build hygiene drift is broader than the original code-graph runtime file: 11 generated dist files still contain singular `.opencode/(skill|agent|command)/` literals. Key examples include `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/intent-classifier.js:168`, `.opencode/skills/system-spec-kit/mcp_server/dist/scripts/tests/resource-map-extractor.vitest.js:29`, and `.opencode/skills/system-spec-kit/mcp_server/dist/skill_advisor/tests/fixtures/lifecycle/index.d.ts:14`.
- Source singular-root sweep across `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/`, `mcp_server/lib/spec/`, `mcp_server/lib/deep-loop/`, `mcp_server/skill_advisor/scripts/`, and `mcp_server/lib/storage/` found no singular `.opencode/(skill|agent|command)/` hits.

## Traceability Checks

| Check | Result | Evidence |
| --- | --- | --- |
| P0 runtime authority | fail | Runtime configs point to `dist/context-server.js`; dist code-graph handlers import `dist/.../index-scope-policy.js`; source `.ts` is not the runtime entry. |
| Artifact resolver escalation | partial | Malformed inputs redirect artifact roots, but no non-empty case escaped the resolver's computed artifact root under the prompt's rule. |
| `sk-deep-*` sweep | fail | Auto and confirm workflow YAML, OpenCode leaf-agent mirrors, orchestrator routing, and setup docs all retain retired IDs. |
| Tautology sweep | pass | Requested exact regexes found only prior review logs, not additional active canonical surfaces. |
| Build hygiene | fail | 11 generated dist files still contain singular-root literals; sampled source directories are plural-clean. |
| Coverage accounting | pass | No new dimension coverage was added; coverage age increments to 1. |

## Verdict

FAIL. P0-001 remains active with high confidence, and the confirm-mode YAML sweep adds one new P1 sibling. P1-005 is downgraded to P2 because the adversarial matrix did not meet the prompt's P0 escalation threshold.

## Next Dimension

Iteration 7 should be a closure and synthesis-prep pass: re-run targeted checks after any remediation, confirm whether P1-012 is fixed together with P1-002, verify P1-005 has containment tests if remediated, and prepare the final FAIL synthesis if P0-001 remains open.
