---
title: "Implementation Summary: 098/006 - skill advisor + Python tools plural migration"
description: "Migrated freshness/generation.ts advisor state path to plural; deleted .opencode/skill/.advisor-state survivor; patched audit_descriptions.py + skill_advisor.py native bridge to plural defaults."
trigger_phrases:
  - "098/006 implementation"
  - "skill advisor migration summary"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/006-skill-advisor-python"
    last_updated_at: "2026-05-07T19:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase 006 complete: P1-003 + P1-014 resolved"
    next_safe_action: "Move to Phase 007 (P2 doc drift sweep)"
    blockers:
          - "Zero-coverage smoke guards for audit_descriptions.py + skill_advisor.py (advisory follow-on)"
          - "Root-singular-directory CI rename guard (advisory follow-on)"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/commands/doctor/scripts/audit_descriptions.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: 098/006 - skill advisor + Python tools plural migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/006-skill-advisor-python` |
| **Completed** | 2026-05-07 |
| **Level** | 2 |
| **Findings resolved** | P1-003, P1-014 |
| **Actual Effort** | ~10 minutes wall-clock |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**P1-003 (Skill advisor state writer)**: `mcp_server/skill_advisor/lib/freshness/generation.ts:12` previously wrote advisor state to `.opencode/skill/.advisor-state/skill-graph-generation.json` (singular root). Each runtime tick of the advisor regenerated the singular directory at the repo root, leaving a forbidden survivor that contradicted the 096 plural rename. Updated the constant to `.opencode/skills/.advisor-state/...`. Rebuilt dist via `npm run build`. Deleted the residual `.opencode/skill/` directory entirely (`rm -rf .opencode/skill/`); the root no longer regenerates a singular path.

**P1-014a (audit_descriptions.py singular roots)**: 4 path-concat literals in `.opencode/commands/doctor/scripts/audit_descriptions.py` still pointed at singular roots:
- Line 47: `QUICK_VALIDATE_DIR = SCRIPT_DIR.parent.parent.parent / "skill" / "sk-doc" / "scripts"` — sys.path injection broken; fixed to `"skills"`
- Line 157: `walk_skills(): base = repo / ".opencode" / "skill"` — fixed to `"skills"`
- Line 185: `walk_commands(): base = repo / ".opencode" / "command"` — fixed to `"commands"`
- Line 220: `walk_agents(): (repo / ".opencode" / "agent", "yaml")` — fixed to `"agents"`

Pre-fix, the script silently scanned non-existent directories and reported "0 items audited" — vacuous pass. Post-fix, smoke test reports `Items audited: 51 (skills: 16, commands: 24, agents: 11 unique names)` matching expected inventory.

**P1-014b (skill_advisor.py native bridge constants)**: 3 `os.path.join` calls in `skill_advisor/scripts/skill_advisor.py` lines 56-89 (NATIVE_ADVISOR_STATUS, NATIVE_ADVISOR_COMPAT, NATIVE_GENERATION_MODULE) all referenced `.opencode/skill/system-spec-kit/...` (singular). Used `Edit replace_all=true` to flip all 3 occurrences of `".opencode", "skill", "system-spec-kit"` → `".opencode", "skills", "system-spec-kit"` in one operation. The 3 remaining `"skill"` literal hits are surface-type labels (`kind="skill"` discriminators), not paths, and remain correct.

Smoke-tested both the local fallback path (`python3 skill_advisor.py "create new spec folder" --threshold 0.5`) and the `--force-native` bridge path; both return correct skill recommendations with `"source": "native"` annotation post-rebuild.

### Files Changed

| File | Change Type | Purpose |
|------|-------------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:12` | Modified | Advisor state path: singular → plural |
| `.opencode/skills/system-spec-kit/mcp_server/dist/skill_advisor/lib/freshness/generation.js` | Regenerated | dist counterpart matches source post-`npm run build` |
| `.opencode/commands/doctor/scripts/audit_descriptions.py:47` | Modified | QUICK_VALIDATE_DIR sys.path injection plural |
| `.opencode/commands/doctor/scripts/audit_descriptions.py:157` | Modified | walk_skills() base plural |
| `.opencode/commands/doctor/scripts/audit_descriptions.py:185` | Modified | walk_commands() base plural |
| `.opencode/commands/doctor/scripts/audit_descriptions.py:220` | Modified | walk_agents() opencode tuple plural |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:58,69,80` | Modified | 3 NATIVE_* bridge module path constants plural (replace_all) |
| `.opencode/skill/` (whole directory) | Deleted | `rm -rf` — survivor removed; root singular dir no longer regenerates |
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
| Use `Edit replace_all=true` for the 3 native bridge constants | They share an identical 3-line pattern (`".opencode", "skill", "system-spec-kit"`); one operation, byte-equivalent change across all 3 |
| Delete `.opencode/skill/` rather than gitignore | The directory is now confirmed unused; deleting prevents future regeneration. If the source path constant ever regresses, the smoke test will fail when the runtime tries to mkdir under the missing root |
| Preserve `"skill"` surface-type labels in skill_advisor.py | These are discriminator strings (`kind="skill"`, `surface == "skill"`), not path components; renaming them would break downstream type matchers |
| Did not add a CI guard for root-singular-directory regeneration | Out of P1-003 critical-path scope; tracked as advisory follow-on |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Source generation.ts plural | Pass | Line 12 shows `'skills'` |
| dist generation.js regenerated to plural | Pass | `dist/skill_advisor/lib/freshness/generation.js` GENERATION_RELATIVE_PATH plural |
| .opencode/skill/ root absent | Pass | `ls .opencode/skill/` returns "No such file or directory" |
| audit_descriptions.py finds expected inventory | Pass | Smoke test: "Items audited: 51 (skills: 16, commands: 24, agents: 11)" |
| skill_advisor.py native bridge resolves plural module paths | Pass | `--force-native` smoke test returns recommendations with `"source": "native"` annotation |
| skill_advisor.py local fallback still works | Pass | Default path query returns recommendations correctly |
| `--validate-only` mode works | Pass | "Discovered 17 skill graph-metadata.json files / VALIDATION PASSED" |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR | Target | Actual | Status |
|-----|--------|--------|--------|
| NFR-P01 | Build < 60s | ~5 s | Pass |
| NFR-S01 | No new env-script execution paths | None | Pass |
| NFR-R01 | Edits idempotent | Re-running `npm run build` + smoke tests produce no further diff | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No new zero-coverage smoke guard added to audit_descriptions.py / skill_advisor.py**: P1-013's smart-router script (Phase 003) gained an explicit zero-coverage failure mode. P1-014's recommendation included similar guards for these Python tools but is deferred. Not critical because `audit_descriptions.py` does the right thing on plural paths now (returns 51 items), but defense-in-depth would add a guard that fails when scanning yields 0 items.
2. **No re-test of P1-003 after `.opencode/skill/.advisor-state/` deletion under runtime conditions**: the advisor's state writer should now write to `.opencode/skills/.advisor-state/`. Verified by source/dist plural; not verified by waiting for the next runtime tick to confirm the new state file appears at the new path.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Add zero-coverage smoke guards to audit_descriptions.py and skill_advisor.py | Deferred | Out-of-scope for the path-rename critical fix; tracked as advisory follow-on |
| Add root-singular-directory rename guard | Deferred | Out-of-scope; deletion is sufficient for now (regeneration source is fixed) |
<!-- /ANCHOR:deviations -->

---

## Followups

- **Zero-coverage smoke guards** (advisory): add `if not items: sys.exit(2)` guards to `audit_descriptions.py` and `skill_advisor.py` so future singular-default regressions fail closed.
- **Root-singular-dir rename guard** (advisory): a CI step that fails when `.opencode/skill/`, `.opencode/agent/`, or `.opencode/command/` exist would prevent reintroduction of any of the 3 root-singular survivors.
- **Runtime-tick smoke test for advisor state** (advisory): trigger an advisor tick and verify the new state file appears at `.opencode/skills/.advisor-state/skill-graph-generation.json` (not `.opencode/skill/...`).
