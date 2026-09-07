---
title: "Implementation Summary: Completion gate and catalog alignment"
description: "The completion checker reads acceptance closure and the sentinel advises on it, a hand-written fingerprint is its own warning class, the links scan is a plain tool, and the references, assets, hook documents and catalog describe the running level and completion contract."
trigger_phrases:
  - "completion gate summary"
  - "what shipped acceptance closure"
  - "malformed fingerprint shipped"
  - "catalog references fixed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/017-completion-gate-and-catalog-alignment"
    last_updated_at: "2026-09-07T09:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "None; close the program's round two"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/cli/spec/check-completion.sh"
      - ".opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts"
    session_dedup:
      fingerprint: "sha256:d93fe1b3325edbe2796fc9f0cf6cbd99319d2a7757fbe80f62adc93826d4b165"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Completion gate and catalog alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-completion-gate-and-catalog-alignment |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The overengineering lane's second round verified children 011 and 012 line by line and then followed the completion claim past the assets they aligned. The checker the sentinel spawns read the checklist only, so a packet with every acceptance criterion `Unmet` could pass the Stop hook. `check-completion.sh` now counts the acceptance table when the document exists, reports `AC_UNMET` for an `Unmet` row or a waiver that names no decision record, carries the counts in its JSON on every status, and the sentinel advises on it. Child 016 had already moved the checker's gate to the `tasks.md` verification section during this round, so the two halves of the round's first P1 row landed in two children.

### A stamp that attests nothing is its own class

Twenty-seven closed packets carry a human label in the `sha256:` slot of their attestation. The freshness rule folded them into "never recorded", which is how round one counted adoption at three times its real figure. A present, non-zero, non-hex value now reports the `malformed_fingerprint` warning with the value in its details. The stamps themselves stay as written: rewriting closed packets' attestations would alter historical documents and their generated fingerprints, and the new class is what makes them countable.

### A tool that stopped pretending to be a rule

`check-links.sh` carried a flag-gated rule path with no registry row, so nothing could ever set the flag, and its default directory named a path that never existed. The rule path is gone, the default is the skills root, and the rules README states that the registry's rows are the rule list and names the scan as the one standalone script. Run over the skill it reports memory-name wikilinks that are not files, which is why it stays a hand-run tool.

### Documents that match the contract

The execution-methods reference, the spec README, the hooks README, the sentinel playbook and the catalog's completion and lifecycle entries say what the checker reads now. The quick reference, the template guide, the decision matrix and the mapping asset name the level recommender instead of calling LOC soft guidance and enforcement manual; the matrix's examples name the closure document; the composition entry names it too, drops the removed bridge document from its lazy list, and distinguishes the presence rules' required list from the marker rule's author-rendered list. Ten catalog references named files that had moved or left with the memory server: two are re-pointed and eight are marked removed where they stand, with a retirement note on the two entries that describe retired modules.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/spec/check-completion.sh` | Modified | Acceptance rows, `AC_UNMET`, JSON block, text line, help |
| `runtime/lib/hooks/completion-evidence-sentinel.cjs` | Modified | Advise on `AC_UNMET` |
| `runtime/cli/validation/continuity-freshness.ts` | Modified | `malformed_fingerprint` |
| `runtime/cli/rules/check-links.sh`, `rules/README.md` | Modified | Standalone scan; inventory claim |
| `runtime/tests/completion-evidence-sentinel.vitest.ts`, `runtime/cli/tests/continuity-freshness.vitest.ts` | Modified | Three new cases |
| `runtime/cli/spec/README.md`, `runtime/lib/hooks/README.md`, `manual-testing-playbook/plugins-and-hooks/completion-evidence-sentinel.md` | Modified | What the checker reads |
| `references/workflows/execution-methods.md`, `references/workflows/quick-reference.md`, `references/templates/template-guide.md`, `references/validation/validation-rules.md` | Modified | Checker contract; recommender; new class |
| `assets/level-decision-matrix.md`, `assets/template-mapping.md` | Modified | Closure document; recommender |
| Seven files under `feature-catalog/tooling-and-scripts/` | Modified | Checker and upgrade inputs; composition list; ten references |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every row was re-measured in the main checkout first: the stamp count with a regex over every implementation summary, the catalog references with a path scan in both absolute and relative forms, the sentinel's gate by reading the file child 016 had changed hours earlier. The checker changed first and was smoked on a real packet and a temporary one before the sentinel learned the status. The documents changed in one literal-replacement script that aborts on any site it cannot find exactly once. The commit was assembled in a private index.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rank `AC_UNMET` after the checklist statuses | The checklist statuses name the specific item; the JSON carries the acceptance counts on every status, so nothing is hidden |
| Warn rather than fail on a malformed stamp | The rule is strict-only and opt-in; a warning names the value without blocking a closed packet's validation |
| Keep the 27 stamps | They are historical attestations in closed packets; the class makes them visible, which is the point |
| Strip the links rule path instead of registering it | A registry row would fail every run on memory-name links that are not files |
| Mark removed references in place | The catalog's own boundary table says where the capability went; a deleted row would hide that the entry once covered it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n` on two scripts; `node --check` on the sentinel; `npm run rebuild`; `npm run check`; dist freshness | All exit 0; every output fresh |
| Checker smoke on child 016 and a temporary packet | `acceptance: present, 4 rows, 0 unmet`; `1 unmet, 1 unbacked waiver` with the blocking line printed |
| Sentinel suite | 23 tests pass, two new |
| CLI freshness suite | 11 pass, one new |
| Full runtime project | 104 files, 1,260 tests pass |
| Full CLI project | 138 files, 1,357 tests pass; the first run failed the vocabulary invariance on one new catalog sentence, reworded |
| Legacy and validation lanes | the runtime project passed 104 files and 1,260 tests, the CLI project 138 files and 1,357 tests after one catalog sentence was reworded for the vocabulary invariance, the legacy lane exit 0 and the validation lane 94 and 83 checks with 0 failures |
| Standalone links scan over the skill | Reports the memory-name links in `references/workflows/rename-pattern.md`, as expected |
| Catalog path scan | Ten rows, each re-pointed or marked removed |
| sk-doc validator on touched documents | exit 0 on every touched document |
| `validate.sh --strict --recursive` on the program | 18 × RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Earlier children's checklists state evidence in prose** The checker's marker pattern does not match them, so the sentinel would advise `EVIDENCE_MISSING` on a fresh completion claim against those closed packets; this packet's rows carry the marker.
2. **The malformed class counts, it does not repair** The 27 stamps remain until someone regenerates those packets' attestations deliberately.
<!-- /ANCHOR:limitations -->

---
