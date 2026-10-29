---
title: "Feature Specification: Phase 6: regeneration-and-verification"
description: "Every derived artifact in the routing stack still describes the pre-move source: 13 leaf manifests, 65 Hermes copies, seven activation manifests with seven authored twins, the compiled skill graph, the trigger index with its three sidecars and the per-skill token table. Nothing yet proves the move left routing accuracy at 155/195, 49/66 and 19/24, and no phase compares the router replay projection before and after regeneration."
trigger_phrases:
  - "regeneration and verification"
  - "phase 6 regeneration and verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: regeneration-and-verification

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-29 |
| **Branch** | `worktrees/269-skill-router-files` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-packet-and-standalone-migration |
| **Successor** | None |
| **Handoff Criteria** | Every freshness and route gate exits 0 on the final tree, the recaptured scorer baseline holds 155/195, 49/66 and 19/24, and the two replay reports match row for row |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the skill router files program. Phases 002 to 005 teach every reader of the machine router to resolve a sibling `ROUTER.md`, land the new shape in the checks and the create-skill templates, fold the seven hub routers into the root files those hubs already own and move the remaining 47 skills and modes. This phase regenerates what those moves invalidated and proves the routed decisions did not move with the bytes (research section 13).

**Scope Boundary**: the derived artifacts and the evidence that they match the post-move source. No `SKILL.md`, no `ROUTER.md`, no check and no canon document changes here.

**Dependencies**:
- Phase 002 resolving a sibling `ROUTER.md` in replay, sync, the dead-route scan, the Hermes generator and the advisor freshness probes.
- Phase 003 landing the new shape in `package_skill.py`, check 12b of `parent-skill-check.cjs` and the create-skill templates, with an empty known-debt ledger.
- Phase 004 merging the seven hub routers and phase 005 moving the remaining 47 skills and modes.
- The advisor runtime build under `.skilled/skills/system-skill-advisor/runtime/dist`, which the scorer and the skill-graph compiler import.

**Deliverables**:
- 13 leaf manifests, 65 Hermes copies, seven runtime activation manifests and their seven authored twins, all regenerated from the post-move tree.
- The compiled skill graph, the trigger index with its three sidecars and the per-skill token table, regenerated.
- One recaptured scorer baseline compared with 155/195, 49/66 and 19/24 plus two router replay reports that match row for row.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The moves in phases 004 and 005 change authored bytes, and every derived artifact records those bytes. An activation manifest stores an effective policy hash over `SKILL.md` source, the trigger index stores a corpus hash, a leaf manifest stores a leaf set, a Hermes copy stores a skill body and the compiled skill graph stores per-skill metadata. Regenerating them is mechanical, but nothing yet proves the move left routing alone. The scorer baseline has not been recaptured since the research reading, no phase compares the router replay projection taken before regeneration with the one taken after it, and the per-skill token table still measures MACHINE ROUTER words inside `SKILL.md`.

### Purpose

Every derived file is regenerated from the post-move tree, and the recaptured baseline, the replay projection and the token table show that the router changed where it lives and not what it routes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run on the planning tree before this phase, with phases 002 to 005 still unbuilt:

```text
$ node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check 2>&1 | head -5; echo "exit=${PIPESTATUS[0]}"
trigger index is STALE or the corpus is untrusted
  index             : /Users/michelkerkmeester/worktrees/public/269-skill-router-files/.skilled/skills/system-spec-kit/runtime/data/trigger-index.json
  documents scanned : 26933
  stale documents   : 26 (26 missing from the index)
  obsolete paths    : 0
exit=1
$ node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs
PASS check 1a: machine-router paths exist and the prose maps are routed
PASS check 1b: every routable reference or asset doc is routed
PASS check 2: surface RESOURCE_MAP equals the children union plus the parent tier
PASS check 3: compiled destinations, leaf-manifest and code-skilled RESOURCE_MAP agree
PASS check 4: playbook expected_resource is emitted by the router
router-sync: 5/5 checks passed
$ node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs | tail -1
total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49
$ node .skilled/bin/compiled-route-guard.cjs | tail -1
All hubs fresh or excused: serving matches inputs, and the runtime matches its source.
$ node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs | tail -1
checked=13 fresh=13 failed=0
$ node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
PASS: 65 Hermes skill copies in sync
$ node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | python3 -c "import json,sys; m=json.load(sys.stdin)['metrics']; print(m['full_corpus_top1']); print(m['holdout_top1']); print(m['ambiguity_top1'])"
{'correct': 155, 'total': 195, 'accuracy': 0.7949}
{'correct': 49, 'total': 66, 'accuracy': 0.7424}
{'correct': 19, 'total': 24, 'accuracy': 0.7917, 'tau': 0.03}
```

The scan covers roughly 26,900 documents and the stale set moves while the sibling phases are authored, so the index is stale for the planning documents and never for a router change. The phase therefore treats any nonzero stale count as stale and regenerates the index after its last document write. The scorer output is identical to the committed `scorer-eval-baseline.json` except for its `capturedAtSha`, which names the capture commit.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Regenerate the 13 leaf manifests under `.skilled/skills` with `generate-leaf-manifest.cjs --write` and prove them with `ci-leaf-manifest-freshness.cjs`.
- Regenerate the 65 Hermes skill folders with `sync-skills-hermes.cjs`, so every copy carries the router pointer phase 002 and phase 003 created.
- Refresh the seven runtime activation manifests with `compiled-route-manifest.cjs refresh` and copy each over its authored twin under the router program packet.
- Rebuild the skill graph with `init-skill-graph.sh` and prove `skill-graph.json` fresh with `skill-graph-freshness.cjs --strict`.
- Regenerate the trigger index and its three fixtures with `generate-trigger-index.mjs`, after the last document edit this phase writes.
- Recapture the scorer baseline with `capture-scorer-eval-baseline.mjs`, compare it with 155/195, 49/66 and 19/24 and compare two router replay reports.
- Regenerate the per-skill token table for the post-move tree and compare its totals with 39,159 router words, 89,931 gross router tokens and 88,689 initial-load tokens.

### Out of Scope
- Any authored routing content, `SKILL.md`, `ROUTER.md`, router reader, check or canon change - the earlier phases own those, and this phase must not repair them silently.
- A new scorer lane or a fusion weight change - the research rules it out because it would move the baseline the phase is meant to hold (research, Eliminated Alternatives).
- A new tokenizer - the authoritative tokenizer for the final count is UNKNOWN (research section 12), so the table records the encoding it used.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/*/leaf-manifest.json`, `.skilled/skills/*/*/leaf-manifest.json` | Modify | 13 generated manifests, rewritten from the post-move leaves |
| `.hermes/skills/*/` | Modify | 65 generated skill folders, 54 skills plus 11 agent mirrors |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/*/manifest.json` | Modify | 7 runtime activation manifests, refreshed through the manifest CLI |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/*/manifest.json` | Modify | 7 authored twins, each copied from its runtime manifest |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | Compiled skill-graph export, regenerated from `graph-metadata.json` |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Modify | Committed index, rebuilt over the post-move corpus |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json` | Modify | The three sidecars the index build writes |
| `.skilled/skills/*/graph-metadata.json` | Modify | Only where `generate-router-intent-signals.cjs --check` reports a missing hub vocabulary carry |
| `specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/006-regeneration-and-verification/scratch/` | Create | Before and after baseline captures, two replay reports, the regenerated token table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every derived family regenerates from the post-move tree: 13 leaf manifests, 65 Hermes copies, 7 activation manifests and 7 authored twins, the compiled skill graph and the trigger index with its three sidecars | Each freshness gate exits 0: `ci-leaf-manifest-freshness.cjs` prints `checked=13 fresh=13 failed=0`, `sync-skills-hermes.cjs --check` prints `PASS: 65`, `compiled-route-guard.cjs` prints 7 fresh hubs, `skill-graph-freshness.cjs --strict` prints `STALE COMPILED: none`, `generate-trigger-index.mjs --check` exits 0 |
| REQ-002 | The recaptured scorer baseline matches the frozen reading on the full corpus, the holdout and the ambiguity slice | `capture-scorer-eval-baseline.mjs` prints 155/195, 49/66 and 19/24, and the three fixture sha256 values equal the committed ones |
| REQ-003 | The router replay projection after regeneration matches the projection before it | `leaf-route-replay.cjs --report` writes two `report.json` files from the same tree, before and after regeneration, and `diff` prints nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The per-skill token table is regenerated for the post-move tree and compared with the research table | The new table holds 54 data rows, its router word total is recorded beside 39,159 and its initial-load total beside 88,689 |
| REQ-005 | Every route permission gate passes on the final tree | `verify-router-sync.cjs` prints `router-sync: 5/5 checks passed`, `compiled-route-sync.cjs --check` prints `all 7 hubs resolve`, `ci-skill-root-metadata.cjs` prints `passed=13 failed=0`, `ci-hub-vocabulary-source.cjs` exits 0 and `generate-router-intent-signals.cjs --check` prints `missing=0` |
| REQ-006 | This packet and its parent program folder validate under strict mode | `validate.sh <folder> --strict` and `validate.sh <parent> --strict --recursive` both end with `RESULT: PASSED` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every generator check runs twice in a row and exits 0 both times, so a second regeneration changes no tracked byte.
- **SC-002**: The recaptured baseline reads 155/195, 49/66 and 19/24, with `corpusSha256`, `holdoutSha256` and `ambiguitySha256` unchanged.
- **SC-003**: The before and after replay reports are byte-identical, while the seven activation manifest hashes differ from their pre-move values by design.
- **SC-004**: The router word total in the regenerated table is 39,159 plus the section headings phase 004 adds to the hub root files, and the delta is named in `implementation-summary.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 002 to 005 | A missing reader or a non-empty debt ledger blocks every check here | Start only after `package_skill.py --strict` passes every skill and the ledger is empty |
| Dependency | The advisor runtime `dist` build | The scorer capture and the graph compiler both import it | Run `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` when `dist` is absent or stale |
| Risk | Byte provenance changes | The compiled-route hashes and the index corpus hash move, so a hash diff looks alarming | Report the hashes as expected to change and prove the replay projection separately |
| Risk | The phase documents themselves enter the trigger corpus | The index goes stale again after the last authoring edit | Regenerate the trigger index last, after every document write in this phase |
| Risk | Token counts stay provisional | The authoritative tokenizer is UNKNOWN, so a number may be quoted as if final | Record the encoding name and version beside the table and mark the total provisional |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which tokenizer is authoritative for the final per-skill count? UNKNOWN (research section 12). The regenerated table names `tiktoken` 0.11.0 `o200k_base` and keeps the total provisional.
- Does phase 002 carry `ROUTER.md` into the Hermes copy or rewrite the pointer to the canonical path? UNKNOWN while phase 002 is unplanned. The Hermes check accepts either, provided the pointer names a file that exists.
- Does the replay projection keep its current totals of gold=64 and exact=49? It is measured before regeneration and compared after it, never assumed.
<!-- /ANCHOR:questions -->

---
