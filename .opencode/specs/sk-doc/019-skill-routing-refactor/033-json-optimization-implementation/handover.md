---
title: "Handover: Post-Audit Remediation Program (Phases 013-020)"
description: "Everything a fresh agent needs to execute the eight-phase remediation autonomously — the verified regression numbers and the commands that reproduce them, the findings already refuted, the two hard sequencing rules, and the traps that cost this session time."
trigger_phrases:
  - "resume 033 remediation"
  - "routing regression handover"
  - "remediation phases 013 to 020"
importance_tier: "critical"
contextType: "handover"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation"
    last_updated_at: "2026-07-30T11:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored handover for phases 013-020"
    next_safe_action: "Start phase 013"
    blockers: []
    key_files:
      - "handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/handover"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Handover: Post-Audit Remediation Program (Phases 013-020)

---

## 1. WHERE THINGS STAND

Worktree `.worktrees/0127-sk-doc-033-alignment-run`, branch `sk-doc/0127-033-alignment-run`, based on `origin/skilled/v4.0.0.0`. Four commits, **none pushed** — pushing this branch needs a fresh operator go-ahead, and the pre-push hook blocks it without `SPECKIT_ALLOW_REMOTE_PUSH=1`.

| Commit | Contents |
|---|---|
| `7907c2491c` | Deep-review and deep-alignment run artifacts (four legs, 41 findings) |
| `4a7c77f441` | Cross-run synthesis — **its headline section 2 is wrong, see below** |
| `85f7333a96` | Phases 013-018 |
| `1f9b6e3d7b` | Phases 019-020 |

Eight phases are authored and `validate.sh --strict` clean. **Nothing is implemented.** No finding has been fixed.

---

## 2. THE REGRESSION — VERIFIED, REPRODUCE IT FIRST

Run this before anything else. It takes seconds and it is the whole reason this program exists.

```bash
cd .opencode/skills/system-skill-advisor/mcp-server
node scripts/routing-accuracy/capture-scorer-eval-baseline.mjs   # NEVER add --write
```

| Metric | Pinned baseline | Live at HEAD | Delta |
|---|---|---|---|
| `holdout_top1` | 53/72 = 0.7361 | **51/72 = 0.7083** | **-2** |
| `holdout_top3` | 55/72 = 0.7639 | 53/72 = 0.7361 | **-2** |
| `buckets.delegation` | 10/11 | **8/11** | **-2** |
| `full_corpus_top1` | 151/195 | 151/195 | zero |
| `full_corpus_top3` | 176/195 | 176/195 | zero |
| `ambiguity_top1` | 17/24 | 17/24 | zero |

Pins: `002-baseline-capture/baseline/capture-top3.json` (top-3) and `.../routing-baseline.json` (top-1, buckets). Corpus hashes are byte-identical to the pin, so the comparison is valid.

Live `holdout_top1` 0.7083 is **below the repo's own release floor** of 0.725 (`mcp-server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:30`).

Two confirmed consequences:
- That ratchet — the only test pinning holdout exactly and enforcing the floors — **fails 5/7** and is referenced by **no workflow** (`grep -rn scorer-eval-baseline-ratchet .github/workflows/` returns nothing).
- `tests/routing-golden-prompts.vitest.ts`, the gate this program built, **passes 10/10** straight through the regression.

Blast radius since the baseline sha: 18 skill-root metadata files plus three advisor scorer sources (`executor-delegation.ts`, `lanes/lexical.ts`, `scorer/projection.ts`). No post-close commit touched either surface. The three regressed prompts are all `cli-*` delegation cases.

---

## 3. TWO HARD RULES

**Never re-pin before diagnosing.** `capture-scorer-eval-baseline.mjs --write` makes every failing check pass by redefining the current state as expected — it bakes the -2 in as the new last-known-good and destroys the proof anything moved. Two of the audit's own remediation proposals reach for exactly that. Phase 013 forbids it for its whole duration.

**Status reconciliation follows measurement.** Phase 016 flips twelve status rows to Complete. Run before 013 and 015 resolve, it turns a visible inconsistency into an invisible one — a packet that looks finished over an open regression.

---

## 4. EXECUTION ORDER

```
013 (diagnose) ──┬── 014 (gate)      017 (authority)   020 (pre-program)
                 ├── 015 (evidence) ─┐   independent      independent
                 └───────────────────┴── 016 (metadata) ── 018 (register, closes last)
                                          019 (leftovers; sequence workflow edits with 014)
```

Each phase's `spec.md` section 4 holds its requirements and acceptance criteria; `plan.md` holds architecture, sequencing and rollback; `tasks.md` is the execution order. Phase 013 also has a `decision-record.md` with the three decisions governing the program.

---

## 5. ALREADY REFUTED — DO NOT RE-CHASE

An independent reviewer refuted nine findings on evidence. Re-investigating them is wasted effort.

- **Eight documentation-validator rows.** Instrument error. `sk-doc/scripts/validate_document.py` is a symlink that every caller resolves, so its rules file loads correctly; the finding cited line 1 of the very file it claimed was absent.
- **One quality-floor finding.** Its single flagged artifact scores full marks on structure; the deficit is divider-count heuristics on a generated diff table.
- **One path-containment finding** (`ci-skill-root-metadata.cjs:324`). The sink is a bare existence check that opens nothing.

Also corrected: the synthesis in commit `4a7c77f441` claims the capture mislabels top-1 as top-3 and that "this is not evidence of a routing regression." **That is backwards.** 53/72 is genuinely the live top-3; the number moved. Section 2 of that document is superseded by section 2 of this handover. Phase 018 records the correction.

And the dead `create-skill` paths sit in **spec-folder** metadata, not skill-root metadata — an unrelated schema sharing a filename. They have **no routing consequence**, contrary to the synthesis.

---

## 6. TRAPS THAT COST THIS SESSION TIME

**A concurrent deep-review fanout deletes untracked files repo-wide.** It snapshots dirty paths before each dispatch and `rmSync`s anything untracked appearing afterward. It ate three iterations of the alignment run mid-flight. The worktree is the protection — `.worktrees/` is gitignored, so the sweep cannot see it. Do not move this work into the main tree while such a run is active (`pgrep -f fanout-run`).

**Spec-doc section order is enforced.** `RISKS & DEPENDENCIES` comes before `OPEN QUESTIONS`. Level 3 additionally requires `EXECUTIVE SUMMARY` before `METADATA`, plus `NON-FUNCTIONAL REQUIREMENTS`, `EDGE CASES`, `COMPLEXITY ASSESSMENT`, `RISK MATRIX`, `USER STORIES`, a `RELATED DOCUMENTS` tail, and in `plan.md` the anchors `dependency-graph`, `critical-path`, `milestones`.

**Frontmatter `recent_action` and `next_safe_action` must be short.** Narrative sentences fail validation.

**Commit scope cannot be numeric.** `docs(033):` is rejected; use `docs(sk-doc):`.

**`git commit --only` rejects untracked files** — `git add` them first.

**Check gates by exit code, not by reading tail output.** A `tail`-based check masked seven real compiler errors earlier in this program's history.

---

## 7. VERIFICATION

```bash
# per phase
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase-folder> --strict

# the regression
cd .opencode/skills/system-skill-advisor/mcp-server && node scripts/routing-accuracy/capture-scorer-eval-baseline.mjs

# the dead gate (currently 5/7 failing, by design until 013/014)
npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts

# the gate that passes through the regression
npx vitest run tests/routing-golden-prompts.vitest.ts
```

The parent packet and the twelve original children currently fail `validate --strict` with a source-fingerprint mismatch. That is **pre-existing and identical in the untouched main-tree copy** — it is what phases 015 and 016 exist to fix, not something a fresh session introduced.

---

## 8. WHAT THIS PROGRAM DOES NOT COVER

Audit coverage was 71 files — the ones the original commits touched — not the subsystems they participate in. No audit leg examined runtime behaviour, whether CI gates what it claims, or the three scorer diffs that were the only live-code blast radius. Phase 018 records those gaps so a future audit inherits the list rather than the blind spot.
