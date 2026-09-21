# Iteration 006 — Baseline freeze, the REQ-005 reading, and the close-out audit

Run: `rsr-2026-09-21T08-45-54-679Z` · Mode: research · Iteration 6 of 10

## FOCUS

The prompt pack served the iteration-3 focus (sentence-level prose sample, per-paragraph ownership map) for the second consecutive iteration. Those were delivered as F-016/F-017 and independently validated in F-021/F-022 against the same pinned README content, so re-running them would duplicate evidence and is recorded below as ruled out. The genuinely open handoff gaps at the run's close were:

1. **No pinned implementation baseline.** F-026 pinned the README as the voice standard, but nothing pinned the changelog blob itself. Every F-024 line number and every REQ-005 evidence row is valid only against the blob measured in iterations 1–5; any drift between research close and implementation would silently invalidate the mechanical patch list.
2. **The REQ-005 reconciliation was flagged but never decided.** F-023's note and iteration 4's invariant `inv-iter004-001` say "amend REQ-005 or fail acceptance", while the decision sheet's own structural edits (drop the `After This Draft` H2, collapse `Internal Seams`) make equality impossible. The choice between "the counts are a rewrite-baseline acceptance already met" and "the counts are a standing constraint on subsequent edits" was left open, and it changes what the implementation pass must do.

No implementation; the changelog, README, spec and prior artifacts were read-only.

## ACTIONS TAKEN

1. Re-confirmed the F-026 README pin: `git log -1 -- README.md` → `3ad5ca25fb98916cc8cfa740212dc03800595b21` (2026-09-21, `docs(readme): section 2 heading to all caps`), unchanged; `git status --porcelain` clean for `README.md`.
2. Pinned the changelog blob: `shasum -a 256` → `33abcc9a865e688189ce2a5cab458f838fc5a185e3d521aded0bed47b45fcb19`; 747 lines; `grep -c '^## '` = 18 and `grep -c '^#### '` = 56 at this blob; `git log -1 -- CHANGELOG-v4.0.0.0.md` → `7076dba64b67d1ae71b920340aedd0a3a1970cf5` (2026-09-21 08:08:20, `docs(release-notes): rewrite the v4 changelog in the root README voice`); working tree clean for the file.
3. Read the REQ-005 text at its source (`spec.md:132`) and checked what, if anything, mechanically enforces it: 045 carries no `acceptance-criteria.md` and `tasks.md` has no REQ-005 row, so the criterion is document-level traceability, not a machine check inside this packet.
4. Measured the structural delta the decision sheet forces: `## After This Draft` (L738) is itself an H2 with zero H4 beneath it; dropping it moves the H2 count 18 → 17 while every rename/collapse keeps its H2. The H4/`---`/`&nbsp;` deltas depend on merges whose exact final counts are only knowable during the edit itself.
5. Audited the close: the registry's five key questions are all answered, no question reopened, the ruled-out and saturated records contain nothing this iteration invalidates, and no scope violation occurred.

## FINDINGS

### F-027 — REQ-005 reading resolved: the counts are a rewrite-baseline acceptance, not a standing constraint on later edits (with a recording rule for the implementation pass)

Evidence:

- REQ-005 at `spec.md:132` reads "Structure survives the rewrite | 18 H2, 56 H4, 19 `---` and 44 `&nbsp;` before and after".
- The "rewrite" in that sentence is the packet's own deliverable and it is already committed: `7076dba64b` (`docs(release-notes): rewrite the v4 changelog in the root README voice`). Iteration 4 re-measured the equality exactly at that blob, so the "after" side of REQ-005 is satisfied and evidenced.
- No artifact in 045 mechanically re-checks the counts (`acceptance-criteria.md` absent; no REQ-005 row in `tasks.md`), so REQ-005's "after" is the state the research measured, not a live sensor the implementation must keep green.
- The decision sheet cannot satisfy the equality under the strict reading: dropping one H2 (`After This Draft`) alone moves the count 18 → 17, before any H4 merge is counted.

Disposition — two readings, one recommendation:

- **(A) Recommended.** REQ-005 is a rewrite-phase acceptance, already met at `7076dba64b`. The F-024 patch list is a subsequent edit governed by REQ-003 (no fact changes beyond the enumerated corrections) and REQ-004 (the tree-derived counts). The implementation pass must record the post-change counts in `implementation-summary.md` next to the pinned pre-change baseline (18/56/19/44 at the blob pin below) so the delta is auditable rather than assumed.
- **(B) Rejected.** Treat the equality as a standing invariant over all future edits. That would require either dropping the structural edits — forfeiting the largest wins in the decision sheet — or amending REQ-005's text in the same change. If the packet's reviewer prefers this reading, the amendment is the only coherent option; the edits can never restore 18 H2 while dropping an H2.

This refines `inv-iter004-001` rather than contradicting it: under reading (B) the invariant is correct but forces a spec amendment; under the recommended reading (A) it is superseded by the baseline-plus-record rule. Either way the implementation pass has one explicit line item instead of an unflagged failure mode.

### F-028 — Implementation baseline pinned

The edit target for the deferred implementation is:

| Field | Value |
|---|---|
| File | `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` |
| Blob | sha256 `33abcc9a865e688189ce2a5cab458f838fc5a185e3d521aded0bed47b45fcb19` |
| Commit | `7076dba64b67d1ae71b920340aedd0a3a1970cf5` (2026-09-21 08:08:20) |
| Size | 747 lines; 18 H2 / 56 H4 / 19 `---` / 44 `&nbsp;` |

Every F-024 line number, the F-019 path table, the F-023 count dossier and the REQ-005 "before" figure are valid against this blob and this blob only. F-026 pinned the README for the prose standard; this pins the file the prose fix lands in. Together they make the handoff reproducible: if the blob hash differs at implementation time, the patch list must be re-derived before it is applied.

### F-029 — Close-out audit: nothing open, nothing drifted

- README pin unchanged (`3ad5ca25fb`), changelog blob unchanged since iteration 4's measurement, both clean in the working tree.
- All five key questions answered; F-016–F-026 validated; the outline deliverable exists in its reconciled form (F-025).
- The only remaining work is the deferred implementation pass: F-024's ordered patch list, F-025's outline order, F-027's REQ-005 disposition, executed against the F-028 blob pin.

### Ruled out for the remainder of the run

Re-running the F-016 sentence-level prose sample or the F-017 per-paragraph ownership map against README HEAD. Both were delivered in iteration 3 and independently validated (F-021/F-022) against the same pinned README content; the prompt pack recycled the iteration-3 focus text twice, and re-executing it would add evidence volume without new signal.

## QUESTIONS ANSWERED

Q1–Q5 remain answered; this iteration reopens none and answers none anew. It closes the two handoff gaps named in the focus (pin + REQ-005 reading) and refines the iteration-4 invariant that the decision sheet left ambiguous.

## QUESTIONS REMAINING

None. The one open item is an implementation decision (REQ-005 disposition) that now carries a recommendation and evidence; it is not a research question.

## NEXT FOCUS

None. The run is closed: every question is answered, the decision sheet is validated, the outline is reconciled against pinned standards, and the edit target and its disposition rules are frozen. Any further iteration before implementation would duplicate validated evidence.

## SCOPE VIOLATIONS

None. Writes landed only in `research/iterations/iteration-006.md`, `research/deltas/iter-006.jsonl`, the gateway contract's temp file, and the gateway's own ledger refresh. All researched surfaces (`CHANGELOG-v4.0.0.0.md`, `README.md`, `spec.md`, the registry and prior iteration artifacts, git queries) were read only.
