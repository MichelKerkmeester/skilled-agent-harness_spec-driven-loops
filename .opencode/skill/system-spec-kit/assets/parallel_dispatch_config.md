---
title: Parallel Dispatch Configuration
description: Complexity scoring and agent dispatch configuration for parallel task execution.
---

# Parallel Dispatch Configuration

Configuration for smart parallel sub-agent dispatch based on task complexity scoring.

---

## 1. 📖 OVERVIEW

### Purpose

Defines when and how to dispatch parallel agents for complex tasks. Use this configuration to determine if a task benefits from parallel exploration vs. direct execution.

### Usage

1. Score the task using the 5-dimension complexity model
2. Check score against decision thresholds (<20% = direct, ≥20% + 2 domains = ask user)
3. For Step 6 Planning, use the 4-agent parallel exploration pattern
4. Apply override phrases when user specifies execution preference

---

## 2. 📊 5-DIMENSION COMPLEXITY SCORING

| Dimension            | Weight | Scoring                                |
| -------------------- | ------ | -------------------------------------- |
| Domain Count         | 0.35   | 1 domain=0.0, 2=0.5, 3+=1.0            |
| File Count           | 0.25   | 1-2 files=0.0, 3-5=0.5, 6+=1.0         |
| LOC Estimate         | 0.15   | <50=0.0, 50-200=0.5, >200=1.0          |
| Parallel Opportunity | 0.20   | Sequential=0.0, Some=0.5, High=1.0     |
| Task Type            | 0.05   | Trivial=0.0, Moderate=0.5, Complex=1.0 |

**Domains:** code, analysis, docs, git, testing, devops

---

## 3. 🎯 DECISION THRESHOLDS

| Score            | Action                                |
| ---------------- | ------------------------------------- |
| <20%             | Proceed directly (no parallel agents) |
| ≥20% + 2 domains | ALWAYS ask user (A/B/C options)       |

**Note:** No auto-dispatch - user must approve parallel dispatch (except Step 6 Planning)

---

## 4. 🤖 4-AGENT PARALLEL EXPLORATION (Step 6 Planning)

| Agent                 | Focus                            | Purpose                          |
| --------------------- | -------------------------------- | -------------------------------- |
| Architecture Explorer | Project structure, entry points  | Understand system architecture   |
| Feature Explorer      | Similar features, patterns       | Find reusable patterns           |
| Dependency Explorer   | Imports, modules, affected areas | Identify integration points      |
| Test Explorer         | Test patterns, infrastructure    | Understand verification approach |

**Execution:** All 4 agents spawn in single message using Task tool with `subagent_type: explore`.

---

## 5. 🔧 OVERRIDE PHRASES

| Intent                    | Phrases                                                |
| ------------------------- | ------------------------------------------------------ |
| Direct (skip parallel)    | "proceed directly", "handle directly", "skip parallel" |
| Parallel (force dispatch) | "use parallel", "dispatch agents", "parallelize"       |
| Auto (let system decide)  | "auto-decide", "auto mode", "decide for me"            |

**Session Preference:** Once selected, persists for 1 hour (3600 seconds).

---

## 6. 🔗 RELATED RESOURCES

### Asset Files
- [template_mapping.md](./template_mapping.md) - Template routing and task mapping
- [level_decision_matrix.md](./level_decision_matrix.md) - Level selection decision matrix

### Reference Files
- [quick_reference.md](../references/quick_reference.md) - Commands, checklists, and troubleshooting
- [level_specifications.md](../references/level_specifications.md) - Complete Level 1-3 requirements

### Related Skills
- `system-spec-kit` - Spec folder workflow orchestrator
