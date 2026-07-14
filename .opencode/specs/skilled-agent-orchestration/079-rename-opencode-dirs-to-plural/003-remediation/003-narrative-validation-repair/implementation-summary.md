---
title: "Implementation Summary: 098/003 - 096 narrative + smart-router validation repair"
description: "Restored singular→plural arrows in 096 spec narratives, closed 096 parent unclosed dependencies anchor, and fixed check-smart-router.sh SKILL_ROOT + zero-coverage failure."
trigger_phrases:
  - "098/003 implementation"
  - "096 narrative repair"
  - "smart-router validator"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/003-narrative-validation-repair"
    last_updated_at: "2026-05-07T18:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase 003 complete: P1-004, P1-010, P1-013 resolved"
    next_safe_action: "Move to Phase 004 (hooks + resolver tighten)"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/002-agents/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/003-commands/spec.md"
      - ".opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: 098/003 - 096 narrative + smart-router validation repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/003-narrative-validation-repair` |
| **Completed** | 2026-05-07 |
| **Level** | 2 |
| **Findings resolved** | P1-004, P1-010, P1-013 |
| **Actual Effort** | ~10 minutes wall-clock |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three discrete fixes:

**P1-004 — 096 packet validate.sh self-failure**: The 096 phase-parent `spec.md` had an unclosed `dependencies` anchor block (opened line 105, never closed). Strict validation reported `SPECDOC_SUFFICIENCY_001: anchor parse failure: line 105: unclosed anchor 'dependencies'`. Added the missing closing-anchor marker between the dependencies table and the `RELATED DOCUMENTS` section. Validate now passes.

**P1-010 — 096 spec narratives are sed-induced tautologies**: Bulk sed in 096's own implementation ran over 096's own input, collapsing source-state singular literals (`.opencode/skill/`) into plural (`.opencode/skills/`), so prose like "rename `.opencode/skill/` to `.opencode/skills/`" became "rename `.opencode/skills/` to `.opencode/skills/`" — circular and untruthful. Restored singular→plural arrows in 4 places: title/header/description in 001-skills/spec.md, 002-agents/spec.md, 003-commands/spec.md (each), plus their description.json descriptions. Also restored singular old-roots in the "Files to Change" tables of those 3 child specs (e.g., `.opencode/skill/**` → `.opencode/skills/**`).

**P1-013 — `check-smart-router.sh` vacuous-pass bug**: Script's `SKILL_ROOT` constant pointed at `.opencode/skill` (singular, now empty post-rename); the iter loop found 0 skills and the script exited PASS — pretending the rename verification passed when it scanned the wrong directory. Fixed two ways: (a) constant updated to `.opencode/skills`; (b) added explicit zero-coverage failure: if `len(results) == 0`, print `FAIL: zero top-level skills scanned at <root>` to stderr and exit 1. Script now scans the correct directory AND fails closed when it finds nothing.

### Files Changed

| File | Change Type | Purpose |
|------|-------------|---------|
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/spec.md:115-116` | Modified | Add closing dependencies-anchor marker for unclosed block |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/spec.md` | Modified | Restore singular→plural arrows in title, header, description, "Files to Change" row |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/description.json` | Modified | Restore singular→plural arrow in description |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/002-agents/spec.md` | Modified | Restore singular→plural arrows + audit_descriptions.py validator string description |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/002-agents/description.json` | Modified | Restore singular→plural arrow in description |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/003-commands/spec.md` | Modified | Restore singular→plural arrows in title, header, description, "Files to Change" row |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/003-commands/description.json` | Modified | Restore singular→plural arrow in description |
| `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:68` | Modified | `SKILL_ROOT = ROOT_DIR / ".opencode" / "skill"` → `... / "skills"` |
| `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:386-394` | Modified | Add zero-coverage failure: exit 1 with `FAIL: zero top-level skills scanned` when `len(results) == 0` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The remediation steps for this phase are described in §What Was Built above. The sequence
followed the spec in plan.md (Setup → Implementation → Verification phases). All edits used
direct Edit/Write tooling (see project memory: "prefer direct sed/Edit for mechanical work").
Verification ran `validate.sh --strict` on this packet plus adjacent packets; smoke tests
ran where applicable (see §Verification table).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Restore singular old-roots with explicit `→` arrow notation | More legible than "renamed to" prose; avoids future bulk-sed self-collapse on similar packets |
| Preserve `001-skills/plan.md:90` "ls .opencode/skills/ matches old" | Not a true tautology — the comparison is "ls plural matches OLD count", which is structurally honest |
| Keep `002-agents/spec.md:85` arrow-form `.opencode/agent/<name>.md → .opencode/agents/<name>.md` | False positive in tautology grep; arrow form IS the source-honest restoration |
| Do not rerun bulk sed on the 096 packet | Would re-collapse the literals; this packet is now stable and source-honest |
| Add zero-coverage smoke guard to check-smart-router.sh, not just fix the path | Defense-in-depth: any future SKILL_ROOT misconfiguration also fails closed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| 096 packet strict validate | Pass | `bash validate.sh ... 096-rename-opencode-dirs-to-plural --strict` returns `RESULT: PASSED` (was `RESULT: FAILED` with `SPEC_DOC_SUFFICIENCY: 1 issue` before) |
| Tautology grep on 096 narrative prose | Pass | `rg '\.opencode/(skills\|agents\|commands)/.*to.*\.opencode/(skills\|agents\|commands)/'` returns 0 narrative-tautology hits (only the structurally-honest "ls matches old" line and the arrow-form audit_descriptions row remain, both correct) |
| Smart-router scans plural | Pass | `check-smart-router.sh` reports "16 top-level skills scanned" (was 0 with the singular SKILL_ROOT bug) |
| Smart-router zero-coverage failure | Pass | Returns exit 1 with stderr `FAIL: zero top-level skills scanned` when run against a stub repo with no skills under plural path |
| Smart-router surfaces real cross-CLI issues | New finding (advisory) | Now reports 8 missing references in cli-* skills (`memory_handback.md`, `shared_smart_router.md`); pre-fix this was hidden by the vacuous-pass bug |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR | Target | Actual | Status |
|-----|--------|--------|--------|
| NFR-P01 | Validate < 60s | 1-2 s | Pass |
| NFR-S01 | No env-script execution paths added | None | Pass |
| NFR-R01 | Edits idempotent | Re-running narrative fixes produces no diff | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Cross-CLI skill resource issues now surfaced** (advisory, follow-on packet): `cli-claude-code`, `cli-codex`, `cli-gemini`, `cli-opencode` each reference `references/cli/memory_handback.md` and `references/cli/shared_smart_router.md` that do not exist. These were hidden behind the vacuous-pass bug; surfacing them is a side effect of the smart-router fix. Not in P1-013 scope; track as new follow-up.
2. **Bulk-sed audit not exhaustive**: only the 4 narrative locations identified by static grep were repaired. Other sed-collateral mangling outside `.opencode/specs/skilled-agent-orchestration/096-*/` may exist. Phase 001 already repaired one such instance in the vitest test file; further audits could surface more.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Single-shot Edit per file | Multiple Edit + Python `str.replace` fallback | Edit tool refused on linter-modified files mid-session; switched to scripted replace for the table rows |
| Add tautology grep guard for future rename packets | Deferred to follow-on advisory | Out of P1-010 critical-path scope; tracked separately |
<!-- /ANCHOR:deviations -->

---

## Followups

- **Cross-CLI resource audit** (advisory; new finding from P1-013 fix): create follow-on packet to investigate the 8 missing `references/cli/*.md` resources surfaced by the now-correctly-scoped smart-router validator.
- **Tautology grep guard** (advisory): add a check-smart-router-style script that detects "rename `<plural>` to `<plural>`" patterns in spec narratives.
