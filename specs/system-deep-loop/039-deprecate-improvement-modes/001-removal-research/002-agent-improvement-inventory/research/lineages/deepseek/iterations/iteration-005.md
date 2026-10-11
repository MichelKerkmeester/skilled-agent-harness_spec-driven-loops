# Iteration 5: Agents, hooks, compiled routing, cross-skill docs — and external callers of the packet's mirror checker

## Focus

Inventory `.skilled/agents/` (agent definition + roster), the hooks surface (`task-dispatch` dispatch guard, `git` pre-commit pair), `.skilled/bin/lib/compiled-routing/` (compiler + fixtures), `.skilled/commands/README.txt`, cross-skill documentation (cli-external-orchestration ×2, sk-code, deep-ai-council, create-skill-parent assets), shared packet subtrees (behavior-benchmark, rollout), the sibling model-benchmark assets' references into the shared packet, and every caller of `deep-improvement/scripts/check-agent-mirror-sync.cjs` from outside the two improvement modes.

## Actions Taken

1. Cross-skill sweep: `rg -l` for both mode tokens across `.skilled` excluding the two known skill trees.
2. Read `.skilled/agents/deep-improvement.md` mention set and `.skilled/agents/README.txt` lines.
3. Grepped hooks (task-dispatch, git), `.skilled/bin/lib/compiled-routing/`, `.skilled/CROSS-CLI.md`, `.skilled/commands/README.txt`.
4. Grepped the cli-opencode and cli-claude-code surfaces, sk-code checklist, deep-ai-council README, shared behavior-benchmark + rollout files, create-skill-parent assets, sibling model-benchmark assets.
5. Traced every caller of `check-agent-mirror-sync` repo-wide and verified `.github/workflows/agent-mirror-sync.yml` plus `.github/scripts/tests/broken-move-drill.sh`; confirmed `.skilled/scripts/git-hooks/pre-commit` as a second hook copy.

## Findings

1. **`.skilled/agents/deep-improvement.md` is the mode's agent definition** — name/description lines 2-3 ("Proposal-only mutator..."), purpose line 23, the Lane A/Lane B awareness note line 58 (this agent is Lane A's command-owned dispatch; Lane B never dispatches it, so no lane keeps it), and its own reference list lines 245 and 248. Disposition: DELETE. [SOURCE: .skilled/agents/deep-improvement.md:58]
2. **`.skilled/agents/README.txt` carries the agent roster and a translation-contract pointer into the packet** — line 11 names the contract at `deep-improvement/references/shared/agent-mirror-crosswalk.md`, line 23 describes `deep-improvement` as the proposal-only mutator. Disposition: EDIT. [SOURCE: .skilled/agents/README.txt:23]
3. **The task-dispatch guard counts deep-improvement among the three loop executors** — `dispatch-guard.cjs` line 74 (`LOOP_EXECUTOR_AGENTS = new Set(['deep-research', 'deep-review', 'deep-improvement'])`); README.md line 32 documents the three command-owned loop executors. Disposition: EDIT (remove from the set and the doc). [SOURCE: .skilled/hooks/task-dispatch/lib/dispatch-guard.cjs:74]
4. **External callers of the packet's mirror checker (outside the two improvement modes)** — the git pre-commit at `.skilled/hooks/git/pre-commit:82`, the installed-hook source `.skilled/scripts/git-hooks/pre-commit:165`, the hooks README `.skilled/hooks/git/README.md:138`, `.skilled/CROSS-CLI.md:89`, the sk-code agent-authoring checklist (`agent-authoring.md:37,65,73`), the CI workflow `.github/workflows/agent-mirror-sync.yml:17` (runs the `.opencode/...` mirror copy), and the CI drill `.github/scripts/tests/broken-move-drill.sh:133-134`. Disposition: EDIT every caller (retarget to a surviving checker or retire the check with the agent-mirror system). [SOURCE: .skilled/scripts/git-hooks/pre-commit:165]
5. **The compiled-routing registry compiler enforces the lane as an invariant** — `registry-compiler.cjs` lists `agent-improvement` in its mode order (line 32) and fails with `SHARED_PACKET_COLLAPSE` when the deep-improvement public lanes collapse or lose their alias class (lines 188-192); fixtures `canary-cases.v1.json` include the `single-agent-improvement` case (lines 63-77), the model-benchmark case sharing the packet (lines 94-95), and the mode list (line 180). Disposition: EDIT compiler + fixtures (the collapse invariant disappears with Lane A). [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs:188]
6. **`.skilled/commands/README.txt` indexes the command four times** — tree line 98, command table line 180, example line 245, link table line 346. Disposition: EDIT. [SOURCE: .skilled/commands/README.txt:180]
7. **cli-opencode documents the command-owned agent four times** — `SKILL.md` lines 30 and 197 (command-owned loop executors including `deep-improvement` via `/deep:agent-improvement`), `references/agent-delegation.md` lines 80, 134, 231 (never direct `--agent`, command-only), `assets/prompt-templates.md` line 188, `references/cli-reference.md` line 294. Disposition: EDIT (shared docs). [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:231]
8. **cli-claude-code documents the same four surfaces** — `README.md:57`, `references/agent-delegation.md:102,132` (command-owned, never dispatch directly), `references/claude-tools.md:247` (command-owned agent class). Disposition: EDIT. [SOURCE: .skilled/skills/cli-external-orchestration/cli-claude-code/README.md:57]
9. **`deep-ai-council/README.md:134` names the sibling packet** — "`deep-improvement` | Runs evaluator-first improvement across the `agent-improvement` and `model-benchmark` command lanes." Disposition: EDIT. [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/README.md:134]
10. **The shared behavior-benchmark contract lists the packet as a consumer and owns the IMB taxonomy** — `shared/behavior-benchmark/README.md:12` and `framework.md:22,334` (IMB scenario prefix maps to `deep-improvement`). Disposition: EDIT the consumer list; IMB scenario disposition deferred to the tests iteration. [SOURCE: .skilled/skills/system-deep-loop/shared/behavior-benchmark/framework.md:334]
11. **The shared rollout map routes the command as fallback** — `shared/rollout/command-injection-rollout.json:6` maps `"deep/agent-improvement": "fallback"`. Disposition: EDIT (remove the entry; the fallback mechanism stays for siblings). [SOURCE: .skilled/skills/system-deep-loop/shared/rollout/command-injection-rollout.json:6]
12. **The create-skill-parent templates use the improvement packet as the canonical many-modes-to-one-packet example** — create-skill-parent-auto.yaml lines 269, 305, 390 and create-skill-parent-confirm.yaml lines 298, 334, 422 ("4 improvement modes -> deep-improvement"). Disposition: EDIT (replace the canonical example or drop the reference). [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:269]
13. **The sibling model-benchmark assets bind to Lane A artifacts and packet scripts** — deep-model-benchmark-auto.yaml lines 99-107 (packet script bindings), 196-216 (script invocations); confirm.yaml lines 101, 104-112, 151-152 (`agent-improvement-state.jsonl`/dashboard as the shared state names), 182-184 (shared lock note), 206-238, 250-272; presentation.txt lines 200, 225 (unknown mode falls back to agent-improvement), 398, 430. Disposition: SHARED-WITH-MODEL-BENCHMARK (sibling-owned edits; the state-log naming survives Lane A deletion only if renamed). [SOURCE: .skilled/commands/deep/assets/deep-model-benchmark-confirm.yaml:151]
14. **Cross-skill benchmark reports embed the mode in recorded executor transcripts** — e.g. `sk-code/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json:29` and peers in mcp-tooling, cli-external-orchestration, sk-prompt. Disposition: KEEP-AS-HISTORY (generated benchmark evidence). [SOURCE: .skilled/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json:29]
15. **Changelogs record the mode's history across the repo** — `.skilled/changelog/skilled/v3+/v3.5.0.0.md:37` (deep-agent-improvement renamed deep-improvement), `v4.0.0.0.md:111`, `v3.3.0.0.md`, `v3.4.0.0.md`, `v3.4.1.0.md`; cli-opencode changelog `v1.1.0.0.md:53`. Disposition: KEEP-AS-HISTORY. [SOURCE: .skilled/changelog/skilled/v3+/v3.5.0.0.md:37]
16. **Runtime test helper references the packet scripts** — `runtime/tests/helpers/legacy-real-log.ts` references improvement script names (ledger legacy fixtures). Disposition: EDIT (runtime tests; confirm in the tests iteration). [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/helpers/legacy-real-log.ts]

## Ruled Out

- Classifying the mirror checker as packet-internal: it has repo-wide callers (commit hooks, CI workflow, CI drill, cross-skill checklist, CROSS-CLI.md), so its removal is a cross-repo edit, not a packet-local delete.

## Dead Ends

- Search for additional hook mentions beyond the four files was exhaustive: `rg -l` over `.skilled/hooks/` returns only task-dispatch and git hits.

## Edge Cases

- Ambiguous input: "scripts/git-hooks" — resolved to both `.skilled/hooks/git/` and `.skilled/scripts/git-hooks/` (install source) since both reference the packet script.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/agents/deep-improvement.md:2-3,23,58,245,248
- .skilled/agents/README.txt:11,23
- .skilled/hooks/task-dispatch/lib/dispatch-guard.cjs:74; README.md:32
- .skilled/hooks/git/pre-commit:82; README.md:138
- .skilled/scripts/git-hooks/pre-commit:165
- .skilled/CROSS-CLI.md:89
- .skilled/skills/sk-code/sk-code-opencode/assets/checklists/agent-authoring.md:37,65,73
- .github/workflows/agent-mirror-sync.yml:17; .github/scripts/tests/broken-move-drill.sh:133-134
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs:32,188-192
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/fixtures/canary-cases.v1.json:63-95,180
- .skilled/commands/README.txt:98,180,245,346
- .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:30,197; references/agent-delegation.md:80,134,231; assets/prompt-templates.md:188; references/cli-reference.md:294
- .skilled/skills/cli-external-orchestration/cli-claude-code/README.md:57; references/agent-delegation.md:102,132; references/claude-tools.md:247
- .skilled/skills/system-deep-loop/deep-ai-council/README.md:134
- .skilled/skills/system-deep-loop/shared/behavior-benchmark/README.md:12; framework.md:22,334
- .skilled/skills/system-deep-loop/shared/rollout/command-injection-rollout.json:6
- .skilled/commands/create/assets/create-skill-parent-auto.yaml:269,305,390; create-skill-parent-confirm.yaml:298,334,422
- .skilled/commands/deep/assets/deep-model-benchmark-auto.yaml:99-107,196-216; deep-model-benchmark-confirm.yaml:101,104-112,151-152,182-184,206-238,250-272; deep-model-benchmark-presentation.txt:200,225,398,430
- .skilled/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json:29
- .skilled/changelog/skilled/v3+/v3.5.0.0.md:37; v4.0.0.0.md:111
- .skilled/skills/cli-external-orchestration/cli-opencode/changelog/v1.1.0.0.md:53
- .skilled/skills/system-deep-loop/runtime/tests/helpers/legacy-real-log.ts

## Assessment

- New information ratio: 0.85
- Questions addressed: KQ1 (cross-skill + agent surfaces), KQ5 (outside-mode consumers of the packet's mirror checker)
- Questions answered: none in full

## Reflection

- What worked and why: chasing the packet script name (`check-agent-mirror-sync`) across the whole repo surfaced the hook/CI/cross-skill caller set that a mode-token sweep alone would have missed.
- What did not work and why: nothing failed; sibling assets were already flagged in iteration 2 and needed only line-level pinning.
- What I would do differently: bring the script-name chase pattern into the final tests iteration to catch any remaining script-level callers.

## SCOPE VIOLATIONS

- None.

## Recommended Next Focus

Iteration 6: runtime mirrors A — `.claude/` and `.opencode/` (agents, commands, prompts) for agent-improvement surfaces, and whether each file is a symlink, a generated copy or a hand-written file.
