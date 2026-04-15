---
name: drawio
description: Generate professional draw.io diagrams (ERD/database tables, class diagrams, sequence diagrams, flowcharts, architecture diagrams) and export them as PNG. Use when the user requests any kind of diagram, database model, class structure, flow, or system visualization.
metadata:
  openclaw:
    requires:
      bins: ["drawio"]
---

# Draw.io Diagram Generation Skill

## When to use this skill
- User requests a database diagram, ERD, or entity-relationship diagram
- User requests a class diagram or UML class structure
- User requests a sequence diagram or interaction diagram
- User requests a flowchart or process flow
- User requests an architecture diagram or system overview
- User mentions "draw.io", "diagram", "table", "entity", "class", "sequence", "flow"

---

## ⚠️ MANDATORY RULES — READ BEFORE GENERATING ANYTHING

1. **ALWAYS detect the diagram type first** before writing any XML
2. **NEVER mix styles** between diagram types — each type has its own strict XML structure
3. **ALWAYS assign unique sequential IDs** to every `mxCell` starting from 0
4. **NEVER use `\n` inside a `value` attribute** — use separate rows/cells instead
5. **ALWAYS calculate table/class heights correctly** using the formulas provided
6. **ALWAYS validate the XML structure** before saving
7. **ALWAYS export to PNG and include the PNG in the response before asking about other formats** — this step is non-negotiable
8. **NEVER use generic rounded rectangles** for database tables or class entities
9. **ALWAYS apply consistent spacing between diagram elements**
   - Horizontal spacing between elements: **minimum 120px**
   - Vertical spacing between rows or steps: **minimum 100px**
   - Tables/classes must not overlap
   - Relationship lines must not cross through table headers

---

## STEP 0 — Diagram Type Detection

Before generating any XML, identify the diagram type from the user's request:

| User says... | Diagram type |
|---|---|
| "database", "ERD", "tables", "entities", "foreign key" | → **TYPE 1: ERD** |
| "class", "UML", "inheritance", "attributes", "methods" | → **TYPE 2: Class Diagram** |
| "sequence", "interaction", "lifeline", "actor calls" | → **TYPE 3: Sequence Diagram** |
| "flowchart", "flow", "process", "decision", "steps" | → **TYPE 4: Flowchart** |
| "architecture", "system", "services", "components" | → **TYPE 5: Architecture** |

---

## Generation Workflow — ALWAYS follow this exact order

### Step 1 — Identify diagram type
Determine TYPE 1–5 from the user's message before writing any XML.

### Step 2 — Plan all elements
List every entity/class/participant and all relationships before coding.

### Step 3 — Write and save the XML

**Mandatory pre-save checklist:**
- [ ] All `mxCell` elements have unique sequential numeric IDs
- [ ] ERD tables use `shape=table` with `shape=tableRow` rows (never generic shapes)
- [ ] Class diagrams use `swimlane` with attribute block, divider line, and method block
- [ ] Sequence diagrams have lifelines, activation boxes, and correct arrow styles
- [ ] ERD relationship arrows connect to **row cell IDs**, not table container IDs
- [ ] Heights calculated correctly: `30 + (columns x 30)` for ERD tables
- [ ] No literal `\n` in value attributes (use `&#xa;` for multiline text cells only)
- [ ] XML is well-formed and all tags are closed

---

## TYPE 1: ERD / Database Diagram

### Qué pedirle al usuario
- Lista de tablas con columnas y tipos
- PK/FK y cardinalidades (1:1, 1:N, N:M)
- Reglas de negocio relevantes (unicidad, nullable)
- Tablas lookup o junction si existen

### Checklist ERD
- IDs `mxCell` secuenciales sin saltos
- Alturas: `30 + (columnas x 30)`
- FK conectadas a la fila, no al contenedor
- Sin `\n` en `value`
- Spacing mínimo: 120px horizontal, 100px vertical

### Template mínimo ERD
```xml
<mxGraphModel page="1" pageWidth="1169" pageHeight="827">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="10" value="Tabla"
      style="shape=table;startSize=30;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;fontSize=14;align=center;fillColor=#dae8fc;strokeColor=#6c8ebf;"
      vertex="1" parent="1">
      <mxGeometry x="80" y="80" width="220" height="90" as="geometry"/>
    </mxCell>
    <mxCell id="11" value="" style="shape=tableRow;horizontal=0;bottom=1;" vertex="1" parent="10">
      <mxGeometry y="30" width="220" height="30" as="geometry"/>
    </mxCell>
    <mxCell id="12" value="PK" style="shape=partialRectangle;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="11">
      <mxGeometry width="40" height="30" as="geometry"/>
    </mxCell>
    <mxCell id="13" value="id INT" style="shape=partialRectangle;fillColor=none;" vertex="1" parent="11">
      <mxGeometry x="40" width="180" height="30" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>
```

### Reglas de layout
- Usar grilla de 4 tablas cuando aplique
- Separación mínima 120px/100px
- No cruzar relaciones por headers

### Errores comunes
- Relación conectada al contenedor en vez de la fila
- Altura incorrecta del contenedor
- Reutilizar IDs
- Usar rectángulos genéricos

### Cuándo preguntar
- Cardinalidades no especificadas
- FK no identificadas
- Columnas sin tipos

### Visual reference
Tables must look like real database tables:
- A **header row** with the table name (colored background)
- **Individual rows** for each column, with PK/FK badges on the left
- **Relationship lines** with crow's foot notation connecting FK rows to PK rows

### Table height formula
```
table_height = 30 (header) + (number_of_columns x 30)
Example: 5 columns -> height = 30 + (5 x 30) = 180
```

### Color palette by table type
| Table role | fillColor | strokeColor |
|---|---|---|
| Primary / main entity | `#dae8fc` | `#6c8ebf` |
| Secondary entity | `#e1d5e7` | `#9673a6` |
| Junction / pivot table | `#d5e8d4` | `#82b366` |
| Lookup / catalog table | `#fff2cc` | `#d6b656` |

### Column badge colors
| Badge | fillColor | strokeColor |
|---|---|---|
| PK | `#fff2cc` | `#d6b656` |
| FK | `#f8cecc` | `#b85450` |
| UK (unique) | `#d5e8d4` | `#82b366` |
| (none) | `none` | `none` |

### Full XML template

```xml
<mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>

    <!-- TABLE: Cliente | height = 30 + (5 x 30) = 180 -->
    <mxCell id="10" value="Cliente"
      style="shape=table;startSize=30;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;fontSize=14;align=center;fillColor=#dae8fc;strokeColor=#6c8ebf;fontColor=#000000;swimlaneLine=1;"
      vertex="1" parent="1">
      <mxGeometry x="80" y="80" width="220" height="180" as="geometry"/>
    </mxCell>

    <!-- Row: ID (PK) - bottom=1 adds separator line after PK -->
    <mxCell id="11" value=""
      style="shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;swimlaneBody=0;fillColor=#dae8fc;collapsible=0;dropTarget=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fontSize=12;top=0;left=0;right=0;bottom=1;"
      vertex="1" parent="10">
      <mxGeometry y="30" width="220" height="30" as="geometry"/>
    </mxCell>
    <mxCell id="12" value="PK"
      style="shape=partialRectangle;connectable=0;fillColor=#fff2cc;strokeColor=#d6b656;top=0;left=0;bottom=0;right=0;fontStyle=1;fontSize=11;overflow=hidden;align=center;"
      vertex="1" parent="11">
      <mxGeometry width="40" height="30" as="geometry"><mxRectangle width="40" height="30" as="alternateBounds"/></mxGeometry>
    </mxCell>
    <mxCell id="13" value="ID INT"
      style="shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;overflow=hidden;fontSize=12;"
      vertex="1" parent="11">
      <mxGeometry x="40" width="180" height="30" as="geometry"><mxRectangle width="180" height="30" as="alternateBounds"/></mxGeometry>
    </mxCell>

    <!-- Row: Nombre -->
    <mxCell id="14" value=""
      style="shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;swimlaneBody=0;fillColor=none;collapsible=0;dropTarget=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fontSize=12;top=0;left=0;right=0;bottom=0;"
      vertex="1" parent="10">
      <mxGeometry y="60" width="220" height="30" as="geometry"/>
    </mxCell>
    <mxCell id="15" value=""
      style="shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;overflow=hidden;"
      vertex="1" parent="14">
      <mxGeometry width="40" height="30" as="geometry"><mxRectangle width="40" height="30" as="alternateBounds"/></mxGeometry>
    </mxCell>
    <mxCell id="16" value="Nombre VARCHAR(100)"
      style="shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;overflow=hidden;fontSize=12;"
      vertex="1" parent="14">
      <mxGeometry x="40" width="180" height="30" as="geometry"><mxRectangle width="180" height="30" as="alternateBounds"/></mxGeometry>
    </mxCell>

    <!-- Row: Apellidos -->
    <mxCell id="17" value=""
      style="shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;swimlaneBody=0;fillColor=none;collapsible=0;dropTarget=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fontSize=12;top=0;left=0;right=0;bottom=0;"
      vertex="1" parent="10">
      <mxGeometry y="90" width="220" height="30" as="geometry"/>
    </mxCell>
    <mxCell id="18" value=""
      style="shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;overflow=hidden;"
      vertex="1" parent="17">
      <mxGeometry width="40" height="30" as="geometry"><mxRectangle width="40" height="30" as="alternateBounds"/></mxGeometry>
    </mxCell>
    <mxCell id="19" value="Apellidos VARCHAR(100)"
      style="shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;overflow=hidden;fontSize=12;"
      vertex="1" parent="17">
      <mxGeometry x="40" width="180" height="30" as="geometry"><mxRectangle width="180" height="30" as="alternateBounds"/></mxGeometry>
    </mxCell>

    <!-- Row: Movil -->
    <mxCell id="20" value=""
      style="shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;swimlaneBody=0;fillColor=none;collapsible=0;dropTarget=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fontSize=12;top=0;left=0;right=0;bottom=0;"
      vertex="1" parent="10">
      <mxGeometry y="120" width="220" height="30" as="geometry"/>
    </mxCell>
    <mxCell id="21" value=""
      style="shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;overflow=hidden;"
      vertex="1" parent="20">
      <mxGeometry width="40" height="30" as="geometry"><mxRectangle width="40" height="30" as="alternateBounds"/></mxGeometry>
    </mxCell>
    <mxCell id="22" value="Movil VARCHAR(20)"
      style="shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;overflow=hidden;fontSize=12;"
      vertex="1" parent="20">
      <mxGeometry x="40" width="180" height="30" as="geometry"><mxRectangle width="180" height="30" as="alternateBounds"/></mxGeometry>
    </mxCell>

    <!-- Row: EMail -->
    <mxCell id="23" value=""
      style="shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;swimlaneBody=0;fillColor=none;collapsible=0;dropTarget=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fontSize=12;top=0;left=0;right=0;bottom=0;"
      vertex="1" parent="10">
      <mxGeometry y="150" width="220" height="30" as="geometry"/>
    </mxCell>
    <mxCell id="24" value=""
      style="shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;overflow=hidden;"
      vertex="1" parent="23">
      <mxGeometry width="40" height="30" as="geometry"><mxRectangle width="40" height="30" as="alternateBounds"/></mxGeometry>
    </mxCell>
    <mxCell id="25" value="EMail VARCHAR(150)"
      style="shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;overflow=hidden;fontSize=12;"
      vertex="1" parent="23">
      <mxGeometry x="40" width="180" height="30" as="geometry"><mxRectangle width="180" height="30" as="alternateBounds"/></mxGeometry>
    </mxCell>

    <!-- TABLE: Pedido | height = 30 + (3 x 30) = 120 -->
    <mxCell id="30" value="Pedido"
      style="shape=table;startSize=30;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;fontSize=14;align=center;fillColor=#e1d5e7;strokeColor=#9673a6;fontColor=#000000;swimlaneLine=1;"
      vertex="1" parent="1">
      <mxGeometry x="80" y="380" width="220" height="120" as="geometry"/>
    </mxCell>

    <!-- Row: ID (PK) -->
    <mxCell id="31" value=""
      style="shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;swimlaneBody=0;fillColor=#e1d5e7;collapsible=0;dropTarget=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fontSize=12;top=0;left=0;right=0;bottom=1;"
      vertex="1" parent="30">
      <mxGeometry y="30" width="220" height="30" as="geometry"/>
    </mxCell>
    <mxCell id="32" value="PK"
      style="shape=partialRectangle;connectable=0;fillColor=#fff2cc;strokeColor=#d6b656;top=0;left=0;bottom=0;right=0;fontStyle=1;fontSize=11;overflow=hidden;align=center;"
      vertex="1" parent="31">
      <mxGeometry width="40" height="30" as="geometry"><mxRectangle width="40" height="30" as="alternateBounds"/></mxGeometry>
    </mxCell>
    <mxCell id="33" value="ID INT"
      style="shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;overflow=hidden;fontSize=12;"
      vertex="1" parent="31">
      <mxGeometry x="40" width="180" height="30" as="geometry"><mxRectangle width="180" height="30" as="alternateBounds"/></mxGeometry>
    </mxCell>

    <!-- Row: Fecha -->
    <mxCell id="34" value=""
      style="shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;swimlaneBody=0;fillColor=none;collapsible=0;dropTarget=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fontSize=12;top=0;left=0;right=0;bottom=0;"
      vertex="1" parent="30">
      <mxGeometry y="60" width="220" height="30" as="geometry"/>
    </mxCell>
    <mxCell id="35" value=""
      style="shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;overflow=hidden;"
      vertex="1" parent="34">
      <mxGeometry width="40" height="30" as="geometry"><mxRectangle width="40" height="30" as="alternateBounds"/></mxGeometry>
    </mxCell>
    <mxCell id="36" value="Fecha DATE"
      style="shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;overflow=hidden;fontSize=12;"
      vertex="1" parent="34">
      <mxGeometry x="40" width="180" height="30" as="geometry"><mxRectangle width="180" height="30" as="alternateBounds"/></mxGeometry>
    </mxCell>

    <!-- Row: ClienteID (FK) -->
    <mxCell id="37" value=""
      style="shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;swimlaneBody=0;fillColor=none;collapsible=0;dropTarget=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fontSize=12;top=0;left=0;right=0;bottom=0;"
      vertex="1" parent="30">
      <mxGeometry y="90" width="220" height="30" as="geometry"/>
    </mxCell>
    <mxCell id="38" value="FK"
      style="shape=partialRectangle;connectable=0;fillColor=#f8cecc;strokeColor=#b85450;top=0;left=0;bottom=0;right=0;fontStyle=1;fontSize=11;overflow=hidden;align=center;"
      vertex="1" parent="37">
      <mxGeometry width="40" height="30" as="geometry"><mxRectangle width="40" height="30" as="alternateBounds"/></mxGeometry>
    </mxCell>
    <mxCell id="39" value="ClienteID INT"
      style="shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;overflow=hidden;fontSize=12;"
      vertex="1" parent="37">
      <mxGeometry x="40" width="180" height="30" as="geometry"><mxRectangle width="180" height="30" as="alternateBounds"/></mxGeometry>
    </mxCell>

    <!-- RELATIONSHIP: Cliente 1 to N Pedido -->
    <!-- source=FK row of Pedido, target=PK row of Cliente -->
    <mxCell id="90" value=""
      style="edgeStyle=entityRelationEdgeStyle;endArrow=ERmandOne;startArrow=ERzeroToMany;exitX=0;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;fontSize=11;"
      edge="1" parent="1" source="37" target="11">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>

  </root>
</mxGraphModel>
```

### ERD Relationship styles (crow's foot notation)
```xml
<!-- One-to-Many (1:N) -->
style="edgeStyle=entityRelationEdgeStyle;endArrow=ERmandOne;startArrow=ERzeroToMany;"

<!-- One-to-Many mandatory -->
style="edgeStyle=entityRelationEdgeStyle;endArrow=ERmandOne;startArrow=ERmandMany;"

<!-- Zero-or-One to Many -->
style="edgeStyle=entityRelationEdgeStyle;endArrow=ERzeroToOne;startArrow=ERzeroToMany;"

<!-- Many-to-Many (N:M) -->
style="edgeStyle=entityRelationEdgeStyle;endArrow=ERzeroToMany;startArrow=ERzeroToMany;"
```

### ERD Layout positions (4-table grid)
```
Table A (primary):   x=80,  y=80
Table B (primary):   x=420, y=80
Table C (secondary): x=80,  y=380
Table D (junction):  x=420, y=380
```
For 5+ tables: set `pageWidth="1654" pageHeight="1169"` in mxGraphModel.

---

## TYPE 2: UML Class Diagram

### Qué pedirle al usuario
- Lista de clases con atributos y métodos
- Visibilidad (+/-/#/~) y tipos
- Herencia, implementación, asociaciones y multiplicidades

### Checklist Class
- IDs secuenciales sin saltos
- Tres compartimentos visibles
- Separador entre atributos y métodos
- Sin `\n` en `value` (usar `&#xa;`)
- Spacing mínimo 120px/100px

### Template mínimo Class
```xml
<mxGraphModel page="1" pageWidth="1169" pageHeight="827">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="10" value="ClassName"
      style="swimlane;fontStyle=1;align=center;startSize=30;fontSize=14;fillColor=#dae8fc;strokeColor=#6c8ebf;"
      vertex="1" parent="1">
      <mxGeometry x="80" y="80" width="220" height="120" as="geometry"/>
    </mxCell>
    <mxCell id="11" value="+attr: Type"
      style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;"
      vertex="1" parent="10">
      <mxGeometry y="30" width="220" height="50" as="geometry"/>
    </mxCell>
    <mxCell id="12" value="" style="line;strokeWidth=1;strokeColor=#6c8ebf;" vertex="1" parent="10">
      <mxGeometry y="80" width="220" height="10" as="geometry"/>
    </mxCell>
    <mxCell id="13" value="+method(): Type"
      style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;"
      vertex="1" parent="10">
      <mxGeometry y="90" width="220" height="30" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>
```

### Reglas de layout
- Herencia de arriba hacia abajo
- Asociaciones laterales
- Mantener alineación por filas

### Errores comunes
- Sin separador entre atributos y métodos
- Multilínea con `\n` en `value`
- Conectar relaciones a celdas de texto

### Cuándo preguntar
- Multiplicidades no indicadas
- Tipos o visibilidades faltantes

### Visual reference
Classes must have three compartments:
1. **Class name** — top section, bold, colored background
2. **Attributes** — middle section, with visibility prefix (+/-/#) and type
3. **Methods** — bottom section, with visibility prefix and return type

### Visibility prefixes
| Symbol | Meaning |
|---|---|
| `+` | public |
| `-` | private |
| `#` | protected |
| `~` | package |

### Color palette by class role
| Role | fillColor | strokeColor |
|---|---|---|
| Regular class | `#dae8fc` | `#6c8ebf` |
| Abstract class | `#e1d5e7` | `#9673a6` |
| Interface | `#d5e8d4` | `#82b366` |
| Enum | `#fff2cc` | `#d6b656` |

### Full XML template

```xml
<mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>

    <!-- CLASS: Address -->
    <mxCell id="10" value="Address"
      style="swimlane;fontStyle=1;align=center;startSize=30;fontSize=14;fillColor=#dae8fc;strokeColor=#6c8ebf;"
      vertex="1" parent="1">
      <mxGeometry x="300" y="40" width="220" height="160" as="geometry"/>
    </mxCell>
    <!-- Attributes (use &#xa; for line breaks within text cells) -->
    <mxCell id="11" value="+String street&#xa;+String city&#xa;+String state&#xa;+int postalCode&#xa;+String country"
      style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;fontSize=12;"
      vertex="1" parent="10">
      <mxGeometry y="30" width="220" height="100" as="geometry"/>
    </mxCell>
    <!-- Divider line between attributes and methods -->
    <mxCell id="12" value=""
      style="line;strokeWidth=1;fillColor=none;align=left;strokeColor=#6c8ebf;"
      vertex="1" parent="10">
      <mxGeometry y="130" width="220" height="10" as="geometry"/>
    </mxCell>
    <!-- Methods -->
    <mxCell id="13" value="-validate()&#xa;+outputAsLabel()"
      style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;fontSize=12;"
      vertex="1" parent="10">
      <mxGeometry y="140" width="220" height="50" as="geometry"/>
    </mxCell>

    <!-- CLASS: Person -->
    <mxCell id="20" value="Person"
      style="swimlane;fontStyle=1;align=center;startSize=30;fontSize=14;fillColor=#dae8fc;strokeColor=#6c8ebf;"
      vertex="1" parent="1">
      <mxGeometry x="300" y="280" width="220" height="140" as="geometry"/>
    </mxCell>
    <mxCell id="21" value="+String name&#xa;+int phoneNumber&#xa;+String emailAddress"
      style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;fontSize=12;"
      vertex="1" parent="20">
      <mxGeometry y="30" width="220" height="70" as="geometry"/>
    </mxCell>
    <mxCell id="22" value=""
      style="line;strokeWidth=1;fillColor=none;strokeColor=#6c8ebf;"
      vertex="1" parent="20">
      <mxGeometry y="100" width="220" height="10" as="geometry"/>
    </mxCell>
    <mxCell id="23" value="+purchaseParkingPass()"
      style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;fontSize=12;"
      vertex="1" parent="20">
      <mxGeometry y="110" width="220" height="30" as="geometry"/>
    </mxCell>

    <!-- CLASS: Student (subclass of Person) -->
    <mxCell id="30" value="Student"
      style="swimlane;fontStyle=1;align=center;startSize=30;fontSize=14;fillColor=#e1d5e7;strokeColor=#9673a6;"
      vertex="1" parent="1">
      <mxGeometry x="100" y="520" width="220" height="140" as="geometry"/>
    </mxCell>
    <mxCell id="31" value="+int studentNumber&#xa;+int averageMark"
      style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;fontSize=12;"
      vertex="1" parent="30">
      <mxGeometry y="30" width="220" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="32" value=""
      style="line;strokeWidth=1;fillColor=none;strokeColor=#9673a6;"
      vertex="1" parent="30">
      <mxGeometry y="90" width="220" height="10" as="geometry"/>
    </mxCell>
    <mxCell id="33" value="+isEligibleToEnroll()&#xa;+getSeminarsTaken()"
      style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;fontSize=12;"
      vertex="1" parent="30">
      <mxGeometry y="100" width="220" height="50" as="geometry"/>
    </mxCell>

    <!-- CLASS: Professor (subclass of Person) -->
    <mxCell id="40" value="Professor"
      style="swimlane;fontStyle=1;align=center;startSize=30;fontSize=14;fillColor=#e1d5e7;strokeColor=#9673a6;"
      vertex="1" parent="1">
      <mxGeometry x="500" y="520" width="220" height="100" as="geometry"/>
    </mxCell>
    <mxCell id="41" value="+int salary"
      style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;fontSize=12;"
      vertex="1" parent="40">
      <mxGeometry y="30" width="220" height="30" as="geometry"/>
    </mxCell>
    <mxCell id="42" value=""
      style="line;strokeWidth=1;fillColor=none;strokeColor=#9673a6;"
      vertex="1" parent="40">
      <mxGeometry y="60" width="220" height="10" as="geometry"/>
    </mxCell>

    <!-- RELATIONSHIP: Address -> Person (association "lives at" 0..1) -->
    <mxCell id="80" value="lives at"
      style="edgeStyle=orthogonalEdgeStyle;endArrow=open;endFill=0;startArrow=none;fontSize=11;"
      edge="1" parent="1" source="10" target="20">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
    <mxCell id="81" value="0..1" style="resizable=0;align=left;verticalAlign=bottom;labelBackgroundColor=none;fontSize=11;" connectable="0" vertex="1" parent="80">
      <mxGeometry x="-0.7" relative="1" as="geometry"><mxPoint as="offset"/></mxGeometry>
    </mxCell>

    <!-- RELATIONSHIP: Student extends Person (inheritance - hollow triangle) -->
    <mxCell id="82" value=""
      style="edgeStyle=orthogonalEdgeStyle;endArrow=block;endFill=0;startArrow=none;fontSize=11;"
      edge="1" parent="1" source="30" target="20">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>

    <!-- RELATIONSHIP: Professor extends Person (inheritance - hollow triangle) -->
    <mxCell id="83" value=""
      style="edgeStyle=orthogonalEdgeStyle;endArrow=block;endFill=0;startArrow=none;fontSize=11;"
      edge="1" parent="1" source="40" target="20">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>

  </root>
</mxGraphModel>
```

### Class Diagram relationship styles
```xml
<!-- Inheritance / Generalization (hollow triangle) -->
style="endArrow=block;endFill=0;startArrow=none;edgeStyle=orthogonalEdgeStyle;"

<!-- Interface implementation (dashed + hollow triangle) -->
style="endArrow=block;endFill=0;startArrow=none;dashed=1;edgeStyle=orthogonalEdgeStyle;"

<!-- Association (open arrow) -->
style="endArrow=open;endFill=0;startArrow=none;edgeStyle=orthogonalEdgeStyle;"

<!-- Aggregation (hollow diamond) -->
style="endArrow=open;startArrow=diamondThin;startFill=0;edgeStyle=orthogonalEdgeStyle;"

<!-- Composition (filled diamond) -->
style="endArrow=open;startArrow=diamondThin;startFill=1;edgeStyle=orthogonalEdgeStyle;"

<!-- Dependency (dashed open arrow) -->
style="endArrow=open;endFill=0;dashed=1;edgeStyle=orthogonalEdgeStyle;"
```

---

## TYPE 3: Sequence Diagram

### Qué pedirle al usuario
- Participantes y orden de aparición
- Mensajes con numeración y tipo (sync/async/return)
- Condiciones (alt/opt/loop) si existen

### Checklist Sequence
- IDs secuenciales sin saltos
- Lifelines con estilo dashed
- Activations alineadas a mensajes
- Flechas con estilos correctos
- Spacing mínimo 120px/100px

### Template mínimo Sequence
```xml
<mxGraphModel page="1" pageWidth="1169" pageHeight="827">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="10" value=":User" style="shape=mxgraph.flowchart.start_2;" vertex="1" parent="1">
      <mxGeometry x="80" y="40" width="50" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="11" value=":Service" style="rounded=0;" vertex="1" parent="1">
      <mxGeometry x="220" y="50" width="140" height="40" as="geometry"/>
    </mxCell>
    <mxCell id="20" value="" style="dashed=1;endArrow=none;" edge="1" parent="1" source="10">
      <mxGeometry relative="1" as="geometry">
        <Array as="points"><mxPoint x="105" y="100"/><mxPoint x="105" y="500"/></Array>
      </mxGeometry>
    </mxCell>
    <mxCell id="21" value="" style="dashed=1;endArrow=none;" edge="1" parent="1" source="11">
      <mxGeometry relative="1" as="geometry">
        <Array as="points"><mxPoint x="290" y="90"/><mxPoint x="290" y="500"/></Array>
      </mxGeometry>
    </mxCell>
    <mxCell id="30" value="1: request()" style="endArrow=block;endFill=1;" edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <Array as="points"><mxPoint x="105" y="160"/><mxPoint x="290" y="160"/></Array>
      </mxGeometry>
    </mxCell>
  </root>
</mxGraphModel>
```

### Reglas de layout
- Participantes de izquierda a derecha
- Mensajes de arriba hacia abajo
- Frames cubren el rango de mensajes

### Errores comunes
- Lifelines sin dashed
- Activations fuera de alineación
- Flechas de retorno no dashed

### Cuándo preguntar
- Tipo de mensaje no especificado
- Faltan participantes

### Visual reference
Sequence diagrams must include:
- **Actor** on the far left (stick figure or person shape)
- **Lifelines** as vertical dashed lines below each participant header
- **Activation boxes** (narrow tall rectangles) on lifelines when a participant is active
- **Message arrows** — solid filled for calls, dashed open for returns
- **Alt/Loop/Opt frames** as large containers for conditional sections
- Numbered messages following UML notation (1, 1.1, 1.2, 1.2.1, etc.)

### Participant header shapes
| Participant type | Shape style |
|---|---|
| Human actor | `shape=mxgraph.flowchart.start_2` with label below |
| Object / class instance | Plain rectangle `rounded=0` |
| Database | `shape=cylinder3` |
| Boundary / UI | `ellipse` or rectangle |
| External system | `rounded=1` with different color |

### Message arrow styles
```xml
<!-- Synchronous call (solid filled arrowhead) -->
style="endArrow=block;endFill=1;startArrow=none;edgeStyle=orthogonalEdgeStyle;"

<!-- Return / response (dashed open arrow) -->
style="endArrow=open;endFill=0;dashed=1;startArrow=none;edgeStyle=orthogonalEdgeStyle;"

<!-- Asynchronous message (open arrowhead) -->
style="endArrow=open;endFill=0;startArrow=none;edgeStyle=orthogonalEdgeStyle;"

<!-- Self-call (routes out right and back on the same x position) -->
<!-- Use explicit waypoints in the geometry Array -->
```

### Full XML template

```xml
<mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>

    <!-- PARTICIPANT HEADERS -->

    <!-- Actor: Customer -->
    <mxCell id="10" value=":Customer"
      style="shape=mxgraph.flowchart.start_2;fillColor=#f5f5f5;strokeColor=#666666;fontColor=#333333;fontSize=12;fontStyle=1;align=center;verticalLabelPosition=bottom;verticalAlign=top;"
      vertex="1" parent="1">
      <mxGeometry x="60" y="40" width="50" height="60" as="geometry"/>
    </mxCell>

    <!-- Object: SearchForm -->
    <mxCell id="11" value=":SearchForm"
      style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFE6CC;strokeColor=#d79b00;fontStyle=1;fontSize=13;align=center;"
      vertex="1" parent="1">
      <mxGeometry x="220" y="50" width="140" height="40" as="geometry"/>
    </mxCell>

    <!-- Object: SearchResults -->
    <mxCell id="12" value=":SearchResults"
      style="rounded=0;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontStyle=1;fontSize=13;align=center;"
      vertex="1" parent="1">
      <mxGeometry x="440" y="50" width="140" height="40" as="geometry"/>
    </mxCell>

    <!-- Object: ItemDatabase (circle/boundary) -->
    <mxCell id="13" value=":ItemDatabase"
      style="ellipse;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;fontStyle=1;fontSize=12;align=center;"
      vertex="1" parent="1">
      <mxGeometry x="650" y="35" width="130" height="60" as="geometry"/>
    </mxCell>

    <!-- Object: ResultList -->
    <mxCell id="14" value=":ResultList"
      style="rounded=0;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;fontStyle=1;fontSize=13;align=center;"
      vertex="1" parent="1">
      <mxGeometry x="850" y="50" width="120" height="40" as="geometry"/>
    </mxCell>

    <!-- LIFELINES (vertical dashed lines) -->
    <!-- Draw each as a tall thin rectangle with dashed style -->

    <mxCell id="20" value=""
      style="edgeStyle=none;dashed=1;endArrow=none;startArrow=none;strokeColor=#666666;exitX=0.5;exitY=1;exitDx=0;exitDy=0;"
      edge="1" parent="1" source="10">
      <mxGeometry relative="1" as="geometry">
        <Array as="points">
          <mxPoint x="85" y="100"/>
          <mxPoint x="85" y="640"/>
        </Array>
      </mxGeometry>
    </mxCell>

    <mxCell id="21" value=""
      style="edgeStyle=none;dashed=1;endArrow=none;startArrow=none;strokeColor=#d79b00;exitX=0.5;exitY=1;exitDx=0;exitDy=0;"
      edge="1" parent="1" source="11">
      <mxGeometry relative="1" as="geometry">
        <Array as="points">
          <mxPoint x="290" y="90"/>
          <mxPoint x="290" y="640"/>
        </Array>
      </mxGeometry>
    </mxCell>

    <mxCell id="22" value=""
      style="edgeStyle=none;dashed=1;endArrow=none;startArrow=none;strokeColor=#6c8ebf;exitX=0.5;exitY=1;exitDx=0;exitDy=0;"
      edge="1" parent="1" source="12">
      <mxGeometry relative="1" as="geometry">
        <Array as="points">
          <mxPoint x="510" y="90"/>
          <mxPoint x="510" y="640"/>
        </Array>
      </mxGeometry>
    </mxCell>

    <mxCell id="23" value=""
      style="edgeStyle=none;dashed=1;endArrow=none;startArrow=none;strokeColor=#9673a6;exitX=0.5;exitY=1;exitDx=0;exitDy=0;"
      edge="1" parent="1" source="13">
      <mxGeometry relative="1" as="geometry">
        <Array as="points">
          <mxPoint x="715" y="95"/>
          <mxPoint x="715" y="640"/>
        </Array>
      </mxGeometry>
    </mxCell>

    <mxCell id="24" value=""
      style="edgeStyle=none;dashed=1;endArrow=none;startArrow=none;strokeColor=#82b366;exitX=0.5;exitY=1;exitDx=0;exitDy=0;"
      edge="1" parent="1" source="14">
      <mxGeometry relative="1" as="geometry">
        <Array as="points">
          <mxPoint x="910" y="90"/>
          <mxPoint x="910" y="640"/>
        </Array>
      </mxGeometry>
    </mxCell>

    <!-- ACTIVATION BOXES (narrow rectangles on lifelines) -->

    <mxCell id="30" value="" style="fillColor=#f5f5f5;strokeColor=#666666;" vertex="1" parent="1">
      <mxGeometry x="78" y="135" width="14" height="400" as="geometry"/>
    </mxCell>

    <mxCell id="31" value="" style="fillColor=#FFE6CC;strokeColor=#d79b00;" vertex="1" parent="1">
      <mxGeometry x="283" y="155" width="14" height="360" as="geometry"/>
    </mxCell>

    <mxCell id="32" value="" style="fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="1">
      <mxGeometry x="708" y="235" width="14" height="90" as="geometry"/>
    </mxCell>

    <mxCell id="33" value="" style="fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
      <mxGeometry x="903" y="255" width="14" height="60" as="geometry"/>
    </mxCell>

    <!-- ALT FRAME -->
    <mxCell id="40" value="alt"
      style="swimlane;startSize=20;swimlaneLine=1;fillColor=none;strokeColor=#666666;align=left;spacingLeft=5;fontSize=12;fontStyle=1;"
      vertex="1" parent="1">
      <mxGeometry x="120" y="168" width="840" height="360" as="geometry"/>
    </mxCell>

    <!-- Alt condition text -->
    <mxCell id="41" value="[itemName=valid]"
      style="text;strokeColor=none;fillColor=none;align=left;fontSize=11;fontStyle=2;"
      vertex="1" parent="1">
      <mxGeometry x="125" y="172" width="160" height="20" as="geometry"/>
    </mxCell>

    <!-- Else divider line -->
    <mxCell id="42" value=""
      style="edgeStyle=none;dashed=1;endArrow=none;startArrow=none;strokeColor=#666666;"
      edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <Array as="points">
          <mxPoint x="120" y="400"/>
          <mxPoint x="960" y="400"/>
        </Array>
      </mxGeometry>
    </mxCell>
    <mxCell id="43" value="[else]"
      style="text;strokeColor=none;fillColor=none;align=left;fontSize=11;fontStyle=2;"
      vertex="1" parent="1">
      <mxGeometry x="125" y="402" width="80" height="20" as="geometry"/>
    </mxCell>

    <!-- MESSAGE ARROWS -->

    <!-- 1: itemSearch(itemName) Customer -> SearchForm -->
    <mxCell id="50" value="1: itemSearch(itemName)"
      style="edgeStyle=orthogonalEdgeStyle;endArrow=block;endFill=1;startArrow=none;fontSize=11;"
      edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <Array as="points">
          <mxPoint x="92" y="155"/>
          <mxPoint x="283" y="155"/>
        </Array>
      </mxGeometry>
    </mxCell>

    <!-- 1.1: validSearch() SearchForm self-call -->
    <mxCell id="51" value="1.1: validSearch()"
      style="edgeStyle=orthogonalEdgeStyle;endArrow=block;endFill=1;startArrow=none;fontSize=11;"
      edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <Array as="points">
          <mxPoint x="297" y="190"/>
          <mxPoint x="340" y="190"/>
          <mxPoint x="340" y="215"/>
          <mxPoint x="297" y="215"/>
        </Array>
      </mxGeometry>
    </mxCell>

    <!-- 1.2: SearchItems(itemName) SearchForm -> ItemDatabase -->
    <mxCell id="52" value="1.2: SearchItems(itemName)"
      style="edgeStyle=orthogonalEdgeStyle;endArrow=block;endFill=1;startArrow=none;fontSize=11;"
      edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <Array as="points">
          <mxPoint x="297" y="240"/>
          <mxPoint x="708" y="240"/>
        </Array>
      </mxGeometry>
    </mxCell>

    <!-- 1.2.1: listResults() ItemDatabase -> ResultList -->
    <mxCell id="53" value="1.2.1: listResults()"
      style="edgeStyle=orthogonalEdgeStyle;endArrow=block;endFill=1;startArrow=none;fontSize=11;"
      edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <Array as="points">
          <mxPoint x="722" y="265"/>
          <mxPoint x="903" y="265"/>
        </Array>
      </mxGeometry>
    </mxCell>

    <!-- 1.2.1.1: displayResults() ResultList -> SearchResults (return dashed) -->
    <mxCell id="54" value="1.2.1.1: displayResults()"
      style="edgeStyle=orthogonalEdgeStyle;endArrow=open;endFill=0;dashed=1;startArrow=none;fontSize=11;"
      edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <Array as="points">
          <mxPoint x="903" y="300"/>
          <mxPoint x="510" y="300"/>
        </Array>
      </mxGeometry>
    </mxCell>

    <!-- 1.3: displayError() SearchForm -> Customer (else branch) -->
    <mxCell id="55" value="1.3: displayError()"
      style="edgeStyle=orthogonalEdgeStyle;endArrow=block;endFill=1;startArrow=none;fontSize=11;"
      edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <Array as="points">
          <mxPoint x="283" y="430"/>
          <mxPoint x="92" y="430"/>
        </Array>
      </mxGeometry>
    </mxCell>

    <!-- Return dashed arrow back to Customer -->
    <mxCell id="56" value=""
      style="edgeStyle=orthogonalEdgeStyle;endArrow=open;endFill=0;dashed=1;startArrow=none;fontSize=11;"
      edge="1" parent="1">
      <mxGeometry relative="1" as="geometry">
        <Array as="points">
          <mxPoint x="283" y="510"/>
          <mxPoint x="92" y="510"/>
        </Array>
      </mxGeometry>
    </mxCell>

  </root>
</mxGraphModel>
```

---

## TYPE 4: Flowchart

### Qué pedirle al usuario
- Lista de pasos y decisiones
- Entradas/salidas y documentos
- Condiciones para ramas

### Checklist Flowchart
- IDs secuenciales sin saltos
- Formas correctas por tipo
- Decisiones con salidas Sí/No
- Spacing mínimo 180px horizontal / 140px vertical
- Aumentar `pageWidth`/`pageHeight` si hay muchos nodos

### Template mínimo Flowchart
```xml
<mxGraphModel page="1" pageWidth="850" pageHeight="1100">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="10" value="Start" style="ellipse;" vertex="1" parent="1">
      <mxGeometry x="300" y="40" width="120" height="50" as="geometry"/>
    </mxCell>
    <mxCell id="11" value="Process" style="rounded=1;" vertex="1" parent="1">
      <mxGeometry x="300" y="140" width="150" height="50" as="geometry"/>
    </mxCell>
    <mxCell id="20" value="" style="endArrow=block;endFill=1;" edge="1" parent="1" source="10" target="11">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>
```

### Reglas de layout
- Flujo principal vertical
- Ramas laterales con separaciones claras
- Usar grilla más grande para separar: `gridSize=20`
- Separación recomendada: 200px entre columnas y 160px entre filas
- Si hay más de 8 nodos, duplicar ancho o alto de página

### Errores comunes
- Decisiones dibujadas como procesos
- Flechas sin etiquetas Sí/No

### Cuándo preguntar
- Falta condición de decisión
- No queda claro el inicio/fin

### Shape reference
| Shape | Style keyword | Use for |
|---|---|---|
| Start / End | `ellipse` | Terminal nodes |
| Process / Action | `rounded=1` | Steps and actions |
| Decision | `rhombus` | Yes/No branches |
| Document | `shape=document` | Reports or output documents |
| Data | `shape=parallelogram` | Input or output data |

### Color palette
| Shape | fillColor | strokeColor |
|---|---|---|
| Start | `#d5e8d4` | `#82b366` |
| Process | `#dae8fc` | `#6c8ebf` |
| Decision | `#fff2cc` | `#d6b656` |
| End | `#f8cecc` | `#b85450` |

### XML template
```xml
<mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>

    <mxCell id="10" value="Start"
      style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;fontSize=13;fontStyle=1;"
      vertex="1" parent="1">
      <mxGeometry x="300" y="40" width="120" height="50" as="geometry"/>
    </mxCell>

    <mxCell id="11" value="Receive Request"
      style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=12;"
      vertex="1" parent="1">
      <mxGeometry x="300" y="140" width="150" height="50" as="geometry"/>
    </mxCell>

    <mxCell id="12" value="Is Valid?"
      style="rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;fontSize=12;"
      vertex="1" parent="1">
      <mxGeometry x="280" y="245" width="190" height="70" as="geometry"/>
    </mxCell>

    <mxCell id="13" value="Process Data"
      style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=12;"
      vertex="1" parent="1">
      <mxGeometry x="300" y="370" width="150" height="50" as="geometry"/>
    </mxCell>

    <mxCell id="14" value="Show Error"
      style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;fontSize=12;"
      vertex="1" parent="1">
      <mxGeometry x="530" y="245" width="130" height="50" as="geometry"/>
    </mxCell>

    <mxCell id="15" value="End"
      style="ellipse;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;fontSize=13;fontStyle=1;"
      vertex="1" parent="1">
      <mxGeometry x="310" y="480" width="120" height="50" as="geometry"/>
    </mxCell>

    <!-- Connections -->
    <mxCell id="20" value="" style="edgeStyle=orthogonalEdgeStyle;endArrow=block;endFill=1;" edge="1" parent="1" source="10" target="11"><mxGeometry relative="1" as="geometry"/></mxCell>
    <mxCell id="21" value="" style="edgeStyle=orthogonalEdgeStyle;endArrow=block;endFill=1;" edge="1" parent="1" source="11" target="12"><mxGeometry relative="1" as="geometry"/></mxCell>
    <mxCell id="22" value="Yes" style="edgeStyle=orthogonalEdgeStyle;endArrow=block;endFill=1;fontSize=11;" edge="1" parent="1" source="12" target="13"><mxGeometry relative="1" as="geometry"/></mxCell>
    <mxCell id="23" value="No" style="edgeStyle=orthogonalEdgeStyle;endArrow=block;endFill=1;fontSize=11;exitX=1;exitY=0.5;" edge="1" parent="1" source="12" target="14"><mxGeometry relative="1" as="geometry"/></mxCell>
    <mxCell id="24" value="" style="edgeStyle=orthogonalEdgeStyle;endArrow=block;endFill=1;" edge="1" parent="1" source="13" target="15"><mxGeometry relative="1" as="geometry"/></mxCell>

  </root>
</mxGraphModel>
```

---

## TYPE 5: Architecture Diagram

### Qué pedirle al usuario
- Componentes/servicios y responsabilidades
- Protocolos o tipos de conexión
- Límites del sistema (externos/internos)

### Checklist Architecture
- IDs secuenciales sin saltos
- Iconografía consistente
- Conexiones etiquetadas
- Spacing mínimo 220px horizontal / 180px vertical
- Aumentar `pageWidth`/`pageHeight` si hay muchos componentes

### Template mínimo Architecture
```xml
<mxGraphModel page="1" pageWidth="1169" pageHeight="827">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="10" value="Frontend" style="rounded=1;" vertex="1" parent="1">
      <mxGeometry x="100" y="200" width="160" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="11" value="API" style="rounded=1;" vertex="1" parent="1">
      <mxGeometry x="360" y="200" width="160" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="20" value="HTTPS" style="endArrow=block;endFill=1;" edge="1" parent="1" source="10" target="11">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>
```

### Reglas de layout
- Frontend a la izquierda, datos a la derecha
- Servicios centrales alineados horizontalmente
- Usar grilla más grande para separar: `gridSize=20`
- Separación recomendada: 220px entre columnas y 180px entre filas
- Si hay más de 6 componentes, duplicar el ancho de página

### Errores comunes
- Conexiones sin protocolo
- Mezclar estilos de shapes

### Cuándo preguntar
- Protocolo no especificado
- Faltan límites del sistema

```xml
<!-- Frontend service -->
<mxCell id="10" value="React Frontend"
  style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=14;fontStyle=1;"
  vertex="1" parent="1">
  <mxGeometry x="100" y="200" width="160" height="60" as="geometry"/>
</mxCell>

<!-- API Gateway -->
<mxCell id="11" value="API Gateway"
  style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;fontSize=14;fontStyle=1;"
  vertex="1" parent="1">
  <mxGeometry x="360" y="200" width="160" height="60" as="geometry"/>
</mxCell>

<!-- Microservice -->
<mxCell id="12" value="Auth Service"
  style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;fontSize=13;"
  vertex="1" parent="1">
  <mxGeometry x="620" y="120" width="140" height="60" as="geometry"/>
</mxCell>

<!-- Database cylinder -->
<mxCell id="13" value="PostgreSQL"
  style="shape=cylinder3;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;fontSize=12;"
  vertex="1" parent="1">
  <mxGeometry x="640" y="300" width="110" height="80" as="geometry"/>
</mxCell>

<!-- Message queue -->
<mxCell id="14" value="RabbitMQ"
  style="shape=mxgraph.cisco.servers.standard_server;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;fontSize=12;"
  vertex="1" parent="1">
  <mxGeometry x="360" y="380" width="80" height="80" as="geometry"/>
</mxCell>

<!-- Connections with labels -->
<mxCell id="20" value="HTTPS"
  style="edgeStyle=orthogonalEdgeStyle;endArrow=block;endFill=1;fontSize=11;"
  edge="1" parent="1" source="10" target="11">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>

<mxCell id="21" value="REST"
  style="edgeStyle=orthogonalEdgeStyle;endArrow=block;endFill=1;fontSize=11;"
  edge="1" parent="1" source="11" target="12">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>

<mxCell id="22" value="SQL"
  style="edgeStyle=orthogonalEdgeStyle;endArrow=block;endFill=1;fontSize=11;"
  edge="1" parent="1" source="12" target="13">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```
