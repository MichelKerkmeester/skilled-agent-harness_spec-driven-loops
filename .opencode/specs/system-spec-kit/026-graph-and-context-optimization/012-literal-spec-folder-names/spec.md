---
title: "Feature Specification: Improve AI-driven spec folder and phase naming so AI-chosen slugs describe concrete work being built or fixed rather than generic placeholders like remediation or phase-N [template:level_2/spec.md]"
description: "AI-derived spec-folder and phase slugs default to generic placeholders (remediation, phase-N) across 10 generation surfaces with no enforcement of literal subject tokens."
trigger_phrases:
  - "literal naming"
  - "phase names"
  - "spec folder names"
  - "remediation packet naming"
  - "create.sh fallback"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/012-literal-spec-folder-names"
    last_updated_at: "2026-05-19T07:48:17Z"
    last_updated_by: "claude-code"
    recent_action: "Populated Level 2 documents"
    next_safe_action: "Implement intervention per tasks.md"
    blockers: []
    key_files:
      - ".opencode/commands/spec_kit/assets/spec_kit_plan_auto.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_plan_confirm.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_complete_confirm.yaml"
      - ".opencode/skills/system-spec-kit/scripts/spec/create.sh"
      - ".opencode/commands/spec_kit/complete.md"
      - ".opencode/skills/system-spec-kit/SKILL.md"
      - ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/012-literal-spec-folder-names"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Symlink topology (Packet A): keep symlinks pointing at sk-doc home"
      - "Ambiguous-content fate (Packet A): generalize §5 + §9 Q7"
      - "Validation enforcement scope (Packet B): prompt + bash + skill only, no validate.sh lint"
      - "Literal short-names (Packet B): confirmed 012-literal-spec-folder-names"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Improve AI-driven spec folder and phase naming so AI-chosen slugs describe concrete work being built or fixed rather than generic placeholders like remediation or phase-N

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-19 |
| **Branch** | `scaffold/012-literal-spec-folder-names` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
AI-derived spec-folder and phase slugs frequently default to generic placeholders that do not describe the concrete work being shipped. Three live examples in `.opencode/specs/` are `005-deep-review-p1-p2-remediation`, `004-remediation`, and `001-remediation` (see Dispatch B §3 evidence table). Naming guidance is currently spread across 10 generation surfaces (see Dispatch B §1 inventory: 4 YAML workflows, 2 `create.sh` fallbacks, 1 `complete.md` Q8 prompt, 1 feature catalog entry, 1 `SKILL.md` rule, and 1 implicit `/spec_kit:plan` remediation flow) but none of them enforces literal naming with a specific subject token. The result is that resume/handover and graph traversal lose semantic signal because the slug itself carries no information about what the packet fixes or builds.

### Purpose
AI-chosen spec-folder and phase slugs include a specific subject token describing the concrete work (e.g. `fix-singleton-leak-in-launcher`) instead of generic placeholders (`remediation`, `phase-N`, `cleanup`).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rank 1: Rewrite the `Generate phase names` activity in the 4 YAML workflow files (`spec_kit_plan_auto.yaml`, `spec_kit_plan_confirm.yaml`, `spec_kit_complete_auto.yaml`, `spec_kit_complete_confirm.yaml`) to require a literal slug with a specific subject token.
- Rank 2: Update both `create.sh` auto-generated fallback sites (line 1084 and line 571) to emit a descriptive placeholder slug plus a stderr warning when `--phase-names` is omitted.
- Rank 3: Rewrite `complete.md:186-188` Q8 with concrete bad-vs-good examples.
- Rank 4: Insert a new `REMEDIATION PACKET NAMING` rule as rule 20 in the `ALWAYS` section of `system-spec-kit/SKILL.md`.

### Out of Scope
- `validate.sh` lint rule that rejects bare-stoplist slugs: deferred to a follow-on packet per operator decision (see §10 Open Questions resolution 3).
- Retroactive rename of existing generic packets (`005-deep-review-p1-p2-remediation`, `004-remediation`, etc.): naming guidance applies to new packets only.
- `create.sh` fail-hard mode: working hypothesis is warn-only fallback (operator decision; see §10 Open Questions resolution 3).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/spec_kit/assets/spec_kit_plan_auto.yaml` | Modify | Rewrite `Generate phase names` activity at lines 47-48 (Dispatch B §1 Surface 3) |
| `.opencode/commands/spec_kit/assets/spec_kit_plan_confirm.yaml` | Modify | Apply same rewrite at lines 47-48 (Dispatch B §1 Surface 4) |
| `.opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml` | Modify | Apply same rewrite at lines 73-74 (Dispatch B §1 Surface 5) |
| `.opencode/commands/spec_kit/assets/spec_kit_complete_confirm.yaml` | Modify | Apply same rewrite at lines 61-62 (Dispatch B §1 Surface 6) |
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | Modify | Replace fallback slug at line 1084 + emit stderr warning (Dispatch B §1 Surface 1) |
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | Modify | Replace hardcoded `001-phase-one` at line 571 + emit stderr warning (Dispatch B §1 Surface 2) |
| `.opencode/commands/spec_kit/complete.md` | Modify | Rewrite Q8 prompt at lines 186-188 with bad-vs-good examples (Dispatch B §1 Surface 7) |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modify | Insert new rule 20 (REMEDIATION PACKET NAMING) in `ALWAYS` section near line 413 (Dispatch B §1 Surface 9) |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Modify | Refresh phase-naming entry at line 4338 to mention literal-naming guidance (Dispatch B §1 Surface 8) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rewrite the `Generate phase names` activity in `spec_kit_plan_auto.yaml:47-48` to require a literal slug with a specific subject token, naming both bad placeholder shapes (`phase-1`, `remediation`, `cleanup`) and good shapes (`data-model-design`, `api-implementation`). | `grep -F "LITERAL phase names" .opencode/commands/spec_kit/assets/spec_kit_plan_auto.yaml` returns ≥1 match; `python3 -c "import yaml; yaml.safe_load(open('.opencode/commands/spec_kit/assets/spec_kit_plan_auto.yaml'))"` exits 0. |
| REQ-002 | Apply the same canonical rewrite verbatim to `spec_kit_plan_confirm.yaml:47-48`, `spec_kit_complete_auto.yaml:73-74`, and `spec_kit_complete_confirm.yaml:61-62`. | All 4 YAML files contain the identical `Generate LITERAL phase names …` activity string and each parses cleanly under `yaml.safe_load`. |
| REQ-003 | Update `create.sh:1084` fallback to emit `phase-${_phase_number}-PROVIDE-DESCRIPTIVE-SLUG` plus a stderr warning `"[speckit] Warning: Falling back to generic phase name '$_child_slug'. Provide --phase-names with literal slugs."` when `PHASE_NAME_ARRAY` is exhausted (per Dispatch B §4 Rank 2). | Smoke-running `create.sh … --phase --phase-count 3` without `--phase-names` to a `/tmp` scratch dir produces folder names containing `-PROVIDE-DESCRIPTIVE-SLUG` and prints the warning on stderr. |
| REQ-004 | Replace the hardcoded `local child_name="001-phase-one"` at `create.sh:571` with `local child_name="001-validation-phase-PROVIDE-DESCRIPTIVE-SLUG"` plus the same stderr warning shape (per Dispatch B §1 Surface 2). | `grep -n 'PROVIDE-DESCRIPTIVE-SLUG' .opencode/skills/system-spec-kit/scripts/spec/create.sh` returns ≥2 matches (line 571 + line 1084 region); `bash -n create.sh` exits 0 (syntax-clean). |
| REQ-005 | Rewrite the Q8 prompt at `complete.md:186-188` with literal-naming guidance plus concrete bad-vs-good examples (`fix-singleton-leak-in-launcher` vs `cleanup` / `remediation`). | `grep -F "fix-singleton-leak-in-launcher" .opencode/commands/spec_kit/complete.md` returns ≥1 match and the prompt block at lines 186-188 contains both an "avoid" list (generic) and an "example" list (literal). |
| REQ-006 | Insert `REMEDIATION PACKET NAMING` as new rule 20 in the `ALWAYS` section of `system-spec-kit/SKILL.md` (after current rule 19, near line 413), requiring names to reference both the source (e.g. `fix-deep-review-p1-p2-…`) and the target (`…-for-sk-doc-skill`), and forbidding bare `remediation` / `cleanup` / `phase-N` slugs. | `grep -F "REMEDIATION PACKET NAMING" .opencode/skills/system-spec-kit/SKILL.md` returns ≥1 match; `grep -c '^## ' .opencode/skills/system-spec-kit/SKILL.md` returns the pre-existing section count (rule insertion does not change the `## ` section count). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Refresh the phase-naming convention entry in `system-spec-kit/feature_catalog/feature_catalog.md:4338` to mention the new literal-naming guidance plus the `--phase-names` warning behaviour (per Dispatch B §1 Surface 8). | `grep -F "literal" .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` matches the updated entry; entry length grows by ≥1 sentence vs the pre-edit baseline. |
| REQ-008 | All 4 modified YAML files remain valid YAML after edits. | `for f in .opencode/commands/spec_kit/assets/spec_kit_{plan,complete}_{auto,confirm}.yaml; do python3 -c "import yaml; yaml.safe_load(open('$f'))"; done` completes with no exceptions (exit 0 for each). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 YAML files parse cleanly. `python3 -c "import yaml; yaml.safe_load(open(f))"` returns exit 0 for `spec_kit_plan_auto.yaml`, `spec_kit_plan_confirm.yaml`, `spec_kit_complete_auto.yaml`, `spec_kit_complete_confirm.yaml`.
- **SC-002**: `create.sh` synthetic phase scaffold emits the new placeholder slug AND the stderr warning when `--phase-names` is omitted (smoke-run against `/tmp/speckit-naming-smoke-$$`).
- **SC-003**: `grep -c '^## ' .opencode/skills/system-spec-kit/SKILL.md` returns the pre-existing top-level section count (rule 20 insertion is inside the `ALWAYS` subsection; it must not add a new `## ` heading).
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-literal-spec-folder-names --strict` exits 0 after implementation.
- **SC-005**: Manual smoke-test (operator-driven, post-implementation): invoke `/spec_kit:plan :auto` against a synthetic ambiguous task and verify the AI-proposed packet name contains a specific subject token, not a generic placeholder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | system-spec-kit YAML loader (`python3 yaml.safe_load`) | If a malformed activity string breaks the loader, all `/spec_kit:plan` and `/spec_kit:complete` workflows fail | Post-edit `yaml.safe_load` smoke-test on each of the 4 files before commit |
| Risk | Warn-only `create.sh` fallback may be insufficient to change AI behaviour if the YAML rewrite does not reach the active prompt | Medium: guidance ships but generic names may still appear in practice | SC-005 manual smoke-test before claiming done; defer fail-hard / validate.sh lint to a follow-on packet (operator-confirmed) |
| Risk | `SKILL.md` section count regression if rule 20 inadvertently introduces a new `## ` heading | Low: would break the family-contract floor for `system-spec-kit` skill structure | SC-003 `grep -c '^## '` check before/after the edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `create.sh` edits add ≤1 echo statement per fallback site. No measurable runtime impact on scaffold operations.
- **NFR-P02**: YAML activity strings remain single-line. No parser slowdown in `/spec_kit:plan` / `/spec_kit:complete` workflow loads.

### Security
- **NFR-S01**: No new secrets, env reads, or filesystem writes are introduced.
- **NFR-S02**: stderr warning text contains no user-controlled interpolation beyond `$_child_slug` (already a slugified token).

### Reliability
- **NFR-R01**: All 4 modified YAML workflows remain syntactically valid (`yaml.safe_load` exit 0).
- **NFR-R02**: `create.sh` exit code is unchanged on the fallback path (warning is non-fatal; `echo … >&2` does not return non-zero).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: `--phase-names ""` or omitted entirely. `create.sh` emits the new placeholder slug (`phase-N-PROVIDE-DESCRIPTIVE-SLUG`) on stderr warning and proceeds (warn-only, per operator decision).
- Maximum length: Slugs remain bounded by existing `slugify_token` logic in `create.sh` lib; new placeholder is well under any reasonable filesystem limit.
- Invalid format: Single-word slugs like `setup` or `cleanup` are NOT blocked by this packet (no lint added per scope decision); the YAML instruction names them explicitly as generic but does not enforce rejection.

### Error Scenarios
- External service failure: N/A (documentation/instruction edits only).
- Network timeout: N/A.
- Concurrent access: N/A (`create.sh` is invoked per-packet, no shared mutable state).

### State Transitions
- Partial completion: If only some of the 4 YAML files are updated, the `parity` requirement (REQ-002) fails. Mitigate by sequencing Phase 1 (canonical wording) before Phase 2 (parallel apply).
- Session expiry: N/A.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 8 files touched (4 YAML + 2 hunks in create.sh + complete.md + SKILL.md + feature_catalog.md); ~60 LOC total change |
| Risk | 5/25 | Documentation-instruction-only; no schema/API/persistence change; warn-only fallback |
| Research | 3/20 | Dispatch B inventory is complete; intervention points are pre-ranked |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

All four open questions from the original plan were resolved before exiting plan mode:

1. ~~Should the default fallback in `create.sh` remain as "phase-N" with a warning, or should it fail hard when `--phase-names` is not provided?~~ **Resolved**: warn-only fallback with descriptive placeholder slug; fail-hard mode deferred (operator decision).
2. ~~Should remediation packet naming be enforced via `validate.sh` lint rules?~~ **Resolved**: NO `validate.sh` lint addition in this packet; prompt-instruction + bash fallback + skill rule only; may be lifted into a follow-on packet later (operator decision).
3. ~~Should there be a distinction between phase naming and remediation packet naming?~~ **Resolved**: same literal-naming rule applies to both, generalize the guidance across all surfaces (operator decision).
4. ~~Should existing generic-named remediation packets be renamed as part of this work?~~ **Resolved**: NO. Shorter literal slugs apply to new packets going forward; existing generic packets stay untouched (operator decision).
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
