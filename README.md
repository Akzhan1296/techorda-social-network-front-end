# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# TechOrda Social Network Frontend

Современное frontend приложение для социальной сети, созданное с использованием React, TypeScript и Tailwind CSS.

## 🚀 Функциональность

### ✅ Реализованные возможности

- **Аутентификация пользователей**
  - Регистрация новых пользователей (с полями login, email, password)
  - Вход в систему (поддержка login или email)
  - Автоматическое управление JWT токенами
  - Защищенные маршруты

- **Профиль пользователя**
  - Просмотр профиля текущего пользователя
  - Отображение логина, email и ID пользователя

- **Интерфейс**
  - Современный адаптивный дизайн
  - Навигация между страницами
  - Индикаторы загрузки и обработка ошибок

### 🔄 В разработке

- **Управление постами** (API endpoints доступны, UI в разработке)
- **Система комментариев**
- **Редактирование профиля**
- **Список пользователей**

### 🔧 Технологический стек

- **Frontend Framework**: React 18 с TypeScript
- **Стилизация**: Tailwind CSS
- **Маршрутизация**: React Router v6
- **HTTP-клиент**: Axios
- **Иконки**: Lucide React
- **Сборщик**: Vite
- **Линтер**: ESLint

## 📦 Установка и запуск

### Предварительные требования

- Node.js версии 18.x или выше
- npm или yarn



## 🖥️ Backend

Для работы frontend-приложения используется отдельный backend:  
🔗 [TechOrda Social Network Backend](https://github.com/Akzhan1296/techorda-social-network-back-end)

### ⚙️ Технологический стек backend
- **Node.js** + **TypeScript**
- **NestJS** — серверный фреймворк
- **TypeORM** — ORM для работы с базой данных
- **PostgreSQL** — основная база данных
- **NeonDB** — удалённый хостинг PostgreSQL

Backend реализует REST API, с которым взаимодействует frontend.  

## 🚀 Технологический стек Frontend
- **React** + **TypeScript**
- **Vite** — сборка проекта
- **Tailwind CSS** — стилизация
- **React Router** — маршрутизация
- **Axios** — работа с API

## 🚀 Архитектура проекта
flowchart TD
    A[👩‍💻 Пользователь] -->|запрос| B[🌐 Frontend<br/>React + Vite + TS + Tailwind]
    B -->|REST API| C[⚙️ Backend<br/>Node.js + NestJS + TypeScript]
    C -->|ORM| D[(🗄️ PostgreSQL<br/>NeonDB)]


### Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd techorda-social-network-fe
```

2. Установите зависимости:
```bash
npm install
```

3. Настройте переменные окружения:
```bash
# Скопируйте файл-пример
cp .env.example .env

# Отредактируйте .env файл и установите правильный URL бэкенда
VITE_API_BASE_URL=https://your-backend-url.com
```

4. Запустите проект в режиме разработки:
```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:5173](http://localhost:5173)

### Дополнительные команды

- **Сборка для продакшена**: `npm run build`
- **Предварительный просмотр сборки**: `npm run preview`
- **Линтинг**: `npm run lint`

## 🏗️ Структура проекта

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── auth/           # Компоненты авторизации
│   ├── layout/         # Компоненты макета (навигация)
│   └── posts/          # Компоненты для работы с постами
├── contexts/           # React контексты
├── pages/              # Страницы приложения
├── services/           # API сервисы
├── types/              # TypeScript типы
├── App.tsx             # Главный компонент
└── main.tsx           # Точка входа
```

## 🌐 Деплой в Vercel

### Быстрый деплой

1. Подключите репозиторий к Vercel
2. В настройках проекта в Vercel добавьте переменную окружения:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.com`
3. Vercel автоматически выполнит сборку и деплой

### Переменные окружения

| Переменная | Описание | Пример |
|------------|----------|---------|
| `VITE_API_BASE_URL` | URL вашего backend API | `https://api.example.com` |

> **Важно**: Переменные с префиксом `VITE_` встраиваются в клиентскую сборку и видны пользователям. Не храните в них чувствительные данные.

## 🔗 API Endpoints

Приложение взаимодействует с backend API по следующим endpoints:

### Аутентификация
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/logout` - Выход из системы
- `POST /api/auth/refresh` - Обновление токена

### Пользователи
- `GET /api/users/profile` - Получение профиля текущего пользователя
- `PUT /api/users/profile` - Обновление профиля
- `GET /api/users` - Получение всех пользователей
- `GET /api/users/:id` - Получение пользователя по ID

### Посты
- `GET /api/posts` - Получение всех постов
- `POST /api/posts` - Создание нового поста
- `GET /api/posts/:id` - Получение поста по ID
- `PUT /api/posts/:id` - Обновление поста
- `DELETE /api/posts/:id` - Удаление поста
- `POST /api/posts/:id/like` - Лайк поста
- `DELETE /api/posts/:id/like` - Удаление лайка

### Комментарии
- `GET /api/posts/:id/comments` - Получение комментариев к посту
- `POST /api/comments` - Создание комментария
- `PUT /api/comments/:id` - Обновление комментария
- `DELETE /api/comments/:id` - Удаление комментария

## ⚙️ Конфигурация

### Backend URL
По умолчанию приложение подключается к API по адресу `http://localhost:3000`. 
Чтобы изменить это, отредактируйте переменную `API_BASE_URL` в файле `src/services/api.ts`.

### API Endpoints
Приложение использует следующие endpoints вашего backend:

**Аутентификация:**
- `POST /auth/login` - Вход в систему (ожидает `loginOrEmail` и `password`)
- `POST /auth/registration` - Регистрация (ожидает `login`, `email`, `password`) 
- `GET /auth/me` - Получение данных текущего пользователя
- `POST /auth/logout` - Выход из системы

**Посты:**
- `GET /posts` - Получение списка постов (возвращает пагинированный результат)

## 🎨 UI/UX Особенности

- **Адаптивный дизайн** - приложение корректно отображается на всех устройствах
- **Современный интерфейс** - чистый и интуитивно понятный дизайн
- **Загрузочные состояния** - индикаторы загрузки для всех асинхронных операций
- **Обработка ошибок** - пользовательские сообщения об ошибках

## 🔐 Безопасность

- JWT токены для аутентификации
- Автоматическое перенаправление при истечении сессии
- Защищенные маршруты
- Валидация данных на клиенте

---

**Статус**: ✅ Готово к использованию  
**Версия**: 1.0.0  
**Последнее обновление**: 2025-08-29

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
