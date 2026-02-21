---
description: "How the 3-level documentation system (CORE + ADDENDUM) scales by complexity using template levels, quality validation, and configuration-aware rollout gates."
---
# Progressive Enhancement Levels

### 3-Level Progressive Enhancement (CORE + ADDENDUM v2.2)

Higher levels ADD VALUE, not just length. Each level builds on the previous:

```
Level 1 (Core):         Essential what/why/how (~455 LOC)
         ↓ +Verify
Level 2 (Verification): +Quality gates, NFRs, edge cases (~875 LOC)
         ↓ +Arch
Level 3 (Full):         +Architecture decisions, ADRs, risk matrix (~1090 LOC)
         ↓ +Govern
Level 3+ (Extended):    +Enterprise governance, AI protocols (~1075 LOC)
```

| Level  | LOC Guidance | Required Files                                        | What It ADDS                                |
| ------ | ------------ | ----------------------------------------------------- | ------------------------------------------- |
| **1**  | <100         | spec.md, plan.md, tasks.md, implementation-summary.md | Essential what/why/how                      |
| **2**  | 100-499      | Level 1 + checklist.md                                | Quality gates, verification, NFRs           |
| **3**  | ≥500         | Level 2 + decision-record.md                          | Architecture decisions, ADRs                |
| **3+** | Complex      | Level 3 + extended content                            | Governance, approval workflow, AI protocols |

**Level Selection Examples:**

| Task                 | LOC Est. | Level | Rationale                      |
| -------------------- | -------- | ----- | ------------------------------ |
| Fix CSS alignment    | 10       | 1     | Simple, low risk               |
| Add form validation  | 80       | 1-2   | Borderline, low complexity     |
| Modal component      | 200      | 2     | Multiple files, needs QA       |
| Auth system refactor | 600      | 3     | Architecture change, high risk |
| Database migration   | 150      | 3     | High risk overrides LOC        |

**Override Factors (can push to higher level):**
- High complexity or architectural changes
- Risk (security, config cascades, authentication)
- Multiple systems affected (>5 files)
- Integration vs unit test requirements

**Decision rule:** When in doubt → choose higher level. Better to over-document than under-document.

## Cross-Skill Bridges

- [Document Quality Mode](../../sk-documentation/nodes/mode-document-quality.md) - Quality and DQI workflows by document type
- [Language Detection](../../sk-code--opencode/nodes/language-detection.md) - TypeScript/Python config detection for implementation context
- [Web Quick Reference](../../sk-code--web/nodes/quick-reference.md) - CSS/layout/API verification and deployment cues
