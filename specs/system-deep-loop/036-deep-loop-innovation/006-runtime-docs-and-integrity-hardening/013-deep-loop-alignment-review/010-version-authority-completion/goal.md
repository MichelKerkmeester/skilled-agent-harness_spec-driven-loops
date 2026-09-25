---
title: "Goal: Phase 10: version-authority-completion"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/010-version-authority-completion"
    last_updated_at: "2026-09-16T04:35:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Phase fix landed and criteria checked"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: version authority completion

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Finish the version-authority work by bringing the two deferred hubs to one version each and resolving every exception from evidence.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each hub declares its `SKILL.md` as the release authority, and `SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json` carry that one version. |
| D2 | Where a hub's `SKILL.md` names a release its changelog does not, the release is real and the changelog entry is missing: author the entry, never roll the version back. |
| D3 | A packet version is independent of its hub's by design. A `0.x` packet is recorded with its reason, never raised to match the hub. |
| D4 | The activation manifest is re-minted in the same change, in both the runtime and authored copies. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the durable
slice of this file in chat, frontmatter excluded, so the operator can update
their copy. Keep reminding while it stays unset; never stop work for it. A
child goal change that alters a parent decision or criterion is an amendment
to the parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Each hub's five routing artifacts carry one version, and it equals that hub's newest changelog entry
- [x] The missing `sk-doc` release entry exists, so the authority rule holds for that hub
- [x] The two `sk-code` `0.x` packet versions are recorded as independent, with their reason
- [x] The compiled route guard reports every hub fresh
- [x] The deep-loop suite exits zero
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| `sk-doc` authority resolved | Done | `2.1.0.0` shipped in the same commit that added `sk-create-with-human-voice`; no `v2.1*` entry exists in any branch, so the entry is authored |
| Both hubs at one version | Done | `sk-doc` 2.1.0.0 and `mcp-tooling` 1.6.1.0 across five artifacts each |
| `sk-code` `0.x` surfaces | Done | Recorded as independent: the standard gives nested packets their own anchors, and all six packets differ from the hub |
| Parity-gate absence recorded | Done | `frontmatter-versioning.md` §7 names what nothing enforces |
| Manifests re-minted | Done | Three hubs re-minted, authored twins byte-identical, guard exits 0 |

### Deviations and findings

| Item | Note |
|------|------|
| The task expected the `sk-code` `0.1.*` surfaces to be outliers, either aligned or justified as exceptions | Measured otherwise: **all six** `sk-code` packets differ from the hub's `4.2.2.0` and from each other, and the frontmatter standard gives every nested packet its own anchor. The `0.1.*` pair is one of two deliberate lines, not a gap against a hub-tracking majority. Nothing was aligned; the independence is recorded in `sk-code/SKILL.md`. |
| The task states no changelog entry explains the `sk-code` `0.1.*` gap | Measured otherwise for one of the two: `sk-code-mobile-cli/changelog/v0.1.7.1.md` §Versioning records the renumber explicitly. Only `sk-code-obsidian` lacked a statement, and it opened directly at `0.1.0.0` as an unreleased surface, which its changelog already describes. |
| A version bump was expected in `mcp-tooling`'s history to explain its registry/router lag | None found and none needed: the registry and router are followers here, not authorities, so raising them to the release is the whole fix. |
<!-- /ANCHOR:log -->
