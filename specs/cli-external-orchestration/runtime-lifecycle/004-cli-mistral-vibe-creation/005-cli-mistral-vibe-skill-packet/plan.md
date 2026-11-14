---
title: "Implementation Plan: Phase 5: cli-mistral-vibe-skill-packet"
description: "Write the cli-mistral-vibe mode packet in the shape of cli-deepseek-harness: SKILL.md, ROUTER.md, hard-rules.json, four references and a prompt card. Facts come from phase 004's evidence and the research, and each file is proven by the sk-doc document validator."
trigger_phrases:
  - "cli mistral vibe skill packet plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: cli-mistral-vibe-skill-packet

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON |
| **Framework** | sk-doc skill and reference templates, cli-external-orchestration mode layout |
| **Storage** | None |
| **Testing** | `validate_document.py` per markdown file, `jq` over `hard-rules.json` |

### Overview
Create one new folder, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/`, holding eight files modeled on `cli-deepseek-harness`. The cli-reference and providers reference copy their facts from phase 004's `evidence/`, and the other files from research sections 3 to 7. Proof is `Total issues: 0` from the document validator on every markdown file and a `jq` count of rules without a check that prints `0`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `ls specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/004-vibe-contract-pin/evidence` lists `export.json`, `exit-code.txt`, `output-json.txt` and `output-streaming.txt`
- [x] `ls .skilled/skills/cli-external-orchestration/cli-mistral-vibe` prints No such file or directory (`spec.md` Measured Behavior)

### Definition of Done
- [ ] Each of the seven `.md` files prints `Total issues: 0` from `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file>`
- [ ] `jq '[.[] | select((.check // "") == "")] | length' hard-rules.json` prints `0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sibling mode packet.

### Key Components
- **`SKILL.md` and `ROUTER.md`**: the contract and the resource map a dispatcher reads first, without which a dispatch has no governed shape.
- **`hard-rules.json`**: the six rule ids phase 007's preflight implements, without which phase 007 has no named checks to enforce.
- **References and prompt card**: the flag, provider, runtime folder and hook facts a dispatch needs, kept out of `SKILL.md` so it stays short.

### Data Flow
A dispatcher loads `SKILL.md`, follows `ROUTER.md` to the reference it needs, and builds a `vibe -p` command that `hard-rules.json` permits. Facts still pending phase 004 are the `--output json` and `streaming` payload shapes, stdin as a prompt source, the ancestor process name and the catalog listing, all UNKNOWN today.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms phase 004's evidence, reads the sibling mode's layout and records the `.skilled` status baseline. Implementation writes the eight files, one task each. Verification runs the document validator on every markdown file, checks every rule's `check`, and diffs the `.skilled` status against the baseline. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The happy path is `Total issues: 0` on each markdown file and a parsing `hard-rules.json` with six named checks. The edge case is drift into another session's files: `git status --porcelain .skilled` filtered to exclude the new folder must match the Setup baseline.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`python3` for `.skilled/skills/sk-doc/shared/scripts/validate_document.py`, `jq`, and phase 004's `evidence/`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the mode packet states a fact phase 004's evidence contradicts, or a later phase replaces the layout. Delete `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/` in one commit. No other file references it until phase 010 registers it.
<!-- /ANCHOR:rollback -->

---
