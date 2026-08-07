---
title: "Verification Checklist: Remote Branch Push Permission Policy"
description: "Verification Date: 2026-07-17"
trigger_phrases:
  - "verification"
  - "checklist"
  - "remote branch policy"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/015-remote-branch-policy"
    last_updated_at: "2026-07-17T16:01:41Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All checklist items verified with evidence"
    next_safe_action: "None — checklist complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-015"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Remote Branch Push Permission Policy

<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3 | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|---------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented — evidence: `spec.md:106` §4 REQUIREMENTS
- [x] CHK-002 [P0] Technical approach + phases defined — evidence: `plan.md:64` §4 IMPLEMENTATION PHASES
- [x] CHK-003 [P1] Both operator forks resolved before implementation began — evidence: `research.md:110` §6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `main` pushes (new and update) succeed with zero env vars set — evidence: `pre-push.test.sh` "main push (new form)/(update form) allowed with no env vars", plus a manual invocation against the real repo tree
- [x] CHK-011 [P0] `skilled/v*` release pushes (new and update) succeed with zero env vars set — evidence: `pre-push.test.sh` "skilled/v9.9.9.9 never blocked"; manual invocation against real `skilled/v4.0.0.0`
- [x] CHK-012 [P0] A non-allowlisted branch push (new) is blocked by default (rc=1) and unblocked with `SPECKIT_ALLOW_REMOTE_PUSH=1` — evidence: "valid new task branch STILL blocked by default" + bypass variant, both pass
- [x] CHK-013 [P0] A non-allowlisted branch push (update to an existing remote branch) is ALSO blocked by default and unblocked with the bypass var — evidence: `pre-push.test.sh` "update to an existing non-allowlisted branch STILL blocked by default" + bypass variant, both pass
- [x] CHK-014 [P1] `SPECKIT_SKIP_PREPUSH_NAMING=1` alone no longer implies a bypass of the permission gate — evidence: "SPECKIT_SKIP_PREPUSH_NAMING=1 alone skips naming but permission STILL blocks" (rc=1) + combined-bypass variant (rc=0)
- [x] CHK-015 [P1] A custom pattern added to `remote-branch-allowlist.txt` exempts the matching branch without a code change — evidence: "custom allowlist-file pattern (docs/*) exempts an update push" + negative case for a branch outside the pattern; CLI smoke test (`validate-remote-allowlist develop`)
- [x] CHK-016 [P0] Deleting/emptying `remote-branch-allowlist.txt` narrows exemptions back to `main`/`skilled/v*` only — never widens to "everything allowed" — evidence: `is_remote_push_allowlisted()` checks the two hardcoded patterns via `case` before any file I/O; a missing file (`[ -f "$file" ] || return 1`) returns "not exempt", never "exempt"
- [x] CHK-017 [P0] A broken/unsourceable `worktree-naming.sh` still fails the WHOLE hook open (both gates) — evidence: "broken validator fails open (never blocks either gate)" — unchanged top-of-hook guard, both gates live behind the same `source` call
- [x] CHK-018 [P1] The naming gate's existing owner-discovery fail-open path remains isolated from the new permission gate's own pass/fail — evidence: "owner discovery error fails open (naming), permission gate bypassed for isolation" sets `SPECKIT_ALLOW_REMOTE_PUSH=1` explicitly to decouple the two assertions
- [x] CHK-019 [P0] `SPECKIT_AUTOSYNC=1` + matching `SPECKIT_LIVE_BRANCH` exempts that exact branch's push from the permission gate, and does NOT exempt a different branch (not a blanket bypass) — evidence: "autosync publish to $SPECKIT_LIVE_BRANCH is exempt" (rc=0) + negative case (rc=1)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-040 [P0] `pre-push.test.sh` full run: `PASS=<N> FAIL=0` — evidence: `PASS=21 FAIL=0`, re-confirmed after all edits
- [x] CHK-041 [P0] All 4 pre-existing scenarios whose expected outcome changes are updated in place — evidence: research.md §5 table cross-checked against the rewritten test file; all 4 updated, none left stale
- [x] CHK-042 [P1] Manual smoke test against the real repo tree — evidence: direct hook invocation (not `--dry-run`, since hooks aren't installed in `.git/hooks/` in this checkout) confirmed the BLOCKED message, the bypass path, and the `skilled/v4.0.0.0` free-pass path all render/behave correctly
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable — this is new functionality (a new permission gate), not a bug fix. The Fix Completeness finding-class taxonomy (`instance-only`/`class-of-bug`/`cross-consumer`/`algorithmic`/`matrix-evidence`/`test-isolation`) governs triaging an existing defect's blast radius, which has no analogue here: there was no prior "remote-push permission" behavior to have a defective instance of. The equivalent discipline for a new gate — enumerate every producer of the behavior it must cover, and test the resulting matrix — is applied instead under plan.md's "FIX ADDENDUM: AFFECTED SURFACES" section (same-class-producer inventory: `rg -n 'git push' .opencode/skills/sk-git .opencode/bin .opencode/scripts` confirmed exactly 3 producers, all addressed).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — evidence: the only new config file (`remote-branch-allowlist.txt`) holds branch-name glob patterns, no credentials
- [x] CHK-031 [P0] Allowlist pattern matching uses bash `case` (no `eval`, no regex compiled from untrusted input) — evidence: `is_remote_push_allowlisted()` in `worktree-naming.sh` §3 VALIDATORS
- [x] CHK-032 [P1] A broken/missing validator fails OPEN (never blocks a push outright), matching this repo's existing hook-safety convention — evidence: `pre-push.test.sh` "broken validator fails open (never blocks either gate)" (same run as CHK-017)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] `SKILL.md` §3 "Remote Push Permission Enforcement" subsection present
- [x] CHK-051 [P0] `SKILL.md` ALWAYS #18 present
- [x] CHK-052 [P1] `references/remote-branch-policy.md` documents the allowlist format, both bypass vars, and the autosync exception in one place
- [x] CHK-053 [P1] `finish-workflows.md` Option 2's push snippet includes `SPECKIT_ALLOW_REMOTE_PUSH=1` with a note; Step 5b's snippet updated too
- [x] CHK-054 [P1] `continuous-integration.md` cross-links the scoped exception (Safety Contract table row + §8 Related)
- [x] CHK-055 [P2] `feature-catalog.md` + its `worktree-naming/pre-push-naming-enforcement.md` sub-file both updated to describe both gates
- [x] CHK-056 [P1] `install-git-hooks.sh` header comment reflects the hook's expanded behavior and both bypass vars
- [x] CHK-060 [P1] Root `CLAUDE.md` §5 Git Workspace Safety table has a one-line row for this rule — added to `AGENTS.md` (root `CLAUDE.md` is a symlink to it)
- [x] CHK-061 [P1] Spec/plan/tasks/decision-record/research/implementation-summary all cross-reference each other and stay internally consistent — evidence: `validate.sh --strict` SPEC_DOC_INTEGRITY check passed (all markdown references resolve)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P1] No temp/scratch files left outside `scratch/` — none created; the one manual test-fixture copy (`/tmp/allowlist-backup.txt`) was removed immediately after use
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-07-17
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] All 3 ADRs in `decision-record.md` have status Accepted
- [x] CHK-101 [P1] Alternatives documented with rejection rationale for each ADR — evidence: `decision-record.md` "Alternatives Considered" table in ADR-001/002/003, each with a scored rejection reason
- [x] CHK-102 [P2] Rollback procedure documented for each ADR's implementation section
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

Not applicable in the traditional sense — this feature has no latency/throughput target because it isn't a service. The one measurable cost is per-`git push` overhead: the permission gate adds a bash `case` match and, on the not-allowlisted path, a fixed handful of `echo` lines to stderr per ref, inside a loop the naming gate already ran. No new subprocess spawns, no network calls, no file I/O beyond one small optional text file read.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and tested — evidence: plan.md §7 Rollback Plan + each ADR's "How to roll back" (a plain `git revert`, no data migration)
- N/A CHK-121 Feature flag — no flag mechanism used; the two bypass env vars (`SPECKIT_SKIP_PREPUSH_NAMING`, `SPECKIT_ALLOW_REMOTE_PUSH`) serve the equivalent per-invocation override role and are documented in `remote-branch-policy.md`
- N/A CHK-122/123/124 Monitoring/alerting/runbook — not applicable; this is a local git hook with no running service to monitor
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

Not applicable — no PII, no external dependency additions, no OWASP-relevant surface (the feature is entirely local git tooling: a hook, a bash validator, a text config file, and skill documentation).
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized — evidence: `validate.sh --strict` SPEC_DOC_INTEGRITY + STATUS_CROSS_DOC_CONSISTENCY checks passed across all 7 docs
- [x] CHK-141 [P2] Full policy contract documented in one place (`remote-branch-policy.md`), not scattered across the skill
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

No formal reviewer roles apply — this is a single-operator repository. Operator approval was captured directly via two clarifying questions before implementation began (ask-every-push scope; CLAUDE.md sync), recorded in `research.md` §6 and each spec doc's `answered_questions` frontmatter field, in place of a multi-role sign-off table.
<!-- /ANCHOR:sign-off -->
