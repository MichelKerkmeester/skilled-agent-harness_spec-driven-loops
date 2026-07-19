---
title: "Rollback"
description: "Restores the archived canonical target after a guarded deep-improvement promotion."
trigger_phrases:
  - "rollback"
  - "rollback-candidate.cjs"
  - "restore canonical target"
  - "undo promotion"
  - "archived backup restore"
version: 1.17.0.14
---

# Rollback

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Restores the archived canonical target after a guarded deep-improvement promotion.

This feature covers the safety path that makes canonical mutation reversible once a promotion has already happened and later evidence shows the promoted file should be undone.

---

## 2. HOW IT WORKS

Rollback is implemented as a dedicated helper instead of an automatic side effect of promotion. `rollback-candidate.cjs` validates the requested target against the runtime config and the single canonical target named by the manifest, then copies the archived backup back onto the canonical file and returns a `rolled_back` result.

The rollback helper is deliberately narrow. It does not emit journal rows, re-run the scorer, or reconcile runtime mirrors by itself. Those follow-on checks live in the rollback runbook and surrounding orchestration, which keeps file restoration separate from audit logging and packaging review.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs` | Rollback helper | Restores the archived backup after validating the runtime config and canonical manifest target. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs` | Promotion helper | Creates the archived backup that rollback later restores. |
| `.opencode/skills/system-deep-loop/deep-improvement/references/shared/rollback-runbook.md` | Runbook | Defines the operator steps around rollback and post-rollback proof. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/references/agent-improvement/mirror-drift-policy.md` | Policy reference | Separates rollback from later mirror-review work. |
| `.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion-rules.md` | Policy reference | Defines when rollback-ready evidence must exist before promotion proceeds. |

---

## 4. SOURCE METADATA

- Group: Evaluation loop
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `evaluation-loop/rollback.md`
Related references:
- [promotion-gates.md](../../feature-catalog/evaluation-loop/promotion-gates.md) — Promotion gates
- [plateau-detection.md](../../feature-catalog/evaluation-loop/plateau-detection.md) — Plateau detection
