---
title: "Feature Specification: routing-advisor-and-hook-truth"
description: "The skill advisor is a hard routing dependency whose published gates are unachievable against its own checked-in baseline, whose hook topology names files that do not exist, and whose README contradicts itself three paragraphs apart. Hook-adapter contracts across four runtimes and the prompt-model roster carry the same disease."
trigger_phrases:
  - "advisor validation baseline"
  - "hook topology drift"
  - "prompt model roster"
  - "hook adapter contract"
  - "cli tool count authority"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/003-routing-advisor-and-hook-truth"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "track-e-spec-author"
    recent_action: "Authored phase spec from the track (e) synthesis proposal"
    next_safe_action: "Run T001 confirm-against-HEAD, hook-topology findings first"
    blockers:
      - "Soft-blocked on the canon rulings in the sibling canon phase"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending-first-save"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "DR-6 — is the advisor gate an absolute floor or a bounded delta from a dated snapshot?"
      - "Q3 — supplementary findings admitted into this child?"
      - "Q4 — the Codex hook drift is user-global machine state"
    answered_questions: []
---
# Feature Specification: routing-advisor-and-hook-truth

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

The repository's constitution makes the skill advisor a hard routing dependency, and its documentation is wrong in three ways that each cost something different. Its published validation gates declare thresholds that the repository's own dated baseline snapshot fails, so following the document makes the checked-in baseline an automatic hard regression. Its hook reference and integration inventory describe adapter files that do not exist, omit one that does, and print a runtime roster containing the same name twice; a sibling reference has the mirror-image defect. Its README says stale index state refuses to answer, three paragraphs above its own table saying stale means answer-with-caveat. Alongside these, the prompt-model roster is stale in four places against its own profile data, a prompt-improver agent rule caps iterations below the contract it cites as its source, and one CLI reference publishes tool counts from four mutually inconsistent authorities.

**Key Decisions**: whether the advisor gate is an absolute floor or a bounded delta from a dated snapshot — a policy question that must be ruled before the numbers are touched, or the edit just moves the lie.

**Critical Dependencies**: soft-blocked on the canon phase's reference-structure rulings. Consumes the fleet-gate re-baseline captured by the first phase.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

**Wrong gates.** The advisor's published validation baselines declare corpus, holdout and unknown-count thresholds as hard ship-blocking values. The baseline JSON checked into the same repository, captured on a recorded date, records numbers below all three. An engineer who follows the document must conclude the repository is in permanent hard failure. The honest reading is that the gate was never re-derived after the scorer work that moved the numbers.

**Wrong topology.** The advisor's hook reference and its integration inventory describe adapters at paths that do not exist, give smoke commands against those absent files, omit the adapter that is actually live, and print the runtime roster with one name repeated in place of another. A sibling reference has the mirror-image defect: it points at an absent adapter and an absent settings file while omitting a registered, live lifecycle adapter. One further adapter is registered in a runtime's own hook configuration while its file is absent from the repository entirely — confirmed at authoring.

**Wrong self-description.** The advisor README states that stale index state causes a refusal, three paragraphs above its own trust table stating that stale means use-with-caveat; the code returns empty only for absent or unavailable state. Around these, a prompt hub's model roster is stale in four places against its own profile data, to the point where a model with an authored profile cannot be selected by the leaf router at all; a prompt-improver agent rule stops two iterations short of the contract it links to as its source of truth; six references in that hub break the canonical structure rule; and one CLI reference publishes counts from four authorities that disagree with each other and with the live smoke check.

### Purpose

For every number and every path in these documents, the generator is named and the retyped copy is deleted — and where a number is a policy threshold rather than a measurement, the policy is ruled explicitly before the number is written.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The advisor's published validation gates, ruled as policy before being rewritten.
- Hook topology truth across the advisor's own references, the sibling configuration reference, and the per-runtime adapter documentation — including one adapter registered in a runtime config whose file is missing.
- The advisor's self-contradictory README statement about stale index state.
- The prompt hub's model roster, iteration cap and reference structure.
- Single-sourcing the CLI tool counts that currently have four disagreeing authorities.
- Documenting the installation-drift check command and the project-versus-user-global distinction — **documentation only**; see the escalation below.
- The four registry-supplementary findings routed here: two hook-adapter contract defects, one safety-contract honesty defect, and one evergreen-authoring violation in the same file as the safety one. **[OPERATOR-DECISION: Q3 — supplementary findings]**

### Out of Scope

- **Repairing the operator's user-global hook installation.** The drift is real and the check detects it, but it is machine state on one workstation, not a repository defect, and a documentation packet must not silently modify a global install. **[OPERATOR-DECISION: Q4 — Codex hook drift]**
- Editing the baseline snapshot JSON, the scorer, or any threshold-consuming code to make the published gates true. The snapshot is a measurement; the gate is a policy; the fix is to the policy statement.
- Making the pre-push hook fail closed. The supplementary safety finding is about a **documentation** claim that overstates the protection. Changing the hook's failure mode is a behaviour change with its own blast radius and belongs in a code packet, not here.
- Structural template rules that the canon phase is about to change. This phase waits for those rulings rather than enforcing a rule mid-flight.

### Findings in scope — the 18 registry findings

| ID | Sev | Primary surface | Claim | Verification status at authoring |
|----|-----|-----------------|-------|----------------------------------|
| RE-003-01 | P1 | `system-spec-kit/references/config/hook-system.md` | Describes a retired runtime topology; points at an absent adapter and an absent settings file; omits a registered live adapter | Unverified — **confirm first**, the hook trees moved twice in recent packets |
| RE-003-02 | P1 | `system-spec-kit/references/hooks/skill-advisor-hook.md` | Non-runnable instructions for one runtime | Unverified — **confirm first** |
| RE-003-04 | P2 | `system-spec-kit/README.md` | Runtime inventory omits one registered runtime | Unverified — confirm in T001 |
| RE-003-05 | P2 | `system-spec-kit/references/workflows/auto-mode-contract.md` | Provenance content inserted before numbered content | Unverified — one of only three true structural violations in the program |
| RE-003-07 | P2 | `system-spec-kit/references/config/hook-system.md` | Installation drift is detectable but not surfaced by skill-level guidance | Confirmed — **escalation, not a repair.** See below and Q4 |
| RE-007-01 | P1 | `system-skill-advisor/references/scoring/validation-baselines.md` | Published hard gates exceed the checked-in dated baseline on all three axes | Confirmed by synthesis — the doc makes the repo's own baseline an automatic failure. **DR-6** |
| RE-007-02 | P1 | `system-skill-advisor/references/hooks/skill-advisor-hook.md` | Documents retired adapter source paths and omits the live one | Unverified — **confirm first** |
| RE-007-03 | P1 | `system-skill-advisor/README.md` | Says stale state refuses to answer; its own table three paragraphs later says use-with-caveat | Confirmed by synthesis — self-contradiction inside one file |
| RE-007-04 | P1 | `sk-prompt/sk-prompt-models/SKILL.md` | Runtime contract omits active model routes | Unverified — confirm in T001 |
| RE-007-05 | P1 | `sk-prompt/shared/references/smart-routing.md` | The leaf router cannot select a model that has an authored profile | Unverified — confirm in T001; the sharpest consumer-facing defect in this phase |
| RE-007-06 | P1 | `sk-prompt/sk-prompt-improve/SKILL.md` | Agent rule caps iterations below the contract it cites as its source | Unverified — confirm in T001 |
| RE-007-07 | P1 | `system-skill-advisor/SKILL.md` | Integration inventory repeats a nonexistent hook and omits the live one | Unverified — **confirm first** |
| RE-007-08 | P2 | `sk-prompt/README.md` | Presents an obsolete model roster | Unverified — confirm in T001 |
| RE-007-09 | P2 | `sk-prompt/sk-prompt-models/README.md` | Orientation omits three active models | Unverified — confirm in T001 |
| RE-007-10 | P2 | `sk-prompt/` (six references) | Six references break the canonical numbered-structure rule | Confirmed by synthesis — soft-blocked on the canon phase's ruling |
| RE-007-11 | P2 | `system-skill-advisor/references/runtime/tool-ids-reference.md` | Overcounts public tools and carries a broken related link | Unverified — confirm in T001 |
| RE-007-12 | P2 | `system-skill-advisor/mcp-server/lib/subprocess.ts` | A timeout flag has live advisor-owned consumers | Confirmed — this fact is what closed a refuted finding; it moves doc ownership of the flag into this hub |
| RE-008-06 | P1 | `system-spec-kit/references/cli/daemon-cli-reference.md` | Tool counts have four mutually inconsistent authorities | Confirmed by synthesis — the reference, two prose sites, and the live smoke check all disagree |

### Findings in scope — registry-supplementary

These four iteration-6 entries sit in the registry's `repeated[]` bucket, outside the 74, because they collided on a file-plus-title dedupe rather than on content. **Each is confirm-first with an explicit re-verify flag.** Marked `§`.

| ID | Sev | Primary surface | Claim | Judgment |
|----|-----|-----------------|-------|----------|
| RE-006-04 § | P1 | `.cursor/hooks.json`, `sk-git/scripts/hooks/README.md` | A runtime's hook config registers an adapter whose file is absent; the adapter README documents the same absent path and a validation command that cannot run | Admitted — genuinely new. **Confirmed at authoring: the registered adapter file is absent from the repository.** Same defect class as the scheduled hook-topology findings, which is why it lands here rather than in the surface sweep |
| RE-006-05 § | P1 | `sk-git/scripts/hooks/pi/README.md` | The adapter README describes a return contract the extension's own code says is discarded, naming the wrong visible channel | Admitted — genuinely new. Anyone implementing from this README produces an advisory the model never sees |
| RE-006-06 § | P1 | `sk-git/references/remote-branch-policy.md` | **Safety-relevant.** The policy presents a pre-push hook as a reliable enforcement backstop; the hook and its own tests document fail-open behaviour when the validator is missing or broken | Admitted — genuinely new, and it outranks several scheduled items. **Reproduce the fail-open path before editing.** The repair is documentation honesty: state the limitation prominently and separate advisory enforcement from guaranteed enforcement. Changing the hook's failure mode is explicitly out of scope |
| RE-006-09 § | P2 | `sk-git/references/remote-branch-policy.md` | The evergreen reference carries packet-history citations that the evergreen authoring rule prohibits | Admitted — genuinely new. **Co-located here with `RE-006-06` deliberately: both edit one file, and one file gets one owner.** The alternative would have put it in the surface-sweep phase and created a two-child conflict |

**Scope-table total for this phase: 18 + 4 = 22 items.**

### Escalation, not a doc repair

The installation-drift check reports missing and orphaned hook paths at **user-global** scope. That is the operator's workstation, not this repository. This phase's only action is to document the check command and to make the project-versus-user-global distinction explicit in the guidance, so a future reader does not mistake one scope for the other. It must **not** run a repair against a global installation as part of a documentation packet. **[OPERATOR-DECISION: Q4 — Codex hook drift]**

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/references/scoring/validation-baselines.md` | Modify | Gate statement rewritten per the DR-6 ruling; the snapshot's date carried with the number |
| `.opencode/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md` | Modify | Any threshold restatement made a link |
| `.opencode/skills/system-skill-advisor/references/hooks/skill-advisor-hook.md` | Modify | Adapter paths, smoke commands and runtime roster corrected |
| `.opencode/skills/system-skill-advisor/{README.md,SKILL.md}` | Modify | Stale-state behaviour stated once and correctly; integration inventory matched to the live adapters |
| `.opencode/skills/system-skill-advisor/references/runtime/tool-ids-reference.md` | Modify | Count single-sourced; broken link repaired |
| `.opencode/skills/system-spec-kit/references/config/hook-system.md` | Modify | Topology corrected; drift-check command and scope distinction documented |
| `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` | Modify | Instructions made runnable |
| `.opencode/skills/system-spec-kit/references/workflows/auto-mode-contract.md` | Modify | Numbered structure restored |
| `.opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md` | Modify | Counts single-sourced from one constant |
| `.opencode/skills/system-spec-kit/README.md` | Modify | Runtime inventory completed |
| `.opencode/skills/sk-prompt/{README.md,shared/references/smart-routing.md}` | Modify | Roster generated or CI-verified; router able to resolve every profiled model |
| `.opencode/skills/sk-prompt/sk-prompt-models/{SKILL.md,README.md,references/models/**}` | Modify | Active routes and orientation; six references restructured per the canon ruling |
| `.opencode/skills/sk-prompt/sk-prompt-improve/SKILL.md` | Modify | Iteration cap matched to the contract it cites |
| `.opencode/skills/sk-git/scripts/hooks/README.md` | Modify | Adapter path matched to the maintained adapter |
| `.cursor/hooks.json` | Modify | Registration matched to a file that exists, or the proxy restored |
| `.opencode/skills/sk-git/scripts/hooks/pi/README.md` | Modify | Return contract and visible channel corrected |
| `.opencode/skills/sk-git/references/remote-branch-policy.md` | Modify | Fail-open limitation stated prominently; packet-history citations replaced with stable source paths |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every finding is confirmed against HEAD before it is edited, with the hook-topology group confirmed first | `tasks.md` T001 produces a per-ID disposition; the four hook-topology findings and the four supplementary items are dispositioned before any edit in their lanes |
| REQ-002 | The advisor gate policy is ruled before any threshold number is rewritten | `decision-record.md` DR-6 has a status and a rationale; no threshold edit lands before it |
| REQ-003 | Every hook source path and smoke command named in the hook references resolves to a file that exists | A path-existence assertion over both references returns zero unresolvable entries |
| REQ-004 | The safety-relevant supplementary claim is reproduced before it is edited, and the repair is documentation honesty only | The fail-open path is demonstrated or the claim is marked refuted; the hook's failure mode is unchanged by this phase |
| REQ-005 | Live numbers are captured before any edit and the delta is reported | Advisor validation output and CLI smoke output recorded verbatim pre-edit; post-edit values reported as a delta, not as a fresh absolute |
| REQ-006 | The packet validates clean | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` exits 0 with Errors: 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The advisor's stale-state behaviour is stated once, and it matches the code | Grep the README for stale-state statements; exactly one remains and it agrees with what the code returns |
| REQ-008 | The prompt-model roster is generated or CI-verified against its profile data, and the router can resolve every model with an authored profile | An assertion over the profile data and the router's selectable set; the currently unselectable model resolves |
| REQ-009 | The CLI tool counts have one authority | All three consuming sites read one constant, or the reference is generated from it; the smoke check and the reference agree |
| REQ-010 | The six structurally non-conformant references pass the document validator | `python3 .../validate_document.py --type reference` over the six returns zero blocking errors — run **after** the canon phase's structure ruling |
| REQ-011 | The four supplementary findings each reach a terminal state, individually verified | Per-ID disposition with its own evidence line; no batch edit |
| REQ-012 | The installation-drift guidance distinguishes project scope from user-global scope, and no global install is modified | The guidance names the check command and the scope distinction; no task in this phase writes outside the repository |
| REQ-013 | No no-regression claim in this phase predates the fleet-gate re-baseline | The claim cites the recorded re-baseline captured by the first phase, not a remembered pass count |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero unresolvable hook source paths or smoke commands across both hook references.
- **SC-002**: The advisor gate statement is consistent with the dated snapshot under a ruled policy, and carries the snapshot's date.
- **SC-003**: Every model with an authored profile is resolvable by the leaf router.
- **SC-004**: One authority for the CLI tool counts; all consumers agree.
- **SC-005**: The safety-relevant documentation claim no longer presents fail-open enforcement as a reliable backstop.
- **SC-006**: Each of the 22 scope items ends in exactly one state: repaired, stale-finding, already-fixed, or deferred-with-reason.
- **SC-007**: `validate.sh --strict` reports Errors: 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The canon phase's structure and reference-template rulings | Six references cannot be restructured | Soft block; this phase's other lanes proceed meanwhile |
| Dependency | The first phase's fleet-gate re-baseline | No-regression claims are unfalsifiable | REQ-013 forbids claiming against a remembered number |
| Dependency | Advisor validation and CLI smoke commands runnable | Baselines cannot be captured | Capture early; if unavailable, mark those numbers unverified rather than editing them |
| Risk | The hook trees moved again since the research loop | High — this is the least stable surface in the program | Hook-topology findings are confirmed first, before any other lane starts |
| Risk | Editing the gate numbers before ruling the policy | High — it moves the lie instead of removing it | DR-6 is a hard predecessor to the threshold edit |
| Risk | The safety finding is treated as a code fix | Med | Explicitly out of scope; the repair is documentation honesty and the hook's behaviour is untouched |
| Risk | Two children edit the same policy file | Med | Both supplementary items touching it are co-located here; the surface-sweep phase does not touch it |
| Risk | Restoring an absent runtime adapter is treated as trivial | Med | Restoring a proxy is a behaviour change; the safe default is to correct the registration and the documentation to the maintained path, and to flag restoration separately |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The path-existence assertion over the hook references must run in seconds so it can be reused by later phases and by CI.

### Security
- **NFR-S01**: No task in this phase writes outside the repository. The user-global installation is read-only to this packet, including its check command.

### Reliability
- **NFR-R01**: The roster and count assertions must fail when their authority file is missing, not silently pass on an empty set.

---

## 8. EDGE CASES

### Data Boundaries
- A hook path that exists but is not registered, and a registration that points at nothing: both are failures, and the assertion covers both directions.
- A model profile that is deliberately not routable: the assertion allows it only with an explicit exclusion marker, never by silence.

### Error Scenarios
- The advisor validation command unavailable: the affected numbers are marked unverified, not rewritten from the document.
- The fail-open path not reproducible: the safety claim is recorded as refuted rather than edited on assumption.
- The canon ruling arriving after the other lanes finish: the six references are the last edit, not a blocker on the rest.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 17/25 | ~20 files across four skill roots plus one runtime config |
| Risk | 17/25 | Auth: N, API: N, Breaking: a mis-edited hook registration affects a live runtime; one safety-contract claim |
| Research | 13/20 | Live-number capture, a fail-open reproduction, and the least stable surface in the program |
| Multi-Agent | 5/15 | Runs parallel to one sibling |
| Coordination | 9/15 | Soft-blocked on canon; consumes another phase's baseline |
| **Total** | **61/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Hook topology moved again; findings are stale | H | H | Confirmed first, before any other lane |
| R-002 | Gate numbers edited before the policy is ruled | H | M | DR-6 hard predecessor |
| R-003 | Safety claim repaired as a behaviour change | H | L | Out of scope in writing; reproduce-then-document-only |
| R-004 | A hook registration edit breaks a live runtime | H | L | Correct-the-registration default; restoration flagged separately |
| R-005 | Roster assertion passes on an empty profile set | M | M | Fails on missing authority; parsed count reported |
| R-006 | Supplementary findings are stale | M | M | Confirm-first per ID with its own evidence line |

---

## 11. USER STORIES

### US-001: Shipping against the advisor gate (Priority: P0)

**As an** engineer preparing a change that touches routing, **I want** the published gate to be achievable and dated, **so that** I can tell a real regression from a threshold that was never re-derived.

**Acceptance Criteria**:
1. Given the baselines reference, When I compare its thresholds to the checked-in snapshot, Then the comparison is coherent under the ruled policy and the snapshot's date is visible.

### US-002: Wiring a hook adapter (Priority: P0)

**As an** engineer wiring the advisor into a runtime, **I want** every documented adapter path and smoke command to point at a file that exists, **so that** I am not debugging a missing file that the documentation invented.

**Acceptance Criteria**:
1. Given both hook references, When every path and command is resolved, Then none is unresolvable.
2. Given a runtime's hook configuration, When it registers an adapter, Then that adapter's file exists.

### US-003: Trusting a stated protection (Priority: P1)

**As an** operator relying on a documented push protection, **I want** the document to say plainly that the check fails open when its validator is missing or broken, **so that** I do not treat advisory enforcement as guaranteed enforcement.

**Acceptance Criteria**:
1. Given the policy document, When I read the enforcement section, Then the fail-open limitation is stated prominently and advisory enforcement is distinguished from guaranteed enforcement.

---

## 12. OPEN QUESTIONS

- **[OPERATOR-DECISION: DR-6 — gate policy]** Is the advisor gate an absolute floor, or a bounded delta from a dated snapshot? Two of the research loop's open questions are this same question. **Not pre-decided by this package** — it is a policy choice, and editing the numbers before ruling it just relocates the inaccuracy.
- **[OPERATOR-DECISION: Q4 — Codex hook drift]** Confirm the user-global repair runs separately, outside this packet.
- **[OPERATOR-DECISION: Q3 — supplementary findings]** The four `§` items are admitted on the synthesis's recommendation. If the operator declines, the arithmetic returns to 18 and the safety-relevant claim needs another home — it should not simply disappear.
- Should the absent runtime adapter be restored, or should its registration and documentation be repointed at the maintained adapter? Restoration is a behaviour change; the safe default is repointing, with restoration raised separately.
- Does the timeout-flag documentation move wholesale to the advisor hub, or does the sibling keep a pointer? The consumer evidence says the advisor owns it; the pointer is a courtesy the sibling may want.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md` — scaffolded from the template at copy time; DR-6 is decided during execution, not pre-decided by this spec
- **Parent Spec**: See `../spec.md`
