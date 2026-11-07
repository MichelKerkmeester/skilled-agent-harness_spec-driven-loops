# Vendored-Copy Overlay and Re-Pin Support: How to Make It Adoptable by an External Repo (Barter)

**Lineage:** `pi-max` (fanout session `fanout-pi-max-1794087510790-zecq2g`)
**Packet:** `specs/system-skilled-doctor/001-skill-and-overlay-build/005-barter-parity`
**Artifact dir:** `specs/system-skilled-doctor/001-skill-and-overlay-build/005-barter-parity/research/lineages/pi-max`
**Iterations:** 5 (stop reason: `maxIterationsReached`)

---

## 1. Executive Summary

The engine is closer to Barter-ready than the dispatch brief assumed. Its manifest schema already expresses 105 of Barter's 130 entries' features, its state file is byte-compatible with Barter's, and three of the five "missing regeneration" surfaces are one manifest entry each. The three real blockers are small and local:

1. A token-named file inside a `directory` entry aborts the whole run instead of blocking one overlay (`.skilled/commands/doctor/scripts/overlay-engine.cjs:1688`, `:1801`).
2. `.dsh` is missing from the default runtime folders, so a re-pin silently skips dsh mirrors (`:74`).
3. A missing `.skilled-overlays.json` produces a manifest-shaped error, which is what makes Barter's `/doctor:overlay status` look broken (`:375`, `:425`).

Barter's side needs one setting file, one `protectedPaths` list (two paths on one entry), one `repin` block, and four regenerate/verify pairs. Its two fork-only features (`fork-drifted`, `outsideCertificate`) are the expensive items and are not on the critical path.

The most consequential correction to the brief: Barter's `sync.cjs`/`replay.cjs` are a **fork of the engine**, not an independent tool, so the work is "upstream the deltas and delete the fork", not "replatform Barter".

## 2. Methodology

Five iterations, one focus each, each read-only against both repositories and each recorded through the append gateway plus the reducer: (1) engine contract, (2) Barter reality and fork lineage, (3) regeneration coverage, (4) adoption traps and documentation routing, (5) consolidation and ranking. Every finding cites a `path:line`. Barter sources are cited by absolute path because they live in a separate checkout.

Narrowed scope recorded at init and repeated per iteration: this lineage may write only inside its artifact directory, so the workflow's `spec.md` write-back block, the post-synthesis `validate.sh` run, the `git add` staging step and the `generate-context.js` memory save were skipped and recorded as scope limits rather than executed.

## 3. Evidence Base

- Skilled engine: `overlay-engine.cjs` (3,363 lines), its six test files, the three overlay workflow YAMLs, the `/doctor:overlay` router, `_routes.yaml`, and the `system-skilled-doctor` skill docs.
- Skilled hooks and generators: `overlay-guard/` (core + six adapters), `sync-skills-dsh.cjs`, `sync-runtime-mirrors.cjs`, `sync-hook-registrations.cjs`, `generate-trigger-index.mjs`, `skill-graph-freshness.cjs`.
- Barter (read-only): `barter-overlays/{README.md, overlay-manifest.json, replay.cjs, sync.cjs, sync-state.json}`, `.skilled/hooks/overlay-sync/`, and `skilled/README.md`.
- Scale facts: Barter manifest = 130 overlays (102 `file`, 15 `directory`, 9 `json-entry`, 2 `remove-root`, 1 `marked-section`, 1 `skill-root`), 19 layout links, 9 regenerate steps, 10 verify steps, 0 `protectedPaths`, 0 `repin` block, 2 `upstreamSource` entries; `sync-state.json` = 454 destination hashes.

## 4. Ranked Findings — Engine Changes (the deliverable)

| Rank | Change | Why | Cost / risk | Evidence |
|---|---|---|---|---|
| P1 | Report a protected path as a per-entry block instead of raising | One `*token*` file inside a `directory` walk aborts every overlay's report with exit 2 and no `MISS` line; the engine already has a per-overlay blocking path for other refusals | Small; touches `assertSafeToPlan`/`analyze` and keeps the reporting model | `overlay-engine.cjs:1688`, `:1801`, `:58`, `:2884` |
| P2 | Add `.dsh` to `DEFAULT_RUNTIME_FOLDERS` | Doctor treats dsh as three first-class surfaces; a re-pin that skips `.dsh` leaves stale mirrors | Trivial code change, but repin tests assert exact `copy N paths` counts and need re-baselining | `overlay-engine.cjs:74`; `doctor-runtime-mirrors-contract.test.cjs:46`; `overlay-engine-repin.test.cjs:280` |
| P3 | Print that a stage skipped regeneration and verification | Stage strips both blocks silently while the workflow claims the stage runs every step on a copy | Trivial; one report line plus a doc correction | `overlay-engine.cjs:2914`; `doctor-overlay-repin.yaml:40` |
| P4 | Report upstream changes to root files the copy set excludes | `AGENTS.md` / `REPO RULES.md` are never copied or deleted, so an upstream change is silently dropped; `/doctor:agents-md` also owns both files with no stated precedence | Small; a report line plus a precedence rule | `overlay-engine.cjs:2531`; `README.md:1452` |
| P5 | Make a missing overlay setting diagnosable | The fallback to `skilled-overlays` turns "no setting and no such folder" into a manifest-shaped error | Small; must not break the guard's two-stat inert fast path | `overlay-engine.cjs:375`, `:425`; `overlay-guard.cjs:32`, `:111` |
| P6/P7 | Support `fork-drifted` and `outsideCertificate` as one optional extension | Both are Barter-fork features (non-blocking visibility); each needs a new classifier/planner branch | Large; new state touches classify, report, apply, check and state write — ship together or not at all | `sync.cjs:17`, `:402`; `replay.cjs:813`; `overlay-engine.cjs:67` |
| Declined | Extension-based token trust (`.md`, `.css`, `.ts`, `.svelte`) | Would weaken the secret-file posture for every consumer; `protectedPaths` is the explicit, per-path equivalent | — | `sync.cjs:91`; `references/overlays.md:92` |

## 5. Barter Manifest Migration Steps (ordered)

1. **Setting file (M1).** Add `skilled/.skilled-overlays.json` with `{ "overlayDir": "barter-overlays" }`. This is the only reason `status` exits 2 today; the reference doc publishes exactly this example (`references/overlays.md:44`). Placement is safe: the engine only refuses an overlay folder that sits inside a folder a re-pin copies (`overlay-engine.cjs:2961`), and `barter-overlays/` sits at the tree root.
2. **State file (M2).** Keep `barter-overlays/sync-state.json` as-is. Its `{ schemaVersion: 1, pin, files }` shape is the engine's shape (`sync-state.json:1`; `overlay-engine.cjs:430`), and `pin` only needs to equal `manifest.pin.commit`.
3. **Protected paths (M3).** Add `"protectedPaths": ["assets/tokens.css", "references/barter-design-tokens.md"]` to the `repo-frontend` directory entry. These two are the only token-named files under a walking entry; the other three (`mcp-tooling/mcp-figma/.../node-to-token-markup.md`, `token-drift.md`, `mcp-tooling/.../holdout-design-tokens.md`) are `file` entries that the engine already reads exactly (`overlay-engine.cjs:1555`, `:1595`). This is the manifest-side fix that makes the declined extension heuristic unnecessary.
4. **Re-pin block (M4).** Add `repin: { runtimeFolders: [".claude", ".codex", ".cursor", ".devin", ".dsh", ".opencode", ".pi"], exclude: [".opencode/scripts"] }`. Without `runtimeFolders`, `.dsh` is skipped (`overlay-engine.cjs:74`, `:2517`); without `exclude`, the real `.opencode/scripts` folder is refused as unowned drift and the engine names `repin.exclude` as the fix (`:2671`, `:2969`).
5. **Keep the accepted-hash fields (M5).** `pinnedSha256` per entry is read by the engine (`overlay-engine.cjs:984`, `:992`, `:1750`), as are `replace`, `remove` and `retained` on a `skill-root` entry (`:1155`–`:1241`, `:2337`). Nothing there needs migration.
6. **Set aside the two fork-only keys (M6).** `outsideCertificate` (16 paths on `sk-git-root`) and `upstreamSource` (2 entries) have no engine reader; they must move to a side file until P6/P7 exist, or the visibility they bought is silently lost.
7. **Port the regeneration set (M7).** Keep the existing `hook-registrations` pair (`overlay-manifest.json:1394`, `:1502`) and add three analogous pairs, each already supported: `sync-skills-dsh.cjs` (`:46`, `:317`), `sync-runtime-mirrors.cjs` (`:70`, `:317`), `generate-trigger-index.mjs --check --json` with `expect: "fresh-true"` (`:33`, `:565`). For the advisor graph, pair `advisor_rebuild` as the regenerate step with `skill-graph-freshness.cjs --strict` as an `exit-0` verify; there is no `fresh` JSON contract there (`skill-graph-freshness.cjs:1`, `:20`).
8. **Retire the fork (M8).** After parity, point the `overlay-sync` hooks at the engine's `--guard` and delete `sync.cjs`/`replay.cjs`; note that `replay.cjs --apply` is a stateless strict form with no engine equivalent, so confirm it is unused first (`sync.cjs:18`; `overlay-guard.cjs:32`).
9. **Fix the pin drift (M9).** `skilled/README.md:9` still pins `23b4f3d2e7` while the manifest and state both carry `230d22ba88`.

## 6. Documentation and Advertising Changes

| Rank | Change | Surface |
|---|---|---|
| D1 | Add an overlay step and a "vendored copy with local changes" branch | `.skilled/commands/doctor/install.md` and `assets/doctor-install.yaml` — zero overlay mentions today |
| D2 | Add an adoption section: existing folder, existing state, `.dsh`, stage-skips-regeneration, upstream root-file changes are dropped | `.skilled/skills/system-skilled-doctor/references/overlays.md` (after §2 and §5) |
| D3 | Add adoption trigger phrases ("migrate my overlay folder", "my changes vanish on update") | `.skilled/commands/doctor/_routes.yaml:624` block and the skill's keyword list |
| D4 | Correct the re-pin invariant ("the stage runs every step on a copy") | `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml:40` |
| D5 | State the `AGENTS.md` / `REPO RULES.md` precedence against `/doctor:agents-md` | `references/overlays.md` §5 and root `README.md:300` |
| D6 | Point `/doctor:setup` and `/doctor:helper` at `/doctor:overlay` for vendored-copy problems | `assets/doctor-setup.yaml`, `assets/doctor-helper.yaml` — zero overlay mentions today |

The brief's claim that "docs only advertise linking" is false at three surfaces: root `README.md:300`–`:307` documents the whole feature, `references/overlays.md` documents the setting, `protectedPaths` (with the literal Barter example), `repin.exclude` and the root-file rule, and `/doctor:overlay` has a full router. What is missing is **routing and adoption guidance**, not feature documentation.

## 7. Corrections to the Dispatch Brief's Gap List

| Brief claim | Verdict | Evidence |
|---|---|---|
| Barter has no `.skilled-overlays.json` so status exits 2 | **Refined**: status's exit 2 comes from the missing manifest at the fallback folder, not from a settings check | `overlay-engine.cjs:375`, `:425`, `:3340` |
| Engine refuses `barter-design-tokens.md` for missing `protectedPaths` | **Confirmed**, with the precise fix (2 paths on `repo-frontend`) | `overlay-engine.cjs:1555`, `:1595` |
| `DEFAULT_RUNTIME_FOLDERS` omits `.dsh` | **Confirmed** | `overlay-engine.cjs:74` |
| No `repin.exclude` for `.opencode/scripts` | **Wrong on the engine, true for the manifest**: the feature exists and is tested | `overlay-engine.cjs:2503`; `overlay-engine-repin.test.cjs:456` |
| No fork-drifted state | **Confirmed** (Barter-only feature) | `sync.cjs:17`, `:402`; `overlay-engine.cjs:67` |
| No post-repin regenerate steps | **Partly wrong**: hook registrations already exist; dsh/mirrors/index/advisor are absent manifest entries, not absent capability | `overlay-manifest.json:1394`; `sync-skills-dsh.cjs:46`; `sync-runtime-mirrors.cjs:70`; `generate-trigger-index.mjs:33` |
| Root-file traps (`AGENTS.md`, `REPO RULES.md`) | **Reframed**: the engine's copy set prevents the overwrite; the defect is the silent non-application | `overlay-engine.cjs:2531`; Barter `README.md:186` |
| Docs only advertise linking | **Wrong**: three surfaces document the feature fully | `README.md:300`; `references/overlays.md:44`, `:92` |

## 8. What This Means for an Adopting Repo

- The adoption path is four files: one setting, one `protectedPaths` list, one `repin` block, four regenerate/verify pairs.
- The engine's five states are sufficient for Barter today; the fork's sixth state and its certificate are visibility upgrades, not blockers.
- A re-pin under the engine is safer than Barter's hand runbook for root files, and weaker for three generated surfaces until M7 lands.
- Two guards over the same writes (Barter's `overlay-sync` core and Skilled's `overlay-guard`) is a transitional state that should end with M8.

## 9. Risks

- **R1** — Re-baselining the repin tests for `.dsh` could mask a real copy-set regression if the expectation is edited without checking the copy list.
- **R2** — `regenerate` is arbitrary argv run at the tree root (`overlay-engine.cjs:1478`, `:1531`), so a migrated manifest is an execution surface; the step list must be reviewed, not copied from an untrusted folder.
- **R3** — `skill-graph-freshness.cjs` exits 0 by default, so a manifest entry without `--strict` would be a gate that never fails.
- **R4** — Dropping `outsideCertificate` silently removes 16 declared-unmanaged paths from the record; the side-file fallback (M6) exists to keep that decision auditable.
- **R5** — The stage plan cannot prove regeneration works, so a stage-clean re-pin may still fail on the live run (P3).

## 10. Non-Goals

No engine, hook, manifest or documentation change was implemented. No Barter file was modified. No `doctor` command was executed; all behavior claims rest on source, tests and manifest structure. The workflow's spec write-back, `validate.sh`, `git add` and memory save were out of this lineage's write scope.

## 11. Eliminated Alternatives (negative knowledge)

- **Replatform Barter onto the engine from scratch.** Eliminated: the shared preamble and shared function names (`planOverlay`, `assertSafeToPlan`, `classifyDestination`, `commandGuard`) prove the fork relationship (`replay.cjs:4`; `sync.cjs:106`).
- **Adopt Barter's extension allowlist for token names.** Eliminated: it trades an explicit per-path declaration for a name heuristic and weakens the secret-file posture (`sync.cjs:91` vs `references/overlays.md:92`).
- **Add a `repin.exclude` feature.** Eliminated: it exists and is tested (`overlay-engine.cjs:2503`; `overlay-engine-repin.test.cjs:456`).
- **Add a post-repin hook mechanism.** Eliminated: `regenerate` already runs after the copy inside `applyUnderLock` (`overlay-engine.cjs:2923`).
- **Give the advisor graph a `fresh-true` expectation.** Eliminated: no generator emits a `fresh` field for the graph; only the report-only panel exists (`skill-graph-freshness.cjs:20`).
- **Copy root files during a re-pin.** Eliminated: excluding them is what prevents Barter's documented whole-archive overwrite trap (`overlay-engine.cjs:2531`; Barter `README.md:186`).
- **Rank `fork-drifted` first because it is the most novel feature.** Eliminated: it is the most expensive change and the least blocking (finding 6, iteration 5).

## Divergence Map

- **Saturated directions:** none. No pivot or divergent seat ran; `antiConvergence.convergenceMode` was `default` and `stopPolicy` was `max-iterations`, so convergence telemetry (`newInfoRatio` 1.0/1.0/1.0/1.0/0.65) was recorded but never used to stop early.
- **Pivots taken:** 0.
- **Pivot failures / audited overrides:** 0.
- **Council artifacts:** none.
- **Remaining frontier:** the adoption write-up itself (a migration section in `references/overlays.md` and an overlay step in `/doctor:install`), plus the P6/P7 extension contract if the fork's visibility features are wanted back.

## 12. Open Questions

1. Should the engine auto-discover an overlay folder that holds `overlay-manifest.json`, or continue to require the setting (P5)? Discovery would make Barter work with zero files, but adds a filesystem scan to a guard that deliberately allows on two stat calls.
2. Should `pin.checkout` become an engine field? Barter's spec-mirror step reads it (`barter-overlays/README.md:8`), and the engine ignores it entirely (`overlay-engine.cjs:2849`).
3. Is Barter's stateless `replay.cjs --apply` (no recorded acceptance) used anywhere, or can M8 delete it with `sync.cjs`?
4. Should the engine's `--guard` replace Barter's `overlay-sync` hooks outright, or should the two run side by side for one release?
5. What is the right gate for the advisor graph — `skill-graph-freshness.cjs --strict` (report-only, exits 1 on drift) or a new `--check --json` mode with a `fresh` field?
6. Should a re-pin add a manifest lint step that warns when `repin.runtimeFolders` omits a folder the doctor mirrors manage (`.dsh` today)?

## 13. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0 (open questions above are new, not unanswered originals)
- Last 3 iteration summaries: run 3 — regeneration coverage (1.0); run 4 — adoption traps and doc routing (1.0); run 5 — consolidation and ranking (0.65)
- Convergence threshold: 0.05 (telemetry only under `stopPolicy: max-iterations`)
- Divergence summary: no divergent pivots recorded
- Findings: 42 registered, 42 enumerated across the five iteration files; 0 corrupt deltas; 0 reconstruction gaps
- State-projection note: the gateway's legacy upcast keeps `type`, `iteration`, `run`, `status`, `newInfoRatio`, `ruledOut` and `timestamp` per iteration row; `findingsCount`, `focus`, `keyFindings` and `answeredQuestions` live in `deltas/iter-NNN.jsonl` and the iteration files, which is where the reducer and this synthesis read them from
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from this report

## 14. References

- `.skilled/commands/doctor/overlay.md:1`
- `.skilled/commands/doctor/_routes.yaml:624`
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:58, 67, 74, 375, 425, 984, 1155, 1201, 1424, 1478, 1516, 1531, 1555, 1595, 1688, 1801, 2337, 2503, 2517, 2531, 2539, 2671, 2849, 2884, 2914, 2923, 2961, 2969, 3340`
- `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs:280, 456`
- `.skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs:46`
- `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml:40`
- `.skilled/commands/doctor/assets/doctor-install.yaml:1` (no overlay mention)
- `.skilled/commands/doctor/install.md:1` (no overlay mention)
- `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs:32, 111`
- `.skilled/hooks/overlay-guard/dsh/overlay-guard.mjs:1`
- `.skilled/skills/system-skilled-doctor/references/overlays.md:44, 92, 120`
- `.skilled/skills/system-skilled-doctor/SKILL.md:1`, `.skilled/skills/system-skilled-doctor/README.md:48, 143`
- `.skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs:46, 317`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:70, 317`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:13`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:33, 565, 712`
- `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs:1, 20`
- `README.md:300, 1452`
- `specs/system-skilled-doctor/001-skill-and-overlay-build/005-barter-parity/research/lineages/pi-max/resource-map.md`
- Barter (read-only checkout `/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit`):
  - `skilled/barter-overlays/README.md:8, 43, 59, 90, 94, 108, 117, 122, 125, 129, 143, 178, 186`
  - `skilled/barter-overlays/overlay-manifest.json:1` (pin block; 130 overlays; 0 `protectedPaths`, 0 `repin`, 2 `upstreamSource`), `:1394`, `:1502`
  - `skilled/barter-overlays/sync-state.json:1` (454 hashes)
  - `skilled/barter-overlays/replay.cjs:4, 813`
  - `skilled/barter-overlays/sync.cjs:17, 91, 106, 402`
  - `skilled/.skilled/hooks/overlay-sync/lib/overlay-sync-core.cjs:11`
  - `skilled/README.md:9`
