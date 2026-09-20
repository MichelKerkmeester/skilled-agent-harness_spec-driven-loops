# Iteration 007 - Changelog rows, line-exact: every stale, mislabeled, missing or understated changelog claim with its current truth

## Focus

Changelog rows, line-exact: for every stale, mislabeled, missing or understated changelog claim (path and root naming, the symlink-rejection parenthetical, mode and family counts, the Upgrade Notes completeness claim, retired capability claims, and the absent post-draft work), record the exact line number, the exact current wording, the exact current truth and the commit or file that proves it.

## Actions Taken

1. Loaded the run state and the six repo-rule files the Gate 5 trigger table names for this action (evidence, uncertainty, the four communication rules) before the first write.
2. Read `CHANGELOG-v4.0.0.0.md` end to end in four line ranges (L1-161, L162-331, L332-481, L482-600).
3. Probed the live tree: the alias map under `.opencode`, `.skilled` and `.hermes`, listings for the skill packets, hooks, commands, mcp-tooling, sk-code and deep-loop, a symlink census under the hooks gather tree, the repo-rules file list and `wc -l AGENTS.md`.
4. Ran git forensics: 231 commits after the changelog's last touch (counted with `git log --oneline 1d43dbd38b..HEAD`), per-claim commit stats (c34e1bd73b, 2a57cc635d, 173ce63f59, 3a822e5156, fd8213edb9, 908d9e6272, 0195daea65, 12ede9a43c, 6cbaf58d3b, a3272f5944, 02589c0bfd), `rg -n` line pins for every quoted claim and a full `.opencode/` reference inventory.
5. Budget note: the workflow's 12-call cap was exceeded because the mandatory gate loads (trigger-index lookup, REPO RULES router, six rule files) preceded the five research probes and the four artifact writes. Research actions stayed at five.

## Findings

| # | Changelog line(s) | Exact current wording (abridged) | Current truth | Proof |
|---|---|---|---|---|
| 1 | L41, L511 | "a single `mcp-tooling` skill with nine modes" / "one skill with nine modes" | Ten modes ship. `mcp-orca-cli` joined after the changelog's last touch. The changelog never says "orca" (0 matches) | `.skilled/skills/mcp-tooling` listing (10 `mcp-*` dirs), commits a3272f5944 (2026-09-19) and e6beb0c932 |
| 2 | L433, L435 | surface list "`sk-code-webflow`, `sk-code-opencode`, `sk-code-mobile-cli` and `sk-code-obsidian`" / "The mobile-cli surface covers the Pi Remote mobile app" | Three surfaces ship. The mobile-cli packet was retired on 2026-09-19, and the retirement commit names the changelog among the 7 remaining residue files | commit 173ce63f59 ("Removed the packet (85 tracked entries)... 81 files -> 7, each one a changelog entry"), `.skilled/skills/sk-code` listing, `rg -c mobile-cli` = 2 |
| 3 | L278 | "generated markdown-only copies of every skill and every agent persona (Hermes scans a linked directory in full, so symlinks were rejected on evidence)" | The skill mirror is generated copies. The agent tree is a symlink: `.hermes/agents -> ../.skilled/agents`. The blanket symlink-rejection parenthetical no longer describes the shipped folder | `ls -la .hermes`, commits fd8213edb9 (2026-09-17) and 3a822e5156 (2026-09-15, "the Hermes link ... read the source instead of the mirror") |
| 4 | L45, L553 | "Twelve repo rules under `repo-rules/`" / "Twelve rule files under `repo-rules/`" | Thirteen rule files. L553's enumeration names twelve and omits `answer-the-actual-request.md`, which the changelog never names (0 matches) | `ls repo-rules` (13 files), the 13-row trigger table and index in `REPO RULES.md`, commit 6cbaf58d3b (2026-09-18) |
| 5 | L26, L592 | "six `/deep:*` commands" / "The six modes behave as before" | Five modes are registered (research, review, ai-council, agent-improvement, model-benchmark) and five command files ship. The skill-benchmark lane was retired, which L203 and L581 record, so L26 and L592 contradict the document's own retirement notes | `mode-registry.json` keys, `.skilled/commands/deep` listing, commit 02589c0bfd (2026-09-18), no skill-benchmark residue in registry or commands |
| 6 | L22, L72, L78, L84, L146, L366, L537, L580, L581 | every `.opencode/...` path reference, e.g. "`node .opencode/bin/skill-advisor.cjs`", "`.opencode/skills/system-spec-kit/runtime/cli/`", "`.opencode/specs/`" | The canonical roots are `.skilled/*` and the changelog never names `.skilled` (0 matches). Every `.opencode/...` reference resolves only through compatibility symlinks (specs is a two-hop chain: `.opencode/specs -> .skilled/specs -> ../specs`). No reference is dead today. `.opencode/bin` was retired 2026-09-19 15:02 and restored 17:38 the same day after roughly 75 callers were found | `ls -la .opencode`, `ls -la .skilled`, commits c34e1bd73b and 2a57cc635d, packet 041-skilled-source-root-migration |
| 7 | whole document (Q4) | n/a, the absence itself | 231 commits landed after the changelog's last touch (1d43dbd38b, 2026-09-16) and none is recorded: the `.skilled` source-root migration, the deep-loop ledger, protocol and admission work, the orca packet and its three follow-ups, the mobile-cli retirement, the alias retire/restore and the documentation-correction commits | commit count from `git log 1d43dbd38b..HEAD` (231), plus per-commit receipts (beb1a0bcc6, 6e82579080, 9e650decee, b9589efbd9, 9365fbc83d, bbb7d23386, a3272f5944, 173ce63f59, c34e1bd73b, 2a57cc635d, 1bb11a2af2, d5c3d08fdd, 02589c0bfd) |
| 8 | L577, L579 | "This release does close out a long chain of renames and removals... The concrete moves:" then "The repo rule `prose-mechanics.md` to `communication-prose.md`." | The rename list omits the two reply-rule renames that landed before the changelog's last touch: `communication-handoff-and-questions.md` to `communication-handoff.md` and `communication-presenting-decisions.md` to `communication-decisions.md`, plus the earlier unprefixed names documented in 12ede9a43c. The changelog never names the old names (0 matches) | commits 0195daea65 and 908d9e6272 (both 2026-09-15), 12ede9a43c, `rg -c 'presenting-decisions\|handoff-and-questions'` = 0 |
| 9 | L366 | "The `.opencode/hooks/` directory gathers every hook through 102 relative symlinks" | The gather tree is `.skilled/hooks` and holds 101 symlink entries (recursive count). `.opencode/hooks` is a one-entry alias to it. Whether the draft's 102 counted the alias entry is not enumerated by the claim | `ls -la .opencode/hooks`, recursive symlink count under `.skilled/hooks` = 101 |
| 10 | L45, L553 | "fell from 496 lines to 283" / "went from 496 lines to 283" | `wc -l AGENTS.md` = 284. The latest commit touching the file (6cbaf58d3b, 2026-09-18) added the new rule and edited the root document | `wc -l AGENTS.md`, commit 6cbaf58d3b |

Held claims (verified true this iteration, no action): six mode-registry hubs (L21/L55), sk-design as a four-mode hub (L379-386), seven `cli-*` executors with `cli-gemini` and `cli-copilot` gone (L340/L581), the `/interface:*` family gone (the design command set is chart, diagram, extract), `/rewrite:explain-visually` gone, twenty-two hook packages (22 directories under `.skilled/hooks`), the `mcp-figma` move resolving through the alias (L537), the spec-path compatibility claim (L72) and `mcp-webflow` removal.

Secondary observations: `.skilled/plugins` symlinks back to the real `.opencode/plugins`, so not every root migrated. `.opencode` also carries aliases for `scripts`, `changelog` and `manual-testing-playbook`. Commit 1d43dbd38b corrected three stale counts and four count drifts plus two line-count drifts still stand. The changelog is internally inconsistent: L26 and L592 say six while L203 and L581 record the retirement that leaves five.

## Questions Answered

- Q1 (changelog side): answered at line level. All nine `.opencode/` reference lines remain true through compatibility aliases and none is dead. The canonical root is `.skilled`, which the changelog never names. `.opencode/bin` was retired then restored the same day on evidence that roughly 75 callers still name the path.
- Q2 (changelog side): pinned. nine to ten mcp modes, four to three sk-code surfaces, twelve to thirteen repo rules, six to five deep modes, Hermes agent mirror copies to symlink, hooks 102 to 101 (scope caveat noted).
- Q4: answered. 231 post-touch commits, categorized. All four named categories from the research topic are confirmed absent from the narrative: the source-root migration, the deep-loop ledger, protocol and admission fixes, the orca packet and the documentation-correction commits.
- Q5: unchanged. Every drift is a count, a path root, a label or a missing entry, so targeted corrections suffice. The repo's own precedent is three correction commits to this changelog already (926cb2db2e, 3a822e5156, 1d43dbd38b).

## Questions Remaining

- Changelog residuals: L96 "Forty rules are registered" (not re-verified, no rules manifest found under `runtime/cli/spec`), L32/L278 "eighteen of the twenty-two hook packages" (the repo-guards plugin was not read), chart and diagram form counts (L385 29 forms, L386 27 types) not re-counted, and the historical narrative numbers (L11 28KB and 3,000 lines, L108 22 plus 16 children, L114 1,275 lines and 175 vs 944, L228 178 recommendations, L90 42 surfaces, L120 44 alerts).
- README residuals carried from iteration 6: advisor test counts (L412), Node engines (L92), `.utcp_config.json` 14 vs 7 (L894-902), Related Documents links (L420-431), L609 96/76 totals, L936 Motion.dev naming, shields.io badge redirect behavior.
- Q2 residuals: compiled-router closure for sk-design (L392 says planned, not shipped, and was not re-verified), Rust placement, `@markdown` and `deep-ai-council` renames.
- Q1 residual: L130 anchor-resolver behavior under the two root names.

## Next Focus

Close the residual numerics above (the Hermes bridge count from the repo-guards plugin, the forty-rules count, the chart and diagram form counts), then the carried README and Q2 residuals.

## SCOPE VIOLATIONS

None. All writes stayed within `iterations/iteration-007.md`, `deltas/iter-007.jsonl`, and the contract-mandated temp record consumed by the append gateway.
