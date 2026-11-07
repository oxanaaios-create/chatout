# site/

Код сайта. Стартовая заготовка — статический HTML на токенах; стек можно заменить (Astro, Next.js, Shopify-тема), правило остаётся: значения только из `styles/tokens.css`.

## Бесплатный хостинг
Подключить репозиторий к Cloudflare Pages или Netlify (Free): build command пусто, publish directory `site`. Каждый push в main = деплой, каждая ветка = превью-ссылка для клиента.

GitHub Pages для private-репо на бесплатном плане недоступен.

## Исключение из проверки
Строка с комментарием `ds-ignore` пропускается `npm run check:site`. Каждое исключение — запись в docs/decisions.md.
