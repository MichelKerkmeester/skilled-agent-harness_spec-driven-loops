---
title: "Two-phase promotion and rollback"
description: "Splits promotion into accept and ship phases, preserves branch evidence on blocked failures, and restores the canonical target through rollback-candidate.cjs."
trigger_phrases:
  - "two-phase promotion"
  - "accept ship promotion"
  - "promotion_blocked_branch_preserved"
  - "rollback-candidate.cjs"
  - "accepted vs shipped"
version: 1.17.0.1
---

# Two-phase promotion and rollback

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Promotion now separates candidate acceptance from canonical shipping. The accept phase verifies gates, snapshots the canonical preimage, snapshots the candidate, records preserved-branch metadata, and does not mutate the canonical target. The ship phase reloads that accepted-state file, verifies the canonical target still matches the accepted preimage, and only then writes the accepted candidate snapshot. `rollback-candidate.cjs` restores the pre-acceptance backup while leaving preserved branch evidence available for review.

---

## 2. HOW IT WORKS

`promote-candidate.cjs --phase=accept` runs the same promotion gates as the legacy path, then writes an accepted-state JSON file under the archive directory. That state captures the canonical target path, candidate snapshot path, pre-accept backup path, hashes, score/benchmark/repeatability evidence, manifest/config paths, preserved branch, and branch preservation policy.

`promote-candidate.cjs --phase=ship --acceptance-file=...` reloads the accepted-state file and refuses to ship if the state is not accepted, the canonical target is missing, the canonical target hash drifted after acceptance, the accepted candidate snapshot is missing, or the snapshot hash changed. On canonical drift or missing target, it restores the pre-acceptance backup before failing and emits `promotion_blocked_branch_preserved` when an event log is configured and the default `preserve-on-failure` policy is active.

`rollback-candidate.cjs` is the explicit recovery helper. It loads the accepted-state file or direct target/backup/config/manifest arguments, verifies the target is the single allowed canonical target, copies the pre-acceptance backup over the canonical target, and appends a `rollback_result` event when an event log is configured.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs` | Promotion helper | Implements `--phase=accept`, `--phase=ship`, accepted-state snapshots, canonical preimage checks, and `promotion_blocked_branch_preserved` events. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs` | Rollback helper | Restores the pre-acceptance backup to the canonical target and records `rollback_result` evidence. |
| `.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion-gate-contract.md` | Contract reference | Documents the accept and ship phases, gate sequence, and post-ship verification. |
| `.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion-rules.md` | Policy reference | Defines the default `preserve-on-failure` branch preservation policy and no-go conditions. |
| `.opencode/skills/system-deep-loop/deep-improvement/assets/agent-improvement/improvement-config.json` | Runtime config | Supplies the default `branchPreservationPolicy: "preserve-on-failure"` setting consumed by promotion and rollback. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts` | Automated test | Asserts accept leaves the canonical target unchanged, ship writes the accepted snapshot, rollback restores the original target, and ship drift emits `promotion_blocked_branch_preserved`. |

---

## 4. SOURCE METADATA

- Group: Evaluation loop
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `evaluation-loop/two-phase-promotion-and-rollback.md`
Related references:
- [promotion-gates.md](../../feature-catalog/evaluation-loop/promotion-gates.md) -- Promotion gate checks
- [rollback.md](rollback.md) -- Legacy rollback reference
