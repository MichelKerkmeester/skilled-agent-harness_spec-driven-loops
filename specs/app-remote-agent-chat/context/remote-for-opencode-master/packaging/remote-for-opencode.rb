# Homebrew cask for the Remote for OpenCode Mac companion.
#
# Lives here as the source of truth; stamp the version and sha256 after a
# release, then copy the file into the tap repo
# (tjameswilliams/homebrew-tap → Casks/remote-for-opencode.rb), which is what
# `brew install --cask tjameswilliams/tap/remote-for-opencode` reads.
#
# The tap also needs a cask_renames.json at its root mapping the pre-rename
# token — {"opencodego": "remote-for-opencode"} — so day-one installs follow
# `brew upgrade` to the new name instead of orphaning.
#
# auto_updates true tells brew this app updates itself (via Sparkle), so
# `brew upgrade` leaves it alone rather than fighting the in-app updater.
cask "remote-for-opencode" do
  version "1.2"
  sha256 "5f8aa5bdc45bc1b9e9d8d33364d8dd6f329d7e7536b2321f25ed01d1ed542052"

  # Versioned, not the stable /RemoteForOpenCode.dmg the website links: that
  # one is overwritten by every deploy, so pairing it with a pinned sha256
  # would break `brew install` the moment the next release lands — and
  # briefly hand 1.2's bytes to someone asking for 1.1. `brew audit` flags
  # exactly this. deploy.sh uploads the versioned dmgs without --delete, so
  # this URL keeps working after later releases.
  url "https://remoteforopencode.com/downloads/RemoteForOpenCode-#{version}.dmg"
  name "Remote for OpenCode"
  desc "Drive the OpenCode coding agent on your Mac from your iPhone"
  homepage "https://remoteforopencode.com"

  # Livecheck reads the same Sparkle feed the app updates from, so
  # `brew audit --online` can confirm the stamped version matches what is
  # actually being served.
  livecheck do
    url "https://remoteforopencode.com/downloads/appcast.xml"
    strategy :sparkle do |item|
      item.short_version
    end
  end

  auto_updates true
  # Symbol form already means "this version or newer"; the ">= :sonoma"
  # string spelling is deprecated and warns on every brew invocation.
  depends_on macos: :sonoma
  # The companion drives the OpenCode CLI; without it there's nothing to run.
  depends_on formula: "opencode"

  app "Remote for OpenCode.app"

  zap trash: [
    # Pre-rename paths on purpose: the bundle id never changed, and the
    # Application Support directory keeps its old name (see
    # OpenCodeProcess.swift) so a 1.0 crash's pidfile is still honoured.
    "~/Library/Application Support/OpenCodeGo",
    "~/Library/Caches/com.timwilliams.opencodego.mac",
    "~/Library/Preferences/com.timwilliams.opencodego.mac.plist",
  ]
end
