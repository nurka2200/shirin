Как это в гитхаб добавить оправить чтобы было легче# Nomad Eats

## Запуск

Установите зависимости командой `npm install`, затем запустите `npm run dev`. Команда поднимает Vite и сервер авторизации; данные зарегистрированных пользователей сохраняются в `server/data/users.json` (в файл попадают только хеши паролей).

## Аккаунт администратора

Создайте администратора через переменные окружения перед запуском. Email и пароль не храните в исходниках и не отправляйте в чат. Пароль администратора должен содержать от 12 до 128 символов.

В PowerShell:

```powershell
$env:ADMIN_EMAIL = "admin@example.com"
$env:ADMIN_PASSWORD = "ваш-длинный-уникальный-пароль"
npm run dev
```

Для production сначала выполните `npm run build`, задайте те же переменные окружения и запустите `npm start` за HTTPS-прокси. В production cookie сессии помечается `Secure`.

Пользователи могут самостоятельно зарегистрироваться: email уникален, пароль — от 10 до 128 символов. Регистрация всегда создаёт роль обычного пользователя; роль администратора нельзя выбрать в форме.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
