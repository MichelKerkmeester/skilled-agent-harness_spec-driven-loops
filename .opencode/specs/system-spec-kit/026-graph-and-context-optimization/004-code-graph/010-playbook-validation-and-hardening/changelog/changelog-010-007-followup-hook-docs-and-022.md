---
title: "Code Graph Phase 010-007: Hook-Doc Reconciliation and 022 Transitive Re-verify"
description: "Five stale hook-artifact-path docs reconciled to the real flat dist path. Scenario 022 blast_radius transitive expansion re-verified with a deep-dependency subject, revealing that includeTransitive is a no-op by design (finding F-022-1)."
trigger_phrases:
  - "hook doc reconciliation"
  - "022 transitive re-verify"
  - "includeTransitive no-op"
  - "session-start artifact path"
  - "deferred_decisions path fix"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/007-followup-hook-docs-and-022` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening`

### Summary

Two non-blocking follow-ups from the 029 playbook remediation remained open. Five active-guidance docs (four hook READMEs and the skill-advisor decision tracker) cited a SessionStart compiled-artifact path that never existed. The documented migration from `system-spec-kit` to `system-code-graph` was aspirational and was never built.

Both follow-ups are now resolved. The five docs cite the real flat artifact `system-spec-kit/mcp_server/dist/hooks/<runtime>/session-start.js`, verified with `test -f`. The decision tracker (`deferred_decisions.md`) retains its original §2 entry and adds a dated 2026-05-27 correction recording that the migration was not realized and that F-025-1 (phase 004) already repointed the Devin hook registration. For scenario 022, re-running `blast_radius` against `lib/code-graph-db.ts` (a genuine 3-hop reverse-dep tree: 27/7/1 = 35 dependents) showed that the default non-transitive traversal already returns all 35, making `includeTransitive:true` a no-op. The finding (F-022-1) is recorded as a documented semantic: the default traversal is a full reverse-dependency closure, not a depth-1 limit. Single, union and minConfidence paths all behaved correctly.

### Added

- `evidence-022-rerun.md` in the packet folder recording the 022 PARTIAL verdict and F-022-1 finding

### Changed

- Four hook READMEs (`system-spec-kit/mcp_server/hooks/{claude,codex,gemini,devin}/README.md`) updated to cite the real flat artifact path
- `system-skill-advisor/references/decisions/deferred_decisions.md` updated with a dated correction note and §3 path fix. History preserved by errata pattern, not rewrite.

### Fixed

- Stale `system-code-graph/dist/system-spec-kit/mcp_server/hooks/<runtime>/` path removed from all five active-guidance docs. Operators following these docs were directed to a path that did not exist on disk.

### Verification

| Check | Result |
|-------|--------|
| Real artifact path cited in all 5 docs | PASS (`rg`) |
| Devin artifact path exists on disk | PASS (`test -f`) |
| Stale path appears only in correction or historical context | PASS |
| 022 transitive re-run on deep subject (35 deps) | PARTIAL. F-022-1: `includeTransitive` is a no-op. Single, union, minConfidence all correct. |
| No staleness markers or workspace leftovers | PASS (0 matches) |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/README.md` | Cited real flat dist artifact path, removed non-existent system-code-graph path |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md` | Cited real flat dist artifact path, removed non-existent system-code-graph path |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md` | Cited real flat dist artifact path, removed non-existent system-code-graph path |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/README.md` | Cited real flat dist artifact path, removed non-existent system-code-graph path |
| `.opencode/skills/system-skill-advisor/references/decisions/deferred_decisions.md` | Added dated 2026-05-27 correction note. §3 path updated. History preserved. |
| `evidence-022-rerun.md` (NEW) | Full 022 transitive re-verify evidence. PARTIAL verdict. F-022-1 documented. |

### Follow-Ups

- Evaluate whether `blast_radius` should default to depth-1 (opt-in to full closure) rather than full closure (opt-in to transitive). F-022-1 documents this as a maintainer design decision. No consumer relied on the full-closure default per the phase 008 audit.
- Confirm phase 008 (`008-blast-radius-transitive-flag`) resolved F-022-1 by making `includeTransitive` honor depth-1 vs full-closure semantics. Close this finding in the parent matrix after confirmation.
