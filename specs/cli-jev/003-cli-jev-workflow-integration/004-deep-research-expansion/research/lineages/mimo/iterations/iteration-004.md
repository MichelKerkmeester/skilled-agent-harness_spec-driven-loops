# Iteration 4 — mimo-04: What the operator actually runs: usage-ranked seams nobody examined (RQ6)

**Lineage:** `mimo` (UX and measurement lens)
**Session:** `fanout-mimo-1790457982528-yjdrdz`
**Focus Area:** `mimo-04` — What the operator actually runs: usage-ranked seams nobody examined
**Angle question:** Rank the operator's real surfaces by usage, find the high-frequency ones no seam and no BASE row covers, and split the host compactions by watched versus unattended (question 29).

## Sibling check

Read before starting, per the W2 contract:
- `../grok/iterations/iteration-005.md` (grok's newest, iteration 5) — its build order and kill list.
- `../deepseek/iterations/iteration-005.md` (deepseek's newest, iteration 5) — its failure-mode matrix.
- `../swe/iterations/iteration-001.md` and `../swe/iterations/iteration-002.md` (swe's newest, iterations 1–2) — swe-01's `verdict` function and swe-02's transcript record-shape work.

Push-past, each grounded in a count I ran myself:
- swe-02 (Q3, question 25) asks what the transcript records after a compact boundary. My boundary-timestamp artifact below (p50 gap −1.16 s between the `compact_boundary` stamp and the next user-turn record) is evidence for its parser design: records after the boundary carry timestamps *earlier* than the boundary stamp, so any replay-detection rule keyed on monotonic time will misfire. Name it in the census parser.
- grok-05 and deepseek-05 both size R19 by BASE's 208 compactions; my count is 209 (one more since round 1) and the watched-versus-unattended split they assume is unmeasurable by the within-a-minute rule as written (below). Their orders inherit that UNKNOWN.

## Grounding opened this iteration

- `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/*.jsonl` — counted by `node -e` walks: tool-use names, slash-command tokens (name extraction only), skill-invocation names, hook event names, attachment and record type names, `compact_boundary` fields and session-shape fields. No prompt, reply or tool text read or copied (contract rule 9).
- `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/context/seam-map.md` — the S01–S26 list (`rg` of its headings).
- `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/context/repo-rules-digest.md:52-110` — the Q1–Q15 checklist and the red flags (read for question 3).
- No repository module run, no `jev` call of either package, no network, no `.env` opened.

## Usage ranks (counts only)

**Tools (top ten).** Bash 56,942 · Edit 3,222 · Read 1,933 · Write 1,466 · Agent 942 · AskUserQuestion 516 · Monitor 273 · ToolSearch 233 · SendMessage 108 · WebFetch 107. (Then Skill 88, TaskStop 85, TaskOutput 45, Grep 33, WebSearch 27.)

**Hook events (top ten, by `hookName`/`hookEvent` on `hook_success` attachments, 175,678 total).** PostToolUse:Bash 84,443 · PreToolUse:Bash 62,442 · Stop 7,241 · PostToolUse:Edit 4,498 · PostToolUse:Read 2,448 · PreToolUse:Edit 2,327 · PostToolUse:Write 2,096 · PostToolUse:Agent 1,337 · PreToolUse:Read 1,310 · PreToolUse:Write 1,137. (SessionStart:compact 876, PreToolUse:Agent 865, PostToolUseFailure:Bash 710, PostToolUse:AskUserQuestion 702, SessionStart:startup 387.)

**Skill invocations (`Skill` tool, 88 total).** sk-git 20 · sk-code 13 · deep:research 13 · deep:review 10 · system-spec-kit 7 · sk-doc 7 · system-deep-loop 4 · artifact-design 4 · prompt:improve 2 · sk-prompt 2.

**Slash-command tokens in user turns (name extraction; path tokens `/Users`, `/tmp`, `/abs` excluded).** /speckit:save 28 · /rewrite:response 24 · /speckit:resume 20 · /deep:* 8 · /create:agent 7 · /memory:save 7 · /deep:research 6 · /loop 3 · /rewrite:response-by-external-agent 3 · /deep:review 3 · /babysit-prs 1 · /schedule 1.

## Coverage: which top-ten surfaces have no seam and no BASE row

| Surface | Count | Seam / BASE row | Typed judgment today, and who reads it |
|---|---|---|---|
| AskUserQuestion | 516 uses, 702 PostToolUse hook events | **none in S01–S26, no BASE row** | None by a model: the harness presents options and the *operator* judges. The agent formulates the question; nothing scores whether it is answerable. The operator reads it — the only high-frequency surface where the human is the judge. |
| Monitor | 273 | **none** | Liveness/exit-code by code; the agent reads it. |
| ToolSearch | 233 | **none in S01–S26, no BASE row** | A relevance ranking by a search heuristic; the agent reads it — which tools get loaded into context. The outside commenter's thesis (Hermes post `:120`, via BASE §4 item 9) is exactly this surface: Jev "for choosing which tools and skills to load". |
| SendMessage | 108 | **none** | Routing by the harness; agents read it. |
| /rewrite:response | 24 | sk-communication projection surface, no R row | Output-shape conformance by rules; the operator reads the reply. |
| /speckit:resume | 20 | continuity surface, no R row | Packet-match retrieval; the operator reads the recovered context. |
| Bash, Edit, Read, Write | 56,942 / 3,222 / 1,933 / 1,466 | covered generically (S11/S12 guard Bash) | Mechanics, not typed judgments. |
| Agent | 942 | S11 task dispatch guard | Dispatch allow/deny by rule; the harness reads it. |
| WebFetch | 107 | R16 injection screen | Content trust; nothing reads a verdict today. |
| Stop hook | 7,241 events | S09 completion-claim detection (R4) | Completion claim by model. |

Skill and command surfaces map cleanly (deep:research → S15/S16, deep:review → S17, sk-git → S12, system-spec-kit → S23/S24/S25, /speckit:save → S23). The uncovered band is the harness plumbing around the agent: **AskUserQuestion, Monitor, ToolSearch, SendMessage** — 1,130 tool uses and 702 hook events between them, no seam, no BASE row.

## Question 29: the host compactions, split and sized

Detector archaeology first, because two naive detectors were wrong and the failures are themselves findings:

1. The only `attachment.type` matching /compact/i is `compact_file_reference` (279) — file references, not compaction events.
2. The compaction events are top-level records with `subtype: "compact_boundary"` (**209**; fields `compactMetadata,content,cwd,entrypoint,gitBranch,isSidechain,level,logicalParentUuid,parentUuid,sessionId,slug,subtype,timestamp,type,userType,uuid,version`). BASE's 208 is this set one record older.
3. **The within-a-minute rule is ill-posed on this format.** Every boundary is followed in file order by a user-turn record whose timestamp is *earlier* than the boundary stamp (gap p50 **−1.16 s**, p90 −0.89 s, n=209): the boundary is stamped mid-turn while the context is rebuilt, and the rebuilt block replays the turn's records with their original stamps. A monotonic-time rule reads this as "the user came 1.2 seconds too early" and an any-user-record rule (which counts tool-result records, 66,124 of them) reads 209/209 watched. Neither number is evidence.

What the session-shape fields do say, counted today:

| Field | Value | Count |
|---|---|---|
| `isSidechain` | false | 209/209 |
| `userType` | external | 209/209 |
| `entrypoint` | cli | 209/209 |
| `compactMetadata.trigger` | auto / manual | 206 / 3 |
| `compactMetadata.durationMs` | p50 104,212 ms · max 280,341 ms | n=209 |

**Answer to question 29:** the transcript cannot split watched from unattended with the rule as written; what it can show is that all 209 compactions sit on the main thread (never a sidechain) of user-originated CLI sessions, 98.6% triggered `auto`, each costing a p50 104-second wait in the middle of a turn. So the wait lands on the operator's own thread every time; whether eyes were on it is not recorded anywhere. For sizing R19: the value accrues to whoever sits at that terminal, and BASE's framing "does the operator watch or is it unattended" should be replaced with "the operator's turn always absorbs the wait (p50 104 s), watched or not". The round-1 count of 208 becomes **209**.

## Per-idea records

### Idea 1: `N-mimo-04-1` — ToolSearch re-rank arm with self-labeled gold (choice)

| Field | Record |
|---|---|
| **Idea** | A `choice` that re-ranks ToolSearch's candidate tools for a query, Python `jev-cli` 0.6.2. Gold comes free from the transcript: the tool the agent actually invoked after the search. |
| **Builds on** | RQ6; the Hermes-post thesis quoted in BASE §4 item 9; R1's cluster-choice design (same family). |
| **Value** | Wrong tool exposure wastes context and turns in the highest-volume agent surface after Bash (233 searches). The decision is which tools enter the window; today a search heuristic decides and nobody measures it. |
| **Seam** | The ToolSearch tool surface (no repo file named in this iteration's counts — the seam is the runtime's, not this repository's). **Seam UNKNOWN until located; this blocks the build.** |
| **Metric, baseline, harness** | Rank of the invoked tool in the returned set (MRR-style), baseline = today's order, harness = the transcripts themselves (233 search-then-use pairs, extractable with zero labels). No harness run exists; extraction script is the smallest missing harness. |
| **Cost, latency, privacy** | One call per search-then-use pair, offline rerank; queries leave the machine. |
| **Key gate and no-key behavior (D5)** | Would follow R1's flag and gate pattern exactly; with no key the current search order stands. |
| **Rough LOC** | Not estimable until the seam is located. |
| **Verdict** | **later.** The gold source is real and free, but this is the second ranking arm of R1's family: restraint says the family's first measurement (R1) lands before a second arm is designed, and the seam is not yet a repository file. Promote to next if R1 keeps and the seam locates. |
| **Confidence** | Confirmed: 233 ToolSearch uses in the transcripts (count). Inferred: that the invoked tool is the right gold — what would confirm: a 20-pair manual read of search-then-use adjacency. |

### Idea 2: `N-mimo-04-2` — question-quality lint on AskUserQuestion (noul), the R20 sibling

| Field | Record |
|---|---|
| **Idea** | A zero-call lexical lint over AskUserQuestion prompts: is the question answerable from what the operator has been shown, does each option decide anything, is there a hidden "other". Later an optional `noul` Jev arm. |
| **Builds on** | RQ6; R20's lint design (same shape, different surface); the 516 asks and 702 PostToolUse:AskUserQuestion events counted today. |
| **Value** | The operator's most frequent explicit decision is answering these 516 questions; a bad question costs operator time directly. The lint makes question quality visible to whoever authors prompts (agents and command YAMLs). |
| **Seam** | No repository seam named yet: the harness surface is the runtime's. The lint itself would sit beside R20's lint script as a second rule family. **Seam UNKNOWN until located.** |
| **Metric, baseline, harness** | Share of questions failing each rule, against a stratified sample of the 516 prompts (names and structure only under the private-data rule; the operator would label). Baseline UNKNOWN. |
| **Cost, latency, privacy** | Zero calls for the lexical form; prompts are local. |
| **Key gate and no-key behavior (D5)** | Same pattern as R20; lexical lint needs no key. |
| **Rough LOC** | 80–150 LOC as a second rule family in R20's script, or later. |
| **Verdict** | **later,** and honestly marginal: the red-flag test "delegation that costs more than the judgment it replaces" (`repo-rules-digest.md:105`) must not be tripped by making the agent judge the questions it asks the human. Build only after R20's lint exists and shows the same rule family works on criteria. |
| **Confidence** | Confirmed: the counts. Inferred: that question quality is measurably bad — what would confirm: one 30-prompt sample labeled by the operator. |

### Idea 3: `R19` — compaction recall census, sizing update (noul, later arm)

| Field | Record |
|---|---|
| **Idea** | As BASE R19, with the corpus re-counted: 209 compactions, all main-thread, trigger auto 206/209, p50 104.2 s. |
| **Builds on** | BASE R19 and question 29. |
| **Value** | Unchanged in kind; the wait is now known to land on the operator's thread in user-originated sessions, which strengthens the census's case (build-now per BASE D1) without changing its zero-call shape. |
| **Seam** | `compact_boundary` record shape (fields above), opened this iteration by count. |
| **Metric, baseline, harness** | Census numbers as BASE; the watched/unattended column is replaced by `isSidechain`/`userType`/`trigger` breakdowns because the within-a-minute split is ill-posed. |
| **Cost, latency, privacy** | Zero calls (census), as BASE. |
| **Key gate and no-key behavior (D5)** | As BASE. |
| **Rough LOC** | As BASE; the parser gains a boundary-timestamp rule (see Hand-off). |
| **Verdict** | **build-now for the census** (unchanged from BASE, now with a 209 corpus), **later for the arm**. |
| **Confidence** | Confirmed by count: corpus size and shape. |

## Ruled out this iteration

- Reading any prompt, reply or tool text from the transcripts: names, field names and counts only (contract rule 9). The 516 AskUserQuestion prompts were never opened.
- Treating the within-60s result from the naive detectors as answer to question 29: both directions of the detector bug (tool-result user records; array-vs-string content) were fixed and the final answer is "the rule is ill-posed", not a percentage.
- A Jev arm on Monitor, SendMessage or the Stop hook: these make no typed judgment a lens could improve; the Stop hook already has S09.
- Building anything: research only (parent D7).

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence, or restated | Evidence |
|---|---|---|
| The uncovered high-frequency band is harness plumbing: AskUserQuestion (516 uses, 702 hook events), Monitor (273), ToolSearch (233), SendMessage (108) — none in S01–S26, none in BASE | new | the usage counts; `seam-map.md` heading list |
| ToolSearch is the real-world surface for the Hermes-post thesis ("choosing which tools and skills to load"), with free self-labeled gold from search-then-use adjacency | new | counts; BASE §4 item 9 quotes the thesis but never maps it |
| Question 29's split is ill-posed on this format: boundary stamps postdate the next user record by ~1.2 s (p50 −1.16 s), so monotonic-time and any-record detectors give opposite answers (0/209 vs 209/209) | new; contests the method in BASE's open question 29 | the gap distribution, n=209 |
| All 209 compactions are main-thread (`isSidechain` false), user-originated (`userType` external), trigger auto 206/209, p50 104.2 s, max 280.3 s | new | the field breakdowns |
| The compaction corpus is 209, one more than BASE's 208 | confirms BASE with new evidence | `compact_boundary` count today |
| `compact_file_reference` (279) is not a compaction event; the events are `subtype: compact_boundary` records carrying `compactMetadata` | new (parser fact for swe-02) | attachment-type scan |
| Usage scale the program sits on: Bash 56,942 calls, Stop hook 7,241 events, hook_success attachments 175,678 | new | transcript counts |

## Sibling check (detail)

Named above under the W2 contract: `../grok/iterations/iteration-005.md`, `../deepseek/iterations/iteration-005.md`, `../swe/iterations/iteration-001.md`, `../swe/iterations/iteration-002.md`. Agreements count only where I cite my own counts; the two push-pasts (swe-02's replay-detection rule, grok-05/deepseek-05's R19 sizing) do.

## Hand-off

- swe-02's census parser: handle the boundary-timestamp artifact (records after `compact_boundary` carry earlier stamps) and count `compact_boundary`, not `/compact/i` attachments — `compact_file_reference` is a decoy (279).
- The synthesis's question 29 row: replace "watched vs unattended" with the session-shape answer (209 main-thread, auto 206, p50 104.2 s) and mark the within-a-minute rule ill-posed.
- mimo-05 takes the corpus sizes: 209 compactions (R19 value side), 516 questions (operator time), 233 searches (ToolSearch arm sizing).
- Whoever owns Q1–Q15 scoring for RQ6: N-mimo-04-1 fails Q1 only (no harness run) and Q4 (seam not a repo file); N-mimo-04-2 fails Q1 and trips the delegation red flag until R20 exists.
