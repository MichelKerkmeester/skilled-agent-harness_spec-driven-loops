---
title: "Implementation Summary: plugin TUI-overlay fix"
description: "Rechanneled mk-dist-freshness-guard off console.* onto system-context injection plus an append-only log, retargeted regression tests, updated consumer docs, and landed the durable no-TUI-overlay rule in sk-code."
trigger_phrases:
  - "mk-dist-freshness-guard TUI overlay fix"
  - "opencode plugin no stdout stderr rule"
importance_tier: "high"
contextType: "implementation"
completion_pct: 100
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/010-plugin-tui-fix"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Backfilled strict Level 2 docs for the shipped plugin TUI-overlay fix"
    next_safe_action: "Use the completed phase docs as validation evidence for parent close-out"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-dist-freshness-guard.js"
      - ".opencode/plugins/tests/mk-dist-freshness-guard.test.cjs"
      - ".opencode/plugins/README.md"
      - ".opencode/bin/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doc-backfill-010-plugin-tui-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Shipped commit evidence: remote 711b019eb1, local 42677fac58."
      - "Verification evidence: plugin test suite green; live smoke confirmed zero TUI writes when validate.sh ran through bash."
---
# Implementation Summary: plugin TUI-overlay fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-plugin-tui-fix |
| **Completed** | 2026-07-05 |
| **Level** | 2 |
| **Actual Effort** | Focused plugin fix plus QA validation |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The shipped fix stops `mk-dist-freshness-guard` from painting stale-dist warnings over the OpenCode chat input. The guard still tells the agent what to rebuild and still leaves an operator record, but it no longer writes that warning through the TUI process stdout/stderr channel.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/mk-dist-freshness-guard.js` | Modified | Rechannel stale-dist warnings to system-context injection and append-only logging while preserving fail-open behavior |
| `.opencode/plugins/tests/mk-dist-freshness-guard.test.cjs` | Modified | Assert transform output, log deltas, dedupe, malformed-argument fail-open behavior, and zero console writes |
| `.opencode/plugins/README.md` | Modified | Document the plugin warning channel and no stdout/stderr behavior |
| `.opencode/bin/README.md` | Modified | Update consumer wording for the freshness guard channel |
| `.opencode/skills/sk-code/.../quality_standards.md` | Modified | Add durable OpenCode plugin rule: never write user/agent-visible output to TUI stdout/stderr |
| `.opencode/skills/sk-code/.../javascript_checklist.md` | Modified | Add matching P0 checklist coverage for OpenCode plugin output channels |
| `.opencode/specs/skilled-agent-orchestration/124-sk-code-parent/010-plugin-tui-fix/` | Updated | Backfill strict Level-2 phase docs |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation reused the proven `experimental.chat.system.transform` pattern from existing OpenCode plugins, added append-only log evidence for operators, and kept the plugin's single default export and never-throw behavior. The regression test suite was retargeted from console capture to the new channels, then the fix shipped with commit evidence at remote `711b019eb1` and local `42677fac58`.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Use system-context injection for agent-visible warnings | It preserves the actionable stale-dist signal without touching the TUI process stderr stream |
| Use an append-only log for operator evidence | Operators retain a durable record while the interactive chat input stays clean |
| Keep warn-only fail-open behavior | A freshness warning must not block tool execution or break OpenCode sessions |
| Add the sk-code durable rule | Future OpenCode plugin work needs a persistent rule that prevents reintroducing TUI overlays |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Plugin regression suite | Pass | Seven behavioral cases | `node .opencode/plugins/tests/mk-dist-freshness-guard.test.cjs` green |
| Console trap | Pass | stdout/stderr write prevention | Tests assert zero `console.warn`, `console.error`, and `console.log` calls |
| Live smoke | Pass | OpenCode TUI output channel | Running `validate.sh` through `bash` produced zero TUI writes |
| Shipped commit evidence | Pass | Remote/local commit tracking | Remote `711b019eb1`; local `42677fac58` |

### Test Coverage Summary

| File | Statements | Branches | Functions |
|------|------------|----------|-----------|
| `.opencode/plugins/mk-dist-freshness-guard.js` | Covered by plugin suite | Stale, fresh, dedupe, malformed args | Guard hook and transform/log paths covered by plugin suite |
| `.opencode/plugins/tests/mk-dist-freshness-guard.test.cjs` | N/A | Seven behavioral cases | N/A |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | Avoid repeated noisy work/warnings | Existing session dedupe preserved | Pass |
| NFR-S01 | No secrets in warning/log content | Warning contains stale-dist rebuild guidance only | Pass |
| NFR-S02 | Terminal diagnostics only behind DEBUG-gated paths | Durable sk-code rule records DEBUG-gated stderr exception only | Pass |
| NFR-R01 | Never throw on malformed input or logging failures | Malformed args never throw case preserved in tests | Pass |
| NFR-R02 | Preserve single default export | Existing plugin loader contract preserved | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. This phase did not change freshness detection or the watched package set.
2. This phase did not add a kill-switch; the warning remains warn-only and fail-open through safe channels.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Preserve stale-dist safety signal | Preserved via system-context injection and append-only log | Avoids the TUI stdout/stderr channel while keeping the warning actionable |
| Keep plugin behavior fail-open | Preserved | Freshness warnings should never block OpenCode tool execution |
| Complete Level-2 docs during original implementation | Backfilled after code was already shipped and pushed | Caller requested strict Level-2 documentation backfill for this already-shipped phase |

<!-- /ANCHOR:deviations -->
