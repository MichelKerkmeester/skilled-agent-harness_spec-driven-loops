---
title: "Implementation Plan: Migration Tooling & Dry-Run [133/002/plan]"
description: "DeepSeek authors a deterministic per-tree de-number + reference-rewrite tool with dry-run manifests and collision hard-abort; a second model adversarially reviews; the two known collisions are resolved before any bulk migration."
trigger_phrases:
  - "133 phase 002 plan"
  - "denumber tool algorithm"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/108-catalog-playbook-snippet-denumbering/002-migration-tooling-and-dry-run"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 002 plan during 133 scaffold"
    next_safe_action: "On approval, dispatch DeepSeek to author the tool"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Migration Tooling & Dry-Run

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node `.cjs` or POSIX `sh` + `git mv` (deterministic) |
| **Executor** | cli-opencode → DeepSeek-v4-pro (author, RCAF) + MiMo or 2nd DeepSeek (adversarial review) |
| **Location** | `133-.../scratch/` (packet-local tooling) |
| **Testing** | Fixture trees + dry-run against 2–3 real trees incl. the collision tree |

### Overview
DeepSeek authors a per-tree migration tool. It is deterministic (no model in the hot path), defaults to `--dry-run`, hard-aborts on collisions, and rewrites all four reference classes. A second model adversarially reviews the algorithm against the edge-case fixtures. The 2 known collisions get a resolution decision recorded here and applied in phase 003.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 convention shipped (target shape known)
- [ ] D1 = "script" confirmed (else this phase becomes a manual rename+rewrite checklist)
- [ ] D4 collision policy confirmed

### Definition of Done
- [ ] Dry-run on ≥1 real tree produces a correct, reviewed manifest
- [ ] Collision hard-abort demonstrated on `16--tooling-and-scripts`
- [ ] DeepSeek review signs off on edge-case coverage
- [ ] 2 collisions have approved new slugs (or merge decision)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Tool contract
```
denumber-snippets --tree <catalog-or-playbook-dir> [--referrers <list-file>] [--dry-run|--apply]

For the one tree:
  1. enumerate files matching  ^[0-9]+-<slug>.md  under  NN--*/  category dirs
  2. build rename map: src = NN--cat/NNN-slug.md  ->  dst = NN--cat/slug.md   (strip ^[0-9]+- from basename only)
  3. COLLISION GATE: if two src map to same dst, OR dst already exists  ->  write collision-report, exit non-zero (NO writes)
  4. build reference map from (src-relpath -> dst-relpath) and (src-basename -> dst-basename within same dir)
  5. rewrite references in: each renamed file (self SOURCE METADATA + neighbor Related refs),
     the tree root doc (feature_catalog.md / manual_testing_playbook.md), and each --referrers entry
       - match is anchored on `.md`; category-dir-qualified for cross-file links; bare-basename only for same-dir neighbors
       - never match Feature IDs (`M-219`, `EX-001`) — they have a letter prefix and no `.md`
  6. apply renames via `git mv` (history-preserving); stage ONLY touched paths (never `git add -A`)
  7. emit manifests: rename-manifest.json, reference-edit-manifest.json, collision-report.json
```

### Why deterministic, not model-in-loop
1,531 renames × ~2,275 link edits demands repeatability. The model's value is authoring + reviewing the algorithm and resolving semantic collisions — not hand-editing each file. (If D1 chooses pure-agent hand-edit, the tool becomes a per-tree checklist the agent follows instead.)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Snippet file basename | `NNN-slug.md` | strip `^[0-9]+-` | fixture: digits gone, slug intact |
| `SOURCE METADATA` self-path | `NN--cat/NNN-slug.md` | de-number | dry-run shows the edit |
| `Related references` neighbor links | `[NNN-bar.md](NNN-bar.md)` | de-number text+target | dry-run shows both |
| Root doc links | `[M-219](16--cat/219-slug.md)` | de-number URL only | Feature ID `M-219` unchanged |
| External referrers (changelogs/refs) | `.../16--cat/219-slug.md` | de-number | provided via `--referrers` |

Required inventories:
- Per-tree rename set: `rg --files <tree> | rg '/[0-9]{2,3}-[a-z][^/]*\.md$'`.
- Per-tree referrers: `rg -l '<tree-relative numbered paths>' .opencode/skills` (+ active changelogs/references).
- Invariant: `git mv` count == rename-manifest length == (numbered files before − numbered files after).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Author the tool (DeepSeek)
- [ ] Implement rename + collision gate + reference rewrite + manifests + dry-run default

### Phase 2: Fixtures + adversarial review
- [ ] Build edge-case fixtures (`./`/`../`, `#anchor`, code-fence, substring slug, Feature ID)
- [ ] Second model reviews algorithm vs fixtures; fix gaps

### Phase 3: Real dry-run + collision resolution
- [ ] Dry-run on system-code-graph (small) + the collision tree
- [ ] Inspect the 4 collision files; decide merge vs distinct slugs; record in decision note
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/fixture | Rename + rewrite edge cases | scratch fixtures + tool self-check |
| Integration | Dry-run on real small tree | `denumber-snippets --tree system-code-graph/... --dry-run` |
| Negative | Collision abort | `--tree system-spec-kit/.../16--tooling-and-scripts` → non-zero |
| Review | Algorithm correctness | DeepSeek adversarial read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 convention | Internal | Pending | Defines target shape |
| Decision D1 (script) | Internal | Pending | Determines if this phase builds a script |
| Decision D4 (collisions) | Internal | Pending | Sets resolution policy |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: dry-run manifest wrong, or review finds an uncovered edge case.
- **Procedure**: tool is dry-run by default — nothing applied. Fix the tool, re-run dry-run. No repo state to revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Author tool ──► Fixtures + review ──► Real dry-run + collision resolution
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Author tool | Phase 001 | Review |
| Fixtures + review | Author tool | Dry-run |
| Dry-run + collisions | Review | Phases 003–005 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Author tool | High | 1–2 DeepSeek dispatches |
| Fixtures + review | Med | 1 review dispatch |
| Dry-run + collisions | Med | local runs + 1 inspection dispatch |
| **Total** | | **~4 dispatches** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Dispatch brief invariants (cli-opencode)
- DeepSeek author: `--model opencode-go/deepseek-v4-pro --variant high --format json --dir <repo-root>`; RCAF framing; no `--agent`; `</dev/null`.
- `Spec folder: .../133-.../002-migration-tooling-and-dry-run (pre-approved, skip Gate 3)`.
- `ALLOWED WRITE PATHS: 133-.../scratch/** only.` `BANNED: any write to .opencode/skills/** target trees in this phase.`
- Feed DeepSeek the algorithm spec + edge-case list (NOT whole trees — 64k context).

### Rollback Procedure
1. Dry-run default means no target writes to revert.
2. Discard scratch tool, re-author with corrected spec.
<!-- /ANCHOR:enhanced-rollback -->
