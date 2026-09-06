---
title: "Implementation Summary: trigger index replacement"
description: "Gate 1 trigger matching now runs from a committed 3.8 MB index in under 100 ms with no daemon, proven at two-way parity with the live substring lane, and free-text retrieval has a written ripgrep contract."
trigger_phrases:
  - "trigger index generator"
  - "ripgrep retrieval conventions"
  - "parity harness"
  - "exactTriggerSearch parity"
  - "implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/017-memory-database-decommission/001-trigger-index-replacement"
    last_updated_at: "2026-09-03T08:50:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed all eight acceptance rows"
    next_safe_action: "Start phase 002 consumer rewire"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs"
      - ".opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs"
      - ".opencode/skills/system-spec-kit/scripts/retrieval/parity-check.mjs"
      - ".opencode/skills/system-spec-kit/data/trigger-index.json"
      - ".opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-001-trigger-index-replacement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The index needs no sharding: the compact encoding is 3.8 MB"
      - "Cold lookup holds p95 83.7 ms and max 91.0 ms over 36 fresh processes"
      - "The legacy lane can be replayed read-only from the sqlite file without the daemon"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-trigger-index-replacement |
| **Completed** | 2026-09-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Gate 1's trigger matching no longer needs a database, a daemon or an embedding provider. A committed JSON index answers a prompt from a fresh Node process in under 100 ms, and a three-arm harness proves it returns the same candidates as the live substring lane it replaces, with every difference explained by the old lane's own recency window. Free-text retrieval now has a written ripgrep contract instead of an MCP tool.

### The generated trigger index

`generate-trigger-index.mjs` walks every markdown document under `specs` and `.opencode/skills`, reads `trigger_phrases` frontmatter with a strict read-only parser, and publishes `data/trigger-index.json` atomically through a validated temporary file. The artifact is schema 2: a sorted path table, integer postings per normalized phrase, no timestamps, byte-identical across runs. Raw phrase variants live in `fixtures/phrase-variants.json`, and every skipped document is reported in `fixtures/generation-diagnostics.json` with path, line, category and reason. A frozen `fixtures/corpus-manifest.json` pins the included paths, exclusions, corpus hash, parser and schema versions, prompt-set hash and an ignore list with a reason per entry.

### The lookup

`lookup-trigger-index.mjs` normalizes a prompt exactly as the old lane did, keeps the first eight tokens of three or more characters, and returns candidates in the lane's score classes: exact phrase, phrase containment, query containment, token overlap, then partial substring computed at lookup time over the sorted phrase keys. It honors spec-folder scoping and names the index and manifest hashes it answered from.

### The ripgrep contract

`references/retrieval/retrieval-conventions.md` gives the structured, path-only, count and context recipes with `--no-config` and the archive and vendor exclusions, the three-way exit mapping, the caller-side rank tuple, and the capability boundary. Executing the recipes surfaced two facts the plan had asserted without checking: ripgrep accepts `--json` with count flags and the last flag silently wins, and a clean miss and a broken invocation both leave stdout empty.

### The parity harness

`parity-check.mjs` runs the 18-case frozen prompt set through three arms: the legacy lane replayed read-only from the sqlite file with its exact SQL, tier, expiry and scoring rules, the new index through the lookup library, and the ripgrep recipes with the documented ranker. It compares over the intersection of the manifest and the database and reports both difference directions with a named mechanism for each.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs` | Created | Corpus walk, diagnostics, atomic publication |
| `.opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs` | Created | Lookup library and CLI |
| `.opencode/skills/system-spec-kit/scripts/retrieval/measure-cold-lookup.mjs` | Created | Fresh-process latency measurement |
| `.opencode/skills/system-spec-kit/scripts/retrieval/parity-check.mjs` | Created | Three-arm parity harness, probes, recipe and daemon-off records |
| `.opencode/skills/system-spec-kit/scripts/retrieval/lib/{normalize,frontmatter,corpus,artifact,legacy-lane,rg-lane}.mjs` | Created | Normalization, strict frontmatter reader, corpus walk, encoding, legacy replay, ripgrep lane with binary resolution |
| `.opencode/skills/system-spec-kit/scripts/retrieval/fixtures/*.json` | Created | Manifest, diagnostics, variants, prompt set, parity baseline, semantic probes, recipe execution, daemon-off proof, latency report |
| `.opencode/skills/system-spec-kit/data/trigger-index.json` | Created | The committed 3,814,726 byte artifact |
| `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Created | The ripgrep retrieval contract |
| `.opencode/skills/system-spec-kit/scripts/tests/{trigger-index,parity-check}.vitest.ts` | Created | 40 and 31 tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four Opus leaf agents built the generator, the conventions document, the compaction and the harness in two waves, each verified on disk by the orchestrator against the agent's own report. The first encoding measured 37 MB with cold lookup over budget, which settled the spec's open sharding question in favor of a compact encoding rather than more files. The harness agent was killed by a network error after its runs completed, so the orchestrator finished its verification: the baseline verdict on disk, a second run compared field by field, the harness's tests run clean, and a ripgrep resolution gap fixed in the lane after the tests exposed that this machine has no ripgrep on PATH.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Compact encoding instead of sharding | Trigram postings were 59 percent of a 37 MB artifact, and a lookup-time scan over the phrase keys costs at most 12 ms, so the artifact fell to 3.8 MB with identical answers over 120 probes |
| Replay the legacy lane from sqlite, not the daemon | The daemon flaps, and the lane is a SQL query plus a scoring function, both reproducible read-only from the file with no network |
| Compare over the manifest and database intersection | The database was indexed from another checkout, so only paths both sides know are comparable, and the counts outside the intersection are recorded rather than hidden |
| Ignore list in the manifest for one malformed document | Fail-closed generation must not need a manual override on every run, and the exemption joins the manifest identity so it is never silent |
| Resolve ripgrep through PATH and vendored copies | The shell's `rg` is a tool wrapper that spawned processes cannot see, and the machine has no system ripgrep, so the lane falls back to the copies opencode and codex ship |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx --prefix scripts vitest run --config mcp-server/vitest.config.ts parity-check trigger-index` | PASS, 2 files, 71 tests, exit 0 |
| Three consecutive generator runs | byte-identical and SHA-256 identical for index, manifest and variants |
| `node scripts/retrieval/parity-check.mjs --db <sqlite> --json`, two runs | 18 PASS, legacyOnly 0, indexOnly 14 explained, unexplained 0; legacy and index arms identical across runs, ripgrep arm counts moved by one in two cases as the working tree changed |
| `fixtures/latency-report.json` | 36 fresh processes, p50 71.3 ms, p95 83.7 ms, p99 91.0 ms, max 91.0 ms, budget 200 ms |
| `fixtures/recipe-execution.json` | nine runs, exit 0, 1 and 2 observed for each recipe |
| `fixtures/daemon-off-proof.json` | no daemon process, three lookups exit 0 with 20 results each |
| `fixtures/semantic-probes.json` | paraphrase and distractor rows reported as boundary evidence only |
| `validate.sh --strict` on this phase | recorded in the packet after metadata regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The ripgrep arm measures the live tree.** Its match counts change when markdown changes between runs, so the baseline pins only the legacy and index arms. The verdict is unaffected.
2. **Partial candidates carry a zero score.** The lookup returns partial-substring rows the old lane dropped, labelled with score zero, and the harness compares scoring candidates only. Consumers should treat score zero as a weak hint.
3. **One corpus defect is exempted, not fixed.** A captured model transcript under an older packet opens with a rule pair that is not frontmatter. It is on the manifest ignore list with a reason, and phase 004 owns the fix.
4. **Ripgrep must exist somewhere on the machine.** Without a system install, the lane depends on a copy vendored by another tool or on `SPECKIT_RG_BIN`.
<!-- /ANCHOR:limitations -->
