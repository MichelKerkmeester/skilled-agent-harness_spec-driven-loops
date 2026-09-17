## Edit 1

File: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts`

OLD:

~~~~text
    name: 'memory:save',
    description: 'Memory save command bridge for /memory:save context preservation.',
    keywords: ['/memory:save', 'save context', 'save memory', 'preserve session context'],
    domains: ['memory', 'command'],
    intentSignals: ['/memory:save', 'save context', 'save memory', 'preserve session context'],
    derivedTriggers: [],
~~~~

NEW:

~~~~text
    name: 'memory:save',
    description: 'Memory save command bridge for /speckit:save context preservation (the retired /memory:save id is kept as the scorer key).',
    keywords: ['/speckit:save', 'save context', 'save memory', 'preserve session context'],
    domains: ['memory', 'command'],
    intentSignals: ['/speckit:save', 'save context', 'save memory', 'preserve session context'],
    derivedTriggers: [],
~~~~

## Edit 2

File: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts`

OLD:

~~~~text
    name: 'command-memory-save',
    description: 'Memory save command bridge for /memory:save context preservation.',
    keywords: ['/memory:save', 'save context', 'save memory'],
    domains: ['memory', 'command'],
    intentSignals: ['/memory:save', 'save context', 'save memory'],
    derivedTriggers: [],
~~~~

NEW:

~~~~text
    name: 'command-memory-save',
    description: 'Memory save command bridge for /speckit:save context preservation (the retired /memory:save id is kept as the scorer key).',
    keywords: ['/speckit:save', 'save context', 'save memory'],
    domains: ['memory', 'command'],
    intentSignals: ['/speckit:save', 'save context', 'save memory'],
    derivedTriggers: [],
~~~~
