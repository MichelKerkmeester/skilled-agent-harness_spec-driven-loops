---
title: "Implementation Plan: Code README Truth And Missing Orientation"
description: "Plan for child 002: instrument a referenced-path resolution gate and a derived-count gate, then fix broken content, stale inventories and missing orientation across 20 findings in three waves before verifying."
trigger_phrases:
  - "code readme truth plan"
  - "readme missing orientation plan"
importance_tier: "normal"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation"
    last_updated_at: "2026-08-02T11:40:04Z"
    last_updated_by: "build-leaf"
    recent_action: "Executed the two gates and completed the three repair waves"
    next_safe_action: "Review receipts and hand off any structural follow-up to 003"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation/spec.md"
      - ".opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation/plan.md"
      - ".opencode/specs/sk-doc/022-code-readme-coverage/002-code-readme-truth-and-missing-orientation/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-002-code-readme-truth-and-missing-orientation"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

# Implementation Plan: Code README Truth And Missing Orientation

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Change class** | Documentation content, plus two small gate scripts |
| **Surfaces** | 17 existing READMEs, 3 new READMEs, 3 parent README inventory rows |
| **Gates** | Referenced-path resolution, derived counts, command execution, broken symlinks |
| **Blocked work** | None; the upstream ruling and validator mode are available |

### Overview

Two gates are built first, because they are what makes the fix durable and what proves the fix landed. The referenced-path resolution script extracts every inline-code filename, relative link and command path from a README and asserts each resolves from that README's own location. The derived-count gate forbids retyped literals: a stated count must be derivable and asserted, or replaced by a non-numeric label.

Then the files are repaired in three waves. Wave 1 is the four P1 broken-content files, because they are the ones that make a reader act wrongly. Wave 2 is the twelve stale-inventory files; the thirteenth candidate was refuted and left untouched. Wave 3 is the three new target READMEs plus the minimal missing parent orientation.

Every claim is re-derived from source. Editing the old text is what produced the drift in the first place — including in two of the research findings themselves.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All scoped findings confirmed, drifted or refuted against HEAD with source evidence
- [x] The two known magnitude corrections applied (`RA-004-02` → 19 TypeScript suites)
- [x] Resolution and derived-count gate scripts runnable

### Definition of Done
- [x] Zero unresolved references across the 20-file verification set
- [x] Zero retyped count literals
- [x] Every documented command executed green or explicitly marked as an example
- [x] Broken-symlink find result is documented as unavailable for the broken target
- [x] The three new target READMEs pass `001`'s code-folder mode
- [x] Five-file source audit recorded
- [x] `validate.sh --strict` → Errors: 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### The two gates

| Gate | Input | Assertion | Why it exists |
|------|-------|-----------|---------------|
| Referenced-path resolution | A README file | Every inline-code filename, relative link and command path resolves from the file's own directory | This single check would have caught all four P1s |
| Derived count | A README file plus its directory | No numeric file/suite count appears as a literal; stated counts match a derived count | Both known magnitude errors exist because counts were retyped |

### Repair waves

| Wave | Class | Files | Gated on |
|------|-------|-------|----------|
| 1 | (a) broken content | 4 P1 files | Nothing |
| 2 | (b) stale inventory | 12 files | Nothing |
| 3 | (c) missing orientation | 3 new files + 1 new parent + 2 parent rows | `001` ruling and validator mode |

### Authoring rule

For each file: read the directory and the source, write the claim from what is there, then run both gates. The prior README text is evidence of intent, never evidence of fact.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm and instrument
- [x] Re-verify the scoped findings against HEAD
- [x] Build the referenced-path resolution script
- [x] Build the derived-count gate
- [x] Capture the pre-fix gate output over all 20 files as the baseline

### Phase 2: Wave 1 — broken content (4 P1 files)
- [x] `install-scripts/README.md` including the broken symlink disposition
- [x] `scripts/git-hooks/tests/README.md` with its commands actually executed
- [x] `hooks/git/README.md` link targets
- [x] `.github/workflows/README.md` — remove the absent workflow, document the three live guards

### Phase 3: Wave 2 — stale inventories (12 files)
- [x] The four `system-deep-loop` scripts and tests READMEs
- [x] The three `sk-create-skill/scripts` READMEs
- [x] The two `system-skill-advisor` skill-graph READMEs
- [x] `plugins`, `plugins/tests`, and `scripts` READMEs; `commands/doctor/scripts` was refuted and left unchanged

### Phase 4: Wave 3 — missing orientation
- [x] `sk-design/shared/README.md` minimal immediate-child orientation and `authored-brand/README.md`
- [x] `system-spec-kit/scripts/runtime-mirrors/README.md`
- [x] `system-skill-advisor/mcp-server/scripts/command-bridges/README.md`
- [x] Parent inventory rows for the two existing parents

### Phase 5: Verification
- [x] Both gates green over the full 20-file verification set
- [x] Command execution evidence recorded
- [x] Five-file source audit recorded
- [x] `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method | Target |
|-----------|-------|--------|--------|
| Resolution gate | All 20 files | Script | Zero unresolved |
| Derived count | All files stating a count | Script | Zero retyped literals |
| Command execution | `git-hooks/tests` + 3 benchmark test READMEs | Actually run them | Green, or marked example |
| Symlink integrity | `install-guides/install-scripts` | `find -type l ! -exec test -e {} \;` | Empty |
| Validator mode | The 3 new READMEs | `001`'s code-folder mode | Zero blocking |
| Sample audit | 5 of 20 | Second reader vs source | All verdicts match |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001` tree ruling | Internal | Available | Shape-conditional tree/inventory ruling used |
| `001` code-folder validator mode | Internal | Available | Four authored orientation READMEs validated |
| Source directories being repaired | Internal | Available | Claims are derived from them |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a repaired README is found to be wrong in a way the gates did not catch.
- **Procedure**: revert the per-file commit. Files are independent; there is no cross-file state.
- **New files**: deleting the three added READMEs and their parent rows fully reverses wave 3.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (confirm + gates) ──> Phase 2 (wave 1) ──┐
                          └──> Phase 3 (wave 2) ──┼──> Phase 5 (verify)
                               Phase 4 (wave 3) ──┘
                                    ▲
                          001 ruling + validator mode
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Confirm + gates | None | All |
| 2 Wave 1 | 1 | 5 |
| 3 Wave 2 | 1 | 5 |
| 4 Wave 3 | 1, `001` | 5 |
| 5 Verification | 2, 3, 4 | `003` (soft) |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation checklist
- [x] Pre-fix gate output captured for all 20 files as the baseline delta reference
- [ ] Each file's repair is its own commit; this build leaf intentionally made no commits

### Rollback procedure
1. Identify the offending file and revert its commit.
2. Re-run both gates over the remaining set; they must stay green.
3. Re-open the finding ID rather than patching over the revert.
<!-- /ANCHOR:l2-rollback -->
