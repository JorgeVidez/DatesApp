---
name: L'Amour Moderne
colors:
  surface: '#fbf8ff'
  surface-dim: '#d7d8f4'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2ff'
  surface-container: '#edecff'
  surface-container-high: '#e6e6ff'
  surface-container-highest: '#e0e0fc'
  on-surface: '#181a2e'
  on-surface-variant: '#5b403f'
  inverse-surface: '#2d2f44'
  inverse-on-surface: '#f1efff'
  outline: '#8f6f6e'
  outline-variant: '#e4bebc'
  surface-tint: '#bb152c'
  primary: '#b7102a'
  on-primary: '#ffffff'
  primary-container: '#db313f'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb3b1'
  secondary: '#745662'
  on-secondary: '#ffffff'
  secondary-container: '#fdd5e4'
  on-secondary-container: '#795a67'
  tertiary: '#5e5b59'
  on-tertiary: '#ffffff'
  tertiary-container: '#777471'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b1'
  on-primary-fixed: '#410007'
  on-primary-fixed-variant: '#92001c'
  secondary-fixed: '#ffd8e7'
  secondary-fixed-dim: '#e3bccb'
  on-secondary-fixed: '#2b141f'
  on-secondary-fixed-variant: '#5b3f4b'
  tertiary-fixed: '#e7e1de'
  tertiary-fixed-dim: '#cbc5c2'
  on-tertiary-fixed: '#1d1b19'
  on-tertiary-fixed-variant: '#494644'
  background: '#fbf8ff'
  on-background: '#181a2e'
  surface-variant: '#e0e0fc'
typography:
  display-lg:
    fontFamily: Literata
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Literata
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Literata
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: auto
  max-width: 1200px
---

## Brand & Style

The design system is centered on the intersection of modern logistics and romantic intentionality. It targets couples and planners who value aesthetic beauty as much as functional simplicity. The visual narrative balances the warmth of a handwritten love letter with the precision of a high-end concierge service.

The design style is **Soft Minimalist** with a focus on high-quality whitespace and delicate depth. It avoids the "candy-coated" aesthetic of traditional dating apps in favor of a sophisticated, editorial feel. By utilizing generous padding and a warm color palette, the UI evokes feelings of intimacy, trust, and anticipation.

## Colors

The palette is designed to feel emotive yet grounded. 

- **Primary (Soft Red):** Used for calls to action, active states, and highlighting key romantic milestones. It is a vibrant but slightly desaturated red to prevent eye fatigue.
- **Secondary (Warm Pink):** Used for background accents, progress indicators, and decorative elements. It provides a soft bridge between the high-energy primary and the neutrals.
- **Tertiary (Cream):** The primary surface color. It replaces pure white to create a warmer, more "paper-like" tactile feel.
- **Neutral (Charcoal):** Used for primary text and structural borders to provide necessary contrast and a modern, professional edge.

Functional colors (Success, Warning, Error) should be muted to match the desaturated tone of the primary palette.

## Typography

This design system employs a hybrid typographic scale. 

**Literata** is used for all storytelling elements: headings, titles, and pull-quotes. Its calligraphic influence adds a literary, romantic quality to the interface. Headlines should use "Optical Sizing" where possible to maintain elegance at larger scales.

**Plus Jakarta Sans** handles the functional UI. Its modern, slightly rounded apertures complement the "playful" nature of the brand while ensuring high legibility for logistics like addresses, times, and price points. 

For mobile, display sizes are reduced significantly to ensure headlines do not break awkwardly, maintaining a maximum of three words per line for large titles.

## Layout & Spacing

The layout follows a **Fluid-to-Fixed hybrid grid**. On mobile, a 4-column grid with 20px side margins is used. On desktop, the content is capped at 1200px and centered, utilizing a 12-column grid.

Spacing follows an 8px rhythmic scale, but emphasizes "Breathability." Content blocks should be separated by `lg` (48px) units to create an editorial feel. Negative space is a functional tool here, used to isolate "moments" in the planning process so the user doesn't feel overwhelmed by choices.

## Elevation & Depth

Depth is communicated through **Ambient Shadows** and **Tonal Layering**. 

1.  **Base Layer:** The Cream (`#FFF9F5`) background serves as the canvas.
2.  **Raised Layer:** Primary cards use a very soft, diffused shadow with a hint of the secondary pink tint (`rgba(250, 210, 225, 0.4)`). This makes cards appear to float gently above the surface rather than sitting heavy upon it.
3.  **Active Layer:** Interactive elements (buttons, active inputs) increase their shadow spread on hover/tap, simulating a physical "lift" towards the user.

Avoid harsh black shadows or heavy borders. Outline-only elements should use a low-contrast version of the Neutral color at 15% opacity.

## Shapes

The shape language is consistently **Rounded**. 

Standard containers and buttons use an 8px (`0.5rem`) radius to maintain a modern look that isn't overly "bubbly." Larger components, like image carousels or date-detail cards, use the `rounded-xl` (24px) setting to create a friendly, safe environment. Icons should be selected from sets with rounded caps and joins to match this visual DNA.

## Components

- **Buttons:** Primary buttons are pill-shaped or highly rounded with a solid Soft Red fill and Cream text. Secondary buttons use a Cream fill with a thin Charcoal border.
- **Cards:** Cards are the primary container for date ideas. They must feature high-quality imagery with a subtle 5% Charcoal inner-stroke to define edges against the Cream background.
- **Chips:** Used for date tags (e.g., "Romantic," "Outdoor"). These should use the Secondary Pink color with Charcoal text and a full-circle radius.
- **Input Fields:** Use a subtle Cream-to-White gradient fill and a 1px Charcoal border that transitions to Soft Red on focus. Labels should always use `label-md` in Charcoal.
- **Lists:** List items are separated by generous padding rather than lines. A subtle 1px divider may be used, but it should be desaturated pink (`#FAD2E1`) rather than grey.
- **Date Picker:** A custom component that highlights the "Selected Date" with a Soft Red circular background and "Available Dates" with a Secondary Pink dot.