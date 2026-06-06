---
title: "Implementation Summary: Phase 1: provenance-and-audit [template:level_1/implementation-summary.md]"
description: "Planned-stub summary for Phase 1 provenance-and-audit. Nothing implemented yet: this records the intended source_kind tagging, write-ingress overwrite guard, standardized mutation_ledger audit, and constitutional immunity rule before any code is written."
trigger_phrases:
  - "memory source_kind provenance"
  - "auto overwrite manual constitutional guard"
  - "mutation_ledger automated audit"
  - "write ingress provenance derivation"
  - "provenance audit phase summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/001-provenance-and-audit"
    last_updated_at: "2026-06-06T10:10:45Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffold Phase 1 planned-stub impl doc"
    next_safe_action: "Plan or implement T001 source_kind column migration"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-provenance-and-audit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 001-provenance-and-audit |
| **Completed** | Not started — plan only |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

**Planned — not yet implemented.** Nothing in this phase has been built. This summary is a forward-looking stub that records the intended change so the work can be picked up cleanly. When implemented, Phase 1 will tag every memory write with a server-derived `source_kind`, refuse automated overwrites of manual/constitutional fields at write ingress, append a deduped audit row per automated mutation to the existing `mutation_ledger`, and register one narrow constitutional immunity rule — all automatic and invisible to the user.

### Planned: server-derived `source_kind` on every write

The memory index schema will gain a `source_kind` enum (`human|agent|system|import|feedback`), derived server-side from the calling context (caller/path/tool) at write ingress. The user is never prompted for it. This gives every row an explicit origin so the write path can reason about whether an automated actor should be allowed to touch a given field.

### Planned: write-ingress overwrite guard

The update handler will refuse, in its pre-mutation phase, any automated (`source_kind != human`) write that targets a human-authored or constitutional field. Protected fields are skipped, safe fields in the same payload still persist, and the response envelope carries a quiet "skipped to protect manual data" hint. Manual and constitutional memory becomes structurally un-overwritable rather than relying on caller discipline.

### Planned: standardized automated-mutation audit

Each automated mutation will append exactly one deduped row to the existing append-only `mutation_ledger` (actor/source/reason), keyed by a deterministic event key so an identical repeat does not duplicate. No parallel audit table is introduced.

### Planned: constitutional immunity rule

One narrow rule — "automated writers may never overwrite manual/constitutional fields" — will be registered under `constitutional/` and surface as advisory in validation.

### Files Changed (planned)

<!-- Planned changes for a not-yet-implemented Level 1 phase. No code has been written. -->

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify (planned) | Add the `source_kind` enum column + forward migration (defaults from existing `provenance_source`). |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts` | Modify (planned) | Derive and persist `source_kind` at write ingress for new records. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | Modify (planned) | Derive `source_kind` on update, enforce the manual/constitutional overwrite guard, attach the skipped-overwrite hint. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts` | Modify (planned) | Append the deduped automated-mutation audit row in the post-write hook (no integrity decisions). |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts` | Modify (planned) | Add a deduped audit-append entry point keyed by a deterministic event key. |
| `.opencode/skills/system-spec-kit/constitutional/automated-writers-never-overwrite-manual.md` | Create (planned) | Register the narrow constitutional rule (advisory in validation). |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/__tests__/memory-crud-update.test.ts` | Create (planned) | vitest: overwrite guard blocks automated manual-field writes; safe fields still save. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/__tests__/mutation-ledger.test.ts` | Create (planned) | vitest: audit appends once per automated mutation; identical repeat appends none. |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modify (planned) | Document `source_kind` and the write-ingress overwrite guard. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Not started — plan only. Nothing has been delivered, tested, or shipped. The intended delivery path is: schema migration first (Setup), then the write-ingress derivation, overwrite guard, audit standardization, and constitutional rule (Core), then vitest unit/integration coverage and a manual `/doctor memory` check (Verification). Rollout is behind a fail-safe: `source_kind` defaults to the existing `provenance_source` if the migration is reverted, and the overwrite guard fails open on derivation ambiguity so a write is never silently lost.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Put the `source_kind` derivation and overwrite guard in the pre-mutation (write-ingress) phase, not in `mutation-hooks.ts`. | `mutation-hooks.ts` is post-write, so a guard there fires too late to prevent an overwrite. Integrity decisions have to run before the transactional writer. |
| Reuse the existing `mutation_ledger` for the audit instead of adding a parallel table. | The append-only ledger and its SQLite triggers already exist; a second table would split the trail and add maintenance for no gain. |
| Dedup audit appends with a deterministic event key (actor/source/reason) and summarize in `/doctor`. | Stops automated mutations from flooding the ledger with redundant rows while keeping one row per logical mutation. |
| Derive `source_kind` strictly from explicit caller/tool context and default conservatively. | Guessing origin from row content risks mislabeling a human edit as `agent`; explicit context keeps the tag trustworthy. |
| Default `source_kind` to the existing `provenance_source` and keep the guard fail-open on ambiguity. | Makes the migration cleanly reversible and guarantees a write is never silently dropped if derivation is uncertain. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| vitest: overwrite guard blocks automated manual/constitutional writes; safe fields still save | Not started — plan only |
| vitest: automated mutation appends exactly one `mutation_ledger` row; identical repeat appends none | Not started — plan only |
| vitest: every create/update path persists a non-null `source_kind` | Not started — plan only |
| Manual: automated update of a human-authored field is skipped and the response carries the "skipped to protect manual data" hint (`/doctor memory` audit summary) | Not started — plan only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Unimplemented.** This phase is planned only; no code, schema migration, tests, or constitutional rule have been written yet. Every claim here is intended behavior, not shipped behavior. Start at T001 (`source_kind` column + migration).
2. **Open: constitutional field set.** Which exact fields count as "constitutional" for the overwrite guard (and whether the set derives from `importance_tier`/`contextType` or an explicit allowlist) is unresolved and must be confirmed against the live schema during Setup.
3. **Open: `import`/`feedback` tier.** Whether `import` and `feedback` `source_kind` values share `agent`/`system` overwrite protection or form a distinct tier is undecided; the working default blocks all non-`human` kinds from overwriting human/constitutional fields.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

