---
title: "sk code assets scripts: Code README"
description: "Code-facing README for .skilled/skills/sk-code/sk-code-opencode/assets/scripts."
trigger_phrases:
  - "sk-code assets/scripts"
  - "code readme"
  - "opencode script maintenance"
importance_tier: normal
contextType: implementation
version: 1.0.0.8
---

# sk code assets scripts

Operator and maintenance scripts for this skill.

---

## 1. OVERVIEW

### Purpose

This README documents the code-bearing folder `.skilled/skills/sk-code/sk-code-opencode/assets/scripts` so operators can understand its role without opening every source file first. It follows the sk-doc skill README structure while staying focused on code navigation.

### Usage

Use this file to identify the folder boundary, the likely verification path, and the local source files that need sk-code conventions. Keep behavior details in source comments and higher-level workflow details in the owning `SKILL.md`.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files | 7 |
| README scope | Direct files in this folder |
| Audit context | Internal validation notes |

---

## 2. QUICK START

**Step 1: Confirm the owner.**

Start with `.skilled/skills/sk-code/SKILL.md` for runtime routing and workflow boundaries.

**Step 2: Inspect the local code.**

```bash
rg --files .skilled/skills/sk-code/sk-code-opencode/assets/scripts
```

Expected result: the command lists the source files summarized below.

**Step 3: Verify changes.**

Run individual scripts from the repository root with the documented arguments.

---

## 3. FEATURES

| Feature | What It Does |
|---|---|
| Folder boundary | Documents direct code files under `assets/scripts`. |
| sk-code alignment | Points reviewers at OpenCode naming, header, error-handling, and type-discipline checks. |
| Verification handoff | Records the expected owner and audit packet for follow-up work. |

---

## 4. STRUCTURE

| Path | Purpose |
|---|---|
| `router_replay_lib.cjs` | Replays the sk-code router (intent signals, resource maps, default resources) for the router-sync guard. Library only, no CLI. |
| `test_verify_alignment_drift.py` | Unit-style coverage for alignment drift file discovery, language checks, severity behavior, and CLI exit codes. |
| `test_verify_stack_folders.py` | Builds a temporary references tree and proves `verify_stack_folders.py` exits 1 on an orphan folder and 0 on a clean tree. |
| `verify_alignment_drift.py` | Recurring read-only alignment verifier for TypeScript, JavaScript, Python, shell, JSON, and JSONC files. |
| `verify_doc_claims.cjs` | Documentation claim guard: path references in the sk-code docs resolve, no retired packet name remains, every surface count matches the three-surface hub and the `ROUTER.md` load-tier claims match `DEFAULT_RESOURCE`, with an allowlist for deliberate legacy names. Usage: `node verify_doc_claims.cjs [--root <hub dir>] [--checks paths,names,surfaces,tiers]`. |
| `verify_router_sync.cjs` | Restored router-sync drift guard: four checks over the sk-code router, one PASS or FAIL line per leg. Usage: `node verify_router_sync.cjs [--checks 1a,1b,2,3,4]`. |
| `verify_stack_folders.py` | Verifies sk-code-opencode language reference folders match the known language set and flags missing or orphan folders. |

---

## 5. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| sk-code surface | OPENCODE | Applies OpenCode TypeScript, JavaScript, Python, Shell, and config conventions. |
| README scope | Direct folder | This file documents this folder, not sibling folders. |

---

## 6. USAGE EXAMPLES

**Audit this folder**

```text
User request: Check .skilled/skills/sk-code/sk-code-opencode/assets/scripts for sk-code and README coverage.
Skill routing: sk-code plus sk-doc.
Expected output: Findings recorded in the current refinement and release-alignment review.
```

---

## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| README appears stale | Source files changed after this audit | Refresh the structure table and rerun the current release-alignment README remediation check. |
| Verification command is unclear | Folder is a helper boundary | Use the nearest package or skill-level verification command. |

---

## 8. RELATED RESOURCES

| Document | Purpose |
|---|---|
| [`sk-code-opencode/SKILL.md`](../../SKILL.md) | Runtime instructions for the owning skill. |
| [`sk-code-opencode/SKILL.md`](../../SKILL.md) | OpenCode coding standards and verification routing. |
| [`sk-doc skill-readme-template.md`](../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md) | README structure used for this code README. |
