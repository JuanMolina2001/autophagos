# Autophagos

Este proyecto es parte de una aplicación que utiliza Puppeteer para automatizar la navegación y encontrar fagos en secuencias de contigs. La aplicación utiliza Electron para crear una interfaz de usuario y realizar la comunicación entre procesos.

## Instalación
### Ejecutable
Descarga el ejecutable desde el siguiente enlace:
[instalador (google drive)](https://drive.google.com/file/d/1CCHQdHVQdbpR6vRvbI37hCS8n70IqO1h/view?usp=sharing)
### Script de Puppeteer
Si prefieres utilizar el script de Puppeteer, sigue estos pasos:
Descarga el archivo script.js
Asegúrate de tener Node.js instalado en tu sistema.
Ejecuta el siguiente comando para inicializar el proyecto:
`npm init -y`
Instala Puppeteer con el siguiente comando:
`npm install`
Para iniciar el script utiliza
`node script.js`
### Descargar el repositorio
También puedes descargar el repo e instalar las dependencias con con:
`npm install`
Luego ejecutar el siguiente comando para iniciar el ejecutable:
`npm start`

## Uso
Para su uso solo ingresa la url de la National Library of Medicine que contenga los contigs y apriete iniciar

si esta utilizando el script coloque la url en la linea que diga
`const page = await browser.newPage();`
`await page.goto('coloque el link aquí');`


## Licencia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
