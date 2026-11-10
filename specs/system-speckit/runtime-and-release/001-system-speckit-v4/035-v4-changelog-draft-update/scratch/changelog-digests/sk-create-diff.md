# sk-create-diff changelog digest

Skill path: `.opencode/skills/sk-doc/sk-create-diff/` · Versions covered: v1.0.0.0 through v1.1.2.0 (all 4 entries, fewer than 10 exist) · Date range: 2026-07-13 to 2026-08-04

---

## Per version, newest first

### v1.1.2.0 (2026-08-04) - Purpose-first README rewrite

`v1.1.2.0.md` records a documentation-only release. The README was rewritten onto the refined skill README template with the `mcp-obsidian` pilot as the exemplar: a one-line pitch blockquote, an AT A GLANCE block first, a problem-first OVERVIEW and numbered all-caps sections with dividers. A Format Fidelity Layer table was added covering plain text, Markdown, HTML, DOCX and text-layer PDF at their stated tiers. The Human Voice greps were cleared on the README body (zero em dashes, zero semicolons, zero Oxford commas, zero banned words). The README version field was bumped from `1.0.0.0` to `1.1.2.0` to catch up with the changelog head. The entry states no behavior change: engine, CLI surface, exit codes, report format and every reference file stay untouched.

### v1.1.1.0 (2026-07-20) - Multi-file boundary dividers

`v1.1.1.0.md` makes file transitions unmistakable inside aggregate before/after reports. It adds strict validation for pre-composed aggregate pairs requiring at least two unique, ordered, path-matched file envelopes, preserves every recognized boundary through collapsed context, and renders full-width `START FILE` and `END FILE` row groups in both the unified and side-by-side views using the existing safe HTML dialect and design tokens. A 32px canvas-colored, accessibility-inert gap now precedes every file after the first so a start band no longer attaches to the preceding diff. Markdown section context resets at file transitions so one file's heading cannot label the next file's changes, malformed or incidental marker text stays on the ordinary document path, and regression coverage was added for both views, collapse behavior, malformed envelopes, hostile path escaping and cross-file heading isolation. The entry is explicit that the CLI still compares one before document with one after document: native directory comparison and repeated multi-file CLI arguments remain out of scope, and snapshot behavior, diff statistics, extraction fidelity, the CSP and command assets are unchanged.

### v1.1.0.0 (2026-07-15) - Functional engine

`v1.1.0.0.md` turns the mode from a preview-gated orchestration stub into a working self-contained document diff mode by shipping the comparison engine inside the packet. It adds `scripts/create_diff.py`, a Python 3 standard-library engine with format extraction for plain text and Markdown at full fidelity, HTML and DOCX at visible or structural text, and text-layer PDF through `pdftotext`, `pypdf` or `pdfplumber` when available, each carrying an explicit fidelity tier and warnings. BREAKING for anyone who fed it arbitrary files: unsupported binary office, media and archive formats such as `.xlsx`, `.pptx`, `.png` and `.zip`, plus any file with binary content, now exit `3` instead of being raw-byte diffed into a meaningless report, while unknown text-like extensions still fall back to text with a stated assumption. The release also adds a deterministic line-level diff with inline word-level highlighting and a cheap move heuristic, content-addressed baseline snapshots via `snapshot` and `compare`, an explicit-pair fallback `compare-pair`, lifecycle commands `status`, `cleanup` and `capabilities`, and a self-contained zero-JavaScript accessible HTML report with a restrictive CSP, escaped source content, dark and light support and `SOURCE_DATE_EPOCH` honoring for byte-reproducible output. It adds `scripts/validate_report.py` to assert a report is safe and self-contained, plus `references/`, `assets/fixtures/`, a `feature-catalog/` of 8 per-feature files across 3 categories and a `manual-testing-playbook/` of 11 deterministic scenario files across 3 categories. REMOVED: the SKILL.md and README.md preview language about a pending engine was deleted in the rewrite, and the architecture note records ADR-002 as a documented amendment away from a separate portable npm package toward stdlib scripts embedded in the skill. The entry states that at this point `/create:diff` remained optional and unbuilt, that the mode routed through advisor aliases and direct script invocation, that there is still no packet-local `graph-metadata.json` or `description.json`, and that scanned or image-only PDF OCR stays out of scope.

### v1.0.0.0 (2026-07-13) - Preview registration

`v1.0.0.0.md` is the initial PREVIEW registration of `create-diff` as a nested `sk-doc` workflow mode, shipped as an orchestration wrapper for an engine that did not exist yet (pending packet 136 phases 002 to 005). It contained a preview SKILL.md contract, a README.md and registration in the hub `mode-registry.json` and `hub-router.json`. The entry notes the mode was preview-gated with conservative aliases and carried no packet-local `graph-metadata.json`.

---

## Facts the v4 draft gets wrong or misses

- The draft never mentions the format fidelity tiers or the honest-refusal behavior, both central to what the mode actually does. `v1.1.0.0.md` documents five supported formats at three fidelity levels and a hard exit `3` on binary input. Draft line 143 describes only "compares a before-and-after document without git and produces a self-contained, shareable HTML report".
- The draft misses the multi-file aggregate capability entirely. `v1.1.1.0.md` adds validated `START FILE` and `END FILE` boundary bands for pre-composed aggregate pairs, which is the difference between reviewing one file and reviewing a whole edit set. Nothing at draft lines 32 or 143 refers to it.
- The draft misses the standing single-pair limit. `v1.1.1.0.md` states the CLI still compares one before document with one after document and that native directory comparison is out of scope. A reader of draft line 143 would reasonably assume directory diffing works.
- Draft line 32 places the diff "under `/create:*`", and draft line 132 counts twelve of fourteen packets bound to a command, but no changelog entry records the command being built. `v1.1.0.0.md` is the last entry to speak to it and says `/create:diff` "remains optional and unbuilt". The command file does exist today at `.opencode/commands/create/diff.md` and `mode-registry.json` line 384 binds `/create:diff`, so the draft is correct about the current repo. The gap is in the changelog, which never records the build, so the draft claim has no changelog provenance.
- The draft misses that the mode shipped twice: a preview-gated stub in `v1.0.0.0.md` on 2026-07-13 with no engine, then the functional engine in `v1.1.0.0.md` on 2026-07-15. Draft line 143 presents it as one arrival.
- The draft misses the zero-install, zero-network property. `v1.1.0.0.md` ADR-002 chose Python-stdlib scripts embedded in the skill over a separate npm package precisely so the mode works with no install, which is a stronger claim than "self-contained".
- No factual error was found in what the draft does assert about `sk-create-diff`. Every draft statement checked against these four entries is consistent with them.

---

## Current version and identity

- Version in `SKILL.md` frontmatter: `1.1.2.0` (matches the changelog head `v1.1.2.0.md`).
- Identity: a MODE, not a hub and not standalone. `sk-create-diff/` has no `mode-registry.json` and no root metadata JSON of its own. Its parent `.opencode/skills/sk-doc/` carries `mode-registry.json`, `hub-router.json`, `graph-metadata.json` and `description.json`, and registers this packet at `workflowMode: "sk-create-diff"` with `packetKind: "workflow"`. Both `SKILL.md` and `v1.1.0.0.md` state the packet must not add packet-local advisor metadata such as `graph-metadata.json` or `description.json`.
