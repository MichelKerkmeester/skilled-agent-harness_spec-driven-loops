---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will add a warn-tier rule asserting subset coherence of trigger_phrases across spec.md frontmatter, description.json, and graph-metadata.derived. No code change has landed."
trigger_phrases:
  - "trigger phrases coherence"
  - "cross-surface assertion"
  - "subset coherence"
  - "description.json triggers"
  - "graph-metadata derived"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/005-trigger-coherence-assertion"
    last_updated_at: "2026-07-06T18:49:46.405Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase impl doc for A5 trigger coherence scaffold"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-trigger-coherence.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/scripts/extractors/spec-folder-extractor.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-trigger-coherence-assertion |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Cross-surface trigger coherence rule

The phase will add one warn-tier rule that reads the `trigger_phrases` concept from the three surfaces of a spec folder. It will read the curated set from spec.md frontmatter, the indexed set from `description.json`, and the derived set from `graph-metadata.derived`, then assert that the indexed and derived sets are each a subset of the curated frontmatter set. The rule will name any orphan phrase that reached the index or the derived copy without a matching curated entry, so a curated trigger that never reached the index or a stale derived copy after a frontmatter edit stops shipping unnoticed.

### Extractor-matching normalization and cap tolerance

The phase will mirror the normalization in `spec-folder-extractor.ts` lines 387-390, which build the indexed set as a case-fold, trim, dedupe, then `slice(0, 12)`. Mirroring it means the rule compares the same way the index actually built the set, so the legitimate difference between a longer curated frontmatter list and a 12-entry capped derived set is not a finding. A missing or empty surface is treated as no-data so older folders without a derived trigger key never read as divergence.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/rules/check-trigger-coherence.sh` | Planned create | Read the three surfaces, normalize each set, and emit a warn finding for any indexed or derived phrase absent from curated frontmatter |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Planned modify | Register the new rule at `severity: warn` next to the description and graph-metadata shape rules |
| `.opencode/skills/system-spec-kit/scripts/extractors/spec-folder-extractor.ts` | Read-only reference | Source of the `dedupe([...]).slice(0, 12)` normalization the rule must mirror at lines 387-390 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned rollout lands the rule report-only at warn so the existing corpus never blocks on it. The first dry run over `.opencode/specs` lists current divergences as warn findings, which feed the backfill beat that A2 trigger propagation then closes. The warn-to-error flip is out of scope here and rides the same four-beat migration as the A4 shape rules, deferred until a backfill report reads zero.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Assert subset coherence rather than byte equality | The 12-entry cap on the derived set would false-fire under byte equality, so subset is the only correct relation |
| Mirror the extractor normalization exactly | Comparing the way the index built the set is the only way to avoid drift that false-fires or misses real divergence |
| Land report-only at warn | A warn-tier landing reports the gap without breaking the legacy corpus, and pairs with A2 which produces the coherence A5 asserts |
| Treat missing or empty surfaces as no-data | Older folders lacking a derived trigger key would otherwise read as divergence, so absence is tolerated |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet.

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/rules/check-trigger-coherence.sh <divergent-fixture>` emits a warn finding naming the orphan phrases | PLANNED, not yet run |
| `bash .opencode/skills/system-spec-kit/scripts/rules/check-trigger-coherence.sh <capped-fixture>` reports no finding on a 12-entry derived subset against 15 frontmatter triggers | PLANNED, not yet run |
| `bash .opencode/skills/system-spec-kit/scripts/rules/check-trigger-coherence.sh <no-derived-fixture>` reports no coherence finding for the absent derived surface | PLANNED, not yet run |
| `rg -n 'trigger_phrases' .opencode/skills/system-spec-kit/scripts/extractors/spec-folder-extractor.ts` confirms the normalization the rule mirrors at lines 387-390 | PLANNED, not yet run |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs --strict` dry run exits non-error with warn findings across the live corpus | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Pairs with A2.** Without A2 trigger propagation many folders will show a curated-versus-title-copy divergence that A2 is the writer to close, so A5 reports the gap A2 then fills.
3. **Open derived-key question.** Whether every live folder stores the derived trigger set under `graph-metadata.derived.trigger_phrases` or whether a legacy key needs a fallback read is unresolved, pending a sample across both.
<!-- /ANCHOR:limitations -->

---
