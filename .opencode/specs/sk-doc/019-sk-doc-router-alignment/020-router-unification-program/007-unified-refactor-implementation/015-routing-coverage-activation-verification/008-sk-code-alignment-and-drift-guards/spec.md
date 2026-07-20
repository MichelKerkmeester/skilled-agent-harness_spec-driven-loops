---
title: "Feature Specification: sk-code Alignment & Drift Guards"
description: "Makes the code-opencode RESOURCE_MAP equality gate real — code-opencode/SKILL.md currently attributes the guard to verify_alignment_drift.py, which is markdown-blind by construction; the real guard is sk-code-router-sync.vitest.ts, uncross-referenced. Adds a qualifiedIdToLeaf bidirectional bijection test between compiled targetQualifiedIds and the RESOURCE_MAP, unifies sk-code's three disjoint drift guards behind one run-all-drift-guards.sh entry point, and extends the runtime request contract with surfaceBundle composite-routing context. Publishes the single code-opencode alignment-authority interface (CF-SC-5) that later 015 children consume. Planning-only; depends on 002; never edits the frozen scorer trio."
trigger_phrases:
  - "sk-code alignment drift guards"
  - "code-opencode resource map equality gate"
  - "qualifiedIdToLeaf bijection test"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# Feature Specification: sk-code Alignment & Drift Guards

## EXECUTIVE SUMMARY

`code-opencode/SKILL.md` claims a drift guard enforces RESOURCE_MAP parent-child equality (CF-SC-1), but the script it implicitly points to, `verify_alignment_drift.py`, is markdown-blind by construction — its `SUPPORTED_EXTENSIONS` set covers `.ts .tsx .mts .js .mjs .cjs .py .sh .rs .json .jsonc` only, never `.md` (CONFIRMED: zero markdown code path in the 558-line file). The real guard, `sk-code-router-sync.vitest.ts` (193 lines, CONFIRMED), lives two skills away under `system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/` and is never cross-referenced from `code-opencode/SKILL.md` or `alignment-verification-automation.md`. This packet makes the claim true — name the real guard and backlink it — then closes three adjacent gaps: a `qualifiedIdToLeaf` bidirectional bijection test between compiled `targetQualifiedIds` and the RESOURCE_MAP (CF-SC-2), a single `run-all-drift-guards.sh` entry point unifying sk-code's three disjoint drift guards (CF-SC-4), and an additive `surfaceBundle` composite-routing context on the runtime request contract so `sk-code:code-opencode` routing can be proven end-to-end (CF-SC-3). Together these publish the single code-opencode alignment-authority interface (CF-SC-5) that later 015 children — and the P4 cutover controller (`011-activation-cutover-p4`) — must consume rather than re-derive.

**Hard invariants:** the three frozen scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) stay SHA-256-pinned and are never edited by this child; compiled routing stays byte-identical to legacy on every routing field; every change here is additive and/or flag-gated and ships a named, trivial rollback (plain file revert — no manifest, fence, or serving-authority state is touched); no code this child adds or edits reads under `.opencode/specs`. This child depends on `002-runtime-promotion-and-status-foundation` (the P0 foundation) and builds entirely behind the still-off `SPECKIT_COMPILED_ROUTING` flag.

> **Evidence provenance.** Findings are consolidated in `001-research/synthesis-v1.md` §2.6 (CF-SC-1..5) and independently re-verified in `001-research/verification-v1.md` (CF-SC-1 CONFIRMED exactly; `subprocess.ts` interface line-drift noted generally). Per `review-v1.md` §2, treat every cited `file:line` as ±2–10 and re-anchor on the SYMBOL at build time, not the number.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P3 — coverage-closure input in the P0→P4 safety graph; parallelizable with 006/007/009/010 once 002 lands |
| **Status** | Planned |
| **Created** | 2026-07-20 |
| **Branch** | `008-sk-code-alignment-and-drift-guards` |
| **DAG Stage** | P3 (`001-research/synthesis-v1.md` §5 P0→P4 graph: "verify_alignment_drift markdown gate live (CF-SC-1)" + "create-skill ready fixture (CF-SC-5)" join-gate items) |
| **Blast radius** | Low-to-medium — mostly additive tests/docs/scripts (a doc-truth rename, new Vitest cases, a new orchestrator script); the one runtime-adjacent item (REQ-006, surfaceBundle request-context) is an additive optional field on the promoted runtime request contract and changes no routing decision |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The documented enforcement mechanism for code-opencode's RESOURCE_MAP parent-child equality is inert. `code-opencode/SKILL.md` (~L45, L51) states "a drift guard enforces that equality" without naming a script; the only guard in the same skill tree, `verify_alignment_drift.py`, cannot parse the markdown RESOURCE_MAP tables it would need to check — its extension dispatch has no `.md` branch anywhere in the file. The guard that actually enforces RESOURCE_MAP-vs-disk equality, `sk-code-router-sync.vitest.ts`, lives in a different skill's tree (`system-deep-loop/deep-improvement/`) with no backlink from either `code-opencode/SKILL.md` or `alignment-verification-automation.md §5`. Separately: there is no typed bridge between the compiled router's `targetQualifiedIds` output and the RESOURCE_MAP's leaf paths, so a compiled decision and a documented resource can silently diverge; sk-code's three drift guards (`verify_alignment_drift.py`, `verify_stack_folders.py`, `sk-code-router-sync.vitest.ts`) have zero overlap and no single command runs all three; and the public compiled-routing front door supplies only prompt text, so a `sk-code:code-opencode` `surfaceBundle` decision cannot be proven end-to-end.

### Purpose

Make the RESOURCE_MAP-equality claim true by naming and backlinking the real guard; add a bidirectional bijection test closing the compiled-to-documented gap; unify the three drift guards behind one entry point; and extend the runtime request contract so a surfaceBundle decision is provable. The combined result is the single code-opencode alignment-authority interface that CF-SC-5 requires — a prerequisite this program's later children (009's template alignment, 010's non-hub policy, 011's P4 lockstep cutover) consume rather than reimplement.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename the inline `code-opencode/SKILL.md` RESOURCE_MAP-equality claim to name `sk-code-router-sync.vitest.ts` explicitly, and add the matching backlink from `alignment-verification-automation.md §5`.
- (P1 stretch) Extend `verify_alignment_drift.py` with a markdown RESOURCE_MAP parser behind a default-off `--check-router` flag.
- Add `qualifiedIdToLeaf` to `leaf-resource-contract.cjs` (exposed via `selectResourceContract`) and a bidirectional bijection Vitest suite (compiled `targetQualifiedIds` → RESOURCE_MAP leaf, and RESOURCE_MAP entry → manifest leaf).
- Author `run-all-drift-guards.sh`, invoking `verify_alignment_drift.py`, `verify_stack_folders.py`, and `sk-code-router-sync.vitest.ts` in sequence with a non-zero aggregate exit on any failure; update `code-opencode/SKILL.md`'s gate list to name all three commands.
- (P1) Extend the promoted runtime request contract with an additive, optional composite-routing context field sufficient to prove a `sk-code:code-opencode` `surfaceBundle` decision end-to-end via one LUNA-high playbook case.
- Publish this child's combined output (corrected doc pointer + bijection module + orchestrator script) as the single code-opencode alignment-authority interface later 015 children must consume.

### Out of Scope

- Editing `router-replay.cjs`, `score-skill-benchmark.cjs`, or `load-playbook-scenarios.cjs` (the frozen trio) — [why] hard invariant; this child only reads their pinned digests.
- Changing any compiled routing decision, `selectedPolicy`, or manifest state — [why] this child is documentation, test, and additive-contract work only.
- The P4 lockstep directive rewrite itself — [why] that is `011-activation-cutover-p4`'s job; this child only builds the authority interface 011 will read.
- sk-doc template/taxonomy alignment (test-type taxonomy, topology quote-tolerance, catalog `trigger_phrases` claim) — [why] owned by `009-sk-doc-template-alignment`.
- Rollback/audit mechanics and non-hub archetype policy — [why] owned by `010-rollback-audit-and-non-hub-policy`.
- ADR-003 promotion mechanics themselves (moving the resolver/engine/activation closure out of the spec tree) — [why] owned by `002-runtime-promotion-and-status-foundation`; this child only consumes the promoted path once it exists.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/code-opencode/SKILL.md` (~L45, L51, L163) | Modify | Name `sk-code-router-sync.vitest.ts` as the RESOURCE_MAP-equality guard; update the gate list (~L163) to name all three drift-guard commands |
| `.opencode/skills/sk-code/code-opencode/references/shared/alignment-verification-automation.md` (§5, ~L48-52) | Modify | Add the backlink to `sk-code-router-sync.vitest.ts` |
| `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py` (SUPPORTED_EXTENSIONS L39-51; dispatch L457-497) | Modify (P1) | Add default-off `--check-router` markdown RESOURCE_MAP parser |
| `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_stack_folders.py` | Read-only | Second of the three guards `run-all-drift-guards.sh` invokes |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts` | Modify | Add the `qualifiedIdToLeaf` bidirectional bijection test cases |
| `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs` | Modify | Add `qualifiedIdToLeaf`, exposed via `selectResourceContract` |
| `.opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs` | Modify | Unit coverage for the new `qualifiedIdToLeaf` lookup |
| `.opencode/skills/sk-code/leaf-manifest.json` | Read-only | Bijection target — the leaf identities both directions must resolve against |
| `007-unified-refactor-implementation/006-parent-hub-rollout/001-sk-code/compiled/route-gold.typed.json` | Read-only | Bijection source — the compiled `targetQualifiedIds` under test |
| `.opencode/skills/sk-code/code-opencode/assets/scripts/run-all-drift-guards.sh` | Create | New orchestrator invoking all three drift guards; non-zero on any failure |
| The promoted runtime request contract (post-002; pre-promotion `007-unified-refactor-implementation/011-runtime-engine/lib/compiled-route.cjs:73`) | Modify (P1) | Add the additive optional composite-routing context field for `surfaceBundle` proof |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix the false RESOURCE_MAP-equality claim (CF-SC-1 minimum). | `code-opencode/SKILL.md` names `sk-code-router-sync.vitest.ts` by path where it currently makes an unnamed guard claim; `alignment-verification-automation.md §5` backlinks to the same file; no remaining sentence attributes RESOURCE_MAP-equality enforcement to `verify_alignment_drift.py` alone. |
| REQ-002 | `qualifiedIdToLeaf` bidirectional bijection test (CF-SC-2). | `leaf-resource-contract.cjs` exports `qualifiedIdToLeaf` via `selectResourceContract`; a Vitest suite asserts (a) every `targetQualifiedIds` entry in the compiled route-gold resolves to a leaf in `leaf-manifest.json`, and (b) every code-opencode RESOURCE_MAP entry matches a manifest leaf after normalization — both directions fail the suite by naming the specific orphan ID on any mismatch. |
| REQ-003 | `run-all-drift-guards.sh` orchestrator (CF-SC-4). | New script invokes `verify_alignment_drift.py`, `verify_stack_folders.py`, and the `sk-code-router-sync.vitest.ts` suite in sequence, echoes a per-guard PASS/FAIL line, and exits non-zero if any one fails; `SKILL.md`'s gate list (~L163) names all three concrete commands, not just the first. |
| REQ-004 | Publish the single code-opencode alignment-authority interface (CF-SC-5). | The corrected doc pointer (REQ-001) + the `qualifiedIdToLeaf` bijection module (REQ-002) + `run-all-drift-guards.sh` (REQ-003) are documented as the one authority interface; `009`, `010`, and `011` reference this interface rather than introducing a second RESOURCE_MAP parser or a local eligibility map. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Extend `verify_alignment_drift.py` with a markdown RESOURCE_MAP parser behind `--check-router` (CF-SC-1 stretch). | A new default-off `--check-router` flag adds `.md` handling scoped to RESOURCE_MAP tables only (not general markdown); a positive fixture (aligned RESOURCE_MAP) passes and a drift fixture (seeded mismatch) fails; the default invocation (no flag) is byte-behavior-identical to today. |
| REQ-006 | surfaceBundle end-to-end context (CF-SC-3). | The promoted runtime request contract (post-002) accepts an additive, optional composite-routing context field; one LUNA-high compiled-routing playbook case requires and records a `surfaceBundle` result containing `sk-code:code-opencode`; the field's absence is a byte-identical no-op on every other hub. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `code-opencode/SKILL.md`'s drift-guard claim names `sk-code-router-sync.vitest.ts` by path, backlinked from `alignment-verification-automation.md §5`.
- **SC-002**: The `qualifiedIdToLeaf` bidirectional bijection Vitest suite passes with zero orphans in both directions.
- **SC-003**: `run-all-drift-guards.sh` runs all three guards and exits non-zero on any single seeded failure; `SKILL.md`'s gate list names all three commands.
- **SC-004** (P1): `verify_alignment_drift.py --check-router` parses a real RESOURCE_MAP table and catches a seeded drift fixture; default (no-flag) behavior is unchanged.
- **SC-005** (P1): The promoted runtime request contract accepts an additive `surfaceBundle` context field; one LUNA-high case proves `sk-code:code-opencode` end-to-end.
- **SC-006**: No file in this child's diff touches `router-replay.cjs`, `score-skill-benchmark.cjs`, or `load-playbook-scenarios.cjs`; pre/post SHA-256 are unchanged.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `002-runtime-promotion-and-status-foundation` (ADR-003 promotion) | REQ-006's target file does not exist at its stable path until 002 ships | REQ-006 cites both the pre- and post-promotion path and is sequenced strictly after 002; REQ-001..REQ-004 (P0) do not depend on the promoted path and can proceed independently |
| Dependency | `013-create-skill-alignment` (Planned; CF-SC-5 evidence `013/spec.md:127,162`) | 013's "single-authority interface" language must describe the same authority this child publishes | This child's authority-interface note explicitly cross-links 013's requirement so both packets name the same interface, not two competing ones |
| Risk | `--check-router`'s markdown parser scope-creeps into general markdown parsing | Would risk changing default validator behavior, violating the additive/reversible invariant | Flag stays default-off; parser is scoped to RESOURCE_MAP tables only; positive + drift fixtures required before merge |
| Risk | The bijection Vitest suite misses a leaf due to cited-line drift in the actual manifest shape | False-negative gate (passes when it should fail, or vice versa) | Re-anchor on `leaf-manifest.json`'s live schema and `route-gold.typed.json`'s live shape at build time, never on a cited line number |
| Risk | `run-all-drift-guards.sh` masks which of the three guards actually failed | Harder triage during CI failures | Script echoes a per-guard PASS/FAIL line before the aggregate non-zero exit |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: `run-all-drift-guards.sh` and the bijection Vitest suite run fully offline and deterministically — no network call, no live model dispatch, no dependency on prior invocation state.

### Reversibility
- **NFR-R01**: Every change in this child is additive (a renamed doc claim, a new script, a new export, a new default-off flag, a new optional request-contract field); no existing default invocation of any touched tool changes behavior.

### Authority
- **NFR-A01**: After this child ships, exactly one document (`code-opencode/SKILL.md` + its `alignment-verification-automation.md` backlink) and one bijection module (`leaf-resource-contract.cjs`) are the code-opencode alignment source of truth; no later 015 child introduces a second, competing RESOURCE_MAP parser or eligibility map.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Precondition failures
- `--check-router` invoked against a malformed RESOURCE_MAP table: the parser reports a structured parse error naming the malformed row, never a silent pass.
- REQ-006 attempted before 002's promotion lands: the promoted-path target does not exist; the task is blocked, not silently redirected to the mutable spec-tree copy.

### Idempotency and re-runs
- `run-all-drift-guards.sh` re-run twice in a row on a clean tree: identical PASS output and exit code both times.
- The bijection Vitest suite re-run after an unrelated leaf-manifest addition: passes cleanly as long as both directions still resolve; no ordering dependency between runs.

### Boundary integrity
- A `targetQualifiedIds` entry with no corresponding leaf: the bijection suite fails, naming the specific orphan qualified ID.
- A RESOURCE_MAP entry with no corresponding compiled leaf after normalization: the same suite fails from the opposite direction, naming the specific orphan RESOURCE_MAP path.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | One doc-truth fix, one new bidirectional test suite, one new orchestrator script, one additive request-context field; no new plane or state |
| Risk | 9/25 | All changes additive and/or flag-gated/default-off; the one runtime-adjacent item (REQ-006) never changes a routing decision |
| Research | 5/20 | Mechanism fully specified by CF-SC-1..5; residual work is the `--check-router` parser's internal design and confirming 002's promoted request-contract shape |
| **Total** | **25/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which `--check-router` implementation strategy is cheaper to keep byte-identical with the frozen replay logic — a native markdown-table parser, or shelling out to `router-replay.cjs`'s existing `parseRouter` (read-only invocation, never an edit)? Decide at build time by re-reading `router-replay.cjs:571-578`.
- Does `run-all-drift-guards.sh` become the actual CI entry point (replacing today's separate CI steps), or an additive local convenience wrapper that CI continues to call as three discrete steps? Resolve alongside 002's durable no-spec-import CI rule (F-16-4).
- Should the `surfaceBundle` composite-routing context (REQ-006) be namespaced per-hub or generic across all seven compiled-eligible hubs? Resolve once 002's promoted request-contract shape is final.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Build approach**: See `plan.md`
- **Task breakdown**: See `tasks.md`
- **Verification checklist**: See `checklist.md`
- **Completion record**: See `implementation-summary.md`
- **Upstream evidence**: `../001-research/synthesis-v1.md` §2.6 (CF-SC-1..5), `../001-research/verification-v1.md` (CF-SC-1 CONFIRMED), `../001-research/review-v1.md` §4
