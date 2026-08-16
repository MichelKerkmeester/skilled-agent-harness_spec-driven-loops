---
title: "Implementation Summary: Playbook Inventory Reconciliation"
description: "Reconciled the manual-testing-playbook table + inventory test to the real 47 kebab-named scenario files — 43 stale links corrected, one stale dir glob fixed, no assertion loosened, test green."
trigger_phrases:
  - "playbook inventory summary"
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
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Playbook Inventory Reconciliation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-playbook-inventory-reconciliation |
| **Completed** | 2026-08-16 |
| **Level** | 1 |
| **Executor** | claude-code (direct; the delegated DeepSeek-Flash pass failed on `402 Insufficient Balance`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Reconciled the Skill Advisor manual-testing-playbook so its inventory test passes because the doc matches the real corpus — not by loosening the test. The kebab-migration had left the test's `/^\d{2}--/` directory glob matching **zero** dirs (so the live-file list came back empty) and left 43 of the 47 table links using a `../manual-testing-playbook/<cat>/<file>` round-trip path that only resolved by coincidence and never equalled the on-disk `<cat>/<file>` path.

### Files Changed (2)

| File | Change | Detail |
|------|--------|--------|
| `manual-testing-playbook/manual-testing-playbook.md` | 43 link corrections | `](../manual-testing-playbook/<cat>/<file>)` → `](<cat>/<file>)`; the 4 already-correct direct links (LC-002, SC-002, SC-003, SC-005) left untouched |
| `mcp-server/tests/manual-testing-playbook.vitest.ts` | 1 line | directory glob `/^\d{2}--/` → `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` (kebab category dirs) |

The 47 linked rows map one-to-one to the 47 real files. `CL-004` remains an unlinked "not yet authored" placeholder — it has no file and no markdown link, so it is invisible to the test and is not a fabrication.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The task was first dispatched to DeepSeek V4 Flash (cli-opencode) in an isolated worktree with node_modules symlinked in; it died on `402 Insufficient Balance` before touching either target file, and its only side effect — an npm run that wiped the symlinked node_modules — stayed contained to the throwaway worktree. Rather than escalate to a paid model for a bounded documentation reconciliation, the parent did it directly and carefully: enumerated the ground-truth corpus, mapped all 47 rows to real files before editing, applied a `replace_all` for the 43 stale link prefixes plus a one-line glob fix, then restored the wiped node_modules with `npm ci` and verified against the real toolchain (inventory test green, `tsc` exit 0). The strict `rows.map(relativePath).sort() === files` equality passing is the proof the doc now matches the corpus one-to-one.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Do it directly, not re-delegate | Flash failed on balance; a bounded doc reconciliation does not warrant a paid model, and correctness here needs careful one-to-one mapping |
| Correct links to the direct `<cat>/<file>` form | Matches the 4 already-correct rows and the on-disk relative path; the `../manual-testing-playbook/` prefix was a wrong link that only round-tripped by luck |
| Generalize the dir glob to kebab-case, not hardcode 9 names | Faithful modern equivalent of the old `\d{2}--` convention; the row↔file equality is the backstop against over-capture |
| Leave `CL-004` untouched | It is an honest unlinked "not yet authored" placeholder; removing/renumbering would exceed scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Notes |
|-------|--------|-------|
| Inventory test | Pass | `vitest run tests/manual-testing-playbook.vitest.ts` → 1 passed |
| Typecheck | Pass | `tsc --noEmit --composite false -p tsconfig.build.json` exit 0 |
| Diff scope | Pass | doc = 43↔43 link-prefix swaps; test = one regex line; no `.skip`/removed assertion/lowered count |
| One-to-one mapping | Pass | 47 linked rows ↔ 47 real files; the strict `rows == files` equality is green |
| node_modules repair | Pass | `mcp-server` (227 pkgs) + `system-spec-kit` (660 pkgs) restored via `npm ci`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`CL-004` stays as an unlinked placeholder.** Whether to author `004-opencode-hook-and-wrapper.md` or drop the row is a separate documentation decision, out of this packet's scope.
2. **Restored node_modules are `npm ci` from the committed lockfiles**, not a byte-for-byte copy of the pre-wipe trees; the manifests were git-clean, so this is the canonical install.
3. **This closes sibling packet 021's `manual-testing-playbook` residual** (which read "expects a stale 47-scenario layout, finds 0"); the other 021 residuals (advisor-validate corpus floor, cli-parity env, stress regressions) are unaffected and remain their owners' items.
<!-- /ANCHOR:limitations -->
