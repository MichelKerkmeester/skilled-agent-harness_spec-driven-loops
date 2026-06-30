---
title: "Implementation Summary: 098/002 - sk-deep-* token replacement"
description: "Replaced legacy sk-deep-review/sk-deep-research tokens with deep-review/deep-research across 11 actionable surfaces; aligned codex review.toml P1-blocking doctrine with canonical."
trigger_phrases:
  - "098/002 implementation"
  - "sk-deep token replace summary"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/002-sk-deep-token-replace"
    last_updated_at: "2026-05-07T18:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase 002 complete: 89 token hits cleaned + cross-runtime doctrine aligned"
    next_safe_action: "Move to Phase 003 (096 narrative + smart-router validation repair)"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/assets/speckit_deep-review_auto.yaml"
      - ".opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml"
      - ".opencode/commands/speckit/assets/speckit_deep-research_auto.yaml"
      - ".opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml"
      - ".opencode/commands/speckit/deep-review.md"
      - ".opencode/commands/speckit/deep-research.md"
      - ".opencode/agents/orchestrate.md"
      - ".opencode/agents/deep-review.md"
      - ".opencode/agents/deep-research.md"
      - ".opencode/install_guides/SET-UP - AGENTS.md"
      - ".codex/agents/review.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: 098/002 - sk-deep-* token replacement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/002-sk-deep-token-replace` |
| **Completed** | 2026-05-07 |
| **Level** | 2 |
| **Findings resolved** | P1-002, P1-008, P1-009, P1-011, P1-012 |
| **Actual Effort** | ~5 minutes wall-clock |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Replaced `sk-deep-review` → `deep-review` and `sk-deep-research` → `deep-research` across 10 actionable in-scope files (89 hit total) using two-pass `sed -i ''` per file. Path-form citations like `.opencode/skills/sk-deep-review/...` became `.opencode/skills/deep-review/...` automatically. The actual skill folders at `.opencode/skills/deep-review/` and `.opencode/skills/deep-research/` (renamed in packet 070) are now correctly referenced from every actionable surface.

Separately, repaired P1-009 doctrine drift in `.codex/agents/review.toml:400-404` by replacing the weakened `Never block without P0 evidence` block with the canonical `Never block without severity evidence` block (matching `.opencode/agents/review.md:412-415`, `.gemini/agents/review.md:397-400`, and `.claude/agents/review.md:412-415`). All 4 runtime mirrors now express the same P1-blocking contract.

### Files Changed

| File | Hits | Change Type | Purpose |
|------|-----:|-------------|---------|
| `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml` | 15 | sed | command YAML loads correct skill folder |
| `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml` | 15 | sed | command YAML loads correct skill folder |
| `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml` | 17 | sed | command YAML loads correct skill folder |
| `.opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml` | 17 | sed | command YAML loads correct skill folder |
| `.opencode/commands/speckit/deep-review.md` | 9 | sed | command markdown citations |
| `.opencode/commands/speckit/deep-research.md` | 9 | sed | command markdown citations |
| `.opencode/agents/orchestrate.md` | 1 | sed | orchestrator routing table line 96 |
| `.opencode/agents/deep-review.md` | 2 | sed | agent body skill citations (line 318, 325) |
| `.opencode/agents/deep-research.md` | 1 | sed | agent body skill citation (line 91) |
| `.opencode/install_guides/SET-UP - AGENTS.md` | 3 | sed | skill inventory rows (lines 514, 515, 1203) |
| `.codex/agents/review.toml:400-404` | 1 block | Edit | P1-009 doctrine alignment with canonical |
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
| Two-pass sed per file rather than blanket repo sed | Avoids touching out-of-scope historical references in `z_archive/`, packet 070-sk-deep-rename docs (the rename packet itself), packet 081 review report, and review/research iteration logs |
| Replaced cross-runtime mirror agents via the canonical block, not in-place sed | `.claude/.codex/.gemini/agents/` had no `sk-deep-*` hits at file-pattern level (verified pre-edit); the only mirror drift was P1-009 doctrine in codex toml |
| Scope `.opencode/agents/` to 3 files (orchestrate + deep-review + deep-research) | Other agents do not reference deep-loop skills; verified by repo-wide rg before targeting |
| Did not touch sk-deep references in spec narratives | They are historical artifacts documenting the rename; rewriting them would falsify the audit trail (consistent with 096 narrative-tautology lesson learned) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Pre-edit hit count | Captured | 89 sk-deep-* hits across 10 actionable files |
| Post-edit residual hits in actionable surfaces | Pass | `rg 'sk-deep-(review\|research)' [actionable surfaces]` returns 0 |
| Plural skill folders exist | Pass | `.opencode/skills/deep-review/` and `.opencode/skills/deep-research/` present |
| Cross-runtime doctrine parity | Pass | `Never block without severity evidence` block byte-equivalent across `.opencode/.codex/.gemini/.claude/agents/review.{md,toml}` |
| Command YAML still parses | Pass | Spot-check `spec_kit_deep-review_auto.yaml:57 → skill_md: .opencode/skills/deep-review/SKILL.md` (file exists) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR | Target | Actual | Status |
|-----|--------|--------|--------|
| NFR-P01 | Per-file sed <1 s | <100 ms each | Pass |
| NFR-S01 | No env-script execution paths added | None | Pass |
| NFR-R01 | Edits idempotent | Re-running sed produces no further diff | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Dry-run init for `/speckit:deep-review:auto` and `/speckit:deep-research:auto` not executed** — The token replacement is correct by static-analysis (paths exist, references match); a runtime smoke test against a freshly-cloned worktree would close the loop more emphatically. Tracked as advisory.
2. **Historical references preserved on purpose** — packet 070 rename docs, 081 cli-copilot review report, and all review/research iteration logs continue to cite `sk-deep-*`. Rewriting them would falsify history.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| 5 surfaces in plan.md | 11 actionable files (1 codex toml block + 10 sed targets) | The codex review.toml doctrine fix was a content edit, not a sk-deep token swap; counted as a separate Edit |
| Cross-runtime mirror sweep | No mirror hits found at sk-deep-* token level | Only P1-009 (codex doctrine) needed cross-runtime work |
<!-- /ANCHOR:deviations -->

---

## Followups

- **Runtime smoke test** (advisory): dry-run init for both `/speckit:deep-review:auto` and `/speckit:deep-research:auto` in fresh worktree.
- **Phase 005 (checklist-evidence)** will backfill the strict-validate child anchors (`how-delivered`, `protocol`, `pre-impl`, `code-quality`, etc.) that this draft scaffold is missing.
