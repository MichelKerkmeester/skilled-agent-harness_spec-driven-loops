---
title: "Code Graph 002-015: Remediate Cross-Surface coco/ccc/rerank Residue"
description: "Closed the 013 deep-review's remaining non-code-graph residue across seven surfaces: GEMINI.md P0 coco routing removed, /memory:manage ccc subcommand stripped, RM-8 process harness cleaned of deleted-daemon rules, plus four small dead refs in gitignore, env allowlist, playbook, advisor runtime graph."
trigger_phrases:
  - "cross-surface coco residue remediation"
  - "013 deep-review residue followup"
  - "ccc subcommand removal manage.md"
  - "process harness coco daemon kill removal"
  - "GEMINI.md coco routing fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index/015-remediate-cross-surface-residue` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index`

### Summary

The 014 CocoIndex and rerank-sidecar deprecation deleted the code artifacts but left residue across non-code-graph surfaces. The 013 deep-review identified six of them: `.gemini/GEMINI.md` still routed Gemini to the deleted `mcp__cocoindex_code__search` (P0). `/memory:manage` declared a `ccc` subcommand plus a CCC MODE section calling removed tools. The advisor runtime graph had stale rerank refs. `.gitignore` still excluded `.cocoindex_code/`. The embedder sidecar env allowlist held a dead `RERANK_` prefix. The session-start playbook asserted a Code Graph status via a `.venv/bin/ccc` binary the hook no longer checks. A seventh surface surfaced mid-work: the RM-8 process-classification harness still carried daemon-kill rules for CocoIndex and rerank daemons that can no longer spawn.

All seven surfaces were fixed in one commit. Every surface now reflects reality. No routing doc sends traffic to deleted artifacts. The process harness only classifies daemons that can still spawn. The full tsc and vitest gates stayed green.

### Added

None.

### Changed

- `.gemini/GEMINI.md` SEARCH ROUTING updated from coco-tool routing to the canonical HYBRID policy matching `.claude/CLAUDE.md`: Code Graph structural search plus Grep for concept and similarity discovery, exact text for literal tokens, `memory_search` for spec docs only
- `.opencode/commands/memory/manage.md` ccc subcommand, CCC MODE section, CCC error-handling row removed across description, argument-hint, validate list, error list, purpose, action, instructions, routing tree. Trailing sections renumbered from §18, §19 to §17, §18
- `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation/250-session-start-startup.md` three `.venv/bin/ccc` binary-check assertions reframed to "code-graph readiness" to match what the hook actually inspects

### Fixed

- `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts` RM-8 classifier removed `cocoindex-daemon`, `cocoindex-mcp`, `rerank-sidecar` kill rules, the `ccc-daemon` classification branch, `isCccProcess`, deleted-skill owner-marker paths, `RERANK_SIDECAR_OWNER_TOKEN`, synthetic coco and rerank fixtures. Live-daemon rules for code-graph, spec-memory, ollama are untouched
- `.opencode/skills/system-spec-kit/scripts/tests/process-memory-harness.vitest.ts` coco and rerank fixture lines dropped, assertions re-pointed to code-graph (port 2002), `expectedDaemonCount` corrected, live pid-lock pid fixed
- `.opencode/skills/system-spec-kit/scripts/tests/process-sweep.vitest.ts` sidecar test re-pointed to ollama, ccc-daemon test dropped
- `.gitignore` dead `.cocoindex_code/` entry removed
- `.opencode/bin/lib/sidecar-env-allowlist.cjs` dead `RERANK_` env prefix removed. File retained because it is the live embedder sidecar's allowlist with three active importers

### Verification

| Check | Result |
|-------|--------|
| Per-target grep across all 7 surfaces | PASS. 0 residue hits each. |
| `tsc -p scripts/tsconfig.json` | PASS. 0 errors. |
| `process-memory-harness.vitest.ts` + `process-sweep.vitest.ts` | PASS. 20 of 20. |
| No orphaned `ccc-daemon` or `isCccProcess` consumer | PASS. 0 hits. |
| manage.md sections gap-free, argument-hint well-formed | PASS |
| Strict packet validation (`validate.sh --strict`) | PASS |

### Files Changed

| File | What changed |
|------|--------------|
| `.gemini/GEMINI.md` | coco routing replaced with canonical HYBRID policy |
| `.opencode/commands/memory/manage.md` | ccc subcommand and CCC MODE removed. Sections renumbered. |
| `.gitignore` | Dead `.cocoindex_code/` pattern removed |
| `.opencode/bin/lib/sidecar-env-allowlist.cjs` | Dead `RERANK_` env prefix dropped |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation/250-session-start-startup.md` | Three `.venv/bin/ccc` checks reframed to code-graph readiness |
| `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts` | RM-8 coco and rerank daemon-kill rules removed. ccc-daemon class and fixtures removed. |
| `.opencode/skills/system-spec-kit/scripts/tests/process-memory-harness.vitest.ts` | Fixtures and assertions updated. Counts corrected. |
| `.opencode/skills/system-spec-kit/scripts/tests/process-sweep.vitest.ts` | Sidecar test re-pointed to ollama. ccc-daemon test dropped. |

### Follow-Ups

- Three borderline residue candidates were observed but not fixed here: the `deep-loop-runtime/lib/deep-loop/README.md` "Rerank sidecar" line, the `system-spec-kit/manual_testing_playbook.md` "CCC stubs/trio" naming, the `sidecar-client.ts:170` cross-encoder comment. All three are tracked for a future pass. None is a live coupling.
- The gitignored `database/skill-graph.json` sync is local-only. It self-heals on the next compile or daemon restart. The committed source in `scripts/` is clean.
