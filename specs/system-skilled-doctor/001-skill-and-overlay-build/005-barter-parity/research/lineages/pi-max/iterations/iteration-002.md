# Iteration 2: Barter-side reality (barter-overlays manifest, replay/sync forks, state, hooks)

## Focus

Verify the Barter side against the engine contract read in iteration 1: what `barter-overlays` actually runs, what its manifest expresses, what its state file holds, what its hooks guard, and which of its behaviors the Skilled engine cannot express. The Barter repo is read-only; every claim below cites its files.

## Findings

1. Barter's `replay.cjs` and `sync.cjs` are a fork of the Skilled overlay engine rather than an independent tool: the WHY preamble is the same text about a vendored tree being replaced wholesale, and the shared function names (`planOverlay`, `assertSafeToPlan`, `classifyDestination`, `commandGuard`) match the engine's, so adoption is an upstreaming problem, not a replatform. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/replay.cjs:4] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/sync.cjs:106]
2. Barter's fork adds a sixth destination state, `fork-drifted`, fed by `upstreamSource` metadata that two entries carry, so a Barter fork of an upstream file stays visible and non-blocking; the engine's `STATUS_NAMES` has five states and never reads `upstreamSource`, so both forks become invisible after migration. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/sync.cjs:17] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/sync.cjs:402] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:67]
3. The token-name refusal differs in exactly the way that breaks `barter-design-tokens.md`: Barter's fork allows `.md`, `.css`, `.ts` and `.svelte` names, while the engine refuses any basename containing `token` that is not named exactly by the manifest. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/sync.cjs:91] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1555]
4. No Barter entry declares `protectedPaths` (0 of 130), so the migration fix for that file is manifest-side: `references/barter-design-tokens.md` added to the `repo-frontend` directory entry's `protectedPaths`, which the engine accepts because it resolves the value relative to the entry. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/overlay-manifest.json:1] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1595]
5. Barter's `sk-git` skill-root entry declares 16 `outsideCertificate` paths with a reason each, and its fork validates and honors them as intentionally vendor-owned; the engine has no reader for `outsideCertificate`, so every exemption those paths carry is lost on migration. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/replay.cjs:813] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/overlay-manifest.json:1] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2337]
6. Barter's `sync-state.json` is already the engine's state shape (`schemaVersion: 1`, `pin`, `files` with 454 destination hashes), so it can seed an engine state file directly, but the engine will only look for that file inside the folder named by `.skilled-overlays.json` (or the literal `skilled-overlays`), and Barter ships neither the setting nor a `skilled-overlays` folder. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/sync-state.json:1] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:375] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:430]
7. Barter has no re-pin command at all: neither script mentions `repin`, and the re-pin is an eight-step hand runbook that copies seven runtime folders including `.dsh`, excludes `.opencode/scripts`, then regenerates dsh skill links, runtime mirrors, hook registrations, the trigger index and the advisor graph, and finally compares a Barter fork of the git skill. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/README.md:90] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/README.md:108] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2914]
8. Barter's edit guard is a different core from Skilled's `overlay-guard`: it spawns `sync.cjs` from the overlay folder and layers a separate session gate, while Skilled's guard allows immediately unless `.skilled-overlays.json` or `skilled-overlays/` exists at the tree root, so today it is inert in Barter and after adoption two guards would run over the same writes. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/.skilled/hooks/overlay-sync/lib/overlay-sync-core.cjs:11] [SOURCE: .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:32] [SOURCE: .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:111]
9. Barter's own documentation has already drifted from its manifest: the vendored `README.md` still pins `23b4f3d2e7` while `overlay-manifest.json` and `sync-state.json` both carry `230d22ba88`, which is the same silent-drift class the engine's own status check cannot see because it never reads a README. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/README.md:9] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/overlay-manifest.json:1]

## Ruled Out

- Treating Barter's scripts as an unrelated bespoke implementation: the shared preamble and function names make that untenable, and it changes the recommendation from "replace Barter's tool" to "upstream its deltas".
- Assuming the manifest would need rewriting from scratch: 130 entries, 19 layout links, 9 regenerate steps and 10 verify steps already match the engine's schema; only `outsideCertificate`, `upstreamSource` and the missing `pin.checkout` reader are engine-side gaps.

## Dead Ends

- Searching for a `repin` implementation inside Barter: none, by design; the runbook is the implementation.
- Looking for `protectedPaths` in Barter's manifest to explain the design-tokens refusal: it is absent everywhere, so the refusal comes from the engine's name heuristic, not from a malformed entry.

## Edge Cases

- Ambiguous input: "Barter's manifest" could mean `overlay-manifest.json` or `sync-state.json`; both were read and their roles separated (declarations vs applied hashes).
- Contradictory evidence: iteration 1 found `repin.exclude` present in the engine while the brief called it missing; Barter's runbook confirms it uses an equivalent `--exclude .opencode/scripts` at the copy step, so the gap is that the engine's repin needs the manifest block Barter never wrote.
- Missing dependencies: the Barter repository is a separate checkout, so the engine cannot be pointed at it without a setting file; that is finding 6 rather than a blocker for this analysis.
- Partial success: all reads succeeded; no Barter command was executed, so behavior claims rest on source and manifest structure.

## Sources Consulted

- /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/README.md:43, 59-60, 90-96, 108-131, 178, 186-196
- /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/replay.cjs:4, 813
- /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/sync.cjs:17, 91, 106, 402
- /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/overlay-manifest.json
- /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/sync-state.json
- /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/.skilled/hooks/overlay-sync/lib/overlay-sync-core.cjs:11
- /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/README.md:9
- .skilled/commands/doctor/scripts/overlay-engine.cjs:67, 375, 430, 1595, 2337, 2914
- .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:32, 111

## Assessment

- New information ratio: 1.0
- Questions addressed: Q2 (Barter-side capabilities and the migration path)
- Questions answered: Q2

## Reflection

- What worked and why: comparing the two `sync`/`replay` files against the engine line by line exposed the fork relationship immediately, which reframes every subsequent recommendation from migration to upstreaming.
- What did not work and why: starting from the manifest's size (130 entries, 63 KB) suggested a rewrite; reading the entry shapes showed the schema is already shared, so the perceived work was in three small keys.
- What I would do differently: diff the two implementations mechanically next time instead of sampling functions, since the shared names were the decisive evidence.

## Recommended Next Focus

Runtime regeneration and re-pin coverage (Q3): enumerate the exact regeneration steps the engine's `regenerate`/`verifyGenerated` blocks must carry for a Barter-like tree, and check the doctor runtime-mirror, trigger-index and advisor-graph scripts named by Barter's step 4 for their `--check` contracts.

## SCOPE VIOLATIONS

- No Barter file was modified; all reads were read-only, as required.
- As in iteration 1, the workflow's `spec.md` writeback, `validate.sh` run, and memory save remain skipped because they lie outside this lineage's write surface.
