---
title: "Implementation Plan: Sandbox Testing Playbook [system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/plan]"
description: "Five-phase plan for authoring 23 manual playbook scenarios + Docker sandbox harness. Phase A scaffolds the packet; Phase B dispatches 4 parallel cli-codex tracks for scenarios; Phase C updates the root playbook; Phase D dispatches cli-codex for the sandbox harness; Phase E runs verification gates G1-G7."
trigger_phrases:
  - "002-sandbox-testing-playbook plan"
  - "doctor playbook authoring plan"
  - "docker sandbox harness plan"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook"
    last_updated_at: "2026-05-09T16:10:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 plan with 5 phases + dispatch design + reuse patterns"
    next_safe_action: "Draft tasks"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-sandbox-testing-playbook-2026-05-09"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Sandbox Testing Playbook

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter (scenarios) + Bash 3.2 (harness) + Dockerfile + JSON (manifest) |
| **Framework** | OpenCode skills/manual_testing_playbook + system-spec-kit/scripts/tests/ shell harness conventions |
| **Storage** | Flat files; fixture archives downloaded externally |
| **Implementer (scenarios)** | cli-codex (`opencode-go/gpt-5.5` reasoning="high" service_tier="fast") — 4 parallel tracks |
| **Implementer (sandbox)** | cli-codex same model — 1 dispatch with full sandbox file set |
| **Reviewer** | Claude Opus 4.7 (this session) |
| **Validation** | `validate_document.py --type playbook_feature` per scenario; `bash -n` per script; `python3 -m yaml/json.tool` for syntax; `validate.sh --strict` on packet |

### Overview

Five phases. Phase A authors the 6 packet docs (this file is part of A). Phase B dispatches 4 parallel cli-codex tracks for the 23 scenarios. Phase C updates the root playbook (canonical-source-artifacts list + Section 12 cross-reference + last_updated). Phase D dispatches cli-codex for the Dockerfile + 4 harness scripts + 25 shell wrappers + fixture-fetch + manifest. Phase E runs G1-G7 verification gates.

The scenarios test the runtime contract authored in sibling `001-doctor-commands/` against pre-populated fixture states (v3.3.0.0, v3.4.0.0, empty, partial). The sandbox harness wraps each scenario in a reproducible docker invocation that snapshots evidence (stdout, exit code, file deltas, snapshots) and asserts expected signals via grep.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] `spec.md` REQ-001..REQ-043 reviewed and understood
- [ ] User-locked answers captured (Q-A through Q-F in spec)
- [ ] Sibling 001-doctor-commands closed with `_memory.continuity.completion_pct: 100` (verified at session start)
- [ ] Existing playbook conventions captured (per Phase 1 Explore A: 5-section template, NN--name folder naming, global numeric IDs)
- [ ] Existing docker patterns identified (Babysitter Dockerfile as fork starting point per Phase 1 Explore B)
- [ ] Phase parent shape captured (lean trio at 013/ root per Phase 1 Explore C)
- [ ] cli-codex availability confirmed (used successfully in 001-doctor-commands)
- [ ] Current branch is `main`; no auto-branch lingering

### Definition of Done

- [ ] All P0 (REQ-001..REQ-012) verified with evidence
- [ ] All P1 (REQ-020..REQ-027) verified or deferred with documented reason
- [ ] All 23 scenario `.md` files pass `validate_document.py --type playbook_feature`
- [ ] All 4 harness scripts + 23 wrappers pass `bash -n`
- [ ] `harness/run-all.sh --dry-run` exits 0
- [ ] Strict spec-folder validate exits 0 on 002 (acknowledge known cross-packet issue)
- [ ] Root playbook updates land cleanly (3 changes: canonical sources, last_updated, Section 12)
- [ ] `decision-record.md` captures 5 ADRs
- [ ] `_memory.continuity` blocks updated across packet docs
- [ ] `implementation-summary.md` authored with `completion_pct: 100` only after gates green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

**Author-and-dispatch.** Claude authors precision-required docs (013 trio + 002 packet docs + root playbook update). cli-codex dispatches handle high-volume mechanical authoring (25 scenario files + 31 sandbox files). This separates the high-judgment work (cross-cutting decisions, ADRs, root playbook edits) from the high-volume templated work (scenarios + harness scripts).

### Key Components

- **Packet docs layer** (`002-sandbox-testing-playbook/`): authored docs (spec/plan/tasks/checklist/decision-record/resource-map) + auto-generated metadata (description.json + graph-metadata.json) + post-implementation summary.
- **Scenario layer** (`system-spec-kit/manual_testing_playbook/23--doctor-commands/`): 23 per-scenario Markdown files at IDs 323-336, 338-342, 344-347 (gaps at 337 + 343 — see decision-record.md ADR-008) matching canonical 5-section template.
- **Root playbook layer** (`manual_testing_playbook.md`): 3 precision edits — canonical-source-artifacts list, `last_updated` frontmatter, Section 12 cross-reference index.
- **Sandbox layer** (`_sandbox/23--doctor-commands/`): Dockerfile + docker-compose.yml + fixture-fetch + manifest + 4 harness scripts + 23 per-scenario shell wrappers.

### Data Flow

```
Phase A: Scaffold (Claude inline)
   spec.md → plan.md → tasks.md → checklist.md → decision-record.md → resource-map.md
        ↓
   generate-context.js → description.json + graph-metadata.json

Phase B: 23 scenarios via cli-codex (4 parallel tracks)
   Track P-MEM (5):    DOC-323..DOC-327 → 23--doctor-commands/
   Track P-CAUSAL (3): DOC-328..DOC-330 → 23--doctor-commands/
   Track P-LOOP-COCO (6): DOC-331..DOC-336 → 23--doctor-commands/
   Track P-UPDATE-MIGRATE (9): DOC-338..DOC-342 + DOC-344..DOC-347 → 23--doctor-commands/

Phase C: Root playbook update (Claude inline)
   manual_testing_playbook.md (3 edits: canonical sources, last_updated, Section 12)

Phase D: Sandbox harness via cli-codex (1 dispatch, 31 files)
   Dockerfile + docker-compose.yml + fixtures/{fetch.sh, manifest.json, .gitkeep}
   harness/{run-all, reset-state, capture-evidence, assert-signals}.sh
   scenarios/DOC-NNN-*.sh × 25

Phase E: Verification gates G1-G7 (Claude inline)
   G1 validate_document.py per .md
   G2 yaml/json syntax per yaml/json
   G3 strict validate on 002 packet
   G4 strict validate on 013 phase parent
   G5 harness/run-all.sh --dry-run
   G6 bash -n per .sh
   G7 visual root playbook update confirm
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Scaffold 002 packet (this session, ≤45 min)

- [x] Verify 013 phase parent lean trio authored (done at session start)
- [x] Author `spec.md` (Level 3, REQ-001..REQ-043) — done
- [ ] Author `plan.md` (this file)
- [ ] Author `tasks.md` (T-001..T-NNN)
- [ ] Author `checklist.md` (P0/P1/P2 per phase)
- [ ] Author `decision-record.md` (5 ADRs)
- [ ] Author `resource-map.md` (file ledger)
- [ ] Run `generate-context.js` → `description.json` + `graph-metadata.json`
- [ ] Restore parent 013 manual fields after save

### Phase B: 4 parallel cli-codex tracks for 23 scenarios (~2-3 h)

Per dispatch design below. Each track writes to disjoint paths in `23--doctor-commands/`. Sequential within each track; 4 tracks in parallel.

### Phase C: Root playbook update (Claude inline, ≤30 min)

- [ ] Read root `manual_testing_playbook.md` for current state of canonical-source-artifacts list + Section 12
- [ ] Edit: insert `23--doctor-commands/` at end of canonical-source-artifacts list (after `22--context-preservation-and-code-graph/`)
- [ ] Edit: update `last_updated:` frontmatter to today's date
- [ ] Edit: append 23 entries to Section 12 (Feature Catalog Cross-Reference Index) using canonical pattern `> **Feature File:** [NNN](23--doctor-commands/NNN-filename.md)`

### Phase D: Sandbox harness via cli-codex (~3-4 h)

Per dispatch design below. Single dispatch with full sandbox file set in scope. cli-codex uses Babysitter Dockerfile pattern + scripts/tests/test-validation.sh harness conventions as canonical references.

### Phase E: Verification gates G1-G7 (Claude inline, ≤1 h)

- [ ] G1: `validate_document.py --type playbook_feature` per scenario .md (23 files)
- [ ] G2: yaml/json syntax check (Dockerfile, docker-compose.yml, manifest.json)
- [ ] G3: strict spec-folder validate on 002 packet
- [ ] G4: strict spec-folder validate on 013 phase parent
- [ ] G5: `harness/run-all.sh --dry-run` exits 0
- [ ] G6: `bash -n` per .sh file
- [ ] G7: visual root playbook update confirm
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Run `validate_document.py` against all 23 scenario Markdown files and confirm the canonical 5-section playbook shape.
- Run syntax gates for Docker/YAML/JSON and `bash -n` for every harness and scenario wrapper shell script.
- Run `harness/run-all.sh --dry-run` for path resolution, wrapper discovery, and Markdown rollup generation without requiring Docker fixtures.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Sibling `../001-doctor-commands/` remains the locked command/runtime source under test.
- Existing playbook examples and root `manual_testing_playbook.md` define scenario format, indexing, and verdict policy.
- Docker fixture URLs are intentionally out of scope until release-hosted archives exist.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Revert only files in this packet, `23--doctor-commands/`, `_sandbox/23--doctor-commands/`, and root playbook indexing if validation repair needs rollback.
- Keep scenario IDs 323-336, 338-342, 344-347 (gaps at 337 + 343 — see decision-record.md ADR-008) reserved unless the whole packet is withdrawn before publication.
- If sandbox execution blocks on fixtures or Docker availability, retain authored docs and mark real runtime execution deferred.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Unblocks |
|-------|------------|----------|
| Phase A | User-approved packet location and sibling 001 completion | Scenario and sandbox dispatch |
| Phase B | Scenario ID range and locked command references | Root playbook indexing and wrapper mapping |
| Phase C | Phase B filenames | Verification of root playbook coverage |
| Phase D | Phase B scenario contracts | Dry-run harness and wrapper validation |
| Phase E | Phases B-D deliverables | Packet closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Workstream | Estimate | Notes |
|------------|----------|-------|
| Packet docs | 45-60 min | Precision authored; Level 3 structure required. |
| Scenario authoring | 2-3 h | Parallel cli-codex tracks over disjoint ID ranges. |
| Sandbox harness | 3-4 h | Single cohesive dispatch for shell/Docker consistency. |
| Verification | 1 h | Syntax, dry-run, strict validate, and visual root playbook checks. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- Scenario rollback is path-scoped: remove only IDs 323-336, 338-342, 344-347 (gaps at 337 + 343 — see decision-record.md ADR-008) and their root playbook index rows.
- Sandbox rollback is path-scoped: remove `_sandbox/23--doctor-commands/` without touching other playbook categories.
- Packet-doc rollback must preserve parent 013 lean-trio metadata unless explicitly reverting the whole 002 child packet.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
001-doctor-commands
  -> 002 scenario specs (DOC-323..DOC-336, DOC-338..DOC-342, DOC-344..DOC-347)
      -> root playbook index
      -> sandbox wrappers
          -> dry-run harness validation
              -> implementation-summary evidence
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Phase A docs and the locked ID range unblock everything. Phase B scenarios then unblock root playbook indexing and wrapper fidelity checks; Phase D can start once scenario contracts are stable enough for wrapper mapping. Phase E closes only after scenario count, syntax, and dry-run evidence are available.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

- M1: Level 3 packet docs scaffolded and metadata generated.
- M2: 25 scenario files authored and validator-clean.
- M3: Root playbook integrated with category and 25 feature rows.
- M4: Sandbox harness authored and syntax/dry-run clean.
- M5: Strict packet validation and implementation summary evidence captured.
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:dispatch-design -->
## 5. DISPATCH DESIGN

### Phase B — 4 parallel cli-codex tracks

| Track | Scope | Files | Estimated Wall-Clock |
|-------|-------|-------|----------------------|
| P-MEM | DOC-323..DOC-327 (`/doctor:memory` 5 scenarios) | 5 | ~30 min |
| P-CAUSAL | DOC-328..DOC-330 (`/doctor:causal-graph` 3) | 3 | ~20 min |
| P-LOOP-COCO | DOC-331..DOC-336 (`/doctor:deep-loop` 3 + `/doctor:cocoindex` 3) | 6 | ~40 min |
| P-UPDATE-MIGRATE | DOC-338..DOC-342 + DOC-344 (`/doctor:update` 6) + DOC-345..DOC-347 (version migration 3) | 9 | ~60 min |

**Parallelization rationale**: Tracks write to disjoint file paths (different ID ranges) in the same directory. No file conflicts. Per memory caveat about codex parallelism, fallback to serial if hangs detected.

### Phase B — Per-track prompt skeleton

```markdown
ROLE: OpenCode playbook scenario author dispatched by Claude Opus 4.7.

TARGET: Per-scenario Markdown files in `system-spec-kit/manual_testing_playbook/23--doctor-commands/`

CANONICAL TEMPLATE SOURCES (read first; treat as locked):
- /Users/.../manual_testing_playbook/04--maintenance/014-workspace-scanning-and-indexing-memory-index-scan.md (5-section structure with multiple TEST EXECUTION blocks)
- /Users/.../manual_testing_playbook/04--maintenance/035-startup-runtime-compatibility-guards.md (single TEST EXECUTION block)
- /Users/.../manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md (multiple-branch test execution)
- /Users/.../manual_testing_playbook/manual_testing_playbook.md (root playbook execution policy + verdict rules)

CANONICAL COMMAND REFERENCES (the runtime under test):
- /Users/.../001-doctor-commands/spec.md (REQ-001..REQ-023 + per-command spec)
- /Users/.../001-doctor-commands/decision-record.md (ADR-001..ADR-009 council 10-line spec + tx-model)
- /Users/.../commands/doctor/{memory, causal-graph, deep-loop, cocoindex, update}.md (Markdown entrypoints)
- /Users/.../commands/doctor/assets/doctor_*_*.yaml (21 mode YAMLs)

IN_SCOPE_FILES: 5 / 3 / 6 / 11 paths (depending on track) — only files matching DOC-NNN-*.md in IDs 323-336, 338-342, 344-347 (gaps at 337 + 343 — see decision-record.md ADR-008).

HARD CONSTRAINTS:
1. Each .md follows canonical 5-section template (OVERVIEW / SCENARIO CONTRACT / TEST EXECUTION / SOURCE FILES / SOURCE METADATA)
2. Length 75-200 LOC per file
3. Filename pattern NNN-feature-id-slug.md
4. Pass `validate_document.py --type playbook_feature` with valid: true
5. Each scenario cites its corresponding canonical YAML + Markdown entrypoint in SOURCE FILES section
6. Real-execution policy: scenarios MUST be executable for real (PASS/FAIL/SKIP/UNAUTOMATABLE classification, no mocks)
7. Prompt voice: natural-human or RCAF (per existing playbook convention)

PER-SCENARIO EDITS: <list per ID, sourced from spec.md §3 Scope>

VERIFICATION: validate_document.py --type playbook_feature per file; grep for required sections + canonical YAML refs.

OUTPUT: file list + verification output + constraint compliance + halt-and-report on violation.
```

### Phase D — Sandbox harness dispatch

Single dispatch with full file set in scope:
- `Dockerfile` (fork from Babysitter pattern)
- `docker-compose.yml`
- `fixtures/fetch-fixtures.sh` + `fixtures/manifest.json` + `fixtures/.gitkeep`
- `harness/{run-all,reset-state,capture-evidence,assert-signals}.sh`
- `scenarios/DOC-NNN-*.sh` × 25

Estimated wall-clock: ~3-4 hours. Larger scope but cohesive (shared conventions). Single dispatch keeps style consistency.

Per-track prompt for Phase D references:
- Babysitter Dockerfile (`specs/z_future/agentic-system-upgrade/.../babysitter-main/external/Dockerfile`)
- Existing `scripts/tests/test-validation.sh` for harness conventions
- Each per-scenario Markdown file (authored in Phase B) for the matching `Expected Signals` block to wrap
<!-- /ANCHOR:dispatch-design -->

---

<!-- ANCHOR:reuse -->
## 6. REUSE / PATTERNS

- **Per-scenario file template** (per Explore A from existing playbook entries) — 5-section structure (`## 1. OVERVIEW`, `## 2. SCENARIO CONTRACT`, `## 3. TEST EXECUTION`, `## 4. SOURCE FILES`, `## 5. SOURCE METADATA`), naming `NNN-slug.md`, ~75-200 LOC, RCAF or natural-human prompt voice.
- **Babysitter Dockerfile** (`specs/z_future/agentic-system-upgrade/.../babysitter-main/external/Dockerfile`) — Node 20-bookworm + non-root user + workspace mount; fork as Phase D starting point, drop Babysitter SDK, add `python3.11 + sqlite3 + jq + git + curl`.
- **Bash harness conventions** (per Explore B from `scripts/tests/test-validation.sh`) — `set -euo pipefail`, color guards `[[ -t 1 ]]`, function-based modular structure, structured logging, bash 3.2 compatible.
- **Phase parent shape** (per Explore C from 026 root + 008 nested) — lean trio at 013, heavy docs in children. Already applied in this session.
- **Council 10-line spec** from sibling 001-doctor-commands `decision-record.md` ADR-002..ADR-008 — every scenario in DOC-338..DOC-342 + DOC-344 tests one of the 10 lines.
- **Root playbook execution policy** (per Explore A from `manual_testing_playbook.md`) — PASS/FAIL/SKIP/UNAUTOMATABLE classification + checkpoint-before-destructive rule.

## 7. DEFERRED FROM SIBLING 001

001-doctor-commands shipped 5 doctor commands + 21 YAMLs + 1 manifest + 7 packet docs but did NOT run G4-G9 runtime smoke tests (deferred to controlled environment). This packet (002) ships the controlled environment. G4-G9 will be re-runnable via `harness/run-all.sh` once fixtures are hosted (out of scope for this packet but architecture is ready).
<!-- /ANCHOR:reuse -->

---

<!--
LEVEL 3 PLAN (~280 lines)
- 5-phase plan: A (scaffold inline) → B (4 parallel cli-codex tracks) → C (root playbook inline) → D (sandbox cli-codex) → E (verification inline)
- Author-and-dispatch architecture: Claude on precision work, cli-codex on volume work
- Reuse: existing playbook 5-section template, Babysitter Dockerfile, scripts/tests harness conventions
- Implementation contract: 23 scenarios + 31 sandbox files + 8 packet docs + 1 root playbook modify = ~67 files
-->
