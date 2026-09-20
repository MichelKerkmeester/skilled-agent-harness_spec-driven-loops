---
title: "Implementation Summary: Phase 9: Hub-Routing Guardrails"
description: "Hub routing is now stated in the always-loaded document, enumerated as a surface checklist, enforced by a new gate, and pointed at by a concise repo rule that fires on the wiring action."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/040-create-repo-rules/009-hub-routing-guardrails"
    last_updated_at: "2026-08-31T14:06:07Z"
    last_updated_by: "claude"
    recent_action: "Shipped the playbook, the README rewrite and the conformance fix"
    next_safe_action: "Commit the packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-hub-routing-guardrails"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 9: Hub-Routing Guardrails

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-hub-routing-guardrails |
| **Completed** | 2026-08-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A nested mode could be registered, pass every validator, and still be unreachable, with nothing to say so. Four changes close that: the always-loaded document now states how hub routing actually works, the doctrine document enumerates the surfaces, a gate catches the one surface nothing enforced, and a repo rule fires on the wiring action and routes to the detail.

### The clause in the always-loaded document

The gap it fills is specific. Nothing said a hub projects one advisor identity, so it was reasonable to assume the advisor should surface a nested mode by name and to treat its silence as a bug. The clause states the model, names the two stages, and forbids the claim that caused the trouble: reporting a mode as routed because a registry entry exists.

### The surface checklist

Adding a mode to an existing hub is a different act from authoring a hub, and only the second was documented. Section 7 lists ten surfaces with what breaks when each is missed, the replay commands for both stages, and the warning about broad aliases.

### Check 6b

The hub SKILL.md is the discovery surface a runtime shows when the advisor is unreachable, and nothing enforced that a registered mode appears in it. 6b does. It found three real gaps beyond the one that prompted it: two surface packets undocumented in `sk-code` and one transport in `mcp-tooling`.

### The repo rule

Concise and deliberately pointer-shaped: it carries the discipline, and the mechanics stay with the skills that own them.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` | Modified | The one-identity, two-stage clause and the pointer to the rule |
| `repo-rules/skill-hub-routing.md` | Created | 125-line rule firing on the wiring action |
| `REPO RULES.md` | Modified | Trigger row and index row; counts stay 9/9/9 |
| `parent-skills-nested-packets.md` | Modified | Section 7 checklist; later sections renumbered |
| `parent-skill-check.cjs` | Modified | Check 6b and the no-argument notice |
| `sk-code/SKILL.md` | Modified | Two surface rows, counts corrected to four |
| `mcp-tooling/SKILL.md` | Modified | The `mcp-magicpath` transport row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every claim was checked with a negative control rather than a passing run. That caught the worst defect in this phase: the first version of 6b matched the mode name anywhere in the file, so deleting the row still passed, because the name also sits in a keywords comment. The gate would have shipped looking correct and enforcing nothing. Tightening it to table rows made the control behave properly, failing on removal and passing on restore.

Blast radius was measured before the gate was written rather than after. `sk-code` was known to fail it; the tightened version then surfaced `mcp-tooling` too, which the looser scan had missed. Both were fixed from their own packet descriptions, so the gate lands green everywhere instead of carrying a warn-list.

The new rule was authored through `sk-create-repo-rule` itself, running its four decision tests before drafting.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put the model in the always-loaded document, not only in a reference | The wrong assumption was made by a reader who had never opened the reference. A clause that only the informed find does not prevent the failure |
| Keep the rule pointer-shaped | The mechanics belong to the skills that own them. Duplicating the surface list into a rule would create a second copy to go stale |
| Fix the hubs the new gate flags rather than warn-list them | A warn-listed gate reports and ships anyway, which is how enforcement rots |
| Match 6b on table rows, not the whole file | Proven necessary: the whole-file version passed its own negative control for the wrong reason |
| Leave three broad aliases alone | They match request shapes the hub genuinely serves, and the decision tests refuse the ones that do not qualify |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 6b negative control | FAIL on removal, PASS on restore |
| 6b fleet | PASS on all five hubs |
| Full `parent-skill-check` | 0 failures, 0 warnings on all five hubs |
| `ci-skill-root-metadata` | 14/14 |
| Rule structure | 125 lines (preferred), sections 6 = dividers 6 |
| Router counts | files 9, trigger rows 9, index rows 9 |
| Trigger phrases | 161 total, 161 distinct, 0 collisions |
| Advisor regression | Byte-identical to baseline |
| repo-rule package strict | PASS (unchanged) |
| Playbook fleet | 42 scanned, 0 fails (unchanged) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **6b asserts presence in the mode table, not accuracy or reachability.** It is deliberately row-level rather than first-cell, because four modes across two hubs are legitimately documented inside a neighbouring row's prose and first-cell matching reported those correct hubs as broken. The cost is that any mention within a row satisfies it.
2. **Three hub aliases stay deliberately broad.** `we should always`, `stop doing` and `trigger table` match request shapes the hub genuinely serves, and the decision tests refuse the ones that do not qualify.

Two limitations recorded here earlier are now closed. `sk-code-obsidian` and `sk-code-mobile-cli` were named in their hub's table and reachable by nothing; both now carry plugin-source vocabulary in `graph-metadata.json`, a stage-two intent with resolving leaves, and `description.json` keywords. The vocabulary is scoped to plugin source rather than vault operations, so `mcp-tooling` keeps every note-management query it owned: measured before and after, vault queries are byte-identical while plugin-source queries moved from `mcp-tooling` first to `sk-code` first. And `parent-skill-check-root-router.test.cjs` was red because its active-router fixture predated the RRC-009 prose-section rule; the fixture now carries the two sections the contract requires, and both suites pass.
<!-- /ANCHOR:limitations -->

---


