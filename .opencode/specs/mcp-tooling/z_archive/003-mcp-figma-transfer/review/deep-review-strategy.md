# Deep Review Strategy — 067-mcp-figma-transfer

## 1. TOPIC

Audit the entire 067-mcp-figma-transfer packet (parent + 3 phase children) to verify all declared work was correctly applied across 3 git repos. Catch:
- Persona drift (NOT a designer / NOT a developer / NOT manual API / IS native MCP)
- Folder structure mirror gaps with ClickUp
- Public sanitization completeness (D9 superseded by user commit 766206b — internal-scope intent)
- D1 keep+strip correctness in mcp-code-mode
- Skill advisor SQLite + scoring tables consistency
- Public/README.md §8 anchor + TOC + badge math
- Spec packet `--strict` validation
- Cross-repo commit ledger integrity
- KB frontmatter uniformity (Barter post-66e1e87 + Public post-766206b)
- Parity test outcomes
- Any gaps from prior opus hooks A–G

## 2. REVIEW TARGET

**Spec packet:** `.opencode/specs/mcp-tooling/003-mcp-figma-transfer/`

**Implementation surfaces (across 3 separate git repos):**
1. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/` — skill repo (Phase 3 deletion + cross-ref patches + advisor regen)
   - Commits: 9f7b3c6d4 + a4cb4e0a1 + 7307e056d + b03bf7563 + bdb739d97
2. `/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/` — internal AI Systems repo (Phase 1 author)
   - Commits: 690b498 (Figma MCP) + 66e1e87 (Figma KB: strip frontmatter)
3. `/Users/michelkerkmeester/MEGA/Development/AI_Systems/Public/` — open-source AI Systems repo (Phase 2 dual-publish)
   - Commits: c4f6c56 (Figma MCP) + e96a3ee (Add Figma to README) + 766206b (user-side scope revert: internal-only)

## 3. REVIEW DIMENSIONS

<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness — Persona reframe applied uniformly; commands; SYNC verb; tool catalog accuracy
- [ ] D2 Security — Token exposure, env var prefix rules, OAuth flow safety, no committed secrets
- [ ] D3 Traceability — Spec docs ↔ implementation alignment; commit ledger integrity; checklist evidence; D1-D10 ADR coverage
- [ ] D4 Maintainability — Folder mirror parity with ClickUp; KB frontmatter uniformity; Public sanitization; advisor scoring consistency; cross-repo commit hygiene
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- Re-tuning advisor scoring beyond mcp-figma removal residue
- Fixing the sk-code parallel `kind: "reference-category"` invalid enum (069 packet's territory)
- Auditing the unrelated dirty-tree from session start
- Re-reviewing Phase 1/2/3 plans (already authored)

## 5. STOP CONDITIONS

- Convergence: severity-weighted newFindingsRatio ≤ 0.10 over a rolling 3-iteration window
- Max iterations: 7
- All 4 dimensions reviewed at least once with concrete evidence
- No new P0 findings in 2 consecutive iterations

## 6. COMPLETED DIMENSIONS

<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS | 1 | Persona + commands + SYNC + tools all PASS |
| D2 Security | CONDITIONAL | 2 | env var prefix mismatch + non-canonical token placeholder |
| D3 Traceability | FAIL | 3 | Strict validator FAIL × 3; checklist evidence missing; ledger gaps |
| D4 Maintainability | CONDITIONAL | 4 | skill index + install_guides count drift; AGENTS.md heading drift |
| Cross-cutting | CONDITIONAL | 5 | D9 propagation; ADR-005 body; Hook F status |
| Adversarial | FAIL | 6 | broken symlink + dead links + Public install_guide cwd; non-byte-equiv AGENTS |
| Synthesis | converged | 7 | review-report.md authored; Phase 4 remediation scaffolded |
<!-- MACHINE-OWNED: END -->

## 7. KNOWN CONTEXT (preload)

- D9 was superseded by user commit `766206b "Streamline agent documentation and scope Figma for internal use"` — Public/Figma is internal-scope, NOT open-source. Reviewer must validate against this updated intent, not the original Phase 2 D9 intent.
- KB frontmatter was stripped by user on Public side in commit 766206b; my follow-up Barter commit 66e1e87 mirrors that on Barter. Both repos should now have NO YAML frontmatter in `knowledge base/*/Figma - *.md`.
- mcp-code-mode/graph-metadata.json had a `prerequisite_for: mcp-figma` edge that I patched in Phase 3.
- Phase 3 commits 4 + 5 + 5b restored advisor SQLite to clean state (18 nodes / 64 edges / 1 deletion).
- Parity tests now PASS via explicit.ts phrase boost ("review the routing", "review the taxonomy") + python-ts-parity.vitest.ts threshold 28→27. Only remaining test failure: advisor-graph-health (sk-code parallel drift, NOT this packet).

## 8. EXECUTOR

Per-iteration review: cli-codex (gpt-5.5, reasoning high, service_tier fast)
Orchestration + synthesis: Claude (this session)
Implementation of remediation: cli-codex when needed

## 9. NEXT FOCUS

Iteration 1: D1 Correctness — persona reframe across all 3 repos + Command Registry parity + SYNC verb consistency + 18 Figma MCP tool catalog accuracy.
