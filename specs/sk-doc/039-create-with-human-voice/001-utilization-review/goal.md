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
    last_updated_at: "2026-09-02T20:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive from the confirmed-open utilization findings"
    next_safe_action: "Reconcile the two scoring systems, which the other criteria depend on"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "039-001-utilization-goal"
      parent_session_id: null
    completion_pct: 0
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
landed, rather than carried over from the phase write-up.

| Item | State | Evidence |
|------|-------|----------|
| Two scoring systems reconciled | Pending | Both still shipped. Weights at `references/hvr-rules.md:40-44` and again at `:430-438`. The point system at `references/scoring-and-verification.md:74`, "A document starts at 100. Findings subtract" |
| Code payload not scanned as prose | Pending | Reproduces. `python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .opencode/skills/mcp-code-mode/assets/env-template.md` prints `template payload detected`, `x4 first@461 hard punctuation ;`, `hard blockers: 4`, exit 1. Line 461 is `});` closing a `typescript` fence |
| Six scenarios get a shipped target | Pending | `<target>` still stands in six scenario documents: `exempt-spans-are-named.md`, `word-sense-is-a-candidate.md`, `accuracy-outranks-the-standard.md`, `rescan-after-rewrite.md`, `judgment-pass-not-covered-by-the-scanner.md`, `code-and-quotations-untouched.md` |
| Prepared `SKILL.md` text applied | Pending | `SKILL.md:173` still reads the original step 5. The replacement is in this phase's `implementation-summary.md`, under Prepared Text, Not Applied |
| Hub vocabulary dependency recorded | Pending | Re-probed live at 2026-09-02T20:09Z, `freshness: live`. README prompt 0.7710 to `sk-create-readme`. Em dashes prompt 0.7183 `action: defer`. Sound-more-human prompt 0.3203 `action: defer`. Robotic prompt returns zero recommendations |
| Oxford heuristic on a two-clause comma | Pending | `scripts/hvr_scan.py:305-307` sets severity `review`, worth zero points. Fires as `x1 review oxford-comma-candidate , and` on the template above |
| Multi-line inline code span not masked | Pending | `scripts/hvr_scan.py:269` masks with a per-line `re.sub` over a single-line pattern, so a span that wraps is not covered |
| Worked example free to drift | Pending | In sync today: the scanner on `sk-create-repo-rule/README.md` prints the same six rows the example lists, `2 / -22 / 78`. Nothing pins it, so the next edit to that README breaks the example again |
| Document validator path classification | Pending | `.opencode/skills/sk-doc/scripts/validate_document.py:246` still reads `if '/specs/' in path_lower`, so a repo-relative `specs/...` path does not classify as a spec |
| Phase validates strict clean | Done | `NODE_PRESERVE_SYMLINKS=1 validate.sh specs/sk-doc/039-create-with-human-voice/001-utilization-review --strict` prints `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| The phase is committed, contrary to its own summary | `implementation-summary.md` says nothing is committed. `git log --oneline` on this folder shows `f92c84a673` and `710f2171d6`, both 2026-09-02, and `git status --porcelain` on the packet and the mode is empty. The summary sentence is stale, not wrong about what it did |
| The worked example is accurate right now | The phase already resynced it. What stays open is durability, not correctness, so this criterion can close on a written deferral under D1 through D5 rather than an edit |
| The document validator sits outside the mode | It is in `sk-doc/scripts`, so closing it means either a one-line fix in a file this packet does not own or a recorded deferral. Both satisfy the criterion, and neither is assumed |
<!-- /ANCHOR:log -->
