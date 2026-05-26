---
title: Skill README Template
description: Template for human-facing skill README files that explain purpose, routing, resources, usage, validation and related documents.
---

# Skill README Template

Use this template for `.opencode/skills/[skill-name]/README.md`. It narrows the generic README structure to OpenCode skill packages.

---

## 1. OVERVIEW

### Purpose

Provide a human-facing README scaffold for OpenCode skill packages without duplicating runtime instructions from `SKILL.md`.

### Usage

Copy the fillable scaffold into `.opencode/skills/[skill-name]/README.md`, replace placeholders with current skill behavior, then remove sections that do not fit.

### Location & Naming

| Item | Convention |
|---|---|
| Target path | `.opencode/skills/[skill-name]/README.md` |
| File name | `README.md` with uppercase README preserved |
| Source template | `assets/readme/readme_template.md` |
| Related runtime file | `SKILL.md` |

### When To Create A Skill README

Use this asset when:

- The skill has multiple operating modes, references, assets or scripts.
- Operators need quick-start commands or validation steps.
- The skill participates in skill graph navigation or runtime routing.
- The skill has troubleshooting, FAQ or usage examples worth preserving outside `SKILL.md`.

Keep the content in `SKILL.md` when the skill is tiny and runtime instructions already give complete human orientation.

---

## 2. SKILL README MODEL

Existing skill READMEs in this workspace commonly use this structure:

| Section | Purpose | Include When |
|---|---|---|
| Frontmatter | Search and routing metadata | Usually, for discoverable skills |
| H1 and tagline | Fast human orientation | Always |
| Overview | Purpose, audience and operating model | Always |
| Key Statistics | Counts, version and scope facts | Skill has measurable resources |
| How This Compares | Boundary with nearby skills | Readers may confuse responsibilities |
| Quick Start | Fast operator path | Skill has commands, scripts or workflows |
| Features | Current capabilities | Skill has multiple modes or behaviors |
| Structure | File tree and important resources | Skill has references, assets or scripts |
| Configuration | Required flags, env vars or invariants | Any settings or runtime constraints exist |
| Usage Examples | Real operator scenarios | Skill has repeatable workflows |
| Troubleshooting | Known failure modes | Operators can hit predictable issues |
| FAQ | Repeated questions | 3 to 6 high-value answers exist |
| Related Documents | Stable navigation links | Always when links exist |

Do not copy spec packet history into a skill README. Document current behavior with stable paths and commands.

This structure is derived from `assets/readme/readme_template.md` and aligned with the asset-file overview pattern in `skill_asset_template.md`.

---

## 3. WRITING RULES

- Explain what the skill does before listing internals.
- Keep `SKILL.md` as the runtime instruction surface and README as the human orientation surface.
- Use `README.md` to explain why and how to navigate, not to duplicate long reference files.
- Link to real files under `references/`, `assets/`, `scripts/`, `feature_catalog/` or `manual_testing_playbook/`.
- Use tables for resource inventories, comparisons and feature references.
- Use repo-root commands in code blocks when operators can run them.
- State expected output for verification commands.
- Remove unused sections instead of leaving placeholders.
- Follow Human Voice Rules: no em dashes, no semicolons, no setup phrases and no banned words.

---

## 4. FILLABLE SCAFFOLD

Copy this scaffold into `.opencode/skills/[skill-name]/README.md`, then remove sections that do not fit the skill.

````markdown
---
title: "[Skill Name]: [Human-Facing Description]"
description: "[One-sentence current responsibility.]"
trigger_phrases:
  - "[primary routing phrase]"
  - "[secondary routing phrase]"
---

# [Skill Name]

[One-sentence statement of what this skill helps operators do.]

---

## 1. OVERVIEW

### Purpose

[Explain why this README exists, what the skill helps readers do, when to use the skill and the nearest boundary. Do not repeat the one-sentence intro verbatim.]

### Usage

[Explain how to use this README to navigate the skill, run workflows, find resources and verify outcomes.]

### Key Statistics

| Metric | Value |
|---|---|
| Version | [version] |
| Operating modes | [count or list] |
| References | [count or folders] |
| Assets | [count or folders] |
| Scripts | [count or none] |

### How This Compares

| Capability | This Skill | Related Skill |
|---|---|---|
| [Capability] | [Current behavior] | [Boundary or difference] |

### Key Features

| Feature | What It Does |
|---|---|
| [Feature] | [Current behavior] |


---

## 2. QUICK START

**Step 1: Invoke the skill.**

[Describe automatic routing or manual read path.]

**Step 2: Run the primary workflow.**

```bash
[command]
```

Expected result: [what success looks like].

**Step 3: Verify before delivery.**

```bash
[verification-command]
```

Expected result: [exit code or output].


---

## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

[Explain the main operating modes or capabilities in plain language.]

### 3.2 FEATURE REFERENCE

| Feature | Inputs | Output | Primary Resource |
|---|---|---|---|
| [Feature] | [Inputs] | [Output] | `[path]` |


---

## 4. STRUCTURE

```text
[skill-name]/
+-- SKILL.md                    # Runtime instructions and smart router
+-- README.md                   # Human-facing overview
+-- references/                 # Loaded guidance and standards
+-- assets/                     # Templates and reusable output material
`-- scripts/                    # Optional deterministic helpers
```

| Path | Purpose |
|---|---|
| `SKILL.md` | [Runtime role] |
| `references/[name].md` | [When loaded] |
| `assets/[name].md` | [How used] |
| `scripts/[name]` | [What it automates] |


---

## 5. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| `[setting]` | `[value]` | [What it controls] |

If no configuration is required, state that clearly and list non-configurable invariants such as required validation commands.


---

## 6. USAGE EXAMPLES

**[Scenario name]**

```text
User request: [realistic prompt]
Skill routing: [intent or mode]
Resources loaded: [paths]
Expected output: [summary]
```


---

## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| [Symptom] | [Likely cause] | [Action] |


---

## 8. FAQ

**Q: [Question readers ask often]?**

A: [Short answer with a stable link when useful.]


---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions and routing logic |
| [`references/[name].md`](./references/[name].md) | [Why it matters] |
| [`assets/[name].md`](./assets/[name].md) | [How it is used] |

````

---

## 5. VALIDATION CHECKLIST

- [ ] README explains the skill's current purpose before internals.
- [ ] README and `SKILL.md` responsibilities are distinct.
- [ ] Intro after H1 is one short sentence and the detailed purpose lives in OVERVIEW.
- [ ] OVERVIEW includes Purpose and Usage subsections when the README is more than a short navigation page.
- [ ] Trigger phrases and related-document links are stable.
- [ ] Structure section lists only real files or clearly marked template placeholders.
- [ ] Commands are tested or marked as examples.
- [ ] Related resources point to existing files.
- [ ] Optional sections without content were removed.
- [ ] HVR passes: no em dashes, semicolons, banned words or setup phrases.

---

## 6. RELATED RESOURCES

- [`readme_template.md`](../readme/readme_template.md) - Source template this skill-specific asset narrows.
- [`skill_creation.md`](../../references/skill_creation.md) - Skill creation workflow and lifecycle guidance.
- [`skill_md_template.md`](./skill_md_template.md) - Runtime `SKILL.md` scaffold.
- [`skill_reference_template.md`](./skill_reference_template.md) - Reference-file scaffold.
- [`skill_asset_template.md`](./skill_asset_template.md) - Asset-file scaffold.
- [`hvr_rules.md`](../../references/global/hvr_rules.md) - Human Voice Rules.
