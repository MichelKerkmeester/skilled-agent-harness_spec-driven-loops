# Tasks

## Completed

- [x] Run required import audit and record baseline.
- [x] Scaffold packet 019 documentation.
- [x] Move 4 advisor prompt hook implementations into `system-skill-advisor/hooks`.
- [x] Add process-boundary spec-kit hook stubs for runtime compatibility.
- [x] Add advisor hook build coverage.
- [x] Move 4 requested skill-graph tests to advisor.
- [x] Move advisor rebuild and hook tests that consumed moved advisor code.
- [x] Move requested advisor stress files and broader stranded advisor stress coverage.
- [x] Add advisor stress vitest config.
- [x] Delete `sqlite-integrity` neutral re-export from spec-kit.
- [x] Convert `skill-label-sanitizer` to a local spec-kit utility.
- [x] Drop advisor tool schemas and contract-key imports from spec-kit.
- [x] Keep plugin bridge as MCP/process gateway.
- [x] Replace remaining spec-kit type-only advisor imports with local structural types.
- [x] Run exact import audit: zero lines.
- [x] Run broad source import audit: only plugin gateway imports remain.
- [x] Run both typechecks: pass.
- [x] Run both builds: pass.
- [x] Run advisor moved unit tests: pass.
- [x] Run advisor stress smoke: pass.
- [x] Run hook smoke: pass.
- [x] Run `opencode mcp list`: 6/6 connected.

## Blocked

- [ ] Full advisor `npm test`: blocked by existing graph-health and old spec-path failures.
- [ ] Full spec-kit `npm test`: blocked by existing broad-suite failures outside this packet.
- [ ] Strict-validate 019 and parent after final packet metadata is settled.
- [ ] Commit and push after verification gates are green or operator explicitly changes the gate.
