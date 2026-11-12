# Parser fixture

`src/parse.mjs` exports `parseRecord`, which turns one line of comma-separated
`key=value` pairs into a plain object. For example, `parseRecord("name=ada,role=engineer")`
returns `{ name: "ada", role: "engineer" }`.

## Question

Should `parseRecord` accept a trailing comma, so `parseRecord("name=ada,")` returns
`{ name: "ada" }`, or should it throw on that input?
