## Edit 1

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/build-batch-manifests.py`

OLD:

~~~~text
    ('F3', '.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/**', None),
]
~~~~

NEW:

~~~~text
    ('F3', '.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/**', None),
    # Acceptance evidence captured once, with no runtime reader, records runs at the old path.
    ('F4', '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/{latency-report,semantic-probes,recipe-execution,daemon-off-proof}.json', None),
]
~~~~

## Edit 2

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/build-batch-manifests.py`

OLD:

~~~~text
            out.append('[^/]*'); index += 1
        elif pattern[index] == '?':
~~~~

NEW:

~~~~text
            out.append('[^/]*'); index += 1
        elif pattern[index] == '{':
            close = pattern.index('}', index)
            out.append('(?:' + '|'.join(re.escape(part) for part in pattern[index + 1:close].split(',')) + ')'); index = close + 1
        elif pattern[index] == '?':
~~~~
