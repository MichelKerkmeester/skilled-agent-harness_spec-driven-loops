---
title: "Implementation Summary"
description: "Diagram Corpus has been red since 2026-10-18 over one frontmatter value: the diagram script README carried 1.0.1.0 outside the packet's 1.2 era. The README now carries 1.2.0.1, the family's error message says to set the major.minor by hand, and the corpus, the mutation suite and both applicator steps pass."
trigger_phrases:
  - "diagram corpus ci implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/047-diagram-corpus-ci"
    last_updated_at: "2026-10-21T13:50:00Z"
    last_updated_by: "deepseek-v4.1-flash"
    recent_action: "README moved to 1.2.0.1, era message rewritten, corpus and mutation suites rerun"
    next_safe_action: "Push, then record the Diagram Corpus run id in tasks T010"
    blockers: []
    key_files:
      - ".skilled/skills/sk-design/sk-design-diagram/scripts/README.md"
      - ".skilled/skills/sk-design/sk-design-diagram/scripts/families/metadata.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-047-diagram-corpus-ci"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 047-diagram-corpus-ci |
| **Completed** | 2026-10-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Diagram Corpus has failed since run `39165172090` at `be234e6f94` on 2026-10-18, and every pull request run since 2026-10-14 failed too. The cause was one number. A bulk pass on 2026-10-12 gave `.skilled/skills/sk-design/sk-design-diagram/scripts/README.md` its first version, `1.0.0.0`, the next push bumped it to `1.0.1.0`, and the packet's metadata family requires every in-scope doc to share `SKILL.md`'s major.minor, which is `1.2` at `1.2.2.0`. The README now carries `1.2.0.1`.

### Phase 47: diagram-corpus-ci

You get the last red workflow back, and the next person who hits this rule is told what to do. The version keeps the one earlier edition the README had earned, because the packet's era moves have always kept each doc's edition count. Nothing else in the package changed: the other 11 families already passed, and the workflow itself was right to fail.

The family's error message was the second half of the problem. It said the frontmatter-version apply pass would re-derive the value, but that pass keeps a child doc's own edition, so following the advice changed nothing. The message now says to set the major.minor by hand and names why.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-design/sk-design-diagram/scripts/README.md` | Modified | Frontmatter version `1.0.1.0` to `1.2.0.1` |
| `.skilled/skills/sk-design/sk-design-diagram/scripts/families/metadata.cjs` | Modified | Era error message names the by-hand step and stops claiming the apply pass fixes it |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The old value was restored first and the checker rerun, so the failure is shown to come from the version and not from something else (`scratch/evidence/corpus-mutated-back.log`). At `1.2.0.1` the same checker reports 38 files, 12 families and 0 errors (`scratch/evidence/corpus-after.log`).

The mutation suite was run before the change and after it. Before, its first test, the clean-corpus precondition, failed and put the metadata error into the output of three cases that copy the package (`scratch/evidence/mutation-before.txt`). After, all 21 tests pass (`scratch/evidence/mutation-after.tap`). Both applicator steps were rerun and their output compared to `assets/diagrams` byte for byte, with no difference.

The diff went to a read-only DeepSeek v4.1 flash max review, which returned PASS with no P0 or P1. It raised three P2s. Two were fixed: the message advice and the edition count. The third is recorded below because the file it needs is outside this change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move the version, not the rule | The family's era rule is what caught a real drift; the README is the doc that left the anchor's era |
| Keep the edition at `.1` and set the major.minor | The packet's earlier era moves kept each document's edition count, so `1.2.0.1` records the one edition this README had |
| Rewrite the error message in the same change | The message pointed at an apply pass that cannot fix the value, so the next reader would have repeated this failure |
| Leave sk-doc's `frontmatter-version.mjs` alone | It keeps a child doc's edition by design and starts a missing one at `1.0.0.0`; changing that default is sk-doc's version standard, not this fix |
| Do the work in this packet, not the sk-design one | The open-work goal needs every workflow green, and the change is two files in the sk-design owner's tree |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Corpus check with `1.0.1.0` restored | FAILED, one metadata error naming `scripts/README.md` and its `1.0.1.0` version - `scratch/evidence/corpus-mutated-back.log` |
| Corpus check at `1.2.0.1` | PASSED, 38 files, 12 families, 0 errors - `scratch/evidence/corpus-after.log` |
| Mutation suite before the fix | FAILED, the clean-corpus precondition and three package-copy cases carried the metadata error - `scratch/evidence/mutation-before.txt` |
| Mutation suite after the fix | PASS 21/21, 0 failed - `scratch/evidence/mutation-after.tap` |
| Both applicator steps | Output reproduced `assets/diagrams` byte for byte |
| Existing era mutation case | Still covers the rule at `scripts/tests/mutation-cases.cjs:71`; it rejects a version outside the anchor era |
| DeepSeek v4.1 flash max read-only review | PASS, no P0 or P1, 3 P2; two fixed, one recorded below |
| Diagram Corpus on CI at the pushed commit | Not run yet; status stays In Progress until the run id is recorded in `tasks.md` T010 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A new doc in this packet will fail the same check.** sk-doc's `frontmatter-version.mjs` still starts any doc without a version at `1.0.0.0`, so the next new doc under this family fails the era rule until someone sets its major.minor by hand. The durable fix belongs to sk-doc's version standard, and that owner decides it.
2. **CI has not confirmed this yet.** The local corpus pass, the mutation suite and the applicator comparison are green, but Diagram Corpus is only proven by a run at the pushed commit. Its run id is task T010.
<!-- /ANCHOR:limitations -->

---
