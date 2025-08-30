# Деплой в Vercel - Пошаговая инструкция

## 1. Подготовка проекта

Убедитесь, что в проекте есть:
- ✅ `.env.example` - файл с примером переменных окружения
- ✅ `vercel.json` - конфигурация для Vercel
- ✅ Переменная `VITE_API_BASE_URL` в коде

## 2. Создание проекта в Vercel

### Способ 1: Через Vercel CLI
```bash
npm i -g vercel
vercel
```

### Способ 2: Через веб-интерфейс
1. Перейдите на [vercel.com](https://vercel.com)
2. Подключите GitHub репозиторий
3. Выберите репозиторий проекта

## 3. Настройка переменных окружения

В панели управления Vercel:
1. Перейдите в **Settings** → **Environment Variables**
2. Добавьте переменную:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://backend-for-blog-v2.vercel.app`
   - **Environments**: Production, Preview, Development

## 4. Настройка автоматического деплоя

Vercel автоматически:
- Отслеживает изменения в main/master ветке
- Запускает сборку при каждом push
- Создает preview URL для pull requests

## 5. Проверка деплоя

После успешного деплоя:
1. Откройте Production URL
2. Проверьте, что приложение загружается
3. Проверьте, что API вызовы работают корректно

## 6. Полезные команды

```bash
# Просмотр логов
vercel logs [deployment-url]

# Локальный preview
vercel dev

# Повторный деплой
vercel --prod
```

## 7. Troubleshooting

### Проблема: "VITE_API_BASE_URL environment variable is required"
**Решение**: Добавьте переменную окружения в настройках Vercel

### Проблема: API вызовы не работают
**Решение**: 
1. Проверьте правильность URL в переменной окружения
2. Убедитесь, что backend поддерживает CORS
3. Проверьте, что backend доступен

### Проблема: Routing не работает (404 на refresh)
**Решение**: Убедитесь, что `vercel.json` настроен для SPA

## 8. Мониторинг

Vercel предоставляет:
- **Analytics** - статистика посещений
- **Real-time logs** - логи в реальном времени  
- **Performance metrics** - метрики производительности

## 🚀 После деплоя

Ваше приложение будет доступно по адресу:
`https://your-project-name.vercel.app`

Готово! 🎉
