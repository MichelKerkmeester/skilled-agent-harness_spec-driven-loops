---
title: "Implementation Summary: Runtime Hygiene Fixes"
description: "Summary of comment-hygiene marker removal, the new COMMENT_HYGIENE_MARKER lint rule, the salvage zero-padding fix, and the codex registry root-cause trace."
trigger_phrases:
  - "runtime hygiene fixes implementation summary"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/009-research-backlog-remediation/003-runtime-hygiene-fixes"
    last_updated_at: "2026-07-01T12:25:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented by GPT-5.5 xhigh, verified by Sonnet 5"
    next_safe_action: "Phase complete; move to child 004-phase-doc-map-and-completion-pct-sync"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-comment-hygiene.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `deep-loops/030-agent-loops-improved/009-research-backlog-remediation/003-runtime-hygiene-fixes` |
| **Completed** | 2026-07-01 |
| **Level** | 1 |
| **Implemented by** | `openai/gpt-5.5-fast` (`--variant xhigh`) via `cli-opencode` |
| **Verified by** | Claude Sonnet 5 (orchestrating session) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three independent fixes: (1) removed all 15 confirmed ephemeral `<!-- F-\d+-... -->` comment-hygiene markers from command/skill source files (10 originally cited plus 5 more caught by a fresh repo-wide grep) and added a new `COMMENT_HYGIENE_MARKER` `validate.sh` rule so the class of violation is caught automatically going forward; (2) zero-padded the salvage placeholder filename in `fanout-salvage.cjs:112` (`iteration-1.md` → `iteration-001.md`) so it matches the canonical 3-digit convention used elsewhere in the runtime; (3) traced the actual reducer/merge code path behind the suspected "codex 0-finding registry" bug and refuted the naming-collision hypothesis with direct evidence — codex's lineage registry already carries 5 real findings against live data, so no backfill was needed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/deep/assets/deep_review_auto.yaml`, `deep_research_auto.yaml` | Modified | Removed 6 comment-hygiene markers |
| `.opencode/skills/cli-opencode/SKILL.md`, `references/agent_delegation.md` | Modified | Removed 4 comment-hygiene markers |
| (5 additional files found by the repo-wide grep beyond the original 10) | Modified | Removed remaining comment-hygiene markers |
| `.opencode/skills/system-spec-kit/scripts/rules/check-comment-hygiene.sh` | Added | New `COMMENT_HYGIENE_MARKER` rule: detects `<!-- ... F-\d+-[A-Z0-9]+-\d+ ... -->` patterns in spec.md/plan.md/tasks.md/checklist.md/decision-record.md, outside fenced code blocks |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modified | Registered `COMMENT_HYGIENE_MARKER` (alias `COMMENT_HYGIENE`), category `authored_template`, severity `error` |
| `.opencode/skills/system-spec-kit/scripts/test-fixtures/070-comment-hygiene-marker/`, `071-comment-hygiene-marker-violation/` | Added | Clean-pass and expected-fail fixtures for the new rule |
| `.opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh` | Modified | New harness block for `COMMENT_HYGIENE_MARKER` (2 tests) |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Modified | Minimal routing fix: when `SPECKIT_RULES` is set (rule-subset run), skip the Node orchestrator and use the registry-backed shell framework, since the Node orchestrator does not yet know about newly-registered standalone shell rules |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs` | Modified | Zero-padded iteration placeholder filename (`String(iterNum).padStart(3, '0')`) |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-salvage.vitest.ts` | Modified | New RED→GREEN test for the zero-padded filename contract |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation dispatched to `openai/gpt-5.5-fast` (`--variant xhigh`) via `cli-opencode` against the pre-authored spec/plan/tasks, with explicit allowed-write-paths, banned git-mutation operations, and a `.opencode/specs/**` no-write constraint. RED-before-GREEN was required for the salvage fix. The dispatched agent correctly identified that the working tree already carried substantial unrelated, pre-existing dirty state (route-proof validation edits to `post-dispatch-validate.ts`, dependency bumps in `package.json`/`package-lock.json`, and many `.opencode/specs/**` changes from other in-flight work) and explicitly scoped its own diff to exclude all of it, noting this in its own final report. It also made one small justified deviation beyond the literal task list — the `validate.sh` routing fix — because without it the new rule could not actually be exercised via `SPECKIT_RULES=...` (the mechanism the pre-commit hook and this project's fast-path validation use).

Verification was performed independently by the orchestrating Claude Sonnet 5 session, not accepted on the dispatch's self-report: re-read the actual diffs for every touched file, re-ran the targeted and full test suites directly, re-ran the extended validation harness, and independently confirmed the pre-existing-contamination hypothesis for the 2 full-suite failures by cross-referencing the original (pre-dispatch) `git status` snapshot from the start of this session.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Deleted, not just stripped, the `cli-opencode/SKILL.md` marker** — the surrounding prose already fully covered the durable contract the comment was annotating, so the whole line was removed rather than leaving an empty comment shell.
- **`validate.sh` routing fix scoped to `SPECKIT_RULES`-filtered runs only** — the early-return only fires when the caller explicitly requests a rule subset; unfiltered `validate.sh --strict` runs are untouched, keeping blast radius to the exact new-rule-invocation path that needed it.
- **No registry backfill performed for codex** — the premise the backfill task was built on (a 0-finding registry) no longer matched live state (5 findings already present); documented as resolved-by-current-state rather than forcing an unnecessary write.
- **Root-cause trace grounded in code reading, not restated hypothesis** — confirmed `fanout-merge.cjs` rebuilds review registries from state-log `findingDetails`, not from iteration markdown files, which is why salvage-filename duplication could not have been the direct cause of a zero-finding registry (the two are unrelated code paths).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

1. **Marker removal**, independently re-run: `grep -rn "F-[0-9]\+-[A-Z0-9]\+-[0-9]\+"` across `.opencode/commands` and `.opencode/skills` — 0 hits remain in the originally-flagged files (`deep_review_auto.yaml`, `deep_research_auto.yaml`, `cli-opencode/SKILL.md`, `agent_delegation.md`); all remaining repo-wide hits are documented out-of-scope categories (test fixtures, `check-source-dist-alignment.ts` allowlist reasons, vitest `describe()` labels).
2. **New lint rule**, independently re-run: `bash .opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh` → full harness **110/110 pass**, including `COMMENT_HYGIENE_MARKER: 2/2 passed`.
3. **Salvage fix**, independently re-run: `npx vitest run tests/unit/fanout-salvage.vitest.ts tests/unit/fanout-merge.vitest.ts tests/unit/fanout-run.vitest.ts tests/unit/post-dispatch-validate.vitest.ts` → **109/109 pass**. Diff confirmed as the exact expected 1-line change at `fanout-salvage.cjs:112`.
4. **Full suite regression check**, independently re-run: `npx vitest run` (whole `deep-loop-runtime` package) → **557/559 pass, 2 failures** (`dependency-seams.vitest.ts`, `executor-provenance-mismatch.vitest.ts`). Confirmed **not regressions from this phase**: both files were already listed as modified (`M`) in this session's very first `git status` snapshot, before any child-003 work began — `post-dispatch-validate.ts`'s new route-proof validation logic and the `tsx`/`vitest`/`esbuild` version bumps in `package.json` are unrelated pre-existing work-in-progress on this branch, not something this child's dispatch introduced. This child's actual diff (`fanout-salvage.cjs`, `check-comment-hygiene.sh`, marker removals, `validate.sh`'s `SPECKIT_RULES` guard) touches neither failing test's subject matter.
5. **`validate.sh` routing fix**: read the actual diff directly — a single 3-line guard clause (`[[ -n "${SPECKIT_RULES:-}" ]] && return 1`), scoped only to rule-subset runs; confirmed via the same 110/110 extended-harness pass above (which exercises this exact path) and via direct `SPECKIT_RULES=COMMENT_HYGIENE_MARKER` smoke runs against both new fixtures (clean passes, violation fails at `spec.md:45`).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The 2 pre-existing test failures (`dependency-seams.vitest.ts`, `executor-provenance-mismatch.vitest.ts`) remain open — they belong to unrelated in-flight work on this branch, not this packet, and are out of scope to fix here.
<!-- /ANCHOR:limitations -->
