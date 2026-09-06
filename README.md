# Aura with Gayathri — Login + Order Tracking update

## Included
- Storefront + cart
- Checkout + order form
- UPI ID and QR
- Email notification
- Google Sheet order log
- Customer login/create account UI
- Order tracking page
- Order ID generated at checkout
- Tracking reads the Status column in the Google Sheet

## IMPORTANT ABOUT LOGIN
The website package includes a simple browser-side account system so the GitHub site works without exposing a server password database. Passwords are not sent to the shop backend, but this is NOT equivalent to production-grade authentication. For a public commercial store, use a dedicated authentication provider before collecting many customers.

## Google Apps Script setup
1. Create/open the Google Sheet used for orders.
2. Extensions → Apps Script.
3. Replace the editor with `apps-script/Code.gs`.
4. Save.
5. Run `setup()` once and approve permissions.
6. Deploy → New deployment → Web app.
7. Execute as: Me.
8. Who has access: Anyone.
9. Copy the `/exec` URL.
10. In `script.js`, replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL.
11. Upload the website files to GitHub Pages.

## Updating order status
In the Google Sheet, each order has a `Status` column. Set it to one of:
- Order Placed
- Payment Received
- Processing
- Packed
- Shipped
- Delivered

The customer can then use the Order ID in **Track Order** to see the latest status.

## Payment
UPI ID: smksmitha-5@okhdfcbank
Shop email: gayucreations638@gmail.com

The QR in `images/upi-qr.png` is generated from the supplied UPI ID. A form submission does not prove payment; verify payment in the UPI/bank app before shipping.
