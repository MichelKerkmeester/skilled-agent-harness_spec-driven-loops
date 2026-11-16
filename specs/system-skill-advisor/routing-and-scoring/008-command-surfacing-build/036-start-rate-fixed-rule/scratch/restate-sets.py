# Compares the pre set and the final set of the stored runs scored with the scorer
# before and after the start rule change. A new start count must equal the old one
# minus the old read-alone count, and every field the rule does not touch must hold.
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SKIP = ('startRate', 'startedOfOffered', 'started')


def load(name):
    with open(os.path.join(HERE, name)) as handle:
        return json.load(handle)


def strip(value):
    if isinstance(value, dict):
        return {key: strip(item) for key, item in value.items() if key not in SKIP}
    if isinstance(value, list):
        return [strip(item) for item in value]
    return value


def split(rate):
    started, total = rate.split(' of ')
    return int(started), int(total)


for label in ('pre-set', 'final-set'):
    before, after = load(f'{label}-before.json'), load(f'{label}-after.json')
    for runtime, entry in before.items():
        if runtime == 'pooled':
            continue
        for arm, block in entry.items():
            if not isinstance(block, dict) or 'startRate' not in block:
                continue
            new = after[runtime][arm]
            old_n, old_d = split(block['startRate'])
            new_n, new_d = split(new['startRate'])
            moved = 'numerator moved by readOnly' if new_n == old_n - block['startShapes']['readOnly'] else 'numerator DIFF'
            held = 'denominator equal' if new_d == old_d else 'denominator DIFF'
            print(f'{label} {runtime} {arm} start {block["startRate"]} -> {new["startRate"]},'
                  f' startedOfOffered {block["startedOfOffered"]} -> {new["startedOfOffered"]} of'
                  f' {new["offered"]}, unsafe {new["unsafe"]}, {moved}, {held}')
    print(f'{label} other fields {"equal" if strip(before) == strip(after) else "DIFF"}')
