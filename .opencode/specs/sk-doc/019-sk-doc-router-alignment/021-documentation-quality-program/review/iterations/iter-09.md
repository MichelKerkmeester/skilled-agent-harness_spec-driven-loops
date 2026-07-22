# Iteration 9: code READMEs — sk-design

> dimension: accuracy | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

- **[P0] Extractor README documents bundle paths the script does not use**
  
  `.opencode/skills/sk-design/styles/scripts/README.md:58`
  
  Evidence: The README names `library/bundles/crawl-manifest.json` and `library/bundles/cursor/`. Actual code sets `STYLES_DIR` to `styles/`, `MANIFEST` to `styles/_manifest.json`, and reads `styles/cursor/` (`extract-refero.mjs:42-44,314,348`). Those legacy paths do not exist, while the documented bundle paths do. Running the documented extractor would write into the wrong directory; self-test cannot read its reference.
  
  Fix: Point `STYLES_DIR` at `styles/library/bundles`, use `crawl-manifest.json`, and update remaining `_harness`, `_manifest.json`, `styles/<slug>` and `../<slug>` references to the current `scripts/` and `library/bundles/` topology.

- **[P1] Fixture README has a stale export inventory and false consumer claim**
  
  `.opencode/skills/sk-design/design-md-generator/backend/tests/__fixtures__/README.md:18`
  
  Evidence: `study-cases.ts` additionally exports `STUDY_HYDRATED_CONTENT_HASH` and `SHORT_NORMALIZED_LEAK_DRAFT` (`:75,188`), which the inventory omits. Conversely, line 22 says the test imports every export, but `study-exemplars.test.ts:17-32` does not import `ADVERSARIAL_TOKENS` or `STUDY_CONTENT_HASH`.
  
  Fix: Add the two omitted exports and replace “imports every export” with the exact subset consumed by the test.

- **[P1] Offline-gate README understates its falsification coverage by half**
  
  `.opencode/skills/sk-design/design-mcp-open-design/fixtures/README.md:12`
  
  Evidence: Lines 12 and 22 say `runOfflineContractGate()` runs four mutated falsifiers. `offline-gate.mjs:60-120` runs eight: cache violation, allowed-field payload, missing receipt authority, forged transport authority, forged semantic alignment, raw return payload, duplicate evidence and unbound artifact evidence.
  
  Fix: Change the count to eight and list all eight checks.

- **[P1] Shared scripts README misstates checker implementations and imports**
  
  `.opencode/skills/sk-design/shared/scripts/README.md:12`
  
  Evidence: The README attributes procedure-card validation to Python, but it is implemented by `procedure-card-schema-check.mjs`. Lines 18 and 32 also claim every foundations checker, including `contrast_check.py`, imports `md_table.py`; `rg` finds no such import in `contrast_check.py`.
  
  Fix: Describe procedure-card and fingerprint validation as Node checks, and remove `contrast_check.py` from the `md_table.py` consumer list.

Adjacent observations: All Markdown links in the 12 newly added READMEs resolve. Three Node suites passed; four corpus suites were blocked only by the read-only sandbox rejecting `mkdtemp`, so those failures were not treated as findings.

Review status: REQUESTED_CHANGES
