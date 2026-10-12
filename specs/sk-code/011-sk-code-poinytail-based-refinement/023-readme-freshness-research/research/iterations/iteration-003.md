# Iteration 3: Root README deep loop, commands and agents vs v4.0.0.4 and the repository (Q3 part 1)

## Focus

Q3 part 1: the root README's statements on the deep loop (modes, commands, agents), the slash-command library and the agent library, including every count, checked against v4.0.0.4 (two deep-loop modes retired, agent mirror checker moved) and the repository (`.skilled/commands`, `.skilled/agents`, the `system-deep-loop` mode registry). Q3's remaining parts (skill hubs, routing and the advisor, hooks, code-review output, unknown-option refusal, per-doc versions, playbook and catalog checks, CI gates) stay open for later iterations.

## Actions Taken

1. Read state first: `deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json`, and both prior iteration files. Focus = strategy §11 Next Focus (Q3 part 1); no exhausted approach blocks it.
2. Re-opened `.skilled/changelog/skilled/v4.0.0.4.md` first-hand: Deep Loop Modes (145-167), Agents and Repo Rules (321-329), Skill Routing (345-361).
3. Read `README.md` §6 Deep Loop (556-660), §9 Agent Library (925-997) and §11 Command Library (1055-1164).
4. Counted the repository side in read-only commands: `ls -1 .skilled/agents/*.md | wc -l` → 11; a Node walk of `.skilled/commands/{create,deep,design,doctor,prompt,speckit}` → 13/3/3/8/1/6 = 34 entry-point `.md` files plus 3 root utilities; runtime agent-tree counts: `.opencode/agents` 12 entries (11 agents + README.txt), `.claude/agents` 13 (11 agents + `Explore.md` + README.txt), `.cursor/agents` 11, `.devin/agents` 11, `.codex/agents` 11 `.toml`, `.pi/agents` 11.
5. Read the repository's own indexes: `.skilled/agents/README.txt` (roster of 11, lines 18-29), `.skilled/commands/README.txt` (group table, lines 40-50), `.skilled/bin/agent-mirror-crosswalk.md` head (six trees, line 16).
6. Read the deep-loop mode registry `.skilled/skills/system-deep-loop/mode-registry.json`: `modes` (line 30) holds exactly 3 — research (`/deep:research` → `deep-research`), review (`/deep:review` → `deep-review`), ai-council (`/deep:ai-council` → `ai-council`); `deprecatedModes` (line 29) is `[]`.
7. Grepped `README.md` for `mirror` (11 matches, lines 172/199/224/834/835/933/974/1030/1155/1252/1565): no statement names the moved checker's path, so the new home has no stale README claim to fix.
8. Checked git history for the agent roster: commit `e052417268` "refactor(system-deep-loop)!: remove the agent-improvement and model-benchmark modes" deleted `.skilled/agents/deep-improvement.md` — the 12 → 11 count change that landed with v4.0.0.4.

## Findings

| README path:line | Claim as written | Evidence | Class | Severity | Smallest proposed fix |
|---|---|---|---|---|---|
| README.md:933 | "12 custom specialist agents." | `ls -1 .skilled/agents/*.md \| wc -l` → 11; `.skilled/agents/README.txt:18` roster lists 11 names (lines 19-29); the README's own §9 list names 11 (8 orchestration + 3 deep loop); all six runtime trees carry the same 11; git commit `e052417268` deleted `.skilled/agents/deep-improvement.md` in the v4.0.0.4 cycle | STALE | P1 | "11 custom specialist agents." |
| README.md:1074 | "39 command entry points: 36 across 6 command groups plus 3 root utilities." | Node walk: create 13, deep 3, design 3, doctor 8, prompt 1, speckit 6 = 34 entry points; root 3; total 37. `.skilled/commands/README.txt:44-50` states the same 13/3/8/3/1/6/3. The 2-count drift matches the two deep commands retired in v4.0.0.4 [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:149] | STALE | P1 | "37 command entry points: 34 across 6 command groups plus 3 root utilities." |
| README.md:933 | "Defined in `.skilled/agents/` (source of truth) and mirrored for Claude Code (`.claude/agents/`). OpenCode reads `.opencode/agents/`, which links to the same `.skilled/agents/` source." | [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:16] names six runtime trees carrying the agents (`.skilled`, `.claude`, `.cursor`, `.pi`, `.codex`, `.devin`); README names only Claude + OpenCode; `.opencode/agents/*.md` and `.claude/agents/*.md` are plain copies (hard-link count 1, no symlinks), kept in step by mirror hooks and CI per [SOURCE: README.md:835] | MISSING | P2 | "...and mirrored for every runtime that carries agents (`.claude/agents/`, `.cursor/agents/`, `.pi/agents/`, `.codex/agents/`, `.devin/agents/`). OpenCode reads `.opencode/agents/`, which mirrors the same `.skilled/agents/` source." |
| README.md:630, 639, 648 | "`/deep:research` runs `@deep-research`"; "`/deep:review` runs `@deep-review`"; "`@ai-council` runs the seats, and `/deep:ai-council` handles multi-topic sessions" | [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json:30]: research → command `/deep:research`, agent `deep-research`; review → `/deep:review`, `deep-review`; ai-council → `/deep:ai-council`, `ai-council`; `.skilled/commands/deep/{research,review,ai-council}.md` and `.skilled/agents/{deep-research,deep-review,ai-council}.md` all exist | OK-VERIFIED | P2 | none |
| README.md:562 | "Three loop families (research, review and AI council) live as nested mode packets inside one parent skill, `system-deep-loop`" | mode-registry.json `modes` (line 30) has length 3; `deprecatedModes` (line 29) is empty; the skill root holds `deep-research/`, `deep-review/`, `deep-ai-council/` and `mode-registry.json` | OK-VERIFIED | P2 | none |
| README.md:172 | "The runtimes' session hooks and the agent mirror check load this build" | The moved checker exists at its new home `.skilled/bin/check-agent-mirror-sync.cjs`; grep `mirror` over README.md → 11 matches, none naming any checker path, so no stale-path claim exists | OK-VERIFIED | P2 | none |

Note: every row was checked by opening the cited lines or running the cited command in this iteration. The two STALE count rows are the iteration's real defects; both trace to the v4.0.0.4 mode retirement, and both have a two-digit fix.

## Questions Answered

- None fully. Q3 part 1 (deep-loop modes, commands and agents, with counts) is covered; Q3's remaining feature areas stay open, so Q3 is not ticked.

## Questions Remaining

- Q3 (part 2): skill hubs, routing and the advisor, hooks, code-review output, unknown-option refusal, per-doc versions, playbook and catalog checks, CI gates.
- Q4: Which statements in the related READMEs are stale, missing or wrong against v4.0.0.4 and the repository?
- Q5: Which v4.0.0.4 user-facing changes do the READMEs leave out where a reader would need them, and which README statements were checked and found accurate?

## Ruled Out

- None this iteration.

## Dead Ends

- None this iteration.

## Edge Cases

- Ambiguous input: none material. The focus splits Q3; the narrower evidence-backed interpretation (part 1 = modes, commands, agents) was taken and the deferred parts are listed above.
- Contradictory evidence: `.skilled/bin/agent-mirror-crosswalk.md:16` still says "the same twelve agents" while all six trees hold 11. Resolved against the directory listings and git commit `e052417268` (`.skilled/agents/deep-improvement.md` deleted): the crosswalk's word is stale too, but the crosswalk is not a README, so it is out of finding scope — recorded as an observation for the related-docs pass.
- Missing dependencies: none. All state files present; gateway called after the writes.
- Partial success: none. All planned checks completed.

## Sources Consulted

- [SOURCE: README.md:172], [SOURCE: README.md:562], [SOURCE: README.md:630], [SOURCE: README.md:639], [SOURCE: README.md:648], [SOURCE: README.md:835], [SOURCE: README.md:933], [SOURCE: README.md:1074]
- [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:149], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:159]
- [SOURCE: .skilled/agents/README.txt:18], [SOURCE: .skilled/commands/README.txt:40], [SOURCE: .skilled/commands/README.txt:44], [SOURCE: .skilled/commands/README.txt:50], [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:16], [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json:29], [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json:30]
- Command outputs: `ls -1 .skilled/agents/*.md | wc -l` → 11; Node walk of the six command groups → create 13, deep 3, design 3, doctor 8, prompt 1, speckit 6 (34) + root 3; runtime tree counts → .opencode 12 entries, .claude 13, .cursor 11, .devin 11, .codex 11, .pi 11; `git log --diff-filter=D --name-only` → commit e052417268 deleted `.skilled/agents/deep-improvement.md`; grep `mirror` over README.md → 11 matches
- specs/sk-code/011-sk-code-poinytail-based-refinement/023-readme-freshness-research/research/deep-research-config.json; deep-research-state.jsonl; deep-research-strategy.md; findings-registry.json; iterations/iteration-001.md; iterations/iteration-002.md

## Assessment

- New information ratio: 0.83 (four of six findings fully new — two stale counts, one incomplete mirror description, one first-time pairing check; two re-verifications at half weight)
- Questions addressed: Q3 part 1
- Questions answered: none (Q3 stays open for its remaining parts)

## Reflection

- What worked and why: counting the repository side with the repository's own indexes (agents README.txt roster, commands README.txt group table) gave two independent confirmations for each count claim, so the STALE verdicts rest on both a directory walk and an authored index; checking git history pinned the 12 → 11 change to the exact commit, turning a count mismatch into a dated cause; reading the mode registry gave the command→agent pairs one authoritative source instead of six file-existence probes.
- What did not work and why: nothing failed. The crosswalk's stale "twelve agents" word briefly looked like a contradiction of the count finding; git history resolved it in the same pass.
- What I would do differently: fold the crosswalk-drift observation into the related-docs pass immediately rather than recording it as a deferred observation, since the same retirement produced both the README and the crosswalk drift.

## Recommended Next Focus

Iteration 4: Q3 part 2 — walk the root README's remaining feature statements against v4.0.0.4 and the repository: skill hubs and their version lines, routing and the advisor (README §7), hooks and dispatch guards (§14 off switches, hooks README), code-review output, scripts refusing unknown options, per-doc version model, playbook and catalog checks, CI gates. Carry-overs still open from iterations 1-2: locate the `spec/` restore README the changelog names (lines 65, 425) and confirm whether `mcp-click-up`'s cupt CLI still needs `CLICKUP_API_KEY`/`CLICKUP_TEAM_ID` so the README:1435 fix wording can be finalized.

## SCOPE VIOLATIONS

None.
