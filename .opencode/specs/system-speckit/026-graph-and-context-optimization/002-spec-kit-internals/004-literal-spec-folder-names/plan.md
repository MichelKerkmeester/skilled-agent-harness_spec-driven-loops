---
title: "Implementation Plan: Improve AI-driven spec folder and phase naming so AI-chosen slugs describe concrete work being built or fixed rather than generic placeholders like remediation or phase-N [template:level_2/plan.md]"
description: "Documentation-layer behavioral nudge: rewrite naming guidance across 4 YAML workflows, 2 create.sh fallback sites, complete.md Q8, and a new SKILL.md ALWAYS rule, with verification via YAML parse + create.sh smoke + validate.sh --strict."
trigger_phrases:
  - "literal naming plan"
  - "phase names plan"
  - "create.sh fallback plan"
  - "remediation packet rule"
  - "plan core"
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
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Improve AI-driven spec folder and phase naming so AI-chosen slugs describe concrete work being built or fixed rather than generic placeholders like remediation or phase-N

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML + Bash + Markdown |
| **Framework** | N/A (instruction-layer edits to existing system-spec-kit assets) |
| **Storage** | git (file-level edits committed to main) |
| **Testing** | `python3 yaml.safe_load` on 4 YAML files + `create.sh` synthetic phase-scaffold smoke-test + `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict` + manual `/spec_kit:plan :auto` smoke |

### Overview
This packet ships the 4 ranked intervention points from Dispatch B §4 in a single coordinated patch: (1) rewrite the `Generate phase names` YAML activity in all 4 plan/complete workflow files to require literal subject tokens, (2) update both `create.sh` fallback sites (line 1084 and line 571) to emit a descriptive placeholder slug plus stderr warning when `--phase-names` is omitted, (3) rewrite the `complete.md:186-188` Q8 prompt with concrete bad-vs-good examples, and (4) insert a new `REMEDIATION PACKET NAMING` rule as rule 20 in the `ALWAYS` section of `system-spec-kit/SKILL.md`. Scope is documentation-instruction-only: no `validate.sh` lint addition and no fail-hard create.sh mode (both deferred per operator decision in §10 of spec.md).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Plan-mode approval received from operator (resolution of 4 open questions captured in spec.md §10)
- [x] Dispatch B inventory report read in full (`/tmp/devin-report-literal-naming.md`, 10 surfaces classified, 4 intervention points ranked)
- [x] All 8 target files exist at the exact line numbers cited in Dispatch B §1

### Definition of Done
- [ ] All 5 success criteria from spec.md §5 met (YAML parse, create.sh smoke, SKILL.md section count, validate.sh --strict, manual /spec_kit:plan smoke)
- [ ] All 4 YAML files still parse cleanly via `yaml.safe_load`
- [ ] Spec docs (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md) synchronized after implementation
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-layer behavioral nudge across 3 surface types (YAML workflow / Bash fallback / Markdown prompt) plus 1 skill ALWAYS-rule insertion. No new code paths, no schema changes. The goal is to make the AI's literal-naming behaviour fall out of the prompt material it already reads on every `/spec_kit:plan` and `/spec_kit:complete` invocation.

### Key Components
- **YAML `Generate phase names` activity**: the highest-impact surface. Every `/spec_kit:plan` and `/spec_kit:complete` workflow loads this activity instruction during phase decomposition (Dispatch B §4 Rank 1).
- **`create.sh` fallback logic**: a safety net for when the AI proposes phases without explicit names; emits a descriptive placeholder slug + stderr warning instead of silently producing `phase-N` (Dispatch B §4 Rank 2).
- **`complete.md:186-188` Q8 prompt**: user-facing documentation surfaced during the `/spec_kit:complete` interactive flow; rewritten with bad-vs-good examples (Dispatch B §4 Rank 3).
- **`system-spec-kit/SKILL.md` ALWAYS rule 20**: new `REMEDIATION PACKET NAMING` rule that propagates to the AI's resident skill context on every system-spec-kit invocation (Dispatch B §4 Rank 4).

### Data Flow
```
AI receives task
   ↓
reads /spec_kit:plan or /spec_kit:complete command markdown
   ↓
YAML workflow loads `Generate phase names` activity instruction (new literal-naming rule)
   ↓
AI proposes literal slug with specific subject token
   ↓
create.sh accepts via --short-name OR --phase-names
   ↓
on omission, create.sh fallback emits `phase-N-PROVIDE-DESCRIPTIVE-SLUG` + stderr warning
   ↓
operator notices warning → re-runs with explicit --phase-names
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet maps to a `research_intent=fix_bug` flow. The bug is "AI produces generic names because no surface enforces literal naming." Dispatch B §1 enumerated 10 generation surfaces; the 8 surfaces below are the actionable subset for this packet (1 implicit `/spec_kit:plan` remediation surface and 1 already-acceptable `SKILL.md:400` general-naming rule are not directly edited).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `spec_kit_plan_auto.yaml:47-48` (Mechanism B, AI-derived) | Loads `Generate phase names` activity during `/spec_kit:plan :auto` phase decomposition | Update: rewrite activity to require literal slug with specific subject token | `grep -F "LITERAL phase names"` returns ≥1 match + `yaml.safe_load` exits 0 |
| `spec_kit_plan_confirm.yaml:47-48` (Mechanism B) | Same activity, `/spec_kit:plan` confirm-mode variant | Update: parity with auto-mode rewrite | Same grep + yaml.safe_load check |
| `spec_kit_complete_auto.yaml:73-74` (Mechanism B) | Same activity, `/spec_kit:complete :auto` variant | Update: parity | Same grep + yaml.safe_load check |
| `spec_kit_complete_confirm.yaml:61-62` (Mechanism B) | Same activity, `/spec_kit:complete` confirm-mode variant | Update: parity | Same grep + yaml.safe_load check |
| `create.sh:1084` (Mechanism C, auto-generated) | `_child_slug="phase-${_phase_number}"` fallback when `PHASE_NAME_ARRAY` is exhausted | Update: emit `phase-${_phase_number}-PROVIDE-DESCRIPTIVE-SLUG` + stderr warning | `grep -n 'PROVIDE-DESCRIPTIVE-SLUG'` returns ≥2 hits in `create.sh` + synthetic scaffold smoke-test shows warning on stderr |
| `create.sh:571` (Mechanism C) | Hardcoded `local child_name="001-phase-one"` in `scaffold_phase_parent_validation_child()` | Update: `local child_name="001-validation-phase-PROVIDE-DESCRIPTIVE-SLUG"` + stderr warning | Same grep + smoke-test |
| `complete.md:186-188` (Mechanism A/B hybrid) | Q8 interactive prompt: "Provide phase names? (Optional: auto-generated if skipped)" | Update: rewrite with bad-vs-good examples (`fix-singleton-leak-in-launcher` vs `cleanup` / `remediation`) | `grep -F "fix-singleton-leak-in-launcher" .opencode/commands/spec_kit/complete.md` returns ≥1 match |
| `system-spec-kit/SKILL.md:413` (Mechanism D, convention-only) | `ALWAYS` section rules 1-19 | Update: insert new rule 20 `REMEDIATION PACKET NAMING` after rule 19 | `grep -F "REMEDIATION PACKET NAMING"` returns ≥1 match + `grep -c '^## '` returns the unchanged section count |
| `feature_catalog/feature_catalog.md:4338` (Mechanism D, convention-only) | Documents `--phase-names` option behaviour | Update: mention literal-naming guidance + warn-only fallback | `grep -F "literal"` matches updated entry |

Required inventories:
- Same-class producers: `rg -n "Generate phase names" .opencode/commands/spec_kit/assets/` (expect 4 hits across the 4 YAML files; confirms parity-target count before editing).
- Consumers of changed symbols: `rg -n "PHASE_NAME_ARRAY|_child_slug|child_name" .opencode/skills/system-spec-kit/scripts/spec/create.sh` (expect hits at lines 571 + 1084 region; confirms no other fallback sites are missed).
- Matrix axes: (mechanism: B/C/D) × (mode: auto/confirm) × (command: plan/complete). Covered by the 4 YAML rewrites (B × auto/confirm × plan/complete); C is covered by the 2 create.sh hunks; D is covered by SKILL.md rule 20 + feature_catalog refresh.
- Algorithm invariant: the AI's chosen slug MUST contain a specific subject token (the component or behaviour being changed); single-word slugs like `cleanup` or `remediation` fail this invariant and the YAML instruction explicitly names them as generic.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Canonical YAML wording
- [ ] Draft the exact `Generate LITERAL phase names …` activity string once (the canonical wording from the plan §Packet B Rank 1 quote) so all 4 YAML files end up byte-identical at that anchor.
- [ ] **Given** the canonical wording lives in one place, **when** Phase 2 applies it across 4 YAML files in parallel, **then** the parity invariant (REQ-002) is provable via a single grep across `.opencode/commands/spec_kit/assets/`.

### Phase 2: Apply YAML rewrites (parallel across 4 files)
- [ ] Apply rewrite to `spec_kit_plan_auto.yaml:47-48`.
- [ ] Apply rewrite to `spec_kit_plan_confirm.yaml:47-48`.
- [ ] Apply rewrite to `spec_kit_complete_auto.yaml:73-74`.
- [ ] Apply rewrite to `spec_kit_complete_confirm.yaml:61-62`.
- [ ] **Given** all 4 files now contain the new activity wording, **when** `for f in …; do python3 -c "import yaml; yaml.safe_load(open('$f'))"; done` runs, **then** all 4 invocations exit 0 (SC-001 satisfied).

### Phase 3: create.sh fallback updates
- [ ] Replace `local child_name="001-phase-one"` at `create.sh:571` with `local child_name="001-validation-phase-PROVIDE-DESCRIPTIVE-SLUG"` and add an `echo "[speckit] Warning: …" >&2` line above the assignment.
- [ ] Replace the `_child_slug="phase-${_phase_number}"` line in the `else` branch at `create.sh:1084` with `_child_slug="phase-${_phase_number}-PROVIDE-DESCRIPTIVE-SLUG"` and add the same stderr warning.
- [ ] **Given** the fallback now emits a descriptive placeholder + warning, **when** `bash create.sh "synthetic test" --short-name synth --level 2 --phase --phase-count 3 --path /tmp/speckit-naming-smoke-$$` runs, **then** stderr contains both warning lines and the scaffolded folder names include `-PROVIDE-DESCRIPTIVE-SLUG` (SC-002 satisfied).

### Phase 4: complete.md Q8 rewrite
- [ ] Rewrite the Q8 block at `complete.md:186-188` with the new prompt: require literal phase names, give 1 concrete good example (`fix-singleton-leak-in-launcher`) and 2 concrete bad examples (`cleanup`, `remediation`), and remove the "Optional: auto-generated if skipped" language (replaced with "Strongly preferred: auto-generation falls back to a placeholder slug").
- [ ] **Given** the Q8 prompt now names specific bad shapes, **when** the operator runs `/spec_kit:complete` interactively, **then** the prompt steers AI-derived names toward literal slugs.

### Phase 5: SKILL.md rule 20 insertion
- [ ] Read `system-spec-kit/SKILL.md` lines 390-440 to confirm the `ALWAYS` section anchor and the current rule-19 line.
- [ ] Insert a new rule 20 `REMEDIATION PACKET NAMING` block after rule 19 (around line 413): names MUST reference both the source (e.g. `fix-deep-review-p1-p2-…`) AND the target (`…-for-sk-doc-skill`); forbid bare `remediation` / `cleanup` / `phase-N` slugs; include 2 good-example references.
- [ ] **Given** rule 20 lives inside the existing `ALWAYS` subsection, **when** `grep -c '^## ' SKILL.md` runs, **then** the count is unchanged from pre-edit (SC-003 satisfied).

### Phase 6: feature_catalog refresh
- [ ] Update `feature_catalog/feature_catalog.md:4338`: extend the existing `--phase-names` description with one additional sentence: "When omitted, `create.sh` emits a `PROVIDE-DESCRIPTIVE-SLUG` placeholder and a stderr warning; provide literal subject-token names per the system-spec-kit ALWAYS rule 20 (REMEDIATION PACKET NAMING)."

### Phase 7: Verification
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-literal-spec-folder-names --strict` and confirm exit 0 (SC-004 satisfied).
- [ ] **Given** all 6 implementation phases passed their per-phase Given/When/Then, **when** the operator invokes `/spec_kit:plan :auto` on a synthetic ambiguous task, **then** the proposed packet name includes a specific subject token, not a generic placeholder (SC-005, manual, post-implementation).
- [ ] Update `implementation-summary.md` with the realized state (file paths, edited line ranges, smoke-test evidence).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A (no functions added, only instruction strings) | N/A |
| Integration | `create.sh` synthetic phase scaffold to `/tmp/speckit-naming-smoke-$$`; YAML parse on all 4 modified workflow files | `python3 yaml.safe_load`, `bash create.sh … --phase --phase-count 3` |
| Manual | `/spec_kit:plan :auto` against a synthetic ambiguous task; observe AI-proposed slug | Operator-driven smoke-test post-implementation |

**Given** the 5 success criteria in spec.md §5, **when** each verification step passes, **then** the packet is ready for completion-claim per the spec-kit checklist contract. SC-005 is the only operator-driven step; the other 4 are automatable.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `python3 yaml.safe_load` (PyYAML) | Internal (system Python) | Green | Cannot validate YAML edits, but Python + PyYAML are present in every dev shell; no risk in practice |
| `bash` (already required for `create.sh`) | Internal | Green | N/A (script already runs in current dev shell) |
| `validate.sh --strict` | Internal (system-spec-kit script) | Green | SC-004 would be unverifiable; mitigated by Phase 7 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any of (a) YAML fails to parse after edit, (b) `create.sh` smoke-test breaks scaffolding, (c) `SKILL.md` section count regresses, (d) `validate.sh --strict` reports new errors.
- **Procedure**: Single `git revert <packet-commit-sha>` on main. All edits land in one logical commit per the operator's "no feature branches, stay on main" rule; revert is one command.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Canonical wording) ──┬──► Phase 2 (YAML parallel apply) ──┐
                              ├──► Phase 3 (create.sh hunks) ──────┤
                              ├──► Phase 4 (complete.md Q8) ───────┼──► Phase 7 (Verify)
                              ├──► Phase 5 (SKILL.md rule 20) ─────┤
                              └──► Phase 6 (feature_catalog) ──────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Canonical wording | None | Phases 2, 5 (the YAML wording is reused in the SKILL.md rule 20 examples) |
| Phase 2: YAML rewrites | Phase 1 | Phase 7 |
| Phase 3: create.sh hunks | None (independent of YAML wording) | Phase 7 |
| Phase 4: complete.md Q8 | None | Phase 7 |
| Phase 5: SKILL.md rule 20 | Phase 1 (reuses wording) | Phase 7 |
| Phase 6: feature_catalog refresh | Phase 5 (cross-references rule 20) | Phase 7 |
| Phase 7: Verify | 2, 3, 4, 5, 6 | None |

**Given** Phase 1 produces the canonical activity string, **when** Phases 2-6 run, **then** Phases 2 and 5 share that wording verbatim, guaranteeing the YAML activity and the SKILL.md rule 20 do not drift.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Canonical wording | Low | 0.5h |
| Phase 2: YAML rewrites (4 files, parallel) | Low | 0.5h aggregate (parallelizable) |
| Phase 3: create.sh hunks | Low | 0.5h |
| Phase 4: complete.md Q8 | Low | 0.25h |
| Phase 5: SKILL.md rule 20 | Low | 0.5h |
| Phase 6: feature_catalog refresh | Low | 0.25h |
| Phase 7: Verification | Low | 0.5h |
| **Total** | | **~2.5-3h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Local `yaml.safe_load` smoke-test passes on all 4 modified YAML files
- [ ] `create.sh` synthetic phase-scaffold smoke to `/tmp` succeeds + emits warnings
- [ ] `grep -c '^## ' SKILL.md` matches pre-edit baseline
- [ ] `validate.sh --strict` on the packet exits 0

### Rollback Procedure
1. `git revert <packet-commit-sha>`: single revert on main; restores all 8 files to pre-edit state in one operation.
2. Re-run YAML parse + create.sh smoke against the reverted state to confirm restoration.
3. Operator informed via implementation-summary.md update noting the revert.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A (documentation/instruction edits only; no DB, no on-disk schema, no cached state).
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->

