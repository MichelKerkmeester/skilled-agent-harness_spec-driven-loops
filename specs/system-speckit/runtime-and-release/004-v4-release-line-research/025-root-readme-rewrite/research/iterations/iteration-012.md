# Iteration 12: Install-Path Verification for the Reader's First Screen

## Focus

All five key questions were resolved by iteration 8, so this iteration took the lowest-coverage area that still bears on the rewrite: the install path and the repository map a new reader meets first. Q4 audited install *claims* (the Node range at `README.md:164`) but never executed the copy-paste block, never checked the clone URL, and never measured what a clone actually contains versus the working tree.

Four questions, in priority order:

1. Does the README's clone-and-build block run as written?
2. Is the clone URL the real remote?
3. What does a fresh clone's top level contain, and does anything in it need explaining that the README does not explain?
4. Where would a version badge get its number?

Deferred: the per-runtime activation mechanism (what a user does in Claude Code versus Codex versus Pi to make the hooks live). `INSTALL-SKILLED.md` owns it and the README already delegates to it, so the rewrite does not need it re-derived.

## Actions Taken

1. Read the config, state projection, strategy and the Q4 audit narrative to fix the iteration number, the focus, the exhausted-approach list, and to avoid re-auditing Q4.
2. Read `README.md:150-269` (QUICK START through the own-project section) for the exact install claims and the copy-paste block.
3. Enumerated the working-tree top level, `.skilled/bin/`, every `package.json` within depth 3, and `.github/workflows/`.
4. Read `scripts`, `engines` and `version` from the three relevant package manifests, and compared the git remote with the README URL.
5. Executed the README's advisor verification command (`list-tools --format json`).
6. Diffed root `repo-rules/` against `.skilled/repo-rules/`, counted tracked files in both, and searched every non-spec, non-markdown reference for which copy anything reads.
7. Searched for a caller of `install-git-hooks.sh` and for any `core.hooksPath` writer outside `specs/`.

## Findings

### Verified — the install block is sound

1. **The clone URL is the real remote.** `README.md:167` names `https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git`, and `git remote -v` reports that exact URL for both fetch and push. [SOURCE: README.md:167] [INFERENCE: `git remote -v` origin matches character for character]

2. **Both build commands exist, and the README's ordering is causally required, not stylistic.** `system-spec-kit` declares a `build` script that runs `prepare-build`, `tsc --build` and `finalize-dist.mjs`; the advisor runtime declares `prebuild` and `build` scripts whose bodies call `../../system-spec-kit/runtime/cli/lib/dist-freshness.cjs` and `npm --prefix ../../system-spec-kit/shared run build`. The advisor build therefore fails if the Spec Kit build has not run, which is exactly what "build it after the Spec Kit" tells the reader. [SOURCE: .skilled/skills/system-spec-kit/package.json] [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json]

3. **The advisor verification command executes successfully.** `node .skilled/bin/skill-advisor.cjs list-tools --format json` exits 0 and returns 15,173 bytes with `status: ok`, `count: 9`, `mode: full`, on Node v26.13.0 — inside the declared `>=26.12.1` branch. This is the only README command this run executed end to end, and it is correct as written. [SOURCE: .skilled/bin/skill-advisor.cjs]

### P1 — one install claim has no mechanism behind it

4. **"The first AI session installs the repository's git hooks" (`README.md:214`) is unsupported by any caller found.** The installer exists at `.skilled/scripts/install-git-hooks.sh`, but every non-markdown reference to it is a manual path: `/doctor:git` status and repair, `/doctor:update --apply`, and the create-skill follow-ups. No file under `.skilled/hooks` mentions `git-hooks`, `install-git-hooks` or `core.hooksPath`. The hooks README describes installation as an explicit `install-git-hooks.sh` run that symlinks each hook into `.git/hooks/`, with `--status` reporting whether a global `core.hooksPath` shadows the checkout. A session cannot install the hooks through any discovered caller, so the sentence promises automation the tree does not contain. [SOURCE: README.md:214] [SOURCE: .skilled/scripts/install-git-hooks.sh] [SOURCE: .skilled/scripts/git-hooks/README.md] [INFERENCE: two searches — `rg 'install-git-hooks'` outside `specs/`, and `rg 'git-hooks|install.*hooks|core\.hooksPath' .skilled/hooks`, the second returning no hit under `.skilled/hooks`]

### P2 — repository-map facts a rewrite must get right

5. **Root `repo-rules/` is a tracked, byte-identical duplicate of `.skilled/repo-rules/`, and nothing references the root copy.** `diff -rq` exits 0 with no output; both hold the same ten filenames and both are tracked with ten files each. Every reference in `AGENTS.md`, `REPO RULES.md`, `.skilled/scripts`, `.skilled/bin` and `.github` resolves to `.skilled/repo-rules/`. A repo map should name `.skilled/repo-rules/` as the source and treat the root copy as a mirror; presenting the root copy as a peer would imply two rule sets where there is one. [SOURCE: AGENTS.md:104] [SOURCE: .skilled/repo-rules/] [SOURCE: repo-rules/] [INFERENCE: `diff -rq repo-rules .skilled/repo-rules` and `git ls-files` counts on both]

6. **The clone view and the working tree differ by three entries.** `git ls-tree --name-only HEAD` lists 29 top-level entries; `barter/`, `relative-repo/` and root `node_modules/` are untracked, and `barter` and `relative-repo` hold zero tracked files. A README repo map must be built from the tracked list, not from `ls`, or it will document directories a reader never receives. [INFERENCE: `git ls-tree --name-only HEAD` compared against `ls -1` and per-directory `git ls-files` counts]

7. **The tracked top level carries seven root configuration files that a map must account for:** `.env.example`, `.mcp.json`, `.npmrc`, `.utcp_config.json`, `opencode.json`, `tsconfig.pi.json` and `tui.json`. Iteration 11 settled the MCP registration topology; what remains for the rewrite is presenting these as one "configuration at the root" row rather than scattering them across sections. [INFERENCE: `git ls-tree --name-only HEAD`]

8. **No package manifest carries the repository version, so a version badge must read the tag.** There is no root `package.json`; `.skilled/package.json` holds only `type`, dependencies, devDependencies and overrides — no `name`, `version`, `engines` or `scripts`. `git describe --tags --always` returns `v4.0.2.1-38-g3c15d3fde6a`, which independently reproduces iteration 1's 38-commit post-tag count. A badge or version line sourced from a package manifest would have nothing to read. [SOURCE: .skilled/package.json] [INFERENCE: `git describe --tags --always`]

### Anchors and delegation verified

9. **The README's four `INSTALL-SKILLED.md` anchors all resolve.** The linked targets are `#2-install-a-skilled-checkout`, `#3-link-it-into-your-project`, `#4-copy-it-into-your-project` and `#what-gets-linked`; the guide's headings are `## 2. INSTALL A SKILLED CHECKOUT`, `## 3. LINK IT INTO YOUR PROJECT`, `## 4. COPY IT INTO YOUR PROJECT` and `### What Gets Linked`. No broken install link exists to fix. [SOURCE: INSTALL-SKILLED.md:25] [SOURCE: INSTALL-SKILLED.md:120] [SOURCE: INSTALL-SKILLED.md:164] [SOURCE: INSTALL-SKILLED.md:201]

## Ruled Out

- **Re-running the Node-version audit.** Q4 settled it: `README.md:164` says "Node.js 24" while both packages declare `^22.23.4 || ^24.22.1 || >=26.12.1`. A second pass would repeat iteration 6.
- **Reading all 35 workflow files to name badge candidates.** The map finding is about root entries; badge selection happens at rewrite time from `.github/workflows/`, which is already listed.
- **Reading `INSTALL-SKILLED.md` in full.** Its H2 structure plus the four anchors the README links answers the delegation question; the guide's body is install detail the root README is supposed to link, not repeat.
- **Deriving the install path from the release notes.** The manifests and the executed command are authoritative; the release narrative only explains when the doctor family arrived.

## Dead Ends

- **Treating `timeout 45 node ...` as portable.** macOS has no `timeout` binary, so the first advisor run exited 127 for that reason, not because the command was wrong. Retried without the wrapper and it passed. This is a harness portability trap, not a README defect.

## Edge Cases

- Ambiguous input: none. The focus was chosen from the lowest-coverage reader-facing area after all key questions resolved.
- Contradictory evidence: `README.md:214` promises an automatic install while no caller exists (finding 4). Recorded with both sides and the search scope; not smoothed into "probably fine" and not upgraded to "definitely false" beyond the evidence.
- Missing dependencies: `timeout` absent on macOS, retried without it.
- Partial success: none. Every action produced usable evidence.

## Sources Consulted

- `README.md:150-269` (`:164`, `:167`, `:171-177`, `:214`, `:220`)
- `.skilled/package.json`
- `.skilled/skills/system-spec-kit/package.json`
- `.skilled/skills/system-skill-advisor/runtime/package.json`
- `.skilled/bin/skill-advisor.cjs`
- `.skilled/scripts/install-git-hooks.sh`
- `.skilled/scripts/git-hooks/README.md`
- `.skilled/repo-rules/`, `repo-rules/`
- `AGENTS.md:104`, `REPO RULES.md:40-49`
- `INSTALL-SKILLED.md:25`, `:120`, `:164`, `:201`
- Commands: `git remote -v`, `git ls-tree --name-only HEAD`, `git describe --tags --always`, `diff -rq repo-rules .skilled/repo-rules`, `node .skilled/bin/skill-advisor.cjs list-tools --format json`

## Assessment

- New information ratio: 0.88
- Questions addressed: none open; residual reader-facing verification
- Questions answered: none (all five were already ticked)

## Reflection

- What worked and why: executing the README's own verification command was the cheapest possible end-to-end test of the install block. A read of the script could only have shown that the file exists; the run showed that the command exits 0, returns a 15 KB payload and names nine tools. Pairing it with the advisor's `prebuild`/`build` bodies then explained *why* the README's ordering matters, turning an instruction into a verified dependency.
- What did not work and why: the first advisor run failed on `timeout`, which macOS does not ship. The exit code was 127 — a missing wrapper, not a failing command — and retrying without it was the whole fix. The same class of mistake as iteration 4's `&&` chain: a harness assumption produced a false negative.
- What I would do differently: before accepting an installer's existence as proof of an automatic install, search for its caller. Finding 4 only emerged because the search asked "who runs this", not "does this exist".

## Next Focus

The rewrite does not need another research iteration. Two carry-over items are decisions, not measurements: whether the root `repo-rules/` mirror is documented or removed, and the `sk-design` README gap recorded in iteration 6. If the loop continues, the only unmeasured reader-facing surface left is per-runtime activation, and `INSTALL-SKILLED.md` already owns it.

## SCOPE VIOLATIONS

- `research/research.md` was not updated although `progressiveSynthesis` is true in config. This dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-012.md` and `deltas/iter-012.jsonl`, so the synthesis edit was not executed. The synthesis still lists Q3 and Q4 as open in its §5 and has no §5E-§5I. The material is ready to paste: findings 1-9 above.
