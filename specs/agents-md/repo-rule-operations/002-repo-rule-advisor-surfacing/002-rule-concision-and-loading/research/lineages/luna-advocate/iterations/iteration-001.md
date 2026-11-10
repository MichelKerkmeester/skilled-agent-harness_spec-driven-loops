# Iteration 1 — Full-load affordability

## Focus

Is loading every repository rule affordable, given per-session and per-compaction token load, caching, compression, and information loss? [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-advocate/steer.md:4-6]

## Actions Taken

1. Read the prep measurements, Gate 5 and §8 loading clauses, the repository trigger table, and the rule anatomy guidance. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:17-26; AGENTS.md:9,93-101; REPO RULES.md:12-18,36-52; .skilled/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md:51-66]
2. Checked current OpenAI API documentation for prompt-cache mechanics. This is API documentation; no claim is made that the Codex invocation exposes the same pricing or usage counters. [SOURCE: https://developers.openai.com/api/docs/guides/prompt-caching, lines 947,952-954,1045-1047]
3. Measured the existing router's 13-row trigger-table excerpt at 4,984 bytes with wc -c on 2026-10-04. This is a byte measurement, not a tokenization measurement. [SOURCE: REPO RULES.md:38-52]

## Findings

### F1 — Full-load token math

The prep pack estimates AGENTS.md at 27,012 bytes / about 6.8k tokens, REPO RULES.md at 11,853 bytes / about 3.0k tokens, and all 13 rule files at 107,092 bytes / about 26.8k tokens. Its all-at-once total is about 146 KB / 37k tokens, using roughly four bytes per token. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:19-26]

Therefore, one full-load context window costs about 37k input tokens in this estimate. A session that reaches Gate 5 and a substantive reply which loads the five reply-time rules uses about 6.8k + 3.0k + 10.7k = 20.5k tokens before any additional action-triggered rule files; the five reply rules are a subset of the 13, so do not add them again to the 37k total. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:21-26; AGENTS.md:93-101; AGENTS.md:259-261]

Per compaction window, the full-bundle scenario is about 37k tokens if AGENTS.md, the router, and all 13 rules are reintroduced. If only the 13 rule bodies are re-read, the measured rule-only estimate is 26.8k tokens. The pack records 104 re-reads after compaction boundaries, but not which rule was read in each window or the number and type of windows; actual cumulative re-read tokens per session are UNKNOWN. Under a repeated full-load assumption, k full-load windows cost about 37k × k tokens cumulatively, not 37k total for the whole session. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:23,26,35-37; ASSUMPTION for k-window multiplication]

### F2 — Case for full loading

The broad-load case is that every rule's full wording is present regardless of which trigger the model recognizes. This could reduce selection misses when a request crosses several action categories. The repository's stated design instead loads every rule named by each action trigger, with multiple matching triggers composing; Gate 5 also says to load every rule named by the table. [SOURCE: REPO RULES.md:12-18,36-52; AGENTS.md:93-101]

This is a coverage rationale, not measured proof that loading all 13 changes behavior more than the trigger-based design. The prep baseline describes a non-randomized observational split, not a controlled comparison of all-rules versus action-triggered loads. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:41-51]

### F3 — Case against full loading

A blanket load spends about 37k estimated tokens in every window where all sources are present; the five reply-time rules alone are about 10.7k tokens and the rule files alone are about 26.8k. The pack also records 104 post-compaction re-reads, so repeated context restoration is a real cost pattern, although its exact token total is UNKNOWN. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:23-26,35-37]

The behavioral evidence is mixed and observational. Table-pattern detection is 20.3% after communication.md was read (1,063 replies) versus 11.6% in never-read sessions (86); semicolon-pattern detection is 17.0% after communication-prose.md was read (1,015 replies) versus 43.7% in never-read sessions (215). Sessions were not randomized, and pattern detection counts legitimate tables in requested documents and semicolons in unfenced code, so these numbers do not establish that reading caused either result. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:43-51]

### F4 — Prompt caching changes cost, not rule length

OpenAI API prompt caching reuses key-value state when a later request has the same reusable prefix; its documentation says the cache stores KV tensors, and new input still has to be processed. The current API guide lists, for GPT-5.6 and later, a 1.25× cache-write rate and cached reads at 0.1× for most models or 0.05× for GPT-6.1 Sol. Those rates are API/model-specific and do not establish a price for this gpt-6-luna Codex invocation. [SOURCE: https://developers.openai.com/api/docs/guides/prompt-caching, lines 952-954,1045-1047]

Inference: caching can reduce repeated input processing and billing while the prompt still contains the rule text; that does not free the corresponding context capacity. Compaction changes the prefix and can lower cache reuse, while a shorter compacted prompt can still reduce total input cost. [SOURCE: https://developers.openai.com/api/docs/guides/prompt-caching, lines 1897-1899; inference from lines 952-954 and 1533-1535]

The current invocation metadata records the selected model but contains no usage counters. Cache hits, cached-token counts, billing, and usable context-window capacity for this runtime are UNKNOWN. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-advocate/invocation-metadata.json:1]

### F5 — Compression scenarios and what they lose

The existing router trigger-table excerpt is 4,984 bytes; the 13 full rule files total 107,092 bytes. The excerpt is therefore 95.3% fewer bytes than the rule corpus, but it contains action triggers and short “It settles” summaries, not the full rule content. This is a measured byte-size proxy, not a validated replacement ratio for behavior. [SOURCE: REPO RULES.md:38-52 (4,984 bytes measured 2026-10-04); specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:23; derived: 1 - 4,984 / 107,092]

ASSUMPTION: the candidate card bounds named in steering (935–1,784 bytes per rule) applied to all 13 files would total 12,155–23,192 bytes, or about 78.4–88.6% fewer bytes than the current 107,092-byte corpus. This calculation is not a measured token ratio or a fidelity result; steering identifies the card size as a claim from another lineage. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-advocate/steer.md:11; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:23; ASSUMPTION that the size bounds apply to all 13 cards]

The rule anatomy says each file carries a trigger section, one binding rule sentence, a numbered body, and a final self-check; self-check items track obligations, and subject-specific sections vary. A card that keeps only frontmatter, Fires when, and The rule can omit numbered obligations, their examples or repairs, qualifications, and the self-check. The size savings therefore have an information-loss risk that must be tested against the operative prohibitions. [SOURCE: .skilled/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md:51-66,74-85; specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/research/lineages/luna-advocate/steer.md:11]

A behavior-preserving compression ratio is UNKNOWN. The byte scenarios do not show whether a shorter rule still binds the same behavior. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:41-51; .skilled/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md:51-66]

## Decision

Treat 37k estimated tokens as the full-bundle budget for each context window in which all files are loaded. The evidence supports a broad-coverage rationale, but it does not establish that this Codex runtime has enough spare context or what repeated input costs; both are UNKNOWN. On the available evidence, universal full loading cannot be called affordable. A decision needs per-request input/cache telemetry and the usable context limit for this runtime. [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md:19-26,35-37; invocation-metadata.json:1; https://developers.openai.com/api/docs/guides/prompt-caching, lines 1533-1535]

## Questions Answered

- What does a full load of the repository rules cost per session and per compaction window?
- How does prompt caching affect input cost versus context occupancy?
- What compression range is plausible, and what behavior does compression risk losing?

## Questions Remaining

- Which cross-lineage claims survive adversarial review?

## Next Focus

Read the current steering file again, then attack each named claim with a counter-argument, evidence, a settling measurement, and a verdict.

## Telemetry Note

newInfoRatio 0.78 is a subjective novelty estimate for the iteration, not a measured statistic.

## Scope Constraints

The standard reducer, packet validator, and memory generator were not run because their standard paths target the spec packet outside the user-authorized lineage directory. The reducer was disabled in the lineage config and the registry/dashboard will be maintained as lineage-local projections.
