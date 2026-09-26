# Evidence archive v3

Status: **frozen**. Rust-language product support remains private, but the
language-neutral archive boundary it must use is no longer an implementation
candidate.

V3 is Supercov's sole evidence archive. It uses canonical sorted framing,
exact compact headers, a deterministic gzip envelope, strict path rules and
atomic publication. Three language-neutral entries are mandatory:

- `frontend.json`: one strict frontend-protocol-v2 run declaration;
- `coverage-model.json`: schema version 1 plus the report variant, model name,
  language, completeness meaning, measured surfaces and unmeasured surfaces.

This prevents a reader from silently applying JavaScript semantics to Python,
Rust, C/C++, Go or OCaml evidence. The frontend limitation references must still
exactly match manifest limitation IDs and the runner declarations must exactly
match normalized evidence before analysis. `frontend.json.language` must equal
`coverage-model.json.language`; a reader must reject the archive before
analysis if they differ.

Recognized JSONL evidence namespaces are fail-closed. Every non-empty line
must decode as the namespace's strict record type and every recognized JSONL
file must end with `\n`. A malformed record, blank record, partial final line,
unknown record field or missing final newline is fatal to the whole v3
measurement.

Product archives contain only Supercov-owned probe evidence. The frozen
frontend protocol can also frame native-import facts inside compile-gated
development oracle tests, but such archives are not accepted as user-run
measurement and are never a fallback product mode.

There is no legacy product reader or writer. JavaScript/TypeScript, owned Rust,
and every later language frontend emit this format. Freezing the archive does
not make any unfinished language frontend public.
