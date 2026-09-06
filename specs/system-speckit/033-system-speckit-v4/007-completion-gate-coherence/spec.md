---
title: "Feature Specification: One Validation Verdict, Honestly Earned"
description: "Make the completion gate return the same verdict whatever the environment, stop counting one fault several times, and remove the checks a packet cannot satisfy from inside itself."
trigger_phrases:
  - "validation gate coherence"
  - "validator engine selection"
  - "strict validation failure rate"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/007-completion-gate-coherence"
    last_updated_at: "2026-08-29T10:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the amendments the measurements forced"
    next_safe_action: "None outstanding; the packet is complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: One Validation Verdict, Honestly Earned

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 7 of 24 |
| **Predecessor** | `../006-derived-metadata-repair-tool/spec.md` |
| **Successor** | `../008-template-contracts-and-acceptance-criteria/spec.md` |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Strict validation is the repository's completion gate. It does not currently
return a stable answer.

The same packet, the same command, the same flags:

```
validate.sh <packet> --strict --quiet            → RESULT: FAILED   exit 2
SPECKIT_VALIDATE_LEGACY=1 validate.sh <same>     → RESULT: PASSED   exit 0
```

Two validators exist. Which one runs is chosen by environment — a legacy switch,
a rule-subset variable, or simply whether a build is present — with no flag and
no line of output saying which answered. They disagree because one rule is
gated on a feature flag in one engine and runs unconditionally in the other, so
a documented opt-in is enforced whether or not anyone opted in. Whether work
counts as finished depends on how the caller's shell happened to be configured.

Two further faults make the gate report more failures than there are faults.

A repository-wide check runs inside the per-packet gate. It compares command
trees, which has nothing to do with the folder being validated, so no packet can
satisfy it from inside itself. Thirty-three documents across roughly eighteen
packets record the same workaround: read the folder's own result line and
disregard the gate's exit status. A check nobody can satisfy has taught readers
to ignore the authority of the gate that carries it.

And one fault is counted twice. Two rules failed on exactly the same fifteen
folders out of one hundred and thirty-seven, with no exceptions — they are two
branches of one function, reporting once each that a document does not follow
its template. A third rule performs the same comparison at a lower severity and
is already stubbed out on the default engine.

Under thirty-one percent of packets pass strict cleanly. At that rate the gate
stops discriminating between packets worth attention and packets that merely
exist, which is exactly the pressure that produced those thirty-three
workarounds.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- One verdict per packet, independent of environment, with the engine that
  produced it named in the output.
- One source of truth for whether the freshness rule applies.
- Moving the repository-wide command-tree check out of the per-packet gate and
  running it where it belongs.
- Collapsing the duplicated template-shape reporting into a single finding.
  (Withdrawn during the work; see the amendment in section 10.)
- Removing validation code that cannot execute.

**Out of scope**

- Weakening or deleting any check that reports a real fault.
- Changing what the authored rules require of a document's content.
- Repairing the packets these changes will newly surface or stop surfacing.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | A packet's verdict is identical under every supported engine selection | P0 |
| REQ-002 | The freshness rule's applicability is decided in one place both engines read | P0 |
| REQ-003 | Validation output names which engine produced it | P1 |
| REQ-004 | The command-tree comparison runs as a repository check, not a per-packet rule | P0 |
| REQ-005 | A document that does not follow its template produces one finding, not two | P1 |
| REQ-006 | Code paths that cannot execute are removed rather than left in place | P2 |
| REQ-007 | No check that reports a real fault is weakened by any of the above | P0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A representative packet returns the same result and the same exit status under
  the default engine and under every environment switch that selects another.
- The freshness rule fires under exactly one documented condition, and the
  documentation matches the behaviour.
- No packet fails on a condition it cannot influence from inside itself.
- Every packet that stops failing is shown to have had a duplicate or
  unsatisfiable finding rather than a repaired one, and every packet that starts
  failing is shown to have a real fault a check was previously not making.

**Amendment.** This section originally required the strict failure rate to fall.
That was written before the two engines were compared, and it turned out to
prejudge the answer: the older engine was enforcing two real checks the default
engine had quietly stopped making, so honouring it meant the rate would rise.
The criterion now constrains the direction of each change rather than the total,
which is what the packet actually cares about. The rate did fall in the end, but
because the newly surfaced faults were repaired, not because the bar moved.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| Removing an engine changes verdicts somewhere unmeasured | Packets silently pass or fail differently | Compare both engines across a broad sample before and after; the change must move a verdict only where the two already disagreed |
| Collapsing two rules loses a distinction someone relies on | A real fault stops being reported | Both detail lists are kept in the single finding; only the count of findings changes |
| The command-tree check is lost in the move | Runtime mirrors drift unnoticed | It runs as its own repository check before the per-packet wiring is removed |
| Deleting unreachable code removes something reachable after all | A rule stops running | Each deletion is justified by showing the path cannot execute, not by its appearance |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Determinism.** The verdict depends on the packet and the flags, nothing else.
- **Legibility.** A reader can tell which engine answered and why a rule fired.
- **Proportion.** A fault is reported once.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A packet validated through the rule-subset path, which today forces the older
  engine and so a different verdict.
- A phase parent, where the two engines' notions of what counts as a child are
  defined by different patterns.
- A checkout with no compiled build, where engine selection falls back silently.
- A packet whose only failures are the duplicated pair, which should go from two
  findings to one rather than from two to none.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Assessment |
|-----------|------------|
| Surface | Two validators, one registry, a handful of rule scripts |
| Blast radius | Every completion claim in the repository depends on this verdict |
| Reversibility | Each change is separable and revertible on its own |
| Judgement required | High: deciding which of two disagreeing answers is correct |

Level 2 by size, but the blast radius is the whole gate, so each change lands
separately with its own before-and-after comparison rather than as one cutover.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

**Settled: the older engine is deleted.** The condition for deleting it was that
the surviving engine must first make every check the older one made. Comparing
the two across 150 packets found 48 disagreements in four classes. Two were real
checks only the older engine made, and both were added to the survivor before
anything was removed. One was a rule that labelled its own findings
non-blocking and then blocked on them, which the survivor was already right to
ignore. The last was a rule applicability question, now decided in one place.

The fresh-clone consequence is real and accepted: with neither a build nor the
TypeScript loader present, validation now stops with a system error telling the
reader to build, where before it silently fell back to the older engine and
answered with the rule set that turned out to disagree. A gate that says it
cannot run is better than one that quietly answers differently.

**Amendment — REQ-005 withdrawn.** REQ-005 required a document that does not
follow its template to produce one finding rather than two, on the premise that
the two rules always fired together. Measured across 220 packets, they do not: 4
packets fail the anchor rule alone. They report separable faults, so merging
them would hide one. The reader-facing half of the complaint — a finding whose
detail lines were invisible — was fixed instead: every finding now prints what
it actually found.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## 11. RELATED DOCS

- `plan.md` — sequence and rollback
- `tasks.md` — execution breakdown
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` — the shell engine
- `.opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts` — the default engine
- `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` — the rule inventory
<!-- /ANCHOR:related-docs -->
