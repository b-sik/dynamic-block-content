# bszyk-dynamic-content v0.1.0

**Enable WordPress blocks to display dynamic data that auto-updates on the frontend of your site.**

Simply select a block in the WordPress editor, toggle on Dynamic Content, and select the custom field (aka post meta key) that contains the value you'd like to display. If that value changes in your database, it will automatically reflect the change on the frontend of your site.

The following blocks are currently supported:
* Paragraph
* Heading
* Verse

---
If you clone this repo:
```
composer install && npm install && npm build
```