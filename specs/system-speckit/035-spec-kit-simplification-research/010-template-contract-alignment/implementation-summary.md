---
title: "Implementation Summary: Template contract alignment"
description: "The level contract is now the one authority for a packet's documents, goal.md has a scaffold flag, the staleness checker and the coverage enforce switch work, template versions are reconciled and pinned by a test, and every document that described the template system now describes the one that runs."
trigger_phrases:
  - "template alignment summary"
  - "what shipped template contract"
  - "with goal flag shipped"
  - "staleness checker repaired"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/010-template-contract-alignment"
    last_updated_at: "2026-09-07T02:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "None; continue with the last research lane"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/spec-kit-docs.json"
      - ".opencode/skills/system-spec-kit/runtime/cli/spec/create.sh"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:e868ec25d97e3fb2bee3fd0a070dc55bc70d2218adedb91321fd7de36493480f"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Template contract alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-template-contract-alignment |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You asked which templates are core, which are add-ons, when each is called, and whether acceptance criteria are enforced. The code always had one answer and the documents had several. Now they agree: core is `spec.md`, `plan.md`, `tasks.md` and, once implementation starts, `implementation-summary.md`; `acceptance-criteria.md` is scaffolded at Level 2 and above and enforced as a failing rule for packets created after the rollout date; every other document is a lazy add-on that is the same at every level, and each one now has a named way to get it.

### One authority for which documents exist

`resource-map.md` sits in every level contract as a lazy add-on, and the structure validator reads the contract instead of a hardcoded pair. The manifest's `documents` index, which nothing ever read, is declared descriptive in the extension guide, its values corrected, and its orphan `context-index.md` entry and template removed.

### A creator for the goal document

`create.sh --with-goal` scaffolds `goal.md` at any level and on phase parents. The playbook documents that path and the by-hand render, and states the difference between the packet's goal document and the session objective string an operator sets. The scaffolder also decides the closure document from the contract's `optionalAddonDocs` list instead of a substring grep over the whole contract.

### Two tools that had drifted

The staleness checker read a manifest path that never existed and called every folder unknown; it now reads the real manifest and classified 7,807 documents on its first run. The coverage rule's `SPECKIT_AC_COVERAGE_ENFORCE` switch was reserved in the registry and read by nothing; it now fails the rule when coverage is under the floor, and the reference and env template document it.

### Versions that agree

Five utility templates declared their own versions while the manifest said `v2.2` for all; the manifest now matches the markers and `template-version-parity.vitest.ts` compares them on every run, pins the four numbered lazy lists equal, and asserts the checker's manifest path exists.

### Documents that describe the running system

The root README's level table, folder tree and trigger table now name the real scaffold set, the two flags and the renderer, say that a missing closure document fails rather than warns, distinguish the packet's resource map from the loops' evidence ledger, and state which gate runs where. Fourteen more documents lost the cumulative ladder, the hard block on decision records, the retired `checklist.md` and the migration bridge.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `templates/spec-kit-docs.json` | Modified | Descriptive values, versions, resource map in every lazy list, bridge entry removed |
| `templates/packet-types/context-index.md.tmpl` | Deleted | Orphan migration bridge |
| `templates/addons/goal.md.tmpl` | Modified | Author slug the memory-block rule accepts |
| `runtime/lib/validation/spec-doc-structure.ts` | Modified | Hardcoded pair removed |
| `runtime/cli/spec/create.sh` | Modified | `--with-goal`; contract-driven closure document |
| `runtime/cli/spec/check-template-staleness.sh`, `rules/check-ac-coverage.sh`, `rules/check-template-source.sh` | Modified | Manifest path; enforce switch; real example |
| `runtime/cli/tests/template-version-parity.vitest.ts` | Created | Manifest versus markers, flat lazy list, checker path |
| `runtime/cli/tests/level-contract-resolver.vitest.ts` | Modified | Lazy list pins |
| `README.md`, `system-spec-kit/README.md`, `SKILL.md`, `templates/{README,EXTENSION-GUIDE,MIGRATION}.md` | Modified | Trigger table, level table, tree, gates, descriptive index |
| Eight reference guides and three assets | Modified | Flat model, real enforcement, retired names removed |
| `runtime/README.md`, `runtime/lib/hooks/README.md`, `runtime/ENV-REFERENCE.md`, `.env.example` | Modified | Discovery list, sentinel input, enforce switch |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every synthesis row was re-read against the manifest, `create.sh` and the rules before anything changed. The contract changed first so the validator could drop its hardcoded pair; the scaffolder gained its flag; the two drifted tools were repaired; the documents were rewritten in one literal-replacement script that aborts on any site it cannot find exactly once. Smoke scaffolds through `--path` into a temporary directory proved the flag and surfaced the goal template's author slug, which the memory-block rule rejected; the template was corrected and the scaffold rerun. The commit was assembled in a private index.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Declare the `documents` index descriptive rather than wire it | Both the scaffolder and the validator read the `levels` rows; wiring a second source would create the disagreement the lane found |
| Keep the closure document in `optionalAddonDocs` | The file-presence rule has no notion of the rollout cutoff; moving it would fail every grandfathered packet |
| Add a flag for `goal.md` rather than scaffold it always | A packet carries a directive only when an operator will set one as a session objective |
| Implement the enforce switch instead of deleting it | Every other advisory rule in the family has an enforce counterpart; the registry already named it |
| Reconcile the manifest to the templates, not the templates to the manifest | The templates' markers are what thousands of rendered documents already carry |
| Record the continuity-freshness test failure | It reproduces on the untouched worktree and its fixture edits a retired document; it belongs with the tests lane |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n` on the three edited scripts | PASS |
| `npm run build` in `runtime`; `npm run rebuild` and `npm run check` in `runtime/cli` | PASS, zero violations |
| `dist-freshness.cjs check-all` | PASS |
| Goldens, resolver, parity and invariance suites | PASS, 22 tests |
| Runtime structure, continuity, gate and resume suites plus the drift guard | PASS except the two continuity-freshness cases that fail on the untouched worktree |
| Smoke scaffolds: Level 2 default, Level 1 with the goal flag, Level 3 with both flags | All exit 0 with the expected documents; the goal scaffold passes the memory-block rule |
| Repaired staleness checker over the repository | Classifies 7,807 documents: 3,954 current, 64 at v1.0, 3,789 without a version |
| Residue search for the retired names | Only historical notes, fixtures and playbooks |
| sk-doc validator on the seven touched READMEs and assets | exit 0 each |
| Full CLI vitest project | 136 files and 1,348 tests pass; the one failure is `recursive-child-manifest.vitest.ts`, which reads another session's packet and failed before this program |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The checker counts documents without a version as stale candidates** Three of every four documents in the repository carry no version marker; the checker now reports that honestly instead of calling everything unknown, but it does not yet distinguish a fixture from a packet.
2. **The `documents` index is truthful but inert** Nothing reads it; a future maintainer may still wire or remove it.
<!-- /ANCHOR:limitations -->

---
