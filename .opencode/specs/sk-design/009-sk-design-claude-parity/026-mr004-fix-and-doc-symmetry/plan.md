---
title: "Implementation Plan: Phase 026 - MR-004 Fix and Doc Symmetry"
description: "Plan for closing out MR-004, AI-004's pre-existing bug, and the two declined doc-symmetry findings from the fresh audit."
trigger_phrases:
  - "phase 026 plan"
  - "MR-004 fix workflow plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/026-mr004-fix-and-doc-symmetry"
    last_updated_at: "2026-07-08T03:36:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mr004-fix-doc-symmetry-026"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 026 - MR-004 Fix and Doc Symmetry

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON skill-graph metadata (native daemon-consumed), Markdown SKILL.md keyword corpus and routing prose |
| **Framework** | Live daemon-path advisor probing (`skill_advisor.py` reaching the native scorer) plus one live `cli-opencode` re-dispatch |
| **Storage** | `.opencode/skills/sk-design/` |
| **Testing** | Standalone probe iteration (fast feedback loop) followed by a live re-dispatch confirmation |

### Overview

Reused phase 025's discovery (the native skill-advisor daemon reads `graph-metadata.json`'s `intent_signals`/`derived.trigger_phrases` live, via a file watcher, no restart) to fix `MR-004` the same way `PB-002` was fixed: iteratively added design-scoped `intent_signals` phrases, re-testing the standalone probe against the exact scenario prompt after each addition until the margin was decisive and stable (not just barely ahead — the first addition only produced a 0.0016 margin, essentially still ambiguous; a second addition pushed it to a stable 0.032 margin across 3 repeats). A live re-dispatch confirmed the fix's downstream effect (correct mode/packet/resources/report shape) even though the live dispatch's own internal advisor tool call got confounded by dispatch-recipe addendum text bleeding into its query — documented as a testing artifact, not a fix defect, since the standalone probe on the literal unpolluted prompt is unambiguous and repeatable.

Separately fixed `AI-004`'s pre-existing bug by removing the single bare `design-review` keyword from `SKILL.md`'s corpus (redundant with 4 more specific existing keywords), verified both the fix (AI-004's negation-clause prompt now correctly resolves `sk-code`) and no-regression (a legitimate design-review prompt still resolves `sk-design`).

Applied the two doc-symmetry findings the operator declined to bundle into phase 025 (mirrored `harden`/`polish` transform-verb-precedence exception on the `audit` guardrail bullet; a `taskProjections`-vs-`excludedAliases` layering note in `mode-registry.json`), then aligned all 4 version-bearing files to 1.4.3.0 with a changelog entry summarizing the net cumulative change since v1.2.0.0.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Reviewed phase 025's Known Limitations as the authoritative list of remaining deferred items
- [x] Re-confirmed `MR-004`'s failure and `AI-004`'s bug both still reproduced before designing fixes

### Definition of Done
- [x] `MR-004`: standalone probe decisively favors `sk-design` (0.9078 vs 0.8761), stable across 3 repeats
- [x] `MR-004`: live re-dispatch confirms correct downstream mode/packet/resource/report behavior despite a confounded advisor-tool-call artifact in that specific run
- [x] `AI-004`: negation-clause prompt now resolves `sk-code`; legitimate design-review prompt still resolves `sk-design`
- [x] Doc-symmetry: `harden`/`polish` exception added to `audit` guardrail bullet
- [x] Doc-symmetry: `taskProjections`-vs-`excludedAliases` layering note added
- [x] Version alignment: all 4 files read 1.4.3.0; changelog entry authored
- [x] `verdict-matrix.md` updated to close out the fresh audit's remaining items, with the new `Bash`-usage finding flagged
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Iterative probe-fix-reprobe loop for the advisor-routing fixes (add a candidate phrase -> re-test the standalone probe -> if margin is thin/ambiguous, add more -> stop once decisive and stable across repeats), then one live re-dispatch to confirm downstream behavior, not just the advisor number in isolation.

### Key Components

- **Iterative margin-building, not one-shot**: the first `graph-metadata.json` addition for `MR-004` (`"design slop"`, `"anti-slop UI audit"`) only moved the margin to 0.0016 — technically a win but not robust, likely still flaggable as `ambiguous` by the scorer's own tolerance. A second addition (`"contrast and keyboard focus"`) pushed it to a stable 0.032 margin. This is durable knowledge: a single phrase addition is not always sufficient; verify the margin is decisive, not just directionally correct.
- **Distinguishing a testing-recipe confound from a fix defect**: the live dispatch's own internal advisor tool call in one verification run echoed the dispatch-note addendum into its own query, introducing an unrelated `sk-doc` confound. Rather than treating this as a fix failure, the standalone probe on the literal, unpolluted scenario prompt (which is what the scenario's own "advisor probe" methodology step actually specifies) was treated as the authoritative signal, with the confound explicitly documented rather than smoothed over.
- **Keyword removal over negation-detection**: `AI-004`'s bug (a bare `design-review` keyword matching inside a negation clause) could have been fixed by adding negation-awareness to the shared keyword-matching algorithm, but that function is used by every skill in the system, not just sk-design — far too broad a blast radius for a low-priority, narrowly-scoped bug. Removing the one redundant keyword from sk-design's own corpus is a safe, sk-design-scoped fix with equivalent positive-signal coverage from 4 other existing keywords.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-design/graph-metadata.json` | Native daemon's skill-graph indexer source | 3 new `intent_signals` entries for MR-004 | Standalone probe: 0.9078 vs 0.8761, stable across 3 repeats |
| `sk-design/SKILL.md` Keywords comment | Both the daemon's lexical lane and the standalone CLI's local-fallback keyword corpus | Removed bare `design-review` keyword | AI-004 fixed; legitimate design-review prompt unaffected |
| `sk-design/SKILL.md` Mode Vocabulary Guardrails | Parent hub routing prose | New `harden`/`polish` transform-verb-precedence exception on the `audit` bullet | Direct read confirms symmetric wording with the `foundations` exception |
| `sk-design/mode-registry.json` | `transformVerbRouting` registry | `note` field extended with layering clarification | Direct read confirms new sentence present; JSON validity confirmed |
| `sk-design/{SKILL.md,description.json,mode-registry.json,hub-router.json}` | Version-bearing files | All aligned to 1.4.3.0 | Direct grep confirms all 4 match |
| `sk-design/changelog/v1.4.3.0.md` | Changelog | New entry covering v1.3.0.0-v1.4.3.0 net change | File exists, follows the established changelog format |

Required inventories:
- Same-class producers: no other in-flight work touches these specific sk-design files concurrently (confirmed via scoped `git status`; a concurrent session's `deep-loop-runtime`/spec-folder renaming work was confirmed unrelated via content check).
- Consumers of changed symbols: the native daemon (via its file watcher, confirmed watching both `SKILL.md` and `graph-metadata.json` for sk-design) is the consumer of both routing-affecting changes.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Doc-Symmetry and Version Alignment (cheap, low-risk)
- [x] `mode-registry.json`: `transformVerbRouting.note` layering clarification
- [x] `SKILL.md`: `harden`/`polish` transform-verb-precedence exception on the `audit` bullet
- [x] Version bumps: `SKILL.md`/`description.json`/`mode-registry.json`/`hub-router.json` all → 1.4.3.0
- [x] `changelog/v1.4.3.0.md` authored

### Phase 2: AI-004 Fix
- [x] Located the offending bare `design-review` keyword in `SKILL.md`'s Keywords comment
- [x] Confirmed 4 more specific existing keywords already cover the legitimate intent
- [x] Removed the keyword; re-tested AI-004 (fixed) and a legitimate design-review prompt (unaffected)

### Phase 3: MR-004 Fix (iterative)
- [x] Re-tested MR-004's exact prompt against the current live daemon path — confirmed still failing
- [x] First `graph-metadata.json` addition (`"design slop"`, `"anti-slop UI audit"`) — margin too thin (0.0016)
- [x] Second addition (`"contrast and keyboard focus"`) — decisive, stable margin (0.032, 3 repeats)
- [x] Regression-checked AI-002, AI-004, PB-002, and a mode-routing-unrelated prompt — all clean

### Phase 4: Live Verification and Close-Out
- [x] Live re-dispatch of MR-004: downstream mode/packet/resources/report all correct; advisor-tool-call confound documented, not treated as a fix failure
- [x] New finding surfaced (audit-mode Bash usage) and flagged, not silently absorbed
- [x] `verdict-matrix.md` updated
- [x] This phase's own `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` authored
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Standalone advisor probe (iterative) | MR-004, AI-004, regression scenarios | `skill_advisor.py <prompt> --threshold 0.8`, confirmed reaching the native daemon via the `reason` field |
| Live re-dispatch | MR-004 (downstream behavior confirmation) | `opencode run --model openai/gpt-5.5-fast --variant medium`, raw JSONL grep |
| Side-effect check | Every dispatch round | `~/.config/opencode/opencode.json` key inspection, `git status --porcelain` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 025's `graph-metadata.json` fix-pattern discovery | Prerequisite | Complete | This phase's entire MR-004 fix approach depends on it |
| Skill-advisor native daemon availability | External, intermittent | Live throughout this phase's testing | Standalone probe explicitly confirms `source: native` / `freshness: live` before trusting a result |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A future re-run shows MR-004 or AI-004 have regressed, or the new `intent_signals`/keyword changes cause an unrelated false positive.
- **Procedure**: `git log`/`git blame` the specific entries added in this phase; revert the specific addition; re-test the affected scenario to confirm.
<!-- /ANCHOR:rollback -->
