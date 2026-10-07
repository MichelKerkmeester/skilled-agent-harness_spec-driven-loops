---
title: "Acceptance Criteria: Phase 3: status-contract-and-docs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "status contract and docs acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/003-status-contract-and-docs"
    last_updated_at: "2026-10-03T05:27:38Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-status-contract-and-docs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: status-contract-and-docs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skill-advisor/033-advisor-status-truthfulness/003-status-contract-and-docs
**Level:** 3
**Status:** Complete
**Date:** 2026-10-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an operator reading a mutating command's catalog page, When they run it untrusted and hit the refusal, Then the page already stated `--trusted`, the environment alternative and the exit-64 refusal | `rg -n -- "--trusted" .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-rebuild.md .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-graph-scan.md`; live `node .skilled/bin/skill-advisor.cjs skill_graph_scan --format json` shows the refusal it documents. Met: both pages state `--trusted`, the env alternative and the exit-64 message; live `skill_graph_scan` and `advisor_rebuild` refuse with exactly that message and exit 64 (`scratch/trusted-refusal.log`) | Met | - |
| AC-002 | REQ-002 | Given the scorer reference after the edit, When read against a fresh re-measure, Then every `explicit.ts` citation resolves to the named code and every example names a value present in the current map | `rg -n "TOKEN_BOOSTS" <explicit.ts>`, `rg -n "PHRASE_BOOSTS" <explicit.ts>` and `rg -n "review-plus-write-disambiguation" <explicit.ts>` (explicit.ts is `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`) compared line by line with `references/scoring/advisor-scorer.md:91,93`. Met: re-measure gives TOKEN_BOOSTS 27-107, PHRASE_BOOSTS 115-246, disambiguation 313-322 (push 321); the reference cites exactly those, examples match the map, the stale-citation grep returns no match (`scratch/reference-check.md`) | Met | - |
| AC-003 | REQ-003 | Given a phrase-boost value outside the declared bound, When the check runs, Then it fails naming the interval, and the interval is declared beside the map and consistent with the doctor's `[-1.0, 2.0]` | `npm test -- tests/command-bridge-resolution-guard.vitest.ts` from `.skilled/skills/system-skill-advisor/runtime` (the suite that already reads `PHRASE_BOOSTS`); `rg -n "PHRASE_BOOST_BOUND" runtime/lib/scorer/lanes/explicit.ts`; `rg -n "phrase_boost_range" .skilled/commands/doctor/assets/doctor-skill-advisor.yaml`. Met: `PHRASE_BOOST_BOUND = { min: -1.0, max: 2.0 }` at explicit.ts:113; guard suite 8/8 pass, the bound test fails with `PHRASE_BOOSTS values must lie in [-1.0, 2.0]` on any out-of-range amount and a second test pins the doctor `phrase_boost_range: "[-1.0, 2.0]"` | Met | - |
| AC-004 | REQ-004 | Given the routing-phrase reader inventory, When the decision is recorded, Then the readers and skills align with it and the decision names the reader inventory commands and the source of truth | `rg -n "trigger_phrases" .skilled/skills/system-skill-advisor/runtime .skilled/skills/sk-doc --glob '*.ts' --glob '*.cjs' --glob '*.py'`; the decision text in `SKILL.md` and `scratch/phrase-readers.md`. Met: inventory in `scratch/phrase-readers.md` finds no runtime reader of SKILL.md frontmatter routing phrases; decision recorded in `SKILL.md` section 3; no reader or frontmatter change needed | Met | - |
| AC-005 | REQ-005 | Given a live advisor with the health option declared, When `advisor_status` is called with it, Then it returns the embedding provider resolution and the model-server state, reports an explicit unavailable state when the server is down, and a plain call without the option is byte-identical to before | `node .skilled/bin/skill-advisor.cjs advisor_status --json "{\"workspaceRoot\":\"$PWD\",\"includeEmbeddingsHealth\":true}" --format json --warm-only` with the server up and down; `npm test -- tests/handlers/advisor-status.vitest.ts`; `npm test -- tests/cli-exit-taxonomy.vitest.ts`. Met: live call with the server up returns provider `resolved` and modelServer `reachable`/`ready`; absent socket returns `unavailable`/`unreachable` and the call succeeds; plain call carries no `embeddingsHealth` key; advisor-status, embeddings-health and cli-exit-taxonomy suites 29/29 pass (`scratch/verification.md`) | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All five criteria are Met with the evidence named in each row, including both the reachable and the unavailable health states; no waiver was needed.
<!-- /ANCHOR:closure -->
