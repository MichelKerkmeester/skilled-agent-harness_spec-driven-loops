# CocoIndex Code Chunkers

`CodeAwareSplitter` uses tree-sitter AST boundaries for supported source languages and falls back to the original `RecursiveSplitter` for unsupported languages, parse errors, or oversized definitions.

| Language | Definition nodes |
|---|---|
| TypeScript / TSX | `abstract_class_declaration`, `class_declaration`, `enum_declaration`, `function_declaration`, `generator_function_declaration`, `interface_declaration`, `lexical_declaration`, `type_alias_declaration`, `variable_declaration`; `export_statement` is a wrapper |
| JavaScript | Same JS/TS declaration set; lexical/variable declarations are chunked only when the value is an arrow/function/class expression |
| Python | `class_definition`, `function_definition`; `decorated_definition` is a wrapper |
| Go | `function_declaration`, `method_declaration`, `type_declaration` |
| Rust | `enum_item`, `function_item`, `impl_item`, `struct_item`, `trait_item` |
| Java | `class_declaration`, `interface_declaration`, `method_declaration` |

Doc comments immediately preceding a definition are included in the chunk. Oversized definition chunks larger than `2 * COCOINDEX_CODE_CHUNK_SIZE` are split with `RecursiveSplitter` within that definition.

Rollback is runtime-only:

```bash
COCOINDEX_CODE_AWARE_CHUNKING=false
```

Restart the `ccc` daemon after changing the flag so the config singleton reloads.
