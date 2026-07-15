---
title: "Implementation Plan: README Currency Remediation (Track A)"
description: "Executor design and slicing for the Track A README remediation: gpt-5.5-fast markdown fixer seats, surface-aware tool-count rule, confirm-then-fix, verification sweep."
trigger_phrases:
  - "readme remediation plan"
  - "track A doc remediation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/003-readme-remediation"
    last_updated_at: "2026-06-18T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author README remediation plan"
    next_safe_action: "Dispatch markdown fixer seats and collect fixed/refuted tables"
    blockers: []
    completion_pct: 100
---
# Implementation Plan: README Currency Remediation (Track A)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Source review** | `../001-readmes-vs-027/review/findings-all.json` (165 findings: 4 P0 / 122 P1 / 39 P2) + `../synthesis.md` |
| **Executor (per operator)** | `cli-opencode` → `openai/gpt-5.5-fast` `--variant high`, in a markdown documentation-fixer role |
| **Dispatch note** | Role stated in the prompt body — opencode rejects top-level `--agent` |

### Overview
Bring every confirmed-stale README into line with current post-027 reality via surgical, additive-where-possible edits; no restructure. Each fixer seat confirms-then-fixes the cited claims against the live file.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Confirmed drift themes identified from round-2 review
- [x] Do-not-fix (refuted / false-positive) list is binding
- [x] Surface-aware tool-count rule defined
- [x] Per-seat brief contract drafted

### Definition of Done
- [x] Stale signatures re-grep to zero in fixed files
- [x] No false-positive cluster edited
- [x] Doc-accuracy audit run; wrong new values corrected
- [x] Changes committed scoped; review evidence retained


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Scope — CONFIRMED only (do-not-fix list is binding)

Fix the confirmed drift themes (verified against live files in round-2):

| # | Theme | Correct value / action | Example hits |
|---|-------|------------------------|--------------|
| T1 | `/speckit:resume` command spelling | use the current command name everywhere | templates/changelog, shared, hook_system, quick_reference |
| T2 | Embedding defaults documented cloud-first / BGE-GGUF | rewrite to the **local-first** cascade actually shipped | shared/README §310-321, feature_catalog, manual_testing_playbook, local-LLM README |
| T3 | Deep-loop roster omits **improvement** mode | add improvement to the 5-mode roster | deep-context/research/review/ai-council READMEs, agent-io-contract |
| T4 | Removed cross-encoder / local-rerank gates still documented | delete/replace the stale rerank-gate prose | spec-kit SKILL.md, mcp_server/lib/search/README |
| T5 | Dead cross-skill relative links | repoint or remove | deep-loop-workflows */scripts/README, sk-code benchmark, sk-doc readme_creation |
| T6 | Advisor / code-graph factual drift | correct 9th-tool classification, propagate trust-gating, blast-radius fields, markdown-not-in-default-scan, IPC default 64 | advisor README/SKILL, code-graph README/SKILL/mcp_server |
| T7 | **Tool counts — SURFACE-AWARE** | CLI front door = **37** (leave as-is); **MCP server = 39** (fix only MCP-surface "37"→"39"). Per-hit check required. | memory_system.md, daemon_cli_reference (CLI=37 is CORRECT), readme_creation example |
| T8 | Misc stale facts | Node minimum, validation-rule count, schema version, constitutional rule count, doctor route targets | per findings-all.json |

### DO NOT FIX (refuted / out of scope — editing these corrupts correct docs)
- The **CLI** front-door "37 tools" figure (`daemon_cli_reference.md`) — **correct**; only MCP-surface 37s are stale.
- A18 findings with empty title/line (low-confidence; re-run that seat if coverage matters).
- Anything not traceable to a confirmed theme above — the fixer **confirms-then-fixes**; if a finding does not reproduce against the live file, it is logged as `refuted` and skipped, not forced.


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a documentation-only fix (README currency); no security, path-handling, env-precedence, schema, persistence, or public-response surfaces are touched.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Confirmed-stale READMEs | describe post-027 behavior | correct stale claims surgically | re-grep stale signatures → 0 in fixed files |
| False-positive clusters (CLI=37, FC comments, TSDoc examples) | already-correct docs | unchanged (binding do-not-fix) | accuracy audit confirms untouched |

Required inventories:
- Same-class producers: `rg -n '37 tools|/speckit:resume|BGE-GGUF|cross-encoder' <readme-files>` to find sibling stale strings.
- Consumers of changed values: re-grep each fixed README to prove the stale string is gone / corrected.
- Matrix axes: per-theme (T1–T8) × per-surface (CLI vs MCP) — the surface-aware tool-count rule is the key axis.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Brief Build
- [x] Build per-area confirmed-finding briefs (filter `findings-all.json` by seat, drop refuted clusters)
- [x] Create worktree-A off the branch; verify clean baseline

### Phase 2: Fix Pass
- [x] Dispatch ~14 markdown-fixer seats (pool 10, staggered 3s spawn, `</dev/null`, `gtimeout 1200`)
- [x] Each seat owns ONE skill area with disjoint file scope (RM-8 isolation via `--dir <worktree-A>`)
- [x] Collect per-seat fixed/refuted tables; salvage empties

### Phase 3: Verification
- [x] Re-grep the worktree for stale signatures → expect 0 in fixed files
- [x] `validate.sh --strict` on any spec-folder-bearing READMEs touched
- [x] Aggregate per-seat tables; reconcile against `findings-all.json`; record refuted-at-fix items
- [x] Diff-review the full worktree change before merge; scoped commit


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Re-grep | Stale signatures (old resume spelling, BGE/cloud defaults, 4-mode roster, dead links) | `rg` |
| Strict validate | Spec-folder-bearing READMEs touched | `validate.sh --strict` |
| Accuracy audit | Every doc rewrite vs live source | Read-only audit seats |
| Diff review | Full worktree change before merge | `git diff` |


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `findings-all.json` review evidence | Internal | Green | Cannot scope confirmed fixes |
| `cli-opencode` + gpt-5.5-fast | External | Green | No fixer-seat dispatch |
| Shared git worktree off the branch | Internal | Green | No isolated fixer scopes |


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix corrupts a correct value or edits a false-positive cluster.
- **Procedure**: Revert the scoped commit(s) (`83f36b8050`, `4fd438323e`); re-run confirm-then-fix on the affected file only.


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Brief Build) ──> Phase 2 (Fix Pass) ──> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Brief Build | None | Fix Pass |
| Fix Pass | Brief Build | Verification |
| Verification | Fix Pass | None |


<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Brief Build | Low | 1 hour |
| Fix Pass (~14 seats, pool 10) | Medium | 2-3 hours |
| Verification + accuracy audit + corrections | Medium | 2-3 hours |
| **Total** | | **5-7 hours** |


<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Clean worktree-A baseline verified before fixes
- [x] Per-seat banned operations enforced (no delete/rename/out-of-scope edits)
- [x] Diff-review before merge

### Rollback Procedure
1. **Immediate**: Identify the offending file from the per-seat fixed/refuted table.
2. **Revert code**: `git revert` the scoped commit(s) `83f36b8050` / `4fd438323e`.
3. **Re-fix**: Re-run confirm-then-fix on the affected file only.
4. **Verify**: Re-grep + accuracy spot-check the reverted file.

### Data Reversal
- **Has data migrations?** No (docs-only edits)
- **Reversal procedure**: Git revert; no data to preserve.

<!-- /ANCHOR:enhanced-rollback -->
