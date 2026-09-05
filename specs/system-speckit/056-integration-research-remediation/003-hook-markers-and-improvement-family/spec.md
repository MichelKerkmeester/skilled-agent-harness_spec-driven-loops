---
title: "Feature Specification: Phase 3: hook-markers-and-improvement-family"
description: "Claude and Cursor hook registrations now carry the same self-diagnosing drift fallback as Codex and Devin, and the improvement/ artifact family the deep-improvement commands write is documented in the folder structure and checked by a validator rule."
trigger_phrases:
  - "hook drift marker claude cursor"
  - "mkHookDrift fallback"
  - "improvement artifact family"
  - "improvement config rule"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: hook-markers-and-improvement-family

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-metadata-drift-and-rules |
| **Successor** | 004-shared-parsers-and-post-run-refresh |
| **Handoff Criteria** | Every Claude and Cursor adapter registration carries the drift fallback and the parity test asserts it; `improvement/` is documented beside `research/` and `review/` and its config rule runs in `validate.sh` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the integration research remediation.

**Scope Boundary**: `.claude/settings.json`, `.cursor/hooks.json`, the runtime-mirrors doctor asset, the hook parity test, the folder-structure reference, one new rule and its registry entry, the skill README's rule count and the Claude and Cursor hook READMEs.

**Dependencies**:
- Phase 2 registered the previous rule; the registry is unordered so nothing here depends on it.

**Deliverables**:
- Drift-marker fallbacks on every Claude (21) and Cursor (17) adapter invocation, mirroring the Codex and Devin shape.
- Doctor asset rows for the new adapters and parity assertions per host.
- `improvement/` in `folder-structure.md` §3 and §4, and rule `IMPROVEMENT_ARTIFACTS` checking every `*-config.json` inside it.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Phase 005 of packet 054 gave Codex and Devin a self-diagnosing fallback: an adapter crash still answers the host and leaves a machine-detectable `mkHookDrift` marker plus a stderr line. Claude and Cursor were left out as a narrower shape and recorded as deferred; the research confirmed the gap and that no successor packet existed. Separately, `/deep:agent-improvement` and `/deep:model-benchmark` write an `improvement/` family into packets that the folder-structure reference never documented and no validator rule checked, unlike `research/` and `review/`.

**Purpose:** close the deferred hook debt on the same contract, and give the third local-owner artifact family the same documentation and shape check the other two have.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.claude/settings.json`, `.cursor/hooks.json`: `|| { stderr line; fallback JSON with "mkHookDrift":true; }` on every adapter invocation, syntax-checked.
- `doctor-runtime-mirrors.yaml` rows and `hook-adapter-path-parity.vitest.ts` assertions for both hosts.
- `references/structure/folder-structure.md` §3 and §4 for `improvement/`; `rules/check-improvement-artifacts.sh`; registry entry `IMPROVEMENT_ARTIFACTS` (warn).
- `README.md` rule count and the Claude and Cursor hook READMEs' fallback paragraph.

### Out of Scope
- Pi and OpenCode hook registrations: their adapters answer through a different surface.
- Nested-field checks on improvement configs: three generations of real configs share no nested keys.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | Every Claude and Cursor adapter registration answers the host on adapter failure with a marker the doctor route can read | P1 |
| REQ-002 | The parity test asserts the marker on every registration for both hosts | P1 |
| REQ-003 | `improvement/` is documented with owner, tree and validation pointer beside `research/` and `review/` | P2 |
| REQ-004 | Every `*-config.json` under `improvement/` parses and carries the fields every real generation shares; the rule is registered and reported | P2 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -c mkHookDrift` prints 21 for `.claude/settings.json` and 17 for `.cursor/hooks.json`; a renamed compiled adapter still yields exit 0, the marker on stdout and the stderr line.
- **SC-002**: Parity test 103 of 103; codex hook check OK.
- **SC-003**: The rule reports on a packet with `improvement/`, flags a malformed config, and appears in `validate.sh --help`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| A host rejects the fallback JSON shape | Hook reported as failed | Low | The fallback mirrors what each host's adapters print on success, taken from the adapters themselves |
| The rule's required-field set is too strict for an older config | False warning | Low | Fields are the intersection of three real generations; severity is warn |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
<!-- ANCHOR:ai-protocol -->
## 8. AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Read `generate-trigger-index.mjs` and `retrieval/lib/corpus.mjs` before touching the root derivation.
- Confirm the index is regenerated from the repository root, never from a subdirectory.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Root derivation | Anchor on `.opencode` plus `specs`; never count hops |
| Index data | Regenerate twice and compare hashes before committing |
| Documented counts | Every "<N>-rule registry" phrase must equal the registry length |

### Status Reporting Format
Report the root printed by the generator, the index hash of two runs, the per-root path counts, and the result lines of the new tests.
<!-- /ANCHOR:ai-protocol -->
