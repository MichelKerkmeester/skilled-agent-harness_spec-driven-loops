---
title: "Implementation Summary: D2-R10 — User-intent framing for the /design:* surface"
description: "Each /design:* command now leads with the user's job and isolates mode-binding in an Internal Binding section, machine-checked by a userIntent + copyGuard gate in design-command-surface-check.mjs."
trigger_phrases:
  - "d2-r10 user intent framing summary"
  - "design command user intent summary"
  - "lead with user job summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/010-user-intent-framing"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented D2-R10 user-intent framing; checker PASS invalid=0 drift=0; 7 files scoped"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r10-user-intent-framing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "copyGuard scanned in the intent lead region only, so the relocated mode-binding language is never falsely flagged"
      - "Sections matched by name (optional leading number) + HTML anchor, so the §2->§3..§7 renumber is safe"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-user-intent-framing |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
| **Enforcement class** | hybrid (metadata SSOT + deterministic surface gate) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The five `/design:*` commands now lead with the user's job instead of internal plumbing. Before this change, every wrapper opened with a "Thin bridge into the `sk-design` parent skill's `<mode>` mode" line and a `## 1. PURPOSE` that pinned the mode, so a user read the mode-binding mechanics before they read whether the command served their request. Each wrapper now opens with the user-facing "I want to ..." job, projects that job and its owned signals under `## 1. USER INTENT`, and relocates the mode-pinning mechanics into a distinct `## 2. INTERNAL BINDING` section. The framing is reconciled with each record's aliases and policed by the surface gate, so the bridge-first phrasing can never creep back into the lead.

### User-intent metadata per command

`command-metadata.json` gained a `userIntent{ job, ownedSignals }` object and a `copyGuard` array on all five records, with every prior field preserved. The values are reconciled, not invented: each `job` is the user-voice restatement of that record's `description`, and every `ownedSignals` entry is a member of the same record's `aliases` (signal ⊆ aliases). The `copyGuard` is the shared bridge-first corpus — `["Thin bridge", "Pin the", "parent skill's", "parent hub to", "loads the", "mode directly"]` — the phrases the intent lead must never contain.

### Reframed wrappers with USER INTENT + INTERNAL BINDING

Each of the five `commands/design/*.md` files now leads with its user job, carries a `## 1. USER INTENT` section (job + owned signals) and a new `## 2. INTERNAL BINDING` section holding the relocated mode-pinning mechanics (pin the `<mode>` mode of the `sk-design` parent hub; hub owns routing; loads the mode directly; defer to the hub when the request spans more). The prior `WHEN TO USE` / `PRECONDITIONS` / `REGISTER` / `EMIT DELIVERABLE` / `EXAMPLE` / `PIPELINE` sections shifted number to make room for INTERNAL BINDING but kept their names and anchors. Wrapper frontmatter stayed byte-frozen so existing drift stays 0.

### Renumber safety

All eight named sections survive in all five wrappers after the renumber: USER INTENT 5/5, INTERNAL BINDING 5/5, EMIT DELIVERABLE 5/5, EXAMPLE 5/5, WHEN TO USE 5/5, PRECONDITIONS 5/5, REGISTER 5/5, PIPELINE 5/5. Nothing was dropped in the shift. The checker matches each section by name with an optional leading number (`## (\d+\. )?<NAME>`) and matches the sibling-discriminator by HTML anchor, so moving sections from §2-§6 to §3-§7 never changes what the existing rules find — only the named sections and anchors are load-bearing, not their numbers.

### Checker enforcement

`design-command-surface-check.mjs` was extended additively: `userIntent` and `copyGuard` joined `REQUIRED_FIELDS`; a new `validateUserIntent` (Stage 1) checks that `userIntent` is an object, `job` is a non-empty string, `ownedSignals` is a non-empty unique string array with every entry ∈ `aliases`, and `copyGuard` is a non-empty unique string array; and a Stage-2 body channel requires a `## <n>. USER INTENT` section + the record's `job` text in the intent lead region (H1 down to the first `## INTERNAL BINDING`), requires a `## <n>. INTERNAL BINDING` section, and bans every `copyGuard` phrase from the lead region only — reporting misses as drift `field: "user-intent"`. Scoping the copyGuard scan to the lead region is what lets the relocated mode-binding language live untouched inside INTERNAL BINDING.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/command-metadata.json` | Modified | Added `userIntent{ job, ownedSignals ⊆ aliases }` + `copyGuard` to all 5 records; all prior fields preserved |
| `.opencode/commands/design/audit.md` | Modified | Lead with user job; `## 1. USER INTENT` + `## 2. INTERNAL BINDING`; named sections renumbered §3-§7; frontmatter frozen |
| `.opencode/commands/design/foundations.md` | Modified | Same projection from its `userIntent` record |
| `.opencode/commands/design/interface.md` | Modified | Same projection from its `userIntent` record |
| `.opencode/commands/design/md-generator.md` | Modified | Same projection from its `userIntent` record |
| `.opencode/commands/design/motion.md` | Modified | Same projection from its `userIntent` record |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modified | Added `userIntent`+`copyGuard` to REQUIRED_FIELDS, `validateUserIntent`, and a Stage-2 USER INTENT / INTERNAL BINDING / copyGuard-in-lead channel |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build ran SSOT-first: the `userIntent` + `copyGuard` objects landed in `command-metadata.json` before the wrappers, so Stage 1 stayed valid while the wrapper bodies were reframed off each record. The five wrappers were then reframed — bridge-first lead replaced with the user job, `## 1. PURPOSE` renamed to `## 1. USER INTENT`, a `## 2. INTERNAL BINDING` section added, and the remaining named sections renumbered to §3-§7 — and the checker rules were added last so the metadata-and-wrapper state was already conformant. Every change is strictly additive: `mode-registry.json` was never touched, wrapper frontmatter stayed frozen, and the final surface-check state is `invalid=0 drift=0`. The gate was confirmed to bite with a synthetic break (a `userIntent.ownedSignals` entry that is not one of that record's aliases → `STATUS=INVALID` "userIntent.ownedSignals contains non-alias signal", `invalid=1`), then restored to `invalid=0 drift=0`. Scope held to exactly seven files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Lead with the user job, relocate mode-binding to `INTERNAL BINDING` | The user should read whether a command serves their request before they read its plumbing; isolating the bridge/pin language in one section keeps the lead user-facing |
| Bind `ownedSignals` to each record's `aliases` (signal ⊆ aliases) | The intent framing cannot contradict the routing surface it sits in; the subset rule is enforced deterministically by the checker, not just asserted in prose |
| Scope the copyGuard scan to the intent lead region only | The relocated mode-binding language legitimately uses `Pin the` / `loads the` inside INTERNAL BINDING; a whole-file ban would false-positive on its own relocated copy |
| Match sections by name (optional leading number) + anchor | Shifting sections from §2-§6 to §3-§7 stays safe because only the named headers and the sibling-discriminator anchor are load-bearing, not the numbers — proven by 8/8 sections surviving 5/5 |
| Keep wrapper frontmatter byte-frozen | Body-only edits keep the prior D2 frontmatter-drift gate at 0, so the change is provably no-regression |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node design-command-surface-check.mjs` | PASS `invalid=0 drift=0` (exit 0); userIntent + copyGuard + all prior D2 fields green |
| `userIntent` shape | 5/5 records carry a non-empty `job` string + non-empty `ownedSignals` array |
| `ownedSignals ⊆ aliases` | 5/5 records reconcile (every signal is one of that record's aliases) |
| `copyGuard` corpus | 5/5 records carry the non-empty bridge-first array |
| USER INTENT lead | 5/5 wrappers lead with the user job and carry `## 1. USER INTENT` |
| INTERNAL BINDING section | 5/5 wrappers carry `## 2. INTERNAL BINDING` (mode-binding relocated, not left in the lead) |
| Bridge-first ban (lead region) | 5/5 leads contain no `copyGuard` phrase |
| Renumber safety (orchestrator-verified) | 8 named sections survive 5/5 (USER INTENT, INTERNAL BINDING, EMIT DELIVERABLE, EXAMPLE, WHEN TO USE, PRECONDITIONS, REGISTER, PIPELINE) |
| Synthetic break (implementer + orchestrator-verified) | A non-alias `ownedSignals` entry → `STATUS=INVALID` "userIntent.ownedSignals contains non-alias signal" (`invalid=1`); restoring → `invalid=0 drift=0` |
| `node --check` on checker | PASS (valid ESM) |
| `command-metadata.json` JSON parse | PASS (5 records) |
| Non-mutation | `git status`: `mode-registry.json` byte-unchanged |
| Scope | `git status`: exactly 7 files changed (metadata + 5 wrappers + checker) |

### Test Coverage Summary

| Surface | Channel | Status |
|---------|---------|--------|
| `userIntent` shape + `ownedSignals ⊆ aliases` + `copyGuard` non-empty | Stage 1 `validateUserIntent` | PASS |
| USER INTENT section + job in lead region + INTERNAL BINDING section | Stage 2 body channel | PASS |
| copyGuard phrase banned in lead region only | Stage 2 body channel | PASS |
| Prior D2 (toolPolicy/argumentHint/SSOT/examples/contract/discriminator/preconditions/register/pipeline) | full run | PASS, intact |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Residual generated-metadata errors are expected.** Strict `validate.sh` reports a `GENERATED_METADATA_INTEGRITY` source-fingerprint mismatch (and may report a synopsis drift) because `spec.md` / `implementation-summary.md` changed after the last metadata generation. These are regenerated by the orchestrator via `generate-context.js`; they are not hand-written here.
2. **The copyGuard ban is lexical, scoped to the lead region.** It proves no banned phrase appears between the H1 and the first `## INTERNAL BINDING`; it does not parse meaning. A user-intent lead could still be vague while passing — the `job ↔ description` consistency is an authoring rule, verified in the checklist, not a machine assertion.
3. **`ownedSignals ⊆ aliases` is enforced; `job ↔ description` is not.** The subset rule is deterministic in the checker. The requirement that each `job` restates its `description` in user voice is verified by authoring review, since the checker cannot judge paraphrase fidelity.
<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification addendum
- Post-implementation: userIntent + copyGuard metadata + reframed wrapper leads + INTERNAL BINDING section + Stage-1/Stage-2 checker channel
- Strictly additive; mode-registry.json untouched; frontmatter frozen; renumber safe (8 sections 5/5); final surface-check invalid=0 drift=0
-->
