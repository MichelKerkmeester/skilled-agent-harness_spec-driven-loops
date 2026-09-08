---
title: "Implementation Summary: Scaffold, placeholder and upgrade truth"
description: "A fresh scaffold no longer fills placeholder slots with the feature name or leaves provenance tokens in titles, the scaffolder strips provenance from titles, upgrades create the lifecycle summary and stop creating the lazy decision record, a phase parent fails loudly without its required description, children derive their metadata from their documents, the resolvers agree on path-typed documents, and the goal and decision-record templates obey the human-voice rules they cite."
trigger_phrases:
  - "scaffold placeholder truth summary"
  - "what shipped round three"
  - "phase parent description error"
  - "upgrade creates implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/018-scaffold-placeholder-and-upgrade-truth"
    last_updated_at: "2026-09-07T15:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "None; continue the round-three closeout"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/cli/spec/create.sh"
    session_dedup:
      fingerprint: "sha256:89b5ee5e396224bf9d2074c7cf2293fe202600509ac2e9e89f50d59fca1ec62a"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Scaffold, placeholder and upgrade truth

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-scaffold-placeholder-and-upgrade-truth |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The template lane's third round verified two rounds of remediation and found the seams a scaffold leaves behind. The scaffolder replaced every `[YOUR_VALUE_HERE: x]` slot with the feature name, so a phase parent's open questions and predecessor became its own name, and the placeholder rule, which detects only that class, saw nothing. It now fills only the slots it knows, the phase-parent template shows the rest as visible hints, and the scaffolder strips the `[template:level-N/doc]` provenance that 1,240 real titles still carry because nothing stripped it. A rule class for that residue was tried and reverted: it failed the extended suite's fixture on the first run and would have failed every closed packet that carries the token, so the standalone placeholder script keeps reporting the backlog and the goldens hold new scaffolds clean.

### Upgrades that match a fresh scaffold

An upgrade never created `implementation-summary.md`, which every fresh scaffold writes and the presence rule requires once implementation starts, and created `decision-record.md`, which the contract calls lazy. Both are reversed. A phase parent whose compiled description generator was missing warned and passed while its own presence rule calls the file required; it now fails with the generator's path. Its children carried a metadata stub written before their documents; each child is now derived the way the parent is.

### Resolvers and templates that agree

The JS resolver keyed its template map by `research/research.md` but looked up by file name, so the round-two bash fix left the JS path broken; both resolve by file name now and the bash resolver gained the review case the JS one had. The phase-parent template carries its own provenance slug instead of the core spec's. The goal and decision-record templates broke an em-dash, a semicolon and two Oxford-comma rules two lines under the human-voice reference they cite; the reference's own template table named two paths that do not exist and now names the real ones with a note that anchors and enumerations are template mechanics.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/spec/create.sh` | Modify | Specific placeholder fills, provenance strip, phase-parent description error, per-child metadata derivation, level error text |
| `runtime/cli/rules/check-placeholders.sh` | Modify | Header states the two hard classes and why provenance stays with the standalone report |
| `runtime/cli/spec/upgrade-level.sh` | Modify | Creates the lifecycle summary; stops creating the lazy decision record |
| `runtime/cli/utils/template-structure.js` | Modify | Resolves path-typed contract documents by file name |
| `runtime/cli/lib/template-utils.sh` | Modify | Review case and the two loop-written levels |
| `runtime/cli/templates/inline-gate-renderer.ts` | Modify | Flat-output contract stated |
| `runtime/cli/rules/check-files.sh` | Modify | Header names the contract and its sibling rule |
| `templates/packet-types/phase-parent.spec.md.tmpl` | Modify | Own provenance slug; hint tokens for the slots the scaffolder cannot fill |
| `templates/addons/goal.md.tmpl, templates/addons/decision-record.md.tmpl` | Modify | Em dash, semicolon and Oxford commas removed |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` | Modify | Template table names real paths; scope note for anchors and enumerations |
| `runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` | Modify | Asserts the strip and the substitution; snapshots updated |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every row was re-measured in the main checkout first, which showed the placeholder rule and the standalone script are different programs and that the scaffolder's blanket fill was the mechanism behind the wrong values. The scaffolder, rule and upgrade script changed first and were smoked; the templates and documents followed in one literal-replacement pass; the goldens gained assertions and their changed snapshots were re-recorded after reading the diff. The commit was assembled in a private index.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Hint tokens instead of the feature name | A slot the scaffolder cannot know is better visible than wrong; the rule ignores hint tokens by design |
| Revert the provenance rule class | It fails 1,240 closed documents for a defect the scaffolder no longer produces; the blast radius belongs to an operator sweep, not a remediation child |
| Fail a phase parent loudly on a missing generator | Its own presence rule calls the file required; a warning that passes teaches the author the gate is broken |
| Stop creating decision-record.md on upgrade | The contract calls it lazy at every level; an upgrade that created it left fresh and upgraded packets with different file sets |
| Document review and research as loop-written levels | The deep loops own those packets; teaching create.sh to scaffold them would add a path nothing calls |
| Leave the 1,240 historical titles | They are closed packets; the rule and the scaffolder stop the class from growing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n` on four scripts; `node --check` on the helper; runtime and CLI builds; `npm run check`; dist freshness | All exit 0; every output fresh |
| Goldens, parity and the new registry-coverage suite | 3 files, 15 tests pass; 3 snapshots updated for the changed templates |
| `test-upgrade-level.sh` | 14 passed, 0 failed |
| Full runtime project | 104 files, 1,260 tests pass |
| Full CLI project | 139 files, 1,358 tests pass |
| Legacy and validation lanes | the runtime project passed 104 files and 1,260 tests, the CLI project 139 files and 1,358 tests, the legacy lane exit 0, and the validation lane 31 and 83 checks plus the four harnesses with exit 0 |
| `validate.sh --strict --recursive` on the program | 23 × RESULT: PASSED |
| sk-doc validator on touched documents | exit 0 on all 49 touched documents |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The 1,240 documents already carrying a provenance token stay as written** they are closed packets; the scaffolder stops the class from growing and the standalone script reports the backlog.
2. **Hint tokens are not enforced** The standalone placeholder script reports them; the rule flags only the hard classes.
<!-- /ANCHOR:limitations -->

---
