---
title: "Implementation Summary: sk-design structural anomalies"
description: "Implementation summary: the loose .mjs placement question was ruled on repository evidence and executed — all four Open Design transport modules relocated into transport/ with no semantic change and all gates at baseline; the stub removal and benchmark index remain Planned."
trigger_phrases:
  - "sk-design structural anomalies summary"
  - "design-mcp-open-design loose executables summary"
  - "compiled-routing missing index summary"
  - "vestigial node_modules stub summary"
importance_tier: "normal"
contextType: "continuity"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/008-structural-anomalies"
    last_updated_at: "2026-07-27T19:00:00Z"
    last_updated_by: "structural-anomalies-executor"
    recent_action: "Relocated four Open Design transport modules into transport/ and updated all references"
    next_safe_action: "Remove the vestigial design-md-generator/node_modules stub (item 1, still Planned)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/node_modules/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "structural-anomalies-session"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary: sk-design structural anomalies
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-structural-anomalies |
| **Completed** | 2026-07-27 (item 3 only) |
| **Level** | 2 |
| **Status** | In Progress — item 3 shipped; items 1, 2 still Planned |
| **Completion Pct** | 50% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Item 3 (the loose `.mjs` placement question) is resolved and shipped.** The operator delegated the ruling that had kept this item Planned. Investigation established that `design-mcp-open-design/` held the repository's only loose runtime `.mjs` files at a skill-packet root, that nothing outside the packet imported them, and that both sibling packets in the hub already keep equivalent runtime modules in a domain-named subdirectory. All four modules were relocated into a new `transport/` subdirectory — explicitly **not** `scripts/`, whose documented scope in this packet is bash readiness checks. The full ruling and its evidence are in `spec.md` §7.

The move was a pure relocation: only three import-path lines changed across the four files, and no module's semantics were altered. `PAIRED_MODES` and `ALLOWED_INFLUENCE_AXES` — including the `'motion'` entry, which is a design axis rather than a retired mode id — are byte-identical to their pre-move state.

**Items 1, 2, and 4 are unchanged.** `design-md-generator/node_modules/` still exists, `benchmark/reports/compiled-routing/` still has no `README.md` (both live outside this session's ownership boundary), and the two legitimate absences remain correctly unremediated by design.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `design-mcp-open-design/grounding-receipt.mjs` | Move → `transport/` | Contract root; 2 imports repointed to `../../shared/corpus-context/` |
| `design-mcp-open-design/live-transport.mjs` | Move → `transport/` | Live executor; content untouched (sibling `./` imports stayed valid) |
| `design-mcp-open-design/offline-gate.mjs` | Move → `transport/` | Offline gate; 1 import repointed to `../fixtures/` |
| `design-mcp-open-design/return-reconciliation.mjs` | Move → `transport/` | Reconciliation contract; content untouched |
| `design-mcp-open-design/transport/README.md` | Create | Code-directory index matching the `fixtures/`/`tests/` README shape |
| `design-mcp-open-design/fixtures/offline-fixtures.mjs` | Modify | 2 imports repointed to `../transport/` |
| `design-mcp-open-design/tests/transport-grounding.test.mjs` | Modify | 4 imports repointed to `../transport/` |
| `design-mcp-open-design/fixtures/README.md` | Modify | 4 doc links repointed to `../transport/` |
| `design-mcp-open-design/tests/README.md` | Modify | Prose + links repointed; added a `transport/README.md` cross-link |
| `sk-design/feature-catalog/styles-library-utilization/per-mode-consumers.md` | Modify | 2 consumer-table paths repointed to `transport/` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Verify-first, in this order:

1. **Read before ruling.** All four modules read end to end; exports, kinds, and the internal dependency order established.
2. **Map every consumer.** Repo-wide search for requires, imports, CLI invocations, test references, npm scripts, and YAML step references. Result: the consumer graph is entirely packet-internal, with no fixed-path resolution anywhere. This also falsified the prior spec's claim that `shared/scripts/design-command-surface-check.mjs` was affected — it never imported these modules.
3. **Read the standard, then the precedent.** `create-skill/references/shared/overview.md` §2 for the canonical anatomy, then the actual layout of `design-interface/corpus/`, `design-md-generator/backend/`, `shared/corpus-context/`, and a repo-wide sweep for root-level JS.
4. **Baseline before touching anything.** 37/37 transport tests, `parent-skill-check` OK/0 warnings, `package_skill --check` PASS + 2 pre-existing warnings.
5. **Check for collisions.** `git status` on `sk-design/` immediately before the move — clean.
6. **Move, then repoint.** All four files moved together so their mutual `./` imports stayed valid; only the three cross-boundary imports needed editing.
7. **Re-run every gate and diff against `HEAD`.** All gates identical to baseline; every moved file byte-identical except its import lines.
8. **Sweep for dangling references** and re-check `git status` for concurrent-session collisions.

The stub-removal and benchmark-index deliveries are still pending and belong to a later session.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Bundle four small items into one Level 2 packet instead of four packets | Each item is too small to warrant its own spec folder; the operator has repeatedly rejected over-ceremony |
| **Relocate all four `.mjs` modules rather than keeping them at root** | Root placement had no load-bearing justification: no fixed-path consumer, no tool mandate, and no document declaring it intentional. It was the repository's sole instance of loose runtime `.mjs` at a skill-packet root, against clear precedent in both sibling packets and in the packet's own `fixtures/` and `tests/` directories. |
| **Relocate to `transport/`, NOT `scripts/`** | The original framing assumed `scripts/` was the destination. The packet's own `scripts/README.md` scopes that directory to bash readiness checks, and the `create-skill` standard describes `scripts/` as agent-invocable executables. These four are a runtime contract library, so a domain-named subdirectory — matching `design-interface/corpus/` and `design-md-generator/backend/` — is the correct home. |
| Rule uniformly across all four files instead of splitting them | They form one closed import graph rooted at `grounding-receipt.mjs` and are all the same kind. A mixed outcome would have fragmented a single subsystem. |
| Treat checker silence as absence of enforcement, not approval | `package_skill.py` and `parent-skill-check.cjs` both passed before the move, but neither has any rule about root-level code placement, so neither could have been evidence that root placement was correct. |
| Change no module semantics while relocating | The move is a structural fix, not a content fix. `PAIRED_MODES` and `ALLOWED_INFLUENCE_AXES` — including `'motion'`, a design axis and not a retired mode id — were preserved byte-for-byte. |
| Report rather than fix the stale `design-motion/corpus/motion-evidence.mjs` path | It sits two rows above the entries this packet edited in the hub feature catalog, but it is the motion-merge packet's (010) residue. Fixing another packet's defect would be scope creep. |
| Do not add `procedures/` to `design-mcp-open-design` or `scripts/` to `design-motion` | Both absences are legitimate; manufacturing structure a mode doesn't need would be gold-plating |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All gates were captured **before** the edit and re-run after, so the "no regressions" claim is a measured delta rather than an assertion.

| Test Type | Baseline (before) | After | Delta | Notes |
|-----------|-------------------|-------|-------|-------|
| Transport suite (`node --test transport-grounding.test.mjs`) | 37 pass / 0 fail | 37 pass / 0 fail | **0** | The relocation's primary regression gate |
| `parent-skill-check.cjs .opencode/skills/sk-design` | OK, 0 warnings | OK, 0 warnings | **0** | `10b-byte-drift` PASS both times — `leaf-manifest.json` tracks only markdown leaves, so the `.mjs` move required no regeneration |
| `package_skill.py design-mcp-open-design --check` | PASS, 2 warnings | PASS, 2 warnings | **0** | Both warnings pre-existing and unrelated (`INSTALL-GUIDE.md`, `scripts/_common.sh` kebab-case) |
| `validate_document.py transport/README.md --type readme` | n/a (new file) | 0 issues | — | New code-directory index |
| Content integrity (`diff` vs `HEAD`) | n/a | Only import-path lines differ | — | 2 lines in `grounding-receipt.mjs`, 1 in `offline-gate.mjs`, 0 in the other two |
| Dangling-reference sweep | n/a | 0 hits on live surfaces | — | Historical `.opencode/specs/` records intentionally left as-is |
| Checklist | Not run | 12/16 verified | +12 | Remaining 4 belong to items 1-2, still Planned |

`validate.sh --strict` was **not run**: a concurrent session is repeatedly emptying `system-spec-kit`'s `node_modules`, so the spec-folder scripts fail with `ERR_MODULE_NOT_FOUND` on `zod`. This is an environment condition, not a content defect, and `npm install` was deliberately not run to avoid racing that session. Document structure was verified by hand instead (anchors, template-source markers, level markers, and numbered ALL-CAPS H2s all preserved).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Items 1 and 2 remain Planned.** The vestigial `design-md-generator/node_modules/` stub and the missing `benchmark/reports/compiled-routing/README.md` were both confirmed still outstanding but sit outside this session's ownership boundary (`design-mcp-open-design/` and this spec folder). Both remain low-risk and independently executable.
2. **`validate.sh --strict` is environment-blocked**, not content-blocked — see Verification. It should be re-run once `system-spec-kit`'s `node_modules` is stable.
3. **Nothing is committed.** All changes are working-tree only; this session was barred from write git commands, so git shows the four moves as delete-plus-untracked rather than renames. Git will detect them as renames on commit.
4. **Adjacent defect reported, not fixed:** `sk-design/feature-catalog/styles-library-utilization/per-mode-consumers.md:42` points at `design-motion/corpus/motion-evidence.mjs`, but that file now lives at `design-interface/corpus/motion-evidence.mjs` after the motion merge. It belongs to packet 010's lane.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Leave the `.mjs` relocation Planned pending operator input | Ruled on the merits and executed | The operator explicitly delegated the decision to this session, discharging the dependency that had kept the item Planned |
| Move the files "under `scripts/`" if the move happened | Moved into a new `transport/` subdirectory | `scripts/` proved to be the wrong destination: the packet's own `scripts/README.md` scopes it to bash readiness checks, and the standard describes `scripts/` as agent-invocable executables. Domain-named subdirectories are the repo's actual convention for runtime library modules. |
| Update `shared/scripts/design-command-surface-check.mjs` as part of the move | No change — it was never a consumer | The prior spec's blast-radius claim was verified rather than trusted, and proved false |
| Execute items 1 and 2 (stub removal, benchmark index) | Left Planned | Both fall outside this session's stated ownership (`design-mcp-open-design/` plus this spec folder) |
| Run `validate.sh --strict` in Phase 4 | Not run | Environment-blocked by a concurrent session emptying `system-spec-kit/node_modules`; `npm install` was deliberately avoided to prevent a race |

<!-- /ANCHOR:deviations -->
