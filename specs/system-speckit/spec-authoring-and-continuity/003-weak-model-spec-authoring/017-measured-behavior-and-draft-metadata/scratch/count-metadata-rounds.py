#!/usr/bin/env python3
"""Count validator rounds per author run in the speed-loop results.

A round is one validate.sh call the author made. Its output is joined from
author.updates by toolCallId. A round is "derived-only" when it FAILED and every
rule printed with the error marker is one repair-derived.cjs can settle.

Usage: python3 count-metadata-rounds.py <results-dir> <run-id> [<run-id> ...]
"""
import json
import os
import re
import sys

DERIVED = {
    'DESCRIPTION_SHAPE', 'GENERATED_METADATA_INTEGRITY', 'GENERATED_METADATA_DRIFT',
    'GRAPH_METADATA_SHAPE', 'METADATA_DISK_PATH_CONSISTENCY', 'SPEC_DOC_INTEGRITY',
}


def text_of(update):
    parts = []
    for item in update.get('content') or []:
        inner = item.get('content')
        if isinstance(inner, dict) and isinstance(inner.get('text'), str):
            parts.append(inner['text'])
    return '\n'.join(parts)


def main():
    root, runs = sys.argv[1], sys.argv[2:]
    totals = {'runs': 0, 'rounds': 0, 'failed': 0, 'derived_only': 0, 'content': 0, 'unknown': 0,
              'final_passed': 0, 'runs_with_derived_round': 0}
    print('run\tvariant\tround\trounds\tfailed\tderived_only\tcontent_fail\tunknown\tfinal')
    for run_id in runs:
        run_dir = os.path.join(root, run_id)
        for variant in sorted(os.listdir(run_dir)):
            vdir = os.path.join(run_dir, variant)
            if not os.path.isdir(vdir) or variant.startswith('go-'):
                continue
            for rnd in sorted(os.listdir(vdir)):
                rdir = os.path.join(vdir, rnd)
                calls_path = os.path.join(rdir, 'author.calls')
                if not os.path.isfile(calls_path):
                    continue
                ids = set()
                for line in open(calls_path, encoding='utf8'):
                    try:
                        call = json.loads(line)
                    except ValueError:
                        continue
                    if 'validate.sh' in json.dumps(call.get('rawInput', {})):
                        ids.add(call.get('toolCallId'))
                outputs = {}
                for line in open(os.path.join(rdir, 'author.updates'), encoding='utf8'):
                    try:
                        update = json.loads(line)
                    except ValueError:
                        continue
                    if update.get('toolCallId') in ids:
                        body = text_of(update)
                        if body:
                            outputs[update['toolCallId']] = outputs.get(update['toolCallId'], '') + body
                c = {'rounds': len(ids), 'failed': 0, 'derived_only': 0, 'content': 0, 'unknown': 0}
                for body in outputs.values():
                    errors = set(re.findall(r'^(?:\d+:)?x ([A-Z_]{4,}):', body, re.M))
                    failed = 'RESULT: FAILED' in body or bool(errors)
                    if not failed:
                        continue
                    c['failed'] += 1
                    if not errors:
                        c['unknown'] += 1
                    elif errors <= DERIVED:
                        c['derived_only'] += 1
                    else:
                        c['content'] += 1
                final = open(os.path.join(rdir, 'author.validate'), encoding='utf8').read()
                final_state = 'PASSED' if 'RESULT: PASSED' in final else 'FAILED'
                print(f"{run_id}\t{variant}\t{rnd}\t{c['rounds']}\t{c['failed']}\t{c['derived_only']}\t{c['content']}\t{c['unknown']}\t{final_state}")
                totals['runs'] += 1
                for key in ('rounds', 'failed', 'derived_only', 'content', 'unknown'):
                    totals[key] += c[key]
                totals['final_passed'] += final_state == 'PASSED'
                totals['runs_with_derived_round'] += c['derived_only'] > 0
    print('TOTAL ' + ' '.join(f'{k}={v}' for k, v in totals.items()))


if __name__ == '__main__':
    main()
