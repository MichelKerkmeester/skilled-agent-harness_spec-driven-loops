---
title: "111: Plan — 026 cleanup remediation"
description: "Sequenced execution plan for Wave 3: 7 sub-waves W3.A → W3.G, cli-devin SWE-1.6 at 3 dispatch points, main agent for mechanical renumbers. Per-operation atomic commit, per-wave HEAD baseline."
trigger_phrases:
  - "111 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/111-026-cleanup-remediation"
    last_updated_at: "2026-05-16T09:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored plan.md"
    next_safe_action: "Capture per-wave baselines, then W3.A dispatch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000112"
      session_id: "111-plan-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# 111: Plan — 026 cleanup remediation

<!-- SPECKIT_LEVEL: 1 -->

---

## 1. APPROACH

7 sub-waves ordered lowest-blast-radius → highest. Per-wave HEAD baseline in `evidence/per-wave-baselines.txt`. Per-operation atomic commit. Stay on `main`. Mirror 107/109 execution discipline.

## 2. EXECUTION SEQUENCE

### W3.A — Author 33 sub-phase base files (cli-devin × 11 parallel)

11 sub-phase dirs × 3 files each. Each cli-devin agent:
- Tool whitelist: `["Read", "Grep", "Glob", "Write"]`
- Write scope: narrow to its own sub-phase dir
- Inputs: README.md, child packet list, parent spec.md, `012-causal-graph-channel-routing/` as golden reference
- Outputs: spec.md (phase-parent shape) + description.json + graph-metadata.json with derived children_ids

Commits: 11 atomic.

### W3.B — Renumber 86 sub-phase children (main agent)

Per-sub-phase target: 001..N. Two-pass collision-safety (temp `_NNN-` prefix then strip underscore).

Per-rename protocol:
```bash
git mv "<PARENT>/$OLD_NAME" "<PARENT>/$NEW_NAME"
rg -l --no-ignore --hidden -uu "$OLD_NAME" .opencode \
  | grep -v 'research/iterations/' \
  | xargs -I{} sed -i '' "s|$OLD_NAME|$NEW_NAME|g" {}
git add -- <changed-paths>
git commit -m "111 W3.B: renumber <old> → <new>"
```

Commits: 86 atomic.

### W3.C — Renumber 22 children in 007/013/014 (main agent)

| Parent | Renumbers |
|--------|----------:|
| 007-code-graph | 16 |
| 013-doctor-update-orchestrator | 3 |
| 014-local-embeddings-migration | 3 (gap-fix only; dup pairs → W3.D) |

Pre-flight: snapshot all 55 014 children + their graph-metadata.children_ids to `evidence/pre-flight-014-children.txt`.

### W3.D — Resolve 014 dup-prefix pairs (main agent, 2 ops)

- `_025-llm-model-runtime-inventory` + `026-post-batch-11-re-review`
- `040-reset-stuck-embedding-rows` + `040-v-rule-cross-spec-overreach`

Decision rule: keep chronologically-earlier per `git log --diff-filter=A`; renumber later to next-available. Provenance → `evidence/014-dup-resolution.md`.

### W3.E — Verbose name cleanup (cli-devin scorer + main agent apply)

cli-devin emits `evidence/proposed-renames.md`. Composite score 0-10:
- L (length over 35): up to +3
- R (parent-token redundancy): +3
- G (generic-token density): +1 per generic over 2
- I (recall impact): -2 if unique discriminator

Threshold ≥ 5 → rename. Main agent applies same W3.B protocol + updates renamed packet's own spec.md title.

### W3.F — Parent-doc sync (cli-devin × 1)

17 phase parents: 026 + (000 + 6 sub-phases) + (008 + 5 sub-phases) + 007 + 013 + 014. Re-derive children_ids, update PHASE CHILDREN tables. 1-4 commits.

### W3.G — Final validation gate (main agent)

1. `validate_document.py` on 111 + 33 W3.A + 17 W3.F
2. `validate.sh 026-graph-and-context-optimization --strict` exit 0
3. Orphan-ref check: 0 active-surface refs for any old name

Fix-forward on failure (targeted commit per finding).

## 3. RECOVERY BASELINES

| Wave | Baseline Tag | Capture Point |
|------|--------------|---------------|
| BASE_111 | dbd3fbe79 | At scaffold commit |
| BASE_W3A | TBD | Before W3.A first dispatch |
| BASE_W3B | TBD | After W3.A close |
| BASE_W3C | TBD | After W3.B close |
| BASE_W3D | TBD | After W3.C close |
| BASE_W3E | TBD | After W3.D close |
| BASE_W3F | TBD | After W3.E close |
| BASE_W3G | TBD | After W3.F close |

## 4. COMMIT BUDGET

| Wave | Commits | Wall-clock |
|------|--------:|------------|
| Scaffold | 1 | 5 min |
| W3.A | 11 | 45-60 min |
| W3.B | 86 | 2.5-3.5 h |
| W3.C | 22 | 1-1.5 h |
| W3.D | 2 | 15 min |
| W3.E | 26 | 1 h |
| W3.F | 4 | 20 min |
| W3.G | 0-5 | 30-60 min |
| **Total** | **~150** | **7-9 h** |
