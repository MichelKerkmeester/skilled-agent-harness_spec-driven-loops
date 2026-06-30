# Deep Research Iteration 016 of 20 — Gap analysis vs sk-code-review skill

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 16 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context (REQUIRED)**:
- Iters 007-015 documented every mechanism from the upstream package (event activation, model selection, loop prevention, boundary, prompt, config, logging, child sessions, cost)

**Why this iter exists**: this is the FIRST gap-analysis iter. You compare every documented mechanism to our `sk-code-review` skill (`.opencode/skills/sk-code-review/SKILL.md`). The skill is the canonical "code review baseline" for our ecosystem. Map each upstream mechanism to: HAVE / DON'T HAVE / PARTIAL, with file:line evidence from sk-code-review. The output feeds iter 019 (ranked teaching list).

## TASK

### Step 1 — Read sk-code-review SKILL.md fully

```bash
wc -l .opencode/skills/sk-code-review/SKILL.md
cat .opencode/skills/sk-code-review/SKILL.md
```

Also scan related references:

```bash
ls .opencode/skills/sk-code-review/references/ 2>/dev/null
ls .opencode/skills/sk-code-review/assets/ 2>/dev/null
```

### Step 2 — Re-read prior iter outputs

```bash
for N in 007 008 009 010 011 012 013 014 015; do
  echo "=== iter-$N summary ==="
  rg -A 4 '^## Summary' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-$N.md 2>/dev/null
done
```

### Step 3 — Build the gap matrix

For each upstream mechanism, fill the gap-analysis table:

| Mechanism | Upstream evidence | Local sk-code-review evidence | Have it? | Notes |
|-----------|-------------------|------------------------------|----------|-------|
| Event-driven activation (session.idle) | auto-review.ts:event handler | <grep sk-code-review for "trigger"> | <HAVE/DON'T/PARTIAL> | <notes> |
| Cross-model selection algorithm | inferReviewModels | <grep for "model" / "cross-AI"> | <answer> | <notes> |
| Cross-AI family bias (different family first) | rank function | <evidence or absence> | <answer> | <notes> |
| Loop-prevention markers (text-based) | REVIEW_MARKERS | <evidence> | <answer> | <notes> |
| Loop-prevention session-set | reviewSessionIDs | n/a (sk-code-review is user-triggered, no sessions) | DON'T HAVE | not applicable |
| Loop-prevention dedup map | reviewedMessageBySession | <evidence> | <answer> | <notes> |
| Boundary detection (last user msg) | findLastRelevantUserBoundaryIndex | <evidence> | <answer> | <notes> |
| Min-evidence gate (MIN_TOOL_CALLS) | runReview gate | <evidence> | <answer> | <notes> |
| Structured prompt template | reviewPrompt template literal | <evidence in SKILL.md sections> | <answer> | <notes> |
| Severity vocabulary (PASS/FAIL/UNKNOWN) | template | <vs our P0/P1/P2 in sk-code-review> | <answer> | <notes> |
| Final-line exact-string contract | template | <evidence> | <answer> | <notes> |
| Anti-repetition rule | template | <evidence> | <answer> | <notes> |
| Bounded evidence interpolation | template (.slice(0,2000/3000)) | <evidence> | <answer> | <notes> |
| 3-tier config (file/env/default) | loadConfig + plugin init | <evidence> | <answer> | <notes> |
| Dynamic model discovery | client.config.providers | n/a (sk-code-review doesn't dispatch models) | DON'T HAVE | not applicable |
| Diagnostic logging (per-workspace) | initDebugLogger | <evidence> | <answer> | <notes> |
| Child-session isolation | client.session.create({parentID}) | n/a | DON'T HAVE | not applicable |

### Step 4 — Identify "would benefit from adopting" candidates

For each upstream mechanism marked DON'T HAVE in sk-code-review, decide: would adopting it improve the skill? Justify in 1 sentence.

| Mechanism | Adopt? | Justification |
|-----------|--------|---------------|
| Cross-model family bias | YES/NO/MAYBE | <reason> |
| Loop-prevention markers | YES/NO/MAYBE | <reason> |
| Boundary detection | YES/NO/MAYBE | <reason — note that sk-code-review operates on PR diffs, not session turns> |
| PASS/FAIL/UNKNOWN vocabulary | YES/NO/MAYBE | <reason — note that we have P0/P1/P2> |
| Final-line exact-string contract | YES/NO/MAYBE | <reason — useful for machine parsing> |
| Anti-repetition rule | YES/NO/MAYBE | <reason — prevents reviewer-fixing-code anti-pattern> |
| 3-tier config | YES/NO/MAYBE | <reason — sk-code-review is a skill, not a plugin; less applicable> |
| Diagnostic logging | YES/NO/MAYBE | <reason> |

### Step 5 — Identify "definitely don't adopt" candidates

Some mechanisms only make sense for runtime plugins, not user-triggered skills. List those with rationale.

## SCOPE

- `.opencode/skills/sk-code-review/SKILL.md` (full file)
- `.opencode/skills/sk-code-review/references/` + `.opencode/skills/sk-code-review/assets/` (if present)
- Iter outputs 007-015
- **No writes outside `research/iterations/iteration-016.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
wc -l .opencode/skills/sk-code-review/SKILL.md
cat .opencode/skills/sk-code-review/SKILL.md

ls -la .opencode/skills/sk-code-review/

for N in 007 008 009 010 011 012 013 014 015; do
  echo "=== iter-$N findings header ==="
  rg -A 3 '^## Findings' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-$N.md 2>/dev/null
done
```

## CONSTRAINTS

- READ-ONLY.
- Cite sk-code-review file:line for every "we have X" claim.
- Cite "not found" with the exact grep that returned nothing for every "we don't have X" claim.
- Don't pretend a mechanism applies if it doesn't (e.g. session-set doesn't apply to user-triggered skills).

## COMMON FAILURE MODES

1. **False positives on grep**: "review" matches everywhere; use more specific search terms ("severity", "PASS/FAIL", "minToolCalls", "marker").
2. **Confusing "we have it in deep-review" with "we have it in sk-code-review"**: this iter is about sk-code-review SPECIFICALLY. Don't credit other skills.
3. **Skill-vs-plugin distinction**: some upstream mechanisms (runtime event hooks, session-set, dynamic discovery) ONLY apply to runtime plugins, not user-invoked skills. Mark those as `n/a` not `DON'T HAVE`.

## OUTPUT FORMAT

Write to `research/iterations/iteration-016.md`:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha> -->

# Iteration 016 — Gap analysis vs sk-code-review

## Summary
<2-4 sentence verdict on the gap profile>

## Findings

### sk-code-review Skill Overview
- File: `.opencode/skills/sk-code-review/SKILL.md` (<N> lines)
- Activation: <user-triggered / auto-triggered>
- Scope unit: <PR diff / file list / packet>
- Severity scheme: <P0/P1/P2 / other>
- Output contract: <findings-first / freeform>

### Gap Matrix (17 mechanisms)
| Mechanism | Upstream evidence | Local sk-code-review evidence | Have it? | Notes |
|-----------|-------------------|------------------------------|----------|-------|
| <17 rows from Step 3 + n/a rows> | | | | |

### Adopt? Decision Table
| Mechanism | Adopt? | Justification |
|-----------|--------|---------------|
| <rows for each DON'T HAVE that's not n/a> | | |

### Definitely Don't Adopt (skill-vs-plugin mismatch)
| Mechanism | Rationale |
|-----------|-----------|
| Event-driven activation (session.idle) | sk-code-review is a skill, not a plugin; activated by user request not session event |
| <other rows> | |

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — high (0.6-0.8) since this is the first gap-analysis pass.
```

Then append to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":16,"focus":"gap vs sk-code-review","mechanismsExtracted":0,"gapsIdentified":<N>,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] sk-code-review overview block (5 fields)
- [ ] Gap matrix has ≥ 17 rows (one per mechanism)
- [ ] Every "we have X" claim has file:line evidence
- [ ] Every "we don't have X" claim has a grep that returned nothing
- [ ] Adopt-decision table has ≥ 5 rows (for the DON'T HAVE non-n/a cases)
- [ ] Definitely-don't-adopt table has ≥ 3 rows
- [ ] Output file ≥ 100 lines

Begin.
