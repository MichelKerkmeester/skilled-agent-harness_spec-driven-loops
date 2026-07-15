# Iteration 004 - KQ4: Spec-doc auto-refinement (beyond validation)

**Focus:** How spec docs themselves can be auto-refined — summary, trigger-phrases, EARS, HVR, structure — i.e. document refinement, not just gate-and-reject.
**newInfoRatio:** 0.74
**Novelty:** Confirms embedding normalization strips BOTH frontmatter and heading structure, so curated signal never reaches the vector; and confirms there is no summary generator, no trigger-phrase-from-body derivation, and no HVR/EARS linter — the whole refinement tier is absent.
**Status:** complete

## What I examined
- `content-normalizer.ts` `normalizeContentForEmbedding` pipeline (`:200-232`) [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:200-232]
- `scripts/extractors/` (10 files) [SOURCE: file listing]
- Corpus grep for HVR/em-dash/Oxford/EARS linters [SOURCE: grep across mcp_server + scripts]

## Findings

### F1. The embedding sees neither the curated frontmatter nor the header path
`normalizeContentForEmbedding` runs 8 steps: step 1 **strips YAML frontmatter**, step 7 **drops heading hash marks** (`:222,228`). So the embedding vector never contains the curated `trigger_phrases`/`title`/`description`, and it loses the heading hierarchy (header text survives as bare prose but its path/level is flattened). The high-signal authored fields are indexed only via separate field-weighted BM25 columns — they are absent from the dense vector entirely. This is the mechanical root of the parent's header-path-prefix candidate AND a second, cheaper observation: a deterministic on-write **prefix that re-injects header-path + curated trigger_phrases/title into the chunk text before embedding** would put the corpus's best signal back into the vector. (Retrieval class -> floor-taxed, re-index, prod-mode-proof gated.)

### F2. No document-refinement tier exists at all
- **No summary generator.** The extractors (`conversation-extractor`, `git-context-extractor`, `spec-folder-extractor`, etc.) extract *session/git/file context for memory saves*; none generate an executive summary from a spec-doc body. The EXECUTIVE SUMMARY section is hand-authored, and it is one of the highest-value chunks for both retrieval and logic.
- **No trigger-phrase-from-body derivation.** description.json `keywords` are title word-splits (iter 3 F1); no tool reads the body to propose distinctive trigger phrases.
- **No HVR/style linter.** Grep for em-dash / Oxford / HVR / human-voice across mcp_server + scripts returns nothing. The packet's own P1 requirement REQ-003 ("no em-dashes, no prose semicolons, no Oxford commas") is enforced by **prompt discipline only**, not by automation. (`check-normalizer-lint.sh` is code-helper dedup, unrelated.)
- **No EARS / constraint-tier linter.** Confirms the parent's GO-on-cost EARS candidate is greenfield on the lint side.

### F3. Refinement vs validation is the missing axis
Iter 1 established the write path is detect-and-block. KQ4 confirms the corollary: there is no detect-and-FIX and no generate-to-improve anywhere for the doc body. Every quality lever on the authored markdown is either a hard gate (reject) or a human convention (unenforced). The "perfected data quality" the topic asks for requires adding a refinement tier with three rungs:
1. **Deterministic auto-fix** (HVR punctuation normalization, heading-path prefix, frontmatter<->JSON propagation) — safe, no model.
2. **Extractive generation** (summary candidate, trigger-phrase candidates from body) — cheap, suggest-then-apply.
3. **LLM refinement** (rewrite a generic description into a specific one, EARS-shape a requirement) — gated, async, suggest-only by default.

### F4. Floor placement
HVR fix, frontmatter->JSON propagation, summary into a logic section, EARS linting all bypass the floor (adherence/logic/write-time). Only the chunk-prefix (F1) is retrieval-class and prod-proof-gated. So rungs 1-2 minus the prefix ship on cost; the prefix follows the parent's Stage 5 gate.

## Dead Ends / Ruled Out
- Existing extractors as a doc-refinement substrate: ruled out — they target session/memory-save context, not spec-doc body refinement.
- `check-normalizer-lint.sh` as an HVR linter: ruled out — it dedups runtime normalizer helpers in code, unrelated to prose style.

## Answers
- **KQ4 answered:** Spec-doc auto-refinement is entirely absent. The opportunity is a three-rung refinement tier (deterministic auto-fix, extractive generation, gated LLM refinement) covering HVR normalization, header-path+signal chunk prefix, summary/trigger-phrase generation, and EARS/constraint shaping. All bypass the floor except the chunk prefix.

## Next focus
KQ5: skill-doc corpus quality automation (SKILL.md + references + assets, advisor metadata, smart-router coverage).
