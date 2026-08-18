---
title: "Feature Specification: Make Runtime-Mirror and Routing Parity Gates Compare What Actually Differs"
description: "Five runtimes are claimed to be in parity by gates that compare the wrong thing: the mirror checker compares body tokens as a Set, so a missing tool and a reordered instruction both read as synchronized; the capability matrices hardcode two runtimes while a third ships as a converted mirror; and the registry compiler asserts packet and leaf identity strings without resolving them."
trigger_phrases:
  - "runtime mirror parity"
  - "mirror sync verify ordering"
  - "registry compiler unresolved identity"
  - "codex agent parity coverage"
  - "deep loop 030 parity"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/008-runtime-mirror-and-routing-parity"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled packet docs to Complete with F-028-01 deferred"
    next_safe_action: "Commit the reconciled packet docs"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The mirror gate must be order-sensitive and tool-surface-sensitive; a Set comparison cannot express either"
      - "A nonexistent packet or leaf identity must fail compilation rather than assert as a string"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: Make Runtime-Mirror and Routing Parity Gates Compare What Actually Differs

> Phase adjacency under the `036-deep-loop-innovation` parent (grouping order, not a runtime dependency): predecessor `007-improvement-promotion-authority`; successor `009-silent-failure-and-harness-repair`.

> **Scaffold dependency.** This child is scaffolded under `036-deep-loop-innovation/` as a flat
> sibling of phases 001-020. That nesting is conditional on child `021`'s hashed-child-manifest fix
> (`F-029-03`) landing first: without a bounded child manifest, every child added here widens the
> parent's unbounded recursive-validation glob. `021` is the first scaffold in the tree.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (7/8 findings landed as `2f84f78bf7`; F-028-01 deferred) |
| **Created** | 2026-07-30 |
| **Branch** | `system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/008-runtime-mirror-and-routing-parity` |
| **Parent** | `system-deep-loop/036-deep-loop-innovation` |
| **Wave** | W3 |
| **Findings in scope** | 8 (1 P0 / 7 P1 / 0 P2), 0 carrying a review `CONFIRMED*` mark |
| **Blocks `014` cutover** | No — parity hygiene, not on the cutover unblock path |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Codex `ai-council` conversion runs `sandbox_mode = "workspace-write"` while the source agent denies Bash and promises never to write outside packet-local artifacts; the generated body still says Bash is denied, so the prose contradicts the runtime setting, and `sync-agents.cjs` hardcodes the mode instead of deriving the source deny (`F-028-01`). The mirror checker strips frontmatter and compares body tokens as a Set, so `detect_changes` being absent from Claude's allowlist while the body mandates its use reads as synchronized, and reordered load-bearing instructions compare equal (`F-028-02`, `F-028-04`). Runtime-capability matrices and parity tests hardcode two runtimes while `.codex/agents/deep-review.toml` exists as a converted mirror, so Codex is simultaneously shipped and outside the parity claim (`F-040-02`). The ai-council agent is required to call the persistence library directly while its frontmatter denies Bash and exposes no code-execution tool, and the orchestrator separately requires the parent to invoke that helper, so there are two documented writer authorities and neither is executable by the leaf (`F-028-03`). On the routing side, `/deep:command-benchmark` is a supported launcher in the registry, SKILL and command metadata but absent from `hub-router.json`, from which the compiler derives live vocabulary (`F-027-01`); the registry compiler asserts packet and leaf identities as strings without resolving them, so a probe with a nonexistent packet and a missing leaf still compiled (`F-027-02`); and shared-packet leaf identity binds every `deep-improvement` leaf path to the first-declared mode, making model-benchmark and skill-benchmark routes unobservable while the docs instruct readers to reinterpret the wrong identity rather than treat it as a miss (`F-035-02`).

### Purpose
Make each parity and routing gate fail on the difference it exists to detect, so a claimed parity means the runtimes actually agree.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** The review report states that in
> every confirmed case the actor is the operator or a stale local file, not a remote attacker. Read
> every P0 and P1 below as **cutover-readiness and robustness risk, not breach risk**. A finding's
> severity label is not a licence to treat it as a security incident.

> **Finding = hypothesis.** Only 13 of the 166 register findings carry a `CONFIRMED*` mark. Every
> other finding in the scope table below is an unverified single-leaf report. No fix may be built
> against an unconfirmed finding: T001 re-reads every cited `file:line` at HEAD and records
> `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` before any edit.

### Non-Goals
- Adding a new runtime. The question of whether Codex is inside the parity claim is OD-2, not a build decision made here.
- Rewriting the agent definitions beyond what parity requires.
- Documentation drift in the READMEs (`032`).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Mirror comparison that is order-sensitive for load-bearing instructions and surface-sensitive for the tool allowlist.
- Codex sandbox mode derived from the source agent deny list rather than hardcoded in `sync-agents.cjs`.
- Runtime-capability matrices and parity sets reconciled with what actually ships: Codex is covered for the shipped deep-review TOML mirror, while absent `.codex/*.md` files are not treated as missing; TOML tool surfaces remain non-comparable.
- Exactly one ai-council writer authority, with every runtime mirror updated together.
- `/deep:command-benchmark` present in the route vocabulary the compiler derives from.
- Packet and leaf identities resolved at compile time; a nonexistent packet or missing leaf fails compilation.
- Shared-packet leaf identity that keeps the three improvement modes distinct and observable.

### Out of Scope
- README and roster drift (`032`).
- Any runtime behavior change beyond parity and routing correctness.

### Findings in Scope (8)

| ID | Sev | Review mark | Location (at review time) | Defect |
|----|-----|-------------|---------------------------|--------|
| `F-028-01` | P0 | unverified | `.codex/agents/ai-council.toml:5` | Codex ai-council conversion loses the no-shell and scoped-write boundary |
| `F-028-02` | P1 | unverified | `.claude/agents/deep-review.md:4` | Deep-review requires detect_changes in runtimes that do not expose it |
| `F-028-03` | P1 | unverified | `agents/ai-council.md:722` | AI-council persistence has no single executable writer authority |
| `F-028-04` | P1 | unverified | `deep-improvement/scripts/lib/mirror-sync-verify.cjs:71` | Agent mirror validation ignores instruction ordering |
| `F-040-02` | P1 | unverified | `deep-review/assets/runtime-capabilities.json:6` | Codex agent mirrors are outside runtime parity coverage |
| `F-035-02` | P1 | unverified | `shared/references/smart-routing.md:42` | Shared-packet leaf identity makes two workflow routes unobservable |
| `F-027-01` | P1 | unverified | `hub-router.json:72` | Supported command alias is absent from the hub route vocabulary |
| `F-027-02` | P1 | unverified | `bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs:349` | Compiled routing accepts packet and leaf identities without resolving them on disk |

Every ID above is assigned to this child and to no other. Locations are the anchors recorded during the review run; T001 re-resolves each one at HEAD.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.codex/agents/ai-council.toml` | Modify | Sandbox mode consistent with the source deny list (`F-028-01`) |
| `.claude/agents/deep-review.md` | Modify | Tool surface consistent with the body it mandates (`F-028-02`) |
| `.opencode/agents/{ai-council.md,deep-review.md}` | Modify | Single writer authority; tool-surface consistency (`F-028-03`) |
| ``sync-agents.cjs`` | Modify | Derive the sandbox mode from the source deny rather than hardcoding it (`F-028-01`) |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs` | Modify | Order-sensitive and surface-sensitive comparison (`F-028-04`) |
| `.opencode/skills/system-deep-loop/deep-review/assets/runtime-capabilities.json` | Modify | Reconcile the runtime set with what ships (`F-040-02`) |
| `.opencode/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml` | Modify | Same runtime-set reconciliation |
| `.opencode/skills/system-deep-loop/hub-router.json` | Modify | Add the supported launcher missing from the route vocabulary (`F-027-01`) |
| `.opencode/skills/system-deep-loop/mode-registry.json` | Modify | Keep the three improvement modes distinct |
| ``bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs`` | Modify | Resolve packet and leaf identities at compile time (`F-027-02`) |
| `.opencode/skills/system-deep-loop/shared/references/smart-routing.md` | Modify | Stop instructing readers to reinterpret a wrong leaf identity (`F-035-02`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A reordered load-bearing instruction fails the mirror gate. | The exact `F-028-04` probe, inverted: swapping `READ STATE THEN WRITE FINDINGS` for `WRITE FINDINGS THEN READ STATE` fails. |
| REQ-002 | A tool-surface difference fails the mirror gate. | `detect_changes` absent from one runtime's allowlist while the body mandates it fails the gate. |
| REQ-003 | A nonexistent packet or missing leaf fails compilation. | A probe with a `deep-ghost` packet and a missing leaf fails rather than compiling. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The Codex sandbox mode is derived from the source agent deny list. | A source agent denying Bash produces a Codex mirror whose sandbox mode does not contradict the generated body. |
| REQ-005 | Exactly one ai-council writer authority exists, and every runtime mirror agrees. | One documented authority; the leaf that is required to write has the tool surface to do it. |
| REQ-006 | The route vocabulary contains every supported launcher. | The orphaned-alias vocabulary check is clean. |
| REQ-007 | The three improvement modes stay distinct in a replay test. | Model-benchmark and skill-benchmark routes are observable rather than collapsed into the first-declared mode. |
| REQ-008 | The runtime-capability matrices match what ships, per OD-2. | Either Codex appears in both matrices and the parity sets, or the `.codex/agents/*` mirrors are explicitly classified outside the parity claim. |

### Universal - applies to every child in the 021-032 remediation tree

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-U01 | Confirm before build. Every finding ID in the scope table is re-read at HEAD and classified `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` before any code edit. | T001 output table in `tasks.md` lists all scoped IDs with a classification and a cited probe, test, commit, or new anchor. |
| REQ-U02 | Baseline before delta. Every suite this child touches is run **before** any edit and its real numbers recorded; the whole gate is re-run at close and reported as a delta. | Pre-edit and post-edit runs of the named runners are recorded in `checklist.md` with discovered-test counts, pass/fail/skip, and exit codes. |
| REQ-U03 | Negative test per confirmed finding. Acceptance is a test that **fails before the fix and passes after** — never a green suite alone. | Each confirmed finding maps to a named test that is demonstrated red at the pre-fix commit and green at the post-fix commit. |
| REQ-U04 | Independent verification. An adversarial pass is run by a different actor than the builder; a gate authored alongside the change is not independent evidence. | A verification pass distinct from the build pass is recorded, naming the actor and the defects it found (or explicitly none). |
| REQ-U05 | Evidence citations are drift-proof. No completion claim cites a bare run count or a raw line number; every claim cites a **test name + suite-content digest + candidate SHA**. | `checklist.md` evidence strings contain a test name, a suite digest, and a commit SHA. Grep for bare "N/N passing" strings returns none. |
| REQ-U06 | Completion discipline. `validate.sh --strict` exits 0 for this child, all `checklist.md` items are `[x]` with evidence, and completion metadata reconciles across `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md`. | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0; no doc claims a completion state another doc contradicts. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 8 scoped findings closed as fixed, `REFUTED`, or `ALREADY-FIXED`.
- **SC-002**: A reordered-body probe fails the mirror gate.
- **SC-003**: A tool-surface difference fails the mirror gate.
- **SC-004**: A nonexistent packet or leaf fails compilation.
- **SC-005**: The orphaned-alias vocabulary check is clean.
- **SC-006**: All three improvement modes remain distinct in a replay test.
- **SC-007**: The Codex parity position is recorded per OD-2 and the shipped mirrors are covered by it either way.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An order-sensitive mirror gate fails on benign reordering | Medium | Order sensitivity applies to load-bearing instruction sequences, not to the whole body; the load-bearing set is enumerated |
| Risk | A generated Codex mirror remains stale in a read-only environment | Medium | Preserve the source-derived mode and hand the exact regeneration command to the orchestrator |
| Risk | Tightening the compiler blocks a legitimate probe | Low | Failures name the unresolved packet or leaf, so a legitimate probe is one edit away |
| Dependency | `021` honest baselines | Blocks evidence issuance | Sequence after `021` |
| Dependency | Codex mirror regeneration and independent verification | Blocks final closeout only | The implementation and focused gates proceed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Sensitivity
- **NFR-S01**: The mirror gate must be sensitive to load-bearing instruction order and to tool-surface differences.
- **NFR-S02**: The registry compiler must resolve identities, not assert their type.

### Consistency
- **NFR-C01**: A generated mirror must not contradict its own generated body.
- **NFR-C02**: Exactly one writer authority per agent, agreed across every runtime mirror.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty tool allowlist: compared as a real difference, not as a wildcard.
- Body with no load-bearing sequence: order sensitivity does not apply, and the gate says so rather than passing silently.

### Error Scenarios
- Reordered load-bearing instructions: gate fails (`F-028-04`).
- Tool mandated by the body but absent from the allowlist: gate fails (`F-028-02`).
- Nonexistent packet in a probe: compilation fails (`F-027-02`).
- Sandbox mode contradicting the generated deny list: sync fails (`F-028-01`).

### State Transitions
- A runtime added without a matrix entry: the parity claim must not silently extend to it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- **OD-2 position recorded for this implementation.** Include Codex when its shipped `.toml` mirror exists; compare its body but do not compare its TOML tool surface against Markdown frontmatter. A missing `.codex/*.md` file is not a missing Codex agent. The deep-review matrix and parity contract therefore include Codex, while the ai-council capability matrix retains only runtimes that can execute supported council seats.
- Which ai-council writer authority is the single one: the leaf calling the persistence library directly, or the parent orchestrator invoking the helper? Today both are documented and neither is executable by the leaf. Choose one and update every runtime mirror together.
- Should order sensitivity apply to the whole mirror body or only to enumerated load-bearing sequences? Whole-body order sensitivity would fail on benign formatting changes; the enumerated form needs the enumeration to be maintained.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Findings register**: `../001-whole-system-gate/review/findings-register.md`
- **Canonical registry**: `../001-whole-system-gate/review/deep-review-findings-registry.json`
- **Review verdict and calibration**: `../001-whole-system-gate/review/review-report.md`
<!-- /ANCHOR:related-docs -->
