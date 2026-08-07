# Skill Metadata Quality Audit

## 5. Executive Summary

- Total skills audited: 17 active `.opencode/skills/<skill>/` directories with both `SKILL.md` and `graph-metadata.json`.
- Average total score: 21.6 / 25. Descriptions are generally healthy: every audited `SKILL.md` description is present and falls inside the 80-300 character sweet spot.
- Worst 3 skills by score: `cli-codex` (18), `cli-gemini` (18), and `deep-review` (19).
- Most-duplicated phrase: `cross ai`, which appears as a trigger phrase on `cli-codex` and `cli-gemini`, and as a key topic on all four `cli-*` skills.
- Duplicated phrase count: 10 normalized cross-skill phrases across trigger phrases and key topics.
- The main quality weakness is not missing metadata; it is family-level vocabulary reuse. The `cli-*` skills share `cli`, `delegation`, `cross ai`, and sometimes `web research`; the deep-loop skills share `convergence`, `convergence detection`, and `externalized state`.
- `derived.intent_signals` and `manual.depends_on` / `manual.related_to` were absent across the active set, so the advisor has little explicit intent or graph-causal metadata to distinguish adjacent skills.
- Interpretation (b) is partially supported. Metadata is not thin enough to say cosine "couldn't possibly help", but several skill families use generic or duplicated wording that would blunt lexical and derived lanes, and may make semantic similarity less discriminating inside those families.

## 1. Methodology

Skill discovery command:

```bash
for d in .opencode/skills/*; do [ -f "$d/SKILL.md" ] && [ -f "$d/graph-metadata.json" ] && basename "$d"; done | sort
```

Skill count: 17. The two hidden top-level state directories, `.advisor-state` and `.smart-router-telemetry`, were excluded because they are not skill directories and do not contain both source files.

Source files read per skill:

- `.opencode/skills/<skill>/SKILL.md`: frontmatter `description:` field.
- `.opencode/skills/<skill>/graph-metadata.json`: `derived.trigger_phrases`, `derived.key_topics`, `derived.causal_summary`, and `derived.intent_signals` when present.
- `derived.intent_signals` was not present on any audited skill.
- `manual.depends_on` and `manual.related_to` were not present on any audited skill, so the graph-causal lane has no manual relationship signal from this active set.

Scoring rubric:

| Dimension | Advisor lane impact | 5 | 4 | 3 | 2 | 1 | 0 |
|---|---|---|---|---|---|---|---|
| D1: description specificity | `semantic_shadow`; secondary lexical tokens | Has a concrete domain, concrete action verbs or nouns, and avoids generic-only wording | Concrete but partly template-like or broad | Domain is visible, but wording is generic enough to fit siblings | Mostly generic role words | Bare label | Missing |
| D2: description length | `semantic_shadow` embedding density | 80-300 chars | 60-79 or 301-360 chars | 40-59 or 361-450 chars | 20-39 or >450 chars | <20 chars | Missing |
| D3: trigger phrase coverage + uniqueness | `lexical`, `derived_generated` | 8-14 triggers, >=90% cross-skill unique, includes skill id, task intent, and user phrasing | Slightly thin/large or one cross-skill duplicate | 5-6 or 19-24 triggers, or several broad terms | <5 or >24 triggers, especially broad language/tool tokens | Sparse and ambiguous | Missing |
| D4: key topic diversity | `derived_generated` | 8-12 topics, >=7 distinct concepts, not mostly trigger splits | Mostly diverse with some trigger echoes | Thin/generic or many trigger echoes | Dominated by trigger splits or generic headings | Sparse and low-signal | Missing |
| D5: cross-skill duplication penalty | `lexical`, `derived_generated`; ambiguity pressure on routing | No normalized overlaps with other skills | 1-2 overlapping phrase assignments | 3-4 overlapping phrase assignments | 5-6 overlapping phrase assignments | 7+ overlapping phrase assignments | Overlaps dominate |

Normalization for duplication: lowercase, trim, collapse whitespace, and treat hyphen/underscore separators as spaces. Scores are rubric-based, not learned from router outcomes.

## 2. Per-skill Scoring Table

| Skill id | D1 | D2 | D3 | D4 | D5 | Total |
|---|---:|---:|---:|---:|---:|---:|
| `cli-codex` | 4 | 5 | 4 | 3 | 2 | 18 |
| `cli-gemini` | 4 | 5 | 4 | 3 | 2 | 18 |
| `deep-review` | 5 | 5 | 5 | 2 | 2 | 19 |
| `deep-ai-council` | 5 | 5 | 3 | 3 | 4 | 20 |
| `sk-code` | 4 | 5 | 2 | 4 | 5 | 20 |
| `cli-claude-code` | 4 | 5 | 5 | 4 | 3 | 21 |
| `deep-research` | 5 | 5 | 5 | 3 | 3 | 21 |
| `sk-code-review` | 5 | 5 | 5 | 2 | 4 | 21 |
| `deep-agent-improvement` | 5 | 5 | 5 | 3 | 4 | 22 |
| `cli-opencode` | 5 | 5 | 5 | 4 | 3 | 22 |
| `mcp-coco-index` | 5 | 5 | 5 | 3 | 5 | 23 |
| `mcp-code-mode` | 4 | 5 | 5 | 4 | 5 | 23 |
| `sk-prompt` | 5 | 5 | 5 | 4 | 4 | 23 |
| `mcp-chrome-devtools` | 5 | 5 | 5 | 4 | 5 | 24 |
| `sk-doc` | 5 | 5 | 5 | 4 | 5 | 24 |
| `sk-git` | 5 | 5 | 5 | 4 | 5 | 24 |
| `system-spec-kit` | 5 | 5 | 5 | 4 | 5 | 24 |

## 3. Cross-skill Duplication Report

| Phrase | Type | Skill ids carrying it | Verdict |
|---|---|---|---|
| `cross ai` | both | trigger: `cli-codex`, `cli-gemini`; key_topic: `cli-claude-code`, `cli-codex`, `cli-gemini`, `cli-opencode` | Candidate for dedup. Keep family affinity, but specialize by provider and job: `codex cross-model validation`, `gemini google-search validation`, `claude extended-reasoning handoff`. |
| `cli` | key_topic | `cli-claude-code`, `cli-codex`, `cli-gemini`, `cli-opencode` | Legitimate overlap, but low discriminating value. Prefer provider-specific CLI topics. |
| `delegation` | key_topic | `cli-claude-code`, `cli-codex`, `cli-gemini`, `cli-opencode` | Candidate for dedup. Use action-specific terms like `anthropic code-review handoff` or `opencode plugin-runtime dispatch`. |
| `web research` | key_topic | `cli-codex`, `cli-gemini` | Legitimate overlap, but should distinguish `codex web research` from `gemini google-search research`. |
| `convergence` | key_topic | `deep-ai-council`, `deep-research`, `deep-review` | Legitimate overlap across iterative workflows; specialize as council, research, or review convergence. |
| `convergence detection` | key_topic | `deep-research`, `deep-review` | Candidate for dedup. These should become `research convergence detection` and `review convergence detection`. |
| `externalized state` | key_topic | `deep-research`, `deep-review` | Candidate for dedup. Specify `research-state jsonl` vs `review-state jsonl`. |
| `review` | key_topic | `deep-review`, `sk-code-review` | Legitimate overlap, but ambiguous. Use `iterative deep review` vs `findings-first PR review`. |
| `audit` | key_topic | `deep-review`, `sk-code-review` | Candidate for dedup. Use `multi-pass code audit` vs `security/correctness audit`. |
| `scoring` | key_topic | `deep-agent-improvement`, `sk-prompt` | Legitimate overlap, but low-signal alone. Use `agent evaluation scoring` vs `CLEAR prompt scoring`. |

## 4. Top-N Improvement List

### 1. `cli-codex` - 18 / 25

Top issue: D5 duplication and D4 topic echo. `cross ai` appears across the CLI family, and topics like `cli`, `delegation`, `cross-ai`, and `web-research` do not strongly separate Codex from Gemini or Claude.

WHAT to change: update `description`, `derived.trigger_phrases`, and `derived.key_topics`.

WHY: this improves `semantic_shadow` by making the description provider-specific, and improves `lexical` / `derived_generated` by replacing duplicated family terms.

EXAMPLE:

```yaml
description: "Codex CLI executor for OpenAI-backed code generation, repo analysis, PR review, web research, and cross-model validation from another assistant."
trigger_phrases:
  - "codex repo analysis"
  - "codex pr review"
  - "codex web research"
  - "codex cross-model validation"
key_topics:
  - "openai-codex-codegen"
  - "codex-exec"
  - "codex-pr-review"
  - "codex-web-research"
  - "cross-model-validation"
```

### 2. `cli-gemini` - 18 / 25

Top issue: D5 duplication with `cli-codex` and the broader CLI family. The skill is most distinctive when it names Google Search and architecture/large-context analysis.

WHAT to change: update `description`, replace generic `cross-ai` and `web-research` topic entries, and add search-specific trigger phrases.

WHY: this improves `semantic_shadow` separation from Codex and raises `lexical` precision for prompts that ask for Google Search-backed research.

EXAMPLE:

```yaml
description: "Gemini CLI executor for Google Search-backed research, architecture sweeps, large-context code analysis, and cross-model validation."
trigger_phrases:
  - "gemini google search research"
  - "gemini architecture sweep"
  - "gemini large context code analysis"
key_topics:
  - "google-search-research"
  - "large-context-analysis"
  - "gemini-architecture-sweep"
  - "gemini-cross-model-validation"
```

### 3. `deep-review` - 19 / 25

Top issue: D4 and D5. The key topics repeat generic loop vocabulary shared with `deep-research`, and generic review/audit terms overlap with `sk-code-review`.

WHAT to change: keep the description, but sharpen `derived.key_topics` and add review-specific state/finding terms.

WHY: this improves `derived_generated` by separating iterative deep review from normal PR review and from deep research.

EXAMPLE:

```json
"key_topics": [
  "multi-pass-code-audit",
  "p0-p1-p2-findings",
  "review-state-jsonl",
  "release-readiness-gate",
  "residual-risk-triage",
  "review-convergence-stop"
]
```

### 4. `deep-ai-council` - 20 / 25

Top issue: D3 coverage and D4 topic thinness. Seven trigger phrases and seven topics are usable but lighter than sibling skills.

WHAT to change: add council-specific trigger phrases and key topics around seats, deliberation artifacts, and decision comparison.

WHY: this improves `lexical` and `derived_generated` recall for prompts that ask for multi-perspective planning without saying the exact skill name.

EXAMPLE:

```json
"trigger_phrases": [
  "multi-seat strategy deliberation",
  "council decision comparison",
  "ai council planning artifacts",
  "council convergence check"
],
"key_topics": [
  "seat-perspectives",
  "decision-matrix",
  "council-state-artifacts",
  "strategy-deliberation",
  "planning-convergence"
]
```

### 5. `sk-code` - 20 / 25

Top issue: D3. The trigger list is large and contains broad language/tool tokens such as `html`, `css`, `javascript`, `python`, `shell`, `json`, and `mcp`, which can create lexical noise.

WHAT to change: replace broad single-token triggers with intent phrases that describe code-work routing and verification.

WHY: this improves `lexical` precision. The current list can match too many unrelated prompts because generic language tokens are common in code tasks.

EXAMPLE:

```json
"trigger_phrases": [
  "surface-aware code implementation",
  "frontend implementation standards",
  "opencode typescript verification",
  "motion animation integration",
  "stack-specific code quality gate",
  "language-specific verification commands"
]
```

### 6. `cli-claude-code` - 21 / 25

Top issue: D5 overlap through generic CLI-family topics. The description and triggers are serviceable, but topics like `cli`, `delegation`, and `cross-ai` carry little provider-specific signal.

WHAT to change: update `derived.key_topics` and optionally description wording to emphasize Anthropic Claude Code, extended thinking, and structured handoff.

WHY: this improves `derived_generated` and reduces CLI sibling ambiguity.

EXAMPLE:

```yaml
description: "Claude Code CLI executor for Anthropic-backed deep reasoning, code edits, code review, and structured handoff from another assistant."
key_topics:
  - "anthropic-claude-code"
  - "extended-thinking-review"
  - "claude-code-editing"
  - "structured-claude-handoff"
```

### 7. `deep-research` - 21 / 25

Top issue: D4 and D5. Several key topics are generic loop terms shared with `deep-review`.

WHAT to change: specialize `derived.key_topics` around research questions, evidence synthesis, and research-state files.

WHY: this improves `derived_generated` separation between research and review workflows.

EXAMPLE:

```json
"key_topics": [
  "research-question-decomposition",
  "evidence-synthesis",
  "research-state-jsonl",
  "source-triangulation",
  "research-convergence-stop",
  "iteration-deltas"
]
```

### 8. `sk-code-review` - 21 / 25

Top issue: D4. Key topics repeat broad words like `review`, `audit`, `findings`, and `security`, some of which overlap with `deep-review`.

WHAT to change: sharpen `derived.key_topics` toward findings-first PR/code review and security/correctness gates.

WHY: this improves `derived_generated` and separates normal code-review routing from deep iterative review.

EXAMPLE:

```json
"key_topics": [
  "findings-first-pr-review",
  "security-correctness-minimums",
  "merge-readiness-risk",
  "surface-specific-evidence",
  "actionable-line-findings"
]
```

## Interpretation of 015/004 Hypothesis

The audit supports interpretation (b) only partially.

The case against a strong (b): every active skill has a present, moderately specific, 101-128 character `description:` field. Because `semantic_shadow` embeds the SKILL.md description, the description layer is not broadly missing, tiny, or unusably generic. The average score is 21.6 / 25, which is too healthy to conclude that cosine could not possibly help.

The case for a partial (b): duplicated family vocabulary is real. `cli-*` skills share broad terms like `cli`, `delegation`, and `cross ai`; `deep-*` workflows share `convergence`, `convergence detection`, and `externalized state`; review-related skills share `review` and `audit`. Those overlaps mostly affect `lexical` and `derived_generated`, but they can also make adjacent SKILL.md descriptions semantically close, especially within the CLI and iterative-workflow families.

My read: the zero-flip sweep from 015/004 is probably not explained by metadata thinness alone. Better metadata may improve margins and reduce family ambiguity, but the current evidence also fits "0.05 is already adequate for the current corpus" or "the 24-prompt corpus is saturated by lexical/explicit signals."
