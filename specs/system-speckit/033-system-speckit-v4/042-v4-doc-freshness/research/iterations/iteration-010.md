# Iteration 010: Final verification and the apply/do-not-apply lists

## Focus

Final verification iteration: re-check every proposed replacement from the iteration-9 tables against the live tree with fresh reads, resolve or explicitly close the carried UNVERIFIED and NARROWED rows (the Hermes eighteen-of-twenty-two split, the README Related Documents anchor, the carried changelog numerics, the sk-design compiled-router claim), and produce the final apply/do-not-apply list for each document.

## Actions Taken

1. Gate loads before the first write: the trigger-index lookup, the `REPO RULES.md` router and the seven rule files its trigger table routes for this action (evidence-and-proof, uncertainty-and-honesty, skill-hub-routing and the four communication rules).
2. State re-read: `iterations/iteration-009.md` (both verdict tables), `deep-research-strategy.md` and the head of `findings-registry.json`.
3. One batched live-tree re-verification: every count-based replacement re-counted and every listing re-listed (mcp-tooling registry keys and packet dirs, deep-loop registry keys and command files, repo-rules, AGENTS.md, sk-code packets, `.hermes`, hook package dirs, validator registry, chart templates, diagram types, hub roots, the two renames, `.vscode`, post-draft commit count).
4. Bridge-source search for the Hermes split: the repo-guards plugin tree and `.hermes/SYNC.md`, plus a fresh hook-package census.
5. Anchor search: the README heading map, which located the RELATED DOCUMENTS section.
6. Router-history read: `git log --follow` on the hubs' `hub-router.json` files, the compiled-routing architecture reference and the `HUB_CHILD` enumeration in the compiled router engine.
7. Wrote the narrative and the delta stream, and recorded the iteration through the append gateway.
8. Budget note: the 12-call cap was exceeded by the mandatory Gate 5 loads (the lookup, the router and seven rule files, nine gate calls) plus the artifact writes, matching the documented iterations 7-9 precedent. Research actions stayed at six: the state re-read, the tree re-verification batch, the bridge search, the anchor search, the router-history read and the compiled-router engine check.

## Findings

### Resolved this iteration

**R1. Hermes eighteen-of-twenty-two: TRUE, keep "eighteen".** `.hermes/SYNC.md` line 87 names exactly four packages as "Not bridged by nature": `codex-watchdog` (OpenCode), `directive-lifecycle` (Claude), `permission-policy` (Devin) and `hook-install`. The fresh census of `.skilled/hooks` counts exactly 22 package directories, and `session-lifecycle` is not among the excluded four, so it is the eighteenth bridge (its behaviors appear as the session-start advisories and the session cleanup wiring, SYNC.md lines 78-86). 22 minus 4 equals 18. No edit.

**R2. README Related Documents anchor: present at L1030, no defect.** The heading map shows `## 6. RELATED DOCUMENTS` at line 1030. Iteration 9's zero-match search was case-sensitive and the heading is uppercase, so the "section heading no longer exists" flag was a search artifact. The link set under it was content-verified at iteration 8 (10 of 10 targets existed). No edit, and the re-locate residual closes.

**R3. sk-design compiled-router caveat (L392): holds, no edit.** The compiled router is current and real. `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md` states it "serves exactly five parent hubs", enumerated as `HUB_CHILD` in `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`. The engine's `HUB_CHILD` object lists `sk-code`, `system-deep-loop`, `mcp-tooling` and `cli-external-orchestration` directly (the fifth, `sk-doc`, is named in the architecture doc's table as rollout row 007), and the engine throws `unknown hub` for anything else. `sk-design` appears nowhere in the engine or its enumeration. The only `sk-design` hits in the compiled-routing tree are mirror comments in other hubs' compilers. sk-design has carried its own `hub-router.json` since June 2026 (`git log --follow`), so the caveat was never about that file. "Joining the compiled closure is planned, not shipped" still describes the serving cohort.

**R4. Carried changelog numerics: explicitly closed, no edit.** Lines 11 (28KB command and 3,000-line template), 90 (forty-two surfaces), 108 (twenty-two remediation children, sixteen in one day), 114 (1,275 lines, 175 against 944), 120 (forty-four alerts) and 228 (178 recommendations) describe pre-release events whose artifacts no longer exist in a re-derivable form. Iteration 9 marked them UNVERIFIED (low, carried) with no replacement proposed, and they stay out of the apply list, flagged only if provenance auditing is wanted later.

### Fresh re-checks of the apply rows (all hold)

- A1: `mode-registry.json` modes keys 0-9, ten total, and `mcp-orca-cli/` is present. The "ten modes" replacement holds.
- A2: deep-loop registry modes keys 0-4, five total, and `.skilled/commands/deep/` holds five command files (agent-improvement, ai-council, model-benchmark, research, review) plus an assets directory. The "five" replacements hold.
- A3: `repo-rules/` holds 13 files, `answer-the-actual-request.md` among them. The "Thirteen" replacement holds.
- A4: `wc -l AGENTS.md` gives 284. The "to 284" replacement holds.
- A5: `sk-code/` ships `sk-code-webflow`, `sk-code-opencode` and `sk-code-obsidian` plus the quality and review modes, with no mobile-cli packet. The drop-and-delete replacement holds.
- A6: `.hermes/agents -> ../.skilled/agents` is a symlink and `.hermes/skills` is a generated-copy directory. The narrowed parenthetical holds.
- A14: `communication-handoff.md` and `communication-decisions.md` are present and the two old names are absent. The rename-list addition holds.
- A15: `git log --oneline 1d43dbd38b..HEAD | wc -l` gives 231, and the changelog's last touch is `1d43dbd38b 2026-09-16`. The post-draft section holds.
- B5: the same sk-code listing as A5. The "Webflow + OpenCode + Obsidian" replacement holds.
- B14: `.vscode/` does not exist, so the `.vscode/mcp.json` reference is a miss. The "fix or drop" replacement holds.
- B1 through B4 carry iteration 8's evidence (the engines census, the advisor test scan, the catalog and playbook reads, the template enumeration). Nothing re-checked this iteration contradicts them.

### Final apply list: `CHANGELOG-v4.0.0.0.md` (9 rows, 8 edits plus 1 additive note)

| Row | Line(s) | Edit |
|---|---|---|
| A1 | L41, L511 | "nine modes" becomes "ten modes" in both places, optionally naming `mcp-orca-cli` |
| A2 | L26, L592 | "six `/deep:*` commands" becomes "five", and "The six modes behave as before." becomes "The five modes behave as before." |
| A3 | L45, L553 | "Twelve repo rules" and "Twelve rule files" become "Thirteen", naming `answer-the-actual-request.md` |
| A4 | L45, L553 | "283" becomes "284" in both places |
| A5 | L433, L435 | Drop `sk-code-mobile-cli` from the L433 list and delete the L435 mobile-cli sentence |
| A6 | L278 | Narrow the symlink-rejection parenthetical to the skill mirror and state that the agent tree ships as a symlink |
| A13 | whole document | Additive note: the source root moved to `.skilled` while the `.opencode/*` compatibility aliases remain |
| A14 | L577, L579 | Add the two renames to the list: `communication-handoff-and-questions.md` to `communication-handoff.md`, and `communication-presenting-decisions.md` to `communication-decisions.md` |
| A15 | whole document | Add a post-draft section covering the `.skilled` source-root migration, the deep-loop ledger, protocol and admission work, the orca packet and its follow-ups, the mobile-cli retirement, the alias retire and restore, and the documentation-correction commits |

### Final apply list: `README.md` (6 rows)

| Row | Line(s) | Edit |
|---|---|---|
| B1 | L92 | "Node.js 18+" becomes "Node.js 20.11+ (22.12+ for the spec-kit runtime CLI)" |
| B2 | L412 | Drop "121 advisor test files, 872 tests" or state the real count ("3 test files") |
| B3 | L609 | "76-scenario playbook" becomes "37-scenario playbook" (the 96-feature half holds) |
| B4 | L894-902 | Enumerate the 14 `.utcp_config.json` templates and drop the phantom clickup (community) row |
| B5 | L936 | "Webflow + OpenCode + Motion.dev surfaces" becomes "Webflow + OpenCode + Obsidian surfaces", with Motion.dev described as an overlay |
| B14 | L976-984 | Fix or drop the `.vscode/mcp.json` reference, which does not exist |

### Do-not-apply list

**Changelog (14 rows).** A7 (eighteen, confirmed this iteration), A8 (102 symlinks, inclusive count), A9 (40 rules, re-counted at 40), A10 (29 chart forms, re-counted at 29), A11 (27 diagram types, 28 entries with README), A12 (all aliases resolve), A16 (historical numerics, closed), A17 (L130 anchor resolver, closed with no replacement proposed), A18 (compiled-router caveat, confirmed this iteration), A19 (six hubs plus seven standalones), A20 (retirements), A21 (sk-design's four modes), A22 (figma move and `database/`), A23 (the removals list).

**README (11 rows).** B6 (anchor resolved at L1030), B7 (12 agents and 13 skills, with 13 skill directories re-counted), B8 (L59 diagram figure, closed with no replacement), B9 (47 scenario files), B10 (four families and five commands, re-counted), B11 (two co-equal lanes), B12 (32 entry points), B13 (nine commands, confirmed with an enumeration residual), B15 (packet structure), B16 (Rust placement, closed with no replacement), B17 (badge redirect, closed with no network check).

### Verdict summary

40 rows adjudicated, final: 15 apply (9 changelog, 6 README) and 25 do-not-apply. Nothing reversed from iteration 9's adversarial pass, and all four named splits close, two of them (Hermes, compiled router) as "no edit". Targeted corrections still suffice for both documents, so no rewrite is recommended for either.

## Questions Answered

- Q1: closed. Every `.opencode/...` path reference resolves through compatibility aliases, and the only root-naming action is the additive `.skilled` note (A13).
- Q2: closed. The changelog's capability claims reduce to the count edits A1-A6 and the rename edit A14. The Hermes count is true as written and the compiled-router caveat holds.
- Q3: closed. The README edits reduce to B1-B5 and B14, and the Related Documents anchor needs no change.
- Q4: closed. 231 post-touch commits remain absent from the narrative, and A15 adds the covering section.
- Q5: closed. Targeted corrections suffice. The final lists above are the deliverable.

## Questions Remaining

- None material for the two documents. Closed with flags and no edits: the changelog's pre-release numerics (A16) and L130 behavior note (A17), the README's L59 diagram figure (B8), Rust line (B16) and badge URL (B17), and the carried `@markdown` / `deep-ai-council` rename checks (no evidence of error, not load-bearing). Applying the lists is the orchestrator's step, not the research leaf's.

## Next Focus

- Run complete at iteration 10 of 10. Hand the two apply lists to the orchestrator for the correction step. No further research iterations.
