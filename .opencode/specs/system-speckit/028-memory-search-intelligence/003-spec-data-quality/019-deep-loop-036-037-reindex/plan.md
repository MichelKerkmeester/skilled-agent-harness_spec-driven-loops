---
title: "Implementation Plan: Reindex the renamed system-deep-loop 036 router-replay-surface-slice-sync and 037 scenario-loader-code-surface-sync folders and repoint their stale copied metadata identifiers and inbound references [template:level_1/plan.md]"
description: "Regenerate description.json and graph-metadata.json for both renamed folders via the existing generators, fix internal doc references to the old slug, and repoint two confirmed inbound references in 124-sk-code-parent."
trigger_phrases:
  - "deep-loop 036 037 reindex plan"
  - "stale identifier regeneration plan"
  - "harness dependencies repoint plan"
  - "router-replay rename plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/019-deep-loop-036-037-reindex"
    last_updated_at: "2026-07-06T08:49:49.047Z"
    last_updated_by: "michel-kerkmeester"
    recent_action: "Authored Level 1 plan for the deep-loop 036/037 folder-rename reindex"
    next_safe_action: "Author tasks.md and implementation-summary.md for this phase"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/036-router-replay-surface-slice-sync/description.json"
      - ".opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync/description.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/053-deep-loop-036-037-reindex"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Reindex the renamed system-deep-loop 036 router-replay-surface-slice-sync and 037 scenario-loader-code-surface-sync folders and repoint their stale copied metadata identifiers and inbound references

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js / TypeScript (`generate-description.ts`, `backfill-graph-metadata.ts`) plus plain text edits |
| **Framework** | None. CLI scripts and direct markdown edits |
| **Storage** | Filesystem JSON (`description.json`, `graph-metadata.json`) and markdown files |
| **Testing** | Grep-verify zero remaining old-slug matches inside each folder's own docs, plus the two named inbound files |

### Overview
Both renamed folders carry `description.json`/`graph-metadata.json` copied from their pre-rename locations, so their own identifiers still say the old path. This plan regenerates both files against the new paths using the existing generators, greps and fixes every internal doc reference to the old slug inside each folder, and repoints the two confirmed inbound references in `124-sk-code-parent`. No new tooling gets built; this is a targeted identifier correction.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted identifier correction against two known folders and two known inbound reference lines. No new component.

### Key Components
- **`generate-description.ts`**: Regenerates `description.json` against the new path for both folders.
- **`backfill-graph-metadata.ts`**: Regenerates `graph-metadata.json` against the new path for both folders.
- **Internal reference fix**: Direct edits inside each folder's own five docs, replacing the old slug with the new one.
- **Inbound reference fix**: Direct edits at the two confirmed lines in `124-sk-code-parent`.

### Data Flow
```
overlap-check (git status) -> regenerate description.json (per folder, new path)
                            -> regenerate graph-metadata.json (per folder, new path)
                            -> grep + fix internal slug references (per folder's own 5 docs)
                            -> repoint 2 confirmed inbound references (124/021:178, 124/022:191)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This addendum applies: the stale identifiers are already visible to at least two other packets (`124-sk-code-parent/021`, `124-sk-code-parent/022`), so this is a cross-consumer correction, not an isolated fix.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `system-deep-loop/036-router-replay-surface-slice-sync/{description,graph-metadata}.json` | Carries the old `037-...` identifiers | Regenerate against the new `036` path | `specFolder`/`packet_id`/`spec_folder` all read `036-router-replay-surface-slice-sync` |
| `system-deep-loop/037-scenario-loader-code-surface-sync/{description,graph-metadata}.json` | Carries the old `038-...` identifiers | Regenerate against the new `037` path | `specFolder`/`packet_id`/`spec_folder` all read `037-scenario-loader-code-surface-sync` |
| Each folder's own 5 docs (`spec`, `plan`, `tasks`, `checklist`, `implementation-summary`) | Reference their own old slug internally | Fix every reference | `rg -n "037-router-replay-surface-slice-sync" system-deep-loop/036-router-replay-surface-slice-sync/` and the equivalent for `037` both return zero matches |
| `124-sk-code-parent/021-playbook-gold-and-lane-c-rebaseline/spec.md:178` | Cites both old slugs in a "Harness dependencies" bullet | Repoint to the new slugs | Line reads `system-deep-loop/036-router-replay-surface-slice-sync`, `system-deep-loop/037-scenario-loader-code-surface-sync` |
| `124-sk-code-parent/022-collapse-to-four-subskills/spec.md:191` | Same bullet, same staleness | Repoint to the new slugs | Same check as above |

Required inventories:
- Same-class producers: `rg -n "037-router-replay-surface-slice-sync|038-scenario-loader-code-surface-sync" .opencode/specs --glob '*.md' --glob '*.json'` to confirm the two named inbound references are the only two, or surface any additional ones as a follow-up rather than silently expanding scope.
- Consumers of changed symbols: not applicable beyond the two named inbound references; no code imports these spec-folder identifiers.
- Matrix axes: two folders (`036`, `037`), two file types per folder (`description.json`, `graph-metadata.json`), five internal docs per folder, two inbound reference lines.
- Algorithm invariant: never touch the global `.opencode/specs/descriptions.json`; never touch a file outside the two named folders and the two named inbound lines.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm via `git status` that neither `036` nor `037` is being actively edited by a concurrent session
- [ ] Confirm the exact old-slug strings present in each folder's `description.json`/`graph-metadata.json` before regenerating

### Phase 2: Core Implementation
- [ ] Regenerate `description.json` for `036-router-replay-surface-slice-sync` against its new path
- [ ] Regenerate `description.json` for `037-scenario-loader-code-surface-sync` against its new path
- [ ] Regenerate `graph-metadata.json` for both folders against their new paths, verifying `status`/`importance_tier` are preserved
- [ ] Fix every internal reference to the old slug inside each folder's own five docs
- [ ] Repoint the two confirmed inbound references in `124-sk-code-parent/021` and `124-sk-code-parent/022`

### Phase 3: Verification
- [ ] Grep both folders for their own old slug and confirm zero matches
- [ ] Grep the two inbound files for the old slugs and confirm zero matches
- [ ] Confirm `.opencode/specs/descriptions.json` was not touched
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep verification | Zero remaining old-slug matches inside each folder and the two inbound files | `rg -n` |
| Manual | Regenerated JSON parses and carries the new path in every identifier field | JSON parse plus visual diff |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `generate-description.js` / `backfill-graph-metadata.js` | Internal | Green | No independent regeneration mechanism exists; identifiers would need hand-editing instead |
| Concurrent-session dirty set (git status) | Internal | Yellow | Both folders are untracked; a blind write could collide with in-flight work |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Regeneration resets `status`/`importance_tier` fields that were already correct, or an inbound reference edit breaks the surrounding markdown.
- **Procedure**: Both folders are untracked, so `git status` alone shows every changed file; discard and redo the specific file rather than a broad revert. For the two inbound reference edits, `git diff` the two named files and revert the specific line if needed.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
