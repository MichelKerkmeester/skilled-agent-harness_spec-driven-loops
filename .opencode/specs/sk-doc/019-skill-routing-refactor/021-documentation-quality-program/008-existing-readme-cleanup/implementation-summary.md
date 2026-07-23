---
title: "Implementation Summary: Existing-README Cleanup"
description: "Triaged the audit to a verified real-work list, then a six-agent Sonnet swarm surgically repaired 64 older skill/code READMEs (real stale-path refs traced to their moved targets plus missing OVERVIEW sections), left the false positives alone, and deleted the approved stale duplicate."
trigger_phrases:
  - "existing readme cleanup summary"
  - "audit triage surgical repair"
  - "broken reference cleanup swarm"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-documentation-quality-program/008-existing-readme-cleanup"
    last_updated_at: "2026-07-22T16:00:57Z"
    last_updated_by: "claude"
    recent_action: "Shipped and verified the existing-README cleanup."
    next_safe_action: "Proceed to phase 009 (Title-Case + config flip + code findings)."
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-command/references/README.md"
      - ".opencode/skills/sk-design/styles/scripts/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-021-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-existing-readme-cleanup |
| **Completed** | 2026-07-22 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

64 older skill and code READMEs were surgically repaired, and the stale `design-mcp-open-design/__tests__` duplicate was deleted. The work started from the `audit_readmes.py` fleet sweep (70 template-invalid, 177 broken refs, 68 missing-OVERVIEW across 593 READMEs), but the raw numbers were not handed to a swarm. A triage step classified the false-positive patterns and a multi-root resolver plus a spec/archive/fixture exclusion filter produced a verified list of 100 candidate targets, of which 64 required edits and 36 were confirmed no-ops. Six Sonnet agents repaired the 64 in disjoint batches: each broken reference was traced to where its target actually moved, missing OVERVIEW sections were added from existing lead prose, and false positives were left alone.

### What moved where

The stale references were overwhelmingly real move and rename debt: sk-doc assets went flat, sk-code asset trees relocated under their mode folders, `_engine` was consolidated into `lib/engine`, per-style bundles moved under `library/bundles`, the sk-doc/017 snake-to-hyphen rename, a `066` to `035` packet renumber, the `design` to `interface` command rename, and `dist` paths whose sources are now `.ts`. Two references were genuinely dead (a deleted `z-future` benchmark and a deprecated `mcp-coco-index` sibling) and were reworded honestly rather than repointed.

### Files Changed

| Category | Count |
|----------|-------|
| READMEs edited (broken refs and/or OVERVIEW) | 64 |
| Stale duplicate folder deleted | 1 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The triage was the load-bearing step: the audit's reference heuristic double-resolves self-references, treats gitignored `dist` and NodeNext `.js` import specifiers as broken, and reads bracket-placeholder examples as paths. The agents verified each flagged reference on disk before acting, so the false positives (a large share of the 177) were left untouched rather than fabricated into wrongness. Reconciliation re-ran the audit rather than assuming every flagged ref was fixed: template-invalid dropped from 70 to 43, broken refs from 177 to 119, roughly 28 OVERVIEW findings cleared, and P1 findings from 242 to 163. An independent validation pass confirmed the only two apparent INVALIDs were a case-fold phantom (`commands/create/README.md` resolves to a command router) and a validator-exempt template dir, and a `git diff` confirmed the residual em dashes are pre-existing in untouched content.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Triage before dispatch | The raw audit is heuristic; handing 177 refs to a swarm would chase noise and risk fabricating fixes |
| Exclude spec-folder, archive and fixture READMEs | They follow their own conventions; force-conforming them degrades correct docs |
| Locate the real target, never guess | A fabricated path is worse than a flagged one; dead refs were reworded |
| Reconcile by re-audit, not by assumption | Many flagged refs were correctly left alone, so a fix-count check would mislead |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Audit template-invalid | 70 to 43 |
| Audit broken refs | 177 to 119 |
| Missing-OVERVIEW cleared | ~28 |
| Touched files floor-VALID | Yes (2 apparent INVALIDs are a phantom + exempt dir) |
| Em dashes agent-added | 0 (pre-existing in untouched content) |
| Parent recursive `--strict` | Clean (parent + children) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The excluded files remain flagged.** Spec-folder, archive and fixture READMEs (47) were intentionally not conformed; the residual audit count reflects them plus correctly-left false positives.
2. **The repo-wide HVR sweep is deferred.** Pre-existing em dashes across untouched older content are out of this surgical scope.
3. **Title-Case, the config flip and the remaining code findings are phase 009.** A few out-of-scope stale refs the agents spotted (for example in `core/README.md`) are recorded for that pass.

<!-- /ANCHOR:limitations -->
