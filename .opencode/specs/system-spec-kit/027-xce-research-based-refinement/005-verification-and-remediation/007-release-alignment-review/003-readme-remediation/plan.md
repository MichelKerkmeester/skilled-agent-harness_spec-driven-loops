# Plan — README currency remediation (Track A)

**Source review:** `../001-readmes-vs-027/review/findings-all.json` (165 findings: 4 P0 / 122 P1 / 39 P2) + `../synthesis.md`.
**Executor (per operator):** `cli-opencode` → `openai/gpt-5.5-fast` `--variant high`, dispatched in a **markdown documentation-fixer** role (role stated in the prompt body — opencode rejects top-level `--agent`).
**Goal:** bring every confirmed-stale README into line with current post-027 reality. Surgical, additive-where-possible edits; no restructure.

## Scope — CONFIRMED only (do-not-fix list is binding)

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

## Executor design (dispatch-ready)

- **Slicing:** reuse the 18 review area-seats; each fixer seat owns ONE skill area and receives only that area's confirmed findings (filter `findings-all.json` by `seat`). Group the 4 tiny areas (A15/A16/A17/A18) into 2 seats → ~14 fixer seats.
- **Concurrency:** pool of 10, staggered 3s spawn (launch-race mitigation), `</dev/null`, `gtimeout 1200`.
- **Isolation (RM-8):** all Track-A fixers run with `--dir <worktree-A>` (one shared git worktree off the current branch; disjoint file scopes per seat → no conflict). Diff-reviewed before merge to the branch.
- **Per-seat brief contract:**
  - `Spec folder: <this packet> (pre-approved at Gate 3 — make the edits below; do not re-ask).` (bypasses the dispatched-session Gate-3 write-block)
  - `ALLOWED WRITE PATHS:` exact README list for the area. `BANNED: no delete, no rename, no edits outside the listed files, no --no-verify, surgical edits only.`
  - The area's confirmed findings (file:line, stale_claim, current_truth) + the surface-aware tool-count rule.
  - `CONFIRM-THEN-FIX: re-read each cited line; if the stale claim is not present, mark it refuted and skip. Never invent a fix.`
  - `VERIFY: after edits, re-grep each fixed file to prove the stale string is gone / corrected; report a per-finding fixed/refuted table.`

## Verification (orchestrator, post-merge)
1. Re-grep the worktree for the stale signatures (old resume spelling, BGE/cloud-first defaults, 4-mode roster, dead-link targets) → expect 0 in fixed files.
2. `validate.sh --strict` on any spec-folder-bearing READMEs touched.
3. Aggregate the per-seat fixed/refuted tables → reconcile against findings-all.json; record refuted-at-fix items.
4. Diff-review the full worktree change before merge; scoped commit.

## Tasks
- [ ] Build per-area confirmed-finding briefs (filter findings-all.json by seat, drop refuted clusters).
- [ ] Create worktree-A off the branch; verify clean baseline.
- [ ] Dispatch ~14 markdown-fixer seats (pool 10, staggered).
- [ ] Collect per-seat fixed/refuted tables; salvage empties.
- [ ] Orchestrator verification sweep (re-grep + validate.sh).
- [ ] Diff-review worktree-A; merge + scoped commit; update this packet's implementation-summary.
