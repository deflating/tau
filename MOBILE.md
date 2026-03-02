# Mobile Optimisations

Everything customised for mobile (≤768px) compared to the desktop experience.

## Layout & Navigation
- **Slide-over sidebar** — 80% width (max 320px) panel with dark overlay behind it, instead of persistent sidebar
- **Swipe-from-edge gesture** — swipe right from the left 20px edge to open sidebar
- **Sidebar tinted backgrounds** — per-theme tint (warm for Terracotta, green for Sage, cool for Clean, slightly lighter for dark themes)
- **File browser hidden** — panel and toggle both removed on mobile

## Header
- **Slimmed down** — tighter padding (6px 12px), reduced gaps
- **Model picker stays in header** — alongside thinking button
- **Cost + token usage moved above input** — collapsible via chevron toggle, starts collapsed

## Session List
- **iOS-native styling** — 17px regular-weight titles (not bold), 13px meta text, flat divider lines between items
- **Titles wrap** — up to 2 lines instead of truncating
- **Larger touch targets** — 16px vertical padding per row, 44px minimum on all interactive elements
- **Larger search input** — 16px font (prevents iOS zoom), 10px padding, 12px border radius
- **Larger action buttons** — 36×36px icons

## Conversation Stream
- **Assistant messages full-width** — extend 100% instead of 85%, cost badge wraps below
- **Larger text** — 15.5px (up from 14px)
- **System font** — SF Pro via `-apple-system` on mobile
- **Copy button always visible** — small clipboard icon at 40% opacity instead of hover-only text

## Input Area
- **16px font size** — prevents iOS Safari auto-zoom on focus
- **No autofocus** — keyboard doesn't hijack the screen on load/navigation
- **Viewport locked** — `maximum-scale=1, user-scalable=no`
- **Form buttons removed from tab order** — `tabindex="-1"` on all non-textarea elements

## Connection & Lifecycle
- **Auto-reconnect on return** — detects visibility change and silently reconnects WebSocket instead of showing disconnected state
- **Instant scroll on history load** — temporarily disables smooth scrolling so loading a session jumps to bottom without the zoom animation
- **Refresh button does full page reload** — `location.reload()` on mobile instead of just refreshing the session list
