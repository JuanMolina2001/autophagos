# Autophagos

Este proyecto es parte de una aplicación que utiliza Puppeteer para automatizar la navegación y encontrar fagos en secuencias de contigs. La aplicación utiliza Electron para crear una interfaz de usuario y realizar la comunicación entre procesos.

## Instalación
### Ejecutable
Descarga el ejecutable desde el siguiente enlace:

[instalador (google drive)](https://drive.google.com/file/d/1CCHQdHVQdbpR6vRvbI37hCS8n70IqO1h/view?usp=sharing)

### Script de Puppeteer

Si prefieres utilizar el script de Puppeteer, sigue estos pasos:

- Descarga el archivo script.js

-Asegúrate de tener Node.js instalado en tu sistema.

-Ejecuta el siguiente comando para inicializar el proyecto:

`npm init -y`

-Instala Puppeteer con el siguiente comando:

`npm install`

-Para iniciar el script utiliza

`node script.js`

### Descargar el repositorio
También puedes descargar el repo e instalar las dependencias con con:

`npm install`

Luego ejecutar el siguiente comando para iniciar el ejecutable:

`npm start`

## Uso
Para su uso solo ingresa la url de la National Library of Medicine que contenga los contigs y apriete iniciar

si quieres ver el navegador mientras se ejecuta el programa puede desactivarlo en la opción abajo de donde se ingresa el enlace

si esta utilizando el script coloque la url en la linea que diga (linea 11)
`const page = await browser.newPage(); await page.goto('coloque el link aquí');`



