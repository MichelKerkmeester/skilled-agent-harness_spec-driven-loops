---
title: "Task Breakdown: Visual Explanation Lane for sk-communication"
description: "Ordered tasks to author the explain-visually command, its reference doc, and the Lane B section of the skill, then verify the projection lane is untouched."
importance_tier: "medium"
contextType: "general"
trigger_phrases: []
---
# Task Breakdown: Visual Explanation Lane for sk-communication

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

- `[x]` complete · `[ ]` open
- `T-0NN` setup · `T-1NN` implementation · `T-2NN` verification

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T-001 Define the modality dial: the content-to-form mapping, and the rule that only what answers the question is drawn.
- [x] T-002 Define the depth dial: three levels of assumed background, and the rule that simplification never changes a fact.
- [x] T-003 Read `sk-communication/SKILL.md` and record the invariants Lane B must not break (byte-preserving, default-off, advisor-hidden, no on-disk rewrites).
- [x] T-004 Read the sibling `/rewrite:response` command as the in-repo authoring pattern.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T-101 Author `.opencode/commands/rewrite/explain-visually.md` with the five canon sections and both dials.
- [x] T-102 Author `references/visual-explanation.md` with the content-to-modality table and the three-level depth rubric.
- [x] T-103 Add the Lane A / Lane B framing to `SKILL.md` and extend its activation and keyword triggers.
- [x] T-104 Add `/rewrite:explain-visually` to the operator trigger command list and the References section.
- [x] T-105 Disambiguate the on-disk rule: editing an existing file stays out of scope; creating a new artifact under `--artifact` is Lane B behavior.
- [x] T-106 Broaden the skill `description`, add `Write` to `allowed-tools`, and bump the version to 1.1.0.0.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T-201 Confirm the scoped diff touches only the three planned files.
- [x] T-202 Confirm no diff under `cli-communication-projection/` and that `route-exclusions.json` still excludes the skill.
- [x] T-203 Confirm the command's documented statuses and examples are mutually consistent.
- [x] T-204 Run `validate.sh specs/sk-communication/003-visual-explanation-lane --strict` and reach exit 0.
- [x] T-205 Write `implementation-summary.md` and reconcile packet metadata.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- The command exists, exposes both dials, and returns a status on every documented path.
- `SKILL.md` documents both lanes and the gating asymmetry between them.
- The projection lane is provably untouched: no diff to the package, flags, adapters, or advisor config.
- `validate.sh --strict` exits 0.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` — requirements REQ-001 … REQ-007
- `plan.md` — the two-dial model, lane separation, rollback
- `checklist.md` — verification evidence
- `.opencode/skills/sk-communication/references/visual-explanation.md` — the shipped modality table and depth rubric

<!-- /ANCHOR:cross-refs -->
