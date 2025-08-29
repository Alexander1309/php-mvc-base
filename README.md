# 🐘 php-mvc-base

![PHP](https://img.shields.io/badge/PHP-^8.0-777BB4?style=for-the-badge&logo=php)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

Una plantilla base (**boilerplate**) ligera y robusta para construir aplicaciones web con PHP, siguiendo el patrón de diseño **Modelo-Vista-Controlador (MVC)**. Este proyecto ofrece una fundación sólida y organizada para desarrolladores que desean crear aplicaciones personalizadas sin la sobrecarga de un framework pesado.

---

## ✨ Características

- 🏛️ **Estructura MVC Clara:** Separación de responsabilidades con directorios dedicados para `models`, `views` y `controllers`.
- 🧭 **Enrutamiento Sencillo:** Un controlador frontal y un enrutador básicos para manejar las peticiones y dirigirlas al controlador correspondiente.
- 🧩 **Fácil de Extender:** Diseñado como un punto de partida, facilitando la adición de nuevas librerías, modelos y funcionalidades.
- 🍦 **PHP Puro (Vanilla):** Construido sin dependencias de frameworks, ideal para entender los conceptos fundamentales de PHP y el patrón MVC.
- 🚀 **Listo para Desplegar:** Configuración mínima requerida para empezar a desarrollar.

---

## 🏁 Primeros Pasos

Para poner en marcha este proyecto, solo necesitas un entorno de desarrollo PHP como XAMPP, WAMP o MAMP.

1.  **Clona el repositorio:**
    ```bash
    git clone <URL-DEL-REPOSITORIO>
    ```
2.  **Configura tu servidor local:**
    Apunta la raíz de tu servidor web (ej. Apache) al directorio principal de este proyecto.
3.  **¡Listo!**
    Abre tu navegador y navega a `http://localhost` para ver la página de inicio.

---

## 📂 Estructura del Proyecto

El proyecto está organizado de una manera intuitiva para facilitar el desarrollo y mantenimiento.

```
/
├── assets/         # Archivos públicos (CSS, JS, imágenes)
├── controllers/    # Lógica de control (une modelos y vistas)
├── libs/           # Clases base y librerías del núcleo (App, Controller, Model, etc.)
├── models/         # Lógica de negocio y acceso a datos
├── views/          # Plantillas de la interfaz de usuario (UI)
├── .htaccess       # Reglas de reescritura de URL para Apache
└── index.php       # Punto de entrada único de la aplicación (Front Controller)
```

---

## ✍️ Creadores

Este proyecto es mantenido por una comunidad de desarrolladores apasionados. ¡Gracias a todos los que contribuyen!

| [<img src="https://avatars.githubusercontent.com/u/60914637?v=4" width="100px;"/><br /><sub><b>Alexander1309</b></sub>](https://github.com/Alexander1309/) | [<img src="https://avatars.githubusercontent.com/u/435334?v=4" width="100px;"/><br /><sub><b>rriojas</b></sub>](https://github.com/rriojas) |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------: |

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
