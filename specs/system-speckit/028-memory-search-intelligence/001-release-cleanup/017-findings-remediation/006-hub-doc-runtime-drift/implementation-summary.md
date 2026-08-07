---
title: "Implementation Summary: Hub Documentation and Runtime Drift Reconciliation"
description: "All twelve approved findings applied plus three routed in from earlier phases. Documentation was corrected to match runtime in every case; no runtime was changed to satisfy a document."
trigger_phrases:
  - "hub doc runtime drift summary"
  - "017 phase 006 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/006-hub-doc-runtime-drift"
    last_updated_at: "2026-07-27T15:01:17Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Reconciled twelve documentation drifts against runtime via eight file-scoped LUNA workers"
    next_safe_action: "Begin phase 007 deep-loop and CLI contract drift"
    blockers: []
    key_files:
      - "approved-findings.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-017-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Workers must be partitioned by file ownership, not one-per-finding, when findings share a file."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-hub-doc-runtime-drift |
| **Completed** | 2026-07-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every canonical index now matches what is on disk, and every hub's prose agrees with its own registry.

| Finding | Result |
|---------|--------|
| `devin-03:F2` | The live `interface/` command group was entirely absent from the canonical index. Added |
| `devin-03:F3` | The index wrote `agent_router`; the file is `agent-router.md`. Corrected |
| `devin-03:F4` | `create/diff.md` added to the index |
| `devin-03:F5` | `deep/alignment.md` and `deep/command-benchmark.md` added |
| `devin-03:F6` | `deep-alignment.md` added to the agent inventory |
| `devin-03:F7` | The compiled-contract README called an authoritative contract a placeholder. Corrected |
| `devin-03:F8` | The script checker's family list said `design`; the real families are create, deep, doctor, interface, memory, prompt, scripts, speckit |
| `devin-02:F1` | A hub SKILL.md said both "five workflow modes" and "four". The registry has five |
| `devin-02:F6` | Both hub Layout blocks omitted live contract files. Added |
| `devin-01:F5` | sk-code's changelog claimed four workflow modes and three surfaces; the registry has two of each |
| `devin-01:F14` | sk-git described itself as a routing parent hub while having no registry or router |
| `devin-01:F22` | prompt-models forbade all scripts while shipping 43 evaluation harnesses |
| `devin-01:F15` | Routed in — sk-git's benchmark archive had no README. Created |
| `devin-01:F18` | Routed in — a changelog was imprecise about where four READMEs live. Reworded |

Verification is exhaustive rather than sampled: every `.md` under `commands/` and every agent file now resolves in its index, and the mode-count prose matches the registry.

### The line that was not crossed

sk-git claimed to route to three modes. It has no `mode-registry.json` and no `hub-router.json`. Under runtime-wins the fix is to correct the prose, and the worker was explicitly forbidden from creating those files. Both remain absent. The failure mode here is subtle and expensive: "reconcile the drift" quietly becomes "build the thing the documentation imagined", which converts a five-minute wording fix into a new subsystem nobody asked for.

The same restraint applied to prompt-models. Its contract forbade shell commands and scripts while the packet shipped 43 executable files. The resolution scoped the prohibition to the dispatch surface and named `benchmarks/` as evaluation harnesses outside it. No file was deleted and the contract was not gutted — the wording was simply overbroad.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Eight GPT-5.6-LUNA workers at xhigh effort, partitioned by **file ownership** rather than one per finding. Four findings all targeted `commands/README.txt`; four concurrent writers on one file would have silently lost three edits while every worker reported success. Ownership partitioning made that impossible.

Three dispatch waves were killed externally mid-flight. Two left a completely clean tree. The third had already finished its edits and died before writing its status block, which was detectable only because the changes were verified directly rather than read from the worker's own report.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Partition workers by file, not by finding | Four findings shared one file; per-finding dispatch would have lost work silently |
| Forbid creating sk-git registry files | Correcting drift must not mean implementing whatever the docs imagined |
| Scope the prompt-models prohibition rather than delete files | The contract was overbroad; 43 harnesses were not the defect |
| Reword rather than delete the imprecise changelog entry | It records real work and is wrong only about location |
| Drop concurrency to two, then to serial | Each worker carries roughly 1.2 GB; three kills made concurrency the variable worth removing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Every command `.md` present in the canonical index | PASS, 0 missing |
| Every agent present in the agent inventory | PASS, 0 missing |
| Hub mode-count prose matches registry | PASS, only "five" remains |
| sk-git registry files still absent | PASS, nothing invented |
| prompt-models harnesses preserved | PASS, 43 files intact |
| Containment | PASS, concurrent-session paths untouched |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two routed-in runner gaps are still unresolved.** `create/assets/tests/` and `doctor/scripts/tests/` both exist with no runner. Wiring versus removing remains a decision, deferred out of this phase.
2. **Documentation now asserts what runtime does today.** Where runtime is itself wrong, this phase has made the docs faithfully describe a defect. Phase 007 owns those cases.
<!-- /ANCHOR:limitations -->
