---
title: "GUIDED-014 -- Guided Run Smoke Lane"
description: "This scenario validates the guided wrapper for `GUIDED-014`. It focuses on confirming the wrapper checks runtime readiness, runs extraction, saves the write prompt, and stops rather than auto-authoring DESIGN.md."
id: "GUIDED-014"
version: 1.0.1.0
expected_intent: RUN_WRAPPER
expected_resources:
  - references/design-md-format.md
  - references/writing-style-guide.md
  - references/color-role-taxonomy.md
  - references/component-taxonomy.md
  - references/anti-patterns.md
  - references/authoring-boundary.md
  - references/extraction-workflow.md
  - references/troubleshooting.md
  - assets/design-md-prompt-template.md
  - references/guided-run.md
  - assets/cardinal-rules-card.md
  - assets/source-of-truth-router-card.md
---

**Exact prompt**

```
Run the guided md-generator wrapper for a smoke extraction and stop before validation if DESIGN.md has not been authored.
```

# GUIDED-014 -- Guided Run Smoke Lane

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GUIDED-014`.

---

## 1. OVERVIEW

This scenario validates the guided run wrapper for `GUIDED-014`. It focuses on confirming the wrapper reports runtime readiness, runs extraction, saves `write-prompt.md`, and stops at the authoring boundary instead of writing `DESIGN.md` prose itself.

### Why This Matters

The wrapper exists to remove command friction across four phases, which puts it one step away from removing the authoring step too. That step is the whole point of the skill: `DESIGN.md` is written explicitly from the generated prompt so every value in it stays traceable to `tokens.json`. A wrapper that helpfully authored the document would produce a Style Reference nobody measured, which is exactly the hallucinated design doc this skill exists to prevent.

The third step of this lane is therefore the load-bearing one. Steps one and two prove the wrapper works; step three proves it knows where to stop.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GUIDED-014` and confirm the expected signals without contradictory evidence.

- Objective: confirm the wrapper reports readiness, extracts, saves the write prompt, and refuses to author `DESIGN.md`.
- Real user request: `Run the guided wrapper on this site and stop before validation if DESIGN.md isn't written yet.`
- Prompt: `Run the guided md-generator wrapper for a smoke extraction and stop before validation if DESIGN.md has not been authored.`
- Expected execution process: run `guided-run.ts --dry-run` for preflight, run it against a crawlable URL to produce `tokens.json` plus `write-prompt.md`, then re-run pointing `--design-md` at a path that does not exist and confirm the wrapper halts with a message naming the manual authoring step.
- Expected signals: preflight prints a PASS or FAIL line for Node, dependencies, Chromium and output path; `tokens.json` and `write-prompt.md` both appear in the output path; the third run stops without creating `DESIGN.md` and without running validation.
- Desired user-visible outcome: A concise PASS or FAIL verdict, or SKIP naming the specific sandbox blocker that prevented execution.
- Pass/fail: PASS if the wrapper produces `tokens.json` and `write-prompt.md`, writes no `DESIGN.md` prose, runs validation only when `DESIGN.md` exists, and names the next manual authoring step; FAIL if it authors `DESIGN.md`, treats a missing `DESIGN.md` as validation success, or skips `build-write-prompt.ts`.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. The wrapper stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: `backend/node_modules/` must exist and `npx playwright install chromium` must have completed. A live, publicly reachable URL is required; `https://example.com` is the default, but operators may substitute any crawlable URL.

### Exact Command Sequence

1. `bash: npx ts-node .opencode/skills/sk-design-md-generator/backend/scripts/guided-run.ts https://example.com --output .opencode/specs/<track>/<packet>/output --dry-run`
2. `bash: npx ts-node .opencode/skills/sk-design-md-generator/backend/scripts/guided-run.ts https://example.com --output .opencode/specs/<track>/<packet>/output --fast`
3. `bash: ls -la .opencode/specs/<track>/<packet>/output/tokens.json .opencode/specs/<track>/<packet>/output/write-prompt.md`
4. `bash: npx ts-node .opencode/skills/sk-design-md-generator/backend/scripts/guided-run.ts https://example.com --output .opencode/specs/<track>/<packet>/output --design-md .opencode/specs/<track>/<packet>/output/absent-DESIGN.md --fast`
5. `bash: ls .opencode/specs/<track>/<packet>/output/absent-DESIGN.md`
6. `agent: report the readiness lines, the produced artifacts, and where the wrapper stopped`

### Expected Signals

Step 1: preflight prints a readiness line for Node, dependencies, Chromium and output path. Step 2: extraction exits 0. Step 3: both `tokens.json` and `write-prompt.md` exist. Step 4: the wrapper halts before validation with a message naming the manual authoring step. Step 5: the listing fails because the wrapper did not create the file. Step 6: the agent names the stopping point rather than claiming a completed run.

### Evidence

The preflight transcript, the `ls -la` output showing both artifacts, the third run's halt message, and the failed listing proving no `DESIGN.md` was written.

### Pass / Fail Criteria

- **Pass**: the wrapper produces `tokens.json` and `write-prompt.md`, writes no `DESIGN.md` prose, runs validation only when `DESIGN.md` exists, and the user-visible result names the next manual authoring step.
- **Fail**: the wrapper authors `DESIGN.md`, weakens or skips the cardinal fidelity rule, treats a missing `DESIGN.md` as validation success, or omits `build-write-prompt.ts`.

### Failure Triage

1. Confirm `backend/node_modules/` exists and Chromium is installed; a preflight FAIL on either is a setup problem, not a wrapper defect.
2. If the site returns 403 or 429, the crawler is refused by the remote host: record SKIP naming that remote blocker and route to `ESCALATE-001`.
3. If `write-prompt.md` is absent, confirm `build-write-prompt.ts` ran; the wrapper must never skip it.
4. If a `DESIGN.md` appeared, compare its values against `tokens.json` and file the authoring-boundary breach as the primary defect.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GUIDED-014 | Guided run smoke lane | Verify the wrapper reports readiness, extracts, saves the write prompt, and refuses to author DESIGN.md | `Run the guided md-generator wrapper for a smoke extraction and stop before validation if DESIGN.md has not been authored.` | 1. `guided-run.ts --dry-run` -> 2. `guided-run.ts --fast` -> 3. `ls -la tokens.json write-prompt.md` -> 4. `guided-run.ts --design-md <absent path> --fast` -> 5. `ls <absent path>` -> 6. agent reports the stopping point | Step 1: readiness lines printed. Step 2: extraction exits 0. Step 3: both artifacts exist. Step 4: wrapper halts before validation. Step 5: listing fails, no file created. Step 6: agent names the stopping point | Preflight transcript, `ls -la` of both artifacts, the halt message, and the failed listing | PASS if both artifacts are produced, no DESIGN.md prose is written, validation runs only when DESIGN.md exists, and the next manual step is named; FAIL if the wrapper authors DESIGN.md, skips the write prompt, or treats a missing DESIGN.md as success | 1. Check dependencies and Chromium. 2. On a 403/429 the remote host refused the crawler: SKIP naming that blocker. 3. Confirm `build-write-prompt.ts` ran. 4. If DESIGN.md appeared, file the authoring-boundary breach |

### Optional Supplemental Checks

Re-run step 4 with `--design-md` pointing at a real, hand-authored `DESIGN.md` and confirm validation now runs. That proves the gate is conditional on the file existing rather than permanently disabled.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../backend/scripts/guided-run.ts` | The wrapper under test — preflight, phase orchestration, authoring gate |
| `../../backend/scripts/extract.ts` | Extraction phase the wrapper invokes |
| `../../backend/scripts/build-write-prompt.ts` | Write-prompt generation the wrapper must never skip |
| `../../backend/scripts/validate.ts` | Validation phase, gated on `DESIGN.md` existing |
| `../../references/guided-run.md` | Wrapper contract, normal run shape, and operator handoff |
| `../../references/authoring-boundary.md` | The boundary this scenario proves the wrapper respects |
| `../../SKILL.md` | Three-phase pipeline and cardinal fidelity rule |

---

## 5. SOURCE METADATA

- Group: Guided Run
- Playbook ID: GUIDED-014
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `guided-run/guided-run-smoke-lane.md`
