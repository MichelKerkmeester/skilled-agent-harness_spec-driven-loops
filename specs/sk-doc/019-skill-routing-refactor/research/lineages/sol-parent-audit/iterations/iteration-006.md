# Iteration 006 — Cross-reference, handoff, and resume audit

## Focus

Audit RELATED DOCUMENTS, transition rules, handoff criteria, open questions, and resume guidance.

## Actions Taken

1. Resolved every parent-level relative link.
2. Compared transition/handoff rows with the active phase map.
3. Checked whether a resumer can identify the next authoritative packet.

## Findings

1. **P1 — the parent’s `Parent Spec` link is broken and contradicts its own metadata.** The metadata says this packet has no parent, but RELATED DOCUMENTS points to `../spec.md`; that file does not exist under the `sk-doc` track. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:37] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:171]
2. **P1 — handoff coverage stops before the active work.** The table defines A→B, C research→fixes, and only a subset of D research (`016/017/019`)→implementation. It gives no handoff for active direct phases `015` or `018`, nor for nested programs `020` and `021`, even though the parent-level Handoff Criteria requires both programs to close. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:41] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:124]
3. **P2 — the phase-parent note overstates the single-document rule.** It says `spec.md` is the only authored parent document, yet the same sentence names `context-index.md` and the parent also carries two authored routing references. A resumer can incorrectly ignore those current surfaces. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:55] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:1]
4. **P2 — resume guidance is only partial.** Groups E and F are told to resume at their parent specs, but no corresponding active-child pointer exists in root metadata and direct active phases have no resume rule. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:122] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json:123]

## Questions Answered

- One explicit parent link is broken.
- Handoff and resume guidance do not cover the packet’s current active topology.

## Questions Remaining

- The intended next active child is undocumented when several workstreams remain open.

## Ruled Out

- `./context-index.md` resolves and is current. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:170]

## Sources Consulted

- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:124]
- [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/graph-metadata.json:123]

## Assessment

- New information ratio: 0.72
- Novelty: two operational resume defects plus two clarity defects.

## Reflection

Resolving links and mapping every active row against handoff coverage exposed gaps that prose-only review would miss.

## Recommended Next Focus

Exhaustive stale-token and path-spelling scan.
