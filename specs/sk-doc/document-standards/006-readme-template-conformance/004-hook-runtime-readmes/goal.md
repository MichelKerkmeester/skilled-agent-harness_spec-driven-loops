---
title: "Goal: Phase 4: hook-runtime-readmes"
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
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/004-hook-runtime-readmes"
    last_updated_at: "2026-11-16T19:26:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-16-readme-conformance-goal-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: hook-runtime-readmes

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Bring the 47 runtime adapter READMEs under `.skilled/hooks/<name>/<runtime>/` onto the hook template's runtime folder scaffold, so each passes the validator and the voice scan with no hard blocker and names the event, registration file and failure behavior the code confirms.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The phase covers the 47 READMEs in the claude, codex, cursor, devin, dsh, pi and vibe runtime folders of the hook folders |
| D2 | Every file keeps the four scaffold sections OVERVIEW, DIRECTORY TREE, VALIDATION and RELATED. A flat folder keeps the DIRECTORY TREE heading and holds a file table naming every file |
| D3 | Adapters and registration files stay unchanged. A defect found there is recorded, not fixed |
| D4 | No hand edit to a README version or a changelog entry. The pre-commit doc-version gate raises a changed README's version |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Each of the 47 runtime adapter READMEs opens with an H1 naming the runtime, the concern and the event, and every H2 is numbered, ALL CAPS, one of OVERVIEW, DIRECTORY TREE, VALIDATION and RELATED and has a `---` line above it
- [ ] For each of the 47 runtime adapter READMEs, `python3 .skilled/skills/sk-doc/scripts/validate_document.py <readme>` prints `VALID` and `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <readme>` reports `hard blockers: 0`
- [ ] `readme_links.py` run over the 47 runtime adapter READMEs prints `0 problems`
- [ ] `implementation-summary.md` holds one review line per runtime adapter README from a session that did not write it, confirming the event, registration file, file table and switch hold against the code or were corrected
- [ ] `test_readme_verdict_parity.py` prints `PARITY PASS`, the sk-doc suite exits 0 and `hook-wiring-check.cjs --root .` exits 0
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
| Setup | Done | The enumeration printed 47 lines. The refreshed baseline matched `baseline-004-before.tsv` line for line. `readme_links.py` printed `0 problems`, `check-markdown-links.cjs` printed `0 broken` and `hook-wiring-check.cjs --root .` printed `ok` for claude, codex, cursor and devin |
| Canary | Done | `mcp-route-guard/pi` passed every check after the main session replaced its smoke command. Its reviewer checked 39 claims and found nothing |
| Drive | Done | 46 files in waves of four, all written, reviewed by a separate session and triaged |
| Close | Done | 47 of 47 `✅ VALID` with `hard=0` and `EXACT`, `readme_links.py` `0 problems`, `PARITY PASS`, sk-doc suite exit 0, `hook-wiring-check.cjs` exit 0. The blocking review's eight findings were confirmed and applied |

### Deviations and findings

| Item | Note |
|------|------|
| VALIDATION in every file | The plan kept VALIDATION only where a test exists. D2 keeps all four sections, and D2 wins as a frozen decision. Every adapter has a real command: its own test, a test that drives it, a stdin smoke or the registration check |
| Title matches the H1 | The scaffold's frontmatter title is the H1 text, and nothing in the repository keys on these titles, so each file's title now equals its H1 |
| Master switch wording | A README calls `SYSTEM_HOOKS_DISABLED` the master switch only when its adapter reaches the shared hook-flags resolver, because phase 003 found adapters that check only their concern switch |
<!-- /ANCHOR:log -->
