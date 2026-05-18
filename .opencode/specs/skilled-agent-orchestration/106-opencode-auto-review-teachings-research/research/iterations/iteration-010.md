Iteration 010 complete. I've successfully documented the boundary detection + min-tool-call gate:

**Key findings:**
- **Boundary helpers** extracted verbatim from iter-004: `findLastRelevantUserBoundaryIndex`, `findLastAssistantAfterIndex`, `countToolCallsAfterIndex`
- **MIN_TOOL_CALLS gate**: default 3, configurable via `config.minToolCalls`, skips review if scoped tool count < threshold
- **Design rationale**: 3+ tool calls as heuristic for "non-trivial turn" — prevents reviewing chitchat and single-command queries
- **4 example session traces** with step-by-step gate evaluation showing: standard mid-session work, all-marker session (skip), boundary at index 0, single-tool-call turn (skip)
- **Comparison to local skills**: 
  - `sk-code-review`: PR-level scope (full diff/staged files/commit range), no min-evidence gate <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-code-review/SKILL.md" lines="105,266-268" />
  - `deep-review`: packet-level scope (target_files from applied tasks), no min-evidence gate <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/SKILL.md" lines="308,310" />
- **Adoptable pattern assessment**: Not directly applicable to PR/packet-level review (different targets and activation model), but useful for an inline reviewer that runs DURING a session

**Output:**
- `research/iterations/iteration-010.md` (158 lines)
- `research/deep-research-state.jsonl` (appended iteration record)

All acceptance criteria met. Ready for iteration 011.
ndex: number): SessionMessage \| undefined` | Reverse-scan from end to `boundaryIndex + 1`; return first assistant-role message; return undefined if none |
| countToolCallsAfterIndex | `function countToolCallsAfterIndex(messages: SessionMessage[], boundaryIndex: number): number` | Slice messages after boundaryIndex, delegate to countToolCalls for the slice |

**Supporting gate** (from iter-004):
- `isRelevantUserBoundary(msg: SessionMessage): boolean` — User-role + non-empty text + no review/feedback markers (REVIEW_MARKERS, SELF_ASSESSMENT_MARKER, FEEDBACK_MARKER)

### MIN_TOOL_CALLS Gate

| Aspect | Value |
|--------|-------|
| Default | 3 |
| Config key | `minToolCalls` (in auto-review.json config file) |
| Config resolution | `config.minToolCalls ?? 3` (nullish coalesce) |
| Effect | Skip review if `countToolCallsAfterIndex(messages, boundaryIndex) < MIN_TOOL_CALLS` |
| RunReview step | Step 10 (lines 310-313 in iter-005) |

**Design rationale**:
- Why 3? Heuristic for "non-trivial turn" — a one-tool-call turn is often a single lookup (e.g., `git status` or a file read). 3+ tool calls implies real work (read + write + test, or multiple edits).
- Why not "any tool call at all"? Avoids reviewing every echo/status query. A single `bash` command to check status shouldn't trigger a full cross-AI review.
- Why not "any text output"? Tool calls are a better proxy for "agent did substantive work" than text length. An agent could output 1000 lines of explanation without touching any files — that's chitchat, not work.

### Example Session Traces

#### Trace 1: Standard mid-session work

```text
Message 0: user — "Add a feature to parse CSV files"
Message 1: assistant — text + 4 tool calls (Read, Read, Write, Bash)
Message 2: user — "Now write tests for it"
Message 3: assistant — text + 3 tool calls (Read, Write, Bash)
Message 4: user — "AUTO-REVIEW [iteration tag]"  (← contains REVIEW_MARKER)
Message 5: assistant — text + 1 tool call (Bash test run)
```

**Step-by-step gate evaluation**:
1. `findLastRelevantUserBoundaryIndex`: reverse-scan from 5 to 0:
   - i=5: assistant → skip (not user)
   - i=4: user but has REVIEW_MARKER → `isRelevantUserBoundary` returns false → skip
   - i=3: assistant → skip
   - i=2: user, no marker, non-empty text → `isRelevantUserBoundary` returns true → return 2
2. `findLastAssistantAfterIndex(messages, 2)`: reverse-scan from 5 to 3:
   - i=5: assistant → return message 5
3. `countToolCallsAfterIndex(messages, 2)`: count tool calls in messages 3-5:
   - msg 3: 3 tool calls
   - msg 5: 1 tool call
   - Total: 4
4. MIN_TOOL_CALLS gate: 4 ≥ 3 → **review fires** on message 5's work scoped against user msg 2

#### Trace 2: All-marker session (no real work)

```text
Message 0: user — "AUTO-REVIEW [iteration 001]"
Message 1: assistant — "Review complete, no issues."
Message 2: user — "AUTO-REVIEW [iteration 002]"
Message 3: assistant — "Still no issues."
```

**Step-by-step gate evaluation**:
1. `findLastRelevantUserBoundaryIndex`: reverse-scan from 3 to 0:
   - i=3: assistant → skip
   - i=2: user but has REVIEW_MARKER → skip
   - i=1: assistant → skip
   - i=0: user but has REVIEW_MARKER → skip
   - No relevant boundary found → return -1
2. Boundary index is -1 → **review skipped** (runReview step 7 fails)

#### Trace 3: Boundary at index 0 (first message)

```text
Message 0: user — "Implement a login system"
Message 1: assistant — text + 5 tool calls (Read x2, Write x2, Bash)
Message 2: user — "Test it"
Message 3: assistant — text + 2 tool calls (Bash x2)
```

**Step-by-step gate evaluation**:
1. `findLastRelevantUserBoundaryIndex`: reverse-scan from 3 to 0:
   - i=3: assistant → skip
   - i=2: user, no marker, non-empty text → return 2
2. `findLastAssistantAfterIndex(messages, 2)`: reverse-scan from 3 to 3:
   - i=3: assistant → return message 3
3. `countToolCallsAfterIndex(messages, 2)`: count tool calls in message 3:
   - msg 3: 2 tool calls
   - Total: 2
4. MIN_TOOL_CALLS gate: 2 < 3 → **review skipped** (not enough tool calls)

**Note**: If boundary were at index 0 (first user message), tool count would cover the entire session (messages 1-3).

#### Trace 4: Single-tool-call turn

```text
Message 0: user — "What's the current git status?"
Message 1: assistant — text + 1 tool call (Bash git status)
```

**Step-by-step gate evaluation**:
1. `findLastRelevantUserBoundaryIndex`: reverse-scan from 1 to 0:
   - i=1: assistant → skip
   - i=0: user, no marker, non-empty text → return 0
2. `findLastAssistantAfterIndex(messages, 0)`: reverse-scan from 1 to 1:
   - i=1: assistant → return message 1
3. `countToolCallsAfterIndex(messages, 0)`: count tool calls in message 1:
   - msg 1: 1 tool call
   - Total: 1
4. MIN_TOOL_CALLS gate: 1 < 3 → **review skipped** (trivial query)

### Our Skills — Scope Concept Comparison

| Skill | Scope concept | Min-evidence gate | Where defined |
|-------|--------------|-------------------|---------------|
| Upstream auto-review | "after last relevant user message" (scoped turn) | 3 tool calls | runReview function (iter-005 steps 7-10) |
| sk-code-review | Full diff, staged files, commit range, or explicit file list (PR-level) | None (no min-evidence gate) | SKILL.md line 105 ("Review target scope"), line 266-268 ("Phase 1: Scope and Baseline") |
| deep-review | Packet directory / target_files from `{spec_folder}/applied/T-*.md` (spec-folder level) | None (iteration cap only) | SKILL.md line 308 ("target_files from applied/T-*.md"), line 310 ("expected-by-scope vs gap") |

**Key differences**:
- `sk-code-review` has no "last user boundary" concept — it reviews the entire diff provided (full PR, staged files, or explicit file list). The scope is set by the caller via git diff parameters or explicit file paths, not by session message analysis.
- `deep-review` operates at the spec-folder level, reviewing all target files defined in applied tasks (`T-*.md`). It has no concept of "last user message" or "scoped turn" — it audits the entire packet.
- Neither skill has a min-tool-call gate. `sk-code-review` would review a single-line change if requested; `deep-review` would audit a spec folder with minimal changes if dispatched.

### Findings — Adoptable Pattern?

The boundary + min-evidence gate is **not directly adoptable** for our current review surfaces because:

1. **Different review targets**: Our skills review PR diffs and spec folders (static code artifacts), not live session message streams. The "last relevant user message" concept only makes sense in a session context where messages arrive sequentially over time.

2. **Different activation model**: Upstream auto-review is event-driven (triggers on `session.idle` after each turn). Our skills are command-driven (`@review`, `/spec_kit:deep-review`) and review the entire target at once.

3. **Potential use case**: An **inline reviewer** that runs DURING a session (like the upstream plugin) would benefit from this pattern. For example:
   - A Claude/Codex session hook that reviews the last turn before the user sees the response
   - A "pre-delivery" gate that checks if the agent's last turn meets quality standards before showing output
   - A session-level audit that flags low-quality turns in real time

For such an inline reviewer, the boundary detection prevents re-reviewing old work (e.g., if the user says "continue" 10 times, only the latest turn is reviewed), and the min-tool-call gate prevents reviewing trivial status queries or single-command responses.

**However**, for our current PR-level and packet-level review surfaces, the pattern does not translate. Our review scope is already bounded by git diff ranges or spec folder boundaries, and we intentionally review the full target (not just the "last turn") to catch cross-file issues and architectural concerns that a scoped turn would miss.

## Convergence Signal
`newInfoRatio: 0.50` — moderate. Boundary helpers and min-tool-call gate fully documented with 4 example traces. Comparison to local skills shows the pattern is session-specific and not directly applicable to PR/packet-level review. `dimension status: FULLY EXTRACTED for boundary detection + min-tool-call gate`.
