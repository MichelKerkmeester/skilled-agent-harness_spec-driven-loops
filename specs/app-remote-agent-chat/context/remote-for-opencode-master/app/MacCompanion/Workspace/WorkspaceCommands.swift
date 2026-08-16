import SwiftUI

/// The workspace's verbs, spoken through notifications: the Commands scene
/// is built outside the window's view tree, so menu items reach the active
/// workspace the same way any two strangers talk in AppKit.
enum WorkspaceCommand {
    static let newSession = Notification.Name("workspace.newSession")
    static let palette = Notification.Name("workspace.palette")
    static let toggleInspector = Notification.Name("workspace.toggleInspector")
    static let inspectorTab = Notification.Name("workspace.inspectorTab")   // userInfo["tab"]
    static let approveOnce = Notification.Name("workspace.approveOnce")
    static let reject = Notification.Name("workspace.reject")
    static let previousSession = Notification.Name("workspace.previousSession")
    static let nextSession = Notification.Name("workspace.nextSession")

    static func post(_ name: Notification.Name, tab: InspectorTab? = nil) {
        NotificationCenter.default.post(
            name: name, object: nil,
            userInfo: tab.map { ["tab": $0.rawValue] }
        )
    }
}

/// The menu bar while a workspace is frontmost — Xcode's grammar where one
/// exists (⌘0 panes, ⌘. stop), the platform's everywhere else.
struct WorkspaceCommands: Commands {
    var body: some Commands {
        CommandGroupReplacement()

        CommandGroup(after: .newItem) {
            Button("New Session") { WorkspaceCommand.post(WorkspaceCommand.newSession) }
                .keyboardShortcut("n", modifiers: .command)
        }

        CommandMenu("Session") {
            Button("Commands…") { WorkspaceCommand.post(WorkspaceCommand.palette) }
                .keyboardShortcut("k", modifiers: .command)
            Divider()
            // Allow is deliberately chorded and explicit — and there is no
            // shortcut at all for "Always".
            Button("Allow Once") { WorkspaceCommand.post(WorkspaceCommand.approveOnce) }
                .keyboardShortcut("a", modifiers: [.command, .shift])
            Button("Reject") { WorkspaceCommand.post(WorkspaceCommand.reject) }
                .keyboardShortcut("r", modifiers: [.command, .shift])
        }

        CommandGroup(after: .sidebar) {
            Button("Toggle Inspector") { WorkspaceCommand.post(WorkspaceCommand.toggleInspector) }
                .keyboardShortcut("0", modifiers: [.command, .option])
            Button("Changes") { WorkspaceCommand.post(WorkspaceCommand.inspectorTab, tab: .changes) }
                .keyboardShortcut("1", modifiers: .command)
            Button("Plan") { WorkspaceCommand.post(WorkspaceCommand.inspectorTab, tab: .plan) }
                .keyboardShortcut("2", modifiers: .command)
            Button("Approvals") { WorkspaceCommand.post(WorkspaceCommand.inspectorTab, tab: .approvals) }
                .keyboardShortcut("3", modifiers: .command)
            Divider()
            Button("Previous Session") { WorkspaceCommand.post(WorkspaceCommand.previousSession) }
                .keyboardShortcut(.upArrow, modifiers: [.command, .control])
            Button("Next Session") { WorkspaceCommand.post(WorkspaceCommand.nextSession) }
                .keyboardShortcut(.downArrow, modifiers: [.command, .control])
        }
    }
}

/// ⌘W must close the window; only an explicit menu Quit may take the
/// server down with it. The default "Close" already does the right thing —
/// this exists to make sure nothing rebinds it and to keep the intent
/// written down.
private struct CommandGroupReplacement: Commands {
    var body: some Commands {
        CommandGroup(replacing: .saveItem) {}
    }
}
