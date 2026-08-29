---
title: "Spec: Surface Playbook Expansion"
description: "Give the two sk-code SURFACE playbooks the coverage breadth of the sk-doc corpus without leaving the operator-scenario contract they already passed."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "surface playbook expansion"
  - "sk-code surface playbook coverage"
  - "operator-scenario playbook categories"
  - "playbook category taxonomy alignment"
importance_tier: "high"
contextType: "spec"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/028-surface-playbook-expansion"
    last_updated_at: "2026-08-29T10:24:54Z"
    last_updated_by: "claude"
    recent_action: "Expanded both surface playbooks to 7 category dirs; both validate PASS/FAIL_CLOSED"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook"
      - ".opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook"
    session_dedup:
      fingerprint: "sha256:889d928fa11f07a471a646082a4ce2cc68b30f5486ae4a14f8da67d95089f7cf"
      session_id: "2026-08-29-sk-code-028"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Surface Playbook Expansion

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-surface-playbook-expansion |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Predecessor** | None |
| **Successor** | None |
| **Priority** | P2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The two sk-code SURFACE playbooks — `sk-code-mobile-cli` and `sk-code-obsidian` — began with 7 flat, intent-detection-only scenarios each. The sk-doc smart-router playbook, the closest sibling for coverage breadth, spans 8 categories and 32 scenarios: intent detection plus resource loading, unknown fallback, cross-CLI dispatch, token-cost baselines, holdout generalization, agent dispatch, and surface detection. That breadth gap meant both surface playbooks exercised intent classification but left the rest of each package's routing surface — resource loading, fallback behavior, dispatch stability, token cost, generalization, surface resolution — unchecked.

"Align with sk-doc" was the obvious framing, but it was deliberately not taken literally. sk-doc's own playbook is registered in `playbook-corpus-manifest.json` under `routingGoldRoots`: all 32 of its scenarios are classified routing-gold and excluded from the operator-scenario contract, running at tier WARN under a four-way `PASS`/`PARTIAL`/`FAIL`/`SKIP` verdict set. Both sk-code surface playbooks are operator-scenario, tier `FAIL_CLOSED`, `PASS`/`FAIL`/`SKIP` only, and had already passed under that contract. Copying sk-doc's grading scheme wholesale would have imported a verdict vocabulary the validator forbids for a fail-closed package and dropped both surface playbooks out of fail-closed enforcement — exactly the failure mode independently confirmed in the sibling `sk-code-review` package, which had previously been aligned that way and carried 24 `FORBIDDEN_VERDICT` violations out of 129 total.

The purpose was to take sk-doc's category taxonomy and index completeness — the breadth — without taking its verdict scheme, so both surface playbooks gained the same coverage shape while staying inside the `PASS`/`FAIL`/`SKIP` contract they already satisfied.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: `sk-code-mobile-cli/manual-testing-playbook/` and `sk-code-obsidian/manual-testing-playbook/` — expanding each from 7 flat scenarios into 7 category directories (intent-detection, resource-loading, unknown-fallback, cross-cli-dispatch, token-cost-baseline, holdout, surface-detection), with the `agent-dispatch` category explicitly waived and documented in-file in both packages, while keeping the `PASS`/`FAIL`/`SKIP` operator-scenario verdict set both packages already used.

Out of scope: adopting sk-doc's `PASS`/`PARTIAL`/`FAIL`/`SKIP` verdict scheme or its `routingGoldRoots` exemption for either surface playbook; any other sk-code package's playbook (`sk-code-opencode`, `sk-code-quality`, `sk-code-review`, `sk-code-webflow`); fixing the pre-existing `sk-code-opencode` `JAVASCRIPT`-intent scenario gap noticed while scoping this work, which is recorded as a known limitation, not remediated here.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P1]** `sk-code-mobile-cli`'s playbook expands from 7 flat scenarios to 7 category directories, keeping `PASS`/`FAIL`/`SKIP` as the only verdicts.
- **REQ-002 [P1]** `sk-code-obsidian`'s playbook expands from 7 flat scenarios to the same 7 category directories, keeping `PASS`/`FAIL`/`SKIP` as the only verdicts.
- **REQ-003 [P1]** Neither package adopts sk-doc's `PARTIAL`/`READY`/`UNAUTOMATABLE`/`BLOCKED` forbidden-verdict vocabulary or its `routingGoldRoots` tier-WARN exemption; both remain tier `FAIL_CLOSED`.
- **REQ-004 [P2]** The `agent-dispatch` category is waived in both packages, with an in-file reason grounded in each package's own `routingClass: metadata`, read-only, never-routes-as-primary status — not a shared boilerplate note.
- **REQ-005 [P3]** Every `expected_resources` path added across both expansions resolves on the shipped filesystem tree.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** `validate-playbook-package.cjs --package sk-code/sk-code-mobile-cli --strict` reports `PASS`, `tier=FAIL_CLOSED`, `scenarios=26`, `categories=7`, `violations=0`, `exit=0`.
- **SC-002** `validate-playbook-package.cjs --package sk-code/sk-code-obsidian --strict` reports `PASS`, `tier=FAIL_CLOSED`, `scenarios=27`, `categories=7`, `violations=0`, `exit=0`.
- **SC-003** Every `expected_resources` path across both packages' scenario frontmatter resolves on disk: 137 paths for `sk-code-mobile-cli`, 92 for `sk-code-obsidian`, 0 missing in either.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Importing a forbidden verdict scheme.** Mitigated by treating sk-doc's `routingGoldRoots` registration as the reason its four-way grading is even legal there, and by grounding the decision to reject it in the sibling `sk-code-review` package's own history: a real, independently measured 24/129 `FORBIDDEN_VERDICT` count from when that package had been literally aligned with sk-doc.
- **Faked or boilerplate waivers.** Mitigated by grounding each package's `agent-dispatch` waiver in its own `routingClass: metadata` declaration and its own real execution surface living in a separate repository, rather than a single copy-pasted waiver note across both.
- **Conflating a pre-existing, unrelated gap with this fix.** `sk-code-opencode`'s `JAVASCRIPT`-intent scenario gap surfaced while scoping this work but belongs to a package outside this packet's two named targets; recorded as a known limitation rather than folded into this packet's completion claim.
- **Dependencies.** `playbook-corpus-manifest.json` (`routingGoldRoots`/`warnPackages`) and `validate-playbook-package.cjs` as the operator-scenario contract authority. No new packages or network access.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. Whether to copy sk-doc's contract literally was resolved against the sk-code-review precedent and the manifest's own `routingGoldRoots` distinction, not assumed.

<!-- /ANCHOR:questions -->
