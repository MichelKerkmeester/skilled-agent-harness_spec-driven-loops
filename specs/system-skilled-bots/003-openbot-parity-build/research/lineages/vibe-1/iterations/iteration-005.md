# Iteration 5: Verify commands, the mirror rule and the crate path (frontier F-2-007)

## Focus

Frontier node F-2-007 (depth 2, scope specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md, .github/workflows/bots-runtime.yml, .opencode/bin): Are the phase verify commands runnable in this checkout, and does the crate path 003 fixes collide with the .opencode mirror rule or the CI workflow it edits?

I checked every tool the phases' verify commands name, then the mirror mechanism the crate path is justified by, then the workflow the crate job lands in.

## Actions Taken

1. Checked the tools the verify commands name: `which cargo jq node npm` returned all four on PATH.
2. Checked the runtime's test entry point: `.skilled/skills/system-skilled-bots/runtime/package.json` has `"test": "vitest run --no-coverage"`, `vitest` is installed under `node_modules/vitest` and `node_modules/.bin/vitest`, and `tsconfig.json` exists.
3. Checked the validator path the parent cites: `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` exists and is executable.
4. Checked the mirror mechanism: `ls -la .opencode/` shows `bin -> ../.skilled/bin`, `skills -> ../.skilled/skills`, `agents`, `hooks`, `scripts`, `repo-rules` all relative symlinks; `diff -q .skilled/bin/bots.cjs .opencode/bin/bots.cjs` prints nothing because they are one file.
5. Checked the crate's footing: `find . -maxdepth 3 -name Cargo.toml` returns nothing, and no workflow runs `cargo`.
6. Read the workflow's path filters: `.github/workflows/bots-runtime.yml:9-38`.

## Findings

1. **P1 — three phases list `.opencode/` mirror files as "Modify" when they are symlinks, so the task is a no-op and 003's proof of it is vacuous.** `.opencode/bin` is `bin -> ../.skilled/bin` and `.opencode/skills` is `skills -> ../.skilled/skills` [SOURCE: .opencode/bin] [SOURCE: .opencode/skills]. 003 lists `.opencode/bin/bots.cjs` and `.opencode/skills/system-skilled-bots/SKILL.md` as "Modify | Byte-identical mirror of the edited CLI" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:143] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:146], 010 lists the same two [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:119] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:133], and 011 lists them again [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:144] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:157]. 003's Definition of Done then proves it with `diff -q .skilled/bin/bots.cjs .opencode/bin/bots.cjs` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:49], which compares a file with itself. 004 already resolved this correctly: "`skills` and `bin` there are relative symlinks to `.skilled/`, so an edit through either path lands on the one source file" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:112]. **Exact edit**: delete the two `.opencode/` rows from 003, 010 and 011, and replace 003's `diff -q` check with `test -L .opencode/bin && test -L .opencode/skills`.

2. **P2 — 003's stated reason for putting the crate at `crates/` is false.** The plan says the crate lives there "because `.opencode/` mirrors `.skilled/` wholesale and a crate inside the skill would be duplicated into that mirror along with its build output" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:31]. The mirror is a symlink, so nothing is duplicated and no build output would be copied. The conclusion is still right for a different reason. **Exact edit**: replace the clause with "because a Rust crate does not belong inside a skill's runtime tree, and `crates/` is where the repository keeps buildable code".

3. **P1 — 003 introduces the repository's first Rust toolchain and its first `cargo` job, and nothing states where the toolchain comes from.** No `Cargo.toml` exists anywhere in the tree, and no workflow runs `cargo` [SOURCE: .github/workflows/bots-runtime.yml:1-60]. 003's Definition of Ready checks `cargo --version` on the developer's machine [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:41] and its Definition of Done runs `cargo clippy` and `cargo fmt` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:46-47], but the plan never says the CI runner has Rust, so the new job fails on its first run. **Exact edit**: add to 003's plan "the `bots-tui` job installs a pinned toolchain with `dtolnay/rust-toolchain@stable` plus the `clippy` and `rustfmt` components, and it is the repository's first Rust build".

4. **P2 — the workflow needs one new path entry, not two.** 003 says the workflow gains "Two path entries and one `bots-tui` job" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:150]. The workflow already lists `.github/workflows/bots-runtime.yml` in both filters [SOURCE: .github/workflows/bots-runtime.yml:36], so the only missing entry is `crates/bots-tui/**`. **Exact edit**: change "Two path entries" to "One path entry, `crates/bots-tui/**`, in both the pull_request and push filters".

5. **P2 — the screen spawns a bare `node` with no resolution rule.** 003's client runs `node <skilled-tree>/.skilled/bin/bots.cjs <verb> --json --repo <repo>` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:72], so the binary depends on `node` being on the PATH it inherits. A screen launched from a launcher or a minimal shell may not have it, and the failure would read as a CLI error rather than a missing runtime. **Exact edit**: add to 003 REQ-003 "the client resolves `node` from `PATH` and, when it is absent, draws `node not found on PATH` in the status row and exits 0 without writing".

6. **P2 — the missing-binary message names a path relative to the repository root, but the verb can run from anywhere.** REQ-001's message is `build it with cargo build --release --manifest-path crates/bots-tui/Cargo.toml` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:162], which only works from the root, while the verb resolves the binary from `<skilled-tree>`. **Exact edit**: change the message to name the absolute manifest path it resolved, `<skilled-tree>/crates/bots-tui/Cargo.toml`.

## Questions Answered

- Are the phase verify commands runnable in this checkout? **Yes.** `cargo`, `jq`, `node` and `npm` are on PATH; the runtime's `test` script exists with `vitest` installed; `validate.sh` exists at the cited path. The one gap is CI, not the developer machine (finding 3).
- Does the crate path collide with the `.opencode` mirror rule? **No, and the rule is not what 003 says it is.** The mirror is a symlink, so the crate at `crates/` is outside it and nothing is duplicated (findings 1 and 2).

## Questions Remaining

- What is still missing after all eleven phases for a small team, and what is overbuilt?
- Does 005's memory block create a prompt-injection path of its own?

## Ruled Out

- Running the runtime suite to prove the commands work: it writes temporary state roots outside this lineage's write surface, so I verified the entry points and the installed binaries instead.
- Treating the `.opencode` rows as harmless duplication: they are harmless to the build and harmful to the plan, because a task that cannot be done cannot be verified.

## Dead Ends

- Looking for a mirror script that copies `.skilled/` into `.opencode/`: there is none, because the tree is symlinked. The "wholesale mirror" phrasing in 003 and in the parent's own conventions describes a mechanism the repository does not use.

## Edge Cases

- Ambiguous input: "runnable here" could mean on this machine or in CI. I checked both and they differ (findings 3 and the answer above).
- Contradictory evidence: 003 says the mirror is a wholesale copy; 004 says it is a symlink; the filesystem says 004 is right. Both are cited (findings 1 and 2).
- Missing dependencies: none. Every tool resolved.
- Partial success: none.

## Sources Consulted

- .opencode/bin, .opencode/skills (symlink targets)
- .github/workflows/bots-runtime.yml:1-60
- .skilled/skills/system-skilled-bots/runtime/package.json
- .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:143,146,150,162
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:31,41,46-49,72
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:112,255
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:119,133
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:144,157

## Assessment

- New information ratio: 1.0
- Questions addressed: verify-command runnability, the mirror rule, the crate path, the CI job
- Questions answered: both halves of the node's question

## Reflection

- What worked and why: `ls -la .opencode/` answered the mirror question in one call and turned three phases' task lists into no-ops. A filesystem fact beats a convention statement every time.
- What did not work and why: I nearly accepted 003's "mirrors wholesale" phrasing because the parent spec repeats the same idea. The symlink listing is the only evidence that settles it, and 004 had already found it.
- What I would do differently: check the mechanism a plan cites before checking the plan's conclusion. Here the conclusion survived and the reason did not, which is the cheaper of the two failures but still a wrong document.

## Recommended Next Focus

The parity-gap and overbuild angle is next and is now well seeded: the repository has no Rust, 003 adds a whole crate and a toolchain for three read panes, and the same three panes are already available as three CLI commands. The question is what a small team gains and what it pays.
