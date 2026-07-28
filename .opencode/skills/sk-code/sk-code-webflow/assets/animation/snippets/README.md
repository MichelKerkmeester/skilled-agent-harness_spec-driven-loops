---
title: "sk code assets motion dev snippets: Code README"
description: "Code-facing README for .opencode/skills/sk-code/code-webflow/assets/animation/snippets."
trigger_phrases:
  - "sk-code assets/animation/snippets"
  - "code readme"
  - "motion animation snippets"
importance_tier: normal
contextType: implementation
version: 3.5.0.6
---

# sk code assets motion dev snippets

Executable asset scripts shipped with the skill.

## 1. OVERVIEW

### Purpose

This README documents the code-bearing folder `.opencode/skills/sk-code/code-webflow/assets/animation/snippets` so operators can understand its role without opening every source file first. It follows the sk-doc skill README structure while staying focused on code navigation.

### Usage

Use this file to identify the folder boundary, the likely verification path, and the local source files that need sk-code conventions. Keep behavior details in source comments and higher-level workflow details in the owning `SKILL.md`.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files | 10 |
| README scope | Direct files in this folder |
| Audit context | Internal validation notes |

---

## 2. QUICK START

**Step 1: Confirm the owner.**

Start with `.opencode/skills/sk-code/SKILL.md` for runtime routing and workflow boundaries.

**Step 2: Inspect the local code.**

```bash
rg --files .opencode/skills/sk-code/code-webflow/assets/animation/snippets
```

Expected result: the command lists the source files summarized below.

**Step 3: Verify changes.**

Load this folder through the owning skill workflow or MCP server entrypoint.

---

## 3. FEATURES

| Feature | What It Does |
|---|---|
| Folder boundary | Documents direct code files under `assets/animation/snippets`. |
| sk-code alignment | Points reviewers at Webflow CSS, HTML and JavaScript standards and implementation-pattern checks. |
| Verification handoff | Records the expected owner and release-alignment review path for follow-up work. |

---

## 4. STRUCTURE

| Path | Purpose |
|---|---|
| `animate-on-scroll.js` | JS source file in this folder. |
| `cdn-bootstrap.js` | JS source file in this folder. |
| `es-module-bootstrap.js` | JS source file in this folder. |
| `hover-gesture.js` | JS source file in this folder. |
| `in-view-reveal.js` | JS source file in this folder. |
| `layout-transition.js` | JS source file in this folder. |
| `principled-reveal.js` | Principle-driven reveal sequence with timing, anticipation, and stagger-direction vocabulary. |
| `spring-animation.js` | JS source file in this folder. |
| `stagger-animation.js` | JS source file in this folder. |
| `timeline-sequence.js` | JS source file in this folder. |

---

## 5. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| sk-code surface | WEBFLOW | Applies Webflow CSS, HTML and JavaScript conventions. |
| README scope | Direct folder | This file documents this folder, not sibling folders. |

---

## 6. USAGE EXAMPLES

**Audit this folder**

```text
User request: Check .opencode/skills/sk-code/code-webflow/assets/animation/snippets for sk-code and README coverage.
Skill routing: sk-code plus sk-doc.
Expected output: Findings recorded in the current release-alignment review evidence.
```

---

## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| README appears stale | Source files changed after this review | Refresh the structure table and rerun the current release-alignment check. |
| Verification command is unclear | Folder is a helper boundary | Use the nearest package or skill-level verification command. |

---

## 8. RELATED RESOURCES

| Document | Purpose |
|---|---|
| [`sk-code/SKILL.md`](../../../../SKILL.md) | Runtime instructions for the owning skill. |
| [`sk-code/SKILL.md`](../../../../SKILL.md) | OpenCode coding standards and verification routing. |
| [`sk-doc skill-readme-template.md`](../../../../../sk-doc/create-skill/assets/skill/skill-readme-template.md) | README structure used for this code README. |
