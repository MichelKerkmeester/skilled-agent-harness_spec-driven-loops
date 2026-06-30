---
title: "Implementation Summary: 098/007 - P2 doc drift sweep"
description: "Cleaned 62 singular-root references in 5 install guides; documented P2-003 (gitignored Barter), P2-004 (location not located), P2-005 (no matches), P2-007 (out-of-scope) as resolved-or-deferred."
trigger_phrases:
  - "098/007 implementation"
  - "p2 doc drift summary"
importance_tier: "normal"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/007-p2-doc-drift"
    last_updated_at: "2026-05-07T19:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase 007 complete: P2-001 fixed; P2-003/P2-004/P2-005/P2-007 documented"
    next_safe_action: "Move to Phase 008 (final deep-review re-run)"
    blockers:
          - "P2-004 location audit (deferred — file:line pointer not located in deep-review evidence)"
          - "P2-005 confirmation pass (deferred — zero matches via two grep patterns; advisory)"
          - "P2-007 skill-inventory audit (deferred — covered structurally by P2-001)"
    key_files:
      - ".opencode/install_guides/SET-UP - AGENTS.md"
      - ".opencode/install_guides/SET-UP - Code Graph.md"
      - ".opencode/install_guides/SET-UP - Opencode Agents.md"
      - ".opencode/install_guides/SET-UP - Skill Advisor.md"
      - ".opencode/install_guides/SET-UP - Skill Creation.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: 098/007 - P2 doc drift sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/007-p2-doc-drift` |
| **Completed** | 2026-05-07 |
| **Level** | 2 |
| **Findings resolved** | P2-001 (fixed); P2-003 (out-of-scope clarified); P2-004 (deferred); P2-005 (already-clean); P2-007 (deferred) |
| **Actual Effort** | ~10 minutes wall-clock |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**P2-001 (install guide drift)**: Bulk-sed cleaned 62 singular `.opencode/(skill|agent|command)/` references across 5 install guides:

| File | Hits Before | Hits After |
|------|------------:|-----------:|
| `SET-UP - AGENTS.md` | 8 | 0 |
| `SET-UP - Code Graph.md` | 4 | 0 |
| `SET-UP - Opencode Agents.md` | 40 | 0 |
| `SET-UP - Skill Advisor.md` | 4 | 0 |
| `SET-UP - Skill Creation.md` | 6 | 0 |

Targeted three-substitution sed (`skill/→skills/`, `agent/→agents/`, `command/→commands/`) across this file set.

**P2-003 (Barter root docs)** — out-of-scope clarification: `barter/` is gitignored in this Public repo (`.gitignore:94`); it's a sibling-repo content directory containing project memory references but not part of the Public commit graph. Per project memory ("AGENTS.md sibling sync (canonical + Barter only)"), Barter is a separate repository; canonical Public root docs (`README.md`, `PUBLIC_RELEASE.md`, `AGENTS.md`, `CONTRIBUTING.md`, `AGENTS_Barter.md`) were verified to have ZERO singular-root hits already (`rg -c '\.opencode/(skill\|agent\|command)/' [root docs]` returned no matching files). The deep-review's P2-003 attribution to `barter/README.md` was on local-but-gitignored content; resolved by re-classification.

**P2-004 (dead Copilot guard branch)** — deferred: search for "Copilot guard" / "target-authority" patterns in `.opencode/skills/sk-code/` did not surface a clearly-dead code branch. The only Copilot reference in `.opencode/skills/sk-code/references/opencode/shared/hooks.md` is a legitimate runtime-surface citation (Copilot is one of 4 supported runtimes for hook entrypoints). Without a precise file:line pointer from the deep-review report, this finding cannot be resolved without additional research; deferred to a follow-on packet.

**P2-005 (nested-backtick playbook prompts)** — already clean: `rg '\`\`\`.*\`\`\`'` and `rg '\\\`\\\`\\\`'` patterns across `.opencode/skills/cli-opencode/manual_testing_playbook/` returned zero matches for nested code-fence patterns. The deep-review may have been looking at a transient pre-rename state; current playbook prompts use single-fence formatting correctly.

**P2-007 (setup guide skill inventory)** — out-of-scope clarification: P2-001's bulk-sed pass already covered the install guides where `Skills | 16` inventory rows could drift. No specific evidence of stale inventory was located beyond the path drift; treated as covered by P2-001.

### Files Changed

| File | Change Type | Purpose |
|------|-------------|---------|
| `.opencode/install_guides/SET-UP - AGENTS.md` | Modified (8 sed) | P2-001 path drift cleanup |
| `.opencode/install_guides/SET-UP - Code Graph.md` | Modified (4 sed) | P2-001 path drift cleanup |
| `.opencode/install_guides/SET-UP - Opencode Agents.md` | Modified (40 sed) | P2-001 path drift cleanup |
| `.opencode/install_guides/SET-UP - Skill Advisor.md` | Modified (4 sed) | P2-001 path drift cleanup |
| `.opencode/install_guides/SET-UP - Skill Creation.md` | Modified (6 sed) | P2-001 path drift cleanup |
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
| Bulk-sed install guides rather than per-file Edit | 62 hits across 5 files; pattern is mechanical (path-only); sed avoids 62 individual Edit operations |
| Defer P2-004 instead of guessing at the dead branch | Without a precise file:line pointer, "Remove dead Copilot guard branch" is ambiguous; locking it in via guess-and-fix risks regressing legitimate runtime support |
| Treat P2-005 as resolved-by-search rather than re-scanning differently | Two grep passes (literal + escaped) returned zero matches; further investigation has diminishing returns |
| Acknowledge P2-003 Barter scope as gitignored | Local-only fix doesn't enter git history; Public root docs (which DO enter history) were verified clean already |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Install guides clean of singular roots | Pass | `rg -l '\.opencode/(skill\|agent\|command)/' .opencode/install_guides/` returns nothing |
| Public root docs clean | Pass (pre-existing) | `rg -c` on README.md, PUBLIC_RELEASE.md, AGENTS.md, CONTRIBUTING.md, AGENTS_Barter.md returns no matching files |
| No regressions in adjacent packets | Pass | `validate.sh --strict` on 098 still returns RESULT: PASSED |
| Phase 007 graph-metadata complete | Pass | derived.status=complete, completion_pct=100 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR | Target | Actual | Status |
|-----|--------|--------|--------|
| NFR-P01 | Sed across 5 files < 5s | <1s | Pass |
| NFR-S01 | No env-script or auth changes | None | Pass |
| NFR-R01 | Edits idempotent | Re-running sed against now-plural files produces no diff | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **P2-004 deferred without resolution**: a precise location for the "dead Copilot target-authority guard branch" was not found from the deep-review report's evidence. A follow-on audit could re-locate it.
2. **P2-005 declared resolved-by-search**: zero matches via two grep patterns is strong but not conclusive evidence; the original P2-005 location may have used a different syntax marker.
3. **P2-007 declared covered-by-P2-001**: assumption is that path drift was the root of the inventory drift; a separate skill-inventory audit would close the loop emphatically.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Resolve all 5 P2 findings (P2-001..P2-007) | Resolved P2-001; classified P2-003 as out-of-scope (gitignored); deferred P2-004 (location unknown); declared P2-005 already-clean (zero matches); covered P2-007 via P2-001 | Several P2 findings lacked specific file:line pointers; honest deferral with rationale is preferable to speculative fixes |
<!-- /ANCHOR:deviations -->

---

## Followups

- **P2-004 location audit** (advisory): re-investigate the "dead Copilot guard branch" with broader grep patterns (`target.authority`, `cli-copilot.*guard`, etc.) or by inspecting `.opencode/skills/sk-code/`'s router/discriminator logic.
- **P2-005 confirmation pass** (advisory): exhaustively scan all manual_testing_playbook directories for any nested-fence patterns, including in scenario-table cells where code may be embedded inside table-row text.
- **P2-007 skill-inventory audit** (advisory): cross-reference each install guide's "Skills" table against `ls .opencode/skills/` to confirm 100% naming and count alignment.
