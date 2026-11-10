# Iteration 2: Node-floor matrix and runtime reproduction (Q2)

## Focus

Q2 -- Is the Node floor mismatch real today: which engines/version floors do the advisor runtime and the spec-kit CLI declare, and what happens on a single Node version a newcomer is likely to have?

Scope: the declared floors in every touched manifest, then runtime reproduction in the fresh-clone fixture (HEAD 82a71c87d0, no node_modules) staged in README order: bare-clone launcher (tests README:162 auto-build claim), step-3-before-step-2 (tests the unstated workspace dependency), the documented path on Node 20.19.5, the verify command on 22.23.1 and 26.8.2, the CLI workspace build and smoke on 20.19.5, the Code Mode launcher on a simulated single-Node-26 machine, and validate.sh's dist/fallback behavior. Node 18 was not installed here; its matrix cell stays static (see Edge Cases).

## Actions Taken

1. Read externalized state (config, state JSONL, strategy); iteration 2, focus Q2, session dr-002-fresh-clone-2026-10-11T16-22-38-567Z.
2. Read `.skilled/skills/system-spec-kit/runtime/cli/package.json`, `.skilled/skills/system-skill-advisor/runtime/package.json`, `.skilled/bin/skill-advisor.cjs` (shim), `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` (first 180 of 996 lines), `.skilled/bin/lib/node-engine-resolver.cjs`, and `mcp-server/scripts/check-node.cjs`; grepped every non-spec package.json for `engines` (eight manifests with engines, two without).
3. Clone probe A: bare clone, no installs, `node .skilled/bin/skill-advisor.cjs list-tools --format json` on Node 20.19.5.
4. Clone probe B/B2: advisor `npm install` then `npm run build` BEFORE the spec-kit workspace install.
5. Clone probe C/D/E: spec-kit workspace install on Node 20.19.5; advisor build retry; README verify command.
6. Clone probe F/G/H: CLI dist presence check after the documented path; explicit workspace `npm run build`; `generate-context.js --help` on 20.19.5.
7. Clone probes: verify command on 22.23.1 and 26.8.2; Code Mode launcher on a fake-HOME machine with only Node 26; launcher with nvm present (self-heal path); full `validate.sh` source read (180 + 240 lines).

## Findings

1. **Five distinct Node floors are declared, and the README line hides the one that matters.** @spec-kit/cli declares `>=22.12.0` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/package.json:7-8]; the advisor runtime declares `^20.19.0 || >=22.12.0` [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:6-7]; the spec-kit root, shared and runtime workspaces declare `>=20.11.0` [SOURCE: .skilled/skills/system-spec-kit/package.json:11-13] [SOURCE: .skilled/skills/system-spec-kit/shared/package.json:19-20] [SOURCE: .skilled/skills/system-spec-kit/runtime/package.json:40-41]; the Code Mode MCP server declares `>=24.0.0 <25.0.0` [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/package.json:42-43] with a hard ABI-137 constraint [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/scripts/check-node.cjs:1-14]; deep-loop/runtime and sk-doc declare `>=20.11` [SOURCE: .skilled/skills/system-deep-loop/runtime/package.json:7-8] [SOURCE: .skilled/skills/sk-doc/package.json:7-8]. README's one line (20.19+, 22.12+ for the CLI) never mentions Node 24 [SOURCE: README.md:160], yet the first routed request routes through the Code Mode MCP [SOURCE: .skilled/skills/mcp-code-mode/INSTALL-GUIDE.md:146].
2. **README:162's auto-install/auto-build claim is false today.** Bare clone, no installs: `node .skilled/bin/skill-advisor.cjs list-tools --format json` exits 1 with `Error: Cannot find module '@spec-kit/shared/workspace/repo-root.mjs'` -- the shim loads spec-kit's dist-freshness lib at require time [SOURCE: .skilled/bin/skill-advisor.cjs:24], which requires the spec-kit shared package [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:30]; the shim then fails on missing/stale dist [SOURCE: .skilled/bin/skill-advisor.cjs:70-83]; no spawn/build path exists in dist-freshness.cjs [INFERENCE: grep for spawnSync/execSync/rebuild matches only the checkPackageFreshness definition at line 647]. Cost: a user who trusts the sentence and skips steps 2-3 gets a raw module-resolution stack trace naming an internal package.
3. **The unstated step-2 -> step-3 dependency is real, with its first failing command observed.** Advisor `install` alone succeeds (141 packages), but the subsequent `run build` fails (exit 1) inside its first stage `npm --prefix ../../system-spec-kit/shared run build` with TS2591/TS2503 ('Cannot find name process', 'Cannot find namespace NodeJS') because the workspace Node type packages arrive only with the step-2 install [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:11] [INFERENCE: fresh-clone probe B2, this iteration; after step 2 the identical build exits 0]. The README never states the order [SOURCE: README.md:169-176].
4. **On Node 20.19.5 the mismatch is warn-only and the documented path passes.** The spec-kit install prints `npm warn EBADENGINE Unsupported engine { package: @spec-kit/cli@1.7.2, required: { node: '>=22.12.0' }, current: v20.19.5 }` and exits 0; npm 10.8.2 default is warn-only. After the documented steps, the advisor build exits 0, the README verify command `list-tools` exits 0, the explicit workspace build exits 0, and `generate-context.js --help` exits 0 -- all on 20.19.5 [INFERENCE: fresh-clone probes C/D/E/G/H, this iteration]. No Node-22-only API (node:sqlite, fs.globSync, process.loadEnvFile, process.getBuiltinModule) appears in CLI source; the only hits are strings in a retrieval fixture [INFERENCE: grep this iteration]. The declared floor is therefore a warning to a Node 20.19 newcomer, not a wall, for the sampled surfaces.
5. **The verify command also exits 0 on Node 22.23.1 and 26.8.2** [INFERENCE: fresh-clone probes, this iteration]. Node 18 stays below every declared floor and untested (not installed).
6. **Code Mode requires exactly Node 24.x, and a single-Node machine is refused.** On a fake-HOME machine with only Node 26 the launcher prints `[mcp-code-mode-launcher] Cannot start the MCP server: no Node interpreter satisfies >=24.0.0 <25.0.0 (resolution reason: unsatisfied). Install a Node interpreter matching that range and retry.` and exits 1 [INFERENCE: fresh-clone probe, this iteration]. With the operator's nvm present it resolves a Node 24 interpreter and proceeds to spawn the server (which then fails on the unbuilt clone dist: `Cannot find module .../mcp-server/dist/index.js`) [INFERENCE: fresh-clone probe, this iteration]. The resolver scans nvm/fnm/volta layouts [SOURCE: .skilled/bin/lib/node-engine-resolver.cjs:41-57], so multi-version machines self-heal, but a newcomer whose only Node is 20/22/26 cannot start the MCP front door the README verify step points at [SOURCE: README.md:181-184].
7. **The missing CLI dist after the documented path is designed-for, not a block.** After README steps 1-3, `runtime/cli/dist` is absent [INFERENCE: fresh-clone probe F, this iteration]. validate.sh prefers the compiled orchestrator, hard-errors on stale dist, and when dist is missing runs `node --import <tsx loader> lib/validation/orchestrator.ts` instead -- the source-only-checks keep working path [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:322-349] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:21-24]; tsx is present after the step-2 install [INFERENCE: clone probe].

## Questions Answered

- Q2 Is the Node floor mismatch real today: which engines/version floors do the advisor runtime and the spec-kit CLI declare, and what happens on a single Node version a newcomer is likely to have? -- Answered with one untested cell: Node 18 was unavailable (missing dependency, not inferred away). Sampled verdict: the mismatch is real as declarations but warn-only on 20.19/22/26 for the advisor path; the effective hard floor is Code Mode's exact Node 24.x, which is absent from README's install line.

## Questions Remaining

- Q3, Q4, Q5 (3 of 5).

## Ruled Out

- Node 18 runtime reproduction on this machine: no Node 18 interpreter in nvm (versions v20.19.5+ only); used the lowest available floor 20.19.5 instead. The CONTRIBUTING 18+ claim stays contradicted statically by the >=20.11 floors [SOURCE: .skilled/skills/system-spec-kit/package.json:11-13] and is not runtime-proven either way.

## Dead Ends

- None new this iteration. No exhausted-approach direction was retried: the docs-tree, PUBLIC-RELEASE and root-install directions stayed untouched.

## Edge Cases

- Ambiguous input: none. Dispatch focus (Q2) was explicit and matched strategy Next Focus.
- Contradictory evidence: one resolved, one open. Resolved: README:162's first-run auto-build vs the numbered manual build -- runtime shows the launcher fails on a bare clone, so the sentence is false, not an alternative path [SOURCE: README.md:162]. Open: the CLI's declared `>=22.12.0` vs observed working behavior on 20.19.5 for sampled surfaces; whether an untested CLI path needs 22.12 remains unresolved, so both the manifest claim and the observation are preserved.
- Missing dependencies: Node 18 interpreter unavailable (documented above); the Node 24 cell is inferred from manifests/resolver rather than executed end-to-end (the clone's code-mode server is unbuilt).
- Partial success: none. Probe B2's failure was the intended test; the sequence continued to C/D/E and the documented path passed.

## SCOPE VIOLATIONS

None. Installs and builds ran only inside the fixture clone (o2-fresh-clone); repository files were read-only; the only writes are this packet's iteration file, delta file, and the append gateway's own writes.

## Sources Consulted

- .skilled/skills/system-spec-kit/runtime/cli/package.json:7-8
- .skilled/skills/system-skill-advisor/runtime/package.json:6-7, 11
- .skilled/skills/system-spec-kit/package.json:11-13
- .skilled/skills/system-spec-kit/shared/package.json:19-20
- .skilled/skills/system-spec-kit/runtime/package.json:40-41
- .skilled/skills/mcp-code-mode/mcp-server/package.json:42-43
- .skilled/skills/mcp-code-mode/mcp-server/scripts/check-node.cjs:1-14
- .skilled/bin/skill-advisor.cjs:24, 70-83
- .skilled/bin/lib/node-engine-resolver.cjs:41-57
- .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:30, 647
- .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:21-24, 322-349
- README.md:160-176, 181-184
- .skilled/skills/mcp-code-mode/INSTALL-GUIDE.md:146
- Fresh-clone probes A, B/B2, C/D/E, F/G/H, 22/26 verify, Code Mode launcher (fake HOME, nvm-present)

## Assessment

- New information ratio: 0.79 (4 fully new, 3 partially new of 7 findings; no simplicity bonus)
- Questions addressed: Q2
- Questions answered: Q2 (with the Node 18 cell recorded as untested)
- Questions remaining: Q3, Q4, Q5

## Reflection

- What worked and why: staging the probes in README order made every claim falsifiable in one bake-off -- the bare-clone launcher probe decisively killed README:162 before any install could mask it, and the 22/26 and fake-HOME probes generalized the floor matrix beyond this machine's node_modules (proving the Code Mode block is interpreter-resolution, not tree state). Reading dist-freshness first also predicted the shim's fail-not-build behavior and the validate.sh fallback, which the clone then confirmed.
- What did not work and why: the first launcher exit-code read was corrupted by reading PIPESTATUS after an intervening echo (reported 0; command substitution shows the true exit 1) -- a reminder to bind an exit code to its command. Node 18 was absent, so one planned matrix cell stayed untested.
- What I would do differently: resolve exit codes in the same command substitution as the probe; and preflight interpreter availability before committing the focus's test matrix to specific versions.

## Recommended Next Focus

Q3 -- reproduce the sk-vision `vision-runtime/dist` build gap and the compiled-routing rebuild dependence on `specs/sk-doc/z_archive` (.skilled/bin/lib/compiled-route-layout.cjs) in the now-provisioned clone, and pin when the first-packet path hits either. Carry Q2's residual: whether any untested CLI command actually requires Node 22.12, and the Code Mode fixed-at-24 pin as a candidate for the Q5 ranked fix set.
