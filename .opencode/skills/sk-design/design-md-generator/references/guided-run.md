---
title: Guided Run Wrapper
description: Guided md-generator wrapper contract for readiness checks and phase orchestration without auto-authoring DESIGN.md.
trigger_phrases:
  - "guided run wrapper"
  - "md-generator smoke lane"
  - "preflight extract write prompt validate"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Guided Run Wrapper

The guided run wrapper reduces command friction while preserving the existing extract, write, validate and report contract.

## 1. What The Wrapper Does

It checks:

- Node.js version.
- Backend dependencies.
- Playwright Chromium availability.
- Output path safety.
- Existing `tokens.json` and `DESIGN.md` paths.

It can run:

- Extract with `extract.ts`.
- Write prompt generation with `build-write-prompt.ts`.
- Validation with `validate.ts` only when `DESIGN.md` already exists.
- Optional report generation when both source files exist.

## 2. What It Never Does

- It does not auto-author `DESIGN.md` content.
- It does not invent values.
- It does not weaken token fidelity.
- It does not skip `build-write-prompt.ts`.
- It does not treat missing `DESIGN.md` as validation success.

## 3. Normal Run Shape

```bash
npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts https://example.com --output .opencode/specs/<track>/<packet>/output --design-md .opencode/specs/<track>/<packet>/output/DESIGN.md --fast
```

Expected phases:

1. Preflight prints PASS or FAIL for Node, dependencies, Chromium and output path.
2. Extract writes `tokens.json` to the output path.
3. Write prompt is saved as `write-prompt.md` in the output path.
4. If `DESIGN.md` exists, validation runs.
5. If validation ran and report was requested, report generation runs.

## 4. Operator Handoff

If the wrapper stops after prompt generation, the next actor writes `DESIGN.md` using the prompt and the loaded references. The wrapper has done its job. Authorship remains explicit and fidelity remains inspectable.
