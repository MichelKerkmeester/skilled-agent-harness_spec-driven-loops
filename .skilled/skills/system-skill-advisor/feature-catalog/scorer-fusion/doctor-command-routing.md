---
title: "Doctor Command Routing"
description: "Doctor routes from the doctor route manifest become advisor command bridges, so setup and health prompts surface a runnable /doctor:x line."
trigger_phrases:
  - "doctor command routing"
  - "doctor command bridges"
  - "runnable doctor command line"
  - "doctor setup hint"
  - "/doctor:setup"
version: 1.0.0.0
---

# Doctor Command Routing

## 1. OVERVIEW

Doctor routes from the doctor route manifest become advisor command bridges, so setup and health prompts surface a runnable /doctor:x line.

A passing skill keeps first place on a contested prompt and the doctor command shows as a second line. The Python fallback matches a doctor bridge only on a typed slash command.

---

## 2. HOW IT WORKS

### Bridge Generation

`derive-command-bridges.cjs` reads `.skilled/commands/doctor/_routes.yaml` as a third inventory source. Each route becomes one bridge `command-doctor-<command>-<target>`, or `command-doctor-<command>` when the command owns one route. Each standalone command becomes one bridge. The owning skill comes from the router's `skill_agent` tag. An entry in `scoring-compatibility.json` activates a bridge. The deriver fills the TypeScript keywords from the manifest's trigger phrases and the Python slash marker from the runnable string only. `/doctor:deep-loop` and the `/doctor:mcp` sub-actions stay inactive.

### Ranking

A doctor bridge passes only on its own wording, an explicit-author match on one of its manifest phrases or its runnable string. It never ranks above a passing skill unless the prompt types a doctor slash command. The Python native wrapper keeps the same order.

### Brief Text

The renderer reads a generated lookup of runnable strings, so a doctor bridge shows as `/doctor:git setup` and never as its raw id. An unmapped doctor id renders nothing. When a doctor bridge is the top pick it is the top line. When a skill is first and a doctor bridge also passes, the brief adds `Also: /doctor:<command> <target>` inside the same token cap. When nothing matches and the prompt uses setup, install, check or configure wording, the fallback adds one sentence naming `/doctor:setup`. The Claude hook computes that flag, because the renderer never reads prompt text.

### Reach Probe

`doctor-phrase-reach.cjs` scores every admitted phrase under the pinned regime and fails when a phrase reaches neither the top line nor the second line of its bridge. `/doctor:skill-advisor router-reach` runs it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/commands/doctor/_routes.yaml` | Script | Doctor route manifest and trigger phrases |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` | Script | Third inventory source, runtime fields and the renderer lookup block |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Script | Activation of each admitted doctor bridge |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Shared | Phrase-anchor rule and skill-first ordering |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | Shared | Runnable doctor line, second line and setup hint |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Handler | Setup-wording flag for the no-match hint |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Script | Python slash markers and the native wrapper order |
| `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | Script | Doctor reach probe |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor-routing-slice.vitest.ts` | Vitest | Doctor routing slice gate |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor-command-bridges.vitest.ts` | Vitest | Manifest-to-bridge parity |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-ordering.vitest.ts` | Vitest | Phrase anchor and skill-first ordering |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts` | Vitest | Runnable line, second line and sanitizer |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/doctor-setup-hint.vitest.ts` | Vitest | Setup hint on and off |
| `Playbook scenarios [DOC-385](../../manual-testing-playbook/doctor-commands/doctor-routing-setup-onboarding.md) to [DOC-391](../../manual-testing-playbook/doctor-commands/doctor-setup-run.md).` | Manual playbook | Agent-runnable end-to-end checks |

---

## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scorer-fusion/doctor-command-routing.md`

Related references:

- [projection.md](./projection.md) - Generated deep-loop routing projection, freshness hash guard and workflowMode publication.
- [ambiguity.md](./ambiguity.md) - Top-2 ambiguity window that returns an ambiguous brief when the top two candidates are within 0.05.
