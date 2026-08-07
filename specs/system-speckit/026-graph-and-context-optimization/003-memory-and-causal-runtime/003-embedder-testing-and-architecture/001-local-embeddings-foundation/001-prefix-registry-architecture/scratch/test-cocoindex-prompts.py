import sys, os
sys.path.insert(0, '.opencode/skills/mcp-coco-index/mcp_server')
from cocoindex_code.shared import resolve_query_prompt_name, _QUERY_PROMPT_MODELS

# (a) Qwen lookup
a = resolve_query_prompt_name('google/embeddinggemma-300m')
assert a == 'query', f"(a) Qwen expected 'query' got {a!r}"

# (b) Unknown model
b = resolve_query_prompt_name('made-up/model')
assert b is None, f"(b) Unknown expected None got {b!r}"

# (c) Env override
os.environ['COCOINDEX_QUERY_PROMPT_NAME'] = 'custom'
c = resolve_query_prompt_name('google/embeddinggemma-300m')
assert c == 'custom', f"(c) env override expected 'custom' got {c!r}"
del os.environ['COCOINDEX_QUERY_PROMPT_NAME']

# (d) Empty-string env override -> None
os.environ['COCOINDEX_QUERY_PROMPT_NAME'] = ''
d = resolve_query_prompt_name('google/embeddinggemma-300m')
assert d is None, f"(d) empty override expected None got {d!r}"
del os.environ['COCOINDEX_QUERY_PROMPT_NAME']

# (e) Registry has Qwen entries
assert 'google/embeddinggemma-300m' in _QUERY_PROMPT_MODELS
assert 'nomic-ai/CodeRankEmbed' in _QUERY_PROMPT_MODELS  # back-compat preserved

print('PASS: 5 assertions')
