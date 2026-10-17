# Zamora Contada (con funciones de Zamorensis)

Aspecto de la app generada por Netlify (mismos colores, tipografías, fotos y portada) más:
- Escanear: cámara trasera + GPS + brújula para detectar el edificio que tienes delante.
- Mapa y ruta a pie con enlace a Google Maps.
- Ficha por monumento con 4 niveles de lectura, lectura en voz alta y tu episodio de Spotify o iVoox.
- Pestaña Episodios con tu programa.

## Qué editar (todo en data.js)
- Coordenadas reales de cada monumento (ahora aproximadas).
- Ya están puestos tu programa de Spotify y tu podcast de iVoox. Por monumento puedes enlazar un episodio con spotifyEpisodeId / ivooxEpisodeId (ahora solo el Portillo de la Traición lo tiene).
- Los textos marcados BORRADOR: sustitúyelos por tus guiones.
- La lista de episodios de iVoox (20 puestos). Para añadir uno, copia una línea y cambia título, duración e ID (el número entre _rf_ y _1.html del enlace).
- Logo de iVoox: ahora es una insignia naranja con 'iV'. Para usar el oficial, guarda el archivo como img/ivoox.png y se mostrará solo.

## Subir a Netlify
En el proyecto zamora-tour-app > Deploys, arrastra esta carpeta entera (o el zip). Sustituye a la versión actual.
Antes de hacerlo, guarda una copia de la anterior si quieres poder volver a ella.
