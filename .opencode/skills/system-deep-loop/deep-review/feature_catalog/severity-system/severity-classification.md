---
title: "Severity classification"
description: "Assigns P0 or P1 or P2 meaning and severity weight to each review finding."
trigger_phrases:
  - "severity classification"
  - "P0 P1 P2 severity"
  - "classify finding severity"
  - "newFindingsRatio weight"
  - "blocker required advisory"
version: 1.11.0.6
---

# Severity classification

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Assigns P0 or P1 or P2 meaning and severity weight to each review finding.

The severity system converts raw review observations into blocker, required, or suggestion findings. Those levels control convergence math, verdict routing, and whether a finding can block release.

## 2. HOW IT WORKS

The live contract uses three severity levels with fixed weights: `P0 = 10.0`, `P1 = 5.0`, `P2 = 1.0`. All severities require concrete file-line evidence. The loop uses those weights to compute `newFindingsRatio`, including half-weight refinements, and applies the P0 override so any newly discovered blocker raises the ratio to at least `0.50`.

The semantic meaning of each level is stable across the skill. P0 covers correctness failures, security vulnerabilities, and hard contradictions. P1 covers degraded behavior, incomplete implementation, or missing validation. P2 covers advisory items such as clarity gaps, naming issues, or documentation cleanup.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `SKILL.md` | Skill contract | Summarizes P0, P1, and P2 criteria and blocking behavior. |
| `references/convergence/convergence.md` | Protocol | Defines severity weights, weighted ratio math, and the P0 override rule. |
| `references/state/state_format.md` | Schema | Defines severity weights, iteration finding sections, and finding-registry severity fields. |
| `assets/review_mode_contract.yaml` | Contract | Declares the stable severity taxonomy and per-level weights. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/iteration-execution-and-state-discipline/severity-classification-in-jsonl.md` | Manual scenario | Verifies severities and counts are recorded correctly in iteration state. |
| `manual_testing_playbook/convergence-and-recovery/p0-override-blocks-convergence.md` | Manual scenario | Confirms the blocker override path in convergence logic. |

---

## 4. SOURCE METADATA

- Group: Severity system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `severity-system/severity-classification.md`
- Primary sources: `SKILL.md`, `references/convergence/convergence.md`, `references/state/state_format.md`, `assets/review_mode_contract.yaml`
Related references:
- [adversarial-self-check.md](adversarial-self-check.md) — Adversarial self-check
