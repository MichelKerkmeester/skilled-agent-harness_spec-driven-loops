---
title: "Implementation Summary: versioned command contract"
description: "Shipped the versioned command contract: a JSON sidecar schema plus a six-family contract under create-command/assets/, with both templates and the skill aligned to consume it, the family enumerations and stale section pointers removed, and the required-input contradiction resolved on the router-gate form."
trigger_phrases:
  - "versioned command contract implementation"
  - "command contract sidecar schema"
  - "command contract shipped status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation/001-versioned-command-contract"
    last_updated_at: "2026-07-16T12:30:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped versioned command contract; six families populated, templates and skill aligned"
    next_safe_action: "Open 002-executable-edge-route-parsing"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-command/assets/command_contract.schema.json"
      - ".opencode/skills/sk-doc/create-command/assets/command_contract.json"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
      - ".opencode/skills/sk-doc/create-command/assets/command_template.md"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Sidecar format is JSON (machine-read consumers; matches template_rules.json precedent)"
      - "The mode matrix lives inline in the contract, not a separate mode-registry"
      - "The default_policy enum needs a fifth value (non-mutating-default) for memory, not for speckit/deep"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-versioned-command-contract |
| **Status** | Complete |
| **Completed** | 7 of 7 tasks; contract validates, six families populated, canon aligned, acceptance harness green |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The command canon now has one versioned, machine-readable contract that replaces the behavioral truth previously duplicated as prose across the skill, the two templates, and the router variant tables. Before this phase, "which family is which topology" and each family's mode default lived as three separate hand-maintained lists that had already drifted (the doctor family was misclassified as direct-dispatch with no workflow YAML in all three).

The contract ships as a JSON sidecar under `create-command/assets/`: a `command_contract.schema.json` (a draft-07 schema whose `topology` field is a four-class discriminated union) and a `command_contract.json` populated for all six families. Each family entry declares topology, input and gate owner, execution targets, a mode matrix, owned assets, loader requirements, presentation ownership with typed exceptions, destructive policy, timeout bounds, and invocation aliases. Both templates and the skill were reworked to consume the contract, and the required-input rule was unified on the router-gate form.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/command_contract.schema.json` | Created | Versioned discriminated-union schema for the command families |
| `assets/command_contract.json` | Created | The contract populated for create, design, speckit, memory, doctor, and deep |
| `assets/command_router_template.md` | Modified | Dropped the family-enumeration column, added the required-argument gate slot, added a COMMAND CONTRACT section with a validating example |
| `assets/command_template.md` | Modified | Replaced the off-by-one Command-Types section pointers and the stale gate-pattern references with drift-proof names, de-enumerated the family topology, added a COMMAND CONTRACT section with a validating example |
| `SKILL.md` | Modified | De-enumerated the Step 11 family topology and pointed it at the contract; indexed the contract in the reference list |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The schema was authored first from the requirements plus the 014 asset-layer findings. A per-family behavioral census then read every router and asset across the six families to ground the contract in evidence rather than assumption — which corrected two design premises: the fifth default-policy value is pressured by memory (a direct-dispatch family with a non-mutating default), not by speckit or deep as the open question had guessed; and the observed `confirm == auto + checkpoints` relationship holds only for light single-pass families and inverts for autonomy-heavy deep and speckit-complete commands, so the contract records it as a family-dependent note rather than a universal invariant. The contract was then populated, both templates and the skill were aligned, and every acceptance gate was run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ship the contract as a JSON sidecar asset, not template frontmatter | Some OpenCode and Claude loaders drop unverified frontmatter placement; a sidecar keeps the machine-readable source reliable, and JSON matches the machine-read consumers and the `template_rules.json` / `mode-registry.json` precedent |
| Mode matrix lives inline in the contract | A separate mode-registry would re-fragment the single source of truth this phase exists to create |
| Add a fifth default-policy value `non-mutating-default` | The census proved the 4-value enum is not exhaustive: memory (direct-dispatch, no auto/confirm pair) has a read-only/preview default that none of the four values captures; speckit and deep both stay `ask` |
| Record the confirm/auto relationship as a note, not a schema constraint | The census disproved it as a universal invariant; baking it in would misvalidate autonomy-heavy commands |
| Leave doctor's manifest subtype unpopulated | Naming `routing_source` (manifest vs inlineTable) is the next phase's scope; this phase records only doctor's topology |
| Resolve the required-input contradiction by adding the router-gate slot to the skeleton | The skill already mandated the gate; the router template omitted it — adding the slot makes them agree, with enforcement scoped to phase 003 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Schema defined and meta-valid | PASS — `command_contract.schema.json` passes draft-07 meta-validation |
| Six-family population | PASS — `command_contract.json` validates with complete entries for all six families |
| Templates validate against the schema | PASS — each template's embedded `contract-example` block validates as a `familyContract` |
| Mode defaults match intent | PASS — create=confirm, design=conditional-auto, speckit=ask (resume override=confirm), doctor=confirm-only, deep=ask, memory=non-mutating-default |
| memory/search inline is a typed exception | PASS — recorded as a render-fidelity `presentation.exceptions[]` entry, not a leak |
| No stale section pointer or family inventory | PASS — grep sweep finds zero numbered-section pointers and zero family enumerations in the templates or the skill |
| Required-input contradiction resolved | PASS — the skill and the router skeleton agree on the router-gate form; the invariant holds for all six families |
| Edited docs still structurally valid | PASS — both templates (`--type asset`) and the skill (`--type skill`) exit 0; `package_skill.py --check` on create-command PASSES |
| Strict packet validation | Run `validate.sh --strict` on this folder — Errors: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Contract declared, not yet enforced.** This phase declares the contract and aligns the prose to consume it; the semantic validators that fail a command on a contract violation are phase 003, and generating routers from the contract is phase 005. The required-input rule is resolved in its declared form but is not yet machine-enforced.
2. **doctor's manifest subtype is unnamed.** The contract records doctor as `subaction-route-manifest` but leaves `routing_source` (manifest vs inlineTable) and the router template's four-class variant documentation to the next phase, which owns the doctor-subtype fix.
3. **Pre-existing skill warnings unchanged.** `package_skill.py --check` on create-command reports three soft warnings (two missing recommended sections and a word count over the recommended max) that pre-date this phase; the contract-alignment additions nudged the word count by sixteen words but did not introduce the warning.
<!-- /ANCHOR:limitations -->
