---
title: "Plan: Surface Playbook Expansion"
description: "Adopt sk-doc's category taxonomy and index completeness for both sk-code surface playbooks while deliberately rejecting its four-way verdict scheme, grounded in the sk-code-review precedent."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "surface playbook expansion plan"
  - "playbook category taxonomy plan"
importance_tier: "high"
contextType: "plan"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-doc/034-surface-playbook-expansion"
    last_updated_at: "2026-08-29T10:24:54Z"
    last_updated_by: "claude"
    recent_action: "Built 7 category dirs per package, waived agent-dispatch, verified 0 violations"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook"
      - ".opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook"
    session_dedup:
      fingerprint: "sha256:e0e49d03464fb7bd0d8f7082a7987d281c41046971ccb017916f5320d4b99e9d"
      session_id: "2026-08-29-sk-code-028"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Surface Playbook Expansion

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`sk-code-mobile-cli` and `sk-code-obsidian` are both operator-scenario, tier `FAIL_CLOSED` manual testing playbooks with a `PASS`/`FAIL`/`SKIP` verdict contract, enforced by `validate-playbook-package.cjs` against `playbook-corpus-manifest.json`. sk-doc's own playbook is a `routingGoldRoots` entry in that same manifest: all 32 of its scenarios are routing-gold, tier WARN, and run a four-way `PASS`/`PARTIAL`/`FAIL`/`SKIP` grading the validator forbids elsewhere (`FORBIDDEN_VERDICT` rejects `PARTIAL`, `READY`, `UNAUTOMATABLE`, `BLOCKED`).

### Overview

Expand both surface playbooks from 7 flat scenarios into sk-doc's 7-category-directory shape (intent-detection, resource-loading, unknown-fallback, cross-cli-dispatch, token-cost-baseline, holdout, surface-detection), waive the 8th category (agent-dispatch) in both with a package-grounded reason, and keep the `PASS`/`FAIL`/`SKIP` verdict set both packages already validated under.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- `playbook-corpus-manifest.json` read and confirmed: sk-doc is a `routingGoldRoots` entry (32 scenarios, all routing-gold-excluded, tier WARN); neither `sk-code-mobile-cli` nor `sk-code-obsidian` is listed there, so both default to the operator-scenario contract.
- `sk-code-review`'s prior literal alignment with sk-doc's scheme confirmed as precedent: 24 `FORBIDDEN_VERDICT` violations out of 129 total under `--package --strict`.

### Definition of Done

- Both packages validate `PASS`/`tier=FAIL_CLOSED`/`violations=0`/`exit=0` under `--strict`.
- `agent-dispatch` is waived in both, each with its own routingClass-grounded reason.
- No `PARTIAL`/`READY`/`UNAUTOMATABLE`/`BLOCKED` vocabulary appears in either package.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Adopt-taxonomy, keep-verdict. sk-doc's category breadth and index completeness are copied; its verdict scheme is not. The distinguishing mechanism is `playbook-corpus-manifest.json`'s `routingGoldRoots` list: membership there is what lets a playbook run the four-way grading at tier WARN, exempt from fail-closed enforcement. Neither surface playbook is a member, and this packet does not add either to that list — the decision was to change what the packages test, not what contract governs them.

### Key Components

- `playbook-corpus-manifest.json` `routingGoldRoots` / `warnPackages`: the mechanism sk-doc's four-way grading depends on. Reading it directly is what turned "align with sk-doc" from an assumption into a checked decision.
- `sk-code-review` precedent: a sibling package independently confirmed, via its own `--package --strict` run, to carry 24 `FORBIDDEN_VERDICT` violations out of 129 total from a prior literal alignment with sk-doc's scheme — the concrete evidence for why this packet did not repeat that move.
- Per-package `agent-dispatch` waiver: grounded in each package's own `routingClass: metadata` declaration and the location of its real execution surface (the Pi Remote app repository for `sk-code-mobile-cli`; the Obsidian plugin repository for `sk-code-obsidian`), not a single shared waiver text.

### Data Flow

sk-doc's 8-category shape → 7 categories mapped onto each surface playbook's own intents and `RESOURCE_MAP` (intent-detection retains the original 7 scenarios; the other 6 categories are authored fresh against each package's own `SKILL.md`) → `agent-dispatch` waived per package with its own grounded reason → `validate-playbook-package.cjs --package <pkg> --strict` → `PASS`/`FAIL_CLOSED`/`0 violations`.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read `playbook-corpus-manifest.json` and confirm sk-doc's `routingGoldRoots` membership and 32/8/WARN shape; confirm neither surface playbook is a member; confirm `sk-code-review`'s prior `FORBIDDEN_VERDICT` count as precedent.

### Phase 2: Core Implementation

Build the 7 category directories in both `sk-code-mobile-cli/manual-testing-playbook/` and `sk-code-obsidian/manual-testing-playbook/`; move each package's original 7 scenarios into `intent-detection/`; author scenarios for `resource-loading`, `unknown-fallback`, `cross-cli-dispatch`, `token-cost-baseline`, `holdout`, and `surface-detection`; waive `agent-dispatch` in both with a package-grounded reason.

### Phase 3: Verification

Run `validate-playbook-package.cjs --package <pkg> --strict` for both packages; confirm `PASS`/`FAIL_CLOSED`/`0 violations`/`exit=0`; confirm every `expected_resources` path resolves on disk; record the unrelated `sk-code-opencode` `JAVASCRIPT`-scenario gap as a known limitation.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Behavioral: `node validate-playbook-package.cjs --package sk-code/sk-code-mobile-cli --strict` and the same for `sk-code/sk-code-obsidian`, both read for `PASS`/`tier`/`scenarios`/`categories`/`violations`/`exit`. A path-level pass over every scenario's `expected_resources` frontmatter list, checked against the shipped filesystem tree. Controlled: `sk-code-review`'s own validator run (`--package sk-code/sk-code-review --no-strict`) as the negative-control precedent for what a literal sk-doc alignment produces on a fail-closed package.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` and its `playbook-corpus-manifest.json`.
- No new packages or network access.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reversible: the category directories are additive; reverting `sk-code-mobile-cli/manual-testing-playbook/` and `sk-code-obsidian/manual-testing-playbook/` to their prior 7-flat-scenario state restores each package's original, already-passing coverage. No manifest change to undo — `routingGoldRoots` and `warnPackages` were read, not edited.

<!-- /ANCHOR:rollback -->
