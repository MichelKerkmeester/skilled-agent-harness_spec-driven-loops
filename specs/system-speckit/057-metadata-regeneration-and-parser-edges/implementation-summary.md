---
title: "Implementation Summary"
description: "The drifted graph metadata is regenerated across every clean packet, and system-deep-loop and sk-doc now depend on the spec-kit shared package so their frontmatter parsers can adopt the shared one."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/057-metadata-regeneration-and-parser-edges"
    last_updated_at: "2026-09-05T21:16:57Z"
    last_updated_by: "template-author"
    recent_action: "Regenerated, edges added, parser adopted"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:68862831674ebdfa4a48ee897c2c02c64f2b3eea334fa2aa18fe07bb051e6b11"
      session_id: "scaffold-057-metadata-regeneration-and-parser-edges"
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
| **Spec Folder** | 057-metadata-regeneration-and-parser-edges |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A census over every `graph-metadata.json` under `specs/` found 114 packets whose declared children disagreed with disk and marked which folders were clean in git. The identity-aware writer from packet 056 ran over the 113 clean ones; 122 generated files changed and the census afterwards shows four packets left: the one dirty chart packet, and three that declare children no longer on disk, which the writer keeps by design. The deep-loop runtime and sk-doc's scripts now declare `@spec-kit/shared` as a `file:` dependency installed in their own package roots, and the shared parser resolves from both; sk-doc's manifest sits at the skill root so its five script directories all resolve it. The deep-loop runtime manifest had never been tracked because the ignore rule swallows every `package.json`; it is force-tracked now.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 122 `description.json` and `graph-metadata.json` files across 113 packets | Regenerate | Drift removed |
| `system-deep-loop/runtime/package.json`, `package-lock.json` | Modify, force-track | Shared dependency edge |
| `sk-doc/package.json`, `package-lock.json` | Add, force-track | Shared dependency edge for every script directory |
| `system-deep-loop/runtime/scripts/check-contract-drift.cjs` | Modify | Shared parser |
| `sk-doc/shared/scripts/frontmatter-version.mjs`, `sk-doc/scripts/tests/test-frontmatter-version.mjs`, `sk-doc/sk-create-skill/scripts/{validate-compiled-routing-scenarios,validate-playbook-topology}.cjs`, `sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs`, `sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Modify | Shared parser |
| `sk-doc/sk-create-skill/scripts/tests/create-journey-proof.test.cjs` | Modify | Stages the shared package into its scaffold |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Census and regeneration ran here from a scratchpad script that is not committed; the installs ran in each package root; the adoption runs as a GLM 5.3 Flash lane through OpenRouter with every claim rerun before commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Skip any folder with uncommitted changes | Another session's work must not be rewritten under it |
| Leave track roots to the sweep | No generator writes a track-root metadata file; inventing one is a design change |
| `file:` dependencies in package roots, no repository-root install | Keeps each skill's dependency graph its own while sharing one parser |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Census before and after | 114 drifted packets, 1 dirty → 4 remaining (1 dirty, 3 with children gone from disk) |
| Generator errors | 0 |
| Strict validation sample | 4 of 6 PASSED; both failures reproduce at HEAD |
| Import probes | deep-loop ESM and CommonJS resolve; sk-doc scripts ESM resolves |
| Parser adoption | 7 files adopted; drift suite 8 of 8, frontmatter-version test 23 of 23, consumer matrix 17, ten sk-create-skill tests exit 0, playbook contract 8 assertions; deep-loop typecheck 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Thirteen track roots still declare stale children; nothing generates a track-root `graph-metadata.json`, so the sweep reports them until a generator exists.
- Three packets declare children that no longer exist on disk; the writer keeps own-identity entries by design.
- 38 hand-rolled parse sites remain: 16 in deep-loop directories outside its runtime package (no dependency edge; a manifest for `deep-improvement/scripts` and `deep-ai-council/scripts` would be the next step), 16 spec-kit internals that the parser's own skill should adopt in its own lane, one advisor checker, spec-kit test helpers, and seven Python parsers under sk-doc.
<!-- /ANCHOR:limitations -->
