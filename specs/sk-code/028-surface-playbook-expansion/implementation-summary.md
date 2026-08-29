---
title: "Implementation Summary: Surface Playbook Expansion"
description: "Both sk-code surface playbooks now carry sk-doc's category breadth at PASS/FAIL_CLOSED/0 violations, with agent-dispatch waived per package and the four-way sk-doc verdict scheme deliberately rejected."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "surface playbook expansion implementation"
  - "playbook category taxonomy summary"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/028-surface-playbook-expansion"
    last_updated_at: "2026-08-29T10:24:54Z"
    last_updated_by: "claude"
    recent_action: "Shipped both expansions; verified 0 violations and 0 missing expected_resources"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook"
      - ".opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook"
    session_dedup:
      fingerprint: "sha256:c82ffd04077368bef03ef66d89b87477117af25feb16d664298dfc18422f0797"
      session_id: "2026-08-29-sk-code-028"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Surface Playbook Expansion

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-surface-playbook-expansion |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Completion** | 100% — both surface playbooks expanded to sk-doc's category breadth, verified PASS/FAIL_CLOSED/0 violations |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both sk-code SURFACE playbooks went from 7 flat, intent-detection-only scenarios to sk-doc's category breadth, without leaving the operator-scenario contract either had already passed.

1. **`sk-code-mobile-cli`: 7 flat scenarios -> 26 across 7 category directories.** `intent-detection` (the original 7), plus `resource-loading`, `unknown-fallback`, `cross-cli-dispatch`, `token-cost-baseline`, `holdout`, and `surface-detection`. Validates `PASS`/`tier=FAIL_CLOSED`/`0 violations`/`exit=0`, with 137 `expected_resources` paths checked and 0 missing.

2. **`sk-code-obsidian`: 7 flat scenarios -> 27 across the same 7 category directories.** Validates `PASS`/`tier=FAIL_CLOSED`/`0 violations`/`exit=0`, with 92 `expected_resources` paths checked and 0 missing.

3. **`agent-dispatch` waived in both, not shared.** Each package's waiver is grounded in its own `routingClass: metadata` declaration and the location of its real execution surface outside this repository — `sk-code-mobile-cli` names the Pi Remote app repository; `sk-code-obsidian` names the Obsidian plugin repository — rather than a single copy-pasted note.

4. **sk-doc's four-way verdict scheme was not imported.** Both packages remain `PASS`/`FAIL`/`SKIP` only; neither was added to `playbook-corpus-manifest.json`'s `routingGoldRoots` list.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read `playbook-corpus-manifest.json` before assuming "align with sk-doc" meant copying sk-doc's contract. It does not: sk-doc is a `routingGoldRoots` entry, and its playbook's `--no-strict` run confirms the shape that entry buys it — `SKIP tier=WARN scenarios=32 categories=8 operator=0 routing_gold_excluded=32`, meaning all 32 scenarios are exempted from fail-closed enforcement and run a four-way `PASS`/`PARTIAL`/`FAIL`/`SKIP` grading. Neither `sk-code-mobile-cli` nor `sk-code-obsidian` is a member of that list, and both were already operator-scenario, tier `FAIL_CLOSED`, `PASS`/`FAIL`/`SKIP` only, and passing. Importing sk-doc's grading scheme would have meant either violating the validator's `FORBIDDEN_VERDICT` rule (`PARTIAL`, `READY`, `UNAUTOMATABLE`, `BLOCKED` are all rejected outside a routing-gold root) or adding both packages to `routingGoldRoots`, which would have pulled them out of fail-closed enforcement entirely. The sibling `sk-code-review` package supplied the concrete cautionary evidence for this call: it had previously been aligned with sk-doc's scheme literally, and independently carried 24 `FORBIDDEN_VERDICT` violations out of 129 total under `--package --strict`. Given that precedent, the packet adopted sk-doc's category taxonomy and index completeness — the coverage breadth — while keeping each surface playbook's own, already-passing verdict contract untouched.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Adopt sk-doc's category taxonomy and index completeness, but not its four-way verdict scheme | sk-doc's playbook is a `routingGoldRoots` entry — all 32 scenarios are classified routing-gold and excluded from the operator-scenario contract (`SKIP`/`tier=WARN`). Both sk-code surface playbooks are operator-scenario, tier `FAIL_CLOSED`, and had already passed; importing sk-doc's `PASS`/`PARTIAL`/`FAIL`/`SKIP` grading would use verdicts the validator's `FORBIDDEN_VERDICT` rule forbids outside a routing-gold root, and would drop both packages out of fail-closed enforcement if added to that list instead. |
| Ground the ruling in the `sk-code-review` precedent rather than assume | `sk-code-review` had previously been aligned with sk-doc's four-way scheme and independently carried 24 `FORBIDDEN_VERDICT` violations out of 129 total under `--package --strict` — direct, measured evidence of the failure mode this packet avoided, not a hypothetical risk. |
| Waive `agent-dispatch` per package with a routingClass-grounded reason, not a shared note | Both packages are `routingClass: metadata`, read-only, and never route as a primary; their real, evidenced execution surfaces live in other repositories (the Pi Remote app repo for `sk-code-mobile-cli`, the Obsidian plugin repo for `sk-code-obsidian`), so no scenario authored inside either playbook can dispatch real work — and the two reasons are not interchangeable. |
| Leave `sk-code-opencode`'s `JAVASCRIPT`-intent gap as a recorded limitation | Out of this packet's scope, which named exactly two surface playbooks. Recording the gap keeps it visible without conflating an unrelated, pre-existing finding with this packet's own completion claim. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| sk-doc `routingGoldRoots` shape confirmed | PASS — `validate-playbook-package.cjs --package sk-doc --no-strict` → `SKIP tier=WARN scenarios=32 categories=8 operator=0 routing_gold_excluded=32` |
| `sk-code-mobile-cli` validate | PASS — `--package sk-code/sk-code-mobile-cli --strict` → `PASS tier=FAIL_CLOSED scenarios=26 categories=7 violations=0 warnings=0 exit=0` |
| `sk-code-obsidian` validate | PASS — `--package sk-code/sk-code-obsidian --strict` → `PASS tier=FAIL_CLOSED scenarios=27 categories=7 violations=0 warnings=0 exit=0` |
| `expected_resources` path coverage | PASS — 137 paths checked for `sk-code-mobile-cli` (0 missing), 92 for `sk-code-obsidian` (0 missing) |
| Forbidden-verdict vocabulary absent | PASS — both `--strict` runs report `violations=0`; neither package uses `PARTIAL`/`READY`/`UNAUTOMATABLE`/`BLOCKED` |
| `agent-dispatch` waiver documented per package | PASS — both packages' Category 6 note is grounded in that package's own `routingClass: metadata` status and its own real execution surface |
| Precedent evidence checked, not assumed | PASS — `sk-code-review`'s prior literal alignment: 24 `FORBIDDEN_VERDICT` violations out of 129 total |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`sk-code-opencode` has an unrelated, pre-existing scenario gap.** Its `SKILL.md` declares 10 intents including `JAVASCRIPT`; its playbook covers 9, with no `JAVASCRIPT`-specific scenario. Noticed while scoping this packet, but out of its two-package scope — recorded here as a known limitation, not fixed.
2. **Category counts differ between the two packages (26 vs. 27) by design, not defect.** Each package's own intent set and `RESOURCE_MAP` differ, so the exact scenario count per category reflects each surface's own authoring, not a shared template stamped twice.
<!-- /ANCHOR:limitations -->
