---
title: "Decision Record: sk-prompt parent-hub architecture"
description: "Architecture decisions for folding sk-prompt and sk-prompt-models into one parent hub sk-prompt with two workflow modes: prompt-improve and prompt-models."
trigger_phrases:
  - "sk-prompt parent architecture decision record"
  - "prompt-improve prompt-models adr"
  - "sk-prompt hub decision"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-prompt/007-sk-prompt-parent/002-architecture-decision"
    last_updated_at: "2026-07-09T17:30:00Z"
    last_updated_by: "claude"
    recent_action: "Phase 007 Lane-C benchmark resolved the routingClass question empirically"
    next_safe_action: "Proceed to phase 008 cutover"
    blockers: []
    key_files:
      - "decision-record.md"
      - "../007-routing-benchmark-and-review/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-architecture-decision"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Hub topology: two packetKind:workflow modes, zero extensions"
      - "Full rename via git mv for both packets"
      - "/prompt renamed to /prompt-improve; prompt-models gets no command"
      - "Identity dissolution: delete sk-prompt-models/graph-metadata.json, fold its edges into the hub's"
      - "prompt-improve manual_testing_playbook stays packet-local"
      - "sk-prompt-models version metadata normalizes to 0.9.0.0 pre-fold; the hub releases the fold-in as 1.0.0.0"
      - "RESOLVED by phase 007 Lane-C benchmark (router-mode, PASS 100/100): routingClass stays metadata for prompt-models — no lexical carve-out needed. The initial equal-ish weight (3 vs prompt-improve's 4) caused named-model prompts to lose intra-hub routing entirely (0/100); rebalancing prompt-models' routerSignal weight to 5 fixed it. A named model id is a strong, unambiguous signal that should outweigh the hub's generic default, not underweigh it."
---
# Decision Record: sk-prompt parent-hub architecture

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Hub topology — two workflow-kind modes, zero extensions

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Operator (via approved plan) |

---

<!-- ANCHOR:adr-001-context -->
### Context

`sk-prompt` and `sk-prompt-models` are two flat, independently advisor-routable skills with no structural relationship. This repo's parent-hub canon (already applied to `sk-code`, `sk-design`, `system-deep-loop`, `sk-doc`) exists to fix exactly this shape. We needed to decide the new hub's mode count, `packetKind` for each mode, and whether any named extension (surface-axis, runtime-loop, transport-axis) applies.

### Constraints

- The doctrine's surface-packet contract requires the surface to enrich a primary workflow inside the SAME hub. `prompt-models`'s real consumer — `cli-opencode`'s pre-dispatch step — lives in a different hub entirely.
- `sk-prompt-models` is already independently advisor-routed today (confirmed via `labeled-prompts.jsonl` rows targeting it as `skill_top_1`), so its identity cannot simply collapse into invisible supporting evidence.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: One hub, `sk-prompt`, with exactly two `packetKind: "workflow"` modes — `prompt-improve` and `prompt-models` — and zero named extensions (no surface-axis, no runtime-loop, no transport-axis).

**How it works**: Both modes route via `routingClass: "metadata"` (the doctrine default for new hubs). `prompt-models` keeps a read-only `toolSurface` (Read/Grep/Glob allowed; Write/Edit/Task forbidden; `mutatesWorkspace: false`) even though it is `packetKind: "workflow"`, not `surface` — nothing in doctrine requires workflow packets to mutate.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Two workflow modes, zero extensions (chosen)** | Mirrors sk-doc's proven two-tier core; matches sk-code + sk-code-review's closest precedent (a two-independent-skill fold-in) | None material | 9/10 |
| `prompt-models` as a `surface` packet | Simpler mental model ("it's just reference data") | Mechanically fails the surface-packet contract — its primary consumer lives outside the hub; would make it advisor-invisible, breaking today's routing | 3/10 |
| `prompt-models` as a `transport` packet (sk-design's `design-mcp-open-design` precedent) | Matches the "bridges to an external tool" shape | `prompt-models` doesn't drive an external CLI/MCP itself — it's read-only reference data consumed BY `cli-opencode`, not a bridge to it | 4/10 |

**Why this one**: `prompt-models` is independently primary-routed today and its real consuming workflow lives outside this hub, which rules out `surface`. It doesn't bridge to an external tool's own CLI/MCP surface, which rules out `transport`. `workflow` with a read-only `toolSurface` is the only shape consistent with both its current behavior and the doctrine's own decision criteria.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One advisor identity instead of two, ending the split-but-coupled prose-only boundary between the skills.
- `prompt-models` keeps its independent routability — no regression in how users reach small-model dispatch guidance.

**What it costs**:
- ~~The empirical question of whether `routingClass: "metadata"` (vs. a lexical carve-out) preserves today's routing accuracy for `prompt-models` queries is deferred, not pre-answered.~~ **RESOLVED 2026-07-09 by phase 007's Lane-C benchmark** (router-mode, 4 scenarios, PASS 100/100): `routingClass: "metadata"` preserves full routing accuracy for named-model queries. No carve-out needed. The real finding was a router-weight imbalance, not a routingClass limitation — see Amendment below.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| ~~Advisor routing accuracy regresses for small-model-dispatch queries after the identity merge~~ | ~~M~~ | **CLOSED** — phase 007 benchmark: D1 intra 100/100, D2 discovery 100/100, D5 connectivity 100/100 after the weight fix below. |

### Amendment (2026-07-09, post phase 007)

Phase 007's first benchmark run scored 0/100 on both named-model scenarios (SP-002 DeepSeek-v4-pro, SP-004 GLM-5.2) — the router was correctly identifying `prompt-models` internally (`routeTelemetry.workflowMode: ["prompt-models"]`, `matchedAliases: ["deepseek"]`), but `prompt-models`' router weight (3) was lower than `prompt-improve`'s (4), leaving it under-weighted relative to the hub's generic default for any query that also touched hub-identity vocabulary. Raised `prompt-models`' `hub-router.json` weight to **5** — the finding: a request naming a specific small model by id is a strong, unambiguous signal and should outrank the hub's generic default, not lose to it. Re-run: PASS 100/100 across all 4 scenarios. This is a routing-config amendment, not an architecture reversal — `routingClass: "metadata"` and the two-workflow-mode topology from the original ADR both stand unchanged.

A second, unrelated bug was found and fixed in the same investigation: the shared Lane-C scenario loader (`system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`) parsed `expected_intent` frontmatter with a regex (`[A-Za-z_]+`) that silently truncated any hyphenated value at the first hyphen — so `expected_intent: prompt-models` was read as just `prompt`, permanently zeroing `intentRecall` regardless of actual routing correctness. Fixed to `[A-Za-z0-9_-]+` (additive, backward-compatible with the existing `UPPERCASE_UNDERSCORE` convention other hubs' playbooks use). This bug would affect any future hub playbook using hyphenated `workflowMode` values as `expected_intent` — worth flagging upstream since `sk-doc`, `sk-code`, and `sk-design` all use hyphenated `workflowMode` naming too, even though their existing playbooks predate this convention and use underscore-style intent labels instead.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Fixes a real structural gap: two coupled skills with zero graph relationship |
| 2 | **Beyond Local Maxima?** | PASS | Surface and transport alternatives were weighed and mechanically ruled out, not just workflow assumed by default |
| 3 | **Sufficient?** | PASS | Zero extensions is the minimum shape that satisfies both packets' real behavior — no speculative extension added |
| 4 | **Fits Goal?** | PASS | Directly the operator's stated request: one hub, two named modes |
| 5 | **Open Horizons?** | PASS | Matches the doctrine's own reference shape (sk-doc); future extensions remain addable without restructuring |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/skills/sk-prompt/mode-registry.json` — two `modes[]` entries, `prompt-improve` and `prompt-models`, both `packetKind: "workflow"`.
- `.opencode/skills/sk-prompt/hub-router.json` — base three outcomes only (`single`, `orderedBundle`, `defer`), `routerPolicy.defaultMode: "prompt-improve"`.

**How to roll back**: Phase 003 has not yet run (additive-only, no content moved). Reverting this ADR before phase 003 starts costs nothing — just redraft the registry target shape. After phase 003, rollback means restoring the two flat skills from git history and deleting the hub skeleton (still tractable since phases 003-005 are pure moves, not destructive rewrites).
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Full rename via git mv for both packets

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-002-context -->
### Context

Folding `sk-prompt-models` in required choosing between a full `git mv` rename (`folder == packetSkillName == workflowMode` everywhere) and a lower-blast-radius option that kept the `sk-prompt-models/` folder name unchanged (justified by precedent: `system-deep-loop` already runs `workflowMode != packetSkillName` live today, and the doctrine explicitly licenses reusing an "established packet name" for workflow packets). The lower-blast-radius option was presented as the recommendation given the 2,616-file tree (2,585 of them the live `/deep:model-benchmark` write target) and the fact that this exact skill was already renamed once 3 weeks ago (`006-sk-prompt-models-rename`).

### Constraints

- Whichever option is chosen, the directory move (if any) and the hardcoded write-target path repoints must land as one atomic unit — never split across separate commits.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Full `git mv` rename. `sk-prompt/*` → `sk-prompt/prompt-improve/*`; `sk-prompt-models/*` → `sk-prompt/prompt-models/*`. Operator explicitly overrode the lower-blast-radius recommendation in favor of maximal canon purity.

**How it works**: Phase 004 moves the 51-file `prompt-improve` tree; phase 005 moves the 2,616-file `prompt-models` tree in the same atomic change as the hardcoded write-target and profile-path repoints.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Full rename (chosen)** | `folder == packetSkillName == workflowMode` holds exactly, zero `grandfatheredFolderMismatch`, maximally canon-pure | Touches 2,616 files, including a second full rename of this skill inside a month | 8/10 |
| Keep `sk-prompt-models/` folder, diverge `workflowMode` | Zero files inside the 2,616-file tree move; doctrine-licensed for workflow packets | Less-traveled pattern (only `system-deep-loop`'s N→1 multiplexing precedent, not a 1:1 rename-avoidance case) | 7/10 |

**Why this one**: Operator's explicit choice, prioritizing canon purity and long-term consistency over short-term blast-radius minimization.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Zero naming debt (`grandfatheredFolderMismatch`) anywhere in the hub.
- Consistent, predictable packet-naming convention for any future sk-prompt mode.

**What it costs**:
- Large diff (2,616 file moves) in phase 005. Mitigation: `git mv` is a rename, not a rewrite — git tracks it efficiently, and CI/review tooling recognizes renames as low-risk.
- Every hardcoded path referencing the old `sk-prompt-models/` location must be found and repointed. Mitigation: phase 001's referrer inventory + phase 005's bundled repoint + phase 006's broader sweep.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A referrer is missed and fails silently (wrong path, not a loud error) | H | Phase 006's re-run grep sweep as an explicit gate before phase 007 |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator-directed; not accepting it would silently substitute the recommendation for an explicit instruction |
| 2 | **Beyond Local Maxima?** | PASS | The lower-blast-radius alternative was fully specified and presented before the operator chose |
| 3 | **Sufficient?** | PASS | No further naming cleanup remains after this rename — no partial/mixed state |
| 4 | **Fits Goal?** | PASS | Operator explicitly requested this over the recommended alternative |
| 5 | **Open Horizons?** | PASS | Removes future naming-debt cleanup that a grandfathered mismatch would otherwise require eventually |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.opencode/skills/sk-prompt-models/*` (2,616 files) → `.opencode/skills/sk-prompt/prompt-models/*` via `git mv`.
- `.opencode/skills/sk-prompt/*` (51 files, the OLD flat sk-prompt) → `.opencode/skills/sk-prompt/prompt-improve/*` via `git mv`.

**How to roll back**: `git mv` is reversible with an inverse `git mv` before the commit lands; after commit, `git revert`.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Command binding — /prompt renamed to /prompt-improve, prompt-models gets no command

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-003-context -->
### Context

`/prompt` is today the ONLY bare, non-colon-namespaced command among every multi-mode hub in this repo (every other hub uses `/family:mode`, e.g. `/create:skill`, `/design:motion`, `/deep:skill-benchmark`). A colon-namespaced option (`/prompt:improve` + `/prompt:models`) was raised as a better-conforming alternative — it's the only option that keeps the command inside `parent-skill-check.cjs` check 3k's (command tool-grant-drift) coverage, since that check's regex requires a colon.

### Constraints

- `prompt-models` has never had a dedicated command — it's reached only via advisor routing and cross-skill reference.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Rename `/prompt` to `/prompt-improve` (bare, not colon-namespaced). `prompt-models` gets no command — operator explicitly declined one.

**How it works**: `.opencode/commands/prompt.md` moves to `.opencode/commands/prompt-improve.md`; its internal `Read` path repoints to `sk-prompt/prompt-improve/SKILL.md`.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Bare /prompt-improve (chosen)** | Literal match to the operator's stated mode name; simpler than colon-namespacing | Misses checker 3k's automated tool-grant-drift coverage | 7/10 |
| Colon-namespaced `/prompt:improve` + `/prompt:models` | Matches every other hub's convention; gains checker 3k coverage; free second command | Not what the operator chose | 6/10 |
| Keep `/prompt` bare, repoint only | Minimal churn (1 line) | Doesn't match the operator's literal request | 5/10 |

**Why this one**: Operator's explicit choice — declined a `prompt-models` command and did not select the colon-namespaced option when offered.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Command name matches the mode name exactly (`prompt-improve` mode, `/prompt-improve` command) — easy to reason about.

**What it costs**:
- `/prompt-improve` stays outside checker 3k's automated coverage (a known, accepted gap, not an oversight).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future tool-grant drift on `/prompt-improve` goes undetected by 3k | L | Manual review during any future command-surface change; can revisit colon-namespacing later without re-litigating this ADR |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The old `/prompt` path is being relocated regardless; renaming it now avoids a second churn event later |
| 2 | **Beyond Local Maxima?** | PASS | Colon-namespaced and keep-bare alternatives were both offered and considered |
| 3 | **Sufficient?** | PASS | One command rename, no over-scoping into unrequested colon-namespace migration |
| 4 | **Fits Goal?** | PASS | Matches operator's literal request |
| 5 | **Open Horizons?** | PASS | Colon-namespacing remains an option for a future, separately-scoped change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `.opencode/commands/prompt.md` → `.opencode/commands/prompt-improve.md` (git mv).
- Internal `Read(".opencode/skills/sk-prompt/SKILL.md")` → `Read(".opencode/skills/sk-prompt/prompt-improve/SKILL.md")`.
- ~11 files referencing `/prompt` as a command token updated (see phase 006 referrer sweep).

**How to roll back**: `git mv` back, revert the Read-path edit.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Playbook consolidation and version-number reconciliation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Claude (drafted), pending final operator sign-off at this gate |

---

<!-- ANCHOR:adr-004-context -->
### Context

Two smaller open items remained after the operator's Q&A: (1) whether `prompt-improve`'s 7-category `manual_testing_playbook/` folds up to hub level or stays packet-local, and (2) how to reconcile `sk-prompt-models`' three disagreeing version numbers (`SKILL.md` 0.8.0.0, its own `description.json` "0.2.1", latest changelog v0.9.0.0).

### Constraints

- Doctrine allows either shape for playbooks — no hub in this repo mandates one over the other (`sk-doc` keeps its playbook hub-level only; other hubs vary).
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: `prompt-improve`'s playbook stays packet-local (moves as-is with the rest of the packet, no restructuring). `sk-prompt-models`' version metadata normalizes to `0.9.0.0` (matching its own latest changelog, the most authoritative of the three disagreeing numbers) immediately before the fold-in; the new hub's `SKILL.md` starts at `1.0.0.0` (matching the convention used when `sk-code`/`sk-design`/`sk-doc` became hubs), while both nested packets keep their own independent versioning continuity going forward.

**How it works**: No playbook file moves beyond the packet relocation itself. A single version-field edit to `sk-prompt-models/description.json` and `SKILL.md` before the git mv in phase 005, plus a new hub-level `SKILL.md` starting at `1.0.0.0` in phase 003.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Packet-local playbook + normalize to 0.9.0.0 (chosen)** | Zero unnecessary file restructuring; version reconciliation uses the most-recently-authored number as ground truth | None material | 8/10 |
| Fold playbook up to hub level | Matches `sk-doc`'s own precedent | No behavioral need — `prompt-improve` already has a complete, working playbook; moving it up adds churn with no benefit | 4/10 |
| Leave version numbers as-is (three disagreeing values) | Zero effort | Compounds existing confusion into the merged hub | 2/10 |

**Why this one**: Both calls minimize unnecessary churn while fixing the one thing (version confusion) that would otherwise persist into the new hub.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Version metadata becomes internally consistent before it's inherited by the hub.
- No wasted motion moving a playbook that doesn't need to move.

**What it costs**:
- None material.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| None identified | — | — |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Version confusion is a real, pre-existing, documented inconsistency |
| 2 | **Beyond Local Maxima?** | PASS | Hub-level playbook fold-up was considered and rejected with a stated reason |
| 3 | **Sufficient?** | PASS | Minimal edit — no restructuring beyond the version fields |
| 4 | **Fits Goal?** | PASS | Cleans up a named risk from the research phase without scope creep |
| 5 | **Open Horizons?** | PASS | Both packets retain independent versioning continuity for future changes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `sk-prompt-models/SKILL.md` frontmatter `version:` → `0.9.0.0` (before the phase 005 move).
- `sk-prompt-models/description.json` `"version"` → `"0.9.0.0"`.
- New `sk-prompt/SKILL.md` frontmatter `version: 1.0.0.0` (phase 003).

**How to roll back**: Single-field edits; revert via git.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!--
Level 3 Decision Record: 4 ADRs covering hub topology, naming, command binding, and the two remaining open questions.
Write in human voice: active, direct, specific.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
