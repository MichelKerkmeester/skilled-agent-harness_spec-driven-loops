---
title: "Tasks: Phase 5: trigger-phrase-quality-and-matcher-guards"
description: "17 tasks across confirm-before-fix, baseline capture, write-side guards, matcher guards, data-repair migrations, hot-path caching, and baseline-vs-delta verification. Every fix task cites its deep-dive report / findings-ledger reference with file:line."
trigger_phrases:
  - "trigger phrase quality tasks"
  - "trigger regeneration migration"
  - "match triggers baseline latency"
  - "constitutional trigger hygiene"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/005-trigger-phrase-quality-and-matcher-guards"
    last_updated_at: "2026-07-03T12:15:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored task breakdown with finding references and confirm-before-fix ordering"
    next_safe_action: "Start T001 confirm-before-fix verification of the agent-reported findings"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-trigger-phrase-quality-and-matcher-guards"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: trigger-phrase-quality-and-matcher-guards

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Finding references use deep-dive report section numbers (report §N) and findings-ledger tags (ledger LN / Agent letter) per the program's cross-cutting rules: citations live HERE, never in code comments.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm-before-fix: re-verify every agent-reported (🟡) finding against current code before writing any fix - (a) auto-fix replaces user triggers at handlers/memory-save.ts:537 (ledger Agent G P2); (b) specFolder exact-match at handlers/memory-triggers.ts:449 and :269 (report §3 P1 #10, ledger Agent E); (c) apostrophe/multi-line phrase drop in lib/parsing/memory-parser.ts:820 item regex (ledger Agent H P2); (d) full-corpus disk re-read per 60s TTL via readCanonicalSpecDocContent at lib/parsing/trigger-matcher.ts:333 (report §4 item 2, ledger Agent E OPT); (e) backfill re-pends failed rows forever + FK rows for deleted memories in lib/search/trigger-embedding-backfill.ts (ledger Agent E P2); (f) sample quality-loop extractor output on 20+ legacy word-soup rows to validate it as the regeneration engine. Record confirmed/refuted per item here before T003+ starts.
  <!-- finding-is-a-hypothesis gate: all six are 🟡 agent-verified; only ledger L4/L5 corpus stats are 🟢 live-confirmed -->
- [ ] T002 Baseline capture (before ANY change): (1) run the full vitest trigger suites (trigger-latency-budget, trigger-goldens, trigger-extractor, trigger-backfill-resume, integration-trigger-pipeline, semantic-trigger-matcher) and store pass/fail counts; (2) re-measure memory_match_triggers latency locally - deep-dive reference: 2.3s warm / 17s cold (report §1, ledger L4) - record warm p50 over 10+ calls UNDER write/scan churn (clearCache()-firing saves interleaved between calls, matching how the 2.3s baseline arises), plus one cold-start figure; (3) reproduce the junk-match: resume-style prompt returns 5/5 z_archive rows via single-word matches at weight 0.8 (ledger L4); (4) snapshot corpus stats: 165,979 phrase occurrences, 45% single words, top offenders "feature" x2,072 / "specification" x2,034 / "z_archive" x848 (report §1); (5) snapshot constitutional tier: 70 rows / 20 distinct titles / sandbox row id 38797 present (ledger L5); (6) snapshot memory_stats totalTriggerPhrases for the post-migration comparison.
  <!-- baseline-before-delta rule: T016 compares against these exact numbers; no "no regressions" claim without them -->
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Write-side merge-not-replace: auto-fix merges qualityLoopResult.fixedTriggerPhrases with user-authored triggers instead of overwriting parsed.triggerPhrases (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:537)
  <!-- finding: report §3 P2 highlights ("quality auto-fix replaces user-authored triggers", default ON); ledger Agent G P2 - feeds L4 trigger churn | REQ-004 -->
- [ ] T004 Case-insensitive dedupe + phrase count cap on the merged list, user-authored phrases kept preferentially on truncation (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts + lib/parsing/memory-parser.ts)
  <!-- finding: phase-decomposition 005 write-side item; companion to T003 so merge cannot balloon counts | REQ-004 -->
- [ ] T005 [P] Parser fix: frontmatter trigger extraction handles apostrophes and multi-line YAML list items instead of silently dropping them (.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:820)
  <!-- finding: ledger Agent H P2 ("multi-line trigger phrases with apostrophes silently dropped"); report §3 P2 highlights | REQ-008 -->
- [ ] T006 Matcher guard: stopword set + min-length + IDF floor for single-token matches, plus per-memory phrase dedup; tune IDF/min-length against the live corpus and add an allowlist slot for rare-but-real single tokens (.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts)
  <!-- finding: ledger L4 🟢 (single-word z_archive matches at weight 0.8); Agent E P2 per-memory dedup | REQ-002 -->
- [ ] T007 specFolder prefix matching in match_triggers scope filter using the shared path-segment-aware idiom `folder === specFolder || folder.startsWith(specFolder + '/')` (hybrid-search.ts:571, memory-search.ts:1334, retrieval-rescue.ts:366), or the specFolderLikePattern() `<folder>/%` helper (vector-index-types.ts:34) for any SQL lane - replacing the exact-match `row.spec_folder !== specFolder` at :450 and :269; the trailing '/' is required so "028-foo" does not match "028-foobar"; keep the documented fail-closed behavior at :449 for scoped requests (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:449,269)
  <!-- finding: report §3 P1 #10 ("exact-match while every other surface is prefix-aware -> phase-child recall loss"); ledger Agent E P1 | REQ-005 -->
- [ ] T008 [B] Archive/deprecated exclusion in the trigger cache loader using the phase 002 shared active-row predicate - blocked until 002 lands; consume the predicate, never fork it (.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts)
  <!-- finding: ledger L5 🟢 (z_archive + deprecated rows rank in trigger matches); DUP MECHANISM channel-inconsistency; dependency: phase 002 predicate | REQ-006 -->
- [ ] T009 Constitutional write guard: reject constitutional-tier saves whose source path matches /tmp or sandbox locations, with an explicit error (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts)
  <!-- finding: ledger L5 🟢 (sandbox row id 38797 from /tmp/speckit-manual-playbook-sandbox auto-injected into every session priming) | REQ-007 -->
- [ ] T010 [P] Backfill hardening: failed rows keep failed status behind an attempt cap/backoff; FK cleanup removes phrase rows for deleted memories (.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts)
  <!-- finding: ledger Agent E P2 ("trigger backfill re-pends failed phrases forever (no cap)") + FK cleanup item | REQ-009 -->
- [ ] T011 Regeneration migration: batched + resumable + idempotent migration that re-extracts trigger phrases for legacy word-soup rows via the quality-loop extractor. Selector predicate: rows whose stored trigger_phrases are all/predominantly single tokens drawn from the row title (title-word-soup) AND predating the write-side guards (T003-T005). MERGE re-extracted phrases with the row's existing phrases (case-insensitive dedup, never blind-replace) to preserve any surviving user-authored trigger (legacy auto-fix already ran replace, so none can be assumed absent). SKIP z_archive/archived-tier rows (excluded once 002's predicate lands, ~11k) and constitutional rows. Dry-run on a DB copy with before/after audit before touching production; keep pre-migration snapshot (new migration following the vector-index-schema.ts pattern; engine: .opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts)
  <!-- finding: ledger L4 🟢 (old rows store title-word-soup; new rows fine - retroactive repair required); report §7 Wave-1 item 5 | REQ-001 -->
- [ ] T012 Constitutional hygiene migration: dedup 70 rows to 20 distinct titles, purge sandbox row id 38797; audit query proves the final set (same migration batch as T011 or a sibling migration)
  <!-- finding: ledger L5 🟢 (70 rows / 20 distinct / 3.5x duplication + sandbox row); report §7 Wave-1 item 4 | REQ-007 -->
- [ ] T013 (path, mtime)-keyed phrase extraction cache as a SEPARATE store from the TTL trigger cache: cache loader reuses extraction results for unchanged (path, mtime) pairs; `clearCache()` (trigger-matcher.ts:583, fired on every write by mutation-hooks.ts:132 + chunking-orchestrator.ts:472/584/640) and the 60s CACHE_TTL_MS expiry (:489) must NOT clear the extraction entries; TTL expiry stops triggering full-corpus disk re-reads (.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:333)
  <!-- finding: report §4 item 2 ("trigger cache rebuild re-reads every canonical spec doc from disk each 60s TTL, synchronously, in the hot path"); ledger Agent E OPT 🟢 2.3s warm | REQ-003 -->
- [ ] T014 [P] Batched record fetch: hydrate matched memory records with a single id IN query instead of per-candidate fetches (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
  <!-- finding: phase-decomposition 005 perf item (batched record fetch); companion to T013 for the p50 < 300ms gate | REQ-003 -->
- [ ] T015 Decide + document constitutional-row visibility to the trigger cache: include (guarded) or keep excluded with rationale; record the decision in implementation-summary.md and make behavior match (.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts)
  <!-- finding: ledger Agent E refinement ("constitutional memories structurally invisible to match_triggers cache") - decide + document either way per phase-decomposition | REQ-010 -->
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Adversarial matrix + unit/integration tests: enumerate and execute the matrix rows from plan.md (token class x row tier x specFolder scope x cache state x phrase syntax), including resume-prompt tokens, literal "z_archive", stopword-only prompt, parent-folder scope over phase children, "user's trigger", and multi-line YAML phrase; all new guards/fixes covered by vitest
- [ ] T017 Delta verification vs T002 baseline: re-run the WHOLE vitest gate; re-measure warm p50 UNDER write/scan churn (< 300ms gate) and cold start; re-run the resume-prompt reproduction (expect 0 z_archive single-word hits, active-packet docs surfaced); re-audit corpus single-word share and constitutional counts (20 distinct, no id 38797); report every delta against the recorded baseline numbers
- [ ] T018 Docs sync + evidence: update match_triggers tool doc for prefix-scope semantics; mark checklist items with evidence; record migration audit numbers, the T015 decision, and the memory_stats totalTriggerPhrases drop explanation in implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T008 unblocked by phase 002 or deferral approved)
- [ ] No `[B]` blocked tasks remaining
- [ ] Success gates verified with evidence: warm match_triggers p50 < 300ms; resume-style prompts surface active-packet docs, not z_archive; regeneration + constitutional audits recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (REQ-001..REQ-010 map to tasks above)
- **Plan**: See `plan.md` (affected-surfaces inventory, testing strategy, rollback)
- **Sources**: ../research/phase-decomposition.md §005; ../research/deep-dive-report.md §1, §3 P1 #10, §4 item 2, §7 Wave 1; ../research/findings-ledger.md L4, L5, Agent E section
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
