---
title: "Implementation Summary: Hook-Doc Reconciliation + 022 Re-verify (029 Phase 007)"
description: "Reconciled 5 stale hook-artifact-path docs to the real flat dist path; 022 transitive re-verified on a deep subject — PARTIAL with clarified root cause F-022-1 (includeTransitive is a no-op)."
trigger_phrases:
  - "hook doc reconciliation summary"
  - "022 transitive summary"
  - "029 phase 007 implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/010-playbook-validation-and-hardening/007-followup-hook-docs-and-022"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Reconciled 5 hook docs; 022 deep re-run clarified F-022-1 (includeTransitive no-op)"
    next_safe_action: "Update parent matrix and validate packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/references/decisions/deferred_decisions.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "F-022-1 blast_radius includeTransitive semantics: RESOLVED in phase 008 (default depth-1, flag opts into multi-hop)"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-followup-hook-docs-and-022 |
| **Completed** | 2026-05-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both non-blocking 029 follow-ups are resolved: the hook docs point at the real artifact, and 022's transitive verdict is explained.

### Follow-up #2 — hook-doc reconciliation
The 4 hook READMEs (`system-spec-kit/mcp_server/hooks/{claude,codex,gemini,devin}/README.md`) and the `system-skill-advisor` decision tracker (`deferred_decisions.md`) cited a SessionStart compiled-artifact path that never existed (`system-code-graph/dist/system-spec-kit/mcp_server/hooks/<runtime>/`). All five now cite the real flat artifact `system-spec-kit/mcp_server/dist/hooks/<runtime>/session-start.js` (verified `test -f`). The decision tracker keeps its original §2 entry plus a dated 2026-05-27 correction recording that the system-code-graph migration was never realized and that F-025-1 (phase 004) repointed `.devin/hooks.v1.json` to the real path. The 029 packet records and the historical 026/008 packet were intentionally left untouched (they document the finding; rewriting would falsify history).

### Follow-up #1 — 022 transitive re-verify (deep subject)
Re-ran 022 against `lib/code-graph-db.ts` (genuine 3-hop reverse-dep depth: 27/7/1 = 35). The default (non-transitive) blast_radius already returned all 35, so `includeTransitive:true` added nothing → **PARTIAL, finding F-022-1**: the flag is effectively a no-op because the default traversal is already a full reverse-dependency closure. Not a shallow-topology artifact (the first hypothesis) and not a core defect — single/union/minConfidence all behave correctly.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `…/hooks/{claude,codex,gemini,devin}/README.md` | Modified | Real flat artifact path |
| `…/decisions/deferred_decisions.md` | Modified | Dated correction + §3 path fix |
| `evidence-022-rerun.md` | Created | 022 PARTIAL + F-022-1 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Doc edits verified by `rg` (real path cited in all 5; stale path only in the dated correction context) + `test -f` on the devin artifact. 022 re-run via cli-opencode on a deliberately deep-dependency subject, confined to a disposable workspace.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reconcile docs, do not move the hook | The hook works under system-spec-kit; the migration was aspirational and never built |
| Preserve deferred_decisions history with a dated correction | It is another skill's decision record; errata pattern beats rewriting |
| Record 022 as PARTIAL/F-022-1, do not change blast_radius semantics | Whether the default should be depth-limited is a maintainer design decision, out of this packet's scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Real artifact path cited in all 5 docs | PASS (`rg`) |
| Devin artifact path exists | PASS (`test -f`) |
| Stale path only in correction/historical context | PASS |
| 022 transitive re-run | PARTIAL — F-022-1 (includeTransitive no-op); single/union/minConfidence correct |
| No staleness markers / workspace leftovers | PASS (0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **F-022-1 RESOLVED in phase 008.** Originally flagged here as a maintainer design decision; the subsequent consumer audit showed no programmatic reliance on the full-closure default, so blast_radius was fixed to honor `includeTransitive` (default depth-1). See `../008-blast-radius-transitive-flag/`.
2. **deferred_decisions §2 retains the original (incorrect) claim** above the dated correction, by design (preserve the decision record; correct via adjacent errata).
<!-- /ANCHOR:limitations -->
