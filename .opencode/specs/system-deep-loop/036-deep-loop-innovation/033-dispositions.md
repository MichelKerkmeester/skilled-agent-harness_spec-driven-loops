# Dispositions and Reclassifications for the 166-Finding Gate

**Status:** Planned. Documentation only. No code change, nothing to test.
**Placement:** parent-level documentation under
`.opencode/specs/system-deep-loop/036-deep-loop-innovation/`, per the WS1 proposal. This content
is not a fix child and does not claim a numbered folder; it records decisions that must be
**written down rather than built**, so a later reader does not re-triage them as open defects.
**Wave:** W1, alongside `021`. A dark-by-design reclassification has to be recorded *before*
triage, or the reclassified finding gets re-triaged as a defect by whoever picks up W3.
**Source:** `016-whole-system-gate/review/` (`review-report.md`, `findings-register.md`,
`deep-review-findings-registry.json`), plus `PRE-014-VALIDATION-RUN.md` and
`alignment/STOPPED-AFTER-SAMPLE.md`.

---

## 1. NO-FIX DISPOSITION: `F-022-01`

| Field | Value |
|-------|-------|
| **Finding** | `F-022-01` |
| **Severity** | P1 |
| **Dimension** | traceability |
| **Review mark** | `CONFIRMED-BY-DESIGN` |
| **Location (at review time)** | `commands/deep/assets/deep-research-confirm.yaml:1059` |
| **Title** | 013 typed migration families are absent from the shipped research and review execution paths |
| **Disposition** | **NO FIX - dark by design** |
| **Owner of the re-open trigger** | child `021` (it owns completion-claim honesty) |

### Stated reason

Quoting the register's own verification note: the finding is *"factually accurate (live workflows
still call the legacy reduce-state paths; no non-test callers of the typed families) but this is
the INTENDED additive-dark state, not a defect: the migration program deliberately built the typed
spine without wiring authority, so authority flips one mode at a time at the cutover phase.
Reclassify as expected-state documentation, NOT a cutover blocker. It becomes a real finding only
if a packet claims real-run migration-gate evidence."*

Implementing the finding's recommended action - mode-owned adapters wiring both workflows through
the typed spine - would **pre-empt phase `014`**, which exists precisely to flip authority per mode
behind rollback windows and cutover certificates. Building the adapters now would move authority
outside the phase designed to move it, which is a larger defect than the one being closed.

This is also consistent with sequencing invariant 3 in the `036` parent spec: *"The new substrate
stays additive, dark, and non-authoritative until legacy adapters, shadow parity, and rollback
pass (008)."* The absence of production callers is that invariant holding, not failing.

### Re-open trigger

> **`F-022-01` reopens as a genuine traceability defect if any packet claims real-run
> migration-gate evidence before `014` executes.**

Enforcement belongs to child `021`, which owns completion-claim honesty across the program. The
concrete check: any completion claim citing a real-run migration gate, in any packet, before
`014` is Complete, reopens this finding. `021` records the check; this document records the
trigger it enforces.

### What would NOT reopen it

- A test-only caller of a typed migration family. Test callers are expected in the dark state.
- A `014` cutover flipping one mode's authority. That is the designed transition, and after it the
  finding is resolved for that mode rather than reopened.
- A future packet documenting the dark state. Documentation is what this disposition asks for.

---

## 2. THE CALIBRATION LEDGER

The review report names three calibration classes plus a fourth recurring family. Each one changed
the shape of the remediation tree, and each is recorded here so a future reader cannot re-escalate
a batched finding on its severity label alone.

### 2.1 Severity inflation - P0 means cutover-readiness, not breach risk

The report is explicit: *"in every confirmed case the actor is the operator or a stale local file,
not a remote attacker ... read P0 as cutover-readiness and robustness risk, not breach risk."*

**Batching decisions this justified, and which are therefore auditable rather than arbitrary:**

| Batched into | Findings | Why batched rather than given a child each |
|---|---|---|
| `029-improvement-promotion-authority` | `F-017-01`..`F-017-05`, `F-019-01`, `F-019-02`, `F-021-01` (8 P0) | One mechanism: mutable local JSON treated as authority. The actor is the operator or a stale local file. |
| `028-fanout-dispatch-integrity` | `F-010-01`, `F-010-02`, `F-016-01`, `F-016-02`, `F-016-03` (5 P0) | Dispatch-layer robustness. `F-016-02` is the one with a demonstrated live consequence, and it is a concurrent-session hazard, not an external one. |

**`F-016-01` specifically.** Tagged `CONFIRMED-SEVERITY-CALIBRATED` in the register. The
interpolated values (`{research_topic}`, `{config.fanout_json}`, paths) are operator-supplied, so
the realistic failure is *a broken dispatch from ordinary punctuation*, not an injection incident.
It is a robustness fix inside `028` (move to `execFile`/argv), not an emergency child. **Do not
re-escalate it on its P0 label.**

**What this calibration does not mean.** It is not a claim that these findings are unimportant.
Eight of them block the improvement lanes of `014`, and promotion copies bytes into canonical
targets, so a mistake overwrites shipped files. The calibration bounds the *threat model*, not the
*priority*.

### 2.2 Evidence drift - route by defect, not by file

Blocker 4's class. A finding whose defect is "a cited number that reproduces from nothing" belongs
to the reconcile child `021`, **not** to the module child of the file it cites. That is why
`F-025-01`..`F-025-04` (checklists under `013/`), `F-029-01` (the review manifest), `F-ORC-01` (the
red alignment baseline) and `F-035-01` (a rollout promoted without its evidence mechanism) are all
in `021` even though they touch five different trees.

A future reader looking for `F-029-01` under `016-whole-system-gate` will not find a fix there.
It is in `021`, by this rule.

### 2.3 Dark by design - see §1

The one instance is `F-022-01`. The rule generalizes: a finding noting that a typed migration
family has no production callers is describing the intended additive-dark state and is
expected-state documentation, not a defect.

### 2.4 Silent-failure semantics - a family, not a scatter

The report's fourth recurring family, *"unmeasured or invalid input presenting as fine"*, is one
mechanism with one fix pattern (strict parse plus an honest exit code) spread across 23 findings in
about 15 files. It earns its own child, `031`, rather than being distributed into the module
children of the files it touches. Recorded here so the concentration is legible as a decision.

---

## 3. THE FROZEN SCOPE MANIFEST - RATIONALE FOR NOT FIXING IT MID-RUN

`F-029-01` (CONFIRMED-WITH-CORRECTION) records that the review scope manifest included ignored and
untracked entries while omitting a tracked frozen benchmark baseline.

**The fix belongs to `021`.** The *rationale for not having fixed it during the run* belongs here:
the manifest imperfection was **deliberately frozen mid-run**, because re-scoping at iteration 30
would have meant iterations 1-29 audited a different corpus than iterations 30 onward. A corpus
that changes mid-audit produces findings that cannot be compared across iterations, which is a
worse defect than an imperfect but stable corpus.

Note also the register's own correction: the reporting leaf claimed 48 omissions; the real number
is 33. That discrepancy is itself evidence for the confirm-before-build rule every fix child opens
with - leaves get the mechanism right and the specifics wrong.

---

## 4. THE ALIGNMENT HALF'S OWN DISPOSITION

`alignment/STOPPED-AFTER-SAMPLE.md` records that the alignment half of the run stopped after 1 of
22 planned iterations, that its coverage was self-attested, and that its severity was keyed to rule
modality rather than to consequence.

**Disposition: a documentation and style conformance census over the whole skill is a reasonable
standalone work item, and is explicitly NOT part of this remediation tree.**

Reasons:

1. **It needs its own scope.** A conformance census over a whole skill is a different shape of work
   from remediating code-verified findings against a frozen corpus.
2. **It needs a severity bar keyed to consequence, not rule modality.** The sample produced roughly
   176 false P0s for missing comment dividers. A bar that promotes a missing divider to P0 is not a
   bar that can prioritise anything.
3. **It needs coverage claims bound to evidence of work.** This is the same defect `F-RES-04`
   describes inside alignment itself, and child `026` is building the mechanism that would fix it.
   A census run before that mechanism exists would inherit the same self-attestation problem.
4. **Folding it in would bury the real blockers.** Roughly 1,030 style findings against four
   code-verified cutover blockers is an order of magnitude of noise over the signal.

**Recommendation: a separate top-level packet, not a child here.** Sequence it after `026` lands
the evidence-binding mechanism, so its coverage claims can be bound to evidence of work from the
start.

---

## 5. WHAT THIS DOCUMENT IS NOT

- It is **not** a deferral list. `F-022-01` is dispositioned with a reason and a re-open trigger,
  not postponed. Every other one of the 165 findings maps to a fix child.
- It is **not** a severity override. The register's severities stand; this records the threat model
  they were assigned under.
- It is **not** a place to add new dispositions during execution. A new no-fix disposition needs
  the same three things this one has: a stated reason quoting evidence, a named owner, and a
  re-open trigger. Add it here only with all three.

---

## 6. COVERAGE ACCOUNTING

| Category | Count |
|---|---|
| Findings in the canonical registry | 166 |
| Assigned to a fix child (`021`-`032`) | 165 |
| No-fix disposition recorded here | 1 (`F-022-01`) |
| Deferred without a disposition | 0 |

Verified programmatically against
`016-whole-system-gate/review/deep-review-findings-registry.json`: 166 IDs assigned, 166 canonical,
0 missing, 0 extra, 0 duplicates; severity split 36 P0 / 104 P1 / 26 P2 matches
`findingsBySeverity` exactly.
