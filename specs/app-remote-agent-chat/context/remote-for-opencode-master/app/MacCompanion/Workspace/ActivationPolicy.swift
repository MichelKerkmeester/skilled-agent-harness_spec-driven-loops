import AppKit

/// The app ships as a menu-bar item (`LSUIElement`), which macOS runs as
/// an `.accessory`: no Dock icon, and — the part that actually bites — no
/// main menu bar, so a window full of keyboard commands would have nowhere
/// to put them. The moment a workspace window opens the app must become a
/// `.regular` citizen, and when the last one closes it should disappear
/// from the Dock again rather than lingering as an iconless oddity.
///
/// One place counts the windows and flips the policy, so the two flips
/// can't disagree.
@MainActor
final class ActivationPolicy {
    static let shared = ActivationPolicy()

    private var open = Set<Int>()
    private var observer: NSObjectProtocol?

    /// Call when a policy-bearing window has appeared and is known.
    func windowOpened(_ window: NSWindow) {
        guard !open.contains(window.windowNumber) else { return }
        open.insert(window.windowNumber)
        if NSApp.activationPolicy() != .regular {
            NSApp.setActivationPolicy(.regular)
        }
        NSApp.activate(ignoringOtherApps: true)
        window.makeKeyAndOrderFront(nil)
        if observer == nil {
            // willClose rather than the view's onDisappear: a closed window
            // can keep its view hierarchy alive, and the policy must follow
            // the window, not the view.
            observer = NotificationCenter.default.addObserver(
                forName: NSWindow.willCloseNotification, object: nil, queue: .main
            ) { note in
                guard let window = note.object as? NSWindow else { return }
                let number = window.windowNumber
                Task { @MainActor in Self.shared.windowClosed(number) }
            }
        }
    }

    private func windowClosed(_ windowNumber: Int) {
        guard open.remove(windowNumber) != nil else { return }
        if open.isEmpty {
            NSApp.setActivationPolicy(.accessory)
        }
    }
}

import SwiftUI

/// Hands the hosting `NSWindow` to whoever needs it — SwiftUI has no
/// supported way to reach it, and the policy dance above needs the real
/// window, not a guess from `NSApp.windows`.
struct WindowAccessor: NSViewRepresentable {
    let onWindow: (NSWindow) -> Void

    func makeNSView(context _: Context) -> NSView {
        let view = NSView()
        // The window is attached after this view lands in a hierarchy,
        // never during make — hence the hop.
        DispatchQueue.main.async {
            if let window = view.window { onWindow(window) }
        }
        return view
    }

    func updateNSView(_: NSView, context _: Context) {}
}
