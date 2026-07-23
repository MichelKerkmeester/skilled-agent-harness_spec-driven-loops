---
title: "Deep Research Strategy: Styles Naming and Manifest Consolidation"
description: "Detached five-iteration research strategy for kebab-case migration and single-manifest design."
importance_tier: important
contextType: research
---

# Deep Research Strategy: Styles Naming and Manifest Consolidation

## 1. RESEARCH TOPIC

Bring the styles backend into kebab-case conformance, produce an exact and safe rename/reference migration, and consolidate the crawl and retrieval manifests into one source of truth.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What exact directory and file rename map follows the naming canon, including every path named by the brief?
- [x] Which imports, path literals, scripts, tests, documentation, configuration, and generated references must change, and in what safe sequence?
- [x] What fields, invariants, and lifecycle roles differ between the crawl manifest and retrieval manifest schemas?
- [x] Which manifest should be canonical, which data should be derived, and how should hashes, provenance, and deterministic regeneration work?
- [x] What validation, rollback, and cutover plan proves the rename and consolidation do not break existing retrieval or generation paths?

<!-- /ANCHOR:key-questions -->

## 3. NON-GOALS

- Do not execute renames or change the researched styles backend.
- Do not decide whether SQLite becomes the default retrieval path; that belongs to the adjacent DB-fate packet.
- Do not restructure the 1,290 style directories beyond what is needed to explain manifest ownership and path effects.

## 4. STOP CONDITIONS

- Complete exactly five evidence-bearing iterations because `stopPolicy=max-iterations`.
- Produce an exact rename map, a reference-update/cutover plan, and one manifest consolidation design grounded in repository evidence.
- Preserve unresolved contradictions and implementation dependencies explicitly rather than inventing certainty.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What exact directory and file rename map follows the naming canon, including every path named by the brief?
- Which imports, path literals, scripts, tests, documentation, configuration, and generated references must change, and in what safe sequence?
- What fields, invariants, and lifecycle roles differ between the crawl manifest and retrieval manifest schemas?
- Which manifest should be canonical, which data should be derived, and how should hashes, provenance, and deterministic regeneration work?
- What validation, rollback, and cutover plan proves the rename and consolidation do not break existing retrieval or generation paths?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- exact-token searches anchored in the naming canon separated filesystem paths from unrelated underscore identifiers and exposed the dependency closure by responsibility. (iteration 1)
- tracing every writer and reader before interpreting sample JSON separated operational authority, derived publication, and database state instead of conflating three uses of “manifest.” (iteration 2)
- comparing ownership and publication mechanics rather than document richness exposed the minimum stable architecture—one manifest writer, shared pure projections, and purpose-specific generation identities. (iteration 3)
- starting from observable parity and rollback checkpoints exposed command ownership, computed paths, and bridge-deletion prerequisites that a source-reference list alone could not prove. (iteration 4)
- testing the plan backward from old readers and current resume metadata exposed failures hidden by forward-only source tracing. (iteration 5)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the first repository-wide bare-token search was noisy because `_db` and `_engine` are valid code identifiers outside this naming scope. (iteration 1)
- the first broad lifecycle grep included unrelated uses of “stable”; narrowing to manifest symbols and owner files removed that noise. (iteration 2)
- none of the three designs failed to be technically viable; the distinction required evaluating concurrency, stale-state, and compatibility costs rather than binary feasibility. (iteration 3)
- broad documentation grep under the style corpus was swamped by generated style prose; owner files and exact command tokens are the correct narrow scope. (iteration 4)
- the prior fixed match count and broad “spec history” category aged immediately and conflated completed evidence with active planning state. (iteration 5)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A broad styles-tree documentation search for generic words such as `status` was dominated by the 1,290 style artifacts and did not improve backend command discovery. Restricting command discovery to package manifests, backend/mode READMEs, and exact CLI tokens is the productive implementation-time method. [INFERENCE: the broad scoped Grep returned style-content matches before backend README commands] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A broad styles-tree documentation search for generic words such as `status` was dominated by the 1,290 style artifacts and did not improve backend command discovery. Restricting command discovery to package manifests, backend/mode READMEs, and exact CLI tokens is the productive implementation-time method. [INFERENCE: the broad scoped Grep returned style-content matches before backend README commands]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A broad styles-tree documentation search for generic words such as `status` was dominated by the 1,290 style artifacts and did not improve backend command discovery. Restricting command discovery to package manifests, backend/mode READMEs, and exact CLI tokens is the productive implementation-time method. [INFERENCE: the broad scoped Grep returned style-content matches before backend README commands]

### A permanent committed retrieval-manifest cache: viable as a migration bridge, but it preserves the duplicated physical manifest and stale-derived-file surface the consolidation is intended to remove. [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/check-stable.test.mjs:54-79] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A permanent committed retrieval-manifest cache: viable as a migration bridge, but it preserves the duplicated physical manifest and stale-derived-file surface the consolidation is intended to remove. [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/check-stable.test.mjs:54-79]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A permanent committed retrieval-manifest cache: viable as a migration bridge, but it preserves the duplicated physical manifest and stale-derived-file surface the consolidation is intended to remove. [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/check-stable.test.mjs:54-79]

### A permanently multi-writer physical manifest with writer-owned sections: viable only with locks, compare-and-swap, whole-document validation, and source-version binding, all of which add race and torn-generation failure modes without eliminating derived state. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:314-315] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:735-743] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A permanently multi-writer physical manifest with writer-owned sections: viable only with locks, compare-and-swap, whole-document validation, and source-version binding, all of which add race and torn-generation failure modes without eliminating derived state. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:314-315] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:735-743]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A permanently multi-writer physical manifest with writer-owned sections: viable only with locks, compare-and-swap, whole-document validation, and source-version binding, all of which add race and torn-generation failure modes without eliminating derived state. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:314-315] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:735-743]

### Assuming DB legacy-pointer normalization preserves an arbitrarily old rollback generation; retention is current plus one rollback target. [SOURCE: .opencode/skills/sk-design/styles/_db/operator.mjs:123-185] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Assuming DB legacy-pointer normalization preserves an arbitrarily old rollback generation; retention is current plus one rollback target. [SOURCE: .opencode/skills/sk-design/styles/_db/operator.mjs:123-185]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming DB legacy-pointer normalization preserves an arbitrarily old rollback generation; retention is current plus one rollback target. [SOURCE: .opencode/skills/sk-design/styles/_db/operator.mjs:123-185]

### Assuming the retrieval manifest is canonical because it is richer: its `crawlManifestHash` explicitly signals derivation from crawl state. [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:4] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Assuming the retrieval manifest is canonical because it is richer: its `crawlManifestHash` explicitly signals derivation from crawl state. [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:4]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming the retrieval manifest is canonical because it is richer: its `crawlManifestHash` explicitly signals derivation from crawl state. [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:4]

### Blindly rewriting changelogs and completed spec history: the canon requires those surfaces to retain historical names. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:56] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Blindly rewriting changelogs and completed spec history: the canon requires those surfaces to retain historical names. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:56]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Blindly rewriting changelogs and completed spec history: the canon requires those surfaces to retain historical names. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:56]

### Calling the DB command either fully confirmed or wholly absent: it is documented but inconsistent with its declared working directory. [SOURCE: .opencode/skills/sk-design/styles/manual-testing-playbook.md:13-39] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Calling the DB command either fully confirmed or wholly absent: it is documented but inconsistent with its declared working directory. [SOURCE: .opencode/skills/sk-design/styles/manual-testing-playbook.md:13-39]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Calling the DB command either fully confirmed or wholly absent: it is documented but inconsistent with its declared working directory. [SOURCE: .opencode/skills/sk-design/styles/manual-testing-playbook.md:13-39]

### Classifying every spec-folder hit as frozen history; packets 013 and 015 expose active continuity/planning references. [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/spec.md:35-42] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/spec.md:52-63] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Classifying every spec-folder hit as frozen history; packets 013 and 015 expose active continuity/planning references. [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/spec.md:35-42] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/spec.md:52-63]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Classifying every spec-folder hit as frozen history; packets 013 and 015 expose active continuity/planning references. [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/spec.md:35-42] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/spec.md:52-63]

### Combining naming moves and manifest-schema consolidation into one cutover: doing so would remove the name-only parity boundary and make regressions harder to attribute. [INFERENCE: two independent change dimensions require separate verification boundaries] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Combining naming moves and manifest-schema consolidation into one cutover: doing so would remove the name-only parity boundary and make regressions harder to attribute. [INFERENCE: two independent change dimensions require separate verification boundaries]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Combining naming moves and manifest-schema consolidation into one cutover: doing so would remove the name-only parity boundary and make regressions harder to attribute. [INFERENCE: two independent change dimensions require separate verification boundaries]

### Consolidating by taking a union of the two JSON schemas: field ownership spans mutable crawl state and independently canonical artifact content, so a union alone would create two writers for one document or force one subsystem to own data it does not produce. [INFERENCE: writer traces in `extract-refero.mjs` and `manifest.mjs` establish separate authorities] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Consolidating by taking a union of the two JSON schemas: field ownership spans mutable crawl state and independently canonical artifact content, so a union alone would create two writers for one document or force one subsystem to own data it does not produce. [INFERENCE: writer traces in `extract-refero.mjs` and `manifest.mjs` establish separate authorities]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Consolidating by taking a union of the two JSON schemas: field ownership spans mutable crawl state and independently canonical artifact content, so a union alone would create two writers for one document or force one subsystem to own data it does not produce. [INFERENCE: writer traces in `extract-refero.mjs` and `manifest.mjs` establish separate authorities]

### Deleting the retrieval bridge when the v2 writer lands: consumers must first move behind the shared projector and pass stale/missing bridge and DB parity gates. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:685-782] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:623-753] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Deleting the retrieval bridge when the v2 writer lands: consumers must first move behind the shared projector and pass stale/missing bridge and DB parity gates. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:685-782] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:623-753]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deleting the retrieval bridge when the v2 writer lands: consumers must first move behind the shared projector and pass stale/missing bridge and DB parity gates. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:685-782] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:623-753]

### No architecture design was retried; permanent multi-writer and permanent retrieval-cache targets remain blocked by iteration 3. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:63-71] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No architecture design was retried; permanent multi-writer and permanent retrieval-cache targets remain blocked by iteration 3. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:63-71]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No architecture design was retried; permanent multi-writer and permanent retrieval-cache targets remain blocked by iteration 3. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:63-71]

### No broad generic styles-tree documentation search was retried; exact legacy paths and current packet status supplied the needed classification without corpus prose noise. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:64-69] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No broad generic styles-tree documentation search was retried; exact legacy paths and current packet status supplied the needed classification without corpus prose noise. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:64-69]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No broad generic styles-tree documentation search was retried; exact legacy paths and current packet status supplied the needed classification without corpus prose noise. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:64-69]

### No exhausted approach should be promoted after this first pass; the narrowed exact-path search was productive. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No exhausted approach should be promoted after this first pass; the narrowed exact-path search was productive.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No exhausted approach should be promoted after this first pass; the narrowed exact-path search was productive.

### No new approach was exhausted. Reading sample JSON alone would not have established ordering, validation, or lifecycle guarantees; tracing writers/readers and checking the full corpus closed those gaps. [INFERENCE: code-level contracts and corpus-wide checks supplied facts absent from samples] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No new approach was exhausted. Reading sample JSON alone would not have established ordering, validation, or lifecycle guarantees; tracing writers/readers and checking the full corpus closed those gaps. [INFERENCE: code-level contracts and corpus-wide checks supplied facts absent from samples]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new approach was exhausted. Reading sample JSON alone would not have established ordering, validation, or lifecycle guarantees; tracing writers/readers and checking the full corpus closed those gaps. [INFERENCE: code-level contracts and corpus-wide checks supplied facts absent from samples]

### No permanent multi-writer or permanent retrieval-cache target was reconsidered; the adversarial evidence strengthens the need for one fail-closed writer and a temporary bridge. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:71-79] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No permanent multi-writer or permanent retrieval-cache target was reconsidered; the adversarial evidence strengthens the need for one fail-closed writer and a temporary bridge. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:71-79]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No permanent multi-writer or permanent retrieval-cache target was reconsidered; the adversarial evidence strengthens the need for one fail-closed writer and a temporary bridge. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:71-79]

### No productive architecture path was exhausted. The two weaker designs remain valid transitional/defensive patterns, but repository write and stale-guard behavior makes them inferior as the final ownership model. [INFERENCE: the comparison eliminated target designs by concrete concurrency and duplication costs rather than by assuming they are impossible] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No productive architecture path was exhausted. The two weaker designs remain valid transitional/defensive patterns, but repository write and stale-guard behavior makes them inferior as the final ownership model. [INFERENCE: the comparison eliminated target designs by concrete concurrency and duplication costs rather than by assuming they are impossible]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No productive architecture path was exhausted. The two weaker designs remain valid transitional/defensive patterns, but repository write and stale-guard behavior makes them inferior as the final ownership model. [INFERENCE: the comparison eliminated target designs by concrete concurrency and duplication costs rather than by assuming they are impossible]

### Requiring old and new generation-hash equality across the schema cutover: versioned input contracts intentionally change, so reproducibility and semantic parity are the valid proofs. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:194-206] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:623-635] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Requiring old and new generation-hash equality across the schema cutover: versioned input contracts intentionally change, so reproducibility and semantic parity are the valid proofs. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:194-206] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:623-635]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Requiring old and new generation-hash equality across the schema cutover: versioned input contracts intentionally change, so reproducibility and semantic parity are the valid proofs. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:194-206] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:623-635]

### Reusing current exact-byte `crawlManifestHash` as target semantic identity: current bytes reflect formatting and non-semantic row history; stable canonical JSON and length-framed hashes already exist in the DB subsystem. [SOURCE: .opencode/skills/sk-design/styles/_db/canonical.mjs:25-69] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:584-592] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reusing current exact-byte `crawlManifestHash` as target semantic identity: current bytes reflect formatting and non-semantic row history; stable canonical JSON and length-framed hashes already exist in the DB subsystem. [SOURCE: .opencode/skills/sk-design/styles/_db/canonical.mjs:25-69] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:584-592]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing current exact-byte `crawlManifestHash` as target semantic identity: current bytes reflect formatting and non-semantic row history; stable canonical JSON and length-framed hashes already exist in the DB subsystem. [SOURCE: .opencode/skills/sk-design/styles/_db/canonical.mjs:25-69] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:584-592]

### The initial repository-wide search for bare `_db`, `_engine`, and `_harness` produced unrelated identifiers outside `sk-design`; narrowing to filesystem-shaped tokens and the owning skill removed that noise. [INFERENCE: bare underscore identifiers are code identifiers outside the filesystem-naming scope] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The initial repository-wide search for bare `_db`, `_engine`, and `_harness` produced unrelated identifiers outside `sk-design`; narrowing to filesystem-shaped tokens and the owning skill removed that noise. [INFERENCE: bare underscore identifiers are code identifiers outside the filesystem-naming scope]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The initial repository-wide search for bare `_db`, `_engine`, and `_harness` produced unrelated identifiers outside `sk-design`; narrowing to filesystem-shaped tokens and the owning skill removed that noise. [INFERENCE: bare underscore identifiers are code identifiers outside the filesystem-naming scope]

### Treating crawl row order as semantic or deterministic: the writer preserves sitemap/history order and the committed array is sorted by neither UUID nor slug. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:103-115] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-399] [INFERENCE: bounded invariant check found both ordering predicates false] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating crawl row order as semantic or deterministic: the writer preserves sitemap/history order and the committed array is sorted by neither UUID nor slug. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:103-115] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-399] [INFERENCE: bounded invariant check found both ordering predicates false]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating crawl row order as semantic or deterministic: the writer preserves sitemap/history order and the committed array is sorted by neither UUID nor slug. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:103-115] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-399] [INFERENCE: bounded invariant check found both ordering predicates false]

### Treating leading-underscore backend paths as exempt: they are authored JavaScript/JSON filesystem names, not Python packages, tool-mandated names, generated output names, or frozen history. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:34] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating leading-underscore backend paths as exempt: they are authored JavaScript/JSON filesystem names, not Python packages, tool-mandated names, generated output names, or frozen history. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:34]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating leading-underscore backend paths as exempt: they are authored JavaScript/JSON filesystem names, not Python packages, tool-mandated names, generated output names, or frozen history. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:34]

### Treating retrieval JSON as the database indexer's current source: the indexer reads crawl bytes and artifacts independently. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:645-695] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating retrieval JSON as the database indexer's current source: the indexer reads crawl bytes and artifacts independently. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:645-695]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating retrieval JSON as the database indexer's current source: the indexer reads crawl bytes and artifacts independently. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:645-695]

### Treating successful import resolution as sufficient name-only proof: computed manifest paths, fixture joins, operator docs, and retrieval/DB outputs can remain stale after imports resolve. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:54-66] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/__tests__/motion-evidence.test.mjs:47-68] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating successful import resolution as sufficient name-only proof: computed manifest paths, fixture joins, operator docs, and retrieval/DB outputs can remain stale after imports resolve. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:54-66] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/__tests__/motion-evidence.test.mjs:47-68]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating successful import resolution as sufficient name-only proof: computed manifest paths, fixture joins, operator docs, and retrieval/DB outputs can remain stale after imports resolve. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:54-66] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/__tests__/motion-evidence.test.mjs:47-68]

### Treating the DB generation-pointer manifest as duplicate corpus truth: it points to immutable published DB artifacts and has independent rollback/legacy-reader responsibilities. [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:5-10] [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:121-153] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the DB generation-pointer manifest as duplicate corpus truth: it points to immutable published DB artifacts and has independent rollback/legacy-reader responsibilities. [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:5-10] [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:121-153]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the DB generation-pointer manifest as duplicate corpus truth: it points to immutable published DB artifacts and has independent rollback/legacy-reader responsibilities. [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:5-10] [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:121-153]

### Treating the old 46-file/140-reference number as a stable acceptance fixture; the live closure has already changed. [INFERENCE: current bounded count is 47/144] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the old 46-file/140-reference number as a stable acceptance fixture; the live closure has already changed. [INFERENCE: current bounded count is 47/144]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the old 46-file/140-reference number as a stable acceptance fixture; the live closure has already changed. [INFERENCE: current bounded count is 47/144]

### Updating frozen history to make exact-token searches globally clean: the naming canon requires historical surfaces to retain shipped names, so searches must classify allowed historical matches. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:56] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Updating frozen history to make exact-token searches globally clean: the naming canon requires historical surfaces to retain shipped names, so searches must classify allowed historical matches. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:56]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Updating frozen history to make exact-token searches globally clean: the naming canon requires historical surfaces to retain shipped names, so searches must classify allowed historical matches. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:56]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Assuming the retrieval manifest is canonical because it is richer: its `crawlManifestHash` explicitly signals derivation from crawl state. [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:4] (iteration 1)
- Blindly rewriting changelogs and completed spec history: the canon requires those surfaces to retain historical names. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:56] (iteration 1)
- Combining naming moves and manifest-schema consolidation into one cutover: doing so would remove the name-only parity boundary and make regressions harder to attribute. [INFERENCE: two independent change dimensions require separate verification boundaries] (iteration 1)
- No exhausted approach should be promoted after this first pass; the narrowed exact-path search was productive. (iteration 1)
- The initial repository-wide search for bare `_db`, `_engine`, and `_harness` produced unrelated identifiers outside `sk-design`; narrowing to filesystem-shaped tokens and the owning skill removed that noise. [INFERENCE: bare underscore identifiers are code identifiers outside the filesystem-naming scope] (iteration 1)
- Treating leading-underscore backend paths as exempt: they are authored JavaScript/JSON filesystem names, not Python packages, tool-mandated names, generated output names, or frozen history. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:34] (iteration 1)
- Consolidating by taking a union of the two JSON schemas: field ownership spans mutable crawl state and independently canonical artifact content, so a union alone would create two writers for one document or force one subsystem to own data it does not produce. [INFERENCE: writer traces in `extract-refero.mjs` and `manifest.mjs` establish separate authorities] (iteration 2)
- No new approach was exhausted. Reading sample JSON alone would not have established ordering, validation, or lifecycle guarantees; tracing writers/readers and checking the full corpus closed those gaps. [INFERENCE: code-level contracts and corpus-wide checks supplied facts absent from samples] (iteration 2)
- Treating crawl row order as semantic or deterministic: the writer preserves sitemap/history order and the committed array is sorted by neither UUID nor slug. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:103-115] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-399] [INFERENCE: bounded invariant check found both ordering predicates false] (iteration 2)
- Treating retrieval JSON as the database indexer's current source: the indexer reads crawl bytes and artifacts independently. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:645-695] (iteration 2)
- A permanent committed retrieval-manifest cache: viable as a migration bridge, but it preserves the duplicated physical manifest and stale-derived-file surface the consolidation is intended to remove. [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/check-stable.test.mjs:54-79] (iteration 3)
- A permanently multi-writer physical manifest with writer-owned sections: viable only with locks, compare-and-swap, whole-document validation, and source-version binding, all of which add race and torn-generation failure modes without eliminating derived state. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:314-315] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:735-743] (iteration 3)
- No productive architecture path was exhausted. The two weaker designs remain valid transitional/defensive patterns, but repository write and stale-guard behavior makes them inferior as the final ownership model. [INFERENCE: the comparison eliminated target designs by concrete concurrency and duplication costs rather than by assuming they are impossible] (iteration 3)
- Reusing current exact-byte `crawlManifestHash` as target semantic identity: current bytes reflect formatting and non-semantic row history; stable canonical JSON and length-framed hashes already exist in the DB subsystem. [SOURCE: .opencode/skills/sk-design/styles/_db/canonical.mjs:25-69] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:584-592] (iteration 3)
- Treating the DB generation-pointer manifest as duplicate corpus truth: it points to immutable published DB artifacts and has independent rollback/legacy-reader responsibilities. [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:5-10] [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:121-153] (iteration 3)
- A broad styles-tree documentation search for generic words such as `status` was dominated by the 1,290 style artifacts and did not improve backend command discovery. Restricting command discovery to package manifests, backend/mode READMEs, and exact CLI tokens is the productive implementation-time method. [INFERENCE: the broad scoped Grep returned style-content matches before backend README commands] (iteration 4)
- Deleting the retrieval bridge when the v2 writer lands: consumers must first move behind the shared projector and pass stale/missing bridge and DB parity gates. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:685-782] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:623-753] (iteration 4)
- No architecture design was retried; permanent multi-writer and permanent retrieval-cache targets remain blocked by iteration 3. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:63-71] (iteration 4)
- Requiring old and new generation-hash equality across the schema cutover: versioned input contracts intentionally change, so reproducibility and semantic parity are the valid proofs. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:194-206] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:623-635] (iteration 4)
- Treating successful import resolution as sufficient name-only proof: computed manifest paths, fixture joins, operator docs, and retrieval/DB outputs can remain stale after imports resolve. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:54-66] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/__tests__/motion-evidence.test.mjs:47-68] (iteration 4)
- Updating frozen history to make exact-token searches globally clean: the naming canon requires historical surfaces to retain shipped names, so searches must classify allowed historical matches. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:56] (iteration 4)
- Assuming DB legacy-pointer normalization preserves an arbitrarily old rollback generation; retention is current plus one rollback target. [SOURCE: .opencode/skills/sk-design/styles/_db/operator.mjs:123-185] (iteration 5)
- Calling the DB command either fully confirmed or wholly absent: it is documented but inconsistent with its declared working directory. [SOURCE: .opencode/skills/sk-design/styles/manual-testing-playbook.md:13-39] (iteration 5)
- Classifying every spec-folder hit as frozen history; packets 013 and 015 expose active continuity/planning references. [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/spec.md:35-42] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/spec.md:52-63] (iteration 5)
- No broad generic styles-tree documentation search was retried; exact legacy paths and current packet status supplied the needed classification without corpus prose noise. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:64-69] (iteration 5)
- No permanent multi-writer or permanent retrieval-cache target was reconsidered; the adversarial evidence strengthens the need for one fail-closed writer and a temporary bridge. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:71-79] (iteration 5)
- Treating the old 46-file/140-reference number as a stable acceptance fixture; the live closure has already changed. [INFERENCE: current bounded count is 47/144] (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Confirm indirect/runtime-computed path construction and the exact baseline/post-cutover validation command set. (iteration 1)
- Decide which data is canonical versus derived, and specify hash/provenance/deterministic-regeneration semantics. (iteration 1)
- Define rollback and cutover proof for both naming and later consolidation, including stale generated artifacts. (iteration 1)
- Map every field, invariant, and lifecycle role in both manifest schemas, including writer ownership and ordering guarantees. (iteration 1)
- Choose the canonical input model and derived projection boundary without losing resumable crawl lifecycle or artifact-derived retrieval data. (iteration 2)
- Complete the mutable/indirect reference sequence with executable validation commands. (iteration 2)
- Define two-stage cutover, stale-artifact detection, rollback, and proof obligations for naming first and consolidation second. (iteration 2)
- Which indirect/runtime-computed consumers, imports, mutable references, and generated paths must change, and what exact executable sequence updates them safely? (iteration 3)
- What baseline, cutover, stale-detection, rollback, and post-cutover proof demonstrates parity for naming first and consolidation second? (iteration 3)
- No original key question remains unanswered. Iteration 5 must challenge every prior conclusion for internal inconsistency, untested assumptions, omitted consumers, rollback asymmetry, and conflicts between name-only parity and v2 semantic migration; it must not synthesize early. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-config.json:3-10] (iteration 4)
- Implementation proof prerequisite: run and record the corrected engine/database glob commands; research confirms source ownership but not their exit status. (iteration 5)
- Residual external unknown: repository search cannot prove there are no installed or out-of-tree consumers; release notes must state the path/schema break or provide an explicitly time-bounded compatibility policy if such consumers exist. [INFERENCE: local exact search covers the repository, not external installations] (iteration 5)
- Implementation proof prerequisite: define and test the exact v2 validator/transition table, ID-to-slug migration, acquisition-bound projector reuse, and v2-to-v1 downgrade bytes. (iteration 5)
- No original reducer key question remains unanswered. (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

- The packet spec confirms `_db`, `_engine`, `_harness`, `_manifest.json`, and `_retrieval-manifest.json` are in scope and implementation is excluded. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/spec.md:50]
- The parent gap analysis identifies both manifests as listing 1,290 styles but serving crawl and DB-generation roles with different schemas. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md:44]
- Focused memory retrieval returned the active packet spec and no additional canonical decision record. [SOURCE: memory:sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests]
- `resource-map.md` is absent from the packet; the coverage gate is skipped.

## 14. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05, telemetry only before the hard iteration cap
- Per-iteration budget: 12 tool calls, 10 minutes
- Artifact root: detached `sol-high-fast` lineage only
- Reducer controls machine-owned sections; leaf iterations write only their narrative, state append, and delta.
