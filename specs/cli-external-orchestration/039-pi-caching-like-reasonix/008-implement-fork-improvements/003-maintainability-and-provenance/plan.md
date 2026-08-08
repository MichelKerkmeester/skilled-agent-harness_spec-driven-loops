---
title: "Implementation Plan: Maintainability and Provenance"
description: "Technical approach for the 4 P2 items behind a hard sequencing gate: coupling-measured seam selection and one-seam-at-a-time extraction with per-step packaging checks, a re-runnable provenance and drift script for both vendored forks, a credential-independent local provider fixture, and a two-part fix for deep-pi's benchmark:live packaging."
trigger_phrases:
  - "maintainability and provenance plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/008-implement-fork-improvements/003-maintainability-and-provenance"
    last_updated_at: "2026-08-08T10:16:05Z"
    last_updated_by: "codex"
    recent_action: "Recorded implementation results, extraction deferral, and final verification"
    next_safe_action: "Run the provenance check on demand after future fork edits"
    blockers: []
    key_files: ["plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-008-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No seam was extracted: prompt transforms were lowest at 60 shared identifiers, while persistence measured 145 and touched one extension-state variable."
      - "The provenance check runs on demand and reports drift without failing builds."
      - "The local boundary fixture ran live in a permitting sandbox and a deepPiDormant logic bug it exposed was fixed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Maintainability and Provenance

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (both forks), plus one Node script for the benchmark entry point |
| **Framework** | Pi extension packaging (`pi.extensions`, npm `files` allowlist, the `#extension` import map) |
| **Storage** | None new; the provenance check records identity, it does not persist state |
| **Testing** | Characterization tests in pi-cache-optimizer's `node:test` + `jiti` suite; packaging checked with `npm pack --dry-run` |

### Overview
Three of the four items are small, self-contained, and independent of each other: a provenance script, a local provider fixture, and a two-line-plus-one-file packaging fix. The fourth — extraction — is neither small nor safe, and the entire plan is arranged so it cannot start before the other phases have made it safe.

The ordering is not this plan's opinion. `research.md`'s closing paragraph records that no lineage recommends starting maintainability work before the correctness and contract items, and that this is agreement across four models rather than one model's view. REQ-001 turns that into a gate with recorded command output.

The three small items can proceed independently of the extraction gate, and the plan sequences them first — they deliver real value without touching `index.ts` at all.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Both `benchmark:live` defects confirmed directly rather than carried over: `deep-pi/package.json:56` declares the script, `.pi/extensions/deep-pi/scripts/` does not exist, and the `files` allowlist at `:36-41` has no `scripts` entry
- [x] pi-cache-optimizer's packaging constraints confirmed: `files: ["index.ts"]` at `package.json:18-20`, `pi.extensions` at `:21-26`, and the `#extension` import map at `:27-29`
- [x] The upstream relationship confirmed as a real extraction cost, not a hypothetical: `package.json:45-48` records the upstream repository
- [x] The entry module's size confirmed by `wc -l` (8,390 lines) against a single 887-line test file
- [x] Phases 001 and 002 both Complete and green, re-verified from their final state: deep-pi 11 files/76 tests and pi-cache-optimizer 34 tests, both exit 0
- [x] Operator authorization to modify files under `.pi/extensions/` recorded in the implementation task

### Definition of Done
- [x] REQ-005 and REQ-007 delivered; REQ-006's live session was deferred by the build sandbox's loopback bind denial, then run and fixed in a permitting sandbox
- [x] REQ-001's gate evidence recorded before any seam was touched
- [x] Extraction was measured and explicitly deferred; no seam was moved, so no extraction step or characterization test was required
- [x] `npm pack --dry-run` clean in both forks from the final state; deep-pi lists `scripts/live-benchmark.mjs`
- [x] Phase 001's composition test and six hook guard tests still green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Small independent fixes first; the risky refactor last and gated. Each extraction step follows the characterization pattern: pin the current behavior with a test that passes against unmodified source, move exactly one seam, re-run, and revert the whole step if anything moved that the test did not predict.

### Key Components

**REQ-007 — `benchmark:live`, fixed in both failure modes.** The smallest item and the clearest, because both halves are independently verifiable:

1. Create `.pi/extensions/deep-pi/scripts/live-benchmark.mjs`. The declaration at `package.json:56` already names the exact path, so the script's location is fixed, not a design decision.
2. Add `"scripts"` to the `files` allowlist at `package.json:36-41`. Without this, step 1 produces something that works in a checkout and is absent from `npm pack`.

Verify with `npm pack --dry-run` and confirm the path appears in the listing. Fixing only step 1 is the exact failure the 4th lineage flagged, so the acceptance criterion requires both.

**REQ-005 — provenance and drift check.** A script, not a document. Two forks, two provenance shapes:

- `deep-pi` was vendored from pinned upstream commit `0f1cbd8124b4fb35df97f85aa943d730f4aae549` (recorded in `../../006-fork-and-improve-deep-pi/001-fix-and-test-deep-pi/`), plus a known set of local patches.
- `pi-cache-optimizer` was vendored from a fork commit of `MichelKerkmeester/pi-cache-optimizer` (recorded in the 039 parent spec), itself forked from the upstream at `package.json:45-48`.

The check records, per fork: the upstream identity it claims, a content hash over the shipped file set (the `files` allowlist, so the hash covers what actually ships rather than the whole directory), and a comparison against the last recorded hash. Output is a report, not an enforcement action — the research called this a slow-burn risk, and a check that fails a build on the first legitimate patch would be worse than the gap it closes. Self-test: make a deliberate one-character local edit, confirm the check reports drift, revert, confirm it reports none.

**REQ-006 — credential-independent local boundary fixture.** The gap is specific: `../../006-fork-and-improve-deep-pi/003-live-verification-and-closeout/` could not run a real boundary check for `opencode/deepseek-v4-flash-free` because no live credential exists for it, so a source-level test stood in. A local provider — an OpenAI-compatible endpoint served locally, registered in a test-scoped Pi configuration under the `opencode` provider name with the `deepseek-v4-flash-free` model id — lets a real session run against it and lets the boundary be observed for real: `deep-pi` must stay dormant and `pi-cache-optimizer` must remain active for that model.

Scope discipline matters here. Phase 001's REQ-004 already proves the *ownership contract* against a `FakePi` double. This fixture exists for what a double cannot show: that a real Pi session, resolving a real provider through its real configuration path, routes the model to the right extension. Build it to answer that question and nothing more. Keep 006/003's disclosed limitation on record even after the fixture works — a local stand-in is not the upstream provider, and deleting the disclosure would overstate what was proven.

**REQ-002, REQ-003, REQ-004 — staged extraction.** Only after REQ-001's gate.

*Seam selection.* The research names seven candidate concerns — prompt transforms, provider adapters, persistence, routing, diagnostics, commands, hooks — without measuring any of them. The completed scan counted lexical identifiers shared with the rest of the module after stripping comments and literals, plus tracked extension-state references. Prompt transforms ranked lowest at 60 shared identifiers and zero state references; routing measured 106/0, commands 101/6, provider adapters 139/1, persistence 145/1, hooks 118/14, and diagnostics 195/0. Persistence around `index.ts:4066-4316` was therefore not the lowest-coupling seam. No candidate met the practical low-coupling bar for an 8,390-line vendored entry file, so no seam was selected or moved.

*Per-seam procedure.* This procedure remained available but was not entered: no seam passed selection, so there were no characterization tests, extracted modules, or independently revertible extraction diffs. The full suites, phase 001 composition test, six hook guards, typechecks, and package dry-runs were still run from the final state.

*Stopping condition.* The measured stop came before characterization: the lowest candidate still had 60 shared identifiers, and moving it would have introduced a new module, `files` allowlist churn, import-map review, and an upstream conflict surface without a concrete maintenance failure to offset that cost. `spec.md` §7 records the no-extraction decision and the seam to re-measure first if future churn changes the trade-off.

### Data Flow
Unchanged by design. Extraction moves code between files without altering behavior; the provenance check reads and reports; the local fixture adds a test-scoped provider that no production path resolves; the benchmark script is an entry point nothing else imports. If any item in this phase changes runtime data flow, it has exceeded its scope.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Record REQ-001's gate evidence: phases 001 and 002 Complete, and both forks' suites re-run green from their final state with the output read
- [x] Capture a packaging baseline in both forks: `npm pack --dry-run` output saved for later comparison
- [x] Re-confirm both `benchmark:live` defects and the pi-cache-optimizer packaging constraints against the live source before editing

### Phase 2: Core Implementation
- [x] REQ-007: create `scripts/live-benchmark.mjs` and add `scripts` to deep-pi's `files` allowlist, in one change so neither half ships alone
- [x] REQ-005: author the provenance and drift script for both forks, hashing over each fork's shipped file set
- [x] REQ-006: stand up the local provider fixture; live session deferred here by `listen EPERM: operation not permitted 127.0.0.1`, then run successfully in a permitting sandbox, which also surfaced and fixed a `deepPiDormant` logic bug (see spec.md REQ-006)
- [x] REQ-002 and REQ-004: measure coupling for the seven candidate seams; no seam met the low-coupling bar, so no characterization tests were created
- [x] REQ-002, REQ-003, REQ-004: **deferred extraction**; no source or package metadata moved
- [x] Re-read the cost of the proposed first seam and stopped before extraction because the lowest candidate still shared 60 identifiers

### Phase 3: Verification
- [x] Provenance check self-tested both ways: a deliberate local edit was reported, a clean tree was not
- [x] `benchmark:live` verified in both halves — the script runs, and `npm pack --dry-run` lists it
- [x] The local fixture is test-scoped and credential-free; live network-boundary observation was deferred here by a loopback bind denial, then completed in a permitting sandbox
- [x] With no extracted seam, final full suites, phase 001's composition test, six hook guard tests, typechecks, and both package dry-runs are green
- [x] Extensions resolve in a real `pi list --approve` after packaging changes; output resolves both local paths
- [x] Scoped diff/status audit completed; no optimizer source, tests, or package metadata changed for this phase
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Characterization | Per seam, pinning current behavior against unmodified source before the move | `node:test` + `jiti` |
| Regression | Full existing suite in both forks after every extraction step | `node:test` and vitest |
| Contract | Phase 001's composition test and six hook guard tests re-run after every step | both runners |
| Packaging | Every extracted module present, and `scripts/live-benchmark.mjs` present | `npm pack --dry-run` in each fork |
| Provenance | Drift reported after a deliberate edit, not reported on a clean tree | the new provenance script, self-tested both ways |
| Live boundary | A real Pi session against the local provider confirms deep-pi dormant and pi-cache-optimizer active for `opencode/deepseek-v4-flash-free` | local provider fixture plus a real `pi` invocation |
| Resolution | Both extensions still load after packaging changes | `pi list` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001 and 002 Complete and green | Internal (predecessors) | Satisfied | Both predecessor checklists were Complete; final suites and phase 001 contract tests were re-run here |
| Operator authorization to modify `.pi/extensions/` | Process | Satisfied | User supplied direct implementation authorization and fixed the phase folder |
| Phase 001's composition and hook guard tests | Internal | Satisfied | 3 deep-pi composition tests and 9 optimizer contract/guard tests passed |
| A local OpenAI-compatible provider for the fixture | External tooling | Loopback blocked at build/review time; ran successfully in a permitting sandbox | REQ-006 is complete — the live run also fixed a real `deepPiDormant` logic bug; 006/003's disclosed credential-gap limitation stays the honest record for the original blocked issue |
| Recorded provenance for both forks | Internal | Satisfied | The script and JSON baseline record both identities and shipped-file hashes |
| Phase 002's REQ-007 benchmark protocol | Internal | Not run | This phase fixes packaging only; the crossover benchmark remains owned by phase 002 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any extraction step fails its characterization tests, the full suite, phase 001's contract tests, or `npm pack --dry-run`; the provenance check cannot be made to report drift reliably in its self-test; or the local fixture cannot be built without a credential or network access
- **Procedure**: extraction is designed to be revertible per step — each seam is one self-contained change including its packaging entry, so reverting that step restores the prior working state exactly. Re-run the full suite and `npm pack --dry-run` after the revert to confirm, rather than assuming a revert is clean. The three small items are additive and revert by deleting what they added
- **Partial rollback**: REQ-005, REQ-006, and REQ-007 are fully independent of the extraction work and of each other; any one can be kept while the others are reverted. Within extraction, reverting a later seam never requires reverting an earlier one, which is the whole reason for the one-seam-per-step rule
<!-- /ANCHOR:rollback -->
