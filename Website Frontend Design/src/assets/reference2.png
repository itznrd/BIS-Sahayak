This spec translates the BIS AI brief into a structured, Figma-ready interface system for both frames — foundations, components, states, and responsive behavior — organized so a designer can build directly in Figma. No existing BIS AI design language or Figma file was found in this workspace, so every token below is introduced fresh from the brief rather than extended from prior work.

<aside>
🎯

Design Direction: a trusted public-sector utility with a visible layer of advanced intelligence — structured layouts, deep navy authority, emerald verification cues, generous whitespace, restrained digital visuals. Public Sans throughout; hierarchy comes from weight and spacing, not decoration.

</aside>

## 00 Foundations

### Figma file structure

- Page: `BIS AI`
    - Section: `00 Foundations`
    - Section: `01 Landing`
    - Section: `02 Chat`

### Frames

| Frame | Size |
| --- | --- |
| Desktop Landing | 1440 × 1280 |
| Desktop Chat | 1440 × 1024 |
| Mobile Landing | 390 × 844 |
| Mobile Chat | 390 × 844 |

### Grid & spacing

- Desktop grid: 12 columns, 80px side margins, 24px gutters
- Maximum content width: 1280px
- Spacing scale: `4, 8, 12, 16, 24, 32, 48, 64, 96`

### Color tokens

| Token | Value | Usage |
| --- | --- | --- |
| Navy 950 | `#081A2B` | Primary headings, logo |
| Navy 800 | `#0E2A47` | Navigation, dark surfaces |
| Slate 600 | `#526477` | Body text |
| Slate 300 | `#CBD5E1` | Borders and dividers |
| Canvas | `#F9FAFB` | Page background |
| White | `#FFFFFF` | Cards and input surfaces |
| Emerald 700 | `#087F5B` | Primary CTA |
| Emerald 100 | `#DDF7EC` | Highlight backgrounds |
| Teal 500 | `#19A982` | Illustration accents |
| Error | `#B42318` | Validation states |

### Typography (Public Sans)

| Style | Size / Line height | Weight | Usage |
| --- | --- | --- | --- |
| Display / Hero Headline | 60–64px / 1.05 | 700 | Landing hero headline (42px on mobile) |
| Heading / Prompt | 28px / 38px | 700 | "Try asking about..." |
| Body / Supporting | 18px / 30px | 400 | Hero supporting copy |
| Nav Label | 14px / auto | 500 | Header navigation, 16px horizontal spacing |
| Caption / Disclaimer | 12px / auto | 400 | Footer legal, chat disclaimer, copyright |

### Radius, elevation, focus

- Card radius: `16px` · Input radius: `14px` · Button radius: `10px` · Pill radius: `999px`
- Light shadow: `0 8px 24px rgba(14, 42, 71, 0.08)`
- Focus ring: `2px` emerald, `2px` offset
- Minimum touch target: `44 × 44px` for all icon buttons

## Component library

Build each as an Auto Layout component with the listed variants:

- **Logo / Default** — navy geometric mark + `BIS AI` wordmark + `BUREAU OF INDIAN STANDARDS` label
- **Button / Primary** — filled emerald `#087F5B`, radius 10px; states: default, hover, active, disabled
- **Button / Secondary** — outline/ghost variant for nav (`Launch AI` uses Primary)
- **Button / Icon** — 44×44px hit area; used for attach, mic, send, menu
- **Nav Link / Default** — 14px medium; states: default, hover, active
- **Feature Card / Default** — white surface, `1px #E2E8F0` border, 16px radius, 28px padding, 44×44px emerald icon container; states: default, hover (2px lift + shadow)
- **Prompt Card / Default** — white surface, 1px slate border, 14px radius, 16px padding, right-aligned arrow icon; states: default, hover (emerald border + `0 6px 18px rgba(14,42,71,0.08)` shadow)
- **Message / AI** — left-aligned, max 720px, background `#F1F5F9`, navy text, circular avatar, 14px radius with 4px bottom-left variation; includes Copy / Helpful / Not helpful utility row (low contrast until hover/focus)
- **Message / User** — right-aligned, max 620px, background `#E4F7EF`, dark navy text, 14px radius
- **Chat Input / Empty, Active, Voice Active** — white shell, 76px height, 1px border, 14px radius, soft shadow, 12px horizontal padding; attach icon, text field, mic icon, emerald send button
- **Status Chip / Verified, Pending, Error** — pill radius `999px`

### Component state matrix

| Component | States |
| --- | --- |
| Button / Primary | Default, Hover, Active, Disabled |
| Feature Card | Default, Hover (lift + shadow) |
| Prompt Card | Default, Hover (emerald border + shadow) |
| Chat Input | Empty (muted emerald send), Active (`#087F5B` send), Focus (emerald outline on shell), Voice Active (pale emerald mic background), Attachment (inline filename chip) |
| Status Chip | Verified, Pending, Error |
| Response utility row | Idle (low contrast), Hover/Focus (full contrast) |

## 01 Landing (Desktop 1440×1280 · Mobile 390×844)

### Header — 76px

White background, subtle bottom border.

- Left: compact logo lockup (navy mark, `BIS AI`, `BUREAU OF INDIAN STANDARDS` label)
- Right: About · Standards · CRS · Services · Contact · Button/Primary `Launch AI`
- Institutional tone: 14px medium nav text, 16px horizontal spacing

### Hero

Light canvas background, subtle emerald radial gradient behind the illustration.

- **Left (6 cols)**: eyebrow `BUREAU OF INDIAN STANDARDS · INTELLIGENT ASSISTANCE`; headline `Navigate Indian Standards Instantly with BIS AI.` (60–64px/1.05/700, max-width 610px); supporting copy (18px/30px); Button/Primary `Start Chatting Now` + right arrow; trust note `Guidance for certification, standards, licensing, and compliance.`
- **Right (6 cols)**: hero illustration

### Hero illustration

Official, restrained ISI-verification concept (flat, light depth — no glossy chrome, excess gradients, or neon):

- Large pale emerald radial halo
- Central navy circular verification seal (approved BIS/ISI asset placeholder — do not redraw the official mark)
- Three thin teal data paths to small nodes representing standards, licenses, applications
- Two floating white data cards: `Verified`, `IS 1293:2019`, `CM/L reference`
- Thin low-opacity navy grid lines + one subtle emerald glow behind the mark

### How It Helps

White background, section label `A clearer path through compliance`, three equal-width Feature Cards (24px gaps):

| Card | Icon | Heading | Description |
| --- | --- | --- | --- |
| 1 | badge-check | Verify Licenses | Find CM/L and R-numbers with less manual searching. |
| 2 | file-search / book-open-check | Understand Standards | Simplify IS 1293:2019 and other technical requirements. |
| 3 | clipboard-check | Track Applications | Check application status while you are on the go. |

### Trust strip

Narrow full-width band: `Built to make standards information easier to find, understand, and act on.` + three trust points: Clear explanations · Standards-focused guidance · Human-readable compliance support.

### Footer

Navy background, four columns: Logo lockup · Product (About, Standards, CRS, Services) · Support (Contact, Help, Accessibility) · Legal (Privacy, Terms, Disclaimer). Disclaimer: `BIS AI provides informational guidance and does not replace official BIS standards, notices, certification decisions, or regulatory requirements.` 12px copyright line beneath.

## 02 Chat (Desktop 1440×1024 · Mobile 390×844)

### Minimal header — 72px

- Left: BIS AI logo
- Right: `Back to Home` + left arrow; optional `New chat` text button if history persists

### Prompt introduction

Centered, max 960px container. Headline `Try asking about...` (28px/38px). Supporting text: `Get clear guidance on standards, licenses, applications, and compliance.`

### Example prompt cards

Four Prompt Cards, 2×2 on tablet/desktop, vertical stack on mobile:

- `How do I verify an ISI mark?`
- `What are the requirements for IS 1293:2019 (plugs and sockets)?`
- `Show the status of my CRS application (R-41XXXXXX).`
- `What is the difference between BIS and hallmark?`

### Chat history

Centered column 840–960px, 24px between message groups.

- Example: User — `How do I verify an ISI mark?` / AI — `Start with the CM/L number printed alongside the mark. BIS AI can help you identify the relevant license reference and the standard connected to the product.`
- AI messages include a low-contrast utility row: Copy · Helpful · Not helpful

### Chat input bar

Centered, max 920px, 76px height, white shell, 1px border, 14px radius, soft shadow, 12px horizontal padding.

- Left to right: Attach icon · text field (placeholder `Ask about IS codes, licensing, or compliance...`) · mic icon · emerald circular send button (arrow-up)
- States: Empty (muted emerald send) · Active (`#087F5B` send) · Focus (emerald outline on full shell) · Voice (pale emerald mic background) · Attachment (inline filename chip)
- Below input, centered 12px slate text: `BIS AI can make mistakes. Verify critical compliance decisions against official BIS publications.`

## Responsive rules

| Breakpoint | Behavior |
| --- | --- |
| 1024px | Reduce page margins to 48px |
| 768px | Collapse header nav into a menu button; stack hero illustration below text; feature cards → single column; prompt cards → single column |
| Mobile | Chat input fixed to bottom, 16px side margins; landing headline reduces to 42px; all icon buttons keep 44×44px minimum touch target |

## Assumptions & open items

- No BIS AI brand assets, prior design system, or Figma file exist in this workspace yet — all tokens above are newly defined from the brief.
- The BIS/ISI seal in the hero illustration and chat avatar is a neutral placeholder; do not redraw the official mark for production — swap in an approved asset when available.
- `image_0.png` and `image_1.png` referenced in the original brief weren't attached, so the illustration and chat visual treatment above follow the written description only.
- This environment has no connected Figma integration, so this page is the structured reference for building the actual `.fig` frames — it is not a live Figma file.

A high-fidelity UI design mockup for the front-end of 'BIS AI,' an advanced artificial intelligence assistant dedicated to standardisation, conformity assessment, and hallmarking. The aesthetic must be ultra-modern, clean, and highly professional, utilizing a color palette of deep sapphire blue (primary), crisp white (backgrounds), and vibrant electric blue (for accents and interactive elements). The design style is modern minimalism with subtle glassmorphism effects and soft, layered shadows for depth, perfectly suitable for a technology interface.
The layout must visibly feature two distinct sections within a single wide-frame composition, structured as a design presentation for Figma:
On the left half of the image is the [Landing Page]. It features a clean top navigation bar with: BIS AI logo, Features, About, Support, and a 'Get Started' button. The main hero section includes a prominent, bold headline: "Navigate Standards with AI Precision." Below it, a concise sub-headline. Centered in the hero section is a large, sleek CTA button. The background includes abstract, glowing architectural or schematic data visualizations.
On the right half of the image is the [Input & Interaction Page]. It must follow a strict vertical hierarchy:
[Top Middle Section]: Visibly displays a dedicated horizontal row of styled cards or text bubbles showing "Example Questions:" with clickable samples such as: "How do I get an ISI Mark?", "What is IS 1293?", and "Explain Hallmarking fees."
[Middle Half-Lower Section]: A large, centered, clean text input box with the placeholder text: "Ask BIS AI about standards..." Right next to it is a prominent, designed "Generate / Send" arrow button. Below this input field is a structured results area showing a stylized AI response in clean typography.
The entire composition should have soft studio lighting, sharp focus, and a sophisticated, inviting tone. --ar 16:9 --v 6.0 --stylize 250
Break down of how this prompt meets your requirements for Figma structure:
Structure: I have forced the AI to generate two views side-by-side in a single image. This is ideal for Figma because you are effectively generating a small design system/mood board in one go, showing how the aesthetic translates across both states.
Color Palette: I specified professional "deep sapphire blues" and "vibrant electric blue," which give it an official "standardization body" feel while looking high-tech (AI).
Landing Page: Contains the required components (Nav, Hero, CTA).
Input Page & Question Placement:
I explicitly placed the Example Questions cards in the "Top Middle Section."
I explicitly placed the input box and control bar in the "Middle Half-Lower Section."