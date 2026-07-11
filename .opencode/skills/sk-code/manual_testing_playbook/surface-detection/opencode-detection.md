---
title: "SD-002: OPENCODE Surface Detection"
description: "Verify sk-code routes system-code prompts (paths under .opencode/) to the OPENCODE surface and loads the opencode/* reference and asset trees with correct sub-language detection."
version: 3.5.0.6
---

# SD-002: OPENCODE Surface Detection

## 1. OVERVIEW

This scenario verifies that sk-code's smart router identifies OPENCODE as the active code surface when the prompt's CWD or target file path contains `/.opencode/`. OPENCODE covers all `.opencode/` system code across JavaScript, TypeScript, Python, Shell, and JSON/JSONC.

When OPENCODE is detected, the router proceeds to language sub-detection (handled separately by LS-* scenarios) and loads the appropriate sub-language reference set.

Detection markers are defined verbatim in `references/stack_detection.md:39-40` and SKILL.md smart router pseudocode lines 62-64.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer working on the spec-kit MCP server asks the AI to harden a TypeScript scoring lane to handle empty input prompts gracefully.

**Exact prompt**:
```
Handle empty prompts in .opencode/skills/system-spec-kit/mcp_server/lib/scorer/lanes/explicit.ts with a TypeScript console.error fallback.
```

**Expected detection**:
- Surface: `OPENCODE` (target path contains `/.opencode/`)
- Sub-language: `TYPESCRIPT` (target file extension `.ts`)

**Expected references loaded**:
- `references/stack_detection.md`
- `references/smart_routing.md`
- `references/smart_routing.md`
- `references/universal/code_quality_standards.md`
- `code-opencode/references/shared/code_organization.md`
- `code-opencode/references/shared/universal_patterns.md`
- `code-opencode/references/typescript/style_guide.md`
- `code-opencode/references/typescript/quality_standards.md`
- `code-opencode/references/typescript/quick_reference.md`

**Expected assets loaded**:
- `code-opencode/assets/checklists/typescript_checklist.md`
- `code-opencode/assets/checklists/universal_checklist.md`

**Expected NOT loaded**: any `code-webflow/references/*`, `code-opencode/references/python/*`, `code-opencode/references/shell/*`, `code-opencode/references/config/*`.

**Expected agent dispatch**: `@code` (LEAF) for the edit, via `@orchestrate` (Depth: 1 marker), per the orchestrator-only convention in §0 of `.opencode/agents/code.md`.

**Desired user-visible outcome**: The AI applies the edit to `.opencode/skills/system-spec-kit/mcp_server/lib/scorer/lanes/explicit.ts`, runs `verify_alignment_drift.py` for OPENCODE alignment evidence, and confirms the modification with a TypeScript-aware fix (early-return + console.error).

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/sk-code/SKILL.md` is at HEAD-of-main.
2. The target file exists: `bash: test -f .opencode/skills/system-spec-kit/mcp_server/lib/scorer/lanes/explicit.ts`.
3. The sub-language reference set exists: `bash: ls .opencode/skills/sk-code/code-opencode/references/typescript/` returns `style_guide.md quality_standards.md quick_reference.md`.
4. Skill advisor callable.

### Exact Command Sequence

1. **Advisor probe**:
   ```
   bash: python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "Handle empty prompts in .opencode/skills/system-spec-kit/mcp_server/lib/scorer/lanes/explicit.ts with a TypeScript console.error fallback." --threshold 0.8 > /tmp/skc-SD002-advisor.txt
   ```
2. **Verify**: top-1 == `sk-code`, score ≥ 0.80.
3. **Invoke sk-code** with the same prompt.
4. **Capture surface + sub-language**: the AI's surface-detection log line should read `SURFACE: OPENCODE`, `LANGUAGE: TYPESCRIPT`.
5. **Capture loaded refs**: must include all 3 typescript/* refs, both shared/* refs, and the universal_checklist.md asset.
6. **Persist evidence** to `/tmp/skc-SD002-loaded-refs.txt`.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Advisor: top_skill == sk-code, score ≥ 0.80. |
| 3 | sk-code router emits `SURFACE: OPENCODE`. |
| 4 | sk-code language sub-detection emits `LANGUAGE: TYPESCRIPT`. |
| 5 | Loaded refs include `code-opencode/references/typescript/style_guide.md`, `quality_standards.md`, `quick_reference.md`, `code-opencode/references/shared/code_organization.md`, `code-opencode/assets/checklists/typescript_checklist.md`, `code-opencode/assets/checklists/universal_checklist.md`. NO `code-webflow/references/*`, NO `code-opencode/references/python/*`. |

### Pass/Fail Criteria

- **PASS** iff: advisor wins sk-code AND surface == OPENCODE AND sub-language == TYPESCRIPT AND all 3 typescript/* refs + 2 shared/* refs loaded AND no other-surface or other-language refs loaded.
- **PARTIAL** iff: surface + sub-language correct but quick_reference.md or one shared/* ref is missed (acceptable drift if all critical refs present).
- **FAIL** iff: surface != OPENCODE OR sub-language != TYPESCRIPT OR any webflow/* OR python/* OR shell/* ref is loaded.

### Failure Triage

1. If advisor doesn't win sk-code: check `skill-graph.json` for sk-code signals "opencode", "system code", "typescript".
2. If surface != OPENCODE: verify target path detection in `references/stack_detection.md:39-40`. The path `.opencode/...` should match.
3. If sub-language != TYPESCRIPT: verify `.ts` extension is in the TYPESCRIPT extension list in SKILL.md sub-detection table (lines 78-90).
4. If `code-webflow/references/*` is loaded: the router has a leak — the WEBFLOW markers (motion.dev, GSAP, etc.) MUST NOT match this prompt. Verify the marker grep patterns are anchored correctly.

## 4. SOURCE FILES

- `.opencode/skills/sk-code/SKILL.md` — Smart router + sub-detection table (lines 53-90).
- `.opencode/skills/sk-code/shared/references/stack_detection.md` — OPENCODE marker definition (lines 39-40).
- `.opencode/skills/sk-code/code-opencode/references/typescript/` — Expected-loaded TypeScript references.
- `.opencode/skills/sk-code/code-opencode/references/shared/` — Expected-loaded shared OPENCODE references.
- `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py` — OPENCODE alignment verifier (run after the edit for evidence).
- `.opencode/agents/code.md` — @code agent dispatch convention.

## 5. SOURCE METADATA

- **Created**: 2026-05-04
- **Critical path**: Yes
- **Destructive**: No (read-only routing test; the target file edit is described but not actually applied in routing tests)
- **Sandbox**: production read-only; do not actually edit `.opencode/skills/system-spec-kit/mcp_server/lib/scorer/lanes/explicit.ts` during the routing test.
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
