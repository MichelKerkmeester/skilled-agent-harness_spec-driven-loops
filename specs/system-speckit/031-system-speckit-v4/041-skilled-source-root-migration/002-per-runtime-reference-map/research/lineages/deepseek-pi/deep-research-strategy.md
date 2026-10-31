# Deep Research Strategy

## Research Topic

GATE PRE-RESOLUTION: the working map someone executing the `.opencode` -> `.skilled` move would use. Map A (symlinks per runtime, both required-target answers), Map B (non-symlink runtime files naming `.opencode`, plus home-level configuration), Map C (everything else by area). Every row cited and classified.

## Known Context

- Gate 3 was pre-resolved for this lineage; write surface was the lineage directory only.
- Seed inventory was authoritative for counts; phase 001 findings were verified but incomplete.
- `barter/` and the leading-space ` specs/` directory were ruled out by the frozen brief.
- Every iteration record carries both `run` and `iteration` (phase 001's rejection cause).

## Key Questions (remaining)

- [x] KQ1 Map A: complete symlink topology, both required-target answers, generator ownership (435/435).
- [x] KQ2 Map B: runtime files + home-level configuration (231/231 + 23 home paths).
- [x] KQ3 Map C skills (3,695 files).
- [x] KQ4 Map C `.opencode` runtime areas (303 files).
- [x] KQ5 Map C root and CI (29 files).
- [x] KQ6 Reconciliation and UNKNOWNs (11 registered with settling probes).

## Non-Goals

- Do not decide whether the migration is desirable.
- Do not propose a cutover sequence or final layout; both required-target answers are given where the layout decides.
- Do not edit anything outside the lineage directory.

## Stop Conditions

- Convergence: a further iteration adds no rows. Reached: iteration 9 added one post-seed file, iteration 10 added none; final newInfoRatio 0.05.
- Hard cap: 10 iterations, completed.

## Answered Questions

- Map A: with an `.opencode` compatibility link no raw target changes; without it the `.opencode` segment swaps to `.skilled` at unchanged relative depth. 147 regenerate, 231 mechanical, 28 none, 29 freeze. [SOURCE: iterations/iteration-001.md through iteration-003.md]
- Map A generators: `sync-runtime-mirrors.cjs` owns 168 links and hardcodes the source root; 24 Cursor/Devin agent mirrors target `.claude/agents` and need no change. [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:41,110,126-140`]
- Map B: 197 of 231 files are generated; `hook-registry.json` renders the four hook registration files; five MCP registrations name the launcher; the `.claude/agents` fork is held by a gate; the seven machine-level git hooks are the home-level blocker. [SOURCE: iterations/iteration-004.md]
- Map C: 4,028 files; 1,008 freeze-class records that must not be rewritten; every code file that constructs/matches/hardcodes the path carries a `file:line`; generated state has named owners. [SOURCE: iterations/iteration-005.md through iteration-008.md]
- Verification: live census equals the seed per root; one post-seed tracked file found; all synthesis-critical citations resolve. [SOURCE: iterations/iteration-009.md]

## What Worked

- Reading the owning scripts instead of the runtime manifests for generator ownership; the manifests were stale in three places.
- Mechanical first-line extraction for every code file: complete `file:line` coverage without sampling.
- Per-area reconciliation at the end of each iteration kept the running totals exact (4,258 seed files, 435 links).

## What Failed

- The runtime `SYNC.md` manifests were not usable as a census: `.claude` (specs/changelog links absent, 21 hooks not 18), `.cursor` (12/35/18 against its 13/36/15, and `mcp.json` is a real file, not a symlink), `.devin` (12 agents not 13).
- No generator exists for the hand-made browsability links (`.pi/extensions`, `.opencode/hooks`, `.opencode/changelog`, `.opencode/install-guides`, whole-directory links); recorded as hand-made with the exhaustive sweep as evidence.

## Exhausted Approaches

- Treating the tracked-refs seed as complete without a live diff: it was stale by exactly one file.

## Ruled-Out Directions

- `barter/`: links resolve into a different checkout.
- Leading-space ` specs/`: stray duplicate from an earlier run.
- Blanket `.opencode` -> `.skilled` rewrite: 1,008 freeze-class files, 24 agent mirrors, and internal links that never spell the path.
- Runtime `SYNC.md` manifests as the link census.

## Divergence Frontier

- Runtime root-configurability probes; symlink-following loader probes (OpenCode plugins, Devin skills, Pi extensions); dangling-hook behavior; gate-filter behavior under a `.skilled` change; machine-level bootstrap-owner search.

## Next Focus

Synthesis complete. No next focus; the map is closed against the seed plus one post-seed file, and the remaining frontier needs probes, not more reading.
