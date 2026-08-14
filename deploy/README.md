# Nostra VPS deployment

The public site is served as a static build by Nginx. Only `/api/request` is
handled by the existing PHP-FPM service. The VPS cannot reach Telegram's Bot
API from its current REG.Cloud region, so leads are delivered to the Nostra
Yandex inbox over authenticated SMTP.

Mail credentials live only on the server in `/etc/nostra/mail.env`:

```ini
YANDEX_SMTP_USER="nostra.kzn@yandex.com"
YANDEX_SMTP_PASSWORD="application-password"
DELIVERY_EMAIL="nostra.kzn@yandex.com"
```

The file must be owned by `root:www-root` and have mode `0640`.

Deployment order:

1. Run the local Vinext production server and save `/` as `index.html`.
2. Copy `dist/client/`, the captured `index.html`, and `deploy/api/` to a new
   release directory under `/var/www/nostra/releases/`.
3. Point `/var/www/nostra/current` to the verified release.
4. Install `deploy/nginx/nostra.conf`, validate with `nginx -t`, and reload.
5. Verify the site and form over the server IP before changing DNS.
6. Point the domain to the VPS, then issue and verify the TLS certificate.
