---
title: "system skill advisor hooks gemini: Code README"
description: "Code-facing README for .opencode/skills/system-skill-advisor/hooks/gemini."
trigger_phrases:
  - "system-skill-advisor hooks/gemini"
  - "code README"
---

# system skill advisor hooks gemini

Runtime hook code that connects the skill to CLI event surfaces.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This README documents the code-bearing folder `.opencode/skills/system-skill-advisor/hooks/gemini` so operators can understand its role without opening every source file first. It follows the sk-doc skill README structure while staying focused on code navigation.

### Usage

Use this file to identify the folder boundary, the likely verification path and the local source files that need sk-code conventions. Keep behavior details in source comments and higher-level workflow details in the owning `SKILL.md`.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files | 1 |
| README scope | Direct files in this folder |
| Audit packet | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/001-skill-graph/006-system-skill-advisor-extraction/026-sk-code-and-code-readme-audit` |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Confirm the owner.**

Start with `.opencode/skills/system-skill-advisor/SKILL.md` for runtime routing and workflow boundaries.

**Step 2: Inspect the local code.**

```bash
rg --files .opencode/skills/system-skill-advisor/hooks/gemini
```

Expected result: the command lists the source files summarized below.

**Step 3: Verify changes.**

Load this folder through the owning skill workflow or MCP server entrypoint.

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

| Feature | What It Does |
|---|---|
| Folder boundary | Documents direct code files under `hooks/gemini`. |
| sk-code alignment | Points reviewers at OpenCode naming, header, error-handling and type-discipline checks. |
| Verification handoff | Records the expected owner and audit packet for follow-up work. |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

| Path | Purpose |
|---|---|
| `user-prompt-submit.ts` | TS source file in this folder. |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| sk-code surface | OPENCODE | Applies OpenCode TypeScript, JavaScript, Python, Shell and config conventions. |
| README scope | Direct folder | This file documents this folder, not sibling folders. |

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

**Audit this folder**

```text
User request: Check .opencode/skills/system-skill-advisor/hooks/gemini for sk-code and README coverage.
Skill routing: sk-code plus sk-doc.
Expected output: Findings recorded in the 026 audit report.
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| README appears stale | Source files changed after this audit | Refresh the structure table and rerun the 026 audit check. |
| Verification command is unclear | Folder is a helper boundary | Use the nearest package or skill-level verification command. |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:related-documents -->
## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`system-skill-advisor/SKILL.md`](../../SKILL.md) | Runtime instructions for the owning skill. |
| [`sk-code/SKILL.md`](../../../sk-code/SKILL.md) | OpenCode coding standards and verification routing. |
| [`sk-doc skill_readme_template.md`](../../../sk-doc/assets/skill/skill_readme_template.md) | README structure used for this code README. |

<!-- /ANCHOR:related-documents -->
