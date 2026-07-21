---
title: "Spec: Deep Review of the sk-design Remediation Program (Packets A/B/C)"
description: "Independent multi-iteration GPT-5.6-SOL review of the three implementation packets shipped this session (interface-command rewrite, styles library restructure, persistent DB activation) plus the packet-doc reconciliations, read at pinned worktree HEAD 7b9d3b6b71. Read-only; the default DB read path stays legacy."
trigger_phrases:
  - "sk-design remediation program review"
  - "packet A B C deep review session shipped"
  - "styles restructure db activation command rewrite review"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/017-remediation-program-review"
    last_updated_at: "2026-07-21T16:00:35Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored review scope; pinned 118-file manifest at HEAD 7b9d3b6b71."
    next_safe_action: "Run the 10-iteration GPT-5.6-SOL review loop over the manifest."
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/017-remediation-program-review/goal-file-manifest.txt"
      - ".opencode/specs/sk-design/017-remediation-program-review/review/fanout-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-017-remediation-review-session"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: Deep Review of the sk-design Remediation Program (Packets A/B/C)

<!-- ANCHOR:purpose -->
## Purpose

Independent, multi-iteration review of the three implementation packets shipped this session under the
sk-design **styles-library + `/interface:*` remediation program**, to confirm correctness, security,
scope-discipline, and completion-honesty before the work is relied upon. This review is **READ-ONLY**;
it applies no remediation and does not flip any default. The persistent-DB default read path stays
`legacy`.
<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:review-target -->
## Review Target

- **What:** the curated changed-file surface of three implementation packets, read at the **pinned**
  worktree `HEAD 7b9d3b6b71` (this session's tip, already on `origin/skilled/v4.0.0.0`).
- **Scope files:** the **118-entry `goal-file-manifest.txt`** in this packet — the meaningful
  code / doc / config / test surface only.
- **Explicitly OUT of scope (do not deep-review):**
  - the **7,741 mechanically-moved bundle data files** under `styles/library/bundles/**` — verify the
    **byte-parity claim** (that the move preserved content), never their contents;
  - **76 concurrent `system-deep-loop` / `036-*` commits** interleaved in the raw commit range — they
    are a different session's work.
- **How to inspect the introduced change:** `git show <sha> -- <path>` and
  `git diff 5772e0bfd3..7b9d3b6b71 -- <path>`. The manifest is the file scope; this spec is the WHY.
<!-- /ANCHOR:review-target -->

---

<!-- ANCHOR:what-to-inspect -->
## What Shipped — and What to Verify (per packet)

### Packet C — `012/008-interface-command-rewrite` (commit `d0e838c73c`)

Rewrote the five `/interface:*` command bodies (`design`, `foundations`, `motion`, `audit`,
`design-reference`) into **literal, self-contained design prompts**, each with **exactly ONE** `@`-include
of `shared/creation-contract.md`. The presentation `.txt` was demoted from prompt-source-of-truth to
consolidated-question / display fixtures; the YAML role is unchanged; `command-metadata.json` should
mirror the new split.

Verify: (1) exactly one `@`-include per body; (2) **no command-owned taste** (no palette / font / timing
recipes or severity tables in any body — taste stays in the design mode); (3) the four authorities
(wrapper `.md` / presentation `.txt` / YAML / `command-metadata.json`) are mutually consistent — flag any
that still assert the old router/presentation-authoritative contract; (4) `audit` is read-only and
`design-reference` is the only mutating command; (5) the four added tests (19/19 total) assert these
invariants rather than passing vacuously. **Note:** `creation-contract.md` and `command-metadata.json`
are UNCHANGED in the diff — confirm that is correct (include-not-edit) rather than a missed reconciliation.

### Packet B — `015/005-library-restructure` (commits `02481e1ec3` G1, `b8732ba436` G2, `cee62570e4` G3)

Added `lib/paths.mjs` (the path seam); moved the 17 styles modules into `lib/engine` + `lib/database`;
moved 1,290 bundles + 2 manifests into `library/`; rewired the four design-mode corpus consumers and the
md-generator backend.

Verify: (1) all **17 modules preserved 1:1** — only path indirection changed, no logic drift (trace the
facade `style-library.mjs`, the `persistent-adapter.mjs`, and `schema.mjs` old→new); (2) `paths.mjs` is the
**single** source of path truth — no hardcoded old `_engine` / `_db` / old-manifest paths survive anywhere
(including the md-generator backend and corpus consumers); (3) the two manifest moves are **byte-identical**;
(4) **no compat aliases** were introduced; (5) the `style-library.mjs` retrieval-manifest fix (the three
fallbacks now resolve `RETRIEVAL_MANIFEST_PATH`) genuinely resolves the `path-escape` regression rather than
masking it; (6) the styles test ladder (89/89) + the four mode suites are green with no skipped/masked cases.

### Packet A — `015/006-persistent-db-activation` (commit `c4bfba4359`) + md-gen fix (`3cd7d67fb8`)

Built + published the first full-corpus DB generation (1,290 styles, 69.75 MB) into git-ignored
`database/`; wired `operator.mjs {build,status,cutover,rollback}`; `SK_DESIGN_STYLE_DB_MODE` default
`legacy`; shadow parity 10/10; §9 perf measured ~21×. The single code change:
`schema.mjs DEFAULT_STYLE_DATABASE_PATH` → `DATABASE_ROOT`.

Verify: (1) **no binary committed** — `database/` git-ignored, `git check-ignore` on `*.sqlite`, `git
status` shows no generation; (2) the default read path genuinely stays `legacy` on a clean checkout, with
**no lazy query-time build**; (3) the **shadow-parity claim** (`compareQueryResults` 10/10) is
independently reproducible, not merely asserted in docs; (4) the **perf claim** (p95 1150→53 ms)
methodology is sound and not cherry-picked; (5) the `schema.mjs` default-path fix is correct and the stray
source-dir `.sqlite` was fully removed; (6) **fail-closed** behavior when the generation is absent
(`generation-unavailable`).

### Cross-cutting — packet-doc honesty (commits `61a62a0c40`, `7b9d3b6b71`)

Verify the reconciled completion metadata (`001-foundation`, `005`, `006`, and the `015` parent) matches
shipped reality: **no packet still claims "planned / not-implemented" for shipped work** (the exact class
of finding a sibling review caught this session), **and no completion claim is overstated** — HUMAN-GATED
items (the cutover, the §9 relevance judgments, the full scenario matrix) must NOT be marked done.
<!-- /ANCHOR:what-to-inspect -->

---

<!-- ANCHOR:requirements -->
## Requirements

- **REQ-001 (correctness):** no logic regression from the module moves; the 17 modules behave identically
  — evidence: trace ≥3 modules old→new including the facade + adapter + schema.
- **REQ-002 (security / scope):** no binary committed; `database/` git-ignored; every change confined to
  its packet's claimed scope; no stray edits (scope-discipline is a priority because the build phase used
  `--dangerously-skip-permissions` dispatches).
- **REQ-003 (parity):** the shadow-parity and manifest byte-parity claims are independently verifiable,
  not only asserted in the packet docs.
- **REQ-004 (completion-honesty):** packet docs match shipped reality; HUMAN-GATED items are not marked
  complete; no overstated verification evidence.
- **REQ-005 (test integrity):** the reported test counts (19/19 commands, 89/89 styles, 69/69 DB) reflect
  real assertions — no skipped, vacuous, or always-green tests masking gaps.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:acceptance -->
## Acceptance Scenarios

- **Given** the module moves, **when** a reviewer diffs old→new for the facade + adapter + schema,
  **then** only path indirection changed (no behavioral drift).
- **Given** the DB activation, **when** a reviewer checks git-ignore + the default mode, **then** a clean
  checkout resolves `legacy` and no `.sqlite` is tracked.
- **Given** the command rewrite, **when** a reviewer greps each body, **then** exactly one `@`-include and
  zero taste-tables are present, and the four authorities agree.
- **Given** the reconciled docs, **when** a reviewer cross-checks status vs the shipped commits, **then**
  no doc claims shipped work is unbuilt and no HUMAN-GATED item is marked done.
<!-- /ANCHOR:acceptance -->

---

<!-- ANCHOR:out-of-scope -->
## Out of Scope

- The operator-gated DB **cutover** (flip to `persistent`) and its §9 human relevance judgments — these
  are deliberately deferred; **do not** flag "the default is `legacy`" as a defect.
- **Checkpoint B** (manifest v2 schema + shared projector, then removing `retrieval-manifest.json`) —
  intentionally deferred.
- The 1,290 bundle **data-file contents** (byte-parity only) and all concurrent `system-deep-loop` /
  `036-*` work.
<!-- /ANCHOR:out-of-scope -->

---

<!-- ANCHOR:source -->
## Source

- **Range:** `5772e0bfd3..7b9d3b6b71` on `skilled/v4.0.0.0`, read at pinned worktree `HEAD 7b9d3b6b71`.
- **Key commits:** `d0e838c73c` (C); `02481e1ec3`, `b8732ba436`, `cee62570e4` (B); `c4bfba4359`,
  `3cd7d67fb8` (A); `61a62a0c40`, `7b9d3b6b71` (doc reconcile).
- **Executor for this review:** cli-opencode `openai/gpt-5.6-sol` (normal speed), high effort, 10 forced
  iterations (`stop-policy max-iterations`), single lineage.
<!-- /ANCHOR:source -->
