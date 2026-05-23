---
title: "Checklist: 037 llama-cpp embedding worker deep-dive"
description: "Acceptance + QA checklist for the deep-dive packet, canonical L2 sections + P0/P1/P2 tags."
trigger_phrases:
  - "037 checklist"
  - "llama-cpp embedding worker checklist"
importance_tier: "important"
contextType: "spec"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/037-llama-cpp-embedding-worker-deep-dive"
    last_updated_at: "2026-05-14T14:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored canonical L2 checklist"
    next_safe_action: "Phase 1 codex dispatch"
    completion_pct: 10
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: 037 llama-cpp embedding worker deep-dive

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| [P0] | Hard blocker | Cannot claim code behavior without completion |
| [P1] | Required | Must complete or document blocker |
| [P2] | Optional | Can defer with documented reason |

Evidence column conventions: file path with line ref, command exit code, captured stdout snippet, or "N/A — see Limitations."
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Hypothesis stated in `spec.md > Problem & Purpose` with file:line refs
  - Evidence: `spec.md` cites `llama-cpp.ts:216` + `chunking.ts:20`.
- [ ] CHK-002 [P0] Pre-execution questions resolved (diagnostic+fix; 3.17.1 inclusion)
  - Evidence: `spec.md` frontmatter `answered_questions[]`.
- [ ] CHK-003 [P0] Spec folder scaffolded with description.json + graph-metadata.json + all Level-2 docs
  - Evidence: `ls 037-.../` shows 7 files.
- [ ] CHK-004 [P0] Parent 014-local-embeddings-migration spec.md Phase Map updated for row 37 + handoff criteria
  - Evidence: `grep "037-" ../spec.md` returns 2 lines.
- [ ] CHK-005 [P1] Strict validate passes on the spec folder before Phase 1
  - Evidence: `validate.sh --strict` exit 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Source patch limited to ONE file: `shared/embeddings/providers/llama-cpp.ts`
  - Evidence: `git diff --stat HEAD~1` shows one source file changed.
- [ ] CHK-011 [P0] No archive file, no .bak, no .old, no commented-out previous code (per "DELETE not archive" rule)
  - Evidence: `git diff` shows clean replacement.
- [ ] CHK-012 [P0] No dist mirror modified unless `npm run build` is verified broken first
  - Evidence: `git diff` excludes `dist/`.
- [ ] CHK-013 [P1] Env override `SPECKIT_LLAMA_CPP_CONTEXT_SIZE` follows the same shape as 022's BACKGROUND_JOB_CONFIG
  - Evidence: env-override reads from `process.env`, defaults via `||`.
- [ ] CHK-014 [P1] Token-count preflight emits `console.warn` on truncation
  - Evidence: test stderr captured.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `mcp_server/tests/llama-cpp-context-size.vitest.ts` exists with 3 cases
  - Evidence: file present + readable.
- [ ] CHK-021 [P0] Case 1: short body (256 chars) returns Float32Array(768) — no warning
  - Evidence: vitest PASS.
- [ ] CHK-022 [P0] Case 2: long body (4000 chars) returns Float32Array(768) — emits truncation warning
  - Evidence: vitest PASS + warning captured.
- [ ] CHK-023 [P0] Case 3: 256-char query + 8 synonym terms returns Float32Array(768) — preflight kicks in
  - Evidence: vitest PASS.
- [ ] CHK-024 [P0] `npx vitest run tests/llama-cpp-context-size.vitest.ts` exit 0
  - Evidence: command output PASS 3/3.
- [ ] CHK-025 [P1] `npx vitest run tests/governance-ephemeral-decouple.vitest.ts` regression PASS
  - Evidence: 1 file, 3 tests PASS.
- [ ] CHK-026 [P2] Retry-manager regression vitests still PASS (if relevant ones exist)
  - Evidence: optional — only run if there's a known retry-manager test.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Reproduction harness `_sandbox/37--/repro.mjs` exists and runs cleanly
  - Evidence: file present; exit 0 on dispatch.
- [ ] CHK-031 [P0] `run-3.15.1.jsonl` has ≥ 11 rows (size sweep complete)
  - Evidence: `wc -l run-3.15.1.jsonl` ≥ 11.
- [ ] CHK-032 [P0] At least one row in `run-3.15.1.jsonl` has `result=null` for `inputTokens > 512` (REQ-001 evidence)
  - Evidence: `jq` or grep extract.
- [ ] CHK-033 [P0] `run-3.15.1.summary.tsv` is a clean TSV with headers: size, chars, tokens, result, elapsedMs
  - Evidence: `head -1 run-3.15.1.summary.tsv`.
- [ ] CHK-034 [P1] `run-3.17.1.jsonl` + `run-3.17.1.summary.tsv` exist (or version-comparison.md documents why Phase 2 was partial)
  - Evidence: files present OR limitation noted in version-comparison.md.
- [ ] CHK-035 [P1] `version-comparison.md` exists with side-by-side findings
  - Evidence: file present + 3.15.1/3.17.1 columns.
- [ ] CHK-036 [P0] `implementation-summary.md > Hypothesis verdict` contains explicit "CONFIRMED" or "FALSIFIED" token
  - Evidence: grep extract.
- [ ] CHK-037 [P0] Verdict timestamp is BEFORE the source patch commit timestamp (provable via git log)
  - Evidence: `git log` ordering.
- [ ] CHK-038 [P0] Live 4000-char `memory_save({ filePath: "/tmp/test-037.md", retentionPolicy: "ephemeral" })` succeeds
  - Evidence: returned id; row in `memory_index` with `embedding_status='success'`.
- [ ] CHK-039 [P0] Vector exists in `vec_memories` for the test row
  - Evidence: SQLite count query.
- [ ] CHK-040 [P0] `memory_search({ query: "<paraphrase>" })` returns the test row in top 3 with similarity > 0.5
  - Evidence: search response JSON.
- [ ] CHK-041 [P1] `memory_health()` after 10-save soak: `embeddingRetry.flapping=false`, `circuitBreakerOpen=false`
  - Evidence: health response JSON.
- [ ] CHK-042 [P1] Scenario 401 (paraphrase recall) replays via cli-codex single-scenario; VERDICT captured (PASS or PARTIAL, not FAIL)
  - Evidence: scenario output file.
- [ ] CHK-043 [P1] Scenario 411 (causal graph link quality) replays similarly; VERDICT captured
  - Evidence: scenario output file.
- [ ] CHK-044 [P0] Test row + /tmp/test-037.md cleaned up post-Phase-5
  - Evidence: `ls /tmp/test-037.md` returns "no such file" + SQLite row deleted.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-050 [P0] Patch does not alter governance enforcement for non-ephemeral retention
  - Evidence: `scope-governance.ts` untouched; only `llama-cpp.ts` modified.
- [ ] CHK-051 [P0] No new env vars exfiltrate secrets — `SPECKIT_LLAMA_CPP_CONTEXT_SIZE` accepts integers only
  - Evidence: source guards `parseInt(...)` with NaN fallback.
- [ ] CHK-052 [P1] Truncation does not silently drop sensitive content — warning is emitted to operator
  - Evidence: `console.warn` includes char count + truncated tail length.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P0] `decision-record.md` exists with ADR-003 header
  - Evidence: file present + first line "# ADR-003".
- [ ] CHK-061 [P0] ADR-003 documents: status, context, alternatives (A: raise+preflight, B: env-only, C: tokenizer-rewrite, D: do-nothing), decision, consequences
  - Evidence: section headers present.
- [ ] CHK-062 [P0] ADR-003 cites Phase 1+2 evidence file:line
  - Evidence: grep for `run-3.15.1.summary.tsv` + `run-3.17.1.summary.tsv` in ADR.
- [ ] CHK-063 [P1] ADR-003 references ADR-002 lineage (the 032 follow-up trail)
  - Evidence: grep for "ADR-002" in ADR-003.
- [ ] CHK-064 [P1] ADR-003 Status field: `accepted` (not `proposed`)
  - Evidence: grep for "Status: **accepted**".
- [ ] CHK-065 [P0] `032/handover.md` updated with one-line follow-up note
  - Evidence: `git diff handover.md` shows the new line.
- [ ] CHK-066 [P1] `implementation-summary.md` fully filled (not template placeholders)
  - Evidence: no `_pending_` tokens remain.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-070 [P0] All 037 spec docs at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/037-llama-cpp-embedding-worker-deep-dive/`
  - Evidence: `ls` shows all 7 files at that path.
- [ ] CHK-071 [P0] description.json specId="037", folderSlug correct, parentChain valid 3-element list
  - Evidence: `jq .specId description.json`.
- [ ] CHK-072 [P0] graph-metadata.json derived.status updated to "complete" at end of Phase 5
  - Evidence: `jq .derived.status graph-metadata.json`.
- [ ] CHK-073 [P1] `_memory.continuity` blocks in spec.md / plan.md / tasks.md / implementation-summary.md reflect final state
  - Evidence: `next_safe_action` field shows post-Phase-5 status.
- [ ] CHK-074 [P0] Sandbox harness lives under `_sandbox/37--llama-cpp-context-size/`, NOT inside the spec folder
  - Evidence: `ls _sandbox/37--/`.
- [ ] CHK-075 [P1] Parent 014-local-embeddings-migration spec.md Phase Map row 37 still references 037- folder name
  - Evidence: `grep "037-" ../spec.md`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-080 [P0] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <037-folder> --strict` exit 0 at end of Phase 5
  - Evidence: command exit code.
- [ ] CHK-081 [P0] No P0/P1 requirements in `spec.md` left unchecked
  - Evidence: REQ-001..REQ-008 each have evidence in implementation-summary.md.
- [ ] CHK-082 [P0] All checklist items either `[x]` or explicitly deferred with reason
  - Evidence: visual scan + grep for `[ ]`.
- [ ] CHK-083 [P1] All file paths in scope are committed (or explicitly listed as uncommitted in handover)
  - Evidence: `git status` clean for 037-relevant files.
<!-- /ANCHOR:summary -->
