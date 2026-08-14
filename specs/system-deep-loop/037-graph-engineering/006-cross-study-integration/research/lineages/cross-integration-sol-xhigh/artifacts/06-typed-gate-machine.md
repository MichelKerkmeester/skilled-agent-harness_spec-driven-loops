# P6 — End-to-End Typed Gate and Evaluation Machine

## State path

1. `ReturnAdmission = accepted | repairable(reason) | rejected(reason)`
2. `Evidence = complete | blocked(family,reason) | stale(family)`
3. `Belief = usable | contradicted | insufficient | stale | authority_zero`
4. `Convergence = continue | stop_eligible | terminal_blocked(reason)`
5. `OrgPolicy = allow | deny(reason) | ask(scope)`
6. `HumanGate = not_required | pending | approved | rejected | expired | revoked`
7. `Authority = shadow_recorded | authorized_append | denied(reason)`

S5 requires separate return/evidence/authorization layers; S2 supplies belief, refusal, and human settlement; S3 supplies organization policy and the admission/authorization boundary. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:95] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:35] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:67]

## Guards

- Only `accepted` enters evidence.
- D/C/G/H/R/M must all be current and pass.
- Belief must be `usable`.
- Terminal promotion requires `stop_eligible`; ordinary continuation does not.
- DENY blocks; ASK requires a current, scoped approval.
- 036 rechecks head, epoch, fence, identity/capability, policy, and candidate digest.

[SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:226] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:77] [INFERENCE: each earlier pass is necessary, never sufficient for a later owner.]

## Failure record

Every block is append-only: `{owner,state,reasonCode,evidenceDigests,candidateDigest,policyDigest,head,epoch,fence,timestamp}`. Repair creates a linked attempt. There is no generic `validated` or rewrite of the failed attempt.

## Mode terminal

Current: `shadow_recorded` after unchanged legacy output. Target: 036 `authorized_append` only.
