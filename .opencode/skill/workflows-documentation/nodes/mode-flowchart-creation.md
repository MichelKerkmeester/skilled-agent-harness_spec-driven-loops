---
description: "Patterns and syntax for generating ASCII flowcharts for workflows and decision trees."
---
# Flowchart Creation Mode

### Mode 3: Flowchart Creation

**Building Blocks**:
```text
Process Box:        Decision Diamond:     Terminal:
┌─────────────┐         ╱──────╲           ╭─────────╮
│   Action    │        ╱ Test?  ╲          │  Start  │
└─────────────┘        ╲        ╱          ╰─────────╯
                        ╲──────╱
```

**Flow Control**:
```text
Standard Flow:      Branch:           Parallel:         Merge:
     │              │   │   │         ┌────┬────┐         │
     ▼              ▼   ▼   ▼         │    │    │      ───┴───
                                      ▼    ▼    ▼         │
```

**7 Core Patterns**:

| Pattern              | Use Case                       | Reference File                    |
| -------------------- | ------------------------------ | --------------------------------- |
| 1: Linear Sequential | Step-by-step without branching | `simple_workflow.md`              |
| 2: Decision Branch   | Binary or multi-way decisions  | `decision_tree_flow.md`           |
| 3: Parallel          | Multiple tasks run together    | `parallel_execution.md`           |
| 4: Nested            | Embedded sub-workflows         | `user_onboarding.md`              |
| 5: Approval Gate     | Review/approval required       | `approval_workflow_loops.md`      |
| 6: Loop/Iteration    | Repeat until condition met     | `approval_workflow_loops.md`      |
| 7: Pipeline          | Sequential stages with gates   | `system_architecture_swimlane.md` |

**Workflow**: Select pattern → Build with components → Validate (`validate_flowchart.sh`) → Document

---

