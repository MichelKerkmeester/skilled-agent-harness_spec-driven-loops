---
title: "SD-002: SKILLED Surface Detection"
description: "Verify sk-code routes system-code prompts (paths under .skilled/) to the SKILLED surface and loads the opencode/* reference and asset trees with correct sub-language detection."
version: 1.5.3.0
---

# SD-002: SKILLED Surface Detection

## 1. OVERVIEW

This scenario verifies that sk-code's smart router identifies SKILLED as the active code surface when the prompt's CWD or target file path contains `/.skilled/`. SKILLED covers all `.skilled/` system code across JavaScript, TypeScript, Python, Shell, and JSON/JSONC.

When SKILLED is detected, the router proceeds to language sub-detection (handled separately by LS-* scenarios) and loads the appropriate sub-language reference set.

Detection markers are defined verbatim in `shared/references/stack-detection.md:39-40` and SKILL.md smart router pseudocode lines 62-64.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer working on the spec-kit MCP server asks the AI to harden a TypeScript scoring lane to handle empty input prompts gracefully.

**Exact prompt**:
```
Handle empty prompts in .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts with a TypeScript console.error fallback.
```

Prompt: `Handle empty prompts in .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts with a TypeScript console.error fallback.`

**Expected detection**:
- Surface: `SKILLED` (target path contains `/.skilled/`)
- Sub-language: `TYPESCRIPT` (target file extension `.ts`)

**Expected references loaded**:
- `shared/references/stack-detection.md`
- `ROUTER.md`
- `ROUTER.md`
- `shared/references/universal/code-quality-standards.md`
- `sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md`
- `sk-code-skilled/references/typescript/quality-standards/overview-and-type-system.md`
- `sk-code-skilled/references/typescript/quick-reference/template-naming-and-types.md`

**Expected assets loaded**:
- `sk-code-skilled/assets/checklists/typescript-checklist.md`
- `sk-code-skilled/assets/checklists/universal-checklist.md`


**Expected agent dispatch**: `@code` (LEAF) for the edit, via `@orchestrate` (Depth: 1 marker), per the orchestrator-only convention in §0 of `.skilled/agents/code.md`.

**Desired user-visible outcome**: The AI applies the edit to `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`, runs `verify_alignment_drift.py` for SKILLED alignment evidence, and confirms the modification with a TypeScript-aware fix (early-return + console.error).

---

## 3. TEST EXECUTION

### Preconditions

1. `.skilled/skills/sk-code/SKILL.md` is at HEAD-of-main.
2. The target file exists: `bash: test -f .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`.
3. The sub-language reference set exists: `bash: ls .skilled/skills/sk-code/sk-code-skilled/references/typescript/` returns `style-guide.md quality-standards.md quick-reference.md`.
4. Skill advisor callable.

### Exact Command Sequence

1. **Advisor probe**:
   ```
   bash: python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "Handle empty prompts in .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts with a TypeScript console.error fallback." --threshold 0.8 > /tmp/skc-SD002-advisor.txt
   ```
2. **Verify**: top-1 == `sk-code`, score ≥ 0.80.
3. **Invoke sk-code** with the same prompt.
4. **Capture surface + sub-language**: the AI's surface-detection log line should read `SURFACE: SKILLED`, `LANGUAGE: TYPESCRIPT`.
5. **Capture loaded refs**: must include all 3 typescript/* refs, both shared/* refs, and the universal-checklist.md asset.
6. **Persist evidence** to `/tmp/skc-SD002-loaded-refs.txt`.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Advisor: top_skill == sk-code, score ≥ 0.80. |
| 3 | sk-code router emits `SURFACE: SKILLED`. |
| 4 | sk-code language sub-detection emits `LANGUAGE: TYPESCRIPT`. |

### Pass/Fail Criteria

- **PASS** iff: advisor wins sk-code AND surface == SKILLED AND sub-language == TYPESCRIPT AND all 3 typescript/* refs + 2 shared/* refs loaded AND no other-surface or other-language refs loaded.

Evidence: `/tmp/skc-SD002-loaded-refs.txt` (surface, sub-language, and loaded-refs transcript).

### Failure Triage

1. If advisor doesn't win sk-code: check `skill-graph.json` for sk-code signals "opencode", "system code", "typescript".
2. If surface != SKILLED: verify target path detection in `shared/references/stack-detection.md:39-40`. The path `.skilled/...` should match.
3. If sub-language != TYPESCRIPT: verify `.ts` extension is in the TYPESCRIPT extension list in SKILL.md sub-detection table (lines 78-90).
4. Confirm that a generic library marker (motion.dev, GSAP, etc.) MUST NOT match this prompt; verify that marker grep patterns are anchored correctly.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md` — Root directory page and scenario summary.
- `.skilled/skills/sk-code/SKILL.md` — Smart router + sub-detection table (lines 53-90).
- `.skilled/skills/sk-code/shared/references/stack-detection.md` — SKILLED marker definition (lines 39-40).
- `.skilled/skills/sk-code/sk-code-skilled/references/typescript/` — Expected-loaded TypeScript references.
- `.skilled/skills/sk-code/sk-code-skilled/references/shared/` — Expected-loaded shared SKILLED references.
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py` — SKILLED alignment verifier (run after the edit for evidence).
- `.skilled/agents/code.md` — @code agent dispatch convention.

---

## 5. SOURCE METADATA

- Group: Surface Detection
- Playbook ID: SD-002
- **Created**: 2026-05-04
- **Critical path**: Yes
- **Destructive**: No (read-only routing test; the target file edit is described but not actually applied in routing tests)
- **Sandbox**: production read-only; do not actually edit `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` during the routing test.
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
