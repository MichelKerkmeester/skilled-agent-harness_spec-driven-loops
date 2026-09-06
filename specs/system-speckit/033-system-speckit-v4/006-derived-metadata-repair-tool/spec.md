---
title: "Feature Specification: Automated Repair of Derived Packet Failures"
description: "Repair the spec-packet validation failures that are recomputable from repository state, and refuse the ones that record work a person did."
trigger_phrases:
  - "derived metadata repair tool"
  - "derived repair automation"
  - "derived repair"
  - "repair-derived"
  - "spec packet autofix"
  - "packet validation repair"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/006-derived-metadata-repair-tool"
    last_updated_at: "2026-08-29T05:52:27Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the specification for repairing derivable packet failures"
    next_safe_action: "Harden the repair tool and add its fixture tests"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/repair-derived.cjs"
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-authoring"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Feature Specification: Automated Repair of Derived Packet Failures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-28 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 6 of 24 |
| **Predecessor** | `../005-skills-runtime-state-consolidation/spec.md` |
| **Successor** | `../007-completion-gate-coherence/spec.md` |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

A remediation pass repaired 517 packets by hand. Packets carrying at least one
error fell from 796 to 621 as measured on CI, and five rules reached zero across
the fleet. Almost none of that needed judgement. It was recomputation: reading
where a packet sits, what level it declares, and whether its generated metadata
still matches the documents it summarises, then writing those facts back.

Doing that by hand is expensive, slow, and gets worse every time a packet is
renumbered or a directory is renamed. The same drift will reappear.

The pass also established a boundary that any automation has to respect.
Failures divide in two, and only one half can be repaired by a machine.

**Derived** — the repository already knows the answer and the document records
it wrongly. The recorded location after a packet moves, the declared level when
the generator omitted it, the fingerprint over source documents after any edit.

**Authored** — a record of something a person did: evidence for a completed
item, a verification result, a decision and its consequences, a handover's
account of where the work stands. Nothing in the repository can supply these.

A tool that filled in the second kind would turn a red gate green by making
packets assert things nobody established. Roughly 139 packets and 1,100
rule-hits remain deliberately failing for that reason, and they should stay
failing until someone with the knowledge writes them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- A repair tool that settles derived failures only, recomputing every value from
  repository state.
- Re-derivation of a packet's graph metadata whenever the repair edits one of
  its documents, in the same pass.
- Fixture-backed tests proving the derived classes are repaired and the authored
  classes are left untouched.
- An audit of the generators that produce derived fields, for the defect class
  already found in one of them.
- Check-only wiring into an existing workflow, and documentation of the
  boundary.

**Out of scope**

- Writing evidence, verification results, decision records, checklist ticks,
  continuity prose, or any other authored content.
- Changing validation rules or their severities to make packets pass.
- Repairing archived or scratch trees, which are frozen copies.
- Automatic application of repairs during a CI run.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | Repair only failures whose correct value is computable from repository state | P0 |
| REQ-002 | Refuse every other failure and report it grouped by rule | P0 |
| REQ-003 | Report without writing unless application is requested explicitly | P0 |
| REQ-004 | Re-derive a packet's graph metadata in the same pass as any document edit | P0 |
| REQ-005 | Produce no change on a second run over the same packet | P1 |
| REQ-006 | Accept a single packet or a root, and refuse paths outside the specs tree | P1 |
| REQ-007 | Skip archived and scratch trees | P1 |
| REQ-008 | Read both validator report shapes | P1 |
| REQ-009 | Run in the existing workflow in reporting mode only | P1 |
| REQ-010 | State the derived and authored boundary in its own documentation | P2 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A dry run across the specs tree reports no repairable derived failures.
- Every failure that remains belongs to an authored rule, and the tool names
  which and how many.
- A packet broken in each derived way is restored to its previous content, and
  the restoration is checked against the committed version rather than asserted.
- A second run over a repaired packet changes nothing.
- The workflow runs the tool in reporting mode and never applies a repair.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| The boundary erodes and authored content gets generated | Packets assert unestablished facts | Repairable rules are an explicit allow-list; anything absent is reported, never written |
| A repair edits a document and leaves the fingerprint stale | One error is traded for another | Re-derivation is part of the repair, not a follow-up |
| An unscoped run rewrites the whole fleet at once | Large diff, hard to review | Reporting is the default and scoping is available; application is deliberate |
| A recomputed value is wrong for an unusual packet | Correct content overwritten | Values come from disk and the validator's own detection; a second run must be a no-op |
| CI applies repairs and hides drift | Failures never surface | The workflow runs in reporting mode only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Idempotence.** Repeated runs converge; the second changes nothing.
- **Containment.** Writes stay inside the packet being repaired.
- **Legibility.** Output names each packet, each change, and the rules it
  declined, so a reader can tell repair from refusal.
- **Independence.** No network access and no service dependency; the tool reads
  the working tree and the validator.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A packet whose declared level is not numeric. Both are valid and the value is
  recorded as the validator reports it.
- A packet whose validator output cannot be parsed. Reported as unreadable; no
  repair attempted.
- A phase parent, which carries a reduced document set. Absent documents are
  skipped rather than treated as failures.
- A document with no recorded pointer at all. Nothing to correct, so nothing is
  written; the absence is an authored gap.
- A packet already correct. No edit, and therefore no re-derivation.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Assessment |
|-----------|------------|
| Surface | One script, one workflow step, one test file, one readme |
| Blast radius | Writes confined to the packet being repaired; reporting is the default |
| Reversibility | Additive; a fleet application lands as its own revertible commit |
| Judgement required | None at run time; the repairable set is fixed by an allow-list |

Level 2 fits: the change is bounded and mechanical, but it writes to many
packets at once, so it earns tests and a documented boundary rather than the
lighter treatment a single-file change would get.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. The boundary between derived and authored is settled by this
specification, and the repairable set is enumerated in the requirements.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## 11. RELATED DOCS

- `plan.md` — approach, phases, and rollback
- `tasks.md` — execution breakdown
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` — the rules this repairs against
- `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` — the precedent for repairing generated files while leaving authored ones alone
<!-- /ANCHOR:related-docs -->
