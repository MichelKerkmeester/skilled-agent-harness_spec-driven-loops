---
title: "Goal: Phase 2: routing-doctrine-and-discovery"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/011-routing-doctrine-and-discovery"
    last_updated_at: "2026-09-16T01:24:32Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: routing-doctrine-and-discovery

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every hub states one always-loaded routing policy in the artifact the runtime
reads, and the deep-loop hub's discovery vocabulary names only the families it can serve.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The adjudication is settled by what the compiled runtime enforces, not by which document reads better. The JSON field is the zero-signal fallback and `ROUTER.md`'s is the always-loaded preamble; they are two concepts, and each hub's JSON now says so. |
| D2 | A hub that legitimately has no preamble is left declaring none. `sk-design` is that case, not a disagreement. |
| D3 | No gate comparing the two artifacts is built; the absence is recorded instead. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the durable
slice of this file in chat, frontmatter excluded, so the operator can update
their copy. Keep reminding while it stays unset; never stop work for it. A
child goal change that alters a parent decision or criterion is an amendment
to the parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Each checkable without opening another file. Copy them into the objective: nothing
dereferences a path, so criteria left only here are invisible to whatever judges
completion.

- [x] `node .opencode/bin/compiled-route-guard.cjs` exits 0 with all five hubs fresh and both manifest copies byte-identical
- [x] `ci-skill-root-metadata.cjs` reports checked 13, passed 13, failed 0
- [x] No retired family remains in the deep-loop keyword block or discovery terms
- [x] The runtime suite exits zero: 154 files, 2678 passed, 8 skipped, no failure to attribute
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Item | State | Evidence |
|------|-------|----------|
| Live-policy enforcement measured | Done | No `defaultResource` key in any of the five hubs' loaded policies; schema is `additionalProperties: false` |
| Four hubs declare fallback-only | Done | `system-deep-loop`, `sk-code`, `sk-doc`, `cli-external-orchestration` `hub-router.json` |
| Retired families pruned | Done | Six terms out of `SKILL.md:8`, two out of `graph-metadata.json` derived terms |
| Manifests re-minted | Done | Guard exit 0, five hubs fresh |

### Deviations and findings

| Item | Note |
|------|------|
| [What diverged from the directive] | [Why, and what was done instead] |
| **The working tree is coherent; HEAD is not.** A concurrent process committed this packet's re-minted manifests without the source edits they were minted from | Commit `bdf6ccfbde` staged only `manifest.json` files. The pre-commit `gate:route-remint` decides with a pathspec over staged `SKILL.md`/`hub-router.json`/`mode-registry.json` first, so a commit staging manifests alone does not trigger it, and the pre-push `gate:compiled-routing` reads the working tree rather than the commit being pushed. Observed in a clean HEAD worktree: `compiled-route-guard.cjs` exits 1 with four `stale-manifest`, and `compiled-route.cjs` returns `servingAuthority: legacy` for four of five hubs. My uncommitted sources compile to exactly the committed hashes, so committing them restores coherence. |
| The brief proposed correcting the JSON to match `ROUTER.md` and asked me to check the enforcement first | The enforcement trace answers it the other way. The field is absent from every compiled policy and the schema forbids it, so neither statement runs; but each hub's `SKILL.md` route loop consumes the JSON field's *concept* as its zero-signal fallback. The JSON keeps the path list and gains a semantics key naming the preamble as a separate concept. |
| `read-only-default`, `context-gathering` and `reuse-catalog` are not provably retired | They appear in no registry, no command metadata, no router vocabulary, and no live surface anywhere in the hub, and the commit that introduced them predates the roster they would have belonged to. Removed as dead vocabulary rather than as a confirmed retirement. |
| `sk-code`'s "alignment verifier workflow" was a candidate residue term | It resolves: `alignment verifier` is a live alias of `sk-code-quality` and its script exists on disk. Left alone. |
| The first suite run failed four tests, none routing-related | The `SKILL.md` keyword edit staled the recorded source digest in three generated command contracts. Recompiling them cleared all four; both test files then passed 40/40. |
<!-- /ANCHOR:log -->
