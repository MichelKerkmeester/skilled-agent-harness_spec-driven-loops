---
title: "Implementation Summary: Validate.sh Registry Bridge"
description: "Summary of bridging orchestrator.ts's default validateFolder() path to registry-backed shell rules, plus the repo-wide blast-radius discovery and its resolution."
trigger_phrases:
  - "validate sh registry bridge summary"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/011-followup-remediation/006-validate-sh-registry-bridge"
    last_updated_at: "2026-07-02T11:30:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Recorded post-completion incident and recovery evidence"
    next_safe_action: "No implementation action remaining"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Validate.sh Registry Bridge

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-validate-sh-registry-bridge |
| **Completed** | 2026-07-02 |
| **Level** | 1 |
| **Status** | Complete |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A self-healing bridge function (`runRegistryShellRules()`) added to `orchestrator.ts`'s `validateFolder()`: reads `validator-registry.json`, derives the already-natively-implemented rule_id set live from the just-built `entries[]` array (no separately maintained allowlist), filters to registry rules whose `script_path` starts with `rules/` and are not `strict_only`/`skip`-severity, and shells out to each remaining rule exactly the way `validate.sh`'s own `run_all_rules()` does, parsing `RULE_STATUS`/`RULE_MESSAGE`/`RULE_DETAILS` into a matching `ValidationEntry`. This closed the gap where the default `validate.sh` invocation never ran registry-backed shell rules -- purely additive, 181 insertions, no existing native validator function touched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Modified | Added the registry bridge function and wired it into `validateFolder()` |
| `.opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh` | Modified | Added a default-path scaffold regression test (`072 scaffold marker fails through default registry bridge`) |
| `.opencode/specs/system-deep-loop/024-deep-loop-improved/001-reference-research/{plan.md,tasks.md,implementation-summary.md}` | Modified | Authored real content, closing this child's own packet-030 scope gap (see Decisions) |
| `.opencode/specs/system-deep-loop/024-deep-loop-improved/{008-loop-systems-remediation,010-documentation-truth-audit}/implementation-summary.md` | Modified | Fixed a `Spec Folder` metadata field mismatch (`SPEC_DOC_INTEGRITY`) unrelated to the bridge itself, surfaced by the same verification pass |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered via a `cli-opencode` dispatch (`openai/gpt-5.5-fast --variant xhigh`) after siblings 003-005 (scaffold-content authoring) reached Status: Complete. The dispatch correctly halted before claiming success when its own verification step found packet 030 still failing `validate.sh --strict --recursive` -- it reported the exact failing folders and root causes rather than working around them. The orchestrating session then independently investigated, found the failures split into two categories, and closed both: (1) a genuine, pre-existing dist-staleness bug in `validate.sh` itself (fixed as its own initiative, `system-speckit/030-validate-sh-dist-freshness-and-repo-remediation`), and (2) `001-reference-research`'s own scaffold markers, which fell outside siblings 003-005's stated scope ("phases 002-007's leaf children") because it is a standalone phase with no leaf children of its own -- closed directly as part of this child.

**Post-completion incident, disclosed for the record.** A later, unrelated documentation-authoring dispatch (adding manual-testing-playbook coverage for the dist-freshness feature above) ran `git checkout --` on `orchestrator.ts` while trying to "restore" it after a manual reproduction step, discarding this child's uncommitted 179-line addition -- the file was never committed at any point in this session. The dispatch caught its own mistake, recovered the content from a local Time Machine snapshot, and disclosed its confidence as "not cryptographic." The orchestrating session independently re-verified the recovery from scratch rather than accepting that self-report: diff-stat against HEAD (`faba1ece16`, 2026-06-24) confirmed +179/-0 exactly matching the pre-incident count; all four bridge functions (`runRegistryShellRules`, `readValidatorRegistry`, `resolveRegistryRuleScript`, `mapShellRuleStatus`) were re-read end to end and found logically intact (path-traversal guard, self-healing `nativeRuleIds` derivation, and the `skip`-status mapping fix all present and correctly wired); and the full `test-validation-extended.sh` suite (113 scenarios) plus a full `validate.sh --strict --recursive` on packet 030 were both re-run clean. See Verification below for the exact commands.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Bridge wires in every eligible registry rule, not an allowlist of 2 | Matches the approved design ("for each remaining registry rule... shell out"); narrowing it post hoc to dodge the discovered blast radius would have been a silent scope change without evidence it was actually the right call |
| Repo-wide blast radius (43 packets, 257 folders) handled as a separate initiative, not folded into this child | The user explicitly chose to address it, but its true scope (dist-staleness bug + ~20 dormant rules firing repo-wide) is materially larger than "close packet 030's follow-ups" and spans packets this session has no context on |
| `001-reference-research` scaffold markers fixed here, not deferred | It is squarely within "packet 030 must pass cleanly," the original acceptance bar for this child; small, contained, 3-file fix grounded in its own already-correct `spec.md` |
| `008`/`010`'s Spec Folder metadata fix included | Same literal-string-compare bug (`check-spec-doc-integrity.sh` comparing against bare `basename()`, not a path), trivial and safe, discovered while investigating the same gate failure |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Full recursive validate, packet 030 | Pass | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/024-deep-loop-improved --strict --recursive` — 12/12 folders, `Errors: 0` (only the repo-wide pre-existing `SECTION_COUNTS` warning remains, matching every other packet in the repo, tracked separately) |
| Default-path fixture proof | Pass | `072-scaffold-never-touched-violation` fails via the default invocation (no `SPECKIT_RULES` set) — before this fix it would have silently passed; independently re-run and confirmed |
| Explicit legacy path unchanged | Pass | `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED` explicit invocation still works identically |
| Extended validation harness | Pass | `test-validation-extended.sh` 113/113, independently re-run after the dist-freshness fix landed |
| No double-running | Pass | Skip-set is derived live from `entries[]`, confirmed by code review — no rule appears twice in output |
| Post-incident recovery re-verification | Pass | `git diff --stat` on `orchestrator.ts` after recovery: `179 insertions(+), 0 deletions(-)` (unchanged from pre-incident); full line-by-line read of all 4 bridge functions found no corruption or logic drift; `test-validation-extended.sh` re-run 113/113; `validate.sh --strict --recursive` on packet 030 re-run 0 errors across all 12 folders |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. No vitest suite exercises `validateFolder()`'s dual-path branch logic directly -- coverage relies on the bash-level `test-validation-extended.sh` fixtures, not a unit test against the TypeScript function itself. Flagged as a real gap, not solved here.
2. The bridge activating ~20 previously-dormant registry rules repo-wide (not just the 2 originally named) means every OTHER packet in the repo (42 packets outside 030, excluding `system-speckit/028-*`) now also fails `validate.sh --strict --recursive`. This is real, pre-existing validation debt this bridge correctly exposes rather than causes -- it is being triaged and remediated separately under `system-speckit/030-validate-sh-dist-freshness-and-repo-remediation`, not left silently unaddressed.

<!-- /ANCHOR:limitations -->
