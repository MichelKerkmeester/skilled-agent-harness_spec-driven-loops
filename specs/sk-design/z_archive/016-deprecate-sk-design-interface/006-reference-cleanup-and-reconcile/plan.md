---
title: "Implementation Plan: Repo-wide reference cleanup and reconcile after the sk-design delete"
description: "Inventory every live sk-design reference, reconcile advisor graph + command bridges + tests + docs with a remove-or-reframe rule (never a false repoint), regenerate generated artifacts from tooling, record the single benign parity drift, and enumerate the documented residual."
trigger_phrases:
  - "reconcile sk-design references plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/006-reference-cleanup-and-reconcile"
    last_updated_at: "2026-08-19T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored reconcile plan"
    next_safe_action: "validate.sh --strict; operator-gated scoped commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/graph-metadata.json"
      - ".opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges/command-bridges.generated.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Repo-wide reference cleanup and reconcile after the sk-design delete

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Sweep the repo for every reference to the deleted hub, then reconcile only the *live* ones under one honesty rule: a design-*judgment* reference is **removed** from enumerations or **reframed as out-of-scope** — never repointed at the extraction survivor, which is a leaf, not a hub. Advisor-graph edges and command bridges are regenerated from their own tooling rather than hand-edited. The single benign routing-graph parity ripple is confirmed against the pre-delete HEAD baseline and recorded. Generated routing artifacts and frozen evidence are enumerated as documented residual.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- **Ready:** 005 landed — the hub + interface commands are deleted; the survivor is standalone and green.
- **Done:** live surfaces return zero hub references; advisor graph is hub-free + symmetric (family `sk-util`); command bridges regenerated with zero `sk-design`; tests retuned and green; parity drift recorded and re-run green; residual set enumerated; `validate.sh --strict` exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Aspect | Value |
|--------|-------|
| **Graph identity** | survivor `graph-metadata.json`: `family` sk-design → `sk-util` (valid allowed value) |
| **Graph edges** | remove `mcp-tooling depends_on` + `sk-code siblings` edges targeting the survivor (asymmetric after delete) |
| **Command bridges** | regenerate `command-bridges.generated.json` (+ `projection.ts`, `skill_advisor.py`) via `derive-command-bridges.cjs` |
| **Tests** | `command-binding-existence` HUBS/namespaces; `skill-root-metadata-contract` classes; `command-bridges-drift-guard` + `command-metadata-e2e` counts; both parity suites + approved-divergences fixture |
| **Docs** | `sk-create-diff`/`sk-create-diagram` → "out of scope"; minimax model card design-variant removed; playbook manifest + validator drop sk-design |
| **Leaf manifests** | `system-deep-loop` + survivor regenerated (`--fix`) |
| **Rule** | remove-or-reframe; never a false repoint of a hub onto a leaf |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Run the authoritative live-surface sweep and classify every hit into: live-contract (reconcile now), generated-artifact (regenerate from tooling / defer to main-side regen), frozen-evidence (leave), illustrative-example (leave).

### Phase 2: Implementation

Reconcile the live set: fix the graph identity + edges; regenerate command bridges from tooling; retune the count/existence/class test guards; reframe the judgment-boundary docs as out-of-scope; regenerate the leaf manifests. Confirm the one parity divergence was green at the pre-delete HEAD baseline, then record it in both parity suites and the approved-divergences fixture.

### Phase 3: Verification

Re-run the live-surface sweep (zero live hub refs); run the advisor test suite (parity/drift-guard/metadata-e2e/existence/contract green); confirm graph-health asymmetry is no worse than the HEAD baseline; enumerate the documented residual.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Real command evidence: the `rg -P 'sk-design(?!-md-generator)'` live-surface sweep returning only frozen/generated/illustrative hits; the regenerated `command-bridges.generated.json` grepping zero `sk-design`; the advisor vitest suite (parity, drift-guard, metadata-e2e, command-binding-existence) green; a HEAD-baseline comparison proving the pre-existing failures (advisor-validate, cli exit-128) are not introduced by this phase and the recorded parity drift was green before the delete.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Upstream: 005 (delete). Downstream: packet closeout + operator-gated scoped commit.
- Tools: `derive-command-bridges.cjs` (bridge regen); `ci-skill-root-metadata.cjs --fix` (leaf-manifest regen); vitest (advisor suite); `rg`/Read/Edit for the sweep and surgical edits; git for the HEAD-baseline comparison.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Uncommitted. Each reconcile edit reverts via `git checkout -- <file>`; the regenerated artifacts revert by re-running their generator against the restored inputs or `git checkout`. Reversing returns the repo to its post-005 state (hub deleted, references dangling). Nothing committed or pushed until the operator approves the scoped commit.
<!-- /ANCHOR:rollback -->
