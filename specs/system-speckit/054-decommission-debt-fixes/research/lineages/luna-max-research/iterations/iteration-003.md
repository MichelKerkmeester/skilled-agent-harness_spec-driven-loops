# Iteration 3: Registrations, symlinks, hooks, and doctor assets

## Focus

Compare active hook authorities with discovery mirrors and the Copilot wrapper. The question was whether the memory sweep dropped registrations or left a registration path that degrades deceptively. Direct symlink metadata was checked without reading excluded build trees.

## Findings

1. **LUNA-013 — Discovery-mirror inventories are stale after lifecycle registration restoration. P2. CONFIRMED.** The four mirror READMEs state 19 Claude symlinks, 16 Codex symlinks, 15 Cursor symlinks, and 13 Devin symlinks, while direct `lstat` inventory found 21, 18, 17, and 19 symlinks respectively; all enumerated links resolved, so this is inventory drift rather than dangling links. The active authorities contain the restored lifecycle registrations, including Claude SessionStart/Stop/PreCompact, Codex SessionStart/Stop/PreCompact, Cursor sessionStart/sessionEnd/preCompact, and Devin SessionStart/Stop. Smallest fix: regenerate the four README counts and inventory tables from the same source used by the mirror checks, then add a parity assertion so a future restoration cannot leave false counts. [SOURCE: .claude/hooks/README.md:9-13] [SOURCE: .claude/hooks/README.md:29-37] [SOURCE: .codex/hooks/README.md:9-13] [SOURCE: .codex/hooks/README.md:27-35] [SOURCE: .cursor/hooks/README.md:9-13] [SOURCE: .cursor/hooks/README.md:29-38] [SOURCE: .devin/hooks/README.md:9-13] [SOURCE: .devin/hooks/README.md:17-25] [SOURCE: .claude/settings.json:96-134] [SOURCE: .codex/hooks.json:3-41] [SOURCE: .cursor/hooks.json:4-39] [SOURCE: .devin/hooks.v1.json:2-32] [INFERENCE: direct lstat inventory of the four mirror directories found 21/18/17/19 resolved symlinks]

2. **LUNA-014 — Copilot hook registrations point at targets with no current source or built artifact. P1. CONFIRMED.** Both repository Copilot wrapper scripts test and then invoke `runtime/dist/hooks/copilot/session-prime.js` or `user-prompt-submit.js`, but both target paths are absent and the runtime hook source tree has no `copilot/` directory. The wrappers therefore take their fallback branch instead of executing a successor hook; the prompt fallback also creates or overwrites `.github/copilot-instructions.md` when the target is absent. Smallest fix: either remove these registrations and document the fallback as the supported Copilot contract, or add a real source/build owner and test the target existence; do not leave a nominal registration whose primary target cannot resolve. [SOURCE: .github/hooks/scripts/session-start.sh:10-18] [SOURCE: .github/hooks/scripts/user-prompt-submitted.sh:10-23] [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/README.md:18-25] [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/README.md:58-70] [INFERENCE: direct target checks reported both Copilot dist paths missing and the bounded runtime source inventory had no copilot directory]

3. **LUNA-015 — Copilot fallback mutates a repository document without a declared ownership or freshness guard. P1. CONFIRMED.** When the missing prompt hook target is encountered, `.github/hooks/scripts/user-prompt-submitted.sh` runs `mkdir -p` and writes a fixed context block to `.github/copilot-instructions.md`; the session-start wrapper only prints a degraded snapshot. This makes the absence of a built hook an externally visible write path, and it can overwrite operator content at the configured default path. Smallest fix: make the fallback stdout-only or write only through an explicitly owned generated-file contract with a safe marker/atomic policy; pair it with a check that distinguishes an intentional fallback from a missing registration. [SOURCE: .github/hooks/scripts/user-prompt-submitted.sh:10-23] [SOURCE: .github/hooks/scripts/session-start.sh:10-18] [INFERENCE: the target-missing branch is reachable in the current checkout because the referenced Copilot dist file is absent]

4. **LUNA-016 — Devin’s live failure guidance still instructs operators to build the retired `mcp-server` package. P2. CONFIRMED.** The active SessionStart and Stop commands target `runtime/dist/hooks/devin/*.js`, but their fallback messages tell operators to run `npm run build in mcp-server`; the corresponding UserPromptSubmit fallback already names the spec-kit runtime package. This split can send a repair attempt to a retired path after a real hook failure. Smallest fix: replace both stale fallback messages with the same runtime build command and add a literal-string scan to the hook configuration check. [SOURCE: .devin/hooks.v1.json:2-10] [SOURCE: .devin/hooks.v1.json:137-145] [SOURCE: .devin/hooks.v1.json:34-46]

## Ruled Out

- No dangling symlink was found in the direct `.claude/hooks`, `.codex/hooks`, `.cursor/hooks`, or `.devin/hooks` inventories; each link resolved to an existing target. [INFERENCE: direct lstat/stat inventory]
- The restored non-Copilot lifecycle registrations are present in their active authorities; the defect is mirror count drift and Copilot ownership, not wholesale loss of the four named runtime registrations. [SOURCE: .claude/settings.json:96-134] [SOURCE: .codex/hooks.json:3-41] [SOURCE: .cursor/hooks.json:4-39] [SOURCE: .devin/hooks.v1.json:2-32]

## Dead Ends

- Counting only files whose names contain `session` missed the added compact, cleanup, gate, and quality links; direct symlink metadata and the README inventory were required to expose the count mismatch. [SOURCE: .claude/hooks/README.md:29-37] [SOURCE: .devin/hooks/README.md:17-25]

## Edge Cases

- The Copilot fallback is intentional enough to be a designed degradation, but its write behavior and absent source owner make the registration contract ambiguous. The fix must choose one owner rather than silently treating a missing target as normal.
- The active runtime README names Claude, Codex, Cursor, Devin, and Pi but not Copilot; this supports the absent-owner observation but does not prove Copilot should be supported. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/README.md:18-25] [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/README.md:58-70]

## Questions Remaining

- Q2 is partially answered: the four restored authorities and their links resolve, but mirror inventories and Copilot registration ownership drift.
- Q1 and Q3-Q7 remain open. Next focus: dependency/importer balance across shared, scripts, and runtime.

## Sources Consulted

- [SOURCE: .claude/settings.json:96-203]
- [SOURCE: .codex/hooks.json:3-155]
- [SOURCE: .cursor/hooks.json:4-105]
- [SOURCE: .devin/hooks.v1.json:2-177]
- [SOURCE: .claude/hooks/README.md:9-45]
- [SOURCE: .codex/hooks/README.md:9-42]
- [SOURCE: .cursor/hooks/README.md:9-42]
- [SOURCE: .devin/hooks/README.md:9-61]
- [SOURCE: .github/hooks/scripts/session-start.sh:1-19]
- [SOURCE: .github/hooks/scripts/user-prompt-submitted.sh:1-24]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/README.md:16-100]

## Assessment

- New information ratio: 0.90
- Questions addressed: Q2 registration, symlink, and hook-target integrity
- Questions answered: Q2 = partial; authority restoration is confirmed, but mirror parity and Copilot ownership remain unresolved.
- Confidence: high for the stale counts, active registration paths, missing Copilot targets, and Devin strings; medium for whether Copilot fallback is intentionally supported because no authoritative Copilot contract was found.

## Reflection

- What worked and why: comparing config commands, source inventory, target existence, and mirror metadata separated true dangling behavior from stale documentation.
- What did not work and why: a filename-only session-hook scan undercounted the restored registration surface.
- What I would do differently: inspect the package manifests and import graph before accepting runtime build output as proof of ownership.

## Recommended Next Focus

Angle 3: dependency/importer balance across `shared`, `scripts`, and `runtime`; distinguish package dependencies needed by successor behavior from orphaned database and memory-era dependencies.
