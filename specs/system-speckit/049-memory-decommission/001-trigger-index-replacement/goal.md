---
title: "Goal: Phase 1: trigger-index-replacement"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-memory-decommission/001-trigger-index-replacement"
    last_updated_at: "2026-09-02T20:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Criteria re-baselined against the ripgrep research"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-049-memory-decommission"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: trigger-index-replacement

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build a generated trigger index and a written ripgrep contract, proven at two-way parity against the live substring lane before anything is removed.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The index is a versioned JSON artifact committed to the repository, sorted keys, no timestamps, a path table with integer postings per phrase; partial-substring candidates are computed at lookup over the phrase keys, not stored |
| D2 | No stop-words, no stemming and no semantic claims in v1: the live substring lane is the parity baseline |
| D3 | Ripgrep is an evidence producer, never the relevance ranker; the caller ranks and maps exit codes 0, 1 and 2 or more |
| D4 | This phase adds files only; no consumer is repointed and nothing is deleted, so both mechanisms stay live for comparison |
| D5 | Generation publishes atomically and never replaces the last known-good index when any malformed document is found |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] The three-arm parity harness reports zero unexplained legacy-only and index-only differences on the frozen 18-case prompt set, with corpus and prompt hashes recorded
- [ ] A second generator run leaves the index byte-identical and hash-identical under `git diff --exit-code`
- [ ] The generator completes with exit 0 with the MCP server stopped and no network
- [ ] Every malformed, empty, alias, generic, duplicate and oversized frontmatter variant is reported with path, line, category and reason
- [ ] Fresh-process lookup p95 and max are recorded under 200ms over at least 30 runs, with corpus and index sizes
- [ ] The retrieval conventions doc gives a runnable ripgrep recipe for structured, path-only and count retrieval, each executed once with its exit code read
- [ ] Gate 1 returns trigger matches in a session with the daemon stopped
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Research input | Done | `../005-ripgrep-retrieval-research/research/lineages/luna-max/research.md` sections 6, 7, 10 and 11 |
| Spec, plan, tasks and acceptance amended | Done | REQ-008 to REQ-013, T015 and T016, AC-001 to AC-008 rewritten; validate --strict 0 errors |
| Generator, lookup, manifest, diagnostics | Done | schema 2 artifact 3,814,726 bytes, three runs byte-identical, 40 tests |
| Cold-start latency | Done | 36 fresh-process runs, p95 83.7 ms, max 91.0 ms, budget 200 ms |
| Retrieval conventions | Done | `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`, three recipes executed |
| Parity harness and acceptance | Done | 18 cases PASS, legacyOnly 0, unexplained 0; AC-001 to AC-008 Met |

### Deviations and findings

| Item | Note |
|------|------|
| Parity check widened from one-way to two-way | The research showed a one-way `missing: 0` check cannot detect index-only extras or lifecycle leakage |
| Trigram postings dropped for a lookup-time key scan | Schema 1 measured 37 MB and 237 ms p95; the scan costs at most 12 ms at the eight-token cap and the artifact fell to 3.8 MB with identical answers over 120 probes |
<!-- /ANCHOR:log -->
