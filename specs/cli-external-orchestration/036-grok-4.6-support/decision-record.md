---
title: "Decision Record: Grok 4.6 Support for cli-cursor & cli-devin"
description: "Decision record documenting the tier-width choice for adding Grok 4.6 (ADR-001) and the keep-4.5 + alphabetical-sort correction (ADR-002)."
trigger_phrases:
  - "decision"
  - "record"
  - "grok 4.6"
importance_tier: "normal"
contextType: "implementation"
---
# Decision Record: Grok 4.6 Support for cli-cursor & cli-devin

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Adopt the full Grok 4.6 family, including the new xhigh tier

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-12 |
| **Deciders** | Operator (Michel Kerkmeester), via AskUserQuestion |

---

### Context

Live checks against both `cursor-agent --list-models` and `devin models list` showed Grok 4.6 isn't a straight rename of Grok 4.5 — it ships a fourth reasoning tier, `xhigh`, that 4.5 never had. Cursor's 4.5 family was 6 ids (low/medium/high, each with a `-fast` sibling); 4.6 is 8 ids (adds xhigh × fast). Devin's 4.5 family was 3 uids; 4.6 is 4 (adds xhigh). Both allowlists are hard-enforced safety gates — anything not listed is rejected before a command is built — so widening them is a real scope decision, not a mechanical find-and-replace.

### Constraints

- The user's literal instruction was "replace all mention of Grok 4.5 with the new Grok 4.6," which reads as a like-for-like swap and doesn't by itself resolve whether to widen the allowlist for a tier that didn't exist under 4.5.
- Every new id had to be live-dispatch-verified before landing in either allowlist — no id could be added on the strength of the vendor's model-list output alone.

### Decision

**We chose**: Adopt the full Grok 4.6 family on both platforms, including `xhigh`/`xhigh-fast` — 8 ids on Cursor, 4 uids on Devin — rather than a 4.5-parity subset that would have dropped the new tier.

**How it works**: `CURSOR_SUPPORTED_MODELS` and `DEVIN_SUPPORTED_MODELS` (plus their `fanout-run.cjs` mirrors) list every 4.6 tier. Every one of the 8+4 ids was confirmed present in the live `--list-models`/`models list` output, and the high and xhigh tiers on both platforms were dispatch-tested end to end (`cursor-agent -p --model cursor-grok-4.6-xhigh`, `devin -p --model grok-4-6-xhigh`) before the addition was made. (Whether 4.6 replaces or joins 4.5 in the allowlist is a separate question — see ADR-002.)

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Full 4.6 adoption (chosen)** | Matches the vendor's actual current family; gives callers the new max-reasoning tier immediately; no follow-up packet needed when someone asks for xhigh | Widens the Grok 4.6 slice of the allowlist by 2 ids (Cursor) / 1 uid (Devin) beyond a literal 1:1 tier match to 4.5 | 9/10 |
| 4.5-parity subset (drop xhigh) | Smallest possible diff; most literal reading of "replace 4.5 with 4.6" | Silently withholds a tier the vendor already ships; would need a second packet the moment anyone wants xhigh; doesn't match how the docs already treat "known-available" tiers (they get listed, not hidden) | 5/10 |

**Why this one**: I surfaced the tier-count mismatch to the operator rather than picking silently, and the operator chose full adoption on the explicit condition that the exact levels and modes be checked live first — which the verification pass in Phase 1 did before any allowlist changed.

---

### Consequences

**What improves**:
- Callers get access to Grok 4.6's full reasoning range (low through xhigh) on both platforms, not an artificially truncated one.
- The allowlist stays a faithful mirror of what the vendor actually ships, matching the documented intent of `providers-and-models.md` as a "curated subset of the real roster," not a stale snapshot.

**What it costs**:
- The enforced allowlist grows by 2 ids on Cursor (10→12) and 1 uid on Devin (curated Grok family 3→4). Mitigation: every doc that states an exact count was updated to match, and the vitest coverage pins the new counts so a future drift is caught immediately.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| xhigh proves to be a low-value/high-cost tier operators never use | L | No removal cost beyond deleting 2 lines from each allowlist array and its mirror if that turns out to be true |
| A future Grok 4.7 repeats this pattern (new tier again) | L | This ADR documents the precedent: check the live roster's exact shape before assuming a version bump is a same-width rename |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator explicitly asked to check actual available levels/modes before deciding — this was live-verified, not assumed |
| 2 | **Beyond Local Maxima?** | PASS | Two alternatives (full adoption vs. parity subset) were explicitly scored and presented before either was implemented |
| 3 | **Sufficient?** | PASS | No third option (e.g., partial xhigh support, xhigh behind a flag) was warranted — the vendor ships it as a normal tier, not an experimental one |
| 4 | **Fits Goal?** | PASS | Directly serves the user's stated goal: "replace Grok 4.5 with Grok 4.6" and "test if we can call 4.6 through them" |
| 5 | **Open Horizons?** | PASS | Sets a documented precedent (this ADR) for how future model-version bumps in this repo should check tier width rather than assume parity |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `executor-config.ts` / `fanout-run.cjs` — both allowlists and mirrors carry all 8 (Cursor) + 4 (Devin) 4.6 ids, alongside the existing 6 (Cursor) + 3 (Devin) 4.5 ids (see ADR-002 for the keep-4.5 decision).
- Every skill doc's Grok tier/allowlist counts updated to match (see ADR-002 for the final counts, which reflect both versions).

**How to roll back**: Remove the `xhigh`/`xhigh-fast` entries from both allowlist arrays and their mirrors (4 lines total: 2 in `executor-config.ts`, 2 in `fanout-run.cjs`), update the corresponding vitest fixtures, and revert the Grok 4.6 tier count in the docs from 8 back to 6 ids on Cursor and from 4 back to 3 uids on Devin. Whether 4.5 stays in the allowlist at all is a separate question, resolved in ADR-002.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Keep Grok 4.5 alongside Grok 4.6, and sort every touched roster alphabetically

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-12 |
| **Deciders** | Operator (Michel Kerkmeester), direct follow-up messages |

---

### Context

The first implementation pass read the user's original instruction — "replace all mention of Grok 4.5 with the new Grok 4.6" — as a retire-and-replace swap: Grok 4.5 was removed from both enforced allowlists (`CURSOR_SUPPORTED_MODELS`, `DEVIN_SUPPORTED_MODELS`) and every doc, test, and changelog was written to describe 4.6 as 4.5's replacement. That pass was fully verified (live dispatch tests, green test suite, spec folder authored) and reported to the operator as complete.

The operator then sent a direct follow-up: "make sure grok 4.5 is also still in the roster btw," immediately followed by "and sort the models alphabetically in any table or roster layout in the files." Both messages arrived after the first pass was reported done, making this a genuine correction to a shipped-in-session decision, not a continuation of open work.

### Constraints

- Nothing from this packet had been committed yet, so correcting the allowlists, docs, tests, and changelog entries in place — rather than layering a second changelog entry describing a re-reversal — was possible without misrepresenting any already-shipped history.
- Grok 4.5 had to be re-verified live (not just restored from memory of the earlier verification pass), since the whole point of this packet's methodology is that "listed" and "confirmed callable" are not the same claim.
- The alphabetization instruction was scoped ("in any table or roster layout in the files") — applied to the files this packet already touches, not repo-wide.

### Decision

**We chose**: Restore Grok 4.5 to both enforced allowlists alongside Grok 4.6 (Cursor: 10 → 18 ids; Devin's curated Grok family: 3 → 7 uids), independently re-verify every 4.5 id/uid via live dispatch, and re-sort every roster table, enumerated model list, and allowlist array this packet touches into alphabetical order.

**How it works**: `CURSOR_SUPPORTED_MODELS`/`CURSOR_ALLOWED_MODELS` and `DEVIN_SUPPORTED_MODELS`/`DEVIN_ALLOWED_MODELS` now list both Grok families side by side, sorted alphabetically by id rather than grouped by family (the per-family inline comments that no longer align with contiguous blocks were consolidated into the top-level doc comment above each array). Every skill doc's family enumerations, tables, and counts were rewritten from "Grok 4.6" (implying a version swap) to "Grok 4.5 and 4.6" or an alphabetized two-row table, and the two changelog entries — still uncommitted from the first pass — were rewritten in place to describe an addition rather than a swap.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep both versions, alphabetize (chosen)** | Matches explicit operator instruction; no workflow pinned to `cursor-grok-4.5-*`/`grok-4-5-*` breaks; alphabetical order is a stable, predictable convention for a list that will keep growing (4.7, 4.8, ...) | Allowlist is now noticeably wider (18 Cursor ids, 19 Devin ids total) than a single-version curation | 10/10 |
| Retire 4.5, adopt 4.6 only (original, corrected) | Smaller allowlist; matches a literal first reading of "replace 4.5 with 4.6" | Directly contradicted by explicit operator follow-up; breaks any caller still naming `cursor-grok-4.5-*`/`grok-4-5-*` | 2/10 (rejected after correction) |

**Why this one**: The operator gave an explicit, unambiguous instruction after seeing the first pass's result. There was no interpretive gap to resolve — this is a direct correction, not a judgment call between comparably-reasonable options.

---

### Consequences

**What improves**:
- No caller with an existing workflow naming `cursor-grok-4.5-*` or `grok-4-5-*` breaks when this packet lands.
- Roster tables and arrays are now in a predictable, stable order (alphabetical) instead of an order that depended on which model was added most recently — this reduces future merge/diff noise when a Grok 4.7 or similar eventually lands.

**What it costs**:
- The enforced allowlist is wider than the originally-scoped 12-id (Cursor) / curated-4-uid (Devin) version — 18 ids and 19 ids respectively. Mitigation: every doc that states an exact count was updated to match, and the vitest coverage pins the new counts so a future drift is caught immediately.
- The family-grouped inline comments in `executor-config.ts` and `fanout-run.cjs` (e.g. "// GLM-5.2 uids...") no longer align with contiguous array blocks once alphabetized. Mitigation: consolidated the per-family explanation into the top-level doc comment above each array instead of scattering now-misaligned inline comments.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future contributor re-adds a model out of alphabetical order, silently reintroducing family grouping | L | The updated doc comments explicitly state "sorted alphabetically, not grouped by family" as a standing convention |
| Widened allowlist increases the surface a future model-deprecation cleanup has to consider | L | Both allowlists now carry an explicit per-family "confirmed live" migration note with a date, giving a future cleanup pass a clear trail |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Direct operator correction — not implementing it would leave a known-wrong state in place |
| 2 | **Beyond Local Maxima?** | PASS | The rejected alternative (retire-and-replace) was the actual first-pass implementation, scored and explicitly compared against the corrected one |
| 3 | **Sufficient?** | PASS | No partial option (e.g., keep 4.5 but skip re-verifying it, or alphabetize only the code and not the docs) was considered acceptable given this packet's live-verification and consistency standards |
| 4 | **Fits Goal?** | PASS | Directly implements the operator's own words, both messages |
| 5 | **Open Horizons?** | PASS | Alphabetical ordering is the more maintainable long-term convention as more Grok (or other) versions are added over time |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `executor-config.ts` / `fanout-run.cjs` — both allowlists and mirrors restore all 6 (Cursor) / 3 (Devin) Grok 4.5 entries alongside the Grok 4.6 additions from ADR-001, all sorted alphabetically.
- Every skill doc's family/tier/allowlist-count language updated from "4.6 only" phrasing back to "4.5 and 4.6," with roster tables resorted alphabetically.
- Both `changelog/v1.3.0.0.md` entries (still uncommitted) rewritten in place to describe an addition, not a swap.
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` in this packet updated to reflect the corrected final scope.

**How to roll back**: Remove the 6 `cursor-grok-4.5-*` ids and 3 `grok-4-5-*` uids from both allowlists and their mirrors, update the vitest fixtures accordingly, and revert the doc language and roster ordering to the ADR-001 state (Grok 4.6 only, family-grouped tables). Not recommended — this would directly contradict the operator's explicit instruction that produced this ADR.
<!-- /ANCHOR:adr-002 -->

---

<!--
Level 3 Decision Record (Addendum): Two ADRs — tier width (ADR-001) and the keep-4.5 + alphabetize correction (ADR-002).
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
