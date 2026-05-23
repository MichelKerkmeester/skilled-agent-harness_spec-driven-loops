---
title: "Spec: 022/003 Codex Agents Mirror Investigation + Qualifier Removal"
description: "Investigation revealed .codex/agents/ is NOT empty (11 .toml files mirror .opencode/agents/) AND [agents.ai-council] IS declared in .codex/config.toml at line 139. Audit P0 was stale. Phase 003 reduces to JUST 2 P1 (proposed) qualifier removals from deep-research.md:51 + deep-review.md:45 since deep-ai-council rename arc has shipped."
trigger_phrases:
  - "022/003 codex agents investigation"
  - "(proposed) qualifier removal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/003-codex-agents-mirror-fill"
    last_updated_at: "2026-05-23T17:05:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 003 shipped"
    next_safe_action: "Move to phase 004 (skill-advisor 4-wave cli-opencode dispatch)"
    blockers: []
    key_files:
      - ".opencode/agents/deep-research.md"
      - ".opencode/agents/deep-review.md"
      - ".codex/config.toml"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022e1"
      session_id: "016-002-022-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Investigation: .codex/agents/ has 11 .toml files (full mirror parity with .opencode/agents/); audit's 'empty dir' P0 was stale"
      - "Investigation: [agents.ai-council] declared at .codex/config.toml:139; audit's 'missing block' P0 was stale"
      - "P1 qualifier sites confirmed at .opencode/agents/deep-research.md:51 + deep-review.md:45 only; .claude/.codex/.gemini mirrors don't have the threshold-comparison block"
      - "ai-council.md:39 (proposed) reference is about THRESHOLD VALUE, not name maturity — left alone"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 022/003 Codex Agents Mirror Investigation + Qualifier Removal

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Type | Investigation + 2-line edit |
| Owner | main_agent direct (no executor dispatch) |
| Parent | `../spec.md` (022-hardcoded-default-remediation-arc) |
| Council recommendation | After 002b per `<parent>/ai-council/executor-instructions.md` |
| Estimated wall-clock | 30–60 min (council); actual ~5 min (P0 found already-closed) |
| Risk class | TRIVIAL (2 token deletions) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 021 audit reported 2 findings for codex agents:
- **P0 (f-iter003-001):** `.codex/agents/` empty → mirror fill required
- **P1 (f-iter003-002):** `deep-ai-council (proposed)` qualifier stale (rename arc has shipped)

Investigation at start of phase 003 found both P0 sub-claims to be STALE:
1. `.codex/agents/` is NOT empty — contains 11 .toml files mirroring `.opencode/agents/` (full parity)
2. `[agents.ai-council]` IS declared in `.codex/config.toml` at line 139 (council exec-instructions assumed otherwise; verified at start of phase)

The audit was outdated. Only the P1 qualifier removal remains in actual scope.

Purpose: confirm the investigation findings + remove the 2 `(proposed)` qualifiers from .opencode/agents/ where they cite `deep-ai-council` as a sibling skill.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Document investigation findings (above) for audit-trail closure
- `.opencode/agents/deep-research.md:51`: remove `(proposed)` qualifier from `deep-ai-council` reference
- `.opencode/agents/deep-review.md:45`: same change

### Out of Scope

- `.codex/agents/` mirror fill (already complete; no action needed)
- `[agents.ai-council]` block addition (already declared at .codex/config.toml:139)
- `.opencode/agents/ai-council.md:39` `(proposed)` reference: this is about THRESHOLD VALUE (0.20 still being calibrated), NOT name maturity — leave alone
- `.claude/agents/`, `.gemini/agents/`, `.codex/agents/` deep-research/deep-review mirrors: those files don't contain the threshold-comparison block at lines 45/51 (different line layout)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Verification |
|---|---|---|
| R1 | `.opencode/agents/deep-research.md` does NOT contain `deep-ai-council (proposed)` | `grep -n "deep-ai-council (proposed)"` returns 0 hits |
| R2 | `.opencode/agents/deep-review.md` does NOT contain `deep-ai-council (proposed)` | same grep |
| R3 | All 4 runtime agent dirs (.opencode/.claude/.codex/.gemini) have 0 hits for `deep-ai-council (proposed)` | `rg "deep-ai-council \(proposed\)" .opencode/agents/ .claude/agents/ .codex/agents/ .gemini/agents/` → 0 hits |
| R4 | Threshold-value `(proposed)` mention at `.opencode/agents/ai-council.md:39` preserved | `grep "(proposed) on adjudicator-verdict stability"` returns 1 hit (this is about the threshold value, NOT the name) |
| R5 | Strict-validate this phase → exit 0 | `bash validate.sh 003-codex-agents-mirror-fill --strict` |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- R1–R5 verifications all pass
- 1 P0 audit finding confirmed already-closed (no action; documented for audit-trail)
- 2 P1 qualifier removals applied
- Parent arc graph-metadata.json `children_ids` already contains 003 entry
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Main-agent direct Edit. 2 Edit calls. No executor dispatch (scope below ROI threshold). Pre-edit investigation surfaced that the audit's P0 was stale, reducing scope dramatically.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Risk | Mitigation |
|---|---|
| Audit-trail confusion (P0 "already closed" looks like skipped work) | Investigation findings documented in this spec.md + implementation-summary.md; auditor can trace why P0 is closed without action |
| `.claude/.gemini/.codex` deep-research/deep-review mirrors have different layout — qualifier may exist at different lines | Verified at investigation: `.opencode/` is the only runtime with the threshold-comparison block at those lines |
| `(proposed)` on threshold value at ai-council.md:39 mistakenly removed | Explicitly OUT OF SCOPE per §3 |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- None. Investigation resolved P0 ambiguity; P1 scope clear.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Parent arc: `../spec.md`
- Council recommendation: `../ai-council/executor-instructions.md` §Phase 003
- Audit source: `../../021-hardcoded-default-audit-deep-research/research/research.md` f-iter003-001, f-iter003-002
- Memory: `feedback_new_agent_mirror_all_runtimes.md` — codex TOML mirror convention (already correctly applied)
<!-- /ANCHOR:cross-links -->

<!-- ANCHOR:nfr -->
## 10. NON-FUNCTIONAL REQUIREMENTS

- No code path affected; behavior unchanged
- Audit-trail integrity preserved (P0 closure documented)
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 11. EDGE CASES

- Multiple `(proposed)` occurrences across runtime dirs — only 2 had the NAME qualifier pattern; 1 has the threshold-value qualifier which stays
- `ai-council.md:39` could be misinterpreted as same-class; explicit out-of-scope guard prevents
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 12. COMPLEXITY

LEVEL 2 trivial. 2 token deletions across 2 files. Investigation-heavy at phase start (~5 min); edits ~30 sec. Far below cli-X dispatch ROI.
<!-- /ANCHOR:complexity -->
