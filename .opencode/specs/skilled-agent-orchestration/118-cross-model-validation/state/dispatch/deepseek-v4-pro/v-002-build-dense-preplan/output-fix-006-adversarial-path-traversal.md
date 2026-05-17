Let me run the acceptance tests against the current code to see if it already passes or needs changes.Now let me run the grep-based acceptance checks:```
<pre-plan>
Step 1 — Audit current seed
  Inputs:  read-config.cjs (20 lines), config.json, task.json
  Outputs: Identified existing path-resolution + startsWith guard at lines 11-17
  Acceptance: Code already contains resolve+startsWith; no naive readFileSync(rawInput)
  Verify:   rg 'path\.resolve|startsWith' read-config.cjs → count ≥ 1
  Stop:     If grep returns 0 matches ⇒ needs implementation; otherwise continue to Step 2

Step 2 — Verify ac-001 deterministic rejection
  Inputs:  read-config.cjs, adversarial argument '../../../../etc/passwd'
  Outputs: Exit code ≠ 0, stderr "Path traversal rejected"
  Acceptance: Script exits non-zero and prints rejection message
  Verify:   node read-config.cjs '../../../../etc/passwd'; echo "EXIT: $?" → EXIT: 1
  Stop:     If exit 0 ⇒ traversal bypass exists, fix required; else proceed

Step 3 — Verify ac-003 grep_absent (no naive read of unvalidated input)
  Inputs:  read-config.cjs source
  Outputs: Confirmed fs.readFileSync uses resolvedPath (validated), not raw targetPath
  Acceptance: Pattern `fs\.readFileSync\([a-zA-Z_]+\)` returns zero hits
  Verify:   rg 'fs\.readFileSync\([a-zA-Z_]+\)' read-config.cjs; echo "EXIT: $?" → EXIT: 1 (no match)
  Stop:     If grep finds a hit ⇒ vulnerable; must refactor to validate before read

Step 4 — Full acceptance suite + valid-path regression
  Inputs:  read-config.cjs, config.json, task.json acceptance block
  Outputs: All three acceptance criteria confirmed passing; valid-path read returns JSON
  Acceptance: ac-001 PASS, ac-002 PASS (3 matches), ac-003 PASS (0 hits), valid config.json still returns JSON on exit 0
  Verify:   node read-config.cjs config.json → prints valid JSON with exit 0
  Stop:     If any AC fails or valid-path regresses ⇒ halt and report
</pre-plan>
```

**ac-001** — deterministic rejection: `node read-config.cjs '../../../../etc/passwd'` → exit 1, `Path traversal rejected`

**ac-002** — path validation present: 3 grep matches for `path\.resolve|startsWith|…` pattern

**ac-003** — no naive read: `fs\.readFileSync\([a-zA-Z_]+\)` returns 0 hits (resolvedPath used after validation)

**Valid-path regression**: `node read-config.cjs config.json` → exit 0, emits config JSON