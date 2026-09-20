# Iteration 4 - Q4: Post-draft work missing from the changelog narrative

## Focus
Q4: Which post-draft work — the deep-loop ledger, protocol and admission changes, the source-root migration's compatibility decision, the orca packet, and the documentation-correction commits — is missing from `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md`? The 600-line document was audited against the commit range that landed after its last refresh.

## Actions Taken
1. Located the changelog's refresh point in git history: `git log -- <path>` names `1d43dbd38b` (2026-09-16, "docs(release-notes): record the dispatch-guard work and correct three stale counts") as the newest commit touching the file; `git rev-list --count 1d43dbd38b..HEAD` = 231 commits. HEAD commits run through 2026-09-19.
2. Ran a full-file term scan of the changelog for the focus vocabulary (`orca`, `ledger`, `admission`, `protocol`, `migration`, `source root`, `.opencode`, `compatibility`, `dispatch`) plus every heading: 114 matches. Zero `orca` matches; zero `admission` matches; `protocol` appears only as terminal-proof prose (L13, L547); the live-root spelling is `.opencode/...` throughout (L22, L84, L146, L366, L537, L580).
3. Enumerated the post-refresh workstreams from the commit log and pulled `git show --stat` on representative commits: 041's closure and the compat-root refactors (09-17/18), the `050-spec-protocol-ledger-events` packet (created `9e650decee`, closed `6e82579080`), the compiled-routing admission commits (09-19), the orca packet commits (09-19), and the documentation-correction commits (09-18/19). Also inventoried the 033 parent's children: 001-042 — the ledger-events packet (050) is not among them.
4. Gateway append: the first attempt was refused (`stable-identity-missing`, exit 1, nothing written) — live confirmation that the 049-050 admission tightening now requires record identity the pack schema omits, the same refusal iteration 1 documented; re-appended with `runId`/`sessionId`/`lineageId` = `rsr-2026-09-19T18-45-00Z` and confirmed exit 0 (`projectionRefreshed: true`, ledger sequence 5, event `deep-research.ledger.iteration-completed`).

## Findings

### P1 - The changelog's coverage ends 231 commits before HEAD
Evidence: the newest commit touching the file is `1d43dbd38b`, dated 2026-09-16; `git rev-list --count 1d43dbd38b..HEAD` = 231. That commit recorded the dispatch-guard work, which the changelog covers at L33 and L282-284 — so the document was current as of its refresh and everything below postdates it by construction.

### P1 - The 041 source-root migration and its compatibility decision are absent
Evidence: the changelog's live-root references are all `.opencode/...` (runtime home at L84: `.opencode/skills/system-spec-kit/runtime/cli/`; advisor CLI at L146; hook symlink farm at L366; Figma move at L537; upgrade notes at L580). The migration closed 2026-09-17 (`60f0e91764`) and its compatibility surface was settled 2026-09-18 (`8b2b831184` make the compatibility root a real directory, `1df31d154b`, `161e478f70`, `c34e1bd73b` retire the dead aliases, `2a57cc635d` restore `.opencode/bin` until callers move) — all after the last refresh. The Upgrade Notes (L577-580) affirm completeness ("There is no single big migration. The common path still works... The concrete moves:") while omitting a root-wide relocation; this is the one place where omission shades into staleness of an affirmative claim.

### P1 - The orca packet is absent (zero `orca` matches)
Evidence: the scan returns zero case-insensitive `orca` matches in 600 lines, corroborating iteration 2's full-file check. The packet shipped 2026-09-19: `a3272f5944` adds it (mcp-tooling SKILL/ROUTER/README, `changelog/v1.7.0.0.md`, advisor artifact, evidence report under `.skilled/skills/mcp-tooling/`), then `eeb149daf7`, `3bec6add68`, `e6beb0c932`, `a82e68dc51`, `8545a7b1ba` expand, polish and mirror it. The changelog's MCP section (L505-537) predates it.

### P2 - The post-flip ledger events work is absent
Evidence: the ledger section (L226-235) narrates the dark landing, shadow parity and the flip only. After the refresh: `9e650decee` created the `050-spec-protocol-ledger-events` packet (spec, plan, tasks, acceptance criteria, metadata; +988 lines) and `6e82579080` closed it, changing the runtime (`deep-research-ledger-schema.ts` plus a new vitest) and the packet docs. `protocol` never appears in a ledger sense (L13/L547 are terminal-proof prose).

### P2 - The compiled-routing admission checker work is absent
Evidence: zero `admission` matches in the scan, and no compiled-routing section among the document's headings. The workstream lands 2026-09-19: `35fe2acd3c` (plan), `bbb7d23386` (check hubs against their playbook routing gold), `b9589efbd9` (gate activation and the flip on the admission check), `9365fbc83d` (close four admission drifts across two hubs; touches `.skilled/skills/system-deep-loop/hub-router.json`, activation manifests and playbooks), `53463d16f2` (CI wiring).

### P2 - The documentation-correction commits postdate the refresh and are unreflected
Evidence: `4dcc8c8f49` (2026-09-18) corrects ten false claims across `.opencode/README.md`, seven SYNC files, git-hooks READMEs, cli-hermes docs and one runtime script; `67fa4f7b8e` states "what the compatibility root and the retired guides really hold"; `1bb11a2af2` corrects the log-writer inventory. Individually they are not changelog material, but they confirm the tree moved past the draft and that the layout facts the changelog states in `.opencode` terms are now documented as compatibility-root policy elsewhere.

### Confirmed holds (evidence-backed)
- Dispatch-guard coverage (L33, L282-284) matches the work the last refresh recorded — the narrative was accurate at the refresh point.
- The ledger flip narrative (L226-235) matches the pre-refresh ledger commits: the flip, the projections and the fail-closed guard are the recorded state; only the follow-on events/protocol work is missing.

## Questions Answered
- Q4 (substantially): every workstream named in the question is absent from the changelog narrative. Coverage ends at the 2026-09-16 dispatch-guard recording; the 041 migration (09-17/18), the 050 ledger/protocol packet (09-18/19), the compiled-routing admission work (09-19), the orca packet (09-19) and the documentation-correction commits (09-18/19) all postdate it. The one affirmative-claim casualty is the Upgrade Notes' completeness framing (L577-580).
- Q5 (input): the gaps are additive — a post-draft section plus an Upgrade-Notes amendment — not grounds for a rewrite of the changelog; consistent with iteration 3's README verdict.

## Questions Remaining
- Q5 (final verdict): rewrite vs targeted corrections — evidence to date favors targeted corrections for both documents.
- Q1 residuals (carried): L15 gate tolerance; `.hermes` skills/agents mirror contents.
- Q2 residuals (carried): compiled-router closure status for sk-design; Rust placement; `@markdown`/`deep-ai-council` renames.
- Q3 residuals (carried): clone-slug redirect status; `ai-council` vs `deep-ai-council` mode-key naming; "121 advisor test files / 872 tests" count; `AC_CLOSURE`/`AC_COVERAGE` in `dist/`; Node "18+" engines; `.utcp_config.json` template count; Related Documents links; doctor 12-vs-13 and templates 16-vs-18.
- New residual: whether the changelog mentions `.skilled` anywhere was not directly grepped (the date evidence already settles that 041 cannot be narrated); the scan's final four match lines (changelog L581-600) were not displayed — no `orca`/`admission` occurrence was seen, and orca absence is independently confirmed by iteration 2.

## Next Focus
Q5 - consolidate the rewrite-vs-targeted-corrections verdict across both documents, then close the carried residuals or hand off.

## SCOPE VIOLATIONS
None. All writes stayed inside the 042 research directory; the researched surface was read-only.
