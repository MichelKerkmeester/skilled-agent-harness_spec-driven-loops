---
title: "Implementation Summary: Codex Dispatch Scope"
description: "Five statements of the runtime-delegation rule scoped to the two loop types the runtime supports."
trigger_phrases:
  - "codex dispatch scope summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/058-codex-dispatch-scope-loosening"
    last_updated_at: "2026-08-30T11:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Scoped the runtime-delegation rule to deep-loop fan-outs"
    next_safe_action: "Check whether sibling cli-* skills carry the same wording"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-codex/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-cli-codex-058"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Codex Dispatch Scope

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 058-codex-dispatch-scope-loosening |
| **Status** | Complete |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Five statements in `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md`
now scope the delegation requirement to the loop types the runtime supports: the
`deep-loop-runtime-required` hard rule in frontmatter, the Execution Ownership
section, ALWAYS rule 2, NEVER rule 5, and the restatements under Success
Criteria and Integration Points.

Execution Ownership gained the two-path statement: deep-loop fan-outs go to
`../../system-deep-loop/runtime/scripts/fanout-run.cjs`; a dispatch that runtime
cannot express runs `codex exec` directly and still honors explicit model,
effort and service tier, sandbox mode, `</dev/null`, `AI_SESSION_CHILD=1`, the
inlined persona, and spec-folder pre-approval.

NEVER rule 5 changed from "the deep-loop runtime is the execution authority" to
naming what an adapter actually is — a wrapper, command builder, or reusable
spawn path — and stating that a dispatch-site call is not one.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The mismatch was established from the runtime rather than argued. `fanout-run.cjs`
requires `--specFolder`, `--loopType`, `--fanoutConfigJson` and
`--baseArtifactDir`, and asserts the loop type is active; the accepted values are
`deep-research` and `deep-review`. A dispatch that is neither cannot be expressed
through it, so the old wording pointed every such dispatch at a runtime that
would reject it.

The loosening is deliberately narrow. The rule existed to stop a second Codex
adapter, which is a real risk, so the prohibition is kept and sharpened rather
than relaxed. That only works if the two things are distinguishable, which is
why the distinction is now stated outright instead of left implied.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Scope by loop type rather than delete the rule | The runtime owns lineage state and convergence for the two loops; bypassing it there would lose those artifacts |
| Keep the adapter prohibition and state it precisely | It is the risk the rule was written for, and the loosened form depends on the reader telling a call from a wrapper |
| Fix all five statements, not the headline one | A rule restated in five places is only changed when every restatement moves |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| No unscoped statement remains | PASS | Search for "orchestrated execution" and "orchestrated dispatches" returns nothing |
| Loop types still bound to the runtime | PASS | Both named in the hard rule, Execution Ownership, and ALWAYS rule 2 |
| Adapter prohibition intact | PASS | NEVER rule 5 still forbids a wrapper, builder, or reusable spawn path |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Sibling `cli-*` skills were not read.** The wording looks shared across the
   family, so `cli-opencode` and `cli-claude-code` may carry the same over-reach.

2. **No automated check enforces the distinction.** Whether a given dispatch is
   a call or an adapter is a reviewer judgement, and the `deep-loop-runtime-delegation`
   hard-rule check was not re-implemented to match the narrowed wording.

<!-- /ANCHOR:limitations -->
