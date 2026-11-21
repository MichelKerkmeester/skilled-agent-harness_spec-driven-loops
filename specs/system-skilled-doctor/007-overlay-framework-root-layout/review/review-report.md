# Deep Review Report: overlay framework/root layout, follow-up round (fan-out root, generation 2)

Review of `specs/system-skilled-doctor/007-overlay-framework-root-layout` (spec-folder), depth mode `expansive`, lineage mode `restart` (generation 2; generation 1 archived at `review-archive/20261120T163142Z/`). Fan-out of two lineages:

- `opus-medium`: cli-claude-code, claude-opus-5-5, reasoning medium, danger-full-access. 17 iterations, stop `converged`, gates evidence/scope/coverage all pass.
- `deepseek-flash-max`: cli-mistral-vibe, deepseek-flash. 9 iterations, stop `converged`, required gate `coverage` failed (`traceability-incomplete`).

26 iterations in total. Merge run: `fanout-merge.cjs` over both lineages, frontier partition guard passed.

## 1. Executive Summary

- **Overall verdict: FAIL**, from `review-verdict.cjs` on the merged counts: `--active-p0 0 --active-p1 1 --active-p2 20 --search-debt 3 --failed-gate-ids ["coverage"]`.
- **hasAdvisories: false**, because the verdict is not PASS.
- **P0/P1/P2 counts the verdict used: 0 / 1 / 20**, search debt 3. These are the merged lineage counts, which are the authority on a fan-out root.
- **What drives the FAIL.** No P0. The `deepseek-flash-max` lineage failed its required `coverage` gate with `traceability-incomplete`, because its `checklist_evidence` protocol stayed `partial` for two reasons:
  - R7-P2-001: the phase 003 criterion at `003-engine-docs-and-release/goal.md:62` is ticked, but its third `rg` command prints `.skilled/commands/doctor/assets/doctor-env.yaml:48`. The root re-ran that command and got the same hit (`opt-in` in a boolean-parsing description, unrelated to the layout).
  - The lineage was not allowed to run `validate.sh --recursive --strict`, the packet's sixth criterion.
  The `opus-medium` lineage passed all three gates.
- **Findings-only reading.** Without the failed gate, the counts are P0=0, P1=1 (confirmed below), P2=20, search debt 3. That gives **CONDITIONAL**.
- **Last generation's scope-gate defect did not recur.** Last generation's FAIL came from an empty `reviewScopeFiles` in fan-out lineage configs. This round, both lineage configs carry a non-empty `reviewScopeFiles` and both scope gates passed.
- **Root self-check (Hunter / Skeptic / Referee, P0 and P1 only; recorded here, no append on a fan-out root):**
  - `R5-P1-001`: **confirmed P1.**
    - The root re-read `overlay-engine.cjs`. `stagedUnownedChanges` (`:5862-5866`) gets the top level through `gitTextOrNull` → `runGit` (`:4227-4231`, `:5820-5823`), and `runGit` passes the caller's environment through.
    - The neighbouring `gitTopLevelOrNull` (`:491-495`) deletes `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` and `GIT_PREFIX` first. Its comment says why: "A git hook exports GIT_DIR without GIT_WORK_TREE".
    - Barter's hook calls `overlay-engine.cjs pre-commit --root "$TREE_ROOT"` with the hook environment unchanged (`barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:164`).
    - The lineage reproduced the problem in `/tmp`: a linked worktree's hook exports `GIT_DIR`, and the same staged unowned edit goes from exit 1 `refuse` to exit 0 `allow` (opus iteration 5, probes a and b; iteration 6 counter-check).
    - On reachability: `git -C barter/ai-speckit worktree list` shows only the main checkout today, and Barter's own sk-git is a read-only routing mode. So the P1 does not rest on Barter's workflow. It rests on the engine:
      - Any consumer whose vendored tree sits in a subfolder and that commits from a linked worktree gets a silent `allow`.
      - One `git worktree add` reaches it.
      - A gate that fails open silently is the same class as last generation's `R2-P1-001`, which was rated P1.
    - The Referee keeps P1.
    - Age: `git blame` puts `:5862-5866` in `d8e2d349842` (strict overlay writes), which predates this change, so the defect is pre-existing. The `overlayOutside` branch below it (`:5878`) is new, and the remediation did not route the probe through `gitTopLevelOrNull`.
    - The concurrent session's new phase `009-skilled-open-items` (uncommitted, not part of this review's evidence) already lists "the pre-commit probe misreading a hook-exported `GIT_DIR`" as an item to fix.
  - Disputed P2, recorded for reference: `R3-P2-001--c84285021935` (`overlay-engine-fixes.test.cjs:79`). The test uses `barter-overlays` on purpose as a custom `overlayFolder` setting value. Last generation's root sweep recorded this as intended, and 005 AC-009 and ai-speckit record 039 Known Limitation 6 keep it by decision. The opus lineage itself says the finding "disputes a recorded decision rather than reporting an oversight". It stays in the counts because the self-check covers only P0 and P1.
- **Prior generation: all 16 findings fixed.** Both lineages re-checked all 16 independently and both found every one fixed (table in section 7). opus-medium reports that the 3 new rollback tests fail on the engine before `3aab896957e` and pass after it. deepseek-flash-max ran the full engine suite: `tests 262, pass 262, fail 0`.
- **Review scope summary.**
  - Skilled remediation up to `b5a630c6efa`:
    - `3aab896957e`: relayout rollback and the outside-repository refusal.
    - `4ee628578ed` and `81f0ca4cade`: docs.
    - `cb751e06e38`, `0557b1b8b43`, `f7247772c85` and `28aa6f9f83d`: phases 006-008 records.
  - ai-speckit `64cfee51628..e63bd038a5d`, especially:
    - `5dd004f3faa`: hooks fail closed, read `overlayDir`, real-bridge test, hygiene.
    - `488ea9f49f5`: re-pin onto `b5a630c`.
  - The whole change was reviewed again through seven depth-1 frontier nodes: F-1-001 to F-1-007, seeded from `frontier-seed.json`.
- **Operator review focus:** Follow-up round after remediation. Verify every finding of the previous generation is fixed and that the fixes introduced no regression, then review the whole change again. Skilled: the remediation commits on origin/main up to b5a630c6efa (phase 006 engine fixes: relayout rollback, outside-repository refusal at resolveOverlayDir, LAYOUT and strict-write remedies, overlayOutside on the context, writeBackup split; phases 007 and 008 records). ai-speckit (/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit, read-only): commits 64cfee51628..e63bd038a5d, especially 5dd004f3faa (commit gate fails closed without a manifest, hooks read overlayDir, real-bridge plugin test, relayout-runs ignore, fixture rename) and 488ea9f49f5 (re-pin onto b5a630c). Check engine correctness, path safety, hook fail-open or fail-closed behavior, rollback correctness, test strength, docs against code, and leftover barter-overlays references.

**Bottom line on the change.**
- **Remediation:** it fixed what the last round found, and none of the 16 prior findings came back. `firstSeen == lastSeen` holds by construction in a fresh generation, so it proves nothing about regressions.
- **Regressions.** To tell new findings from old ones, the root ran `git blame` on each finding's cited lines: Skilled at `b5a630c6efa` against `3aab896957e`, and ai-speckit at `e63bd038a5d` against `5dd004f3faa`. Blame on a cited line is approximate, because a defect can span more lines than the one cited.
  - **Introduced by the remediation (5):**
    - `R1-P2-002`, `R1-P2-001--1fbac54788f2`, `R14-P2-001`: the new rollback and guard, `:6530-6556` from `3aab896957e`.
    - `R1-P2-001--40e5071d1f73`: the new refusal, `:476-480`, mostly `3aab896957e`.
    - `R3-P2-001--deb1240fa825`: the hook's new lookup, `pre-commit:86-90` from `5dd004f3faa`.
  - **Widened by the remediation (1):** `R2-P2-001--b44c96030294`. The missing `layoutLinks` validation predates the change (`:2510-2518`, `f965c658d49`), but the new rollback now writes through those paths.
  - **Records and docs of the remediation (3):** `R4-P2-001--a5ce3a081123` and `R4-P2-002` (phase 008 and 007 summaries), and `R3-P2-002` (the README omits the new no-manifest refusal).
  - **From the original change, not the remediation (5):**
    - `R5-P2-001--d2ff9ac05502`: `:446-452`, `d2d2e839456`.
    - `R2-P2-001--2d0a48b35503` and `R6-P2-001--c8d87cc9fb5d`: presentation lines from `d42bafc890c` and older.
    - `R7-P2-001` and `R9-P2-001`: packet criteria.
  - **Predating the whole change (7):**
    - `R5-P1-001`: `d8e2d349842`.
    - `R6-P2-001--3e24643ff86e`: `dd67165bd31`.
    - `R3-P2-001--c84285021935`: test value, kept by decision.
    - `R5-P2-001--1f6b4cd5c51b`, `R5-P2-002`, `R8-P2-001` and `R4-P2-001--d183e347ac6b`: ai-speckit `d10121d9af8`, the v4 vendoring.
- **One real gap remains:** the engine's commit check fails open under a hook-exported `GIT_DIR` in a linked worktree (`R5-P1-001`).
- **The P2s split into three groups:**
  - The new relayout error contract: the backup wording, the unguarded backup and prune steps, and no test for a failed rollback.
  - Barter hook failure messages and fail-open arms.
  - Packet record drift, including the irreproducible phase 003 tick that fails the coverage gate.

## 2. Planning Trigger

`/speckit:plan` is required. The machine verdict is FAIL because a required gate failed, and one P1 stays confirmed after the self-check. Closing R7-P2-001 (amend the phase 003 criterion) and running the packet's `validate.sh --recursive --strict` criterion lets `checklist_evidence` close. Fixing `R5-P1-001` removes the CONDITIONAL cause.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "FAIL",
  "verdictCause": "failed required gate: coverage (deepseek-flash-max lineage, traceability-incomplete: checklist_evidence partial); one confirmed P1",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R5-P1-001", "severity": "P1", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:5864", "lineage": "opus-medium", "findingClass": "fail-open-gate", "selfCheck": "confirmed"},
    {"id": "R7-P2-001", "severity": "P2", "file": "specs/system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release/goal.md:62", "lineage": "deepseek-flash-max", "findingClass": "traceability"},
    {"id": "R9-P2-001", "severity": "P2", "file": "specs/system-skilled-doctor/007-overlay-framework-root-layout/goal.md:93", "lineage": "deepseek-flash-max", "findingClass": "traceability"},
    {"id": "R1-P2-001--1fbac54788f2", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:6534", "lineage": "opus-medium", "findingClass": "message-contract-drift"},
    {"id": "R1-P2-002", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:6533", "lineage": "opus-medium", "findingClass": "test-gap"},
    {"id": "R14-P2-001", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:6554", "lineage": "opus-medium", "findingClass": "error-contract-gap"},
    {"id": "R2-P2-001--b44c96030294", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:2514", "lineage": "deepseek-flash-max", "findingClass": "path-safety hardening"},
    {"id": "R5-P2-001--d2ff9ac05502", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:450", "lineage": "opus-medium", "findingClass": "containment-gap"},
    {"id": "R1-P2-001--40e5071d1f73", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:478", "lineage": "deepseek-flash-max", "findingClass": "misleading-diagnostic"},
    {"id": "R6-P2-001--3e24643ff86e", "severity": "P2", "file": "barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs:4241", "lineage": "deepseek-flash-max", "findingClass": "security-hardening"},
    {"id": "R2-P2-001--2d0a48b35503", "severity": "P2", "file": ".skilled/commands/doctor/assets/doctor-overlay-presentation.txt:563", "lineage": "opus-medium", "findingClass": "doc-contradiction"},
    {"id": "R6-P2-001--c8d87cc9fb5d", "severity": "P2", "file": ".skilled/commands/doctor/assets/doctor-overlay-presentation.txt:560", "lineage": "opus-medium", "findingClass": "doc-code-drift"},
    {"id": "R3-P2-001--c84285021935", "severity": "P2", "file": ".skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs:79", "lineage": "opus-medium", "findingClass": "naming-leftover", "rootNote": "disputes a recorded decision"},
    {"id": "R5-P2-001--1f6b4cd5c51b", "severity": "P2", "file": "barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:2313", "lineage": "deepseek-flash-max", "findingClass": "security-hardening"},
    {"id": "R5-P2-002", "severity": "P2", "file": "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:73", "lineage": "deepseek-flash-max", "findingClass": "security-hardening"},
    {"id": "R3-P2-001--deb1240fa825", "severity": "P2", "file": "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:88", "lineage": "deepseek-flash-max", "findingClass": "misleading-diagnostic"},
    {"id": "R8-P2-001", "severity": "P2", "file": "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:45", "lineage": "deepseek-flash-max", "findingClass": "maintainability"},
    {"id": "R3-P2-002", "severity": "P2", "file": "barter/ai-speckit/overlays/README.md:47", "lineage": "opus-medium", "findingClass": "doc-gap"},
    {"id": "R4-P2-001--d183e347ac6b", "severity": "P2", "file": "barter/ai-speckit/overlays/overlay-manifest.json:7", "lineage": "deepseek-flash-max", "findingClass": "portability"},
    {"id": "R4-P2-001--a5ce3a081123", "severity": "P2", "file": "specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/implementation-summary.md:115", "lineage": "opus-medium", "findingClass": "stale-status-claim"},
    {"id": "R4-P2-002", "severity": "P2", "file": "specs/system-skilled-doctor/007-overlay-framework-root-layout/007-barter-review-fixes/implementation-summary.md:91", "lineage": "opus-medium", "findingClass": "contradicting-records"}
  ],
  "remediationWorkstreams": [
    {"name": "commit check under a hook-exported GIT_DIR", "findings": ["R5-P1-001"]},
    {"name": "packet criteria reproducibility (gate)", "findings": ["R7-P2-001", "R9-P2-001"]},
    {"name": "relayout error contract", "findings": ["R1-P2-001--1fbac54788f2", "R1-P2-002", "R14-P2-001"]},
    {"name": "engine path safety hardening", "findings": ["R2-P2-001--b44c96030294", "R5-P2-001--d2ff9ac05502", "R1-P2-001--40e5071d1f73", "R6-P2-001--3e24643ff86e"]},
    {"name": "doctor doc drift", "findings": ["R2-P2-001--2d0a48b35503", "R6-P2-001--c8d87cc9fb5d", "R3-P2-001--c84285021935"]},
    {"name": "Barter hook failure modes and docs", "findings": ["R5-P2-001--1f6b4cd5c51b", "R5-P2-002", "R3-P2-001--deb1240fa825", "R8-P2-001", "R3-P2-002", "R4-P2-001--d183e347ac6b"]},
    {"name": "phase record accuracy", "findings": ["R4-P2-001--a5ce3a081123", "R4-P2-002"]}
  ],
  "specSeed": [
    "Make the engine's commit check find the repository the way gitTopLevelOrNull does, so a hook-exported GIT_DIR cannot turn a refusal into an allow",
    "State the relayout error contract for the steps outside the guarded block (backup copy, prune) and for a failed rollback, and say which files the kept backup holds",
    "Amend phase 003 goal.md:62 so its third clause reproduces, and the packet goal.md:93 phase count"
  ],
  "planSeed": [
    "Route stagedUnownedChanges and trackedTreeKeys through a GIT_DIR-stripped git call; add a strict-writes test that runs pre-commit with GIT_DIR set from a linked worktree",
    "Guard the relayout backup copy and prune, add a two-failure rollback test, and correct the restore-failed wording about token-named files",
    "Validate layoutLinks paths against the tree root; apply the outside-repository test to an in-tree overlayDir that links out; add --end-of-options to the pinned-blob reader",
    "Make the Barter write-gate CLI and the prompt-card guard fail with a message; align the three staged-list scans; document the no-manifest refusal in overlays/README.md",
    "Fix the 007 and 008 implementation-summary status lines; decide whether the barter-overlays test value stays by decision"
  ],
  "findingClasses": ["fail-open-gate", "traceability", "message-contract-drift", "test-gap", "error-contract-gap", "path-safety hardening", "containment-gap", "misleading-diagnostic", "security-hardening", "doc-contradiction", "doc-code-drift", "naming-leftover", "maintainability", "doc-gap", "portability", "stale-status-claim", "contradicting-records"],
  "affectedSurfacesSeed": [
    ".skilled/commands/doctor/scripts/overlay-engine.cjs",
    ".skilled/commands/doctor/scripts/tests",
    ".skilled/commands/doctor/assets/doctor-overlay-presentation.txt",
    ".skilled/commands/doctor/assets/doctor-overlay-apply.yaml",
    ".skilled/skills/system-skilled-doctor/references/overlays.md",
    "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit",
    "barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs",
    "barter/ai-speckit/overlays/README.md",
    "barter/ai-speckit/overlays/overlay-manifest.json",
    "specs/system-skilled-doctor/007-overlay-framework-root-layout/goal.md",
    "specs/system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release/goal.md",
    "specs/system-skilled-doctor/007-overlay-framework-root-layout/007-barter-review-fixes/implementation-summary.md",
    "specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/implementation-summary.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

Merged from `deep-review-findings-registry.json` (21 open findings). IDs with a hash suffix were renamed by the merge because both lineages used the same short ID. Full evidence, scope proof and affected-surface hints for each finding are in the owning lineage's `review-report.md` and `iterations/`. findingClass for `opus-medium` rows comes from that lineage's Planning Packet, because the merged registry leaves it empty.

| ID | Sev | Lineage | Dimension | file:line | Finding | findingClass |
|----|-----|---------|-----------|-----------|---------|--------------|
| R5-P1-001 | P1 | opus-medium | security | `.skilled/commands/doctor/scripts/overlay-engine.cjs:5864` | The engine's commit check allows every unowned vendored change when git runs it from a hook in a linked worktree, and no test runs pre-commit under that environment | fail-open-gate |
| R7-P2-001 | P2 | deepseek-flash-max | traceability | `specs/system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release/goal.md:62` | A checked completion criterion does not reproduce (root re-ran it: prints `doctor-env.yaml:48`) | traceability |
| R9-P2-001 | P2 | deepseek-flash-max | traceability | `specs/system-skilled-doctor/007-overlay-framework-root-layout/goal.md:93` | The packet's last completion criterion understates the phase count | traceability |
| R1-P2-001--1fbac54788f2 | P2 | opus-medium | correctness | `.skilled/commands/doctor/scripts/overlay-engine.cjs:6534` | The restore-failed relayout line and references/overlays.md say the kept backup holds every moved copy, but the backup skips token-named files | message-contract-drift |
| R1-P2-002 | P2 | opus-medium | correctness | `.skilled/commands/doctor/scripts/overlay-engine.cjs:6533` | No test covers the branch where the relayout rollback itself fails or the backup cannot be removed | test-gap |
| R14-P2-001 | P2 | opus-medium | correctness | `.skilled/commands/doctor/scripts/overlay-engine.cjs:6554` | A relayout that fails outside its guarded block exits 2 with a raw engine error the apply workflow has no rule for | error-contract-gap |
| R2-P2-001--b44c96030294 | P2 | deepseek-flash-max | security | `.skilled/commands/doctor/scripts/overlay-engine.cjs:2514` | layoutLinks paths escape the tree root unvalidated, and the relayout rollback now writes through them | path-safety hardening |
| R5-P2-001--d2ff9ac05502 | P2 | opus-medium | security | `.skilled/commands/doctor/scripts/overlay-engine.cjs:450` | An in-tree overlayDir that links outside the repository skips the outside-repository refusal | containment-gap |
| R1-P2-001--40e5071d1f73 | P2 | deepseek-flash-max | correctness | `.skilled/commands/doctor/scripts/overlay-engine.cjs:478` | A sibling link that resolves back inside the tree is refused with the wrong reason | misleading-diagnostic |
| R6-P2-001--3e24643ff86e | P2 | deepseek-flash-max | security | `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs:4241` | The pinned-blob reader passes a manifest value to git without --end-of-options | security-hardening |
| R2-P2-001--2d0a48b35503 | P2 | opus-medium | correctness | `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:563` | Generic LAYOUT guidance sends root/skilled lines to relayout in the presentation's next-step rows and the status workflow | doc-contradiction |
| R6-P2-001--c8d87cc9fb5d | P2 | opus-medium | security | `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:560` | The docs attribute the outside-repository refusal to a pre-commit check that never prints it | doc-code-drift |
| R3-P2-001--c84285021935 | P2 | opus-medium | correctness | `.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs:79` | A Skilled engine test still names its overlay folder barter-overlays (root note: intended custom value, kept by decision) | naming-leftover |
| R5-P2-001--1f6b4cd5c51b | P2 | deepseek-flash-max | security | `barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:2313` | Git write gate fails open and silently through its CLI entrypoint | security-hardening |
| R5-P2-002 | P2 | deepseek-flash-max | security | `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:73` | A missing prompt-card guard skips its check with no message | security-hardening |
| R3-P2-001--deb1240fa825 | P2 | deepseek-flash-max | correctness | `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:88` | The commit gate can resolve the tree one level too deep and then report a missing engine instead of a missing manifest | misleading-diagnostic |
| R8-P2-001 | P2 | deepseek-flash-max | traceability | `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:45` | The three staged-list scans in pre-commit disagree on which change types they see | maintainability |
| R3-P2-002 | P2 | opus-medium | correctness | `barter/ai-speckit/overlays/README.md:47` | overlays/README.md does not document that the commit hook refuses a vendored commit when no manifest is found | doc-gap |
| R4-P2-001--d183e347ac6b | P2 | deepseek-flash-max | correctness | `barter/ai-speckit/overlays/overlay-manifest.json:7` | The committed overlay manifest pins an absolute local checkout path | portability |
| R4-P2-001--a5ce3a081123 | P2 | opus-medium | traceability | `specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/implementation-summary.md:115` | Phase 008 summary says its folder is uncommitted, in the commit that commits it | stale-status-claim |
| R4-P2-002 | P2 | opus-medium | traceability | `specs/system-skilled-doctor/007-overlay-framework-root-layout/007-barter-review-fixes/implementation-summary.md:91` | Phase 007 summary says the ai-speckit fix reaches origin with phase 008, which pushed nothing in ai-speckit | contradicting-records |

## 4. Remediation Workstreams

1. **P1, fix first: commit check under a hook-exported `GIT_DIR`** (`R5-P1-001`). Route the top-level probe in `stagedUnownedChanges`, and in `trackedTreeKeys`, which uses the same probe (opus iteration 5), through a git call that strips the hook variables. Add a strict-writes test that runs `pre-commit` with `GIT_DIR` set.
2. **Gate: packet criteria reproducibility** (`R7-P2-001`, `R9-P2-001`). Amend the phase 003 criterion so its third clause reproduces, correct the packet phase count, and run the packet's `validate.sh --recursive --strict` criterion.
3. **P2: relayout error contract** (`R1-P2-001--1fbac54788f2`, `R1-P2-002`, `R14-P2-001`).
4. **P2: engine path safety hardening** (`R2-P2-001--b44c96030294`, `R5-P2-001--d2ff9ac05502`, `R1-P2-001--40e5071d1f73`, `R6-P2-001--3e24643ff86e`).
5. **P2: doctor doc drift** (`R2-P2-001--2d0a48b35503`, `R6-P2-001--c8d87cc9fb5d`, `R3-P2-001--c84285021935`).
6. **P2: Barter hook failure modes and docs** (`R5-P2-001--1f6b4cd5c51b`, `R5-P2-002`, `R3-P2-001--deb1240fa825`, `R8-P2-001`, `R3-P2-002`, `R4-P2-001--d183e347ac6b`). These belong to an ai-speckit session.
7. **P2: phase record accuracy** (`R4-P2-001--a5ce3a081123`, `R4-P2-002`).

## 5. Spec Seed

- The engine's commit check finds the repository from the tree folder and ignores a hook-exported `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` and `GIT_PREFIX`, the same way `gitTopLevelOrNull` does.
- The relayout's failure contract covers the backup copy and prune steps and a failed rollback, and names what the kept backup holds, token-named files included.
- The phase 003 and packet completion criteria reproduce verbatim from a clean tree.

## 6. Plan Seed

- Add a git helper with the hook variables stripped for `stagedUnownedChanges` and `trackedTreeKeys`. Test it with `GIT_DIR` pointing at a linked worktree's git dir.
- Guard `relayoutUnderLock`'s backup copy and prune. Add a test where both the rename and the rollback fail.
- Validate `layoutLinks` against the tree root. Resolve an in-tree `overlayDir` before the outside-repository test. Add `--end-of-options` to the pinned-blob reader.
- Barter (ai-speckit session):
  - Fail the write-gate CLI with a message.
  - Print a skip line for a missing prompt-card guard.
  - Align the three staged-list scans.
  - Document the no-manifest refusal.
  - Make the manifest `pin.checkout` portable.
- Correct the 007 and 008 summaries, `003/goal.md:62` and `goal.md:93`.

## 7. Traceability Status

**Core protocols**
- `spec_code`: pass in both lineages, except that phase 006 Known Limitation 1 predicts a refusal where the code allows (`R5-P1-001`, opus iteration 5).
- `checklist_evidence`:
  - opus-medium: pass.
  - deepseek-flash-max: partial. Five of the packet's six criteria ran and passed, including `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` at 262/262. `validate.sh --recursive --strict` did not run. The phase 003 tick does not reproduce (`R7-P2-001`).

**Overlay protocols**
- `playbook_capability`: pass. The apply workflow's relayout branches match the printed lines, with one gap (`R14-P2-001`).
- `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`: no drift reported by either lineage.

**AC_COVERAGE**: exempt. The packet root is a phase parent with no `acceptance-criteria.md`. The child phases were reviewed through their own records.

**Prior-generation findings (16), all fixed.** Both lineages re-checked all 16. Locations are as cited by opus-medium (its report, section 7); deepseek-flash-max confirmed the same set in each iteration's Confirmed-Clean Surfaces.

| Prior ID | Status | Fixed by / verified at |
|----------|--------|------------------------|
| R1-P1-001 relayout half-move | fixed | rollbackRelayout and done record, `overlay-engine.cjs:6420-6549`; tests fail before the fix (opus iterations 1, 16) |
| R2-P1-001 commit gate silent skip | fixed | ai-speckit pre-commit `:120-146` fails closed without a manifest (opus iteration 3) |
| R1-P2-001--6d7230d0ece0 sibling accepts `../.git` | fixed | `overlay-engine.cjs:466-474` (opus iteration 5) |
| R1-P2-001--4f4ffdfd250a LAYOUT overflow remedy | fixed | `:3698-3708`, presentation line 118, overlays.md line 92 (opus iteration 2) |
| R11-P2-001 strict-write remove-list remedy | fixed | `:5605-5614` (opus iteration 8) |
| R8-P2-001 one LAYOUT remedy documented | fixed | presentation lines 87-88, 96 (opus iteration 2) |
| R2-P2-001--e1e7b8a500f3 pre-commit untested | fixed | `pre-commit.test.cjs` 6/6 (opus iterations 4, 11) |
| R14-P2-001 hooks hard-code the folder | fixed | `overlaysRootFor` in all three hooks (opus iteration 3) |
| R12-P2-001 plugin tests stub the bridge | fixed | real-bridge case, 3/3 (opus iteration 7) |
| R3-P2-001 relayout-runs not ignored | fixed | ai-speckit `.gitignore:69`, README `:459` (opus iteration 3) |
| R3-P2-002 barter-overlays fixture | fixed | compiled-routing-byte-parity test renamed (opus iteration 3) |
| R2-P2-001--4e5c79954247 layoutMoves JSDoc | fixed | `:3434-3440` (opus iteration 8) |
| R13-P2-001 overlayOutside recomputed | fixed | single containment test at `:524` (opus iteration 5) |
| R13-P2-002 writeBackup one-line loop | fixed | two loops, `:4684-4697` (opus iteration 1) |
| R4-P2-001 005 AC rows Met with deviation | fixed | AC-008 and AC-009 rewritten; the REQ text gap recorded as 006 limitation 4 (opus iteration 4) |
| R6-P2-001 002 pointers stale | fixed | 002 `spec.md:109` matches HEAD (opus iteration 4) |

No prior finding came back. Five new P2s sit in remediation code and one more is widened by it; the blame split is in section 1.

## 8. Deferred Items

- 006 Known Limitation 3 (`managedPathTest` keeps a trailing slash) predates this round and was left unreviewed (opus-medium).
- The `sniffPayload` patch path in `barter-overlay-guard-core.cjs:129-138` is untested for the `patch` field. This was recorded as unverified coverage, not a finding (deepseek-flash-max).
- `pre-commit:6` computes `TREE_ROOT` one level high for a `.git/hooks` symlink install, which the repository does not use (deepseek-flash-max).
- The concurrent session's phases 009-011 (uncommitted, created during this run) already plan the `GIT_DIR` probe fix and the fan-out review scope item. They were not reviewed as evidence.

## Dimension Expansion Map

- Seeded depth-1 nodes: F-1-001 to F-1-007, all admitted on the second seed pass and split between the lineages by the runner:
  - opus-medium: F-1-001, F-1-003, F-1-005 and F-1-007.
  - deepseek-flash-max: F-1-002, F-1-004 and F-1-006.
- No depth-2 growth was admitted in either lineage.
- Remaining frontier, as deepseek-flash-max search debt: F-1-002 maintainability, F-1-004 traceability, F-1-006 maintainability.
- No pivots, overrides or Council artifacts.

This section records breadth only and does not change the verdict.

## 9. Search Ledger

- **hasSearchDebt: true.** 3 entries, all `disposition: deferred`, all frontier (deepseek-flash-max): `frontier-F-1-002` (maintainability), `frontier-F-1-004` (traceability), `frontier-F-1-006` (maintainability). On its own this debt would make the verdict CONDITIONAL; the failed coverage gate makes it FAIL.
- opus-medium: searchDebt none.
- Ruled-out candidates and clean-search proof are in each lineage's report, section 9, and in its delta `ruled_out` rows.

## 10. Audit Appendix

**Convergence.**
- opus-medium: 17 iterations, `converged`, gates evidence/scope/coverage pass.
- deepseek-flash-max: 9 iteration records and 9 iteration files, but its `terminal_gates` row names `iteration-010` / run 10. The mismatch is recorded as found. Stop `converged`, coverage `traceability-incomplete`.

**Run events and deviations, recorded for audit.**
- **Frontier re-seed.** The first seed pass pruned F-1-004 to F-1-006 on `relevance`, because their questions exceeded the 500-character cap. The root removed the `frontier-nodes.jsonl` it had just written, shortened the three questions and re-seeded, and all seven nodes were admitted. Nothing else had been written.
- **deepseek-flash-max rerun.** Its first run exited 0 after 8 iterations without a `terminal_gates` row (runner `no_terminal_event`; its config was still `initialized`, its frontier nodes still open). The root reran it once with the runner's printed `--only-lineage deepseek-flash-max` command. It resumed, recorded iteration 9 and the terminal row, and exited 0. The runner flags the 10 rows from the first run as timestamp anomalies before its window; that is expected for a resumed lineage.
- **Containment advisory (opus-medium).** The runner reported modified `spec.md` and `graph-metadata.json` in the packet root. The diff adds phases 009-011 and comes from a concurrent session, not from a lineage. It was left untouched.
- **Write-once slip (opus-medium).** Its iteration 6 says it corrected line citations in `iteration-005.md` in place (`sed -i`) before handing the record to the gateway. The recorded content matches the file.
- **ai-speckit read-only limit.**
  - Containment watches only the Skilled tree. ai-speckit shows 87 working-tree changes: 13 deletions and 74 untracked files, including `specs/clickup-cli/` deletions, `z_archive/` folders and `orchestration-status.log` files. Its `specs/` folder mtime is 17:18:24, inside the deepseek rerun window.
  - A search of both lineages' command logs found no write command (`rm`, `mv`, `cp`, `sed -i`, `git add/mv/rm/commit/restore`) aimed at ai-speckit. The only `sed -i` edits target lineage-local files, and no command names `ai-speckit/specs`, `clickup` or `z_archive`.
  - The changes match a parallel ai-speckit session's spec archiving. That attribution is inference; the lineages' absence from it is backed by the logs.
- **Iteration budget.** The root config keeps `maxIterations: 7` from the template, while the seed derived a 24-iteration budget for each lineage, which the runner applied.
- **Skipped steps.**
  - `step_stage_artifact_dir` (`git add`) was skipped under the operator's "no git writes" limit.
  - `phase_save` (`generate-context.js`) was skipped under the "write only in the bound spec folder's `review/` artifacts" limit.

**Closeout.**
- `synthesis-closeout.cjs` recorded `synthesis_incomplete` (severity `warning`, reason `synthesis_artifact_invariant_failed`, invariant `structured_state_findings_missing_from_registry`). It found 4 of 19 identifiable iteration-level findings without a matching registry key, out of 28 iteration findings against 21 registry findings.
- The root checked the merge: the two lineage registries hold 11 + 10 = 21 open findings, and the merged registry holds 21, so no lineage-active finding was dropped.
- The root listed the iteration `findingDetails` with no merged-registry key, and every one is accounted for. Two kinds:
  - Short IDs both lineages used (`R1-P2-001` to `R6-P2-001`). The merge renamed them with a hash suffix, and each one sits in its lineage registry under the original ID.
  - opus-medium refinements whose `refines` target the rename hid:
    - `R2-P2-002` and `R15-P2-002` refine `R1-P2-001`.
    - `R10-P2-001` and `R15-P2-001` refine `R2-P2-001`.
    - `R15-P1-001` and `R16-P1-001` refine `R5-P1-001`.
  - No live finding is missing.
- The review contract records this warning and does not halt on it.

**Route proof.**
- opus-medium: 17/17 iteration records carry `target_agent: "deep-review"`, `resolved_route`, `agent_definition_loaded: true` and `mode: "review"`.
- deepseek-flash-max: 9/9 do.

**Cross-reference appendix.**
- **Core Protocols:** `spec_code` pass (one drift, `R5-P1-001`); `checklist_evidence` pass (opus-medium) and partial (deepseek-flash-max).
- **Overlay Protocols:** `playbook_capability` pass with one gap (`R14-P2-001`); `skill_agent`, `agent_cross_runtime` and `feature_catalog_code` show no drift.

**Sources reviewed.**
- Skilled `.skilled/commands/doctor/**` and `.skilled/skills/system-skilled-doctor/**`.
- ai-speckit `overlays/**` and the vendored `skilled/` copies of the hooks, engine and doctor docs.
- The packet's phase 001-008 records.

Per-lineage maps: `lineages/opus-medium/resource-map.md`. deepseek-flash-max emitted none.
