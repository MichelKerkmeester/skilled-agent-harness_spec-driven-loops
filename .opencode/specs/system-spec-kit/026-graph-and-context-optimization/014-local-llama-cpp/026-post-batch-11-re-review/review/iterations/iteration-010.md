# Iteration 010 — Local-LLM Legacy Hunt

## Focus
This correctness pass scanned the live embedding profile resolver, provider profile builders, doctor command YAML assets, runtime config mirrors, package manifests, and embedding-related tests for post-022 residue that can change actual database selection or validation behavior. I treated the Voyage -> OpenAI -> llama-cpp -> hf-local cascade as canonical and focused on profile-keyed sqlite filename correctness, rejected ONNX runtime references, stale default assertions, and command paths that could inspect the wrong active profile DB.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-010-001 | P1 | correctness | .opencode/skills/system-spec-kit/shared/embeddings/factory.ts:674 | "dtype: provider === 'hf-local' ? resolveHfLocalDtype() : provider === 'llama-cpp' ? resolveLlamaCppDtype() : null" | confirmed-residue | Make `getStartupEmbeddingProfile()` produce the canonical dtype-bearing profile slug for cloud providers too, or centralize the dtype token in `resolveActiveProfileDbPath` so Voyage/OpenAI cannot emit dtype-less sqlite filenames. |
| L-010-002 | P1 | correctness | .opencode/skills/system-spec-kit/shared/embeddings/providers/voyage.ts:337 | "return new EmbeddingProfile({ provider: 'voyage', model: this.modelName, dim: this.dim, baseUrl: this.baseUrl" | confirmed-residue | Add the canonical Voyage dtype/profile token when constructing the provider profile so initialized-provider metadata cannot diverge from the canonical profile-keyed DB filename contract. |
| L-010-003 | P1 | correctness | .opencode/skills/system-spec-kit/shared/embeddings/providers/openai.ts:307 | "return new EmbeddingProfile({ provider: 'openai', model: this.modelName, dim: this.dim, baseUrl: this.baseUrl" | confirmed-residue | Add the canonical OpenAI dtype/profile token when constructing the provider profile so OpenAI profile slugs stay aligned with `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite`. |
| L-010-004 | P2 | correctness | .opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:246 | "expect(profile.getDatabasePath('/tmp/spec-kit-db')).toBe('/tmp/spec-kit-db/context-index__voyage__voyage-4__1024.sqlite');" | confirmed-residue | Update the startup-profile assertion to the dtype-bearing canonical filename or derive the expected value from the shared profile helper after fixing the cloud dtype contract. |
| L-010-005 | P1 | correctness | .opencode/commands/doctor/assets/doctor_update.yaml:417 | "const file = fs.readdirSync(dir).find((name) => /^context-index__.*\\.sqlite$/.test(name));" | confirmed-residue | Resolve the active profile DB path via `resolveActiveProfileDbPath` or an MCP-reported active DB path before counting indexed specs; `readdirSync().find()` can select an arbitrary stale profile DB when multiple provider DBs exist. |

## Iteration summary
- Files scanned: 4493
- New findings: 5 (P0=0, P1=4, P2=1)
- Out-of-scope/historical noted but NOT flagged: 18
- Notes: Saturation is near for the explicit residue classes. Remaining exact-string hits were either already covered by iterations 001-009, intentional legacy model lookup support, vitest temp DB idioms, frozen review/spec/evidence artifacts, or allowed diagnostic references to `context-index__*.sqlite` as a wildcard rather than a concrete singleton/Voyage DB. 
