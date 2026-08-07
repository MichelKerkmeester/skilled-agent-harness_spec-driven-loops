# sk-doc Template Audit Findings

## Summary

- Active files audited: 63
- PASS: 40
- FIX_APPLIED: 7
- DEFERRED: 16
- Broad raw command result: 131 paths, narrowed to commit-specific 031 through 036 scope.
- sk-doc skill: read-only.
- Code changes: none.

## Validation Commands

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py <file> --json --no-exclude
python3 .opencode/skills/sk-doc/scripts/validate_document.py <file> --type reference --json --no-exclude
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict
```

Additional integrity checks covered balanced `<!-- ANCHOR:slug -->` markers and closed fenced code blocks.

## Applied Fixes

| File | Fix |
|------|-----|
| `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | Fixed README TOC anchors and added `importance_tier` metadata |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Fixed README TOC anchors and added `importance_tier` metadata |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md` | Added README TOC, balanced section anchors and `importance_tier` metadata |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/README.md` | Added README TOC, balanced section anchors and `importance_tier` metadata |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/README.md` | Added README TOC, numbered sections, anchors, trigger phrases and `importance_tier` metadata |
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` | Added reference frontmatter, numbered H2 sections and balanced anchors |
| `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` | Added `importance_tier` metadata |

## Deferred Findings

| File Pattern | Reason |
|--------------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F*.md` | These are raw prompt payloads. Adding README or asset overview sections would change the text sent to external CLI runners. |
| `AGENTS.md` | This is a governance template, not a README. Emoji and heading style existed before packets 031 through 036, so rewriting it would be out-of-scope drift cleanup. |

## Per-file Results

| File | Status | Notes |
|------|--------|-------|
| `.opencode/commands/memory/manage.md` | PASS | No blocking sk-doc issue in applicable command checks |
| `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | FIX_APPLIED | TOC anchor and frontmatter metadata aligned |
| `.opencode/skills/system-spec-kit/SKILL.md` | PASS | No blocking sk-doc issue in applicable skill checks |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | PASS | No blocking sk-doc issue in applicable reference checks |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | FIX_APPLIED | TOC anchor and frontmatter metadata aligned |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md` | FIX_APPLIED | README TOC, anchors and frontmatter metadata added |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/README.md` | FIX_APPLIED | README TOC, anchors and frontmatter metadata added |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/README.md` | FIX_APPLIED | README structure, TOC, anchors and metadata aligned |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F1-spec-folder.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F10-deep-loop.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F11-hooks.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F12-validators.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F13-stress-cycle.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F14-search-w3-w13.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F2-skill-advisor.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F3-memory-search.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F4-memory-context.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F5-code-graph-query.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F6-code-graph-scan.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F7-causal-graph.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F8-cocoindex.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/F9-continuity.md` | DEFERRED | Raw prompt-template asset. Adding README sections would alter matrix prompt payloads |
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` | FIX_APPLIED | Reference frontmatter, numbered sections and anchors added |
| `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` | FIX_APPLIED | `importance_tier` metadata added |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-documentation-truth-validation/checklist.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-documentation-truth-validation/implementation-summary.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-documentation-truth-validation/plan.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-documentation-truth-validation/research/prompts/iteration-001.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-documentation-truth-validation/spec.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-documentation-truth-validation/tasks.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-code-graph-watcher-claim-retraction/checklist.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-code-graph-watcher-claim-retraction/implementation-summary.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-code-graph-watcher-claim-retraction/plan.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-code-graph-watcher-claim-retraction/research/prompts/iteration-001.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-code-graph-watcher-claim-retraction/spec.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-code-graph-watcher-claim-retraction/tasks.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/005-memory-retention-policy-sweep/checklist.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/005-memory-retention-policy-sweep/implementation-summary.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/005-memory-retention-policy-sweep/plan.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/005-memory-retention-policy-sweep/research/prompts/iteration-001.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/005-memory-retention-policy-sweep/spec.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/005-memory-retention-policy-sweep/tasks.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/010-half-auto-upgrade-doc-alignment/checklist.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/010-half-auto-upgrade-doc-alignment/implementation-summary.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/010-half-auto-upgrade-doc-alignment/plan.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/010-half-auto-upgrade-doc-alignment/research/prompts/iteration-001.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/010-half-auto-upgrade-doc-alignment/spec.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/010-half-auto-upgrade-doc-alignment/tasks.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-runtime-matrix-execution-validation/checklist.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-runtime-matrix-execution-validation/findings.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-runtime-matrix-execution-validation/implementation-summary.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-runtime-matrix-execution-validation/plan.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-runtime-matrix-execution-validation/research/iterations/iteration-001.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-runtime-matrix-execution-validation/research/prompts/iteration-001.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-runtime-matrix-execution-validation/spec.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-runtime-matrix-execution-validation/tasks.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-cli-matrix-adapter-runners/checklist.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-cli-matrix-adapter-runners/implementation-summary.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-cli-matrix-adapter-runners/plan.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-cli-matrix-adapter-runners/research/prompts/iteration-001.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-cli-matrix-adapter-runners/spec.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-cli-matrix-adapter-runners/tasks.md` | PASS | No blocking sk-doc issue in applicable spec checks |
| `AGENTS.md` | DEFERRED | Governance template, not README; emoji/header drift existed before packets 031 through 036 |

## Re-audit Results

| Check | Result |
|-------|--------|
| Edited READMEs | PASS |
| Edited reference docs | PASS |
| Active target anchor balance | PASS |
| Active target fenced code blocks | PASS |
