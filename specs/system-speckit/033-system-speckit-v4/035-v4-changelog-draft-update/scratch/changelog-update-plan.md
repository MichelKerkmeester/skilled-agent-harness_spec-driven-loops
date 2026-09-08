# Changelog update plan, pass four

Source: the 54 digests under `changelog-digests/` and their merged `00-index.md`. Target: `../../CHANGELOG-v4.0.0.0.md` (the v4 parent folder). Every item below names the draft section, the change and the digest that grounds it. Items marked KEEP are claims the sweep confirmed and that must survive the edit.

Voice rules bind every sentence added: no em dashes, no semicolons, no Oxford commas, active voice, direct address, varied sentence length. Structure rules bind too: H2 sections stay, H4 subsections use `&nbsp;` between them and `---` only between H2s, no new headings beyond the ones listed here, no `**Problem:**` or `**Fix:**` labels. Do not add numbers the digests do not carry. Do not restore anything the confirmed-drift table removed (memory engine, `/interface:*`, alignment mode, prompt hub, owner-first grammar, `MK_HOOKS_DISABLED`).

---

## 1. WHAT'S NEW AT A GLANCE

1.1 Add one bullet after "Pi hosts the framework natively": **Sign in, not API keys.** Codex and Claude Code dispatch through the account you are already signed in to. `OPENAI_API_KEY` and `ANTHROPIC_API_KEY` are no longer read. (cli-codex v1.7.0.0, cli-claude-code v1.2.0.0)

1.2 Add one bullet after "Every bridge, one hub": **A local vision skill.** `sk-vision` reads screenshots for text-only models through a private Moondream runtime, off by default, on demand through `/vision`. (sk-vision v0.2.0.0)

1.3 In "One prompt skill", keep the sentence but drop "the long run of renames finally settles" if space is tight. Otherwise KEEP.

1.4 KEEP every other bullet. Counts confirmed: six hubs, nine mcp-tooling modes, forty rules, 26 chart forms, 27 diagram types.

---

## 2. ONE SHAPE FOR EVERY SKILL

2.1 Replace "Prompt craft stayed a single standalone skill because it never needed a second mode." with a sentence that says prompt craft tried the hub shape during the cycle and went back to a single skill before release. Add that `sk-vision`, `sk-communication`, `sk-git`, `mcp-code-mode`, the spec kit and the advisor are the other standalone skills. (sk-prompt v3.0.0.0, sk-vision, mcp-code-mode digests)

---

## 3. SPEC KIT

3.1 In "The Memory Database Retired", add one sentence: the `spec-memory` daemon CLI under `.opencode/bin/` and the `system-spec-memory` OpenCode plugin went with it. (system-spec-kit v3.5.0.5)

3.2 In "A Completion Gate That Tells the Truth", add: the gate also checks scope adherence, refusing a packet whose changed files fall outside what its spec names, and the acceptance-coverage check is on by default. Name the two env vars `SYSTEM_SCOPE_CHANGED_FILES` and `SYSTEM_SCOPE_BASE` only if a short clause carries them. (system-spec-kit v3.9.0.0)

3.3 KEEP forty rules. The changelog's 46 predates the simplification rounds. Do not change the number.

3.4 In "Smaller Templates, Same Output", keep 1,275 and add the concrete research figure: a Level 1 research doc renders at 175 lines instead of 944. (system-spec-kit v3.9.0.0)

3.5 In "Stricter Workspace Anchoring" under The Skill Advisor, add the fail-closed trust gate in one or two sentences: a mutation through the CLI needs `--trusted`, and the MCP env block needs `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT=trusted`. Mark it breaking with the word **Breaking:** at the start, matching the goals paragraph. (system-skill-advisor v0.7.0.0)

3.6 In the same advisor section, add one sentence that the reciprocal-rank-fusion spine and the conflict rerank graduated from dark flags to shipping defaults and the self-recommendation guard was cut. Add one sentence on doc-trigger harvesting: documents' `trigger_phrases` now feed the advisor through a `skill_docs` table behind `SPECKIT_ADVISOR_DOC_TRIGGERS`. (v0.9.0.0, v0.8.0.0)

3.7 In "Codex Starts the Advisor", correct "fully standalone" implications: say the package keeps a symlink to the spec kit's embeddings and extends its tsconfig. One clause. (v0.2.0.0)

---

## 4. DOCUMENTATION AS A SYSTEM

4.1 In "Parent Skills, Nested Modes", change "fourteen nested `sk-create-*` workflow packets" to "fourteen `sk-create-*` modes across thirteen packets" and keep "twelve of them bound to their own `/create:*` command". Add that a nested packet carries no `graph-metadata.json` and inherits the hub's one advisor identity. (sk-create-skill v1.0.0.0, sk-create-frontmatter digest)

4.2 Add to the scaffold list in the second paragraph: the root `ROUTER.md` that maps intents to leaves. (sk-doc v2.0.1.0)

4.3 In the names paragraph, add the packet-directory rename `create-*` to `sk-create-*` and drop the sentence "The `/create:*` command family itself is untouched." (sk-create-changelog digest, sk-doc v1.5.0.0)

4.4 New H4 after "Two New Ways to Author": **Every Document Carries a Version**. Two or three sentences: every authored markdown file now carries a four-part `version` in its frontmatter, a script bumps it and a CI gate refuses a file without one, and the rollout covered the whole corpus. Then one sentence: if you adopt the framework, your own skills need the field before the gate lets them through. (sk-doc v1.8.0.0)

4.5 In "Kebab-Case Is Now the One Name", add one sentence that this reversed an older sk-doc rule that enforced snake_case recursively. (sk-doc v1.8.1.0)

4.6 In "Benchmarks, One Way", replace `benchmark/reports/` framing with the digest's: authoring guidance has one home, run and scoring stay with the executing lanes, and `/create:benchmark --family=...` now exists. Keep the exit-code-3 sentence. Drop the `conformance_benchmark` family since the hub digest records its removal with the alignment mode. (sk-create-benchmark v1.3.0.0, system-deep-loop v3.0.0.0)

4.7 Add one sentence somewhere in this section that the Human Voice Rules moved into their own `sk-create-with-human-voice` mode with a scanner that enforces them. (sk-create-with-human-voice v1.1.0.0)

---

## 5. THE DEEP LOOPS

5.1 In "One Skill, Hub and Backend Together", extend the alignment sentence: removing it also removed `/deep:command-benchmark` and the conformance benchmark family. (system-deep-loop v3.0.0.0)

5.2 In the same subsection, add the `ai-council/` to `deep-ai-council/` packet rename and the second-stage router moving from `shared/references/smart-routing.md` to a root `ROUTER.md`. (deep-ai-council v2.4.0.0, system-deep-loop v2.2.3.0)

5.3 In "One Loop, Every Model, In Parallel", rewrite the first bullet's roster examples to match reality: Codex carries GPT-5.5 and the three GPT-5.6 models with per-model effort ceilings, Devin carries six families including Gemini 3.7 Flash and GPT-5.6 Luna Max, Cursor carries 21 ids across six families, Pi a closed six-provider roster with DeepSeek V4 Flash as its default. Delete the "closed roster per executor" bullet's claim that every kind enforces an allowlist. Replace with: Codex, Cursor, Devin and Pi carry enforced allowlists, cli-opencode takes a free-form `provider/model` id and relies on discipline. (cli-* digests)

5.4 Add one bullet: every deep-review run ends with a `Review verdict: PASS|CONDITIONAL|FAIL` line and every deep-research run records which executor produced its first record. (deep-review v1.8.0.0, deep-research v1.10.0.0)

5.5 In "A New Evidence Ledger", change "All seven ledger modes" to "Every ledger mode" and drop the number. Add one sentence that the finding dedup and the two progress gauges in the fan-out runtime stay off by default. (deep-loop-runtime v1.5.0.0)

5.6 KEEP `cli-claude-code` as a wired executor.

---

## 6. ORCHESTRATING OTHER AIS

6.1 New H4 after "Executors That Only Run When Installed": **Sign In Once, Dispatch Everywhere**. Say Codex authenticates only through ChatGPT OAuth (`codex login`) and Claude Code only through your Claude subscription (`claude auth login`). The API-key paths are gone. Mark **Breaking:**. (cli-codex v1.7.0.0, cli-claude-code v1.2.0.0)

6.2 In "Pi Runs the Framework Natively", add that a Pi session may now dispatch `cli-pi` itself, the one carve-out from the self-invocation rule. Keep the native subagents sentence. (cli-pi v1.5.0.0)

6.3 In "Surfaces Retired", qualify Gemini: the standalone bridge is gone, and Gemini 3.7 Flash remains reachable through Devin and Cursor. Add the Ox Alpha routes were retired and Pi's default repointed. (cli-cursor v1.4.1.0, cli-devin v1.4.1.0, cli-external-orchestration v1.4.4.0)

6.4 Add one sentence, either here or in the hub paragraph, that the hub itself was renamed from `cli-external` to `cli-external-orchestration`. (cli-external-orchestration v1.1.0.0)

---

## 7. HOOKS, GOALS AND THE RUNTIME

7.1 KEEP as is. The sweep found no correction here beyond what pass three already made.

---

## 8. THE DESIGN SURFACE

8.1 In "One Hub, Four Modes", soften "the routing they never had" to "and were registered in the hub's router". Keep the compiled-routing caveat. (sk-design v2.0.0.0)

8.2 Add one sentence to that subsection: a manifest version stored as a string had silently disabled three manifest checks (byte drift, target collision, reachability) and is now a number, so the checks run. (sk-design v2.0.0.0)

8.3 In "Charts on a Real Register", replace "Three decisions from that work are held by checkers" with: the chart check grew from fifteen named checks to twenty-five, three of them browser-backed. Add dark-ground support as its own sentence or two: every chart carries a second palette block behind `prefers-color-scheme`, all three colour systems gained a dark ground with matching text and series values, and a dark-render check guards it. (sk-design-chart v1.2.0.0)

8.4 In the same subsection, add one sentence on the null fix: a missing reading used to dive a line to the baseline and print the word null, and now it does not. (sk-design-chart v1.1.0.0)

---

## 9. ONE CODE SKILL

9.1 Replace the opening "For as long as it existed, `sk-code` was a single flat skill with everything in one place." with a sentence that says it was eight sub-skills with duplicated doctrine. (sk-code-quality v1.0.0.0)

9.2 In "One Hub, Two Axes", add one sentence on what `sk-code-quality` does: the post-implementation gate that applies the P0 to P2 author checks and comment hygiene per modified file. Add one sentence naming the mobile-cli surface's stack (the Pi Remote mobile app, SvelteKit) and the obsidian surface's (the Note Database plugin). (sk-code-quality, sk-code-mobile-cli, sk-code-obsidian digests)

9.3 Soften "The move is breaking" to say the hub move was breaking and the later surface additions were not. (sk-code v4.1.0.0)

9.4 In "Review, First Class", add: every review ends with a `Review status: APPROVED|REQUESTED_CHANGES|COMMENTED` line, and the checklists moved from `references/` to `assets/`, so anything pinned to the old path needs repointing. (sk-code-review v1.8 and v1.5.0.0 digests)

9.5 Add one sentence that language slicing now covers the full set of languages a task touches rather than the first match. (sk-code-opencode v1.0.0.4)

---

## 10. SAFER GIT

10.1 In "Every Commit Reaches Your IDE", replace the fast-forward follower sentence: the follower daemon was never started automatically, and a SessionStart reconcile now fast-forwards a clean primary checkout instead. (sk-git v1.5.0.0)

10.2 In "Numbered Branch Names", add the configurable worktree base: `SPECKIT_WORKTREE_BASE` or `git config speckit.worktreeBase`. Add one sentence that each live-sync leg has a documented disable flag. Do not resolve the digit-width question. Keep `{NNN}`. (sk-git v1.5.x digests)

---

## 11. PROMPT ENGINEERING

11.1 Replace "folded back into this single leaf before release, so there is no `prompt-models` mode to route to" with: the per-model profile capability was removed with no replacement, and only the CLI quality card came back to `sk-prompt/assets/`. (sk-prompt v3.0.0.0)

11.2 In "The Names Settle", add the intermediate name `sk-prompt-improve` to the list of names that no longer exist. (sk-prompt v2.3.1.0)

---

## 12. MCP TOOLING

12.1 Replace "Every bridge lives under a single `mcp-tooling` parent" with a sentence that says every application bridge lives there, while `mcp-code-mode`, the execution substrate every MCP call runs through, stays a standalone skill. (mcp-code-mode digest)

12.2 In "One Hub for the MCP Bridges", add that `mcp-webflow` was removed from the hub and that the fold-in moved three skills at once (chrome-devtools, click-up, figma), not only figma. (mcp-tooling v1.4.2.0, v1.0.0.0)

12.3 Fix the transports paragraph: "The design transports defer to the design-judgment skill for taste" becomes: figma, refero and mobbin hand measured values to the md generator, and magicpath hands taste questions to the design hub. (mcp-tooling v1.6.1.0)

12.4 Name the Chrome DevTools bridge once and say both browser bridges prefer their CLI with the MCP as fallback. (mcp-chrome-devtools v1.0.1.0)

12.5 In "Your Vault at the Terminal", add that the mode's plugin roster was pruned (Excalidraw, Project Manager and Beancount removed) and that the official CLI's contract was corrected to `obsidian help` with the false "the CLI launches the app" claim removed. (mcp-obsidian v0.21 to v0.23)

12.6 In "Figma Moves Into the Hub", keep the path move and add that the three former bridges lost their own `graph-metadata.json` and route only through the hub identity. (mcp-tooling v1.0.0.0)

---

## 13. PLAIN-ENGLISH OUTPUT

13.1 Rewrite the opening so the skill has two lanes: the projection lane, off by default and gated by `COMMUNICATION_PROJECTION_ENABLED`, and `/rewrite:explain-visually`, always available, which explains a reply or a topic as the smallest diagram that answers it at a depth you pick (expert, plain, novice). The remaining bullets describe the projection lane and should say so. (sk-communication v1.1.0.0)

---

## 14. UPGRADE NOTES

14.1 Renames to adopt: add `create-*` packet directories to `sk-create-*`, `ai-council/` to `deep-ai-council/`, `cli-external` to `cli-external-orchestration`, and `sk-prompt-improve` as a retired intermediate name.

14.2 Repoint what moved: add `smart-routing.md` to root `ROUTER.md` in the hubs, sk-code-review checklists to `assets/`, the HVR rules into `sk-create-with-human-voice/references/`, the deep-loop runtime `storage/` to `database/`, and the deep-review `references/` regrouping.

14.3 Drop removed surfaces: add `mcp-webflow`, the Ox Alpha routes, the four `deep_loop_graph_*` MCP tools, `SPECKIT_DETERMINISTIC_RANKING`, `/deep:command-benchmark` and the conformance benchmark family, and the API-key auth paths for Codex and Claude Code.

14.4 Changed defaults: add the executor default models (opencode `opencode-go/deepseek-v4-flash --variant max`, Pi `deepseek-v4-flash`, Devin `swe`), the advisor trust gate, the advisor fusion spine, and sk-vision opt-in.

14.5 Reconcile your own skills: add the four-part frontmatter `version` requirement as the first thing that will fail an adopter.

---

## 15. INTERNAL SEAMS

15.1 KEEP. Optionally add one bullet: three hubs replaced `shared/references/smart-routing.md` with a root `ROUTER.md`.

---

## 16. VERIFICATION AFTER THE EDIT

- `python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <draft>`: zero em dashes, zero prose semicolons (the `&nbsp;` entity hits are structural and expected).
- `rg -n 'memory_search|/interface|alignment|prompt-models|sk-create-diagram|MK_HOOKS|NNNN|1,314|/doc:quality|pi-subagents|eight modes|seven ledger' <draft>` returns only removal or correction sentences.
- Counts unchanged: six hubs, forty rules, 1,275 lines, 102 symlinks, twenty-two concerns, fourteen modes, nine mcp-tooling modes.
- Structure: `&nbsp;` between H4s, `---` only between H2s, no new H2.
