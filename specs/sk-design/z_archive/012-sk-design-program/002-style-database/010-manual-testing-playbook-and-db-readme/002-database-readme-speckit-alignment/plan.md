---
title: "Implementation Plan: Expand styles/database/README.md to Spec-Kit Canon"
description: "Planning for expanding the styles/database/README.md stub into a sectioned README modeled on the spec-kit mcp-server/database exemplar. Documentation-only."
trigger_phrases:
  - "styles database readme plan"
  - "database folder readme sections"
  - "styles database readme exemplar mapping"
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/010-manual-testing-playbook-and-db-readme/002-database-readme-speckit-alignment"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "orchestrator"
    recent_action: "Authored L2 plan for database README"
    next_safe_action: "Re-verify tree then draft README"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/database/README.md"
      - ".opencode/skills/sk-design/styles/database/README.md"
      - ".opencode/skills/sk-design/styles/lib/database/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-009-002-db-readme-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Adopt all 8 exemplar sections or a trimmed subset."
    answered_questions: []
---
# Implementation Plan: Expand styles/database/README.md to Spec-Kit Canon

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Change class** | Documentation-only (single-file rewrite) |
| **Target** | `.opencode/skills/sk-design/styles/database/README.md` |
| **Exemplar** | `.opencode/skills/system-spec-kit/mcp-server/database/README.md` (8 sections) |
| **Source of truth** | Live `styles/database/` dir + `.gitignore` + `styles/lib/database/**` modules |
| **Validation** | `validate_document.py` + markdown link guard |

### Overview
Expand the 3-line `styles/database/README.md` stub into a sectioned README that mirrors the spec-kit database-folder exemplar. The README describes the directory's purpose (git-ignored mutable SQLite publication state for the opt-in persistent path), its position in the styles library, the tracked-vs-ignored contract, and how generations are produced and consumed — all grounded in real on-disk modules. No code, schema, `.gitignore`, or data change.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Stub content and `.gitignore` contract read from disk
- [x] Shape exemplar located (`mcp-server/database/README.md`)
- [x] Real producers/consumers enumerated under `styles/lib/database/` and `styles/lib/engine/`
- [x] Scope confirmed single-file, documentation-only

### Definition of Done
- [ ] README rewritten with exemplar-analogous sections
- [ ] Tracked-vs-ignored contract described exactly as on disk
- [ ] Every named module/path verified to exist
- [ ] Validation + markdown link guard clean


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Directory-guide README mirroring the spec-kit database-folder convention: numbered sections with code-fenced topology and tree, a key-files table, and a boundaries/flow narrative.

### Proposed Section Mapping (exemplar -> styles README)

| Exemplar Section | Styles README Content |
|------------------|-----------------------|
| 1. Overview | What `styles/database/` holds: git-ignored mutable SQLite publication state for the opt-in persistent path; a data directory, not a source module folder |
| 2. Architecture | Flow: styles library -> `lib/paths.mjs` path seam -> `database/` storage; adapter default `legacy` (flat files authoritative) |
| 3. Package Topology | Tracked files (`README.md`, `.gitignore`) vs generated/ignored SQLite generations |
| 4. Directory Tree | Code-fenced tree of what appears at runtime (generated generations); only two tracked files at rest |
| 5. Key Files | Table: `README.md`, `.gitignore`, and generated-artifact classes (marked generated) |
| 6. Boundaries and Flow | Who writes (`indexer.mjs`, `operator.mjs`, `vectors.mjs`), who reads (`retrieval.mjs`), schema owner (`schema.mjs`); persistent path off by default |
| 7. Validation | `validate_document.py` on the README; the tests live under `styles/tests/database/` |
| 8. Related | Links to `../lib/database/README.md`, `../lib/README.md`, `../tests/README.md` |

### Grounding Facts (verified on disk)
- `styles/database/.gitignore` = `*`, `!.gitignore`, `!README.md`.
- Producers/consumers under `styles/lib/database/`: `indexer.mjs`, `retrieval.mjs`, `operator.mjs`, `vectors.mjs`, `schema.mjs`, `generation-manifest.mjs`, `canonical.mjs`, `stage-telemetry.mjs`.
- Path seam: `styles/lib/paths.mjs`. Adapter: `styles/lib/engine/persistent-adapter.mjs` (default `legacy`).
- At authoring time `styles/database/` holds only `README.md` + `.gitignore` (no subdirectories to document).


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-verify the live `styles/database/` tree and `.gitignore` at execution
- [ ] Confirm the final section set (all 8 vs trimmed subset)

### Phase 2: Core Authoring
- [ ] Draft the sectioned README following the exemplar section mapping
- [ ] Ground every producer/consumer reference against `styles/lib/**`
- [ ] State the tracked-vs-ignored contract exactly

### Phase 3: Verification
- [ ] Run `validate_document.py` on the README
- [ ] Confirm markdown link guard clean (related links resolve)
- [ ] Confirm the diff is a single-file documentation change


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | README parses and is well-formed | `validate_document.py` |
| Links | Related links resolve | `check-markdown-links.cjs` CI guard + grep |
| Accuracy | Named paths/modules exist | `ls` / grep against `styles/lib/**`, `styles/database/` |
| Fidelity | Ignored/tracked statement matches `.gitignore` | Read `.gitignore` and compare |


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Exemplar README | Internal | Present | Cannot mirror the canonical shape |
| Live `styles/database/` + `.gitignore` | Internal | Present | Cannot describe real behavior |
| `styles/lib/database/**` modules | Internal | Present | Cannot cite real producers/consumers |
| Sibling child `001-playbook-realign-and-relocate` | Internal | Independent | None (disjoint scope) |


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: README misdescribes real behavior, names a non-existent path, or fails validation.
- **Procedure**: `git checkout -- .opencode/skills/sk-design/styles/database/README.md` restores the stub. Single-file markdown change; fully reversible.


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Core Authoring) ──> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core Authoring |
| Core Authoring | Setup | Verification |
| Verification | Core Authoring | None |


<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (re-verify tree + section set) | Low | 15 minutes |
| Core Authoring (sectioned README) | Low-Medium | 1-1.5 hours |
| Verification | Low | 20 minutes |
| **Total** | | **~1.5-2 hours** |


<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Original stub preserved in git history
- [ ] Feature flag configured (N/A - documentation change)
- [ ] Every named path re-verified before commit

### Rollback Procedure
1. **Restore stub**: `git checkout -- .opencode/skills/sk-design/styles/database/README.md`
2. **Verify**: markdown link guard passes on the restored tree

### Data Reversal
- **Has data migrations?** No — documentation-only.
- **Reversal procedure**: `git checkout` of the single README path.

<!-- /ANCHOR:l2-rollback -->
