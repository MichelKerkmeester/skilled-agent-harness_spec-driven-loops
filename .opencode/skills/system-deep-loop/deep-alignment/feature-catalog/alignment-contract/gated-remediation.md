---
title: "Gated remediation"
description: "Invariant 4: fixing findings is a separate, opt-in, operator-approved pass, realized today as a callable no-op REMEDIATE hook point."
trigger_phrases:
  - "gated remediation"
  - "REMEDIATE hook point"
  - "remediate-hook.cjs not_implemented"
  - "opt-in operator approval"
  - "alignment invariant 4"
version: 1.0.0.1
---

# Gated remediation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Invariant 4 of the alignment contract: fixing findings is a separate, opt-in, operator-approved pass — never an automatic follow-on to the read-only loop.

Remediation is where a conformance audit could turn destructive, so it is the most tightly gated part of the mode. Today it is realized as a callable, testable hook point that performs no action; the wiring for the transition exists and is proven safe, but the fixing logic is deliberately unbuilt until an operator explicitly approves building it.

## 2. HOW IT WORKS

The optional `REMEDIATE` state follows `REPORT` only when explicitly requested and approved. `remediate-hook.cjs` is that state's hook point: `enterRemediateHook()` always returns `{ status: 'not_implemented', state: 'REMEDIATE', ... }` and touches neither the filesystem nor git — no writes, no git operations, no scoped-stage calls. Its message cites ADR-005 invariant 4 and `SKILL.md`'s NEVER "run the gated remediation pass without an explicit, separate operator opt-in" rule, and it carries the safety discipline a future implementation must honor: scoped staging only (never `git add -A`), a worktree when the branch has diverged, and doc-only restraint when concurrent sessions are live. The `--confirm` flag is accepted but not yet actionable. A future phase that builds real remediation replaces this script's body, not its call site — the loop-wiring contract (REPORT can optionally transition to REMEDIATE) is already correct.

When real remediation does land, it stays verify-first: it fixes only findings that survived a live re-probe, and it respects the read-only-default boundary until the moment the operator crosses it deliberately.

**Difference from deep-review:** deep-review has no remediation state at all — it reports and stops, and any fix happens outside the loop entirely. deep-alignment is architected from the start to have a fixing capability, and this invariant plus its no-op hook are what make that future capability safe to add without it ever firing implicitly or as a silent follow-on to an audit.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/remediate-hook.cjs` | Script | `enterRemediateHook()`: the always-no-op, always-safe REMEDIATE hook point with the documented safety discipline. |
| `SKILL.md` | Skill contract | §2 invariant 4, the NEVER "run remediation without an explicit, separate operator opt-in" rule, and the read-only header note. |
| `references/state-machine-wiring.md` | Reference | Section 7 documents the REMEDIATE hook point as a callable proof of a safe transition, not remediation logic. |
| `assets/deep-alignment-config-template.json` | Template | The `remediateHookScriptPath` entry wiring the state to this script. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/tests/state-machine-wiring.test.cjs` | Regression test | Proves the hook is enterable, returns `not_implemented`, and mutates nothing (before/after file listings identical). |

---

## 4. SOURCE METADATA

- Group: Alignment contract
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `alignment-contract/gated-remediation.md`
- Primary sources: `scripts/remediate-hook.cjs`, `SKILL.md`, `references/state-machine-wiring.md`
Related references:
- [read-only-default.md](../../feature-catalog/alignment-contract/read-only-default.md) — Read-only default
- [../loop-lifecycle/state-machine.md](../../feature-catalog/loop-lifecycle/state-machine.md) — State machine
