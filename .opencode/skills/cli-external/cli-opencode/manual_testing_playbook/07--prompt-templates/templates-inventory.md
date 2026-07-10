---
title: "CO-023 -- Prompt templates inventory (16 templates)"
description: "This scenario validates the prompt templates inventory for `CO-023`. It focuses on confirming the canonical 16 templates documented in assets/prompt_templates.md are loadable and structurally complete."
version: 1.3.0.7
---

# CO-023 -- Prompt templates inventory (16 templates)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-023`.

---

## 1. OVERVIEW

This scenario validates the Prompt templates inventory for `CO-023`. It focuses on confirming the cli-opencode `assets/prompt_templates.md` ships exactly the documented 16 templates (per the file's overview and SKILL.md §5 `prompt_templates.md` entry) and each template includes the documented framework tag, target use case, prompt body and invocation shape.

### Why This Matters

The 16 templates are the operator's first stop for routine cli-opencode dispatches. They cover the three documented use cases plus specialized agent dispatches, parallel detached, ablation, worker farm and Memory Epilogue. If any template is missing or structurally degraded (no framework tag, no invocation shape), the calling AI loses its canonical copy-paste source for cli-opencode prompts. This test validates the inventory completeness and structure.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-023` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `assets/prompt_templates.md` contains exactly 16 numbered templates (TEMPLATE 1 through TEMPLATE 16), with a bash invocation block on every template except Template 12 (self-invocation refusal surface) and Template 13 (Memory Epilogue reusable tail), which are text bodies, not dispatch commands.
- Real user request: `Open assets/prompt_templates.md and confirm we have all 16 templates: 1-11 are dispatch patterns, 12 is the refusal surface, 13 is the Memory Epilogue tail, and 14-16 are the MiniMax/MiMo/Design dispatch patterns.`
- RCAF Prompt: `As an external-AI conductor wanting to verify the prompt template inventory before constructing a dispatch, load assets/prompt_templates.md and count the TEMPLATE N section headers. Verify all 16 templates are present and every template except Template 12 (refusal surface) and Template 13 (Memory Epilogue) includes a bash code block. Return a concise pass/fail verdict naming the template count and any missing templates.`
- Expected execution process: External-AI orchestrator greps the templates file for `## N. TEMPLATE` headers, counts to confirm 16, then validates that 14 of the 16 templates (all except 12 and 13) each include a bash code block.
- Expected signals: 16 unique TEMPLATE headers (TEMPLATE 1 through TEMPLATE 16). Templates 1-11 and 14-16 each include at least one `bash` fenced code block (14 templates, 15 total bash blocks since Template 15 carries two). Templates 12 (refusal surface) and 13 (Memory Epilogue) carry zero bash blocks by design — they are prose/text bodies, not standalone dispatch commands.
- Desired user-visible outcome: Verdict naming the template count and confirming all 16 are present.
- Pass/fail: PASS if exactly 16 templates AND Templates 1-11 plus 14-16 each have >= 1 bash block AND Templates 12/13 are present as non-bash bodies. FAIL if count != 16 or any dispatch template is missing its bash block.

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
| CO-023 | Prompt templates inventory (16 templates) | Confirm assets/prompt_templates.md contains exactly 16 numbered templates with bash invocation shapes on every template except the refusal-surface and Memory Epilogue templates | `As an external-AI conductor wanting to verify the prompt template inventory before constructing a dispatch, load assets/prompt_templates.md and count the TEMPLATE N section headers. Verify all 16 templates are present and every template except Template 12 (refusal surface) and Template 13 (Memory Epilogue) includes a bash code block. Return a concise pass/fail verdict naming the template count and any missing templates.` | 1. `bash: grep -c '^## .*TEMPLATE [0-9]' .opencode/skills/cli-external/cli-opencode/assets/prompt_templates.md` -> 2. `bash: grep -E '^## .*TEMPLATE [0-9]' .opencode/skills/cli-external/cli-opencode/assets/prompt_templates.md \| sort -t' ' -k4 -n` -> 3. `bash: grep -c '^\`\`\`bash' .opencode/skills/cli-external/cli-opencode/assets/prompt_templates.md` -> 4. `bash: grep -nE 'TEMPLATE 12 —\|TEMPLATE 13 —' .opencode/skills/cli-external/cli-opencode/assets/prompt_templates.md` | Step 1: header count = 16; Step 2: list shows all 16 templates in numerical order (1 through 16, no gaps or duplicates); Step 3: bash code block count = 15 (11 templates with one block each for Templates 1-11, plus 1+2+1 across Templates 14/15/16); Step 4: Template 12 (SELF-INVOCATION REFUSAL SURFACE) and Template 13 (MEMORY EPILOGUE) both present | Terminal grep counts and template enumeration | PASS if exactly 16 templates AND bash block count is 14 or 15 (allowing for a template with more than one worked example) AND Templates 12 + 13 are present; FAIL if count != 16 or a dispatch template (anything other than 12/13) is missing its bash block | 1. If count != 16, list which TEMPLATE numbers are missing (e.g., gap between 8 and 10 means 9 is missing) — file a documentation bug; 2. If Template 12 or 13 unexpectedly gained a bash block or a dispatch template unexpectedly lost one, re-verify against the live file structure before assuming regression; 3. If the refusal-surface or Memory Epilogue templates are missing, that documentation has regressed — file a P0 bug; 4. If the count is higher than 16, a template was added without a corresponding numbered entry — clean up duplicates |

### Optional Supplemental Checks

For each template, optionally validate the Framework tag matches the prompt_quality_card framework selection table (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT). Mismatches between template Framework tags and the quality card's selection table indicate documentation drift.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../assets/prompt_templates.md` | The templates inventory under inspection |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §5 references list (`prompt_templates.md`, 16 templates) |
| `../../assets/prompt_templates.md` | §1 OVERVIEW + numbered templates 1-16 + RELATED RESOURCES |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CO-023
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--prompt-templates/templates-inventory.md`
