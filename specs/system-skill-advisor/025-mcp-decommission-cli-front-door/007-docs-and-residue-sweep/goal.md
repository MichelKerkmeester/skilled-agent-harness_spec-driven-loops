---
title: "Goal: Phase 7: docs-and-residue-sweep"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/025-mcp-decommission-cli-front-door/007-docs-and-residue-sweep"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Plan this phase against its completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-025-advisor-mcp-decommission"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: docs-and-residue-sweep

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Bring every advisor document to current reality and sweep the repository until no live surface describes an MCP server that no longer exists.

### Decisions

Frozen choices. Changing one is an amendment. The parent directive in
`../goal.md` outranks everything here; name a conflict rather than resolving it.

| ID | Decision |
|----|----------|
| D1 | Documents are rewritten to describe what ships. They are not annotated with what changed |
| D2 | Historical evidence is preserved: changelogs, dated benchmark reports, negative-guard tests and this packet's own documents keep retired strings |
| D3 | The sweep reports live hits and exemptions separately, and every exemption carries a written reason |
| D4 | The architecture document's diagram and topology are regenerated from the tree rather than edited around |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] Architecture, README, SKILL.md, install guide, feature catalog and manual-testing playbook describe the CLI front door and no MCP server
- [ ] The env reference and the env example carry no flag that served only the removed transport
- [ ] The residue sweep reports zero live hits, with every exemption listed and reasoned
- [ ] The skill's routing instructions tell a caller to use the CLI and show a working invocation
- [ ] AGENTS.md makes no claim that the advisor has a registered MCP transport, and its Gate 2 entry presents the CLI as the route rather than a fallback
- [ ] Every changed document passes its own documentation gate
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
| AGENTS.md touchpoints identified | Done | Exactly two. The Gate 2 fallback entry, whose command was run and works as written, but whose framing calls the CLI a fallback and whose Python-scorer path moves in the rename; and the MCP routing paragraph, which says the CLI is "not a replacement for the registered MCP transport" and becomes false at phase 5 |
| No new repo rule needed | Decided | `REPO RULES.md` scopes itself to posture and excludes skill routing, workflow selection and CLI dispatch mechanics. An advisor-routing rule is out of bounds by that document's own boundary, so the change belongs in AGENTS.md and the advisor's own SKILL.md |
| Phase planned | Done | `spec.md`, `plan.md` and the task scaffold exist, and the plan's execution protocol binds the phase |
| Phase executed | Done | Docs and residue sweep complete: retired tool ids 13 to 0, `MCP server` 115 to 12 with every survivor classified, 160 changed documents pass `validate_document.py`, the three rewritten procedures ran green from the final state, and the changelog was untouched. See `implementation-summary.md` |
| Env surfaces checked | Done | The env example and the live advisor env surface carry no flag that served only the removed transport; the spec-kit env reference still names retired advisor paths in its Source column and is recorded as an out-of-scope finding |
| Acceptance rows closed | Pending | `tasks.md` and `acceptance-criteria.md` still hold scaffold rows; the packet is not closed |

### Deviations and findings

| Item | Note |
|------|------|
| Scope boundary | The directed tranche is the skill directory only. Repo-wide `mcp-server/` references and the spec-kit env reference's retired advisor paths are checked and reported, not rewritten |
| Code defects raised, not fixed | `rename-invariants.vitest.ts` asserts the retired registration; `plugin-bridge.vitest.ts` and `plugin-bridge-smoke.vitest.ts` resolve the removed bridge; `system-skill-advisor-plugin.vitest.ts` fails 27 of 41 cases against its old mocked payload; the parity harness's MCP leg can no longer answer |
| Retained names | MCP-named directories, routed leaves and most `mcp` trigger aliases stay by decision so generated manifests, resource maps and the trigger index keep resolving |
| Found by running the procedures | About thirty authored steps still used pseudo-call syntax after the first sweep, and the disable-flag procedure needed database plus socket isolation and a focused plugin test to be deterministic |
<!-- /ANCHOR:log -->
