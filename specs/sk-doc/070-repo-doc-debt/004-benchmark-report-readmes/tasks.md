---
title: "Tasks: Benchmark report READMEs: restructure 235 legacy reports to the numbered template and resolve their broken references"
description: "Ordered tasks and verification checklist for the benchmark report README restructure."
trigger_phrases:
  - "benchmark report readmes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Benchmark report READMEs: restructure 235 legacy reports to the numbered template and resolve their broken references

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Two sets recur below. `R` is the set of 235 report READMEs the census names, and `V` is `validate_document.py --type readme --json`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Census the report READMEs by heading sequence (`*/benchmark/reports/*/README.md`). Verify: the census prints 235 files, and every one carries `## Run`, `## Files` and `## Reading This Folder` in that order, with no `---` line and a one-paragraph Reading This Folder section.
- [x] T002 Capture the before counts (`audit.json`). Verify: the audit prints `"template_invalid": 237`, `"broken_references": 102` and `"missing_key_artifacts": 14`, and `V` on one report prints `"valid": false` with the blocking error `Missing required section: overview`.
- [x] T003 [P] Read the numbering the renderer already uses (`*/benchmark/reports/*/README.md`). Verify: a report with a RESULTS section reads `## 1. OVERVIEW`, `## 2. RUN`, `## 3. RESULTS`, `## 4. FILES`, and one without reads `## 1. OVERVIEW`, `## 2. RUN`, `## 3. FILES`.
- [x] T004 [P] Write the transform and the line checker in the session scratch folder, outside the repo (`<scratch>/transform.py`). Verify: `git status` lists neither file.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Run the transform over the census (`R`). Verify: the transform prints `235 OK, 0 refused`.
- [x] T006 Rerun the transform on an already-transformed file (`R`). Verify: the rerun is refused, so a second pass cannot double-edit.
- [x] T007 Fix the reference to the removed benchmark runner (`.skilled/skills/sk-code/benchmark/reports/2026-06-02--d4r-live--live/README.md`). Verify: `rg -n 'skill-benchmark runner' <file>` prints the worded command and the sentence naming the removal, and no repo path is named.
- [x] T008 Rebuild the verdict baseline from the rewritten tree (`.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json`). Verify: before the rewrite `test_readme_verdict_parity.py` reports `diff_entries=235`, and after it prints `PARITY PASS: verdict diff is empty`.
- [x] T009 Write one patch entry per touched skill and set its carriers (`*/changelog/v<next>.md`). Verify: the 13 entries exist and each carrier names the same version, as in mcp-tooling `SKILL.md`, `description.json`, `mode-registry.json` and `hub-router.json` all at 1.8.5.0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Prove no fact moved (`R`). Verify: the line checker prints `checked=235 pass=235 fail=0` and exits 0.
- [x] T011 Validate every rewritten report (`R`). Verify: `V` returns 235 valid, 0 blocking errors and 0 warnings.
- [x] T012 Rerun the audit (`audit.json`). Verify: `"template_invalid"` is 2, and the two are `.skilled/commands/create/readme.md` and the `sk-create-repo-rule` fixture README.
- [x] T013 Run the manifest test (`.skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py`). Verify: it prints `SUMMARY: discovery=pass exclusions=21/21 manifest=reproducible`.
- [x] T014 Leave the gitignored log references and record why (`.skilled/skills/system-spec-kit/benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-live-four-cli/README.md`). Verify: `git check-ignore -v` matches `.gitignore:299:*.log` for each of the five paths.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `V` over the 235 prints 235 valid with 0 blocking errors, and the parity test prints an empty verdict diff

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task keeps `[B]` and its reason in this file rather than turning into a silent skip.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md section 3
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: plan.md section 6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every rewritten report passes the README validator. Evidence: `V` over the 235: 235 valid, 0 blocking errors
- [x] CHK-011 [P0] No new validator warning on a rewritten report. Evidence: the same run reports 0 warnings
- [x] CHK-012 [P1] Failure path handled: a file outside the census is refused and left as it was. Evidence: `235 OK, 0 refused` over the census, and a rerun on a transformed file is refused by the idempotence guard
- [x] CHK-013 [P1] Edits follow the owning template. Evidence: heading names and numbering read off reports the current renderer wrote, where FILES is 3 without a RESULTS section and 4 with one
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md
- [x] CHK-021 [P0] Diffs reviewed for lost or invented lines. Evidence: the line checker prints `checked=235 pass=235 fail=0`
- [x] CHK-022 [P1] Edge cases checked. Evidence: the two-line `>` quote in the ux-hooks-3 preamble is untouched, and none of the 235 has a RESULTS section
- [x] CHK-023 [P1] Before and after counts measured from reruns. Evidence: `template_invalid` 237 -> 2 and `broken_references` 102 -> 101, both from the same audit command
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: the 235 are `class-of-bug`, one layout fixed once; the removed-runner reference is `instance-only`; the five gitignored log references are `matrix/evidence` and stay
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: `rg -n '^## Run$' --glob '**/benchmark/reports/*/README.md'` prints nothing after the pass
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: plan.md affected-surfaces table names all five consumers, each answered by a rerun
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: the two-line `>` quote covers the delimiter case, a file outside the census covers outside-root, a second pass covers no-op, and a mismatched heading sequence covers the fallback
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: plan.md names the shape axis and the outcome axis
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: N/A, the transform reads no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: the line checker compares each file with its HEAD revision, so every result is a HEAD-against-worktree range
- [x] CHK-FIX-008 [P2] Every finding left in place names the lane that owns it. Evidence: spec.md section 10
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: documentation-only diff
- [x] CHK-031 [P0] Input validation implemented. Evidence: the transform refuses a file whose heading sequence differs from the census, and refuses a file that already carries the new headings
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: N/A, no service and no credential
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: `validate.sh --strict` on this folder
- [x] CHK-041 [P1] Code comments adequate. Evidence: N/A, no tracked code changed; the transform lives outside the repo
- [x] CHK-042 [P2] README updated (if applicable). Evidence: Files Changed table in implementation-summary.md
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the transform, the census and the audit JSON sat in the session scratch folder, outside the repo; `git status` lists none of them
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `ls -a scratch` lists `.gitkeep` only
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->

---
