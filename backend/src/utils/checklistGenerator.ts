export interface IChecklistItem {
  id: string;
  category: 'legal_dominio' | 'preliminar' | 'proyecto_tecnico' | 'colegio_capba' | 'municipal' | 'obra';
  title: string;
  description: string;
  status: 'pendiente' | 'en_progreso' | 'completado' | 'observado' | 'no_aplica';
  priority: 'alta' | 'media' | 'baja';
  dueDate?: Date;
  completedAt?: Date;
}

export const generateMunicipalChecklist = (
  serviceType: string,
  municipality: string,
  isGatedCommunity: boolean = false
): IChecklistItem[] => {
  const items: IChecklistItem[] = [];

  // 1. Tareas de Dominio y Datos Previos
  items.push({
    id: 'chk-dom-1',
    category: 'legal_dominio',
    title: 'Copia de Escritura / Boleto de Compraventa',
    description: 'Verificar titularidad exacta, inhibiciones y datos de catastro.',
    status: 'pendiente',
    priority: 'alta',
  });

  items.push({
    id: 'chk-dom-2',
    category: 'legal_dominio',
    title: 'Plano de Mensura y Subdivisión Catastral',
    description: 'Confirmar cotas de frente, fondo, ochavas y restricciones hidráulicas o de servidumbre.',
    status: 'pendiente',
    priority: 'alta',
  });

  // Si es en barrio privado o country de Zona Norte (San Sebastián, Lagoon, Nordelta, etc.)
  if (isGatedCommunity) {
    items.push({
      id: 'chk-barrio-1',
      category: 'preliminar',
      title: 'Reglamento de Construcción del Barrio Cerrado',
      description: 'Chequear retiros exigidos (frente, laterales y fondo), alturas máximas, diseño de techos y pendientes.',
      status: 'pendiente',
      priority: 'alta',
    });

    items.push({
      id: 'chk-barrio-2',
      category: 'preliminar',
      title: 'Visado Previo de la Comisión de Arquitectura del Barrio',
      description: 'Aprobación del anteproyecto por la intendencia técnica del country previa a la presentación municipal.',
      status: 'pendiente',
      priority: 'alta',
    });
  }

  // 2. Estudios preliminares
  if (serviceType === 'obra_nueva' || serviceType === 'regularizacion') {
    items.push({
      id: 'chk-pre-1',
      category: 'preliminar',
      title: 'Estudio de Suelos (Geotécnico)',
      description: 'Informe de resistencia de estrato portante y nivel freático para dimensionar fundaciones.',
      status: 'pendiente',
      priority: 'alta',
    });

    items.push({
      id: 'chk-pre-2',
      category: 'preliminar',
      title: 'Relevamiento Topográfico y Altimetría',
      description: 'Curvas de nivel y cota de cordón/calle para cálculo de escorrentías y rellenos.',
      status: 'pendiente',
      priority: 'media',
    });
  }

  // 3. Proyecto Técnico Arquitectónico
  items.push({
    id: 'chk-tec-1',
    category: 'proyecto_tecnico',
    title: 'Cálculo de Parámetros Urbanísticos (FOS / FOT / Retiros)',
    description: `Verificar cumplimiento estricto del Código Urbano de ${municipality}.`,
    status: 'pendiente',
    priority: 'alta',
  });

  items.push({
    id: 'chk-tec-2',
    category: 'proyecto_tecnico',
    title: 'Cálculo Térmico y Acondicionamiento (Ley 13059 PBA)',
    description: 'Verificación de transmitancia térmica (K) de muros y carpinterías DVH exigida en Prov. de Buenos Aires.',
    status: 'pendiente',
    priority: 'media',
  });

  items.push({
    id: 'chk-tec-3',
    category: 'proyecto_tecnico',
    title: 'Cálculo y Memoria Estructural (Hormigón Armado / Metálica)',
    description: 'Planos de vigas, columnas, losas y bases rubricados por profesional responsable.',
    status: 'pendiente',
    priority: 'alta',
  });

  // 4. CAPBA (Colegio de Arquitectos de la Prov. de Buenos Aires - Distrito IV)
  items.push({
    id: 'chk-capba-1',
    category: 'colegio_capba',
    title: 'Liquidación de Contrato Profesional en CAPBA D4',
    description: 'Carga en el sistema colegial de superficies, tipo de tarea (Proyecto y Dirección) y determinación de honorarios mínimos.',
    status: 'pendiente',
    priority: 'alta',
  });

  items.push({
    id: 'chk-capba-2',
    category: 'colegio_capba',
    title: 'Aportes Previsionales CAAITBA y Tasa Colegial',
    description: 'Comprobante de depósito de aportes jubilatorios de ley para obtener el visado digital.',
    status: 'pendiente',
    priority: 'alta',
  });

  // 5. Municipalidad específica de Zona Norte
  items.push({
    id: 'chk-mun-1',
    category: 'municipal',
    title: `Carátula y Plano Municipal Reglamentario (${municipality})`,
    description: 'Plano en escala 1:100 con silueta de superficies, plantas, cortes, vistas y balance de iluminación/ventilación.',
    status: 'pendiente',
    priority: 'alta',
  });

  items.push({
    id: 'chk-mun-2',
    category: 'municipal',
    title: 'Ingreso de Expediente Digital / Mesa de Entradas',
    description: `Generación del número de expediente formal en la Secretaría de Obras Particulares de ${municipality}.`,
    status: 'pendiente',
    priority: 'alta',
  });

  items.push({
    id: 'chk-mun-3',
    category: 'municipal',
    title: 'Liquidación y Pago de Derechos de Construcción',
    description: 'Abonar tasas municipales de edificación calculadas según los m² a construir.',
    status: 'pendiente',
    priority: 'alta',
  });

  items.push({
    id: 'chk-mun-4',
    category: 'municipal',
    title: 'Permiso Provisorio / Definitivo de Inicio de Obra',
    description: 'Emisión del permiso municipal con cartel de obra reglamentario autorizado.',
    status: 'pendiente',
    priority: 'alta',
  });

  // Específico para interiores, mobiliario, oficinas o gastronomía
  if (serviceType === 'interior_mobiliario') {
    items.push({
      id: 'chk-int-1',
      category: 'proyecto_tecnico',
      title: 'Despiece y Planos de Detalle de Carpintería (Escala 1:20 / 1:10)',
      description: 'Especificación de herrajes, placas (eggar/faplac), cantos de PVC y fijaciones ocultas.',
      status: 'pendiente',
      priority: 'alta',
    });
    items.push({
      id: 'chk-int-2',
      category: 'proyecto_tecnico',
      title: 'Plano de Instalación Eléctrica e Iluminación Lineal Embutida',
      description: 'Ubicación de transformadores, drivers, perfiles LED y encendidos.',
      status: 'pendiente',
      priority: 'alta',
    });
  }

  if (serviceType === 'oficinas') {
    items.push({
      id: 'chk-ofi-1',
      category: 'proyecto_tecnico',
      title: 'Plano de Puestos de Trabajo y Cableado Estructurado (Voz y Datos)',
      description: 'Distribución ergonómica, bandejas pasacables y puestos operativos.',
      status: 'pendiente',
      priority: 'alta',
    });
    items.push({
      id: 'chk-ofi-2',
      category: 'proyecto_tecnico',
      title: 'Proyecto de Acondicionamiento Acústico y Climatización VRF/MultiSplit',
      description: 'Aislamiento de salas de reuniones y balance térmico de oficinas.',
      status: 'pendiente',
      priority: 'media',
    });
  }

  if (serviceType === 'gastronomia') {
    items.push({
      id: 'chk-gas-1',
      category: 'municipal',
      title: 'Factibilidad Comercial de Habilitación Gastronómica',
      description: 'Verificación de zonificación para rubro bar/restaurante/café y capacidad máxima de personas.',
      status: 'pendiente',
      priority: 'alta',
    });
    items.push({
      id: 'chk-gas-2',
      category: 'proyecto_tecnico',
      title: 'Plano de Evacuación, Salidas de Emergencia y Bomberos',
      description: 'Cálculo de factor de ocupación, anchos de paso, matafuegos y señalética reglamentaria.',
      status: 'pendiente',
      priority: 'alta',
    });
    items.push({
      id: 'chk-gas-3',
      category: 'proyecto_tecnico',
      title: 'Diseño Sanitario y Extracción Forzada de Cocina / Campanas',
      description: 'Conductos a los 4 vientos, trampas de grasa y revestimientos higiénicos lavables.',
      status: 'pendiente',
      priority: 'alta',
    });
  }

  return items;
};
