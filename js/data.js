// Datos estructurados de noticias basados en el documento fuente
const newsData = {
  lastUpdated: "2025-09-27T10:30:00Z",
  categories: {
    economia: {
      name: "Economía",
      icon: "fas fa-chart-line",
      color: "#28a745",
      articles: [
        {
          id: "economia-1",
          title: "Reservas del BCRA Alcanzan Récord Histórico con Respaldo de EE.UU.",
          summary: "El Banco Central acumuló casi 1,900 millones de dólares en un solo día, llevando las reservas a superar los 41,200 millones tras el anuncio del paquete financiero estadounidense de 20,000 millones.",
          content: `
            <h3>Una Semana de Puntos de Inflexión Económicos</h3>
            <p>El mercado cambiario experimentó una notable divergencia en sus distintas cotizaciones, reflejando una intervención deliberada y multifacética por parte de las autoridades económicas. La semana concluyó con una fuerte apreciación del peso en el segmento oficial, donde el dólar mayorista cerró en $1,326, acumulando una caída semanal del 10.1%.</p>
            
            <p>En contraste, las cotizaciones financieras se dispararon: el dólar "contado con liquidación" (CCL) escaló hasta los $1,462 y el dólar MEP superó los $1,423, lo que amplió la brecha cambiaria por encima del 7.7% y el 10% en algunos momentos de la jornada del viernes.</p>
            
            <h3>La Estrategia de "Doble Pinza"</h3>
            <p>El evento más destacado fue el extraordinario aumento de las reservas internacionales del BCRA, que sumaron casi 1,900 millones de dólares en un solo día. Este resultado fue el producto de una combinación de factores: una masiva liquidación de divisas por parte del sector agroexportador y compras directas realizadas por el Tesoro en el mercado de cambios.</p>
            
            <p>La reimplantación de una medida regulatoria por parte del BCRA estableció que quienes compren dólares en el mercado oficial deberán esperar un plazo de 90 días para poder operar en los mercados de MEP o CCL. Esta restricción fue diseñada para desarticular las operaciones de arbitraje conocidas como "rulo".</p>
            
            <h3>Respaldo Internacional Como Catalizador</h3>
            <p>El punto de inflexión de la semana fue el anuncio de un paquete de apoyo financiero de 20,000 millones de dólares proveniente de Estados Unidos, presentado como fruto directo de la alineación geopolítica del gobierno argentino con la administración Trump.</p>
            
            <p>La reacción de los mercados fue inmediata y contundente. La deuda argentina registró su mejor semana desde 2022. El Ministerio de Economía logró refinanciar el 130% de sus vencimientos, captando un total de 7.3 billones de pesos en su primera licitación tras el anuncio.</p>
            
            <table>
              <thead>
                <tr>
                  <th>Indicador</th>
                  <th>Cierre 19/09</th>
                  <th>Cierre 26/09</th>
                  <th>Variación %</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Dólar Oficial</td>
                  <td>$1,475</td>
                  <td>$1,326</td>
                  <td>-10.1%</td>
                </tr>
                <tr>
                  <td>Dólar Blue</td>
                  <td>$1,520</td>
                  <td>$1,440</td>
                  <td>-5.3%</td>
                </tr>
                <tr>
                  <td>Dólar MEP</td>
                  <td>$1,337</td>
                  <td>$1,423</td>
                  <td>+6.5%</td>
                </tr>
                <tr>
                  <td>Dólar CCL</td>
                  <td>$1,370</td>
                  <td>$1,462</td>
                  <td>+6.7%</td>
                </tr>
                <tr>
                  <td>Reservas BCRA</td>
                  <td>$39,349 MM</td>
                  <td>$41,238 MM</td>
                  <td>+4.8%</td>
                </tr>
              </tbody>
            </table>
          `,
          category: "economia",
          date: "2025-09-27",
          readTime: "4 min"
        },
        {
          id: "economia-2",
          title: "El Mercado de Acciones Reacciona Positivamente al Respaldo Internacional",
          summary: "El índice S&P Merval cerró con ganancia del 1.31%, alcanzando los 1,791,046 puntos, reflejando el optimismo por el paquete financiero estadounidense.",
          content: `
            <h3>Optimismo en el Mercado Bursátil</h3>
            <p>El optimismo se reflejó también en el mercado de acciones. El índice S&P Merval de la Bolsa de Buenos Aires cerró la semana con una ganancia del 1.31% en la jornada del viernes, alcanzando los 1,791,046 puntos.</p>
            
            <h3>Nuevas Inversiones en el Horizonte</h3>
            <p>En el ámbito sectorial, se produjeron noticias relevantes para la inversión a largo plazo. El gobierno, con el respaldo del Banco Mundial, aprobó la inclusión del proyecto minero de cobre Los Azules, una inversión multimillonaria, dentro del Régimen de Incentivo para Grandes Inversiones (RIGI).</p>
            
            <p>En el sector energético, la empresa GeoPark reafirmó su confianza en el potencial de crecimiento de Vaca Muerta y se encuentra evaluando nuevas inversiones en la formación no convencional.</p>
          `,
          category: "economia",
          date: "2025-09-27",
          readTime: "2 min"
        }
      ]
    },
    politica: {
      name: "Política",
      icon: "fas fa-landmark",
      color: "#0066cc",
      articles: [
        {
          id: "politica-1",
          title: "Gobierno Reafirma su Batalla Cultural por las Ideas de la Libertad",
          summary: "El oficialismo defiende su modelo económico y caracteriza la transformación ideológica como una misión que trasciende la gestión económica hacia la deconstrucción del populismo.",
          content: `
            <h3>La Defensa del Modelo Económico</h3>
            <p>En una entrevista concedida a A24, el ministro de Economía, Luis Caputo, expuso con firmeza los fundamentos de la política económica del gobierno. El mensaje central fue que la administración heredó una economía en estado de caos absoluto, sin financiamiento y al borde de una hiperinflación.</p>
            
            <p>Desde esta perspectiva oficialista, el gobierno se presenta como un actor de una responsabilidad fiscal superior incluso a la exigida por el Fondo Monetario Internacional (FMI). Se destacó que la meta autoimpuesta no es simplemente alcanzar un superávit primario, sino un superávit financiero, que incluye el servicio de la deuda.</p>
            
            <h3>La Batalla Cultural por las Ideas</h3>
            <p>El proyecto del gobierno trasciende la mera gestión económica para adentrarse en una profunda "batalla cultural", tal como lo articuló el diputado y principal aliado del oficialismo, José Luis Espert. La misión es deconstruir el legado del populismo e instalar de manera permanente en la sociedad las "ideas de la libertad".</p>
            
            <p>En este marco, cada elección ganada por la coalición gobernante es interpretada como un mandato popular para profundizar esta transformación ideológica. La oposición, y en particular el kirchnerismo, es sistemáticamente equiparada con la "miseria" y los "basurales".</p>
            
            <h3>Caracterización de la Oposición</h3>
            <p>La caracterización de la oposición política por parte del gobierno se centró en describirla como un conjunto de actores que, carentes de argumentos sólidos, recurren a la violencia, la descalificación personal y la obstrucción institucional.</p>
            
            <p>El Jefe de Gabinete, Guillermo Francos, denunció esta supuesta estrategia, citando como ejemplo un presunto atentado contra el domicilio del diputado Espert, en el que se habría utilizado un vehículo oficial de la provincia de Buenos Aires.</p>
          `,
          category: "politica",
          date: "2025-09-27",
          readTime: "3 min"
        }
      ]
    },
    deportes: {
      name: "Deportes",
      icon: "fas fa-futbol",
      color: "#ff6b35",
      articles: [
        {
          id: "deportes-1",
          title: "Semana Agridulce: Brillan los Argentinos en el Exterior, Decepción Local",
          summary: "Mientras Messi, Julián Álvarez y otros argentinos brillan en sus clubes extranjeros, River y Estudiantes se despidieron de la Copa Libertadores.",
          content: `
            <h3>Eliminación en Copa Libertadores</h3>
            <p>La semana fue particularmente amarga para los equipos argentinos en la Copa Libertadores. Tanto River Plate, que cayó ante Palmeiras de Brasil, como Estudiantes de La Plata, eliminado en una definición por penales frente a Flamengo, también de Brasil, se despidieron del certamen en la instancia de cuartos de final.</p>
            
            <p>Esto dejó al fútbol argentino sin representantes en las semifinales. La contracara fue la Copa Sudamericana, donde Lanús logró avanzar a las semifinales y se enfrentará a Universidad de Chile por un lugar en la final del torneo.</p>
            
            <h3>Liga Profesional Argentina</h3>
            <p>En el marco de la décima fecha del Torneo Clausura de la Liga Profesional, Tigre obtuvo una importante victoria como visitante por 1-0 frente a Central Córdoba en Santiago del Estero. Platense y San Martín de San Juan protagonizaron un vibrante empate 2-2, mientras que Banfield y Unión finalizaron 0-0.</p>
            
            <h3>Argentinos Brillando en el Mundo</h3>
            <p>Los futbolistas argentinos que militan en ligas extranjeras tuvieron una semana de actuaciones sobresalientes:</p>
            
            <ul>
              <li><strong>Lionel Messi</strong> fue la figura indiscutida en la victoria del Inter Miami por 4-0 sobre el New York City FC, contribuyendo con dos goles y una asistencia para asegurar la clasificación de su equipo a los Playoffs de la MLS.</li>
              
              <li><strong>Julián Álvarez</strong> se vistió de héroe para el Atlético de Madrid en el clásico contra el Real Madrid, donde su actuación fue calificada como "fenomenal" y decisiva para el triunfo de su equipo.</li>
              
              <li><strong>Franco Mastantuono</strong> sigue afianzándose en el Real Madrid y esta semana marcó su primer gol oficial con la camiseta del club merengue.</li>
              
              <li><strong>Mauro Icardi</strong> anotó un golazo de taco para darle la victoria al Galatasaray en Turquía, consolidándose como el máximo artillero del campeonato de ese país.</li>
            </ul>
            
            <h3>Otros Deportes</h3>
            <p>En el rugby, Los Pumas sufrieron una dura derrota ante los Springboks de Sudáfrica en Durban, poniendo fin a sus aspiraciones de pelear por el título del Rugby Championship. El partido dejó preocupación por la lesión de Gonzalo García.</p>
            
            <p>En automovilismo, Max Verstappen se adjudicó la victoria en el Gran Premio de Azerbaiyán de Fórmula 1, mientras que Franco Colapinto tuvo una carrera complicada, finalizando lejos de la zona de puntos tras un incidente en pista.</p>
          `,
          category: "deportes",
          date: "2025-09-27",
          readTime: "3 min"
        }
      ]
    },
    entretenimiento: {
      name: "Entretenimiento",
      icon: "fas fa-film",
      color: "#9b59b6",
      articles: [
        {
          id: "entretenimiento-1",
          title: "Renovación Completa: Estrenos de Cine y Novedades en Streaming",
          summary: "Desde thrillers con Leonardo DiCaprio hasta el musical Hamilton, la oferta de entretenimiento se diversifica en cines y plataformas digitales.",
          content: `
            <h3>Estrenos Destacados en Cine</h3>
            <p>La cartelera cinematográfica argentina recibió una diversa selección de títulos esta semana:</p>
            
            <ul>
              <li><strong>Una batalla tras otra</strong>: Un thriller de espionaje y acción protagonizado por Leonardo DiCaprio y Sean Penn, prometiendo una trama de alta tensión y giros inesperados.</li>
              
              <li><strong>Camina o muere</strong>: Adaptación de una de las primeras novelas de Stephen King, este filme de suspenso distópico presenta una premisa perturbadora: cien adolescentes forzados a participar en una marcha sin descanso donde detenerse significa la muerte.</li>
              
              <li><strong>Hamilton</strong>: Llega a la pantalla grande la versión filmada del aclamado musical de Broadway, una oportunidad para experimentar el fenómeno cultural que narra la vida de Alexander Hamilton.</li>
              
              <li><strong>La Casa de Muñecas de Gabby: La Película</strong>: La popular serie infantil da el salto al cine con una aventura en la que Gabby y sus amigos felinos se embarcan en un viaje por carretera lleno de música y diversión.</li>
            </ul>
            
            <p>Otros estrenos incluyen <em>Cazadores del fin del mundo</em>, el drama político italiano <em>La gran ambición</em>, y el reestreno del clásico de Studio Ghibli, <em>La colina de las amapolas</em>.</p>
            
            <h3>Novedades en Streaming</h3>
            
            <h4>Netflix</h4>
            <ul>
              <li><strong>El refugio atómico</strong>: Serie de suspenso sobre multimillonarios atrapados en un búnker de lujo ante una catástrofe global</li>
              <li><strong>Alice in Borderland</strong> (Temporada 3): Regresa la exitosa serie japonesa de ciencia ficción</li>
              <li><strong>Las maldiciones</strong>: Thriller político basado en la novela de Claudia Piñeiro, protagonizado por Leonardo Sbaraglia y dirigido por Daniel Burman</li>
              <li><strong>La casa Guinness</strong>: Drama de época que explora los secretos de la icónica familia cervecera irlandesa</li>
            </ul>
            
            <h4>Prime Video</h4>
            <ul>
              <li><strong>La novia</strong>: Thriller psicológico protagonizado y dirigido por Robin Wright, que explora la tensa relación entre una madre y la nueva pareja de su hijo</li>
            </ul>
            
            <h4>Disney+</h4>
            <ul>
              <li><strong>Los mufas: suerte para la desgracia</strong>: Serie de comedia argentina sobre un hombre considerado portador de mala suerte</li>
              <li><strong>Bridget Jones: loca por él</strong>: La cuarta película de la popular saga romántica retoma la historia de su entrañable protagonista</li>
            </ul>
          `,
          category: "entretenimiento",
          date: "2025-09-27",
          readTime: "3 min"
        }
      ]
    },
    tecnologia: {
      name: "Tecnología & IA",
      icon: "fas fa-microchip",
      color: "#2c3e50",
      articles: [
        {
          id: "tecnologia-1",
          title: "Alianza Histórica: Nvidia y OpenAI Forjan el Futuro de la Inteligencia Artificial",
          summary: "Nvidia invertirá hasta 100,000 millones de dólares en OpenAI para construir centros de datos con capacidad de 10 gigavatios, reconfigurando el panorama global de la IA.",
          content: `
            <h3>La Alianza del Siglo</h3>
            <p>La noticia más trascendental de la semana fue el anuncio de una alianza estratégica entre Nvidia, el líder mundial en la fabricación de chips para IA, y OpenAI, el laboratorio de investigación a la vanguardia del desarrollo de modelos de lenguaje.</p>
            
            <p>Nvidia se comprometió a una inversión de hasta 100,000 millones de dólares en OpenAI, destinada a la construcción de una nueva generación de centros de datos para IA con una capacidad energética de 10 gigavatios. Como parte del acuerdo, OpenAI desplegará millones de las unidades de procesamiento gráfico (GPU) más avanzadas de Nvidia.</p>
            
            <p>El mercado bursátil reaccionó con euforia, y las acciones de Nvidia experimentaron un alza superior al 3% tras el anuncio.</p>
            
            <h3>Implicaciones Estratégicas</h3>
            <p>Este pacto representa un hito que reconfigura el panorama de la IA. Para OpenAI, asegura el acceso a la masiva capacidad de cómputo necesaria para sostener el crecimiento exponencial de sus servicios, como ChatGPT, que ya atiende a cientos de millones de usuarios.</p>
            
            <p>Para Nvidia, la alianza garantiza un flujo de ingresos colosal y a largo plazo, consolidando su posición como el proveedor de hardware indispensable de la revolución de la IA.</p>
            
            <p>Esta asociación trasciende una simple relación cliente-proveedor. Señala la creación de un ecosistema de desarrollo de IA profundamente integrado verticalmente, que abarca desde el silicio fundamental hasta los modelos de lenguaje más avanzados del mundo.</p>
            
            <h3>Riesgos de Concentración</h3>
            <p>El riesgo latente es la consolidación de un duopolio o monopolio de facto en el sector de la IA fundacional, donde el futuro de la tecnología podría ser dictado en gran medida por las decisiones estratégicas de esta única y poderosa alianza.</p>
          `,
          category: "tecnologia",
          date: "2025-09-27",
          readTime: "4 min"
        },
        {
          id: "tecnologia-2",
          title: "OpenAI Presenta ChatGPT Pulse: La IA Que Trabaja Mientras Duermes",
          summary: "La nueva funcionalidad transforma a ChatGPT de una herramienta reactiva a un asistente proactivo que genera resúmenes personalizados cada mañana.",
          content: `
            <h3>Evolución del Asistente Digital</h3>
            <p>OpenAI presentó una versión preliminar de "ChatGPT Pulse", una nueva funcionalidad que transforma a la IA de una herramienta reactiva a un asistente proactivo. El sistema está diseñado para trabajar durante la noche, analizando las conversaciones recientes del usuario, sus intereses declarados y la información de aplicaciones conectadas.</p>
            
            <p>Cada mañana, el sistema genera y entrega un resumen diario personalizado en un formato de "tarjetas visuales" dinámicas, basado en Gmail, Google Calendar y otras aplicaciones integradas.</p>
            
            <h3>Cambio de Paradigma</h3>
            <p>Este desarrollo representa un cambio fundamental en el paradigma de interacción entre humanos e IA. En lugar de esperar una instrucción (un <em>prompt</em>), la inteligencia artificial se anticipa a las necesidades del usuario.</p>
            
            <p>OpenAI ha puesto un énfasis particular en la privacidad: la integración con aplicaciones externas es opcional y está desactivada por defecto, pudiendo ser revocada en cualquier momento. Inicialmente, la función se está desplegando de forma limitada para los suscriptores del plan Pro de más alto nivel.</p>
            
            <h3>Estrategia de Plataforma</h3>
            <p>La introducción de Pulse evidencia un giro estratégico por parte de OpenAI. El objetivo ya no es simplemente proporcionar la mejor respuesta a una pregunta, sino convertirse en una parte indispensable del flujo de trabajo diario y de los hábitos de consumo de información del usuario.</p>
            
            <p>Este movimiento posiciona a ChatGPT en competencia directa no solo con otros asistentes de IA, sino también con las redes sociales y los centros de productividad por el recurso más escaso: la atención del usuario.</p>
            
            <p>Con Pulse, es la IA la que inicia el contacto diario al presentar su resumen matutino. Estratégicamente, esto aumenta el compromiso diario, la dependencia del usuario y la "adherencia" del producto, marcando la transición de OpenAI de ser una herramienta a demanda a convertirse en una plataforma de consulta diaria.</p>
            
            <h3>El Ecosistema Global en Movimiento</h3>
            <p>El resto del ecosistema de IA global continúa en efervescencia. Spotify está trabajando en políticas para gestionar la avalancha de canciones generadas por IA, mientras que empresas chinas como Alibaba logran avances significativos con sus modelos de código abierto.</p>
            
            <p>Huawei ha declarado su ambición de superar tecnológicamente a los chips de Nvidia en un plazo de tres años. Paralelamente, crece el debate entre la comunidad científica sobre la urgente necesidad de establecer marcos regulatorios para mitigar los riesgos existenciales que esta tecnología podría plantear.</p>
          `,
          category: "tecnologia",
          date: "2025-09-27",
          readTime: "3 min"
        }
      ]
    }
  }
};

// Función para obtener todas las noticias
function getAllNews() {
  const allNews = [];
  Object.keys(newsData.categories).forEach(categoryKey => {
    const category = newsData.categories[categoryKey];
    category.articles.forEach(article => {
      allNews.push({
        ...article,
        categoryInfo: {
          name: category.name,
          icon: category.icon,
          color: category.color
        }
      });
    });
  });
  return allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Función para obtener noticias por categoría
function getNewsByCategory(category) {
  if (category === 'all') {
    return getAllNews();
  }
  
  const categoryData = newsData.categories[category];
  if (!categoryData) return [];
  
  return categoryData.articles.map(article => ({
    ...article,
    categoryInfo: {
      name: categoryData.name,
      icon: categoryData.icon,
      color: categoryData.color
    }
  }));
}

// Función para obtener una noticia específica por ID
function getNewsById(id) {
  const allNews = getAllNews();
  return allNews.find(news => news.id === id);
}

// Función para obtener estadísticas
function getNewsStats() {
  const stats = {};
  Object.keys(newsData.categories).forEach(categoryKey => {
    const category = newsData.categories[categoryKey];
    stats[categoryKey] = {
      name: category.name,
      count: category.articles.length,
      color: category.color
    };
  });
  return stats;
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.newsData = {
    getAllNews,
    getNewsByCategory,
    getNewsById,
    getNewsStats,
    lastUpdated: newsData.lastUpdated
  };
}