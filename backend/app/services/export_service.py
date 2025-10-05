"""
Serviço de exportação de dados (CSV, JSON, PDF)
"""
import json
import csv
import io
from typing import Dict
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors


def export_to_csv(data: Dict, filename: str) -> str:
    """Exportar dados para CSV"""
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow(['Variable', 'Latitude', 'Longitude', 'Value'])
    
    # Data
    for variable, points in data.items():
        if isinstance(points, list):
            for point in points:
                writer.writerow([
                    variable.upper(),
                    point.get('lat', ''),
                    point.get('lon', ''),
                    point.get('value', '')
                ])
    
    return output.getvalue()


def export_to_json(data: Dict, filename: str) -> str:
    """Exportar dados para JSON"""
    return json.dumps(data, indent=2, ensure_ascii=False)


def export_to_pdf(data: Dict, filename: str) -> bytes:
    """
    Exportar dados para PDF profissional
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#FF8C00'),
        spaceAfter=30,
    )
    
    # Título
    title = Paragraph("SOLARIS - Relatório de Análise Climática", title_style)
    elements.append(title)
    elements.append(Spacer(1, 0.3 * inch))
    
    # Informações gerais
    info = Paragraph(
        "<b>Análise de Ilhas de Calor Urbanas</b><br/>"
        "Dados processados via Google Earth Engine<br/>"
        "Plataforma SOLARIS v1.0",
        styles['Normal']
    )
    elements.append(info)
    elements.append(Spacer(1, 0.5 * inch))
    
    # Tabela de variáveis
    if data:
        for variable, points in data.items():
            if isinstance(points, list) and len(points) > 0:
                # Título da variável
                var_title = Paragraph(f"<b>{variable.upper()}</b>", styles['Heading2'])
                elements.append(var_title)
                elements.append(Spacer(1, 0.2 * inch))
                
                # Estatísticas
                values = [p['value'] for p in points if 'value' in p]
                if values:
                    import numpy as np
                    stats_data = [
                        ['Métrica', 'Valor'],
                        ['Mínimo', f"{np.min(values):.2f}"],
                        ['Máximo', f"{np.max(values):.2f}"],
                        ['Média', f"{np.mean(values):.2f}"],
                        ['Mediana', f"{np.median(values):.2f}"],
                        ['Desvio Padrão', f"{np.std(values):.2f}"],
                    ]
                    
                    stats_table = Table(stats_data)
                    stats_table.setStyle(TableStyle([
                        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#FF8C00')),
                        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                        ('FONTSIZE', (0, 0), (-1, 0), 12),
                        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                        ('GRID', (0, 0), (-1, -1), 1, colors.black)
                    ]))
                    
                    elements.append(stats_table)
                    elements.append(Spacer(1, 0.5 * inch))
    
    # Footer
    footer = Paragraph(
        "<i>Gerado pela Plataforma SOLARIS - Tornando visível o calor invisível</i>",
        styles['Italic']
    )
    elements.append(Spacer(1, 0.5 * inch))
    elements.append(footer)
    
    # Build PDF
    doc.build(elements)
    
    pdf = buffer.getvalue()
    buffer.close()
    return pdf

