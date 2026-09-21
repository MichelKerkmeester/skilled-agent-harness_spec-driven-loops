# Iteration 010 — The pin holds at the terminal iteration: the run closes frozen

## Focus

Served: the pin sentinel named by iteration 9 as the only non-duplicative action — confirm the changelog sha256 still equals `33abcc9a865e688189ce2a5c…`, and re-derive F-024 only if it differs. No research question remains open; this is the terminal slot (10 of 10, `stopPolicy: max-iterations`). Result: the pin holds byte-for-byte, so the frozen deliverables stand and nothing was re-derived.

## Actions Taken

1. Located the pinned file at its packet path, `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md`. A repo-root probe of `CHANGELOG-v4.0.0.0.md` and a root-path `git log` both return nothing — the file is packet-relative, not root-relative (observation below).
2. `shasum -a 256` on the packet path → `33abcc9a865e688189ce2a5cab458f838fc5a185e3d521aded0bed47b45fcb19`.
3. `git log -1` on the same path → `7076dba64b67d1ae71b920340aedd0a3a1970cf5` (2026-09-21 08:08:20 +0200, `docs(release-notes): rewrite the v4 changelog in the root README voice`).
4. `git status --porcelain` over both pinned files → zero lines; `git rev-parse --short HEAD` → `3ad5ca25fb` (the F-026 README tip).
5. Appended the canonical iteration record through the append gateway. The first attempt was refused — `{"ok":false,"phase":"runtime","reason":"Payload validator rejected the event","code":"RUNTIME_ERROR"}`, exit 1 — because the payload carried `status: "confirmed"`. Retried with `status: "complete"`: accepted, stream sequence 13, `ok:true`, projection refreshed, state-log row `{"iteration":10,"status":"complete","newInfoRatio":0.05}`.
6. Re-synced `research/deltas/iter-010.jsonl` to the accepted record (status `complete`) and recorded the refusal as F-041.

## Findings

### F-040 — Pin sentinel holds at iteration 10; the run closes with everything frozen (P1)

| Check | Value | Matches |
|---|---|---|
| Changelog sha256 | `33abcc9a865e688189ce2a5cab458f838fc5a185e3d521aded0bed47b45fcb19` | F-028 pin exactly |
| Changelog commit | `7076dba64b` (2026-09-21) | unchanged since F-028 |
| README tip | `3ad5ca25fb` (= `HEAD`) | F-026 voice-standard pin |
| Working tree, both files | 0 porcelain lines | clean |

Consequence: F-024's ordered patch list, F-025's candidate outline and order, and F-027's REQ-005 disposition remain valid against the pinned blob; no re-derivation was triggered. The standing rule carries forward unchanged — any implementation pass re-runs the sentinel first, and re-derives F-024 only on a hash mismatch.

### Observation — the pin is packet-relative (P2, operational)

The changelog lives at `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md`. A repo-root `CHANGELOG-v4.0.0.0.md` does not exist, and `git log -- CHANGELOG-v4.0.0.0.md` from the root returns empty silently — an implementer hand-running the sentinel against a root path gets a false negative rather than an error. Recorded so the sentinel's next invocation carries the packet prefix.

### F-041 — The iteration record's `status` is a closed enum, and a non-enum value is refused before commit (P2, mechanism)

`ITERATION_COMPLETION_STATUS_RULE` admits exactly `complete | error | insight | stuck | thought | timeout` (`deep-research-ledger-schema.ts:136–139`). The upcaster passes the legacy record's `status` through verbatim (`legacy-compatibility.ts:387`), so the payload validator rejects anything else at append time. This iteration's first append used `status: "confirmed"` and was refused with `RUNTIME_ERROR` and exit 1; the retry with `status: "complete"` committed as stream sequence 13. Terminal intent — "the run closes frozen" — belongs in `focus`, not in the enum field.

### Terminal state

All five key questions have substantive deliverable answers (delivered in iterations 2–4); the registry will still report `Answered: 0/5` because no iteration-owned write surface can set `resolvedQuestions` (F-036, F-037, F-038). That is runtime telemetry, not research left undone. The run ends at its iteration cap with no open research.

## Ruled Out

- Re-running the sentence-level prose conformance sample (F-016), the per-paragraph ownership map (F-017), or the family-block order tie-break (F-018) — all delivered in iteration 3 and reproducible-identical: both pins are unchanged (F-040), so a re-run would reproduce the same output from the same bytes.
- Re-deriving F-024's ordered patch list — the sentinel holds byte-for-byte; re-derivation against the same blob can only reproduce the frozen list.
- Writing the five answers into the narrative, the canonical record, or the delta stream to force resolution — F-036/F-037/F-038 already map every iteration-owned channel to its exact drop point; only reducer-side inputs move `resolvedQuestions`, and those are outside iteration write authority.

## Dead Ends

- Probing for the changelog at the repo root: the file exists only under the packet directory; a root-path `git log` fails silently with empty output.
- Any further research action on the pinned questions: no consumer can hear an answer an iteration writes (F-036–F-038), so extra narrative, registry, or delta content moves nothing.
- Setting `status` to a descriptive word (`confirmed`) on the canonical iteration record: the completion status is a closed enum and the append is refused before the envelope is committed (F-041).

## Questions Answered

Human-readable closure record (the machine cannot read this section — F-037):

- Q1 (duplication / unneeded content) — delivered iteration 3: F-015 sentence-level duplication table, F-017 per-paragraph ownership map.
- Q2 (stale or over-specific claims) — delivered iterations 2–4: F-008 count dispositions, F-020; the F-024 patch list is the executable form.
- Q3 (audience fit and section order) — delivered iteration 3: F-018 family-block tie-break, F-025 candidate outline and recommended order.
- Q4 (README voice divergence) — delivered iteration 3: F-016 prose conformance sample, pinned to README HEAD by F-026; the pin still holds (F-040).
- Q5 (contract and template requirements, justified departures) — delivered iteration 2: F-012–F-014, F-016, F-020; the departures are recorded as deliberate.

## Questions Remaining

- None open for research. The run's deliverables are complete and frozen against the pinned blob (`33abcc9a865e688189ce2a5c…`). The remaining work is the deferred implementation pass, in order: apply F-024's ordered patch list, then F-025's outline order, then F-027's REQ-005 disposition. Any dispatch before that pass acts only as the pin sentinel: re-confirm the sha256, and re-derive F-024 before applying it if the hash differs.

## Sources Consulted

- `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` — `shasum -a 256`, `git log -1`, `git status --porcelain` (read-only).
- `README.md` — `shasum -a 256`, `git status --porcelain` (read-only); `git rev-parse --short HEAD`.
- `research/deep-research-strategy.md` (read-only) — served focus and the F-039 sentinel definition.
- `research/iterations/iteration-009.md` (read-only) — the F-028/F-026 pin values being re-checked.
- `research/findings-registry.json` (read-only) — F-039 entry and the open-question state.
- `research/deltas/iter-008.jsonl`, `research/deltas/iter-009.jsonl` (read-only) — prior sentinel records for the comparison chain.

## Reflection

- What worked and why: the sentinel is one command against two known pins, and both pins have held across iterations 6–10 because no commit has touched either file since the rewrite baseline — the frozen deliverables never lost a base. The one append refusal was root-caused to the status enum in a single schema read (F-041) and cleared on the first retry.
- What did not work and why: the last four iterations were consumer-map archaeology (F-033, F-036, F-037, F-038), not question work; the served focus kept recycling a delivered direction because the machine's open questions (F-036/F-037) cannot be closed from an iteration-owned write.
- What I would do differently: carry the packet-relative path in the sentinel command from the first iteration, and record the reducer's exact read set (which iteration-owned fields reach it) as an invariant in iteration 1 rather than discovering the drop points channel by channel.

## Recommended Next Focus

None for research. The run terminates frozen at 10 of 10. Implementation pass against the pinned blob: F-024 patch list in order, then F-025 outline order, then F-027 REQ-005 disposition — re-running the sentinel first and re-deriving F-024 only on a hash mismatch. Operator note, separate from the research question: the five questions will end the run unresolved (`Answered: 0/5`) because no iteration-owned surface can set `resolvedQuestions` (F-036, F-037) — that is runtime telemetry to fix, not research left undone.

## SCOPE VIOLATIONS

No researched surface was written. The changelog, README, strategy, prior narratives, registry, and delta files were all read-only; the changelog and README were inspected via `shasum -a 256`, `git log`, `git status --porcelain`, and `git rev-parse`. Writes landed only in `research/iterations/iteration-010.md`, `research/deltas/iter-010.jsonl`, one temp file outside the repository, and the gateway's own ledger refresh.
