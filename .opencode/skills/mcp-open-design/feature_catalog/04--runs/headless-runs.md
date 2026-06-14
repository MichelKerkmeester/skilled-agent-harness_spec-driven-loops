---
title: "Headless runs and mutating verbs"
description: "Commission Open Design generation headlessly with start_run, and gate every mutating or destructive verb behind confirmation, an explicit target, and a rollback note."
trigger_phrases:
  - "commission open design run"
  - "start_run open design"
  - "headless generation"
  - "od automation"
  - "gated mutating verb"
importance_tier: "important"
---

# Headless runs and mutating verbs (start_run / get_run / get_artifact)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Commissions Open Design to spawn its own inner agent and build, the headless equivalent of the chat box, then fetches what it produced. This is the run direction, and it is gated.

Generation and the other write verbs are the powerful half of the skill, so every one of them is a stop-and-confirm point. A run is described to the user with its effect and its rollback before it is launched, and a destructive verb needs more than that.

---

## 2. HOW IT WORKS

### Commission a run and fetch the artifact

`start_run(prompt, [skill], [agent], ...)` commissions a generation run. The agent then polls `get_run(runId)` until the run finishes and fetches output with `get_artifact`. Other headless mutating verbs from the CLI include `od automation` (schedule or fire routines), `od ui respond` (answer a run's GenUI prompt headlessly), `od artifacts create`, and `od media generate`.

### The surface, gate, and omit policy

Mutating verbs are surfaced but gated: each requires explicit user confirmation, an explicit target project or name, and a one-line rollback note before it runs. This covers `create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, and the `od artifacts`, `media`, `automation`, `ui`, `memory`, and `plugin` write verbs. Destructive verbs `delete_file` and `delete_project` are stricter still: they require `confirm:true` plus user approval and are never reached through the active-project fallback. Some verbs can return an auth error, since local reads work without a cloud account but generation, media, research, and plugin-publish may need a `vela login` or configured providers. The skill surfaces that requirement and never pastes credentials into prompts.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/tool_surface.md` | Shared | The mutating and destructive verbs and the gating policy |
| `references/od_cli_reference.md` | Shared | CLI verb surface with mutating classification |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/03--gated-runs/gated-verb-confirm.md` | Manual playbook | A gated verb requires confirmation, with an unconfirmed negative control |

---

## 4. SOURCE METADATA

- Group: Headless Runs
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--runs/headless-runs.md`

Related references:
- [design-system-grounding.md](../03--grounding/design-system-grounding.md) covers grounding a run in a resolved system
- [daemon-and-verification.md](../05--transport/daemon-and-verification.md) covers verifying a verb exists and its mutation class
