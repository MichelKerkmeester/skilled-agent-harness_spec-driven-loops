# Steering Log - post-merge research (sk-code-skilled and sk-doc conformance)

Orchestrator-owned record of each iteration focus. Angle ids continue the A1-A17 numbering of the original run in `../../research/steering-log.md`; this sibling runs A28-A29 (sk-code-skilled and sk-doc conformance) in parallel with phase 014.

## Entry 28 (iteration 1)

- Angle: A28
- Focus: A28 sk-code-skilled conformance: which code files changed by the four branches merged to main on 2026-10-19 miss the sk-code-skilled contract? List the changed code with `git log --name-only` over the merge commits `fe1f8a9a53`, `8e8e95e8e6`, `6358d81eba` and their branch commits (OpenCode plugins and `.opencode/plugins/lib/v2-bridge.js`, sk-vision `vision-runtime/src`, cli-opencode and deep-loop runtime scripts, doctor scripts, `.pi/extensions/pi-fast-mode-w-subagent-support/src`, `.skilled/skills/sk-git/scripts/worktree-naming.sh`). Load `.skilled/skills/sk-code/SKILL.md` and its skilled-mode references, then check file headers, section dividers, naming, comment hygiene (no spec paths or ids in comments), error handling and test coverage. Output: a per-file conformance table with file:line evidence and severity. Check: run any drift guard sk-code ships read-only; never edit files outside this research packet.

### Dispatch stopped (iteration 1, not a model fault)

The first dispatch (`research-i1-g1`) was stopped by the orchestrator before it completed: it shared one worktree with four other lineages, and the 014 and 015 dispatches had already failed write containment on each other's files. No iteration record was written. This packet then moved into its own worktree (`.worktrees/153-post-merge-research-conformance`) and iteration 1 reruns there.

## Executor switch (restart to generation 2)

The operator switched the executor to GLM 5.3 flash because llmgateway kept returning HTTP 500 and request timeouts for deepseek-v4.1-flash, opencode-go was over its usage limit and cline-pass returned 403. The session held no completed iteration, and its config pins the executor model, so it was restarted through the workflow's `restart` branch: the empty generation 1 moved to `../research_archive/20261019T190915Z/`, and this generation runs on cli-pi `glm-5.3-flash` (llmgateway, thinking max). Foci and angle ids are unchanged.

## Entry 28 (iteration 1)

- Angle: A28
- Focus: A28 sk-code-skilled conformance: which code files changed by the four branches merged to main on 2026-10-19 miss the sk-code-skilled contract? List the changed code with `git log --name-only` over the merge commits `fe1f8a9a53`, `8e8e95e8e6`, `6358d81eba` and their branch commits (OpenCode plugins and `.opencode/plugins/lib/v2-bridge.js`, sk-vision `vision-runtime/src`, cli-opencode and deep-loop runtime scripts, doctor scripts, `.pi/extensions/pi-fast-mode-w-subagent-support/src`, `.skilled/skills/sk-git/scripts/worktree-naming.sh`). Load `.skilled/skills/sk-code/SKILL.md` and its skilled-mode references, then check file headers, section dividers, naming, comment hygiene (no spec paths or ids in comments), error handling and test coverage. Output: a per-file conformance table with file:line evidence and severity. Check: run any drift guard sk-code ships read-only; never edit files outside this research packet.

### Digest (iteration 1, generation 2)

A28 done (ratio 0.95). Comment hygiene clean across 77 changed code files, drift guards 4/4 pass, headers exact, mirrors byte-identical. Misses: four sk-vision tests sit beside their sources in `src/` (F-001, P2); two sk-doc `test-` scripts are mounted by no runner (F-002, P2); the sk-vision OpenCode host adapter has no paired test (F-003, P2); `.pi` is absent from the central Node runner (F-004, P3). Next: A29.

## Entry 29 (iteration 2)

- Angle: A29
- Focus: A29 sk-doc conformance: which docs changed by the four branches merged to main on 2026-10-19 miss their sk-doc mode? List the changed `.md` files outside `specs/` with `git log --name-only` over the merge commits `fe1f8a9a53`, `8e8e95e8e6`, `6358d81eba` and their branch commits (cli-opencode references, `.opencode/plugins/README.md`, sk-vision hooks README, doctor command docs, `.pi/extensions/pi-fast-mode-w-subagent-support/README.md` and its `src`/`tests` READMEs, sk-git references, `SECURITY.md`). Load `.skilled/skills/sk-doc/SKILL.md`, route each doc to its mode, and run the mode's validator (for example `validate_document.py`) read-only. Also check the README test counts and claims against the current code. Output: a per-doc conformance table with validator output, file:line and severity. Check: validators read-only; never edit files outside this research packet.

### Digest (iteration 2, generation 2)

A29 done (ratio 0.9). Every focus-named changed README passes `validate_document.py` with 0 issues, and both changed skill roots pass `quick_validate.py`. `SECURITY.md` falls back to README rules (P3 `document_type_fallback`). It reached main on the main side of the same-day merges. The pi-fast-mode tests README claims 80 tests against 68 static declarations (P3). About 227 other changed docs were not run through their own mode validators.

### Gateway check (round 2)

The round summary counted 2 gateway-error lines in the 014 log and 1 in the 018 log. Those counts came from a loose pattern (`rate` instead of `rate.limit`) that also matches words such as "iterate" and "generate". A recount of the same logs with the strict pattern found 0 in all three. No gateway errors occurred in round 2, so the round stays at full concurrency. The pattern in the round script is now fixed.

### Spot checks by the orchestrator (before synthesis)

- `vision-runtime/src/` holds seven `*.test.ts` files, not the four iteration 1 named. F1 is confirmed and widened.
- `run-node-tests.mjs` roots leave out `.pi`, and its suffixes are `.test.mjs` and `.test.cjs`. `run-script-tests.sh` loops `test_*.py`. No script, config or workflow under `.skilled` or `.github` names either `test-frontmatter-version*` file. F2 and F4 confirmed.
- `tests/README.md:21` reads "7 files, 80 tests". A static count that includes `it.each` lines gives 71, so the count stays inferred until vitest runs.

### Answered-question mismatch (synthesis)

The closeout recorded `answered 1/2`. Iteration 2 answered the docs question, but its record spells it "Which changed **docs** miss their sk-doc mode, and how?". The reducer matches question text exactly, so the strategy's unbolded question stayed open. The reducer state was not edited. `research.md` and the spec fence give both counts and the reason.
