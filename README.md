This application allows users to filter "_for review_" transactions. It is fully client side, so it does not affect the database on Quickbooks' end. Perfect for bank transactions handled by multiple accountants; filtering only what matters to you.

It utilises class names that Quickbooks sends to your browser to modify its content.

Add new keywords in `const filterWords`, after line 19. Add as many lines as you wish (currently, the keywords to filter are "deposit", "withdrawal", and "refund". Any transactions where the description contains any of those words will be removed from your own view.

Import to [Tampermonkey Browser Extension](https://www.tampermonkey.net/) to use, available for both Chrome and Firefox.
