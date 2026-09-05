# Iteration 9: Deep-Loop Integration Seams vs. Spec-Kit's Metadata Generators

## Focus

How `fanout-run`, the deep-review/deep-research leaves, and the reducer
write spec packets, and where they bypass or duplicate spec-kit's metadata
generators (`description.json`, `graph-metadata.json`).

## Findings

### F9-1 (Medium): research/review activity never refreshes the owning packet's `description.json`/`graph-metadata.json`, extending the F4-4 staleness pattern down to the packet-metadata level

Grepping `system-deep-loop/runtime/{scripts,lib}` for any call into
spec-kit's metadata surface (`graph-metadata`, `refreshGraphMetadata`,
`generatePerFolderDescription`, `description.json`) returns exactly one
incidental hit (an unrelated comment in `write-containment.ts`) -- **the
reducer scripts (`reduce-state.cjs`, one per mode) and `fanout-run.cjs` never
call any spec-kit metadata generator**
[SOURCE: grep sweep across `.opencode/skills/system-deep-loop/runtime/{scripts,lib}`, non-test files].
The three reducer scripts write only via generic `fs.writeFileSync` to files
local to the `research/`/`review/`/`improvement/` packet (strategy.md,
dashboard.md, findings-registry.json)
[SOURCE: file:.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:69,80].

This is **by design and disclosed** where `spec.md` itself is mutated:
`spec-check-protocol.md` documents careful idempotency, dedupe-by-`packet_id`,
and checksum-guarded generated-block replacement specifically for the bounded
case where a research run anchors into the host packet's `spec.md`
[SOURCE: file:.opencode/skills/system-deep-loop/deep-research/references/protocol/spec-check-protocol.md:200-208].
But that anchoring is optional/late-INIT, not the common case. **When a
research or review run does NOT touch `spec.md`** (the default for most
runs), nothing regenerates the packet's `description.json` or refreshes
`graph-metadata.json`'s derived fields to reflect that new research/review
content now exists in the packet.

**Live, self-referential proof from this very packet:** this lineage's own
target packet, `054-decommission-debt-fixes`, has
`description.json.lastUpdated: "2026-09-05T18:39:07.251Z"`
[SOURCE: file:.opencode/specs/system-speckit/054-decommission-debt-fixes/description.json],
while its `research/` directory carries a filesystem mtime of `2026-09-05
22:24:53` (this fan-out lineage's own dispatch time) -- **almost 4 hours
after** the description was last refreshed. `graph-metadata.json`'s
`children_ids` correctly excludes `research/`/`review/` (only the 7 real
phase-child packets are listed, confirmed by direct read)
[SOURCE: file:.opencode/specs/system-speckit/054-decommission-debt-fixes/graph-metadata.json],
so there is no false-pollution bug -- the gap is purely one of **staleness**:
this active, in-flight research investigation is invisible to anyone reading
`description.json`'s `lastUpdated` as a freshness signal for the packet.

This is not the same defect as F4-4 (track-root children_ids never swept)
but the same *class* of problem one level down: spec-kit's generated
metadata is refreshed on an explicit-trigger basis (save, continuity write),
and deep-loop's autonomous write paths do not know to pull that trigger,
so any packet with an active or recently-completed deep-loop run can show
metadata that understates its own freshness by hours or days.

**Fix:** Either (a) have the reducer's final synthesis step (or
`fanout-salvage.cjs`'s post-run sweep) call
`refreshGraphMetadata`/`generatePerFolderDescription` from
`@spec-kit/runtime/api` for the target packet once a loop reaches a terminal
state (`stopReason` recorded), or (b) if that coupling is undesirable
(deep-loop deliberately does not depend on spec-kit's API per F5-1's
finding that no cross-skill shared surface is meant to exist), document the
staleness explicitly in `state-format.md`'s ownership model so a reader
knows `description.json.lastUpdated` is not a reliable freshness signal
during or after an unattended research/review run.

### F9-2 (Verified clean): `graph-metadata.json`'s `children_ids` correctly never includes `research/`/`review/` local-owner folders

Direct check of `054-decommission-debt-fixes/graph-metadata.json` confirms
`children_ids` lists exactly the 7 real numbered phase-child packets and
nothing referencing `research` or `review`
[SOURCE: file:.opencode/specs/system-speckit/054-decommission-debt-fixes/graph-metadata.json].
Consistent with `folder-structure.md`'s classification of `research/`/`review/`
as local-owner folders rather than child packets (iteration 3/4 context).
No pollution bug found; ruled out as a concern.

## Sources Consulted

- `.opencode/skills/system-deep-loop/runtime/{scripts,lib}` (grep sweep for spec-kit metadata API calls)
- `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`
- `.opencode/skills/system-deep-loop/deep-research/references/protocol/spec-check-protocol.md`
- `.opencode/specs/system-speckit/054-decommission-debt-fixes/{description.json,graph-metadata.json}` + `research/` directory mtime (live, self-referential evidence)

## Assessment

- newInfoRatio: 0.7
- Novelty justification: Extends the staleness pattern established in F4-4 to a new layer (packet-level generated metadata vs. deep-loop write paths), grounded in a live, self-referential example from this very lineage's own target packet rather than a hypothetical.
- Confidence: High -- the grep sweep found zero calls, the spec-check-protocol's own documented scope confirms the gap is real (not just an oversight I couldn't find code for), and the timestamp comparison is a directly observed fact about the packet this research runs inside.

## Reflection

- What worked: Comparing `description.json.lastUpdated` against `research/`'s own directory mtime turned an abstract "does deep-loop call spec-kit's generators" question into a concrete, self-evidencing timestamp gap using data already sitting in the packet this task targets.
- What failed: Nothing ruled out incorrectly this iteration.
- Ruled out: `children_ids` pollution from `research`/`review` folders -- confirmed absent by direct read. [SOURCE: file:.opencode/specs/system-speckit/054-decommission-debt-fixes/graph-metadata.json]

## Recommended Next Focus

Q10: ranked, deduplicated synthesis of every finding from iterations 1-9,
with owner surface, fix sketch, and a one-line verification command per item.
