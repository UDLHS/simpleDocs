# Capture Architecture Pipeline

This document is the technical reference for the current capture architecture. The deployment and auth work does not replace this capture design.

## Core Principle

The capture pipeline remains Windows-native and performance-first.

The following changes around auth, logging, and deployment do not redesign the core capture path:
- no Web frontend replacement
- no Electron migration
- no browser-based capture conversion
- no blocking DB writes before first token

## Core Technologies

- **Win32 APIs:** Foreground/window detection and focus handling
- **UI Automation (UIA):** Primary selected/background extraction path
- **MSAA / IAccessible:** Secondary fallback path
- **Clipboard Compatibility Mode:** Safe copy-based fallback for editors and terminal cases
- **Classic Console Buffer API:** Legacy terminal support
- **Native Windows OCR Engine:** Last-resort fallback for canvas/blocked/visual-only surfaces

## Global Pipeline

1. Detect active window and process.
2. Classify the environment.
3. Route to the matching capture strategy.
4. Extract selected text using the ordered fallback chain.
5. Extract background context using the strategy-specific fallback chain.
6. Build capture metadata including methods, partial/unsupported state, and usage context.
7. Send the final payload to the backend only after capture completes.

## Selected Text Fallback Order

### Generic order
1. UIA selection
2. MSAA explicit selection
3. MSAA focused-text fallback where allowed
4. clipboard compatibility where allowed
5. unsupported selected result

### IDE terminal special order
1. UIA selection
2. MSAA explicit selection
3. terminal-safe clipboard compatibility fallback
4. unsupported selected result

## Background Context Fallback Order

### IDE editor
- UIA document range
- UIA visible ranges
- nearest UIA container
- OCR
- metadata fallback

### Terminal
- UIA visible ranges
- optional UIA document range for modern terminal
- OCR
- metadata fallback

### Browser / Electron
- nearest UIA container
- OCR
- metadata fallback

### Canvas-locked or external surfaces
- OCR-first fallback path

## Safety Rules

### Clipboard safety
- backup clipboard before copy simulation
- send only `Ctrl+C`
- detect clipboard change safely
- restore the original clipboard in `finally`

### Quality filtering
- reject UI junk and metadata noise
- prefer code-like or terminal-like content signals
- preserve partial results when useful selected text is missing but context is still helpful

## Capture Output Fields

The capture result currently includes fields such as:
- `selected_text`
- `background_context`
- `window_title`
- `process_name`
- `environment_type`
- `selected_method`
- `background_method`
- `is_partial`
- `is_unsupported`
- `status_message`
- `usage_context`

## Deployment Note

Auth, session restore, and DB logging happen around the capture system, not inside the capture extraction path itself. This is important because it keeps the core capture behavior and latency profile stable.
