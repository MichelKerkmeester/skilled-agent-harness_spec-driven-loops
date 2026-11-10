# Iteration 008 — Compatibility and blast radius

- **Focus (charter 8):** What each candidate does to the 4,548 existing `spec.md` files, validators, templates, hooks, the trigger index and the advisor. Additive or migration.
- **Status:** complete
- **NewInfoRatio:** 0.75
- **Novelty:** First system-by-system blast-radius pass with the compatibility mechanics named (fail-closed corpus walker, 40-rule registry, warn-only hooks, grandfathering precedents) and an additive-versus-migration verdict per candidate.

## Cross-cutting compatibility mechanics

- **B1 — The corpus is the constraint.** 4,548 `spec.md` files and 23,413 non-archive markdown docs under `specs/`. Any *required* structural or frontmatter change is a multi-thousand-document migration; any *optional* addition is additive. Precedents for compatibility: the frontmatter grandfather allowlist (`check-frontmatter.sh:23,114-115`), the closure cutoff (`validation-rules.md:83-88`), and version-marked templates (`spec.md.tmpl:30-49`).
- **B2 — Validators are one registry.** 40 rules in `validator-registry.json`, run per packet by `validate.sh` (which delegates to the orchestrator and implements no rules itself, `validate.sh:8-9`); strict-only rules exist. A new rule is a new registry entry plus a shipping check; changing an existing rule's severity or preconditions is what breaks old packets.
- **B3 — The trigger index fails closed.** The corpus walker excludes `z_archive`, `node_modules`, `scratch`, `.git`, `dist` (`corpus.mjs:104`) and fixtures; unparseable frontmatter "fails publication closed for the whole corpus" (`corpus.mjs:117` comment). Any new file family under `specs/` either carries parseable frontmatter or must be added to the exclusion table with a matching divergence-test update (the parity test is named in `retrieval-conventions.md:271`).
- **B4 — Hooks do not block on content shape.** Post-edit quality is warn-only by contract ("the edit itself is never blocked", `post-edit-quality/README.md`), running a frontmatter checker among others. Git gates apply at commit, not at write. New optional keys do not add a hook failure path.
- **B5 — The advisor is out of the blast radius.** Skill routing reads skill `graph-metadata.json`; packet docs feed it only when `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (iteration 3, F3). None of the candidates touch skill metadata.

## Per-candidate verdicts

### C1 — Typed concepts → **additive, if optional**

- Existing docs: extra frontmatter keys are tolerated — `FRONTMATTER_VALID` validates required values only and never rejects unknown keys (`check-frontmatter.sh:105-115`). Untouched.
- Templates: add the key to the five core blocks (`spec.md.tmpl:2-18`); bump the template-source version so new docs are honestly marked. Old docs keep their marker.
- Validators: adding `type` to the required list would fail essentially every existing core doc (grandfather allowlist or migration); leaving it optional is the only additive path.
- Index/hooks/advisor: no effect.
- **Blast radius: additive (S) if optional; migration of 23,413 docs (L) if required.**

### C2 — Per-folder `index.md` → **additive mechanics, broad surface**

- New files land under `specs/`: the corpus walker indexes every non-excluded `.md`, and OKF's `index.md` carries **no frontmatter** (`okf-SPEC.md:512-514`) — exactly the fail-closed case B3 names. Either the walker gains an exclusion (plus divergence-table test) or the generated index gets a parseable empty frontmatter, diverging from OKF §8.
- Validators: a new shape/coverage rule would join the 40-rule registry; `LINKS_VALID` (`validator-registry.json:411`) must accept generated links; the generate/refresh lifecycle adds a drift class comparable to `GENERATED_METADATA_DRIFT`.
- 4,548 packets → at least that many new files if generated per packet.
- **Blast radius: additive per change, but broad and drift-prone (M); no migration of existing docs.**

### C3 — `log.md` → **additive, obligation-carrying**

- No existing `log.md` under `specs/` (0 found); same frontmatter/exclusion question as C2.
- Existing `changelog/` (30 dirs) and git history are unaffected; a new file family adds writer obligations, not validator breakage.
- **Blast radius: additive (S/M); benefit already rejected in iteration 7.**

### C4 — `sources` frontmatter → **additive**

- Optional frontmatter block: tolerated by `FRONTMATTER_VALID`; the grep-convention retrofit may create only keys its table permits (`grep-convention.md:82-90`), so the field must be added to that table before any mechanical pass.
- A resolution rule (verify `resource` paths exist) is a new opt-in rule: packets without the field stay green.
- Keep it authored-only: do not copy into `description.json`/`graph-metadata.json`, or the strict-only generated-metadata integrity checks and their drift rules (`GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT` in the registry) must be updated together — the known double-owner failure of iteration 6 D3.
- Index/hooks/advisor: no effect; no regeneration needed.
- **Blast radius: additive (S for the field, S/M with the rule).**

### C5 — `stale_after` (and rejected `verified`) → **additive, narrow**

- Optional key + one consumer; the `CONTINUITY_FRESHNESS` precedent is opt-in strict-only (`validation-rules.md:57`), so the compatibility pattern already exists.
- Do not put staleness into the generated pair; derive it at read time from the authored key (keeps writers unchanged).
- `verified` would add event storage with no owner: the save writer is single-writer by contract (`save-workflow.md:296-298`) and the closure gates already hold verification evidence (`SKILL.md:444-458`). Migration-free but semantically duplicative.
- **Blast radius: additive (S/M) for `stale_after`; additive but unjustified for `verified`.**

### C6 — Bundle export (import rejected) → **additive, zero in-repo surface**

- Export reads packets and writes a bundle tree; it changes no validator, template, hook or index — provided the output directory stays outside `specs/` and outside the indexed roots, or the exported copies re-enter the trigger index as duplicate postings (B3).
- Import is structurally blocked: `description.json`, `graph-metadata.json` and `_memory.continuity` have no OKF representation (iteration 7 negative knowledge), so a round-trip would drop the metadata the save pipeline depends on; import also lands docs that must satisfy every rule (placeholders, anchors, levels, links).
- **Blast radius: export additive (M); import migration-class and rejected.**

### C7 — Actor convention → **additive**

- `last_updated_by` is a free string today (`save-workflow.md:309`); prefixing new saves with `human:` / `process:` / `producer/version` (`okf-SPEC.md:489-502`) needs the writer to accept and document it, no validator change, no backfill (existing values remain readable).
- **Blast radius: additive (S).**

## Summary table

| Candidate | Existing docs | Validators | Templates | Hooks | Trigger index | Advisor | Verdict |
|---|---|---|---|---|---|---|---|
| C1 type (optional) | untouched | optional key only | +1 key, version bump | none | none | none | Additive (S) |
| C1 type (required) | 23,413-doc migration | required-list change | same | none | none | none | Migration (L) — reject |
| C2 index.md | new files only | +1 rule, LINKS_VALID | none | none | exclusion or frontmatter | none | Additive/broad (M) |
| C3 log.md | new files only | +1 rule | none | none | same as C2 | none | Additive (S/M) |
| C4 sources | untouched | opt-in rule | +1 block | none | none | none | Additive (S/M) |
| C5 stale_after | untouched | opt-in rule | +1 key | none | none | none | Additive (S/M) |
| C6 export | none | none | none | none | output dir discipline | none | Additive (M) |
| C7 actor convention | none | none | none | none | none | none | Additive (S) |

## Sources

- `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter.sh:23, 105-115]`
- `[SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:57, 83-88]`
- `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:8-9]`
- `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:104, 117]`
- `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json]` (40 rules; `LINKS_VALID` :411; `GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT`)
- `[SOURCE: .skilled/hooks/post-edit-quality/README.md]` — warn-only contract; frontmatter checker among routed checkers
- `[SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:271]` — coverage-parity test
- `[SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:296-309]`
- `[SOURCE: .skilled/skills/system-spec-kit/references/structure/grep-convention.md:82-90]`
- `[SOURCE: scratch/seed/okf-SPEC.md:489-502, 512-514]`
- Counts: 4,548 `spec.md`; 23,413 non-archive docs; 40 registry rules; 10 existing `index.md`; 0 `log.md` (measured 2026-10-04).

## Open questions carried forward

- Does the required-vs-optional typing fork change under adversarial pressure? (iteration 9)
- Should existing packets be promoted to any adopted surface, or only new packets? (iteration 10 proposed shape)

## Next focus

Iteration 9 — Adversarial counter-case: argue against adoption. OKF weaknesses, cases where spec-kit is already better, cheaper alternatives that solve the same problem.

## Negative knowledge (tried, failed / dead ends)

- Import direction re-confirmed blocked at the validator level (every rule would fire on imported docs; generated sidecars unmappable). No further work; recorded once more so iteration 9 cannot accidentally revive it.
