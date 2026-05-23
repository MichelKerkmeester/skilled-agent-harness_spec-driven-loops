# Deep Research Iteration 011 of 20 — Prompt template structure (scope contract, checklist, PASS/FAIL final-line contract)

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 11 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context (REQUIRED)**:
- Iter 005 should have quoted the REVIEW PROMPT TEMPLATE verbatim and the final-line PASS/FAIL contract

**Why this iter exists**: the reviewer prompt is the most reusable artifact in the package. It's a small, well-engineered prompt that establishes scope, anti-repetition rules, focus areas, evidence interpolation, an explicit checklist, and a strict final-line contract. Every word in that template is doing work. Our `sk-code-review` skill's SKILL.md is much larger but is the prompt structure as tight?

**Why this matters for us**: we have several places that could adopt a tighter reviewer-prompt contract: `sk-code-review`, `deep-review`, `deep-agent-improvement`, and any future auto-trigger plugin we build. The structured PASS/FAIL/UNKNOWN with file:line evidence is exactly what we already have in deep-review's "P0/P1/P2 findings" but generalized to a smaller turn-by-turn scope.

## TASK

### Step 1 — Re-quote the prompt template verbatim from iter-005

```bash
sed -n '1,400p' .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-005.md | rg -A 100 'REVIEW PROMPT TEMPLATE'
```

If iter-005's output has the verbatim template, copy it into your own output. Otherwise re-fetch the file:

```bash
SHA=$(rg -oP 'PINNED_UPSTREAM_SHA:\s*\K[0-9a-f]{40}' .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-001.md | head -1)
gh api "repos/dzianisv/opencode-plugins/contents/packages/auto-review/auto-review.ts?ref=$SHA" \
  --jq '.content' 2>/dev/null | base64 -d > /tmp/upstream-auto-review-011.ts \
  || curl -sL "https://raw.githubusercontent.com/dzianisv/opencode-plugins/$SHA/packages/auto-review/auto-review.ts" > /tmp/upstream-auto-review-011.ts

# Find the prompt template (look for "AUTO-REVIEW\\n\\n" or "reviewPrompt =")
grep -n 'reviewPrompt\|AUTO-REVIEW' /tmp/upstream-auto-review-011.ts
sed -n '<line-of-template-start>,<line-of-template-end>p' /tmp/upstream-auto-review-011.ts
```

### Step 2 — Dissect the template into 9 sections

Break the prompt down into:

1. **Header**: `"AUTO-REVIEW\n\n"` — the loop-prevention marker
2. **Mission statement**: 2-3 sentences on the reviewer's purpose
3. **Rules block**: explicit anti-patterns (scope to after last user msg, don't repeat the task, focus on correctness/verification/edge cases)
4. **Context metadata**: Observed model, Review model, Tool calls in scoped turn
5. **Evidence interpolation**: Last relevant user message (truncated 2000) + Last assistant message (truncated 3000)
6. **Checklist** (5 items):
   - task completion
   - tests run/pass
   - PR exists if code changes were made
   - CI passed if applicable
   - obvious issues / bugs / missed edge cases
7. **Return contract — section 1**: "Checklist with PASS/FAIL/UNKNOWN and brief evidence"
8. **Return contract — section 2**: "Issues (only real gaps)"
9. **Return contract — section 3**: "Final line exactly one of"
   - `Review passed — no issues found.`
   - `Review failed — <brief reason>.`

For each section, quote VERBATIM and explain its role.

### Step 3 — Compare to our review prompts

```bash
# Check sk-code-review's prompt scaffolding
rg -nC5 'PASS|FAIL|UNKNOWN|findings-first|severity|P0|P1|P2|checklist|final.line|return.format' \
  .opencode/skills/sk-code-review/SKILL.md 2>&1 | head -50

# Check deep-review for prompt structure references
rg -nC3 'prompt|return.format|final.line|severity' .opencode/skills/deep-review/SKILL.md 2>&1 | head -30

# Check deep-review's iteration prompt template (in spec_kit:deep-review skill)
ls .opencode/skills/deep:start-review-loop/ 2>/dev/null
```

Comparison table (per design element):

| Design element | Upstream auto-review | sk-code-review | deep-review |
|----------------|---------------------|----------------|-------------|
| Loop-prevention header | "AUTO-REVIEW\n\n" | none | none |
| Scope contract | "after last user msg" | "PR-wide" / "file list" | "packet directory" |
| Anti-repetition rule | "Do not repeat the task" | <yes/no/where> | <yes/no/where> |
| Checklist | 5 items, fixed | <how many, dynamic?> | <how many> |
| Severity vocabulary | PASS/FAIL/UNKNOWN | <severity terms> | <P0/P1/P2 terms> |
| Final-line contract | exactly one of 2 strings | <free-form / fixed> | <fixed by template> |
| Evidence interpolation | last user msg (2000) + last assistant (3000) | <full diff / scope file list> | <full packet> |

### Step 4 — Identify the most reusable patterns

Rank the 9 sections by reusability for our codebase. Likely winners:
- **Header / loop-prevention marker** — already discussed in iter-009; cheap to adopt
- **Final-line contract** — exact-string match → machine-readable; useful for deep-review automation
- **Anti-repetition rule** — useful for sk-code-review (avoid LLMs that "fix" issues during review)
- **Severity vocabulary PASS/FAIL/UNKNOWN** — simpler than P0/P1/P2, might suit per-turn reviews

## SCOPE

- Iter outputs 005, 003 (verbatim template + markers)
- Local: `.opencode/skills/sk-code-review/SKILL.md`, `.opencode/skills/deep-review/SKILL.md`
- Optional: `.opencode/skills/deep:start-review-loop/` files
- **No writes outside `research/iterations/iteration-011.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
SHA=$(rg -oP 'PINNED_UPSTREAM_SHA:\s*\K[0-9a-f]{40}' .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-001.md | head -1)
sed -n '1,400p' .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-005.md

rg -nC5 'PASS|FAIL|UNKNOWN|findings-first|severity|P0|P1|P2|checklist|final.line|return.format' \
  .opencode/skills/sk-code-review/SKILL.md .opencode/skills/deep-review/SKILL.md 2>&1 | head -60
```

## CONSTRAINTS

- READ-ONLY.
- Quote the entire REVIEW prompt template VERBATIM in a fenced block (no paraphrasing).
- Quote the final-line contract VERBATIM (both alternatives).
- Cite local skill file:line for every comparison-row.

## COMMON FAILURE MODES

1. **Template literal escaping**: backtick-delimited template literals in TS use `${...}` interpolation. Preserve these in your output (don't substitute placeholder values).
2. **Truncation lengths**: the template uses `.slice(0, 2000)` for user text and `.slice(0, 3000)` for assistant text. Don't claim these match unless verified.
3. **PASS/FAIL/UNKNOWN vs P0/P1/P2**: these are DIFFERENT severity schemes. Don't say "our deep-review already does PASS/FAIL/UNKNOWN" when it actually does P0/P1/P2.

## OUTPUT FORMAT

Write to `research/iterations/iteration-011.md`:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha> -->

# Iteration 011 — Prompt template (scope, checklist, PASS/FAIL contract)

## Summary
<2-4 sentence verdict on the template + comparison to our review prompts>

## Files/Commands Reviewed
- iter outputs 003, 005
- `.opencode/skills/sk-code-review/SKILL.md`
- `.opencode/skills/deep-review/SKILL.md`

## Findings

### REVIEW PROMPT TEMPLATE (verbatim)
```text
<entire template literal, preserving ${...} placeholders>
```

### 9-Section Breakdown
| Section | Verbatim | Role |
|---------|----------|------|
| 1. Header | `AUTO-REVIEW\n\n` | Loop-prevention marker (matches REVIEW_MARKERS[0]) |
| 2. Mission statement | `You are reviewing another model's just-completed task turn.\nValidate completion quality and workflow gates, then report concrete risks only.` | Set scope + emphasize risk-only output |
| 3. Rules | `Rules:\n- Scope review to work after the last relevant user message.\n- Do not repeat the task.\n- Focus on correctness, verification evidence, and missed edge cases.` | Anti-patterns explicit |
| 4. Context metadata | `Observed model: ${workModelText}\nReview model: ${formatModelSpec(reviewModel)}\nTool calls in scoped turn: ${toolCalls}` | Tells reviewer who reviewed what |
| 5. Evidence | `Last relevant user message:\n${lastUserText.slice(0, 2000) || "(none)"}\n\nLast assistant message in scoped turn:\n${lastAssistantText.slice(0, 3000) || "(none)"}` | Bounded evidence interpolation |
| 6. Checklist | `Checklist to validate:\n- task completion\n- tests run/pass\n- PR exists if code changes were made\n- CI passed if applicable\n- obvious issues / bugs / missed edge cases` | 5 fixed items |
| 7. Return contract (sect 1) | `Return:\n1) Checklist with PASS/FAIL/UNKNOWN and brief evidence` | Triple-state severity |
| 8. Return contract (sect 2) | `2) Issues (only real gaps)` | No false positives |
| 9. Return contract (sect 3) | `3) Final line exactly one of:\n   - Review passed — no issues found.\n   - Review failed — <brief reason>.` | Machine-parseable verdict |

### Comparison to Our Review Prompts
| Design element | Upstream auto-review | sk-code-review | deep-review |
|----------------|---------------------|----------------|-------------|
| <rows from Step 3> | | | |

### Reusable Patterns Ranked
| Rank | Pattern | Why valuable | Adoption cost |
|------|---------|--------------|---------------|
| 1 | Final-line exact-string contract | Machine-parseable, enables automation | LOW (1-line SKILL.md addition) |
| 2 | Loop-prevention header marker | Defends against review-of-review across all our review surfaces | LOW |
| 3 | Anti-repetition rule | Prevents reviewers from accidentally re-doing the work | LOW |
| 4 | PASS/FAIL/UNKNOWN severity | Simpler than P0/P1/P2 for turn-level reviews | MEDIUM (changes review grammar) |
| 5 | Bounded-evidence interpolation (2000/3000 chars) | Prevents context bloat | LOW |

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — moderate (0.5-0.7).
```

Then append to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":11,"focus":"prompt template + final-line contract","mechanismsExtracted":9,"gapsIdentified":<N>,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] Full prompt template quoted VERBATIM in fenced block
- [ ] 9-section breakdown table with verbatim text per section
- [ ] Comparison table covers AT LEAST sk-code-review + deep-review with 7+ design-element rows
- [ ] Reusable-patterns-ranked table has 5 rows with adoption-cost column
- [ ] Output file ≥ 100 lines

Begin.
