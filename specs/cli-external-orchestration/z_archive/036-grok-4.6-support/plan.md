---
title: "Implementation Plan: Grok 4.6 Support for cli-cursor & cli-devin"
description: "Live-verify the Grok 4.6 roster on both CLIs, add it to the enforced allowlists and their tests alongside the still-supported Grok 4.5, sort every touched roster alphabetically, then rewrite every skill doc and cross-reference that named Grok."
trigger_phrases:
  - "implementation"
  - "plan"
  - "grok 4.6"
  - "cli-cursor cli-devin roster"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Grok 4.6 Support for cli-cursor & cli-devin

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`executor-config.ts`), CommonJS (`fanout-run.cjs`), Markdown (skill docs) |
| **Framework** | deep-loop fan-out runtime (`system-deep-loop/runtime`) |
| **Storage** | None — in-memory allowlist arrays |
| **Testing** | vitest (`executor-config.vitest.ts`, `fanout-run.vitest.ts`) |

### Overview
Confirm Grok 4.6's exact model-id shape live on both `cursor-agent` and `devin`, dispatch-test the new ids end to end, then add them to the two enforced allowlists (and their hand-duplicated mirrors) alongside the still-supported Grok 4.5, update the vitest coverage, sort every touched roster table and array alphabetically, and rewrite every doc reference across both skills plus three cross-reference files in sibling skills. An operator follow-up after the first pass ("make sure grok 4.5 is also still in the roster" + "sort the models alphabetically") corrected an initial retire-and-replace implementation into this additive one — see ADR-002.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Live roster confirmed on both CLIs before any file changed (`cursor-agent --list-models`, `devin models list`)
- [x] Tier-width decision made explicitly (ADR-001) rather than assumed
- [x] Full inventory of files naming Grok 4.5 taken via repo-wide grep, partitioned into live-surface (in scope) vs. historical (out of scope)

### Definition of Done
- [x] Both enforced allowlists and their mirrors updated and in sync
- [x] `npm test` (188 tests) and `npm run typecheck` pass clean
- [x] Every live-surface doc updated; historical records and the audit log left untouched
- [x] New changelog entries added (not rewrites of history)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two enforcement points, hand-duplicated by design (documented convention, not accidental drift): `executor-config.ts` is the TypeScript source of truth; `fanout-run.cjs` hand-duplicates the same arrays as plain JS literals so the synchronous dispatch-builder functions never need an async import. Both are covered by dedicated vitest assertions that pin the exact id set.

### Key Components
- **`CURSOR_SUPPORTED_MODELS` / `CURSOR_ALLOWED_MODELS`**: the Cursor allowlist and its mirror.
- **`DEVIN_SUPPORTED_MODELS` / `DEVIN_ALLOWED_MODELS`**: the Devin allowlist and its mirror.
- **`isCursorModelAllowed` / `isDevinModelAllowed`**: fail-closed membership checks called before any command is constructed.
- **`providers-and-models.md`** (per skill): the documented single-source catalog each skill's other docs point back to.

### Data Flow
A caller (or the deep-loop fan-out runtime) supplies a `--model` id → `isCursorModelAllowed`/`isDevinModelAllowed` checks it against the array → an unlisted id throws before any `cursor-agent`/`devin` process is spawned → an allowed id flows into `buildCursorLineageCommand`/`buildDevinLineageCommand`, which constructs the real CLI invocation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `executor-config.ts` (`CURSOR_SUPPORTED_MODELS`, `DEVIN_SUPPORTED_MODELS`) | Enforcement source of truth | Update | `rg -n "grok-4" executor-config.ts` shows only 4.6 ids |
| `fanout-run.cjs` (`CURSOR_ALLOWED_MODELS`, `DEVIN_ALLOWED_MODELS`) | Hand-duplicated mirror | Update | `rg -n "grok-4" fanout-run.cjs` shows only 4.6 ids |
| `executor-config.vitest.ts` | Guard test for Cursor allowlist | Update | `npm test -- executor-config.vitest.ts` green |
| `fanout-run.vitest.ts` | Guard test for both adapters | Update | `npm test -- fanout-run.vitest.ts` green |
| cli-cursor doc set (9 files) | Documents the allowlist to callers | Update | `rg -rn "grok.*4\.5" cli-cursor/` returns only intentional migration-note prose + historical changelog |
| cli-devin doc set (4 files) | Documents the curated family to callers | Update | `rg -rn "grok.*4\.5" cli-devin/` returns only intentional migration-note prose + historical changelog |
| cli-pi, shared, sk-prompt-models cross-refs (3 files) | Point at cli-cursor/cli-devin examples | Update | `rg -rn "grok.*4\.5" <each>` clean |
| Historical `specs/` evidence and `.opencode/logs/cli-dispatch-audit.log` | Records of past runs | Not a consumer — left unchanged | Confirmed by directory inventory in spec.md §3 |

Required inventories:
- Same-class producers: `rg -rniE "grok[ _-]?4\.5|grok-4-5|grok45" .opencode/` (ran before and after the edit pass).
- Consumers of the allowlist constants: `rg -n "CURSOR_SUPPORTED_MODELS|CURSOR_ALLOWED_MODELS|DEVIN_SUPPORTED_MODELS|DEVIN_ALLOWED_MODELS" .opencode/skills/system-deep-loop` (confirms `dispatch-model.cjs` has no independent list — it delegates to `fanout-run.cjs`'s `buildLineageCommand`).
- Matrix axes: platform (Cursor / Devin) × tier (low/medium/high/xhigh) × fast-variant (Cursor only) — 8 Cursor ids, 4 Devin uids, all individually confirmed live.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Live Verification (before any file changed)
- [x] `cursor-agent --list-models` / `devin models list` — confirm 4.6 exists and enumerate every id
- [x] Resolve the tier-width fork with the operator (ADR-001)
- [x] Dispatch-test `cursor-grok-4.6-{high,xhigh}` and `grok-4-6-{high,xhigh}` end to end
- [x] Re-confirm the `model[effort=...]` bracket rejection still holds for the new id

### Phase 2: Runtime Swap
- [x] `executor-config.ts` — add Grok 4.6 to both allowlists alongside Grok 4.5, resort alphabetically, update doc comments with the live-confirmation date
- [x] `fanout-run.cjs` — mirror the same addition and resort
- [x] `executor-config.vitest.ts` / `fanout-run.vitest.ts` — update fixtures
- [x] `npm test` + `npm run typecheck` in `system-deep-loop/runtime`

### Phase 3: Documentation Sweep
- [x] cli-cursor: SKILL.md, README.md, 4 references, 2 assets, 1 playbook
- [x] cli-devin: SKILL.md, README.md, 2 references
- [x] Cross-references: cli-pi, shared/smart-routing, sk-prompt-models
- [x] New changelog entries (v1.3.0.0) in both skills
- [x] Version-field bumps across every edited doc

### Phase 4: Verification
- [x] Repo-wide grep sweep confirming only historical/intentional mentions remain
- [x] Targeted `system-deep-loop/runtime` test suite rerun (exactly the files this packet touched); broader whole-package `npm test` attempted and found pre-existing unrelated failures in other subsystems, confirmed via `git status` to be untouched by this packet
- [B] `validate.sh` on this spec folder — blocked by a pre-existing broken `mcp-server` dependency install (unrelated to this packet); substituted a manual structural check

### Phase 5: Correction (operator follow-up, after Phase 4)
- [x] Operator: "make sure grok 4.5 is also still in the roster btw" — Grok 4.5 restored to both allowlists and independently re-dispatch-tested live (ADR-002)
- [x] Operator: "sort the models alphabetically in any table or roster layout in the files" — every touched allowlist array and doc roster table resorted alphabetically (ADR-002)
- [x] `executor-config.ts` / `fanout-run.cjs` — Grok 4.5 ids re-added and both arrays resorted
- [x] `executor-config.vitest.ts` / `fanout-run.vitest.ts` — fixtures updated to cover both Grok versions
- [x] All 13 cli-cursor/cli-devin docs + 3 cross-reference docs revised to cover both Grok versions with alphabetized rosters
- [x] `changelog/v1.3.0.0.md` (both skills) rewritten in place to describe an addition, not a swap
- [x] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` (this packet) revised to the corrected final scope
- [x] Targeted test suite + typecheck rerun after the correction — green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Allowlist membership, command construction | vitest (`executor-config.vitest.ts`, `fanout-run.vitest.ts`) |
| Type | `executor-config.ts` const-assertion types | `tsc --noEmit` |
| Live/Manual | Actual model dispatch through both CLIs | `cursor-agent -p --model ...`, `devin -p --model ...` from a trusted scratch workspace |
| Regression sweep | No stale live-surface mention remains | `rg -rniE "grok[ _-]?4\.5\|grok-4-5\|grok45"` across `.opencode/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cursor-agent` CLI, authenticated | External | Green — confirmed 2026.08.11-e8db854 | Cannot live-verify Cursor ids; would have to defer to doc-only claims (rejected as insufficient) |
| `devin` CLI, authenticated | External | Green — confirmed 3000.4.16 | Cannot live-verify Devin ids |
| `system-deep-loop/runtime` vitest + tsc toolchain | Internal | Green | Cannot prove the code change didn't break anything |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Grok 4.6 ids stop resolving on either CLI, or the addition surfaces a regression the test suite didn't catch.
- **Procedure**: Revert the two allowlist arrays (and their mirrors) to the 4.5 id sets committed in this packet's diff, revert the doc/test edits alongside them (all in one commit per the changelog entries), and re-run `npm test` + `npm run typecheck` to confirm the reverted state is green.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Live Verification) ──► Phase 2 (Runtime Swap) ──► Phase 3 (Docs) ──► Phase 4 (Verify) ──► Phase 5 (Correction)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Live Verification | None | Runtime Swap |
| Runtime Swap | Live Verification | Documentation Sweep |
| Documentation Sweep | Runtime Swap | Verification |
| Verification | Documentation Sweep | Correction |
| Correction | Verification, operator follow-up | None |
<!-- /ANCHOR:phase-deps -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` — ADR-001 (tier-width: full 4.6 adoption including `xhigh`) and ADR-002 (keep Grok 4.5 alongside 4.6, and sort every touched roster alphabetically — the operator's Phase 5 correction).

---

<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Sequential phase dependency graph (no parallel workstreams — single-session change)
-->
