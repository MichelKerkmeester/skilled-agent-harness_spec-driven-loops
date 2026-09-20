# Iteration 008 — Adversarial falsification: one flagged count reverses, "Forty rules" closes exactly, and four README numbers fall

## Focus

Adversarial verification of the strongest stale claims in both documents — trying to falsify each by finding a reading, a compatibility alias, a redirect or an alternate counting rule that makes the current wording true — plus closure of the residual numerics: the Hermes bridge count, rule counts, chart and diagram form counts, the 96/76 catalog totals and the Node engines claim.

## Actions Taken

1. Gate loads: the trigger-index lookup and the `REPO RULES.md` router, then the six rule files the trigger table routes for this action (evidence-and-proof, uncertainty-and-honesty, and the four communication rules) before the first write. Gate 5 is a HARD BLOCK in the root `AGENTS.md`, so the workflow's 12-call cap yields to it (budget note below).
2. Read-only document pins: changelog L28-36 (the Hermes bullet with "eighteen of the twenty-two hook packages"), L92-100 (the completion-gate paragraph with "Forty rules are registered"), L274-282 (the Hermes section and its bridge enumeration), L380-392 (the sk-design bullets with "29 catalog forms" and "27 types"), L41 and L511 (both "nine modes" lines); README L85-95 (the Node 18+ prerequisite), L405-435 (advisor testing bullets and the Related Documents section), L600-615 (the mcp-tooling bullets with "96-feature catalog + 76-scenario playbook"), L888-905 (the UTCP integration list), L930-940 (the customization table with "Webflow + OpenCode + Motion.dev").
3. Live-tree probes: a hooks census under `.skilled/hooks` (28 top entries = 22 package dirs + 6 files; 101 recursive symlinks, all relative, 0 absolute; `.opencode/hooks -> ../.skilled/hooks`); the repo-guards plugin (`plugin.yaml` plus name matching across `__init__.py`); both mode registries; chart templates; diagram type files; the sk-code surface packets; the click-up feature catalog and playbook; the engines field of every reachable `package.json` (62 files); an advisor test scan; `runtime/cli/rules` (40 files) and `runtime/cli/lib/validator-registry.json` (40 rows); `.utcp_config.json` (14 templates); the ten Related Documents links.
4. Adversarial falsification attempts per claim: alternate counting rules (packetKind splits, internal-only vs inclusive symlink counts, registry rows vs rule files, catalog index vs entries), alias checks, and scope-of-count hunts (96 index vs catalog entries; 37 vs 76 scenarios).
5. Budget note: total tool calls exceeded the deep-research 12-call cap because the six mandatory Gate 5 rule-file loads (and the overflow completion of that load) preceded the artifact writes. Research actions stayed at five; the overage is gate loads and artifact writes, matching iteration 7's precedent.

## Findings

| # | Claim (doc, line) | Falsification attempt | Verdict | Evidence |
|---|---|---|---|---|
| 1 | CL L366 "The `.opencode/hooks/` directory gathers every hook through 102 relative symlinks" | Inclusive count: the gather-dir alias itself is the 102nd relative symlink | HOLDS — prior 101-vs-102 flag superseded | Census: exactly 101 relative symlinks (0 absolute) under `.skilled/hooks`; `.opencode/hooks -> ../.skilled/hooks` is itself a relative symlink; 101 + 1 = 102. A strict internal-only reading gives 101, so the earlier flag resolves as counting scope, not a wrong number |
| 2 | CL L32, L278 "bridges eighteen of the twenty-two hook packages" | Literal name matching across `__init__.py` (hyphen and underscore variants) | PARTIAL — 17 of 22 literal; exact split unresolved | 22 hook dirs confirmed. 17 names appear in the plugin source: completion, dispatch, dist-freshness, git, git-hooks-check, git-preflight, git-primary-reconcile, git-worktree-guard, goal, mcp-route-guard, post-edit-quality, session-cleanup, shared, sk-vision, skill-advisor, spec-gate, task-dispatch. 5 absent: codex-watchdog, directive-lifecycle, hook-install, permission-policy, session-lifecycle. L278 says four stay out, so one absent name is bridged under a non-literal reference; which one needs a deeper read |
| 3 | CL L96 "Forty rules are registered" | Count the registry rows | HOLDS exactly | `runtime/cli/lib/validator-registry.json` holds 40 rows (keys 0-39), each naming one `check-*.sh`; the rules README states "the rule list is the set of rows in `../lib/validator-registry.json`" |
| 4 | CL L385 "one of 29 catalog forms" | Count templates | HOLDS | 29 files in `sk-design-chart/assets/templates/`, matching the `references/catalog.md` index |
| 5 | CL L386 "across 27 types" | Count type files | HOLDS | `references/types/` = 27 `type-*.md` files + README |
| 6 | CL L45, L553 "fell from 496 lines to 283" / "went from 496 lines to 283" | Re-measure | STALE (minor) | `wc -l AGENTS.md` = 284 (re-verified this iteration); the drift postdates the draft |
| 7 | README L609 "96-feature catalog + 76-scenario playbook" | Count catalog entries; hunt 76 in the packet | 96 HOLDS, 76 FALLS | `FEATURE-CATALOG.md`: "Total catalog entries | 96" (97 files = index + 96). Playbook index: "96 features | 37 scenarios"; 45 playbook md files; zero "76" occurrences anywhere in the packet |
| 8 | README L92 "Node.js 18+" | Hunt any manifest supporting 18 | FALLS (understated) | No engines field on root or `.skilled` manifests; shipped floors are >=20.11.0 (system-spec-kit, runtime, shared, deep-loop, sk-doc), >=22 (sk-communication projection), >=22.12.0 (spec-kit runtime/cli), >=24.0.0 <25 (mcp-code-mode server), bun >=1.0.0 (sk-vision) |
| 9 | README L412 "121 advisor test files, 872 tests" | Count test files and cases | UNSUPPORTED by the tree | Advisor packet: 3 test files (runtime/tests, ~12 it()/test() cases); 6 advisor-path test files repo-wide; no 121/872 provenance in advisor docs |
| 10 | README L894-902, seven integrations "via `.utcp_config.json`" | Enumerate templates | STALE (incomplete; one phantom row) | 14 templates: aside, chrome_devtools_1, chrome_devtools_2, clickup_official, figma, github, gitkraken, magicpath, magnific, mobbin, notion, obsidian, refero, webflow. Listed "clickup (community)" has no matching template; 8 templates are unlisted |
| 11 | README L936 "the shipped Webflow + OpenCode + Motion.dev surfaces" | Check the surface axis | STALE naming | `sk-code/SKILL.md`: the surface axis is sk-code-webflow, sk-code-opencode, sk-code-obsidian; Motion.dev is a folded-in overlay inside sk-code-webflow; L936 omits obsidian |
| 12 | README Related Documents (10 links) | Existence probe | HOLDS | 10 of 10 targets exist |
| 13 | CL L41, L511 "nine modes" | packetKind counting rules (workflow-only, transport-only) | STALE | Registry: 10 modes (6 workflow + 4 transport); no counting rule yields 9; mcp-orca-cli is the post-draft tenth and the changelog never names orca |
| 14 | CL L26, L592 "six `/deep:*` commands" / "The six modes behave as before" | Registry plus deprecated lanes | STALE | 5 modes (research, review, ai-council, agent-improvement, model-benchmark); `deprecatedModes` is empty; the README's own deep-loop text says "five `/deep:*` loop commands in total" |
| 15 | CL L45, L553 "Twelve repo rules" | Is the 13th a rule file? | STALE | 13 files under `repo-rules/`; `answer-the-actual-request.md` is routed by REPO RULES.md's own trigger table, so it counts |
| 16 | CL L433-435 four sk-code surfaces including mobile-cli | Hunt a renamed replacement | STALE | 3 surface packets on disk; mobile-cli retired 2026-09-19; no successor packet |
| 17 | CL L278 "(Hermes scans a linked directory in full, so symlinks were rejected on evidence)" | Check the mirror trees | STALE (narrow, carried from iter-7) | `.hermes/agents` is a symlink while the parenthetical says symlinks were rejected; not re-probed this iteration |
| 18 | CL every `.opencode/...` reference | Alias resolution | HOLDS via aliases | `.opencode/hooks` relative alias re-observed; no dead reference (iter-7 inventory) |

## Questions Answered

- Q1 (changelog side): unchanged — every `.opencode/...` reference remains true through compatibility aliases; `.opencode/hooks` re-observed as a live relative alias.
- Q2 (changelog side): closed. mcp-tooling 10 modes (6 workflow + 4 transport), deep-loop 5 modes with an empty deprecated list, repo rules 13, sk-code surfaces 3, hooks 102 (holds inclusively), 40 registry rules (holds exactly), chart 29 forms (holds), diagram 27 types (holds).
- Q3 (README side): closed. 96 holds; 76 falls (the packet's own index says 37 scenarios); Node 18+ falls (manifest floors are >=20.11 / >=22.12); 121/872 unsupported; the UTCP list is incomplete (14 vs 7, with one phantom row); Motion.dev is named as a surface but is an overlay; Related Documents all resolve.
- Q4: unchanged — the additive-gap list from iterations 4-5 stands.
- Q5: unchanged — targeted corrections suffice; the correction list now carries exact replacement values.

## Questions Remaining

- Hermes 18/22: which of the five unmatched hook packages is the bridged 18th (candidate: session-lifecycle via the session-start advisories L278 lists) — needs a deeper read of `__init__.py`.
- The changelog's historical narrative numbers (L11 28KB and 3,000 lines, L108 22 plus 16 children, L114 1,275 lines and 175 vs 944, L228 178 recommendations, L90 42 surfaces, L120 44 alerts) were not re-verified; they are outside this iteration's named focus.
- Carried: shields.io badge redirect behavior; sk-design compiled-router closure; `@markdown` / `deep-ai-council` renames; Rust placement; the advisor 121/872 provenance if it exists outside the tree.

## Next Focus

Iteration 9 (final): consolidation — one per-claim verdict table across both documents, the exact correction list with replacement values, and the Q5 close.

## SCOPE VIOLATIONS

None. All writes stayed within `iterations/iteration-008.md`, `deltas/iter-008.jsonl`, and the contract-mandated temp record consumed by the append gateway.
