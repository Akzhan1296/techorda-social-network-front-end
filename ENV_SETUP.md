# Конфигурация переменных окружения - Резюме

## ✅ Что добавлено:

### 1. Файлы окружения
- `.env` - основной файл с переменными (в .gitignore)
- `.env.example` - шаблон для других разработчиков
- `.env.development` - переменные для разработки

### 2. Код изменения
- `src/services/api.ts` - использует `VITE_API_BASE_URL`
- `src/vite-env.d.ts` - типизация для переменных окружения
- Валидация обязательной переменной окружения

### 3. Документация
- Обновлен `README.md` с инструкциями по настройке
- Создан `VERCEL_DEPLOY.md` с детальными инструкциями деплоя
- Добавлена таблица переменных окружения

### 4. Git конфигурация
- Обновлен `.gitignore` для исключения .env файлов
- `.env.example` остается в репозитории

## 🚀 Как использовать:

### Для разработки:
```bash
cp .env.example .env
# Отредактируйте .env под ваши нужды
npm run dev
```

### Для Vercel деплоя:
1. В Vercel Dashboard → Settings → Environment Variables
2. Добавьте: `VITE_API_BASE_URL` = `https://your-backend-url.com`
3. Деплой произойдет автоматически

## 🔧 Переменные:

| Переменная | Обязательная | Описание |
|------------|--------------|----------|
| `VITE_API_BASE_URL` | ✅ Да | URL backend API сервера |

## 📝 Примеры:

```bash
# Продакшн
VITE_API_BASE_URL=https://backend-for-blog-v2.vercel.app

# Разработка
VITE_API_BASE_URL=http://localhost:3000

# Staging
VITE_API_BASE_URL=https://staging-api.example.com
```

Теперь проект готов к деплою в Vercel с настраиваемым backend URL! 🎉
