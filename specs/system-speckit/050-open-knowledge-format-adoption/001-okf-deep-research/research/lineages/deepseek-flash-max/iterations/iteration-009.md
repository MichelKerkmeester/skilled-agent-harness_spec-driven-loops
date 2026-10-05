# Iteration 009 — Adversarial counter-case

- **Focus (charter 9):** Argue against adoption. OKF weaknesses, cases where spec-kit is already better, cheaper alternatives that solve the same problem.
- **Status:** complete (adversarial/analytical)
- **NewInfoRatio:** 0.65
- **Novelty:** First deliberate attack on the adoption case; adds the conformance-tooling census (16 repos, no canonical suite) and the "self-declared trust" argument; separates the format from its four salvageable ideas.

## The case against adoption, strongest form

### A1 — OKF's conformance floor is far below spec-kit's existing contract

OKF conformance is three permissive rules: parseable frontmatter, non-empty `type`, reserved-file structure (`okf-SPEC.md:736-744`). Consumers are instructed **not** to reject for missing optional families, unknown types, unknown keys, broken links or missing indexes (`okf-SPEC.md:749-762`). An "OKF-conformant" document can be a heading with `type: X`. Spec-kit enforces 40 registry rules including file existence, placeholders, anchors, closure and fingerprints (`validator-registry.json`; `SKILL.md:444-458`). Adopting OKF's floor as the packet format would lower a working contract.

### A2 — The trust machinery is self-declared and advisory by design

Trust tiers key off a literal `human:` prefix (`okf-SPEC.md:489-502`); nothing verifies that a human wrote it, and the spec says so: "Trust tiers are advisory signals, not access control" (`okf-SPEC.md:409-410`). `usage_count` is a coarse, self-reported liveness signal (`okf-SPEC.md:336-341`). Spec-kit's verification evidence is anchored to accountable artifacts instead: the tasks checklist, the acceptance-criteria closure gate, and review reports. A `verified` field that any writer can mint and no validator enforces is a weaker truth than the gates spec-kit already blocks completion on.

### A3 — Version churn is a live cost, not a hypothetical

OKF was announced as v0.1 on 2026-06-12 (blog article); the canonical repository now ships v0.2 with two named breaking renames — `timestamp` → `generated.at` and the body `# Citations` list → `sources` (`okf-SPEC.md:796-812`) — in a format the announcement itself calls "a starting point, not a finished standard". A repository that stakes its document schema on OKF couples its own upgrade cadence to a standard moving this fast. Spec-kit's internal formats advanced in controlled steps (template v2.2 with grandfather windows, `validation-rules.md:83-88`).

### A4 — The distinctive feature is a contract with no enforcement layer

`Attested Computation` is OKF's most original contribution, and its runtime protocol is explicitly deferred: receipt and verdict wire formats, the attester ABI, portability and sandboxing, attestation caching, semantic-layer templates — all "intentionally left to a future revision" (`okf-SPEC.md:782-793`). Adopting the concept today means adopting fields whose checking story does not exist yet.

### A5 — "OKF-compatible" is weakly comparable across implementations

The GitHub census found 370 repositories and 16 conformance-tooling repositories (e.g. `Sudhakaran88/okf-conformance` 16★, `chris-page-gov/okf-explorer` 7★, plus zero-star validators); no canonical suite, registry or certification was found in reviewed sources (UNKNOWN: none discovered). The spec's own `acme_retail` bundle carries a `log.md` frontmatter convention beyond §9 (iteration 4, F5). Interop claims rest on convention compliance, which is exactly what a three-rule conformance cannot enforce.

### A6 — No addressing, no levels, no gates, no retrieval

OKF contributes no line-addressable anchors (`grep-convention.md:191-213` is spec-kit's), no level contracts, no completion gates, no retrieval tooling. Its `index.md` is a convenience the Phase Documentation Map and trigger index already approximate (iterations 3, 7). For everything spec-kit does natively, OKF is additive overhead; for interchange, an exporter suffices.

### A7 — Single-owner violation: a second truth for trust and freshness

Spec-kit deliberately splits authored frontmatter, generated sidecars and machine-owned continuity (`save-workflow.md:296-298`). OKF-style `verified`/`stale_after` would either be authored (and ignored, because no consumer enforces them) or machine-written (and duplicate the continuity writer and closure gates). OKF itself tolerates their absence silently (`okf-SPEC.md:749-753`), so the fields would decay into decoration.

### A8 — The ecosystem argument is about consumption, not production

The 370 repos overwhelmingly *consume* bundles (viewers, search, MCP tools, wikis — iteration 5 F3). Interop therefore requires spec-kit to **produce** OKF where others can read it — a one-way exporter — not to become OKF in place. Export is zero-surface against the packet corpus (iteration 8, C6) and reversible; in-place adoption is a multi-thousand-doc migration class.

### A9 — Vendor concentration, honestly stated

Published by Google Cloud, first industrial consumer Knowledge Catalog, reference agent BigQuery-first, three of four sample bundles from Google datasets. The spec's neutrality is a design commitment, and independent implementations exist, but the observed gravity is Google-anchored. Not decisive; a risk to price, not a reason alone to reject.

## Steelman for adoption, answered

| Pro-adoption argument | Answer |
|---|---|
| The ecosystem is real (370 repos) and compounds | Captured by a one-way exporter; no corpus migration needed (A8) |
| `sources` and staleness are useful ideas | Adopt them as spec-kit-local conventions; they do not require OKF (separability, below) |
| Knowledge Catalog ingest gives enterprise reach | Reach is a consumer concern; an export command can target OKF-compatible consumers |
| Generic frontmatter is cheap to add | Cheap to add, expensive to keep true; unenforced fields decay (A2, A7) |
| Future-proofing against format fragmentation | Coupling to a fast-moving external format is the opposite of stability (A3) |

## Cases where spec-kit is already better (consolidated)

Levels and packet shapes; 40-rule validation; anchors with stable line addresses; phase parents with pointers; generated metadata with source fingerprints; committed, service-free trigger index (13,150 paths / 33,666 phrases); literal retrieval contract with exit-status semantics; two completion gates; skill advisor graph. None of these has an OKF equivalent (iteration 6, section C).

## Cheaper alternatives that solve the same problems

- **P1 — Provenance:** optional `sources` frontmatter on research/review artifacts + one resolution rule; a local convention, no format dependency (iteration 7, C4).
- **P2 — Freshness:** `stale_after`-style key on decay-prone artifacts, surfaced by doctor/resume; keep out of the generated sidecars (iteration 7, C5).
- **P3 — Progressive disclosure:** keep Phase Documentation Map; no new file family (iteration 7, C2/C3).
- **P4 — Interchange:** one-way export command; output outside indexed roots (iteration 7, C6).
- **P5 — Trust:** keep closure gates; if a trust signal is wanted, derive it from existing evidence (review reports linked in acceptance criteria) rather than a new self-declared field.

## Adversarial verdict

- **Reject:** OKF as the packet format; required OKF frontmatter families on core docs; `Attested Computation`; bundle import; per-folder `index.md`/`log.md` as new file families.
- **Adopt as ideas, not as format:** structured provenance (`sources` shape), freshness marker, actor convention, one-way export. Each stands on its own without OKF and survives removal of the format dependency.
- **Net:** the correct relationship is **interoperate, don't absorb** — spec-kit keeps its contract and gains a producer-side bridge.

## Sources

- `[SOURCE: scratch/seed/okf-SPEC.md:336-341, 409-410, 489-502, 736-762, 782-793, 796-812]`
- `[SOURCE: https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing]` — "a starting point, not a finished standard".
- `[SOURCE: https://api.github.com/search/repositories?q=okf+conformance]` — 16 repos; no canonical suite observed (2026-10-04).
- `[SOURCE: https://api.github.com/search/repositories?q=open+knowledge+format+okf]` — 370 repos.
- `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json]` — 40 rules.
- `[SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:83-88]`; `[SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:296-298]`; `[SOURCE: .skilled/skills/system-spec-kit/references/structure/grep-convention.md:191-213]`

## Open questions carried forward

- Which adversarial points survive if the format is adopted only at the artifact boundary (research/review)? (iteration 10)
- Is a trust signal derivable from existing evidence without a new field? (iteration 10 proposal)

## Next focus

Iteration 10 — Synthesis: ranked recommendations, each adopt / adapt / reject with evidence, effort, risk, and a proposed shape for phase 002.

## Negative knowledge (tried, failed / dead ends)

- Attempted to find a canonical OKF conformance suite or certification body: none found in reviewed sources; recorded as UNKNOWN rather than "does not exist".
- Attempted to steelman `verified` as machine-checkable: the spec makes it advisory by construction (self-declared actors), so the steelman fails on the spec's own text.
