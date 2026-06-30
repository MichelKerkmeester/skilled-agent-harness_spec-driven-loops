---
title: "Implementation Summary: Apply Core Skill Docs"
description: "Phase 3 versioned the 457 core skill docs (SKILL.md, READMEs, references, assets) from the engine manifest, normalized four 3-part SKILL.md versions, and verified the result deterministically plus a read-only MiMo audit."
trigger_phrases:
  - "core skill docs versioned"
  - "apply core skill docs phase 3"
  - "SKILL.md normalized 4-part"
  - "mimo audit core docs"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-frontmatter-versioning/003-apply-core-skill-docs"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Versioned core skill docs and normalized the four 3-part SKILL.md files"
    next_safe_action: "Apply versions to catalogs and playbooks in phase 004"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/scripts/frontmatter-version.mjs"
      - ".opencode/skills/*/SKILL.md"
      - ".opencode/skills/*/references"
      - ".opencode/skills/*/assets"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-003-apply-core-skill-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "12 frontmatter-less core docs are skipped (gate-exempt), not synthesized."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-apply-core-skill-docs |
| **Completed** | 2026-06-23 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every core skill doc now self-reports its version. The engine computed the full corpus once (2,222 files in 9.5 minutes) into a manifest, and Phase 3 applied the core slice — `SKILL.md`, `README.md`, `references/**`, `assets/**` — straight from that manifest with no further git, so the apply was instant.

### Versioned core docs

457 core docs carry a 4-part version. 422 were fresh inserts, 23 were already correct, and 12 SKILL.md files were reconciled or normalized: the stale ones moved up to their changelog anchor (system-spec-kit `3.4.1.0` -> `3.6.0.0`, deep-research `1.14.0.0`), and the four 3-part files (`deep-loop-workflows`, `deep-loop-runtime`, `sk-design-md-generator`, plus one mode packet) were canonicalized to 4-part. 12 frontmatter-less docs (mostly example DESIGN.md files and a couple of bare READMEs) were skipped — the engine never synthesizes a frontmatter block.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/*/{SKILL.md, README.md, references/**, assets/**}` | Modified | Inserted/normalized 4-part version (457 docs) |
| `scripts/frontmatter-version.mjs` | Modified | Fixed a normalization skip bug (see Key Decisions) |
| `scripts/tests/test_frontmatter_version.mjs` | Modified | Added the 3-part-normalization regression case |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The engine applied the manifest deterministically and `verify` confirmed every value (exit 0). A read-only MiMo v2.5 Pro audit (dispatched via cli-opencode, `xiaomi/mimo-v2.5-pro`) reviewed a skill's versioned docs as the in-the-loop second pass and confirmed the asset/reference/README values were correct, last-key, and 4-part with trigger_phrases intact. The `gate` mode then caught a real defect that `verify` did not, and the fix was re-applied and re-gated to green.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fixed apply to compare the RAW version, not the normalized value | A 3-part `1.0.0` normalizes to `1.0.0.0` and was being `skip-equal`'d, leaving the malformed 3-part on disk; the gate caught it |
| Accept version-not-last for ~7 pre-existing SKILL.md | Their version value is correct; position is an insertion convention, not a correctness invariant — moving it is needless churn |
| MiMo runs read-only (audit), engine does the writes | A documented opencode write-incident deleted 44 files; the deterministic engine + verify is the correctness guarantee, MiMo is the in-the-loop reviewer |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Phase 3 apply (core classes) | 457 versioned, 12 skip-no-frontmatter, 4 normalized |
| `verify` (core classes) | PASS — exit 0, ok=457 |
| `gate` (core classes) | PASS — exit 0, ok=457, 12 skipped (after the normalization fix) |
| unit suite | PASS — 21/21 (added 3-part normalization case) |
| MiMo read-only audit (sk-code-review) | Confirmed asset/reference/README values correct, 4-part, last-key, trigger_phrases intact |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **12 frontmatter-less core docs carry no version.** They have no frontmatter block, and a versioning pass never synthesizes one. The gate skips (does not fail) them.
2. **~7 pre-existing SKILL.md keep their version mid-block** (not last key). The value is correct; position was left as-is to avoid churn. The MiMo audit flagged this per its prompt criteria; it is an accepted cosmetic state.
3. **The build segment reflects all line-changing commits** (numstat>0), so heavily-edited core docs read high in the build position (e.g. `3.6.0.x`), with the major still low.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
