---
title: "Implementation Summary: Template seams and sentinel repair"
description: "The completion sentinel now gates on the tasks verification section, the validators read one continuity set and one template-source list, the sharded flag and two orphan regions are gone, the guides and READMEs match the manifest, and the runtime test project is green and in CI."
trigger_phrases:
  - "seams repair summary"
  - "what shipped sentinel repair"
  - "runtime project green"
  - "sharded flag gone"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/016-template-seams-and-sentinel-repair"
    last_updated_at: "2026-09-07T07:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "None; continue with lane 005's second round"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs"
      - ".opencode/skills/system-spec-kit/runtime/cli/utils/template-structure.js"
    session_dedup:
      fingerprint: "sha256:386669a42ab30232803f1069c5e7b1d61b1e01998a2d7c3db279e50050bfdeec"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Template seams and sentinel repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-template-seams-and-sentinel-repair |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The template lane's second round verified child 010 and then read the code beside it. The completion-evidence sentinel still stat'd the retired `checklist.md` before spawning the checklist evaluation, so the enforcement the hooks README described never ran from the Stop hook. It now gates on a `tasks.md` that carries the verification section's protocol anchor, which is what `check-completion.sh` scopes on, and falls back to the implementation-summary stat as before.

### One set, one list, one fewer flag

The optional-continuity set lived in two validator modules with different members; it is now exported once, with the resource map added because its template ships no block. The document collector reads every present optional add-on from the contract instead of special-casing the closure document, and the goal document's anchors are enforced like the other author add-ons. The scaffolder's `--sharded` flag advertised a templates directory that never existed and is gone. The template helper resolves nested names by basename, the staleness checker upgrades the two newer scaffolded documents, the evidence pattern requires a path before the colon, the ToC rule counts the closure document, and the template-source rule reads its own list of author-rendered documents through a second helper command, because widening the required list broke the file-presence rules on older packets.

### Templates and documents that match the manifest

The manifest lost a taxonomy nothing read and qualifies the closure document's trigger; the stress-test templates nothing consumed are gone. The extension guide, the templates README, the template guide, the style guide, both READMEs, SKILL.md, the playbook and the coverage reference say what the code does: which levels narrow the lazy list, which documents the gates cover, who renders the resource map, what an absent document produces, and how far criteria citations actually go. Child 010's own criteria now cite the lines that prove them. A golden covers the goal template and the `--with-goal` scaffold, and a parity case pins how the packet-type rows narrow the lazy list.

### The runtime test project

Seven suites had failed since the checklist retired and the CLI nested: three built the retired document, one expected pre-nesting paths, one an old message, one merge semantics the identity rule no longer allows, one the council writers' new authorized-roots guard, and the stdio check scanned the nested CLI. Each was repaired at its own fault, and the project joins the CI workflow beside the lanes child 014 added.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/hooks/completion-evidence-sentinel.cjs` | Modified | Gate on the tasks verification section |
| `runtime/lib/validation/spec-doc-structure.ts`, `orchestrator.ts` | Modified | One continuity set; optional add-ons; goal anchors; comment |
| `runtime/cli/spec/create.sh`, `lib/template-utils.sh`, `spec/check-template-staleness.sh` | Modified | Flag removed; basename resolution; upgrade set; scope note |
| `runtime/cli/rules/check-ac-coverage.sh`, `check-toc-policy.sh`, `check-template-source.sh`, `utils/template-structure.js` | Modified | Path-like evidence; closure document; `template-docs` command |
| `runtime/cli/tests/scaffold-golden-snapshots.vitest.ts`, `template-version-parity.vitest.ts` | Modified | Goal golden and scaffold; packet-type pins |
| `templates/spec-kit-docs.json`, `templates/README.md`, `templates/EXTENSION-GUIDE.md` | Modified | Taxonomy removed; trigger qualified; goal rows; wording |
| `templates/stress-test/` | Deleted | Orphan rubric templates |
| Three reference guides, `references/structure/folder-structure.md`, `references/workflows/goal-set-string-playbook.md`, `README.md` (skill and root), `SKILL.md` | Modified | Corrections named in the census |
| `010-template-contract-alignment/acceptance-criteria.md` | Modified | Retro-cited |
| Seven files under `runtime/tests/` | Modified | Fixtures on `tasks.md`; paths; message; identity; authorized roots; nested CLI |
| `.github/workflows/spec-kit-check.yml` | Modified | Runtime project lane |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every row was re-measured first, which showed the sentinel row and three runtime failures were one defect. The sentinel and validator seams changed before the scaffolder, rules and helper; the manifest and documents followed in a literal pass. The runtime suites were repaired by line position after their exact lines were printed unfiltered, because two attempts against filtered output had missed. The one rule widening that failed older packets was reversed into a separate helper command the same hour. The commit was assembled in a private index.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate the sentinel on the protocol anchor rather than on any `tasks.md` | A Level 1 packet has a `tasks.md` and no verification section; spawning the checker there would advise on nothing |
| Keep the closure document optional in the unified set | Both readers treat it that way today for packets created before its template shipped a block |
| A second helper command for the template-source list | Three rules read the first command; changing its meaning failed their level match on packets that were never wrong |
| Remove `--sharded` rather than restore its templates | Nothing in the repository ever held them; the flag documented an intent, not a capability |
| Retro-cite child 010's rows, not the repository's | The rule is advisory and inactive for these packets; the lane's finding was about the packet that shipped the rule |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n` on five scripts; `node --check` on two modules; runtime and CLI builds; `npm run check`; dist freshness | All exit 0; every output fresh |
| The seven repaired runtime suites | 7 files, 90 tests pass |
| Full runtime project | 104 files, 1,258 tests pass; a first run overlapped the runtime rebuild and reported six exit-3 stale-dist failures that the rerun did not reproduce |
| Full CLI project | 138 files, 1,356 tests pass, including the goal golden written on the first run |
| Legacy and validation lanes | the runtime project passed 104 files and 1,258 tests, the CLI project 138 files and 1,356 tests, the legacy lane 94 checks and the validation lane 83 checks with exit 0 each; `.github/workflows/spec-kit-check.yml` runs the runtime project after the validation lane |
| `validate.sh --strict --recursive` on the program | 16 × RESULT: PASSED |
| Three older packets with lazy documents | RESULT: PASSED each, after the helper split |
| sk-doc validator on touched documents | exit 0 on all thirteen touched documents |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Criteria across the repository still rarely cite lines** About one in five Met rows does; the coverage reference now says so and the switch stays off by default.
2. **The staleness checker still compares one template** The parity test holds the others at the same version, which the checker's header now states.
<!-- /ANCHOR:limitations -->

---
