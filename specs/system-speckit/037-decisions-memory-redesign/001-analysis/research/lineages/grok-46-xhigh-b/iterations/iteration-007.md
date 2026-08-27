# Iteration 7: Freshness, decay, and supersession

## Focus
Angle (e): how today's three systems age information, and what a more-active decisions store needs (decay + supersession) without an MCP round-trip.

## Actions Taken
- Re-read `importance-tiers.ts` decay flags; `learned-feedback.ts` 30-day TTL; constitutional `last_confirmed` frontmatter; FSRS decay SQL in `vector-index-queries.ts`.
- Compared to Claude MEMORY.md clip and Cursor git-tracked rules (no decay).
- Noted deep-research ledger already has `claim_superseded` (not reusable as product decisions, but a pattern).

## Findings

### F-B7.1 Today's aging model is inverted relative to "active decisions"
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/scoring/importance-tiers.ts:33-70]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/learned-feedback.ts:11-16,92-96]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-queries.ts:424-434]
[SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:4-6]
[SOURCE: https://code.claude.com/docs/en/memory.md]

| Store | Decay | Supersession | Freshness signal |
| --- | --- | --- | --- |
| Constitutional tier | `decay: false`, `autoExpireDays: null` | None (edit or delete the file) | Optional `last_confirmed` / `last_confirmed_source` frontmatter (human) |
| Normal spec memories | `decay: true`; FSRS or 90-day half-life SQL when `useDecay` | None at doc level | `updated_at` / FSRS `stability` |
| Learned triggers | Hard 30-day TTL | Expire/clear tools | `learned_feedback_audit` |
| Spec ADRs | None | New ADR; old ADR remains unless edited | Packet dates; no global "this ADR is obsolete" index |
| Root AGENTS.md / Cursor alwaysApply | None (git) | Edit the file | Git history |
| Claude auto MEMORY.md | Clip to 200 lines/25KB at load; rest not loaded | Move detail to topic files | Recency by file organization |

The "always-surface" tier is the **least** able to forget. That is correct for Iron Laws and wrong for product decisions that change. Learned-triggers can forget but are not a log. ADRs accumulate without a supersession index — 1462 headings (iter 4) with no global "still in force" bit.

### F-B7.2 Replacement needs two clocks, not one decay flag
[SOURCE: https://cursor.com/docs/context/rules] (git-tracked, no TTL)
[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts:218-224] (`ClaimSupersededData` shape)

**Standing rules** (native-memory ban, comment hygiene): no decay; supersede by editing the always-on digest / AGENTS.md; git is the audit log. Matches Cursor/CC.

**Dated decisions** (ADR-class): no automatic TTL (decisions should not evaporate); require **explicit supersession**: successor ADR id + `supersedes: ADR-NNN` in the new ADR (template already has ADR-NNN ids — Workstream A said those ids are untouchable). Global digest lists only **in-force standing** + **recent dated** entries; superseded IDs drop off the digest but remain in the packet `decision-record.md`.

Do **not** reuse FSRS / `decay: true` for decisions — that would hide still-binding ADRs because they were not retrieved recently. Do **not** reuse constitutional `decay: false` for the whole digest if the digest mixes standing rules with a recency window; split sections: `## Standing` vs `## Recent (rolling N)`.

### F-B7.3 `last_confirmed` is a stale-doc pattern worth stealing, not a DB tier
Comment-hygiene carries `last_confirmed: 2026-06-05` and `last_confirmed_source: git-log-last-touch`. That is a documentation freshness hint. A digest can require `last_reviewed` on standing entries and a CI grep that flags reviews older than N days — still git-tracked, no MCP. Cheaper than `alwaysSurface` SQL.

External analogue: RFCs are superseded by later RFCs (explicit), not decayed; Cursor rules stay until edited (git). Prompt-engineering literature's "always-on context must stay small" (iter 2 vendor caps) is the constraint that forces the rolling Recent section.

## Questions Answered
Q-B5 answered: standing = no decay + git supersession; dated ADRs = explicit supersession, remain in packet docs; digest drops superseded/old dated items; never FSRS-decay a binding decision.

## Ruled Out
- Applying `IMPORTANCE_TIERS.normal.decay` to the decisions digest.
- 30-day TTL on standing rules (learned-triggers pattern).
- Silent overwrite of old ADRs (breaks packet history / shipped-packet text).

## Assessment
- newInfoRatio: 0.48
- noveltyJustification: Inversion (constitutional never forgets, ADRs never supersede globally) plus a two-section digest design; `last_confirmed` reuse is new to this packet.
- confidence: high.

## Recommended Next Focus
Angle (f): advisor brief should read the new store vs remaining hardcoded `render.ts`.
