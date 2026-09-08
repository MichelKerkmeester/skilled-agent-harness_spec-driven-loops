# Iteration 007 — Version fields: parity test, staleness checker, changelog surface (RQ7)

- Angle: after the 010 version reconciliation — does every version-comparison surface now see every template, and are the versioned surfaces complete?
- Verdict: the manifest↔template parity is real and pinned (16/16 verified by read of markers + the parity suite's four assertions); the staleness checker's dead path is repaired and its grandfathering note landed; templateVersions has its documented consumer. What the paribus of the two tools misses: the checker compares exactly ONE of sixteen templates (spec.md.tmpl, and only spec.md's marker per folder), the flag/AC doc set is absent from the auto-upgrade list, and the changelog templates are a whole versioned-but-unversioned surface outside the manifest.
- Findings: 3 (all P2). Tool calls: 8/12.

## Verification summary (what landed)

| 010 claim | Evidence | Verdict |
|---|---|---|
| Manifest↔marker parity + pinned test | 16/16 markers match versions{} (read: core 4 v2.2, addons: acceptance-criteria/before-after/decision-record/goal/roadmap/timeline v2.2, debug-delegation/handover/research v1.0, resource-map v1.1, packet-types v2.2); template-version-parity.vitest.ts:46-53, 72-77 (parity + lazy-list equality), :81-87 (checker path) | CONFIRMED |
| Staleness checker path repaired | check-template-staleness.sh:65 `manifest_path="$TEMPLATE_DIR/spec-kit-docs.json"`; grandfathering note in header :8-11 | CONFIRMED |
| templateVersions consumer | level-contract-resolver.vitest.ts:94-95 (asserts values), :104 (serialization key) — the "stays for the test that already read it" disposition is true | CONFIRMED |

## Findings

### f-iter007-001 [P2] — the repaired staleness checker compares one template of sixteen
- THE CLAIM (checker contract): check-template-staleness.sh:5-7 — "Compares SPECKIT_TEMPLATE_SOURCE version in each spec folder against the current template version."
- WHAT THE CODE DOES: `get_current_template_version` reads only `manifest.versions["spec.md.tmpl"]` (:67-78); `get_folder_template_version` reads only `spec.md`'s marker (:81-91). A maintainer who bumps `goal.md.tmpl` (or tasks/plan/AC — any of the other 15) to a new version gets zero signal from the repository's only version-comparison tool: the folder stays "current" as long as its spec.md is v2.2. The parity suite pins templates, not rendered folders.
- SEVERITY: P2 (the tool's name says "template staleness" and its header says "each spec folder against the current template version" — the comparison is spec-only; behavior is safe, coverage is narrow).
- RECOMMENDATION: fix or document — compare per-document markers against their manifest versions (walk the folder's docs), or declare the spec-only scope in the header and help.

### f-iter007-002 [P2] — the changelog templates are a version-marked surface entirely outside the manifest
- THE CLAIM: template-guide.md:181-184 — changelog files are "generated from `templates/changelog/root.md` or `templates/changelog/phase.md`" — a documented template surface.
- WHAT THE CODE DOES: templates/changelog/root.md:12 and phase.md carry `SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0` / `changelog/phase.md | v1.0` markers, but neither template has a documents[] entry, a versions{} key (spec-kit-docs.json:4-22 — 16 entries, none for changelog), a lazy/optional list membership, or parity-test coverage (finder searches core/addons/packet-types only, template-version-parity.vitest.ts:31-39). Their marker composition name contains a slash, unlike every composed marker elsewhere ("spec-core + level2-verify…"). They are the only templates with markers no version map tracks.
- SEVERITY: P2 (a documented generation surface outside the version system the 010 lane just unified; the lane's own parity claim "compares them on every run" excludes them).
- RECOMMENDATION: document — declare changelog/*.md version-untracked in the manifest comment or EXTENSION-GUIDE (or add versions{} entries + the test's finder order).

### f-iter007-003 [P2] — the checker's --auto-upgrade doc set omits the two docs 010 just gave creators
- THE CLAIM: auto-upgrade updates version markers in a stale folder's docs.
- WHAT THE CODE DOES: check-template-staleness.sh:159-171 — the case list is spec.md, plan.md, tasks.md, decision-record.md, implementation-summary.md (5 docs). acceptance-criteria.md (scaffolded by default at L2/3/3+, create.sh:460-465) and goal.md (flag-scaffolded, :467-474) are not in it: a stale folder that is auto-upgraded moves its core five to current while leaving the two newest author docs at their old markers.
- SEVERITY: P2 (the auto-upgrade path is for legacy folders; the set it mutates is exactly the doc-set drift class found three times already this lane — f-iter003-005, f-iter005-001, and now here).
- RECOMMENDATION: fix — add the two docs (or document the deliberate scope).

## What worked
- Reading the checkpoint's claim ("classifies 7,807 documents") against the checker's actual input showed the unit (folders, one spec.md each) and the scope (spec.md only) in one pass — the "recount in this tree" discipline caught a scope the round-one corpus never tested.

## Ruled out (this iteration)
- templateVersions is consumerless after the new parity test: RULED OUT — level-contract-resolver.vitest.ts:94-95,104 reads it; the 010 disposition (kept for the test) is accurate.
- the v2.1 marker counter is a live template: RULED OUT — the only v2.1 mention is MIGRATION.md prose documenting the legacy format (EXTENSION-GUIDE §2's "accept v2.1 inline markers" is consistent).

## Carried questions
- CQ-009: templates/stress-test/ (findings-rubric.*) and templates/scratch/ — consume-check for the merge/drop angle (iteration 008).
