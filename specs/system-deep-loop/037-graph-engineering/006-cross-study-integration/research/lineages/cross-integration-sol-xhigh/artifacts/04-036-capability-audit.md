# P4 — 036 Capability and Ownership Gap Audit

## Classification rule

- `present`: reusable implemented primitive.
- `shadow-only`: implemented but explicitly non-authoritative or unwired.
- `missing`: no runtime module found.
- `adapter-owned`: 036 has an extension point, but graph semantics must supply the producer/adapter.

## Matrix

| Assumed primitive | State | Integration consequence |
|---|---|---|
| transition gateway, typed ledger, head/epoch checks | present | reuse; do not create graph authority |
| single-host locks/fences | present | reuse; multi-host semantics remain open |
| budgets, receipts, effect recovery | present | graph normalization/policy is adapter-owned |
| cutover certificate and rollback window | present | extend/bind graph promotion evidence |
| dark adapter, shadow parity, per-mode selector | shadow-only | current mode stays legacy-authoritative |
| rollback drills | shadow-only | implementation exists with no sibling consumer |
| graph IR admission/materialization | missing | build |
| organization-policy compiler | missing | build |
| durable human gate and refusal journal | missing | build |
| memory/knowledge/belief projections | missing | build |
| graph identity/evidence resolver | adapter-owned | mandatory fail-closed deployment adapter |
| graph budgets/effect policies/036 bridge | adapter-owned | bind existing primitives to graph identities |

The per-mode authority module explicitly describes itself as dark/unwired and defaults to legacy. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/types.ts:5] The studies assume graph admission, gates, belief, and evidence producers that the audit does not find. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:222] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:386]

## Minimum cutover-critical build

1. Typed graph IR compiler/materializer.
2. Graph admission plus identity/evidence resolver.
3. Memory/knowledge/belief reducers.
4. Organization policy plus durable gate/refusal ledger.
5. Graph budget/effect adapters.
6. Shadow bridge assembling D/C/G/H/R/M for existing 036 cutover controls.

This is an adapter slice because S1 supplies the IR, S2/S3 supply governance and belief obligations, and S5 supplies the harness boundary. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:23] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:95] [INFERENCE: duplicating ledger, fencing, or rollback would create a second authority plane.]
