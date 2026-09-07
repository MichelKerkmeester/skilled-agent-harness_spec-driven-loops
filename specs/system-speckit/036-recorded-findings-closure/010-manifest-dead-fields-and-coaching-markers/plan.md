---
title: "Implementation Plan: Phase 10: manifest-dead-fields-and-coaching-markers"
description: "Delete the two unread manifest fields from every documents[] entry, delete the two unread scaffold marker blocks from create.sh and update the two maintainer docs that described them."
trigger_phrases:
  - "manifest dead field plan"
  - "scaffold marker removal plan"
  - "extension guide field update"
  - "create sh block deletion"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: manifest-dead-fields-and-coaching-markers

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON manifest, bash scaffolder |
| **Framework** | system-spec-kit's `create.sh` scaffolder and `spec-kit-docs.json` template manifest |
| **Storage** | None |
| **Testing** | `scaffold-golden-snapshots.vitest.ts`, `template-version-parity.vitest.ts`, `level-contract-resolver.vitest.ts` |

### Overview
`creationTrigger` and `absenceBehavior` are deleted from every one of the 16 `documents[]` entries in `spec-kit-docs.json`, and the `SCAFFOLD_VALIDATION_COUNTS` and `SCAFFOLD_AI_PROTOCOL_MARKERS` append blocks are deleted from `create.sh` along with their guard conditions. `EXTENSION-GUIDE.md`'s maintainer checklist is edited in the same change so it stops instructing a future editor to add the removed fields.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Delete-and-verify: remove the dead keys and the dead heredoc blocks, then run the three named suites plus a throwaway scaffold to confirm nothing regressed.

### Key Components
- **Manifest edit**: strips two keys from 16 JSON objects in `spec-kit-docs.json`.
- **Scaffolder edit**: strips two `cat >> ... <<'EOF'` blocks and their `grep -q` guard conditions from `create.sh`.
- **Doc edit**: `EXTENSION-GUIDE.md` §1's field-by-field description loses the two rows describing the removed fields.

### Data Flow
The manifest is read by the scaffolder (for `template`/`owner`) and the validator (for the `levels` rows, never `documents[]`). Removing the two fields changes what a reader could theoretically read but not what either reader actually reads today, so the data flow through both consumers is unchanged. `create.sh`'s two append blocks currently write into freshly scaffolded `spec.md`/`plan.md` files and nothing downstream reads them back. Removing the write means the freshly scaffolded file is shorter, with no consumer left unfed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `spec-kit-docs.json` `documents[*]` | Descriptive index only, per `EXTENSION-GUIDE.md:33-36` | update | `grep -c "creationTrigger\|absenceBehavior" spec-kit-docs.json` returns 0 |
| `create.sh`'s scaffold function | Appends two coaching-marker blocks nothing reads | update | A throwaway `create.sh` scaffold run shows neither marker string in the output `spec.md`/`plan.md` |
| `EXTENSION-GUIDE.md` §1 | Instructs a maintainer to set the two fields on a new document type | update | The two field-description lines are gone, and the maintainer checklist still parses as valid instructions for the remaining fields |
| `README.md`'s manifest description line | General one-line summary of `spec-kit-docs.json`'s purpose | not a consumer of the two fields by name | line re-read after the edit, changed only if it turns out to cite them |
| `scaffold-golden-snapshots.vitest.ts`, `template-version-parity.vitest.ts`, `level-contract-resolver.vitest.ts` | Assert scaffolder and manifest behavior | unchanged | all three pass before and after, since none references either field or marker |

Required inventories:
- Same-class producers: `rg -n 'creationTrigger|absenceBehavior' .opencode/skills/system-spec-kit/templates/spec-kit-docs.json`.
- Consumers of changed symbols: `rg -n 'creationTrigger|absenceBehavior|SCAFFOLD_VALIDATION_COUNTS|SCAFFOLD_AI_PROTOCOL_MARKERS' .opencode/skills/system-spec-kit --glob '*.ts' --glob '*.js' --glob '*.mjs' --glob '*.cjs' --glob '*.sh' --glob '*.py' --glob '*.md'`.
- Matrix axes: field (creationTrigger, absenceBehavior) x document (16 entries) and marker (SCAFFOLD_VALIDATION_COUNTS, SCAFFOLD_AI_PROTOCOL_MARKERS) x level (1-3+).
- Algorithm invariant: not applicable - no parser or resolver logic changes, since this is a manifest-key and heredoc-block deletion.
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
| Unit | None new - deletion of unread fields and blocks, no new behavior to unit test | n/a |
| Integration | Scaffold and template-manifest behavior | `scaffold-golden-snapshots.vitest.ts`, `template-version-parity.vitest.ts`, `level-contract-resolver.vitest.ts` |
| Manual | A throwaway `create.sh` scaffold run at Level 3+ to confirm neither marker block appears in the output | direct file read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `spec-kit-docs.json`'s `levels` rows (the actual authority, per 035 child 010's D1) | Internal | Green | Not touched by this phase, only the descriptive `documents[]` index changes |
| `create.sh`'s scaffold function | Internal | Green | The two append blocks are self-contained `cat >> ... <<'EOF'` guards with no other caller |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: one of the three named test suites fails after the removal, or a throwaway scaffold run shows an unexpected downstream reference to a removed field or marker.
- **Procedure**: `git revert` the commit, and the manifest and `create.sh` return to their pre-change state with both fields and both marker blocks intact.
<!-- /ANCHOR:rollback -->

---


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
| Setup | Low | Confirm the 32 field occurrences and the two block line ranges against the current files |
| Core Implementation | Low | Delete the two JSON keys from 16 entries, delete two heredoc blocks and their guards, edit the extension guide |
| Verification | Low | Run the three named suites and one throwaway scaffold |
| **Total** | | **Under one session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) - not applicable, git history is the backup
- [ ] Feature flag configured - not applicable
- [ ] Monitoring alerts set - not applicable

### Rollback Procedure
1. Stop before committing if the throwaway scaffold run shows an unexpected reference.
2. `git revert` the commit.
3. Re-run the three named suites to confirm the pre-change state is restored.
4. Not user-facing, so no stakeholder notification is needed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
