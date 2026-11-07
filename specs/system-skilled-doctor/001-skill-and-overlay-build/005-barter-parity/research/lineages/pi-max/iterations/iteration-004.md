# Iteration 4: Root-file traps, cross-runtime wiring, and the doc discovery path

## Focus

Verify the adoption traps the brief names — root `AGENTS.md` / `REPO RULES.md`, `.opencode/scripts`, fork-drifted files, `.dsh` — against the engine's actual copy rules, and test the claim that the documentation only advertises linking by following the route a new external repo would take: `/doctor:install` → `/doctor:setup` → `/doctor:helper` → root README → skill reference.

## Findings

1. `.opencode/scripts` needs no engine change: the engine already refuses a folder where upstream ships a file with a message that names the fix (`list it in repin.exclude to keep it`), and refuses unowned drift with `move each edit into an overlay, list the path in repin.exclude, or restore it from <pin>`, so Barter's `tar --exclude .opencode/scripts` becomes a manifest `repin.exclude` entry. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2671] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2969] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/README.md:94]
2. The engine refuses when the overlay folder sits inside a folder a re-pin copies, and Barter's `barter-overlays/` sits at the tree root outside `.skilled` and the runtime folders, so `.skilled-overlays.json` naming it is the only missing piece for adoption — no engine change is needed for placement. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2961] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/overlay-manifest.json:1]
3. Root files are structurally outside the re-pin copy and delete sets, which makes Barter's documented whole-archive trap impossible through the engine, but the same exclusion means an upstream change to a root file is never applied and no report line says so; the reference doc states `Root files such as AGENTS.md are never copied` as a fact rather than as a warning that those changes are dropped. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2531] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/README.md:186] [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:120]
4. `AGENTS.md` and `REPO RULES.md` have a second owner: `/doctor:agents-md check` reports twelve rows including `REPO RULES.md`, so after a re-pin two commands own the same root files and neither the router docs nor the reference states which one wins. [SOURCE: README.md:1452] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2531]
5. `.dsh` is treated inconsistently inside Skilled itself: the overlay guard ships a dsh adapter, so dsh edits are protected, while the engine's default runtime folder list omits `.dsh`, so dsh mirrors are skipped on re-pin unless the manifest overrides `repin.runtimeFolders`. [SOURCE: .skilled/hooks/overlay-guard/dsh/overlay-guard.mjs:1] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:74]
6. The advertised install route never mentions overlays: `/doctor:install` has zero overlay mentions, and the install, setup and helper workflow assets have none either, while root README section 5 documents `status`, `apply`, `--capture` and `repin` in full — so a repo that follows the install path never discovers the feature it needs. [SOURCE: .skilled/commands/doctor/install.md:1] [SOURCE: .skilled/commands/doctor/assets/doctor-install.yaml:1] [SOURCE: README.md:300]
7. The overlays reference already documents the setting, `protectedPaths` with the literal `references/barter-design-tokens.md` example, `repin.exclude` and the root-file rule, so the brief's "docs only advertise linking" is false for that file; what is genuinely missing is adoption guidance for a repo that already has a hand-rolled overlay folder, manifest extensions and a state file. [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:44] [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:92] [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:120]
8. Fork-drifted tracking has no engine and no documentation expression: Barter's fork adds the state and validates `outsideCertificate` reasons, while the engine ignores both keys, so a migrating repo deletes those declarations and loses the only visibility it had into upstream-vs-fork divergence. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/sync.cjs:402] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/replay.cjs:813] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:67]

## Ruled Out

- Expecting the engine to need a root-file copy rule: the exclusion is deliberate and correct for a re-pin; the gap is the missing report line and the missing precedence rule, not the exclusion.
- Expecting the docs to be silent about overlays: root README section 5 and the reference are thorough, so the fix is routing and adoption guidance rather than writing the feature up from scratch.
- Expecting `.opencode/scripts` and `.dsh` to be engine features: both are manifest configuration plus defaults, and only the defaults need to change.

## Dead Ends

- Searching `update.md`, `symlink.md`, `runtime-mirrors.md` and `env.md` for overlay mentions: zero in each, which confirms the discovery gap is route-level rather than a single missing sentence.
- Looking for a documented precedence between `/doctor:agents-md` and the overlay engine over `AGENTS.md`: none exists.

## Edge Cases

- Ambiguous input: "root-file trap" could mean overwrite risk or unreported drift; the engine removes the first and creates the second, and both are recorded.
- Contradictory evidence: the brief asserts the docs advertise only linking; three separate doc surfaces contradict it, so the finding is restated as a routing/adoption gap.
- Missing dependencies: `/doctor:agents-md` requires the shipped template in a vendored tree; if the re-pin changed it, its rows would move, which is a second-order effect not measured here.
- Partial success: all reads succeeded; no doctor command was executed, so the zero-mention counts come from grep over the source files rather than from a rendered run.

## Sources Consulted

- .skilled/commands/doctor/scripts/overlay-engine.cjs:67, 74, 2531, 2671, 2961, 2969
- .skilled/skills/system-skilled-doctor/references/overlays.md:44, 92, 120
- .skilled/hooks/overlay-guard/dsh/overlay-guard.mjs:1
- .skilled/commands/doctor/install.md (no overlay mention)
- .skilled/commands/doctor/assets/doctor-install.yaml (no overlay mention)
- README.md:300, 1452
- /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/README.md:94, 186
- /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/sync.cjs:402
- /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/replay.cjs:813

## Assessment

- New information ratio: 1.0
- Questions addressed: Q4 (traps and cross-runtime wiring), Q5 started
- Questions answered: Q4

## Reflection

- What worked and why: following the install route as a user would, by grepping each command in the order an adopter meets it, found the discovery gap that a per-file read of the reference would have hidden.
- What did not work and why: assuming the brief's root-file trap applied to the engine; the engine's copy rule already prevents it, and the real defect is the silence that follows an upstream root-file change.
- What I would do differently: check the routing table and the install path before reading detailed docs, because discoverability is decided there.

## Recommended Next Focus

Consolidation (Q5): rank every proposed engine change, migration step and documentation change by impact and risk, and check each against the acceptance surfaces (tests, router docs, presentation contracts) that a future implementation must update.

## SCOPE VIOLATIONS

- No file outside this lineage was modified; the workflow's `spec.md` writeback, `validate.sh` and memory save remain skipped as out of scope for this lineage.
