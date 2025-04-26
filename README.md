# Personal Trainer Frontend

This is the final task for the **Frontend Development** course. The project is a React-based web application for a Personal Trainer company. It connects to a REST API to manage customer and training data.

## 📚 Project Description

The app allows users to:

- View, add, edit, and delete customers and trainings
- Search and sort data in tables
- Format training dates neatly
- Database reset
- Export customer data to a CSV file
- View all trainings in a calendar view
- See training statistics displayed in a bar, donut and radial charts
- Deploy the app to a cloud server for public access

The project uses several third-party libraries to enhance functionality and UI experience.

## 🚀 Technologies and Libraries Used

- React
- Typescript
- React Router
- Material UI (MUI)
- AG Grid
- Dayjs
- Date-fns
- Recharts
- Lodash
- React-CSV
- FullCalendar
- Vite (for fast development setup)

## 📋 Features

### Part 1 (✅ Completed)

- Customer list page
- Training list page
- Sorting and searching/filtering on both lists
- Training list shows the customer name and formatted date

### Part 2 (✅ Completed)

- Add, edit, and delete customers (with confirmation dialogs)
- Add and delete trainings (with date picker and confirmation dialogs)

### Part 3 (✅ Completed)

- Export customer data to CSV (excluding unnecessary columns)
- Calendar view showing all trainings
- App deployed to [ https://ezzajalal.github.io/frontend_final_project/]

### Part 4 (✅ Completed)

- Statistics page with bar chart showing total minutes spent on different activities

## 🔗 REST API Documentation

[Personal Trainer REST API Documentation](https://juhahinkula.github.io/personaltrainerdocs/)

## 🖥️ Deployment

The application is deployed at:  https://ezzajalal.github.io/frontend_final_project/




# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
