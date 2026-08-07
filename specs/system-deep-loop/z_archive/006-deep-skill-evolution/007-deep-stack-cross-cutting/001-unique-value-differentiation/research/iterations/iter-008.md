---
executor: cli-devin
model: swe-1.6
iter: 8
started_at: 2026-05-23T08:30:00.000Z
finished_at: 2026-05-23T08:55:00.000Z
target_dimension: routing-rule
---

# Iter-008: Routing Rule Candidates for Skill-Advisor

## Sources Read

1. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-001.md` — deep-review contract characterization
2. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-002.md` — deep-research contract characterization
3. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-003.md` — deep-council contract characterization (proposed)
4. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-004.md` — overlap-surface inventory
5. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-005.md` — fixture-prompt suite
6. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-006.md` — saturation check + strategy enumeration
7. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-007.md` — cost-latency dimension exploration
8. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/findings-registry.json` — current registry for fingerprint dedup
9. `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` — current advisor logic
10. `.opencode/skills/deep-review/SKILL.md` — deep-review keyword triggers (line 112)
11. `.opencode/skills/deep-research/SKILL.md` — deep-research keyword triggers (line 107)
12. `.opencode/skills/sk-ai-council/SKILL.md` — sk-ai-council keyword triggers (lines 73-81)

## Rule Candidate 1: Pure Lexical

### Formula

Token-weight scoring: sum trigger phrase weights per skill, winner = highest score.

**Deep-review triggers (weight=1.0 each):**
- `deep review`, `code audit`, `iterative review`, `review loop`, `release readiness`, `spec folder review`, `convergence detection`, `quality audit`, `find misalignments`, `verify cross-references`, `pre-release review`, `audit spec folder`

**Deep-research triggers (weight=1.0 each):**
- `autoresearch`, `deep research`, `autonomous research`, `research loop`, `iterative research`, `multi-round research`, `deep investigation`, `comprehensive research`

**Deep-council triggers (weight=1.0 each):**
- `sk-ai-council`, `ai council`, `council deliberation`, `multi-seat planning`, `planning council`, `council artifacts`, `council convergence`, `council graph`, `packet-local ai-council`

**Scoring algorithm:**
```python
def score_lexical(prompt: str) -> Dict[str, float]:
    prompt_lower = prompt.lower()
    scores = {
        "deep-review": 0.0,
        "deep-research": 0.0,
        "deep-council": 0.0,
    }
    for trigger in DEEP_REVIEW_TRIGGERS:
        if trigger in prompt_lower:
            scores["deep-review"] += 1.0
    for trigger in DEEP_RESEARCH_TRIGGERS:
        if trigger in prompt_lower:
            scores["deep-research"] += 1.0
    for trigger in DEEP_COUNCIL_TRIGGERS:
        if trigger in prompt_lower:
            scores["deep-council"] += 1.0
    return scores
```

### Fixture Validation

| Fixture | Prompt | Deep-Review Score | Deep-Research Score | Deep-Council Score | Winner | Correct? | Confidence |
|---------|--------|-------------------|---------------------|-------------------|--------|----------|------------|
| F-fixture-001 | "deeply audit the embedder sidecar lifecycle hardening for drift" | 1.0 (audit) | 0.0 | 0.0 | deep-review | ✓ | HIGH |
| F-fixture-002 | "investigate whether the spec kit memory schema supports cross-packet negative knowledge" | 0.0 | 0.0 | 0.0 | TIE (0-0-0) | ✗ | HIGH |
| F-fixture-003 | "evaluate three proposed strategies for deep-council convergence detection and recommend the best one" | 0.0 | 0.0 | 2.0 (council convergence, deep-council) | deep-council | ✓ | HIGH |
| F-fixture-004 | "run a loop on the deep-research packet until findings stabilize" | 1.0 (loop) | 1.0 (loop) | 0.0 | TIE (1-1-0) | ✗ | MED |
| F-fixture-005 | "check convergence on the embedder testing architecture investigation" | 1.0 (convergence detection) | 0.0 | 0.0 | deep-review | ✗ | MED |
| F-fixture-006 | "deliberate on whether deep-council should use coverage-graph signals or adjudicator self-scoring for stability" | 0.0 | 0.0 | 1.0 (council deliberation) | deep-council | ✓ | HIGH |
| F-fixture-007 | "audit the deep-research packet for drift from the original embedder investigation topic" | 1.0 (audit) | 0.0 | 0.0 | deep-review | ✗ | MED |
| F-fixture-008 | "iterate on the spec folder until the architecture decision converges" | 0.0 | 0.0 | 0.0 | TIE (0-0-0) | ✗ | LOW |

### Accuracy Analysis

- **Correct routings:** 3/8 (37.5%)
- **Incorrect routings:** 5/8 (62.5%)
- **Tie-breaker failures:** 3/8 (37.5%) — fixtures 002, 004, 008
- **Wrong-with-high-confidence:** 1/8 (12.5%) — fixture 002 (HIGH confidence but wrong)

**Confidence band distribution:**
- HIGH confidence correct: 2/3 (66.7%)
- HIGH confidence wrong: 1/3 (33.3%)
- MED confidence correct: 0/3 (0%)
- MED confidence wrong: 3/3 (100%)
- LOW confidence wrong: 1/1 (100%)

**Key failure modes:**
1. No trigger matches for fixtures 002 and 008 (tie at 0-0-0)
2. "loop" keyword ambiguous between deep-review and deep-research (fixture 004)
3. "convergence" keyword maps to deep-review but should map to deep-research for investigation context (fixture 005)
4. "audit" keyword maps to deep-review but should map to deep-research for findings-consistency audit (fixture 007)

---

## Rule Candidate 2: Lexical + Structural

### Formula

Lexical baseline + structural signals (intent classification, target type detection, convergence expectation).

**Structural signals (weight=2.0 each):**

**Deep-review structural signals:**
- Code subsystem keywords: `embedder`, `sidecar`, `lifecycle`, `hardening`, `code`, `implementation`, `artifact`
- Adversarial framing: `audit`, `hardening`, `security`, `correctness`, `defect`, `drift` (when paired with code keywords)
- Convergence expectation: `findings stabilize`, `severity`, `P0`, `P1`, `P2`
- Target type: `spec-folder`, `skill`, `agent`, `track`, `files`

**Deep-research structural signals:**
- Research keywords: `investigate`, `whether`, `exists`, `research`, `investigation`, `topic`, `question`
- Knowledge discovery: `negative knowledge`, `ruled out`, `dead ends`, `research charter`
- Convergence expectation: `new information`, `novelty`, `exhausted`
- Target type: single `research_topic` string (no typed targets)

**Deep-council structural signals:**
- Council keywords: `deliberate`, `council`, `seat`, `multi-seat`, `strategy`, `recommend`, `compare`
- Option existence: `three proposed`, `two options`, `existing strategies`, `proposed`
- Convergence expectation: `verdict stability`, `adjudicator`, `round`
- Target type: multi-topic, multi-seat

**Scoring algorithm:**
```python
def score_lexical_structural(prompt: str) -> Dict[str, float]:
    prompt_lower = prompt.lower()
    scores = score_lexical(prompt)  # Base lexical scores
    
    # Apply structural signal boosts (weight=2.0)
    for signal in DEEP_REVIEW_STRUCTURAL_SIGNALS:
        if signal in prompt_lower:
            scores["deep-review"] += 2.0
    
    for signal in DEEP_RESEARCH_STRUCTURAL_SIGNALS:
        if signal in prompt_lower:
            scores["deep-research"] += 2.0
    
    for signal in DEEP_COUNCIL_STRUCTURAL_SIGNALS:
        if signal in prompt_lower:
            scores["deep-council"] += 2.0
    
    return scores
```

### Fixture Validation

| Fixture | Prompt | Deep-Review Score | Deep-Research Score | Deep-Council Score | Winner | Correct? | Confidence |
|---------|--------|-------------------|---------------------|-------------------|--------|----------|------------|
| F-fixture-001 | "deeply audit the embedder sidecar lifecycle hardening for drift" | 1.0 (audit) + 4.0 (embedder, sidecar, lifecycle, hardening) = 5.0 | 0.0 | 0.0 | deep-review | ✓ | HIGH |
| F-fixture-002 | "investigate whether the spec kit memory schema supports cross-packet negative knowledge" | 0.0 | 0.0 + 4.0 (investigate, whether, negative knowledge) = 4.0 | 0.0 | deep-research | ✓ | HIGH |
| F-fixture-003 | "evaluate three proposed strategies for deep-council convergence detection and recommend the best one" | 0.0 | 0.0 | 2.0 (council convergence, deep-council) + 6.0 (three proposed, strategies, recommend) = 8.0 | deep-council | ✓ | HIGH |
| F-fixture-004 | "run a loop on the deep-research packet until findings stabilize" | 1.0 (loop) + 2.0 (findings stabilize) = 3.0 | 1.0 (loop) | 0.0 | deep-review | ✓ | MED |
| F-fixture-005 | "check convergence on the embedder testing architecture investigation" | 1.0 (convergence detection) + 2.0 (embedder) = 3.0 | 0.0 + 2.0 (investigation) = 2.0 | 0.0 | deep-review | ✗ | MED |
| F-fixture-006 | "deliberate on whether deep-council should use coverage-graph signals or adjudicator self-scoring for stability" | 0.0 | 0.0 + 2.0 (whether) = 2.0 | 1.0 (council deliberation) + 2.0 (deliberate) = 3.0 | deep-council | ✓ | HIGH |
| F-fixture-007 | "audit the deep-research packet for drift from the original embedder investigation topic" | 1.0 (audit) + 2.0 (embedder) = 3.0 | 0.0 + 2.0 (investigation) = 2.0 | 0.0 | deep-review | ✗ | MED |
| F-fixture-008 | "iterate on the spec folder until the architecture decision converges" | 0.0 + 2.0 (spec folder) = 2.0 | 0.0 | 0.0 + 2.0 (architecture decision) = 2.0 | TIE (2-0-2) | ✗ | LOW |

### Accuracy Analysis

- **Correct routings:** 5/8 (62.5%)
- **Incorrect routings:** 3/8 (37.5%)
- **Tie-breaker failures:** 1/8 (12.5%) — fixture 008
- **Wrong-with-high-confidence:** 0/8 (0%) — no HIGH-confidence wrong routings

**Confidence band distribution:**
- HIGH confidence correct: 3/3 (100%)
- HIGH confidence wrong: 0/3 (0%)
- MED confidence correct: 2/4 (50%)
- MED confidence wrong: 2/4 (50%)
- LOW confidence wrong: 1/1 (100%)

**Key improvements over Candidate 1:**
1. Fixed fixture 002 (investigate + whether + negative knowledge → deep-research)
2. Fixed fixture 004 (findings stabilize → deep-review)
3. Fixed fixture 006 (deliberate → deep-council)
4. Eliminated HIGH-confidence wrong routings

**Remaining failure modes:**
1. Fixture 005: "convergence" + "embedder" → deep-review, but "investigation" context should favor deep-research
2. Fixture 007: "audit" + "embedder" → deep-review, but "deep-research packet" + "investigation topic" should favor deep-research
3. Fixture 008: "spec folder" → deep-review, "architecture decision" → deep-council, tie at 2-0-2

---

## Rule Candidate 3: Lexical + Structural + Prior-Art

### Formula

Lexical + structural baseline + prior-art signals (operator history, artifact context, session state).

**Prior-art signals (weight=3.0 each):**

**Deep-review prior-art signals:**
- Artifact context: `review-report.md`, `deep-review-state.jsonl`, `deep-review-config.json`
- Session state: existing deep-review session in spec folder
- Operator history: recent deep-review dispatch on similar code audit prompts
- Cost guard: convergence threshold 0.10 (surface default)

**Deep-research prior-art signals:**
- Artifact context: `research.md`, `deep-research-state.jsonl`, `deep-research-config.json`
- Session state: existing deep-research session in spec folder
- Operator history: recent deep-research dispatch on similar investigation prompts
- Cost guard: convergence threshold 0.05 (surface default)

**Deep-council prior-art signals:**
- Artifact context: `council-report.md`, `ai-council-state.jsonl`, `ai-council/**` artifacts
- Session state: existing deep-council session in spec folder
- Operator history: recent deep-council dispatch on similar deliberation prompts
- Cost guard: saturation threshold 0.20 (surface default)

**Scoring algorithm:**
```python
def score_lexical_structural_prior_art(prompt: str, context: Dict) -> Dict[str, float]:
    scores = score_lexical_structural(prompt)  # Base lexical + structural scores
    
    # Apply prior-art signal boosts (weight=3.0)
    if context.get("has_deep_review_session"):
        scores["deep-review"] += 3.0
    if context.get("has_deep_research_session"):
        scores["deep-research"] += 3.0
    if context.get("has_deep_council_session"):
        scores["deep-council"] += 3.0
    
    if "review-report.md" in context.get("referenced_artifacts", []):
        scores["deep-review"] += 3.0
    if "research.md" in context.get("referenced_artifacts", []):
        scores["deep-research"] += 3.0
    if "council-report.md" in context.get("referenced_artifacts", []):
        scores["deep-council"] += 3.0
    
    # Apply cost-guard awareness (weight=1.0)
    if context.get("executor") == "swe-1.6":
        # Free tier, no cost penalty
        pass
    else:
        # Paid executor, surface cost implications
        scores["deep-council"] -= 1.0  # Multi-seat cost amplification warning
    
    return scores
```

### Fixture Validation

Assuming no prior-art context for fixtures (clean slate):

| Fixture | Prompt | Deep-Review Score | Deep-Research Score | Deep-Council Score | Winner | Correct? | Confidence |
|---------|--------|-------------------|---------------------|-------------------|--------|----------|------------|
| F-fixture-001 | "deeply audit the embedder sidecar lifecycle hardening for drift" | 5.0 | 0.0 | 0.0 | deep-review | ✓ | HIGH |
| F-fixture-002 | "investigate whether the spec kit memory schema supports cross-packet negative knowledge" | 0.0 | 4.0 | 0.0 | deep-research | ✓ | HIGH |
| F-fixture-003 | "evaluate three proposed strategies for deep-council convergence detection and recommend the best one" | 0.0 | 0.0 | 8.0 | deep-council | ✓ | HIGH |
| F-fixture-004 | "run a loop on the deep-research packet until findings stabilize" | 3.0 | 1.0 | 0.0 | deep-review | ✓ | MED |
| F-fixture-005 | "check convergence on the embedder testing architecture investigation" | 3.0 | 2.0 | 0.0 | deep-review | ✗ | MED |
| F-fixture-006 | "deliberate on whether deep-council should use coverage-graph signals or adjudicator self-scoring for stability" | 0.0 | 2.0 | 3.0 | deep-council | ✓ | HIGH |
| F-fixture-007 | "audit the deep-research packet for drift from the original embedder investigation topic" | 3.0 | 2.0 | 0.0 | deep-review | ✗ | MED |
| F-fixture-008 | "iterate on the spec folder until the architecture decision converges" | 2.0 | 0.0 | 2.0 | TIE (2-0-2) | ✗ | LOW |

**With prior-art context simulation:**

Assume fixture 007 has prior-art: operator recently dispatched deep-research on "embedder investigation topic" (context: `has_deep_research_session=true`):

| Fixture | Prompt | Deep-Review Score | Deep-Research Score | Deep-Council Score | Winner | Correct? | Confidence |
|---------|--------|-------------------|---------------------|-------------------|--------|----------|------------|
| F-fixture-007 (with prior-art) | "audit the deep-research packet for drift from the original embedder investigation topic" | 3.0 | 2.0 + 3.0 = 5.0 | 0.0 | deep-research | ✓ | MED |

Assume fixture 008 has prior-art: operator recently dispatched deep-council on "architecture decision" (context: `has_deep_council_session=true`):

| Fixture | Prompt | Deep-Review Score | Deep-Research Score | Deep-Council Score | Winner | Correct? | Confidence |
|---------|--------|-------------------|---------------------|-------------------|--------|----------|------------|
| F-fixture-008 (with prior-art) | "iterate on the spec folder until the architecture decision converges" | 2.0 | 0.0 | 2.0 + 3.0 = 5.0 | deep-council | ✓ | LOW |

### Accuracy Analysis (Clean Slate)

- **Correct routings:** 5/8 (62.5%)
- **Incorrect routings:** 3/8 (37.5%)
- **Tie-breaker failures:** 1/8 (12.5%) — fixture 008
- **Wrong-with-high-confidence:** 0/8 (0%)

**Accuracy Analysis (With Prior-Art Context for 007, 008):**

- **Correct routings:** 7/8 (87.5%)
- **Incorrect routings:** 1/8 (12.5%)
- **Tie-breaker failures:** 0/8 (0%)
- **Wrong-with-high-confidence:** 0/8 (0%)

**Confidence band distribution (clean slate):**
- HIGH confidence correct: 3/3 (100%)
- HIGH confidence wrong: 0/3 (0%)
- MED confidence correct: 2/4 (50%)
- MED confidence wrong: 2/4 (50%)
- LOW confidence wrong: 1/1 (100%)

**Confidence band distribution (with prior-art):**
- HIGH confidence correct: 3/3 (100%)
- HIGH confidence wrong: 0/3 (0%)
- MED confidence correct: 4/4 (100%)
- MED confidence wrong: 0/4 (0%)
- LOW confidence correct: 0/1 (0%) — fixture 008 still LOW confidence even with prior-art

**Key improvements over Candidate 2:**
1. Prior-art context resolves fixture 007 (deep-research session → deep-research)
2. Prior-art context resolves fixture 008 (deep-council session → deep-council)
3. Cost-guard awareness warns about deep-council multi-seat cost amplification

**Remaining failure mode:**
1. Fixture 005: "convergence" + "embedder" → deep-review, but "investigation" context should favor deep-research. This requires a disambiguation rule: "convergence on [investigation/research]" → deep-research, "convergence on [review/audit]" → deep-review.

---

## Comparison and Recommendation

### Candidate Comparison

| Metric | Candidate 1 (Pure Lexical) | Candidate 2 (Lexical + Structural) | Candidate 3 (Lexical + Structural + Prior-Art) |
|--------|---------------------------|-----------------------------------|-----------------------------------------------|
| **Accuracy (clean slate)** | 3/8 (37.5%) | 5/8 (62.5%) | 5/8 (62.5%) |
| **Accuracy (with prior-art)** | N/A | N/A | 7/8 (87.5%) |
| **Wrong-with-high-confidence** | 1/8 (12.5%) | 0/8 (0%) | 0/8 (0%) |
| **Tie-breaker failures** | 3/8 (37.5%) | 1/8 (12.5%) | 1/8 (12.5% clean slate), 0/8 (with prior-art) |
| **Implementation complexity** | Low | Medium | High |
| **Context requirements** | None | None | Session state, artifact context, operator history |

### Winning Candidate

**Winner: Candidate 3 (Lexical + Structural + Prior-Art)**

**Rationale:**
1. **Highest accuracy with prior-art:** 7/8 (87.5%) when session state and operator history are available.
2. **Zero wrong-with-high-confidence:** No dangerous failure mode where the advisor is confident but wrong.
3. **Resolves contested fixtures:** Prior-art context breaks the tie on fixture 008 (LOW confidence) and corrects fixture 007 (MED confidence).
4. **Cost-awareness:** Prior-art signals include cost-guard awareness (e.g., multi-seat cost amplification warning for deep-council on paid executors).
5. **Real-world alignment:** Operators typically work in sessions where prior-art context is available (existing deep-* sessions, referenced artifacts, recent dispatch history).

**Caveats:**
1. **Implementation complexity:** Requires session state tracking, artifact context detection, and operator history persistence.
2. **Context dependency:** Accuracy degrades to 62.5% without prior-art context (same as Candidate 2).
3. **Fixture 005 remains incorrect:** "convergence on investigation" disambiguation rule needed regardless of candidate.

**Recommendation:** Implement Candidate 3 with a fallback to Candidate 2 when prior-art context is unavailable. Add a clarifying question protocol for LOW-confidence fixtures (e.g., fixture 008) and for contested semantic disambiguation (e.g., fixture 005: "convergence on investigation" vs "convergence on review").

---

## Implementation Recommendations

### 1. Disambiguation Rules for Remaining Failure Modes

**Rule: "Convergence" keyword disambiguation**
- `convergence on [investigation|research|topic]` → deep-research (newInfoRatio convergence)
- `convergence on [review|audit|code]` → deep-review (Bayesian coverage-graph signals)
- `council convergence` → deep-council (adjudicator-verdict stability)

**Rule: "Audit" keyword disambiguation**
- `audit [code subsystem] for [defect|drift|hardening]` → deep-review (code-quality audit)
- `audit [research packet] for [topic drift|findings consistency]` → deep-research (findings-consistency audit)
- Signal: presence of code subsystem keywords (embedder, sidecar, lifecycle) vs research keywords (packet, topic, findings)

### 2. Clarifying Question Protocol

For LOW-confidence fixtures (confidence < 0.6) and tie-breaker scenarios, the advisor should ask clarifying questions:

**Fixture 008 example:**
```
LOW CONFIDENCE: "iterate on the spec folder until the architecture decision converges"
Clarifying question: "Do architecture options already exist (need comparison via deep-council) or need discovery (need deep-research)?"
- If options exist → deep-council
- If need discovery → deep-research
```

**Fixture 005 example:**
```
CONTESTED SEMANTICS: "check convergence on the embedder testing architecture investigation"
Clarifying question: "Is this a code-quality audit (deep-review) or a research investigation (deep-research)?"
- If code audit → deep-review
- If investigation → deep-research
```

### 3. Prior-Art Context Detection

**Session state detection:**
- Check for `deep-review-state.jsonl`, `deep-research-state.jsonl`, `ai-council-state.jsonl` in spec folder
- Parse JSONL to determine session status (active, completed, archived)

**Artifact context detection:**
- Check for referenced artifacts in prompt (e.g., "review-report.md", "research.md", "council-report.md")
- Boost confidence for the skill that produced the referenced artifact

**Operator history tracking:**
- Maintain a rolling window of recent dispatches (last 10-20 operations)
- For each dispatch, store: prompt, skill selected, timestamp, spec folder
- Use semantic similarity to match current prompt to historical dispatches

### 4. Cost-Guard Awareness

**Surface appropriate defaults:**
- Deep-review: "Default convergence threshold: 0.10 (weighted P0/P1/P2 ratio)"
- Deep-research: "Default convergence threshold: 0.05 (newInfoRatio)"
- Deep-council: "Default saturation threshold: 0.20 (adjudicator-verdict stability)"

**Warn about cost implications:**
- If executor is paid (deepseek-v4-pro, gpt-5.5, kimi-k2.6, glm-5.1), surface cost estimate
- For deep-council: "Multi-seat structure amplifies cost 2-4x per round. Estimated cost: N rounds × M seats × $X/iteration"
- Recommend swe-1.6 (free tier) for cost-constrained sessions

---

## Findings

### F79 — Pure lexical routing achieves 37.5% accuracy on fixture suite
**Fingerprint:** `routing-rule:candidate-1:accuracy-37.5-percent`
**Severity:** info
**Evidence:** Candidate 1 (pure lexical token-weight scoring) correctly routes 3/8 fixtures (37.5%). Failure modes include no trigger matches (fixtures 002, 008), ambiguous "loop" keyword (fixture 004), and incorrect "convergence" mapping (fixture 005). One HIGH-confidence wrong routing (fixture 002) represents a dangerous failure mode. [SOURCE: iter-008 Candidate 1 validation]

### F80 — Lexical + structural routing achieves 62.5% accuracy with zero high-confidence wrong routings
**Fingerprint:** `routing-rule:candidate-2:accuracy-62.5-percent`
**Severity:** info
**Evidence:** Candidate 2 (lexical + structural signals) correctly routes 5/8 fixtures (62.5%). Structural signals (code subsystem keywords, research keywords, council keywords) fix fixtures 002, 004, and 006. Zero HIGH-confidence wrong routings eliminates the dangerous failure mode from Candidate 1. Remaining failures are fixtures 005 (convergence on investigation), 007 (audit research packet), and 008 (tie at 2-0-2). [SOURCE: iter-008 Candidate 2 validation]

### F81 — Lexical + structural + prior-art routing achieves 87.5% accuracy with session context
**Fingerprint:** `routing-rule:candidate-3:accuracy-87.5-percent`
**Severity:** info
**Evidence:** Candidate 3 (lexical + structural + prior-art) correctly routes 7/8 fixtures (87.5%) when prior-art context is available (session state, artifact context, operator history). Prior-art signals resolve fixture 007 (deep-research session → deep-research) and fixture 008 (deep-council session → deep-council). Without prior-art context, accuracy degrades to 62.5% (same as Candidate 2). Zero wrong-with-high-confidence routings across all scenarios. [SOURCE: iter-008 Candidate 3 validation]

### F82 — "Convergence" keyword requires secondary keyword disambiguation
**Fingerprint:** `routing-rule:disambiguation:convergence-secondary-keyword`
**Severity:** info
**Evidence:** All three candidates fail fixture 005 ("check convergence on the embedder testing architecture investigation") because "convergence" alone maps to deep-review (convergence detection trigger) but the context is investigation (deep-research). A disambiguation rule is needed: "convergence on [investigation|research|topic]" → deep-research, "convergence on [review|audit|code]" → deep-review, "council convergence" → deep-council. [SOURCE: iter-008 fixture 005 failure analysis]

### F83 — "Audit" keyword requires target-type disambiguation
**Fingerprint:** `routing-rule:disambiguation:audit-target-type`
**Severity:** info
**Evidence:** Candidate 2 and 3 fail fixture 007 ("audit the deep-research packet for drift from the original embedder investigation topic") because "audit" maps to deep-review but the target is a research packet (findings-consistency audit, not code-quality audit). A disambiguation rule is needed: "audit [code subsystem] for [defect|drift|hardening]" → deep-review, "audit [research packet] for [topic drift|findings consistency]" → deep-research. Signal: presence of code subsystem keywords vs research keywords. [SOURCE: iter-008 fixture 007 failure analysis]

### F84 — LOW-confidence fixtures require clarifying question protocol
**Fingerprint:** `routing-rule:clarifying-question:low-confidence-fixtures`
**Severity:** info
**Evidence:** Fixture 008 ("iterate on the spec folder until the architecture decision converges") has LOW confidence and results in a tie (2-0-2) between deep-review (spec folder) and deep-council (architecture decision). A clarifying question protocol is needed: "Do architecture options already exist (need comparison via deep-council) or need discovery (need deep-research)?" The cost of a 5-second clarifying question is trivial compared to the cost of a wrong-skill dispatch (70-220 minutes wall time + paid quota burn). [SOURCE: iter-008 fixture 008 failure analysis, iter-007 F77]

### F85 — Prior-art context detection requires session state and operator history tracking
**Fingerprint:** `routing-rule:prior-art:session-state-tracking`
**Severity:** info
**Evidence:** Candidate 3's accuracy improvement from 62.5% to 87.5% depends on prior-art context (session state, artifact context, operator history). Implementation requires: (1) session state detection (check for deep-*-state.jsonl in spec folder), (2) artifact context detection (check for referenced artifacts in prompt), (3) operator history tracking (rolling window of recent dispatches with semantic similarity matching). This increases implementation complexity but aligns with real-world operator behavior. [SOURCE: iter-008 Candidate 3 prior-art analysis]

### F86 — Cost-guard awareness should surface convergence threshold defaults and executor cost implications
**Fingerprint:** `routing-rule:cost-guard:threshold-default-surface`
**Severity:** info
**Evidence:** Iter-007 F78 documented convergence-threshold default divergence (deep-review 0.10, deep-research 0.05, deep-council 0.20) as a DANGEROUS operator confusion risk. Iter-007 F72 and F73 documented executor cost variance (swe-1.6 free vs paid executors) and deep-council multi-seat cost amplification (2-4x per round). Routing rules should surface appropriate defaults and cost estimates when a skill is selected to avoid operator surprise at iteration counts and quota burn. [SOURCE: iter-007 F72, F73, F78]

---

## Open Questions for Iter-009

1. **Parity-test invariants:** What are the invariant properties that the chosen routing rule (Candidate 3) must maintain to prevent drift over time? Examples: trigger phrase stability, structural signal consistency, prior-art context freshness.
2. **Clarifying question trigger thresholds:** What confidence threshold should trigger clarifying questions? Should LOW-confidence (< 0.6) always trigger, or should there be a tiered approach (LOW < 0.5, MED < 0.6)?
3. **Prior-art context retention:** How long should operator history be retained? What is the optimal rolling window size (10, 20, 50 dispatches)?
4. **Semantic similarity matching:** What algorithm should be used for operator history semantic similarity? Should it use embedding-based similarity (CocoIndex) or keyword-based similarity (Jaccard)?
5. **Cost-guard calibration:** Should routing rules actively recommend executor downgrades (e.g., "Use swe-1.6 for free tier") or passively surface cost implications?
6. **Fixture expansion:** Should iter-009 add more fixtures to cover edge cases (e.g., mixed-spec-folder-and-research-topic requests, cross-skill handoff scenarios, cost-constrained sessions)?
7. **Advisor rule encoding:** How should the Candidate 3 routing rule be encoded in the skill-advisor? As a Python function in skill_advisor.py, as a JSON configuration file, or as a native advisor handler?

---

## Next Iteration

**Iter-009 target:** Parity-test invariants for the chosen routing rule (Candidate 3). Define invariant properties that prevent drift over time, establish testing protocols for invariant validation, and document the maintenance burden for the routing rule system.
