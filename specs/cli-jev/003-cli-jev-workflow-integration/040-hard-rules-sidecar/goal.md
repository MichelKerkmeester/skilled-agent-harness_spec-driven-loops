---
title: "Goal: Phase 40: hard-rules-sidecar"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hard rules sidecar goal"
  - "skill frontmatter migration goal"
  - "hard rules sidecar criteria"
  - "dispatch rule reader goal"
  - "hard rules enforcement goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar"
    last_updated_at: "2026-09-30T00:00:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Authored the durable directive as a Planned phase"
    next_safe_action: "Build the phase against the completion criteria"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-040-hard-rules-sidecar"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 40: hard-rules-sidecar

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Move every skill's hard rules out of SKILL.md frontmatter into a sidecar the hooks read, with enforcement unchanged.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each rule moves to `hard-rules.json` beside its SKILL.md, copied exactly. Frontmatter keeps no `hard_rules` |
| D2 | The engine stays dependency-free and fail-open: a missing or broken sidecar yields no rules, never a crash |
| D3 | Every reader and test moves in the same change. No dual read of frontmatter is left behind |
| D4 | Enforcement is proved identical: the engine's verdicts on a fixed command set per skill match before and after |
| D5 | sk-doc's frontmatter contract and skill templates say where hard rules live |
| D6 | Executors follow parent D5: DeepSeek writes, MiMo reviews, no Claude workers. Fix P0 and P1, record P2 |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The nine skills each have `hard-rules.json`, and a grep for `^hard_rules:` in any SKILL.md finds nothing
- [ ] The dispatch engine, the four runtime preflight adapters and both sk-git scripts read the sidecar, and their suites pass
- [ ] A recorded before-and-after run of the engine over a fixed command set gives identical verdicts for every skill
- [ ] sk-doc's frontmatter contract names the sidecar, and `validate_document.py` is VALID on every changed doc
- [ ] `sync-skills-hermes.cjs --check` passes, and `validate.sh --strict` passes for this phase
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Spec authored | Done | 2026-09-30, docs only, from `scratch/context/context.md` and the operator's "Move rules out of frontmatter". Status Planned, Level 2, priority P1. No build exists |

### Deviations and findings

| Item | Note |
|------|------|
| Planned state (2026-09-30) | At authoring, nothing is built and the five completion criteria are open. The six open questions in `spec.md` section 10 each carry a proposed answer, and the sidecar contract in `spec.md` section 4 is fixed at spec approval, before any code write |
| Operator basis | The operator asked on 2026-09-30: "you have hard rules in skill frontmatter? Thats not supported or something we should do", then chose "Move rules out of frontmatter": "Put the rules in each SKILL.md body or a sidecar file and change the hook to read them there. This is larger and touches sk-git and 7 cli-* skills outside this packet." The session chose the sidecar because the engine is dependency-free and fail-open and JSON parses without a YAML or markdown parser |
| Reader inventory (observed 2026-09-30) | A read of this tree counts nine SKILL.md files with `hard_rules:` and 50 rules across them, 10 reader files and five test files that pass a SKILL.md path to `readHardRules` or assert on its frontmatter text. `spec.md` section 3 lists each with its line. The criterion above names the engine, the four preflight adapters and both sk-git scripts, and the inventory is wider by the two OpenCode plugin copies, the pi twin of the sk-git advisory and the devin permission policy |
| Hermes copies | `sync-skills-hermes.cjs` walks `.skilled/skills` and matches `entry.name === 'SKILL.md'` at `:61`, so a sidecar is not copied today, and `.hermes/skills/sk-git/SKILL.md` still holds the old `hard_rules` block. Whether a Hermes copy needs the sidecar is the design's to decide and record. This corrects the context's UNKNOWN to an observed sync behavior, with the reader question still open |
| Phase 039 dependency | This phase's predecessor renames `cli-classifier/cli-usage` to `cli-classifier/cli-jev` and runs first. 039 is still a Draft scaffold in this tree, and the registry's cli-classifier row reads `packetPath: 'cli-classifier/cli-usage'`. The design reads the post-039 path before creating that sidecar |
| Out of scope | Changing any rule's meaning, id, check or severity, adding a rule, the unrelated `hardRules` field in `sk-design`, and adding a dependency (D1, D2, REQ-008) |
<!-- /ANCHOR:log -->

---
