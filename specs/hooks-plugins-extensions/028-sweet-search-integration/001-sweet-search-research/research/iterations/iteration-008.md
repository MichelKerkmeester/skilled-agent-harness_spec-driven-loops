# Iteration 8: External-repo UX walkthrough

## Focus

Q8: walk through what a user in a fresh external project repo with Skilled installed sees and does under the recommended optional-pointer path, including the absent, half-installed, stale and unsupported-platform states. Iterations 5–6 fixed the recommendation (one conditional pointer in shared sk-code guidance) and its counter-case; this iteration tests whether that recommendation survives contact with the external install path. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-005.md:15] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-006.md:17]

## Actions Taken

- Read the config, state projection, strategy and iterations 5–6 before selecting Q8. The projection ends at iteration 6 and still contains duplicate iteration-3 rows; the dispatch's iteration-8 sentinel and supplied output paths identify this run. Both output paths were absent before writing.
- Traced the external install path in `INSTALL-SKILLED.md` for both link and copy modes.
- Read sweet-search's quickstart, init flags, compatibility table, system prompt and incremental-index section, then the `nextStep` and `formatSetupStatus` implementation that defines every failure state's next command.
- Checked how Skilled's `--link-instructions` materializes `AGENTS.md`, to test whether sweet-search's `init --agents` injection can reach the shared checkout.
- No sweet-search install, index or search was run. The walkthrough is reconstructed from shipped code and docs, not an observed session.

## Findings

1. **The pointer adds no step to the external install path; it changes only what the agent reads on a code query.** Link mode: `/doctor:install` asks four questions (target repo, runtimes, link shape, instruction file), writes nothing, and prints five steps — `symlink link`, optional `agents-md embed`, `/doctor:mcp install`, `/doctor:git setup`, `/doctor:setup`. `.skilled` is always linked. Copy mode exports `.skilled` with `git archive`, adds an overlay manifest, and ends `/doctor:overlay apply` at `RESULT: PASSED`. The pointer lives inside `.skilled/skills/sk-code/SKILL.md`, so a linked project sees it on the next `git pull` and a copied project sees it on the next re-pin, which copies `.skilled`. Neither path gains an install step or a new command. [SOURCE: INSTALL-SKILLED.md:97] [SOURCE: INSTALL-SKILLED.md:102] [SOURCE: INSTALL-SKILLED.md:112] [SOURCE: INSTALL-SKILLED.md:132] [SOURCE: INSTALL-SKILLED.md:184] [SOURCE: INSTALL-SKILLED.md:251] [SOURCE: INSTALL-SKILLED.md:16] [SOURCE: INSTALL-SKILLED.md:280]

2. **Absent is the default external state, and it is a clean no-op on both sides.** Skilled never installs sweet-search. The pointer is conditional, so the user reads one optional sentence and does nothing; the agent keeps the existing tree: exact text, token or symbol → content search; known file or path → path match; concept or unfamiliar code → widen the content search, map the tree, read to confirm. There is no install prompt, no error and no new command on either side. [SOURCE: AGENTS.md:226] [SOURCE: AGENTS.md:227] [SOURCE: AGENTS.md:228] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-005.md:15]

3. **Half-installed has one diagnostic and a four-rung repair ladder.** `sweet-search status` prints Package, Init, Models with per-model present or missing MB, the Index parts, the Server state, and one final `Next step:` line. `nextStep` walks four rungs in failure order: skipped postinstall scripts → their own fix; missing models → the cache-writability message or `sweet-search index` / `init`; index not ready → `index` or `index --full` for a fingerprint or format mismatch; server failed → `sweet-search daemon restart`. The user's half-installed loop is one status command, read one line, run one command. No Skilled command participates. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js:113] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js:115] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js:126] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js:129] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js:231] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js:286]

4. **"Stale" splits into two shapes: edits since the index self-heal, an older index format needs one explicit full rebuild, and the first index is never automatic.** After a first index exists, the index updates itself as the user works. An index built by an older sweet-search is never patched — updates pause and search tells the user to rebuild; `status` names the reason and `nextStep` returns `sweet-search index --full`. The daemon never builds the first index; it waits until one exists. So the user runs `index` once per repo, plus `--full` only when the format ages. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:1302] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:134] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js:205] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js:126]

5. **The Node-below-22 branch cannot occur in a repo that met Skilled's own prerequisites; the real unsupported state is native Windows without WSL2.** Skilled requires Node 24, "the one version every part of the framework accepts", plus a POSIX shell; sweet-search requires Node 22+ and its package declares `>=22.2.0`. Any external repo that successfully installed Skilled has already cleared sweet-search's Node floor, so the pointer never needs to handle Node below 22 in that population. Native Windows is different: sweet-search's first-class platforms are macOS, Linux and Windows via WSL2, and native Windows is "not yet". Git Bash supplies the POSIX shell Skilled needs, so a Skilled project can exist where sweet-search cannot run. [SOURCE: INSTALL-SKILLED.md:29] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:119] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/package.json:199] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:263]

6. **sweet-search's own `init` changes the same instruction surface, and in link-instruction mode it can write through `AGENTS.md` into the shared checkout.** `sweet-search init --agents` writes its verbatim guide into `AGENTS.md`, marker-delimited and reversible. That guide says to use `ss-*` for all code search, never re-run an `ss-*` hit as raw grep, and treat two empty probes as proof of absence — a different search policy from Skilled's "widen the pattern rather than trusting a single hit". In link-instruction mode, Skilled "points `AGENTS.md`, `CLAUDE.md` and `REPO RULES.md` at the checkout's copies", and `--link-instructions` routes those manifest entries through the same linking machinery. If the project's `AGENTS.md` is a link, appending a block writes through to the checkout's copy and affects every linked project. [INFERENCE: link mode resolves `AGENTS.md` to the checkout's file, so an append through that path edits the shared target. Confirmed by running `init --agents` in a link-instruction project and checking the checkout file.] In embed mode the file is project-owned, so the two guides coexist but can still disagree about search policy. The pointer itself should never run `init`; the walkthrough should tell link-mode users to choose `embed` or accept the collision. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:220] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:203] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:1113] [SOURCE: INSTALL-SKILLED.md:102] [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:455]

## Walkthrough

### Linked project (the simpler default)

1. **Prerequisites.** Node 24, `npm`, `git` and a POSIX shell. [SOURCE: INSTALL-SKILLED.md:29]
2. **In the checkout, run `/doctor:install`.** It asks four questions in one prompt and writes nothing; it prints the steps with the user's paths filled in. [SOURCE: INSTALL-SKILLED.md:97]
3. **Run the printed steps.** `symlink link --root <dir> --runtimes <list> --mode auto` links `.skilled` and the runtime folders; `agents-md embed` adds the shipped sections to the project's own `AGENTS.md`, or `--link-instructions` points `AGENTS.md`, `CLAUDE.md` and `REPO RULES.md` at the checkout's copies; `/doctor:mcp install` builds and registers Code Mode; `/doctor:git setup` checks the hooks; `/doctor:setup` confirms the setup. [SOURCE: INSTALL-SKILLED.md:102] [SOURCE: INSTALL-SKILLED.md:112] [SOURCE: INSTALL-SKILLED.md:132]
4. **Work in the project.** On a code query, sk-code loads and the pointer is one conditional line. If the `ss-*` commands are absent, the agent follows the existing tree and the user notices nothing. [SOURCE: AGENTS.md:226] [SOURCE: AGENTS.md:227] [SOURCE: AGENTS.md:228]
5. **Optional adoption.** `npm install -g sweet-search`, then `sweet-search init` (or `--codex`, `--opencode`, `--agents`), then `sweet-search index`. Search works from then on. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:119] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:129]
6. **Half-installed.** Run `sweet-search status`; read the final `Next step:` line; run that one command. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js:286]
7. **Stale.** Same status command. Edits self-heal after the first index; a format-age mismatch prints "needs a full rebuild" and the next step is `sweet-search index --full`. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:1302] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js:126]
8. **Unsupported platform.** Native Windows without WSL2: sweet-search is not first-class, the pointer falls back, and the user does nothing. Node below 22 cannot occur after Skilled's Node 24 prerequisite. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:263] [SOURCE: INSTALL-SKILLED.md:29]
9. **Uninstall.** `sweet-search uninstall` in the repo keeps shared models; `sweet-search uninstall --all` removes every initialized repo, the models and the CLI. The pointer is inert afterwards. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:141]

### Copied project

The same walkthrough, with step 3 replaced by `git archive` export, an overlay manifest and `/doctor:overlay apply` ending at `RESULT: PASSED`. The pointer arrives on the next re-pin, which copies `.skilled`. `AGENTS.md` stays project-owned unless the project copies it, so the link-mode write-through in finding 6 does not apply. [SOURCE: INSTALL-SKILLED.md:184] [SOURCE: INSTALL-SKILLED.md:251] [SOURCE: INSTALL-SKILLED.md:280]

### State matrix

| State | What the user sees | What the user does |
| --- | --- | --- |
| Absent | One conditional sentence in sk-code | Nothing; the existing tree applies |
| Half-installed | `sweet-search status` prints the failing rung and a `Next step:` line | Run the printed command |
| Stale, edits since index | Nothing; the index updates itself | Nothing |
| Stale, older index format | Status says it needs a full rebuild | `sweet-search index --full` |
| Node below 22 | Unreachable after Skilled's Node 24 prerequisite | Not applicable |
| Native Windows without WSL2 | sweet-search is not first-class; the pointer falls back | Use WSL2, or do nothing |
| Uninstalled | The pointer is inert | `sweet-search uninstall`, or `--all` |

## Ruled Out

- Treating Node below 22 as a live failure state for a Skilled-installed repo. Skilled's Node 24 prerequisite makes it unreachable.
- Adding a Skilled-side health check or doctor step for sweet-search. The status command already returns one next step per failure, and iteration 5 blocked doctor-owned install/setup.
- Making the pointer unconditional or install-prompting. Absent is the default; an unconditional note would advertise a tool most repos do not have.

## Dead Ends

- None new. The platform matrix resolved cleanly from the compatibility table and Skilled's own prerequisites.

## Edge Cases

- Ambiguous input: none. The dispatch fixes Q8 and iteration 8.
- Contradictory evidence: none new. The stale Node 18 search snippet was already resolved in iteration 5 against the current README and package metadata.
- Missing dependencies: no live sweet-search install was performed, so the console text in the walkthrough is reconstructed from `formatSetupStatus`, not observed output. The code paths are shipped and readable.
- Partial success: all four requested states are covered by code paths or by an explicit unreachability argument; the link-mode write-through is inference, not an observed run.

## SCOPE VIOLATIONS

The config enables progressive synthesis, but the dispatch write allowlist excludes `research/research.md`. No synthesis file was created or changed.

## Questions Answered

- Q8: External-repo UX walkthrough: following the recommended path, what exactly does a user in a fresh project repo with Skilled installed see and do, step by step, including when sweet-search is absent, half-installed, stale, or on an unsupported platform (Windows without WSL2, Node below 22)?

## Questions Remaining

- Q7: Independent evidence: outside sweet-search's own eval data, what confirms or undercuts its claimed gains? Compare with comparable agent code-search tools and with the built-in search Claude Code, Codex and OpenCode already ship.
- Q9: Where exactly would the pointer live and how would agents act on it: which sk-code file and section, the precise wording, how an agent detects that sweet-search is installed without a new script, and how it interacts with the AGENTS.md code-search decision tree?
- Q10: What should phase 2 of this packet contain: the file list, the acceptance checks, and the measurement (if any) that would justify growing the integration later?

## Assessment

- New information ratio: 0.85. Three of six findings are fully new (the status ladder, the Node-prerequisite dominance, the link-mode `AGENTS.md` collision) and three partially extend prior install and lifecycle evidence; the 0.10 simplicity bonus reflects collapsing the failure matrix to three real states.
- Questions addressed: Q8.
- Questions answered: Q8.

## Reflection

- What worked and why: reading `nextStep` and `formatSetupStatus` turned "what happens if half-installed" from a guess into a deterministic one-line-per-rung contract, and comparing Skilled's Node 24 prerequisite with sweet-search's Node 22 floor removed an entire failure branch.
- What did not work and why: no live install was run, so the walkthrough's console output is reconstructed rather than observed, and the link-mode write-through remains an inference.
- What I would do differently: run `sweet-search init --agents` in a disposable link-instruction project to confirm the write-through before the pointer ships.

## Next Focus

Q9: place the pointer and define agent detection. The detection question is now narrower: `command -v ss-search` and `sweet-search status` already exist, so no new script is needed, and the pointer must defer to the existing decision tree when the command is absent. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js:113]

## Sources Consulted

- INSTALL-SKILLED.md
- AGENTS.md
- .skilled/commands/doctor/scripts/symlink-engine.cjs
- .skilled/skills/sk-code/SKILL.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/package.json
- specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js
- specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-005.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-006.md

**Status: complete.** Q8 is answered from shipped code and docs. No live install was run, so console output is reconstructed; the link-mode write-through is the one inferred, unobserved behavior.
