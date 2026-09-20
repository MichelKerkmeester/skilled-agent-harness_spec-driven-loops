# Research Synthesis: Freshness Audit of CHANGELOG-v4.0.0.0.md and README.md

## 1. Orientation

### Research Topic
This synthesis report establishes whether `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` and the root `README.md` still tell the truth after the last ~100 commits [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deep-research-strategy.md:56-59]. The audit specifically evaluates the impact of the `.skilled` source-root migration (packet 041) [SOURCE: specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/spec.md:1-50], the deep-loop fixes (packets 049-050: ledger, protocol, and admission tightening) [SOURCE: commit 6e82579080], the retirements and moves (such as `sk-code-mobile-cli` and `system-deep-loop` benchmark lane) [SOURCE: commit 173ce63f59] [SOURCE: commit 02589c0bfd], the addition of the `mcp-orca-cli` packet to `mcp-tooling` [SOURCE: commit a3272f5944], and recent documentation-correction commits [SOURCE: commit 4dcc8c8f49] [SOURCE: commit 1d43dbd38b].

### Run Shape and Governance
The research run operated under the following authoritative parameters:
- Session: `rsr-2026-09-19T18-45-00Z`, generation 1 [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deep-research-state.jsonl:1]
- Total iterations: 10 completed iterations [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:1-93]
- Stop policy: `max-iterations`, closing on the iteration ceiling (`maxIterationsReached`) [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deep-research-state.jsonl:11]
- Convergence threshold: 0.05 (recorded as telemetry only; never allowed to truncate the investigation) [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deep-research-strategy.md:80-84]
- New information ratio sequence: 0.72, 0.66, 0.62, 0.50, 0.50, 0.50, 0.40, 0.32, 0.22, 0.23 [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deep-research-dashboard.md:32-44]

### What the Run Establishes
1. **Adjudication of 40 Total Claims**: Across ten iterations, 40 distinct claims were extracted, tracked, tested, and adjudicated with primary evidence (23 in `CHANGELOG-v4.0.0.0.md` and 17 in `README.md`) [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-009.md:19-68] [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:20-77].
2. **Compatibility Aliases Hold**: Every `.opencode/...` path in the changelog resolves through git-tracked relative symlinks into `.skilled/`. Zero path references are dead, although the changelog exclusively uses pre-migration root naming while repo policy establishes `.skilled/` as canonical [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-005.md:16-35] [SOURCE: .opencode/README.md:1-30].
3. **Absence of Post-Draft Work**: Exactly 231 commits landed after the changelog's last recorded touch (commit `1d43dbd38b`, 2026-09-16). None of the post-draft work (packet 041 source-root migration, packet 050 ledger events, compiled-routing admission check, orca packet, mobile-cli retirement, doc corrections) is narrated [SOURCE: commit 1d43dbd38b] [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-004.md:14-31].
4. **Targeted Corrections Suffice**: Exactly 15 rows are marked for application (9 changelog rows, 6 README rows). 25 rows are marked do-not-apply. Neither document requires a full rewrite [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:44-77].

### What the Run Does Not Establish
1. **Historical Ephemeral Numerics**: Pre-release metric claims in the changelog (e.g. L11 28KB command/3,000-line template, L90 42 surfaces, L108 22 remediation children, L114 1,275 lines/175 vs 944, L120 44 Dependabot alerts, L228 178 recommendations) belong to drafting-time milestones whose intermediate artifacts no longer exist in re-derivable form; these remain unverified [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-009.md:38] [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:28].
2. **Behavioral Code Trace of Anchor Resolution**: Changelog L130 behavior regarding structural boundaries hoisting state above the outermost source root was verified by inspecting source configuration arrays (`SOURCE_ROOT_NAMES`) but not by executing runtime integration test cases [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:189-191] [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-005.md:39-41].
3. **External Network Probing**: README L15 badge URL redirect behavior on `shields.io` was not tested against live external networks, respecting sandbox safety [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-006.md:35] [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:89].
4. **Out-of-Tree Test Suite Provenance**: The origin of the README L412 claim ("121 advisor test files, 872 tests") is not present in the git repository tree and was not discovered [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-008.md:27].
5. **No Direct Document Edits**: As a research synthesis step, this work establishes verified findings and exact replacement text; applying the edits to `CHANGELOG-v4.0.0.0.md` and `README.md` is reserved for the orchestrator [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:89-93].

---

## 2. Verdict Tables

### Iteration Revision Notes
Where earlier iterations disagreed or left items unverified, the later adversarial and re-verified passes govern:
- **Row A7 (Hermes hook bridges)**: Iteration 8 matched 17 literal names in `__init__.py` and left 1 unconfirmed (status: NARROWED). Iteration 10 read `.hermes/SYNC.md:87` which explicitly lists exactly four non-bridged packages (`codex-watchdog`, `directive-lifecycle`, `permission-policy`, `hook-install`). With 22 package directories in `.skilled/hooks/`, 22 - 4 = 18 bridged packages. `session-lifecycle` is confirmed as the 18th bridged package via session-start advisories and cleanup wiring (SYNC.md:78-86). Iteration 10 confirmed "eighteen" as TRUE, superseding Iteration 9's NARROWED status [SOURCE: .hermes/SYNC.md:78-87] [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:22].
- **Row A8 (Hook relative symlinks)**: Iteration 1 flagged 101 symlinks vs 102 claimed. Iteration 8 and 10 proved that `.skilled/hooks/` contains 101 internal relative symlinks, while the `.opencode/hooks` gather directory alias itself is the 102nd relative symlink. Iteration 8 confirmed the claim holds under an inclusive counting rule, superseding Iteration 1's drift flag [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-008.md:19].
- **Row A18 (sk-design compiled-router caveat)**: Iteration 9 marked L392 as UNVERIFIED. Iteration 10 inspected the compiled router engine (`.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`) and confirmed that `HUB_CHILD` enumerates exactly five hubs (`sk-code`, `system-deep-loop`, `mcp-tooling`, `cli-external-orchestration`, `sk-doc`). `sk-design` is absent from compiled routing. Iteration 10 confirmed the caveat holds, superseding Iteration 9's UNVERIFIED status [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:1-100] [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:26].
- **Row B6 (README Related Documents anchor)**: Iteration 9 reported zero matches for "Related Documents" and raised an anchor flag. Iteration 10 demonstrated that Iteration 9's search was a case-sensitive grep artifact against the uppercase heading `## 6. RELATED DOCUMENTS` at README.md:1030. All 10 link targets exist. Iteration 10 confirmed the row, superseding Iteration 9's anchor flag [SOURCE: README.md:1030-1046] [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:24].

### Table A: `CHANGELOG-v4.0.0.0.md` (23 rows)

| # | Line(s) | Exact Current Wording | Verified Current Truth with Proof | Proposed Replacement | Status / Confidence |
|---|---|---|---|---|---|
| A1 | L41, L511 | "a single `mcp-tooling` skill with nine modes" / "one skill with nine modes that reads which mode you want and routes to it" [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:41] [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:511] | Ten modes ship. `mcp-orca-cli` joined post-draft (2026-09-19) as the tenth mode; the changelog never mentions orca (0 matches). Proof: `.skilled/skills/mcp-tooling/mode-registry.json` defines 10 modes (6 workflow + 4 transport); `.skilled/skills/mcp-tooling/` holds 10 `mcp-*` directories; commits a3272f5944 and e6beb0c932 [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:1-30] [SOURCE: commit a3272f5944] [SOURCE: commit e6beb0c932]. | "ten modes" in both places, optionally naming `mcp-orca-cli` | FELL (high) |
| A2 | L26, L592 | "run as one `system-deep-loop` skill with six `/deep:*` commands" / "The six modes behave as before." [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:26] [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:592] | Five modes and five command files ship. L203 and L581 of this changelog record the retirement of the skill-benchmark lane, contradicting L26 and L592. L26 also references "the two benchmarks" where only model-benchmark ships. Proof: `mode-registry.json` registers 5 active modes (`research`, `review`, `ai-council`, `agent-improvement`, `model-benchmark`); `.skilled/commands/deep/` holds 5 command files; commit 02589c0bfd [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json:1-25] [SOURCE: .skilled/commands/deep/:1] [SOURCE: commit 02589c0bfd]. | "Research, review, ai-council, agent-improvement and the model benchmark run as one `system-deep-loop` skill with five `/deep:*` commands." / "The five modes behave as before." | FELL (high) |
| A3 | L45, L553 | "Twelve repo rules under `repo-rules/`" / "Twelve rule files under `repo-rules/`" [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:45] [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:553] | Thirteen rule files ship. L553's enumeration names twelve rules and omits `answer-the-actual-request.md`. Proof: `repo-rules/` contains 13 `.md` files; `REPO RULES.md` trigger table routes all 13; commit 6cbaf58d3b [SOURCE: repo-rules/:1] [SOURCE: REPO RULES.md:1-40] [SOURCE: commit 6cbaf58d3b]. | "Thirteen repo rules" / "Thirteen rule files", naming `answer-the-actual-request.md` | FELL (high) |
| A4 | L45, L553 | "The root document fell from 496 lines to 283" / "went from 496 lines to 283 across six passes" [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:45] [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:553] | `AGENTS.md` is currently 284 lines. Proof: `wc -l AGENTS.md` = 284; commit 6cbaf58d3b touched `AGENTS.md` to add Gate 5 routing after the changelog draft [SOURCE: AGENTS.md:1-284] [SOURCE: commit 6cbaf58d3b]. | "to 284" in both places | FELL (high, minor) |
| A5 | L433, L435 | "`sk-code-webflow`, `sk-code-opencode`, `sk-code-mobile-cli` and `sk-code-obsidian`" / "The mobile-cli surface covers the Pi Remote mobile app on SvelteKit" [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:433-435] | Three surface packets ship: webflow, opencode, obsidian. The `sk-code-mobile-cli` packet was retired on 2026-09-19 in commit 173ce63f59, which specifically cited the changelog among 7 residue files. Proof: `.skilled/skills/sk-code/` directory listing; commit 173ce63f59; `rg -c mobile-cli` = 2 [SOURCE: .skilled/skills/sk-code/:1] [SOURCE: commit 173ce63f59]. | Drop `sk-code-mobile-cli` from L433 and delete the L435 mobile-cli sentence | FELL (high) |
| A6 | L278 | "generated markdown-only copies of every skill and every agent persona (Hermes scans a linked directory in full, so symlinks were rejected on evidence)" [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:278] | The skill mirror (`.hermes/skills/`) consists of generated copies, but the agent tree (`.hermes/agents`) is a git-tracked symlink pointing to `../.skilled/agents`. The blanket statement that symlinks were rejected on evidence is false for agents. Proof: `ls -la .hermes`; commits fd8213edb9 and 3a822e5156 [SOURCE: .hermes/:1] [SOURCE: commit fd8213edb9] [SOURCE: commit 3a822e5156]. | Narrow the parenthetical to the skill mirror and state that the agent tree ships as a symlink | FELL (medium, narrow) |
| A7 | L32, L278 | "bridges eighteen of the twenty-two hook packages" (both places) [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:32] [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:278] | Exactly 18 packages are bridged. Live census confirms 22 hook package dirs in `.skilled/hooks/`. `.hermes/SYNC.md:87` explicitly lists four packages as "Not bridged by nature" (`codex-watchdog`, `directive-lifecycle`, `permission-policy`, `hook-install`). The 18th bridged package is `session-lifecycle` via session-start advisories and cleanup wiring (SYNC.md:78-86). 22 - 4 = 18. Proof: `.hermes/SYNC.md:78-87`; `.skilled/hooks/` directory census [SOURCE: .hermes/SYNC.md:78-87] [SOURCE: .skilled/hooks/:1]. | None (keep "eighteen"; confirmed in Iteration 10, superseding Iteration 9 NARROWED) | CONFIRMED (high) |
| A8 | L366 | "The `.opencode/hooks/` directory gathers every hook through 102 relative symlinks that point back to each hook's real home." [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:366] | The gather tree holds 101 internal relative symlinks (0 absolute). The `.opencode/hooks` directory entry itself is a relative symlink to `.skilled/hooks`, yielding 102 relative symlinks inclusively. Proof: symlink census under `.skilled/hooks/` and `ls -la .opencode/hooks` [SOURCE: .skilled/hooks/:1] [SOURCE: .opencode/hooks:1]. | None required. Optionally "(the gather alias included)" | CONFIRMED (high) |
| A9 | L96 | "Forty rules are registered." [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:96] | Exactly 40 rules are registered. Proof: `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` contains exactly 40 rows (keys 0-39), each mapping to one `check-*.sh` script [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1-45]. | None (verified true) | CONFIRMED (high) |
| A10 | L385 | "one of 29 catalog forms" [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:385] | Exactly 29 template files exist in `.skilled/skills/sk-design/sk-design-chart/assets/templates/`, matching the `references/catalog.md` index. Proof: template inventory in iterations 8 and 10 [SOURCE: .skilled/skills/sk-design/sk-design-chart/references/catalog.md:1-40] [SOURCE: .skilled/skills/sk-design/sk-design-chart/assets/templates/:1]. | None (verified true) | CONFIRMED (high) |
| A11 | L386 | "across 27 types" [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:386] | Exactly 27 diagram types exist. `.skilled/skills/sk-design/sk-design-diagram/references/types/` holds 27 `type-*.md` files plus `README.md`. Proof: directory count in iterations 8 and 10 [SOURCE: .skilled/skills/sk-design/sk-design-diagram/references/types/:1]. | None (verified true) | CONFIRMED (high) |
| A12 | L22, L72, L78, L84, L146, L366, L537, L580, L581 | "A compatibility symlink keeps every old `.opencode/specs/...` reference working." / "the old location still resolves through a compatibility symlink" [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:22] [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:72] | Every sampled `.opencode/...` path in the changelog resolves through git-tracked compatibility symlinks into `.skilled/`. `.opencode/specs` is a two-hop chain (`.opencode/specs -> ../.skilled/specs -> ../specs`) sharing the same inode as top-level `specs/`. No reference is dead. Proof: commits c34e1bd73b and 2a57cc635d; live resolution tests [SOURCE: commit c34e1bd73b] [SOURCE: commit 2a57cc635d] [SOURCE: .opencode/:1]. | None for correctness. See A13 for root naming. | CONFIRMED (high) |
| A13 | whole document | The document never names `.skilled` (0 matches) [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:1-600] | The canonical source root moved from `.opencode/` to `.skilled/` in packet 041 (`041-skilled-source-root-migration`, commit ec33385ae5). `.opencode/*` survives only as compatibility aliases. While references resolve, the changelog naming is one release behind repository policy (`.opencode/README.md`). Proof: packet 041; `.opencode/README.md:1-30`; full text search [SOURCE: specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/spec.md:1-50] [SOURCE: .opencode/README.md:1-30]. | Add a short post-release note stating that the source root moved to `.skilled/` while `.opencode/*` compatibility aliases remain | NARROWED (medium, naming gap not breakage) |
| A14 | L577, L579 | "The concrete moves:" then the rename list [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:577-579] | The list omits two reply-rule renames that landed before the draft was frozen: `communication-handoff-and-questions.md` to `communication-handoff.md`, and `communication-presenting-decisions.md` to `communication-decisions.md`. The old names appear 0 times in the repo. Proof: commits 0195daea65, 908d9e6272, and 12ede9a43c [SOURCE: commit 0195daea65] [SOURCE: commit 908d9e6272] [SOURCE: commit 12ede9a43c]. | Add both renames to the concrete moves list | FELL (high, incomplete) |
| A15 | whole document (Q4) | No post-draft narrative exists [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:1-600] | 231 commits landed after the changelog's last touch (commit 1d43dbd38b, 2026-09-16). None is recorded: (1) .skilled source-root migration, (2) deep-loop ledger, protocol and admission tightening, (3) orca packet and follow-ups, (4) mobile-cli retirement, (5) alias retire and restore cycles, (6) documentation corrections. Proof: `git rev-list --count 1d43dbd38b..HEAD` = 231; commits beb1a0bcc6, 6e82579080, 9e650decee, b9589efbd9, 9365fbc83d, bbb7d23386, a3272f5944, 173ce63f59, c34e1bd73b, 2a57cc635d [SOURCE: commit 1d43dbd38b] [SOURCE: commit 6e82579080] [SOURCE: commit a3272f5944] [SOURCE: commit 173ce63f59] [SOURCE: commit b9589efbd9]. | Add a post-draft section covering these categories | FELL (high, missing narrative) |
| A16 | L11, L90, L108, L114, L120, L228 | "28KB command or a 3,000-line template" / "Forty-two surfaces that printed the list" / "Twenty-two remediation children" and "sixteen children in one day" / "1,275 lines across four core templates" and "175 lines instead of 944" / "forty-four open Dependabot alerts" / "178 recommendations" [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:11] [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:90] [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:108] [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:114] [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:120] [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:228] | Not re-verified. These describe pre-release historical events and milestones whose source artifacts no longer exist in a re-derivable form in the current tree. Proof: none gathered; outside named verification focus [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:28]. | Verify before editing; closed with flag in iteration 10, no edit proposed | UNVERIFIED (low, carried) |
| A17 | L130 | "a shared anchored root resolver, and a switch from the old specs-only deny-list to a structural boundary that hoists state above the outermost `.opencode`" [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:130] | Not re-verified via runtime execution trace. Code analysis shows `SOURCE_ROOT_NAMES = ['.skilled', '.opencode']`, so the behavioral intent survives, but exact fallback boundary behavior was not re-probed. Proof: none gathered; iteration 10 closed with flag [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:189-191]. | None until verified; closed with flag in iteration 10, no edit proposed | UNVERIFIED (low, carried) |
| A18 | L392 | "The other five hubs resolve through a compiled router contract first. This hub does not yet ... Joining the compiled closure is planned, not shipped." [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:392] | Holds. The compiled router engine (`.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`) explicitly enumerates `sk-code`, `system-deep-loop`, `mcp-tooling`, `cli-external-orchestration` and `sk-doc` in its `HUB_CHILD` table and throws `unknown hub` for any other hub. `sk-design` is absent from compiled routing. Proof: iteration 10 engine inspection [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:1-100] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md:1-50]. | None (holds; confirmed in Iteration 10, superseding Iteration 9 UNVERIFIED) | CONFIRMED (high) |
| A19 | L21, L55 | "Six hubs now route to modes." / "Six families made the move" [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:21] [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:55] | Exactly six parent hubs carry a `mode-registry.json` (`sk-code`, `sk-doc`, `sk-design`, `mcp-tooling`, `cli-external-orchestration`, `system-deep-loop`), and seven standalone skills exist (`sk-vision`, `sk-communication`, `sk-git`, `mcp-code-mode`, `system-spec-kit`, `system-skill-advisor`, `sk-prompt`). 6 + 7 = 13 total skills under `.skilled/skills/`. Proof: iteration 2 and 10 registry checks [SOURCE: .skilled/skills/:1]. | None (verified true) | CONFIRMED (high) |
| A20 | L340, L581 | "`cli-gemini` and `cli-copilot` are gone from the skill tree, the advisor's scoring and hub routing." / the removals list [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:340] [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:581] | Neither `cli-gemini`, `cli-copilot` nor `mcp-webflow` exists in any mode registry or command folder. The 7-executor CLI roster holds; `/interface:*` is gone; retired prompt skills are absent. Proof: iteration 2, 7, 10 registry and file scans [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:1-30] [SOURCE: .skilled/commands/:1]. | None (verified true) | CONFIRMED (high) |
| A21 | L379-386 | "One Hub, Four Modes" and the chart/diagram bullets [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:379-386] | `sk-design/mode-registry.json` defines four modes: `sk-design-fundamentals`, `sk-design-md-generator`, `sk-design-diagram`, `sk-design-chart`. Commands `/design:extract`, `/design:chart`, `/design:diagram` exist; chart/diagram are absent from sk-doc. Proof: iteration 2 and 10 checks [SOURCE: .skilled/skills/sk-design/mode-registry.json:1-30] [SOURCE: .skilled/commands/design/:1]. | None (verified true) | CONFIRMED (high) |
| A22 | L537, L580 | the `mcp-figma` move / "The deep-loop runtime's `storage/` became `database/`." [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:537] [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:580] | `mcp-figma` exists under `mcp-tooling/` and resolves via alias. `.skilled/skills/system-deep-loop/runtime/database/` exists on disk. Human Voice Rules base standard lives at `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`. Proof: iterations 2, 7, 10 tree checks [SOURCE: .skilled/skills/system-deep-loop/runtime/database/:1] [SOURCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:1-20]. | None (verified true) | CONFIRMED (high) |
| A23 | L581 | the removal list ("`memory_search` and `memory_save` are gone", "The four `deep_loop_graph_*` MCP tools were removed", "`/deep:command-benchmark`", "`/rewrite:explain-visually` is gone") [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:581] | All sampled removals hold: no memory binaries in `.skilled/bin`, no deep_loop_graph tools in MCP servers, `/deep:command-benchmark` removed, `/rewrite:explain-visually` absent. Proof: iteration 2, 7, 10 scans [SOURCE: .skilled/bin/:1] [SOURCE: .skilled/commands/:1]. | None (verified true) | CONFIRMED (high) |

---

### Table B: `README.md` (17 rows)

| # | Line(s) | Exact Current Wording | Verified Current Truth with Proof | Proposed Replacement | Status / Confidence |
|---|---|---|---|---|---|
| B1 | L92 | "**Prerequisites:** Node.js 18+ with `npm`, `git` and a POSIX shell." [SOURCE: README.md:92] | No reachable manifest supports Node.js 18. Shipped package engines specify: `>=20.11.0` (system-spec-kit, runtime, shared, deep-loop, sk-doc), `>=22` (sk-communication projection), `>=22.12.0` (spec-kit runtime/cli), `>=24.0.0 <25` (mcp-code-mode server), and bun `>=1.0.0` (sk-vision). Proof: `engines` field of 62 reachable `package.json` manifests examined in iteration 8 [SOURCE: .skilled/skills/system-spec-kit/package.json:1-20] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/package.json:1-20]. | "Node.js 20.11+ (22.12+ for the spec-kit runtime CLI)" | FELL (high, understated) |
| B2 | L412 | "Native package: 121 advisor test files, 872 tests." [SOURCE: README.md:412] | Unsupported by the tree. `.skilled/skills/system-skill-advisor/runtime/tests/` holds exactly 3 test files (~12 test cases), and only 6 advisor-path test files exist repo-wide. No documentation or historical harness in the tree supports 121 files / 872 tests. Proof: test file census in iterations 8 and 10 [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/:1]. | Drop the count or state the real count ("3 test files") | FELL (high, unsupported) |
| B3 | L609 | "96-feature catalog + 76-scenario playbook included" [SOURCE: README.md:609] | The 96-feature catalog holds (`FEATURE-CATALOG.md` states "Total catalog entries | 96", 97 files = index + 96). The 76-scenario playbook claim falls: the playbook index explicitly declares "96 features | 37 scenarios", exactly 45 scenario markdown files exist, and the number 76 appears 0 times in the packet. Proof: inspection of feature catalog and playbook indexes in iterations 8 and 10 [SOURCE: .skilled/skills/mcp-tooling/mcp-click-up/feature-catalog/FEATURE-CATALOG.md:1-20] [SOURCE: .skilled/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/MANUAL-TESTING-PLAYBOOK.md:1-20]. | "96-feature catalog + 37-scenario playbook" | NARROWED (high) |
| B4 | L894-902 | "External Integrations (via `.utcp_config.json`)" and the seven-item list [SOURCE: README.md:894-902] | `.utcp_config.json` actually defines 14 call templates (`aside`, `chrome_devtools_1`, `chrome_devtools_2`, `clickup_official`, `figma`, `github`, `gitkraken`, `magicpath`, `magnific`, `mobbin`, `notion`, `obsidian`, `refero`, `webflow`). The listed `clickup` (community server `@taazkareem/clickup-mcp-server`) is a phantom row with no template in the config, and 8 valid templates are unlisted. Proof: iteration 8 and 10 template enumeration of `.utcp_config.json` [SOURCE: .utcp_config.json:1-50]. | Enumerate the 14 actual `.utcp_config.json` templates and drop the phantom clickup (community) row | FELL (high, incomplete plus phantom) |
| B5 | L936 | "Replace the shipped Webflow + OpenCode + Motion.dev surfaces with your own" [SOURCE: README.md:936] | The shipped surface axis in `sk-code` consists of `sk-code-webflow`, `sk-code-opencode`, and `sk-code-obsidian`. Motion.dev is not an independent surface but an animation overlay folded into `sk-code-webflow`. Obsidian is completely omitted from the row. Proof: `sk-code/SKILL.md` and directory listings in iterations 8, 9, 10 [SOURCE: .skilled/skills/sk-code/SKILL.md:1-50]. | "Webflow + OpenCode + Obsidian surfaces", with Motion.dev described as an overlay | FELL (high, naming) |
| B6 | Related Documents (L1030) | Section heading `## 6. RELATED DOCUMENTS` and 10 internal documentation links [SOURCE: README.md:1030-1046] | Holds. The section exists at line 1030 of `README.md`. Iteration 9's zero-match search was a case-sensitive grep artifact against the uppercase heading. All 10 internal documentation link targets exist and resolve. Iteration 10 confirmed the heading and closed the residual without edits. Proof: `README.md:1030-1046`; file existence probes across all 10 link targets [SOURCE: README.md:1030-1046]. | None (holds; confirmed in Iteration 10, superseding Iteration 9 anchor flag) | CONFIRMED (high) |
| B7 | L9, L10, L36, L547, L638, L990 | "12 Specialized Agents" / "13 On-Demand Skills" [SOURCE: README.md:9-10] [SOURCE: README.md:547] | Exactly 12 agent definitions exist in `.skilled/agents/` (and mirrored in `.claude/agents/`), and exactly 13 skill packages exist in `.skilled/skills/` (matching L547 "13 advisor skill identities in `.skilled/skills/`"). Proof: directory counts in iterations 3, 6, 10 [SOURCE: .skilled/agents/:1] [SOURCE: .skilled/skills/:1]. | None (verified true) | CONFIRMED (high) |
| B8 | L59 | "12 specialized" and "20 domain skills" (architecture diagram) [SOURCE: README.md:59] | Unverified taxonomy. The tree and advisor recognize 13 skill identities, so the "20 domain skills" figure has no verified mapping in current documentation. Iteration 10 closed with flag; no edit proposed. Proof: none gathered; iteration 9 and 10 observation [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:28]. | Verify the intended scope before editing; closed with flag in iteration 10, no edit proposed | UNVERIFIED (low, new) |
| B9 | L413 | "Manual testing playbook: 47 scenario files spanning the native command surface" [SOURCE: README.md:413] | Exactly 47 scenario `.md` files exist across 9 topic folders under `.skilled/skills/system-skill-advisor/manual-testing-playbook/` (plus index and vitest harness = 49 hits). Proof: directory listing in iterations 3, 6, 10 [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/:1]. | None (verified true) | CONFIRMED (high) |
| B10 | L427 | "Four loop families (research, review, AI council, and improvement) ... giving five `/deep:*` loop commands in total." [SOURCE: README.md:427] | Exactly four family packet directories exist in `system-deep-loop/` (`deep-research`, `deep-review`, `deep-ai-council`, `deep-improvement`), improvement has two lanes (`agent-improvement`, `model-benchmark`), and five command files exist under `.skilled/commands/deep/`. Proof: iterations 3 and 10 directory checks [SOURCE: .skilled/skills/system-deep-loop/:1] [SOURCE: .skilled/commands/deep/:1]. | None (verified true) | CONFIRMED (high) |
| B11 | L534 | "Two co-equal lanes in the `system-deep-loop` improvement mode." [SOURCE: README.md:534] | Matches `system-deep-loop/mode-registry.json` precisely, which defines `agent-improvement` and `model-benchmark` under improvement backend. Proof: iterations 3 and 10 registry checks [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json:1-35]. | None (verified true) | CONFIRMED (high) |
| B12 | L696 | "32 command entry points across 7 command groups plus 3 root utilities." [SOURCE: README.md:696] | Exact. `.skilled/commands/` holds 32 command entry points across 7 groups (create 12, deep 5, design 3, doctor 3, prompt 1, rewrite 2, speckit 6) plus 3 root utility markdown files (`agent-router.md`, `goal-opencode.md`, `vision.md`). Proof: directory enumeration in iterations 3 and 10 [SOURCE: .skilled/commands/:1]. | None (verified true) | CONFIRMED (high) |
| B13 | L116, L323, L374, L379, L404 | advisor "nine commands" statements [SOURCE: README.md:116] [SOURCE: README.md:404] | Mutually consistent with `skill-advisor.cjs` and runtime command handlers layout. Proof: iterations 3 and 10 inspection [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:1-50]. | None (verified true) | CONFIRMED (high, enumeration residual) |
| B14 | L961-965, L976-984 | Core config files list and MCP shape block, specifically L966: "- **`.vscode/mcp.json`** - VS Code / Copilot MCP configuration wrapper." [SOURCE: README.md:961-966] [SOURCE: README.md:976-984] | Holds with exactly one miss: `.vscode/mcp.json` does not exist on disk, and `.vscode/` was deleted in commit 759713c41aa. Every other sampled config file (`CLAUDE.md`, `AGENTS.md`, `opencode.json`, `.utcp_config.json`, `.claude/mcp.json`) exists and resolves. Proof: commit 759713c41aa; iterations 3, 6, 10 file probes [SOURCE: commit 759713c41aa]. | Fix or drop the `.vscode/mcp.json` reference | NARROWED (high, one miss) |
| B15 | L156, L191, L161-173 | The spec-kit-docs.json contract and packet structure [SOURCE: README.md:156-173] | Matches shipped spec-kit levels (1, 2, 3, 3+, phase, review, research) and directory template contracts. The 042 packet itself conforms to this structure. Proof: iterations 3 and 10 packet checks [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/spec.md:1-40]. | None (verified true) | CONFIRMED (high) |
| B16 | L447 | "Rust Joins the Code" [SOURCE: README.md:447] | Not re-verified at the packet level. No `sk-code-rust` surface packet exists; Rust language guidance lives inside `sk-code-quality` stack guidance. Proof: directory listing in iterations 2 and 10 (inference only) [SOURCE: .skilled/skills/sk-code/:1]. | None until verified; closed with flag in iteration 10, no edit proposed | UNVERIFIED (low, inference) |
| B17 | L15 | The license badge URL targeting `img.shields.io` [SOURCE: README.md:15] | Not verified. GitHub API redirects the repo slug, but shields.io badge service redirect behavior was not tested (requires network call, excluded by read-only local sandbox). Proof: none gathered; iteration 10 closed with flag [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:28]. | None; closed with flag in iteration 10, no network check | UNVERIFIED (low, carried) |

---

## 3. Apply List per Document

### Final Apply List: `CHANGELOG-v4.0.0.0.md` (9 rows)

Iteration 10 marked exactly 9 rows for application (8 discrete text edits and 1 additive note) [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:44-57]:

1. **Row A1 (L41, L511)**: Change "nine modes" to "ten modes" in both locations, optionally naming `mcp-orca-cli` [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:41] [SOURCE: commit a3272f5944].
2. **Row A2 (L26, L592)**: Change "six `/deep:*` commands" to "five", and "The six modes behave as before." to "The five modes behave as before." [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:26] [SOURCE: commit 02589c0bfd].
3. **Row A3 (L45, L553)**: Change "Twelve repo rules" and "Twelve rule files" to "Thirteen", naming `answer-the-actual-request.md` [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:45] [SOURCE: commit 6cbaf58d3b].
4. **Row A4 (L45, L553)**: Change "283" to "284" in both places [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:45] [SOURCE: AGENTS.md:1-284].
5. **Row A5 (L433, L435)**: Drop `sk-code-mobile-cli` from the L433 list and delete the L435 mobile-cli descriptive sentence [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:433-435] [SOURCE: commit 173ce63f59].
6. **Row A6 (L278)**: Narrow the symlink-rejection parenthetical to the skill mirror and state that the agent tree ships as a symlink (`.hermes/agents -> ../.skilled/agents`) [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:278] [SOURCE: commit fd8213edb9].
7. **Row A13 (whole document)**: Add an additive note stating that the source root moved to `.skilled/` while the `.opencode/*` compatibility aliases remain [SOURCE: .opencode/README.md:1-30] [SOURCE: specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/spec.md:1-50].
8. **Row A14 (L577, L579)**: Add the two reply-rule renames to the concrete moves list: `communication-handoff-and-questions.md` to `communication-handoff.md`, and `communication-presenting-decisions.md` to `communication-decisions.md` [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:577-579] [SOURCE: commit 0195daea65] [SOURCE: commit 908d9e6272].
9. **Row A15 (whole document)**: Add a post-draft section covering the 231 post-draft commits: `.skilled` source-root migration, deep-loop ledger/protocol/admission work, the orca packet and follow-ups, mobile-cli retirement, alias retire and restore cycles, and documentation-correction commits [SOURCE: commit 1d43dbd38b] [SOURCE: commit 6e82579080] [SOURCE: commit a3272f5944].

### Final Apply List: `README.md` (6 rows)

Iteration 10 marked exactly 6 rows for application [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:58-68]:

1. **Row B1 (L92)**: Change "Node.js 18+" to "Node.js 20.11+ (22.12+ for the spec-kit runtime CLI)" [SOURCE: README.md:92] [SOURCE: .skilled/skills/system-spec-kit/package.json:1-20].
2. **Row B2 (L412)**: Drop "121 advisor test files, 872 tests" or state the real in-tree count ("3 test files") [SOURCE: README.md:412] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/:1].
3. **Row B3 (L609)**: Change "76-scenario playbook" to "37-scenario playbook" (the 96-feature half holds) [SOURCE: README.md:609] [SOURCE: .skilled/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/MANUAL-TESTING-PLAYBOOK.md:1-20].
4. **Row B4 (L894-902)**: Enumerate the 14 actual `.utcp_config.json` templates and drop the phantom `clickup` (community) row [SOURCE: README.md:894-902] [SOURCE: .utcp_config.json:1-50].
5. **Row B5 (L936)**: Change "Webflow + OpenCode + Motion.dev surfaces" to "Webflow + OpenCode + Obsidian surfaces", with Motion.dev described as an overlay [SOURCE: README.md:936] [SOURCE: .skilled/skills/sk-code/SKILL.md:1-50].
6. **Row B14 (L966, L976-984)**: Fix or drop the `.vscode/mcp.json` reference, which does not exist [SOURCE: README.md:966] [SOURCE: commit 759713c41aa].

### Do-Not-Apply List

#### Changelog (14 rows marked do-not-apply) [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:69-72]:
- **A7 (L32, L278)**: "eighteen of the twenty-two hook packages" is true; `.hermes/SYNC.md:87` excludes 4 packages, confirming 18 bridged packages including `session-lifecycle`.
- **A8 (L366)**: "102 relative symlinks" holds inclusively (101 internal relative symlinks + 1 relative alias directory entry).
- **A9 (L96)**: "Forty rules are registered" holds exactly (40 rows in validator registry).
- **A10 (L385)**: "29 catalog forms" holds (29 template files in chart assets).
- **A11 (L386)**: "27 types" holds (27 type files in diagram assets).
- **A12 (Multiple lines)**: Compatibility symlinks resolve (all 9 sampled `.opencode` paths are live).
- **A16 (Historical numerics)**: Pre-release metrics are historical narrative; artifacts no longer exist to re-derive. Closed with flag, no edit proposed.
- **A17 (L130)**: Anchor resolver behavior is unverified; closed with flag, no edit proposed.
- **A18 (L392)**: sk-design compiled router caveat holds; compiled router engine serves only 5 hubs and sk-design is not among them.
- **A19 (L21, L55)**: Hub roster holds (6 hubs + 7 standalones = 13 skills).
- **A20 (L340, L581)**: Retirements hold (cli-gemini, cli-copilot, mcp-webflow absent).
- **A21 (L379-386)**: sk-design 4 modes hold.
- **A22 (L537, L580)**: Figma move and `storage/` -> `database/` hold.
- **A23 (L581)**: Removals list holds.

#### README (11 rows marked do-not-apply) [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:73-74]:
- **B6 (L1030)**: Related Documents section exists at L1030 and all 10 links resolve.
- **B7 (L9, L10, etc.)**: 12 agents and 13 skills hold.
- **B8 (L59)**: Diagram "20 domain skills" is unverified taxonomy; closed with flag, no edit proposed.
- **B9 (L413)**: 47 scenario files hold.
- **B10 (L427)**: 4 families and 5 commands hold.
- **B11 (L534)**: Two co-equal improvement lanes hold.
- **B12 (L696)**: 32 command entry points hold.
- **B13 (L116, L404)**: Advisor nine commands hold.
- **B15 (L156, L161)**: Packet structure and docs contract hold.
- **B16 (L447)**: Rust placement is stack guidance; closed with flag, no edit proposed.
- **B17 (L15)**: License badge URL redirect behavior unverified without network; closed with flag.

### Adjudication Summary
40 rows were adjudicated in total: 15 rows apply (9 changelog, 6 README) and 25 rows do not apply (14 changelog, 11 README) [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:75-77]. Because every defect is an isolated numeric count, a path label, a dropped packet reference, or a missing post-draft summary section, targeted corrections are sufficient and neither document requires a full rewrite [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-005.md:44] [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:77].

---

## 4. Eliminated Alternatives

Across the ten research iterations, twelve alternative hypotheses, counting interpretations, and proposed paths were investigated and formally eliminated based on primary evidence:

1. **Full Rewrite of Either Document**: Ruled out in iterations 5, 8, and 10. Every sampled compatibility path is live; all defects found are countable, additive, or mechanical label corrections [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-005.jsonl:13] [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-010.jsonl:20].
2. **Editing Changelog Hermes Count from 18 to 17**: Ruled out in iteration 10. `.hermes/SYNC.md:87` explicitly names exactly four unbridged packages, establishing that `session-lifecycle` is the 18th bridged package (22 - 4 = 18) [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-010.jsonl:17].
3. **Re-locating README Related Documents Link Set**: Ruled out in iteration 10. The `## 6. RELATED DOCUMENTS` heading exists at line 1030; the iteration 9 zero-match was an artifact of case sensitivity [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-010.jsonl:18].
4. **Adding a Compiled-Router Correction to the sk-design Caveat (L392)**: Ruled out in iteration 10. The compiled router engine `HUB_CHILD` table serves only five hubs, excluding `sk-design`, confirming the caveat holds as written [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-010.jsonl:19].
5. **Editing 102 Hooks Symlink Count to 101**: Ruled out in iteration 8. While internal symlinks count 101, the `.opencode/hooks` gather directory alias itself is the 102nd relative symlink, making 102 defensible inclusively [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-008.jsonl:43].
6. **Explaining Nine mcp-tooling Modes via Alternate Counting Rules**: Ruled out in iteration 8. The mode registry splits 6 workflow modes + 4 transport modes = 10 total modes; no valid counting rule yields 9, and `mcp-orca-cli` is the post-draft tenth [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-008.jsonl:40].
7. **Explaining Six deep-loop Modes via Registry or Deprecated Lanes**: Ruled out in iteration 8. The registry defines 5 modes and `deprecatedModes` is empty; the README itself confirms five loop commands [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-008.jsonl:41].
8. **Hunting a Renamed Fourth sk-code Surface to Replace mobile-cli**: Ruled out in iteration 8. Only webflow, opencode, and obsidian surface packets exist on disk; mobile-cli was retired in commit 173ce63f59 with no successor [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-008.jsonl:42].
9. **Counting Twelve Repo Rules by Excluding a Non-Rule File**: Ruled out in iteration 8. `answer-the-actual-request.md` is routed by `REPO RULES.md`'s trigger table, establishing the true count as 13 [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-008.jsonl:44].
10. **Counting 76 Playbook Scenarios via Section Headings**: Ruled out in iteration 8. The 238 section headings do not define scenarios; the playbook index explicitly states 37 scenarios, and 76 does not appear anywhere in the packet [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-008.jsonl:45].
11. **Assuming Dead Path Debt in README from 041 Migration**: Ruled out in iteration 3. All sampled `.skilled/...` paths resolve; no dead pre-041 root spellings exist in the README body [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-003.jsonl:49].
12. **Expecting a Post-2026-09-16 Changelog Refresh in Git**: Ruled out in iteration 4. Commit `1d43dbd38b` is the newest touch to the changelog, dated 2026-09-16, sitting 231 commits behind HEAD [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-004.jsonl:10].

---

## 5. Divergence Map

### Saturated Directions
The following research avenues reached complete saturation:
- **Registry and Directory Counts**: Mode registries for `mcp-tooling` (10 modes), `system-deep-loop` (5 modes), `sk-code` (2 modes + 3 surfaces), `sk-design` (4 modes), and `sk-doc` (14 modes), plus command directory files, were counted repeatedly and matched against source manifests across iterations 2, 7, 8, and 10 [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:11].
- **Symlink and Alias Resolution**: The compatibility link farm under `.opencode/` and `.hermes/` was completely mapped with inode and readlink checks across iterations 1, 5, 7, and 10, confirming zero broken paths [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-005.md:30-33].
- **Post-Draft Commit Inventory**: The 231 commits between `1d43dbd38b` and HEAD were categorized into six clear buckets (migration, ledger/protocol, orca, mobile-cli, alias handling, documentation fixes) across iterations 4, 7, and 10 [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-004.md:14-31].
- **Document Level Edit Strategy**: Both documents were evaluated for rewrite versus surgical targeted editing in iterations 3, 5, 8, 9, and 10, unanimously converging on targeted edits [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:77].

### Pivots Taken and Not Taken
- **Pivot Taken (Iteration 8 - Adversarial Falsification)**: Rather than accepting initial discrepancy flags, iteration 8 tested inclusive counting, alternative grouping definitions, and git history to identify whether existing prose could be verified as true under reasonable interpretations [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-008.md:1-58].
- **Pivot Taken (Iteration 10 - Primary Source Split Resolution)**: Instead of carrying split findings forward into synthesis, iteration 10 used primary source documentation (`.hermes/SYNC.md`), engine implementation code (`compiled-route.cjs`), and case-insensitive heading mapping to resolve open splits definitively [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:20-29].
- **Pivot Not Taken (Live Daemon Execution)**: The research loop deliberately avoided spawning live background daemons (such as advisor or mcp servers) to prevent state mutation and socket contention during analysis [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-001.jsonl:30].
- **Pivot Not Taken (Live Network Probing)**: The loop refrained from calling external network URLs (e.g. `shields.io`), maintaining sandbox boundary compliance [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:89].
- **Pivot Not Taken (Re-deriving Ephemeral Historical Metrics)**: The loop refrained from inventing intermediate test files or benchmark data to justify pre-release prose metrics (Row A16), treating them as historical narrative [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:28].

### Remaining Frontier
The remaining frontier comprises the downstream implementation tasks assigned to the orchestrator:
- Execution of the 9 changelog edits (Rows A1-A6, A13, A14, A15) in `CHANGELOG-v4.0.0.0.md`.
- Execution of the 6 README edits (Rows B1-B5, B14) in `README.md`.
- Archival or provenance decision regarding pre-release historical metrics.

---

## 6. Open Questions

### Status of Key Questions
All five tracked key questions from the findings registry were resolved in substance by iteration 10 [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:80-86]:
- **Q1 (Path and Root References)**: Closed. Every `.opencode/...` reference resolves through tracked symlinks; the canonical root is `.skilled/`, requiring only additive note A13.
- **Q2 (Capability and Mode Claims)**: Closed. Mode counts, surface counts, and repo rules counts are resolved into rows A1-A6, A14, with Hermes confirmed at 18.
- **Q3 (Root README Claims)**: Closed. Stale claims are bounded to rows B1-B5 and B14; Related Documents anchor confirmed at L1030.
- **Q4 (Missing Post-Draft Work)**: Closed. 231 post-touch commits across six functional categories are missing and captured in row A15.
- **Q5 (Rewrite vs Targeted Corrections)**: Closed. Targeted corrections suffice for both documents (9 changelog, 6 README).

### Unresolved Residual Questions (5 open questions)
Iteration 10 left exactly 5 non-material residual open questions (unverified rows and carried provenance checks) that do not block application [SOURCE: specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-010.md:88-90]:

1. **Pre-Release Historical Numerics (Row A16)**: Changelog L11, L90, L108, L114, L120, and L228 recite drafting-time metrics ("28KB command", "1,275 lines across four core templates", "forty-four open Dependabot alerts", "178 recommendations") whose source artifacts were ephemeral. Does repository policy require archival provenance auditing for pre-release claims, or should they remain untouched as historical author narrative? [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:11] [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:108]
2. **Anchor Resolver Runtime Fallback Behavior (Row A17)**: Changelog L130 notes a structural boundary hoisting state above the outermost `.opencode`. In the live code (`skill-advisor-cli.ts:189-191`), `SOURCE_ROOT_NAMES` prioritizes `.skilled` before `.opencode`. Does runtime execution require an integration test fixture to verify multi-root fallback behavior across unusual workspace mount depths? [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:130] [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:189-191]
3. **Architecture Diagram "20 Domain Skills" Taxonomy (Row B8)**: README L59 contains an architecture diagram figure citing "20 domain skills" where L10, L547, and L990 cite "13 On-Demand Skills" (matching the 13 `.skilled/skills/` directories). Did the "20" count reflect an earlier taxonomy of sub-skills/modes, or was it an uncorrected diagram placeholder? [SOURCE: README.md:59] [SOURCE: README.md:547]
4. **Rust Guidance Structural Placement (Row B16)**: README L447 refers to Rust joining the code. Is Rust guidance intended to remain embedded within `sk-code-quality` stack guidance indefinitely, or is a dedicated `sk-code-rust` surface packet planned for future release? [SOURCE: README.md:447] [SOURCE: .skilled/skills/sk-code/:1]
5. **External Badge Redirects and Out-of-Tree Test Provenance (Rows B2, B17)**: README L412 cites "121 advisor test files, 872 tests" where only 3 test files exist in the tree. Did this count originate from an uncommitted external benchmark repository? Additionally, do `shields.io` badge endpoints (README L15) reliably follow GitHub repository rename redirects over live HTTPS? [SOURCE: README.md:412] [SOURCE: README.md:15]

---

## 7. References

### Git Commits
- `commit 1d43dbd38b`: Last touch to `CHANGELOG-v4.0.0.0.md` (2026-09-16), recording dispatch-guard work and correcting three stale counts.
- `commit a3272f5944`: Added `mcp-orca-cli` mode to `mcp-tooling` (2026-09-19).
- `commit e6beb0c932`: Follow-up expansion and mirror sync for `mcp-orca-cli`.
- `commit 02589c0bfd`: Retired skill-benchmark lane from `system-deep-loop` (2026-09-18).
- `commit 6cbaf58d3b`: Added `answer-the-actual-request.md` to `repo-rules/` and updated `AGENTS.md` to 284 lines (2026-09-18).
- `commit 173ce63f59`: Retired `sk-code-mobile-cli` packet (2026-09-19).
- `commit fd8213edb9`: Pointed runtime links and `.hermes/agents` symlink to `.skilled/` (2026-09-17).
- `commit 3a822e5156`: Hermes link reading source instead of mirror (2026-09-15).
- `commit c34e1bd73b`: Retired dead aliases following source root move (2026-09-18).
- `commit 2a57cc635d`: Restored `.opencode/bin` compatibility alias for external callers (2026-09-19).
- `commit 8b2b831184`: Made compatibility root `.opencode` a real directory with symlink children (2026-09-18).
- `commit 0195daea65`: Renamed `communication-handoff-and-questions.md` to `communication-handoff.md` (2026-09-15).
- `commit 908d9e6272`: Renamed `communication-presenting-decisions.md` to `communication-decisions.md` (2026-09-15).
- `commit 12ede9a43c`: Documented unprefixed communication rule names.
- `commit 759713c41aa`: Deleted `.vscode/` directory from repository root.
- `commit 4dcc8c8f49`: Corrected ten false claims across documentation files (2026-09-18).
- `commit 67fa4f7b8e`: Documented compatibility root contents.
- `commit 1bb11a2af2`: Corrected log-writer inventory.
- `commit 9e650decee`: Created packet `050-spec-protocol-ledger-events`.
- `commit 6e82579080`: Closed packet `050-spec-protocol-ledger-events`.
- `commit bbb7d23386`: Added compiled-routing admission checker against playbook routing gold.
- `commit b9589efbd9`: Activated compiled-routing admission gate.
- `commit 9365fbc83d`: Closed four admission drifts across two hubs.
- `commit 53463d16f2`: Wired compiled-routing admission checker to CI.
- `commit ec33385ae5`: Relocated authored asset tree from `.opencode/` to `.skilled/` (packet 041).

### Repository Documents and Anchors
- `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md`: Full 600 lines audited; lines 11, 21, 22, 26, 32, 41, 45, 55, 72, 78, 84, 90, 96, 108, 114, 120, 130, 146, 228, 278, 340, 366, 379-386, 392, 433-435, 511, 537, 553, 577-581, 592.
- `README.md`: Full 1052 lines audited; lines 9-10, 15, 36, 45, 59, 92, 96-97, 116, 156, 161-173, 180, 191, 261, 271, 278, 323, 374, 379, 404, 412, 413, 427, 447, 534, 547, 567, 591, 607, 609, 610, 638, 640-691, 696, 839, 894-902, 936, 945, 950, 961-966, 976-984, 990, 1030-1046.
- `AGENTS.md`: Lines 1-284 (Gate definitions and Confidence Thresholds).
- `REPO RULES.md`: Lines 1-40 (Rule index and trigger table routing 13 repo-rules).
- `.hermes/SYNC.md`: Lines 78-87 (Package bridge definitions and non-bridged exclusions).
- `.opencode/README.md`: Lines 1-30 (Canonical `.skilled/` naming policy).
- `.utcp_config.json`: Lines 1-50 (14 external integration call templates).
- `.skilled/skills/mcp-tooling/mode-registry.json`: Lines 1-30 (10 registered modes).
- `.skilled/skills/system-deep-loop/mode-registry.json`: Lines 1-25 (5 registered active modes).
- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json`: Lines 1-45 (40 registered validator rules).
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`: Lines 1-100 (`HUB_CHILD` five-hub enumeration).
- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md`: Lines 1-50 (Compiled routing parent hub roster).
- `.skilled/skills/sk-design/sk-design-chart/references/catalog.md`: Lines 1-40 (29 catalog forms index).
- `.skilled/skills/sk-design/sk-design-diagram/references/types/`: 27 diagram type specifications.
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/`: 47 scenario specification files.
- `.skilled/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/MANUAL-TESTING-PLAYBOOK.md`: Lines 1-20 (37 scenarios index).
- `.skilled/skills/mcp-tooling/mcp-click-up/feature-catalog/FEATURE-CATALOG.md`: Lines 1-20 (96 features index).

---

## 8. Appendix: Convergence Report

- Session: rsr-2026-09-19T18-45-00Z, generation 1
- Total iterations: 10 (stop policy: max-iterations, so the run closed on its ceiling)
- Stop reason: maxIterationsReached
- newInfoRatio sequence: 0.72, 0.66, 0.62, 0.50, 0.50, 0.50, 0.40, 0.32, 0.22, 0.23
- Convergence threshold: 0.05 (convergence was telemetry only on this run; it was never allowed to stop the loop)
- Findings registry at close: 35 key findings, 5 tracked key questions, 31 carried-forward questions
- Graph at close: 112 nodes, 106 edges

Synthesis complete: 23 changelog rows, 17 README rows, 5 open questions.

---

## Synthesis Corrections (added after independent review)

This report was written in two passes. The first pass carried six README rows and described the
README question as closed; an independent review on a second model family proved that was an
overclaim — the run's own iteration 3 and iteration 6 artifacts adjudicated materially more
README claims than the tables above carry. The recovered rows live in
`readme-verdict-rows.md`, written by a bounded repair pass over those two iterations.

Corrections that apply to the tables above:

- **README test counts (L412).** The proposed "3 test files" replacement is withdrawn. The
  `runtime/tests/` tree holds 55 test files at top level (3 `*.test.ts` plus 52 `*.vitest.ts`) and
  128 recursively, with 811 `it()`/`test()` cases, so the README's "121 advisor test files, 872
  tests" is approximately right and gets no edit. The census that produced "3" counted only the
  `*.test.ts` glob.
- **The Rust row (L447).** Withdrawn: that heading is changelog text, and the README contains no
  Rust text at all.
- **The Related Documents link count** is 12, not 10. The section exists at L1030 and all 12
  targets resolve.
- **The stop reason `maxIterationsReached`** is documented in `deep-research-strategy.md` §13 and
  the synthesis dispatch receipt, not in the state log, which carries no stop-reason field.
- **Commit `c34e1bd73b`** is dated 2026-09-19, not 2026-09-18.
- **The zero-count for the two renamed reply rules** is scoped to `repo-rules/`; the old names do
  appear in the rename packets' own historical records.
- **The 18th bridged hook package is unresolved.** Eighteen is right by count (22 package
  directories, four stay-outs named at `.hermes/SYNC.md:87`), but no source names the non-literal
  bridge, so no identity is claimed.

The per-claim verdicts on both documents are in `verdict-changelog.md` and `verdict-readme.md`
in the parent packet.
