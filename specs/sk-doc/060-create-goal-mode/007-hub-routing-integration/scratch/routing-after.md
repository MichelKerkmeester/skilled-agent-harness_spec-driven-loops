# Routing measurement — AFTER (post-registration)

Same corpus, same two commands per prompt, run after the hub registration, the
leaf-manifest regeneration and the compiled-routing publication.

Commands per prompt:

1. `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<P>"}' --format json`
2. `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt "<P>"`

## Observed summary

Newcomer prompts whose compiled-route target is `sk-create-goal`: **10 / 10**
(before: 0 / 10). Advisor top skill is `sk-doc` for 9 of 10 (N3's stage-one top
is system-spec-kit at 0.076; its stage-two hub route still selects
`sk-create-goal`).

Out-of-domain probes reaching `sk-create-goal` at either stage: **0 / 6**
(compiled-route returns `defer` with zero targets for all six).

Sibling controls retain their routes: `sk-create-agent` and `sk-create-changelog`.

Positive goal-authoring requests (own corpus): all four route to `sk-create-goal`.

| # | Prompt | advisor top (score) | compiled-route |
|---|--------|---------------------|----------------|
| N1 | Write the goal document for this spec packet and make its completion checks testable. | sk-doc (0.83) | route -> sk-create-goal |
| N2 | Turn this feature spec into a durable objective and three to seven standalone completion checks. | sk-doc (0.61) | route -> sk-create-goal |
| N3 | Draft the phase parent's directive and a complete list of phase-child goal files. | system-spec-kit (0.08) | route -> sk-create-goal |
| N4 | Create a phase-child goal from this phase specification. | sk-doc (0.67) | route -> sk-create-goal |
| N5 | Our packet has no goal document. Write one that states purpose and measurable criteria. | sk-doc (0.82) | route -> sk-create-goal |
| N6 | Make the goal criteria checkable without inspecting other files. | sk-doc (0.63) | route -> sk-create-goal |
| N7 | Write an objective for a packet that will author new documentation. | sk-doc (0.81) | route -> sk-create-goal |
| N8 | Create the parent objective for this phase plan with a complete child-phase goal list. | sk-doc (0.64) | route -> sk-create-goal |
| N9 | Write the goal document for a nested sub-phase. | sk-doc (0.78) | route -> sk-create-goal |
| N10 | Derive a concise phase objective and exit criteria from its spec. | sk-doc (0.58) | route -> sk-create-goal |
| P1 | Set the goal for this session. | system-spec-kit (0.31) | defer, targets [] |
| P2 | Bind the goal to this session. | system-spec-kit (0.28) | defer, targets [] |
| P3 | Update the goal for the current session. | system-spec-kit (0.25), sk-doc (0.11) | defer, targets [] |
| P4 | Resend the goal. | (none) | defer, targets [] |
| P5 | How do I use /goal-opencode? | sk-code (0.74) | defer, targets [] |
| P6 | Read a packet with /goal-cursor. | system-spec-kit (0.54) | defer, targets [] |
| C1 | Create an OpenCode agent with agent frontmatter and a permission object. | sk-doc (0.74) | route -> sk-create-agent |
| C2 | Write release notes since the last version. | sk-doc (0.72) | route -> sk-create-changelog |
| X1 | Create a packet goal for this spec packet with three to seven completion criteria. | system-spec-kit (0.79), sk-doc (0.67) | route -> sk-create-goal |
| X2 | Author goal.md for the phase parent and list every phase-child goal in its binding table. | system-spec-kit (0.06) | route -> sk-create-goal |
| X3 | Draft a goal document for the nested phase child packet. | sk-doc (0.79) | route -> sk-create-goal |
| X4 | Revise packet goal for specs/sk-doc/060-create-goal-mode and cut it under the 4000-character budget. | sk-doc (0.71) | route -> sk-create-goal |

All 44 invocations exited 0 (both CLIs). Full per-prompt command records follow.

## Full per-prompt command records

### [NEWCOMER 1] Write the goal document for this spec packet and make its completion checks testable.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "sk-doc",
    "score": 0.829029,
    "confidence": 0.95,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "template-scaffold",
          "packetId": "sk-create-goal",
          "packetKind": "workflow",
          "skillId": "sk-doc",
          "workflowMode": "sk-create-goal"
        }
      ],
      "action": "route"
    }
  },
  {
    "skillId": "system-spec-kit",
    "score": 0.606402,
    "confidence": 0.8459,
    "compiledRoute": null
  },
  {
    "skillId": "mcp-tooling",
    "score": 0.183452,
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
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-goal","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-goal"}],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 2] Turn this feature spec into a durable objective and three to seven standalone completion checks.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "sk-doc",
    "score": 0.613492,
    "confidence": 0.8498,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "template-scaffold",
          "packetId": "sk-create-goal",
          "packetKind": "workflow",
          "skillId": "sk-doc",
          "workflowMode": "sk-create-goal"
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
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-goal","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-goal"}],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 3] Draft the phase parent's directive and a complete list of phase-child goal files.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "system-spec-kit",
    "score": 0.07635,
    "confidence": 0.82,
    "compiledRoute": null
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-goal","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-goal"}],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 4] Create a phase-child goal from this phase specification.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "sk-doc",
    "score": 0.666009,
    "confidence": 0.878,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "template-scaffold",
          "packetId": "sk-create-goal",
          "packetKind": "workflow",
          "skillId": "sk-doc",
          "workflowMode": "sk-create-goal"
        }
      ],
      "action": "route"
    }
  },
  {
    "skillId": "system-spec-kit",
    "score": 0.21062,
    "confidence": 0.82,
    "compiledRoute": null
  },
  {
    "skillId": "sk-git",
    "score": 0.09301,
    "confidence": 0.82,
    "compiledRoute": null
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-goal","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-goal"}],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 5] Our packet has no goal document. Write one that states purpose and measurable criteria.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "sk-doc",
    "score": 0.824173,
    "confidence": 0.95,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "template-scaffold",
          "packetId": "sk-create-goal",
          "packetKind": "workflow",
          "skillId": "sk-doc",
          "workflowMode": "sk-create-goal"
        }
      ],
      "action": "route"
    }
  },
  {
    "skillId": "system-spec-kit",
    "score": 0.525594,
    "confidence": 0.82,
    "compiledRoute": null
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
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-goal","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-goal"}],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 6] Make the goal criteria checkable without inspecting other files.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "sk-doc",
    "score": 0.633706,
    "confidence": 0.8606,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "template-scaffold",
          "packetId": "sk-create-goal",
          "packetKind": "workflow",
          "skillId": "sk-doc",
          "workflowMode": "sk-create-goal"
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
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-goal","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-goal"}],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 7] Write an objective for a packet that will author new documentation.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "sk-doc",
    "score": 0.81295,
    "confidence": 0.95,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "template-scaffold",
          "packetId": "sk-create-goal",
          "packetKind": "workflow",
          "skillId": "sk-doc",
          "workflowMode": "sk-create-goal"
        }
      ],
      "action": "route"
    }
  },
  {
    "skillId": "system-spec-kit",
    "score": 0.541733,
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
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-goal","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-goal"}],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 8] Create the parent objective for this phase plan with a complete child-phase goal list.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "sk-doc",
    "score": 0.636927,
    "confidence": 0.8623,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "template-scaffold",
          "packetId": "sk-create-goal",
          "packetKind": "workflow",
          "skillId": "sk-doc",
          "workflowMode": "sk-create-goal"
        }
      ],
      "action": "route"
    }
  },
  {
    "skillId": "system-spec-kit",
    "score": 0.252241,
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
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-goal","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-goal"}],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 9] Write the goal document for a nested sub-phase.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "sk-doc",
    "score": 0.777901,
    "confidence": 0.9381,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "template-scaffold",
          "packetId": "sk-create-goal",
          "packetKind": "workflow",
          "skillId": "sk-doc",
          "workflowMode": "sk-create-goal"
        }
      ],
      "action": "route"
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
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-goal","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-goal"}],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [NEWCOMER 10] Derive a concise phase objective and exit criteria from its spec.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "sk-doc",
    "score": 0.576356,
    "confidence": 0.8298,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "template-scaffold",
          "packetId": "sk-create-goal",
          "packetKind": "workflow",
          "skillId": "sk-doc",
          "workflowMode": "sk-create-goal"
        }
      ],
      "action": "route"
    }
  },
  {
    "skillId": "system-spec-kit",
    "score": 0.174098,
    "confidence": 0.82,
    "compiledRoute": null
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-goal","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-goal"}],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [PROBE 1] Set the goal for this session.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "system-spec-kit",
    "score": 0.309294,
    "confidence": 0.82,
    "compiledRoute": null
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [PROBE 2] Bind the goal to this session.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "system-spec-kit",
    "score": 0.279269,
    "confidence": 0.82,
    "compiledRoute": null
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [PROBE 3] Update the goal for the current session.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "system-spec-kit",
    "score": 0.253202,
    "confidence": 0.82,
    "compiledRoute": null
  },
  {
    "skillId": "sk-doc",
    "score": 0.106426,
    "confidence": 0.82,
    "compiledRoute": {
      "targets": [],
      "action": "defer"
    }
  },
  {
    "skillId": "cli-external-orchestration",
    "score": 0.104194,
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
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
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
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [PROBE 5] How do I use /goal-opencode?

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "cli-external-orchestration",
    "score": 0.171593,
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
    "score": 0.741656,
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
    "skillId": "sk-doc",
    "score": 0.223699,
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
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [PROBE 6] Read a packet with /goal-cursor.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "cli-external-orchestration",
    "score": 0.152437,
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
    "score": 0.544154,
    "confidence": 0.82,
    "compiledRoute": null
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [CONTROL 1] Create an OpenCode agent with agent frontmatter and a permission object.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "sk-doc",
    "score": 0.735535,
    "confidence": 0.9154,
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
    "score": 0.677651,
    "confidence": 0.8842,
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
    "score": 0.20639,
    "confidence": 0.82,
    "compiledRoute": null
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-agent","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-agent"}],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [CONTROL 2] Write release notes since the last version.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "sk-doc",
    "score": 0.720661,
    "confidence": 0.9074,
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
    "score": 0.132324,
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
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-changelog","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-changelog"}],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [POSITIVE 1] Create a packet goal for this spec packet with three to seven completion criteria.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "system-spec-kit",
    "score": 0.792079,
    "confidence": 0.9457,
    "compiledRoute": null
  },
  {
    "skillId": "sk-doc",
    "score": 0.671478,
    "confidence": 0.8809,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "template-scaffold",
          "packetId": "sk-create-goal",
          "packetKind": "workflow",
          "skillId": "sk-doc",
          "workflowMode": "sk-create-goal"
        }
      ],
      "action": "route"
    }
  },
  {
    "skillId": "sk-code",
    "score": 0.143878,
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
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-goal","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-goal"}],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [POSITIVE 2] Author goal.md for the phase parent and list every phase-child goal in its binding table.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "system-spec-kit",
    "score": 0.059083,
    "confidence": 0.82,
    "compiledRoute": null
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-goal","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-goal"}],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [POSITIVE 3] Draft a goal document for the nested phase child packet.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "sk-doc",
    "score": 0.794335,
    "confidence": 0.947,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "template-scaffold",
          "packetId": "sk-create-goal",
          "packetKind": "workflow",
          "skillId": "sk-doc",
          "workflowMode": "sk-create-goal"
        }
      ],
      "action": "route"
    }
  },
  {
    "skillId": "system-spec-kit",
    "score": 0.51765,
    "confidence": 0.82,
    "compiledRoute": null
  }
]
```
- advisor exit: 0
- compiled-route cmd: `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt <prompt>`
```json
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-goal","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-goal"}],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

### [POSITIVE 4] Revise packet goal for specs/sk-doc/060-create-goal-mode and cut it under the 4000-character budget.

- advisor cmd: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":<prompt>}' --format json`
```json
[
  {
    "skillId": "sk-doc",
    "score": 0.710828,
    "confidence": 0.9021,
    "compiledRoute": {
      "targets": [
        {
          "backendKind": "template-scaffold",
          "packetId": "sk-create-goal",
          "packetKind": "workflow",
          "skillId": "sk-doc",
          "workflowMode": "sk-create-goal"
        }
      ],
      "action": "route"
    }
  },
  {
    "skillId": "system-spec-kit",
    "score": 0.547362,
    "confidence": 0.82,
    "compiledRoute": null
  },
  {
    "skillId": "sk-code",
    "score": 0.120267,
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
{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"backendKind":"template-scaffold","packetId":"sk-create-goal","packetKind":"workflow","skillId":"sk-doc","workflowMode":"sk-create-goal"}],"effectivePolicyHash":"d88fd60a9153c7759628bc95cf456afb6b48ed8c19b4a99dcc1dcd860cfbcad5","generation":5}
```
- compiled-route exit: 0

