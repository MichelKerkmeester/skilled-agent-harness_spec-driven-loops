# Iteration 4: Generated Metadata vs. Documents Across Sampled Spec Packets

## Focus

Sample 15+ spec packets across tracks and check whether generated metadata
(`graph-metadata.json`, `description.json`), status fields, and phase maps
contradict the packet's own documents.

## Findings

### F4-1 (High): `graph-metadata.json` `children_ids` accumulates stale/phantom entries after a packet rename, on a scale affecting 127 packets tree-wide

A repo-wide scan (Node script) compared every `graph-metadata.json`'s
`children_ids.length` against the actual count of number-prefixed
subdirectories on disk, across **2707** packets carrying `graph-metadata.json`.
**127 packets (4.7%)** show a mismatch.

Root-caused with a concrete example:
`specs/system-deep-loop/030-deep-loop-unification/graph-metadata.json`
declares `packet_id`/`spec_folder` = `system-deep-loop/030-deep-loop-unification`
(correct, current identity) but its `children_ids` array holds **24** entries:
the 12 real children prefixed `system-deep-loop/030-deep-loop-unification/...`
**plus 12 phantom duplicates** prefixed
`system-deep-loop/052-deep-loop-unification/...` -- a packet ID that does not
exist anywhere in the tree (`find specs/system-deep-loop -maxdepth 1 -iname
"052-*"` returns nothing).
[SOURCE: file:.opencode/specs/system-deep-loop/030-deep-loop-unification/graph-metadata.json]
This is a leftover from an in-progress rename (`052` -> `030`, or the reverse)
where the metadata writer appended the new identity's children without
removing the old identity's.

**This is not a one-off.** The tree-wide sweep found the exact-2x-duplication
signature repeated at multiple levels, e.g.: `specs/system-deep-loop`
(declared 26 / actual 11), `specs/sk-doc/016-create-diff-mode/014-skill-readme-standardization`
(28/14), `specs/system-deep-loop/031-smart-routing-benchmark-program` (36/18),
`specs/system-deep-loop/032-deep-alignment-mode` (32/16),
`specs/sk-doc/014-sk-doc-parent/010-subskill-doc-review` (20/10). Full list of
127 mismatched paths captured in this iteration's delta file.

**Root cause confirmed in the validator's own source comment**: `check-graph-metadata-child-drift.sh`
explicitly documents that its writer "adds derived children and never
prunes... A listed entry with no matching folder is left untouched by the
writer and is deliberately NOT reported, to avoid flagging drift no refresh
would reconcile."
[SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh:5-12]
This is a **known, intentional design gap**: the rule only ever flags
missing-on-disk children (an addition the writer would fix), never
phantom/stale entries (a removal the writer will never make). A rename
therefore leaves permanent phantom children_ids that no `validate.sh` rule,
default or `--strict`, will ever surface. (Full angle-7 treatment in
iteration 7.)

**Fix:** Extend the graph-metadata writer (or a new validate.sh rule sitting
next to `check-graph-metadata-child-drift.sh`) to also flag/prune
`children_ids` entries whose path segment does not match the packet's own
current `packet_id` prefix -- i.e. detect entries like
`system-deep-loop/052-.../...` living inside a `030-...` packet's own
metadata, which is a stronger, cheaper signal than a general "any orphaned
entry" check (that one is deliberately not reported per the rule's own
tradeoff) because it specifically catches the parent-identity-changed case.

### F4-2 (Ties to iteration 3, High confidence confirmation): the Claude/Cursor `mkHookDrift` gap (F3-2) is explicitly tracked as deferred, not accidental

While sampling `specs/system-speckit/054-decommission-debt-fixes` itself, its
`graph-metadata.json` lists a child
`005-hook-fallback-failure-signal`
[SOURCE: file:.opencode/specs/system-speckit/054-decommission-debt-fixes/graph-metadata.json].
That child's own `spec.md` explicitly scopes Codex/Devin fallback-signal work
**In Scope** and states, verbatim, in Out of Scope:
"Claude's, Cursor's, Pi's, and OpenCode's hook registrations -- their
session-cleanup pattern (`.claude/settings.json:163`: `... || true` with no
`printf` fallback at all) is a different, narrower shape not covered by this
problem statement."
[SOURCE: file:.opencode/specs/system-speckit/054-decommission-debt-fixes/005-hook-fallback-failure-signal/spec.md:42,86]
Status of this child phase is **Complete**. This means the Claude/Cursor gap
identified independently in iteration 3 (F3-2) is a real, already-diagnosed,
deliberately deferred item -- not a project oversight, but also not yet
scheduled anywhere as its own follow-up packet (a repo-wide grep in a later
iteration should confirm whether a successor packet ever picked it up).

### F4-3 (Ruled out): `specs/system-speckit/000-release`'s missing "Status" table row is a different, valid template, not a defect

Initial automated scan flagged `000-release/spec.md` as
`STATUS_FIELD_NOT_FOUND` (no `| **Status** | ... |` table row). Direct read
shows it uses a blockquote status line instead: `> **Status:** PLANNING
CAPTURE (temporary). No shipped runtime touched yet.`
[SOURCE: file:.opencode/specs/system-speckit/000-release/spec.md:17] --
a legitimate distinct template for this packet's special "release capture"
purpose, not a template-conformance defect. Ruled out.

### F4-4 (Informational): track-root `graph-metadata.json` files (no `spec.md`) are structurally invisible to normal validate.sh usage

Track roots like `specs/cli-external-orchestration/` and
`specs/system-deep-loop/` have `description.json` + `graph-metadata.json` but
**no `spec.md`**
[SOURCE: file:.opencode/specs/cli-external-orchestration (directory listing: description.json, graph-metadata.json, no spec.md)].
`specs/cli-external-orchestration/graph-metadata.json` declares 10 children
(`026`-`035`) while 36 packet folders actually exist up to `064`
[SOURCE: file:.opencode/specs/cli-external-orchestration/graph-metadata.json].
`validate.sh`'s packet-discovery condition requires `spec.md` OR
`description.json` to treat a folder as a validatable unit
[SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh:335],
so a track-root folder is technically discoverable -- but ordinary workflows
only ever invoke `validate.sh` against the *specific packet folder* being
worked on (e.g. `054-decommission-debt-fixes`), never against the bare track
root, so this staleness (26 packets' worth of missing children) can persist
indefinitely with nothing ever exercising the check against it. Distinct
failure mode from F4-1: this is a writer that was simply never re-run after
new sibling packets were created, not a rename artifact.

**Fix:** Add a periodic or pre-commit sweep (or a `doctor:speckit` route) that
runs `check-graph-metadata-child-drift`-equivalent logic against every
track-root `graph-metadata.json` under `specs/*/`, not only against packets
that happen to be the target of a `validate.sh` invocation.

## Sources Consulted

- Node script enumerating all 2707 `graph-metadata.json` files under `specs/` and diffing `children_ids.length` vs on-disk numbered subdirectory count
- `.opencode/specs/system-deep-loop/030-deep-loop-unification/{spec.md,graph-metadata.json}`
- `.opencode/specs/system-speckit/054-decommission-debt-fixes/005-hook-fallback-failure-signal/spec.md`
- `.opencode/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh`
- `.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh:335`
- `.opencode/specs/cli-external-orchestration/{description.json,graph-metadata.json}` + directory listing
- 28-packet cross-track sample of `spec.md` Status fields (agents, cli-external-orchestration, hooks, mcp-tooling, sk-code, sk-communication, sk-design, sk-doc, sk-git, sk-prompt, sk-vision, system-deep-loop, system-skill-advisor, system-speckit)

## Assessment

- newInfoRatio: 1.0
- Novelty justification: A repo-wide quantified structural defect (127/2707 packets, 4.7%) with a confirmed root cause in the validator's own source comments -- the highest-confidence, highest-severity finding of the run so far, and entirely new ground.
- Confidence: High -- machine-verified count mismatch across the full corpus, root cause quoted directly from the rule's own source code, and one example manually traced end-to-end (030 vs phantom 052).

## Reflection

- What worked: Once one packet showed a suspicious 2x children_ids count, scripting a full-corpus sweep (rather than continuing to spot-check by hand) turned a single anecdote into a quantified, high-confidence systemic finding in one tool call.
- What failed: My own regex-based Status-field extraction produced a false-positive-looking gap (000-release) that a direct read immediately resolved -- a reminder to verify tooling gaps against the source before recording them as findings.
- Ruled out: `000-release`'s non-table Status line as a template defect -- it is a deliberately distinct "capture" template. [SOURCE: file:.opencode/specs/system-speckit/000-release/spec.md:17]

## Recommended Next Focus

Q5: helpers duplicated across skills that spec-kit's runtime already exports
via `@spec-kit/runtime/api` or CLI utilities (path containment, frontmatter
parsing, spec-folder detection, level scoring).
