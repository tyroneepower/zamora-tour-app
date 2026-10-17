// ============================================================
//  DATOS DE LA APP. Es lo único que tienes que editar.
//  Todo lo marcado BORRADOR o aproximado hay que revisarlo.
// ============================================================
window.ZC = {
  config: {
    // ID de tu programa en Spotify: open.spotify.com/show/<ESTE_ID>
    spotifyShowId: "5iRoQgoq2GoSPdYAjDkITK",
    // Enlace a tu podcast en iVoox
    ivooxPodcastUrl: "https://www.ivoox.com/podcast-zamora-a-traves-su-historia_sq_f12728440_1.html",
    // Un edificio se detecta si está a menos de estos metros...
    maxDistance: 150,
    // ...y dentro de este ángulo (grados a cada lado) respecto a donde apunta la cámara
    fov: 40
  },

  // Orden de la ruta a pie (ids de "monumentos"), igual que en la portada
  ruta: ["catedral", "castillo", "murallas", "magdalena", "modernismo", "puente"],

  // Coordenadas APROXIMADAS: compruébalas en Google Maps (clic derecho > copiar coordenadas).
  // Niveles: facil, general, profundo, peques. Si falta uno se usa "general".
  // spotifyEpisodeId: el de open.spotify.com/episode/<ID>.  ivooxEpisodeId: el número que sale en el enlace del episodio.
  monumentos: [
    {
      id: "catedral", nombre: "Catedral de Zamora", epoca: "Siglo XII",
      titulo: "Una cúpula con escamas de dragón", duracion: "1 min", foto: "img/catedral.webp",
      lat: 41.5026, lng: -5.7527, spotifyEpisodeId: "", ivooxEpisodeId: "",
      resumen: "Levantada en apenas un cuarto de siglo, su cimborrio de escamas de piedra es una de las imágenes más reconocibles del románico español.",
      niveles: {
        facil: "Esta es la Catedral de Zamora.\n\nEs muy antigua. Se construyó hace casi 900 años.\n\nArriba tiene una cúpula. La cúpula tiene piedras con forma de escama, como un pez.\n\nDentro hay un museo con tapices. Los tapices son telas grandes con dibujos.",
        general: "La Catedral de Zamora se levantó en el siglo XII, en muy pocos años para una obra de su tamaño. Su cimborrio, cubierto de escamas de piedra, es una de las imágenes más reconocibles del románico español.\n\nEn su interior, el museo catedralicio guarda una importante colección de tapices.",
        profundo: "BORRADOR, revísalo. Obra de la segunda mitad del siglo XII, la catedral combina el lenguaje románico con influencias de otras tradiciones. El cimborrio de gallones, rematado por una linterna y cuatro torrecillas, la distingue de otras catedrales peninsulares.\n\nLos siglos posteriores añadieron elementos góticos y barrocos que hoy conviven con la estructura original.",
        peques: "¿Ves esa cúpula con escamas, como un dragón dormido?\n\nEs la cúpula de la catedral. Está hecha con muchas piedras pequeñas, puestas una a una.\n\n¡Y lleva ahí casi 900 años!"
      }
    },
    {
      id: "castillo", nombre: "Castillo de Zamora", epoca: "Siglo XI",
      titulo: "Desde lo alto de la Bien Cercada", duracion: "1 min", foto: "img/castillo.webp",
      lat: 41.5059, lng: -5.7549, spotifyEpisodeId: "", ivooxEpisodeId: "",
      resumen: "La fortaleza que vigila el extremo occidental de la ciudad antigua, junto al Duero.",
      niveles: {
        facil: "Este es el castillo de Zamora.\n\nEstá en un extremo de la ciudad, cerca del río.\n\nAntes servía para defender la ciudad. Ahora lo puedes visitar.",
        general: "BORRADOR, sustituye por tu guion. El castillo ocupa el extremo occidental de la ciudad antigua, junto al río Duero, y fue durante siglos una pieza clave de su defensa. Hoy está rodeado de jardines y se puede recorrer.",
        profundo: "BORRADOR, sustituye por tu guion. Fortaleza de origen medieval en el extremo occidental del recinto amurallado, integrada en el sistema defensivo de la ciudad y volcada sobre el Duero.",
        peques: "¡Un castillo de verdad! Tiene torres altas y murallas muy gruesas.\n\nAntes lo usaban para vigilar que no llegara ningún enemigo."
      }
    },
    {
      id: "murallas", nombre: "Portillo de la Traición", epoca: "Siglo XI",
      titulo: "Zamora no se ganó en una hora", duracion: "1 min", foto: "img/murallas.webp",
      lat: 41.5065, lng: -5.7558, spotifyEpisodeId: "", ivooxEpisodeId: "163381324",
      episodioTitulo: "Los tres recintos de la Muralla medieval de Zamora",
      resumen: "Una pequeña puerta en la muralla ligada a la leyenda del cerco de Zamora.",
      niveles: {
        facil: "Esta es una puerta pequeña en la muralla.\n\nTiene una historia famosa. Cuenta que un hombre traicionó a un rey.\n\nPor eso se llama Portillo de la Traición.",
        general: "BORRADOR, sustituye por tu guion. El Portillo de la Traición es una puerta de la muralla vinculada por la tradición al cerco de Zamora y a la figura de Vellido Dolfos. De ahí viene el dicho de que Zamora no se ganó en una hora.",
        profundo: "BORRADOR, sustituye por tu guion. El portillo conecta la tradición legendaria del cerco de Zamora con el trazado real de la muralla. Conviene distinguir lo que cuentan los cantares y crónicas de lo que documenta la arqueología.",
        peques: "Esta puerta es muy pequeña y tiene una historia de caballeros y traiciones.\n\n¿Te atreves a pasar por ella?"
      }
    },
    {
      id: "magdalena", nombre: "Iglesia de la Magdalena", epoca: "Siglos XII–XIII",
      titulo: "Una puerta para mirar despacio", duracion: "1 min", foto: "img/magdalena.webp",
      lat: 41.5049, lng: -5.7494, spotifyEpisodeId: "", ivooxEpisodeId: "",
      resumen: "Una iglesia románica cuya portada sur, con arcos decorados, merece mirarse sin prisa.",
      niveles: {
        facil: "Esta es la iglesia de la Magdalena.\n\nTiene una puerta muy bonita, con muchos arcos y dibujos en la piedra.\n\nMírala despacio. Verás muchos detalles.",
        general: "BORRADOR, sustituye por tu guion. La iglesia de la Magdalena es uno de los grandes ejemplos del románico de Zamora. Su portada sur, con varios arcos decorados, es lo que más atrae la mirada.",
        profundo: "BORRADOR, sustituye por tu guion. Iglesia románica de los siglos XII y XIII. Destaca la portada meridional, con arquivoltas ricamente decoradas que concentran buena parte de su valor artístico.",
        peques: "Mira esta puerta: tiene muchos arcos, uno dentro de otro, como una muñeca rusa.\n\n¿Cuántos puedes contar?"
      }
    },
    {
      id: "modernismo", nombre: "Zamora modernista", epoca: "Principios del siglo XX",
      titulo: "Cuando la piedra aprendió a curvarse", duracion: "1 min", foto: "img/modernismo.webp",
      lat: 41.5040, lng: -5.7450, spotifyEpisodeId: "", ivooxEpisodeId: "",
      resumen: "Fachadas de principios del siglo XX con balcones de forja y formas curvas, lejos del románico.",
      niveles: {
        facil: "Zamora no solo tiene edificios muy antiguos.\n\nTambién tiene casas de hace unos 100 años.\n\nTienen balcones de hierro y formas curvas.",
        general: "BORRADOR, sustituye por tu guion. Además del románico, Zamora conserva edificios modernistas de principios del siglo XX, con balcones de forja, ornamentación y formas curvas.",
        profundo: "BORRADOR, sustituye por tu guion. El modernismo zamorano convive con el casco histórico y refleja el gusto de la burguesía local a comienzos del siglo XX.",
        peques: "Estas casas tienen balcones de hierro con dibujos y paredes que parecen onduladas.\n\n¡Parecen de cuento!"
      }
    },
    {
      id: "puente", nombre: "Puente de Piedra", epoca: "Siglos XII–XIII",
      titulo: "Dieciséis arcos para cruzar el Duero", duracion: "1 min", foto: "img/puente.webp",
      lat: 41.5019, lng: -5.7505, spotifyEpisodeId: "", ivooxEpisodeId: "",
      resumen: "El puente medieval que cruza el Duero y da la mejor vista de la ciudad.",
      niveles: {
        facil: "Este es el Puente de Piedra.\n\nCruza el río Duero.\n\nEs muy antiguo. Tiene muchos arcos.",
        general: "BORRADOR, sustituye por tu guion. El Puente de Piedra salva el Duero con una larga hilera de arcos y es desde hace siglos la entrada natural a la ciudad. Desde sus alrededores se ve el skyline de la catedral.",
        profundo: "BORRADOR, sustituye por tu guion. Puente medieval reformado a lo largo de los siglos, uno de los símbolos de la ciudad y punto de paso histórico sobre el Duero.",
        peques: "Este puente es larguísimo y está hecho de piedra.\n\nSi lo cruzas, ¿puedes contar los arcos?"
      }
    }
  ],

  // Episodios de iVoox para la pestaña Episodios (los 20 más recientes).
  // ivooxId: el número que aparece en el enlace del episodio, entre "_rf_" y "_1.html".
  // Para añadir uno nuevo, copia una línea y cambia título, duración e ID.
  episodios: [
    { titulo: "Zamora y el Mito de la Numancia Perdida", duracion: "16:12", ivooxId: "174092734" },
    { titulo: "El Tesoro Empeñado de Montamarta", duracion: "19:28", ivooxId: "173790926" },
    { titulo: "Venialbo: La Compra de la Libertad y su Templo", duracion: "16:53", ivooxId: "173787208" },
    { titulo: "El Mapa de la Desmembración: Ventas Jurisdiccionales y Consolidación Señorial en Zamora (Siglos XVI-XVII)", duracion: "12:59", ivooxId: "173781643" },
    { titulo: "Felipe II. El precio de la Hegemonía y el Coste de un Imperio", duracion: "14:55", ivooxId: "173778967" },
    { titulo: "Crónica del Beato Martín Cid: Arquitecto de la Fe y la Caridad en la Zamora del Siglo XII", duracion: "25:54", ivooxId: "173442294" },
    { titulo: "El Caballero Zamorano que acabó en Boston. Viaje y odisea del orante de alabastro Mera", duracion: "20:30", ivooxId: "173404884" },
    { titulo: "Espías y hambre en la Zamora liberal (Trienio Liberal, 1820-1823)", duracion: "22:03", ivooxId: "168779471" },
    { titulo: "Francisco de Valencia: El Vínculo entre el Heroísmo Zamorano y la Pluma de Cervantes", duracion: "15:16", ivooxId: "167556590" },
    { titulo: "Santa Columba: Cenobio Perdido de Zamora", duracion: "14:58", ivooxId: "163849917" },
    { titulo: "Historia y evolución del monasterio de Santa María la Real de las Dueñas de Zamora", duracion: "15:43", ivooxId: "163834378" },
    { titulo: "Coomonte, la forja de un genio Zamorano", duracion: "10:34", ivooxId: "163787045" },
    { titulo: "El capitán Zamorano y la conspiración para asesinar a Cortés", duracion: "10:58", ivooxId: "163480137" },
    { titulo: "Zamoranos: Liderazgo y Acción en la América del Siglo XVI", duracion: "12:29", ivooxId: "163479888" },
    { titulo: "La Manta Zamorana. Hilos de Historia y Color. De Paño a Zarzuela", duracion: "14:10", ivooxId: "163415885" },
    { titulo: "Zamora envejecida: radiografía de la exclusión digital", duracion: "15:09", ivooxId: "163414178" },
    { titulo: "Arqueología Romana y Medieval de Villar del Buey. Cloutina y el tablero romano", duracion: "12:33", ivooxId: "163413913" },
    { titulo: "Iglesia de San Simón. Templo y cimiento del Cementerio San Atilano", duracion: "15:05", ivooxId: "163381567" },
    { titulo: "Los tres recintos de la Muralla medieval de Zamora", duracion: "16:31", ivooxId: "163381324" },
    { titulo: "Iglesias Propias y Diezmos Zamoranos", duracion: "15:14", ivooxId: "163338358" }
  ]
};
