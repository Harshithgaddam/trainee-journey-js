From this exercise, I learned:

How an element's rendered height and width are calculated based on the box-sizing property.
How CSS specificity scores are calculated.
How the browser determines which CSS rule is applied when multiple selectors target the same element.
Debugging Exercise
Bug 1: Horizontal Layout Broken (Element Overflow)

Symptom

The main content (width: 70%) and the sidebar (width: 30%) failed to appear side-by-side. Instead, the sidebar dropped below the main content, leaving unused whitespace on the right.

Investigation (DevTools)

Using the Computed panel in DevTools, I confirmed that the browser was using the default box-sizing: content-box.

The actual rendered width of the main content became:

70% + 40px (padding) + 10px (border)

As a result, the combined width of both columns exceeded 100%, causing the sidebar to wrap onto the next line.

Fix

Applied a global border-box reset:

html {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

With border-box, padding and borders are included within the declared width, allowing the 70% and 30% columns to fit perfectly inside the parent container.

Bug 2: Parent Container Moving Down (Margin Collapse)

Symptom

Adding margin-top: 40px to .layout-header did not create spacing inside the container. Instead, the entire layout shifted downward.

Investigation (DevTools)

Inspection revealed that the header's top margin collapsed with its parent because there was no border, padding, or formatting context separating them. The margin escaped the parent and effectively became the parent's top margin.

Fix

Added:

.parent-container {
    display: flow-root;
}

Creating a Block Formatting Context (BFC) prevented margin collapse by isolating the child element's margin inside the parent container.

CSS Specificity Exercise
Manually calculated the specificity score of multiple overlapping CSS selectors targeting the same element.
Predicted which selector would win based on the specificity algorithm.
Verified the prediction using the browser's DevTools, confirming that the rule with the highest specificity (or the later rule when specificity was equal) was applied.
Overall Learning
Understood the difference between content-box and border-box.
Learned how padding and borders affect an element's final rendered size.
Investigated and resolved layout overflow using DevTools.
Understood how margin collapsing works and how creating a Block Formatting Context (BFC) prevents it.
Learned to calculate CSS specificity manually.
Verified CSS cascade and specificity behavior using browser DevTools.
