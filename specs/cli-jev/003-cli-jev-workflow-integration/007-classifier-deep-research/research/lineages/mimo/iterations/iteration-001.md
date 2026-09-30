# Iteration 001 — mimo-01: The main AI's context spend: a counted baseline

- **Angle:** mimo-01 (W1, maps to C, H)
- **Lens:** UX and measurement. Every number is counted; every count names its method.
- **Read first:** no `steer.md` exists in this lineage yet (checked, absent). `LOCAL` read
  (`context/deem-local.md`): the served 0.8B answers in about 60 ms p50 per primitive on
  synthetic inputs (`deem-local.md:34-44`), it is uncalibrated (`deem-local.md:27`) and its
  quality on this repository is unmeasured (`deem-local.md:52`). Section 7 refinements applied:
  ALL-7 (dedupe by `message.id`, main-session and subagent files apart, cut-off
  `2026-09-27T06:22Z`, numbers only) and mimo-01 (the counting script is saved in this lineage
  and cited by `script:line`).
- **Sibling check:** Independent: no round-3 sibling file read.

## Method

The harness is `research/lineages/mimo/count-context-baseline.py` (cited below as `script`).
It streams every transcript under `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/`,
excludes records after the ALL-7 cut-off `2026-09-27T06:22Z` (`script:22`, `script:92-94`),
deduplicates assistant usage by `message.id` (`script:123-130`), classifies files by any
`isSidechain` marker (`script:187-196`), and prints numbers and record-type names only
(`script:199-241`). Full numeric output is saved at
`research/lineages/mimo/results-mimo-01.txt` (cited as `res`).

## Findings

### 1. Corpus (Q1 method statement)

93 transcript files, all classified main-session (0 carry an `isSidechain` marker)
(`res:2-4`), 856,226 records in scope and 1,678 excluded by the cut-off (`res:5-6`), spanning
2026-08-18 to 2026-09-27T06:21:59Z (`res:7-8`). Record types counted: `assistant` 154,292,
`user` 74,179, `attachment` 293,428 and 18 other type names (`res:9`). Confirmed by count.

### 2. Per-assistant-turn token usage (Q1)

Deduped by `message.id`, 66,498 unique assistant messages out of 154,292 assistant records —
usage indeed repeats per content block (2.3× duplication), confirming ALL-7's warning
(`res:11-12`; method `script:123-130`).

| Field | p50 | p95 | max | sum |
|---|---|---|---|---|
| input_tokens | 2 | 32 | 23,245 | 714,814 |
| cache_read_input_tokens | 384,219 | 887,519 | 966,814 | 28,770,448,889 |
| cache_creation_input_tokens | 1,391 | 6,391 | 966,369 | 327,701,973 |
| output_tokens | 712 | 3,553 | 47,030 | 75,678,071 |

(`res:13-17`, method `script:124-129`.) Nearly all input arrives through the cache: fresh
input is p50 2 tokens while the carried context is p50 384,219 tokens. Confirmed by count.

### 3. Tool calls per human prompt (Q2)

6,677 human prompts (user records with no tool result and no `toolUseResult`, `script:155-159`).
Read/Grep/Glob/Bash calls following each human prompt until the next: p50 0, p95 9, max 90,
sum 12,514 (`res:44-46`). Tool-use totals by name: Bash 12,172, Edit 826, Read 342, Write 248,
Monitor 135, Agent 102, and 19 further names; **Grep and Glob recorded zero tool_use calls**
(`res:18-43`) — repository search in this corpus runs through Bash (e.g. `rg` in shell), so a
"retrieval reranking" seam sees its queries inside Bash calls, not as Grep tool calls. Confirmed
by count.

Reads by target class (Q2 second half): other files 196, other markdown 103, `SKILL.md` 33,
`references/` 10, `ROUTER.md` 0 — 43 of 342 Reads (12.6%) open skill or reference material, and
no Read ever opened a `ROUTER.md` leaf (`res:47-52`; classification `script:36-48`). Confirmed
by count.

### 4. Surface shares (Q3)

Measured serialized payload bytes in corpus: attachment payloads 462,996,901 (71.3%), tool
outputs 185,728,321 (28.6%), system-record content 739,225 (0.1%), hook-injected context 0
(`res:64-69`). How: sum of `len(json.dumps(payload))` per surface (`script:137-149`,
`script:227-234`).

- **Tool outputs are the only prunable surface the harness measures directly**, and skill and
  reference loads sit inside them (the 43 Reads above). Their byte share of tool output is
  UNKNOWN today; the method that would measure it is one more bucket in `script:137-149`
  keyed on the Read path class.
- **Hook-injected context counts 0 events** (`res:70`) because the hooks emit their context as
  stdout JSON (`additionalContext` in the PreToolUse hook command at `.claude/settings.json:47`),
  which the transcript fields never store. Its byte cost is UNKNOWN with the method: sum the
  `additionalContext` string lengths the hook adapters print, obtainable from the hook scripts,
  not the transcripts.
- **Compaction briefs**: 217 `compact_boundary` system records (`res:60`), i.e. the context was
  compacted 217 times in this window. BASE2's K16 counted 222 boundaries on its date and notes
  every count drifts upward as sessions keep running (BASE2 says, `research.md:123`). Brief byte
  size is UNKNOWN (the summary text is not in a length-only field).
- **Attachment payloads dominate (71.3%)**, an input-side surface no classifier prunes; any
  round-3 savings claim that ignores it overstates its share of total context.

### 5. Re-reads cap file-relevance savings (Q4)

29 of 342 Reads (8.5%) re-open a path already read earlier in the same session file
(`res:53-54`, method `script:141-147`). Confirmed by count. A file-relevance classifier can at
most eliminate those 29 re-reads plus whatever fraction of the remaining Reads a relevance
judgment finds redundant; the 8.5% is the measured floor of provable waste, over 40 days.

### 6. The baseline number (Q5)

**Every round-3 context-reduction claim is measured against carried context per assistant turn:
p50 384,219 / p95 887,519 cache-read tokens (`res:15`).** Reason: it is the only per-turn
context quantity the transcripts record for every turn, it is what a reduction actually lowers
(along with `cache_creation`, p50 1,391, `res:16`), and it is counted, not estimated. Savings
claims report "tokens off the p50 carry" and, where a feature fires rarely, "per week" using
6,677 human prompts / 40 days ≈ 167 prompts per day (`res:45`, `res:8`).

### 7. Hook and router surface (Q3, hooks)

`.claude/settings.json:40-41` holds 8 PreToolUse command hooks at 5 s each, 2 UserPromptSubmit
hooks at 3 s, 7 SessionStart hooks (5×3 s, 2×5 s), 2 Stop hooks at 10 s, 1 SessionEnd hook at
10 s, 2 PostToolUse hooks (10 s and 5 s) and 1 PreCompact hook at 3 s (counted from the hook
blocks). Six `ROUTER.md` leaves carry `router_state: active` (`sk-code/ROUTER.md:13`,
`sk-doc/ROUTER.md:12`, `sk-design/ROUTER.md:11`, `mcp-tooling/ROUTER.md:12`,
`system-deep-loop/ROUTER.md:12`, `cli-external-orchestration/ROUTER.md:12`), totaling 1,572
lines (617+411+115+160+119+150). Confirmed by count. A ROUTER leaf is therefore never Read
through the Read tool in 40 days (`res:52`), while 33 Reads opened `SKILL.md` files
(`res:51`) — the router-load surface cost is carried in hook or prompt injection, which is the
UNKNOWN measured above.

## Per-idea record

### N-mimo-01-1 — tool-output pruning (classifier judges which tool output to carry on)

| Field | Content |
|---|---|
| **Idea** | `N-mimo-01-1`: a classifier truncates or drops tool results before they enter the carried context. Type: `score` (keep/drop weight per result) |
| **Question** | C |
| **Builds on** | new (priced by this baseline) |
| **Value** | Every turn's carry shrinks for the operator's main AI; the decision made cheaper is "what must stay in context" |
| **Seam** | The only in-repo seam is the PostToolUse hook slot at `.claude/settings.json:41` (2 hooks today, 10 s and 5 s); tool results themselves are harness-side |
| **Metric, baseline, harness** | Carried cache-read tokens per turn; baseline p50 384,219 / p95 887,519 (`res:15`); harness = `count-context-baseline.py` re-run with a tool-output byte bucket per result size decile |
| **Savings** | Upper bound: tool outputs 185,728,321 bytes over 66,498 turns ≈ 2,793 bytes/turn of measured result payload (`res:66`, `res:12`) — small against a 384K-token carry; mark estimate, byte-to-token ratio unmeasured |
| **Cost, latency, privacy** | Deem: one `choice` per tool result at ~60 ms p50 (`deem-local.md:36-38`), local, nothing leaves the machine; deadline: PostToolUse hook 10 s (`settings.json:41` block). Jev: sends state off the machine (BASE2's privacy table), needs a key. Spawn/connect cost unmeasured (`deem-local.md:50`) |
| **Two-backend gate** | Own switch `classifier.toolOutputPrune`. Jev: `command -v jev` + `jev 0.6.2` + `jev auth status --provider <p>` exit 0. Deem: `GET /health` on the local server parsing `backend` and refusing `stub` (ALL-4). Prefer Deem: frequency is per-tool-result and egress-sensitive. With neither: nothing is pruned, behavior exactly as today |
| **Rough LOC** | ~80-120 in one hook adapter plus settings entry; no existing file modified |
| **Verdict** | **later** — the measured prunable share is 28.6% of an input-side payload that is 28.6% of 649 MB while the per-turn carry is dominated by context the harness holds, and the byte-to-token ratio is unmeasured |
| **Confidence** | Counts confirmed from the corpus; the byte-to-token ratio and the harness seam are inferred — measuring both is the confirmation |

### N-mimo-01-2 — re-read avoidance (file-relevance judgment)

| Field | Content |
|---|---|
| **Idea** | `N-mimo-01-2`: a classifier flags a Read whose file was already read this session. Type: `choice` |
| **Question** | C |
| **Builds on** | This iteration's re-read count |
| **Value** | The operator's AI stops paying a second Read (and its tool result) for an unchanged file |
| **Seam** | PreToolUse hook slot at `.claude/settings.json:41` (the dispatch-preflight-lint and spec-gate-enforce hooks already sit there) |
| **Metric, baseline, harness** | Re-reads per 40 days; baseline 29 (`res:54`); harness = `count-context-baseline.py:141-147` re-run per feature |
| **Savings** | 29 Reads over 40 days ≈ 5/week; at the Read-result size this is tens of KB/week — count confirmed, savings estimate marked |
| **Cost, latency, privacy** | Deem ~60 ms (`deem-local.md:36-38`) per Read inside a 5 s PreToolUse timeout; local. Jev: egress per flag |
| **Two-backend gate** | Own switch `classifier.rereadFlag`; detection as above; prefer Deem (high frequency, privacy); with neither: exactly today's behavior |
| **Rough LOC** | ~40-60 plus a session-path cache |
| **Verdict** | **later** — 5 re-reads per week is below any operator-visible threshold, and the same flag could be a zero-call rules check |
| **Confidence** | Count confirmed; "below threshold" is judgment — what would change it: a per-team transcript count showing re-reads scaling with session length |

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| Per-turn carried context p50 384,219 / p95 887,519 cache-read tokens | new | `res:15` |
| Usage duplication factor 2.3× per `message.id` | new | `res:11-12` |
| Grep/Glob tool_use count is zero; search runs through Bash | new | `res:18-43` |
| Re-reads are 29 of 342 Reads (8.5%) | new | `res:54` |
| Attachment payloads are 71.3% of measured context bytes | new | `res:65` |
| Hook-injected context is unmeasurable from transcript fields | new | `res:70`, `.claude/settings.json:47` |
| 217 compact boundaries in 40 days | confirms BASE2 K16 with new evidence | `res:60`, BASE2 `research.md:123` |
| ROUTER.md leaves are never Read through the Read tool | new | `res:52` |

## Hand-off

- Extend the harness with a tool-output byte bucket per Read path class and per result size
  decile (mimo-04 needs both).
- Per-token conversion: find one place where a byte length and a token count of the same payload
  are both recorded, or mark every byte figure as byte-only.
- Re-run the corpus counts at each later wave boundary so the drift BASE2 K16 warns about is
  measured, not assumed.
- mimo-02 must bound its review-corpus `rg` pattern up front (mimo-02 refinement).
- Carry the baseline number (p50 384,219) into every later iteration's savings arithmetic.
