---
title: "Context Index — 121 deep-agent-improvement-benchmark-mode"
description: "Migration bridge for the phase parent: arc map, phase renames (old -> new), the 122 -> 007 fold-in provenance, and numbering policy. Resolves any reference to an old phase name."
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored as part of the 121 naming + historic-context reorg"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "reorg-20260530"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Context Index — 121 deep-agent-improvement-benchmark-mode

This is the **migration bridge** for packet 121. It carries the reorganization history that the lean `spec.md` deliberately does not (phase-parent content discipline forbids merge/migration narrative in `spec.md`). Use it to resolve any reference to an old phase-folder name and to understand why the phase numbers run the way they do.

- **Phases newest -> oldest with paths:** see `timeline.md`.
- **Structural phase map (what each phase did):** see `spec.md` -> Phase Documentation Map.
- **Status:** Complete — 18/18 phases shipped.

---

## 1. Two-arc structure

The packet is one program built in two arcs. Phase numbers are sequential across both.

**Arc 1 — Build the model-benchmark mode (phases 001–007).** Generalize the one-off 120/003 benchmark rig into a first-class `model-benchmark` mode of the deep-agent-improvement skill: design the mode selector + 3 pluggable seams (001) -> MiniMax M2.7 deep-research of the build (002) -> build it (003) -> independent tri-model hardening review (007) and remediation of its findings (004) -> opt-in 5-dim scorer + SKILL docs (005) -> deep-loop empty-archive maintenance fix (006).

**Arc 2 — Two co-equal lanes (phases 008–018).** Elevate model-benchmark from a "Mode 4" bolt-on to a lane co-equal with agent-improvement across every surface: command (008) -> SKILL.md (009) -> references/assets (010) -> agent note (011) -> catalog/playbook/advisor (012) -> scripts (013), then harden it with two independent deep-review -> remediation cycles — gpt-5.5 (014 -> 015) and Opus 4.8 (017 -> 018) — plus per-subfolder code READMEs (016).

---

## 2. Why phase 004 precedes phase 007 (the 122 -> 007 fold-in)

The tri-model hardening review of the Arc-1 build was originally scaffolded as a **separate packet, `122-session-120-121-deep-review`**, and run on 2026-05-28. Its findings were remediated the same day in `121/004`. On **2026-05-29** that review packet was **folded into 121** as phase `007-benchmark-mode-hardening-review`.

Consequence: the remediation (`004`) carries a **lower phase number than the review it remediates (`007`)**. This is expected — `004` already existed when `122` was renumbered into the `007` slot. The dependency is real and documented in each phase's metadata and history:

- `004` remediates the findings produced by `007` (review -> remediation).
- `007`'s own continuity records "all findings remediated in 121/004".

Numbers are **not** reshuffled to "fix" this — the sequence is the provenance record, and the git history (`git log --follow`) traces every folder back through its `git mv` renames.

---

## 3. Phase renames (2026-05-30 reorg)

Four phase folders were renamed via `git mv` (history preserved) to satisfy the literal-naming rule (system-spec-kit Rule 20): remediation packets must take the form `NNN-fix-<source>-for-<target>`, and cryptic finding-code jargon is not allowed.

| Phase | Old name | New name | Why |
|------:|----------|----------|-----|
| 004 | `004-benchmark-mode-remediation` | `004-fix-hardening-review-findings-for-benchmark-mode` | `remediation` is a forbidden standalone token; source = the 007 hardening review, target = benchmark-mode |
| 012 | `012-catalog-playbook-advisor-fp25` | `012-catalog-playbook-advisor-lane-labels` | `fp25` (an internal finding code) is cryptic jargon, not a subject token |
| 015 | `015-two-lane-review-remediation` | `015-fix-deep-review-findings-for-two-lane-code` | `review-remediation` is a forbidden standalone token; source = the 014 gpt-5.5 deep review, target = two-lane code |
| 018 | `018-opus-review-remediation` | `018-fix-opus-review-findings-for-two-lane-code` | `review-remediation` is a forbidden standalone token; source = the 017 Opus deep review, target = two-lane code |

**Resolving old names:** historical artifacts that predate this reorg (e.g. deep-review `iterations/*`, `deltas/*`, `review-report.md`, prior `decision-record.md` cross-references, and packet 120's `context-index.md`) intentionally keep the **old** names verbatim — they are past-tense provenance and are preserved, not rewritten. Map any old name to its new folder using the table above.

**Considered but kept** (flagged "weak" but not convention violations — left unchanged to limit cross-reference churn): `002-implementation-deep-research` (terse but accurate: it is the deep-research for the implementation design) and `006-deep-loop-empty-archive-dir-fix` (concrete bug subject; `-fix` is a suffix on a real subject, not a standalone token).

---

## 4. What the 2026-05-30 reorg changed

A naming + historic-context optimization pass over the whole packet:

1. **Renamed** the 4 phase folders above (`git mv` + self-reference path-fixes; 0 residual old-slug refs inside the renamed folders).
2. **Reconciled child metadata** across all 18 phases: `Status` -> Complete (10 were stale at "In Progress"/"Planned"/"Draft"), `Phase N of M` -> `N of 18` (denominators had drifted to 4/13/15/etc.), and repaired the predecessor/successor chain (added missing links on the review phases 002/007/014; repointed the renamed-folder cross-links).
3. **Rewrote** the parent `spec.md` stale sections (frontmatter description, §1 handoff criteria, §2 purpose, §3 scope + files-to-change, §4 open questions -> resolved, continuity) to reflect the full two-arc completed program, and de-fragmented the Phase Documentation Map table.
4. **Refreshed** parent `graph-metadata.json` (`derived.status` planned -> complete; `children_ids` repointed to new names) and the renamed children's `folderSlug`.
5. **Added** `timeline.md` (phases newest -> oldest) and this `context-index.md`.

The phase numbers themselves were **preserved** — renumbering would falsify the temporal/provenance record and break `git log --follow`.

---

## 5. Known limitation (not changed)

Several phases' `plan.md` / `tasks.md` / `implementation-summary.md` retain template-scaffold bodies (the substantive record lives in each phase's `spec.md` plus the actual code/review artifacts). These pass `validate.sh --strict` (the validator's placeholder check is satisfied) and were **not** back-filled — authoring detailed retrospective plans/tasks after the fact would fabricate history rather than preserve it. They are left as-is by design.

---

## 6. Related

- `timeline.md` — phases newest -> oldest, with full paths.
- `spec.md` — root purpose, scope, and the Phase Documentation Map.
- `graph-metadata.json` — `children_ids` + `derived` rollup (regenerated, not hand-edited).
- Predecessor packet: `specs/skilled-agent-orchestration/120-cli-opencode-minimax-optimization/` (the rig + MiniMax model this generalizes).
