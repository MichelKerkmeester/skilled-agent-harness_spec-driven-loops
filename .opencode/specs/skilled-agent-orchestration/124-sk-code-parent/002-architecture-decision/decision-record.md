---
title: "Decision Record: sk-code parent architecture"
description: "Binding architecture decision for the sk-code parent conversion — 5 phase-mode packets over one shared surface router, folding sk-code-review in as a clean code-review mode, with a regression-first cutover."
trigger_phrases:
  - "sk-code architecture decision"
  - "sk-code 5-mode taxonomy"
  - "sk-code parent decision record"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/002-architecture-decision"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the operator-approved 5-mode architecture and the regression-first build sequence"
    next_safe_action: "Resolve build isolation (worktree vs in-place), then run 003 scaffold-hub via /create:sk-skill-parent"
    blockers: []
    key_files:
      - "../001-research-and-context/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
# Decision Record: sk-code parent architecture

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. STATUS

**Accepted** — 2026-07-03, by operator ("Go with recommended"). Supersedes no prior decision; this is the founding architecture for the sk-code family.

---

## 2. CONTEXT

`sk-code` (v3.5, flat, two-axis surface × phase router) and `sk-code-review` (v1.5, standalone, already coupled to sk-code) fragment code work and collide in the advisor. Phase 001 produced a decision-ready recommendation (`../001-research-and-context/research/research.md`, backed by a GPT-5.5-fast pass with `file:line` citations and a two-scout blast-radius map). The nested parent-hub pattern is already proven by `sk-design` and governed by `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md`.

---

## 3. DECISION

**Convert `sk-code` into a nested parent hub** (mirror `sk-design`, not deep-loop) with **five phase/activity mode packets over one shared surface router**, folding `sk-code-review` in as the `code-review` mode.

### 3.1 Mode taxonomy (5 modes, `code-` prefix)

| Mode | Folder / packetSkillName | Owns | Tool surface |
|------|--------------------------|------|--------------|
| implement | `code-implement` | Phase 0 research + Phase 1 implementation; WEBFLOW/OPENCODE authoring; Motion.dev overlay consumption | mutating (Read, Write, Edit, Bash, Grep, Glob, Task) |
| quality | `code-quality` | Phase 1.5 quality gate; P0/P1/P2 author checks; comment hygiene; surface checklists | mostly mutating (Read, Edit, Bash, Grep, Glob) |
| debug | `code-debug` | Phase 2 root-cause debugging; error recovery; escalation discipline | mutating (Read, Edit, Bash, Grep, Glob, Task) |
| verify | `code-verify` | Phase 3 verification; Iron Law evidence; mutation/falsifier ritual | non-mutating (Read, Bash, Grep, Glob) |
| review | `code-review` | Findings-first review; security/correctness baseline; checklists; output contract; PR-state gates | read-only + review cache (Read, Bash, Grep, Glob, limited Write) |

### 3.2 Structural rules
- **Surface detection (WEBFLOW / OPENCODE / MOTION_DEV) lives in hub `shared/`**, consumed by every mode. OPENCODE-over-WEBFLOW precedence exists exactly once. Modes own workflow contracts, not surface identity.
- **Exactly one `graph-metadata.json`** (the hub, `skill_id: sk-code`, `family: sk-code`). No mode packet or `shared/` carries graph-metadata (the one hard advisor invariant).
- **`mode-registry.json` + `hub-router.json`** modeled on `sk-design`; all modes `advisorRouting.routingClass: "metadata"` (no projection-map or drift-guard work).
- **`sk-code-review` → clean `code-review`** (`folder == packetSkillName`). A **legacy `sk-code-review` alias/redirect** is preserved through cutover and removed only after explicit `sk-code-review` prompts resolve to hub + `code-review`.
- **Native invocability (Option E):** `Skill(sk-code)` + mode hint routes to a mode; per-mode commands + a `code` family agent are fallback surfaces. Hub `allowed-tools` = union of mode tools. Every new/moved doc carries a 4-part `version` (118).

---

## 4. OPTIONS CONSIDERED

| Option | Verdict |
|--------|---------|
| **5 phase-modes over shared surface router** | **CHOSEN** — each phase is a distinct contract; family-consistent with sk-design's 5 modes; surface precedence centralized |
| Activity-lanes-only (implement/review/verify/debug) | Rejected — loses the load-bearing surface axis; omits the distinct Phase-1.5 gate |
| Surface-lanes-only (webflow/opencode/motion) | Rejected — surfaces are resource/evidence families, not workflow modes; MOTION_DEV is a peer resource, not a surface |
| Leaner 2–3 modes (implement+review, phases folded in) | Considered and declined by the operator in favor of the 5-mode split |
| Keep flat sk-code + sk-code-review | Rejected — the status quo that motivated this packet (advisor collision, monolith) |

---

## 5. BUILD SEQUENCE (regression-first) → phases 003–009

1. **Freeze routing-parity fixtures FIRST** — representative prompts: WEBFLOW, OPENCODE, UNKNOWN, Motion.dev cross-stack, Phase-1.5 quality, Phase-3 verify, explicit `sk-code-review`. (003 pre-step.)
2. **003 scaffold-hub** — via `/create:sk-skill-parent`: thin hub `SKILL.md`, `mode-registry.json`, `hub-router.json`, `command-metadata.json`, one hub `graph-metadata.json`, `shared/`, 5 empty mode-packet skeletons. Additive; no old content moved yet.
3. **004 onboard-implement** — move surface/router material into `shared/`; relocate sk-code implement/quality/debug/verify content into the four `code-*` mode packets, repointing internal paths.
4. **005 foldin-review** — move `sk-code-review/**` into `code-review/`; DELETE `sk-code-review/graph-metadata.json`; preserve review doctrine verbatim.
5. **006 build-remaining-modes** — complete each mode's `SKILL.md`, README, references, playbook; version-stamp.
6. **007 advisor-and-integration** — merge review keywords into the hub node; regenerate `skill-graph.json` via `advisor-rebuild`; repoint 4 reverse-edge sources + agents (`code`/`review`/`orchestrate`/`deep-review`/`ai-council`) + speckit YAML + governance; keep legacy alias.
7. **008 routing-benchmark-and-review** — parity-check vs the frozen fixtures; family deep-review; remediate P0/P1.
8. **009 cutover-and-rollout** — remove the legacy `sk-code-review` route only after explicit-review prompts resolve; `parent-skill-check.cjs` + recursive validation; version/changelog bumps.

**Execution model:** Claude orchestrates/verifies; GPT-5.5-fast (high) via cli-opencode performs the writing/implementing. Each phase validates before the next (`parent-skill-check.cjs` + manual/`validate.sh`).

---

## 6. CONSEQUENCES

**Positive:** one advisor identity (dissolves the sk-code/sk-code-review ambiguity); centralized surface precedence; extensible modes; sk-code-review doctrine preserved.

**Costs / risks:**
- High blast radius (~428 + ~119 live files). Mitigated by regression-first fixtures + phased validation + legacy alias.
- **Cross-session collision:** the advisor is also in the active 028 packet's scope. The advisor edits (007) are late; earlier phases are additive. Coordinate/isolate before 007.
- Mode-level routing precision is unverified by automation (all-metadata modes have no parity fixtures) — validate via `parent-skill-check.cjs` + manual playbooks.

---

## 7. ROLLBACK

Phases 003–006 are additive/relocating within a git-tracked tree — revert by branch/worktree discard. The destructive step (delete `sk-code-review/graph-metadata.json`, 005) and the advisor rebuild (007) are the hard-to-reverse points; take a checkpoint/commit before each, and keep the legacy alias until 009 parity passes.
