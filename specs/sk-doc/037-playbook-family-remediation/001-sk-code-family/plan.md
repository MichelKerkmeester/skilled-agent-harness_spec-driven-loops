---
title: "Plan: sk-code family playbook remediation"
description: "Read the corpus manifest first to learn which contract governs each sk-code root, then remediate the five dirty roots to zero and re-measure each one individually rather than through a fleet roll-up."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "sk-code family playbook remediation plan"
  - "per-root playbook measurement plan"
importance_tier: "high"
contextType: "plan"
parent: "sk-doc/037-playbook-family-remediation"
_memory:
  continuity:
    packet_pointer: "sk-doc/037-playbook-family-remediation/001-sk-code-family"
    last_updated_at: "2026-08-29T11:45:00Z"
    last_updated_by: "claude"
    recent_action: "Remediated five roots and re-measured each with its own package run"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/manual-testing-playbook"
      - ".opencode/skills/sk-code/sk-code-review/manual-testing-playbook"
    session_dedup:
      fingerprint: "sha256:4d21ebe9ddd5b9746445a3d4b52ac3b2f46f2ee7260aa33ed9782e546851add7"
      session_id: "2026-08-29-sk-code-031-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: sk-code family playbook remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`validate-playbook-package.cjs` grades a playbook root against the operator-scenario contract, using `playbook-corpus-manifest.json` to decide which tier applies. A root listed in `routingGoldRoots` has its scenarios excluded from the operator contract and graded at tier WARN with a four-way verdict set. Every other root is `FAIL_CLOSED` with `PASS`/`FAIL`/`SKIP` only, and `FORBIDDEN_VERDICT` rejects `PARTIAL`, `READY`, `UNAUTOMATABLE`, and `BLOCKED`. The `sk-code` hub has one path-level exclusion, `compiled-routing/`, registered in that same list.

### Overview

Read the manifest before touching a document, so each root's real contract is known rather than inferred from a sibling. Remediate the five dirty roots to zero violations each — the hub, `sk-code-review`, `sk-code-webflow`, `sk-code-opencode`, and `sk-code-quality` — and re-measure every root with its own `--package` invocation, because a fleet run resolves a nested package to its parent identifier and would report a sub-package's state under the wrong name.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The manifest is read and each root's tier is known: no sk-code root is in `routingGoldRoots` except the hub's `compiled-routing/` path, and no sk-code root is in `warnPackages`.
- The starting count for each dirty root is measured, not assumed: hub 181, `sk-code-review` 129, `sk-code-webflow` 156, `sk-code-opencode` 108, `sk-code-quality` 12.

### Definition of Done

- Each of the five dirty roots reports `violations=0` under its own `--package <root> --strict` run.
- The hub still reports one routing-gold-excluded file.
- The two already-clean roots still report zero.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Measure per root, repair at the source of the class. Violations cluster into classes with one cause each, so the unit of work is the class rather than the file: `sk-code-review`'s 24 `FORBIDDEN_VERDICT` instances are one imported vocabulary, not 24 independent decisions. Fixing the class and re-measuring the root is what proves the cause was read correctly.

### Key Components

- `playbook-corpus-manifest.json`: the authority for which contract governs a root. Reading it is what distinguishes a package that may use `PARTIAL` from one that may not.
- `validate-playbook-package.cjs --package <root> --strict`: the per-root measurement. Its census line carries `scenarios`, `categories`, `operator`, `routing_gold_excluded`, `violations`, and `warnings`, so a repair and a reclassification are distinguishable in the output.
- The hub's `compiled-routing/` exclusion: a path-level routing-gold entry that must survive the phase unchanged, since a change there would move violations out of scope instead of clearing them.

### Data Flow

Manifest read to establish each root's tier and exclusions, then per-root `--package --strict` to establish the starting count, then class-level repair, then per-root `--package --strict` again to establish `violations=0` with the tier and exclusion count unchanged from the starting census.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read `playbook-corpus-manifest.json` and confirm each sk-code root's tier and exclusions. Measure the starting count for each of the seven roots with its own `--package` run, which is what identifies the five dirty roots and confirms the other two are already at zero.

### Phase 2: Core Implementation

Remediate the five dirty roots by violation class. For `sk-code-review`, remove the imported four-way grading vocabulary rather than registering the package for it. For the other four, clear the structural and content classes their own census reports.

### Phase 3: Verification

Re-run `--package <root> --strict` for all seven roots. Confirm `violations=0` everywhere, `tier=FAIL_CLOSED` everywhere, the hub's `routing_gold_excluded=1` unchanged, and no sk-code root added to `warnPackages`.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Behavioral: `validate-playbook-package.cjs --package <root> --strict` run once per root, before and after, with the census line read in full rather than the exit code alone. Controlled: the tier and `routing_gold_excluded` fields on each after-run act as the control against clearing a count by reclassification — a repaired root shows the same tier and the same exclusion count as before, with only `violations` changed.

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

Documentation-only and fully reversible: reverting the five roots' `manual-testing-playbook/` trees restores their prior contents and their prior violation counts. No manifest entry was added or removed by this phase, so there is no enforcement change to unwind — the grandfather list is the subject of `004-fail-closed-graduation`.

<!-- /ANCHOR:rollback -->
