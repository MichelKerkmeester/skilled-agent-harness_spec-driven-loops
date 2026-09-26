# Routing measurement — BEFORE (baseline)

Measurement record for the hub-routing integration work. Every row below ran
through both routing stages before any hub file was edited.

## Setup evidence (T001 / T002)

- Phase 006 conformance gate re-run before edits: `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs` -> 8/8 pass (the positive
  fixture passes every named check; each negative fixture fails only for its
  named reason). Exit 0.
- Pre-change hub counts: 14 modes across 13 packets.
- Backup of the seven hub surfaces plus the canary fixture, `cp -p`, outside the
  repository: `/tmp/007-hub-backup/` (mode-registry.json, hub-router.json,
  ROUTER.md, graph-metadata.json, description.json, SKILL.md, leaf-manifest.json,
  canary-cases.v1.json).
- Alias source (the mode packet's single `Keyword triggers:` line, read without
  editing the packet): `create packet goal`, `author goal.md`, `revise packet
  goal`, `phase parent goal`, `nested phase child goal`, `add a goal file`,
  `goal chat slice`, `/create:goal`.
- On-disk packet leaves (references/ + assets/ walk): `assets/goal-exemplars.md`,
  `references/README.md`, `references/authoring-standards.md`,
  `references/budget-and-handoff.md`, `references/parent-and-nested-goals.md`.

## Commands

For each prompt P in the corpus:

1. `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<P>"}' --format json`
2. `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt "<P>"`

Corpus: the ten fixed newcomer prompts (plan.md testing section), the six fixed
out-of-domain probes, and the two sibling-owned controls.

## Observed summary

Newcomer prompts reaching `sk-create-goal` at either stage: **0 / 10**.
Out-of-domain probes reaching `sk-create-goal`: **0 / 6**.

| # | Prompt | advisor top (score) | compiled-route |
|---|--------|---------------------|----------------|
| N1 | Write the goal document for this spec packet and make its completion checks testable. | system-spec-kit (0.61), sk-doc (0.31) | defer, targets [] |
| N2 | Turn this feature spec into a durable objective and three to seven standalone completion checks. | (no recommendation above floor) | defer, targets [] |
| N3 | Draft the phase parent's directive and a complete list of phase-child goal files. | system-spec-kit (0.04) | defer, targets [] |
| N4 | Create a phase-child goal from this phase specification. | system-spec-kit (0.17) | defer, targets [] |
| N5 | Our packet has no goal document. Write one that states purpose and measurable criteria. | system-spec-kit (0.52), sk-doc (0.23) | defer, targets [] |
| N6 | Make the goal criteria checkable without inspecting other files. | (none) | defer, targets [] |
| N7 | Write an objective for a packet that will author new documentation. | sk-doc (0.79) | defer, targets [] |
| N8 | Create the parent objective for this phase plan with a complete child-phase goal list. | system-spec-kit (0.23) | defer, targets [] |
| N9 | Write the goal document for a nested sub-phase. | sk-doc (0.31) | defer, targets [] |
| N10 | Derive a concise phase objective and exit criteria from its spec. | system-spec-kit (0.15) | defer, targets [] |
| P1 | Set the goal for this session. | system-spec-kit (0.30) | defer, targets [] |
| P2 | Bind the goal to this session. | system-spec-kit (0.26) | defer, targets [] |
| P3 | Update the goal for the current session. | system-spec-kit (0.24) | defer, targets [] |
| P4 | Resend the goal. | (none) | defer, targets [] |
| P5 | How do I use /goal-opencode? | sk-code (0.74) | defer, targets [] |
| P6 | Read a packet with /goal-cursor. | system-spec-kit (0.54) | defer, targets [] |
| C1 | Create an OpenCode agent with agent frontmatter and a permission object. | sk-doc (0.73) | route -> sk-create-agent |
| C2 | Write release notes since the last version. | sk-doc (0.72) | route -> sk-create-changelog |

All 36 invocations exited 0 (both CLIs). The sibling controls already resolve to
their own modes at stage two, which is the pre-change state the after run must
retain.

## Full per-prompt command records

The complete output of every invocation (advisor recommendation slice with
skillId/score/confidence/compiled-route targets and the compiled-route decision
JSON, plus each exit code) follows.

### [NEWCOMER 1] Write the goal document for this spec packet and make its completion checks testable.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "system-spec-kit",
    "score": 0.60563,
    "confidence": 0.8455,
    "compiledRoute": null
  },
  {
    "skillId": "sk-doc",
    "score": 0.31496,
    "confidence": 0.82,
    "compiledRoute": {
      "targets": [],
      "action": "defer"
    }
  },
  {
    "skillId": "mcp-tooling",
    "score": 0.183454,
    "confidence": 0.82,
    "compiledRoute": {
      "targets": [],
      "action": "defer"
    }
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 2] Turn this feature spec into a durable objective and three to seven standalone completion checks.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 3] Draft the phase parent's directive and a complete list of phase-child goal files.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "system-spec-kit",
    "score": 0.0406,
    "confidence": 0.82,
    "compiledRoute": null
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 4] Create a phase-child goal from this phase specification.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "system-spec-kit",
    "score": 0.174892,
    "confidence": 0.82,
    "compiledRoute": null
  },
  {
    "skillId": "sk-git",
    "score": 0.074813,
    "confidence": 0.82,
    "compiledRoute": null
  },
  {
    "skillId": "mcp-tooling",
    "score": 0.067667,
    "confidence": 0.82,
    "compiledRoute": {
      "targets": [],
      "action": "defer"
    }
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 5] Our packet has no goal document. Write one that states purpose and measurable criteria.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "system-spec-kit",
    "score": 0.515465,
    "confidence": 0.82,
    "compiledRoute": null
  },
  {
    "skillId": "sk-doc",
    "score": 0.234552,
    "confidence": 0.82,
    "compiledRoute": {
      "targets": [],
      "action": "defer"
    }
  },
  {
    "skillId": "sk-design",
    "score": 0.208288,
    "confidence": 0.82,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "surface-router",
          "packetId": "sk-design-fundamentals",
          "packetKind": "workflow",
          "skillId": "sk-design",
          "workflowMode": "sk-design-fundamentals"
        }
      ],
      "action": "route"
    }
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 6] Make the goal criteria checkable without inspecting other files.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 7] Write an objective for a packet that will author new documentation.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "sk-doc",
    "score": 0.792278,
    "confidence": 0.9458,
    "compiledRoute": {
      "targets": [],
      "action": "defer"
    }
  },
  {
    "skillId": "system-spec-kit",
    "score": 0.541736,
    "confidence": 0.82,
    "compiledRoute": null
  },
  {
    "skillId": "sk-design",
    "score": 0.161,
    "confidence": 0.82,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "surface-router",
          "packetId": "sk-design-fundamentals",
          "packetKind": "workflow",
          "skillId": "sk-design",
          "workflowMode": "sk-design-fundamentals"
        }
      ],
      "action": "route"
    }
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 8] Create the parent objective for this phase plan with a complete child-phase goal list.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "system-spec-kit",
    "score": 0.22527,
    "confidence": 0.82,
    "compiledRoute": null
  },
  {
    "skillId": "mcp-tooling",
    "score": 0.1246,
    "confidence": 0.82,
    "compiledRoute": {
      "targets": [],
      "action": "defer"
    }
  },
  {
    "skillId": "sk-doc",
    "score": 0.094432,
    "confidence": 0.82,
    "compiledRoute": {
      "targets": [],
      "action": "defer"
    }
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 9] Write the goal document for a nested sub-phase.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "sk-doc",
    "score": 0.306293,
    "confidence": 0.82,
    "compiledRoute": {
      "targets": [],
      "action": "defer"
    }
  },
  {
    "skillId": "system-spec-kit",
    "score": 0.21775,
    "confidence": 0.82,
    "compiledRoute": null
  },
  {
    "skillId": "sk-design",
    "score": 0.217563,
    "confidence": 0.82,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "surface-router",
          "packetId": "sk-design-fundamentals",
          "packetKind": "workflow",
          "skillId": "sk-design",
          "workflowMode": "sk-design-fundamentals"
        }
      ],
      "action": "route"
    }
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 10] Derive a concise phase objective and exit criteria from its spec.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "system-spec-kit",
    "score": 0.152363,
    "confidence": 0.82,
    "compiledRoute": null
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

### [PROBE 1] Set the goal for this session.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "system-spec-kit",
    "score": 0.297414,
    "confidence": 0.82,
    "compiledRoute": null
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

### [PROBE 2] Bind the goal to this session.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "system-spec-kit",
    "score": 0.262014,
    "confidence": 0.82,
    "compiledRoute": null
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

### [PROBE 3] Update the goal for the current session.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "system-spec-kit",
    "score": 0.2443,
    "confidence": 0.82,
    "compiledRoute": null
  },
  {
    "skillId": "cli-external-orchestration",
    "score": 0.104206,
    "confidence": 0.82,
    "compiledRoute": {
      "targets": [],
      "action": "defer"
    }
  },
  {
    "skillId": "memory:save",
    "score": 0.07,
    "confidence": 0.82,
    "compiledRoute": null
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

### [PROBE 4] Resend the goal.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

### [PROBE 5] How do I use /goal-opencode?

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "cli-external-orchestration",
    "score": 0.171599,
    "confidence": 0.95,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "cli-dispatch",
          "packetId": "cli-opencode",
          "packetKind": "workflow",
          "skillId": "cli-external-orchestration",
          "workflowMode": "cli-opencode"
        }
      ],
      "action": "route"
    }
  },
  {
    "skillId": "sk-code",
    "score": 0.741683,
    "confidence": 0.88,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "evidence-base",
          "packetId": "sk-code-opencode",
          "packetKind": "surface",
          "skillId": "sk-code",
          "workflowMode": "sk-code-opencode"
        }
      ],
      "action": "route"
    }
  },
  {
    "skillId": "system-spec-kit",
    "score": 0.2092,
    "confidence": 0.82,
    "compiledRoute": null
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

### [PROBE 6] Read a packet with /goal-cursor.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "cli-external-orchestration",
    "score": 0.152444,
    "confidence": 0.95,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "cli-dispatch",
          "packetId": "cli-cursor",
          "packetKind": "workflow",
          "skillId": "cli-external-orchestration",
          "workflowMode": "cli-cursor"
        }
      ],
      "action": "route"
    }
  },
  {
    "skillId": "system-spec-kit",
    "score": 0.535222,
    "confidence": 0.82,
    "compiledRoute": null
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

### [CONTROL 1] Create an OpenCode agent with agent frontmatter and a permission object.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "sk-doc",
    "score": 0.732469,
    "confidence": 0.9137,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "template-scaffold",
          "packetId": "sk-create-agent",
          "packetKind": "workflow",
          "skillId": "sk-doc",
          "workflowMode": "sk-create-agent"
        }
      ],
      "action": "route"
    }
  },
  {
    "skillId": "sk-code",
    "score": 0.677679,
    "confidence": 0.8843,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "evidence-base",
          "packetId": "sk-code-opencode",
          "packetKind": "surface",
          "skillId": "sk-code",
          "workflowMode": "sk-code-opencode"
        }
      ],
      "action": "route"
    }
  },
  {
    "skillId": "system-spec-kit",
    "score": 0.206412,
    "confidence": 0.82,
    "compiledRoute": null
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-agent","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-agent"}],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

### [CONTROL 2] Write release notes since the last version.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "sk-doc",
    "score": 0.719382,
    "confidence": 0.9067,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "template-scaffold",
          "packetId": "sk-create-changelog",
          "packetKind": "workflow",
          "skillId": "sk-doc",
          "workflowMode": "sk-create-changelog"
        }
      ],
      "action": "route"
    }
  },
  {
    "skillId": "system-spec-kit",
    "score": 0.157233,
    "confidence": 0.82,
    "compiledRoute": null
  },
  {
    "skillId": "sk-design",
    "score": 0.132328,
    "confidence": 0.82,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "surface-router",
          "packetId": "sk-design-fundamentals",
          "packetKind": "workflow",
          "skillId": "sk-design",
          "workflowMode": "sk-design-fundamentals"
        }
      ],
      "action": "route"
    }
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-changelog","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-changelog"}],"effectivePolicyHash":"2c56c1ebe8f04aa0fe515261bd83a828658f63fb2861060bfa41f567b35399db","generation":5}
```
- compiled-route exit: 0

