---
title: "Verification Checklist: Pi skill-discovery bridge"
description: "Verification Date: Planned - not yet executed"
trigger_phrases:
  - "pi skill discovery checklist"
  - "pi skills array verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/004-pi-skill-discovery-bridge"
    last_updated_at: "2026-07-27T08:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored checklist.md (planning only); design-artifact items verified"
    next_safe_action: "Wait for phase 003 and phase 001, then execute the live discovery probe"
    blockers: ["depends on 003-cli-pi-skill-packet landing first (cli-pi registered as a hub mode)", "depends on 001-pi-contract-pin's live Pi install and settings.json merge findings", "central discovery-shape question (hub-respecting vs flattened) is genuinely unresolved until a live pi session is probed"]
    key_files: ["spec.md", "plan.md", "tasks.md", "../003-cli-pi-skill-packet/spec.md", "../001-pi-contract-pin/spec.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 0
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

- [ ] CHK-001 [P0] Requirements documented in `spec.md` — 8 requirements: P0 REQ-001..004 (discovery-surface inventory citation, ≥3 candidate `.pi/settings.json` configs plus the `--skill` flag alternative, a concrete live-verification protocol, explicit unconfirmed-claim flagging); P1 REQ-005..007 (the directory-enumeration-may-not-suppress-recursion failure mode as distinct from the whole-tree-pointer failure mode, the 029/030 symlink-parity test carried forward, the mitigate-vs-accept decision framing with a re-verification trigger); P2 REQ-008 (`sk-design` vendor-file hub-specific-exception follow-up).
- [ ] CHK-002 [P0] Technical approach defined in `plan.md` — §3 Architecture names 4 candidate configurations (Whole-Tree Pointer, Enumerated-Hub-Paths, Curated-Mirror, `--skill`-Flag-Per-Hub), each with a predicted outcome and a named test; §4 drafts an 8-step ordered live-verification protocol with explicit hub-respecting/flattened evidence criteria.
- [ ] CHK-003 [P1] Discovery-surface inventory (REQ-001) re-confirmed live, in THIS worktree, during this authoring pass — with a documented discrepancy against `spec.md`'s own recorded figure: `find .opencode/skills -iname SKILL.md | wc -l` returns **48** here, not the 51 `spec.md`'s `answered_questions` block cites, while `find .opencode/skills -maxdepth 2 -iname SKILL.md` returns **12** in both runs (matches exactly — the number this phase's design actually reasons about). Root cause, confirmed live: `sk-design/design-md-generator/backend/node_modules/` is gitignored (`.gitignore:80`) and not installed in this fresh worktree checkout, so its 2 vendor `SKILL.md` files (and the resulting 39-vs-36 nested-mode delta) are simply absent here — not a contradiction of `spec.md`'s own prior live run, just a different dependency-install state. Re-verify whichever total is live in whatever environment implementation actually happens in; do not silently prefer either cached figure.
- [ ] CHK-004 [P1] Dependencies identified and their landing status recorded, not silently assumed — 003-cli-pi-skill-packet (not yet landed) and 001-pi-contract-pin (not yet landed) both recorded as blockers in this phase's frontmatter and `spec.md` §6. Separately noted as an input discrepancy, not resolved here: `mode-registry.json` currently registers exactly **4** modes (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor` — confirmed live via direct read; no `cli-devin` entry exists anywhere in this hub today, in the working tree or at `HEAD`), one fewer than the "hub's 6th mode" framing used elsewhere in this packet assumes. This is 003's registration count to resolve, not this phase's — flagged here only because CHK-004 requires dependency status to be recorded accurately, not inherited uncritically.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

This phase produces no executable code — the items below verify the design artifacts (candidate configurations, the live-verification protocol) in place of lint/build checks, per the phase's actual deliverable shape.

- [ ] CHK-010 [P0] All 4 candidate `.pi/settings.json`/`--skill` configurations are documented with a predicted outcome and a distinct, falsifiable test (REQ-002) — drafted in `plan.md` §3 Architecture and cross-referenced in `spec.md` §4 REQ-002; Candidates B and D are explicitly marked "predicted outcome: UNKNOWN" rather than asserted confidently.
- [ ] CHK-011 [P0] The live-verification protocol states an explicit, non-vague "hub-respecting" vs. "flattened" decision rule (REQ-003) — `plan.md` §4 step 4: exactly 12 matching identities = hub-respecting; more than 12, including nested-mode names, = flattening confirmed.
- [ ] CHK-012 [P1] Every claim in this phase's design artifacts (the 4 candidates, the 8-step protocol) that rests on pi.dev docs rather than confirmed live behavior carries an explicit qualifier by construction (REQ-004) — confirmed via direct read of `plan.md` §3 (all 4 candidates' predicted outcomes are phrased as hypotheses, several explicitly "UNKNOWN").
- [ ] CHK-013 [P1] The directory-enumeration failure mode (REQ-005) is documented as distinct from the whole-tree-pointer failure mode, not conflated into one generic "flattening risk" — `spec.md` §6 Risks table carries them as two separate rows; `plan.md` Candidate B states its own open question independently of Candidate A's.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Every `spec.md` §4 requirement has a matching design artifact — independently cross-checked during this authoring pass: REQ-001→inventory (spec.md §1/§2, this checklist's CHK-003), REQ-002→4 candidates (`plan.md` §3), REQ-003→8-step protocol (`plan.md` §4), REQ-004→qualifier discipline (CHK-012/CHK-041), REQ-005→directory-enumeration failure mode (`spec.md` §6, `plan.md` Candidate B), REQ-006→symlink-parity step (`plan.md` §4 step 7, §5 Testing Strategy), REQ-007→decision-plus-trigger framing (`plan.md` §4 step 8, `spec.md` §6/§10 trigger examples), REQ-008→`sk-design` vendor follow-up (`spec.md` §10 Open Questions). `tasks.md`'s own T010 checkbox remains unedited (out of this edit's scope), but the mapping it calls for has been performed and is evidenced here.
- [ ] CHK-021 [P0] Manual/live testing complete — explicitly NOT done and must not be marked done: this is a PLANNING ONLY phase (hard constraint). The live-verification protocol itself (`plan.md` §4) is Planned and blocked on phase 001's Pi install landing; no `pi` command was run to produce this checklist.
- [ ] CHK-022 [P1] Edge cases tested — deferred to implementation time. `spec.md` §8 Edge Cases enumerates 3 (vendor-contaminated tree, file-path-vs-directory-path uncertainty in the `"skills"` array, a non-naive skill-selection heuristic that could mask flattening in practice); none can be tested without a live `pi` session.
- [ ] CHK-023 [P1] Error/failure scenarios validated — deferred. E.g., what happens if `.pi/settings.json`'s `"skills"` array is given an invalid or nonexistent path, or a literal `SKILL.md` file path when only directories are accepted — UNKNOWN, needs live verification; not exercised in this pass beyond being named as an open question (`spec.md` §10, second bullet).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase is new discovery-configuration design, not a bug fix — the finding-class taxonomy below does not apply. Items are retained for template conformance and marked deferred where inapplicable.

- [ ] CHK-FIX-001 [P0] [deferred: no bug/regression finding to classify — this phase designs a new discovery-bridge configuration, it does not fix an existing one]
- [ ] CHK-FIX-002 [P0] [deferred: no same-class producer inventory applicable — no repository file outside this phase folder is touched]
- [ ] CHK-FIX-003 [P0] Consumer inventory: confirm this phase's design does not reach into or alter anything phase 003 owns (`mode-registry.json`, `hub-router.json`, any hub `SKILL.md`/`description.json`/`graph-metadata.json`) — confirmed via `spec.md` §3 Out of Scope, which explicitly excludes those files and treats them as read-only reference material only.
- [ ] CHK-FIX-004 [P0] [deferred: no path/parser/redaction logic touched — config-shape planning only, no code written]
- [ ] CHK-FIX-005 [P1] [deferred: no matrix/evidence test-execution required for a planning-only phase; the discovery-pointer-granularity × observed-outcome matrix in `plan.md`'s Affected Surfaces addendum is a design matrix awaiting live evidence, not a completed test matrix]
- [ ] CHK-FIX-006 [P1] [deferred: no process-wide/global state read by this phase's static config design]
- [ ] CHK-FIX-007 [P1] [deferred: no fix commit to pin evidence to; this phase's own authoring-pass evidence (the `find` re-run in CHK-003) is timestamped to this session, 2026-07-27, not a fix SHA]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets or credentials in any authored file — confirmed by direct read: `spec.md`/`plan.md`/`tasks.md`/`checklist.md` contain no Pi auth tokens, API keys, or credential material; every path referenced is repo-relative or a documented `~/.pi/`-style path.
- [ ] CHK-031 [P0] [deferred: no user-input validation surface — this phase authors no executable code, only planning docs and a design for a future JSON config file]
- [ ] CHK-032 [P1] [deferred: no auth/authz code introduced in this phase]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md` cross-references synchronized — all 4 docs share the same REQ-00x/T00x/CHK-00x id scheme and the same Predecessor (003-cli-pi-skill-packet) / Successor (005-pi-command-layer) framing; confirmed by direct read during this authoring pass.
- [ ] CHK-041 [P1] A grep-based spot-check of the unconfirmed-claim discipline (REQ-004) — `rg -n "per pi.dev docs, unconfirmed|UNKNOWN, needs live verification" spec.md plan.md` returns 4 hits in `spec.md` (lines 131, 191, 220, 227) and 1 meta-reference in `plan.md` (line 64); a broader pattern (also counting bare "UNKNOWN") returns 6 hits in `spec.md` and 2 in `plan.md`. This is a spot-check, not the full line-by-line audit `tasks.md` T011 calls for — T011 remains unedited/pending in `tasks.md` (out of this edit's scope) and should still run before packet closeout.
- [ ] CHK-042 [P2] Confirm whether this phase's discovery-shape decision needs a corresponding forward cross-reference added to `../003-cli-pi-skill-packet`'s own docs once 003 lands, so its registered `cli-pi` mode entry links to this phase's protocol — flagged as a follow-up for 003-implementation time, not resolved here (out of scope: this phase does not edit 003's folder).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in `scratch/` only — `scratch/` confirmed empty (`ls -la`); no temp files were created outside it during this authoring pass.
- [ ] CHK-051 [P1] `scratch/` cleaned before completion — nothing was created in `scratch/` to clean; it remains empty.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 7/12 |
| P1 Items | 14 | 8/14 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Planned - not yet executed (spec-authoring pass completed 2026-07-27; live-verification protocol execution gated on phases 001/003 landing).
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

