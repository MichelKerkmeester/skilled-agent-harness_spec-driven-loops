## Edit 1

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/build-batch-manifests.py`

OLD:

~~~~text
            continue
        if rule_module.NEW in text:
            group = 'dual-root'
~~~~

NEW:

~~~~text
            continue
        if rule_module.NEW_ROOT.search(text):
            group = 'dual-root'
~~~~
