---
title: "Goal: Phase 2: hub-scaffold-and-mode-migration"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "cli-jev hub"
  - "cli-usage mode"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/002-cli-jev-hub-migration/002-hub-scaffold-and-mode-migration"
    last_updated_at: "2026-09-20T14:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Hub authored and validated; mode moved to cli-usage and retagged; reviewers triaged"
    next_safe_action: "Run phase 003: decouple the old hub and rewire dispatch, hooks and rosters"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-002-hub-scaffold-and-mode-migration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: hub-scaffold-and-mode-migration

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** `.skilled/skills/cli-jev/` is a hub of its own, and the Jev transport
answers from it as the `cli-usage` mode.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The hub is authored before the mode moves, so no state leaves the packet unreachable |
| D2 | The mode's routing id is `cli-usage`; `cli-jev` survives as the hub id, a mode alias and the dispatch display name, so recorded assertions that name `cli-jev` stay true |
| D3 | The `transport-axis` extension moves with the packet into the hub that now owns the transported mode |
| D4 | The old hub keeps its registration until phase 003; the interim dangling packet is recorded, not hidden |
| D5 | The hub carries the compiled-routing markers while its manifest stays absent, so readiness reports legacy rather than failing |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes,
resend this file's chat slice so the operator can update their copy. A child goal
change that alters a parent decision or criterion is an amendment to the parent:
apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 2. COMPLETION CRITERIA

- [x] `.skilled/skills/cli-jev` declares the registry pair and passes the doctor at 0 warnings
- [x] The mode answers as `cli-usage` from `.skilled/skills/cli-jev/cli-usage`, with the packet renamed and history preserved
- [x] The packet's own docs name the new home, and no path in them resolves as if it lived under the old hub
- [x] The hub's playbook and benchmark exist, and the compiled route reports the documented legacy sentinel
- [x] Two dispatched reviewers are triaged: six findings fixed in place, two assigned to phase 003 with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 3. LOG

Everything below is VOLATILE. It is not part of the directive and it is expected to grow.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Hub artifacts authored | Done | `parent-skill-check.cjs .skilled/skills/cli-jev` exit 0, 42 `PASS`, 0 warnings |
| Mode moved and retagged | Done | `.skilled/skills/cli-external-orchestration/cli-jev` absent; packet frontmatter `name: cli-usage`; registry `packetKind: transport` |
| Package shape | Done | `validate_skill_package.py .skilled/skills/cli-jev --strict` exit 0 on all three sub-checks |
| Leaf manifest | Done | `leaf-manifest.json written (12ad558a…)`, one `cli-usage` mode entry with five leaves |
| Serving state | Done | `compiled-route.cjs --hub cli-jev` → `{"servingAuthority":"legacy","hubId":"cli-jev"}` |
| Reviewer window | Done | glm-5.3-flash and deepseek-v4.1-flash, read-only; eight defects, six fixed, two assigned to phase 003 |

### Deviations and findings

| Item | Note |
|------|------|
| The scaffolder ran as a workflow, not as a persona dispatch | `/create:skill-parent` hard-blocks without the `@markdown` persona, which a non-interactive orchestrator session cannot adopt, so its six steps ran directly against its own assets and the sk-doc parent-skill templates |
| The mode's reference pages took Jev-domain titles | They document an external tool surface rather than the packet's routing identity, which the packet-level docs carry |
| The old hub's doctor run fails `3c` on purpose until phase 003 | Two registries name one packet in the interim; the failure is the visible proof, and phase 003 removes the row |
| The dispatch chain still reads the retired packet path | Verified live: a declared `severity: error` violation is approved at preflight. Phase 003 repoints `packetPath` and the test root |
| The five phase goal files were scaffold placeholders | One was authored for this phase and one for the closed phase 001; phases 003 to 005 keep theirs until they run |
<!-- /ANCHOR:log -->

---
