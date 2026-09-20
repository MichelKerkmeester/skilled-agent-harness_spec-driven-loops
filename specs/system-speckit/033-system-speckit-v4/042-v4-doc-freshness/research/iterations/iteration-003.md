# Iteration 3 - Q3: The root README against the shipped repository

## Focus
Q3: Which statements in the root README about entry points, structure, commands or setup are now false after the source-root migration (041) and the packet moves? This iteration audited `README.md` (1052 lines) claim-by-claim against the working tree, with emphasis on install/setup, entry points, directory structure and the command inventory.

## Actions Taken
1. Read the full target document (README.md L1-1052) and extracted ~60 verifiable claims across section 1 Overview, section 2 Quick Start, section 3 Features (Spec Kit, Continuity, Skill Advisor, Deep Loop, Skills Library, Agent Network, Commands, Goal, Code Mode), section 4 Configuration and section 5 FAQ.
2. Ran one consolidated read-only verification pass (Node script; no repo tooling executed, no writes) over the working tree: directory listings (skills, agents, commands, templates, doctor assets), ~55 path-existence probes, symlink-target inspection for the runtime config surface (`.opencode`, `.claude`, `.pi`, `.codex`, `.cursor`, `.devin`, `.hermes`), six `mode-registry.json` reads, `.git/config`, package manifests, and the gate/threshold text in the live `AGENTS.md`.
3. Cross-checked README claims against iteration 1-2 findings and the 042 packet's known-stale exclusions.

## Findings

### P1 - Install step cannot run: no root `package.json` (README L99-100)
Claim: "Install root dependencies (file watcher + shared HTTP utilities)" via `npm install` at the repository root. Evidence: the repository root has no `package.json` (root directory listing; the manifest now lives at `.skilled/package.json`, with `.skilled/node_modules` beside it). `npm install` in a directory without a manifest fails with ENOENT. Post-041 relocation candidate. Correction direction: repoint step 2 at the actual manifest (e.g. `npm --prefix .skilled install`) or restore a root manifest.

### P1 - Clone URL and badges use a different repo slug than the shipped remote (README L14-16, L96-97)
Claim: clone `https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration.git`; all three badges target the same slug. Evidence: `.git/config` remote = `https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git`. One of the two is stale. GitHub rename redirects may keep the old clone URL working, but that is unverified this iteration (no network check) and would not hold for forks of the old slug. Correction: align README with the canonical slug, or verify the old slug still redirects.

### P1 - Gate system description stale: three gates claimed, five ship; Gate 1 bar changed (README L45, L261-297, L271)
Claim: "3 mandatory gates" (overview diagram and Features), Gate 1 = "confidence >= 0.70, uncertainty <= 0.35". Evidence: live `AGENTS.md` defines `GATE 4: SKILL-OWNED WORKFLOW TIEBREAKERS` (L88) and `GATE 5: REPO RULES LOAD [HARD] BLOCK` (L93) and states "These five bind unconditionally" (L153). `AGENTS.md`'s Confidence Thresholds table (>=80% proceed / 40-79% caveats / <40% ask) contains no `0.70` and no `0.35` strings. Gate 2's >=0.8 bar (README L278) still matches AGENTS.md L83. Correction: update the count to five and Gate 1's thresholds to the shipped table.

### P1 - mcp-tooling hub under-enumerated (README L607, L610, L945)
Claim: the hub routes to `mcp-chrome-devtools`, `mcp-click-up`, `mcp-figma` (L607), plus `mcp-obsidian` (L610/L945). Evidence: the shipped mcp-tooling `mode-registry.json` description names six workflow-packet modes - `mcp-chrome-devtools`, `mcp-click-up`, `mcp-obsidian`, `mcp-aside-devtools`, `mcp-notion`, `mcp-orca-cli` - and the hub registers ten modes in total (iteration-2 enumeration: the six workflow modes plus `mcp-figma`, `mcp-refero`, `mcp-mobbin`, `mcp-magicpath`). The README names none of aside-devtools, notion, refero, mobbin, magicpath, orca-cli. README-side counterpart of iteration 2's changelog finding (mcp-orca-cli absent from both target docs).

### P2 - "20 domain skills" contradicts the shipped 13 (README L60 vs L10, L547, L990)
Evidence: `.skilled/skills` holds exactly 13 skill directories (cli-external-orchestration, mcp-code-mode, mcp-tooling, sk-code, sk-communication, sk-design, sk-doc, sk-git, sk-prompt, sk-vision, system-deep-loop, system-skill-advisor, system-spec-kit). The README counts 13 in three other places; the overview diagram's "20" is stale.

### P2 - Agent roster omits the shipped `design` agent (README L636-691)
Evidence: `.skilled/agents/` holds 12 agent files including `design.md`; the README roster covers 11 unique names (Context appears twice, as "Context" and "Context Retrieval") and never names `design`. The headline count "12" holds.

### P2 - `.vscode/mcp.json` listed as a core configuration file does not exist (README L966)
Evidence: no `.vscode/` directory exists at the repo root; the probe for `.vscode/mcp.json` returns MISSING. Either restore the wrapper or drop the line.

### P2 - sk-code surface count inconsistent (README L566-567 vs L950)
Claim: "Two ready surfaces: WEBFLOW ... and OPENCODE". Evidence: three surface packets ship - `sk-code-webflow`, `sk-code-opencode`, `sk-code-obsidian` - and L950 of the same README lists all three as replaceable packets. L567 undercounts; check the skill's evidence-only doctrine for obsidian when correcting.

### P2 (low materiality, intent-dependent) - "Sixteen templates" vs 18 `.tmpl` files (README L180)
Evidence: `templates/` holds 18 `.tmpl` files - core 4 (spec, plan, tasks, implementation-summary), addons 10 (acceptance-criteria, before-after, debug-delegation, decision-record, goal, handover, research, resource-map, roadmap, timeline), packet-types 4 (phase-parent.spec, research.spec, review.spec, review-report). The trigger table enumerates 16; `packet-types/research.spec.md.tmpl` and `packet-types/review-report.md.tmpl` are unaccounted. Verify intent before "correcting".

### P2 (low materiality) - Doctor assets: "12 underlying YAML workflows" vs 13 YAML files (README L839)
Evidence: `.skilled/commands/doctor/assets/` holds 13 `.yaml` plus 3 `.txt` presentation files; the 13th YAML is `doctor-router-reach.yaml`, plausibly a router-reachability asset rather than a workflow. Settle against the router doc before correcting.

### Confirmed holds (evidence-backed)
- Command inventory L696 is exact: 32 command entry points across 7 groups (create 12, deep 5, design 3, doctor 3, prompt 1, rewrite 2, speckit 6) plus 3 root utilities (`agent-router.md`, `goal-opencode.md`, `vision.md`) under `.skilled/commands/`.
- Post-041 path surface: every sampled `.skilled/...` path in the README resolves (~55 probes OK), including the advisor runtime tree, spec-kit script suite, continuity sources and dist, trigger index, hooks, goal hooks, doctor routes/assets, sk-code packets and CLI READMEs. The only miss is `.vscode/mcp.json` (finding above).
- Runtime config compat surface: `.opencode/{agents,bin,changelog,commands,hooks,scripts,skills,specs}` and `.hermes/agents` are symlinks into `.skilled/...`; `.claude/skills` and `.pi/skills` symlink to `.skilled/skills`; `.claude/.utcp_config.json` symlinks to the root file. L638's mirror/link description is exactly right.
- "13 On-Demand Skills" (L10, L547, L990), "12 Specialized Agents" (L9, L36, L59, L638), "47 scenario files" (L413; 47 scenario .md plus index plus vitest harness = 49 hits), "five /deep:* loop commands" (L427; five command files confirmed), "four loop families with two improvement lanes" (L427/L534; packet dirs deep-research, deep-review, deep-ai-council, deep-improvement), packet structure L161-173 (the 042 packet matches), spec-kit-docs.json contract L156/L191 (levels 1,2,3,3+,phase,review,research; documents index matches), core config list L961-965 minus `.vscode` (opencode.json carries `code_mode` local via `.skilled/bin/mcp-code-mode-launcher.cjs`), MCP shape L976-984, and the "Verify Installation" grep targets (all four config files reference `mcp-code-mode-launcher`).
- Advisor "nine commands" statements (L116, L323, L374, L379, L404) are mutually consistent and the tools/handlers layout supports them; a direct nine-id enumeration was not completed (residual).

## Questions Answered
- Q3 (substantially): the README is post-migration-correct on paths, structure, counts and command inventory; the false or stale claims concentrate in install/setup (2x P1), the gate-system description (P1), the mcp-tooling enumeration (P1), and five smaller count/roster items (P2). No dead pre-041 root spellings were found in the README body; the install-step break is the one migration-adjacent failure.

## Questions Remaining
- Q3 residuals: clone-slug redirect status (needs a network check); `ai-council` vs `deep-ai-council` mode-key naming (registry mode ids not enumerated; the packet dir is `deep-ai-council`); "121 advisor test files / 872 tests" count (pattern-based count not completed); `AC_CLOSURE`/`AC_COVERAGE` not found in `runtime/cli/spec/validate.sh` (14.5 KB thin dispatcher - check `dist/` before any verdict); Node "18+" engines claim (no root manifest; `.skilled/package.json` engines unread); `.utcp_config.json` carries 14 manual call templates vs 7 integrations listed at L894-902 (names unsampled); Related Documents links (L420-431) not individually probed; doctor 12-vs-13 and templates 16-vs-18 intent checks.
- Q1 residuals (carried): L15 gate tolerance; .hermes skills/agents mirror contents.
- Q2 residuals (carried): compiled-router closure status for sk-design; Rust placement; @markdown/deep-ai-council renames.
- Q4 (post-draft work missing from the changelog narrative) and Q5 (rewrite vs targeted corrections) remain open; Q3's evidence suggests targeted corrections suffice for the README.

## Next Focus
Q4 - the post-draft work missing from the changelog narrative (deep-loop ledger/protocol/admission fixes, the orca packet, documentation-correction commits) - then Q5; carry the Q3 residuals above.

## SCOPE VIOLATIONS
None. All writes stayed inside the 042 research directory; the researched surface was read-only.
