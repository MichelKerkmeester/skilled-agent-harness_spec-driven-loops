---
title: "Goal: Phase 5: runtime-plugin-readmes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/005-runtime-plugin-readmes"
    last_updated_at: "2026-11-16T19:26:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-16-readme-conformance-goal-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: runtime-plugin-readmes

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Bring the 8 plugin, extension and hook mirror READMEs onto the runtime plugin template, so each passes the validator and the voice scan with no hard blocker and maps every entry to its real file as the folder shows it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The phase covers `.pi/extensions/`, `.opencode/plugins/`, `.dsh/plugins/repo-guards/`, `.vibe/plugins/` and the Claude, Codex, Cursor and Devin hook mirror folder READMEs |
| D2 | The OpenCode plugins README names only goal switch names `hook-flags.cjs` declares |
| D3 | Entries, adapters and runtime configs stay unchanged. A defect found there is recorded, not fixed |
| D4 | No hand edit to a README version or a changelog entry. The pre-commit doc-version gate raises a changed README's version |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Each of the 8 READMEs opens with an H1 naming the runtime and its entries, and every H2 is numbered, ALL CAPS, named in the runtime plugin template and has a `---` line above it
- [ ] For each of the 8 READMEs, `python3 .skilled/skills/sk-doc/scripts/validate_document.py <readme>` prints `VALID` and `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <readme>` reports `hard blockers: 0`
- [ ] `readme_links.py` run over the 8 READMEs prints `0 problems`
- [ ] `implementation-summary.md` holds one review line per README from a session that did not write it, confirming each entry's kind and real file hold against the folder or were corrected
- [ ] `test_readme_verdict_parity.py` prints `PARITY PASS`, the sk-doc suite exits 0 and `goal-doc-contract.test.cjs` passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Drive | Done | A canary on `.cursor/hooks`, then the other 7 in waves of three, each reviewed by a separate session. 1,329 claims checked, 25 findings applied, 0 rejected |
| Close | Blocked | 8 of 8 `✅ VALID` with `hard=0`, `readme_links.py` `0 problems`, `goal-doc-contract.test.cjs` `pass 5`, `PARITY PASS`. The sk-doc suite exits 1 on `test_check_changelog_shape.py`, broken by another session's commit `14926d78a37` in the v4.0.2.1 changelog. The operator chose to commit with that criterion blocked |

### Deviations and findings

| Item | Note |
|------|------|
| sk-doc suite criterion | The completion criterion asks the sk-doc suite to exit 0. It exits 1 on a changelog test another session's commit broke, which no README here touches and D3 forbids fixing by hand. The operator chose to commit the phase with that criterion blocked rather than hold it |
| Compiled ESM caveat | The older mirror READMEs said a compiled ESM entry cannot run through its symlink. `isMainModule` in `esm-entry.ts` resolves both paths, so the caveat was removed as false |
<!-- /ANCHOR:log -->
