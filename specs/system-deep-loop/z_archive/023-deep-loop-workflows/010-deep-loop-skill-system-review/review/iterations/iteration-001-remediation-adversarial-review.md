# Iteration 001 — Wave 1: adversarial review of the remediation + B1 (post-commit `001ec9c8c8`)

Three claude2-opus read-only seats reviewed the work shipped in `001ec9c8c8` (sk-doc dissection, the 152-merge dead-path sweep, and the B1 council-graph probe + 009 reconciliation). Result: **0 P0, 0 P1, 3 P2** — the bulk verified clean (content fidelity, anchor repoints, repoint targets, 6/18 gate honesty, council smokes all independently reproduced by the seats). All three P2s remediated in this session.

## Findings + disposition

- **B1-1 [P2, UPHELD → FIXED]** `doctor_deep-loop.yaml`: the invariant prose + phase_2 council recommendation were extended to ai-council artifacts, but `staleness_signals.empty_graph` detection and the `lazy_init.available` formula stayed keyed on `iteration_folder_count` only → the empty-council-graph case had no detection support. **Fix:** broadened `empty_graph` detection to "iteration folders or ai-council artifacts", added `ai_council_artifact_count` to phase_0 outputs, and extended the lazy_init formula to `(iteration_folder_count > 0 or ai_council_artifact_count > 0)`. YAML re-parses clean.

- **W1-1 [P2, PARTIAL — by-necessity]** `skill_creation/common_pitfalls.md`: the dissection's `\##` backslash-escaped example headings add a literal `\` and the note's rationale was imprecise. **Investigated the root cause** (the validator's fence-blind H2-numbering regex) and attempted the seat's preferred fix (make `validate_document.py` skip fenced blocks) — but that **regressed**: `install_guide_creation.md` (and the pattern generally) deliberately numbers its *real* sections *around* fenced example sections, so fence-blindness is load-bearing. **Reverted the validator** (no behaviour change) and **kept the backslash workaround**; corrected the note to state the real reason + a "drop the `\` when copying" instruction. The spurious-`\` is an accepted artifact of the deliberately fence-blind validator. (Pre-existing, out-of-scope: `install_guide_creation.md` is mistyped as an actual install guide by its filename stem and is INVALID under the unmodified validator — flagged, not fixed here.)

- **w1-001 [P2, UPHELD → FIXED]** `152/009 implementation-summary.md`: the "Twelve P0 gates remain" prose enumerated only 11 IDs (CHK-066 omitted). Headline count + checklist `[ ]` marks were honest (not over-claimed). **Fix:** added CHK-066 to the enumeration. 009 `validate.sh --strict` re-PASSED.

## Convergence read
Original review (~15 seats) + this wave (3 seats) = ~18 seats, trending strictly P2 with 0 P0/P1. The verdict is stable. Continuing toward the 50-seat budget per operator request on the lower-yield uncovered surface (152 per-phase merged tree, 155 research→impl fidelity, 153 mutating-installer edges).
