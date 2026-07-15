---
title: "Feature Specification: Version-Suffix Flag-Name Cleanup [template:level_2/spec.md]"
description: "Twelve live SPECKIT search and UX-hook feature flags carry a _V1 version suffix in their env-var name. A flag name is a stable runtime contract and must never encode a version number, because the version belongs in the changelog and the spec history rather than in the operator-facing knob. This phase performs a hard clean rename that drops the _V1 suffix from all twelve flags across the live reader code, every live consumer, every test that sets or asserts the env name, and the live reference docs, with no backward-compatible alias. The rename is confined to the live tree and never touches archived or historical records, because a record of what a flag was named at the time it was written must stay true to that moment."
trigger_phrases:
  - "version suffix flag rename"
  - "drop V1 from flag name"
  - "speckit flag name cleanup"
  - "env flag no version number"
  - "live vs archived rename boundary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/004-dark-flag-graduation/005-flag-name-cleanup"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Renamed twelve _V1 flags across the live tree, typechecks and vitest green"
    next_safe_action: "User reviews the deliberate non-renames and commits"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-flag-name-cleanup"
      parent_session_id: "phase-008-flag-name-cleanup"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether the documented-dead SPECKIT_PIPELINE_V2 and the eval-harness SPECKIT_EVAL_V2 config knobs are in scope, they are not, because the first is a record of a removed flag and the second is a harness-named config rather than a versioned feature flag"
---
# Feature Specification: Version-Suffix Flag-Name Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | COMPLETE |
| **Created** | 2026-06-24 |
| **Branch** | `system-speckit/004-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Twelve live SPECKIT feature flags carry a `_V1` version suffix in their environment-variable name. The reader code reads them by literal name at `search-flags.ts:682` and across the search and response libraries, the vitest suites set and assert the literal name, and the reference docs name the literal env var an operator would export. An env-flag name is a stable runtime contract shared by the code, the tests, the docs and the operator, and a version number does not belong in that contract. The version belongs in the changelog and the spec history. When the version lives in the flag name, a later revision either strands a misleading `_V1` on a flag that is now on its third behavior or forces a second hard rename, and an operator reading `SPECKIT_RESULT_CONFIDENCE_V1` cannot tell whether the `_V1` is load-bearing or vestigial.

The same twelve names also appear across archived spec folders, dead run logs and completed phase records. Those occurrences are a true record of the name as it stood when the work shipped. Renaming them would rewrite history and make a completed phase claim a name that did not exist at the time, so the rename must stop at the live-tree boundary.

### Purpose
Drop the `_V1` suffix from all twelve flags in one hard clean rename with no backward-compatible alias, so the reader code, every live consumer, every test and the live reference docs speak one suffix-less name. Confine the rename to the live tree and leave every archived or historical record untouched, so the runtime contract is clean going forward and the record of what was true in the past stays true.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The twelve flag readers and every live code consumer in `mcp_server/lib`, the eval scripts in `mcp_server/scripts/evals`, and the rerank benchmark arm in `mcp_server/benchmarks`, renamed to the suffix-less name.
- Every live vitest under `mcp_server/tests` that sets or asserts one of the twelve env names, including the `flag-ceiling.vitest.ts` drift guard that enumerates the live flag tokens.
- The live reference docs that name the twelve flags: `ENV_REFERENCE.md`, `references/config/environment_variables.md`, the `manual_testing_playbook`, the `feature_catalog`, and the `/memory:search` command assets.
- A hard rename only. No alias, no fallback that still reads the `_V1` name, so a stale export simply does nothing rather than silently working.

### Out of Scope
- Any occurrence under a `z_archive/` or `z_future/` directory, and any dead run log such as `fanout-lineage.out`, a `*.raw.json` seat dump or an archived `iteration-NNN.md`. These are immutable records of what was true then.
- The 028 spec-doc record tree under `.opencode/specs/`. Those completed phase children, benchmark results and research deltas record the old names as they stood at ship time and are a historical record, not live code or a live reference, so they are skipped and listed for review.
- `SPECKIT_PIPELINE_V2`. The changelog and feature catalog document it as a removed flag that is not read by any code, so its only live-tree occurrences describe a dead flag by its real historical name. Renaming it would corrupt that record.
- The `SPECKIT_EVAL_V2_OUTPUT`, `SPECKIT_EVAL_V2_KS` and `SPECKIT_EVAL_V2_LIMIT` config knobs in `run-eval-v2.mjs`. The `V2` names the eval harness, the env-var suffix is `_OUTPUT`/`_KS`/`_LIMIT`, so these are not versioned feature flags.
- Any change to flag default state, flag behavior, or the reader semantics. This phase changes only the spelling of the env-var name.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modify | The primary reader for all twelve flags, both the `isFeatureEnabled('...')` literal-arg readers and the `process.env.*` direct reads |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/*.ts` and `lib/response/profile-formatters.ts` | Modify | The live consumers that read the renamed flags in doc comments and reads |
| `.opencode/skills/system-spec-kit/mcp_server/tests/*.vitest.ts` | Modify | Every test that sets or asserts one of the twelve names, plus the `flag-ceiling.vitest.ts` drift-guard acknowledged-flag list |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/*.mjs` and `benchmarks/.../run_arm.py` | Modify | Live eval and benchmark consumers |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` and `references/config/environment_variables.md` | Modify | The operator-facing flag reference docs |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/**` and `feature_catalog/**` | Modify | The live testing-playbook and feature-catalog entries that name the flags |
| `.opencode/commands/memory/search.md` and `commands/memory/assets/search_presentation.txt` | Modify | The live `/memory:search` command surfaces that name the flags |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All twelve flags MUST drop the `_V1` suffix in the live reader code and every live consumer, with no aliased fallback that still reads the `_V1` name | `rg` over `.opencode/skills` returns zero occurrences of any of the twelve `_V1` flag names |
| REQ-002 | Every live vitest that sets or asserts one of the twelve env names MUST use the suffix-less name and MUST pass | The affected vitest files run green with the renamed names |
| REQ-003 | The rename MUST NOT touch any archived directory, dead run log or 028 spec-doc record | No file under `z_archive/`, `z_future/`, a dead-log path or the 028 `.opencode/specs/` record tree is modified |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The `flag-ceiling.vitest.ts` drift guard MUST recognise the renamed flags so it does not report them as unknown tokens | The drift-guard test passes with the renamed flags in its acknowledged list |
| REQ-005 | Both `mcp_server` typecheck targets MUST stay clean after the rename | `tsc --noEmit --composite false` exits 0 in the spec-kit and code-graph trees |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A repo-wide search of `.opencode/skills` finds zero of the twelve `_V1` flag names, proving the live rename is complete.
- **SC-002**: The affected vitest suite runs green, proving the tests assert the new names and the readers still resolve.
- **SC-003**: Both `mcp_server` typechecks exit 0, proving the rename introduced no type or name break.
- **SC-004**: No archived record, dead log or 028 spec-doc record file is modified, proving the live-versus-archived boundary held.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A consumer reads a flag by the old `_V1` name that the rename missed, so the flag silently never fires | High | Search every live reader by literal name, rename all of them, and assert zero `_V1` occurrences remain in the live tree |
| Risk | The rename leaks into an archived record and rewrites history | High | Scope the rename to an explicit live-file list, exclude `z_archive` and `z_future`, and skip the 028 spec-doc record tree for review |
| Risk | The `flag-ceiling` drift guard fails because it enumerates live flag tokens | Med | Add the renamed flags to the guard acknowledged list, which the rename surfaced was already drifting on the pre-existing names |
| Risk | A near-miss token such as `SPECKIT_EVAL_V2_OUTPUT` is renamed by an over-broad pattern | Med | Rename only the twelve exact flag names, never a prefix match, and confirm the harness config knobs are untouched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The rename is a pure name substitution with no runtime cost, no new read and no new branch.

### Reliability
- **NFR-R01**: With no alias, a stale export of an old `_V1` name resolves to the unset default rather than silently enabling a flag, so the failure mode is a no-op rather than a hidden behavior change.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A flag name that is a substring of a longer token, such as the eval-harness `SPECKIT_EVAL_V2_OUTPUT`: the rename matches only the exact twelve names, so the harness config knob is never touched.
- A doc that describes a removed flag by its historical name, such as `SPECKIT_PIPELINE_V2`: that occurrence is a record of a dead flag, so it is left as written.

### Error Scenarios
- An operator continues to export an old `_V1` name after the rename: with no alias the reader resolves the new name to its default and the old export does nothing, which is the intended hard-rename behavior.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | A mechanical name substitution across fifty-two live files, one drift-guard list edit, no behavior change |
| Risk | 8/25 | A missed reader silently disables a flag, and a leak into a record rewrites history, both mitigated by an explicit live-file list and a zero-occurrence assertion |
| Research | 5/20 | The full flag set and the live-versus-archived split were enumerated by `rg` and confirmed against the reader code before any edit |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The scope boundary, the deliberate non-renames and the live-versus-archived split are all resolved and recorded in the implementation summary.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

GO. The twelve flags are renamed across the live reader code, every live consumer, every test and the live reference docs, with no backward-compatible alias. The rename stopped at the live-tree boundary, so every archived record, dead run log and 028 spec-doc record kept its historical name. The two non-target flag families, the documented-dead `SPECKIT_PIPELINE_V2` and the eval-harness `SPECKIT_EVAL_V2` config knobs, were deliberately left and are listed for review. Both `mcp_server` typechecks exit 0 and the affected vitest suite runs green, including the `flag-ceiling` drift guard the rename surfaced was already drifting on the pre-existing names.
<!-- /ANCHOR:verdict -->
