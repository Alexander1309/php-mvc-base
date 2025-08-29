# � Sistema de Errores AUTOMÁTICO - php-mvc-base

## ✨ **¡COMPLETAMENTE AUTOMÁTICO!**

Tu sistema de errores ahora es **100% automático e interno**. No necesita controladores externos, vistas separadas ni configuración adicional. Todo está integrado en las librerías del sistema.

---

## 🎯 **Errores que se detectan AUTOMÁTICAMENTE:**

### 1. **🔍 Errores de Navegación (404)**

```
❌ http://localhost/pagina-inexistente
❌ http://localhost/home/metodo-inexistente
❌ http://localhost/usuarios/accion-que-no-existe
```

**→ Página de error 404 automática con diseño profesional**

### 2. **⚠️ Errores de Sistema (500)**

```php
// ❌ Estos errores se capturan automáticamente:
$variable->metodoInexistente();           // Error fatal
include 'archivo-inexistente.php';        // Archivo no encontrado
$array[key_inexistente]->propiedad;       // Notice/Warning
throw new Exception('Error manual');      // Excepción no capturada
```

**→ Página de error 500 automática con logging**

### 3. **🛡️ Errores de PHP (Todos los tipos)**

- **Fatal Errors** → Error 500 automático
- **Parse Errors** → Error 500 automático
- **Warnings** → Log automático (continúa ejecución)
- **Notices** → Log automático (continúa ejecución)
- **Deprecated** → Log automático (continúa ejecución)

---

## 🛠️ **Errores MANUALES (cuando necesites control específico):**

### **Validaciones de Negocio:**

```php
<?php
class UsuariosController extends Controller
{
    public function perfil($id = null)
    {
        // ✅ Verificar autenticación
        if (!isset($_SESSION['user_id'])) {
            ErrorHandler::handle401('Debe iniciar sesión');
            return;
        }

        // ✅ Verificar permisos
        if (!$this->userCanViewProfile($id)) {
            ErrorHandler::handle403('Sin permisos para ver este perfil');
            return;
        }

        // ✅ Verificar que existe
        $user = $this->model->getUser($id);
        if (!$user) {
            ErrorHandler::handle404("Usuario {$id} no encontrado");
            return;
        }

        // ✅ Todo correcto
        $this->view->render('usuarios/perfil', ['user' => $user]);
    }
}
```

### **Validaciones de Datos:**

```php
public function crearUsuario()
{
    // ✅ Validar datos obligatorios
    if (empty($_POST['email'])) {
        ErrorHandler::handleCustom(400, 'Email obligatorio', 'Debe proporcionar un email válido');
        return;
    }

    // ✅ Validar formato
    if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        ErrorHandler::handleCustom(400, 'Email inválido', 'El formato del email no es correcto');
        return;
    }

    // ✅ Verificar duplicados
    if ($this->model->emailExists($_POST['email'])) {
        ErrorHandler::handleCustom(409, 'Email ya existe', 'Este email ya está registrado');
        return;
    }

    // Crear usuario...
}
```

### **APIs y Servicios:**

```php
public function apiGetUser($id)
{
    // ✅ Verificar API key
    if (!$this->isValidApiKey()) {
        ErrorHandler::handle401('API key inválida o expirada');
        return;
    }

    // ✅ Verificar rate limiting
    if ($this->exceedsRateLimit()) {
        ErrorHandler::handleCustom(429, 'Demasiadas peticiones', 'Límite de rate excedido');
        return;
    }

    // ✅ Buscar usuario
    $user = $this->model->getUser($id);
    if (!$user) {
        ErrorHandler::handle404('Usuario no encontrado');
        return;
    }

    // Respuesta exitosa
    header('Content-Type: application/json');
    echo json_encode($user);
}
```

---

## 📊 **Características del Sistema Automático:**

### **🎨 Diseño Profesional Integrado:**

- ✅ **Responsive** - Se adapta a móviles y tablets
- ✅ **Moderno** - Gradientes, animaciones, glassmorphism
- ✅ **Accesible** - Colores contrastados, tipografía legible
- ✅ **Iconos contextuales** - Diferentes según el tipo de error

### **📊 Información Inteligente:**

- ✅ **Código de error** prominente (404, 500, etc.)
- ✅ **Mensaje descriptivo** claro para usuarios
- ✅ **Botones de acción** (Inicio, Volver, Buscar)
- ✅ **Request ID** para soporte técnico

### **🔧 Modo Debug vs Producción:**

```php
// En libs/errorConfig.php:

// 🛠️ DESARROLLO (muestra detalles técnicos)
define('DEBUG_MODE', true);

// 🚀 PRODUCCIÓN (oculta detalles sensibles)
define('DEBUG_MODE', false);
```

**En DEBUG_MODE = true:**

- Muestra URL completa, IP, User-Agent
- Detalles técnicos del error
- Stack traces completos

**En DEBUG_MODE = false:**

- Solo mensaje amigable al usuario
- ID corto para referenciar en logs
- Sin información técnica sensible

### **📋 Logging Automático:**

- ✅ **Todos los errores** se registran automáticamente
- ✅ **Contexto completo** (URL, IP, timestamp, etc.)
- ✅ **Diferentes archivos** por tipo de error
- ✅ **Rotación automática** opcional

---

## 🚀 **Métodos Disponibles:**

```php
// Errores HTTP estándar
ErrorHandler::handle401('Mensaje de autenticación');
ErrorHandler::handle403('Mensaje de permisos');
ErrorHandler::handle404('Recurso no encontrado');
ErrorHandler::handle500('Error interno específico');

// Error personalizado
ErrorHandler::handleCustom(
    418,                           // Código HTTP
    'Soy una tetera',             // Mensaje principal
    'Este servidor es una tetera'  // Descripción detallada
);
```

---

## � **Archivos del Sistema:**

### **🔧 Archivos Principales:**

- ✅ `libs/errorHandler.php` - Sistema completo de errores
- ✅ `libs/errorConfig.php` - Configuración automática
- ✅ `index.php` - Carga automática del sistema

### **📝 Logs Automáticos:**

- ✅ `logs/error.log` - Errores de aplicación
- ✅ `logs/info.log` - Información general
- ✅ `logs/php_errors.log` - Errores nativos de PHP

### **🗂️ Archivos Backup (ya no necesarios):**

- 🔒 `controllers/errorController.php.backup`
- 🔒 `views/error_backup/`

---

## 🎯 **Resumen Final:**

### **✅ TODO FUNCIONA AUTOMÁTICAMENTE:**

- 🔍 **404** para URLs inexistentes
- ⚠️ **500** para errores de código
- 🛡️ **Logging** de todos los errores
- 🎨 **Páginas profesionales** sin configuración
- � **Diseño responsive** automático

### **🛠️ SOLO AGREGA ERRORES MANUALES CUANDO:**

- 🔐 Necesites verificar autenticación (401)
- 🚫 Necesites verificar permisos (403)
- ✅ Valides datos de entrada (400, 422)
- 🎯 Tengas lógica de negocio específica

**¡Tu sistema es ahora completamente profesional y automático!** 🚀✨

No necesitas crear controladores, vistas ni configurar nada más. El sistema detecta y maneja todos los errores automáticamente con un diseño profesional y logging completo.
