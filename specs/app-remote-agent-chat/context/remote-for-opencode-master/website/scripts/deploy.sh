#!/bin/bash
# Build and ship the Remote for OpenCode site. Infra via CDK, content via
# s3 sync, then a CloudFront invalidation. Modelled on the Tomte site's
# deploy; same AWS profile.
#
#   scripts/deploy.sh
#
# The domain move (goforopencode.com -> remoteforopencode.com) is two
# deploys: first with SITE_DOMAIN=remoteforopencode.com alone (drops the old
# Apex/Www records), then again with LEGACY_SITE_DOMAIN=goforopencode.com so
# the same distribution keeps answering the shipped Sparkle feed URL. Until
# remoteforopencode.com is registered and has a hosted zone, deploy with
# SITE_DOMAIN=goforopencode.com to keep updating the live site as-is.
set -euo pipefail

PROFILE="${AWS_PROFILE_OVERRIDE:-radius}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO="$(cd "$ROOT/.." && pwd)"
DMG="${REMOTE_DMG:-$REPO/dist/RemoteForOpenCode.dmg}"
export SITE_DOMAIN="${SITE_DOMAIN:-remoteforopencode.com}"
export LEGACY_SITE_DOMAIN="${LEGACY_SITE_DOMAIN:-}"

echo "==> Building site"
(cd "$ROOT" && npm run build)

echo "==> Deploying infra (profile: $PROFILE, domain: ${SITE_DOMAIN:-none})"
(cd "$ROOT/infra" && npx cdk deploy GoForOpenCodeWebsite \
  --require-approval never \
  --profile "$PROFILE" \
  --outputs-file outputs.json)

BUCKET=$(node -p "require('$ROOT/infra/outputs.json').GoForOpenCodeWebsite.SiteBucketName")
DIST_ID=$(node -p "require('$ROOT/infra/outputs.json').GoForOpenCodeWebsite.DistributionId")
URL=$(node -p "require('$ROOT/infra/outputs.json').GoForOpenCodeWebsite.SiteUrl")

echo "==> Syncing site to s3://$BUCKET"
# --exclude downloads/*: releases are uploaded below and must survive a
# --delete sync of the site content.
aws s3 sync "$ROOT/dist" "s3://$BUCKET" \
  --delete \
  --exclude "downloads/*" \
  --profile "$PROFILE" \
  --region us-east-1

if [ -f "$DMG" ]; then
  echo "==> Uploading desktop binary ($(du -h "$DMG" | cut -f1 | tr -d ' '))"
  aws s3 cp "$DMG" "s3://$BUCKET/downloads/RemoteForOpenCode.dmg" \
    --content-type application/x-apple-diskimage \
    --profile "$PROFILE" \
    --region us-east-1
else
  echo "==> No dmg at $DMG — skipping binary (set REMOTE_DMG to override)"
fi

# Sparkle: versioned dmgs, binary deltas, and the signed appcast. Uploaded
# without --delete so releases accumulate; installed apps poll
# downloads/appcast.xml (SUFeedURL) and fetch what it references. Deleting
# an old dmg breaks the delta chain for anyone who skipped a version.
UPDATES="$(dirname "$DMG")/updates"
if [ -f "$UPDATES/appcast.xml" ]; then
  echo "==> Uploading Sparkle updates from $UPDATES"
  aws s3 sync "$UPDATES" "s3://$BUCKET/downloads" \
    --exclude "*" --include "*.dmg" --include "*.delta" \
    --profile "$PROFILE" \
    --region us-east-1
  aws s3 cp "$UPDATES/appcast.xml" "s3://$BUCKET/downloads/appcast.xml" \
    --content-type application/xml \
    --cache-control "max-age=300" \
    --profile "$PROFILE" \
    --region us-east-1
else
  echo "==> No appcast at $UPDATES — skipping Sparkle upload"
fi

echo "==> Invalidating CloudFront cache"
aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/*" \
  --profile "$PROFILE" \
  --no-cli-pager \
  --query 'Invalidation.Id' \
  --output text

echo "==> Live at $URL"
