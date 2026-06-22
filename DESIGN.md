---
name: Dialectical Materialism UI
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#e6bdb8'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#ac8884'
  outline-variant: '#5c403c'
  surface-tint: '#ffb4ab'
  primary: '#ffb4ab'
  on-primary: '#690005'
  primary-container: '#dc2626'
  on-primary-container: '#fff6f5'
  inverse-primary: '#bf0715'
  secondary: '#ffe083'
  on-secondary: '#3c2f00'
  secondary-container: '#eec200'
  on-secondary-container: '#645000'
  tertiary: '#b9c7e0'
  on-tertiary: '#233144'
  tertiary-container: '#657389'
  on-tertiary-container: '#f7f8ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000b'
  secondary-fixed: '#ffe083'
  secondary-fixed-dim: '#eec200'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#d5e3fd'
  tertiary-fixed-dim: '#b9c7e0'
  on-tertiary-fixed: '#0d1c2f'
  on-tertiary-fixed-variant: '#3a485c'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 42px
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1em
  caption:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

This design system centers on the tension between historical theory and modern economic critique. The brand personality is intellectual, revolutionary, and authoritative, designed to engage serious scholars and students of political economy. 

The aesthetic is a sophisticated fusion of **Glassmorphism** and **High-Contrast Minimalism**. It uses deep, translucent layers to represent the "hidden" structures of surplus value, while sharp red accents provide a sense of urgency and systemic critique. The UI should evoke an emotional response of clarity and revelation—stripping away the "commodity fetishism" of standard web interfaces to reveal a structured, academic core. High-contrast interactions ensure that critical data points and philosophical definitions are impossible to ignore.

## Colors

The palette is rooted in the "Deep Navy" (#0f172a) of a scholarly night, providing a high-contrast base for the "Marxist Red" (#dc2626) primary accent. This red is used sparingly but powerfully for calls to action, progress indicators, and key ideological headers. 

The "Golden Yellow" (#facc15) serves as a highlight color, specifically reserved for illuminating definitions, footnotes, and critical "surplus" data points. Background surfaces utilize the tertiary slate (#334155) with varying levels of opacity (60-80%) to create the glassmorphic effect over the deep navy base. All text is rendered in "Slate White" (#f8fafc) to ensure maximum legibility against the dark, layered backgrounds.

## Typography

The typography strategy employs a dialectical contrast between the old world and the new. **EB Garamond** is used for all major headings and display text, bringing the weight of 19th-century publishing and classical theory to the digital screen. It should be typeset with tight tracking and generous line heights.

**Hanken Grotesk** handles the heavy lifting of modern analysis. Its clean, sharp metrics represent the scientific precision of Marx's economic formulas. For technical data, mathematical symbols, and "system logs," **JetBrains Mono** is utilized to provide a monospaced, analytical feel. Always prioritize readability; the "body-lg" size is preferred for long-form philosophical essays to reduce cognitive load during deep study.

## Layout & Spacing

The layout follows a **Fixed Grid** system for desktop to maintain the feel of a structured manuscript, centering the content within a 1200px container. On mobile, it transitions to a fluid single-column layout with 16px side margins.

A 4px baseline grid ensures vertical rhythm across the heavy text content. Large sections of theory are separated by "xl" (40px) vertical gaps to provide visual breathing room. Content should be grouped logically into "analytical blocks"—glassmorphic containers that use the spacing "lg" (24px) for internal padding. Margin-heavy layouts are encouraged to prevent the interface from feeling cluttered, emphasizing the "Minimalism" aspect of the design system.

## Elevation & Depth

Hierarchy is established through **Backdrop Blurs** and **Tonal Layering** rather than traditional drop shadows. 

1.  **Base Layer:** The solid #0f172a background.
2.  **Surface Layer:** A translucent #334155 (40% opacity) with a `backdrop-filter: blur(12px)`. This is used for cards and content sections.
3.  **Floating Layer:** Navigation bars and modals use a higher opacity (80%) and a subtle 1px inner border in #f8fafc (10% opacity) to catch "light" and define the edges.
4.  **Interactive Glow:** Instead of shadows, active elements or "surplus" highlights use a soft outer glow in Marxist Red (#dc2626 at 20% opacity) to signify focus and importance.

## Shapes

The shape language is primarily **Soft (0.25rem)**. This slight rounding takes the edge off the "Brutalist" tendencies of the high-contrast palette, making the academic environment feel more approachable for students. 

Larger components like "Logic Cards" or "Theory Modules" should use `rounded-lg` (0.5rem). Interaction elements like buttons and chips should remain at the base `rounded` level to maintain a crisp, structured appearance that aligns with the "Modern/Scientific" aspect of the brand.

## Components

### Buttons
Primary buttons are solid Marxist Red (#dc2626) with Slate White text. Secondary buttons are "ghost" style with a 1px border of Slate White and a 10% white fill on hover.

### Logic Cards (Glassmorphism)
Used for displaying specific economic concepts. These feature the `backdrop-filter: blur` effect, a subtle 1px top-border, and use EB Garamond for the card title.

### Highlight Chips
Small labels used for categorization (e.g., "Capital Vol. 1", "Labor Theory"). These use JetBrains Mono in all-caps, with a Golden Yellow (#facc15) text color and a very thin yellow border.

### Progress Indicators
Linear bars used for course progression. The track is the base navy, and the filler is a vibrant Marxist Red. When a milestone is reached, the bar glows slightly.

### Input Fields
Minimalist under-line inputs. The line is Slate White (40% opacity) and turns Marxist Red on focus, accompanied by a small floating label in JetBrains Mono.

### Quote Blocks
Pull quotes from the text use EB Garamond in italics, with a thick 4px Marxist Red vertical border on the left side to distinguish theory from modern commentary.