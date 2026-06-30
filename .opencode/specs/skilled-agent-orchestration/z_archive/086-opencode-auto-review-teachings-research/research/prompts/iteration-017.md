# Deep Research Iteration 017 of 20 — Gap analysis vs deep-research + deep-review + deep-agent-improvement skills

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 17 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context (REQUIRED)**:
- Iter 016 produced the gap analysis vs sk-code-review

**Why this iter exists**: the three "deep-*" skills are our iterative-loop primitives. They share many design choices with the upstream auto-review (cross-AI, structured output, iteration cap as a form of recursion control), but they're invoked manually for whole-packet work, not auto-fired on per-session-idle events. The gap profile here is DIFFERENT from sk-code-review's — these skills are closer to "auto-review" in spirit.

## TASK

### Step 1 — Read all three deep-* SKILL.md files

```bash
for SKILL in deep-research deep-review deep-agent-improvement; do
  echo "=== $SKILL ==="
  wc -l .opencode/skills/$SKILL/SKILL.md
  head -50 .opencode/skills/$SKILL/SKILL.md
done
```

### Step 2 — Build a 3-column gap matrix

Apply the same 17-mechanism matrix from iter 016, but with 3 columns (one per deep-* skill):

| Mechanism | deep-research | deep-review | deep-agent-improvement |
|-----------|--------------|-------------|------------------------|
| Event-driven activation | <HAVE/DON'T/n/a> | <answer> | <answer> |
| Cross-model selection | <answer> | <answer> | <answer> |
| Cross-AI family bias | <answer> | <answer> | <answer> |
| Loop-prevention markers | <answer> | <answer> | <answer> |
| Loop-prevention session-set | <answer> | <answer> | <answer> |
| Loop-prevention dedup map | <answer> | <answer> | <answer> |
| Boundary detection | <answer> | <answer> | <answer> |
| Min-evidence gate | <answer> | <answer> | <answer> |
| Structured prompt template | <answer> | <answer> | <answer> |
| PASS/FAIL/UNKNOWN severity | <answer> | <answer> | <answer> |
| Final-line exact-string contract | <answer> | <answer> | <answer> |
| Anti-repetition rule | <answer> | <answer> | <answer> |
| Bounded evidence interpolation | <answer> | <answer> | <answer> |
| 3-tier config | <answer> | <answer> | <answer> |
| Dynamic model discovery | <answer> | <answer> | <answer> |
| Diagnostic logging | <answer> | <answer> | <answer> |
| Child-session isolation | <answer> | <answer> | <answer> |

For every HAVE/PARTIAL cell, cite file:line. For every DON'T HAVE non-n/a cell, cite the grep that returned nothing.

### Step 3 — Note the "iteration cap" as a recursion control

Our deep-* skills use a `--max-iterations=N` cap as a recursion-prevention mechanism. This is DIFFERENT from the upstream's marker-based + session-set + dedup approach.

Document:
- Where the iteration cap is enforced (per-skill: SKILL.md section, dispatcher script, state.jsonl convergence check)
- Whether the iteration cap is sufficient (yes, in practice — but it's a global limit, not per-message dedup)
- Could marker-based dedup ADD VALUE on top of the iteration cap? (e.g., prevent two consecutive iterations from re-reviewing the same finding)

### Step 4 — Identify cross-skill patterns to adopt

| Upstream pattern | deep-research benefit | deep-review benefit | deep-agent-improvement benefit |
|------------------|----------------------|---------------------|--------------------------------|
| Cross-AI family bias in dispatch | MEDIUM (deep-research dispatches single-AI mostly) | HIGH (deep-review's 20+5 split currently hardcoded; could be dynamic) | MEDIUM (smaller scope) |
| PASS/FAIL/UNKNOWN per iter | n/a (we report iteration findings) | HIGH (per-iter quick verdict possible) | LOW |
| Final-line exact-string contract | LOW (we have structured JSONL state) | HIGH (machine-parseable iter verdict) | LOW |
| Marker-based dedup | LOW (iteration cap suffices) | LOW (same) | MEDIUM (could prevent re-reviewing same agent body) |
| Diagnostic logging | LOW (we have state.jsonl) | LOW (same) | LOW |

### Step 5 — Specific recommendation per skill

**deep-research**:
- Largest gap: ?
- Highest-impact adoption: ?
- Estimated effort: ?

**deep-review**:
- Largest gap: ?
- Highest-impact adoption: ?
- Estimated effort: ?

**deep-agent-improvement**:
- Largest gap: ?
- Highest-impact adoption: ?
- Estimated effort: ?

## SCOPE

- `.opencode/skills/{deep-research,deep-review,deep-agent-improvement}/SKILL.md`
- Iter outputs 007-016
- **No writes outside `research/iterations/iteration-017.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
for SKILL in deep-research deep-review deep-agent-improvement; do
  echo "=== $SKILL ==="
  wc -l .opencode/skills/$SKILL/SKILL.md
  rg -nE 'auto.trigger|cross.model|family|marker|loop|dedup|boundary|min.tool|severity|P0|P1|P2|PASS|FAIL|final.line|max.iterations|convergence|child.session|3.tier' \
    .opencode/skills/$SKILL/SKILL.md 2>&1 | head -30
done
```

## CONSTRAINTS

- READ-ONLY.
- Cite file:line for every claim.
- Distinguish "HAVE" (explicit feature in SKILL.md) from "PARTIAL" (implied or contract-only).
- Note that some mechanisms are inherently n/a for skill-level invocations (e.g. session-set).

## COMMON FAILURE MODES

1. **Over-crediting iteration cap**: a cap-based loop prevention is real but it's coarser than per-message dedup. Don't mark "HAVE" if the only check is the iteration counter.
2. **Confusing skill invariants with runtime checks**: a SKILL.md saying "this is LEAF" is a contract, not a runtime enforcement. Note this distinction.

## OUTPUT FORMAT

Write to `research/iterations/iteration-017.md`:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha> -->

# Iteration 017 — Gap analysis vs deep-research + deep-review + deep-agent-improvement

## Summary
<2-4 sentence verdict>

## Findings

### Skill Overviews
| Skill | Lines | Activation | Iter cap | Cross-AI mechanism | Severity vocab |
|-------|-------|-----------|----------|-------------------|----------------|
| deep-research | <N> | user via /deep:start-research-loop | <N> | <description> | <vocab> |
| deep-review | <N> | user via /deep:start-review-loop | <N> | <description> | P0/P1/P2 |
| deep-agent-improvement | <N> | user via /deep:start-agent-improvement-loop | <N> | <description> | <vocab> |

### Gap Matrix (17 mechanisms × 3 skills)
| Mechanism | deep-research | deep-review | deep-agent-improvement |
|-----------|--------------|-------------|------------------------|
| <17 rows> | | | |

### Iteration Cap vs Marker-Based Dedup
<1-2 paragraphs comparing the two recursion-control approaches>

### Cross-Skill Adoption Matrix
| Upstream pattern | deep-research | deep-review | deep-agent-improvement |
|------------------|--------------|-------------|------------------------|
| <5 rows from Step 4> | | | |

### Per-Skill Recommendations
**deep-research**: <largest gap, highest-impact, effort>
**deep-review**: <same>
**deep-agent-improvement**: <same>

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — high.
```

Then append to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":17,"focus":"gap vs deep-research + deep-review + deep-agent-improvement","mechanismsExtracted":0,"gapsIdentified":<N>,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] Skill overviews table (3 rows × 6 columns)
- [ ] Gap matrix (17 rows × 3 columns) with file:line evidence for every populated cell
- [ ] Iteration-cap-vs-marker discussion ≥ 100 words
- [ ] Cross-skill adoption matrix (5 rows × 3 columns)
- [ ] Per-skill recommendations (3 specific recommendations, one per skill)
- [ ] Output file ≥ 120 lines

Begin.
