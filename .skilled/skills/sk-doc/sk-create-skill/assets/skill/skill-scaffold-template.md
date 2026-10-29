---
name: "{{SKILL_NAME}}"
description: TODO one-line description of what this skill does and when to use it (verb + domain noun + trigger phrase)
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.4.0
---

# {{SKILL_TITLE}}

[TODO: State the skill purpose in one sentence.]

---

## 1. WHEN TO USE

### Activation Triggers

Use this skill when:

- [TODO: Name a concrete user goal or task.]
- [TODO: Name a file type, system, or domain signal.]
- [TODO: Add one representative trigger phrase.]

### When NOT to Use

Do not use this skill for:

- [TODO: Name the nearest out-of-scope task.]
- [TODO: Point to the better workflow when applicable.]

---

## 2. SMART ROUTING

[TODO: Name the request signal that selects a resource: the intent, the file type, or the
trigger phrase a user says.]

[TODO: Name what loads first when that signal matches, then the smaller resource set it
pulls in afterwards.]

[TODO: Name the signal that looks related but belongs to another skill, so the router refuses
it instead of loading a near-miss resource.]

Resources live under `references/`, `assets/` and `scripts/`. The router discovers them at load
time, guards every path, and loads nothing before a signal matches.

The machine router, its intent signals and resource map live in [`ROUTER.md`](./ROUTER.md), which
calls `discover_markdown_resources()` and `_guard_in_skill()` and returns `UNKNOWN_FALLBACK` on no
match. Read it before loading a skill-local resource.

---

## 3. HOW IT WORKS

### Workflow

1. [TODO: Identify the input and relevant constraints.]
2. [TODO: Select the smallest applicable workflow or resource set.]
3. [TODO: Produce the requested artifact or result.]
4. [TODO: Run the appropriate verification.]

### Output Contract

[TODO: State what the skill returns, creates, or changes.]

### Verification

[TODO: Name the command or evidence that proves success.]

---

## 4. RULES

### ✅ ALWAYS

- [TODO: Add a required behavior.]
- [TODO: Add a verification requirement.]
- [TODO: Add a scope or safety constraint.]

### ❌ NEVER

- [TODO: Add a forbidden action.]
- [TODO: Add a known anti-pattern.]
- [TODO: Add a boundary the skill must not cross.]

### ⚠️ ESCALATE IF

- [TODO: Name an ambiguity that requires user input.]
- [TODO: Name a failure that blocks safe progress.]
- [TODO: Name a contract conflict that needs a decision.]

---

## 5. REFERENCES

### Core References

- [TODO: Add only references needed for deeper guidance.]

### Templates and Assets

- [TODO: Add reusable templates or assets when needed.]

### Loading Notes

- [TODO: State when optional resources should be loaded.]

---

## 6. SUCCESS CRITERIA

The task is complete when:

- [TODO: The requested outcome exists.]
- [TODO: Required validation passes.]
- [TODO: Remaining uncertainty is reported.]

---

## 7. INTEGRATION POINTS

### Inputs

- [TODO: Name upstream commands, tools, or artifacts.]

### Outputs

- [TODO: Name downstream consumers or handoff artifacts.]

### Related Workflows

- [TODO: Name adjacent skills or workflows and their boundaries.]
