---
title: "Review Report: ENV Documentation Deep Review and Remediation"
verdict: "POOR at entry, REMEDIATED"
method: "ten iterative opus audit passes, loop-until-dry, ten lenses"
findingCounts: { "P0": 0, "P1": 13, "P2": 16 }
scope: "ENV_REFERENCE.md, references/config/environment_variables.md, the four changelogs, the root README, the four skills' flag source"
model: "claude-opus-4-8"
---
# Review Report: ENV Documentation Deep Review and Remediation

## Entry Verdict: POOR, actively misleading

A ten-iteration opus deep review of the ENV documentation found the reference was not merely incomplete, it was wrong in ways a reader who trusts it would be burned by. The code reads 412 distinct SPECKIT flags, ENV_REFERENCE.md documented 289, and the raw gap of 144 triaged down to a real set of genuine defects. Zero P0, thirteen P1, sixteen P2.

## The Defects, by Severity

### The highest-blast-radius defect, a stale build (P1)

The flag-rename commit dropped version suffixes from the source flag names but never rebuilt the shipped dist, so the runtime still read the old `_V1` names. Twelve graduated features' documented disable knobs were inert: a user disabling them by the documented name was silently ignored, only the undocumented `_V1` keys worked. Confirmed: twelve `_V1` flags in the dist, de-suffixed names in source, dist mtime older than source.

Scope correction: the dist is gitignored, so external users always build fresh and were never shipped the stale binary. The real impact was local only, the running session. Fixed by rebuilding the dist (zero `_V1` names remain).

### Inaccurate defaults a reader would copy wrong (P1, five)

FLOORS_JSON carried a spurious duplicate `codeGraph:900`, EDGE_WEIGHTS_JSON was missing the `SUPERSEDES:1.0` weight, the sibling stated RECENCY_DECAY_DAYS as 30 against a code default of 90, the four retry knobs showed a code default of 300000 while every shipped runtime config pins 5000, and DOC_TRIGGERS showed off while the configs pin it on. All five corrected, the config-pin gaps now disclosed.

### Stale and inconsistent entries (P1, five)

Three graduated kill switches the doc claimed to auto-generate from the search-flags registry were missing and were added. A documented VRULE toggle no longer exists and the reader fail-closes, so the stale row was removed rather than rewritten wrong. A sibling GRAPH_WEIGHT_CAP of 0.05 contradicted the canonical 0.15 and was corrected. Two memory flags present only in the feature table got per-section rows, and a learned-feedback flag read outside the registry was added.

### Genuinely undocumented user-facing flags (P2, fifteen rows added)

Seven code-graph flags including the bitemporal reads, the reverse-dependency force-parse and its degree cap of 15, and the tombstone path. Six advisor flags including the RRF fusion spine, the self-recommendation guard and the workspace allowlist whose own rejection error referenced an undocumented variable. One deep-loop fanout dedup flag, documented under a new appendix section. Plus the single-writer DB lock kill switch.

### Structural (P1 and P2)

The numbered section sequence jumped from 13 to 15, renumbered to a gapless 1 through 17. The unnumbered CODE GRAPH section was interleaved between Sections 6 and 7, moved to the appendix cluster so the numbered run is contiguous.

## Three Review Errors the Remediation Caught

The remediation agent verified every finding against source before acting, and corrected the review on three points:

1. The review named a flag `SPECKIT_ADVISOR_METRICS_ENABLED`. The real flag is `SPECKIT_METRICS_ENABLED` with no advisor infix. The correct name was documented.
2. The review claimed README line 144 falsely asserts the DB lock flag is documented in ENV_REFERENCE.md. No such README claim exists, the review hallucinated it. The README was left untouched, and the flag was still added on its own merit.
3. The review said the VRULE reader fail-opens. Source shows it fail-closes. Documenting fail-open would have been wrong, so the stale row was removed.

## Remediation Applied

Two files edited, ENV_REFERENCE.md and the sibling environment_variables.md, plus the dist rebuild. Fifteen flag rows added, five defaults corrected, two stale entries fixed, three cross-doc inconsistencies reconciled, two structural issues resolved. The code-graph changelog claim that the bitemporal flag and degree cap are documented in ENV_REFERENCE.md is now true. No production default flipped.

## Verification

The originally-missing flags are present, the corrected defaults match source, the section sequence is gapless 1 through 17, and the README is unchanged. The remediation's added lines are HVR-clean. The eleven em-dashes and the prose semicolons that remain in ENV_REFERENCE.md are pre-existing debt outside this change's scope, tracked for a separate house-style pass.
