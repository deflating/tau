# Tau Roadmap

Ideas and planned features. Nothing here is committed — just captured so it doesn't get lost.

## File Preview Panel

Context-aware split pane that displays files the agent is working on.

**File types:**
- Code → syntax highlighted viewer (Monaco/CodeMirror)
- Images → preview (PNG, SVG, generated images)
- HTML → live iframe preview, hot reloads as agent edits
- Markdown → rendered preview or editable with live render

**Desktop layout:**
- Button collapses sidebar and shrinks conversation to narrow mobile-width feed
- Preview panel takes ~60-70% of the width
- Conversation becomes a narrow stream on the left — just enough to follow along
- IDE-like layout where the "editor" is the AI conversation

**Mobile layout:**
- No split pane — tap a file reference in chat to open preview full-screen
- Swipe or back button to return to conversation
- iOS navigation stack feel

**Data source:**
- Tool events already tell us which files are being read/written
- Could auto-show preview when a file gets edited
- Or manually open via file picker / clicking filename in chat

## memoryd Dashboard

Standalone viewer for memoryd memory files (session cards, semantic/episodic memory, working memory). Was previously built into Tau, stripped out to keep the core lean. Could be a separate page or a separate pi package.

## Logo & Branding

- Proper logo for README and browser tab
- Fresh screenshots (light mode, mobile, settings without session name field)

## npm Publishing

- `pi install npm:tau-mirror` for cleaner install UX
- Needs npm account setup
