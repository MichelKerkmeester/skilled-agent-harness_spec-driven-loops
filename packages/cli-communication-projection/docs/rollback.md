# Rollback

Keep the previous exact tarball in a local release cache. Rollback does not
require a provider call and must not modify the canonical transcript.

1. Disable new projections.
2. Select `OriginalOnlyEmergencyMode` from the `release` entry point.
3. Install the previous exact local tarball.
4. Verify the canonical transcript digest is unchanged.
5. Run the compatibility doctor before re-enabling any projection route.

```sh
export PREVIOUS_PACKAGE_TARBALL=/srv/releases/portable-cli-communication-projection-0.0.9.tgz
npm install --offline --save-exact "$PREVIOUS_PACKAGE_TARBALL"
node ./operator/run-communication-projection-doctor.mjs
```

```js
import {
  OriginalOnlyEmergencyMode,
  planRollback,
} from '@portable-cli/communication-projection/release';

const plan = planRollback({
  previousPackageVersion: '0.0.9',
  canonicalTranscriptDigest: process.env.CANONICAL_TRANSCRIPT_DIGEST,
  trigger: 'operator-request',
});

if (OriginalOnlyEmergencyMode.networkRequired || plan.mutatesCanonicalTranscript) {
  throw new Error('Unsafe rollback plan.');
}
console.log(JSON.stringify(plan));
```

The digest is integrity metadata, not transcript content. Do not place raw
transcript bytes or credential values in rollback logs.
