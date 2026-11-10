---
title: "Open questions: decision capture"
description: "Operator questions saved overnight for the decision-capture series, each with the recommendation being followed until answered."
trigger_phrases:
  - "decision capture open questions"
---

# Open questions: decision capture

Questions saved overnight on 2026-11-01, to be asked at 07:00 or at your next reply. Until you answer, work continues on the recommendation shown, and each choice is recorded in this series' decision record. Any of them can be reversed.

---

## 1. Where the "Child guard" answer is recorded

**Context.** One answer captured this session asked whether to keep the context nudge out of dispatched child sessions; you said to fix it in the same push. It belongs to the decision-capture build, but no decision record has a row for it.

**Recommendation, being done now:** record it once in `001-decision-capture-build/decision-record.md`.

## 2. Changes coming out of the research run

**Context.** A 3-iteration DeepSeek research run is checking what was built in 001 and the plans for 002 to 006. It may recommend changing, merging, splitting or re-ordering children.

**Recommendation, being done now:** apply refinements that stay within a child's goal and record each one. If it recommends dropping or merging a child, that waits for you.

## 3. Commits and pushes

**Context.** Every Skilled commit and push needs your yes (D4). Waiting to be committed:
- the move of 042 into `043-decision-capture/001-decision-capture-build`;
- the new children 002 to 006;
- the goal files;
- the 001 corrections;
- the rebuilt trigger index, which currently also includes the uncommitted `specs/sk-doc/065-*` docs.

The research workflow also staged 41 files under `research/` with `git add`, as it is designed to. They are staged, not committed.

**Question.** Commit and push these once 002 is built and checked, or earlier?

**Answered 2026-11-02:** only after both tracks are checked, with the file list shown to you first. Recorded as Q011 in `decision-record.md`.

## 4. Stage marks between 006 and the shared runner

**Context.** 006's goal marks stages PASS, FAIL, DEVIATION or N/A. The shared runner from `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios` writes PASS, FAIL or SKIP.

**Recommendation, being done now:** 006 maps its marks onto the runner's. DEVIATION becomes FAIL with a reason, and N/A becomes SKIP with a named blocker.

## 5. Smaller 001 defects the research found

**Context.** The research lists D4 to D9 in `research/research.md` section 4. Two have an owner now: the Claude adapter's `process.cwd()` fallback (D4) is planned in 003, and the bolded or indented appendix label (D5) in 002. Three rest on the DeepSeek iterations only and were not rechecked: D6 (a re-save with a new answer never rewrites the appendix item), D7 (silent drops of unknown payloads, multi-select joined with ", ") and D9 (Q003 and Q004 missing from `consumed.jsonl`).

**Answered 2026-11-02:** fix D6 in 002 (REQ-017, AC-020, T021), not accepted risk. D7 and D9 stay accepted risk.

## 6. Ordering change

**Context.** The research found that 006's scenario needs only 065's scenario format, not its runner.

**Recommendation, being done now:** write 006's scenario files right after 065's phase 001 lands and before 002 is built. The 006 runs still wait for the runner.


## Luna's quota ran out overnight

**Context.** At about 22:40 UTC on 2026-11-01 every running cli-codex worker on `gpt-6-luna` stopped with "You've hit your usage limit", which resets at 02:22 on 2026-11-02. Three workers stopped part-way. Their finished parts were checked by running the tests and validators, not by reading their reports.

**Being done now, per the goals' worker rule:** the remaining implementation runs on `llmgateway/deepseek-v4.1-flash-1017` at thinking `max` through cli-pi. Luna is not routed through any gateway. If DeepSeek also fails, that item stops and is recorded here.

## Record 31, the "Runner" answer

**Context.** The only record of this session still pending is record 31, your answer that the conversation runner is shared and lives in the playbook skill. It is already written by hand as Q003 in `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/decision-record.md`, but that appendix item holds a shortened copy of the question, so the writer would add a duplicate Q005 rather than reuse Q003, and the matcher cannot read that table because it has no answer column.

**Recommendation, being done now:** leave it pending, which is safe. If you want it cleared, the smallest fix is to paste the full captured question into 065's Q003 appendix item and run one full-auto save at 065; the writer then reuses Q003.

## The "Child guard" answer

Recorded once, as Q008 in `001-decision-capture-build/decision-record.md`, through a full-auto save. A second save changed no byte.

## Consent for the live probes in 003 and 004

**Context.** 003 (spec.md, Scope: "Operator consent for one live Codex probe and one live Pi probe, each with a harmless question") and 004 (spec.md REQ-001 and REQ-002, OpenCode and Devin) need your consent before their live probes run. No consent is recorded. The session of 2026-11-02 did not start 003, 004 or 005 and stopped at handoff.

**Question.** May each of those four probes run one harmless question in a scratch project? Note for Codex: the conversation runner leaves Codex hooks untrusted in scratch projects (065 decision-record.md ADR-003), which the Codex probe in 003 T005 has to allow for.

**Answered 2026-11-02:** yes, all four (Q007). Codex hooks in scratch projects are trusted only in this series' 006 runs (Q008), and a Codex multi-select step keeps its extra choices typed as a note (Q009). All three are in `decision-record.md`.
