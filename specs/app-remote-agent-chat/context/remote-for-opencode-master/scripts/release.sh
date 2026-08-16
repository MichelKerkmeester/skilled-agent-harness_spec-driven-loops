#!/bin/zsh
# Build, sign, notarize, and package the Remote for OpenCode Mac companion.
# Produces:
#   dist/RemoteForOpenCode.dmg                    evergreen first-install download
#   dist/updates/RemoteForOpenCode-<v>.dmg        versioned artifact for Sparkle
#   dist/updates/appcast.xml               Sparkle feed (EdDSA-signed)
#
#   release.sh <version>                   full run (needs the notary profile)
#   release.sh <version> --skip-notarize   signed dmg only, no notarization
#
# Then: website/scripts/deploy.sh uploads the dmg, the versioned dmgs and
# the signed appcast to S3/CloudFront — which is what both Sparkle and the
# Homebrew cask read.
#
# <version> becomes CFBundleShortVersionString (e.g. 0.2.0); CFBundleVersion
# is a UTC datestamp, so it is monotonic without bookkeeping. Sparkle
# compares CFBundleVersion to decide "newer".
#
# One-time setup for notarization (interactive; do NOT script the password):
#   xcrun notarytool store-credentials opencodego-notary \
#     --apple-id <your Apple ID email> --team-id 7NHJT99NX8
# using an app-specific password minted at appleid.apple.com.
#
# One-time setup for update signing: run scripts/setup-signing-key.sh, which
# generates the EdDSA keypair into the login keychain and prints the public
# half to paste into app/project.yml as SUPublicEDKey. Losing the private key
# means shipped apps refuse every future update — back up that keychain item.
set -euo pipefail

SCRIPT_DIR=${0:a:h}
ROOT=${SCRIPT_DIR:h}
APP_DIR="$ROOT/app"
BUILD="$ROOT/build/release"
DIST="$ROOT/dist"
IDENTITY="Developer ID Application: Tim Williams (7NHJT99NX8)"
TEAM_ID="7NHJT99NX8"
PROFILE="${NOTARY_PROFILE:-opencodego-notary}"
SPARKLE_VERSION="2.9.4" # keep in step with app/project.yml's exactVersion
SPARKLE_BIN="$HOME/Library/Caches/opencodego/sparkle-$SPARKLE_VERSION/bin"
# Where shipped apps fetch updates from. GitHub releases host the dmgs; the
# appcast itself is served from the repo so a release is one upload plus one
# commit.
DOWNLOAD_PREFIX="https://remoteforopencode.com/downloads/"

VERSION="${1:-}"
if [[ -z "$VERSION" || "$VERSION" == --* ]]; then
  echo "usage: release.sh <version> [--skip-notarize]   (e.g. release.sh 0.2.0)" >&2
  exit 2
fi
BUILD_NUMBER=$(date -u +%Y%m%d%H%M)
SKIP_NOTARIZE=false
[[ "${2:-}" == "--skip-notarize" ]] && SKIP_NOTARIZE=true

# An unsigned-updates build is worse than no updates: Sparkle would ship a
# feed nobody can verify. Refuse rather than produce one.
if grep -q "REPLACE_WITH_SPARKLE_PUBLIC_KEY" "$APP_DIR/project.yml"; then
  echo "release: SUPublicEDKey is still the placeholder." >&2
  echo "Run scripts/setup-signing-key.sh and paste the public key into app/project.yml." >&2
  exit 1
fi

if ! $SKIP_NOTARIZE; then
  if ! xcrun notarytool history --keychain-profile "$PROFILE" >/dev/null 2>&1; then
    echo "release: no notary credentials under profile '$PROFILE'." >&2
    echo "Run the store-credentials command in this script's header, or pass --skip-notarize." >&2
    exit 1
  fi
fi

rm -rf "$BUILD"
mkdir -p "$BUILD" "$DIST"

echo "==> Generating project"
(cd "$APP_DIR" && xcodegen generate --quiet)

echo "==> Archiving (Release) $VERSION ($BUILD_NUMBER)"
xcodebuild archive \
  -project "$APP_DIR/RemoteForOpenCode.xcodeproj" \
  -scheme MacCompanion \
  -configuration Release \
  -destination "generic/platform=macOS" \
  -archivePath "$BUILD/RemoteForOpenCode.xcarchive" \
  -allowProvisioningUpdates \
  MARKETING_VERSION="$VERSION" \
  CURRENT_PROJECT_VERSION="$BUILD_NUMBER" \
  -quiet

echo "==> Exporting with Developer ID"
cat > "$BUILD/ExportOptions.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>method</key><string>developer-id</string>
	<key>teamID</key><string>$TEAM_ID</string>
	<key>signingStyle</key><string>automatic</string>
	<key>destination</key><string>export</string>
</dict>
</plist>
PLIST
xcodebuild -exportArchive \
  -archivePath "$BUILD/RemoteForOpenCode.xcarchive" \
  -exportOptionsPlist "$BUILD/ExportOptions.plist" \
  -exportPath "$BUILD/export" \
  -allowProvisioningUpdates \
  -quiet

APP="$BUILD/export/MacCompanion.app"
[[ -d "$APP" ]] || { echo "release: export produced no app" >&2; exit 1; }

echo "==> Verifying signature"
codesign --verify --deep --strict --verbose=1 "$APP"

# The bundle ships as Remote for OpenCode.app; renaming a signed bundle is safe —
# the seal binds the bundle id, not the folder name.
STAGE="$BUILD/stage"
mkdir -p "$STAGE"
cp -R "$APP" "$STAGE/Remote for OpenCode.app"

if ! $SKIP_NOTARIZE; then
  echo "==> Notarizing app"
  ditto -c -k --keepParent "$STAGE/Remote for OpenCode.app" "$BUILD/RemoteForOpenCode.zip"
  xcrun notarytool submit "$BUILD/RemoteForOpenCode.zip" --keychain-profile "$PROFILE" --wait
  xcrun stapler staple "$STAGE/Remote for OpenCode.app"
fi

echo "==> Building dmg"
ln -sf /Applications "$STAGE/Applications"
rm -f "$BUILD/RemoteForOpenCode.dmg"
hdiutil create -volname "Remote for OpenCode" -srcfolder "$STAGE" -ov -format UDZO -quiet \
  "$BUILD/RemoteForOpenCode.dmg"
codesign --sign "$IDENTITY" --timestamp "$BUILD/RemoteForOpenCode.dmg"

if ! $SKIP_NOTARIZE; then
  echo "==> Notarizing dmg"
  xcrun notarytool submit "$BUILD/RemoteForOpenCode.dmg" --keychain-profile "$PROFILE" --wait
  xcrun stapler staple "$BUILD/RemoteForOpenCode.dmg"
  echo "==> Gatekeeper assessment"
  spctl --assess --type open --context context:primary-signature -v "$BUILD/RemoteForOpenCode.dmg"
fi

mkdir -p "$DIST/updates"
cp "$BUILD/RemoteForOpenCode.dmg" "$DIST/RemoteForOpenCode.dmg"
cp "$BUILD/RemoteForOpenCode.dmg" "$DIST/updates/RemoteForOpenCode-$VERSION.dmg"

# ---- Sparkle appcast. generate_appcast reads every dmg in updates/, signs
# each with the EdDSA key in the login keychain, and (given consecutive
# releases) emits binary deltas alongside the full downloads.
if [[ ! -x "$SPARKLE_BIN/generate_appcast" ]]; then
  echo "==> Fetching Sparkle $SPARKLE_VERSION tools"
  SPARKLE_CACHE="${SPARKLE_BIN:h}"
  mkdir -p "$SPARKLE_CACHE"
  curl -sL -o "$SPARKLE_CACHE/Sparkle.tar.xz" \
    "https://github.com/sparkle-project/Sparkle/releases/download/$SPARKLE_VERSION/Sparkle-$SPARKLE_VERSION.tar.xz"
  tar -xf "$SPARKLE_CACHE/Sparkle.tar.xz" -C "$SPARKLE_CACHE"
fi
echo "==> Generating appcast"
"$SPARKLE_BIN/generate_appcast" \
  --download-url-prefix "$DOWNLOAD_PREFIX" \
  --maximum-versions 5 \
  "$DIST/updates"

shasum -a 256 "$DIST/RemoteForOpenCode.dmg"
echo "==> Done: $DIST/RemoteForOpenCode.dmg + $DIST/updates (RemoteForOpenCode-$VERSION.dmg, appcast.xml)"
echo "    Next: website/scripts/deploy.sh"
