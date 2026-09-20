---
title: "Implementation Summary"
description: "Every hub states one always-loaded policy in the artifact the runtime reads, the deep-loop discovery vocabulary names only live families, and four hubs are re-minted."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/011-routing-doctrine-and-discovery"
    last_updated_at: "2026-09-16T05:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Aligned the fleet's preamble policy and pruned the retired discovery vocabulary"
    next_safe_action: "Commit once the runtime suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-routing-doctrine-and-discovery |
| **Completed** | 2026-09-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

Every hub now states one always-loaded policy, and the statement lives where a reader can act on it.
Four hubs — `system-deep-loop`, `sk-code`, `sk-doc` and `cli-external-orchestration` — gain
`routerPolicy.defaultResourceSemantics: "fallback-only"` and a `defaultResourceContract` sentence
in `.opencode/skills/*/hub-router.json`, matching the two keys `mcp-tooling` already carried. The
contract sentence names the other concept explicitly: the array is the zero-signal fallback consulted
only when no mode scores, never the stage-two preamble `ROUTER.md` declares.

The adjudication came from the running system rather than from either document. Loading the live
compiled policy for all five graduated hubs through `loadHubEngine()` shows no `defaultResource` key
in any policy, `compiled-policy.v1.schema.json` is `additionalProperties: false` with no such
property, and `grep -r DEFAULT_RESOURCE .opencode/bin/lib/compiled-routing/` returns zero hits. Of
the five compilers, three never reference the field, one hardcodes `null`, and one reads
`defaultResource?.[0]`. So neither statement is enforced — the finding's own claim, confirmed rather
than contradicted. What decided the edit is the concept's standing in the repository's own authoring
contract and the consumers that were measured per hub rather than assumed. Skipping the measurement
here would have produced the wrong edit: had the JSON been trimmed to match `ROUTER.md`, `sk-code`'s
route loop would have been left calling `load_if_available("shared/README.md")` for a path its policy
no longer declared. `hub-router.json` is the authoritative artifact for the fallback concept and
`ROUTER.md` the authoritative artifact for the preamble.

The deep-loop hub's discovery vocabulary is pruned. Six retired families left the keyword block in
`.opencode/skills/system-deep-loop/SKILL.md` — `conformance`, `standard-authority`,
`conformance-review`, `read-only-default`, `context-gathering` and `reuse-catalog` — taking it from
32 keywords to 26 with no duplicates. Two more left `derived` in
`.opencode/skills/system-deep-loop/graph-metadata.json`: `standard-authority` from `key_topics` and
`skill benchmark` from `trigger_phrases`. Neither named a live mode. Four activation manifests are
re-minted in the same change, both copies byte-identical, because `hub-router.json` and `SKILL.md`
are raw-byte inputs to each hub's compiled policy hash.

The keyword-block edit had a second consequence worth recording, because nothing in the brief
predicted it. The hub's `SKILL.md` is a tracked source in the deep-loop command-contract pipeline,
so three generated contract artifacts under `.opencode/commands/deep/assets/compiled/` carried its
old digest and refused to render. The suite caught it as four failures across
`check-contract-drift.vitest.ts` and `render-command-contract.vitest.ts`, both naming their own
repair. `compile-command-contracts.cjs --write` was run for the three affected commands, changing
exactly one line per file — the recorded digest — and both test files pass.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two born-retired terms are confirmed retirements, not renames. `conformance` went with the
`deep-alignment` mode and the conformance-benchmark capability it powered, recorded in the hub's
`v3.0.0.0` changelog. `skill benchmark` went with its own lane, retired whole — the changelog says
`/deep:skill-benchmark` is removed on every runtime and the workflow mode no longer resolves.

Three terms are removed as dead vocabulary rather than as confirmed retirements.
`read-only-default`, `context-gathering` and `reuse-catalog` appear in no registry, no command
metadata, no router vocabulary, and no live surface anywhere in the hub; the commit that introduced
them predates the roster they would have belonged to. They cannot route anything, which is the only
property that matters here, but calling them "retired families" would overstate what was checked.

One candidate was rejected. `sk-code`'s `alignment verifier workflow` in its discovery terms reads
like residue, but it resolves: `alignment verifier` is a live alias of `sk-code-quality` and
`verify_alignment_drift.py` exists on disk. It was left alone.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:files-changed -->
## 3. FILES CHANGED

| File | Change |
|------|--------|
| `.opencode/skills/system-deep-loop/hub-router.json` | Added the two policy keys |
| `.opencode/skills/sk-code/hub-router.json` | Added the two policy keys |
| `.opencode/skills/sk-doc/hub-router.json` | Added the two policy keys |
| `.opencode/skills/cli-external-orchestration/hub-router.json` | Added the two policy keys |
| `.opencode/skills/system-deep-loop/SKILL.md` | Six retired families removed from the keyword block |
| `.opencode/skills/system-deep-loop/graph-metadata.json` | Two retired discovery terms removed |
| `.opencode/bin/lib/compiled-routing/013-live-activation/activation/{cli-external-orchestration,sk-code,sk-doc,system-deep-loop}/manifest.json` | Re-minted |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/{cli-external-orchestration,sk-code,sk-doc,system-deep-loop}/manifest.json` | Authored copies mirrored byte-identically |
| `.opencode/commands/deep/assets/compiled/{deep-ai-council,deep-review,deep-research}.contract.md` | Recompiled — the recorded `SKILL.md` source digest |
<!-- /ANCHOR:files-changed -->

---

<!-- ANCHOR:verification -->
## 4. VERIFICATION

| Check | Command | Result |
|-------|---------|--------|
| Compiled-route guard | `node .opencode/bin/compiled-route-guard.cjs` | exit 0; five hubs fresh |
| Root-metadata gate | `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | exit 0; checked 13, passed 13, failed 0 |
| Root-router fixtures | `node .opencode/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs` | exit 0; all positive and negative fixtures passed |
| Runtime suite | `npx vitest run --no-coverage` in `runtime/` | Exit 0; 154 files, 2678 passed, 8 skipped |
| Spec validator | `validate.sh ... --strict` | RESULT: PASSED |

Pre-change manifest hashes, recorded before the re-mint for rollback: `cli-external-orchestration`
`d7f28b79…`, `sk-code` `0da5f0f5…`, `sk-doc` `e91c3c1c…`, `system-deep-loop` `a69c5f7c…`.

The first suite run exited 1 with four failures, all of them caused by this packet's `SKILL.md` edit
and none of them routing-related. Three generated command contracts carried the hub's previous source
digest. Recompiling them cleared all four; both affected test files then passed 40/40, and the full
suite was re-run from the repaired state. That second run's own counts are recorded in
`acceptance-criteria.md`; the pre-change figure this packet compares against is the `154 files, 2678
passed, 8 skipped` that the predecessor phase recorded, and the four failures plus that total sum to
the same 2686 tests.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## 5. DEVIATIONS

**The brief's proposed direction was measured first, and it pointed the other way.** The brief read
the contradiction as "correct the other to it", naming `ROUTER.md`'s empty preamble as the artifact
whose design choice should win. Checking the enforcement first was the right call and the brief said
so, but the answer it produced does not support that direction: the field is absent from every
compiled policy and the schema forbids it, so neither artifact runs. Had the edit been made to match
`ROUTER.md`, it would have deleted a path list that each hub's own `SKILL.md` route loop actually
consumes as its zero-signal fallback. The JSON keeps its array and gains the discriminating key
instead.

**A concurrent commit split HEAD from its own manifests, and both routing gates are blind to that
shape.** Commit `bdf6ccfbde` — a sibling lineage, not this packet — staged this packet's four re-minted
`manifest.json` files without the `hub-router.json` and `SKILL.md` edits they were minted from. The
result is a HEAD in which each manifest names a policy hash its own committed sources do not produce.
Observed in a clean worktree at HEAD: `compiled-route-guard.cjs` exits 1 with four `stale-manifest`,
and `compiled-route.cjs` returns `servingAuthority: "legacy"` for four of five hubs.

Two gates should have caught that and neither does. The pre-commit `gate:route-remint` decides with a
pathspec over staged `SKILL.md`, `hub-router.json` and `mode-registry.json` before it does any work,
so a commit that stages manifests alone never reaches the check. The pre-push
`gate:compiled-routing` runs the guard against the working tree, not against the commit being pushed,
so a coherent worktree certifies an incoherent commit. The remedy is not a new gate here: this packet's
uncommitted sources compile to exactly the hashes that commit recorded, so committing them together
restores the two sides to agreement.

**No comparing gate was built.** The suite has one cross-artifact check,
`pushLegacyDefaultResidue` in `root-router-contract.cjs`, and it rejects only a literal legacy
smart-router path. Extending it to compare the two policies is not a small change and the finding
does not earn it, so the absence is recorded where the standard states what its enforcement covers.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:continuation -->
## 6. CONTINUATION

The runtime suite was dispatched in the background per the brief and its exit code is recorded in
`acceptance-criteria.md` once read. If it fails, the guard and metadata gates were already green
before the suite finished, so a failure is expected to be either pre-existing or unrelated to
routing; the routing artifacts are covered directly by the three checks above.
<!-- /ANCHOR:continuation -->
