# Iteration 005 - D4 Maintainability deep pass

## Dimension

Maintainability. This pass audited post-rename documentation casualties, dead `sk-deep-*` references outside the already-covered command and deep-loop leaf-agent paths, packet 096 parent/child doc anchors, requested active docs/scripts/workflow surfaces, source-vs-dist rebuild hygiene, and the skill naming convention.

## Files Reviewed

- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-strategy.md:29`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-state.jsonl:5`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/spec.md:70`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/resource-map.md:20`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/resource-map.md:75`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/resource-map.md:122`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/spec.md:54`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/spec.md:57`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/tasks.md:60`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/002-agents/spec.md:54`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/002-agents/spec.md:57`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/002-agents/spec.md:161`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/003-commands/spec.md:57`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/spec.md:117`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/checklist.md:47`
- `.opencode/agents/orchestrate.md:96`
- `.opencode/skills/deep-research/SKILL.md:2`
- `.opencode/skills/deep-review/SKILL.md:2`
- `.opencode/install_guides/SET-UP - AGENTS.md:514`
- `.opencode/install_guides/SET-UP - AGENTS.md:515`
- `.opencode/install_guides/SET-UP - AGENTS.md:1203`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:15`
- `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:14`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:235`
- `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/intent-classifier.js:168`
- `.opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:290`
- `.opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/data/ground-truth.json:290`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json:1`

Additional checks:

- Ran targeted stale `sk-deep-*` grep excluding the known command YAML and deep-loop leaf-agent hot paths.
- Ran requested active-surface singular-root sweep over `.opencode/scripts/`, `.opencode/skills/system-spec-kit/scripts/`, `.github/workflows/`, root README/CONTRIBUTING/PUBLIC_RELEASE/DEPLOYMENT/AGENTS/CLAUDE files, and top-level scripts.
- Ran recursive strict validation samples for packet 096 parent and `004-symlinks`; parent still exits 2 with `SPEC_DOC_SUFFICIENCY`, child still exits 2 with `ANCHORS_VALID` and `SPEC_DOC_SUFFICIENCY`.
- Ran a local markdown link/anchor checker over 22 packet 096 markdown files; it found 0 ordinary markdown missing-file or missing-anchor issues.
- Sampled source/dist pairs across `code_graph/lib`, `mcp_server/lib/deep-loop`, `mcp_server/lib/spec`, `mcp_server/lib/search`, and eval data for singular-vs-plural drift.

## Findings by Severity

### P0

#### P1-001 [P0] Live runtime uses stale generated code-graph scope globs after plural rename

- Status this iteration: Carry-forward, broadened by maintainability scope. Source/dist sampling confirms the code-graph runtime drift remains the only sampled generated drift with direct behavioral scope, but it is not the only generated singular-root artifact.
- Evidence refs: `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:15`, `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:14`, `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.d.ts:10`.
- Recommendation: Rebuild `mcp_server/dist` and add a guard that fails on `.opencode/(skill|agent|command)/` in generated runtime outputs unless the match is explicitly allowlisted as historical or fixture-only.

### P1

#### P1-010 [P1] Packet 096 active specs were bulk-rewritten into plural-to-plural requirements

- Claim: Packet 096's active parent/child docs no longer preserve the old-root -> new-root intent. Bulk replacement rewrote narrative requirements into tautologies such as `.opencode/skills/ -> .opencode/skills/`, while nearby prose still says the repo used the singular root.
- Evidence refs: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/spec.md:70`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/spec.md:54`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/spec.md:57`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/spec.md:81`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/002-agents/spec.md:57`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/003-commands/spec.md:57`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/resource-map.md:20`.
- Evidence: The child specs still describe a singular-to-plural migration, but their path literals now show plural on both sides. The resource map has the same tautological phase headings for skills, agents, and commands.
- Impact: Maintainers cannot reconstruct what packet 096 actually changed from the current active spec docs. This is a required spec maintenance failure, not harmless wording, because the active packet is already failing strict validation and its requirements/resource-map evidence are now self-contradictory.
- Finding class: matrix/evidence.
- Recommendation: Restore old-root literals where the docs describe prior state, keep new-root literals where they describe target state, and add a post-bulk-rewrite doc guard for `\.opencode/(skills|agents|commands)/\s*(->|→)\s*\.opencode/\1/`.

```json
{
  "claim": "Packet 096's active parent, child specs, tasks, and resource map were bulk-rewritten so old-to-new rename requirements now read as plural-to-plural tautologies.",
  "evidenceRefs": [
    ".opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/spec.md:70",
    ".opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/spec.md:54",
    ".opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/spec.md:57",
    ".opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/resource-map.md:20"
  ],
  "counterevidenceSought": "Checked packet 096 parent plus 001/002/003/004 child docs and resource-map; ordinary markdown links are not broken, but semantic old->new rename anchors are corrupted.",
  "alternativeExplanation": "The target filesystem is already plural, but historical/source-state prose must preserve singular literals to remain auditable.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade only if packet 096 docs are explicitly reclassified as non-authoritative scratch history."
}
```

#### P1-011 [P1] Active orchestrator routing table still names non-existent `sk-deep-research`

- Claim: Outside the already-covered command YAML and deep-loop leaf-agent bodies, the active OpenCode orchestrator still advertises `sk-deep-research` as the skill for evidence/iterative investigation.
- Evidence refs: `.opencode/agents/orchestrate.md:96`, `.opencode/skills/deep-research/SKILL.md:2`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json:1`.
- Evidence: The current skill folder/name is `deep-research`, and the skill graph classifies `deep-research`/`deep-review` under the `deep-loop` family. The orchestrator table alone keeps the retired `sk-deep-research` ID in its skill column.
- Impact: `@orchestrate` is the senior routing surface. A stale skill name here can route maintainers and agents toward a non-existent skill even after the command-owned paths are fixed.
- Finding class: cross-consumer.
- Recommendation: Replace `sk-deep-research` with `deep-research` in `.opencode/agents/orchestrate.md`, then verify OpenCode/Claude/Gemini/Codex orchestrator mirrors if this agent is mirrored.

```json
{
  "claim": "The active orchestrator agent still routes iterative investigation to a retired sk-deep-research skill ID.",
  "evidenceRefs": [
    ".opencode/agents/orchestrate.md:96",
    ".opencode/skills/deep-research/SKILL.md:2",
    ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json:1"
  ],
  "counterevidenceSought": "Excluded already-known command YAML and deep-loop leaf-agent paths, then checked current SKILL.md names and skill graph families.",
  "alternativeExplanation": "The stale value is in a routing table rather than an import, but this is an active agent instruction surface.",
  "finalSeverity": "P1",
  "confidence": 0.87,
  "downgradeTrigger": "Downgrade if orchestrate.md is proven obsolete and not consumed by any active runtime."
}
```

### P2

#### P2-007 [P2] Setup guide skill inventory still advertises retired `sk-deep-*` names

- Claim: The active AGENTS setup guide still lists `sk-deep-research` and `sk-deep-review`, even though current `SKILL.md` names and the skill graph use `deep-research` and `deep-review`.
- Evidence refs: `.opencode/install_guides/SET-UP - AGENTS.md:514`, `.opencode/install_guides/SET-UP - AGENTS.md:515`, `.opencode/install_guides/SET-UP - AGENTS.md:1203`, `.opencode/skills/deep-review/SKILL.md:2`, `.opencode/skills/deep-research/SKILL.md:2`.
- Impact: Lower than P1-011 because this is setup documentation, but it is an active install/routing reference and can mislead skill installation or auditing.
- Finding class: matrix/evidence.
- Recommendation: Update the setup guide inventory to `deep-research`/`deep-review` and reconcile the summary count/list with the current skill roots.

#### P2-008 [P2] Generated dist drift is broader than code-graph/tests-only framing

- Claim: Source/dist drift is not isolated to the known code-graph runtime file and generated test fixtures. Sampled non-test generated artifacts in `dist/lib/search` and `dist/lib/eval/data` also retain singular-root references after their source files moved to plural.
- Evidence refs: `.opencode/skills/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:235`, `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/intent-classifier.js:168`, `.opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:290`, `.opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/data/ground-truth.json:290`.
- Impact: The newly sampled examples are lower-risk than P0-001: one is a generated comment and one is eval/ground-truth data. Still, they show the rebuild hygiene issue is broader than `code_graph/` and test fixtures, so a remediation scoped only to the P0 file can leave generated artifacts stale.
- Finding class: matrix/evidence.
- Recommendation: Rebuild the whole `mcp_server/dist` tree after source fixes, then run a generated-artifact singular-root grep with fixture/history allowlists.

## Traceability Checks

| Check | Status | Evidence |
|---|---|---|
| Doc anchors and dead refs | fail | Active packet 096 docs contain plural-to-plural rename tautologies in parent, `001-skills`, `002-agents`, `003-commands`, and `resource-map.md`. Ordinary markdown link/anchor checker found 0 missing links/anchors across 22 files. |
| Active singular-root sweep | partial | Requested surfaces `.opencode/scripts/`, `.opencode/skills/system-spec-kit/scripts/`, `.github/workflows/`, and root docs/scripts had no new singular `.opencode/(skill|agent|command)/` hits beyond already-known install/Barter/dist surfaces. Stale `sk-deep-*` IDs remain in orchestrator and setup docs. |
| Source/dist rebuild hygiene | fail | `code_graph/lib/index-scope-policy.ts` is plural while `dist/code_graph/lib/index-scope-policy.js` remains singular; sampled `dist/lib/search/intent-classifier.js` and `dist/lib/eval/data/ground-truth.json` also lag their plural source counterparts. |
| Maintenance guard | fail | No existing sampled guard catches semantic tautologies or generated singular-root drift. Smallest guard: CI/pre-commit grep for `.opencode/(skill|agent|command)/` outside allowlisted historical fixtures plus a tautology grep for plural->same-plural arrows in spec docs, and require `npm run build` before commits touching `mcp_server/lib`, `mcp_server/code_graph`, or `mcp_server/skill_advisor`. |
| Naming consistency | pass | Mixed `sk-*`, `cli-*`, `mcp-*`, `deep-*`, and `system-*` prefixes appear intentional in `skill-graph.json` families and current `SKILL.md` names. The drift is stale references to retired names, not the naming scheme itself. |
| Packet 096 validation | fail | Parent strict validation still exits 2 with `SPEC_DOC_SUFFICIENCY`; `004-symlinks` exits 2 with `ANCHORS_VALID` and `SPEC_DOC_SUFFICIENCY`. |

Ruled out:

- No ordinary markdown missing-file or missing-anchor issues were found in packet 096's 22 markdown files by the local link/anchor checker.
- No new singular-root hits were found in `.opencode/scripts/`, `.opencode/skills/system-spec-kit/scripts/`, `.github/workflows/`, root README/CONTRIBUTING/PUBLIC_RELEASE/DEPLOYMENT/AGENTS/CLAUDE files, or top-level scripts.
- The mixed skill naming pattern is intentional per `skill-graph.json` families; the accidental drift is limited to retired `sk-deep-*` references.

## Verdict

FAIL, `hasAdvisories=true`.

D4 is covered, but the review still cannot converge to pass because the active P0 remains and maintainability added two P1s. The most important D4 issue is that packet 096's own spec artifacts were rewritten by the rename pass, so the active documentation no longer accurately describes the old-to-new migration it is supposed to verify.

## Next Dimension

Iteration 6 should perform an adversarial re-verification pass focused on the highest-impact candidates before synthesis: P0-001 generated runtime drift, P1-010 semantic doc corruption, P1-011/P1-008/P1-002 stale `sk-deep-*` routing, and the proposed guard coverage. Re-run targeted source/dist and stale-reference greps after any remediation if fixes land between iterations.
