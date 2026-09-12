# Iteration 10: A2 + A4 second pass — Strip and resend as one pipeline (D3, D4)

## Focus

Design the strip and the resend as a single end-to-end pipeline: one slice extractor, three consumers, one
hash, and the frontmatter-leak test that proves the boundary holds. Angle A2+A4 (charter
`../../deep-research-strategy.md`:59). Final iteration of this lineage.

## Actions Taken

1. Re-read the D3 and D4 first-pass results and the frontmatter regex they depend on.
2. Traced the three consumers of goal text from the file to the model/operator.
3. Specified the leak test and the drift guard between the two extractors.

## Findings

### F1. The pipeline, end to end

```text
goal.md (file, canonical)
  │  (1) split: FRONTMATTER_RE-style (BOM + leading HTML comments tolerated)
  │      — continuity-freshness.ts:17
  ├─ frontmatter ──► consumed by validation only (must never enter chat/injection)
  └─ body
        │  (2) slice: durable part = body start → before the log anchor
        │      (ANCHOR:directive … before ANCHOR:log; goal.md.tmpl:48, :99)
        │  (3) normalize → sha256  ⇒ durableSliceHash
        │
        ├─(4a) CHAT RESEND   (when hash != lastResentSliceHash, key = packetPath + hash)
        ├─(4b) INJECTION     (goal_prompt <- slice projection, clamped to the block budget)
        ├─(4c) OBJECTIVE     (pointer + binding sentence + criteria bullets only)
        └─(4d) CLI SHOW      (same projection as 4b)
```

Every arrow crosses exactly one function boundary, and that function is the only place that sees the raw
file. That is the property iteration 2 asked for (one choke point) and iteration 4 quantified (the hash is
over the slice, not the file).

### F2. The extractor has a reusable precedent *and* a portability wrinkle

`FRONTMATTER_RE` (`[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:17]`)
already tolerates a BOM and leading comments, and the CLI has `js-yaml` available
(`[SOURCE: .../continuity-freshness.ts:8]`) plus `buildContinuityFingerprint`
(`[SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:648]`). But the
hook core is CommonJS (`goal-core.cjs`) while `@spec-kit/runtime/api` is ESM, and the OpenCode plugin is
ESM but does not import the core (`[SOURCE: .opencode/hooks/goal/README.md:31]`). The cheap, drift-proof
seam is a runtime-neutral CJS module under `.opencode/hooks/goal/lib/` that both the core and the plugin
consume (ESM can import CJS); the validator keeps its own regex for validation, and a golden comparison test
pins the two against the same fixtures — the template plus at least one live packet file.

### F3. Slice content rules (what the strip removes, and why each removal is required)

| Removed | Why mandatory |
|---------|---------------|
| YAML frontmatter (`title`, `description`, `trigger_phrases`, `_memory.continuity`) | continuity metadata and fingerprints are not directive text; `_memory` must never reach chat (`goal.md.tmpl:16`) |
| Template scaffolding comments (`SPECKIT_TEMPLATE_SOURCE`, `HVR_REFERENCE`) and the durable/volatile blockquote | noise that consumes the 576-char objective preview before content (`goal-core.cjs:370`) |
| The conditional phase wrapper (`<!-- IF level:phase -->`) and anchor comments | formatting, not content — but the conditional must be *resolved*, not stripped blindly, or a single-packet goal would ship "phase only" text |
| Section 4 (LOG) and everything below the log anchor | "Log entries never trigger a resend; the log is not part of the objective" (`goal-set-string-playbook.md:79`) |

The phase wrapper is the one place where a naive regex slice does something wrong: the template's binding
section is wrapped in `<!-- IF level:phase -->`
(`[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:65]`), and any prefix/suffix
stripper must honour that conditional. This is the concrete argument for "slice by anchors, not by line
range".

### F4. One hash, three consumers, and the cache

- The hash is over the normalized slice, never the file (iteration 4, F3: log appends must not fire it).
- Dedup key is `packetPath + durableSliceHash` (iteration 9, F4).
- The plugin's brief cache (512 entries, `[SOURCE: .opencode/plugins/opencode-goal.js:43]`) must include the
  hash in its key, or a resend is suppressed by a stale entry.
- The chat resend is the only consumer whose output a human pastes; its first line must be the pointer, so
  a truncation at paste time keeps the address even if the criteria tail is cut
  (`[SOURCE: .opencode/commands/speckit/assets/speckit-plan.yaml:172]`, `[SOURCE: .opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:34]`).

### F5. The frontmatter-leak test

A single test over the extractor's output, run against three fixtures (template, a phased packet, a
half-edited file with the log anchor missing):

| # | Assertion | Why this is the failure it catches |
|---|-----------|-----------------------------------|
| 1 | output contains no `_memory:` / `continuity:` / `sha256:` / `trigger_phrases:` | the charter's explicit "frontmatter never sent in chat" |
| 2 | output's first line is the pointer, not `---` or a heading | a paste-time truncation keeps the address |
| 3 | output contains no `ANCHOR:log` and no `### Progress` table marker | the log is excluded by rule, not by luck |
| 4 | output contains the completion criteria bullets verbatim | the cut order may shorten wording, never drop a criterion (`goal-set-string-playbook.md:63`) |
| 5 | for a phased packet, output contains the binding table; for a singular packet, it does not | the `IF level:phase` conditional is resolved, not stripped |
| 6 | the rendered block is ≤ 4800 chars and the compact fallback also passes | block budget (`goal-core.cjs:62`) |
| 7 | with the log anchor missing, the extractor falls back to the documented behaviour (body to EOF) **or** returns no slice — and the chosen branch is asserted, not accidental | half-edited files exist in the tree; "never guess" applies to content too |

Assertion 7 is the one the design must *decide*: given REQ-006's spirit (no auto-claiming) and the risk of
resending the log forever, the safer branch is "return no slice + emit a diagnostic; keep the last known
good slice for display". A body-to-EOF fallback would silently resend the entire log.

## Assessment

- `newInfoRatio`: 0.5 — the pipeline framing, the CJS/ESM portability seam, the `IF level:phase` trap, and
  the leak-test matrix are new; the individual caps and rules were established in iterations 2 and 4.
- Confidence: high on F2 (imports and file types verified) and F3 (template markers read). F5 is a designed
  test matrix, not evidence about current behaviour — it is a deliverable for the implementation follow-up.
- One sentence: one extractor, one slice, one hash, three consumers — with the phase conditional and the
  missing-log-anchor branch as the two places a careless strip would silently do the wrong thing.

## Reflection

- What worked: revisiting the template with the pipeline in mind surfaced the `IF level:phase` trap, which
  neither D3 first pass nor D4 named.
- What failed: the CommonJS/ESM seam is not resolvable by reading alone — it is stated as a seam with a
  fallback (duplicate + golden test), not as a verified integration.
- Ruled out: body-to-EOF fallback when the log anchor is missing (would resend the log), and a line-range
  slice (cannot resolve the phase conditional).

## Open gaps for the successor lineage (glm, iterations 11-15)

1. **Host injection caps** for pi, cursor, devin, claude, codex remain UNKNOWN (iteration 5, F5).
2. **Plugin drift**: whether `opencode-goal.js` should import the shared slice module or be reduced to an
   adapter is unresolved (iterations 5, 9).
3. **The `unbound` vocabulary**: the CLI already prints an unbound status for malformed legacy state; whether
   the new packet-unbound state reuses it or gets a distinct value needs a decision.
4. **Ratification mechanics** for the child→parent amendment path (iteration 7) — the rule is clear; the
   command-side UX is not designed here.

## Sources Consulted

- `.opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts` (8, 17)
- `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` (648)
- `.opencode/hooks/goal/lib/goal-core.cjs` (62, 370)
- `.opencode/plugins/opencode-goal.js` (43)
- `.opencode/hooks/goal/README.md` (31)
- `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` (16, 48, 65, 99)
- `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` (34, 63, 79)
- `.opencode/commands/speckit/assets/speckit-plan.yaml` (172)

## Recommended Next Focus

None — the lineage has reached its iteration cap. Next: phase synthesis, then the successor lineage's
verification of A5 and the budget arithmetic.
