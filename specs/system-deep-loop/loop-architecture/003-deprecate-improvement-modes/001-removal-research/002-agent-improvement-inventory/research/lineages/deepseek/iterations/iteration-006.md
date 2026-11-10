# Iteration 6: Runtime mirrors A — `.claude/` physical copy vs `.opencode/` symlink farm

## Focus

Determine, for every agent-improvement surface in `.claude/` and `.opencode/`, whether it is a symlink, a generated copy or a hand-written file: agents, commands, skills, hooks, plugins and sync docs.

## Actions Taken

1. `ls -la` on `.claude/` and `.opencode/` roots to classify each entry as symlink or real directory.
2. `ls -la .claude/agents/`, `.claude/commands/`, `.claude/commands/deep/`, `.opencode/agents/` for per-file identity.
3. `diff .claude/agents/deep-improvement.md .skilled/agents/deep-improvement.md` to characterize the mirror translation.
4. `rg -l` for the mode tokens across both runtime trees; then line-level greps on `.claude/SYNC.md`, `.claude/agents/README.txt` and the two plugin test files.
5. Inspected `.opencode/plugins/system-deep-loop-guard.js` for how it resolves modes.

## Findings

1. **`.claude/agents/deep-improvement.md` is a physical, hand-translated mirror copy** — the diff against the canonical `.skilled/agents/deep-improvement.md` shows a rewritten frontmatter block (`tools: Read, Write, Edit, Bash, Grep, Glob` at line 4 replacing the `permission:` object) and a path-convention line naming `.claude/agents/*.md` as canonical for that runtime; the body is otherwise identical. This is the file class the mirror checker exists to police. Disposition: DELETE (with the canonical agent). [SOURCE: .claude/agents/deep-improvement.md:4]
2. **`.claude/agents/README.txt` documents the mirrored roster and the translation contract** — line 11 points at `deep-improvement/references/shared/agent-mirror-crosswalk.md`, line 27 lists `deep-improvement` as the proposal-only mutator. Disposition: EDIT. [SOURCE: .claude/agents/README.txt:27]
3. **`.claude/commands/deep/agent-improvement.md` is a symlink, not a copy** — it resolves to `../../../.skilled/commands/deep/agent-improvement.md`, so target deletion removes the runtime command with no second edit. [SOURCE: .claude/commands/deep/agent-improvement.md]
4. **`.claude/skills` is a symlink to `../.skilled/skills`** — the whole packet (including the deep-improvement tree) is reachable through the symlink; there is no `.claude` copy of the packet to delete. [SOURCE: .claude/skills]
5. **`.opencode/` is a symlink farm for every agent-improvement surface** — `agents -> ../.skilled/agents`, `commands -> ../.skilled/commands`, `skills -> ../.skilled/skills`, plus `bin`, `hooks`, `scripts`, `repo-rules` all symlinked. No `.opencode` copies exist for the agent, the command or the packet, so no mirror edits beyond the canonical sources. Exceptions: `.opencode/plugins/` and `.opencode/package.json` are real. [SOURCE: .opencode/agents]
6. **`.claude/SYNC.md` documents the packet's mirror checker in the sync ritual** — line 57 (`check-agent-mirror-sync.cjs --all`) and the alignment table line 100 ("0 ok / non-zero blocks commit"). Disposition: EDIT (one of the outside-mode checker callers). [SOURCE: .claude/SYNC.md:57]
7. **The OpenCode deep-loop guard plugin is registry-driven, not mode-hardcoded** — `system-deep-loop-guard.js` reads `mode-registry.json` for the resolved target agent (header line 8) and fails open on a missing/unreadable registry (line 49). No source edit is needed for deletion beyond the registry itself. [SOURCE: .opencode/plugins/system-deep-loop-guard.js:8]
8. **Its test file pins `agent-improvement` fixtures and also names a third mode `skill-benchmark`** — `system-deep-loop-guard.test.cjs` lines 35-37 list `{workflowMode: 'agent-improvement'|'model-benchmark'|'skill-benchmark', agent: 'deep-improvement'}`, lines 111-125 assert all three stay valid and a nonsense mode logs the sorted registry list, line 344 exercises the fail-open path with `mode=agent-improvement`. Disposition: EDIT. [SOURCE: .opencode/plugins/tests/system-deep-loop-guard.test.cjs:35]
9. **The Claude task-dispatch guard test carries the same fixture set** — `claude-task-dispatch-guard.test.cjs` lines 47-49 (three modes), 168-185 (validity + advisory regex `registry modes="agent-improvement|model-benchmark|skill-benchmark"`), 378 (fail-open). Disposition: EDIT. [SOURCE: .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs:47]
10. **Ambiguity recorded: the tests permit a `skill-benchmark` mode that mode-registry.json does not list** — the registry's two improvement lanes are `agent-improvement` and `model-benchmark`; both plugin tests also allow `skill-benchmark`, a value absent from the registry and from the hub-router vocabulary. This is a pre-existing drift signal, relevant to deletion planning because the guard fixtures must be reconciled to whatever mode set survives. Disposition: record for the deletion plan (reconcile fixtures with registry). [SOURCE: .opencode/plugins/tests/system-deep-loop-guard.test.cjs:37]

## Ruled Out

- Expecting mirrored copies under `.opencode/`: every deep-loop surface resolves through directory symlinks to `.skilled`, so `.opencode` needs no per-file edits for the mode.

## Dead Ends

- `.claude/hooks` carries no agent-improvement mentions (verified by the repo-tree rg over `.claude`).

## Edge Cases

- Contradictory evidence: the two guard tests assert `skill-benchmark` as a permitted deep-improvement mode while the registry omits it; both are recorded (finding 10) without resolving, per the no-operator rule.
- Ambiguous input: none beyond the above.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .claude/agents/deep-improvement.md:4,13
- .claude/agents/README.txt:11,27
- .claude/commands/deep/agent-improvement.md (symlink)
- .claude/skills (symlink)
- .claude/SYNC.md:57,100
- .opencode/agents, .opencode/commands, .opencode/skills, .opencode/bin, .opencode/hooks, .opencode/scripts, .opencode/repo-rules (symlinks)
- .opencode/plugins/system-deep-loop-guard.js:8,49
- .opencode/plugins/tests/system-deep-loop-guard.test.cjs:35-37,111-125,344
- .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs:47-49,168-185,378

## Assessment

- New information ratio: 0.9
- Questions addressed: KQ3 (mirror nature for .claude/.opencode), KQ1 (mirror-side references)
- Questions answered: none in full (KQ3 needs the other five runtime dirs)

## Reflection

- What worked and why: `ls -la` symlink inspection settled the symlink-vs-copy question per entry in two calls; the diff then characterized the one real copy precisely.
- What did not work and why: nothing failed; the `skill-benchmark` fixture value was an unexpected discovery that the token sweep caught.
- What I would do differently: run the identical symlink classification for `.codex`, `.cursor`, `.pi`, `.devin`, `.hermes` in the next iteration with the same per-entry discipline.

## SCOPE VIOLATIONS

- None.

## Recommended Next Focus

Iteration 7: runtime mirrors B — `.codex/`, `.cursor/`, `.pi/`, `.devin/`, `.hermes/` (including the Hermes `agent-*` skill mirrors), classifying each agent-improvement surface as symlink, generated copy or hand-written file.
