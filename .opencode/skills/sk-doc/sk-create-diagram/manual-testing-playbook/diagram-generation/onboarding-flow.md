---
title: "DIA-003 -- Onboarding flow"
description: "This scenario validates the style-guide gate and onboarding flow for `DIA-003`. It focuses on detecting the shipped-default skin, extracting tokens from a source, proposing a mapped diff, and rewriting style-guide.md only after approval."
version: 1.0.0.0
---

# DIA-003 -- Onboarding flow

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DIA-003`.

---

## 1. OVERVIEW

This scenario validates the style-guide gate and onboarding flow for `DIA-003`. It focuses on detecting the shipped-default skin, extracting tokens from a source, proposing a mapped diff, and rewriting `style-guide.md` only after approval.

### Why This Matters

The style-guide gate exists to stop the skill from silently shipping default-skinned diagrams into a branded project — the one failure mode the packet explicitly calls out. If the gate never fires, or onboarding writes extracted tokens without approval, a brand's visual identity is wrong across every future diagram without anyone being asked. The approval gate is load-bearing: extraction is a hypothesis about a design source, and a wrong hypothesis must never be applied silently. This scenario treats the approval halt as a hard acceptance signal, not a courtesy.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DIA-003` and confirm the expected signals without contradictory evidence.

- Objective: verify the style-guide gate fires on a default-skin project and that URL onboarding proposes a mapped diff and writes `style-guide.md` only after approval
- Real user request: `Onboard the diagram skill to my site, https://example.com.`
- Prompt: `This is the first diagram in this project. The style guide is still at the shipped default accent. Run the onboarding gate, then onboard from my site https://example.com — extract the palette and fonts, map them to the semantic roles, propose the style-guide.md diff, and wait for my approval before writing.`
- Expected execution process: the gate detects the `accent` token still equals the shipped default (light `#eb6c36`), the agent reads `references/onboarding.md` §2, fetches the site pages with the calling session's own tools (the packet declares no network-fetch tool), maps extracted colors and fonts to semantic roles with confidence flags, runs AA contrast checks, proposes a diff, and halts until approval writes it.
- Expected signals: the gate question is asked before any drawing; a role-mapping table with per-role confidence appears; the diff preview is limited to the tokens table; `style-guide.md` changes only after explicit approval.
- Desired user-visible outcome: a confirmed gate question, an auditable mapping and diff, and a `style-guide.md` that reflects only the approved tokens.
- Pass/fail: PASS if the gate fires on the default skin, the mapping table and contrast checks are shown, the diff is proposed, and `style-guide.md` is written only after approval; FAIL if the gate is skipped on a default-skin project, tokens are written without approval, or the diff is applied to files outside the tokens table.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `This is the first diagram in this project. The style guide is still at the shipped default accent. Run the onboarding gate, then onboard from my site https://example.com — extract the palette and fonts, map them to the semantic roles, propose the style-guide.md diff, and wait for my approval before writing.`

### Commands

1. `agent: Read references/style-guide.md and check the light `accent` token (shipped default is #eb6c36) — the gate MUST fire on the first diagram`
2. `agent: Read references/onboarding.md §2 (URL source)`
3. `agent: Fetch 2–3 pages of https://example.com (calling session's own fetch tools); extract body background -> paper, body text -> ink, brand CTA -> accent, h1 font -> title, mono element -> sublabel`
4. `agent: Fill the role-mapping table with confidence values, run AA contrast checks, and propose the style-guide.md diff`
5. `agent: STOP — wait for approval; write the approved tokens into references/style-guide.md only after approval`
6. `bash: git status .opencode/skills/sk-doc/sk-create-diagram/references/style-guide.md` (confirm only the approved tokens changed)

### Expected

Step 1 raises the gate question. Step 3 yields candidate tokens such as `paper #f8f6f0`, `ink #111111`, and an `accent` from the brand CTA. Step 4 shows the mapping table with confidence values and a diff limited to the tokens table. Step 5 blocks the write until approval. Step 6 shows a `style-guide.md` diff containing only the approved token rows.

### Evidence

Capture the gate question text, the site URL used, the role-mapping table with confidence values, the proposed diff, the approval confirmation, and `git status`/`git diff` output for `references/style-guide.md` proving only the approved tokens were written.

### Pass / Fail

- **Pass**: the gate fired on the default-skin project, extraction produced a mapped diff with confidence and contrast checks, and `style-guide.md` changed only after explicit approval.
- **Fail**: the gate was skipped, tokens were written without approval, or the diff touched anything beyond the token table.

### Failure Triage

1. Confirm the packet's `references/style-guide.md` really is at the shipped default accent; a pre-customized install legitimately skips the gate.
2. If no diff was proposed, confirm the site fetch actually returned readable CSS (image-only or JS-rendered pages yield nothing to extract) and request a blog or docs URL instead.
3. If `style-guide.md` changed without approval, restore it with `git checkout -- .opencode/skills/sk-doc/sk-create-diagram/references/style-guide.md` and re-run the scenario in a scratch checkout.

### Optional Supplemental Checks

Run the skill-source variant (option b) against an installed skill that carries a `tokens.json`, and confirm the extraction follows the name-heuristics table rather than asking the user for each role.

---

## 4. REFERENCES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `../../feature-catalog/diagram-generation/onboarding-flow.md` | Feature-catalog source describing the implementation contract (authored next) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `SKILL.md` (HOW IT WORKS — style-guide gate) | Gate contract |
| `references/onboarding.md` | Extraction, mapping, and approval workflow |
| `references/style-guide.md` | Token destination and default-skin baseline |

---

## 5. SOURCE METADATA

- Group: DIAGRAM GENERATION
- Playbook ID: DIA-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `diagram-generation/onboarding-flow.md`
