---
title: "Implementation Plan: Phase 8: review-research-scaffold-paths"
description: "Accept review and research in create.sh's --level flag, add the missing review-report template with both resolver entries, generalize the phase-only move step so path-typed core documents land at their manifest path, and cover both levels with a golden test."
trigger_phrases:
  - "review research scaffold plan"
  - "review report template technical approach"
  - "path typed document move"
  - "scaffold golden testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: review-research-scaffold-paths

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (`create.sh`, `template-utils.sh`), Node/TypeScript (`template-structure.js`, `inline-gate-renderer.ts`), vitest |
| **Framework** | None |
| **Testing** | `tests/scaffold-golden-snapshots.vitest.ts`, `test-upgrade-level.sh`, `validate.sh --strict` on the two new fixture outputs |

### Overview
The manifest and both resolvers already treat `review` and `research` as real levels. Only the CLI's own `--level` gate and one missing template stand between the manifest's contract and a working scaffold. The plan widens the accepted-level regex, adds `review-report.md.tmpl` beside its already-registered `review.spec.md.tmpl` sibling, and generalizes the phase-parent-only move step in `copy_templates_batch` into a general "move a rendered path-typed document to its manifest-declared subdirectory" step, since `research/research.md` and `review/review-report.md` are both path-typed the same way `phase-parent.spec.md` → `spec.md` was a rename. Two golden fixtures and two SKILL.md notes close the loop.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-completion, not a new contract: the manifest (`spec-kit-docs.json`) already declares `review` and `research` as levels with real `requiredCoreDocs`. Every change here brings the scaffolder's actual behavior to what the manifest already promises, the same shape `035-.../018-.../` used to fix the resolver mismatch this phase builds on.

### Key Components
- **`create.sh`'s `--level` gate**: `spec/create.sh:93` regex widened from `^(1|2|3|3\+|phase-parent)$` to also accept `review` and `research`
- **`review-report.md.tmpl`**: new file under `templates/packet-types/`, alongside `review.spec.md.tmpl`
- **Resolver entries**: `DOC_TEMPLATE_NAMES['review-report.md']` in the JS resolver, a `render_level == "review" && template_name == "review-report.md"` branch in `_manifest_template_path` mirroring the existing `spec.md` branch
- **Path-typed document move**: `copy_templates_batch`'s existing `if [[ "$render_level" == "phase" ... ]]; then mv ...; fi` special case generalized to `for doc_name in "${doc_names[@]}"; do [[ "$doc_name" == */* ]] && mv the flat-rendered file to "$dest_dir/$doc_name"; done`, reusing the batch's own `_ensure_dest_within_dir` containment check that already ran when the destination directory was created

### Data Flow
`create.sh --level review` → level regex accepts it → `scaffold_contract_docs` reads `requiredCoreDocs` (`spec.md`, `review/review-report.md`) → `copy_templates_batch` resolves each via `_manifest_template_path` → renderer writes flat basenames to `$dest_dir` → the new move step relocates `review-report.md` to `review/review-report.md` → `finalize_scaffold_templates` and metadata generation run as for any other level.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `spec/create.sh:93-95` | Rejects `review`/`research` at argument parse | update | `bash create.sh --level review ...` no longer exits with the rejection message |
| `templates/packet-types/review-report.md.tmpl` | Does not exist | create | resolver lookup returns a real file path that exists on disk |
| `utils/template-structure.js` `DOC_TEMPLATE_NAMES` | No `review-report.md` key | update | JS resolver test (if present) or direct `node -e` lookup returns the template path |
| `lib/template-utils.sh` `_manifest_template_path` | Review-case branch exists only for `spec.md` | update | bash resolver returns `review-report.md.tmpl` for `(review-report.md, review)` |
| `lib/template-utils.sh` `copy_templates_batch`'s move step | `mv` special-cased to `phase`'s `phase-parent.spec.md` → `spec.md` rename only | update (generalize) | `research/research.md` and `review/review-report.md` exist at their nested path after a scaffold, not flat at the root |
| `test-upgrade-level.sh`, the phase-parent golden snapshot | Exercises the one existing production move today | verify only, not a consumer requiring a code change | re-run to confirm the generalized move step does not regress the phase-parent case |
| `deep-review/SKILL.md`, `deep-research/SKILL.md` | Silent on why the loop writes its own files | update (one note each) | grep for the new note in both files |

Required inventories:
- Same-class producers: `grep -n "requiredCoreDocs" templates/spec-kit-docs.json` confirms `review/review-report.md` and `research/research.md` are the only two manifest entries carrying a `/` in a required core doc name today, so the move-step generalization has exactly two real callers plus the existing `phase` special case.
- Consumers of changed symbols: `grep -rn "DOC_TEMPLATE_NAMES\|_manifest_template_path\|copy_templates_batch"` across `runtime/cli` to confirm no other caller assumes the batch's current flat-only output.
- Matrix axes: level (`review`, `research`) by resolver (JS, bash) by document (`spec.md`, `review-report.md`/`research.md`). Every cell must resolve to an existing template file.
- Algorithm invariant: a rendered document is moved to its manifest-declared subdirectory if and only if its manifest name contains a `/`. A flat manifest name (`spec.md`, `plan.md`, ...) is left exactly where the renderer wrote it, unchanged from today's behavior.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Resolver lookups for `review-report.md` at the review level, in both the JS and bash resolver | node, bash |
| Integration | `tests/scaffold-golden-snapshots.vitest.ts` (new review and research fixtures), `test-upgrade-level.sh` (regression guard on the phase-parent move) | vitest, bash |
| Manual | `create.sh --level review` and `--level research` run against a temp path, output validated strict | `runtime/cli/spec/validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `035-.../018-.../` resolver fix for the review level's `spec.md` | Internal | Green, shipped | Without it, the review level's `spec.md` itself would not resolve, blocking this phase entirely |
| The manifest's existing `review`/`research` level entries | Internal | Green, already declared | This phase would have no contract to complete against |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `test-upgrade-level.sh` or the phase-parent golden snapshot regresses, or either new fixture fails `validate.sh --strict`
- **Procedure**: `git revert` the single commit. `--level review`/`research` return to being rejected and the move-step generalization reverts to the phase-only special case
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Confirm the manifest contract and the resolver fix status by direct read |
| Core Implementation | Med | Level gate, new template, two resolver entries, generalized move step |
| Verification | Med | Two golden fixtures, phase-parent regression check, strict validation on both new scaffolds |
| **Total** | | One CLI flag, one template, two resolver edits, one generalized move step |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not needed. Tracked in git history
- [x] Feature flag configured - none. The level gate change is unconditional
- [x] Monitoring alerts set - `test-upgrade-level.sh` and the phase-parent golden snapshot are the alerts

### Rollback Procedure
1. `git revert` the commit
2. Rerun `test-upgrade-level.sh` and the golden snapshot suite to confirm the phase-parent scaffold is unaffected
3. Confirm `create.sh --level review` returns to the pre-change rejection message

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
