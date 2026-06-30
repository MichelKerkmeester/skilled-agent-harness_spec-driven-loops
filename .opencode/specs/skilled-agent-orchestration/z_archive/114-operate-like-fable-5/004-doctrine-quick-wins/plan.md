---
title: "Implementation Plan: Doctrine quick-wins: fix the AGENTS.md dead hook pointer plus a pointer-resolution check, add an efficiency doctrine spine, and a scar-tissue cold-successor handoff discipline [template:level_2/plan.md]"
description: "Repair the dead AGENTS.md hook pointer with a byte-identical CLAUDE.md edit, add a fail-loud check-doc-pointers.sh, plant a ten-line efficiency doctrine spine in §1 of both twins, and extend the handover template with a scar-tissue ledger and numbered cold-read order."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/004-doctrine-quick-wins"
    last_updated_at: "2026-06-15T14:06:36Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-doctrine-quick-wins"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Doctrine quick-wins: fix the AGENTS.md dead hook pointer plus a pointer-resolution check, add an efficiency doctrine spine, and a scar-tissue cold-successor handoff discipline

<!-- SPECKIT_LEVEL: 2 -->
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
| **Language/Stack** | Markdown (AGENTS.md, CLAUDE.md, handover template) plus POSIX shell (the new check). |
| **Framework** | system-spec-kit doc + rules conventions; the `scripts/rules/` family of `check-*.sh` validators. |
| **Storage** | None - edits to tracked files in the repo only. |
| **Testing** | `validate.sh --strict` for the spec docs; manual broken-vs-repaired runs of `check-doc-pointers.sh`; `diff -q` and `wc -l` gates on the twins. |

### Overview
Three independent, surgical doctrine wins land together because they share the same hot surfaces and the same low blast radius. A1 renames one pointer in two byte-synced files and backs the fix with a standing shell check that fails loud on any unresolved `references/*.md` citation. A2 adds a ~10-line efficiency spine to §1 of both twins inside the ~76-line headroom under the ~500-line budget. A3 grows the handover template so a cold successor inherits scar tissue (where past changes blew up) and a numbered read order. None of these depends on the mechanism (B*) or measurement (C*) phases.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (A1/A2/A3 grounded in the fable-5 recommendation map)
- [ ] Success criteria measurable (pointer resolves, check fails-then-passes, twins byte-synced, spine + ledger present)
- [ ] Dependencies identified (none - this phase is self-contained)

### Definition of Done
- [ ] Dead pointer resolves and the hyphenated form is gone from both twins
- [ ] `check-doc-pointers.sh` exits non-zero on a broken pointer and 0 on the repaired tree
- [ ] `diff -q AGENTS.md CLAUDE.md` reports no difference and each twin is at or under ~500 lines
- [ ] Handover template carries the scar-tissue ledger and numbered cold-read order
- [ ] Docs updated (spec/plan/tasks) and `validate.sh --strict` passes for this phase folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doctrine-as-durable-text plus a fail-loud guard. The conviction lives on the highest-read surface (AGENTS.md/CLAUDE.md §1), and a standing check converts a class of silent rot (dead doc pointers) into a loud failure - the F6 "engineer staleness out: counts to greps" pattern from the fable-5 source.

### Key Components
- **AGENTS.md / CLAUDE.md twins**: byte-identical root behavior surfaces; carry the pointer citation and the new efficiency spine.
- **`check-doc-pointers.sh`**: a new member of the `scripts/rules/check-*.sh` family that asserts every AGENTS.md `references/*.md` pointer resolves on disk.
- **`handover.md.tmpl`**: the cold-successor handoff surface, extended with a scar-tissue ledger and numbered read order.

### Data Flow
The check reads AGENTS.md, extracts each `references/*.md` citation, stats each target against the repo root, and exits non-zero with the offending paths if any are missing. The doctrine spine and handover sections are static read-surface text consumed by agents at prompt time; no runtime data flow changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `AGENTS.md` (root behavior surface) | Cites the skill-advisor hook doc and holds §1 doctrine. | Update: rename pointer at line 217; add ~10-line spine. | `grep -n skill_advisor_hook.md AGENTS.md` matches; spine lines present. |
| `CLAUDE.md` (byte-synced twin) | Must mirror AGENTS.md byte-for-byte. | Update: apply the identical edits. | `diff -q AGENTS.md CLAUDE.md` reports no difference. |
| `skill_advisor_hook.md` (pointer target) | The real doc the pointer should reach. | Unchanged: target already exists with the correct underscored name. | `ls .opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook.md`. |
| `scripts/rules/check-*.sh` family | Existing fail-loud doc/spec validators. | Add a sibling: `check-doc-pointers.sh`. | New file present and executable; broken-vs-repaired runs behave as specified. |
| `handover.md.tmpl` | Cold-successor handoff template. | Update: add scar-tissue ledger + numbered cold-read order. | Section + anchors present; existing anchors preserved. |
| Three agent-mirror dirs (`.opencode/agents/`, `.claude/agents/`, `.codex/agents/`) | Consume root behavior facts. | Not a consumer of this change: the pointer and spine live in AGENTS.md/CLAUDE.md only. | No mirror edits required by this phase. |

Required inventories:
- Same-class producers: `rg -n 'references/hooks/[a-z_-]+\.md' AGENTS.md CLAUDE.md` to confirm the hyphenated pointer is the only offender and both twins match.
- Consumers of the changed pointer: `rg -n 'skill-advisor-hook\.md|skill_advisor_hook\.md' . --glob '*.md'` to confirm no other surface still cites the dead name.
- Matrix axes for the check: pointer-present vs absent, target-exists vs missing, input-file-present vs missing - prove each row before claiming the check is correct.
- Algorithm invariant: the check must report every unresolved `references/*.md` pointer (not stop at the first) and must never pass when its input file is missing (no vacuous green).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Steps are ordered so the standing check exists before its first real assertion, and the pointer fix lands before byte-sync is re-verified. Each step names the file(s) it touches and how it is verified.

### Phase 1: A1 — pointer fix and fail-loud check
- [ ] Step 1: Edit `AGENTS.md:217`, renaming `references/hooks/skill-advisor-hook.md` to `references/hooks/skill_advisor_hook.md`. Verify with `grep -n skill_advisor_hook.md AGENTS.md` and confirm the hyphenated form is gone.
- [ ] Step 2: Apply the byte-identical edit to `CLAUDE.md`. Verify with `diff -q AGENTS.md CLAUDE.md` (must report no difference).
- [ ] Step 3: Create `.opencode/skills/system-spec-kit/scripts/rules/check-doc-pointers.sh`: extract every `references/*.md` citation from AGENTS.md, stat each against the repo root, exit non-zero listing any missing target, and treat a missing input file as failure. Make it executable. Verify by pointing it at a deliberately broken copy (exit non-zero, offender named) and at the repaired tree (exit 0).

### Phase 2: A2 / A3 — doctrine spine and handover scar tissue
- [ ] Step 4: Add the ~10-line efficiency doctrine spine to §1 of `AGENTS.md` (root conviction, two-register voice, letter-vs-intent), then mirror it into `CLAUDE.md`. Verify the spine text is present in both and `diff -q AGENTS.md CLAUDE.md` still reports no difference.
- [ ] Step 5: Extend `.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl` with a scar-tissue traps ledger (blast site, what reactivates the trap, load-bearing vs defensive) and a numbered cold-read order, preserving every existing HTML-comment anchor. Verify the new section and the unchanged anchors with `grep -n 'ANCHOR\|scar'`.

### Phase 3: Verification
- [ ] Step 6: Re-run `check-doc-pointers.sh` against the live tree (exit 0); confirm `wc -l AGENTS.md CLAUDE.md` shows each at or under 500 lines and `diff -q AGENTS.md CLAUDE.md` is clean.
- [ ] Step 7: Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-phase-folder> --strict` and mark `checklist.md` items with evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Behavioral | `check-doc-pointers.sh` fails on a broken pointer, passes on the repaired tree, fails on a missing input file | Direct shell invocation with crafted fixtures |
| Invariant | AGENTS.md ≡ CLAUDE.md; each at or under ~500 lines | `diff -q`, `wc -l` |
| Doc | Spec/plan/tasks/checklist synchronized and placeholder-free | `validate.sh --strict` |
| Manual | Spine reads cleanly in §1; handover ledger is usable by a cold successor | Read-through review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None (no upstream phase) | Internal | Green | This phase is the self-contained land-first item; it does not wait on the mechanism (B*) or measurement (C*) phases. |
| POSIX shell + grep | External | Green | Already available in the dev/CI environment; the check uses no extra tooling. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The doctrine spine reads poorly, the check produces false positives, or any twin drifts out of sync.
- **Procedure**: `git checkout -- AGENTS.md CLAUDE.md .opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl` and `git rm` the new check file. All four changes are additive/text-only and revert cleanly with no data migration.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (A1: pointer fix + check) ──► Phase 2 (A2/A3: spine + handover) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (A1) | None | Phase 3 (the check must exist before final verification) |
| Phase 2 (A2/A3) | None (independent of A1, but sequenced after for a single clean byte-sync re-check) | Phase 3 |
| Phase 3 (Verify) | Phase 1, Phase 2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (A1) | Low | 1-2 hours (one-char pointer edit + a ~30-line shell check with broken/repaired fixtures) |
| Phase 2 (A2/A3) | Low | 1-2 hours (~10-line spine in two twins + handover template section) |
| Verification | Low | <1 hour (strict validate + diff/wc gates) |
| **Total** | | **~3-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `git status` confirms only the four intended files are touched (no scope drift)
- [ ] `diff -q AGENTS.md CLAUDE.md` clean before commit
- [ ] No feature flag or monitoring needed (text + standalone check only)

### Rollback Procedure
1. `git checkout -- AGENTS.md CLAUDE.md .opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl` to restore the twins and template.
2. `git rm .opencode/skills/system-spec-kit/scripts/rules/check-doc-pointers.sh` (or `git checkout` if it was already committed and you only want the prior version).
3. Verify rollback with `diff -q AGENTS.md CLAUDE.md` and a re-read of §1.
4. No stakeholder notification required; nothing user-facing changes.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - all changes are tracked-file text/script edits with no persisted state.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->

