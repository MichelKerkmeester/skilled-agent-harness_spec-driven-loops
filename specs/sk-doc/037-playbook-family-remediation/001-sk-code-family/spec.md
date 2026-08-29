---
title: "Spec: sk-code family playbook remediation"
description: "Five dirty roots in the sk-code family carried 586 operator-scenario violations, the largest single class being a grading vocabulary the validator forbids that a prior literal alignment to sk-doc had imported."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "sk-code family playbook remediation"
  - "sk-code review forbidden verdict"
  - "sk-code hub routing gold exclusion"
  - "sk-code playbook violations to zero"
importance_tier: "high"
contextType: "spec"
parent: "sk-doc/037-playbook-family-remediation"
_memory:
  continuity:
    packet_pointer: "sk-doc/037-playbook-family-remediation/001-sk-code-family"
    last_updated_at: "2026-08-29T11:45:00Z"
    last_updated_by: "claude"
    recent_action: "Took the five dirty sk-code roots from 586 violations to zero"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/manual-testing-playbook"
      - ".opencode/skills/sk-code/sk-code-review/manual-testing-playbook"
      - ".opencode/skills/sk-code/sk-code-webflow/manual-testing-playbook"
      - ".opencode/skills/sk-code/sk-code-opencode/manual-testing-playbook"
      - ".opencode/skills/sk-code/sk-code-quality/manual-testing-playbook"
    session_dedup:
      fingerprint: "sha256:d524e378211af1091bdfc64f3ae55e6a2ee0b41891fa80f58b1c0aad49da1e5d"
      session_id: "2026-08-29-sk-code-031-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: sk-code family playbook remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-sk-code-family |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-doc/037-playbook-family-remediation` |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Predecessor** | None |
| **Successor** | `002-cli-and-mcp-transports` |
| **Priority** | P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The sk-code family is seven playbook roots: the hub itself and six mode packets. Five of them were dirty, carrying 586 operator-scenario contract violations between them — the hub at 181, `sk-code-review` at 129, `sk-code-webflow` at 156, `sk-code-opencode` at 108, and `sk-code-quality` at 12. The remaining two, `sk-code-mobile-cli` and `sk-code-obsidian`, were already at zero and are not this phase's subject; they were expanded for coverage breadth instead, which is the work recorded in `034-surface-playbook-expansion`.

The interesting number is `sk-code-review`'s. Its largest single violation class was 24 instances of `FORBIDDEN_VERDICT`, and those were not authoring slips. A prior effort had aligned that package literally to sk-doc's playbook, and sk-doc grades on a four-way `PASS`/`PARTIAL`/`FAIL`/`SKIP` scheme. sk-doc is allowed that scheme because it is registered in the corpus manifest's `routingGoldRoots` list, which exempts all of its scenarios from the operator-scenario contract and runs them at tier WARN. `sk-code-review` is not a member of that list. Copying the grading vocabulary without copying the registration that makes it legal is how a package ends up using verdicts its own tier forbids — the defect was imported by an alignment that read the surface of a sibling and not the manifest entry underneath it.

The purpose of this phase is to take all five dirty roots to zero under their own `--package` runs, without changing which contract governs any of them and without moving any root into or out of the routing-gold list to make a count fall.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: the five dirty sk-code playbook roots — the `sk-code` hub, `sk-code-review`, `sk-code-webflow`, `sk-code-opencode`, and `sk-code-quality` — remediated to zero violations each, verified by a per-root `--package <root> --strict` run rather than by a fleet roll-up.

Out of scope: `sk-code-mobile-cli` and `sk-code-obsidian`, both already at zero when this phase began and both handled as a coverage expansion in `034-surface-playbook-expansion`; the hub's `compiled-routing/` subfolder, which is a registered routing-gold exclusion and stays excluded; adding any root to `routingGoldRoots` or to the manifest's `warnPackages` list, since lowering the bar is not remediation; and the validator's own defects, which belong to `038-authoring-hardening`.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P1]** Each of the five dirty roots reports `violations=0` under its own `validate-playbook-package.cjs --package <root> --strict` run, measured after remediation rather than reported by the agent that did the work.
- **REQ-002 [P1]** `sk-code-review`'s forbidden grading vocabulary is removed rather than legalised: the package keeps the `PASS`/`FAIL`/`SKIP` verdict set its `FAIL_CLOSED` tier requires, and is not added to `routingGoldRoots`.
- **REQ-003 [P1]** The `sk-code` hub's `compiled-routing/` subfolder remains routing-gold-excluded throughout, so its exclusion count is unchanged by the remediation.
- **REQ-004 [P2]** The two already-clean roots, `sk-code-mobile-cli` and `sk-code-obsidian`, still report zero violations after this phase, confirming the family-wide work did not regress them.
- **REQ-005 [P2]** No root is moved into `warnPackages` to suppress a count it could not clear.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** All seven sk-code family roots report `PASS`, `tier=FAIL_CLOSED`, `violations=0` in the fleet census: hub at 32 scenarios across 11 categories, `sk-code-review` at 31 across 9, `sk-code-webflow` at 13 across 4, `sk-code-opencode` at 9 across 3, `sk-code-quality` at 1 across 1, `sk-code-mobile-cli` at 26 across 7, and `sk-code-obsidian` at 27 across 7.
- **SC-002** The hub census still reports exactly one routing-gold-excluded file, `routing_gold_excluded=1`, against 31 operator scenarios — the `compiled-routing/` exclusion is intact and was not used to hide any of the hub's 181 violations.
- **SC-003** No sk-code root appears in the manifest's `warnPackages` list, so every one of them is graded at blocking tier.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Clearing a count by reclassification rather than by repair.** The cheapest way to make 129 violations disappear is to register the package as routing-gold or warn-listed. Mitigated by holding the tier fixed: every root ends at `tier=FAIL_CLOSED` with `routing_gold_excluded=0`, except the hub, whose single exclusion predates this phase and is unchanged.
- **Repeating the alignment that caused the defect.** `sk-code-review`'s 24 `FORBIDDEN_VERDICT` violations came from copying a sibling's grading scheme without its manifest registration. Mitigated by reading the manifest entry, not the sibling document, as the authority for which verdicts a package may use.
- **Trusting the agent that did the work.** Mitigated by re-running `--package <root> --strict` per root after remediation and reading the census line, rather than accepting a completion claim.
- **Dependencies.** `validate-playbook-package.cjs` and `playbook-corpus-manifest.json` as the contract authority. No new packages or network access.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. Whether `sk-code-review` should keep the four-way grading was settled against the manifest's `routingGoldRoots` membership rather than against the sibling package that supplied the vocabulary.

<!-- /ANCHOR:questions -->
