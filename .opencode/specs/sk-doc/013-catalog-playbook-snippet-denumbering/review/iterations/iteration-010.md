# Deep-Review Iteration 010 — cross-skill references (skill A → skill B)

**Executor:** DeepSeek-v4-pro (cli-opencode, --pure, read-only)
**Findings:** P0=1 P1=5 P2=1 (total 7)

## Summary
Scanned 328 files across cli-*/deep-*/system-* SKILL.md, their references/, agents/, and commands/ for cross-skill path references. Found 1 P0 (missing protocol/ segment in system-spec-kit→deep-research ref), 3 systemic P1 depth-drift patterns (~75 occurrences across 10 files where ../ count is wrong for files at depth 3-5), and 2 P1 dead targets from prior migrations. No findings are caused by #133 de-numbering — all are pre-existing depth bugs or stale refs from other migrations (doc-evolution #116, deep-loop CLI cutover). The ~60 same-skill depth bugs in sk-doc/references/→assets/ are not counted as cross-skill.

## Findings
| Sev | Classification | Source | Reference | 133-caused | Recommendation |
|-----|----------------|--------|-----------|-----------|----------------|
| P0 | REAL_BROKEN | `.opencode/skills/system-spec-kit/SKILL.md` | `../deep-research/references/spec_check_protocol.md` | no | Add missing `protocol/` segment; file moved into protocol/ subfolder during packet 116/008 deep-skill doc-evolution, reference never updated |
| P1 | TARGET_DELETED | `.opencode/skills/sk-code/SKILL.md` | `.opencode/skills/sk-doc/scripts/preview-server.js` | no | Remove or replace dead reference; target file never existed in git history |
| P1 | TARGET_DELETED | `.opencode/skills/sk-prompt-models/SKILL.md` | `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/` | no | Update or remove reference; deep-loop runtime was migrated from MCP server to CLI in a prior cleanup |
| P1 | REAL_BROKEN | `.opencode/skills/sk-prompt-models/references/models/*.md (8 files: deepseek-v4-pro.md, glm-5.1.md, kimi-k2.6.md, mimo-v2.5-pro.md, minimax-m3.md, minimax-2.7.md, swe-1.6.md, qwen3.6.md)` | `../sk-prompt/references/patterns_evaluation.md (and ~60 similar ../cli-devin/..., ../cli-opencode/... from references/models/ depth)` | no | Fix ../ depth: from references/models/ (depth 4) use ../../../ to reach skill root; current ../ resolves outside the repo |
| P1 | REAL_BROKEN | `.opencode/skills/cli-opencode/references/context-budget.md` | `../cli-devin/references/context-budget.md (and ../sk-prompt-models/..., ~10 occurrences)` | no | Fix ../ depth: from references/ (depth 3) use ../../ to reach skill root; current ../ resolves outside the repo |
| P1 | REAL_BROKEN | `.opencode/skills/deep-ai-council/references/convergence/deep_mode.md` | `../deep-loop-runtime/lib/council/cost-guards.cjs` | no | Fix ../ depth: from references/convergence/ (depth 5) use ../../../ to reach skill root; current ../ resolves outside the repo |
| P2 | REAL_BROKEN | `.opencode/agents/ai-council.md` | `.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js` | no | File extension mismatch: referenced .js but actual file is .cjs; or the lib/ subdirectory path is wrong |

Review verdict: FAIL