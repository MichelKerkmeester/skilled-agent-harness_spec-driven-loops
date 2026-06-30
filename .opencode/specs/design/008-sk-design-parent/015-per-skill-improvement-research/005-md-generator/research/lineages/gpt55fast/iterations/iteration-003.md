# Iteration 3: Tooling And Setup Friction

## Focus

Find efficiency and UX improvements in the embedded backend and command flow.

## Findings

- The skill tells operators to run setup from `backend/`: `npm install` and `npx playwright install chromium` [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:276-285]. The backend README repeats that setup and says scripts/dependencies live in `package.json` [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/README.md:38-58], [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/README.md:86-107].
- In this checkout, the nested backend has `package-lock.json` with package metadata and dependencies, but no `package.json` was found. The lockfile declares `design-system-extractor`, dependencies, devDependencies, and bin metadata [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/package-lock.json:1-26].
- `cli.ts` is extraction-oriented and then prints manual next steps for WRITE and VALIDATE [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/cli.ts:7-18], [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/cli.ts:43-53].
- `build-write-prompt.ts` correctly pre-renders value sections and facts, reducing fabrication risk [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:5-10], [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:53-100].
- `validate.ts` has meaningful gates: phantom colors, L4 content colors, v3 sections, Quick Start fidelity, and claims score [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:62-128], [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:397-463], [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:492-497].

## Recommendations From This Iteration

- P1: Restore or regenerate `backend/package.json` before adding higher-level UX.
- P1: Add `preflight` that reports manifest/dependency/Chromium/output-path readiness in one place.
- P1: Add a guided wrapper that can run extract, save the write prompt, validate, and report while preserving phase boundaries.

## What Was Tried And Failed

- Tried to confirm `backend/package.json`; it was absent under the nested backend path.
- Tried to treat the current CLI as full pipeline UX; it only runs extraction and punts the rest to manual commands.

## Assessment

- newInfoRatio: 0.55
- Novelty: medium. Concrete setup blocker plus wrapper opportunity.
- Next focus: routing and benchmark evidence.
