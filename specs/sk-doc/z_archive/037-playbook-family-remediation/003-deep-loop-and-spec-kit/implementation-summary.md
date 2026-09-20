---
title: "Implementation Summary: deep-loop and spec-kit playbook remediation"
description: "Eight roots including the fleet's largest now report zero violations, two of the biggest counts proved single-cause, and four agents that died mid-run were relaunched without losing committed work."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "deep-loop and spec-kit playbook remediation implementation"
  - "runtime vocabulary transform summary"
  - "remediation agent relaunch record"
importance_tier: "high"
contextType: "implementation"
parent: "sk-doc/037-playbook-family-remediation"
_memory:
  continuity:
    packet_pointer: "sk-doc/037-playbook-family-remediation/003-deep-loop-and-spec-kit"
    last_updated_at: "2026-08-29T11:45:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped the deep-loop and spec-kit cleanup; eight roots verified at zero"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual-testing-playbook"
      - ".opencode/skills/system-deep-loop/runtime/manual-testing-playbook"
      - ".opencode/skills/sk-git/manual-testing-playbook"
      - ".opencode/skills/sk-doc/sk-create-diff/manual-testing-playbook"
    session_dedup:
      fingerprint: "sha256:da74ae385d3602258768b27bb1ab423e0eba2cf188ff9881f2c955ce3cbaeb38"
      session_id: "2026-08-29-sk-code-031-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: deep-loop and spec-kit playbook remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-deep-loop-and-spec-kit |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Completion** | 100% — eight roots at zero violations, including the fleet's largest at 422 scenarios |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Eight roots reached zero operator-scenario contract violations, and two of the largest counts were shown to have one cause each rather than hundreds.

1. **`system-spec-kit`: 918 violations to zero.** The fleet's largest root. Final census `scenarios=422 categories=26 operator=402 routing_gold_excluded=20 violations=0 warnings=0`.

2. **`system-deep-loop/runtime`: 473 violations to zero, from one cause.** All 473 were a single uniform structural drift: 54 scenarios had been generated against an older section vocabulary that wrote `SOURCE_METADATA` with an underscore, so the required-section regex never matched any of them. One reviewed transform cleared 472 of the 473; the remaining case was handled by hand. Final census `scenarios=54 categories=12 violations=0`.

3. **`sk-git`: 89 violations to zero, 82 of them one line.** A single shared boilerplate line, repeated across the package, carried both a `PARTIAL` verdict that fail-closed tier forbids and a `SKIP` with no blocker recorded. Correcting the line once cleared 82 of the 89. Final census `scenarios=42 categories=8 violations=0 warnings=0`.

4. **A `sk-git` table that had been passing by luck.** The same package surfaced a scenario table with a stray `||` that broke column alignment, so the grader read command text out of the Evidence column. Its prior green result was produced by reading the wrong cell, not by correct content. The alignment was repaired.

5. **The four remaining deep-loop roots cleared.** `deep-review` from 173, now `scenarios=55 categories=10`; `deep-research` from 165, now 62 across 9; `deep-improvement` from 123, now 60 across 11; the `system-deep-loop` parent from 79, now 20 across 6 with `operator=14` and `routing_gold_excluded=6`. `sk-doc/sk-create-diff` went from 1 to zero and now reports 11 across 3.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The useful discipline in this phase was reading the shape of a count before working it. Four hundred and seventy-three violations across 54 scenarios reads as a backlog and is in fact one decision made once and generated 54 times. Eighty-nine violations across a package reads as an authoring problem and is in fact one boilerplate line. Both were repaired at the cause, and the count falling to zero afterwards is what confirms the cause was read correctly rather than merely plausible. The `runtime` transform was reviewed rather than trusted, and the one case out of 473 it did not cover was handled explicitly instead of being forced into the same shape — a transform that clears every instance is more suspicious than one that leaves a residue and says so.

The `sk-git` table is the finding worth carrying forward. A stray `||` shifted its columns, so the grader was reading command text where it expected evidence, and the table graded green on that misread. A passing result produced by reading the wrong cell is not a weaker pass; it is not a pass at all, and there is no way to tell the two apart from the exit code. That is the same class of blindness the whole packet exists to close.

This phase also lost four agents mid-run. An organisation-side API block returned `oauth_org_not_allowed`, with subscription access disabled for `claude-sonnet-5`, and terminated them where they stood. Work already written to disk survived the terminations, so nothing had to be redone; the agents were relaunched on the inherited model and completed their roots. The progress banked before the failures was `system-spec-kit` from 918 down to 514, `deep-improvement` from 123 down to 9, and `deep-research` from 19 down to 0.

Every count in this record is the coordinator's own re-measurement with `--package <root> --strict`, not a figure reported by the agents that did the work — which matters more here than elsewhere, because half of these roots were finished by a second agent that did not start them.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Classify each large count before editing anything | Two of the four largest counts in this phase reduce to one decision each. Treating 473 violations as 473 problems would have produced 54 hand edits and no understanding of why they were all wrong the same way. |
| Review the `runtime` transform rather than trust its result | A bulk rewrite across 54 scenario files can satisfy the grader and damage the scenarios. Reviewing it, and handling the one residual case by hand, is what separates a transform that fixed the vocabulary from one that merely silenced the check. |
| Repair the misaligned `sk-git` table instead of accepting its passing result | It was green because the grader read command text as Evidence. A pass obtained by misreading proves nothing about the content, and leaving it would have preserved exactly the blindness this packet is closing. |
| Record the agent terminations rather than only the completions | Four agents died mid-run on an organisation-side block. What survived, what was banked, and what had to be relaunched is the part a later reader needs; a record of only the successful relaunch teaches nothing about the failure mode. |
| Keep the routing-gold exclusions frozen | `system-spec-kit`'s 20 excluded scenarios and the deep-loop parent's 6 are registered exclusions. Changing them would move violations out of the contract instead of clearing them, and the unchanged counts are the control that proves it did not happen. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `system-spec-kit` | PASS — `scenarios=422 categories=26 operator=402 routing_gold_excluded=20 violations=0 warnings=0` |
| `system-deep-loop/runtime` | PASS — `scenarios=54 categories=12 operator=54 routing_gold_excluded=0 violations=0` |
| `system-deep-loop/deep-review` | PASS — `scenarios=55 categories=10 operator=55 violations=0` |
| `system-deep-loop/deep-research` | PASS — `scenarios=62 categories=9 operator=62 violations=0` |
| `system-deep-loop/deep-improvement` | PASS — `scenarios=60 categories=11 operator=60 violations=0 warnings=0` |
| `system-deep-loop` parent | PASS — `scenarios=20 categories=6 operator=14 routing_gold_excluded=6 violations=0 warnings=0` |
| `sk-git` | PASS — `scenarios=42 categories=8 operator=42 violations=0 warnings=0` |
| `sk-doc/sk-create-diff` | PASS — `scenarios=11 categories=3 operator=11 violations=0` |
| Stale section vocabulary gone | PASS — a recursive search for the underscored `SOURCE_METADATA` token across `system-deep-loop/runtime/manual-testing-playbook/` returns 0 files |
| Routing-gold exclusions unchanged | PASS — `system-spec-kit` at 20 and the deep-loop parent at 6, the same values recorded before the work |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The phase headline and the per-root figures do not agree.** The recorded headline for this phase is 1,352 violations; the per-root starting counts recorded alongside it sum to 2,021. The source does not say which census each came from, and neither can be re-derived now that every root is at zero. The discrepancy is UNKNOWN and left standing rather than resolved by preferring one number.
2. **The banked-progress figures are a mid-run census, not a starting one.** `deep-research` is recorded as banked from 19 to 0 while its starting count for this phase is 165, so the banked figures were taken at a later point in the run than the starting counts. How the two censuses relate is not recorded.
3. **Zero violations is not zero warnings.** `deep-research`, `deep-review`, `runtime`, and `sk-doc/sk-create-diff` still report advisory warnings in the final census. The contract does not block on warnings and none was cleared to reach the result claimed here.
<!-- /ANCHOR:limitations -->
