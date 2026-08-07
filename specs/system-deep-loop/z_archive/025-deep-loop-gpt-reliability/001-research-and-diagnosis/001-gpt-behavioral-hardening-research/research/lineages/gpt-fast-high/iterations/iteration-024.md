# Iteration 24: Plugin Placement Decision

## Focus
KQ5 where enforcement should live.

## Findings
- Current plugin folder is intentionally limited to entrypoint files, with helper bridges under owning skills [SOURCE: .opencode/plugins/README.md:24-28].
- Skill advisor plugin owns recommendation injection, not route enforcement [SOURCE: .opencode/plugins/README.md:44-49].
- A new `mk-deep-route-guard.js` plugin with helper code under `deep-loop-workflows` or `deep-loop-runtime` is the cleanest ownership boundary.

## Sources Consulted
Plugin README.

## Assessment
newInfoRatio: 0.16. Low novelty but clarifies ownership.

## Reflection
Do not hide enforcement inside advisor scoring.

## Recommended Next Focus
Audit non-goals.
