---
title: "Implementation Summary"
description: "The scaffolder now creates review and research packets: two new templates, nested documents at their manifest paths, placeholders filled one directory down, and goldens that validate both strict."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/032-recorded-findings-closure/008-review-research-scaffold-paths"
    last_updated_at: "2026-09-07T15:05:50Z"
    last_updated_by: "template-author"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "Implement child 009"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:3420b01d395976523142cbf3f81923ce92871327996b92a17c287968b77544bf"
      session_id: "scaffold-008-review-research-scaffold-paths"
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
| **Spec Folder** | 008-review-research-scaffold-paths |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`create.sh` rejected `--level review` and `--level research` with a message saying the deep loops write those packets. Both levels now scaffold. The review level gained a `review-report.md.tmpl` carrying the nine sections the deep-review loop emits, and the research level gained a `research.spec.md.tmpl`, because the core spec template has no research branch and rendered a spec with no level marker. Both resolvers, the bash one and the JS one, plus the orchestrator's template map, know the two templates. The batch copier moves every rendered file to the name the manifest declares, so `research/research.md` and `review/review-report.md` land nested instead of flat, and the placeholder pass now reaches documents one directory down. The inline-gate renderer accepts both levels. The placeholder rule skips the two loop-owned documents, matching how the template-source and frontmatter gates already treat them. The goldens scaffold both levels into a throwaway folder under the repository's `specs/` tree and require `RESULT: PASSED` untouched. Each deep-loop SKILL.md states why its loop writes the file itself.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `templates/packet-types/review-report.md.tmpl` | Created | Nine-section report for a hand-authored review packet |
| `templates/packet-types/research.spec.md.tmpl` | Created | Lean research-record spec with the four gated anchors |
| `templates/spec-kit-docs.json` | Modified | Report template declared; the two spec templates registered |
| `runtime/cli/spec/create.sh` | Modified | Level regex accepts both; placeholder pass covers nested docs |
| `runtime/cli/lib/template-utils.sh` | Modified | Research spec mapping; rendered files moved to their manifest names |
| `runtime/cli/utils/template-structure.js`, `runtime/lib/validation/orchestrator.ts` | Modified | Template map entries; freeform docs excluded from the placeholder scan |
| `runtime/cli/templates/inline-gate-renderer.ts` | Modified | `review` and `research` render levels |
| `runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` and its snapshot | Modified | Both scaffolds validate strict; both templates snapshotted |
| `runtime/cli/tests/review-record-validation.vitest.ts` | Modified | The report resolves to its template |
| `templates/CONTRACT.md`, `templates/README.md`, both deep-loop `SKILL.md` | Modified | Templates listed; the loops' reason for writing their own file |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The first scaffold attempts exposed each gap in turn: the research render crashed on the renderer's level set, the nested documents landed flat, the placeholder rule flagged the research addon's body, and every temp-directory scaffold failed the generated-metadata rules because derivation only runs under a specs root. Each was fixed at its producer, the runtime was rebuilt, and both levels were scaffolded again and validated strict until they passed. The goldens were then extended and run, writing two snapshots, and the upgrade-level script confirmed the one existing production move still works.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A research spec template rather than a research branch in the core spec | The review level already took this shape; the packet type is lean by design |
| Move every rendered file to its manifest name, generically | The phase-parent rename was a special case of the same need |
| Exclude loop-owned docs from the placeholder scan | The orchestrator already declares them freeform for its other gates |
| Scaffold the goldens inside the repository's specs tree | Strict validation needs derived metadata, which needs a specs root |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `create.sh --level review` and `--level research` into a specs-rooted folder | exit 0; nested documents at `review/review-report.md` and `research/research.md`, nothing flat |
| Both scaffolds `validate.sh --strict` untouched | RESULT: PASSED, levels detected as review and research |
| Scaffold goldens | 12 pass, 2 snapshots written |
| Review-record, template-structure, registry-coverage suites | pass |
| `test-upgrade-level.sh` | 14 pass |
| Typecheck, dist freshness, full CLI and runtime projects, validation suite | see goal log |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A temp-directory scaffold still fails the generated-metadata rules at every level.** Derivation runs only under a specs root; the goldens work around it, the scaffolder does not.
2. **The review spec template's single-token triggers warn on every validate.** They pre-date this child and warnings do not fail strict.
<!-- /ANCHOR:limitations -->

---
