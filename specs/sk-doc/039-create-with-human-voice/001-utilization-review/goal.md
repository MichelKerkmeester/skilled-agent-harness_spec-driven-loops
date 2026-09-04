---
title: "Goal: Close The Utilization Findings"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/039-create-with-human-voice/001-utilization-review"
    last_updated_at: "2026-09-02T22:20:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed the completion criteria"
    next_safe_action: "Hand the recorded hub vocabulary to the sk-doc hub owner"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "039-001-utilization-goal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Close The Utilization Findings

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. It is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short: a
> truncated objective loses the tail, where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close the utilization findings so the create-with-human-voice mode is reachable and its scan trustworthy.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One scoring system survives. The point arithmetic is what a run reports, and the category weights are not a second one |
| D2 | The false positive is fixed in the scanner, and no fix may silence a prose payload fenced `markdown` |
| D3 | `SKILL.md` is compiled-policy input. Its only edit is the text prepared in this phase |
| D4 | Hub routing files stay out of scope. Reachability is recorded here, fixed hub side |
| D5 | A scenario target ships with the packet, and a scenario that edits copies it out |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these verbatim into the objective. Nothing dereferences a path, so a
criterion left only here is invisible to whatever judges completion.

- [ ] `hvr-rules.md` and `scoring-and-verification.md` state one scoring system
- [ ] `hvr_scan.py` exits 0 on `mcp-code-mode/assets/env-template.md`
- [ ] `grep -rn '<target>' manual-testing-playbook/` returns nothing
- [ ] `SKILL.md` step 5 carries the replacement text prepared in this phase
- [ ] The four missing prompts are recorded against `sk-doc/graph-metadata.json`
- [ ] Each lesser finding is closed or carries a written deferral
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`, `Errors: 0`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

Every row was re-checked against the working tree on 2026-09-02, after the phase
landed, rather than carried over from the phase write-up. The State column was then
re-checked a second time after the closing pass, against command output rather than
against the edit that produced it.

| Item | State | Evidence |
|------|-------|----------|
| Two scoring systems reconciled | Done | The scanner implements one arithmetic: `scripts/hvr_scan.py:56` charges 5, 2, 1 and 0, and `scan_text` returns `max(0, 100 - deductions)`. Nothing reads a category weight. `hvr-rules.md` section 1 now leads with that arithmetic under `### Scoring` and carries the shares under `### Where To Spend Attention`, section 9's table is retitled to match, and both say they compute nothing. `scoring-and-verification.md` section 3 states it is the only arithmetic. The standard still parses: `hvr_scan.py references/hvr-rules.md` reports `30 / -246`, unchanged, rather than exiting 2 |
| Code payload not scanned as prose | Done | `python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .opencode/skills/mcp-code-mode/assets/env-template.md` now prints `hard blockers: 0` and exits 0, against `4` and exit 1 before. The fix is in `mask_untargeted`: a template scan masks frontmatter and inline code as any scan does, and masks a fence tagged with a code language, while an untagged, `markdown`, `text` or `yaml` fence is read as the payload |
| Six scenarios get a shipped target | Done | `grep -rn '<target>' manual-testing-playbook/` returns nothing. Five fixtures ship beside the two originals, `HVS-001` and `HVS-002` share one, and the three scenarios that edit copy it to `/tmp` first. `validate-playbook-package.cjs --package <playbook root>` prints `PASS ... operator=9 routing_gold_excluded=0 violations=0 warnings=0`, exit 0 |
| Prepared `SKILL.md` text applied | Done | `SKILL.md:173` carries the replacement step 5 verbatim from `implementation-summary.md`. `hvr_scan.py SKILL.md` reports 0 hard blockers, exit 0 |
| Hub vocabulary dependency recorded | Done | Re-probed live at 2026-09-02T21:54Z, `freshness: live` on all eight, scores identical to both earlier runs. The four missing phrases are recorded under `Hub vocabulary dependency` below |
| Oxford heuristic on a two-clause comma | Done, no change | `scripts/hvr_scan.py` gives it severity `review`, worth zero points, and telling a serial list from a two-clause comma needs a parse of the clause rather than a pattern. A zero-cost advisory flag is the correct output. Reasoning recorded in `implementation-summary.md` |
| Multi-line inline code span not masked | Done | Masking now pairs backticks across a paragraph and stops at the blank line, which is where Markdown ends a code span. `test_hvr_scan.py` fails on this check before the change and passes after. No packet number moved: dirty `6 / -33 / 67`, clean `0 / -0 / 100`, the standard `30 / -246`, the worked example `2 / -22 / 78` |
| Worked example free to drift | Deferred, recorded | Pinning the example to a fixture would make it a scan of the packet's own test data, which is what the reference deliberately is not. Left as it is, with the drift risk written up in `implementation-summary.md` |
| Document validator path classification | Deferred, recorded | `.opencode/skills/sk-doc/scripts/validate_document.py:246` is outside this packet and no in-scope work needed it. Absolute paths make every phase document exit 0, which is what this packet uses |
| Phase validates strict clean | Done | `NODE_PRESERVE_SYMLINKS=1 validate.sh specs/sk-doc/039-create-with-human-voice --strict --recursive` prints `RESULT: PASSED` for the parent and for this phase |
| Scanner tests added | Done | `python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_scan.py` prints six `PASS` lines and `ALL PASS`, exit 0. Two of the six failed before the scanner change |

### Hub vocabulary dependency

`sk-doc/graph-metadata.json` belongs to the hub owner and is not edited here. Four of the
eight newcomer prompts still miss, and the phrasing each one needs is absent from the hub's
metadata today, checked by reading the file rather than assumed:

| Prompt | Result | Phrase the hub lacks |
|---|---|---|
| `make this README sound less like ChatGPT wrote it` | `sk-doc` 0.7709, stage two picks `sk-create-readme` | `sounds like ChatGPT`, weighted above the word README |
| `remove the em dashes and corporate filler from my documentation` | `sk-doc` 0.7182, below the 0.8 bar | `em dashes`, `corporate filler` |
| `can you make my writing sound more human?` | `sk-doc` 0.3202, below the bar | `sounds human`, `make my writing sound human` |
| `my blog post sounds robotic, rewrite it so it sounds like a person` | zero recommendations | `sounds robotic`, `sounds like a person` |

`human voice`, `sound human`, `voice pass` and `reads like AI` are already present, which is
why the other four prompts land. The gap is the plain phrasing a newcomer reaches for first.

### Deviations and findings

| Item | Note |
|------|------|
| The phase is committed, contrary to its own summary | `implementation-summary.md` says nothing is committed. `git log --oneline` on this folder shows `f92c84a673` and `710f2171d6`, both 2026-09-02, and `git status --porcelain` on the packet and the mode is empty. The summary sentence is stale, not wrong about what it did |
| The worked example is accurate right now | The phase already resynced it. What stays open is durability, not correctness, so this criterion can close on a written deferral under D1 through D5 rather than an edit |
| The document validator sits outside the mode | It is in `sk-doc/scripts`, so closing it means either a one-line fix in a file this packet does not own or a recorded deferral. Both satisfy the criterion, and neither is assumed. Closed as a recorded deferral |
| The template fix is not a sweep | Across the 50 template-detected documents under `.opencode/`, hard blockers fall from 594 to 520 and the files carrying one from 41 to 38. Every drop sits inside a code-tagged fence, a frontmatter block or an inline code span, all three of which a non-template scan already masks. The largest single drop, `sk-create-skill/assets/skill/skill-readme-template.md` from 43 to 0, is one `rg` command listing the blocked words |
| A fixture cannot meet the zero-blocker bar | Four of the five new fixtures carry blockers on purpose, exactly as the shipped `voice-dirty.md` does, because a target built to trip the scanner is what the scenario measures. `validate_document.py` exempts any path segment ending in `fixtures`, at line 181, and the zero-blocker rule was held to every other document this pass touched |
<!-- /ANCHOR:log -->
