---
title: "Feature Specification: Batch the P2 Backlog and the Three Doc-Contract P1s"
description: "One sweep in two lanes: documentation and registry drift where the same fact is duplicated across five places, and small code hygiene co-located with earlier children. The governing rule is that a duplicated fact is replaced with a link to one authoritative source rather than fixed in both copies, otherwise this child recurs."
trigger_phrases:
  - "docs drift p2 batch"
  - "registry roster drift readme"
  - "derive counts from registry"
  - "p2 backlog deep loop"
  - "deep loop 032 docs"
importance_tier: "normal"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/010-docs-drift-and-p2-batch"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "claude"
    recent_action: "Landed 27/29 findings as bf4f280ce7 on skilled/v4.0.0.0"
    next_safe_action: "Re-land F-031-01/F-031-02 with a non-regressing rollback-window fix"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 100
    open_questions:
      - "Does the derive-counts-from-registry work become real tooling? If so this child promotes to Level 3."
      - "Which document is the authoritative source for the family, lane, adapter and scenario rosters?"
    answered_questions:
      - "Wherever the same fact is duplicated, replace the copy with a link to one authoritative source rather than fixing both copies"
      - "Four merge groups are single work units while keeping all IDs mapped"
      - "Lane B adopts the shared strict validator `027` introduces rather than patching the legacy gates locally"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: Batch the P2 Backlog and the Three Doc-Contract P1s

> Phase adjacency under the `036-deep-loop-innovation` parent (grouping order, not a runtime dependency): predecessor `009-silent-failure-and-harness-repair`; successor `011-identity-and-lock-ownership-hardening`.

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
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-30 |
| **Branch** | `system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/010-docs-drift-and-p2-batch` |
| **Parent** | `system-deep-loop/036-deep-loop-innovation` |
| **Wave** | W5 (last) |
| **Findings in scope** | 29 (0 P0 / 3 P1 / 26 P2), 0 carrying a review `CONFIRMED*` mark |
| **Blocks `014` cutover** | No — hygiene, runs last |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The roster drift is one fact repeated in five places: three READMEs advertise a pre-alignment four-family roster and four improvement lanes against a registry with five families and three lanes. Two READMEs name a backend kind the registry does not define. Two name five alignment adapters while the scoper registers a sixth. The alignment README documents a flag that does not exist. Council docs undercount manual scenarios and omit alignment from the roster. The runtime README omits alignment as a consumer, and the runtime scripts README links to a deleted file. Council completion is documented as a gate but implemented as an advisory that returns 0 when the terminal event is missing. The research README promises the reducer auto-repairs a trailing corrupt line when it fails closed unless a lenient flag is passed. The script contract restricts a loop type that three scripts accept. Help text advertises an unsupported option in one place and omits a supported one in another. The benchmark report index is an empty table beside four existing report folders, one benchmark evidence link points into an absent packet, a config points at a nonexistent fixture catalog, a shipped profile and taxonomy are inert because weights are hardcoded, the improvement README claims packet-local outputs where two lanes require a caller-supplied directory, and one SKILL ends on an empty heading. Lane B adds four small code items: a policy digest that sorts with `localeCompare` so identical definitions digest differently under different host locales; frozen wave collections typed as mutable arrays behind casts; research and review mode gates that accept unknown top-level keys and filter malformed rollback-window rows where newer modes reject both; and auto research convergence that omits the flags that would persist snapshots, so no sliding-window baseline accumulates.

### Purpose
Clear the P2 backlog and the three documentation-contract P1s in one sweep, replacing duplicated facts with links to one source so the drift cannot silently recur.

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
- New mechanisms. This child introduces none; Lane B adopts the validator `027` built.
- Re-litigating any earlier child's design.
- Repo-wide documentation work outside the 166-finding scope.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Lane A: every documentation and registry drift finding in the scope table, fixed by pointing at one authoritative source wherever a fact is duplicated.
- Lane A: a drift check that derives family, lane, adapter and scenario counts from `mode-registry.json` and the playbook indices, and fails on mismatch.
- Lane A: a local-link scan with zero broken links, and a backfilled benchmark report index with a folder-versus-index drift check.
- Lane A: generated help text derived from the real command and leaf tables rather than retyped.
- Lane B: locale-independent policy digest ordering.
- Lane B: frozen wave collections typed as readonly rather than cast to mutable arrays.
- Lane B: research and review mode gates adopt the shared strict validator `027` introduces.
- Lane B: auto research convergence persists snapshots so a sliding-window baseline accumulates.

### Out of Scope
- Any new mechanism.
- Documentation outside the 166-finding scope.

### Findings in Scope (29)

| ID | Sev | Review mark | Location (at review time) | Defect |
|----|-----|-------------|---------------------------|--------|
| `F-038-02` | P1 | unverified | `deep-research/README.md:130` | Research README promises corruption repair that the reducer does not perform |
| `F-038-03` | P1 | unverified | `runtime/references/script-interface-contract.md:67` | Runtime script contract omits the supported council loop type |
| `F-038-06` | P1 | unverified | `deep-ai-council/README.md:80` | Council completion is documented as a gate but implemented as advisory |
| `F-003-04` | P2 | unverified | `commands/deep/assets/deep-research-auto.yaml:610` | Auto research convergence never persists graph snapshots |
| `F-033-04` | P2 | unverified | `benchmark/reports/README.md:25` | Benchmark report index is empty beside existing report folders |
| `F-026-06` | P2 | unverified | `deep-ai-council/README.md:196` | Council documentation undercounts manual-test scenarios |
| `F-026-09` | P2 | unverified | `deep-ai-council/README.md:128` | Council README omits alignment from the current active roster |
| `F-033-06` | P2 | unverified | `deep-alignment/assets/conformance-benchmark/command-surface/conformance-benchmark.md:164` | Alignment benchmark contains a broken local evidence link |
| `F-001-02` | P2 | unverified | `deep-alignment/README.md:102` | Deep-alignment adapter inventory omits a registered adapter variant |
| `F-026-02` | P2 | unverified | `deep-alignment/README.md:102` | Deep-alignment README omits the registered sk-doc-command adapter |
| `F-038-04` | P2 | unverified | `deep-alignment/README.md:144` | Alignment README documents a nonexistent --convergence flag |
| `F-033-03` | P2 | unverified | `deep-improvement/assets/agent-improvement/improvement-config.json:35` | Lane-A config contains a missing and unconsumed fixture catalog path |
| `F-033-05` | P2 | unverified | `deep-improvement/assets/skill-benchmark/README.md:22` | Lane-C profile and remediation assets are inert duplicate sources of truth |
| `F-026-07` | P2 | unverified | `deep-improvement/README.md:27` | Improvement README overstates packet-local output locations |
| `F-001-03` | P2 | unverified | `deep-research/README.md:41` | Research README describes an obsolete workflow roster |
| `F-026-03` | P2 | unverified | `deep-research/README.md:41` | Deep-research README has an obsolete family and lane roster |
| `F-038-05` | P2 | unverified | `deep-research/README.md:41` | Sibling docs still advertise a pre-alignment four-family roster |
| `F-035-05` | P2 | unverified | `deep-review/SKILL.md:440` | Deep-review integration documentation ends at an empty section |
| `F-026-08` | P2 | unverified | `README.md:63` | Top-level README names an unregistered external-adapter backend |
| `F-035-04` | P2 | unverified | `README.md:63` | Hub documentation advertises an unsupported backend kind |
| `F-002-03` | P2 | unverified | `runtime/lib/authorized-ledger/transition-policy-registry.ts:145` | Transition policy registry digest depends on process locale |
| `F-036-05` | P2 | unverified | `runtime/lib/branch-leases-waves/wave-plan.ts:90` | Frozen wave collections are typed as mutable arrays |
| `F-031-01` | P2 | unverified | `runtime/lib/deep-research-rollback-gate/mode-gate.ts:241` | Deep-research and deep-review mode gates silently accept unknown top-level evidence |
| `F-031-02` | P2 | unverified | `runtime/lib/deep-research-rollback-gate/mode-gate.ts:595` | Legacy rollback-window clones filter malformed rows instead of rejecting the evidence set |
| `F-026-05` | P2 | unverified | `runtime/README.md:29` | Runtime README omits alignment from its active consumer inventory |
| `F-001-01` | P2 | unverified | `runtime/scripts/README.md:40` | Runtime scripts README links to a removed parent SKILL.md |
| `F-026-01` | P2 | unverified | `runtime/scripts/README.md:40` | Runtime scripts README links to removed runtime SKILL.md |
| `F-032-07` | P2 | unverified | `runtime/scripts/render-command-contract.cjs:216` | Command renderer help omits a supported command |
| `F-032-06` | P2 | unverified | `runtime/scripts/verify-iteration.cjs:178` | verify-iteration help advertises an unsupported loop type |

**Merge groups (the register reports 0 duplicates, but these are the same fix reported by different iterations; treat each group as ONE work unit while keeping all IDs mapped):** {`F-001-01`, `F-026-01`} runtime scripts README link; {`F-001-02`, `F-026-02`} sk-doc-command adapter; {`F-001-03`, `F-026-03`, `F-038-05`} family and lane roster; {`F-026-08`, `F-035-04`} external-adapter backend kind. **Lane assignment.** Lane B (code hygiene): `F-002-03`, `F-036-05`, `F-031-01`, `F-031-02`, `F-003-04`. Everything else is Lane A. Tasks below are representative per lane rather than one per finding.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/README.md` | Modify | Lane A: backend kind and roster, pointing at the registry as the source |
| `.opencode/skills/system-deep-loop/deep-research/README.md` | Modify | Lane A: roster; corruption-repair claim corrected |
| `.opencode/skills/system-deep-loop/deep-ai-council/README.md` | Modify | Lane A: scenario count, roster, completion-gate wording |
| `.opencode/skills/system-deep-loop/deep-alignment/README.md` | Modify | Lane A: adapter inventory and the nonexistent flag |
| `.opencode/skills/system-deep-loop/deep-improvement/README.md` | Modify | Lane A: output-location claim |
| `.opencode/skills/system-deep-loop/runtime/README.md` | Modify | Lane A: alignment as a consumer |
| `.opencode/skills/system-deep-loop/runtime/scripts/README.md` | Modify | Lane A: dead link (merge group with `F-026-01`) |
| `.opencode/skills/system-deep-loop/deep-review/SKILL.md` | Modify | Lane A: empty trailing heading |
| `.opencode/skills/system-deep-loop/runtime/references/script-interface-contract.md` | Modify | Lane A: loop-type coverage |
| `.opencode/skills/system-deep-loop/runtime/scripts/{verify-iteration.cjs,render-command-contract.cjs}` | Modify | Lane A: help text derived from the real tables |
| `.opencode/skills/system-deep-loop/benchmark/reports/README.md` | Modify | Lane A: backfilled index plus a drift check |
| `.opencode/skills/system-deep-loop/deep-improvement/assets/**` | Modify | Lane A: fixture catalog path, inert profile and taxonomy |
| `.opencode/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs` | Modify | Lane A: documented gate versus implemented advisory |
| `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts` | Modify | Lane B: locale-independent digest ordering (`F-002-03`) |
| `.opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/wave-plan.ts` | Modify | Lane B: readonly wave collections (`F-036-05`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts` | Modify | Lane B: adopt the `027` shared strict validator (`F-031-01`, `F-031-02`) |
| `.opencode/skills/system-deep-loop/commands/deep/assets/deep-research-auto.yaml` | Modify | Lane B: persist snapshots so a baseline accumulates (`F-003-04`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Wherever a fact is duplicated across documents, the copies are replaced with a link to one authoritative source. | For each merge group and each duplicated roster fact, exactly one document states it; the others link. |
| REQ-002 | A drift check derives family, lane, adapter and scenario counts from the registry and playbook indices, and fails on mismatch. | The check fails against a deliberately mismatched roster and passes against the real one. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A local-link scan reports zero broken links across the touched documents. | Scan output with zero failures. |
| REQ-004 | Help text is generated from the real command and leaf tables rather than retyped. | `verify-iteration` help lists only supported loop types; the command renderer lists every supported command. |
| REQ-005 | The benchmark report index matches the report folders, with a drift check. | Backfilled index plus a folder-versus-index check that fails on a missing entry. |
| REQ-006 | The policy digest is locale-independent. | A hostile-locale determinism test produces the same digest for identical definitions. |
| REQ-007 | Frozen wave collections are typed as readonly rather than cast to mutable arrays. | The casts are removed and the type checks. |
| REQ-008 | Research and review mode gates adopt the shared strict validator rather than a local patch. | Unknown top-level keys and malformed rollback-window rows are rejected, matching the newer modes. |
| REQ-009 | Auto research convergence persists snapshots so a sliding-window baseline accumulates. | A run produces persisted snapshots and an accumulating baseline. |
| REQ-010 | Council completion documentation matches its implementation, or the implementation matches the documentation. | Either the advisory becomes a gate, or the docs stop calling it a gate. One of the two, recorded. |

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

- **SC-001**: All 29 scoped findings closed as fixed, `REFUTED`, or `ALREADY-FIXED`, with the four merge groups handled as single work units.
- **SC-002**: No duplicated roster fact remains; each is stated once and linked elsewhere.
- **SC-003**: The registry-derived drift check fails on a deliberately mismatched roster.
- **SC-004**: Zero broken local links across the touched documents.
- **SC-005**: Help text is generated, not retyped.
- **SC-006**: A hostile-locale determinism test produces stable policy digests.
- **SC-007**: The legacy mode gates use the shared validator `027` introduced.
- **SC-008**: `npm run typecheck && npm test` in `runtime` green, reported as a delta against the `021` baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The child recurs because copies are fixed instead of being replaced with links | High | REQ-001 is the governing rule and is a P0; a fix that leaves two copies of a fact fails the checklist |
| Risk | Lane B touches the same mode-gate file as `027` | Medium | Sequenced after `027`; Lane B adopts the validator rather than patching around it |
| Risk | The derive-counts work grows into real tooling and outgrows Level 2 | Medium | That is an explicit promotion trigger to Level 3, recorded as an open question |
| Dependency | `027` shared strict validator | Blocks REQ-008 | Sequence after `027` |
| Dependency | `024` policy registry, `021` baselines | Blocks REQ-006 and evidence issuance | Sequence after both |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Single source
- **NFR-S01**: A fact must be stated in exactly one document; every other mention links to it.
- **NFR-S02**: A count that exists in a registry must be derived, never retyped.

### Determinism
- **NFR-D01**: Policy digests must be identical for identical definitions across host locales.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- A roster entry that exists in the registry but has no document: the drift check must report it rather than pass.
- A report folder with no index entry: the drift check must fail (`F-033-04`).

### Error Scenarios
- A deliberately mismatched roster: the drift check fails.
- A locale with a different collation: the policy digest is unchanged (`F-002-03`).
- An unknown top-level key in gate evidence: rejected, matching the newer modes (`F-031-01`).

### State Transitions
- A new family or lane added to the registry: the drift check fails until the authoritative document is updated, which is the intended behavior.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Does the derive-counts-from-registry work become real tooling rather than text edits? If it does, this child promotes from Level 2 to Level 3 and gains a decision record. Decide once the drift check is scoped.
- Which document is the authoritative source for the family, lane, adapter and scenario rosters? The registry is the machine source, but a human-readable authoritative document still has to be named so the other READMEs know what to link to.
- For `F-038-06`, does council completion become a real gate, or do the docs stop calling it one? The finding is satisfied either way, but the two have different consequences for callers that currently rely on the advisory returning 0.
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
