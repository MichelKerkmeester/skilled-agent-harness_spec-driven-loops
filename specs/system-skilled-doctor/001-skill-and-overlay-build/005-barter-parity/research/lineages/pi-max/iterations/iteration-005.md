# Iteration 5: Ranked engine changes, Barter migration steps, doc changes

## Focus

Consolidate iterations 1-4 into the three deliverables the brief asks for, and rank them. New evidence gathered in this iteration: which Barter entries actually own the token-named files, and which engine tests would need expectation changes.

## Findings

1. Ranked engine change P1 — make a protected path a per-entry refusal instead of a whole-run throw: `assertSafeToPlan` and `analyze` currently raise before any report exists, while `BLOCKING_STATES`/`reportBlocked` already give every other refusal a per-overlay line, so moving the protected check into that reporting path fixes a confusing exit 2 with no new state. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1688] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1801] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2884]
2. Ranked engine change P2 — add `.dsh` to `DEFAULT_RUNTIME_FOLDERS`: the doctor's runtime-mirror contract already treats `.dsh` as three first-class surfaces (`dsh_skills`, `dsh_prompts`, `dsh_agents`), and a re-pin that skips it leaves stale dsh mirrors; the change also touches the repin tests' hard-coded `copy N paths` expectations, which must be re-baselined. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:74] [SOURCE: .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs:46] [SOURCE: .skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs:280]
3. Ranked engine change P3 — make a stage report state that regeneration and verification were skipped: the engine strips both blocks for a staged run and prints nothing about it, while the re-pin workflow's invariant claims the stage runs every step on a copy, so one printed line plus the workflow text correction closes a real expectation gap. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2914] [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-repin.yaml:40]
4. Ranked engine change P4 — report upstream root-file changes the re-pin excludes: the copy and delete sets are built only from `.skilled` and the runtime folders, so an upstream change to `AGENTS.md` or `REPO RULES.md` is never applied and never named, even though `/doctor:agents-md` reports rows for both files and the two writers have no documented precedence. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2531] [SOURCE: README.md:1452]
5. Ranked engine change P5 — make a missing overlay setting diagnosable: today the fallback to `skilled-overlays` turns "no setting and no such folder" into `no overlay manifest at skilled-overlays/overlay-manifest.json`, which reads like a corrupt manifest; a distinct "no overlay folder named" message, or a guarded search for any folder holding `overlay-manifest.json`, fixes the adoption path without touching classification. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:375] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:425]
6. Ranked engine change P6/P7 — `fork-drifted` and `outsideCertificate` are one optional extension, not two: both exist only in Barter's fork, both are non-blocking visibility features, and the engine's five-state classifier plus its skill-root planner would each need a new branch, so they should ship together behind one documented manifest contract or not at all. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/sync.cjs:17] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/replay.cjs:813] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:67]
7. Declined engine change — extension-based token trust: Barter's fork allows `.md`, `.css`, `.ts` and `.svelte` names, but adopting that rule would weaken the engine's secret-file posture for every consumer; `protectedPaths` already gives a per-path, path-relative opt-in and the reference doc publishes it with the exact Barter example, so the manifest fix is preferred over the heuristic fix. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/sync.cjs:91] [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:92]
8. Barter manifest migration, in order: add `.skilled-overlays.json` naming `barter-overlays`; copy `sync-state.json` into the overlay folder unchanged (its `schemaVersion`/`pin`/`files` shape already matches); add `protectedPaths: ["assets/tokens.css", "references/barter-design-tokens.md"]` to `repo-frontend` only, since every other Barter token-named file is a `file` scope entry that the engine already reads exactly; add a `repin` block with the seven runtime folders including `.dsh` and `exclude: [".opencode/scripts"]`; keep `pinnedSha256` per entry because the engine reads it; move `outsideCertificate`/`upstreamSource` aside until the P6/P7 extension exists. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/overlay-manifest.json:1] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/sync-state.json:1] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:984]
9. Documentation and advertising changes, ranked: D1 add an overlay step and an "you have a vendored copy with local changes" branch to `/doctor:install` and its YAML, which mention overlays zero times today; D2 add adoption/migration guidance to `references/overlays.md` (existing folder, existing state, `.dsh`, stage-skips-regeneration, root-file changes are dropped); D3 add adoption trigger phrases to `/doctor:overlay`'s route block and the skill's keyword list, which currently only name status/apply/repin phrasings; D4 correct the re-pin workflow invariant; D5 state the `AGENTS.md`/`REPO RULES.md` precedence against `/doctor:agents-md` in both the reference and root README section 5. [SOURCE: .skilled/commands/doctor/install.md:1] [SOURCE: .skilled/commands/doctor/assets/doctor-install.yaml:1] [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:44] [SOURCE: .skilled/commands/doctor/_routes.yaml:624] [SOURCE: README.md:300]

## Ruled Out

- Prioritising the Barter fork's two extra states above the smaller fixes: they are the most expensive changes and the least blocking, and a repo can adopt the engine without them.
- Adopting Barter's extension allowlist: it trades an explicit per-path declaration for a name heuristic, which is the wrong direction for a secret-file guard.
- Treating the `.dsh` default as a documentation-only change: the repin tests assert exact copy counts, so it is a code + test change with a doc note.

## Dead Ends

- Looking for a single migration document that already covers an existing hand-rolled overlay folder: none exists in the doctor skill or the command docs, which is why D2 is a real deliverable rather than a reorganisation.
- Looking for a test that would catch a missing `.dsh` default: the engine tests do not enumerate the default list, only the doctor mirror contract does.

## Edge Cases

- Ambiguous input: "rank" could mean by impact or by cost; the ranking above orders by blocking impact first and names the cost class in each finding.
- Contradictory evidence: three of the brief's claims (repin.exclude missing, docs advertise only linking, no regeneration steps) were contradicted by evidence; the deliverable keeps the true residue (manifest-side gaps and doc routing) and names the corrections.
- Missing dependencies: P6/P7 depend on an engine contract that does not exist yet, so the migration step is explicitly deferred rather than silently dropped.
- Partial success: no engine code was run; every ranking rests on source reading and test expectations, and each item names the file a future implementation must change.

## Sources Consulted

- .skilled/commands/doctor/scripts/overlay-engine.cjs:67, 74, 375, 425, 984, 1688, 1801, 2531, 2884, 2914
- .skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs:280
- .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs:46
- .skilled/commands/doctor/install.md, .skilled/commands/doctor/assets/doctor-install.yaml
- .skilled/skills/system-skilled-doctor/references/overlays.md:44, 92
- .skilled/commands/doctor/_routes.yaml:624
- .skilled/commands/doctor/assets/doctor-overlay-repin.yaml:40
- README.md:300, 1452
- /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/overlay-manifest.json:1
- /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/sync-state.json:1
- /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/sync.cjs:17, 91
- /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/replay.cjs:813

## Assessment

- New information ratio: 0.65
- Questions addressed: Q1 (ranked engine changes), Q5 (doc changes and ranking)
- Questions answered: Q1, Q5

## Reflection

- What worked and why: ranking by blocking impact rather than by novelty kept the two most expensive items (fork-drifted, outsideCertificate) out of the critical path, which is what an adopting repo needs.
- What did not work and why: the first draft treated each Barter manifest key as a separate engine requirement; grouping `fork-drifted` and `outsideCertificate` into one optional extension matched how they actually ship.
- What I would do differently: enumerate each consumer of the token-name rule before proposing its fix, which is what turned finding 7 from a feature into a refusal.

## Recommended Next Focus

None for this lineage: the five planned iterations are complete. A follow-up implementation phase should start with P1 and P2, then the Barter migration steps M1-M4, because those four make `status`/`apply` runnable against Barter for the first time.

## SCOPE VIOLATIONS

- No file outside this lineage was modified; the workflow's `spec.md` writeback, `validate.sh` and memory save remain skipped as out of scope for this lineage.
