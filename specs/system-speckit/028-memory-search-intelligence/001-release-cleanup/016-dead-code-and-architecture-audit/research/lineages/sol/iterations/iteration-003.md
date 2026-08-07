# Iteration 003: Deep-loop resume and parity stack

## Focus

Determine whether certificate, sealed-artifact, authorized-ledger, and resume-adapter code is active workflow authority or shadow-only machinery.

## Findings

1. The 1,241-line deep-research resume adapter composes authorized ledger, event schema, reducers, sealed artifacts, transition certificates, replay fingerprints, and effect recovery. Its direct runtime consumer is the 3,426-line shadow-parity harness; neither deep-research YAML contains the adapter literal. This supports a CAT-6 shadow-system finding, not a CAT-1 deletion claim. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/deep-research-resume-adapter.ts:5] [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/deep-research-resume-adapter.ts:21] [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-research-shadow-parity/harness-adapter.ts:60]

## Sources Consulted

- `.opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-research-shadow-parity/harness-adapter.ts`
- `rg -n 'deep-research-resume-adapter' .opencode/commands/deep/assets/deep-research-{auto,confirm}.yaml`

## Assessment

- New information ratio: 0.74
- Confidence: medium-high. Shadow-only reachability is confirmed; future promotion intent is unknown.

## Reflection

Absence from YAML is not proof of deadness because tests and shadow parity deliberately consume the stack. The valid finding is disproportionate parallel authority.

## Recommended Next Focus

Audit compiled skill-routing topology and per-hub compiler duplication.
