---
title: "Implementation Plan: Phase 025 - PB-002 Advisor and Audit-Bundle Fix"
description: "Plan for fixing PB-002's two defects across two independent advisor-scoring backends, plus 4 fresh-audit fix-now findings."
trigger_phrases:
  - "phase 025 plan"
  - "PB-002 fix workflow plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/025-pb002-advisor-and-audit-bundle-fix"
    last_updated_at: "2026-07-07T21:15:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pb002-advisor-fix-025"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 025 - PB-002 Advisor and Audit-Bundle Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python advisor scorer (`skill_advisor.py`), JSON skill-graph metadata consumed by a native TS daemon with a live chokidar file watcher, Markdown SKILL.md routing prose |
| **Framework** | Live `cli-opencode` dispatch + the in-session `mk_skill_advisor_advisor_recommend` tool call, both consulting the native daemon's scorer directly |
| **Storage** | `.opencode/skills/sk-design/`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` |
| **Testing** | Live daemon-path advisor calls (not the standalone CLI's local-fallback path) plus live `cli-opencode` re-dispatch, graded against PB-002's own Pass/Fail Criteria |

### Overview

Empirically tested PB-002's exact prompt against the live daemon and confirmed both original defects still reproduce: the advisor probe ranks `sk-code` top-1 (0.8247) over `sk-design` (0.82), and — independently — the mode-resolution defect. First fix attempt added `skill_advisor.py` `PHRASE_INTENT_BOOSTERS` entries and a `sk-design/SKILL.md` guardrail exception; live re-dispatch confirmed the mode-resolution half fully fixed (pure `foundations`, correct procedure card, confirmed/inferred separation, proof-required section, no mutating tool) but the advisor half was UNCHANGED — because the live dispatch's `advisor_recommend` tool call consults the native TS daemon, a completely separate code path from the Python script's local fallback the first fix targeted. Investigated the daemon's actual data source (its chokidar watcher + skill-graph indexer), confirmed by direct source grep that it reads `graph-metadata.json`'s `intent_signals`/`derived.trigger_phrases` (picked up live, no restart) but never reads `description.json` at all. Added the same design-scoped phrases to `graph-metadata.json`; re-verified via the live daemon — `sk-design` moved to top-1 at confidence 0.9095. Regression-swept `AI-002` (clean, `sk-code` unaffected) and `AI-004` (clean, unaffected) via the SAME live daemon path. The sweep also tested `MR-004` for completeness and found it FAILING on the live daemon path (`sk-code` 0.8719 top-1), directly conflicting with a separate, same-day fresh-audit verification of the identical prompt that found `sk-design` winning 0.95-0.86 — that earlier test ran while the daemon was down and hit the local-fallback path instead. Documented this as an unresolved logic-sync conflict rather than silently reconciling it, and left `MR-004` untouched (out of this phase's scope).

Separately applied 4 independent fix-now findings from the same fresh audit (family-mislabel front-matter on 3 mode packets, a nonexistent-sibling-command doc bug in `command-metadata.json`, and `FR-001`'s index-vs-feature-file prompt mismatch), and documented the operator's accepted-risk decision on the Open Design RUN side effect directly in `design-mcp-open-design/SKILL.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Read PB-002's full scenario file and its own Pass/Fail Criteria before designing any fix
- [x] Empirically re-tested PB-002's exact prompt against the CURRENT live scoring path before assuming either original-evidence claim still held

### Definition of Done
- [x] PB-002 advisor half: `sk-design` top-1 ≥ 0.80 confirmed via the live daemon (0.9095)
- [x] PB-002 mode-resolution half: pure `foundations`, correct procedure card, confirmed/inferred separation, proof-required section, no mutating tool — confirmed via live dispatch
- [x] Regression sweep: `AI-002` clean (`sk-code` 0.913), `AI-004` clean/unchanged (`sk-code` 0.8993)
- [x] `MR-004` daemon-path conflict discovered during the sweep documented as an open logic-sync item, not silently fixed or silently ignored
- [x] `description.json`'s inertness for daemon-scorer routing confirmed via direct source grep, not assumed
- [x] 4 fix-now findings applied and spot-checked
- [x] Operator decision on Open Design RUN risk documented in the source skill
- [x] `verdict-matrix.md` updated with PB-002's fix and the fresh audit's findings
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Empirically test against the live path first (never assume prior evidence still holds) -> fix -> re-test against the SAME live path -> if unchanged, investigate which backend actually answered the call before attempting a second fix -> regression-sweep adjacent scenarios via the same backend -> document any new conflicting evidence rather than silently resolving it.

### Key Components

- **Two independent advisor-scoring backends, only one of which the first fix reached**: `skill_advisor.py`'s Python `PHRASE_INTENT_BOOSTERS` dict (the standalone CLI's local-fallback path, used only when the native daemon is unreachable) versus the native TS daemon's skill-graph-db indexer (reads `graph-metadata.json` live via a chokidar watcher; what the live in-session `advisor_recommend` tool call and real dispatches actually consult when the daemon is up). The first fix attempt only reached the former; empirical re-testing against the live dispatch (not just the standalone script) is what caught this.
- **`description.json` confirmed inert for this routing path**: direct grep of the daemon's TypeScript source (`grep -rl "description.json" mcp_server --include="*.ts"`) returned zero hits, and `graph-metadata.json`'s own `derived.key_files` watch list for sk-design only names `SKILL.md`/`mode-registry.json`. The `description.json` edit made in the same fix pass is harmless but was confirmed NOT the mechanism that fixed anything — durable knowledge for future advisor-routing fixes in this skill.
- **The daemon-availability logic-sync discovery**: the fresh audit's REFUTED verdict for `MR-004` and this phase's regression-sweep FAIL for the same prompt are not a contradiction in the usual sense — they're two correct readings of two different, non-interchangeable scoring backends that happened to be live at different testing moments. Documented explicitly per the Logic-Sync Protocol rather than treating one as simply wrong.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Standalone CLI local-fallback scorer | `PHRASE_INTENT_BOOSTERS` design-scoped review phrases | Confirmed reaches only the local-fallback path (intermediate step, not the fix that closed PB-002) |
| `sk-design/graph-metadata.json` | Native daemon's skill-graph indexer source | `intent_signals`/`derived.trigger_phrases` design-scoped review/proof-gate phrases | Live daemon re-test: `sk-design` 0.82→0.9095, moved to top-1 |
| `sk-design/description.json` | Catalog/listing metadata (NOT the daemon-scorer's data source) | `keywords` sync for consistency only | Confirmed inert for routing via direct source grep — documented, not relied on |
| `sk-design/SKILL.md` | Parent hub routing prose | New "single-axis static review" exception on the `audit` guardrail bullet | Live dispatch: pure `foundations`, zero "audit" mentions in response |
| `design-foundations/SKILL.md`, `design-motion/SKILL.md`, `design-audit/SKILL.md` | Mode packet front-matter | `family: sk-code` → `family: sk-design` | Direct read confirms all 3 now match `design-mcp-open-design`'s correct labeling |
| `sk-design/command-metadata.json` | Command-surface projection | 5 `preferSiblingWhen` entries reworded | `python3 -m json.tool` validity + grep confirms 5/5 replaced |
| `manual_testing_playbook/manual_testing_playbook.md` | Playbook root index | `FR-001` prompt synced to feature-file text | Direct read diff confirms match |
| `design-mcp-open-design/SKILL.md` | Transport packet rules | ALWAYS #4 extended with accepted-risk rationale | Direct read confirms new sentence present |

Required inventories:
- Same-class producers: no other in-flight work touches these specific sk-design/system-skill-advisor files concurrently (confirmed via scoped `git status` before commit).
- Consumers of changed symbols: the native daemon (via its file watcher) and the standalone CLI script are the only two consumers of the advisor-routing changes; both independently re-tested.
- Matrix axes: fix x {which scoring backend it reaches, live-verification method, regression scope} — tracked per-fix in `implementation-summary.md`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Fresh Audit Triage (prior turn, not re-documented here)
- [x] Consolidated audit findings reviewed with the operator; 3 dispositions selected: apply 3 fix-now items now, scope PB-002 as a new phase, accept the Open Design RUN risk as-is

### Phase 2: Fix-Now Findings
- [x] `design-foundations/SKILL.md`, `design-motion/SKILL.md`, `design-audit/SKILL.md`: `family: sk-code` → `family: sk-design`
- [x] `command-metadata.json`: 5 `preferSiblingWhen` sibling strings reworded (JSON validity confirmed)
- [x] `manual_testing_playbook.md`: `FR-001` index prompt synced to the feature-file's authoritative text
- [x] `design-mcp-open-design/SKILL.md`: ALWAYS #4 extended with the operator's accepted-risk decision
- [x] `verdict-matrix.md`: HM-004 side-effect note updated with the operator decision

### Phase 3: PB-002 Fix, Attempt 1
- [x] Empirically re-tested PB-002's exact prompt against the current live daemon path — confirmed both defects still reproduce
- [x] `skill_advisor.py`: added `"spacing rhythm"`/`"hierarchy and spacing"` `PHRASE_INTENT_BOOSTERS` entries
- [x] `sk-design/SKILL.md`: added "single-axis static review" exception to the `audit` guardrail bullet; version 1.4.1.0→1.4.2.0
- [x] Live re-dispatch: mode-resolution half fully fixed; advisor half UNCHANGED (still `sk-code` top-1 via the live daemon)

### Phase 4: PB-002 Fix, Attempt 2 (root-caused the correct backend)
- [x] Investigated why attempt 1's advisor fix didn't reach the live path — found the native daemon's chokidar watcher + skill-graph indexer, confirmed by source grep it reads `graph-metadata.json`, never `description.json`
- [x] `sk-design/graph-metadata.json`: added design-scoped `intent_signals`/`derived.trigger_phrases`
- [x] `sk-design/description.json`: synced `keywords` for consistency (confirmed inert for this routing path, kept anyway)
- [x] Version bumps: `sk-design/description.json` 1.4.1.0→1.4.2.0

### Phase 5: Verification and Regression Sweep
- [x] Live daemon re-test: `sk-design` top-1 at 0.9095 (was 0.82, #2)
- [x] Regression: `AI-002` still `sk-code` top-1 (0.913), clean
- [x] Regression: `AI-004` still `sk-code` top-1 (0.8993), unchanged
- [x] Regression sweep also ran `MR-004` — discovered a live-daemon-path FAIL conflicting with the fresh audit's REFUTED verdict for the same prompt; documented as an unresolved logic-sync item, not fixed (out of phase 025 scope)
- [x] `opencode.json` and `git status --porcelain` confirmed clean after every dispatch round

### Phase 6: Documentation and Close-Out
- [x] `verdict-matrix.md` updated: PB-002 fix section, fresh-audit findings section, MR-004 logic-sync flag, AI-004 pre-existing-bug note
- [x] This phase's own `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` authored
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live daemon advisor call | PB-002's advisor half, regression sweep | In-session `mk_skill_advisor_advisor_recommend` tool call, direct daemon-backed CLI where reachable |
| Live re-dispatch | PB-002's full scenario (mode-resolution half) | `opencode run --model openai/gpt-5.5-fast --variant medium`, raw JSONL `tool_use` grep |
| Source-code verification | Which backend a given metadata file feeds | Direct grep of the daemon's TS source, not assumption |
| Side-effect check | Every dispatch round | `~/.config/opencode/opencode.json` key inspection, `git status --porcelain` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Fresh Opus-max audit workflow run | Prerequisite | Complete, findings reviewed with operator | Supplied this phase's entire scope (PB-002 root cause + the 4 fix-now items) |
| Skill-advisor native daemon availability | External, intermittent | Was live for this phase's testing (confirmed via uptime check) | If down, this phase's live-daemon-path verification would need to wait or fall back, same as the fresh audit's MR-004/HM-004 tests did |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A future re-run shows PB-002 or its regression guards (`AI-002`/`AI-004`) have regressed, or the new `graph-metadata.json` phrases cause an unrelated false-positive routing.
- **Procedure**: `git log`/`git blame` the specific `intent_signals`/`trigger_phrases` entries or the `SKILL.md` guardrail exception added in this phase; revert the specific entry; re-dispatch the affected scenario to confirm.
<!-- /ANCHOR:rollback -->
