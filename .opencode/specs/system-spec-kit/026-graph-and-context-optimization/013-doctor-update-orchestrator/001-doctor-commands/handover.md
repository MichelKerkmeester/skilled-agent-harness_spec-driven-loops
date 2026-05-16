---
title: "Session Handover: Doctor Commands [system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands/handover]"
description: "Handover for the doctor command surface authoring work. 5 new /doctor:* commands + /doctor:update orchestrator + 10 YAML assets + migration manifest shipped via cli-codex gpt-5.5 high fast across 5 sequential dispatch tracks. Phase A-E complete; G1+G2 verification gates pass; G3 fails on cross-packet template-manifest drift; G4-G9 runtime smoke deferred to controlled env. Next agent picks up at: run /doctor:update E2E against v3-3 workspace OR fix G3 template-manifest issue OR resume runtime smoke gates G4-G9."
trigger_phrases:
  - "001-doctor-commands handover"
  - "doctor commands handover"
  - "/doctor:update handover"
  - "doctor surface authoring handover"
  - "G4-G9 verification handover"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands"
    last_updated_at: "2026-05-11T10:50:00Z"
    last_updated_by: "main-claude-opus-4.7"
    recent_action: "Authored 001 handover.md for parity with sibling 002 (closes P2-007-003 from re-review)"
    next_safe_action: "Run /doctor:update E2E against fresh v3-3 workspace OR resume G4-G9 runtime smoke gates"
    blockers:
      - "G3 template-manifest validator drift (cross-packet — also affects 002 and 003)"
      - "G4-G9 runtime smoke deferred to controlled environment with disposable workspace"
    key_files:
      - ".opencode/commands/doctor/memory.md"
      - ".opencode/commands/doctor/causal-graph.md"
      - ".opencode/commands/doctor/deep-loop.md"
      - ".opencode/commands/doctor/cocoindex.md"
      - ".opencode/commands/doctor/update.md"
      - ".opencode/commands/doctor/assets/doctor_update.yaml"
      - ".opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh"
      - ".opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json"
      - "ai-council/council-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "handover-001-doctor-commands-2026-05-11"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "ADR-001 through ADR-010 captured in decision-record.md (council 10-line + mode reduction)"
      - "Council R1 2026-05-09: 7 fixes (FIX-00..06) shipped + live-verified at 16-min runtime"
      - "Council R2 2026-05-09: 4 fixes (FIX-07..10) shipped closing spec metadata gap"
      - "Patches 2026-05-09: FIX-12 (signal_d head-1 bug) + FIX-13 (backfill --active-only)"
      - "RM-8 doc-honesty remediation (commit 495fdd282) closed 30/30 P1 + 28/30 P2 findings; re-review (commit 76daa9ef0) verdict PASS hasAdvisories=true"
---
# Session Handover: Doctor Commands

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 2026-05-09 (multi-hour cli-codex gpt-5.5 high fast authoring) + 2026-05-11 (cli-codex doc-honesty remediation + deepseek-v4-pro re-review)
- **To Session:** next agent picking up doctor-command runtime verification or follow-on hardening
- **Phase Completed:** Phase A scaffold + Phase A.1 tx-model verify + Phase B 4 isolated commands + Phase C `/doctor:update` orchestrator + Phase D migration manifest + Phase E gates G1+G2 PASS + 003 RM-8 remediation (doc honesty + security hardening + cross-runtime mirror) + post-remediation re-review PASS
- **Phase NOT Completed:** G3 template-manifest validator drift (known cross-packet) + G4-G9 runtime smoke gates (deferred to controlled environment)
- **Handover Time:** 2026-05-11T10:50:00Z
- **Branch:** main (no feature branches per memory rule)
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Council 10-line spec for `/doctor:update` orchestrator | Multi-AI council R1 + R2 converged on dependency-ordered rebuild with snapshot + rollback | Locked the orchestrator contract; documented in decision-record.md ADR-001..ADR-007 |
| Per-subsystem doctor commands (memory, causal-graph, deep-loop, cocoindex) + unified update orchestrator | Each subsystem has independent health signals + remediation; orchestrator chains them in dependency-safe order | 5 new doctor commands; each ships interactive + JSON output modes |
| ADR-008: detect-and-recommend semantics, never auto-delete | Migration manifest gap detection refuses unknown source versions instead of silently skipping | Safe-fail under version drift |
| ADR-010: One interactive YAML per doctor command (mode reduction) | User directive: "they should all be interactive. no Auto mode" | Deleted 21 mode YAMLs (auto/apply/apply-confirm/default), kept 10 (8 _confirm + 2 mcp); renamed _confirm.yaml → bare doctor_X.yaml |
| Migration manifest schema with `last_indexed_at` + `mtime` comparison | Detect drift between markdown source mtime and indexed embedding state | Supports both incremental refresh + full rebuild paths |
| Bootstrap script as separate `.sh` (not inlined in YAML) | Bootstrap needs to run BEFORE the YAML workflow loads MCP runtime; chicken-and-egg | `doctor-runtime-bootstrap.sh` shipped as standalone with `flock(2)` lock; post-RM-8 it uses proper FD-held flock instead of mkdir-lock |
| Council 10-line preserved verbatim in spec.md REQ-004..REQ-017 | Spec must be auditable against the council decision | spec.md REQ section directly mirrors council R1 output |

### 2.2 Blockers Encountered

| Blocker | Status | Resolution/Workaround |
|---------|--------|-----------------------|
| Phase 5+7+10 of E2E verification truncated by opencode session budget (96K cap) | open | Reset budget then resume from Phase 5 checkpoint OR dispatch via cli-codex gpt-5.5 high fast |
| FIX-12 (signal_d head-1 bug) discovered late in Phase E | resolved | Patched in-session; verified against real v3.3 fixture |
| FIX-13 (backfill --active-only) needed for migration completeness | resolved | Patched + verified |
| G3 strict-validate template-manifest drift (TEMPLATE_HEADERS + ANCHORS_VALID) | open (cross-packet) | Same drift pattern affects 002 + 003 packets; canonical fix pattern is in 010/003 reference — use cli-codex high-effort with that as template |
| G4-G9 runtime smoke gates (real `/doctor:update` execution against disposable workspace) | deferred | Out of original session scope; requires sandbox harness from sibling 002 packet + real fixtures (v3-3 + v3-4 now wired per 002 handover) |
| `--no-audit` flag in doctor-runtime-bootstrap.sh (security advisory) | resolved by 003 remediation | Replaced with soft `npm audit --audit-level=high` warning step; commit 495fdd282 |
| mkdir-based lock (TOCTOU race risk) in doctor-runtime-bootstrap.sh | resolved by 003 remediation | Replaced with `flock -n 9` at FD-held lockfile `/tmp/doctor-runtime-bootstrap.lock`; commit 495fdd282 |
| Cross-runtime command mirror missing for 3/4 runtimes (R8-P1-001 from deep-review) | resolved by 003 remediation | `.claude/commands/doctor/` was already mirrored; `.gemini/commands/doctor/` got 8 new TOMLs (10 total); codex uses `.codex/prompts → .opencode/commands` symlink; commit 495fdd282 |

### 2.3 Files Modified (this session, cumulative)

| File / path | Change Summary | Status |
|-------------|---------------|--------|
| `.opencode/commands/doctor/memory.md` + `assets/doctor_memory.yaml` | New `/doctor:memory` command + YAML workflow (Phase B) | complete |
| `.opencode/commands/doctor/causal-graph.md` + `assets/doctor_causal-graph.yaml` | New `/doctor:causal-graph` command + YAML workflow (Phase B) | complete |
| `.opencode/commands/doctor/deep-loop.md` + `assets/doctor_deep-loop.yaml` | New `/doctor:deep-loop` command + YAML workflow (Phase B) | complete |
| `.opencode/commands/doctor/cocoindex.md` + `assets/doctor_cocoindex.yaml` | New `/doctor:cocoindex` command + YAML workflow (Phase B) | complete |
| `.opencode/commands/doctor/update.md` + `assets/doctor_update.yaml` | New `/doctor:update` orchestrator command + YAML workflow (Phase C) | complete |
| `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` | Bootstrap script; replaced mkdir-lock with `flock -n 9`; dropped `--no-audit`; soft `npm audit` warning (003 remediation) | complete |
| `.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json` | Migration manifest with `last_indexed_at` + `mtime` schema (Phase D) | complete |
| `.opencode/commands/doctor/*.md` (10 files total — 5 new + 5 pre-existing) | Added `<!-- skill_agent: system-spec-kit -->` anchor (003 remediation Batch C) | complete |
| `.gemini/commands/doctor/*.toml` (10 files — 8 new + 2 pre-existing) | Cross-runtime mirror in gemini TOML format (003 remediation Batch C) | complete |
| `.opencode/specs/.../013-.../001-doctor-commands/*` packet docs | Reconciled completion state to consistent "COMPLETE (~95%)" across title + body + continuity; marked checklist items with evidence anchors; T-011..T-046 status flipped Pending → Done where files exist; Track B1 ADR-010-obsolete YAML mentions dropped (003 remediation Batch A) | complete |
| `ai-council/council-report.md` | Council R1 + R2 outputs preserved; R1 7 fixes + R2 4 fixes documented | complete |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **Decide:** which of these tracks to pursue first
  - Track A: Run `/doctor:update` E2E against fresh v3-3 workspace to verify all 13 shipped fixes (G4-G9 runtime smoke gates). Sibling 002 packet has v3-3 + v3-4 fixtures wired.
  - Track B: Fix G3 template-manifest validator drift across 001 + 002 + 003 packets (same cross-packet issue; use 010/003 as canonical reference)
  - Track C: Run `/doctor:memory`, `/doctor:causal-graph`, `/doctor:deep-loop`, `/doctor:cocoindex` individually as G4 sub-gates before the unified `/doctor:update` G5 gate
  - Track D: Build + smoke-test Docker image from 002's `_sandbox/23--doctor-commands/` to exercise the full sandbox boundary

- **Read first:**
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands/spec.md` (council 10-line orchestrator contract — REQ-004..REQ-017 + ADR-001..ADR-010)
  - `.opencode/specs/.../001-doctor-commands/decision-record.md` (10 ADRs including ADR-010 mode reduction)
  - `.opencode/specs/.../001-doctor-commands/implementation-summary.md` (13 fixes inventory + dispatch results)
  - `.opencode/specs/.../002-sandbox-testing-playbook/handover.md` (sibling's state — sandbox harness + fixtures ready)
  - `.opencode/specs/.../002-rm8-013-remediation-doc-honesty-security/implementation-summary.md` (what changed in 001 during RM-8 remediation)

### 3.2 Priority Tasks Remaining

1. **HIGHEST: Run `/doctor:update` E2E against v3-3 fixture.** Use sibling 002's harness with the v3-3 fixture that was wired in 002's session:
   ```bash
   cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
   SPECKIT_SANDBOX=1 SPECKIT_WORKSPACE_ROOT=/tmp/doctor_update_e2e_$$ \
     bash .opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/harness/run-all.sh --scenario DOC-345
   ```
   DOC-345 specifically tests `/doctor:update` against the v3-3 → v3-4.1 migration. Evidence collected at `_sandbox/23--doctor-commands/evidence/DOC-345/`. Closes G4-G6 runtime smoke gates.

2. **Run individual subsystem doctors as G4 sub-gates** — `/doctor:memory`, `/doctor:causal-graph`, `/doctor:deep-loop`, `/doctor:cocoindex` against v3-3 fixture independently to isolate any per-subsystem drift before the orchestrator gate.

3. **Fix G3 template-manifest drift** — TEMPLATE_HEADERS + ANCHORS_VALID errors persist on strict-validate. Cross-packet pattern (002, 003 affected too). Use 010/003 canonical reference; cli-codex gpt-5.5 high fast with iterative validation.

4. **Build + smoke-test Docker image** — `docker compose build` from `_sandbox/23--doctor-commands/` then run DOC-345 inside the container to verify cap_drop + narrowed mount + flock work under containerized execution.

5. **G8 migration gap detection smoke** — synthetic unknown source version, verify migration-manifest refuses with clear error (per ADR-008 detect-and-recommend).

6. **G9 concurrent dispatch refusal smoke** — two `/doctor:update` invocations in quick succession; second must refuse with holding-PID per flock contract.

### 3.3 Critical Context to Load

- [ ] Memory: most-recent `/memory:save` was on 2026-05-11 covering both 013 remediation + re-review packets
- [ ] Spec packet: `001-doctor-commands` (Level 2, REQ-001..REQ-023, ADR-001..ADR-010)
- [ ] Sibling packet: `002-sandbox-testing-playbook` (Level 3, REQ-001..REQ-043, sandbox harness + v3-3 + v3-4 fixtures wired)
- [ ] Sibling packet: `002-rm8-013-remediation-doc-honesty-security` (Level 2, RM-8 remediation + cross-runtime mirror + security hardening)
- [ ] Phase parent: `013-doctor-update-orchestrator` (lean trio; all 3 children Complete; verdict PASS hasAdvisories=true per re-review commit 76daa9ef0)
- [ ] Memory rules in CLAUDE.md: "Stay on main, no feature branches" + "DELETE not archive" + "Stop over-confirming" + "Codex parallel dispatch unreliability" + "Codex CLI fast mode must be explicit"
- [ ] `cli-opencode/references/destructive_scope_violations.md`: RM-8 four-layer mitigation MUST be applied for any cli-opencode deep-loop dispatch (prompt hardening + worktree + commit baseline + model awareness)
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] All in-progress work in working tree committed to main (no uncommitted dispatch state lingering)
- [x] Current context saved via `_memory.continuity` frontmatter blocks across packet docs
- [x] Memory save run on 013 phase parent at 2026-05-11 (commit 32c3428fb + earlier 76daa9ef0)
- [x] No breaking changes mid-implementation (all scripts pass `bash -n`, all yamls pass `yaml.safe_load`, all command markdowns pass `validate_document.py`)
- [x] G1 yaml syntax gate — PASS
- [x] G2 markdown structure gate — PASS
- [ ] G3 template-manifest validator gate — FAIL (cross-packet drift; not unique to 001)
- [ ] G4 individual doctor commands runtime smoke — DEFERRED to controlled env
- [ ] G5 `/doctor:update` orchestrator runtime smoke — DEFERRED to controlled env
- [ ] G6 concurrent dispatch refusal smoke — DEFERRED to controlled env
- [ ] G7 snapshot-rollback smoke — DEFERRED to controlled env
- [ ] G8 migration gap detection smoke — DEFERRED to controlled env
- [ ] G9 strict spec-folder validate — FAIL (gated by G3 template-manifest drift)
- [x] 013 phase parent strict validate — PASSED (after 003 remediation closed all P1 findings)
- [x] Branch is `main`
- [x] This handover document complete (closes P2-007-003 from re-review)
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

### What worked well
- **cli-codex gpt-5.5 high fast** dispatched well for command authoring (5 commands × 2 files = 10 files in ~25 min total across 5 sequential tracks). Iterative dispatch + verification loop produces clean results.
- **Council 10-line spec** captured verbatim in REQ-004..REQ-017 — auditable against the original multi-AI council output.
- **Per-subsystem doctor commands as building blocks** for the `/doctor:update` orchestrator — clean composition; each subsystem doctor can also run standalone.
- **Migration manifest with `last_indexed_at` + `mtime`** — supports both incremental + full rebuild paths cleanly.
- **003 remediation** closed all 30 P1 findings without regressions (verified by re-review commit 76daa9ef0).

### What didn't work / surprises
- **opencode session budget cap (96K)** truncated Phase 5+7+10 of E2E verification; need to dispatch via cli-codex or reset budget before resuming.
- **G3 template-manifest validator drift** is cross-packet (affects 002 + 003 too); not unique to 001.
- **Pre-remediation doc-honesty drift** was extensive — title/body/metadata/checklist all disagreed on completion percentage. The 003 RM-8 remediation packet closed this cleanly.
- **mkdir-based lock** in original bootstrap had a TOCTOU race; flagged in deep-review (cluster G); replaced with `flock(2)` in 003 remediation Batch B.

### What's untested
- **`/doctor:update` E2E against real workspace** — never executed beyond Phase A.1 tx-model verify. Sibling 002 wired v3-3 + v3-4 fixtures specifically to enable this.
- **Concurrent `/doctor:update` invocations** — flock contract designed but never stress-tested. ADR-005 requires holding-PID refusal.
- **`/doctor:update` snapshot + rollback** — ADR-002 contract designed but never exercised in real workspace.
- **Docker container boundary** — Dockerfile syntactically valid but `docker compose build` never run from 001 packet's perspective.

### What's next
- Run E2E real OR fix G3 template-manifest OR build Docker image. All three are independent and can run in parallel by different agents.

### Memory rules used / honored this session (incl. 003 remediation)
- "DELETE not archive": physically `rm -f` on 21+4 obsolete YAMLs (no .bak/.archive/_old) during ADR-010 mode reduction
- "Stay on main, no feature branches": branch stayed on `main` throughout
- "Stop over-confirming with A/B/C/D menus": minimized clarification rounds during cli-codex dispatch
- "Codex CLI fast mode must be explicit": passed `-c service_tier="fast"` on all dispatches per memory rule
- "Codex parallel dispatch unreliability": 2-wide batching with disjoint paths; serial fallback if hangs
- "Codex --sandbox workspace-write blocks sub-process network": passed `-c sandbox_workspace_write.network_access=true` for any dispatch needing Voyage embeddings or external fetches
- "Rename verification requires case-insensitive grep": used `grep -ri _confirm` during yaml rename pass
- "generate-context.js regenerates parent graph-metadata": verified parent 013 graph-metadata preserved after each save
- "RM-8 four-layer mitigation": cli-opencode + deepseek-v4-pro deep-review dispatches used hardened prompt + worktree isolation + commit baseline (commits 8d794afad + 76daa9ef0)
<!-- /ANCHOR:session-notes -->

---

## 6. Quick Resume Commands

```bash
# 1. Verify current state
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
ls .opencode/commands/doctor/                                                          # 10 .md commands expected
ls .opencode/commands/doctor/assets/                                                   # 10 yamls expected
ls .opencode/commands/doctor/scripts/                                                  # doctor-runtime-bootstrap.sh + audit_descriptions.py + mcp-doctor*.sh
ls .opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json        # migration manifest expected

# 2. Verify cross-runtime mirror (post-003 remediation)
echo "opencode .md: $(find .opencode/commands/doctor -maxdepth 1 -name '*.md' | wc -l)"     # 10
echo "claude .md:   $(find .claude/commands/doctor -maxdepth 1 -name '*.md' | wc -l)"       # 10
echo "codex (symlink): $(find .codex/prompts/doctor -maxdepth 1 -name '*.md' | wc -l)"      # 10 via .codex/prompts -> .opencode/commands
echo "gemini .toml: $(find .gemini/commands/doctor -maxdepth 1 -name '*.toml' | wc -l)"     # 10

# 3. Bootstrap syntax check (post-003 hardening)
bash -n .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh                  # exit 0 expected
grep -n 'flock\|--no-audit' .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh  # flock present, no-audit absent

# 4. Validate 001 spec packet (G3 expected to fail until template-manifest fix)
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands --strict

# 5. Validate 013 phase parent (PASS expected per re-review)
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator --strict

# 6. G4 sub-gate: run individual doctor commands against v3-3 fixture (sibling 002 wired)
SPECKIT_SANDBOX=1 SPECKIT_WORKSPACE_ROOT=/tmp/doctor_smoke_$$ \
  bash .opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/harness/run-all.sh --scenario DOC-323

# 7. G5 orchestrator gate: /doctor:update v3-3 → v3-4.1 migration end-to-end
SPECKIT_SANDBOX=1 SPECKIT_WORKSPACE_ROOT=/tmp/doctor_update_e2e_$$ \
  bash .opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/harness/run-all.sh --scenario DOC-345
```
