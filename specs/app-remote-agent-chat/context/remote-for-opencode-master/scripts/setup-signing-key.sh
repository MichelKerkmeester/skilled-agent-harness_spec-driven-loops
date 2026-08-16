#!/bin/zsh
# One-time: generate the Sparkle EdDSA update-signing keypair.
#
# The private half goes into the login keychain (never into the repo); the
# public half is printed for pasting into app/project.yml as SUPublicEDKey.
# Every shipped app checks updates against that public key, so losing the
# private key means no future update can ever be installed by existing
# users — back up the keychain item ("Private key for signing Sparkle
# updates") somewhere safe.
set -euo pipefail

SPARKLE_VERSION="2.9.4" # keep in step with app/project.yml's exactVersion
CACHE="$HOME/Library/Caches/opencodego/sparkle-$SPARKLE_VERSION"

if [[ ! -x "$CACHE/bin/generate_keys" ]]; then
  echo "==> Fetching Sparkle $SPARKLE_VERSION tools"
  mkdir -p "$CACHE"
  curl -sL -o "$CACHE/Sparkle.tar.xz" \
    "https://github.com/sparkle-project/Sparkle/releases/download/$SPARKLE_VERSION/Sparkle-$SPARKLE_VERSION.tar.xz"
  tar -xf "$CACHE/Sparkle.tar.xz" -C "$CACHE"
fi

"$CACHE/bin/generate_keys"
echo
echo "==> Paste the public key above into app/project.yml as SUPublicEDKey,"
echo "    replacing REPLACE_WITH_SPARKLE_PUBLIC_KEY."
