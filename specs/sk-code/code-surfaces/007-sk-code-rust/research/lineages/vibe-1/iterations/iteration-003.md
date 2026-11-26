# Iteration 3: How docs/types.md maps values across the bridges

## Focus

Key question 3: how `docs/types.md` maps values across napi-rs, PyO3, the C ABI and the other bridges.

**Source path note.** The topic names `specs/z_external-repo-library/rust-anything-main`, which does not exist in this worktree. Every rust-anything citation below uses the readable copy at `/Users/michelkerkmeester/.Trash/rust-anything-main`.

## Actions Taken

1. Read `docs/types.md` (331 lines): the reading rules, the TypeScript, JavaScript, Python and C sections in full, and the section headings for Go, Java, Kotlin, C#, Ruby, PHP and PowerShell.
2. Read `tests/types_doc.rs` to confirm the table is executable.
3. Grepped the sk-code Rust set for every value class the table names (`c_int`, `std::ffi`, `repr(C)`, `PyO3`, `serde_json::Value`, `refused`, `i64`, `f64`).
4. Grepped the rust-anything website docs for PyO3, because `docs/types.md` has no PyO3 section.

## Findings

1. **`docs/types.md` is a per-language source-type → port-type table, and the contract is stated up front.** "`bridge` reads each exported function's types from the source and writes the port's signature in `port.rs` from them. This page lists, per language, what a source type becomes there, and which types keep a function in its language, with the reason `bridge` gives." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:3-5] The sk-code Rust set has no source-type → Rust-type mapping table at all. **LACKS**.

2. **The port error contract is uniform and untyped: `Result<T, String>`.** "A port function returns `Result<T, String>` and the table gives the `T`; in C it returns `T`, as the C function does." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:10] The sk-code set requires typed `thiserror` enums in the core [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md:109] and forbids `anyhow` in pure-core public APIs [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md:147]. **CONTRADICTS** on the surface, but the scopes differ: rust-anything's `port.rs` is a generated scaffold whose error text is deliberately not compared (see iteration 2, finding on `L7`), while sk-code's rule governs a shipped public API. Recorded as a scope conflict, not a sk-code error.

3. **`serde_json::Value` is the explicit escape hatch for anything the mapping does not know.** "`serde_json::Value` means the value crosses as JSON as it is: objects, maps, unions of different types and anything the mapping does not know." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:12] The sk-code set has zero hits for `serde_json::Value`. **LACKS** the named fallback type.

4. **"refused" is a first-class outcome, not a failure.** "`refused` means the function stays in its language. The note is the reason `bridge` prints, where it names the type." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:13] TypeScript refuses `(x: number) => number`/`Function`, `RegExp` and `Iterator`/`Generator` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:44-46]; Python refuses `Callable`, `Iterator`, `Generator`, `*args`, `**kwargs` and decorators other than `@cache` and `@lru_cache` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:88-90]. The sk-code set has zero hits for `refused`. **LACKS** the "keep it in the original language" verdict, which is the decision that stops a port from silently changing a public API.

5. **A defaulted parameter becomes `Option<T>`, with one per-language exception.** "A parameter with a default becomes `Option<T>`, unless the default is a literal Rust can write (a number, `true`/`false` or a plain string), in Python, Ruby, PHP and C#. In TypeScript and JavaScript every parameter with a default is `Option<T>`." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:14] The sk-code set has no default-parameter rule. **LACKS**.

6. **The mapping table is executable, so it cannot drift from the code.** "`cargo test --test types_doc` checks every row against the mapping, so a row that no longer matches the code fails the build." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:16] The test does it by `include_str!("../docs/types.md")` and iterating the documented rows against `bridge::param_type` and the per-language modules [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/tests/types_doc.rs:1-5] [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/tests/types_doc.rs:16]. The sk-code set has no rule that a documented mapping table must be tested against the implementation. **LACKS** — and this is the most portable single rule in the file, because it applies to any standards document that carries a table.

7. **The C ABI keeps width and sign through `std::ffi`.** `int` → `std::ffi::c_int`, `long` → `std::ffi::c_long` with the note "32 bits on Windows", `size_t`/`uintptr_t` → `usize`, `ssize_t`/`ptrdiff_t`/`intptr_t` → `isize`, `float` → `f32`, `double` → `f64`, `bool`/`_Bool` → `bool`, and `long double`/`wchar_t` refused as "not a C scalar the bridge knows". Specifiers may come in any order, `const` and `volatile` are ignored, an `enum` is `std::ffi::c_int`, and a project `typedef` of a scalar is that scalar. [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:123-152] The sk-code set has zero hits for `std::ffi`, `c_int` or `c_char`. **LACKS** the C ABI entirely.

8. **C pointers are mapped by their neighbouring parameter, and every other pointer is refused with a named design question.** `const char *` → `Option<&[u8]>`; a const byte pointer followed by an integer length → `&[u8]` with the length left out of the port; a writable byte pointer with a size → `&mut [u8]`; a pointer to a scalar the function writes → `Option<&mut T>`; `char **` pointing into a string parameter → `Option<&mut Option<usize>>`; a by-value all-scalar struct → a `#[repr(C)]` struct. "Any other pointer, array or function pointer parameter is refused ('ownership must be designed'), and so are any other returned pointer ('who frees it must be designed') and variadic functions." [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:154-168] The sk-code set has zero hits for `repr(C)`. **LACKS** — and the refusal wording is the valuable part, because it turns pointer ownership into a design decision instead of a guess.

9. **The integer mapping is per source language, not global.** TypeScript `number` → `f64` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:28] while Python `int` → `i64` [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:68]. The sk-code set mentions `f64` in 18 files and `i64` in 3, but never frames the choice as a per-source-language decision. **PARTIAL** — the JavaScript case is covered implicitly by the TypeScript-oracle framing; the Python case is absent.

10. **`docs/types.md` has no PyO3 section, so the topic's premise overstates the source.** The Python section maps Python source types to Rust port types and never names PyO3 [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md:64-91]; PyO3 appears only as the Python bridge in the website docs — "Python | PyO3 (abi3), direct conversion, typed exceptions" [SOURCE: /Users/michelkerkmeester/.Trash/rust-anything-main/website/pages/en/docs/concepts/bridge.md:27]. The sk-code set also has zero hits for `PyO3`. **CONTRADICTS** the topic's framing: there is no PyO3 value-class mapping to import, only a bridge name. The honest edit is to add a PyO3 bridge row to sk-code's interop model, not a value table.

## Ruled Out

- Reading the Go, Java, Kotlin, C#, Ruby, PHP and PowerShell sections in full: their headings confirm the same table shape, and the C section already supplies the ABI-width lesson the topic asks about. Reading seven more tables would have spent the budget without changing a verdict.
- Treating `Result<T, String>` as a rule to copy into sk-code: it is a scaffold convention for generated code whose error text is deliberately not compared, so copying it would weaken sk-code's typed-error rule.

## Dead Ends

- Grepping the sk-code Rust set for `std::ffi`, `c_int`, `c_char`, `repr(C)`, `PyO3`, `serde_json::Value` and `refused`: all zero. Confirmed absences; later iterations need not re-run them.
- Searching `docs/types.md` for PyO3: zero hits. The bridge name lives in the website docs only.

## Edge Cases

- Ambiguous input: the topic asks how `docs/types.md` maps values "across napi-rs, PyO3, the C ABI and the other bridges", but the file is organised by *source language*, not by bridge. Selected interpretation: read it as the source-language → port-type mapping and treat the bridge name as the consumer. Deferred alternative: a bridge-organised reading, which the file does not support.
- Contradictory evidence: finding 10. The topic asserts a PyO3 mapping that the source does not contain. Both the absence and the website's bridge row are cited.
- Missing dependencies: the topic's rust-anything path is absent; the Trash copy is used and named in every citation.
- Partial success: none. All ten findings are backed by a read or a counted grep.

## Sources Consulted

- /Users/michelkerkmeester/.Trash/rust-anything-main/docs/types.md
- /Users/michelkerkmeester/.Trash/rust-anything-main/tests/types_doc.rs
- /Users/michelkerkmeester/.Trash/rust-anything-main/website/pages/en/docs/concepts/bridge.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/interop-model.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md
- .skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/overview-and-data-ownership.md
- .skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md

## Assessment

- New information ratio: 1.0
- Questions addressed: key question 3
- Questions answered: key question 3

## Reflection

- What worked and why: reading the "How to read the tables" preamble before any table gave the four verdict words (`Port type`, `serde_json::Value`, `refused`, `Option<T>`) as the search terms, so the sk-code comparison tested concepts rather than type names. That is why finding 4 and finding 6 surfaced at all.
- What did not work and why: the topic's PyO3 premise did not survive contact with the file. The recovery was to grep the website docs, which found the bridge row and turned a dead end into finding 10.
- What I would do differently: check whether a named document actually contains a named section before planning reads around it, the same lesson as iteration 1's missing path.

## Recommended Next Focus

Key question 4: how `skills/rust-anything/SKILL.md` and `whole-app.md` steer a coding agent through a port. Read `skills/rust-anything/SKILL.md` first for the agent-facing loop, then `docs/whole-apps.md` for the whole-app frame, and compare against sk-code's own agent-facing entry points.
