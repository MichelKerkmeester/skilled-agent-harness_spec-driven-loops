---
title: "Spec: deep-loop and spec-kit playbook remediation"
description: "Eight roots including the fleet's largest, where two of the biggest counts turned out to be single-cause defects and four remediation agents died mid-run on an organisation-side API block."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "deep-loop and spec-kit playbook remediation"
  - "runtime section vocabulary drift"
  - "sk-git shared boilerplate verdict"
  - "system-spec-kit playbook largest root"
importance_tier: "high"
contextType: "spec"
parent: "sk-doc/037-playbook-family-remediation"
_memory:
  continuity:
    packet_pointer: "sk-doc/037-playbook-family-remediation/003-deep-loop-and-spec-kit"
    last_updated_at: "2026-08-29T11:45:00Z"
    last_updated_by: "claude"
    recent_action: "Cleared eight deep-loop and spec-kit roots to zero across two agent relaunches"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual-testing-playbook"
      - ".opencode/skills/system-deep-loop/runtime/manual-testing-playbook"
      - ".opencode/skills/sk-git/manual-testing-playbook"
    session_dedup:
      fingerprint: "sha256:84347cd0e2cb5bc9230d60423d1c3a372aed1bf594d6479e6d26c6ca9b1cfe1b"
      session_id: "2026-08-29-sk-code-031-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: deep-loop and spec-kit playbook remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-deep-loop-and-spec-kit |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-doc/037-playbook-family-remediation` |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Predecessor** | `002-cli-and-mcp-transports` |
| **Successor** | `004-fail-closed-graduation` |
| **Priority** | P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

This phase covers eight roots: `system-spec-kit` at 918 violations, `system-deep-loop/runtime` at 473, `deep-review` at 173, `deep-research` at 165, `deep-improvement` at 123, the `system-deep-loop` parent at 79, `sk-git` at 89, and `sk-doc/sk-create-diff` at 1. `system-spec-kit` is the largest single playbook root in the fleet at 422 scenarios across 26 categories, twenty of which are routing-gold excluded.

Two of those counts had a single cause each, and finding the cause was worth more than clearing the count. `system-deep-loop/runtime`'s 473 violations were one uniform structural drift: 54 scenarios had been generated against an older section vocabulary that wrote `SOURCE_METADATA` with an underscore, which is why the required-section regex never matched any of them. One reviewed transform cleared 472 of the 473. `sk-git`'s 89 were 82 instances of a single shared boilerplate line that carried both a `PARTIAL` verdict — forbidden at fail-closed tier — and a `SKIP` with no blocker recorded. The same package also surfaced a scenario table whose stray `||` broke column alignment, so the grader read command text out of the Evidence column. That table had been passing on luck, not on correctness, which is the more useful finding of the two.

The purpose of this phase is to take all eight roots to zero, and to record for each large count whether it was many defects or one, because those two shapes call for opposite kinds of work.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: the eight roots named above, each remediated to zero violations and verified with its own `--package <root> --strict` run; and the root-cause classification of the two largest single-cause counts.

Out of scope: the twenty routing-gold-excluded scenarios inside `system-spec-kit` and the six inside the `system-deep-loop` parent, all of which stay excluded by registration; the grader and template defects owned by `038-authoring-hardening`; and the fail-closed graduation of these roots, which is `004-fail-closed-graduation`.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P1]** Each of the eight roots reports `violations=0` under its own `--package <root> --strict` run, including `system-spec-kit` at its full 422-scenario size.
- **REQ-002 [P1]** `system-deep-loop/runtime`'s stale section vocabulary is corrected at the vocabulary level rather than scenario by scenario, and the residual case the transform did not cover is handled explicitly.
- **REQ-003 [P1]** `sk-git`'s shared boilerplate line is corrected once at its source rather than 82 times, and the resulting package uses no forbidden verdict and records a blocker for every `SKIP`.
- **REQ-004 [P1]** The misaligned `sk-git` scenario table is repaired so the Evidence column holds evidence, not command text read out of a neighbouring cell.
- **REQ-005 [P2]** The routing-gold exclusions inside `system-spec-kit` and the `system-deep-loop` parent are unchanged by the remediation, so no violation left scope instead of being cleared.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** `system-spec-kit` reports `PASS`, `tier=FAIL_CLOSED`, `scenarios=422`, `categories=26`, `operator=402`, `routing_gold_excluded=20`, `violations=0`, `warnings=0`.
- **SC-002** The five deep-loop roots report `PASS` with `violations=0`: `system-deep-loop/deep-research` at 62 scenarios across 9 categories, `deep-improvement` at 60 across 11, `deep-review` at 55 across 10, `runtime` at 54 across 12, and the `system-deep-loop` parent at 20 across 6 with `operator=14` and `routing_gold_excluded=6`.
- **SC-003** `sk-git` reports `PASS` at 42 scenarios across 8 categories with `violations=0 warnings=0`, and `sk-doc/sk-create-diff` reports `PASS` at 11 across 3 with `violations=0`.
- **SC-004** The stale section vocabulary is gone from the shipped tree: a recursive search for the underscored `SOURCE_METADATA` token across `system-deep-loop/runtime/manual-testing-playbook/` returns no files.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Treating a single-cause count as many defects.** 473 violations across 54 scenarios and 89 across 82 lines both look like backlogs and are both one decision. Mitigated by reading the violation classes before editing, which is what turned 473 into one reviewed transform.
- **A transform that clears the count without being read.** A bulk rewrite over 54 scenario files can pass the grader and damage the scenarios. Mitigated by reviewing the transform rather than trusting its output, and by handling the one case out of 473 it did not cover explicitly rather than forcing it.
- **Losing work when an agent dies mid-run.** This risk was realised: four remediation agents were terminated mid-run by an organisation-side API block. Mitigated in practice because work already written to disk survived the termination, and the agents were relaunched on the inherited model and completed.
- **A table that passes by luck.** The `sk-git` scenario table with the stray `||` was graded green while the grader was reading the wrong column. Mitigated by repairing the alignment rather than accepting the passing result it produced.
- **Dependencies.** `validate-playbook-package.cjs` and `playbook-corpus-manifest.json`. No new packages or network access.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The phase headline recorded for this work is 1,352 violations, but the per-root figures recorded in the same source sum to 2,021. The source does not say which census each number came from, and no phase can re-derive either now that all eight roots are at zero. The relationship between the two figures is UNKNOWN and is left unreconciled here rather than resolved by choosing the more convenient one. Both are recorded; the ending figures are re-measurements and do reconcile.

<!-- /ANCHOR:questions -->
