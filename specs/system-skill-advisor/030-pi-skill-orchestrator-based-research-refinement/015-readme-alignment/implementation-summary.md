---
title: "Implementation Summary: README Alignment for the Root and Skill Advisor READMEs"
description: "The root README and the skill advisor README now match the repository on every claim a source check found wrong: 70 root README drifts and four advisor README items fixed, eight claims kept with a reason and five follow-ups recorded outside the phase."
trigger_phrases:
  - "readme alignment summary"
  - "root readme drift fixed"
  - "skill advisor readme drift fixed"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/015-readme-alignment"
    last_updated_at: "2026-09-28T16:26:28Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed the confirmed drift in both READMEs and rechecked every fix at its source"
    next_safe_action: "None. The commit and the push close the phase"
    blockers: []
    key_files:
      - "README.md"
      - ".skilled/skills/system-skill-advisor/README.md"
      - "evidence/claim-ledger.md"
      - "evidence/final-checks.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-28-030-phase-015"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: README Alignment for the Root and Skill Advisor READMEs

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-readme-alignment |
| **Completed** | 2026-09-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both READMEs now say what the repository does. A reader following the root README Quick Start no longer runs `npm install` at a root with no `package.json`, and the command library names commands that exist, such as `/create:skill` and `/create:manual-testing-playbook`.

### Phase 15: readme-alignment

The check covered 404 root README claims across four read-only agents, plus the root Skill Advisor section and the whole skill advisor README, which the orchestrator read against the code. Every suspected drift went into `evidence/claim-ledger.md` and was opened at its source before any line changed. That source check kept eight claims with a reason and fixed the rest.

The root README fixes fall into four kinds. Counts had moved: 40 validation rules, 36 command entry points, nine mcp-tooling modes, 49 chart check families and a 40/30/30 DQI split. Names had changed: `/create:skill`, `/create:skill-parent`, `/create:manual-testing-playbook`, `/goal-opencode`, the ten doctor targets and the `doctor-<target>.yaml` files. Files had gone: the root `package.json`, `CLAUDE.md` and the `prompt-advisor` OpenCode plugin. Behavior had shifted: `/speckit:save` plans by default, `AC_CLOSURE` fails only a packet that claims completion, `create.sh --phase` makes three children and only `cli-pi` may dispatch itself. The skill advisor README now names where each runtime's entry shim lives, describes what `advisor_status` reports and carries a `version` the standard derives.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `README.md` | Modified | 70 ledger rows of drift fixed in place, no section moved |
| `.skilled/skills/system-skill-advisor/README.md` | Modified | Two drifts fixed, four HVR semicolons split and `version` set to `0.12.0.54` |
| `015-readme-alignment/evidence/` | Created | Baselines, the claim ledger, the recheck script and the final checks |
| `015-readme-alignment/` docs | Modified | Spec, plan, tasks, goal and this summary |
| `../goal.md` | Modified | Binds this phase's goal. D3's second sentence moved to the log to keep the slice within 4,000 characters |
| `../spec.md` | Modified | Phase 15 row and handoff row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baselines came first: both READMEs valid, one hard HVR blocker in the root README and four in the advisor README. Four Opus agents then checked the root README in four line ranges and wrote nothing. Their 80 flagged claims joined the orchestrator's own findings. Each one was confirmed or rejected at its cited file and line, by a count or by a command run. The fixes went in as exact-match replacements that fail on anything but a single match, so no line changed by accident. `evidence/recheck.sh` then proved each new statement against its source from the final state, 48 checks in all. The validator and the HVR scan ran on both files again. The commit, the trigger index rebuild and the push to origin/main follow, and goal criterion 6 covers them.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| An agent verdict was a hypothesis until its source was opened | Six flagged claims held up at their source and stayed, and some fixes differ from the agent's proposal, such as `SPECKIT_AUTOSYNC=0`, which the sk-git changelog calls the publish leg rather than a per-launch switch |
| Keep a claim when a source supports it, even against an agent's verdict | The repository's own review agent calls the mode `code-review`, and the embedder ownership line matches `embedder-pluggability.md` |
| Drop a timing figure rather than print a new one | The 108 ms figure came from one old measurement, and a number from one machine today would age the same way |
| Set the advisor README version to 0.12.0.54 by hand | `compute` derives 0.12.0.53 before this commit, and the phase commit adds the 54th real edit, so the written value holds once the commit lands |
| Cut D3's reasoning, not a criterion, to fit the parent goal | Step 5 of the sk-create-goal cut order shortens decision prose to the choice. The moved sentence sits in the parent log |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Source recheck of every fix (`evidence/recheck.sh`) | PASS, 48 of 48 (`evidence/final-checks.txt`) |
| `validate_document.py --type readme`, root README | PASS, 0 issues, the same as the baseline |
| `validate_document.py --type readme`, advisor README | PASS, 0 issues, the same as the baseline |
| `hvr_scan.py`, root README | 0 hard blockers, down from 1. Mechanical deductions -10, down from -15 |
| `hvr_scan.py`, advisor README | 0 hard blockers, down from 4. Mechanical deductions -3, down from -23 |
| Serial commas in added lines | None. Each added `, and` joins two clauses rather than ending a list |
| Parent goal | `goal.cjs packet` reports 3,978 durable characters and `packet_budget=ok`, and `check-goal.cjs` passes 5 of 5 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two fixes are inferred.** The Quick Start install steps follow the package manifests and build scripts, since a fresh-clone run would install packages. The in-page anchors follow GitHub's heading-slug rule, and a view of the rendered page on GitHub would confirm them.
2. **Five follow-ups sit outside this phase.** `validation-rules.md:741` still cites 108 ms, the advisor install guide omits the spec-kit install, Code Mode's `mcp-server/package.json` is not tracked, the MCP doctor presentation keeps Skill Advisor rows and the two advisor skill counts differ (21 and 15). The ledger records each with its evidence.
3. **The HVR review count rose.** The scanner's serial-comma candidates went from 47 to 61 in the root README and from 5 to 6 in the advisor README. Every added one joins two clauses, and the pre-existing ones sit outside the lines this phase touched.
<!-- /ANCHOR:limitations -->

---
