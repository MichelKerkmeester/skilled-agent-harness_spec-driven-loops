---
title: "Implementation Plan: Playbook Inventory Reconciliation"
description: "Reconcile the manual-testing-playbook table and its inventory test to the real 47 kebab-named scenario files — correct the stale round-trip links and the one stale directory glob, no assertion loosened."
trigger_phrases:
  - "playbook inventory plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/022-playbook-inventory-reconciliation"
    last_updated_at: "2026-08-16T04:15:28Z"
    last_updated_by: "claude-code"
    recent_action: "Reconciled 43 stale round-trip links + the kebab dir glob; inventory test green, tsc exit 0"
    next_safe_action: "Commit the two-file reconciliation; land on v4 + main per operator gate"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Playbook Inventory Reconciliation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown doc + TypeScript inventory test |
| **Framework** | Vitest (default config) |
| **Storage** | On-disk scenario `.md` corpus (9 kebab category dirs, 47 files) |
| **Testing** | `vitest run tests/manual-testing-playbook.vitest.ts`, `tsc --noEmit` |

### Overview

After the kebab-migration renamed the scenario directories (`NN--name` → `scorer-fusion/`, `lifecycle-routing/`, …), the inventory test's `/^\d{2}--/` directory glob matched **zero** dirs and the root playbook table's links pointed at a stale round-trip path (`../manual-testing-playbook/<cat>/<file>`) that only resolved by coincidence. Reconcile the doc to the real files and correct the single stale test mechanic — never by loosening an assertion.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Ground-truth file inventory enumerated (47 files, 9 kebab categories)
- [x] Every table row mapped one-to-one to a real file before editing (47 linked rows ↔ 47 files)

### Definition of Done
- [x] Inventory test green because the doc matches reality; no assertion weakened (`rows.map(relativePath).sort() === files` preserved)
- [x] `tsc --noEmit` exit 0; `validate.sh --strict` clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Make the DOC match the FILES, then correct only the test's stale glob. The strict `rows.map(relativePath).sort() === files` equality is the load-bearing guard and stays intact — it is the proof the table matches the corpus one-to-one.

### Key Components

- **Root table** in `manual-testing-playbook.md` — 47 scenario rows, each a `[name](<category>/<file>)` link.
- **Inventory test** `manual-testing-playbook.vitest.ts` — enumerates the live corpus and asserts table↔file equality + `existsSync`.
- **Live corpus** — 47 `.md` files under 9 kebab category directories.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Ground truth
- [x] Enumerate the real scenario files; confirm 47 files / 9 kebab dirs / no depth-2 READMEs
- [x] Map every table row to a real file (47 linked rows ↔ 47 files, one-to-one)

### Phase 2: Reconcile
- [x] Correct the 43 stale round-trip links to the direct `<category>/<file>` form
- [x] Fix the test's one stale mechanic: the `/^\d{2}--/` directory glob → kebab-case

### Phase 3: Verify
- [x] Inventory test green; `tsc --noEmit` exit 0; diff is link-prefix + one regex only
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Behavioural | Inventory test green | `vitest run tests/manual-testing-playbook.vitest.ts` |
| Guard | No assertion loosened | line-by-line diff review (row↔file equality + `existsSync` preserved) |
| Structural | Packet conformance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Kebab-migrated scenario corpus | Internal | Green | Table would map to non-existent paths |
| Restored `mcp-server` / `system-spec-kit` node_modules | Internal | Green | Could not run vitest / tsc |
| Sibling packet 021 (named this residual) | Internal | Green | This packet closes 021's `manual-testing-playbook` residual |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a corrected link turns out to point at the wrong scenario file.
- **Procedure**: revert the two files (`git checkout -- manual-testing-playbook.md manual-testing-playbook.vitest.ts`); blast radius is exactly these two files, no source or other test touched.
<!-- /ANCHOR:rollback -->
