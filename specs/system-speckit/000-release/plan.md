# Plan — v4.0.0.0 Release Notes & README Refresh

> Captured from the RELEASE V4 planning session. Temporary. Nothing shipped has been modified.
> This is the authoritative narrative; each phase child (`001`–`005`) charters one slice of it.

---

## 1. WHAT WE ARE DEALING WITH

| Fact | Value |
|------|-------|
| Baseline | `v3.6.0.0` (2026-06-18) — last public GitHub release |
| Target | `skilled/v4.0.0.0` HEAD (2026-08-14) |
| Commits in range | **2,826** (~2 months) |
| Conventional-commit compliance | **97%** (2,741 / 2,826) |
| Type breakdown | `docs` 998 · `feat` 702 · `fix` 537 · `refactor` 205 · `chore` 171 · `test` 62 · others |
| Breaking changes flagged (`!`) | only **4** |
| Distinct scopes | 307 (many are internal spec-folder numbers; ~20 are real user-facing surfaces) |
| Existing changelog | `.opencode/skills/system-spec-kit/changelog/` v3.6→v3.9 — **spec-kit-scoped only**, good tone template, partial content |
| Root README | 98 KB / 1,300+ lines; version badge → GitHub releases; "Latest Release Notes" link (line 1311) is **stale** (points at `v3.6.0.0.md`) |

### The key realization

The work already documented itself. Every packet below has its own `implementation-summary.md`
written at ship time — a distilled, accurate account of what it changed. That is a better
source than 2,826 raw commit subjects **or** blind research iterations. The packet list **is**
the release's table of contents.

---

## 2. SOURCES OF TRUTH (priority order)

1. **Per-packet `implementation-summary.md`** — primary. Already-distilled shipped truth.
2. **Git conventional commits** (`v3.6.0.0..HEAD`) — completeness backstop; catches anything
   not captured in a packet, and provides magnitude via `git diff --stat`.
3. **Existing spec-kit changelogs** (v3.7–v3.9) — tone/format template + the spec-kit slice.
4. **Deep-research synthesis** — for cross-cutting themes only, not enumeration.

---

## 3. RELEASE TABLE OF CONTENTS (packet worklist → sections)

The ~54 packets the operator flagged, grouped into the 8 top-level release sections:

| Section | Packets | Theme |
|---------|---------|-------|
| **Skill advisor** | `system-skill-advisor/` z_archive 012–016, 017 (audit + state containment), 018 (codex node runtime) | Advisor refactor + state containment |
| **Deep loop** | `system-deep-loop/` 030 (unification), 031 (smart-routing benchmark), 032 (deep-alignment mode), 033 (post-sync fixes), 034 (skill-benchmark codex executor), 035 (command-surface benchmark), 036 (deep-loop innovation) | Unification, new modes, benchmarks |
| **sk-doc** | `sk-doc/` 014 (parent) → 029 (17 packets): parent hub, hub-doc conformance, create-diff mode, fenced-code parity, benchmark authoring, skill-routing refactor, hyphen-naming, code-README coverage, feature-catalog integrity, playbook coverage, doc currency, README refinement, sk-communication skill, sk-create-diagram, divider/anchor standard | sk-doc parent hub + doc-quality program |
| **sk-prompt** | `sk-prompt/007-sk-prompt-parent` | Parent-hub merge |
| **sk-design** | `sk-design/` (whole tree) | Design hub consolidation |
| **MCP tooling** | `mcp-tooling/` 007 (parent), 008 (aside), 009 (refero), 010 (mobbin), 011 (routing remediation), 012 (template alignment), 013 (obsidian) | Hub + new transports |
| **Hooks / runtime** | `hooks/` (whole tree) | Runtime hook coverage |
| **CLI external orchestration** | `cli-external-orchestration/` 026 (parent), 027 (codex revival), 028 (hub rename), 029 (devin revival), 030 (cursor creation), 031 (pi creation), 032 (per-mode provider/model ref), 033 (deepseek v4 flash pi roster), 034 (opencode-go flash qwen roster), 035 (improved comms), 036 (grok 4.6), 041 (pi remote mobile), 042 (pi remote parity) | **New cli skill family** |
| **System spec-kit** | its own changelog v3.7–v3.9 + any `system-speckit/` packets | Template + memory refactor |

> `z_archive/*` and internal benchmark packets: **decision pending** — public one-line "internal tooling"
> mention vs. full treatment (see §7 Decision 3).

---

## 4. RECOMMENDED PIPELINE — deterministic extract → map-reduce with cheap models

### Phase 1 — Context pack (`001-context-pack`) — $0

Pure git + script. Build the seed every downstream worker consumes:

- `git log v3.6.0.0..HEAD` → structured records (hash, type, scope, subject, body).
- Bucket by `(type, scope)`; map scopes → the 8 sections above.
- **Collapse churn**: revert / "restore-clobbered-by-sync" pairs net to zero — must not appear publicly.
- Segregate the ~998 `docs` + internal numbered-scope commits from the public cut.
- Per-packet `git diff --stat v3.6.0.0..HEAD -- <paths>` for magnitude.
- Output: `context-pack.md` — categorized skeleton + per-packet path map. Usable raw changelog before any model runs.

### Phase 2 — Per-packet extraction (`002-per-packet-extraction`) — cheap/free, parallel

The **coverage spine**. One cheap worker per packet (~54 total). Each worker:

- Reads **its own** `implementation-summary.md` (+ `spec.md` if needed) and its diffstat from the pack.
- Emits a normalized "release fragment": 3–8 user-facing bullets ("what changed + why it matters"),
  breaking-change flags, migration notes.

Every packet visited exactly once → deterministic coverage, no convergence question, no gaps.
Cheaper and more accurate than iterative research for *enumeration*. Run in parallel across the
free/cheap executors.

### Phase 3 — Deep-research synthesis (`003-deep-research-synthesis`) — the depth layer

This is where the operator's **~100-iteration, no-early-convergence** run goes — but **seeded**
with the Phase-1 pack + packet worklist so iterations grind on genuinely open synthesis questions
(the through-line of the skill-model refactor, deep-loop unification narrative, breaking changes,
migration surprises) instead of re-deriving documented facts.

- Executors: **GLM 5.2 high (cli-devin)** on synthesis/depth; **DeepSeek V4 Flash (opencode-go pi)** on breadth.
- No early convergence; iteration cap ~100.
- **Honest caveat:** deep-research is built for unknowns. ~80% of "what changed" is already known
  from packet summaries, so unseeded iterations waste cheap-model time. Seeding is the fix.

### Phase 4 — Reduce (`004-release-notes-reduce`) — Opus (this session)

- Concatenate Phase-2 fragments + Phase-3 themes → **one consolidated `release-notes-v4.0.0.0.md`**
  covering the whole `v3.6.0.0 → v4.0.0.0` span (Decision 4).
- **Two-tier structure (Decision 3):**
  - Top: user-facing sections (the 8 surface groups) + headline highlights + the 4 breaking changes
    + upgrade notes.
  - `## Appendix: Internal & developer changes` — full enumeration of `z_archive/*` advisor packets
    and internal benchmark/tooling packets (skill-benchmark, command-surface-benchmark,
    post-sync-fixes, executor tooling, etc.).
- **Route final formatting through the repo's own sk-doc changelog packet** (matches the 370+
  existing entries + v3.9 tone). Do not hand-roll the format.
- Cheap models gather; a capable model writes the shipped prose. Non-negotiable for a release doc.

### Phase 5 — README update (`005-readme-update`) — Opus, surgical

- Root README is 98 KB — **targeted edits only, no regeneration.**
- Bump version field/badge; fix the stale "Latest Release Notes" link (line 1311 → v4 notes);
  update only the capability sections the breaking/added items changed.

### Cost shape

| Phase | Cost |
|-------|------|
| 1 | $0 (git + script) |
| 2 | bulk of calls, tiny inputs → free/cheap models, parallel |
| 3 | ~100 iters on free/cheap models (time cost, not $ cost) |
| 4–5 | small; Opus orchestration + final prose |

Net paid-token cost near-zero if Phases 2–3 ride free/cheap models; Opus only does reduce + README.

---

## 5. ON "SLIGHTLY CHANGE RESEARCH MODE SO IT GATHERS ALL CHANGES"

**Verify before modifying.** First `Read` the `/deep:research` SKILL.md and check whether it
already accepts a **context seed / scope pack** input (the deep modes carry bounded snapshots).

- If yes → feed it the Phase-1 pack + worklist; **change no code.**
- If genuinely not → a **minimal, reversible change in its own Gate-3 packet under
  `system-deep-loop`** (shared-runtime blast radius), not a rewrite.

Do not hand-roll a substitute for the research workflow. Do not modify shared runtime on assumed
friction. (PLAN-WORKFLOW LOCK.)

---

## 6. EXECUTION PREREQUISITES & KNOWN TRAP

- **Read the contracts first** (required before cli-X dispatch): `/deep:research` SKILL.md,
  `cli-devin` SKILL.md (GLM 5.2 high), `cli-opencode` / pi SKILL.md (DeepSeek V4 Flash).
- **Known trap (from operator history):** opencode / pi fan-out children hang at 0% CPU because
  the dispatched child inherits an *enforced* spec-gate. They need
  `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode run … </dev/null` (cli-opencode Rule 17).
  Wire this into the executor env **up front**, not after a stall.
- **Gate 3:** this packet (`specs/system-speckit/000-release/`) is the write authority; deep-research
  state (`deep-research-state.jsonl`, `deltas/`) lands under `003-deep-research-synthesis/`.
- **spec-memory MCP** was disconnected at planning time — restore it (or use the CLI fallback) before
  any indexing step, and regenerate this packet's metadata.

---

## 7. DECISIONS (operator — RESOLVED 2026-08-14)

1. **Coverage model → SPINE + SEEDED DEPTH.** Phase 2 per-packet fan-out (guaranteed coverage,
   one worker per packet) THEN Phase 3 seeded deep-research for cross-cutting themes on top.
2. **Executor split → SPLIT BY ROLE.** DeepSeek V4 Flash (opencode-go pi) does the ~54 per-packet
   extractions (Phase 2); GLM 5.2 high (cli-devin) does the deep-research synthesis (Phase 3).
   Each phase is single-model (no cross-check) — accept for cost; Opus reduce is the quality gate.
3. **Public scope → TWO-TIER DOC.** User-facing sections at the top (features only) + a separate
   **"Appendix: Internal & developer changes"** enumerating the `z_archive/*` + internal
   benchmark/tooling packets in full. See §4 Phase 4.
4. **Version label → ONE CONSOLIDATED `v4.0.0.0`.** Single `release-notes-v4.0.0.0.md` covering the
   whole `v3.6.0.0 → v4.0.0.0` span (2,826 commits). One GitHub release, one README link. No
   per-minor rollups.

All four resolved → the executable plan is unblocked. NEXT: draft Phase-1 `context-pack.md`.

---

## 8. ALTERNATIVES WEIGHED (and why not)

- **Pure mechanical (git-cliff / conventional-changelog):** $0 but flat bullet dump, no narrative.
  Good as the Phase-1 skeleton / fallback, not the deliverable.
- **One big model over everything:** rejected — 2,826 diffs blow context + cost; even subjects-only
  loses parallelism and yields shallow output.
- **Reuse existing changelogs wholesale:** spec-kit-only, stop at v3.9 → partial content + tone
  template, not a substitute.
- **Unseeded 100-iter deep-research:** wastes cheap-model time re-deriving documented facts. Seeding fixes it.
