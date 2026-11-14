VERDICT: PASS

Task T003: count a shell read of a workflow document as a load (S, CTS). Baseline 47577daa6f.

1. Diff scope
- S: adds `SHELL_READERS` (the 11 readers named) and `shellReadTargets(command)` above `followedBeforeWrite` (splits on `;`, `&&`, `||`, `|`, line breaks, skips leading NAME=value words, drops words after a `>`/`>>` word, strips one pair of quotes, keeps `.md`/`.yaml`/`.yml`). `followedBeforeWrite` lets `shell` through and builds `named` from `shellReadTargets`. `ownerLoadedBeforeWrite` returns true for a pre-boundary shell event whose targets match `documents`, placed before the compiled-route check. Jsdoc and comment text extended to name the shell read. Nothing else in S changed.
- CTS: three cases added at the end of `describe('workflowPath')` with the names the task gives (the it.each title uses `$command` over objects, which renders the same title as `%s`). They build events through `normalize(oneTurn(toolCall('Bash', ...)), 'claude')`, the shape the surrounding workflowPath cases already use, rather than raw `ev(...)` objects. Expectations match the task: 'skill', 'command', 'none', 'none', not 'skill'.
- git status: S and CTS are T003. command-offer.mjs and command-offer.vitest.ts are lane O (T011, already verified). tasks.md and the six scratch/ files are coordinator T001/T002 output. Nothing foreign.

2. Test first
- Worker log: first run `Tests 2 failed | 85 passed (87)` with `expected 'none' to be 'skill'` and `expected 'improvised' to be 'command'`, exactly the failure the task names. Then `Tests 87 passed (87)`.
- My run: `env -u AI_SESSION_CHILD npx vitest run tests/command-transcript-score.vitest.ts` -> `Test Files 1 passed (1)`, `Tests 87 passed (87)`. `node --check S` exit 0. `npm run typecheck` exit 0.

3. Hygiene: added comment lines grep clean for em dash, semicolon, spec/phase/task/REQ/ADR ids.

4. Correctness probes (raw events through workflowPath, owner sk-doc, wrote false):
- `cat "./.skilled/skills/sk-doc/SKILL.md"` skill, `FOO=1 head -40 ...SKILL.md` skill, `cd x && cat ...SKILL.md` skill, `cat ...SKILL.md >> out.md` skill, `echo hi; ls ...SKILL.md` none. All right.
- `/bin/cat ...SKILL.md` none: an absolute reader path is not recognized. Conservative, within the task's "first word in SHELL_READERS" rule.
- `cat a.md 2> .skilled/skills/sk-doc/SKILL.md` skill: a numbered redirect (`2>`) is not treated as a redirect, so its target is read as a load. The task names only `>` and `>>`, and redirecting stderr onto an owner SKILL.md is not a realistic transcript, so P2 note only.
- Behaviour change implied by the task: a shell read of a confirm asset after the first write now sets confirmLate (probe: late `cat .../create-agent-confirm.yaml` makes followedBeforeWrite false). This follows from letting shell events through the kind check as the task says, and matches the read-tool rule.
