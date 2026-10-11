# Iteration 1: Documented install path for an external user (Q1)

## Focus

Q1 -- What is the documented install path for an external user (README, PUBLIC-RELEASE.md, CONTRIBUTING.md, install guides), and what does each step require up to the first routed request and the first spec packet?

Scope: the documentation layer, plus read-only probes in the fresh-clone fixture at `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/8bb7f97a-f291-4af3-b712-1b46f9323681/scratchpad/o2-fresh-clone` (HEAD `82a71c87d0`, identical to this worktree HEAD, no `node_modules`). Runtime-floor reproduction (Node 18/20.19/22.12) is deferred to Q2; build-gap reproduction to Q3; hook-trust cost measurement to Q4.

## Actions Taken

1. Read externalized state: config, state JSONL, strategy (iteration 1, focus Q1, stopPolicy `max-iterations`, session `dr-002-fresh-clone-2026-10-11T16-22-38-567Z`).
2. Oriented on the tree: root listing, tracked-file search, `package.json` inventory (worktree and clone, 15 manifests outside `specs/`), clone git state, doc dirty-check (README / PUBLIC-RELEASE / CONTRIBUTING clean vs HEAD).
3. Read README.md: heading map; section 4 QUICK START (lines 154-238); section 11 SPEC KIT command library (1064-1114); section 14 config (1456-1492); section 15 FAQ (1496-1592).
4. Read CONTRIBUTING.md (196 lines) and PUBLIC-RELEASE.md (307 lines) in full.
5. Read the linked Code Mode install guide (`.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md`, first 120 lines) and both package manifests behind README install steps 2-3.
6. Probed the fresh clone read-only: runtime-config presence, README Verify-step grep, tracked `.skilled_skills*` count and names, hook-script presence, advisor `dist` absence.

## Findings

1. **README section 4 is the only end-to-end install path.** Documented sequence: clone -> `npm --prefix .skilled/skills/system-spec-kit install` -> `npm --prefix .skilled/skills/system-skill-advisor/runtime install` + `... run build` -> verify `node .skilled/bin/skill-advisor.cjs list-tools --format json` -> "Open OpenCode in your project directory" -> `/speckit:complete Build a user authentication system`. That `/speckit:complete` call is the documented first routed request and also creates the first spec packet ("Creates a spec folder"). [SOURCE: README.md:154-176] [SOURCE: README.md:210-225]
2. **Three documents declare three different Node floors.** README: "Node.js 20.19+ (22.12+ for the spec-kit runtime CLI)". CONTRIBUTING: "Node.js 18+". The Code Mode install guide the README points to: "Dependencies: Node.js 24". The advisor manifest declares `^20.19.0 || >=22.12.0`; the spec-kit workspace manifest declares `>=20.11.0`. The spec-kit CLI workspace manifest (`runtime/cli/package.json`) was not read this iteration -- CARRIED FORWARD to Q2; whether Node 18 actually breaks is unverified today, the doc contradiction is verified. [SOURCE: README.md:160] [SOURCE: CONTRIBUTING.md:25] [SOURCE: .skilled/skills/mcp-code-mode/INSTALL-GUIDE.md:6] [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:6-8] [SOURCE: .skilled/skills/system-spec-kit/package.json:11-13]
3. **CONTRIBUTING setup never reaches a first routed request.** Its install block installs only `.skilled/skills/system-spec-kit`; it never installs or builds the advisor runtime, which the README verification step checks. A contributor following only CONTRIBUTING finishes "setup" without the component that answers the first routed request, and is told "Your first AI session in the clone installs this repository's git hooks" -- a machine-wide hook install with no numbered step. [SOURCE: CONTRIBUTING.md:29-41] [SOURCE: README.md:179-186]
4. **README step 3 has an unstated cross-workspace dependency.** The advisor `build` script runs `npm --prefix ../../system-spec-kit/shared run build` and invokes `../../system-spec-kit/node_modules/.bin/tsc`, so step 3 only works after step 2 install completes; the prose never states it. `main` points at `./dist/runtime/advisor-server.js`, and no `dist` exists in the fresh clone, so `list-tools` cannot work before the build. [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:5] [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:11] [INFERENCE: fresh-clone probe listing the advisor runtime directory; no dist entry; this iteration]
5. **Docs contradict themselves about first-run auto-build.** Prerequisites say "the advisor launcher installs and builds its own runtime on first run", while the numbered path tells the user to install and build it manually. A user trusting the first sentence may skip step 3; the launcher actual behavior is unverified (Q2). [SOURCE: README.md:162] [SOURCE: README.md:172-176]
6. **PUBLIC-RELEASE.md is not an install path and can mislead.** It documents the maintainer release workflow and the symlink consumer model (`ln -s <framework-checkout>/.opencode .opencode`, `cp opencode.json .`, editing the shared checkout `.gitignore` with `specs/NNN-your-project/`). That presupposes ownership of a shared framework checkout; a stranger cloning the repository cannot follow it for a standalone install, and the document never says so. [SOURCE: PUBLIC-RELEASE.md:204-235] [SOURCE: PUBLIC-RELEASE.md:74-182]
7. **"First Use" names only OpenCode, though seven runtime configs ship.** The README Verify step greps `opencode.json`, `.mcp.json`, `.claude/mcp.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.devin/mcp_config.json`, `.pi/mcp.json`; all seven exist in the fresh clone and all reference `mcp-code-mode-launcher` (probe). The first-use instruction names only OpenCode, leaving users of the other six runtimes without a documented first step. [SOURCE: README.md:210-216] [SOURCE: README.md:183] [INFERENCE: fresh-clone Verify-step probe; 7/7 configs matched; this iteration]
8. **Hook trust is prose, not a step, on the fresh-clone path.** A fresh clone's hooks run the toolchain scripts only after `git config --local skilled.trustRepoHooks true`; the requirement sits mid-prose in Git Hooks, and hook install itself fires silently on "the first AI session". Cost (blocked commit vs silent degradation) is Q4's measurement. [SOURCE: README.md:189-197] [SOURCE: CONTRIBUTING.md:41]
9. **Code Mode setup is a deferred side-quest with its own prerequisites.** README step 3 defers Code Mode to a separate guide; that guide requires checking a Node 24 interpreter, `npx`, and creating `.utcp_config.json` + `.env`, and estimates 10-15 minutes -- none of it surfaced in the README numbered sequence, yet the first `/speckit:complete` request routes through MCP. [SOURCE: README.md:173] [SOURCE: .skilled/skills/mcp-code-mode/INSTALL-GUIDE.md:18-24] [SOURCE: .skilled/skills/mcp-code-mode/INSTALL-GUIDE.md:41]
10. **A fresh clone carries 36 empty tracked `.skilled_skills_*` files at the repository root.** Verified this iteration: count 36, each 0 bytes (spot-checked names such as `.skilled_skills_cli-orca`, `.skilled_skills_mcp-code-mode`). No document mentions them; cosmetic clutter that appears in every listing. [INFERENCE: git ls-files probe, count 36, 3 spot-checked at 0 bytes, this iteration] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/research/deep-research-strategy.md:169]

## Questions Answered

- Q1 What is the documented install path for an external user (README, PUBLIC-RELEASE.md, CONTRIBUTING.md, install guides), and what does each step require up to the first routed request and the first spec packet?

## Questions Remaining

- Q2, Q3, Q4, Q5 (4 of 5)

## Ruled Out

- Root-level single install (`npm install` at the repository root): no root `package.json` exists; install is per-workspace across 15 manifests outside `specs/` (probe). [INFERENCE: find probe listing package.json files, this iteration]
- PUBLIC-RELEASE.md as the external-user install path: it documents the maintainer release workflow and the symlink consumer model, both requiring ownership of a shared framework checkout. [SOURCE: PUBLIC-RELEASE.md:74-235]

## Dead Ends

- `docs/` tree: no `docs/` directory exists in worktree or clone; internal docs are the root markdown files plus the skill-local READMEs listed in README section 16. [SOURCE: README.md:1576-1592] [INFERENCE: find docs probe returned nothing, this iteration]

## Edge Cases

- Ambiguous input: none. Dispatch focus (Q1) was explicit and matched strategy.
- Contradictory evidence: present and preserved, not resolved -- (a) Node floors: README 20.19+/22.12 vs CONTRIBUTING 18+ vs Code Mode guide 24 (finding 2); (b) launcher auto-build vs documented manual build (finding 5). Both need runtime reproduction (Q2), not prose adjudication.
- Missing dependencies: none. Optional `findings-registry.json` was present and empty at start; no required state file was missing.
- Partial success: none -- all planned reads and probes completed.

## SCOPE VIOLATIONS

None. All probes were read-only; all writes are inside the packet `research/` tree.

## Sources Consulted

- README.md:90-249, 1050-1139, 1456-1592
- CONTRIBUTING.md (full)
- PUBLIC-RELEASE.md (full)
- .skilled/skills/mcp-code-mode/INSTALL-GUIDE.md:1-120
- .skilled/skills/system-skill-advisor/runtime/package.json (full)
- .skilled/skills/system-spec-kit/package.json (full)
- Fresh-clone fixture probes (root listing, config presence, launcher grep, tracked-clutter count, advisor runtime dir)

## Assessment

- New information ratio: 0.85 (7 fully new of 10 findings, 3 partially new; no simplicity bonus)
- Questions addressed: Q1
- Questions answered: Q1
- Questions remaining: Q2, Q3, Q4, Q5 (4 of 5)

## Reflection

- What worked and why: doc-first mapping followed by cheap clone probes. The probes falsified two assumptions in one pass -- the Verify step needs no installs (7/7 configs pre-wired and matched) and the advisor `dist` is genuinely absent -- while the package manifests pinned the hidden step-2 -> step-3 dependency that the prose hides.
- What did not work and why: `.skilled/skills/system-spec-kit/runtime/cli/package.json` was not read, so the README "22.12+ for the spec-kit runtime CLI" floor is still unverified; it was one file and should have been batched with the other two manifests.
- What I would do differently: batch the CLI manifest with the other Node-floor sources next time; the floor matrix is now the single most-cited open item.

## Next Focus

Q2 -- complete the Node-floor matrix and test it: read `.skilled/skills/system-spec-kit/runtime/cli/package.json` and the launcher entry `.skilled/bin/skill-advisor.cjs` (does it self-install/build on first run, per README.md:162?), then reproduce in the clone with Node 18 / 20.19 / 22.12 (`PATH=$HOME/.nvm/versions/node/<v>/bin:$PATH`) recording the first failing command. This tests findings 2, 4 and 5.
