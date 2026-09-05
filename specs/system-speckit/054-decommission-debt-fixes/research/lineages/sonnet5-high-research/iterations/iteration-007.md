# Iteration 7: Validation Rule Gaps

## Focus

For defects this review already found by hand (iterations 1-6), determine
whether any existing `validate.sh` rule would have caught them, and if not,
name the rule that would.

## Findings

### F7-1 (Synthesis, High): four hand-found defects map to zero existing validate.sh rule coverage, confirmed against the full 25-rule inventory

Full rule inventory read: `check-ac-closure`, `check-ac-coverage`,
`check-ai-protocols`, `check-canonical-save`, `check-comment-hygiene`,
`check-complexity`, `check-description-shape`, `check-doc-pointers`,
`check-files`, `check-folder-naming`, `check-frontmatter`,
`check-graph-metadata-child-drift`, `check-graph-metadata-shape`,
`check-graph-metadata`, `check-grep-convention`, `check-level-match`,
`check-level`, `check-links`, `check-metadata-disk-consistency`,
`check-normalizer-lint`, `check-placeholders`, `check-scaffold-never-touched`,
`check-spec-doc-integrity`, `check-status-cross-doc-consistency`,
`check-template-source`, `check-toc-policy` (25 files)
[SOURCE: dir:.opencode/skills/system-spec-kit/runtime/cli/rules].

| Hand-found defect | Would any existing rule catch it? | Rule that would |
|---|---|---|
| F1-1: `improvement/*-config.json` malformed or drifted, no schema check | **No.** `check-description-shape.sh`/`check-graph-metadata-shape.sh` validate only `description.json`/`graph-metadata.json`; no rule inspects `improvement/` at all [SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/rules/check-files.sh:9] | New: `CHECK-IMPROVEMENT-CONFIG-SHAPE`, parsing `improvement/*.json` as JSON and validating against `model-benchmark-config`/`agent-improvement-config` schemas |
| F4-1: `graph-metadata.json` `children_ids` retains phantom entries from an old packet identity after a rename (127/2707 packets) | **No, by explicit design.** `check-graph-metadata-child-drift.sh`'s own comment states it only flags *missing* on-disk children, never *phantom* entries, "to avoid flagging drift no refresh would reconcile" [SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh:5-12]. `check-metadata-disk-consistency.sh` checks the packet's *own* `packet_id`/`spec_folder` fields against its on-disk path, not the path-segment prefixes inside `children_ids` | New: `CHECK-GRAPH-METADATA-CHILD-IDENTITY-DRIFT` -- flags any `children_ids` entry whose leading path segment does not match the packet's own current `packet_id`/`spec_folder` prefix. Narrower and cheaper than "any orphaned entry" (which the existing rule deliberately declines), because it specifically targets the rename-left-a-stale-identity case |
| F4-4: track-root `graph-metadata.json` (no `spec.md`) never gets swept -- `specs/cli-external-orchestration` under-declares 26 of 36 real children | **No.** `check-graph-metadata-child-drift.sh` only runs against folders passed to `validate.sh`, and ordinary workflows only validate the specific packet being worked on, never a bare track root [SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh:335] | Not a new *rule* -- a new *invocation surface*: a scheduled or `doctor:speckit`-routed sweep that runs the existing `check-graph-metadata-child-drift` logic against every `specs/*/graph-metadata.json` track root, since the rule itself would already catch this if it were ever pointed at that folder |
| F6-1: trigger-index generator's `DEFAULT_REPO_ROOT` off-by-one silently drops two of three corpus roots | **No, and it structurally cannot.** `validate.sh` rules operate on a *spec packet folder's* documents; this is a bug in a shared generator script (`generate-trigger-index.mjs`) that runs once repo-wide, not a per-packet property `validate.sh` traverses into | Not a `validate.sh` rule at all -- a unit/regression test in the retrieval package's own suite (e.g. `retrieval-coverage-parity.vitest.ts`, which already exists per iteration 6's commit trace but currently only parity-checks the *ripgrep* exclusion list against the *trigger-index* exclusion list, not that both walkers land on the real repo root) |

**This table itself is the angle-7 answer**: three of four hand-found defects
would need a **new rule** (or a rule extended to a new file family); one
needs a **new invocation surface** for a rule that already exists but is
never pointed at the folder where the defect lives; and one is **outside
`validate.sh`'s jurisdiction entirely** and needs a code-level regression
test instead. Angle 7's implicit assumption -- "some validate.sh rule should
exist for every category of defect" -- does not hold for infrastructure bugs
like F6-1, which live in shared generator code validate.sh never touches.

### F7-2 (Medium): `check-graph-metadata-child-drift.sh` and `check-metadata-disk-consistency.sh` together cover disk-path identity and additive drift, but the seam between them -- identity *inside* an array field -- has no owner

Restated from F4-1/F7-1 with the ownership boundary made explicit:
`check-metadata-disk-consistency.sh` validates **scalar** identity fields
(`packet_id`, `spec_folder` equal the folder's own disk path)
[SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency.sh:3-6].
`check-graph-metadata-child-drift.sh` validates **presence** (on-disk child
implies a `children_ids` entry) but explicitly not **absence-of-staleness**
[SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh:9-12].
Neither rule validates that every *array entry's* path-segment identity
agrees with the packet's own scalar identity fields -- the exact seam a
rename walks through. This is a naming-and-ownership gap in the rule
inventory's design, not a coding oversight in either individual rule; each
rule does exactly what its own comment says it does.

## Sources Consulted

- Full listing and header/comment read of all 25 files in `.opencode/skills/system-spec-kit/runtime/cli/rules/`
- `.opencode/skills/system-spec-kit/runtime/cli/rules/{check-files.sh,check-graph-metadata-child-drift.sh,check-metadata-disk-consistency.sh,check-status-cross-doc-consistency.sh,check-description-shape.sh}`
- `.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh:335`
- Findings F1-1, F4-1, F4-4, F6-1 from this lineage's own prior iterations (cross-referenced, not re-derived)

## Assessment

- newInfoRatio: 0.6
- Novelty justification: Primarily a synthesis pass over already-found defects (F1-1, F4-1, F4-4, F6-1), but the rule-by-rule mapping and the F7-2 ownership-seam framing are new structural understanding not present in any prior iteration.
- Confidence: High -- every "no existing rule covers this" claim is backed by reading the specific rule's own header comment or source, not inferred from its name.

## Reflection

- What worked: Treating this iteration as a lookup/mapping exercise against already-found defects (rather than hunting for brand-new ones) was the right call given the angle's own phrasing ("defects the review passes found by hand") -- it explicitly asks for synthesis, not fresh discovery.
- What failed: Nothing new ruled out this iteration; this was a directed synthesis pass rather than open-ended search.
- Ruled out: n/a this iteration.

## Recommended Next Focus

Q8: README and feature-catalog accuracy for the spec-kit skill itself against
the code that exists today.
