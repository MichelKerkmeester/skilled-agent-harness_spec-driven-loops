---
title: "Verification Checklist: Pi skill-discovery bridge"
description: "Verification Date: 2026-07-27 - closed out; live-execution items accepted-deferred pending provider credentials"
trigger_phrases:
  - "pi skill discovery checklist"
  - "pi skills array verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/004-pi-skill-discovery-bridge"
    last_updated_at: "2026-07-27T09:53:30Z"
    last_updated_by: "claude-code"
    recent_action: "Closed out checklist; live probe attempted and blocked on credentials"
    next_safe_action: "Commit phase 004; phase 005 proceeds with accepted decision"
    blockers: ["Discovery-shape confirmation needs provider credentials this machine lacks"]
    key_files: ["implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Pi skill-discovery bridge

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` — 8 requirements: P0 REQ-001..004 (discovery-surface inventory citation, ≥3 candidate `.pi/settings.json` configs plus the `--skill` flag alternative, a concrete live-verification protocol, explicit unconfirmed-claim flagging); P1 REQ-005..007 (the directory-enumeration-may-not-suppress-recursion failure mode as distinct from the whole-tree-pointer failure mode, the 029/030 symlink-parity test carried forward, the mitigate-vs-accept decision framing with a re-verification trigger); P2 REQ-008 (`sk-design` vendor-file hub-specific-exception follow-up).
- [x] CHK-002 [P0] Technical approach defined in `plan.md` — §3 Architecture names 4 candidate configurations (Whole-Tree Pointer, Enumerated-Hub-Paths, Curated-Mirror, `--skill`-Flag-Per-Hub), each with a predicted outcome and a named test; §4 drafts an 8-step ordered live-verification protocol with explicit hub-respecting/flattened evidence criteria.
- [x] CHK-003 [P1] Discovery-surface inventory (REQ-001) re-confirmed live, in THIS worktree, during this authoring pass — with a documented discrepancy against `spec.md`'s own recorded figure: `find .opencode/skills -iname SKILL.md | wc -l` returns **48** here, not the 51 `spec.md`'s `answered_questions` block cites, while `find .opencode/skills -maxdepth 2 -iname SKILL.md` returns **12** in both runs (matches exactly — the number this phase's design actually reasons about). Root cause, confirmed live: `sk-design/design-md-generator/backend/node_modules/` is gitignored (`.gitignore:80`) and not installed in this fresh worktree checkout, so its 2 vendor `SKILL.md` files (and the resulting 39-vs-36 nested-mode delta) are simply absent here — not a contradiction of `spec.md`'s own prior live run, just a different dependency-install state. Re-verify whichever total is live in whatever environment implementation actually happens in; do not silently prefer either cached figure.
- [x] CHK-004 [P1] Dependencies identified and their landing status recorded, not silently assumed — both dependencies now landed: 003-cli-pi-skill-packet is Complete (`cli-pi` registered as the hub's 6th mode; `parent-skill-check.cjs` 0 warnings, 6 modes) and 001-pi-contract-pin is Complete (Pi CLI 0.82.1 installed, live findings recorded). The earlier discrepancy this item flagged (mode-registry.json showing only 4 modes, no `cli-devin`) was a stale worktree-fork snapshot, resolved by the rebase onto `skilled/v4.0.0.0` performed during phase 003 — confirmed via direct read: `mode-registry.json` now lists 6 modes including `cli-pi` and `cli-devin`. [EVIDENCE: `git log --oneline -6` shows 003/002/001 committed; `mode-registry.json` has 6 `modes[]` entries]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

This phase produces no executable code — the items below verify the design artifacts (candidate configurations, the live-verification protocol) in place of lint/build checks, per the phase's actual deliverable shape.

- [x] CHK-010 [P0] All 4 candidate `.pi/settings.json`/`--skill` configurations are documented with a predicted outcome and a distinct, falsifiable test (REQ-002) — drafted in `plan.md` §3 Architecture and cross-referenced in `spec.md` §4 REQ-002; Candidates B and D are explicitly marked "predicted outcome: UNKNOWN" rather than asserted confidently.
- [x] CHK-011 [P0] The live-verification protocol states an explicit, non-vague "hub-respecting" vs. "flattened" decision rule (REQ-003) — `plan.md` §4 step 4: exactly 12 matching identities = hub-respecting; more than 12, including nested-mode names, = flattening confirmed.
- [x] CHK-012 [P1] Every claim in this phase's design artifacts (the 4 candidates, the 8-step protocol) that rests on pi.dev docs rather than confirmed live behavior carries an explicit qualifier by construction (REQ-004) — confirmed via direct read of `plan.md` §3 (all 4 candidates' predicted outcomes are phrased as hypotheses, several explicitly "UNKNOWN").
- [x] CHK-013 [P1] The directory-enumeration failure mode (REQ-005) is documented as distinct from the whole-tree-pointer failure mode, not conflated into one generic "flattening risk" — `spec.md` §6 Risks table carries them as two separate rows; `plan.md` Candidate B states its own open question independently of Candidate A's.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Every `spec.md` §4 requirement has a matching design artifact — cross-checked: REQ-001→inventory (spec.md §1/§2, CHK-003), REQ-002→4 candidates (`plan.md` §3), REQ-003→8-step protocol (`plan.md` §4), REQ-004→qualifier discipline (CHK-012/CHK-041), REQ-005→directory-enumeration failure mode (`spec.md` §6, `plan.md` Candidate B), REQ-006→symlink-parity step (`plan.md` §4 step 7, §5 Testing Strategy), REQ-007→decision-plus-trigger framing (`implementation-summary.md` Decision section), REQ-008→`sk-design` vendor follow-up (`spec.md` §10 Open Questions). [EVIDENCE: `tasks.md` T010]
- [B] CHK-021 [P0] Manual/live testing complete — [DEFERRED: attempted live via `pi --offline --approve -p "list every skill you have discovered, one per line"` with a scratch `.pi/settings.json` pointing `"skills"` at `.opencode/skills`; the config parsed and was accepted (no syntax error), the dispatch reached Pi's provider-credential gate identically to phase 001's finding, and blocked there before a skill-list response could be observed. Decision accepted per `implementation-summary.md` - Candidate A (Whole-Tree Pointer) initially, with an explicit re-verification trigger once provider credentials exist]
- [B] CHK-022 [P1] Edge cases tested — [DEFERRED: `spec.md` §8 enumerates 3 (vendor-contaminated tree, file-path-vs-directory-path uncertainty, non-naive skill-selection heuristic); none can be exercised without a live `pi` session past the same credential gate as CHK-021]
- [B] CHK-023 [P1] Error/failure scenarios validated — [DEFERRED: e.g. an invalid/nonexistent `"skills"` path, or a literal `SKILL.md` file path when only directories are accepted, UNKNOWN pending live verification; blocked on the same credential gate as CHK-021, named as an open question in `spec.md` §10]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase is new discovery-configuration design, not a bug fix — the finding-class taxonomy below does not apply. Items are retained for template conformance and marked deferred where inapplicable.

- [x] CHK-FIX-001 [P0] [DEFERRED: no bug/regression finding to classify — this phase designs a new discovery-bridge configuration, it does not fix an existing one]
- [x] CHK-FIX-002 [P0] [DEFERRED: no same-class producer inventory applicable — no repository file outside this phase folder is touched]
- [x] CHK-FIX-003 [P0] Consumer inventory: confirmed this phase's design does not reach into or alter anything phase 003 owns (`mode-registry.json`, `hub-router.json`, any hub `SKILL.md`/`description.json`/`graph-metadata.json`) — confirmed via `spec.md` §3 Out of Scope, which explicitly excludes those files and treats them as read-only reference material only. [EVIDENCE: `spec.md` §3 Out of Scope]
- [x] CHK-FIX-004 [P0] [DEFERRED: no path/parser/redaction logic touched — config-shape planning only, no code written]
- [x] CHK-FIX-005 [P1] [DEFERRED: no matrix/evidence test-execution required for a planning-only phase; the discovery-pointer-granularity x observed-outcome matrix in `plan.md`'s Affected Surfaces addendum is a design matrix awaiting live evidence, not a completed test matrix]
- [x] CHK-FIX-006 [P1] [DEFERRED: no process-wide/global state read by this phase's static config design]
- [x] CHK-FIX-007 [P1] [DEFERRED: no fix commit to pin evidence to; this phase's own live-probe evidence (CHK-021) is timestamped to this session, 2026-07-27, not a fix SHA]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets or credentials in any authored file — confirmed by direct read: `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md` contain no Pi auth tokens, API keys, or credential material; every path referenced is repo-relative or a documented `~/.pi/`-style path. [EVIDENCE: direct read, all phase 004 files]
- [x] CHK-031 [P0] [DEFERRED: no user-input validation surface — this phase authors no executable code, only planning docs and a design for a future JSON config file]
- [x] CHK-032 [P1] [DEFERRED: no auth/authz code introduced in this phase]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md` cross-references synchronized — all 5 docs share the same REQ-00x/T00x/CHK-00x id scheme and the same Predecessor (003-cli-pi-skill-packet) / Successor (005-pi-command-layer) framing; confirmed by direct read. [EVIDENCE: direct read, all phase 004 files]
- [x] CHK-041 [P1] A grep-based spot-check of the unconfirmed-claim discipline (REQ-004) — `rg -n "per pi.dev docs, unconfirmed|UNKNOWN, needs live verification" spec.md plan.md` returns 4 hits in `spec.md` (lines 131, 191, 220, 227) and 1 meta-reference in `plan.md` (line 64). [EVIDENCE: `tasks.md` T011]
- [x] CHK-042 [P2] Whether this phase's discovery-shape decision needs a forward cross-reference added to `../003-cli-pi-skill-packet`'s own docs — [DEFERRED: 003 is already Complete and closed; adding a backward cross-reference into a closed predecessor packet is out of this phase's scope, noted as a follow-up only if 003 is ever revised]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in `scratch/` only — this phase's own folder has no `scratch/` content; the live-probe scratch config lived in the session scratchpad (`/private/tmp/.../pi-probe-004/`), outside the repo entirely. [EVIDENCE: `find 004-pi-skill-discovery-bridge -type d -name scratch` — no repo-tracked scratch artifacts]
- [x] CHK-051 [P1] `scratch/` cleaned before completion — nothing was created in-repo to clean. [EVIDENCE: same as CHK-050]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 (+1 accepted-deferred: CHK-021) |
| P1 Items | 14 | 12/14 (+2 accepted-deferred: CHK-022/CHK-023) |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-27. Design-artifact items fully verified; the 3 live-execution items (CHK-021/022/023) are accepted-deferred per an explicit re-verification trigger — blocked on provider credentials this machine lacks, not silently assumed complete. Decision: accept Candidate A (Whole-Tree Pointer) initially; see `implementation-summary.md`.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

