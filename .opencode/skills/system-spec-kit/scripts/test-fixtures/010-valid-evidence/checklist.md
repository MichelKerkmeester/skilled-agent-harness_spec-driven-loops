<!-- SPECKIT_TEMPLATE_SOURCE: test-fixture -->
# Validation Checklist

## P0

- [x] Implement core feature [EVIDENCE: src/feature.js:12 created and `node --check src/feature.js` passed]
- [x] Add unit tests | Evidence: tests/feature.test.js:8 passing with 3/3 assertions
- [x] Browser verification complete (verified by `npm run test:browser` with 2/2 scenarios)

## P1

- [x] Documentation updated (tested with docs/feature.md:4 and `npm run lint:docs`)
- [x] Code review completed (confirmed in review-report.md:10 with 0 blocking findings)
- [ ] Performance optimization pending

## P2

- [ ] Nice-to-have feature (no evidence required for P2)
- [x] Optional cleanup [DEFERRED: will address in v2]
