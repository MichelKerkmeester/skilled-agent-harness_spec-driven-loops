---
title: "Feature Specification: Doc validation off switches"
description: "Gives people who do not care whether their docs drift from the expected formats two local off switches: SPECKIT_SKIP_VALIDATION for spec folders and SKDOC_SKIP_VALIDATION for every sk-doc validator. Both persist in hook-flags.env and CI keeps enforcing."
trigger_phrases:
  - "doc validation off switch"
  - "skip spec validation"
  - "skdoc skip validation"
  - "disable sk-doc validators"
  - "hook flags trailing comment"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/062-doc-validation-off-switches"
    last_updated_at: "2026-09-28T11:08:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Made every reader of hook-flags.env drop a comment after a value"
    next_safe_action: "None, the packet is complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh"
      - ".skilled/skills/sk-doc/shared/scripts/validation_switch.py"
      - ".skilled/skills/sk-doc/shared/scripts/validation-switch.cjs"
      - ".skilled/hooks/shared/hook-flags.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "One switch per family: SPECKIT_SKIP_VALIDATION for spec docs, SKDOC_SKIP_VALIDATION for sk-doc"
      - "Both can be set in the environment or saved in hook-flags.env"
      - "Local only: CI keeps enforcing this repository's formats"
      - "After close, the operator approved a '#' after a space or tab ending a value in every reader of hook-flags.env"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Doc validation off switches

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-28 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`SPECKIT_SKIP_VALIDATION` exists but traps commits. With it set, `validate.sh --json` prints nothing on stdout, so `repair-derived.cjs` reads the packet as unreadable and the pre-commit spec re-mint gate blocks every commit that stages a spec doc. `SPECKIT_VALIDATION=false` has the same trap and prints prose where JSON is expected. Both switches live only in the environment, and sk-doc's validators have no off switch at all: `SKDOC_ENFORCE_STRUCTURE=0` relaxes three structure rules inside one validator.

### Purpose
Someone who does not care whether their docs drift from the expected formats turns validation off once, in the environment or in `hook-flags.env`, and then commits and runs the doc workflows without validation blocking them, while CI keeps enforcing this repository's formats.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `validate.sh` reads `SPECKIT_SKIP_VALIDATION` after argument parsing, from the environment or `hook-flags.env`, and prints a valid skipped report under `--json`. `SPECKIT_VALIDATION=false` takes the same path.
- The shared flag resolvers gain a public check for a named flag: `hook_flag_on` in the shell mirror and `isFlagOn` in the Node resolver.
- `SKDOC_SKIP_VALIDATION` in the check path of every sk-doc validator, through one Node helper and one Python helper.
- Tests for the resolvers, `validate.sh`, the commit trap and the sk-doc helpers with representative validators.
- Docs: the runtime env reference, spec-kit's validation references and feature catalog, sk-doc's core standards, its validation and enforcement reference and its shared scripts README, both hooks READMEs and the example flags file.
- Added after close at the operator's request: every reader of `hook-flags.env` ends a value at a `#` that follows a space or tab. The docs say to uncomment the example's lines, and those lines carry a comment after the value, so each one, the hook kill switches included, now works as it stands.
- Added after the deep review of 2026-09-28 (`review/review-report.md`), at the operator's request to fix every finding: `progressive-validate.sh --json` keeps the skip notice off stdout and reports `skipped`, the shell and dist readers agree with the Node and Python readers on trimming, presence and a byte order mark, `quality-audit.sh` and the strict-pass freshness sweep report a skipped folder as skipped, `.env.example` names both switches and the hooks README states the comment rule with its tab case.

### Out of Scope
- CI workflows - they keep enforcing. Neither the environment variable nor the gitignored `hook-flags.env` reaches a CI run.
- Spec-kit checks that carry their own switches, such as the spec gate, the completion sentinel and post-edit quality - the docs point to them.
- Command workflows that wait for a validator's `PASSED` line - a skipped validator says it skipped, and the reader decides.
- `validate_report.py`, the create-diff report validator - it proves a generated report is safe to open, with no script, no external reference and the required Content-Security-Policy, rather than checking a format, so it keeps running.
- The routing and metadata CI gates (`ci-*.cjs`) - pre-push already has `SPECKIT_SKIP_PREPUSH_SKILL_GATE` for them.
- `audit_readmes.py` - it reports and always exits 0. It reads `validate_document.py --json`, which a skip answers with `valid: true`.
- The dead `SPECKIT_SKIP_DOC_MODEL_VALIDATE` mentions in the git hook installer, its README and one test - recorded as a follow-up.
- `upgrade-legacy.mjs`, the legacy spec folder upgrade tool, which reads a skipped report's `passed: true` as a pass - it belongs to the upgrade tooling and is recorded as a follow-up.
- Barter coder's copy of the framework - a separate repository.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/shared/hook-flags.sh` | Modify | Public `hook_flag_on NAME` over the existing resolver, plus the comment rule: a `#` after a space or tab ends a value |
| `.skilled/hooks/shared/hook-flags.cjs` | Modify | `isFlagOn(name, env, config)` with the same precedence as `isHookEnabled`, plus the same comment rule |
| `.skilled/hooks/shared/hook-flags.test.cjs` | Modify | Tests for both new checks, plus one that holds all four readers of the file to the same values |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | Modify | The dist checker's own reader of the file takes the same comment rule |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modify | Skip after parsing, file persistence, skipped JSON report, help text |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/validate-skip-switch.vitest.ts` | Create | Switch behavior of `validate.sh` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts` | Modify | The commit trap as a regression test |
| `.skilled/skills/sk-doc/shared/scripts/validation-switch.cjs` | Create | Node helper over `isFlagOn` |
| `.skilled/skills/sk-doc/shared/scripts/validation_switch.py` | Create | Python helper that mirrors the resolver, comment rule included |
| 13 Python validators under `.skilled/skills/sk-doc/` | Modify | Guard in the command-line entry |
| 7 Node validators under `.skilled/skills/sk-doc/` | Modify | Guard in the command-line entry, check modes only |
| `.skilled/skills/sk-doc/scripts/tests/test_validation_switch.py` | Create | Helper and validator tests the CI runner picks up, including one that uncomments every switch line of the example |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | The `SPECKIT_SKIP_VALIDATION` row |
| `.skilled/skills/system-spec-kit/references/validation/path-scoped-rules.md` | Modify | The environment table |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modify | The environment table |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md` | Modify | The entry point paragraph |
| `.skilled/skills/sk-doc/shared/references/core-standards.md` | Modify | `SKDOC_SKIP_VALIDATION` beside `SKDOC_ENFORCE_STRUCTURE` |
| `.skilled/skills/sk-doc/sk-create-quality-control/references/validation-and-enforcement.md` | Modify | A validation off switch subsection |
| `.skilled/skills/sk-doc/shared/scripts/README.md` | Modify | A contents row for the two helpers |
| `.skilled/hooks/README.md` | Modify | The two switches under Setting flags, plus the comment rule |
| `.skilled/hooks/shared/README.md` | Modify | `isFlagOn` and `hook_flag_on` in the resolver docs, plus the comment rule with its four readers |
| `.skilled/hooks/hook-flags.env.example` | Modify | A validation section, plus a header line on the comment rule |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh` | Modify | Review fix: capture `validate.sh`'s stdout apart from its stderr under `--json`, and report `skipped` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh` | Modify | Review fix: count a switched-off folder as skipped, never as a pass |
| `.skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts` | Modify | Review fix: a `skipped` status, counted apart, that a later baseline never reads as a pass or a known failure |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/progressive-validation.vitest.ts` | Modify | The switch at level 1 and at the default level |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/quality-audit-script.vitest.ts` | Modify | A skipped folder in JSON and text output |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/strict-pass-freshness.vitest.ts` | Modify | A skipped folder, and a skipped baseline row followed by a failure |
| `.skilled/skills/system-spec-kit/runtime/cli/sweep/README.md` | Modify | The full status list, `skipped` included |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/progressive-validation-for-spec-documents.md` | Modify | The `skipped` field in the wrapper's JSON report |
| `.env.example` | Modify | Review fix: both switches in Section 5 |

The 13 Python validators are `validate_document.py`, `quick_validate.py`, `check_authored_name_kebab.py`, `check_no_hyphenated_catalog_content.py`, `check_no_new_snake_case.py`, `check_no_numbered_categories.py`, `check_no_numbered_snippet_files.py` and `resolve_skill_markdown_links.py` in `shared/scripts/`, plus `validate_catalog_package.py`, `check_derived_readme_counts.py`, `check_readme_references.py`, `validate_skill_package.py` and `hvr_scan.py` in their modes' `scripts/` folders. The 7 Node validators are `frontmatter-version.mjs` (gate and verify), `validate-doc-model-refs.js`, `check-goal.cjs`, `validate-playbook-package.cjs`, `check-repo-rules.cjs`, `validate-compiled-routing-scenarios.cjs` and `validate-playbook-topology.cjs`. `check-frontmatter-versions.sh` runs `frontmatter-version.mjs gate`, so it follows without an edit.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `SPECKIT_SKIP_VALIDATION` on, a commit that stages a spec doc passes the pre-commit spec re-mint gate, because `validate.sh --json` prints a skipped report that `repair-derived.cjs` reads as nothing to repair |
| REQ-002 | `SPECKIT_SKIP_VALIDATION` resolves from the environment first and `hook-flags.env` second. Whether the environment variable is set decides, never what it holds, so a set value wins even when it is `0` or empty. Only `1`, `true`, `yes` or `on` turn the switch on, and every reader trims only the value's edges, so `o n` stays off |
| REQ-003 | `SKDOC_SKIP_VALIDATION`, set either way, makes the check path of every sk-doc format validator print one notice on stderr and exit 0 without checking. The create-diff report validator checks safety rather than format and keeps running |
| REQ-004 | Modes that write or that test the tool stay live under the switch: `validate_document.py --fix`, the `--self-test` of the two README checkers and the link resolver, and `frontmatter-version.mjs compute` and `apply`. Imports of validator functions by other scripts are unaffected |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A skipped run that was asked for JSON still prints valid JSON on stdout. An sk-doc validator prints `{"skipped": true, "valid": true, ...}`, so a caller that reads `valid` counts the skip as no finding. `progressive-validate.sh --json` does the same at level 1 and at the aggregate levels, and its report carries `skipped: true` |
| REQ-006 | CI keeps enforcing: no workflow sets either switch or points `HOOK_FLAGS_CONFIG` at a file |
| REQ-007 | The docs name both switches, how to save them and what they leave on |
| REQ-008 | The four readers of `hook-flags.env` (`hook-flags.cjs`, `hook-flags.sh`, `validation_switch.py` and `check-dist-staleness.sh`) end a value at a `#` that follows a space or tab, return the same value for every line, a first line behind a UTF-8 byte order mark included, and read every switch line of the example as on once it is uncommented |
| REQ-009 | A local audit that finds validation switched off reports the folder as skipped, never as passed. `quality-audit.sh` counts it apart, and the strict-pass freshness sweep gives it a `skipped` status that a later baseline never reads as a pass or a known failure |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `SPECKIT_SKIP_VALIDATION=1 node repair-derived.cjs --folder <packet>` exits 0, where it exits 2 before the fix.
- **SC-002**: With each switch saved only in a `HOOK_FLAGS_CONFIG` file, `validate.sh`, a Python validator and a Node validator all skip, and `=0` in the environment brings validation back.
- **SC-003**: `SYSTEM_DIST_FRESHNESS_DISABLED=1  # note`, saved as the example writes it, stops the dist checker before it runs its Node helper, where the old parser ran it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `hook-flags.env` parse rules in `hook-flags.cjs` | The Python helper must read the file the same way | The Python helper mirrors `loadConfigFile` and a test pins the shared cases |
| Risk | `SPECKIT_SKIP_VALIDATION` moves from any non-empty value to the truthy set | Low | Nothing in the repository sets it, `1` and `true` keep working, and the env reference records the change |
| Risk | A saved switch also silences validators inside local test runs | Med | The notice names where the switch was set, and the docs say to unset it for the suites |
| Risk | A skipped report carries `passed: true`, as a track root's report does | Low | The report also carries `skipped: true` and an info entry, and the local audit and sweep tools report a skipped folder as skipped |
| Risk | A saved line with a comment after its value had no effect before and now takes effect | Low | The value was written to turn its switch on, and the example keeps every switch line commented out |
| Risk | A value can no longer hold a space or tab followed by `#`, even in quotes | Low | Every value in the file is a one-word switch value, and `a#b` keeps its `#` |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: With a switch off, a validator pays one small file read at most and starts no extra process.
- **NFR-P02**: `validate.sh` resolves its switch inside the shell, without a Node call.

### Security
- **NFR-S01**: The flags file is parsed as `KEY=value` text and never sourced or evaluated.
- **NFR-S02**: The switches only relax checks. None of them writes a file.

### Reliability
- **NFR-R01**: A missing or unreadable `hook-flags.env` never turns a switch on.
- **NFR-R02**: A skip never hides a bad argument: `validate.sh` still rejects a missing folder.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: `SPECKIT_SKIP_VALIDATION=` in the environment wins over the file and leaves validation on.
- Maximum length: not applicable, the value is one short token.
- Invalid format: a value outside `1`, `true`, `yes` and `on` leaves validation on, and quoted file values such as `"1"` count as on.
- Trailing comment: `NAME=1  # why` and `NAME="on" # why` read as on in all four readers, while `NAME=a#b` keeps its `#` and `NAME= # why` reads as empty.
- Inner whitespace: `o n`, in the file or the environment, reads as off in all four readers, while ` on ` reads as on.
- Byte order mark: a file saved as UTF-8 with a signature reads its first line the same as a file without one.

### Error Scenarios
- External service failure: none, the switches read local state only.
- Network timeout: not applicable.
- Concurrent access: several validators can read the flags file at once, since it is read-only to them.

### State Transitions
- Partial completion: both switches on skip each family on its own, and one on leaves the other family validating.
- Session expiry: `--help` still prints its usage with a switch on.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | About 35 files and 600 lines across three languages and two skills, plus fourteen files in the review fixes |
| Risk | 8/25 | Local only, default off, CI unchanged, one documented semantics change |
| Research | 8/20 | Every consumer of the `validate.sh` JSON and of each validator was traced first |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose one switch per family, the environment or `hook-flags.env` as the place to set them, and local scope only.
<!-- /ANCHOR:questions -->

---
