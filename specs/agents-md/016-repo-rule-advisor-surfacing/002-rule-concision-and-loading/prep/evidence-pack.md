---
title: "Evidence pack: repo rule load and compliance baseline"
description: "Measured token load of AGENTS.md and the 13 repo rules, how often sessions read them, and whether reading a communication rule changes the behaviour it forbids. Aggregates only; no transcript content."
trigger_phrases:
  - "repo rule compliance baseline"
  - "rule token load measurement"
importance_tier: "normal"
contextType: "research"
---

# Evidence pack: repo rule load and compliance baseline

Measured by the orchestrator on 2026-10-04 from this repository and from local Claude Code session transcripts. Only aggregate counts appear here. Rerun the compliance numbers with `prep/measure-rule-compliance.py <transcripts-dir> 200 2026-09-15`.

---

## 1. TOKEN LOAD

Bytes measured with `wc -c`; tokens estimated at about 4 bytes per token.

- `AGENTS.md`: 27,012 bytes, about 6.8k tokens. Always loaded.
- `REPO RULES.md`: 11,853 bytes, about 3.0k tokens. Loaded at Gate 5.
- The 13 rule files together: 107,092 bytes, about 26.8k tokens.
- The five reply-time rules named in `AGENTS.md` §8 (`communication.md`, `communication-prose.md`, `communication-decisions.md`, `communication-handoff.md`, `answer-the-actual-request.md`): 42,811 bytes, about 10.7k tokens.
- Largest files: `evidence-and-proof.md` 11,823, `delegation-and-orchestration.md` 11,712, `communication.md` 11,458, `communication-handoff.md` 10,803. Smallest: `uncertainty-and-honesty.md` 6,329.
- Everything at once (`AGENTS.md` + router + all rules): about 146 KB, about 37k tokens.

---

## 2. HOW OFTEN RULES ARE READ

Sessions that started on or after 2026-09-15 (44 sessions), counting `Read` tool calls on a rule file.

- Sessions reading at least one rule through `Read`: 14 of 44. Rules read through `cat` or `sed` in a shell are not counted, so this undercounts.
- A wider count over 82 sessions from 2026-09-02, including shell commands that name a rule path: `communication.md` 31, `communication-prose.md` 19, `answer-the-actual-request.md` 4, although `AGENTS.md` §8 says to load all five reply rules before any substantive reply.
- Sessions per rule (wider count, post-2026-09-15): blast-radius 19, communication 17, communication-prose 16, communication-handoff 15, delegation-and-orchestration 15, communication-decisions 12, prevent-overengineering 10, scope-discipline 10, evidence-and-proof 9, skill-hub-routing 7, uncertainty-and-honesty 5, root-cause-and-debugging 4, answer-the-actual-request 4.
- Re-reads of the same rule within one compaction window: 1. Re-reads after a compaction boundary: 104. Sessions already re-read about once per compaction, and almost never twice inside one window.

---

## 3. DOES READING A RULE CHANGE BEHAVIOUR

Long assistant replies (400+ characters, no tool call) in the 44 post-2026-09-15 sessions, split by whether the governing rule had been read earlier in that session. "Before" is a session that reads the rule later; "never" is a session that never reads it.

- **Table in a reply** (`communication.md` forbids it): before 17.4% of 219, after 20.3% of 1,063, never 11.6% of 86. Reading the rule shows no measurable association with fewer tables. Over 82 sessions the rate is about 23% in every group, with no decay by distance from the read (20.8% in replies 1-3 after it, 22.7% at 31+).
- **Semicolon in prose** (`communication-prose.md` forbids it): before 37.0% of 138, after 17.0% of 1,015, never 43.7% of 215. The one prohibition where reading roughly halves the rate, and it still fails in about one reply in six.
- **Em dash in prose** (`communication-prose.md` forbids it): before 2.2%, after 4.5%, never 6.5%. Already rare without the rule in this window. Including pre-rule sessions (2026-09-02 on) the never-read rate is 30.2%, so the earlier drop belongs to the period, not to the read.
- **Empty opener** ("Great question", "Let me", `communication.md` §3): 0.0% in every group. Not a live failure.
- **Label or heading as the first line** (`communication.md` §5): 2.3% to 2.7% in every group. Rare with or without the rule.

Caveats: detection is by pattern (`prep/measure-rule-compliance.py`), so a legitimate table inside a requested document counts, and a semicolon inside unfenced code counts. Sessions are not randomized: a session that reads a rule may differ in kind from one that does not.

---

## 4. PRIOR WORK TO READ

- `../../001-advisor-surfacing/research/research.md`: surfacing verdict. No advisor pointer, no trigger-index root, measure Gate 5 misses before any hook.
- `specs/hooks/022-smart-rule-injection/decisions.md`: the prompt-time injection bar and the rule that frequency is read from a log, never assumed.
- `specs/agents/010-repo-rule-system-integration/research/synthesis.md`: Gate 5 fires on write only; trigger rows that silently dropped fires.
- `specs/sk-communication/006-sk-communication-clarity/`: the program that wrote the communication rules, with measurement baselines in `003-root-doc-and-repo-rules/baselines/`.
- `.skilled/hooks/injection-contract.md` and `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts`: the existing once-per-epoch delivery and dedup machinery.
- `.skilled/skills/sk-doc/sk-create-repo-rule/`: the authoring mode, templates and `scripts/check-repo-rules.cjs`.

---

## 5. MEASURED DURING THE RUN

Added by the orchestrator after the lineages finished.

- Distinct rules loaded per compaction window: 93 of 265 windows load any rule. Those windows load 3.5 on average, median 3, p90 7, max 11.
- Card plus self-check (Fires when, The rule and SELF-CHECK sections, no frontmatter): 18,699 bytes for all 13 rules, 17% of the corpus, about 4.7k tokens. Per rule 1,020 to 2,254 bytes, 14% to 21% of each file. The five reply-time rules come to 7,453 bytes, about 1.9k tokens.
- The plain card (Fires when and The rule only) is 8,039 bytes.
- `AGENTS.md` delivered to Devin ends at byte 16,384, mid-line 175 of 285. Sections 5 to 10 are cut, including the §8 reply-rule load line at line 261.
