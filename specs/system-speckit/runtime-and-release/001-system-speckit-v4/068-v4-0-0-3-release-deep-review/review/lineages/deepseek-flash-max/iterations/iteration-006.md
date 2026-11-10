---
title: "Deep Review Iteration 006 — spec-kit hooks and trust boundaries"
trigger_phrases: []
---

# Iteration 6: Security — spec-kit hooks and trust boundaries

## Focus

Dimension: **security**. Slice: the runtime-neutral spec-gate policy core and its environment
trust boundaries — `runtime/hooks/lib/spec-gate/spec-gate-core.mjs` (classify/enforce entrypoints,
env semantics, fail-open posture, deny-capable surface, path exemptions), plus a source-hygiene
sweep of the four focus trees that started from searching the completion-evidence sentinel and
found that two shipped source files are binary to text tooling.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` (header and env semantics 1-140; decision path 1720-1871; helper index)
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs` (bytes and structure; line 318 inspected in place)
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/rubric-guard.cjs` (line 59 inspected in place; pre-existing instance)
- Source-hygiene sweep: every `.cjs/.mjs/.js/.ts/.tsx/.sh/.json/.md` file under the four focus trees scanned for NUL bytes
- Git provenance for both NUL-bearing files (tag-to-tag diff, introducing commits)

## Findings

### P0 Findings

None.

### P1 Findings

None new. Carried: F001 and F002 remain active (unchanged this iteration).

### P2 Findings

- **F005**: The completion-evidence sentinel source contains a raw NUL byte, making the file binary to search and diff tooling — `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs:318` — The separator in the dedup hash seed is written as an actual 0x00 byte inside the template literal `` `sha256:${createHash('sha256').update(`${specFolder}<NUL>${claimText}`).digest('hex')}` `` (byte 16206), where the escape `\u0000` was intended; the runtime value would be identical with the escape. Observed consequences on this release-introduced file (first in-range commit `57c0a6831c`): `rg` answers with `binary file matches (found "\0" byte around offset 16206)` instead of matching lines, so text search and any rg-based audit silently stop seeing the file's content; `diff` prints `Binary files /dev/fd/63 and /dev/fd/62 differ`, so plain diff review cannot show changes; `file` classifies it as `data`. Git itself still renders the file as text because the byte sits past git's 8000-byte sniff window (`git diff v4.0.0.2..v4.0.0.3` prints the full 636-line addition). The same defect exists pre-existing in `.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/rubric-guard.cjs:59` (raw NUL inside `h.update(r.body + '\u0000')`; present at `v4.0.0.2`, so outside this release), and the sweep found no other instance in the four focus trees.

  Finding class: `instance-only`
  Scope proof: Scanned every source-like file under the four focus trees for NUL bytes (two hits), read both hit sites in place, confirmed the behaviors with `rg`, `diff`, `file`, and confirmed the sentinel's NUL arrived with the release by reading the blob of its first in-range commit.
  Affected surface hints: [`.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs`, `.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/rubric-guard.cjs`]

## Claim Adjudication

No new P0/P1; F005 is an advisory with executed tool behavior as evidence. Counterevidence considered: does the raw NUL break the code? No — Node parses and loads both files and the hash input is the intended separator, so this is a tooling/reviewability defect, not a logic one, which is why it is P2.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pending | Full traceability pass scheduled for iteration 8. |
| `checklist_evidence` | pending | Scheduled with the same pass. |

## Ruled Out

- "The spec gate can be silently disarmed by a crafted environment": ruled out on read — deny is opt-in only under the exact `SYSTEM_SPEC_GATE_ENFORCE=1`; the kill switches (`SYSTEM_SPEC_GATE_DISABLED`, the repo's `hook-flags.env` spec-gate toggle) are documented operator surfaces, and the child-session bypass requires `AI_SESSION_CHILD` to be exactly `1` (every other value is interactive, the safe default) (`spec-gate-core.mjs:79-106, 1754-1758`).
- "A dispatched session can be denied by a leaked enforce env": ruled out — `isChildSession` short-circuits to a complete allow before any state read or telemetry (`spec-gate-core.mjs:1755-1758`), and the comment states why.
- "The deny surface is wider than the contract says": ruled out — deny applies only to `write`/`edit` (`DENY_CAPABLE_TOOLS`, `:142`), only while the gate is open and unanswered, and never to exempt targets; `bash` can only advise (`:1774-1793`).
- "A corrupt gate state can block mutations": ruled out — every entrypoint fails open on unreadable state, classifier throw, or unexpected argument shape, as the module header documents and the catch at `:1794-1797` implements.

## Dead Ends

- Loading the sentinel and the rubric guard under a parser to prove the NUL is syntactically benign: the files are already required by their adapters and tests in shipped runs, and no parser was needed for the finding; executing them would write state under the hooks' state directory, outside the lineage.

## Assessment

- New findings ratio: 1.0 (one new P2; weighted new = weighted total = 1)
- Dimensions addressed: security
- Novelty justification: the security pass read the gate's trust boundaries and found them consistent with their documented posture; the new finding came from the source-hygiene sweep that followed a failed rg search — a direct demonstration of the defect it reports.

## Next Focus

Dimension: correctness. Focus area: spec-kit runtime/lib — validation orchestrator internals, graph metadata schema/parser, continuity and description libraries (`runtime/lib/validation/**`, `runtime/lib/graph/**`, `runtime/lib/continuity/**`, `runtime/lib/description/**`). Required evidence: file:line for each schema/validation claim and one cross-check against a consumer. Rotations status: correctness slice 6 of 6.

Review verdict: CONDITIONAL
