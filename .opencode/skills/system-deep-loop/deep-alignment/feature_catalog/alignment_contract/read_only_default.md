---
title: "Read-only default"
description: "Invariant 3: the loop observes and reports; it never modifies an audited artifact unless remediation is explicitly requested."
trigger_phrases:
  - "read-only default"
  - "no write edit default surface"
  - "observe and report"
  - "Task Bash reserved remediation"
  - "alignment invariant 3"
version: 1.0.0.1
---

# Read-only default

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Invariant 3 of the alignment contract: the loop observes and reports; it never modifies an audited artifact unless remediation is explicitly requested.

A conformance audit is a read operation. The default surface is built so that finding drift and fixing drift are two separate acts, and only the first happens automatically — the second is a gated, opt-in pass covered by the gated-remediation invariant.

## 2. HOW IT WORKS

The default surface exposes no `Write`/`Edit`. `SKILL.md`'s `allowed-tools` list carries `Task` and `Bash`, but its own header note states they are reserved for the gated, opt-in remediation pass, not the default read-only surface — and that loop-owned state writes route through shared runtime scripts into the bound `alignment/` directory, never as direct edits to an audited artifact. There is no `WebFetch`: alignment checks local artifacts against local authority standards, so no network read is needed either. Every adapter reinforces this at the tool level — sk-code explicitly excludes the tree-mutating `minify-webflow.mjs` from `check()`, and sk-design never invokes the rendering/extraction pipeline — so even the deterministic tooling the loop runs is chosen to be non-mutating.

The `alignment/` state files the loop does write (config, corpus, state log, registry, report) are its own bookkeeping under the bound spec folder, distinct from the audited artifacts; the config's `fileProtection` map records each as `immutable`, `auto-generated`, `append-only`, or `operator-controlled` to keep that separation explicit.

**Difference from deep-review:** deep-review is also read-only against its target, but it has no gated-mutation counterpart to gate *against* — it never fixes anything, so read-only is simply its whole nature. deep-alignment makes read-only an explicit default precisely because it has a real, separately-gated remediation capability on the other side of the boundary; the invariant is what keeps that capability from firing automatically.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `SKILL.md` | Skill contract | The `allowed-tools` list, the read-only header note, §2 invariant 3, and the NEVER "modify an audited artifact during the default read-only loop" rule. |
| `scripts/adapters/sk-code.cjs` | Adapter | `standardSource()`'s `excludedFromCheck` record keeps the tree-mutating minifier out of `check()`. |
| `scripts/adapters/sk-design.cjs` | Adapter | Reads DESIGN.md/tokens.json only; never renders or runs the extraction pipeline (NFR-S01). |
| `assets/deep_alignment_config_template.json` | Template | The `fileProtection` map separating loop-owned state files from audited artifacts. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/tests/state-machine-wiring.test.cjs` | Regression test | Asserts the `REMEDIATE` hook mutates nothing (before/after `alignment/` file listings are identical). |

---

## 4. SOURCE METADATA

- Group: Alignment contract
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `alignment-contract/read-only-default.md`
- Primary sources: `SKILL.md`, `scripts/adapters/sk-code.cjs`, `assets/deep_alignment_config_template.json`
Related references:
- [verify-first.md](../alignment_contract/verify_first.md) — Verify-first
- [gated-remediation.md](../alignment_contract/gated_remediation.md) — Gated remediation
