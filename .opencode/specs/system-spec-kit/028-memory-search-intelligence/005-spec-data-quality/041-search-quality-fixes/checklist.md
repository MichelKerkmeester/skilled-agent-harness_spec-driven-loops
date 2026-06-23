<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Search-Quality Fixes

<!-- ANCHOR:checklist -->
## CHECKLIST

- [ ] CHK-001: Fix 1 lands; a gap-detecting search caps `good` to `weak` live (focused vitest + the fast-subset re-run).
- [ ] CHK-002: Recovery classification verified on a true gap; no unintended recovery on a non-gap.
- [ ] CHK-003: Fix 3 exposes retrieval-profile status separately; `weightsApplied` no longer doubles as class-profile status.
- [ ] CHK-004: Fix 4 shows a numeric score on graph and degree rows.
- [ ] CHK-005: Fix 5 default-off keeps ranking byte-identical; on, ranking is clock-free and reproducible.
- [ ] CHK-006: Fix 2 scores `cite_with_caveat` correct; the re-run `citeCorrect` returns near 1.0.
- [ ] CHK-007: Fix 6 count equals rows shown; leaf title renders.
- [ ] CHK-008: Full focused suite passes with no new failures; `validate.sh --strict` exits 0.
<!-- /ANCHOR:checklist -->
