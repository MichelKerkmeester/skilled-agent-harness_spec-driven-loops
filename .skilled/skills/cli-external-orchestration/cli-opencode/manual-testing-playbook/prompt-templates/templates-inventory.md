---
title: "CO-023 -- Prompt templates inventory (15 templates)"
description: "This scenario validates the prompt templates inventory for `CO-023`. It focuses on confirming the canonical 15 templates documented in assets/prompt-templates.md are loadable and structurally complete."
version: 1.4.1.0
---

# CO-023 -- Prompt templates inventory (15 templates)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-023`.

---

## 1. OVERVIEW

This scenario validates the Prompt templates inventory for `CO-023`. It focuses on confirming the cli-opencode `assets/prompt-templates.md` ships exactly the documented 15 templates (per the file's overview and SKILL.md §5 `prompt-templates.md` entry) and each template includes the documented framework tag, target use case, prompt body and invocation shape.

### Why This Matters

The 15 templates are the operator's first stop for routine cli-opencode dispatches. They cover the three documented use cases plus specialized agent dispatches, parallel detached, ablation, worker farm and Memory Epilogue. If any template is missing or structurally degraded (no framework tag, no invocation shape), the calling AI loses its canonical copy-paste source for cli-opencode prompts. This test validates the inventory completeness and structure.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-023` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `assets/prompt-templates.md` contains exactly 15 numbered templates (TEMPLATE 1 through TEMPLATE 15), with a bash invocation block on every template except Template 12 (self-invocation refusal surface) and Template 13 (Memory Epilogue reusable tail), which are text bodies, not dispatch commands.
- Real user request: `Open assets/prompt-templates.md and confirm we have all 15 templates: 1-11 are dispatch patterns, 12 is the refusal surface, 13 is the Memory Epilogue tail, and 14-15 are the MiniMax and Design dispatch patterns.`
- RCAF Prompt: `As an external-AI conductor wanting to verify the prompt template inventory before constructing a dispatch, load assets/prompt-templates.md and count the TEMPLATE N section headers. Verify all 15 templates are present and every template except Template 12 (refusal surface) and Template 13 (Memory Epilogue) includes a bash code block. Return a concise pass/fail verdict naming the template count and any missing templates.`
- Expected execution process: External-AI orchestrator greps the templates file for `## N. TEMPLATE` headers, counts to confirm 15, then validates that 13 of the 15 templates (all except 12 and 13) each include a bash code block.
- Expected signals: 15 unique TEMPLATE headers (TEMPLATE 1 through TEMPLATE 15). Templates 1-11, 14 and 15 each include at least one `bash` fenced code block. Templates 12 (refusal surface) and 13 (Memory Epilogue) carry zero bash blocks by design — they are prose/text bodies, not standalone dispatch commands.
- Desired user-visible outcome: Verdict naming the template count and confirming all 15 are present.
- Pass/fail: PASS if exactly 15 templates AND Templates 1-11 plus 14-15 each have >= 1 bash block AND Templates 12/13 are present as non-bash bodies. FAIL if count != 15 or any dispatch template is missing its bash block.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Grep template headers and count.
3. Count bash code blocks across the file.
4. Spot-check Templates 12 and 13 are present without bash blocks (by design).
5. Return a verdict naming the template count and structural status.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-023 | Prompt templates inventory (15 templates) | Confirm assets/prompt-templates.md contains exactly 15 numbered templates with bash invocation shapes on every template except the refusal-surface and Memory Epilogue templates | `As an external-AI conductor wanting to verify the prompt template inventory before constructing a dispatch, load assets/prompt-templates.md and count the TEMPLATE N section headers. Verify all 15 templates are present and every template except Template 12 (refusal surface) and Template 13 (Memory Epilogue) includes a bash code block. Return a concise pass/fail verdict naming the template count and any missing templates.` | 1. `bash: grep -c '^## .*TEMPLATE [0-9]' .skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md` -> 2. `bash: grep -E '^## .*TEMPLATE [0-9]' .skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md \| sort -t' ' -k4 -n` -> 3. `bash: grep -c '^\`\`\`bash' .skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md` -> 4. `bash: grep -nE 'TEMPLATE 12:\|TEMPLATE 13:' .skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md` | Step 1: header count = 15; Step 2: list shows all 15 templates in numerical order (1 through 15, no gaps or duplicates); Step 3: each of Templates 1-11, 14 and 15 has at least one bash code block; Step 4: Template 12 (SELF-INVOCATION REFUSAL SURFACE) and Template 13 (MEMORY EPILOGUE) both present | Terminal grep counts and template enumeration | PASS if exactly 15 templates AND bash block count is 14 or 15 (allowing for a template with more than one worked example) AND Templates 12 + 13 are present; FAIL if count != 15 or a dispatch template (anything other than 12/13) is missing its bash block | 1. If count != 15, list which TEMPLATE numbers are missing (e.g., gap between 8 and 10 means 9 is missing) — file a documentation bug; 2. If Template 12 or 13 unexpectedly gained a bash block or a dispatch template unexpectedly lost one, re-verify against the live file structure before assuming regression; 3. If the refusal-surface or Memory Epilogue templates are missing, that documentation has regressed — file a P0 bug; 4. If the count is higher than 15, a template was added without a corresponding numbered entry — clean up duplicates |

### Optional Supplemental Checks

For each template, optionally validate the Framework tag matches the prompt_quality_card framework selection table (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT). Mismatches between template Framework tags and the quality card's selection table indicate documentation drift.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../assets/prompt-templates.md` | The templates inventory under inspection |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §5 references list (`prompt-templates.md`, 15 templates) |
| `../../assets/prompt-templates.md` | §1 OVERVIEW + numbered templates 1-15 + RELATED RESOURCES |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CO-023
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `prompt-templates/templates-inventory.md`
