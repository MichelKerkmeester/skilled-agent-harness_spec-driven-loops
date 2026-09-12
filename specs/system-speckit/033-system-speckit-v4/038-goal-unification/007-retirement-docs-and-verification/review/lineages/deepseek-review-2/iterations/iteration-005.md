---
iteration: 5
focus: "traceability and completeness — the packet's own fix claims against the shipped code"
dimensions: [traceability, maintainability]
started_at: "2026-09-11T11:17:00Z"
status: complete
---

# Iteration 005 — the packet's own fix claims

## Scope

The target is the packet, not only the code it verifies. This iteration reconciles the claims in `007/goal.md` (log) and `007/implementation-summary.md` against the shipped surfaces for the three P1 fixes that touch a measurement or a report, and against the packet's own success criteria. Surfaces read: `007/goal.md`, `007/implementation-summary.md`, `007/spec.md`, `007/tasks.md`, `002-decisions-and-contract-freeze/decision-record.md`, `goal-core.cjs`, `bin/goal.cjs`.

## Findings

### F106 — P2 — The "set-time budget report" claim holds for a packet bind only; a plain-text objective is still truncated at 4,000 characters with no signal

**Dimension**: traceability | **Bears on**: ADR-006 ("a consumer-side length check at set time"), pass-1 F003

**Evidence** (read at the cited lines):

- The packet's log states "All 5 P1 fixed (fence tolerance, symlink containment, **set-time budget report**, OpenCode reminder, ADR wording)" (`007/goal.md:97`), and the summary says each is "fixed and pinned by a test, or reconciled in the record" (`007/implementation-summary.md:58`). ADR-006's decision still reads "plus a consumer-side length check at set time" (`002-decisions-and-contract-freeze/decision-record.md:559`).
- What was implemented is a *bind-time packet* report on both management surfaces: the CLI prints `packet_budget` plus a `warning=` line when the tier is warn or over (`.opencode/hooks/goal/bin/goal.cjs:162-167`), and the plugin's `bind` prints `packet_budget` (`.opencode/plugins/opencode-goal.js:2974-2977`). That satisfies ADR-006 for the bound path.
- The plain-text path has no check: `setGoal` passes the objective through `sanitizeInlineText(objective, DEFAULT_MAX_OBJECTIVE_CHARS)` (`.opencode/hooks/goal/lib/goal-core.cjs:1114-1121`), and `clampText` truncates with an ellipsis and no signal (`.opencode/hooks/goal/lib/goal-core.cjs:236-243`). The plugin mirrors it (`.opencode/plugins/opencode-goal.js:1756-1760`).
- Reproduction through the shipped CLI: a 5,000-character objective stored as exactly 4,000 characters ending in `...`, with no `warning=` field and no error — the envelope is `STATUS=OK ACTION=set`. The tail, which is where DONE WHEN criteria live (the packet's own goal template says so, `007/goal.md` preamble), is what disappears.
- The pass-1 report raised this as P1 (F003) precisely because ADR-006 promised the check; the fix closed the packet case and left the text case, and no test pins either the report or the truncation.

**Impact**: an operator who sets a long objective over plain text loses its tail silently and the runtime then judges completion against a truncated condition, while the packet records the item as fixed. Bounded to the text path, so P2 rather than a re-raise of the P1.

**Recommendation**: either add the promised check at `set` (warn past the warn tier, name the truncation at the error tier) or amend ADR-006 and the packet log to scope the check to a packet bind. Report only; no fix in this review.

### Claim reconciliation (no finding raised, recorded for the next lineage)

- Fixed and verified in this pass: the runtime frontmatter strip on a tolerant fence (F001), symlink containment (F005), the OpenCode reminder (F010), the ADR-001/ADR-002 pointer-less wording (F002), the changelog's Devin paragraphs (F011), 009 REQ-010's superseding note (F012), and the Cursor hint (F015). Two of them — F102's validator half and F013's root walk — are new or incomplete and are reported above as F102 and F103.
- The packet's completion criteria and SC-003 ("deep review reports no open P0 or P1", `007/goal.md:76`, `007/spec.md:121`) are met by the first lineage's fixes and are not contradicted by this pass: every finding here is P2. The criteria do not cover a second lineage run, so no reconciliation is required.
- Task state: `007/tasks.md` marks T001-T009 `[x]`, including T009 "Reconcile all implementation-summary.md and the parent goal log" and the completion block's "Verification tasks passed with recorded output". The recorded output is the summary table (`007/implementation-summary.md:70-84`), which is the documented evidence surface; no false completion claim found beyond F106's scope.
- Resource Map Coverage Gate: the packet carries no `resource-map.md`, so the gate is skipped per contract; a review-generated map is emitted at synthesis for the next reader.

## Ruled out

- The symlink refusal being absent: ruled out. `resolvePacketDir` refuses real-path escapes (`.opencode/hooks/goal/lib/goal-slice.cjs:155-168`), `readPacketGoal` returns null for them (`:209-213`), and the slice suite pins both the escape and the in-workspace alias (`goal-slice.test.cjs`).
- The set-time report missing on both surfaces: ruled out for the bound path — both `bind` implementations print the tier (`.opencode/hooks/goal/bin/goal.cjs:162-167`, `.opencode/plugins/opencode-goal.js:2974-2977`).
- A pointer-less record contradicting ADR-001/ADR-002 after the fix: ruled out. Both ADRs now carry the plain-text exception (`002-decisions-and-contract-freeze/decision-record.md:69`, `:164`), and a bound record whose document is gone renders nothing (`.opencode/hooks/goal/lib/goal-core.cjs:394-399`).
- Stale Devin claims in tracked requirement rows: ruled out. `specs/hooks/009-goal-isolation/spec.md:150` now carries the superseding note, and the changelog's two Devin paragraphs agree.

## Coverage

| Item | Value |
|---|---|
| Dimensions touched | traceability, maintainability |
| Files reviewed | `007/goal.md:60-100`, `007/implementation-summary.md:50-95`, `007/spec.md:100-125`, `007/tasks.md:35-70`, `002-decisions-and-contract-freeze/decision-record.md:50-75,153-172,334-432,544-628`, `goal-core.cjs:236-243,1114-1121`, `bin/goal.cjs:152-172`, `opencode-goal.js:1756-1764,2974-2977` |
| New findings | 1 (P2) |
| Reproduction fidelity | truncation reproduced through the shipped CLI with a 5,000-character objective; fix claims read against the cited lines |

Review verdict: PASS
